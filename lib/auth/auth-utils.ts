import { UserRole } from "@prisma/client";

export function isAdminFromRole(role: UserRole): boolean {
  return role === "admin" || role === "super_admin";
}
