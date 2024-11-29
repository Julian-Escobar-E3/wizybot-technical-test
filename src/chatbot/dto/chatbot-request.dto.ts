import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChatbotRequestDto {
  @ApiProperty({
    description: 'User query message for the chatbot',
    example: 'What is the price of the watch in Euros?',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  query: string;
}
