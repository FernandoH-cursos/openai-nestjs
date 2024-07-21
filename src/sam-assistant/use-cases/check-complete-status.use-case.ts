import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;

  //* 'runs.retrieve()' es una función de la API de OpenAI que permite obtener el estado de un 'run' en un thread.
  //* Permite obtener el estado de un 'run' en un thread para saber si ha sido completado o no el proceso de respuesta.
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  if (runStatus.status === 'completed') {
    return runStatus;
  }

  //* Se espera un segundo antes de volver a comprobar el estado del 'run' para que no se haga un número excesivo de peticiones.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  //* Si el 'run' no ha sido completado, se vuelve a llamar a la función 'checkCompleteStatusUseCase' para volver a comprobar el estado
  //* de manera recursiva hasta que el 'run' sea completado.
  return await checkCompleteStatusUseCase(openai, options);
};
