import type { CaseDefinition } from './challengeTypes';

/**
 * Casos de ejemplo para el Modo Reto (doc 08 §5).
 * Cada caso simula una situación real de taller con falla(s) específicas.
 */
export const SAMPLE_CASES: CaseDefinition[] = [
  {
    id: 'case-battery-dead',
    name: 'El carro no prende en la mañana',
    description: 'Un cliente llega diciendo que su carro no quiere prender. Al girar la llave, no hay respuesta. El técnico debe diagnosticar la causa.',
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
    id: 'case-no-crank',
    name: 'Hace clic pero no arranca',
    description: 'El carro hace un clic repetido al girar la llave pero el motor no gira. El technician debe identificar si es el solenoide, el relé o el arranque.',
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
    id: 'case-battery-draining',
    name: 'La batería se descarga manejando',
    description: 'El cliente reporta que la luz de batería se encendió y la batería se descarga aunque maneja. El alternador podría no estar cargando.',
    difficulty: 2,
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
    description: 'El carro huele a quemado y los bombillos del tablero se queman seguido. Podría ser sobrecarga del alternador.',
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
];

export function getCaseById(id: string): CaseDefinition | undefined {
  return SAMPLE_CASES.find((c) => c.id === id);
}

export function getCasesByDifficulty(difficulty: 1 | 2 | 3): CaseDefinition[] {
  return SAMPLE_CASES.filter((c) => c.difficulty === difficulty);
}
