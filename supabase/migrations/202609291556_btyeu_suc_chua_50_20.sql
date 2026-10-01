-- Thùy 29/09: "Giới hạn bổ trợ yếu 50 ca / 1 tuần, ưu tiên 20 ca / 1 tuần. Không thể duyệt nhiều hơn. Muốn thêm ca mới phải huỷ ca cũ."
--   + "Mỗi tuần xếp 50 em. Tuần cũ còn dư 15 em thì chỉ được duyệt thêm 35 — 50 là capacity, không cộng dồn quá 50."
--   ⇒ trần = số em ĐANG bổ trợ yếu cùng lúc (case 'dang_xu', mọi môn) ≤ 50, trong đó ưu tiên Cao (uu_tien 3) ≤ 20.
--   Chặn CỨNG ở DB (trigger) — mọi đường mở/mở lại case hoặc nâng ưu tiên đều qua đây; client chỉ kiểm trước để báo sớm.
--   Muốn thêm em: hạ L0 / huỷ 1 em cũ (fn_btyeu_doi_level) hoặc hạ ưu tiên 1 em Cao.

create or replace function public._btyeu_tran_dang() returns integer language sql immutable as $$ select 50 $$;
create or replace function public._btyeu_tran_cao() returns integer language sql immutable as $$ select 20 $$;

-- Bộ đếm cho màn Duyệt / Xếp: { dang, cao, tran, tran_cao }
create or replace function public.fn_btyeu_suc_chua() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('dang', count(*), 'cao', count(*) filter (where uu_tien = 3),
                            'tran', public._btyeu_tran_dang(), 'tran_cao', public._btyeu_tran_cao())
  from bo_tro_yeu where trang_thai = 'dang_xu'
$$;
grant execute on function public.fn_btyeu_suc_chua() to authenticated;
revoke execute on function public.fn_btyeu_suc_chua() from anon;

-- Kiểm TRƯỚC khi Duyệt ghi level (tránh ghi L1 mà không mở được case). null = được; text = lý do chặn.
-- Em đã có case mở ⇒ Duyệt chỉ gộp dạng, không tốn chỗ, không đổi ưu tiên ⇒ luôn được.
create or replace function public.fn_btyeu_kiem_suc_chua(p_hs uuid, p_mon text, p_uu_tien integer) returns text
language plpgsql stable security definer set search_path = public as $$
declare v_dang int; v_cao int;
begin
  if exists (select 1 from bo_tro_yeu where hoc_sinh_id = p_hs and mon = p_mon and trang_thai = 'dang_xu') then return null; end if;
  select count(*), count(*) filter (where uu_tien = 3) into v_dang, v_cao from bo_tro_yeu where trang_thai = 'dang_xu';
  if v_dang >= public._btyeu_tran_dang() then
    return format('Đã đủ %s/%s em đang bổ trợ yếu — muốn thêm em mới phải hạ L0 / huỷ 1 em cũ trước.', v_dang, public._btyeu_tran_dang());
  end if;
  if p_uu_tien = 3 and v_cao >= public._btyeu_tran_cao() then
    return format('Đã đủ %s/%s em ưu tiên Cao — chọn Thường, hoặc hạ ưu tiên 1 em Cao khác trước.', v_cao, public._btyeu_tran_cao());
  end if;
  return null;
end $$;
grant execute on function public.fn_btyeu_kiem_suc_chua(uuid, text, integer) to authenticated;
revoke execute on function public.fn_btyeu_kiem_suc_chua(uuid, text, integer) from anon;

create or replace function public._trg_btyeu_suc_chua() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_n int;
begin
  if new.trang_thai <> 'dang_xu' then return new; end if;
  perform pg_advisory_xact_lock(hashtext('btyeu_suc_chua')); -- 2 người duyệt cùng lúc không lọt quá trần
  if tg_op = 'INSERT' or old.trang_thai <> 'dang_xu' then
    select count(*) into v_n from bo_tro_yeu where trang_thai = 'dang_xu' and id <> new.id;
    if v_n >= public._btyeu_tran_dang() then
      raise exception 'Đã đủ %/% em đang bổ trợ yếu — muốn thêm em mới phải hạ L0 / huỷ 1 em cũ trước.', v_n, public._btyeu_tran_dang();
    end if;
  end if;
  if new.uu_tien = 3 and (tg_op = 'INSERT' or old.trang_thai <> 'dang_xu' or old.uu_tien is distinct from 3) then
    select count(*) into v_n from bo_tro_yeu where trang_thai = 'dang_xu' and uu_tien = 3 and id <> new.id;
    if v_n >= public._btyeu_tran_cao() then
      raise exception 'Đã đủ %/% em ưu tiên Cao — hạ ưu tiên 1 em Cao khác trước.', v_n, public._btyeu_tran_cao();
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_btyeu_suc_chua on public.bo_tro_yeu;
create trigger trg_btyeu_suc_chua before insert or update of trang_thai, uu_tien on public.bo_tro_yeu
  for each row execute function public._trg_btyeu_suc_chua();
