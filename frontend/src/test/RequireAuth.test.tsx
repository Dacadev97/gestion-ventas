import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/authSlice';
import { salesReducer } from '../features/sales/salesSlice';
import { usersReducer } from '../features/users/usersSlice';
import { uiReducer } from '../features/ui/uiSlice';
import { captchaReducer } from '../features/captcha/captchaSlice';

// Mock del módulo jwt ANTES de importar RequireAuth
vi.mock('../utils/jwt', () => ({
  isTokenExpired: vi.fn(),
  decodeJwt: vi.fn(),
  getRoleFromToken: vi.fn(),
}));

import { isTokenExpired } from '../utils/jwt';
import { RequireAuth } from '../routes/RequireAuth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      sales: salesReducer,
      users: usersReducer,
      ui: uiReducer,
      captcha: captchaReducer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    preloadedState: initialState,
  });
};

describe('RequireAuth', () => {
  it('should redirect to /login if no token', () => {
    vi.mocked(isTokenExpired).mockReturnValue(true);
    
    const store = createMockStore({
      auth: { token: null, user: null, status: 'idle', error: null },
      sales: { list: [], totalRequestedAmount: 0, totalCount: 0, currentPage: 1, pageSize: 10, selectedSale: null, status: 'idle', error: null },
      users: { list: [], status: 'idle', error: null },
      ui: { snackbar: { open: false, message: '', severity: 'info' } },
      captcha: { captcha: null, status: 'idle', error: null },
    });

    const result = render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RequireAuth />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Debe mostrar la página de login
    expect(result.container.textContent).toContain('Login Page');
  });
});
