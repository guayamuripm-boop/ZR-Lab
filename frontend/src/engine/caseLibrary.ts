import type { CaseDefinition } from './challengeTypes';

/**
 * Catálogo de casos de taller (doc 08 §5).
 * Cada caso simula una situación real con falla(s) específicas.
 * 12 casos cubren las 12 fallas del catálogo.
 */
export const SAMPLE_CASES: CaseDefinition[] = [
  // ── Nivel 1: fallas comunes y directas ──
  {
    id: 'case-battery-dead',
    name: 'El carro no prende en la mañana',
    description: 'Un cliente llega diciendo que su carro no quiere prender. Al girar la llave, no hay respuesta.',
    difficulty: 1,
    faultIds: ['fault-battery-discharged'],
    availableParts: [
      { componentId: 'battery', cost: 80, isCorrect: true },
      { componentId: 'main-fuse', cost: 5, isCorrect: false },
      { componentId: 'starter-relay', cost: 25, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Medir voltaje de batería en reposo' },
      { action: 'measure', target: 'battery-negative', description: 'Verificar masa de batería' },
      { action: 'replace', target: 'battery', description: 'Reemplazar batería descargada' },
      { action: 'check', target: 'post-repair-voltage', description: 'Verificar voltaje post-reparación' },
    ],
    timeLimit: 300,
    maxScore: 100,
  },
  {
    id: 'case-terminal-corroded',
    name: 'Arranque intermitente',
    description: 'El carro a veces prende, a veces solo hace clic. El cliente dice que "a veces coopera".',
    difficulty: 1,
    faultIds: ['fault-terminal-pos-corroded'],
    availableParts: [
      { componentId: 'terminal-pos', cost: 8, isCorrect: true },
      { componentId: 'battery', cost: 80, isCorrect: false },
      { componentId: 'starter-relay', cost: 25, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Medir voltaje de batería (parece buena)' },
      { action: 'measure', target: 'main-out', description: 'Verificar caída entre borne y cable (>0.1V = mal contacto)' },
      { action: 'replace', target: 'terminal-pos', description: 'Limpiar o reemplazar borne sulfatado' },
      { action: 'check', target: 'post-repair-start', description: 'Verificar arranque confiable' },
    ],
    timeLimit: 300,
    maxScore: 100,
  },
  {
    id: 'case-fuse-blown',
    name: 'Se quedó muerto de repente',
    description: 'El carro funcionando bien se apagó y ya no enciende nada. Sin luces, sin panel, sin nada.',
    difficulty: 1,
    faultIds: ['fault-fuse-blown'],
    availableParts: [
      { componentId: 'main-fuse', cost: 5, isCorrect: true },
      { componentId: 'battery', cost: 80, isCorrect: false },
      { componentId: 'alternator', cost: 150, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Verificar que la batería tiene voltaje' },
      { action: 'measure', target: 'main-out', description: 'Verificar voltaje después del fusible (0V = fusible quemado)' },
      { action: 'replace', target: 'main-fuse', description: 'Reemplazar fusible principal' },
      { action: 'check', target: 'post-repair-voltage', description: 'Verificar que el sistema vuelve a funcionar' },
    ],
    timeLimit: 240,
    maxScore: 100,
  },
  {
    id: 'case-belt-snapped',
    name: 'Se encendió la luz de batería y se apagó',
    description: 'El cliente reporta que la luz de batería se encendió mientras manejaba, y ahora el carro no arranca.',
    difficulty: 1,
    faultIds: ['fault-belt-snapped'],
    availableParts: [
      { componentId: 'belt', cost: 30, isCorrect: true },
      { componentId: 'alternator', cost: 150, isCorrect: false },
      { componentId: 'battery', cost: 80, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Medir batería (se descargó sin carga)' },
      { action: 'measure', target: 'alternator-bplus', description: 'Verificar B+ con motor encendido (12.3V = sin carga)' },
      { action: 'replace', target: 'belt', description: 'Reemplazar correa rota' },
      { action: 'check', target: 'post-repair-charging', description: 'Verificar carga normal (13.8-14.4V)' },
    ],
    timeLimit: 300,
    maxScore: 100,
  },

  // ── Nivel 2: fallas que requieren diagnóstico paso a paso ──
  {
    id: 'case-no-crank',
    name: 'Hace clic pero no arranca',
    description: 'El carro hace un clic repetido al girar la llave pero el motor no gira.',
    difficulty: 2,
    faultIds: ['fault-solenoid-worn'],
    availableParts: [
      { componentId: 'solenoid', cost: 45, isCorrect: true },
      { componentId: 'starter-relay', cost: 25, isCorrect: false },
      { componentId: 'starter-motor', cost: 120, isCorrect: false },
      { componentId: 'battery', cost: 80, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Descartar batería baja' },
      { action: 'measure', target: 'solenoid-signal', description: 'Verificar señal al solenoide (10.2V en crank)' },
      { action: 'measure', target: 'starter-terminal', description: 'Verificar si hay potencia en el arranque (0V = solenoide)' },
      { action: 'replace', target: 'solenoid', description: 'Reemplazar solenoide gastado' },
      { action: 'check', target: 'post-repair-start', description: 'Verificar que arranca correctamente' },
    ],
    timeLimit: 420,
    maxScore: 100,
  },
  {
    id: 'case-ground-strap',
    name: 'Luces raras y arranque débil',
    description: 'El carro tiene luces que parpadean raro y arranca débil sin causa aparente. Las batería es nueva.',
    difficulty: 2,
    faultIds: ['fault-ground-strap-corroded'],
    availableParts: [
      { componentId: 'ground-strap', cost: 15, isCorrect: true },
      { componentId: 'battery', cost: 80, isCorrect: false },
      { componentId: 'terminal-neg', cost: 8, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Verificar batería (parece buena)' },
      { action: 'measure', target: 'ground-point', description: 'Verificar caída de voltaje en masa (>0.2V = problema)' },
      { action: 'replace', target: 'ground-strap', description: 'Reemplazar trenza de masa corroída' },
      { action: 'check', target: 'post-repair-start', description: 'Verificar arranque normal y luces estables' },
    ],
    timeLimit: 360,
    maxScore: 100,
  },
  {
    id: 'case-relay-open',
    name: 'Silencio total al girar la llave',
    description: 'Al girar la llave a START, no pasa absolutamente nada. Ni clic, ni ruido, ni nada.',
    difficulty: 2,
    faultIds: ['fault-relay-open'],
    availableParts: [
      { componentId: 'starter-relay', cost: 25, isCorrect: true },
      { componentId: 'ignition-switch', cost: 60, isCorrect: false },
      { componentId: 'solenoid', cost: 45, isCorrect: false },
      { componentId: 'starter-motor', cost: 120, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Descartar batería' },
      { action: 'measure', target: 'ignition-start', description: 'Verificar señal de START en la llave' },
      { action: 'measure', target: 'relay-out', description: 'Verificar salida del relé (0V = relé abierto)' },
      { action: 'replace', target: 'starter-relay', description: 'Reemplazar relé de arranque' },
      { action: 'check', target: 'post-repair-start', description: 'Verificar que cranquea' },
    ],
    timeLimit: 420,
    maxScore: 100,
  },
  {
    id: 'case-belt-loose',
    name: 'Chilla al acelerar y luz de batería parpadea',
    description: 'El carro chilla cuando se aceleras y la luz de la batería parpadea intermitentemente.',
    difficulty: 2,
    faultIds: ['fault-belt-loose'],
    availableParts: [
      { componentId: 'belt', cost: 30, isCorrect: true },
      { componentId: 'alternator', cost: 150, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Medir voltaje (carga errática)' },
      { action: 'measure', target: 'alternator-bplus', description: 'Verificar B+ (voltaje inestable)' },
      { action: 'replace', target: 'belt', description: 'Reemplazar correa floja' },
      { action: 'check', target: 'post-repair-charging', description: 'Verificar carga estable (13.8-14.4V)' },
    ],
    timeLimit: 360,
    maxScore: 100,
  },

  // ── Nivel 3: fallas complejas que requieren razonamiento avanzado ──
  {
    id: 'case-battery-draining',
    name: 'La batería se descarga manejando',
    description: 'El cliente reporta que la luz de batería se encendió y la batería se descarga aunque maneja.',
    difficulty: 3,
    faultIds: ['fault-alternator-no-charge'],
    availableParts: [
      { componentId: 'alternator', cost: 150, isCorrect: true },
      { componentId: 'belt', cost: 30, isCorrect: false },
      { componentId: 'battery', cost: 80, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Medir batería en reposo' },
      { action: 'measure', target: 'alternator-bplus', description: 'Medir B+ del alternador con motor encendido (<13.5V = sin carga)' },
      { action: 'measure', target: 'charge-lamp-point', description: 'Verificar lámpara de carga encendida en marcha' },
      { action: 'replace', target: 'alternator', description: 'Reemplazar alternador con diodos dañados' },
      { action: 'check', target: 'post-repair-charging', description: 'Verificar 14.1V en marcha' },
    ],
    timeLimit: 480,
    maxScore: 100,
  },
  {
    id: 'case-overcharge',
    name: 'Huele raro y los bombillos se queman',
    description: 'El carro huele a quemado y los bombillos del tablero se queman seguido.',
    difficulty: 3,
    faultIds: ['fault-regulator-high'],
    availableParts: [
      { componentId: 'alternator', cost: 150, isCorrect: true },
      { componentId: 'battery', cost: 80, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'alternator-bplus', description: 'Medir B+ con motor encendido (>15V = regulador alto)' },
      { action: 'measure', target: 'battery-positive', description: 'Verificar sobrecarga en batería' },
      { action: 'replace', target: 'alternator', description: 'Reemplazar alternador (regulador integrado)' },
      { action: 'check', target: 'post-repair-voltage', description: 'Verificar voltaje normal (13.8-14.4V)' },
    ],
    timeLimit: 360,
    maxScore: 100,
  },
  {
    id: 'case-starter-worn',
    name: 'Arranca cansado con batería nueva',
    description: 'El carro arranca muy lento aunque la batería es nueva. El cliente ya la cambió y sigue igual.',
    difficulty: 3,
    faultIds: ['fault-starter-worn'],
    availableParts: [
      { componentId: 'starter-motor', cost: 120, isCorrect: true },
      { componentId: 'battery', cost: 80, isCorrect: false },
      { componentId: 'solenoid', cost: 45, isCorrect: false },
      { componentId: 'terminal-pos', cost: 8, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Verificar batería (nueva, buena)' },
      { action: 'measure', target: 'starter-terminal', description: 'Verificar voltaje en arranque (cae mucho = arranque gastado)' },
      { action: 'measure', target: 'main-out', description: 'Descartar caída en cable' },
      { action: 'replace', target: 'starter-motor', description: 'Reemplazar motor de arranque' },
      { action: 'check', target: 'post-repair-start', description: 'Verificar arranque normal' },
    ],
    timeLimit: 480,
    maxScore: 100,
  },
  {
    id: 'case-ignition-worn',
    name: 'Hay que intentar varias veces',
    description: 'El carro no cranquea a la primera. Hay que girar la llave varias veces hasta que agarra.',
    difficulty: 3,
    faultIds: ['fault-ignition-worn'],
    availableParts: [
      { componentId: 'ignition-switch', cost: 60, isCorrect: true },
      { componentId: 'starter-relay', cost: 25, isCorrect: false },
      { componentId: 'solenoid', cost: 45, isCorrect: false },
      { componentId: 'battery', cost: 80, isCorrect: false },
    ],
    expectedSteps: [
      { action: 'measure', target: 'battery-positive', description: 'Descartar batería' },
      { action: 'measure', target: 'ignition-start', description: 'Verificar señal de START (intermitente = llave gastada)' },
      { action: 'measure', target: 'relay-out', description: 'Verificar que el relé recibe la señal' },
      { action: 'replace', target: 'ignition-switch', description: 'Reemplazar llave de encendido' },
      { action: 'check', target: 'post-repair-start', description: 'Verificar arranque confiable' },
    ],
    timeLimit: 420,
    maxScore: 100,
  },
];

export function getCaseById(id: string): CaseDefinition | undefined {
  return SAMPLE_CASES.find((c) => c.id === id);
}

export function getCasesByDifficulty(difficulty: 1 | 2 | 3): CaseDefinition[] {
  return SAMPLE_CASES.filter((c) => c.difficulty === difficulty);
}
