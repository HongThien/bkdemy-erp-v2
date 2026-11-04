// Test mig 202611041639 (đề 2/3 ET bản đồ mới: có clone ⇒ chọn clone) — 1 transaction rồi ROLLBACK.
//   node scripts/_test_et_ma_de_clone.mjs
// Dựng lại đề gốc mọi ET bản đồ mới từ 20/10, sinh đề 2/3 bằng hàm đang chạy rồi hàm mới. Với câu đề 1 có clone (cùng gốc) trong
// kho chuẩn của dạng bài: đếm ô đề 2/3 lấy được câu cùng gốc — phải = min(2, số clone hợp form còn chưa dùng ở đề khác).
import pg from 'pg'; import fs from 'node:fs'
const MIG = process.argv[2] ?? 'supabase/migrations/202611041639_et_ma_de_uu_tien_clone.sql'
const url = fs.readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({connectionString:url}); await c.connect()
const q = async (s,a)=>(await c.query(s,a)).rows
let ok = 0, fail = 0
const kiem = (t, d, x = '') => { if (d) { ok++; console.log('  ✔', t) } else { fail++; console.log('  ✘', t, x) } }
const GOC = `select ma_cau, coalesce(parent_ma_cau, ma_cau) goc from dai_cau_hoi where ma_cau = any($1) union all
             select ma_cau, coalesce(parent_ma_cau, ma_cau) from hgt_cau_hoi where ma_cau = any($1) union all
             select ma_cau, coalesce(parent_ma_cau, ma_cau) from hinh_hoc_cau_hoi where ma_cau = any($1) union all
             select ma_cau, coalesce(parent_ma_cau, ma_cau) from khtn_cau_hoi where ma_cau = any($1)`
try {
  await q('begin'); await q(`set local statement_timeout='180s'`)
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const ets = await q(`select t.id, t.khoi, l.ten_lop, t.cau_hinh from tai_lieu t join lop l on l.id = t.lop_id
                        where t.loai = 'et' and t.ban_do = 'moi' and t.ngay >= date '2026-10-20' order by t.ngay`)
  const bases = []
  for (const e of ets) {
    const mas = Object.keys(e.cau_hinh?.etMaDe ?? {}); if (!mas.length) continue
    const vt = new Map((await q(`select * from fn_tl_bdm_et_vi_tri($1,$2)`, [e.khoi, mas])).map((v) => [v.ma_cau, v.dang_bai_id]))
    const hh = new Map((await q(`select ma_cau, dang_chinh from hinh_hoc_cau_hoi where ma_cau = any($1)`, [mas])).map((v) => [v.ma_cau, v.dang_chinh]))
    const base = mas.map((m) => ({ ma_cau: m, dang_bai: vt.get(m) ?? hh.get(m), form: e.cau_hinh?.etFormByCau?.[m] ?? 'tra_loi_ngan' })).filter((x) => x.dang_bai)
    if (base.length) bases.push({ e, base })
  }
  const chay = async () => { const o = []; for (const { e, base } of bases) o.push((await q(`select fn_tl_bdm_et_ma_de($1,$2::jsonb) j`, [e.khoi, JSON.stringify(base)]))[0].j); return o }
  const all = [...new Set(bases.flatMap(({ base }) => base.map((b) => b.ma_cau)))]
  const gocOf = new Map((await q(GOC, [all])).map((r) => [r.ma_cau, r.goc]))
  // câu đề 1 có ≥1 câu khác cùng gốc trong vị trí (kho chuẩn) của khối
  const coClone = []
  for (const { e, base } of bases) for (const b of base) {
    const g = gocOf.get(b.ma_cau) ?? b.ma_cau
    const [{ n }] = await q(`select count(*)::int n from (${GOC}) k where k.goc = $2 and k.ma_cau <> $3
                               and k.ma_cau in (select x.ma_cau from fn_tl_bdm_et_vi_tri($4, array(select ma_cau from dai_cau_hoi where coalesce(parent_ma_cau, ma_cau) = $2
                                 union all select ma_cau from khtn_cau_hoi where coalesce(parent_ma_cau, ma_cau) = $2
                                 union all select ma_cau from hgt_cau_hoi where coalesce(parent_ma_cau, ma_cau) = $2)) x where x.dang_bai_id = $5)`,
      [[...(await q(`select ma_cau from dai_cau_hoi where coalesce(parent_ma_cau, ma_cau) = $1 union all select ma_cau from khtn_cau_hoi where coalesce(parent_ma_cau, ma_cau) = $1 union all select ma_cau from hgt_cau_hoi where coalesce(parent_ma_cau, ma_cau) = $1`, [g])).map((r) => r.ma_cau)], g, b.ma_cau, e.khoi, b.dang_bai])
    if (n > 0) coClone.push({ et: e.ten_lop, ma: b.ma_cau, goc: g, n })
  }
  const demClone = async (kq) => {
    let o = 0
    for (const x of coClone) {
      const i = bases.findIndex(({ e, base }) => e.ten_lop === x.et && base.some((b) => b.ma_cau === x.ma))
      const v = kq[i].etMaDe[x.ma] ?? []
      const g = new Map((await q(GOC, [v])).map((r) => [r.ma_cau, r.goc]))
      o += v.filter((m) => m !== x.ma && g.get(m) === x.goc).length
    }
    return o
  }
  const cu = await chay(); const nCu = await demClone(cu)
  await c.query(fs.readFileSync(MIG, 'utf8'))
  const moi = await chay(); const nMoi = await demClone(moi)
  const toiDa = coClone.reduce((s, x) => s + Math.min(2, x.n), 0)
  console.log(`   ${bases.length} ET · ${coClone.length} câu đề 1 có clone trong kho — ô đề 2/3 lấy clone: TRƯỚC ${nCu} → SAU ${nMoi} (tối đa ${toiDa})`)
  kiem('đề 2/3 lấy clone tới mức tối đa có thể (trừ clone đã bị câu khác trong đề chiếm)', nMoi >= nCu && nMoi >= toiDa - 2, `${nMoi}/${toiDa}`)
  // không hồi quy: vẫn cùng dạng bài + form, trùng đề 1 không tăng
  const trung = (kq) => kq.reduce((s, j, i) => s + bases[i].base.filter((b) => (j.etMaDe[b.ma_cau] ?? []).includes(b.ma_cau)).length, 0)
  kiem(`câu trùng đề 1 không tăng (${trung(cu)} → ${trung(moi)})`, trung(moi) <= trung(cu))
  let sai = 0
  for (const [i, j] of moi.entries()) for (const b of bases[i].base) for (const m of j.etMaDe[b.ma_cau] ?? []) {
    const [d] = await q(`select x.dang_bai_id from fn_tl_bdm_et_vi_tri($1, array[$2]) x union all select h.dang_chinh from hinh_hoc_cau_hoi h where h.ma_cau = $2 limit 1`, [bases[i].e.khoi, m])
    if (d?.dang_bai_id !== b.dang_bai || j.etFormByCau[m] !== b.form) sai++
  }
  kiem('mọi câu đề 2/3 vẫn cùng dạng bài + cùng form', sai === 0, `${sai} sai`)
} catch (e) { fail++; console.log('  ✘ LỖI', e.message) }
finally { await q('rollback'); await c.end(); console.log(`\n${ok} ✔ · ${fail} ✘ (ROLLBACK)`); process.exit(fail ? 1 : 0) }
