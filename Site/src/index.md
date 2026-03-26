---
toc: false
---

<div class="hero">
  <h1>Earthquakes</h1>
  <h2>Welcome to your new app! Edit&nbsp;<code style="font-size: 90%;">src/index.md</code> to change this page.</h2>
  <a href="https://observablehq.com/framework/getting-started">Get started<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>


---
<style>


.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}


</style>
<div class="card" style="padding: 1rem;">
 <h2>Earthquake Map </h2>
  <h3>test </h3>

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();
const minYear = 1800;
const data = data_raw.filter(d => +d.Year >= minYear);
const world = await FileAttachment("data/world.geo.json").json();
const maxYear = d3.max(data, d => +d.Year);

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

  // Zoombare groep
  const g = svg.append("g");
  const CircleSize = 

  // Kaart toevoegen
  g.append("g")
    .selectAll("path")
    .data(world.features)
    .join("path")
    .attr("d", path)
    .attr("fill", "#eee")
    .attr("stroke", "#999");

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
        .attr("r", d => magScale(d) / event.transform.k);
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