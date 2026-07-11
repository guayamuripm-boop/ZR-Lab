# 01 — Visión y Estrategia de Producto

**Proyecto:** ZR Lab | **Propietario:** ZR Mecademy | **Estado:** Aprobado 2026-07-10

---

## 1. Declaración de Visión

> **ZR Lab es el taller virtual de ZR Mecademy**: una plataforma web donde cualquier estudiante, desde su navegador y sin instalar nada, aprende las piezas del vehículo, entiende cómo funcionan, y se enfrenta a fallas reales que debe diagnosticar como lo haría en un taller — con herramientas profesionales virtuales, procedimientos correctos y una experiencia visual exquisita que refleja la marca.

**En una frase:** *Electude nos inspiró; ZR Lab lo supera en pedagogía, experiencia y accesibilidad para nuestra comunidad hispanohablante.*

---

## 2. El Problema que Resolvemos

1. **Práctica limitada:** los estudiantes de mecánica solo tocan vehículos reales en horas de taller. Fuera de clase, no hay forma de practicar diagnóstico.
2. **Riesgo y costo:** equivocarse en un vehículo real cuesta piezas, tiempo y seguridad. En un simulador, equivocarse es aprendizaje gratuito.
3. **Desconexión teoría-práctica:** los estudiantes memorizan "síntoma = pieza" sin entender el sistema. ZR Lab enseña causa y efecto real.
4. **Herramientas extranjeras y caras:** Electude es de pago, en licencias por escuela, y su versión gratuita es limitada. ZR Lab es nuestro, en español, alineado a nuestro pénsum.

---

## 3. A Quién Servimos (Personas)

### Persona 1 — "Kevin, el estudiante" (usuario principal)
- 17-30 años, estudia mecánica automotriz en ZR Mecademy
- Usa más el celular que la computadora; internet a veces limitado
- Motivado por logros visibles, competencia sana y sentirse "técnico de verdad"
- **Necesita:** aprender piezas y procedimientos a su ritmo, practicar sin miedo, ver su progreso

### Persona 2 — "Prof. Ramón, el instructor"
- Técnico experimentado, no programador
- **Necesita:** asignar ejercicios, crear casos nuevos sin código, ver qué estudiantes dominan qué temas

### Persona 3 — "Dirección ZR Mecademy" (administrador)
- **Necesita:** métricas de uso, evidencia de aprendizaje para certificaciones, herramienta de marketing que diferencie la academia

---

## 4. Pilares del Producto (los 4 "no negociables")

| Pilar | Significado práctico |
|---|---|
| **1. Fácil de usar y entender** | Un estudiante de primer día navega sin manual. Onboarding interactivo de 2 minutos. Cero jerga técnica de software. Todo en español. |
| **2. Reto real pero alcanzable** | Curva de dificultad tipo videojuego: nivel 1 imposible de frustrar, nivel máximo imposible de aburrir. Pistas disponibles, nunca castigo sin explicación. |
| **3. Pedagogía primero** | Cada interacción enseña algo: piezas, función, procedimiento de taller, seguridad. El juego es el vehículo, el aprendizaje es el destino. |
| **4. Experiencia exquisita** | Glass liquid UI con identidad ZR, animaciones fluidas, cero fricción, carga rápida incluso en equipos modestos. El estudiante debe sentir orgullo de usarla. |

---

## 5. Los Tres Modos (secuencia de lanzamiento)

### v1 — Modo Academia (guiado) ← **LANZAMIENTO INICIAL**
El estudiante explora el sistema de arranque y carga en vista 2.5D isométrica:
- **Explorador de piezas:** toca cualquier componente → panel glass con nombre, función, síntomas de falla, valores normales y cómo probarlo
- **Lecciones interactivas:** micro-lecciones de 3-5 min con misiones ("mide el voltaje de la batería con el motor apagado")
- **Procedimientos de taller:** checklist visual de pasos correctos (seguridad, orden, verificación)
- **Progreso personal:** piezas descubiertas, lecciones completadas, insignias de conocimiento

### v2 — Modo Reto (diagnóstico) ← el corazón tipo Electude, mejorado
- Orden de trabajo con descripción del cliente
- Falla oculta que diagnosticar con multímetro, luz de prueba, y (nivel 2+) osciloscopio y escáner
- Factura en tiempo real, sistema de intentos (100/50/25/12.5), checklist de cierre
- 3 niveles de dificultad con desbloqueo progresivo
- Leaderboard global y por cohorte

### v3 — Modo Carrera + Copiloto IA
- Progresión narrativa: Aprendiz → Ayudante → Técnico → Especialista → Maestro
- Casos encadenados con historia (clientes recurrentes, taller que crece)
- Copiloto IA de pistas progresivas (nunca regala la respuesta)
- Certificados PDF con evidencia de desempeño

---

## 6. Diferenciales frente a Electude (nuestra ventaja)

| Electude | ZR Lab |
|---|---|
| Interfaz 2D plana, estética de 2014 | 2.5D isométrico con glass liquid UI dark/light |
| Solo modo challenge con registro | Modo Academia gratuito y abierto como gancho de marketing |
| Inglés/traducciones genéricas | Español nativo, terminología de nuestro taller y región |
| Sin explicación pedagógica de las piezas | Explorador de piezas con micro-lecciones integradas |
| ~60 fallas fijas | Editor de casos ilimitado para instructores |
| Sin analítica visible para docentes | Panel docente con mapa de calor de errores (v2) |
| Leaderboard global anónimo | Competencia por cohortes de la academia + global |
| Sin IA | Copiloto de pistas con IA (v3) |

---

## 7. Modelo de Uso y Distribución

- **URL:** subdominio propio (ej. `lab.zrmecademy.com`), desplegado en Vercel
- **PWA:** instalable en celular ("agregar a inicio"), funciona como app sin tiendas
- **Acceso estudiantes:** código de clase + registro simple (email o usuario)
- **Modo demo público:** Explorador de piezas abierto sin registro = marketing viral
- **Requisito técnico del cliente:** cualquier navegador moderno, sin GPU, internet básico

---

## 8. Métricas de Éxito (v1)

| Métrica | Meta a 3 meses del piloto |
|---|---|
| Estudiantes activos semanales | ≥ 60% de la matrícula del curso |
| Lecciones completadas por estudiante | ≥ 8 de 12 |
| Piezas exploradas por estudiante | ≥ 90% del sistema de arranque |
| Tiempo promedio de sesión | ≥ 12 minutos |
| Satisfacción (encuesta simple 1-5) | ≥ 4.2 |
| Costo mensual de infraestructura | $0 (free tiers) |

---

## 9. Riesgos y Mitigaciones

| Riesgo | Mitigación |
|---|---|
| Equipos de estudiantes muy antiguos | 2.5D vectorial liviano, assets comprimidos, presupuesto de peso por pantalla (ver doc 02) |
| Producción de arte isométrico lenta | Kit de piezas reutilizables + estilo flat-isométrico simple (ver doc 04); empezar con 12 componentes |
| Abandono por dificultad | Modo Academia primero (sin frustración), pistas siempre disponibles en Reto |
| Alcance se infla ("feature creep") | Este documento manda: v1 = Academia con arranque y carga. Todo lo demás espera. |
| Dependencia de una persona | Toda decisión documentada; cualquiera puede retomar con los docs 00-09 |

---

## 10. Principios de Decisión (cuando haya dudas)

1. **¿Enseña algo?** Si una feature no enseña ni motiva a aprender, no entra.
2. **¿Un estudiante de primer día lo entiende sin ayuda?** Si no, se simplifica.
3. **¿Corre en una laptop de 8GB sin GPU?** Si no, se optimiza o se descarta.
4. **¿Cuesta dinero mensual?** Si sí, se busca alternativa gratuita hasta validar.
5. **¿Está en el roadmap de la fase actual?** Si no, va al backlog, no al sprint.
