<script lang="ts">
  export let totalVisits: number;
  export let dailyUniqueVisitors: number;
</script>

<div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
  <div class="p-6 bg-white rounded-lg shadow">
    <h3 class="mb-2 text-lg font-semibold text-gray-800">Total des visites</h3>
    <p class="text-3xl font-bold text-blue-600">{totalVisits}</p>
  </div>

  <div class="p-6 bg-white rounded-lg shadow">
    <h3 class="mb-2 text-lg font-semibold text-gray-800">Visiteurs uniques (24h)</h3>
    <p class="text-3xl font-bold text-purple-600">{dailyUniqueVisitors}</p>
  </div>
</div>