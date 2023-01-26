<script lang="ts">
  import WindowChart from '../lib/WindowChart.svelte';

  let chartData: number[] = [];
  let title: string = '';
  let labels: string[] = [];
  let files: FileList;

  function onFileSelect() {
    const file = files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (data) => onFileLoad(data.target?.result);
  }

  function onFileLoad(fileContent: string | ArrayBuffer | null | undefined) {
    if (typeof fileContent !== 'string') {
      console.log('Could not read file, (did not get string from FileReader)');
      return;
    }

    parseChartData(fileContent as string);
  }

  function parseChartData(data: string) {
    const rows = data.split('\n');
    title = rows[0];
    const dateData = rows
      .filter((row) => row.match(/[a-zA-Z]{3}-[0-9]{4}/gm)) //matches "abc-1234"
      .map((row) => {
        const [date, kwh] = row.split('\t');
        const kwhInt = +kwh.split(',')[0];
        return { kwh: kwhInt, date };
      });
    const kwhs = dateData.map((dd) => dd?.kwh);
    const dates = dateData.map((dd) => dd?.date);
    chartData = kwhs;
    labels = dates;
  }
</script>

<div class="flex gap-4 flex-col h-full p-8">
  <input bind:files accept=".csv" on:change={onFileSelect} type="file" name="data" id="" />
  <WindowChart {title} data={chartData} {labels} />
</div>
