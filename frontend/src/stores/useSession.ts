import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';

export interface Profile {
  id: string;
  display_name: string;
  avatar_key: string;
  role: 'student' | 'instructor' | 'admin';
  cohort_id: string | null;
}

interface SessionState {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
  isGuest: boolean;

  init: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
  recoverPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  continueAsGuest: () => void;
  refreshProfile: () => Promise<void>;
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_key, role, cohort_id')
      .eq('id', userId)
      .maybeSingle();
    return (data as Profile) ?? null;
  } catch {
    return null;
  }
}

export const useSession = create<SessionState>((set, get) => ({
  userId: null,
  profile: null,
  loading: true,
  isGuest: false,

  init: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id ?? null;
      const profile = userId ? await fetchProfile(userId) : null;
      set({ userId, profile, loading: false });
    } catch {
      set({ userId: null, profile: null, loading: false });
    }
  },

  signUp: async (email, password, displayName) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) return { ok: false, error: error.message };
      await get().init();
      return { ok: true };
    } catch {
      return { ok: false, error: 'No se pudo crear la cuenta. Intenta de nuevo.' };
    }
  },

  signIn: async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };
      await get().init();
      return { ok: true };
    } catch {
      return { ok: false, error: 'No se pudo iniciar sesión. Intenta de nuevo.' };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    set({ userId: null, profile: null, isGuest: false });
  },

  recoverPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch {
      return { ok: false, error: 'No se pudo enviar el correo de recuperación.' };
    }
  },

  continueAsGuest: () => set({ isGuest: true }),

  refreshProfile: async () => {
    const { userId } = get();
    if (userId) set({ profile: await fetchProfile(userId) });
  },
}));
