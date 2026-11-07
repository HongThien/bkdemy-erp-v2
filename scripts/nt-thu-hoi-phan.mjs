// Thu hồi lỗi bán phân bón Nông Trại (Thùy 07/11): hoàn ĐHT + rút EXP khỏi game + thông báo + sổ đối soát.
// KHÔNG đụng xu ví thật (qlht_xu_ledger / nt_xu) — bàn sau.
// Mặc định CHẠY THỬ (ROLLBACK) và in bảng từng em. Chỉ ghi thật khi có --ghi.
//   node scripts/nt-thu-hoi-phan.mjs          # chạy thử
//   node scripts/nt-thu-hoi-phan.mjs --ghi    # ghi thật
import pg from 'pg'
import fs from 'fs'

const GHI = process.argv.includes('--ghi')
// BƯỚC 1 (mặc định) = chỉ rút EXP/xu game + sổ. Hoàn ĐHT + thông báo là bước riêng: cờ --kem-diem-tin (chưa dùng khi đã chạy bước 1 — cần viết chế độ bổ sung theo sổ).
const DIEM = process.argv.includes('--kem-diem-tin')
const REF = 'nt_phan:20261107'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
  .map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()

function tinh(state) {
  const d = state.dem || {}
  const ban = (d.muaPhan || 0) - (d.bon || 0) - ((state.kho || {}).phan_bon || 0)
  if (ban <= 0) return null
  const F = 5 * ban
  const vi = state.vi || {}
  const exp0 = vi.exp || 0, xu0 = vi.xu || 0
  const rutVi = Math.min(exp0, F)
  let thieu = F - rutVi
  let xuRut = 0, traLai = 0
  if (thieu > 0 && xu0 > 0) {
    xuRut = Math.min(xu0, Math.ceil(thieu / 100))
    const bu = Math.min(thieu, xuRut * 100)
    traLai = xuRut * 100 - bu
    thieu -= bu
  }
  const moi = JSON.parse(JSON.stringify(state))
  moi.vi = { ...vi, exp: exp0 - rutVi + traLai, xu: xu0 - xuRut }
  if (xuRut > 0) {
    moi.dem = { ...d, xuRa: Math.max(0, (d.xuRa || 0) - xuRut) }
    // bộ đếm xu tháng này chỉ hạ khi state đang ở tháng hiện tại (state tháng cũ thì tháng mới tự lập lại)
    if (moi.thang && moi.thang.k === state.__k) moi.thang = { ...moi.thang, ra: Math.max(0, (moi.thang.ra || 0) - xuRut) }
  }
  return { ban, F, rutVi, xuRut, traLai, thieu, moi }
}

function loiNhan(r) {
  const phan = [`Phân bón không bán được nữa (trước đây bán phân bón được EXP cao hơn điểm học tập bỏ ra mua — đây là lỗi game).`,
    `Hoàn lại cho em ${r.ban * 3} điểm học tập (${r.ban} bao phân bón đã bán).`]
  const tru = []
  if (r.rutVi + r.traLai > 0 || r.rutVi > 0) tru.push(`${r.rutVi} EXP`)
  if (r.xuRut > 0) tru.push(`${r.xuRut} xu trong game`)
  if (tru.length) phan.push(`Đã trừ ${tru.join(' và ')} nhận từ việc bán phân bón trong Nông Trại.`)
  phan.push('Xu em đã nhận vào ví thì giữ nguyên. Cảm ơn em đã thông cảm!')
  return phan.join(' ')
}

try {
  await c.query('begin')
  const kRes = await c.query(`select extract(year from (now() at time zone 'Asia/Ho_Chi_Minh'))::int*12 + extract(month from (now() at time zone 'Asia/Ho_Chi_Minh'))::int - 1 as k`)
  const kNay = kRes.rows[0].k
  const rows = (await c.query(`select l.hoc_sinh_id id, h.ma_hs, l.state from nt_luu l join hoc_sinh h on h.id = l.hoc_sinh_id
    where not exists (select 1 from nt_thu_hoi_phan t where t.hoc_sinh_id = l.hoc_sinh_id) for update of l`)).rows
  const bang = []
  for (const r of rows) {
    r.state.__k = kNay
    const t = tinh(r.state)
    if (!t) continue
    delete t.moi.__k; delete r.state.__k
    if (DIEM) await c.query(`insert into dht_hoan (hoc_sinh_id, so, ly_do, ma_tham_chieu) values ($1,$2,$3,$4)`,
      [r.id, t.ban * 3, 'Hoàn điểm học tập — lỗi bán phân bón Nông Trại', REF])
    await c.query(`insert into nt_thu_hoi_phan (hoc_sinh_id, so_bao, dht_hoan, exp_phai_rut, exp_rut_vi, xu_game_rut, exp_tra_lai, exp_con_thieu, state_truoc)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [r.id, t.ban, DIEM ? t.ban * 3 : 0, t.F, t.rutVi, t.xuRut, t.traLai, t.thieu, JSON.stringify(r.state)])
    await c.query(`update nt_luu set state = $2, cap_nhat = clock_timestamp() where hoc_sinh_id = $1`, [r.id, JSON.stringify(t.moi)])
    if (DIEM) await c.query(`insert into hs_tin_moi (hoc_sinh_id, loai, tieu_de, noi_dung, bieu_tuong, ref) values ($1,'nong_trai',$2,$3,'🌱',$4)`,
      [r.id, 'Nông Trại: hoàn điểm học tập phân bón', loiNhan(t), REF])
    bang.push({ id: r.id, ma: r.ma_hs, bao: t.ban, hoan_dht: t.ban * 3, exp_rut_vi: t.rutVi, xu_game_rut: t.xuRut, exp_tra_lai: t.traLai, con_thieu: t.thieu })
  }
  console.table(bang.map(({ id, ...x }) => x))
  const tong = k => bang.reduce((a, x) => a + x[k], 0)
  console.log(`Số em: ${bang.length} · bao: ${tong('bao')} · hoàn ĐHT: ${tong('hoan_dht')} · EXP rút ví: ${tong('exp_rut_vi')} · xu game rút: ${tong('xu_game_rut')} · EXP còn thiếu: ${tong('con_thieu')}`)
  // kiểm: số dư ĐHT sau hoàn tính được, không lỗi
  for (const m of DIEM ? bang.filter(x => ['HS0527', 'HS0421', 'HS0631'].includes(x.ma)) : []) {
    const chk = await c.query(`select public._dht_so_du($1) j`, [m.id])
    console.log(m.ma, '_dht_so_du sau hoàn:', JSON.stringify(chk.rows[0].j))
  }
  if (GHI) { await c.query('commit'); console.log('✅ ĐÃ GHI THẬT') } else { await c.query('rollback'); console.log('↩ CHẠY THỬ — đã ROLLBACK, chưa ghi gì') }
} catch (e) {
  await c.query('rollback').catch(() => {})
  console.error('❌', e.message)
  process.exitCode = 1
} finally { await c.end() }
