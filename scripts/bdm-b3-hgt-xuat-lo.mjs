// B3 Khớp cho kho HGT (Oxyz) — XUẤT đầu vào cho máy khớp của một khối (CHỈ ĐỌC DB). Cặp với bdm-b3-hgt-ghi.mjs.
//   node scripts/bdm-b3-hgt-xuat-lo.mjs <khoi> <thu-muc-ra> [--lo 70]
// Ghi vào <thu-muc-ra>:
//   bang-dich.md — mọi dạng bài của chủ đề vùng 'hgt' của khối (đường dẫn · mô tả · ví dụ)
//   lo-NN.json   — các lô câu GỐC + BẢN SAO kho HGT của khối chưa có dòng ở hgt_bdm_gan_cau / de_xuat / cau_thieu_dang
//                  (kèm gợi ý dạng/chuyên đề CŨ — chỉ tham khảo, có thể sai)
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')

const [khoi, ra] = process.argv.slice(2)
const LO = process.argv.includes('--lo') ? +process.argv[process.argv.indexOf('--lo') + 1] : 70
if (!khoi || !ra) { console.error('Dùng: node scripts/bdm-b3-hgt-xuat-lo.mjs <khoi> <thu-muc-ra> [--lo 70]'); process.exit(2) }
fs.mkdirSync(ra, { recursive: true })

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
await c.connect()
await c.query('begin read only')
const q = async (s, p) => (await c.query(s, p)).rows

const dich = await q(`
  select d.id, d.ten, d.mo_ta, d.vi_du, n.ten nhom, cdx.ten chuyen_de, cd.ten chu_de, cd.id chu_de_id
    from dai_bdm_dang_bai d
    join dai_bdm_nhom n on n.id = d.nhom_id
    join dai_bdm_chu_de cd on cd.id = n.chu_de_id and cd.khoi = $1 and cd.nhanh = 'hgt'
    join dai_bdm_chuyen_de cdx on cdx.id = n.chuyen_de_id
    left join dai_bdm_o o on o.chu_de_id = n.chu_de_id and o.chuyen_de_id = n.chuyen_de_id
   order by cd.thu_tu, o.thu_tu, n.thu_tu, d.thu_tu`, [khoi])
if (!dich.length) { console.error('Khối ' + khoi + ' chưa có chủ đề vùng hgt / dạng bài'); process.exit(1) }
let md = `# BẢNG ĐÍCH — khối ${khoi}, vùng Hình giải tích (${dich.length} dạng bài)\n\n`
let cur = ''
for (const d of dich) {
  const k = `${d.chu_de} › ${d.chuyen_de} › ${d.nhom}`
  if (k !== cur) { md += `\n## ${k}\n`; cur = k }
  md += `- **${d.id}** — ${d.ten}\n  - mô tả: ${(d.mo_ta || '(chưa có)').replace(/\n+/g, ' ')}\n`
  const ex = (d.vi_du || '').split(/\n\s*\n/).filter((b) => b.startsWith('##VD')).map((b) => b.split('\nLời giải.')[0].replace(/^##VD\s*/, '').replace(/\n/g, ' ')).slice(0, 2)
  for (const e of ex) md += `  - ví dụ: ${e}\n`
}
fs.writeFileSync(path.join(ra, 'bang-dich.md'), md)

const rows = await q(`
  select h.ma_cau, h.loai_cau, h.noi_dung, h.lua_chon, h.menh_de, h.dap_an, h.anh_de, h.parent_ma_cau,
         b.ten_dang dang_cu, b.ten_chuyen_de chuyen_de_cu
    from hgt_cau_hoi h join hgt_ban_do b on b.ma_dang = h.dang_chinh
   where h.xoa_at is null and b.khoi = $1
     and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = h.ma_cau)
     and not exists (select 1 from hgt_bdm_de_xuat e where e.ma_cau = h.ma_cau)
     and not exists (select 1 from hgt_bdm_cau_thieu_dang t where t.ma_cau = h.ma_cau)
   order by b.ten_chuyen_de, h.ma_cau`, [khoi])
await c.query('rollback'); await c.end()

const gon = (r) => {
  const o = { ma_cau: r.ma_cau, loai: r.loai_cau, de: (r.noi_dung || '').slice(0, 1200), co_hinh: !!r.anh_de, ban_sao: !!r.parent_ma_cau, goi_y_cu: `${r.chuyen_de_cu} › ${r.dang_cu}` }
  if (r.lua_chon) o.lua_chon = r.lua_chon
  if (r.menh_de) o.menh_de = (Array.isArray(r.menh_de) ? r.menh_de : [r.menh_de]).map((m) => (typeof m === 'object' ? (m.noi_dung || JSON.stringify(m)) : m))
  if (r.dap_an) o.dap_an = r.dap_an
  return o
}
const all = rows.map(gon)
let n = 0
for (let i = 0; i < all.length; i += LO) { n++; fs.writeFileSync(path.join(ra, `lo-${String(n).padStart(2, '0')}.json`), JSON.stringify(all.slice(i, i + LO))) }
console.log(`khối ${khoi}: ${dich.length} dạng bài · ${all.length} câu (${all.filter((x) => x.ban_sao).length} bản sao) → ${n} lô trong ${ra}`)
