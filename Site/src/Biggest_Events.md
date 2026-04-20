---
title: Do a few earthquakes dominate impact?
---

# Do a few earthquakes dominate impact?

```js
const data_raw = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();

const minYear = 1800;

const data = data_raw
  .map(d => ({
    Year: +d.Year,
    Deaths: +d.Deaths,
    Damage: +d["Damage ($Mil)"],
    Location: d["Location Name"]
  }))
  .filter(d => d.Year >= minYear);
```

```js
const metric = view(Inputs.radio(
  ["Deaths", "Damage"],
  {label: "Measure impact by", value: "Deaths"}
));
```

```js
const ranked = data
  .map(d => ({
    ...d,
    Impact: metric === "Deaths" ? +d.Deaths : +d.Damage,
    Label: `${d.Location || "Unknown"} (${d.Year})`
  }))
  .filter(d => !isNaN(d.Impact) && d.Impact > 0)
  .sort((a, b) => d3.descending(a.Impact, b.Impact));

const totalImpact = d3.sum(ranked, d => d.Impact);

let cumulative = 0;
const cumulativeData = ranked.map((d, i) => {
  cumulative += d.Impact;
  return {
    shareEvents: (i + 1) / ranked.length,
    shareImpact: cumulative / totalImpact
  };
});

const top10 = ranked.slice(0, 10);
```

```js
display(Plot.plot({
  title: metric === "Deaths"
    ? "Cumulative share of total deaths"
    : "Cumulative share of total economic damage",
  width: 850,
  height: 450,
  x: {
    label: "Share of earthquakes →",
    tickFormat: d3.format(".0%"),
    grid: true
  },
  y: {
    label: "↑ Share of total impact",
    tickFormat: d3.format(".0%"),
    grid: true
  },
  marks: [
    Plot.line(cumulativeData, {
      x: "shareEvents",
      y: "shareImpact",
      stroke: "steelblue",
      strokeWidth: 3
    }),
    Plot.dot(cumulativeData, {
      x: "shareEvents",
      y: "shareImpact",
      r: 2,
      fill: "steelblue"
    }),
    Plot.ruleX([0.1], {stroke: "grey", strokeDasharray: "4,2"}),
    Plot.ruleY([0.5], {stroke: "grey", strokeDasharray: "4,2"})
  ]
}));
```

```js
display(Plot.plot({
  title: metric === "Deaths"
    ? "Top 10 earthquakes by deaths"
    : "Top 10 earthquakes by economic damage",
  width: 850,
  height: 500,
  marginLeft: 260,
  x: {
    label: metric === "Deaths" ? "Deaths →" : "Damage ($Mil) →",
    type: "log",
    grid: true,
    tickFormat: d3.format("~s")
  },
  y: {
    label: null,
    domain: top10.map(d => d.Label).reverse()
  },
  marks: [
    Plot.dot(top10, {
      x: "Impact",
      y: "Label",
      r: 6,
      fill: "darkorange",
      tip: true,
      title: d => `${d.Label}
${metric}: ${d3.format(",")(d.Impact)}`
    }),
    Plot.text(top10, {
      x: "Impact",
      y: "Label",
      text: d => d3.format("~s")(d.Impact),
      dx: 8,
      textAnchor: "start",
      fill: "white"
    })
  ]
}));
```

```js
const top10Impact = d3.sum(top10, d => d.Impact);
const top10Share = top10Impact / totalImpact;

const top10EventShare = top10.length / ranked.length;
```

```js
html`<p style="margin-top: 1rem; font-size: 16px;">
  The top 10 earthquakes represent <strong>${d3.format(".1%")(top10EventShare)}</strong> 
  of all earthquakes, but account for <strong>${d3.format(".1%")(top10Share)}</strong> 
  of the total ${metric === "Deaths" ? "deaths" : "economic damage"} 
  (<strong>${d3.format(",")(top10Impact)}</strong> 
  ${metric === "Deaths" ? "deaths" : "million dollars"}).
</p>`
```

