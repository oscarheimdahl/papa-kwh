<script lang="ts">
  import { browser } from '$app/environment';
  import { afterUpdate, onMount } from 'svelte';
  import chartTrendline from 'chartjs-plugin-trendline';
  import {
    CategoryScale,
    Chart,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
  } from 'chart.js';
  import { config } from './WindowChartConfig';

  //

  Chart.register(
    Title,
    LineController,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
    chartTrendline
  );

  export let title: string = 'banan';
  export let data: number[];
  export let labels: string[];

  let barChartElement: HTMLCanvasElement;
  let chart: Chart;
  let showGraph = false;

  onMount(() => {
    if (!browser) return;
    chart = new Chart(barChartElement, {
      type: 'line',
      data: { labels: [], datasets: [] },
    });
  });

  afterUpdate(() => {
    chart.data.labels = labels;
    chart.data.datasets[0] = config;
    chart.data.datasets[0].label = title;
    chart.data.datasets[0].data = yearWindow(data);
    chart.data.datasets[1] = config;
    chart.data.datasets[1].data = yearWindow(data);
    chart.update();
    showGraph = data.length > 0;
  });

  function yearWindow(monthData: number[]) {
    return monthData.map((_, i) => {
      const sum = data
        .slice(Math.max(i - 12, 0), i + 1)
        .map((val) => val)
        .reduce((prev, curr) => prev + curr, 0);
      return sum;
    });
  }
</script>

<div class={`${showGraph ? '' : 'border-2'} max-w-7xl`}>
  <div class="mt-6 text-center text-gray-600" style={`display: ${showGraph ? 'none' : 'block'}`}>Välj en fil...</div>
  <div class="transition-opacity" style={`opacity: ${showGraph ? '1' : '0'}`}>
    <canvas bind:this={barChartElement} />
  </div>
</div>
