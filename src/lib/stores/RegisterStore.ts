import { writable } from "svelte/store";
import { supabase } from "../supabase";

export interface RegistrationState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

function createRegisterStore() {
  const { subscribe, set, update } = writable<RegistrationState>({
    isLoading: false,
    error: null,
    successMessage: null,
  });

  return {
    subscribe,

    async register(email: string, password: string) {
      update((state) => ({
        ...state,
        isLoading: true,
        error: null,
        successMessage: null,
      }));

      try {
        // Create a new user in Supabase
        const { data: user, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        // Optionally, add the user to the `admins` table
        const { error: adminInsertError } = await supabase
          .from("admins")
          .insert([{ user_id: user.user?.id }]);

        if (adminInsertError) throw adminInsertError;

        set({
          isLoading: false,
          error: null,
          successMessage:
            "Registration successful! Please check your email to confirm your account.",
        });
      } catch (error) {
        set({
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Registration failed.",
          successMessage: null,
        });
      }
    },

    resetState() {
      set({ isLoading: false, error: null, successMessage: null });
    },
  };
}

export const registerStore = createRegisterStore();
