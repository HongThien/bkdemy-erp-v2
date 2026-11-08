import fs from 'node:fs'
const D = 'kho-rules/dai/lo/k10-htl/'
const cau = Object.fromEntries(JSON.parse(fs.readFileSync(D+'cau.json','utf8')).map(q=>[q.ma_cau,q]))
const rows = JSON.parse(fs.readFileSync(D+'gop.json','utf8'))
const [loai, a, b] = process.argv.slice(2)
const sel = rows.filter(r => loai==='bat' ? !r.dong_y : (r.dong_y && r.dx && r.a.dang_id!==r.dx)).slice(+a, +b)
const short = (s,n)=>String(s||'').replace(/\s+/g,' ').slice(0,n)
for (const r of sel) { const q = cau[r.ma_cau]
  console.log(`\n### ${r.ma_cau} [${q.loai_cau}${q.anh_de?' +HÌNH':''}] cũ=${r.dang_cu} đx=${r.dx}(${r.dx_chac}) | A=${r.a.dang_id}/${r.a.chac} B=${r.b.dang_id}/${r.b.chac}`)
  console.log('ĐỀ:', short(q.noi_dung, 420), q.lua_chon? ' | '+short(JSON.stringify(q.lua_chon),160):'', q.menh_de? ' | MĐ:'+short(JSON.stringify(q.menh_de.map(m=>m.noi_dung)),260):'')
  console.log('ĐÁP:', short(q.dap_an,40), '| GIẢI:', short(q.loi_giai, 220))
  console.log('lý do A:', short(r.a.ly_do,150), '\nlý do B:', short(r.b.ly_do,150))
}
console.log('\n[', sel.length, ']')
