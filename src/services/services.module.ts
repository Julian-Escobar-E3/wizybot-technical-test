import { Global, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CurrencyService } from './currency.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ProductsService, CurrencyService],
  exports: [ProductsService, CurrencyService],
})
export class ServicesModule {}
