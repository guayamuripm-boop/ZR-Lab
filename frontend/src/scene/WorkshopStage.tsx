import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Circle, Image as KonvaImage, Layer, Stage } from 'react-konva';
import { getComponents } from '../services/contentService';
import { useSceneStore } from '../stores/useSceneStore';
import type { DiscoveryStatus } from './ComponentSprite';
import { ComponentSprite } from './ComponentSprite';
import { clampPan, decayVelocity, isVelocityNegligible, zoomAtPoint } from './camera';
import layout from './layout.json';
import { ProbeLayer } from './ProbeLayer';
import { isInLayer } from './subsystems';
import { useIsoImage } from './useIsoImage';
import { WireLayer } from './WireLayer';

export interface WorkshopStageProps {
  width: number;
  height: number;
  theme: 'dark' | 'light';
  accentColor: string;
  discoveredIds: Set<string>;
  masteredIds: Set<string>;
  onComponentClick: (id: string) => void;
}

// Colores de las etiquetas de pieza según el tema (texto + halo para legibilidad).
const LABEL_BY_THEME = {
  dark: { color: '#E6EEFA', halo: '#0B0F22' },
  light: { color: '#21284F', halo: '#FFFFFF' },
} as const;

function statusFor(id: string, discovered: Set<string>, mastered: Set<string>): DiscoveryStatus {
  if (mastered.has(id)) return 'mastered';
  if (discovered.has(id)) return 'seen';
  return 'undiscovered';
}

export function WorkshopStage({
  width,
  height,
  theme,
  accentColor,
  discoveredIds,
  masteredIds,
  onComponentClick,
}: WorkshopStageProps) {
  const [names, setNames] = useState<Record<string, string>>({});
  useEffect(() => {
    getComponents().then((cs) => setNames(Object.fromEntries(cs.map((c) => [c.id, c.name]))));
  }, []);
  const labelStyle = LABEL_BY_THEME[theme];
  const camera = useSceneStore((s) => s.camera);
  const setCamera = useSceneStore((s) => s.setCamera);
  const selectedComponentId = useSceneStore((s) => s.selectedComponentId);
  const ignition = useSceneStore((s) => s.ignition);
  const engineRunning = useSceneStore((s) => s.engineRunning);
  const layerView = useSceneStore((s) => s.layerView);
  const getEngine = useSceneStore((s) => s.getEngine);

  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const inertiaAnim = useRef<Konva.Animation | null>(null);

  const sceneSize = { width: layout.sceneWidth, height: layout.sceneHeight };
  const viewportSize = { width, height };
  const chargeLampOn = getEngine().isChargeLampOn();

  // RF-B3: doble clic/tap centra el componente en el viewport (zoom actual).
  function centerOnPiece(id: string) {
    const piece = layout.pieces.find((p) => p.id === id);
    if (!piece) return;
    const target = {
      x: width / 2 - piece.x * camera.zoom,
      y: height / 2 - piece.y * camera.zoom,
    };
    setCamera({ ...camera, ...clampPan(target, sceneSize, viewportSize, camera.zoom) });
  }

  function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;
    const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
    const next = zoomAtPoint(camera, pointer, delta);
    setCamera({ ...next, ...clampPan(next, sceneSize, viewportSize, next.zoom) });
  }

  function handleDragStart() {
    inertiaAnim.current?.stop();
    lastPointer.current = null;
    velocity.current = { x: 0, y: 0 };
  }

  function handleDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    const pos = { x: e.target.x(), y: e.target.y() };
    if (lastPointer.current) {
      velocity.current = { x: pos.x - lastPointer.current.x, y: pos.y - lastPointer.current.y };
    }
    lastPointer.current = pos;
    setCamera({ ...camera, ...clampPan(pos, sceneSize, viewportSize, camera.zoom) });
  }

  function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
    const layerNode = e.target;
    const anim = new Konva.Animation(() => {
      velocity.current = decayVelocity(velocity.current);
      if (isVelocityNegligible(velocity.current)) {
        anim.stop();
        return;
      }
      const next = clampPan(
        { x: layerNode.x() + velocity.current.x, y: layerNode.y() + velocity.current.y },
        sceneSize,
        viewportSize,
        camera.zoom,
      );
      layerNode.position(next);
      setCamera({ ...camera, ...next });
    }, layerNode.getLayer());
    inertiaAnim.current = anim;
    anim.start();
  }

  return (
    <Stage width={width} height={height} onWheel={handleWheel} style={{ touchAction: 'none' }}>
      <Layer
        x={camera.x}
        y={camera.y}
        scaleX={camera.zoom}
        scaleY={camera.zoom}
        draggable
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <SceneBackdrop theme={theme} width={layout.sceneWidth} height={layout.sceneHeight} />
        <WireLayer crankEnergized={ignition === 'crank'} chargeEnergized={engineRunning} />
        {layout.pieces.map((piece) => (
          <ComponentSprite
            key={piece.id}
            id={piece.id}
            x={piece.x}
            y={piece.y}
            size={piece.displaySize}
            status={statusFor(piece.id, discoveredIds, masteredIds)}
            selected={selectedComponentId === piece.id}
            accentColor={accentColor}
            dimmed={!isInLayer(piece.id, layerView)}
            label={names[piece.id]}
            labelColor={labelStyle.color}
            labelHalo={labelStyle.halo}
            labelDx={piece.labelDx}
            labelDy={piece.labelDy}
            onClick={onComponentClick}
            onDoubleClick={centerOnPiece}
          />
        ))}
        <ChargeLampIndicator on={chargeLampOn} />
        <ProbeLayer />
      </Layer>
    </Stage>
  );
}

// Base del motor + banco de escena (F3.2): fondo de contexto para que las piezas
// se lean "dentro del vehículo". No es interactivo (listening=false) y va detrás de
// cables y piezas. Si el SVG aún no cargó, no pinta nada (la escena sigue usable).
function SceneBackdrop({ theme, width, height }: { theme: 'dark' | 'light'; width: number; height: number }) {
  const image = useIsoImage(`/assets/scene/engine-bay-${theme}.svg`);
  if (!image) return null;
  return <KonvaImage image={image} x={0} y={0} width={width} height={height} listening={false} />;
}

// Testigo de la lámpara de carga sobre la escena: la escena no calcula nada,
// solo pinta lo que el CircuitEngine ya decidió (isChargeLampOn).
function ChargeLampIndicator({ on }: { on: boolean }) {
  const lampPiece = layout.pieces.find((p) => p.id === 'charge-lamp');
  if (!lampPiece) return null;
  return (
    <Circle
      x={lampPiece.x}
      y={lampPiece.y - lampPiece.displaySize / 2 - 12}
      radius={7}
      fill={on ? '#F5B841' : 'rgba(120,130,160,0.35)'}
      shadowColor={on ? '#F5B841' : undefined}
      shadowBlur={on ? 14 : 0}
      shadowOpacity={0.9}
      listening={false}
    />
  );
}
