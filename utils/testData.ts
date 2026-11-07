import usersData from '../test-data/users.json';
import { testConfig } from '../config/test.config';

export const testData = {
  users: testConfig.users,
  checkoutData: usersData.checkoutData,
  products: usersData.products,
  messages: usersData.messages,

  /**
   * Parse currency string to number (e.g. "$29.99" -> 29.99)
   */
  parsePrice(priceString: string): number {
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
  },

  /**
   * Format number as currency string with 2 decimal places (e.g. 29.99 -> "$29.99")
   */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  },
};
