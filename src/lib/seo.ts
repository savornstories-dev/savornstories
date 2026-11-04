export const languages = ['en', 'fr', 'es'] as const;
export type Language = typeof languages[number];
export type Localized = Record<Language, string>;
const brand = ' | Savor & Stories';
export const pageMeta: Record<string, { title: Localized; description: Localized }> = {
  '/': {
    title: { en: 'Private Tours in Bordeaux & Dieppe, France', fr: 'Visites privées à Bordeaux et Dieppe avec Antoine', es: 'Tours privados en Burdeos y Dieppe con Antoine' },
    description: {
      en: 'Discover France with Antoine: private Bordeaux food, wine and history tours, personalised walks and Dieppe experiences. Contact your guide directly in English, French or Spanish.',
      fr: 'Découvrez Bordeaux et Dieppe avec Antoine : visites privées, gastronomie, vin, histoire et balades sur mesure. Contactez directement votre guide en français, anglais ou espagnol.',
      es: 'Descubre Francia con Antoine: tours privados de gastronomía, vino e historia en Burdeos y experiencias en Dieppe. Contacta con tu guía en español, francés o inglés.',
    },
  },
  '/bordeaux/': {
    title: { en: 'Bordeaux Food, Wine & History Tours with Antoine', fr: 'Visites de Bordeaux : gastronomie, vin et histoire', es: 'Tours en Burdeos: gastronomía, vino e historia' },
    description: {
      en: 'Explore Bordeaux in southwest France with Antoine. Discover private food and wine walks, historic streets, the Capucins market and personalised tours. Book directly.',
      fr: 'Explorez Bordeaux avec Antoine, guide local : visites gourmandes, vin, patrimoine, marché des Capucins et balades personnalisées. Réservez directement auprès de votre guide.',
      es: 'Explora Burdeos, en el suroeste de Francia, con Antoine: gastronomía, vino, historia, mercado de Capucins y visitas personalizadas. Reserva directamente con tu guía.',
    },
  },
  '/dieppe/': {
    title: { en: 'Dieppe Private Tours: Food, History & Normandy Coast', fr: 'Visites privées à Dieppe : gastronomie et histoire', es: 'Tours privados en Dieppe: gastronomía y Normandía' },
    description: {
      en: 'Discover Dieppe in Normandy with Antoine: scallop and seafood tastings, market visits, castle history and coastal walks. Explore the tours and contact your guide.',
      fr: 'Découvrez Dieppe en Normandie avec Antoine : coquilles Saint-Jacques, marché, fromages, histoire du château et balades côtières. Contactez directement votre guide.',
      es: 'Descubre Dieppe, en Normandía, con Antoine: marisco, mercado, quesos, historia del castillo y paseos costeros. Explora los tours y contacta con tu guía.',
    },
  },
  '/about/': {
    title: { en: 'Meet Antoine, Your Bordeaux & Dieppe Tour Guide', fr: 'Antoine, votre guide à Bordeaux et à Dieppe', es: 'Conoce a Antoine, tu guía en Burdeos y Dieppe' },
    description: { en: 'Meet Antoine, the independent guide behind Savor & Stories. Discover his approach to private food, wine and history tours in Bordeaux and Dieppe, France.', fr: 'Rencontrez Antoine, guide indépendant de Savor & Stories. Découvrez ses visites privées, gourmandes et historiques à Bordeaux et Dieppe.', es: 'Conoce a Antoine, el guía independiente de Savor & Stories, y su forma de compartir la gastronomía y la historia de Burdeos y Dieppe, Francia.' },
  },
  '/contact/': {
    title: { en: 'Book a Bordeaux or Dieppe Tour with Antoine', fr: 'Réserver une visite à Bordeaux ou à Dieppe', es: 'Reserva tu tour en Burdeos o Dieppe con Antoine' },
    description: { en: 'Contact Antoine directly by WhatsApp or email to plan your private Bordeaux or Dieppe tour. Share your dates, group size and interests for a personal reply.', fr: 'Contactez Antoine par WhatsApp ou par email pour organiser votre visite privée à Bordeaux ou Dieppe. Indiquez vos dates, votre groupe et vos envies.', es: 'Contacta con Antoine por WhatsApp o correo para organizar tu tour privado en Burdeos o Dieppe. Cuéntale tus fechas, el tamaño del grupo y tus intereses.' },
  },
  '/worldwide/': {
    title: { en: 'Local Guide Introductions Beyond France', fr: 'Des guides locaux pour voyager au delà de la France', es: 'Contactos con guías locales fuera de Francia' },
    description: { en: 'Antoine guides personally in Bordeaux and Dieppe, France. For other destinations, ask about introductions to local guides he knows and trusts.', fr: 'Antoine vous guide personnellement à Bordeaux et Dieppe. Pour d’autres destinations, il vous met en relation avec des guides locaux qu’il connaît et apprécie.', es: 'Antoine guía personalmente en Burdeos y Dieppe. Para otros destinos, consulta sus contactos con guías locales que conoce y en quienes confía.' },
  },
};
export function metadata(path: string, title: string, description: string, translations?: { title: Localized; description: Localized }) {
  const key = path === '/' ? '/' : path.replace(/\/$/, '') + '/';
  const source = translations ?? pageMeta[key];
  return Object.fromEntries(languages.map(lang => [lang, source ? { title: source.title[lang] + brand, description: source.description[lang] } : { title, description }])) as Record<Language, { title: string; description: string }>;
}
export const business = {
  '@type': 'Organization', '@id': 'https://savornstories.com/#business',
  name: 'Savor & Stories', url: 'https://savornstories.com/',
  telephone: '+33626391783', email: 'contact@savornstories.com',
  areaServed: [{ '@type': 'City', name: 'Bordeaux' }, { '@type': 'City', name: 'Dieppe' }],
  contactPoint: { '@type': 'ContactPoint', telephone: '+33626391783', contactType: 'booking enquiries', availableLanguage: ['English', 'French', 'Spanish'] },
  founder: { '@id': 'https://savornstories.com/#antoine' },
};
