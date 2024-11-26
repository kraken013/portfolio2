<script lang="ts">
  let name = '';
  let email = '';
  let message = '';
  let submitted = false;

  function handleSubmit() {
    // Ici vous pouvez ajouter la logique pour envoyer le formulaire
    console.log({ name, email, message });
    
    submitted = true;
    setTimeout(() => {
      // Reset form
      name = '';
      email = '';
      message = '';
      submitted = false;
    }, 3000);
  }
</script>

<form 
  on:submit|preventDefault={handleSubmit} 
  class="bg-white p-6 rounded-lg shadow transform transition-all duration-300 hover:shadow-lg"
>
  <div class="mb-4 transform transition-all duration-300 hover:translate-x-2">
    <label class="block text-gray-700 mb-2" for="name">Nom</label>
    <input
      id="name"
      type="text"
      bind:value={name}
      class="w-full px-3 py-2 border rounded transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 hover:border-blue-300"
      required
    />
  </div>

  <div class="mb-4 transform transition-all duration-300 hover:translate-x-2">
    <label class="block text-gray-700 mb-2" for="email">Email</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      class="w-full px-3 py-2 border rounded transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 hover:border-blue-300"
      required
    />
  </div>

  <div class="mb-4 transform transition-all duration-300 hover:translate-x-2">
    <label class="block text-gray-700 mb-2" for="message">Message</label>
    <textarea
      id="message"
      bind:value={message}
      class="w-full px-3 py-2 border rounded transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 hover:border-blue-300"
      rows="4"
      required
    ></textarea>
  </div>

  <button
    type="submit"
    class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:opacity-50"
    disabled={submitted}
  >
    {#if submitted}
      <span class="flex items-center justify-center">
        <i class="fas fa-check mr-2"></i>
        Message envoyé !
      </span>
    {:else}
      Envoyer
    {/if}
  </button>
</form>