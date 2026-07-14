# STATUS — ZR Lab

**Última actualización:** 2026-07-13
**Fase activa:** v2 MODO RETO — F8 en progreso (motor de fallas + catálogo). F0-F7 code-complete. QA formal y piloto son tuyos
**Versión objetivo:** v2 Modo Reto (F8-F11)

## 📍 Dónde estamos ahora (2026-07-12)

- ✅ **Deploy en producción funcionando**: https://zr-lab.vercel.app (Supabase Email habilitado, migraciones 001+002 cargadas = 12 componentes + 15 lecciones en DB, Vercel con Root Directory `frontend` y env vars `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`)
- ✅ **F3.2 arte isométrico real** de las 12 piezas (reemplazó los placeholders) — commit `1b4d15e`, ya en producción
- ✅ **F3.2 base del motor + banco de escena** (`public/assets/scene/engine-bay.svg` vía `generate-scene-backdrop.mjs`): vano de motor estilizado detrás de las piezas para que se lean "dentro del vehículo". Integrado en `WorkshopStage` como `SceneBackdrop` no interactivo. 157 tests verdes, build OK.
- ✅ **Fichas de la derecha reescritas para claridad** (arranque + carga): relé, solenoide, correa, testigo de carga y llave de encendido — sin jerga sin explicar, con analogías de taller. **Valores eléctricos idénticos al doc 08** (no se inventó nada). Sigue siendo BORRADOR pendiente de firma del instructor (F2.3).
- ✅ **Seed idempotente**: `generate-seed-sql.mjs` ahora emite `on conflict (id) do update` — se puede re-ejecutar `002_seed_content.sql` en Supabase para refrescar el texto sin borrar progreso.
- ✅ **(1) Explicaciones de la derecha mejoradas** (relé/solenoide/correa/testigo/llave), seed idempotente.
- ✅ **(2) Re-ubicación anatómica** de las 12 piezas en el vano del motor (batería en su rincón, llave/testigo/relé en el firewall, alternador arriba, arranque+solenoide en la campana). `layout.json` + `engine-bay.svg` regenerados. commit `1121eb8`.
- ✅ **(3) Modo QA de lecciones**: `lib/qaMode.ts` (+4 tests) — `?qa=1` desbloquea todas las lecciones y muestra distintivo "Modo QA"; `?qa=0` lo apaga. Invisible para estudiantes. Para el guion de QA (doc 07 §6) antes del piloto.
- **Total: 201 tests verdes.**

- ↩️ **REVERTIDO el experimento visual de escena** (2026-07-13): el fondo del vano + carrocería + etiquetas + re-ubicación quedaron oscuros y confusos en la app real (el director: "no se entiende nada, feo"). Causa: no puedo capturar el canvas Konva en vivo en este entorno, así que iteré sobre un render propio que se ve más limpio que la app. Se revirtió la escena al estado del commit `1b4d15e` (arte isométrico real de las piezas + layout original, SIN fondo/carrocería/etiquetas). Se conservan las mejoras NO visuales: fichas más claras, fix del SQL y modo QA.
- ⚠️ **Lección aprendida**: no volver a tocar el look de la escena a ciegas. Cualquier cambio visual debe validarse con captura del director en la app real ANTES de seguir. El foco de "aprendizaje" del plan está en las LECCIONES + motor de simulación, no en el decorado de la escena.

### ⚠️ Pasos manuales tuyos pendientes (para reflejar todo en producción)
1. **Re-ejecutar el seed corregido**: Supabase → SQL Editor → pegar `backend/supabase/migrations/002_seed_content.sql` (ya con el fix del paréntesis + upsert) → Run. Refresca las fichas mejoradas sin borrar progreso. (Sin esto, la web sigue mostrando el texto viejo de la DB.)
2. **Ver el vano del motor y el arte nuevo**: se despliega solo con cada push a `main`; recargar https://zr-lab.vercel.app.
3. **Probar las 15 lecciones**: abrir https://zr-lab.vercel.app/?qa=1 → Explorar como invitado → Lecciones (todas desbloqueadas, distintivo "Modo QA").

## Sprint actual

F8 — Motor de fallas + catálogo (ver doc 05 F8 y doc 08 §5). Motor de fallas implementado y testeado; quedan F9-F11 del Modo Reto.

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

**2026-07-12 — F3.2 Arte isométrico REAL (reemplaza al placeholder):**
- [x] `frontend/scripts/generate-iso-art.mjs` — nuevo generador con un dibujo dedicado y reconocible por pieza (proyección iso 2:1, paleta ZR + acentos funcionales: bornes rojo/negro, bobinado de cobre, testigo de batería). Re-ejecutable.
- [x] Regenerados los 12 `iso-{id}.svg` en `public/assets/iso/` — ya NO son cajas: batería con 12V y bornes, trenza de masa trenzada, fusible, llave con llave insertada, relé, solenoide con bobinado, motor de arranque con piñón, correa con poleas, alternador con aletas/ventilador, testigo de carga del tablero
- [x] Verificado renderizando los SVG a PNG con `sharp` (lámina 4×3 + escena ensamblada según `layout.json`): las 12 piezas se leen como componentes automotrices reales y el circuito completo (positivo rojo / señal amarillo / masa gris) es reconocible
- ⏭ Pendiente para verlo en producción: `git add` + commit + push a `main` (Vercel redepliega solo). El generador `generate-placeholder-iso.mjs` queda obsoleto pero se conserva por historial.

Nota: sigue siendo arte vectorial 2.5D (decisión cerrada doc 00, sin GPU). El salto a "carro 3D funcional" tipo Electude sigue siendo la visión de **v4 condicional** — no se tocó esa decisión.

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

**2026-07-10 — F6 Cuentas y Cohortes (UI completa, backend pendiente):**
- [x] `lib/classCode.ts` — código de clase de 6 caracteres sin caracteres ambiguos (0/O, 1/I/L), generación + validación; 6 tests
- [x] `lib/activityStatus.ts` — semáforo de actividad del estudiante (🟢<3d, 🟡 3-7d, 🔴>7d, doc 09 Parte II §3); 4 tests
- [x] `stores/useSession.ts` — estado de sesión (userId/profile/loading/isGuest) + signUp/signIn/signOut/recoverPassword/continueAsGuest, todo cableado a `supabase.auth`
- [x] `services/cohortService.ts` — crear cohorte (con reintento por colisión de código), unirse por código, progreso de cohorte (respetando RLS)
- [x] Pantalla `/entrar` (`Auth`) — pestañas Ingresar/Crear cuenta, recuperación de contraseña, campo de código de clase opcional, "Explorar como invitado"; diseño glass
- [x] `GuestBanner` (RF-A3) — banner de modo invitado con CTA de registro, sin bloquear la exploración
- [x] `/instructor` (`InstructorPanel`) — crear cohorte, mostrar código con botón copiar, tabla de progreso ordenable con semáforo de actividad (RF-F1/F2)
- [x] Trigger `handle_new_user` agregado a `001_initial_schema.sql`: crea el perfil automáticamente al registrarse (patrón estándar de Supabase Auth)
- [x] 143 tests verdes, typecheck/lint/build limpios

**Verificación manual en el navegador (solo renderizado — auth en vivo requiere backend):**
- ✅ `/entrar` renderiza: pestañas Ingresar/Crear cuenta, "¿Olvidaste tu contraseña?", "Explorar como invitado"
- ✅ Pestaña "Crear cuenta" revela los 4 campos incluido el código de clase opcional
- ✅ "Explorar como invitado" navega a `/taller` y muestra el banner de invitado
- ✅ `/instructor` renderiza el panel (crear cohorte, tabla vacía), sin errores de consola

⚠️ **Auth real, código de clase y auditoría RLS NO verificados — requieren el backend en vivo.** El registro/login, la creación de cohortes y la tabla de progreso solo funcionarán de verdad cuando: (1) F0.2 — Supabase Auth email esté habilitado en el proyecto `ubolltmmahcwdywdyssp`, y (2) F2.4 — las migraciones `001` y `002` estén ejecutadas (incluido el trigger nuevo). El criterio de "hecho" de F6 (doc 05: test con 3 cuentas cruzadas + auditoría RLS) **no se puede cerrar sin esos dos pasos manuales tuyos.**

## ⏭ Siguiente paso exacto

**Bloque manual tuyo para desbloquear F6 de verdad y avanzar a F7:**
1. **F0.2** — En Supabase (`ubolltmmahcwdywdyssp`) → Authentication → habilitar el proveedor Email
2. **F2.4** — Supabase → SQL Editor → ejecutar `backend/supabase/migrations/001_initial_schema.sql` y luego `002_seed_content.sql`
3. **F0.3** — Vercel → conectar el repo `ZR-Lab`, configurar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, primer deploy
4. Después: crear 3 cuentas de prueba (2 estudiantes + 1 instructor) y confirmar los permisos cruzados (criterio de hecho F6). Reportar si algo falla.

**2026-07-10 — F7.1/F7.2 PWA y optimización (hechos y verificados):**
- [x] Code-splitting con `React.lazy` (F7.2): la escena Konva y las pantallas secundarias se cargan bajo demanda. Bundle inicial bajó de **204KB → 104KB gzip** (Konva quedó en un chunk aparte de 98KB gzip que solo carga al entrar a `/taller`). Muy por debajo del presupuesto RNF-2 (≤300KB gzip inicial)
- [x] PWA con `vite-plugin-pwa` (F7.1): `manifest.webmanifest` con colores e identidad ZR, service worker con Workbox (97 entradas precacheadas para el modo offline parcial RNF-9), `registerType: autoUpdate`
- [x] Iconos PWA branded generados desde el logo oficial (`scripts/generate-pwa-icons.mjs` con sharp): 192, 512, maskable 512, apple-touch-icon 180 — fondo navy ZR, logo blanco centrado
- [x] `apple-touch-icon` + metas de web-app en `index.html`
- [x] 143 tests verdes, typecheck/lint limpios

**Verificación manual real en el navegador (build servido con `vite preview`):**
- ✅ `manifest.webmanifest` se sirve con el nombre correcto y sus 3 iconos
- ✅ **El service worker se registra** (`navigator.serviceWorker.getRegistration()` → activo)
- ✅ La ruta lazy `/taller` carga su chunk y el canvas de la escena renderiza, sin errores de consola
- ✅ El icono PWA 512 se ve correcto (logo ZR Mecademy blanco sobre navy)

⚠️ **Falta de F7 (requiere deploy y/o trabajo tuyo):**
- **F7.2** — Lighthouse ≥85/90/90/90: requiere medir sobre el deploy de producción (Vercel). No ejecutado aquí
- **F7.3** — Pase de accesibilidad con axe-core (sin errores críticos): no ejecutado
- **F7.4** — QA formal (30 casos del doc 07 §6) en 3 dispositivos reales: es tuyo
- **F7.5** — Dominio final (`lab.zrmecademy.com`): es tuyo
- **F7.6** — **Piloto con 8-15 estudiantes reales** (2 semanas + encuesta): es el corazón de F7 y es tuyo
- **F7.7** — Informe del piloto

**2026-07-11 — Pulido final de v1 (sesión nocturna, pedido del director "mejora y culmina todo"):**
- [x] **RF-B4 vista por capas**: selector Todo/Arranque/Carga en el taller — atenúa (15% opacidad) las piezas fuera del subcircuito elegido. `scene/subsystems.ts` puro + 5 tests
- [x] **RF-C5 + accesibilidad (doc 04 §6)**: `PartsList` — buscador tolerante a acentos (`lib/searchPieces.ts`, 5 tests), filtro por capa, lista navegable como ruta alternativa a la escena para quien no puede usar el canvas
- [x] **RF-B3**: doble clic/tap en una pieza centra la cámara sobre ella
- [x] **Lámpara de carga visible en la escena**: testigo que se enciende/apaga leyendo `engine.isChargeLampOn()` — la escena sigue sin calcular nada, solo pinta lo que decide el motor
- [x] **F5.5 celebración de lección**: overlay glass ≤1.5s al completar una lección (doc 04 principio 5, "celebrar sin interrumpir"), se autodescarta sola. 2 tests de `useLessonStore` + 2 de render/temporización con fake timers
- [x] **Aviso de paisaje en móvil** (doc 04 §5.1 / doc 09 FAQ): sugerencia descartable, no bloqueante, en pantallas angostas en vertical
- [x] `tests/qa-resultados-v1.md` (plantilla de los 30 casos, doc 07 §6) y `.github/PULL_REQUEST_TEMPLATE.md` (doc 07 §3)
- [x] 157 tests Vitest verdes (+14 desde la última entrega), typecheck/lint/build limpios, bundle inicial se mantiene en 104KB gzip

**2026-07-13 — F8 Motor de Fallas + Catálogo (parcial — capa 2 completa):**
- [x] `engine/types.ts` — extendido con `FaultVoltageEffects`, `FaultDefinition` (doc 03 §3.1)
- [x] `engine/faultCatalog.ts` — 12 fallas del catálogo doc 08 §5, cada una con efectos de voltaje por escenario (reposo/on/crank/running), nivel de dificultad, síntoma y componente afectado
- [x] `CircuitEngine` mejorado: `applyFault` ahora aplica efectos de voltaje por escenario sobre la tabla base; `isChargeLampOn()` responde a fallas de carga (voltaje <13.5V en alternador → lámpara encendida)
- [x] 40 tests nuevos (`faultCatalog.test.ts`): catálogo completo (12 ids únicos, componentes válidos, helpers), cada falla testeada en su escenario relevante, `clearFaults` restaura estado
- [x] **201 tests totales**, typecheck/lint/build limpios (CircuitEngine chunk: 1.62KB gzip)
- ⏭ Pendiente F8: tablas `faults` + `cases` en Supabase (requiere backend en vivo, F2.4 primero)
- ⏭ Pendiente F8: UI de selección de falla en la escena (capa 4, requiere F8.1 del doc 05 como base)

**Sobre el pedido de "agregar todo el 3D y las modalidades" (Reto/Carrera):** revisé los documentos y **no lo implementé**, con la razón anotada en `docs/BACKLOG.md`:
- El 3D es **v4, condicional** (doc 05) — decisión cerrada en doc 00: v1 es 2.5D isométrico con Konva precisamente porque la PC de referencia (i3-2120) no tiene GPU y WebGL por software sería peor experiencia, no mejor. Reabrir esa decisión requiere tu aprobación explícita (doc 07 §5).
- El Modo Reto (v2) y Modo Carrera (v3) están **fuera de alcance de v1** por el propio doc 02 §4, y dependen de que F6/F7 cierren con backend real primero (doc 05).
- Construir esto "por fuera" del roadmap sin tu aprobación habría violado la regla de oro del proyecto (doc 00: "nadie improvisa fuera de estos documentos") y quemado tiempo en algo que quizás haya que rehacer. Quedó registrado como propuesta lista para retomar cuando lo apruebes.

**Verificado en el navegador esta sesión:** selector de capas filtra correctamente (Arranque excluye alternador/correa/lámpara, muestra las 9 piezas correctas), buscador de piezas con acentos, PartPanel se abre desde la lista, doble clic centra cámara (código revisado, lógica pura testeada). La celebración de 1.5s no se pudo cronometrar de forma fiable por la latencia de cada llamada al navegador (mismo problema que el arrastre de sondas) — se verificó con un test de componente con temporizadores simulados en su lugar.

## ⏭ Siguiente paso exacto

**Lo que la IA puede construir ahora (sin backend):**
- **F9** — Osciloscopio virtual: señal de rizado del alternador, señal del solenoide (doc 05 F9). Requiere extender el engine con `getSignalAt(node)` y crear `Oscilloscope.ts` en capa 3
- **F10** — Flujo de reto: orden de trabajo → diagnóstico → reemplazo con costo → checklist → puntaje (doc 05 F10)

**Lo que necesita tu acción manual (en orden):**
1. **F0.2** — Supabase → habilitar Auth email
2. **F2.4** — Supabase → SQL Editor → ejecutar `001_initial_schema.sql` y `002_seed_content.sql`
3. **F0.3** — Vercel → deploy con env vars
4. **F2.3** — Sesión con instructor: validar/firmar doc 08
5. **CI** — push del `.github/workflows/ci.yml` con token que tenga scope `workflow`
6. **F7.4-F7.7** — QA formal (30 casos), piloto 2 semanas

## 🚧 Bloqueadores

- **F6/F7 cierre real**: requiere backend en vivo (Supabase Auth + migraciones + Vercel deploy)
- **F8 UI**: requiere F6 cerrado (para guardar selección de falla en progreso del estudiante)
- **F9-F11 (Modo Reto completo)**: pueden avanzar en capa 2-3 sin backend; las tablas `faults`+`cases` y la UI requieren backend

## 📋 Backlog

Ver `docs/BACKLOG.md`.
