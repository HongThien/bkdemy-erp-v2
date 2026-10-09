// ghép mọi bản nháp của 6 bài ⇒ ghep/<BAI>/draft.md (đúng thứ tự gói nguồn) + ghep/<BAI>/hinh/ + ghep/<BAI>/nguon.json
//   node ghep.mjs            (cả 6 bài)  — câu chuyển bài theo CHUYEN; câu làm trùng giữ bản của nhóm được giao
import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs'
const K = 'C:/Users/WBPC/AppData/Local/Temp/claude/C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2/0b0aaccd-e68b-45b5-96e4-b914b4d1311c/scratchpad/k9b'
const BAI = ['HH00105', 'HH00106', 'HH00107', 'HH00108', 'HH00109', 'HH00110']
// câu chuyển bài (đề xuất của người soạn, Opus đã xem): nguồn → bài đích (nối cuối bài đích)
export const CHUYEN = { 'HH00106:c024': 'HH00108', 'HH00106:c036': 'HH00107', 'HH00106:c037': 'HH00107', 'HH00105:c118': 'HH00107' }
// chuyển sang bài ĐÃ NHẬP DB ⇒ ghi ra ghep/<đích>/noi.md, nhập bằng --noi (nối cuối bài)
export const NOI = { 'HH00105:c119': 'HH00106', 'HH00105:c120': 'HH00106', 'HH00105:c121': 'HH00108', 'HH00107:c076': 'HH00108' }
// sửa máy các lỗi gõ đã soát (nhãn → [tìm, thay])
// câu bỏ (ngoài whitelist 6 bài, không bài nào nhận): nhãn → lý do
export const BO = {
  'HH00105:c094': 'dùng góc nội tiếp (NĐT Ôn TN3) — chưa có bài góc nội tiếp',
  'HH00107:c044': 'trùng c036 (NT CĐ9 TN8 = NĐT Ôn TN4: quạt 90° = πR²/4)',
}
export const SUA = {
  'HH00106:c017': [['$OMperp BC$', '$OM\\perp BC$']],
  // hình đề lộ đáp án ⇒ chỉ gắn lời giải
  'HH00110:c012': [['**hinh:** c012.png', '**hinh_lg:** c012.png']],
  'HH00110:c018': [['**hinh:** c018.png', '**hinh_lg:** c018.png']],
}
const nhom = JSON.parse(readFileSync(`${K}/nhom.json`, 'utf8'))
const giao = {} // `${bai}:${idx}` → tên nhóm
for (const g of nhom) for (const i of g.ds) giao[`${g.bai}:${i}`] = g.ten
for (const [b, a, z] of [['HH00105', 1, 8], ['HH00109', 2, 7]]) for (let i = a; i <= z; i++) giao[`${b}:${i}`] = 'p1'
const goi = JSON.parse(readFileSync(`${K}/nguon/_tat-ca.json`, 'utf8'))
const kq = Object.fromEntries(BAI.map((b) => [b, []]))
const bo = []
for (const bai of BAI) {
  for (const f of readdirSync(K).filter((x) => x.startsWith(`draft_${bai}_`) && x.endsWith('.md'))) {
    const ten = f.slice(`draft_${bai}_`.length, -3)
    const txt = readFileSync(`${K}/${f}`, 'utf8').replace(/\r\n/g, '\n')
    for (let b of txt.split(/\n(?=### )/).filter((x) => x.startsWith('### '))) {
      const nh = b.match(/^### (c(\d+))/)
      if (!nh) { bo.push(`${f}: khối lạ ${b.slice(0, 30)}`); continue }
      const idx = +nh[2]
      if (giao[`${bai}:${idx}`] !== ten) { bo.push(`${bai} ${nh[1]} ở ${f} (giao cho ${giao[`${bai}:${idx}`]}) — bỏ bản thừa`); continue }
      if (BO[`${bai}:${nh[1]}`]) { bo.push(`${bai} ${nh[1]} BỎ: ${BO[`${bai}:${nh[1]}`]}`); continue }
      for (const [tim, thay] of SUA[`${bai}:${nh[1]}`] || []) { if (!b.includes(tim)) throw new Error(`SUA ${bai}:${nh[1]} không thấy ${tim}`); b = b.split(tim).join(thay) }
      const noi = !!NOI[`${bai}:${nh[1]}`]
      const dich = NOI[`${bai}:${nh[1]}`] || CHUYEN[`${bai}:${nh[1]}`] || bai
      const nhanMoi = dich === bai ? nh[1] : `x${bai.slice(-3)}${nh[1]}`
      const nguon = goi[bai][idx - 1].ma
      kq[dich].push({ noi, thu: dich === bai ? idx : 10000 + BAI.indexOf(bai) * 1000 + idx, nhanCu: nh[1], nhanMoi, bai, ten, b, nguon })
    }
  }
}
for (const bai of BAI) {
  const out = `${K}/ghep/${bai}`
  if (existsSync(out)) rmSync(out, { recursive: true })
  mkdirSync(`${out}/hinh`, { recursive: true })
  const ds = kq[bai].sort((a, b) => a.thu - b.thu)
  const blocks = [], noiBlocks = [], map = []
  for (const c of ds) {
    let b = c.b.replace(/^### c\d+ → HH\d+/, `### ${c.nhanMoi} → ${bai}`)
    for (const k of ['hinh', 'hinh_lg']) {
      const m = b.match(new RegExp('\\*\\*' + k + ':\\*\\*\\s*(\\S+)'))
      if (!m) continue
      const src = `${K}/hinh_${c.bai}_${c.ten}/${m[1]}`
      const moi = `${c.nhanMoi}${k === 'hinh_lg' ? '-lg' : ''}.png`
      if (!existsSync(src)) { console.log(`⚠ ${bai} ${c.nhanMoi}: thiếu file ${src}`); continue }
      copyFileSync(src, `${out}/hinh/${moi}`)
      b = b.replace(m[0], `**${k}:** ${moi}`)
    }
    ;(c.noi ? noiBlocks : blocks).push(b.trim())
    map.push({ nhan: c.nhanMoi, nguon: c.nguon, tu: c.bai === bai ? null : `${c.bai} ${c.nhanCu}` })
  }
  writeFileSync(`${out}/draft.md`, blocks.join('\n\n') + '\n')
  if (noiBlocks.length) writeFileSync(`${out}/noi.md`, noiBlocks.join('\n\n') + '\n')
  writeFileSync(`${out}/nguon.json`, JSON.stringify(map, null, 1))
  const can = goi[bai].length - [...Object.keys(CHUYEN), ...Object.keys(NOI), ...Object.keys(BO)].filter((k) => k.startsWith(bai)).length
  const coRieng = ds.filter((c) => c.bai === bai).length
  console.log(`${bai}: ${ds.length} câu (${coRieng}/${can} của bài${ds.length > coRieng ? ` + ${ds.length - coRieng} chuyển đến` : ''})`)
}
for (const x of bo) console.log('· ' + x)
