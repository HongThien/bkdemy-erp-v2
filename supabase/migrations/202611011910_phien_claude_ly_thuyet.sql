-- ============================================================================
-- 202611011910 — PHIÊN CLAUDE · Phase 2: loại việc LÝ THUYẾT DẠNG (spec-phong-truong-khoi.md §2)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 01/11 "tiếp luôn phần 2"): Phase 2 = Claude draft lý thuyết · ví dụ · mô tả nhận biết của
-- từng nhóm / dạng bài → trưởng khối check, sửa (tay hoặc ra lệnh) → lặp → chốt. Mở loại việc 'ly_thuyet'
-- trên cùng hạ tầng phiên của mig 202611011822.
--
--   · Lệnh ĐỌC nội dung `fn_phien_bd_doc` — trả nội dung + md5 từng ô.
--   · Lệnh GHI nội dung `fn_phien_lt_ghi` — chỉ phiên 'ly_thuyet'; chỉ các ô chữ (mo_ta / ly_thuyet / vi_du),
--     KHÔNG đụng file đính kèm, KHÔNG xoá trắng ô (xoá là việc người làm tay).
--     ⭐ CHỐNG GHI ĐÈ ÂM THẦM: ô đang có chữ thì phải gửi kèm `md5_cu` = md5 nội dung hiện tại (lấy từ lệnh đọc).
--     Trưởng khối vừa sửa tay sau lúc Claude đọc ⇒ md5 lệch ⇒ từ chối, Claude phải đọc lại (optimistic
--     concurrency). Nội dung cũ vẫn nằm trong *_bdm_log (cột `cu`) — lấy lại được.
--   · Một khối chỉ MỘT phiên sửa bản đồ (Bản đồ HOẶC Lý thuyết) tại một thời điểm — Thùy chốt "mỗi bản đồ một
--     phiên"; lý thuyết là một phần của bản đồ. Index mới phủ cả hai loại; index cũ (chỉ 'ban_do') thành
--     tập con thừa nhưng vô hại — để nguyên, không drop (Luật xoá, không cần thiết).
--   · Phiên Lý thuyết được `sua` tên / mô tả, KHÔNG được đổi cấu trúc (thêm/chuyển/sắp xếp) — đó là phiên Bản đồ.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì. Thay thân 5 hàm của mig 202611011822 (cùng chữ ký), thêm 2 hàm + 1 index.
-- ============================================================================

create or replace function public._phien_loai_dang_mo()
returns text[] language sql immutable as $$ select array['ban_do', 'ly_thuyet'] $$;

-- Loại việc GHI VÀO BẢN ĐỒ — mỗi (môn × khối) chỉ một phiên mở thuộc nhóm này.
create or replace function public._phien_loai_sua_ban_do()
returns text[] language sql immutable as $$ select array['ban_do', 'ly_thuyet'] $$;

create unique index if not exists claude_phien_sua_ban_do_mot_idx on claude_phien (mon, khoi)
  where loai = any (array['ban_do', 'ly_thuyet']) and trang_thai <> 'dong';

-- ── Mở phiên / mở lại: chặn theo nhóm "sửa bản đồ" ──────────────────────────
create or replace function public.fn_phien_mo(p_loai text, p_mon text, p_khoi text, p_tieu_de text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_ns uuid := public.current_nhan_su_id(); v_ten text;
  v_dang record;
begin
  if v_ns is null or public.jwt_uid() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự.'; end if;
  if not (p_loai = any (public._phien_loai_dang_mo())) then
    raise exception 'Loại việc "%" chưa mở trong bản thử.', p_loai;
  end if;
  if not public._truong_khoi_tro_len(p_mon, p_khoi) then
    raise exception 'Chỉ trưởng khối trở lên của % khối % mới mở phiên được.', p_mon, p_khoi;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) and not exists (select 1 from public._phien_bdm_bang(p_mon)) then
    raise exception 'Môn % chưa có bản đồ mới trên hệ — chưa mở phiên này được.', p_mon;
  end if;
  if p_loai = any (public._phien_loai_sua_ban_do()) then
    select p.id, p.loai, ns.ho_ten into v_dang
      from claude_phien p left join nhan_su ns on ns.id = p.nhan_su_id
     where p.loai = any (public._phien_loai_sua_ban_do()) and p.mon = p_mon and p.khoi = p_khoi and p.trang_thai <> 'dong'
     limit 1;
    if found then
      raise exception 'Bản đồ % khối % đang có một phiên % mở (của %). Mỗi bản đồ chỉ một phiên sửa — vào phiên đó, hoặc đóng nó trước.',
        p_mon, p_khoi, case v_dang.loai when 'ban_do' then 'Bản đồ' else 'Lý thuyết' end, coalesce(v_dang.ho_ten, '?');
    end if;
  end if;
  v_ten := coalesce(nullif(trim(p_tieu_de), ''),
    case p_loai when 'ban_do' then 'Bản đồ' when 'ly_thuyet' then 'Lý thuyết dạng' when 'nhap_kho' then 'Nhập kho & phân dạng'
                when 'bao_sai' then 'Câu bị báo sai' else 'Giải bài' end
    || ' · ' || p_mon || ' ' || p_khoi);
  insert into claude_phien (loai, mon, khoi, tieu_de, nguoi_mo, nhan_su_id)
  values (p_loai, p_mon, p_khoi, v_ten, public.jwt_uid(), v_ns)
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.fn_phien_mo_lai(p_phien uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien for update;
  if not found or not public._phien_xem_duoc(p_phien) then raise exception 'Không có phiên này.'; end if;
  if v_p.trang_thai <> 'dong' then return; end if;
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  if v_p.loai = any (public._phien_loai_sua_ban_do())
     and exists (select 1 from claude_phien where loai = any (public._phien_loai_sua_ban_do()) and mon = v_p.mon and khoi = v_p.khoi
                  and trang_thai <> 'dong' and id <> p_phien) then
    raise exception 'Bản đồ % khối % đang có phiên sửa khác mở — đóng phiên đó trước.', v_p.mon, v_p.khoi;
  end if;
  update claude_phien set trang_thai = 'mo' where id = p_phien;
end $$;

-- ── Vào phiên để đọc/ghi bản đồ: nhận cả phiên Bản đồ lẫn Lý thuyết ─────────
create or replace function public._phien_bd_vao(p_phien uuid)
returns claude_phien language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien;
  if not found then raise exception 'Không có phiên %.', p_phien; end if;
  if not (v_p.loai = any (public._phien_loai_sua_ban_do())) then
    raise exception 'Phiên này là loại "%" — không có lệnh bản đồ.', v_p.loai;
  end if;
  if v_p.trang_thai <> 'mo' then raise exception 'Phiên đã đóng / đang đóng — không ghi được nữa.'; end if;
  -- ĐÓNG VAI người mở phiên trong transaction này: jwt_uid() / current_nhan_su_id() / trigger log đều thấy họ.
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_p.nguoi_mo, 'role', 'authenticated')::text, true);
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Người mở phiên không còn là trưởng khối trở lên của % khối % — dừng.', v_p.mon, v_p.khoi;
  end if;
  if not exists (select 1 from public._phien_bdm_bang(v_p.mon)) then
    raise exception 'Môn % chưa có bản đồ mới.', v_p.mon;
  end if;
  return v_p;
end $$;

create or replace function public.fn_phien_bd_ghi(p_phien uuid, p_viec text, p_ts jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_p claude_phien; b text; v_vung boolean; v_khoi text;
  v_id text; v_id2 text; v_kq jsonb; v_ten text; v_mo_ta text; v_loai text;
  v_ids text[]; v_i integer; v_cha text; v_n integer; v_set text[] := '{}';
begin
  v_p := public._phien_bd_vao(p_phien);
  -- Phiên Lý thuyết chỉ được đổi tên / mô tả; đổi CẤU TRÚC là việc của phiên Bản đồ.
  if v_p.loai <> 'ban_do' and p_viec <> 'sua' then
    raise exception 'Phiên Lý thuyết chỉ sửa tên / mô tả. Đổi cấu trúc (thêm, chuyển, sắp xếp) thì đóng phiên này và mở phiên Bản đồ.';
  end if;
  v_khoi := v_p.khoi;
  select bang, co_vung into b, v_vung from public._phien_bdm_bang(v_p.mon);
  p_ts := coalesce(p_ts, '{}'::jsonb);
  v_ten := nullif(trim(coalesce(p_ts->>'ten', '')), '');
  v_mo_ta := p_ts->>'mo_ta';

  if p_viec = 'them_chu_de' then
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    if v_vung then
      execute format('insert into %I (khoi, ten, nhanh) values ($1, $2, $3) returning id', b || 'chu_de')
        into v_id using v_khoi, v_ten, coalesce(nullif(p_ts->>'nhanh', ''), 'toan');
    else
      execute format('insert into %I (khoi, ten) values ($1, $2) returning id', b || 'chu_de') into v_id using v_khoi, v_ten;
    end if;
    v_kq := jsonb_build_object('chu_de_id', v_id);

  elsif p_viec = 'them_chuyen_de' then
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (ten, mo_ta) values ($1, $2) returning id', b || 'chuyen_de')
      into v_id using v_ten, coalesce(v_mo_ta, '');
    execute format('insert into %I (chu_de_id, chuyen_de_id) values ($1, $2)', b || 'o') using p_ts->>'chu_de_id', v_id;
    v_kq := jsonb_build_object('chuyen_de_id', v_id, 'chu_de_id', p_ts->>'chu_de_id');

  elsif p_viec = 'them_nhom' then
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    execute format('select count(*) from %I where chu_de_id = $1 and chuyen_de_id = $2', b || 'o')
      into v_n using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', p_ts->>'chuyen_de_id', p_ts->>'chu_de_id'; end if;
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (chu_de_id, chuyen_de_id, ten, mo_ta) values ($1, $2, $3, $4) returning id', b || 'nhom')
      into v_id using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id', v_ten, coalesce(v_mo_ta, '');
    v_kq := jsonb_build_object('nhom_id', v_id);

  elsif p_viec = 'them_dang_bai' then
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_khoi);
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (nhom_id, ten, mo_ta) values ($1, $2, $3) returning id', b || 'dang_bai')
      into v_id using p_ts->>'nhom_id', v_ten, coalesce(v_mo_ta, '');
    v_kq := jsonb_build_object('dang_bai_id', v_id);

  elsif p_viec = 'sua' then
    -- Chỉ tên + mô tả nhận biết. Lý thuyết / ví dụ thuộc loại việc 'ly_thuyet' (chưa mở). Mã không bao giờ đổi.
    v_loai := p_ts->>'loai';
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, v_loai, v_id, v_khoi);
    if p_ts ? 'ten' then
      if v_ten is null then raise exception 'ten không được trống.'; end if;
      v_set := v_set || format('ten = %L', v_ten);
    end if;
    if p_ts ? 'mo_ta' then
      if v_loai = 'chu_de' then raise exception 'Chủ đề không có mô tả.'; end if;
      v_set := v_set || format('mo_ta = %L', coalesce(v_mo_ta, ''));
    end if;
    if cardinality(v_set) = 0 then raise exception 'Không có gì để sửa (chỉ sửa được ten, mo_ta).'; end if;
    execute format('update %I set %s where id = $1', b || v_loai, array_to_string(v_set, ', ')) using v_id;
    v_kq := jsonb_build_object('loai', v_loai, 'id', v_id);

  elsif p_viec = 'chuyen_nhom' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi);
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    execute format('select count(*) from %I where chu_de_id = $1 and chuyen_de_id = $2', b || 'o')
      into v_n using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', p_ts->>'chuyen_de_id', p_ts->>'chu_de_id'; end if;
    execute format('update %I set chu_de_id = $2, chuyen_de_id = $3,
                      thu_tu = (select coalesce(max(thu_tu), 0) + 1 from %I where chu_de_id = $2 and chuyen_de_id = $3)
                    where id = $1', b || 'nhom', b || 'nhom')
      using v_id, p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    v_kq := jsonb_build_object('nhom_id', v_id, 'chu_de_id', p_ts->>'chu_de_id', 'chuyen_de_id', p_ts->>'chuyen_de_id');

  elsif p_viec = 'chuyen_dang_bai' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi);
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_khoi);
    execute format('update %I set nhom_id = $2,
                      thu_tu = (select coalesce(max(thu_tu), 0) + 1 from %I where nhom_id = $2)
                    where id = $1', b || 'dang_bai', b || 'dang_bai')
      using v_id, p_ts->>'nhom_id';
    v_kq := jsonb_build_object('dang_bai_id', v_id, 'nhom_id', p_ts->>'nhom_id');

  elsif p_viec = 'sap_xep' then
    -- Đặt lại thứ tự theo đúng mảng ids; mọi id phải cùng một cha và thuộc khối của phiên.
    v_loai := p_ts->>'loai';
    select array_agg(x) into v_ids from jsonb_array_elements_text(coalesce(p_ts->'ids', '[]'::jsonb)) x;
    if coalesce(cardinality(v_ids), 0) = 0 then raise exception 'Thiếu ids.'; end if;
    if v_loai = 'chu_de' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi); end loop;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'chu_de') using v_ids[v_i], v_i;
      end loop;
    elsif v_loai = 'o' then  -- thứ tự chuyên đề trong 1 chủ đề
      v_cha := p_ts->>'chu_de_id';
      perform public._phien_bd_kiem_khoi(b, 'chu_de', v_cha, v_khoi);
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $3 where chu_de_id = $1 and chuyen_de_id = $2', b || 'o') using v_cha, v_ids[v_i], v_i;
        get diagnostics v_n = row_count;
        if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', v_ids[v_i], v_cha; end if;
      end loop;
    elsif v_loai = 'nhom' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi); end loop;
      execute format('select count(distinct (chu_de_id, chuyen_de_id)) from %I where id = any($1)', b || 'nhom') into v_n using v_ids;
      if v_n > 1 then raise exception 'Các nhóm không cùng một chuyên đề — sắp xếp từng chuyên đề một.'; end if;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'nhom') using v_ids[v_i], v_i;
      end loop;
    elsif v_loai = 'dang_bai' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi); end loop;
      execute format('select count(distinct nhom_id) from %I where id = any($1)', b || 'dang_bai') into v_n using v_ids;
      if v_n > 1 then raise exception 'Các dạng bài không cùng một nhóm — sắp xếp từng nhóm một.'; end if;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'dang_bai') using v_ids[v_i], v_i;
      end loop;
    else
      raise exception 'sap_xep: loai phải là chu_de · o · nhom · dang_bai.';
    end if;
    v_kq := jsonb_build_object('loai', v_loai, 'so', cardinality(v_ids));

  else
    raise exception 'Lệnh không có: % (them_chu_de · them_chuyen_de · them_nhom · them_dang_bai · sua · chuyen_nhom · chuyen_dang_bai · sap_xep). Không có lệnh xoá — đề xuất để trưởng khối xoá tay.', p_viec;
  end if;

  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua) values (p_phien, p_viec, p_ts, v_kq);
  return jsonb_build_object('ok', true) || v_kq;
end $$;

-- ── ĐỌC nội dung một nút (nội dung đầy đủ + md5 từng ô để ghi đè an toàn) ────
-- nhóm: lý thuyết nhóm + mọi dạng bài bên trong · dạng bài: nội dung dạng + lý thuyết nhóm cha (để khỏi chép lặp)
-- + tên các dạng anh em (để mô tả phân biệt được) · chuyên đề: mô tả + các nhóm của khối này.
create or replace function public.fn_phien_bd_doc(p_phien uuid, p_loai text, p_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; b text; v jsonb; v_co boolean;
begin
  v_p := public._phien_bd_vao(p_phien);
  select bang into b from public._phien_bdm_bang(v_p.mon);
  if p_loai = 'nhom' then
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_id, v_p.khoi);
    execute format($q$
      select jsonb_build_object('loai', 'nhom', 'id', n.id, 'ten', n.ten, 'chu_de', c.ten, 'chuyen_de', ch.ten,
        'mo_ta', n.mo_ta, 'ly_thuyet', n.ly_thuyet, 'co_file_ly_thuyet', n.ly_thuyet_file_url is not null,
        'md5', jsonb_build_object('mo_ta', md5(coalesce(n.mo_ta, '')), 'ly_thuyet', md5(coalesce(n.ly_thuyet, ''))),
        'dang_bai', coalesce((select jsonb_agg(jsonb_build_object('id', d.id, 'ten', d.ten, 'thu_tu', d.thu_tu,
             'mo_ta', d.mo_ta, 'ly_thuyet', d.ly_thuyet, 'vi_du', d.vi_du,
             'md5', jsonb_build_object('mo_ta', md5(coalesce(d.mo_ta, '')), 'ly_thuyet', md5(coalesce(d.ly_thuyet, '')), 'vi_du', md5(coalesce(d.vi_du, ''))))
             order by d.thu_tu) from %I d where d.nhom_id = n.id), '[]'::jsonb))
        from %I n join %I c on c.id = n.chu_de_id join %I ch on ch.id = n.chuyen_de_id where n.id = $1 $q$,
      b || 'dang_bai', b || 'nhom', b || 'chu_de', b || 'chuyen_de') into v using p_id;
  elsif p_loai = 'dang_bai' then
    perform public._phien_bd_kiem_khoi(b, 'dang_bai', p_id, v_p.khoi);
    execute format($q$
      select jsonb_build_object('loai', 'dang_bai', 'id', d.id, 'ten', d.ten,
        'mo_ta', d.mo_ta, 'ly_thuyet', d.ly_thuyet, 'vi_du', d.vi_du,
        'co_file', jsonb_build_object('ly_thuyet', d.ly_thuyet_file_url is not null, 'vi_du', d.vi_du_file_url is not null),
        'md5', jsonb_build_object('mo_ta', md5(coalesce(d.mo_ta, '')), 'ly_thuyet', md5(coalesce(d.ly_thuyet, '')), 'vi_du', md5(coalesce(d.vi_du, ''))),
        'nhom', jsonb_build_object('id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'ly_thuyet', n.ly_thuyet),
        'dang_anh_em', coalesce((select jsonb_agg(jsonb_build_object('id', x.id, 'ten', x.ten, 'mo_ta', x.mo_ta) order by x.thu_tu)
                                   from %I x where x.nhom_id = n.id and x.id <> d.id), '[]'::jsonb))
        from %I d join %I n on n.id = d.nhom_id where d.id = $1 $q$,
      b || 'dang_bai', b || 'dang_bai', b || 'nhom') into v using p_id;
  elsif p_loai = 'chuyen_de' then
    execute format('select count(*) > 0 from %I o join %I c on c.id = o.chu_de_id where o.chuyen_de_id = $1 and c.khoi = $2',
                   b || 'o', b || 'chu_de') into v_co using p_id, v_p.khoi;
    if not v_co then raise exception 'Chuyên đề % không nằm trong khối %.', p_id, v_p.khoi; end if;
    execute format($q$
      select jsonb_build_object('loai', 'chuyen_de', 'id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta,
        'md5', jsonb_build_object('mo_ta', md5(coalesce(ch.mo_ta, ''))),
        'nhom', coalesce((select jsonb_agg(jsonb_build_object('id', n.id, 'ten', n.ten) order by n.thu_tu)
                            from %I n join %I c on c.id = n.chu_de_id where n.chuyen_de_id = ch.id and c.khoi = $2), '[]'::jsonb))
        from %I ch where ch.id = $1 $q$,
      b || 'nhom', b || 'chu_de', b || 'chuyen_de') into v using p_id, v_p.khoi;
  else
    raise exception 'doc: loai phải là chuyen_de · nhom · dang_bai.';
  end if;
  if v is null then raise exception 'Không có % mã %.', p_loai, p_id; end if;
  return v;
end $$;

-- ── GHI nội dung chữ một ô (chỉ phiên Lý thuyết) ─────────────────────────────
-- Ô cho phép: chuyên đề.mo_ta · nhóm.mo_ta / ly_thuyet · dạng bài.mo_ta / ly_thuyet / vi_du. Không file, không xoá trắng.
create or replace function public.fn_phien_lt_ghi(p_phien uuid, p_ts jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_p claude_phien; b text; v_cu text; v_kq jsonb;
  v_loai text := p_ts->>'loai'; v_id text := p_ts->>'id'; v_truong text := p_ts->>'truong'; v_nd text := p_ts->>'noi_dung';
begin
  v_p := public._phien_bd_vao(p_phien);
  if v_p.loai <> 'ly_thuyet' then
    raise exception 'Ghi lý thuyết / ví dụ là việc của phiên Lý thuyết dạng (sửa mô tả ở phiên Bản đồ thì dùng lệnh sua).';
  end if;
  select bang into b from public._phien_bdm_bang(v_p.mon);
  if not ((v_loai, v_truong) in (('chuyen_de', 'mo_ta'), ('nhom', 'mo_ta'), ('nhom', 'ly_thuyet'),
                                 ('dang_bai', 'mo_ta'), ('dang_bai', 'ly_thuyet'), ('dang_bai', 'vi_du'))) then
    raise exception 'Không ghi được ô "%" của "%". Ô cho phép: chuyen_de.mo_ta · nhom.mo_ta|ly_thuyet · dang_bai.mo_ta|ly_thuyet|vi_du.',
      coalesce(v_truong, '?'), coalesce(v_loai, '?');
  end if;
  if nullif(trim(coalesce(v_nd, '')), '') is null then
    raise exception 'Không ghi nội dung trống — xoá trắng một ô là việc trưởng khối làm tay trên màn Bản đồ.';
  end if;
  perform public._phien_bd_kiem_khoi(b, v_loai, v_id, v_p.khoi);
  execute format('select %I from %I where id = $1 for update', v_truong, b || v_loai) into v_cu using v_id;
  if coalesce(v_cu, '') <> '' and coalesce(p_ts->>'md5_cu', '') <> md5(v_cu) then
    raise exception 'Ô % của % % đang có nội dung (% ký tự) nhưng md5_cu không khớp bản hiện tại — có thể trưởng khối vừa sửa tay. Đọc lại bằng lệnh doc rồi gửi lại kèm md5_cu mới.',
      v_truong, v_loai, v_id, length(v_cu);
  end if;
  v_kq := jsonb_build_object('loai', v_loai, 'id', v_id, 'truong', v_truong, 'cu_ky_tu', length(coalesce(v_cu, '')), 'moi_ky_tu', length(v_nd));
  if coalesce(v_cu, '') = v_nd then return jsonb_build_object('ok', true, 'khong_doi', true) || v_kq; end if;
  execute format('update %I set %I = $2 where id = $1', b || v_loai, v_truong) using v_id, v_nd;
  -- Vết không chép cả nội dung (đã nằm trọn trong *_bdm_log cũ/mới) — chỉ ô nào, dài bao nhiêu.
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'ghi_noi_dung', jsonb_build_object('loai', v_loai, 'id', v_id, 'truong', v_truong), v_kq);
  return jsonb_build_object('ok', true) || v_kq;
end $$;

do $$
declare f text;
begin
  foreach f in array array['public.fn_phien_bd_doc(uuid, text, text)', 'public.fn_phien_lt_ghi(uuid, jsonb)'] loop
    execute format('revoke all on function %s from public', f);
    execute format('revoke all on function %s from anon', f);
    execute format('revoke all on function %s from authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;
