"use client";

interface Props {
  data: { subject: string; score: number }[];
  size?: number;
}

export default function RadarChart({ data, size = 220 }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-white/30 text-sm">
      Complete assessments to see your skill map
    </div>
  );

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = data.length;
  const levels = 4;

  function polar(angle: number, radius: number) {
    const a = (angle - Math.PI / 2);
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  }

  const angles = data.map((_, i) => (2 * Math.PI * i) / n);

  const gridLines = Array.from({ length: levels }, (_, l) => {
    const ri = (r * (l + 1)) / levels;
    return angles.map((a) => polar(a, ri));
  });

  const dataPoints = data.map((d, i) => polar(angles[i], (d.score / 100) * r));
  const polyPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const levelColors = ["rgba(14,165,233,0.03)", "rgba(14,165,233,0.05)", "rgba(14,165,233,0.07)", "rgba(14,165,233,0.10)"];

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid polygons */}
      {gridLines.map((pts, l) => (
        <polygon
          key={l}
          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill={levelColors[l]}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={0.75}
        />
      ))}

      {/* Axis lines */}
      {angles.map((a, i) => {
        const end = polar(a, r);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.75} />;
      })}

      {/* Level labels */}
      {[25, 50, 75, 100].map((v, l) => {
        const pt = polar(angles[0], (r * (l + 1)) / levels);
        return (
          <text key={v} x={pt.x + 3} y={pt.y - 2} fontSize={8} fill="rgba(255,255,255,0.2)" fontFamily="monospace">
            {v}
          </text>
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polyPoints}
        fill="rgba(14,165,233,0.15)"
        stroke="rgba(14,165,233,0.7)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#0ea5e9" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const pt = polar(angles[i], r + 22);
        const textAnchor = pt.x < cx - 5 ? "end" : pt.x > cx + 5 ? "start" : "middle";
        return (
          <g key={i}>
            <text x={pt.x} y={pt.y - 4} fontSize={9} fill="rgba(255,255,255,0.7)" textAnchor={textAnchor} fontWeight="600">
              {d.subject.length > 10 ? d.subject.slice(0, 10) + "…" : d.subject}
            </text>
            <text x={pt.x} y={pt.y + 8} fontSize={9} fill="rgba(14,165,233,0.9)" textAnchor={textAnchor} fontWeight="700">
              {d.score}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
