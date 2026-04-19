---
title: Depth, magnitude and impact
---

# Depth, magnitude and impact

This interactive plot shows how earthquake magnitude relates to focal depth.  
The color of each dot can be switched between fatalities and economic damage.

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
const colorMetric = view(Inputs.radio(
  ["Deaths", "Damage"],
  {label: "Color dots by", value: "Deaths"}
));
```
```js
const filtered = data.filter(d =>
  colorMetric === "Deaths"
    ? !isNaN(d.Deaths) && d.Deaths > 0
    : !isNaN(d.Damage) && d.Damage > 0
);
```
```js
display(Plot.plot({
  title: colorMetric === "Deaths"
    ? "Magnitude vs Depth, colored by deaths"
    : "Magnitude vs Depth, colored by economic damage",
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
  color: colorMetric === "Deaths"
    ? {
        label: "Deaths",
        type: "log",
        scheme: "reds",
        legend: true
      }
    : {
        label: "Damage ($Mil)",
        type: "log",
        scheme: "blues",
        legend: true
      },
  marks: [
    Plot.dot(filtered, {
      x: "Depth",
      y: "Mag",
      fill: d => colorMetric === "Deaths" ? d.Deaths : d.Damage,
      r: 4,
      opacity: 0.65,
      tip: true,
      title: d => `Location: ${d.Location || "Unknown"}
Year: ${d.Year}
Depth: ${d.Depth} km
Magnitude: ${d.Mag}
Deaths: ${isNaN(d.Deaths) ? "?" : d.Deaths}
Damage ($Mil): ${isNaN(d.Damage) ? "?" : d.Damage}`
    }),
    Plot.ruleX([70], {
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
      [{x: 110, label: "Intermediate →"}],
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