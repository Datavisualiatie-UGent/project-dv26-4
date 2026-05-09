---
toc: false

---

<div class="hero">
  <h1>Earthquakes</h1>
  <h2>A vast network of seismographs measure vibrations around the Earth and detect earthquakes. This website visualises the earthquakes and aims to show interesting trends.

  The database includes only earthquakes classified as significant. An earthquake is considered significant if it results in fatalities, causes moderate damage (approximately $1 million or more), has a magnitude of 7.5 or higher, reaches a Modified Mercalli Intensity of X or greater, or generates a tsunami.</h2>
  <a href="https://www.ngdc.noaa.gov/hazel/view/hazards/earthquake/event-data">Link to the dataset<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>
---

## What is an earthquake?
An earthquake occurs due to the release of energy from the Earth's crust, particulary present at the boundaries of tectonic plates. Movement of the Earth's crust continuously builds up energy, eventually releasing through seismic waves, resulting in an earthquake. This release of energy happens at so called faults, and can happen in 3 types (see image).

![different styles of earthquakes](Earthquake.gif "earthquake")
*source: https://scienceexchange.caltech.edu/topics/earthquakes/what-causes-earthquakes*

# The location of earthquakes
Earthquakes do not appear randomly, this page explains where earthquakes have mostly occured and why.

[Link](explore)

# Lethality of earthquakes
Not every earthquake is as deadly, this of course has to do with the magnitude. But how great is the correlation between magnitude and deadliness?

[Link](lethality)

# Link with focal depth
Earthquakes do not originate from the surface. They start from points deeper inside the crust and send waves upwards, what is the effect of this depth on the damages and casualties?

[Link](magnitude_damage)

<style>
.hero {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  margin: 4rem 0 2rem;
  text-align: left;          
  max-width: 800px;          
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

body, #observablehq-main, .observablehq--block {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.text-image-row {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.text-image-row p {
  flex: 1;
}

.text-image-row figure {
  flex: 0 0 auto;
  max-width: 380px;
  margin: 0;
}

.text-image-row img {
  width: 100%;
  border-radius: 6px;
}

.text-image-row figcaption {
  font-size: 12px;
  color: var(--theme-foreground-muted);
  margin-top: 0.4rem;
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}
</style>


