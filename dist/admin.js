import { orders, filterOrders, orderMetrics, weeklyActivity, localOrderTime, localOrderDate } from './admin-data.js';
import { money, escapeHTML as esc } from './data.js';

const state = { search: '', month: 'all', status: 'All', sort: 'newest', page: 1 };
const pageSize = 8;
const dialog = document.querySelector('#order-dialog');
const paths = {
  box: '<path d="m4 7 8-4 8 4v11l-8 4-8-4V7Zm0 0 8 4 8-4M12 11v11M8 5l8 4"/>',
  value: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
  average: '<path d="M4 18V9m8 9V4m8 14v-6M2 21h20"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
const badge = status => `<span class="status-badge ${status.toLowerCase()}"><i aria-hidden="true"></i>${status}</span>`;
const initials = name => name.split(' ').map(part => part[0]).join('');

function renderOverview() {
  const metrics = orderMetrics(orders);
  const cards = [
    { title: 'Total orders', value: metrics.count, icon: 'box', note: '5 in July · 6 in August · 5 in September', accent: '' },
    { title: 'Order value', value: money(metrics.revenue), icon: 'value', note: 'Includes $7 shipping per order', accent: '' },
    { title: 'Avg. order value', value: money(metrics.average), icon: 'average', note: 'Across all 16 orders', accent: '' },
    { title: 'To fulfill', value: String(metrics.processing).padStart(2, '0'), icon: 'clock', note: `${metrics.delivered} delivered · 2 on the way`, accent: 'pending-metric' },
  ];
  document.querySelector('#metrics').innerHTML = cards.map(card => `<article class="metric ${card.accent}"><div class="metric-label"><h2>${card.title}</h2><span>${icon(card.icon)}</span></div><strong>${card.value}</strong><p>${card.note}</p></article>`).join('');
  const weeks = weeklyActivity(orders);
  const peak = Math.max(...weeks.map(week => week.count));
  document.querySelector('#peak-label').textContent = `Peak week · ${peak} orders`;
  document.querySelector('#activity-chart').innerHTML = `<svg viewBox="0 0 650 110" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">Weekly orders from July to September 2026</title><desc id="chart-desc">${weeks.map(week => `Week of ${week.label}: ${week.count} orders`).join('; ')}</desc>${[0, 1, 2, 3].map(level => `<line x1="24" y1="${99 - level * 26}" x2="645" y2="${99 - level * 26}" stroke="#e9eef1" stroke-dasharray="3 4"/><text x="5" y="${103 - level * 26}" fill="#81929f" font-size="10">${level}</text>`).join('')}${weeks.map((week, index) => `<g><title>Week of ${week.label}: ${week.count} orders</title><rect x="${38 + index * 47}" y="${99 - week.count * 26}" width="25" height="${week.count * 26}" rx="4" fill="${week.count === peak ? '#258e81' : index === weeks.length - 1 ? '#314e60' : '#a4d8ce'}"/><text x="${50.5 + index * 47}" y="${91 - week.count * 26}" text-anchor="middle" fill="#617583" font-size="10">${week.count}</text></g>`).join('')}</svg>`;
}

function renderTable() {
  const matches = filterOrders(orders, state);
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  state.page = Math.min(pageCount, Math.max(1, state.page));
  const start = (state.page - 1) * pageSize;
  document.querySelector('#status-tabs').innerHTML = ['All', 'Processing', 'Shipped', 'Delivered'].map(status => {
    const count = orders.filter(order => status === 'All' || order.status === status).length;
    return `<button type="button" data-status="${status}" aria-pressed="${status === state.status}" class="status-tab ${status === state.status ? 'selected' : ''}">${status === 'All' ? 'All orders' : status}<span>${count}</span></button>`;
  }).join('');
  document.querySelector('#order-rows').innerHTML = matches.slice(start, start + pageSize).map(order => {
    const item = order.items[0];
    const additional = order.items.length - 1;
    return `<tr><td class="order-id"><button type="button" data-order="${order.id}" aria-label="View order ${order.id}">${order.id}</button><span>Online store</span></td><td><div class="product-cell"><img src="assets/${item.image}" alt="${esc(item.name)}" width="44" height="44"><div><strong>${esc(item.name)}</strong><span>${esc(item.variant)}${additional ? ` <b class="extra-items">+${additional} item</b>` : ` · Qty ${item.quantity}`}</span></div></div></td><td><div class="customer-cell"><strong>${esc(order.customer)}</strong><span>${esc(order.email)}</span></div></td><td class="amount">${money(order.total)}</td><td><div class="date-cell"><strong>${localOrderDate(order)}</strong><span>${localOrderTime(order)}</span></div></td><td><div class="address-cell"><strong>${esc(order.city)}, ${order.state} ${order.zip}</strong><span>${esc(order.street)}</span></div></td><td>${badge(order.status)}</td><td><button class="detail-button" type="button" data-order="${order.id}" aria-label="Open details for ${order.id}">${icon('arrow')}</button></td></tr>`;
  }).join('');
  document.querySelector('#empty-orders').hidden = matches.length > 0;
  document.querySelector('.table-scroll').hidden = matches.length === 0;
  document.querySelector('#result-label').textContent = matches.length ? `Showing ${start + 1}–${Math.min(start + pageSize, matches.length)} of ${matches.length} orders` : '0 orders match your filters';
  document.querySelector('#pagination').innerHTML = `<button type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>${Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}" ${state.page === index + 1 ? 'aria-current="page"' : ''} aria-label="Page ${index + 1}">${index + 1}</button>`).join('')}<button type="button" data-page="${state.page + 1}" ${state.page === pageCount ? 'disabled' : ''} aria-label="Next page">›</button>`;
}

function showDetails(id) {
  const order = orders.find(item => item.id === id);
  if (!order) return;
  const currentStep = ['Processing', 'Shipped', 'Delivered'].indexOf(order.status);
  document.querySelector('#order-detail').innerHTML = `<div class="detail-heading"><div><span class="overline">ORDER DETAILS</span><h2 id="detail-title">${order.id}</h2></div><button class="close-button" type="button" data-close aria-label="Close order details">${icon('close')}</button></div><div class="detail-body"><div class="detail-meta"><span>${localOrderDate(order)} · ${localOrderTime(order)}</span>${badge(order.status)}</div><div class="order-progress" aria-label="Order status: ${order.status}">${['Processing', 'Shipped', 'Delivered'].map((step, index) => `<div class="${index <= currentStep ? 'complete' : ''}"><span>${index < currentStep ? icon('check') : index + 1}</span><strong>${step}</strong></div>`).join('')}</div><h3 class="detail-section-title">Items <span>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</span></h3><div class="detail-items">${order.items.map(item => `<article><img src="assets/${item.image}" alt="${esc(item.name)}" width="64" height="64"><div><strong>${esc(item.name)}</strong><span>${esc(item.variant)}</span><small>Qty ${item.quantity} × ${money(item.unitPrice)}</small></div><b>${money(item.unitPrice * item.quantity)}</b></article>`).join('')}</div><div class="detail-totals"><div><span>Subtotal</span><strong>${money(order.subtotal)}</strong></div><div><span>Standard shipping</span><strong>${money(order.shipping)}</strong></div><div class="total"><span>Order total</span><strong>${money(order.total)} <small>USD</small></strong></div></div><div class="detail-customer"><span class="customer-avatar">${initials(order.customer)}</span><div><strong>${esc(order.customer)}</strong><span>${esc(order.email)}</span></div></div><div class="detail-address"><h3>Delivery address</h3><p>${esc(order.street)}<br>${esc(order.city)}, ${order.state} ${order.zip}<br>United States</p></div><div class="detail-bottom"><span>Channel</span><strong>Online store</strong><span>Customer time zone</span><strong>${order.timeZone.replaceAll('_', ' ')}</strong></div></div>`;
  dialog.showModal();
}

document.querySelector('#order-search').addEventListener('input', event => { state.search = event.target.value; state.page = 1; renderTable(); });
document.querySelector('#month-filter').addEventListener('change', event => { state.month = event.target.value; state.page = 1; renderTable(); });
document.querySelector('#order-sort').addEventListener('change', event => { state.sort = event.target.value; state.page = 1; renderTable(); });
document.querySelector('#reset-filters').addEventListener('click', () => {
  Object.assign(state, { search: '', month: 'all', status: 'All', sort: 'newest', page: 1 });
  document.querySelector('#order-search').value = '';
  document.querySelector('#month-filter').value = 'all';
  document.querySelector('#order-sort').value = 'newest';
  renderTable();
  document.querySelector('#order-search').focus();
});
document.addEventListener('click', event => {
  const orderButton = event.target.closest('[data-order]');
  if (orderButton) showDetails(orderButton.dataset.order);
  if (event.target.closest('[data-close]')) dialog.close();
  const tab = event.target.closest('[data-status]');
  if (tab) {
    state.status = tab.dataset.status; state.page = 1; renderTable();
    document.querySelector(`[data-status="${state.status}"]`).focus({ preventScroll: true });
  }
  const pageButton = event.target.closest('[data-page]');
  if (pageButton && !pageButton.disabled) {
    state.page = Number(pageButton.dataset.page); renderTable();
    document.querySelector(`#pagination [data-page="${state.page}"][aria-current]`).focus({ preventScroll: true });
  }
  const sectionLink = event.target.closest('[data-section]');
  if (sectionLink) {
    document.querySelectorAll('[data-section]').forEach(link => { link.classList.toggle('active', link === sectionLink); if (link === sectionLink) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
  }
});
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
renderOverview();
renderTable();
