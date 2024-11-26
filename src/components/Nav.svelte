<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { authStore } from '../lib/stores/AuthStore';

  async function handleLogout() {
    await authStore.signOut();
  }
</script>

<nav class="bg-white shadow">
  <div class="container mx-auto px-4">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <a href="/" use:link class="text-xl font-bold text-gray-800">Portfolio</a>
      </div>
      
      <div class="flex items-center space-x-4">
        <a href="/" use:link class="text-gray-600 hover:text-gray-900">Accueil</a>
        <a href="/projects" use:link class="text-gray-600 hover:text-gray-900">Projets</a>
        {#if $authStore?.isAdmin}
          <a href="/admin" use:link class="text-gray-600 hover:text-gray-900">Admin</a>
          <button 
            on:click={handleLogout}
            class="text-gray-600 hover:text-gray-900"
          >
            Déconnexion
          </button>
        {:else}
          <a href="/login" use:link class="text-gray-600 hover:text-gray-900">Login</a>
        {/if}
      </div>
    </div>
  </div>
</nav>