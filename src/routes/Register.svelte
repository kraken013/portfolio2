<script lang="ts">
    import { push } from 'svelte-spa-router';
    import { registerStore } from '../lib/stores/RegisterStore';
    import { onDestroy } from 'svelte';

  
    let email = '';
    let password = '';
    let confirmPassword = '';
  
    let isLoading = false;
    let error: string | null = null;
    let successMessage: string | null = null;
  
    const unsubscribe = registerStore.subscribe(state => {
      isLoading = state.isLoading;
      error = state.error;
      successMessage = state.successMessage;
    });
  
    async function handleRegister() {
      if (password !== confirmPassword) {
        error = 'Passwords do not match.';
        return;
      }
  
      await registerStore.register(email, password);
  
      if (!error && successMessage) {
        setTimeout(() => {
          registerStore.resetState();
          push('/login');
        }, 3000); // Redirect to login after 3 seconds
      }
    }
  
    // Cleanup subscription on component destroy
    onDestroy(() => {
      unsubscribe();
    });
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="mb-6 text-2xl font-bold text-center">Register</h2>
  
      {#if error}
        <div class="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      {/if}
  
      {#if successMessage}
        <div class="px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
          {successMessage}
        </div>
      {/if}
  
      <form on:submit|preventDefault={handleRegister} class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
  
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
  
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            bind:value={confirmPassword}
            class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
  
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  </div>
  