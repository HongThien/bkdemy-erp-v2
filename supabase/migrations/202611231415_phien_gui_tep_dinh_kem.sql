-- PHIÊN CLAUDE — gửi TỆP kèm tin (Thùy 23/11: "phiên Claude cần có chức năng gửi ảnh, gửi file"). Gửi ẢNH đã có từ 20/11 (mig 202611201553) — file này thêm TỆP.
--  • bảng claude_phien_tep: tệp của từng tin (base64), ghi CHỈ qua fn_phien_gui — cùng khuôn với claude_phien_anh
--  • claude_phien_tin.so_tep: số tệp gửi kèm (0 = tin không tệp, không phải thiếu)
--  • fn_phien_gui(p_phien, p_noi_dung, p_anh, p_tep): ≤ 3 tệp / tin, mỗi tệp ≤ ~3 MB; tệp nhận: PDF + tệp chữ (txt · md · csv · json · tex).
--    Word / Excel CHƯA nhận (Claude trong phiên chỉ có công cụ Read: đọc được PDF và chữ; đề Toán trong Word có công thức, bóc chữ sẽ mất) ⇒ màn nhắc lưu thành PDF.
--    Hạn ngày dùng chung với ảnh: 20 tin có ảnh HOẶC tệp / người / ngày (_phien_gioi_han_anh_ngay).
--  • Bản 3 tham số (app chưa deploy bản mới vẫn gọi) giữ nguyên chữ ký, chuyển sang gọi bản 4 tham số ⇒ MỘT nguồn logic.
--  • fn_phien_tep_ds / fn_phien_tep_lay: màn đọc danh sách tệp của phiên / tải một tệp (chạy theo quyền người gọi, RLS của bảng lo phạm vi).
--  • fn_phien_anh_don: dọn luôn tệp của phiên đã đóng quá 30 ngày (cùng hạn giữ với ảnh — spec-quan-ly-chat-luong §6.5 dòng 4).

alter table claude_phien_tin add column if not exists so_tep smallint not null default 0;

create table if not exists claude_phien_tep (
  id         bigint generated always as identity primary key,
  phien_id   uuid   not null references claude_phien(id) on delete cascade,
  tin_id     bigint not null references claude_phien_tin(id) on delete cascade,
  thu_tu     smallint not null,
  ten        text   not null,                -- tên tệp người gửi đặt (chỉ để HIỂN THỊ; bot không dùng làm tên tệp trên đĩa)
  mime       text   not null check (mime in ('application/pdf', 'text/plain', 'text/markdown', 'text/csv', 'application/json', 'text/x-tex')),
  du_lieu    text   not null,                -- base64, không tiền tố data:
  kich_thuoc integer not null,               -- số byte của tệp gốc
  created_at timestamptz not null default now(),
  unique (tin_id, thu_tu)
);
create index if not exists claude_phien_tep_phien_idx on claude_phien_tep (phien_id);

alter table claude_phien_tep enable row level security;
drop policy if exists claude_phien_tep_doc on claude_phien_tep;
create policy claude_phien_tep_doc on claude_phien_tep for select to authenticated
  using ((select public._phien_xem_duoc(phien_id)));
revoke all on claude_phien_tep from anon, public;
grant select on claude_phien_tep to authenticated;   -- ghi / xoá: chỉ hàm secdef bên dưới và service_role (bot)

create or replace function public.fn_phien_gui(p_phien uuid, p_noi_dung text, p_anh jsonb, p_tep jsonb)
 returns bigint
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_p claude_phien; v_id bigint; v_n int; v_m int; v_a jsonb; v_i int := 0; v_tong int := 0; v_tong_tep int := 0;
  v_nd text := nullif(trim(coalesce(p_noi_dung, '')), '');
  v_hom timestamptz;
begin
  select * into v_p from claude_phien where id = p_phien;
  if not found or not public._phien_xem_duoc(p_phien) then raise exception 'Không có phiên này.'; end if;
  if v_p.trang_thai <> 'mo' then raise exception 'Phiên đã đóng — mở lại phiên để nhắn tiếp.'; end if;
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  if p_anh is null or jsonb_typeof(p_anh) <> 'array' then raise exception 'Danh sách ảnh không hợp lệ.'; end if;
  if p_tep is null or jsonb_typeof(p_tep) <> 'array' then raise exception 'Danh sách tệp không hợp lệ.'; end if;
  v_n := jsonb_array_length(p_anh);
  v_m := jsonb_array_length(p_tep);
  if v_n > 5 then raise exception 'Mỗi tin gửi tối đa 5 ảnh.'; end if;
  if v_m > 3 then raise exception 'Mỗi tin gửi tối đa 3 tệp.'; end if;
  if v_nd is null and v_n = 0 and v_m = 0 then raise exception 'Tin nhắn trống.'; end if;
  if v_n > 0 then
    for v_a in select * from jsonb_array_elements(p_anh) loop
      if coalesce(v_a->>'mime', '') not in ('image/jpeg', 'image/png', 'image/webp')
         or coalesce(v_a->>'du_lieu', '') = '' or coalesce(v_a->>'thu', '') = '' then
        raise exception 'Ảnh số % không hợp lệ (cần mime, thu, du_lieu).', v_i + 1;
      end if;
      if length(v_a->>'du_lieu') > 1500000 then raise exception 'Ảnh số % quá lớn (tối đa ~1,1 MB sau nén).', v_i + 1; end if;
      if length(v_a->>'thu') > 60000 then raise exception 'Ảnh thu nhỏ số % quá lớn.', v_i + 1; end if;
      v_tong := v_tong + length(v_a->>'du_lieu'); v_i := v_i + 1;
    end loop;
    if v_tong > 5000000 then raise exception 'Tổng dung lượng ảnh của tin quá lớn — bớt ảnh hoặc chụp nhỏ lại.'; end if;
  end if;
  if v_m > 0 then
    v_i := 0;
    for v_a in select * from jsonb_array_elements(p_tep) loop
      v_i := v_i + 1;
      if coalesce(v_a->>'mime', '') not in ('application/pdf', 'text/plain', 'text/markdown', 'text/csv', 'application/json', 'text/x-tex') then
        raise exception 'Tệp số %: chỉ nhận PDF và tệp chữ (txt, md, csv, json, tex). Word / Excel: lưu thành PDF rồi gửi.', v_i;
      end if;
      if coalesce(v_a->>'du_lieu', '') = '' or coalesce(btrim(v_a->>'ten'), '') = '' then raise exception 'Tệp số % không hợp lệ (cần ten, mime, du_lieu).', v_i; end if;
      if v_a->>'du_lieu' !~ '^[A-Za-z0-9+/]+=*$' then raise exception 'Tệp số % không đúng định dạng.', v_i; end if;
      if length(v_a->>'du_lieu') > 4200000 then raise exception 'Tệp số % quá lớn (tối đa khoảng 3 MB) — tách nhỏ hoặc gửi từng phần.', v_i; end if;
      v_tong_tep := v_tong_tep + length(v_a->>'du_lieu');
    end loop;
    if v_tong_tep > 6500000 then raise exception 'Tổng dung lượng tệp của tin quá lớn — gửi thành nhiều tin.'; end if;
  end if;
  if v_n > 0 or v_m > 0 then
    v_hom := date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh';
    if (select count(*) from claude_phien_tin
         where vai = 'nguoi' and nguoi_gui = public.jwt_uid() and (so_anh > 0 or so_tep > 0) and created_at >= v_hom)
       >= public._phien_gioi_han_anh_ngay() then
      raise exception 'Hôm nay bạn đã gửi % tin có ảnh / tệp (mức tối đa) — mai gửi tiếp.', public._phien_gioi_han_anh_ngay();
    end if;
  end if;
  insert into claude_phien_tin (phien_id, vai, nguoi_gui, noi_dung, trang_thai, so_anh, so_tep)
  values (p_phien, 'nguoi', public.jwt_uid(), coalesce(v_nd, case when v_n > 0 then '(chỉ gửi ảnh)' else '(chỉ gửi tệp)' end), 'cho', v_n, v_m)
  returning id into v_id;
  v_i := 0;
  if v_n > 0 then
    for v_a in select * from jsonb_array_elements(p_anh) loop
      v_i := v_i + 1;
      insert into claude_phien_anh (phien_id, tin_id, thu_tu, mime, thu, du_lieu, kich_thuoc)
      values (p_phien, v_id, v_i, v_a->>'mime', v_a->>'thu', v_a->>'du_lieu', length(v_a->>'du_lieu'));
    end loop;
  end if;
  v_i := 0;
  if v_m > 0 then
    for v_a in select * from jsonb_array_elements(p_tep) loop
      v_i := v_i + 1;
      insert into claude_phien_tep (phien_id, tin_id, thu_tu, ten, mime, du_lieu, kich_thuoc)
      values (p_phien, v_id, v_i,
              left(regexp_replace(btrim(v_a->>'ten'), '[[:cntrl:]]', ' ', 'g'), 160),   -- tên chỉ để hiển thị: bỏ ký tự điều khiển / xuống dòng
              v_a->>'mime', v_a->>'du_lieu', octet_length(decode(v_a->>'du_lieu', 'base64')));
    end loop;
  end if;
  return v_id;
end
$function$;

-- bản 3 tham số (app bản cũ): cùng chữ ký, chuyển sang bản 4 tham số — chạy theo quyền người gọi, cổng nằm ở bản 4 tham số
create or replace function public.fn_phien_gui(p_phien uuid, p_noi_dung text, p_anh jsonb default '[]'::jsonb)
 returns bigint
 language sql
 security invoker
 set search_path to 'public'
as $function$
  select public.fn_phien_gui(p_phien, p_noi_dung, p_anh, '[]'::jsonb);
$function$;

-- màn: danh sách tệp của một phiên (không kèm nội dung) · tải một tệp — RLS của claude_phien_tep lọc phạm vi
create or replace function public.fn_phien_tep_ds(p_phien uuid)
 returns table (id bigint, tin_id bigint, thu_tu smallint, ten text, mime text, kich_thuoc integer)
 language sql stable
 set search_path to 'public'
as $function$
  select t.id, t.tin_id, t.thu_tu, t.ten, t.mime, t.kich_thuoc from claude_phien_tep t where t.phien_id = p_phien order by t.tin_id, t.thu_tu limit 500;
$function$;

create or replace function public.fn_phien_tep_lay(p_id bigint)
 returns jsonb
 language sql stable
 set search_path to 'public'
as $function$
  select jsonb_build_object('ten', t.ten, 'mime', t.mime, 'du_lieu', t.du_lieu) from claude_phien_tep t where t.id = p_id;
$function$;

-- dọn: phiên đã đóng quá 30 ngày ⇒ xoá ảnh VÀ tệp (ghi vết từng phiên)
create or replace function public.fn_phien_anh_don()
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare r record; v_tong int := 0; v_n int; v_t int;
begin
  for r in select p.id from claude_phien p
            where p.trang_thai = 'dong' and p.updated_at < now() - interval '30 days'
              and (exists (select 1 from claude_phien_anh a where a.phien_id = p.id)
                   or exists (select 1 from claude_phien_tep t where t.phien_id = p.id)) loop
    delete from claude_phien_anh where phien_id = r.id;
    get diagnostics v_n = row_count;
    delete from claude_phien_tep where phien_id = r.id;
    get diagnostics v_t = row_count;
    insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
    values (r.id, 'don_anh', '{}'::jsonb, jsonb_build_object('so_anh_xoa', v_n, 'so_tep_xoa', v_t));
    v_tong := v_tong + v_n + v_t;
  end loop;
  return v_tong;
end
$function$;
revoke all on function public.fn_phien_anh_don() from public, anon, authenticated;
grant execute on function public.fn_phien_anh_don() to service_role;
