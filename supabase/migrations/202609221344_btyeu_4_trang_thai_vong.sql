-- Thùy 22/09 — VÒNG BỔ TRỢ YẾU có 4 trạng thái, "linh động":
--   Chờ duyệt (hàng đợi, chưa có case) → ĐANG BỔ TRỢ (case dang_xu, còn dạng cần dạy) → CHỜ RETEST (dạy hết, chờ retest vào buổi thường —
--   KHÔNG xếp lịch, chỉ báo app TA) → HOÀN THÀNH (retest xong hết + người đánh giá ca chốt). Đang bổ trợ mà có dạng yếu MỚI ⇒ vẫn đang bổ
--   trợ (dạng vào cùng case, máy tự gộp, nhãn "máy thêm"), vẫn hiện ở màn Xếp lịch. Đã hoàn thành mà yếu lại ⇒ case MỚI = vòng mới.
-- Không định mức dạng/buổi: đóng ca chốt dạng em có luyện, dạng chưa kịp trôi sang buổi sau; retest trượt ⇒ dạng cần dạy lại (cùng case).
-- MẤT GÌ: không. +1 cột (nguon dạng), +1 function, thay 1 function, vá 1 dòng fn_btyeu_dong_ca (reset `dat` khi dạy lại).
alter table public.bo_tro_yeu_dang add column if not exists nguon text not null default 'duyet' check (nguon in ('duyet', 'tay', 'may'));

-- Dạy LẠI dạng retest trượt (dat=false): khi đóng ca có luyện dạng đó ⇒ dat về NULL ("chưa retest lại") để trạng thái = chờ retest, không kẹt ở "cần dạy".
do $$
declare v_def text := pg_get_functiondef('public.fn_btyeu_dong_ca(uuid)'::regprocedure);
  v_anchor text := 'where bo_tro_yeu_id = b.bo_tro_yeu_id and day_at is null and ma_dang in (select distinct ma_dang from _luyen);';
begin
  if position('-- 22/09 dạy lại' in v_def) = 0 and position(v_anchor in v_def) > 0 then
    execute replace(v_def, v_anchor, v_anchor || E'\n  -- 22/09 dạy lại: dạng retest trượt được luyện lại trong ca này ⇒ chờ retest mới\n  update bo_tro_yeu_dang set dat = null where bo_tro_yeu_id = b.bo_tro_yeu_id and dat = false and dong_at is null and ma_dang in (select distinct ma_dang from _luyen);');
  end if;
end $$;

-- MÁY TỰ GỘP dạng yếu mới vào case ĐANG BỔ TRỢ (em đã được duyệt bổ trợ ⇒ thêm dạng không cần duyệt lại). Gate = đúng gate "diện bổ trợ"
-- của engine (muc yếu + n ≥ 3 lần đo), mastery từ fn_mastery_cells (gộp BTVN như màn Nội dung gợi ý). Idempotent; trả về đã thêm gì.
create or replace function public.fn_btyeu_gop_dang_may(p_mon text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu'),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs), true) c
            where c.muc = 'yeu' and c.n >= 3)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id
      join %1$I bd on bd.ma_dang = m.ma_dang
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
    $q$, v_bd) using v_mon loop
      insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
        values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
      if found then v_n := v_n + 1; v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'score', r.score); end if;
    end loop;
  end loop;
  return jsonb_build_object('them', v_n, 'chi_tiet', v_out);
end $$;
grant execute on function public.fn_btyeu_gop_dang_may(text) to authenticated;

-- Danh sách case cho màn Xếp: MỌI case đang mở có dạng — kèm giai_doan (dang_bo_tro | cho_retest | hoan_thanh), đếm dạng theo trạng thái, vòng, retest sắp tới.
create or replace function public.fn_btyeu_case_xep_lich(p_mon text default null) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(x order by x_uu desc, x_tao), '[]'::jsonb) end
  from (
    select y.uu_tien as x_uu, y.created_at as x_tao, jsonb_build_object(
      'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
      'nguon', y.nguon, 'ly_do', y.ly_do, 'created_at', y.created_at, 'uu_tien', y.uu_tien,
      'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
      'vong', 1 + (with recursive ch as (select y.case_truoc_id as id union all select p.case_truoc_id from bo_tro_yeu p join ch on p.id = ch.id where p.case_truoc_id is not null)
                   select count(*) from ch where id is not null),
      'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong, 'so_dang_may', dc.may,
      'so_dang_chua_day', dc.can_day, -- tương thích client cũ
      'giai_doan', case when dc.can_day > 0 then 'dang_bo_tro' when dc.cho_retest > 0 then 'cho_retest' else 'hoan_thanh' end,
      'so_buoi_da_hoc', (select count(*) from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                          where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and (b.trang_thai = 'hoan_tat' or b.danh_gia_xong_at is not null)),
      'buoi_cho_hoc', ch.j,
      'so_dang_moi_sau_xep', case when ch.xep_at is null then 0 else (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.created_at > ch.xep_at) end,
      'retest_ngay', (select min(t.ngay) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                        and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id))
    ) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong,
             count(*) filter (where d.nguon = 'may' and d.day_at is null) as may
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc on true
    left join lateral (
      select b.created_at as xep_at, jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc,
               'phong', b.phong, 'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'diem_danh', hh.diem_danh,
               'qua_ngay', b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date) as j
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    where y.trang_thai = 'dang_xu' and (p_mon is null or y.mon = p_mon) and dc.tong > 0
  ) s
$$;
