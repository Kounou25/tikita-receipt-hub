import { getCookie } from "@/lib/cookies";

// Get currency rate from cookies
export const getCurrencyRate = (): number => {
  try {
    const currencyData = getCookie("currency_rate");
    if (currencyData) {
      const parsed = JSON.parse(currencyData);
      return parsed.rate || 1;
    }
  } catch (e) {
    console.error("Error parsing currency rate:", e);
  }
  return 1;
};

// Get currency symbol from cookies
export const getCurrencySymbol = (): string => {
  try {
    const selectedCurrency = getCookie("selected_currency");
    if (selectedCurrency) {
      return selectedCurrency;
    }
    
    const currencyData = getCookie("currency_rate");
    if (currencyData) {
      const parsed = JSON.parse(currencyData);
      return parsed.currency || "FCFA";
    }
  } catch (e) {
    console.error("Error parsing currency:", e);
  }
  return "FCFA";
};

// Get locale based on currency
export const getLocaleForCurrency = (currency: string): string => {
  const currencyLocaleMap: Record<string, string> = {
    'USD': 'en-US',
    'EUR': 'fr-FR',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'CNY': 'zh-CN',
    'CAD': 'en-CA',
    'AUD': 'en-AU',
    'CHF': 'de-CH',
    'INR': 'en-IN',
    'FCFA': 'fr-FR',
    'XOF': 'fr-FR',
    'XAF': 'fr-FR',
  };
  return currencyLocaleMap[currency] || 'fr-FR';
};

// Format amount with proper currency and locale
export const formatCurrency = (value: number, currencySymbol?: string, rate?: number): string => {
  const currency = currencySymbol || getCurrencySymbol();
  const conversionRate = rate || getCurrencyRate();
  
  if (!value || isNaN(value)) {
    return new Intl.NumberFormat(getLocaleForCurrency(currency), {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(0);
  }

  const converted = value / conversionRate;
  
  try {
    return new Intl.NumberFormat(getLocaleForCurrency(currency), {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
  } catch (error) {
    // Fallback if currency is not supported by Intl
    console.warn(`Currency ${currency} not supported, using fallback format`);
    return `${converted.toLocaleString(getLocaleForCurrency(currency), { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    })} ${currency}`;
  }
};

// Convert string amount (with FCFA or other text) to formatted currency
export const convertStringAmount = (value: string, currencySymbol?: string, rate?: number): string => {
  const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
  if (isNaN(numericValue)) return value;
  return formatCurrency(numericValue, currencySymbol, rate);
};
