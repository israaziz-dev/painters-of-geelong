    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.contact-badge',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 }
    );
    gsap.fromTo('.contact-heading',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.2 }
    );
    gsap.fromTo('.contact-sub',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.35 }
    );
    gsap.utils.toArray('.info-card').forEach(function(card, i) {
      gsap.fromTo(card,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.5 + i * 0.1 }
      );
    });
    gsap.fromTo('.form-card',
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out', delay: 0.3 }
    );
  

    (function () {
      var form = document.getElementById('quoteForm');
      if (!form) return;

      // name -> custom validator. Fields not listed are required-non-empty only.
      var rules = {
        name:           { required: true,  msg: 'Please enter your name.' },
        phone:          { required: true,  msg: 'Please enter your phone number.',
                          test: function (v) { return /^[0-9+()\s-]{6,}$/.test(v); },
                          testMsg: 'Please enter a valid phone number.' },
        service:        { required: true,  msg: 'Please choose a service.' },
        preferred_date: { required: true,  msg: 'Please choose a preferred date.' },
        email:          { required: false, // optional, but validate format if filled
                          test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
                          testMsg: 'Please enter a valid email address.' }
      };

      function fieldOf(el) { return el.closest('.form-field'); }
      function errorEl(name) { return form.querySelector('[data-error-for="' + name + '"]'); }

      function setError(name, message) {
        var el = form.elements[name];
        if (!el) return;
        var wrap = fieldOf(el), err = errorEl(name);
        if (message) {
          wrap.classList.add('invalid');
          if (err) err.textContent = message;
        } else {
          wrap.classList.remove('invalid');
          if (err) err.textContent = '';
        }
      }

      function validateField(name) {
        var el = form.elements[name];
        if (!el) return true;
        var rule = rules[name] || { required: true };
        var value = (el.value || '').trim();
        if (!value) {
          if (rule.required) { setError(name, rule.msg || 'This field is required.'); return false; }
          setError(name, ''); return true; // optional + empty = ok
        }
        if (rule.test && !rule.test(value)) { setError(name, rule.testMsg || 'Please check this field.'); return false; }
        setError(name, ''); return true;
      }

      var successEl = document.getElementById('formSuccess');
      var errorEl_  = document.getElementById('formError');
      function showBanner(el, msg) {
        if (!el) return;
        if (msg != null) el.textContent = msg;
        el.classList.add('show');
      }
      function hideBanners() {
        if (successEl) successEl.classList.remove('show');
        if (errorEl_)  errorEl_.classList.remove('show');
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideBanners();

        var firstInvalid = null;
        Object.keys(rules).forEach(function (name) {
          if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
        });
        if (firstInvalid) { firstInvalid.focus(); return; }

        var btn = form.querySelector('[type="submit"]');
        var btnHtml = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }

        var data = {};
        new FormData(form).forEach(function (val, key) { data[key] = val; });
        data.source = 'contact';

        fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok, error: j.error }; });
          })
          .then(function (res) {
            if (res.ok) {
              showBanner(successEl);
              form.reset();
            } else {
              showBanner(errorEl_, res.error || 'Sorry, something went wrong. Please call us or try again.');
            }
          })
          .catch(function () {
            showBanner(errorEl_, 'Network error. Please try again or call us directly.');
          })
          .then(function () {
            if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
          });
      });

      // Clear/re-check each field as the user fixes it.
      Object.keys(rules).forEach(function (name) {
        var el = form.elements[name];
        if (!el) return;
        var ev = (el.tagName === 'SELECT') ? 'change' : 'input';
        el.addEventListener(ev, function () {
          if (fieldOf(el).classList.contains('invalid')) validateField(name);
        });
        el.addEventListener('blur', function () { validateField(name); });
      });
    })();
  
