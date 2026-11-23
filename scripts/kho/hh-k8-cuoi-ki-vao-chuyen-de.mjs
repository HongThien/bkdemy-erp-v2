// Hình–Học K8 · đẩy câu ĐỀ CUỐI KÌ 1 (Toán 8) từ "Chưa phân dạng — Hình học 8" (HH08000000) vào 4 bài "Chuyên đề" Thùy tạo 23/11:
//   HH00173 vuông góc · HH00174 song song · HH00175 thẳng hàng - đồng quy · HH00176 hệ thức hình học.
// Thùy 23/11: "Đẩy các bài thi cuối kì 1 vào kho đi của các bài này đi".
// Nguồn "cuối kì 1": 136 câu trong scripts/hinh-luyen/nhap/k8-de-thi.json (tên đề ghi "cuối học kì 1") — DB chỉ ghi nguon='de_thi', không ghi tên đề.
// Luật xếp: theo ĐÍCH CUỐI CÙNG (mô tả bài: "yêu cầu chứng minh X là đích cuối cùng") = vế chứng minh cuối cùng của Ý CUỐI.
//   Chỉ dời khi chắc 100%: ý cuối có "Chứng minh …" (hoặc là khẳng định trần mà đề dẫn "Chứng minh:") và vế cuối thuộc đúng 1 trong 4 loại.
//   Còn lại (tính toán, tìm điều kiện, "hình gì", bài thực tế, hình bình hành / hình thoi / cân / phân giác / trung điểm…) ở nguyên HH08000000.
//   node scripts/kho/hh-k8-cuoi-ki-vao-chuyen-de.mjs          ⇒ chạy thử 1 transaction rồi ROLLBACK, in danh sách
//   node scripts/kho/hh-k8-cuoi-ki-vao-chuyen-de.mjs --ghi    ⇒ commit (bản lùi: _luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const NGUON = 'HH08000000'
const BAI = { vuong: 'HH00173', song: 'HH00174', thang: 'HH00175', hethuc: 'HH00176' }

const ds = JSON.parse(fs.readFileSync('scripts/hinh-luyen/nhap/k8-de-thi.json', 'utf8'))
const maCuoiKi = [...new Set(ds.filter((x) => /cuối học kì/i.test(x.ten_de)).map((x) => x.nguon_ma_cau))]

const MOC_Y = /^([a-eA-E]|\d{1,2})[).]\s/
// tách ý cuối + phần thân (dòng dẫn chung)
function tachYCuoi(nd) {
  const lines = nd.split(/\n/).map((s) => s.trim()).filter(Boolean)
  let idx = -1; lines.forEach((l, i) => { if (MOC_Y.test(l)) idx = i })
  if (idx < 0) return { stem: lines.slice(0, -1).join(' '), last: lines[lines.length - 1] || '' }
  return { stem: lines.slice(0, idx).join(' '), last: lines.slice(idx).join(' ') }
}
// vế chứng minh cuối cùng (sau "Chứng minh" cuối cùng); khẳng định trần ⇒ chính ý, nhưng chỉ khi thân đề có "Chứng minh…:" dẫn
function veCuoi(stem, last) {
  const m = [...last.matchAll(/ch[ứư]ng minh(?:\s+r[ằa]ng)?\s*:?/gi)]
  if (m.length) { const k = m[m.length - 1]; return last.slice(k.index + k[0].length).trim() }
  if (/ch[ứư]ng minh[^.]*:\s*(?:$|\n)/i.test(stem) || /ch[ứư]ng minh[^.]*:\s*$/i.test(stem)) return last.replace(MOC_Y, '').trim()
  return null
}
const LOAI_KHAC = /(hình\s+(bình hành|thoi|vuông|chữ nhật|thang|thang cân)|tứ giác|cân\b|phân giác|trung điểm|trực tâm|là hình|điều kiện|tính|bao nhiêu|hỏi)/i
function phanLoai(stem, last) {
  const ve = veCuoi(stem, last); if (ve == null) return { loai: null, why: 'không có "chứng minh" ở ý cuối' }
  // vế cuối cùng của câu ghép "A và B" — lấy phần sau " và " cuối (đích cuối cùng)
  const parts = ve.split(/\s+và\s+(?=[^$]*(?:\$[^$]*\$[^$]*)*$)/)
  const cuoi = parts[parts.length - 1]
  const t = cuoi.replace(/\.$/, '')
  if (/thẳng hàng|đồng quy|đi qua một điểm/i.test(t)) return { loai: 'thang', ve: t }
  if (LOAI_KHAC.test(t) && !/thẳng hàng|đồng quy/i.test(t)) return { loai: null, why: 'đích không thuộc 4 loại: ' + t.slice(0, 60) }
  if (/\\parallel|song song/.test(t) && !/\\perp/.test(t)) return { loai: 'song', ve: t }
  if (/\\perp|vuông góc|=\s*90\s*\^\s*\\circ|=\s*90\^\{\\circ\}/.test(t)) return { loai: 'vuong', ve: t }
  // hệ thức: có "=" và phép tính (hệ số / tích / thương / bình phương / tổng) — "X=Y" trơn không tính
  if (/=/.test(t) && /(\\cdot|\\dfrac|\\frac|\^2|\+|=\s*\d|\d\s*[A-Z\\]|\d\s*\\cdot)/.test(t) && !/\\widehat|\\angle|\\triangle/.test(t)) return { loai: 'hethuc', ve: t }
  return { loai: null, why: 'không rõ loại: ' + t.slice(0, 60) }
}

const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  const rows = await q(`select ma_cau, noi_dung, dang_chinh, da_duyet from hinh_hoc_cau_hoi where ma_cau = any($1) and xoa_at is null order by ma_cau`, [maCuoiKi])
  console.log(`cuối kì 1 trong file: ${maCuoiKi.length} · còn sống trong DB: ${rows.length}`)
  const chuaDoi = rows.filter((r) => r.dang_chinh !== NGUON)
  if (chuaDoi.length) console.log(`  ${chuaDoi.length} câu không còn ở ${NGUON} (bỏ qua):`, chuaDoi.map((r) => r.ma_cau + '@' + r.dang_chinh).join(' '))
  const dem = { vuong: 0, song: 0, thang: 0, hethuc: 0, giu: 0 }
  const lui = []
  const giu = []
  for (const r of rows.filter((x) => x.dang_chinh === NGUON)) {
    const { stem, last } = tachYCuoi(r.noi_dung)
    const p = phanLoai(stem, last)
    if (!p.loai) { dem.giu++; giu.push(`${r.ma_cau}  ${p.why}`); continue }
    dem[p.loai]++
    console.log(`${r.ma_cau} → ${BAI[p.loai]} (${p.loai})  ${p.ve.replace(/\s+/g, ' ').slice(0, 95)}`)
    lui.push({ ma_cau: r.ma_cau, tu: NGUON, den: BAI[p.loai] })
    await q(`update hinh_hoc_cau_hoi set dang_chinh = $2 where ma_cau = $1 and dang_chinh = $3`, [r.ma_cau, BAI[p.loai], NGUON])
  }
  console.log('\nGIỮ NGUYÊN (không chắc 100%):'); giu.forEach((x) => console.log('  ' + x))
  console.log('\nTỔNG:', JSON.stringify(dem))
  // đọc lại trong transaction
  const sau = await q(`select dang_chinh, count(*) n from hinh_hoc_cau_hoi where dang_chinh = any($1) and xoa_at is null group by 1 order by 1`, [[...Object.values(BAI), NGUON]])
  console.log('đọc lại:', JSON.stringify(sau))
  const doi = Object.values(dem).slice(0, 4).reduce((a, b) => a + b, 0)
  if (sau.filter((s) => s.dang_chinh !== NGUON).reduce((a, s) => a + +s.n, 0) !== doi) throw new Error('đếm không khớp số đã dời')
  if (GHI) {
    fs.mkdirSync('_luu-tru/du-lieu', { recursive: true })
    fs.writeFileSync('_luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json', JSON.stringify(lui, null, 1))
    await c.query('commit'); console.log('\nĐÃ GHI (commit). Bản lùi: _luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json')
  } else { await c.query('rollback'); console.log('\n(chạy thử — ROLLBACK, chưa ghi gì)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
