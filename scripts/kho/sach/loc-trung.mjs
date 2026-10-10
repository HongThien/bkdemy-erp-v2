// ============================================================================
// loc-trung.mjs — LỌC TRÙNG câu của một khối (Thùy 10/10: "T nghĩ phải làm lọc trùng đấy").
//
//   node scripts/kho/sach/loc-trung.mjs --khoi 8T [--ra <báo-cáo.md>]      # quét TOÀN BỘ câu đang có trong kho của khối, in các nhóm trùng
//   (thư viện) import { taoChiMuc, timTrung } — lo-tu-chep.mjs gọi trước khi ra lô: câu trùng với kho / trùng nhau trong lô thì KHÔNG vào lô
//
// Vì sao cần: nguồn 8T là 6 quyển sách cùng lấy đề HSG các tỉnh ⇒ một đề có ở 2–5 quyển, và trùng ngay trong một quyển
// (kho-rules/dai/k8T.md §5.3). Cổng ghi chỉ chặn trùng NGUYÊN VĂN sau chuẩn hoá; còn lọt: cùng đề khác cách gõ, cùng biểu thức viết
// khác thứ tự, đề in sẵn dạng đã tách (x^2+3x+2x+6 ↔ x^2+5x+6).
//
// BA MỨC (hai mức đầu là TRÙNG — bỏ; mức ba chỉ BÁO):
//   trùng CHỮ    khoaChu: đề sau khi bỏ dòng nguồn đề "(Đề thi HSG …)", dấu cách, $, \left \right, dấu câu, \dfrac→\frac — giống nhau
//   trùng TOÁN   cùng loại lệnh (phân tích / giải phương trình / tính giá trị) VÀ biểu thức BẰNG NHAU về mặt toán — máy thay số
//                (bộ tính của k8T-kiem.mjs). Biến gán theo thứ tự xuất hiện và theo bảng chữ cái ⇒ bắt được đổi thứ tự hạng tử
//                và đổi tên biến đơn giản. Phương trình so "vế trái − vế phải" sai khác một hằng số nhân.
//   nghi KHUÔN   cùng khuôn chữ sau khi thay mọi số bằng # VÀ cùng đáp án (vd a^100+b^100=… tính a^2004+b^2004 ↔ a^2010+b^2010) —
//                có thể là hai bài luyện khác số (giữ) hoặc một bài chép lại (bỏ) ⇒ máy KHÔNG tự bỏ, người quyết.
// Trùng trong cùng một lượt: giữ câu có đề NGẮN nhất (dạng tự nhiên), bỏ câu kia.
// ============================================================================
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { giaTri, cacBien, docKiem } from '../../../kho-rules/dai/lo/k8T-kiem.mjs'

const BS = String.fromCharCode(92)
/** bỏ dòng nguồn đề đặt trong ngoặc ở ĐẦU đề: "(Đề thi chọn HSG Toán 8, Quận 1 – …) Cho …" */
export function boNguon(s) {
  const t = String(s ?? '').trim()
  if (t[0] !== '(') return t
  let sau = 0
  for (let i = 0; i < t.length; i++) { if (t[i] === '(') sau++; else if (t[i] === ')') { sau--; if (sau === 0) { const trong = t.slice(1, i); return /đề|hsg|chuyên|thi |toán|tạp chí|olympi/i.test(trong) && !trong.includes('$') ? t.slice(i + 1).trim() : t } } }
  return t
}
export function khoaChu(s) {
  let t = boNguon(s).normalize('NFC').toLowerCase()
  for (const [a, b] of [['dfrac', 'frac'], ['tfrac', 'frac'], ['left', ''], ['right', ''], ['cdot', '*'], ['times', '*'], [',', ''], [';', ''], ['!', ''], [' ', '']]) t = t.replaceAll(BS + a, b ? (b === '*' ? '*' : BS + b) : '')
  return t.replaceAll('{,}', ',').replace(/[\s$.,;:{}]/g, '').replace(/đathứcsau|cácđathứcsau|đathức/g, 'đathức')
}
export const khoaKhuon = (s) => khoaChu(s).replace(/\d+/g, '#')
export function loaiLenh(s) {
  const t = boNguon(s).toLowerCase()
  if (t.includes('phân tích')) return 'ptnt'
  if (/tìm\s*\$?\s*x\b|giải (các )?phương trình/.test(t)) return 'pt'
  if (/tính (nhanh )?giá trị/.test(t)) return 'gt'
  if (t.includes('rút gọn')) return 'rg'
  if (t.includes('chứng minh')) return 'cm'
  if (/^tính|thực hiện/.test(t)) return 'tinh'
  return 'khac'
}

// ── vân tay toán ─────────────────────────────────────────────────────────────
const ucln = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
const ps = (n, d) => { if (d < 0n) { n = -n; d = -d } const g = ucln(n, d) || 1n; return `${n / g}/${d / g}` }
const GIA_TRI = ['3:7', '-5:11', '2:13', '7:5', '-11:3', '13:17', '-4:9', '6:19', '-8:23', '9:29'].map((x) => giaTri(x))   // bộ tính dùng ":" làm phép chia
function tinhTai(bieuThuc, thuTuBien, lech) {
  const gan = {}; thuTuBien.forEach((v, i) => { gan[v] = GIA_TRI[(i * 3 + lech) % GIA_TRI.length] })
  return giaTri(bieuThuc, gan)
}
/** các vân tay của một biểu thức (theo thứ tự xuất hiện của biến + theo bảng chữ cái); tiLe = true ⇒ không phân biệt hằng số nhân */
function vanTay(bieuThuc, tiLe = false) {
  const kq = new Set()
  let bien
  try { bien = cacBien(bieuThuc) } catch { return [] }
  for (const thuTu of [bien, [...bien].sort()]) {
    try {
      const v = [0, 1, 2].map((l) => tinhTai(bieuThuc, thuTu, l))
      if (!tiLe) kq.add(v.map((x) => ps(x.n, x.d)).join(' '))
      else if (v[0].n !== 0n) kq.add(v.slice(1).map((x) => ps(x.n * v[0].d, x.d * v[0].n)).join(' '))
    } catch { /* số mũ là chữ, căn… ⇒ không có vân tay */ }
  }
  return [...kq]
}
/** dòng kiem suy từ ĐỀ cho câu không có sẵn (câu cũ trong kho): đề "phân tích …" / "tìm x …" chỉ có ĐÚNG MỘT công thức */
function kiemSuyTuDe(noiDung) {
  const ct = [...boNguon(noiDung).matchAll(/\$([^$]+)\$/g)].map((m) => m[1].trim())
  const l = loaiLenh(noiDung)
  if (l === 'ptnt' && ct.length === 1 && !ct[0].includes('=')) return `bang | ${ct[0]}`
  if (l === 'pt' && ct.length === 1 && ct[0].split('=').length === 2) return `nghiem | ${ct[0]} | x`
  return 'khong'
}
/** tập HẠNG TỬ (cắt ở dấu + − ngoài cùng) đã sắp — hai biểu thức chỉ khác thứ tự hạng tử thì cùng khoá */
function khoaHangTu(bt) {
  const s = khoaChu(bt), ra = []; let sau = 0, cur = ''
  for (const ch of s) {
    if ('(['.includes(ch)) sau++; else if (')]'.includes(ch)) sau--
    if (sau === 0 && (ch === '+' || ch === '-') && cur) { ra.push(cur); cur = ch } else cur += ch
  }
  if (cur) ra.push(cur)
  return ra.map((x) => (x[0] === '+' ? x.slice(1) : x)).sort().join('+')
}
/**
 * khoá trùng TOÁN của một câu { noi_dung, kiem?, bai_khoa? } ⇒ { manh[], yeu[] }
 *   MẠNH (bỏ được): cùng tập hạng tử (đổi thứ tự) · hoặc bằng nhau về giá trị VÀ cùng một bài của cùng một sách (sách in sẵn dạng đã tách:
 *        x^2+3x+2x+6 ↔ x^2+5x+6) · hoặc cùng biểu thức + cùng giá trị thay vào
 *   YẾU  (chỉ báo): bằng nhau về giá trị nhưng viết khác hẳn, ở hai bài khác nhau — vd (a+b)(a^2-b^2)+… ↔ a^2(b-c)+… : hai ĐỀ khác nhau
 *        cho cùng một đa thức, người quyết (lô 2, 10/10: máy bản đầu bỏ nhầm câu này)
 */
export function khoaToan(c) {
  const k = docKiem(c.kiem && c.kiem !== 'khong' ? c.kiem : kiemSuyTuDe(c.noi_dung))
  const l = loaiLenh(c.noi_dung), bai = c.bai_khoa ?? null
  if (k.kieu === 'bang') { const vt = vanTay(k.bieu_thuc); return { manh: [`ht|${l}|${khoaHangTu(k.bieu_thuc)}`, ...(bai ? vt.map((v) => `b|${bai}|${v}`) : [])], yeu: vt.map((v) => `vt|${l === 'ptnt' ? 'ptnt' : 'bt'}|${v}`) } }
  if (k.kieu === 'nghiem') { const vt = vanTay(`(${k.ve_trai})-(${k.ve_phai})`, true); return { manh: bai ? vt.map((v) => `b|${bai}|pt|${v}`) : [], yeu: vt.map((v) => `vt|pt|${v}`) } }
  if (k.kieu === 'gia_tri') { const g = Object.entries(k.gan).sort().map(([a, b]) => `${a}=${khoaChu(b)}`).join(';'); return { manh: vanTay(k.bieu_thuc).slice(-1).map((v) => `gt|${v}|${g}`), yeu: [] } }
  return { manh: [], yeu: [] }
}
/** khoá BÀI từ mã nguồn: "D1.50a@p18" ⇒ "D1.50" · "T2V4b.1a@p21" ⇒ "T2V4b.1" (khu có thể lẫn chữ và số — quyển TVA; ghép thêm tên sách ở nơi gọi) */
export const baiTuMa = (ma) => { const m = String(ma ?? '').match(/^([A-Z][A-Za-z0-9]*\.\d+)/); return m ? m[1] : null }
const khoaDapAn = (s) => { const t = khoaChu(String(s ?? '')); return t.includes('=') && !t.includes('\\{') ? t.slice(t.lastIndexOf('=') + 1) : t }   // "$P=2$" và "$2$" là một đáp án
/** khuôn theo CÔNG THỨC (bỏ lời văn): hai đề diễn đạt khác nhau nhưng cùng các công thức sau khi thay số bằng # — chỉ lập khi đủ dài để không bắt nhầm bài luyện ngắn */
export function khoaCongThuc(s) {
  const ct = [...boNguon(s).matchAll(/\$([^$]+)\$/g)].map((m) => khoaChu(m[1]).replace(/\d+/g, '#')).filter((x) => x.length >= 6).sort()
  const k = ct.join('|')
  return k.length >= 25 ? k : null
}

/** từng CÔNG THỨC DÀI của đề (giữ nguyên số): hai đề chung một công thức dài có quan hệ (= ≤ ≥ < >) thường là MỘT bài in lại với lời dẫn khác
 *  ("là số dương" ↔ "> 0", "đôi một khác nhau" ↔ "khác nhau") — hai mức trùng ở trên và khuôn + đáp án đều không bắt (bài chứng minh không có đáp án).
 *  Lô 6–7 của 8T (10/10): phụ lục của sách in lại bài của các chương ⇒ chỉ BÁO nghi, người mở hai đề ra so rồi ghi `bo` vào <tên>.sua.json. */
export function khoaCongThucDai(s) {
  const chuan = (x) => khoaChu(x).replaceAll(BS + 'leq', BS + 'le').replaceAll(BS + 'geq', BS + 'ge').replaceAll(BS + 'neq', BS + 'ne')
  return [...new Set([...boNguon(s).matchAll(/\$([^$]+)\$/g)].map((m) => chuan(m[1])).filter((x) => x.length >= 14 && (/[=<>]/.test(x) || x.includes(BS + 'le') || x.includes(BS + 'ge'))))]
}

// ── chỉ mục + tìm trùng ──────────────────────────────────────────────────────
/** ds = [{ id, noi_dung, dap_an?, kiem? }] ⇒ chỉ mục */
export function taoChiMuc(ds) {
  const chu = new Map(), toan = new Map(), khuon = new Map()
  const them = (m, k, id) => { if (!m.has(k)) m.set(k, []); m.get(k).push(id) }
  for (const c of ds) {
    them(chu, khoaChu(c.noi_dung), c.id)
    for (const k of khoaToan(c).manh) them(toan, k, c.id)
    for (const k of khoaNghi(c)) them(khuon, k, c.id)
  }
  return { chu, toan, khuon }
}
function khoaNghi(c) {
  const yeu = [...khoaToan(c).yeu, ...khoaCongThucDai(c.noi_dung).map((k) => 'cc:' + k)]
  if (!c.dap_an || /^chứngminh$/.test(khoaDapAn(c.dap_an))) return yeu
  const da = khoaDapAn(c.dap_an), ct = khoaCongThuc(c.noi_dung)
  return [...yeu, khoaKhuon(c.noi_dung) + '⇒' + da, ...(ct ? ['ct:' + ct + '⇒' + da] : [])]
}
/** câu MỚI so với chỉ mục đã có (bỏ qua chính nó theo id). Trả { kieu: 'chu'|'toan', voi: id } | { nghi: id } | null */
export function timTrung(c, cm) {
  const khac = (ds) => (ds ?? []).find((id) => id !== c.id)
  let v = khac(cm.chu.get(khoaChu(c.noi_dung))); if (v) return { kieu: 'chu', voi: v }
  for (const k of khoaToan(c).manh) { v = khac(cm.toan.get(k)); if (v) return { kieu: 'toan', voi: v } }
  for (const k of khoaNghi(c)) { v = khac(cm.khuon.get(k)); if (v) return { nghi: v } }
  return null
}
/** lọc trùng TRONG một danh sách: mỗi nhóm trùng chữ / toán giữ câu có đề ngắn nhất. Trả Map(id bị bỏ → { kieu, voi }) */
export function trungTrongDanhSach(ds) {
  const cm = taoChiMuc(ds), theoId = new Map(ds.map((c) => [c.id, c])), bo = new Map()
  for (const [kieu, m] of [['chu', cm.chu], ['toan', cm.toan]]) for (const ids of m.values()) {
    const con = [...new Set(ids)].filter((id) => !bo.has(id)); if (con.length < 2) continue
    const giu = con.reduce((a, b) => (khoaChu(theoId.get(b).noi_dung).length < khoaChu(theoId.get(a).noi_dung).length ? b : a))
    for (const id of con) if (id !== giu) bo.set(id, { kieu, voi: giu })
  }
  return bo
}

/** câu đang có trong kho của khối (nhánh Đại) + dòng kiem lấy từ các tệp *.bai.json (khớp theo ten_de_goc = "<sách> · <mã>") */
export async function cauTrongKho(db, khoi, thuMucBai) {
  const { rows } = await db.query(`select ma_cau, noi_dung, dap_an, ten_de_goc, dang_chinh, da_duyet from dai_cau_hoi where xoa_at is null and left(dang_chinh, 4) = $1 order by ma_cau`, ['T1' + khoi])
  const kiem = new Map()
  if (thuMucBai && existsSync(thuMucBai)) for (const f of readdirSync(thuMucBai).filter((x) => x.endsWith('.bai.json'))) for (const b of JSON.parse(readFileSync(join(thuMucBai, f), 'utf8'))) if (b.sach) kiem.set(`${b.sach} · ${b.ma}`, b.kiem)
  const baiKhoa = (t) => { const i = String(t ?? '').lastIndexOf(' · '); if (i < 0) return null; const b = baiTuMa(t.slice(i + 3)); return b ? `${t.slice(0, i)}·${b}` : null }
  return rows.map((r) => ({ id: r.ma_cau, noi_dung: r.noi_dung, dap_an: r.dap_an, kiem: kiem.get(r.ten_de_goc) ?? null, bai_khoa: baiKhoa(r.ten_de_goc), ten_de_goc: r.ten_de_goc, dang_chinh: r.dang_chinh, da_duyet: r.da_duyet }))
}

// ── CLI: quét cả kho của khối ───────────────────────────────────────────────
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
  const KHOI = lay('--khoi'); if (!KHOI) { console.error('Dùng: node scripts/kho/sach/loc-trung.mjs --khoi 8T [--ra <báo-cáo.md>]'); process.exit(2) }
  const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
  const env = Object.fromEntries(readFileSync(join(GOC, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
  const pg = (await import('pg')).default
  const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await db.connect(); await db.query('begin read only')
  const ds = await cauTrongKho(db, KHOI, join(GOC, 'kho-rules', 'dai', 'lo', 'k' + KHOI))
  await db.end()
  const theoId = new Map(ds.map((c) => [c.id, c])), cm = taoChiMuc(ds)
  const ra = [`# Lọc trùng kho Đại khối ${KHOI} — ${ds.length} câu (${new Date().toISOString().slice(0, 10)})`, '']
  const dong = (id) => { const c = theoId.get(id); return `  - \`${id}\` ${c.da_duyet ? '✅ đã duyệt' : '☐ chưa duyệt'} · ${c.dang_chinh} · ${String(c.ten_de_goc ?? '').slice(-22)} — ${c.noi_dung.replace(/\s+/g, ' ').slice(0, 150)}${c.dap_an ? ' ⇒ ' + String(c.dap_an).slice(0, 50) : ''}` }
  const daIn = new Set()
  const nhom = (ten, m) => {
    const g = [...m.values()].map((ids) => [...new Set(ids)]).filter((ids) => ids.length > 1).filter((ids) => { const k = ids.join('|'); if (daIn.has(k)) return false; daIn.add(k); return true })
    ra.push(`## ${ten} — ${g.length} nhóm`, '')
    for (const ids of g) { ra.push(`- nhóm ${ids.length} câu:`); for (const id of ids) ra.push(dong(id)) }
    ra.push('')
    return g.length
  }
  const n1 = nhom('TRÙNG CHỮ (cùng đề sau chuẩn hoá)', cm.chu), n2 = nhom('TRÙNG TOÁN (cùng lệnh, biểu thức bằng nhau)', cm.toan), n3 = nhom('NGHI TRÙNG KHUÔN (cùng khuôn chữ, khác số, cùng đáp án) — người quyết', cm.khuon)
  const txt = ra.join('\n')
  if (lay('--ra')) { writeFileSync(lay('--ra'), txt + '\n'); console.log(`${ds.length} câu · trùng chữ ${n1} nhóm · trùng toán ${n2} nhóm · nghi khuôn ${n3} nhóm → ${lay('--ra')}`) } else console.log(txt)
}
