-- Thùy 26/10: CHUẨN LẠI NHỊP ĐỘ bổ trợ yếu.
-- (1) Chốt tuần = ảnh chụp sáng THỨ 2 hằng tuần (bấm tay). (2) Mỗi tuần chốt = lượt mới + PHẦN CHƯA XỬ LÝ từ tuần trước (cộng dồn).
-- (3) Bổ trợ xong mà em CÒN DẠNG YẾU (trong các dạng đã học, trạng thái hiện tại vẫn Yếu) ⇒ vào "Đang theo dõi", KHÔNG quay lại xếp bổ trợ.
-- (4) Mỗi ca bổ trợ sống TỐI ĐA 14 NGÀY (tính từ lúc duyệt chính thức mở case): hết hạn ⇒ đóng case, và vào theo dõi nếu còn dạng yếu
--     (hoặc chưa học dạng nào ⇒ vào theo dõi để duyệt lại, không rơi mất). 46/55 case đang mở đã quá 14 ngày (tuổi TB 18 ngày, max 26) ⇒ chuyển hết sang theo dõi.
-- Hết hạn chạy LƯỜI: người đang đăng nhập (ERP Duyệt/Lịch phòng/Chốt tuần, app TA) gọi fn_btyeu_het_han_xu_ly — vì hàm đo dạng yếu đòi nhân sự đăng nhập, cron không gọi được.

-- ============ 1. Ràng buộc: nguồn theo dõi mới + kết quả case 'het_han' ============
alter table public.bo_tro_theo_doi drop constraint bo_tro_theo_doi_nguon_ck;
alter table public.bo_tro_theo_doi add constraint bo_tro_theo_doi_nguon_ck check (nguon in ('bao_dong', 'diem_thap', 'sau_bo_tro'));
alter table public.bo_tro_yeu drop constraint bo_tro_yeu_ket_qua_ck;
alter table public.bo_tro_yeu add constraint bo_tro_yeu_ket_qua_ck check (ket_qua is null or ket_qua in ('dat', 'mot_phan', 'chua_dat', 'bo', 'day_xong', 'het_han'));

-- ============ 2. Dạng CÒN YẾU của case = dạng ĐÃ HỌC trong case mà trạng thái hiện tại vẫn Yếu ============
-- Cùng định nghĩa "dạng yếu" lúc mở case (fn_btyeu_fill_dang_yeu): ca mở sau bật bản đồ mới ⇒ theo bản đồ mới, ca cũ theo bản đồ cũ.
create or replace function public._btyeu_dang_con_yeu(p_case uuid)
returns table(ma_dang text, ten_dang text, score numeric, n integer)
language plpgsql stable security definer set search_path to 'public' as $$
declare v_hs uuid; v_mon text; v_bd text;
begin
  select y.hoc_sinh_id, y.mon, y.ban_do into v_hs, v_mon, v_bd from bo_tro_yeu y where y.id = p_case;
  if v_hs is null then return; end if;
  return query
    select r.ma_dang, r.ten_dang, r.score, r.n
    from (select * from public.fn_btyeu_dang_yeu_2_cua_so_moi(v_hs, v_mon) where v_bd = 'moi'
          union all select * from public.fn_btyeu_dang_yeu_2_cua_so(v_hs, v_mon) where v_bd is distinct from 'moi') r
    where exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = p_case and d.ma_dang = r.ma_dang and d.day_at is not null);
end $$;

-- ============ 3. Đóng case ⇒ vào theo dõi nếu còn dạng yếu ============
-- p_bat_buoc: vào theo dõi dù không còn dạng yếu đo được (case hết hạn mà chưa học dạng nào · chuyển hàng loạt).
-- p_tinh_yeu = false: không đo (chạy ngoài phiên đăng nhập, vd migration).
create or replace function public._btyeu_vao_theo_doi_sau_case(p_case uuid, p_ly_do text, p_bat_buoc boolean default false, p_tinh_yeu boolean default true)
returns boolean
language plpgsql security definer set search_path to 'public' as $$
declare y record; v_yeu jsonb := '[]'::jsonb; v_da_hoc int; v_ds text; v_gc text; v_so int;
begin
  select * into y from bo_tro_yeu where id = p_case;
  if y.id is null then return false; end if;
  if exists (select 1 from bo_tro_theo_doi where hoc_sinh_id = y.hoc_sinh_id and mon = y.mon and trang_thai = 'theo_doi') then return false; end if; -- đã ở theo dõi
  select count(*) into v_da_hoc from bo_tro_yeu_dang where bo_tro_yeu_id = p_case and day_at is not null;
  if p_tinh_yeu then
    select coalesce(jsonb_agg(jsonb_build_object('ma_dang', t.ma_dang, 'ten_dang', t.ten_dang, 'score', t.score, 'n', t.n) order by t.score), '[]'::jsonb)
      into v_yeu from public._btyeu_dang_con_yeu(p_case) t;
  end if;
  v_so := jsonb_array_length(v_yeu);
  if v_so = 0 and not p_bat_buoc then return false; end if;
  select string_agg(x ->> 'ten_dang', '; ') into v_ds from (select x from jsonb_array_elements(v_yeu) x limit 6) s;
  v_gc := 'Sau bổ trợ yếu (' || p_ly_do || ')'
          || case when v_so > 0 then ' — còn yếu ' || v_so || ' dạng đã học: ' || v_ds || case when v_so > 6 then '…' else '' end
                  when v_da_hoc = 0 then ' — chưa học dạng nào trong ca' else '' end;
  insert into bo_tro_theo_doi (hoc_sinh_id, mon, vao_boi, nguon, ghi_chu, so_lieu_vao)
    values (y.hoc_sinh_id, y.mon, public.jwt_uid(), 'sau_bo_tro', v_gc,
            jsonb_build_object('chuyen_de', '[]'::jsonb,
              'et_btvn', case when p_tinh_yeu then public.fn_botro_et_btvn(y.hoc_sinh_id, 4) else jsonb_build_object('et', '[]'::jsonb, 'btvn', '[]'::jsonb) end,
              'sau_bo_tro', jsonb_build_object('case_id', p_case, 'ly_do', p_ly_do, 'dang_con_yeu', v_yeu, 'so_dang_da_hoc', v_da_hoc)));
  return true;
end $$;

-- ============ 4. Hết hạn 14 ngày ============
create or replace function public._btyeu_dong_case_het_han(p_case uuid, p_tinh_yeu boolean default true, p_bat_buoc boolean default false)
returns boolean
language plpgsql security definer set search_path to 'public' as $$
declare v_da_hoc int;
begin
  if not exists (select 1 from bo_tro_yeu where id = p_case and trang_thai = 'dang_xu') then return false; end if;
  select count(*) into v_da_hoc from bo_tro_yeu_dang where bo_tro_yeu_id = p_case and day_at is not null;
  perform public._btyeu_ket_thuc_case(p_case, public._btyeu_my_ns(), 'Hết hạn 14 ngày (mỗi ca bổ trợ tối đa 14 ngày)', now());
  update bo_tro_yeu set ket_qua = 'het_han' where id = p_case;
  perform public._btyeu_vao_theo_doi_sau_case(p_case, 'hết hạn 14 ngày', p_bat_buoc or v_da_hoc = 0, p_tinh_yeu);
  return true;
end $$;

-- Đóng mọi case quá 14 ngày (trừ case có buổi ĐANG diễn ra — em đã có mặt chưa hoàn tất: để ca xong rồi hết hạn lần gọi sau). Idempotent, rẻ khi không có gì hết hạn.
create or replace function public.fn_btyeu_het_han_xu_ly() returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare r record; v_dong int := 0;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('dong', 0); end if;
  if not pg_try_advisory_xact_lock(hashtext('btyeu_het_han_14_ngay')) then return jsonb_build_object('dong', 0, 'dang_chay', true); end if;
  for r in select y.id from bo_tro_yeu y
            where y.trang_thai = 'dang_xu' and y.created_at <= now() - interval '14 days'
              and not exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                               where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh = 'co_mat')
            order by y.created_at limit 200 loop
    if public._btyeu_dong_case_het_han(r.id) then v_dong := v_dong + 1; end if;
  end loop;
  return jsonb_build_object('dong', v_dong);
end $$;

revoke execute on function public._btyeu_dang_con_yeu(uuid), public._btyeu_vao_theo_doi_sau_case(uuid, text, boolean, boolean),
  public._btyeu_dong_case_het_han(uuid, boolean, boolean), public.fn_btyeu_het_han_xu_ly() from public, anon;
grant execute on function public.fn_btyeu_het_han_xu_ly() to authenticated;

-- ============ 6. Nối vào hàm đang chạy (dựng từ định nghĩa đang chạy) ============
CREATE OR REPLACE FUNCTION public.fn_btyeu_hoan_tat(p_buoi uuid, p_nhan_xet text, p_muc_ma text DEFAULT NULL::text, p_khong_test_ly_do text DEFAULT NULL::text, p_dang_day text[] DEFAULT NULL::text[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_test_da_nop boolean; v_co_test boolean; v_nx text; v_day text[]; v_muc smallint;
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
  -- muc PHẢI khớp chữ số đầu của muc_ma (buoi_danh_gia_muc_ma_khop_muc_chk) — cùng công thức MUC_CATALOG bên client.
  v_muc := case when p_muc_ma is null then null else left(p_muc_ma, 1)::smallint end;

  -- Thùy 29/09: dạng ĐÃ HỌC lấy từ DỮ LIỆU. Ca 📱 app (hoặc chưa chọn chế độ) = dạng em có làm ≥1 câu trong ca (cùng định nghĩa
  -- fn_btyeu_dong_ca) — BỎ QUA tick gửi lên (kể cả app TA bản cũ tick sẵn hết). Chỉ ca 📄 giấy mới dùng tick của TA.
  if (select hh.btyeu_che_do from buoi_hoc_hs hh where hh.id = b.buoi_hoc_hs_id) is distinct from 'giay' then
    select coalesce(array_agg(distinct t.ma_dang), '{}') into p_dang_day from public._btyeu_tien_do(p_buoi) t where t.so_cau > 0 and t.ma_dang is not null;
  end if;
  -- Thùy 24/09: buổi xong ⇒ case phải tiến. p_dang_day = dạng TA xác nhận ĐÃ DẠY buổi này (null = client cũ ⇒ giữ hành vi cũ).
  if p_dang_day is not null then
    update bo_tro_yeu_dang set day_at = null, day_buoi_id = null -- TA bỏ tick dạng máy tự đánh dấu ở buổi này
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi and dong_at is null and dat is null and not (ma_dang = any(p_dang_day));
    update bo_tro_yeu_dang set day_at = now(), day_buoi_id = p_buoi
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_at is null and dong_at is null and ma_dang = any(p_dang_day);
    update bo_tro_yeu_dang set dat = null -- retest trượt, dạy lại xong ⇒ chờ retest mới
      where bo_tro_yeu_id = b.bo_tro_yeu_id and dat = false and dong_at is null and ma_dang = any(p_dang_day);
    v_day := p_dang_day;
  else
    select coalesce(array_agg(ma_dang), '{}') into v_day from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi;
  end if;

  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, muc, muc_ma, graded_by, updated_at)
    values (p_buoi, b.hoc_sinh_id, v_nx, v_muc, p_muc_ma, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set nhan_xet = excluded.nhan_xet, muc = excluded.muc, muc_ma = excluded.muc_ma, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
  perform public._btyeu_bu_retest(p_buoi, v_day); -- mọi dạng vừa dạy đều có câu retest ⇒ không kẹt "Chờ retest"
  -- Thùy 29/09: bổ trợ yếu KẾT THÚC khi em hết dạng yếu + TA đóng ca. "Chờ đánh giá" là việc học thuật, luồng khác.
  -- Thùy 17/10: 1 TUẦN CHỈ BỔ TRỢ 1 LẦN — hoàn tất ca ⇒ case KẾT THÚC, kể cả chưa hết dạng yếu (tuần sau duyệt lại ở thứ 2). Việc khẩn giữa tuần = Bổ trợ Khẩn cấp.
  perform public._btyeu_ket_thuc_case(b.bo_tro_yeu_id, v_ns, 'Bổ trợ 1 lần/tuần — TA đóng ca ' || to_char(b.ngay, 'DD/MM') || case when exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)) then ' (còn dạng chưa dạy, xét lại tuần sau)' else '' end, now());
  -- Thùy 26/10: xong bổ trợ mà CÒN DẠNG YẾU (trong dạng đã học) ⇒ vào Đang theo dõi, KHÔNG quay lại xếp bổ trợ.
  perform public._btyeu_vao_theo_doi_sau_case(b.bo_tro_yeu_id, 'đóng ca ' || to_char(b.ngay, 'DD/MM'), false, true);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_botro_chot_tuan(p_mon text, p_ung_vien jsonb, p_theo_doi_cd jsonb DEFAULT '[]'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_id uuid; v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date; r record; n1 int := 0; n2 int := 0; n3 int := 0; v_prev record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if nullif(trim(coalesce(p_mon, '')), '') is null then raise exception 'Thiếu môn.'; end if;
  perform public.fn_btyeu_het_han_xu_ly(); -- 26/10: ca quá 14 ngày đóng + vào theo dõi TRƯỚC khi chụp ảnh tuần
  insert into bo_tro_chot_tuan (tuan, mon, chot_boi) values (v_tuan, p_mon, public.jwt_uid()) returning id into v_id;
  for r in select * from jsonb_to_recordset(coalesce(p_ung_vien, '[]'::jsonb)) as x(hoc_sinh_id uuid, lop text, khoi text, ly_do text[], kenh text[], uu_tien int, chuyen_de jsonb) loop
    insert into bo_tro_chot_tuan_hs (chot_id, hoc_sinh_id, loai, lop, khoi, ly_do, kenh, uu_tien, du_lieu)
      values (v_id, r.hoc_sinh_id, 'diem_thap', r.lop, r.khoi, coalesce(r.ly_do, '{}'), coalesce(r.kenh, '{}'), coalesce(r.uu_tien, 0),
              jsonb_build_object('chuyen_de', coalesce(r.chuyen_de, '[]'::jsonb), 'et_btvn', public.fn_botro_et_btvn(r.hoc_sinh_id)))
      on conflict do nothing;
    n1 := n1 + 1;
  end loop;
  for r in select td.hoc_sinh_id, td.id, coalesce(x.cd, '[]'::jsonb) as cd,
                  (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = td.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = td.mon limit 1) as lop,
                  (select hs.khoi from hoc_sinh hs where hs.id = td.hoc_sinh_id) as khoi
           from bo_tro_theo_doi td
           left join (select (e->>'hoc_sinh_id')::uuid as hs, e->'chuyen_de' as cd from jsonb_array_elements(coalesce(p_theo_doi_cd, '[]'::jsonb)) e) x on x.hs = td.hoc_sinh_id
           where td.mon = p_mon and td.trang_thai = 'theo_doi' loop
    insert into bo_tro_chot_tuan_hs (chot_id, hoc_sinh_id, loai, lop, khoi, du_lieu)
      values (v_id, r.hoc_sinh_id, 'theo_doi', r.lop, r.khoi, jsonb_build_object('chuyen_de', r.cd, 'et_btvn', public.fn_botro_et_btvn(r.hoc_sinh_id)))
      on conflict do nothing;
    n2 := n2 + 1;
  end loop;
  -- Thùy 26/10: mỗi tuần chốt = lượt mới + PHẦN CHƯA XỬ LÝ từ tuần trước. "Chưa xử lý" = đứng trong Điểm thấp của lần chốt cuối tuần trước,
  -- chưa vào theo dõi / bỏ qua / mở case từ sau lần chốt đó, và chưa có trong lượt mới. Ghi thẳng vào ảnh chụp tuần này ⇒ tuần sau tự nối tiếp.
  select c.id, c.chot_at, c.tuan into v_prev from bo_tro_chot_tuan c where c.mon = p_mon and c.tuan < v_tuan order by c.tuan desc, c.chot_at desc limit 1;
  if v_prev.id is not null then
    for r in select h.* from bo_tro_chot_tuan_hs h
              where h.chot_id = v_prev.id and h.loai = 'diem_thap'
                and not exists (select 1 from bo_tro_chot_tuan_hs x where x.chot_id = v_id and x.hoc_sinh_id = h.hoc_sinh_id and x.loai = 'diem_thap')
                and not exists (select 1 from bo_tro_theo_doi td where td.hoc_sinh_id = h.hoc_sinh_id and td.mon = p_mon and (td.trang_thai = 'theo_doi' or td.vao_at >= v_prev.chot_at))
                and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.hoc_sinh_id and y.mon = p_mon and (y.trang_thai = 'dang_xu' or y.created_at >= v_prev.chot_at)) loop
      insert into bo_tro_chot_tuan_hs (chot_id, hoc_sinh_id, loai, lop, khoi, ly_do, kenh, uu_tien, du_lieu)
        values (v_id, r.hoc_sinh_id, 'diem_thap', r.lop, r.khoi,
                array['Tồn từ tuần ' || to_char(v_prev.tuan, 'DD/MM') || ' — chưa xử lý'] || coalesce(array(select l from unnest(r.ly_do) l where l not like 'Tồn từ tuần%'), '{}'),
                r.kenh, r.uu_tien, jsonb_set(coalesce(r.du_lieu, '{}'::jsonb), '{et_btvn}', public.fn_botro_et_btvn(r.hoc_sinh_id)))
        on conflict do nothing;
      n3 := n3 + 1;
    end loop;
  end if;
  update bo_tro_chot_tuan set so_diem_thap = n1 + n3, so_theo_doi = n2 where id = v_id;
  return v_id;
end $function$;

-- ============ 5. MỘT LẦN: đóng mọi case đang mở quá 14 ngày và chuyển HẾT sang Đang theo dõi (Thùy 26/10: "chuyển hết sang") ============
-- Chạy ngoài phiên đăng nhập ⇒ không đo dạng yếu (p_tinh_yeu = false), vào theo dõi bắt buộc; Trang xem số liệu ở màn Đang theo dõi.
-- Bỏ qua case có buổi ĐANG diễn ra (em có mặt, chưa hoàn tất) — sẽ hết hạn ở lần fn_btyeu_het_han_xu_ly sau.
do $$
declare r record; n int := 0;
begin
  for r in select y.id from bo_tro_yeu y
            where y.trang_thai = 'dang_xu' and y.created_at <= now() - interval '14 days'
              and not exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                               where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh = 'co_mat')
            order by y.created_at loop
    if public._btyeu_dong_case_het_han(r.id, false, true) then n := n + 1; end if;
  end loop;
  raise notice 'Đã đóng % case quá 14 ngày và chuyển sang Đang theo dõi', n;
end $$;
