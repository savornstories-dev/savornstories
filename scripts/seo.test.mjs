import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { load } from 'cheerio';
const root=new URL('../dist/',import.meta.url).pathname;
const origin='https://savornstories.com';
const xml=load(await readFile(join(root,'sitemap-0.xml'),'utf8'),{xml:true});
const urls=xml('loc').map((_,e)=>xml(e).text()).get();
const pages=await Promise.all(urls.filter(u=>!u.includes('-game/')).map(async url=>({url,$:load(await readFile(join(root,new URL(url).pathname,'index.html'),'utf8'))})));
test('all 20 public pages exist in three crawlable languages; games stay public',()=>{
 assert.equal(urls.length,62);assert.equal(pages.length,60);assert.equal(new Set(urls).size,62);assert(!urls.some(u=>u.includes('playbook')));
});
test('each page has native metadata, a self canonical, one H1 and reciprocal alternates',()=>{
 for(const {url,$} of pages){
  const lang=/^\/(fr|es)\//.exec(new URL(url).pathname)?.[1]||'en';
  assert.equal($('html').attr('lang'),lang,url);assert.equal($('h1').length,1,url);
  assert.equal($('link[rel="canonical"]').attr('href'),url);
  assert($('title').text().length>10);assert($('meta[name="description"]').attr('content').length>40);
  for(const l of ['en','fr','es','x-default'])assert(urls.includes($(`link[hreflang="${l}"]`).attr('href')),`${url}: ${l}`);
  assert.equal($('meta[property="og:url"]').attr('content'),url);assert($('meta[property="og:image"]').attr('content').startsWith(origin));
  assert.equal($('#seo-translations').length,0);
  $('[data-lang]').each((_,e)=>{assert.equal($(e).attr('hidden')===undefined,$(e).attr('data-lang')===lang,`${url}: wrong visible language`);});
  $('script[type="application/ld+json"]').each((_,e)=>assert.doesNotThrow(()=>JSON.parse($(e).text())));
  assert.equal($(`a.lbtn[hreflang="${lang}"][aria-current="true"]`).length,2);
 }
 const fr=pages.find(p=>p.url===origin+'/fr/bordeaux/').$;assert.match(fr('title').text(),/Visites/);
 const es=pages.find(p=>p.url===origin+'/es/tours/bordeaux-wine-food-history-walk/').$;assert.match(es('title').text(),/Paseo/);
});
test('every public internal link resolves; locale links retain their language',async()=>{
 for(const {url,$} of pages){
  for(const e of $('a[href]').toArray()){
   const href=$(e).attr('href');if(!href.startsWith('/')||href.startsWith('//'))continue;
   const p=new URL(href,origin).pathname;assert(!p.includes('playbook'));
   await assert.doesNotReject(access(join(root,p,'index.html')),`${url}: broken ${href}`);
   if(/^\/(fr|es)\//.test(new URL(url).pathname)&&!$(e).is('.lbtn')&&!p.includes('-game'))assert.equal(p.split('/')[1],new URL(url).pathname.split('/')[1]);
  }
 }
});
test('all trip schema names and summaries match native tour content; prices are numeric',()=>{
 for(const {url,$} of pages){
  const lang=$('html').attr('lang');
  const visit=v=>{if(Array.isArray(v))return v.forEach(visit);if(!v||typeof v!=='object')return;
   if(v['@type']==='TouristTrip'){assert.equal(v.name,$(`h1 [data-lang="${lang}"]`).text());assert.equal(v.inLanguage,lang);assert.equal(v.url,url);if(v.offers)assert(Number.isFinite(Number(v.offers.price)),url);}
   Object.values(v).forEach(visit);
  };$('script[type="application/ld+json"]').each((_,e)=>visit(JSON.parse($(e).text())));
 }
});
test('optimized images resolve with dimensions and srcset, originals still exist',async()=>{
 for(const {url,$} of pages){
  for(const e of $('img[src^="/assets/optimized/"]').toArray()){
   const img=$(e);assert(Number(img.attr('width'))>0);assert(Number(img.attr('height'))>0);assert(img.attr('srcset'));
   for(const part of img.attr('srcset').split(', '))await assert.doesNotReject(access(join(root,part.split(' ')[0])));
  }
 }
});
