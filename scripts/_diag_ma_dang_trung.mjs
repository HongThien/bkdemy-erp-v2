import { readFileSync } from 'node:fs'; import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()

const q = async (s, p=[]) => (await c.query(s, p)).rows

console.log('=== SỐ DẠNG MỖI NHÁNH ===')
for (const t of ['dai_ban_do','khtn_ban_do','hgt_ban_do','hinh_dang']) {
  try { console.log(t, (await q(`select count(*)::int c from ${t}`))[0].c) } catch(e){ console.log(t,'ERR',e.message) }
}

console.log('\n=== MẪU MÃ ===')
for (const t of ['dai_ban_do','khtn_ban_do','hgt_ban_do']) {
  const r = await q(`select ma_dang, khoi, ten_dang from ${t} order by ma_dang limit 4`)
  console.log(t, r.map(x=>`${x.ma_dang}|K${x.khoi}|${x.ten_dang?.slice(0,28)}`).join('\n   '+' '.repeat(t.length)))
}

console.log('\n=== TRÙNG dai vs khtn ===')
const dup = await q(`select d.ma_dang, d.khoi, d.ten_dang as toan, k.ten_dang as khtn
  from dai_ban_do d join khtn_ban_do k using (ma_dang) order by d.ma_dang`)
console.log('số mã trùng:', dup.length)
dup.slice(0,25).forEach(r=>console.log(` ${r.ma_dang} K${r.khoi} | Toán: ${r.toan?.slice(0,32)} | KHTN: ${r.khtn?.slice(0,32)}`))

console.log('\n=== TRÙNG với hgt (Hình giáo trình) ===')
for (const [a,b] of [['dai_ban_do','hgt_ban_do'],['khtn_ban_do','hgt_ban_do']]) {
  const n = await q(`select count(*)::int c from ${a} x join ${b} y using (ma_dang)`)
  console.log(`${a} ∩ ${b}: ${n[0].c}`)
}

console.log('\n=== DỮ LIỆU ĐO ĐANG DÙNG MÃ TRÙNG (mù môn) ===')
const consumers = ['bai_test_cau','bo_tro_duoi_dang','bo_tro_yeu_dang','bt_grades','buoi_danh_gia_dang','ca_test_cau','canh_bao_yeu','gami_session_problems']
for (const t of consumers) {
  try {
    const r = await q(`select count(*)::int tong,
      count(*) filter (where ma_dang in (select ma_dang from dai_ban_do intersect select ma_dang from khtn_ban_do))::int trung
      from ${t} where ma_dang is not null`)
    console.log(` ${t}: ${r[0].tong} dòng · ${r[0].trung} dòng mang mã TRÙNG`)
  } catch(e){ console.log(` ${t}: ERR ${e.message}`) }
}

console.log('\n=== CỤM BÀI (mã cụm) ===')
for (const t of ['dai_cum_bai','khtn_cum_bai']) {
  try { const r = await q(`select ma_cum from ${t} order by ma_cum limit 3`); console.log(t, r.map(x=>x.ma_cum).join(', ')) } catch(e){ console.log(t,'ERR') }
}

console.log('\n=== FK trỏ vào dai_ban_do.ma_dang / khtn_ban_do.ma_dang ===')
const fks = await q(`
  select con.relname as tbl, c.conname, pg_get_constraintdef(c.oid) as def
  from pg_constraint c
  join pg_class ref on ref.oid = c.confrelid
  join pg_class con on con.oid = c.conrelid
  where c.contype='f' and ref.relname in ('dai_ban_do','khtn_ban_do','hgt_ban_do','dai_cum_bai','khtn_cum_bai')
  order by ref.relname, con.relname`)
fks.forEach(f=>console.log(` ${f.tbl}: ${f.def}`))

await c.end()
