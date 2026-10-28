// Xuất lô KHỚP LẠI cho kho HGT một khối: mọi câu (không Đ/S) đang ở đề xuất / thiếu dạng / gán AI — KHÔNG đụng câu NGƯỜI gán.
//   node scripts/_hgt_lai_xuat.mjs <khoi> <thu-muc-ra> [--lo 70]
// Ra: bang-dich.md (cùng khuôn bdm-b3-hgt-xuat-lo) + lo-NN.json (kèm dạng hiện tại để so sánh).
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')

const [khoi, ra] = process.argv.slice(2)
const LO = process.argv.includes('--lo') ? +process.argv[process.argv.indexOf('--lo') + 1] : 70
if (!khoi || !ra) { console.error('Dùng: node scripts/_hgt_lai_xuat.mjs <khoi> <thu-muc-ra> [--lo 70]'); process.exit(2) }
fs.mkdirSync(ra, { recursive: true })

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

const dich = await q(`
  select d.id, d.ten, d.mo_ta, d.vi_du, n.ten nhom, cdx.ten chuyen_de, cd.ten chu_de
    from dai_bdm_dang_bai d
    join dai_bdm_nhom n on n.id = d.nhom_id
    join dai_bdm_chu_de cd on cd.id = n.chu_de_id and cd.khoi = $1 and cd.nhanh = 'hgt'
    join dai_bdm_chuyen_de cdx on cdx.id = n.chuyen_de_id
    left join dai_bdm_o o on o.chu_de_id = n.chu_de_id and o.chuyen_de_id = n.chuyen_de_id
   order by cd.thu_tu, o.thu_tu, n.thu_tu, d.thu_tu`, [khoi])
let md = `# BẢNG ĐÍCH — khối ${khoi}, Hình giải tích (${dich.length} dạng bài). THỨ TỰ DƯỚI ĐÂY = THỨ TỰ HỌC TRÊN BẢN ĐỒ (trên → dưới). DẠNG SAU THẮNG: câu khớp hai dạng ⇒ lấy dạng đứng SAU (thấp hơn trong danh sách).\n\n`
let cur = '', stt = 0
for (const d of dich) {
  const k = `${d.chu_de} › ${d.chuyen_de} › ${d.nhom}`
  if (k !== cur) { md += `\n## ${k}\n`; cur = k }
  stt++
  md += `- **${d.id}** (thứ tự ${stt}) — ${d.ten}\n  - mô tả: ${(d.mo_ta || '(chưa có)').replace(/\n+/g, ' ')}\n`
  const ex = (d.vi_du || '').split(/\n\s*\n/).filter((b) => b.startsWith('##VD')).map((b) => b.replace(/^##VD\s*/, '').split('**Hướng dẫn giải')[0].replace(/\n/g, ' ')).slice(0, 2)
  for (const e of ex) md += `  - ví dụ: ${e.slice(0, 400)}\n`
}
fs.writeFileSync(path.join(ra, 'bang-dich.md'), md)

const rows = await q(`
  select h.ma_cau, h.loai_cau, h.noi_dung, h.lua_chon, h.menh_de, h.dap_an, h.loi_giai, h.anh_de, h.parent_ma_cau,
         b.ten_dang dang_cu, b.ten_chuyen_de chuyen_de_cu,
         coalesce(g.dang_bai_id, e.dang_bai_id) hien_tai, case when g.ma_cau is not null then 'gan_ai' when e.ma_cau is not null then 'de_xuat' when t.ma_cau is not null then 'thieu' else 'chua_phan' end trang_thai
    from hgt_cau_hoi h
    join hgt_ban_do b on b.ma_dang = h.dang_chinh and b.khoi = $1
    left join hgt_bdm_gan_cau g on g.ma_cau = h.ma_cau
    left join hgt_bdm_de_xuat e on e.ma_cau = h.ma_cau
    left join hgt_bdm_cau_thieu_dang t on t.ma_cau = h.ma_cau
   where h.xoa_at is null and h.loai_cau <> 'dung_sai'
     and ($2::boolean is true and (g.ma_cau is null and not exists (select 1 from hgt_bdm_kho_ds k where k.ma_cau = h.ma_cau) and (e.ma_cau is not null or t.ma_cau is null or t.nguon = 'ai'))
          or $2::boolean is not true and (g.nguon = 'ai' or (g.ma_cau is null and (e.ma_cau is not null or (t.ma_cau is not null and t.nguon = 'ai')))))
   order by b.ten_chuyen_de, h.ma_cau`, [khoi, process.argv.includes('--chua-va-hang')])
await c.end()

const gon = (r) => {
  const o = { ma_cau: r.ma_cau, loai: r.loai_cau, de: (r.noi_dung || '').slice(0, 1200), co_hinh: !!r.anh_de, ban_sao: !!r.parent_ma_cau, goi_y_cu: `${r.chuyen_de_cu} › ${r.dang_cu}`, hien_tai: r.hien_tai ? `${r.hien_tai} (${r.trang_thai})` : r.trang_thai }
  if (r.lua_chon) o.lua_chon = r.lua_chon
  if (r.menh_de) o.menh_de = (Array.isArray(r.menh_de) ? r.menh_de : [r.menh_de]).map((m) => (typeof m === 'object' ? (m.noi_dung || JSON.stringify(m)) : m))
  if (r.dap_an) o.dap_an = r.dap_an
  if (r.loi_giai) o.loi_giai = r.loi_giai.length > 600 ? r.loi_giai.slice(0, 600) + ' …' : r.loi_giai
  return o
}
const all = rows.map(gon)
let n = 0
for (let i = 0; i < all.length; i += LO) {
  n++
  const lo = all.slice(i, i + LO)
  fs.writeFileSync(path.join(ra, `lo-${String(n).padStart(2, '0')}.json`), JSON.stringify(lo))
}
console.log(`khối ${khoi}: ${dich.length} dạng · ${all.length} câu → ${n} lô trong ${ra}`)
