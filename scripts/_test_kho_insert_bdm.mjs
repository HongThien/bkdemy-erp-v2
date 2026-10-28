// Kiểm _kho_insert.mjs ở BẢN ĐỒ MỚI (26/10) — mọi thứ trong 1 transaction rồi ROLLBACK, không ghi gì.
// Chạy từ gốc repo: node scripts/_test_kho_insert_bdm.mjs
import fs from 'fs'
import { createRequire } from 'module'
import { insertCauBatch } from './_kho_insert.mjs'
const pg = createRequire(process.cwd() + '/package.json')('pg')
const env = fs.readFileSync('.env', 'utf8')
const c = new pg.Client({ connectionString: env.match(/^DATABASE_URL=(.*)$/m)[1].trim(), ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
let ok = 0, sai = 0
const kiem = (ten, dk, them = '') => { if (dk) ok++; else sai++; console.log(dk ? '  ✔' : '  ✘', ten, them) }
async function loi(fn) { await q('savepoint s'); try { await fn(); await q('release savepoint s'); return null } catch (e) { await q('rollback to savepoint s'); return e.message } }
const tag = 'thu-bdm-' + Date.now()
await q('begin')
try {
  const [db6] = await q(`select ma_dang from bdm_ban_do where khoi='6' and nhanh_bdm='toan' limit 1`)
  const [cu6] = await q(`select ma_dang from dai_ban_do where khoi='6' and ma_dang not like '%000000' and xoa_at is null limit 1`)
  const [cd12] = await q(`select id from dai_bdm_chu_de where khoi='12' and nhanh='toan' limit 1`)
  const [cu4] = await q(`select ma_dang from dai_ban_do where khoi='4T' and ma_dang not like '%000000' and xoa_at is null limit 1`)
  const [dbh] = await q(`select ma_dang from bdm_ban_do where nhanh_bdm='hgt' limit 1`)
  const cauList = [
    { khoi: '6', loai_cau: 'tu_luan', noi_dung: `${tag} a`, dang_bai: db6.ma_dang, dang_bai_ly_do: 'thử' },          // đề xuất
    { dang_chinh: cu6.ma_dang, loai_cau: 'tu_luan', noi_dung: `${tag} b` },                                         // mã cũ ⇒ dạng chờ
    { khoi: '6', loai_cau: 'tu_luan', noi_dung: `${tag} c`, dang_bai: db6.ma_dang, dang_bai_chot: true },           // người chốt ⇒ gán
  ]
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList })
  const rows = await q(`select c.ma_cau, c.dang_chinh, c.dang_ai_de_xuat, x.nguon dx, g.nguon gan from dai_cau_hoi c
      left join dai_bdm_de_xuat x on x.ma_cau = c.ma_cau left join dai_bdm_gan_cau g on g.ma_cau = c.ma_cau where c.ma_cau = any($1) order by c.ma_cau`, [r.maCauList])
  const by = Object.fromEntries(rows.map((x) => [x.ma_cau, x]))
  const [a, b, cc] = r.maCauList.map((m) => by[m])
  kiem('mọi câu K6 vào dạng chờ T106000000', [a, b, cc].every((x) => x.dang_chinh === 'T106000000'), r.maCauList.join(','))
  kiem('dang_bai ⇒ đề xuất nguon ai, không gán', a.dx === 'ai' && !a.gan)
  kiem('mã dạng cũ ⇒ dạng chờ, giữ mã cũ ở dang_ai_de_xuat', b.dang_ai_de_xuat === cu6.ma_dang && r.bdm.doi_dang_cu.length === 1, b.dang_ai_de_xuat)
  kiem('dang_bai_chot ⇒ gán nguoi', cc.gan === 'nguoi' && !cc.dx)
  kiem('mã câu liên tiếp theo luật dạng chờ', /^T106000000\d{3,}$/.test(a.ma_cau) && Number(cc.ma_cau.slice(10)) === Number(a.ma_cau.slice(10)) + 2)

  const r2 = await insertCauBatch({ client: c, subject: 'dai', cauList: [{ khoi: '12', loai_cau: 'dung_sai', noi_dung: `${tag} ds`, chu_de: cd12.id,
    menh_de: [{ noi_dung: 'x', dap_an: 'D', ma_dang: cu6.ma_dang }, { noi_dung: 'y', dap_an: 'S' }] }] })
  const [ds] = await q(`select (select chu_de_id||':'||nguon from dai_bdm_kho_ds k where k.ma_cau=c.ma_cau) kd,
      (select string_agg(distinct m.dang_chinh, ',') from dai_cau_menh_de m where m.ma_cau_cha=c.ma_cau) md, c.dang_chinh from dai_cau_hoi c where ma_cau=$1`, [r2.maCauList[0]])
  kiem('Đ/S K12 ⇒ kho Đ/S chủ đề (ai), mệnh đề dạng chờ', ds.kd === `${cd12.id}:ai` && ds.md === 'T112000000' && ds.dang_chinh === 'T112000000', JSON.stringify(ds))

  const e1 = await loi(() => insertCauBatch({ client: c, subject: 'dai', cauList: [{ khoi: '12', loai_cau: 'dung_sai', noi_dung: `${tag} ds2`, dang_bai: db6.ma_dang, menh_de: [{ noi_dung: 'x', dap_an: 'D' }, { noi_dung: 'y', dap_an: 'S' }] }] }))
  kiem('Đ/S + dang_bai ⇒ lỗi', !!e1, e1 ?? '')
  const e2 = await loi(() => insertCauBatch({ client: c, subject: 'dai', cauList: [{ khoi: '6', loai_cau: 'tu_luan', noi_dung: `${tag} sai nhanh`, dang_bai: dbh.ma_dang }] }))
  kiem('dạng bài HGT cho kho Đại ⇒ lỗi', !!e2 && /không thuộc nhánh/.test(e2), e2 ?? '')
  // cấp 1 giữ y cũ
  const r4 = await insertCauBatch({ client: c, subject: 'dai', cauList: [{ dang_chinh: cu4.ma_dang, loai_cau: 'tu_luan', noi_dung: `${tag} 4T` }] })
  const [c4] = await q(`select dang_chinh from dai_cau_hoi where ma_cau=$1`, [r4.maCauList[0]])
  kiem('cấp 1 (4T) giữ mã dạng cũ', c4.dang_chinh === cu4.ma_dang && r4.bdm.khoi.length === 0, c4.dang_chinh)
  const e3 = await loi(() => insertCauBatch({ client: c, subject: 'dai', cauList: [{ dang_chinh: cu4.ma_dang, loai_cau: 'tu_luan', noi_dung: `${tag} 4Tx`, dang_bai: db6.ma_dang }] }))
  kiem('cấp 1 + dang_bai ⇒ lỗi', !!e3 && /chưa chạy bản đồ mới/.test(e3), e3 ?? '')
} catch (e) { sai++; console.log('LỖI', e.message) }
await q('rollback'); await c.end()
console.log(`\n${ok} đạt · ${sai} sai (đã ROLLBACK)`)
