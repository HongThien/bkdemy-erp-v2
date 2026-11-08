import pg from 'pg'; import fs from 'node:fs'
import { khoaTrung } from './_k10_lib.mjs'
const S = process.argv[2]
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')&&l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}))
const c = new pg.Client({connectionString: env.DATABASE_URL_RO||env.DATABASE_URL}); await c.connect()
const db = (await c.query(`select ma_cau,noi_dung,lua_chon,menh_de from hgt_cau_hoi where xoa_at is null and dang_chinh like 'T310%'`)).rows
await c.end()
const keyDb = new Map()
for (const r of db) {
  keyDb.set(khoaTrung(r.noi_dung), r.ma_cau)
  if (Array.isArray(r.menh_de)) keyDb.set(khoaTrung(r.menh_de.map(m=>m.noi_dung).join('|')), r.ma_cau)
}
const all = []
for (const n of ['nbv','pnl','tt']) for (const r of JSON.parse(fs.readFileSync(`${S}/${n}.json`,'utf8'))) all.push(r)
// nbv.json cũ là {out,bao}? _k10_parse ghi mảng
const ok = all.filter(r=>!r.loi && r.noi_dung)
const seen = new Map(); const rep = {tong: all.length, ok: ok.length, loi: all.length-ok.length, trungDb:0, trungNoi:0, moi:0}
const moi = []
for (const r of ok) {
  const k = r.loai==='dung_sai' ? khoaTrung(r.menh_de.map(m=>m.noi_dung).join('|')) : khoaTrung(r.noi_dung + (r.lua_chon||[]).join('|'))
  const kn = khoaTrung(r.noi_dung)
  if (keyDb.has(kn) || keyDb.has(k)) { r.trung = 'db:' + (keyDb.get(kn)||keyDb.get(k)); rep.trungDb++; continue }
  if (seen.has(k)) { r.trung = 'noi:' + seen.get(k); rep.trungNoi++; continue }
  seen.set(k, `${r.nguon}/${r.file.slice(0,30)}#${r.so}`)
  moi.push(r); rep.moi++
}
fs.writeFileSync(`${S}/moi.json`, JSON.stringify(moi,null,1))
console.log(rep)
const lo = {}; for (const r of moi) { const k=r.nguon+' '+r.loai+(r.imgs_de.length||r.imgs_md?.some(x=>x.length)?' +hinh':''); lo[k]=(lo[k]||0)+1 }
console.log(lo)
console.log('db', db.length)
