# STATUS — ZR Lab

**Última actualización:** 2026-07-10
**Fase activa:** F0 · Preparación e Infraestructura (≈60% — scaffold listo, faltan pasos manuales)
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

## ⏭ Siguiente paso exacto

**Pasos manuales pendientes (requieren tu cuenta, no los ejecuta la IA):**
1. **F0.1** — Crear repositorio GitHub privado `zr-lab`, subir este código, proteger `main` (doc 06 Paso 0.1)
2. **F0.2** — Crear proyecto Supabase `zr-lab`, guardar credenciales (doc 06 Paso 0.2)
3. **F0.3** — Crear proyecto Vercel conectado al repo, configurar env vars (doc 06 Paso 0.3)
4. **F0.6** — Primer `git push` a `main` y verificar deploy en `*.vercel.app` desde el celular

Cuando el repo y el deploy existan, continuar con **Fase 1 — Motor de Simulación + Multímetro** (doc 06, Paso 1.1: `engine/types.ts` y definición del circuito de arranque y carga).

⚠️ **Antes de programar lecciones (F2):** agendar sesión con el instructor técnico para validar el doc 08 (checklist §7).

## 🚧 Bloqueadores

Ninguno técnico. F0.1-0.3 y 0.6 requieren acción manual tuya en GitHub/Supabase/Vercel (creación de cuentas y push — fuera del alcance de lo que la IA puede ejecutar).

## 📋 Backlog

Ver `docs/BACKLOG.md`.
