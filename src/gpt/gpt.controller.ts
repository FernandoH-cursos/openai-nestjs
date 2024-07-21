import { Response } from 'express';

import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dto';

import { diskStorage } from 'multer';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    //* Se crea un stream para poder obtener una respuesta en tiempo real
    const stream =
      await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    //* Se establece el header de la respuesta como un JSON y el status como OK(200)
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    //* Es fundamental usar un 'for await' para poder obtener la respuesta en tiempo real y no esperar a que se genere toda la respuesta
    //* ya que esto puede tardar mucho tiempo.
    for await (const chunk of stream) {
      //* Se obtiene el contenido de la respuesta
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);

      //* Se escribe el contenido en la respuesta del servidor
      res.write(piece);
    }

    //* Se cierra la respuesta del servidor
    res.end();
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    //* Se obtiene el path del archivo de audio en base al fileId
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    //* Se obtiene el path del archivo de audio
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    //* Se establece el header de la respuesta como un audio/mp3 y el status como OK(200)
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    //* Se envía el archivo de audio como respuesta
    res.sendFile(filePath);
  }

  //* @UseInterceptors(FileInterceptor('file')) se usa para poder subir un archivo al servidor y poder acceder a él en el controlador.
  //* En este caso se sube un archivo de audio y se convierte a texto.

  //* @UploadedFile() se usa para obtener el archivo subido al servidor. En este caso se obtiene el archivo de audio subido.
  //* @ParseFilePipe() se usa para validar el archivo subido al servidor. En este caso se valida que el archivo sea de tipo
  //* audio y que no sea mayor a 5MB.
  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;

          return cb(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5MB',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:filename')
  async getGeneratedImage(
    @Res() res: Response,
    @Param('filename') fileName: string,
  ) {
    //* Se obtiene el path del archivo de imagen en base al filename
    const filePath = this.gptService.getGeneratedImage(fileName);

    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return this.gptService.imageVariation(imageVariationDto);
  }
}
