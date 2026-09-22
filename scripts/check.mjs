import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { products, defaultVariant } from '../dist/data.js';
import { homePage, shopPage, productPage, aboutPage, contactPage, cartPage, checkoutPage, confirmationPage, notFoundPage } from '../dist/pages.js';
import { addItem, createOrder } from '../dist/store.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const file of await readdir(resolve(root, 'dist'))) {
  if (file.endsWith('.js')) execFileSync(process.execPath, ['--check', resolve(root, 'dist', file)]);
}
execFileSync(process.execPath, ['--check', resolve(root, 'server.mjs')]);
const cart = addItem([], products[0].id, defaultVariant(products[0]), 1);
const pages = [homePage(), shopPage(), ...products.map(productPage), aboutPage(), contactPage(), cartPage([]), cartPage(cart), checkoutPage([]), checkoutPage(cart), confirmationPage(null), confirmationPage(createOrder(cart, 'Demo')), notFoundPage()];
const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const all = [html, ...pages].join('\n');
const assets = new Set([...all.matchAll(/(?:src|href)="(assets\/[^"?#]+|styles\.css|app\.js)"/g)].map(match => match[1]));
for (const asset of assets) await access(resolve(root, 'dist', asset));
for (const product of products) {
  assert.equal(product.variants.find(v => v.name === defaultVariant(product)).price, product.price);
  for (const asset of product.images) await access(resolve(root, 'dist/assets', asset));
}
assert.ok(!/(?:src|href)="https?:\/\//i.test(all), 'Public pages must not depend on external resources or links');
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon/.test(await readFile(resolve(root, 'dist/app.js'), 'utf8')), 'Demo app must not transmit form data');
for (const [index, page] of pages.entries()) assert.match(page, /<h1\b/, `Page ${index} needs a main heading`);
console.log(`PASS: JavaScript syntax, ${pages.length} page renderings, ${assets.size} local resources, ${products.length} catalog records, and no external requests.`);
