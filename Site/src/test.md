---
theme: dashboard
title: Example dashboard
toc: false
---

# An earthquake, always deadly?

```js
import {rangeSlider} from "@observablehq/inputs"

viewof range = rangeSlider({
  min: 1800,
  max: 2026,
  value: [1900, 2020],
  step: 1,
  precision: 0,
  title: "Selecteer een periode"
})
```
```js
range
```

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();

const data = data_raw.filter(d => d.Mag && +d.Mag > 0);

const filteredData = data.filter(d => 
  +d.Year >= range[0] && +d.Year <= range[1]
);
```

```js
const count = filteredData.length;
const totalDeaths = d3.sum(filteredData, d => +d.Deaths);
const avgMag = d3.mean(filteredData, d => +d.Mag);
const cost = d3.sum(filteredData, d => +d["Damage ($Mil)"]);
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Aantal aardbevingen</h2>
    <span class="big">${count}</span>
  </div>
  <div class="card">
    <h2>Aantal doden</h2>
    <span class="big">${totalDeaths}</span>
  </div>
  <div class="card">
    <h2>Gemiddelde magnitude</h2>
    <span class="big">${avgMag?.toFixed(2)}</span>
  </div>
  <div class="card">
    <h2>Totale kost ($ miljard)</h2>
    <span class="big">${(cost / 1000).toFixed(3)}</span>
  </div>
</div>


```js
Plot.plot({
  inset: 8,
  grid: true,
  color: { legend: true },
  marks: [
    Plot.dot(filteredData, {
      x: "Year",
      y: "Deaths",
      tip: true
    })
  ]
})
y: { type: "log" }
```