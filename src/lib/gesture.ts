export interface GesturePoint {
  x: number;
  y: number;
  t: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Heuristic reading of a drawn circle: stroke speed and circle size lean
 * toward the assertive/careful (X) axis, and how wobbly the circle is
 * leans toward the expressive/precise (Y) axis.
 */
export function analyzeGesture(
  points: GesturePoint[],
  canvasWidth: number,
  canvasHeight: number
): { scoreX: number; scoreY: number } {
  if (points.length < 8) {
    return { scoreX: 1, scoreY: 1 };
  }

  let pathLength = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    pathLength += Math.hypot(dx, dy);
  }
  const duration = Math.max(points[points.length - 1].t - points[0].t, 1);
  const speed = pathLength / duration;

  const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const radii = points.map((p) => Math.hypot(p.x - cx, p.y - cy));
  const meanRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
  const variance =
    radii.reduce((a, b) => a + (b - meanRadius) ** 2, 0) / radii.length;
  const wobble = meanRadius > 0 ? Math.sqrt(variance) / meanRadius : 0;
  const sizeRatio = meanRadius / (Math.min(canvasWidth, canvasHeight) / 2);

  const speedScore = clamp((speed - 0.3) / 0.5, -1, 1) * 4;
  const sizeScore = clamp((sizeRatio - 0.4) / 0.4, -1, 1) * 4;
  const wobbleScore = clamp((wobble - 0.15) / 0.2, -1, 1) * 4;

  return {
    scoreX: Math.round(speedScore * 0.6 + sizeScore * 0.4),
    scoreY: Math.round(wobbleScore),
  };
}
