(function () {
  'use strict';

  var STORAGE_KEY = 'ss-lang';

  function L() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
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

  var FAQ_BDX = [
    {
      kw: { en: ['price', 'cost', 'how much', 'rate', 'fee', 'euro', 'cheap', 'expensive'], fr: ['prix', 'coût', 'combien', 'tarif', 'euro', 'cher'], es: ['precio', 'coste', 'cuánto', 'cuanto', 'tarifa', 'euro', 'caro'] },
      ans: {
        en: 'Tour prices (per person):\n• Food Tour — 90€ (3h30)\n• Bike Tour — 39€ (3h)\n• History Tour — 60€ (2h)\n• Apéro & Pétanque — 90€ (3h)\n• River Cruise — on request\n• Bespoke Tour — on request\n\nAll tours are private.',
        fr: 'Tarifs (par personne) :\n• Tour Gastronomique — 90€ (3h30)\n• Tour à Vélo — 39€ (3h)\n• Tour Historique — 60€ (2h)\n• Apéro & Pétanque — 90€ (3h)\n• Croisère Garonne — sur devis\n• Tour Sur Mesure — sur devis\n\nToutes les visites sont privées.',
        es: 'Precios (por persona):\n• Tour Gastronómico — 90€ (3h30)\n• Tour en Bicicleta — 39€ (3h)\n• Tour Histórico — 60€ (2h)\n• Apéro & Petanca — 90€ (3h)\n• Crucero por el Garona — a consultar\n• Tour a Medida — a consultar\n\nTodas las visitas son privadas.'
      }
    },
    {
      kw: { en: ['book', 'booking', 'reserve', 'reservation', 'sign up', 'how to'], fr: ['réserver', 'réservation', 'comment', 'inscription'], es: ['reservar', 'reserva', 'cómo', 'inscribir'] },
      ans: {
        en: 'Fill in the booking form on this page, or message Antoine directly on WhatsApp: +33 6 26 39 17 83\n\nHe usually replies within a few hours.',
        fr: 'Remplissez le formulaire de réservation sur cette page, ou écrivez à Antoine sur WhatsApp : +33 6 26 39 17 83\n\nIl répond généralement en quelques heures.',
        es: 'Complete el formulario en esta página, o escriba directamente a Antoine por WhatsApp: +33 6 26 39 17 83\n\nSuele responder en pocas horas.'
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
      kw: { en: ['duration', 'how long', 'hours', 'long', 'time', 'length'], fr: ['durée', 'combien de temps', 'heures', 'long', 'temps'], es: ['duración', 'cuánto tiempo', 'cuanto tiempo', 'horas', 'larga'] },
      ans: {
        en: 'Tour durations:\n• Food Tour — 3h30\n• Bike Tour — 3h\n• History Tour — 2h\n• Apéro & Pétanque — 3h\n• River Cruise — on request\n• Bespoke Tour — as agreed',
        fr: 'Durées :\n• Tour Gastronomique — 3h30\n• Tour à Vélo — 3h\n• Tour Historique — 2h\n• Apéro & Pétanque — 3h\n• Croisère Garonne — sur devis\n• Tour Sur Mesure — selon accord',
        es: 'Duraciones:\n• Tour Gastronómico — 3h30\n• Tour en Bicicleta — 3h\n• Tour Histórico — 2h\n• Apéro & Petanca — 3h\n• Crucero por el Garona — a consultar\n• Tour a Medida — según acuerdo'
      }
    },
    {
      kw: { en: ['sunday', 'weekend', 'days', 'schedule', 'when', 'open', 'available'], fr: ['dimanche', 'week-end', 'jours', 'disponible', 'quand', 'ouvert'], es: ['domingo', 'fin de semana', 'días', 'disponible', 'cuándo', 'cuando', 'horario'] },
      ans: {
        en: 'Most tours run every day including Sundays.\n\nThe Food Tour (restaurant meal included) does not run on Sundays, as most Bordeaux restaurants are closed that day.',
        fr: 'La plupart des visites ont lieu tous les jours, y compris le dimanche.\n\nLe Tour Gastronomique (repas au restaurant inclus) ne se déroule pas le dimanche.',
        es: 'La mayoría de las visitas se realizan todos los días incluidos los domingos.\n\nEl Tour Gastronómico (comida en restaurante incluida) no se realiza los domingos.'
      }
    },
    {
      kw: { en: ['group', 'people', 'how many', 'size', 'family', 'solo', 'couple', 'private'], fr: ['groupe', 'personnes', 'famille', 'seul', 'couple', 'privé'], es: ['grupo', 'personas', 'familia', 'solo', 'pareja', 'privado'] },
      ans: {
        en: 'All tours are private — just your group and Antoine. Whether solo, a couple or a family, the tour is tailored to you.',
        fr: 'Toutes les visites sont privées — juste votre groupe et Antoine.',
        es: 'Todas las visitas son privadas — solo su grupo y Antoine.'
      }
    },
    {
      kw: { en: ['include', 'included', 'what', 'food', 'drink', 'wine', 'bicycle', 'bike', 'equipment'], fr: ['inclus', 'compris', 'comprend', 'nourriture', 'boisson', 'vin', 'vélo'], es: ['incluye', 'incluido', 'qué', 'comida', 'bebida', 'vino', 'bicicleta'] },
      ans: {
        en: 'What’s included by tour:\n• Food Tour — wine tasting, full meal, cheese or chocolate tasting\n• Bike Tour — bicycle hire\n• History Tour — guided walk\n• Apéro & Pétanque — wines, snacks, pétanque equipment\n• River Cruise & Bespoke — details on request',
        fr: 'Ce qui est inclus :\n• Tour Gastronomique — dégustation de vins, repas complet, chocolat ou fromage\n• Tour à Vélo — location du vélo\n• Tour Historique — visite à pied guidée\n• Apéro & Pétanque — vins, snacks, matériel de pétanque\n• Croisère & Tour Sur Mesure — détails sur devis',
        es: 'Qué incluye:\n• Tour Gastronómico — cata de vinos, comida completa, queso o chocolate\n• Tour en Bicicleta — alquiler de bicicleta\n• Tour Histórico — paseo guiado\n• Apéro & Petanca — vinos, aperitivos, material de petanca\n• Crucero & Tour a Medida — detalles a consultar'
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
        en: 'For cancellations or changes, message Antoine on WhatsApp as soon as possible: +33 6 26 39 17 83\n\nHe is flexible and will do his best to find an alternative date.',
        fr: 'Pour toute annulation ou modification, écrivez à Antoine sur WhatsApp dès que possible : +33 6 26 39 17 83',
        es: 'Para cancelaciones o cambios, escriba a Antoine por WhatsApp lo antes posible: +33 6 26 39 17 83'
      }
    },
    {
      kw: { en: ['contact', 'whatsapp', 'phone', 'email', 'call', 'antoine', 'reach', 'message'], fr: ['contacter', 'whatsapp', 'téléphone', 'email', 'appeler', 'antoine'], es: ['contactar', 'whatsapp', 'teléfono', 'email', 'llamar', 'antoine'] },
      ans: {
        en: 'Contact Antoine:\n• WhatsApp / phone: +33 6 26 39 17 83\n• Email: contact@savornstories.com\n\nWhatsApp is the fastest way.',
        fr: 'Contacter Antoine :\n• WhatsApp / téléphone : +33 6 26 39 17 83\n• Email : contact@savornstories.com',
        es: 'Contactar a Antoine:\n• WhatsApp / teléfono: +33 6 26 39 17 83\n• Email: contact@savornstories.com'
      }
    },
    {
      kw: { en: ['food tour', 'gastro', 'restaurant', 'meal', 'lunch', 'dinner', 'wine tasting', 'chocolate', 'cheese'], fr: ['gastronomique', 'vin', 'restaurant', 'repas', 'déjeuner', 'dîner', 'dégustation', 'chocolat', 'fromage'], es: ['gastronómico', 'vino', 'restaurante', 'comida', 'almuerzo', 'cena', 'degustación', 'chocolate', 'queso'] },
      ans: {
        en: 'The Food Tour (90€/person, 3h30) includes wine tasting, a traditional lunch or dinner at a local restaurant, plus cheese or chocolate tasting.\n\nRuns Monday to Saturday — not Sundays.',
        fr: 'Le Tour Gastronomique (90€/personne, 3h30) comprend une dégustation de vins, un déjeuner ou dîner au restaurant local, et une dégustation de chocolat ou fromage.\n\nDu lundi au samedi — pas le dimanche.',
        es: 'El Tour Gastronómico (90€/persona, 3h30) incluye cata de vinos, almuerzo o cena en restaurante local, y degustación de queso o chocolate.\n\nDe lunes a sábado — no los domingos.'
      }
    },
    {
      kw: { en: ['bike', 'bicycle', 'cycling', 'cycle', 'riverside', 'riverbank', 'quai'], fr: ['vélo', 'cyclisme', 'quais'], es: ['bicicleta', 'bici', 'ciclismo', 'muelles'] },
      ans: {
        en: 'The Bike Tour (39€/person, 3h) takes you along the Garonne riverbanks and through Bordeaux’s historic neighbourhoods. Bicycles included. Available every day.',
        fr: 'Le Tour à Vélo (39€/personne, 3h) longe les quais de la Garonne. Les vélos sont inclus. Disponible tous les jours.',
        es: 'El Tour en Bicicleta (39€/persona, 3h) recorre los muelles del Garona. Bicicletas incluidas. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['history', 'heritage', 'walk', 'UNESCO', 'monument', 'roman', 'old town'], fr: ['histoire', 'patrimoine', 'promenade', 'UNESCO', 'monument', 'historique', 'vieille ville'], es: ['historia', 'patrimonio', 'paseo', 'UNESCO', 'monumento', 'histórico', 'casco antiguo'] },
      ans: {
        en: 'The History Tour (60€/person, 2h) is a walking tour through 2,000 years of Bordeaux history, from Roman origins to UNESCO monuments. Available every day.',
        fr: 'Le Tour Historique (60€/personne, 2h) traverse 2 000 ans d’histoire bordelaise. Disponible tous les jours.',
        es: 'El Tour Histórico (60€/persona, 2h) recorre 2.000 años de historia de Burdeos. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['petanque', 'pétanque', 'apero', 'apéro', 'aperitif', 'boules'], fr: ['pétanque', 'apéro', 'apéritif', 'boules'], es: ['petanca', 'aperitivo', 'bochas'] },
      ans: {
        en: 'The Apéro & Pétanque tour (90€/person, 3h): local wines and snacks, then pétanque by the Garonne. Available every day.',
        fr: 'L’Apéro & Pétanque (90€/personne, 3h) : vins locaux, snacks, puis pétanque au bord de la Garonne. Disponible tous les jours.',
        es: 'El Apéro & Petanca (90€/persona, 3h): vinos locales, aperitivos y petanca junto al río. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['child', 'children', 'kid', 'kids', 'baby', 'family', 'young'], fr: ['enfant', 'enfants', 'bébé', 'famille'], es: ['niño', 'niños', 'bebé', 'familia'] },
      ans: {
        en: 'Tours are family-friendly. Antoine adapts the pace for families with children. Let him know the ages when you book.',
        fr: 'Les visites sont adaptées aux familles. Antoine adapte le rythme volontiers. Indiquez l’âge des enfants lors de la réservation.',
        es: 'Las visitas son aptas para familias. Antoine adapta el ritmo. Indique la edad de los niños al reservar.'
      }
    }
  ];

  var FAQ_DPP = [
    {
      kw: { en: ['price', 'cost', 'how much', 'rate', 'fee', 'euro'], fr: ['prix', 'coût', 'combien', 'tarif', 'euro'], es: ['precio', 'coste', 'cuánto', 'cuanto', 'tarifa', 'euro'] },
      ans: {
        en: 'Tour prices in Dieppe (per person):\n• Market Tour — 55€\n• Seafood & Harbour Tour — 75€\n• Castle & History Tour — 60€\n• Cliffs Walk — 45€\n• Norman Apéro — 65€\n• Bespoke Tour — on request\n\nAll tours are private.',
        fr: 'Tarifs à Dieppe (par personne) :\n• Tour du Marché — 55€\n• Tour Fruits de Mer & Port — 75€\n• Tour Château & Histoire — 60€\n• Balade des Falaises — 45€\n• Apéro Normand — 65€\n• Tour Sur Mesure — sur devis\n\nToutes les visites sont privées.',
        es: 'Precios en Dieppe (por persona):\n• Tour del Mercado — 55€\n• Tour Mariscos & Puerto — 75€\n• Tour Castillo & Historia — 60€\n• Paseo por los Acantilados — 45€\n• Aperitivo Normando — 65€\n• Tour a Medida — a consultar\n\nTodas las visitas son privadas.'
      }
    },
    {
      kw: { en: ['book', 'booking', 'reserve', 'how to'], fr: ['réserver', 'réservation', 'comment'], es: ['reservar', 'reserva', 'cómo'] },
      ans: {
        en: 'Fill in the booking form on this page, or message Antoine directly on WhatsApp: +33 6 26 39 17 83',
        fr: 'Remplissez le formulaire sur cette page, ou écrivez à Antoine sur WhatsApp : +33 6 26 39 17 83',
        es: 'Complete el formulario en esta página, o escriba a Antoine por WhatsApp: +33 6 26 39 17 83'
      }
    },
    {
      kw: { en: ['language', 'english', 'french', 'spanish', 'speak'], fr: ['langue', 'anglais', 'français', 'espagnol'], es: ['idioma', 'inglés', 'francés', 'español'] },
      ans: {
        en: 'Tours are available in English, French and Spanish.',
        fr: 'Les visites sont disponibles en français, anglais et espagnol.',
        es: 'Las visitas están disponibles en inglés, francés y español.'
      }
    },
    {
      kw: { en: ['group', 'people', 'how many', 'size', 'family', 'solo', 'couple', 'private'], fr: ['groupe', 'personnes', 'famille', 'seul', 'couple', 'privé'], es: ['grupo', 'personas', 'familia', 'solo', 'pareja', 'privado'] },
      ans: {
        en: 'All tours are private — just your group and Antoine.',
        fr: 'Toutes les visites sont privées — juste votre groupe et Antoine.',
        es: 'Todas las visitas son privadas — solo su grupo y Antoine.'
      }
    },
    {
      kw: { en: ['market', 'cheese', 'pollet', 'tuesday', 'wednesday'], fr: ['marché', 'fromage', 'pollet', 'mardi'], es: ['mercado', 'queso', 'pollet', 'martes'] },
      ans: {
        en: 'The Market Tour (55€/person) visits the Marché du Pollet and local artisan producers with Norman cheese tasting.\n\nThe market runs Tuesday to Sunday — not Mondays.',
        fr: 'Le Tour du Marché (55€/personne) visite le Marché du Pollet avec dégustation de fromages normands.\n\nLe marché a lieu du mardi au dimanche — pas le lundi.',
        es: 'El Tour del Mercado (55€/persona) visita el Mercado du Pollet con degustación de quesos normandos.\n\nEl mercado funciona de martes a domingo — no los lunes.'
      }
    },
    {
      kw: { en: ['seafood', 'scallop', 'oyster', 'harbour', 'port', 'fish', 'coquille'], fr: ['fruits de mer', 'coquille', 'saint-jacques', 'huître', 'port', 'poisson'], es: ['mariscos', 'vieira', 'ostra', 'puerto', 'pescado'] },
      ans: {
        en: 'The Seafood & Harbour Tour (75€/person) takes you to the fishing harbour, fish market and local seafood producers. Available daily.',
        fr: 'Le Tour Fruits de Mer & Port (75€/personne) au port de pêche, à la criée et chez les producteurs. Disponible tous les jours.',
        es: 'El Tour Mariscos & Puerto (75€/persona) lleva al puerto pesquero y productores locales. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['castle', 'museum', 'raid', '1942', 'history', 'war', 'heritage'], fr: ['château', 'musée', 'raid', '1942', 'histoire', 'guerre'], es: ['castillo', 'museo', 'raid', '1942', 'historia', 'guerra'] },
      ans: {
        en: 'The Castle & History Tour (60€/person) explores the Château-Musée de Dieppe and the story of the 1942 Dieppe Raid. Available daily.',
        fr: 'Le Tour Château & Histoire (60€/personne) explore le Château-Musée et l’histoire du Raid de 1942. Disponible tous les jours.',
        es: 'El Tour Castillo & Historia (60€/persona) explora el Château-Musée y la historia del Raid de 1942. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['cliff', 'cliffs', 'walk', 'coastal', 'white', 'pourville', 'nature', 'hike'], fr: ['falaise', 'falaises', 'balade', 'côtier', 'pourville', 'nature', 'randonnée'], es: ['acantilado', 'acantilados', 'paseo', 'costero', 'pourville', 'naturaleza', 'senderismo'] },
      ans: {
        en: 'The Cliffs Walk (45€/person) is a scenic coastal hike along the white cliffs towards Pourville-sur-Mer. Available daily.',
        fr: 'La Balade des Falaises (45€/personne) le long des falaises blanches vers Pourville-sur-Mer. Disponible tous les jours.',
        es: 'El Paseo por los Acantilados (45€/persona) por los acantilados blancos hacia Pourville-sur-Mer. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['apero', 'apéro', 'cider', 'calvados', 'norman', 'aperitif', 'drink'], fr: ['apéro', 'cidre', 'calvados', 'normand', 'apéritif'], es: ['aperitivo', 'sidra', 'calvados', 'normando'] },
      ans: {
        en: 'The Norman Apéro (65€/person): a relaxed tasting of Norman cider, calvados and wine with snacks. Available daily.',
        fr: 'L’Apéro Normand (65€/personne) : dégustation de cidre, calvados et vin normands avec snacks. Disponible tous les jours.',
        es: 'El Aperitivo Normando (65€/persona): degustación de sidra, calvados y vino normando. Disponible todos los días.'
      }
    },
    {
      kw: { en: ['contact', 'whatsapp', 'phone', 'email', 'call', 'antoine'], fr: ['contacter', 'whatsapp', 'téléphone', 'email', 'appeler', 'antoine'], es: ['contactar', 'whatsapp', 'teléfono', 'email', 'llamar', 'antoine'] },
      ans: {
        en: 'Contact Antoine:\n• WhatsApp / phone: +33 6 26 39 17 83\n• Email: contact@savornstories.com',
        fr: 'Contacter Antoine :\n• WhatsApp : +33 6 26 39 17 83\n• Email : contact@savornstories.com',
        es: 'Contactar a Antoine:\n• WhatsApp: +33 6 26 39 17 83\n• Email: contact@savornstories.com'
      }
    }
  ];

  var FAQ_HOME = [
    {
      kw: { en: ['bordeaux', 'wine', 'garonne', 'south', 'southwest', 'gironde'], fr: ['bordeaux', 'vin', 'garonne', 'sud', 'gironde'], es: ['burdeos', 'vino', 'garona', 'sur', 'gironda'] },
      ans: {
        en: 'In Bordeaux I offer:\n• Food Tour — 90€ (3h30)\n• Bike Tour — 39€ (3h)\n• History Tour — 60€ (2h)\n• Apéro & Pétanque — 90€ (3h)\n• River Cruise & Bespoke — on request\n\nAll private, all led personally by me.',
        fr: 'À Bordeaux je propose :\n• Tour Gastronomique — 90€ (3h30)\n• Tour à Vélo — 39€ (3h)\n• Tour Historique — 60€ (2h)\n• Apéro & Pétanque — 90€ (3h)\n• Croisère & Sur Mesure — sur devis\n\nToutes privées, toutes menées personnellement par moi.',
        es: 'En Burdeos ofrezco:\n• Tour Gastronómico — 90€ (3h30)\n• Tour en Bicicleta — 39€ (3h)\n• Tour Histórico — 60€ (2h)\n• Apéro & Petanca — 90€ (3h)\n• Crucero & A Medida — a consultar\n\nTodas privadas, todas guiadas personalmente por mí.'
      }
    },
    {
      kw: { en: ['dieppe', 'normandy', 'scallop', 'cliff', 'castle', '1942', 'north', 'channel', 'newhaven'], fr: ['dieppe', 'normandie', 'coquille', 'falaise', 'château', '1942', 'nord', 'manche', 'newhaven'], es: ['dieppe', 'normandía', 'vieira', 'acantilado', 'castillo', '1942', 'norte', 'canal'] },
      ans: {
        en: 'In Dieppe I offer:\n• Market Tour — 55€\n• Seafood & Harbour Tour — 75€\n• Castle & History Tour — 60€\n• Cliffs Walk — 45€\n• Norman Apéro — 65€\n• Bespoke — on request\n\nAll private, all led personally by me.',
        fr: 'À Dieppe je propose :\n• Tour du Marché — 55€\n• Tour Fruits de Mer & Port — 75€\n• Tour Château & Histoire — 60€\n• Balade des Falaises — 45€\n• Apéro Normand — 65€\n• Sur Mesure — sur devis\n\nToutes privées, toutes menées personnellement par moi.',
        es: 'En Dieppe ofrezco:\n• Tour del Mercado — 55€\n• Tour Mariscos & Puerto — 75€\n• Tour Castillo & Historia — 60€\n• Paseo por los Acantilados — 45€\n• Aperitivo Normando — 65€\n• A Medida — a consultar\n\nTodas privadas, todas guiadas personalmente por mí.'
      }
    },
    {
      kw: { en: ['price', 'cost', 'how much', 'rate', 'fee', 'euro', 'cheap', 'expensive'], fr: ['prix', 'coût', 'combien', 'tarif', 'euro', 'cher'], es: ['precio', 'coste', 'cuánto', 'cuanto', 'tarifa', 'euro', 'caro'] },
      ans: {
        en: 'Bordeaux tours: from 39€ (Bike Tour) to 90€ (Food Tour or Apéro & Pétanque).\nDieppe tours: from 45€ (Cliffs Walk) to 75€ (Seafood & Harbour).\n\nAll tours are private.',
        fr: 'Visites Bordeaux : de 39€ (Tour à Vélo) à 90€ (Tour Gastronomique ou Apéro & Pétanque).\nVisites Dieppe : de 45€ (Balade des Falaises) à 75€ (Tour Fruits de Mer & Port).\n\nToutes les visites sont privées.',
        es: 'Tours Burdeos: de 39€ (Tour en Bicicleta) a 90€ (Tour Gastronómico o Apéro & Petanca).\nTours Dieppe: de 45€ (Paseo por los Acantilados) a 75€ (Tour Mariscos & Puerto).\n\nTodas las visitas son privadas.'
      }
    },
    {
      kw: { en: ['book', 'booking', 'reserve', 'reservation', 'sign up', 'how to'], fr: ['réserver', 'réservation', 'comment', 'inscription'], es: ['reservar', 'reserva', 'cómo', 'inscribir'] },
      ans: {
        en: 'Choose a city, pick a tour, and fill in the booking form — or message Antoine directly on WhatsApp: +33 6 26 39 17 83\n\nHe usually replies within a few hours.',
        fr: 'Choisissez une ville, une visite, et remplissez le formulaire — ou écrivez directement à Antoine sur WhatsApp : +33 6 26 39 17 83\n\nIl répond généralement en quelques heures.',
        es: 'Elija una ciudad, un tour, y rellene el formulario — o escriba directamente a Antoine por WhatsApp: +33 6 26 39 17 83\n\nSuele responder en pocas horas.'
      }
    },
    {
      kw: { en: ['language', 'english', 'french', 'spanish', 'speak', 'tongue'], fr: ['langue', 'anglais', 'français', 'espagnol', 'parle'], es: ['idioma', 'inglés', 'francés', 'español', 'habla'] },
      ans: {
        en: 'All tours are available in English, French and Spanish.',
        fr: 'Toutes les visites sont disponibles en français, anglais et espagnol.',
        es: 'Todas las visitas están disponibles en inglés, francés y español.'
      }
    },
    {
      kw: { en: ['group', 'people', 'how many', 'size', 'family', 'solo', 'couple', 'private'], fr: ['groupe', 'personnes', 'famille', 'seul', 'couple', 'privé'], es: ['grupo', 'personas', 'familia', 'solo', 'pareja', 'privado'] },
      ans: {
        en: 'Every tour is private — just your group and Antoine. Whether solo, a couple or a family.',
        fr: 'Chaque visite est privée — juste votre groupe et Antoine.',
        es: 'Cada visita es privada — solo su grupo y Antoine.'
      }
    },
    {
      kw: { en: ['contact', 'whatsapp', 'phone', 'email', 'call', 'antoine', 'reach', 'message'], fr: ['contacter', 'whatsapp', 'téléphone', 'email', 'appeler', 'antoine'], es: ['contactar', 'whatsapp', 'teléfono', 'email', 'llamar', 'antoine'] },
      ans: {
        en: 'Contact Antoine:\n• WhatsApp / phone: +33 6 26 39 17 83\n• Email: contact@savornstories.com\n\nWhatsApp is the fastest way.',
        fr: 'Contacter Antoine :\n• WhatsApp / téléphone : +33 6 26 39 17 83\n• Email : contact@savornstories.com',
        es: 'Contactar a Antoine:\n• WhatsApp / teléfono: +33 6 26 39 17 83\n• Email: contact@savornstories.com'
      }
    }
  ];

  var FAQ = isBdx ? FAQ_BDX : isDpp ? FAQ_DPP : FAQ_HOME;

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
