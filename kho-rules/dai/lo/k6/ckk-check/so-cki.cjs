const fs=require('fs');const S='C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/b3dfe56d-2dc8-452b-9e45-813c15f6c7da/scratchpad/cki/'
const all=JSON.parse(fs.readFileSync(S+'tat-ca.json','utf8'));const by=new Map(all.map(r=>[r.ma_cau,r]))
const norm=(s)=>String(s??'').replace(/\$/g,'').replace(/\text\{([^}]*)\}/g,'$1').replace(/\dfrac|\frac/g,'F').replace(/\,|\ |\s+/g,'').replace(/[{}]/g,'').replace(/\.$/,'').replace(/,/g,'.').toLowerCase()
let n=0,ok=0;const lech=[],khong=[],nghi=[];const thieu=[]
for(let i=1;i<=6;i++){const f=S+'kq-'+i+'.json';if(!fs.existsSync(f)){thieu.push(i);continue}
 for(const k of JSON.parse(fs.readFileSync(f,'utf8'))){const r=by.get(k.ma_cau);if(!r)continue;n++
  if(k.dap_an==='KHONG_DOC_DUOC'){khong.push(k.ma_cau);continue}
  if(k.nghi)nghi.push(k.ma_cau+': '+k.nghi)
  const a=norm(r.dap_an),b=norm(k.dap_an)
  if(a===b)ok++;else lech.push({ma:k.ma_cau,loai:r.loai_cau,kho:r.dap_an,mu:k.dap_an,ghi:k.ghi,nd:r.noi_dung.replace(/\n/g,' ').slice(0,110)})}}
console.log('lô chưa có:',thieu.join(',')||'—','· câu đã so',n,'· khớp',ok,'· lệch',lech.length,'· không đọc được',khong.length)
for(const l of lech)console.log('LỆCH',l.ma,l.loai,'| kho:',l.kho,'| mù:',l.mu,'|',l.ghi,'\n    ',l.nd)
console.log('KHÔNG ĐỌC ĐƯỢC:',khong.join(' '));console.log('NGHI:\n'+nghi.join('\n'))
