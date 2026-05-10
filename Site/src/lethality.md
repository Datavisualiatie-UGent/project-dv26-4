---

title: An earthquake, always deadly?
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
```


<div class="grid grid-cols-4">
  <div class="card">
    <h2>Earthquakes since ${minYear}</h2>
    <span class="big">${count.toLocaleString('en-US')}</span>
  </div>
  <div class="card">
    <h2>Deaths since ${minYear}</h2> 
    <span class="big">${totalDeaths.toLocaleString('en-US')}</span>
  </div>
  <div class="card">
    <h2>Average Magnitude</h2>
    <span class="big">${avgMag.toFixed(2)}</span>
  </div>
  <div class="card">
    <h2>Total Cost</h2>
    <span class="big">$${(cost/1000).toFixed(1)}B</span>
  </div>
</div>

## What is an earthquake magnitude?
The magnitude of an earthquake is measured on a **logarthimic** scale (and can thus even be negative!). A magnitude increase of 1 thus corresponds to a tenfold increase in wave amplitude. However, the associated energy release increases by much more than that: approximately **thirty times** for each unit increase. For example, a magnitude 7 earthquake releases roughly 900 times more energy than a magnitude 5 earthquake. In terms of energy, each one-unit increase in magnitude corresponds to an increase of about 1.6×10^13.

The dataset mostly uses the **moment magnitude** (Mw) scale. The seismic moment is a physical measure that depends on how much a fault slips and the total area of the fault that moves during an earthquake. Because it reflects both slip and rupture area, it is directly related to the total size of the event. The moment can be determined from seismograms. It is then converted into a magnitude value using a standard formula, producing the moment magnitude. This scale is designed to reliably represent earthquake size across the entire range of magnitudes, overcoming limitations found in earlier magnitude scales.

## Correlation between magnitude and casualties?

A higher magnitude increases the chance of high casualties, but a high magnitude does not exclude few casualties. 

```js
display(Plot.plot({
  title: "Magnitude vs Casualties",
  width: 800,
  height: 400,
  inset: 8,
  grid: true,
  x: {
    label: "Deaths →",
    type: "log",
  },
  y: {
    label: "↑ Magnitude",
    domain: [0, 10]
  },
  marks: [
    Plot.dot(data_raw.filter(d => +d.Mag > 0), {
      x: d => +d.Deaths,
      y: d => +d.Mag,
      fill: "steelblue",
      opacity: 0.5,
      r: 3,
      tip: true
    })
  ]
}));
```



# Same magnitude, same impact?

The magnitude is a the parameter that is used the most to describe an impact of a earthquake. Is this a good parameter to do so?

```js
const impact_data = data_raw
  .map(d => ({
    Year: +d.Year,
    Mag: +d.Mag,
    Depth: +d["Focal Depth (km)"],
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
const plotData = impact_data
  .map(d => ({
    ...d,
    Impact: metric === "Deaths" ? d.Deaths : d.Damage,
    MagClass:
      d.Mag < 5 ? "5 or fewer" :
      d.Mag < 6 ? "5–5.9" :
      d.Mag < 7 ? "6–6.9" :
      d.Mag < 8 ? "7–7.9" :
      "8 or more",
    DepthClass:
      isNaN(d.Depth) ? null :
      d.Depth < 70 ? "0–70 km" :
      d.Depth < 300 ? "70–300 km" :
      "> 300 km"
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
Depth: ${isNaN(d.Depth) ? "?" : d.Depth} km
Deaths: ${isNaN(d.Deaths) ? "?" : d.Deaths}
Damage ($Mil): ${isNaN(d.Damage) ? "?" : d.Damage}`
    })
  ]
}));
```

```js
display(Plot.plot({
  title: metric === "Deaths"
    ? "Distribution of deaths by depth class"
    : "Distribution of economic damage by depth class",
  width: 850,
  height: 500,
  marginLeft: 70,
  x: {
    label: "Depth class →"
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
    Plot.boxY(
      plotData.filter(d => d.DepthClass !== null),
      {
        x: "DepthClass",
        y: "Impact",
        fill: "darkgreen"
      }
    ),
    Plot.dot(
      plotData.filter(d => d.DepthClass !== null),
      {
        x: "DepthClass",
        y: "Impact",
        fill: "grey",
        opacity: 0.18,
        r: 2,
        jitter: 0.25,
        tip: true,
        title: d => `Location: ${d.Location || "Unknown"}
Magnitude: ${d.Mag}
Depth: ${isNaN(d.Depth) ? "?" : d.Depth} km
Deaths: ${isNaN(d.Deaths) ? "?" : d.Deaths}
Damage ($Mil): ${isNaN(d.Damage) ? "?" : d.Damage}`
      }
    )
  ]
}));
```