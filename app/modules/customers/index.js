(() => {
  'use strict';

  const STORE_APP_ID = 'retail-demo';
  const STORE_TEMPLATE_ID = 'retail-store';
  const ENTITY_ID = 'customers';

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
          config: { mode: 'local', defaultView: 'customers' }
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

  const getCustomers = () => {
    const runtime = ensureRuntime();
    if (!runtime || typeof runtime.listEntityRecords !== 'function') {
      return [];
    }
    return runtime.listEntityRecords(STORE_APP_ID, ENTITY_ID);
  };

  const createCustomer = (payload) => {
    const runtime = ensureRuntime();
    if (!runtime || typeof runtime.createEntityRecord !== 'function') {
      return { ok: false, message: 'Customer engine is unavailable.' };
    }

    try {
      const record = runtime.createEntityRecord(STORE_APP_ID, ENTITY_ID, payload);
      return { ok: true, data: record, message: 'Customer saved.' };
    } catch (error) {
      return { ok: false, message: error && error.message ? error.message : 'Unable to save customer.' };
    }
  };

  const CustomersModule = {
    id: 'customers',
    name: 'Customers',
    displayName: 'Customers',
    version: '1.0.0',
    description: 'Customer management module for a retail app template.',
    permissions: ['module:read', 'user:read'],
    capabilities: ['customers', 'crm', 'retention'],
    appId: STORE_APP_ID,
    status: 'enabled',
    active: true,
    admin: {
      title: 'Customer settings',
      description: 'Controls for customer management and loyalty workflows.',
      settings: [
        { key: 'defaultStatus', path: 'moduleSettings.customers.defaultStatus', label: 'Default status', type: 'text', defaultValue: 'active', description: 'Default customer status for newly created profiles.' }
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
      const customers = getCustomers();
      const activeCustomers = customers.filter((customer) => String(customer.status || 'active').toLowerCase() === 'active').length;

      if (!container) {
        return null;
      }

      container.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Customers</h3>
              <div class="small-muted">Customer profiles and loyalty overview</div>
            </div>
          </div>
          <div class="content-wrap">
            <div class="grid">
              <div class="metric">
                <span class="metric-label">Customers</span>
                <div class="metric-value">${escapeHtml(String(customers.length))}</div>
              </div>
              <div class="metric">
                <span class="metric-label">Active</span>
                <div class="metric-value">${escapeHtml(String(activeCustomers))}</div>
              </div>
            </div>

            <form id="customerForm" class="form-grid" style="margin-top: 18px;">
              <div class="form-field">
                <label for="customerName">Name</label>
                <input id="customerName" name="name" type="text" required />
              </div>
              <div class="form-field">
                <label for="customerEmail">Email</label>
                <input id="customerEmail" name="email" type="email" required />
              </div>
              <div class="form-field">
                <label for="customerStatus">Status</label>
                <select id="customerStatus" name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div class="form-field">
                <label for="customerPoints">Loyalty points</label>
                <input id="customerPoints" name="loyaltyPoints" type="number" min="0" step="1" value="0" />
              </div>
              <div style="grid-column: 1 / -1;">
                <button type="submit" class="primary">Save customer</button>
              </div>
            </form>
            <div id="customerStatus" class="message info" style="margin-top: 16px;">Customer registry ready.</div>

            <div style="margin-top: 24px;">
              <h4>Customer profiles</h4>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${customers.length ? customers.map((customer) => `
                      <tr>
                        <td>${escapeHtml(customer.name || '—')}</td>
                        <td>${escapeHtml(customer.email || '—')}</td>
                        <td>${escapeHtml(customer.status || 'active')}</td>
                        <td>${escapeHtml(String(customer.loyaltyPoints ?? 0))}</td>
                      </tr>
                    `).join('') : '<tr><td colspan="4">No customers created yet.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      const form = container.querySelector('#customerForm');
      const status = container.querySelector('#customerStatus');
      if (form) {
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          if (!status) return;

          const formData = new FormData(form);
          const payload = {
            name: String(formData.get('name') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            status: String(formData.get('status') || 'active').trim(),
            loyaltyPoints: Number(formData.get('loyaltyPoints')) || 0
          };

          const result = createCustomer(payload);
          status.textContent = result && result.ok ? result.message : (result && result.message) || 'Unable to save customer.';
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
    window.CustomersModule = CustomersModule;
    if (Array.isArray(window.FrameworkModuleCatalog) && !window.FrameworkModuleCatalog.some((entry) => entry && entry.id === CustomersModule.id)) {
      window.FrameworkModuleCatalog.push({
        id: CustomersModule.id,
        name: CustomersModule.name,
        version: CustomersModule.version,
        description: CustomersModule.description,
        permissions: CustomersModule.permissions,
        capabilities: CustomersModule.capabilities,
        source: 'app/modules/customers/index.js',
        entry: 'index.js',
        appId: CustomersModule.appId,
        globalName: 'CustomersModule'
      });
    }
  }
})();
