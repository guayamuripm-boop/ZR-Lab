import { useEffect, useMemo, useState } from 'react';
import { Multimeter } from '../../instruments/Multimeter';
import { Oscilloscope } from '../../instruments/Oscilloscope';
import { nodeForMeasurementPoint } from '../../scene/measurementPoints';
import { useLessonStore } from '../../stores/useLessonStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useWindowSize } from '../../hooks/useWindowSize';
import { recordLessonProgress, awardBadge, logActivity } from '../../services/progressService';
import { isAutoAdvanceStep, validateMeasure, validateQuiz, validateToggle, validateScope } from './lessonValidation';
import { OrderStep } from './OrderStep';

export function LessonPlayer() {
  const activeLesson = useLessonStore((s) => s.activeLesson);
  const stepIndex = useLessonStore((s) => s.currentStepIndex);
  const hintVisible = useLessonStore((s) => s.hintVisible);
  const nextStep = useLessonStore((s) => s.nextStep);
  const toggleHint = useLessonStore((s) => s.toggleHint);
  const completeLesson = useLessonStore((s) => s.completeLesson);
  const endLesson = useLessonStore((s) => s.endLesson);

  const probes = useSceneStore((s) => s.probes);
  const ignition = useSceneStore((s) => s.ignition);
  const engineRunning = useSceneStore((s) => s.engineRunning);
  const getEngine = useSceneStore((s) => s.getEngine);
  const setMultimeterMode = useSceneStore((s) => s.setMultimeterMode);
  const masterComponent = useSceneStore((s) => s.masterComponent);
  const centerCameraOnPiece = useSceneStore((s) => s.centerCameraOnPiece);
  const { width, height } = useWindowSize();

  const [quizSelection, setQuizSelection] = useState<number | null>(null);
  const [orderCorrect, setOrderCorrect] = useState(false);

  const step = activeLesson?.steps[stepIndex];
  const isLastStep = activeLesson ? stepIndex === activeLesson.steps.length - 1 : false;

  // Reinicia el estado local de interacción al cambiar de paso.
  useEffect(() => {
    setQuizSelection(null);
    setOrderCorrect(false);
    if (step?.type === 'measure' && step.mode) {
      setMultimeterMode(step.mode);
    }
    // Centra la cámara en el componente cuando el paso es 'focus'
    if (step?.type === 'focus' && step.target) {
      centerCameraOnPiece(step.target, width, height);
    }
  }, [stepIndex, step?.type, step?.mode, step?.target, setMultimeterMode, centerCameraOnPiece, width, height]);

  // Registra el inicio de la lección.
  useEffect(() => {
    if (activeLesson && stepIndex === 0) {
      recordLessonProgress(activeLesson.id, 'in_progress');
      logActivity('lesson_started', { lesson_id: activeLesson.id });
    }
  }, [activeLesson, stepIndex]);

  const measureValidation = useMemo(() => {
    if (step?.type !== 'measure') return null;
    const nodeA = nodeForMeasurementPoint(probes.red);
    const nodeB = nodeForMeasurementPoint(probes.black);
    if (!nodeA || !nodeB) return { passed: false, feedbackKey: null as null | 'reversed' | 'open' };
    const engine = getEngine();
    const meter = new Multimeter();
    meter.setMode(step.mode ?? 'V');
    meter.connect({ red: nodeA, black: nodeB });
    return validateMeasure(meter.read(engine), step.expect ?? {});
    // ignition/engineRunning se leen dentro de getEngine(); son deps reales aunque el linter no lo vea.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, probes.red, probes.black, ignition, engineRunning, getEngine]);

  const toggleValid = useMemo(() => {
    if (step?.type !== 'toggle') return false;
    return validateToggle({ ignition, engineRunning }, step.expect ?? {});
  }, [step, ignition, engineRunning]);

  const scopeValidation = useMemo(() => {
    if (step?.type !== 'oscilloscope' || !step.scopeNode) return null;
    const engine = getEngine();
    const scope = new Oscilloscope();
    scope.connect({ node: step.scopeNode });
    const waveform = scope.capture(engine);
    return validateScope(waveform, {
      vpp: step.expectVpp,
      vdc: step.expectVdc,
      ripple: step.expectRipple,
    });
    // ignition/engineRunning se leen dentro de getEngine(); son deps reales aunque el linter no lo vea.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, ignition, engineRunning, getEngine]);

  if (!activeLesson || !step) return null;

  const stepReady = (() => {
    switch (step.type) {
      case 'measure':
        return measureValidation?.passed ?? false;
      case 'toggle':
        return toggleValid;
      case 'quiz':
        return quizSelection !== null && validateQuiz(quizSelection, step.answer as number);
      case 'order':
        return orderCorrect;
      case 'oscilloscope':
        return scopeValidation?.passed ?? false;
      default:
        return isAutoAdvanceStep(step);
    }
  })();

  function handleAdvance() {
    if (isLastStep) {
      completeLesson();
      if (activeLesson) {
        const score = 100;
        recordLessonProgress(activeLesson.id, 'completed', score);
        logActivity('lesson_completed', { lesson_id: activeLesson.id });
        if (step && step.badge) awardBadge(step.badge);
        if (activeLesson.component_id) masterComponent(activeLesson.component_id);
      }
      endLesson();
      return;
    }
    nextStep();
  }

  const progressPct = ((stepIndex + 1) / activeLesson.steps.length) * 100;

  return (
    <div className="glass fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-3 md:inset-x-4 md:bottom-4 md:rounded-[20px]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {activeLesson.title} · Paso {stepIndex + 1}/{activeLesson.steps.length}
        </span>
        <button
          type="button"
          onClick={endLesson}
          aria-label="Salir de la lección"
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Salir
        </button>
      </div>

      <div className="mb-3 h-1 w-full overflow-hidden rounded-full" style={{ background: 'var(--glass-surface-2)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progressPct}%`, background: 'var(--accent)' }}
        />
      </div>

      <div style={{ color: 'var(--text-primary)' }} aria-live="polite">
        <StepBody
          step={step}
          quizSelection={quizSelection}
          onQuizSelect={setQuizSelection}
          onOrderResolved={setOrderCorrect}
          measureFeedback={measureValidation?.feedbackKey ?? null}
          measurePassed={measureValidation?.passed ?? false}
          toggleValid={toggleValid}
          scopeValidation={scopeValidation}
        />
      </div>

      {hintVisible && step.hint ? (
        <p className="mt-2 rounded-lg p-2 text-sm" style={{ background: 'var(--glass-surface-2)', color: 'var(--text-secondary)' }}>
          💡 {step.hint}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        {step.hint ? (
          <button
            type="button"
            onClick={toggleHint}
            className="rounded-full px-3 py-1.5 text-sm"
            style={{ background: 'var(--glass-surface-2)', color: 'var(--text-secondary)' }}
          >
            💡 Pista
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleAdvance}
          disabled={!stepReady}
          className="rounded-xl px-5 py-2 text-sm font-medium transition-opacity"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            opacity: stepReady ? 1 : 0.4,
            cursor: stepReady ? 'pointer' : 'not-allowed',
            boxShadow: stepReady ? 'var(--glow)' : 'none',
          }}
        >
          {isLastStep ? 'Terminar' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}

interface StepBodyProps {
  step: import('../../content/types').LessonStep;
  quizSelection: number | null;
  onQuizSelect: (i: number) => void;
  onOrderResolved: (ok: boolean) => void;
  measureFeedback: 'reversed' | 'open' | null;
  measurePassed: boolean;
  toggleValid: boolean;
  scopeValidation: { vppOk: boolean; vdcOk: boolean; rippleOk: boolean; passed: boolean } | null;
}

function StepBody({
  step,
  quizSelection,
  onQuizSelect,
  onOrderResolved,
  measureFeedback,
  measurePassed,
  toggleValid,
  scopeValidation,
}: StepBodyProps) {
  switch (step.type) {
    case 'intro':
    case 'focus':
    case 'summary':
      return <p className="text-sm leading-relaxed">{step.text}</p>;

    case 'measure':
      return (
        <div className="text-sm leading-relaxed">
          <p>{step.instruction}</p>
          {measurePassed ? (
            <p className="mt-1 font-medium" style={{ color: 'var(--success)' }}>
              ¡Bien ahí! Medición correcta.
            </p>
          ) : measureFeedback === 'reversed' ? (
            <p className="mt-1" style={{ color: 'var(--warning)' }}>
              {step.wrongFeedback?.reversed ?? 'Lectura negativa: invertiste las sondas.'}
            </p>
          ) : measureFeedback === 'open' ? (
            <p className="mt-1" style={{ color: 'var(--warning)' }}>
              {step.wrongFeedback?.open ?? 'OL: no hay continuidad. Revisa la colocación de las sondas.'}
            </p>
          ) : null}
        </div>
      );

    case 'toggle':
      return (
        <div className="text-sm leading-relaxed">
          <p>{step.instruction}</p>
          {toggleValid ? (
            <p className="mt-1 font-medium" style={{ color: 'var(--success)' }}>
              Posición correcta.
            </p>
          ) : null}
        </div>
      );

    case 'quiz':
      return (
        <div className="text-sm">
          <p className="mb-2 font-medium">{step.question}</p>
          <div className="flex flex-col gap-2">
            {step.options?.map((option, i) => {
              const selected = quizSelection === i;
              const isCorrect = i === step.answer;
              const showResult = quizSelection !== null;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onQuizSelect(i)}
                  className="rounded-lg px-3 py-2 text-left transition-colors"
                  style={{
                    background:
                      showResult && isCorrect
                        ? 'color-mix(in srgb, var(--success) 25%, transparent)'
                        : selected
                          ? 'color-mix(in srgb, var(--danger) 25%, transparent)'
                          : 'var(--glass-surface-2)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {quizSelection !== null ? (
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {step.explanation}
            </p>
          ) : null}
        </div>
      );

    case 'order':
      return <OrderStep step={step} onResolved={onOrderResolved} />;

    case 'oscilloscope':
      return (
        <div className="text-sm leading-relaxed">
          <p>{step.instruction}</p>
          {scopeValidation?.passed ? (
            <p className="mt-1 font-medium" style={{ color: 'var(--success)' }}>
              ¡Forma de onda correcta!
            </p>
          ) : scopeValidation ? (
            <div className="mt-1 flex flex-col gap-1">
              {!scopeValidation.vppOk && (
                <p style={{ color: 'var(--warning)' }}>
                  Vpp fuera de rango esperado.
                </p>
              )}
              {!scopeValidation.vdcOk && (
                <p style={{ color: 'var(--warning)' }}>
                  Vdc fuera de rango esperado.
                </p>
              )}
              {!scopeValidation.rippleOk && (
                <p style={{ color: 'var(--warning)' }}>
                  {step.expectRipple ? 'Se esperaba rizado presente.' : 'No se esperaba rizado.'}
                </p>
              )}
            </div>
          ) : null}
        </div>
      );

    default:
      return null;
  }
}
