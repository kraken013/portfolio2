<script lang="ts">
  import { onMount } from 'svelte';
  import { projectStore } from '../lib/stores/ProjectStore';
  import ProjectCard from '../components/ProjectCard.svelte';

  let hoveredProject:any = null;

  onMount(() => {
    projectStore.loadProjects();
  });

  function showDescription(project:any) {
    hoveredProject = project;
  }

  function hideDescription() {
    hoveredProject = null;
  }
</script>

<div class="container px-4 py-8 mx-auto">
  <h1 class="mb-8 text-2xl font-bold">Mes Projets</h1>
  
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#each $projectStore as project}
      <div 
        class="relative group"
        on:mouseenter={() => showDescription(project)} 
        on:mouseleave={hideDescription}
      >
        <ProjectCard {project} />
        
        
        {#if hoveredProject === project}
          <div class="absolute left-0 z-50 p-4 mt-2 text-sm text-white bg-gray-800 rounded shadow-lg">
            {project.description}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
