# STATUS — ZR Lab

**Última actualización:** 2026-07-10
**Fase activa:** F5 · Lecciones y Progreso (completa y verificada en el navegador)
**Versión objetivo:** v1 Modo Academia

## Sprint actual

F0 — Preparación e Infraestructura (ver doc 05 F0 y doc 06 Fase 0)

## ✅ Completado

**2026-07-10 — Planificación estratégica completa:**
- [x] Análisis de PDFs de referencia (auditoría Electude + roadmap low-cost)
- [x] Investigación de identidad ZR Mecademy (manual 2025: paleta, tipografías, logos, patrón)
- [x] Decisiones estratégicas cerradas: nombre **ZR Lab**, visual **2.5D isométrico**, MVP **arranque y carga**, lanzamiento **Modo Academia**
- [x] Suite completa de documentación (docs/00 a 09)
- [x] Assets de marca copiados a `frontend/public/assets/brand/`
- [x] Memoria persistente actualizada

**2026-07-10 — F0.4 Scaffold del frontend + F0.5 CI:**
- [x] Vite + React 18 + TypeScript strict en `frontend/` (estructura de carpetas del doc 03 §5)
- [x] Tailwind + `styles/tokens.css` con temas dark/light exactos del doc 04 §2
- [x] `ThemeToggle` funcional, persiste en localStorage, verificado en navegador (dark↔light, sobrevive recarga)
- [x] Página `Home` con logo de marca sobre fondo gradient del tema
- [x] ESLint + Prettier + Vitest configurados; `npm run dev`, `build`, `lint`, `typecheck`, `test` — todos verdes
- [x] `.github/workflows/ci.yml`: lint + typecheck + test en cada push/PR, Node 20
- [x] `.claude/launch.json` agregado para levantar el dev server con el Browser pane
- [x] Repo git local inicializado en `C:\Dev\ZRLab` (¡ojo! `C:\` tenía un `.git` de raíz que englobaba todo el disco — no se tocó, se creó uno nuevo aislado en el proyecto)
- [x] Conectado a `origin` → https://github.com/guayamuripm-boop/ZR-Lab.git, push inicial hecho a `main`
- [x] `frontend/.env.local` con credenciales reales de Supabase (`ubolltmmahcwdywdyssp`), gitignored
- [x] `services/supabaseClient.ts` (cliente Supabase básico)

**2026-07-10 — F1 Motor de Simulación + Multímetro (completa):**
- [x] `engine/types.ts`, `engine/circuitDefinition.ts` (12 componentes, 11 nodos del doc 08 §2), `engine/scenarios.ts` (tabla exacta doc 08 §4)
- [x] `CircuitEngine` completo: setIgnition, setEngineRunning, getVoltageBetween, getResistanceBetween, applyFault/clearFaults, getComponentState, snapshot, isChargeLampOn
- [x] `instruments/Multimeter.ts` (capa 3, TypeScript puro, modos V/Ω)
- [x] 44 tests Vitest verdes (mínimo pedido: 25) cubriendo los 4 escenarios × puntos de medición, sondas invertidas (negativo), circuito abierto (OL)
- [x] Página `/dev/engine` — verificada manualmente en navegador: reposo=12.6V, crank=10.5V, motor encendido=14.1V, fusible sano=0.0Ω ✓ todo coincide con doc 08 §4

**2026-07-10 — F2 Contenido Pedagógico (JSON + migraciones listas):**
- [x] `content/components.json` — 12 fichas completas (4 secciones c/u), derivadas fielmente del doc 08 §3 (3 fichas ya completas + 9 resumidas expandidas estructuralmente, sin inventar valores)
- [x] `content/lessons.json` — 15 lecciones (12 + 3 integradoras), 4-8 pasos cada una, valores tomados exactamente de la tabla maestra doc 08 §4, sondas mapeadas a los nodos reales del `CircuitEngine`
- [x] `content/types.ts` — tipos compartidos del esquema de contenido
- [x] 47 tests de validación de esquema (12 fichas × 4 secciones, 15 lecciones × 4-8 pasos, ids únicos, referencias de prerequisito/componente válidas)
- [x] `services/contentService.ts` — lee de Supabase, cae automáticamente al JSON local si la tabla no existe o falla la red (ADR-4)
- [x] `backend/supabase/migrations/001_initial_schema.sql` — todas las tablas + RLS del doc 03 §4.1/§4.3 (política por tabla, incluida cohortes/instructor)
- [x] `backend/supabase/migrations/002_seed_content.sql` — generado automáticamente desde los JSON (`frontend/scripts/generate-seed-sql.mjs`, re-ejecutable si el contenido cambia)
- [x] 95 tests Vitest verdes en total; typecheck/lint/build limpios

⚠️ **Este contenido es BORRADOR.** Antes de F2.4 (carga real en Supabase) falta la firma del instructor técnico sobre el doc 08 (checklist §7) — regla dura de doc 05/06, no se salta.

## ⏭ Siguiente paso exacto

**Pasos manuales pendientes (no los puede ejecutar la IA):**
1. **F2.3** — Sesión con el instructor técnico de ZR Mecademy: validar/firmar el doc 08 (checklist §7) — valores eléctricos, terminología, orden de lecciones, seguridad
2. **F2.4** — Con el doc 08 ya firmado: Supabase Dashboard → SQL Editor → ejecutar `001_initial_schema.sql` y luego `002_seed_content.sql` (doc 06 Paso 2.2). La IA no tiene una service-role key ni contraseña de base de datos, solo la anon/publishable key, así que no puede ejecutar DDL directamente
3. **F0.2 verificación** — confirmar que el proyecto Supabase `ubolltmmahcwdywdyssp` tiene Auth email habilitado
4. **F0.3** — Crear/confirmar proyecto Vercel conectado al repo `ZR-Lab`, configurar env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
5. **CI workflow** — el commit del workflow quedó local (el PAT guardado no tiene scope `workflow`); push manual o regenerar el token con ese scope

**2026-07-10 — F3 Kit Visual (componentes glass completos):**
- [x] `components/ui/GlassPanel.tsx` — 3 elevaciones (hud/panel/modal) con blur/radios del doc 04 §2.4
- [x] `components/ui/GlassButton.tsx` — primario/secundario/ghost con curva de movimiento única
- [x] `components/ui/Toast.tsx`, `ProgressRing.tsx`, `BadgeCard.tsx` (badge dorado al ganarse)
- [x] Página `/dev/ui` — verificada en el navegador en dark y light: todos los componentes renderizan, el toggle de tema funciona, el toast aparece y se autodescarta a los 3s
- [x] Kit isométrico **placeholder**: 12 SVG en `frontend/public/assets/iso/iso-{id}.svg`, cajas/cilindros/discos simples con la paleta ZR, generados por `frontend/scripts/generate-placeholder-iso.mjs` — **NO es el arte final**, es solo para no bloquear la Fase 4. El arte definitivo (doc 06 Paso 3.1: grilla isométrica en Figma, 3 valores por cara) sigue siendo trabajo manual de diseño

⚠️ **Kit isométrico placeholder, no final.** Cuando el diseñador entregue los 12 SVG reales desde Figma, solo hay que reemplazar los archivos en `frontend/public/assets/iso/` — el resto del código (WorkshopStage en F4) los consume por nombre de archivo, sin acoplarse al placeholder.

**2026-07-10 — F4 Escena del Taller (funcional, arte placeholder):**
- [x] `scene/layout.json` — posiciones de las 12 piezas + 11 puntos de medición mapeados a los nodos reales del `CircuitEngine` + 4 cables (positivo/masa/señal)
- [x] `scene/camera.ts` — zoom 0.5x-2.5x, paneo con límites e inercia (fricción exponencial), lógica pura con 7 tests
- [x] `stores/useSceneStore.ts` (Zustand) — ignition, engineRunning, selección, descubrimiento, cámara, sondas; 6 tests
- [x] `WorkshopStage` + `ComponentSprite` + `WireLayer` (Konva/react-konva): 12 piezas cargadas desde el kit placeholder, hover glow, clic → selección, cables animados (dash-offset) solo cuando circula corriente real (crank / motor encendido)
- [x] `PartPanel` conectado a `contentService` real, con las 4 pestañas, registra `discoverComponent` + `progressService.recordDiscovery` (no-op en modo invitado, RF-A3)
- [x] `IgnitionKey`: OFF/ON/START con START de presión sostenida (800ms) que auto-enciende el motor, replicando el comportamiento real de una llave
- [x] `ProbeLayer` + `MultimeterHUD`: sondas arrastrables con snap a 11 puntos de medición (`probeSnap.ts`, pura y testeada, 3 tests), lectura real vía `Multimeter`+`CircuitEngine`, animación count-up 300ms
- [x] 115 tests Vitest verdes, typecheck/lint limpios, build 204KB gzip (dentro del presupuesto RNF-2 de 300KB; Konva engordó el bundle — code-splitting queda para F7.1 como ya estaba planeado)

**Verificación manual real hecha en el navegador (Browser pane):**
- ✅ Clic en pieza del canvas → se abre PartPanel con la ficha real, descubrimiento se registra (anillo de progreso sube a 8%)
- ✅ Mantener presionado START → llave pasa a crank (rojo) → tras 800ms el motor arranca solo y queda "Motor encendido"
- ✅ Botones ON/OFF/START reflejan el estado real con el color de acento correcto
- ✅ Canvas renderiza contenido real (no en blanco), sin errores de consola

⚠️ **No verificado por captura de pantalla / arrastre real de sondas.** El captor de pantalla del Browser pane tuvo timeout consistente en esta página (canvas pesado); los eventos DOM sintéticos no logran disparar el drag interno de Konva de forma confiable (limitación conocida: ese tipo de arrastre normalmente se prueba con control de mouse a nivel de SO, no con `dispatchEvent`). La lógica de snapping (`probeSnap.ts`) y de lectura (`Multimeter`+`CircuitEngine`) está 100% cubierta por tests unitarios, pero el gesto de arrastre en el canvas en sí no quedó confirmado visualmente. Recomendado: probarlo a mano en `/taller` antes de dar la fase por cerrada del todo.

**2026-07-10 — F5 Lecciones y Progreso (completa):**
- [x] `LessonPlayer` — intérprete de los 7 tipos de paso (intro/focus/measure/toggle/order/quiz/summary), barra inferior glass, barra de progreso de pasos, botón de pista (💡), validación por eventos de la escena (doc 03 §7)
- [x] `lessonValidation.ts` — validadores puros (measure con detección de sondas invertidas/OL, toggle, quiz, order); 8 tests + 5 tests de integración que reproducen la cadena completa sondas→nodo→Multimeter→validación
- [x] `useLessonStore` (Zustand) — lección activa, paso actual, pista, lecciones completadas; 5 tests
- [x] `LessonPicker` con desbloqueo secuencial (RF-D5: una lección se habilita cuando su prerequisito está completo)
- [x] `OrderStep` — interacción de ordenar pasos (barajado determinista, clic en secuencia)
- [x] `progressService` extendido: `recordLessonProgress`, `awardBadge` (no-op en modo invitado, RF-A3)
- [x] `Dashboard` (doc 04 §5.2) — anillos de progreso, "continuar donde quedé", grid de las 15 insignias
- [x] `OnboardingTour` de 5 pasos saltable (doc 02 HU-01), persiste en localStorage
- [x] 133 tests Vitest verdes, typecheck/lint/build limpios

**Verificación manual real en el navegador (Browser pane):**
- ✅ Onboarding de 5 pasos aparece en el primer ingreso a `/taller`, se puede saltar y no reaparece
- ✅ Selector de lecciones: 15 lecciones, solo la primera desbloqueada (▶️), el resto 🔒
- ✅ Completar la lección 1 la marca ✅ y desbloquea la lección 2 (▶️), la 3 sigue 🔒
- ✅ Quiz: "Siguiente" deshabilitado hasta responder correcto; respuesta incorrecta no habilita, correcta sí
- ✅ Paso measure: renderiza instrucción, "Siguiente" gated, botón de pista presente
- ✅ Dashboard: 7% lecciones (1/15), "continuar donde quedé → La batería", insignia 1/15 marcada

⚠️ **No verificado por arrastre real de sondas en el canvas** (misma limitación de F4: el capturador de pantalla del Browser pane hace timeout y los eventos DOM sintéticos no disparan el drag interno de Konva). El camino "sondas correctas → 12.6V → la lección avanza" (HU-03) está cubierto por 5 tests de integración que ejercen la cadena exacta del LessonPlayer. Recomendado: probarlo a mano.

## ⏭ Siguiente paso exacto

**Siguiente fase que la IA puede seguir avanzando sin bloqueo:** Fase 6 — Cuentas y Cohortes (pantallas de registro/login/recuperación glass, flujo de código de clase, modo invitado con banner, panel de instructor con tabla de progreso). ⚠️ Depende de que Supabase Auth esté habilitado (F0.2) y las tablas migradas (F2.4) para funcionar de verdad, aunque la UI puede construirse antes.

## 🚧 Bloqueadores

Ninguno técnico. Ver "Pasos manuales pendientes" arriba — todos requieren tu cuenta/firma, no la ejecución de código.

## 📋 Backlog

Ver `docs/BACKLOG.md`.
