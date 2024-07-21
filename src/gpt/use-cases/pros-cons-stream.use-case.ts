import OpenAI from 'openai';

interface Options {
  prompt: string;
}

//* 'stream' se pone en true para que el modelo pueda generar una respuesta en tiempo real, esto es util cuando se necesita
//* una respuesta rapida y no se puede esperar a que el modelo genere toda la respuesta.
export const prosConsDicusserStreamUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  const response = await openai.chat.completions.create({
    stream: true,
    messages: [
      {
        role: 'system',
        content: `
          Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          la respuesta debe de ser en formato markdown,
          los pros y contras deben de estar en una lista,
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4o',
    temperature: 0.8,
    max_tokens: 500,
  });

  return response;
};
