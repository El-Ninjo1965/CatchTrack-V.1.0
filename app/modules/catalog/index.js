(() => {
  'use strict';

  const STORE_APP_ID = 'retail-demo';
  const STORE_TEMPLATE_ID = 'retail-store';
  const ENTITY_ID = 'products';

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const ensureRuntime = () => {
    const runtime = typeof window !== 'undefined' && window.MasterFramework ? window.MasterFramework : null;
    if (!runtime || typeof runtime.getApp !== 'function') {
      return null;
    }

    if (!runtime.getApp(STORE_APP_ID)) {
      if (typeof runtime.createAppFromTemplate === 'function') {
        runtime.createAppFromTemplate(STORE_TEMPLATE_ID, {
          appId: STORE_APP_ID,
          name: 'Retail Demo',
          description: 'Demo retail app for catalog, orders, and customer workflows.',
          modules: ['dashboard', 'catalog', 'orders', 'customers'],
          config: { mode: 'local', defaultView: 'catalog' }
        });
      }
    }

    const template = typeof runtime.getAppTemplate === 'function' ? runtime.getAppTemplate(STORE_TEMPLATE_ID) : null;
    if (template && Array.isArray(template.entitySchemas) && typeof runtime.registerEntitySchema === 'function') {
      template.entitySchemas.forEach((schema) => {
        if (!schema || !schema.id) {
          return;
        }
        if (!runtime.getEntitySchema(STORE_APP_ID, schema.id)) {
          runtime.registerEntitySchema(STORE_APP_ID, schema);
        }
      });
    }

    return runtime;
  };

  const getProducts = () => {
    const runtime = ensureRuntime();
    if (!runtime || typeof runtime.listEntityRecords !== 'function') {
      return [];
    }
    return runtime.listEntityRecords(STORE_APP_ID, ENTITY_ID);
  };

  const createProduct = (payload) => {
    const runtime = ensureRuntime();
    if (!runtime || typeof runtime.createEntityRecord !== 'function') {
      return { ok: false, message: 'Data engine is unavailable.' };
    }

    try {
      const record = runtime.createEntityRecord(STORE_APP_ID, ENTITY_ID, payload);
      return { ok: true, data: record, message: 'Product saved.' };
    } catch (error) {
      return { ok: false, message: error && error.message ? error.message : 'Unable to save product.' };
    }
  };

  const CatalogModule = {
    id: 'catalog',
    name: 'Catalog',
    displayName: 'Catalog',
    version: '1.0.0',
    description: 'Product catalog module for a retail app template.',
    permissions: ['module:read', 'user:read'],
    capabilities: ['catalog', 'products', 'inventory'],
    appId: STORE_APP_ID,
    status: 'enabled',
    active: true,
    admin: {
      title: 'Catalog settings',
      description: 'Controls for the retail product catalog workflow.',
      settings: [
        { key: 'currency', path: 'moduleSettings.catalog.currency', label: 'Currency', type: 'text', defaultValue: 'EUR', description: 'Default currency for product listing and pricing.' },
        { key: 'inventoryWarning', path: 'moduleSettings.catalog.inventoryWarning', label: 'Low stock threshold', type: 'number', defaultValue: 5, min: 0, step: 1, description: 'Flag products as low inventory when stock reaches this value.' }
      ]
    },
    init() {
      this.status = 'installed';
      this.active = true;
      return this;
    },
    install() { this.status = 'installed'; return this; },
    enable() { this.status = 'enabled'; this.active = true; return this; },
    disable() { this.status = 'disabled'; this.active = false; return this; },
    renderUserInterface(container) {
      const products = getProducts();
      const lowStock = products.filter((item) => Number(item.stock || 0) <= 5).length;

      if (!container) {
        return null;
      }

      container.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Catalog</h3>
              <div class="small-muted">Product inventory and pricing overview</div>
            </div>
          </div>
          <div class="content-wrap">
            <div class="grid">
              <div class="metric">
                <span class="metric-label">Products</span>
                <div class="metric-value">${escapeHtml(String(products.length))}</div>
              </div>
              <div class="metric">
                <span class="metric-label">Low stock</span>
                <div class="metric-value">${escapeHtml(String(lowStock))}</div>
              </div>
            </div>

            <form id="catalogProductForm" class="form-grid" style="margin-top: 18px;">
              <div class="form-field">
                <label for="catalogName">Product name</label>
                <input id="catalogName" name="name" type="text" required />
              </div>
              <div class="form-field">
                <label for="catalogSku">SKU</label>
                <input id="catalogSku" name="sku" type="text" required />
              </div>
              <div class="form-field">
                <label for="catalogCategory">Category</label>
                <input id="catalogCategory" name="category" type="text" required />
              </div>
              <div class="form-field">
                <label for="catalogPrice">Price</label>
                <input id="catalogPrice" name="price" type="number" min="0" step="0.01" required />
              </div>
              <div class="form-field">
                <label for="catalogStock">Stock</label>
                <input id="catalogStock" name="stock" type="number" min="0" step="1" required />
              </div>
              <div class="form-field">
                <label for="catalogActive">Active</label>
                <select id="catalogActive" name="active">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div style="grid-column: 1 / -1;">
                <button type="submit" class="primary">Save product</button>
              </div>
            </form>
            <div id="catalogStatus" class="message info" style="margin-top: 16px;">Catalog ready for data entry.</div>

            <div style="margin-top: 24px;">
              <h4>Current products</h4>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${products.length ? products.map((product) => `
                      <tr>
                        <td>${escapeHtml(product.name || '—')}</td>
                        <td>${escapeHtml(product.sku || '—')}</td>
                        <td>${escapeHtml(product.category || '—')}</td>
                        <td>${escapeHtml(String(product.price ?? 0))}</td>
                        <td>${escapeHtml(String(product.stock ?? 0))}</td>
                        <td>${escapeHtml(product.active === false ? 'Inactive' : 'Active')}</td>
                      </tr>
                    `).join('') : '<tr><td colspan="6">No products exist yet.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      const form = container.querySelector('#catalogProductForm');
      const status = container.querySelector('#catalogStatus');
      if (form) {
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          if (!status) return;

          const formData = new FormData(form);
          const payload = {
            name: String(formData.get('name') || '').trim(),
            sku: String(formData.get('sku') || '').trim(),
            category: String(formData.get('category') || '').trim(),
            price: Number(formData.get('price')) || 0,
            stock: Number(formData.get('stock')) || 0,
            active: String(formData.get('active') || 'true') === 'true'
          };

          const result = createProduct(payload);
          status.textContent = result && result.ok ? result.message : (result && result.message) || 'Unable to save product.';
          status.className = result && result.ok ? 'message success' : 'message error';

          if (result && result.ok) {
            form.reset();
            setTimeout(() => this.renderUserInterface(container), 100);
          }
        });
      }

      return container;
    }
  };

  if (typeof window !== 'undefined') {
    window.CatalogModule = CatalogModule;
    if (Array.isArray(window.FrameworkModuleCatalog) && !window.FrameworkModuleCatalog.some((entry) => entry && entry.id === CatalogModule.id)) {
      window.FrameworkModuleCatalog.push({
        id: CatalogModule.id,
        name: CatalogModule.name,
        version: CatalogModule.version,
        description: CatalogModule.description,
        permissions: CatalogModule.permissions,
        capabilities: CatalogModule.capabilities,
        source: 'app/modules/catalog/index.js',
        entry: 'index.js',
        appId: CatalogModule.appId,
        globalName: 'CatalogModule'
      });
    }
  }
})();
