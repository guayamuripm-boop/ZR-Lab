import { Group, Rect, Path, Circle, Ellipse, Line } from 'react-konva';

/**
 * Vano del motor — vista superior (top-down).
 * Diseño limpio y realista: base oscura, estructura del vano,
 * componentes de fondo reconocibles. Las piezas interactivas
 * (battery, alternator, etc.) se renderizan aparte encima.
 */
export function SceneBackground() {
  return (
    <Group listening={false}>
      {/* ===== BASE: PISO DEL VANO ===== */}
      <Rect x={40} y={60} width={920} height={500} rx={12} fill="#0c1018" />

      {/* ===== GUARDA-FANGOS / CARROCERÍA ===== */}
      {/* Izquierdo */}
      <Path
        data="M 40,60 L 40,560 Q 40,570 50,570 L 120,570 L 120,60 Z"
        fill="#141c2a"
        stroke="#1e2a3a"
        strokeWidth={1}
      />
      {/* Derecho */}
      <Path
        data="M 960,60 L 960,560 Q 960,570 950,570 L 880,570 L 880,60 Z"
        fill="#141c2a"
        stroke="#1e2a3a"
        strokeWidth={1}
      />

      {/* ===== RADIADOR / REJILLA FRONTAL ===== */}
      <Rect x={130} y={60} width={740} height={45} rx={4} fill="#0a0e16" stroke="#1a2430" strokeWidth={1.5} />
      {/* Aletas del radiador */}
      <Group opacity={0.4}>
        {Array.from({ length: 18 }, (_, i) => (
          <Line
            key={`fin-${i}`}
            points={[145 + i * 40, 66, 145 + i * 40, 99]}
            stroke="#1a2430"
            strokeWidth={1}
          />
        ))}
      </Group>
      {/* Tapón del radiador */}
      <Circle cx={500} cy={82} r={8} fill="#1a2430" stroke="#2a3a4a" strokeWidth={1} />
      <Circle cx={500} cy={82} r={4} fill="#0f1620" />

      {/* ===== FIREWALL / PARABRISAS ===== */}
      <Rect x={130} y={520} width={740} height={40} rx={3} fill="#0a0f18" stroke="#16202e" strokeWidth={1} />
      {/* Pastillas limpiaparabrisas */}
      <Line points={[300, 530, 350, 530]} stroke="#1a2430" strokeWidth={3} strokeLineCap="round" />
      <Line points={[650, 530, 600, 530]} stroke="#1a2430" strokeWidth={3} strokeLineCap="round" />

      {/* ===== BLOQUE MOTOR (centro inferior) ===== */}
      <Rect x={300} y={380} width={380} height={130} rx={6} fill="#101820" stroke="#1e2a3a" strokeWidth={1.5} />
      {/* Tapa de válvulas */}
      <Rect x={310} y={385} width={360} height={25} rx={3} fill="#141e28" stroke="#1e2a3a" strokeWidth={1} />
      {/* Tornillos de culata */}
      <Group>
        {Array.from({ length: 6 }, (_, i) => (
          <Circle key={`bolt-${i}`} cx={340 + i * 60} cy={397} r={3} fill="#1e2a3a" opacity={0.6} />
        ))}
      </Group>
      {/* Cabeza del motor (bloque superior) */}
      <Rect x={320} y={415} width={340} height={50} rx={3} fill="#121a24" stroke="#1a2636" strokeWidth={1} />
      {/* Tapa de aceite (bloque inferior) */}
      <Rect x={340} y={475} width={300} height={30} rx={4} fill="#0e1620" stroke="#1a2430" strokeWidth={1} />

      {/* ===== BANDEJA BATERÍA (izquierda) ===== */}
      <Rect x={130} y={200} width={160} height={130} rx={5} fill="#0c1420" stroke="#1a2636" strokeWidth={1.5} />
      {/* Borde elevado */}
      <Rect x={128} y={198} width={164} height={134} rx={6} fill="transparent" stroke="#1e2a3a" strokeWidth={1} opacity={0.5} />
      {/* Drenaje */}
      <Circle cx={210} cy={310} r={6} fill="#080e18" stroke="#141c28" strokeWidth={1} />

      {/* ===== CAJA DE FUSIBLES (cerca batería) ===== */}
      <Rect x={310} y={170} width={80} height={50} rx={4} fill="#0c1420" stroke="#1a2636" strokeWidth={1.5} />
      {/* Tapa fusibles */}
      <Rect x={315} y={175} width={70} height={40} rx={3} fill="#101a24" stroke="#1a2430" strokeWidth={1} />
      <Line points={[320, 195, 380, 195]} stroke="#1e2a3a" strokeWidth={0.5} opacity={0.5} />

      {/* ===== SOPORTE ALTERNADOR (derecha) ===== */}
      <Path
        data="M 780,380 L 800,340 L 870,340 L 850,380 Z"
        fill="#101820"
        stroke="#1a2636"
        strokeWidth={1.5}
      />
      <Rect x={810} y={345} width={40} height={30} rx={2} fill="#141e28" opacity={0.5} />

      {/* ===== MANGUERAS PRINCIPALES ===== */}
      {/* Manguera radiador superior */}
      <Path
        data="M 500,105 Q 480,160 420,220 Q 380,260 340,320"
        fill="transparent"
        stroke="#0e1620"
        strokeWidth={12}
        opacity={0.5}
      />
      <Path
        data="M 500,105 Q 480,160 420,220 Q 380,260 340,320"
        fill="transparent"
        stroke="#0a1018"
        strokeWidth={7}
        opacity={0.7}
      />
      {/* Manguera radiador inferior */}
      <Path
        data="M 500,105 Q 520,160 580,220 Q 620,260 660,320"
        fill="transparent"
        stroke="#0e1620"
        strokeWidth={12}
        opacity={0.5}
      />
      <Path
        data="M 500,105 Q 520,160 580,220 Q 620,260 660,320"
        fill="transparent"
        stroke="#0a1018"
        strokeWidth={7}
        opacity={0.7}
      />

      {/* ===== CABLEADO / HARNESS ===== */}
      <Path
        data="M 380,200 Q 420,160 480,130 Q 540,120 620,120"
        fill="transparent"
        stroke="#080e16"
        strokeWidth={6}
        opacity={0.35}
      />
      <Path
        data="M 380,200 Q 420,160 480,130 Q 540,120 620,120"
        fill="transparent"
        stroke="#0c1420"
        strokeWidth={3}
        opacity={0.5}
      />

      {/* ===== RESERVORIOS (fluidos) ===== */}
      {/* Refrigerante */}
      <Ellipse cx={180} cy={140} rx={30} ry={20} fill="#0c1420" stroke="#1a2636" strokeWidth={1} />
      <Ellipse cx={180} cy={140} rx={20} ry={12} fill="#101a24" opacity={0.6} />
      {/* Línea de nivel */}
      <Line points={[160, 145, 200, 145]} stroke="#1e3040" strokeWidth={0.5} opacity={0.5} />

      {/* Líquido de frenos */}
      <Ellipse cx={820} cy={140} rx={25} ry={18} fill="#0c1420" stroke="#1a2636" strokeWidth={1} />
      <Ellipse cx={820} cy={140} rx={16} ry={10} fill="#101a24" opacity={0.6} />

      {/* Limpiaparabrisas */}
      <Ellipse cx={160} cy={480} rx={22} ry={15} fill="#0c1420" stroke="#1a2636" strokeWidth={1} />

      {/* ===== SOMBRAS (profundidad) ===== */}
      <Ellipse cx={500} cy={560} rx={200} ry={12} fill="#040810" opacity={0.3} />
      <Ellipse cx={200} cy={340} rx={90} ry={8} fill="#040810" opacity={0.2} />
      <Ellipse cx={830} cy={340} rx={70} ry={8} fill="#040810" opacity={0.2} />

      {/* ===== LÍNEAS ESTRUCTURALES (refuerzos del vano) ===== */}
      <Group opacity={0.12}>
        <Line points={[130, 200, 130, 520]} stroke="#1e2a3a" strokeWidth={1} />
        <Line points={[870, 200, 870, 520]} stroke="#1e2a3a" strokeWidth={1} />
        <Line points={[130, 380, 870, 380]} stroke="#1a2430" strokeWidth={0.5} />
        <Line points={[500, 105, 500, 520]} stroke="#1a2430" strokeWidth={0.5} />
      </Group>
    </Group>
  );
}
