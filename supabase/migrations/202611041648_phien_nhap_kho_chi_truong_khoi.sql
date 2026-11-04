-- ============================================================================
-- 202611041648 — phien_nhap_kho_chi_truong_khoi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 04/11 — "Trợ giảng có phòng làm việc đâu. Trưởng khối trở lên mới có." Mig 202611041633 hiểu nhầm "nhân sự"
--   thành mọi nhân sự và mở phiên Nhập kho cho tất cả. Sửa lại: mọi loại phiên chỉ trưởng khối trở lên.
--   GIỮ: lệnh Claude đưa bài tập MỚI vào kho (fn_phien_kho_them) — đó mới là phần trưởng khối còn thiếu.
--   Cột claude_phien.sua_cau_truc giữ (luôn true từ nay; nhánh phiên-của-nhân-sự trong _phien_bd_vao / fn_phien_bd_ghi không còn đường vào).
--   Đo trước khi áp: 0 phiên nào có sua_cau_truc = false.
-- MẤT GÌ: không xoá/drop gì. Viết lại (create or replace) fn_phien_mo · fn_phien_pham_vi — THU HẸP ai mở được phiên.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_phien_mo(p_loai text, p_mon text, p_khoi text, p_tieu_de text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_id uuid; v_ns uuid := public.current_nhan_su_id(); v_ten text;
  v_dang record; v_tk boolean;
begin
  if v_ns is null or public.jwt_uid() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự.'; end if;
  if not (p_loai = any (public._phien_loai_dang_mo())) then
    raise exception 'Loại việc "%" chưa mở trong bản thử.', p_loai;
  end if;
  v_tk := public._truong_khoi_tro_len(p_mon, p_khoi);
  -- 04/11 (Thùy sửa lại): mọi loại phiên — kể cả Nhập kho — chỉ trưởng khối trở lên (người có Phòng làm việc).
  if not v_tk then
    raise exception 'Chỉ trưởng khối trở lên của % khối % mới mở phiên được.', p_mon, p_khoi;
  end if;
  if p_loai = 'nhap_kho' and not (p_mon = any (public._phien_kho_mon())) then
    raise exception 'Môn % chưa nối luồng phân dạng câu vào bản đồ mới (mới có Toán) — chưa mở phiên Nhập kho được.', p_mon;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) and not exists (select 1 from public._phien_bdm_bang(p_mon)) then
    raise exception 'Môn % chưa có bản đồ mới trên hệ — chưa mở phiên này được.', p_mon;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) and v_tk then
    -- Khoá theo (môn, khối) trong transaction: hai người bấm mở cùng lúc thì người sau chờ rồi thấy phiên của người trước.
    -- Chặn bằng khoá thay vì thêm index một-phiên cho mỗi loại việc mới.
    perform pg_advisory_xact_lock(hashtext('claude_phien:' || p_mon || '|' || p_khoi));
    select p.id, p.loai, ns.ho_ten into v_dang
      from claude_phien p left join nhan_su ns on ns.id = p.nhan_su_id
     where p.loai = any (public._phien_loai_sua_ban_do()) and p.sua_cau_truc and p.mon = p_mon and p.khoi = p_khoi and p.trang_thai <> 'dong'
     limit 1;
    if found then
      raise exception 'Bản đồ % khối % đang có một phiên % mở (của %). Mỗi bản đồ chỉ một phiên sửa — vào phiên đó, hoặc đóng nó trước.',
        p_mon, p_khoi, case v_dang.loai when 'ban_do' then 'Bản đồ' when 'ly_thuyet' then 'Lý thuyết' else 'Nhập kho' end, coalesce(v_dang.ho_ten, '?');
    end if;
  end if;
  v_ten := coalesce(nullif(trim(p_tieu_de), ''),
    case p_loai when 'ban_do' then 'Bản đồ' when 'ly_thuyet' then 'Lý thuyết dạng' when 'nhap_kho' then 'Nhập kho & phân dạng'
                when 'bao_sai' then 'Câu bị báo sai' else 'Giải bài' end
    || ' · ' || p_mon || ' ' || p_khoi);
  insert into claude_phien (loai, mon, khoi, tieu_de, nguoi_mo, nhan_su_id, sua_cau_truc)
  values (p_loai, p_mon, p_khoi, v_ten, public.jwt_uid(), v_ns, v_tk)
  returning id into v_id;
  return v_id;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_pham_vi()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- chỉ trưởng khối trở lên (Thùy 04/11); tk giữ trong kết quả cho client (luôn true)
  with ds as (select distinct p.mon, p.khoi, true as la_tk from public.fn_pham_vi_cua_toi() p where p.vai in ('toan_he', 'quan_ly_mon', 'truong'))
  select coalesce(jsonb_agg(jsonb_build_object('mon', d.mon, 'khoi', d.khoi, 'tk', d.la_tk,
                    'co_ban_do', exists (select 1 from public._phien_bdm_bang(d.mon)))
                  order by d.mon, coalesce(substring(d.khoi from '^[0-9]+')::int, 0), d.khoi), '[]'::jsonb)
    from ds d
$function$;
