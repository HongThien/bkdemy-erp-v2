// Read-only: các dạng đang mở trong case bổ trợ yếu — số câu online hiện tại vs số câu MCQ (trac_nghiem gốc | form_tn đã duyệt), kho_chuan.
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const mons = await q(`select y.mon, count(distinct d.ma_dang)::int so_dang, count(distinct y.id)::int so_case from bo_tro_yeu y join bo_tro_yeu_dang d on d.bo_tro_yeu_id=y.id where y.trang_thai='dang_xu' and d.dong_at is null group by 1`)
console.log('case đang mở:', JSON.stringify(mons))
for (const m of mons) {
  const [{ t }] = await q(`select public._kho_cau_tbl($1) t`, [m.mon])
  const [{ f }] = await q(`select public._kho_form_tn_cua($1) f`, [t])
  const dkCu = (await q(`select public._kho_dk_online_sql($1) s`, [t]))[0].s
  const dkMcq = `(c.kho_chuan and ((c.loai_cau = 'trac_nghiem' and c.dap_an is not null)` + (f ? ` or exists (select 1 from ${f} x where x.ma_cau = c.ma_cau and x.da_duyet and x.xoa_at is null)` : '') + `))`
  const rows = await q(`
    with dg as (select distinct d.ma_dang from bo_tro_yeu y join bo_tro_yeu_dang d on d.bo_tro_yeu_id=y.id where y.mon=$1 and y.trang_thai='dang_xu' and d.dong_at is null)
    select dg.ma_dang,
      (select count(*)::int from ${t} c where c.dang_chinh=dg.ma_dang and c.xoa_at is null and ${dkCu}) cu,
      (select count(*)::int from ${t} c where c.dang_chinh=dg.ma_dang and c.xoa_at is null and ${dkMcq}) mcq
    from dg`, [m.mon])
  const b = (lo, hi) => rows.filter((r) => r.mcq >= lo && r.mcq <= hi).length
  console.log(`\n${m.mon} (${t}, form_tn=${f}): ${rows.length} dạng · tổng câu online cũ ${rows.reduce((a, r) => a + r.cu, 0)} → MCQ ${rows.reduce((a, r) => a + r.mcq, 0)}`)
  console.log(`  dạng theo số câu MCQ: 0 câu=${b(0, 0)} · 1–2=${b(1, 2)} · 3–5=${b(3, 5)} · 6–11=${b(6, 11)} · ≥12=${b(12, 1e9)}`)
  console.log('  dạng 0 MCQ (mà cũ có câu):', rows.filter((r) => r.mcq === 0 && r.cu > 0).slice(0, 15).map((r) => `${r.ma_dang}(${r.cu})`).join(' '))
}
await c.end()
