/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroServices } from './common/constants/microservice.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Spin up the Microservice instance
  const microserviceInstance = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: MicroServices.NOTIFICATIONS.NAME,
      port: MicroServices.NOTIFICATIONS.PORT,
      retryAttempts: 10
    },
  });

  app.enableCors();

  app.setGlobalPrefix("/api/v1/rt");

  await app.listen(3000);

  // start the microservice instance
  await microserviceInstance.listen();
}
bootstrap();
