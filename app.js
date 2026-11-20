// Tienda de demostración: los datos se guardan únicamente en el navegador.
const STORAGE_KEYS = {
  users: "nordico_users",
  session: "nordico_session",
  stock: "nordico_stock",
  orders: "nordico_orders",
  products: "nordico_products",
  favorites: "nordico_favorites",
  policies: "nordico_policies",
  settings: "nordico_settings"
};
let TAX_RATE = 0.18;
try {
  const s = readStorage(STORAGE_KEYS.settings, null);
  if (s && typeof s.taxRate === "number") TAX_RATE = s.taxRate / 100;
} catch (e) {}

const baseProducts = [
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

// ---------- Enriquecimiento de productos (Paso 1) ----------
const CATEGORY_SPECS = {
  "Tecnología": { material: "ABS + Aluminio", dimensions: "Variable según modelo", weight: "0.2 - 0.8 kg", color: "Negro / Plata", origin: "China", warranty: "12 meses", care: "Limpiar con paño seco", packageContents: ["Producto", "Cable USB", "Manual de usuario"] },
  "Hogar": { material: "Cerámica / Madera", dimensions: "Variable", weight: "0.3 - 1.5 kg", color: "Blanco / Natural", origin: "Perú", warranty: "6 meses", care: "Lavar a mano", packageContents: ["Producto", "Manual"] },
  "Moda": { material: "Algodón / Cuero", dimensions: "Talla única / Ajustable", weight: "0.1 - 0.4 kg", color: "Varios", origin: "Perú", warranty: "30 días", care: "Lavar a máquina ciclo suave", packageContents: ["Producto", "Etiqueta de cuidado"] },
  "Deportes": { material: "Poliéster / Goma EVA", dimensions: "Estándar", weight: "0.2 - 1.0 kg", color: "Negro / Gris", origin: "China", warranty: "6 meses", care: "Limpiar con paño húmedo", packageContents: ["Producto", "Manual"] },
  "Belleza": { material: "Vidrio / Plástico reciclable", dimensions: "50 - 200 ml", weight: "0.1 - 0.3 kg", color: "Transparente", origin: "Perú", warranty: "30 días", care: "Mantener en lugar fresco", packageContents: ["Producto", "Caja", "Folleto"] },
  "Accesorios": { material: "Cuero / Acero", dimensions: "Ajustable", weight: "0.05 - 0.3 kg", color: "Negro / Marrón", origin: "Perú", warranty: "6 meses", care: "Limpiar con paño seco", packageContents: ["Producto", "Bolsa de protección"] }
};

function enrichProduct(product) {
  const spec = CATEGORY_SPECS[product.category] || CATEGORY_SPECS["Accesorios"];
  const rating = +(4.2 + Math.random() * 0.7).toFixed(1);
  const reviewCount = Math.floor(12 + Math.random() * 80);
  return {
    ...product,
    sku: `ND-${String(product.id).padStart(4, "0")}`,
    shortDescription: product.description + " Diseñado para tu día a día.",
    benefits: [
      "Materiales de alta calidad seleccionados con cuidado.",
      "Diseño funcional que se adapta a tu rutina.",
      "Durabilidad comprobada en uso diario.",
      "Envío rápido y seguro a todo el Perú."
    ],
    spec,
    rating,
    reviewCount,
    deliveryEstimate: "Lima Metropolitana: 1-2 días · Provincias: 3-7 días",
    guarantee: "Garantía de 12 meses · Cambios fáciles hasta 30 días"
  };
}

let products = baseProducts.map(enrichProduct);
async function loadProductsFromSupabase() {
  if (typeof initSupabase === "function") initSupabase();
  if (!window.supabase || !supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('products').select('*').order('id');
    if (error) { console.error('Supabase products error', error); return; }
    if (data && data.length) {
      products = data.map(enrichProduct);
      // sync stock map
      const stockMap = readStorage(STORAGE_KEYS.stock, {});
      products.forEach((p) => { if (!Number.isInteger(stockMap[p.id])) stockMap[p.id] = p.stock; });
      writeStorage(STORAGE_KEYS.stock, stockMap);
    } else {
      products = baseProducts.map(enrichProduct);
    }
  } catch (e) {
    console.error('Supabase load failed', e);
  }
}

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
let inventory = readStorage(STORAGE_KEYS.stock, {});
for (const product of products) {
  if (!Number.isInteger(inventory[product.id])) inventory[product.id] = product.stock;
}
writeStorage(STORAGE_KEYS.stock, inventory);
let authMode = "login";
let activeCategory = "Todos";
let currentPage = 1;
const favoritesKey = () => `nordico_favorites_${currentUser ? currentUser.email : "guest"}`;
let favorites = readStorage(favoritesKey(), []);
let lastOrders = [];

// ---------- Combos / Packs (Paso 1) ----------
const bundles = [
  {
    id: 1, name: "Pack Trabajo en Casa", slug: "pack-trabajo-en-casa",
    subtitle: "Todo lo que necesitas para tu home office.",
    description: "Combina teclado, lámpara y taza para una jornada cómoda y productiva.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    items: [{ productId: 10, quantity: 1 }, { productId: 2, quantity: 1 }, { productId: 7, quantity: 1 }],
    price: 399, originalPrice: 497, isActive: true
  },
  {
    id: 2, name: "Pack Bienestar Diario", slug: "pack-bienestar-diario",
    subtitle: "Cuida tu cuerpo y tu espacio.",
    description: "Botella térmica, cojín de lino y taza de cerámica para rituales diarios.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    items: [{ productId: 4, quantity: 1 }, { productId: 11, quantity: 1 }, { productId: 7, quantity: 1 }],
    price: 189, originalPrice: 217, isActive: true
  },
  {
    id: 3, name: "Pack Tech Essentials", slug: "pack-tech-essentials",
    subtitle: "Tecnología para tu día a día.",
    description: "Auriculares, parlante y teclado inalámbrico para máxima productividad.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    items: [{ productId: 1, quantity: 1 }, { productId: 8, quantity: 1 }, { productId: 10, quantity: 1 }],
    price: 479, originalPrice: 527, isActive: true
  }
];

// ---------- Preferencia de rendimiento ----------
let performanceMode = (function () {
  try { return localStorage.getItem("nordico_performance") === "1"; }
  catch (e) { return false; }
})();
const THEME_PRESETS = {
  default: { primary: "#0a0a0a", accent: "#0a0a0a", bg: "#ffffff", heroBg: "#f5f5f5", announcement: "ENVÍO GRATIS EN PEDIDOS MAYORES A S/ 250" },
  navidad: { primary: "#165b33", accent: "#c41e3a", bg: "#fef9f0", heroBg: "#f0e6d2", announcement: "🎄 ¡FELIZ NAVIDAD! Hasta 40% OFF en combos de regalo" },
  "anio-nuevo": { primary: "#1a1a2e", accent: "#ffd700", bg: "#0f0f1e", heroBg: "#1a1a3e", announcement: "✨ ¡FELIZ AÑO NUEVO! Nuevos comienzos, nuevas ofertas" },
  cyber: { primary: "#000000", accent: "#00ff88", bg: "#0a0a0a", heroBg: "#111111", announcement: "⚡ CYBER WOW: Hasta 50% OFF por tiempo limitado" },
  "san-valentin": { primary: "#9f1239", accent: "#fb7185", bg: "#fff1f2", heroBg: "#ffe4e6", announcement: "💖 SAN VALENTÍN: Regalos perfectos para esa persona especial" },
  "fiestas-patrias": { primary: "#b91c1c", accent: "#ffffff", bg: "#fef2f2", heroBg: "#fee2e2", announcement: "🇵🇪 ¡FELICES FIESTAS PATRIAS! Ofertas peruanas" }
};

const defaultCampaign = {
  showBubble: true,
  showAnimations: true,
  visualEffect: "none",
  themeKey: "default",
  bubbleLabel: "✨ ¡COMENZÓ!",
  bubbleTitle: "Damos inicio a la temporada",
  bubbleSubtitle: "Hasta 40% OFF en combos de regalo y envío gratis desde S/ 250.",
  bubbleCtaText: "Ver ofertas",
  bubbleCtaUrl: "#catalogo",
  endsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  showCountdown: true,
  announcementText: ""
};
let activeCampaign = (function () {
  try { return JSON.parse(localStorage.getItem("nordico_campaign")) || defaultCampaign; }
  catch (e) { return defaultCampaign; }
})();

function isFavorite(productId) {
  return favorites.includes(productId);
}

function toggleFavorite(productId) {
  if (isFavorite(productId)) favorites = favorites.filter((id) => id !== productId);
  else favorites = [...favorites, productId];
  writeStorage(favoritesKey(), favorites);
  renderProducts();
  renderFavoritesCount();
  if (supabaseClient && currentUser) {
    (async () => {
      try {
        if (favorites.includes(productId)) {
          await supabaseClient.from('favorites').upsert({ user_email: currentUser.email, product_id: productId });
        } else {
          await supabaseClient.from('favorites').delete().eq('user_email', currentUser.email).eq('product_id', productId);
        }
      } catch (e) { console.error('Supabase favorites sync failed', e); }
    })();
  }
}

function renderFavoritesCount() {
  const count = favorites.length;
  const el = $("#favoritesCount");
  if (el) el.textContent = count;
}
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
const sideDrawer = $("#sideDrawer");
const sideOverlay = $("#sideOverlay");

let currentCurrency = "PEN";
const EXCHANGE_RATE = 3.75; // 1 USD = 3.75 PEN (referencial)
function money(value) {
  if (currentCurrency === "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value / EXCHANGE_RATE);
  }
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
}

function applyCurrency(currency) {
  currentCurrency = currency;
  const select = $("#currencySelect");
  if (select) select.value = currency;
  try { localStorage.setItem("nordico_currency", currency); } catch (e) {}
  renderProducts();
  renderCart();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function renderCategories() {
  const storedCats = readStorage("nordico_categories", []);
  const productCats = [...new Set(products.map((product) => product.category))];
  const categories = ["Todos", ...(storedCats.length ? storedCats.map((c) => c.name) : productCats), "Favoritos"];
  $("#categoryTabs").innerHTML = categories.map((category) => `
    <button class="filter-tab${activeCategory === category ? " active" : ""}" data-category="${escapeHtml(category)}" aria-pressed="${activeCategory === category}">${escapeHtml(category)}</button>
  `).join("");
}

function getProductFeatures(product) {
  const map = {
    "Tecnología": ["Conectividad inalámbrica", "Batería de larga duración", "Diseño compacto"],
    "Hogar": ["Materiales duraderos", "Fácil mantenimiento", "Diseño ergonómico"],
    "Moda": ["Tela de alta calidad", "Corte moderno", "Confort todo el día"],
    "Deportes": ["Ligero y resistente", "Transpirable", "Soporte óptimo"],
    "Belleza": ["Fórmula suave", "Resultados visibles", "Apto para uso diario"],
    "Accesorios": ["Diseño atemporal", "Materiales premium", "Versátil"]
  };
  return map[product.category] || ["Calidad garantizada", "Diseño moderno", "Uso diario"];
}

function renderProducts(resetPage = false) {
  if (resetPage) currentPage = 1;
  const search = $("#searchInput").value.trim().toLocaleLowerCase("es");
  const sort = $("#sortSelect").value;
  const minPrice = Number($("#minPriceInput")?.value) || 0;
  const maxPrice = Number($("#maxPriceInput")?.value) || Infinity;
  const inStockOnly = $("#inStockOnly")?.checked || false;
  let visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Todos" || activeCategory === "Favoritos"
      ? (activeCategory === "Favoritos" ? isFavorite(product.id) : true)
      : product.category === activeCategory;
    const matchesSearch = product.name.toLocaleLowerCase("es").includes(search) || product.description.toLocaleLowerCase("es").includes(search);
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesStock = !inStockOnly || getStock(product.id) > 0;
    return matchesCategory && matchesSearch && matchesPrice && matchesStock;
  });
  if (sort === "price-asc") visibleProducts = visibleProducts.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") visibleProducts = visibleProducts.sort((a, b) => b.price - a.price);
  if (sort === "name-asc") visibleProducts = visibleProducts.sort((a, b) => a.name.localeCompare(b.name, "es"));

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
      const features = getProductFeatures(product).slice(0, 3);
      return `<article class="product-card" data-product-id="${product.id}">
        <div class="card-inner">
          <div class="card-face card-front">
            <div class="product-image-wrap">
              <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
              ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
              <button class="fav-button ${isFavorite(product.id) ? "active" : ""}" data-fav="${product.id}" aria-label="${isFavorite(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}" type="button"><i data-lucide="heart"></i></button>
              <button class="add-button" data-add="${product.id}" aria-label="Agregar ${escapeHtml(product.name)} al carrito" ${stock < 1 ? "disabled" : ""}><i data-lucide="${stock < 1 ? "check" : "plus"}"></i></button>
            </div>
            <div class="product-info">
              <div class="product-meta"><span>${escapeHtml(product.category)}</span><span>${stock > 0 ? `${stock} disponibles` : "Agotado"}</span></div>
              <h3 class="product-name">${escapeHtml(product.name)}</h3>
              <div class="product-bottom"><p class="product-price">${money(product.price)}</p></div>
            </div>
          </div>
          <div class="card-face card-back">
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <p class="card-back-desc">${escapeHtml(product.description)}</p>
            <ul class="card-back-features">
              ${features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}
            </ul>
            <div class="card-back-meta">
              <span>${escapeHtml(product.category)}</span>
              <strong>${money(product.price)}</strong>
            </div>
            <button class="add-button card-back-add" data-add="${product.id}" ${stock < 1 ? "disabled" : ""}><i data-lucide="${stock < 1 ? "check" : "plus"}"></i></button>
          </div>
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

function updateSideUser() {
  $("#sideUserName").textContent = currentUser ? currentUser.name : "Invitado";
  $("#sideUserEmail").textContent = currentUser ? currentUser.email : "Inicia sesión para comprar";
  $("#sideAuthButton").textContent = currentUser ? "Salir" : "Ingresar";
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

function openProductDetail(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  $("#productDetailImage").src = product.image;
  $("#productDetailImage").alt = product.name;
  $("#productDetailCategory").textContent = product.category;
  $("#productDetailTitle").textContent = product.name;
  $("#productDetailDesc").textContent = product.description;
  $("#productDetailFeatures").innerHTML = getProductFeatures(product).map((f) => `<li>${escapeHtml(f)}</li>`).join("");
  $("#productDetailStock").textContent = getStock(product.id) > 0 ? `${getStock(product.id)} disponibles` : "Agotado";
  $("#productDetailPrice").textContent = money(product.price);
  $("#productDetailAdd").dataset.add = product.id;
  $("#productDetailAdd").disabled = getStock(product.id) < 1;
  openModal($("#productDetailModal"));
  refreshIcons();
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

function openSideDrawer() {
  sideOverlay.classList.add("open");
  sideDrawer.classList.add("open");
  sideDrawer.setAttribute("aria-hidden", "false");
  $("#hamburgerButton").setAttribute("aria-expanded", "true");
  updateSideUser();
}

function closeSideDrawer() {
  sideOverlay.classList.remove("open");
  sideDrawer.classList.remove("open");
  sideDrawer.setAttribute("aria-hidden", "true");
  $("#hamburgerButton").setAttribute("aria-expanded", "false");
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
  favorites = readStorage(`nordico_favorites_${currentUser.email}`, []);
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
  renderCategories();
  renderProducts(true);
  updateSideUser();
  closeModal();
  showToast(authMode === "register" ? "Tu cuenta está lista. ¡Bienvenido!" : `¡Hola, ${user.name}! Sesión iniciada.`, "circle-check");
}

function showAuthError(message) {
  $("#authError").textContent = message;
}

async function submitOrder(event) {
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
  // Sync to Supabase
  if (typeof initSupabase === "function") initSupabase();
  if (supabaseClient) {
    try {
      await supabaseClient.from('orders').insert({
        id: order.id,
        customer_email: currentUser.email,
        customer_name: currentUser.name,
        date: order.date,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        address: order.address,
        payment: order.payment
      });
      await supabaseClient.from('order_items').insert(order.items.map((it) => ({
        order_id: order.id,
        product_id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity
      })));
    } catch (e) { console.error('Supabase order sync failed', e); }
  }
  cart = {};
  persistCart();
  renderProducts();
  event.currentTarget.reset();
  closeModal();
  closeDrawer();
  showToast(`¡Compra completada! Pedido ${order.id}`, "party-popper");
  showReceipt(order);
}

async function showOrders() {
  if (!currentUser) return;
  let orders = readStorage(STORAGE_KEYS.orders, {})[currentUser.email] || [];
  if (typeof initSupabase === "function") initSupabase();
  if (supabaseClient) {
    try {
      const { data } = await supabaseClient.from('orders').select('*, order_items(*)').eq('customer_email', currentUser.email).order('date', { ascending: false });
      if (data && data.length) {
        orders = data.map((o) => ({
          id: o.id,
          date: o.date,
          items: (o.order_items || []).map((i) => ({ id: i.product_id, name: i.name, price: Number(i.price), quantity: i.quantity })),
          subtotal: Number(o.subtotal),
          tax: Number(o.tax),
          total: Number(o.total),
          address: o.address,
          payment: o.payment
        }));
      }
    } catch (e) { console.error('Supabase orders fetch failed', e); }
  }
  lastOrders = orders;
  $("#ordersList").innerHTML = orders.length ? [...orders].reverse().map((order) => `
    <article class="order-card">
      <div class="order-card-head">
        <div>
          <span class="order-status">Completado</span>
          <strong>Pedido ${escapeHtml(order.id)}</strong>
          <small>${new Date(order.date).toLocaleString("es-PE")}</small>
        </div>
        <strong class="order-total">${money(order.total)}</strong>
      </div>
      <ul class="order-items">
        ${order.items.map((item) => `<li><span>${item.quantity}×</span> ${escapeHtml(item.name)} <em>${money(item.price * item.quantity)}</em></li>`).join("")}
      </ul>
      <div class="order-meta">
        <span><i data-lucide="map-pin"></i> ${escapeHtml(order.address)}</span>
        <span><i data-lucide="credit-card"></i> ${escapeHtml(order.payment)}</span>
      </div>
      <div class="order-totals">
        <span>Subtotal ${money(order.subtotal)}</span>
        <span>IGV ${money(order.tax)}</span>
        <strong>Total ${money(order.total)}</strong>
      </div>
      <div class="order-actions">
        <button class="button" data-receipt-id="${escapeHtml(order.id)}" type="button"><i data-lucide="receipt"></i> Ver boleta</button>
      </div>
    </article>
  `).join("") : `<div class="orders-empty"><i data-lucide="shopping-bag"></i><h3>Sin pedidos todavía</h3><p>Tus próximas compras aparecerán aquí.</p></div>`;
  refreshIcons();
  openModal($("#ordersModal"));
}

const POLICIES = {
  terms: {
    title: "Términos y condiciones",
    content: `
      <h3>1. Objeto y aceptación</h3>
      <p>Estos términos regulan el acceso y uso del sitio web de NÓRDICO (en adelante, "la Tienda"). Al navegar, registrarse o realizar una compra, aceptas íntegramente estos términos. Si no estás de acuerdo, debes abstenerte de usar el sitio.</p>
      <h3>2. Naturaleza del servicio</h3>
      <p>La Tienda es una plataforma de demostración educativa de comercio electrónico sin base de datos externa. Los pedidos, usuarios y stock se almacenan localmente en el navegador del visitante (localStorage). No se procesan pagos reales.</p>
      <h3>3. Cuenta de usuario</h3>
      <p>Para finalizar una compra debes crear una cuenta con nombre, correo electrónico y contraseña (mínimo 6 caracteres). Eres responsable de la confidencialidad de tus credenciales y de toda actividad realizada desde tu cuenta. Debes notificarnos de inmediato ante cualquier uso no autorizado.</p>
      <h3>4. Productos, precios y disponibilidad</h3>
      <p>Los precios se expresan en soles peruanos (PEN) e incluyen el impuesto general a las ventas (IGV) cuando corresponda. El stock es limitado y se actualiza al confirmar cada pedido. Nos reservamos el derecho de modificar precios, descripciones e imágenes sin previo aviso. Las fotografías son ilustrativas y pueden variar ligeramente del producto real.</p>
      <h3>5. Proceso de compra</h3>
      <p>El flujo de compra incluye: selección de productos, revisión de la bolsa, inicio de sesión, confirmación de datos de envío y método de pago simulado. Un pedido se considera confirmado cuando se genera el número de pedido (formato ND-XXXXXXXX) y la boleta correspondiente. Puedes vaciar tu bolsa en cualquier momento antes de confirmar.</p>
      <h3>6. Pagos</h3>
      <p>Los métodos de pago (tarjeta de crédito, transferencia bancaria y pago contra entrega) son simulados. No se realizan cargos reales ni se transmiten datos bancarios. La Tienda no almacena números de tarjeta ni códigos de seguridad.</p>
      <h3>7. Envíos y entregas</h3>
      <p>Realizamos envíos a todo el Perú. Los pedidos se procesan en 1 a 2 días hábiles y la entrega estimada es de 3 a 7 días hábiles. El envío es gratuito en pedidos mayores a S/ 250; para pedidos menores se aplica una tarifa calculada al finalizar la compra. Los tiempos son estimados y pueden variar por causas ajenas.</p>
      <h3>8. Devoluciones, cambios y reembolsos</h3>
      <p>Tienes 14 días calendario desde la recepción para devolver un producto. Debe estar sin uso, en su empaque original y con etiquetas. El reembolso se procesa en 5 a 10 días hábiles tras la verificación. Los cambios de talla o color están sujetos a disponibilidad de stock. Los productos en promoción o personalizados no admiten devolución.</p>
      <h3>9. Propiedad intelectual</h3>
      <p>Todo el contenido del sitio (textos, imágenes, logotipos, diseño, código) es propiedad de NÓRDICO STUDIO o de sus licenciantes y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción, distribución o modificación sin autorización escrita.</p>
      <h3>10. Limitación de responsabilidad</h3>
      <p>La Tienda se ofrece "tal cual". No garantizamos disponibilidad ininterrumpida ni ausencia de errores. En la máxima medida permitida por la ley, NÓRDICO no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del sitio.</p>
      <h3>11. Modificaciones</h3>
      <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entran en vigor al publicarse en el sitio. El uso continuado implica la aceptación de los nuevos términos.</p>
      <h3>12. Ley aplicable y jurisdicción</h3>
      <p>Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los jueces y tribunales de Lima, Perú.</p>
      <h3>13. Contacto</h3>
      <p>Para consultas sobre estos términos, escríbenos a soporte@nordico.pe o usa el formulario de contacto del sitio.</p>
    `
  },
  privacy: {
    title: "Política de privacidad",
    content: `
      <h3>1. Responsable del tratamiento</h3>
      <p>NÓRDICO STUDIO es responsable del tratamiento de los datos personales recopilados a través del sitio. Contacto: privacidad@nordico.pe.</p>
      <h3>2. Datos que recopilamos</h3>
      <ul>
        <li><strong>Datos de identificación y contacto:</strong> nombre, correo electrónico, teléfono (opcional), dirección de envío.</li>
        <li><strong>Datos de cuenta:</strong> contraseña (almacenada localmente para fines de demostración).</li>
        <li><strong>Datos de pedido:</strong> productos, cantidades, precios, totales, dirección y método de pago simulado.</li>
        <li><strong>Datos de navegación:</strong> preferencias (tema, tamaño de letra, idioma), posición del carrito flotante, historial de filtros.</li>
        <li><strong>Cookies y almacenamiento local:</strong> localStorage y sessionStorage para mantener sesión y carrito.</li>
      </ul>
      <h3>3. Finalidades del tratamiento</h3>
      <ul>
        <li>Crear y gestionar tu cuenta.</li>
        <li>Procesar y entregar pedidos.</li>
        <li>Mostrar tu historial de compras y generar boletas.</li>
        <li>Mejorar la experiencia (recordar preferencias).</li>
        <li>Responder consultas y soporte.</li>
        <li>Cumplir obligaciones legales y contables.</li>
      </ul>
      <h3>4. Base legal</h3>
      <p>El tratamiento se basa en tu consentimiento (al crear la cuenta), la ejecución del contrato (procesar el pedido) y el interés legítimo (mejorar el servicio). Puedes retirar tu consentimiento en cualquier momento.</p>
      <h3>5. Conservación de los datos</h3>
      <p>Los datos se conservan mientras mantengas tu cuenta y por el tiempo necesario para cumplir obligaciones legales (hasta 5 años para fines contables). Puedes solicitar la eliminación en cualquier momento.</p>
      <h3>6. Compartición de datos</h3>
      <p>No vendemos ni compartimos tus datos personales con terceros con fines comerciales. Solo los compartimos con proveedores de servicios estrictamente necesarios (transporte, pasarelas de pago) bajo acuerdos de confidencialidad, o cuando la ley lo exija.</p>
      <h3>7. Almacenamiento local</h3>
      <p>Toda la información se guarda en tu navegador mediante localStorage. Al cerrar sesión, los datos permanecen en el dispositivo. Puedes borrarlos desde la configuración del navegador o desde la sección "Configuración" del sitio.</p>
      <h3>8. Tus derechos</h3>
      <p>Tienes derecho a acceder, rectificar, suprimir, oponerte al tratamiento y solicitar la portabilidad de tus datos. Para ejercerlos, contáctanos en privacidad@nordico.pe. Responderemos en un plazo máximo de 15 días hábiles.</p>
      <h3>9. Cookies y tecnologías similares</h3>
      <p>Usamos almacenamiento local para mantener tu sesión, carrito y preferencias. No usamos cookies de terceros para publicidad. Puedes deshabilitar el almacenamiento local desde tu navegador, aunque algunas funciones dejarán de operar.</p>
      <h3>10. Seguridad</h3>
      <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos. Sin embargo, ningún sistema es 100% seguro; te recomendamos usar contraseñas robustas y no compartirlas.</p>
      <h3>11. Menores de edad</h3>
      <p>El sitio no está dirigido a menores de 14 años. No recopilamos conscientemente datos de menores. Si detectas que un menor ha proporcionado datos, contáctanos para eliminarlos.</p>
      <h3>12. Transferencias internacionales</h3>
      <p>Los datos se procesan en el dispositivo del usuario y no se transfieren a servidores externos. Si en el futuro se usaran servicios en la nube, se informará y se garantizará un nivel adecuado de protección.</p>
      <h3>13. Cambios en la política</h3>
      <p>Podemos actualizar esta política. La versión vigente estará siempre disponible en el sitio. Te notificaremos de cambios significativos.</p>
      <h3>14. Contacto</h3>
      <p>Para consultas sobre privacidad, escríbenos a privacidad@nordico.pe.</p>
    `
  },
  security: {
    title: "Política de seguridad",
    content: `
      <h3>1. Principios</h3>
      <p>La seguridad de tus datos y de la plataforma es una prioridad. Aplicamos un enfoque de defensa en profundidad y mejoramos continuamente nuestros controles.</p>
      <h3>2. Autenticación</h3>
      <ul>
        <li>Las contraseñas se almacenan localmente para fines de demostración. No uses contraseñas reales ni sensibles.</li>
        <li>La sesión se mantiene mediante localStorage y se cierra al pulsar "Salir".</li>
        <li>Te recomendamos cerrar sesión en dispositivos compartidos.</li>
      </ul>
      <h3>3. Pagos simulados</h3>
      <p>Los métodos de pago son simulados. No se procesan cargos reales ni se transmiten datos bancarios. La Tienda no almacena números de tarjeta, CVV ni fechas de vencimiento.</p>
      <h3>4. Almacenamiento y transporte</h3>
      <p>Los datos se guardan en tu navegador. No se envían a servidores externos. Cuando el sitio se sirve por HTTPS, el tráfico entre tu navegador y el servidor está cifrado.</p>
      <h3>5. Buenas prácticas para el usuario</h3>
      <ul>
        <li>Usa una contraseña única y robusta para esta demostración.</li>
        <li>No compartas tu sesión ni dejes el dispositivo desatendido.</li>
        <li>Mantén tu navegador actualizado.</li>
        <li>Verifica que la URL comience con https://.</li>
        <li>No hagas clic en enlaces sospechosos que suplanten la Tienda.</li>
      </ul>
      <h3>6. Reporte de vulnerabilidades</h3>
      <p>Si detectas un fallo de seguridad, repórtalo de forma responsable a seguridad@nordico.pe. Incluye descripción, pasos para reproducir y impacto. No explotes la vulnerabilidad ni accedas a datos de terceros. Responderemos en un plazo razonable.</p>
      <h3>7. Disponibilidad y continuidad</h3>
      <p>Al ser una demostración estática, la disponibilidad depende del proveedor de hosting (GitHub Pages). No garantizamos disponibilidad ininterrumpida.</p>
      <h3>8. Cookies</h3>
      <p>No usamos cookies de seguimiento. Solo almacenamiento local para funcionalidad. Puedes borrarlo desde la configuración del navegador.</p>
      <h3>9. Cambios</h3>
      <p>Esta política puede actualizarse. La versión vigente estará disponible en el sitio.</p>
      <h3>10. Contacto</h3>
      <p>Para asuntos de seguridad, escríbenos a seguridad@nordico.pe.</p>
    `
  },
  shipping: {
    title: "Envíos y devoluciones",
    content: `
      <h3>1. Zonas de envío</h3>
      <p>Enviamos a todo el Perú, incluyendo zonas urbanas y rurales. Algunas zonas remotas pueden tener tiempos adicionales.</p>
      <h3>2. Procesamiento y entrega</h3>
      <p>Los pedidos se procesan en 1 a 2 días hábiles tras la confirmación. La entrega estimada es de 3 a 7 días hábiles. Recibirás el número de pedido para seguimiento.</p>
      <h3>3. Costos de envío</h3>
      <ul>
        <li><strong>Envío gratis:</strong> pedidos mayores a S/ 250.</li>
        <li><strong>Tarifa estándar:</strong> S/ 15 para pedidos menores a S/ 250.</li>
        <li><strong>Envío express:</strong> S/ 25 (entrega en 1 a 2 días hábiles, sujeto a disponibilidad).</li>
      </ul>
      <h3>4. Seguimiento</h3>
      <p>Puedes consultar el estado de tu pedido en "Mis pedidos". Ante incidencias, contáctanos con tu número de pedido.</p>
      <h3>5. Incidencias en la entrega</h3>
      <p>Si el paquete llega dañado o incompleto, repórtalo dentro de las 48 horas siguientes a la recepción con fotos. Gestionaremos el reenvío o reembolso.</p>
      <h3>6. Devoluciones</h3>
      <p>Tienes 14 días calendario desde la recepción para devolver un producto. Debe estar sin uso, en su empaque original y con etiquetas. El reembolso se procesa en 5 a 10 días hábiles tras la verificación en almacén.</p>
      <h3>7. Cambios</h3>
      <p>Los cambios de talla o color están sujetos a disponibilidad de stock. El cliente asume el costo de envío de retorno salvo error nuestro.</p>
      <h3>8. Productos no retornables</h3>
      <p>Productos en promoción, personalizados o de higiene (cosméticos abiertos) no admiten devolución, salvo defecto de fábrica.</p>
      <h3>9. Contacto</h3>
      <p>Para gestionar devoluciones o incidencias, escríbenos a devoluciones@nordico.pe con tu número de pedido.</p>
    `
  },
  faq: {
    title: "Preguntas frecuentes",
    content: `
      <h3>¿Necesito crear una cuenta para comprar?</h3>
      <p>Puedes navegar y agregar productos como invitado. Para finalizar la compra debes iniciar sesión o crear una cuenta gratuita.</p>
      <h3>¿Dónde se guardan mis datos?</h3>
      <p>En tu navegador mediante localStorage. No hay base de datos externa ni servidor. Tus datos permanecen en este dispositivo.</p>
      <h3>¿Puedo imprimir mi boleta?</h3>
      <p>Sí. Al confirmar la compra se genera una boleta en formato ticketera (80 mm) que puedes imprimir o guardar como PDF desde el navegador.</p>
      <h3>¿Los pagos son reales?</h3>
      <p>No. Es una demostración educativa; los pagos son simulados y no se procesan cargos.</p>
      <h3>¿Cómo vacío mi carrito?</h3>
      <p>Usa el botón "Vaciar bolsa" dentro del carrito o elimina productos uno por uno.</p>
      <h3>¿Puedo cambiar el tema o tamaño de letra?</h3>
      <p>Sí. Abre el menú lateral (☰) → Configuración y elige tema oscuro, tamaño de letra e idioma. Las preferencias se guardan en tu navegador.</p>
      <h3>¿El carrito flotante se puede mover?</h3>
      <p>Sí. Arrastra la burbuja del carrito a cualquier posición de la pantalla; su ubicación se guarda.</p>
      <h3>¿Cómo busco productos?</h3>
      <p>Usa el buscador en la barra de catálogo y los filtros por categoría, precio y disponibilidad. También puedes ordenar por precio.</p>
      <h3>¿Qué hago si olvidé mi contraseña?</h3>
      <p>Al ser una demostración local, no hay recuperación. Puedes crear una nueva cuenta o borrar los datos del navegador.</p>
      <h3>¿Cómo borro mis datos?</h3>
      <p>Desde Configuración → "Borrar datos del navegador" o limpiando el almacenamiento local del sitio.</p>
    `
  },
  reclamations: {
    title: "Libro de Reclamaciones",
    content: `
      <h3>¿Qué es el Libro de Reclamaciones?</h3>
      <p>Es un registro obligatorio conforme al Código de Protección y Defensa del Consumidor (Ley N.º 29571) y el Reglamento del Libro de Reclamaciones (D.S. N.º 011-2011-PCM). Aquí puedes registrar reclamos o quejas sobre productos o servicios.</p>
      <h3>Diferencia entre reclamo y queja</h3>
      <ul>
        <li><strong>Reclamo:</strong> disconformidad relacionada con los productos o servicios brindados.</li>
        <li><strong>Queja:</strong> malestar respecto a la atención al público o al trato recibido.</li>
      </ul>
      <h3>Datos del proveedor</h3>
      <p>NÓRDICO STUDIO S.A.C. · RUC 20600000000 · Domicilio fiscal: Av. Ejemplo 123, Lima, Perú · Correo: reclamos@nordico.pe.</p>
      <h3>¿Cómo registrar tu reclamo?</h3>
      <ol>
        <li>Envía un correo a reclamos@nordico.pe con tu nombre completo, DNI o CE, correo, teléfono, número de pedido, descripción del hecho y tu pedido concreto.</li>
        <li>Recibirás una constancia con un código único de reclamo dentro de las 24 horas siguientes.</li>
        <li>Resolveremos en un plazo máximo de 15 días hábiles, prorrogable por 15 días hábiles adicionales por causas justificadas, informándote oportunamente.</li>
      </ol>
      <h3>Horario de atención</h3>
      <p>Lunes a viernes de 9:00 a 18:00 h (hora de Lima). Los reclamos presentados fuera de horario se consideran recibidos el siguiente día hábil.</p>
      <h3>Recomendaciones</h3>
      <p>Conserva tu número de pedido y la boleta. Este libro es virtual y su uso es gratuito. La presentación de un reclamo no impide acudir a INDECOPI u otras vías legales.</p>
    `
  }
};

const storedPolicies = readStorage(STORAGE_KEYS.policies, null);
if (storedPolicies) {
  Object.keys(storedPolicies).forEach((key) => { POLICIES[key] = storedPolicies[key]; });
}

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
  const favButton = event.target.closest("[data-fav]");
  if (favButton) { toggleFavorite(Number(favButton.dataset.fav)); return; }
  const button = event.target.closest("[data-add]");
  if (button) { addToCart(Number(button.dataset.add)); return; }
  const card = event.target.closest(".product-card");
  if (card) openProductDetail(Number(card.dataset.productId));
});
$("#searchInput").addEventListener("input", () => renderProducts(true));
$("#sortSelect").addEventListener("change", () => renderProducts(true));
$("#minPriceInput").addEventListener("input", () => renderProducts(true));
$("#maxPriceInput").addEventListener("input", () => renderProducts(true));
$("#inStockOnly").addEventListener("change", () => renderProducts(true));
$("#resetFiltersButton").addEventListener("click", () => {
  $("#minPriceInput").value = "";
  $("#maxPriceInput").value = "";
  $("#inStockOnly").checked = false;
  $("#searchInput").value = "";
  $("#sortSelect").value = "featured";
  renderProducts(true);
});
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
$("#hamburgerButton").addEventListener("click", openSideDrawer);
sideOverlay.addEventListener("click", closeSideDrawer);
document.querySelectorAll("[data-close-side]").forEach((button) => button.addEventListener("click", closeSideDrawer));
$("#sideAuthButton").addEventListener("click", () => {
  closeSideDrawer();
  if (currentUser) {
    currentUser = null;
    writeStorage(STORAGE_KEYS.session, null);
    cart = readStorage(cartKey(), {});
    renderHeader();
    renderCart();
    updateSideUser();
    showToast("Has cerrado sesión.", "log-out");
  } else {
    setAuthMode("login");
    openModal($("#authModal"));
  }
});
document.querySelectorAll("[data-open-orders]").forEach((button) => button.addEventListener("click", () => {
  closeSideDrawer();
  showOrders();
}));

// Configuración: tema, tamaño de letra, idioma
const themeToggle = $("#themeToggle");
const fontSizeSelect = $("#fontSizeSelect");
const languageSelect = $("#languageSelect");

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  document.documentElement.setAttribute("data-mode", dark ? "dark" : "light");
  if (themeToggle) themeToggle.checked = dark;
  try { localStorage.setItem("nordico_theme", dark ? "dark" : "light"); } catch (e) {}
  syncHeaderThemeButton();
}

function applyFontSize(size) {
  document.body.classList.remove("font-large", "font-xlarge");
  if (size === "large") document.body.classList.add("font-large");
  if (size === "xlarge") document.body.classList.add("font-xlarge");
  if (fontSizeSelect) fontSizeSelect.value = size;
  try { localStorage.setItem("nordico_fontsize", size); } catch (e) {}
}

try {
  applyTheme(localStorage.getItem("nordico_theme") === "dark");
  applyFontSize(localStorage.getItem("nordico_fontsize") || "normal");
  applyCurrency(localStorage.getItem("nordico_currency") || "PEN");
  const lang = localStorage.getItem("nordico_lang");
  if (lang && languageSelect) languageSelect.value = lang;
  const notif = localStorage.getItem("nordico_notifications");
  if (notif !== null && $("#notificationsToggle")) $("#notificationsToggle").checked = notif === "1";
} catch (e) {
  applyTheme(false);
  applyFontSize("normal");
  applyCurrency("PEN");
}

themeToggle?.addEventListener("change", () => applyTheme(themeToggle.checked));
const headerThemeBtn = $("#themeToggleButton");

function applyPerformanceMode(enabled) {
  document.documentElement.classList.toggle("reduce-motion", enabled);
  try { localStorage.setItem("nordico_performance", enabled ? "1" : "0"); } catch (e) {}
  const toggle = $("#performanceToggle");
  if (toggle) toggle.checked = enabled;
}

// Auto-detect
(function autoPerformance() {
  let enable = false;
  try {
    if (localStorage.getItem("nordico_performance") === "1") enable = true;
    else if (localStorage.getItem("nordico_performance") === "0") enable = false;
    else {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) enable = true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) enable = true;
      if (navigator.deviceMemory && navigator.deviceMemory <= 4) enable = true;
      if (navigator.connection && navigator.connection.saveData) enable = true;
    }
  } catch (e) {}
  applyPerformanceMode(enable);
})();
function syncHeaderThemeButton() {
  const btn = $("#themeToggleButton");
  if (!btn) return;
  const dark = document.body.classList.contains("dark");
  btn.innerHTML = dark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  refreshIcons();
}
headerThemeBtn?.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("dark"));
  syncHeaderThemeButton();
});
// sync on load
setTimeout(() => syncHeaderThemeButton(), 0);
fontSizeSelect?.addEventListener("change", () => applyFontSize(fontSizeSelect.value));
languageSelect?.addEventListener("change", () => {
  const lang = languageSelect.value;
  try { localStorage.setItem("nordico_lang", lang); } catch (e) {}
  showToast(lang === "es" ? "Idioma: Español" : "Language: English", "globe");
});
$("#currencySelect")?.addEventListener("change", (e) => applyCurrency(e.target.value));
$("#performanceToggle")?.addEventListener("change", (e) => applyPerformanceMode(e.target.checked));
$("#notificationsToggle")?.addEventListener("change", (e) => {
  try { localStorage.setItem("nordico_notifications", e.target.checked ? "1" : "0"); } catch (err) {}
  showToast(e.target.checked ? "Notificaciones activadas" : "Notificaciones desactivadas", "bell");
});
$("#clearDataButton")?.addEventListener("click", () => {
  if (!confirm("¿Borrar todos tus datos locales (cuenta, carrito, pedidos, preferencias)?")) return;
  try {
    Object.keys(localStorage).filter((k) => k.startsWith("nordico_")).forEach((k) => localStorage.removeItem(k));
  } catch (e) {}
  location.reload();
});
$("#exportDataButton")?.addEventListener("click", () => {
  const data = {};
  try {
    Object.keys(localStorage).filter((k) => k.startsWith("nordico_")).forEach((k) => { data[k] = JSON.parse(localStorage.getItem(k)); });
  } catch (e) {}
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nordico-datos.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Datos exportados", "download");
});
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
$("#productDetailAdd").addEventListener("click", () => {
  const id = Number($("#productDetailAdd").dataset.add);
  if (id) { addToCart(id); closeModal(); }
});
$("#accountButton").addEventListener("click", () => {
  if (currentUser) {
    currentUser = null;
    writeStorage(STORAGE_KEYS.session, null);
    cart = readStorage(cartKey(), {});
    favorites = readStorage(favoritesKey(), []);
    renderHeader();
    renderCart();
    renderCategories();
    renderProducts(true);
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
  const orders = lastOrders.length ? lastOrders : (readStorage(STORAGE_KEYS.orders, {})[currentUser?.email] || []);
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
    closeSideDrawer();
    closeModal();
  }
});
const backToTop = $("#backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) backToTop?.classList.add("visible");
  else backToTop?.classList.remove("visible");
});
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("¡Gracias por sumarte a la comunidad!", "mail-check");
});

function applyCampaignTheme() {
  const key = (activeCampaign.themeKey || "default");
  const preset = THEME_PRESETS[key] || THEME_PRESETS.default;
  document.body.setAttribute("data-theme", key);
  document.documentElement.setAttribute("data-season", key);
  document.body.style.setProperty("--campaign-primary", preset.primary);
  document.body.style.setProperty("--campaign-accent", preset.accent);
  document.body.style.setProperty("--campaign-bg", preset.bg);
  document.body.style.setProperty("--campaign-hero-bg", preset.heroBg);
  const ann = activeCampaign.announcementText || preset.announcement;
  const annEl = document.querySelector(".announcement");
  if (annEl) annEl.textContent = ann;
  // dark/light based on theme
  if (key === "anio-nuevo" || key === "cyber") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

function initCampaignBubble() {
  window.__bubbleStarted = true;
  const bubble = document.getElementById("campaignBubble");
  if (!bubble || !activeCampaign.showBubble) return;
  window.__bubblePassedShow = true;
  if (sessionStorage.getItem("nordico_campaign_closed")) return;
  document.getElementById("campaignBubbleBadge").textContent = activeCampaign.bubbleLabel || "";
  document.getElementById("campaignBubbleTitle").textContent = activeCampaign.bubbleTitle || "";
  document.getElementById("campaignBubbleSubtitle").textContent = activeCampaign.bubbleSubtitle || "";
  const cta = document.getElementById("campaignBubbleCta");
  cta.textContent = activeCampaign.bubbleCtaText || "Ver ofertas";
  cta.href = activeCampaign.bubbleCtaUrl || "#catalogo";
  const countdown = document.getElementById("campaignCountdown");
  if (activeCampaign.showCountdown && activeCampaign.endsAt) {
    countdown.removeAttribute("hidden");
    updateCampaignCountdown();
    setInterval(updateCampaignCountdown, 1000);
  } else {
    countdown.setAttribute("hidden", "");
  }
  bubble.removeAttribute("hidden");
  setTimeout(() => bubble.classList.add("show"), 1500);
  document.getElementById("campaignBubbleClose").addEventListener("click", () => {
    bubble.classList.remove("show");
    sessionStorage.setItem("nordico_campaign_closed", "1");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bubble.classList.contains("show")) {
      bubble.classList.remove("show");
      sessionStorage.setItem("nordico_campaign_closed", "1");
    }
  });
}

function updateCampaignCountdown() {
  const countdown = $("#campaignCountdown");
  if (!countdown || !activeCampaign.endsAt) return;
  const diff = new Date(activeCampaign.endsAt).getTime() - Date.now();
  if (diff <= 0) { countdown.textContent = "Finalizado"; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  countdown.innerHTML = `<span>${d}d</span><span>${String(h).padStart(2,"0")}h</span><span>${String(m).padStart(2,"0")}m</span><span>${String(s).padStart(2,"0")}s</span>`;
}

function initCampaignCanvas() {
  const canvas = $("#campaignCanvas");
  if (!canvas || !activeCampaign.showAnimations) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  const effect = activeCampaign.visualEffect || "none";
  if (effect === "none") return;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  if (effect === "snow") {
    for (let i = 0; i < 60; i++) particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: 1+Math.random()*2, s: 0.3+Math.random()*0.8 });
  } else if (effect === "confetti") {
    for (let i = 0; i < 40; i++) particles.push({ x: Math.random()*canvas.width, y: -Math.random()*canvas.height, r: 2+Math.random()*3, s: 1+Math.random()*2, c: Math.random() > 0.5 ? "#dc2626" : "#ffffff", rot: Math.random()*Math.PI });
  } else if (effect === "sparkles") {
    for (let i = 0; i < 30; i++) particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: 1+Math.random()*2, s: 0.2+Math.random()*0.5, a: Math.random() });
  }
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (effect === "snow") {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); p.y += p.s; p.x += Math.sin(p.y*0.01)*0.3; if (p.y > canvas.height) { p.y = -5; p.x = Math.random()*canvas.width; } });
    } else if (effect === "confetti") {
      particles.forEach(p => { ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.r,-p.r,p.r*2,p.r*2); ctx.restore(); p.y += p.s; p.rot += 0.05; if (p.y > canvas.height) { p.y = -10; p.x = Math.random()*canvas.width; } });
    } else if (effect === "sparkles") {
      particles.forEach(p => { p.a += 0.02; const alpha = (Math.sin(p.a)+1)/2; ctx.fillStyle = `rgba(255,215,0,${alpha})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); p.y -= p.s; if (p.y < -5) { p.y = canvas.height+5; p.x = Math.random()*canvas.width; } });
    }
    requestAnimationFrame(draw);
  }
  draw();
}

async function initApp() {
  try {
    await loadProductsFromSupabase();
    renderCategories();
    renderProducts();
    renderHeader();
    renderCart();
    refreshIcons();
    applyCampaignTheme();
    initCampaignBubble();
    initCampaignCanvas();
  } catch (e) {
    console.error("initApp error:", e);
  }
}
initApp();
