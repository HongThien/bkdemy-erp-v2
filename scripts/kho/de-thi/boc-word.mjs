// ============================================================================
// boc-word.mjs — BÓC 1 đề thi khuôn Bộ (3 phần) từ file Word ra `de.json` (spec-de-thi.md §10.3 bước 1–3).
//
//   node scripts/kho/de-thi/boc-word.mjs "<file.docx>" --ra <thư mục làm việc> [--khoi 12]
//
// KHÔNG gọi AI, KHÔNG đụng DB. Đọc Word bằng bộ đọc thẳng (`scripts/kho/mathtype-thu`): công thức MathType → LaTeX,
// nhãn "Câu N", đáp án gạch chân. Việc của file này là DỰNG CẤU TRÚC + KIỂM MÁY:
//   - Tách PHẦN I / II / III (trắc nghiệm · đúng sai · trả lời ngắn) và từng câu.
//   - Đề in 2 lần (phần ĐỀ rồi phần LỜI GIẢI chép lại từng câu) ⇒ lấy bản LỜI GIẢI (đủ đáp án + lời giải) làm chính,
//     so nội dung với bản ĐỀ làm NHÂN CHỨNG — lệch ⇒ cảnh báo, không tự chọn.
//   - Đáp án: TN = chữ GẠCH CHÂN (và/hoặc "Chọn X" trong lời giải; hai nguồn lệch ⇒ cảnh báo) · Đ/S = "a) Đúng/Sai" trong
//     lời giải · TLN = dòng "Đáp án: …" nếu có; không có ⇒ để TRỐNG (Claude rút từ lời giải ở bước sau, ghi rõ nguồn).
//   - Hình: ảnh PNG/JPG nhúng ⇒ chép ra <ra>/img. WMF/EMF (ảnh công thức, hình vẽ vector) không đổi được ⇒ cảnh báo.
// Thứ KHÔNG làm ở đây (cần phán đoán — việc của Claude trong /nhap-de-thi): gán kho (dai/hgt) + dạng từng câu,
// rút đáp số TLN, xử lý cảnh báo. Claude sửa thẳng vào de.json rồi chạy ghi.mjs.
// ============================================================================
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { basename, join, extname } from 'node:path'
import { convertDocx } from '../mathtype-thu/doc.mjs'

const JSZip = createRequire(import.meta.url)('jszip')

// ── tiện ích chữ ──────────────────────────────────────────────────────────────
const RE_THE = /\[\[\/?(?:u|b|mau(?::[0-9A-Fa-f]+)?|nen(?::\w+)?)\]\]/g
export const boThe = (s) => s.replace(RE_THE, '')
const RE_IMG = /\[\[img:([^\]]+)\]\]/g
/** Gọn khoảng trắng + chèn dấu cách giữa chữ và công thức dính liền ("độ$Oxyz$,cho" → "độ $Oxyz$, cho" phần chữ–công thức). */
export function gon(s) {
  let t = s.replace(/\t+/g, ' ').replace(/[  ]{2,}/g, ' ').trim()
  let out = '', trong = false
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (c === '$') {
      if (!trong && out && /[\p{L}\p{N}]$/u.test(out)) out += ' '          // chữ dính trước công thức
      out += c; trong = !trong
      if (!trong && i + 1 < t.length && /[\p{L}\p{N}]/u.test(t[i + 1])) out += ' ' // chữ dính sau công thức
    } else out += c
  }
  return out.replace(/ {2,}/g, ' ').trim()
}
const chuan = (s) => boThe(s).replace(RE_IMG, '').toLowerCase().replace(/\s+/g, '')
/** Chữ cái phương án được GẠCH CHÂN trong đoạn thô (còn thẻ). */
export function chuGach(raw) {
  const ra = new Set()
  for (const m of raw.matchAll(/\[\[u\]\]([\s\S]*?)\[\[\/u\]\]/g)) {
    const c = /^([ABCD])(?:\s*\.|$)/.exec(boThe(m[1]).trim())
    if (c) ra.add(c[1])
  }
  return [...ra]
}
/** Tách hình khỏi chữ: trả { text, anh[] }. */
function tachAnh(s) {
  const anh = []
  const text = s.replace(RE_IMG, (_, f) => { anh.push(f); return ' ' })
  return { text, anh }
}

// ── nhận diện cấu trúc ───────────────────────────────────────────────────────
const RE_PHAN = /^PHẦN\s+(I{1,3}|IV|[1-4])\b/i
const RE_CAU = /^Câu\s+(\d+)\s*[.:]?\s*/i
const RE_LG = /^(Lời giải|Hướng dẫn giải|Giải)\s*[.:]?$/i
const RE_CAT = /^(PHIẾU TRẢ LỜI|BẢNG ĐÁP ÁN|ĐÁP ÁN|LỜI GIẢI|Lời giải|HƯỚNG DẪN GIẢI)\b/i
const SO_PHAN = { I: 1, II: 2, III: 3, IV: 4, 1: 1, 2: 2, 3: 3, 4: 4 }
const KHUON = { // khuôn Bộ: dạng thức + điểm mỗi câu (CEO 22/09)
  trac_nghiem: { ten: 'Trắc nghiệm nhiều phương án lựa chọn', diem: 0.25 },
  dung_sai: { ten: 'Trắc nghiệm đúng sai', diem: 1 },
  tra_loi_ngan: { ten: 'Trắc nghiệm trả lời ngắn', diem: 0.5 },
}
function dangThucCuaPhan(tieuDe, so) {
  const t = tieuDe.toLowerCase()
  if (/đúng\s*sai/.test(t)) return 'dung_sai'
  if (/trả lời ngắn/.test(t)) return 'tra_loi_ngan'
  if (/nhiều phương án|nhiều lựa chọn/.test(t)) return 'trac_nghiem'
  return [null, 'trac_nghiem', 'dung_sai', 'tra_loi_ngan'][so] ?? null
}

/** Cắt 1 loạt đoạn thành các phần → các câu. Trả [{so, tieu_de, dang_thuc, cau: [{so, dong: string[] (thô)}]}]. */
function catPhan(doan, laBoDe) {
  const phan = []
  let p = null, c = null
  for (const raw of doan) {
    const s = boThe(raw).replace(/\t/g, ' ').trim()
    const mp = RE_PHAN.exec(s)
    if (mp) { p = { so: SO_PHAN[mp[1].toUpperCase()], tieu_de: gon(s), dang_thuc: null, cau: [] }; p.dang_thuc = dangThucCuaPhan(s, p.so); phan.push(p); c = null; continue }
    if (!p) continue
    if (laBoDe && RE_CAT.test(s) && !RE_CAU.test(s)) { c = null; p = null; continue } // "PHIẾU TRẢ LỜI", "Lời giải"… đứng ngoài câu ⇒ hết phần
    const mc = RE_CAU.exec(s)
    if (mc) { c = { so: +mc[1], dong: [raw] }; p.cau.push(c); continue }
    if (c && s) c.dong.push(raw)
  }
  return phan
}

/** Tách stem + 4 phương án từ chữ đã bỏ thẻ. Trả null nếu không thấy đủ A B C D theo thứ tự. */
export function tachPhuongAn(plain) {
  const ms = [...plain.matchAll(/(^|\s)([ABCD])\s*\.\s*/g)].map((m) => ({ chu: m[2], dau: m.index + m[1].length, cuoi: m.index + m[0].length }))
  for (let i = ms.length - 4; i >= 0; i--) {
    if (ms[i].chu === 'A' && ms[i + 1].chu === 'B' && ms[i + 2].chu === 'C' && ms[i + 3].chu === 'D') {
      const cat = [ms[i], ms[i + 1], ms[i + 2], ms[i + 3]]
      return {
        stem: plain.slice(0, cat[0].dau),
        lua_chon: cat.map((x, k) => plain.slice(x.cuoi, k < 3 ? cat[k + 1].dau : plain.length)),
      }
    }
  }
  return null
}

function docCau(c, dangThuc) {
  const cb = []
  // dòng đầu bỏ nhãn "Câu N."
  const dong = c.dong.map((r, i) => (i === 0 ? r.replace(/^((?:\[\[\/?\w+(?::[^\]]*)?\]\])*)\s*Câu\s+\d+\s*[.:]?\s*/i, '$1') : r))
  const iLG = dong.findIndex((r, i) => i > 0 && RE_LG.test(boThe(r).trim()))
  const hoi = iLG >= 0 ? dong.slice(0, iLG) : dong
  const giai = iLG >= 0 ? dong.slice(iLG + 1) : []
  const out = { so: c.so, loai_cau: dangThuc, noi_dung: '', lua_chon: null, dap_an: null, dap_an_nguon: null, menh_de: null, loi_giai: null, anh: [], anh_giai: [], canh_bao: cb }

  const gomGiai = (ds) => {
    const t = tachAnh(ds.map((r) => boThe(r)).join('\n\n'))
    out.anh_giai.push(...t.anh)
    return t.text.split('\n\n').map(gon).filter(Boolean).join('\n\n') || null
  }

  if (dangThuc === 'trac_nghiem') {
    const raw = hoi.join('\n')
    const t = tachAnh(boThe(raw))
    out.anh.push(...t.anh)
    const pa = tachPhuongAn(t.text)
    if (!pa) { cb.push('không tách được 4 phương án A–D'); out.noi_dung = gon(t.text.replace(/\n/g, ' ')) }
    else { out.noi_dung = pa.stem.split('\n').map(gon).filter(Boolean).join('\n'); out.lua_chon = pa.lua_chon.map((x) => gon(x.replace(/\n/g, ' '))) ; if (out.lua_chon.some((x) => !x)) cb.push('có phương án rỗng') }
    const gach = chuGach(raw)
    const lg = gomGiai(giai)
    const chon = lg ? /Chọn\s+([ABCD])\b/.exec(lg)?.[1] ?? null : null
    out.loi_giai = lg
    if (gach.length === 1) { out.dap_an = gach[0]; out.dap_an_nguon = 'gach_chan' }
    else if (gach.length > 1) cb.push(`gạch chân ${gach.length} phương án (${gach.join(',')}) — không rõ đáp án`)
    if (chon) {
      if (!out.dap_an && gach.length === 0) { out.dap_an = chon; out.dap_an_nguon = 'chon_x' }
      else if (out.dap_an && chon !== out.dap_an) cb.push(`ĐÁP ÁN 2 NGUỒN LỆCH: gạch chân ${out.dap_an}, lời giải ghi "Chọn ${chon}"`)
    }
    if (!out.dap_an && !cb.some((x) => x.startsWith('gạch chân'))) cb.push('không có đáp án (không gạch chân, không "Chọn X")')
  } else if (dangThuc === 'dung_sai') {
    const stem = [], md = []
    for (const r of hoi) {
      const s = boThe(r).trim()
      const m = /^([a-d])\s*\)\s*/.exec(s)
      if (m) md.push({ chu: m[1], text: s.slice(m[0].length) })
      else if (md.length) md[md.length - 1].text += '\n' + s
      else stem.push(s)
    }
    const ts = tachAnh(stem.join('\n')); out.anh.push(...ts.anh)
    out.noi_dung = ts.text.split('\n').map(gon).filter(Boolean).join('\n')
    // lời giải: cắt theo "a) Đúng/Sai"
    const lgTheoY = {}; let cur = null; const lgChung = []
    for (const r of giai) {
      const s = boThe(r).trim()
      const m = /^([a-d])\s*\)\s*(Đúng|Sai|Đ|S)\b\s*[.:]?\s*/i.exec(s)
      if (m) { cur = m[1]; lgTheoY[cur] = { dap_an: /^đ/i.test(m[2]) ? 'D' : 'S', dong: [s.slice(m[0].length)] } }
      else if (cur) lgTheoY[cur].dong.push(s)
      else lgChung.push(s)
    }
    out.menh_de = md.map((x) => {
      const t = tachAnh(x.text); out.anh.push(...t.anh)
      const g = lgTheoY[x.chu]
      const tg = g ? tachAnh(g.dong.filter(Boolean).join('\n\n')) : null
      if (tg) out.anh_giai.push(...tg.anh)
      if (!g) cb.push(`mệnh đề ${x.chu}) không thấy "Đúng/Sai" trong lời giải`)
      return { chu: x.chu, noi_dung: gon(t.text.replace(/\n/g, ' ')), dap_an: g?.dap_an ?? null, loi_giai: tg ? tg.text.split('\n\n').map(gon).filter(Boolean).join('\n\n') || null : null }
    })
    if (md.length !== 4) cb.push(`có ${md.length} mệnh đề (khuôn Bộ là 4)`)
    if (lgChung.filter(Boolean).length) out.loi_giai = gomGiai(lgChung.map((x) => x))
  } else { // tra_loi_ngan (và loại lạ: giữ nguyên chữ)
    const t = tachAnh(boThe(hoi.join('\n'))); out.anh.push(...t.anh)
    out.noi_dung = t.text.split('\n').map(gon).filter(Boolean).join('\n')
    out.loi_giai = gomGiai(giai)
    const m = out.loi_giai ? /(?:Đáp án|Đáp số|Trả lời)\s*[:：]\s*\$?([-−–]?[\d.,]+)\$?\s*\.?\s*$/im.exec(out.loi_giai) : null
    if (m) { out.dap_an = m[1].replace(/[−–]/g, '-'); out.dap_an_nguon = 'dong_dap_an' }
    else cb.push('TLN chưa có đáp số máy đọc được — rút từ lời giải / phiếu trả lời (ghi dap_an_nguon)')
  }
  if (!out.noi_dung) cb.push('nội dung rỗng')
  for (const k of ['anh', 'anh_giai']) for (const f of out[k]) if (/\.(wmf|emf)$/i.test(f)) cb.push(`hình ${f} là WMF/EMF (không đổi được sang PNG) — xem bản PDF`)
  return out
}

// ── main ─────────────────────────────────────────────────────────────────────
export async function bocWord(tep, { khoi = null } = {}) {
  const buf = readFileSync(tep)
  const { paragraphs, stats, equations } = await convertDocx(tep)
  const iPhan = paragraphs.map((p, i) => (RE_PHAN.test(boThe(p).trim()) ? i : -1)).filter((i) => i >= 0)
  if (!iPhan.length) throw new Error('Không thấy "PHẦN I/II/III" — không phải đề khuôn Bộ 3 phần')
  // bộ thứ hai bắt đầu ở lần thứ 2 gặp "PHẦN I"
  const soPhan = iPhan.map((i) => SO_PHAN[RE_PHAN.exec(boThe(paragraphs[i]).trim())[1].toUpperCase()])
  const lap = soPhan.indexOf(1, 1) // vị trí (trong iPhan) của PHẦN I lần 2
  const boDe = catPhan(paragraphs.slice(iPhan[0], lap > 0 ? iPhan[lap] : paragraphs.length), true)
  const boGiai = lap > 0 ? catPhan(paragraphs.slice(iPhan[lap]), false) : null
  const chinh = boGiai ?? boDe

  const canhBao = []
  const phan = [], cau = []
  for (const p of chinh) {
    if (!p.dang_thuc) canhBao.push(`Phần ${p.so}: không nhận ra dạng thức từ tiêu đề "${p.tieu_de.slice(0, 60)}"`)
    phan.push({ thu_tu: p.so, ten: KHUON[p.dang_thuc]?.ten ?? p.tieu_de, dang_thuc: p.dang_thuc, diem_moi_cau: KHUON[p.dang_thuc]?.diem ?? null, so_cau: p.cau.length })
    p.cau.forEach((c, k) => {
      const q = docCau(c, p.dang_thuc)
      if (c.so !== k + 1) q.canh_bao.push(`số câu không liên tục: thấy "Câu ${c.so}" ở vị trí ${k + 1}`)
      // nhân chứng: bản ĐỀ của cùng (phần, số câu)
      if (boGiai) {
        const d = boDe.find((x) => x.so === p.so)?.cau.find((x) => x.so === c.so)
        if (!d) q.canh_bao.push('phần ĐỀ không có câu này (chỉ có ở phần LỜI GIẢI)')
        else {
          const hoiGiai = c.dong.slice(0, Math.max(1, c.dong.findIndex((r, i) => i > 0 && RE_LG.test(boThe(r).trim())) >>> 0 || c.dong.length))
          const a = chuan(d.dong.join('')), b = chuan(hoiGiai.join(''))
          if (a !== b) q.canh_bao.push('nội dung câu ở phần ĐỀ ≠ phần LỜI GIẢI — đối chiếu bản gốc')
        }
      }
      cau.push({ phan: p.so, ...q, kho: null, dang: null })
    })
  }
  if (boGiai) for (const p of boDe) for (const c of p.cau) if (!boGiai.find((x) => x.so === p.so)?.cau.some((x) => x.so === c.so)) canhBao.push(`Phần ${p.so} câu ${c.so}: có ở phần ĐỀ nhưng không có ở phần LỜI GIẢI`)
  const eqHong = equations.filter((e) => !e.ok).length
  if (eqHong) canhBao.push(`${eqHong} công thức không đổi được sang LaTeX — tìm "[[EQ-FAILED" trong nội dung`)
  for (const q of cau) if (/\[\[(EQ-FAILED|sym:|#\]\]|ole:|shape|omml)/.test(JSON.stringify(q))) q.canh_bao.push('còn ký hiệu bộ đọc chưa đổi được ([[…]]) trong nội dung')

  return {
    file: basename(tep), sha256: createHash('sha256').update(buf).digest('hex'),
    ten: gon(boThe(paragraphs.find((p) => boThe(p).trim()) ?? basename(tep, extname(tep)))),
    khoi: khoi ? String(khoi) : null, mon: 'Toán', nguon: null, nam: null, thoi_gian_phut: 90, thang_diem: 10,
    co_bo_loi_giai: !!boGiai, phan, cau, canh_bao: canhBao,
    thong_ke_doc: { cong_thuc: equations.length, cong_thuc_hong: eqHong, anh: stats.images },
  }
}

const laCli = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())
if (laCli) {
  const args = process.argv.slice(2)
  const tep = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--ra' && args[args.indexOf(a) - 1] !== '--khoi')
  const ra = args.includes('--ra') ? args[args.indexOf('--ra') + 1] : null
  const khoi = args.includes('--khoi') ? args[args.indexOf('--khoi') + 1] : null
  if (!tep || !ra) { console.error('Dùng: node scripts/kho/de-thi/boc-word.mjs "<file.docx>" --ra <thư mục> [--khoi 12]'); process.exit(2) }
  const de = await bocWord(tep, { khoi })
  mkdirSync(join(ra, 'img'), { recursive: true })
  // chép ảnh PNG/JPG được tham chiếu ra <ra>/img
  const zip = await JSZip.loadAsync(readFileSync(tep))
  const canAnh = new Set(de.cau.flatMap((q) => [...q.anh, ...q.anh_giai]))
  for (const f of canAnh) {
    if (!/\.(png|jpe?g)$/i.test(f)) continue
    const z = zip.file('word/media/' + f)
    if (z) writeFileSync(join(ra, 'img', f), Buffer.from(await z.async('uint8array')))
    else de.canh_bao.push(`không thấy word/media/${f} trong file`)
  }
  writeFileSync(join(ra, 'de.json'), JSON.stringify(de, null, 1), 'utf8')
  // tóm tắt
  console.log(`${de.file} → ${join(ra, 'de.json')}`)
  console.log(`Tên: ${de.ten} · có bộ LỜI GIẢI riêng: ${de.co_bo_loi_giai ? 'có' : 'không'} · công thức ${de.thong_ke_doc.cong_thuc} (hỏng ${de.thong_ke_doc.cong_thuc_hong})`)
  for (const p of de.phan) {
    const cs = de.cau.filter((q) => q.phan === p.thu_tu)
    const coDA = cs.filter((q) => (q.loai_cau === 'dung_sai' ? q.menh_de?.every((m) => m.dap_an) : q.dap_an)).length
    console.log(`  Phần ${p.thu_tu} (${p.dang_thuc}): ${cs.length} câu · có đáp án ${coDA}/${cs.length} · có lời giải ${cs.filter((q) => q.loi_giai || q.menh_de?.some((m) => m.loi_giai)).length} · có hình ${cs.filter((q) => q.anh.length).length}`)
  }
  const cb = de.cau.filter((q) => q.canh_bao.length)
  console.log(`Cảnh báo cấp đề: ${de.canh_bao.length} · câu có cảnh báo: ${cb.length}/${de.cau.length}`)
  for (const x of de.canh_bao) console.log('  ⚠ ' + x)
  for (const q of cb) console.log(`  ⚠ P${q.phan} câu ${q.so}: ${q.canh_bao.join(' | ')}`)
}
