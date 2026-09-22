import test from 'node:test';
import assert from 'node:assert/strict';
import { orders, filterOrders, orderMetrics, weeklyActivity, localOrderTime } from '../dist/admin-data.js';

test('sixteen orders cover three months with valid product prices and fixed shipping', () => {
  assert.equal(orders.length, 16);
  assert.equal(new Set(orders.map(order => order.id)).size, 16);
  const counts = Object.fromEntries(['07', '08', '09'].map(month => [month, orders.filter(order => order.placedAt.slice(5, 7) === month).length]));
  assert.deepEqual(counts, { '07': 5, '08': 6, '09': 5 });
  for (const order of orders) {
    assert.equal(order.shipping, 700);
    assert.equal(order.total, order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) + 700);
    assert.ok(order.items.every(item => item.name && item.image && item.quantity > 0));
    assert.ok(Date.parse(order.placedAt) < Date.parse('2026-09-23T00:00:00Z'));
  }
});
test('search, month and status filters compose, and unknown searches return an empty list', () => {
  assert.equal(filterOrders(orders, { search: 'emily', month: '2026-09', status: 'Processing' }).length, 1);
  assert.equal(filterOrders(orders, { search: 'nonexistent-customer' }).length, 0);
  assert.equal(filterOrders(orders, { month: '2026-08' }).length, 6);
  assert.equal(filterOrders(orders, { status: 'Shipped' }).length, 2);
  const ascending = filterOrders(orders, { sort: 'oldest' });
  assert.ok(Date.parse(ascending[0].placedAt) < Date.parse(ascending.at(-1).placedAt));
});
test('weekly counts conserve all orders and include peaks and quiet weeks', () => {
  const weeks = weeklyActivity(orders);
  assert.equal(weeks.reduce((sum, week) => sum + week.count, 0), 16);
  assert.ok(weeks.some(week => week.count === 0));
  assert.ok(weeks.some(week => week.count >= 3));
});
test('local order hours match the supplied US customer time zone, not the browser zone', () => {
  const latest = orders.find(order => order.customer === 'Emily Carter');
  assert.match(localOrderTime(latest), /9:07 PM/);
  assert.match(localOrderTime(latest), /EDT/);
});
test('summary metrics stay consistent for populated and empty results', () => {
  const metrics = orderMetrics(orders);
  assert.equal(metrics.revenue, orders.reduce((sum, order) => sum + order.total, 0));
  assert.equal(metrics.count, 16);
  assert.equal(metrics.processing, 2);
  assert.equal(metrics.delivered, 12);
  assert.deepEqual(orderMetrics([]), { count: 0, revenue: 0, average: 0, processing: 0, delivered: 0 });
});
