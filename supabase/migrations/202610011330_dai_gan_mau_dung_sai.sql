-- ============================================================================
-- 202610011330 — dai_gan_mau_dung_sai
-- ----------------------------------------------------------------------------
-- CEO 01/10 (sau khi gán xong mẫu 60 câu): "m đang để lẫn câu đúng sai vào trả lời ngắn. Đúng sai là 1 kiểu câu
-- hỏi riêng, vì có 4 mệnh đề — 4 mệnh đề đấy là 4 dạng khác nhau luôn."
-- Sai của bản 202609292119: mẫu trộn câu Đúng/Sai và bắt gán MỘT dạng cho cả câu. Model Đ/S của kho (v2) là
-- mỗi MỆNH ĐỀ một dạng (`dai_cau_hoi.menh_de[i].ma_dang` → trigger đồng bộ sang `dai_cau_menh_de`, khoá tự nhiên
-- (ma_cau_cha, thu_tu)); dạng của mệnh đề có thể thuộc CHUYÊN ĐỀ KHÁC với câu cha.
--
-- Sửa:
--   1. fn_dai_gan_mau_ds (giữ chữ ký)  → mẫu CÂU chỉ gồm câu KHÔNG phải Đúng/Sai. Thứ tự md5 không đổi ⇒ 44 câu
--      CEO đã gán vẫn nằm trong mẫu, mẫu tự lấy thêm 16 câu kế tiếp cho đủ 60.
--   2. fn_dai_gan_mau_ds_dung_sai      → mẫu câu Đúng/Sai (mặc định 15 câu = 60 mệnh đề), kèm dạng từng mệnh đề.
--   3. fn_dai_gan_mau_menh_de          → gán dạng cho MỘT mệnh đề (ghi vào jsonb của câu cha; trigger đồng bộ + ghi vết).
-- 16 câu Đ/S CEO đã gán ở cấp câu: GIỮ NGUYÊN `dang_chinh` (với Đ/S đó là "dạng nhà" của câu, không dùng để đo);
-- chúng chỉ không còn nằm trong bộ đề chấm cấp câu.
-- MẤT GÌ: không — không xoá dòng nào, không drop hàm nào (hàm 1 thay thân, cùng chữ ký).
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- 1) Mẫu CÂU: bỏ Đúng/Sai
create or replace function public.fn_dai_gan_mau_ds(p_ma_chuyen_de text, p_so int default 60)
returns table (
  thu_tu int, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text,
  anh_de text, dang_chinh text, ten_dang text, da_duyet boolean, ten_de_goc text,
  de_xuat_cho jsonb
)
language sql stable set search_path = public as $$
  with mau as (
    select q.*, b.ten_dang, row_number() over (order by md5(q.ma_cau))::int rn
      from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
     where b.ma_chuyen_de = p_ma_chuyen_de and q.xoa_at is null and q.loai_cau <> 'dung_sai'
  )
  select m.rn, m.ma_cau, m.loai_cau, m.noi_dung, to_jsonb(m.lua_chon), m.menh_de, m.dap_an, m.loi_giai,
         m.anh_de, m.dang_chinh, m.ten_dang, m.da_duyet, m.ten_de_goc,
         (select jsonb_build_object('id', d.id, 'loai', d.loai, 'ly_do', d.ly_do)
            from dai_de_xuat_cau c join dai_de_xuat d on d.id = c.de_xuat_id
           where c.ma_cau = m.ma_cau and not exists (select 1 from dai_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id)
           order by d.created_at desc limit 1)
    from mau m
   where m.rn <= least(greatest(p_so, 1), 200)
   order by m.rn
$$;

-- 2) Mẫu ĐÚNG/SAI: mỗi câu kèm danh sách mệnh đề (thứ tự, nội dung, Đ/S, lời giải, dạng hiện tại)
create or replace function public.fn_dai_gan_mau_ds_dung_sai(p_ma_chuyen_de text, p_so int default 15)
returns table (
  thu_tu int, ma_cau text, noi_dung text, anh_de text, ten_de_goc text, da_duyet boolean,
  menh_de jsonb,        -- [{thu_tu, noi_dung, dap_an 'D'|'S', loi_giai, ma_dang, ten_dang, ten_chuyen_de, da_duyet}]
  de_xuat_cho jsonb     -- [{id, ly_do}] các đề xuất CHƯA quyết mà câu này làm chứng (người ghi "mệnh đề … không khớp")
)
language sql stable set search_path = public as $$
  with mau as (
    select q.*, row_number() over (order by md5(q.ma_cau))::int rn
      from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
     where b.ma_chuyen_de = p_ma_chuyen_de and q.xoa_at is null and q.loai_cau = 'dung_sai'
       and jsonb_typeof(q.menh_de) = 'array'
  )
  select m.rn, m.ma_cau, m.noi_dung, m.anh_de, m.ten_de_goc, m.da_duyet,
         (select jsonb_agg(jsonb_build_object(
                   'thu_tu', t.ord::int, 'noi_dung', t.elem->>'noi_dung', 'dap_an', t.elem->>'dap_an', 'loi_giai', t.elem->>'loi_giai',
                   'ma_dang', coalesce(c.dang_chinh, t.elem->>'ma_dang'),
                   'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de, 'da_duyet', coalesce(c.da_duyet, false)) order by t.ord)
            from jsonb_array_elements(m.menh_de) with ordinality t(elem, ord)
            left join dai_cau_menh_de c on c.ma_cau_cha = m.ma_cau and c.thu_tu = t.ord::int and c.xoa_at is null
            left join dai_ban_do bd on bd.ma_dang = coalesce(c.dang_chinh, t.elem->>'ma_dang')),
         (select jsonb_agg(jsonb_build_object('id', d.id, 'ly_do', d.ly_do) order by d.created_at)
            from dai_de_xuat_cau dc join dai_de_xuat d on d.id = dc.de_xuat_id
           where dc.ma_cau = m.ma_cau and not exists (select 1 from dai_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id))
    from mau m
   where m.rn <= least(greatest(p_so, 1), 100)
   order by m.rn
$$;
revoke all on function public.fn_dai_gan_mau_ds_dung_sai(text, int) from public, anon;
grant execute on function public.fn_dai_gan_mau_ds_dung_sai(text, int) to authenticated;

-- 3) Gán dạng cho MỘT mệnh đề. Danh tính mệnh đề = (ma_cau, thu_tu) — khoá tự nhiên của bảng con.
--    Ghi vào jsonb của câu cha (nguồn), trigger trg_sync_menh_de đẩy sang dai_cau_menh_de và trg_log_doi_dang ghi vết người gán.
--    Dạng đích: bất kỳ dạng Đại nào đang có (mệnh đề được phép thuộc chuyên đề khác câu cha), trừ dạng chờ.
create or replace function public.fn_dai_gan_mau_menh_de(p_ma_cau text, p_thu_tu int, p_ma_dang text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_md   jsonb;
  v_cu   text;
  v_dich dai_ban_do%rowtype;
begin
  if public.current_nhan_su_id() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự' using errcode = 'insufficient_privilege'; end if;
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền sửa Bản đồ kiến thức' using errcode = 'insufficient_privilege'; end if;

  select q.menh_de into v_md from dai_cau_hoi q
   where q.ma_cau = p_ma_cau and q.xoa_at is null and q.loai_cau = 'dung_sai' for update;
  if not found then raise exception 'Câu Đúng/Sai "%" không tồn tại', p_ma_cau; end if;
  if jsonb_typeof(v_md) <> 'array' or p_thu_tu < 1 or p_thu_tu > jsonb_array_length(v_md) then
    raise exception 'Câu "%" không có mệnh đề thứ %', p_ma_cau, p_thu_tu;
  end if;
  if exists (select 1 from dai_cau_menh_de c where c.ma_cau_cha = p_ma_cau and c.thu_tu = p_thu_tu and c.da_duyet) then
    raise exception 'Mệnh đề % của câu "%" đã duyệt — đổi dạng ở màn Duyệt Đúng/Sai', p_thu_tu, p_ma_cau;
  end if;

  select * into v_dich from dai_ban_do where ma_dang = p_ma_dang;
  if not found then raise exception 'Dạng "%" không tồn tại', p_ma_dang; end if;
  if public._kho_la_dang_cho(p_ma_dang) then raise exception 'Không gán về dạng chờ'; end if;

  v_cu := v_md -> (p_thu_tu - 1) ->> 'ma_dang';
  if v_cu is distinct from p_ma_dang then
    update dai_cau_hoi
       set menh_de = jsonb_set(v_md, array[(p_thu_tu - 1)::text, 'ma_dang'], to_jsonb(p_ma_dang), true)
     where ma_cau = p_ma_cau;
  end if;
  return jsonb_build_object('ma_cau', p_ma_cau, 'thu_tu', p_thu_tu, 'dang_cu', v_cu, 'ma_dang', p_ma_dang,
                            'ten_dang', v_dich.ten_dang, 'ten_chuyen_de', v_dich.ten_chuyen_de);
end $$;
revoke all on function public.fn_dai_gan_mau_menh_de(text, int, text) from public, anon;
grant execute on function public.fn_dai_gan_mau_menh_de(text, int, text) to authenticated;
