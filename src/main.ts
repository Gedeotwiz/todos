
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('API/V1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

   app.enableCors({
    origin: [
      'http://localhost:3000', 
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

 
  const config = new DocumentBuilder()
    .setTitle('Todos API')
    .setDescription('Tdos application API in NestJS')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Todos API Documentation',
  });
   
  await app.listen(3000); 
  const url = "http://localhost:3000/api"
  console.log(`Swagger UI is running on ${url}`)
}

bootstrap();
