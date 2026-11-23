// Hình–Học K8 · tạo 6 bài "Chuyên đề" mới (Thùy duyệt 23/11) và đẩy 65 câu cuối kì 1 còn lại ở HH08000000 vào đó theo ĐÍCH CUỐI CÙNG của ý cuối.
// Cùng chủ đề Thales (NCD00209), thu_tu nối sau HH00176; da_duyet để false (duyệt là việc của Thùy). Câu dời xong bật rut_khoi_kho=false.
//   node scripts/kho/hh-k8-cuoi-ki-tao-chuyen-de-moi.mjs          ⇒ chạy thử ROLLBACK
//   node scripts/kho/hh-k8-cuoi-ki-tao-chuyen-de-moi.mjs --ghi    ⇒ commit (bản lùi cộng dồn vào _luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json)
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const NGUON = 'HH08000000', CHU_DE = 'NCD00209', TEP = '_luu-tru/du-lieu/hh-k8-cuoi-ki-vao-chuyen-de-23-11.json'
const LOAI = {
  tu_giac: ['Chuyên đề chứng minh tứ giác đặc biệt', 'Bài toán có yêu cầu chứng minh hình bình hành, hình thang cân, hình chữ nhật, hình thoi hoặc hình vuông là đích cuối cùng', 17],
  dieu_kien: ['Chuyên đề tìm điều kiện để tứ giác đặc biệt', 'Bài toán có yêu cầu tìm điều kiện của tam giác hoặc tứ giác để ra hình đặc biệt (hoặc tìm giá trị tham số) là đích cuối cùng', 17],
  trung_diem: ['Chuyên đề chứng minh trung điểm', 'Bài toán có yêu cầu chứng minh một điểm là trung điểm của đoạn thẳng là đích cuối cùng', 7],
  dac_biet_tg: ['Chuyên đề chứng minh yếu tố đặc biệt trong tam giác', 'Bài toán có yêu cầu chứng minh tia phân giác, tam giác cân, trọng tâm hoặc trực tâm là đích cuối cùng', 9],
  tinh: ['Chuyên đề tính độ dài, tỉ số, diện tích', 'Bài toán có yêu cầu tính độ dài, tỉ số hoặc diện tích là đích cuối cùng', 7],
  thuc_te: ['Bài toán thực tế ứng dụng hình học', 'Bài toán có ý cuối là tình huống thực tế (đo chiều cao, làm cầu, đúc bê tông, sơn, lát gạch…)', 8],
}
const MOC = /^([a-eA-E]|\d{1,2})[).]\s/
function yCuoi(nd) { const l = nd.split(/\n/).map((s) => s.trim()).filter(Boolean); let i = -1; l.forEach((x, k) => { if (MOC.test(x)) i = k }); return (i >= 0 ? l.slice(i).join(' ') : l[l.length - 1]).replace(/\s+/g, ' ') }
function phanLoai(last) {
  const t = last.toLowerCase()
  if (/(điều kiện|thêm điều|tam giác gì|hình gì)/.test(t) || /để .*là hình/.test(t) || /tìm \$?k\$? để/.test(t)) return 'dieu_kien'
  if (/(tính|bao nhiêu|hỏi|cần trả)/.test(t)) return /(m\^3|lít|tiền|viên gạch|chiều cao của cây|tòa nhà|cây cầu|sơn)/.test(t) ? 'thuc_te' : 'tinh'
  if (/hình (bình hành|thoi|vuông|chữ nhật|thang)/.test(t)) return 'tu_giac'
  if (/(phân giác|\bcân\b|trọng tâm|trực tâm)/.test(t)) return 'dac_biet_tg'
  if (/trung điểm/.test(t) && /(chứng minh|là trung điểm)/.test(t)) return 'trung_diem'
  return null
}
const ds = JSON.parse(fs.readFileSync('scripts/hinh-luyen/nhap/k8-de-thi.json', 'utf8'))
const ma = [...new Set(ds.filter((x) => /cuối học kì/i.test(x.ten_de)).map((x) => x.nguon_ma_cau))]
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
await c.query('begin')
try {
  const rows = await q(`select ma_cau, noi_dung from hinh_hoc_cau_hoi where ma_cau = any($1) and dang_chinh = $2 and xoa_at is null order by ma_cau`, [ma, NGUON])
  const nhom = {}; const giu = []
  for (const r of rows) { const k = phanLoai(yCuoi(r.noi_dung)); if (k) (nhom[k] ??= []).push(r.ma_cau); else giu.push(r.ma_cau) }
  for (const [k, v] of Object.entries(LOAI)) console.log(k, (nhom[k] || []).length, '(kỳ vọng', v[2] + ')')
  console.log('giữ lại:', giu.join(' '))
  for (const [k, v] of Object.entries(LOAI)) if ((nhom[k] || []).length !== v[2]) throw new Error('số câu lệch kỳ vọng ở ' + k)
  if (giu.length !== 1 || giu[0] !== 'HHC015574') throw new Error('câu giữ lại không đúng như đã duyệt')
  const tt0 = +(await q(`select max(thu_tu) m from hinh_hoc_bai where khoi = '8'`))[0].m
  const lui = []; let tt = tt0
  for (const [k, [ten, mo_ta]] of Object.entries(LOAI)) {
    if ((await q(`select 1 from hinh_hoc_bai where khoi = '8' and ten_bai = $1`, [ten])).length) throw new Error('đã có bài ' + ten)
    const b = (await q(`insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, chu_de_id, mo_ta) values ('8', $1, $2, $3, $4) returning ma_bai`, [ten, ++tt, CHU_DE, mo_ta]))[0].ma_bai
    console.log('tạo', b, ten)
    for (const m of nhom[k]) {
      const n = (await c.query(`update hinh_hoc_cau_hoi set dang_chinh = $2, rut_khoi_kho = false where ma_cau = $1 and dang_chinh = $3`, [m, b, NGUON])).rowCount
      if (n !== 1) throw new Error('không dời được ' + m)
      lui.push({ ma_cau: m, tu: NGUON, den: b, rut_cu: true })
    }
  }
  const sau = await q(`select b.ma_bai, b.ten_bai, count(*) n, count(*) filter (where k.kho_chuan) chuan from hinh_hoc_cau_hoi k join hinh_hoc_bai b on b.ma_bai = k.dang_chinh where b.khoi = '8' and b.thu_tu > $1 and k.xoa_at is null group by 1, 2 order by 1`, [tt0])
  console.log('đọc lại:', JSON.stringify(sau))
  if (GHI) {
    const cu = fs.existsSync(TEP) ? JSON.parse(fs.readFileSync(TEP, 'utf8')) : []
    fs.writeFileSync(TEP, JSON.stringify([...cu, ...lui], null, 1))
    await c.query('commit'); console.log('ĐÃ GHI')
  } else { await c.query('rollback'); console.log('(chạy thử — ROLLBACK)') }
} catch (e) { await c.query('rollback'); console.error('LỖI → ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
