import pg from 'pg'; import fs from 'node:fs'
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')&&l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()];}))
const c = new pg.Client({connectionString: env.DATABASE_URL_RO||env.DATABASE_URL}); await c.connect()
const rows = (await c.query(`select cd.thu_tu a, cd.ten chu_de, o.thu_tu b, ch.ten chuyen_de, n.id nid, n.thu_tu c, n.ten nhom, n.mo_ta nmt, n.ly_thuyet nlt,
  d.id did, d.thu_tu e, d.ten dang, d.mo_ta dmt, d.ly_thuyet dlt, d.vi_du dvd
  from dai_bdm_chu_de cd join dai_bdm_o o on o.chu_de_id=cd.id join dai_bdm_chuyen_de ch on ch.id=o.chuyen_de_id
  left join dai_bdm_nhom n on n.chu_de_id=o.chu_de_id and n.chuyen_de_id=o.chuyen_de_id
  left join dai_bdm_dang_bai d on d.nhom_id=n.id where cd.khoi='10' order by 1,3,6,11`)).rows
const cu = (await c.query(`select u.dich_nhom, u.dich_dang_bai, u.ma_dang_cu, b.ten_dang, l.noi_dung from dai_bdm_doi_ung u join dai_ban_do b on b.ma_dang=u.ma_dang_cu left join dai_dang_ly_thuyet l on l.ma_dang=u.ma_dang_cu where b.khoi='10'`)).rows
const hgt = (await c.query(`select b.ma_dang, b.ten_dang, l.noi_dung from hgt_ban_do b left join hgt_dang_ly_thuyet l on l.ma_dang=b.ma_dang where b.khoi='10' and l.noi_dung<>'' order by 1`)).rows
await c.end()
const nhomMap = new Map(), dang = []
for (const r of rows) {
  if (r.nid && !nhomMap.has(r.nid)) nhomMap.set(r.nid, { nhom_id: r.nid, chu_de: r.chu_de, chuyen_de: r.chuyen_de, nhom: r.nhom, nhom_mo_ta: r.nmt || '', nhom_ly_thuyet_hien_co: r.nlt || '', can_dien_ly_thuyet_nhom: !r.nlt,
    bang_cu: cu.filter(x => x.dich_nhom === r.nid).map(x => ({ ma_dang_cu: x.ma_dang_cu, ten_cu: x.ten_dang, noi_dung_cu: x.noi_dung || '' })) })
  if (r.did) dang.push({ dang_id: r.did, nhom_id: r.nid, chu_de: r.chu_de, chuyen_de: r.chuyen_de, nhom: r.nhom, dang: r.dang, mo_ta: r.dmt || '', ly_thuyet_hien_co: r.dlt || '', vi_du_hien_co: r.dvd || '', can_dien_ly_thuyet: !r.dlt, can_dien_vi_du: !r.dvd,
    bang_cu_dang: cu.filter(x => x.dich_dang_bai === r.did).map(x => ({ ma_dang_cu: x.ma_dang_cu, ten_cu: x.ten_dang, noi_dung_cu: x.noi_dung || '' })) })
}
const G = {
  G1: (n) => n.chu_de.startsWith('Mệnh đề'),
  G2: (n) => n.chu_de.startsWith('Phương trình'),
  G3: (n) => n.chu_de.startsWith('Chủ đề: Hệ thức'),
  G4: (n) => n.chu_de === 'Véc tơ' && /^Các khái niệm|^Véc tơ trong/.test(n.chuyen_de),
  G5: (n) => n.chu_de === 'Véc tơ' && !/^Các khái niệm|^Véc tơ trong/.test(n.chuyen_de),
}
for (const [g, f] of Object.entries(G)) {
  const nh = [...nhomMap.values()].filter(f), ids = new Set(nh.map(x => x.nhom_id))
  const dg = dang.filter(d => ids.has(d.nhom_id))
  const out = { nhom: nh, dang_bai: dg }
  if (g === 'G4' || g === 'G5') out.bang_cu_hgt_chung = hgt.map(x => ({ ma_dang_cu: x.ma_dang, ten_cu: x.ten_dang, noi_dung_cu: x.noi_dung }))
  fs.writeFileSync(`kho-rules/dai/lo/k10-bdm/${g}.in.json`, JSON.stringify(out, null, 1))
  console.log(g, 'nhóm', nh.length, 'dạng', dg.length, 'cần LT', dg.filter(d=>d.can_dien_ly_thuyet).length, 'cần VD', dg.filter(d=>d.can_dien_vi_du).length, 'nhóm cần LT', nh.filter(n=>n.can_dien_ly_thuyet_nhom).length, 'bang_cu nhóm', nh.filter(n=>n.bang_cu.length).length)
}
