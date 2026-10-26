// Kiểm mig 202610261856 (công cụ kho gán dạng bài) — mọi thứ trong 1 transaction rồi ROLLBACK, không ghi gì.
// Chạy từ gốc repo: node scripts/_test_kho_cong_cu_bdm.mjs [--ap-lai]   (--ap-lai = chạy lại file migration trong transaction trước khi kiểm)
import fs from 'fs'
import { createRequire } from 'module'
const pg = createRequire(process.cwd() + '/package.json')('pg')
const env = fs.readFileSync('.env', 'utf8')
const c = new pg.Client({ connectionString: env.match(/^DATABASE_URL=(.*)$/m)[1].trim(), ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const J = JSON.stringify
let ok = 0, sai = 0
const kiem = (ten, dk, them = '') => { if (dk) { ok++; console.log('  ✔', ten, them) } else { sai++; console.log('  ✘', ten, them) } }
async function loi(fn) { await q('savepoint s'); try { await fn(); await q('release savepoint s'); return null } catch (e) { await q('rollback to savepoint s'); return e.message } }
const t0 = () => Date.now()
await q('begin')
try {
  const dem = async () => Object.fromEntries((await q(`select loc||':'||coalesce(khoi,'*') k, so_cau from fn_kho_dem_hang_duyet(array['toan','hgt'])`)).map((r) => [r.k, Number(r.so_cau)]))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [J({ sub: ad.id, role: 'authenticated' })])
  const truoc = await dem()
  if (process.argv.includes('--ap-lai')) await c.query(fs.readFileSync('supabase/migrations/202610261856_kho_cong_cu_gan_dang_bai.sql', 'utf8'))
  const sau = await dem()
  console.log('Đếm hàng duyệt (trước → sau):')
  for (const k of Object.keys({ ...truoc, ...sau }).sort()) if (/:(6|7|8|8T|9|10|11|12|4T|5|\*)$/.test(k) && truoc[k] !== sau[k]) console.log('   ', k, truoc[k] ?? 0, '→', sau[k] ?? 0)
  kiem('cấp 1 (4T) không đổi số', ['cau_moi', 'chua_dang', 'nghi', 'ton_dong', 'moi', 'khong_kiem'].every((l) => (truoc[l + ':4T'] ?? 0) === (sau[l + ':4T'] ?? 0)))

  // hàng duyệt: chua_dang K6 khớp đếm, HGT có dạng bài
  let t = t0(); const cd6 = await q(`select * from fn_kho_hang_duyet('toan','chua_dang','6',1000,0)`); const ms = Date.now() - t
  const cd6h = await q(`select 1 from fn_kho_hang_duyet('hgt','chua_dang','6',1000,0)`); kiem('chua_dang K6 (Đại+HGT) = đếm', cd6.length + cd6h.length === (sau['chua_dang:6'] ?? 0), `${cd6.length} dòng · ${ms}ms`)
  kiem('chua_dang K6 không còn câu đã gán', cd6.every((r) => r.bdm_trang_thai !== 'gan'))
  t = t0(); const cm12 = await q(`select * from fn_kho_hang_duyet('toan','cau_moi','12',1000,0)`); console.log('    cau_moi K12', cm12.length, 'dòng', Date.now() - t, 'ms')
  t = t0(); const h10 = await q(`select * from fn_kho_hang_duyet('hgt','cau_moi','10',1000,0)`); console.log('    hgt cau_moi K10', h10.length, 'dòng', Date.now() - t, 'ms')
  kiem('HGT có dạng bài trả về', h10.some((r) => r.bdm_dang_bai_id), `${h10.filter((r) => r.bdm_dang_bai_id).length}/${h10.length}`)
  const dx = await q(`select * from fn_kho_hang_duyet('toan','chua_dang','12',1000,0) where bdm_trang_thai='de_xuat'`)
  kiem('đề xuất hiện ở chua_dang K12', dx.length > 0, String(dx.length))

  // câu K6 chờ chưa gán, thường
  const [cau] = await q(`select c.ma_cau from dai_cau_hoi c where c.dang_chinh='T106000000' and c.xoa_at is null and c.loai_cau<>'dung_sai'
      and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau in (c.ma_cau, c.parent_ma_cau)) and c.noi_dung <> '' limit 1`)
  const [db6] = await q(`select ma_dang from bdm_ban_do where khoi='6' and nhanh_bdm='toan' limit 1`)
  const [nsu] = await q(`select public.current_nhan_su_id() id`)
  const e1 = await loi(() => q(`select fn_kho_duyet_cau('toan', $1, $2, '{}'::jsonb)`, [cau.ma_cau, nsu.id]))
  kiem('duyệt câu chờ chưa gán ⇒ chặn', !!e1 && /Chưa phân dạng/.test(e1), e1 ?? '')
  const [kq] = await q(`select fn_kho_duyet_cau('toan', $1, $2, $3::jsonb) r`, [cau.ma_cau, nsu.id, J({ dang_bai: db6.ma_dang })])
  const [g] = await q(`select g.*, c.da_duyet, c.dang_chinh from dai_bdm_gan_cau g join dai_cau_hoi c using (ma_cau) where ma_cau=$1`, [cau.ma_cau])
  kiem('duyệt + chọn dạng bài ⇒ gán nguoi + da_duyet, dang_chinh giữ chờ', g && g.nguon === 'nguoi' && g.dang_bai_id === db6.ma_dang && g.da_duyet && g.dang_chinh === 'T106000000' && g.actor === ad.id, J(kq.r))
  const lg = await q(`select prosrc from pg_proc where proname='_bdm_ghi_log'`); console.log('    log trigger:', (lg[0]?.prosrc ?? '').match(/insert into (w+)/)?.[1])
  const cd6b = await q(`select ma_cau from fn_kho_hang_duyet('toan','chua_dang','6',1000,0)`)
  kiem('câu vừa gán rời chua_dang', !cd6b.some((r) => r.ma_cau === cau.ma_cau))

  // gán thẳng (RPC màn) — đổi dạng bài, không đè khi trùng
  const [db6b] = await q(`select ma_dang from bdm_ban_do where khoi='6' and nhanh_bdm='toan' and ma_dang <> $1 limit 1`, [db6.ma_dang])
  const [r2] = await q(`select fn_bdm_nguoi_gan_cau('toan', $1, $2) v`, [cau.ma_cau, db6b.ma_dang])
  kiem('fn_bdm_nguoi_gan_cau trả tên dạng bài', r2.v?.id === db6b.ma_dang && !!r2.v?.ten, J(r2.v))
  // Đ/S
  const [ds] = await q(`select c.ma_cau from dai_cau_hoi c join dai_ban_do b on b.ma_dang=c.dang_chinh where b.khoi='12' and c.loai_cau='dung_sai' and c.xoa_at is null limit 1`)
  const [db12] = await q(`select ma_dang from bdm_ban_do where khoi='12' and nhanh_bdm='toan' limit 1`)
  const e2 = await loi(() => q(`select fn_bdm_nguoi_gan_cau('toan', $1, $2)`, [ds.ma_cau, db12.ma_dang]))
  kiem('câu Đ/S ⇒ từ chối gán', !!e2 && /Đúng\/Sai/.test(e2), e2 ?? '')
  // cấp 1
  const [c4] = await q(`select c.ma_cau from dai_cau_hoi c where c.dang_chinh='T14T000000' and c.xoa_at is null and c.loai_cau<>'dung_sai' limit 1`)
  const [db4] = await q(`select ma_dang from bdm_ban_do where khoi='4T' limit 1`)
  const e3 = await loi(() => q(`select fn_bdm_nguoi_gan_cau('toan', $1, $2)`, [c4.ma_cau, db4.ma_dang]))
  kiem('cấp 1 (4T) ⇒ từ chối', !!e3 && /chưa chạy bản đồ mới/.test(e3), e3 ?? '')
  const [c4g] = await q(`select c.ma_cau from dai_cau_hoi c join dai_bdm_gan_cau g using (ma_cau) where c.dang_chinh='T14T000000' and c.xoa_at is null and not c.da_duyet limit 1`)
  if (c4g) { const e4 = await loi(() => q(`update dai_cau_hoi set da_duyet=true where ma_cau=$1`, [c4g.ma_cau])); kiem('cấp 1 chờ đã gán vẫn bị chặn duyệt (giữ cũ)', !!e4, e4 ?? '') }
  // nhánh sai: câu HGT + dạng bài Đại
  const [h] = await q(`select c.ma_cau from hgt_cau_hoi c where c.dang_chinh='T310000000' and c.xoa_at is null and c.loai_cau<>'dung_sai' limit 1`)
  const [d10] = await q(`select ma_dang from bdm_ban_do where khoi='10' and nhanh_bdm='toan' limit 1`)
  const [h10db] = await q(`select ma_dang from bdm_ban_do where khoi='10' and nhanh_bdm='hgt' limit 1`)
  const e5 = await loi(() => q(`select fn_bdm_nguoi_gan_cau('hgt', $1, $2)`, [h.ma_cau, d10.ma_dang]))
  kiem('HGT + dạng bài Đại ⇒ từ chối', !!e5 && /không thuộc bản đồ mới/.test(e5), e5 ?? '')
  if (h10db) { const [rh] = await q(`select fn_bdm_nguoi_gan_cau('hgt', $1, $2) v`, [h.ma_cau, h10db.ma_dang]); kiem('HGT + dạng bài HGT ⇒ gán', rh.v?.id === h10db.ma_dang) }
  // mệnh đề Đ/S vẫn chặn như cũ
  // Nhập kho
  const [mx] = await q(`select max(substr(ma_cau,11)::int) m from dai_cau_hoi where ma_cau like 'T106000000%' and substr(ma_cau,11) ~ '^[0-9]+$'`)
  const [n1] = await q(`select fn_bdm_nhap_cau('toan','6',$1::jsonb,$2,null) ma`, [J({ loai_cau: 'tra_loi_ngan', noi_dung: 'Thử nhập: 1+1=?', dap_an: '2', loi_giai: '1+1=2', nguon_giai: 'nguoi' }), db6.ma_dang])
  kiem('nhập câu thường ⇒ mã chờ+STT kế tiếp', n1.ma === 'T106000000' + String(mx.m + 1).padStart(3, '0'), n1.ma)
  const [n1g] = await q(`select g.nguon, g.dang_bai_id, c.dang_chinh, c.da_duyet, c.nguon_loai from dai_bdm_gan_cau g join dai_cau_hoi c using (ma_cau) where ma_cau=$1`, [n1.ma])
  kiem('câu nhập có gán nguoi, dạng chờ, chưa duyệt', n1g?.nguon === 'nguoi' && n1g.dang_chinh === 'T106000000' && !n1g.da_duyet, J(n1g))
  const [cdId] = await q(`select id from dai_bdm_chu_de where khoi='12' and nhanh='toan' limit 1`)
  const [n2] = await q(`select fn_bdm_nhap_cau('toan','12',$1::jsonb,null,$2) ma`, [J({ loai_cau: 'dung_sai', noi_dung: 'Thử Đ/S', menh_de: [{ noi_dung: 'a', dap_an: 'D', loi_giai: null }, { noi_dung: 'b', dap_an: 'S', loi_giai: null }] }), cdId.id])
  const [n2k] = await q(`select k.chu_de_id, k.nguon, (select count(*)::int from dai_cau_menh_de m where m.ma_cau_cha=$1) so_md, (select string_agg(distinct dang_chinh, ',') from dai_cau_menh_de m where m.ma_cau_cha=$1) md_dang from dai_bdm_kho_ds k where ma_cau=$1`, [n2.ma])
  kiem('nhập Đ/S ⇒ kho Đ/S chủ đề, mệnh đề dạng chờ', n2k?.chu_de_id === cdId.id && n2k.so_md === 2 && n2k.md_dang === 'T112000000', `${n2.ma} ${J(n2k)}`)
  const [n3] = await q(`select fn_bdm_nhap_cau('toan','6',$1::jsonb,null,null) ma`, [J({ loai_cau: 'trac_nghiem', noi_dung: 'Thử TN', lua_chon: ['1', '2', '3', '4'], dap_an: 'B' })])
  const [n3g] = await q(`select count(*)::int n from dai_bdm_gan_cau where ma_cau=$1`, [n3.ma])
  kiem('nhập không dạng bài ⇒ chưa gán, mã kế tiếp', n3g.n === 0 && n3.ma === 'T106000000' + String(mx.m + 2).padStart(3, '0'), n3.ma)
  const e6 = await loi(() => q(`select fn_bdm_nhap_cau('toan','4T',$1::jsonb,null,null)`, [J({ loai_cau: 'tu_luan', noi_dung: 'x' })]))
  kiem('nhập cấp 1 ⇒ từ chối', !!e6, e6 ?? '')
  // fn_kho_duyet_cau cũ (không dạng bài) vẫn chạy câu dạng thật
  const [ct] = await q(`select c.ma_cau from dai_cau_hoi c join dai_ban_do b on b.ma_dang=c.dang_chinh where b.khoi='3' and c.xoa_at is null and not c.da_duyet and c.loai_cau<>'dung_sai' limit 1`)
  if (ct) { const e7 = await loi(() => q(`select fn_kho_duyet_cau('toan', $1, $2, '{}'::jsonb)`, [ct.ma_cau, nsu.id])); kiem('duyệt câu cấp 1 dạng thật như cũ', !e7, e7 ?? '') }
} catch (e) { sai++; console.log('LỖI', e.message, e.where ?? '') }
await q('rollback'); await c.end()
console.log(`\n${ok} đạt · ${sai} sai (đã ROLLBACK)`)
