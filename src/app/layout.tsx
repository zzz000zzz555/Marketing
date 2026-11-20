import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "NÓRDICO — Tecnología y esenciales para todos los días",
    template: "%s | NÓRDICO",
  },
  description:
    "NÓRDICO STUDIO: diseño minimalista, calidad duradera y envío gratis en pedidos mayores a S/ 250.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" data-mode="light" data-season="default">
      <body>{children}</body>
    </html>
  );
}
