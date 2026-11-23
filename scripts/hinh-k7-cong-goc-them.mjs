// Đẩy THÊM bài vào chuyên đề HH00171 "Phương pháp cộng góc" (Thùy 23/11: "sao ít bài tập thế, đẩy thêm vào đi").
//
// Gốc: 16/11 `hinh-k7-day-thang-hang.mjs` chỉ chuyển ý/câu thẳng hàng ĐÃ tách bài–ý; 32 câu nhiều ý CHƯA tách (đề thi 13/11, dạng chờ HH07000000)
//      được ghi "cần tách bài–ý trước" nhưng chưa ai làm ⇒ HH00171 chỉ còn 6 bài–ý.
// Làm (đúng luật spec-giai-bai.md, Khối 7 › Hình, "Phân dạng câu chứng minh ba điểm thẳng hàng": câu nhiều ý mà ý trọng tâm là thẳng hàng thì CẢ CÂU theo bài đó):
//   · đã ĐỌC lời giải từng câu: ý thẳng hàng chứng minh bằng CỘNG GÓC (hai góc kề nhau tổng 180°, hai điểm khác phía ⇒ hai tia đối nhau) ⇒ MAP bên dưới;
//   · cắt đề + lời giải thành bài–ý bằng chính bộ cắt của `kho-rules/hinh/lo/tach-y/tach.mjs` (+ bước Phần 1 gắn nhiều ý "Ý a và b:", "Ý b) c)" tách ra từng ý);
//   · ghi: 1 `hinh_hoc_bai_y` (dang_chinh = HH00171, ma_cau_goc = câu cũ) + mỗi ý một câu; câu cũ `rut_khoi_kho = true` (KHÔNG xoá, KHÔNG sửa nội dung).
//   Không đụng câu đã duyệt / đã nằm ở dạng khác. Một transaction. Mặc định chạy thử rồi ROLLBACK.
//   node scripts/hinh-k7-cong-goc-them.mjs          # chạy thử
//   node scripts/hinh-k7-cong-goc-them.mjs --ghi
import pg from 'pg'
import { bien } from './kho/cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const DICH = 'HH00171'
// ma_cau → ý thẳng hàng (đã đọc lời giải: cộng hai góc kề bù, hai điểm khác phía)
const MAP = {
  HHC015077: 'c · A, E, F — ACF = EBF (c.g.c) ⇒ AFC = EFB, cộng kề bù AFC + AFB = 180°',
  HHC015086: 'd · F, D, E — ADF = EDC ⇒ ADE + ADF = 180°',
  HHC015113: 'b · F, D, E — BDF = EDC ⇒ BDE + BDF = 180°',
  HHC015125: 'd · F, D, E — ADF = EDC ⇒ ADE + ADF = 180°',
  HHC015139: 'd · D, F, E — ADF = EDC ⇒ FDE = ADF + ADE = 180°',
  HHC015154: 'd · F, D, E — ADF = EDC ⇒ ADE + ADF = 180°',
  HHC019003: 'c · K, D, E — ADK = EDC ⇒ KDE = KDA + ADE = 180°',
  HHC015126: 'd · H, I, K — AIK = CIH ⇒ AIK + AIH = 180°',
  HHC015168: 'c · A, O, E — OBE = OIA ⇒ BOA + BOE = 180°',
  HHC015204: 'c · M, O, N — OBM = ODN ⇒ MON = MOD + DON = 180°',
}
// Không đưa: HHC015116 (trùng đề HHC015168 — chỉ lấy một bản) · HHC015210 (máy kiểm "nghi": ý c bị đổi góc theo suy luận, cần người xác nhận đề gốc)

// ───────── bộ cắt (cùng logic kho-rules/hinh/lo/tach-y/tach.mjs) ─────────
const NHAN = /^[ \t]*(?:\*\*)?([a-h]|[1-9])(\*?)\)(?:\*\*)?[ \t]*/
function tach(text) {
  const lines = (text ?? '').replace(/\r\n/g, '\n').split('\n')
  const dau = [], ys = []
  for (const ln of lines) {
    const m = ln.match(NHAN)
    if (m) ys.push({ nhan: m[1] + (m[2] ? '*' : ''), dong: [ln.slice(m[0].length)] })
    else if (ys.length) ys[ys.length - 1].dong.push(ln)
    else dau.push(ln)
  }
  const gon = (a) => a.join('\n').replace(/\n{2,}/g, '\n').trim()
  return { dau: gon(dau), ys: ys.map((y) => ({ nhan: y.nhan, text: gon(y.dong) })) }
}
const P2 = /^\*\*Phần 2\.[^\n]*$/m
function loiGiaiTheoY(raw, nhans) {
  const t = (raw ?? '').replace(/\r\n/g, '\n')
  const m2 = t.match(P2)
  const nul = () => Object.fromEntries(nhans.map((n) => [n, null]))
  if (!(/^\*\*Phần 1\./m.test(t) && m2)) {      // lời giải không chia 2 phần: đoạn trước ý đầu là chung, ghép trước đoạn của mỗi ý
    const t1 = tach(t)
    return Object.fromEntries(nhans.map((n) => { const y = t1.ys.find((z) => z.nhan === n)?.text; return [n, y ? [t1.dau, y].filter(Boolean).join('\n') : null] }))
  }
  const p1 = t.slice(0, m2.index).split('\n'), p2 = t.slice(m2.index + m2[0].length)
  const chung = [], buoc = []
  let cur = null
  for (const ln of p1) {
    if (/^\*\*Phần 1\./.test(ln) || !ln.trim()) continue
    const mb = ln.match(/^\*\*Bước \d+\.\*\*\s*(.*)$/)
    if (!mb) { if (!cur && !buoc.length) chung.push(ln); else buoc.push({ y: cur, text: ln, noi: true }); continue }
    const my = mb[1].match(/^Ý ([a-h1-9])\*?(?:\s*[):,.]\s*|\s+)/)
    if (my) cur = my[1]
    buoc.push({ y: cur, text: my ? mb[1].slice(my[0].length) : mb[1] })
  }
  const t2 = tach(p2), out = {}
  if (!buoc.length) {                              // Phần 1 chia theo nhãn a) b) (không có dòng "Bước"): chỉ nhận khi nhãn khớp ĐÚNG danh sách ý của đề
    const t1 = tach(p1.filter((ln) => !/^\*\*Phần 1\./.test(ln)).join('\n'))
    if (t1.ys.map((y) => y.nhan).join(',') !== nhans.join(',')) return nul()
    for (const n of nhans) {
      const y1 = t1.ys.find((z) => z.nhan === n)?.text, y2 = t2.ys.find((z) => z.nhan === n)?.text
      out[n] = y1 && y2 ? ['**Phần 1. Hướng dẫn**', ...(t1.dau ? [t1.dau] : []), y1, '', m2[0], ...(t2.dau ? [t2.dau] : []), y2].join('\n') : null
    }
    return out
  }
  for (const n of nhans) {
    const goc = n.replace('*', '')
    const bs = buoc.filter((x) => x.y === null || x.y === goc)
    let k = 0
    const p1y = bs.map((x) => (x.noi ? x.text : `**Bước ${++k}.** ${x.text.charAt(0).toUpperCase()}${x.text.slice(1)}`))
    const y2 = t2.ys.find((z) => z.nhan === n)?.text
    out[n] = !y2 || !bs.length ? null : ['**Phần 1. Hướng dẫn**', ...chung, ...p1y, '', m2[0], ...(t2.dau ? [t2.dau] : []), y2].join('\n')
  }
  return out
}
// bước Phần 1 gắn nhiều ý ("Ý a và b: …" · "Ý b) c) …") ⇒ một bước cho mỗi ý (chữ giữ nguyên)
const nhieuY = (t) => (t ?? '').replace(/\r\n/g, '\n').split('\n').flatMap((ln) => {
  const m = ln.match(/^(\*\*Bước \d+\.\*\*)\s*Ý ([a-h])(?:\)\s*|\s*(?:và|,)\s*(?:ý\s*)?)([a-h])(?:\)|:)\s*(.*)$/)
  return m ? [m[1] + ' Ý ' + m[2] + ': ' + m[4], m[1] + ' Ý ' + m[3] + ': ' + m[4]] : [ln]
}).join('\n')

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const ids = Object.keys(MAP)
  const rows = (await c.query(`select * from hinh_hoc_cau_hoi where ma_cau = any($1) order by ma_cau for update`, [ids])).rows
  if (rows.length !== ids.length) throw new Error('thiếu câu: ' + ids.filter((i) => !rows.some((r) => r.ma_cau === i)).join(' '))
  let nBai = 0, nY = 0
  const ghiLai = []
  for (const q of rows) {
    if (q.xoa_at || q.rut_khoi_kho || q.bai_y || q.da_duyet || q.dang_chinh !== 'HH07000000' || q.loai_cau !== 'tu_luan') throw new Error(`${q.ma_cau}: không còn ở trạng thái lúc đọc (xoá/đã rút/đã là ý/đã duyệt/đã phân dạng)`)
    if ((await c.query(`select 1 from hinh_hoc_bai_y where ma_cau_goc = $1`, [q.ma_cau])).rowCount) throw new Error(`${q.ma_cau}: đã có bài–ý`)
    const de = tach(q.noi_dung)
    if (!de.dau || de.ys.length < 2 || de.ys.some((y) => !y.text)) throw new Error(`${q.ma_cau}: đề cắt không sạch`)
    const lg = loiGiaiTheoY(nhieuY(q.loi_giai), de.ys.map((y) => y.nhan))
    if (de.ys.some((y) => !lg[y.nhan])) throw new Error(`${q.ma_cau}: lời giải không cắt được cho ý ${de.ys.filter((y) => !lg[y.nhan]).map((y) => y.nhan).join(',')}`)
    const b = (await c.query(`insert into hinh_hoc_bai_y (dang_chinh, loi_dan, anh_de, ma_cau_goc, thu_tu) values ($1,$2,$3,$4,$5) returning ma_bai_y`,
      [DICH, de.dau, q.anh_de, q.ma_cau, q.thu_tu])).rows[0].ma_bai_y
    for (const y of de.ys) {
      await c.query(`insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, bai_y, nhan_y, cau_hoi_y, loi_giai, anh_dap_an, loai_cau, ma_cum, mo_hinh_id, thu_tu,
                       da_duyet, duyet_boi, duyet_at, duyet_nguon, nguon, nguon_giai, giai_method, kiem_may, kiem_may_boi, kiem_may_ghi, kiem_may_at, created_at)
                     values ($1,'',$2,$3,$4,$5,$6,'tu_luan',$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
        [DICH, b, y.nhan, y.text, lg[y.nhan], q.anh_dap_an, q.ma_cum, q.mo_hinh_id, q.thu_tu,
         q.da_duyet, q.duyet_boi, q.duyet_at, q.duyet_nguon, q.nguon, q.nguon_giai, q.giai_method, q.kiem_may, q.kiem_may_boi, q.kiem_may_ghi, q.kiem_may_at, q.created_at])
      nY++
    }
    await c.query(`update hinh_hoc_cau_hoi set rut_khoi_kho = true where ma_cau = $1`, [q.ma_cau])
    nBai++
    ghiLai.push(`${q.ma_cau} → ${b}  ${de.ys.map((y) => y.nhan).join('')}  | ${MAP[q.ma_cau]}`)
  }
  // kiểm sau ghi: đủ bài, đủ ý, đề ghép đúng, bài học = HH00171, trạng thái kho của ý = của câu cũ, câu cũ đã rút
  const k = (await c.query(`
    select count(distinct y.ma_bai_y) bai, count(q.*) y,
           count(*) filter (where q.noi_dung <> y.loi_dan || E'\\n' || q.cau_hoi_y) de_sai,
           count(*) filter (where q.dang_chinh <> '${DICH}' or y.dang_chinh <> '${DICH}') dang_sai,
           count(*) filter (where _kho_cau_chuan(q.da_duyet, q.kiem_may, q.created_at, q.giai_method) <> _kho_cau_chuan(g.da_duyet, g.kiem_may, g.created_at, g.giai_method)) trang_thai_sai,
           count(*) filter (where not g.rut_khoi_kho) goc_chua_rut
      from hinh_hoc_bai_y y join hinh_hoc_cau_hoi q on q.bai_y = y.ma_bai_y join hinh_hoc_cau_hoi g on g.ma_cau = y.ma_cau_goc
     where y.ma_cau_goc = any($1)`, [ids])).rows[0]
  const sau = (await c.query(`select count(distinct bai_y) bai, count(*) y, count(*) filter (where kho_chuan) chuan from hinh_hoc_cau_hoi where dang_chinh = $1 and xoa_at is null and coalesce(rut_khoi_kho,false) = false`, [DICH])).rows[0]
  console.log(ghiLai.join('\n'))
  console.log('bài', nBai, '| ý', nY, '| kiểm:', k, '\nHH00171 sau khi ghi (bài–ý / ý / ý trong kho chuẩn):', sau)
  if (+k.bai !== nBai || +k.y !== nY || +k.de_sai || +k.dang_sai || +k.trang_thai_sai || +k.goc_chua_rut) throw new Error('Kiểm sau ghi KHÔNG đạt — huỷ cả lô')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI (commit)' : '(chạy thử — đã ROLLBACK, thêm --ghi để ghi thật)')
} catch (e) { await c.query('rollback'); console.error('✘ HUỶ cả lô:', e.message); process.exitCode = 1 }
await c.end()
