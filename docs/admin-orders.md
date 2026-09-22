# Order administration page

Branch: `feature/admin-orders`. URL: `/admin.html`.

Build a separate static administration surface using a navy sidebar, pale slate workspace and teal accents. Keep all storefront assets and routes intact. Reuse the six existing product records and their pictures, with $7 shipping per order.

Provide 16 entirely fictional US orders for July–September 2026, distributed 5 / 6 / 5 by month. Use varied dates, a quiet week and a small mid-August peak. Local timestamps favor lunch breaks and evenings, with a few weekend late-morning/afternoon purchases. This is an illustrative distribution, not an empirical claim about US shopping behavior. Each address and customer is fabricated and emails use example.com. Render times using each customer's named US time zone so browser location cannot shift them.

Deliverables: four summary metrics, weekly volume chart, searchable order table, status and month filters, date sorting, pagination and read-only order detail dialog. Include product thumbnail, configuration, customer, amount, local date/time, delivery address and status. No payment, database, authentication or real order processing. These fixtures are separate from the storefront's session orders.

Validation: data totals/month distribution/time zones/filtering unit tests, source/resource checks, browser desktop and mobile inspections, filtering, paging, dialog keyboard behavior. Only local files; no new dependencies or remote deployment.

## Verification results

- All 10 tests pass (5 storefront rules + 5 admin data/query rules).
- Source check passes: 17 storefront renderings, admin markup, 11 local assets/scripts, all 16 orders and no external requests.
- Browser: initial eight rows; page 2 shows rows 9–16; August filter shows six rows; name search for Cooper finds OM-1048 with two products and $345 total including $7 shipping.
- Processing filter shows two rows; combining with July produces a recoverable empty state; clearing filters restores records; oldest-first starts with July 2.
- Detail dialog opens correctly, closes with Escape and returns focus to its originating order button.
- 390px mobile viewport: document width and scrollWidth both 375px, table alone scrolls horizontally; all loaded product images valid; two-line order details readable in the dialog.
- Desktop document width and scrollWidth both 1265px after containing the table's visually hidden column label.
- Independent review found insufficient contrast in required row metadata; colors were darkened and operational font sizes increased. Status badge foregrounds were also darkened. No functional findings remained.

The overview is always the complete three-month period; the table filters affect only the records below it. Total order value is $5,360.00 including shipping, average $335.00. Fixtures are read-only and remain independent of checkout-session data.
