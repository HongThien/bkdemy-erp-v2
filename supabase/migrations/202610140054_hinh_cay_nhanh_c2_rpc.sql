-- ============================================================================
-- 202610140054 — hinh_cay_nhanh_c2_rpc   (spec-hinh-cay-nhanh.md §2, bước C2)
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   Màn cây nhánh (C4) cần các thao tác SỬA cây: rẽ nhánh · chuyển bài · đổi thứ tự · đổi bài mẹ.
--   Mỗi thao tác đụng NHIỀU dòng (tạo nhánh + chuyển bài + đánh lại thứ tự) ⇒ phải là RPC trong CÙNG
--   transaction (CLAUDE.md §2.0), và các luật (không vòng · cùng một cây · mã không đổi) ép ở DB,
--   không để client tự kiểm.
--   Quyền: SECURITY INVOKER + RLS như bảng gốc (không definer).
--   Mỗi RPC trả jsonb {goc, bai:[{id,ma,so,mo_hinh_id,thu_tu}], nhanh_moi?} = toàn bộ cây sau khi đổi,
--   để client VÁ TẠI CHỖ (CLAUDE.md §2 "sau mutation không reload").
--
-- MẤT GÌ: không xoá/thu hẹp gì (chỉ thêm hàm).
-- ============================================================================

-- đánh lại thứ tự 1..n trong một làn (giữ thứ tự hiện có; ngang bằng thì theo mã)
create or replace function _hl_dong_thu_tu(p_mh uuid)
returns void language sql set search_path = public as $$
  update hinh_baitoan b set thu_tu = x.rn
  from (select id, row_number() over (order by thu_tu nulls last, ma) as rn
          from hinh_baitoan where mo_hinh_id = p_mh) x
  where x.id = b.id and b.thu_tu is distinct from x.rn
$$;

-- kết quả chuẩn: toàn bộ bài của cây (số hiển thị + mô hình chứa + thứ tự)
create or replace function _hl_ket_qua(p_goc uuid, p_nhanh_moi uuid default null)
returns jsonb language sql stable set search_path = public as $$
  select jsonb_build_object(
    'goc', p_goc,
    'nhanh_moi', p_nhanh_moi,
    'bai', coalesce((
      select jsonb_agg(jsonb_build_object('id', s.baitoan_id, 'ma', s.ma, 'so', s.so,
                                          'mo_hinh_id', s.mo_hinh_id, 'thu_tu', b.thu_tu)
                       order by s.so)
        from fn_hl_so_hien_thi(p_goc) s join hinh_baitoan b on b.id = s.baitoan_id), '[]'::jsonb))
$$;

-- 1. RẼ NHÁNH: tạo nhánh mới neo vào bài đứng ngay TRƯỚC bài đầu được chọn trong làn, chuyển các bài chọn vào
create or replace function fn_hl_re_nhanh(p_bai_ids uuid[], p_ten text default null, p_gia_thiet_them text default null)
returns jsonb language plpgsql set search_path = public as $$
declare
  v_mh      uuid;
  v_goc     uuid;
  v_lan     uuid[];
  v_ix_min  int;
  v_pred    uuid;
  v_n       uuid;
  v_phan    text;
  v_khoi    text;
  v_cnt     int;
  v_id      uuid;
  v_k       int := 0;
begin
  if p_bai_ids is null or array_length(p_bai_ids, 1) is null then
    raise exception 'Chưa chọn bài nào để rẽ nhánh';
  end if;
  select count(distinct mo_hinh_id), min(mo_hinh_id::text)::uuid into v_cnt, v_mh
    from hinh_baitoan where id = any(p_bai_ids);
  if (select count(*) from hinh_baitoan where id = any(p_bai_ids)) <> (select count(distinct x) from unnest(p_bai_ids) x) then
    raise exception 'Có bài không tồn tại';
  end if;
  if v_cnt <> 1 then raise exception 'Chỉ rẽ nhánh với các bài cùng một làn'; end if;

  select array_agg(id order by thu_tu nulls last, ma) into v_lan from hinh_baitoan where mo_hinh_id = v_mh;
  select min(i) into v_ix_min from generate_subscripts(v_lan, 1) i where v_lan[i] = any(p_bai_ids);
  if v_ix_min = 1 then
    raise exception 'Bài đầu làn không có bài đứng trước để rẽ ra — chọn từ bài thứ 2 trở đi';
  end if;
  v_pred := v_lan[v_ix_min - 1];
  v_goc := fn_hl_goc_mo_hinh(v_mh);

  select phan, khoi into v_phan, v_khoi from hinh_mo_hinh where id = v_goc;

  insert into hinh_mo_hinh(ten, gia_thiet, gia_thiet_them, la_mo_hinh, neo_baitoan_id, phan, khoi, thu_tu)
  values (coalesce(nullif(btrim(p_ten), ''), 'Nhánh mới'), '', nullif(btrim(coalesce(p_gia_thiet_them, '')), ''),
          false, v_pred, v_phan, v_khoi,
          coalesce((select max(thu_tu) from hinh_mo_hinh where neo_baitoan_id = v_pred), 0) + 1)
  returning id into v_n;

  -- chuyển theo thứ tự cũ trong làn; thứ tự trong nhánh mới 1..k
  for v_id in select id from hinh_baitoan where id = any(p_bai_ids) order by thu_tu nulls last, ma loop
    v_k := v_k + 1;
    update hinh_baitoan set mo_hinh_id = v_n, thu_tu = v_k, updated_at = now() where id = v_id;
  end loop;
  perform _hl_dong_thu_tu(v_mh);
  update hinh_mo_hinh set updated_at = now() where id in (v_mh, v_n);
  return _hl_ket_qua(v_goc, v_n);
end $$;

-- 2. CHUYỂN BÀI sang nhánh khác (cùng cây), xếp cuối làn; cấm vòng
create or replace function fn_hl_chuyen_bai(p_bai uuid, p_nhanh uuid)
returns jsonb language plpgsql set search_path = public as $$
declare
  v_b     hinh_baitoan%rowtype;
  v_goc   uuid;
  v_cu    uuid;
begin
  select * into v_b from hinh_baitoan where id = p_bai;
  if not found then raise exception 'Bài không tồn tại'; end if;
  if not exists (select 1 from hinh_mo_hinh where id = p_nhanh) then raise exception 'Nhánh đích không tồn tại'; end if;
  v_cu := v_b.mo_hinh_id;
  v_goc := fn_hl_goc_mo_hinh(v_cu);
  if fn_hl_goc_mo_hinh(p_nhanh) <> v_goc then
    raise exception 'Chỉ chuyển bài trong CÙNG một cây (khác cây = đổi mô hình, chưa hỗ trợ)';
  end if;
  if p_nhanh = v_cu then return _hl_ket_qua(v_goc); end if;
  -- vòng: nhánh đích nằm trong cây con rẽ ra từ chính bài này
  if exists (select 1 from hinh_mo_hinh m
              where m.neo_baitoan_id = p_bai and m.id = any(_hl_duong_mo_hinh(p_nhanh))) then
    raise exception 'Không chuyển được: nhánh đích đang rẽ ra từ chính bài này (vòng)';
  end if;

  update hinh_baitoan
     set mo_hinh_id = p_nhanh,
         thu_tu = coalesce((select max(thu_tu) from hinh_baitoan where mo_hinh_id = p_nhanh), 0) + 1,
         updated_at = now()
   where id = p_bai;
  perform _hl_dong_thu_tu(v_cu);
  update hinh_mo_hinh set updated_at = now() where id in (v_cu, p_nhanh);
  return _hl_ket_qua(v_goc);
end $$;

-- 3. ĐỔI THỨ TỰ trong làn: đưa bài tới vị trí p_vi_tri (1 = đầu làn)
create or replace function fn_hl_doi_thu_tu(p_bai uuid, p_vi_tri int)
returns jsonb language plpgsql set search_path = public as $$
declare
  v_mh   uuid;
  v_n    int;
  v_vt   int;
begin
  select mo_hinh_id into v_mh from hinh_baitoan where id = p_bai;
  if v_mh is null then raise exception 'Bài không tồn tại'; end if;
  perform _hl_dong_thu_tu(v_mh);
  select count(*) into v_n from hinh_baitoan where mo_hinh_id = v_mh;
  v_vt := greatest(1, least(coalesce(p_vi_tri, 1), v_n));

  -- dời: các bài giữa cũ↔mới xê một bậc, bài chọn vào chỗ mới (2 bước tránh trùng)
  with cu as (select thu_tu as t from hinh_baitoan where id = p_bai)
  update hinh_baitoan b set thu_tu = case
      when b.id = p_bai then v_vt
      when (select t from cu) < v_vt and b.thu_tu > (select t from cu) and b.thu_tu <= v_vt then b.thu_tu - 1
      when (select t from cu) > v_vt and b.thu_tu >= v_vt and b.thu_tu < (select t from cu) then b.thu_tu + 1
      else b.thu_tu end,
      updated_at = case when b.id = p_bai then now() else b.updated_at end
  where b.mo_hinh_id = v_mh;
  update hinh_mo_hinh set updated_at = now() where id = v_mh;
  return _hl_ket_qua(fn_hl_goc_mo_hinh(v_mh));
end $$;

-- 4. ĐỔI BÀI MẸ của nhánh (dời cả nhánh + cây con sang bài khác trong cùng cây)
create or replace function fn_hl_doi_neo(p_nhanh uuid, p_bai_moi uuid)
returns jsonb language plpgsql set search_path = public as $$
declare
  v_goc uuid;
  v_mh_bai uuid;
begin
  if not exists (select 1 from hinh_mo_hinh where id = p_nhanh and neo_baitoan_id is not null) then
    raise exception 'Chỉ đổi bài mẹ cho NHÁNH (đã có neo). Gốc cây / mô hình con kiểu cũ không có neo.';
  end if;
  select mo_hinh_id into v_mh_bai from hinh_baitoan where id = p_bai_moi;
  if v_mh_bai is null then raise exception 'Bài mẹ mới không tồn tại'; end if;
  v_goc := fn_hl_goc_mo_hinh(p_nhanh);
  if fn_hl_goc_mo_hinh(v_mh_bai) <> v_goc then
    raise exception 'Bài mẹ mới phải thuộc CÙNG cây';
  end if;
  -- vòng được trigger hinh_mo_hinh_neo_chk chặn
  update hinh_mo_hinh
     set neo_baitoan_id = p_bai_moi,
         thu_tu = coalesce((select max(thu_tu) from hinh_mo_hinh where neo_baitoan_id = p_bai_moi), 0) + 1,
         updated_at = now()
   where id = p_nhanh;
  return _hl_ket_qua(v_goc);
end $$;

revoke execute on function _hl_dong_thu_tu(uuid), _hl_ket_qua(uuid, uuid), fn_hl_re_nhanh(uuid[], text, text),
  fn_hl_chuyen_bai(uuid, uuid), fn_hl_doi_thu_tu(uuid, int), fn_hl_doi_neo(uuid, uuid) from public, anon;
grant execute on function fn_hl_re_nhanh(uuid[], text, text), fn_hl_chuyen_bai(uuid, uuid),
  fn_hl_doi_thu_tu(uuid, int), fn_hl_doi_neo(uuid, uuid) to authenticated;
