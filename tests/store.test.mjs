import test from 'node:test';
import assert from 'node:assert/strict';
import { addItem, setQuantity, sanitizeCart, totals, createOrder } from '../dist/store.js';

test('same variant merges while distinct weights stay separate', () => {
  let cart = addItem([], 'round-dumbbells', '7.5 kg pair', 1);
  cart = addItem(cart, 'round-dumbbells', '7.5 kg pair', 2);
  cart = addItem(cart, 'round-dumbbells', '5 kg pair', 1);
  assert.equal(cart.length, 2);
  assert.equal(cart[0].quantity, 3);
});
test('quantities are bounded and zero removes the line', () => {
  const cart = addItem([], 'round-dumbbells', '7.5 kg pair', 99);
  assert.equal(cart[0].quantity, 20);
  assert.equal(setQuantity(cart, cart[0].key, 0).length, 0);
  assert.throws(() => addItem([], 'missing', 'x', 1));
  assert.throws(() => addItem([], 'round-dumbbells', 'unknown', 1));
});
test('damaged or injected storage cannot introduce unknown products or bad quantities', () => {
  assert.deepEqual(sanitizeCart(null), []);
  assert.deepEqual(sanitizeCart({ length: 1 }), []);
  assert.deepEqual(sanitizeCart([{ id: 'missing', variant: 'x', quantity: 5 }]), []);
  assert.deepEqual(sanitizeCart([{ id: 'round-dumbbells', variant: '7.5 kg pair', quantity: -1 }]), []);
  assert.deepEqual(sanitizeCart([{ id: 'round-dumbbells', variant: '7.5 kg pair', quantity: 'bad' }]), []);
});
test('totals use actual catalog prices, a fixed $7 shipping fee and integer cents', () => {
  const cart = addItem([], 'round-dumbbells', '7.5 kg pair', 1);
  const quote = totals(cart);
  assert.equal(quote.subtotal, 8900);
  assert.equal(quote.shipping, 700);
  assert.equal(quote.total, 9600);
  assert.equal(totals(addItem(cart, 'round-dumbbells', '7.5 kg pair', 1)).shipping, 700);
  assert.equal(totals([]).total, 0);
});
test('orders snapshot cart and cannot be created empty', () => {
  assert.throws(() => createOrder([], 'Avery'));
  const cart = addItem([], 'round-dumbbells', '7.5 kg pair', 1);
  const order = createOrder(cart, 'Avery');
  assert.match(order.id, /^OM-/);
  assert.equal(order.total, 9600);
  cart[0].quantity = 10;
  assert.equal(order.items[0].quantity, 1);
  assert.equal(order.customer, 'Avery');
});
