import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAI } from 'openai';

import { CurrencyService } from '@services/currency.service';
import { ProductsService } from '@services/products.service';
import { functions } from '@services/utils/functions.util';

@Injectable()
export class ChatbotService {
  private _openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
  private _model = process.env.OPEN_AI_MODEL;

  constructor(
    private readonly _productsService: ProductsService,
    private readonly _currencyService: CurrencyService,
  ) {}

  /**
   * Processes the user's query and returns a message with the result.
   *
   * @param query - The query from the user to be processed.
   * @returns A response object containing the message.
   */
  async processUserQuery(query: string): Promise<{ message: string }> {
    try {
      // Request a response from OpenAI
      const response = await this._openai.chat.completions.create({
        model: this._model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful customer support assistant.',
          },
          { role: 'user', content: query },
        ],
        functions,
      });

      const choice = response.choices[0];
      const functionCall = choice?.message?.function_call;

      //? If a function call is triggered by the model, process it.
      if (functionCall) {
        let finalResponse: string;

        //? Handle searchProducts function.
        if (functionCall?.name === 'searchProducts') {
          const auxFunctionCall = JSON.parse(functionCall.arguments);
          const products = await this._productsService.searchProducts(
            auxFunctionCall.query,
          );
          finalResponse = await this.generateNaturalLanguageResponse(
            query,
            JSON.stringify(products),
          );
        }

        //? Handle convertCurrencies function.
        if (functionCall?.name === 'convertCurrencies') {
          const auxFunctionCall = JSON.parse(functionCall.arguments);
          const result = await this._currencyService.convertCurrency(
            auxFunctionCall.amount,
            auxFunctionCall.from,
            auxFunctionCall.to,
          );
          finalResponse = await this.generateNaturalLanguageResponse(
            query,
            result.toString(),
          );
        }

        return { message: finalResponse };
      }

      //? If no function call is made, return a natural response from OpenAI.
      return {
        message:
          choice?.message?.content || 'I could not process your request.',
      };
    } catch (error) {
      //TODO: implements error handle service
      console.error('Error processing the query:', error);
      //? Catch any unexpected errors and return an internal server error.
      throw new InternalServerErrorException(
        'Error processing the user query.',
      );
    }
  }

  /**
   * Generates a response in natural language based on the function result and user query.
   *
   * @param userQuery - The original user query.
   * @param functionResult - The result from the function (either products or currency conversion).
   * @returns The generated response in natural language.
   */
  private async generateNaturalLanguageResponse(
    userQuery: string,
    functionResult: string,
  ): Promise<string> {
    try {
      //? Request OpenAI to generate a natural language response.
      const response = await this._openai.chat.completions.create({
        model: this._model,
        messages: [
          { role: 'user', content: `Here is the user's query: ${userQuery}` },
          {
            role: 'system',
            content: `Here is the result from the user's request: ${functionResult}. Remember, you are a helpful customer support assistant.`,
          },
        ],
      });

      return (
        response.choices[0].message?.content || 'Unable to generate a response.'
      );
    } catch (error) {
      //TODO: implements error handle service
      console.error('Error generating the response:', error);
      //? Catch any unexpected errors while generating the response
      throw new InternalServerErrorException('Error generating a response.');
    }
  }
}
