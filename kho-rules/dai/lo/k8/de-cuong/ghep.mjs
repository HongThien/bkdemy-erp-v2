// ghep.mjs — ghép 12 tệp soạn của đề cương NSHM-GKI-2026 (đã soát) thành MỘT `.soan.md`, chạy cổng `--khoi 8`, dựng de.json đầy đủ
// (kieu=de_cuong, nguon = tên trường, hình giải) để `ghi.mjs` ghi MỘT LẦN vào Kho đề thi.
//
//   node kho-rules/dai/lo/k8/de-cuong/ghep.mjs <thư mục làm việc>
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc>            # chạy thử (ROLLBACK)
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc> --ghi
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/ghep.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '../../../../..')
const FULL = join(HERE, 'NSHM-GKI-2026.soan.md')
const fBoc = existsSync(join(LV, 'de.boc.json')) ? join(LV, 'de.boc.json') : join(LV, 'de.json')
const khung = JSON.parse(readFileSync(fBoc, 'utf8')) // khung gõ lại: thứ tự phần + câu, ten, nguon

// 1) gom các câu từ 12 tệp phần
const khoi = new Map() // nhan → md của câu (từ `### ` tới hết)
for (let n = 1; n <= 12; n++) {
  const md = readFileSync(join(HERE, `NSHM-GKI-2026.p${n}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
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

// 2) ghép đúng thứ tự khung
let md = `# ĐỀ | ${khung.ten}\nnam: 2026\nbo_sach: KNTT\nkieu: de_cuong\n`
for (const p of khung.phan) {
  md += `\n## PHẦN ${p.thu_tu} | ${p.ten} | tu_luan\n`
  for (const q of khung.cau.filter((c) => c.phan === p.thu_tu)) md += `\n${khoi.get(q.nhan)}\n`
}
writeFileSync(FULL, md)

// 3) cổng trên tệp đầy đủ → de.json
const r = spawnSync('node', ['scripts/kho/de-thi/dung-de-tu-soan.mjs', FULL, '--lam-viec', LV, '--khoi', '8'], { cwd: REPO, encoding: 'utf8' })
console.log(((r.stdout ?? '') + (r.stderr ?? '')).split('\n').filter((l) => !/No character metrics/.test(l)).join('\n').trim())
if (r.status !== 0) process.exit(1)

// 4) bổ sung nguon (cổng ghi 'le' mặc định)
const fDe = join(LV, 'de.json')
const de = JSON.parse(readFileSync(fDe, 'utf8'))
de.nguon = khung.nguon
writeFileSync(fDe, JSON.stringify(de, null, 1))
const dem = (f) => de.cau.filter(f).length
console.log(`✔ ${fDe} — ${de.cau.length} câu: ${dem((q) => q.loai_cau === 'tra_loi_ngan')} TLN · ${dem((q) => q.loai_cau === 'tu_luan')} tự luận · Hình ${dem((q) => q.kho === 'hinh_hoc')} · hình giải ${dem((q) => q.anh_giai.length)} · chưa chắc ${dem((q) => q.canh_bao.some((x) => x.startsWith('CHƯA CHẮC')))} · kieu ${de.kieu}`)
