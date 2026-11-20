// lib/rbac.ts — Control de acceso basado en roles
import { getSession, requireRole, type SessionPayload } from "./auth";

export type Permission =
  | "products:read"
  | "products:write"
  | "orders:read"
  | "orders:write"
  | "users:read"
  | "users:write"
  | "audit:read"
  | "settings:write"
  | "policies:write";

const ROLE_PERMISSIONS: Record<SessionPayload["role"], Permission[]> = {
  CUSTOMER: ["products:read", "orders:read"],
  ADMIN: ["products:read", "products:write", "orders:read", "orders:write", "users:read", "audit:read"],
  SUPERADMIN: ["products:read", "products:write", "orders:read", "orders:write", "users:read", "users:write", "audit:read", "settings:write", "policies:write"],
};

export async function getAuthContext(): Promise<{ session: SessionPayload | null; permissions: Permission[] }> {
  const session = await getSession();
  if (!session) return { session: null, permissions: [] };
  return { session, permissions: ROLE_PERMISSIONS[session.role] ?? [] };
}

export function hasPermission(permissions: Permission[], required: Permission): boolean {
  return permissions.includes(required);
}

export async function requireAuth(required: Permission): Promise<{ session: SessionPayload; ok: boolean }> {
  const { session, permissions } = await getAuthContext();
  if (!session || !hasPermission(permissions, required)) {
    return { session: session!, ok: false };
  }
  return { session: session!, ok: true };
}