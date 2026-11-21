// 5t-nhap-me.mjs — nhập sách ME "250+ Bài toán chọn lọc lớp 5" vào kho 5T (Thùy 21/11: chỉ GHÉP câu + đáp án + lời giải sách, không giải lại;
// bài gọi ẩn ở các dạng cho phép gọi ẩn thì nhập bình thường).
//   node scripts/kho/5t-nhap-me.mjs [--cd 1,2,…] [--ghi]     (mặc định chạy thử rồi ROLLBACK)
// Phạm vi: mục KHÔNG `chua_chac` và KHÔNG `co_hinh` (262/328). 66 mục còn lại chờ người xem ảnh trang trước.
// Mỗi câu: khối 5T · ten_de_goc "Toán 5 ME · <mã>" · đề xuất dạng theo ME-gan-dang-chi-tiet.json (dang_bai_chac 'vua' ⇒ đề xuất chờ duyệt, KHÔNG tự gán)
// · lời giải = lời giải SÁCH đã bỏ ký hiệu đầu dòng (➤ ▸ ▶ » → -), chỉ MỘT cách (Cách 1) + dòng Đáp số · kiem_may='nghi' (chưa kiểm máy đáp số,
// chưa soạn Phần 1) ⇒ KHÔNG tự duyệt, vào hàng người kiểm / trưởng khối.
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { insertCauBatch } from '../_kho_insert.mjs'
process.loadEnvFile('.env')
const a = process.argv.slice(2)
const GHI = a.includes('--ghi')
const cdArg = a.includes('--cd') ? new Set(a[a.indexOf('--cd') + 1].split(',').map(Number)) : null
const gan = JSON.parse(readFileSync('kho-rules/dai/lo/me5-250/ME-gan-dang-chi-tiet.json', 'utf8')).me

const lamSachLoiGiai = (raw) => {
  const dong = String(raw ?? '').split(/\r?\n/).map((l) => l.replace(/^\s*(?:[➤▶▸»→]|-(?=\s))+\s*/, '').trim()).filter(Boolean)
  const laC = (l) => /^Cách\s*(\d+)\s*[:.]?\s*$/i.test(l)
  const i2 = dong.findIndex((l) => /^Cách\s*2\s*[:.]?\s*$/i.test(l))
  let ra = dong, cat = false
  if (i2 >= 0) {
    const i1 = dong.findIndex((l) => /^Cách\s*1\s*[:.]?\s*$/i.test(l))
    ra = dong.slice(i1 >= 0 ? i1 + 1 : 0, i2)
    const ds = [...dong].reverse().find((l) => /^Đáp số/i.test(l))
    if (ds && !ra.some((l) => /^Đáp số/i.test(l))) ra.push(ds)
    cat = true
  } else ra = dong.filter((l) => !laC(l))
  return { text: ra.join('\n\n'), catCach2: cat }
}

const mucs = []
for (let cd = 1; cd <= 14; cd++) {
  if (cdArg && !cdArg.has(cd)) continue
  const j = JSON.parse(readFileSync(`kho-rules/dai/lo/me5-250/ME-CD${String(cd).padStart(2, '0')}.json`, 'utf8'))
  for (const m of j) if (!m.chua_chac && !m.co_hinh) mucs.push({ ...m, cd })
}
const goiAn = (t) => /(^|\n)\s*(?:[➤▶▸»→-]\s*)*(Gọi|gọi|Đặt|Đặt)\s/.test(t) || /\\overline\{/.test(t) && /Gọi|gọi/.test(t)
const cauList = mucs.map((m) => {
  const { text, catCach2 } = lamSachLoiGiai(m.loi_giai_sach)
  const g = gan[m.ma]
  const nhieuY = /(^|\s)a\)/.test(m.noi_dung) && /(^|\s)b\)/.test(m.noi_dung)
  const ghi = ['Sách ME nhập ghép (chưa kiểm máy đáp số, chưa soạn Phần 1 hướng dẫn)']
  if (goiAn(m.loi_giai_sach)) ghi.push('lời giải sách có gọi ẩn / đặt chữ — dạng cho phép gọi ẩn (Thùy 21/11); trưởng khối xem')
  if (catCach2) ghi.push('sách có Cách 2 — chỉ giữ Cách 1')
  return {
    khoi: '5T',
    loai_cau: nhieuY ? 'tu_luan' : 'tra_loi_ngan',
    noi_dung: m.noi_dung.trim(),
    dap_an: String(m.dap_an).trim(),
    loi_giai: text,
    ten_de_goc: `Toán 5 ME · ${m.ma}`,
    nguon: 'le',
    ...(g?.dang_id ? { dang_bai: g.dang_id, dang_bai_chac: 'vua', dang_bai_ly_do: `ME CĐ${m.cd} ${m.ma}: ${g.nguon} (đề xuất sơ bộ)` } : {}),
    kiem_may_nghi: ghi.join('; '),
    _ma: m.ma,
  }
})

if (a.includes('--xem')) { for (const k of a[a.indexOf('--xem') + 1].split(',')) { const q = cauList.find((x) => x._ma === k); console.log('=====', k, q.loai_cau, '|', q.dap_an, '|', q.dang_bai ?? '—', '|', q.kiem_may_nghi, '\n', q.noi_dung, '\n--\n', q.loi_giai) } process.exit(0) }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  const truoc = (await c.query(`select count(*)::int n from dai_cau_hoi where ten_de_goc like 'Toán 5 ME%' and xoa_at is null`)).rows[0].n
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList: cauList.map(({ _ma, ...q }) => q) })
  const moi = r.maCauList.length - r.trung.length
  const sau = (await c.query(`select count(*)::int n from dai_cau_hoi where ten_de_goc like 'Toán 5 ME%' and xoa_at is null`)).rows[0].n
  const nghi = (await c.query(`select count(*)::int n from dai_cau_hoi where ten_de_goc like 'Toán 5 ME%' and xoa_at is null and kiem_may='nghi'`)).rows[0].n
  const duyet = (await c.query(`select count(*)::int n from dai_cau_hoi where ten_de_goc like 'Toán 5 ME%' and xoa_at is null and da_duyet`)).rows[0].n
  const goi = cauList.filter((q) => /gọi ẩn/.test(q.kiem_may_nghi)).length
  console.log({ phamVi: cauList.length, moi, trung: r.trung.map((t) => cauList[t.idx]._ma + (t.ma_cau_cu ? '→' + t.ma_cau_cu : '')), truoc, sau, kiem_may_nghi: nghi, da_duyet: duyet, goiAn: goi, bdm: { ...r.bdm, khoi: [...r.bdm.khoi] }, chuaCoDang: cauList.filter((q) => !q.dang_bai).length })
  if (duyet) throw new Error('có câu ME tự duyệt — không mong muốn, ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
