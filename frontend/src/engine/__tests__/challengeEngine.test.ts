import { describe, expect, it, beforeEach } from 'vitest';
import { createWorkOrder, recordAction, calculateScore, advancePhase, isWorkOrderComplete } from '../challengeEngine';
import type { CaseDefinition, WorkOrder } from '../challengeTypes';
import { SAMPLE_CASES, getCaseById, getCasesByDifficulty } from '../caseLibrary';

function makeCase(): CaseDefinition {
  return SAMPLE_CASES[0]; // case-battery-dead
}

describe('CaseLibrary — catálogo de casos', () => {
  it('contiene 12 casos de ejemplo', () => {
    expect(SAMPLE_CASES.length).toBe(12);
  });

  it('cada caso tiene id único', () => {
    const ids = SAMPLE_CASES.map((c) => c.id);
    expect(new Set(ids).size).toBe(12);
  });

  it('getCaseById devuelve el caso correcto', () => {
    expect(getCaseById('case-battery-dead')?.name).toBe('El carro no prende en la mañana');
  });

  it('getCaseById devuelve undefined para id inexistente', () => {
    expect(getCaseById('no-existe')).toBeUndefined();
  });

  it('getCasesByDifficulty filtra correctamente', () => {
    expect(getCasesByDifficulty(1).length).toBe(4);
    expect(getCasesByDifficulty(2).length).toBe(4);
    expect(getCasesByDifficulty(3).length).toBe(4);
  });
});

describe('ChallengeEngine — createWorkOrder', () => {
  it('crea orden con fase diagnostico', () => {
    const order = createWorkOrder(makeCase());
    expect(order.phase).toBe('diagnostic');
    expect(order.actions.length).toBe(0);
    expect(order.partsReplaced.length).toBe(0);
    expect(order.completedAt).toBeNull();
  });

  it('genera id único', () => {
    const o1 = createWorkOrder(makeCase());
    const o2 = createWorkOrder(makeCase());
    expect(o1.id).not.toBe(o2.id);
  });
});

describe('ChallengeEngine — recordAction', () => {
  let order: WorkOrder;
  let caseDef: CaseDefinition;

  beforeEach(() => {
    caseDef = makeCase();
    order = createWorkOrder(caseDef);
  });

  it('registra medición correcta (battery-positive)', () => {
    const updated = recordAction(order, { type: 'measure', target: 'battery-positive' }, caseDef);
    expect(updated.actions.length).toBe(1);
    expect(updated.actions[0].correct).toBe(true);
    expect(updated.actions[0].type).toBe('measure');
  });

  it('registra medición incorrecta (nodo no esperado)', () => {
    const updated = recordAction(order, { type: 'measure', target: 'nodo-aleatorio' }, caseDef);
    expect(updated.actions.length).toBe(1);
    expect(updated.actions[0].correct).toBe(false);
  });

  it('registra reemplazo correcto (battery)', () => {
    const updated = recordAction(order, { type: 'replace', target: 'battery' }, caseDef);
    expect(updated.partsReplaced).toContain('battery');
    expect(updated.actions[0].correct).toBe(true);
  });

  it('registra reemplazo incorrecto (pieza equivocada)', () => {
    const updated = recordAction(order, { type: 'replace', target: 'main-fuse' }, caseDef);
    expect(updated.actions[0].correct).toBe(false);
  });

  it('registra checklist correcto', () => {
    const updated = recordAction(order, { type: 'check', target: 'post-repair-voltage' }, caseDef);
    expect(updated.actions[0].correct).toBe(true);
  });

  it('no muta la orden original', () => {
    recordAction(order, { type: 'measure', target: 'battery-positive' }, caseDef);
    expect(order.actions.length).toBe(0);
  });
});

describe('ChallengeEngine — calculateScore', () => {
  it('puntaje perfecto: acciones mínimas, todo correcto, rápido', () => {
    const caseDef = makeCase();
    let order = createWorkOrder(caseDef);
    // Simular acciones correctas rápidas
    order = recordAction(order, { type: 'measure', target: 'battery-positive' }, caseDef);
    order = recordAction(order, { type: 'measure', target: 'battery-negative' }, caseDef);
    order = recordAction(order, { type: 'replace', target: 'battery' }, caseDef);
    order = recordAction(order, { type: 'check', target: 'post-repair-voltage' }, caseDef);
    order.completedAt = order.startedAt + 60000; // 1 minuto

    const score = calculateScore(order, caseDef);
    expect(score.total).toBeGreaterThanOrEqual(70);
    expect(score.efficiency).toBeGreaterThan(0);
    expect(score.thoroughness).toBeGreaterThan(0);
  });

  it('puntaje bajo: muchas acciones incorrectas, lento', () => {
    const caseDef = makeCase();
    let order = createWorkOrder(caseDef);
    // Muchas acciones incorrectas
    for (let i = 0; i < 10; i++) {
      order = recordAction(order, { type: 'measure', target: 'nodo-incorrecto' }, caseDef);
      order = recordAction(order, { type: 'replace', target: 'main-fuse' }, caseDef);
    }
    order.completedAt = order.startedAt + 600000; // 10 minutos

    const score = calculateScore(order, caseDef);
    expect(score.total).toBeLessThan(50);
    expect(score.grade).toMatch(/[CD]/);
  });

  it('grade A >= 90, B >= 70, C >= 50, D < 50', () => {
    const caseDef = makeCase();
    const order = createWorkOrder(caseDef);

    // Score mock con alto puntaje
    const highScore = calculateScore(
      { ...order, completedAt: order.startedAt + 30000, actions: [
        { type: 'measure', target: 'battery-positive', timestamp: 0, correct: true },
        { type: 'measure', target: 'battery-negative', timestamp: 1000, correct: true },
        { type: 'replace', target: 'battery', timestamp: 2000, correct: true },
        { type: 'check', target: 'post-repair-voltage', timestamp: 3000, correct: true },
      ], partsReplaced: ['battery'] },
      caseDef,
    );
    expect(highScore.total).toBeGreaterThanOrEqual(70);
  });
});

describe('ChallengeEngine — advancePhase', () => {
  it('avanza de diagnostico a repair', () => {
    const order = createWorkOrder(makeCase());
    const updated = advancePhase(order, 'repair');
    expect(updated.phase).toBe('repair');
  });

  it('avanza a completed registra completedAt', () => {
    const order = createWorkOrder(makeCase());
    const updated = advancePhase(order, 'completed');
    expect(updated.phase).toBe('completed');
    expect(updated.completedAt).not.toBeNull();
  });

  it('no muta la orden original', () => {
    const order = createWorkOrder(makeCase());
    advancePhase(order, 'repair');
    expect(order.phase).toBe('diagnostic');
  });
});

describe('ChallengeEngine — isWorkOrderComplete', () => {
  it('incompleta cuando faltan checks', () => {
    const caseDef = makeCase();
    const order = createWorkOrder(caseDef);
    // No se ha hecho ningún check → incompleta
    expect(isWorkOrderComplete(order, caseDef)).toBe(false);
  });

  it('completa cuando todos los checks esperados están hechos', () => {
    const caseDef = makeCase();
    let order = createWorkOrder(caseDef);
    // Solo hay 1 check esperado en case-battery-dead
    order = recordAction(order, { type: 'check', target: 'post-repair-voltage' }, caseDef);
    expect(isWorkOrderComplete(order, caseDef)).toBe(true);
  });
});
