import { productById } from './data.js';
import { createOrderReference } from './order-reference.js';

// Fictional fixtures only. ISO offsets and IANA zones preserve the customer's local purchase time.
const records = [
  ['K7Q2', '2026-07-02T19:42:18-05:00', 'America/Chicago', 'Rachel Bennett', 'rachel.bennett84@gmail.com', '4816 S 3rd St', 'Austin', 'TX', '78745', 'Delivered', [['round-dumbbells', 1, 1]]],
  ['3MXR', '2026-07-08T12:18:43-07:00', 'America/Los_Angeles', 'Daniel Nguyen', 'dnguyen.pdx@outlook.com', '2738 SE Taylor St, Apt 4', 'Portland', 'OR', '97214', 'Delivered', [['adjustable-bench', 0, 1]]],
  ['H9V4', '2026-07-17T20:36:07-04:00', 'America/New_York', 'Melissa Reynolds', 'mel.reynolds27@yahoo.com', '1824 Chatham Ave', 'Charlotte', 'NC', '28205', 'Delivered', [['starter-package', 0, 1]]],
  ['6BTF', '2026-07-18T10:24:52-06:00', 'America/Denver', 'Andrew Brooks', 'andrewb.denver@gmail.com', '3547 W 35th Ave', 'Denver', 'CO', '80211', 'Delivered', [['olympic-plates', 1, 1], ['round-dumbbells', 2, 1]]],
  ['RW8N', '2026-07-28T18:57:26-07:00', 'America/Los_Angeles', 'Sofia Ramirez', 'sofiar_92@icloud.com', '4216 Illinois St, Unit 6', 'San Diego', 'CA', '92104', 'Delivered', [['dumbbell-set', 0, 1]]],
  ['2JC5', '2026-08-04T21:13:39-04:00', 'America/New_York', 'Michael Hayes', 'mhayes.raleigh@gmail.com', '5817 Cedarwood Dr', 'Raleigh', 'NC', '27609', 'Delivered', [['power-rack', 0, 1], ['olympic-plates', 2, 1]]],
  ['P4ZA', '2026-08-10T12:46:11-05:00', 'America/Chicago', 'Ashley Parker', 'ashley.parker615@hotmail.com', '1423 Eastland Ave, Apt B', 'Nashville', 'TN', '37206', 'Delivered', [['round-dumbbells', 0, 1]]],
  ['7DLY', '2026-08-11T19:08:34-04:00', 'America/New_York', 'James Cooper', 'jcooper.oh@gmail.com', '2638 N 4th St', 'Columbus', 'OH', '43202', 'Delivered', [['adjustable-bench', 0, 1], ['round-dumbbells', 1, 1]]],
  ['Q8F3', '2026-08-12T20:41:56-07:00', 'America/Los_Angeles', 'Jennifer Kim', 'jenn.kim86@outlook.com', '4827 Interlake Ave N', 'Seattle', 'WA', '98103', 'Delivered', [['starter-package', 0, 1]]],
  ['V2EK', '2026-08-23T11:32:09-05:00', 'America/Chicago', 'Benjamin Olson', 'ben.olson.mn@gmail.com', '3624 38th Ave S', 'Minneapolis', 'MN', '55406', 'Delivered', [['olympic-plates', 0, 2]]],
  ['5GWN', '2026-08-29T16:19:47-07:00', 'America/Phoenix', 'Christina Foster', 'cfoster.az@yahoo.com', '2631 E Campbell Ave, Unit 12', 'Phoenix', 'AZ', '85016', 'Delivered', [['dumbbell-set', 0, 1]]],
  ['N6S9', '2026-09-03T18:24:22-04:00', 'America/New_York', 'Marcus Collins', 'marcus.collins81@gmail.com', '1426 Glenwood Ave SE', 'Atlanta', 'GA', '30316', 'Delivered', [['power-rack', 0, 1]]],
  ['4YHB', '2026-09-09T20:16:51-05:00', 'America/Chicago', 'Priya Shah', 'priya.s.dallas@outlook.com', '5813 Richmond Ave', 'Dallas', 'TX', '75206', 'Shipped', [['starter-package', 0, 1], ['olympic-plates', 0, 1]]],
  ['C3U7', '2026-09-15T12:39:16-07:00', 'America/Los_Angeles', 'William Ellis', 'will.ellis916@gmail.com', '2735 6th Ave', 'Sacramento', 'CA', '95818', 'Shipped', [['round-dumbbells', 2, 1]]],
  ['9AKM', '2026-09-20T19:52:38-06:00', 'America/Denver', 'Rebecca Anderson', 'becca.anderson@icloud.com', '1648 S 1100 E', 'Salt Lake City', 'UT', '84105', 'Processing', [['adjustable-bench', 0, 1]]],
  ['T6R2', '2026-09-21T21:07:24-04:00', 'America/New_York', 'Emily Carter', 'emily.carter89@gmail.com', '38 Boynton St, Apt 2', 'Boston', 'MA', '02130', 'Processing', [['dumbbell-set', 0, 1], ['olympic-plates', 0, 1]]],
];

export const orders = records.map(([suffix, placedAt, timeZone, customer, email, street, city, state, zip, status, lines]) => {
  const items = lines.map(([id, variantIndex, quantity]) => {
    const product = productById(id);
    const variant = product.variants[variantIndex];
    return { id, name: product.name, image: product.image, variant: variant.name, unitPrice: variant.price, quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { id: createOrderReference(Date.parse(placedAt), suffix), placedAt, timeZone, customer, email, street, city, state, zip, country: 'United States', status, items, subtotal, shipping: 700, total: subtotal + 700 };
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
