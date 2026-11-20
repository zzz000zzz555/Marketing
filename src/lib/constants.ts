/**
 * Reglas de negocio y datos legales.
 * Se leen de variables de entorno del servidor: nunca de localStorage ni de
 * un estado del navegador. El cliente recibe solo totales ya calculados.
 */
export const BUSINESS = {
  currency: "PEN",
  igvRate: Number(process.env.IGV_RATE ?? 0.18),
  freeShippingThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD ?? 250),
  defaultShippingCost: Number(process.env.DEFAULT_SHIPPING_COST ?? 15),
  lowStockThreshold: Number(process.env.LOW_STOCK_THRESHOLD ?? 5),
  orderNumberPrefix: process.env.ORDER_NUMBER_PREFIX ?? "ND",
  complaintCodePrefix: process.env.COMPLAINT_CODE_PREFIX ?? "LR",
  warrantyMonths: 12,
  returnWindowDays: 30,
} as const;

export const LEGAL = {
  razonSocial: process.env.SUNAT_RAZON_SOCIAL ?? "RAZÓN SOCIAL S.A.C.",
  ruc: process.env.SUNAT_RUC ?? "20XXXXXXXXX",
  domicilioFiscal:
    process.env.SUNAT_DOMICILIO_FISCAL ?? "Dirección completa, Lima, Perú",
  complaintEmail: process.env.COMPLAINT_COPY_EMAIL ?? "reclamos@nordico.pe",
  country: "PE",
} as const;

export const SEASON_KEYS = [
  "default",
  "navidad",
  "anio-nuevo",
  "fiestas-patrias",
  "cyber",
  "san-valentin",
] as const;
