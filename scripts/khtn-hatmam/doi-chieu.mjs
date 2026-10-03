// Đối chiếu ngân hàng Hạt Mầm (JSON của boc-md.mjs) với bản đồ + kho KHTN trên ERP. CHỈ ĐỌC.
// Chạy: node scripts/khtn-hatmam/doi-chieu.mjs <hatmam.json>
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const { cay, cau } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const bo = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

// 1) DẠNG: mã có trong khtn_ban_do không, tên có khớp không
const bd = new Map((await q(`select ma_dang, khoi, ten_dang, ma_chuyen_de, ten_chuyen_de, muc_do from khtn_ban_do`)).map((r) => [r.ma_dang, r]))
const dangHm = Object.entries(cay.dang)
const theoKhoi = {}
for (const [ma, d] of dangHm) {
  const k = ma.slice(1, 3); const o = (theoKhoi[k] ??= { tong: 0, coMa: 0, trungTen: 0, khacTen: [], boSung: 0 })
  o.tong++; if (/bổ sung/.test((d.ghi ?? '') + d.ten)) o.boSung++
  const e = bd.get(ma); if (!e) continue
  o.coMa++
  const tenHm = bo(d.ten.replace(/^Dạng \d+\.\s*/, '')), tenErp = bo(e.ten_dang)
  if (tenHm === tenErp || tenHm.includes(tenErp) || tenErp.includes(tenHm)) o.trungTen++; else if (o.khacTen.length < 4) o.khacTen.push(`${ma}: HM «${d.ten}» ≠ ERP «${e.ten_dang}»`)
}
console.log('DẠNG Hạt Mầm theo khối:'); for (const [k, o] of Object.entries(theoKhoi)) console.log(` K${k}: ${o.tong} dạng · mã có trên ERP ${o.coMa} · tên khớp ${o.trungTen} · dạng bổ sung ${o.boSung}`, o.khacTen.length ? '\n   lệch tên: ' + o.khacTen.join('\n   ') : '')
const erpKhongCo = [...bd.keys()].filter((m) => !cay.dang[m])
console.log('dạng ERP (7–9) KHÔNG có trong Hạt Mầm:', erpKhongCo.length, '/', bd.size)
// câu theo trạng thái mã dạng
const coBd = cau.filter((x) => bd.has(x.dang)).length
console.log('câu Hạt Mầm có dạng nằm trên bản đồ ERP:', coBd, '/', cau.length)

// 2) CỤM: mã Hạt Mầm K08010101-C1 vs khtn_cum_bai (mã KCUM…, theo dạng + thứ tự)
const cumErp = await q(`select ma_cum, ma_dang, ten, thu_tu from khtn_cum_bai`)
console.log('\nCỤM ERP:', cumErp.length, '· cụm Hạt Mầm:', Object.keys(cay.cum).length, '· mẫu ERP:', cumErp.slice(0, 2))
let khopCum = 0
for (const [ma, d] of Object.entries(cay.cum)) { const [dg, n] = ma.split('-C'); const e = cumErp.find((x) => x.ma_dang === dg && x.thu_tu === Number(n)); if (e && bo(e.ten ?? '') && (bo(d.ten).includes(bo(e.ten)) || bo(e.ten).includes(bo(d.ten.replace(/^Cụm \d+\.\s*/, ''))))) khopCum++ }
console.log('cụm Hạt Mầm khớp (dạng + thứ tự + tên) cụm ERP:', khopCum)

// 3) TRÙNG NỘI DUNG với kho khtn_cau_hoi
const kho = await q(`select ma_cau, dang_chinh, noi_dung, loai_cau, da_duyet, kho_chuan from khtn_cau_hoi where xoa_at is null`)
const idx = new Map(); for (const r of kho) { const k = bo(r.noi_dung).slice(0, 90); if (k.length > 25) idx.set(k, r) }
let trung = 0; const mau = []
for (const x of cau) { const k = bo(x.de).slice(0, 90); const r = idx.get(k); if (r) { trung++; if (mau.length < 3) mau.push(`${x.ma} ≈ ${r.ma_cau} (${r.loai_cau})`) } }
console.log('\nKHO ERP: câu sống', kho.length, '· loại', JSON.stringify(kho.reduce((a, r) => (a[r.loai_cau] = (a[r.loai_cau] || 0) + 1, a), {})), '· kho_chuan', kho.filter((r) => r.kho_chuan).length)
console.log('câu Hạt Mầm TRÙNG đề (90 ký tự đầu, bỏ dấu) với kho ERP:', trung, mau)
console.log('\nmã lỗi (nhãn lỗi) khác nhau:', new Set(cau.map((x) => x.nhan_loi).filter(Boolean)).size, '· mức 5:', cau.filter((x) => x.muc_do === 5).map((x) => x.ma).join(','))
await c.end()
