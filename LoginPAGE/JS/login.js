/* PSYCHORA AUTH — shared login and sign-up interactions */
(function () {
  'use strict';

  var STORE_KEY = 'psychora_remember';
  var loginForm = document.getElementById('login-form');
  var loginNotice = document.getElementById('login-notice');

  document.querySelectorAll('.field__toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      var input = document.getElementById(button.getAttribute('aria-controls'));
      if (!input) return;

      var hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(hidden));
      button.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
    });
  });

  function setLoading(button, text) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = text;
  }

  if (loginForm) {
    var identity = document.getElementById('identity');
    var remember = document.getElementById('remember');
    var submitButton = loginForm.querySelector('.btn--primary');

    try {
      var savedIdentity = localStorage.getItem(STORE_KEY);
      if (savedIdentity && identity && remember) {
        identity.value = savedIdentity;
        remember.checked = true;
      }
    } catch (error) {
      // Remember Me is optional when storage is unavailable.
    }

    loginForm.addEventListener('submit', function () {
      try {
        if (remember.checked) {
          localStorage.setItem(STORE_KEY, identity.value.trim());
        } else {
          localStorage.removeItem(STORE_KEY);
        }
      } catch (error) {
        // Remember Me is optional when storage is unavailable.
      }

      setLoading(submitButton, 'Signing in...');
    });
  }

  var authErrors = {
    invalid: 'Username or password is incorrect.',
    'password-disabled': 'Password sign-in is not configured. Continue with Google instead.',
    'google-not-configured': 'Google sign-in is not configured yet. Please try again later.',
    'google-cancelled': 'Google sign-in was cancelled.',
    'google-failed': 'Google sign-in could not be completed. Please try again.',
    'google-unverified': 'Use a Google account with a verified email address.'
  };
  var authError = new URLSearchParams(window.location.search).get('error');
  if (loginNotice && authError && authErrors[authError]) {
    loginNotice.textContent = authErrors[authError];
  }
})();
