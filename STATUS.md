# STATUS — ZR Lab

**Última actualización:** 2026-07-10
**Fase activa:** F1 · Motor de Simulación + Multímetro (completa — ver criterio de hecho)
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

## ⏭ Siguiente paso exacto

**Fase 2 (paralela) — Contenido Pedagógico:** convertir doc 08 en `content/components.json` y `content/lessons.json`, y preparar `backend/supabase/migrations/001_initial_schema.sql` + `002_seed_content.sql` (doc 06 Pasos 2.1-2.2). ⚠️ La ejecución real de esas migraciones en Supabase (SQL Editor) y la validación de valores por el instructor técnico son manuales — la IA prepara los archivos, tú los ejecutas.

**Pasos manuales aún pendientes:**
1. **F0.2 verificación** — confirmar que el proyecto Supabase `ubolltmmahcwdywdyssp` tiene Auth email habilitado (doc 06 Paso 0.2)
2. **F0.3** — Crear/confirmar proyecto Vercel conectado al repo `ZR-Lab`, configurar env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (doc 06 Paso 0.3)
3. **CI workflow** — el commit `ci: agrega workflow...` quedó local (el PAT guardado no tiene scope `workflow`); push manual o regenerar el token con ese scope
4. **F2.3** — sesión con el instructor técnico para validar/firmar el doc 08 antes de cargar contenido en Supabase (checklist §7)

⚠️ **Antes de programar lecciones (F2):** agendar sesión con el instructor técnico para validar el doc 08 (checklist §7).

## 🚧 Bloqueadores

Ninguno técnico. Ver "Pasos manuales aún pendientes" arriba.

## 📋 Backlog

Ver `docs/BACKLOG.md`.
