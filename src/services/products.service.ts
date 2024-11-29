import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';
import { IProduct } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  /**
   * Searches for products matching the query in the products list CSV file.
   *
   * @param query - The search term to match against product titles.
   * @returns An array of matching products, limited to 2 results.
   */
  async searchProducts(query: string): Promise<IProduct[]> {
    const products: IProduct[] = [];
    const filePath = process.env.PRODUCTS_LIST_PATH;

    if (!filePath) throw new InternalServerErrorException('File Not Found');

    try {
      const fileStream = fs.createReadStream(path.resolve(filePath)); //? Resolve file path.

      //? Return the product search results in a Promise.
      return new Promise<IProduct[]>((resolve, reject) => {
        fileStream
          .pipe(csv())
          .on('data', (data) => {
            //? Check if displayTitle exists and matches the query case-insensitively.
            if (
              data.displayTitle &&
              data.displayTitle.toLowerCase().includes(query.toLowerCase())
            ) {
              products.push(data);
            }
          })
          .on('end', () => {
            //? If no products were found, throw a NotFoundException.
            if (products.length === 0) {
              reject(
                new NotFoundException(
                  'No products found matching the search query.',
                ),
              );
            } else {
              //? Return only the first 2 products that match the query.
              resolve(products.slice(0, 2));
            }
          })
          .on('error', (err) => {
            //? Handle errors during the file reading process with an InternalServerErrorException.
            reject(
              new InternalServerErrorException(
                `Error reading file: ${err.message}`,
              ),
            );
          });
      });
    } catch (error) {
      //TODO: implements error handle service
      //? General error handling for any unexpected issues.
      throw new InternalServerErrorException(
        `Unexpected error occurred: ${error.message}`,
      );
    }
  }
}
