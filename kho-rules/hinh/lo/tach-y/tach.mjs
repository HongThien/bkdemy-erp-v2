// Tách bài nhiều ý Hình – Học (Thùy 09/11) — CHỈ ĐỌC DB, ghi nháp ra JSON để dựng HTML duyệt. Không ghi DB.
// Dùng: node --env-file=.env kho-rules/hinh/lo/tach-y/tach.mjs 7,8,8T,9
import pg from 'pg'; import fs from 'fs'
const khois = (process.argv[2] ?? '7,8,8T,9').split(',')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL }); await c.connect()
const rows = (await c.query(`select q.ma_cau, q.dang_chinh, b.khoi, b.ten_bai, q.noi_dung, q.loi_giai, q.dap_an, q.anh_de, q.anh_dap_an, q.da_duyet, q.kho_chuan, q.loai_cau
  from hinh_hoc_cau_hoi q join hinh_hoc_bai b on b.ma_bai = q.dang_chinh
  where q.xoa_at is null and q.bai_y is null and q.loai_cau = 'tu_luan' and b.khoi = any($1)
    and q.parent_ma_cau is null
    and not exists (select 1 from hinh_hoc_bai_y y where y.ma_cau_goc = q.ma_cau and y.xoa_at is null)
  order by b.khoi, q.dang_chinh, q.ma_cau`, [khois])).rows
await c.end()
// Ý = dòng bắt đầu bằng nhãn a) b*) **c)** 1) … (nhãn chữ thường a–h hoặc số 1–9), ở đầu dòng
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
// Lời giải 2 phần (Phần 1 Hướng dẫn: Mấu chốt + Bước gắn "Ý a)"/"Ý a:"; Phần 2 Trình bày/Lời giải: a) b) …) ⇒ lời giải RIÊNG từng ý:
//   Phần 1 = Mấu chốt (chung) + các bước của ý đó (bước không gắn ý thuộc ý của bước trước; trước bước gắn đầu tiên = chung), đánh số lại;
//   Phần 2 = đoạn chung trước ý đầu + đoạn của ý. Không có 2 phần ⇒ đoạn trước ý đầu là chung, ghép trước đoạn của mỗi ý.
const P2 = /^\*\*Phần 2\.[^\n]*$/m
function loiGiaiTheoY(raw, nhans) {
  const t = (raw ?? '').replace(/\r\n/g, '\n')
  const m2 = t.match(P2)
  if (/^\*\*Phần 1\./m.test(t) && m2) {
    const p1 = t.slice(0, m2.index).split('\n'), p2 = t.slice(m2.index + m2[0].length)
    const chung = [], buoc = []
    let cur = null
    for (const ln of p1) {
      if (/^\*\*Phần 1\./.test(ln) || !ln.trim()) continue
      const mb = ln.match(/^\*\*Bước \d+\.\*\*\s*(.*)$/)
      if (!mb) { if (!cur && !buoc.length) chung.push(ln); else buoc.push({ y: cur, text: ln, noi: true }); continue }
      const my = mb[1].match(/^Ý ([a-h1-9])\*?\s*[):]\s*/)
      if (my) cur = my[1]
      buoc.push({ y: cur, text: my ? mb[1].slice(my[0].length) : mb[1] })
    }
    const t2 = tach(p2)
    const out = {}
    for (const n of nhans) {
      const goc = n.replace('*', '')
      const bs = buoc.filter((x) => x.y === null || x.y === goc)
      let k = 0
      const p1y = bs.map((x) => (x.noi ? x.text : `**Bước ${++k}.** ${x.text.charAt(0).toUpperCase()}${x.text.slice(1)}`))
      const y2 = t2.ys.find((z) => z.nhan === n)?.text
      if (!y2 || !bs.length) { out[n] = null; continue }
      out[n] = ['**Phần 1. Hướng dẫn**', ...chung, ...p1y, '', m2[0], ...(t2.dau ? [t2.dau] : []), y2].join('\n')
    }
    return out
  }
  const t1 = tach(t)
  return Object.fromEntries(nhans.map((n) => { const y = t1.ys.find((z) => z.nhan === n)?.text; return [n, y ? [t1.dau, y].filter(Boolean).join('\n') : null] }))
}
const out = [], dem = { sach: 0, lech: 0, mot_y: 0 }
for (const r of rows) {
  const de = tach(r.noi_dung), lg = tach(r.loi_giai)
  if (de.ys.length < 2) { dem.mot_y++; continue }
  const lgy = loiGiaiTheoY(r.loi_giai, de.ys.map((y) => y.nhan))
  const nhanDe = de.ys.map((y) => y.nhan).join(','), nhanLg = lg.ys.map((y) => y.nhan).join(',')
  const sach = !!de.dau && de.ys.every((y) => y.text) && de.ys.every((y) => lgy[y.nhan])
  sach ? dem.sach++ : dem.lech++
  out.push({ ...r, sach, lg_dau: null, loi_dan: de.dau, ys: de.ys.map((y, i) => ({ nhan: y.nhan, cau_hoi: y.text, loi_giai: lgy[y.nhan] ?? null })),
             nhan_de: nhanDe, nhan_lg: nhanLg })
}
fs.writeFileSync('kho-rules/hinh/lo/tach-y/nhap.json', JSON.stringify(out, null, 1))
const theoKhoi = {}; for (const o of out) { theoKhoi[o.khoi] ??= { sach: 0, lech: 0 }; theoKhoi[o.khoi][o.sach ? 'sach' : 'lech']++ }
console.log('tổng câu tự luận xét:', rows.length, dem, theoKhoi)
const lech = out.filter((o) => !o.sach)
const ly = {}; for (const o of lech) { const k = !o.loi_dan ? 'không có lời dẫn' : o.ys.some((y) => !y.cau_hoi) ? 'ý rỗng' : 'không cắt được lời giải theo ý'; ly[k] = (ly[k] ?? 0) + 1 }
console.log('lý do lệch:', ly)
for (const o of lech.slice(0, 4)) console.log('---', o.ma_cau, '| đề:', o.nhan_de, '| lg:', o.nhan_lg, '| lg_dau:', (o.lg_dau ?? '').slice(0, 120))
