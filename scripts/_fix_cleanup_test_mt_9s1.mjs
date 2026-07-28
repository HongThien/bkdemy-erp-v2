// Dọn dữ liệu test: lúc kiểm thử tính năng "gán MT đè + cảnh báo" đã gán thật MT "Mã 2" cho lớp 9S1
// (lớp này trước đó CHƯA từng gán MT này) — xoá lại đúng 1 dòng tai_lieu(mt_buoi) đã tạo, KHÔNG đụng
// buoi_hoc (buổi 17/06 và 19/06 của 9S1 là buổi THẬT có sẵn từ trước, timestamps không bị test đổi
// do guard is(...,null) trong ganMTVaoBuoi).
import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env', 'utf8').split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
const r = await c.query(`delete from tai_lieu where id = '4aa8fe19-68c2-4214-9e6f-26907ce3d384' and loai='mt_buoi' and lop_id='802c7ebb-3805-4fd7-8fca-59e998d28900' returning id, ten, ngay`)
console.log('deleted:', r.rowCount, r.rows)
await c.end()
