// Kiểm mig 202610261929 (Đ/S ở bản đồ mới: ý không gắn dạng, duyệt câu chỉ cần chủ đề kho Đ/S) — 1 transaction rồi ROLLBACK.
// Chạy từ gốc repo: node scripts/_test_kho_dung_sai_bdm.mjs [--ap-lai]
import fs from 'fs'
import { createRequire } from 'module'
const pg = createRequire(process.cwd() + '/package.json')('pg')
const env = fs.readFileSync('.env', 'utf8')
const c = new pg.Client({ connectionString: env.match(/^DATABASE_URL=(.*)$/m)[1].trim(), ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const J = JSON.stringify
let ok = 0, sai = 0
const kiem = (ten, dk, them = '') => { if (dk) ok++; else sai++; console.log(dk ? '  ✔' : '  ✘', ten, them) }
async function loi(fn) { await q('savepoint s'); try { await fn(); await q('release savepoint s'); return null } catch (e) { await q('rollback to savepoint s'); return e.message } }
await q('begin')
try {
  if (process.argv.includes('--ap-lai')) await c.query(fs.readFileSync('supabase/migrations/202610261929_kho_dung_sai_chu_de_ban_do_moi.sql', 'utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [J({ sub: ad.id, role: 'authenticated' })])
  const [nsu] = await q(`select public.current_nhan_su_id() id`)

  // hàng duyệt Đ/S K12: chủ đề + không còn "thiếu dạng"
  const h = await q(`select * from fn_kho_hang_duyet_ds('toan','12',1000,0)`)
  kiem('hàng Đ/S K12 có chủ đề kho Đ/S', h.some((r) => r.bdm_trang_thai === 'kho_ds' && r.bdm_dang_bai_id), `${h.filter((r) => r.bdm_trang_thai === 'kho_ds').length}/${h.length}`)
  kiem('K12 không câu nào báo ý thiếu dạng', h.every((r) => r.so_thieu_dang === 0))
  const hh = await q(`select * from fn_kho_hang_duyet_ds('hgt','10',1000,0)`)
  kiem('hàng Đ/S HGT K10 có chủ đề', hh.some((r) => r.bdm_trang_thai === 'kho_ds'), `${hh.filter((r) => r.bdm_trang_thai === 'kho_ds').length}/${hh.length}`)

  // câu Đ/S K12 chưa duyệt, CHƯA có chủ đề
  const [x] = await q(`select c.ma_cau, c.parent_ma_cau, jsonb_array_length(c.menh_de) n from dai_cau_hoi c join dai_ban_do b on b.ma_dang=c.dang_chinh
     where b.khoi='12' and c.loai_cau='dung_sai' and c.xoa_at is null and not c.da_duyet and jsonb_array_length(c.menh_de) >= 2
       and not exists (select 1 from dai_bdm_kho_ds k where k.ma_cau in (c.ma_cau, c.parent_ma_cau)) limit 1`)
  const [cd] = await q(`select id from dai_bdm_chu_de where khoi='12' and nhanh='toan' limit 1`)
  const [cdh] = await q(`select id from dai_bdm_chu_de where nhanh='hgt' limit 1`)
  if (x) {
    const e1 = await loi(() => q(`select fn_kho_duyet_cau_ds('toan',$1,$2,'{}'::jsonb,true)`, [x.ma_cau, nsu.id]))
    kiem('duyệt Đ/S chưa chủ đề ⇒ chặn', !!e1 && /chưa có chủ đề/.test(e1), e1 ?? '')
    const e2 = await loi(() => q(`select fn_kho_duyet_cau_ds('toan',$1,$2,$3::jsonb,true)`, [x.ma_cau, nsu.id, J({ chu_de: cdh.id })]))
    kiem('chủ đề sai nhánh (HGT) ⇒ chặn', !!e2 && /không thuộc bản đồ mới/.test(e2), e2 ?? '')
    const [kq] = await q(`select fn_kho_duyet_cau_ds('toan',$1,$2,$3::jsonb,true) r`, [x.ma_cau, nsu.id, J({ chu_de: cd.id })])
    const [st] = await q(`select c.da_duyet, (select count(*)::int from dai_cau_menh_de m where m.ma_cau_cha=c.ma_cau and m.da_duyet) md_ok,
        (select chu_de_id||':'||nguon from dai_bdm_kho_ds k where k.ma_cau = coalesce(c.parent_ma_cau, c.ma_cau)) kd from dai_cau_hoi c where ma_cau=$1`, [x.ma_cau])
    kiem('chọn chủ đề + duyệt hết ⇒ câu + mọi ý duyệt, kho Đ/S nguoi', st.da_duyet && st.md_ok === x.n && st.kd === `${cd.id}:nguoi`, `${J(kq.r)} ${J(st)}`)
  } else console.log('  (không có câu K12 Đ/S chưa chủ đề để thử)')

  // câu Đ/S có chủ đề, ý ở dạng chờ ⇒ duyệt ý không cần dạng
  const [y] = await q(`select c.ma_cau from dai_cau_hoi c join dai_ban_do b on b.ma_dang=c.dang_chinh
     where b.khoi in ('10','11','12') and c.loai_cau='dung_sai' and c.xoa_at is null and not c.da_duyet
       and exists (select 1 from dai_bdm_kho_ds k where k.ma_cau in (c.ma_cau, c.parent_ma_cau))
       and exists (select 1 from jsonb_array_elements(c.menh_de) e where e->>'ma_dang' is null or right(e->>'ma_dang',6)='000000') limit 1`)
  if (y) {
    const [m] = await q(`select fn_kho_duyet_menh_de('toan',$1,1,$2,'{}'::jsonb) r`, [y.ma_cau, nsu.id])
    kiem('duyệt ý dạng chờ ở khối mới ⇒ được', m.r?.da_duyet === true, `${y.ma_cau} ý1 dạng ${m.r?.dang_chinh}`)
  } else console.log('  (không có câu Đ/S ý dạng chờ để thử)')

  const chaCho = (co) => `select c.ma_cau from dai_cau_hoi c where c.dang_chinh='T112000000' and c.loai_cau='dung_sai' and c.xoa_at is null and not c.da_duyet
      and ${co ? '' : 'not'} exists (select 1 from dai_bdm_kho_ds k where k.ma_cau in (c.ma_cau, c.parent_ma_cau)) limit 1`
  const [z] = await q(chaCho(true))
  if (z) { const e5 = await loi(() => q(`update dai_cau_hoi set da_duyet = true where ma_cau = $1`, [z.ma_cau])); kiem('câu Đ/S cha dạng chờ có chủ đề ⇒ trigger cho duyệt', !e5, e5 ?? z.ma_cau) }
  const [z2] = await q(chaCho(false))
  if (z2) { const e6 = await loi(() => q(`update dai_cau_hoi set da_duyet = true where ma_cau = $1`, [z2.ma_cau])); kiem('câu Đ/S cha dạng chờ KHÔNG chủ đề ⇒ chặn', !!e6, e6 ?? '') }
  // cấp 1 / bản đồ cũ: ý dạng chờ vẫn bị chặn (thử bằng hàm mức thấp)
  const [g] = await q(`select public._bdm_dang_o_khoi_moi('dai','T14T000000') a, public._bdm_dang_o_khoi_moi('dai','T112000000') b, public._bdm_dang_o_khoi_moi('hgt','T310000000') h`)
  kiem('khối 4T không phải bản đồ mới; 12 / HGT10 là', !g.a && g.b && g.h, J(g))
  // câu thường không ghi được chủ đề kho Đ/S
  const [t] = await q(`select c.ma_cau from dai_cau_hoi c where c.dang_chinh='T112000000' and c.loai_cau<>'dung_sai' and c.xoa_at is null limit 1`)
  const e3 = await loi(() => q(`select public._bdm_nguoi_gan_chu_de_ds('dai',$1,$2)`, [t.ma_cau, cd.id]))
  kiem('câu thường ⇒ không gán chủ đề Đ/S', !!e3 && /không phải Đúng\/Sai/.test(e3), e3 ?? '')
  // câu thường mig trước vẫn đúng
  const [u] = await q(`select c.ma_cau from dai_cau_hoi c where c.dang_chinh='T106000000' and c.loai_cau<>'dung_sai' and c.xoa_at is null
      and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau in (c.ma_cau, c.parent_ma_cau)) limit 1`)
  const e4 = await loi(() => q(`update dai_cau_hoi set da_duyet = true where ma_cau = $1`, [u.ma_cau]))
  kiem('câu thường chờ chưa gán vẫn bị chặn', !!e4, e4 ?? '')
} catch (e) { sai++; console.log('LỖI', e.message, e.where ?? '') }
await q('rollback'); await c.end()
console.log(`\n${ok} đạt · ${sai} sai (đã ROLLBACK)`)
