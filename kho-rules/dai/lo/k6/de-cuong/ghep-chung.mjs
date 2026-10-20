// ghep-chung.mjs — ghép N tệp soạn `<MA>.p<k>.soan.md` (đã soát) thành MỘT `<MA>.soan.md`, chạy cổng `--khoi 8`, dựng de.json đầy đủ,
// và gom các dòng **Chưa chắc:** vào `<MA>.chua-chac.md`. Dùng cho đề cương K6 gõ lại từ PDF (TC · CBQ · NQ · NTH · GV2-GKI-2026, 20/10).
//
//   node kho-rules/dai/lo/k6/de-cuong/ghep-chung.mjs <MA> <thư mục làm việc> <số phần>
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc>            # chạy thử (ROLLBACK)
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc> --ghi
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const [MA, LV, SO] = process.argv.slice(2)
if (!MA || !LV || !SO) { console.error('Dùng: node …/ghep-chung.mjs <MA> <thư mục làm việc> <số phần>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '../../../../..')
const FULL = join(HERE, `${MA}.soan.md`)
const fBoc = existsSync(join(LV, 'de.boc.json')) ? join(LV, 'de.boc.json') : join(LV, 'de.json')
const khung = JSON.parse(readFileSync(fBoc, 'utf8'))

const khoi = new Map()
for (let n = 1; n <= +SO; n++) {
  const md = readFileSync(join(HERE, `${MA}.p${n}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
  const iGc = md.search(/^## GHI CHÚ/m)
  const than = iGc >= 0 ? md.slice(0, iGc) : md
  for (const kc of than.split(/^(?=### )/m).slice(1)) {
    const nhan = kc.match(/^### (.+?) \| /)[1]
    if (khoi.has(nhan)) throw new Error('trùng ' + nhan + ' (p' + n + ')')
    khoi.set(nhan, kc.replace(/\n## PHẦN [\s\S]*$/, '').trimEnd())
  }
}
const thieu = khung.cau.filter((q) => !khoi.has(q.nhan)).map((q) => q.nhan)
if (thieu.length || khoi.size !== khung.cau.length) throw new Error(`thiếu / thừa câu: thiếu ${thieu.join(' ')} · có ${khoi.size}/${khung.cau.length}`)

let md = `# ĐỀ | ${khung.ten}\nnam: ${khung.nam}\nbo_sach: KNTT\nkieu: de_cuong\n`
for (const p of khung.phan) {
  md += `\n## PHẦN ${p.thu_tu} | ${p.ten} | tu_luan\n`
  for (const q of khung.cau.filter((c) => c.phan === p.thu_tu)) md += `\n${khoi.get(q.nhan)}\n`
}
writeFileSync(FULL, md)

const r = spawnSync('node', ['scripts/kho/de-thi/dung-de-tu-soan.mjs', FULL, '--lam-viec', LV, '--khoi', '6'], { cwd: REPO, encoding: 'utf8' })
console.log(((r.stdout ?? '') + (r.stderr ?? '')).split('\n').filter((l) => !/No character metrics/.test(l)).join('\n').trim())
if (r.status !== 0) process.exit(1)

const fDe = join(LV, 'de.json')
const de = JSON.parse(readFileSync(fDe, 'utf8'))
de.nguon = khung.nguon
writeFileSync(fDe, JSON.stringify(de, null, 1))

// gom Chưa chắc
const dong = [`# ${khung.ten} — CÂU CHƯA CHẮC cần CEO xem`, '',
  '> Gom từ các dòng `**Chưa chắc:**` của bản soạn đã qua soát. Mỗi câu đã có lời giải theo cách hiểu hợp lí nhất, hai lượt giải độc lập khớp nhau; cờ chỉ nói rằng ĐỀ CƯƠNG có chỗ cần người quyết.',
  '> Trên ERP: Kho đề thi › Đề cương › mở đề › câu có cảnh báo "CHƯA CHẮC".', '']
let nCc = 0
for (const q of de.cau) {
  const cc = q.canh_bao.filter((x) => x.startsWith('CHƯA CHẮC — ')).map((x) => x.slice(12))
  if (!cc.length) continue
  nCc++
  dong.push(`## ${q.nhan}`, '', ...cc.map((c) => `- ${c}`), '')
}
dong.splice(4, 0, `> **${nCc} câu** còn cờ.`)
writeFileSync(join(HERE, `${MA}.chua-chac.md`), dong.join('\n'))
const dem = (f) => de.cau.filter(f).length
console.log(`✔ ${fDe} — ${de.cau.length} câu: ${dem((q) => q.loai_cau === 'tra_loi_ngan')} TLN · ${dem((q) => q.loai_cau === 'tu_luan')} tự luận · Hình(hgt) ${dem((q) => q.kho === 'hgt')} · hình đề ${dem((q) => q.anh.length)} · hình giải ${dem((q) => q.anh_giai.length)} · chưa chắc ${nCc} · kieu ${de.kieu}`)
