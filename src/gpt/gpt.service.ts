import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';

import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariarionUseCase,
  ortographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dto';

import OpenAI from 'openai';

//* En los servicios se llaman los casos de uso
@Injectable()
export class GptService {
  //* Se crea una instancia de OpenAI pasando la API KEY para poder usar la API
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await ortographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translate({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt,
      lang,
    });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt,
      voice,
    });
  }

  async textToAudioGetter(fileId: string) {
    //* Obteniendo path del audio que se obtiene del fileId
    const folderPath = path.resolve(
      __dirname,
      `../../generated/audios/`,
      `${fileId}.mp3`,
    );

    //* Verificando si el archivo existe
    const wasFound = fs.existsSync(folderPath);
    //* Si no se encuentra el archivo se lanza una excepción de tipo NotFoundException
    if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return folderPath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;
    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, imageGenerationDto);
  }

  getGeneratedImage(fileName: string) {
    //* Obteniendo path de la imagen que se obtiene del filename
    const filePath = path.resolve('./', `./generated/images/`, fileName);

    //* Verificando si el archivo existe
    const existsFile = fs.existsSync(filePath);
    //* Si no se encuentra el archivo se lanza una excepción de tipo NotFoundException
    if (!existsFile) throw new NotFoundException(`File ${fileName} not found`);

    return filePath;
  }

  async imageVariation({ baseImage }: ImageVariationDto) {
    return await imageVariarionUseCase(this.openai, { baseImage });
  }
}
