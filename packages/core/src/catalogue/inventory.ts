/**
 * Stock history (about 3,500 movements). A separate entry point (@alert/core/inventory)
 * so storefront pages never bundle it; the admin stock screens will.
 */
import { z } from "zod";
import movementsJson from "../../../../seed/data/stock-movements.json";
import { stockMovementSchema } from "./schema";

export const stockMovements = z.array(stockMovementSchema).parse(movementsJson);

export function movementsForSku(sku: string) {
  return stockMovements.filter((m) => m.sku === sku).sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}
