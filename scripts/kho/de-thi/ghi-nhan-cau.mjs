// ============================================================================
// ghi-nhan-cau.mjs — BÙ nhãn gốc của câu (cau_hinh.deThi.nhanCau[ma_cau] = "Bài 2a") cho đề ĐÃ ghi trước khi ghi.mjs biết ghi nhãn.
//
//   node scripts/kho/de-thi/ghi-nhan-cau.mjs <thư mục làm việc (có de.json)> <tai_lieu id> [--ghi]
//
// Khớp nhãn ↔ câu bằng NỘI DUNG (khoá tự nhiên), không bằng vị trí: câu thứ i của fn_de_thi_cau phải có noi_dung TRÙNG de.json.cau[i].noi_dung,
// lệch dù một câu ⇒ bỏ cả lượt (CLAUDE.md §2 "số lượng khớp không phải bằng chứng"). Mặc định chạy thử (ROLLBACK).
// ============================================================================
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'
import { bien } from '../cau-hinh.mjs'
import { tinhNhomBai } from './nhom-bai.mjs'

const a = process.argv.slice(2)
const dir = a.find((x) => !x.startsWith('--')), id = a.filter((x) => !x.startsWith('--'))[1], GHI = a.includes('--ghi')
if (!dir || !id) { console.error('Dùng: node scripts/kho/de-thi/ghi-nhan-cau.mjs <thư mục> <tai_lieu id> [--ghi]'); process.exit(2) }
const de = JSON.parse(readFileSync(join(dir, 'de.json'), 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const { rows: ds } = await c.query(`select stt, ma_cau, kho from fn_de_thi_cau($1) order by stt`, [id])
  if (ds.length !== de.cau.length) throw new Error(`đề trên ERP có ${ds.length} câu, de.json có ${de.cau.length} câu`)
  const nd = new Map()
  for (const kho of ['dai', 'hgt', 'hinh_hoc']) {
    const ma = ds.filter((r) => r.kho === kho).map((r) => r.ma_cau)
    if (!ma.length) continue
    const { rows } = await c.query(`select ma_cau, noi_dung from ${kho}_cau_hoi where ma_cau = any($1)`, [ma])
    rows.forEach((r) => nd.set(r.ma_cau, r.noi_dung))
  }
  const chuan = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()
  const map = {}, lech = []
  ds.forEach((r, i) => {
    const q = de.cau[i]
    if (chuan(nd.get(r.ma_cau)) === chuan(q.noi_dung)) map[r.ma_cau] = q.nhan
    else lech.push(`stt ${r.stt} ${r.ma_cau} ↔ ${q.nhan}`)
  })
  if (lech.length) throw new Error(`${lech.length} câu KHÔNG khớp nội dung ⇒ bỏ cả lượt:\n  ` + lech.slice(0, 8).join('\n  '))
  const { nhomBai, canhBao } = tinhNhomBai(ds.map((r, i) => ({ nhan: de.cau[i].nhan, noi_dung: nd.get(r.ma_cau), ma_cau: r.ma_cau })))
  canhBao.forEach((w) => console.log('  ⚠', w))
  console.log(`${nhomBai.length} nhóm bài:`); nhomBai.forEach((g) => console.log(`  ${g.nhan} (${g.cau.map((x) => x.y).join('')}) · lời dẫn: ${g.dan.slice(0, 90)}`))
  await c.query(`update tai_lieu set cau_hinh = jsonb_set(jsonb_set(cau_hinh, '{deThi,nhanCau}', $2::jsonb, true), '{deThi,nhomBai}', $3::jsonb, true) where id = $1 and loai = 'de_thi'`, [id, JSON.stringify(map), JSON.stringify(nhomBai)])
  console.log(`${Object.keys(map).length} câu có nhãn · ví dụ: ${Object.entries(map).slice(0, 3).map(([k, v]) => `${k}=${v}`).join(' · ')}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
