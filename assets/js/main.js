(function () {
  'use strict';
  var C = window.SITE_CONFIG || {};
  var A = C.analytics || {};

  /* ---------- Métricas (carregadas só se houver IDs no config.js) ---------- */
  var gtagId = A.ga4 || A.googleAds;
  if (gtagId) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gtagId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    if (A.ga4) window.gtag('config', A.ga4);
    if (A.googleAds) window.gtag('config', A.googleAds);
  }
  if (A.metaPixel) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', A.metaPixel);
    window.fbq('track', 'PageView');
  }

  function track(channel, origin) {
    if (window.gtag) {
      window.gtag('event', 'generate_lead', { method: channel, lead_origin: origin });
      if (A.googleAds && A.googleAdsLabel) {
        window.gtag('event', 'conversion', { send_to: A.googleAds + '/' + A.googleAdsLabel });
      }
    }
    if (window.fbq) window.fbq('track', 'Contact', { content_name: origin, channel: channel });
  }

  /* ---------- Links de contato ---------- */
  function waUrl(msg) {
    return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg);
  }
  function mailUrl(subject, body) {
    return 'mailto:' + C.email + '?subject=' + encodeURIComponent(subject) + (body ? '&body=' + encodeURIComponent(body) : '');
  }

  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.href = waUrl(el.getAttribute('data-wa'));
    el.target = '_blank';
    el.rel = 'noopener';
    el.addEventListener('click', function () { track('whatsapp', el.dataset.track || 'link'); });
  });

  // Mostra elementos cujo campo está preenchido no config.js
  document.querySelectorAll('[data-show]').forEach(function (el) {
    if (C[el.dataset.show]) el.hidden = false;
  });
  document.querySelectorAll('[data-fill]').forEach(function (el) {
    var v = C[el.dataset.fill];
    if (v) el.textContent = v;
  });
  if (C.email) {
    document.querySelectorAll('[data-mail]').forEach(function (el) {
      el.href = mailUrl('Orçamento — Miranda Engenharia');
      el.addEventListener('click', function () { track('email', el.dataset.track || 'link'); });
    });
  }
  if (C.instagram) {
    document.querySelectorAll('[data-ig]').forEach(function (el) {
      el.href = 'https://instagram.com/' + C.instagram;
    });
    document.querySelectorAll('[data-fill-ig]').forEach(function (el) {
      el.textContent = '@' + C.instagram;
    });
  }

  /* ---------- Mapa: estados atendidos ---------- */
  var mapa = document.getElementById('mapa-brasil');
  if (mapa) {
    var NS = 'http://www.w3.org/2000/svg';
    var pin = mapa.querySelector('.coverage__pin');
    var arcs = mapa.querySelector('.coverage__arcs');
    var origin = pin.transform.baseVal.consolidate().matrix;
    var svgEl = function (tag, attrs) {
      var el = document.createElementNS(NS, tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      return arcs.appendChild(el);
    };
    var n = 0;
    (C.estadosAtendidos || []).forEach(function (uf) {
      uf = String(uf).trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(uf)) return; // ignora marcadores {{UF_...}}
      var p = mapa.querySelector('.coverage__states [data-uf="' + uf + '"]');
      if (!p) return;
      p.classList.add('is-on');
      if (uf === pin.dataset.uf) return; // estado da sede não ganha arco

      // Arco da sede até o centro do estado, curvado para cima
      var b = p.getBBox();
      var x0 = origin.e, y0 = origin.f, x1 = b.x + b.width / 2, y1 = b.y + b.height / 2;
      var dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, bend = len * 0.32;
      var nx = dy / len, ny = -dx / len;
      if (ny > 0) { nx = -nx; ny = -ny; }
      var cx = (x0 + x1) / 2 + nx * bend, cy = (y0 + y1) / 2 + ny * bend;
      var d = 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
      var delay = (0.15 + n * 0.18) + 's';
      svgEl('path', { 'class': 'coverage__route', d: d, pathLength: 1, style: 'transition-delay:' + delay });
      svgEl('path', { 'class': 'coverage__flow', d: d, style: 'transition-delay:' + delay });
      svgEl('circle', { 'class': 'coverage__end', cx: x1.toFixed(1), cy: y1.toFixed(1), r: 3.5, style: 'transition-delay:' + delay });
      n++;
    });
  }

  /* ---------- Formulário → WhatsApp / e-mail ---------- */
  var form = document.getElementById('form-orcamento');
  if (form) {
    var err = form.querySelector('.form__error');
    var build = function () {
      var f = form.elements;
      var ok = f.nome.value.trim() && f.cidade.value.trim() && f.servico.value;
      ['nome', 'cidade', 'servico'].forEach(function (n) {
        f[n].classList.toggle('is-invalid', !f[n].value.trim());
      });
      err.hidden = !!ok;
      if (!ok) return null;
      var lines = [
        'Olá, Matheus! Vim pelo site e gostaria de um orçamento.',
        '',
        '*Nome:* ' + f.nome.value.trim()
      ];
      if (f.empresa.value.trim()) lines.push('*Empresa:* ' + f.empresa.value.trim());
      lines.push('*Cidade/UF:* ' + f.cidade.value.trim());
      lines.push('*Serviço:* ' + f.servico.value);
      if (f.detalhes.value.trim()) lines.push('*Detalhes:* ' + f.detalhes.value.trim());
      return { text: lines.join('\n'), servico: f.servico.value };
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = build();
      if (!m) return;
      track('whatsapp', 'formulario');
      window.open(waUrl(m.text), '_blank', 'noopener');
    });
    var mailBtn = form.querySelector('[data-form-mail]');
    if (mailBtn && C.email) {
      mailBtn.addEventListener('click', function () {
        var m = build();
        if (!m) return;
        track('email', 'formulario');
        window.location.href = mailUrl('Orçamento: ' + m.servico, m.text.replace(/\*/g, ''));
      });
    }
  }

  /* ---------- Header ---------- */
  var header = document.querySelector('.header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 12); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Animações ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  if (hasIO && !reduce) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countIO.unobserve(en.target);
        var el = en.target, end = +el.dataset.count, t0 = null, dur = 1400;
        var step = function (t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { countIO.observe(el); });
  }

  /* ---------- Vídeo: carrega e toca só quando visível ---------- */
  var video = document.querySelector('video[data-src]');
  if (video) {
    var load = function () {
      if (!video.src) video.src = video.dataset.src;
    };
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            load();
            if (!reduce) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
          } else if (video.src) {
            video.pause();
          }
        });
      }, { threshold: 0.35 }).observe(video);
    } else {
      load();
    }
    if (reduce) video.controls = true;
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
