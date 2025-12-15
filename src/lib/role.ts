// src/constants/roles.ts

export type Role = "system_admin" | "inventory_manager" | "sales_executive" | "user" | "agent_admin";

export const ROLES = {
      SYSTEM_ADMIN: "system_admin" as Role,
  AGENT_ADMIN: "agent_admin" as Role,
  INVENTORY_MANAGER: "inventory_manager" as Role,
  SALES_EXECUTIVE: "sales_executive" as Role,
  USER: "user" as Role,
};

export const ALL_ROLES: Role[] = [
    ROLES.SYSTEM_ADMIN,
    ROLES.AGENT_ADMIN,
    ROLES.INVENTORY_MANAGER,
    ROLES.SALES_EXECUTIVE,
];

export const ROLE_GROUPS = {
    ADMIN_ONLY: [ROLES.SYSTEM_ADMIN , ROLES.AGENT_ADMIN],
    BOOKS_MANAGERS: [ROLES.AGENT_ADMIN, ROLES.INVENTORY_MANAGER],
    QUOTATION_MANAGERS: [ROLES.AGENT_ADMIN, ROLES.SALES_EXECUTIVE],
    ALL: Object.values(ROLES),
};