// xoa-buoi-3010.mjs — Thùy gật "xóa đi" (06/11): xoá 2 buổi 30/10 (gán nhầm ngày) + dòng đi kèm. 1 transaction, KIỂM SỐ DÒNG trước khi commit.
//   node kho-rules/dai/lo/mt/k12-t10/xoa-buoi-3010.mjs [--ghi]     (mặc định ROLLBACK)
import fs from 'node:fs'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const BUOI = ['5efed23a-b0fa-4661-90c4-4a392839d489', '4fb80582-4479-400c-b375-445e12d42f4e']
const KY = '9962829b-ff08-4cda-8730-840767a853e2'
const KY_VONG = { buoi_hoc: 2, buoi_hoc_hs: 15, gami_session_problems: 18, buoi_hoc_phase_log: 8, ky_thi: 1, viec_phu_trach_snap: 6 }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
await c.query('begin')
try {
  const dem = async (sql, p) => +(await c.query(sql, p)).rows[0].n
  // chốt chặn TRƯỚC khi xoá: đúng 2 buổi 30/10 của 12A1/12B1, chưa có điểm/chấm, không bản tài liệu nào còn bám
  const b = (await c.query(`select bh.id, l.ten_lop, bh.ngay::text from buoi_hoc bh join lop l on l.id = bh.lop_id where bh.id = any($1)`, [BUOI])).rows
  if (b.length !== 2 || b.some((x) => x.ngay !== '2026-10-30' || !['12A1', '12B1'].includes(x.ten_lop))) throw new Error('2 buổi không đúng 30/10 12A1/12B1: ' + JSON.stringify(b))
  const truoc = {
    buoi_hoc: b.length,
    buoi_hoc_hs: await dem(`select count(*) n from buoi_hoc_hs where buoi_hoc_id = any($1)`, [BUOI]),
    gami_session_problems: await dem(`select count(*) n from gami_session_problems where buoi_hoc_id = any($1)`, [BUOI]),
    buoi_hoc_phase_log: await dem(`select count(*) n from buoi_hoc_phase_log where buoi_hoc_id = any($1)`, [BUOI]),
    ky_thi: await dem(`select count(*) n from ky_thi where id = $1 and buoi_hoc_id = any($2)`, [KY, BUOI]),
    viec_phu_trach_snap: await dem(`select count(*) n from viec_phu_trach_snap where buoi_id = any($1)`, [BUOI]),
  }
  console.log('trước:', JSON.stringify(truoc))
  if (JSON.stringify(truoc) !== JSON.stringify(KY_VONG)) throw new Error('số dòng khác kỳ vọng ' + JSON.stringify(KY_VONG) + ' — dừng, không xoá')
  const grades = await dem(`select count(*) n from gami_grades g join gami_session_problems p on p.id = g.problem_id where p.buoi_hoc_id = any($1)`, [BUOI])
  const diem = await dem(`select count(*) n from diem_thi where ky_thi_id = $1`, [KY])
  const taiLieu = await dem(`select count(*) n from tai_lieu t join lop l on l.id = t.lop_id where t.ngay = '2026-10-30' and l.ten_lop in ('12A1','12B1')`, [])
  console.log(`điểm chấm: ${grades} · diem_thi: ${diem} · tài liệu còn bám ngày 30/10: ${taiLieu}`)
  if (grades || diem || taiLieu) throw new Error('có điểm hoặc tài liệu còn bám 30/10 — dừng, không xoá')
  // xoá: kỳ thi mồ côi (0 điểm) → buổi (cascade: sĩ số · câu hỏi MT · nhật ký phase)
  const sn = await c.query(`delete from viec_phu_trach_snap where buoi_id = any($1)`, [BUOI])
  const k = await c.query(`delete from ky_thi where id = $1 and buoi_hoc_id = any($2)`, [KY, BUOI])
  const d = await c.query(`delete from buoi_hoc where id = any($1)`, [BUOI])
  console.log(`đã xoá: viec_phu_trach_snap ${sn.rowCount} · ky_thi ${k.rowCount} · buoi_hoc ${d.rowCount}`)
  if (sn.rowCount !== 6 || k.rowCount !== 1 || d.rowCount !== 2) throw new Error('lệch số dòng xoá — ROLLBACK')
  const sau = {
    buoi_hoc_hs: await dem(`select count(*) n from buoi_hoc_hs where buoi_hoc_id = any($1)`, [BUOI]),
    gami_session_problems: await dem(`select count(*) n from gami_session_problems where buoi_hoc_id = any($1)`, [BUOI]),
    buoi_hoc_phase_log: await dem(`select count(*) n from buoi_hoc_phase_log where buoi_hoc_id = any($1)`, [BUOI]),
  }
  console.log('sau (phải = 0):', JSON.stringify(sau))
  if (Object.values(sau).some((v) => v)) throw new Error('còn dòng mồ côi — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
