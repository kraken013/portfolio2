<script lang="ts">
  import type { PageView } from '../../lib/stores/StatsStore';
  
  export let recentVisits: PageView[];

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  function getBrowser(userAgent: string): string {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Autre';
  }
</script>

<div class="bg-white rounded-lg shadow overflow-hidden">
  <div class="px-6 py-4 border-b">
    <h3 class="text-lg font-semibold text-gray-800">Visites récentes (24h)</h3>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Heure
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Page
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Navigateur
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each recentVisits as visit}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(visit.timestamp)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {visit.path}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {getBrowser(visit.userAgent)}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>