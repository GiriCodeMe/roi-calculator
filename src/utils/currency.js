export const CURRENCIES = [
  { code: 'USD', symbol: '$',  locale: 'en-US' },
  { code: 'EUR', symbol: '€',  locale: 'de-DE' },
  { code: 'RUB', symbol: '₽',  locale: 'ru-RU' },
]

export function formatCurrency(value, currencyCode) {
  const entry = CURRENCIES.find(c => c.code === currencyCode) ?? CURRENCIES[0]
  return new Intl.NumberFormat(entry.locale, {
    style: 'currency',
    currency: entry.code,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function getCurrencySymbol(currencyCode) {
  return (CURRENCIES.find(c => c.code === currencyCode) ?? CURRENCIES[0]).symbol
}
