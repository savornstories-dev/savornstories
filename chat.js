(function () {
  'use strict';

  // ─── LANGUAGE ────────────────────────────────────────────────────────────────
  function L() {
    var b = document.querySelector('.lbtn.active');
    if (!b) return 'en';
    var m = (b.getAttribute('onclick') || '').match(/setLang\('(\w+)'\)/);
    return m ? m[1] : 'en';
  }

  // ─── PAGE DETECTION ──────────────────────────────────────────────────────────
  var isBdx = /bordeaux/.test(location.pathname + location.href);

  // ─── UI STRINGS ──────────────────────────────────────────────────────────────
  var UI = {
    en: {
      btnLabel: 'Ask a question',
      sub: 'Quick answers · EN / FR / ES',
      placeholder: 'Type your question…',
      greeting: 'Hi! Ask me anything about our tours — prices, durations, languages, booking.',
      noMatch: 'Not sure about that one. Message Antoine directly on WhatsApp: +33 6 26 39 17 83',
      quick: ['Prices', 'How to book', 'Languages', 'What’s included', 'Group size', 'Contact']
    },
    fr: {
      btnLabel: 'Une question ?',
      sub: 'Réponses rapides · EN / FR / ES',
      placeholder: 'Votre question…',
      greeting: 'Bonjour ! Posez-moi vos questions sur nos visites — tarifs, durées, langues, réservation.',
      noMatch: 'Je ne suis pas sûr de ça. Contactez Antoine directement sur WhatsApp : +33 6 26 39 17 83',
      quick: ['Tarifs', 'Comment réserver', 'Langues', 'Ce qui est inclus', 'Taille du groupe', 'Contact']
    },
    es: {
      btnLabel: '¿Preguntas?',
      sub: 'Respuestas rápidas · EN / FR / ES',
      placeholder: 'Su pregunta…',
      greeting: '¡Hola! Pregúnteme sobre nuestras visitas — precios, duraciones, idiomas, reservas.',
      noMatch: 'No estoy seguro de eso. Escriba a Antoine por WhatsApp: +33 6 26 39 17 83',
      quick: ['Precios', 'Cómo reservar', 'Idiomas', 'Qué incluye', 'Tamaño del grupo', 'Contacto']
    }
  };

  // ─── FAQ — BORDEAUX ──────────────────────────────────────────────────────────
  var FAQ_BDX = [
    {
      kw: { en: ['price', 'cost', 'how much', 'rate', 'fee', 'euro', 'cheap', 'expensive'], fr: ['prix', 'coût', 'combien', 'tarif', 'euro', 'cher', 'gratuit'], es: ['precio', 'coste', 'cuánto', 'cuanto', 'tarifa', 'euro', 'caro'] },
      ans: {
        en: 'Tour prices (per person):\n• Food Tour — 90€ (3h30)\n• Bike Tour — 39€ (3h)\n• History Tour — 60€ (2h)\n• Apéro & Pétanque — 90€ (3h)\n• River Cruise — on request\n• Bespoke Tour — on request\n\nAll tours are private.',
        fr: 'Tarifs (par personne) :\n• Tour Gastronomique — 90€ (3h30)\n• Tour à Vélo — 39€ (3h)\n• Tour Historique — 60€ (2h)\n• Apéro & Pétanque — 90€ (3h)\n• Croisière Garonne — sur devis\n• Tour Sur Mesure — sur devis\n\nToutes les visites sont privées.',
        es: 'Precios (por persona):\n• Tour Gastronómico — 90€ (3h30)\n• Tour en Bicicleta — 39€ (3h)\n• Tour Histórico — 60€ (2h)\n• Apéro & Petanca — 90€ (3h)\n• Crucero por el Garona — a consultar\n• Tour a Medida — a consultar\n\nTodas las visitas son privadas.'
      }
    },
    {
      kw: { en: ['book', 'booking', 'reserve', 'reservation', 'sign up', 'how to'], fr: ['réserver', 'réservation', 'booking', 'comment', 'inscription'], es: ['reservar', 'reserva', 'cómo', 'inscribir'] },
      ans: {
        en: 'Fill in the booking form on this page, or message Antoine directly on WhatsApp: +33 6 26 39 17 83\n\nHe usually replies within a few hours.',
        fr: 'Remplissez le formulaire de réservation sur cette page, ou écrivez à Antoine sur WhatsApp : +33 6 26 39 17 83\n\nIl répond généralement en quelques heures.',
        es: 'Complete el formulario en esta página, o escriba directamente a Antoine por WhatsApp: +33 6 26 39 17 83\n\nSuele responder en pocas horas.'
      }
    },
    {
      kw: { en: ['language', 'english', 'french', 'spanish', 'speak', 'tongue'], fr: ['langue', 'anglais', 'français', 'espagnol', 'parle', 'parler'], es: ['idioma', 'inglés', 'francés', 'español', 'habla', 'hablar'] },
      ans: {
        en: 'Tours are available in English, French and Spanish. Just let Antoine know your preferred language when you book.',
        fr: 'Les visites sont disponibles en français, anglais et espagnol. Indiquez simplement votre langue préférée lors de la réservation.',
        es: 'Las visitas están disponibles en inglés, francés y español. Indique su idioma preferido al reservar.'
      }
    },
    {
      kw: { en: ['duration', 'how long', 'hours', 'long', 'time', 'length'], fr: ['durée', 'combien de temps', 'heures', 'long', 'temps'], es: ['duración', 'cuánto tiempo', 'cuanto tiempo', 'horas', 'larga'] },
      ans: {
        en: 'Tour durations:\n• Food Tour — 3h30\n• Bike Tour — 3h\n• History Tour — 2h\n• Apéro & Pétanque — 3h\n• River Cruise — on request\n• Bespoke Tour — as agreed',
        fr: 'Durées des visites :\n• Tour Gastronomique — 3h30\n• Tour à Vélo — 3h\n• Tour Historique — 2h\n• Apéro & Pétanque — 3h\n• Croisière Garonne — sur devis\n• Tour Sur Mesure — selon accord',
        es: 'Duraciones:\n• Tour Gastronómico — 3h30\n• Tour en Bicicleta — 3h\n• Tour Histórico — 2h\n• Apéro & Petanca — 3h\n• Crucero por el Garona — a consultar\n• Tour a Medida — según acuerdo'
      }
    },
    {
      kw: { en: ['sunday', 'weekend', 'days available', 'schedule', 'when', 'open', 'run', 'available'], fr: ['dimanche', 'week-end', 'jours', 'disponible', 'quand', 'ouvert'], es: ['domingo', 'fin de semana', 'días', 'disponible', 'cuándo', 'cuando', 'horario', 'abierto'] },
      ans: {
        en: 'Most tours run every day including Sundays.\n\nThe Food Tour (restaurant meal included) does not run on Sundays, as most Bordeaux restaurants are closed that day. All other tours are available daily.',
        fr: 'La plupart des visites ont lieu tous les jours, y compris le dimanche.\n\nLe Tour Gastronomique (qui comprend un repas au restaurant) ne se déroule pas le dimanche, car la plupart des restaurants bordelais sont fermés ce jour-là. Toutes les autres visites sont disponibles chaque jour.',
        es: 'La mayoría de las visitas se realizan todos los días incluidos los domingos.\n\nEl Tour Gastronómico (que incluye una comida en restaurante) no se realiza los domingos, ya que la mayoría de los restaurantes de Burdeos están cerrados. Las demás visitas están disponibles todos los días.'
      }
    },
    {
      kw: { en: ['group', 'people', 'how many', 'size', 'family', 'solo', 'couple', 'private'], fr: ['groupe', 'personnes', 'combien de personnes', 'famille', 'seul', 'couple', 'privé'], es: ['grupo', 'personas', 'cuántas', 'familia', 'solo', 'pareja', 'privado'] },
      ans: {
        en: 'All tours are private — just your group and Antoine. Whether you’re solo, a couple or a family, the tour is tailored to you. Contact Antoine for large groups.',
        fr: 'Toutes les visites sont privées — juste votre groupe et Antoine. Que vous soyez seul, en couple ou en famille, la visite est adaptée à vous. Contactez Antoine pour les grands groupes.',
        es: 'Todas las visitas son privadas — solo su grupo y Antoine. Sea solo, en pareja o en familia, la visita se adapta a usted. Contacte a Antoine para grupos grandes.'
      }
    },
    {
      kw: { en: ['include', 'included', 'what', 'food', 'drink', 'wine', 'bicycle', 'bike', 'equipment'], fr: ['inclus', 'compris', 'comprend', 'inclut', 'nourriture', 'boisson', 'vin', 'vélo', 'équipement'], es: ['incluye', 'incluido', 'qué', 'comida', 'bebida', 'vino', 'bicicleta', 'equipo'] },
      ans: {
        en: 'What’s included by tour:\n• Food Tour — wine tasting, full meal, cheese or chocolate tasting\n• Bike Tour — bicycle hire\n• History Tour — guided walk\n• Apéro & Pétanque — wines, snacks, pétanque equipment\n• River Cruise & Bespoke — details on request',
        fr: 'Ce qui est inclus par visite :\n• Tour Gastronomique — dégustation de vins, repas complet, chocolat ou fromage\n• Tour à Vélo — location du vélo\n• Tour Historique — visite à pied guidée\n• Apéro & Pétanque — vins, snacks, matériel de pétanque\n• Croisière & Tour Sur Mesure — détails sur devis',
        es: 'Qué incluye cada visita:\n• Tour Gastronómico — cata de vinos, comida completa, queso o chocolate\n• Tour en Bicicleta — alquiler de bicicleta\n• Tour Histórico — paseo guiado\n• Apéro & Petanca — vinos, aperitivos, material de petanca\n• Crucero & Tour a Medida — detalles a consultar'
      }
    },
    {
      kw: { en: ['meet', 'meeting', 'where', 'start', 'point', 'location', 'address', 'place'], fr: ['retrouver', 'rencontrer', 'où', 'départ', 'point', 'lieu', 'adresse', 'endroit'], es: ['quedar', 'reunir', 'dónde', 'donde', 'salida', 'punto', 'lugar', 'dirección'] },
      ans: {
        en: 'The meeting point depends on the tour and your accommodation. Antoine will confirm the exact starting point when you book via WhatsApp.',
        fr: 'Le point de rendez-vous dépend de la visite et de votre hébergement. Antoine confirmera le point de départ exact lors de la réservation via WhatsApp.',
        es: 'El punto de encuentro depende de la visita y de su alojamiento. Antoine confirmará el punto de partida exacto al reservar por WhatsApp.'
      }
    },
    {
      kw: { en: ['cancel', 'cancellation', 'refund', 'change', 'modify', 'postpone'], fr: ['annuler', 'annulation', 'remboursement', 'modifier', 'changer', 'reporter'], es: ['cancelar', 'cancelación', 'reembolso', 'cambiar', 'modificar', 'aplazar'] },
      ans: {
        en: 'For cancellations or changes, message Antoine on WhatsApp as soon as possible: +33 6 26 39 17 83\n\nHe is flexible and will do his best to find an alternative date.',
        fr: 'Pour toute annulation ou modification, écrivez à Antoine sur WhatsApp dès que possible : +33 6 26 39 17 83\n\nIl est flexible et fera de son mieux pour trouver une autre date.',
        es: 'Para cancelaciones o cambios, escriba a Antoine por WhatsApp lo antes posible: +33 6 26 39 17 83\n\nEs flexible y hará lo posible para encontrar una fecha alternativa.'
      }
    },
    {
      kw: { en: ['contact', 'whatsapp', 'phone', 'email', 'call', 'antoine', 'reach', 'message'], fr: ['contacter', 'whatsapp', 'téléphone', 'email', 'appeler', 'antoine', 'joindre'], es: ['contactar', 'whatsapp', 'teléfono', 'email', 'llamar', 'antoine', 'escribir'] },
      ans: {
        en: 'Contact Antoine:\n• WhatsApp / phone: +33 6 26 39 17 83\n• Email: contact@savornstories.com\n\nWhatsApp is the fastest way to get a reply.',
        fr: 'Contacter Antoine :\n• WhatsApp / téléphone : +33 6 26 39 17 83\n• Email : contact@savornstories.com\n\nWhatsApp est le moyen le plus rapide.',
        es: 'Contactar a Antoine:\n• WhatsApp / teléfono: +33 6 26 39 17 83\n• Email: contact@savornstories.com\n\nWhatsApp es la forma más rápida.'
      }
    },
    {
      kw: { en: ['food tour', 'gastro', 'restaurant', 'meal', 'lunch', 'dinner', 'wine tasting', 'chocolate', 'cheese'], fr: ['gastronomique', 'vin', 'restaurant', 'repas', 'déjeuner', 'dîner', 'dégustation', 'chocolat', 'fromage'], es: ['gastronómico', 'vino', 'restaurante', 'comida', 'almuerzo', 'cena', 'degustación', 'chocolate', 'queso'] },
      ans: {
        en: 'The Food Tour (90€/person, 3h30) includes wine tasting, a traditional lunch or dinner at a local restaurant, plus cheese or chocolate tasting.\n\nRuns Monday to Saturday — not Sundays.',
        fr: 'Le Tour Gastronomique (90€/personne, 3h30) comprend une dégustation de vins, un déjeuner ou dîner traditionnel dans un restaurant local, et une dégustation de chocolat ou de fromage.\n\nDu lundi au samedi — pas le dimanche.',
        es: 'El Tour Gastronómico (90€/persona, 3h30) incluye cata de vinos, almuerzo o cena tradicional en restaurante local, y degustación de queso o chocolate.\n\nDe lunes a sábado — no los domingos.'
      }
    },
    {
      kw: { en: ['bike', 'bicycle', 'cycling', 'cycle', 'riverside', 'riverbank', 'quai'], fr: ['vélo', 'cyclisme', 'quais', 'rivière', 'bord de l’eau'], es: ['bicicleta', 'bici', 'ciclismo', 'muelles', 'orilla'] },
      ans: {
        en: 'The Bike Tour (39€/person, 3h) takes you along the Garonne riverbanks and through Bordeaux’s historic neighbourhoods. Bicycles are included. Available every day.',
        fr: 'Le Tour à Vélo (39€/personne, 3h) vous emmène le long des quais de la Garonne et à travers les quartiers historiques de Bordeaux. Les vélos sont inclus. Disponible tous les jours.',
        es: 'El Tour en Bicicleta (39€/persona, 3h) le lleva por los muelles del Garona y los barrios históricos de Burdeos. Las bicicletas están incluidas. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['history', 'heritage', 'architecture', 'walk', 'UNESCO', 'monument', 'historical', 'roman', 'old town'], fr: ['histoire', 'patrimoine', 'architecture', 'promenade', 'UNESCO', 'monument', 'historique', 'romain', 'vieille ville'], es: ['historia', 'patrimonio', 'arquitectura', 'paseo', 'UNESCO', 'monumento', 'histórico', 'romano', 'casco antiguo'] },
      ans: {
        en: 'The History Tour (60€/person, 2h) is a walking tour through 2,000 years of Bordeaux history, from Roman origins to UNESCO-listed monuments. Available every day including Sundays.',
        fr: 'Le Tour Historique (60€/personne, 2h) est une visite à pied à travers 2 000 ans d’histoire bordelaise, des origines romaines aux monuments classés UNESCO. Disponible tous les jours y compris le dimanche.',
        es: 'El Tour Histórico (60€/persona, 2h) es una visita a pie por 2.000 años de historia de Burdeos, desde sus orígenes romanos hasta los monumentos Patrimonio de la Humanidad. Disponible todos los días incluidos los domingos.'
      }
    },
    {
      kw: { en: ['petanque', 'pétanque', 'apero', 'apéro', 'aperitif', 'apéritif', 'boules'], fr: ['pétanque', 'apéro', 'apéritif', 'boules'], es: ['petanca', 'aperitivo', 'bochas', 'pétanque'] },
      ans: {
        en: 'The Apéro & Pétanque tour (90€/person, 3h): local wines and snacks, then pétanque by the Garonne. Very convivial. Available every day.',
        fr: 'L’Apéro & Pétanque (90€/personne, 3h) : vins locaux et snacks, puis pétanque au bord de la Garonne. Très convivial. Disponible tous les jours.',
        es: 'El Apéro & Petanca (90€/persona, 3h): vinos locales y aperitivos, luego petanca junto al río. Muy animado. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['child', 'children', 'kid', 'kids', 'baby', 'family', 'young'], fr: ['enfant', 'enfants', 'bébé', 'famille', 'jeune'], es: ['niño', 'niños', 'bebé', 'familia', 'joven'] },
      ans: {
        en: 'Tours are family-friendly. Antoine adapts the pace and content for families with children. Let him know the ages of the children when you book.',
        fr: 'Les visites sont adaptées aux familles. Antoine adapte volontiers le rythme et le contenu. Indiquez l’âge des enfants lors de la réservation.',
        es: 'Las visitas son aptas para familias. Antoine adapta el ritmo y el contenido. Indique la edad de los niños al reservar.'
      }
    },
    {
      kw: { en: ['saint-emilion', 'saint emilion', 'emilion', 'day trip', 'day out', 'countryside'], fr: ['saint-émilion', 'saint émilion', 'émilion', 'excursion', 'campagne'], es: ['saint-emilion', 'saint emilion', 'emilion', 'excursión', 'campo'] },
      ans: {
        en: 'A Saint-Émilion day trip is available by arrangement. Contact Antoine on WhatsApp to organise: +33 6 26 39 17 83',
        fr: 'Une excursion à Saint-Émilion est possible sur arrangement. Contactez Antoine sur WhatsApp pour organiser : +33 6 26 39 17 83',
        es: 'Una excursión a Saint-Émilion está disponible bajo petición. Contacte a Antoine por WhatsApp: +33 6 26 39 17 83'
      }
    }
  ];

  // ─── FAQ — DIEPPE ────────────────────────────────────────────────────────────
  var FAQ_DPP = [
    {
      kw: { en: ['price', 'cost', 'how much', 'rate', 'fee', 'euro', 'cheap', 'expensive'], fr: ['prix', 'coût', 'combien', 'tarif', 'euro', 'cher'], es: ['precio', 'coste', 'cuánto', 'cuanto', 'tarifa', 'euro', 'caro'] },
      ans: {
        en: 'Tour prices in Dieppe (per person):\n• Market Tour — 55€\n• Seafood & Harbour Tour — 75€\n• Castle & History Tour — 60€\n• Cliffs Walk — 45€\n• Norman Apéro — 65€\n• Bespoke Tour — on request\n\nAll tours are private.',
        fr: 'Tarifs à Dieppe (par personne) :\n• Tour du Marché — 55€\n• Tour Fruits de Mer & Port — 75€\n• Tour Château & Histoire — 60€\n• Balade des Falaises — 45€\n• Apéro Normand — 65€\n• Tour Sur Mesure — sur devis\n\nToutes les visites sont privées.',
        es: 'Precios en Dieppe (por persona):\n• Tour del Mercado — 55€\n• Tour Mariscos & Puerto — 75€\n• Tour Castillo & Historia — 60€\n• Paseo por los Acantilados — 45€\n• Aperitivo Normando — 65€\n• Tour a Medida — a consultar\n\nTodas las visitas son privadas.'
      }
    },
    {
      kw: { en: ['book', 'booking', 'reserve', 'reservation', 'how to'], fr: ['réserver', 'réservation', 'comment', 'inscription'], es: ['reservar', 'reserva', 'cómo', 'inscribir'] },
      ans: {
        en: 'Fill in the booking form on this page, or message Antoine directly on WhatsApp: +33 6 26 39 17 83',
        fr: 'Remplissez le formulaire sur cette page, ou écrivez à Antoine sur WhatsApp : +33 6 26 39 17 83',
        es: 'Complete el formulario en esta página, o escriba directamente a Antoine por WhatsApp: +33 6 26 39 17 83'
      }
    },
    {
      kw: { en: ['language', 'english', 'french', 'spanish', 'speak'], fr: ['langue', 'anglais', 'français', 'espagnol', 'parle'], es: ['idioma', 'inglés', 'francés', 'español', 'habla'] },
      ans: {
        en: 'Tours are available in English, French and Spanish.',
        fr: 'Les visites sont disponibles en français, anglais et espagnol.',
        es: 'Las visitas están disponibles en inglés, francés y español.'
      }
    },
    {
      kw: { en: ['group', 'people', 'how many', 'size', 'family', 'solo', 'couple', 'private'], fr: ['groupe', 'personnes', 'combien', 'famille', 'seul', 'couple', 'privé'], es: ['grupo', 'personas', 'familia', 'solo', 'pareja', 'privado'] },
      ans: {
        en: 'All tours are private — just your group and Antoine. Whether solo, a couple or a family, the tour is tailored to you.',
        fr: 'Toutes les visites sont privées — juste votre groupe et Antoine.',
        es: 'Todas las visitas son privadas — solo su grupo y Antoine.'
      }
    },
    {
      kw: { en: ['market', 'cheese', 'pollet', 'tuesday'], fr: ['marché', 'fromage', 'pollet', 'mardi'], es: ['mercado', 'queso', 'pollet', 'martes'] },
      ans: {
        en: 'The Market Tour (55€/person) visits the Marché du Pollet and local artisan producers. You’ll taste Norman cheeses and local specialities.\n\nThe market runs Tuesday to Sunday — not Mondays.',
        fr: 'Le Tour du Marché (55€/personne) visite le Marché du Pollet et les producteurs artisanaux locaux. Dégustation de fromages normands incluse.\n\nLe marché a lieu du mardi au dimanche — pas le lundi.',
        es: 'El Tour del Mercado (55€/persona) visita el Mercado du Pollet y productores artesanales. Incluyé degustación de quesos normandos.\n\nEl mercado funciona de martes a domingo — no los lunes.'
      }
    },
    {
      kw: { en: ['seafood', 'scallop', 'oyster', 'harbour', 'port', 'fish', 'coquille', 'saint-jacques', 'fishing'], fr: ['fruits de mer', 'coquille', 'saint-jacques', 'huître', 'port', 'poisson', 'pêche'], es: ['mariscos', 'vieira', 'ostra', 'puerto', 'pescado', 'pesca'] },
      ans: {
        en: 'The Seafood & Harbour Tour (75€/person) takes you to the fishing harbour, fish market and local seafood producers. A real taste of Dieppe’s maritime identity. Available daily.',
        fr: 'Le Tour Fruits de Mer & Port (75€/personne) vous emmène au port de pêche, à la criée et chez les producteurs locaux. Une vraie immersion maritime. Disponible tous les jours.',
        es: 'El Tour Mariscos & Puerto (75€/persona) le lleva al puerto pesquero, la lonja y productores locales. Una auténtica inmersión marítima. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['castle', 'château', 'museum', 'raid', '1942', 'history', 'heritage', 'war'], fr: ['château', 'musée', 'raid', '1942', 'histoire', 'guerre', 'patrimoine'], es: ['castillo', 'museo', 'raid', '1942', 'historia', 'guerra', 'patrimonio'] },
      ans: {
        en: 'The Castle & History Tour (60€/person) explores the Château-Musée de Dieppe and the story of the 1942 Dieppe Raid. Available daily.',
        fr: 'Le Tour Château & Histoire (60€/personne) explore le Château-Musée de Dieppe et l’histoire du Raid de 1942. Disponible tous les jours.',
        es: 'El Tour Castillo & Historia (60€/persona) explora el Château-Musée de Dieppe y la historia del Raid de 1942. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['cliff', 'cliffs', 'walk', 'coastal', 'white', 'pourville', 'nature', 'hike', 'hiking'], fr: ['falaise', 'falaises', 'balade', 'côtier', 'blanche', 'pourville', 'nature', 'randonnée'], es: ['acantilado', 'acantilados', 'paseo', 'costero', 'blanco', 'pourville', 'naturaleza', 'senderismo'] },
      ans: {
        en: 'The Cliffs Walk (45€/person) is a scenic coastal hike along the white cliffs towards Pourville-sur-Mer. Perfect for nature lovers. Available daily.',
        fr: 'La Balade des Falaises (45€/personne) est une randonnée côtière le long des falaises blanches vers Pourville-sur-Mer. Idéale pour les amoureux de la nature. Disponible tous les jours.',
        es: 'El Paseo por los Acantilados (45€/persona) es una caminata costera por los acantilados blancos hacia Pourville-sur-Mer. Perfecto para los amantes de la naturaleza. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['apero', 'apéro', 'cider', 'calvados', 'norman', 'normand', 'aperitif', 'apéritif', 'drink'], fr: ['apéro', 'cidre', 'calvados', 'normand', 'apéritif', 'boisson'], es: ['aperitivo', 'sidra', 'calvados', 'normando', 'bebida'] },
      ans: {
        en: 'The Norman Apéro (65€/person): a relaxed tasting of Norman drinks — cider, calvados and wine — with snacks. Very convivial. Available daily.',
        fr: 'L’Apéro Normand (65€/personne) : dégustation conviviale de boissons normandes — cidre, calvados et vin — avec des snacks. Disponible tous les jours.',
        es: 'El Aperitivo Normando (65€/persona): degustación relajada de bebidas normandas — sidra, calvados y vino — con aperitivos. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['contact', 'whatsapp', 'phone', 'email', 'call', 'antoine', 'reach', 'message'], fr: ['contacter', 'whatsapp', 'téléphone', 'email', 'appeler', 'antoine', 'joindre'], es: ['contactar', 'whatsapp', 'teléfono', 'email', 'llamar', 'antoine'] },
      ans: {
        en: 'Contact Antoine:\n• WhatsApp / phone: +33 6 26 39 17 83\n• Email: contact@savornstories.com',
        fr: 'Contacter Antoine :\n• WhatsApp / téléphone : +33 6 26 39 17 83\n• Email : contact@savornstories.com',
        es: 'Contactar a Antoine:\n• WhatsApp / teléfono: +33 6 26 39 17 83\n• Email: contact@savornstories.com'
      }
    }
  ];

  var FAQ = isBdx ? FAQ_BDX : FAQ_DPP;

  // ─── MATCHING ────────────────────────────────────────────────────────────────
  function match(q, l) {
    var ql = q.toLowerCase();
    var best = null, bestScore = 0;
    for (var i = 0; i < FAQ.length; i++) {
      var f = FAQ[i];
      var kws = f.kw[l] || f.kw.en;
      var score = 0;
      for (var j = 0; j < kws.length; j++) {
        if (ql.indexOf(kws[j]) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = f; }
    }
    if (bestScore === 0) return null;
    return (best.ans[l] || best.ans.en);
  }

  // ─── INJECT STYLES ───────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#ss-btn{position:fixed;bottom:calc(18px + env(safe-area-inset-bottom));right:18px;z-index:9000;background:#3d5c3a;color:#f4f0e8;border:none;border-radius:28px;padding:11px 16px 11px 12px;font-size:12px;font-weight:bold;cursor:pointer;font-family:Arial,sans-serif;display:flex;align-items:center;gap:7px;box-shadow:0 4px 18px rgba(0,0,0,.22);transition:transform .14s}',
    '#ss-btn:active{transform:scale(.95)}',
    '#ss-panel{position:fixed;bottom:calc(72px + env(safe-area-inset-bottom));right:12px;left:12px;max-width:420px;margin-left:auto;margin-right:auto;z-index:9000;background:#fff;border-radius:16px;border:.5px solid #c8d5c4;box-shadow:0 8px 32px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;font-family:Arial,sans-serif}',
    '#ss-panel.ss-open{display:flex}',
    '.ss-head{background:#3d5c3a;padding:11px 13px;display:flex;align-items:center;justify-content:space-between}',
    '.ss-head-l{display:flex;align-items:center;gap:8px}',
    '.ss-av{width:30px;height:30px;border-radius:50%;background:#e8f0e5;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}',
    '.ss-hn{font-size:12px;font-weight:bold;color:#f4f0e8;line-height:1.2}',
    '.ss-hs{font-size:10px;color:#c8d5c4}',
    '.ss-x{background:none;border:none;color:#f4f0e8;font-size:18px;cursor:pointer;padding:0;line-height:1;opacity:.75}',
    '.ss-x:hover{opacity:1}',
    '#ss-msgs{overflow-y:auto;padding:12px 11px;display:flex;flex-direction:column;gap:7px;max-height:240px;min-height:80px}',
    '.ss-m{max-width:87%;padding:8px 11px;border-radius:12px;font-size:12px;line-height:1.55;white-space:pre-wrap;word-break:break-word}',
    '.ss-bot{background:#f0f4ef;color:#2c2020;border-bottom-left-radius:3px;align-self:flex-start}',
    '.ss-usr{background:#3d5c3a;color:#f4f0e8;border-bottom-right-radius:3px;align-self:flex-end}',
    '#ss-quick{padding:0 10px 8px;display:flex;flex-wrap:wrap;gap:5px}',
    '.ss-q{background:#e8f0e5;color:#3d5c3a;border:none;border-radius:12px;padding:5px 9px;font-size:10px;font-family:Arial,sans-serif;cursor:pointer;font-weight:bold}',
    '.ss-q:hover{background:#c8d5c4}',
    '.ss-foot{padding:8px 9px;border-top:.5px solid #e8e2d4;display:flex;gap:6px;align-items:flex-end}',
    '#ss-inp{flex:1;border:.5px solid #c8d5c4;border-radius:18px;padding:7px 11px;font-size:12px;font-family:Arial,sans-serif;outline:none;resize:none;line-height:1.4;max-height:64px;overflow-y:auto}',
    '#ss-inp:focus{border-color:#3d5c3a}',
    '#ss-send{background:#3d5c3a;border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}'
  ].join('');
  document.head.appendChild(style);

  // ─── BUILD DOM ───────────────────────────────────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'ss-btn';
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f4f0e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><span id="ss-btn-lbl">Ask a question</span>';
  document.body.appendChild(btn);

  var panel = document.createElement('div');
  panel.id = 'ss-panel';
  panel.innerHTML = '<div class="ss-head"><div class="ss-head-l"><div class="ss-av">🗺️</div><div><div class="ss-hn">Savor &amp; Stories</div><div class="ss-hs" id="ss-sub">Quick answers · EN / FR / ES</div></div></div><button class="ss-x" id="ss-x">✕</button></div><div id="ss-msgs"></div><div id="ss-quick"></div><div class="ss-foot"><textarea id="ss-inp" rows="1" placeholder="Type your question…"></textarea><button id="ss-send"><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button></div>';
  document.body.appendChild(panel);

  var msgsEl = document.getElementById('ss-msgs');
  var inp = document.getElementById('ss-inp');
  var quickEl = document.getElementById('ss-quick');
  var greeted = false;

  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'ss-m ss-' + who;
    d.textContent = text;
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
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

  function updateLabels() {
    var l = L();
    var ui = UI[l] || UI.en;
    document.getElementById('ss-btn-lbl').textContent = ui.btnLabel;
    inp.placeholder = ui.placeholder;
  }

  function open() {
    panel.classList.add('ss-open');
    var l = L();
    if (!greeted) {
      addMsg((UI[l] || UI.en).greeting, 'bot');
      greeted = true;
    }
    renderQuick(l);
    inp.focus();
  }

  function close() {
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

  btn.addEventListener('click', open);
  document.getElementById('ss-x').addEventListener('click', close);
  document.getElementById('ss-send').addEventListener('click', function () { send(); });
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  // Hook into existing setLang
  var orig = window.setLang;
  if (typeof orig === 'function') {
    window.setLang = function (l) { orig(l); updateLabels(); renderQuick(l); };
  }

  updateLabels();
})();
