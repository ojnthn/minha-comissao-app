/**
 * `next` é `number | null` — usado por produtos/marceneiro/pedidos.
 * Nunca comparar com `current` pra saber se há próxima página, usar `next === null`.
 */
export interface OffsetPagination {
  current: number;
  next: number | null;
}
