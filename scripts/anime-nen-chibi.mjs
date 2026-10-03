import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
const S='design/bk-ui-src/New_anime/exec-', O='public/bk-ui/hs/skin/rpg/'
const nen = { '2636fb0e-b971-4f63-b62a-896f798556cb':'bg_lau_dai_chibi_ngang', '6c4e72f3-dda1-4352-88ac-590fd7796304':'bg_lau_dai_chibi_doc', '3ccc1736-d716-4d71-a956-402a4aecd884':'bg_dao_troi_chibi_ngang', '147a28bc-350a-4781-a6f3-f340d3c8795e':'bg_dao_troi_chibi_doc' }
for (const [id, ten] of Object.entries(nen)) {
  const im = await loadImage(S+id+'.png'); const c = createCanvas(im.width, im.height); c.getContext('2d').drawImage(im,0,0)
  const b = c.toBuffer('image/jpeg', 80); fs.writeFileSync(O+ten+'.jpg', b); console.log(ten, im.width+'x'+im.height, (b.length/1024|0)+'KB')
}
const nv = { '823d3c23-d9b1-41f5-ad18-2a7c88e7c59a':'nv_nam_chibi', 'da8739e5-b8de-41af-bbbc-6ea479e45a60':'nv_nu_chibi' }
for (const [id, ten] of Object.entries(nv)) {
  const im = await loadImage(S+id+'.png'); const W=im.width,H=im.height; const c = createCanvas(W,H), g=c.getContext('2d'); g.drawImage(im,0,0)
  const img=g.getImageData(0,0,W,H), d=img.data; let x0=W,y0=H,x1=0,y1=0
  for (let y=0;y<H;y++) for (let x=0;x<W;x++){ const i=(y*W+x)*4; if(d[i+3]<24){d[i+3]=0;continue} if(d[i+3]>60){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y } }
  g.putImageData(img,0,0)
  const w=x1-x0+1,h=y1-y0+1, k=Math.min(1, 900/h), ow=Math.round(w*k), oh=Math.round(h*k)
  const o=createCanvas(ow,oh); const og=o.getContext('2d'); og.imageSmoothingQuality='high'; og.drawImage(c,x0,y0,w,h,0,0,ow,oh)
  const b=o.toBuffer('image/png'); fs.writeFileSync(O+ten+'.png', b); console.log(ten, `${W}x${H} bbox ${w}x${h} -> ${ow}x${oh}`, (b.length/1024|0)+'KB')
}
