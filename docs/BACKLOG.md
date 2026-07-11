# BACKLOG — ZR Lab

Ideas y mejoras fuera del alcance de la fase activa. Una línea por idea. Nada de aquí se ejecuta sin pasar por planificación (doc 07 §5).

## Propuestas del director (2026-07-10, sesión nocturna — pendientes de aprobación formal per doc 07 §5)

- **Escena 3D**: el director pidió "agregar todo el 3D". Estado en los docs: decisión cerrada doc 00 = 2.5D isométrico v1; 3D es **V4 condicional** (doc 05: solo si v1-v3 validadas + demanda + presupuesto de arte). Razón técnica vigente (ADR-1): la PC de referencia (i3-2120, sin GPU) corre WebGL por software. Reabrir esta decisión requiere registro en la tabla del doc 00. **No implementado.**
- **Modo Reto (v2) / Modo Carrera (v3) adelantados**: pedidos como "modalidades". El doc 02 §4 los excluye de v1; el doc 05 exige cerrar F6/F7 (backend + piloto) antes de F8. Primer paso concreto cuando se apruebe: F8 = `applyFault()` sobre el engine existente + catálogo de 12 fallas ya documentado en doc 08 §6. **No implementado.**

## Ideas registradas

- Audio ambiental de taller y efectos de sonido (arranque, clic de relé) — evaluar en F7 si el peso lo permite
- Modo colaborativo: dos estudiantes en el mismo caso en tiempo real (v3+)
- Realidad aumentada WebXR sobre los modelos (v4+)
- Más sistemas: encendido, inyección, frenos ABS, climatización, vehículo eléctrico (v2+, uno por ciclo)
- Notificaciones push de racha/recordatorio vía PWA
- Exportar progreso de cohorte a CSV (RF-F3, P2 de v1 — si sobra tiempo en F6)
- Modo offline completo del contenido (RNF-9 ampliado)

## Bugs menores

*(vacío)*
