export const functions = [
  {
    name: 'searchProducts',
    description: 'Search for products based on a query',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
      },
      required: ['query'],
    },
  },
  {
    name: 'convertCurrencies',
    description: 'Convert an amount from one currency to another',
    parameters: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        from: { type: 'string' },
        to: { type: 'string' },
      },
      required: ['amount', 'from', 'to'],
    },
  },
];
