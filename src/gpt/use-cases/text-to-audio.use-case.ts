import * as path from 'path';
import * as fs from 'fs';

import OpenAI from 'openai';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openai: OpenAI,
  { prompt, voice }: Options,
) => {
  const voices = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer',
  };

  const selectedVoice = voices[voice] || 'nova';
  //* Guarda el archivo de audio en la carpeta generated/audios
  const folderPath = path.resolve(__dirname, `../../../generated/audios/`);
  //* Se crea un nombre único para el archivo de audio mp3 en base a la fecha actual en milisegundos.
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);
  //* Se crea el archivo de audio en la carpeta generated/audios
  fs.mkdirSync(folderPath, { recursive: true });

  //* El model 'tts-1' es el modelo de texto a voz de OpenAI.
  //* 'voice' es la voz que se le va a pasar al modelo.
  //* 'input' es el texto que se le va a pasar al modelo para que genere un audio.
  //* 'response_format' es el formato de la respuesta que se le va a pedir al modelo. En este caso, se le está pidiendo un archivo mp3.
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  //* Convierte el audio a un buffer para poder guardarlo en un archivo.
  //* Un buffer es un arreglo de bytes que se utiliza para almacenar datos binarios. Es útil para almacenar datos de archivos,
  //* imágenes, audio, etc. En este caso, se está utilizando para almacenar el audio en formato mp3.
  //* arrayBuffer() es un método que convierte el audio a un buffer. Este método es asíncrono, por lo que se utiliza
  //* 'await' para esperar a que se complete.
  const buffer = Buffer.from(await mp3.arrayBuffer());
  //* Se guarda el archivo de audio en la carpeta generated/audios
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
};
