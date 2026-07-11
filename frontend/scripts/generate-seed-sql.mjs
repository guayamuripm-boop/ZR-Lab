// Genera backend/supabase/migrations/002_seed_content.sql desde content/*.json.
// Uso: node scripts/generate-seed-sql.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const components = JSON.parse(readFileSync(resolve(__dirname, '../src/content/components.json'), 'utf-8'));
const lessons = JSON.parse(readFileSync(resolve(__dirname, '../src/content/lessons.json'), 'utf-8'));

function sqlString(value) {
  if (value === null || value === undefined) return 'null';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJsonb(value) {
  if (value === null || value === undefined) return 'null';
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

const lines = [];
lines.push('-- ZR Lab — Contenido semilla (generado desde content/components.json y content/lessons.json)');
lines.push('-- Regenerar con: node frontend/scripts/generate-seed-sql.mjs');
lines.push('-- BORRADOR pendiente de validación del instructor técnico (doc 08 §7 / doc 05 F2.3).');
lines.push('');
lines.push(
  "insert into systems (id, name, description, order_index, published) values ('arranque-carga', 'Arranque y Carga', 'Batería, motor de arranque, alternador, relés y fusibles del sistema eléctrico del vehículo.', 1, true);",
);
lines.push('');

for (const c of components) {
  lines.push(
    `insert into components (id, system_id, name, short_role, full_description, how_to_test, failure_signs, scene_key, order_index) values (` +
      [
        sqlString(c.id),
        sqlString(c.system_id),
        sqlString(c.name),
        sqlString(c.short_role),
        sqlString(c.full_description),
        sqlJsonb(c.how_to_test),
        sqlJsonb(c.failure_signs),
        sqlString(c.scene_key),
        c.order_index,
      ].join(', ') +
      ');',
  );
}
lines.push('');

// Insertar en orden de prerequisito (order_index ya respeta la cadena) para que las FK no fallen.
const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);
for (const l of sortedLessons) {
  lines.push(
    `insert into lessons (id, system_id, component_id, title, estimated_minutes, steps, badge_key, order_index, prerequisite_lesson_id) values (` +
      [
        sqlString(l.id),
        sqlString(l.system_id),
        sqlString(l.component_id),
        sqlString(l.title),
        l.estimated_minutes,
        sqlJsonb(l.steps),
        sqlString(l.badge_key),
        l.order_index,
        sqlString(l.prerequisite_lesson_id),
      ].join(', ') +
      ');',
  );
}

const outPath = resolve(__dirname, '../../backend/supabase/migrations/002_seed_content.sql');
writeFileSync(outPath, lines.join('\n') + '\n', 'utf-8');
console.log(`Escrito: ${outPath}`);
console.log(`${components.length} componentes, ${lessons.length} lecciones.`);
