import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const migrationPath = join(import.meta.dir, '../src/db/migrations/001_initial.sql');
console.log('Running D1 migration locally...');
execSync(`wrangler d1 execute skillpage-db --local --file "${migrationPath}"`, { stdio: 'inherit' });
console.log('Migration complete!');
