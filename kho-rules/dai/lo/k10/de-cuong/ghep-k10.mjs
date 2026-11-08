// ghep-k10.mjs — ghép các tệp `<MA>.p<k>.soan.md` (mỗi trạm gõ + giải MỘT khúc đề cương K10, đã soát) thành MỘT `<MA>.soan.md`,
// chạy cổng `dung-de-tu-soan.mjs --khoi 10` (dựng <LV>/de.json) và gom dòng **Chưa chắc:** vào `<MA>.chua-chac.md`.
// Khác K8/K9 (`ghep-chung.mjs`): K10 không có khung gõ sẵn — trạm tự gõ câu từ ảnh, nên các tệp tự khai `## PHẦN n | tên | dạng thức`;
// cùng số PHẦN ở nhiều tệp thì nối câu theo thứ tự tệp, tên + dạng thức phải KHỚP.
//
//   node kho-rules/dai/lo/k10/de-cuong/ghep-k10.mjs <MA> <thư mục làm việc> <số tệp> "<tên đề>" "<nguồn>" [--chi-kiem]
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc>            # chạy thử (ROLLBACK)
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc> --ghi
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const a = process.argv.slice(2)
const [MA, LV, SO, TEN, NGUON] = a.filter((x) => !x.startsWith('--'))
if (!MA || !LV || !SO || !TEN || !NGUON) { console.error('Dùng: node …/ghep-k10.mjs <MA> <thư mục làm việc> <số tệp> "<tên đề>" "<nguồn>" [--chi-kiem]'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '../../../../..')
const FULL = join(HERE, `${MA}.soan.md`)

const phan = new Map() // thu_tu → { ten, dang, cau: [] }
const nhanDa = new Set()
for (let n = 1; n <= +SO; n++) {
  const md = readFileSync(join(HERE, `${MA}.p${n}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
  const iGc = md.search(/^## GHI CHÚ/m)
  const than = iGc >= 0 ? md.slice(0, iGc) : md
  for (const kp of than.split(/^(?=## PHẦN )/m).slice(1)) {
    const mh = kp.match(/^## PHẦN (\d+) \| (.+?) \| (trac_nghiem|dung_sai|tu_luan|tra_loi_ngan)\s*$/m)
    if (!mh) throw new Error(`p${n}: tiêu đề PHẦN sai khuôn: ${kp.split('\n')[0]}`)
    const t = +mh[1]
    if (!phan.has(t)) phan.set(t, { ten: mh[2].trim(), dang: mh[3], cau: [] })
    const P = phan.get(t)
    if (P.ten !== mh[2].trim() || P.dang !== mh[3]) throw new Error(`p${n}: PHẦN ${t} lệch tên / dạng thức so với tệp trước («${P.ten}» ${P.dang} ≠ «${mh[2].trim()}» ${mh[3]})`)
    for (const kc of kp.split(/^(?=### )/m).slice(1)) {
      const nhan = `${t}|${kc.match(/^### (.+?) \| /)[1]}`
      if (nhanDa.has(nhan)) throw new Error(`trùng nhãn ${nhan} (p${n})`)
      nhanDa.add(nhan)
      P.cau.push(kc.replace(/\n## PHẦN [\s\S]*$/, '').trimEnd())
    }
  }
}
let md = `# ĐỀ | ${TEN}\nnam: 2026\nbo_sach: KNTT\nkieu: de_cuong\n`
for (const [t, P] of [...phan.entries()].sort((x, y) => x[0] - y[0])) md += `\n## PHẦN ${t} | ${P.ten} | ${P.dang}\n` + P.cau.map((c) => `\n${c}\n`).join('')
writeFileSync(FULL, md)

// K10 không qua boc-pdf ⇒ tự dựng de.boc.json tối thiểu (tên tệp + sha256 của goc.pdf) cho dung-de-tu-soan
if (!existsSync(join(LV, 'de.boc.json')) && !existsSync(join(LV, 'de.json'))) {
  const pdf = readFileSync(join(LV, 'goc.pdf'))
  writeFileSync(join(LV, 'de.boc.json'), JSON.stringify({ file: `${MA}.pdf`, sha256: createHash('sha256').update(pdf).digest('hex') }))
}
const r = spawnSync('node', ['scripts/kho/de-thi/dung-de-tu-soan.mjs', FULL, '--lam-viec', LV, '--khoi', '10', ...(a.includes('--chi-kiem') ? ['--chi-kiem'] : [])], { cwd: REPO, encoding: 'utf8' })
console.log(((r.stdout ?? '') + (r.stderr ?? '')).split('\n').filter((l) => !/No character metrics/.test(l)).join('\n').trim())
if (r.status !== 0) process.exit(1)
if (a.includes('--chi-kiem')) process.exit(0)

const fDe = join(LV, 'de.json')
const de = JSON.parse(readFileSync(fDe, 'utf8'))
de.nguon = NGUON
writeFileSync(fDe, JSON.stringify(de, null, 1))

const dong = [`# ${TEN} — CÂU CHƯA CHẮC / ĐỀ SAI cần CEO xem`, '',
  '> Gom từ các dòng `**Chưa chắc:**` của bản soạn đã qua soát. Mỗi câu đã có lời giải theo cách hiểu hợp lí nhất; cờ chỉ nói rằng ĐỀ CƯƠNG có chỗ cần người quyết.',
  '> Trên ERP: Kho đề thi › Đề cương › mở đề › câu có cảnh báo "CHƯA CHẮC".', '']
let nCc = 0
for (const q of de.cau) {
  const cc = q.canh_bao.filter((x) => x.startsWith('CHƯA CHẮC — ')).map((x) => x.slice(12))
  if (!cc.length) continue
  nCc++
  dong.push(`## P${q.phan} ${q.nhan}`, '', ...cc.map((c) => `- ${c}`), '')
}
dong.splice(4, 0, `> **${nCc} câu** còn cờ.`)
writeFileSync(join(HERE, `${MA}.chua-chac.md`), dong.join('\n'))
const dem = (f) => de.cau.filter(f).length
console.log(`✔ ${fDe} — ${de.cau.length} câu: ${dem((q) => q.loai_cau === 'trac_nghiem')} TN · ${dem((q) => q.loai_cau === 'dung_sai')} Đ/S · ${dem((q) => q.loai_cau === 'tra_loi_ngan')} TLN · ${dem((q) => q.loai_cau === 'tu_luan')} tự luận · HGT ${dem((q) => q.kho === 'hgt')} · hình đề ${dem((q) => q.anh.length)} · hình giải ${dem((q) => q.anh_giai.length)} · chưa chắc ${nCc} · kieu ${de.kieu}`)
