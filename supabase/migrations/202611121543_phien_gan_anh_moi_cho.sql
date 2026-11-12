-- ============================================================================
-- Phiên Claude: gắn / THAY ảnh ở MỌI chỗ ngoài câu kho — Thùy 12/11 ("trưởng khối được ra lệnh vẽ hình mới / vẽ lại hình
-- của lý thuyết, ví dụ, kho bài chưa")
--
-- Trước: phiên chỉ gắn ảnh được vào CÂU KHO (fn_phien_kho_anh: dai/hgt/khtn/lyhoa_cau_hoi + hinh_hoc_cau_hoi).
-- Thiếu: câu TRÊN LỚP (ví dụ giảng — dai_cau_lop · hinh_hoc_cau_lop), file kèm LÝ THUYẾT / VÍ DỤ của nhóm · dạng bài · bài Hình–Học,
-- ảnh bài kho Hình–Luyện (hinh_bai.anh_de), ảnh chuẩn bài trong cây (hinh_baitoan.anh_chuan), ảnh cấu hình mô hình (hinh_mo_hinh.anh_cau_hinh).
-- Một hàm, rào giống các lệnh phiên khác: phiên đang mở, đúng môn, đối tượng thuộc ĐÚNG khối phiên, URL ở bucket kho-anh,
-- ghi nhật ký claude_phien_ghi. Ghi đè ảnh cũ = VẼ LẠI (ảnh cũ vẫn nằm trên storage, không xoá).
-- ============================================================================

create or replace function public.fn_phien_anh_gan(p_phien uuid, p_ts jsonb)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  v_p claude_phien; b text; v_khoi text; v_n int;
  v_loai text := p_ts->>'loai'; v_id text := p_ts->>'id'; v_o text := coalesce(p_ts->>'o', 'de');
  v_url text := p_ts->>'url'; v_ten text := coalesce(nullif(p_ts->>'ten_file', ''), 'hinh.png');
begin
  v_p := public._phien_bd_vao(p_phien);
  if coalesce(v_url, '') !~ '^https://[^ ]+/storage/v1/object/public/kho-anh/' then raise exception 'URL ảnh phải nằm ở bucket kho-anh.'; end if;
  if nullif(btrim(coalesce(v_id, '')), '') is null then raise exception 'Thiếu id.'; end if;

  if v_loai = 'cau_lop' then   -- câu trên lớp (ví dụ giảng): Đại theo dạng bài NDB…, Hình–Học theo bài HH…
    if v_o not in ('de', 'dap_an', 'ca_hai') then raise exception 'o phải là de · dap_an · ca_hai.'; end if;
    if exists (select 1 from dai_cau_lop where ma_cau = v_id) then
      if v_p.mon <> 'Toán' then raise exception 'Câu % là câu Toán, phiên đang là %.', v_id, v_p.mon; end if;
      select cd.khoi into v_khoi from dai_cau_lop q join dai_bdm_dang_bai d on d.id = q.dang_bai_id
        join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where q.ma_cau = v_id;
      if v_khoi is distinct from v_p.khoi then raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', v_id, coalesce(v_khoi, '?'), v_p.khoi; end if;
      execute format('update dai_cau_lop set %s where ma_cau = $1',
        case v_o when 'de' then 'anh_de = $2' when 'dap_an' then 'anh_dap_an = $2' else 'anh_de = $2, anh_dap_an = $2' end) using v_id, v_url;
    elsif exists (select 1 from hinh_hoc_cau_lop where ma_cau = v_id) then
      if v_p.mon <> 'Toán' then raise exception 'Câu % là câu Toán, phiên đang là %.', v_id, v_p.mon; end if;
      select hb.khoi into v_khoi from hinh_hoc_cau_lop q join hinh_hoc_bai hb on hb.ma_bai = q.dang_bai_id where q.ma_cau = v_id;
      if v_khoi is distinct from v_p.khoi then raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', v_id, coalesce(v_khoi, '?'), v_p.khoi; end if;
      execute format('update hinh_hoc_cau_lop set %s where ma_cau = $1',
        case v_o when 'de' then 'anh_de = $2' when 'dap_an' then 'anh_dap_an = $2' else 'anh_de = $2, anh_dap_an = $2' end) using v_id, v_url;
    else
      raise exception 'Không có câu trên lớp mã % (câu kho thì dùng gan_anh).', v_id;
    end if;

  elsif v_loai in ('nhom', 'dang_bai') then   -- file kèm lý thuyết / ví dụ trên bản đồ mới
    if v_o not in ('ly_thuyet', 'vi_du') or (v_loai = 'nhom' and v_o <> 'ly_thuyet') then
      raise exception 'Ô ảnh cho phép: nhom.ly_thuyet · dang_bai.ly_thuyet|vi_du.';
    end if;
    select bang into b from public._phien_bdm_bang(v_p.mon);
    perform public._phien_bd_kiem_khoi(b, v_loai, v_id, v_p.khoi);
    execute format('update %I set %I = $2, %I = $3 where id = $1', b || v_loai, v_o || '_file_url', v_o || '_ten_file') using v_id, v_url, v_ten;

  elsif v_loai = 'hh_bai' then   -- bài học Hình–Học: chỉ có ô file kèm ví dụ
    if v_o <> 'vi_du' then raise exception 'Bài Hình–Học chỉ có ô ảnh vi_du.'; end if;
    if not exists (select 1 from hinh_hoc_bai where ma_bai = v_id and khoi = v_p.khoi) then raise exception 'Bài % không phải bài học Hình của khối %.', v_id, v_p.khoi; end if;
    update hinh_hoc_bai set vi_du_file_url = v_url, vi_du_ten_file = v_ten where ma_bai = v_id;

  elsif v_loai in ('hinh_bai', 'hinh_baitoan', 'mo_hinh') then   -- Hình–Luyện: bài kho · bài trong cây · cấu hình mô hình
    if v_p.mon <> 'Toán' then raise exception 'Hình–Luyện chỉ có ở phiên Toán.'; end if;
    v_khoi := public._phien_hinh_khoi(v_id);
    if v_khoi is distinct from v_p.khoi then raise exception '% % thuộc khối %, ngoài phạm vi phiên (khối %).', v_loai, v_id, coalesce(v_khoi, '?'), v_p.khoi; end if;
    if v_loai = 'hinh_bai' then update hinh_bai set anh_de = v_url where id = v_id::uuid;
    elsif v_loai = 'hinh_baitoan' then update hinh_baitoan set anh_chuan = v_url, updated_at = now() where id = v_id::uuid;
    else update hinh_mo_hinh set anh_cau_hinh = v_url where id = v_id::uuid; end if;

  else
    raise exception 'loai phải là cau_lop · nhom · dang_bai · hh_bai · hinh_bai · hinh_baitoan · mo_hinh (câu kho thì dùng gan_anh).';
  end if;

  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Không ghi được: không tìm thấy % %.', v_loai, v_id; end if;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'anh_gan', jsonb_build_object('loai', v_loai, 'id', v_id, 'o', v_o), jsonb_build_object('url', v_url));
  return jsonb_build_object('ok', true, 'loai', v_loai, 'id', v_id, 'o', v_o, 'url', v_url);
end $$;

revoke execute on function public.fn_phien_anh_gan(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.fn_phien_anh_gan(uuid, jsonb) to service_role;
