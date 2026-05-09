---
title: Do a few earthquakes dominate impact?
---


# Do a few earthquakes dominate impact?

## Distribution of earthquakes
Earthquakes have been occuring ever since the solidification of the Earth's crust. Only relatively recently have we been able to measure these earthquakes and compile them into a dataset. When looking at the recorded earthquakes with casualties and/or damages since 1800 some trends can be seen.

1. The first seismometers started appearing in the 1880's, which was quicly followed by an expansion of the world's seismographic network.

2. In the 1960's a global network of 120 seismograph stations was built, producing high-quality seismic data. The network was called the World-Wide Standardized Seismograph Network (WWSSN)

3. In the 1990's digital monitoring started becomingen mainstream, allowing for more accurate earthquake measurements.

The increase in the amount of <6 magnitude earthquakes can be attributed to a larger coverage and better detection by seismographs.
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

```js
const data_raw2 = await FileAttachment("data/earthquakes-2026-03-26_13-34-17_+0100.tsv").tsv();

const maxYear = d3.max(data_raw, d => +d.Year);

const impact_data = data_raw2
  .map(d => ({
    Year: +d.Year,
    Deaths: +d.Deaths,
    Damage: +d["Damage ($Mil)"],
    Location: d["Location Name"]
  }))
  .filter(d => d.Year >= minYear);
```

## Frequency of earthquakes

The rule of thumb for earthquakes is that the frequency of the earthquake is inversely proportional with its magnitude. With our data set this does not hold up due to the constriction that every earthquake must have damage or casualties.

```js
const pyramidData = Array.from(
  d3.rollup(
    data_raw.filter(d => +d.Mag > 0 && +d.Year >= minYear),
    v => v.length / (maxYear - minYear + 1), // yearly average
    d => Math.floor(+d.Mag) // integer magnitude bucket
  ),
  ([Mag, AvgPerYear]) => ({ Mag, AvgPerYear })
).sort((a, b) => a.Mag - b.Mag);

const maxFreq = d3.max(pyramidData, d => d.AvgPerYear);

display(Plot.plot({
  title: "Average yearly frequency of earthquakes by magnitude",
  width: 850,
  height: 450,
  marginLeft: 60,

  x: {
    label: "← Yearly frequency →",
    domain: [-maxFreq * 1.1, maxFreq * 1.1],
    tickFormat: d => Math.abs(d),
    grid: true
  },

  y: {
    label: "↑ Magnitude",
    tickFormat: d => `M ${d}–${d + 1}`,
    reverse: true,
    grid: false
  },

  marks: [
    // Left bars (mirrored)
    Plot.barX(pyramidData, {
      x1: 0,
      x2: d => -d.AvgPerYear,
      y: "Mag",
      fill: "steelblue",
      insetTop: 3,
      insetBottom: 3,
      title: d => `M ${d.Mag}–${d.Mag + 1}: ${d.AvgPerYear.toFixed(1)}/yr`
    }),
    // Right bars
    Plot.barX(pyramidData, {
      x1: 0,
      x2: d => d.AvgPerYear,
      y: "Mag",
      fill: "steelblue",
      insetTop: 3,
      insetBottom: 3,
      title: d => `M ${d.Mag}–${d.Mag + 1}: ${d.AvgPerYear.toFixed(1)}/yr`
    }),
    // Center rule
    Plot.ruleX([0], { stroke: "white", strokeWidth: 2 })
  ]
}));
```

## Distribution of deaths & damage
Earthquakes happen relatively often, but their impact on the earth varies wildly. Most of the total amount of deaths & damages come from a few devestating earthquakes. 
It can be seen on the graph that the cumulative share of earthquakes are heavily skewed.

```js
const metric = view(Inputs.radio(
  ["Deaths", "Damage"],
  {label: "Measure impact by", value: "Deaths"}
));
```

```js
const ranked = impact_data
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



## What earthquakes exactly?
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

