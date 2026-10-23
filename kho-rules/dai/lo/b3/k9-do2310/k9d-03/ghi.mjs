import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
const [,, lo, mapfile] = process.argv;
const dir = 'C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/b3/k9-do2310';
const inp = JSON.parse(fs.readFileSync(`${dir}/${lo}.json`,'utf8'));
const map = (await import(pathToFileURL(path.resolve(mapfile)).href)).default;
const dich = fs.readFileSync(`${dir}/dich.md`,'utf8');
const ids = new Set([...dich.matchAll(/\*\*(NDB\d+)\*\*/g)].map(m=>m[1]));
const out=[]; const miss=[]; const cnt={cao:0,vua:0,trong:0};
for (const c of inp){
  const m=map[c.ma_cau];
  if(!m){miss.push(c.ma_cau);continue;}
  if(m[0]&&!ids.has(m[0])) throw new Error('bad id '+m[0]+' '+c.ma_cau);
  const w=m[2].split(/\s+/).length;
  if(w>25) console.log('dai',c.ma_cau,w);
  out.push({ma_cau:c.ma_cau,dang_bai_id:m[0],chac:m[1],ly_do:m[2]});
  cnt[m[1]||'trong']++;
}
const extra=Object.keys(map).filter(k=>!inp.find(c=>c.ma_cau===k));
console.log('in',inp.length,'out',out.length,'miss',miss,'extra',extra,cnt);
if(!miss.length&&!extra.length) fs.writeFileSync(`${dir}/${lo}.out.json`,JSON.stringify(out,null,1),'utf8');
