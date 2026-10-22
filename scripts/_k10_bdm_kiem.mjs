import fs from 'node:fs'; import { createRequire } from 'node:module'
const katex = createRequire(import.meta.url)('katex')
const D = 'kho-rules/dai/lo/k10-bdm/'
let tot = { dang: 0, lt: 0, vd: 0, nhomlt: 0, loi: [] }
const upd = { dang: [], nhom: [] }
for (const g of ['G1','G2','G3','G4','G5']) {
  const inn = JSON.parse(fs.readFileSync(D+g+'.in.json','utf8')), out = JSON.parse(fs.readFileSync(D+g+'.out.json','utf8'))
  const dIn = new Map(inn.dang_bai.map(d=>[d.dang_id,d])), nIn = new Map(inn.nhom.map(n=>[n.nhom_id,n]))
  const chk = (s, tag) => { if (!s) return; if ((s.split('$').length-1)%2) tot.loi.push([g,tag,'$ lẻ']); if (/\[\[|https?:\/\//.test(s)) tot.loi.push([g,tag,'thẻ/URL']); s.split('$').forEach((p,i)=>{ if(i%2){ try{ katex.renderToString(p,{throwOnError:true}) }catch(e){ tot.loi.push([g,tag,'katex '+p.slice(0,40)]) } } })
    if (!/^##(TC|PP|CY|VD)/.test(s.trim()) ) tot.loi.push([g,tag,'không mở bằng ##']) }
  for (const d of out.dang_bai) {
    const i = dIn.get(d.dang_id); if (!i) { tot.loi.push([g,d.dang_id,'id lạ']); continue }
    tot.dang++
    const u = { id: d.dang_id }
    if (d.ly_thuyet) { if (!i.can_dien_ly_thuyet) tot.loi.push([g,d.dang_id,'ghi đè LT có sẵn']); else { u.ly_thuyet = d.ly_thuyet; tot.lt++; chk(d.ly_thuyet, d.dang_id+' LT') } }
    if (d.vi_du) { if (!i.can_dien_vi_du) tot.loi.push([g,d.dang_id,'ghi đè VD có sẵn']); else { u.vi_du = d.vi_du; tot.vd++; chk(d.vi_du, d.dang_id+' VD'); if (!/##VD[\s\S]*(Hướng dẫn giải|Lời giải)/.test(d.vi_du)) tot.loi.push([g,d.dang_id,'VD thiếu lời giải']) } }
    if (u.ly_thuyet || u.vi_du) upd.dang.push(u)
  }
  for (const n of out.nhom || []) {
    const i = nIn.get(n.nhom_id); if (!i) { tot.loi.push([g,n.nhom_id,'nhóm lạ']); continue }
    if (n.ly_thuyet) { if (!i.can_dien_ly_thuyet_nhom) tot.loi.push([g,n.nhom_id,'ghi đè LT nhóm']); else { upd.nhom.push({ id: n.nhom_id, ly_thuyet: n.ly_thuyet }); tot.nhomlt++; chk(n.ly_thuyet, n.nhom_id+' nhomLT') } }
  }
  const thieu = inn.dang_bai.filter(d=>!out.dang_bai.find(o=>o.dang_id===d.dang_id)).length
  if (thieu) tot.loi.push([g,'-',`thiếu ${thieu} dạng trong out`])
}
fs.writeFileSync(D+'ghi-db.json', JSON.stringify(upd,null,1))
console.log({ dang: tot.dang, lt: tot.lt, vd: tot.vd, nhomlt: tot.nhomlt, upd_dang: upd.dang.length, upd_nhom: upd.nhom.length }); console.log(tot.loi.slice(0,40))
