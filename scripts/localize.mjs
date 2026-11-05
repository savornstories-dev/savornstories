// Build crawlable language versions from the existing EN/FR/ES content.
// The original translated spans and client widgets remain available on every page.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { load } from 'cheerio';
import { optimizeImages } from './images.mjs';
const root = new URL('../dist/', import.meta.url).pathname;
const origin = 'https://savornstories.com';
const langs = ['en', 'fr', 'es'];
const locales = { en: 'en_GB', fr: 'fr_FR', es: 'es_ES' };
const pathFor = (path, lang) => lang === 'en' ? path : `/${lang}${path}`;
async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    // Private static files must never be processed or advertised.
    if (['playbook', 'fr', 'es', '_astro'].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p)); else if (e.name === 'index.html') out.push(p);
  }
  return out;
}
const pages = [];
for (const file of await walk(root)) {
  const html = await readFile(file, 'utf8');
  if (!html.includes('data-seo-page')) continue;
  const path = '/' + relative(root, file).replace(/index\.html$/, '');
  pages.push({ file, html, path });
}
const images = await optimizeImages(pages, root, load);
const routes = new Set(pages.map(p => p.path));
function localURL(value, lang) {
  if (typeof value !== 'string' || (!value.startsWith('/') && !value.startsWith(origin))) return value;
  const u = new URL(value, origin);
  if (u.origin !== origin) return value;
  const path = u.pathname === '/' ? '/' : u.pathname.replace(/\/$/, '') + '/';
  if (!routes.has(path)) return value;
  return origin + pathFor(path, lang) + u.search + u.hash;
}
function normalizeSchema(value, lang, meta, url, tourTitle) {
  if (Array.isArray(value)) return value.map(v => normalizeSchema(v, lang, meta, url, tourTitle));
  if (!value || typeof value !== 'object') return typeof value === 'string' ? localURL(value, lang) : value;
  // Business identity has one stable ID, rather than a fictitious shop address per destination.
  if (value['@type'] === 'LocalBusiness') return { '@id': origin + '/#business' };
  const out = Object.fromEntries(Object.entries(value).map(([k,v]) => [k,
    // Entity IDs and organization URLs stay stable across languages.
    ['@id', '@context'].includes(k) ? v : normalizeSchema(v, lang, meta, url, tourTitle)]));
  if (value['@type'] === 'Organization' || value['@type'] === 'Person' || value['@type'] === 'WebSite') return value;
  if (value['@type'] === 'WebPage') Object.assign(out, { '@id': url + '#webpage', url, name: meta.title, description: meta.description, inLanguage: lang });
  if (value['@type'] === 'TouristTrip') Object.assign(out, { '@id': url + '#tour', url, name: tourTitle || meta.title.split(' | ')[0], description: meta.description, inLanguage: lang, provider: { '@id': origin + '/#business' } });
  if (value['@type'] === 'ListItem' && value.item === url && tourTitle) out.name = tourTitle;
  if (value['@type'] === 'ListItem' && value.position === 1 && value.name === 'Home') out.name = {en:'Home',fr:'Accueil',es:'Inicio'}[lang];
  return out;
}
const entries = [];
for (const page of pages) {
  for (const lang of langs) {
    const $ = load(page.html);
    const translations = JSON.parse($('#seo-translations').text());
    const meta = translations[lang];
    const path = pathFor(page.path, lang);
    const url = origin + path;
    $('html').attr('lang', lang).removeAttr('data-seo-page');
    $('#seo-translations').remove();
    $('[data-lang]').each((_,el) => {
      const e=$(el); if(e.attr('data-lang')===lang)e.removeAttr('hidden');else e.attr('hidden','');
    });
    $('[data-label-en]').each((_,el) => {const e=$(el);e.attr('aria-label',e.attr(`data-label-${lang}`));});
    $('title').text(meta.title);
    $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content',meta.description);
    $('meta[property="og:title"],meta[name="twitter:title"]').attr('content',meta.title);
    $('link[rel="canonical"]').attr('href', url);
    $('meta[property="og:url"]').attr('content', url);
    $('<meta>').attr({ property:'og:locale', content:locales[lang] }).appendTo('head');
    for(const l of langs) {
      $('<link>').attr({rel:'alternate',hreflang:l,href:origin+pathFor(page.path,l)}).appendTo('head');
      if(l!==lang)$('<meta>').attr({property:'og:locale:alternate',content:locales[l]}).appendTo('head');
    }
    $('<link>').attr({rel:'alternate',hreflang:'x-default',href:origin+page.path}).appendTo('head');
    $('a[href]').each((_,el)=>{const e=$(el);const href=e.attr('href');const localized=localURL(href,lang);if(localized!==href)e.attr('href',localized.startsWith(origin)?localized.slice(origin.length):localized);});
    // Real links allow Google and visitors without JavaScript to switch language.
    $('.lbtn[data-set-lang]').each((_,el)=>{
      const e=$(el),target=e.attr('data-set-lang');
      e[0].tagName='a';e.removeAttr('type').removeAttr('aria-pressed').attr('href',pathFor(page.path,target)).attr('hreflang',target);
      e.toggleClass('active',target===lang);if(target===lang)e.attr('aria-current','true');else e.removeAttr('aria-current');
    });
    $('img').each((_,el)=>{
      const e=$(el),src=e.attr('src'),variants=images.get(src);
      if(e.attr(`data-alt-${lang}`))e.attr('alt',e.attr(`data-alt-${lang}`));
      if(!variants)return;
      const largest=variants.at(-1);
      e.attr('src',largest.url).attr('srcset',variants.map(v=>`${v.url} ${v.width}w`).join(', '));
      e.attr('sizes',e.hasClass('absolute')?'100vw':'(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 720px');
      e.attr('width',String(largest.width)).attr('height',String(largest.height)).attr('decoding','async');
    });
    const tourTitle=$(`h1 [data-lang="${lang}"]`).text();
    if(page.path.startsWith('/tours/')) $('meta[property="og:image:alt"],meta[name="twitter:image:alt"]').attr('content',tourTitle);
    $('script[type="application/ld+json"]').each((_,el)=>{
      const data=JSON.parse($(el).text());
      const normalized=normalizeSchema(data,lang,meta,url,tourTitle);
      // Item names on the destination listing must match its visible translated cards.
      const titles=new Map();$('a[href*="/tours/"]').each((_,a)=>{titles.set(new URL($(a).attr('href'),origin).href,$(a).find(`[data-lang="${lang}"]`).filter((_,x)=>$(x).parent().is('h3')).text());});
      const visit=v=>{if(Array.isArray(v))return v.forEach(visit);if(!v||typeof v!=='object')return;if(v['@type']==='ListItem'&&titles.get(v.url))v.name=titles.get(v.url);Object.values(v).forEach(visit);};visit(normalized);
      $(el).text(JSON.stringify(normalized).replace(/</g,'\\u003c'));
    });
    const target=join(root,path.slice(1),'index.html');await mkdir(dirname(target),{recursive:true});await writeFile(target,$.html());
    entries.push({path,alternates:langs.map(l=>({lang:l,url:origin+pathFor(page.path,l)}))});
  }
}
// Single deterministic sitemap, including existing public games but excluding private files.
const games=['/bordeaux-game/','/dieppe-game/'];
const xmlEscape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const urls=entries.map(e=>`<url><loc>${origin+e.path}</loc>${e.alternates.map(a=>`<xhtml:link rel="alternate" hreflang="${a.lang}" href="${xmlEscape(a.url)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${origin+e.alternates[0].url.slice(origin.length)}"/></url>`).concat(games.map(p=>`<url><loc>${origin+p}</loc></url>`));
await writeFile(join(root,'sitemap-0.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`);
await writeFile(join(root,'sitemap-index.xml'),`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${origin}/sitemap-0.xml</loc></sitemap></sitemapindex>`);
console.log(`SEO: ${pages.length} public pages × 3 languages, ${entries.length+games.length} sitemap URLs. Private pages untouched.`);
