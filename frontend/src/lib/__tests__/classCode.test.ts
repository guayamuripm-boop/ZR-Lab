import { describe, expect, it } from 'vitest';
import { CLASS_CODE_LENGTH, generateClassCode, isValidClassCode, normalizeClassCode } from '../classCode';

describe('classCode', () => {
  it('genera códigos de 6 caracteres', () => {
    expect(generateClassCode()).toHaveLength(CLASS_CODE_LENGTH);
  });

  it('nunca incluye caracteres ambiguos (0, O, 1, I, L)', () => {
    for (let i = 0; i < 200; i++) {
      const code = generateClassCode();
      expect(code).not.toMatch(/[01OIL]/);
    }
  });

  it('es determinista con un generador de aleatoriedad controlado', () => {
    const fixed = () => 0;
    expect(generateClassCode(fixed)).toBe('AAAAAA');
  });

  it('normaliza a mayúsculas y sin espacios', () => {
    expect(normalizeClassCode('  zr7k2m ')).toBe('ZR7K2M');
  });

  it('valida longitud y alfabeto', () => {
    const valid = generateClassCode();
    expect(isValidClassCode(valid)).toBe(true);
    expect(isValidClassCode('ABC')).toBe(false); // muy corto
    expect(isValidClassCode('ABCDE0')).toBe(false); // contiene 0 ambiguo
    expect(isValidClassCode('ABCDEI')).toBe(false); // contiene I ambiguo
  });

  it('acepta un código válido escrito en minúsculas', () => {
    const code = generateClassCode(() => 0.5);
    expect(isValidClassCode(code.toLowerCase())).toBe(true);
  });
});
