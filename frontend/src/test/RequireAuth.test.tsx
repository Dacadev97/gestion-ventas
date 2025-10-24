import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RequireAuth } from '../routes/RequireAuth';
import { authReducer } from '../features/auth/authSlice';

const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: initialState,
  });
};

describe('RequireAuth', () => {
  it('should redirect to /login if no token', () => {
    const store = createMockStore({ auth: { token: null, user: null, status: 'idle', error: null } });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RequireAuth />
        </BrowserRouter>
      </Provider>
    );
    
    // No debe renderizar el contenido protegido
    expect(screen.queryByText(/Protected content/i)).not.toBeInTheDocument();
  });
});
