<script lang="ts">
  import { onMount } from 'svelte';
  import { projectStore } from '../lib/stores/ProjectStore';
  import { statsStore } from '../lib/stores/StatsStore';
  import { testimonialStore } from '../lib/stores/TestimonialStore';
  import StatsOverview from '../components/stats/StatsOverview.svelte';
  import VisitorsChart from '../components/stats/VisitorsChart.svelte';
  import RecentVisits from '../components/stats/RecentVisits.svelte';
  import ContentEditor from '../components/admin/ContentEditor.svelte';
  
  import { authStore } from '../lib/stores/AuthStore';
  
  let activeTab = 'stats';
  let title = '';
  let description = '';
  let technologies: string[] = [];
  let currentTech = '';
  let isLoading = true;
  let error = '';

  let user;
  $: user = $authStore;

  onMount(async () => {
    projectStore.loadProjects();
    statsStore.loadStats();
    isLoading = true;
    await authStore.init();
    if (!user || !user.isAdmin) {
      window.location.href = '/';
    } else {
      await testimonialStore.loadTestimonials();
      isLoading = false;
    }
  });

   // Fonction pour approuver un témoignage
   async function approveTestimonial(id: string) {
    isLoading = true;
    try {
      await testimonialStore.approveTestimonial(id);
    } catch (e) {
      error = 'Erreur lors de l\'approbation du témoignage';
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  // Fonction pour rejeter un témoignage
  async function rejectTestimonial(id: string) {
    isLoading = true;
    try {
      await testimonialStore.rejectTestimonial(id);
    } catch (e) {
      error = 'Erreur lors du rejet du témoignage';
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  async function deleteTestimonial(id: string) {
  isLoading = true;
  try {
    await testimonialStore.deleteTestimonial(id);
  } catch (e) {
    error = 'Erreur lors de la suppression du témoignage';
    console.error(e);
  } finally {
    isLoading = false;
  }
}

  async function handleSubmit() {

    isLoading = true;
    error = '';

    try {
      await projectStore.addProject({
        title,
        description,
        technologies,
      });
      
      // Reset form
      title = '';
      description = '';
      technologies = [];
      error = '';
    } catch (e) {
      error = 'Error adding project. Please try again.';
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  function addTech() {
    if (currentTech) {
      technologies = [...technologies, currentTech];
      currentTech = '';
    }
  }
</script>

<div class="container px-4 py-8 mx-auto">
  {#if user}
  <h1 class="mb-8 text-4xl font-bold">Dashboard Admin</h1>

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
        activeTab === 'testimonials'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      on:click={() => activeTab = 'testimonials'}
    >
      Témoignages
    </button>
    </nav>
  </div>

  <!-- Statistics Tab -->
  {#if activeTab === 'stats'}
    <div class="mb-12">
      {#if $statsStore}
        <StatsOverview 
          totalVisits={$statsStore.totalVisits}
          uniqueVisitors={$statsStore.uniqueVisitors}
          dailyUniqueVisitors={$statsStore.dailyUniqueVisitors}
          popularPages={$statsStore.popularPages}
        />
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VisitorsChart dailyStats={$statsStore.dailyStats} />
          <RecentVisits recentVisits={$statsStore.recentVisits} />
        </div>
      {/if}
    </div>
  {/if}

  <!-- Projects Tab -->
  {#if activeTab === 'projects'}
    <div class="mb-12">
      <h2 class="mb-6 text-2xl font-bold">Gestion des Projets</h2>
      
      {#if error}
        <div class="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow">
        <div class="mb-4">
          <label class="block mb-2 text-gray-700" for="title">Titre</label>
          <input
            id="title"
            type="text"
            bind:value={title}
            class="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 text-gray-700" for="description">Description</label>
          <textarea
            id="description"
            bind:value={description}
            class="w-full px-3 py-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block mb-2 text-gray-700">Technologies</label>
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
              class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            {#each technologies as tech}
              <div class="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded">
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
          class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Ajout en cours...' : 'Ajouter le projet'}
        </button>
      </form>

      <div class="mt-8">
        <h2 class="mb-4 text-2xl font-bold">Projets existants</h2>
        <div class="space-y-4">
          {#each $projectStore as project}
            <div class="p-4 bg-white rounded-lg shadow">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-semibold">{project.title}</h3>
                  <p class="text-sm text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
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
  {#if activeTab === 'testimonials'}
    <div class="mb-12">
      <h2 class="mb-6 text-2xl font-bold">Gestion des Témoignages</h2>

      {#if error}
        <div class="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      {/if}

      {#if isLoading}
        <p>Chargement des témoignages...</p>
      {/if}

      <div class="space-y-4">
        {#each $testimonialStore as testimonial}
          <div class="p-4 bg-white rounded-lg shadow">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold">{testimonial.name}</h3>
                <p class="text-sm text-gray-500">{testimonial.comment}</p>
                <p class="text-sm text-gray-500">
                  {new Date(testimonial.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                {#if !testimonial.is_approved}
                  <button
                    on:click={() => approveTestimonial(testimonial.id)}
                    class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Approuver
                  </button>
                  <button
                    on:click={() => rejectTestimonial(testimonial.id)}
                    class="px-4 py-2 ml-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Rejeter
                  </button>
                {:else}
                  <span class="px-4 py-2 text-green-500">Approuvé</span>
                {/if}

                 <!-- New delete button -->
          <button
          on:click={() => deleteTestimonial(testimonial.id)}
          class="py-2 text-red-500 rounded hover:text-red-700"
        >
          X
        </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  {:else if isLoading}
    <p>Chargement...</p>
  {:else}
    <p>Vous n'êtes pas autorisé à accéder à cette page. Redirection...</p>
  {/if}
</div>