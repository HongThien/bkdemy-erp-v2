// ============================================================================
// lo-tu-soan.mjs — dựng LÔ CÂU (cùng khuôn lo-tu-md.mjs) từ bản SOẠN lời giải dạng JSON (trạm làm: model soạn, Claude soát).
//
//   node scripts/kho/sach/lo-tu-soan.mjs <soan.json> <bai.json> --khoi 4T --lo 5 --ra <lo.json> [--sua <sua.json>]
//
// soan.json = [{ ma_nguon, gop_y, dap_an, loi_giai, so_do_mo_ta?: { …mô tả JSON của so-do-doan-thang.mjs… }, ghi_chu_nghi? }]
//   so_do_mo_ta ⇒ ghi ra <--so-do-dir>/<khoi>-<mã>.json (máy vẽ + tự kiểm lúc ghi-lo); lời giải phải có dòng "Ta có sơ đồ:".
// --sua = bản SỬA của người soát: { "<ma_nguon>": { dap_an?, loi_giai?, so_do?, bo?: "lý do không ghi" } } — đè lên bản soạn,
//         để vết sửa nằm riêng (đo được tỉ lệ người soát phải sửa — thước đo của trạm soạn).
// ĐỀ luôn lấy nguyên văn sách theo mã (không lấy từ bản soạn). Câu trong lô mà sách không có mã đó ⇒ dừng, báo.
// Mọi câu vào DẠNG CHỜ của khối (giải ≠ gán dạng, CEO 08/10).
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { veSoDo } from '../so-do-doan-thang.mjs'
import { pathToFileURL } from 'node:url'
import { chuanDinhDang } from './lo-tu-md.mjs'
import { maDangCho } from '../../_kho_insert.mjs'

/** Tách một dòng có nhiều câu thành mỗi câu một dòng (luật §3 "mỗi câu lời giải một dòng"): cắt sau ". " khi chữ kế tiếp viết hoa,
 *  KHÔNG cắt trong công thức $…$. */
export function tachCau(dong) {
  const ra = []; let cur = '', trongCT = false
  for (let i = 0; i < dong.length; i++) {
    const ch = dong[i]; cur += ch
    if (ch === '$') trongCT = !trongCT
    if (!trongCT && ch === '.' && dong[i + 1] === ' ' && /\p{Lu}/u.test(dong[i + 2] ?? '')) { ra.push(cur.trim()); cur = ''; i++ }
  }
  if (cur.trim()) ra.push(cur.trim())
  return ra
}
/** Chuẩn hoá định dạng bản soạn bằng MÁY (không đụng nội dung): bỏ \" thừa · Phần 2 mỗi câu một dòng. Trả { loi_giai, doi[] } */
export function chuanSoan(lg) {
  const doi = []
  let s = lg
  if (s.includes('\\"')) { s = s.replace(/\\"/g, '"'); doi.push('bỏ \\" thừa') }
  // "\n\n" bị escape 2 lần ⇒ hiện nguyên chữ "\n\n" (không lẫn LaTeX: không lệnh nào là \n\n)
  if (s.includes('\\n\\n')) { s = s.replace(/\\n\\n/g, '\n\n'); doi.push('"\\n\\n" chữ ⇒ xuống dòng') }
  const [p1, p2] = s.split('**Phần 2. Trình bày**')
  if (p2 != null) {
    const dong = p2.split(/\n\n/).map((d) => d.trim()).filter(Boolean)
    const moi = dong.flatMap(tachCau)
    if (moi.length !== dong.length) doi.push(`Phần 2: tách ${moi.length - dong.length} câu ra dòng riêng`)
    s = `${p1}**Phần 2. Trình bày**\n\n${moi.join('\n\n')}`
  }
  return { loi_giai: s, doi }
}

/** Câu TÁCH theo chữ cái của một bài gộp nhiều biểu thức độc lập (mẫu đã duyệt lô 3: "LT 18.14B" = "Tính: $B=…$"):
 *  mã "<mã bài><CHỮ>" mà sách không có ⇒ đề = dòng lệnh đầu bài + đúng công thức `$CHỮ=…$` cắt từ đề sách. Không thấy ⇒ null. */
export function deTachChu(ma, theoMa) {
  const m = ma.match(/^(.+\d)([A-Z])$/); if (!m) return null
  const goc = theoMa.get(m[1]); if (!goc || goc.y !== null) return null
  const ct = [...goc.noi_dung.matchAll(/\$([^$]*)\$/g)].map((x) => x[1].trim()).filter((s) => s.startsWith(`${m[2]}=`))
  if (ct.length !== 1) return null
  const lenh = goc.noi_dung.split('\n')[0].trim()
  if (lenh.includes('$')) return null
  return { ...goc, ma, noi_dung: `${lenh} $${ct[0]}$`, anh: goc.anh }
}

export function dungLoSoan(soan, bai, khoi, lo, sua = {}, soDoDir = null) {
  const theoMa0 = new Map(bai.map((b) => [b.ma, b]))
  const theoMa = { get: (ma) => theoMa0.get(ma) ?? deTachChu(ma, theoMa0) }
  const cau = [], loi = [], bo = [], daSua = [], suaMay = []
  for (const s0 of soan) {
    const s = { ...s0, ...(sua[s0.ma_nguon] ?? {}) }
    if (s.loi_giai) { const { loi_giai, doi } = chuanSoan(s.loi_giai); if (doi.length) suaMay.push(`${s0.ma_nguon} (${doi.join('; ')})`); s.loi_giai = loi_giai }
    if (sua[s0.ma_nguon]) daSua.push(s0.ma_nguon)
    if (s.bo) { bo.push(`${s.ma_nguon}: ${s.bo}`); continue }
    const goc = theoMa.get(s.ma_nguon)
    if (!goc) { loi.push(`${s.ma_nguon}: không có trong sách`); continue }
    if (!/^\*\*Phần 1\. Hướng dẫn\*\*\n\n[\s\S]+\n\n\*\*Phần 2\. Trình bày\*\*\n\n[\s\S]+$/.test(s.loi_giai ?? '')) { loi.push(`${s.ma_nguon}: lời giải không đúng khuôn 2 phần`); continue }
    if (!s.dap_an) { loi.push(`${s.ma_nguon}: thiếu đáp án`); continue }
    if (s.so_do_mo_ta) {
      if (!soDoDir) { loi.push(`${s.ma_nguon}: có sơ đồ nhưng thiếu --so-do-dir`); continue }
      try { veSoDo(s.so_do_mo_ta) } catch (e) { loi.push(`${s.ma_nguon}: sơ đồ bị máy từ chối — ${e.message}`); continue }
      if (!/Ta có sơ đồ/.test(s.loi_giai)) { loi.push(`${s.ma_nguon}: có sơ đồ mà lời giải không có dòng "Ta có sơ đồ"`); continue }
      s.so_do = `${khoi}-${s.ma_nguon.replace(/\W+/g, '-')}.json`
      writeFileSync(join(soDoDir, s.so_do), JSON.stringify(s.so_do_mo_ta) + '\n')
    }
    const nhieu = /;|\bvà\b|,/.test(String(s.dap_an).replace(/\$[^$]*\$/g, 'x')) && !/^\$[^$]*\$$/.test(s.dap_an)
    cau.push({ ma_nguon: s.ma_nguon, lo, khoi, dang_chinh: maDangCho('dai', khoi), loai_cau: nhieu ? 'tu_luan' : 'tra_loi_ngan',
      noi_dung: chuanDinhDang(goc.noi_dung), noi_dung_sach: goc.noi_dung, dap_an: String(s.dap_an).trim(), loi_giai: s.loi_giai, so_do: s.so_do ?? null, anh_sach: goc.anh })
  }
  const dem = {}; for (const c of cau) dem[c.ma_nguon] = (dem[c.ma_nguon] || 0) + 1
  for (const [k, n] of Object.entries(dem)) if (n > 1) loi.push(`mã "${k}" ${n} lần`)
  for (const k of Object.keys(sua)) if (!soan.some((s) => s.ma_nguon === k)) loi.push(`bản sửa có mã "${k}" không nằm trong bản soạn`)
  return { cau, loi, bo, daSua, suaMay }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
  const [soanTep, baiTep] = a
  if (!soanTep || !baiTep || !lay('--khoi') || !lay('--lo') || !lay('--ra')) { console.error('Dùng: node scripts/kho/sach/lo-tu-soan.mjs <soan.json> <bai.json> --khoi 4T --lo 5 --ra <lo.json> [--sua <sua.json>] [--so-do-dir <dir>]'); process.exit(2) }
  const sua = lay('--sua') ? JSON.parse(readFileSync(lay('--sua'), 'utf8')) : {}
  const { cau, loi, bo, daSua, suaMay } = dungLoSoan(JSON.parse(readFileSync(soanTep, 'utf8')), JSON.parse(readFileSync(baiTep, 'utf8')), lay('--khoi'), Number(lay('--lo')), sua, lay('--so-do-dir'))
  if (loi.length) { console.error(`✘ ${loi.length} lỗi — KHÔNG ghi lô:`); for (const l of loi) console.error('  ', l); process.exit(1) }
  writeFileSync(lay('--ra'), JSON.stringify(cau, null, 1))
  console.log(`✔ ${cau.length} câu · máy sửa định dạng ${suaMay.length} · người soát sửa ${daSua.length}${daSua.length ? ' (' + daSua.join(', ') + ')' : ''} · bỏ ${bo.length}${bo.length ? ': ' + bo.join(' | ') : ''}`)
  if (a.includes('--chi-tiet')) for (const x of suaMay) console.log('   máy:', x)
  console.log('→', lay('--ra'))
}
