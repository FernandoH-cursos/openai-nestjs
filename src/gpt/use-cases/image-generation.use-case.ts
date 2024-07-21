import * as fs from 'fs';

import OpenAI from 'openai';

import { downloadBase64ImageAsPng, downloadImageAsPng } from '../helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  //? Verificar si se envió una imagen original y una máscara de esa imagen
  if (!originalImage || !maskImage) {
    //* 'prompt' es el texto que se le pasa al modelo para que pueda generar una imagen en base a ese texto. Es utilizado para poder
    //* obtener una imagen más precisa.

    //* 'model': 'dall-e-3' es el modelo de openai que se usa para generar imágenes, hay otros modelos que se pueden usar para generar
    //* pero este es más recomendado para generar imágenes porque es más preciso.

    //* 'n': 1 es la cantidad de imágenes que se va a generar. Dalle-3 solo puede generar una imagen a la vez.
    //* 'size': '1024x1024' es el tamaño de la imagen que se va a generar. En este caso es de 1024x1024 pixeles.
    //* 'quality': 'standard' es la calidad de la imagen que se va a generar. También se puede usar 'hd' que es una calidad más alta.
    //* 'response_format': 'url' es el formato de la respuesta que se va a obtener. 'url' es un formato que devuelve la URL de la imagen.
    const response = await openai.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    //* Guarda la imagen en el servidor y devuelve el nombre de la imagen generada
    const fileName = await downloadImageAsPng(response.data[0].url);
    //* URL de la imagen en el servidor
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url,
      openAIUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    };
  }

  //* Convertir la imagen original pasada a formato PNG, guarda en el servidor y devuelve el path completo de la imagen
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  //* Convertir la máscara de la imagen en base64 a formato PNG, guarda en el servidor y devuelve el path completo de la imagen
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  //* 'image' es la imagen original que se va a editar.
  //* 'mask' es la máscara de la imagen que se va a editar. La máscara es una imagen que nos sirve para indicarle al modelo que partes
  //* de la imagen original queremos editar.

  //* 'fs.createReadStream(path)' permite leer un archivo y convertirlo en un stream de lectura para poder pasarlo como parámetro a la API.
  //* Un stream es una secuencia de datos que se pueden leer o escribir de forma asíncrona. Es util para leer archivos grandes sin tener
  //* que cargar todo el archivo en memoria.
  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  //* Guarda la imagen en el servidor y devuelve el nombre de la imagen generada
  const fileName = await downloadImageAsPng(response.data[0].url);
  //* URL de la imagen en el servidor
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAIUrl: response.data[0].url,
    revisedPrompt: response.data[0].revised_prompt,
  };
};
