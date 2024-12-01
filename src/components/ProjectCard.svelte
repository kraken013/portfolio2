<script lang="ts">
  import type { Project } from '../lib/stores/ProjectStore';
  import Carousel from 'svelte-carousel'; // @ts-ignore

  export let project: Project;
  let isHovered = false;
  let isModalOpen = false;
  let selectedImage = '';

  const openModal = (image: string) => {
    selectedImage = image;
    isModalOpen = true;
  };

  const closeModal = () => {
    isModalOpen = false;
    selectedImage = '';
  };
</script>

<style>
  /* Optionally, improve modal styling */
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.6);
  }
</style>

<div
  role="button"
  tabindex="0"
  aria-label="Project card: {project.title}"
  class="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl max-w-md mx-auto sm:max-w-md"
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
  on:keydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      isHovered = !isHovered;
    }
  }}
>
  <!-- Title -->
  <h3 class="mt-4 mb-4 ml-4 font-semibold text-center text-gray-800 text-md sm:text-md">{project.title}</h3>

  <!-- Description -->
  <div class="w-[100%] content-center bg-re-500">
    <!-- <p class="px-4 py-1 mt-2 text-base text-gray-600 sm:text-xs w-[100%] justify-center align-center mb-2">
      {project.description}
    </p> -->
  </div>

  <!-- Image Carousel -->
  <div class="relative">
    <Carousel
      autoplay
      autoplayDuration={5000}
      pauseOnFocus
    >
      {#each [1, 2, 3, 4] as index}
        <img 
          src={`assets/project/images/${project.title}/${index}.png`} 
          alt={`Image ${index} of ${project.title}`} 
          class="object-cover w-full cursor-pointer h-52 sm:h-38"
          on:click={() => openModal(`assets/project/images/${project.title}/${index}.png`)}
        />
      {/each}
    </Carousel>
  </div>

  <!-- Tags -->
  <div class="justify-between p-6 text-center">
    {#each project.technologies as tech}
      <div class="inline-block px-3 py-1 mb-2 mr-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-full shadow-sm hover:shadow-md">
        {tech}
      </div>
    {/each}
  </div>
</div>

<!-- Modal for Enlarged Image -->
{#if isModalOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center modal-backdrop "
    on:click={closeModal}
  >
    <div 
      class="relative max-w-3xl p-4 mx-auto transition-all duration-300 transform scale-100 bg-white rounded-lg shadow-lg w-[80%]"
      on:click|stopPropagation
    >
      <button 
        class="absolute text-xl text-gray-600 top-2 right-2 hover:text-gray-900"
        on:click={closeModal}
        aria-label="Close modal"
      >
        &times;
      </button>
      <img src={selectedImage} alt="Enlarged Image" class="max-w-full max-h-[80vh] rounded-lg"/>
    </div>
  </div>
{/if}
