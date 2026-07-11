# 02 — Documento de Requerimientos (v1: Modo Academia)

**Proyecto:** ZR Lab | **Alcance:** Versión 1 — Modo Academia, sistema de arranque y carga
**Convención:** RF = Requisito Funcional, RNF = Requisito No Funcional. Prioridad: P0 (bloqueante), P1 (importante), P2 (deseable).

---

## 1. Requisitos Funcionales

### Módulo A — Acceso e Identidad

| ID | Requisito | Prioridad |
|---|---|---|
| RF-A1 | Registro de estudiante con email + contraseña vía Supabase Auth | P0 |
| RF-A2 | Ingreso mediante **código de clase** de 6 caracteres que vincula al estudiante con su cohorte | P0 |
| RF-A3 | Modo invitado (demo): acceso al Explorador de piezas sin registro, sin guardar progreso | P1 |
| RF-A4 | Roles: `estudiante`, `instructor`, `admin` con permisos diferenciados | P0 |
| RF-A5 | Recuperación de contraseña por email | P1 |
| RF-A6 | Perfil de estudiante: nombre, avatar (iniciales o selección de 8 avatares prediseñados), cohorte | P1 |

### Módulo B — Taller Virtual (escena 2.5D)

| ID | Requisito | Prioridad |
|---|---|---|
| RF-B1 | Escena isométrica 2.5D del compartimiento del motor con los 12 componentes del sistema de arranque y carga (ver doc 08) | P0 |
| RF-B2 | Cada componente es interactivo: hover lo ilumina con glow azul ZR, clic abre su Panel de Pieza | P0 |
| RF-B3 | Zoom (rueda/pinch) y paneo (arrastre) con límites suaves; doble clic/tap centra el componente | P0 |
| RF-B4 | Vista por capas: selector para atenuar visualmente capas (todo / solo circuito de arranque / solo circuito de carga) | P1 |
| RF-B5 | Los cables del circuito se resaltan animados (flujo de corriente) cuando la lección lo requiere | P1 |
| RF-B6 | Rendimiento: la escena mantiene ≥ 30 fps en hardware sin GPU (Canvas 2D, no WebGL obligatorio) | P0 |

### Módulo C — Explorador de Piezas

| ID | Requisito | Prioridad |
|---|---|---|
| RF-C1 | Panel de Pieza (glass card) con: nombre, foto/ilustración, función en ≤ 60 palabras, ubicación en el vehículo real | P0 |
| RF-C2 | Sección "Cómo se prueba": herramienta, puntos de medición, valores normales (ej. batería: 12.4-12.7V reposo) | P0 |
| RF-C3 | Sección "Cuando falla": síntomas típicos y causas comunes | P0 |
| RF-C4 | Estado de descubrimiento: pieza no vista (silueta), vista (color), dominada (borde dorado tras completar su lección) | P1 |
| RF-C5 | Buscador/lista de piezas con filtro por subsistema | P2 |

### Módulo D — Lecciones Interactivas

| ID | Requisito | Prioridad |
|---|---|---|
| RF-D1 | 12 micro-lecciones (una por componente) + 3 lecciones integradoras (ver doc 08), cada una de 3-5 min | P0 |
| RF-D2 | Estructura de lección: intro breve → misión interactiva en la escena → pregunta de verificación → resumen | P0 |
| RF-D3 | Misiones tipo: "haz clic en X", "conecta el multímetro entre A y B", "ordena los pasos del procedimiento", "selecciona el valor correcto" | P0 |
| RF-D4 | El multímetro virtual v1: sondas arrastrables, selector V/Ω, lectura simulada coherente con el estado del circuito | P0 |
| RF-D5 | Lecciones se desbloquean en secuencia; las integradoras requieren completar las de sus componentes | P1 |
| RF-D6 | Al completar lección: animación de logro + insignia + actualización de progreso | P1 |

### Módulo E — Progreso y Motivación

| ID | Requisito | Prioridad |
|---|---|---|
| RF-E1 | Dashboard personal: % de piezas descubiertas, % lecciones completadas, insignias, racha de días | P0 |
| RF-E2 | Insignias v1: una por componente dominado + 3 especiales (Primera Chispa, Circuito Completo, Técnico en Formación) | P1 |
| RF-E3 | Barra de progreso del sistema completo visible desde el taller | P1 |
| RF-E4 | Persistencia total: el estudiante retoma exactamente donde quedó | P0 |

### Módulo F — Panel de Instructor (mínimo viable en v1)

| ID | Requisito | Prioridad |
|---|---|---|
| RF-F1 | Crear cohorte y generar código de clase | P0 |
| RF-F2 | Lista de estudiantes de su cohorte con progreso (lecciones, piezas, última conexión) | P0 |
| RF-F3 | Exportar progreso de cohorte a CSV | P2 |

### Módulo G — Administración

| ID | Requisito | Prioridad |
|---|---|---|
| RF-G1 | Gestión de usuarios e instructores (alta/baja/rol) | P1 |
| RF-G2 | Métricas globales: usuarios activos, lecciones/día, dispositivos | P2 |

---

## 2. Requisitos No Funcionales

| ID | Categoría | Requisito | Medición |
|---|---|---|---|
| RNF-1 | Rendimiento | Primera carga ≤ 4s en conexión 3G rápida; navegación posterior ≤ 1s | Lighthouse ≥ 85 performance |
| RNF-2 | Peso | Bundle JS inicial ≤ 300KB gzip; escena del taller ≤ 800KB total de assets | Auditoría en build |
| RNF-3 | Compatibilidad | Chrome, Edge, Firefox, Safari (últimas 2 versiones); Android 9+; sin GPU dedicada | Prueba en PC del proyecto (i3-2120) |
| RNF-4 | Responsive | Usable de 360px (celular) a 1920px; en móvil la escena rota a paisaje con aviso sugerido | Prueba manual 3 tamaños |
| RNF-5 | Accesibilidad | Contraste AA en ambos temas; navegación por teclado en paneles; textos escalables | Verificación axe-core |
| RNF-6 | Disponibilidad | Hosting Vercel + Supabase free tier; sin servidor propio que mantener | — |
| RNF-7 | Seguridad | RLS (Row Level Security) en todas las tablas Supabase; un estudiante solo lee/escribe su progreso | Test de políticas |
| RNF-8 | Idioma | 100% español (es-419); textos centralizados en archivos de contenido, preparado para i18n futura | Revisión de strings |
| RNF-9 | Offline parcial | PWA: la app abre y muestra contenido ya visitado sin conexión (progreso se sincroniza al volver) | P2, prueba manual |
| RNF-10 | Temas | Dark y light completos desde v1; respeta `prefers-color-scheme` con toggle manual persistente | Revisión visual |

---

## 3. Historias de Usuario Clave (con criterios de aceptación)

### HU-01 — Primer ingreso del estudiante
**Como** estudiante nuevo, **quiero** entrar con mi código de clase y entender qué hacer en menos de 2 minutos, **para** empezar a aprender sin frustración.
- ✅ Con el código válido, quedo inscrito en mi cohorte automáticamente
- ✅ Al primer ingreso se lanza un tour interactivo de máximo 5 pasos (saltable)
- ✅ El tour termina con mi primera misión: "descubre tu primera pieza"
- ✅ Si el código es inválido, veo un mensaje claro con qué hacer

### HU-02 — Explorar una pieza
**Como** estudiante, **quiero** tocar el alternador y entender qué es, qué hace y cómo se prueba, **para** conocerlo antes de verlo en el taller real.
- ✅ Clic/tap en el alternador → Panel de Pieza en ≤ 300ms con animación glass
- ✅ El panel muestra las 4 secciones: qué es, qué hace, cómo se prueba, cuando falla
- ✅ La pieza queda marcada como "descubierta" en mi progreso
- ✅ Puedo cerrar con X, clic afuera, o tecla Escape

### HU-03 — Completar una lección con el multímetro
**Como** estudiante, **quiero** medir el voltaje de la batería siguiendo instrucciones, **para** aprender el procedimiento real.
- ✅ La lección me indica visualmente dónde van las sondas (zonas pulsantes)
- ✅ Al colocar las sondas correctamente, el multímetro muestra 12.6V y la lección avanza
- ✅ Si las coloco mal, el multímetro muestra lectura coherente (0V, negativo, etc.) y recibo una pista, nunca un regaño
- ✅ Al final respondo 1 pregunta y veo mi insignia si es la última misión de la pieza

### HU-04 — Instructor revisa su clase
**Como** instructor, **quiero** ver quién ha avanzado y quién está estancado, **para** reforzar en clase lo que haga falta.
- ✅ Veo tabla de mi cohorte: nombre, % lecciones, % piezas, última conexión
- ✅ Puedo ordenar por cualquier columna
- ✅ Identifico visualmente (color) a estudiantes sin actividad en 7+ días

---

## 4. Fuera de Alcance en v1 (explícitamente)

- ❌ Modo Reto con fallas y puntuación (v2)
- ❌ Osciloscopio y escáner OBD (v2)
- ❌ Leaderboard (v2)
- ❌ Editor de casos para instructores (v2)
- ❌ Modo Carrera, IA, certificados PDF (v3)
- ❌ 3D real / WebGL (fase posterior, si se valida)
- ❌ Apps nativas de tienda (la PWA cubre esto)
- ❌ Pagos o suscripciones

---

## 5. Dependencias y Supuestos

- Cuenta Supabase y Vercel activas (mismas organizaciones usadas en proyectos ZR previos)
- El contenido pedagógico (doc 08) lo valida un instructor técnico de ZR Mecademy **antes** de programar las lecciones
- Las ilustraciones isométricas se producen internamente (Figma/Inkscape/Illustrator) siguiendo el kit del doc 04
- El dominio/subdominio lo gestiona la dirección de ZR Mecademy
