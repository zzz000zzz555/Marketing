# NÓRDICO STUDIO — Arquitectura Objetivo (Fase 1)

## Stack
- **Frontend/Backend:** Next.js 15 (App Router + TypeScript)
- **ORM:** Prisma
- **Base de datos:** PostgreSQL (Supabase / RDS)
- **Auth:** Auth.js (NextAuth) o Supabase Auth + MFA para admins
- **Pagos:** Culqi / Niubiz / Mercado Pago (tokenización en cliente)
- **Facturación:** Servicio desacoplado `BillingService` (OSE/PSE: Nubefact/Facturalo)
- **Estilos:** Tailwind CSS
- **Despliegue:** Vercel (frontend) + Supabase (DB/Auth) o VPS con Docker

## Estructura de carpetas

```text
nordico-studio/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx                      # Home
│   │   ├── categoria/[slug]/page.tsx     # Listado por categoría (SSG/ISR)
│   │   ├── producto/[slug]/page.tsx      # Detalle de producto (SSR + JSON-LD)
│   │   ├── carrito/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── cuenta/
│   │   │   ├── page.tsx
│   │   │   ├── pedidos/page.tsx
│   │   │   └── favoritos/page.tsx
│   │   ├── legal/
│   │   │   ├── terminos-y-condiciones/page.tsx
│   │   │   ├── politica-de-privacidad/page.tsx
│   │   │   └── politica-de-cambios-y-devoluciones/page.tsx
│   │   ├── libro-de-reclamaciones/page.tsx
│   │   └── privacidad/derechos-arco/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── registro/page.tsx
│   ├── admin/
│   │   ├── layout.tsx                    # Middleware RBAC (servidor)
│   │   ├── page.tsx                      # Dashboard
│   │   ├── productos/page.tsx
│   │   ├── pedidos/page.tsx
│   │   ├── usuarios/page.tsx
│   │   ├── contenido/page.tsx
│   │   ├── auditoria/page.tsx
│   │   └── configuracion/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/route.ts
│   │   ├── cart/route.ts
│   │   ├── checkout/route.ts
│   │   ├── orders/route.ts
│   │   ├── payments/webhook/route.ts
│   │   ├── admin/
│   │   │   ├── products/route.ts
│   │   │   ├── orders/route.ts
│   │   │   └── audit-logs/route.ts
│   │   ├── legal/libro-reclamaciones/route.ts
│   │   └── billing/issue/route.ts
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                               # Botones, inputs, modales (shadcn/ui)
│   ├── shop/                             # ProductCard, CartDrawer, Filters
│   ├── admin/                            # Tablas, formularios admin
│   └── legal/                            # CookieBanner, ARCOForm
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── rbac.ts
│   ├── validators/                       # Zod schemas
│   ├── services/
│   │   ├── pricing.ts                    # Cálculo IGV/envío en servidor
│   │   ├── inventory.ts
│   │   ├── payments.ts
│   │   ├── billing.ts                    # Facturación electrónica
│   │   ├── email.ts
│   │   └── audit.ts
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
├── middleware.ts                         # Auth + RBAC + headers
├── next.config.ts
├── .env.example
└── package.json
```

## Principios
- Todo cálculo de negocio (precios, IGV 18%, envío gratis > S/ 250, stock) ocurre en servidor.
- Panel admin nunca se envía al cliente no autenticado (middleware en servidor).
- Auditoría inmutable para cambios sensibles.
- URLs indexables, SEO técnico y accesibilidad WCAG 2.2 AA.
- Cumplimiento legal Perú: INDECOPI, Ley 29733, SUNAT.