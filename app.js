// Tienda de demostración: los datos se guardan únicamente en el navegador.
const STORAGE_KEYS = {
  users: "nordico_users",
  session: "nordico_session",
  stock: "nordico_stock",
  orders: "nordico_orders"
};
const TAX_RATE = 0.18;

const products = [
  { id: 1, name: "Auriculares Studio", price: 189, category: "Tecnología", stock: 8, description: "Sonido envolvente, diseño cómodo.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", badge: "Más vendido" },
  { id: 2, name: "Lámpara de mesa Alba", price: 249, category: "Hogar", stock: 5, description: "Luz cálida para tus momentos.", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", badge: "Favorito" },
  { id: 3, name: "Mochila Urban", price: 159, category: "Accesorios", stock: 12, description: "Lista para acompañarte a todas partes.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 4, name: "Botella térmica Terra", price: 79, category: "Hogar", stock: 20, description: "Tu bebida, a la temperatura perfecta.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80", badge: "Esencial" },
  { id: 5, name: "Reloj Minimal", price: 329, category: "Accesorios", stock: 4, description: "Precisión y elegancia sin esfuerzo.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 6, name: "Cámara instantánea", price: 419, category: "Tecnología", stock: 6, description: "Guarda lo que no quieres olvidar.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", badge: "Nuevo" },
  { id: 7, name: "Taza de cerámica", price: 49, category: "Hogar", stock: 18, description: "Un pequeño ritual cada mañana.", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 8, name: "Parlante portátil", price: 139, category: "Tecnología", stock: 9, description: "Música para llevar a cualquier lugar.", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80", badge: "Favorito" },
  { id: 9, name: "Lentes Sol", price: 119, category: "Accesorios", stock: 10, description: "Protección UV y estilo atemporal.", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 10, name: "Teclado inalámbrico", price: 199, category: "Tecnología", stock: 7, description: "Escribe mejor. Trabaja más cómodo.", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", badge: "Nuevo" },
  { id: 11, name: "Cojín de lino", price: 89, category: "Hogar", stock: 14, description: "Textura natural para bajar el ritmo.", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 12, name: "Audífonos inalámbricos", price: 279, category: "Tecnología", stock: 3, description: "Tu espacio, tu música, sin cables.", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80", badge: "Últimas unidades" },
  { id: 13, name: "Zapatillas Runner", price: 219, category: "Deportes", stock: 7, description: "Ligeras para tus mejores marcas.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", badge: "Nuevo" },
  { id: 14, name: "Camiseta deportiva", price: 69, category: "Deportes", stock: 15, description: "Fresca y cómoda para entrenar.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 15, name: "Chaqueta Denim", price: 189, category: "Moda", stock: 6, description: "Un clásico que nunca pasa de moda.", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80", badge: "Favorito" },
  { id: 16, name: "Bolso tote lona", price: 99, category: "Moda", stock: 10, description: "Espacio para todo tu día.", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 17, name: "Set skincare", price: 129, category: "Belleza", stock: 8, description: "Rutina completa para tu piel.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", badge: "Esencial" },
  { id: 18, name: "Perfume cítrico", price: 159, category: "Belleza", stock: 5, description: "Frescura que dura todo el día.", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 19, name: "Smartwatch Pulse", price: 349, category: "Tecnología", stock: 6, description: "Tu salud en la muñeca.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", badge: "Nuevo" },
  { id: 20, name: "Tablet Air", price: 899, category: "Tecnología", stock: 4, description: "Ligera y potente para todo.", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 21, name: "Silla ergonómica", price: 459, category: "Hogar", stock: 3, description: "Comodidad para largas jornadas.", image: "https://images.unsplash.com/photo-1505843490701-5be5b4c14687?auto=format&fit=crop&w=800&q=80", badge: "Favorito" },
  { id: 22, name: "Planta monstera", price: 89, category: "Hogar", stock: 12, description: "Vida y frescura a tus espacios.", image: "https://images.unsplash.com/photo-1459411552804-841c1697209e?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 23, name: "Gorra urbana", price: 59, category: "Moda", stock: 20, description: "Estilo casual para cada día.", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 24, name: "Cinturón de cuero", price: 79, category: "Moda", stock: 9, description: "El detalle que completa tu look.", image: "https://images.unsplash.com/photo-1624222246622-9c5e5f5e5e5e?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 25, name: "Mancuernas 5kg", price: 89, category: "Deportes", stock: 11, description: "Fuerza en casa, sin excusas.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80", badge: "Esencial" },
  { id: 26, name: "Esterilla yoga", price: 69, category: "Deportes", stock: 14, description: "Tu espacio de calma.", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 27, name: "Crema facial", price: 99, category: "Belleza", stock: 7, description: "Hidratación profunda diaria.", image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?auto=format&fit=crop&w=800&q=80", badge: "" },
  { id: 28, name: "Labial mate", price: 49, category: "Belleza", stock: 16, description: "Color que dura horas.", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80", badge: "Nuevo" },
  { id: 29, name: "Cafetera espresso", price: 329, category: "Hogar", stock: 5, description: "Café de barista en casa.", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80", badge: "Favorito" },
  { id: 30, name: "Altavoz inteligente", price: 259, category: "Tecnología", stock: 8, description: "Tu hogar, al comando de voz.", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80", badge: "" }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`No se pudo leer ${key} desde localStorage.`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`No se pudo guardar ${key} en localStorage.`, error);
    showToast("No se pudieron guardar los cambios en este navegador.", "triangle-alert");
  }
}

const seedUsers = () => {
  const users = readStorage(STORAGE_KEYS.users, []);
  if (!users.some((user) => user.email === "demo@tienda.com")) {
    users.push({ name: "Cliente demo", email: "demo@tienda.com", password: "123456" });
    writeStorage(STORAGE_KEYS.users, users);
  }
};

seedUsers();
let currentUser = readStorage(STORAGE_KEYS.session, null);
let inventory = readStorage(STORAGE_KEYS.stock, Object.fromEntries(products.map((product) => [product.id, product.stock])));
let authMode = "login";
let activeCategory = "Todos";
let currentPage = 1;
let totalPages = 1;
const ITEMS_PER_PAGE = 8;
const cartKey = () => `nordico_cart_${currentUser ? currentUser.email : "guest"}`;
let cart = readStorage(cartKey(), {});

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");
const cartDrawer = $("#cartDrawer");
const drawerOverlay = $("#drawerOverlay");
const modalBackdrop = $("#modalBackdrop");
const cartBubble = $("#cartBubble");

function money(value) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function renderCategories() {
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];
  $("#categoryTabs").innerHTML = categories.map((category) => `
    <button class="filter-tab${activeCategory === category ? " active" : ""}" data-category="${escapeHtml(category)}" aria-pressed="${activeCategory === category}">${escapeHtml(category)}</button>
  `).join("");
}

function renderProducts(resetPage = false) {
  if (resetPage) currentPage = 1;
  const search = $("#searchInput").value.trim().toLocaleLowerCase("es");
  const sort = $("#sortSelect").value;
  let visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    return matchesCategory && product.name.toLocaleLowerCase("es").includes(search);
  });
  if (sort === "price-asc") visibleProducts = visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") visibleProducts = visibleProducts.sort((a, b) => b.price - a.price);

  totalPages = Math.max(1, Math.ceil(visibleProducts.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageProducts = visibleProducts.slice(start, start + ITEMS_PER_PAGE);

  if (!visibleProducts.length) {
    productGrid.innerHTML = `<div class="empty-results"><i data-lucide="search-x"></i><h3>No encontramos ese producto.</h3><p>Prueba con otro nombre o cambia los filtros.</p></div>`;
  } else {
    productGrid.innerHTML = pageProducts.map((product) => {
      const stock = getStock(product.id);
      return `<article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
          ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
          <button class="add-button" data-add="${product.id}" aria-label="Agregar ${escapeHtml(product.name)} al carrito" ${stock < 1 ? "disabled" : ""}><i data-lucide="${stock < 1 ? "check" : "plus"}"></i></button>
        </div>
        <div class="product-info">
          <div class="product-meta"><span>${escapeHtml(product.category)}</span><span>${stock > 0 ? `${stock} disponibles` : "Agotado"}</span></div>
          <h3 class="product-name">${escapeHtml(product.name)}</h3>
          <div class="product-bottom"><p class="product-price">${money(product.price)}</p><span class="product-stock">${escapeHtml(product.description)}</span></div>
        </div>
      </article>`;
    }).join("");
  }
  renderPagination(totalPages, visibleProducts.length);
  refreshIcons();
}

function renderPagination(totalPages, totalItems) {
  const pagination = $("#pagination");
  if (totalItems <= ITEMS_PER_PAGE) {
    pagination.innerHTML = "";
    return;
  }
  const pages = [];
  pages.push(`<button type="button" data-page="first" ${currentPage === 1 ? "disabled" : ""} aria-label="Primera página">«</button>`);
  pages.push(`<button type="button" data-page="prev" ${currentPage === 1 ? "disabled" : ""} aria-label="Página anterior">‹</button>`);
  const range = getPageRange(currentPage, totalPages);
  range.forEach((p) => {
    if (p === "...") pages.push(`<button type="button" class="ellipsis" disabled>…</button>`);
    else pages.push(`<button type="button" data-page="${p}" class="${p === currentPage ? "active" : ""}" aria-current="${p === currentPage ? "page" : "false"}">${p}</button>`);
  });
  pages.push(`<button type="button" data-page="next" ${currentPage === totalPages ? "disabled" : ""} aria-label="Página siguiente">›</button>`);
  pages.push(`<button type="button" data-page="last" ${currentPage === totalPages ? "disabled" : ""} aria-label="Última página">»</button>`);
  pagination.innerHTML = pages.join("");
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
    result.push(sorted[i]);
  }
  return result;
}

function getStock(productId) {
  return Number.isInteger(inventory[productId]) ? inventory[productId] : products.find((product) => product.id === productId)?.stock ?? 0;
}

function cartQuantity() {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

function cartSubtotal() {
  return products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
}

function persistCart() {
  writeStorage(cartKey(), cart);
  renderCart();
}

function renderCart() {
  const quantity = cartQuantity();
  const subtotal = cartSubtotal();
  const tax = subtotal * TAX_RATE;
  $("#cartCount").textContent = quantity;
  $("#drawerCount").textContent = `(${quantity})`;
  $("#cartBubbleCount").textContent = quantity;
  cartBubble.classList.toggle("has-items", quantity > 0);
  cartBubble.classList.remove("bump", "count-bump");
  void cartBubble.offsetWidth;
  cartBubble.classList.add("bump", "count-bump");
  $("#subtotalValue").textContent = money(subtotal);
  $("#taxValue").textContent = money(tax);
  $("#totalValue").textContent = money(subtotal + tax);
  $("#checkoutTotal").textContent = money(subtotal + tax);
  $("#checkoutItemCount").textContent = `${quantity} ${quantity === 1 ? "artículo" : "artículos"}`;
  $("#checkoutButton").disabled = quantity === 0;
  $("#clearCartButton").hidden = quantity === 0;

  const items = products.filter((product) => cart[product.id] > 0);
  $("#cartItems").innerHTML = items.length ? items.map((product) => `
    <div class="cart-line">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
      <div class="cart-line-info"><small>${escapeHtml(product.category)}</small><strong>${escapeHtml(product.name)}</strong>
        <div class="quantity-control">
          <button data-quantity="${product.id}" data-change="-1" aria-label="Reducir cantidad de ${escapeHtml(product.name)}">−</button>
          <span>${cart[product.id]}</span>
          <button data-quantity="${product.id}" data-change="1" aria-label="Aumentar cantidad de ${escapeHtml(product.name)}" ${cart[product.id] >= getStock(product.id) ? "disabled" : ""}>+</button>
        </div>
      </div>
      <div class="cart-line-end"><strong>${money(product.price * cart[product.id])}</strong><button class="remove-item" data-remove="${product.id}" aria-label="Eliminar ${escapeHtml(product.name)}"><i data-lucide="trash-2"></i></button></div>
    </div>
  `).join("") : `<div class="cart-empty"><i data-lucide="shopping-basket"></i><h3>Tu bolsa está esperando.</h3><p>Agrega algo que te guste para empezar.</p></div>`;
  refreshIcons();
}

function renderHeader() {
  $("#welcomeLabel").textContent = currentUser ? `Hola, ${currentUser.name}` : "";
  $("#accountLabel").textContent = currentUser ? "Salir" : "Ingresar";
  $("#accountButton").setAttribute("aria-label", currentUser ? "Cerrar sesión" : "Iniciar sesión");
  $("#ordersButton").hidden = !currentUser;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function showToast(message, icon = "circle-check") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i data-lucide="${escapeHtml(icon)}"></i><span>${escapeHtml(message)}</span>`;
  $("#toastRegion").append(toast);
  refreshIcons();
  window.setTimeout(() => {
    toast.classList.add("out");
    window.setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function openDrawer() {
  drawerOverlay.classList.add("open");
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  $("#cartButton").setAttribute("aria-expanded", "true");
  $("#cartDrawer").querySelector("[data-close-drawer]").focus();
}

function closeDrawer() {
  drawerOverlay.classList.remove("open");
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  $("#cartButton").setAttribute("aria-expanded", "false");
}

function openModal(modal) {
  closeDrawer();
  for (const section of modalBackdrop.querySelectorAll(".modal")) section.hidden = section !== modal;
  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => modal.querySelector("input, button, select")?.focus(), 20);
}

function closeModal() {
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  $("#nameField").hidden = !registering;
  $("#authName").required = registering;
  $("#authPassword").autocomplete = registering ? "new-password" : "current-password";
  $("#authTitle").innerHTML = registering ? "Crea tu cuenta<span>.</span>" : "Bienvenido<span>.</span>";
  $("#authIntro").textContent = registering ? "Solo necesitas unos datos para empezar." : "Ingresa a tu cuenta para continuar.";
  $("#authSubmit").innerHTML = `${registering ? "Crear cuenta" : "Iniciar sesión"} <i data-lucide="arrow-right"></i>`;
  $("#authError").textContent = "";
  document.querySelectorAll(".auth-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.authMode === mode));
  refreshIcons();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const quantity = cart[productId] || 0;
  if (quantity >= getStock(productId)) {
    showToast("Alcanzaste el stock disponible.", "triangle-alert");
    return;
  }
  cart[productId] = quantity + 1;
  persistCart();
  flyToCart(productId);
  showToast(`${product.name} se agregó a tu bolsa.`, "shopping-bag");
}

function flyToCart(productId) {
  const button = document.querySelector(`[data-add="${productId}"]`);
  const img = button?.closest(".product-card")?.querySelector("img.product-image");
  const bubble = cartBubble;
  if (!img || !bubble) return;
  const imgRect = img.getBoundingClientRect();
  const bubbleRect = bubble.getBoundingClientRect();
  const clone = img.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = imgRect.left + "px";
  clone.style.top = imgRect.top + "px";
  clone.style.width = imgRect.width + "px";
  clone.style.height = imgRect.height + "px";
  clone.style.objectFit = "cover";
  clone.style.zIndex = "1000";
  clone.style.transition = "all .7s cubic-bezier(.2,.7,.2,1)";
  clone.style.pointerEvents = "none";
  clone.style.border = "1px solid #0a0a0a";
  document.body.appendChild(clone);
  requestAnimationFrame(() => {
    clone.style.left = (bubbleRect.left + bubbleRect.width / 2 - 20) + "px";
    clone.style.top = (bubbleRect.top + bubbleRect.height / 2 - 20) + "px";
    clone.style.width = "40px";
    clone.style.height = "40px";
    clone.style.opacity = "0.2";
    clone.style.transform = "scale(0.3) rotate(25deg)";
  });
  setTimeout(() => clone.remove(), 800);
}

function changeQuantity(productId, change) {
  const next = (cart[productId] || 0) + change;
  if (next <= 0) delete cart[productId];
  else if (next <= getStock(productId)) cart[productId] = next;
  persistCart();
}

function checkout(event) {
  event.preventDefault();
  if (!currentUser) {
    setAuthMode("login");
    openModal($("#authModal"));
    showToast("Inicia sesión para finalizar tu compra.", "user-round");
    return;
  }
  if (!cartQuantity()) return;
  openModal($("#checkoutModal"));
}

function handleAuth(event) {
  event.preventDefault();
  const email = $("#authEmail").value.trim().toLowerCase();
  const password = $("#authPassword").value;
  const users = readStorage(STORAGE_KEYS.users, []);
  let user;

  if (authMode === "register") {
    const name = $("#authName").value.trim();
    if (!name) return showAuthError("Escribe tu nombre.");
    if (password.length < 6) return showAuthError("La contraseña debe tener al menos 6 caracteres.");
    if (users.some((item) => item.email.toLowerCase() === email)) return showAuthError("Ya existe una cuenta con ese correo.");
    user = { name, email, password };
    users.push(user);
    writeStorage(STORAGE_KEYS.users, users);
  } else {
    user = users.find((item) => item.email.toLowerCase() === email && item.password === password);
    if (!user) return showAuthError("Correo o contraseña incorrectos.");
  }

  const oldCartKey = cartKey();
  currentUser = { name: user.name, email: user.email };
  writeStorage(STORAGE_KEYS.session, currentUser);
  cart = readStorage(`nordico_cart_${currentUser.email}`, {});
  if (oldCartKey === "nordico_cart_guest") {
    // Merge the guest basket into the account basket, without exceeding stock.
    for (const [id, count] of Object.entries(readStorage(oldCartKey, {}))) {
      cart[id] = Math.min(getStock(Number(id)), (cart[id] || 0) + count);
    }
    writeStorage(`nordico_cart_${currentUser.email}`, cart);
    writeStorage(oldCartKey, {});
  }
  renderHeader();
  renderCart();
  closeModal();
  showToast(authMode === "register" ? "Tu cuenta está lista. ¡Bienvenido!" : `¡Hola, ${user.name}! Sesión iniciada.`, "circle-check");
}

function showAuthError(message) {
  $("#authError").textContent = message;
}

function submitOrder(event) {
  event.preventDefault();
  if (!currentUser || !cartQuantity()) return;
  const formData = new FormData(event.currentTarget);
  const order = {
    id: `ND-${Date.now().toString().slice(-8)}`,
    date: new Date().toISOString(),
    items: products.filter((product) => cart[product.id] > 0).map((product) => ({
      id: product.id, name: product.name, price: product.price, quantity: cart[product.id]
    })),
    subtotal: cartSubtotal(),
    tax: cartSubtotal() * TAX_RATE,
    total: cartSubtotal() * (1 + TAX_RATE),
    address: String(formData.get("address")).trim(),
    payment: String(formData.get("payment"))
  };
  for (const item of order.items) inventory[item.id] = Math.max(0, getStock(item.id) - item.quantity);
  writeStorage(STORAGE_KEYS.stock, inventory);
  const orders = readStorage(STORAGE_KEYS.orders, {});
  orders[currentUser.email] = [...(orders[currentUser.email] || []), order];
  writeStorage(STORAGE_KEYS.orders, orders);
  cart = {};
  persistCart();
  renderProducts();
  event.currentTarget.reset();
  closeModal();
  closeDrawer();
  showToast(`¡Compra completada! Pedido ${order.id}`, "party-popper");
  showReceipt(order);
}

function showOrders() {
  if (!currentUser) return;
  const orders = readStorage(STORAGE_KEYS.orders, {})[currentUser.email] || [];
  $("#ordersList").innerHTML = orders.length ? [...orders].reverse().map((order) => `
    <article class="order-card">
      <div class="order-head"><strong>Pedido ${escapeHtml(order.id)}</strong><span>${new Date(order.date).toLocaleDateString("es-PE")}</span></div>
      <p>${order.items.map((item) => `${item.quantity} × ${escapeHtml(item.name)}`).join("<br>")}<br>Envío: ${escapeHtml(order.address)}<br>Pago: ${escapeHtml(order.payment)}</p>
      <div class="order-head"><span>Subtotal ${money(order.subtotal)} · Impuestos ${money(order.tax)}</span><strong>${money(order.total)}</strong></div>
      <button class="text-button" data-receipt-id="${escapeHtml(order.id)}" type="button">Ver boleta</button>
    </article>
  `).join("") : `<div class="orders-empty">Todavía no tienes pedidos. Tus próximas compras aparecerán aquí.</div>`;
  openModal($("#ordersModal"));
}

const POLICIES = {
  terms: {
    title: "Términos y condiciones",
    content: `
      <h3>1. Uso del sitio</h3>
      <p>Al acceder a NÓRDICO aceptas estos términos. El sitio es una demostración educativa de carrito de compra sin base de datos.</p>
      <h3>2. Productos y precios</h3>
      <p>Los precios se muestran en soles (PEN) e incluyen los impuestos aplicables. El stock es limitado y se actualiza al confirmar cada pedido.</p>
      <h3>3. Pedidos</h3>
      <p>Un pedido se considera confirmado cuando recibes el número de pedido y la boleta correspondiente. Puedes vaciar tu bolsa en cualquier momento antes de confirmar.</p>
      <h3>4. Devoluciones</h3>
      <p>Aceptamos devoluciones dentro de los 14 días posteriores a la entrega, siempre que el producto esté en su estado original.</p>
    `
  },
  privacy: {
    title: "Política de privacidad",
    content: `
      <h3>Datos que recopilamos</h3>
      <p>Nombre, correo electrónico, dirección de envío y datos del pedido. No almacenamos datos de tarjetas de pago reales.</p>
      <h3>Uso de los datos</h3>
      <p>Usamos tus datos únicamente para procesar pedidos, mostrar tu historial y mejorar la experiencia. No compartimos información con terceros.</p>
      <h3>Almacenamiento</h3>
      <p>Toda la información se guarda localmente en tu navegador (localStorage). Al cerrar sesión tus datos permanecen en este dispositivo.</p>
      <h3>Tus derechos</h3>
      <p>Puedes solicitar la eliminación de tus datos borrando el almacenamiento del navegador o contactándonos.</p>
    `
  },
  security: {
    title: "Seguridad",
    content: `
      <h3>Protección de datos</h3>
      <p>Las contraseñas se almacenan únicamente en el navegador para fines de demostración. No utilices contraseñas reales ni sensibles.</p>
      <h3>Pagos simulados</h3>
      <p>Los métodos de pago son simulados. No se procesan cargos reales ni se transmiten datos bancarios.</p>
      <h3>Buenas prácticas</h3>
      <ul>
        <li>Usa una contraseña única para esta demostración.</li>
        <li>No compartas tu sesión en dispositivos públicos.</li>
        <li>Cierra sesión al terminar.</li>
      </ul>
      <h3>Reporte de problemas</h3>
      <p>Si detectas un comportamiento inusual, contáctanos a través del correo de soporte.</p>
    `
  },
  shipping: {
    title: "Envíos y devoluciones",
    content: `
      <h3>Envíos</h3>
      <p>Enviamos a todo el Perú. Los pedidos se procesan en 1 a 2 días hábiles y la entrega estimada es de 3 a 7 días hábiles.</p>
      <h3>Costos</h3>
      <p>Envío gratis en pedidos mayores a S/ 250. Para pedidos menores se aplica una tarifa calculada al finalizar la compra.</p>
      <h3>Devoluciones</h3>
      <p>Tienes 14 días para devolver un producto. Debe estar sin uso y con su empaque original. El reembolso se procesa en 5 a 10 días hábiles.</p>
      <h3>Cambios</h3>
      <p>Los cambios de talla o color están sujetos a disponibilidad de stock.</p>
    `
  },
  faq: {
    title: "Preguntas frecuentes",
    content: `
      <h3>¿Necesito crear una cuenta?</h3>
      <p>Puedes navegar y agregar productos como invitado. Para finalizar la compra debes iniciar sesión o crear una cuenta.</p>
      <h3>¿Dónde se guardan mis datos?</h3>
      <p>En el navegador, mediante localStorage. No hay base de datos externa.</p>
      <h3>¿Puedo imprimir mi boleta?</h3>
      <p>Sí. Al confirmar la compra se genera una boleta que puedes imprimir o guardar como PDF desde el navegador.</p>
      <h3>¿Los pagos son reales?</h3>
      <p>No. Es una demostración; los pagos son simulados.</p>
      <h3>¿Cómo vacío mi carrito?</h3>
      <p>Usa el botón "Vaciar bolsa" dentro del carrito.</p>
    `
  }
};

function showPolicy(key) {
  const policy = POLICIES[key];
  if (!policy) return;
  $("#policyTitle").innerHTML = `${escapeHtml(policy.title)}<span>.</span>`;
  $("#policyContent").innerHTML = policy.content;
  openModal($("#policyModal"));
  refreshIcons();
}

function receiptHtml(order) {
  const date = new Date(order.date).toLocaleString("es-PE");
  const items = order.items.map((item) => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${item.quantity}</td>
      <td>${money(item.price)}</td>
      <td>${money(item.price * item.quantity)}</td>
    </tr>
  `).join("");
  return `
    <div class="receipt-head"><span>NÓRDICO STUDIO</span><span>RUC 20XXXXXXXXX</span></div>
    <p class="receipt-title">Boleta de venta</p>
    <div class="receipt-head"><span>Pedido ${escapeHtml(order.id)}</span><span>${escapeHtml(date)}</span></div>
    <div class="receipt-head"><span>Cliente: ${escapeHtml(currentUser ? currentUser.name : "Invitado")}</span><span>${escapeHtml(currentUser ? currentUser.email : "")}</span></div>
    <div class="receipt-head"><span>Dirección: ${escapeHtml(order.address)}</span><span>Pago: ${escapeHtml(order.payment)}</span></div>
    <table>
      <thead><tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Total</th></tr></thead>
      <tbody>${items}</tbody>
    </table>
    <div class="receipt-totals">
      <div><span>Subtotal</span><strong>${money(order.subtotal)}</strong></div>
      <div><span>Impuestos (18%)</span><strong>${money(order.tax)}</strong></div>
      <div class="grand"><span>Total</span><strong>${money(order.total)}</strong></div>
    </div>
    <p style="margin-top:12px;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.1em;">Gracias por tu compra. Conserve este comprobante.</p>
  `;
}

function showReceipt(order) {
  $("#receiptContent").innerHTML = receiptHtml(order);
  openModal($("#receiptModal"));
  refreshIcons();
}

function printReceipt() {
  const content = $("#receiptContent").innerHTML;
  const win = window.open("", "_blank", "width=600,height=700");
  if (!win) {
    showToast("Permite ventanas emergentes para imprimir.", "triangle-alert");
    return;
  }
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Boleta</title><style>
    @page { size: 80mm auto; margin: 0; }
    body { font-family: "Courier New", monospace; width: 80mm; margin: 0; padding: 4mm; color: #000; font-size: 11px; line-height: 1.3; }
    .receipt-head { display: flex; justify-content: space-between; margin-bottom: 2mm; font-size: 10px; flex-wrap: wrap; gap: 1mm; }
    .receipt-title { font-size: 13px; font-weight: 700; text-align: center; margin: 0 0 2mm; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin: 2mm 0; }
    th, td { padding: 1mm 0; text-align: left; font-size: 10px; }
    th { border-bottom: 1px dashed #000; }
    .receipt-totals div { display: flex; justify-content: space-between; margin-bottom: 1mm; font-size: 11px; }
    .grand { font-weight: 700; font-size: 12px; border-top: 1px dashed #000; padding-top: 2mm; margin-top: 2mm; }
    .center { text-align: center; }
    hr { border: none; border-top: 1px dashed #000; margin: 2mm 0; }
  </style></head><body>${content}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

$("#categoryTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts(true);
});
productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
$("#searchInput").addEventListener("input", () => renderProducts(true));
$("#sortSelect").addEventListener("change", () => renderProducts(true));
$("#pagination").addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  const page = button.dataset.page;
  if (page === "first") currentPage = 1;
  else if (page === "prev") currentPage = Math.max(1, currentPage - 1);
  else if (page === "next") currentPage = Math.min(totalPages, currentPage + 1);
  else if (page === "last") currentPage = totalPages;
  else currentPage = Number(page);
  renderProducts();
  window.scrollTo({ top: $("#catalogo").offsetTop - 20, behavior: "smooth" });
});
document.querySelectorAll("[data-category-link]").forEach((link) => link.addEventListener("click", () => {
  activeCategory = link.dataset.categoryLink;
  renderCategories();
  renderProducts(true);
}));
$("#cartButton").addEventListener("click", openDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
document.querySelectorAll("[data-close-drawer]").forEach((button) => button.addEventListener("click", closeDrawer));
$("#cartItems").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.change));
  if (removeButton) {
    delete cart[Number(removeButton.dataset.remove)];
    persistCart();
  }
});
$("#clearCartButton").addEventListener("click", () => {
  cart = {};
  persistCart();
  showToast("Tu bolsa quedó vacía.", "trash-2");
});
$("#checkoutButton").addEventListener("click", checkout);
$("#accountButton").addEventListener("click", () => {
  if (currentUser) {
    currentUser = null;
    writeStorage(STORAGE_KEYS.session, null);
    cart = readStorage(cartKey(), {});
    renderHeader();
    renderCart();
    showToast("Has cerrado sesión.", "log-out");
  } else {
    setAuthMode("login");
    openModal($("#authModal"));
  }
});
$("#ordersButton").addEventListener("click", showOrders);

// Carrito flotante (burbuja) arrastrable
let bubbleDragging = false;
let bubbleMoved = false;
let bubbleOffsetX = 0;
let bubbleOffsetY = 0;
let bubbleStartX = 0;
let bubbleStartY = 0;

function clampBubble(x, y) {
  const maxX = Math.max(0, window.innerWidth - cartBubble.offsetWidth);
  const maxY = Math.max(0, window.innerHeight - cartBubble.offsetHeight);
  return { x: Math.max(0, Math.min(maxX, x)), y: Math.max(0, Math.min(maxY, y)) };
}

function setBubblePosition(x, y) {
  const pos = clampBubble(x, y);
  cartBubble.style.left = pos.x + "px";
  cartBubble.style.top = pos.y + "px";
  cartBubble.style.right = "auto";
  cartBubble.style.bottom = "auto";
  try { localStorage.setItem("nordico_bubble_pos", JSON.stringify(pos)); } catch (e) {}
}

try {
  const saved = JSON.parse(localStorage.getItem("nordico_bubble_pos"));
  if (saved) setBubblePosition(saved.x, saved.y);
} catch (e) {}

cartBubble.addEventListener("pointerdown", (event) => {
  bubbleDragging = true;
  bubbleMoved = false;
  const rect = cartBubble.getBoundingClientRect();
  bubbleOffsetX = event.clientX - rect.left;
  bubbleOffsetY = event.clientY - rect.top;
  bubbleStartX = event.clientX;
  bubbleStartY = event.clientY;
  cartBubble.setPointerCapture(event.pointerId);
});

cartBubble.addEventListener("pointermove", (event) => {
  if (!bubbleDragging) return;
  const x = event.clientX - bubbleOffsetX;
  const y = event.clientY - bubbleOffsetY;
  if (Math.abs(event.clientX - bubbleStartX) > 4 || Math.abs(event.clientY - bubbleStartY) > 4) bubbleMoved = true;
  setBubblePosition(x, y);
});

cartBubble.addEventListener("pointerup", (event) => {
  if (!bubbleDragging) return;
  bubbleDragging = false;
  try { cartBubble.releasePointerCapture(event.pointerId); } catch (e) {}
  if (!bubbleMoved) openDrawer();
});

window.addEventListener("resize", () => {
  const rect = cartBubble.getBoundingClientRect();
  setBubblePosition(rect.left, rect.top);
});
document.querySelectorAll("[data-open-policy]").forEach((button) => button.addEventListener("click", () => showPolicy(button.dataset.openPolicy)));
$("#printReceiptButton").addEventListener("click", printReceipt);
$("#closeReceiptButton").addEventListener("click", closeModal);
$("#ordersList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-receipt-id]");
  if (!button) return;
  const orders = readStorage(STORAGE_KEYS.orders, {})[currentUser?.email] || [];
  const order = orders.find((item) => item.id === button.dataset.receiptId);
  if (order) showReceipt(order);
});
$("#authForm").addEventListener("submit", handleAuth);
document.querySelectorAll("[data-auth-mode]").forEach((button) => button.addEventListener("click", () => setAuthMode(button.dataset.authMode)));
$("#checkoutForm").addEventListener("submit", submitOrder);
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
modalBackdrop.addEventListener("click", (event) => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
    closeModal();
  }
});
$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("¡Gracias por sumarte a la comunidad!", "mail-check");
});

renderCategories();
renderProducts();
renderHeader();
renderCart();
refreshIcons();
