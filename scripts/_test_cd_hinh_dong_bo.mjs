// Kiểm mig 202610221334 (chuyên đề Hình đi theo mô hình kho) TRONG ROLLBACK: node scripts/_test_cd_hinh_dong_bo.mjs [--mig]
// Dùng chuyên đề Hình K7 thật (92570d22…). --mig = nạp file mig trước (khi chưa áp).
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
c.on('notice', (m) => console.log('NOTICE', m.message))
const q = async (s, a) => (await c.query(s, a)).rows
const T7 = '92570d22-9d36-4dab-8d49-dfe869623add'
const xem = async (id) => { const [{ j }] = await q(`select fn_tl_hl_noi_dung($1) j`, [id]); return j.buoi.map((b) => `${b.tieu_de}: ${b.mo_hinh.map((m) => `${m.ma}[${m.bai.map((x) => x.ma_bai.slice(-3)).join(',')}]`).join(' ')}${b.khac ? ` khác[${b.khac.bai.map((x) => x.ma_bai.slice(-3)).join(',')}]` : ''}`).join('\n') }
let ok = 0, sai = 0; const kt = (d, t) => { d ? ok++ : sai++; console.log(d ? '  ✔' : '  ✘', t) }
try {
  await q('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  if (process.argv.includes('--mig')) await q(fs.readFileSync('supabase/migrations/202610221334_chuyen_de_hinh_theo_mo_hinh_kho.sql', 'utf8'))
  const s1 = await xem(T7); console.log(s1)
  kt(['251', '255', '257'].every((m) => new RegExp(`MH\\.090\\[[^\\]]*${m}`).test(s1)), '251/255/257 ở MH.090')
  kt(!/khác\[[^\]]*(251|255|257)/.test(s1), 'không còn ở khác')
  // đổi 241 (chưa có mô hình) sang MH.088 (chưa có khối) ⇒ tạo khối ở phần đang có mô hình cùng nhóm
  const [m88] = await q(`select id from hinh_mo_hinh where ma = 'MH.088' and phan = 'luyen' and khoi = '7'`)
  await q(`update hinh_bai set mo_hinh_id = $1 where ma_bai = 'HLB00241'`, [m88.id])
  const s2 = await xem(T7); console.log(s2)
  kt(/Ba đường thẳng song song cần vẽ thêm hình:.*MH\.088\[241\]/.test(s2), '241 ⇒ khối MH.088 mới, ở phần cùng nhóm')
  kt(/Ba đường thẳng song song cần vẽ thêm hình: MH\.086.*MH\.087.*MH\.089.*MH\.088/.test(s2), 'khối mới đứng cuối các mô hình của phần')
  // bỏ mô hình 224 (MH.090) ⇒ khác của phần đang chứa
  await q(`update hinh_bai set mo_hinh_id = null where ma_bai = 'HLB00224'`)
  const s3 = await xem(T7); console.log(s3)
  kt(/Quan hệ các loại góc:.*khác\[224\]/.test(s3), '224 ⇒ khối khác của phần cũ')
  // 224 sang MH.076 (khối có sẵn ở phần khác) ⇒ cuối khối MH.076
  const [m76] = await q(`select id from hinh_mo_hinh where ma = 'MH.076' and phan = 'luyen' and khoi = '7'`)
  await q(`update hinh_bai set mo_hinh_id = $1 where ma_bai = 'HLB00224'`, [m76.id])
  const s4 = await xem(T7)
  kt(/MH\.076\[[^\]]*224\]/.test(s4) && !/khác\[[^\]]*224/.test(s4), '224 ⇒ cuối khối MH.076 có sẵn')
  const [{ n }] = await q(`select count(*)::int n from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id where p.tai_lieu_id = $1`, [T7])
  kt(n === 40, `vẫn 40 bài (${n})`)
} catch (e) { sai++; console.log('  ✘ LỖI', e.message) } finally { await q('rollback'); console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK)`); await c.end() }
