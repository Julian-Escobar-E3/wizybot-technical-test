import { Module } from '@nestjs/common';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ServicesModule } from './services/services.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ChatbotModule,
    ServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
