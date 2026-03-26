---
theme: dashboard
title: Example dashboard
toc: false
---

# An earthquake, always deadly?

<!-- Load and transform the data -->

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();
const minYear = 1800;
const data = data_raw.filter(d => +d.Year >= minYear && d.Mag && +d.Mag > 0 );
const maxYear = d3.max(data, d => +d.Year);
const count = data.length;
const totalDeaths = d3.sum(data, d => +d.Deaths);
const avgMag = d3.mean(data, d => +d.Mag);
const cost = d3.sum(data, d => +d["Damage ($Mil)"]);
const magRange = view(Inputs.range([0, 10], {
  step: 1,
  value: 5,
  label: null,
  width: 300
}))
```
```js

const data_plot = data_raw.filter(d => +d.Year >= minYear && d.Mag && Math.floor(+d.Mag) == magRange && d.Deaths && d.Deaths > 0);

```


<div class="grid grid-cols-4">
  <div class="card">
    <h2>Amount of earthquakes since ${minYear}</h2>
    <span class="big">${count}</span>
  </div>
  <div class="card">
    <h2>Amount of deaths since ${minYear}</span></h2>
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
  color: {
    legend: true,
  },
  marks: [
    Plot.dot(data_plot, {x: "Year", y: "Deaths"})
  ]
})
```


