import OpenAI from 'openai';

interface Options {
  prompt: string;
}

//* 'max_tokens' cuando tiene un valor mas alto, el modelo puede generar mas texto en la respuesta pero puede ser menos coherente,
//* al poner 500 se obtiene una respuesta mas larga pero menos coherente y al poner 100 se obtiene una respuesta mas corta per8
//* mas coherente.
export const prosConsDicusserUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  const response = await openai.chat.completions.create({
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

  return response.choices[0].message;
};
