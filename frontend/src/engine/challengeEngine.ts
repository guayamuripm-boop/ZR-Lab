import type { CaseDefinition, ScoreResult, StudentAction, WorkOrder, WorkOrderPhase } from './challengeTypes';

let workOrderCounter = 0;

/** Crea una nueva orden de trabajo para un caso dado. */
export function createWorkOrder(caseDef: CaseDefinition): WorkOrder {
  workOrderCounter++;
  return {
    id: `wo-${workOrderCounter}`,
    caseId: caseDef.id,
    phase: 'diagnostic',
    actions: [],
    partsReplaced: [],
    startedAt: Date.now(),
    completedAt: null,
  };
}

/** Registra una acción del estudiante en la orden de trabajo. */
export function recordAction(
  order: WorkOrder,
  action: Omit<StudentAction, 'timestamp' | 'correct'>,
  caseDef: CaseDefinition,
): WorkOrder {
  const correct = evaluateAction(action, caseDef);
  const newAction: StudentAction = {
    ...action,
    timestamp: Date.now(),
    correct,
  };

  const updatedOrder = { ...order, actions: [...order.actions, newAction] };

  if (action.type === 'replace') {
    updatedOrder.partsReplaced = [...order.partsReplaced, action.target];
  }

  return updatedOrder;
}

/** Evalúa si una acción es correcta según el caso. */
function evaluateAction(
  action: { type: string; target: string },
  caseDef: CaseDefinition,
): boolean {
  if (action.type === 'measure') {
    // Medición es correcta si apunta a un nodo en los pasos esperados
    const expectedMeasurements = caseDef.expectedSteps
      .filter((s) => s.action === 'measure')
      .map((s) => s.target);
    return expectedMeasurements.includes(action.target);
  }

  if (action.type === 'replace') {
    // Reemplazo es correcto si la pieza es la que soluciona la falla
    return caseDef.availableParts.some(
      (p) => p.componentId === action.target && p.isCorrect,
    );
  }

  if (action.type === 'check') {
    // Checklist es correcto si el paso existe en los esperados
    return caseDef.expectedSteps.some(
      (s) => s.action === 'check' && s.target === action.target,
    );
  }

  return false;
}

/** Calcula el puntaje basado en las acciones del estudiante. */
export function calculateScore(order: WorkOrder, caseDef: CaseDefinition): ScoreResult {
  const elapsed = order.completedAt
    ? (order.completedAt - order.startedAt) / 1000
    : 0;

  // Eficiencia (50 puntos): basada en tiempo y número de acciones
  const timeLimit = caseDef.timeLimit || 300; // default 5 min
  const timeRatio = Math.max(0, 1 - elapsed / timeLimit);
  const expectedActions = caseDef.expectedSteps.length;
  const totalActions = order.actions.length;
  const actionRatio = expectedActions > 0
    ? Math.min(1, expectedActions / Math.max(totalActions, 1))
    : 1;
  const efficiency = Math.round(((timeRatio + actionRatio) / 2) * 50);

  // Prolijidad (50 puntos): basada en acciones correctas y checklist
  const correctActions = order.actions.filter((a) => a.correct).length;
  const accuracyRatio = totalActions > 0 ? correctActions / totalActions : 0;

  // Checklist: verificar que todos los pasos esperados de checklist se completaron
  const expectedChecks = caseDef.expectedSteps.filter((s) => s.action === 'check');
  const completedChecks = order.actions.filter(
    (a) => a.type === 'check' && a.correct,
  );
  const checkRatio = expectedChecks.length > 0
    ? completedChecks.length / expectedChecks.length
    : 1;

  const thoroughness = Math.round(((accuracyRatio + checkRatio) / 2) * 50);

  const total = efficiency + thoroughness;

  let grade: ScoreResult['grade'] = 'D';
  if (total >= 90) grade = 'A';
  else if (total >= 70) grade = 'B';
  else if (total >= 50) grade = 'C';

  return { efficiency, thoroughness, total, grade };
}

/** Cambia la fase de la orden de trabajo. */
export function advancePhase(order: WorkOrder, newPhase: WorkOrderPhase): WorkOrder {
  const updated = { ...order, phase: newPhase };
  if (newPhase === 'completed') {
    updated.completedAt = Date.now();
  }
  return updated;
}

/** Verifica si la orden de trabajo está completa (todos los pasos hechos). */
export function isWorkOrderComplete(order: WorkOrder, caseDef: CaseDefinition): boolean {
  const expectedChecks = caseDef.expectedSteps.filter((s) => s.action === 'check');
  if (expectedChecks.length === 0) return false;

  const completedChecks = order.actions.filter(
    (a) => a.type === 'check' && a.correct,
  );

  return expectedChecks.every((expected) =>
    completedChecks.some((done) => done.target === expected.target),
  );
}
