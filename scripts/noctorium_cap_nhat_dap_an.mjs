// Cập nhật ĐÁP ÁN từ bản Noctorium có gạch chân vào câu đã có trong DB. Mặc định CHẠY THỬ (ROLLBACK); --ghi mới commit.
//   điền chỗ trống (null) · ghi đè CHỈ khi đáp án DB = đáp án máy tự rút (không phải người) và câu chưa duyệt · còn lại liệt kê.
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const NZ = ((process.argv.find((a) => a.startsWith('--thu-muc=')) ?? '--thu-muc=').slice(10).split(String.fromCharCode(92)).join('/') + '/').replace(/\/+$/, '/')   // thư mục chứa out10/out11/out12 (kết quả noctorium_parse.mjs)
const nfc = (s) => String(s ?? '').normalize('NFC')
const chTen = (t) => nfc(t).toLowerCase().replace(/\.docx$/, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const BS = String.fromCharCode(92)
const norm = (s) => nfc(s).toLowerCase().replace(new RegExp(BS + BS + '(left|right|dfrac|tfrac|frac|displaystyle|limits|mathrm|text|,|;|!)', 'g'), '').replace(/[^\p{L}\p{N}]/gu, '')
const keyDb = (r) => norm((r.noi_dung ?? '') + (Array.isArray(r.lua_chon) ? r.lua_chon.join('') : '') + (Array.isArray(r.menh_de) ? r.menh_de.map((m) => m.noi_dung ?? '').join('') : ''))
const keyNew = (q) => norm((q.noi_dung ?? '') + (q.lua_chon ?? []).join('') + (q.menh_de ?? []).map((m) => m.noi_dung ?? '').join(''))
const BANG = { T1: 'dai_cau_hoi', T3: 'hgt_cau_hoi', HH: 'hinh_hoc_cau_hoi' }
const bangCua = (ma) => BANG[ma.slice(0, 2)]

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
const tl = (await c.query(`select id, ten, cau_hinh->'deThi'->>'file' f from tai_lieu where loai='de_thi' and cau_hinh->'deThi'->>'nguon'='noctorium'`)).rows
const byTen = new Map(); for (const r of tl) { byTen.set(chTen(r.ten), r); if (r.f) byTen.set(chTen(r.f), r) }
const lk = (await c.query(`select p.tai_lieu_id, tc.ma_cau from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id where p.tai_lieu_id = any($1::uuid[])`, [tl.map((r) => r.id)])).rows
const cauCua = new Map(); for (const r of lk) { if (!cauCua.has(r.tai_lieu_id)) cauCua.set(r.tai_lieu_id, []); cauCua.get(r.tai_lieu_id).push(r.ma_cau) }
const nd = new Map()
for (const [pre, b] of Object.entries(BANG)) {
  const ma = [...new Set(lk.map((x) => x.ma_cau))].filter((m) => m.startsWith(pre))
  if (!ma.length) continue
  for (const r of (await c.query(`select ma_cau, loai_cau, noi_dung, lua_chon, menh_de, dap_an, da_duyet from ${b} where ma_cau = any($1) and xoa_at is null`, [ma])).rows) nd.set(r.ma_cau, r)
}

// khớp theo NỘI DUNG trên TOÀN kho (câu đã có từ đề khác / bộ khác — cùng chữ + cùng thứ tự phương án ⇒ cùng đáp án). Chỉ dùng khi câu không nằm trong đề đang xét.
const glob = new Map()
for (const b of Object.values(BANG)) for (const r of (await c.query(`select ma_cau, loai_cau, noi_dung, lua_chon, menh_de, dap_an, da_duyet from ${b} where xoa_at is null`)).rows) { const k = keyDb(r); if (!glob.has(k)) glob.set(k, []); glob.get(k).push(r) }

const cn = []   // [{ma_cau, bang, dap_an, lydo}]
const doc = []  // liệt kê, không ghi
const dem = { tn_dien: 0, tn_ghi_de: 0, tn_dung: 0, tln_dien: 0, tln_ghi_de: 0, tln_dung: 0, ds_lech: 0, khong_khop: 0, de_khong_co_db: 0 }
const daGhi = new Set()
for (const k of ['10', '11', '12']) {
  const dir = NZ + 'out' + k + '/de/'
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir)) {
    const de = JSON.parse(fs.readFileSync(dir + f, 'utf8'))
    // tên trong bản tải 22/10 bị cắt phần tỉnh ("… - Hà", "… - Quảng") ⇒ không khớp nguyên văn thì khớp TIỀN TỐ, chỉ nhận khi duy nhất
    const tienTo = (t) => { const p = chTen(t); const ds = [...new Set([...byTen.entries()].filter(([k]) => k.startsWith(p)).map(([, v]) => v))]; return ds.length === 1 ? ds[0] : null }
    const row = byTen.get(chTen(de.ten)) ?? byTen.get(chTen(de.file)) ?? tienTo(de.ten)
    if (!row) { dem.de_khong_co_db++; continue }
    const kdb = new Map()
    for (const m of cauCua.get(row.id) ?? []) { const r = nd.get(m); if (r) { const key = keyDb(r); if (!kdb.has(key)) kdb.set(key, r) } }
    for (const q of de.cau) {
      const kq = keyNew(q)
      const rs = kdb.has(kq) ? [kdb.get(kq)] : (glob.get(kq) ?? [])
      if (!rs.length) { dem.khong_khop++; continue }
      for (const r of rs) {
      if (daGhi.has(r.ma_cau)) continue
      let moi = null, loai = null
      if (q.loai_cau === 'trac_nghiem' && q.dap_an_gach) { moi = q.dap_an_gach; loai = 'tn' }
      else if (q.loai_cau === 'tra_loi_ngan' && q.dap_an_de) { moi = q.dap_an_de; loai = 'tln' }
      else if (q.loai_cau === 'dung_sai' && Array.isArray(r.menh_de) && r.menh_de.length === (q.menh_de ?? []).length) {
        const sai = q.menh_de.some((m, i) => m.dap_an_gach && r.menh_de[i].dap_an && r.menh_de[i].dap_an !== m.dap_an_gach)
        if (sai) { dem.ds_lech++; doc.push({ ma_cau: r.ma_cau, loai: 'ds', db: r.menh_de.map((m) => m.dap_an).join(''), moi: q.menh_de.map((m) => m.dap_an_gach).join(''), de: de.file.slice(0, 60) }) }
        continue
      } else continue
      const cu = String(r.dap_an ?? '').replace(/[$\s]/g, '')
      const bang = BANG[r.ma_cau.slice(0, 2)]
      if (!cu) { cn.push({ ma_cau: r.ma_cau, bang, dap_an: moi, lydo: 'dien' }); dem[loai + '_dien']++; daGhi.add(r.ma_cau); continue }
      const bang_ = loai === 'tln' && isFinite(+cu) && isFinite(+moi) ? Math.abs(+cu - +moi) < 1e-9 : cu === moi
      if (bang_) { dem[loai + '_dung']++; continue }
      // lệch: ghi đè chỉ khi đáp án DB = đáp án máy tự rút (không do người) và câu chưa duyệt
      const may = String(loai === 'tn' ? q.dap_an ?? '' : q.dap_an ?? '').replace(/[$\s]/g, '')
      const doMay = (loai === 'tn' ? cu === may : (isFinite(+cu) && isFinite(+may) ? Math.abs(+cu - +may) < 1e-9 : cu === may)) && q.dap_an_tin === 'may'
      if (doMay && !r.da_duyet) { cn.push({ ma_cau: r.ma_cau, bang, dap_an: moi, lydo: 'ghi_de', cu }); dem[loai + '_ghi_de']++; daGhi.add(r.ma_cau) }
      else doc.push({ ma_cau: r.ma_cau, loai, db: r.dap_an, moi, may: q.dap_an, tin: q.dap_an_tin, da_duyet: r.da_duyet, de: de.file.slice(0, 60) })
      }
    }
  }
}
console.log(JSON.stringify(dem), '· cập nhật', cn.length, '· liệt kê (không đụng)', doc.length)
await c.query('begin')
try {
  let n = 0
  for (const b of Object.values(BANG)) {
    const xs = cn.filter((x) => x.bang === b)
    for (let i = 0; i < xs.length; i += 300) {
      const part = xs.slice(i, i + 300)
      const r = await c.query(`update ${b} t set dap_an = v.da from unnest($1::text[], $2::text[]) v(ma, da) where t.ma_cau = v.ma and t.xoa_at is null`, [part.map((x) => x.ma_cau), part.map((x) => x.dap_an)])
      n += r.rowCount
    }
  }
  console.log('UPDATE rowCount tổng:', n, '/', cn.length)
  if (n !== cn.length) throw new Error('lệch số dòng — rollback')
  fs.writeFileSync(NZ + 'cap-nhat-ket-qua.json', JSON.stringify({ dem, cn, doc }, null, 1))
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ COMMIT (hãy đọc lại bằng kết nối riêng)' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
