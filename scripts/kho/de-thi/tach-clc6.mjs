// ============================================================================
// tach-clc6.mjs — TÁCH bộ "Tuyển tập đề thi vào lớp 6 CLC" (1 file Word, nhiều đề) thành từng đề, từng câu.
//
//   node scripts/kho/de-thi/tach-clc6.mjs <tuyen-tap.txt của doc-docx.mjs> --ra <de.json> [--xem "<tên đề>"]
//
// KHÔNG gọi AI, KHÔNG đụng DB. Đầu vào là văn bản đã đổi công thức MathType → LaTeX (scripts/kho/mathtype-thu/doc-docx.mjs).
// Khuôn câu gặp trong bộ này (hồ sơ: kho-rules/dai/clc6-ho-so.md):
//   (a) bảng "STT | Câu hỏi": một dòng chỉ có số in đậm, dòng sau là nội dung;
//   (b) nhãn "Câu N." / "Bài N." (đậm hoặc không);
//   (c) đề chia PHẦN (trắc nghiệm / điền đáp số / tự luận) — số câu đếm lại từ 1 ở mỗi phần.
// Danh tính câu = <mã đề> · <phần>.<số> — bám nhãn in trong đề, không bám vị trí.
// Máy chỉ DỰNG CẤU TRÚC + nêu cờ (số câu không liên tục, phần không nhận ra…); không đoán nội dung.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const tep = args.find((a) => !a.startsWith('--'))
const iRa = args.indexOf('--ra'), RA = iRa >= 0 ? args[iRa + 1] : null
const iXem = args.indexOf('--xem'), XEM = iXem >= 0 ? args[iXem + 1] : null
if (!tep) { console.error('Dùng: node scripts/kho/de-thi/tach-clc6.mjs <tuyen-tap.txt> --ra <de.json>'); process.exit(2) }

const boB = (s) => s.replace(/\[\[\/?b\]\]/g, '')
const dong = readFileSync(tep, 'utf8').split(/\r?\n/).map((l) => l.replace(/^\[\d+\] ?/, ''))

// ── cắt đề: dòng "ĐỀ …" sau mục lục (mục lục = các dòng ĐỀ … kết thúc bằng số trang) ──
// Mỗi tên đề xuất hiện ĐÚNG 2 lần: lần đầu trong mục lục (dính số trang ở cuối), lần hai là tiêu đề thân bài.
// Tiêu đề thân bài cũng kết thúc bằng chữ số (năm) nên KHÔNG phân biệt được bằng "có số ở cuối" ⇒ chia đôi rồi đối chiếu từng cặp.
const tatCaDe = []
for (let i = 0; i < dong.length; i++) if (/^ĐỀ /.test(boB(dong[i]).trim()) && !/^ĐỀ BÀI/.test(boB(dong[i]).trim())) tatCaDe.push(i)
if (tatCaDe.length % 2) { console.error(`❌ số dòng "ĐỀ …" lẻ (${tatCaDe.length}) — mục lục và thân bài không khớp đôi`); process.exit(1) }
const nuaDau = tatCaDe.slice(0, tatCaDe.length / 2), moc = tatCaDe.slice(tatCaDe.length / 2)
for (let k = 0; k < moc.length; k++) {
  const a = boB(dong[nuaDau[k]]).trim(), b = boB(dong[moc[k]]).trim()
  if (!a.startsWith(b.slice(0, Math.min(b.length, 14)))) { console.error(`❌ mục lục ↔ thân bài lệch ở đề thứ ${k + 1}: "${a}" ↔ "${b}"`); process.exit(1) }
}

const TRUONG = [
  [/LƯƠNG THẾ VINH/, 'LTV', 'Lương Thế Vinh'], [/LÊ LỢI/, 'LL', 'Lê Lợi'], [/THANH XUÂN/, 'TX', 'Thanh Xuân'], [/NAM TỪ LIÊM/, 'NTL', 'Nam Từ Liêm'],
  [/NGÔI SAO/, 'NS', 'Ngôi Sao Hà Nội'], [/ARCHIMEDES/, 'ARC', 'Archimedes'], [/CẦU GIẤY/, 'CG', 'Cầu Giấy'], [/NGUYỄN TẤT THÀNH/, 'NTT', 'Nguyễn Tất Thành'],
  [/NGOẠI NGỮ/, 'NN', 'Chuyên Ngoại ngữ'], [/AMSTERDAM/, 'AMS', 'Amsterdam'],
]
function maDe(ten) {
  const t = TRUONG.find(([r]) => r.test(ten)); if (!t) return { ma: null }
  const nam = ten.match(/(20\d\d)\s*[-–]\s*(20\d\d)/)?.[1] ?? ten.match(/(?:NĂM|NGỮ)\s*(20\d\d)/)?.[1] ?? null
  let duoi = ''
  if (/THI THỬ/.test(ten)) duoi = '-TT' + (ten.match(/SỐ\s*(\d)/)?.[1] ?? '')
  else if (/MINH HỌA/.test(ten)) duoi = '-MH' + (ten.match(/SỐ\s*(\d)/)?.[1] ?? '')
  else if (/HỌC BỔNG/.test(ten)) duoi = '-HB' + (ten.match(/ĐỀ\s*(\d)/)?.[1] ?? '')
  else if (/NÂNG CAO/.test(ten)) duoi = '-NC'
  else if (/CƠ BẢN/.test(ten)) duoi = '-CB'
  else if (/ĐỀ MẪU|RÀ SOÁT/.test(ten)) duoi = '-MAU'
  return { ma: `${t[1]} ${nam ?? ''}${duoi}`.trim().replace(/\s+-/, '-'), truong: t[2], nam: nam ? `${nam}-${+nam + 1}` : null }
}

// ── tách câu trong một đề ─────────────────────────────────────────────────────
const RE_PHAN = /^(?:PHẦN|Phần|PHẦN THI|BÀI THI)\s*(?:THỨ\s*)?([IVX]+|\d+|[A-C]|MỘT|HAI|BA)\b[.:\s]|^([IVX]+)\.\s+(?:PHẦN|TRẮC|TỰ|ĐIỀN|TRẢ|CHỌN)|^[A-C][.:]\s*(?:PHẦN|TRẮC NGHIỆM|TỰ LUẬN)|^(?:TRẮC NGHIỆM|TỰ LUẬN|PHẦN TRẮC NGHIỆM|PHẦN TỰ LUẬN)\b/
const RE_CAU = /^((?:\[\[img:[^\]]+\]\])*)\s*(?:Câu|Bài|CÂU|BÀI)\s*(\d+)\s*[.:)]?\s*(?:\(([^)]{1,30})\)\s*[.:]?)?\s*(.*)$/
const RE_SO = /^(\d{1,2})[.)]?$/
const kieuPhan = (t) => /TỰ LUẬN|TRÌNH BÀY|GIẢI/i.test(t) ? 'tu_luan' : /ĐIỀN|TRẢ LỜI NGẮN|ĐÁP SỐ|GHI KẾT QUẢ|VIẾT/i.test(t) ? 'dien' : /TRẮC NGHIỆM|CHỌN|KHOANH/i.test(t) ? 'trac_nghiem' : null

function tachDe(ten, ds) {
  const cau = [], co = [], phan = []
  let p = { stt: 0, ten: null, kieu: null }, c = null, bang = false, dau = []
  const dong_ = ds.filter((l) => boB(l).trim() && !/^(STT|Câu hỏi|Đáp số|Đáp án|Trả lời)$/i.test(boB(l).trim()))
  if (ds.some((l) => /^STT$/i.test(boB(l).trim()))) bang = true
  const dong2 = bang ? dong_ : dong_
  const mo = (so, dau_, diem) => { c = { phan: p.stt, so: +so, diem: diem ?? null, dong: dau_ ? [dau_] : [] }; cau.push(c) }
  const RE_SO_DAM = /^\[\[b\]\]\d{1,2}[.)]?\[\[\/b\]\]$/
  const soDamKe = (i) => { for (let j = i + 1; j < dong2.length; j++) if (RE_SO_DAM.test(dong2[j].trim())) return +boB(dong2[j]).replace(/\D/g, ''); return null }
  let nhanTruoc = null
  for (let i = 0; i < dong2.length; i++) {
    const raw = dong2[i]
    const t = boB(raw).trim()
    const laDam = /^\[\[b\]\].*\[\[\/b\]\]$/.test(raw.trim()) || /^(?:\[\[img:[^\]]+\]\])*\[\[b\]\]/.test(raw.trim())
    if (RE_PHAN.test(t) && t.length < 160 && !RE_CAU.test(t)) {
      p = { stt: phan.length + 1, ten: t, kieu: kieuPhan(t) }; phan.push(p); c = null; continue
    }
    const mSo = RE_SO.exec(t)
    const truoc = c && c.phan === p.stt ? c.so : 0
    if (mSo && RE_SO_DAM.test(raw.trim())) {
      let so = +mSo[1]
      // nhãn in sai giữa dãy (vd 1..7, "1", 9..): số kế tiếp trong bảng = truoc + 2 ⇒ nhãn này phải là truoc + 1
      if (bang && truoc && so !== truoc + 1 && soDamKe(i) === truoc + 2) {
        co.push(`nhãn câu in "${so}" ở vị trí thứ ${truoc + 1} — đã sửa thành ${truoc + 1} (số trước ${truoc}, số sau ${truoc + 2})`); so = truoc + 1
      }
      mo(so, ''); continue
    }
    // bảng mà số thứ tự KHÔNG in đậm: chỉ nhận dòng toàn số nếu đúng là số kế tiếp (tránh nhầm nội dung chỉ có một con số)
    if (mSo && bang && !laDam && +mSo[1] === truoc + 1) { mo(mSo[1], ''); continue }
    const m = RE_CAU.exec(t)
    if (m && (laDam || /^(?:\[\[img:[^\]]+\]\])*\s*(?:Câu|Bài|CÂU|BÀI)\s*\d+\s*[.:)]/.test(t))) {
      const nhan = /^b/i.test(t.replace(/\[\[img:[^\]]+\]\]/g, '').trim()) ? 'Bài' : 'Câu'
      // đề không ghi tiêu đề phần tự luận: nhãn đổi (Câu → Bài) và đếm lại từ 1 ⇒ phần mới
      if (c && nhanTruoc && nhan !== nhanTruoc && +m[2] === 1 && c.phan === p.stt) {
        p = { stt: phan.length + 1, ten: `(đề không ghi tiêu đề phần — nhãn đổi sang "${nhan}")`, kieu: nhan === 'Bài' ? 'tu_luan' : null }; phan.push(p)
      }
      nhanTruoc = nhan
      mo(m[2], (m[1] + ' ' + m[4]).trim(), m[3]); continue
    }
    if (c) c.dong.push(t); else dau.push(t)
  }
  // dựng câu
  const ra = cau.map((x) => {
    const than = x.dong.filter(Boolean)
    const hinh = []
    const sach = than.map((l) => l.replace(/\[\[img:([^\]]+)\]\]/g, (_, f) => { hinh.push(f); return '' }).trim()).filter(Boolean)
    // phương án A. B. C. D. (có thể cùng dòng, cách nhau bằng tab/khoảng trắng)
    let lua = null
    const iA = sach.findIndex((l) => /^A\s*[.)]/.test(l))
    let de = sach
    if (iA >= 0) {
      const duoi = sach.slice(iA).join('\t')
      const parts = duoi.split(/(?:^|[\t ]+)(?=[A-E]\s*[.)]\s*)/).map((s) => s.trim()).filter(Boolean)
      const pa = {}
      let hopLe = true
      for (const s of parts) { const mm = /^([A-E])\s*[.)]\s*([\s\S]*)$/.exec(s); if (!mm) { hopLe = false; break } pa[mm[1]] = mm[2].trim() }
      const k = Object.keys(pa).join('')
      if (hopLe && /^ABC?D?E?$/.test(k) && k.length >= 3) { lua = pa; de = sach.slice(0, iA) } else co.push(`câu ${x.phan}.${x.so}: có dòng "A." nhưng không tách được phương án (${k || 'rỗng'})`)
    }
    const kp = phan.find((q) => q.stt === x.phan)?.kieu
    return { phan: x.phan, so: x.so, diem: x.diem, kieu: lua ? 'trac_nghiem' : kp === 'tu_luan' ? 'tu_luan' : 'dien', noi_dung: de.join('\n'), lua_chon: lua, hinh }
  })
  // kiểm số thứ tự: tăng dần từ 1 trong từng phần, hoặc nối tiếp xuyên các phần. Thiếu số ở giữa = ghi chú (đề sưu tầm thiếu câu), không phải lỗi tách.
  const theoPhan = {}
  for (const x of ra) (theoPhan[x.phan] ??= []).push(x.so)
  const tang = (a) => a.every((v, i) => i === 0 || v > a[i - 1])
  const thieu = (a) => { const s = new Set(a), r = []; for (let v = 1; v <= a.at(-1); v++) if (!s.has(v)) r.push(v); return r }
  const tatCa = ra.map((x) => x.so)
  const xuyen = tatCa.length > 0 && tang(tatCa) && tatCa[0] === 1
  const ghi_chu = []
  if (!ra.length) co.push('KHÔNG tách được câu nào')
  else if (xuyen) { const th = thieu(tatCa); if (th.length) ghi_chu.push(`đề nguồn thiếu câu ${th.join(', ')}`) }
  else {
    // từng phần: đếm lại từ 1, HOẶC nối tiếp số cuối của phần liền trước (vd phần 1: 1–4, phần 2: 5–8, phần 3: Bài 1–2)
    let cuoiTruoc = 0
    for (const [k, a] of Object.entries(theoPhan)) {
      const noi = cuoiTruoc && a[0] === cuoiTruoc + 1
      if (!tang(a) || (a[0] !== 1 && !noi)) co.push(`phần ${k}: số câu không tăng dần từ 1 — ${a.join(',')}`)
      else { const th = thieu(noi ? [...Array(cuoiTruoc).keys()].map((v) => v + 1).concat(a) : a); if (th.length) ghi_chu.push(`phần ${k}: đề nguồn thiếu câu ${th.join(', ')}`) }
      cuoiTruoc = a.at(-1)
    }
  }
  for (const x of ra) if (!x.noi_dung.trim()) co.push(`câu ${x.phan}.${x.so}: nội dung RỖNG`)
  const trung = ra.map((x) => `${x.phan}.${x.so}`).filter((k, i, a) => a.indexOf(k) !== i)
  if (trung.length) co.push('trùng nhãn câu: ' + trung.join(' '))
  return { phan: phan.map((x) => ({ stt: x.stt, ten: x.ten, kieu: x.kieu })), dau_de: dau, cau: ra, co, ghi_chu, danh_so_xuyen_phan: xuyen }
}

const de = []
for (let k = 0; k < moc.length; k++) {
  const ten = boB(dong[moc[k]]).trim()
  const ds = dong.slice(moc[k] + 1, moc[k + 1] ?? dong.length)
  const m = maDe(ten)
  de.push({ ten, ...m, ...tachDe(ten, ds) })
}
const maTrung = de.map((d) => d.ma).filter((m, i, a) => a.indexOf(m) !== i)
console.log(`${de.length} đề · ${de.reduce((s, d) => s + d.cau.length, 0)} câu · trắc nghiệm ${de.reduce((s, d) => s + d.cau.filter((c) => c.kieu === 'trac_nghiem').length, 0)} · điền ${de.reduce((s, d) => s + d.cau.filter((c) => c.kieu === 'dien').length, 0)} · tự luận ${de.reduce((s, d) => s + d.cau.filter((c) => c.kieu === 'tu_luan').length, 0)} · có hình ${de.reduce((s, d) => s + d.cau.filter((c) => c.hinh.length).length, 0)} câu / ${de.reduce((s, d) => s + d.cau.reduce((t, c) => t + c.hinh.length, 0), 0)} hình`)
if (maTrung.length) console.log('⚠ mã đề trùng:', maTrung.join(' · '))
for (const d of de) {
  const pp = d.phan.length ? ` · phần: ${d.phan.map((p) => `${p.stt}=${p.kieu ?? '?'}`).join(' ')}` : ''
  console.log(`${(d.ma ?? '??').padEnd(14)} ${String(d.cau.length).padStart(3)} câu${pp}${d.dau_de.length ? ` · đầu đề ${d.dau_de.length} dòng` : ''}${d.ghi_chu.length ? ' · ' + d.ghi_chu.join('; ') : ''}${d.co.length ? '\n     ⚠ ' + d.co.join('\n     ⚠ ') : ''}`)
}
if (XEM) {
  const d = de.find((x) => x.ma === XEM || x.ten.includes(XEM))
  if (d) { console.log('\n=====', d.ten, '\nĐẦU ĐỀ:', d.dau_de.join(' | ')); for (const p of d.phan) console.log('PHẦN', p.stt, p.kieu, '—', p.ten); for (const c of d.cau) console.log(`[${c.phan}.${c.so}]${c.diem ? ' (' + c.diem + ')' : ''} ${c.noi_dung.slice(0, 260).replace(/\n/g, ' ⏎ ')}${c.lua_chon ? '\n     ' + JSON.stringify(c.lua_chon) : ''}${c.hinh.length ? '   🖼 ' + c.hinh.join(',') : ''}`) }
}
if (RA) { writeFileSync(RA, JSON.stringify(de, null, 1)); console.log('→', RA) }
