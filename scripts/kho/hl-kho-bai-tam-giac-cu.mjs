// Đẩy các bài Hình–Luyện CŨ của "Tam giác bằng nhau" (bản đồ cũ MH.061–064, phan IS NULL, 75 bài toán = 21 chuỗi) vào KHO BÀI
// của các mô hình MỚI (MH.126 · 130 · 131 · 132 · 133). Mỗi chuỗi cũ (cap1..capN) = MỘT hinh_bai: gia_thiet_chung = giả thiết cap1,
// mỗi cap = một hinh_y (a, b, c…), ảnh gốc (anh_chuan) đi theo. Gán mô hình bằng fn_hl_gan_bai_mo_hinh (đúng đường app).
//   node scripts/kho/hl-kho-bai-tam-giac-cu.mjs          # chạy thử (ROLLBACK) + in danh sách
//   node scripts/kho/hl-kho-bai-tam-giac-cu.mjs --ghi
// Dedupe: hinh_bai.nguon_ma_cau = mã bài toán cap1 của chuỗi cũ. Chuỗi MH.064 (BT.07.064.01) cũ THIẾU giả thiết ⇒ bỏ qua, báo.
import pg from 'pg'
import { writeFileSync } from 'node:fs'
import { bien } from './cau-hinh.mjs'

const GHI = process.argv.includes('--ghi')
// mã bài cap1 của chuỗi cũ → mô hình mới
const DICH = {
  'BT.07.061.10': 'MH.126', 'BT.07.061.13': 'MH.126', 'BT.07.061.17': 'MH.126', 'BT.07.061.21': 'MH.126', 'BT.07.061.25': 'MH.126',
  'BT.07.061.28': 'MH.130', 'BT.07.061.31': 'MH.130',
  'BT.07.062.01': 'MH.132', 'BT.07.062.05': 'MH.132', 'BT.07.062.08': 'MH.132', 'BT.07.062.12': 'MH.132', 'BT.07.062.17': 'MH.132',
  'BT.07.062.20': 'MH.132', 'BT.07.062.24': 'MH.132', 'BT.07.062.28': 'MH.132',
  'BT.07.063.01': 'MH.131', 'BT.07.063.04': 'MH.131', 'BT.07.063.07': 'MH.131', 'BT.07.063.10': 'MH.131', 'BT.07.063.15': 'MH.131',
}
const NHAN = 'abcdefgh'

// Chuẩn hoá chữ: tên điểm/đoạn/góc trần → $…$ ; \widehat { ABC} → \widehat{ABC}; bỏ ký tự rác cuối.
function chuanHoa(s) {
  let t = String(s ?? '').replace(/\r/g, '').replace(/\s*\|\s*$/, '').trim()
  // lỗi chữ gốc đã biết (sửa tay, ghi trong DEVLOG)
  t = t.replace('tia phân giác của góc A, D thuộc BC', 'tia phân giác của góc A ($D$ thuộc $BC$)')
    .replace('là tia phân giác của $\\triangle ABC$', 'là tia phân giác của $\\widehat{ABC}$')
    .replace('là tia phân giác ABC.', 'là tia phân giác của góc ABC.')
  t = t.replace(/\\widehat\s*\{\s*([^}]*?)\s*\}/g, '\\widehat{$1}')
  const parts = t.split(/(\$[^$]*\$)/)
  const ID = '[A-Z]{1,3}|[A-Z][xyz]'
  const truoc = '(?<![\\p{L}\\p{N}\\\\])', sau = '(?![\\p{L}\\p{N}])'
  const reList = new RegExp(`${truoc}((?:${ID})(?:\\s*,\\s*(?:${ID}))+)${sau}`, 'gu')
  const reOne = new RegExp(`${truoc}(${ID})${sau}`, 'gu')
  const out = parts.map((p, i) => {
    if (i % 2) return p
    return p.replace(reList, (m) => '$' + m.replace(/\s*,\s*/g, ', ') + '$').split(/(\$[^$]*\$)/).map((q, j) => (j % 2 ? q : q.replace(reOne, '$$$1$$'))).join('')
  })
  t = out.join('').replace(/\$\s*\$/g, '')
  return t.replace(/[ \t]+/g, ' ').replace(/ +([.,;])/g, '$1').replace(/ ?\n ?/g, '\n').trim()
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
const cu = (await c.query(`select m.ma mh, b.ma, b.cap, b.phat_bieu, b.gia_thiet_rieng gt, b.anh_chuan anh
  from hinh_baitoan b join hinh_mo_hinh m on m.id = b.mo_hinh_id
 where m.ma in ('MH.061','MH.062','MH.063','MH.064') order by m.ma, b.ma`)).rows
const chuoi = []
for (const r of cu) { if (r.cap === 1) chuoi.push({ mh: r.mh, ma: r.ma, gt: r.gt, ds: [r] }); else chuoi.at(-1).ds.push(r) }

const moi = {}
for (const r of (await c.query(`select id, ma from hinh_mo_hinh where ma = any($1) and phan = 'luyen' and la_mo_hinh and khoi = '7'`, [[...new Set(Object.values(DICH))]])).rows) moi[r.ma] = r.id
for (const k of new Set(Object.values(DICH))) if (!moi[k]) throw new Error('không thấy mô hình ' + k)

await c.query('begin')
const bao = [], bo = []
let nBai = 0, nY = 0
for (const ch of chuoi) {
  const dich = DICH[ch.ma]
  if (!dich) { bo.push(`${ch.ma} (${ch.mh}, ${ch.ds.length} ý): ${ch.gt ? 'không có trong bảng đích' : 'chuỗi cũ THIẾU giả thiết'}`); continue }
  const da = await c.query(`select ma_bai from hinh_bai where nguon_ma_cau = $1`, [ch.ma])
  if (da.rowCount) { bo.push(`${ch.ma}: đã có ${da.rows[0].ma_bai}`); continue }
  const gtc = chuanHoa(ch.gt)
  const y = ch.ds.map((d, i) => ({ nhan: NHAN[i], nd: chuanHoa(d.phat_bieu), anh: i === 0 ? null : d.anh }))
  const de = [gtc, ...y.map((v) => `${v.nhan}) ${v.nd}`)].join('\n')
  if (/\n\n/.test(de) || ((de.match(/\$/g) || []).length % 2)) throw new Error('đề lỗi định dạng ở ' + ch.ma)
  const b = (await c.query(
    `insert into hinh_bai (de_bai, anh_de, nguon, khoi, trang_thai, gia_thiet_chung, nguon_ma_cau, loai_cau)
     values ($1,$2,$3,'7','tam',$4,$5,'tu_luan') returning id, ma_bai`,
    [de, ch.ds[0].anh ?? null, `Bản đồ cũ — ${ch.mh} (${ch.ds[0].ma} → ${ch.ds.at(-1).ma})`, gtc, ch.ma])).rows[0]
  for (let i = 0; i < y.length; i++)
    await c.query(`insert into hinh_y (bai_id, thu_tu, nhan_hien_thi, noi_dung, anh_de) values ($1,$2,$3,$4,$5)`, [b.id, i + 1, y[i].nhan, y[i].nd, y[i].anh])
  await c.query('select fn_hl_gan_bai_mo_hinh($1,$2)', [b.id, moi[dich]])
  nBai++; nY += y.length
  bao.push({ ma_bai: b.ma_bai, goc: ch.ma, mh_cu: ch.mh, mh_moi: dich, de, anh: ch.ds.map((d, i) => (d.anh ? i + 1 : 0)).filter(Boolean), y })
}
console.log(`\nSẽ/đã tạo ${nBai} bài kho · ${nY} ý`)
const dem = {}; for (const b of bao) dem[b.mh_moi] = (dem[b.mh_moi] || 0) + 1
console.log('Theo mô hình mới:', dem)
if (bo.length) console.log('Bỏ qua:\n  ' + bo.join('\n  '))
for (const b of bao) console.log(`\n── ${b.ma_bai} ← ${b.goc} (${b.mh_cu}) → ${b.mh_moi}${b.anh.length ? ' · ảnh ở ý ' + b.anh.join(',') : ''}\n${b.de}`)
writeFileSync('kho-rules/hinh/k7-tgbn-mohinh/kho-bai-cu.json', JSON.stringify(bao, null, 1))
if (GHI) { await c.query('commit'); console.log('\n✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('\n↩ ROLLBACK (chạy thử)') }
await c.end()
