<script lang="ts">
  export let totalVisits: number;
  export let todayVisits: number;
  export let popularPages: { path: string; views: number }[];
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Total des visites</h3>
    <p class="text-3xl font-bold text-blue-600">{totalVisits}</p>
  </div>

  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Visites aujourd'hui</h3>
    <p class="text-3xl font-bold text-green-600">{todayVisits}</p>
  </div>

  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Pages populaires</h3>
    <ul class="space-y-2">
      {#each popularPages as page}
        <li class="flex justify-between items-center">
          <span class="text-gray-600">{page.path}</span>
          <span class="font-semibold">{page.views}</span>
        </li>
      {/each}
    </ul>
  </div>
</div>