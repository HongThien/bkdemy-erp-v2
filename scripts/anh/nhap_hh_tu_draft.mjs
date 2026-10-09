// nhap_hh_tu_draft.mjs — NHẬP bản nháp (draft_*.md do người/agent soạn) vào hinh_hoc_cau_hoi. Bước 3 của "luồng kho kiểu 1".
//
//   node --env-file=.env scripts/anh/nhap_hh_tu_draft.mjs <ma_bai> <draft1.md> [draft2.md …] [--cam "<regex từ cấm>"]
//        [--hinh <dir1,dir2,…> --ra <thu_muc_ra>] [--ghi]
//
// Khuôn mỗi câu trong draft:   ### <nhãn> → HH00xxx   **noi_dung:** …  **loi_giai:** …  **cấu hình hình / nghi vấn:** …  **hinh:** <file.png>
// Không có --ghi: CHẠY THỬ — chuẩn hoá + lọc, in báo cáo, KHÔNG ghi DB.
// Có --ghi: INSERT mọi câu trong 1 transaction (da_duyet=false, nguon_giai='ai', giai_method='claude_code'), thu_tu nối tiếp trong bài,
//           in bảng nhãn → mã câu; nếu có --hinh/--ra: chép file hình của từng câu sang <ra>/<ma_cau>_<nhan>.png (sẵn cho gan_hinh.mjs).
// Thứ tự câu trong bài = thứ tự file truyền vào, rồi thứ tự khối trong file → truyền file theo ĐÚNG thứ tự câu trong tài liệu gốc.
// Chuẩn hoá (log-giai-hinh-hoc-bai.md R1/R2): đề KHÔNG dòng trống; lời giải xuống dòng đơn, chỉ cách 1 dòng trống TRƯỚC ý b) c) d)…
//   và trước "**Phần 2. Trình bày**" (lời giải 2 phần).
// --cam: regex các từ NGOÀI whitelist của bài (vd bài tam giác vuông: "cân|đều|trung trực|Pytago|đồng dạng|hình bình hành") — chỉ CẢNH BÁO,
//        có cảnh báo thì --ghi từ chối trừ khi thêm --bo-qua-canh-bao (người đã xem từng chỗ).
import pg from 'pg'
import { readFileSync, existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const argv = process.argv.slice(2)
const CO_GT = new Set(['--cam', '--hinh', '--ra'])
const pos = argv.filter((a, i) => !a.startsWith('--') && !CO_GT.has(argv[i - 1]))
const [maBai, ...files] = pos
const gt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null }
const GHI = argv.includes('--ghi'), BO_QUA = argv.includes('--bo-qua-canh-bao')
const NOI = argv.includes('--noi') // bài đã có câu ⇒ NỐI vào cuối (thu_tu tiếp theo), dùng khi chuyển câu sang bài đã nhập
const CHO_CUNG = argv.includes('--cho-cung') // lớp 9 học cung ⇒ tắt cảnh báo chữ "cung" (vốn để bắt lớp 7 gọi nhầm ký hiệu góc là cung)
const CAM = gt('--cam') ? new RegExp(gt('--cam'), 'i') : null
const HINH_DIRS = (gt('--hinh') || '').split(',').filter(Boolean), RA = gt('--ra')
if (!maBai || !/^HH\d{5}$/.test(maBai) || !files.length) {
  console.error('Dùng: node --env-file=.env scripts/anh/nhap_hh_tu_draft.mjs HH00xxx <draft1.md> [draft2.md …] [--cam "<regex>"] [--hinh d1,d2 --ra <dir>] [--ghi]'); process.exit(2)
}

const dongDe = (s) => s.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n').trim()
// Lời giải 2 phần (Hình 8 trở đi, kho-rules/dai/k8.md §1.6): thêm đúng 1 dòng trống trước "**Phần 2. Trình bày**".
const dongLG = (s) => dongDe(s).replace(/\n([b-z]\) )/g, '\n\n$1').replace(/\n(\*\*Phần 2\b)/g, '\n\n$1')

const cau = []
for (const f of files) {
  const txt = readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
  for (const b of txt.split(/\n(?=### )/).filter((x) => x.startsWith('### '))) {
    const m = b.match(/^### (\S+) → (HH\d+)/)
    if (!m) continue
    const iND = b.indexOf('**noi_dung:**'), iLG = b.indexOf('**loi_giai:**'), iEnd = b.search(/\*\*(cấu hình|nghi vấn)/)
    if (iND < 0 || iLG < 0 || iEnd < 0) { console.error(`❌ ${f}: câu ${m[1]} thiếu mốc **noi_dung:** / **loi_giai:** / **cấu hình…`); process.exit(2) }
    if (m[2] !== maBai) { console.error(`❌ ${f}: câu ${m[1]} ghi → ${m[2]}, khác bài đang nhập ${maBai}`); process.exit(2) }
    const hinh = b.match(/\*\*hinh:\*\*\s*([^\s*]+)/)?.[1] || null
    const hinhLG = b.match(/\*\*hinh_lg:\*\*\s*([^\s*]+)/)?.[1] || null // hình là ĐÁP ÁN ("vẽ hình", "nêu cách dựng") ⇒ chỉ gắn lời giải (gan_hinh: …_lg.png)
    // Trường tuỳ chọn, đặt TRƯỚC **noi_dung:** (khối 9+): **loai_cau:** trac_nghiem|tra_loi_ngan|tu_luan · **lua_chon:** ["…","…","…","…"] (JSON 1 dòng) · **dap_an:** …
    const dau = b.slice(0, iND)
    const loai = dau.match(/\*\*loai_cau:\*\*\s*(\S+)/)?.[1] || 'tu_luan'
    const lcTxt = dau.match(/\*\*lua_chon:\*\*\s*(\[.*\])\s*$/m)?.[1]
    const dapAn = dau.match(/\*\*dap_an:\*\*\s*(.+?)\s*$/m)?.[1] || null
    let lc = null
    if (lcTxt) { try { lc = JSON.parse(lcTxt) } catch { console.error(`❌ ${f}: câu ${m[1]} lua_chon không phải JSON`); process.exit(2) } }
    if (!['tu_luan', 'trac_nghiem', 'tra_loi_ngan'].includes(loai)) { console.error(`❌ ${f}: câu ${m[1]} loai_cau lạ: ${loai}`); process.exit(2) }
    if (loai === 'trac_nghiem' && (!Array.isArray(lc) || lc.length !== 4 || !/^[ABCD]$/.test(dapAn || ''))) { console.error(`❌ ${f}: câu ${m[1]} trắc nghiệm cần lua_chon 4 phương án + dap_an A–D`); process.exit(2) }
    cau.push({ nhan: m[1], nd: dongDe(b.slice(iND + 13, iLG)), lg: dongLG(b.slice(iLG + 13, iEnd)), hinh, hinhLG, file: f, loai, lc, dapAn })
  }
}
const trung = cau.map((c) => c.nhan).filter((n, i, a) => a.indexOf(n) !== i)
if (trung.length) { console.error('❌ Nhãn trùng:', [...new Set(trung)].join(', ')); process.exit(2) }

// Lọc
let canhBao = 0
for (const c of cau) {
  const vd = []
  if (c.nd.length < 20) vd.push('đề quá ngắn')
  if (c.lg.length < 40) vd.push('lời giải quá ngắn')
  if (/\n\n/.test(c.nd)) vd.push('đề còn dòng trống')
  if (!c.lg.includes('\\')) vd.push('lời giải không có LaTeX (lạ)')
  if (/\*\*Phần 1/.test(c.lg) !== /\*\*Phần 2/.test(c.lg)) vd.push('lời giải 2 phần thiếu một phần')
  if (!CHO_CUNG && /\bcung\b/i.test(c.nd + c.lg) && !/cung tròn/i.test(c.nd)) vd.push('có chữ "cung" ngoài "cung tròn"')
  if (CAM) { const k = (c.lg + '\n' + c.nd).match(new RegExp('.{0,30}(' + CAM.source + ').{0,30}', 'gi')); if (k) vd.push('TỪ CẤM: ' + [...new Set(k.map((x) => x.replace(/\n/g, ' ')))].slice(0, 3).join(' | ')) }
  if (vd.length) { canhBao += vd.length; console.log(`⚠ ${c.nhan}: ${vd.join(' ; ')}`) }
}
console.log(`Đọc ${cau.length} câu từ ${files.length} file → ${maBai}. Cảnh báo: ${canhBao}. ${GHI ? 'GHI THẬT' : 'CHẠY THỬ'}`)
console.log('  ' + cau.map((c) => c.nhan).join(' · '))
if (!GHI) process.exit(0)
if (canhBao && !BO_QUA) { console.error('❌ Còn cảnh báo — xem từng chỗ rồi thêm --bo-qua-canh-bao nếu chấp nhận.'); process.exit(1) }

const c = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, statement_timeout: 60000 })
await c.connect()
const bai = (await c.query('select ma_bai, ten_bai from hinh_hoc_bai where ma_bai = $1', [maBai])).rows[0]
if (!bai) { console.error('❌ Không có bài', maBai); process.exit(1) }
const cu = (await c.query(`select count(*)::int n, coalesce(max(thu_tu),0)::int mx from hinh_hoc_cau_hoi where dang_chinh = $1 and xoa_at is null`, [maBai])).rows[0]
if (cu.n && !NOI) { console.error(`❌ Bài ${maBai} đã có ${cu.n} câu — không nhập chồng (thêm câu vào cuối bài: --noi).`); process.exit(1) }
const map = []
await c.query('begin')
try {
  let tt = NOI ? cu.mx + 1 : 1
  for (const x of cau) {
    const r = await c.query(
      `insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, loi_giai, thu_tu, loai_cau, lua_chon, dap_an, nguon_giai, giai_method, kho_chuan, da_duyet)
       values ($1,$2,$3,$4,$5,$6,$7,'ai','claude_code',true,false) returning ma_cau`,
      [maBai, x.nd, x.lg, tt++, x.loai, x.lc ? JSON.stringify(x.lc) : null, x.dapAn])
    map.push({ nhan: x.nhan, ma_cau: r.rows[0].ma_cau, thu_tu: tt - 1, hinh: x.hinh, hinhLG: x.hinhLG })
  }
  await c.query('commit')
} catch (e) { await c.query('rollback'); throw e }
await c.end()
console.log(`✔ Đã ghi ${map.length} câu vào ${maBai} "${bai.ten_bai}":`)
for (const m of map) console.log(`  #${String(m.thu_tu).padStart(2)} ${m.nhan.padEnd(4)} → ${m.ma_cau}   hình: ${m.hinh || '-'}`)

if (RA && HINH_DIRS.length) {
  mkdirSync(RA, { recursive: true })
  let n = 0
  for (const m of map) {
    for (const [f, duoi] of [[m.hinh, ''], [m.hinhLG, '_lg']]) {
      if (!f) continue
      const nguon = HINH_DIRS.map((d) => join(d, f)).find(existsSync)
      if (!nguon) { console.log(`  ⚠ không thấy file hình ${f} (câu ${m.nhan}) trong ${HINH_DIRS.join(', ')}`); continue }
      copyFileSync(nguon, join(RA, `${m.ma_cau}_${m.nhan}${duoi}.png`)); n++
    }
  }
  writeFileSync(join(RA, '_map.json'), JSON.stringify(map, null, 1))
  console.log(`✔ Chép ${n} hình sang ${RA} (tên = <ma_cau>_<nhan>.png) — chạy gan_hinh.mjs trên thư mục này.`)
}
