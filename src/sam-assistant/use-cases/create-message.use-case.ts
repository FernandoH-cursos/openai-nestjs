import OpenAI from 'openai';

interface Options {
  threadId: string;
  question: string;
}

export const createMessageUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, question } = options;

  //* Crea un mensaje en el thread, con el rol de usuario y el contenido de la pregunt. Crear un mensaje nos sirve para
  //* enviar una pregunta al asistente.
  const message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question,
  });

  return message;
};
