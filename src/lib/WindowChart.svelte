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
  import type { DataSet } from '../types/Chart';

  //

  const colors = ['#CD6155', '#AF7AC5', '#5599C7', '#48C9B0', '#F4D040', '#EB984E'];

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

  // export let title: string = 'banan';
  // export let data: number[];
  // export let labels: string[];
  export let dataSets: DataSet[];

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
    if (dataSets.length === 0) return;
    showGraph = true;
    let maxLabelLength = 0;
    let maxLabelIndex = 0;
    chart.data.datasets = [];
    for (let i = 0; i < dataSets.length; i++) {
      chart.data.datasets.push({ ...config });
      chart.data.datasets[i].borderColor = colors[i];
      chart.data.datasets[i].label = dataSets[i].title;
      chart.data.datasets[i].data = yearWindow(dataSets[i].data);
      if (dataSets[i].labels.length > maxLabelLength) {
        maxLabelLength = dataSets[i].labels.length;
        maxLabelIndex = i;
      }
    }
    chart.data.labels = dataSets[maxLabelIndex].labels;
    chart.update();
  });

  function yearWindow(monthData: number[]) {
    return monthData.map((_, i) => {
      const sum = monthData
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
