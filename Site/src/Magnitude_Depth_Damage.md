---
title: Depth, magnitude and impact
---

# Depth, magnitude and impact

Depth, magnitude, damage and deaths are key factors in describing earthquakes. Is there any relation between these factors?

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();

const minYear = 1800;

const data = data_raw
  .map(d => ({
    Year: +d.Year,
    Depth: +d["Focal Depth (km)"],
    Mag: +d.Mag,
    Deaths: +d.Deaths,
    Damage: +d["Damage ($Mil)"],
    Location: d.Location
  }))
  .filter(d =>
    d.Year >= minYear &&
    !isNaN(d.Depth) &&
    d.Depth > 0 &&
    !isNaN(d.Mag) &&
    d.Mag > 0
  );
```

```js
const plotData = data.map(d => ({
  ...d,
  Impact: colorMetric === "Deaths" ? +d.Deaths : +d.Damage
}));

const positiveImpact = plotData.filter(d => !isNaN(d.Impact) && d.Impact > 0);
const zeroImpact = plotData.filter(d => isNaN(d.Impact) || d.Impact === 0);
```
```js
display(Plot.plot({
  title: "Earthquake density in depth–magnitude space",
  width: 850,
  height: 500,
  inset: 10,
  x: {
    label: "Depth (km) →",
    type: "log",
    grid: true
  },
  y: {
    label: "↑ Magnitude",
    domain: [2.5, 10],
    grid: true
  },
  color: {
    label: "Number of earthquakes",
    scheme: "viridis",
    legend: true
  },
  marks: [
    Plot.dot(
      data,
      Plot.hexbin(
        {fill: "count"},
        {
          x: "Depth",
          y: "Mag",
          binWidth: 18,
          tip: true
        }
      )
    ),
    Plot.ruleX([70, 300], {
      stroke: "white",
      strokeOpacity: 0.7,
      strokeWidth: 2
    }),
    Plot.text(
      [{x: 50, label: "← Shallow"}],
      {
        x: "x",
        text: "label",
        frameAnchor: "top",
        dy: -10,
        fill: "grey",
        fontSize: 14,
        fontWeight: "bold"
      }
    ),
    Plot.text(
      [{x: 150, label: "← Intermediate →"}],
      {
        x: "x",
        text: "label",
        frameAnchor: "top",
        dy: -10,
        fill: "grey",
        fontSize: 14,
        fontWeight: "bold"
      }
    ),
    Plot.text(
      [{x: 400, label: "Deep →"}],
      {
        x: "x",
        text: "label",
        frameAnchor: "top",
        dy: -10,
        fill: "grey",
        fontSize: 14,
        fontWeight: "bold"
      }
    )
  ]
}));
```

```js
const colorMetric = view(Inputs.radio(
  ["Deaths", "Damage"],
  {label: "Color dots by", value: "Deaths"}
));
```

```js
display(Plot.plot({
  title: colorMetric === "Deaths"
    ? "Magnitude vs depth, with deaths highlighted"
    : "Magnitude vs depth, with economic damage highlighted",
  width: 850,
  height: 520,
  inset: 10,
  x: {
    label: "Depth (km) →",
    type: "log",
    grid: true
  },
  y: {
    label: "↑ Magnitude",
    domain: [2.5, 10],
    grid: true
  },
  color: {
    label: colorMetric === "Deaths" ? "Deaths" : "Damage ($Mil)",
    type: "log",
    scheme: colorMetric === "Deaths" ? "reds" : "blues",
    legend: true
  },
  marks: [
    Plot.dot(zeroImpact, {
      x: "Depth",
      y: "Mag",
      stroke: "grey",
      strokeOpacity: 0.2,
      fill: "grey",
      fillOpacity: 0.08,
      r: 3
    }),
    Plot.dot(positiveImpact, {
      x: "Depth",
      y: "Mag",
      fill: d => d.Impact,
      r: 4,
      opacity: 0.75,
      tip: true,
      title: d => `Location: ${d.Location || "Unknown"}
Year: ${d.Year}
Depth: ${d.Depth} km
Magnitude: ${d.Mag}
Deaths: ${isNaN(d.Deaths) ? "?" : d.Deaths}
Damage ($Mil): ${isNaN(d.Damage) ? "?" : d.Damage}`
    }),
    Plot.ruleX([70, 300], {
      stroke: "white",
      strokeOpacity: 0.7,
      strokeWidth: 2
    }),
    Plot.text(
      [{x: 50, label: "← Shallow"}],
      {
        x: "x",
        text: "label",
        frameAnchor: "top",
        dy: -10,
        fill: "grey",
        fontSize: 14,
        fontWeight: "bold"
      }
    ),
    Plot.text(
      [{x: 150, label: "← Intermediate →"}],
      {
        x: "x",
        text: "label",
        frameAnchor: "top",
        dy: -10,
        fill: "grey",
        fontSize: 14,
        fontWeight: "bold"
      }
    ),
    Plot.text(
      [{x: 400, label: "Deep →"}],
      {
        x: "x",
        text: "label",
        frameAnchor: "top",
        dy: -10,
        fill: "grey",
        fontSize: 14,
        fontWeight: "bold"
      }
    )
  ]
}));
```
