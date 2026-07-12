// Modo QA — herramienta interna para revisar contenido sin el desbloqueo secuencial
// de las lecciones (RF-D5). NO es una función para estudiantes: se activa a propósito
// con `?qa=1` en la URL y queda guardado en localStorage; se apaga con `?qa=0`.
// Úsalo para el guion de QA (doc 07 §6) antes del piloto.

const QA_KEY = 'zr-qa-mode';

// Pura y testeable: decide el estado a partir de la query y el storage.
// - `?qa=1` enciende y persiste; `?qa=0` apaga y limpia; sin parámetro, respeta lo guardado.
export function resolveQaMode(search: string, storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>): boolean {
  const params = new URLSearchParams(search);
  const flag = params.get('qa');
  if (flag === '1') {
    storage.setItem(QA_KEY, '1');
    return true;
  }
  if (flag === '0') {
    storage.removeItem(QA_KEY);
    return false;
  }
  return storage.getItem(QA_KEY) === '1';
}

export function isQaMode(): boolean {
  if (typeof window === 'undefined') return false;
  return resolveQaMode(window.location.search, window.localStorage);
}
