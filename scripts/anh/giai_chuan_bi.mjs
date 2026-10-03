// ============================================================================
// giai_chuan_bi.mjs — CHIA LÔ cho lượt "AI giải mù + viết lời giải" kho Tiếng Anh (Thùy 03/10: "m hoàn toàn làm đáp án và giải chi tiết được").
// CHỈ ĐỌC DB. Ra <thư mục>:
//   lo-NNN.json  = đề + phương án + ngữ liệu (KHÔNG đáp án) — bên giải chỉ được mở file này
//   <thư mục>_khoa/khoa.json = { ma: { dap_an, da_duyet, duyet_nguon, kiem_may_ghi } } — CHỈ cổng đọc (thư mục riêng)
//   anh/<tệp>    = ảnh biển báo/ngữ liệu tải từ Storage của mình (bên giải xem bằng Read)
// Lấy: câu chưa xoá, CHƯA có lời giải. Câu cùng ngữ liệu luôn chung 1 lô (bài đọc phải đọc trọn).
// Chạy: node scripts/anh/giai_chuan_bi.mjs <thư mục ra> [cỡ lô=60]
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
process.loadEnvFile('.env')
const ra = process.argv[2]; const CO = Number(process.argv[3] ?? 60)
fs.mkdirSync(path.join(ra, 'anh'), { recursive: true })
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const cau = (await c.query(`select ma_cau, dang_de, noi_dung, lua_chon, dap_an, da_duyet, duyet_nguon, kiem_may_ghi, ngu_lieu, thu_tu_trong_ngu_lieu
  from anh_cau_hoi where xoa_at is null and coalesce(loi_giai, '') = '' order by coalesce(ngu_lieu, ma_cau), thu_tu_trong_ngu_lieu nulls first, ma_cau`)).rows
const nl = new Map((await c.query(`select ma_ngu_lieu, loai, tieu_de, noi_dung, anh from anh_ngu_lieu where ma_ngu_lieu = any($1)`,
  [[...new Set(cau.map((r) => r.ngu_lieu).filter(Boolean))]])).rows.map((r) => [r.ma_ngu_lieu, r]))
await c.end()

// Ảnh ngữ liệu ⇒ tải về (Storage của chính kho, URL lưu trong DB)
let taiAnh = 0
for (const n of nl.values()) {
  if (!n.anh) continue
  const tep = path.join(ra, 'anh', n.ma_ngu_lieu + path.extname(new URL(n.anh).pathname || '.png'))
  if (!fs.existsSync(tep)) { const r = await fetch(n.anh); if (!r.ok) throw new Error(`tải ảnh ${n.ma_ngu_lieu}: ${r.status}`); fs.writeFileSync(tep, Buffer.from(await r.arrayBuffer())); taiAnh++ }
  n.anh_tep = tep.replaceAll('\\', '/')
}

// Gom theo ngữ liệu (câu lẻ = nhóm 1 câu), rồi xếp nhóm vào lô ~CO câu
const nhom = []; let cur = null
for (const r of cau) { const k = r.ngu_lieu ?? r.ma_cau; if (!cur || cur.k !== k) nhom.push(cur = { k, ds: [] }); cur.ds.push(r) }
const lo = [[]]
for (const g of nhom) { if (lo.at(-1).length && lo.at(-1).length + g.ds.length > CO) lo.push([]); lo.at(-1).push(...g.ds) }
const khoa = {}
lo.forEach((ds, i) => {
  fs.writeFileSync(path.join(ra, `lo-${String(i + 1).padStart(3, '0')}.json`), JSON.stringify(ds.map((r) => {
    const n = r.ngu_lieu ? nl.get(r.ngu_lieu) : null
    return { ma: r.ma_cau, dang_de: r.dang_de, de: r.noi_dung, phuong_an: r.lua_chon,
      ngu_lieu: n ? { ma: n.ma_ngu_lieu, loai: n.loai, tieu_de: n.tieu_de, noi_dung: n.noi_dung, anh_tep: n.anh_tep ?? null, cau_so: r.thu_tu_trong_ngu_lieu } : null }
  }), null, 1))
  for (const r of ds) khoa[r.ma_cau] = { dap_an: r.dap_an || null, da_duyet: r.da_duyet, duyet_nguon: r.duyet_nguon, kiem_may_ghi: r.kiem_may_ghi, lo: i + 1 }
})
fs.mkdirSync(`${ra}_khoa`, { recursive: true })
fs.writeFileSync(`${ra}_khoa/khoa.json`, JSON.stringify(khoa))   // thư mục ANH EM: bên giải được trỏ vào <ra>, không thấy đáp án
console.log(`${cau.length} câu · ${lo.length} lô · ${nl.size} ngữ liệu · tải ${taiAnh} ảnh · thiếu đáp án ${cau.filter((r) => !r.dap_an).length}`)
