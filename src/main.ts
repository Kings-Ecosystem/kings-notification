/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroServices } from './common/constants/microservice.constants';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceInstance = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
        host: process.env.MICROSERVICE_HOST || '0.0.0.0',
      port: MicroServices.NOTIFICATIONS.PORT,
      retryAttempts: 10
    },
  });

  app.enableCors();

  app.setGlobalPrefix("/api/v1/rt", {
    exclude: [
      { path: 'healthz', method: RequestMethod.GET },
      { path: 'readyz', method: RequestMethod.GET },
    ],
  });

  app.enableShutdownHooks();
  await app.listen(3000);
  await microserviceInstance.listen();
}
bootstrap();
