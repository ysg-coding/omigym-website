# Storefront account pages

Routes: `/#/login` and `/#/register`. The header avatar exposes Log in and Register links on mouse hover, on click for touch users, or with Enter/Arrow Down from the keyboard. Escape closes the dropdown and restores focus to the avatar. Clicking outside, leaving the menu or navigating closes it.

Both pages use the storefront typography, orange accents and an existing OMIGYM equipment photo. At small widths the photo is hidden so the form remains prominent.

Registration requires an email address and a mobile number. Login accepts either an email or a mobile number in one identifier field, plus a password. Phone input supports country codes, spaces, parentheses, dots and hyphens, with 7–15 digits; this is format validation only, not phone ownership verification.

After required-field and format validation, login always shows `Incorrect password. Please try again.` and clears the password field. Registration always shows `Registration email sent. Please check your inbox.`. There is no account creation, credential storage, authentication session, SMS or email delivery. `dist/account.js` only changes the current DOM; no form data is sent anywhere.

Verification: `npm test`; `npm run check` includes both route renderings and rejects network or browser-storage APIs in the account module. Browser checks cover repeated login attempts, registration feedback, dropdown links, Escape, keyboard access and narrow-screen layout.
