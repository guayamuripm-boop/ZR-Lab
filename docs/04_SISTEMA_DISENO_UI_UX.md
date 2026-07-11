# 04 — Sistema de Diseño UI/UX "ZR Glass"

**Proyecto:** ZR Lab | **Estética:** Glass Liquid (dark + light) sobre identidad ZR Mecademy 2025
**Fuente de identidad:** `C:\Proyectos\Marcas\ZR Mecademy\IdentidadZRMecademy2025\` (manual oficial)

---

## 1. Principios de Diseño

1. **El taller es el protagonista.** La UI glass flota SOBRE la escena isométrica; nunca la tapa más del 40% en desktop ni 60% en móvil.
2. **Vidrio con propósito.** El efecto glass indica jerarquía: cuanto más importante el panel, más opaco y elevado. Nada de vidrio decorativo sin función.
3. **Una acción principal por pantalla.** El estudiante siempre sabe cuál es el siguiente paso (botón primario único, glow sutil).
4. **Feedback en ≤ 150ms.** Todo toque responde: glow, escala 0.98, ripple suave. La app se siente "viva y líquida".
5. **Celebrar sin interrumpir.** Logros con micro-animaciones de 1.5s máximo; nunca modales que bloqueen el flujo de aprendizaje.
6. **Legible primero, bonito después.** Si el glass compromete contraste AA, gana el contraste (se sube opacidad del fondo).

---

## 2. Tokens de Diseño (fuente de verdad → `styles/tokens.css`)

### 2.1 Colores de marca (oficiales del manual 2025)

```css
:root {
  /* Paleta oficial ZR Mecademy */
  --zr-navy:      #21284F;   /* azul noche */
  --zr-blue:      #1E4D96;   /* principal de marca */
  --zr-blue-mid:  #3869B1;
  --zr-blue-soft: #6590CB;
  --zr-sky:       #98BAE3;
  --zr-white:     #FFFFFF;

  /* Semánticos (derivados, uso funcional) */
  --success: #34C98E;   /* medición correcta, lección completada */
  --warning: #F5B841;   /* atención, valor fuera de rango leve */
  --danger:  #E5484D;   /* error, valor crítico */
  --gold:    #E8C468;   /* pieza dominada, insignias */
}
```

### 2.2 Tema Dark (predeterminado — "taller de noche")

```css
:root[data-theme='dark'] {
  --bg-base:        #0D1230;                          /* más profundo que navy */
  --bg-gradient:    radial-gradient(120% 120% at 20% 0%, #1A2148 0%, #0D1230 55%, #090D22 100%);
  --glass-surface:  rgba(33, 40, 79, 0.55);           /* navy translúcido */
  --glass-surface-2:rgba(56, 105, 177, 0.18);         /* paneles secundarios */
  --glass-border:   rgba(152, 186, 227, 0.25);        /* borde sky sutil */
  --glass-highlight:rgba(255, 255, 255, 0.08);        /* brillo superior */
  --text-primary:   #F4F7FC;
  --text-secondary: #98BAE3;
  --accent:         #6590CB;
  --accent-strong:  #98BAE3;
  --glow:           0 0 24px rgba(101, 144, 203, 0.35);
}
```

### 2.3 Tema Light ("taller de día")

```css
:root[data-theme='light'] {
  --bg-base:        #EEF3FA;
  --bg-gradient:    radial-gradient(120% 120% at 20% 0%, #FFFFFF 0%, #E8EFF9 55%, #D9E5F5 100%);
  --glass-surface:  rgba(255, 255, 255, 0.62);
  --glass-surface-2:rgba(152, 186, 227, 0.20);
  --glass-border:   rgba(30, 77, 150, 0.18);
  --glass-highlight:rgba(255, 255, 255, 0.85);
  --text-primary:   #21284F;
  --text-secondary: #3869B1;
  --accent:         #1E4D96;
  --accent-strong:  #21284F;
  --glow:           0 0 20px rgba(30, 77, 150, 0.20);
}
```

### 2.4 Receta Glass (clase base)

```css
.glass {
  background: var(--glass-surface);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow:
    inset 0 1px 0 var(--glass-highlight),   /* brillo líquido superior */
    0 8px 32px rgba(9, 13, 34, 0.35);
}
/* Fallback obligatorio para navegadores sin backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: color-mix(in srgb, var(--glass-surface) 100%, var(--bg-base) 60%); }
}
```

**Jerarquía de elevación:** `glass-hud` (blur 12, radius 14, siempre visible) → `glass-panel` (blur 18, radius 20) → `glass-modal` (blur 24, radius 24, + overlay 40%).

### 2.5 Tipografía (oficial del manual)

| Rol | Fuente | Peso | Tamaño (desktop / móvil) |
|---|---|---|---|
| Display / títulos de pantalla | **Raleway** | 700 | 32 / 24px |
| Títulos de panel | Raleway | 600 | 22 / 18px |
| Cuerpo / UI | **Roboto** | 400 | 16 / 15px |
| UI secundaria / captions | Roboto | 400 | 13px |
| Datos técnicos (lecturas, valores) | Roboto Mono | 500 | 18px |

Cargar vía `@fontsource` (self-hosted, sin Google CDN) para rendimiento y privacidad.

### 2.6 Espaciado, radios, movimiento

- Escala de espaciado: 4 / 8 / 12 / 16 / 24 / 32 / 48
- Radios: botones 12, cards 20, modales 24, pills 999
- **Curva de movimiento única:** `cubic-bezier(0.32, 0.72, 0.24, 1)` (líquida) — duraciones: micro 150ms, panel 300ms, escena 450ms
- `prefers-reduced-motion`: todas las animaciones caen a fade simple de 100ms

---

## 3. Estilo de la Escena 2.5D Isométrica

- **Proyección:** isométrica 2:1 (26.57°), consistente en TODAS las piezas
- **Estilo de ilustración:** flat-isométrico con 3 valores por cara (luz / medio / sombra) usando la paleta ZR extendida; sin gradientes complejos ni texturas fotográficas
- **Paleta de escena dark:** metales en azules grisáceos derivados de navy; cables en sky; la pieza activa recibe glow `--accent`
- **Paleta de escena light:** metales gris-azul claros, sombras suaves `rgba(33,40,79,0.15)`
- **Estados de pieza:** normal → hover (glow + escala 1.03) → seleccionada (glow fuerte + outline sky 2px) → no descubierta (desaturada 60% + silueta) → dominada (borde dorado sutil)
- **Kit de producción:** cada pieza es un SVG en su propio archivo, viewBox cuadrado, pivote centrado, nombrado `iso-{component_id}.svg`. Se dibujan en Figma sobre grilla isométrica compartida (plantilla en `assets/ui-components/`)
- **Animación de flujo eléctrico:** dash-offset animado sobre el trazo del cable, color sky, solo cuando la lección lo pide

---

## 4. Componentes de UI (inventario v1)

| Componente | Descripción | Notas |
|---|---|---|
| `GlassPanel` | Contenedor base con las 3 elevaciones | Prop `elevation: hud/panel/modal` |
| `GlassButton` | Primario (fondo `--accent`, texto blanco, glow) / Secundario (glass) / Ghost | Único primario por pantalla |
| `PartPanel` | Panel lateral derecho (desktop) o bottom-sheet (móvil) con 4 tabs: Qué es / Cómo funciona / Cómo se prueba / Cuando falla | Cierra con X, clic fuera, Escape |
| `LessonPlayer` | Barra inferior glass con paso actual, progreso de pasos, botón pista | Nunca tapa la zona de interacción |
| `MultimeterHUD` | Display flotante del multímetro: pantalla con lectura Mono, selector V/Ω, sondas roja/negra | Lectura anima con count-up 300ms |
| `ProgressRing` | Anillo de progreso (piezas, lecciones) | En dashboard y mini en HUD |
| `BadgeCard` | Insignia con animación de obtención (scale + glow dorado 1.5s) | |
| `Toast` | Notificación glass esquina superior derecha, 3s | Éxito/info/error |
| `OnboardingTour` | Tooltips glass secuenciales (máx 5 pasos) | Saltable siempre |
| `ThemeToggle` | Sol/luna con transición de tema en 400ms cross-fade | Persiste en localStorage |
| `CohortTable` | Tabla instructor con orden y estados de color | Verde/ámbar/rojo por actividad |

---

## 5. Layout por Pantalla (wireframe textual)

### 5.1 Taller (pantalla principal)
```
┌─────────────────────────────────────────────────────┐
│ [logo ZR]  Sistema: Arranque y Carga   [🔔][👤][🌙] │ ← glass-hud top, 56px
│                                                     │
│                                                     │
│              ESCENA ISOMÉTRICA                      │
│              (motor + componentes)                  │
│                                        ┌──────────┐ │
│                                        │PartPanel │ │ ← glass-panel
│                                        │ (si hay  │ │   380px desktop
│                                        │selección)│ │
│ ┌────────────┐                         └──────────┘ │
│ │ProgressRing│                                      │
│ └────────────┘                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ LessonPlayer: "Coloca la sonda roja en..."  [💡]│ │ ← glass-hud bottom
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```
**Móvil:** PartPanel se vuelve bottom-sheet deslizable (peek 30% → full 85%); HUD superior se compacta a 48px; se sugiere rotar a paisaje para lecciones de medición.

### 5.2 Dashboard del estudiante
Grid de cards glass: progreso general (ring grande), insignias (carrusel), continuar lección (CTA primario), piezas descubiertas (grid miniaturas), racha.

### 5.3 Panel de instructor
Sidebar glass izquierda (cohortes) + tabla principal + card de código de clase con botón copiar.

---

## 6. Accesibilidad (obligatoria, se verifica antes de cada release)

- Contraste AA mínimo en ambos temas (verificar `--text-secondary` sobre glass con axe-core)
- Todos los interactivos: área táctil ≥ 44×44px
- Navegación por teclado completa en paneles y lecciones (la escena ofrece lista alternativa de piezas accesible por Tab)
- `aria-live="polite"` para lecturas del multímetro y avances de lección
- Nunca color como único indicador (icono + texto siempre)
- Textos redimensionables hasta 200% sin romper layout

---

## 7. Voz y Tono (microcopy)

- **Tú, cercano y profesional:** "Coloca la sonda roja en el borne positivo" (nunca "el usuario debe...")
- **Error = oportunidad:** "Lectura en 0V — revisa si la sonda hace buen contacto" (nunca "¡Incorrecto!")
- **Celebración sobria de taller:** "¡Bien ahí! Medición perfecta." / "Pieza dominada 🔧"
- **Terminología técnica correcta siempre** (borne, no "palito"; multímetro, no "aparato") — el estudiante aprende vocabulario real
- Prohibido: signos de exclamación dobles, mayúsculas sostenidas, anglicismos innecesarios

---

## 8. Assets de Marca en el Proyecto

| Asset | Archivo | Uso |
|---|---|---|
| Isotipo ZR azul | `frontend/public/assets/brand/Azul.svg` | Favicon origen, splash light |
| Imagotipo blanco | `frontend/public/assets/brand/bLANCO COMPLETO.svg` | Header en dark |
| Imagotipo color | `frontend/public/assets/brand/Color 1.svg` | Header en light |
| Versión oscura | `frontend/public/assets/brand/oSCURO.svg` | Documentos, light alt |
| Icono app | `frontend/public/assets/brand/icon.ico` | PWA / favicon |
| Patrón de marca | `frontend/public/assets/brand/patron-marca.png` | Textura de fondo, opacidad 3-6%, tamaño 400px tile |

**Regla:** respetar área de inviolabilidad del logo (1cm proporcional) según manual; nunca deformar ni recolorear fuera de las variantes oficiales.
