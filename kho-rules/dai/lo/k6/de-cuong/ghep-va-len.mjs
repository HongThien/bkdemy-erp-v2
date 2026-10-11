// ghep-va-len.mjs — ghép 10 tệp soạn của đề cương NSHM-GKI-2026 (đã soát) thành MỘT `.soan.md`, chạy cổng, gộp kết quả vào de.json
// (giữ kieu / nguon / sha256…) rồi cập nhật từng câu đã ghi trên ERP (`sua-cau-de.mjs`: loai_cau · dap_an · loi_giai · ghi chú).
//
//   node kho-rules/dai/lo/k6/de-cuong/ghep-va-len.mjs <thư mục làm việc> ghep        # ghép + cổng + gộp de.json (lưu nội dung CŨ vào de.cu.json lần đầu)
//   node kho-rules/dai/lo/k6/de-cuong/ghep-va-len.mjs <thư mục làm việc> len         # chạy thử từng câu (ROLLBACK)
//   node kho-rules/dai/lo/k6/de-cuong/ghep-va-len.mjs <thư mục làm việc> len --ghi   # ghi thật, TUẦN TỰ
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const [LV, CHE, ...rest] = process.argv.slice(2)
if (!LV || !['ghep', 'len'].includes(CHE)) { console.error('Dùng: … <thư mục làm việc> ghep | len [--ghi]'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '../../../../..')
const FULL = join(HERE, 'NSHM-GKI-2026.soan.md')
const fDe = join(LV, 'de.json'), fCu = join(LV, 'de.cu.json')
const chay = (args) => { const r = spawnSync('node', args, { cwd: REPO, encoding: 'utf8' }); return { ma: r.status, out: ((r.stdout ?? '') + (r.stderr ?? '')).trim() } }

if (CHE === 'ghep') {
  // nội dung CŨ (đang nằm trên ERP) — chỉ lưu lần đầu; khoá tìm câu khi cập nhật
  if (!existsSync(fCu)) copyFileSync(fDe, fCu)
  const cu = JSON.parse(readFileSync(fCu, 'utf8'))

  // 1) ghép 10 tệp phần → một tệp, theo thứ tự câu trong de.json
  const khoi = new Map() // nhan → { phan, md }
  for (let n = 1; n <= 10; n++) {
    const md = readFileSync(join(HERE, `NSHM-GKI-2026.p${n}.soan.md`), 'utf8').replace(/\r\n/g, '\n')
    const iGc = md.search(/^## GHI CHÚ/m)
    const than = iGc >= 0 ? md.slice(0, iGc) : md
    for (const kp of than.split(/^(?=## PHẦN )/m).slice(1)) {
      const phan = +kp.match(/^## PHẦN (\d+) /)[1]
      for (const kc of kp.split(/^(?=### )/m).slice(1)) {
        const nhan = kc.match(/^### (.+?) \| /)[1]
        if (khoi.has(nhan)) throw new Error('trùng ' + nhan + ' (p' + n + ')')
        khoi.set(nhan, { phan, md: kc.trimEnd() })
      }
    }
  }
  const thieu = cu.cau.filter((q) => !khoi.has(q.nhan)).map((q) => q.nhan)
  if (thieu.length || khoi.size !== cu.cau.length) throw new Error(`thiếu / thừa câu: thiếu ${thieu.join(' ')} · có ${khoi.size}/${cu.cau.length}`)
  let md = `# ĐỀ | ${cu.ten}\nnam: 2026\nbo_sach: KNTT\n`
  for (const p of cu.phan) {
    md += `\n## PHẦN ${p.thu_tu} | ${p.ten} | tu_luan\n`
    for (const q of cu.cau.filter((c) => c.phan === p.thu_tu)) md += `\n${khoi.get(q.nhan).md}\n`
  }
  writeFileSync(FULL, md)

  // 2) cổng trên tệp đầy đủ + dựng de.json tạm ở thư mục cổng
  const cong = join(LV, '_cong')
  mkdirSync(cong, { recursive: true })
  copyFileSync(fCu, join(cong, 'de.json'))
  const r = chay(['scripts/kho/de-thi/dung-de-tu-soan.mjs', FULL, '--lam-viec', cong])
  console.log(r.out.split('\n').filter((l) => !/No character metrics/.test(l)).join('\n'))
  if (r.ma !== 0) process.exit(1)

  // 3) gộp kết quả vào de.json (giữ phần còn lại)
  const moi = JSON.parse(readFileSync(join(cong, 'de.json'), 'utf8'))
  const de = { ...cu }
  de.cau = cu.cau.map((q) => {
    const m = moi.cau.find((x) => x.nhan === q.nhan)
    if (!m) throw new Error('không có ' + q.nhan)
    return { ...q, noi_dung: m.noi_dung, loai_cau: m.loai_cau, dap_an: m.dap_an, dap_an_nguon: 'claude_giai', loi_giai: m.loi_giai, canh_bao: m.canh_bao }
  })
  writeFileSync(fDe, JSON.stringify(de, null, 1))
  const dem = (f) => de.cau.filter(f).length
  console.log(`✔ ${fDe} — ${de.cau.length} câu: ${dem((q) => q.loai_cau === 'tra_loi_ngan')} TLN · ${dem((q) => q.loai_cau === 'tu_luan')} tự luận · đổi đề ${dem((q, i) => q.noi_dung !== cu.cau[i].noi_dung)} · chưa chắc ${dem((q) => q.canh_bao.some((x) => x.startsWith('CHƯA CHẮC')))}`)
} else {
  const cu = JSON.parse(readFileSync(fCu, 'utf8'))
  const ghi = rest.includes('--ghi')
  let ok = 0, hong = 0
  for (const q of cu.cau) {
    const a = ['scripts/kho/de-thi/sua-cau-de.mjs', LV, '--nhan', q.nhan, '--phan', String(q.phan), '--de-cu', q.noi_dung]
    if (ghi) a.push('--ghi')
    const r = chay(a)
    const good = ghi ? /✔ đã ghi/.test(r.out) : /ROLLBACK/.test(r.out)
    if (good) ok++; else { hong++; console.log(`✘ ${q.nhan}: ${r.out.slice(0, 300)}`) }
  }
  console.log(`${ghi ? 'ĐÃ GHI' : 'CHẠY THỬ'}: ${ok}/${cu.cau.length} câu OK · lỗi ${hong}`)
}
