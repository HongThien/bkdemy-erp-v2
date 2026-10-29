-- ============================================================================
-- 202610291648 — HÌNH LUYỆN: giả thiết hiệu lực TÁCH PHẦN (spec-hinh-cay-nhanh §1.3, bước C3)
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 29/10): MT chọn bài từ chuỗi mô hình MH.072 — ý "CMR AMCK là hình thoi" (B12, nhánh
--   "Lấy điểm K đối xứng với M qua E") in ra KHÔNG có giả thiết K. Builder (MT/ET/giáo trình Hình luyện)
--   vẫn tính giả thiết bằng luật cũ 17/08 ở client (giaThietBaiToan) — bước C3 của spec chưa từng làm.
--   Bài ghép nhiều ý trải trên nhiều nhánh cần biết TỪNG PHẦN giả thiết (gốc · từng nhánh trên đường ·
--   riêng của bài) để: đề chung = phần chung của mọi ý, mỗi ý thêm đúng phần của nhánh nó trước câu hỏi.
--
-- LÀM GÌ:
--   · `fn_hl_gia_thiet_phan(p_baitoan) → text[]` = NGUỒN CÔNG THỨC DUY NHẤT (CLAUDE.md §2.0): đúng luật
--     §1.3 (base = node thay-thế sâu nhất trên đường; base góp `gia_thiet`, đời sau góp `gia_thiet_them`;
--     cuối cùng `gia_thiet_rieng` của bài; bài `gt_thay_the` ⇒ chỉ `gia_thiet_rieng`).
--   · `fn_hl_gia_thiet_hieu_luc` viết lại = nối mảng trên bằng '; ' — KẾT QUẢ Y HỆT bản cũ (cùng luật,
--     cùng thứ tự, cùng dấu nối), chỉ để không còn 2 bản công thức. Self-check cuối file so 2 bản.
--   · `fn_hl_gia_thiet_phan_nhieu(p_ids uuid[])` — 1 lượt cho cả chuỗi ý của 1 bài ghép (không N+1).
--
-- MẤT GÌ: không. Thêm 2 hàm, thay thân 1 hàm (cùng chữ ký, cùng kết quả — có kiểm).
-- ============================================================================

create or replace function public.fn_hl_gia_thiet_phan(p_baitoan uuid)
returns text[]
language plpgsql stable
as $$
declare
  v_b      hinh_baitoan%rowtype;
  v_path   uuid[];
  v_base   int := 1;
  v_i      int;
  v_parts  text[] := '{}';
  v_m      hinh_mo_hinh%rowtype;
begin
  select * into v_b from hinh_baitoan where id = p_baitoan;
  if not found then return null; end if;
  if v_b.gt_thay_the then
    return case when coalesce(btrim(v_b.gia_thiet_rieng), '') <> '' then array[btrim(v_b.gia_thiet_rieng)] else '{}'::text[] end;
  end if;

  v_path := _hl_duong_mo_hinh(v_b.mo_hinh_id);                 -- [gốc … nhánh]
  for v_i in 2 .. coalesce(array_length(v_path, 1), 0) loop    -- node thay-thế sâu nhất (i > 1)
    select * into v_m from hinh_mo_hinh where id = v_path[v_i];
    if v_m.gt_thay_the then v_base := v_i; end if;
  end loop;

  for v_i in v_base .. coalesce(array_length(v_path, 1), 0) loop
    select * into v_m from hinh_mo_hinh where id = v_path[v_i];
    if v_i = v_base then
      if coalesce(btrim(v_m.gia_thiet), '') <> '' then v_parts := v_parts || btrim(v_m.gia_thiet); end if;
    else
      if coalesce(btrim(v_m.gia_thiet_them), '') <> '' then v_parts := v_parts || btrim(v_m.gia_thiet_them); end if;
    end if;
  end loop;

  if coalesce(btrim(v_b.gia_thiet_rieng), '') <> '' then v_parts := v_parts || btrim(v_b.gia_thiet_rieng); end if;
  return v_parts;
end
$$;

-- Bản cũ trả '' khi bài gt_thay_the mà rieng rỗng, và null khi không có bài — giữ y nguyên hành vi đó.
create or replace function public.fn_hl_gia_thiet_hieu_luc(p_baitoan uuid)
returns text
language sql stable
as $$
  select case when p is null then null else array_to_string(p, '; ') end
    from (select public.fn_hl_gia_thiet_phan(p_baitoan) as p) x
$$;

create or replace function public.fn_hl_gia_thiet_phan_nhieu(p_ids uuid[])
returns table(baitoan_id uuid, phan text[])
language sql stable
as $$
  select b.id, public.fn_hl_gia_thiet_phan(b.id)
    from hinh_baitoan b
   where b.id = any(p_ids)
$$;

grant execute on function public.fn_hl_gia_thiet_phan(uuid) to authenticated;
grant execute on function public.fn_hl_gia_thiet_phan_nhieu(uuid[]) to authenticated;

-- ── Self-check: bản mới phải ra Y HỆT công thức cũ trên MỌI bài đang có (chép lại thân cũ để so). ──
do $$
declare v_lech int;
begin
  with cu as (
    select b.id,
      case
        when b.gt_thay_the then coalesce(btrim(b.gia_thiet_rieng), '')
        else (
          with duong as (select u.mid, u.i from unnest(_hl_duong_mo_hinh(b.mo_hinh_id)) with ordinality u(mid, i)),
               base as (select coalesce(max(d.i) filter (where d.i > 1 and m.gt_thay_the), 1) bi from duong d join hinh_mo_hinh m on m.id = d.mid),
               phan as (
                 select d.i, case when d.i = (select bi from base) then nullif(btrim(m.gia_thiet), '') else nullif(btrim(m.gia_thiet_them), '') end t
                   from duong d join hinh_mo_hinh m on m.id = d.mid where d.i >= (select bi from base)
                 union all select 1e9::int, nullif(btrim(b.gia_thiet_rieng), ''))
          select coalesce(string_agg(t, '; ' order by i), '') from phan where t is not null)
      end as v
    from hinh_baitoan b)
  select count(*) into v_lech from cu where cu.v is distinct from coalesce(public.fn_hl_gia_thiet_hieu_luc(cu.id), '');
  if v_lech > 0 then raise exception 'fn_hl_gia_thiet_hieu_luc đổi kết quả trên % bài — rollback', v_lech; end if;
end $$;
