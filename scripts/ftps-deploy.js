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
const allPresent = required.every((key) => String(merged[key] || '').trim());

if (!allPresent) {
  console.log(JSON.stringify({ status: 'ERROR', message: 'FTPS config incomplete. Fill .env.deploy or exported env vars.', missing: required.filter((key) => !String(merged[key] || '').trim()) }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'OK',
  mode: 'validation-only',
  transfer: 'not-executed',
  target: merged.FTP_PROTOCOL || 'ftps',
  serverConfigured: !!merged.FTP_SERVER,
  portConfigured: !!merged.FTP_PORT,
  userConfigured: !!merged.FTP_USERNAME,
  passwordConfigured: !!merged.FTP_PASSWORD,
  targetDirConfigured: !!merged.FTP_TARGET_DIR,
  note: 'No real FTPS transfer was performed in this session.'
}, null, 2));
