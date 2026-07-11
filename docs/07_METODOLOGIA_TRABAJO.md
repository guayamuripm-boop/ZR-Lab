# 07 — Metodología de Trabajo

**Proyecto:** ZR Lab | **Modelo:** equipo pequeño (1-2 personas) + IA como constructor, con control de calidad humano

---

## 1. Roles

| Rol | Quién | Responsabilidades |
|---|---|---|
| **Director de producto** | Tú (dirección ZR Mecademy) | Decide alcance, aprueba fases, valida experiencia final. Única persona que puede reabrir decisiones cerradas (doc 00) |
| **Coordinador/Estratega** | Claude (sesiones de planificación) | Mantiene coherencia con docs 00-09, planifica sprints, redacta prompts de ejecución, audita avances |
| **Constructor** | Claude Code (sesiones de ejecución) | Implementa exactamente lo que indican los documentos y prompts del doc 06 |
| **Validador técnico** | Instructor de mecánica de ZR Mecademy | Aprueba fichas, lecciones, valores eléctricos y procedimientos (doc 08). Su firma es requisito de F2 |
| **Diseñador de assets** | Quien maneje Figma/Illustrator en el equipo | Produce el kit isométrico e iconografía según doc 04 |
| **QA / Piloto** | 1 persona del equipo + estudiantes piloto | Ejecuta guiones de prueba y reporta con la plantilla §6 |

**Regla de oro:** la IA construye, el humano verifica. Ningún entregable se considera "hecho" sin verificación humana documentada.

---

## 2. Ciclo de Trabajo (sprint semanal ligero)

```
LUNES (30 min) — Planificación
  · Leer STATUS.md y doc 05 (fase activa)
  · Elegir 1-3 entregables de la semana
  · Anotarlos en STATUS.md como "Sprint actual"

MAR-VIE — Sesiones de construcción
  · Cada sesión sigue el manual doc 06 (prompt → construcción → verificación)
  · Máximo 1 entregable por sesión: terminado y verificado > mucho a medias

VIERNES (20 min) — Cierre
  · Demo personal: usar lo construido como lo haría un estudiante
  · Actualizar STATUS.md (hecho / pendiente / bloqueado)
  · Commit etiquetado si se cerró fase
```

---

## 3. Flujo Git

- **Ramas:** `main` (protegida, siempre desplegable) ← `fase-N/descripcion-corta`
- **Commits:** en español, formato `tipo: descripción` — tipos: `feat`, `fix`, `content`, `design`, `docs`, `test`, `chore`
  - Ej.: `feat: sondas arrastrables con lectura del engine`
- **PR por fase o por entregable grande**, con la plantilla:
  ```
  ## Qué incluye
  ## Cómo verificarlo (pasos)
  ## Checklist
  - [ ] Lint + tests verdes
  - [ ] Verificación manual del doc 06 realizada
  - [ ] Sin strings hardcodeados en JSX
  - [ ] Probado en dark y light
  ```
- **Tags de hito:** `fase-0-completa`, `fase-1-completa`... `v1.0.0` al lanzar

---

## 4. Definición de Terminado (DoD) — para CUALQUIER entregable

1. ✅ Cumple el criterio de "hecho" de su fase (doc 05)
2. ✅ Lint, typecheck y tests pasan en CI
3. ✅ Verificación manual del doc 06 ejecutada por un humano
4. ✅ Funciona en dark y light
5. ✅ Funciona en móvil (360px) y desktop
6. ✅ Textos en español revisados (sin placeholder "lorem", sin strings en código)
7. ✅ STATUS.md actualizado

---

## 5. Gestión de Cambios y Backlog

- **Idea nueva en medio del sprint** → se anota en `docs/BACKLOG.md` con una línea; NO se ejecuta
- **Cambio a documento 00-09** → solo con aprobación del director; se registra fecha y motivo en el propio doc
- **Bug crítico** (bloquea aprendizaje o rompe datos) → interrumpe el sprint, se arregla ya
- **Bug menor** → al backlog con etiqueta `bug`

---

## 6. Guion de QA v1 (30 casos — plantilla)

Copiar a `tests/qa-resultados-v1.md` y llenar: ✅ pasa / ❌ falla (+nota) / ⏭ n/a. Ejecutar por dispositivo.

| # | Caso | Resultado |
|---|---|---|
| 1 | Registro con email nuevo funciona y redirige a onboarding | |
| 2 | Código de clase válido une a la cohorte correcta | |
| 3 | Código inválido muestra mensaje claro | |
| 4 | Login/logout/recuperación de contraseña | |
| 5 | Modo invitado permite explorar y muestra banner de registro | |
| 6 | Onboarding: 5 pasos, saltable, termina en primera misión | |
| 7 | Las 12 piezas responden a hover y clic | |
| 8 | PartPanel muestra las 4 secciones con datos correctos | |
| 9 | PartPanel cierra con X, clic fuera y Escape | |
| 10 | Zoom con rueda y pinch respeta límites | |
| 11 | Paneo con inercia, sin perderse fuera de la escena | |
| 12 | Llave off/on/crank cambia el estado del circuito | |
| 13 | Multímetro: batería reposo 12.4-12.7V | |
| 14 | Multímetro: caída en crank ≈ 10.5V | |
| 15 | Multímetro: motor encendido 13.8-14.4V | |
| 16 | Sondas invertidas → lectura negativa + pista | |
| 17 | Lección 1 completa de inicio a fin sin ayuda externa | |
| 18 | Pista (💡) muestra ayuda contextual del paso | |
| 19 | Quiz: respuesta incorrecta explica sin castigar | |
| 20 | Insignia se otorga con animación al dominar pieza | |
| 21 | Progreso persiste tras cerrar sesión y volver | |
| 22 | Dashboard refleja % reales de piezas y lecciones | |
| 23 | "Continuar donde quedé" lleva a la lección correcta | |
| 24 | Tema dark/light conmuta y persiste | |
| 25 | Instructor crea cohorte y genera código | |
| 26 | Tabla de instructor muestra progreso real de su cohorte | |
| 27 | Estudiante A no puede ver datos de estudiante B (RLS) | |
| 28 | PWA instalable y abre con splash ZR | |
| 29 | Escena fluida en el dispositivo más lento disponible | |
| 30 | Lighthouse ≥ 85/90/90/90 en producción | |

---

## 7. Comunicación y Registro

- **STATUS.md** = memoria operativa del proyecto (fase, sprint, bloqueos, siguiente paso). Se actualiza CADA sesión
- **Decisiones** = doc 00 (tabla de decisiones cerradas)
- **Ideas futuras** = docs/BACKLOG.md
- **Resultados de pruebas** = tests/qa-resultados-*.md
- Sesiones con IA: iniciar siempre con contexto (*"Lee STATUS.md y docs/00"*) para continuidad perfecta entre sesiones
