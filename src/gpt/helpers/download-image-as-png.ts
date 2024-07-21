import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

import { InternalServerErrorException } from '@nestjs/common';

export const downloadImageAsPng = async (
  url: string,
  isFullPath: boolean = false,
) => {
  //* Hace una petición GET a la URL de la imagen para descargarla
  const response = await fetch(url);
  if (!response.ok) {
    throw new InternalServerErrorException('Download image was not possible');
  }

  //* Path de directorio donde se guardará la imagen
  const folderPath = path.resolve('./', './generated/images/');
  //* Crear directorio si no existe de forma recursiva
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}.png`;
  const fullPath = path.resolve(folderPath, imageNamePng);

  //* 'buffer' es el contenido de la imagen descargada en formato Buffer que es un tipo de dato que se
  //* puede escribir en un archivo de forma binaria (como una imagen, audio, etc.)
  const buffer = Buffer.from(await response.arrayBuffer());

  // Escribe el contenido como un buffer en un archivo en el path especificado
  // fs.writeFileSync(fullPath, buffer);

  //* Convierte y guarda la imagen a formato PNG y asegura que tenga un canal alpha en el path especificado
  //* ensureAlpha() agrega un canal alpha a la imagen si no lo tiene, significa que si la imagen
  //* no tiene transparencia, se le agrega un canal alpha que permite tener transparencia.
  await sharp(buffer).png().ensureAlpha().toFile(fullPath);

  //* Devuelve el path de la imagen guardada o el nombre de la imagen guardada
  return isFullPath ? fullPath : imageNamePng;
};

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  isFullPath: boolean = false,
) => {
  //* Guarda lo que está después de ';base64,' de la imagen en base64
  base64Image = base64Image.split(';base64,').pop();
  //* Convierte la imagen en base64 a un Buffer con el formato base64
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;
  const fullPath = path.join(folderPath, imageNamePng);

  //* Transformar a RGBA, png (Así lo espera OpenAI)
  await sharp(imageBuffer).png().ensureAlpha().toFile(fullPath);

  return isFullPath ? fullPath : imageNamePng;
};
