import { create } from 'zustand';
import { CircuitEngine } from '../engine/CircuitEngine';
import { startCircuitDefinition } from '../engine/circuitDefinition';
import type { FaultDefinition, IgnitionPosition } from '../engine/types';
import { clampPan, clampZoom, type CameraState } from '../scene/camera';
import layout from '../scene/layout.json';
import type { LayerView } from '../scene/subsystems';

export type ProbeColor = 'red' | 'black';
export type MultimeterMode = 'V' | 'Ω';

interface SceneState {
  ignition: IgnitionPosition;
  engineRunning: boolean;
  selectedComponentId: string | null;
  discoveredComponentIds: Set<string>;
  masteredComponentIds: Set<string>;
  camera: CameraState;
  probes: { red: string | null; black: string | null };
  multimeterMode: MultimeterMode;
  layerView: LayerView;
  activeFault: FaultDefinition | null;

  setIgnition: (pos: IgnitionPosition) => void;
  setEngineRunning: (running: boolean) => void;
  selectComponent: (id: string | null) => void;
  discoverComponent: (id: string) => void;
  masterComponent: (id: string) => void;
  setCamera: (camera: CameraState) => void;
  centerCameraOnPiece: (pieceId: string, viewportWidth: number, viewportHeight: number) => void;
  placeProbe: (color: ProbeColor, measurementPointId: string | null) => void;
  setMultimeterMode: (mode: MultimeterMode) => void;
  setLayerView: (layer: LayerView) => void;
  setActiveFault: (fault: FaultDefinition | null) => void;
  getEngine: () => CircuitEngine;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  ignition: 'off',
  engineRunning: false,
  selectedComponentId: null,
  discoveredComponentIds: new Set(),
  masteredComponentIds: new Set(),
  camera: { x: 0, y: 0, zoom: 1 },
  probes: { red: null, black: null },
  multimeterMode: 'V',
  layerView: 'all',
  activeFault: null,

  setIgnition: (pos) => set({ ignition: pos, engineRunning: pos === 'crank' ? false : get().engineRunning }),
  setEngineRunning: (running) => set({ engineRunning: running, ignition: running ? 'on' : get().ignition }),
  selectComponent: (id) => set({ selectedComponentId: id }),
  discoverComponent: (id) =>
    set((state) => ({ discoveredComponentIds: new Set(state.discoveredComponentIds).add(id) })),
  masterComponent: (id) =>
    set((state) => ({ masteredComponentIds: new Set(state.masteredComponentIds).add(id) })),
  setCamera: (camera) => set({ camera: { ...camera, zoom: clampZoom(camera.zoom) } }),
  centerCameraOnPiece: (pieceId: string, viewportWidth: number, viewportHeight: number) => {
    const piece = layout.pieces.find((p) => p.id === pieceId);
    if (!piece) return;
    const { camera } = get();
    const sceneSize = { width: layout.sceneWidth, height: layout.sceneHeight };
    const viewportSize = { width: viewportWidth, height: viewportHeight };
    const target = {
      x: viewportWidth / 2 - piece.x * camera.zoom,
      y: viewportHeight / 2 - piece.y * camera.zoom,
    };
    set({ camera: { ...camera, ...clampPan(target, sceneSize, viewportSize, camera.zoom) } });
  },
  placeProbe: (color, measurementPointId) =>
    set((state) => ({ probes: { ...state.probes, [color]: measurementPointId } })),
  setMultimeterMode: (mode) => set({ multimeterMode: mode }),
  setLayerView: (layer) => set({ layerView: layer }),
  setActiveFault: (fault) => set({ activeFault: fault }),

  getEngine: () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    const { ignition, engineRunning, activeFault } = get();
    engine.setIgnition(ignition);
    if (engineRunning) engine.setEngineRunning(true);
    if (activeFault) {
      engine.applyFault(activeFault.componentId, {
        faultId: activeFault.id,
        forceOpen: activeFault.forceOpen,
        voltageEffects: activeFault.effects,
      });
    }
    return engine;
  },
}));
