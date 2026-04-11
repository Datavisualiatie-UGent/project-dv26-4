---
toc: false
---

<div class="hero">
  <h1>Earthquakes</h1>
  <h2>A vast network of seismographs measure vibrations around the Earth and detect earthquakes. This website visualises the earthquakes and aims to show interesting trends.</h2>
  <a href="https://www.ngdc.noaa.gov/hazel/view/hazards/earthquake/event-data">Link to the dataset<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>

---

# The location of earthquakes

[Link to map](explore)

# Lethality of earthquakes
[Link to map](lethality)

# Link with focal depth
[Link to map](magnitude_damage)

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


