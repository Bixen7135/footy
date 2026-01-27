// Money utilities - all money values are stored as cents (integers) to avoid float precision errors
// Backend sends dollars as floats, we convert to cents on the frontend

export type MoneyAmount = number; // Always represents cents as integer

/**
 * Convert dollars (float) to cents (integer)
 * @param dollars - Amount in dollars (e.g., 19.99)
 * @returns Amount in cents (e.g., 1999)
 */
export function dollarsToCents(dollars: number): MoneyAmount {
  return Math.round(dollars * 100);
}

/**
 * Convert cents (integer) to dollars (float)
 * @param cents - Amount in cents (e.g., 1999)
 * @returns Amount in dollars (e.g., 19.99)
 */
export function centsToDollars(cents: MoneyAmount): number {
  return cents / 100;
}

/**
 * Format money amount as currency string
 * @param cents - Amount in cents
 * @param locale - Locale for formatting (default: 'en-US')
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string (e.g., "$19.99")
 */
export function formatMoney(
  cents: MoneyAmount,
  locale = 'en-US',
  currency = 'USD'
): string {
  const dollars = centsToDollars(cents);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(dollars);
}

/**
 * Parse money string to cents
 * @param dollarString - String like "$19.99" or "19.99"
 * @returns Amount in cents (e.g., 1999)
 */
export function parseMoney(dollarString: string): MoneyAmount {
  const cleaned = dollarString.replace(/[^0-9.]/g, '');
  const dollars = parseFloat(cleaned) || 0;
  return dollarsToCents(dollars);
}

/**
 * Recursively convert money fields from dollars to cents in API responses
 * Identifies money fields by common naming patterns
 */
export function convertMoneyFieldsToCents(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(convertMoneyFieldsToCents);
  }

  if (typeof data === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Money field patterns: price, total, cost, subtotal, tax, etc.
      if (
        typeof value === 'number' &&
        (key.includes('price') ||
          key.includes('total') ||
          key.includes('cost') ||
          key.includes('tax') ||
          key === 'subtotal')
      ) {
        converted[key] = dollarsToCents(value);
      } else if (typeof value === 'object') {
        converted[key] = convertMoneyFieldsToCents(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }

  return data;
}

/**
 * Recursively convert money fields from cents to dollars for API requests
 * Used when sending data to backend (e.g., admin price updates)
 */
export function convertMoneyFieldsToDollars(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(convertMoneyFieldsToDollars);
  }

  if (typeof data === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (
        typeof value === 'number' &&
        (key.includes('price') ||
          key.includes('total') ||
          key.includes('cost') ||
          key.includes('tax') ||
          key === 'subtotal')
      ) {
        converted[key] = centsToDollars(value);
      } else if (typeof value === 'object') {
        converted[key] = convertMoneyFieldsToDollars(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }

  return data;
}
