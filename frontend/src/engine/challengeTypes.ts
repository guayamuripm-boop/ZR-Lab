/**
 * Tipos del Modo Reto (v2) — Flujo de trabajo de diagnóstico.
 * Doc 05 F10: orden de trabajo → diagnóstico → reemplazo → checklist → puntaje.
 * Capa 2, TypeScript puro.
 */

/** Tipo de acción que el estudiante puede realizar en un caso. */
export type DiagnosticActionType = 'measure' | 'replace' | 'check';

/** Estado de una orden de trabajo. */
export type WorkOrderPhase = 'diagnostic' | 'repair' | 'verification' | 'completed';

/** Una pieza disponible para reemplazo en el caso. */
export interface CasePart {
  componentId: string;
  cost: number;       // costo en "puntos" virtuales
  isCorrect: boolean; // es la pieza que soluciona la falla
}

/** Un paso esperado en el diagnóstico (para scoring de prolijidad). */
export interface ExpectedStep {
  action: DiagnosticActionType;
  target: string;       // nodo de medición, id de componente, etc.
  description: string;  // texto para el instructor/feedback
}

/** Definición completa de un caso de reto. */
export interface CaseDefinition {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3;
  faultIds: string[];             // ids del faultCatalog que aplican
  availableParts: CasePart[];     // piezas que el estudiante puede "comprar"
  expectedSteps: ExpectedStep[];  // pasos ideales (para scoring)
  timeLimit: number;              // límite en segundos (0 = sin límite)
  maxScore: number;               // puntaje máximo (típicamente 100)
}

/** Una acción registrada del estudiante. */
export interface StudentAction {
  type: DiagnosticActionType;
  target: string;
  timestamp: number;   // ms desde el inicio del caso
  correct: boolean;
}

/** Resultado del scoring. */
export interface ScoreResult {
  efficiency: number;    // 0-50 puntos (rapidez + fewer steps)
  thoroughness: number;  // 0-50 puntos (pasos correctos + checklist)
  total: number;         // 0-100 puntos
  grade: 'A' | 'B' | 'C' | 'D';  // 100/75/50/25
}

/** Orden de trabajo activa del estudiante. */
export interface WorkOrder {
  id: string;
  caseId: string;
  phase: WorkOrderPhase;
  actions: StudentAction[];
  partsReplaced: string[];   // componentIds reemplazados
  startedAt: number;         // timestamp
  completedAt: number | null;
}
