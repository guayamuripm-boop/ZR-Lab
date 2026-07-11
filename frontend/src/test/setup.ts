import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Los tests unitarios nunca deben depender de la red real (no determinista,
// lenta, y golpea el Supabase real). Se mockea el cliente completo: los
// servicios (contentService, progressService) deben caer a su fallback
// local o a un no-op cuando no hay sesión/datos.
vi.mock('../services/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: null, error: { message: 'mocked: sin red en tests' } }),
      }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
    },
  },
}));

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
