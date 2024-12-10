<script lang="ts">
  export let totalVisits: number;
  export let uniqueVisitors: number;
  export let dailyUniqueVisitors: number;
  export let popularPages: { path: string; views: number }[];
</script>

<div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
  <div class="p-6 bg-white rounded-lg shadow">
    <h3 class="mb-2 text-lg font-semibold text-gray-800">Total des visites</h3>
    <p class="text-3xl font-bold text-blue-600">{totalVisits}</p>
  </div>

  <div class="p-6 bg-white rounded-lg shadow">
    <h3 class="mb-2 text-lg font-semibold text-gray-800">Visiteurs uniques total</h3>
    <p class="text-3xl font-bold text-green-600">{uniqueVisitors}</p>
  </div>

  <div class="p-6 bg-white rounded-lg shadow">
    <h3 class="mb-2 text-lg font-semibold text-gray-800">Visiteurs uniques (24h)</h3>
    <p class="text-3xl font-bold text-purple-600">{dailyUniqueVisitors}</p>
  </div>
</div>