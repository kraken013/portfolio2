<script lang="ts">
  import { Icon } from 'svelte-hero-icons';
  import { DevicePhoneMobile, Envelope, Map } from 'svelte-hero-icons';
</script>

<div class="grid grid-cols-2 gap-8 p-8 mx-auto bg-white shadow-2xl contact-card rounded-2xl">
  <div class="flex flex-col justify-center space-y-2 left-section">
    <h2 class="mb-6 text-3xl font-extrabold text-gray-900">
      Contactez-moi
    </h2>
    <p class="mb-4 text-gray-600">
      N'hésitez pas à me contacter pour toute opportunité ou collaboration. Je suis ouvert à de nouveaux projets et défis.
    </p>
    <div class="space-y-2 contact-decorations">
      <div class="w-16 h-1 bg-blue-500 rounded"></div>
      <div class="w-10 h-1 bg-green-500 rounded"></div>
    </div>
  </div>

  <div class="space-y-6 right-section">
    <div class="flex items-center pb-4 space-x-4 border-b contact-item">
      <div class="p-3 rounded-full icon-wrapper bg-blue-50">
        <Icon src={DevicePhoneMobile} class="w-6 h-6 text-blue-500"/>
      </div>
      <div>
        <p class="text-sm text-gray-500">Téléphone</p>
        <a href="tel:0658607675" class="text-lg text-gray-800 transition hover:text-blue-600">
          0658607675
        </a>
      </div>
    </div>

    <div class="flex items-center pb-4 space-x-4 border-b contact-item">
      <div class="p-3 rounded-full icon-wrapper bg-green-50">
        <Icon src={Envelope} class="w-6 h-6 text-green-500"/>
      </div>
      <div>
        <p class="text-sm text-gray-500">Email</p>
        <a href="mailto:sofiane.flici14@gmail.com" class="text-lg text-gray-800 transition hover:text-green-600">
          sofiane.flici14@gmail.com
        </a>
      </div>
    </div>

    <div class="flex items-center space-x-4 contact-item">
      <div class="p-3 rounded-full icon-wrapper bg-red-50">
        <Icon src={Map} class="w-6 h-6 text-red-500"/>
      </div>
      <div>
        <p class="text-sm text-gray-500">Localisation</p>
        <span class="text-lg text-gray-800">
          Marseille, France
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .contact-card {
    max-width: 900px;
    width: 95%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: 1fr 1fr; /* Deux colonnes par défaut */
    gap: 2rem;
  }

  .contact-item {
    transition: transform 0.2s ease;
  }

  .contact-item:hover {
    transform: translateX(5px);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .contact-card {
      grid-template-columns: 1fr; /* Une seule colonne pour petits écrans */
    }

    .left-section, .right-section {
      text-align: center; /* Centrer le texte pour les petits écrans */
    }
  }

  @media (max-width: 480px) {
    .contact-card {
      padding: 1rem; /* Réduction des marges */
      gap: 1rem; /* Espacement réduit */
    }

    h2 {
      font-size: 1.2rem; /* Texte légèrement plus petit */
    }

    p {
      font-size: 0.875rem; /* Ajustement des tailles de texte */
    }

    .icon-wrapper {
      padding: 1rem; /* Ajustement du padding */
    }
  }
</style>
