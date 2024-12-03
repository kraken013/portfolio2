import { writable } from "svelte/store";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  uid: string;
  email: string;
  isAdmin: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthUser | null>(null);

  return {
    subscribe,

    async init() {
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        await this.checkAndSetUser(session.data.session.user);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await this.checkAndSetUser(session.user);
        } else {
          set(null);
        }
      });
    },

    async checkAndSetUser(user: User) {
      try {
        const { data: adminData, error } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Admin check error:", error);
          set(null);
          return;
        }

        set({
          uid: user.id,
          email: user.email || "Email inconnu",
          isAdmin: !!adminData,
        });
      } catch (error) {
        console.error("Unexpected authentication error:", error);
        set(null);
      }
    },

    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (!adminData) {
          await supabase.auth.signOut();
          throw new Error("Unauthorized: Admin access only");
        }
      }
    },

    async signOut() {
      try {
        console.log("Tentative de déconnexion");
        await supabase.auth.signOut();
        set(null); // Efface l'état de l'utilisateur dans le store
        console.log("Déconnexion réussie");
      } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
      }
    },
  };
}

export const authStore = createAuthStore();

authStore.init();

export const isAuthenticated = writable(false);

authStore.subscribe((user) => {
  isAuthenticated.set(!!user);
});
