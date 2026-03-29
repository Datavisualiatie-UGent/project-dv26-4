---
theme: dashboard
title: Explore
toc: false
---

# Are earthquakes random?

## What is an earthquake?
An earthquake occurs due to the release of energy from the Earth's crust, particulary present at the boundaries of tectonic plates

![tectonic boundaries](data/Tectonic_plates_(2022).svg "Tectonic boundaries")

## The Ring of Fire
The Ring of Fire is a large belt with high tectonic activity, causing earthquakes and volcanoes
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
## Benelux earthquakes?

```js
range
```

```js
// Enkel data van die magnitude selecteren
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
const yearlyStats = d3.rollups(
  filteredData,
  v => ({
    meanDeaths: d3.mean(v, d => +d.Deaths),
    totalDeaths: d3.sum(v, d => +d.Deaths)
  }),
  d => +d.Year
).map(([Year, stats]) => ({
  Year,
  ...stats
}));
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

```js
Plot.plot({
  inset: 8,
  grid: true,
  x: {
    domain: range
  },
  y: {
    type: "log"
  },
  color: { legend: true },
  marks: [
    // Original dots
    Plot.dot(filteredData, {
      x: "Year",
      y: d => +d.Deaths,
      stroke: "gray",
      opacity: 0.5,
      tip: true
    }),

    // Mean deaths per year (line)
    Plot.line(yearlyStats, {
      x: "Year",
      y: "meanDeaths",
      stroke: "blue",
      strokeWidth: 2
    }),

    // Total deaths per year (line)
    Plot.line(yearlyStats, {
      x: "Year",
      y: "totalDeaths",
      stroke: "red",
      strokeWidth: 2
    })
  ]
})
```