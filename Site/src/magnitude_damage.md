---
title: Same magnitude, same impact?
---

# Same magnitude, same impact?

The magnitude is a the parameter that is used the most to describe an impact of a earthquake. Is this a good parameter to do so?

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();

const minYear = 1800;

const data = data_raw
  .map(d => ({
    Year: +d.Year,
    Mag: +d.Mag,
    Deaths: +d.Deaths,
    Damage: +d["Damage ($Mil)"],
    Location: d.Location
  }))
  .filter(d =>
    d.Year >= minYear &&
    !isNaN(d.Mag) &&
    d.Mag > 0
  );
```
```js
const metric = view(Inputs.radio(
  ["Deaths", "Damage"],
  {label: "Show distribution of", value: "Deaths"}
));
```
```js
const plotData = data
  .map(d => ({
    ...d,
    Impact: metric === "Deaths" ? d.Deaths : d.Damage,
    MagClass:
      d.Mag < 5 ? "5 or less" :
      d.Mag < 6 ? "5–6" :
      d.Mag < 7 ? "6–7" :
      d.Mag < 8 ? "7–8" :
      "8 or more"
  }))
  .filter(d => !isNaN(d.Impact) && d.Impact > 0);
```

```js
display(Plot.plot({
  title: metric === "Deaths"
    ? "Distribution of deaths by magnitude class"
    : "Distribution of economic damage by magnitude class",
  width: 850,
  height: 500,
  marginLeft: 70,
  x: {
    label: "Magnitude class →"
  },
  y: {
    label: metric === "Deaths" ? "↑ Deaths" : "↑ Damage ($Mil)",
    type: "log",
    grid: true,
    tickFormat: d3.format("~s")
  },
  color: {
    legend: false
  },
  marks: [
    Plot.boxY(plotData, {
      x: "MagClass",
      y: "Impact",
      fill: "steelblue"
    }),
    Plot.dot(plotData, {
      x: "MagClass",
      y: "Impact",
      fill: "grey",
      opacity: 0.18,
      r: 2,
      jitter: 0.25,
      tip: true,
      title: d => `Location: ${d.Location || "Unknown"}
Magnitude: ${d.Mag}
Deaths: ${isNaN(d.Deaths) ? "?" : d.Deaths}
Damage ($Mil): ${isNaN(d.Damage) ? "?" : d.Damage}`
    })
  ]
}));
```