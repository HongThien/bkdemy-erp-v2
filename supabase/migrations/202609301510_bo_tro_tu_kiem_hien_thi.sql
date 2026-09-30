-- Thùy 30/09: "Check kĩ lại 1 lượt bổ trợ đi — đừng để hơi tý trợ giảng lại chạy vào báo không có ca. Tìm phương án chống lỗi."
-- (29/09 ca bù Minh Trí — Cường không thấy · 30/09 ca đuổi Khánh Chi — Huyền không thấy.)
-- TỰ KIỂM HIỂN THỊ: với MỌI ca bổ trợ (yếu · bù · đuổi) còn mở trong khoảng ngày, hệ ĐÓNG VAI đúng người (set jwt claims trong transaction)
-- rồi gọi ĐÚNG hàm mà app đang gọi, xem ca có ra không — không suy luận lại điều kiện (suy luận lại = kiểm bản sao, không kiểm thật):
--   TA đứng ca (nguoi_day_tg, chưa gán thì GV):  yếu → fn_btyeu_viec_cua_toi().ca · bù → fn_bu_ca_cua_toi() · đuổi → fn_duoi_ca_cua_toi()
--   từng HS trong ca:                              fn_hs_lich_bo_tro()
-- + điều kiện "cửa" trước đó: có người đứng ca · người đó còn làm · có tài khoản · có quyền màn Buổi học (app TA ẩn mọi ô nếu thiếu) · HS có tài khoản.
-- Trả { so_ca, loi: [{buoi_id, loai, ngay, gio, ta, hs, loi[]}] }. Claims gốc của người gọi được TRẢ LẠI cuối hàm.
-- Phạm vi: từ HÔM NAY trở đi (p_tu cũ hơn bị kéo về hôm nay).
-- Giới hạn đã biết: KHÔNG kiểm được tầng giao diện (ô cắt bớt dòng, cache app cũ) — tầng đó chặn bằng luật UI (ca hôm nay không bao giờ bị cắt).
create or replace function public.fn_bo_tro_tu_kiem(p_tu date default null, p_den date default null) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare v_goc text := current_setting('request.jwt.claims', true); v_tu date := greatest(coalesce(p_tu, public._btyeu_today()), public._btyeu_today()); -- chỉ ca từ HÔM NAY (ca đã qua: app HS không hiện lịch cũ, ca xong rời ô TA — đúng thiết kế)
        v_den date := coalesce(p_den, coalesce(p_tu, public._btyeu_today()) + 1);
        r record; h record; v_loi text[]; v_hs jsonb; v_n int := 0; v_out jsonb := '[]'::jsonb; v_tk uuid; v_email text; v_d jsonb; v_hs_loi text[];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  for r in
    select b.id, b.loai, b.ngay, b.gio_bat_dau, coalesce(b.nguoi_day_tg, b.nguoi_day) as owner, ns.ho_ten as ta, ns.trang_thai as ta_tt, ns.la_admin_he_thong as ta_admin
    from buoi_hoc b left join nhan_su ns on ns.id = coalesce(b.nguoi_day_tg, b.nguoi_day)
    where b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi') and b.trang_thai = 'mo' and b.ngay between v_tu and v_den
      and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
    order by b.ngay, b.gio_bat_dau
  loop
    v_n := v_n + 1; v_loi := '{}';
    -- ── phía TA
    if r.owner is null then v_loi := v_loi || 'Chưa gán người đứng ca';
    elsif r.ta_tt is distinct from 'dang_lam' then v_loi := v_loi || format('%s không còn ở trạng thái đang làm', r.ta);
    else
      select tk.id, tk.email into v_tk, v_email from tai_khoan tk where tk.nhan_su_id = r.owner order by tk.created_at limit 1;
      if v_tk is null then v_loi := v_loi || format('%s chưa có tài khoản đăng nhập', r.ta);
      else
        if not coalesce(r.ta_admin, false) and not exists (select 1 from vi_tri v join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
                                                          where v.nhan_su_id = r.owner and vc.chuc_nang = 'buoihoc') then
          v_loi := v_loi || format('%s thiếu quyền "Buổi học" — app TA ẩn mọi ô', r.ta);
        end if;
        perform set_config('request.jwt.claims', jsonb_build_object('sub', v_tk, 'email', v_email, 'role', 'authenticated')::text, true);
        begin
          v_d := case r.loai when 'bo_tro_yeu' then public.fn_btyeu_viec_cua_toi()->'ca'
                             when 'bu' then public.fn_bu_ca_cua_toi() else public.fn_duoi_ca_cua_toi() end;
          if not exists (select 1 from jsonb_array_elements(coalesce(v_d, '[]'::jsonb)) e where (e->>'buoi_id')::uuid = r.id) then
            v_loi := v_loi || format('App TA của %s KHÔNG hiện ca này', r.ta);
          end if;
        exception when others then v_loi := v_loi || format('App TA của %s lỗi khi tải: %s', r.ta, sqlerrm);
        end;
      end if;
    end if;
    -- ── phía HS (chỉ em chưa báo vắng)
    v_hs := '[]'::jsonb;
    for h in select hh.hoc_sinh_id, hs.ho_ten, (select tk.id from tai_khoan tk where tk.hoc_sinh_id = hh.hoc_sinh_id limit 1) as tk,
                    (select tk.email from tai_khoan tk where tk.hoc_sinh_id = hh.hoc_sinh_id limit 1) as email
             from buoi_hoc_hs hh join hoc_sinh hs on hs.id = hh.hoc_sinh_id
             where hh.buoi_hoc_id = r.id and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep')
    loop
      v_hs := v_hs || to_jsonb(h.ho_ten);
      if h.tk is null then v_loi := v_loi || format('%s chưa có tài khoản app HS', h.ho_ten);
      else
        perform set_config('request.jwt.claims', jsonb_build_object('sub', h.tk, 'email', h.email, 'role', 'authenticated')::text, true);
        begin
          if not exists (select 1 from jsonb_array_elements(coalesce(public.fn_hs_lich_bo_tro(), '[]'::jsonb)) e where (e->>'buoi_id')::uuid = r.id) then
            v_loi := v_loi || format('App HS của %s KHÔNG hiện lịch ca này', h.ho_ten);
          end if;
        exception when others then v_loi := v_loi || format('App HS của %s lỗi khi tải: %s', h.ho_ten, sqlerrm);
        end;
      end if;
    end loop;
    perform set_config('request.jwt.claims', coalesce(v_goc, ''), true);
    if array_length(v_loi, 1) > 0 then
      v_out := v_out || jsonb_build_object('buoi_id', r.id, 'loai', r.loai, 'ngay', r.ngay, 'gio', to_char(r.gio_bat_dau, 'HH24:MI'),
                                           'ta', r.ta, 'hs', v_hs, 'loi', to_jsonb(v_loi));
    end if;
  end loop;
  perform set_config('request.jwt.claims', coalesce(v_goc, ''), true);
  return jsonb_build_object('tu', v_tu, 'den', v_den, 'so_ca', v_n, 'loi', v_out);
end $$;
revoke all on function public.fn_bo_tro_tu_kiem(date, date) from public;
revoke execute on function public.fn_bo_tro_tu_kiem(date, date) from anon;
grant execute on function public.fn_bo_tro_tu_kiem(date, date) to authenticated;
