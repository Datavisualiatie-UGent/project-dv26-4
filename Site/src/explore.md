---
theme: dashboard
title: Are earthquakes random?
toc: false
---

# Are earthquakes random?

## What is an earthquake?
An earthquake occurs due to the release of energy from the Earth's crust, particulary present at the boundaries of tectonic plates


</style>
<div class="card" style="padding: 1rem;">
 <h2>Earthquake Map </h2>
  <h3>You can zoom and interact with the dots </h3>

```js
import {rangeInput} from "./components/rangeSlider.js";
```

```js
const tectonicPlates = await FileAttachment("data/PB2002_boundaries.json").json();

const minYear = 1800;

const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();
const data = data_raw.filter(d => +d.Year >= minYear);

const maxYear = d3.max(data, d => +d.Year);
const world = await FileAttachment("data/world.geo.json").json();



const showTectonic = view(Inputs.toggle({label: "Show tectonic plates", value: false}));
const yearRange = view(rangeInput({min: 1800, max: 2026, step: 1, value: [minYear, maxYear]}));

```
<!-- Toon de cijfers onder de slider -->
<div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 0.5rem;">
  <span><strong>${minYear}</strong></span>
  Showing: <strong>${yearRange[0]}</strong> – <strong>${yearRange[1]}</strong>
  <span><strong>${maxYear}</strong></span>
</div>

```js


// Datarange selecteren, alle jaren die boven min jaar zitten en een magnitude hebben groter dan 0
const filtered = data.filter(d => +d.Year >= yearRange[0] && +d.Year <= yearRange[1] && +d.Mag > 0);

// Kleurschaal definiëren
const colorScale = d3.scaleSequential()
  .domain([0, 10])
  .interpolator(t => d3.interpolateRdBu(1 - t));
const magScale = d3.scaleSqrt().domain([0, 10]).range([1, 15]);

// Dynamische kaartgrootte
display(resize((width) => {
  const height = width / 2;
  const projection = d3.geoNaturalEarth1().fitSize([width, height], world);
  const path = d3.geoPath(projection);
  
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("cursor", "grab");

  const g = svg.append("g");


  // Kaart toevoegen
  g.append("g")
    .selectAll("path")
    .data(world.features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#eee")
    .attr("stroke", "#999");

 // Plaatgrenzen
if (showTectonic) {
  g.append("g")
    .attr("class", "tectonic")
    .selectAll("path")
    .data(tectonicPlates.features)
    .join("path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("opacity", 0.7);
}
  // Tooltip 
  const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("border", "1px solid #ccc")
    .style("border-radius", "6px")
    .style("padding", "8px 12px")
    .style("font-size", "13px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Elementen toevoegen op kaart
    g.append("g")
    .selectAll("circle")
    .data(filtered)
    .join("circle")
    .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
    .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
    .attr("r", 2) // groote dots
    .attr("fill", d => colorScale(+d.Mag))  // gevulde dots
    .attr("stroke", "none")
    .attr("opacity", 0.7)
    .style("cursor", "pointer")
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1)
        .html(`
            <strong>Magnitude:</strong> ${d.Mag}<br/>
            <strong>Year:</strong> ${d.Year}<br/>
            <strong>Deaths:</strong> ${d["Deaths"] || "?"}<br/>
            <strong>Damage ($Mil):</strong> ${d["Damage ($Mil)"] || "?"}<br/>
        `);
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", (event.pageX + 12) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  // Zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
      svg.style("cursor", "grabbing");
      g.selectAll("circle")
        .attr("r", 2 / event.transform.k); // schaal bij zoomen
    })
    .on("end", () => svg.style("cursor", "grab"));

  // ─── Legend ───────────────────────────────────────────────────────────────
const legendWidth = 180;
const legendHeight = 12;
const legendX = 16;
const legendY = height - 50;

const defs = svg.append("defs");
const linearGradient = defs.append("linearGradient")
  .attr("id", "mag-legend-gradient")
  .attr("x1", "0%").attr("x2", "100%");

// Sample the colorScale across [0, 10]
const steps = 10;
d3.range(steps + 1).forEach(i => {
  linearGradient.append("stop")
    .attr("offset", `${(i / steps) * 100}%`)
    .attr("stop-color", colorScale(i));
});

const legend = svg.append("g")
  .attr("transform", `translate(${legendX}, ${legendY})`);

// Achtergrondvulling
legend.append("rect")
  .attr("x", -8).attr("y", -18)
  .attr("width", legendWidth + 16).attr("height", legendHeight + 36)
  .attr("rx", 6)
  .attr("fill", "white")
  .attr("opacity", 0.75);

// Titel
legend.append("text")
  .attr("x", 0).attr("y", -4)
  .attr("font-size", "11px")
  .attr("font-weight", "600")
  .attr("fill", "#333")
  .text("Magnitude");

// Gradient
legend.append("rect")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .attr("rx", 3)
  .style("fill", "url(#mag-legend-gradient)");

// As ticks: 0, 2, 4, 6, 8, 10
[0, 2, 4, 6, 8, 10].forEach(val => {
  const xPos = (val / 10) * legendWidth;
  legend.append("line")
    .attr("x1", xPos).attr("x2", xPos)
    .attr("y1", legendHeight).attr("y2", legendHeight + 4)
    .attr("stroke", "#555").attr("stroke-width", 1);
  legend.append("text")
    .attr("x", xPos).attr("y", legendHeight + 14)
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "#444")
    .text(val);
});
// ──────────────────────────────────────────────────────────────────────────
  svg.call(zoom);

  // Dubbelklik om zoom te resetten
  svg.on("dblclick.zoom", () => {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  });
  return svg.node();
}));
```
</div>

## The Ring of Fire
The Ring of Fire is a large belt with high tectonic activity, causing earthquakes and volcanoes

## Benelux earthquakes?

```js
range
```



```js
Plot.plot({
  inset: 8,
  grid: true,
  color: { legend: true },
  marks: [
    Plot.dot(filteredData, {
      x: "Year",
      y: "Deaths",
      tip: true
    })
  ]
})
y: { type: "log" }
```

```js
Plot.plot({
  inset: 8,
  grid: true,
  x: {
    domain: range
  },
  y: {
    type: "log"
  },
  color: { legend: true },
  marks: [
    // Original dots
    Plot.dot(filteredData, {
      x: "Year",
      y: d => +d.Deaths,
      stroke: "gray",
      opacity: 0.5,
      tip: true
    }),

    // Mean deaths per year (line)
    Plot.line(yearlyStats, {
      x: "Year",
      y: "meanDeaths",
      stroke: "blue",
      strokeWidth: 2
    }),

    // Total deaths per year (line)
    Plot.line(yearlyStats, {
      x: "Year",
      y: "totalDeaths",
      stroke: "red",
      strokeWidth: 2
    })
  ]
})
```