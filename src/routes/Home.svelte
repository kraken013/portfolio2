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
    <h1 class="mb-6 text-5xl font-bold">{$contentStore.hero.title}</h1>
    <p class="max-w-3xl mx-auto text-xl text-gray-600">
      {$contentStore.hero.subtitle}
    </p>
  </section>

  <section class="mb-16">
    <h2 class="mb-8 text-3xl font-bold text-center animate-fade-in">Derniers Projets</h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-delay">
      {#each latestProjects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  </section>

  <section class="mb-16 animate-fade-in">
    <h2 class="mb-8 text-3xl font-bold text-center">{$contentStore.contact.title}</h2>
    <p class="mb-8 text-center text-gray-600">{$contentStore.contact.description}</p>
    <div class="max-w-2xl mx-auto">
      <ContactForm />
    </div>
  </section>

  <SocialButtons socials={$contentStore.socials} />

  
</main>
<TestimonialCarousel />