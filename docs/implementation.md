# OMIGYM local storefront

## Design and scope
Build an English fitness equipment store with USD demonstration pricing. The user requires a purely static, local website with home, catalog, product detail, about, contact, cart and simulated ordering; no database or payments. All images must be unbranded or OMIGYM branded.

Visual direction: editorial fitness photography, charcoal and white, vivid orange from the supplied dumbbells, large condensed headings, square product surfaces and restrained borders. Desktop and mobile layouts share all shopping functionality.

Implementation uses vanilla HTML/CSS/JavaScript in `dist/`, no third-party runtime packages or network APIs. Hash routes work with any static server. A Node built-in static server binds only to 127.0.0.1. Cart is browser-local; contact submissions are simulated; order completion generates a local reference, retains a minimal session receipt, and clears the cart.

## Execution plan
- [x] Implement catalog data and pure cart operations. Exercise merging variants, quantity bounds, damaged local state, integer-cent totals, empty-cart order rejection.
- [x] Build initial branded home layout and local server; open first meaningful preview when required hero asset is ready.
- [x] Complete category/search/sort catalog, dynamic product pages, accessible cart drawer, cart page, checkout, order receipt, about and contact.
- [x] Integrate generated photography and supplied OMIGYM closeups, document provenance, verify no third-party brand artwork.
- [x] Check local resources, syntax, route behavior, keyboard/dialog behavior and complete local checkout. Verify narrow viewport layout.
- [x] Document local launch and limitations in README; leave a working preview.

## Review focus
Malformed storage must not break rendering; unknown products must show a recovery path; prices are integer cents; quantities are bounded; empty carts cannot place orders; text supplied by users must never render as HTML; no external submission or payment route may exist.

## Decisions
User explicitly requested files in this directory, so author here with no alternate checkout or hosting registration. The only initial files are three supplied photos. No Git repository is initialized. Follow the local Sites workflow and implement without extra design approval prompts, as the task already authorizes the complete reversible local website.
