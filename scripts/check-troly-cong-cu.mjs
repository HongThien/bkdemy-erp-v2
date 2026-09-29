// ============================================================================
// check-troly-cong-cu.mjs — chạy thử TỪNG công cụ của trợ lý (fn_troly_goi) trên DB thật.
//
// Mọi thứ nằm trong MỘT transaction rồi ROLLBACK — không để lại gì trên DB.
// Giả danh người hỏi bằng `request.jwt.claims` (khuôn smoke của chiến dịch §2.0).
//
//   node scripts/check-troly-cong-cu.mjs                       → gọi mọi công cụ với tham số mẫu
//   node scripts/check-troly-cong-cu.mjs --thu <file.sql>      → áp THỬ file migration trong
//                                                                transaction trước khi gọi (rồi rollback)
//   node scripts/check-troly-cong-cu.mjs --goi <tên> '<json>'  → gọi 1 công cụ, in nguyên kết quả
//   node scripts/check-troly-cong-cu.mjs --bao-cao [YYYY-MM-DD] [--so-ngay 14]
//                                                              → in báo cáo 3 luồng tính tới ngày đó (bỏ trống = hôm nay)
//   node scripts/check-troly-cong-cu.mjs --lay [--so-ngay 14]  → thử cửa màn hình gọi: mở màn / mở lại / tính lại
//
// ⚠ Kết nối bằng role của `.env` (chủ bảng ⇒ RLS KHÔNG áp). Script này kiểm LOGIC + CỔNG 3 người,
//   KHÔNG kiểm RLS. RLS chỉ kiểm được bằng đăng nhập thật trên app.
// ============================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const envKey = (ten) => txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') ?? null
const url = envKey('DATABASE_URL_RO') ?? envKey('DATABASE_URL')
if (!url) { console.error('❌ Thiếu DATABASE_URL_RO / DATABASE_URL trong .env'); process.exit(1) }

const args = process.argv.slice(2)
// --thu lặp lại được (áp thử nhiều file theo thứ tự gõ)
const fileThu = args.flatMap((a, i) => (a === '--thu' && args[i + 1] ? [args[i + 1]] : []))
const iBc = args.indexOf('--bao-cao')
const baoCaoNgay = iBc >= 0 ? (args[iBc + 1] && !args[iBc + 1].startsWith('--') ? args[iBc + 1] : null) : undefined
const iSn = args.indexOf('--so-ngay')
const soNgay = iSn >= 0 ? Number(args[iSn + 1]) : 14
const iGoi = args.indexOf('--goi')
const goiTen = iGoi >= 0 ? args[iGoi + 1] : null
const goiThamSo = iGoi >= 0 ? JSON.parse(args[iGoi + 2] ?? '{}') : null

const c = new pg.Client({ connectionString: url })
await c.connect()
let hong = 0
try {
  await c.query('begin')
  for (const f of fileThu) {
    await c.query(readFileSync(resolve(f), 'utf8'))
    console.log(`(đã áp THỬ ${f} trong transaction — sẽ rollback)`)
  }

  // Người được phép: lấy từ chính tài khoản của CEO trong DB, không gõ cứng uuid ở đây.
  const { rows: [ceo] } = await c.query(`
    select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id
    where ns.la_admin_he_thong and ns.trang_thai = 'dang_lam' order by ns.ma_ns limit 1`)
  const { rows: [nguoiLa] } = await c.query(`
    select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id
    where ns.trang_thai = 'dang_lam' and tk.id <> $1 order by ns.ma_ns desc limit 1`, [ceo.id])
  const dongVai = (uid) => c.query(`select set_config('request.jwt.claims', $1, true)`,
    [uid ? JSON.stringify({ sub: uid, role: 'authenticated' }) : ''])

  // ── CỔNG ──────────────────────────────────────────────────────────────────
  const biChan = async (nhan, uid) => {
    await c.query('savepoint g')
    await dongVai(uid)
    try {
      await c.query(`select public.fn_troly_goi('tuyen_sinh', '{}'::jsonb)`)
      console.log(`❌ CỔNG HỞ: ${nhan} gọi được công cụ`); hong++
    } catch (e) { console.log(`✔ cổng chặn ${nhan}: ${e.message}`) }
    await c.query('rollback to savepoint g')
  }
  if (!goiTen && baoCaoNgay === undefined && !args.includes('--lay')) {
    await biChan('người ngoài danh sách', nguoiLa.id)
    await biChan('không đăng nhập (anon)', null)
  }

  await dongVai(ceo.id)
  const goi = async (ten, thamSo) => {
    const t0 = Date.now()
    const { rows: [r] } = await c.query(`select public.fn_troly_goi($1, $2::jsonb) as kq`, [ten, JSON.stringify(thamSo)])
    return { kq: r.kq, ms: Date.now() - t0 }
  }

  // ── CỬA MÀN HÌNH GỌI: lấy bản lưu / tính rồi lưu (mọi thứ vẫn rollback) ───────
  if (args.includes('--lay')) {
    await c.query('savepoint g')
    await dongVai(nguoiLa.id)
    try { await c.query(`select public.fn_troly_bao_cao_lay($1, false)`, [soNgay]); console.log('❌ CỔNG HỞ ở fn_troly_bao_cao_lay'); hong++ }
    catch (e) { console.log(`✔ cổng chặn người ngoài danh sách: ${e.message}`) }
    await c.query('rollback to savepoint g')
    await dongVai(ceo.id)
    const lay = async (nhan, tinhLai) => {
      const t0 = Date.now()
      const { rows: [r] } = await c.query(`select public.fn_troly_bao_cao_lay($1, $2) as bc`, [soNgay, tinhLai])
      console.log(`${nhan}: ${Date.now() - t0} ms · luu = ${JSON.stringify(r.bc.luu)} · tổng = ${JSON.stringify(r.bc.tong)}`)
      return r.bc
    }
    const a = await lay('lượt 1 (mở màn)      ', false)
    const b = await lay('lượt 2 (mở lại)      ', false)
    const d = await lay('lượt 3 (bấm tính lại)', true)
    if (b.luu.vua_tinh) { console.log('❌ lượt 2 phải lấy từ bản lưu, không được tính lại'); hong++ }
    if (!d.luu.vua_tinh || d.luu.so_lan_tinh !== b.luu.so_lan_tinh + 1) { console.log('❌ bấm tính lại phải tính + tăng so_lan_tinh'); hong++ }
    if (JSON.stringify(a.tong) !== JSON.stringify(b.tong)) { console.log('❌ bản lưu khác bản vừa tính'); hong++ }
    const { rows: [n] } = await c.query(`select count(*)::int n from troly_bao_cao_luu where ngay = public._troly_hom_nay() and so_ngay = $1`, [soNgay])
    console.log(n.n === 1 ? '✔ đúng 1 dòng lưu cho (hôm nay, khoảng này) — tính lại là GHI ĐÈ' : `❌ ${n.n} dòng lưu`)
    if (n.n !== 1) hong++
  } else
  // ── BÁO CÁO 3 LUỒNG: in nguyên JSON để đối chiếu với màn hình ───────────────
  if (baoCaoNgay !== undefined) {
    await c.query('savepoint g')
    await dongVai(nguoiLa.id)
    try { await c.query(`select public.fn_troly_bao_cao($1::date, $2)`, [baoCaoNgay, soNgay]); console.log('❌ CỔNG HỞ ở báo cáo'); hong++ }
    catch (e) { console.error(`✔ cổng chặn người ngoài danh sách: ${e.message}`) }
    await c.query('rollback to savepoint g')
    await dongVai(ceo.id)
    const t0 = Date.now()
    const { rows: [r] } = await c.query(`select public.fn_troly_bao_cao($1::date, $2) as bc`, [baoCaoNgay, soNgay])
    console.log(JSON.stringify(r.bc, null, 1))
    console.error(`— ${Date.now() - t0} ms · ${JSON.stringify(r.bc).length} ký tự`)
  } else if (goiTen) {
    const { kq, ms } = await goi(goiTen, goiThamSo)
    console.log(JSON.stringify(kq, null, 1))
    console.log(`— ${ms} ms · ${JSON.stringify(kq).length} ký tự`)
  } else {
    const { rows: [dm] } = await c.query(`select public.fn_troly_danh_muc() as dm`)
    console.log(`✔ danh mục: ${dm.dm.length} công cụ — ${dm.dm.map((t) => t.name).join(', ')}`)

    // Tham số mẫu lấy từ DỮ LIỆU THẬT (lớp/HS có nhiều buổi gần đây) — gõ cứng tên thì vài tháng sau hết đúng.
    const { rows: [lop] } = await c.query(`
      select l.ten_lop from buoi_hoc b join lop l on l.id = b.lop_id
      where b.loai = 'thuong' and b.et_dong_at is not null and b.ngay > current_date - 45
      group by l.ten_lop order by count(*) desc limit 1`)
    const { rows: [hs] } = await c.query(`
      select hs.ho_ten from gami_grades g join hoc_sinh hs on hs.id = g.hoc_sinh_id
      where g.graded_at > now() - interval '45 days' and hs.trang_thai = 'dang_hoc'
      group by hs.id, hs.ho_ten order by count(*) desc limit 1`)
    const { rows: [ns] } = await c.query(`
      select ns.ho_ten from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
      where ns.trang_thai = 'dang_lam' group by ns.id, ns.ho_ten order by count(*) desc limit 1`)
    console.log(`  mẫu: lớp "${lop?.ten_lop}" · HS "${hs?.ho_ten}" · nhân sự "${ns?.ho_ten}"\n`)

    const CA = [
      ['hoc_tap_hoc_sinh', { ten_hoc_sinh: hs.ho_ten }],
      ['hoc_tap_hoc_sinh', { ten_hoc_sinh: 'nguyen' }],                      // phải ra trung_ten
      ['hoc_tap_hoc_sinh', { ten_hoc_sinh: 'zzz khong co ai' }],             // phải ra khong_thay
      ['ket_qua_lop', { ten_lop: lop.ten_lop, loai: 'et' }],
      ['ket_qua_lop', { ten_lop: lop.ten_lop, loai: 'btvn' }],
      ['ket_qua_lop', { ten_lop: lop.ten_lop, loai: 'mt', tu_ngay: '2026-07-01' }],
      ['tinh_trang_buoi', {}],
      ['tinh_trang_buoi', { tu_ngay: '2026-07-01' }],
      ['viec_van_hanh', {}],
      ['viec_van_hanh', { ten_nhan_vien: ns.ho_ten, trang_thai: 'tat_ca' }],
      ['viec_phat_trien', {}],
      ['ket_qua_viec_thang', {}],
      ['vang_hoc', {}],
      ['thieu_btvn', { khoi: '8' }],
      ['bo_tro', { loai: 'bu' }],
      ['bo_tro', { loai: 'duoi' }],
      ['bo_tro', { loai: 'yeu' }],
      ['hoc_phi_hoc_sinh', { ten_hoc_sinh: hs.ho_ten }],
      ['hoc_phi_no', {}],
      ['tuyen_sinh', {}],
      ['xep_hang', { mon: 'Toán', top: 5 }],
      ['khong_ton_tai', {}],                                                  // phải ra khong_co_cong_cu
      ['vang_hoc', { tu_ngay: 'hom qua' }],                                   // ngày sai dạng → loi_thuc_thi
    ]
    for (const [ten, ts] of CA) {
      try {
        const { kq, ms } = await goi(ten, ts)
        const s = JSON.stringify(kq)
        const tom = kq.loi ? `loi=${kq.loi} · ${kq.thong_diep}` : Object.entries(kq)
          .filter(([k]) => k !== 'ghi_chu')
          .map(([k, v]) => Array.isArray(v) ? `${k}[${v.length}]` : (v && typeof v === 'object') ? `${k}{${Object.keys(v).length}}` : `${k}=${v}`)
          .join(' · ')
        const canhBao = s.length > 60000 ? '  ⚠ QUÁ TO' : ms > 8000 ? '  ⚠ CHẬM' : ''
        console.log(`${kq.loi === 'loi_thuc_thi' && ten !== 'vang_hoc' ? '❌' : '✔'} ${ten} ${JSON.stringify(ts)}  ${ms}ms · ${s.length} ký tự${canhBao}\n    ${tom.slice(0, 400)}`)
        if (kq.loi === 'loi_thuc_thi' && !(ten === 'vang_hoc' && ts.tu_ngay === 'hom qua')) hong++
      } catch (e) { console.log(`❌ ${ten} ${JSON.stringify(ts)} NỔ: ${e.message}`); hong++ }
    }
  }
} catch (e) {
  console.error('❌', e.message, e.position ? `(vị trí ${e.position})` : ''); hong++
} finally {
  await c.query('rollback').catch(() => {})
  await c.end()
}
console.log(hong ? `\n❌ ${hong} chỗ hỏng` : '\n✔ xong, không hỏng chỗ nào (đã rollback)')
process.exit(hong ? 1 : 0)
