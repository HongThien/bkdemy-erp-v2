// HÌNH–LUYỆN · bước 1 (spec-hinh-cay-nhanh.md §11): chép bài Hình TỰ LUẬN của kho đề thi sang kho Luyện,
// mỗi bài = 1 dòng hinh_bai + N dòng hinh_y (tách ý a/b/c). KHÔNG dời/sửa câu gốc ở kho Hình–Học (Học và Luyện độc lập).
//
//   node scripts/hinh-luyen/nhap_tu_de_thi.mjs --khoi 8            # chạy khô: tách + báo cáo, ghi bản nháp JSON, KHÔNG ghi DB
//   node scripts/hinh-luyen/nhap_tu_de_thi.mjs --khoi 8 --ghi      # ghi DB (1 transaction); bài đã nhập (theo nguon_ma_cau) thì bỏ qua
//   --loc '<regex>'  chỉ lấy đề có TÊN khớp (không phân biệt hoa thường), vd K7 19/10: --loc 'giữa học kì 1|giữa kì I'
//
// Luật tách (máy làm phần CHẮC, phần không chắc để nguyên và gắn cờ — §1.5 thà bỏ trống còn hơn đánh sai):
//   · ĐỀ: mốc ý = "a)" "b)" "c)"… nối tiếp nhau. Trước "a)" = giả thiết chung. Câu dẫn cuối kết thúc bằng ":" ("Chứng minh rằng:")
//     được chép vào đầu TỪNG ý để ý đứng độc lập.
//   · LỜI GIẢI: "Phần 1. Hướng dẫn" = hướng dẫn chung của BÀI; "Phần 2. Trình bày" tách theo cùng các mốc a) b) c).
//   · Số ý ở đề ≠ số đoạn ở lời giải ⇒ KHÔNG tách: bài vào kho với 1 ý chứa trọn đề + trọn lời giải, cờ `can_tach_tay`.
//   · `gia_thiet_them` của ý để TRỐNG (máy không chắc ranh giới "dữ kiện mới" ↔ "câu hỏi") — người điền khi duyệt.
//   · Mô hình / bài mô hình: KHÔNG gán (chưa có mô hình luyện) ⇒ nằm ở Duyệt kho › "chưa phân mô hình".
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import pg from 'pg'

const arg = (k, d = null) => { const i = process.argv.indexOf(k); return i >= 0 ? (process.argv[i + 1] ?? true) : d }
const khoi = String(arg('--khoi', '8'))
const LOC = arg('--loc')   // regex trên tên đề (Postgres ~*)
const THU = process.argv.includes('--thu')          // ghi thật rồi ROLLBACK — kiểm ràng buộc/trigger mà không để lại gì
const GHI = process.argv.includes('--ghi') || THU
const txt = readFileSync(new URL('../../.env', import.meta.url), 'utf8')
const lay = (k) => { const m = txt.match(new RegExp('^[ \\t]*' + k + '[ \\t]*=[ \\t]*(.+?)[ \\t\\r]*$', 'm')); return m ? m[1].replace(/^["']|["']$/g, '') : null }
const url = GHI ? lay('DATABASE_URL') : (lay('DATABASE_URL_RO') || lay('DATABASE_URL'))
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

// ── tách theo mốc NỐI TIẾP: họ chữ a) b) c)… hoặc họ số 1) 2) 3)… ──
// Chữ: mốc đứng đầu dòng hoặc sau khoảng trắng. Số: CHỈ nhận ở đầu dòng (tránh "(1)", "hình 1)" giữa câu).
function tachMotHo(s, ho, tu0 = 0) {
  const moc = []
  let i = 0, tu = tu0
  while (i < ho.length) {
    const re = ho === SO
      ? new RegExp(String.raw`(^|\n)[ \t]*\*{0,2}` + ho[i] + String.raw`\)\*{0,2}[ \t]+`, 'g')
      : new RegExp(String.raw`(^|\n|[ \t])[ \t]*\*{0,2}` + ho[i] + String.raw`\)\*{0,2}[ \t]+`, 'g')
    re.lastIndex = tu
    const m = re.exec(s)
    if (!m) break
    moc.push({ nhan: ho[i], batDau: m.index + m[1].length, noiDungTu: m.index + m[0].length })
    tu = m.index + m[0].length; i++
  }
  if (moc.length < 2) return null
  return {
    truoc: s.slice(0, moc[0].batDau).trim(),
    y: moc.map((x, k) => ({ nhan: x.nhan, text: s.slice(x.noiDungTu, k + 1 < moc.length ? moc[k + 1].batDau : s.length).trim() })),
  }
}
const CHU = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], SO = ['1', '2', '3', '4', '5', '6', '7', '8']
export function tachTheoMoc(s, hoBatBuoc = null) {
  if (hoBatBuoc) return tachMotHo(s, hoBatBuoc)
  const c = tachMotHo(s, CHU), n = tachMotHo(s, SO)
  if (c && n) return c.truoc.length <= n.truoc.length ? { ...c, ho: CHU } : { ...n, ho: SO }   // họ nào mở đầu SỚM hơn là tầng ngoài
  return c ? { ...c, ho: CHU } : n ? { ...n, ho: SO } : null
}
// câu dẫn cuối của giả thiết chung, kết thúc bằng ":" (vd "Chứng minh rằng:") ⇒ tách ra để gắn vào từng ý
function tachCauDan(chung) {
  const m = chung.match(/^([\s\S]*?[.!?)\]$])\s+([^.!?\n]{2,80}:)\s*$/)
  if (m) return { chung: m[1].trim(), dan: m[2].trim() }
  if (/^[^.!?\n]{2,80}:\s*$/.test(chung)) return { chung: '', dan: chung.trim() }
  return { chung, dan: '' }
}
function tachLoiGiaiCuoi(s, ho, n) {
  const dau = new RegExp(String.raw`(^|
|[ 	])[ 	]*\*{0,2}` + ho[0] + String.raw`\)\*{0,2}[ 	]+`, 'g')
  const viTri = []; let m
  while ((m = dau.exec(s))) viTri.push(m.index)
  for (let k = viTri.length - 1; k >= 0; k--) {
    const t = tachMotHo(s, ho, viTri[k])
    if (t && t.y.length === n) return t
  }
  return null
}
const boDau = (s) => s.replace(/^\*\*Phần\s*\d+[^*]*\*\*\s*/i, '').trim()

function tachBai(r) {
  const de = (r.noi_dung || '').trim(), lg = (r.loi_giai || '').trim()
  const co = []
  // lời giải: Phần 1 / Phần 2
  const p2 = lg.search(/\*\*Phần\s*2[^*]*\*\*/i)
  const huongDan = p2 > 0 ? boDau(lg.slice(0, p2)) : null
  const trinhBay = p2 >= 0 ? boDau(lg.slice(p2)) : lg
  const d = tachTheoMoc(de)
  if (!d) {
    return { loai: 'mot_y', chung: null, huongDan, y: [{ nhan: null, hoi: de, loiGiai: trinhBay || null }], co }
  }
  // câu Đúng/Sai nhiều mệnh đề: các mệnh đề ĐỘC LẬP, lời giải thường gộp/đảo thứ tự ⇒ không phải chuỗi ý — để nguyên 1 ý, gắn cờ
  // (K7 19/10) đề không ghi chữ "đúng sai" nhưng lời giải chốt "khẳng định a) đúng / b) sai" ⇒ vẫn là câu Đúng/Sai
  const lgDungSai = /khẳng định\s*[a-h]\)?\s*(là\s*)?(đúng|sai)|kết luận:\s*\n?\s*[a-h]\)\s*(đúng|sai)/i.test(trinhBay)
  if (r.loai_cau === 'dung_sai' || lgDungSai || /đúng hay sai|khẳng định nào đúng|đúng\s*\/\s*sai|tính đúng sai|đúng sai của/i.test(d.truoc)) {
    co.push('dang_dung_sai: để nguyên 1 ý')
    return { loai: 'khong_tach', chung: null, huongDan, y: [{ nhan: null, hoi: de, loiGiai: trinhBay || null }], co }
  }
  // (K7 19/10) mô tả hình "Theo hình vẽ: …" đặt SAU ý cuối ⇒ thuộc giả thiết chung, không thuộc ý cuối
  const cuoi = d.y[d.y.length - 1], iTheo = cuoi.text.search(/\n\s*Theo hình vẽ/i)
  if (iTheo > 0) {
    const theo = cuoi.text.slice(iTheo).trim(); cuoi.text = cuoi.text.slice(0, iTheo).trim()
    const dong = d.truoc.split('\n')   // câu dẫn "…:" ở dòng cuối phải đứng SAU mô tả hình để còn gắn vào từng ý
    if (/:\s*$/.test(dong[dong.length - 1] ?? '')) dong.splice(dong.length - 1, 0, theo); else dong.push(theo)
    d.truoc = dong.join('\n').trim()
  }
  const { chung, dan } = tachCauDan(d.truoc)
  // Lời giải hay mở đầu bằng khối "GT … KL: a) …; b) …" ⇒ chuỗi mốc ĐẦU TIÊN là danh sách KL, không phải lời giải.
  // Lấy chuỗi mốc a→n (n = số ý của đề) BẮT ĐẦU MUỘN NHẤT; mọi thứ trước nó (GT/KL, vẽ hình) vào đầu lời giải ý a. (K7 19/10)
  const g = tachLoiGiaiCuoi(trinhBay, d.ho, d.y.length) ?? tachTheoMoc(trinhBay, d.ho)
  if (!g || g.y.length !== d.y.length || g.y.some((x, i) => x.nhan !== d.y[i].nhan)) {
    co.push(`can_tach_tay: đề ${d.y.length} ý, lời giải ${g ? g.y.length : 0} đoạn`)
    return { loai: 'khong_tach', chung: null, huongDan, y: [{ nhan: null, hoi: de, loiGiai: trinhBay || null }], co }
  }
  if (g.truoc && g.truoc.length > 30) co.push('loi_giai_co_doan_mo_dau_chung')   // đoạn trước "a)" ở lời giải ⇒ nhét vào ý a
  return {
    loai: 'nhieu_y', chung: chung || null, huongDan,
    y: d.y.map((x, i) => ({
      nhan: x.nhan,
      hoi: dan ? `${dan} ${x.text}` : x.text,
      loiGiai: (i === 0 && g.truoc ? g.truoc + '\n\n' : '') + g.y[i].text,
    })),
    co,
  }
}

// ── nguồn: câu Hình tự luận / trả lời ngắn của đề thi khối này (trắc nghiệm KHÔNG lấy — chờ CEO) ──
const nguon = await q(`
  select distinct on (h.ma_cau) h.ma_cau, h.loai_cau, h.noi_dung, h.dap_an, h.loi_giai, h.anh_de, h.anh_dap_an, t.ten as ten_de, t.id as tai_lieu_id
    from tai_lieu t
    join tai_lieu_phan p on p.tai_lieu_id = t.id
    join tai_lieu_cau tc on tc.phan_id = p.id
    join hinh_hoc_cau_hoi h on h.ma_cau = tc.ma_cau
   where t.loai = 'de_thi' and t.khoi = $1 and h.xoa_at is null and h.loai_cau in ('tu_luan', 'tra_loi_ngan')
     and ($2::text is null or t.ten ~* $2)
   order by h.ma_cau, t.created_at`, [khoi, LOC === true ? null : LOC])
const daCo = new Set((await q(`select nguon_ma_cau from hinh_bai where nguon_ma_cau is not null`).catch(() => [])).map((r) => r.nguon_ma_cau))

const ra = []
for (const r of nguon) {
  const t = tachBai(r)
  if (!(r.loi_giai || '').trim()) t.co.push('khong_co_loi_giai')
  ra.push({ nguon_ma_cau: r.ma_cau, loai_cau: r.loai_cau, ten_de: r.ten_de, de_bai: (r.noi_dung || '').trim(), dap_an: r.dap_an || null,
    anh_de: r.anh_de || null, anh_loi_giai: r.anh_dap_an || null, da_co: daCo.has(r.ma_cau), ...t })
}
const dem = (f) => ra.filter(f).length
console.log(`Khối ${khoi}: ${ra.length} bài nguồn (tự luận ${dem((x) => x.loai_cau === 'tu_luan')} · trả lời ngắn ${dem((x) => x.loai_cau === 'tra_loi_ngan')})`)
console.log(`  tách nhiều ý: ${dem((x) => x.loai === 'nhieu_y')} bài → ${ra.filter((x) => x.loai === 'nhieu_y').reduce((s, x) => s + x.y.length, 0)} ý`)
console.log(`  một ý       : ${dem((x) => x.loai === 'mot_y')}`)
console.log(`  KHÔNG tách được (để 1 ý, cờ can_tach_tay): ${dem((x) => x.loai === 'khong_tach')}`)
console.log(`  có giả thiết chung: ${dem((x) => x.chung)} · có hướng dẫn chung: ${dem((x) => x.huongDan)} · có hình đề: ${dem((x) => x.anh_de)} · có hình lời giải: ${dem((x) => x.anh_loi_giai)}`)
console.log(`  đã nhập từ trước: ${dem((x) => x.da_co)}`)
for (const x of ra.filter((x) => x.co.length)) console.log(`  ⚑ ${x.nguon_ma_cau}: ${x.co.join(' · ')}`)

const thuMuc = new URL('./nhap/', import.meta.url)
mkdirSync(thuMuc, { recursive: true })
writeFileSync(new URL(`k${khoi}-de-thi.json`, thuMuc), JSON.stringify(ra, null, 1))
console.log(`Bản nháp: scripts/hinh-luyen/nhap/k${khoi}-de-thi.json`)

if (!GHI) { console.log('\n(chạy khô — chưa ghi DB; thêm --ghi để ghi)'); await c.end(); process.exit(0) }

await c.query('BEGIN')
try {
  let nBai = 0, nY = 0
  for (const x of ra) {
    if (x.da_co) continue
    const [b] = await q(
      `insert into hinh_bai(de_bai, anh_de, nguon, khoi, trang_thai, gia_thiet_chung, huong_dan, nguon_ma_cau, can_tach_tay, loai_cau)
       values ($1,$2,$3,$4,'tam',$5,$6,$7,$8,$9) returning id`,
      [x.de_bai, x.anh_de, x.ten_de, khoi, x.chung, x.huongDan, x.nguon_ma_cau, x.loai === 'khong_tach', x.loai_cau]) // loai_cau = loại câu gốc (mig 202610181623): hàng duyệt mô hình chỉ lấy 'tu_luan'
    nBai++
    for (let i = 0; i < x.y.length; i++) {
      const y = x.y[i]
      await q(`insert into hinh_y(bai_id, thu_tu, nhan_hien_thi, noi_dung, dap_an, loi_giai, anh_loi_giai) values ($1,$2,$3,$4,$5,$6,$7)`,
        [b.id, i + 1, y.nhan, y.hoi, x.y.length === 1 ? x.dap_an : null, y.loiGiai, x.anh_loi_giai])
      nY++
    }
  }
  await c.query(THU ? 'ROLLBACK' : 'COMMIT')
  console.log(`
${THU ? "🧪 THỬ — đã ROLLBACK, DB không đổi" : "✅ ĐÃ GHI"}: ${nBai} bài kho · ${nY} ý (khối ${khoi})`)
} catch (e) { await c.query('ROLLBACK'); console.log('❌ LỖI — đã rollback:', e.message); process.exitCode = 1 }
await c.end()
