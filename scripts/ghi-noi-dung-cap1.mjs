// Ghi mô tả · lý thuyết · ví dụ đã soạn (JSON) vào bản đồ mới K3/K4/K5 — CHỈ ĐIỀN Ô TRỐNG, không bao giờ ghi đè chữ có sẵn / ô có file.
// Kiểm định dạng y `kiemDinhDang` của scripts/phien/ban-do.mjs (lỗi ⇒ bỏ phần tử đó, in ra; không kéo cả lô).
//   node scripts/ghi-noi-dung-cap1.mjs <thư-mục-chứa-các-file-json> [--ghi]     (mặc định ROLLBACK)
import pg from 'pg'
import fs from 'fs'
import path from 'path'
process.loadEnvFile('.env')
const DIR = process.argv[2], GHI = process.argv.includes('--ghi')
if (!DIR) { console.error('thiếu thư mục'); process.exit(1) }

const KI_HIEU = ['ĐL', 'DL', 'ĐN', 'DN', 'TC', 'CY', 'PP', 'VD', 'NX', 'BT']
function kiemDinhDang(t, truong) {
  const loi = [], cb = []
  if (((t.replace(/\\\$/g, '').match(/\$/g) ?? []).length) % 2) loi.push('số dấu $ lẻ')
  if (/\$\$/.test(t)) loi.push('có $$')
  if (/\\\(|\\\[/.test(t)) loi.push('có \\( hoặc \\[')
  for (const m of t.matchAll(/^##(\S*)/gm)) if (!KI_HIEU.includes(m[1])) loi.push(`kí hiệu khối lạ ##${m[1]}`)
  if (truong === 'vi_du') {
    if (!/^##VD/m.test(t)) loi.push('ví dụ thiếu ##VD')
    const nVD = (t.match(/^##VD/gm) ?? []).length, nBG = (t.match(/^(Bài giải|Lời giải|Giải)\s*[:.]/gm) ?? []).length
    if (nBG < nVD) loi.push(`${nVD} ví dụ nhưng chỉ ${nBG} "Bài giải:"`)
  }
  if (/^(?:Bước|B)\s*\d+\s*[:.]/m.test(t)) cb.push('ghi "Bước N"')
  if (/(^|[^*])\*[^*\s][^*]*\*(?!\*)/.test(t)) cb.push('có *nghiêng*')
  if (/[⇒⇔∈∀]/.test(t)) loi.push('ký hiệu cấm ⇒ ⇔ ∈ ∀')
  if (/\p{Extended_Pictographic}/u.test(t)) loi.push('có emoji')
  return { loi, cb }
}

const BANG = { chuyen_de: 'dai_bdm_chuyen_de', nhom: 'dai_bdm_nhom', dang_bai: 'dai_bdm_dang_bai' }
const COT = { chuyen_de: ['mo_ta'], nhom: ['mo_ta', 'ly_thuyet'], dang_bai: ['mo_ta', 'ly_thuyet', 'vi_du'] }
const FILE = { nhom: { ly_thuyet: 'ly_thuyet_file_url' }, dang_bai: { ly_thuyet: 'ly_thuyet_file_url', vi_du: 'vi_du_file_url' } }

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const rep = { ghi: 0, da_co_chu: 0, co_file: 0, loi_dinh_dang: 0, khong_thay_nut: 0, khac: 0 }
const loiList = [], cbList = [], theo = {}
try {
  await c.query('begin')
  const seen = new Set()
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json')).sort()) {
    const arr = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))
    for (const p of arr) {
      if (p.loai === 'ghi_chu') { rep.khac++; continue }
      if (!BANG[p.loai] || !COT[p.loai]?.includes(p.truong) || !p.id || typeof p.noi_dung !== 'string' || !p.noi_dung.trim()) { loiList.push(`${f}: phần tử lạ ${JSON.stringify(p).slice(0, 100)}`); rep.loi_dinh_dang++; continue }
      const key = `${p.id}.${p.truong}`
      if (seen.has(key)) { loiList.push(`${f}: trùng ${key}`); rep.loi_dinh_dang++; continue }
      seen.add(key)
      const nd = p.noi_dung.replace(/\r\n/g, '\n').trim()
      const k = kiemDinhDang(nd, p.truong)
      if (k.loi.length) { loiList.push(`${f} ${key}: ${k.loi.join('; ')}`); rep.loi_dinh_dang++; continue }
      if (k.cb.length) cbList.push(`${key}: ${k.cb.join('; ')}`)
      const fcol = FILE[p.loai]?.[p.truong]
      const row = (await c.query(`select ${p.truong} as cu${fcol ? `, ${fcol} as fu` : ''} from ${BANG[p.loai]} where id = $1`, [p.id])).rows[0]
      if (!row) { rep.khong_thay_nut++; loiList.push(`${f} ${key}: không thấy nút`); continue }
      if (fcol && row.fu) { rep.co_file++; continue }
      if (row.cu && row.cu.trim()) { rep.da_co_chu++; continue }
      await c.query(`update ${BANG[p.loai]} set ${p.truong} = $2 where id = $1`, [p.id, nd])
      rep.ghi++; theo[`${p.loai}.${p.truong}`] = (theo[`${p.loai}.${p.truong}`] ?? 0) + 1
    }
  }
  console.log('LỖI/BỎ:\n' + (loiList.join('\n') || '(không)'))
  console.log('CẢNH BÁO:\n' + (cbList.join('\n') || '(không)'))
  console.log('TỔNG', JSON.stringify(rep), JSON.stringify(theo))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
