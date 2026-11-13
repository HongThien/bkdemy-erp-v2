// Sinh migration "Dashboard học tập cho mọi môn" (Thùy 13/11) TỪ DB ĐANG CHẠY.
// Toán giữ nguyên engine + cache cũ (mastery_luu_san) từng chữ. Môn MỘT VÙNG đo theo bản đồ mới (KHTN · Vật lý · Hóa học — bảng <mon>_bdm_*)
// có engine + cache RIÊNG theo môn (mastery_luu_san_mon), làm mới CÙNG nhịp/cùng sổ "em bẩn" với cache Toán.
// Chạy: node scripts/_gen_mig_dbht_moi_mon.mjs <file.sql>   (chỉ ĐỌC DB)
import pg from 'pg'
import fs from 'fs'

const out = process.argv[2]
if (!out) { console.error('thiếu file ra'); process.exit(1) }
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('='))
  .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL_RO || env.DATABASE_URL })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const ep = (s, a, b) => { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 120)); return s.replace(a, b) }
const ham = async (ten) => {
  const r = await q(`select pg_get_userbyid(proowner) o, pg_get_functiondef(oid) d from pg_proc where proname = $1`, [ten])
  if (r.length !== 1) throw new Error(ten + ': ' + r.length + ' bản')
  if (r[0].o !== 'claude_build') throw new Error(ten + ': owner ' + r[0].o)
  return r[0].d.replace(/\r\n/g, '\n')
}
// môn một vùng = các môn có bản đồ mới trong registry phiên (co_vung = false) — KHTN · Vật lý · Hóa học
const MON1 = ['KHTN', 'Vật lý', 'Hóa học']
for (const m of MON1) { const [r] = await q(`select bang, co_vung from _phien_bdm_bang($1)`, [m]); if (!r || r.co_vung) throw new Error('registry: ' + m) }
const BANG = (await q(`select mon, bang from (select unnest($1::text[]) mon) x, lateral _phien_bdm_bang(x.mon)`, [MON1]))

const L = [`-- ============================================================================
-- DASHBOARD HỌC TẬP CHO MỌI MÔN (Thùy 13/11: "Dashboard học tập cần làm cho tất cả các môn")
-- SINH TỰ ĐỘNG bởi scripts/_gen_mig_dbht_moi_mon.mjs từ DB đang chạy — đừng sửa tay.
-- ----------------------------------------------------------------------------
-- VÌ SAO: fn_dbht_bang chỉ lấy ô khi _kho_ban_do_tbl(môn) = 'dai_ban_do' (Toán); engine mastery theo lần (_mastery_lan_d) chỉ quy
--   lượt đo về dạng bài/nhóm của bản đồ Toán ⇒ KHTN (6.621 lần đo/30 ngày, 55 em) ra bảng trống. Tính thẳng KHTN khối 9 = ~3 s
--   (> trần 1–2 s, §2.0) ⇒ phải có bản lưu sẵn.
--   (1) Engine môn MỘT VÙNG (KHTN · Vật lý · Hóa học): _mastery_mon_d / _mastery_mon_cap — CÙNG luật _mastery_lan_cap (30 ngày,
--       ≤5 lần gần nhất, ngưỡng 80/50, độ tin 5/3), quy lượt đo qua _mastery_luot_do_quy(cờ một-vùng = true) rồi về cây
--       bản đồ mới của đúng môn (tl_bdm_dang_bai_v / tl_bdm_nhom_v có cột mon). Mã ô tự mang môn (KDB/LDB/QDB…).
--   (2) Cache mastery_luu_san_mon (thêm cột mon) — fn_mastery_lam_moi tính luôn cho em có lớp môn một vùng trong CÙNG lượt,
--       cùng sổ em bẩn (mastery_ban_log / mastery_luu_san_tinh). Trigger em bẩn gắn thêm vào bảng gán/đề xuất/dạng bài của 3 môn.
--   (3) fn_dbht_bang + fn_dbht_o_lich_su: Toán đi đường cũ (y nguyên), môn một vùng đọc cache môn; tên cột lấy từ cây đúng môn.
--   (4) Đánh dấu bẩn em có lớp môn một vùng ⇒ cron chụp ngay lượt sau; chưa chụp thì hàm đọc tính thẳng (chậm tạm thời).
--   Toán: KHÔNG đổi engine, KHÔNG đổi cache, KHÔNG đổi số (so cũ–mới khớp từng dòng trước khi áp).
-- MẤT GÌ (Luật xoá): không mất gì — thêm 1 bảng, 4 hàm, trigger; create or replace 4 hàm (giữ chữ ký, ACL).
-- ============================================================================
set local check_function_bodies = off;

create table public.mastery_luu_san_mon (
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  mon text not null,
  btvn boolean not null,
  cap text not null,
  nut text not null,
  score numeric not null,
  n integer not null,
  muc text not null,
  tin text not null,
  primary key (hoc_sinh_id, mon, btvn, cap, nut)
);
alter table public.mastery_luu_san_mon enable row level security;   -- như mastery_luu_san: chỉ đọc/ghi qua hàm security definer
create index mastery_luu_san_mon_nut_idx on public.mastery_luu_san_mon (cap, nut);

-- (1) môn một vùng đo theo bản đồ mới — 1 registry
create or replace function public._mastery_mon_ds()
 returns text[] language sql immutable
as $function$ select array[${MON1.map((m) => `'${m}'`).join(', ')}] $function$;

-- lượt đo → dạng bài / nhóm / chuyên đề / chủ đề của ĐÚNG môn (cùng luật bỏ tự luyện trừ cấp 1 như _mastery_lan_d)
create or replace function public._mastery_mon_d(p_hs uuid[], p_include_btvn boolean, p_since timestamptz, p_den timestamptz)
 returns table(hoc_sinh_id uuid, mon text, luot text, value numeric, t timestamptz, src text, dang text, nhom text, chuyen_de text, chu_de text)
 language sql stable
 set search_path to 'public'
as $function$
  select l.hoc_sinh_id, d.mon, l.luot, l.value, l.t, l.src, l.ma_dang, d.nhom_id, n.chuyen_de_id, n.chu_de_id
    from public._mastery_luot_do_quy(public._mastery_bdm_bat(), true, p_hs, p_include_btvn, p_since, p_den) l
    join tl_bdm_dang_bai_v d on d.id = l.ma_dang and d.mon = any(public._mastery_mon_ds())
    join tl_bdm_nhom_v n on n.id = d.nhom_id and n.mon = d.mon
   where l.src <> 'tu_luyen' or l.cap1
$function$;

-- CÙNG luật _mastery_lan_cap (Toán), thêm chiều môn
create or replace function public._mastery_mon_cap(p_hs uuid[], p_include_btvn boolean, p_since timestamptz, p_den timestamptz,
                                                   p_caps text[], p_window integer, p_tin_cao integer, p_tin_tb integer)
 returns table(hoc_sinh_id uuid, mon text, cap text, nut text, score numeric, n bigint, muc text, tin text)
 language sql stable rows 5000
 set search_path to 'public'
as $function$
  with d as materialized (
    select * from public._mastery_mon_d(p_hs, p_include_btvn, greatest(p_since, coalesce(p_den, now()) - interval '30 days'), p_den)
  ),
  lan as (
    select hoc_sinh_id, mon, 'dang'::text as cap, dang as nut, luot, avg(value) as p, max(t) as t from d where 'dang' = any(p_caps) group by 1, 2, 4, 5
    union all
    select hoc_sinh_id, mon, 'nhom', nhom, luot, avg(value), max(t) from d where 'nhom' = any(p_caps) and nhom is not null group by 1, 2, 4, 5
    union all
    select hoc_sinh_id, mon, 'chuyen_de', chuyen_de, luot, avg(value), max(t) from d where 'chuyen_de' = any(p_caps) and chuyen_de is not null group by 1, 2, 4, 5
    union all
    select hoc_sinh_id, mon, 'chu_de', chu_de, luot, avg(value), max(t) from d where 'chu_de' = any(p_caps) and chu_de is not null group by 1, 2, 4, 5
  ),
  rk as (select lan.*, row_number() over (partition by hoc_sinh_id, mon, cap, nut order by t desc, luot desc) as rn from lan)
  select hoc_sinh_id, mon, cap, nut,
         avg(p) filter (where rn <= p_window) as score,
         count(*) as n,
         case when avg(p) filter (where rn <= p_window) >= 0.8 then 'dat'
              when avg(p) filter (where rn <= p_window) >= 0.5 then 'can_luyen' else 'yeu' end,
         case when count(*) >= p_tin_cao then 'cao' when count(*) >= p_tin_tb then 'tb' else 'thap' end
    from rk group by hoc_sinh_id, mon, cap, nut
$function$;

-- đọc nhanh: em đã chụp & không bẩn ⇒ bản lưu; còn lại tính thẳng (như _mastery_lan_cap_nhanh của Toán)
create or replace function public._mastery_mon_doc(p_mon text, p_hs uuid[], p_include_btvn boolean, p_caps text[])
 returns table(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
 language plpgsql stable security definer rows 5000
 set search_path to 'public'
as $function$
declare v_sach uuid[]; v_con uuid[];
begin
  if not (p_mon = any(public._mastery_mon_ds())) then return; end if;
  v_sach := public._mastery_hs_sach(p_hs);
  if cardinality(v_sach) > 0 then
    return query select s.hoc_sinh_id, s.cap, s.nut, s.score, s.n::bigint, s.muc, s.tin from mastery_luu_san_mon s
                  where s.hoc_sinh_id = any(v_sach) and s.mon = p_mon and s.btvn = coalesce(p_include_btvn, false) and s.cap = any(p_caps);
  end if;
  v_con := array(select unnest(p_hs) except select unnest(v_sach));
  if cardinality(v_con) > 0 then
    return query select m.hoc_sinh_id, m.cap, m.nut, m.score, m.n, m.muc, m.tin
                   from public._mastery_mon_cap(v_con, p_include_btvn, null, null, p_caps, 5, 5, 3) m
                  where m.mon = p_mon and m.score is not null;
  end if;
end $function$;
revoke all on function public._mastery_mon_ds() from public, anon;
revoke all on function public._mastery_mon_d(uuid[], boolean, timestamptz, timestamptz) from public, anon;
revoke all on function public._mastery_mon_cap(uuid[], boolean, timestamptz, timestamptz, text[], integer, integer, integer) from public, anon;
revoke all on function public._mastery_mon_doc(text, uuid[], boolean, text[]) from public, anon;
grant execute on function public._mastery_mon_ds() to authenticated;
grant execute on function public._mastery_mon_d(uuid[], boolean, timestamptz, timestamptz) to authenticated;
grant execute on function public._mastery_mon_cap(uuid[], boolean, timestamptz, timestamptz, text[], integer, integer, integer) to authenticated;
grant execute on function public._mastery_mon_doc(text, uuid[], boolean, text[]) to authenticated;
`]

// (2) làm mới: cùng lượt, chỉ em có lớp môn một vùng (đang học)
let lm = await ham('fn_mastery_lam_moi')
lm = ep(lm, "    insert into mastery_luu_san_tinh (hoc_sinh_id, tinh_at, moc) select unnest(v_lo), now(), v_moc",
  `    -- 13/11: cache môn MỘT VÙNG (KHTN · Vật lý · Hóa học) cùng lượt, cùng sổ em bẩn — chỉ em có lớp môn đó đang học
    delete from mastery_luu_san_mon where hoc_sinh_id = any(v_lo);
    insert into mastery_luu_san_mon (hoc_sinh_id, mon, btvn, cap, nut, score, n, muc, tin)
    select m.hoc_sinh_id, m.mon, b.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin
      from (values (false), (true)) b(btvn)
      cross join lateral public._mastery_mon_cap(
        array(select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
               where hl.hoc_sinh_id = any(v_lo) and hl.trang_thai = 'dang_hoc' and l.mon = any(public._mastery_mon_ds())),
        b.btvn, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m
     where m.score is not null;
    insert into mastery_luu_san_tinh (hoc_sinh_id, tinh_at, moc) select unnest(v_lo), now(), v_moc`)
L.push('-- (2) fn_mastery_lam_moi: thêm cache môn một vùng (phần Toán y nguyên)', lm + ';')

// trigger em bẩn: bảng gán / đề xuất / dạng bài của 3 môn
let tg = await ham('_mastery_ban_tg')
const ganDx = BANG.flatMap((b) => [`'${b.bang}gan_cau'`, `'${b.bang}de_xuat'`])
tg = ep(tg, "elsif TG_TABLE_NAME in ('dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat') then",
  `elsif TG_TABLE_NAME in ('dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat', ${ganDx.join(', ')}) then`)
tg = ep(tg, "  elsif TG_TABLE_NAME = 'he_thong_cong_tac' then",
  `  elsif TG_TABLE_NAME in (${BANG.map((b) => `'${b.bang}dang_bai'`).join(', ')}) then   -- 13/11: dạng bài môn một vùng đổi nhóm / bị xoá
    if TG_OP = 'UPDATE' then
      v := array(select distinct s.hoc_sinh_id from moi join cu on cu.id = moi.id join mastery_luu_san_mon s on s.cap = 'dang' and s.nut = moi.id
                 where moi.nhom_id is distinct from cu.nhom_id);
    else v := array(select distinct s.hoc_sinh_id from cu join mastery_luu_san_mon s on s.cap = 'dang' and s.nut = cu.id); end if;
  elsif TG_TABLE_NAME = 'he_thong_cong_tac' then`)
L.push('-- _mastery_ban_tg: thêm bảng của 3 môn một vùng', tg + ';')
for (const b of BANG) {
  for (const t of ['gan_cau', 'de_xuat']) {
    const ten = b.bang + t
    L.push(`create trigger trg_mastery_ban_ins after insert on public.${ten} referencing new table as moi for each statement execute function _mastery_ban_tg();`,
      `create trigger trg_mastery_ban_upd after update on public.${ten} referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();`,
      `create trigger trg_mastery_ban_del after delete on public.${ten} referencing old table as cu for each statement execute function _mastery_ban_tg();`)
  }
  L.push(`create trigger trg_mastery_ban_upd after update on public.${b.bang}dang_bai referencing old table as cu new table as moi for each statement execute function _mastery_ban_tg();`,
    `create trigger trg_mastery_ban_del after delete on public.${b.bang}dang_bai referencing old table as cu for each statement execute function _mastery_ban_tg();`)
}

// (3) dashboard
let bg = await ham('fn_dbht_bang')
bg = ep(bg, "     where public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' and x.score is not null\n  ),",
  `     where public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' and x.score is not null
    union all   -- 13/11: môn một vùng (KHTN · Vật lý · Hóa học) — cache theo môn
    select x.* from public._mastery_mon_doc(p_mon, (select array_agg(hoc_sinh_id) from hs), true, array[(select c from ca), 'nhom']) x
     where x.score is not null
  ),`)
bg = ep(bg, "when p_cap = 'nhom' then nb.ten when p_cap = 'chu_de' then cd.ten else ch.ten end, cot.cot) as ten,",
  "when p_cap = 'nhom' then nb.ten when p_cap = 'chu_de' then cd.ten else ch.ten end,\n                    case when p_cap = 'nhom' then vn.ten when p_cap = 'chu_de' then vcd.ten else vch.ten end, cot.cot) as ten,")
bg = ep(bg, "case when p_cap = 'nhom' then coalesce(ch.ten, cd.ten) when hb.ma_bai is not null and p_cap <> 'chu_de' then cd.ten end as cha,",
  "coalesce(case when p_cap = 'nhom' then coalesce(ch.ten, cd.ten) when hb.ma_bai is not null and p_cap <> 'chu_de' then cd.ten end,\n                    case when p_cap = 'nhom' then coalesce(vch.ten, vcd.ten) end) as cha,")
bg = ep(bg, "coalesce(cd.thu_tu, 0) as t1, coalesce(bo.thu_tu, 0) as t2, coalesce(nb.thu_tu, hb.thu_tu, 0) as t3",
  "coalesce(cd.thu_tu, vcd.thu_tu, 0) as t1, coalesce(bo.thu_tu, vo.thu_tu, 0) as t2, coalesce(nb.thu_tu, hb.thu_tu, vn.thu_tu, 0) as t3")
bg = ep(bg, "      left join dai_bdm_chu_de cd on cd.id = coalesce(case when p_cap = 'chu_de' then cot.cot end, hb.chu_de_id, nb.chu_de_id, bo.chu_de_id)\n",
  `      left join dai_bdm_chu_de cd on cd.id = coalesce(case when p_cap = 'chu_de' then cot.cot end, hb.chu_de_id, nb.chu_de_id, bo.chu_de_id)
      -- 13/11: môn một vùng — tên/thứ tự từ cây bản đồ mới của ĐÚNG môn (view có cột mon)
      left join tl_bdm_nhom_v vn on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and p_cap = 'nhom' and vn.mon = p_mon and vn.id = cot.cot
      left join tl_bdm_chuyen_de_v vch on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and vch.mon = p_mon
                                       and vch.id = case when p_cap = 'nhom' then vn.chuyen_de_id when p_cap = 'chuyen_de' then cot.cot end
      left join lateral (select o3.chu_de_id, o3.thu_tu from tl_bdm_o_v o3 join tl_bdm_chu_de_v c3 on c3.id = o3.chu_de_id and c3.mon = p_mon
                          where o3.mon = p_mon and vch.id is not null and o3.chuyen_de_id = vch.id and (vn.id is null or o3.chu_de_id = vn.chu_de_id)
                          order by c3.thu_tu limit 1) vo on true
      left join tl_bdm_chu_de_v vcd on public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' and vcd.mon = p_mon
                                    and vcd.id = coalesce(case when p_cap = 'chu_de' then cot.cot end, vn.chu_de_id, vo.chu_de_id)
`)
bg = ep(bg, "'tinh_at', (select max(t.tinh_at) from mastery_luu_san_tinh t where t.hoc_sinh_id in (select hoc_sinh_id from hs)),",
  "'tinh_at', (select max(t.tinh_at) from mastery_luu_san_tinh t where t.hoc_sinh_id in (select hoc_sinh_id from hs)),\n    'co_do', (public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' or p_mon = any(public._mastery_mon_ds())),   -- 13/11: môn đã đo theo bản đồ mới chưa")
L.push('-- (3) fn_dbht_bang: môn một vùng đọc cache môn, tên cột theo cây đúng môn (phần Toán y nguyên)', bg + ';')

let ls = await ham('fn_dbht_o_lich_su')
ls = ep(ls, "  with d as (\n    select x.* from public._mastery_lan_d(public._mastery_bdm_bat(), array[p_hs], true, null, null) x\n     where case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma\n  ),",
  `  with d as (
    select x.* from public._mastery_lan_d(public._mastery_bdm_bat(), array[p_hs], true, null, null) x
     where case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma
       and public._kho_ban_do_tbl(p_mon) = 'dai_ban_do'
    union all   -- 13/11: môn một vùng
    select x.hoc_sinh_id, x.luot, x.value, x.t, x.src, x.dang, x.nhom, x.chuyen_de, x.chu_de, false
      from public._mastery_mon_d(array[p_hs], true, null, null) x
     where x.mon = p_mon and case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma
  ),`)
ls = ep(ls, "coalesce(public._kho_ten_dang(p_mon, w.dang), w.dang)",
  "coalesce(public._kho_ten_dang(p_mon, w.dang), case when public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' then (select v.ten from tl_bdm_dang_bai_v v where v.id = w.dang and v.mon = p_mon) end, w.dang)")
L.push('-- (3) fn_dbht_o_lich_su: thêm đường môn một vùng (phần Toán y nguyên)', ls + ';')

// (4) đánh dấu bẩn em có lớp môn một vùng ⇒ cron chụp lượt sau
L.push(`-- (4) em có lớp môn một vùng: đánh dấu bẩn để cron chụp cache môn ngay lượt sau
insert into mastery_ban_log (hoc_sinh_id)
select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
 where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = any(public._mastery_mon_ds());`)

fs.writeFileSync(out, L.join('\n') + '\n')
await c.end()
console.log('OK ->', out, L.length, 'khối')
