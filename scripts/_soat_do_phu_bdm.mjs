// Soát độ phủ bản đồ mới cho builder (chỉ ĐỌC): node scripts/_soat_do_phu_bdm.mjs [--json out.json]
// Đọc đúng cây GV thấy trong bộ chọn (fn_tl_bdm_cay_chon) + hàng duyệt gán câu (đề xuất · thiếu dạng · chưa khớp) theo khối.
import pg from 'pg'
import fs from 'node:fs'
const env = fs.readFileSync('.env', 'utf8')
const url = (env.match(/^\s*DATABASE_URL_RO\s*=\s*(.+?)\s*$/m) ?? env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m))[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
// _tl_bdm_cau_vi_tri chỉ cho nhân sự đọc ⇒ chạy trong 1 transaction mang claims của admin, ROLLBACK ở cuối (không ghi gì)
await c.query('begin')
const tk = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong order by t.created_at limit 1`)).rows[0]
await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.id, role: 'authenticated' })])
const KHOI = ['6', '7', '8', '9', '10', '11', '12']
const CHI_K12 = 'NCD00095' // K12 chỉ chủ đề NH-TP chuẩn (Thùy 12/10)
const NGUONG = 3           // dạng bài có < 3 câu dùng được ⇒ gợi ý luyện thiếu
const out = []
for (const k of KHOI) {
  const cay = (await c.query(`select fn_tl_bdm_cay_chon($1, 'toan') j`, [k])).rows[0].j
  for (const cd of cay.chu_de) {
    if (k === '12' && cd.id !== CHI_K12) continue
    const r = { khoi: k, chu_de: cd.ten, id: cd.id, nhom: 0, nhom_lt: 0, dang: 0, dang_lt: 0, dang_vd: 0, dang_0cau: 0, dang_it: 0, cau: 0, chua_phan: 0, thieu: [] }
    for (const ch of cd.chuyen_de) for (const n of ch.nhom) {
      r.nhom++; if (n.co_ly_thuyet) r.nhom_lt++; r.chua_phan += n.so_cau_chua_phan
      for (const d of n.dang_bai) {
        r.dang++; if (d.co_ly_thuyet) r.dang_lt++; if (d.co_vi_du) r.dang_vd++; r.cau += d.so_cau
        if (d.so_cau === 0) r.dang_0cau++; else if (d.so_cau < NGUONG) r.dang_it++
        if (!d.co_ly_thuyet || !d.co_vi_du || d.so_cau < NGUONG) r.thieu.push({ nhom: n.ten, dang: d.ten, lt: d.co_ly_thuyet, vd: d.co_vi_du, so_cau: d.so_cau })
      }
    }
    out.push(r)
  }
}
// Hàng duyệt gán câu theo khối (câu Đại chưa vào bản đồ mới vì còn chờ người)
const hang = (await c.query(`
  select ltrim(substr(q.ma_cau, 3, 2), '0') as khoi,   -- mã câu Đại T1<khối 2 số>…
    count(*) filter (where x.loai = 'de_xuat') as de_xuat, count(*) filter (where x.loai = 'thieu') as thieu_dang,
    count(*) filter (where x.loai = 'chua_khop') as chua_khop
  from (select ma_cau, 'de_xuat' loai from dai_bdm_de_xuat union all select ma_cau, 'thieu' from dai_bdm_cau_thieu_dang
        union all select ma_cau, 'chua_khop' from dai_bdm_cau_chua_khop) x
  join dai_cau_hoi q on q.ma_cau = x.ma_cau where q.xoa_at is null group by 1 order by 1`)).rows
await c.query('rollback'); await c.end()

const T = (a) => a.reduce((s, r) => ({ nhom: s.nhom + r.nhom, nhom_lt: s.nhom_lt + r.nhom_lt, dang: s.dang + r.dang, dang_lt: s.dang_lt + r.dang_lt, dang_vd: s.dang_vd + r.dang_vd, dang_0cau: s.dang_0cau + r.dang_0cau, dang_it: s.dang_it + r.dang_it, cau: s.cau + r.cau }), { nhom: 0, nhom_lt: 0, dang: 0, dang_lt: 0, dang_vd: 0, dang_0cau: 0, dang_it: 0, cau: 0 })
console.log('KHỐI | nhóm (có LT) | dạng bài | có LT | có VD | 0 câu | <3 câu | câu dùng được')
for (const k of KHOI) { const t = T(out.filter((r) => r.khoi === k)); console.log(`${k.padStart(4)} | ${t.nhom} (${t.nhom_lt}) | ${t.dang} | ${t.dang_lt} | ${t.dang_vd} | ${t.dang_0cau} | ${t.dang_it} | ${t.cau}`) }
console.log('\nHàng duyệt gán câu (khối · đề xuất chờ · thiếu dạng · chưa khớp):'); for (const h of hang) console.log(` ${h.khoi}: ${h.de_xuat} · ${h.thieu_dang} · ${h.chua_khop}`)
const i = process.argv.indexOf('--json'); if (i > 0) fs.writeFileSync(process.argv[i + 1], JSON.stringify({ chu_de: out, hang }, null, 1))
