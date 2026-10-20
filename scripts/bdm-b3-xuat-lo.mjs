// B3 Khớp — XUẤT đầu vào cho máy khớp của một khối (CHỈ ĐỌC DB). Spec: spec-ban-do-4-tang.md §13.
//   node scripts/bdm-b3-xuat-lo.mjs <khoi> [--lo 70] [--mau 90] [--dot <tên>]
//   --hang: đợt KHỚP LẠI — chỉ câu gốc đang ở hàng duyệt (chưa chắc / thiếu dạng), khi bản đồ vừa được sửa.
//   --dot: đợt BỔ SUNG (câu mới nhập sau lượt đầu) ⇒ thư mục k<khoi>-<tên>, mẫu _mau/k<khoi>-<tên>.json;
//          gop/lech-mau gọi với khối = "<khoi>-<tên>". Câu đang ở hàng duyệt (de_xuat / thieu_dang) luôn bị bỏ.
// Ghi vào kho-rules/dai/lo/b3/k<khoi>/:
//   dich.md        — bảng đích: mọi dạng bài nhánh Toán (Đại) của khối, kèm đường dẫn + mô tả + ví dụ
//   lo-NN.json     — các lô câu GỐC chưa có dạng bài (không dòng gan_cau / gan_cum / đối ứng 1 chỗ),
//                    trộn lẫn câu MẪU KIỂM (đã có dạng bài do người nối cụm/dạng cũ) — agent không biết câu nào là mẫu
//   mau.json       — {ma_cau: dang_bai_id} của câu mẫu (để đo precision, KHÔNG đưa agent)
// Mẫu chọn cố định theo md5(ma_cau) ⇒ chạy lại ra đúng bộ cũ.
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const khoi = args[0]
const so = (k, d) => { const i = args.indexOf(k); return i >= 0 ? +args[i + 1] : d }
const LO = so('--lo', 70), MAU = so('--mau', 90)
const iDot = args.indexOf('--dot'), DOT = iDot >= 0 ? args[iDot + 1] : null
const iLai = args.indexOf('--lai-ai'), LAI = iLai >= 0 ? new RegExp(args[iLai + 1], 'i') : null // ĐỢT KHỚP LẠI NHÃN AI: thêm câu đã có dạng bài do AI gán (nguon 'ai') mà đề khớp biểu thức chính quy này — khi bản đồ vừa có dạng mới (20/10)
const HANG = args.includes('--hang') // ĐỢT KHỚP LẠI: lấy câu gốc ĐANG Ở hàng duyệt (de_xuat / thieu_dang) thay cho câu chưa gán — dùng khi người vừa sửa/thêm dạng bài (20/10)
if (!khoi) { console.error('Dùng: node scripts/bdm-b3-xuat-lo.mjs <khoi> [--lo 70] [--mau 90]'); process.exit(2) }

const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? env }); await c.connect()
await c.query('begin read only')

const cat = (s, n) => { s = (s ?? '').replace(/\s+\n/g, '\n').trim(); return s.length > n ? s.slice(0, n) + ' …' : s }

// 1) Bảng đích
const dich = (await c.query(`
  select d.id, d.ten, d.mo_ta, d.vi_du, n.ten nhom, n.mo_ta nhom_mo_ta, cd.ten chu_de, cd.nhanh, cdx.ten chuyen_de
    from dai_bdm_dang_bai d
    join dai_bdm_nhom n on n.id = d.nhom_id
    join dai_bdm_chu_de cd on cd.id = n.chu_de_id
    join dai_bdm_chuyen_de cdx on cdx.id = n.chuyen_de_id
    left join dai_bdm_o o on o.chu_de_id = n.chu_de_id and o.chuyen_de_id = n.chuyen_de_id
   where cd.khoi = $1 and cd.nhanh = 'toan'
   order by cd.thu_tu, o.thu_tu, n.thu_tu, d.thu_tu`, [khoi])).rows
const ngoai = (await c.query(`select ten, nhanh from dai_bdm_chu_de where khoi = $1 and nhanh <> 'toan' order by thu_tu`, [khoi])).rows

// 2) Câu gốc + mẫu
const cau = (await c.query(`
  select g.ma_cau, g.dang_bai_id, g.nguon, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de,
         b.ten_chuyen_de, b.ten_dang, md5(g.ma_cau) h, (select gc.nguon from dai_bdm_gan_cau gc where gc.ma_cau = g.ma_cau) gnguon,
         (exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = g.ma_cau) or exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = g.ma_cau)) o_hang
    from _bdm_cau_giai((select array_agg(ma_dang) from dai_ban_do where khoi = $1)) g
    join dai_cau_hoi q on q.ma_cau = g.ma_cau
    join dai_ban_do b on b.ma_dang = g.ma_dang_cu
   where g.la_goc`, [khoi])).rows
await c.query('rollback'); await c.end()

const dbIds = new Set(dich.map((d) => d.id))
const chua = cau.filter((r) => (!r.dang_bai_id && (HANG ? r.o_hang : !r.o_hang)) || (LAI && r.dang_bai_id && r.gnguon === 'ai' && !r.o_hang && LAI.test(r.noi_dung))) // mặc định: bỏ câu ở hàng duyệt (người đang xử lý); --hang: CHỈ câu ở hàng duyệt
// mẫu: câu do NGƯỜI nối (cụm cũ / dạng cũ 1 chỗ), đích nằm trong bảng đích nhánh Toán
const mauDs = cau.filter((r) => r.dang_bai_id && (r.nguon === 'gan_cum' || r.nguon === 'doi_ung') && dbIds.has(r.dang_bai_id))
  .sort((a, b) => a.h.localeCompare(b.h)).slice(0, MAU)
const mau = Object.fromEntries(mauDs.map((r) => [r.ma_cau, r.dang_bai_id]))

const ten = 'k' + khoi + (DOT ? '-' + DOT : '')
const goc = path.join('kho-rules', 'dai', 'lo', 'b3', ten)
fs.mkdirSync(goc, { recursive: true })
for (const f of fs.readdirSync(goc)) if (/^lo-\d+\.json$/.test(f)) throw new Error(`${goc} đã có lô — xoá tay hoặc đổi thư mục trước khi xuất lại`)

const md = [`# Bảng đích khối ${khoi} — ${dich.length} dạng bài (nhánh Toán · Đại)`, '']
if (ngoai.length) md.push(`> Chủ đề KHÔNG nằm trong bảng đích (nhánh khác): ${ngoai.map((x) => `${x.ten} [${x.nhanh}]`).join(' · ')}. Câu thuộc các chủ đề này ⇒ để trống, lý do "thuộc nhánh ${'<tên>'}".`, '')
let cdTruoc = '', nhTruoc = ''
for (const d of dich) {
  if (d.chu_de !== cdTruoc) { md.push(`## Chủ đề: ${d.chu_de}`, ''); cdTruoc = d.chu_de; nhTruoc = '' }
  const nh = `${d.chuyen_de} › ${d.nhom}`
  if (nh !== nhTruoc) { md.push(`### ${nh}${d.nhom_mo_ta ? ` — ${cat(d.nhom_mo_ta, 300)}` : ''}`, ''); nhTruoc = nh }
  md.push(`- **${d.id}** · ${d.ten}`)
  if (d.mo_ta) md.push(`  - Mô tả: ${cat(d.mo_ta, 500).replace(/\n/g, ' ')}`)
  if (d.vi_du) md.push(`  - Ví dụ: ${cat(d.vi_du, 450).replace(/\n/g, ' ')}`)
}
fs.writeFileSync(path.join(goc, 'dich.md'), md.join('\n') + '\n')
fs.mkdirSync(path.join(goc, '..', '_mau'), { recursive: true }); fs.writeFileSync(path.join(goc, '..', '_mau', ten + '.json'), JSON.stringify(mau, null, 1)) // NGOÀI thư mục agent

// Lô: câu chưa gán + mẫu, trộn theo md5 (mẫu rải đều, agent không nhận ra)
const tat = [...chua, ...mauDs].sort((a, b) => a.h.localeCompare(b.h))
const gon = (r) => ({
  ma_cau: r.ma_cau, loai: r.loai_cau, de: cat(r.noi_dung, 1500),
  ...(r.lua_chon ? { lua_chon: r.lua_chon } : {}), ...(r.menh_de ? { menh_de: r.menh_de } : {}),
  ...(r.dap_an ? { dap_an: cat(r.dap_an, 200) } : {}), ...(r.loi_giai ? { loi_giai: cat(r.loi_giai, 700) } : {}),
  ...(r.anh_de ? { co_hinh: true } : {}),
  nhan_cu: `${r.ten_chuyen_de ?? ''} › ${r.ten_dang ?? ''}`,
})
let n = 0
for (let i = 0; i < tat.length; i += LO) {
  n++
  fs.writeFileSync(path.join(goc, `lo-${String(n).padStart(2, '0')}.json`), JSON.stringify(tat.slice(i, i + LO).map(gon), null, 1))
}
console.log(`K${khoi}: bảng đích ${dich.length} dạng bài · câu gốc chưa gán ${chua.length} · mẫu ${mauDs.length} · ${n} lô × ≤${LO} ⇒ ${goc}`)
