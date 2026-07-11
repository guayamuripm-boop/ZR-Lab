# 06 — Manual de Ejecución Paso a Paso (enfoque Low-Code)

**Proyecto:** ZR Lab | **Para quién:** el equipo ZR Mecademy (no requiere ser programador experto)
**Filosofía:** tú diriges y verificas; la IA (Claude Code) construye siguiendo los documentos 01-05. Cada fase incluye: acciones manuales exactas + el prompt listo para copiar y pegar a la IA + cómo verificar el resultado.

> ⚠️ **Regla de uso de la IA:** cada prompt de este manual empieza ordenándole leer los documentos del proyecto. Nunca dejes que la IA "invente" fuera de ellos. Si propone algo no documentado, la respuesta es: *"Documéntalo como propuesta en STATUS.md y espera aprobación."*

---

## FASE 0 — Preparación e Infraestructura

### Paso 0.1 — Crear el repositorio GitHub (manual, 5 min)
1. Entra a https://github.com/new
2. Nombre: `zr-lab` · Visibilidad: **Private** · ✅ Add README
3. Crea el repo. En Settings → Branches → Add rule: proteger `main` (require PR)

### Paso 0.2 — Crear proyecto Supabase (manual, 10 min)
1. Entra a https://supabase.com/dashboard → **New project**
2. Organización: la misma de tus proyectos ZR previos · Nombre: `zr-lab`
3. Database password: genera una fuerte y **guárdala en tu gestor de contraseñas**
4. Región: la más cercana a tus estudiantes
5. Cuando cargue, ve a Settings → API y copia: `Project URL` y `anon public key` (las usarás en 0.4)

### Paso 0.3 — Crear proyecto Vercel (manual, 5 min)
1. https://vercel.com/new → Import Git Repository → selecciona `zr-lab`
2. Framework preset: Vite (lo detectará cuando exista el código; si no, déjalo pendiente y repite tras el paso 0.4)
3. En Settings → Environment Variables agrega: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores del paso 0.2

### Paso 0.4 — Scaffold del frontend (con IA, 1 sesión)
Abre Claude Code en `C:\Dev\ZRLab` y pega:

```text
Lee docs/00_INDICE_MAESTRO.md, docs/03_ARQUITECTURA_TECNICA.md (sección 5)
y docs/04_SISTEMA_DISENO_UI_UX.md (sección 2).
Crea el scaffold del frontend en frontend/: Vite + React 18 + TypeScript strict
+ Tailwind + react-konva + zustand + framer-motion + @fontsource/roboto
+ @fontsource/raleway, con la estructura de carpetas exacta del doc 03 §5.
Implementa styles/tokens.css con los temas dark y light del doc 04 §2,
el componente ThemeToggle persistente, y una página Home que muestre el logo
(frontend/public/assets/brand/) sobre el fondo gradient del tema.
Configura ESLint + Prettier + Vitest. Verifica que npm run dev, build,
lint y test pasen. No agregues nada fuera de esto.
```

**Verificación:** `npm run dev` → ves la página con logo ZR, el toggle cambia dark/light y recuerda tu elección al recargar.

### Paso 0.5 — CI en GitHub (con IA, 15 min)
```text
Crea .github/workflows/ci.yml que en cada push y PR ejecute:
npm ci, lint, typecheck (tsc --noEmit) y test, sobre frontend/.
Node 20. Nada más.
```
**Verificación:** sube un commit y en la pestaña Actions del repo el workflow queda verde.

### Paso 0.6 — Primer deploy (manual, 5 min)
1. `git push` a `main` → Vercel construye automáticamente
2. Abre la URL `*.vercel.app` desde tu celular y verifica logo + temas

✅ **Fase 0 hecha** cuando se cumple el criterio del doc 05 F0.

---

## FASE 1 — Motor de Simulación + Multímetro

### Paso 1.1 — Definir el circuito (con IA, 1 sesión)
```text
Lee docs/03_ARQUITECTURA_TECNICA.md (sección 3) y docs/08_CONTENIDO_PEDAGOGICO.md
(secciones 2 y 4). Implementa en frontend/src/engine/:
types.ts con los contratos exactos del doc 03 §3.1, y la definición del circuito
de arranque y carga (12 componentes, nodos y conexiones) según el diagrama del
doc 08 §2. Solo datos y tipos, sin lógica todavía.
```

### Paso 1.2 — Implementar CircuitEngine (con IA, 1-2 sesiones)
```text
Implementa CircuitEngine según doc 03 §3.2-3.3: estrategia de escenarios
discretos (reposo / on / crank / running) con los voltajes de la tabla del
doc 08 §4. Incluye getVoltageBetween y getResistanceBetween con lecturas
de error realistas (sondas invertidas → valor negativo, circuito abierto → OL).
Escribe al menos 25 tests Vitest cubriendo la tabla completa del doc 08 §4.
TypeScript puro: prohibido importar React, Konva o Supabase en engine/.
```
**Verificación:** `npm test` verde; abre los tests y comprueba que los valores esperados coinciden con la tabla del doc 08 §4 (tu instructor técnico puede leerlos: son legibles).

### Paso 1.3 — Multímetro + página de pruebas (con IA, 1 sesión)
```text
Implementa instruments/Multimeter.ts según el contrato del doc 03 §3.4,
y una página /dev/engine (sin diseño, solo funcional) con: selector de
escenario, dos dropdowns de nodos, selector V/Ω y la lectura resultante.
Es una herramienta interna de verificación.
```
**Verificación manual (tú):** en `/dev/engine` prueba: batería en reposo = 12.6V · en crank ≈ 10.5V · motor encendido = 14.1V · resistencia de fusible sano ≈ 0Ω. Si algo no cuadra con lo que un técnico espera, se corrige AHORA (es barato aquí, caro después).

---

## FASE 2 — Contenido Pedagógico (trabajo tuyo + instructor, la IA asiste)

### Paso 2.1 — Completar fichas y lecciones (2-3 sesiones de contenido)
1. Abre `docs/08_CONTENIDO_PEDAGOGICO.md` — ya contiene la estructura y varios ejemplos completos
2. Sesión con el instructor técnico: completar/corregir las 12 fichas y validar valores
3. Pídele a la IA convertir el contenido aprobado:
```text
Lee docs/08_CONTENIDO_PEDAGOGICO.md. Genera frontend/src/content/
components.json y lessons.json siguiendo los esquemas del doc 03 §4.
Valida que cada lección tenga entre 4 y 8 pasos y cada ficha las 4 secciones.
```

### Paso 2.2 — Crear tablas en Supabase (con IA, 1 sesión)
```text
Lee docs/03_ARQUITECTURA_TECNICA.md sección 4 completa. Genera el archivo
backend/supabase/migrations/001_initial_schema.sql con todas las tablas,
constraints y políticas RLS descritas. Genera también
002_seed_content.sql con el contenido de components.json y lessons.json.
```
Luego tú (manual, 10 min): Supabase Dashboard → SQL Editor → pega y ejecuta `001` y luego `002` → verifica en Table Editor que `components` tiene 12 filas y `lessons` 15.

---

## FASE 3 — Kit Visual (diseño en Figma + componentes glass)

### Paso 3.1 — Ilustraciones isométricas (manual en Figma, la parte más artesanal)
1. Crea archivo Figma "ZR Lab — Kit Isométrico" con grilla 2:1 (plantilla: shape → skew según guía del doc 04 §3)
2. Dibuja las 12 piezas en orden de dificultad: fusible → borne → relé → batería → llave → lámpara → correa → solenoide → motor de arranque → alternador → cables → bloque motor
3. Estilo: 3 valores por cara con la paleta del doc 04 §3 — simple y consistente vale más que detallado e irregular
4. Exporta cada una como SVG (`iso-battery.svg`, etc.) a `frontend/public/assets/iso/`
5. **Atajo válido si el dibujo se atasca:** compra/adapta un pack isométrico de mecánica (Freepik/Flaticon, verificando licencia) y recolóralo a la paleta ZR

### Paso 3.2 — Componentes glass (con IA, 1-2 sesiones)
```text
Lee docs/04_SISTEMA_DISENO_UI_UX.md completo. Implementa en
frontend/src/components/ui/: GlassPanel (3 elevaciones), GlassButton
(3 variantes), Toast, ProgressRing, BadgeCard y la página /dev/ui que
los muestre todos en ambos temas con datos de ejemplo. Respeta tokens,
curva de movimiento única y fallback de backdrop-filter.
```
**Verificación:** `/dev/ui` en dark y light — captura pantalla y compárala contra el doc 04. Contraste legible en todo.

---

## FASE 4 — Escena del Taller

### Paso 4.1 — Escena base (con IA, 2-3 sesiones)
```text
Lee docs/03 (§5, §7) y docs/04 (§3, §5.1). Implementa scene/WorkshopStage:
carga los SVG de public/assets/iso/ como imágenes Konva posicionadas según
un layout.json editable, zoom con rueda/pinch (límites 0.5x-2.5x) y paneo
con inercia. Cada pieza: hover glow, clic emite onComponentClick(id).
60fps objetivo; si el dispositivo es lento, degradar sombras primero.
```

### Paso 4.2 — Panel de pieza conectado (con IA, 1 sesión)
```text
Implementa PartPanel según doc 04 §4 y §5.1: 4 tabs con datos desde
contentService (Supabase con fallback a content/*.json). Desktop: panel
lateral 380px; móvil: bottom-sheet. Al abrir, registra discovery del
estudiante vía progressService.
```

### Paso 4.3 — Llave + multímetro en escena (con IA, 1-2 sesiones)
```text
Integra la llave de encendido (toggle off/on/crank) conectada a
CircuitEngine.setIgnition, y las sondas arrastrables (ProbeLayer):
al soltar una sonda sobre un punto de medición válido (zonas definidas
en layout.json), MultimeterHUD muestra la lectura real del engine con
animación count-up. Cables con animación de flujo cuando circula corriente.
```
**Verificación (demo de fase, hazla tú):** gira la llave a crank y mide la batería → debe caer a ~10.5V con el motor de arranque sonando (audio opcional v1). Esa demo ES el producto enseñando de verdad.

---

## FASE 5 — Lecciones y Progreso

### Paso 5.1 — LessonPlayer (con IA, 2 sesiones)
```text
Lee docs/03 §4.2 (esquema de pasos) y docs/02 (RF-D). Implementa
LessonPlayer: intérprete de los 7 tipos de paso, barra inferior glass,
botón de pista, validación por eventos de la escena (doc 03 §7).
Carga lessons desde contentService. Al completar: persistencia +
celebración según doc 04.
```

### Paso 5.2 — Dashboard + onboarding (con IA, 1-2 sesiones)
```text
Implementa el Dashboard del estudiante (doc 04 §5.2) y el OnboardingTour
de 5 pasos (doc 02 HU-01). "Continuar donde quedé" lleva a la siguiente
lección incompleta.
```
**Verificación:** crea una cuenta nueva de prueba y completa las lecciones 1-3 sin tocar nada más que lo que la app te indica. Anota cualquier momento de confusión: cada uno es un bug de UX que se arregla antes de seguir.

---

## FASE 6 — Cuentas y Cohortes

```text
Lee docs/02 (módulos A y F) y docs/03 §4. Implementa: pantallas de
registro/login/recuperación con diseño glass, flujo de código de clase,
modo invitado (solo explorador + banner), y el panel de instructor
(crear cohorte, código de 6 caracteres, tabla de progreso ordenable
con colores de actividad). Audita RLS con tests: un estudiante no puede
leer progreso ajeno.
```
**Verificación manual:** 3 cuentas (2 estudiantes + 1 instructor) en ventanas separadas; confirma los permisos cruzados.

---

## FASE 7 — PWA, QA y Piloto

### Paso 7.1 — PWA + rendimiento (con IA)
```text
Configura vite-plugin-pwa: instalable, iconos desde brand/icon.ico
(genera tamaños), splash con logo. Optimiza: code-splitting por página,
SVGO en assets, lazy de la escena. Objetivo Lighthouse ≥85/90/90/90.
Ejecuta el análisis y reporta números reales.
```

### Paso 7.2 — QA formal (tú + 1 persona, con el guion del doc 07 §6)
- Ejecutar los 30 casos en: PC del proyecto, un Android medio y un celular gama baja
- Registrar resultados en `tests/qa-resultados-v1.md` (plantilla en doc 07)

### Paso 7.3 — Piloto real (2 semanas)
1. Instructor crea cohorte "Piloto ZR Lab" y reparte el código a 8-15 estudiantes
2. Semana 1: uso libre con misión mínima (3 lecciones). Semana 2: uso guiado en clase
3. Encuesta final de 5 preguntas (plantilla en doc 09 §7)
4. Con IA: `Lee activity_log y genera informe del piloto: uso, fricciones, abandono por lección` 
5. Reunión de cierre: decidir ajustes y aprobar lanzamiento v1

---

## Cadencia de Trabajo Recomendada (mientras dure la construcción)

| Momento | Acción |
|---|---|
| Inicio de sesión de trabajo | Leer STATUS.md → abrir la fase en este manual → copiar el prompt correspondiente |
| Durante | Verificar cada entregable con los pasos de "Verificación" antes de continuar |
| Fin de sesión | Pedir a la IA: *"Actualiza STATUS.md con lo completado hoy, la fase activa y el siguiente paso exacto"* |
| Fin de fase | Marcar ✅ en doc 05, commit etiquetado `fase-N-completa` |

## Errores Comunes y Cómo Evitarlos

1. **Saltarse la verificación manual** → los bugs se acumulan en silencio. Cada "Verificación" de este manual es obligatoria.
2. **Pedirle a la IA cosas fuera de fase** ("ya que estamos, agrega el leaderboard...") → NO. Va al backlog del doc 05.
3. **Aceptar valores eléctricos sin validar con el instructor** → el prestigio técnico de la academia está en juego; doc 08 manda.
4. **Dejar el contenido para el final** → F2 va en paralelo con F1 precisamente para que nunca bloquee.
5. **No probar en el hardware real de los estudiantes** → la PC más vieja disponible es tu banco de pruebas oficial.
