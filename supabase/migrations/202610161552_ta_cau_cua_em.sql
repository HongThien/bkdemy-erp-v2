-- Thùy 16/10: "Bên app HS hiện câu hỏi nào thì app TA cũng có chỗ để nhìn đúng câu đó và nhìn được đáp án chi tiết để TA hỗ trợ, giảng cho HS dễ hơn mà không cần nháp."
-- fn_ta_cau_cua_em: các câu em ĐÃ ĐƯỢC ĐƯA trên app (luyện · test cuối ca · retest của bổ trợ yếu · luyện/test Đuổi · luyện/test Bù), mới nhất trước,
-- kèm đề (hình, lựa chọn, ngữ liệu) + đáp án đúng + LỜI GIẢI chi tiết + em đã chọn gì / đúng hay sai. Đọc từ bản chụp ở bai_test_cau (đúng cái em thấy).
-- Phạm vi: p_buoi = ca đang mở ⇒ bài gắn buổi đó + bài tạo trong khoảng [ngày buổi − p_so_ngay, ngày buổi] (Đuổi/Bù không gắn buổi); không có p_buoi ⇒ p_so_ngay ngày gần nhất.
-- dang_lam = câu em chưa trả lời đầu tiên của bài chưa nộp (câu em đang đứng ở app). Chỉ nhân sự.
create or replace function public.fn_ta_cau_cua_em(p_hoc_sinh uuid, p_buoi uuid default null, p_so_ngay integer default 0, p_gioi_han integer default 40)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_ngay date; v_tu date; v_den date; v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  v_den := coalesce((select b.ngay from buoi_hoc b where b.id = p_buoi), (now() at time zone 'Asia/Ho_Chi_Minh')::date);
  v_tu := v_den - greatest(0, least(coalesce(p_so_ngay, 0), 60));
  select coalesce(jsonb_agg(x.j order by x.tao desc, x.thu_tu), '[]'::jsonb) into v_out from (
    select bt.created_at as tao, c.thu_tu,
      jsonb_build_object(
        'bai_test_id', bt.id, 'loai_bai', bt.loai, 'tao_luc', bt.created_at, 'da_nop', coalesce(bl.trang_thai = 'da_nop', false),
        'bai_test_cau_id', c.id, 'thu_tu', c.thu_tu, 'ma_cau', c.ma_cau, 'ma_dang', c.ma_dang,
        'ten_dang', coalesce(public._kho_ten_dang(bt.mon, c.ma_dang), c.ma_dang),
        'loai_cau', c.loai_cau, 'noi_dung', c.noi_dung, 'lua_chon', c.lua_chon, 'menh_de', c.menh_de, 'anh_de', c.anh_de, 'ngu_lieu', c.ngu_lieu,
        'dap_an_key', c.dap_an_key, 'loi_giai', c.loi_giai, 'anh_dap_an', c.anh_dap_an,
        'dap_an_hs', blc.dap_an_hs, 'verdict', blc.verdict,
        'dang_lam', (blc.dap_an_hs is null and not coalesce(bl.trang_thai = 'da_nop', false)
                     and c.thu_tu = min(case when blc.dap_an_hs is null then c.thu_tu end) over (partition by bt.id))
      ) as j
    from bai_test bt
    join bai_test_cau c on c.bai_test_id = bt.id
    left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = p_hoc_sinh
    left join bai_lam_cau blc on blc.bai_lam_id = bl.id and blc.bai_test_cau_id = c.id
    where bt.hoc_sinh_id = p_hoc_sinh
      and bt.loai in ('bo_tro', 'bo_tro_test', 'retest', 'htd_luyen', 'htd_test', 'bu_luyen', 'bu_test')
      and (c.bien_the is null or bl.id is null or c.bien_the = coalesce(bl.bien_the, 1))
      and (bt.buoi_hoc_id is not distinct from p_buoi and p_buoi is not null
           or (bt.created_at at time zone 'Asia/Ho_Chi_Minh')::date between v_tu and v_den)
    order by bt.created_at desc, c.thu_tu
    limit greatest(1, least(coalesce(p_gioi_han, 40), 200))
  ) x;
  return v_out;
end $$;
revoke all on function public.fn_ta_cau_cua_em(uuid, uuid, integer, integer) from public, anon;
grant execute on function public.fn_ta_cau_cua_em(uuid, uuid, integer, integer) to authenticated, service_role;
