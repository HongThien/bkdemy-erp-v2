-- Phiên Claude: trưởng khối GỬI ẢNH ĐỀ cho Claude giải bài rồi Copy (spec-quan-ly-chat-luong.md §6.5, Thùy chốt 20/11).
--  • bảng claude_phien_anh: ảnh của từng tin (thu nhỏ + bản đủ, base64), ghi CHỈ qua fn_phien_gui
--  • claude_phien_tin.so_anh: số ảnh đã gửi kèm (0 = tin không ảnh, không phải thiếu)
--  • fn_phien_gui(p_phien, p_noi_dung, p_anh): ≤ 5 ảnh/tin, ≤ 20 tin có ảnh/người/ngày (giờ VN)
--  • mở loại phiên giai_bai
--  • fn_phien_anh_don(): xoá ảnh của phiên đã đóng quá 30 ngày (cron: 202611201553_phien_anh_don_cron_sql_editor.sql)

alter table claude_phien_tin add column if not exists so_anh smallint not null default 0;

create table if not exists claude_phien_anh (
  id         bigint generated always as identity primary key,
  phien_id   uuid   not null references claude_phien(id) on delete cascade,
  tin_id     bigint not null references claude_phien_tin(id) on delete cascade,
  thu_tu     smallint not null,
  mime       text   not null check (mime in ('image/jpeg', 'image/png', 'image/webp')),
  thu        text   not null,            -- ảnh thu nhỏ, base64 (không có tiền tố data:)
  du_lieu    text   not null,            -- ảnh đủ, base64
  kich_thuoc integer not null,           -- số ký tự base64 của du_lieu
  created_at timestamptz not null default now(),
  unique (tin_id, thu_tu)
);
create index if not exists claude_phien_anh_phien_idx on claude_phien_anh (phien_id);

alter table claude_phien_anh enable row level security;
create policy claude_phien_anh_doc on claude_phien_anh for select to authenticated
  using ((select public._phien_xem_duoc(phien_id)));
create policy claude_ro_select on claude_phien_anh for select to claude_ro using (true);
revoke all on claude_phien_anh from anon, public;
grant select on claude_phien_anh to authenticated;   -- ghi/xoá: chỉ hàm secdef bên dưới và service_role

create or replace function public._phien_gioi_han_anh_ngay() returns int
  language sql immutable as $$ select 20 $$;           -- Thùy 20/11: 20 tin có ảnh / người / ngày

create or replace function public._phien_loai_dang_mo() returns text[]
  language sql immutable as $$ select array['ban_do', 'ly_thuyet', 'nhap_kho', 'giai_bai'] $$;

-- Hàm cũ 2 tham số bỏ để khỏi mơ hồ với bản có p_anh (mặc định rỗng ⇒ lời gọi cũ vẫn chạy).
drop function if exists public.fn_phien_gui(uuid, text);
create or replace function public.fn_phien_gui(p_phien uuid, p_noi_dung text, p_anh jsonb default '[]'::jsonb)
 returns bigint language plpgsql security definer set search_path to 'public' as $function$
declare
  v_p claude_phien; v_id bigint; v_n int; v_a jsonb; v_i int := 0; v_tong int := 0;
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
  v_n := jsonb_array_length(p_anh);
  if v_n > 5 then raise exception 'Mỗi tin gửi tối đa 5 ảnh.'; end if;
  if v_nd is null and v_n = 0 then raise exception 'Tin nhắn trống.'; end if;
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
    v_hom := date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh';
    if (select count(*) from claude_phien_tin
         where vai = 'nguoi' and nguoi_gui = public.jwt_uid() and so_anh > 0 and created_at >= v_hom)
       >= public._phien_gioi_han_anh_ngay() then
      raise exception 'Hôm nay bạn đã gửi % tin có ảnh (mức tối đa) — mai gửi tiếp.', public._phien_gioi_han_anh_ngay();
    end if;
  end if;
  insert into claude_phien_tin (phien_id, vai, nguoi_gui, noi_dung, trang_thai, so_anh)
  values (p_phien, 'nguoi', public.jwt_uid(), coalesce(v_nd, '(chỉ gửi ảnh)'), 'cho', v_n)
  returning id into v_id;
  v_i := 0;
  if v_n > 0 then
    for v_a in select * from jsonb_array_elements(p_anh) loop
      v_i := v_i + 1;
      insert into claude_phien_anh (phien_id, tin_id, thu_tu, mime, thu, du_lieu, kich_thuoc)
      values (p_phien, v_id, v_i, v_a->>'mime', v_a->>'thu', v_a->>'du_lieu', length(v_a->>'du_lieu'));
    end loop;
  end if;
  return v_id;
end $function$;
revoke all on function public.fn_phien_gui(uuid, text, jsonb) from public, anon;
grant execute on function public.fn_phien_gui(uuid, text, jsonb) to authenticated, service_role;

-- Dọn ảnh: phiên ĐÃ ĐÓNG quá 30 ngày (tính từ lần cập nhật cuối của phiên). Ghi vết số ảnh đã xoá vào claude_phien_ghi.
create or replace function public.fn_phien_anh_don() returns int
 language plpgsql security definer set search_path to 'public' as $function$
declare r record; v_tong int := 0; v_n int;
begin
  for r in select p.id from claude_phien p
            where p.trang_thai = 'dong' and p.updated_at < now() - interval '30 days'
              and exists (select 1 from claude_phien_anh a where a.phien_id = p.id) loop
    delete from claude_phien_anh where phien_id = r.id;
    get diagnostics v_n = row_count;
    insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
    values (r.id, 'don_anh', '{}'::jsonb, jsonb_build_object('so_anh_xoa', v_n));
    v_tong := v_tong + v_n;
  end loop;
  return v_tong;
end $function$;
revoke all on function public.fn_phien_anh_don() from public, anon, authenticated;
grant execute on function public.fn_phien_anh_don() to service_role;
