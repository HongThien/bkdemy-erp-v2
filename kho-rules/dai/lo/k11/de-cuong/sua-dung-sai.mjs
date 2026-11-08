// sua-dung-sai.mjs — sửa MỘT câu ĐÚNG/SAI đã ghi ERP (đề cương K11) theo de.json mới: mệnh đề (nội dung + đáp án) + lời giải + ghi chú lúc nhập.
// `sua-cau-de.mjs` không đụng `menh_de` nên câu Đ/S cần script này. Cùng rào: tìm câu bằng NỘI DUNG CŨ trong đúng đề (sha256), chỉ câu nguon='de_thi' chưa duyệt.
//
//   node kho-rules/dai/lo/k11/de-cuong/sua-dung-sai.mjs <thư mục làm việc> --phan 9 --nhan "Câu 64" [--ghi]
//   (de.json mới trong <thư mục>; de.truoc-sua-*.json = bản trước, dùng để lấy nội dung cũ — hoặc truyền --de-cu "<nội dung thân câu hiện trên ERP>")
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'

const a = process.argv.slice(2)
const lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const dir = a.find((x, i) => !x.startsWith('--') && !['--phan', '--nhan', '--de-cu', '--cu'].includes(a[i - 1]))
const PHAN = Number(lay('--phan')), NHAN = lay('--nhan'), GHI = a.includes('--ghi'), CU = lay('--cu')
if (!dir || !PHAN || !NHAN) { console.error('Dùng: … <thư mục> --phan N --nhan "Câu 64" [--cu <de.json cũ>] [--ghi]'); process.exit(2) }
const de = JSON.parse(readFileSync(join(dir, 'de.json'), 'utf8'))
const q = de.cau.find((x) => x.phan === PHAN && x.nhan === NHAN)
if (!q || q.loai_cau !== 'dung_sai') { console.error('❌ không có câu Đ/S đó trong de.json'); process.exit(2) }
const cu = CU ? JSON.parse(readFileSync(CU, 'utf8')).cau.find((x) => x.phan === PHAN && x.nhan === NHAN) : q
const tbl = `${q.kho}_cau_hoi`
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const { rows: [tl] } = await c.query(`select id, ten from tai_lieu where loai = 'de_thi' and cau_hinh -> 'deThi' ->> 'sha256' = $1`, [de.sha256])
  if (!tl) throw new Error('đề chưa có trên ERP (theo sha256)')
  const { rows: ds } = await c.query(`select ma_cau from fn_de_thi_cau($1) where kho = $2`, [tl.id, q.kho])
  const { rows: tim } = await c.query(`select ma_cau, da_duyet, nguon, menh_de from ${tbl} where ma_cau = any($1) and noi_dung = $2`, [ds.map((r) => r.ma_cau), cu.noi_dung])
  if (tim.length !== 1) throw new Error(`tìm thấy ${tim.length} câu có nội dung thân câu đó (cần đúng 1)`)
  const r = tim[0]
  if (r.da_duyet || r.nguon !== 'de_thi') throw new Error(`${r.ma_cau} đã duyệt hoặc không phải câu nhập từ đề thi — không tự sửa`)
  if (!Array.isArray(r.menh_de) || r.menh_de.length !== q.menh_de.length) throw new Error('số mệnh đề trên ERP khác de.json')
  // giữ ma_dang / loi_giai riêng của từng mệnh đề đang có (dạng chờ), chỉ đổi nội dung + đáp án theo de.json
  const moi = r.menh_de.map((m, i) => ({ ...m, noi_dung: q.menh_de[i].noi_dung, dap_an: q.menh_de[i].dap_an }))
  for (const [i, m] of moi.entries()) if (JSON.stringify(m) !== JSON.stringify(r.menh_de[i])) console.log(`  ý ${'abcd'[i]}: «${r.menh_de[i].noi_dung}» (${r.menh_de[i].dap_an}) ⇒ «${m.noi_dung}» (${m.dap_an})`)
  await c.query(`update ${tbl} set menh_de = $1::jsonb, loi_giai = $2 where ma_cau = $3`, [JSON.stringify(moi), q.loi_giai, r.ma_cau])
  if (q.canh_bao?.length) await c.query(`update tai_lieu set cau_hinh = jsonb_set(cau_hinh, array['deThi','canhBaoCau',$2], $3::jsonb, true), updated_at = now() where id = $1`, [tl.id, r.ma_cau, JSON.stringify(q.canh_bao)])
  else await c.query(`update tai_lieu set cau_hinh = cau_hinh #- array['deThi','canhBaoCau',$2], updated_at = now() where id = $1`, [tl.id, r.ma_cau])
  console.log(`"${tl.ten}" · ${r.ma_cau} (${NHAN}) — mệnh đề sau sửa: ${moi.map((m) => m.dap_an).join('')}`)
  const { rows: [{ ton }] } = await c.query(`select to_regclass('${q.kho}_cau_menh_de') is not null as ton`)
  if (ton) for (const m of (await c.query(`select thu_tu, dung, noi_dung from ${q.kho}_cau_menh_de where ma_cau_cha = $1 order by thu_tu`, [r.ma_cau])).rows) console.log(`   ${m.thu_tu}. dung=${m.dung} · ${m.noi_dung.slice(0, 60)}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
