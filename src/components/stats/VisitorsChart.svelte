<script lang="ts">
  import { Line } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from 'chart.js';
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
  );

  export let dailyStats: { date: string; views: number }[];

  $: data = {
    labels: dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Visites quotidiennes',
        data: dailyStats.map(stat => stat.views),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  };

  $: options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Visites des 30 derniers jours'
      }
    }
  };
  
</script>

<div class="p-4 bg-white rounded-lg shadow">
  <Line {data} {options} />
</div>