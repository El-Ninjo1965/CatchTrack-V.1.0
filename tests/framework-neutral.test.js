const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

test('neutral framework metadata is present', () => {
  const pkg = readJson('package.json');
  assert.equal(pkg.name, 'neutral-web-platform');
  assert.match(pkg.description, /neutral|platform|framework/i);
  assert.doesNotMatch(JSON.stringify(pkg), /CatchTrack|catchtrack/i);
});

test('platform server and workflow are present', () => {
  const workflow = fs.readFileSync(path.join(root, 'WORKFLOW.md'), 'utf8');
  assert.match(workflow, /neutral|platform|framework/i);
  assert.doesNotMatch(workflow, /CatchTrack|catchtrack|MASTER FROZEN|WORKFLOW_USER_ADMIN/i);

  assert.ok(fs.existsSync(path.join(root, 'server', 'server.js')));
  assert.ok(fs.existsSync(path.join(root, 'webroot', 'index.html')));
});
