import { getCollection } from 'astro:content';

export async function GET() {
  const tours = await getCollection('tours');
  const rank = (city: string) => (city === 'bordeaux' ? 0 : 1);
  const data = tours
    .sort((a, b) => rank(a.data.city) - rank(b.data.city) || a.data.order - b.data.order)
    .map((t) => ({
      id: t.id,
      city: t.data.city,
      title: t.data.title,
      summary: t.data.summary,
      duration: t.data.duration,
      price: t.data.price,
      priceLabel: t.data.priceLabel ?? null,
      schedule: t.data.schedule ?? null,
      included: t.data.included,
    }));
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
