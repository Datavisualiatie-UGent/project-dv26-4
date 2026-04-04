---
theme: dashboard
title: Explore
toc: false
---

# Are earthquakes random?

## What is an earthquake?
An earthquake occurs due to the release of energy from the Earth's crust, particulary present at the boundaries of tectonic plates


</style>
<div class="card" style="padding: 1rem;">
 <h2>Earthquake Map </h2>
  <h3>test </h3>

```js
const tectonicPlates = await FileAttachment("data/PB2002_boundaries.json").json();
const tectonicUrl = await FileAttachment("data/Tectonic_plates_(2022).svg").url();
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();
const minYear = 1800;
const data = data_raw.filter(d => +d.Year >= minYear);
const world = await FileAttachment("data/world.geo.json").json();
const maxYear = d3.max(data, d => +d.Year);
const showTectonic = view(Inputs.toggle({label: "Show tectonic plates", value: false}));
const yearRange = view(Inputs.range([minYear, maxYear], {
  step: 1,
  value: maxYear,
  label: null,
  width: 300
}));
```
<!-- Toon de cijfers onder de slider -->
<div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 0.5rem;">
  <span><strong>${minYear}</strong></span>
  <span>Showing up to: <strong>${yearRange}</strong></span>
  <span><strong>${maxYear}</strong></span>
</div>

```js
// Datarange selecteren, alle jaren die boven min jaar zitten en een magnitude hebben groter dan 0
const filtered = data.filter(d => +d.Year <= yearRange && d.Mag && +d.Mag > 0);
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

 // Tectonic overlay — fitted to exact projection bounds
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
    .attr("r", d => magScale(+d.Mag*0.1))   // ← fixed, no event here
    .attr("fill", "none")
    .attr("stroke", d => colorScale(+d.Mag))
    .attr("stroke-width", 1)
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
        .attr("r", d => magScale(+d.Mag*0.1) / event.transform.k);
      legend.selectAll("circle")
        .attr("r", d => magScale(d*0.1) / event.transform.k);
    })
    .on("end", () => svg.style("cursor", "grab"));

  svg.call(zoom);

  // Dubbelklik om zoom te resetten
  svg.on("dblclick.zoom", () => {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  });

  // Size legend (vast, buiten zoomgroep)
  const legend = svg.append("g")
    .attr("transform", `translate(20, ${height - 80})`);

  legend.append("text")
    .attr("x", 0).attr("y", -8)
    .style("font-size", "11px")
    .style("fill", "#555")
    .text("Magnitude");

  [2, 5, 8].forEach((mag, i) => {
    const r = magScale(mag*0.1 );
    const x = 15 + i * 55;
    const y = 20;

    legend.append("circle")
      .datum(mag)               // ← bind the mag value
      .attr("cx", x).attr("cy", y)
      .attr("r", r)
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-width", 1);

    legend.append("text")
      .attr("x", x).attr("y", y + r + 12)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#555")
      .text(mag);
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



<div class="grid grid-cols-4">
  <div class="card">
    <h2>Aantal aardbevingen</h2>
    <span class="big">${count}</span>
  </div>
  <div class="card">
    <h2>Aantal doden</h2>
    <span class="big">${totalDeaths}</span>
  </div>
  <div class="card">
    <h2>Gemiddelde magnitude</h2>
    <span class="big">${avgMag?.toFixed(2)}</span>
  </div>
  <div class="card">
    <h2>Totale kost ($ miljard)</h2>
    <span class="big">${(cost / 1000).toFixed(3)}</span>
  </div>
</div>


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