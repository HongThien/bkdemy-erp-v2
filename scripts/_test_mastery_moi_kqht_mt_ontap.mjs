// Kiểm mig 202610241130 TRONG ROLLBACK: node scripts/_test_mastery_moi_kqht_mt_ontap.mjs
// Lõi tách nguồn đo y hệt (cũ/mới, 4 lớp) + tốc độ · lần đo khớp n của ô · bảng MT tắt y hệt, bật theo bản đồ mới · ôn tập tắt = cách client cũ.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const J = (x) => JSON.stringify(x)
const LOP = ['6A1', '7A1', '9A1', '11A1']
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  const lops = await q(`select l.id, l.ten_lop, (select array_agg(hoc_sinh_id) from hoc_sinh_lop where lop_id = l.id and trang_thai = 'dang_hoc') hs
                          from lop l where l.ten_lop = any($1) and l.mon = 'Toán'`, [LOP])
  const cells = async (hs, bdm) => { const t = Date.now(); const r = await q(`select * from _mastery_cells_core($1, $2, true) order by 1, 2`, [bdm, hs]); return { r, ms: Date.now() - t } }
  const truoc = {}
  for (const l of lops) truoc[l.ten_lop] = { cu: await cells(l.hs, false), moi: await cells(l.hs, true) }
  // bảng MT: 4 đề MT gần nhất có chấm
  const des = (await q(`select distinct t.nguon_id from tai_lieu t where t.loai = 'mt_buoi' and t.nguon_id is not null and t.ngay > current_date - 60 limit 4`)).map((r) => r.nguon_id)
  const mt = async () => { const o = []; for (const d of des) for (const cap of ['chuyen_de', 'chu_de']) o.push((await q(`select fn_mt_bang_ket_qua($1, $2) x`, [d, cap]))[0].x); return o }
  const mtTruoc = await mt()

  await q(fs.readFileSync('supabase/migrations/202610241130_mastery_moi_kqht_mt_ontap.sql', 'utf8'))

  for (const l of lops) {
    const cu = await cells(l.hs, false), moi = await cells(l.hs, true), tr = truoc[l.ten_lop]
    kt(J(cu.r) === J(tr.cu.r) && J(moi.r) === J(tr.moi.r),
      `${l.ten_lop}: lõi y hệt (cũ ${cu.r.length} ô · mới ${moi.r.length} ô) — mới ${tr.moi.ms}→${moi.ms} ms`)
  }
  kt(J(await mt()) === J(mtTruoc), `TẮT ⇒ bảng MT y hệt (${des.length} đề × 2 cấp)`)
  // ôn tập TẮT = cách client cũ (fn_mastery_cells, gom theo dạng)
  const l7 = lops.find((l) => l.ten_lop === '7A1')
  // ứng viên THẬT = dạng trong giáo trình của lớp (tai_lieu_phan.ref_ma) — 9A1
  const l9 = lops.find((l) => l.ten_lop === '9A1')
  const ung = (await q(`select array_agg(distinct p.ref_ma) a from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id = t.id where t.lop_id = $1 and p.loai_phan = 'dang' and p.ref_ma is not null`, [l9.id]))[0].a
  const cuOT = await q(`select ma_dang, count(*) filter (where muc='dat')::int dat, count(*) filter (where muc='can_luyen')::int can, count(*) filter (where muc='yeu')::int yeu, count(*)::int total
                          from fn_mastery_cells($1) where ma_dang = any($2) group by 1 order by 1`, [l9.hs, ung])
  const moiOT = await q(`select ma_dang, dat, can_luyen can, yeu, total from fn_ontap_diem_dang($1, 'Toán', $2) order by 1`, [l9.id, ung])
  kt(J(cuOT) === J(moiOT), `TẮT ⇒ ôn tập chấm y hệt client cũ (9A1, ${moiOT.length}/${ung.length} dạng có điểm)`)

  await q(`select fn_he_thong_cong_tac_dat('mastery_ban_do_moi', true)`)
  const hs1 = l7.hs[0]
  const ld = await q(`select ma_dang, count(*)::int n from fn_mastery_lan_do_moi($1, true) group by 1 order by 1`, [hs1])
  const ce = await q(`select ma_dang, n::int from fn_mastery_cells_moi($1, true) order by 1`, [[hs1]])
  kt(J(ld) === J(ce) && ld.some((r) => r.ma_dang.startsWith('NDB')), `BẬT ⇒ lần đo của 1 HS khớp n từng ô (${ld.length} dạng, có NDB)`)
  const mtMoi = await mt()
  const cot = mtMoi.flatMap((x) => x.cot.map((k) => k.ten))
  kt(mtMoi.some((x, i) => J(x.cot) !== J(mtTruoc[i].cot)) && mtMoi.every((x, i) => x.hs.length === mtTruoc[i].hs.length),
    `BẬT ⇒ bảng MT đổi cột theo bản đồ mới, đủ HS (vd: ${[...new Set(cot)].slice(0, 4).join(' · ')})`)
  const otMoi = await q(`select * from fn_ontap_diem_dang($1, 'Toán', $2)`, [l9.id, ung])
  kt(otMoi.length > 0 && otMoi.every((r) => r.ten_dang), `BẬT ⇒ ôn tập: ${otMoi.length}/${ung.length} dạng giáo trình 9A1 có điểm theo bản đồ mới, có tên`)
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
