/** Czy kod wykonuje się w środowisku przeglądarki (dostępne `window`). */
export const isBrowser = () => typeof window !== 'undefined'
