(() => {
  'use strict';

  const STORE_APP_ID = 'retail-demo';
  const STORE_TEMPLATE_ID = 'retail-store';
  const ENTITY_ID = 'orders';

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
          config: { mode: 'local', defaultView: 'orders' }
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

  const getOrders = () => {
    const runtime = ensureRuntime();
    if (!runtime || typeof runtime.listEntityRecords !== 'function') {
      return [];
    }
    return runtime.listEntityRecords(STORE_APP_ID, ENTITY_ID);
  };

  const createOrder = (payload) => {
    const runtime = ensureRuntime();
    if (!runtime || typeof runtime.createEntityRecord !== 'function') {
      return { ok: false, message: 'Order engine is unavailable.' };
    }

    try {
      const record = runtime.createEntityRecord(STORE_APP_ID, ENTITY_ID, payload);
      return { ok: true, data: record, message: 'Order created.' };
    } catch (error) {
      return { ok: false, message: error && error.message ? error.message : 'Unable to create order.' };
    }
  };

  const getProducts = () => {
    const runtime = ensureRuntime();
    if (!runtime || typeof runtime.listEntityRecords !== 'function') {
      return [];
    }
    return runtime.listEntityRecords(STORE_APP_ID, 'products');
  };

  const OrdersModule = {
    id: 'orders',
    name: 'Orders',
    displayName: 'Orders',
    version: '1.0.0',
    description: 'Order management module for a retail app template.',
    permissions: ['module:read', 'user:write'],
    capabilities: ['orders', 'fulfillment', 'sales'],
    appId: STORE_APP_ID,
    status: 'enabled',
    active: true,
    admin: {
      title: 'Orders settings',
      description: 'Controls for order processing and fulfillment workflow.',
      settings: [
        { key: 'defaultStatus', path: 'moduleSettings.orders.defaultStatus', label: 'Default order status', type: 'text', defaultValue: 'pending', description: 'Default status for newly created orders.' }
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
      const orders = getOrders();
      const products = getProducts();
      const productOptions = products.length
        ? products.map((product) => `<option value="${escapeHtml(product.name || '')}">${escapeHtml(product.name || 'Product')}</option>`).join('')
        : '<option value="">No products available</option>';

      if (!container) {
        return null;
      }

      container.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Orders</h3>
              <div class="small-muted">Create and review store orders</div>
            </div>
          </div>
          <div class="content-wrap">
            <form id="orderForm" class="form-grid">
              <div class="form-field">
                <label for="orderCustomerId">Customer ID</label>
                <input id="orderCustomerId" name="customerId" type="text" required />
              </div>
              <div class="form-field">
                <label for="orderProduct">Product</label>
                <select id="orderProduct" name="product">
                  ${productOptions}
                </select>
              </div>
              <div class="form-field">
                <label for="orderStatus">Status</label>
                <select id="orderStatus" name="status">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div class="form-field">
                <label for="orderTotal">Total</label>
                <input id="orderTotal" name="total" type="number" min="0" step="0.01" required />
              </div>
              <div style="grid-column: 1 / -1;">
                <button type="submit" class="primary">Create order</button>
              </div>
            </form>
            <div id="orderStatus" class="message info" style="margin-top: 16px;">Ready to create orders.</div>

            <div style="margin-top: 24px;">
              <h4>Recent orders</h4>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orders.length ? orders.map((order) => `
                      <tr>
                        <td>${escapeHtml(order.customerId || '—')}</td>
                        <td>${escapeHtml(order.product || '—')}</td>
                        <td>${escapeHtml(order.status || 'pending')}</td>
                        <td>${escapeHtml(String(order.total ?? 0))}</td>
                      </tr>
                    `).join('') : '<tr><td colspan="4">No orders created yet.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      const form = container.querySelector('#orderForm');
      const status = container.querySelector('#orderStatus');
      if (form) {
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          if (!status) return;

          const formData = new FormData(form);
          const payload = {
            customerId: String(formData.get('customerId') || '').trim(),
            product: String(formData.get('product') || '').trim(),
            status: String(formData.get('status') || 'pending').trim(),
            total: Number(formData.get('total')) || 0
          };

          const result = createOrder(payload);
          status.textContent = result && result.ok ? result.message : (result && result.message) || 'Unable to create order.';
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
    window.OrdersModule = OrdersModule;
    if (Array.isArray(window.FrameworkModuleCatalog) && !window.FrameworkModuleCatalog.some((entry) => entry && entry.id === OrdersModule.id)) {
      window.FrameworkModuleCatalog.push({
        id: OrdersModule.id,
        name: OrdersModule.name,
        version: OrdersModule.version,
        description: OrdersModule.description,
        permissions: OrdersModule.permissions,
        capabilities: OrdersModule.capabilities,
        source: 'app/modules/orders/index.js',
        entry: 'index.js',
        appId: OrdersModule.appId,
        globalName: 'OrdersModule'
      });
    }
  }
})();
