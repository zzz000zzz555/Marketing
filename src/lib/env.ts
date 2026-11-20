import { z } from "zod";

/**
 * Validación fail-fast de la configuración del servidor.
 * Ninguna variable privada se expone al cliente: este módulo solo se importa
 * desde Server Components, Route Handlers y scripts de Prisma.
 */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL es obligatoria"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL es obligatoria"),

  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET debe tener al menos 32 caracteres"),
  AUTH_GOOGLE_ID: z.string().min(1, "AUTH_GOOGLE_ID es obligatoria"),
  AUTH_GOOGLE_SECRET: z.string().min(1, "AUTH_GOOGLE_SECRET es obligatoria"),
  MFA_ENCRYPTION_KEY: z
    .string()
    .min(32, "MFA_ENCRYPTION_KEY debe contener 32 bytes en base64"),

  PAYMENT_WEBHOOK_SECRET: z.string().min(1, "PAYMENT_WEBHOOK_SECRET es obligatoria"),
  BILLING_API_TOKEN: z.string().min(1, "BILLING_API_TOKEN es obligatoria"),

  IGV_RATE: z.coerce.number().min(0).max(1).default(0.18),
  FREE_SHIPPING_THRESHOLD: z.coerce.number().positive().default(250),
  DEFAULT_SHIPPING_COST: z.coerce.number().nonnegative().default(15),
  LOW_STOCK_THRESHOLD: z.coerce.number().int().positive().default(5),

  RATE_LIMIT_LOGIN_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_LOGIN_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  AUDIT_LOG_RETENTION_DAYS: z.coerce.number().int().positive().default(2555),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  const detail = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Configuración de entorno inválida:\n${detail}`);
}

export const env = parsed.data;
