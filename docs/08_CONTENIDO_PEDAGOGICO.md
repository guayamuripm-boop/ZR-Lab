# 08 — Contenido Pedagógico: Sistema de Arranque y Carga

**Proyecto:** ZR Lab v1 | **Sistema:** `arranque-carga`
**Estado:** BORRADOR TÉCNICO — requiere validación y firma del instructor de ZR Mecademy antes de F2.4 (regla del doc 05)
**Nota:** los valores son de referencia general para vehículo de 12V con motor a gasolina; el instructor ajusta según el pénsum de la academia.

---

## 1. Objetivos de Aprendizaje del Módulo

Al completar el Modo Academia de este sistema, el estudiante podrá:
1. Identificar los 12 componentes del sistema de arranque y carga y su ubicación
2. Explicar la función de cada componente y cómo interactúan (llave → relé → solenoide → arranque; motor → correa → alternador → batería)
3. Usar el multímetro para medir voltaje y resistencia en los puntos correctos, con el procedimiento seguro
4. Reconocer valores normales y anormales en cada punto de prueba
5. Describir los síntomas típicos de falla de cada componente (base para el Modo Reto v2)

---

## 2. El Circuito (definición para el motor de simulación)

### 2.1 Nodos eléctricos

| Nodo | Descripción |
|---|---|
| `N-BAT+` | Borne positivo de batería |
| `N-BAT-` | Borne negativo de batería |
| `N-MAIN` | Salida del fusible principal (alimentación general) |
| `N-IGN1` | Salida de llave en posición ON (contacto) |
| `N-IGN2` | Salida de llave en posición START |
| `N-RELAY-OUT` | Salida del relé de arranque hacia solenoide |
| `N-SOL` | Terminal de señal del solenoide |
| `N-STARTER` | Terminal principal del motor de arranque |
| `N-ALT-B+` | Terminal B+ del alternador |
| `N-LAMP` | Circuito de lámpara de carga |
| `N-GND` | Masa (chasis/bloque motor) |

### 2.2 Componentes y conexiones

| ID | Componente | Conecta | Propiedad clave |
|---|---|---|---|
| `battery` | Batería 12V 60Ah | N-BAT+ ↔ N-BAT- | 12.6V reposo, resistencia interna ~5mΩ |
| `terminal-pos` | Borne positivo | N-BAT+ ↔ cable positivo | R ≈ 0Ω sano |
| `terminal-neg` | Borne negativo | N-BAT- ↔ cable de masa | R ≈ 0Ω sano |
| `main-fuse` | Fusible principal 80A | cable positivo ↔ N-MAIN | R ≈ 0Ω sano; OL quemado |
| `ignition-switch` | Llave/switch de encendido | N-MAIN ↔ N-IGN1 (ON) / N-IGN2 (START) | conmutador 3 posiciones |
| `starter-relay` | Relé de arranque 4 polos | bobina: N-IGN2→N-GND; contacto: N-MAIN→N-RELAY-OUT | bobina 70-90Ω |
| `solenoid` | Solenoide del arranque | señal: N-RELAY-OUT→N-SOL; potencia: N-BAT+→N-STARTER | bobinas ~0.4-1Ω |
| `starter-motor` | Motor de arranque | N-STARTER ↔ N-GND | consume 80-200A en marcha |
| `alternator` | Alternador 90A | N-ALT-B+ ↔ N-GND (genera hacia N-BAT+) | 13.8-14.4V regulado |
| `belt` | Correa de accesorios | mecánica: cigüeñal → polea alternador | sin propiedades eléctricas; su estado habilita la carga |
| `charge-lamp` | Lámpara de carga (tablero) | N-IGN1 ↔ N-LAMP ↔ alternador | encendida = no hay carga |
| `ground-strap` | Cable/trenza de masa | N-BAT- ↔ N-GND (bloque/chasis) | R ≈ 0Ω sano |

### 2.3 Diagrama lógico (referencia para ilustración y layout.json)

```
                    ┌──────────── correa ────────────┐
                    │                                ▼
  [BATERÍA]═══cable positivo═══[FUSIBLE 80A]    [ALTERNADOR]──B+──► (a N-BAT+)
   │12V │                          │                 │
   +    -                     [LLAVE 🔑]         [LÁMPARA ⚡] (tablero)
   │    │                      ON │ START            │
   │    └──[trenza de masa]───────┼──────────────────┴──► N-GND (bloque/chasis)
   │                              ▼
   │                        [RELÉ ARRANQUE]
   │                              │
   └──cable grueso──► [SOLENOIDE]─┴─► [MOTOR DE ARRANQUE] ──► engrana volante
```

---

## 3. Fichas de las 12 Piezas (formato del Explorador — RF-C1..C3)

> Formato de cada ficha: **Qué es / Qué hace** (≤60 palabras) · **Cómo se prueba** · **Cuando falla**. Las 3 primeras van completas como patrón de calidad; las demás en versión resumida que el instructor expandirá al mismo nivel.

### 3.1 `battery` — Batería ✅ COMPLETA
- **Qué es / qué hace:** El almacén de energía del vehículo. Entrega la corriente para arrancar el motor y estabiliza el sistema eléctrico. Se recarga con el alternador cuando el motor está en marcha. Sin batería sana, nada funciona.
- **Cómo se prueba:** Multímetro en V DC. Sonda roja al borne positivo, negra al negativo. Reposo: **12.4–12.7V** (cargada). Durante arranque: no debe bajar de **9.6V**. Con motor encendido: **13.8–14.4V** (confirma que recibe carga).
- **Cuando falla:** El arranque suena lento o solo hace "clic". Luces débiles. Si tras cargar vuelve a descargarse: celda dañada o fuga de corriente. Bornes sulfatados (polvo blanco/verde) causan falsos contactos.

### 3.2 `starter-motor` — Motor de arranque ✅ COMPLETA
- **Qué es / qué hace:** Motor eléctrico de alta potencia que hace girar el motor de combustión para iniciarlo. Solo trabaja segundos, pero consume muchísima corriente (80–200A). Su piñón engrana con el volante del motor a través del solenoide.
- **Cómo se prueba:** Prueba de caída de voltaje: durante el arranque, la batería no debe caer de 9.6V y el terminal principal del arranque debe recibir casi el mismo voltaje que la batería (caída máxima 0.5V en el cable). Consumo excesivo o giro lento con batería sana = arranque desgastado.
- **Cuando falla:** Clic sin giro (solenoide actúa pero motor no), giro lento con batería buena (escobillas/casquillos gastados), chirrido metálico (piñón no engrana bien), o silencio total (circuito de mando abierto).

### 3.3 `alternator` — Alternador ✅ COMPLETA
- **Qué es / qué hace:** El generador del vehículo. Movido por la correa, transforma giro en electricidad: recarga la batería y alimenta todo el sistema con el motor en marcha. Su regulador mantiene el voltaje entre 13.8 y 14.4V.
- **Cómo se prueba:** Motor encendido, multímetro en la batería: **13.8–14.4V** = carga bien. Menos de 13.2V = no está cargando (revisar correa, conexiones, alternador). Más de 14.8V = regulador dañado (peligro para la batería y electrónica).
- **Cuando falla:** Lámpara de batería encendida en el tablero, batería que se descarga manejando, luces que oscilan. Ruido de rodamiento o correa chillona son avisos tempranos.

### 3.4 — 3.12 Fichas resumidas (a expandir por el instructor al nivel de las 3 anteriores)

| ID | Qué hace (núcleo) | Prueba clave | Falla típica |
|---|---|---|---|
| `terminal-pos` / `terminal-neg` | Unión eléctrica batería↔vehículo | Caída de voltaje borne-cable < 0.1V en crank; inspección visual de sulfato | Sulfatación, borne flojo → clic o apagones intermitentes |
| `main-fuse` | Protege el circuito principal de sobrecorriente | Continuidad: ~0Ω sano; OL = quemado. Voltaje presente a ambos lados | Sistema muerto total; se quema por cortocircuito aguas abajo |
| `ignition-switch` | Distribuye corriente según posición de la llave (OFF/ON/START) | Voltaje en salida ON con llave en ON; en salida START solo al girar | No pasa a START (no cranquea) o pierde ON intermitente |
| `starter-relay` | Un interruptor electromagnético: la llave energiza su bobina y el contacto manda corriente al solenoide | Bobina 70–90Ω; con 12V en bobina debe hacer clic y cerrar contacto (0Ω) | Bobina abierta (silencio) o contactos quemados (clic sin paso) |
| `solenoid` | Empuja el piñón y conecta la corriente máxima al arranque | Voltaje en terminal de señal al dar START; clic audible | Clic repetido sin giro = contactos internos gastados |
| `belt` | Transmite el giro del motor al alternador (y accesorios) | Inspección: tensión (flexión ~1cm), grietas, brillo (patina) | Chillido al acelerar, lámpara de carga, sobrecalentamiento si mueve la bomba |
| `charge-lamp` | Testigo del tablero: encendida con llave ON, se apaga al arrancar si el alternador carga | Debe encender en ON (prueba de bombillo) y apagar en marcha | Encendida en marcha = no hay carga; nunca enciende = bombillo/circuito |
| `ground-strap` | Cierra el circuito: retorna la corriente al negativo por el chasis/bloque | Caída de voltaje masa-batería < 0.2V en crank; R ≈ 0Ω | Corrosión → fallas "fantasma": luces raras, arranque débil |
| `wiring-pos` (cable positivo grueso) | Autopista de corriente batería→solenoide→arranque | Caída de voltaje < 0.5V durante crank | Recalentamiento, aislante dañado, caída excesiva |

---

## 4. Tabla Maestra de Valores (fuente de verdad para el CircuitEngine y los tests de F1)

| Medición (puntos) | Reposo (OFF) | Llave ON | START (crank) | Motor encendido |
|---|---|---|---|---|
| V batería (N-BAT+ ↔ N-BAT-) | **12.6V** | 12.4V | **10.5V** (sana: 9.6–10.8) | **14.1V** (13.8–14.4) |
| V en N-MAIN ↔ masa | 12.6V | 12.4V | 10.4V | 14.1V |
| V salida llave ON (N-IGN1) | 0V | 12.3V | 10.3V | 14.0V |
| V salida llave START (N-IGN2) | 0V | 0V | 10.3V | 0V |
| V señal solenoide (N-SOL) | 0V | 0V | 10.2V | 0V |
| V terminal arranque (N-STARTER) | 0V | 0V | **10.1V** (caída cable ≤0.5V) | 0V |
| V B+ alternador ↔ masa | 12.6V | 12.4V | 10.4V | **14.2V** |
| Caída borne+ (N-BAT+ ↔ cable) | 0V | 0V | ≤0.1V | ≤0.1V |
| Caída masa (N-BAT- ↔ N-GND) | 0V | 0V | ≤0.2V | ≤0.1V |
| R fusible principal | ~0Ω | — | — | — |
| R bobina relé | 80Ω | — | — | — |
| R trenza de masa | ~0Ω | — | — | — |
| Lámpara de carga | apagada | **encendida** | encendida | **apagada** |

> Los tests de F1.4 verifican exactamente esta tabla. Cualquier corrección del instructor se hace AQUÍ y se propaga a código.

---

## 5. Las 15 Lecciones del Modo Academia

**Estructura fija por lección** (doc 03 §4.2): intro → focus → interacción (measure/toggle/order) → quiz → summary+insignia.

### Bloque 1 — Fundamentos (lecciones 1-4)
| # | ID | Título | Misión interactiva central | Insignia |
|---|---|---|---|---|
| 1 | `lec-tour` | Bienvenido al taller | Recorrido: encuentra y toca 4 piezas señaladas | Primera Visita |
| 2 | `lec-battery` | La batería: el corazón eléctrico | Medir 12.6V en reposo con el multímetro | Corazón Cargado |
| 3 | `lec-terminals` | Bornes y conexiones | Inspección visual + medir caída de voltaje en borne | Buen Contacto |
| 4 | `lec-ground` | La masa: el circuito de retorno | Medir continuidad de la trenza de masa (~0Ω) | Tierra Firme |

### Bloque 2 — Circuito de arranque (lecciones 5-9)
| # | ID | Título | Misión | Insignia |
|---|---|---|---|---|
| 5 | `lec-fuse` | Fusibles: los guardianes | Probar continuidad de fusible sano vs quemado | Guardián |
| 6 | `lec-switch` | La llave de encendido | Girar llave y medir N-IGN1/N-IGN2 en cada posición | Llavero |
| 7 | `lec-relay` | El relé: pequeño interruptor gigante | Medir bobina (80Ω) y verificar clic al energizar | Clic Perfecto |
| 8 | `lec-solenoid` | El solenoide | Dar START y medir señal 10.2V en N-SOL | Empuje Justo |
| 9 | `lec-starter` | El motor de arranque | Crank completo: observar caída a 10.5V y giro | Primera Chispa ⭐ |

### Bloque 3 — Circuito de carga (lecciones 10-13)
| # | ID | Título | Misión | Insignia |
|---|---|---|---|---|
| 10 | `lec-belt` | La correa de accesorios | Inspección: identificar correa sana vs agrietada/floja | Tensión Justa |
| 11 | `lec-alternator` | El alternador: la planta generadora | Encender motor y medir 14.2V en B+ | Generador |
| 12 | `lec-lamp` | La lámpara de carga | Observar lámpara en ON/marcha e interpretar | Ojo de Águila |
| 13 | `lec-charge-circuit` | 🔗 Integradora: el ciclo de carga | Secuencia completa: reposo→marcha, 3 mediciones seguidas | Circuito Completo ⭐ |

### Bloque 4 — Integradoras finales (lecciones 14-15)
| # | ID | Título | Misión | Insignia |
|---|---|---|---|---|
| 14 | `lec-start-circuit` | 🔗 Integradora: anatomía de un arranque | Ordenar la cadena completa (llave→relé→solenoide→arranque→volante) + medir 3 puntos durante crank | Anatomía del Arranque |
| 15 | `lec-workshop-pro` | 🔗 Procedimiento profesional de taller | Ordenar los pasos del protocolo: seguridad → inspección visual → batería primero → pruebas → registro | Técnico en Formación ⭐⭐ |

### Guion completo de ejemplo — Lección 2 `lec-battery` (patrón para las demás)

```jsonc
[
  { "type": "intro", "text": "Todo diagnóstico eléctrico empieza aquí: la batería. Antes de culpar a cualquier otra pieza, un buen técnico verifica que la fuente de energía esté sana." },
  { "type": "focus", "target": "battery", "text": "Esta es la batería. Acércate con doble clic." },
  { "type": "quiz", "question": "Antes de medir, ¿qué revisas a simple vista?",
    "options": ["Bornes limpios y apretados", "El color de la carcasa", "La marca de la batería"],
    "answer": 0, "explanation": "Un borne sulfatado o flojo causa los mismos síntomas que una batería mala. Inspección visual SIEMPRE primero." },
  { "type": "measure", "tool": "multimeter", "mode": "V",
    "probeA": "battery-positive", "probeB": "battery-negative",
    "expect": { "min": 12.4, "max": 12.7 },
    "instruction": "Multímetro en V DC. Sonda roja al borne (+), negra al (−). ¿Cuánto marca?",
    "hint": "El borne positivo es el más grueso y tiene la marca +.",
    "wrongFeedback": { "reversed": "¿Lectura negativa? Invertiste las sondas. No daña este multímetro, pero acostúmbrate: rojo al +." } },
  { "type": "quiz", "question": "Marcó 12.6V en reposo. ¿Qué significa?",
    "options": ["Carga completa", "Batería a media carga", "Sobrecarga peligrosa"],
    "answer": 0, "explanation": "12.4–12.7V = cargada. 12.0–12.3V = media. Menos de 12.0V = descargada." },
  { "type": "summary", "text": "Ya sabes verificar la fuente de energía del vehículo: inspección visual + medición en reposo. Próximo paso: ver qué pasa con este voltaje durante el arranque.", "badge": "battery-master" }
]
```

---

## 6. Catálogo de Fallas v2 (se construye en F8 — documentado desde ya)

| # | Falla | Componente | Efecto en el motor de simulación | Síntoma para la orden de trabajo | Nivel |
|---|---|---|---|---|---|
| 1 | Batería descargada | battery | V reposo 11.8V, crank cae a 8V | "El carro no quiere prender en las mañanas" | 1 |
| 2 | Borne positivo sulfatado | terminal-pos | caída 0.8V en borne durante crank | "A veces arranca, a veces solo hace clic" | 1 |
| 3 | Fusible principal quemado | main-fuse | OL, sin voltaje aguas abajo | "Se quedó muerto de repente, sin luces ni nada" | 1 |
| 4 | Trenza de masa corroída | ground-strap | caída 1.2V en masa durante crank | "Arranca lento y las luces parpadean" | 2 |
| 5 | Relé de arranque abierto | starter-relay | bobina OL, no hay señal al solenoide | "Giro la llave y no hace absolutamente nada" | 2 |
| 6 | Contactos de solenoide gastados | solenoid | clic audible, sin paso de potencia | "Hace clic clic clic pero no arranca" | 2 |
| 7 | Escobillas del arranque gastadas | starter-motor | giro lento con batería sana | "Arranca cansado aunque la batería es nueva" | 2 |
| 8 | Correa floja | belt | carga intermitente 12.8-13.5V variable | "La luz de la batería parpadea y chilla al acelerar" | 2 |
| 9 | Correa rota | belt | sin carga, 12.4V cayendo en marcha | "Se encendió la luz de batería y se apagó a los km" | 1 |
| 10 | Alternador sin carga (diodos) | alternator | 12.3V en marcha, lámpara encendida | "La batería se descarga manejando" | 3 |
| 11 | Regulador alto | alternator | 15.6V en marcha | "Huele raro y los bombillos se queman seguido" | 3 |
| 12 | Llave desgastada (START intermitente) | ignition-switch | N-IGN2 aleatorio al dar marcha | "Hay que intentar varias veces para que cranquee" | 3 |

---

## 7. Checklist de Validación del Instructor (firmar antes de F2.4)

- [ ] Los valores de la tabla §4 corresponden a lo que enseñamos en el taller
- [ ] La terminología es la que usamos en clase (borne/terminal, cranquear/dar marcha — unificar)
- [ ] Cada ficha de pieza es técnicamente correcta y completa
- [ ] Las 15 lecciones siguen el orden en que lo enseñamos presencialmente
- [ ] Los procedimientos incluyen la seguridad que exigimos (quitar objetos metálicos, orden de desconexión de bornes, etc.)
- [ ] Los síntomas de las fallas v2 suenan a como los describen los clientes reales

**Validado por:** ______________________ **Fecha:** __________
