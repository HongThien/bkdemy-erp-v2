// ============================================================================
// t0-cua-vao.mjs — TRẠM T0 của dây chuyền kho (spec-luong-kho.md §5.2).
//
// Việc: quét folder nguồn → ghép cặp đề ↔ đáp án → (tuỳ chọn) chép về đĩa LOCAL + sha256.
// Không AI, không đụng DB, KHÔNG ghi gì vào folder nguồn.
//
//   node scripts/kho/t0-cua-vao.mjs quet --thu-muc "Kho đề/Khối 12"
//   node scripts/kho/t0-cua-vao.mjs quet --thu-muc "Kho đề/Khối 12" --chep --gioi-han 5
//
// Không `--chep` = chỉ liệt kê + ghép cặp (nhanh, không tải file từ Drive).
// Có `--chep`   = chép từng file về <KHO_LAM_VIEC>/<sha12>/ kèm ho-so.json. Chạy lại không nhân đôi:
//                 thư mục làm việc khoá bằng sha256 NỘI DUNG, không bằng tên hay vị trí.
//
// LUẬT GHÉP CẶP (CLAUDE.md §2 — danh tính bám khoá tự nhiên, không bám vị trí):
//   · Khoá = tên file đã chuẩn hoá, bỏ hậu tố vai. Hai file cùng khoá, khác vai ⇒ 1 cặp.
//   · Một khoá có >1 file cùng vai ⇒ MƠ HỒ ⇒ KHÔNG ghép, để người quyết (§1.5 thà bỏ trống).
//   · "Số file đề = số file đáp án" KHÔNG phải bằng chứng ghép đúng — không dùng ở đâu cả.
// ============================================================================
import { readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, basename, extname, dirname, relative, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { gocNguon, thuMucLamViec } from './cau-hinh.mjs'

const DUOI_NHAN = new Set(['.pdf', '.docx', '.doc'])
const BO_QUA_THU_MUC = new Set(['daxuly', 'new folder'])

// Hậu tố nói lên VAI của file. Thứ tự quan trọng: mẫu dài xét trước.
const HAU_TO_VAI = [
  { mau: /\s*[-_–]\s*(ch|cau hoi|câu hỏi|de|đề)$/u, vai: 'de' },
  { mau: /\s*[-_–]\s*(da|dap an|đáp án|loi giai|lời giải|hdg)$/u, vai: 'dap_an' },
  { mau: /\s*[-_–]\s*(ghép\s+|ghep\s+)?hs\d*$/u, vai: 'de' },       // bản học sinh = chỉ có đề
  { mau: /\s*[-_–]\s*(ghép\s+|ghep\s+)?gv\d*$/u, vai: 'dap_an' },   // bản giáo viên = có lời giải
]

export function chuanHoaTen(s) {
  return s.normalize('NFC').toLowerCase().replace(/\s+/gu, ' ').trim()
}

/** Tên file + đường dẫn thư mục (tương đối) → { khoa, vai }. vai ∈ 'de' | 'dap_an' | 'chung'. */
export function khoaGhep(tenFile, thuMucTuongDoi = '') {
  let ten = chuanHoaTen(basename(tenFile, extname(tenFile)))
  // " (1)", " (2)" cuối tên = dấu trình duyệt thêm khi tải trùng, không phải tên tài liệu.
  // Bỏ đi để ghép được; nếu vì thế mà 2 file cùng vai trùng khoá thì ghepCap xếp vào MƠ HỒ, không ghép bừa.
  ten = ten.replace(/\s*\(\d+\)$/u, '').trim()
  let vai = 'chung'
  for (const { mau, vai: v } of HAU_TO_VAI) {
    if (mau.test(ten)) { ten = ten.replace(mau, '').trim(); vai = v; break }
  }
  // File nằm trong thư mục "Đáp án" ⇒ vai đáp án; thư mục đó không tham gia vào khoá
  const doan = thuMucTuongDoi.split(/[\\/]/u).filter(Boolean)
  const conLai = []
  for (const d of doan) {
    if (/^(đáp án|dap an)$/u.test(chuanHoaTen(d))) { if (vai === 'chung') vai = 'dap_an' } else conLai.push(chuanHoaTen(d))
  }
  return { khoa: [...conLai, ten].join('/'), vai }
}

/** Danh sách { duong_dan, khoa, vai } → { cap, don_le, mo_ho }. */
export function ghepCap(ds) {
  const theoKhoa = new Map()
  for (const f of ds) {
    if (!theoKhoa.has(f.khoa)) theoKhoa.set(f.khoa, [])
    theoKhoa.get(f.khoa).push(f)
  }
  const cap = [], don_le = [], mo_ho = []
  for (const [khoa, nhom] of theoKhoa) {
    // Cùng nội dung, khác định dạng (pdf + docx) là CÙNG một tài liệu — gom theo vai trước khi đếm
    const theoVai = { de: [], dap_an: [], chung: [] }
    for (const f of nhom) theoVai[f.vai].push(f)
    const trungVai = Object.entries(theoVai).filter(([, a]) => new Set(a.map((x) => extname(x.duong_dan).toLowerCase())).size < a.length)
    if (trungVai.length) {
      mo_ho.push({ khoa, ly_do: `nhiều file cùng vai "${trungVai[0][0]}" và cùng định dạng`, tep: nhom.map((x) => x.duong_dan) })
      continue
    }
    const dd = (a) => a.map((x) => x.duong_dan)
    const coDe = theoVai.de.length > 0, coDa = theoVai.dap_an.length > 0, coChung = theoVai.chung.length > 0
    if (coDe && coDa && coChung) {
      mo_ho.push({ khoa, ly_do: 'có cả file "đề", file "đáp án" và file không rõ vai — không biết file không rõ vai là gì', tep: dd(nhom) })
    } else if (coDe && coDa) {
      cap.push({ khoa, de: dd(theoVai.de), dap_an: dd(theoVai.dap_an) })
    } else if (coChung && coDa) {
      // File không hậu tố + bản đáp án cùng khoá (vd đề ở gốc, đáp án trong "Đáp án/") ⇒ file không hậu tố là ĐỀ
      cap.push({ khoa, de: dd(theoVai.chung), dap_an: dd(theoVai.dap_an), suy_vai: 'file không hậu tố được coi là ĐỀ' })
    } else if (coDe && coChung) {
      // "X - CH" + "X" (kiểu NBV) ⇒ file không hậu tố là bản ĐẦY ĐỦ có lời giải.
      // Đây là SUY từ tên — trạm đọc phải đối chiếu nội dung trước khi tin (nhân chứng thứ hai).
      cap.push({ khoa, de: dd(theoVai.de), dap_an: dd(theoVai.chung), suy_vai: 'file không hậu tố được coi là bản CÓ ĐÁP ÁN — cần đối chiếu nội dung' })
    } else {
      for (const f of nhom) don_le.push({ khoa, vai: f.vai, duong_dan: f.duong_dan })
    }
  }
  return { cap, don_le, mo_ho }
}

export function diBo(dirAbs, goc, out = []) {
  for (const ten of readdirSync(dirAbs)) {
    if (ten.startsWith('.') || ten.startsWith('~$') || ten.toLowerCase() === 'desktop.ini') continue
    const p = join(dirAbs, ten)
    let st
    try { st = statSync(p) } catch { continue }
    if (st.isDirectory()) { if (!BO_QUA_THU_MUC.has(ten.toLowerCase())) diBo(p, goc, out) }
    else if (st.isFile() && DUOI_NHAN.has(extname(ten).toLowerCase())) {
      const tuongDoi = relative(goc, dirname(p)).split(sep).join('/')
      out.push({ duong_dan: p, kich_thuoc: st.size, ...khoaGhep(ten, tuongDoi) })
    }
  }
  return out
}

export function sha256Tep(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex')
}

/** Chép 1 file về thư mục làm việc. Trả hồ sơ. Đã có đúng nội dung ⇒ không chép lại. */
export function chepVe(duongDanGoc, lamViec, them = {}) {
  const sha = sha256Tep(duongDanGoc)
  const dir = join(lamViec, sha.slice(0, 12))
  const duoi = extname(duongDanGoc).toLowerCase()
  const dich = join(dir, 'goc' + duoi)
  const tepHoSo = join(dir, 'ho-so.json')
  let da_co = false
  if (existsSync(dich) && sha256Tep(dich) === sha) da_co = true
  else { mkdirSync(dir, { recursive: true }); copyFileSync(duongDanGoc, dich) }
  // Chép xong phải đọc lại: ổ streaming có thể trả file cụt mà không báo lỗi
  const shaDich = sha256Tep(dich)
  if (shaDich !== sha) throw new Error(`Chép lỗi: sha nguồn ${sha.slice(0, 12)} ≠ sha đích ${shaDich.slice(0, 12)} (${duongDanGoc})`)
  const hoSo = { sha256: sha, ten_goc: basename(duongDanGoc), duong_dan_goc: duongDanGoc, tep_local: dich, ...them }
  writeFileSync(tepHoSo, JSON.stringify(hoSo, null, 2), 'utf8')
  return { ...hoSo, da_co }
}

function thamSo(argv) {
  const a = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i]
    if (!x.startsWith('--')) { a._.push(x); continue }
    const k = x.slice(2), n = argv[i + 1]
    if (!n || n.startsWith('--')) a[k] = true
    else { a[k] = n; i++ }
  }
  return a
}

async function main() {
  const a = thamSo(process.argv.slice(2))
  if (a._[0] !== 'quet' || !a['thu-muc']) {
    console.error('Dùng: node scripts/kho/t0-cua-vao.mjs quet --thu-muc "<đường dẫn con trong folder nguồn>" [--chep] [--gioi-han N]')
    process.exit(2)
  }
  const goc = gocNguon()
  const dir = join(goc.duong_dan, a['thu-muc'])
  if (!existsSync(dir)) { console.error(`❌ Không có thư mục: ${dir}`); process.exit(2) }
  console.error(`Gốc nguồn: ${goc.duong_dan} (${goc.nguon})`)
  const ds = diBo(dir, dir)
  const kq = ghepCap(ds)
  const out = {
    goc: goc.duong_dan, thu_muc: a['thu-muc'], tong_tep: ds.length,
    so_cap: kq.cap.length, so_don_le: kq.don_le.length, so_mo_ho: kq.mo_ho.length,
    cap: kq.cap, don_le: kq.don_le, mo_ho: kq.mo_ho,
  }
  if (a.chep) {
    const lv = thuMucLamViec()
    console.error(`Thư mục làm việc: ${lv.duong_dan} (${lv.nguon})`)
    const gioiHan = a['gioi-han'] ? Number(a['gioi-han']) : Infinity
    const hangChep = [
      ...kq.cap.flatMap((c) => [...c.de.map((p) => ({ p, khoa: c.khoa, vai: 'de' })), ...c.dap_an.map((p) => ({ p, khoa: c.khoa, vai: 'dap_an' }))]),
      ...kq.don_le.map((f) => ({ p: f.duong_dan, khoa: f.khoa, vai: f.vai })),
    ].slice(0, gioiHan)
    out.da_chep = []
    for (const h of hangChep) {
      const t0 = Date.now()
      try {
        const hs = chepVe(h.p, lv.duong_dan, { khoa: h.khoa, vai: h.vai, thu_muc_nguon: a['thu-muc'] })
        out.da_chep.push({ sha12: hs.sha256.slice(0, 12), vai: h.vai, khoa: h.khoa, da_co: hs.da_co, ms: Date.now() - t0 })
      } catch (e) {
        out.da_chep.push({ khoa: h.khoa, vai: h.vai, loi: e.message })
      }
    }
  }
  console.log(JSON.stringify(out, null, 2))
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main()
