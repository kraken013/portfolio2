import { writable } from "svelte/store";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  uid: string;
  email: string;
  isAdmin: boolean;
}

function createAuthStore() {
  const { subscribe, set } = writable<AuthUser | null>(null);

  // Écouter les changements d'authentification
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      try {
        const { data: adminData, error } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la vérification de l'admin:", error);
          set(null); // Réinitialiser si une erreur se produit
          return;
        }

        set({
          uid: session.user.id,
          email: session.user.email || "Email inconnu", // Valeur par défaut en cas de undefined
          isAdmin: !!adminData,
        });
      } catch (error) {
        console.error("Erreur inattendue lors de l'authentification:", error);
        set(null);
      }
    } else {
      set(null);
    }
  });

  return {
    subscribe,

    async signIn(email: string, password: string) {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!adminData) {
          await supabase.auth.signOut();
          throw new Error("Unauthorized: Admin access only");
        }
      }
    },

    async signOut() {
      await supabase.auth.signOut();
    },
  };
}

export const authStore = createAuthStore();
