/** Zaokrągla liczbę do zadanej liczby miejsc po przecinku. */
export const roundTo = (value: number, decimals = 0) => {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
