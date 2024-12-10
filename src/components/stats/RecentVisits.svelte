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

  function getBrowser(user_agent: string | null | undefined): string {
  if (!user_agent) return 'Inconnu'; // Gère les cas où user_agent est null ou undefined
  if (user_agent.includes('Firefox')) return 'Firefox';
  if (user_agent.includes('Chrome')) return 'Chrome';
  if (user_agent.includes('Safari')) return 'Safari';
  if (user_agent.includes('Edge')) return 'Edge';
  if (user_agent.includes('MSIE')) return 'Internet Explorer';
  if (user_agent.includes('Opera')) return 'Opera';
  if (user_agent.includes('OPR')) return 'Opera';
  if (user_agent.includes('Vivaldi')) return 'Vivaldi';
  if (user_agent.includes('Yandex')) return 'Yandex';
  if (user_agent.includes('Brave')) return 'Brave';
  if (user_agent.includes('Chromium')) return 'Chromium';
  if (user_agent.includes('Mobile')) return 'Mobile';
  if (user_agent.includes('Android')) return 'Android';
  if (user_agent.includes('iOS')) return 'iOS';
  if (user_agent.includes('Windows Phone')) return 'Windows Phone';
  if (user_agent.includes('BlackBerry')) return 'BlackBerry';
  if (user_agent.includes('Linux')) return 'Linux';
  if (user_agent.includes('Mac OS')) return 'Mac OS';
  if (user_agent.includes('Windows')) return 'Windows';
  return 'Autre';
}

function truncatePath(path: string, maxLength: number = 30): string {
  return path.length > maxLength ? path.slice(0, maxLength) + '...' : path;
}
</script>

<div class="overflow-hidden bg-white rounded-lg shadow">
  <div class="px-6 py-4 border-b">
    <h3 class="text-lg font-semibold text-gray-800">Visites récentes (24h)</h3>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Heure
          </th>
          <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Page
          </th>
          <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Navigateur
          </th>
          <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            ID Visiteur
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each recentVisits as visit}
          <tr>
            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
              {formatDate(visit.timestamp)}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
              {truncatePath(visit.path)}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
              {getBrowser(visit.user_agent)}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
              {visit.visitor_id.slice(0, 8)}...
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>