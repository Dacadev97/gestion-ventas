export const decimalTransformer = {
  to: (value: number | null | undefined) => (value ?? null),
  from: (value: string | null) => (value === null ? null : Number(value)),
};
