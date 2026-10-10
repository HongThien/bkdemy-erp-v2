// ============================================================================
// sua-cau-de.mjs — đề ĐÃ ghi ERP mà người duyệt quyết SỬA ĐỀ của một câu (đề gốc in lỗi): cập nhật câu trong kho theo `de.json` mới.
//
//   node scripts/kho/de-thi/sua-cau-de.mjs <thư mục làm việc> --nhan "Bài 2a" --de-cu "<nội dung câu ĐANG nằm trên ERP>" [--phan 2] [--ghi]
//
// Quy trình: sửa `<MA>.soan.md` → `dung-de-tu-soan.mjs` (ra de.json mới) → lệnh này. Mặc định chạy thử (ROLLBACK).
// Tìm câu trên ERP bằng NỘI DUNG CŨ (khoá tự nhiên) trong đúng đề đó (theo sha256), không bằng vị trí. Chỉ đụng câu `nguon='de_thi'`, chưa duyệt.
// Ghi đè: noi_dung · loai_cau · lua_chon · dap_an · loi_giai của câu, và ghi chú lúc nhập (cau_hinh.deThi.canhBaoCau[ma_cau]) của đề; bump updated_at đề.
// ============================================================================
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'

const args = process.argv.slice(2)
const lay = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const dir = args.find((a, i) => !a.startsWith('--') && !['--nhan', '--de-cu', '--phan'].includes(args[i - 1]))
const NHAN = lay('--nhan'), DE_CU = lay('--de-cu'), PHAN = lay('--phan'), GHI = args.includes('--ghi')
if (!dir || !NHAN || !DE_CU) { console.error('Dùng: node scripts/kho/de-thi/sua-cau-de.mjs <thư mục> --nhan "Bài 2a" --de-cu "<nội dung cũ>" [--phan 2] [--ghi]'); process.exit(2) }
const de = JSON.parse(readFileSync(join(dir, 'de.json'), 'utf8'))
const ung = de.cau.filter((q) => q.nhan === NHAN && (!PHAN || q.phan === Number(PHAN)))
if (ung.length !== 1) { console.error(`❌ de.json có ${ung.length} câu nhãn "${NHAN}" — thêm --phan`); process.exit(2) }
const q = ung[0]

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const { rows: [tl] } = await c.query(`select id, ten from tai_lieu where loai = 'de_thi' and cau_hinh -> 'deThi' ->> 'sha256' = $1`, [de.sha256])
  if (!tl) throw new Error('đề này chưa có trên ERP (theo sha256)')
  const { rows: ds } = await c.query(`select ma_cau from fn_de_thi_cau($1) where kho = $2`, [tl.id, q.kho])
  const tbl = `${q.kho}_cau_hoi`
  const { rows: cu } = await c.query(`select ma_cau, da_duyet, nguon, loai_cau, dap_an from ${tbl} where ma_cau = any($1) and noi_dung = $2`, [ds.map((r) => r.ma_cau), DE_CU])
  if (cu.length !== 1) throw new Error(`tìm thấy ${cu.length} câu có nội dung cũ đó trong đề (cần đúng 1)`)
  const r = cu[0]
  if (r.da_duyet || r.nguon !== 'de_thi') throw new Error(`${r.ma_cau} đã duyệt hoặc là câu cũ của kho — không tự sửa, sửa trên màn Kho đề thi`)
  const { rows: trung } = await c.query(`select ma_cau from ${tbl} where noi_dung = $1 and ma_cau <> $2 and xoa_at is null limit 3`, [q.noi_dung, r.ma_cau])
  if (trung.length) console.log(`  ⚠ nội dung MỚI trùng câu đã có trong kho: ${trung.map((x) => x.ma_cau).join(', ')} — vẫn sửa tại chỗ, người duyệt cân nhắc`)
  await c.query(`update ${tbl} set noi_dung = $1, loai_cau = $2, lua_chon = $3::jsonb, dap_an = $4, loi_giai = $5 where ma_cau = $6`,
    [q.noi_dung, q.loai_cau, q.lua_chon ? JSON.stringify(q.lua_chon) : null, q.dap_an ?? null, q.loi_giai, r.ma_cau])
  if (q.canh_bao?.length) await c.query(`update tai_lieu set cau_hinh = jsonb_set(cau_hinh, array['deThi','canhBaoCau',$2], $3::jsonb, true), updated_at = now() where id = $1`, [tl.id, r.ma_cau, JSON.stringify(q.canh_bao)])
  else await c.query(`update tai_lieu set cau_hinh = cau_hinh #- array['deThi','canhBaoCau',$2], updated_at = now() where id = $1`, [tl.id, r.ma_cau])
  const { rows: [sau] } = await c.query(`select stt, loai_cau, dap_an from fn_de_thi_cau($1) where ma_cau = $2`, [tl.id, r.ma_cau])
  console.log(`"${tl.ten}" · ${r.ma_cau} (${NHAN}): ${r.loai_cau}/${r.dap_an ?? '—'} ⇒ ${sau.loai_cau}/${sau.dap_an ?? '—'} · đề mới: ${q.noi_dung.slice(0, 80)}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
