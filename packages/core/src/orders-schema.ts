/**
 * Validation for checkout input and stored orders (server side: carries Zod).
 */
import { z } from "zod";
import { bagLineSchema } from "./bag";
import { SA_PROVINCES } from "./orders";

const phone = z
  .string()
  .transform((s) => s.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^(\+27|0)[1-8]\d{8}$/, "Enter a South African phone number, e.g. 082 123 4567"));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  phone,
  email: z.union([z.email("Enter a valid email").max(120), z.literal("")]).optional(),
});

export const addressSchema = z.object({
  street: z.string().trim().min(3, "Enter a street address").max(100),
  suburb: z.string().trim().min(2, "Enter a suburb").max(60),
  city: z.string().trim().min(2, "Enter a city or town").max(60),
  province: z.enum(SA_PROVINCES, "Choose a province"),
  postalCode: z.string().trim().regex(/^\d{4}$/, "Postal codes have 4 digits"),
});

export const checkoutSchema = z
  .object({
    method: z.enum(["courier", "collect"]),
    payment: z.enum(["card", "eft"]),
    contact: contactSchema,
    address: addressSchema.optional(),
  })
  .refine((v) => v.method === "collect" || v.address, { message: "Enter a delivery address", path: ["address"] });

export const appCheckoutSchema = z.object({
  details: checkoutSchema,
  lines: z.array(bagLineSchema).min(1).max(60),
});

const iso = z.iso.datetime();

export const storedOrderSchema = z.object({
  id: z.string().regex(/^AS-\d{6}$/),
  channel: z.enum(["web", "app"]),
  placedAt: iso,
  method: z.enum(["courier", "collect"]),
  payment: z.enum(["card", "eft"]),
  contact: z.object({ name: z.string(), phone: z.string(), email: z.string().optional() }),
  address: addressSchema.optional(),
  lines: z.array(
    z.object({
      slug: z.string(),
      option: z.string().optional(),
      optionLabel: z.string().optional(),
      name: z.string(),
      qty: z.number().int().positive(),
      unitPriceCents: z.number().int().nonnegative(),
    }),
  ),
  subtotalCents: z.number().int().nonnegative(),
  deliveryCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative(),
  paidAt: iso.optional(),
  failedAt: iso.optional(),
  cancelledAt: iso.optional(),
  advances: z.array(iso).max(10),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

/** First error message per field, keyed like "contact.phone". */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
