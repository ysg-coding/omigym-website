# Storefront account pages

Routes: `/#/login` and `/#/register`. The header avatar exposes Log in and Register links on mouse hover, on click for touch users, or with Enter/Arrow Down from the keyboard. Escape closes the dropdown and restores focus to the avatar. Clicking outside, leaving the menu or navigating closes it.

Both pages use the storefront typography, orange accents and an existing OMIGYM equipment photo. At small widths the photo is hidden so the form remains prominent.

Registration requires an email address and a six-digit email verification code; the mobile number is optional. Send code validates only the email and shows a local sent confirmation; it does not send an email. Every submitted six-digit code is rejected in this static simulation. Changing the email clears the code and sent confirmation. Login accepts either an email or a mobile number in one identifier field, plus a password. Phone input, when supplied, supports country codes, spaces, parentheses, dots and hyphens, with 7–15 digits; this is format validation only, not phone ownership verification.

After required-field and format validation, login always shows `Incorrect password. Please try again.` and clears the password field. The Register button always shows `Incorrect verification code. Please try again.` and marks the code field invalid. There is no account creation, credential storage, authentication session, SMS or email delivery. `dist/account.js` only changes the current DOM; no form data is sent anywhere.

Verification: `npm test`; `npm run check` includes both route renderings and rejects network or browser-storage APIs in the account module. Browser checks cover repeated login attempts, registration feedback, dropdown links, Escape, keyboard access and narrow-screen layout.

Registration verification waits one second locally before showing the fixed code error. During the wait, the button shows a spinner and `Verifying…`, the form is marked busy, and its controls are disabled to prevent duplicate submissions. Navigating away leaves the new page unaffected; controls are restored after completion. Reduced-motion users see a static loading indicator.
