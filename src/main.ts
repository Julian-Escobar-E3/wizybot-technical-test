import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const config = new DocumentBuilder()
    .setTitle('Wizybot Technical Test - Chatbot API')
    .setDescription(
      'API for a chatbot with product search and currency conversion',
    )
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, swaggerDocument);

  const PORT = process.env.SERVER_PORT ?? 3000;
  await app.listen(PORT);
  logger.debug(`Server is running on http://localhost:${PORT}/api/`);
}
bootstrap();
