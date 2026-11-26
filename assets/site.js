// YallApps — glass header on scroll, pointer glow on cards, reveal-on-scroll and live release data (<app>/latest.json).
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  document.addEventListener('DOMContentLoaded', function () {
    // Header becomes glass once the page is scrolled.
    var header = document.querySelector('.site-header');
    function onScroll() {
      if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Cards: glow follows the pointer.
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - r.left + 'px');
        card.style.setProperty('--my', e.clientY - r.top + 'px');
      });
    });

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
  var lang = (root.getAttribute('lang') || 'en').slice(0, 2);
  var T = {
    en: { locale: 'en-GB', version: 'Version ', released: 'Released ' },
    fr: { locale: 'fr-FR', version: 'Version ', released: 'Publiée le ' },
    ar: { locale: 'ar', version: 'الإصدار ', released: 'نُشر في ' }
  }[lang] || { locale: 'en-GB', version: 'Version ', released: 'Released ' };

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(T.locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function setAll(selector, fn) {
    document.querySelectorAll(selector).forEach(fn);
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

  function showRelease(m) {
    root.setAttribute('data-release-state', 'live');
    setAll('[data-when="live"]', function (el) {
      el.hidden = false;
    });
    setAll('[data-when="soon"]', function (el) {
      el.hidden = true;
    });
    setAll('[data-version]', function (el) {
      el.textContent = T.version + m.version;
    });
    setAll('[data-published]', function (el) {
      var t = formatDate(m.published);
      el.textContent = t ? T.released + t : '';
    });
    setAll('[data-asset]', function (el) {
      var a = m.assets[el.getAttribute('data-asset')];
      if (a) {
        el.setAttribute('href', a.url);
        el.removeAttribute('aria-disabled');
      } else if (el.closest('.file')) {
        el.closest('.file').hidden = true;
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
