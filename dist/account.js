import { breadcrumb, icon } from './components.js';

export function isMobileNumber(value) {
  const phone = value.trim();
  const digits = phone.replace(/\D/g, '');
  return /^\+?[\d\s().-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
}

export const isAccountIdentifier = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || isMobileNumber(value);

function accountPage(register) {
  const title = register ? 'Create account' : 'Log in';
  const fields = register ? `
    <label for="account-email">Email address</label>
    <input id="account-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="120">
    <label for="account-code">Email verification code</label>
    <div class="account-code-row"><input id="account-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" placeholder="6-digit code" pattern="[0-9]{6}" title="Enter a 6-digit verification code" required maxlength="6"><button class="account-send-code" id="send-account-code" type="button">Send code</button></div>
    <p class="account-code-status" id="account-code-status" role="status" aria-live="polite"></p>
    <label for="account-phone">Mobile number <span class="optional">(optional)</span></label>
    <input id="account-phone" name="phone" type="tel" autocomplete="tel" placeholder="+1 (512) 555-0186" maxlength="30">
  ` : '<label for="account-identifier">Email or mobile number</label><input id="account-identifier" name="identifier" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="you@example.com or +1 512 555 0186" required maxlength="120">';
  return `<div class="page-wrap account-page">${breadcrumb([[title]])}<section class="account-layout"><div class="account-art"><img src="assets/hero.png" alt="A dedicated OMIGYM home training space" width="1672" height="941"><div><span class="eyebrow">YOUR SPACE. YOUR STRENGTH.</span><h2>SHOW UP.<br>GET STRONG.<br><em>REPEAT.</em></h2><p>A little commitment.<br>A stronger you.</p></div><span class="account-art-note">OMIGYM / BUILT FOR YOUR NEXT LEVEL</span></div><div class="account-panel"><span class="eyebrow">${register ? 'YOUR NEXT CHAPTER STARTS HERE' : 'GOOD TO HAVE YOU BACK'}</span><h1>${register ? 'START<br><em>STRONG.</em>' : 'WELCOME<br><em>BACK.</em>'}</h1><p>${register ? 'Enter your email and verification code to create your OMIGYM account.' : 'Log in with your email address or mobile number.'}</p><form id="${register ? 'register-form' : 'login-form'}" class="account-form">${fields}${register ? '' : '<label for="account-password">Password</label><input id="account-password" name="password" type="password" autocomplete="off" placeholder="Enter your password" required maxlength="128" aria-describedby="account-feedback">'}<div id="account-feedback" class="account-feedback" role="${register ? 'status' : 'alert'}" aria-live="${register ? 'polite' : 'assertive'}" aria-atomic="true"></div><button class="button full" type="submit">${register ? 'Register' : 'Log in'} ${icon('arrow')}</button></form><p class="account-switch">${register ? 'Already have an account? <a href="#/login">Log in</a>' : 'New to OMIGYM? <a href="#/register">Create an account</a>'}</p><a class="account-back" href="#/shop">← Back to the equipment</a></div></section></div>`;
}

export const loginPage = () => accountPage(false);
export const registerPage = () => accountPage(true);

export function initAccount() {
  const account = document.querySelector('.account-menu');
  const trigger = document.querySelector('#account-trigger');
  const links = document.querySelector('#account-links');
  function setOpen(open) {
    trigger.setAttribute('aria-expanded', String(open));
    links.hidden = !open;
  }
  const close = () => setOpen(false);
  account.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setOpen(true);
  });
  account.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !links.contains(document.activeElement)) close();
  });
  trigger.addEventListener('click', event => {
    // Mouse hover already opens the list; clicks also support touch and keyboards.
    const mouseClick = event.detail > 0 && matchMedia('(hover: hover) and (pointer: fine)').matches;
    setOpen(mouseClick || links.hidden);
  });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      links.querySelector('a').focus();
    }
  });
  account.addEventListener('focusout', event => {
    if (!account.contains(event.relatedTarget)) close();
  });
  document.addEventListener('click', event => {
    if (!account.contains(event.target) || event.target.closest('#account-links a')) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !links.hidden) {
      close();
      trigger.focus();
    }
  });
  window.addEventListener('hashchange', close);

  document.addEventListener('click', event => {
    const sendButton = event.target.closest('#send-account-code');
    if (!sendButton) return;
    const form = sendButton.form;
    if (!form.elements.email.reportValidity()) return;
    form.querySelector('#account-code-status').textContent = 'Verification code sent. Please check your inbox.';
    sendButton.textContent = 'Resend code';
    form.elements.code.focus();
  });

  document.addEventListener('submit', event => {
    const form = event.target;
    if (form.id !== 'login-form' && form.id !== 'register-form') return;
    event.preventDefault();
    const identity = form.elements.identifier || form.elements.phone;
    const validIdentity = form.id === 'login-form' ? isAccountIdentifier(identity.value) : !identity.value.trim() || isMobileNumber(identity.value);
    identity.setCustomValidity(validIdentity ? '' : form.id === 'login-form' ? 'Enter a valid email address or mobile number.' : 'Enter a valid mobile number, including your country code for international numbers.');
    if (!form.reportValidity()) return;
    const feedback = form.querySelector('#account-feedback');
    if (form.id === 'login-form') {
      feedback.className = 'account-feedback error';
      feedback.textContent = 'Incorrect password. Please try again.';
      // Credentials stay in the current form only and are discarded on submission.
      const password = form.elements.password;
      password.value = '';
      password.setAttribute('aria-invalid', 'true');
      password.focus();
    } else {
      feedback.className = 'account-feedback error';
      feedback.textContent = 'Incorrect verification code. Please try again.';
      form.elements.code.setAttribute('aria-invalid', 'true');
      form.elements.code.focus();
    }
  });
  document.addEventListener('input', event => {
    if (event.target.closest('#login-form, #register-form')) {
      const form = event.target.form;
      event.target.setCustomValidity('');
      if (form.id === 'register-form' && event.target.name === 'email') {
        form.querySelector('#account-code-status').textContent = '';
        form.querySelector('#send-account-code').textContent = 'Send code';
        form.elements.code.value = '';
      }
      const feedback = form.querySelector('#account-feedback');
      feedback.textContent = '';
      feedback.className = 'account-feedback';
      form.querySelector('[aria-invalid]')?.removeAttribute('aria-invalid');
    }
  });
}
