import fs from 'node:fs'
const D = 'kho-rules/dai/lo/k10-htl/'
const cau = Object.fromEntries(JSON.parse(fs.readFileSync(D+'cau.json','utf8')).map(q=>[q.ma_cau,q]))
const rows = JSON.parse(fs.readFileSync(D+'gop.json','utf8')).filter(r => cau[r.ma_cau].loai_cau !== 'dung_sai' && r.hang === 'de_xuat')
const moi = new Set(['NDB01034','NDB01035','NDB00773'])
const rest = rows.filter(r => !(!r.dong_y || r.a.dang_id !== r.dx || moi.has(r.a.dang_id) || moi.has(r.b.dang_id) || moi.has(r.dx)))
const short = (s,n)=>String(s||'').replace(/\s+/g,' ').slice(0,n)
for (const r of rest) { const q = cau[r.ma_cau]; console.log(`${r.ma_cau} ${q.loai_cau.slice(0,3)}${q.anh_de?'+H':''} ${r.dx.slice(3)} ${r.a.chac[0]}${r.b.chac[0]} | ${short(q.noi_dung,170)}${q.lua_chon?' | '+short(JSON.stringify(q.lua_chon),70):''}`) }
console.log(rest.length)
