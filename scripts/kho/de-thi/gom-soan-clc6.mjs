// ============================================================================
// gom-soan-clc6.mjs — GOM các bản soạn của bộ CLC lớp 6 (mỗi đề một tệp, đề 50 câu chia .p1/.p2/.p3) về repo,
// kiểm đủ câu – đúng thứ tự – đúng khuôn, rồi SO BA NGUỒN đáp số cho từng đề.
//
//   node scripts/kho/de-thi/gom-soan-clc6.mjs <de-da-sua.json> --soan <thư mục bản soạn> --kiem <kiem-tat-ca.json> --ra <thư mục trong repo>
//
// Ghi: <ra>/<K>.soan.json (bản soạn đã ghép, đúng thứ tự đề) · <ra>/so-ba-nguon.json (mọi câu, xếp loại).
// Đề chưa có bản soạn ⇒ báo "chưa soạn", không dừng. Không gọi AI, không đụng DB.
// ============================================================================
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'

const args = process.argv.slice(2)
const lay = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const fDe = args[0], SOAN = lay('--soan'), KIEM = lay('--kiem'), RA = lay('--ra'), fPX = lay('--phan-xu')
// tệp phân xử (Opus đã xem từng câu máy báo lệch): { ma_nguon: { ket: 'giu_soan' | 'ceo', ly_do } } ⇒ xếp 'da_xu' / 'cho_ceo', không in lại
const PX = fPX ? (await import(pathToFileURL(resolve(fPX)).href)).PHAN_XU : {}
if (!fDe || !SOAN || !KIEM || !RA) { console.error('Dùng: node scripts/kho/de-thi/gom-soan-clc6.mjs <de-da-sua.json> --soan <dir> --kiem <kiem-tat-ca.json> --ra <dir>'); process.exit(2) }
mkdirSync(RA, { recursive: true })
const de = JSON.parse(readFileSync(fDe, 'utf8'))
const doc = (f) => JSON.parse(readFileSync(f, 'utf8'))

const tong = {}, chuaSoan = [], loiKhuon = [], tatCa = []
const tmp = join(tmpdir(), `clc6-so-${process.pid}`); mkdirSync(tmp, { recursive: true })
for (const d of de) {
  const K = d.ma.replace(/\s+/g, '-')
  const cau = d.cau.filter((c) => !c.bo)
  // nguồn bản soạn: một tệp, hoặc các phần .p1 .p2 …, hoặc bản đã gom ở <ra>
  let ban = null
  if (existsSync(join(SOAN, `${K}.json`))) ban = doc(join(SOAN, `${K}.json`))
  else if (existsSync(join(SOAN, `${K}.p1.json`))) { ban = []; for (let i = 1; existsSync(join(SOAN, `${K}.p${i}.json`)); i++) ban.push(...doc(join(SOAN, `${K}.p${i}.json`))) }
  else if (existsSync(join(RA, `${K}.soan.json`))) ban = doc(join(RA, `${K}.soan.json`))
  if (!ban) { chuaSoan.push(d.ma); continue }

  // đủ câu, đúng mã, xếp lại theo thứ tự đề (bám ma_nguon, không bám vị trí)
  const theoMa = new Map(ban.map((x) => [x.ma_nguon, x]))
  const thieu = cau.filter((c) => !theoMa.has(c.ma_nguon)).map((c) => c.ma_nguon)
  const thua = ban.filter((x) => !cau.some((c) => c.ma_nguon === x.ma_nguon)).map((x) => x.ma_nguon)
  if (ban.length !== theoMa.size) loiKhuon.push(`${d.ma}: ma_nguon lặp trong bản soạn`)
  if (thieu.length) loiKhuon.push(`${d.ma}: thiếu ${thieu.join(', ')}`)
  if (thua.length) loiKhuon.push(`${d.ma}: mã lạ ${thua.join(', ')}`)
  const xep = cau.map((c) => theoMa.get(c.ma_nguon)).filter(Boolean)

  // khuôn từng câu
  for (const c of cau) {
    const s = theoMa.get(c.ma_nguon); if (!s || s.bo) continue
    const lg = s.loi_giai ?? '', l = []
    const i1 = lg.indexOf('**Phần 1. Hướng dẫn**'), i2 = lg.indexOf('**Phần 2. Trình bày**')
    if (i1 !== 0 || i2 < 0) l.push('thiếu / sai tiêu đề Phần 1 – Phần 2')
    else { const e = kiemP1(lg.slice(0, i2).trim()); if (e.length) l.push('Phần 1: ' + e.join('; ')) }
    if ((lg.match(/(?<!\\)\$/g) ?? []).length % 2) l.push('số $ lẻ')
    if (/[\f\t\v\b]|\u0008/.test(lg + (s.dap_an ?? ''))) l.push('ký tự điều khiển (gạch ngược LaTeX hỏng)')
    if (c.kieu === 'trac_nghiem') {
      if (s.dap_an !== '' && !/^[A-E]$/.test(s.dap_an ?? '')) l.push(`trắc nghiệm mà dap_an = «${s.dap_an}»`)
      else if (s.dap_an && !new RegExp(`Chọn ${s.dap_an}\\.\\s*$`).test(lg.trim())) l.push(`dòng cuối không phải "Chọn ${s.dap_an}."`)
    } else if (!String(s.dap_an ?? '').trim()) l.push('dap_an trống')
    const nSoDo = (lg.match(/Ta có sơ đồ/g) ?? []).length, mt = s.so_do_mo_ta == null ? 0 : Array.isArray(s.so_do_mo_ta) ? s.so_do_mo_ta.length : 1
    if (nSoDo !== mt) l.push(`"Ta có sơ đồ" ${nSoDo} lần mà so_do_mo_ta có ${mt}`)
    if (l.length) loiKhuon.push(`${c.ma_nguon}: ${l.join(' · ')}`)
  }
  writeFileSync(join(RA, `${K}.soan.json`), JSON.stringify(xep, null, 1))

  // so ba nguồn
  const fIn = join(tmp, `in-${K}.json`), fKq = join(tmp, `kq-${K}.json`)
  writeFileSync(fIn, JSON.stringify({ ma_de: d.ma, cau: cau.map((c) => ({ ma_nguon: c.ma_nguon, kieu: c.kieu })) }))
  const r = spawnSync(process.execPath, [new URL('./so-ba-nguon.mjs', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), fIn, join(RA, `${K}.soan.json`), KIEM, '--ra', fKq], { encoding: 'utf8' })
  if (r.status !== 0) { console.error(r.stderr); process.exit(1) }
  const kq = doc(fKq)
  for (const x of kq) {
    const p = PX[x.ma_nguon]
    if (p && x.loai !== 'khop') { x.loai_may = x.loai; x.loai = p.ket === 'ceo' ? 'cho_ceo' : 'da_xu'; x.phan_xu = p.ly_do }
    tong[x.loai] = (tong[x.loai] ?? 0) + 1; tatCa.push(x)
  }
  // chỉ in câu máy báo không khớp mà CHƯA phân xử
  //   (sach_lech = soạn và tự tính cùng khác sách: người kiểm đã ghi lý do ở kiem-bao-cao.md — chỉ in khi --day-du)
  const boQua = ['khop', 'da_xu', 'cho_ceo', ...(args.includes('--day-du') ? [] : ['sach_lech'])]
  const con = kq.filter((x) => !boQua.includes(x.loai)).map((x) => x.ma_nguon)
  if (con.length) {
    const khoi = r.stdout.replace(/^→.*\n?/m, '').split(/\n(?=[✔◐✖?∅] )/)
    console.log([khoi[0].split('\n')[0], ...khoi.slice(1).filter((b) => con.some((m) => b.includes(` ${m} [`)))].join('\n').trimEnd())
  }
}
writeFileSync(join(RA, 'so-ba-nguon.json'), JSON.stringify(tatCa, null, 1))
console.log(`\n══ ${de.length - chuaSoan.length}/${de.length} đề đã soạn · ${tatCa.length} câu · ${JSON.stringify(tong)}`)
for (const m of Object.keys(PX)) if (!tatCa.some((x) => x.ma_nguon === m)) console.log(`⚠ tệp phân xử có mã không thấy trong các đề đã soạn: ${m}`)
if (chuaSoan.length) console.log(`chưa soạn (${chuaSoan.length}): ${chuaSoan.join(', ')}`)
if (loiKhuon.length) { console.log(`\n── lỗi khuôn (${loiKhuon.length}):`); for (const l of loiKhuon) console.log('  ✖', l) }
