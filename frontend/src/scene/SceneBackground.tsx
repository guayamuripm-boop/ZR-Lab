import { Group, Line, Rect, Circle, Path } from 'react-konva';

/**
 * Silueta del vano del motor — fondo de la escena.
 * Dibuja la carrocería frontal, capó abierto, faros y área de trabajo.
 * La escena no calcula nada, solo da contexto visual al estudiante.
 */
export function SceneBackground() {
  return (
    <Group listening={false}>
      {/* Carrocería frontal - silueta isométrica */}
      <Path
        data="M 50,180 L 950,180 L 980,200 L 980,520 L 950,540 L 50,540 L 20,520 L 20,200 Z"
        fill="transparent"
        stroke="#4a5568"
        strokeWidth={3}
        opacity={0.5}
      />

      {/* Capó abierto (parte superior) */}
      <Path
        data="M 80,180 L 920,180 L 900,120 L 100,120 Z"
        fill="#3a3a3a"
        stroke="#4a5568"
        strokeWidth={2}
        opacity={0.35}
      />

      {/* Parabrisas (línea superior) */}
      <Path
        data="M 100,120 L 900,120 L 880,80 L 120,80 Z"
        fill="transparent"
        stroke="#4a5568"
        strokeWidth={2}
        opacity={0.25}
      />

      {/* Vano del motor (área de trabajo) */}
      <Rect
        x={80}
        y={190}
        width={840}
        height={340}
        cornerRadius={8}
        fill="#1a1a1a"
        stroke="#374151"
        strokeWidth={1}
        opacity={0.35}
      />

      {/* Soporte del motor (bloque inferior) */}
      <Rect
        x={350}
        y={490}
        width={300}
        height={15}
        cornerRadius={4}
        fill="#2d3748"
        stroke="#4a5568"
        strokeWidth={1}
        opacity={0.3}
      />

      {/* Foco izquierdo */}
      <Circle x={60} y={360} radius={18} fill="#e2e8f0" opacity={0.12} />
      <Circle x={60} y={360} radius={12} fill="#f7fafc" opacity={0.08} />

      {/* Foco derecho */}
      <Circle x={940} y={360} radius={18} fill="#e2e8f0" opacity={0.12} />
      <Circle x={940} y={360} radius={12} fill="#f7fafc" opacity={0.08} />

      {/* Rejilla izquierda (3 barras) */}
      <Line points={[25, 310, 25, 410]} stroke="#4a5568" strokeWidth={1} opacity={0.2} />
      <Line points={[35, 300, 35, 420]} stroke="#4a5568" strokeWidth={1} opacity={0.2} />
      <Line points={[45, 295, 45, 425]} stroke="#4a5568" strokeWidth={1} opacity={0.2} />

      {/* Rejilla derecha (3 barras) */}
      <Line points={[975, 310, 975, 410]} stroke="#4a5568" strokeWidth={1} opacity={0.2} />
      <Line points={[965, 300, 965, 420]} stroke="#4a5568" strokeWidth={1} opacity={0.2} />
      <Line points={[955, 295, 955, 425]} stroke="#4a5568" strokeWidth={1} opacity={0.2} />

      {/* Bisagra del capó izquierda */}
      <Line points={[100, 180, 120, 175]} stroke="#4a5568" strokeWidth={2} opacity={0.3} />
      {/* Bisagra del capó derecha */}
      <Line points={[900, 180, 880, 175]} stroke="#4a5568" strokeWidth={2} opacity={0.3} />
    </Group>
  );
}
