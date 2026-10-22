import fs from 'node:fs'
const D = 'kho-rules/dai/lo/k10-htl/'
const cau = Object.fromEntries(JSON.parse(fs.readFileSync(D+'cau.json','utf8')).map(q=>[q.ma_cau,q]))
const rows = JSON.parse(fs.readFileSync(D+'gop.json','utf8')).filter(r => cau[r.ma_cau].loai_cau !== 'dung_sai' && r.hang === 'de_xuat')
const moi = new Set(['NDB01034','NDB01035','NDB00773'])
const sel = rows.filter(r => !r.dong_y || r.a.dang_id !== r.dx || moi.has(r.a.dang_id) || moi.has(r.b.dang_id) || moi.has(r.dx))
const [a, b] = process.argv.slice(2).map(Number)
const short = (s,n)=>String(s||'').replace(/\s+/g,' ').slice(0,n)
if (process.argv[2]==='count') { console.log('de_xuat non-DS', rows.length, 'cần xem', sel.length, 'còn lại (đồng ý, trùng đề xuất, không mới)', rows.length-sel.length); process.exit() }
for (const r of sel.slice(a,b)) { const q = cau[r.ma_cau]
  console.log(`\n### ${r.ma_cau} [${q.loai_cau}${q.anh_de?' +HÌNH':''}] đx=${r.dx} | A=${r.a.dang_id}/${r.a.chac} B=${r.b.dang_id}/${r.b.chac}`)
  console.log('ĐỀ:', short(q.noi_dung, 380), q.lua_chon? ' | '+short(JSON.stringify(q.lua_chon),140):'')
  console.log('ĐÁP:', short(q.dap_an,30), '| GIẢI:', short(q.loi_giai, 200))
  console.log('A:', short(r.a.ly_do,110), '| B:', short(r.b.ly_do,110))
}
