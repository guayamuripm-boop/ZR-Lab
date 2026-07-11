# ZR Lab — Índice Maestro de Documentación

**Proyecto:** ZR Lab — Simulador de Diagnóstico Automotriz de ZR Mecademy
**Rol de este documento:** Punto de entrada. Todo colaborador (humano o IA) empieza aquí.
**Última actualización:** 2026-07-10

---

## ⚡ Regla de Oro del Proyecto

> **Nadie improvisa fuera de estos documentos.** Si algo no está definido aquí, se propone, se discute, se documenta, y LUEGO se ejecuta. La libertad creativa vive DENTRO del marco, no fuera de él.

---

## 📚 Mapa de Documentos

| # | Documento | Qué define | Cuándo leerlo |
|---|-----------|-----------|---------------|
| 00 | **Índice Maestro** (este) | Navegación y reglas de uso | Siempre primero |
| 01 | [Visión y Estrategia](01_VISION_Y_ESTRATEGIA.md) | Qué es ZR Lab, por qué existe, diferenciales, decisiones cerradas | Antes de proponer cualquier cosa |
| 02 | [Requerimientos](02_REQUERIMIENTOS.md) | Requisitos funcionales/no funcionales, historias de usuario, criterios de aceptación | Antes de construir cualquier módulo |
| 03 | [Arquitectura Técnica](03_ARQUITECTURA_TECNICA.md) | Capas, stack, modelo de datos, motor de simulación, contratos | Antes de escribir código |
| 04 | [Sistema de Diseño UI/UX](04_SISTEMA_DISENO_UI_UX.md) | Glass liquid dark/light, tokens de marca, componentes, accesibilidad | Antes de diseñar cualquier pantalla |
| 05 | [Roadmap Detallado](05_ROADMAP_DETALLADO.md) | Fases, hitos, entregables, criterios de "hecho" | Para planificar cada sprint |
| 06 | [Manual de Ejecución Low-Code](06_MANUAL_EJECUCION_LOWCODE.md) | Acciones paso a paso, comandos exactos, prompts para IA | Durante la construcción, cada día |
| 07 | [Metodología de Trabajo](07_METODOLOGIA_TRABAJO.md) | Sprints, roles, flujo git, QA, definición de terminado | Al organizar el equipo |
| 08 | [Contenido Pedagógico](08_CONTENIDO_PEDAGOGICO.md) | Sistema de arranque y carga: componentes, lecciones, fallas, niveles | Al cargar contenido educativo |
| 09 | [Manual de Usuario](09_MANUAL_DE_USUARIO.md) | Cómo usan el sistema estudiantes, instructores y administradores | Al lanzar el piloto |

---

## 🔒 Decisiones Cerradas (No se reabren sin aprobación del director)

| Decisión | Valor | Fecha |
|---|---|---|
| Nombre del producto | **ZR Lab** | 2026-07-10 |
| Estrategia visual v1 | **2.5D isométrico vectorial** (migrable a 3D en fase posterior) | 2026-07-10 |
| Primer sistema simulado | **Arranque y carga** (batería, motor de arranque, alternador, relés, fusibles) | 2026-07-10 |
| Modo de lanzamiento v1 | **Modo Academia (guiado)** — el Modo Reto es v2, Carrera + IA es v3 | 2026-07-10 |
| Stack | React + Vite + Konva.js / Supabase / Vercel | 2026-07-10 |
| Estética | Glass liquid (dark + light), paleta ZR Mecademy | 2026-07-10 |
| Presupuesto herramientas | $0 en fase inicial (free tiers) | 2026-07-10 |
| Prohibido | Copiar assets/código/textos de Electude | Permanente |

---

## 🎨 Identidad de Marca (Fuente de Verdad)

**Origen:** `C:\Proyectos\Marcas\ZR Mecademy\IdentidadZRMecademy2025\`
**Copiados al proyecto:** `frontend/public/assets/brand/`

| Token | Valor | Uso |
|---|---|---|
| `--zr-navy` | `#21284F` | Fondos dark, texto sobre claro |
| `--zr-blue` | `#1E4D96` | Color principal de marca, CTAs |
| `--zr-blue-mid` | `#3869B1` | Acentos, hovers |
| `--zr-blue-soft` | `#6590CB` | Elementos secundarios |
| `--zr-sky` | `#98BAE3` | Fondos light, bordes glass |
| `--zr-white` | `#FFFFFF` | Texto sobre oscuro, superficies |

**Tipografías:** Roboto (principal/UI), Raleway (secundaria/títulos display)
**Logos disponibles:** `Azul.svg`, `bLANCO COMPLETO.svg`, `Color 1.svg`, `oSCURO.svg`, `icon.ico`
**Patrón de marca:** `patron-marca.png` (líneas interconectadas — usar como textura sutil en fondos glass, opacidad 3-6%)

---

## 🧭 Cómo usar esta documentación en cada sesión de trabajo

1. Abrir `STATUS.md` (raíz del proyecto) → ver en qué fase/tarea estamos
2. Abrir `05_ROADMAP_DETALLADO.md` → ubicar la fase activa y su criterio de "hecho"
3. Abrir `06_MANUAL_EJECUCION_LOWCODE.md` → seguir los pasos exactos de esa fase
4. Al terminar la jornada → actualizar `STATUS.md` con lo completado y lo siguiente
5. Cualquier duda de diseño → `04_SISTEMA_DISENO_UI_UX.md`. Cualquier duda técnica → `03_ARQUITECTURA_TECNICA.md`

## 📎 Referencias externas

- `assets/references/Auditoria_Electude_Simulator_Ethermic.pdf` — análisis funcional del competidor
- `assets/references/Roadmap_Plan_Accion_LowCost.pdf` — plan low-cost original
- https://simulator.electude.com/simulator — simulador de referencia (solo inspiración funcional, nunca copiar)
