---
title: How many earthquakes occur each year?
---

# How many earthquakes occur each year?

This plot shows the number of recorded earthquakes per year since 1800.

Comment; uitleggen dat de detectie enzo verbetert, dus er worden veel meer aardbevingen waargenomen, maar dit komt door de betere detectie

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();

const minYear = 1800;

const data = data_raw
  .filter(d => +d.Year >= minYear && d.Mag)
  .map(d => ({
    Year: +d.Year
  }));

display(Plot.plot({
  title: "Number of earthquakes per 5-year period",
  width: 800,
  height: 400,
  x: {
    label: "Year →",
    grid: true
  },
  y: {
    label: "↑ Number of earthquakes",
    grid: true
  },
  marks: [
    Plot.rectY(
      data,
      Plot.binX(
        {y: "count"},
        {
          x: "Year",
          thresholds: d3.range(1800, 2026, 5),
          fill: "steelblue"
        }
      )
    )
  ]
}));
```