// Kiểm mig 202610231532 (hàm dùng mastery theo công tắc) TRONG ROLLBACK: node scripts/_test_mastery_bdm_b2.mjs [--mig]
// TẮT ⇒ mọi hàm y hệt trước; BẬT ⇒ ra mã NDB… (dạng lớp đã học, dạng yếu, tự luyện chọn dạng, danh sách dạng theo chủ đề, bản đồ phiêu lưu).
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
  // 1 HS K7 có tài khoản + nhiều lượt đo
  const [hs] = await q(`select h.id, tk.id tk from hoc_sinh h join tai_khoan tk on tk.hoc_sinh_id = h.id
                         where h.khoi = '7' and (select count(*) from gami_grades g where g.hoc_sinh_id = h.id) > 50 limit 1`)
  const doc = async () => {
    await dangNhap(ad.id)
    const r = {
      hoc: (await q(`select _hs_dang_da_hoc($1, 'Toán') x`, [hs.id]))[0].x,
      yeu: (await q(`select coalesce(jsonb_agg(t order by t::text), '[]') x from fn_btyeu_dang_yeu_2_cua_so($1, 'Toán') t`, [hs.id]))[0].x,
    }
    await dangNhap(hs.tk)
    r.evals = (await q(`select hs_dang_evals('Toán') x`))[0].x
    r.cd = (await q(`select tu_luyen_chu_de_ds_dang('Toán') x`))[0].x
    r.pl = (await q(`select fn_ban_do_phieu_luu('Toán') x`))[0].x
    return r
  }
  const truoc = await doc()
  if (process.argv.includes('--mig')) await q(fs.readFileSync('supabase/migrations/202610231532_mastery_bdm_ham_dung_mastery.sql', 'utf8'))
  const tat = await doc()
  for (const k of Object.keys(truoc)) kt(J(truoc[k]) === J(tat[k]), `TẮT ⇒ ${k} y hệt trước`)
  await dangNhap(ad.id); await q(`select fn_he_thong_cong_tac_dat('mastery_ban_do_moi', true)`)
  const bat = await doc()
  const ndb = (arr) => (arr ?? []).filter((x) => /^NDB/.test(typeof x === 'string' ? x : x.ma_dang ?? '')).length
  kt(ndb(bat.hoc) > 0, `BẬT ⇒ dạng lớp đã học có NDB: ${ndb(bat.hoc)}/${bat.hoc?.length}`)
  kt(ndb(bat.evals) > 0 && bat.evals.every((e) => e.ten_dang), `BẬT ⇒ nhật ký đo có NDB + tên: ${ndb(bat.evals)}/${bat.evals.length} (trước ${tat.evals.length})`)
  kt(ndb(bat.cd) > 0, `BẬT ⇒ tự luyện theo chủ đề ra dạng bài mới: ${ndb(bat.cd)}/${bat.cd.length} (trước ${tat.cd.length})`)
  console.log('     dạng yếu BẬT:', J(bat.yeu).slice(0, 160))
  const pl = J(bat.pl); kt(/NDB/.test(pl), `BẬT ⇒ bản đồ phiêu lưu có màn NDB (${(pl.match(/"ma_dang":"NDB/g) ?? []).length} màn; trước ${(J(tat.pl).match(/"ma_dang"/g) ?? []).length})`)
  await dangNhap(hs.tk)
  const chon = (await q(`select _tu_luyen_chon_dang($1, 'Toán', 10) x`, [hs.id]))[0].x
  kt((chon ?? []).length > 0 && chon.every((m) => /^NDB/.test(m)), `BẬT ⇒ tự luyện chọn dạng NDB: ${J(chon).slice(0, 120)}`)
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
