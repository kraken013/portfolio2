<script lang="ts">
  import type { Project } from '../lib/stores/ProjectStore';
  import Carousel from 'svelte-carousel';
  import { onMount } from 'svelte';

  export let project: Project;
  let isHovered = false;
</script>

<div 
  class="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-scale-in"
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
>
  <img
    src={project.localLogo || project.logo}
    alt={`Logo ${project.title}`}
    class="w-full h-48 object-cover transition-transform duration-300"
    class:scale-105={isHovered}
  />
  
  <div class="p-6">
    <h3 class="text-xl font-bold mb-2">{project.title}</h3>
    <p class="text-gray-600 mb-4">{project.description}</p>
    
    <div class="mb-4">
      <Carousel
        autoplay
        autoplayDuration={5000}
        pauseOnFocus
      >
        {#each (project.localImages || project.images) as image}
          <div class="carousel-item">
            <img 
              src={image} 
              alt="" 
              class="w-full h-64 object-cover transition-all duration-300 hover:scale-105" 
            />
          </div>
        {/each}
      </Carousel>
    </div>
    
    <div class="flex flex-wrap gap-2">
      {#each project.technologies as tech}
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm transform transition-all duration-300 hover:scale-110 hover:bg-blue-200">
          {tech}
        </span>
      {/each}
    </div>
  </div>
</div>