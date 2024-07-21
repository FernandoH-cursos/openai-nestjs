# Ejercicios Prácticos de NestJS + OpenAI API
Backend de nestJS que utiliza la API de OpenAI utilizando distintos modelos artificial para
crear una _API_ con distintos casos de uso para usar en nuestras aplicaciones.


## Temas a tratar:
- ### Entender que es un rol de sistema y de usuario en _OpenAI_.
- ### Entender que son los tokens, la temperatura y tipo de formato de respuesta de _OpenAI_.
- #### Creación de _OpenAI Stream_ usando _For await_ y _Chunks_.
- #### Caso de uso para traducir texto al idioma que indiquemos usando modelo de _GPT4_.
- #### Caso de uso generar audios a partir de un _prompt_ de texto en diferentes formatos usando modelo de _TTS-1_.
- #### Almacenar audios generados a partir de un texnto en el FileSystem del backend de _Nest_.
- #### Creación de endpoint para obtener audios previamente generados.
- #### Caso de uso para generar una transcripción de texto a partir de un archivo de audio en el idioma que queramos usando modelo de _WHISPER-1_.
- #### Crear el archivo de audio a transcribir en el FileSystem del backend de _Nest_.
- #### Caso de uso para generación de imágenes basados en prompts usando modelo _DALL-E-3_.
- #### Caso de uso para editar partes de la imagen basado en su mascara e imagen orignal usando  modelo _DALL-E-2_.
- #### Caso de uso para generar variaciones de una imagen previa usando  modelo _DALL-E-2_.

___

- #### Creación de módulo de asistente personalizado usando distintos casos de uso del asistente que creemos en _OpenAI API_:
  - #### Caso de uso para creación de mensajes.
  - #### Caso de uso para ceación de _threads._
  - #### Caso de uso para ceación de Ejecución (_Run_).
  - #### Caso de uso para obtener listado de mensajes.
  - #### Caso de uso para revisar estado de la ejecución y filtrar mensajes.