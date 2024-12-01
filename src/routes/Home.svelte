<script lang="ts">
  import { onMount } from 'svelte';
  import { projectStore } from '../lib/stores/ProjectStore';
  import { contentStore } from '../lib/stores/ContentStore';
  import ProjectCard from '../components/ProjectCard.svelte';
  import ContactForm from '../components/ContactForm.svelte';
  import TestimonialCarousel from '../components/testimonials/TestimonialCarousel.svelte';
  import SocialButtons from '../components/SocialButtons.svelte';

  onMount(async () => {
    await Promise.all([
      projectStore.loadProjects(),
      contentStore.loadContent()
    ]);
  });

  $: latestProjects = $projectStore.slice(0, 3);
</script>

<main class="container px-4 py-8 mx-auto">
  <section class="mb-16 text-center animate-fade-in">
    <h1 class="mb-6 text-2xl font-semibold">Développeur Web, Mobile et Expériences Immersives</h1>
    <p class="max-w-3xl mx-auto text-gray-600 text-md">
      Donnez vie à vos projets numériques : des sites web et applications mobiles performants aux expériences immersives en AR et VR, en passant par des logiciels sur mesure. Transformez vos idées en solutions innovantes et engageantes.
    </p>
  </section>

  <section class="mb-16">
    <h2 class="mb-8 text-2xl font-semibold text-center animate-fade-in">Derniers Projets</h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-delay">
      {#each latestProjects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  </section>

  <section class="mb-16 animate-fade-in">
    <h2 class="mb-8 text-2xl font-semibold text-center">Discutons de notre futur collaboration</h2>
    <div class="w-[100%] bg-red-400">
      <ContactForm />
    </div>
  </section>

  <SocialButtons socials={$contentStore.socials} />

  
</main>
<TestimonialCarousel />