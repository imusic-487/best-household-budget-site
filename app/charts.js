// HomeLedger charts: small SVG charts drawn from the household's own figures.
// No chart library, no images — the donut and the bars are plain SVG, so they
// render identically on a desktop and on a phone and cost nothing to load.

function polar(cx, cy, radius, angleDeg) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function donutSlice(cx, cy, outer, inner, startAngle, endAngle) {
  const [x1, y1] = polar(cx, cy, outer, startAngle);
  const [x2, y2] = polar(cx, cy, outer, endAngle);
  const [x3, y3] = polar(cx, cy, inner, endAngle);
  const [x4, y4] = polar(cx, cy, inner, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${outer} ${outer} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${inner} ${inner} 0 ${large} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
}

// A donut of spending by category. `slices` is [{label, value, color}].
// The centre shows the month's total spend.
export function donutChart(slices, total) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const outer = 104;
  const inner = 66;
  let angle = 0;
  let paths = '';
  for (const slice of slices) {
    if (slice.value <= 0) continue;
    const sweep = (slice.value / total) * 360;
    paths += `<path d="${donutSlice(cx, cy, outer, inner, angle, angle + sweep)}" fill="${slice.color}"><title>${slice.label}: $${slice.value.toFixed(2)}</title></path>`;
    angle += sweep;
  }
  const totalText = '$' + Math.round(total).toLocaleString('en-US');
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, total ${totalText}" class="donut">
    ${paths}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-total">${totalText}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">spent in November</text>
  </svg>`;
}

// A simple vertical bar chart. `bars` is [{label, value}].
export function barChart(bars, maxValue) {
  const width = 560;
  const height = 220;
  const baseline = height - 34;
  const top = 14;
  const slot = width / bars.length;
  const barWidth = Math.min(44, slot * 0.55);
  let shapes = '';
  for (let i = 0; i < bars.length; i += 1) {
    const bar = bars[i];
    const barHeight = Math.max(2, ((baseline - top) * bar.value) / maxValue);
    const x = slot * i + (slot - barWidth) / 2;
    const y = baseline - barHeight;
    shapes += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth}" height="${barHeight.toFixed(1)}" rx="4" fill="#2f6b4f"><title>${bar.label}: $${bar.value.toLocaleString('en-US')}</title></rect>`;
    shapes += `<text x="${(slot * i + slot / 2).toFixed(1)}" y="${y - 6}" text-anchor="middle" class="bar-value">$${bar.value.toLocaleString('en-US')}</text>`;
    shapes += `<text x="${(slot * i + slot / 2).toFixed(1)}" y="${baseline + 20}" text-anchor="middle" class="bar-label">${bar.label}</text>`;
  }
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly spending trend" class="bars">
    <line x1="0" y1="${baseline}" x2="${width}" y2="${baseline}" class="bar-axis" />
    ${shapes}
  </svg>`;
}

// A horizontal progress bar for one budget line. `pct` is 0..1 (over 1 = over budget).
export function progressBar(pct, over) {
  const width = Math.min(100, Math.max(0, pct * 100));
  return `<div class="meter" role="progressbar" aria-valuenow="${Math.round(pct * 100)}" aria-valuemin="0" aria-valuemax="100">
    <div class="meter-fill${over ? ' over' : ''}" style="width:${width}%"></div>
  </div>`;
}
