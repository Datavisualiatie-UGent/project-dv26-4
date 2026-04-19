---
title: Does depth Influence damage?
---

# Does depth influence damage?

We explore whether deeper earthquakes result in less damage compared to shallow ones. While magnitude is often used as the main indicator of an earthquake's strength, the depth at which it occurs also plays a crucial role in how much damage is felt at the surface.
```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();

const minYear = 1800;

const data = data_raw
  .map(d => ({
    Year: +d.Year,
    Deaths: +d.Deaths,
    Depth: +d["Focal Depth (km)"],
    Mag: +d.Mag,
    Damage: +d["Damage ($Mil)"]
  }))
  .filter(d =>
    d.Year >= minYear &&
    !isNaN(d.Mag) &&
    !isNaN(d.Depth) &&
    !isNaN(d.Damage) &&
    d.Damage > 0
  );
```
```js
const metric = view(Inputs.radio(
  ["Deaths", "Damage"],
  {label: "Choose impact metric", value: "Deaths"}
));
```
```js
display(Plot.plot({
  title: metric === "Deaths" ? "Depth vs Deaths" : "Depth vs Economic Damage",
  width: 800,
  height: 500,
  inset: 10,
  x: {
    label: "Depth (km) →",
    grid: true,
    type: "log"
  },
  y: {
    label: metric === "Deaths" ? "↑ Deaths" : "↑ Damage ($Mil)",
    type: "log",
    grid: true
  },
  color: {
    label: "Magnitude",
    type: "linear",
    domain: [0, 10],
    interpolate: t => d3.interpolateRdBu(1 - t),
    legend: true
  },
  marks: [
    Plot.dot(
      data.filter(d => metric === "Deaths" ? d.Deaths > 0 : d.Damage > 0),
      {
        x: "Depth",
        y: d => metric === "Deaths" ? d.Deaths : d.Damage,
        fill: "Mag",
        r: 4,
        opacity: 0.5,
        tip: true
      }
    ),
    Plot.ruleX([70], {stroke: "white", strokeOpacity: 0.5}),
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


