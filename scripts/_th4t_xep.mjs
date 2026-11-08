// Xếp 122 câu Tổng hiệu 4T (dạng cũ ẩn tổng/ẩn hiệu/thay đổi) vào 5 dạng bài Thùy thêm 26/10 — phân loại theo NGỮ CẢNH đề.
//   node scripts/_th4t_xep.mjs [--ghi]
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const GHI = process.argv.includes('--ghi')
const LUAT = [   // ngữ cảnh → dạng bài (thứ tự = thứ tự trong bản đồ; "dạng sau thắng" khi khớp 2 luật)
  ['NDB01623', 'ẩn tổng – chu vi diện tích', /chu vi|diện tích|chiều dài|chiều rộng|hình chữ nhật|mảnh (vườn|đất)|thửa ruộng/i],
  ['NDB01624', 'ẩn hiệu – số chẵn lẻ', /chẵn|lẻ|liên tiếp/i],
  ['NDB01625', 'liên quan đến tuổi', /tuổi/i],
  ['NDB01626', 'cho nhận', /(^|\s)cho\s.*\sthì\s|chuyển .* (sang|cho)|đem .* cho/i],   // \b không nhận chữ tiếng Việt
  ['NDB01627', 'tăng giảm đại lượng', /thêm|bớt|tăng|giảm|bán|mua thêm/i],
]
const caus = await q(`select q.ma_cau, q.dang_chinh, q.parent_ma_cau, q.noi_dung de,
    exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = q.ma_cau) da_gan
  from dai_cau_hoi q where q.dang_chinh in ('T14T080102','T14T080103','T14T080104') and q.xoa_at is null order by q.ma_cau`)
const ket = [], lech = []
for (const r of caus) {
  r.de = String(r.de ?? '').replace(/\s+/g, ' ')
  const khop = LUAT.filter(([, , re]) => re.test(r.de))
  // "cho nhận" là thay đổi kiểu chuyển giữa 2 bên — loại trừ khỏi "tăng giảm" khi đã khớp cho nhận
  let chon = khop.length ? khop[khop.length - 1] : null
  if (khop.some((k) => k[0] === 'NDB01626') && chon?.[0] === 'NDB01627') chon = khop.find((k) => k[0] === 'NDB01626')
  if (khop.length === 0 || (khop.length > 1 && !(khop.length === 2 && khop.some((k) => k[0] === 'NDB01626') && khop.some((k) => k[0] === 'NDB01627')))) lech.push({ ...r, khop: khop.map((k) => k[1]) })
  ket.push({ ...r, dich: chon?.[0] ?? null, ten: chon?.[1] ?? null })
}
const bang = {}
for (const k of ket) { const key = `${k.dang_chinh} → ${k.ten ?? 'KHÔNG XẾP ĐƯỢC'}`; bang[key] = (bang[key] ?? 0) + 1 }
console.table(bang)
console.log('cần xem (khớp 0 hoặc nhiều luật):', lech.length)
for (const l of lech.slice(0, 30)) console.log(' ', l.ma_cau, '[' + l.khop.join(' | ') + ']', l.de.slice(0, 150))
fs.writeFileSync('kho-rules/dai/lo/mcq-4t-tong-hieu/xep-dang-bai.json', JSON.stringify(ket.map(({ ma_cau, dang_chinh, dich, ten, de }) => ({ ma_cau, dang_chinh, dich, ten, de })), null, 1))
if (GHI) {
  if (lech.length) { console.log('✖ còn câu cần xem — KHÔNG ghi'); process.exit(1) }
  await q('begin')
  for (const k of ket) await q(`insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon, at) values ($1, $2, 'ai', now()) on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'ai', at = now()`, [k.ma_cau, k.dich])
  await q('commit'); console.log('✔ ĐÃ GHI gán', ket.length)
}
await c.end()
