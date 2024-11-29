import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  /**
   * Converts an amount from one currency to another using the Open Exchange Rates API.
   *
   * @param amount - The amount to convert.
   * @param from - The currency code of the source currency (e.g., 'USD').
   * @param to - The currency code of the target currency (e.g., 'EUR').
   * @returns The converted amount in the target currency.
   * @throws BadRequestException - If the API request fails or if invalid parameters are passed.
   */
  async convertCurrency(
    amount: number,
    from: string,
    to: string,
  ): Promise<number> {
    const baseUrl = process.env.OPEN_EXCHANGE_RATES_API;
    const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID;
    
    //? Validate the presence of required environment variables.
    if (!baseUrl || !appId) {
      throw new BadRequestException('missing keys check environment variables');
    }

    //? Validate the input parameters.
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }
    if (!from || !to) {
      throw new BadRequestException(
        'Both "from" and "to" currency codes must be provided',
      );
    }
    try {
      //? Make the API call to Open Exchange Rates.
      const apiResponse = await axios.get(
        `${baseUrl}/latest.json?app_id=${appId}`,
      );
      const rates = apiResponse.data.rates;

      //? Ensure the currencies exist in the rates data.
      if (!rates[from] || !rates[to]) {
        throw new BadRequestException(
          `Exchange rates for currencies ${from} or ${to} not found`,
        );
      }

      //? Convert the amount.
      const convertedAmount = (amount / rates[from]) * rates[to];
      return convertedAmount;
    } catch (error) {
      //TODO: implements error handle service
      console.error('Currency conversion error >>>', error);
      //?Throw a BadRequestException with a clear error message.
      throw new BadRequestException(
        `Currency conversion failed: ${error.message}`,
      );
    }
  }
}
