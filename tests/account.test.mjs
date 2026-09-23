import test from 'node:test';
import assert from 'node:assert/strict';
import { isMobileNumber, isAccountIdentifier } from '../dist/account.js';

test('mobile numbers accept international and formatted national numbers', () => {
  for (const value of ['+1 (512) 555-0186', '5125550186', '+86 138 0013 8000']) assert.equal(isMobileNumber(value), true);
  for (const value of ['', '123', 'call me 5125550186', '12+34567890', '+1234567890123456']) assert.equal(isMobileNumber(value), false);
});

test('login accepts an email or a phone number, rejecting malformed identifiers', () => {
  for (const value of ['alex@example.com', ' alex@example.com ', '+1 512 555 0186']) assert.equal(isAccountIdentifier(value), true);
  for (const value of ['alex', 'alex@', 'alex @example.com', '123']) assert.equal(isAccountIdentifier(value), false);
});
