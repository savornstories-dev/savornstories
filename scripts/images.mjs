// Lossy delivery copies only. Original photographs, composition and faces stay intact.
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';
export async function optimizeImages(pages, root, load) {
  const sources = new Set();
  for (const p of pages) load(p.html)('img[src^="/assets/photos/"]').each((_,e)=>sources.add(e.attribs.src));
  const images=new Map();let originalBytes=0,deliveryBytes=0;
  await mkdir(join(root,'assets/optimized'),{recursive:true});
  for(const src of sources){
    const input=join(root,src);const meta=await sharp(input).metadata();
    const widths=[...new Set([480,960,1440,meta.width].filter(w=>w<=meta.width&&w<=1600))].sort((a,b)=>a-b);
    if(!widths.length)widths.push(meta.width);
    const variants=[];
    for(const width of widths){
      const url=`/assets/optimized/${basename(src).replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9_-]/g,'-')}-${width}.webp`;
      const info=await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:86}).toFile(join(root,url));
      variants.push({url,width:info.width,height:info.height,size:info.size});
    }
    originalBytes+=(await stat(input)).size;deliveryBytes+=variants.at(-1).size;
    images.set(src,variants);
  }
  console.log(`Images: ${images.size} original photos retained; largest delivery copies ${Math.round(100*(1-deliveryBytes/originalBytes))}% smaller in total.`);
  return images;
}
