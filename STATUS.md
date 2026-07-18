# STATUS — ZR Lab

**Última actualización:** 2026-07-17
**Fase activa:** v2 MODO RETO — F8/F9/F10 code-complete (UI + engine). QA formal y piloto son tuyos
**Versión objetivo:** v2 Modo Reto (F8-F11)

## Dónde estamos ahora (2026-07-17)

- **237 tests verdes**, lint limpio, build OK (104KB gzip)
- **v1 Modo Academia (F0-F7):** code-complete — lecciones, progreso, dashboard, PWA
- **v2 Modo Reto (F8-F10):** code-complete — fallas, osciloscopio, retos con scoring
- **Escena:** sin fondo decorativo, solo gradient + SVG isométricos + cables (según docs)
- **Rutas nuevas:** `/osciloscopio` (F9), `/reto` (F10), botón "Fallas" en taller (F8)
- **F11 Leaderboard:** pendiente (requiere backend)

## Qué se construyó hoy (2026-07-17)

**F8 UI — FaultPanel:**
- `components/FaultPanel/FaultPanel.tsx` — panel lateral glass con las 12 fallas del catálogo
- Cada falla muestra: nombre, nivel (básico/intermedio/avanzado), descripción, síntoma
- Botón "Limpiar falla" para volver al estado normal
- `useSceneStore.activeFault` — estado global de la falla activa
- `getEngine()` aplica la falla activa automáticamente al engine

**F9 UI — OsciloscopioScreen:**
- `pages/OscilloscopeScreen.tsx` — pantalla completa `/osciloscopio`
- Selector de 11 nodos del circuito con labels legibles
- Forma de onda SVG real del engine (rectificada, rizado, pulsos)
- Mediciones: Vpp, Vdc, rizado (presente/ausente)
- Reacciona a escenario (ignition/running) y fallas activas

**F10 UI — ChallengeScreen:**
- `pages/ChallengeScreen.tsx` — pantalla completa `/reto`
- Selector de 12 casos por dificultad (1=4, 2=4, 3=4)
- Flujo: selección → orden de trabajo → diagnóstico → reparación → verificación → puntaje
- Medir: selector de punto + lectura real del engine + botones de los pasos esperados
- Reemplazar: piezas disponibles con costo en puntos
- Verificar: checklist post-reparación
- Scoring: eficiencia (50) + prolijidad (50) = nota A/B/C/D
- Feedback visual: ✓/✗ por acción, historial de acciones

**Integración:**
- `useSceneStore` extendido con `activeFault` + `setActiveFault`
- `App.tsx` rutas: `/osciloscopio`, `/reto`
- `Workshop.tsx` botones: Fallas, Osciloscopio, Reto en la barra superior

## Qué falta para el MVP completo

### Tuyo (acciones manuales):
1. **F0.2** — Supabase → habilitar Auth email en `ubolltmmahcwdywdyssp`
2. **F2.4** — Supabase → SQL Editor → ejecutar `001_initial_schema.sql` y `002_seed_content.sql`
3. **F0.3** — Vercel → deploy con env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
4. **F2.3** — Sesión con instructor: validar/firmar doc 08
5. **CI** — push del `.github/workflows/ci.yml` con token que tenga scope `workflow`
6. **F7.4** — QA formal (30 casos del doc 07 §6) en 3 dispositivos reales
7. **F7.6** — Piloto con 8-15 estudiantes reales (2 semanas)

### F11 Leaderboard (requiere backend):
- Tabla `leaderboard` en Supabase
- UI de ranking global y por cohorte
- Editor de casos para instructores (formulario, sin código)

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Home con logo |
| `/taller` | Escena isométrica + lecciones + fallas |
| `/osciloscopio` | Osciloscopio virtual (F9) |
| `/reto` | Modo Reto — 12 casos de diagnóstico (F10) |
| `/dashboard` | Progreso del estudiante |
| `/entrar` | Login/registro |
| `/instructor` | Panel de instructor |
| `/?qa=1` | Modo QA (desbloquea todo) |

## Resumen de features

| Feature | Capa 2 (engine) | Capa 3 (instruments) | Capa 4 (UI) | Estado |
|---------|-----------------|---------------------|-------------|--------|
| F0-F7 Modo Academia | ✅ | ✅ | ✅ | Completo |
| F8 Fallas | ✅ 12 fallas | — | ✅ FaultPanel | **Completo** |
| F9 Osciloscopio | ✅ getSignalAt | ✅ Oscilloscope.ts | ✅ OscilloscopeScreen | **Completo** |
| F10 Reto | ✅ 12 casos + scoring | — | ✅ ChallengeScreen | **Completo** |
| F11 Leaderboard | — | — | — | Pendiente (backend) |
