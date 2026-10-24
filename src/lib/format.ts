import type Decimal from "decimal.js";

/** Valor em ETH com no mínimo 2 casas e sem cortar as casas extras (26.83, 0.016, 26.846). */
export function formatEth(value: Decimal) {
  return value.toFixed(Math.max(2, value.decimalPlaces()));
}
