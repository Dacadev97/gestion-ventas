import { describe, it, expect } from 'vitest';
import { decodeJwt, getRoleFromToken, isTokenExpired } from '../utils/jwt';
import { RoleName } from '../types';

// Helper para crear un token JWT de prueba
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockToken = (payload: any): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.mockSignature`;
};

describe('JWT Utils', () => {
  describe('decodeJwt', () => {
    it('should decode a valid JWT token', () => {
      const payload = { sub: '1', email: 'test@test.com', role: 'Administrador', exp: 1234567890 };
      const token = createMockToken(payload);
      
      const decoded = decodeJwt(token);
      
      expect(decoded).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      const decoded = decodeJwt('invalid.token');
      
      expect(decoded).toBeNull();
    });

    it('should return null for malformed token', () => {
      const decoded = decodeJwt('not-a-jwt-token');
      
      expect(decoded).toBeNull();
    });
  });

  describe('getRoleFromToken', () => {
    it('should return role from valid token', () => {
      const payload = { sub: '1', email: 'test@test.com', role: RoleName.ADMIN, exp: 1234567890 };
      const token = createMockToken(payload);
      
      const role = getRoleFromToken(token);
      
      expect(role).toBe(RoleName.ADMIN);
    });

    it('should return null for token without role', () => {
      const payload = { sub: '1', email: 'test@test.com', exp: 1234567890 };
      const token = createMockToken(payload);
      
      const role = getRoleFromToken(token);
      
      expect(role).toBeNull();
    });

    it('should return null for invalid token', () => {
      const role = getRoleFromToken('invalid-token');
      
      expect(role).toBeNull();
    });

    it('should return null for null token', () => {
      const role = getRoleFromToken(null);
      
      expect(role).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // -1 hora
      const payload = { sub: '1', email: 'test@test.com', role: 'Administrador', exp: pastTimestamp };
      const token = createMockToken(payload);
      
      const expired = isTokenExpired(token);
      
      expect(expired).toBe(true);
    });

    it('should return false for valid token', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // +1 hora
      const payload = { sub: '1', email: 'test@test.com', role: 'Administrador', exp: futureTimestamp };
      const token = createMockToken(payload);
      
      const expired = isTokenExpired(token);
      
      expect(expired).toBe(false);
    });

    it('should return true for token without exp', () => {
      const payload = { sub: '1', email: 'test@test.com', role: 'Administrador' };
      const token = createMockToken(payload);
      
      const expired = isTokenExpired(token);
      
      expect(expired).toBe(true);
    });

    it('should return true for invalid token', () => {
      const expired = isTokenExpired('invalid-token');
      
      expect(expired).toBe(true);
    });
  });
});
