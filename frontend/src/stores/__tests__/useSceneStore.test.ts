import { beforeEach, describe, expect, it } from 'vitest';
import { useSceneStore } from '../useSceneStore';

function resetStore() {
  useSceneStore.setState({
    ignition: 'off',
    engineRunning: false,
    selectedComponentId: null,
    discoveredComponentIds: new Set(),
    masteredComponentIds: new Set(),
    camera: { x: 0, y: 0, zoom: 1 },
    probes: { red: null, black: null },
    multimeterMode: 'V',
  });
}

describe('useSceneStore', () => {
  beforeEach(resetStore);

  it('setIgnition a crank apaga engineRunning', () => {
    useSceneStore.getState().setEngineRunning(true);
    useSceneStore.getState().setIgnition('crank');
    expect(useSceneStore.getState().engineRunning).toBe(false);
    expect(useSceneStore.getState().ignition).toBe('crank');
  });

  it('setEngineRunning(true) fuerza ignition a "on"', () => {
    useSceneStore.getState().setIgnition('crank');
    useSceneStore.getState().setEngineRunning(true);
    expect(useSceneStore.getState().ignition).toBe('on');
  });

  it('discoverComponent agrega sin duplicar', () => {
    useSceneStore.getState().discoverComponent('battery');
    useSceneStore.getState().discoverComponent('battery');
    expect(useSceneStore.getState().discoveredComponentIds.size).toBe(1);
  });

  it('getEngine refleja el estado actual de ignition/engineRunning', () => {
    useSceneStore.getState().setIgnition('crank');
    const engine = useSceneStore.getState().getEngine();
    expect(engine.getVoltageBetween('N-BAT+', 'N-BAT-').value).toBe(10.5);
  });

  it('setCamera aplica el clamp de zoom', () => {
    useSceneStore.getState().setCamera({ x: 0, y: 0, zoom: 10 });
    expect(useSceneStore.getState().camera.zoom).toBe(2.5);
  });

  it('placeProbe actualiza la sonda correspondiente', () => {
    useSceneStore.getState().placeProbe('red', 'battery-positive');
    useSceneStore.getState().placeProbe('black', 'battery-negative');
    expect(useSceneStore.getState().probes).toEqual({ red: 'battery-positive', black: 'battery-negative' });
  });
});
