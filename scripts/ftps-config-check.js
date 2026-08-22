'use strict';

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const envFile = path.join(projectRoot, '.env.deploy');
const required = ['FTP_SERVER', 'FTP_PORT', 'FTP_USERNAME', 'FTP_PASSWORD', 'FTP_TARGET_DIR', 'FTP_PROTOCOL'];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const values = {};
  const text = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const sepIndex = line.indexOf('=');
    if (sepIndex === -1) {
      continue;
    }

    const key = line.slice(0, sepIndex).trim();
    const value = line.slice(sepIndex + 1).trim();
    values[key] = value.replace(/^['"]|['"]$/g, '');
  }
  return values;
}

const merged = { ...parseEnvFile(envFile), ...process.env };
const missing = required.filter((key) => !String(merged[key] || '').trim());

if (missing.length > 0) {
  console.log(JSON.stringify({ status: 'ERROR', missing, configured: false }, null, 2));
  process.exit(1);
}

const summary = {};
for (const key of required) {
  summary[key] = !!String(merged[key] || '').trim();
}

console.log(JSON.stringify({ status: 'OK', configured: true, checks: summary }, null, 2));
