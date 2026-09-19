window.renderVisitorMap = function (countries) {
  const canvas = document.querySelector("#visitor-canvas");
  const container = document.querySelector("#visitor-map");
  const tooltip = document.querySelector("#visitor-tooltip");
  const context = canvas.getContext("2d");
  if (!context || !window.d3 || !window.WORLD_COUNTRIES) throw new Error("Map unavailable");

  const counts = new Map(countries.map(({ x, y }) => [x, y]));
  const features = window.WORLD_COUNTRIES.features.filter(feature => feature.properties.code !== "AQ");
  const collection = { type: "FeatureCollection", features };
  const projection = d3.geoNaturalEarth1();
  const formatter = new Intl.NumberFormat("en");
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  const maximum = Math.max(1, ...countries.map(country => country.y));
  let paths = [];
  let active = -1;
  let ratio = 1;

  function paint() {
    context.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
    paths.forEach(({ path, feature }, index) => {
      const count = counts.get(feature.properties.code) || 0;
      const strength = Math.sqrt(count / maximum);
      context.fillStyle = index === active ? "#92bccb" : count > 0
        ? `rgb(${Math.round(174 - strength * 132)}, ${Math.round(214 - strength * 100)}, ${Math.round(194 - strength * 103)})`
        : "#dce7e2";
      context.fill(path);
      context.strokeStyle = "#f6faf8";
      context.lineWidth = 0.7;
      context.stroke(path);
    });
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    projection.fitExtent([[5, 5], [width - 5, height - 5]], collection);
    const path = d3.geoPath(projection);
    paths = features.map(feature => ({ feature, path: new Path2D(path(feature)) }));
    paint();
  }

  function select(index) {
    active = index;
    tooltip.hidden = index < 0;
    if (index >= 0) {
      const feature = features[index];
      const code = feature.properties.code;
      const name = code ? names.of(code) : feature.properties.name;
      const value = code ? counts.get(code) || 0 : null;
      tooltip.textContent = value === null ? `${name}: location unavailable`
        : `${name}: ${formatter.format(value)} ${value === 1 ? "visitor" : "visitors"}`;
    }
    paint();
  }

  canvas.addEventListener("pointermove", event => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * ratio;
    const y = (event.clientY - rect.top) * ratio;
    const index = paths.findIndex(({ path }) => context.isPointInPath(path, x, y));
    if (index !== active) select(index);
  });
  canvas.addEventListener("pointerleave", () => select(-1));
  canvas.addEventListener("blur", () => select(-1));
  canvas.addEventListener("keydown", event => {
    if (event.key === "Escape") select(-1);
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    select((active + direction + features.length) % features.length);
  });

  const summary = countries.filter(({ y }) => y > 0).map(({ x, y }) =>
    `${x ? names.of(x) : "Unknown location"}: ${formatter.format(y)} ${y === 1 ? "visitor" : "visitors"}`);
  document.querySelector("#visitor-countries").textContent = summary.length
    ? summary.join("; ") : "No visitor locations recorded in the last 30 days.";
  container.hidden = false;
  canvas.hidden = false;
  resize();
  new ResizeObserver(resize).observe(container);
};
