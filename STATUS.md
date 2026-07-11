# STATUS — ZR Lab

**Última actualización:** 2026-07-10
**Fase activa:** F3 · Kit Visual (componentes glass completos — arte isométrico final pendiente de Figma)
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

## ⏭ Siguiente paso exacto

**Siguiente fase que la IA puede seguir avanzando sin bloqueo:** Fase 4 — Escena del taller (`WorkshopStage` con Konva, `layout.json`, zoom/pan, llave de encendido, sondas del multímetro, `PartPanel`). Usa el kit placeholder de F3 hasta que llegue el arte final.

## 🚧 Bloqueadores

Ninguno técnico. Ver "Pasos manuales pendientes" arriba — todos requieren tu cuenta/firma, no la ejecución de código.

## 📋 Backlog

Ver `docs/BACKLOG.md`.
