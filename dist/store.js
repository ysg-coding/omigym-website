import { productById } from './data.js';

export const MAX_QUANTITY = 20;
export function lineInfo(id, variant) {
  const product = productById(id);
  const option = product?.variants.find(item => item.name === variant);
  if (!product || !option) throw new Error('Please choose an available product and option.');
  return { product, option, key: `${id}::${variant}` };
}
export function addItem(cart, id, variant, quantity = 1) {
  const { key } = lineInfo(id, variant);
  if (!Number.isFinite(quantity) || quantity < 1) throw new Error('Please choose a quantity from 1 to 20.');
  const next = cart.map(item => ({ ...item }));
  const existing = next.find(item => item.key === key);
  if (existing) existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + Math.floor(quantity));
  else next.push({ key, id, variant, quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)) });
  return next;
}
export function setQuantity(cart, key, quantity) {
  if (!Number.isFinite(quantity)) return cart;
  if (quantity <= 0) return cart.filter(item => item.key !== key);
  return cart.map(item => item.key === key ? { ...item, quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)) } : item);
}
export function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).reduce((cart, item) => {
    try {
      if (!item || typeof item.quantity !== 'number' || item.quantity < 1) return cart;
      return addItem(cart, item.id, item.variant, item.quantity);
    } catch { return cart; }
  }, []);
}
export function totals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + lineInfo(item.id, item.variant).option.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : 700;
  return { subtotal, shipping, total: subtotal + shipping, count: cart.reduce((sum, item) => sum + item.quantity, 0) };
}
export function createOrder(cart, customer) {
  const items = sanitizeCart(cart);
  if (!items.length) throw new Error('Your bag is empty. Add some equipment before placing an order.');
  return { id: `OM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, date: new Date().toISOString(), customer: String(customer).trim().slice(0, 80), items, ...totals(items) };
}
