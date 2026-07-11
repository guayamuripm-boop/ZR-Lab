# 05 — Roadmap Detallado

**Proyecto:** ZR Lab | **Horizonte:** v1 (Academia) → v2 (Reto) → v3 (Carrera + IA) → v4 (3D opcional)
**Supuesto de dedicación:** 1-2 personas a tiempo parcial, asistidas por IA (Claude Code) como constructor principal.
**Regla:** una fase no inicia hasta que la anterior cumple TODOS sus criterios de "hecho". No se saltan fases.

---

## Mapa General

```
V1 · MODO ACADEMIA (≈ 10-13 semanas)
├── F0  Preparación e infraestructura          (semana 1)
├── F1  Motor de simulación + multímetro       (semanas 2-3)
├── F2  Contenido pedagógico validado          (semanas 2-4, paralelo)
├── F3  Kit visual isométrico + sistema glass  (semanas 3-5, paralelo)
├── F4  Escena del taller interactiva          (semanas 5-7)
├── F5  Lecciones + progreso + insignias       (semanas 7-9)
├── F6  Cuentas, cohortes, panel instructor    (semanas 9-10)
├── F7  PWA, pulido, QA y piloto               (semanas 10-13)
▼
V2 · MODO RETO (≈ 8-10 semanas)
├── F8  Motor de fallas + catálogo             
├── F9  Osciloscopio + escáner OBD virtual     
├── F10 Orden de trabajo, factura, puntaje     
├── F11 Leaderboard + editor de casos          
▼
V3 · CARRERA + IA (≈ 6-8 semanas)
├── F12 Progresión narrativa e insignias pro   
├── F13 Copiloto IA de pistas                  
├── F14 Certificados PDF + analítica docente   
▼
V4 · 3D (OPCIONAL, solo si v1-v3 validadas)
└── F15 Migración de escena a Babylon.js       
```

---

## V1 — MODO ACADEMIA (detalle por fase)

### F0 · Preparación e Infraestructura — 1 semana
**Objetivo:** todo el andamiaje listo para construir sin fricción.

| # | Entregable | Detalle |
|---|---|---|
| F0.1 | Repo GitHub privado `zr-lab` | rama `main` protegida, plantilla de PR |
| F0.2 | Proyecto Supabase `zr-lab` | región más cercana, Auth email habilitado |
| F0.3 | Proyecto Vercel conectado al repo | deploy automático de `main` |
| F0.4 | Scaffold frontend | Vite + React + TS + Tailwind + Konva + Zustand + estructura de carpetas del doc 03 §5 |
| F0.5 | Tokens de tema implementados | `tokens.css` con dark/light del doc 04 + ThemeToggle funcional |
| F0.6 | CI mínimo | GitHub Action: lint + typecheck + test en cada PR |

**Criterio de hecho:** URL de Vercel muestra página "ZR Lab" con logo, tema dark/light conmutables, y `npm test` pasa en CI.

---

### F1 · Motor de Simulación + Multímetro — 2 semanas
**Objetivo:** el cerebro funciona y está probado ANTES de tener gráficos.

| # | Entregable | Detalle |
|---|---|---|
| F1.1 | `types.ts` + definición del circuito de arranque y carga | 12 componentes, nodos y conexiones según doc 08 §2 |
| F1.2 | `CircuitEngine` con escenarios | reposo / llave ON / crank / motor encendido |
| F1.3 | `Multimeter` (capa 3) | modos V y Ω, incluidas lecturas de error (sondas invertidas → negativo, circuito abierto → OL) |
| F1.4 | Suite de tests Vitest ≥ 25 casos | cada escenario × puntos de medición clave del doc 08 §4 |
| F1.5 | Página de desarrollo `/dev/engine` | UI cruda (sin diseño) para probar el motor manualmente |

**Criterio de hecho:** los 25+ tests pasan; en `/dev/engine` se selecciona escenario y par de nodos y las lecturas coinciden con la tabla del doc 08 §4.

---

### F2 · Contenido Pedagógico Validado — paralelo a F1
**Objetivo:** todo el contenido escrito y aprobado por un instructor real antes de programار lecciones.

| # | Entregable |
|---|---|
| F2.1 | Fichas de las 12 piezas completas (doc 08 §3) en JSON semilla |
| F2.2 | Guiones de las 15 lecciones (12 + 3 integradoras) en el esquema de pasos del doc 03 §4.2 |
| F2.3 | Revisión técnica firmada por instructor de ZR Mecademy (checklist de precisión técnica) |
| F2.4 | Carga en tablas `systems`, `components`, `lessons` de Supabase |

**Criterio de hecho:** un instructor leyó y aprobó cada ficha y lección; los JSON validan contra el esquema; datos visibles en Supabase.

---

### F3 · Kit Visual Isométrico + Sistema Glass — paralelo, semanas 3-5
**Objetivo:** todos los assets visuales listos para ensamblar.

| # | Entregable |
|---|---|
| F3.1 | Plantilla Figma con grilla isométrica 2:1 y paleta ZR extendida |
| F3.2 | 12 SVG de componentes (`iso-*.svg`) + base del motor + banco de escena |
| F3.3 | Trazados de cableado (positivo, masa, señal) como paths SVG |
| F3.4 | Componentes React glass: GlassPanel, GlassButton, Toast, ProgressRing, BadgeCard (Storybook o página `/dev/ui`) |
| F3.5 | 15 iconos de insignia (SVG simple, estilo línea + dorado) |

**Criterio de hecho:** página `/dev/ui` muestra todos los componentes glass en ambos temas; los 12 SVG isométricos ensamblan visualmente coherentes en una prueba estática.

---

### F4 · Escena del Taller Interactiva — 2-3 semanas
**Objetivo:** el corazón visual del producto funcionando.

| # | Entregable |
|---|---|
| F4.1 | `WorkshopStage` con los 12 componentes posicionados, zoom/pan con límites e inercia suave |
| F4.2 | Interacción de pieza: hover glow → clic → PartPanel con datos reales de Supabase |
| F4.3 | Estados visuales de pieza (no descubierta / vista / dominada) |
| F4.4 | Llave de encendido interactiva (off/on/crank) conectada al motor |
| F4.5 | Sondas de multímetro arrastrables + MultimeterHUD con lecturas reales del engine |
| F4.6 | Animación de flujo de corriente en cables |
| F4.7 | Responsive: bottom-sheet móvil, gestos táctiles |

**Criterio de hecho:** en la PC del proyecto (i3, sin GPU) la escena va fluida (≥30fps); demo completa: explorar pieza → girar llave → medir batería en crank y ver la caída de voltaje real.

---

### F5 · Lecciones + Progreso + Insignias — 2 semanas
| # | Entregable |
|---|---|
| F5.1 | `LessonPlayer` que interpreta los 7 tipos de paso |
| F5.2 | Sistema de pistas (botón 💡, pista contextual del paso) |
| F5.3 | Persistencia de progreso (discoveries, lesson_progress, badges) vía progressService |
| F5.4 | Dashboard del estudiante con rings, insignias y "continuar donde quedé" |
| F5.5 | Animaciones de celebración (lección completa, insignia, pieza dominada) |
| F5.6 | Onboarding de primer ingreso (5 pasos) |

**Criterio de hecho:** un usuario nuevo completa las lecciones 1-3 de corrido sin ayuda externa; cierra sesión, vuelve, y retoma exactamente donde quedó.

---

### F6 · Cuentas, Cohortes y Panel Instructor — 1-2 semanas
| # | Entregable |
|---|---|
| F6.1 | Auth completo: registro, login, recuperación, con pantallas glass |
| F6.2 | Flujo de código de clase (unirse a cohorte) |
| F6.3 | Modo invitado/demo (solo explorador, banner de registro) |
| F6.4 | Panel instructor: crear cohorte, código, tabla de progreso |
| F6.5 | RLS auditado tabla por tabla (checklist del doc 03 §4.3) |

**Criterio de hecho:** test con 3 cuentas (estudiante A, estudiante B, instructor): cada quien ve solo lo que debe; instructor ve a ambos.

---

### F7 · PWA, Pulido, QA y Piloto — 2-3 semanas
| # | Entregable |
|---|---|
| F7.1 | PWA instalable (manifest, iconos, splash con logo ZR) |
| F7.2 | Optimización: code-splitting, SVGO, Lighthouse ≥ 85/90/90/90 |
| F7.3 | Pase de accesibilidad (axe-core sin errores críticos) |
| F7.4 | QA con guion de pruebas (30 casos, doc 07 §6) en 3 dispositivos reales |
| F7.5 | Dominio final (ej. `lab.zrmecademy.com`) |
| F7.6 | **Piloto con 8-15 estudiantes reales** durante 2 semanas + encuesta |
| F7.7 | Informe de piloto y backlog de ajustes |

**Criterio de hecho (= lanzamiento v1):** métricas del piloto alcanzan ≥70% de las metas del doc 01 §8; bugs críticos = 0; dirección aprueba lanzamiento.

---

## V2 — MODO RETO (resumen ejecutable; se detalla al cerrar v1)

| Fase | Contenido | Estimado |
|---|---|---|
| F8 | Motor de fallas: `applyFault()` sobre el engine existente; catálogo inicial de 12 fallas del sistema de arranque (doc 08 §5); tabla `faults` + `cases` | 2 sem |
| F9 | Osciloscopio virtual (señal de rizado del alternador, señal del solenoide) + escáner básico | 2-3 sem |
| F10 | Flujo de reto completo: orden de trabajo → diagnóstico → reemplazo de piezas con costo → checklist de cierre → puntaje 100/50/25/12.5 (50% eficiencia + 50% prolijidad) | 2 sem |
| F11 | Leaderboard (global + cohorte) + editor de casos para instructores (formulario, sin código) | 2 sem |

## V3 — CARRERA + IA (resumen)

| Fase | Contenido | Estimado |
|---|---|---|
| F12 | Rangos (Aprendiz→Maestro), casos encadenados con narrativa, insignias pro | 2-3 sem |
| F13 | Copiloto IA de pistas: API Claude (Haiku para costo mínimo), pistas progresivas basadas en el estado del ejercicio, sin regalar respuesta; límite de uso por estudiante | 2 sem |
| F14 | Certificados PDF automáticos + panel docente con mapa de calor de errores (usa `activity_log` acumulado desde v1) | 2-3 sem |

## V4 — 3D (condicional)
Solo si: v1-v3 estables + demanda real + presupuesto para arte. Migrar únicamente la capa de escena a Babylon.js reutilizando engine, instrumentos, lecciones y backend intactos (garantizado por la arquitectura de capas).

---

## Gestión del Roadmap

- `STATUS.md` en la raíz refleja SIEMPRE la fase activa y el próximo entregable
- Cada entregable terminado se marca en este documento con ✅ y fecha
- Cambios de alcance: se anotan en la sección de decisiones del doc 00 con aprobación del director
- Si una fase se atrasa >50% de su estimado: reunión de replanificación, se recorta alcance de la fase, nunca calidad de lo entregado
