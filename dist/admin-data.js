import { productById } from './data.js';

// Fictional fixtures only. ISO offsets and IANA zones preserve the customer's local purchase time.
const records = [
  ['1041', '2026-07-02T19:42:00-05:00', 'America/Chicago', 'Olivia Bennett', 'olivia.bennett@example.com', '4821 Juniper Hollow Dr', 'Austin', 'TX', '78745', 'Delivered', [['round-dumbbells', 1, 1]]],
  ['1042', '2026-07-08T12:18:00-07:00', 'America/Los_Angeles', 'Noah Sullivan', 'noah.sullivan@example.com', '736 Alder Grove Ave', 'Portland', 'OR', '97214', 'Delivered', [['adjustable-bench', 0, 1]]],
  ['1043', '2026-07-17T20:36:00-04:00', 'America/New_York', 'Mia Reynolds', 'mia.reynolds@example.com', '218 Meadowlark Way', 'Charlotte', 'NC', '28205', 'Delivered', [['starter-package', 0, 1]]],
  ['1044', '2026-07-18T10:24:00-06:00', 'America/Denver', 'Ethan Brooks', 'ethan.brooks@example.com', '905 Aspen Ridge Ln', 'Denver', 'CO', '80211', 'Delivered', [['olympic-plates', 1, 1], ['round-dumbbells', 2, 1]]],
  ['1045', '2026-07-28T18:57:00-07:00', 'America/Los_Angeles', 'Sophia Mitchell', 'sophia.mitchell@example.com', '1642 Willow Terrace', 'San Diego', 'CA', '92104', 'Delivered', [['dumbbell-set', 0, 1]]],
  ['1046', '2026-08-04T21:13:00-04:00', 'America/New_York', 'Lucas Hayes', 'lucas.hayes@example.com', '357 Briarstone Rd', 'Raleigh', 'NC', '27609', 'Delivered', [['power-rack', 0, 1], ['olympic-plates', 2, 1]]],
  ['1047', '2026-08-10T12:46:00-05:00', 'America/Chicago', 'Amelia Parker', 'amelia.parker@example.com', '621 Cottonwood Ct', 'Nashville', 'TN', '37206', 'Delivered', [['round-dumbbells', 0, 1]]],
  ['1048', '2026-08-11T19:08:00-04:00', 'America/New_York', 'James Cooper', 'james.cooper@example.com', '148 Maple Crest St', 'Columbus', 'OH', '43202', 'Delivered', [['adjustable-bench', 0, 1], ['round-dumbbells', 1, 1]]],
  ['1049', '2026-08-12T20:41:00-07:00', 'America/Los_Angeles', 'Isabella Morgan', 'isabella.morgan@example.com', '2846 Cedarbrook Ave', 'Seattle', 'WA', '98103', 'Delivered', [['starter-package', 0, 1]]],
  ['1050', '2026-08-23T11:32:00-05:00', 'America/Chicago', 'Benjamin Reed', 'benjamin.reed@example.com', '793 Oakfield Dr', 'Minneapolis', 'MN', '55406', 'Delivered', [['olympic-plates', 0, 2]]],
  ['1051', '2026-08-29T16:19:00-07:00', 'America/Phoenix', 'Charlotte Foster', 'charlotte.foster@example.com', '5128 Desert Finch Ln', 'Phoenix', 'AZ', '85016', 'Delivered', [['dumbbell-set', 0, 1]]],
  ['1052', '2026-09-03T18:24:00-04:00', 'America/New_York', 'Henry Collins', 'henry.collins@example.com', '439 Brookside Terrace', 'Atlanta', 'GA', '30316', 'Delivered', [['power-rack', 0, 1]]],
  ['1053', '2026-09-09T20:16:00-05:00', 'America/Chicago', 'Ava Lawson', 'ava.lawson@example.com', '1865 Prairie View Dr', 'Dallas', 'TX', '75206', 'Shipped', [['starter-package', 0, 1], ['olympic-plates', 0, 1]]],
  ['1054', '2026-09-15T12:39:00-07:00', 'America/Los_Angeles', 'William Ellis', 'william.ellis@example.com', '927 Laurel Point Ave', 'Sacramento', 'CA', '95818', 'Shipped', [['round-dumbbells', 2, 1]]],
  ['1055', '2026-09-20T19:52:00-06:00', 'America/Denver', 'Grace Anderson', 'grace.anderson@example.com', '304 Silver Birch Way', 'Salt Lake City', 'UT', '84105', 'Processing', [['adjustable-bench', 0, 1]]],
  ['1056', '2026-09-21T21:07:00-04:00', 'America/New_York', 'Emily Carter', 'emily.carter@example.com', '862 Harbor Elm St', 'Boston', 'MA', '02130', 'Processing', [['dumbbell-set', 0, 1], ['olympic-plates', 0, 1]]],
];

export const orders = records.map(([number, placedAt, timeZone, customer, email, street, city, state, zip, status, lines]) => {
  const items = lines.map(([id, variantIndex, quantity]) => {
    const product = productById(id);
    const variant = product.variants[variantIndex];
    return { id, name: product.name, image: product.image, variant: variant.name, unitPrice: variant.price, quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { id: `OM-${number}`, placedAt, timeZone, customer, email, street, city, state, zip, country: 'United States', status, items, subtotal, shipping: 700, total: subtotal + 700 };
});

export function localOrderTime(order) {
  return new Intl.DateTimeFormat('en-US', { timeZone: order.timeZone, hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' }).format(new Date(order.placedAt));
}
export function localOrderDate(order) {
  return new Intl.DateTimeFormat('en-US', { timeZone: order.timeZone, month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.placedAt));
}
export function filterOrders(source, { search = '', month = 'all', status = 'All', sort = 'newest' } = {}) {
  const query = search.trim().toLowerCase();
  return source.filter(order => (month === 'all' || order.placedAt.startsWith(month)) && (status === 'All' || order.status === status) && [order.id, order.customer, order.email, order.street, order.city, order.state, order.zip, ...order.items.map(item => item.name)].join(' ').toLowerCase().includes(query))
    .sort((a, b) => (sort === 'oldest' ? 1 : -1) * (Date.parse(a.placedAt) - Date.parse(b.placedAt)));
}
export function orderMetrics(source) {
  const revenue = source.reduce((sum, order) => sum + order.total, 0);
  return { count: source.length, revenue, average: source.length ? Math.round(revenue / source.length) : 0, processing: source.filter(order => order.status === 'Processing').length, delivered: source.filter(order => order.status === 'Delivered').length };
}
export function weeklyActivity(source) {
  const start = Date.parse('2026-06-29T00:00:00Z');
  const weekMs = 7 * 86400000;
  return Array.from({ length: 13 }, (_, index) => {
    const date = new Date(start + index * weekMs);
    const count = source.filter(order => Math.floor((Date.parse(order.placedAt.slice(0, 10) + 'T00:00:00Z') - start) / weekMs) === index).length;
    return { label: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' }).format(date), count };
  });
}
