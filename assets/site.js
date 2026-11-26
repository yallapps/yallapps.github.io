// YallApps — theme toggle, reveal-on-scroll and live release data (read from <app>/latest.json).
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  // Theme: system by default; the toggle stores an explicit choice.
  var KEY = 'yallapps.theme';
  function systemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
  }
  var saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch (e) {}
  apply(saved === 'light' || saved === 'dark' ? saved : systemDark() ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        try {
          localStorage.setItem(KEY, next);
        } catch (e) {}
      });
    }

    // Reveal sections as they enter the viewport.
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px' }
      );
      items.forEach(function (el) {
        io.observe(el);
      });
    } else {
      items.forEach(function (el) {
        el.classList.add('in');
      });
    }

    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    loadRelease();
  });

  // ---- Release data ----
  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function loadRelease() {
    var host = document.querySelector('[data-release]');
    if (!host) return;
    var base = host.getAttribute('data-release');
    fetch(base + '/latest.json', { cache: 'no-store' })
      .then(function (r) {
        if (r.status === 404) return null;
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (m) {
        if (m && m.assets) showRelease(m);
        else showComingSoon();
      })
      .catch(function () {
        showComingSoon();
      });
  }

  function setAll(selector, fn) {
    document.querySelectorAll(selector).forEach(fn);
  }

  function showRelease(m) {
    root.setAttribute('data-release-state', 'live');
    setAll('[data-when="live"]', function (el) {
      el.hidden = false;
    });
    setAll('[data-when="soon"]', function (el) {
      el.hidden = true;
    });
    setAll('[data-version]', function (el) {
      el.textContent = 'Version ' + m.version;
    });
    setAll('[data-published]', function (el) {
      var t = formatDate(m.published);
      el.textContent = t ? 'Released ' + t : '';
    });
    setAll('[data-asset]', function (el) {
      var a = m.assets[el.getAttribute('data-asset')];
      if (a) {
        el.setAttribute('href', a.url);
        el.removeAttribute('aria-disabled');
      } else {
        el.closest('.file') && (el.closest('.file').hidden = true);
      }
    });
    setAll('[data-sha]', function (el) {
      var a = m.assets[el.getAttribute('data-sha')];
      el.textContent = a ? a.sha256 : '';
    });
    setAll('[data-release-link]', function (el) {
      if (m.releaseUrl) el.setAttribute('href', m.releaseUrl);
    });
  }

  function showComingSoon() {
    root.setAttribute('data-release-state', 'soon');
    setAll('[data-when="live"]', function (el) {
      el.hidden = true;
    });
    setAll('[data-when="soon"]', function (el) {
      el.hidden = false;
    });
  }
})();
