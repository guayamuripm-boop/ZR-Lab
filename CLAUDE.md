# CLAUDE.md — Instrucciones para Claude Code en ZR Lab

**Proyecto:** ZR Lab — taller virtual de **ZR Mecademy** (academia de mecánica automotriz).
Tu rol aquí es **constructor disciplinado**: implementas exactamente lo que definen los documentos del proyecto. No improvisas alcance.

## Protocolo de cada sesión

1. Lee `STATUS.md` (fase activa, sprint, siguiente paso)
2. Lee `docs/00_INDICE_MAESTRO.md` (decisiones cerradas y mapa de docs)
3. Trabaja SOLO en la fase activa siguiendo `docs/06_MANUAL_EJECUCION_LOWCODE.md`
4. Al cerrar la sesión: actualiza `STATUS.md` (hecho / bloqueos / siguiente paso exacto)

## Reglas duras (no negociables)

- **Nada fuera de los docs 00-09.** Si detectas algo necesario no documentado: anótalo como propuesta en `docs/BACKLOG.md` y pide aprobación; no lo implementes.
- **Capas 2 y 3 (engine/, instruments/) son TypeScript puro** — prohibido importar React/Konva/Supabase ahí (doc 03 §1).
- **La escena nunca calcula valores eléctricos** — solo consulta el `CircuitEngine`.
- **Cero strings visibles hardcodeados en JSX** — todo texto sale de `content/` o de la DB.
- **Valores eléctricos:** la fuente de verdad es la tabla del doc 08 §4. Nunca los inventes.
- **RLS activo en toda tabla Supabase**, sin excepciones (doc 03 §4.3).
- **Todo se entrega en dark Y light**, responsive 360px-1920px, y debe correr fluido sin GPU (PC de referencia: i3-2120, 8GB).
- **Prohibido copiar assets, textos o código de Electude.**
- Idioma del producto y los commits: **español**. Formato de commit: `tipo: descripción` (doc 07 §3).

## Identidad visual (resumen operativo)

- Paleta oficial: `#21284F` `#1E4D96` `#3869B1` `#6590CB` `#98BAE3` `#FFFFFF` — tokens completos en doc 04 §2 y `styles/tokens.css`
- Tipografías: Roboto (UI), Raleway (display), Roboto Mono (lecturas)
- Estética: glass liquid (receta exacta en doc 04 §2.4), curva de movimiento única `cubic-bezier(0.32, 0.72, 0.24, 1)`
- Logos y patrón: `frontend/public/assets/brand/`

## Stack

React 18 + TypeScript strict + Vite · Konva.js/react-konva (escena 2.5D isométrica) · Tailwind + CSS variables · Zustand · Framer Motion · Supabase (Auth/PostgreSQL/Storage) · Vercel + PWA · Vitest + Playwright.

## Definición de Terminado (resumen del doc 07 §4)

Lint + typecheck + tests verdes · verificación manual del doc 06 hecha · dark y light · móvil y desktop · textos en español sin placeholders · STATUS.md actualizado.

## Memoria persistente relacionada

`project_zr_lab.md` (estado del proyecto) y `zr_mecademy_brand.md` (identidad de marca) en la memoria de Claude.
