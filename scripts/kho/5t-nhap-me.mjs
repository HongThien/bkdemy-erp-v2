// 5t-nhap-me.mjs — nhập sách ME "250+ Bài toán chọn lọc lớp 5" vào kho 5T (Thùy 21/11: chỉ GHÉP câu + đáp án + lời giải sách, không giải lại;
// bài gọi ẩn ở các dạng cho phép gọi ẩn thì nhập bình thường; ME không cần kiểm máy đáp số).
//   node scripts/kho/5t-nhap-me.mjs [--tap sach|ho|tat-ca] [--cd 1,2,…] [--ghi]     (mặc định chạy thử rồi ROLLBACK)
//   --tap sach (mặc định) = 262 mục sạch (không chưa chắc, không hình) · --tap ho = 66 mục chưa chắc / có hình (đã xem ảnh trang PDF 21/11) · tat-ca
// Mỗi câu: khối 5T · ten_de_goc "Toán 5 ME · <mã>" · đề xuất dạng theo ME-gan-dang-chi-tiet.json (dang_bai_chac 'vua' ⇒ đề xuất chờ duyệt, KHÔNG tự gán)
// · lời giải = lời giải SÁCH đã bỏ ký hiệu đầu dòng (➤ ▸ ▶ » → -) và dòng "[Sơ đồ …]" (do người bóc mô tả, không phải nguyên văn), chỉ MỘT cách (Cách 1) + dòng Đáp số
// · kiem_may='nghi' ⇒ KHÔNG tự duyệt, vào hàng người kiểm / trưởng khối.
// Hình đề (mục có hình): cắt từ trang PDF sách → kho-rules/dai/lo/me5-250/hinh/ME5-<mã>.png (upload bucket kho-anh khi --ghi, nhãn nguồn 'goc').
import pg from 'pg'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { insertCauBatch } from '../_kho_insert.mjs'
import { docEnv, GOC_REPO } from './cau-hinh.mjs'
process.loadEnvFile('.env')
const a = process.argv.slice(2)
const GHI = a.includes('--ghi')
const TAP = a.includes('--tap') ? a[a.indexOf('--tap') + 1] : 'sach'
const cdArg = a.includes('--cd') ? new Set(a[a.indexOf('--cd') + 1].split(',').map(Number)) : null
const gan = JSON.parse(readFileSync('kho-rules/dai/lo/me5-250/ME-gan-dang-chi-tiet.json', 'utf8')).me

// Sửa chữ theo ảnh trang / lỗi in của sách (đã đối chiếu 21/11). Khoá = mã sách.
const SUA = {
  'BT 2.18': { thay_de: [['từ chữ số thứ 11', 'từ chữ số thứ 12']], dap_an: 'a) Có thể (ví dụ khi viết đến số 21111: ...2111021111); b) chữ số thứ $556$', thay_loi: [['$1 \\times 9 + 2 \\times 90 + 3 \\times 122 = 555$ (chữ số).', '$1 \\times 9 + 2 \\times 90 + 3 \\times 122 = 555$ (chữ số).'], ['bắt đầu từ chữ số thứ 555', 'bắt đầu từ chữ số thứ 556 (chữ số thứ 555 là chữ số cuối của số 221)']], ghi: 'sách in "chữ số thứ 11" (đúng là thứ 12: …9 10 11 12 → các chữ số 1 liền nhau bắt đầu ở vị trí 12) và đáp số b) 555 (tính lại 556: số 221 kết thúc ở chữ số 555, chuỗi 22222 bắt đầu ở 556)' },
  'BT 2.22': { thay_de: [['thành 4 cột', 'thành 5 cột']], ghi: 'sách in "4 cột" nhưng bảng có 5 cột A–E (lời giải dùng cột E) — đã sửa thành 5 cột' },
  'BT 4.4': { ghi: 'sách in "80m mét" (thừa chữ "mét"), đáp số 80 m' },
  'BT 6.9': { ghi: 'lời giải sách in dòng "2 + x + 5 − 8 = 20" (dấu trừ, đúng là +8) — lỗi in của sách' },
  'BT 5.6': { ghi: 'lời giải 6a của sách có dấu trừ dư trước (y + 1/8) và y — lỗi in của sách' },
  'BT 12.10': { ghi: 'sách in chu vi hình tròn lớn nhất 4321 cm ở cả đề và đáp án (giữ nguyên)' },
}

const lamSachLoiGiai = (raw) => {
  const dong = String(raw ?? '').split(/\r?\n/).map((l) => l.replace(/^\s*(?:[➤▶▸»→]|-(?=\s))+\s*/, '').trim()).filter((l) => l && !/^\[\s*Sơ đồ/i.test(l))
  const laC = (l) => /^Cách\s*(\d+)\s*[:.]?\s*$/i.test(l)
  const i2 = dong.findIndex((l) => /^Cách\s*2\s*[:.]?\s*$/i.test(l))
  let ra = dong, cat = false
  if (i2 >= 0) {
    const i1 = dong.findIndex((l) => /^Cách\s*1\s*[:.]?\s*$/i.test(l))
    ra = dong.slice(i1 >= 0 ? i1 + 1 : 0, i2)
    const ds = [...dong].reverse().find((l) => /^Đáp số/i.test(l))
    if (ds && !ra.some((l) => /^Đáp số/i.test(l))) ra.push(ds)
    cat = true
  } else ra = dong.filter((l) => !laC(l))
  return { text: ra.join('\n\n'), catCach2: cat }
}

const mucs = []
for (let cd = 1; cd <= 14; cd++) {
  if (cdArg && !cdArg.has(cd)) continue
  const j = JSON.parse(readFileSync(`kho-rules/dai/lo/me5-250/ME-CD${String(cd).padStart(2, '0')}.json`, 'utf8'))
  for (const m of j) {
    const kho = m.chua_chac || m.co_hinh
    if (TAP === 'sach' ? !kho : TAP === 'ho' ? kho : true) mucs.push({ ...m, cd })
  }
}
const goiAn = (t) => /(^|\n)\s*(?:[➤▶▸»→-]\s*)*(Gọi|gọi|Đặt|Đặt)\s/.test(t) || /\\overline\{/.test(t) && /Gọi|gọi/.test(t)
const anhTep = (ma) => join('kho-rules/dai/lo/me5-250/hinh', 'ME5-' + ma.replace(/ /g, '-') + '.png')

const envLocal = docEnv(join(GOC_REPO, '.env.local'))
let sb = null
const storage = () => (sb ??= createClient(envLocal.VITE_SUPABASE_URL, envLocal.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }))
const thang = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` })()
const upAnh = async (ma) => {
  const p = anhTep(ma); if (!existsSync(p)) throw new Error('thiếu hình ' + p)
  if (!GHI) return `dry://kho-anh/${p}`
  const path = `nhap_kho/${thang}/${randomUUID()}_me5_${ma.replace(/[^A-Za-z0-9.]+/g, '-')}.png`
  const { error } = await storage().storage.from('kho-anh').upload(path, readFileSync(p), { contentType: 'image/png', upsert: false })
  if (error) throw new Error(`upload ${path}: ${error.message}`)
  return storage().storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

const cauList = []
for (const m of mucs) {
  const s = SUA[m.ma] ?? {}
  let { text, catCach2 } = lamSachLoiGiai(m.loi_giai_sach)
  for (const [x, y] of s.thay_loi ?? []) text = text.split(x).join(y)
  let noi_dung = m.noi_dung.trim()
  for (const [x, y] of s.thay_de ?? []) { if (!noi_dung.includes(x)) throw new Error(`${m.ma}: không thấy "${x}" trong đề`); noi_dung = noi_dung.split(x).join(y) }
  const g = gan[m.ma]
  const nhieuY = /(^|\s)a\)/.test(noi_dung) && /(^|\s)b\)/.test(noi_dung)
  const ghi = ['Sách ME nhập ghép (chưa soạn Phần 1 hướng dẫn)']
  if (goiAn(m.loi_giai_sach)) ghi.push('lời giải sách có gọi ẩn / đặt chữ — dạng cho phép gọi ẩn (Thùy 21/11); trưởng khối xem')
  if (catCach2) ghi.push('sách có Cách 2 — chỉ giữ Cách 1')
  if (s.ghi) ghi.push(s.ghi)
  if (m.chua_chac && !s.ghi) ghi.push(/sơ đồ/i.test(m.chua_chac) ? 'lời giải sách có sơ đồ đoạn thẳng (hình) — chưa đưa vào, xem trang sách' : 'đã xem ảnh trang sách 21/11: ' + String(m.chua_chac).replace(/\s+/g, ' ').slice(0, 180))
  const q = {
    khoi: '5T', loai_cau: nhieuY ? 'tu_luan' : 'tra_loi_ngan', noi_dung,
    dap_an: (s.dap_an ?? String(m.dap_an)).trim(), loi_giai: text, ten_de_goc: `Toán 5 ME · ${m.ma}`, nguon: 'le',
    ...(g?.dang_id ? { dang_bai: g.dang_id, dang_bai_chac: 'vua', dang_bai_ly_do: `ME CĐ${m.cd} ${m.ma}: ${g.nguon} (đề xuất sơ bộ)` } : {}),
    kiem_may_nghi: ghi.join('; '), _ma: m.ma,
  }
  if (m.co_hinh) q.anh_de = await upAnh(m.ma)
  cauList.push(q)
}

if (a.includes('--xem')) { for (const k of a[a.indexOf('--xem') + 1].split(',')) { const q = cauList.find((x) => x._ma === k); console.log('=====', k, q.loai_cau, '|', q.dap_an, '|', q.dang_bai ?? '—', '|', q.kiem_may_nghi, '|', q.anh_de ?? '', '\n', q.noi_dung, '\n--\n', q.loi_giai) } process.exit(0) }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  const truoc = (await c.query(`select count(*)::int n from dai_cau_hoi where ten_de_goc like 'Toán 5 ME%' and xoa_at is null`)).rows[0].n
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList: cauList.map(({ _ma, ...q }) => q) })
  const moi = r.maCauList.length - r.trung.length
  const sau = (await c.query(`select count(*)::int n from dai_cau_hoi where ten_de_goc like 'Toán 5 ME%' and xoa_at is null`)).rows[0].n
  const duyet = (await c.query(`select count(*)::int n from dai_cau_hoi where ten_de_goc like 'Toán 5 ME%' and xoa_at is null and da_duyet`)).rows[0].n
  console.log({ tap: TAP, phamVi: cauList.length, moi, trung: r.trung.map((t) => cauList[t.idx]._ma + (t.ma_cau_cu ? '→' + t.ma_cau_cu : '')), truoc, sau, da_duyet: duyet, goiAn: cauList.filter((q) => /gọi ẩn/.test(q.kiem_may_nghi)).length, co_hinh: cauList.filter((q) => q.anh_de).length, bdm: { ...r.bdm, khoi: [...r.bdm.khoi] }, chuaCoDang: cauList.filter((q) => !q.dang_bai).length })
  if (duyet) throw new Error('có câu ME tự duyệt — không mong muốn, ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
