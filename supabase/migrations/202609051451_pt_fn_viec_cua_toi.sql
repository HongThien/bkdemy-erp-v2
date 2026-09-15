-- ============================================================================
-- 202609051451 — pt_fn_viec_cua_toi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 05/09 (soi app pt trên iPhone): card ở tab "Hôm nay" và "Việc của tôi" là CÙNG một
--   việc mà hiển thị khác nhau — vì hai tab đọc hai nguồn (fn_pt_viec_hom_nay vs
--   listViecCuaToi + decorate ở client). Gộp về MỘT hàm: mọi việc tôi đang cầm (mọi trạng
--   thái) + các cột suy ra (quá hạn, đã cập nhật hôm nay, % tự báo GẦN NHẤT, số con) —
--   "Hôm nay" chỉ là lọc `dang_mo` trên cùng tập (lọc UI thuần, §2.0 cho phép).
--   % gần nhất = dòng viec_cap_nhat mới nhất CÓ %, vì người làm được phép cập nhật chữ
--   không kèm % — lấy dòng cuối bất kể sẽ mất % trước đó.
--   Hai hàm cũ (fn_pt_viec_can_cap_nhat / fn_pt_viec_hom_nay) GIỮ — không drop (Luật xoá),
--   app không gọi nữa.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Hàm mới hoàn toàn.
-- ============================================================================

create or replace function public.fn_pt_viec_cua_toi()
returns table (
  id uuid, tieu_de text, trang_thai text, deadline date, task_me_id uuid,
  muc_tieu text, output text, mo_ta text, khoi_luong numeric,
  nguoi_giao_ten text, phan_tram numeric, tien_do numeric, chat_luong numeric,
  so_lan_gia_han integer, gia_han_xin_deadline date, ghi_chu_nghiem_thu text, evidence text,
  so_con integer, so_con_dat integer, dang_mo boolean,
  qua_han boolean, da_cap_nhat_hom_nay boolean, cap_nhat_cuoi_at timestamptz, tien_do_bao_cao numeric,
  created_at timestamptz, hoan_thanh_at timestamptz
)
language sql stable set search_path = public as $$
  with h as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d),
  me as (select tk.nhan_su_id as ns from tai_khoan tk where tk.id = jwt_uid()),
  vv as (select x.* from viec x, me where x.nguoi_lam_id = me.ns),
  con as (
    select c.task_me_id, count(*)::integer as tong,
           (count(*) filter (where c.trang_thai = 'dat'))::integer as dat
    from viec c where c.task_me_id in (select vv.id from vv)
    group by c.task_me_id
  ),
  cn as (
    select c.viec_id, max(c.created_at) as cuoi,
           bool_or((c.created_at at time zone 'Asia/Ho_Chi_Minh')::date = h.d) as hom_nay
    from viec_cap_nhat c cross join h
    where c.viec_id in (select vv.id from vv)
    group by c.viec_id
  )
  select vv.id, vv.tieu_de, vv.trang_thai, vv.deadline, vv.task_me_id,
         vv.muc_tieu, vv.output, vv.mo_ta, vv.khoi_luong,
         ng.ho_ten, vv.phan_tram, vv.tien_do, vv.chat_luong,
         vv.so_lan_gia_han, vv.gia_han_xin_deadline, vv.ghi_chu_nghiem_thu, vv.evidence,
         coalesce(con.tong, 0), coalesce(con.dat, 0),
         (vv.trang_thai in ('moi_giao', 'dang_lam', 'tra_lai') and coalesce(con.tong, 0) = 0) as dang_mo,
         (vv.deadline is not null and vv.deadline < h.d and vv.trang_thai not in ('dat', 'huy', 'chuyen')) as qua_han,
         coalesce(cn.hom_nay, false),
         cn.cuoi,
         (select c2.tien_do_bao_cao from viec_cap_nhat c2
            where c2.viec_id = vv.id and c2.tien_do_bao_cao is not null
            order by c2.created_at desc limit 1),
         vv.created_at, vv.hoan_thanh_at
  from vv
  cross join h
  left join nhan_su ng on ng.id = vv.nguoi_giao_id
  left join con on con.task_me_id = vv.id
  left join cn on cn.viec_id = vv.id
  order by dang_mo desc, qua_han desc, vv.deadline asc nulls last, vv.created_at desc
$$;
revoke all on function public.fn_pt_viec_cua_toi() from public;
grant execute on function public.fn_pt_viec_cua_toi() to authenticated;
