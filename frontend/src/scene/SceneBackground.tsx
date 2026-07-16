import { Group, Rect, Path, Circle, Ellipse, Line } from 'react-konva';

/**
 * Vano del motor realista — vista isométrica 2.5D.
 * Incluye: bloque motor, radiador, guarda-fangos, firewall, bandeja batería,
 * sombras proyectadas, líneas de profundidad. La escena no calcula nada,
 * solo da contexto visual al estudiante.
 */
export function SceneBackground() {
  return (
    <Group listening={false}>
      {/* ===== CAPA BASE: SUELO / CHASIS ===== */}
      <Rect
        x={60}
        y={520}
        width={880}
        height={40}
        fill="#1a1a2e"
        stroke="#0f0f1a"
        strokeWidth={2}
      />

      {/* ===== GUARDA-FANGOS IZQUIERDO (lado batería) ===== */}
      <Path
        data="M 60,180 Q 60,140 100,120 L 280,120 Q 320,120 320,160 L 320,520"
        fill="#1e2a3a"
        stroke="#2a3a4a"
        strokeWidth={1.5}
        opacity={0.9}
      />
      {/* Sombra interior guarda-fango izq */}
      <Path
        data="M 80,160 Q 80,130 110,115 L 260,115 Q 290,115 290,150 L 290,400"
        fill="#0f1a2a"
        opacity={0.3}
      />

      {/* ===== GUARDA-FANGOS DERECHO (lado alternador) ===== */}
      <Path
        data="M 940,180 Q 940,140 900,120 L 720,120 Q 680,120 680,160 L 680,520"
        fill="#1e2a3a"
        stroke="#2a3a4a"
        strokeWidth={1.5}
        opacity={0.9}
      />
      {/* Sombra interior guarda-fango der */}
      <Path
        data="M 920,160 Q 920,130 890,115 L 740,115 Q 710,115 710,150 L 710,400"
        fill="#0f1a2a"
        opacity={0.3}
      />

      {/* ===== RADIADOR / REJILLA FRONTAL ===== */}
      <Rect
        x={320}
        y={100}
        width={360}
        height={60}
        rx={4}
        fill="#0d1520"
        stroke="#1a2a3a"
        strokeWidth={2}
      />
      {/* Aletas del radiador */}
      <Group>
        {Array.from({ length: 12 }, (_, i) => (
          <Line
            key={i}
            points={[330 + i * 28, 105, 330 + i * 28, 155]}
            stroke="#1a2a3a"
            strokeWidth={1}
            opacity={0.5}
          />
        ))}
      </Group>
      {/* Logo/emblema central */}
      <Circle cx={500} cy={115} r={12} fill="#1a1a2e" stroke="#3a4a5a" strokeWidth={1} opacity={0.6} />
      <Circle cx={500} cy={115} r={6} fill="#2a3a4a" opacity={0.4} />

      {/* ===== FAROS ===== */}
      {/* Faro izquierdo */}
      <Ellipse cx={110} cy={350} rx={35} ry={50} fill="#0a0f1a" stroke="#2a3a4a" strokeWidth={2} opacity={0.8} />
      <Ellipse cx={110} cy={350} rx={25} ry={35} fill="#1a1a2e" stroke="#3a4a5a" strokeWidth={1} opacity={0.6} />
      <Ellipse cx={110} cy={340} rx={15} ry={20} fill="#fff8e7" opacity={0.15} />
      {/* Faro derecho */}
      <Ellipse cx={890} cy={350} rx={35} ry={50} fill="#0a0f1a" stroke="#2a3a4a" strokeWidth={2} opacity={0.8} />
      <Ellipse cx={890} cy={350} rx={25} ry={35} fill="#1a1a2e" stroke="#3a4a5a" strokeWidth={1} opacity={0.6} />
      <Ellipse cx={890} cy={340} rx={15} ry={20} fill="#fff8e7" opacity={0.15} />

      {/* ===== PARABRISAS / FIREWALL ===== */}
      <Path
        data="M 140,90 L 860,90 Q 880,70 860,50 L 140,50 Q 120,70 140,90"
        fill="#0a1525"
        stroke="#1a2a3a"
        strokeWidth={1.5}
        opacity={0.7}
      />
      {/* Limpiaparabrisas (sugeridos) */}
      <Line points={[300, 65, 320, 85]} stroke="#0a1525" strokeWidth={2} opacity={0.4} />
      <Line points={[680, 65, 660, 85]} stroke="#0a1525" strokeWidth={2} opacity={0.4} />

      {/* ===== BLOQUE MOTOR (centro-inferior) ===== */}
      <Rect
        x={360}
        y={420}
        width={280}
        height={100}
        rx={8}
        fill="#151a25"
        stroke="#2a3a4a"
        strokeWidth={2}
        opacity={0.9}
      />
      {/* Detalles del bloque: culata, tapa válvulas */}
      <Rect x={370} y={430} width={260} height={12} rx={2} fill="#1a2030" stroke="#2a3a4a" strokeWidth={1} opacity={0.6} />
      <Rect x={370} y={450} width={120} height={40} rx={2} fill="#1a2030" stroke="#2a3a4a" strokeWidth={1} opacity={0.5} />
      <Rect x={510} y={450} width={120} height={40} rx={2} fill="#1a2030" stroke="#2a3a4a" strokeWidth={1} opacity={0.5} />
      {/* Tornillos de culata */}
      <Group>
        {Array.from({ length: 8 }, (_, i) => (
          <Circle
            key={i}
            cx={390 + (i % 4) * 60}
            cy={436 + Math.floor(i / 4) * 60}
            r={3}
            fill="#2a3a4a"
            opacity={0.5}
          />
        ))}
      </Group>

      {/* ===== BANDEJA BATERÍA (izquierda, sobre guarda-fango) ===== */}
      <Rect
        x={90}
        y={220}
        width={180}
        height={120}
        rx={6}
        fill="#0d1520"
        stroke="#2a3a4a"
        strokeWidth={1.5}
        opacity={0.85}
      />
      {/* Borde elevado bandeja */}
      <Rect x={88} y={218} width={184} height={124} rx={7} fill="transparent" stroke="#3a4a5a" strokeWidth={1} opacity={0.4} />
      {/* Drenaje bandeja */}
      <Circle cx={160} cy={320} r={8} fill="#0a0f1a" stroke="#1a2a3a" strokeWidth={1} opacity={0.6} />

      {/* ===== SOPORTE ALTERNADOR (derecha) ===== */}
      <Path
        data="M 700,420 L 720,380 L 780,380 L 760,420 Z"
        fill="#151a25"
        stroke="#2a3a4a"
        strokeWidth={1.5}
        opacity={0.85}
      />
      <Rect x={715} y={385} width={40} height={25} rx={2} fill="#1a2030" opacity={0.5} />

      {/* ===== CAJA DE FUSIBLES (cerca batería, firewall) ===== */}
      <Rect
        x={300}
        y={170}
        width={100}
        height={50}
        rx={4}
        fill="#0d1520"
        stroke="#2a3a4a"
        strokeWidth={1.5}
        opacity={0.85}
      />
      <Rect x={305} y={175} width={90} height={40} rx={3} fill="#1a2030" stroke="#2a3a4a" strokeWidth={1} opacity={0.5} />
      {/* Tapa fusibles */}
      <Line points={[310, 195, 390, 195]} stroke="#3a4a5a" strokeWidth={1} opacity={0.4} />

      {/* ===== MANGUERAS / LÍNEAS DE FRENO / CABLEADO (sugeridos) ===== */}
      {/* Manguera radiador superior */}
      <Path
        data="M 500,160 Q 480,200 420,260 Q 380,300 350,360"
        fill="transparent"
        stroke="#1a1a2e"
        strokeWidth={10}
        opacity={0.4}
      />
      <Path
        data="M 500,160 Q 480,200 420,260 Q 380,300 350,360"
        fill="transparent"
        stroke="#0d1520"
        strokeWidth={6}
        opacity={0.6}
      />
      {/* Manguera radiador inferior */}
      <Path
        data="M 500,160 Q 520,200 580,260 Q 620,300 650,360"
        fill="transparent"
        stroke="#1a1a2e"
        strokeWidth={10}
        opacity={0.4}
      />
      <Path
        data="M 500,160 Q 520,200 580,260 Q 620,300 650,360"
        fill="transparent"
        stroke="#0d1520"
        strokeWidth={6}
        opacity={0.6}
      />

      {/* ===== CABLEADO PRINCIPAL (arness) ===== */}
      {/* Delante del motor hacia firewall */}
      <Path
        data="M 420,240 Q 440,180 480,140 Q 520,120 580,120"
        fill="transparent"
        stroke="#0a0f1a"
        strokeWidth={8}
        opacity={0.35}
      />
      <Path
        data="M 420,240 Q 440,180 480,140 Q 520,120 580,120"
        fill="transparent"
        stroke="#151a25"
        strokeWidth={4}
        opacity={0.5}
      />

      {/* ===== SOMBRAS PROYECTADAS (profundidad) ===== */}
      {/* Sombra motor */}
      <Ellipse cx={500} cy={530} rx={160} ry={15} fill="#050810" opacity={0.4} />
      {/* Sombra batería */}
      <Ellipse cx={180} cy={350} rx={100} ry={10} fill="#050810" opacity={0.3} />
      {/* Sombra alternador */}
      <Ellipse cx={820} cy={350} rx={80} ry={10} fill="#050810" opacity={0.3} />
      {/* Sombra fusibles */}
      <Ellipse cx={350} cy={230} rx={50} ry={5} fill="#050810" opacity={0.2} />

      {/* ===== LÍNEAS DE PERSPECTIVA (suelo) ===== */}
      <Group opacity={0.15}>
        <Line points={[60, 520, 940, 520]} stroke="#3a4a5a" strokeWidth={1} />
        <Line points={[60, 540, 940, 540]} stroke="#3a4a5a" strokeWidth={1} />
        <Line points={[60, 560, 940, 560]} stroke="#3a4a5a" strokeWidth={1} />
        {/* Líneas convergentes */}
        <Line points={[320, 180, 500, 400]} stroke="#2a3a4a" strokeWidth={0.5} />
        <Line points={[680, 180, 500, 400]} stroke="#2a3a4a" strokeWidth={0.5} />
      </Group>

      {/* ===== ETIQUETAS DE ZONA (sutiles, solo referencia) ===== */}
      <Group fontFamily="Roboto, sans-serif" fontSize={10} fill="#2a3a4a" opacity={0.4}>
        <text x={120} y={210}>BATERÍA</text>
        <text x={320} y={160}>FUSIBLES</text>
        <text x={700} y={370}>ALTERNADOR</text>
        <text x={500} y={415}>BLOQUE MOTOR</text>
        <text x={500} y={100}>RADIADOR</text>
      </Group>
    </Group>
  );
}