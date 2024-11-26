<script lang="ts">
  import { contentStore, type HomeContent } from '../../lib/stores/ContentStore';
  import { onMount } from 'svelte';

  let content: HomeContent;
  let isLoading = false;
  let error = '';
  let success = '';

  onMount(async () => {
    await contentStore.loadContent();
    contentStore.subscribe(value => {
      content = { ...value };
    });
  });

  async function handleSubmit() {
    isLoading = true;
    error = '';
    success = '';

    try {
      await contentStore.updateContent(content);
      success = 'Contenu mis à jour avec succès';
    } catch (e) {
      error = 'Erreur lors de la mise à jour';
      console.error(e);
    } finally {
      isLoading = false;
      setTimeout(() => {
        success = '';
        error = '';
      }, 3000);
    }
  }

  function addSocialLink() {
    content.socials = [
      ...content.socials,
      { name: '', icon: '', url: '', color: '' }
    ];
  }

  function removeSocialLink(index: number) {
    content.socials = content.socials.filter((_, i) => i !== index);
  }
</script>

<div class="bg-white rounded-lg shadow-lg p-6">
  <h2 class="text-2xl font-bold mb-6">Édition du Contenu</h2>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {success}
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <!-- Hero Section -->
    <div class="border-b pb-6">
      <h3 class="text-lg font-semibold mb-4">Section Hero</h3>
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            bind:value={content.hero.title}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sous-titre</label>
          <input
            type="text"
            bind:value={content.hero.subtitle}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="border-b pb-6">
      <h3 class="text-lg font-semibold mb-4">Section À Propos</h3>
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            bind:value={content.about.title}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            bind:value={content.about.description}
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Années d'expérience</label>
          <input
            type="number"
            bind:value={content.about.experience}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="border-b pb-6">
      <h3 class="text-lg font-semibold mb-4">Section Contact</h3>
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            bind:value={content.contact.title}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            bind:value={content.contact.description}
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Social Links -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Liens Sociaux</h3>
        <button
          type="button"
          on:click={addSocialLink}
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ajouter un lien
        </button>
      </div>
      
      <div class="space-y-4">
        {#each content.socials as social, index}
          <div class="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-2 gap-4 flex-1">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  bind:value={social.name}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Icône</label>
                <input
                  type="text"
                  bind:value={social.icon}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  bind:value={social.url}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Couleur</label>
                <input
                  type="text"
                  bind:value={social.color}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
            <button
              type="button"
              on:click={() => removeSocialLink(index)}
              class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        {/each}
      </div>
    </div>

    <button
      type="submit"
      class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? 'Mise à jour...' : 'Enregistrer les modifications'}
    </button>
  </form>
</div>