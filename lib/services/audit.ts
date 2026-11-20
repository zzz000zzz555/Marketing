// lib/services/audit.ts — Registro de auditoría inmutable
import { prisma } from "../prisma";

export type AuditAction =
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_DELETED"
  | "ORDER_STATUS_CHANGED"
  | "POLICY_UPDATED"
  | "SETTINGS_UPDATED"
  | "USER_ROLE_CHANGED"
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED";

export async function logAudit(params: {
  userId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: params.userId ?? null,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId ?? null,
      oldValue: params.oldValue ? JSON.parse(JSON.stringify(params.oldValue)) : undefined,
      newValue: params.newValue ? JSON.parse(JSON.stringify(params.newValue)) : undefined,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
    },
  });
}