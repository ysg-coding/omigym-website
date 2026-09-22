import test from 'node:test';
import assert from 'node:assert/strict';
import { orders, generateOrders, pageNumbers, filterOrders, orderMetrics, weeklyActivity, localOrderTime } from '../dist/admin-data.js';
import { productById } from '../dist/data.js';

test('90 consecutive local days each have 3–6 orders with all four counts represented', () => {
  const days = new Map();
  for (const order of orders) days.set(order.placedAt.slice(0, 10), (days.get(order.placedAt.slice(0, 10)) || 0) + 1);
  assert.equal(days.size, 90);
  for (let day = 0; day < 90; day++) {
    const date = new Date(Date.UTC(2026, 5, 25 + day)).toISOString().slice(0, 10);
    assert.ok(days.get(date) >= 3 && days.get(date) <= 6, date);
  }
  assert.deepEqual([...new Set(days.values())].sort(), [3, 4, 5, 6]);
});
test('references are unique, encode purchase timestamps, and totals use catalog prices', () => {
  assert.equal(new Set(orders.map(o => o.id)).size, orders.length);
  for (const order of orders) {
    assert.match(order.id, /^OM-[A-Z0-9]+-[A-Z0-9]{4}$/);
    assert.equal(parseInt(order.id.split('-')[1], 36), Date.parse(order.placedAt));
    assert.equal(order.shipping, 700);
    assert.equal(order.total, order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) + 700);
    for (const item of order.items) {
      assert.equal(item.unitPrice, productById(item.id).variants.find(v => v.name === item.variant).price);
      assert.ok(item.quantity >= 1 && item.quantity <= 3);
    }
  }
});
test('combined filters, June filtering, reference search and chronological sorting work', () => {
  assert.deepEqual(filterOrders(orders, { search: orders[0].id }), [orders[0]]);
  assert.equal(filterOrders(orders, { search: 'boston', month: '2026-09', status: 'Delivered' }).length,
    orders.filter(o => o.city === 'Boston' && o.placedAt.startsWith('2026-09') && o.status === 'Delivered').length);
  assert.equal(filterOrders(orders, { search: 'nonexistent-customer' }).length, 0);
  assert.ok(filterOrders(orders, { month: '2026-06' }).length >= 18);
  const ascending = filterOrders(orders, { sort: 'oldest' });
  assert.ok(ascending.every((o, i) => i === 0 || Date.parse(o.placedAt) >= Date.parse(ascending[i - 1].placedAt)));
});
test('weekly chart includes both partial boundary weeks and conserves all orders', () => {
  const weeks = weeklyActivity(orders);
  assert.equal(weeks[0].label, 'Jun 22');
  assert.equal(weeks.at(-1).label, 'Sep 21');
  assert.equal(weeks.reduce((sum, week) => sum + week.count, 0), orders.length);
  assert.ok(new Set(weeks.slice(1, -1).map(w => w.count)).size > 3);
});
test('repeat customers keep their identity and address with a minimum two-week interval', () => {
  const history = new Map();
  for (const order of filterOrders(orders, { sort: 'oldest' })) {
    const prior = history.get(order.email);
    if (prior) {
      assert.equal(order.customer, prior.customer);
      assert.equal(order.street, prior.street);
      assert.ok(Date.parse(order.placedAt.slice(0, 10)) - Date.parse(prior.placedAt.slice(0, 10)) >= 14 * 86400000);
    }
    history.set(order.email, order);
  }
  assert.ok(history.size > 150);
  assert.ok(history.size < orders.length * 0.9);
  assert.equal(new Set(orders.map(o => o.street)).size, 16);
});
test('US local dates and evening bias hold and recent orders have appropriate fulfillment', () => {
  assert.match(localOrderTime(orders.find(o => o.id.endsWith('-T6R2'))), /9:07 PM.*EDT/);
  let evening = 0;
  for (const order of orders) {
    const local = new Intl.DateTimeFormat('en-CA', { timeZone: order.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(order.placedAt));
    assert.equal(local, order.placedAt.slice(0, 10));
    const hour = Number(order.placedAt.slice(11, 13));
    if (hour >= 18 && hour <= 22) evening++;
    if (order.placedAt.slice(0, 10) < '2026-09-15') assert.equal(order.status, 'Delivered');
    if (order.placedAt.startsWith('2026-09-22')) assert.equal(order.status, 'Processing');
  }
  assert.ok(evening > orders.length * 0.4);
});
test('summary metrics are correct for full and empty results', () => {
  const metrics = orderMetrics(orders);
  assert.equal(metrics.revenue, orders.reduce((sum, order) => sum + order.total, 0));
  assert.equal(metrics.count, orders.length);
  assert.equal(metrics.processing, orders.filter(o => o.status === 'Processing').length);
  assert.equal(metrics.delivered, orders.filter(o => o.status === 'Delivered').length);
  assert.deepEqual(orderMetrics([]), { count: 0, revenue: 0, average: 0, processing: 0, delivered: 0 });
});

test('reloading keeps the same dataset and changing the seed changes generated orders', () => {
  assert.deepEqual(generateOrders(), orders);
  assert.notDeepEqual(generateOrders(72).map(o => o.id), orders.map(o => o.id));
});

test('pagination stays compact and includes current page, neighbours and boundaries', () => {
  assert.deepEqual(pageNumbers(1, 1), [1]);
  assert.deepEqual(pageNumbers(1, 50), [1, 2, '…', 50]);
  assert.deepEqual(pageNumbers(25, 50), [1, '…', 24, 25, 26, '…', 50]);
  assert.deepEqual(pageNumbers(50, 50), [1, '…', 49, 50]);
});
