-- ============================================================================
-- 202609030325 — bo_tro_yeu_ca_viec  (bổ cho 202609030307, cùng đợt PLAN-botro-yeu-ca.md)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   ① fn_btyeu_hoan_tat: test parity (scripts/_diag_btyeu_test.mjs) lộ CHECK `buoi_danh_gia_muc_ma_khop_muc_chk`
--      — cột `muc` (số) phải khớp `muc_ma` (nhãn); bản trước chỉ ghi nhãn. Suy `muc` từ chữ số đầu của mã,
--      đúng luật gami.ts "số mức suy từ nhãn, không nhập rời".
--   ② fn_btyeu_viec_cua_toi: app TA cần 1 nguồn "việc bổ trợ yếu của tôi" = ca tôi đứng (hôm nay, nợ cũ, sắp
--      tới 7 ngày) + RETEST đến hạn của lớp tôi là TA. Không nhét vào getMyTasks (gami.ts) vì retest không có
--      buoi_hoc để deeplink — task theo BÀI, không theo BUỔI. Derive thuần, không cột trạng thái.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dữ liệu. create or replace 1 hàm (hoan_tat) + tạo mới 1 hàm.
-- ============================================================================

create or replace function public.fn_btyeu_hoan_tat(p_buoi uuid, p_nhan_xet text, p_muc_ma text default null, p_khong_test_ly_do text default null)
returns void language plpgsql security definer set search_path = public as $$
declare b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_test_da_nop boolean; v_co_test boolean; v_nx text; v_muc smallint;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if b.danh_gia_xong_at is not null then return; end if; -- idempotent
  select exists (select 1 from bai_test bt where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test'),
         exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop')
    into v_co_test, v_test_da_nop;
  if v_co_test and not v_test_da_nop and nullif(trim(coalesce(p_khong_test_ly_do, '')), '') is null then
    raise exception 'Em chưa làm bài kiểm tra cuối buổi — nhập lý do "không test" nếu em không làm.';
  end if;
  v_nx := nullif(trim(coalesce(p_nhan_xet, '')), '');
  if v_co_test and not v_test_da_nop then v_nx := concat_ws(E'\n', '[Không test: ' || trim(p_khong_test_ly_do) || ']', v_nx); end if;
  if v_nx is null and p_muc_ma is null then raise exception 'Nhập nhận xét hoặc chọn mức.'; end if;
  v_muc := case when p_muc_ma is null then null else left(p_muc_ma, 1)::smallint end; -- '4a' → 4 (CHECK khớp muc↔muc_ma)
  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, muc, muc_ma, graded_by, updated_at)
    values (p_buoi, b.hoc_sinh_id, v_nx, v_muc, p_muc_ma, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update
      set nhan_xet = excluded.nhan_xet, muc = excluded.muc, muc_ma = excluded.muc_ma, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
end $$;
grant execute on function public.fn_btyeu_hoan_tat(uuid, text, text, text) to authenticated;

-- Việc bổ trợ yếu của NGƯỜI GỌI (TA/GV cao cấp). Admin thấy MỌI ca/retest (để OPS/Thùy soi).
create or replace function public.fn_btyeu_viec_cua_toi() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today(); v_ca jsonb; v_rt jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  v_admin := coalesce(v_admin, false);

  select coalesce(jsonb_agg(x order by x.ngay, x.gio_bat_dau nulls last), '[]'::jsonb) into v_ca from (
    select b.id as buoi_id, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.phong,
           h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, h.khoi, y.mon,
           (select level from hs_level where hoc_sinh_id = h.id and mon = y.mon and loai = 'kien_thuc') as level,
           hh.diem_danh,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id) as so_dang,
           exists (select 1 from bai_test bt where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test') as co_test,
           exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id
                   where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop') as test_da_nop,
           b.danh_gia_xong_at
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo'
      and (v_admin or b.nguoi_day_tg = v_ns)
      and b.ngay <= v_today + 7
      and (b.danh_gia_xong_at is null or b.ngay = v_today)   -- nợ cũ + hôm nay (kể cả đã xong để xem lại) + sắp tới
  ) x;

  select coalesce(jsonb_agg(x order by x.ngay, x.ho_ten), '[]'::jsonb) into v_rt from (
    select bt.id as bai_test_id, bt.ngay, bt.mon, bt.so_cau, bt.lop_id, l.ten_lop,
           h.id as hoc_sinh_id, h.ho_ten, h.ma_hs,
           coalesce(bl.trang_thai = 'da_nop', false) as da_nop,
           (select ngay from buoi_hoc where id = bt.buoi_hoc_id) as buoi_bo_tro_ngay
    from bai_test bt
    join lop l on l.id = bt.lop_id
    join hoc_sinh h on h.id = bt.hoc_sinh_id
    left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id
    where bt.loai = 'retest' and bt.trang_thai = 'mo' and bt.ngay <= v_today
      and (bl.trang_thai is distinct from 'da_nop')
      and (v_admin or exists (select 1 from phan_cong_lop pc where pc.lop_id = bt.lop_id and pc.nhan_su_id = v_ns and pc.vai_tro = 'tg'))
  ) x;

  return jsonb_build_object('ca', v_ca, 'retest', v_rt);
end $$;
grant execute on function public.fn_btyeu_viec_cua_toi() to authenticated;
