-- ============================================================================
-- 202611031700 — task_xin_gia_han_va_han_theo_bao_xong
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 03/11):
--   (2) "Task phát triển: thêm tính năng để nhân sự ĐỀ XUẤT GIA HẠN, người giao sẽ duyệt hoặc không."
--       Trước chỉ cấp trên tự gia hạn được; người làm muốn xin thêm ngày phải nhắn ngoài hệ thống.
--   (3) "Hạn của task phát triển tính theo thời gian NHÂN SỰ BẤM (báo xong), không phải lúc người giao duyệt."
--       Trước: task đã báo xong (cho_duyet) mà cấp trên chưa duyệt, qua hạn ⇒ hiện "quá hạn" cho NGƯỜI LÀM,
--       đếm vào việc quá hạn của họ (bảng task, trợ lý, push app PT) — người làm gánh chậm của người duyệt.
--
-- CÁCH:
--   • Một nguồn: _task_qua_han(trang_thai, han) = CHỈ task 'dang_lam' qua hạn (đã báo xong thì hết trễ).
--     _task_xong_at(task) = lúc người làm báo xong trong chu kỳ hiện tại (sau lần gia hạn cuối); duyệt thẳng
--     không qua báo xong ⇒ lúc duyệt. Đúng hạn = ngày (giờ VN) của mốc đó ≤ hạn.
--   • Bảng task_xin_gia_han: dòng sinh ra lúc người làm GỬI đề xuất (dữ liệu thật, §1.5), trạng thái cho → dong_y | tu_choi | huy
--     (huy = task đóng hoặc cấp trên tự gia hạn trước khi quyết). Tối đa 1 đề xuất đang chờ / task.
--     Đồng ý = gọi đúng fn_task_gia_han (cùng log, cùng hòm thư, cùng quyền "cờ trễ") — không viết công thức thứ hai.
--   • fn_task_bang_v2 = fn_task_bang + xong_at · dung_han · xin_gia_han (đề xuất đang chờ). fn_task_bang giữ chữ ký,
--     đọc từ v2 (không drop) ⇒ fn_task_tien_do_team tự theo luật quá hạn mới.
--
-- MẤT GÌ: không xoá/drop gì. Thêm 1 bảng. Viết lại (create or replace): fn_task_bang · fn_task_bao_xong · fn_task_gia_han · fn_task_duyet ·
--   fn_task_huy (thêm: đóng đề xuất đang chờ) · _troly_cc_viec_phat_trien · fn_pt_push_dem · fn_pt_push_dem_1 (luật quá hạn mới
--   + đếm đề xuất chờ cho người giao).
-- ============================================================================

-- ── Một nguồn: quá hạn · lúc báo xong ────────────────────────────────────────
create or replace function public._task_qua_han(p_trang_thai text, p_han date)
returns boolean language sql stable set search_path = public as $$
  select p_trang_thai = 'dang_lam' and p_han < (now() at time zone 'Asia/Ho_Chi_Minh')::date
$$;

create or replace function public._task_xong_at(p_task uuid)
returns timestamptz language sql stable security definer set search_path = public as $$
  select case when t.trang_thai in ('cho_duyet', 'da_duyet') then
           coalesce((select max(l.created_at) from task_phat_trien_log l
                      where l.task_id = t.id and l.hanh_dong = 'bao_xong'
                        and l.created_at >= coalesce((select max(g.created_at) from task_phat_trien_log g
                                                      where g.task_id = t.id and g.hanh_dong = 'gia_han'), '-infinity')),
                    t.dong_at)
         end
    from task_phat_trien t where t.id = p_task
$$;

-- ── Đề xuất gia hạn ──────────────────────────────────────────────────────────
create table if not exists task_xin_gia_han (
  id             uuid primary key default gen_random_uuid(),
  task_id        uuid not null references task_phat_trien(id),
  nguoi_xin_id   uuid not null references nhan_su(id),
  han_cu         date not null,                       -- hạn lúc gửi đề xuất
  han_de_xuat    date not null,
  ly_do          text not null check (length(btrim(ly_do)) between 1 and 300),
  trang_thai     text not null default 'cho' check (trang_thai in ('cho', 'dong_y', 'tu_choi', 'huy')),
  nguoi_quyet_id uuid references nhan_su(id),          -- NULL = chưa quyết, hoặc huỷ tự động (không có người quyết)
  han_chot       date,                                 -- chỉ dong_y: hạn cấp trên chốt (có thể khác đề xuất)
  ghi_chu_quyet  text,                                 -- NULL = không kèm lời
  quyet_at       timestamptz,                          -- NULL = còn chờ
  created_at     timestamptz not null default now(),
  check (han_de_xuat > han_cu),
  check ((trang_thai = 'cho') = (quyet_at is null)),
  check ((trang_thai = 'dong_y') = (han_chot is not null))
);
create unique index if not exists task_xin_gia_han_cho_uq on task_xin_gia_han (task_id) where trang_thai = 'cho';
create index if not exists task_xin_gia_han_task_idx on task_xin_gia_han (task_id, created_at);

alter table task_xin_gia_han enable row level security;
drop policy if exists task_xgh_sel on task_xin_gia_han;
create policy task_xgh_sel on task_xin_gia_han for select to authenticated using ((select public.la_thanh_vien()));
revoke all on task_xin_gia_han from anon, authenticated;
grant select on task_xin_gia_han to authenticated;   -- ghi: chỉ qua fn_task_*

-- Người làm gửi đề xuất
create or replace function public.fn_task_xin_gia_han(p_task uuid, p_han_de_xuat date, p_ly_do text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_id uuid; v_ten text;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or t.nguoi_lam_id is distinct from v_me then raise exception 'Chỉ người đang làm task này mới xin gia hạn được'; end if;
  if t.trang_thai <> 'dang_lam' then raise exception 'Chỉ xin gia hạn khi task đang làm'; end if;
  if p_han_de_xuat is null or p_han_de_xuat <= t.han then raise exception 'Hạn đề xuất phải sau hạn hiện tại (%)', to_char(t.han, 'DD/MM'); end if;
  if nullif(btrim(coalesce(p_ly_do, '')), '') is null then raise exception 'Xin gia hạn phải ghi lý do'; end if;
  if exists (select 1 from task_xin_gia_han x where x.task_id = t.id and x.trang_thai = 'cho') then
    raise exception 'Task này đang có một đề xuất gia hạn chờ duyệt';
  end if;
  insert into task_xin_gia_han (task_id, nguoi_xin_id, han_cu, han_de_xuat, ly_do)
  values (t.id, v_me, t.han, p_han_de_xuat, btrim(p_ly_do)) returning id into v_id;
  update task_phat_trien set updated_at = now() where id = t.id;
  select ho_ten into v_ten from nhan_su where id = v_me;
  perform public._hom_thu_gui(t.nguoi_giao_id, 'viec', v_ten || ' xin gia hạn task đến ' || to_char(p_han_de_xuat, 'DD/MM'),
    t.tieu_de || E'\nHạn hiện tại: ' || to_char(t.han, 'DD/MM') || E'\n💬 ' || btrim(p_ly_do), 'giaoviec', v_me);
  return v_id;
end $$;

-- Người giao quyết: đồng ý (gia hạn, có thể chốt hạn khác + đánh cờ trễ) hoặc không đồng ý.
create or replace function public.fn_task_quyet_gia_han(p_xin uuid, p_dong_y boolean, p_han date default null,
                                                       p_ghi_chu text default null, p_co_tre boolean default false)
returns void language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); x task_xin_gia_han%rowtype; t task_phat_trien%rowtype;
        v_han date; v_gc text := nullif(btrim(coalesce(p_ghi_chu, '')), '');
begin
  select * into x from task_xin_gia_han where id = p_xin for update;
  if not found then raise exception 'Không tìm thấy đề xuất gia hạn'; end if;
  select * into t from task_phat_trien where id = x.task_id for update;
  if not (t.nguoi_giao_id = v_me or public._task_la_admin()) then raise exception 'Chỉ người giao task mới duyệt đề xuất gia hạn được'; end if;
  if x.trang_thai <> 'cho' then raise exception 'Đề xuất này đã được xử lý'; end if;
  if p_dong_y is null then raise exception 'Chọn đồng ý hoặc không'; end if;
  if p_dong_y then
    v_han := coalesce(p_han, x.han_de_xuat);
    update task_xin_gia_han set trang_thai = 'dong_y', nguoi_quyet_id = v_me, han_chot = v_han, ghi_chu_quyet = v_gc, quyet_at = now()
     where id = x.id;
    -- cùng đường với cấp trên tự gia hạn: kiểm hạn mới > hạn hiện tại, log 'gia_han', hòm thư, cờ trễ
    perform public.fn_task_gia_han(t.id, v_han, 'Đồng ý đề xuất gia hạn: ' || x.ly_do || coalesce(' — ' || v_gc, ''), coalesce(p_co_tre, false));
  else
    update task_xin_gia_han set trang_thai = 'tu_choi', nguoi_quyet_id = v_me, ghi_chu_quyet = v_gc, quyet_at = now()
     where id = x.id;
    update task_phat_trien set updated_at = now() where id = t.id;
    perform public._hom_thu_gui(x.nguoi_xin_id, 'viec', 'Đề xuất gia hạn chưa được đồng ý — hạn vẫn ' || to_char(t.han, 'DD/MM'),
      t.tieu_de || coalesce(E'\n💬 ' || v_gc, ''), 'giaoviec', v_me);
  end if;
end $$;

-- Task đóng / cấp trên tự gia hạn ⇒ đề xuất đang chờ hết nghĩa ⇒ 'huy' (gọi trong cùng transaction).
create or replace function public._task_huy_xin_gia_han(p_task uuid)
returns void language sql security definer set search_path = public as $$
  update task_xin_gia_han set trang_thai = 'huy', quyet_at = now() where task_id = p_task and trang_thai = 'cho'
$$;

-- ── Viết lại 4 hàm ghi: thêm đóng đề xuất chờ ─────────────────────────────────
-- Báo xong ⇒ không cần thêm ngày nữa ⇒ đề xuất đang chờ tự huỷ.
CREATE OR REPLACE FUNCTION public.fn_task_bao_xong(p_task uuid, p_ghi_chu text DEFAULT NULL::text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_ten text;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or t.nguoi_lam_id is distinct from v_me then raise exception 'Chỉ người đang làm task này mới báo xong được'; end if;
  if t.trang_thai <> 'dang_lam' then raise exception 'Task không ở trạng thái đang làm'; end if;
  perform public._task_huy_xin_gia_han(t.id);
  update task_phat_trien set trang_thai = 'cho_duyet', updated_at = now() where id = t.id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu)
  values (t.id, v_me, 'bao_xong', nullif(btrim(coalesce(p_ghi_chu, '')), ''));
  select ho_ten into v_ten from nhan_su where id = v_me;
  perform public._hom_thu_gui(t.nguoi_giao_id, 'viec', v_ten || ' báo xong task',
    t.tieu_de || coalesce(E'\n💬 ' || nullif(btrim(coalesce(p_ghi_chu, '')), ''), ''), 'giaoviec', v_me);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_task_gia_han(p_task uuid, p_han_moi date, p_ly_do text, p_co_tre boolean DEFAULT false)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_co boolean := false;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or not (t.nguoi_giao_id = v_me or public._task_la_admin()) then raise exception 'Chỉ người giao task mới gia hạn được'; end if;
  if t.trang_thai not in ('dang_lam','cho_duyet') then raise exception 'Task đã đóng'; end if;
  if p_han_moi is null or p_han_moi <= t.han then raise exception 'Hạn mới phải sau hạn hiện tại'; end if;
  if nullif(btrim(coalesce(p_ly_do, '')), '') is null then raise exception 'Gia hạn phải ghi lý do'; end if;
  if coalesce(p_co_tre, false) then v_co := public._task_danh_co_tre(t.id, t.nguoi_lam_id, 'Trễ deadline task: ' || btrim(p_ly_do), t.tieu_de, v_me); end if;
  perform public._task_huy_xin_gia_han(t.id);
  update task_phat_trien set han = p_han_moi, so_lan_gia_han = so_lan_gia_han + 1, trang_thai = 'dang_lam', updated_at = now() where id = t.id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu, han_cu, han_moi, co_tre)
  values (t.id, v_me, 'gia_han', btrim(p_ly_do), t.han, p_han_moi, v_co);
  perform public._hom_thu_gui(t.nguoi_lam_id, 'viec', 'Task của bạn được gia hạn đến ' || to_char(p_han_moi, 'DD/MM'),
    t.tieu_de || E'\n💬 ' || btrim(p_ly_do) || case when v_co then E'\n🏴 Bị đánh cờ trễ deadline' else '' end, 'giaoviec', v_me);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_task_duyet(p_task uuid, p_pct numeric, p_nhan_xet text DEFAULT NULL::text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_ten text;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or not (t.nguoi_giao_id = v_me or public._task_la_admin()) then raise exception 'Chỉ người giao task mới duyệt được'; end if;
  if t.trang_thai not in ('dang_lam','cho_duyet') then raise exception 'Task đã đóng'; end if;
  if p_pct is null or p_pct < 0 or p_pct > 100 then raise exception 'Kết quả phải từ 0 đến 100 (phần trăm)'; end if;
  perform public._task_huy_xin_gia_han(t.id);
  update task_phat_trien set trang_thai = 'da_duyet', ket_qua_pct = p_pct, nhan_xet = nullif(btrim(coalesce(p_nhan_xet, '')), ''),
         dong_at = now(), updated_at = now() where id = t.id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu, pct)
  values (t.id, v_me, 'duyet', nullif(btrim(coalesce(p_nhan_xet, '')), ''), p_pct);
  select ho_ten into v_ten from nhan_su where id = v_me;
  perform public._hom_thu_gui(t.nguoi_lam_id, 'nhan_xet', 'Task của bạn đã được duyệt: ' || regexp_replace(p_pct::numeric(5,2)::text, '.?0+$', '') || '%',
    t.tieu_de || coalesce(E'\n💬 ' || nullif(btrim(coalesce(p_nhan_xet, '')), ''), ''), 'giaoviec', v_me);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_task_huy(p_task uuid, p_ly_do text, p_co_tre boolean DEFAULT false)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_co boolean := false;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or not (t.nguoi_giao_id = v_me or public._task_la_admin()) then raise exception 'Chỉ người giao task mới huỷ được'; end if;
  if t.trang_thai not in ('dang_lam','cho_duyet') then raise exception 'Task đã đóng'; end if;
  if nullif(btrim(coalesce(p_ly_do, '')), '') is null then raise exception 'Huỷ phải ghi lý do'; end if;
  if coalesce(p_co_tre, false) then v_co := public._task_danh_co_tre(t.id, t.nguoi_lam_id, 'Trễ deadline task: ' || btrim(p_ly_do), t.tieu_de, v_me); end if;
  perform public._task_huy_xin_gia_han(t.id);
  update task_phat_trien set trang_thai = 'huy', nhan_xet = btrim(p_ly_do), dong_at = now(), updated_at = now() where id = t.id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu, co_tre) values (t.id, v_me, 'huy', btrim(p_ly_do), v_co);
  perform public._hom_thu_gui(t.nguoi_lam_id, 'viec', 'Task của bạn bị huỷ',
    t.tieu_de || E'\n💬 ' || btrim(p_ly_do) || case when v_co then E'\n🏴 Bị đánh cờ trễ deadline' else '' end, 'giaoviec', v_me);
end $function$;

-- ── Bảng task: thêm xong_at · dung_han · xin_gia_han ──────────────────────────
create or replace function public.fn_task_bang_v2()
 RETURNS TABLE(id uuid, tieu_de text, mo_ta text, trang_thai text, han date, han_goc date, so_lan_gia_han integer, den_han boolean, qua_han boolean,
               nguoi_lam_id uuid, nguoi_lam_ten text, nguoi_giao_id uuid, nguoi_giao_ten text, tien_do_bao_cao numeric, ket_qua_pct numeric,
               nhan_xet text, cap_nhat_cuoi_at timestamptz, created_at timestamptz, dong_at timestamptz,
               xong_at timestamptz, dung_han boolean, xin_gia_han jsonb)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  with h as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d)
  select t.id, t.tieu_de, t.mo_ta, t.trang_thai, t.han, t.han_goc, t.so_lan_gia_han,
         (t.trang_thai in ('dang_lam','cho_duyet') and t.han <= h.d)  as den_han,   -- đến hạn ⇒ cấp trên cần đánh giá
         public._task_qua_han(t.trang_thai, t.han)                      as qua_han,   -- chỉ task chưa báo xong
         t.nguoi_lam_id, l.ho_ten, t.nguoi_giao_id, g.ho_ten,
         cn.pct, t.ket_qua_pct, t.nhan_xet, cn.at, t.created_at, t.dong_at,
         xa.at,
         case when xa.at is not null then (xa.at at time zone 'Asia/Ho_Chi_Minh')::date <= t.han end,
         (select jsonb_build_object('id', x.id, 'han_de_xuat', x.han_de_xuat, 'ly_do', x.ly_do, 'created_at', x.created_at)
            from task_xin_gia_han x where x.task_id = t.id and x.trang_thai = 'cho')
    from task_phat_trien t
    cross join h
    join nhan_su l on l.id = t.nguoi_lam_id
    join nhan_su g on g.id = t.nguoi_giao_id
    left join lateral (select c.pct, c.created_at as at from task_phat_trien_log c
                        where c.task_id = t.id and c.hanh_dong = 'cap_nhat' and c.pct is not null
                        order by c.created_at desc limit 1) cn on true
    cross join lateral (select public._task_xong_at(t.id) as at) xa
   where public.la_thanh_vien()
     and ( t.trang_thai in ('dang_lam','cho_duyet') or t.dong_at > now() - interval '14 days' )
   order by (t.trang_thai in ('dang_lam','cho_duyet')) desc, t.han, t.created_at desc
   limit 500
$function$;

CREATE OR REPLACE FUNCTION public.fn_task_bang()
 RETURNS TABLE(id uuid, tieu_de text, mo_ta text, trang_thai text, han date, han_goc date, so_lan_gia_han integer, den_han boolean, qua_han boolean, nguoi_lam_id uuid, nguoi_lam_ten text, nguoi_giao_id uuid, nguoi_giao_ten text, tien_do_bao_cao numeric, ket_qua_pct numeric, nhan_xet text, cap_nhat_cuoi_at timestamp with time zone, created_at timestamp with time zone, dong_at timestamp with time zone)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  select b.id, b.tieu_de, b.mo_ta, b.trang_thai, b.han, b.han_goc, b.so_lan_gia_han, b.den_han, b.qua_han,
         b.nguoi_lam_id, b.nguoi_lam_ten, b.nguoi_giao_id, b.nguoi_giao_ten, b.tien_do_bao_cao, b.ket_qua_pct, b.nhan_xet,
         b.cap_nhat_cuoi_at, b.created_at, b.dong_at
    from public.fn_task_bang_v2() b
$function$;

-- ── Push app PT: người làm chỉ đếm task CHƯA báo xong tới hạn; người giao đếm thêm đề xuất gia hạn chờ ──
CREATE OR REPLACE FUNCTION public.fn_pt_push_dem(p_secret text)
 RETURNS TABLE(nhan_su_id uuid, so_viec integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return query
  select ns.id,
    ( (select count(*) from task_phat_trien t where t.nguoi_lam_id = ns.id and t.trang_thai = 'dang_lam'
          and t.han <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)
    + (select count(*) from task_phat_trien t where t.nguoi_giao_id = ns.id
          and (t.trang_thai = 'cho_duyet' or (t.trang_thai = 'dang_lam' and t.han <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)
               or exists (select 1 from task_xin_gia_han x where x.task_id = t.id and x.trang_thai = 'cho')))
    )::integer
  from (select distinct d.nhan_su_id as id from push_dang_ky d where d.app = 'pt') ns;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_pt_push_dem_1(p_secret text, p_ns uuid)
 RETURNS integer
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return
    (select count(*) from task_phat_trien t where t.nguoi_lam_id = p_ns and t.trang_thai = 'dang_lam'
        and t.han <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)
  + (select count(*) from task_phat_trien t where t.nguoi_giao_id = p_ns
        and (t.trang_thai = 'cho_duyet' or (t.trang_thai = 'dang_lam' and t.han <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)
             or exists (select 1 from task_xin_gia_han x where x.task_id = t.id and x.trang_thai = 'cho')));
end $function$;

-- ── Trợ lý: luật quá hạn mới ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public._troly_cc_viec_phat_trien(p jsonb)
 RETURNS jsonb LANGUAGE plpgsql STABLE SET search_path TO 'public'
AS $function$
declare
  v_lam jsonb; v_lam_id uuid; v_giao jsonb; v_giao_id uuid;
  v_tt text := lower(coalesce(nullif(btrim(p->>'trang_thai'), ''), 'dang_mo'));
  v_tu date; v_den date; v jsonb;
  c_tran constant int := 60;
begin
  perform public._troly_gac();
  if v_tt not in ('dang_mo', 'qua_han', 'cho_nghiem_thu', 'da_xong', 'tat_ca') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'trang_thai phải là: dang_mo | qua_han | cho_nghiem_thu | da_xong | tat_ca.');
  end if;
  if nullif(btrim(p->>'ten_nguoi_lam'), '') is not null then
    v_lam := public._troly_chon_ns(p->>'ten_nguoi_lam');
    if v_lam ? 'loi' then return v_lam; end if;
    v_lam_id := (v_lam->>'id')::uuid;
  end if;
  if nullif(btrim(p->>'ten_nguoi_giao'), '') is not null then
    v_giao := public._troly_chon_ns(p->>'ten_nguoi_giao');
    if v_giao ? 'loi' then return v_giao; end if;
    v_giao_id := (v_giao->>'id')::uuid;
  end if;
  v_tu := public._troly_ngay(p->>'han_tu_ngay', null);
  v_den := public._troly_ngay(p->>'han_den_ngay', null);

  with t as (
    select vc.tieu_de, vc.trang_thai, vc.han, vc.so_lan_gia_han, vc.ket_qua_pct, vc.created_at,
           nl.ho_ten as nguoi_lam, ng.ho_ten as nguoi_giao,
           public._task_qua_han(vc.trang_thai, vc.han) as qua_han
    from task_phat_trien vc
    join nhan_su nl on nl.id = vc.nguoi_lam_id
    join nhan_su ng on ng.id = vc.nguoi_giao_id
    where (v_lam_id is null or vc.nguoi_lam_id = v_lam_id)
      and (v_giao_id is null or vc.nguoi_giao_id = v_giao_id)
      and (v_tu is null or vc.han >= v_tu)
      and (v_den is null or vc.han <= v_den)
  ),
  loc as (
    select * from t
    where v_tt = 'tat_ca'
       or (v_tt = 'dang_mo' and trang_thai in ('dang_lam', 'cho_duyet'))
       or (v_tt = 'qua_han' and qua_han)
       or (v_tt = 'cho_nghiem_thu' and trang_thai = 'cho_duyet')
       or (v_tt = 'da_xong' and trang_thai = 'da_duyet')
  )
  select jsonb_build_object(
    'loc', jsonb_build_object('nguoi_lam', v_lam->>'ho_ten', 'nguoi_giao', v_giao->>'ho_ten',
                              'trang_thai', v_tt, 'han_tu_ngay', v_tu, 'han_den_ngay', v_den),
    'tong_theo_trang_thai', (select coalesce(jsonb_object_agg(g.trang_thai, g.n), '{}'::jsonb)
                               from (select trang_thai, count(*)::int as n from t group by trang_thai) g),
    'so_viec_qua_han', (select count(*) from t where qua_han),
    'theo_nguoi_lam', (select coalesce(jsonb_agg(to_jsonb(g) order by g.qua_han desc, g.dang_mo desc), '[]'::jsonb) from (
        select nguoi_lam,
               count(*) filter (where trang_thai in ('dang_lam', 'cho_duyet'))::int as dang_mo,
               count(*) filter (where qua_han)::int as qua_han,
               count(*) filter (where trang_thai = 'cho_duyet')::int as cho_nghiem_thu,
               count(*) filter (where trang_thai = 'da_duyet')::int as da_xong
        from t group by 1) g),
    'viec', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select tieu_de, trang_thai, han, qua_han, nguoi_lam, nguoi_giao, so_lan_gia_han, ket_qua_pct
        from loc order by han, created_at limit c_tran) r),
    'da_cat', (select count(*) > c_tran from loc),
    'ghi_chu', jsonb_build_array(
      'trang_thai của task: dang_lam · cho_duyet (người làm báo xong, chờ cấp trên) · da_duyet (cấp trên duyệt, có ket_qua_pct) · huy.',
      'qua_han = task CHƯA báo xong mà hạn đã qua. Hạn tính theo lúc người làm báo xong, không theo lúc cấp trên duyệt — task chờ duyệt không bị coi là quá hạn.',
      'Các bảng tổng đếm theo bộ lọc NGƯỜI + HẠN, không theo bộ lọc trang_thai, và không bị cắt.',
      format('Danh sách "viec" cắt ở %s dòng.', c_tran))
  ) into v;
  return v;
end $function$;

-- ── Quyền ────────────────────────────────────────────────────────────────────
revoke execute on function public._task_qua_han(text, date) from public, anon;
revoke execute on function public._task_xong_at(uuid) from public, anon;
revoke execute on function public._task_huy_xin_gia_han(uuid) from public, anon, authenticated;
revoke execute on function public.fn_task_xin_gia_han(uuid, date, text) from public, anon;
revoke execute on function public.fn_task_quyet_gia_han(uuid, boolean, date, text, boolean) from public, anon;
revoke execute on function public.fn_task_bang_v2() from public, anon;
grant execute on function public._task_qua_han(text, date), public._task_xong_at(uuid),
  public.fn_task_xin_gia_han(uuid, date, text), public.fn_task_quyet_gia_han(uuid, boolean, date, text, boolean),
  public.fn_task_bang_v2() to authenticated;
