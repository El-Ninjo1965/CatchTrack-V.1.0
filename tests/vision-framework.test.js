const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const loadScript = (context, scriptPath) => {
  const source = fs.readFileSync(scriptPath, 'utf8');
  vm.runInContext(source, context, { filename: scriptPath });
};

test('theme engine supports neutral and app-specific themes', () => {
  const styles = new Map();
  const documentStub = {
    body: {
      dataset: {},
      setAttribute(name, value) {
        this[name] = value;
      }
    },
    documentElement: {
      style: {
        setProperty(name, value) {
          styles.set(name, value);
        }
      }
    }
  };

  const eventLog = [];
  const windowStub = {
    document: documentStub,
    Core: { emit() {} },
    dispatchEvent(event) {
      eventLog.push(event.type);
      return true;
    },
    CustomEvent: class CustomEvent {
      constructor(type, detail) {
        this.type = type;
        this.detail = detail || {};
      }
    }
  };
  windowStub.window = windowStub;

  const context = vm.createContext(windowStub);
  loadScript(context, path.resolve(__dirname, '../platform/theme-engine.js'));

  const neutralTheme = context.window.ThemeEngine.getCurrentTheme();
  assert.equal(neutralTheme.id, 'neutral-theme');

  const customTheme = context.window.ThemeEngine.registerTheme({
    id: 'camping-theme',
    name: 'Camping Theme',
    config: { accent: '#2d6a4f', background: '#edf5ee' }
  });

  assert.equal(customTheme.id, 'camping-theme');

  context.window.ThemeEngine.activateTheme('camping-theme');
  assert.equal(documentStub.body.dataset.theme, 'camping-theme');
  assert.equal(styles.get('--accent'), '#2d6a4f');
  assert.equal(eventLog.includes('theme:changed'), true);
});

test('media manager optimizes supported image uploads', async () => {
  const createObjectURL = () => `blob:${Math.random()}`;
  const revokeObjectURL = () => {};
  class MockImage {
    constructor() {
      this.width = 2000;
      this.height = 1500;
      this._src = '';
    }

    set src(value) {
      this._src = value;
      queueMicrotask(() => {
        if (typeof this.onload === 'function') {
          this.onload();
        }
      });
    }

    get src() {
      return this._src;
    }
  }

  const canvas = {
    width: 0,
    height: 0,
    getContext() {
      return {
        drawImage() {}
      };
    },
    toBlob(callback) {
      callback(new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'image/jpeg' }));
    }
  };

  const documentStub = {
    createElement() {
      return canvas;
    }
  };

  const windowStub = {
    document: documentStub,
    Core: { emit() {} },
    Image: MockImage,
    URL: { createObjectURL, revokeObjectURL },
    File
  };
  windowStub.window = windowStub;

  const context = vm.createContext(windowStub);
  loadScript(context, path.resolve(__dirname, '../platform/media-manager.js'));

  const result = await context.window.MediaManager.optimizeImage({
    name: 'sample.jpg',
    type: 'image/jpeg',
    size: 2_500_000
  }, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.7,
    maxBytes: 2_000_000
  });

  assert.equal(result.ok, true);
  assert.equal(result.optimized, true);
  assert.equal(result.dimensions.width <= 800, true);
  assert.equal(result.dimensions.height <= 800, true);
});
