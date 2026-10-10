// ============================================================================
// dung-de-tu-soan.mjs — DỰNG `de.json` của 1 đề từ bản SOẠN dạng Markdown (đề đã soát + lời giải 2 phần), rồi `ghi.mjs` ghi ERP.
//
//   node scripts/kho/de-thi/dung-de-tu-soan.mjs <x.soan.md> --lam-viec <thư mục làm việc của đề> [--khoi 6] [--chi-kiem]
//
// Dùng cho đề KHÔNG có đáp án / lời giải trong file (bộ đề K6 GKI + CKI, 10/2026): đáp án lấy từ lượt giải theo `kho-rules/dai/k6.md`,
// khác luồng `/nhap-de-thi` (ở đó file có đáp án ⇒ không tự giải). Thư mục làm việc = nơi `boc-pdf.mjs` đã chạy (de.json gốc, img/, goc.pdf):
// lần đầu script đổi tên `de.json` → `de.boc.json` (bản Gemini gõ, giữ làm đối chứng) rồi ghi `de.json` mới.
//
// Khuôn x.soan.md (mẫu: kho-rules/dai/lo/k6/GKI-01.soan.md):
//   # ĐỀ | <tên đề>            · dòng `nam: 2024` · `bo_sach: KNTT`
//   ## PHẦN <n> | <tên phần> | trac_nghiem|tu_luan|tra_loi_ngan
//   ### <nhãn gốc: Câu 3 / Bài 2a> | kho=dai|hgt | loai=trac_nghiem|tra_loi_ngan|tu_luan | dap_an=<A–D | số | —>
//   **Đề:** …  (TN: 4 dòng `A. ` `B. ` `C. ` `D. `)   [**Hình:** tệp trong img/]   [**Ghi chú:** …]   [**Chưa chắc:** …]
//   **Phần 1. Hướng dẫn** … **Phần 2. Trình bày** …
//
// CỔNG (lỗi nào cũng từ chối dựng): thiếu phần / thiếu đề · Phần 1 không đúng khuôn card 3–6 bước (kiem-p1-card.mjs) · TN không đủ 4 phương án
// hoặc dòng cuối "Chọn X." lệch `dap_an` · trả lời ngắn không tô được 4 ô · công thức KaTeX hỏng / số `$` lẻ · dấu nhân `\cdot` `\times`
// (K6 viết dấu chấm như SGK) · hình khai mà không có tệp.
// ============================================================================
import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs'
import { join, basename } from 'node:path'
import { createRequire } from 'node:module'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'
import { GOC_REPO } from '../cau-hinh.mjs'

const katex = createRequire(join(GOC_REPO, 'package.json'))('katex')
const args = process.argv.slice(2)
const lay = (k, md) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : md }
const tep = args.find((a, i) => !a.startsWith('--') && !['--lam-viec', '--khoi'].includes(args[i - 1]))
const LV = lay('--lam-viec'), KHOI = lay('--khoi', '6'), CHI_KIEM = args.includes('--chi-kiem')
if (!tep || !LV) { console.error('Dùng: node scripts/kho/de-thi/dung-de-tu-soan.mjs <x.soan.md> --lam-viec <thư mục> [--khoi 6] [--chi-kiem]'); process.exit(2) }

// mục "## GHI CHÚ CHO NGƯỜI DUYỆT" ở cuối tệp (câu bỏ, điều chưa chắc chung) KHÔNG thuộc đề — cắt ra trước khi tách phần
const mdDu = readFileSync(tep, 'utf8').replace(/\r\n/g, '\n')
const iGhiChu = mdDu.search(/^## GHI CHÚ/m)
const md = iGhiChu >= 0 ? mdDu.slice(0, iGhiChu) : mdDu
const loi = [], nhac = []
const mTen = md.match(/^# ĐỀ \| (.+)$/m)
if (!mTen) loi.push('thiếu dòng đầu "# ĐỀ | <tên đề>"')
const meta = Object.fromEntries([...md.slice(0, md.search(/^## /m)).matchAll(/^([a-z_]+):\s*(.+)$/gm)].map((m) => [m[1], m[2].trim()]))

const gon = (s) => s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
function kiemCongThuc(nhan, cho, s) {
  if (!s) return
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${nhan} (${cho}): số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${nhan} (${cho}): KaTeX hỏng «${m[1].slice(0, 50)}» — ${e.message.slice(0, 80)}`) }
    if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${nhan} (${cho}): chữ Việt trong công thức ngoài \\text{}: «${m[1].slice(0, 50)}»`)
    if (/\\cdot|\\times/.test(m[1])) loi.push(`${nhan} (${cho}): dấu nhân phải là dấu chấm như SGK, gặp «${m[1].slice(0, 50)}»`)
  }
}

const phan = [], cau = []
const khoiPhan = md.split(/^(?=## PHẦN )/m).slice(1)
if (!khoiPhan.length) loi.push('không có "## PHẦN …"')
for (const kp of khoiPhan) {
  const mh = kp.match(/^## PHẦN (\d+) \| (.+?) \| (trac_nghiem|tu_luan|tra_loi_ngan)\s*$/m)
  if (!mh) { loi.push('tiêu đề phần sai khuôn: ' + kp.split('\n')[0]); continue }
  const thuTu = +mh[1]
  phan.push({ thu_tu: thuTu, ten: mh[2].trim(), dang_thuc: mh[3], diem_moi_cau: mh[3] === 'trac_nghiem' ? 0.25 : 0.5 })
  let so = 0
  for (const kc of kp.split(/^(?=### )/m).slice(1)) {
    const dongDau = kc.slice(0, kc.indexOf('\n'))
    const mc = dongDau.match(/^### (.+?) \| (.+)$/)
    if (!mc) { loi.push('tiêu đề câu sai khuôn: ' + dongDau); continue }
    const nhan = `P${thuTu} ${mc[1].trim()}`
    const kv = Object.fromEntries(mc[2].split('|').map((x) => x.trim().split('=').map((y) => y.trim())).map(([k, ...v]) => [k, v.join('=')]))
    const than = kc.slice(kc.indexOf('\n') + 1)
    const i1 = than.indexOf('**Phần 1. Hướng dẫn**'), i2 = than.indexOf('**Phần 2. Trình bày**')
    if (i1 < 0 || i2 < i1) { loi.push(`${nhan}: thiếu Phần 1 / Phần 2`); continue }
    // phần trước lời giải: đề · phương án · hình · ghi chú
    const noiDung = [], luaChon = {}, anh = [], canhBao = []
    let dang = null
    for (const d of than.slice(0, i1).split('\n')) {
      let m
      if ((m = d.match(/^\*\*Đề:\*\*\s*(.*)$/))) { dang = 'de'; if (m[1]) noiDung.push(m[1]) }
      else if ((m = d.match(/^([A-D])\.\s+(.+)$/)) && kv.loai === 'trac_nghiem') { dang = 'lc'; luaChon[m[1]] = m[2].trim() }
      else if ((m = d.match(/^\*\*Hình:\*\*\s*(.+)$/))) { dang = null; anh.push(...m[1].split(',').map((x) => x.trim()).filter(Boolean)) }
      else if ((m = d.match(/^\*\*Ghi chú:\*\*\s*(.+)$/))) { dang = null; canhBao.push(m[1].trim()) }
      else if ((m = d.match(/^\*\*Chưa chắc:\*\*\s*(.+)$/))) { dang = null; canhBao.push('CHƯA CHẮC — ' + m[1].trim()) }
      else if (dang === 'de') noiDung.push(d)
      else if (d.trim()) loi.push(`${nhan}: dòng lạc trước lời giải: «${d.slice(0, 60)}»`)
    }
    const nd = gon(noiDung.join('\n'))
    const loiGiai = gon(than.slice(i1))
    const p1 = gon(than.slice(i1, i2))
    if (!nd) loi.push(`${nhan}: thiếu "**Đề:**"`)
    if (!['dai', 'hgt'].includes(kv.kho)) loi.push(`${nhan}: kho phải là dai / hgt`)
    if (!['trac_nghiem', 'tra_loi_ngan', 'tu_luan'].includes(kv.loai)) loi.push(`${nhan}: loai sai «${kv.loai}»`)
    for (const l of kiemP1(p1)) loi.push(`${nhan} Phần 1: ${l}`)
    kiemCongThuc(nhan, 'đề', nd); kiemCongThuc(nhan, 'lời giải', loiGiai)
    let dapAn = null, lc = null
    if (kv.loai === 'trac_nghiem') {
      lc = ['A', 'B', 'C', 'D'].map((k) => luaChon[k])
      if (lc.some((x) => !x)) loi.push(`${nhan}: trắc nghiệm phải đủ 4 dòng A. B. C. D.`)
      lc.forEach((x, i) => kiemCongThuc(nhan, 'phương án ' + 'ABCD'[i], x))
      dapAn = kv.dap_an
      if (!/^[ABCD]$/.test(dapAn ?? '')) loi.push(`${nhan}: dap_an TN phải là A/B/C/D`)
      const cuoi = loiGiai.split('\n').filter((x) => x.trim()).pop()
      if (cuoi !== `Chọn ${dapAn}.`) loi.push(`${nhan}: dòng cuối lời giải phải là "Chọn ${dapAn}." — gặp «${cuoi.slice(0, 40)}»`)
    } else if (kv.loai === 'tra_loi_ngan') {
      dapAn = kv.dap_an
      // phiếu trả lời 4 ô: chữ số, dấu "-" chỉ ở ô 1, dấu "," ở ô 2 hoặc 3
      if (!/^-?\d+(,\d+)?$/.test(dapAn ?? '') || dapAn.length > 4) loi.push(`${nhan}: đáp số «${dapAn}» không tô được trên 4 ô ⇒ để loai=tu_luan`)
    }
    for (const f of anh) if (!existsSync(join(LV, 'img', f))) loi.push(`${nhan}: không có hình img/${f}`)
    if (anh.length > 1) nhac.push(`${nhan}: ${anh.length} hình — ERP chỉ giữ hình đầu`)
    cau.push({ phan: thuTu, so: ++so, nhan: mc[1].trim(), kho: kv.kho, loai_cau: kv.loai, noi_dung: nd, lua_chon: lc, dap_an: dapAn, dap_an_nguon: 'claude_giai',
      menh_de: null, loi_giai: loiGiai, anh, anh_giai: [], dang: null, canh_bao: canhBao })
  }
  if (!so) loi.push(`Phần ${thuTu}: không có câu nào`)
}

console.log(`${basename(tep)} — ${phan.length} phần · ${cau.length} câu (${cau.filter((q) => q.loai_cau === 'trac_nghiem').length} TN · ${cau.filter((q) => q.loai_cau === 'tra_loi_ngan').length} TLN · ${cau.filter((q) => q.loai_cau === 'tu_luan').length} tự luận) · HGT ${cau.filter((q) => q.kho === 'hgt').length} · hình ${cau.filter((q) => q.anh.length).length} · chưa chắc ${cau.filter((q) => q.canh_bao.some((x) => x.startsWith('CHƯA CHẮC'))).length}`)
for (const n of nhac) console.log('  ⚠ ' + n)
if (loi.length) { console.error(`❌ ${loi.length} lỗi:\n  ` + loi.join('\n  ')); process.exit(1) }
if (CHI_KIEM) { console.log('✔ đạt cổng (chỉ kiểm, không ghi de.json)'); process.exit(0) }

const fBoc = join(LV, 'de.boc.json'), fDe = join(LV, 'de.json')
if (!existsSync(fBoc)) { if (!existsSync(fDe)) { console.error('❌ thư mục làm việc không có de.json của boc-pdf'); process.exit(2) } renameSync(fDe, fBoc) }
const boc = JSON.parse(readFileSync(fBoc, 'utf8'))
const de = { file: boc.file, sha256: boc.sha256, ten: mTen[1].trim(), khoi: String(KHOI), mon: 'Toán', nguon: 'le', nam: meta.nam ? Number(meta.nam) : null,
  thoi_gian_phut: Number(meta.thoi_gian_phut ?? 90), thang_diem: 10, bo_sach: meta.bo_sach ?? null, soan: basename(tep), phan, cau }
writeFileSync(fDe, JSON.stringify(de, null, 1))
console.log('✔ ' + fDe)
