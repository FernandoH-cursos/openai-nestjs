import * as fs from 'fs';

import OpenAI from 'openai';

//* Doc de lo que se puede pasar en el prompt de openai para convertir audio a texto:
//* https://platform.openai.com/docs/guides/speech-to-text/prompting
interface Options {
  prompt: string;
  audioFile: Express.Multer.File;
}

//* El modelo de openai para convertir audio a texto solo permite como maximo un archivo de audio de hasta 25MB
export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  // console.log({ prompt, audioFile });

  //* 'model': 'whisper-1' es el modelo de openai que se usa para convertir audio a texto.

  //* 'file' es el archivo de audio que se va a convertir a texto. fs.createReadStream() se usa para poder leer el archivo de audio
  //* como un stream y no cargar todo el archivo en memoria. Un stream es una secuencia de datos que se pueden leer o escribir.

  //* 'prompt' es el texto que se le pasa al modelo para que pueda convertir el audio a texto en base a ese texto. Es utilizado para
  //* poder obtener un texto más preciso.

  //* 'language' es el idioma del audio que se va a convertir a texto. En este caso es español.

  //* 'response_format' es el formato de la respuesta que se va a obtener. 'verbose_json' es un formato JSON que contiene más información
  //* sobre la transcripción del audio a texto.
  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    // Debe ser el mismo idioma del audio
    prompt,
    language: 'es',
    // 'vvt' o 'srt' también son opciones
    response_format: 'verbose_json',
  });

  // console.log(response);

  return response;
};
