(function () {
  'use strict';

  var STORAGE_KEY = 'ss-lang';

  function L() {
    return document.documentElement.lang || 'en';
  }

  var isBdx = /bordeaux/.test(location.pathname);
  var isDpp = /dieppe/.test(location.pathname);

  var UI = {
    en: {
      btnLabel: 'Ask me',
      sub: 'Quick answers · EN / FR / ES',
      placeholder: 'Type your question…',
      greeting: 'Hi! Ask me anything about our tours — prices, durations, languages, booking.',
      noMatch: 'Not sure about that one. Message Antoine directly on WhatsApp: +33 6 26 39 17 83',
      quick: ['Prices', 'How to book', 'Languages', 'What’s included', 'Group size', 'Contact']
    },
    fr: {
      btnLabel: 'Posez-moi',
      sub: 'Réponses rapides · EN / FR / ES',
      placeholder: 'Votre question…',
      greeting: 'Bonjour ! Posez-moi vos questions sur nos visites — tarifs, durées, langues, réservation.',
      noMatch: 'Je ne suis pas sûr de ça. Contactez Antoine directement sur WhatsApp : +33 6 26 39 17 83',
      quick: ['Tarifs', 'Comment réserver', 'Langues', 'Ce qui est inclus', 'Taille du groupe', 'Contact']
    },
    es: {
      btnLabel: 'Pregúntame',
      sub: 'Respuestas rápidas · EN / FR / ES',
      placeholder: 'Su pregunta…',
      greeting: '¡Hola! Pregúnteme sobre nuestras visitas — precios, duraciones, idiomas, reservas.',
      noMatch: 'No estoy seguro de eso. Escriba a Antoine por WhatsApp: +33 6 26 39 17 83',
      quick: ['Precios', 'Cómo reservar', 'Idiomas', 'Qué incluye', 'Tamaño del grupo', 'Contacto']
    }
  };

  var DATA = null;
  try {
    fetch('/chat-data.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { DATA = d; })
      .catch(function () {});
  } catch (e) {}

  var PHONE = '+33 6 26 39 17 83';
  var NONE = { en: 'contact Antoine for details', fr: 'contactez Antoine pour les détails', es: 'contacte a Antoine para más detalles' };
  var NODATES = { en: 'dates on request', fr: 'dates sur demande', es: 'fechas a consultar' };
  var CITY = { bordeaux: { en: 'Bordeaux', fr: 'Bordeaux', es: 'Burdeos' }, dieppe: { en: 'Dieppe', fr: 'Dieppe', es: 'Dieppe' } };

  function K(l) { return l === 'fr' || l === 'es' ? l : 'en'; }
  function T(o, l) { return (o && (o[K(l)] || o.en)) || ''; }
  function plain(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function priceOf(t, l) {
    if (t.price) return t.price;
    if (t.priceLabel) return T(t.priceLabel, l);
    return T(NONE, l);
  }

  function scope(city) {
    if (!DATA) return [];
    return DATA.filter(function (t) {
      if (city) return t.city === city;
      return isBdx ? t.city === 'bordeaux' : isDpp ? t.city === 'dieppe' : true;
    });
  }

  function listBy(l, fn, city) {
    var out = [];
    var last = '';
    scope(city).forEach(function (t) {
      var line = fn(t, l);
      if (line === null) return;
      if (!city && !isBdx && !isDpp && t.city !== last) {
        last = t.city;
        out.push((out.length ? '\n' : '') + T(CITY[last], l) + ':');
      }
      out.push('• ' + T(t.title, l) + ': ' + line);
    });
    return out.join('\n');
  }

  var HEAD = {
    price: { en: 'Prices (per person where a price is shown):', fr: 'Tarifs (par personne quand un prix est indiqué) :', es: 'Precios (por persona cuando se indica un precio):' },
    duration: { en: 'Durations:', fr: 'Durées :', es: 'Duraciones:' },
    schedule: { en: 'When the tours run:', fr: 'Quand ont lieu les visites :', es: 'Cuándo se realizan los tours:' },
    included: { en: 'What is included:', fr: 'Ce qui est inclus :', es: 'Qué incluye:' },
    sunday: {
      en: 'Tours with a restaurant meal do not run on Sundays, because most Bordeaux restaurants are closed that day.',
      fr: 'Les visites avec un repas au restaurant n\'ont pas lieu le dimanche, car la plupart des restaurants de Bordeaux sont fermés ce jour-là.',
      es: 'Los tours con comida en restaurante no se realizan los domingos, porque la mayoría de los restaurantes de Burdeos cierran ese día.'
    }
  };

  var DYN = {
    price: function (l) {
      return T(HEAD.price, l) + '\n' + listBy(l, function (t) { return priceOf(t, l); });
    },
    duration: function (l) {
      return T(HEAD.duration, l) + '\n' + listBy(l, function (t) { return T(t.duration, l); });
    },
    schedule: function (l) {
      return T(HEAD.schedule, l) + '\n' + listBy(l, function (t) { return t.schedule ? T(t.schedule, l) : T(NODATES, l); }) + (isDpp ? '' : '\n\n' + T(HEAD.sunday, l));
    },
    included: function (l) {
      var body = listBy(l, function (t) {
        var items = (t.included && (t.included[K(l)] || t.included.en)) || [];
        return items.length ? items.join('; ') : null;
      });
      return T(HEAD.included, l) + '\n' + body;
    },
    bordeaux: function (l) {
      return listBy(l, function (t) { return T(t.duration, l) + ', ' + priceOf(t, l); }, 'bordeaux');
    },
    dieppe: function (l) {
      return listBy(l, function (t) { return T(t.duration, l) + ', ' + priceOf(t, l); }, 'dieppe');
    }
  };

  var FAQ = [
    {
      dyn: 'price',
      kw: { en: ['price', 'cost', 'how much', 'rate', 'fee', 'euro', 'cheap', 'expensive'], fr: ['prix', 'coût', 'combien', 'tarif', 'euro', 'cher'], es: ['precio', 'coste', 'cuánto', 'cuanto', 'tarifa', 'euro', 'caro'] },
      ans: {
        en: 'Prices depend on the tour. Open any tour page to see its price, or message Antoine on WhatsApp: ' + PHONE,
        fr: 'Les tarifs dépendent de la visite. Ouvrez une page de visite pour voir son prix, ou écrivez à Antoine sur WhatsApp : ' + PHONE,
        es: 'Los precios dependen del tour. Abra la página de un tour para ver su precio, o escriba a Antoine por WhatsApp: ' + PHONE
      }
    },
    {
      dyn: 'duration',
      kw: { en: ['duration', 'how long', 'hours', 'long', 'time', 'length'], fr: ['durée', 'combien de temps', 'heures', 'long', 'temps'], es: ['duración', 'cuánto tiempo', 'cuanto tiempo', 'horas', 'larga'] },
      ans: {
        en: 'Durations are shown on each tour page. Most tours last between 1.5 and 3 hours.',
        fr: 'Les durées sont indiquées sur chaque page de visite. La plupart durent entre 1h30 et 3h.',
        es: 'Las duraciones aparecen en la página de cada tour. La mayoría duran entre 1,5 y 3 horas.'
      }
    },
    {
      dyn: 'schedule',
      kw: { en: ['sunday', 'weekend', 'days', 'schedule', 'when', 'open', 'available', 'monday', 'saturday'], fr: ['dimanche', 'week-end', 'jours', 'disponible', 'quand', 'ouvert', 'lundi', 'samedi'], es: ['domingo', 'fin de semana', 'días', 'disponible', 'cuándo', 'cuando', 'horario', 'lunes', 'sábado'] },
      ans: {
        en: 'Days and times are shown on each tour page. Message Antoine on WhatsApp to check a date: ' + PHONE,
        fr: 'Les jours et horaires sont indiqués sur chaque page de visite. Écrivez à Antoine sur WhatsApp pour vérifier une date : ' + PHONE,
        es: 'Los días y horarios aparecen en la página de cada tour. Escriba a Antoine por WhatsApp para comprobar una fecha: ' + PHONE
      }
    },
    {
      dyn: 'included',
      kw: { en: ['include', 'included', 'inclusive', 'equipment'], fr: ['inclus', 'compris', 'comprend'], es: ['incluye', 'incluido', 'incluidos'] },
      ans: {
        en: 'What is included is listed on each tour page.',
        fr: 'Ce qui est inclus est indiqué sur chaque page de visite.',
        es: 'Lo que incluye cada tour aparece en su página.'
      }
    },
    {
      dyn: 'bordeaux',
      kw: { en: ['bordeaux', 'garonne', 'south', 'southwest', 'gironde'], fr: ['bordeaux', 'garonne', 'sud', 'gironde'], es: ['burdeos', 'garona', 'sur', 'gironda'] },
      ans: {
        en: 'In Bordeaux I offer food, wine, history, bike and game tours. Open the Bordeaux page to see them all.',
        fr: 'À Bordeaux je propose des visites gourmandes, œnologiques, historiques, à vélo et des jeux. Ouvrez la page Bordeaux pour tout voir.',
        es: 'En Burdeos ofrezco tours de gastronomía, vino, historia, bicicleta y juegos. Abra la página de Burdeos para verlos todos.'
      }
    },
    {
      dyn: 'dieppe',
      kw: { en: ['dieppe', 'normandy', 'north', 'channel', 'newhaven'], fr: ['dieppe', 'normandie', 'nord', 'manche', 'newhaven'], es: ['dieppe', 'normandía', 'norte'] },
      ans: {
        en: 'In Dieppe I offer seafood, market, castle, cliffs and apéro tours. Open the Dieppe page to see them all.',
        fr: 'À Dieppe je propose des visites fruits de mer, marché, château, falaises et apéro. Ouvrez la page Dieppe pour tout voir.',
        es: 'En Dieppe ofrezco tours de marisco, mercado, castillo, acantilados y aperitivo. Abra la página de Dieppe para verlos todos.'
      }
    },
    {
      kw: { en: ['book', 'booking', 'reserve', 'reservation', 'sign up', 'how to'], fr: ['réserver', 'réservation', 'comment', 'inscription'], es: ['reservar', 'reserva', 'cómo', 'inscribir'] },
      ans: {
        en: 'Choose a tour and use the booking form on its page, or message Antoine directly on WhatsApp: ' + PHONE + '\n\nHe usually replies within a few hours.',
        fr: 'Choisissez une visite et utilisez le formulaire de sa page, ou écrivez directement à Antoine sur WhatsApp : ' + PHONE + '\n\nIl répond généralement en quelques heures.',
        es: 'Elija un tour y use el formulario de su página, o escriba directamente a Antoine por WhatsApp: ' + PHONE + '\n\nSuele responder en pocas horas.'
      }
    },
    {
      kw: { en: ['language', 'english', 'french', 'spanish', 'speak', 'tongue'], fr: ['langue', 'anglais', 'français', 'espagnol', 'parle'], es: ['idioma', 'inglés', 'francés', 'español', 'habla'] },
      ans: {
        en: 'Tours are available in English, French and Spanish. Let Antoine know your preferred language when you book.',
        fr: 'Les visites sont disponibles en français, anglais et espagnol. Indiquez simplement votre langue préférée lors de la réservation.',
        es: 'Las visitas están disponibles en inglés, francés y español. Indique su idioma preferido al reservar.'
      }
    },
    {
      kw: { en: ['group', 'people', 'how many', 'size', 'solo', 'couple', 'private'], fr: ['groupe', 'personnes', 'seul', 'couple', 'privé'], es: ['grupo', 'personas', 'solo', 'pareja', 'privado'] },
      ans: {
        en: 'Tours are private and led by Antoine himself, for your group only. Whether you are solo, a couple or a family, the tour is shaped around you. A few tours, like the treasure hunt, need a minimum group size: it is shown on the tour page.',
        fr: 'Les visites sont privées et menées par Antoine lui-même, pour votre groupe uniquement. Que vous soyez seul, en couple ou en famille, la visite se construit autour de vous. Quelques visites, comme la chasse au trésor, demandent un nombre minimum de participants : il est indiqué sur la page de la visite.',
        es: 'Los tours son privados y los guía el propio Antoine, solo para su grupo. Ya sea solo, en pareja o en familia, el tour se adapta a usted. Algunos tours, como la búsqueda del tesoro, requieren un mínimo de personas: aparece en la página del tour.'
      }
    },
    {
      kw: { en: ['meet', 'meeting', 'where', 'start', 'point', 'location', 'address'], fr: ['retrouver', 'où', 'départ', 'lieu', 'adresse'], es: ['quedar', 'dónde', 'donde', 'salida', 'lugar', 'dirección'] },
      ans: {
        en: 'The meeting point depends on the tour and your accommodation. Antoine will confirm the exact starting point when you book via WhatsApp.',
        fr: 'Le point de rendez-vous dépend de la visite et de votre hébergement. Antoine confirmera le point de départ exact lors de la réservation.',
        es: 'El punto de encuentro depende de la visita y de su alojamiento. Antoine confirmará el punto de partida exacto al reservar.'
      }
    },
    {
      kw: { en: ['cancel', 'cancellation', 'refund', 'change', 'modify', 'postpone'], fr: ['annuler', 'annulation', 'remboursement', 'modifier', 'changer'], es: ['cancelar', 'cancelación', 'reembolso', 'cambiar', 'modificar'] },
      ans: {
        en: 'For cancellations or changes, message Antoine on WhatsApp as soon as possible: ' + PHONE + '\n\nHe is flexible and will do his best to find an alternative date.',
        fr: 'Pour toute annulation ou modification, écrivez à Antoine sur WhatsApp dès que possible : ' + PHONE,
        es: 'Para cancelaciones o cambios, escriba a Antoine por WhatsApp lo antes posible: ' + PHONE
      }
    },
    {
      kw: { en: ['child', 'children', 'kid', 'kids', 'baby', 'family', 'young'], fr: ['enfant', 'enfants', 'bébé', 'famille'], es: ['niño', 'niños', 'bebé', 'familia'] },
      ans: {
        en: 'Families are welcome. Antoine adapts the pace for children, so let him know their ages when you book. Tours with alcohol tastings are best suited to adults.',
        fr: 'Les familles sont les bienvenues. Antoine adapte le rythme pour les enfants, indiquez donc leur âge lors de la réservation. Les visites avec dégustation d\'alcool conviennent surtout aux adultes.',
        es: 'Las familias son bienvenidas. Antoine adapta el ritmo para los niños, así que indique sus edades al reservar. Los tours con cata de alcohol son más adecuados para adultos.'
      }
    },
    {
      kw: { en: ['contact', 'whatsapp', 'phone', 'email', 'call', 'antoine', 'reach', 'message'], fr: ['contacter', 'whatsapp', 'téléphone', 'email', 'appeler', 'antoine'], es: ['contactar', 'whatsapp', 'teléfono', 'email', 'llamar', 'antoine'] },
      ans: {
        en: 'Contact Antoine:\n• WhatsApp / phone: ' + PHONE + '\n• Email: contact@savornstories.com\n\nWhatsApp is the fastest way.',
        fr: 'Contacter Antoine :\n• WhatsApp / téléphone : ' + PHONE + '\n• Email : contact@savornstories.com',
        es: 'Contactar a Antoine:\n• WhatsApp / teléfono: ' + PHONE + '\n• Email: contact@savornstories.com'
      }
    }
  ];

  // Words too generic to identify a single tour in a visitor's question.
  var STOP = ['tour', 'tours', 'walk', 'walking', 'visite', 'visites', 'balade', 'paseo', 'ruta', 'bordeaux', 'burdeos', 'dieppe', 'with', 'avec', 'from', 'your', 'this', 'that', 'morning', 'afternoon', 'evening', 'midi', 'tarde', 'noche', 'half', 'full', 'trip', 'group', 'what', 'which', 'tell', 'about', 'have', 'does', 'much', 'many', 'when', 'where', 'there', 'time'];

  function words(s) {
    return plain(s).split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 4 && STOP.indexOf(w) === -1; });
  }

  function card(t, l) {
    var lines = [T(t.title, l), T(t.summary, l), '• ' + T(t.duration, l), '• ' + priceOf(t, l)];
    if (t.schedule) lines.push('• ' + T(t.schedule, l));
    var items = (t.included && (t.included[K(l)] || t.included.en)) || [];
    if (items.length) lines.push('• ' + items.join('; '));
    lines.push('savornstories.com/tours/' + t.id);
    return lines.join('\n');
  }

  function tourMatch(q, l) {
    if (!DATA) return null;
    var qw = words(q);
    if (!qw.length) return null;
    var best = [];
    var bestScore = 0;
    scope().forEach(function (t) {
      var tw = words(T(t.title, l) + ' ' + t.title.en);
      var score = 0;
      qw.forEach(function (w) {
        for (var i = 0; i < tw.length; i++) {
          if (tw[i].indexOf(w) === 0 || w.indexOf(tw[i]) === 0) { score++; break; }
        }
      });
      if (score > bestScore) { bestScore = score; best = [t]; }
      else if (score > 0 && score === bestScore) best.push(t);
    });
    if (!best.length) return null;
    if (best.length === 1) return card(best[0], l);
    return best.slice(0, 4).map(function (t) {
      return '• ' + T(t.title, l) + ': ' + T(t.duration, l) + ', ' + priceOf(t, l) + '\n  savornstories.com/tours/' + t.id;
    }).join('\n');
  }

  function match(q, l) {
    var byTour = tourMatch(q, l);
    if (byTour) return byTour;
    var ql = q.toLowerCase();
    var best = null, bestScore = 0;
    for (var i = 0; i < FAQ.length; i++) {
      var f = FAQ[i];
      var kws = (f.kw[l] || []).concat(f.kw.en);
      var score = 0;
      for (var j = 0; j < kws.length; j++) {
        if (ql.indexOf(kws[j]) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = f; }
    }
    if (bestScore === 0) return null;
    if (best.dyn && DATA && DYN[best.dyn]) return DYN[best.dyn](l);
    return (best.ans[l] || best.ans.en);
  }

  var style = document.createElement('style');
  style.textContent = [
    '#ss-btn{position:fixed;bottom:calc(22px + env(safe-area-inset-bottom));right:22px;z-index:9000;background:#3d5c3a;color:#f4f0e8;border:none;border-radius:32px;padding:14px 22px 14px 18px;font-size:15px;font-weight:bold;cursor:pointer;font-family:Arial,sans-serif;display:flex;align-items:center;gap:9px;box-shadow:0 4px 20px rgba(0,0,0,.26);transition:transform .14s}',
    '#ss-btn:active{transform:scale(.95)}',
    '#ss-panel{position:fixed;bottom:calc(80px + env(safe-area-inset-bottom));right:12px;left:12px;max-width:440px;margin-left:auto;margin-right:auto;z-index:9000;background:#fff;border-radius:16px;border:.5px solid #c8d5c4;box-shadow:0 8px 32px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;font-family:Arial,sans-serif}',
    '#ss-panel.ss-open{display:flex}',
    '.ss-head{background:#3d5c3a;padding:12px 14px;display:flex;align-items:center;justify-content:space-between}',
    '.ss-head-l{display:flex;align-items:center;gap:9px}',
    '.ss-av{width:32px;height:32px;border-radius:50%;background:#e8f0e5;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}',
    '.ss-hn{font-size:13px;font-weight:bold;color:#f4f0e8;line-height:1.2}',
    '.ss-hs{font-size:11px;color:#c8d5c4}',
    '.ss-x{background:none;border:none;color:#f4f0e8;font-size:20px;cursor:pointer;padding:0;line-height:1;opacity:.75}',
    '.ss-x:hover{opacity:1}',
    '#ss-msgs{overflow-y:auto;padding:13px 12px;display:flex;flex-direction:column;gap:8px;max-height:260px;min-height:80px}',
    '.ss-m{max-width:87%;padding:9px 13px;border-radius:13px;font-size:13px;line-height:1.55;white-space:pre-wrap;word-break:break-word}',
    '.ss-bot{background:#f0f4ef;color:#2c2020;border-bottom-left-radius:3px;align-self:flex-start}',
    '.ss-usr{background:#3d5c3a;color:#f4f0e8;border-bottom-right-radius:3px;align-self:flex-end}',
    '#ss-quick{padding:0 11px 9px;display:flex;flex-wrap:wrap;gap:6px}',
    '.ss-q{background:#e8f0e5;color:#3d5c3a;border:none;border-radius:13px;padding:6px 11px;font-size:11px;font-family:Arial,sans-serif;cursor:pointer;font-weight:bold}',
    '.ss-q:hover{background:#c8d5c4}',
    '.ss-foot{padding:9px 10px;border-top:.5px solid #e8e2d4;display:flex;gap:7px;align-items:flex-end}',
    '#ss-inp{flex:1;border:.5px solid #c8d5c4;border-radius:18px;padding:8px 12px;font-size:13px;font-family:Arial,sans-serif;outline:none;resize:none;line-height:1.4;max-height:68px;overflow-y:auto}',
    '#ss-inp:focus{border-color:#3d5c3a}',
    '#ss-send{background:#3d5c3a;border:none;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}'
  ].join('');
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'ss-btn';
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f4f0e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span id="ss-btn-lbl">Ask me</span>';
  document.body.appendChild(btn);

  var panel = document.createElement('div');
  panel.id = 'ss-panel';
  panel.innerHTML = '<div class="ss-head"><div class="ss-head-l"><div class="ss-av">🗺️</div><div><div class="ss-hn">Savor &amp; Stories</div><div class="ss-hs" id="ss-sub">Quick answers · EN / FR / ES</div></div></div><button class="ss-x" id="ss-x">✕</button></div><div id="ss-msgs"></div><div id="ss-quick"></div><div class="ss-foot"><textarea id="ss-inp" rows="1" placeholder="Type your question…"></textarea><button id="ss-send"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button></div>';
  document.body.appendChild(panel);

  var msgsEl = document.getElementById('ss-msgs');
  var inp = document.getElementById('ss-inp');
  var quickEl = document.getElementById('ss-quick');
  var greeted = false;
  var greetingEl = null;

  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'ss-m ss-' + who;
    d.textContent = text;
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return d;
  }

  function renderQuick(l) {
    var qs = (UI[l] || UI.en).quick;
    quickEl.innerHTML = '';
    qs.forEach(function (q) {
      var b = document.createElement('button');
      b.className = 'ss-q';
      b.textContent = q;
      b.onclick = function () { send(q); };
      quickEl.appendChild(b);
    });
  }

  function onLangChange() {
    var l = L();
    var ui = UI[l] || UI.en;
    document.getElementById('ss-btn-lbl').textContent = ui.btnLabel;
    inp.placeholder = ui.placeholder;
    if (greetingEl) {
      greetingEl.textContent = ui.greeting;
    }
    if (panel.classList.contains('ss-open')) renderQuick(l);
  }

  function updateLabels() {
    var l = L();
    var ui = UI[l] || UI.en;
    document.getElementById('ss-btn-lbl').textContent = ui.btnLabel;
    inp.placeholder = ui.placeholder;
  }

  function openPanel() {
    panel.classList.add('ss-open');
    var l = L();
    if (!greeted) {
      greetingEl = addMsg((UI[l] || UI.en).greeting, 'bot');
      greeted = true;
    }
    renderQuick(l);
    inp.focus();
  }

  function closePanel() {
    panel.classList.remove('ss-open');
  }

  function send(text) {
    var l = L();
    text = text || inp.value.trim();
    if (!text) return;
    addMsg(text, 'usr');
    inp.value = '';
    quickEl.innerHTML = '';
    var ans = match(text, l);
    setTimeout(function () {
      addMsg(ans || (UI[l] || UI.en).noMatch, 'bot');
      renderQuick(l);
    }, 300);
  }

  btn.addEventListener('click', openPanel);
  document.getElementById('ss-x').addEventListener('click', closePanel);
  document.getElementById('ss-send').addEventListener('click', function () { send(); });
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  function attachLangListeners() {
    var buttons = document.querySelectorAll('[data-set-lang]');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        setTimeout(onLangChange, 50);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { attachLangListeners(); updateLabels(); });
  } else {
    attachLangListeners();
    updateLabels();
  }
})();
