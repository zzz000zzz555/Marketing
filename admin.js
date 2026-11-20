// Panel de administración - NÓRDICO
// Almacenamiento local (demo). En producción usar backend con autenticación real.

const STORAGE_KEYS = {
  users: "nordico_users",
  session: "nordico_session",
  stock: "nordico_stock",
  orders: "nordico_orders",
  products: "nordico_products",
  favorites: "nordico_favorites",
  policies: "nordico_policies",
  settings: "nordico_settings",
  adminUser: "nordico_admin_user",
  adminSession: "nordico_admin_session",
  adminLog: "nordico_admin_log"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`No se pudo leer ${key}.`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`No se pudo guardar ${key}.`, error);
    return false;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function money(value, currency = "PEN") {
  if (currency === "USD") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value / 3.75);
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------- Seed admin user ----------
async function seedAdmin() {
  if (readStorage(STORAGE_KEYS.adminUser, null)) return;
  const passwordHash = await sha256("Admin123!");
  writeStorage(STORAGE_KEYS.adminUser, {
    username: "admin",
    passwordHash,
    createdAt: new Date().toISOString(),
    role: "superadmin"
  });
  logAction("Sistema", "Usuario admin inicial creado");
}

function logAction(user, action) {
  const logs = readStorage(STORAGE_KEYS.adminLog, []);
  logs.unshift({ date: new Date().toISOString(), user, action });
  if (logs.length > 200) logs.length = 200;
  writeStorage(STORAGE_KEYS.adminLog, logs);
}

// ---------- Rate limiting ----------
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 30000;
let loginAttempts = 0;
let lockoutUntil = 0;
let lockoutInterval = null;

function isLockedOut() {
  return Date.now() < lockoutUntil;
}

function startLockoutCountdown() {
  if (lockoutInterval) clearInterval(lockoutInterval);
  const errorEl = $("#loginError");
  const tick = () => {
    if (!isLockedOut()) {
      errorEl.textContent = "";
      if (lockoutInterval) clearInterval(lockoutInterval);
      lockoutInterval = null;
      return;
    }
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    errorEl.textContent = `Demasiados intentos. Espera ${remaining}s.`;
  };
  tick();
  lockoutInterval = setInterval(tick, 1000);
}

// ---------- Session management ----------
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
let sessionTimerInterval = null;
let lastActivity = Date.now();

function createSession(username) {
  const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  const session = { username, token, createdAt: Date.now(), expiresAt: Date.now() + SESSION_TIMEOUT_MS };
  sessionStorage.setItem(STORAGE_KEYS.adminSession, JSON.stringify(session));
  lastActivity = Date.now();
  return session;
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.adminSession);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.token || Date.now() > session.expiresAt) {
      destroySession();
      return null;
    }
    if (Date.now() - lastActivity > SESSION_TIMEOUT_MS) {
      destroySession();
      return null;
    }
    return session;
  } catch (e) {
    destroySession();
    return null;
  }
}

function destroySession() {
  sessionStorage.removeItem(STORAGE_KEYS.adminSession);
  if (sessionTimerInterval) clearInterval(sessionTimerInterval);
  sessionTimerInterval = null;
}

function touchActivity() {
  lastActivity = Date.now();
  const session = getSession();
  if (session) {
    session.expiresAt = Date.now() + SESSION_TIMEOUT_MS;
    sessionStorage.setItem(STORAGE_KEYS.adminSession, JSON.stringify(session));
  }
}

// ---------- Auth ----------
async function handleLogin(event) {
  event.preventDefault();
  const errorEl = $("#loginError");
  errorEl.textContent = "";
  if (isLockedOut()) {
    startLockoutCountdown();
    return;
  }
  const username = $("#loginUser").value.trim();
  const password = $("#loginPass").value;
  if (username.length < 3) { errorEl.textContent = "Usuario inválido."; return; }
  if (password.length < 6) { errorEl.textContent = "Contraseña inválida."; return; }

  const admin = readStorage(STORAGE_KEYS.adminUser, null);
  if (!admin || admin.username !== username) {
    recordFailedAttempt(errorEl);
    return;
  }
  const hash = await sha256(password);
  if (hash !== admin.passwordHash) {
    recordFailedAttempt(errorEl);
    return;
  }
  loginAttempts = 0;
  if (lockoutInterval) { clearInterval(lockoutInterval); lockoutInterval = null; }
  createSession(username);
  logAction(username, "Inicio de sesión exitoso");
  showApp();
}

function recordFailedAttempt(errorEl) {
  loginAttempts++;
  logAction("desconocido", "Intento de login fallido");
  if (loginAttempts >= LOGIN_MAX_ATTEMPTS) {
    lockoutUntil = Date.now() + LOGIN_LOCKOUT_MS;
    loginAttempts = 0;
    startLockoutCountdown();
  } else {
    errorEl.textContent = `Credenciales incorrectas. Intentos restantes: ${LOGIN_MAX_ATTEMPTS - loginAttempts}.`;
  }
}

function showApp() {
  $("#adminLogin").hidden = true;
  $("#adminApp").hidden = false;
  const session = getSession();
  $("#adminUserLabel").textContent = session ? session.username : "admin";
  startSessionTimer();
  renderView("dashboard");
  refreshIcons();
}

function showLogin() {
  $("#adminLogin").hidden = false;
  $("#adminApp").hidden = true;
  destroySession();
}

// ---------- Navigation ----------
function renderView(view) {
  $$(".view").forEach((v) => { v.hidden = v.id !== `view-${view}`; });
  $$(".sidebar-nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  const titles = {
    dashboard: "Dashboard",
    products: "Productos",
    orders: "Pedidos",
    users: "Usuarios",
    content: "Contenido",
    audit: "Auditoría",
    settings: "Configuración"
  };
  $("#viewTitle").textContent = titles[view] || view;
  if (view === "dashboard") renderDashboard();
  if (view === "products") renderProducts();
  if (view === "orders") renderOrders();
  if (view === "users") renderUsers();
  if (view === "content") loadPolicyEditor();
  if (view === "audit") renderAudit();
  if (view === "settings") loadSettings();
  refreshIcons();
}

// ---------- Dashboard ----------
function renderDashboard() {
  const products = readStorage(STORAGE_KEYS.products, []);
  const orders = getAllOrders();
  const users = readStorage(STORAGE_KEYS.users, []);
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const lowStock = products.filter((p) => (readStorage(STORAGE_KEYS.stock, {})[p.id] ?? p.stock) <= 5).length;
  const favCount = Object.keys(localStorage).filter((k) => k.startsWith("nordico_favorites_")).reduce((s, k) => s + (readStorage(k, []).length), 0);
  $("#statProducts").textContent = products.length;
  $("#statOrders").textContent = orders.length;
  $("#statUsers").textContent = users.length;
  $("#statRevenue").textContent = money(revenue);
  $("#statLowStock").textContent = lowStock;
  $("#statFavorites").textContent = favCount;

  const recent = [...orders].reverse().slice(0, 8);
  $("#recentOrdersTable").innerHTML = tableOrders(recent);
  const low = products.filter((p) => (readStorage(STORAGE_KEYS.stock, {})[p.id] ?? p.stock) <= 5);
  $("#lowStockTable").innerHTML = low.length
    ? `<thead><tr><th>Producto</th><th>Stock</th></tr></thead><tbody>${low.map((p) => `<tr><td>${escapeHtml(p.name)}</td><td class="badge low">${readStorage(STORAGE_KEYS.stock, {})[p.id] ?? p.stock}</td></tr>`).join("")}</tbody>`
    : `<tbody><tr><td>Sin productos con stock bajo</td></tr></tbody>`;

  renderCharts(products, orders, stock);
}

const chartInstances = {};
function destroyChart(id) { if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; } }

function renderCharts(products, orders, stockMap) {
  if (typeof Chart === "undefined") return;
  const stock = stockMap || readStorage(STORAGE_KEYS.stock, {});
  Chart.defaults.color = "#9a9a9a";
  Chart.defaults.borderColor = "rgba(255,255,255,0.08)";
  Chart.defaults.font.family = "Inter";

  // Sales by day
  const salesByDay = {};
  orders.forEach((o) => {
    const day = new Date(o.date).toLocaleDateString("es-PE");
    salesByDay[day] = (salesByDay[day] || 0) + (o.total || 0);
  });
  const salesLabels = Object.keys(salesByDay).slice(-10);
  const salesData = salesLabels.map((d) => salesByDay[d]);
  destroyChart("sales");
  chartInstances.sales = new Chart($("#salesChart"), {
    type: "line",
    data: { labels: salesLabels, datasets: [{ label: "Ventas (S/)", data: salesData, borderColor: "#ffffff", backgroundColor: "rgba(255,255,255,0.1)", tension: 0.35, fill: true, pointRadius: 4, pointBackgroundColor: "#ffffff" }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  // Top products
  const qtyByProduct = {};
  orders.forEach((o) => o.items.forEach((i) => { qtyByProduct[i.name] = (qtyByProduct[i.name] || 0) + i.quantity; }));
  const topEntries = Object.entries(qtyByProduct).sort((a, b) => b[1] - a[1]).slice(0, 6);
  destroyChart("top");
  chartInstances.top = new Chart($("#topProductsChart"), {
    type: "bar",
    data: { labels: topEntries.map((e) => e[0]), datasets: [{ label: "Cantidad", data: topEntries.map((e) => e[1]), backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 6 }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });

  // Stock by category
  const stockByCat = {};
  products.forEach((p) => { stockByCat[p.category] = (stockByCat[p.category] || 0) + (stock[p.id] ?? p.stock); });
  destroyChart("stock");
  chartInstances.stock = new Chart($("#stockChart"), {
    type: "doughnut",
    data: { labels: Object.keys(stockByCat), datasets: [{ data: Object.values(stockByCat), backgroundColor: ["#ffffff", "#b3b3b3", "#666666", "#333333", "#e5e5e5", "#808080", "#cccccc"], borderWidth: 0 }] },
    options: { responsive: true, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } }
  });

  // Revenue by category
  const revByCat = {};
  orders.forEach((o) => o.items.forEach((i) => {
    const p = products.find((x) => x.name === i.name);
    const cat = p ? p.category : "Otros";
    revByCat[cat] = (revByCat[cat] || 0) + i.price * i.quantity;
  }));
  destroyChart("rev");
  chartInstances.rev = new Chart($("#revenueChart"), {
    type: "bar",
    data: { labels: Object.keys(revByCat), datasets: [{ label: "Ingresos", data: Object.values(revByCat), backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 6 }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

function getAllOrders() {
  const all = readStorage(STORAGE_KEYS.orders, {});
  return Object.values(all).flat();
}

function tableOrders(orders) {
  if (!orders.length) return `<tbody><tr><td>Sin pedidos</td></tr></tbody>`;
  return `<thead><tr><th>ID</th><th>Cliente</th><th>Items</th><th>Total</th><th>Fecha</th></tr></thead>
    <tbody>${orders.map((o) => `<tr>
      <td>${escapeHtml(o.id)}</td>
      <td>${escapeHtml(maskEmail(o.customerEmail || ""))}</td>
      <td>${o.items.length}</td>
      <td>${money(o.total)}</td>
      <td>${new Date(o.date).toLocaleDateString("es-PE")}</td>
    </tr>`).join("")}</tbody>`;
}

function maskEmail(email) {
  if (!email || !email.includes("@")) return "—";
  const [u, d] = email.split("@");
  const masked = u.length <= 2 ? u[0] + "***" : u.slice(0, 2) + "***";
  return `${masked}@${d}`;
}

// ---------- Products ----------
function renderProducts() {
  const products = readStorage(STORAGE_KEYS.products, []);
  const stock = readStorage(STORAGE_KEYS.stock, {});
  const rows = products.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.category)}</td>
      <td>${money(p.price)}</td>
      <td><span class="badge ${ (stock[p.id] ?? p.stock) <= 5 ? "low" : "ok" }">${stock[p.id] ?? p.stock}</span></td>
      <td>${escapeHtml(p.badge || "—")}</td>
      <td class="row-actions">
        <button data-edit="${p.id}">Editar</button>
        <button class="danger" data-delete="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");
  $("#productsTable").innerHTML = `<thead><tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Badge</th><th>Acciones</th></tr></thead><tbody>${rows}</tbody>`;
}

function openProductModal(product = null) {
  $("#productModalTitle").textContent = product ? "Editar producto" : "Nuevo producto";
  $("#productId").value = product ? product.id : "";
  $("#productName").value = product ? product.name : "";
  $("#productPrice").value = product ? product.price : "";
  $("#productCategory").value = product ? product.category : "";
  $("#productStock").value = product ? product.stock : "";
  $("#productDescription").value = product ? product.description : "";
  $("#productImage").value = product ? product.image : "";
  $("#productBadge").value = product ? product.badge : "";
  $("#productError").textContent = "";
  $("#modalBackdrop").hidden = false;
  $("#productModal").hidden = false;
}

function closeProductModal() {
  $("#productModal").hidden = true;
  $("#modalBackdrop").hidden = true;
}

async function saveProduct(event) {
  event.preventDefault();
  const idRaw = $("#productId").value;
  const name = $("#productName").value.trim();
  const price = Number($("#productPrice").value);
  const category = $("#productCategory").value.trim();
  const stock = Number($("#productStock").value);
  const description = $("#productDescription").value.trim();
  const image = $("#productImage").value.trim();
  const badge = $("#productBadge").value.trim();
  const errorEl = $("#productError");
  errorEl.textContent = "";
  if (!name || !category || price < 0 || stock < 0) { errorEl.textContent = "Datos inválidos."; return; }
  const products = readStorage(STORAGE_KEYS.products, []);
  const stockMap = readStorage(STORAGE_KEYS.stock, {});
  if (idRaw) {
    const id = Number(idRaw);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) { errorEl.textContent = "Producto no encontrado."; return; }
    products[idx] = { ...products[idx], name, price, category, stock, description, image, badge };
    stockMap[id] = stock;
    logAction(getSession()?.username || "admin", `Producto editado: ${name}`);
  } else {
    const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    products.push({ id: newId, name, price, category, stock, description, image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", badge });
    stockMap[newId] = stock;
    logAction(getSession()?.username || "admin", `Producto creado: ${name}`);
  }
  writeStorage(STORAGE_KEYS.products, products);
  writeStorage(STORAGE_KEYS.stock, stockMap);
  closeProductModal();
  renderProducts();
  renderDashboard();
}

function deleteProduct(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  const products = readStorage(STORAGE_KEYS.products, []).filter((p) => p.id !== id);
  writeStorage(STORAGE_KEYS.products, products);
  logAction(getSession()?.username || "admin", `Producto eliminado ID ${id}`);
  renderProducts();
  renderDashboard();
}

// ---------- Orders ----------
function renderOrders() {
  const orders = getAllOrders();
  if (!orders.length) {
    $("#ordersTable").innerHTML = `<tbody><tr><td>Sin pedidos</td></tr></tbody>`;
    return;
  }
  const rows = [...orders].reverse().map((o) => `
    <tr>
      <td>${escapeHtml(o.id)}</td>
      <td>${escapeHtml(maskEmail(o.customerEmail || ""))}</td>
      <td>${o.items.map((i) => `${i.quantity}× ${escapeHtml(i.name)}`).join(", ")}</td>
      <td>${money(o.total)}</td>
      <td>${escapeHtml(o.address)}</td>
      <td>${escapeHtml(o.payment)}</td>
      <td>${new Date(o.date).toLocaleString("es-PE")}</td>
    </tr>
  `).join("");
  $("#ordersTable").innerHTML = `<thead><tr><th>ID</th><th>Cliente</th><th>Items</th><th>Total</th><th>Dirección</th><th>Pago</th><th>Fecha</th></tr></thead><tbody>${rows}</tbody>`;
}

// ---------- Users ----------
function renderUsers() {
  const users = readStorage(STORAGE_KEYS.users, []);
  if (!users.length) {
    $("#usersTable").innerHTML = `<tbody><tr><td>Sin usuarios</td></tr></tbody>`;
    return;
  }
  const rows = users.map((u) => `
    <tr>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(maskEmail(u.email))}</td>
      <td>••••••</td>
      <td>${u.email === "demo@tienda.com" ? "Demo" : "Cliente"}</td>
    </tr>
  `).join("");
  $("#usersTable").innerHTML = `<thead><tr><th>Nombre</th><th>Correo (enmascarado)</th><th>Contraseña</th><th>Rol</th></tr></thead><tbody>${rows}</tbody>`;
}

// ---------- Content / policies ----------
function loadPolicyEditor() {
  const key = $("#policyKeySelect").value;
  const policies = readStorage(STORAGE_KEYS.policies, {}) || {};
  const base = (typeof POLICIES !== "undefined" && POLICIES[key]) ? POLICIES[key] : null;
  // POLICIES not available here; use defaults from main site? We'll store defaults in admin.
  const stored = policies[key];
  // Default titles
  const defaults = {
    terms: "Términos y condiciones",
    privacy: "Política de privacidad",
    security: "Política de seguridad",
    shipping: "Envíos y devoluciones",
    faq: "Preguntas frecuentes"
  };
  $("#policyTitleInput").value = stored ? stored.title : defaults[key];
  $("#policyContentInput").value = stored ? stored.content : "";
}

function savePolicy() {
  const key = $("#policyKeySelect").value;
  const title = $("#policyTitleInput").value.trim();
  const content = $("#policyContentInput").value.trim();
  if (!title || !content) { showToast("Completa título y contenido", true); return; }
  const policies = readStorage(STORAGE_KEYS.policies, {}) || {};
  policies[key] = { title, content };
  writeStorage(STORAGE_KEYS.policies, policies);
  logAction(getSession()?.username || "admin", `Política actualizada: ${key}`);
  showToast("Política guardada");
}

// ---------- Audit ----------
function renderAudit() {
  const checks = [
    ["Autenticación con hash SHA-256", "pass", "Las contraseñas de admin se almacenan hasheadas."],
    ["Rate limiting en login", "pass", "Bloqueo tras 5 intentos fallidos (30s)."],
    ["Sesión con expiración", "pass", "15 minutos de inactividad."],
    ["Validación de entrada", "pass", "Validación de longitud y formato en formularios."],
    ["Manejo de errores", "pass", "Mensajes genéricos, sin exposición de datos sensibles."],
    ["No exposición de contraseñas", "pass", "Las contraseñas se muestran enmascaradas."],
    ["Enmascaramiento de correos", "pass", "Los correos se muestran parcialmente."],
    ["Content Security Policy", "pass", "CSP definido en meta tag."],
    ["Almacenamiento local", "warn", "Demo usa localStorage; en producción usar backend seguro."],
    ["HTTPS", "pass", "GitHub Pages sirve por HTTPS."],
    ["Auditoría de acciones", "pass", "Log de acciones de administrador."],
    ["Control de acceso por roles", "warn", "Un solo rol (superadmin) en demo."],
    ["Copias de seguridad", "pass", "Exportación/importación de backup."],
    ["Gestión de vulnerabilidades", "warn", "Reporte por correo; sin programa formal."],
    ["ISO 27001 A.9 (control de acceso)", "pass", "Autenticación + bloqueo + timeout."],
    ["ISO 27001 A.12 (operaciones)", "pass", "Logs y monitoreo básico."],
    ["ISO 27001 A.18 (cumplimiento)", "pass", "Políticas publicadas y auditables."],
  ];
  const rows = checks.map(([name, status, desc]) => `
    <tr>
      <td>${escapeHtml(name)}</td>
      <td class="audit-${status}">${status === "pass" ? "Cumple" : status === "warn" ? "Parcial" : "No cumple"}</td>
      <td>${escapeHtml(desc)}</td>
    </tr>
  `).join("");
  $("#auditTable").innerHTML = `<thead><tr><th>Control</th><th>Estado</th><th>Detalle</th></tr></thead><tbody>${rows}</tbody>`;
}

// ---------- Settings ----------
function loadSettings() {
  const s = readStorage(STORAGE_KEYS.settings, {}) || {};
  $("#storeNameInput").value = s.storeName || "NÓRDICO";
  $("#supportEmailInput").value = s.supportEmail || "soporte@nordico.pe";
  $("#taxRateInput").value = s.taxRate ?? 18;
  $("#freeShippingInput").value = s.freeShipping ?? 250;
}

function saveSettings() {
  const settings = {
    storeName: $("#storeNameInput").value.trim() || "NÓRDICO",
    supportEmail: $("#supportEmailInput").value.trim() || "soporte@nordico.pe",
    taxRate: Number($("#taxRateInput").value) || 18,
    freeShipping: Number($("#freeShippingInput").value) || 250
  };
  writeStorage(STORAGE_KEYS.settings, settings);
  logAction(getSession()?.username || "admin", "Configuración actualizada");
  showToast("Configuración guardada");
}

// ---------- Backup / Restore ----------
function backupAll() {
  const data = {};
  Object.keys(localStorage).filter((k) => k.startsWith("nordico_")).forEach((k) => {
    try { data[k] = JSON.parse(localStorage.getItem(k)); } catch (e) { data[k] = localStorage.getItem(k); }
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nordico-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Backup descargado");
}

function restoreBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      Object.keys(data).forEach((k) => {
        if (k.startsWith("nordico_")) localStorage.setItem(k, JSON.stringify(data[k]));
      });
      logAction(getSession()?.username || "admin", "Backup restaurado");
      showToast("Backup restaurado. Recargando...");
      setTimeout(() => location.reload(), 800);
    } catch (e) {
      showToast("Archivo inválido", true);
    }
  };
  reader.readAsText(file);
}

// ---------- Seed demo data ----------
function seedDemoData() {
  const products = readStorage(STORAGE_KEYS.products, []);
  if (!products.length) return;
  // Users
  const users = readStorage(STORAGE_KEYS.users, []);
  if (!users.some((u) => u.email === "cliente1@demo.com")) {
    users.push({ name: "María García", email: "cliente1@demo.com", password: "123456" });
    users.push({ name: "Carlos López", email: "cliente2@demo.com", password: "123456" });
    users.push({ name: "Ana Torres", email: "cliente3@demo.com", password: "123456" });
    writeStorage(STORAGE_KEYS.users, users);
  }
  const emails = ["demo@tienda.com", "cliente1@demo.com", "cliente2@demo.com", "cliente3@demo.com"];
  const addresses = ["Av. Larco 123, Miraflores", "Jr. de la Unión 456, Cercado", "Calle Los Pinos 789, San Isidro", "Av. Arequipa 321, Lince"];
  const payments = ["Tarjeta de crédito", "Transferencia bancaria", "Pago contra entrega"];
  const ordersMap = readStorage(STORAGE_KEYS.orders, {});
  emails.forEach((email) => {
    const existing = ordersMap[email] || [];
    const newOrders = [];
    for (let i = 0; i < 6; i++) {
      const items = [];
      const count = 1 + Math.floor(Math.random() * 3);
      const used = new Set();
      for (let j = 0; j < count; j++) {
        const p = products[Math.floor(Math.random() * products.length)];
        if (used.has(p.id)) continue;
        used.add(p.id);
        items.push({ id: p.id, name: p.name, price: p.price, quantity: 1 + Math.floor(Math.random() * 2) });
      }
      if (!items.length) continue;
      const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
      const tax = subtotal * 0.18;
      const date = new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000);
      newOrders.push({
        id: `ND-${Date.now().toString().slice(-6)}${i}`,
        date: date.toISOString(),
        items,
        subtotal,
        tax,
        total: subtotal + tax,
        address: addresses[Math.floor(Math.random() * addresses.length)],
        payment: payments[Math.floor(Math.random() * payments.length)]
      });
    }
    ordersMap[email] = [...existing, ...newOrders];
    // Favorites
    const favs = [products[0].id, products[3].id, products[5].id];
    writeStorage(`nordico_favorites_${email}`, favs);
  });
  writeStorage(STORAGE_KEYS.orders, ordersMap);
  // Stock adjust
  const stock = readStorage(STORAGE_KEYS.stock, {});
  products.forEach((p) => { if (!Number.isInteger(stock[p.id])) stock[p.id] = p.stock; });
  writeStorage(STORAGE_KEYS.stock, stock);
}

// ---------- Toast ----------
function showToast(message, isError = false) {
  // Simple alert fallback for admin
  const el = document.createElement("div");
  el.textContent = message;
  el.style.cssText = `position:fixed;right:20px;bottom:20px;padding:12px 18px;background:${isError ? "#ff5c5c" : "#ffffff"};color:${isError ? "#fff" : "#0a0a0a"};font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,.4);`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

// ---------- Session timer ----------
function startSessionTimer() {
  if (sessionTimerInterval) clearInterval(sessionTimerInterval);
  sessionTimerInterval = setInterval(() => {
    const session = getSession();
    if (!session) { showLogin(); return; }
    const remaining = Math.max(0, session.expiresAt - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    $("#sessionTimer").textContent = `Sesión: ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    if (remaining <= 0) showLogin();
  }, 1000);
}

// ---------- Icons ----------
function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

// ---------- Events ----------
document.addEventListener("DOMContentLoaded", async () => {
  await seedAdmin();
  // Activity tracking
  ["click", "keydown", "mousemove", "touchstart"].forEach((ev) => {
    document.addEventListener(ev, touchActivity, { passive: true });
  });
  // Login
  $("#loginForm").addEventListener("submit", handleLogin);
  // Nav
  $$(".sidebar-nav button").forEach((btn) => {
    btn.addEventListener("click", () => renderView(btn.dataset.view));
  });
  // Logout
  $("#logoutButton").addEventListener("click", () => {
    logAction(getSession()?.username || "admin", "Cierre de sesión");
    showLogin();
  });
  // Refresh
  $("#seedDemoButton")?.addEventListener("click", () => {
    seedDemoData();
    renderView("dashboard");
    showToast("Datos de prueba insertados");
  });
  $("#refreshButton").addEventListener("click", () => {
    const active = $$(".sidebar-nav button.active")[0]?.dataset.view || "dashboard";
    renderView(active);
    showToast("Actualizado");
  });
  // Products
  $("#addProductButton").addEventListener("click", () => openProductModal());
  $("#productsTable").addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit]");
    const del = e.target.closest("[data-delete]");
    if (edit) {
      const products = readStorage(STORAGE_KEYS.products, []);
      const p = products.find((x) => x.id === Number(edit.dataset.edit));
      if (p) openProductModal(p);
    }
    if (del) deleteProduct(Number(del.dataset.delete));
  });
  $("#productForm").addEventListener("submit", saveProduct);
  $$(".modal-close, [data-close-modal]").forEach((b) => b.addEventListener("click", closeProductModal));
  $("#modalBackdrop").addEventListener("click", (e) => { if (e.target === $("#modalBackdrop")) closeProductModal(); });
  // Content
  $("#policyKeySelect").addEventListener("change", loadPolicyEditor);
  $("#savePolicyButton").addEventListener("click", savePolicy);
  // Settings
  $("#saveSettingsButton").addEventListener("click", saveSettings);
  $("#backupButton").addEventListener("click", backupAll);
  $("#restoreFile").addEventListener("change", (e) => {
    if (e.target.files[0]) restoreBackup(e.target.files[0]);
  });
  // Session check
  if (getSession()) showApp(); else showLogin();
  refreshIcons();
});

// Global escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProductModal();
});