// Fixed suffixes keep historical fixtures stable; new checkout orders get a random suffix.
export function createOrderReference(timestamp = Date.now(), suffix = Math.random().toString(36).slice(2, 6).padEnd(4, '0')) {
  return `OM-${timestamp.toString(36).toUpperCase()}-${suffix.toUpperCase()}`;
}
