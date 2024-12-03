<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { authStore } from '../lib/stores/AuthStore';
  import { onMount } from 'svelte';

  let isScrolled = false;

  function handleScroll() {
    isScrolled = window.scrollY > 0;
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  async function handleLogout() {
    await authStore.signOut();
  }
</script>

<nav class="fixed flex text-base shadow bg-stone-100" >
  <div class="container px-4 mx-auto" style="width: 80%;" class:full-width={isScrolled}>
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <a href="/" use:link class="text-base text-gray-800 titre ">Sofiane Flici</a>
      </div>
      
      <div class="flex items-center space-x-4 text-sm">
        <a href="/" use:link class="text-gray-600 hover:text-gray-900">Accueil</a>
        <a href="/projects" use:link class="text-gray-600 hover:text-gray-900">Projets</a>
        <a href="/experience" use:link class="text-gray-600 hover:text-gray-900">Mon Parcours</a>
        {#if $authStore?.isAdmin}
          <a href="/admin" use:link class="text-gray-600 hover:text-gray-900">Admin</a>
          <button 
            on:click={handleLogout}
            class="text-gray-600 hover:text-gray-900"
          >
            Déconnexion
          </button>
        {/if}
      </div>
    </div>
  </div>
</nav>

<style>
  .titre{
    font-family: 'Lobster', cursive;
  }
  nav {
    font-family: 'Inter', sans-serif;
    position: relative;
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;    
  }

  .container.full-width {
    width: 100%;
  }
</style>
