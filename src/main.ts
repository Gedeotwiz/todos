import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as ngrok from 'ngrok';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Todos API')
    .setDescription('Todos application API in NestJS')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    customSiteTitle: 'Todos API Documentation',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const localUrl = `http://localhost:${port}`;
  console.log(`🚀 Swagger UI is running on ${localUrl}`);

  if (process.env.NODE_ENV !== 'production') {
    const ngrokUrl = await ngrok.connect({
      addr: port,
      authtoken: process.env.NGROK_AUTHTOKEN, 
    });
    console.log(`🌍 Public ngrok URL: ${ngrokUrl}`);
    console.log(`📘 Swagger UI via ngrok: ${ngrokUrl}`);
  }
}

bootstrap();
