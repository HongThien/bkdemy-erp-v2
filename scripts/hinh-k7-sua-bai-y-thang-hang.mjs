// Sửa 2 lỗi (Thùy 16/11 "bài lẫn đề vào nhau" + "bên thẳng hàng chỉ có câu c — phục hồi đủ số câu"):
//  A. Bài–ý của "Hình học" HH00025 (bản tách ý 09/11) có LỜI DẪN dính chuỗi thừa "Cho hình vẽ. Biết xOt=33°. Tính zOy." + nhãn "Bài N" của bài trước,
//     và ý a) bị nuốt vào lời dẫn nên MẤT ý a. ⇒ dọn lời dẫn (chỉ giữ giả thiết) + tách lại ý a từ câu gốc (ma_cau_goc: câu hỏi + phần lời giải "a)").
//     Bài_y mới do hinh-k7-day-thang-hang.mjs chép nguyên lỗi đó ⇒ dọn luôn.
//  B. Mỗi bài_y thẳng hàng (HHB000900–917) có thêm các ý ĐỨNG TRƯỚC ý thẳng hàng của bài gốc (a, b, … ), để ở thẳng hàng thấy đủ a–b–c.
//     Bản chép của ý bối cảnh để rut_khoi_kho = true (không vào kho chuẩn ⇒ không phát cho HS luyện, không lẫn vào đo thẳng hàng); ý thẳng hàng giữ nguyên.
//   node scripts/hinh-k7-sua-bai-y-thang-hang.mjs          # chạy thử (ROLLBACK)
//   node scripts/hinh-k7-sua-bai-y-thang-hang.mjs --ghi
import pg from 'pg'
import { writeFileSync, readFileSync } from 'node:fs'
import { bien } from './kho/cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
const JUNK = /^Cho hình vẽ\.\s*Biết \$\\widehat\{xOt\}=33\^\\circ\$\.\s*Tính \$\\widehat\{zOy\}\$\.\s*/
const NHAN_BAI = /^Bài\s*[\d.]+\s*[.:]?\s*(\(\d+ điểm\)\s*)?/
const CAT_Y = /(^|\s)a\)\s/
const don = (s) => { let t = s.replace(JUNK, '').replace(NHAN_BAI, ''); const m = t.search(CAT_Y); if (m >= 0) t = t.slice(0, m); return t.replace(/\s+$/, '').trim() }
const thuTuY = (n) => (/^\d+$/.test(n) ? Number(n) : n.charCodeAt(0) - 96)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  const bb = JSON.parse(readFileSync('kho-rules/hinh/k7-thang-hang/bien-ban-truoc.json', 'utf8')).filter((x) => x.bai_y) // ý đã chuyển: bai_y = bài_y CŨ
  const bien_ban = { loi_dan_cu: {}, them_y_a: [], them_y_boi_canh: [] }

  // ───── A. dọn lời dẫn + tách lại ý a ─────
  const ds = await q(`select y.ma_bai_y, y.dang_chinh, y.ma_cau_goc, y.loi_dan from hinh_hoc_bai_y y join hinh_hoc_bai b on b.ma_bai = y.dang_chinh where b.khoi = '7' and y.xoa_at is null and y.loi_dan ~ 'xOt\\}=33'`)
  console.log('bài_y lời dẫn dính chuỗi thừa:', ds.length)
  const phanA = []
  for (const y of ds) {
    const sach = don(y.loi_dan)
    if (sach.length < 25 || /^Cho hình vẽ/.test(sach)) throw new Error(`${y.ma_bai_y}: lời dẫn sau dọn bất thường: ${sach.slice(0, 80)}`)
    bien_ban.loi_dan_cu[y.ma_bai_y] = y.loi_dan
    await c.query(`update hinh_hoc_bai_y set loi_dan = $2 where ma_bai_y = $1`, [y.ma_bai_y, sach])
    phanA.push({ ma_bai_y: y.ma_bai_y, dang_chinh: y.dang_chinh, sach })
    // ý a: chỉ với bài_y GỐC (có ma_cau_goc) mà chưa có ý a (kể cả ý a đã chuyển đi)
    if (!y.ma_cau_goc) continue
    const co = await q(`select nhan_y from hinh_hoc_cau_hoi where bai_y = $1 and xoa_at is null`, [y.ma_bai_y])
    const daChuyen = bb.filter((x) => x.bai_y === y.ma_bai_y).map((x) => x.ma_cau)
    if (co.some((r) => r.nhan_y === 'a')) continue
    if (daChuyen.length) { const nh = await q(`select nhan_y from hinh_hoc_cau_hoi where ma_cau = any($1)`, [daChuyen]); if (nh.some((r) => r.nhan_y === 'a')) continue }
    const g = (await q(`select noi_dung, loi_giai from hinh_hoc_cau_hoi where ma_cau = $1`, [y.ma_cau_goc]))[0]
    const t0 = g.noi_dung.replace(JUNK, '').replace(NHAN_BAI, '')
    const m = t0.search(CAT_Y)
    if (m < 0) { console.log('  (bỏ qua ý a — không thấy "a)" trong câu gốc)', y.ma_bai_y); continue }
    const cauHoi = t0.slice(m).replace(CAT_Y, '').split('\n')[0].trim()
    const lg = g.loi_giai.match(/(^|\n)\s*a\)\s*([\s\S]*?)(?=\n\s*b\)|$)/)
    if (!cauHoi || !lg) { console.log('  (bỏ qua ý a — không tách được câu hỏi/lời giải)', y.ma_bai_y); continue }
    const mau = (await q(`select * from hinh_hoc_cau_hoi where bai_y = $1 and xoa_at is null order by nhan_y limit 1`, [y.ma_bai_y]))[0] ?? (await q(`select * from hinh_hoc_cau_hoi where ma_cau = $1`, [daChuyen[0]]))[0]
    const moi = (await q(
      `insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, loi_giai, loai_cau, nguon, nguon_giai, da_duyet, duyet_boi, duyet_at, duyet_nguon, bai_y, nhan_y, cau_hoi_y, thu_tu)
       values ($1,'',$2,'tu_luan',$3,$4,$5,$6,$7,$8,$9,'a',$10,$11) returning ma_cau`,
      [y.dang_chinh, lg[2].trim(), mau.nguon, mau.nguon_giai, mau.da_duyet, mau.duyet_boi, mau.duyet_at, mau.duyet_nguon, y.ma_bai_y, cauHoi, Math.max(0, (mau.thu_tu ?? 1) - 1)]))[0].ma_cau
    bien_ban.them_y_a.push({ ma_cau: moi, bai_y: y.ma_bai_y, cau_hoi_y: cauHoi })
  }
  // bài_y MỚI (chép ngày 16/11 từ hinh-k7-day-thang-hang) cũng bị lỗi — đã nằm trong ds nếu lời dẫn còn "Cho hình vẽ."

  // ───── B. đưa ý đứng trước sang bài_y thẳng hàng ─────
  const moi = await q(`select h.ma_cau, h.nhan_y, h.bai_y moi from hinh_hoc_cau_hoi h where h.ma_cau = any($1)`, [bb.map((x) => x.ma_cau)])
  for (const m of moi) {
    const cu = bb.find((x) => x.ma_cau === m.ma_cau).bai_y
    const truoc = await q(`select * from hinh_hoc_cau_hoi where bai_y = $1 and xoa_at is null and not rut_khoi_kho order by nhan_y`, [cu])
    const lay = truoc.filter((z) => thuTuY(z.nhan_y) < thuTuY(m.nhan_y))
    for (const z of lay) {
      const r = (await q(
        `insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, loi_giai, dap_an, loai_cau, nguon, nguon_giai, da_duyet, duyet_boi, duyet_at, duyet_nguon, bai_y, nhan_y, cau_hoi_y, da_biet, anh_dap_an, thu_tu, rut_khoi_kho, lua_chon, menh_de)
         values ('HH00170','',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true,$16,$17) returning ma_cau`,
        [z.loi_giai, z.dap_an, z.loai_cau, z.nguon, z.nguon_giai, z.da_duyet, z.duyet_boi, z.duyet_at, z.duyet_nguon, m.moi, z.nhan_y, z.cau_hoi_y, z.da_biet, z.anh_dap_an, z.thu_tu, z.lua_chon, z.menh_de]))[0].ma_cau
      bien_ban.them_y_boi_canh.push({ ma_cau: r, tu: z.ma_cau, bai_y: m.moi, nhan_y: z.nhan_y })
    }
  }
  // kiểm
  const loi = []
  const sau = await q(`select y.ma_bai_y, y.dang_chinh, y.loi_dan, (select string_agg(h.nhan_y || case when h.rut_khoi_kho then '~' else '' end, ',' order by h.nhan_y) from hinh_hoc_cau_hoi h where h.bai_y = y.ma_bai_y and h.xoa_at is null) ys from hinh_hoc_bai_y y where y.ma_bai_y = any($1) or y.ma_bai_y = any($2)`, [ds.map((x) => x.ma_bai_y), moi.map((x) => x.moi)])
  for (const y of sau) { if (JUNK.test(y.loi_dan) || /(^|\s)a\)\s/.test(y.loi_dan)) loi.push('lời dẫn còn lỗi ' + y.ma_bai_y) }
  const dc = await q(`select h.ma_cau, h.dang_chinh, y.dang_chinh dy from hinh_hoc_cau_hoi h join hinh_hoc_bai_y y on y.ma_bai_y = h.bai_y where h.bai_y = any($1) and h.dang_chinh <> y.dang_chinh`, [sau.map((x) => x.ma_bai_y)])
  if (dc.length) loi.push('ý lệch dang_chinh ' + dc.length)
  if (loi.length) throw new Error(loi.join('; '))
  console.log(`A: dọn ${ds.length} lời dẫn · thêm ${bien_ban.them_y_a.length} ý a`)
  console.log(`B: thêm ${bien_ban.them_y_boi_canh.length} ý bối cảnh vào ${moi.length} bài_y thẳng hàng`)
  console.log('Ý của các bài_y thẳng hàng sau sửa (~ = bối cảnh, không vào kho chuẩn):')
  for (const y of sau.filter((s) => /^HHB0009/.test(s.ma_bai_y))) console.log(' ', y.ma_bai_y, y.dang_chinh, y.ys)
  if (GHI) writeFileSync('kho-rules/hinh/k7-thang-hang/bien-ban-sua-bai-y.json', JSON.stringify(bien_ban, null, 1))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
