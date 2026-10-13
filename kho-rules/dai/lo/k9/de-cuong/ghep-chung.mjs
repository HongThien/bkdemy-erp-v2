// ghep-chung.mjs — ghép N tệp soạn `<MA>.p<k>.soan.md` (đã soát) thành MỘT `<MA>.soan.md`, chạy cổng `--khoi 9`, dựng de.json đầy đủ,
// và gom các dòng **Chưa chắc:** (+ các ý KHÔNG nhập vì đề in thiếu) vào `<MA>.chua-chac.md`. Đề cương KHỐI 9 gõ lại từ PDF (NS-GKI-2026).
// Cùng khuôn `lo/k8/de-cuong/ghep-chung.mjs`; khác: khoá câu = (phần, nhãn) vì đề cương đánh số bài lại từ 1 ở mỗi phần, và câu `lap`
// (đề cương in LẶP nguyên văn một bài khác) chép lời giải của bài gốc thay vì soạn lần hai.
//
//   node kho-rules/dai/lo/k9/de-cuong/ghep-chung.mjs <MA> <thư mục làm việc> <số phần>
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
const khoa = (q) => `P${q.phan} ${q.nhan}`

const khoi = new Map()
for (let n = 1; n <= +SO; n++) {
  const md = readFileSync(join(HERE, `${MA}.p${n}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
  const iGc = md.search(/^## GHI CHÚ/m)
  const than = iGc >= 0 ? md.slice(0, iGc) : md
  for (const kp of than.split(/^(?=## PHẦN )/m).slice(1)) {
    const pt = +kp.match(/^## PHẦN (\d+) /)[1]
    for (const kc of kp.split(/^(?=### )/m).slice(1)) {
      const k = `P${pt} ${kc.match(/^### (.+?) \| /)[1]}`
      if (khoi.has(k)) throw new Error('trùng ' + k + ' (p' + n + ')')
      khoi.set(k, kc.trimEnd())
    }
  }
}
// câu lặp: chép khối của bài gốc, thêm dòng Ghi chú của câu lặp ngay trước Phần 1
for (const q of khung.cau.filter((c) => c.lap)) {
  const goc = khoi.get(q.lap)
  if (!goc) throw new Error(`${khoa(q)}: chưa có khối của bài gốc ${q.lap}`)
  const gc = (q.canh_bao ?? []).map((cb) => (cb.startsWith('CHƯA CHẮC — ') ? `**Chưa chắc:** ${cb.slice(12)}` : `**Ghi chú:** ${cb}`)).join('\n')
  khoi.set(khoa(q), gc ? goc.replace('**Phần 1. Hướng dẫn**', () => `${gc}\n\n**Phần 1. Hướng dẫn**`) : goc)
}
const thieu = khung.cau.filter((q) => !khoi.has(khoa(q))).map(khoa)
if (thieu.length || khoi.size !== khung.cau.length) throw new Error(`thiếu / thừa câu: thiếu ${thieu.join(' · ')} · có ${khoi.size}/${khung.cau.length}`)

let md = `# ĐỀ | ${khung.ten}\nnam: ${khung.nam}\nbo_sach: KNTT\nkieu: de_cuong\n`
for (const p of khung.phan) {
  md += `\n## PHẦN ${p.thu_tu} | ${p.ten} | tu_luan\n`
  for (const q of khung.cau.filter((c) => c.phan === p.thu_tu)) md += `\n${khoi.get(khoa(q))}\n`
}
writeFileSync(FULL, md)

const r = spawnSync('node', ['scripts/kho/de-thi/dung-de-tu-soan.mjs', FULL, '--lam-viec', LV, '--khoi', '9'], { cwd: REPO, encoding: 'utf8' })
console.log(((r.stdout ?? '') + (r.stderr ?? '')).split('\n').filter((l) => !/No character metrics/.test(l)).join('\n').trim())
if (r.status !== 0) process.exit(1)

const fDe = join(LV, 'de.json')
const de = JSON.parse(readFileSync(fDe, 'utf8'))
de.nguon = khung.nguon
writeFileSync(fDe, JSON.stringify(de, null, 1))

// gom Chưa chắc
const tenPhan = (n) => (khung.phan.find((p) => p.thu_tu === n)?.ten ?? '').split('.')[0]
const dong = [`# ${khung.ten} — CÂU CHƯA CHẮC cần CEO xem`, '',
  '> Gom từ các dòng `**Chưa chắc:**` của bản soạn đã qua soát. Mỗi câu đã có lời giải theo cách hiểu hợp lí nhất, hai lượt giải độc lập khớp nhau; cờ chỉ nói rằng ĐỀ CƯƠNG có chỗ cần người quyết.',
  '> Trên ERP: Kho đề thi › Đề cương › mở đề › câu có cảnh báo "CHƯA CHẮC".', '']
let nCc = 0
for (const q of de.cau) {
  const cc = q.canh_bao.filter((x) => x.startsWith('CHƯA CHẮC — ')).map((x) => x.slice(12))
  if (!cc.length) continue
  nCc++
  dong.push(`## ${tenPhan(q.phan)}. ${q.nhan}`, '', ...cc.map((c) => `- ${c}`), '')
}
dong.splice(4, 0, `> **${nCc} câu** còn cờ.`)
if (khung.khong_nhap?.length) {
  dong.push('---', '', `## KHÔNG NHẬP — đề cương in thiếu hẳn một vế (${khung.khong_nhap.length} ý, chờ CEO bổ sung đề)`, '')
  for (const k of khung.khong_nhap) dong.push(`- **${k.nhan}:** ${k.in} — ${k.ly_do}.`)
  dong.push('')
}
writeFileSync(join(HERE, `${MA}.chua-chac.md`), dong.join('\n'))
const dem = (f) => de.cau.filter(f).length
console.log(`✔ ${fDe} — ${de.cau.length} câu: ${dem((q) => q.loai_cau === 'tra_loi_ngan')} TLN · ${dem((q) => q.loai_cau === 'tu_luan')} tự luận · HGT ${dem((q) => q.kho === 'hgt')} · hình đề ${dem((q) => q.anh.length)} · hình giải ${dem((q) => q.anh_giai.length)} · chưa chắc ${nCc} · kieu ${de.kieu}`)
