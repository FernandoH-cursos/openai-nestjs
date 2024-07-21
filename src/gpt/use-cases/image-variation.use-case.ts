import * as fs from 'fs';

import OpenAI from 'openai';
import { downloadImageAsPng } from '../helpers';

interface Options {
  baseImage: string;
}

export const imageVariarionUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;

  //* Descarga la imagen base en formato PNG, la guarda en el servidor y devuelve el path completo de la imagen
  const pngImagePath = await downloadImageAsPng(baseImage, true);

  //* 'openai.images.createVariation(options)' permite crear una variación de una imagen que se le pase como parámetro. En este caso
  //* se le pasa la imagen base que se descargó anteriormente y se le pide que genere una variación de esa imagen.
  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  //* Guarda la imagen en el servidor y devuelve el path completo de la imagen variada
  const fileName = await downloadImageAsPng(response.data[0].url);

  //* URL de la imagen en el servidor
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAIUrl: response.data[0].url,
    revisedPrompt: response.data[0].revised_prompt,
  };

  return {};
};
