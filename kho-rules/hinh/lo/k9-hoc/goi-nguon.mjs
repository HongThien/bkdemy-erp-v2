// Phân bài toán của 3 tài liệu vào 6 bài Hình 9 + dựng gói nguồn nguon/<ma_bai>.md (thứ tự = thứ tự sẽ nhập).
// Nguyên tắc xếp: bài toán vào bài HỌC SỚM NHẤT có đủ kiến thức để giải (luật kiến thức theo thứ tự bài); trùng nhau thì giữ bản NĐT.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
const K = 'C:/Users/WBPC/AppData/Local/Temp/claude/C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2/0b0aaccd-e68b-45b5-96e4-b914b4d1311c/scratchpad'
const ndt = JSON.parse(readFileSync(`${K}/k9b/ndt.json`, 'utf8')).filter((x) => !x.laDang)
const phl = JSON.parse(readFileSync(`${K}/k9b/phl.json`, 'utf8'))
const ntLines = readFileSync(`${K}/k9dt/nt/nt.txt`, 'utf8').split('\n')

// ── NĐT ──
const BO_NDT = new Set(['B1 TL9', 'B2 TL7', 'B2 TL12', 'B5 TL6', 'B6 TL11', 'B6 TL12', 'B6 TL13']) // trùng trong chính sách
const ndtBai = (id) => {
  const [b, k] = id.split(' ')
  const so = +(k.match(/\d+$/) || [0])[0]
  const has = (s) => s.split(',').includes(k)
  if (b === 'B1') return id === 'B1 TL21' ? 'HH00108' : 'HH00105'
  if (b === 'B2') return 'HH00105'
  if (b === 'B3') {
    if (k === 'D1') return 'HH00106'
    if (id.startsWith('B3 D1')) return 'HH00106'
    if (id.startsWith('B3 D')) return 'HH00107'
    if (has('TL1,TL5,TL11,TL18,TN1,TN2,TN6,TN7,TN8,TN9,TN15,TN16,TN17')) return 'HH00106'
    if (k === 'TN18') return 'HH00109'
    return 'HH00107'
  }
  if (b === 'B4') {
    if (id.startsWith('B4 D4')) return 'HH00109'
    if (id.startsWith('B4 D')) return 'HH00108'
    if (has('TL3,TL4,TL9,TL10,TL11,TL12,TL17,TL20,TL23,TL24,TN12')) return 'HH00109'
    return 'HH00108'
  }
  if (b === 'B5') return 'HH00110'
  if (b === 'B6') {
    const m = {
      TL1: 'HH00107', TL2: 'HH00107', TL3: 'HH00110', TL4: 'HH00109', TL5: 'HH00110', TL6: 'HH00105', TL7: 'HH00106', TL8: 'HH00107', TL9: 'HH00107', TL10: 'HH00107',
      TL14: 'HH00109', TL15: 'HH00110', TL16: 'HH00110', TL17: 'HH00109', TL18: 'HH00110', TL19: 'HH00110', TL20: 'HH00109', TL21: 'HH00110', TL22: 'HH00110',
      TN1: 'HH00105', TN2: 'HH00105', TN3: 'HH00105', TN4: 'HH00107', TN5: 'HH00107', TN6: 'HH00106', TN7: 'HH00107', TN8: 'HH00110', TN9: 'HH00108', TN10: 'HH00110',
      TN11: 'HH00108', TN12: 'HH00105', TN13: 'HH00109', TN14: 'HH00106', TN15: 'HH00107', TN16: 'HH00105', TN17: 'HH00105', TN18: 'HH00109', TN19: 'HH00106',
      TN20: 'HH00106', TN21: 'HH00110', TN22: 'HH00106', TN23: 'HH00106',
    }
    return m[k]
  }
}
// ── Nguyễn Trãi (nt.txt: dòng LaTeX đọc từ Word; ảnh ở nt-media/word/media) ──
const ntKhoi = (from, to) => {
  const out = []; let cur = null, khu = ''
  for (let i = from; i <= to && i < ntLines.length; i++) {
    const l = ntLines[i].replace(/^\[\d+\]\s?/, '')
    if (/CÂU HỎI TRẮC NGHIỆM/.test(l)) { khu = 'TN'; cur = null; continue }
    if (/BÀI TẬP TỰ LUẬN/.test(l)) { khu = 'TL'; cur = null; continue }
    if (/TOÁN LIÊN HỆ THỰC TẾ/.test(l)) { khu = 'TT'; cur = null; continue }
    if (/mau:7030A0/.test(l)) { khu = ''; cur = null; continue }
    const m = l.match(/^(?:\[\[img:[^\]]+\]\])?\[\[b\]\](?:\[\[img:[^\]]+\]\])?(Bài|Câu)\s*(\d+)\s*[:.]/)
    if (m && khu) { cur = { k: `${khu}${m[2]}`, lines: [l] }; out.push(cur); continue }
    if (cur && l.trim()) cur.lines.push(l)
  }
  return out
}
const nt = [
  ...ntKhoi(1180, 1439).map((x) => ({ ...x, cd: 'CĐ7' })),
  ...ntKhoi(1440, 1569).map((x) => ({ ...x, cd: 'CĐ8' })),
  ...ntKhoi(1570, 1741).map((x) => ({ ...x, cd: 'CĐ9' })),
]
const NT_BAI = {
  'CĐ7 TN1': 'HH00105', 'CĐ7 TN2': 'HH00105', 'CĐ7 TN3': 'HH00105', 'CĐ7 TN7': 'HH00105', 'CĐ7 TN4': 'HH00110', 'CĐ7 TN5': 'HH00110', 'CĐ7 TN6': 'HH00110',
  'CĐ7 TN8': 'HH00108', 'CĐ7 TN9': 'HH00109',
  'CĐ7 TL1': 'HH00105', 'CĐ7 TL2': 'HH00105', 'CĐ7 TL3': 'HH00105', 'CĐ7 TL4': 'HH00105', 'CĐ7 TL5': 'HH00105', 'CĐ7 TL6': 'HH00105', 'CĐ7 TL19': 'HH00105',
  'CĐ7 TL8': 'HH00108', 'CĐ7 TL9': 'HH00108', 'CĐ7 TL10': 'HH00108', 'CĐ7 TL11': 'HH00108', 'CĐ7 TL13': 'HH00108',
  'CĐ7 TL12': 'HH00109', 'CĐ7 TL14': 'HH00109', 'CĐ7 TL15': 'HH00109', 'CĐ7 TL16': 'HH00109', 'CĐ7 TL17': 'HH00109', 'CĐ7 TL18': 'HH00109',
  'CĐ8 TN1': 'HH00105', 'CĐ8 TN2': 'HH00105', 'CĐ8 TN3': 'HH00105', 'CĐ8 TN8': 'HH00105', 'CĐ8 TN9': 'HH00105', 'CĐ8 TL2': 'HH00105', 'CĐ8 TL1': 'HH00109',
  'CĐ9 TN1': 'HH00106', 'CĐ9 TN2': 'HH00106', 'CĐ9 TN4': 'HH00106', 'CĐ9 TN3': 'HH00107', 'CĐ9 TN5': 'HH00107', 'CĐ9 TN6': 'HH00107', 'CĐ9 TN7': 'HH00107',
  'CĐ9 TN8': 'HH00107', 'CĐ9 TN9': 'HH00107', 'CĐ9 TL1': 'HH00107', 'CĐ9 TL2': 'HH00107', 'CĐ9 TL3': 'HH00107', 'CĐ9 TL4': 'HH00107', 'CĐ9 TL5': 'HH00106',
  'CĐ9 TT1': 'HH00106', 'CĐ9 TT4': 'HH00106', 'CĐ9 TT9': 'HH00106', 'CĐ9 TT2': 'HH00107', 'CĐ9 TT3': 'HH00107', 'CĐ9 TT5': 'HH00107', 'CĐ9 TT6': 'HH00107',
  'CĐ9 TT7': 'HH00107', 'CĐ9 TT8': 'HH00107', 'CĐ9 TT10': 'HH00107', 'CĐ9 TT11': 'HH00107',
} // CĐ7 TL7 = NĐT B4 TL7 (bỏ); CĐ8 còn lại là góc nội tiếp — ngoài 6 bài
// ── PHL (không trùng NĐT; ≥0.7 coi là trùng) ──
const PHL_BAI = {
  219: 'HH00105', 220: 'HH00105', 221: 'HH00105', 227: 'HH00105', 236: 'HH00105', 239: 'HH00105', 240: 'HH00105', 287: 'HH00105',
  231: 'HH00106', 232: 'HH00106', 233: 'HH00106', 234: 'HH00106', 241: 'HH00106', 242: 'HH00106',
  237: 'HH00107', 243: 'HH00107', 244: 'HH00107', 246: 'HH00107', 247: 'HH00107', 248: 'HH00107', 249: 'HH00107', 251: 'HH00107', 252: 'HH00107', 253: 'HH00107',
  254: 'HH00107', 255: 'HH00107', 256: 'HH00107', 260: 'HH00107', 261: 'HH00107', 262: 'HH00107', 263: 'HH00107', 265: 'HH00107', 267: 'HH00107', 268: 'HH00107',
  269: 'HH00107', 270: 'HH00107', 272: 'HH00107',
  258: 'HH00108', 273: 'HH00108', 279: 'HH00108', 286: 'HH00108', 288: 'HH00108', 290: 'HH00108',
  277: 'HH00109', 280: 'HH00109', 281: 'HH00109', 282: 'HH00109', 283: 'HH00109', 284: 'HH00109',
  235: 'HH00110', 257: 'HH00110', 259: 'HH00110', 266: 'HH00110', 289: 'HH00110', 294: 'HH00110', 295: 'HH00110', 296: 'HH00110',
}
const TEN = { HH00105: 'Đường tròn', HH00106: 'Độ dài cung tròn và các bài toán liên quan', HH00107: 'Diện tích quạt tròn và các bài toán liên quan', HH00108: 'Vị trí tương đối của đường thẳng và đường tròn', HH00109: 'Bài toán về hai tiếp tuyến cắt nhau', HH00110: 'Vị trí tương đối của hai đường tròn' }
const goi = Object.fromEntries(Object.keys(TEN).map((k) => [k, []]))
for (const x of ndt) { if (BO_NDT.has(x.id)) continue; const b = ndtBai(x.id); if (!b) { console.log('chưa xếp', x.id); continue } goi[b].push({ ma: `NDT ${x.id}`, nguon: `DT.pdf trang ${x.trang}${x.trang2 ? '–' + x.trang2 : ''} (ảnh: k9b/trang/ndt-${String(x.trang).padStart(2, '0')}.png${x.trang2 ? ', ndt-' + String(x.trang2).padStart(2, '0') + '.png' : ''})`, text: x.text }) }
for (const x of nt) { const key = `${x.cd} ${x.k}`; const b = NT_BAI[key]; if (!b) continue; const imgs = [...x.lines.join(' ').matchAll(/\[\[img:([^\]]+)\]\]/g)].map((m) => m[1]); goi[b].push({ ma: `NT ${key}`, nguon: `Nguyễn Trãi (Word) ${x.cd}${imgs.length ? ' · ảnh: k9b/nt-media/word/media/' + imgs.join(', ') : ''} · công thức hỏng [[EQ-FAILED]] ⇒ xem DT2.pdf (Read pdf, trang ~${x.cd === 'CĐ7' ? '1–8' : x.cd === 'CĐ8' ? '9–13' : '14–19'})`, text: x.lines.join('\n') }) }
for (const x of phl) { const so = +x.id.split(' ')[1]; const b = PHL_BAI[so]; if (!b) continue; goi[b].push({ ma: x.id, nguon: 'Phạm Hoàng Long pdf (ảnh: k9b/trang/phl-NN.png — tìm "Câu ' + so + '")', text: x.text }) }
mkdirSync(`${K}/k9b/nguon`, { recursive: true })
for (const [ma, ds] of Object.entries(goi)) {
  writeFileSync(`${K}/k9b/nguon/${ma}.md`, `# ${ma} — ${TEN[ma]} · ${ds.length} bài toán (thứ tự = thứ tự nhập)\n\n` + ds.map((d, i) => `## [${i + 1}] ${d.ma}\nNguồn: ${d.nguon}\n\n${d.text}\n`).join('\n'))
  console.log(ma, ds.length, '·', ['NDT', 'NT', 'PHL'].map((s) => s + ' ' + ds.filter((d) => d.ma.startsWith(s)).length).join(' '))
}
writeFileSync(`${K}/k9b/nguon/_tat-ca.json`, JSON.stringify(goi, null, 1))
console.log('tổng', Object.values(goi).reduce((a, b) => a + b.length, 0))
