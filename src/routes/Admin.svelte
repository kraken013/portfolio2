<script lang="ts">
  import { onMount } from 'svelte';
  import { projectStore } from '../lib/stores/ProjectStore';
  import { statsStore } from '../lib/stores/StatsStore';
  import StatsOverview from '../components/stats/StatsOverview.svelte';
  import VisitorsChart from '../components/stats/VisitorsChart.svelte';
  import RecentVisits from '../components/stats/RecentVisits.svelte';
  import ContentEditor from '../components/admin/ContentEditor.svelte';
  
  let activeTab = 'stats';
  let title = '';
  let description = '';
  let logo: File | null = null;
  let images: File[] = [];
  let technologies: string[] = [];
  let currentTech = '';
  let isLoading = false;
  let error = '';

  onMount(() => {
    projectStore.loadProjects();
    statsStore.loadStats();
  });

  async function handleSubmit() {
    if (!logo) {
      error = 'Please select a logo';
      return;
    }

    if (images.length === 0) {
      error = 'Please add at least one image';
      return;
    }

    isLoading = true;
    error = '';

    try {
      await projectStore.addProject({
        title,
        description,
        logo,
        images,
        technologies
      });
      
      // Reset form
      title = '';
      description = '';
      logo = null;
      images = [];
      technologies = [];
      error = '';
    } catch (e) {
      error = 'Error adding project. Please try again.';
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  function handleLogoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      logo = input.files[0];
    }
  }

  function handleImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      images = [...images, ...Array.from(input.files)];
    }
  }

  function addTech() {
    if (currentTech) {
      technologies = [...technologies, currentTech];
      currentTech = '';
    }
  }

  function removeImage(index: number) {
    images = images.filter((_, i) => i !== index);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8">Dashboard Admin</h1>

  <!-- Navigation Tabs -->
  <div class="mb-8 border-b">
    <nav class="flex space-x-8">
      <button
        class={`py-4 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'stats'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
        on:click={() => activeTab = 'stats'}
      >
        Statistiques
      </button>
      <button
        class={`py-4 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'projects'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
        on:click={() => activeTab = 'projects'}
      >
        Projets
      </button>
      <button
        class={`py-4 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'content'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
        on:click={() => activeTab = 'content'}
      >
        Contenu
      </button>
    </nav>
  </div>

  <!-- Statistics Tab -->
  {#if activeTab === 'stats'}
    <div class="mb-12">
      {#if $statsStore}
        <StatsOverview 
          totalVisits={$statsStore.totalVisits}
          todayVisits={$statsStore.dailyStats[$statsStore.dailyStats.length - 1]?.views || 0}
          popularPages={$statsStore.popularPages}
        />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitorsChart dailyStats={$statsStore.dailyStats} />
          <RecentVisits recentVisits={$statsStore.recentVisits} />
        </div>
      {/if}
    </div>
  {/if}

  <!-- Projects Tab -->
  {#if activeTab === 'projects'}
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">Gestion des Projets</h2>
      
      {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="title">Titre</label>
          <input
            id="title"
            type="text"
            bind:value={title}
            class="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="description">Description</label>
          <textarea
            id="description"
            bind:value={description}
            class="w-full px-3 py-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="logo">Logo</label>
          <input
            id="logo"
            type="file"
            accept="image/*"
            on:change={handleLogoChange}
            class="w-full"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            on:change={handleImagesChange}
            class="w-full mb-2"
          />
          <div class="grid grid-cols-2 gap-2">
            {#each images as image, i}
              <div class="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  class="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  on:click={() => removeImage(i)}
                >
                  ×
                </button>
              </div>
            {/each}
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Technologies</label>
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={currentTech}
              class="flex-1 px-3 py-2 border rounded"
              placeholder="Nom de la technologie"
            />
            <button
              type="button"
              on:click={addTech}
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            {#each technologies as tech}
              <div class="bg-gray-100 px-3 py-1 rounded flex items-center gap-2">
                <span>{tech}</span>
                <button
                  type="button"
                  on:click={() => technologies = technologies.filter(t => t !== tech)}
                  class="text-red-500"
                >
                  ×
                </button>
              </div>
            {/each}
          </div>
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter le projet'}
        </button>
      </form>

      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Projets existants</h2>
        <div class="space-y-4">
          {#each $projectStore as project}
            <div class="bg-white p-4 rounded-lg shadow">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-xl font-semibold">{project.title}</h3>
                  <p class="text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  on:click={() => projectStore.deleteProject(project.id)}
                  class="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Content Tab -->
  {#if activeTab === 'content'}
    <ContentEditor />
  {/if}
</div>