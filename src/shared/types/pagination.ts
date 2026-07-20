/**
 * `next` é `number | null` — usado por produtos e comissao-porcentagem.
 * Nunca comparar com `current` pra saber se há próxima página, usar `next === null`.
 */
export interface OffsetPagination {
  current: number;
  next: number | null;
}

/**
 * `next` repete `current` quando não há próxima página (nunca é `null`) —
 * usado por /pedidos e /marceneiro. Comparar `next !== current`, nunca
 * `next !== null`.
 */
export interface RepeatingPagination {
  current: number;
  next: number;
}
