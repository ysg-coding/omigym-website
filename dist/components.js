import { money, escapeHTML as esc, defaultVariant } from './data.js';
import { lineInfo, totals } from './store.js';

export const icons = {
  truck: '<path d="M1 5h14v12H1zM15 9h4l4 5v3h-8"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/>',
  shield: '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
  return: '<path d="M4 10a8 8 0 1 1 0 7M4 3v7h7"/>',
  strength: '<path d="M3 8v8M7 5v14M17 5v14M21 8v8M7 12h10"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="1"/><path d="m2 5 10 8L22 5"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
};
export const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.arrow}</svg>`;
export const buttonLink = (url, text, cls = '') => `<a class="button ${cls}" href="${url}">${text}${icon('arrow')}</a>`;
export const breadcrumb = (items = []) => `<div class="breadcrumb"><a href="#/">Home</a>${items.map(([name, href]) => `<span aria-hidden="true">/</span>${href ? `<a href="${href}">${esc(name)}</a>` : `<span>${esc(name)}</span>`}`).join('')}</div>`;
export const stars = (rating, reviews) => `<span class="stars" aria-label="${rating} out of 5 stars">★★★★★</span><span class="rating">${rating} <span>(${reviews})</span></span>`;
export function productCard(p) {
  return `<article class="product-card"><a class="product-image" href="#/product/${p.id}" aria-label="View ${esc(p.name)}"><img src="assets/${p.image}" alt="${esc(p.name)}" width="600" height="600" loading="lazy">${p.tag ? `<span class="product-badge">${p.tag}</span>` : ''}<span class="image-arrow" aria-hidden="true">↗</span></a><div class="product-meta"><span>${p.category}</span><div>${stars(p.rating, p.reviews)}</div></div><h3><a href="#/product/${p.id}">${p.name}</a></h3><div class="product-bottom"><div><strong>${money(p.price)}</strong>${p.compare ? `<del>${money(p.compare)}</del>` : ''}</div><button class="quick-add" data-action="quick-add" data-id="${p.id}" data-variant="${esc(defaultVariant(p))}" aria-label="Add ${esc(p.name)} to bag">+</button></div></article>`;
}
export function promises() {
  return `<section class="promises" aria-label="Our promise"><div>${icon('truck')}<span><strong>$7 flat-rate shipping</strong><small>Your next workout, delivered.</small></span></div><div>${icon('shield')}<span><strong>Built to last</strong><small>Equipment you can count on.</small></span></div><div>${icon('return')}<span><strong>30-day returns</strong><small>Find your fit. Train with confidence.</small></span></div><div>${icon('strength')}<span><strong>Made for your home</strong><small>Serious strength. Your space.</small></span></div></section>`;
}
export function cartLines(cart, readonly = false) {
  return cart.map(item => {
    const { product, option } = lineInfo(item.id, item.variant);
    return `<article class="cart-line"><a class="cart-thumb" href="#/product/${item.id}"><img src="assets/${product.image}" alt="${esc(product.name)}" width="100" height="100"></a><div class="cart-line-details"><a href="#/product/${item.id}"><strong>${product.name}</strong></a><p>${esc(item.variant)}</p>${readonly ? `<span class="muted">Qty: ${item.quantity}</span>` : `<div class="line-controls"><div class="quantity small"><button data-action="cart-quantity" data-key="${esc(item.key)}" data-quantity="${item.quantity - 1}" aria-label="Decrease ${esc(product.name)} quantity">−</button><span aria-label="Quantity">${item.quantity}</span><button data-action="cart-quantity" data-key="${esc(item.key)}" data-quantity="${item.quantity + 1}" aria-label="Increase ${esc(product.name)} quantity" ${item.quantity >= 20 ? 'disabled' : ''}>+</button></div><button class="remove" data-action="remove" data-key="${esc(item.key)}" aria-label="Remove ${esc(product.name)}">Remove</button></div>`}</div><strong class="line-price">${money(option.price * item.quantity)}</strong></article>`;
  }).join('');
}
export function summary(cart, action = true) {
  const t = totals(cart);
  return `<div class="summary"><h2>ORDER SUMMARY</h2><div class="summary-row"><span>Subtotal (${t.count} items)</span><span>${money(t.subtotal)}</span></div><div class="summary-row"><span>Standard shipping</span><span>${money(t.shipping)}</span></div><p class="summary-note">One flat rate, whatever your setup.</p><div class="summary-total"><span>Total</span><strong>${money(t.total)} <small>USD</small></strong></div>${action ? buttonLink('#/checkout', 'Continue to checkout', 'full') : ''}</div>`;
}
export const emptyCart = () => `<div class="empty-state">${icon('bag')}<span class="eyebrow">MAKE ROOM FOR PROGRESS</span><h2>YOUR BAG IS EMPTY.</h2><p>Your next chapter starts with the right equipment.</p>${buttonLink('#/shop', 'Explore equipment')}</div>`;
