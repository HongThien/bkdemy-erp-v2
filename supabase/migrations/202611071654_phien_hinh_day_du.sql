-- ============================================================================
-- 202611071654 — phien_hinh_day_du
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 07/11 — "Trưởng khối cần có mọi quyền cho bản đồ, bao gồm cả Hình, giải tích và đại". Phiên đã phủ Đại (vùng toan) +
--   Hình giải tích (vùng hgt) cả bản đồ lẫn kho câu; HÌNH thì chưa có gì: Hình–Học (77 bài học hinh_hoc_bai, câu HHC) và
--   Hình–Luyện (cây mô hình, ~60 hàm fn_hl_* / fn_hh_* màn sửa tay đang dùng).
-- CÁCH (không viết lại logic Hình):
--   • fn_phien_hinh_goi(phiên, hàm, tham số) — Claude gọi ĐÚNG các hàm fn_hl_* / fn_hh_* (đọc + ghi) với tên tham số của hàm.
--     Rào: phiên Toán, người mở phiên trưởng khối trở lên (đóng vai họ), MỌI giá trị là mã Hình (mô hình · bài toán · bài luyện · ý ·
--     bài học · câu · nhóm mô hình · chủ đề) phải thuộc khối phiên (_phien_hinh_khoi), p_khoi = khối phiên.
--   • fn_phien_hh_xem + fn_phien_hh_bai (them · sua tên/mô tả/ví dụ/lý thuyết/chủ đề/thứ tự · xoa) cho bài học Hình–Học
--     (màn sửa tay ghi thẳng bảng, không có RPC).
--   • Kho câu Hình–Học vào các lệnh kho sẵn có: _phien_kho_cau nhận câu HHC ⇒ duyet_cau / sua_cau / gan_anh / kho_rac chạy cho Hình;
--     duyet_cau thêm {"ma_bai"} (cả bài); them_cau nhận "nhanh":"hinh_hoc" + "ma_bai".
-- MẤT GÌ: không xoá/drop gì. Thêm 4 hàm. Viết lại (create or replace) _phien_kho_cau · fn_phien_kho_duyet · fn_phien_kho_them — nhánh cũ giữ nguyên.
-- ============================================================================

-- ── 1. Khối của một mã Hình bất kỳ (mô hình · bài toán · bài luyện · ý · bài học · câu HHC · nhóm mô hình · chủ đề) ──
create or replace function public._phien_hinh_khoi(p_v text)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    (select m.khoi from hinh_mo_hinh m where m.id::text = p_v),
    (select m.khoi from hinh_baitoan b join hinh_mo_hinh m on m.id = b.mo_hinh_id where b.id::text = p_v),
    (select b.khoi from hinh_bai b where b.id::text = p_v),
    (select b.khoi from hinh_y y join hinh_bai b on b.id = y.bai_id where y.id::text = p_v),
    (select hb.khoi from hinh_hoc_bai hb where hb.ma_bai = p_v),
    (select hb.khoi from hinh_hoc_cau_hoi c join hinh_hoc_bai hb on hb.ma_bai = c.dang_chinh where c.ma_cau = p_v),
    (select cd.khoi from hinh_nhom_mo_hinh n join dai_bdm_chu_de cd on cd.id = n.chu_de_id where n.id::text = p_v),
    (select cd.khoi from dai_bdm_chu_de cd where cd.id = p_v and cd.nhanh = 'hinh'))
$$;

-- ── 2. Cổng gọi hàm Hình (fn_hl_* · fn_hh_*) — đúng các hàm màn sửa tay đang dùng ──────────────
-- p_args: {"p_ten_tham_so": giá trị, …} theo đúng tên tham số của hàm (mảng JSON cho tham số mảng). Thiếu tham số ⇒ dùng mặc định.
-- Rào: phiên Toán, người mở phiên là trưởng khối trở lên (đóng vai họ); MỌI giá trị là mã Hình phải thuộc khối của phiên; p_khoi = khối phiên.
create or replace function public.fn_phien_hinh_goi(p_phien uuid, p_ham text, p_args jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; f record; i int; v_ten text; v_kieu regtype; v_mang boolean; v_ds text[] := '{}'; v_gt text; v_k text; v jsonb;
begin
  v_p := public._phien_bd_vao(p_phien);
  if v_p.mon <> 'Toán' then raise exception 'Lệnh Hình chỉ có ở phiên Toán.'; end if;
  if coalesce(p_ham, '') !~ '^fn_(hl|hh)_[a-z0-9_]+$' then raise exception 'Chỉ gọi được hàm Hình fn_hl_* / fn_hh_*.'; end if;
  select p.oid, p.proargnames, p.proargtypes::oid[] as kieu, p.prorettype, p.pronargs into f
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = p_ham;
  if f.oid is null then raise exception 'Không có hàm %.', p_ham; end if;
  p_args := coalesce(p_args, '{}'::jsonb);
  for v_ten in select jsonb_object_keys(p_args) loop
    if not (v_ten = any (f.proargnames[1:f.pronargs])) then raise exception 'Hàm % không có tham số % (có: %).', p_ham, v_ten, array_to_string(f.proargnames[1:f.pronargs], ', '); end if;
  end loop;
  for i in 1 .. f.pronargs loop
    v_ten := f.proargnames[i];
    continue when not (p_args ? v_ten);
    v_kieu := f.kieu[array_lower(f.kieu, 1) + i - 1]::regtype;   -- oidvector đánh số từ 0
    v_mang := (select t.typcategory = 'A' from pg_type t where t.oid = v_kieu::oid);
    -- rào khối: giá trị (hoặc từng phần tử) là mã Hình ⇒ phải đúng khối phiên
    for v_gt in select x from (select jsonb_array_elements_text(p_args->v_ten) x where jsonb_typeof(p_args->v_ten) = 'array'
                               union all select p_args->>v_ten where jsonb_typeof(p_args->v_ten) in ('string', 'number')) s loop
      if v_ten = 'p_khoi' and v_gt <> v_p.khoi then raise exception 'p_khoi = % khác khối phiên (%).', v_gt, v_p.khoi; end if;
      v_k := public._phien_hinh_khoi(v_gt);
      if v_k is not null and v_k <> v_p.khoi then raise exception '% = % thuộc khối %, ngoài phạm vi phiên (khối %).', v_ten, v_gt, v_k, v_p.khoi; end if;
    end loop;
    v_ds := v_ds || case when v_mang then format('%I => array(select jsonb_array_elements_text($1->%L))::%s', v_ten, v_ten, v_kieu)
                         else format('%I => ($1->>%L)::%s', v_ten, v_ten, v_kieu) end;
  end loop;
  if f.prorettype = 'void'::regtype then
    execute format('select %I(%s)', p_ham, array_to_string(v_ds, ', ')) using p_args;
    v := jsonb_build_object('ok', true);
  else
    execute format('select coalesce(jsonb_agg(to_jsonb(t)), ''[]''::jsonb) from %I(%s) t', p_ham, array_to_string(v_ds, ', ')) into v using p_args;
  end if;
  if (select provolatile from pg_proc where oid = f.oid) = 'v' then
    insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua) values (p_phien, 'hinh:' || p_ham, p_args, jsonb_build_object('kq', left(v::text, 4000)));
  end if;
  return v;
exception when invalid_text_representation then
  raise exception 'Gọi % lỗi: %', p_ham, sqlerrm;
end $$;

-- ── 3. Bài học Hình–Học: xem · thêm · sửa (tên, mô tả, ví dụ, lý thuyết, chủ đề, thứ tự) · xoá ──────────
create or replace function public.fn_phien_hh_xem(p_phien uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  v_p := public._phien_bd_vao(p_phien);
  if v_p.mon <> 'Toán' then raise exception 'Hình–Học chỉ có ở phiên Toán.'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'ma_bai', b.ma_bai, 'ten_bai', b.ten_bai, 'thu_tu', b.thu_tu, 'chu_de_id', b.chu_de_id, 'chu_de', cd.ten,
      'mo_ta', b.mo_ta, 'ky_tu_vi_du', length(coalesce(b.vi_du, '')), 'ky_tu_ly_thuyet', length(coalesce(lt.noi_dung, '')),
      'so_cau', (select count(*) from hinh_hoc_cau_hoi c where c.dang_chinh = b.ma_bai and c.xoa_at is null),
      'so_cau_duyet', (select count(*) from hinh_hoc_cau_hoi c where c.dang_chinh = b.ma_bai and c.xoa_at is null and c.da_duyet)
    ) order by b.thu_tu, b.ma_bai)
    from hinh_hoc_bai b left join dai_bdm_chu_de cd on cd.id = b.chu_de_id left join hinh_hoc_bai_ly_thuyet lt on lt.ma_bai = b.ma_bai
   where b.khoi = v_p.khoi), '[]'::jsonb);
end $$;

create or replace function public.fn_phien_hh_bai(p_phien uuid, p_viec text, p_ts jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; v_ma text := p_ts->>'ma_bai'; v_n int; v_kq jsonb;
begin
  v_p := public._phien_bd_vao(p_phien);
  if v_p.mon <> 'Toán' then raise exception 'Hình–Học chỉ có ở phiên Toán.'; end if;
  if p_ts ? 'chu_de_id' and p_ts->>'chu_de_id' is not null
     and not exists (select 1 from dai_bdm_chu_de where id = p_ts->>'chu_de_id' and khoi = v_p.khoi and nhanh = 'hinh') then
    raise exception 'Chủ đề % không phải chủ đề Hình của khối %.', p_ts->>'chu_de_id', v_p.khoi;
  end if;
  if p_viec <> 'them' and not exists (select 1 from hinh_hoc_bai where ma_bai = v_ma and khoi = v_p.khoi) then
    raise exception 'Bài % không phải bài học Hình của khối %.', coalesce(v_ma, '?'), v_p.khoi;
  end if;
  if p_viec = 'them' then
    if nullif(btrim(coalesce(p_ts->>'ten_bai', '')), '') is null then raise exception 'Thiếu ten_bai.'; end if;
    insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, chu_de_id, mo_ta, muc_do)
    values (v_p.khoi, btrim(p_ts->>'ten_bai'),
            coalesce((p_ts->>'thu_tu')::int, (select coalesce(max(thu_tu), 0) + 1 from hinh_hoc_bai where khoi = v_p.khoi)),
            p_ts->>'chu_de_id', coalesce(p_ts->>'mo_ta', ''), (p_ts->>'muc_do')::smallint)
    returning ma_bai into v_ma;
    v_kq := jsonb_build_object('ma_bai', v_ma);
  elsif p_viec = 'sua' then
    update hinh_hoc_bai set
      ten_bai   = case when p_ts ? 'ten_bai' then coalesce(nullif(btrim(p_ts->>'ten_bai'), ''), ten_bai) else ten_bai end,
      mo_ta     = case when p_ts ? 'mo_ta' then coalesce(p_ts->>'mo_ta', '') else mo_ta end,
      vi_du     = case when p_ts ? 'vi_du' then p_ts->>'vi_du' else vi_du end,
      chu_de_id = case when p_ts ? 'chu_de_id' then p_ts->>'chu_de_id' else chu_de_id end,
      thu_tu    = case when p_ts ? 'thu_tu' then (p_ts->>'thu_tu')::int else thu_tu end,
      muc_do    = case when p_ts ? 'muc_do' then (p_ts->>'muc_do')::smallint else muc_do end
     where ma_bai = v_ma;
    if p_ts ? 'ly_thuyet' then
      insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung, cap_nhat_at) values (v_ma, coalesce(p_ts->>'ly_thuyet', ''), now())
      on conflict (ma_bai) do update set noi_dung = excluded.noi_dung, cap_nhat_at = now();
    end if;
    v_kq := jsonb_build_object('ma_bai', v_ma);
  elsif p_viec = 'xoa' then
    select count(*) into v_n from hinh_hoc_cau_hoi where dang_chinh = v_ma;
    if v_n > 0 then raise exception 'Bài % còn % câu — chuyển câu sang bài khác (hinh fn_hh_cau_chuyen_dang) hoặc đưa vào kho rác rồi xoá.', v_ma, v_n; end if;
    delete from hinh_hoc_bai where ma_bai = v_ma;
    v_kq := jsonb_build_object('ma_bai', v_ma, 'xoa', true);
  else
    raise exception 'viec phải là them · sua · xoa.';
  end if;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua) values (p_phien, 'hh_bai_' || p_viec, p_ts, v_kq);
  return jsonb_build_object('ok', true) || v_kq;
end $$;

revoke execute on function public._phien_hinh_khoi(text), public.fn_phien_hinh_goi(uuid, text, jsonb),
  public.fn_phien_hh_xem(uuid), public.fn_phien_hh_bai(uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.fn_phien_hinh_goi(uuid, text, jsonb), public.fn_phien_hh_xem(uuid),
  public.fn_phien_hh_bai(uuid, text, jsonb) to service_role;

-- ── 4. Kho câu Hình–Học vào các lệnh kho sẵn có ──
CREATE OR REPLACE FUNCTION public._phien_kho_cau(p_p claude_phien, p_ma_cau text)
 RETURNS TABLE(tbl text, nhanh text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v_q jsonb; v_khoi text;
begin
  for r in select * from public._phien_kho_nhanh_ds() loop
    if (r.nhanh = 'khtn') <> (p_p.mon = 'KHTN') then continue; end if;
    execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', r.cau) into v_q using p_ma_cau;
    if v_q is not null then
      execute format('select khoi from %I where ma_dang = $1', r.ban_do_cu) into v_khoi using v_q->>'dang_chinh';
      if v_khoi is distinct from p_p.khoi then
        raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi;
      end if;
      tbl := r.cau; nhanh := r.nhanh; return next; return;
    end if;
  end loop;
  -- 07/11: kho Hình–Học (câu HHC…, dạng = bài học hinh_hoc_bai) — phiên Toán
  if p_p.mon = 'Toán' then
    select hb.khoi into v_khoi from hinh_hoc_cau_hoi c join hinh_hoc_bai hb on hb.ma_bai = c.dang_chinh where c.ma_cau = p_ma_cau;
    if found then
      if v_khoi is distinct from p_p.khoi then
        raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi;
      end if;
      tbl := 'hinh_hoc_cau_hoi'; nhanh := 'hinh_hoc'; return next; return;
    end if;
  end if;
  raise exception 'Không có câu % trong kho % của phiên.', p_ma_cau, p_p.mon;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_kho_duyet(p_phien uuid, p_ts jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; v_ma text[]; m text; c record; v_duyet boolean := coalesce((p_ts->>'duyet')::boolean, true);
        v_ok int := 0; v_loi int := 0; v_kq jsonb := '[]'::jsonb; b text; v_gan text[]; v_tmp text[];
begin
  v_p := public._phien_kho_vao(p_phien);
  select bang into b from public._phien_bdm_bang(v_p.mon);
  v_gan := case when v_p.mon = 'KHTN' then array['khtn_bdm_gan_cau'] else array['dai_bdm_gan_cau', 'hgt_bdm_gan_cau'] end;
  if jsonb_typeof(p_ts->'ma_cau') = 'array' then
    v_ma := array(select jsonb_array_elements_text(p_ts->'ma_cau'));
  elsif p_ts ? 'ma_bai' then   -- 07/11: cả một bài học Hình–Học
    if not exists (select 1 from hinh_hoc_bai where ma_bai = p_ts->>'ma_bai' and khoi = v_p.khoi) then
      raise exception 'Bài % không phải bài học Hình của khối %.', p_ts->>'ma_bai', v_p.khoi;
    end if;
    v_ma := array(select hc.ma_cau from hinh_hoc_cau_hoi hc where hc.dang_chinh = p_ts->>'ma_bai' and hc.xoa_at is null and hc.parent_ma_cau is null);
  elsif p_ts ? 'dang_bai_id' or p_ts ? 'nhom_id' then
    if p_ts ? 'dang_bai_id' then perform public._phien_bd_kiem_khoi(b, 'dang_bai', p_ts->>'dang_bai_id', v_p.khoi);
    else perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_p.khoi); end if;
    v_ma := '{}';
    foreach m in array v_gan loop
      execute format($q$select coalesce(array_agg(g.ma_cau), '{}') from %I g join %I d on d.id = g.dang_bai_id
                        where ($1::text is not null and d.id = $1) or ($2::text is not null and d.nhom_id = $2)$q$, m, b || 'dang_bai')
        into v_tmp using p_ts->>'dang_bai_id', p_ts->>'nhom_id';
      v_ma := v_ma || v_tmp;
    end loop;
  else
    raise exception 'Cần {"ma_cau":[...]} hoặc {"dang_bai_id":".."} hoặc {"nhom_id":".."} hoặc {"ma_bai":".."} (bài học Hình).';
  end if;
  if cardinality(v_ma) = 0 then return jsonb_build_object('ok', 0, 'loi', 0, 'ghi_chu', 'Không có câu nào.'); end if;
  if cardinality(v_ma) > 1000 then raise exception 'Mỗi lần tối đa 1000 câu (đang %).', cardinality(v_ma); end if;
  foreach m in array v_ma loop
    begin
      select * into c from public._phien_kho_cau(v_p, m);
      -- bản sao đi theo câu gốc (cùng như màn duyệt: duyệt gốc ⇒ duyệt bản sao)
      execute format($q$update %I set da_duyet = $2, duyet_boi = case when $2 then public.current_nhan_su_id() end,
                          duyet_at = case when $2 then now() end, duyet_nguon = case when $2 then 'nguoi' end
                        where (ma_cau = $1 or parent_ma_cau = $1) and xoa_at is null and da_duyet is distinct from $2$q$, c.tbl) using m, v_duyet;   -- câu đã đúng trạng thái: giữ người duyệt cũ
      v_ok := v_ok + 1;
    exception when others then
      v_loi := v_loi + 1; v_kq := v_kq || jsonb_build_array(jsonb_build_object('ma_cau', m, 'loi', sqlerrm));
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, case when v_duyet then 'duyet_cau' else 'bo_duyet_cau' end, p_ts, jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phien_kho_them(p_phien uuid, p_ds jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; x jsonb; v_kq jsonb := '[]'::jsonb; v_ok int := 0; v_trung int := 0; v_loi int := 0;
        v_nh text; v_tbl text; v_ma text; v_cu text; v_k text; v_phan jsonb;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu (xem tro-giup).'; end if;
  if jsonb_array_length(p_ds) > 20 then raise exception 'Mỗi lô tối đa 20 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      v_nh := coalesce(nullif(x->>'nhanh', ''), case when v_p.mon = 'KHTN' then 'khtn' else 'dai' end);
      if v_p.mon = 'KHTN' and v_nh <> 'khtn' then raise exception 'Phiên KHTN: nhanh phải là khtn.'; end if;
      if v_p.mon <> 'KHTN' and v_nh not in ('dai', 'hgt', 'hinh_hoc') then raise exception 'nhanh phải là dai · hgt · hinh_hoc.'; end if;
      if coalesce(x->>'loai_cau', '') not in ('trac_nghiem', 'tra_loi_ngan', 'tu_luan', 'dung_sai') then
        raise exception 'loai_cau phải là trac_nghiem · tra_loi_ngan · tu_luan · dung_sai.';
      end if;
      v_tbl := v_nh || '_cau_hoi';
      v_k := regexp_replace(lower(coalesce(x->>'noi_dung', '') || coalesce(nullif((x->'lua_chon')::text, 'null'), '') || coalesce(nullif((x->'menh_de')::text, 'null'), '')), '\s+', '', 'g');
      execute format($q$select min(c.ma_cau) from %I c where c.xoa_at is null
                         and regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g') = $1$q$, v_tbl)
        into v_cu using v_k;
      if v_cu is not null then
        v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'trung', true, 'ma_cau', v_cu));
        v_trung := v_trung + 1;
        continue;
      end if;
      if v_nh = 'hinh_hoc' then   -- 07/11: câu Hình–Học vào thẳng bài học (dạng = bài), chưa duyệt
        if not exists (select 1 from hinh_hoc_bai where ma_bai = x->>'ma_bai' and khoi = v_p.khoi) then
          raise exception 'Câu Hình–Học cần "ma_bai" là bài học Hình của khối %.', v_p.khoi;
        end if;
        if nullif(trim(x->>'noi_dung'), '') is null then raise exception 'Đề không được trống'; end if;
        insert into hinh_hoc_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, nguon, nguon_giai, da_duyet, dang_ai_de_xuat)
        values (x->>'ma_bai', x->>'loai_cau', trim(x->>'noi_dung'),
                case when jsonb_typeof(x->'lua_chon') = 'array' then x->'lua_chon' end,
                case when jsonb_typeof(x->'menh_de') = 'array' then x->'menh_de' end,
                nullif(trim(x->>'dap_an'), ''), nullif(trim(x->>'loi_giai'), ''), 'le',
                case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end, false, x->>'ma_bai')
        returning ma_cau into v_ma;
      else
      v_ma := public.fn_bdm_nhap_cau(case v_nh when 'dai' then 'toan' else v_nh end, v_p.khoi,
                                     x || jsonb_build_object('nguon_giai', case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end),
                                     null, null);
      end if;
      if nullif(trim(x->>'ten_de_goc'), '') is not null and v_nh <> 'hinh_hoc' then
        execute format('update %I set ten_de_goc = $2 where ma_cau = $1', v_tbl) using v_ma, trim(x->>'ten_de_goc');
      end if;
      v_phan := null;
      if jsonb_typeof(x->'phan') = 'object' and x->>'loai_cau' <> 'dung_sai' and v_nh <> 'hinh_hoc' then
        v_phan := public._phien_kho_phan1(v_p, v_ma, x->'phan'->>'ket_qua', x->'phan'->>'dang_bai_id', x->'phan'->>'ly_do', x->'phan'->>'chu_de_id');
      end if;
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'ma_cau', v_ma, 'nhanh', v_nh, 'phan', v_phan));
      v_ok := v_ok + 1;
    exception when others then
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', false, 'loi', sqlerrm, 'dau_de', left(coalesce(x->>'noi_dung', ''), 60)));
      v_loi := v_loi + 1;
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'them_cau', jsonb_build_object('so_cau', jsonb_array_length(p_ds)),
          jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$;
