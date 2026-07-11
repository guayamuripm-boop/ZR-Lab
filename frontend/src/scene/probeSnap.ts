export interface MeasurementPoint {
  id: string;
  nodeId: string;
  componentId: string;
  x: number;
  y: number;
}

export const SNAP_RADIUS = 30;

export function findNearestMeasurementPoint(
  x: number,
  y: number,
  points: MeasurementPoint[],
  radius = SNAP_RADIUS,
): MeasurementPoint | null {
  let best: MeasurementPoint | null = null;
  let bestDist = Infinity;
  for (const point of points) {
    const dist = Math.hypot(point.x - x, point.y - y);
    if (dist < bestDist) {
      bestDist = dist;
      best = point;
    }
  }
  return best && bestDist <= radius ? best : null;
}
