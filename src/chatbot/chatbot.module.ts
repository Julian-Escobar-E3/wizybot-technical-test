import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ProductsService } from 'src/services/products.service';
import { CurrencyService } from 'src/services/currency.service';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, ProductsService, CurrencyService],
})
export class ChatbotModule {}
