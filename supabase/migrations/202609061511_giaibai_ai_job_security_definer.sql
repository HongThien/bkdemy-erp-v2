-- 202609061511 — giaibai_ai_job_security_definer
-- BUG lộ lúc test tay UI 06/09: "new row violates row-level security policy for table giaibai_ai_job".
-- `fn_giaibai_ai_tao_job` mặc định SECURITY INVOKER (chạy bằng quyền người GỌI = authenticated) — mà
-- bảng `giaibai_ai_job` bật RLS KHÔNG có policy nào cho authenticated (cố ý, mig 202609061458: "mọi thao
-- tác qua RPC SECURITY DEFINER"). Chỉ ghi Ở COMMENT chứ CHƯA thật sự đặt `security definer` trong code —
-- nói một đằng làm một nẻo. Vá: thêm `security definer set search_path = public` (mẫu đã dùng ở
-- 202609030325/202609051300) cho 2 hàm chạm bảng job thay mặt người dùng thường.
-- MẤT GÌ (Luật xoá): không — create-or-replace, giữ nguyên chữ ký/logic, chỉ đổi quyền chạy.
create or replace function public.fn_giaibai_ai_tao_job(p_nhanh text[], p_me uuid, p_model text default null)
returns int
language plpgsql security definer set search_path = public as $$
declare v_tong int := 0; v_n int; v_nh text; v_src text;
begin
  if not exists (select 1 from unnest(p_nhanh) x where public.fn_giaibai_la_nguoi_duyet(p_me, x)) then
    raise exception 'Chỉ team học thuật (hoặc admin) mới tạo job AI được.';
  end if;
  foreach v_nh in array p_nhanh loop
    if v_nh in ('toan','khtn','hgt') then
      select src into v_src from public.fn_giaibai_src(v_nh);
      execute format($q$
        insert into public.giaibai_ai_job (nhanh, key, model_chon, nguoi_tao)
        select %2$L, c.ma_cau, $2, $1 from %1$I c
        where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null and c.loi_giai_ai is null
          and not exists (select 1 from public.giaibai_ai_job j where j.nhanh = %2$L and j.key = c.ma_cau and j.trang_thai in ('pending','processing'))
      $q$, v_src, v_nh) using p_me, p_model;
    else
      execute format($q$
        insert into public.giaibai_ai_job (nhanh, key, model_chon, nguoi_tao)
        select %1$L, h.id::text, $2, $1 from public.v_hinh_chua_giai h
        where h.loai = %2$L and h.loi_giai_ai is null
          and not exists (select 1 from public.giaibai_ai_job j where j.nhanh = %1$L and j.key = h.id::text and j.trang_thai in ('pending','processing'))
      $q$, v_nh, case v_nh when 'hinh_baitoan' then 'baitoan' else 'bien_the' end) using p_me, p_model;
    end if;
    get diagnostics v_n = row_count;
    v_tong := v_tong + v_n;
  end loop;
  return v_tong;
end $$;
grant execute on function public.fn_giaibai_ai_tao_job(text[], uuid, text) to authenticated;

create or replace function public.fn_giaibai_ai_job_status(p_nhanh text[], p_me uuid)
returns table (trang_thai text, so_luong bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from unnest(p_nhanh) x where public.fn_giaibai_la_nguoi_duyet(p_me, x)) then
    raise exception 'Chỉ team học thuật (hoặc admin) mới xem được.';
  end if;
  return query select j.trang_thai, count(*) from public.giaibai_ai_job j where j.nhanh = any(p_nhanh) group by j.trang_thai;
end $$;
grant execute on function public.fn_giaibai_ai_job_status(text[], uuid) to authenticated;
