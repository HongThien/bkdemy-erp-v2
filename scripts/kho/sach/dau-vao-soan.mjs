// ============================================================================
// dau-vao-soan.mjs — dựng ĐẦU VÀO cho trạm soạn lời giải: các bài của một/nhiều khu trong sách CHƯA có trong kho.
//
//   node scripts/kho/sach/dau-vao-soan.mjs <bai.json> --sach "Toán arc 4 Q1" --khu "VD 3,LT 3,PTL 1" --ra <input.json>
//
// - "Đã có" đọc từ DB (dai_cau_hoi.ten_de_goc = "<sách> · <mã>", chưa xoá) — DB là sự thật, không đọc file lô trong repo.
// - Bài có HÌNH trong sách ⇒ để riêng (`co_hinh`), không đưa cho trạm soạn (hình EMF chưa đổi được — xem ghi-lo.mjs).
// - Đề TRÙNG câu đã có trong kho (so như insertCauBatch: lower + bỏ khoảng trắng, sau chuẩn hoá định dạng) ⇒ không đưa —
//   hàm ghi cũng sẽ lọc, nhưng lọc sớm để trạm soạn không làm thừa.
// - Bài sách thiếu nhãn (canh_bao của tach-bai) ⇒ để riêng (`can_nguoi`).
// - Bài nhiều ý: đưa cả đề bài + các ý CHƯA làm; ý đã làm liệt kê để trạm soạn bỏ qua. Bài một ý mà đã làm ⇒ không đưa.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { chuanDinhDang } from './lo-tu-md.mjs'

const GOC_REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const baiTep = a[0], SACH = lay('--sach'), KHU = (lay('--khu') ?? '').split(',').map((s) => s.trim()).filter(Boolean), RA = lay('--ra')
if (!baiTep || !SACH || !KHU.length || !RA) { console.error('Dùng: node scripts/kho/sach/dau-vao-soan.mjs <bai.json> --sach "<tên>" --khu "VD 3,LT 3" --ra <input.json>'); process.exit(2) }

const env = Object.fromEntries(readFileSync(join(GOC_REPO, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
const { rows } = await db.query(`select ten_de_goc from dai_cau_hoi where xoa_at is null and ten_de_goc like $1`, [`${SACH} · %`])
// câu kho từ NGUỒN KHÁC (câu của chính sách này đã nằm trong `da`, không tính là trùng)
const { rows: kho } = await db.query(String.raw`select distinct regexp_replace(lower(noi_dung), '\s+', '', 'g') k from dai_cau_hoi
  where xoa_at is null and lua_chon is null and menh_de is null and coalesce(ten_de_goc, '') not like $1`, [`${SACH} · %`])
const trungKho = new Set(kho.map((r) => r.k))
const khoa = (de) => chuanDinhDang(de).toLowerCase().replace(/\s+/g, '')
await db.end()
const da = new Set(rows.map((r) => r.ten_de_goc.slice(SACH.length + 3)))

const bai = JSON.parse(readFileSync(baiTep, 'utf8'))
const khuCua = (b) => b.khu.replace(/ (I|II)$/, '')
const ca = bai.filter((b) => b.y === null && KHU.some((k) => khuCua(b) === k || b.khu === k))
const ra = [], coHinh = [], canNguoi = [], trung = []
for (const x of ca) {
  if (x.canh_bao) { canNguoi.push(`${x.ma}: ${x.canh_bao}`); continue }
  const y = bai.filter((z) => z.y !== null && z.khu === x.khu && z.so === x.so)
  const conLai = y.filter((z) => !da.has(z.ma) && !(trungKho.has(khoa(z.noi_dung)) && trung.push(z.ma)))
  if (!y.length && trungKho.has(khoa(x.noi_dung))) { trung.push(x.ma); continue }
  if (da.has(x.ma) || (y.length && !conLai.length)) continue
  if (x.anh.length) { coHinh.push(`${x.ma} (${x.anh.join(', ')})`); continue }
  ra.push({ ma_bai: x.ma, de_ca_bai: x.noi_dung, sao: x.sao, cac_y: conLai.map((z) => ({ ma: z.ma, de: z.noi_dung })),
    y_da_lam: y.filter((z) => da.has(z.ma)).map((z) => z.ma), loi_giai_sach: x.loi_giai_sach })
}
writeFileSync(RA, JSON.stringify(ra, null, 1))
const soCau = ra.reduce((s, x) => s + (x.cac_y.length || 1), 0)
console.log(`✔ ${KHU.join(', ')}: ${ra.length} bài · ~${soCau} đơn vị câu · đã có trong kho ${[...da].filter((m) => KHU.some((k) => m.startsWith(k.split(' ')[0] + ' ' + k.split(' ')[1] + '.') || m.startsWith(k + '.'))).length}`)
if (coHinh.length) console.log(`  Có hình — để riêng (${coHinh.length}): ${coHinh.join(' · ')}`)
if (trung.length) console.log(`  Trùng câu sẵn có trong kho — không đưa (${trung.length}): ${trung.join(', ')}`)
if (canNguoi.length) console.log(`  Cần người (${canNguoi.length}): ${canNguoi.join(' · ')}`)
console.log('→', RA)
