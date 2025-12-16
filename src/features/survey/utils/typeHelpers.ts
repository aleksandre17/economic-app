/**
 * Ensures T has EXACTLY the keys in K
 */
export type ExactKeys<T, K extends keyof any> = T & Record<Exclude<K, keyof T>, never>;