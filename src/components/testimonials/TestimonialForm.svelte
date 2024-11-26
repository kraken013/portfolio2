<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { testimonialStore } from '../../lib/stores/TestimonialStore';

  const dispatch = createEventDispatcher();

  let name = '';
  let rating = 5;
  let comment = '';
  let isSubmitting = false;
  let error = '';

  async function handleSubmit() {
    if (name.trim() === '' || comment.trim() === '') {
      error = 'Veuillez remplir tous les champs';
      return;
    }

    isSubmitting = true;
    error = '';

    try {
      await testimonialStore.addTestimonial({
        name,
        rating,
        comment
      });
      
      dispatch('submitted');
    } catch (e) {
      error = 'Une erreur est survenue. Veuillez réessayer.';
      console.error(e);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="bg-white p-6 rounded-lg shadow-lg">
  <h3 class="text-xl font-bold mb-4">Laisser un avis</h3>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
      <input
        type="text"
        id="name"
        bind:value={name}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Note</label>
      <div class="flex gap-2 mt-1">
        {#each Array(5) as _, i}
          <button
            type="button"
            on:click={() => rating = i + 1}
            class="focus:outline-none"
          >
            <svg
              class={`w-8 h-8 ${i < rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        {/each}
      </div>
    </div>

    <div>
      <label for="comment" class="block text-sm font-medium text-gray-700">Commentaire</label>
      <textarea
        id="comment"
        bind:value={comment}
        rows="4"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
        required
      ></textarea>
    </div>

    <button
      type="submit"
      class="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
    </button>
  </form>
</div>