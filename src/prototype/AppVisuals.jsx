// Charts for the Today and weekly screens.

import { useId } from "react";

export function DotSpark({ values, color = "var(--app-activity)", label }) {
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const points = values.map((v, i) => [8 + (i * 132) / (values.length - 1), 45 - ((v - min) / range) * 30]);
  const last = points[points.length - 1];
  return (
    <svg className="dot-spark" viewBox="0 0 148 60" role="img" aria-label={label}>
      <rect x="0" y="22" width="148" height="25" rx="7" className="dot-spark-band" />
      <polyline points={points.map((p) => p.join(",")).join(" ")} className="dot-spark-line" />
      {points.slice(0, -1).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" className="dot-spark-point" />)}
      <circle cx={last[0]} cy={last[1]} r="4.5" fill="var(--app-card)" stroke={color} strokeWidth="3" />
    </svg>
  );
}

// Recent readings against the personal baseline: the band is the usual range,
// the dashed line the baseline itself, and the dot the latest reading. The
// fill between the line and the baseline fades out at the baseline, in the
// colour of the trend.
export function BaselineSpark({ values, baseline, band, color = "#898b8c", label, width = 72 }) {
  const fill = useId();
  const reach = Math.max(band, ...values.map((v) => Math.abs(v - baseline)));
  const y = (v) => 28 - ((v - baseline) / reach) * 22;
  const points = values.map((v, i) => [5 + (i * (width - 10)) / (values.length - 1), y(v)]);
  const last = points[points.length - 1];
  const top = y(baseline + band);
  return (
    <svg className="baseline-spark" viewBox={`0 0 ${width} 56`} role="img" aria-label={label}>
      <rect x="0" y={top} width={width} height={y(baseline - band) - top} rx="4" className="dot-spark-band" />
      <defs>
        <linearGradient id={fill} gradientUnits="userSpaceOnUse" x1="0" y1="6" x2="0" y2="50">
          <stop offset="0" stopColor={color} stopOpacity="0.5" />
          <stop offset="0.5" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <polygon points={[...points, [last[0], 28], [points[0][0], 28]].map((p) => p.join(",")).join(" ")} fill={`url(#${fill})`} />
      <line x1="0" y1="28" x2={width} y2="28" className="baseline-spark-base" />
      <polyline points={points.map((p) => p.join(",")).join(" ")} className="baseline-spark-line" style={{ stroke: color }} />
      <circle cx={last[0]} cy={last[1]} r="3.5" className="baseline-spark-now" style={{ stroke: color }} />
    </svg>
  );
}

export function RhythmPath({ values, labels }) {
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const points = values.map((v, i) => [20 + (i * 320) / (values.length - 1), 78 - ((v - min) / range) * 46]);
  return (
    <div className="rhythm-path">
      <svg viewBox="0 0 360 116" role="img" aria-label="Resting heart rate over seven days: 58, 57, 59, 56, 58, 61, and 57 beats per minute. Within your usual range.">
        <path d="M0 30C75 48 122 14 189 25S294 12 360 20V94C286 90 253 108 179 96S72 109 0 94Z" className="rhythm-band deep" />
        <path d="M0 47C70 63 130 31 188 42S289 28 360 36V103C285 94 236 110 167 100S56 108 0 100Z" className="rhythm-band" />
        <path d="M0 84C96 101 142 71 220 85S299 75 360 83V106C260 112 126 108 0 107Z" className="rhythm-band light" />
        <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke="#151518" strokeWidth="2.5" strokeLinejoin="round" />
        {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 6 : 4.5} fill="#fff" stroke="#151518" strokeWidth="2.5" />)}
      </svg>
      <div className="rhythm-labels" aria-hidden="true">{labels.map((label, i) => <span className={i === labels.length - 1 ? "current" : ""} key={i}>{label}</span>)}</div>
    </div>
  );
}

// Weekly sleep durations use the app's purple detail palette and blue bars.
export function SleepBars() {
  const durations = [7.2, 6.1, 5.8, 6.2, 6.8, 7.4, 7.4];
  return (
    <div className="sleep-bars" role="img" aria-label="Sleep duration across the week ranges from 5.8 to 7.4 hours.">
      {durations.map((duration, i) => (
        <div key={i}>
          <span style={{ height: `${duration * 5}px` }} />
          <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
        </div>
      ))}
    </div>
  );
}

// Active minutes per day. The three workout days stand out from the rest.
export function ActivityBars() {
  const minutes = [38, 12, 9, 41, 14, 35, 10];
  return (
    <div className="sleep-bars activity-bars" role="img" aria-label="Active minutes across the week: workouts on Monday, Thursday and Saturday, lighter days in between.">
      {minutes.map((m, i) => (
        <div key={i}>
          <span className={m >= 30 ? "workout" : ""} style={{ height: `${m}px` }} />
          <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
        </div>
      ))}
    </div>
  );
}
