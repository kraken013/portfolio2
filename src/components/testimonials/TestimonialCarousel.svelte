<script lang="ts">
  import { onMount } from 'svelte';
  import Carousel from 'svelte-carousel';
  import type { Testimonial } from '../../lib/stores/TestimonialStore';
  import { testimonialStore } from '../../lib/stores/TestimonialStore';
  import TestimonialForm from './TestimonialForm.svelte';

  let showForm = false;
  let testimonials: Testimonial[] = [];

  onMount(async () => {
    await testimonialStore.loadTestimonials();
    testimonialStore.subscribe(value => {
      testimonials = value;
    });
  });

  function toggleForm() {
    showForm = !showForm;
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
</script>

<section class="bg-gray-900 py-16 mt-16 animate-fade-in">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-white text-center mb-12">Ce que disent nos clients</h2>

    {#if testimonials.length > 0}
      <Carousel
        autoplay
        autoplayDuration={5000}
        pauseOnFocus
        arrows={testimonials.length > 1}
      >
        {#each testimonials as testimonial}
          <div class="px-4">
            <div class="bg-white rounded-lg p-8 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div class="flex items-center mb-4 animate-float">
                {#each Array(5) as _, i}
                  <svg
                    class={`w-5 h-5 transform transition-all duration-300 hover:scale-125 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                {/each}
              </div>
              <p class="text-gray-600 mb-4">{testimonial.comment}</p>
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-800">{testimonial.name}</span>
                <span class="text-sm text-gray-500">{formatDate(testimonial.createdAt)}</span>
              </div>
            </div>
          </div>
        {/each}
      </Carousel>
    {:else}
      <p class="text-center text-gray-400 mb-8">Aucun avis pour le moment. Soyez le premier à en laisser un !</p>
    {/if}

    <div class="text-center mt-8">
      <button
        on:click={toggleForm}
        class="bg-blue-500 text-white px-6 py-3 rounded-lg transform transition-all duration-300 hover:bg-blue-600 hover:scale-105 hover:shadow-lg active:scale-95"
      >
        {showForm ? 'Fermer' : 'Laisser un avis'}
      </button>
    </div>

    {#if showForm}
      <div class="mt-8 max-w-2xl mx-auto animate-scale-in">
        <TestimonialForm on:submitted={toggleForm} />
      </div>
    {/if}
  </div>
</section>