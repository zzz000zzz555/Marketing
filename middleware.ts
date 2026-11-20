// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting en memoria (usar Redis/Upstash en producción)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

const PUBLIC_PATHS = ["/", "/categoria", "/producto", "/login", "/registro", "/terminos-y-condiciones", "/politica-de-privacidad", "/politica-de-cambios-y-devoluciones", "/libro-de-reclamaciones", "/privacidad/derechos-arco"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limiting en endpoints sensibles
  if (pathname.startsWith("/api/auth/login") || pathname.startsWith("/api/auth/register")) {
    if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Demasiados intentos. Intenta más tarde." }, { status: 429 });
    }
  }
  if (pathname.startsWith("/api/checkout")) {
    if (!rateLimit(`checkout:${ip}`, 10, 60 * 1000)) {
      return NextResponse.json({ error: "Demasiadas solicitudes." }, { status: 429 });
    }
  }

  // Protección de rutas admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const sessionToken = request.cookies.get("session")?.value;
    if (!sessionToken) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url));
    }
    // Validación de rol se hace en servidor (API) con la sesión decodificada
  }

  // Headers de seguridad adicionales
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};