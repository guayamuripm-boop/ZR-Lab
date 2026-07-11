import layout from './layout.json';

export interface MeasurementPointDef {
  id: string;
  nodeId: string;
  componentId: string;
  x: number;
  y: number;
}

const BY_ID = new Map<string, MeasurementPointDef>(
  layout.measurementPoints.map((p) => [p.id, p as MeasurementPointDef]),
);

// Resuelve el id de un punto de medición de la escena (ej. 'battery-positive')
// al nodo eléctrico real del CircuitEngine (ej. 'N-BAT+'). Devuelve null si el
// punto no existe o si la sonda no está colocada.
export function nodeForMeasurementPoint(pointId: string | null): string | null {
  if (!pointId) return null;
  return BY_ID.get(pointId)?.nodeId ?? null;
}

export function measurementPointById(pointId: string): MeasurementPointDef | undefined {
  return BY_ID.get(pointId);
}

export const allMeasurementPoints: MeasurementPointDef[] = layout.measurementPoints as MeasurementPointDef[];
