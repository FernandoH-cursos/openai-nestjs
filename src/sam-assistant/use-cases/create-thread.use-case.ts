import OpenAI from 'openai';

export const createThreadUseCase = async (openai: OpenAI) => {
  //* Un thread es una conversación entre el usuario y el modelo de lenguaje de OpenAI.
  //* Para que funcione el asistente de SAM, primero se debe crear un thread porque es donde se almacenan las conversaciones.
  const { id } = await openai.beta.threads.create();

  return { id };
};
