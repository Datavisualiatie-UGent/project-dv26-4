---
theme: dashboard
title: Example dashboard
toc: false
---

# An earthquake, always deadly?
```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();
const minYear = 1800;
const data = data_raw.filter(d => +d.Year >= minYear && d.Mag && +d.Mag > 0);
const maxYear = d3.max(data, d => +d.Year);
const count = data.length;
const totalDeaths = d3.sum(data, d => +d.Deaths);
const avgMag = d3.mean(data, d => +d.Mag);
const cost = d3.sum(data, d => +d["Damage ($Mil)"]);
const magRange = view(Inputs.range([1, 9], {
  step: 1,
  value: 5,
  label: null,
  width: 300
}));
```
```js
const filteredData = data_raw  
  .filter(d =>
    +d.Year >= minYear &&
    d.Mag &&
    Math.floor(+d.Mag) == magRange &&
    d.Deaths &&
    +d.Deaths > 0
  )
  .map(d => ({
    ...d,
    Year: +d.Year,
    Deaths: +d.Deaths
  }));

const yearlyStats = d3.rollups(
  filteredData,
  v => ({
    meanDeaths: d3.mean(v, d => +d.Deaths),
    avgDeaths: d3.sum(v, d => +d.Deaths)
  }),
  d => Math.floor(+d.Year / 5) * 5 
).map(([Year, stats]) => ({
  Year,
  ...stats
}));
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Amount of earthquakes since ${minYear}</h2>
    <span class="big">${count}</span>
  </div>
  <div class="card">
    <h2>Amount of deaths since ${minYear}</h2> 
    <span class="big">${totalDeaths}</span>
  </div>
  <div class="card">
    <h2>Average Magnitude</h2>
    <span class="big">${avgMag.toFixed(2)}</span>
  </div>
  <div class="card">
    <h2>Total cost ($ Billion)</h2>
    <span class="big">${(cost/1000).toFixed(3)}</span>
  </div>
</div>

```js
Plot.plot({
  inset: 8,
  grid: true,
  x: {
    domain: [minYear, maxYear]
  },
  y: {
    type: "log"
  },
  color: {
    legend: true,
  },
  marks: [
    Plot.dot(filteredData, {x: "Year", y: "Deaths"})  
  ]
})
```
```js
Plot.plot({
  inset: 8,
  grid: true,
  x: {
    domain: [minYear, maxYear]
  },
  y: {
    type: "log"
  },
  marks: [
    Plot.dot(filteredData, {
      x: "Year",
      y: d => +d.Deaths,
      stroke: "gray",
      opacity: 0.5,
      tip: true
    }),
    Plot.line(yearlyStats, {
      x: "Year",
      y: "avgDeaths",
      stroke: "red",
      strokeWidth: 2
    })
  ]
})
```