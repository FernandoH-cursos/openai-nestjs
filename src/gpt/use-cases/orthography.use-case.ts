import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const ortographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  //* El rol 'system' es para que el modelo sepa que es un mensaje del sistema. Así el modelo sabe que el mensaje que le
  //* sigue es del usuario.
  //* El rol 'user' es para que el modelo sepa que es un mensaje del usuario.

  //* 'max_tokens' es la cantidad de tokens que se le va a pasar al modelo.
  //* Los tokens son las palabras que se le pasan al modelo para que genere una respuesta.

  //* 'temperature' es un valor entre 0 y 2 que se le pasa al modelo para que genere una respuesta más creativa. Si el valor es 0, el
  //* modelo va a generar respuestas más predecibles. Si el valor es 2, el modelo va a generar respuestas más creativas.

  //* 'response_format' es el formato de la respuesta que se le va a pedir al modelo. En este caso, se le está pidiendo un objeto JSON.
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
          Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
          Debes de responder en formato JSON, 
          tu tarea es corregirlos y retornar información soluciones, 
          también debes de dar un porcentaje de acierto por el usuario,
          
          Si no hay errores, debes de retornar un mensaje de felicitaciones.

          Ejemplo de salida:
          {
            userScore: number,
            errors: string[], // ['error -> solución']
            message: string, //  Usa emojis y texto para felicitar al usuario
          }
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 150,
    response_format: {
      type: 'json_object',
    },
  });
  const jsonResp = JSON.parse(completion.choices[0].message.content);
  // console.log(completion);

  return jsonResp;
};
