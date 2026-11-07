// Thu hồi phân bón — BƯỚC 2: hoàn điểm học tập (dht_hoan) + gửi thông báo, theo sổ nt_thu_hoi_phan (bước 1 đã rút EXP/xu game).
// Chỉ xử lý em có sổ.dht_hoan = 0 ⇒ chạy lại không hoàn 2 lần. Mặc định CHẠY THỬ (ROLLBACK); ghi thật với --ghi.
import pg from 'pg'
import fs from 'fs'

const GHI = process.argv.includes('--ghi')
const REF = 'nt_phan:20261107'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
  .map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()

function loiNhan(r) {
  const tru = []
  if (r.exp_rut_vi > 0) tru.push(`${r.exp_rut_vi} EXP`)
  if (r.xu_game_rut > 0) tru.push(`${r.xu_game_rut} xu trong game`)
  return [
    'Phân bón không bán được nữa (trước đây bán phân bón được EXP cao hơn điểm học tập bỏ ra mua — đây là lỗi game).',
    `Hoàn lại cho em ${r.so_bao * 3} điểm học tập (${r.so_bao} bao phân bón đã bán).`,
    tru.length ? `Đã trừ ${tru.join(' và ')} nhận từ việc bán phân bón trong Nông Trại.` : '',
    'Xu em đã nhận vào ví thì giữ nguyên. Cảm ơn em đã thông cảm!',
  ].filter(Boolean).join(' ')
}

try {
  await c.query('begin')
  const rows = (await c.query(`select t.*, h.ma_hs from nt_thu_hoi_phan t join hoc_sinh h on h.id = t.hoc_sinh_id
    where t.dht_hoan = 0 order by t.so_bao desc for update of t`)).rows
  for (const r of rows) {
    await c.query(`insert into dht_hoan (hoc_sinh_id, so, ly_do, ma_tham_chieu) values ($1,$2,$3,$4)`,
      [r.hoc_sinh_id, r.so_bao * 3, 'Hoàn điểm học tập — lỗi bán phân bón Nông Trại', REF])
    await c.query(`update nt_thu_hoi_phan set dht_hoan = $2 where hoc_sinh_id = $1`, [r.hoc_sinh_id, r.so_bao * 3])
    await c.query(`insert into hs_tin_moi (hoc_sinh_id, loai, tieu_de, noi_dung, bieu_tuong, ref) values ($1,'nong_trai',$2,$3,'🌱',$4)`,
      [r.hoc_sinh_id, 'Nông Trại: hoàn điểm học tập phân bón', loiNhan(r), REF])
  }
  console.log(`Số em: ${rows.length} · hoàn ĐHT: ${rows.reduce((a, r) => a + r.so_bao * 3, 0)}`)
  for (const m of rows.filter(x => ['HS0527', 'HS0421', 'HS0631'].includes(x.ma_hs))) {
    const j = (await c.query(`select public._dht_so_du($1) j`, [m.hoc_sinh_id])).rows[0].j
    console.log(m.ma_hs, 'hoàn', m.so_bao * 3, '→ số dư ĐHT', j.so_du)
  }
  if (rows[0]) console.log('Mẫu tin:', loiNhan(rows[0]))
  if (GHI) { await c.query('commit'); console.log('✅ ĐÃ GHI THẬT') } else { await c.query('rollback'); console.log('↩ CHẠY THỬ — đã ROLLBACK') }
} catch (e) {
  await c.query('rollback').catch(() => {})
  console.error('❌', e.message)
  process.exitCode = 1
} finally { await c.end() }
