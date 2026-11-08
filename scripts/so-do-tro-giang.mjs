// SƠ ĐỒ TRỢ GIẢNG theo khối (CEO 14/10): Quản lý trợ giảng → Trưởng khối → TA của khối (+ Phó khối chỉ-xem).
//
//   node scripts/so-do-tro-giang.mjs            → CHỈ IN diff (dry-run, mặc định)
//   node scripts/so-do-tro-giang.mjs --ap       → áp trong 1 transaction (cần DATABASE_URL_RW truyền lúc gọi)
//
// KHÔNG XOÁ gì: ghế cũ không còn khớp được để nguyên (in ra cho người quyết).
// Danh sách TA của mỗi khối SUY TỪ phan_cong_lop (vai_tro='tg') — TA dạy 2 khối có ghế ở CẢ 2 nơi.
// Cần mig 202610142140 (cột vi_tri.khoi_quan_ly / chi_xem) đã áp trước khi chạy --ap.
import fs from 'fs'
import pg from 'pg'

// ⛔ LỖI THỜI từ 29/10 (mig 202610291813 đã xoá cột vi_tri.khoi_quan_ly): trưởng / phó khối giờ PHÂN CÔNG ở màn Phân công hoặc
// Team Quản lý chất lượng (bảng phan_cong_quan_ly_khoi); ghế trưởng khối ở team TA · Học thuật · QLCL do DB tự sinh. Đừng chạy script này.
console.error("so-do-tro-giang.mjs đã lỗi thời (29/10) — dùng màn Phân công / Team Quản lý chất lượng."); process.exit(1)

const AP = process.argv.includes('--ap')

// ── KHAI BÁO (sửa ở đây là đủ) ────────────────────────────────────────────────
const TRUONG_KHOI = [
  { ma: 'NS033', khoi: ['6'] },                 // Hà Giang
  { ma: 'NS004', khoi: ['7'] },                 // Cường
  { ma: 'NS002', khoi: ['8'] },                 // Phạm Trang (đồng thời Quản lý trợ giảng)
  { ma: 'NS008', khoi: ['9'] },                 // Hải
  { ma: 'NS010', khoi: ['4T', '5T'] },          // Ngân (CLC — tách hẳn khối 4, 5)
  { ma: 'NS035', khoi: ['3', '4', '5'] },       // Lộ Thị Dương
  { ma: 'NS007', khoi: ['10', '11', '12'] },    // Đạt
]
// Phó khối: ghế NGANG HÀNG TA, cùng cha là trưởng khối; chỉ xem + nhắc + báo cáo lên (không giao việc / không gậy).
const PHO_KHOI = [
  { ma: 'NS009', khoi: '7' },                   // Hoàng Thị Quỳnh Trang
  { ma: 'NS014', khoi: '8' },                   // Trần Thị Thảo Nguyên
]
const MA_QUAN_LY = 'NS002'                      // người giữ ghế "Quản lý trợ giảng" (đỉnh team Trợ giảng)
const TEAM = 'Trợ giảng'
const MON = 'Toán'
// ─────────────────────────────────────────────────────────────────────────────

const env = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : ''
const key = (k) => (env.match(new RegExp('^' + k + '=(.*)$', 'm')) ?? [])[1]?.trim().replace(/^["']|["']$/g, '')
const url = AP ? (process.env.DATABASE_URL_RW ?? key('DATABASE_URL')) : (key('DATABASE_URL_RO') ?? key('DATABASE_URL'))
if (!url) { console.error('❌ Thiếu chuỗi kết nối' + (AP ? ' (truyền DATABASE_URL_RW lúc gọi)' : '')); process.exit(1) }
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
const rows = async (s, p = []) => (await c.query(s, p)).rows

const team = (await rows(`select id from team where ten=$1`, [TEAM]))[0]?.id
if (!team) throw new Error('Không thấy team ' + TEAM)
const ns = Object.fromEntries((await rows(`select id, ma_ns, ho_ten from nhan_su`)).map((r) => [r.ma_ns, r]))
let seats = await rows(`select id, ten, cap, cha_id, nhan_su_id, mon from vi_tri where team_id=$1`, [team])
const top = seats.find((s) => s.cap === 'truong' && s.nhan_su_id === ns[MA_QUAN_LY]?.id)
if (!top) throw new Error('Không thấy ghế Quản lý trợ giảng')

// TA từng khối (lớp đang chạy, môn Toán)
const ta = await rows(`
  select l.khoi, p.nhan_su_id from phan_cong_lop p join lop l on l.id=p.lop_id
  where p.vai_tro='tg' and l.mon=$1 and l.trang_thai is distinct from 'ket_thuc'
  group by 1,2`, [MON])

const hanhDong = []          // {loai:'sua'|'them', ...}
const dung = new Set()       // ghế đã được dùng trong lượt này
const ten = (id) => Object.values(ns).find((n) => n.id === id)?.ho_ten ?? '?'
const layGhe = (nsId, uuTien) => {
  const ds = seats.filter((s) => s.nhan_su_id === nsId && !dung.has(s.id) && s.id !== top.id)
  return (uuTien && ds.find(uuTien)) || ds[0] || null
}

const gheTruong = {}         // khối → id ghế trưởng (hoặc id tạm)
let tam = 0
for (const t of TRUONG_KHOI) {
  const n = ns[t.ma]; if (!n) throw new Error('Không thấy ' + t.ma)
  const nhan = 'Trưởng khối ' + t.khoi.join(' ')
  let g = layGhe(n.id, (s) => s.cha_id === top.id)
  if (g) {
    dung.add(g.id)
    hanhDong.push({ loai: 'sua', id: g.id, nguoi: n.ho_ten, ten: nhan, cha: top.id, khoi_quan_ly: t.khoi, chi_xem: false, cu: g })
  } else {
    g = { id: 'TAM' + ++tam }
    hanhDong.push({ loai: 'them', id: g.id, nguoi: n.ho_ten, nhan_su_id: n.id, ten: nhan, cha: top.id, khoi_quan_ly: t.khoi, chi_xem: false })
  }
  for (const k of t.khoi) gheTruong[k] = g.id
}

const phoNs = new Map(PHO_KHOI.map((p) => [ns[p.ma].id, p.khoi]))
// phó khối
for (const p of PHO_KHOI) {
  const n = ns[p.ma]
  const cha = gheTruong[p.khoi]
  let g = layGhe(n.id)
  const nhan = 'Phó khối ' + p.khoi
  if (g) {
    dung.add(g.id)
    hanhDong.push({ loai: 'sua', id: g.id, nguoi: n.ho_ten, ten: nhan, cha, khoi_quan_ly: [p.khoi], chi_xem: true, cu: g })
  } else {
    hanhDong.push({ loai: 'them', id: 'TAM' + ++tam, nguoi: n.ho_ten, nhan_su_id: n.id, ten: nhan, cha, khoi_quan_ly: [p.khoi], chi_xem: true })
  }
}

// TA từng khối
const truongNs = new Set(TRUONG_KHOI.map((t) => ns[t.ma].id))
for (const t of TRUONG_KHOI) {
  for (const k of t.khoi) {
    const owner = ns[t.ma].id
    const ds = [...new Set(ta.filter((r) => r.khoi === k).map((r) => r.nhan_su_id))]
      .filter((id) => id !== owner)                           // trưởng khối không là TA của chính mình
      .filter((id) => phoNs.get(id) !== k)                    // phó của khối này đã có ghế phó
    for (const id of ds) {
      // một TA có thể thuộc nhiều trưởng khối; hai khối cùng trưởng (vd 3,4,5) chỉ cần MỘT ghế dưới trưởng đó
      const daCo = hanhDong.find((h) => h.cha === gheTruong[k] && (h.nhan_su_id === id || h.cu?.nhan_su_id === id))
      if (daCo) continue
      const g = layGhe(id, (s) => s.cha_id === top.id)
      if (g) {
        dung.add(g.id)
        hanhDong.push({ loai: 'sua', id: g.id, nguoi: ten(id), ten: g.ten?.trim() ? g.ten : 'Trợ giảng', cha: gheTruong[k], khoi_quan_ly: [], chi_xem: false, cu: g })
      } else {
        hanhDong.push({ loai: 'them', id: 'TAM' + ++tam, nguoi: ten(id), nhan_su_id: id, ten: 'Trợ giảng', cha: gheTruong[k], khoi_quan_ly: [], chi_xem: false })
      }
    }
  }
}

// ── IN DIFF ──────────────────────────────────────────────────────────────────
const tenGhe = (id) => {
  const h = hanhDong.find((x) => x.id === id)
  return h ? `${h.ten} (${h.nguoi})` : (id === top.id ? 'Quản lý trợ giảng (đỉnh)' : id)
}
console.log(AP ? '== ÁP ==' : '== DRY-RUN (chưa ghi gì) ==')
for (const h of hanhDong) {
  const cuCha = h.cu ? (h.cu.cha_id === h.cha ? '(giữ cha)' : `cha cũ: ${seats.find((s) => s.id === h.cu.cha_id)?.ten || h.cu.cha_id?.slice(0, 4) || '—'}`) : ''
  console.log(`${h.loai === 'them' ? '+ THÊM ghế' : '~ SỬA ghế '} [${h.nguoi}] "${h.ten}" → dưới ${tenGhe(h.cha)} ${h.khoi_quan_ly.length ? '· khối ' + h.khoi_quan_ly.join(',') : ''}${h.chi_xem ? ' · CHỈ XEM' : ''} ${cuCha}`)
}
const conLai = seats.filter((s) => !dung.has(s.id) && s.id !== top.id && s.nhan_su_id)
console.log('\nGhế team Trợ giảng KHÔNG đụng tới (' + conLai.length + '):')
for (const s of conLai) console.log(`   · ${ten(s.nhan_su_id)} — "${s.ten ?? ''}" ${s.mon ?? ''}`)

if (AP) {
  await c.query('begin')
  try {
    const idMoi = {}
    const resolve = (id) => idMoi[id] ?? id
    for (const h of hanhDong.filter((x) => x.loai === 'them')) {
      const r = await c.query(
        `insert into vi_tri (team_id, ten, cap, cha_id, nhan_su_id, mon, khoi_quan_ly, chi_xem)
         values ($1,$2,'thanh_vien',null,$3,$4,$5,$6) returning id`,
        [team, h.ten, h.nhan_su_id, MON, h.khoi_quan_ly, h.chi_xem])
      idMoi[h.id] = r.rows[0].id
    }
    for (const h of hanhDong) {
      const id = resolve(h.id)
      await c.query(
        `update vi_tri set ten=$2, cha_id=$3, khoi_quan_ly=$4, chi_xem=$5, mon=coalesce(mon,$6) where id=$1`,
        [id, h.ten, resolve(h.cha), h.khoi_quan_ly, h.chi_xem, MON])
    }
    await c.query('commit')
    console.log('\n✅ Đã áp ' + hanhDong.length + ' thay đổi.')
  } catch (e) { await c.query('rollback'); throw e }
} else {
  console.log('\n(Chạy lại với --ap để áp. Chưa ghi gì.)')
}
await c.end()
