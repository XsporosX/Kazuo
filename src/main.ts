import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CategoriesSeed } from './modules/category/categories.seed';
import * as bodyParser from 'body-parser';

require('dotenv').config();

async function bootstrap() {
  console.log('Current working directory:', process.cwd());
  const app = await NestFactory.create(AppModule);
  //app.use(bodyParser.raw({ type: 'application/json' }));

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const categoriesSeed = app.get(CategoriesSeed);
  await categoriesSeed.seed();

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Kazuo')
    .setDescription('Proyecto Integrador')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const PORT = parseInt(process.env.PORT);

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
}
bootstrap();



