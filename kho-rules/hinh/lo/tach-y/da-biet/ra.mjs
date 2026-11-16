// RÀ ý dùng ĐIỂM dựng ở ý trước mà đề của ý không nhắc lại (Thùy 16/11 "Rà và đề xuất") — CHỈ ĐỌC DB, ghi de-xuat.json. Không ghi DB.
// Luật (spec-giai-bai.md › Hình › Tách ý): "Điểm mới chỉ xuất hiện ở ý nào thì nằm trong cau_hoi_y của ý đó"; ý sau cần ⇒ ghi `da_biet`.
// Cách rà (máy, theo TÊN ĐIỂM — chữ in hoa trong công thức):
//   · điểm "của bài"  = có trong lời dẫn
//   · điểm "của ý i"  = lần đầu xuất hiện ở câu hỏi ý i
//   · ý j (sau i) dùng điểm của ý i mà chưa có `da_biet` ⇒ THIẾU
// Đề xuất `da_biet` = NGUYÊN VĂN phần giả thiết của ý i (đoạn đứng trước yêu cầu "Chứng minh / Tính / So sánh / Tìm…"), kèm "(ý i)".
//   Phần giả thiết đó lại dùng điểm của ý h trước nữa ⇒ kéo theo phần giả thiết của ý h (đóng bao).
//   Điểm được đặt tên NGAY TRONG câu yêu cầu ("Chứng minh AM cắt BC tại trung điểm I") ⇒ máy không viết được, xếp vào "cần viết tay".
// Không rà: ý sau dùng KẾT QUẢ ý trước (lời giải đã ghi "(ý a)"), dữ kiện số chỉ cho ở ý trước, tên đường thẳng / tia chữ thường.
// Dùng: node --env-file=.env kho-rules/hinh/lo/tach-y/da-biet/ra.mjs 7,8,8T,9
import pg from 'pg'; import fs from 'fs'
const khois = (process.argv[2] ?? '7,8,8T,9').split(',')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL }); await c.connect()
await c.query('set default_transaction_read_only = on')
const rows = (await c.query(`
  select b.khoi, y.ma_bai_y, y.loi_dan, y.anh_de, y.ma_cau_goc, hb.ten_bai, q.ma_cau, q.nhan_y, q.cau_hoi_y, q.da_biet, q.da_duyet
    from hinh_hoc_bai_y y join hinh_hoc_bai hb on hb.ma_bai = y.dang_chinh join hinh_hoc_bai b on b.ma_bai = y.dang_chinh
    join hinh_hoc_cau_hoi q on q.bai_y = y.ma_bai_y
   where y.xoa_at is null and q.xoa_at is null and b.khoi = any($1)
   order by b.khoi, y.ma_bai_y, q.ma_cau`, [khois])).rows
await c.end()

// Tên điểm: chữ in hoa đơn (kèm dấu phẩy trên / chỉ số) bên trong $…$. Bỏ: S_{…} (diện tích), chữ ngay sau "\" (lệnh), chữ trong \text{…}.
// K7 hay viết tên điểm NGOÀI công thức ("lấy M là trung điểm của BC", "tia Oy") ⇒ đọc cả chữ thường: cụm chữ in hoa không dấu
// đứng riêng (ABC → A, B, C; Oy → O), không tính chữ đầu của một từ tiếng Việt ("Cho", "Chứng").
function diem(text) {
  const ra = new Set(); const t0 = text ?? ''
  for (const m of t0.matchAll(/\$([^$]*)\$/g)) {
    const s = m[1].replace(/\\text\{[^}]*\}/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/S_\{?[A-Za-z0-9']*\}?/g, ' ')
    for (const t of s.matchAll(/[A-Z]'*(?:_\{?\d\}?)?/g)) ra.add(t[0])
  }
  const ngoai = t0.replace(/\$[^$]*\$/g, ' ')
  for (const m of ngoai.matchAll(/(?<![A-Za-zÀ-ỹ])([A-Z]{1,6})(?:[xyztuv]'?)?(?![A-Za-zÀ-ỹ])/g)) for (const ch of m[1]) ra.add(ch)
  return ra
}
// Vị trí từ khoá YÊU CẦU đầu tiên trong câu hỏi ý ⇒ phần trước nó là giả thiết riêng của ý
const YEU_CAU = /(^|[\s,;:(])(chứng minh|chứng tỏ|cmr|c\/m|so sánh|tìm|hỏi|xác định|hãy|tính(?! chất)|giải thích|có nhận xét|nhận xét|vì sao|tại sao|từ đó|suy ra|kết luận)/i
// Theo TỪNG CÂU (ý có thể là "Chứng minh … . Lấy điểm F … . Chứng minh …"): câu không có từ khoá yêu cầu = giả thiết nguyên câu;
// câu có từ khoá = lấy phần đứng trước từ khoá ("Kẻ DH ⊥ BC, chứng minh …" → "Kẻ DH ⊥ BC.").
function tachGiaThiet(cauHoi) {
  const cong = []; const an = (cauHoi ?? '').replace(/\$[^$]*\$/g, (x) => { cong.push(x); return `\u0001${cong.length - 1}\u0002` })
  const hien = (s) => s.replace(/\u0001(\d+)\u0002/g, (_, i) => cong[+i])
  const gts = []
  for (const cau of an.split(/(?<=[.?!])\s+|\n+/)) {
    if (!cau.trim()) continue
    if (/\?\s*$/.test(cau)) continue   // câu hỏi ("Tứ giác AOBH là hình gì?") là yêu cầu, không phải giả thiết
    const m = cau.match(YEU_CAU)
    let g = m ? cau.slice(0, m.index + m[1].length) : cau
    g = g.trim().replace(/[\s,;:]+$/, '').replace(/\s+(rồi|và|khi đó|từ đó|hãy)$/i, '').replace(/[\s,;:]+$/, '')
    if (g.replace(/[.?!]+$/, '').trim()) gts.push(/[.?!]$/.test(g) ? g : g + '.')
  }
  return { gt: hien(gts.join(' ')) }
}
const thuTu = (n) => { const m = String(n).match(/^(\d*)([a-h]?)(\*?)/); return [m[1] ? +m[1] : 0, m[2] || '', m[3]] }
const soNhan = (a, b) => { const x = thuTu(a.nhan_y), y = thuTu(b.nhan_y); return x[0] - y[0] || x[1].localeCompare(y[1]) || x[2].localeCompare(y[2]) || a.ma_cau.localeCompare(b.ma_cau) }

const theoBai = new Map(); for (const r of rows) { if (!theoBai.has(r.ma_bai_y)) theoBai.set(r.ma_bai_y, []); theoBai.get(r.ma_bai_y).push(r) }
const deXuat = [], vietTay = [], dem = {}
for (const [maBai, ys0] of theoBai) {
  const ys = [...ys0].sort(soNhan)   // thứ tự ý theo NHÃN (a, b, c · 1a, 1b, 2), không theo mã câu
  const k = ys[0].khoi; dem[k] ??= { bai: 0, y: 0, bai_thieu: 0, y_thieu: 0, y_may_viet: 0, y_viet_tay: 0, y_da_co: 0 }
  dem[k].bai++; dem[k].y += ys.length
  const cuaBai = diem(ys[0].loi_dan)
  // Bài ĐỌC HÌNH ("Cho hình vẽ bên.", lời dẫn không nêu điểm nào): mọi điểm nằm trên hình của bài ⇒ không ý nào thiếu định nghĩa điểm
  if (!cuaBai.size && /hình/i.test(ys[0].loi_dan)) { dem[k].bai_doc_hinh = (dem[k].bai_doc_hinh ?? 0) + 1; continue }
  // Lời dẫn kết bằng yêu cầu ("… Chứng minh:") ⇒ mỗi ý là một MỆNH ĐỀ cần chứng minh, không phải giả thiết ⇒ không lấy làm "Đã biết" bằng máy
  if (/(chứng minh|chứng minh rằng|chứng tỏ|chứng tỏ rằng|cmr|tính|tìm|so sánh)\s*[:.]?\s*$/i.test(ys[0].loi_dan.trim())) { dem[k].bai_yc_o_loi_dan = (dem[k].bai_yc_o_loi_dan ?? 0) + 1; continue }
  const dau = new Map()        // điểm → chỉ số ý đầu tiên xuất hiện
  const info = ys.map((y, i) => { const g = tachGiaThiet(y.cau_hoi_y); const dGt = diem(g.gt), dAll = diem(y.cau_hoi_y)
    for (const p of dAll) if (!cuaBai.has(p) && !dau.has(p)) dau.set(p, i)
    return { ...g, dGt, dAll } })
  let baiThieu = false
  ys.forEach((y, j) => {
    const can = [...info[j].dAll].filter((p) => dau.has(p) && dau.get(p) < j)
    if (!can.length) return
    if (/^\s*Cho\s+(tam giác|hình|đường tròn|nửa đường tròn|góc|tứ giác|đoạn|điểm|hai|ba|\$\\triangle|\$\()/.test(y.cau_hoi_y)) { dem[k].y_tu_du = (dem[k].y_tu_du ?? 0) + 1; return }   // ý mở bằng "Cho …" = tự nêu lại hình của nó (bài gồm các ý độc lập)
    if ((y.da_biet ?? '').trim()) { dem[k].y_da_co++; return }
    baiThieu = true; dem[k].y_thieu++
    // đóng bao: ý nguồn → phần giả thiết; điểm đặt tên trong câu yêu cầu ⇒ viết tay
    const lay = new Set(), tay = []; const hang = [...can]
    const daXet = new Set()
    while (hang.length) {
      const p = hang.pop(); if (daXet.has(p)) continue; daXet.add(p)
      const i = dau.get(p)
      if (info[i].dGt.has(p)) { if (!lay.has(i)) { lay.add(i); for (const q of info[i].dGt) if (dau.has(q) && dau.get(q) < i) hang.push(q) } }
      else tay.push({ diem: p, y: ys[i].nhan_y, cau_hoi: ys[i].cau_hoi_y })
    }
    const nguon = [...lay].sort((a, b) => a - b)
    const daBiet = nguon.map((i) => `${info[i].gt.replace(/\.$/, '')} (ý ${ys[i].nhan_y}).`).join('\n')
    const o = { khoi: k, ma_bai_y: maBai, ma_cau_goc: y.ma_cau_goc, ten_bai: y.ten_bai, anh_de: y.anh_de, loi_dan: y.loi_dan, ma_cau: y.ma_cau, nhan_y: y.nhan_y, da_duyet: y.da_duyet,
                cau_hoi_y: y.cau_hoi_y, diem_thieu: can.sort(), da_biet: daBiet || null, tu_y: nguon.map((i) => ys[i].nhan_y), viet_tay: tay,
                cac_y: ys.map((z) => ({ nhan: z.nhan_y, cau_hoi: z.cau_hoi_y })) }
    if (tay.length) { dem[k].y_viet_tay++; vietTay.push(o) } else { dem[k].y_may_viet++; deXuat.push(o) }
  })
  if (baiThieu) dem[k].bai_thieu++
}
const DIR = 'kho-rules/hinh/lo/tach-y/da-biet/'
// Các ý máy không viết được: người đọc từng bài rồi viết ở tay.json ({da_biet} hoặc {bo: lý do}); chưa có trong tay.json ⇒ vẫn "cần viết tay"
const TAY = fs.existsSync(DIR + 'tay.json') ? JSON.parse(fs.readFileSync(DIR + 'tay.json', 'utf8')) : {}
const boQua = [], conTay = []
for (const o of vietTay) {
  const t = TAY[o.ma_cau]
  if (t?.bo) boQua.push({ ...o, ly_do: t.bo })
  else if (t?.da_biet) deXuat.push({ ...o, da_biet: t.da_biet, viet_boi: 'tay' })
  else conTay.push(o)
}
deXuat.sort((a, b) => a.khoi.localeCompare(b.khoi) || a.ma_bai_y.localeCompare(b.ma_bai_y) || a.ma_cau.localeCompare(b.ma_cau))
fs.writeFileSync(DIR + 'de-xuat.json', JSON.stringify({ luc: new Date().toISOString(), khois, dem, deXuat, boQua, vietTay: conTay }, null, 1))
console.table(dem)
console.log('đề xuất:', deXuat.length, 'ý (máy', deXuat.filter((o) => !o.viet_boi).length, '· tay', deXuat.filter((o) => o.viet_boi).length, ') · bỏ qua có lý do:', boQua.length, '· còn cần viết tay:', conTay.length)
