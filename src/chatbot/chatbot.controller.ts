import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotRequestDto } from './dto/chatbot-request.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly _chatbotService: ChatbotService) {}
  @Post()
  @ApiOperation({ summary: 'Chatbot Interaction' })
  @ApiBody({
    description: 'Chatbot request payload',
    type: ChatbotRequestDto,
    examples: {
      example: {
        value: { query: 'What is the price of the watch in Euros?' },
        summary: 'Request',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response from the chatbot',
    example: {
      value: {
        response:
          'The price of the Apple Watch Series 8 GPS is currently between 350.0 - 365.0 USD. You can check out more details and purchase it [here](https://wizybot-demo-store.myshopify.com/products/apple-watch-series-8-gps).',
      },
      summary: 'Response containing phone options',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async handleUserQuery(@Body() request: ChatbotRequestDto) {
    return await this._chatbotService.processUserQuery(request.query);
  }
}
