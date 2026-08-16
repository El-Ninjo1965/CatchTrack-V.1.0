'use strict';

const appShell = {
  name: 'neutral-app-shell',
  version: '0.1.0',
  initialized: false,
  initialize(context = {}) {
    this.initialized = true;
    return {
      ok: true,
      name: this.name,
      version: this.version,
      context
    };
  }
};

module.exports = appShell;
