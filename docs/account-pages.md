# Storefront account pages

Routes: `/#/login` and `/#/register`. The header avatar exposes Log in and Register links on mouse hover, on click for touch users, or with Enter/Arrow Down from the keyboard. Escape closes the dropdown and restores focus to the avatar. Clicking outside, leaving the menu or navigating closes it.

Both pages use the storefront typography, orange accents and an existing OMIGYM equipment photo. At small widths the photo is hidden so the form remains prominent.

Registration requires an email address and a six-digit email verification code; the mobile number is optional. Send code validates only the email and shows a local sent confirmation; it does not send an email. Any six-digit code is accepted for this static simulation. Changing the email clears the code and sent confirmation. Login accepts either an email or a mobile number in one identifier field, plus a password. Phone input, when supplied, supports country codes, spaces, parentheses, dots and hyphens, with 7–15 digits; this is format validation only, not phone ownership verification.

After required-field and format validation, login always shows `Incorrect password. Please try again.` and clears the password field. The Register button shows `Registration successful. Welcome to OMIGYM.`. There is no account creation, credential storage, authentication session, SMS or email delivery. `dist/account.js` only changes the current DOM; no form data is sent anywhere.

Verification: `npm test`; `npm run check` includes both route renderings and rejects network or browser-storage APIs in the account module. Browser checks cover repeated login attempts, registration feedback, dropdown links, Escape, keyboard access and narrow-screen layout.
