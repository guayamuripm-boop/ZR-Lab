import { beforeEach, describe, expect, it } from 'vitest';
import { resolveQaMode } from '../qaMode';

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    _map: map,
  };
}

describe('resolveQaMode', () => {
  let storage: ReturnType<typeof fakeStorage>;
  beforeEach(() => {
    storage = fakeStorage();
  });

  it('?qa=1 enciende y persiste en storage', () => {
    expect(resolveQaMode('?qa=1', storage)).toBe(true);
    expect(storage._map.get('zr-qa-mode')).toBe('1');
  });

  it('?qa=0 apaga y limpia el storage', () => {
    storage = fakeStorage({ 'zr-qa-mode': '1' });
    expect(resolveQaMode('?qa=0', storage)).toBe(false);
    expect(storage._map.has('zr-qa-mode')).toBe(false);
  });

  it('sin parámetro respeta lo guardado', () => {
    expect(resolveQaMode('', storage)).toBe(false);
    storage = fakeStorage({ 'zr-qa-mode': '1' });
    expect(resolveQaMode('', storage)).toBe(true);
  });

  it('ignora otros parámetros', () => {
    expect(resolveQaMode('?foo=bar', storage)).toBe(false);
  });
});
