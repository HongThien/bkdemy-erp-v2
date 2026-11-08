const fs=require('fs');let bad=0,miss=[];
for(let i=1;i<=102;i++){const n=String(i).padStart(3,'0');const f=`kq/lo-${n}.tsv`;
 if(!fs.existsSync(f)){miss.push(n);continue}
 const L=fs.readFileSync(f,'utf8').replace(/\r/g,'').split('\n').filter(x=>x.length);
 const J=fs.readFileSync(`lo-${n}.jsonl`,'utf8').split('\n').filter(x=>x.trim()).map(x=>JSON.parse(x).id);
 const pr=[];if(L.length!==J.length)pr.push(`dòng ${L.length}/${J.length}`);
 L.forEach((l,k)=>{const c=l.split('\t');if(c.length!==7)pr.push(`d${k+1} cột ${c.length}`);else if(c[0]!==J[k])pr.push(`d${k+1} id lệch`)});
 if(pr.length){bad++;console.log(n,pr.slice(0,5).join('; '))}}
console.log('thiếu:',miss.join(','),'| lô lỗi:',bad)
