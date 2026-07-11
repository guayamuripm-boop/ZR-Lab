# 03 — Arquitectura Técnica

**Proyecto:** ZR Lab | **Alcance:** arquitectura completa (v1 construye Academia; el diseño ya contempla v2/v3 para no refactorizar)

---

## 1. Vista General

```
┌──────────────────────────────────────────────────────────────┐
│  CAPA 4 · PRESENTACIÓN (React + Konva.js)                    │
│  Escena 2.5D isométrica · Paneles glass · Dashboard          │
│  Temas dark/light · PWA                                      │
└───────────────┬──────────────────────────────────────────────┘
                │ hooks (useSimulator, useLesson, useProgress)
┌───────────────▼──────────────────────────────────────────────┐
│  CAPA 3 · INSTRUMENTOS VIRTUALES (TypeScript puro)           │
│  Multímetro (v1) · Osciloscopio (v2) · Escáner (v2)          │
│  Contrato: instrument.measure(pointA, pointB) → Reading      │
└───────────────┬──────────────────────────────────────────────┘
                │ consulta estado
┌───────────────▼──────────────────────────────────────────────┐
│  CAPA 2 · MOTOR DE SIMULACIÓN (TypeScript puro, sin UI)      │
│  CircuitEngine: grafo de componentes + propagación de estado │
│  Sin dependencias de React ni Konva → 100% testeable         │
└───────────────┬──────────────────────────────────────────────┘
                │ carga definiciones
┌───────────────▼──────────────────────────────────────────────┐
│  CAPA 1 · DATOS (Supabase / PostgreSQL + archivos JSON)      │
│  Definición del circuito · Lecciones · Progreso · Usuarios   │
│  Auth + RLS · Storage para assets                            │
└──────────────────────────────────────────────────────────────┘
```

**Regla arquitectónica #1:** Las capas 2 y 3 son TypeScript puro, sin imports de React/Konva/Supabase. Se prueban con Vitest sin navegador.
**Regla arquitectónica #2:** La escena visual (capa 4) nunca calcula valores eléctricos; solo pregunta al motor y dibuja.
**Regla arquitectónica #3:** El contenido pedagógico (textos, lecciones, valores) vive en datos (JSON/DB), nunca hardcodeado en componentes.

---

## 2. Stack Definitivo

| Necesidad | Tecnología | Versión/Notas |
|---|---|---|
| Framework UI | React 18 + TypeScript | Vite como bundler |
| Escena 2.5D | Konva.js + react-konva | Canvas 2D — corre sin GPU |
| Estilos | Tailwind CSS + CSS variables para tokens | Glass via backdrop-filter con fallback |
| Estado global | Zustand | Ligero, sin boilerplate |
| Animaciones UI | Framer Motion (paneles) + Konva tweens (escena) | |
| Backend | Supabase: Auth + PostgreSQL + RLS + Storage | Free tier |
| Hosting | Vercel (plan Hobby) + PWA via vite-plugin-pwa | |
| Testing | Vitest (unidad, capas 2-3) + Playwright (E2E básico) | |
| Calidad | ESLint + Prettier + TypeScript strict | |

---

## 3. Motor de Simulación (Capa 2) — Diseño

### 3.1 Modelo conceptual

El circuito es un **grafo no dirigido** de nodos eléctricos. Los componentes conectan nodos y tienen comportamiento.

```typescript
// types/circuit.ts — contratos centrales

export type ComponentType =
  | 'battery' | 'starter_motor' | 'alternator' | 'ignition_switch'
  | 'starter_relay' | 'fuse' | 'wire' | 'ground' | 'belt'
  | 'battery_terminal' | 'solenoid' | 'warning_lamp';

export interface CircuitComponent {
  id: string;                    // 'bat-01'
  type: ComponentType;
  nodes: string[];               // nodos eléctricos que conecta ['N1','N2']
  properties: {
    voltage?: number;            // fuentes
    resistance: number;          // ohms; Infinity = circuito abierto
    maxCurrent?: number;
    [key: string]: unknown;
  };
  state: 'ok' | 'degraded' | 'failed';  // v1 siempre 'ok'; v2 usa fallas
}

export interface CircuitState {
  ignition: 'off' | 'on' | 'crank';     // posición de la llave
  engineRunning: boolean;
  nodeVoltages: Map<string, number>;     // calculado por el motor
}

export interface Reading {
  value: number;
  unit: 'V' | 'Ω' | 'A';
  display: string;               // "12.6 V" ya formateado
  quality: 'normal' | 'low' | 'high' | 'open';  // para feedback pedagógico
}
```

### 3.2 CircuitEngine — API pública

```typescript
export class CircuitEngine {
  constructor(definition: CircuitDefinition) {}

  setIgnition(pos: 'off' | 'on' | 'crank'): void;
  getVoltageBetween(nodeA: string, nodeB: string): Reading;
  getResistanceBetween(nodeA: string, nodeB: string): Reading;  // circuito desenergizado
  applyFault(componentId: string, fault: FaultSpec): void;      // v2
  clearFaults(): void;
  getComponentState(id: string): CircuitComponent;
  snapshot(): CircuitState;                                     // para la UI
}
```

### 3.3 Estrategia de cálculo (v1 pragmática)

**No** resolvemos mallas de Kirchhoff genéricas en v1. El sistema de arranque y carga se modela con **estados discretos + tabla de escenarios**: para cada combinación (posición de llave × estado de componentes), el motor resuelve voltajes de nodo con reglas simples de divisor y caídas conocidas. Esto es determinista, rapidísimo, testeable y suficiente pedagógicamente.

- `escenarios.ts` define los casos: reposo (12.6V batería), llave ON (consumo leve, ~12.4V), crank (caída a ~10.5V si batería sana), motor encendido (13.8-14.4V por alternador)
- Cada falla (v2) modifica propiedades → el motor recalcula el escenario
- Si en el futuro se necesita simulación general de circuitos, se reemplaza el solver **sin cambiar la API pública** (regla arquitectónica #1 protege esto)

### 3.4 Instrumentos (Capa 3)

```typescript
export interface VirtualInstrument {
  readonly id: 'multimeter' | 'oscilloscope' | 'obd_scanner';
  connect(probes: ProbePlacement): void;
  read(engine: CircuitEngine): Reading | Waveform | DTC[];
  disconnect(): void;
}
```

El multímetro v1 implementa `read()` llamando a `getVoltageBetween`/`getResistanceBetween`. El osciloscopio (v2) devolverá `Waveform` (array de puntos) generada por funciones paramétricas por componente — el motor expone `getSignalAt(node)`.

---

## 4. Modelo de Datos (Supabase)

### 4.1 Tablas

```sql
-- IDENTIDAD ----------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_key text default 'a1',
  role text not null default 'student' check (role in ('student','instructor','admin')),
  cohort_id uuid references cohorts(id),
  created_at timestamptz default now()
);

create table cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,                         -- "Mecánica Básica 2026-B"
  class_code text unique not null,            -- 'ZR7K2M'
  instructor_id uuid references profiles(id),
  active boolean default true,
  created_at timestamptz default now()
);

-- CONTENIDO (editable sin deploy) ------------------------------
create table systems (                         -- 'arranque-carga' es el primero
  id text primary key,                         -- slug
  name text not null,
  description text,
  order_index int default 0,
  published boolean default false
);

create table components (
  id text primary key,                         -- 'alternator'
  system_id text references systems(id),
  name text not null,                          -- 'Alternador'
  short_role text,                             -- función en 1 línea
  full_description text,                       -- markdown
  how_to_test jsonb,                           -- {tool, steps[], normal_values}
  failure_signs jsonb,                         -- {symptoms[], common_causes[]}
  scene_key text,                              -- vincula con el sprite en la escena
  order_index int default 0
);

create table lessons (
  id text primary key,                         -- 'lesson-battery-voltage'
  system_id text references systems(id),
  component_id text references components(id), -- null = lección integradora
  title text not null,
  estimated_minutes int default 4,
  steps jsonb not null,                        -- ver esquema 4.2
  badge_key text,
  order_index int not null,
  prerequisite_lesson_id text references lessons(id)
);

-- PROGRESO ------------------------------------------------------
create table component_discoveries (
  profile_id uuid references profiles(id) on delete cascade,
  component_id text references components(id),
  status text default 'seen' check (status in ('seen','mastered')),
  discovered_at timestamptz default now(),
  primary key (profile_id, component_id)
);

create table lesson_progress (
  profile_id uuid references profiles(id) on delete cascade,
  lesson_id text references lessons(id),
  status text default 'in_progress' check (status in ('in_progress','completed')),
  score int,                                   -- % preguntas correctas
  completed_at timestamptz,
  primary key (profile_id, lesson_id)
);

create table badges_earned (
  profile_id uuid references profiles(id) on delete cascade,
  badge_key text not null,
  earned_at timestamptz default now(),
  primary key (profile_id, badge_key)
);

create table activity_log (                    -- base de la analítica v2
  id bigint generated always as identity primary key,
  profile_id uuid references profiles(id),
  event text not null,                         -- 'lesson_step_completed', 'probe_misplaced'...
  payload jsonb,
  created_at timestamptz default now()
);
```

### 4.2 Esquema JSON de pasos de lección (`lessons.steps`)

```jsonc
[
  { "type": "intro",   "text": "La batería es el corazón eléctrico...", "image": "battery-intro" },
  { "type": "focus",   "target": "battery", "text": "Esta es la batería. Haz clic para acercarte." },
  { "type": "measure", "tool": "multimeter", "mode": "V",
    "probeA": "battery-positive", "probeB": "battery-negative",
    "expect": { "min": 12.4, "max": 12.7 },
    "instruction": "Coloca la sonda roja en el borne positivo y la negra en el negativo.",
    "hint": "El borne positivo tiene la marca + y suele tener tapa roja.",
    "wrongFeedback": { "reversed": "Lectura negativa: invertiste las sondas. En la práctica real esto puede dañar instrumentos análogos." } },
  { "type": "quiz",    "question": "¿Cuál es el voltaje normal de una batería en reposo?",
    "options": ["12.6 V", "14.4 V", "10.5 V", "9 V"], "answer": 0,
    "explanation": "12.4–12.7 V indica carga completa en reposo. 14.4 V solo se ve con el motor encendido." },
  { "type": "summary", "text": "Aprendiste a medir voltaje en reposo...", "badge": "battery-master" }
]
```

**Tipos de paso v1:** `intro`, `focus`, `measure`, `toggle` (accionar llave), `order` (ordenar pasos), `quiz`, `summary`. El renderer de lecciones es un intérprete de estos tipos — agregar un tipo nuevo es un solo componente nuevo.

### 4.3 Políticas RLS (resumen obligatorio)

- `profiles`: cada usuario lee/edita solo el suyo; instructores leen los de su cohorte; admin todo
- `*_progress`, `discoveries`, `badges`, `activity_log`: insert/select solo del propio `profile_id`; instructores select de su cohorte
- Contenido (`systems`, `components`, `lessons`): select público autenticado (+ anónimo para demo); escritura solo admin
- **Ninguna tabla sin RLS activado. Sin excepciones.**

---

## 5. Estructura de Carpetas del Frontend

```
frontend/src/
├── engine/                  # CAPA 2 — TypeScript puro
│   ├── CircuitEngine.ts
│   ├── scenarios.ts
│   ├── types.ts
│   └── __tests__/
├── instruments/             # CAPA 3 — TypeScript puro
│   ├── Multimeter.ts
│   └── __tests__/
├── scene/                   # CAPA 4a — escena Konva
│   ├── WorkshopStage.tsx    # stage principal isométrico
│   ├── ComponentSprite.tsx  # pieza interactiva genérica
│   ├── WireLayer.tsx        # cables y animación de flujo
│   ├── ProbeLayer.tsx       # sondas arrastrables del multímetro
│   └── camera.ts            # zoom/pan con límites
├── components/              # CAPA 4b — UI glass
│   ├── ui/                  # GlassPanel, GlassButton, Badge, ProgressRing...
│   ├── PartPanel/           # panel de pieza (4 secciones)
│   ├── LessonPlayer/        # intérprete de pasos de lección
│   ├── MultimeterHUD/       # display del multímetro
│   └── Dashboard/           # progreso, insignias
├── pages/                   # Home, Workshop, Lessons, Profile, InstructorPanel
├── stores/                  # Zustand: useSession, useProgress, useSceneStore
├── services/                # supabaseClient.ts, progressService.ts, contentService.ts
├── content/                 # JSON semilla (mismo esquema que DB) para dev/demo offline
├── styles/                  # tokens.css (variables de tema), glass.css
└── App.tsx
```

---

## 6. Decisiones Técnicas Registradas (ADR resumido)

| # | Decisión | Alternativa descartada | Razón |
|---|---|---|---|
| ADR-1 | Konva.js (Canvas 2D) para la escena | Three.js/WebGL | PC objetivo sin GPU; 2.5D isométrico no necesita 3D real |
| ADR-2 | Estados discretos en el motor v1 | Solver de circuitos genérico | Suficiente pedagógicamente, 10x menos complejidad, misma API pública |
| ADR-3 | Zustand | Redux / Context puro | Mínimo boilerplate, stores separados por dominio |
| ADR-4 | Contenido en Supabase + JSON semilla espejo | Solo hardcode o solo DB | Editable sin deploy (DB) pero desarrollable offline (JSON) |
| ADR-5 | Tailwind + CSS variables | CSS-in-JS | Temas dark/light por variables; rendimiento; velocidad de desarrollo |
| ADR-6 | Vite + PWA plugin | Next.js | No necesitamos SSR; SPA + PWA es más simple y liviana |
| ADR-7 | Assets isométricos como SVG optimizado | PNG sprites | Escala sin peso, tematizable por CSS/JS, edición futura fácil |

---

## 7. Contratos de Integración (para que nadie se pise)

- La escena **emite eventos**, no lógica: `onComponentClick(id)`, `onProbePlaced(probeId, targetKey)`, `onIgnitionChange(pos)`
- El LessonPlayer **escucha eventos** y valida contra el paso actual; si coincide, avanza
- El motor **es la única fuente de verdad** de lecturas; el HUD del multímetro solo formatea `Reading.display`
- El progreso se escribe **solo** a través de `progressService` (nunca supabase directo desde componentes)
- Todo texto visible al usuario sale de `content/` o de la DB — cero strings en JSX
