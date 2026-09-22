import { productById } from './data.js';
import { createOrderReference } from './order-reference.js';

// Orders and customer identities are fictional; public gym addresses are sourced in docs/admin-address-sources.md.
// ISO offsets and IANA zones preserve the customer's local purchase time.
const records = [
  ['K7Q2', '2026-07-02T19:42:18-05:00', 'America/Chicago', 'Rachel Bennett', 'rachel.bennett84@gmail.com', '1807 W Slaughter Ln', 'Austin', 'TX', '78748', 'Delivered', [['round-dumbbells', 1, 1]]],
  ['3MXR', '2026-07-08T12:18:43-07:00', 'America/Los_Angeles', 'Daniel Nguyen', 'dnguyen.pdx@outlook.com', '1640 NE 122nd Ave', 'Portland', 'OR', '97230', 'Delivered', [['adjustable-bench', 0, 1]]],
  ['H9V4', '2026-07-17T20:36:07-04:00', 'America/New_York', 'Melissa Reynolds', 'mel.reynolds27@yahoo.com', '5404 Central Ave', 'Charlotte', 'NC', '28212', 'Delivered', [['starter-package', 0, 1]]],
  ['6BTF', '2026-07-18T10:24:52-06:00', 'America/Denver', 'Andrew Brooks', 'andrewb.denver@gmail.com', '1865 W Mississippi Ave', 'Denver', 'CO', '80223', 'Delivered', [['olympic-plates', 1, 1], ['round-dumbbells', 2, 1]]],
  ['RW8N', '2026-07-28T18:57:26-07:00', 'America/Los_Angeles', 'Sofia Ramirez', 'sofiar_92@icloud.com', '1725 Euclid Ave', 'San Diego', 'CA', '92105', 'Delivered', [['dumbbell-set', 0, 1]]],
  ['2JC5', '2026-08-04T21:13:39-04:00', 'America/New_York', 'Michael Hayes', 'mhayes.raleigh@gmail.com', '404 E Six Forks Rd', 'Raleigh', 'NC', '27609', 'Delivered', [['power-rack', 0, 1], ['olympic-plates', 2, 1]]],
  ['P4ZA', '2026-08-10T12:46:11-05:00', 'America/Chicago', 'Ashley Parker', 'ashley.parker615@hotmail.com', '5708 Charlotte Pike', 'Nashville', 'TN', '37209', 'Delivered', [['round-dumbbells', 0, 1]]],
  ['7DLY', '2026-08-11T19:08:34-04:00', 'America/New_York', 'James Cooper', 'jcooper.oh@gmail.com', '3614 Indianola Ave', 'Columbus', 'OH', '43214', 'Delivered', [['adjustable-bench', 0, 1], ['round-dumbbells', 1, 1]]],
  ['Q8F3', '2026-08-12T20:41:56-07:00', 'America/Los_Angeles', 'Jennifer Kim', 'jenn.kim86@outlook.com', '1500 NW Market St, Ste 100', 'Seattle', 'WA', '98107', 'Delivered', [['starter-package', 0, 1]]],
  ['V2EK', '2026-08-23T11:32:09-05:00', 'America/Chicago', 'Benjamin Olson', 'ben.olson.mn@gmail.com', '2852 26th Ave South', 'Minneapolis', 'MN', '55406', 'Delivered', [['olympic-plates', 0, 2]]],
  ['5GWN', '2026-08-29T16:19:47-07:00', 'America/Phoenix', 'Christina Foster', 'cfoster.az@yahoo.com', '3975 E Thomas Rd', 'Phoenix', 'AZ', '85018', 'Delivered', [['dumbbell-set', 0, 1]]],
  ['N6S9', '2026-09-03T18:24:22-04:00', 'America/New_York', 'Marcus Collins', 'marcus.collins81@gmail.com', '1599 Memorial Dr SE', 'Atlanta', 'GA', '30317', 'Delivered', [['power-rack', 0, 1]]],
  ['4YHB', '2026-09-09T20:16:51-05:00', 'America/Chicago', 'Priya Shah', 'priya.s.dallas@outlook.com', '4800 Columbia Avenue', 'Dallas', 'TX', '75226', 'Shipped', [['starter-package', 0, 1], ['olympic-plates', 0, 1]]],
  ['C3U7', '2026-09-15T12:39:16-07:00', 'America/Los_Angeles', 'William Ellis', 'will.ellis916@gmail.com', '5138 Stockton Blvd', 'Sacramento', 'CA', '95820', 'Shipped', [['round-dumbbells', 2, 1]]],
  ['9AKM', '2026-09-20T19:52:38-06:00', 'America/Denver', 'Rebecca Anderson', 'becca.anderson@icloud.com', '175 E 400 S, Ste 100', 'Salt Lake City', 'UT', '84111', 'Processing', [['adjustable-bench', 0, 1]]],
  ['T6R2', '2026-09-21T21:07:24-04:00', 'America/New_York', 'Emily Carter', 'emily.carter89@gmail.com', '3525 Washington Street', 'Boston', 'MA', '02130', 'Processing', [['dumbbell-set', 0, 1], ['olympic-plates', 0, 1]]],
];

const originalOrders = records.map(([suffix, placedAt, timeZone, customer, email, street, city, state, zip, status, lines]) => {
  const items = lines.map(([id, variantIndex, quantity]) => {
    const product = productById(id);
    const variant = product.variants[variantIndex];
    return { id, name: product.name, image: product.image, variant: variant.name, unitPrice: variant.price, quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return { id: createOrderReference(Date.parse(placedAt), suffix), placedAt, timeZone, customer, email, street, city, state, zip, country: 'United States', status, items, subtotal, shipping: 700, total: subtotal + 700 };
});

export const reportingPeriod = { start: '2026-06-25', end: '2026-09-22', days: 90 };
const dayMs = 86400000;
const firstNames = 'Alex Brandon Catherine David Erica Frank Gabrielle Hannah Isaac Jessica Kevin Lauren Matthew Natalie Oscar Patricia Quentin Robert Stephanie Thomas Vanessa Wesley Yvonne Zachary'.split(' ');
const lastNames = 'Adams Baker Chen Davis Edwards Flores Garcia Harris Irving Johnson Khan Lewis Martinez Nelson Ortiz Patel Quinn Robinson Scott Turner Underwood Walker Young Zhang'.split(' ');

// A fixed seed makes this a reproducible local dataset, never a live sales feed.
export function generateOrders(seed = 20260922) {
  let randomState = seed >>> 0;
  const random = () => ((randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0) / 4294967296);
  const integer = (min, max) => min + Math.floor(random() * (max - min + 1));
  const pick = values => values[integer(0, values.length - 1)];
  const weighted = (values, weights) => {
    let draw = random() * weights.reduce((sum, weight) => sum + weight, 0);
    return values.find((_, index) => (draw -= weights[index]) < 0) ?? values.at(-1);
  };
  const history = new Map();
  const result = [];
  let customerIndex = 0;
  const newCustomer = () => {
    const index = customerIndex++;
    const first = firstNames[index % firstNames.length];
    const last = lastNames[(Math.floor(index / firstNames.length) + (index % firstNames.length) * 7) % lastNames.length];
    const location = pick(originalOrders);
    const handle = pick([`${first}.${last}${integer(70, 99)}`, `${first[0]}${last}.${index + 12}`, `${first.toLowerCase()}_${last.toLowerCase()}${index + 3}`]).toLowerCase();
    return { customer: `${first} ${last}`, email: `${handle}@${pick(['gmail.com', 'gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com'])}`, street: location.street, city: location.city, state: location.state, zip: location.zip, timeZone: location.timeZone, offset: location.placedAt.slice(-6) };
  };
  const item = (id, variantIndex, quantity = 1) => {
    const product = productById(id);
    const variant = product.variants[variantIndex];
    return { id, name: product.name, image: product.image, variant: variant.name, unitPrice: variant.price, quantity };
  };
  const shoppingBag = previous => {
    const id = previous
      ? weighted(['round-dumbbells', 'olympic-plates'], [55, 45])
      : weighted(['round-dumbbells', 'olympic-plates', 'adjustable-bench', 'dumbbell-set', 'starter-package', 'power-rack'], [34, 23, 17, 12, 10, 4]);
    const priorWeight = previous?.items.find(line => line.id === id);
    const variantIndex = priorWeight
      ? Math.min(2, productById(id).variants.findIndex(v => v.name === priorWeight.variant) + 1)
      : productById(id).variants.length > 1 ? weighted([0, 1, 2], previous ? [10, 35, 55] : [35, 45, 20]) : 0;
    const items = [item(id, variantIndex, id === 'olympic-plates' && random() < 0.25 ? integer(2, 3) : 1)];
    if (id === 'power-rack' && random() < 0.8) items.push(item('olympic-plates', integer(0, 2)));
    if (id === 'adjustable-bench' && random() < 0.4) items.push(item('round-dumbbells', integer(0, 2)));
    return items;
  };
  for (let day = 0; day < reportingPeriod.days; day++) {
    const date = new Date(Date.parse(reportingPeriod.start) + day * dayMs);
    const dateText = date.toISOString().slice(0, 10);
    const weekday = date.getUTCDay();
    const weekend = weekday === 0 || weekday === 6;
    const monthEdge = date.getUTCDate() <= 3 || date.getUTCDate() >= 28;
    const lift = (weekend ? 1.6 : weekday === 2 || weekday === 3 ? -0.5 : 0) + (monthEdge ? 1.2 : 0) + Math.sin(day / 8) * 0.6;
    const count = weighted([3, 4, 5, 6], [25 - lift * 6, 32 - lift * 3, 27 + lift * 3, 16 + lift * 6]);
    const daily = originalOrders.filter(order => order.placedAt.startsWith(dateText)).map(order => ({ ...order }));
    for (const order of daily) history.set(order.email, { profile: { ...order, offset: order.placedAt.slice(-6) }, day, order });
    while (daily.length < count) {
      const returning = [...history.values()].filter(entry => day - entry.day >= 14);
      const prior = returning.length && random() < 0.32 ? pick(returning) : null;
      const customer = prior ? prior.profile : newCustomer();
      const band = weighted(weekend ? [[9, 12], [13, 17], [18, 22]] : [[7, 10], [11, 13], [14, 17], [18, 22]], weekend ? [30, 25, 45] : [7, 23, 12, 58]);
      const time = [integer(...band), integer(0, 59), integer(0, 59)].map(value => String(value).padStart(2, '0')).join(':');
      const placedAt = `${dateText}T${time}${customer.offset}`;
      const items = shoppingBag(prior?.order);
      const subtotal = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
      const { offset, ...profile } = customer;
      const order = { ...profile, id: createOrderReference(Date.parse(placedAt), integer(0, 36 ** 4 - 1).toString(36).padStart(4, '0')), placedAt, country: 'United States', items, subtotal, shipping: 700, total: subtotal + 700 };
      daily.push(order);
      history.set(customer.email, { profile: customer, day, order });
    }
    for (const order of daily) {
      const age = reportingPeriod.days - 1 - day;
      order.status = age <= 1 || (age === 2 && random() < 0.35) ? 'Processing' : age <= 6 ? 'Shipped' : 'Delivered';
    }
    result.push(...daily);
  }
  return result.sort((a, b) => Date.parse(a.placedAt) - Date.parse(b.placedAt));
}

export const orders = generateOrders();

export function pageNumbers(page, count) {
  const pages = [...new Set([1, count, page - 1, page, page + 1])].filter(value => value >= 1 && value <= count).sort((a, b) => a - b);
  return pages.flatMap((value, index) => index && value - pages[index - 1] > 1 ? ['…', value] : [value]);
}

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
  const firstDay = new Date(reportingPeriod.start);
  const start = firstDay.getTime() - ((firstDay.getUTCDay() + 6) % 7) * dayMs;
  const weekMs = 7 * 86400000;
  const weekCount = Math.floor((Date.parse(reportingPeriod.end) - start) / weekMs) + 1;
  return Array.from({ length: weekCount }, (_, index) => {
    const date = new Date(start + index * weekMs);
    const count = source.filter(order => Math.floor((Date.parse(order.placedAt.slice(0, 10) + 'T00:00:00Z') - start) / weekMs) === index).length;
    return { label: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' }).format(date), count };
  });
}
