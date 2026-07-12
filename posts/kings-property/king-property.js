(() => {
  const host = document.getElementById("king-svg");
  const slider = document.getElementById("king-position");
  if (!host || !slider) return;

  const NS = "http://www.w3.org/2000/svg";
  const a = 0, b = 6, W = 900, H = 470;
  const pad = { left: 58, right: 24, top: 28, bottom: 48 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const yMax = 3.15;
  const f = x => 1.35 + 0.42 * Math.sin(1.55 * x) + 0.16 * x;
  const reflected = x => f(a + b - x);
  const X = x => pad.left + (x - a) / (b - a) * plotW;
  const Y = y => pad.top + (yMax - y) / yMax * plotH;
  const base = Y(0);
  const els = {
    t: document.getElementById("king-t"),
    x: document.getElementById("king-x"),
    rx: document.getElementById("king-rx"),
    height: document.getElementById("king-height"),
    areas: document.getElementById("king-areas")
  };

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("aria-hidden", "true");
  host.appendChild(svg);

  const node = (name, attrs = {}, parent = svg) => {
    const el = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    parent.appendChild(el);
    return el;
  };
  const text = (value, x, y, attrs = {}) => {
    const el = node("text", { x, y, ...attrs });
    el.textContent = value;
    return el;
  };
  const points = (fn, lo = a, hi = b, count = 320) => {
    let d = "";
    for (let i = 0; i <= count; i++) {
      const x = lo + (hi - lo) * i / count;
      d += `${i ? "L" : "M"}${X(x).toFixed(2)},${Y(fn(x)).toFixed(2)} `;
    }
    return d;
  };
  const areaPath = (fn, lo, hi) => {
    const curve = points(fn, lo, hi, 150).replace(/^M/, "L");
    return `M${X(lo)},${base} ${curve}L${X(hi)},${base} L${X(lo)},${base} Z`;
  };
  const integral = (fn, lo, hi, n = 600) => {
    if (hi < lo) return -integral(fn, hi, lo, n);
    const h = (hi - lo) / n;
    let sum = 0.5 * (fn(lo) + fn(hi));
    for (let i = 1; i < n; i++) sum += fn(lo + i * h);
    return sum * h;
  };

  const grid = node("g", { stroke: "#aebdcb", "stroke-opacity": ".18" });
  for (let i = 0; i <= 6; i++) {
    node("line", { x1: X(i), y1: pad.top, x2: X(i), y2: base }, grid);
    text(String(i), X(i), base + 27, { fill: "#cbd8e4", "text-anchor": "middle" });
  }
  for (let y = 0; y <= 3; y++)
    node("line", { x1: pad.left, y1: Y(y), x2: W - pad.right, y2: Y(y) }, grid);

  node("line", { x1: pad.left, y1: base, x2: W-pad.right, y2: base, stroke: "#aebdcb" });
  node("line", { x1: X(3), y1: pad.top, x2: X(3), y2: base,
    stroke: "#ffffff", "stroke-opacity": ".35", "stroke-dasharray": "7 7" });
  text("midpoint", X(3), pad.top + 14, { fill: "#cbd8e4", "text-anchor": "middle" });
  text("f(x)", pad.left + 10, pad.top + 20, { fill: "#7be1eb", "font-weight": "700" });
  text("f(a+b−x)", pad.left + 10, pad.top + 42, { fill: "#ffd27a", "font-weight": "700" });

  const blueArea = node("path", { fill: "#57b9c5", "fill-opacity": ".22" });
  const goldArea = node("path", { fill: "#f3c56b", "fill-opacity": ".22" });
  node("path", { d: points(f), fill: "none", stroke: "#57b9c5", "stroke-width": "4" });
  node("path", { d: points(reflected), fill: "none", stroke: "#f3c56b", "stroke-width": "4" });
  const blueStrip = node("rect", { fill: "#7be1eb" });
  const goldStrip = node("rect", { fill: "#ffd27a" });
  const bluePoint = node("circle", { r: 7, fill: "#7be1eb" });
  const goldPoint = node("circle", { r: 7, fill: "#ffd27a" });

  function draw() {
    const t = Number(slider.value);
    const rt = a + b - t;
    const left = Math.min(t, rt), right = Math.max(t, rt);
    blueArea.setAttribute("d", areaPath(f, a, left));
    goldArea.setAttribute("d", areaPath(reflected, right, b));

    const setStrip = (rect, point, x, fn) => {
      const width = 10;
      rect.setAttribute("x", X(x) - width / 2);
      rect.setAttribute("y", Y(fn(x)));
      rect.setAttribute("width", width);
      rect.setAttribute("height", base - Y(fn(x)));
      point.setAttribute("cx", X(x));
      point.setAttribute("cy", Y(fn(x)));
    };
    setStrip(blueStrip, bluePoint, t, f);
    setStrip(goldStrip, goldPoint, rt, reflected);

    els.t.textContent = `t = ${t.toFixed(2)}`;
    els.x.textContent = `x = ${t.toFixed(2)}`;
    els.rx.textContent = `x = ${rt.toFixed(2)}`;
    els.height.textContent = `${f(t).toFixed(3)} = ${reflected(rt).toFixed(3)}`;
    els.areas.textContent =
      `${integral(f, a, left).toFixed(3)} ≈ ${integral(reflected, right, b).toFixed(3)}`;
  }

  function setFromPointer(event) {
    const rect = svg.getBoundingClientRect();
    const viewX = (event.clientX - rect.left) / rect.width * W;
    const ratio = Math.max(0, Math.min(1, (viewX - pad.left) / plotW));
    slider.value = String(a + ratio * (b-a));
    draw();
  }

  let dragging = false;
  svg.addEventListener("pointerdown", event => {
    dragging = true;
    svg.setPointerCapture(event.pointerId);
    setFromPointer(event);
  });
  svg.addEventListener("pointermove", event => dragging && setFromPointer(event));
  svg.addEventListener("pointerup", () => dragging = false);
  svg.addEventListener("pointercancel", () => dragging = false);
  slider.addEventListener("input", draw);
  draw();
})();
