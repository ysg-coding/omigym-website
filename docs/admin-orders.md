# Order administration page

Branch: `admin`. URL: `/admin.html`.

The static workspace uses a navy sidebar and a slate/teal dashboard. Products, pictures, variant prices, order-reference format and fixed $7 shipping come from the existing storefront. No database, payment, login or external requests are involved.

## Reporting period and generated orders

The report covers **June 25–September 22, 2026**, exactly 90 local calendar days. A seeded generator in `dist/admin-data.js` preserves the original 16 orders and fills every day to 3–6 orders. The default seed is 20260922; refreshing never changes IDs, customers, timestamps or totals. This is a fixed historical simulation, not a rolling live feed.

Current output: **409 orders, 300 customers, 109 repeat purchases**. June has 31 orders, July 140, August 140 and September 98. Total value including shipping is **$86,904.00**, average **$212.48**. Status counts are 382 delivered, 19 shipped and 8 processing.

## Illustrative purchasing rules

These are designed fictional patterns, not empirical claims about American shoppers.

- Daily counts are drawn from 3, 4, 5 and 6 with weighted randomness. Weekend and month-edge weights are higher, Tuesday/Wednesday quieter, and a gentle multiweek variation avoids a rigid repeating schedule.
- The resulting weekend average is 4.77 orders/day versus 4.45 on weekdays. The first three and last four calendar days of each month average 4.75 versus 4.49 on other dates.
- Weekday time-band weights: morning 07–10 (7%), lunch 11–13 (23%), afternoon 14–17 (12%), evening 18–22 (58%). Weekend weights: 09–12 (30%), 13–17 (25%), 18–22 (45%). Minutes and seconds vary. Actual output includes 215 evening orders.
- Time is local to the customer's US city, including Arizona's distinct offset. All dates lie in the fixed summer interval, so copied summer offsets remain valid; a different season would require daylight-saving-aware offset generation.
- After a customer has waited at least 14 local calendar days, a 32% selection chance may produce a repeat order. The customer's name, email, address and time zone stay consistent. New profiles use synthetic combinations of names and email handles.
- First-order product weights: dumbbells 34%, plates 23%, bench 17%, dumbbell collection 12%, starter package 10%, rack 4%.
- Repeat orders buy dumbbells or plates, favouring heavier options. A repeated weight progresses one available variant up, capped at the largest.
- Racks frequently pair with plates; benches sometimes pair with dumbbells. Plate quantities occasionally reach 2–3 pairs, while large equipment stays at quantity 1. Totals always use catalog prices in integer cents.
- Orders 0–1 days old are processing; some two-day-old orders remain processing. Other orders up to six days old are shipped, and older ones delivered, as of the end of the reporting period.

Delivery addresses reuse the 16 public gym business addresses documented in [address sources](admin-address-sources.md). Customer identities and transactions have no real association with those businesses.

## Dashboard behavior

Totals, badges, month options and the weekly chart are calculated from the order data. The chart scales to the current peak and includes partial weeks at both boundaries. Overview metrics always describe the full 90 days; filters affect the table only.

Search matches order reference, customer, email, product and address. Month/status filters compose with search. Date sorting uses actual instants, while row dates remain in each customer's local time zone. Pagination shows eight orders per page, with first/last/current/adjacent pages and ellipses. The mobile footer wraps onto two lines.

References use the same generator as checkout: `OM-<base-36 timestamp>-<four-character suffix>`. Generated historical IDs have seeded suffixes and encode each order's actual timestamp.

## Verification

Run `npm test` and `npm run check`. Tests cover 90 consecutive days, daily bounds, unique/time-consistent IDs, catalog totals, filter composition, partial weeks, stable customer identity, repeat intervals, time zones, fulfillment, reproducibility and compact pagination.

Browser checks cover desktop/mobile layout, last-page row count, June filtering, order details and empty-state recovery. No remote deployment is included.
