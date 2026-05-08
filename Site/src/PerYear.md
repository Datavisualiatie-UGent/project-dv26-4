---
title: How many earthquakes occur each year?
---

# How many earthquakes occur each year?

This plot shows the number of recorded earthquakes per year since 1800.

Comment; uitleggen dat de detectie enzo verbetert, dus er worden veel meer aardbevingen waargenomen, maar dit komt door de betere detectie

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();

const minYear = 1800;

const classes = ["M < 6", "M 6–7.9", "M ≥ 8"];

const data = data_raw
  .filter(d => +d.Year >= minYear && d.Mag)
  .map(d => {
    const mag = +d.Mag;

    return {
      Period: Math.floor(+d.Year / 10) * 10,
      MagnitudeClass:
        mag < 6 ? "M < 6" :
        mag < 8 ? "M 6–7.9" :
        "M ≥ 8"
    };
  });

const spacing = 2.5;

const grouped = Array.from(
  d3.rollup(
    data,
    v => v.length,
    d => d.Period,
    d => d.MagnitudeClass
  ),
  ([Period, values]) =>
    classes.map((MagnitudeClass, i) => ({
      Period,
      MagnitudeClass,
      Count: values.get(MagnitudeClass) ?? 0,
      x: Period + (i - 1) * spacing
    }))
).flat();

display(Plot.plot({
  title: "Number of earthquakes per 10-year period by magnitude",
  width: 1000,
  height: 450,

  x: {
  label: "Year →",
  ticks: d3.range(1800, 2030, 10),
  tickFormat: d3.format("d")
  },

  y: {
    label: "↑ Number of earthquakes",
    grid: true
  },

  color: {
    legend: true,
    domain: classes
  },

marks: [
  Plot.barY(grouped, {
    x: "x",
    y: "Count",
    fill: "MagnitudeClass",
    title: d =>
      `${d.Period}-${d.Period + 9}
${d.MagnitudeClass}: ${d.Count}`
  }),

  Plot.ruleX([1900, 1960, 1990], {
    stroke: "white",
    strokeOpacity: 0.5,
    strokeDasharray: "4,4"
  }),

  Plot.text(
    [
      {x: 1900, y: 350, label: "Expansion of global\nseismograph networks"},
      {x: 1960, y: 350, label: "WWSSN introduced"},
      {x: 1990, y: 350, label: "Digital seismic\nmonitoring"}
    ],
    {
      x: "x",
      y: "y",
      text: "label",
      textAnchor: "start",
      dx: 5,
      dy: -5,
      fill: "white",
      fontSize: 11
    }
  )
]
}));
```