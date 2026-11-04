// Test mig 202611041623 (đề 2/3 ET bản đồ mới lấy trong cả DẠNG BÀI, không lọc cứng cụm) — 1 transaction rồi ROLLBACK.
//   node scripts/_test_et_ma_de_dang_bai.mjs
// Dựng lại đề gốc của mọi ET bản đồ mới từ 20/10 (mã câu + dạng bài + form), sinh đề 2/3 bằng hàm CŨ rồi hàm MỚI, so số câu trùng đề 1.
import pg from 'pg'; import fs from 'node:fs'
const MIG = 'supabase/migrations/202611041623_et_ma_de_trong_dang_bai.sql'
const url = fs.readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({connectionString:url}); await c.connect()
const q = async (s,a)=>(await c.query(s,a)).rows
let ok = 0, fail = 0
const kiem = (t, d, x = '') => { if (d) { ok++; console.log('  ✔', t) } else { fail++; console.log('  ✘', t, x) } }
try {
  await q('begin'); await q(`set local statement_timeout='120s'`)
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const ets = await q(`select t.id, t.khoi, l.ten_lop, t.ngay, t.cau_hinh from tai_lieu t join lop l on l.id = t.lop_id
                        where t.loai = 'et' and t.ban_do = 'moi' and t.ngay >= date '2026-10-20' order by t.ngay`)
  const bases = []
  for (const e of ets) {
    const mas = Object.keys(e.cau_hinh?.etMaDe ?? {}); if (!mas.length) continue
    const vt = new Map((await q(`select * from fn_tl_bdm_et_vi_tri($1,$2)`, [e.khoi, mas])).map((v) => [v.ma_cau, v.dang_bai_id]))
    const hh = new Map((await q(`select ma_cau, dang_chinh from hinh_hoc_cau_hoi where ma_cau = any($1)`, [mas])).map((v) => [v.ma_cau, v.dang_chinh]))
    const base = mas.map((m) => ({ ma_cau: m, dang_bai: vt.get(m) ?? hh.get(m), form: e.cau_hinh?.etFormByCau?.[m] ?? 'tra_loi_ngan' })).filter((x) => x.dang_bai)
    if (base.length) bases.push({ e, base })
  }
  const chay = async () => {
    const out = []
    for (const { e, base } of bases) out.push((await q(`select fn_tl_bdm_et_ma_de($1,$2::jsonb) j`, [e.khoi, JSON.stringify(base)]))[0].j)
    return out
  }
  const dem = (kq) => { let cau = 0, trung = 0; kq.forEach((j, i) => bases[i].base.forEach((b) => { cau++; const v = j.etMaDe[b.ma_cau] ?? []; if (v.includes(b.ma_cau)) trung++ })); return { cau, trung } }
  const cu = await chay(); const dc = dem(cu)
  await c.query(fs.readFileSync(MIG, 'utf8'))
  const moi = await chay(); const dm = dem(moi)
  console.log(`   ${bases.length} ET · ${dc.cau} câu gốc — trùng đề 1: CŨ ${dc.trung} → MỚI ${dm.trung}`)
  kiem('số câu đề 2/3 trùng đề 1 giảm mạnh', dm.trung < dc.trung / 3, `${dc.trung} → ${dm.trung}`)

  // câu được chọn phải CÙNG dạng bài với câu gốc, cùng form, không trùng câu gốc nào của đề khi còn câu
  let sai = 0, tong = 0; const conTrung = []
  for (const [i, j] of moi.entries()) {
    const { e, base } = bases[i]
    const goc = new Set(base.map((b) => b.ma_cau))
    for (const b of base) {
      const v = j.etMaDe[b.ma_cau] ?? []
      kiem; tong++
      if (v.length !== 2) { sai++; continue }
      for (const m of v) {
        const [d] = await q(`select x.dang_bai_id from fn_tl_bdm_et_vi_tri($1, array[$2]) x
                             union all select h.dang_chinh from hinh_hoc_cau_hoi h where h.ma_cau = $2 limit 1`, [e.khoi, m])
        if (d?.dang_bai_id !== b.dang_bai) sai++
        if (j.etFormByCau[m] !== b.form) sai++
      }
      if (v.some((m) => goc.has(m))) conTrung.push(`${e.ten_lop} ${b.ma_cau}`)
    }
  }
  kiem(`mọi câu đề 2/3 cùng dạng bài + cùng form với câu gốc (${tong} câu gốc)`, sai === 0, `${sai} sai`)
  console.log(`   còn trùng câu gốc (dạng bài hết câu cùng form): ${conTrung.length}`, conTrung.slice(0, 8).join(' · '))

  // câu có cụm thật: vẫn ưu tiên cùng cụm khi cụm còn câu
  const [mau] = await q(`select g.ma_cau, g.cum, g.dang_bai_id from _tl_bdm_cau_vi_tri('7') g
                          where g.cum <> g.ma_cau group by 1,2,3 having (select count(*) from _tl_bdm_cau_vi_tri('7') h where h.cum = g.cum and h.dang_bai_id = g.dang_bai_id) >= 3 limit 1`)
  if (mau) {
    const [{ j }] = await q(`select fn_tl_bdm_et_ma_de('7', $1::jsonb) j`, [JSON.stringify([{ ma_cau: mau.ma_cau, dang_bai: mau.dang_bai_id, form: 'tra_loi_ngan' }])])
    const cum = await q(`select ma_cau, cum from _tl_bdm_cau_vi_tri('7') where ma_cau = any($1)`, [j.etMaDe[mau.ma_cau]])
    kiem(`câu có cụm (${mau.ma_cau}): đề 2/3 lấy trong cùng cụm trước`, cum.length === 2 && cum.every((x) => x.cum === mau.cum), JSON.stringify(cum))
  }
} catch (e) { fail++; console.log('  ✘ LỖI', e.message) }
finally { await q('rollback'); await c.end(); console.log(`\n${ok} ✔ · ${fail} ✘ (ROLLBACK)`); process.exit(fail ? 1 : 0) }
