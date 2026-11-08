const fs=require('fs');
const meta=JSON.parse(fs.readFileSync('meta-nhom-cu.json','utf8'));
const rows=[];const info={};
for(let i=1;i<=102;i++){const n=String(i).padStart(3,'0');
 for(const l of fs.readFileSync(`lo-${n}.jsonl`,'utf8').split('\n').filter(x=>x.trim())){const j=JSON.parse(l);info[j.id]={ld:j.loai_de,nam:j.nam,nde:j.n_de||1,lc:j.loai_cau}}
 for(const l of fs.readFileSync(`kq/lo-${n}.tsv`,'utf8').replace(/\r/g,'').split('\n').filter(x=>x.length)){const c=l.split('\t');rows.push({id:c[0],ch:c[1],dang:c[2],mo:c[3],muc:c[4],chac:c[5],gc:c[6]})}}
console.log('tổng',rows.length);
const by={};rows.forEach(r=>{(by[r.ch]??={n:0,w:0,c0:0,new:0,q:0,dang:{}});const b=by[r.ch];const w=info[r.id].nde;b.n++;b.w+=w;if(r.chac==='0')b.c0++;if(r.dang==='NEW')b.new++;if(r.dang==='?')b.q++;b.dang[r.dang]=(b.dang[r.dang]||0)+1});
for(const [k,b] of Object.entries(by).sort((a,b)=>b[1].n-a[1].n))console.log(k,'câu',b.n,'lượt-đề',b.w,'chac0',b.c0,'NEW',b.new,'?',b.q,'số dạng dùng',Object.keys(b.dang).length);
fs.writeFileSync('tong.json',JSON.stringify({rows,info}));
// NEW clusters per chapter (count by mo_ta)
const nw={};rows.filter(r=>r.dang==='NEW'||r.dang==='?'||r.ch==='O').forEach(r=>{const k=r.ch+' | '+r.mo;nw[k]=(nw[k]||0)+1});
fs.writeFileSync('new-list.txt',Object.entries(nw).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,v])=>v+'\t'+k).join('\n'));
console.log('NEW/?/O phân biệt',Object.keys(nw).length);
// audit vs old nhóm chương
const map={T11201:'HS',T11204:'NHTP',T11207:'VT',T11208:'XS',T11209:'SDT',T11210:'PPTD'};let n=0,ok=0;
rows.forEach(r=>{const c=map[(meta[r.id]||'').slice(0,6)];if(c){n++;if(c===r.ch)ok++}});console.log('khớp chương với nhóm cũ',ok,'/',n);
