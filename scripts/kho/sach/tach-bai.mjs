// ============================================================================
// tach-bai.mjs — TÁCH BÀI từ bản đọc sách (goc.txt của mathtype-thu/doc-docx.mjs) thành danh sách bài có DANH TÍNH.
// (kho-rules/README.md §4 việc #2)
//
//   node scripts/kho/sach/tach-bai.mjs <goc.txt> --sach "Toán arc 4 Q1" [--ra bai.json]
//
// Danh tính một bài = (sách, khu, số bài, ý) — KHOÁ TỰ NHIÊN theo đánh số của sách, không theo vị trí (CLAUDE.md §2).
//   khu:  "VD 6" ví dụ chuyên đề 6 · "LT 6" luyện tập chuyên đề 6 · "PTL 3" phiếu tự luyện 3 · "PCT 10 I" / "PCT 10 II" phiếu cuối tuần
//   ma:   "LT 6.6" · "LT 6.6a" (ý) · "PTL 3.1" · "PCT 10 I.9" · "VD 14.1"
// Mỗi bài: { ma, khu, so, y|null, de_chung (câu dẫn của bài nhiều ý), noi_dung (đề đủ để đứng một mình), anh[], loi_giai_sach (chỉ VD) }.
// Bài nhiều ý ⇒ ra 1 bản ghi CẢ BÀI (y=null) + mỗi ý 1 bản ghi (noi_dung = câu dẫn + ý). Tách hay không là việc của người gán
// (luật tách ý: Đại chỉ tách ý độc lập) — script chỉ đưa đủ cả hai để chọn.
// Không đoán: dòng nào không xếp được vào bài nào thì đếm vào `bo_qua` và in ra.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const bo = (s) => s.replace(/\[\[\/?b\]\]/g, '')
// ô trống ghi đáp số của phiếu ("\t\t..............." cuối dòng) không phải đề ⇒ bỏ; chỗ trống GIỮA câu ("6 thùng:… kg") giữ "…"
const sachDe = (s) => bo(s).replace(/\[\[img:[^\]]+\]\]/g, '').replace(/_{3,}/g, '').replace(/\s*\t\s*\.{3,}\s*$/, '').replace(/\.{5,}/g, '…').replace(/ {2,}/g, ' ').trim()
const sach = (s) => s.replace(/\[\[img:[^\]]+\]\]/g, '').replace(/_{3,}/g, '').replace(/\.{5,}/g, '…').replace(/[ \t]+/g, ' ').trim()

/** Tách một khối đề thành câu dẫn + các ý a) b) c)… (ý có thể nằm nhiều ý trên một dòng, cách nhau bằng tab). */
export function tachY(dong) {
  const dan = [], y = []
  for (const d of dong) {
    const phan = d.split(/\t+(?=[a-h]\)\s)/)
    for (const p of phan) {
      const m = p.match(/^([a-h])\)\s*(.*)$/s)
      if (m) y.push({ nhan: m[1], noi_dung: m[2].trim() })
      else if (y.length) y[y.length - 1].noi_dung += '\n' + p.trim()
      else dan.push(p.trim())
    }
  }
  return { dan: dan.filter(Boolean).join('\n'), y }
}

export function tachBai(txt, tenSach) {
  const dong = txt.split(/\r?\n/).map((l) => l.replace(/^\[\d+\]\s?/, ''))
  const bai = [], boQua = []
  let khu = null, cd = null, cur = null, cheDo = 'ngoai' // ngoai | ly_thuyet | de | giai
  const dong_bai = () => {
    if (!cur) return
    bai.push(cur); cur = null
  }
  for (let i = 0; i < dong.length; i++) {
    const raw = dong[i], t = bo(raw).trim()
    let m
    if ((m = t.match(/^CHUYÊN ĐỀ\s*(\d+)/))) { dong_bai(); cd = Number(m[1]); khu = null; cheDo = 'ly_thuyet'; continue }
    if (/^VÍ DỤ$/.test(t)) { dong_bai(); khu = `VD ${cd}`; cheDo = 'ngoai'; continue }
    if (/^LUYỆN TẬP$/.test(t)) { dong_bai(); khu = `LT ${cd}`; cheDo = 'ngoai'; continue }
    if ((m = t.match(/^PHIẾU TỰ LUYỆN\s*(\d+)/))) { dong_bai(); khu = `PTL ${m[1]}`; cd = null; cheDo = 'ngoai'; continue }
    if ((m = t.match(/^PHIẾU CUỐI TUẦN\s*(\d+)/))) { dong_bai(); khu = `PCT ${Number(m[1])}`; cd = null; cheDo = 'ngoai'; continue }
    if (khu?.startsWith('PCT') && (m = t.match(/^PHẦN\s*(II|I)\b/))) { dong_bai(); khu = khu.replace(/ (I|II)$/, '') + ' ' + m[1]; cheDo = 'ngoai'; continue }
    if (/^(KIẾN THỨC|TÓM TẮT LÝ THUYẾT)/.test(t)) { dong_bai(); cheDo = 'ly_thuyet'; continue }
    if (cheDo === 'ly_thuyet') continue
    if (/^(ĐỀ BÀI|ĐÁP SỐ|Học sinh trình bày)/.test(t)) continue
    if (/^Bài (làm|giải):?$/.test(t)) { if (cur) cur._giai = []; cheDo = 'giai'; continue }

    // nhãn bài: "6.6." / "3. 2." / "20.17. (*)" (CĐ) · "1." (phiếu tự luyện) · "Bài 9." (phiếu cuối tuần)
    const nhan = raw.match(/^\[\[b\]\]\s*([^[]*?)\s*\[\[\/b\]\]\s*(.*)$/)
    if (nhan && khu) {
      const n = nhan[1].replace(/\(\*+\)/, '').trim()
      let so = null
      if ((khu.startsWith('VD') || khu.startsWith('LT')) && (m = n.match(/^(\d+)\.\s*(\d+)\.?$/)) && Number(m[1]) === cd) so = `${m[1]}.${m[2]}`
      else if (khu.startsWith('PTL') && (m = n.match(/^(\d+)\.$/))) so = `${khu.split(' ')[1]}.${m[1]}`
      else if (khu.startsWith('PCT') && (m = n.match(/^Bài\s*(\d+)\.$/))) so = `${m[1]}`
      if (so) {
        dong_bai()
        const sao = /\(\*/.test(nhan[1] + nhan[2]) ? true : false
        cur = { khu, so, sao, _de: [], _giai: null, anh: [], _dong: i + 1 }
        cheDo = 'de'
        const sau = nhan[2].replace(/^\(\*+\)\s*/, '')
        if (sachDe(sau)) cur._de.push(sachDe(sau))
        continue
      }
    }
    // nhãn lẫn trong chữ thường / cả dòng in đậm (sách gõ lệch, vd "6.1. Điền tiếp…") — chỉ nhận khi đúng số chuyên đề đang đọc
    if ((khu?.startsWith('VD') || khu?.startsWith('LT')) && (m = t.match(/^(\d+)\.\s*(\d+)\.\s+(.*)$/)) && Number(m[1]) === cd) {
      dong_bai(); cur = { khu, so: `${m[1]}.${m[2]}`, sao: /\(\*/.test(m[3]), _de: [m[3].replace(/^\(\*+\)\s*/, '')], _giai: null, anh: [], _dong: i + 1 }; cheDo = 'de'; continue
    }
    if (!cur) { if (t && khu) boQua.push({ dong: i + 1, text: t.slice(0, 80) }); continue }
    for (const a of raw.matchAll(/\[\[img:([^\]]+)\]\]/g)) cur.anh.push(a[1])
    const s = sach(bo(raw))
    if (!s) continue
    if (cheDo === 'giai') cur._giai.push(s)
    else cur._de.push(sachDe(raw))
  }
  dong_bai()

  // dựng bản ghi: cả bài + từng ý
  const ra = []
  for (const b of bai) {
    const { dan, y } = tachY(b._de.filter(Boolean))
    const ma = b.khu.startsWith('PCT') ? `${b.khu}.${b.so}` : `${b.khu.split(' ')[0]} ${b.so}`
    const loi = b._giai ? b._giai.join('\n') : null
    const caBai = [dan, ...y.map((x) => `${x.nhan}) ${x.noi_dung}`)].filter(Boolean).join('\n')
    // nhãn ý lặp trong một bài (vd LT 11.3 có hai lượt a b c — sách in thiếu nhãn "11.4.") ⇒ KHÔNG đoán ý nào thuộc bài nào:
    // giữ bản ghi cả bài + cảnh báo, không đẻ bản ghi ý (mã "LT 11.3a" sẽ trùng hai câu khác nhau)
    const lap = y.length !== new Set(y.map((x) => x.nhan)).size
    ra.push({ sach: tenSach, ma, khu: b.khu, so: b.so, y: null, sao: b.sao, so_y: y.length, noi_dung: caBai, anh: b.anh, loi_giai_sach: loi, dong_goc: b._dong,
      ...(lap ? { canh_bao: 'nhãn ý lặp lại trong bài — sách có thể in thiếu nhãn bài kế tiếp; người tách tay' } : {}) })
    if (lap) continue
    for (const x of y) ra.push({ sach: tenSach, ma: `${ma}${x.nhan}`, khu: b.khu, so: b.so, y: x.nhan, sao: b.sao, de_chung: dan || null,
      noi_dung: [dan, x.noi_dung].filter(Boolean).join('\n'), anh: b.anh, loi_giai_sach: null, dong_goc: b._dong })
  }
  return { bai: ra, bo_qua: boQua }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const a = process.argv.slice(2)
  const tep = a[0], iS = a.indexOf('--sach'), iR = a.indexOf('--ra')
  if (!tep || iS < 0) { console.error('Dùng: node scripts/kho/sach/tach-bai.mjs <goc.txt> --sach "<tên sách>" [--ra bai.json]'); process.exit(2) }
  const { bai, bo_qua } = tachBai(readFileSync(tep, 'utf8'), a[iS + 1])
  const ca = bai.filter((b) => b.y === null)
  const dem = {}
  for (const b of ca) { const k = b.khu.replace(/ \d+( I+)?$/, (s) => (b.khu.startsWith('PCT') ? ' ' + s.trim().split(' ').slice(-1)[0] : '')); dem[k] = (dem[k] || 0) + 1 }
  console.log(`Bài (cả bài): ${ca.length} · bản ghi ý: ${bai.length - ca.length} · bài có ảnh: ${ca.filter((b) => b.anh.length).length} · VD có lời giải sách: ${ca.filter((b) => b.loi_giai_sach).length}`)
  console.log('Theo khu:', JSON.stringify(dem))
  const trungMa = Object.entries(bai.reduce((o, b) => ((o[b.ma] = (o[b.ma] || 0) + 1), o), {})).filter(([, n]) => n > 1)
  console.log(`Mã trùng (${trungMa.length}):`, trungMa.map(([k, n]) => `${k}×${n}`).join(', '))
  const cb = ca.filter((b) => b.canh_bao); console.log(`Bài cần người xem (${cb.length}):`); for (const b of cb) console.log(`  ${b.ma}: ${b.canh_bao}`)
  console.log(`Dòng không xếp vào bài nào (${bo_qua.length}):`); for (const x of bo_qua.slice(0, 40)) console.log(`  [${x.dong}] ${x.text}`)
  if (iR > 0) { writeFileSync(a[iR + 1], JSON.stringify(bai, null, 1)); console.log('→', a[iR + 1]) }
}
