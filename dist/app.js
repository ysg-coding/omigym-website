import { products, productById, defaultVariant, money, escapeHTML as esc } from './data.js';
import { addItem, setQuantity, sanitizeCart, totals, createOrder } from './store.js';
import { homePage, shopPage, productPage, aboutPage, contactPage, cartPage, checkoutPage, confirmationPage, notFoundPage } from './pages.js';
import { productCard, cartLines, emptyCart, icon, buttonLink } from './components.js';
import { loginPage, registerPage, initAccount } from './account.js';

const main = document.querySelector('#main');
const dialog = document.querySelector('#cart-dialog');
const CART_KEY = 'omigym.cart.v1';
const ORDER_KEY = 'omigym.order.v1';
let cart = [];
let lastOrder = null;
let toastTimer;
let ordering = false;
try { cart = sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY))); } catch { /* A blocked or damaged store starts with an empty bag. */ }
try {
  const saved = JSON.parse(sessionStorage.getItem(ORDER_KEY));
  if (saved?.id && /^OM-[A-Z0-9-]+$/.test(saved.id) && typeof saved.customer === 'string' && Number.isFinite(Date.parse(saved.date))) {
    const items = sanitizeCart(saved.items);
    if (items.length) lastOrder = { id: saved.id, customer: saved.customer.slice(0, 80), date: saved.date, items, ...totals(items) };
  }
} catch { /* Session receipt is optional. */ }

function notify(message) {
  const el = document.querySelector('#toast');
  clearTimeout(toastTimer);
  el.textContent = message;
  el.classList.add('visible');
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3600);
}
function updateBadge() {
  const count = totals(cart).count;
  document.querySelector('#bag-count').textContent = count;
  document.querySelector('[data-action="open-cart"]').setAttribute('aria-label', `Open shopping bag, ${count} items`);
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { notify('Your bag is available for this visit. Browser storage is unavailable.'); }
  updateBadge();
}
function closeCart() { if (dialog.open) dialog.close(); }
function renderDrawer() {
  const t = totals(cart);
  document.querySelector('#cart-content').innerHTML = `<div class="drawer-heading"><h2 id="cart-title">YOUR BAG <span>(${t.count})</span></h2><button class="icon-button" data-action="close-cart" aria-label="Close shopping bag">${icon('close')}</button></div>${cart.length ? `<div class="shipping-progress"><p>${icon('truck')} Flat-rate shipping: <strong>${money(t.shipping)}</strong></p></div><div class="drawer-lines">${cartLines(cart)}</div><div class="drawer-bottom"><div class="summary-row"><span>Subtotal</span><strong>${money(t.subtotal)}</strong></div><p>Flat-rate shipping of $7.00 is added at checkout.</p>${buttonLink('#/checkout', 'Continue to checkout', 'full')}<a class="view-bag" href="#/cart">View your bag</a></div>` : `<div class="drawer-empty">${emptyCart()}</div>`}`;
}
function openCart() { renderDrawer(); if (!dialog.open) dialog.showModal(); }
function currentRoute() {
  const hash = location.hash.slice(1) || '/';
  const [path, query = ''] = hash.split('?');
  return { path, params: new URLSearchParams(query) };
}
function render({ focus = true } = {}) {
  closeCart();
  const { path, params } = currentRoute();
  const navigation = document.querySelector('.header nav');
  navigation.classList.remove('open');
  document.querySelector('[data-action="menu"]').setAttribute('aria-expanded', 'false');
  let page;
  let title;
  if (path === '/') { page = homePage(); title = 'Built for your next level'; }
  else if (path === '/shop') { page = shopPage(params); title = 'Shop strength equipment'; }
  else if (path.startsWith('/product/')) {
    const p = productById(path.slice('/product/'.length));
    page = p ? productPage(p) : notFoundPage(); title = p?.name || 'Product not found';
  }
  else if (path === '/about') { page = aboutPage(); title = 'Our story'; }
  else if (path === '/contact') { page = contactPage(params); title = params.get('topic') === 'Wholesale' ? 'Wholesale inquiries' : 'Contact us'; }
  else if (path === '/login') { page = loginPage(); title = 'Log in'; }
  else if (path === '/register') { page = registerPage(); title = 'Create account'; }
  else if (path === '/cart') { page = cartPage(cart); title = 'Your bag'; }
  else if (path === '/checkout') { page = checkoutPage(cart); title = 'Checkout'; }
  else if (path === '/confirmation') { page = confirmationPage(lastOrder); title = 'Order confirmation'; }
  else { page = notFoundPage(); title = 'Page not found'; }
  main.innerHTML = page;
  document.title = `OMIGYM — ${title}`;
  document.querySelectorAll('[data-nav]').forEach(link => {
    const active = link.dataset.nav === (path === '/' ? 'home' : path === '/contact' && params.get('topic') === 'Wholesale' ? 'wholesale' : path.startsWith('/product/') ? 'shop' : path.slice(1));
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  if (path === '/shop') {
    refreshCatalog(false);
    if (params.has('search')) document.querySelector('#catalog-search').focus({ preventScroll: true });
  }
  if (path === '/checkout' && cart.length) document.querySelector('#shipping-cost').textContent = money(totals(cart).shipping);
  updateBadge();
  if (focus) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!(path === '/shop' && params.has('search'))) main.focus({ preventScroll: true });
  }
}
function refreshCatalog(updateURL = true) {
  const results = document.querySelector('#catalog-results');
  if (!results) return;
  const query = document.querySelector('#catalog-search').value.trim().toLowerCase();
  const category = results.dataset.category;
  const sort = document.querySelector('#catalog-sort').value;
  let matches = products.filter(p => (category === 'All equipment' || category === p.category) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query));
  if (sort === 'low') matches.sort((a, b) => a.price - b.price);
  if (sort === 'high') matches.sort((a, b) => b.price - a.price);
  if (sort === 'name') matches.sort((a, b) => a.name.localeCompare(b.name));
  results.innerHTML = matches.length ? matches.map(productCard).join('') : `<div class="no-results"><h2>NO MATCHES. NEW POSSIBILITIES.</h2><p>Try “dumbbells”, “bench” or explore all equipment.</p><button class="button outline" data-action="reset-filters">Clear filters</button></div>`;
  document.querySelector('#result-count').textContent = `${matches.length} ${matches.length === 1 ? 'product' : 'products'}${query ? ` for “${query}”` : ''}`;
  if (updateURL) {
    const params = new URLSearchParams();
    if (category !== 'All equipment') params.set('category', category);
    if (query) params.set('search', document.querySelector('#catalog-search').value.trim());
    history.replaceState(null, '', `#/shop${params.size ? '?' + params : ''}`);
  }
}
function changeCart(nextCart) {
  const wasOpen = dialog.open;
  const active = document.activeElement;
  const focusKey = active?.dataset?.key;
  const focusLabel = active?.getAttribute('aria-label');
  const route = currentRoute().path;
  const formValues = [...document.querySelectorAll('#checkout-form input, #checkout-form select')].map(input => ({ name: input.name, value: input.value, checked: input.checked }));
  const position = window.scrollY;
  cart = nextCart; saveCart();
  if (route === '/cart') main.innerHTML = cartPage(cart);
  if (route === '/checkout') {
    main.innerHTML = checkoutPage(cart);
    if (cart.length) {
      document.querySelector('#shipping-cost').textContent = money(totals(cart).shipping);
      for (const input of document.querySelectorAll('#checkout-form input, #checkout-form select')) {
        const saved = formValues.find(value => value.name === input.name);
        if (saved) { input.value = saved.value; if (input.type === 'checkbox') input.checked = saved.checked; }
      }
    }
  }
  if (wasOpen) {
    renderDrawer();
    const candidates = [...dialog.querySelectorAll('button[data-key]')];
    (candidates.find(el => el.dataset.key === focusKey && el.getAttribute('aria-label') === focusLabel && !el.disabled) || dialog.querySelector('[data-action="close-cart"]')).focus({ preventScroll: true });
  }
  else if (['/cart', '/checkout'].includes(route)) {
    const candidates = [...main.querySelectorAll('button[data-key]')];
    (candidates.find(el => el.dataset.key === focusKey && el.getAttribute('aria-label') === focusLabel && !el.disabled) || candidates[0] || main).focus({ preventScroll: true });
    window.scrollTo({ top: position, behavior: 'instant' });
  }
}

document.addEventListener('click', event => {
  const skip = event.target.closest('.skip-link');
  if (skip) { event.preventDefault(); main.focus(); return; }
  const anchor = event.target.closest('a[href^="#/"]');
  if (anchor && dialog.open) closeCart();
  if (anchor?.hash === location.hash) {
    document.querySelector('.header nav').classList.remove('open');
    document.querySelector('[data-action="menu"]').setAttribute('aria-expanded', 'false');
  }
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'open-cart') openCart();
  if (action === 'close-cart') closeCart();
  if (action === 'menu') {
    const isOpen = document.querySelector('.header nav').classList.toggle('open');
    target.setAttribute('aria-expanded', String(isOpen));
  }
  if (action === 'quick-add') {
    try { cart = addItem(cart, target.dataset.id, target.dataset.variant, 1); saveCart(); openCart(); }
    catch (error) { notify(error.message); }
  }
  if (action === 'cart-quantity') changeCart(setQuantity(cart, target.dataset.key, Number(target.dataset.quantity)));
  if (action === 'remove') { changeCart(setQuantity(cart, target.dataset.key, 0)); notify('Item removed from your bag.'); }
  if (action === 'category' || action === 'reset-filters') {
    const category = action === 'reset-filters' ? 'All equipment' : target.dataset.category;
    document.querySelector('#catalog-results').dataset.category = category;
    document.querySelectorAll('.filter-tab').forEach(el => { el.classList.toggle('active', el.dataset.category === category); el.setAttribute('aria-pressed', String(el.dataset.category === category)); });
    if (action === 'reset-filters') document.querySelector('#catalog-search').value = '';
    refreshCatalog();
  }
  if (action === 'product-quantity') {
    const input = document.querySelector('#product-quantity');
    input.value = Math.max(1, Math.min(20, (Number(input.value) || 1) + Number(target.dataset.delta)));
  }
  if (action === 'gallery') {
    const img = document.querySelector('#detail-image');
    img.src = `assets/${target.dataset.image}`; img.alt = target.dataset.caption;
    document.querySelectorAll('.gallery-thumb').forEach(el => { el.classList.toggle('selected', el === target); el.setAttribute('aria-pressed', String(el === target)); });
  }
});
dialog.addEventListener('click', event => { if (event.target === dialog && event.clientX < dialog.getBoundingClientRect().left) closeCart(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { document.querySelector('.header nav').classList.remove('open'); document.querySelector('[data-action="menu"]').setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('input', event => {
  if (event.target.id === 'catalog-search') refreshCatalog();
  if (event.target.matches('input,textarea')) event.target.setCustomValidity('');
});
document.addEventListener('change', event => {
  if (event.target.id === 'catalog-sort') refreshCatalog();
  if (event.target.name === 'variant') {
    const p = productById(document.querySelector('#product-form').dataset.id);
    document.querySelector('#detail-price').textContent = money(Number(event.target.dataset.price));
    document.querySelector('#detail-compare').textContent = p.compare && event.target.value === defaultVariant(p) ? money(p.compare) : '';
  }
});
document.addEventListener('submit', event => {
  const form = event.target;
  if (!['product-form', 'contact-form', 'checkout-form'].includes(form.id)) return;
  event.preventDefault();
  for (const input of form.querySelectorAll('input[required],textarea[required]')) {
    if (['checkbox', 'radio'].includes(input.type)) continue;
    if (!input.value.trim()) { input.setCustomValidity('Please fill out this field.'); input.reportValidity(); return; }
  }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  if (form.id === 'product-form') {
    try { cart = addItem(cart, form.dataset.id, data.get('variant'), Number(data.get('quantity'))); saveCart(); openCart(); }
    catch (error) { notify(error.message); }
  }
  if (form.id === 'contact-form') {
    form.hidden = true;
    const success = document.querySelector('#contact-success');
    success.hidden = false;
    success.innerHTML = `<div class="success-icon">${icon('check')}</div><h3>Thanks, ${esc(data.get('name').trim())}.</h3><p>Thank you for reaching out to OMIGYM.</p><button class="button outline" type="button" id="another-message">Write another message</button>`;
    document.querySelector('#another-message').addEventListener('click', () => { success.hidden = true; form.hidden = false; form.reset(); form.querySelector('input').focus(); });
  }
  if (form.id === 'checkout-form') {
    if (ordering) return;
    try {
      ordering = true;
      lastOrder = createOrder(cart, data.get('firstName'));
      try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(lastOrder)); } catch { /* In-memory receipt remains available. */ }
      cart = []; saveCart();
      location.hash = '/confirmation';
    } catch (error) { document.querySelector('#checkout-error').textContent = error.message; }
    finally { ordering = false; }
  }
});
window.addEventListener('hashchange', () => render());
window.addEventListener('storage', event => {
  if (event.key === CART_KEY || event.key === null) {
    try { changeCart(sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY)))); } catch { changeCart([]); }
  }
});

// Optional WebMCP integration uses the exact same cart action as the visible UI.
const context = document.modelContext;
if (context?.registerTool) {
  const lifecycle = new AbortController();
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  try {
    Promise.resolve(context.registerTool({
      name: 'add_equipment_to_bag', title: 'Add equipment to bag',
      description: 'Add an OMIGYM catalog product and its exact variant to this browser’s local demonstration shopping bag. Opens the bag; does not place an order.',
      inputSchema: { type: 'object', properties: { productId: { type: 'string', enum: products.map(p => p.id) }, variant: { type: 'string' }, quantity: { type: 'integer', minimum: 1, maximum: 20 } }, required: ['productId', 'variant', 'quantity'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || typeof input !== 'object' || !Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 20) throw new Error('Quantity must be an integer between 1 and 20.');
        cart = addItem(cart, input.productId, input.variant, input.quantity); saveCart(); openCart();
        return { itemCount: totals(cart).count, subtotal: totals(cart).subtotal, currency: 'USD', unit: 'cents' };
      }
    }, { signal: lifecycle.signal })).catch(() => {});
  } catch { /* Browsers without supported WebMCP continue with the normal UI. */ }
}
initAccount();
render({ focus: false });
