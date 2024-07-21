import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = 'asst_haI2XU7mLf1C5sxVX39392MY' } = options;

  //* Crea un nuevo 'run' en un thread con un asistente. Un 'run' es una instancia de un asistente en un thread que se
  //* ejecuta para responder a un mensaje.
  //* 'assistant_id' es el ID del asistente que se utilizará para responder a los mensajes en este 'run'.
  //* 'instructions' es una lista de instrucciones que se utilizarán para responder a los mensajes en este 'run'.
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions: // OJO! Sobre-escribe el asistente
  });

  return run;
};
