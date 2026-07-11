// Código de clase de 6 caracteres (RF-A2). Se excluyen caracteres ambiguos
// (0/O, 1/I, etc.) para que sea fácil de dictar y teclear sin errores.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CLASS_CODE_LENGTH = 6;

export function generateClassCode(random: () => number = Math.random): string {
  let code = '';
  for (let i = 0; i < CLASS_CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  }
  return code;
}

export function normalizeClassCode(input: string): string {
  return input.trim().toUpperCase();
}

export function isValidClassCode(input: string): boolean {
  const code = normalizeClassCode(input);
  if (code.length !== CLASS_CODE_LENGTH) return false;
  return [...code].every((c) => ALPHABET.includes(c));
}
