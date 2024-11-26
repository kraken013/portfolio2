<script lang="ts">
  import { onMount } from 'svelte';
  import { projectStore } from '../lib/stores/ProjectStore';
  import ProjectCard from '../components/ProjectCard.svelte';

  onMount(() => {
    projectStore.loadProjects();
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8">Mes Projets</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each $projectStore as project}
      <ProjectCard {project} />
    {/each}
  </div>
</div>