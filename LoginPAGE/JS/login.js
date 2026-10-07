/* PSYCHORA AUTH — shared login and sign-up interactions */
(function () {
  'use strict';

  var HOME_URL = '../../index.html';
  var STORE_KEY = 'psychora_remember';
  var loginForm = document.getElementById('login-form');
  var signupForm = document.getElementById('signup-form');

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

  function enterSite() {
    try {
      sessionStorage.setItem('psychora_auth', '1');
    } catch (error) {
      // Session storage may be unavailable; navigation should still work.
    }
    window.location.href = HOME_URL;
  }

  function setLoading(button, text) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = text;
  }

  if (loginForm) {
    var identity = document.getElementById('identity');
    var remember = document.getElementById('remember');
    var ssoButton = document.querySelector('.btn--sso');
    var submitButton = loginForm.querySelector('.btn--primary');

    try {
      var savedIdentity = localStorage.getItem(STORE_KEY);
      if (savedIdentity) {
        identity.value = savedIdentity;
        remember.checked = true;
      }
    } catch (error) {
      // Remember Me is optional when storage is unavailable.
    }

    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      try {
        if (remember.checked) {
          localStorage.setItem(STORE_KEY, identity.value.trim());
        } else {
          localStorage.removeItem(STORE_KEY);
        }
      } catch (error) {
        // Continue sign-in when storage is unavailable.
      }

      setLoading(submitButton, 'Signing in...');
      window.setTimeout(enterSite, 500);
    });

    if (ssoButton) {
      ssoButton.addEventListener('click', function () {
        setLoading(ssoButton, 'Connecting...');
        window.setTimeout(enterSite, 500);
      });
    }
  }

  if (signupForm) {
    var password = document.getElementById('signup-password');
    var confirmPassword = document.getElementById('signup-confirm-password');
    var notice = document.getElementById('signup-notice');

    function validatePasswordMatch() {
      confirmPassword.setCustomValidity(
        confirmPassword.value && confirmPassword.value !== password.value
          ? 'Passwords do not match.'
          : ''
      );
    }

    password.addEventListener('input', validatePasswordMatch);
    confirmPassword.addEventListener('input', validatePasswordMatch);

    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      validatePasswordMatch();
      if (!signupForm.reportValidity()) return;

      notice.textContent = 'Account creation is not connected to a server yet.';
    });
  }
})();
