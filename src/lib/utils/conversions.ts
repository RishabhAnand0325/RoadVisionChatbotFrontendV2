export const getCurrencyTextFromNumber = (number: number): string => {
  return number.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
}
