// Utilidades mínimas para decodificar un JWT en el cliente sin validación de firma.
// Nota: Esto es solo para lectura de claims y decisiones de UI.

export interface JwtClaims {
  sub?: number | string;
  email?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

const base64UrlDecode = (input: string): string => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = atob(base64);
  try {
    // Manejar caracteres UTF-8
    return decodeURIComponent(
      decoded
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
  } catch {
    return decoded;
  }
};

export const decodeJwt = (token: string): JwtClaims | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload) as JwtClaims;
  } catch {
    return null;
  }
};

export const getRoleFromToken = (token: string | null | undefined): string | null => {
  if (!token) return null;
  const claims = decodeJwt(token);
  return claims?.role ? String(claims.role) : null;
};

export const isTokenExpired = (token: string | null | undefined): boolean => {
  if (!token) return true;
  const claims = decodeJwt(token);
  if (!claims) return true; // token ilegible -> tratar como inválido
  if (!claims.exp) return false; // si no hay exp, no bloqueamos solo por UI
  const now = Math.floor(Date.now() / 1000);
  return claims.exp < now;
};
