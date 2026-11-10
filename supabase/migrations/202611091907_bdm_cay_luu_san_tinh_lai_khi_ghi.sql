-- ============================================================================
-- 202611091907 — bdm_cay_luu_san_tinh_lai_khi_ghi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 09/11 — "mỗi khi có cái gì đấy đẩy vào DB thì mới cập nhật. Còn lại mặc định dùng số cũ, không cần quét" · "Làm đi".
--   fn_bdm_cay (cây bản đồ Toán + mọi con số) tính lại TỪ ĐẦU mỗi lần mở bản đồ (suy dạng bài cho mọi câu của khối rồi đếm) ⇒
--   lúc DB bận vượt trần 8 s (mig 202611091800 đã giảm ~6,5×, vẫn là tính lại mỗi lần).
--   Giờ: cây đã tính LƯU SẴN theo (khối, nhánh) trong dai_bdm_cay_nho kèm "phiên bản dữ liệu" lúc tính. Phiên bản = sequence
--   dai_bdm_cay_ban_seq, chỉ tăng khi có dòng được GHI vào các bảng làm đổi cây/đếm (trigger ràng buộc HOÃN tới lúc COMMIT ⇒
--   nhập 1.000 câu một transaction chỉ là 1.000 lần nextval, không tính cây lần nào). Mở bản đồ: phiên bản khớp ⇒ trả cây đã lưu
--   (không đụng kho câu); lệch ⇒ tính lại MỘT lần, lưu. An toàn thêm: bản lưu quá 1 ngày tự tính lại.
--   Cột câu chỉ tính khi đổi cột ảnh hưởng đếm (dạng/cụm/gốc/xoá/loại) — sửa lời giải, duyệt… KHÔNG làm cây phải tính lại.
--   Thân tính cây chuyển nguyên văn sang _bdm_cay_tinh; đầu ra GIỮ Y HỆT (so md5 13 khối trong transaction ROLLBACK).
-- MẤT GÌ (Luật xoá): Không. Bảng nhớ mới (dữ liệu suy ra, tính lại được bất cứ lúc nào). fn_bdm_cay đổi STABLE→VOLATILE (cần ghi bảng nhớ),
--   cùng chữ ký / quyền; chỉ client gọi (supabase.rpc POST), không hàm DB nào gọi.
-- ============================================================================

create sequence public.dai_bdm_cay_ban_seq;
select setval('public.dai_bdm_cay_ban_seq', 1, true);   -- is_called=true ngay ⇒ nextval đầu tiên đã đổi last_value

create table public.dai_bdm_cay_nho (
  khoi    text not null,
  nhanh   text not null default '',        -- '' = p_nhanh null (cả môn)
  ban     bigint not null,                 -- dai_bdm_cay_ban_seq.last_value lúc tính
  tinh_at timestamptz not null default now(),
  cay     jsonb not null,
  primary key (khoi, nhanh)
);
alter table public.dai_bdm_cay_nho enable row level security;   -- chỉ đọc/ghi qua fn_bdm_cay (security definer)
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'claude_ro') then
    execute 'create policy claude_ro_select on public.dai_bdm_cay_nho for select to claude_ro using (true)';
  end if;
end $$;

create or replace function public._trg_bdm_cay_ban() returns trigger language plpgsql security definer set search_path to 'public' as $f$
begin perform nextval('public.dai_bdm_cay_ban_seq'); return null; end $f$;
revoke execute on function public._trg_bdm_cay_ban() from public, anon;

create constraint trigger trg_bdm_cay_ban after insert or delete or update of dang_chinh, ma_cum, parent_ma_cau, xoa_at, loai_cau on public.dai_cau_hoi
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update of ma_cau, parent_ma_cau, xoa_at, loai_cau on public.hgt_cau_hoi
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_gan_cau
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.hgt_bdm_gan_cau
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_doi_ung
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_doi_ung_cum
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_kho_ds
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.hgt_bdm_kho_ds
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_ban_do
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_chu_de
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_o
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_chuyen_de
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_nhom
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_nhom_tien_de
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();
create constraint trigger trg_bdm_cay_ban after insert or delete or update on public.dai_bdm_dang_bai
  deferrable initially deferred for each row execute function public._trg_bdm_cay_ban();

-- Thân tính cây cũ — NGUYÊN VĂN (chỉ đổi tên)
create or replace function public._bdm_cay_tinh(p_khoi text, p_nhanh text default null::text)
 returns jsonb
 language sql
 stable
 set search_path to 'public'
as $function$
  with dc as materialized (
    select coalesce(array_agg(b.ma_dang), '{}') as ds from dai_ban_do b where b.khoi = p_khoi
  ),
  cg as materialized (
    select * from _bdm_cau_giai((select array(select unnest(ds) union select unnest(_bdm_dang_cu_cua_khoi(p_khoi))) from dc))
  ),
  du as materialized (
    select d.*, b.ten_dang from dai_bdm_doi_ung d join dai_ban_do b on b.ma_dang = d.ma_dang_cu
  ),
  -- bảng tra đếm (1 lần cho cả khối)
  dem_db as materialized (
    select x.dang_bai_id, count(*) as n from (
      select cg.dang_bai_id from cg where cg.dang_bai_id is not null
      union all   -- kho HGT (mig 202610181900): câu gốc đã gán + bản sao đi theo gốc
      select g.dang_bai_id from hgt_bdm_gan_cau g join hgt_cau_hoi h on h.ma_cau = g.ma_cau and h.xoa_at is null and h.loai_cau <> 'dung_sai'
      union all
      select g.dang_bai_id from hgt_bdm_gan_cau g join hgt_cau_hoi h on h.parent_ma_cau = g.ma_cau and h.xoa_at is null and h.loai_cau <> 'dung_sai'
    ) x group by 1),
  cg0 as materialized (select cg.ma_dang_cu, count(*) as n from cg where cg.dang_bai_id is null group by 1),
  dem_nhom as materialized (
    select du.dich_nhom, sum(cg0.n)::bigint as n from du join cg0 on cg0.ma_dang_cu = du.ma_dang_cu
     where du.dich_nhom is not null group by 1),
  dem_o as materialized (
    select du.dich_chu_de, du.dich_chuyen_de, sum(cg0.n)::bigint as n from du join cg0 on cg0.ma_dang_cu = du.ma_dang_cu
     where du.dich_chu_de is not null group by 1, 2),
  cu_db as materialized (
    select du.dich_dang_bai as k, jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu) as ds
      from du where du.dich_dang_bai is not null group by 1),
  cu_nhom as materialized (
    select du.dich_nhom as k, jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu) as ds
      from du where du.dich_nhom is not null group by 1),
  cu_o as materialized (
    select du.dich_chu_de as cd, du.dich_chuyen_de as ch, jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu) as ds
      from du where du.dich_chu_de is not null group by 1, 2),
  so_cd as materialized (select o.chuyen_de_id, count(*) as n from dai_bdm_o o group by 1),
  td as materialized (select e.nhom_id, jsonb_agg(e.tien_de_nhom_id order by e.tien_de_nhom_id) as ds from dai_bdm_nhom_tien_de e group by 1),
  chua_gan_khoi as materialized (
    select not exists (select 1 from dai_bdm_doi_ung d where d.ma_dang_cu = b.ma_dang) as chua_gan, b.ma_dang
      from dai_ban_do b where b.khoi = p_khoi)
  select jsonb_build_object(
    'chu_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu, 'nhanh', cd.nhanh,
        'so_ds', (select count(*) from dai_bdm_kho_ds k join dai_cau_hoi q on q.ma_cau = k.ma_cau and q.xoa_at is null where k.chu_de_id = cd.id)
               + (select count(*) from hgt_bdm_kho_ds k join hgt_cau_hoi q on q.ma_cau = k.ma_cau and q.xoa_at is null where k.chu_de_id = cd.id),
        'o', coalesce((
          select jsonb_agg(jsonb_build_object(
            'chuyen_de_id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta, 'thu_tu', o.thu_tu, 'so', o.so,
            'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
            'cung_co_o', coalesce((
              select jsonb_agg(jsonb_build_object('chu_de_id', c2.id, 'ten', c2.ten, 'khoi', c2.khoi) order by c2.khoi, c2.thu_tu)
                from dai_bdm_o o3 join dai_bdm_chu_de c2 on c2.id = o3.chu_de_id
               where o3.chuyen_de_id = ch.id and o3.chu_de_id <> cd.id), '[]'::jsonb),
            'dang_cu', coalesce((select ds from cu_o where cu_o.cd = cd.id and cu_o.ch = ch.id), '[]'::jsonb),
            'chua_gan', coalesce((select n from dem_o where dem_o.dich_chu_de = cd.id and dem_o.dich_chuyen_de = ch.id), 0),
            'nhom', coalesce((
              select jsonb_agg(jsonb_build_object(
                'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'thu_tu', n.thu_tu, 'so', s.so, 'tang', s.tang,
                'co_ly_thuyet', (btrim(n.ly_thuyet) <> '' or n.ly_thuyet_file_url is not null),
                'tien_de', coalesce((select ds from td where td.nhom_id = n.id), '[]'::jsonb),
                'dang_cu', coalesce((select ds from cu_nhom where cu_nhom.k = n.id), '[]'::jsonb),
                'chua_gan', coalesce((select dn.n from dem_nhom dn where dn.dich_nhom = n.id), 0),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu, 'so', d.so,
                    'co_ly_thuyet', (btrim(d.ly_thuyet) <> '' or d.ly_thuyet_file_url is not null),
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null),
                    'so_cau', coalesce((select dd.n from dem_db dd where dd.dang_bai_id = d.id), 0),
                    'dang_cu', coalesce((select ds from cu_db where cu_db.k = d.id), '[]'::jsonb)
                  ) order by d.so)
                  from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) so
                          from dai_bdm_dang_bai d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
              ) order by s.so)
              from dai_bdm_nhom n join _bdm_so_nhom(cd.id, ch.id) s on s.id = n.id), '[]'::jsonb)
          ) order by o.so)
          from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) so
                  from dai_bdm_o o0 where o0.chu_de_id = cd.id) o
          join dai_bdm_chuyen_de ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
      ) order by cd.thu_tu, cd.id)
      from dai_bdm_chu_de cd where cd.khoi = p_khoi and (p_nhanh is null or cd.nhanh = p_nhanh)), '[]'::jsonb),
    'chuyen_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'ten', ch.ten,
        'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb)
                   from dai_bdm_o o join dai_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from dai_bdm_chuyen_de ch), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((
      select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from dai_bdm_chu_de where p_nhanh is null or nhanh = p_nhanh group by khoi) x), '{}'::jsonb),
    'tong', jsonb_build_object(
      'dang_cu', (select cardinality(ds) from dc),
      'dang_cu_chua_gan', (select count(*) from chua_gan_khoi where chua_gan),
      'cau_dang_cu_chua_gan', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu where k.chua_gan),
      'cau', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu),
      'cau_chua_gan', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu where cg.dang_bai_id is null)
    )
  )
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$;
revoke execute on function public._bdm_cay_tinh(text, text) from public, anon, authenticated;

create or replace function public.fn_bdm_cay(p_khoi text, p_nhanh text default null::text)
 returns jsonb
 language plpgsql
 volatile security definer
 set search_path to 'public'
as $function$
declare v_ban bigint; v jsonb; v_n text := coalesce(p_nhanh, '');
begin
  if not public.la_thanh_vien() then return null; end if;
  select last_value into v_ban from public.dai_bdm_cay_ban_seq;   -- đọc phiên bản TRƯỚC khi tính
  select k.cay into v from dai_bdm_cay_nho k
   where k.khoi = p_khoi and k.nhanh = v_n and k.ban = v_ban and k.tinh_at > now() - interval '1 day';
  if v is not null then return v; end if;
  v := _bdm_cay_tinh(p_khoi, p_nhanh);
  if v is not null then
    insert into dai_bdm_cay_nho (khoi, nhanh, ban, cay) values (p_khoi, v_n, v_ban, v)
    on conflict (khoi, nhanh) do update set ban = excluded.ban, cay = excluded.cay, tinh_at = now();
  end if;
  return v;
end $function$;
revoke execute on function public.fn_bdm_cay(text, text) from public, anon;
grant execute on function public.fn_bdm_cay(text, text) to authenticated;
