// Kiểm mig 202610231553 (mastery mới SONG SONG, bổ trợ giữ cũ) TRONG ROLLBACK: node scripts/_test_mastery_bdm_tach.mjs [--mig]
// BẬT công tắc: fn_mastery_cells vẫn CŨ · fn_mastery_cells_moi ra NDB · bổ trợ (điền dạng yếu) chỉ mã cũ · tự luyện + phiêu lưu ra NDB.
// TẮT: các hàm đã đổi cho kết quả y hệt trước.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
const J = (x) => JSON.stringify(x)
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  const dangNhap = (sub) => q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub, role: 'authenticated' })])
  const [hs] = await q(`select h.id, tk.id tk from hoc_sinh h join tai_khoan tk on tk.hoc_sinh_id = h.id
                         where h.khoi = '7' and (select count(*) from gami_grades g where g.hoc_sinh_id = h.id) > 50 limit 1`)
  const doc = async () => {
    await dangNhap(ad.id)
    const r = { cells: (await q(`select coalesce(jsonb_agg(m order by m.ma_dang), '[]') x from fn_mastery_cells(array[$1::uuid], true) m`, [hs.id]))[0].x }
    await dangNhap(hs.tk)
    r.hoc = (await q(`select hs_dang_hoc_tap('Toán') x`))[0].x
    r.pl = (await q(`select fn_ban_do_phieu_luu('Toán') x`))[0].x
    r.cd = (await q(`select tu_luyen_chu_de_ds_dang('Toán') x`))[0].x
    return r
  }
  const truoc = await doc()
  if (process.argv.includes('--mig')) await q(fs.readFileSync('supabase/migrations/202610231553_mastery_bdm_tach_bo_tro_giu_cu.sql', 'utf8'))
  const tat = await doc()
  for (const k of Object.keys(truoc)) kt(J(truoc[k]) === J(tat[k]), `TẮT ⇒ ${k} y hệt trước`)
  await dangNhap(ad.id); await q(`select fn_he_thong_cong_tac_dat('mastery_ban_do_moi', true)`)
  const cuBat = (await q(`select count(*) filter (where ma_dang like 'NDB%')::int ndb, count(*)::int n from fn_mastery_cells(array[$1::uuid], true)`, [hs.id]))[0]
  kt(cuBat.ndb === 0 && cuBat.n === tat.cells.length, `BẬT ⇒ fn_mastery_cells VẪN CŨ (${cuBat.n} ô, 0 NDB)`)
  const moiBat = (await q(`select count(*) filter (where ma_dang like 'NDB%')::int ndb, count(*)::int n from fn_mastery_cells_moi(array[$1::uuid], true)`, [hs.id]))[0]
  kt(moiBat.ndb > 0, `BẬT ⇒ fn_mastery_cells_moi ra NDB (${moiBat.ndb}/${moiBat.n})`)
  // bổ trợ: điền dạng yếu cho 1 ca đang xử K6–12 ⇒ chỉ mã cũ
  const cases = await q(`select y.id from bo_tro_yeu y join hoc_sinh h on h.id = y.hoc_sinh_id where y.trang_thai = 'dang_xu' and y.mon = 'Toán' and h.khoi in ('6','7','8','9','10','11','12') limit 8`)
  let ndbBt = 0, them = 0
  for (const x of cases) {
    const t0 = (await q(`select count(*)::int n from bo_tro_yeu_dang where bo_tro_yeu_id = $1`, [x.id]))[0].n
    await q(`select fn_btyeu_fill_dang_yeu($1)`, [x.id])
    const r = (await q(`select count(*)::int n, count(*) filter (where ma_dang like 'NDB%')::int ndb from bo_tro_yeu_dang where bo_tro_yeu_id = $1`, [x.id]))[0]
    them += r.n - t0; ndbBt += r.ndb
  }
  kt(ndbBt === 0, `BẬT ⇒ bổ trợ điền dạng yếu chỉ mã CŨ (${cases.length} ca, thêm ${them} dạng, 0 NDB)`)
  await dangNhap(hs.tk)
  const chon = (await q(`select _tu_luyen_chon_dang($1, 'Toán', 10) x`, [hs.id]))[0].x
  kt((chon ?? []).length > 0 && chon.every((m) => /^NDB/.test(m)), `BẬT ⇒ tự luyện chọn dạng NDB (${J(chon).slice(0, 80)})`)
  const pl = J((await q(`select fn_ban_do_phieu_luu('Toán') x`))[0].x)
  kt(/"trang_thai":"(dat|yeu)"/.test(pl) && /NDB/.test(pl), 'BẬT ⇒ bản đồ phiêu lưu có màn NDB, có trạng thái đo (mastery mới)')
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
