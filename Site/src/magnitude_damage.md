---
title: Same magnitude, same damage?
---

# Same magnitude, same damage?

plot about magnitude, damages, casualties

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();
const minYear = 1800;
const data = data_raw.filter(d => +d.Year >= minYear && d.Mag && +d.Mag > 0);
const maxYear = d3.max(data, d => +d.Year);
const count = data.length;
const totalDeaths = d3.sum(data, d => +d.Deaths);
const avgMag = d3.mean(data, d => +d.Mag);
const cost = d3.sum(data, d => +d["Damage ($Mil)"]);
```
```js
const filteredData = data_raw  
  .filter(d =>
    +d.Year >= minYear &&
    d.Mag &&
    d.Deaths &&
    +d.Deaths > 0
  )
  .map(d => ({
    ...d,
    Year: +d.Year,
    Deaths: +d.Deaths
  }));
```

```js
display(Plot.plot({
  title: "Magnitude vs focal depth",
  width: 800,
  height: 400,
  inset: 8,
  grid: true,
  x: {
    label: "Depth (km) →",
    type: "log"
  },
  y: {
    label: "↑ Magnitude",
    domain: [0, 10]
  },
  color: {
    label: "Deaths",
    type: "log",
    scheme: "reds",
    legend: true
  },
  marks: [
    Plot.dot(
      data_raw.filter(d =>
        +d.Year >= minYear &&
        +d.Mag > 0 &&
        +d["Focal Depth (km)"] > 0 &&
        +d.Deaths > 0
      ),
      {
        x: d => +d["Focal Depth (km)"],
        y: d => +d.Mag,
        fill: d => +d.Deaths,
        opacity: 0.7,
        r: 4,
        tip: true,
        title: d => `Year: ${d.Year}
Magnitude: ${d.Mag}
Depth: ${d["Focal Depth (km)"]} km
Deaths: ${d.Deaths}`
      }
    )
  ]
}));
```