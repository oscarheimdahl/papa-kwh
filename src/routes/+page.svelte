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
    Filler,
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

  export let data;
  const content: string = data.content;

  const monthsMap = new Map();
  monthsMap.set('jan', 1);
  monthsMap.set('feb', 2);
  monthsMap.set('mar', 3);
  monthsMap.set('apr', 4);
  monthsMap.set('maj', 5);
  monthsMap.set('jun', 6);
  monthsMap.set('jul', 7);
  monthsMap.set('aug', 8);
  monthsMap.set('sep', 9);
  monthsMap.set('okt', 10);
  monthsMap.set('nov', 11);
  monthsMap.set('dec', 12);

  let max = 0;
  let maxWindow = 0;
  const monthData = content
    .slice(1)
    .split('\r\n')
    .filter((line) => line[0] !== '#')
    .map((line) => {
      const [date, kwhData] = line.split('\t');
      const kwh = +kwhData.split(',')[0];
      if (kwh > max) max = kwh;
      const [month, year] = date.split('-');
      return { month: monthsMap.get(month), year: +year, kwh };
    });

  const monthDataWindow = monthData.map((_, i) => {
    const sum = monthData
      .slice(Math.max(i - 12, 0), i + 1)
      .map((val) => val.kwh)
      .reduce((prev, curr) => prev + curr, 0);
    if (sum > maxWindow) maxWindow = sum;
    return sum;
  });

  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
  const months = [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ];

  const labels = years.map((year) => months.map((month) => year + ' ' + month)).flat();
  labels.shift();
  labels.push('2023 Januari');
  console.log(monthDataWindow.length);
  console.log(labels.length);

  // console.log(labels.length);
  // console.log(monthDataWindow.length);
  // console.log(monthData);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Sandviksgatan 54',
        data: monthDataWindow,
        // fill: true,
        // lineTension: 0.3,
        // backgroundColor: 'rgba(225, 204,230, .3)',
        borderColor: 'rgb(255, 130, 158)',
        // borderCapStyle: 'butt',
        // borderDash: [],
        borderDashOffset: 0.0,
        // borderJoinStyle: 'miter',
        pointBorderColor: 'rgb(205, 130,1 58)',
        // pointBackgroundColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 5,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(0, 0, 0)',
        // pointHoverBorderColor: 'rgba(220, 220, 220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };
</script>

<div class="m-8">
  <Line data={chartData} options={{ responsive: true }} />
</div>
