// Ai-written code
export function rangeInput({min, max, step = 1, value = [min, max]} = {}) {
  const container = document.createElement("div");
  container.style.cssText = "position:relative;width:100%;padding:1rem 0;";

  const range = document.createElement("div");
  range.style.cssText = "position:relative;height:4px;background:#ddd;border-radius:2px;margin:10px 0;";

  const makeThumb = (v) => {
    const el = document.createElement("input");
    el.type = "range";
    el.min = min;
    el.max = max;
    el.step = step;
    el.value = v;
    el.style.cssText = `
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      width: 100%;
      margin: 0;
      padding: 0;
      height: 4px;
      background: transparent;
      -webkit-appearance: none;
      appearance: none;
      pointer-events: none;
    `;
    // Only allow thumb interaction, not track
    el.style.setProperty("--thumb-pointer", "auto");
    return el;
  };

  const thumbLo = makeThumb(value[0]);
  const thumbHi = makeThumb(value[1]);

  // Style the thumbs via a shared stylesheet
  if (!document.getElementById("range-slider-style")) {
    const style = document.createElement("style");
    style.id = "range-slider-style";
    style.textContent = `
      .range-thumb::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #4682b4;
        cursor: pointer;
        pointer-events: auto;
        border: 2px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }
      .range-thumb::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #4682b4;
        cursor: pointer;
        pointer-events: auto;
        border: 2px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);
  }

  thumbLo.classList.add("range-thumb");
  thumbHi.classList.add("range-thumb");

  const dispatch = () => {
    // Prevent crossover
    if (+thumbLo.value > +thumbHi.value) thumbLo.value = thumbHi.value;
    if (+thumbHi.value < +thumbLo.value) thumbHi.value = thumbLo.value;
    // Always put the lower thumb on top when they meet
    if (+thumbLo.value === +thumbHi.value) {
      thumbLo.style.zIndex = "5";
      thumbHi.style.zIndex = "4";
    } else {
      thumbLo.style.zIndex = "3";
      thumbHi.style.zIndex = "4";
    }
    container.dispatchEvent(new Event("input", { bubbles: true }));
  };

  thumbLo.addEventListener("input", dispatch);
  thumbHi.addEventListener("input", dispatch);

  // Set initial z-index
  thumbLo.style.zIndex = "3";
  thumbHi.style.zIndex = "4";

  range.appendChild(thumbLo);
  range.appendChild(thumbHi);
  container.appendChild(range);

  Object.defineProperty(container, "value", {
    get: () => [+thumbLo.value, +thumbHi.value]
  });

  return container;
}