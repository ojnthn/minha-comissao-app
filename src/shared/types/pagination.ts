/**
 * `next` é `number | null` — usado por produtos/marceneiro.
 * Nunca comparar com `current` pra saber se há próxima página, usar `next === null`.
 */
export interface OffsetPagination {
  current: number;
  next: number | null;
}

/**
 * `next` repete o valor de `current` quando não há próxima página (nunca é `null`).
 * Usado por pedidos. Comparar `next !== current`, nunca `next !== null`.
 */
export interface RepeatingPagination {
  current: number;
  next: number;
  total?: number;
}
