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
// Theo khối: khối 6 dấu nhân là dấu chấm như SGK, hình vào HGT (k6.md) · khối 8 dấu nhân \cdot, hình phẳng vào kho Hình học (k8.md §10)
// · khối 9 dấu nhân \cdot (k9.md §3), hệ thức lượng vào HGT (hgt/k9.md).
// · tiểu học (khối 3–5, 4T, 5T) dấu nhân \times như vở (k5T.md §3) — không dấu chấm, không \cdot
const TIEU_HOC = ['3', '4', '5', '4T', '5T'].includes(String(KHOI))
const NHAN_CHAM = !TIEU_HOC && !['8', '9', '10', '11'].includes(String(KHOI))
const KHO_DUOC = ['7', '8', '11'].includes(String(KHOI)) ? ['dai', 'hinh_hoc'] : String(KHOI) === '9' ? ['dai', 'hgt', 'hinh_hoc'] : ['dai', 'hgt'] // khối 7: hình phẳng THCS ⇒ kho Hình học, dạng chờ HH07000000 (mig 202610121650)
// khối 9 BỘ ĐỀ GKI (Thùy 18/10: "đẩy tất cả bài Hình vào bài Ôn thi giữa kì I của phần Hình – học lớp 9"): mọi câu kho=hinh_hoc ghi thẳng vào dạng HH00140 "Ôn thi giữa kì I"
const DANG_HINH_K9 = process.env.DANG_HINH_K9 || 'HH00140' // bộ đề cuối kì 1 K9 (18/10) đặt DANG_HINH_K9=<mã bài> khi chạy k9-cki-ghi-*.sh
const mTen = md.match(/^# ĐỀ \| (.+)$/m)
if (!mTen) loi.push('thiếu dòng đầu "# ĐỀ | <tên đề>"')
const meta = Object.fromEntries([...md.slice(0, md.search(/^## /m)).matchAll(/^([a-z_]+):\s*(.+)$/gm)].map((m) => [m[1], m[2].trim()]))

// nhãn La Mã của đề (Bài IIa, Câu IV.1…) ⇒ số Ả Rập (Bài 2a, Câu 4.1): nhom-bai.mjs chỉ gom ý a b c / nhóm bài cho nhãn dạng chữ số (GKI-20 K9, 18/10)
const LA_MA = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 }
const chuanNhan = (n) => n.replace(/^(Bài|Câu)\s+(X|IX|VIII|VII|VI|IV|V|III|II|I)(?=[.\sa-z]|$)/, (_, t, r) => `${t} ${LA_MA[r]}`)
const gon = (s) => s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
function kiemCongThuc(nhan, cho, s) {
  if (!s) return
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${nhan} (${cho}): số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${nhan} (${cho}): KaTeX hỏng «${m[1].slice(0, 50)}» — ${e.message.slice(0, 80)}`) }
    if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${nhan} (${cho}): chữ Việt trong công thức ngoài \\text{}: «${m[1].slice(0, 50)}»`)
    if (TIEU_HOC) { if (/\\cdot/.test(m[1])) loi.push(`${nhan} (${cho}): khối ${KHOI} (tiểu học) dấu nhân là \\times, gặp «${m[1].slice(0, 50)}»`) }
    else if (NHAN_CHAM) { if (/\\cdot|\\times/.test(m[1])) loi.push(`${nhan} (${cho}): dấu nhân phải là dấu chấm như SGK, gặp «${m[1].slice(0, 50)}»`) }
    else { // khối 8 (k8.md §3): dấu nhân tường minh là \cdot — không \times, không dấu chấm
      if (/\\times/.test(m[1])) loi.push(`${nhan} (${cho}): khối ${KHOI} không dùng \\times, dùng \\cdot — «${m[1].slice(0, 50)}»`)
      if (/[0-9A-Za-z)}]\s*\.\s*[0-9A-Za-z(\\]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${nhan} (${cho}): dấu chấm làm dấu nhân — khối ${KHOI} viết \\cdot — «${m[1].slice(0, 50)}»`)
    }
  }
}

// ── SƠ ĐỒ TƯ DUY (Thùy 14/11, bảng hinh_hoc_cau_so_do — mig 202611131317) ─────────────────────────────────────────────
// Thay Phần 1 của câu Hình chứng minh bằng khối:
//   **Sơ đồ tư duy**
//   **Mấu chốt:** <ý tưởng then chốt>
//   - n1 | a | <mốc> | gt | <lý do>          một ô / dòng, THEO THỨ TỰ XUÔI (giả thiết → kết luận)
//   - n2 | c | <mốc> | n1, gt | <lý do>      cột: khoá bất biến · ý · mốc · từ (khoá ô TRƯỚC và/hoặc gt) · lý do (tuỳ chọn)
// Câu không chia ý ⇒ cột ý = "-". Phần 2: mỗi ô đúng MỘT khúc, mở bằng dòng riêng `[[so-do:<k>]]`, đúng thứ tự ô, nằm trong đúng ý
// (dòng ý trong Phần 2 = chỉ "c)" đứng một mình, khúc theo sau). Mọi chữ của Phần 2 phải nằm trong một khúc.
const SD_RE = /^\[\[so-do:(n\d+)\]\]$/, YP2_RE = /^\*{0,2}([a-h])\)\*{0,2}\s*(.*)$/
function docSoDo(nhan, khoi, p2) {
  const L = (s) => loi.push(`${nhan} Sơ đồ tư duy: ${s}`)
  const dong = khoi.split('\n').map((s) => s.trim()).filter(Boolean)
  let mauChot = null; const nut = [], khoa = new Set()
  for (const d of dong.slice(1)) {
    let m
    if ((m = d.match(/^\*\*Mấu chốt:\*\*\s*(.+)$/))) { if (mauChot) L('hai dòng Mấu chốt'); mauChot = m[1].trim(); continue }
    if (d.startsWith('- ')) {
      const f = d.slice(2).split(' | ').map((s) => s.trim())
      if (f.length < 4 || f.length > 5) { L(`dòng ô phải có 4–5 cột "k | ý | mốc | từ | lý do": «${d.slice(0, 60)}»`); continue }
      const [k, y, noi, tu, ly] = f
      if (!/^n\d+$/.test(k)) L(`khoá «${k}» phải dạng n1, n2…`)
      if (khoa.has(k)) L(`khoá ${k} lặp`)
      if (!/^([a-h]|-)$/.test(y)) L(`${k}: cột ý «${y}» phải là a–h hoặc "-"`)
      if (!noi) L(`${k}: mốc rỗng`)
      const tuDs = tu.split(',').map((s) => s.trim()).filter(Boolean)
      if (!tuDs.length) L(`${k}: cột "từ" rỗng (ghi gt hoặc khoá ô trước)`)
      for (const t of tuDs) if (t !== 'gt' && !khoa.has(t)) L(`${k}: "từ" trỏ «${t}» — chỉ được trỏ gt hoặc ô ĐỨNG TRƯỚC`)
      kiemCongThuc(nhan, `sơ đồ ${k}`, noi); if (ly) kiemCongThuc(nhan, `sơ đồ ${k} lý do`, ly)
      khoa.add(k); nut.push({ k, y, noi_dung: noi, tu: tuDs, ...(ly ? { ly_do: ly } : {}) })
      continue
    }
    L(`dòng lạc «${d.slice(0, 60)}»`)
  }
  if (!mauChot) L('thiếu "**Mấu chốt:**"'); else kiemCongThuc(nhan, 'Mấu chốt', mauChot)
  if (!nut.length || nut.length > 20) L(`số ô = ${nut.length}, phải 1–20`)
  // Phần 2: khúc ↔ ô
  const coY = nut.some((o) => o.y !== '-')
  let yHt = coY ? null : '-', khucHt = null
  const moc = []
  for (const d0 of p2.split('\n').slice(1)) {
    const d = d0.trim(); if (!d) continue
    let m
    if ((m = d.match(SD_RE))) { moc.push({ k: m[1], y: yHt }); khucHt = m[1]; continue }
    if (/\[\[so-do/.test(d)) { L(`dòng móc sai khuôn «${d.slice(0, 40)}» — phải đứng riêng một dòng [[so-do:nK]]`); continue }
    if (coY && (m = d.match(YP2_RE))) { yHt = m[1]; khucHt = null; if (m[2]) L(`Phần 2 ý ${m[1]}): dòng ý phải đứng một mình, khúc đầu tiên mở bằng [[so-do:…]] ngay sau`); continue }
    if (!khucHt) L(`Phần 2: chữ nằm ngoài khúc (trước dòng [[so-do:…]] đầu tiên của ý): «${d.slice(0, 50)}»`)
  }
  const thuTu = nut.map((o) => o.k).join(','), thuTuMoc = moc.map((o) => o.k).join(',')
  if (thuTu !== thuTuMoc) L(`các khúc Phần 2 phải móc đúng mọi ô, mỗi ô một lần, theo thứ tự xuôi — sơ đồ [${thuTu}] · Phần 2 [${thuTuMoc}]`)
  for (const mc of moc) { const o = nut.find((x) => x.k === mc.k); if (o && o.y !== mc.y) L(`${o.k} thuộc ý ${o.y} nhưng khúc nằm ở ý ${mc.y ?? '?'}`) }
  return { mau_chot: mauChot, nut }
}

const phan = [], cau = []
const khoiPhan = md.split(/^(?=## PHẦN )/m).slice(1)
if (!khoiPhan.length) loi.push('không có "## PHẦN …"')
for (const kp of khoiPhan) {
  const mh = kp.match(/^## PHẦN (\d+) \| (.+?) \| (trac_nghiem|dung_sai|tu_luan|tra_loi_ngan)\s*$/m)
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
    // ⭐ 14/11 (Thùy): câu Hình chứng minh có thể thay Phần 1 bằng "**Sơ đồ tư duy**" — lưu RIÊNG (bảng hinh_hoc_cau_so_do), không vào lời giải;
    //   lời giải = Phần 2, chia khúc theo sơ đồ xuôi, mỗi khúc mở bằng dòng `[[so-do:<k>]]`. Xem docSoDo() dưới.
    const iSd = than.indexOf('**Sơ đồ tư duy**')
    const i1 = iSd >= 0 ? iSd : than.indexOf('**Phần 1. Hướng dẫn**'), i2 = than.indexOf('**Phần 2. Trình bày**')
    if (i1 < 0 || i2 < i1) { loi.push(`${nhan}: thiếu Phần 1 (hoặc Sơ đồ tư duy) / Phần 2`); continue }
    if (iSd >= 0 && than.includes('**Phần 1. Hướng dẫn**')) loi.push(`${nhan}: đã có Sơ đồ tư duy thì bỏ Phần 1 (sơ đồ ngược chính là Phần 1)`)
    // phần trước lời giải: đề · phương án · hình · ghi chú
    const noiDung = [], luaChon = {}, menh = [], anh = [], anhGiai = [], canhBao = []
    let dang = null
    for (const d of than.slice(0, i1).split('\n')) {
      let m
      if ((m = d.match(/^\*\*Đề:\*\*\s*(.*)$/))) { dang = 'de'; if (m[1]) noiDung.push(m[1]) }
      else if ((m = d.match(/^([A-D])\.\s+(.+)$/)) && kv.loai === 'trac_nghiem') { dang = 'lc'; luaChon[m[1]] = m[2].trim() }
      else if ((m = d.match(/^([a-d])\)\s+(.*)$/)) && kv.loai === 'dung_sai') { dang = 'md'; menh.push(m[2]) } // Đúng/Sai (K11): 4 ý a) b) c) d), mỗi ý 1 mệnh đề
      else if (dang === 'md' && d.trim() && !/^\*\*/.test(d)) menh[menh.length - 1] += '\n' + d
      else if ((m = d.match(/^\*\*Hình:\*\*\s*(.+)$/))) { dang = null; anh.push(...m[1].split(',').map((x) => x.trim()).filter(Boolean)) }
      // hình CHỈ của lời giải (bài hình đề không cho hình, HS tự vẽ — K8 10/10): không hiện ở đề, ghi.mjs đưa vào anh_dap_an
      else if ((m = d.match(/^\*\*Hình giải:\*\*\s*(.+)$/))) { dang = null; anhGiai.push(...m[1].split(',').map((x) => x.trim()).filter(Boolean)) }
      else if ((m = d.match(/^\*\*Ghi chú:\*\*\s*(.+)$/))) { dang = null; canhBao.push(m[1].trim()) }
      else if ((m = d.match(/^\*\*Chưa chắc:\*\*\s*(.+)$/))) { dang = null; canhBao.push('CHƯA CHẮC — ' + m[1].trim()) }
      else if (dang === 'de') noiDung.push(d)
      else if (d.trim()) loi.push(`${nhan}: dòng lạc trước lời giải: «${d.slice(0, 60)}»`)
    }
    const nd = gon(noiDung.join('\n'))
    const loiGiai = gon(than.slice(iSd >= 0 ? i2 : i1)) // có sơ đồ ⇒ lời giải chỉ còn Phần 2 (sơ đồ lưu riêng)
    const p1 = gon(than.slice(i1, i2))
    if (!nd) loi.push(`${nhan}: thiếu "**Đề:**"`)
    if (!KHO_DUOC.includes(kv.kho)) loi.push(`${nhan}: kho phải là ${KHO_DUOC.join(' / ')}`)
    if (!['trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan'].includes(kv.loai)) loi.push(`${nhan}: loai sai «${kv.loai}»`)
    let soDo = null
    if (iSd >= 0) {
      if (kv.kho !== 'hinh_hoc') loi.push(`${nhan}: Sơ đồ tư duy hiện chỉ cho câu kho=hinh_hoc`)
      soDo = docSoDo(nhan, p1, loiGiai)
    } else for (const l of kiemP1(p1)) loi.push(`${nhan} Phần 1: ${l}`)
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
    } else if (kv.loai === 'dung_sai') {
      dapAn = kv.dap_an
      if (menh.length !== 4) loi.push(`${nhan}: Đúng/Sai phải đủ 4 ý a) b) c) d) — có ${menh.length}`)
      if (!/^[DS]{4}$/.test(dapAn ?? '')) loi.push(`${nhan}: dap_an Đúng/Sai phải là 4 chữ D/S (vd DSSD) — gặp «${dapAn}»`)
      menh.forEach((x, i) => kiemCongThuc(nhan, 'ý ' + 'abcd'[i], x))
    } else if (kv.loai === 'tra_loi_ngan') {
      dapAn = kv.dap_an
      // phiếu trả lời 4 ô: chữ số, dấu "-" chỉ ở ô 1, dấu "," ở ô 2 hoặc 3
      if (!/^-?\d+(,\d+)?$/.test(dapAn ?? '') || dapAn.length > 4) loi.push(`${nhan}: đáp số «${dapAn}» không tô được trên 4 ô ⇒ để loai=tu_luan`)
    }
    for (const f of [...anh, ...anhGiai]) if (!existsSync(join(LV, 'img', f))) loi.push(`${nhan}: không có hình img/${f}`)
    if (anhGiai.length > 1) nhac.push(`${nhan}: ${anhGiai.length} hình giải — ERP chỉ giữ hình đầu`)
    if (anh.length > 1) nhac.push(`${nhan}: ${anh.length} hình — ERP chỉ giữ hình đầu`)
    cau.push({ phan: thuTu, so: ++so, nhan: chuanNhan(mc[1].trim()), kho: kv.kho, loai_cau: kv.loai, noi_dung: nd, lua_chon: lc, dap_an: kv.loai === 'dung_sai' ? null : dapAn, dap_an_nguon: 'claude_giai',
      menh_de: kv.loai === 'dung_sai' ? menh.map((t, i) => ({ noi_dung: t, dap_an: dapAn?.[i], dang: null, loi_giai: null })) : null, loi_giai: loiGiai, ...(soDo ? { so_do: soDo } : {}), anh, anh_giai: anhGiai, dang: String(KHOI) === '9' && kv.kho === 'hinh_hoc' ? DANG_HINH_K9 : null, canh_bao: canhBao })
  }
  if (!so) loi.push(`Phần ${thuTu}: không có câu nào`)
}

console.log(`${basename(tep)} — ${phan.length} phần · ${cau.length} câu (${cau.filter((q) => q.loai_cau === 'trac_nghiem').length} TN · ${cau.filter((q) => q.loai_cau === 'dung_sai').length} Đ/S · ${cau.filter((q) => q.loai_cau === 'tra_loi_ngan').length} TLN · ${cau.filter((q) => q.loai_cau === 'tu_luan').length} tự luận) · HGT ${cau.filter((q) => q.kho === 'hgt').length} · hình ${cau.filter((q) => q.anh.length).length} · chưa chắc ${cau.filter((q) => q.canh_bao.some((x) => x.startsWith('CHƯA CHẮC'))).length}`)
for (const n of nhac) console.log('  ⚠ ' + n)
if (loi.length) { console.error(`❌ ${loi.length} lỗi:\n  ` + loi.join('\n  ')); process.exit(1) }
if (CHI_KIEM) { console.log('✔ đạt cổng (chỉ kiểm, không ghi de.json)'); process.exit(0) }

const fBoc = join(LV, 'de.boc.json'), fDe = join(LV, 'de.json')
if (!existsSync(fBoc)) { if (!existsSync(fDe)) { console.error('❌ thư mục làm việc không có de.json của boc-pdf'); process.exit(2) } renameSync(fDe, fBoc) }
const boc = JSON.parse(readFileSync(fBoc, 'utf8'))
const de = { file: boc.file, sha256: boc.sha256, ten: mTen[1].trim(), khoi: String(KHOI), mon: 'Toán', nguon: 'le', nam: meta.nam ? Number(meta.nam) : null,
  // dòng `kieu: de_cuong` ở đầu tệp ⇒ ĐỀ CƯƠNG ôn tập (tab "Đề cương" của Kho đề thi, tách khỏi đề thi; không có thời gian làm bài) — CEO 10–11/10
  ...(meta.kieu === 'de_cuong' ? { kieu: 'de_cuong' } : {}),
  thoi_gian_phut: meta.kieu === 'de_cuong' ? null : Number(meta.thoi_gian_phut ?? 90), thang_diem: 10, bo_sach: meta.bo_sach ?? null, soan: basename(tep), phan, cau }
writeFileSync(fDe, JSON.stringify(de, null, 1))
console.log('✔ ' + fDe)
