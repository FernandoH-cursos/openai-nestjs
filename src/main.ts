import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors();

  //* Permite poder leer los datos que se envían en el body de las peticiones.
  //* Se le pasa un límite de 10mb para poder leer imágenes grandes.
  app.use(bodyParser.json({ limit: '10mb' }));
  //* Permitir leer datos que se envían en formato urlencoded. Se le pasa un límite de 10mb para poder leer imágenes grandes.
  //* 'extended: true' permite que se puedan enviar objetos y arrays en el body de las peticiones.
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(3000);
}
bootstrap();
