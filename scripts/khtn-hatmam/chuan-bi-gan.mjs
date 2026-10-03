// Chuẩn bị dữ liệu cho bước ĐỀ XUẤT ÁNH XẠ dạng Hạt Mầm → dạng ERP, theo (khối × môn). CHỈ ĐỌC DB.
// Ra: <thư mục>/<khối>-<môn>.json = { khoi, mon, erp: [dạng ERP cả khối + 3 câu mẫu], hm: [dạng HM của môn + toàn bộ câu] }
// Chạy: node scripts/khtn-hatmam/chuan-bi-gan.mjs <hatmam.json> <thư mục ra>
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const [, , vao, ra] = process.argv
fs.mkdirSync(ra, { recursive: true })
const { cay, cau } = JSON.parse(fs.readFileSync(vao, 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const MON = { 'Vật lí': 'ly', 'Hóa học': 'hoa', 'Sinh học': 'sinh' }
const gon = (s) => (s ?? '').replace(/!\[[^\]]*\]\([^)]*\)/g, '[hình]').replace(/\s+/g, ' ').trim()
for (const khoi of ['7', '8', '9']) {
  const erp = (await c.query(`
    select b.ma_dang, b.ma_chuyen_de, b.ten_chuyen_de, b.ma_chu_de, b.ten_chu_de, b.ten_dang, b.muc_do, b.mo_ta_ngan,
           (select count(*)::int from khtn_cau_hoi q where q.dang_chinh = b.ma_dang and q.xoa_at is null) so_cau,
           (select coalesce(jsonb_agg(left(regexp_replace(x.noi_dung, '\\s+', ' ', 'g'), 220)), '[]') from
              (select noi_dung from khtn_cau_hoi q where q.dang_chinh = b.ma_dang and q.xoa_at is null order by md5(q.ma_cau) limit 3) x) mau
      from khtn_ban_do b where b.khoi = $1 and right(b.ma_dang, 6) <> '000000' order by b.ma_dang`, [khoi])).rows
  for (const [tenMon, mon] of Object.entries(MON)) {
    const ds = cau.filter((x) => x.khoi === khoi && x.mon === tenMon)
    const dangs = [...new Set(ds.map((x) => x.dang))]
    const hm = dangs.map((ma) => ({
      ma_dang: ma, ten: cay.dang[ma]?.ten, ghi: cay.dang[ma]?.ghi ?? null,
      chuyen_de: { ma: ma.slice(0, 7), ten: cay.chuyenDe[ma.slice(0, 7)]?.ten, sgk: cay.chuyenDe[ma.slice(0, 7)]?.sgk },
      cau: ds.filter((x) => x.dang === ma).map((x) => ({ ma: x.ma, muc: x.muc_do, cum: x.cum ? cay.cum[x.cum]?.ten : null, de: gon(x.de), pa: x.pa.map(gon), dap_an: x.dap_an, giai: gon(x.loi_giai).slice(0, 260) })),
    }))
    fs.writeFileSync(`${ra}/${khoi}-${mon}.json`, JSON.stringify({ khoi, mon: tenMon, erp, hm }, null, 1))
    console.log(`${khoi}-${mon}: ${hm.length} dạng HM · ${ds.length} câu · ERP khối ${erp.length} dạng`)
  }
}
await c.end()
