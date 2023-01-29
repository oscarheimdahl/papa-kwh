<script lang="ts">
  import WindowChart from '../lib/WindowChart.svelte';
  import type { DataSet } from '../types/Chart';

  let dataSets: DataSet[] = [];

  let files: FileList;

  function onFileSelect() {
    for (let i = 0; i < files.length; i++) {
      var reader = new FileReader();
      const file = files[i];
      if (!file) break;
      reader.readAsText(files[i], 'UTF-8');
      reader.onload = (data) => onFileLoad(data.target?.result);
    }
  }

  function onFileLoad(fileContent: string | ArrayBuffer | null | undefined) {
    if (typeof fileContent !== 'string') {
      console.error('Could not read file, (did not get string from FileReader)');
      return;
    }

    parseChartData(fileContent as string);
  }

  function parseChartData(data: string) {
    const rows = data.split('\n');
    const dateData = rows
      .filter((row) => row.match(/[a-zA-Z]{3}-[0-9]{4}/gm)) //matches "abc-1234"
      .map((row) => {
        const [date, kwh] = row.split('\t');
        const kwhInt = +kwh.split(',')[0];
        return { kwh: kwhInt, date };
      });
    const kwhs = dateData.map((dd) => dd?.kwh);
    const dates = dateData.map((dd) => dd?.date);
    dataSets = [
      ...dataSets,
      {
        title: rows[0],
        data: kwhs,
        labels: dates,
      },
    ];
  }
</script>

<div class="flex gap-4 flex-col h-full p-8">
  <input multiple bind:files accept=".csv" on:change={onFileSelect} type="file" name="data" id="" />
  <WindowChart {dataSets} />
</div>
