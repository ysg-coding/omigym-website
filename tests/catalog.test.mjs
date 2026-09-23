import test from 'node:test';
import assert from 'node:assert/strict';
import { products, categories, defaultVariant } from '../dist/data.js';
import { addItem, createOrder, totals } from '../dist/store.js';

test('catalog has 21 unique products with valid categories and complete detail records', () => {
  assert.equal(products.length, 21);
  assert.equal(new Set(products.map(p => p.id)).size, 21);
  for (const p of products) {
    assert.ok(categories.includes(p.category));
    assert.ok(p.description && p.subtitle && p.features.length >= 3 && p.specs.length >= 3);
    assert.ok(p.images.includes(p.image));
    assert.equal(p.variants.find(v => v.name === defaultVariant(p)).price, p.price);
  }
});

test('every new product variant can be purchased with its own catalog price and $7 shipping', () => {
  const added = products.slice(6);
  assert.equal(added.length, 15);
  assert.equal(new Set(added.map(p => p.image)).size, 15);
  for (const p of added) for (const variant of p.variants) {
    assert.ok(Number.isInteger(variant.price) && variant.price > 0);
    const cart = addItem([], p.id, variant.name, 2);
    assert.equal(totals(cart).total, variant.price * 2 + 700);
    const order = createOrder(cart, 'Preview');
    assert.equal(order.items[0].id, p.id);
    assert.equal(order.items[0].variant, variant.name);
    assert.equal(order.total, variant.price * 2 + 700);
  }
});
