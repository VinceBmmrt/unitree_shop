// Runs prisma migrate safely — avoids shell special-character issues with passwords
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envFile = path.resolve(__dirname, '../../.env.local');
const lines = fs.readFileSync(envFile, 'utf8').split('\n');

const env = { ...process.env };
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  let val = trimmed.slice(eq + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

console.log('Connecting to:', env.DIRECT_DATABASE_URL?.replace(/:([^:@]+)@/, ':***@'));

execSync('npx prisma migrate dev --schema=prisma/schema.prisma --name init', {
  stdio: 'inherit',
  env,
  cwd: __dirname,
});
