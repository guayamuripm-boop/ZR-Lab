import { create } from 'zustand';
import { CircuitEngine } from '../engine/CircuitEngine';
import { startCircuitDefinition } from '../engine/circuitDefinition';
import type { IgnitionPosition } from '../engine/types';
import { clampZoom, type CameraState } from '../scene/camera';
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

  setIgnition: (pos: IgnitionPosition) => void;
  setEngineRunning: (running: boolean) => void;
  selectComponent: (id: string | null) => void;
  discoverComponent: (id: string) => void;
  masterComponent: (id: string) => void;
  setCamera: (camera: CameraState) => void;
  placeProbe: (color: ProbeColor, measurementPointId: string | null) => void;
  setMultimeterMode: (mode: MultimeterMode) => void;
  setLayerView: (layer: LayerView) => void;
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

  setIgnition: (pos) => set({ ignition: pos, engineRunning: pos === 'crank' ? false : get().engineRunning }),
  setEngineRunning: (running) => set({ engineRunning: running, ignition: running ? 'on' : get().ignition }),
  selectComponent: (id) => set({ selectedComponentId: id }),
  discoverComponent: (id) =>
    set((state) => ({ discoveredComponentIds: new Set(state.discoveredComponentIds).add(id) })),
  masterComponent: (id) =>
    set((state) => ({ masteredComponentIds: new Set(state.masteredComponentIds).add(id) })),
  setCamera: (camera) => set({ camera: { ...camera, zoom: clampZoom(camera.zoom) } }),
  placeProbe: (color, measurementPointId) =>
    set((state) => ({ probes: { ...state.probes, [color]: measurementPointId } })),
  setMultimeterMode: (mode) => set({ multimeterMode: mode }),
  setLayerView: (layer) => set({ layerView: layer }),

  getEngine: () => {
    const engine = new CircuitEngine(startCircuitDefinition);
    const { ignition, engineRunning } = get();
    engine.setIgnition(ignition);
    if (engineRunning) engine.setEngineRunning(true);
    return engine;
  },
}));
