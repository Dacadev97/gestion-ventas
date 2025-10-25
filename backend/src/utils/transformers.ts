import type { Role } from "../entities/Role";

export const decimalTransformer = {
  to: (value: number | null | undefined) => (value ?? null),
  from: (value: string | null) => (value === null ? null : Number(value)),
};

export const roleTransformer = {
  to: (value: Role) => value,
  from: (value: Role) => (value ? value.name : null),
};
