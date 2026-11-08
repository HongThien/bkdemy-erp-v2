// xuat.mjs — xuất MỌI câu của đề K12 trên ERP (khảo sát · giữa kì · cuối kì · thi thử TN · đề cương · khác) thành lô JSONL để đọc + gắn chương + dạng.
//   node kho-rules/dai/lo/k12-de/xuat.mjs <thư mục ra> [kích thước lô=100]
// Khử trùng theo nội dung chuẩn hoá (đề + lựa chọn); mỗi dòng = 1 câu duy nhất, kèm danh sách ma_cau trùng + số đề + loại đề + năm.
import pg from 'pg'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
const ra = process.argv[2]; const co = +(process.argv[3] || 100)
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const loaiDe = (t) => /đề cương|ôn tập|chuyên đề/i.test(t) ? 'de_cuong' : /khảo sát|KSCL/i.test(t) ? 'khao_sat' : /giữa/i.test(t) ? 'giua_ki' : /thi thử|tốt nghiệp|TN THPT|tham khảo|minh họa/i.test(t) ? 'thi_thu_TN' : /cuối|học kì|học kỳ|HK[12]/i.test(t) ? 'cuoi_ki' : 'khac'
const hocKi = (t) => /học kì 2|học kỳ 2|HK2|kì 2|kỳ 2/i.test(t) ? 'HK2' : /học kì 1|học kỳ 1|HK1|kì 1|kỳ 1|giữa/i.test(t) ? 'HK1' : '?'
const nam = (t) => (t.match(/20\d\d\s*[-–]\s*20\d\d/) || [''])[0].replace(/\s/g, '')
const chuan = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, '').replace(/[$\{}\s]/g, '')
const gom = new Map()
for (const [bang, nhanh] of [['dai_cau_hoi', 'dai'], ['hgt_cau_hoi', 'hgt']]) {
  const rows = (await c.query(`select ch.ma_cau, ch.loai_cau, ch.noi_dung, ch.lua_chon, ch.menh_de, ch.dap_an, ch.dang_chinh, (ch.anh_de is not null and ch.anh_de::text not in ('','[]','{}')) hinh, t.ten de_ten
    from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id=t.id join tai_lieu_cau tc on tc.phan_id=p.id join ${bang} ch on ch.ma_cau=tc.ma_cau
    where t.loai='de_thi' and t.khoi='12' and ch.xoa_at is null`)).rows
  for (const r of rows) {
    const lc = r.lua_chon == null ? '' : (typeof r.lua_chon === 'string' ? r.lua_chon : JSON.stringify(r.lua_chon))
    const md = r.menh_de == null ? '' : (typeof r.menh_de === 'string' ? r.menh_de : JSON.stringify(r.menh_de))
    const khoa = createHash('md5').update(chuan(r.noi_dung) + '|' + chuan(lc) + '|' + chuan(md)).digest('hex')
    let g = gom.get(khoa)
    if (!g) { g = { id: r.ma_cau, ma_cau_trung: [], nhanh, loai_cau: r.loai_cau, noi_dung: String(r.noi_dung ?? '').slice(0, 1500), lua_chon: lc.slice(0, 900), menh_de: md.slice(0, 4500), dap_an: String(r.dap_an ?? '').slice(0, 60), nhom_cu: r.dang_chinh, hinh: !!r.hinh, de: new Set(), loai_de: new Set(), nam: new Set(), hk: new Set() }; gom.set(khoa, g) }
    if (!g.ma_cau_trung.includes(r.ma_cau)) g.ma_cau_trung.push(r.ma_cau)
    g.de.add(r.de_ten); g.loai_de.add(loaiDe(r.de_ten)); g.nam.add(nam(r.de_ten)); g.hk.add(hocKi(r.de_ten))
  }
}
const ds = [...gom.values()].map((g) => ({ ...g, n_de: g.de.size, de: undefined, loai_de: [...g.loai_de], nam: [...g.nam].filter(Boolean), hk: [...g.hk] }))
// xáo trộn cố định (seed) để lô không thiên chương
let s = 12345; const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296
for (let i = ds.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ds[i], ds[j]] = [ds[j], ds[i]] }
fs.mkdirSync(ra, { recursive: true })
let n = 0
for (let i = 0; i < ds.length; i += co) { n++; fs.writeFileSync(join(ra, `lo-${String(n).padStart(3, '0')}.jsonl`), ds.slice(i, i + co).map((x) => JSON.stringify(x)).join('\n') + '\n') }
console.log(`câu duy nhất ${ds.length} (từ ${[...gom.values()].reduce((a, g) => a + g.ma_cau_trung.length, 0)} ma_cau) · ${n} lô × ${co} · hgt ${ds.filter((x) => x.nhanh === 'hgt').length}`)
await c.end()
