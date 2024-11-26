<script lang="ts">
  import type { SocialLink } from '../lib/stores/ContentStore';
  
  export let socials: SocialLink[];
</script>

<div class="mt-16 text-center animate-fade-in">
  <h3 class="text-2xl font-semibold mb-6">Retrouvez-moi aussi sur :</h3>
  <div class="flex justify-center gap-6 stagger-delay">
    {#each socials as social}
      <a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        class={`${social.color} text-white p-4 rounded-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-lg group flex items-center gap-2 animate-float`}
        title={social.name}
      >
        <i class={`fab ${social.icon} text-xl group-hover:animate-bounce`}></i>
        <span>{social.name}</span>
      </a>
    {/each}
  </div>
</div>