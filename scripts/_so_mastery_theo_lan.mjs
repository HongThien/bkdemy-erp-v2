// SO MASTERY CŨ (theo CÂU) vs MỚI (theo LẦN, cấp NHÓM chính + DẠNG phụ) — Thùy 10/11. CHỈ ĐỌC DB (temp table, rollback).
// Cũ = chép đúng _mastery_cells_core (5 câu gần nhất, MT3·ET2·khác1, Hình–Học 3). Mới = đổi đơn vị câu → lần, giữ phần còn lại:
//   lần = 1 bài làm (gami: phase+buổi · app: bai_lam · bổ trợ: tai_lieu), % lần = TB giá trị các câu của lần thuộc nút;
//   (Thùy chốt 10/11) bỏ tự luyện trừ cấp 1 · KHÔNG trọng số nguồn — mức = TB % của 5 lần gần nhất (Hình–Học 3); độ tin theo SỐ LẦN (5/3, Hình–Học 3/2); ngưỡng 80/50.
// 2 kịch bản: A = ET+MT (mặc định, màn xem) · B = mọi nguồn (đúng cái bổ trợ yếu đang dùng: include_btvn = true).
// Chạy: node scripts/_so_mastery_theo_lan.mjs  → reports/so-mastery-theo-lan.html
import pg from 'pg'
import fs from 'fs'

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const t0 = Date.now()
const log = (m) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s] ${m}`)

await c.query('begin')
await c.query("set local statement_timeout = '15min'")

// 1. HS Toán đang học
await c.query(`create temp table _hs on commit drop as
  select distinct on (h.id) h.id, h.ho_ten, h.khoi, l.ten_lop, (h.khoi in ('3','4','4T','5','5T')) as cap1
  from hoc_sinh h join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc'
  join lop l on l.id = hl.lop_id and l.mon = 'Toán' and l.trang_thai = 'dang_hoc'
  where h.trang_thai = 'dang_hoc' order by h.id, l.ten_lop`)
log(`HS: ${(await q('select count(*) n from _hs'))[0].n}`)

// 2. lượt đo thô — y hệt _mastery_lan_do_quy (CTE m), thêm KHOÁ LẦN
await c.query(`create temp table _m on commit drop as
  select g.hoc_sinh_id, sp.ma_dang, sp.ma_cau,
         case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
         coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
         sp.phase as src,
         sp.phase || ':' || coalesce(sp.buoi_hoc_id::text, 'd' || g.graded_at::date::text) as luot
  from gami_grades g
  join gami_session_problems sp on sp.id = g.problem_id
  left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
  where g.hoc_sinh_id in (select id from _hs) and sp.ma_dang is not null and sp.phase in ('et','mt','btvn')
  union all
  select bl.hoc_sinh_id, btc.ma_dang, btc.ma_cau,
         case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
         coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
         case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'bo_tro_test' then 'et'
              when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end,
         'bl:' || bl.id
  from bai_lam_cau blc
  join bai_lam bl on bl.id = blc.bai_lam_id
  join bai_test bt on bt.id = bl.bai_test_id
  join bai_test_cau btc on btc.id = blc.bai_test_cau_id
  left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
  where bl.hoc_sinh_id in (select id from _hs) and blc.verdict is not null and btc.ma_dang is not null
    and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
    and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen','thi_thu')
  union all
  select tl.hoc_sinh_id, btg.ma_dang, btg.ma_cau,
         case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
         btg.graded_at, 'bt', 'bt:' || tl.id
  from bt_grades btg join tai_lieu tl on tl.id = btg.tai_lieu_id
  where tl.hoc_sinh_id in (select id from _hs)`)
log(`lượt đo thô: ${(await q('select count(*) n from _m'))[0].n}`)

// 3. quy dạng (y hệt _mastery_lan_do: p_bdm = công tắc, khtn false) — 1 lần mỗi cặp câu–mã
await c.query(`create temp table _cap on commit drop as
  select d.kc, d.kd, public._do_o_quy(public._mastery_bdm_bat(), false, d.kc, d.kd) as dang
  from (select distinct coalesce(ma_cau,'') kc, coalesce(ma_dang,'') kd from _m) d`)
log(`cặp câu–mã: ${(await q('select count(*) n from _cap'))[0].n}`)

// 4. bảng đo cuối: dạng + nhóm (Hình–Học: nhóm = bài = dạng; Đại/HGT: dai_bdm_dang_bai.nhom_id)
await c.query(`create temp table _d on commit drop as
  select m.hoc_sinh_id, cp.dang, coalesce(hh.ma_bai, db.nhom_id) as nhom, (hh.ma_bai is not null) as hh,
         m.value, m.t, m.src, m.luot, case m.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
         (m.src in ('et','mt') or (h.cap1 and m.src = 'tu_luyen')) as in_a,
         (m.src <> 'tu_luyen' or h.cap1) as in_moi
  from _m m join _hs h on h.id = m.hoc_sinh_id
  join _cap cp on cp.kc = coalesce(m.ma_cau,'') and cp.kd = coalesce(m.ma_dang,'') and cp.dang is not null
  left join hinh_hoc_bai hh on hh.ma_bai = cp.dang
  left join dai_bdm_dang_bai db on db.id = cp.dang`)
const tong = (await q(`select count(*) n, count(*) filter (where nhom is null) khong_nhom,
  count(distinct dang) filter (where nhom is null) dang_khong_nhom from _d`))[0]
log(`lượt đo đã quy dạng: ${tong.n} · không quy được nhóm: ${tong.khong_nhom}`)
tong.khong_nhom_khoi = await q(`select h.khoi, left(d.dang, 3) tien_to, count(*)::int luot, count(distinct d.dang)::int dang
  from _d d join _hs h on h.id = d.hoc_sinh_id where d.nhom is null group by 1,2 order by 3 desc limit 15`)
// tự luyện: số lần / ô (tự luyện mỗi phiên = 1 lần — phình số lần)
tong.lan_theo_nguon = await q(`select src, count(distinct (hoc_sinh_id, luot))::int lan, count(*)::int cau from _d group by 1 order by 2 desc`)

// 5. mastery theo kịch bản. CU = theo câu (dạng). MOI_D = theo lần, dạng. MOI_N = theo lần, nhóm.
const muc = (s) => `case when ${s} >= 0.8 then 'dat' when ${s} >= 0.5 then 'can_luyen' else 'yeu' end`
for (const kb of ['a', 'b']) {
  const loc = kb === 'a' ? 'in_a' : 'true'
  await c.query(`create temp table _cu_${kb} on commit drop as
    with rk as (select *, row_number() over (partition by hoc_sinh_id, dang order by t desc, src, value desc) rn,
                       case when hh then 3 else 5 end cs, case when hh then 3 else 5 end tc, case when hh then 2 else 3 end tt
                from _d where ${loc})
    select hoc_sinh_id, dang, max(nhom) nhom,
           sum(value*w) filter (where rn<=cs) / nullif(sum(w) filter (where rn<=cs),0) score, count(*) n,
           case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end tin,
           extract(epoch from max(t) filter (where rn<=cs) - min(t) filter (where rn<=cs))/86400 span, max(t) t_cuoi
    from rk group by hoc_sinh_id, dang`)
  await c.query(`alter table _cu_${kb} add column muc text; update _cu_${kb} set muc = ${muc('score')}`)
  for (const [ten, k] of [['d', 'dang'], ['n', 'nhom']]) {
    await c.query(`create temp table _moi${ten}_${kb} on commit drop as
      with lan as (select hoc_sinh_id, ${k} k, luot, bool_or(hh) hh, avg(value) p, max(t) t, min(src) src, count(*) so_cau, sum(value) dung,
                          1 w  -- Thùy chốt 10/11: mọi lần ngang nhau, không trọng số nguồn
                   from _d where ${loc} and in_moi and ${k} is not null group by hoc_sinh_id, ${k}, luot),
      rk as (select *, row_number() over (partition by hoc_sinh_id, k order by t desc, src, p desc) rn,
                    case when hh then 3 else 5 end cs, case when hh then 3 else 5 end tc, case when hh then 2 else 3 end tt from lan)
      select hoc_sinh_id, k, sum(p*w) filter (where rn<=cs) / nullif(sum(w) filter (where rn<=cs),0) score, count(*) n,
             case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end tin,
             extract(epoch from max(t) filter (where rn<=cs) - min(t) filter (where rn<=cs))/86400 span, max(t) t_cuoi,
             sum(so_cau) filter (where rn<=cs) cau_trong_cs
      from rk group by hoc_sinh_id, k`)
    await c.query(`alter table _moi${ten}_${kb} add column muc text; update _moi${ten}_${kb} set muc = ${muc('score')}`)
  }
  log(`kịch bản ${kb.toUpperCase()} xong`)
}

// kiểm chép đúng: bản CŨ của script phải khớp fn_mastery_cells_bdm thật (mẫu 40 HS)
const kiem = (await q(`with s as (select id from _hs order by id limit 40),
  that as (select * from fn_mastery_cells_bdm(array(select id from s), true))
  select count(*) tong, count(*) filter (where abs(that.score - cu.score) < 1e-9 and that.n = cu.n) khop
  from that left join _cu_b cu on cu.hoc_sinh_id = that.hoc_sinh_id and cu.dang = that.ma_dang`))[0]
log(`kiểm chép: ${kiem.khop}/${kiem.tong} ô khớp fn_mastery_cells_bdm`)

const R = { tong, kiem, so_hs: (await q('select count(*) n from _hs'))[0].n, kb: {} }
const moc = (await q('select public._btyeu_moc_2_cua_so() d'))[0].d
R.moc = moc
for (const kb of ['a', 'b']) {
  const o = {}
  // dạng: cũ × mới
  o.dang_x = await q(`select cu.muc cu, md.muc moi, count(*)::int n from _cu_${kb} cu join _moid_${kb} md on md.hoc_sinh_id = cu.hoc_sinh_id and md.k = cu.dang group by 1,2`)
  o.dang_tin = await q(`select cu.tin cu, md.tin moi, count(*)::int n from _cu_${kb} cu join _moid_${kb} md on md.hoc_sinh_id = cu.hoc_sinh_id and md.k = cu.dang group by 1,2`)
  // nhóm mới × (nhóm có ≥1 dạng cũ yếu?)
  o.nhom_x = await q(`with cu as (select hoc_sinh_id, nhom, bool_or(muc='yeu') co_yeu, bool_or(muc='yeu' and tin<>'thap') co_yeu_tin from _cu_${kb} where nhom is not null group by 1,2)
    select mn.muc moi, cu.co_yeu, count(*)::int n from _moin_${kb} mn join cu on cu.hoc_sinh_id = mn.hoc_sinh_id and cu.nhom = mn.k group by 1,2`)
  o.dem = (await q(`select (select count(*) from _cu_${kb})::int o_dang, (select count(*) from _moin_${kb})::int o_nhom,
     (select count(*) from _cu_${kb} where muc='yeu')::int dang_yeu_cu, (select count(*) from _moid_${kb} where muc='yeu')::int dang_yeu_moi,
     (select count(*) from _moin_${kb} where muc='yeu')::int nhom_yeu_moi,
     (select count(*) from (select distinct hoc_sinh_id, nhom from _cu_${kb} where muc='yeu' and nhom is not null) x)::int nhom_co_dang_yeu_cu`))[0]
  // độ nhanh: khoảng ngày cửa sổ đang phủ (trung vị), chỉ ô đủ cửa sổ
  o.span = (await q(`select
     (select percentile_cont(0.5) within group (order by span) from _cu_${kb} where n >= 5) cu,
     (select percentile_cont(0.5) within group (order by span) from _moid_${kb} where n >= 5) moi_d,
     (select percentile_cont(0.5) within group (order by span) from _moin_${kb} where n >= 5) moi_n,
     (select percentile_cont(0.5) within group (order by n) from _cu_${kb}) n_cu,
     (select percentile_cont(0.5) within group (order by n) from _moid_${kb}) n_moi_d,
     (select percentile_cont(0.5) within group (order by n) from _moin_${kb}) n_moi_n,
     (select avg(cau_trong_cs) from _moin_${kb} where n >= 5) cau_cs_n`))[0]
  // theo khối
  o.khoi = await q(`select h.khoi,
     count(distinct h.id) filter (where cu.muc='yeu')::int hs_co_dang_yeu_cu,
     count(*) filter (where cu.muc='yeu')::int dang_yeu_cu,
     (select count(*) from _moin_${kb} mn join _hs h2 on h2.id = mn.hoc_sinh_id where h2.khoi = h.khoi and mn.muc='yeu')::int nhom_yeu_moi,
     (select count(distinct mn.hoc_sinh_id) from _moin_${kb} mn join _hs h2 on h2.id = mn.hoc_sinh_id where h2.khoi = h.khoi and mn.muc='yeu')::int hs_co_nhom_yeu_moi
     from _hs h left join _cu_${kb} cu on cu.hoc_sinh_id = h.id group by h.khoi order by h.khoi`)
  R.kb[kb] = o
}
// bổ trợ (kịch bản B = đúng nguồn bổ trợ dùng): yếu + có đo từ mốc 2 cửa sổ
R.botro = (await q(`select
   (select count(*) from _cu_b where muc='yeu' and t_cuoi >= ($1::date::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int muc_cu,
   (select count(distinct hoc_sinh_id) from _cu_b where muc='yeu' and t_cuoi >= ($1::date::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int hs_cu,
   (select count(*) from _moin_b where muc='yeu' and t_cuoi >= ($1::date::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int muc_moi,
   (select count(distinct hoc_sinh_id) from _moin_b where muc='yeu' and t_cuoi >= ($1::date::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int hs_moi,
   (select count(*) from (select distinct hoc_sinh_id from _cu_b where muc='yeu' and t_cuoi >= ($1::date::timestamp at time zone 'Asia/Ho_Chi_Minh')
      intersect select distinct hoc_sinh_id from _moin_b where muc='yeu' and t_cuoi >= ($1::date::timestamp at time zone 'Asia/Ho_Chi_Minh')) x)::int hs_ca_hai,
   (select count(*) from bo_tro_yeu where trang_thai='dang_xu' and mon='Toán')::int case_dang_xu`, [moc]))[0]

// mẫu: ô dạng đổi mức mạnh (yếu ↔ đạt), kịch bản B, kèm chuỗi lần
const mau = async (cu, moi, lim) => q(`select h.ho_ten, h.ten_lop, cu.dang, coalesce(db.ten, hb.ten_bai, cu.dang) ten_dang, nh.ten ten_nhom,
    round(cu.score*100) p_cu, cu.n n_cu, round(md.score*100) p_moi, md.n n_lan,
    (select json_agg(x order by x.t desc) from (select (max(t) at time zone 'Asia/Ho_Chi_Minh')::date t, min(src) src, sum(value) dung, count(*) tong
       from _d where hoc_sinh_id = cu.hoc_sinh_id and dang = cu.dang and in_moi group by luot order by max(t) desc limit 6) x) lan
  from _cu_b cu join _moid_b md on md.hoc_sinh_id = cu.hoc_sinh_id and md.k = cu.dang
  join _hs h on h.id = cu.hoc_sinh_id
  left join dai_bdm_dang_bai db on db.id = cu.dang left join dai_bdm_nhom nh on nh.id = db.nhom_id
  left join hinh_hoc_bai hb on hb.ma_bai = cu.dang
  where cu.muc = $1 and md.muc = $2 and md.n >= 3
  order by abs(cu.score - md.score) desc, h.ho_ten limit ${lim}`, [cu, moi])
R.mau_yeu_dat = await mau('yeu', 'dat', 8)
R.mau_dat_yeu = await mau('dat', 'yeu', 8)
// mẫu nhóm: nhóm mới yếu nhưng không dạng cũ nào yếu, và ngược lại
R.mau_nhom = await q(`with cu as (select hoc_sinh_id, nhom, bool_or(muc='yeu') co_yeu, string_agg(dang || ' ' || round(score*100) || '%' || '·' || muc, ', ') ds from _cu_b where nhom is not null group by 1,2)
  select h.ho_ten, h.ten_lop, coalesce(nh.ten, hb.ten_bai, mn.k) ten_nhom, round(mn.score*100) p_moi, mn.n n_lan, mn.muc, cu.co_yeu, cu.ds
  from _moin_b mn join cu on cu.hoc_sinh_id = mn.hoc_sinh_id and cu.nhom = mn.k join _hs h on h.id = mn.hoc_sinh_id
  left join dai_bdm_nhom nh on nh.id = mn.k left join hinh_hoc_bai hb on hb.ma_bai = mn.k
  where mn.n >= 3 and ((mn.muc='yeu' and not cu.co_yeu) or (mn.muc='dat' and cu.co_yeu))
  order by (mn.muc='yeu') desc, random() limit 12`)
await c.query('rollback')
await c.end()
log('xong truy vấn')
fs.writeFileSync('reports/_so-mastery-theo-lan.json', JSON.stringify(R, null, 1))
console.log(JSON.stringify(R, null, 1).slice(0, 6000))
