import { writable } from 'svelte/store';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

function createAuthStore() {
  const { subscribe, set } = writable<AuthUser | null>(null);

  // Écouter les changements d'authentification
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      set({
        uid: session.user.id,
        email: session.user.email,
        isAdmin: !!adminData
      });
    } else {
      set(null);
    }
  });

  return {
    subscribe,
    
    async signIn(email: string, password: string) {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (user) {
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!adminData) {
          await supabase.auth.signOut();
          throw new Error('Unauthorized: Admin access only');
        }
      }
    },

    async signOut() {
      await supabase.auth.signOut();
    }
  };
}

export const authStore = createAuthStore();