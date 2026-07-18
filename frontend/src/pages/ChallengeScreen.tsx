import { useMemo, useState } from 'react';
import { getCasesByDifficulty } from '../engine/caseLibrary';
import {
  advancePhase,
  calculateScore,
  createWorkOrder,
  isWorkOrderComplete,
  recordAction,
} from '../engine/challengeEngine';
import type { CaseDefinition, ScoreResult, WorkOrder } from '../engine/challengeTypes';
import { getFaultById } from '../engine/faultCatalog';
import { NODES } from '../engine/circuitDefinition';
import { useSceneStore } from '../stores/useSceneStore';
import { Oscilloscope } from '../instruments/Oscilloscope';

type Screen = 'select' | 'play' | 'result';

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Básico', color: 'var(--success)' },
  2: { label: 'Intermedio', color: 'var(--warning)' },
  3: { label: 'Avanzado', color: 'var(--danger)' },
};

const PHASE_LABELS: Record<string, string> = {
  diagnostic: 'Diagnóstico',
  repair: 'Reparación',
  verification: 'Verificación',
  completed: 'Completado',
};

const NODE_LABELS: Record<string, string> = {
  'battery-positive': 'Batería (+)',
  'battery-negative': 'Batería (−)',
  'main-out': 'Fusible salida',
  'ignition-on': 'Llave ON',
  'ignition-start': 'Llave START',
  'relay-out': 'Salida relé',
  'solenoid-signal': 'Solenoide señal',
  'starter-terminal': 'Arranque',
  'alternator-bplus': 'Alternador B+',
  'charge-lamp-point': 'Lámpara carga',
  'ground-point': 'Masa',
};

function CaseSelector({ onSelect }: { onSelect: (c: CaseDefinition) => void }) {
  const difficulties = [1, 2, 3] as const;

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Modo Reto
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Selecciona un caso de diagnóstico para comenzar
            </p>
          </div>
          <button
            type="button"
            onClick={() => history.back()}
            className="rounded-xl px-4 py-2 text-sm"
            style={{ background: 'var(--glass-surface-2)', color: 'var(--text-primary)' }}
          >
            ← Volver
          </button>
        </div>

        {difficulties.map((diff) => {
          const cases = getCasesByDifficulty(diff);
          const { label, color } = DIFFICULTY_LABELS[diff];
          return (
            <div key={diff} className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color }}>
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
                Nivel {diff} — {label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {cases.map((c) => {
                  const fault = c.faultIds[0] ? getFaultById(c.faultIds[0]) : null;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelect(c)}
                      className="glass rounded-[16px] p-4 text-left transition-colors hover:scale-[1.01]"
                    >
                      <p className="mb-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {c.name}
                      </p>
                      <p className="mb-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {c.description}
                      </p>
                      {fault ? (
                        <p className="text-xs italic" style={{ color }}>
                          Falla: {fault.name}
                        </p>
                      ) : null}
                      <div className="mt-2 flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span>⏱ {c.timeLimit ? `${Math.round(c.timeLimit / 60)}min` : 'Sin límite'}</span>
                        <span>🔧 {c.availableParts.length} piezas</span>
                        <span>📋 {c.expectedSteps.length} pasos</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlayView({
  caseDef,
  onComplete,
}: {
  caseDef: CaseDefinition;
  onComplete: (order: WorkOrder, score: ScoreResult) => void;
}) {
  const getEngine = useSceneStore((s) => s.getEngine);
  const [order, setOrder] = useState(() => createWorkOrder(caseDef));
  const [scopeNode, setScopeNode] = useState<string>('battery-positive');
  const [feedback, setFeedback] = useState<string | null>(null);

  const fault = caseDef.faultIds[0] ? getFaultById(caseDef.faultIds[0]) : null;

  const elapsed = Math.floor((Date.now() - order.startedAt) / 1000);
  const timeLeft = caseDef.timeLimit ? Math.max(0, caseDef.timeLimit - elapsed) : null;

  // Medición con el osciloscopio
  const { vdc, vpp } = useMemo(() => {
    const engine = getEngine();
    const scope = new Oscilloscope();
    // Mapear measurement point id a nodeId real
    const nodeMap: Record<string, string> = {
      'battery-positive': NODES.BAT_POS,
      'battery-negative': NODES.BAT_NEG,
      'main-out': NODES.MAIN,
      'ignition-on': NODES.IGN1,
      'ignition-start': NODES.IGN2,
      'relay-out': NODES.RELAY_OUT,
      'solenoid-signal': NODES.SOL,
      'starter-terminal': NODES.STARTER,
      'alternator-bplus': NODES.ALT_BPOS,
      'charge-lamp-point': NODES.LAMP,
      'ground-point': NODES.GND,
    };
    scope.connect({ node: nodeMap[scopeNode] ?? NODES.BAT_POS });
    scope.capture(engine);
    return { vdc: scope.getVdc(), vpp: scope.getVpp() };
  }, [scopeNode, getEngine]);

  function handleMeasure(target: string) {
    const updated = recordAction(order, { type: 'measure', target }, caseDef);
    setOrder(updated);
    const last = updated.actions[updated.actions.length - 1];
    setFeedback(last.correct ? `✓ Medición correcta: ${vdc.toFixed(2)}V` : '✗ Medición no relevante para este caso');
    setTimeout(() => setFeedback(null), 2500);
  }

  function handleReplace(target: string) {
    const updated = recordAction(order, { type: 'replace', target }, caseDef);
    setOrder(updated);
    const last = updated.actions[updated.actions.length - 1];
    setFeedback(last.correct ? `✓ Pieza reemplazada correctamente` : '✗ Pieza incorrecta — no resuelve la falla');
    setTimeout(() => setFeedback(null), 2500);

    // Si reemplazó la pieza correcta, avanzar a verificación
    if (last.correct) {
      setOrder(advancePhase(updated, 'verification'));
    }
  }

  function handleCheck(target: string) {
    const updated = recordAction(order, { type: 'check', target }, caseDef);
    setOrder(updated);
    const last = updated.actions[updated.actions.length - 1];
    setFeedback(last.correct ? '✓ Verificación completada' : '✗ Verificación no válida');
    setTimeout(() => setFeedback(null), 2500);

    // Verificar si todos los checks están hechos
    if (isWorkOrderComplete(updated, caseDef)) {
      const completed = advancePhase(updated, 'completed');
      const score = calculateScore(completed, caseDef);
      onComplete(completed, score);
    }
  }

  function handleComplete() {
    const completed = advancePhase(order, 'completed');
    const score = calculateScore(completed, caseDef);
    onComplete(completed, score);
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="glass mb-4 rounded-[16px] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {caseDef.name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {caseDef.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Fase: {PHASE_LABELS[order.phase]}
              </p>
              {timeLeft !== null ? (
                <p
                  className="font-display text-lg font-bold"
                  style={{ color: timeLeft < 60 ? 'var(--danger)' : 'var(--text-primary)' }}
                >
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </p>
              ) : null}
            </div>
          </div>
          {/* Barra de progreso */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--glass-surface-2)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (order.actions.length / Math.max(caseDef.expectedSteps.length, 1)) * 100)}%`,
                background: 'var(--accent)',
              }}
            />
          </div>
        </div>

        {/* Falla activa */}
        {fault ? (
          <div className="glass mb-4 rounded-[16px] p-4">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Falla reportada por el cliente:
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--warning)' }}>
              "{fault.symptom}"
            </p>
          </div>
        ) : null}

        {/* Feedback */}
        {feedback ? (
          <div
            className="glass mb-4 rounded-[16px] p-3 text-center text-sm font-medium"
            style={{
              color: feedback.startsWith('✓') ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${feedback.startsWith('✓') ? 'var(--success)' : 'var(--danger)'}`,
            }}
          >
            {feedback}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {/* Columna izquierda: Acciones */}
          <div className="flex flex-col gap-3">
            {/* Medir */}
            <div className="glass rounded-[16px] p-4">
              <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                📊 Medir voltaje
              </h3>
              <p className="mb-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Selecciona un punto de medición para verificar voltajes en el circuito.
              </p>
              <div className="mb-2">
                <label className="mb-1 block text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Punto de medición:
                </label>
                <select
                  value={scopeNode}
                  onChange={(e) => setScopeNode(e.target.value)}
                  className="w-full rounded-lg px-3 py-1.5 text-sm"
                  style={{ background: 'var(--glass-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--glass-surface-3)' }}
                >
                  {Object.entries(NODE_LABELS).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2 rounded-lg p-2" style={{ background: 'var(--glass-surface-2)' }}>
                <p className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                  Lectura: {vdc.toFixed(2)}V DC · Vpp: {vpp.toFixed(2)}V
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {caseDef.expectedSteps
                  .filter((s) => s.action === 'measure')
                  .map((step) => (
                    <button
                      key={step.target}
                      type="button"
                      onClick={() => handleMeasure(step.target)}
                      className="rounded-lg px-2 py-1 text-xs transition-colors"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      {NODE_LABELS[step.target] ?? step.target}
                    </button>
                  ))}
              </div>
            </div>

            {/* Reemplazar */}
            <div className="glass rounded-[16px] p-4">
              <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                🔧 Reemplazar pieza
              </h3>
              <p className="mb-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Piezas disponibles para reemplazo (costo en puntos):
              </p>
              <div className="flex flex-col gap-1">
                {caseDef.availableParts.map((part) => (
                  <button
                    key={part.componentId}
                    type="button"
                    onClick={() => handleReplace(part.componentId)}
                    disabled={order.partsReplaced.includes(part.componentId)}
                    className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors"
                    style={{
                      background: order.partsReplaced.includes(part.componentId)
                        ? 'var(--glass-surface-2)'
                        : 'var(--glass-surface-1)',
                      opacity: order.partsReplaced.includes(part.componentId) ? 0.5 : 1,
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>{part.componentId}</span>
                    <span style={{ color: 'var(--warning)' }}>{part.cost} pts</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha: Verificación + Historial */}
          <div className="flex flex-col gap-3">
            {/* Checklist */}
            <div className="glass rounded-[16px] p-4">
              <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                ✅ Verificación post-reparación
              </h3>
              <p className="mb-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Confirma que la reparación fue exitosa:
              </p>
              <div className="flex flex-col gap-1">
                {caseDef.expectedSteps
                  .filter((s) => s.action === 'check')
                  .map((step) => {
                    const done = order.actions.some(
                      (a) => a.type === 'check' && a.target === step.target && a.correct,
                    );
                    return (
                      <button
                        key={step.target}
                        type="button"
                        onClick={() => handleCheck(step.target)}
                        disabled={done}
                        className="rounded-lg px-3 py-1.5 text-left text-xs transition-colors"
                        style={{
                          background: done ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 'var(--glass-surface-2)',
                          color: done ? 'var(--success)' : 'var(--text-primary)',
                        }}
                      >
                        {done ? '✓' : '○'} {step.description}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Historial */}
            <div className="glass rounded-[16px] p-4">
              <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                📝 Historial de acciones
              </h3>
              <div className="max-h-40 overflow-y-auto">
                {order.actions.length === 0 ? (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Sin acciones registradas
                  </p>
                ) : (
                  order.actions.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border-b py-1 text-xs"
                      style={{ borderColor: 'var(--glass-surface-2)' }}
                    >
                      <span style={{ color: a.correct ? 'var(--success)' : 'var(--danger)' }}>
                        {a.correct ? '✓' : '✗'}
                      </span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {a.type === 'measure' ? 'Midió' : a.type === 'replace' ? 'Reemplazó' : 'Verificó'}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {a.target}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Botón completar */}
            <button
              type="button"
              onClick={handleComplete}
              className="rounded-xl px-4 py-2.5 text-sm font-medium transition-opacity"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                opacity: order.actions.length > 0 ? 1 : 0.4,
                cursor: order.actions.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Finalizar diagnóstico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreView({
  score,
  order,
  caseDef,
  onRestart,
  onBack,
}: {
  score: ScoreResult;
  order: WorkOrder;
  caseDef: CaseDefinition;
  onRestart: () => void;
  onBack: () => void;
}) {
  const gradeColors: Record<string, string> = {
    A: 'var(--success)',
    B: '#6590CB',
    C: 'var(--warning)',
    D: 'var(--danger)',
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-lg text-center">
        <div className="glass rounded-[20px] p-8">
          <p className="mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Caso completado
          </p>
          <h1 className="mb-4 font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {caseDef.name}
          </h1>

          {/* Grade */}
          <div
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
            style={{ border: `4px solid ${gradeColors[score.grade]}` }}
          >
            <span className="font-display text-4xl font-bold" style={{ color: gradeColors[score.grade] }}>
              {score.grade}
            </span>
          </div>

          {/* Score breakdown */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Eficiencia
              </p>
              <p className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {score.efficiency}/50
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Rapidez + pasos
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Prolijidad
              </p>
              <p className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {score.thoroughness}/50
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Precisión + checklist
              </p>
            </div>
          </div>

          <p className="mb-6 font-display text-3xl font-bold" style={{ color: gradeColors[score.grade] }}>
            {score.total}/100
          </p>

          {/* Stats */}
          <div className="mb-6 text-left text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p>Acciones totales: {order.actions.length}</p>
            <p>Acciones correctas: {order.actions.filter((a) => a.correct).length}</p>
            <p>Piezas reemplazadas: {order.partsReplaced.length}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onRestart}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Intentar de nuevo
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium"
              style={{ background: 'var(--glass-surface-2)', color: 'var(--text-primary)' }}
            >
              Elegir otro caso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChallengeScreen() {
  const [screen, setScreen] = useState<Screen>('select');
  const [selectedCase, setSelectedCase] = useState<CaseDefinition | null>(null);
  const [result, setResult] = useState<{ order: WorkOrder; score: ScoreResult } | null>(null);

  function handleSelectCase(c: CaseDefinition) {
    setSelectedCase(c);
    setScreen('play');
  }

  function handleComplete(order: WorkOrder, score: ScoreResult) {
    setResult({ order, score });
    setScreen('result');
  }

  function handleRestart() {
    setResult(null);
    setScreen('play');
  }

  function handleBack() {
    setSelectedCase(null);
    setResult(null);
    setScreen('select');
  }

  if (screen === 'select' || !selectedCase) {
    return <CaseSelector onSelect={handleSelectCase} />;
  }

  if (screen === 'result' && result) {
    return (
      <ScoreView
        score={result.score}
        order={result.order}
        caseDef={selectedCase}
        onRestart={handleRestart}
        onBack={handleBack}
      />
    );
  }

  return <PlayView caseDef={selectedCase} onComplete={handleComplete} />;
}
