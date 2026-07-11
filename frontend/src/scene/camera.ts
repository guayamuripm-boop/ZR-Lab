export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2.5;

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

// Limita el paneo para que la escena nunca se aleje más de medio viewport
// fuera de los bordes del contenido (paneo "suave", no un tope duro en el borde).
export function clampPan(
  pan: { x: number; y: number },
  sceneSize: { width: number; height: number },
  viewportSize: { width: number; height: number },
  zoom: number,
): { x: number; y: number } {
  const scaledWidth = sceneSize.width * zoom;
  const scaledHeight = sceneSize.height * zoom;
  const margin = 0.5;

  const minX = -scaledWidth + viewportSize.width * (1 - margin);
  const maxX = viewportSize.width * margin;
  const minY = -scaledHeight + viewportSize.height * (1 - margin);
  const maxY = viewportSize.height * margin;

  return {
    x: Math.min(maxX, Math.max(minX, pan.x)),
    y: Math.min(maxY, Math.max(minY, pan.y)),
  };
}

export function zoomAtPoint(
  camera: CameraState,
  pointer: { x: number; y: number },
  deltaZoom: number,
): CameraState {
  const newZoom = clampZoom(camera.zoom + deltaZoom);
  const zoomRatio = newZoom / camera.zoom;
  return {
    zoom: newZoom,
    x: pointer.x - (pointer.x - camera.x) * zoomRatio,
    y: pointer.y - (pointer.y - camera.y) * zoomRatio,
  };
}

// Decaimiento de velocidad para el paneo con inercia (fricción exponencial).
export function decayVelocity(velocity: { x: number; y: number }, friction = 0.9): { x: number; y: number } {
  return { x: velocity.x * friction, y: velocity.y * friction };
}

export function isVelocityNegligible(velocity: { x: number; y: number }, threshold = 0.5): boolean {
  return Math.abs(velocity.x) < threshold && Math.abs(velocity.y) < threshold;
}
