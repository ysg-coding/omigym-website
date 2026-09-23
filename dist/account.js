import { breadcrumb, icon } from './components.js';

function accountPage(register) {
  const title = register ? 'Create account' : 'Log in';
  return `<div class="page-wrap account-page">${breadcrumb([[title]])}<section class="account-layout"><div class="account-art"><img src="assets/hero.png" alt="A dedicated OMIGYM home training space" width="1672" height="941"><div><span class="eyebrow">YOUR SPACE. YOUR STRENGTH.</span><h2>SHOW UP.<br>GET STRONG.<br><em>REPEAT.</em></h2><p>A little commitment.<br>A stronger you.</p></div><span class="account-art-note">OMIGYM / BUILT FOR YOUR NEXT LEVEL</span></div><div class="account-panel"><span class="eyebrow">${register ? 'YOUR NEXT CHAPTER STARTS HERE' : 'GOOD TO HAVE YOU BACK'}</span><h1>${register ? 'START<br><em>STRONG.</em>' : 'WELCOME<br><em>BACK.</em>'}</h1><p>${register ? 'Create your OMIGYM account. Enter your email and we’ll send you a registration link.' : 'Log in to your OMIGYM account.'}</p><form id="${register ? 'register-form' : 'login-form'}" class="account-form"><label for="account-email">Email address</label><input id="account-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="120">${register ? '' : '<label for="account-password">Password</label><input id="account-password" name="password" type="password" autocomplete="off" placeholder="Enter your password" required maxlength="128" aria-describedby="account-feedback">'}<div id="account-feedback" class="account-feedback" role="${register ? 'status' : 'alert'}" aria-live="${register ? 'polite' : 'assertive'}" aria-atomic="true"></div><button class="button full" type="submit">${register ? 'Send registration email' : 'Log in'} ${icon('arrow')}</button></form><p class="account-switch">${register ? 'Already have an account? <a href="#/login">Log in</a>' : 'New to OMIGYM? <a href="#/register">Create an account</a>'}</p><a class="account-back" href="#/shop">← Back to the equipment</a></div></section></div>`;
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

  document.addEventListener('submit', event => {
    const form = event.target;
    if (form.id !== 'login-form' && form.id !== 'register-form') return;
    event.preventDefault();
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
      feedback.className = 'account-feedback success';
      feedback.textContent = 'Registration email sent. Please check your inbox.';
    }
  });
  document.addEventListener('input', event => {
    if (event.target.closest('#login-form, #register-form')) {
      const form = event.target.form;
      const feedback = form.querySelector('#account-feedback');
      feedback.textContent = '';
      feedback.className = 'account-feedback';
      form.querySelector('[aria-invalid]')?.removeAttribute('aria-invalid');
    }
  });
}
