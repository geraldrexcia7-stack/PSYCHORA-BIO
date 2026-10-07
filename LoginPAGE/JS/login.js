/* PSYCHORA AUTH — shared login and sign-up interactions */
(function () {
  'use strict';

  var STORE_KEY = 'psychora_remember';
  var ACCOUNT_KEY = 'psychora_demo_account';
  var loginForm = document.getElementById('login-form');
  var signupForm = document.getElementById('signup-form');
  var loginNotice = document.getElementById('login-notice');
  var signupNotice = document.getElementById('signup-notice');
  var homeUrl = '/index.html';
  var loginUrl = '/LoginPAGE/HTML/mainlogin.html';
  var passwordIterations = 120000;

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

  function showNotice(notice, message) {
    if (notice) notice.textContent = message;
  }

  function readAccounts() {
    var savedAccount = localStorage.getItem(ACCOUNT_KEY);
    if (!savedAccount) return [];
    var accounts = JSON.parse(savedAccount);
    return Array.isArray(accounts) ? accounts : [accounts];
  }

  function hashPassword(password, salt) {
    var saltBytes = salt
      ? Uint8Array.from(atob(salt), function (character) { return character.charCodeAt(0); })
      : window.crypto.getRandomValues(new Uint8Array(16));
    var encodedSalt = btoa(String.fromCharCode.apply(null, saltBytes));

    return window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    ).then(function (key) {
      return window.crypto.subtle.deriveBits({
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: passwordIterations,
        hash: 'SHA-256'
      }, key, 256);
    }).then(function (bits) {
      return {
        salt: encodedSalt,
        hash: btoa(String.fromCharCode.apply(null, new Uint8Array(bits)))
      };
    });
  }

  function demoAuthUnavailable(notice) {
    showNotice(notice, 'Demo login requires browser storage and Web Crypto. Open this site on localhost or HTTPS.');
  }

  if (loginForm) {
    var identity = document.getElementById('identity');
    var password = document.getElementById('password');
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

    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      showNotice(loginNotice, '');

      if (!window.crypto || !window.crypto.subtle || !identity || !password) {
        demoAuthUnavailable(loginNotice);
        return;
      }

      try {
        var username = identity.value.trim().toLowerCase();
        var account = readAccounts().find(function (savedAccount) {
          return savedAccount.username === username;
        });

        if (!account) {
          showNotice(loginNotice, 'Name or password is incorrect.');
          return;
        }

        setLoading(submitButton, 'Signing in...');
        hashPassword(password.value, account.salt).then(function (result) {
          if (result.hash !== account.passwordHash) {
            showNotice(loginNotice, 'Name or password is incorrect.');
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            submitButton.textContent = 'Sign In';
            return;
          }

          sessionStorage.setItem('psychora_demo_authenticated', 'true');
          sessionStorage.setItem('psychora_demo_name', account.name);

          if (remember.checked) {
            localStorage.setItem(STORE_KEY, identity.value.trim());
          } else {
            localStorage.removeItem(STORE_KEY);
          }

          window.location.assign(homeUrl);
        }).catch(function () {
          showNotice(loginNotice, 'Unable to check this account in browser storage.');
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          submitButton.textContent = 'Sign In';
        });
      } catch (error) {
        showNotice(loginNotice, 'Unable to read the demo account from browser storage.');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      showNotice(signupNotice, '');

      var name = document.getElementById('signup-name').value.trim();
      var password = document.getElementById('signup-password').value;
      var confirmation = document.getElementById('signup-confirm-password').value;
      var submitButton = signupForm.querySelector('.btn--primary');

      if (!window.crypto || !window.crypto.subtle) {
        demoAuthUnavailable(signupNotice);
        return;
      }

      if (password !== confirmation) {
        showNotice(signupNotice, 'Passwords do not match.');
        return;
      }

      try {
        var accounts = readAccounts();
        if (accounts.some(function (account) {
          return account.username === name.toLowerCase();
        })) {
          showNotice(signupNotice, 'An account with this name already exists in this browser. Sign in instead.');
          return;
        }

        setLoading(submitButton, 'Creating account...');
        hashPassword(password).then(function (result) {
          var account = {
            name: name,
            username: name.toLowerCase(),
            salt: result.salt,
            passwordHash: result.hash
          };

          accounts.push(account);
          localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
          sessionStorage.setItem('psychora_demo_authenticated', 'true');
          sessionStorage.setItem('psychora_demo_name', name);
          window.location.assign(homeUrl);
        }).catch(function () {
          showNotice(signupNotice, 'Unable to create a demo account in browser storage.');
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          submitButton.textContent = 'Create Account';
        });
      } catch (error) {
        showNotice(signupNotice, 'Unable to save a demo account in browser storage.');
      }
    });
  }

  document.querySelectorAll('[data-demo-logout]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      sessionStorage.removeItem('psychora_demo_authenticated');
      sessionStorage.removeItem('psychora_demo_name');
      window.location.assign(loginUrl);
    });
  });

  if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    if (sessionStorage.getItem('psychora_demo_authenticated') !== 'true') {
      window.location.replace(loginUrl);
    }
  }

  var authErrors = {
    invalid: 'Name or password is incorrect.',
    'password-disabled': 'Use the demo account created in this browser to sign in.',
    'demo-only': 'Sign in using the form on this page.',
    'google-not-configured': 'Google SSO requires a configured server. Use the demo sign-in form.',
    'google-cancelled': 'Google sign-in was cancelled.',
    'google-failed': 'Google sign-in could not be completed. Please try again.',
    'google-unverified': 'Use a Google account with a verified email address.'
  };
  var authError = new URLSearchParams(window.location.search).get('error');
  if (loginNotice && authError && authErrors[authError]) {
    loginNotice.textContent = authErrors[authError];
  }
})();
