-- Chuyên đề Hình: khối "BÀI CHƯA CÓ MÔ HÌNH" trong mỗi phần (Thùy 21/10: chuyên đề ôn tập "đưa hết vào") — bài kho Hình–Luyện chưa gán
-- mô hình, hoặc không phải tự luận (trắc nghiệm / trả lời ngắn — mô hình luyện chỉ nhận tự luận) vẫn vào chuyên đề được.
--   tai_lieu_phan loai 'hl_khac' (cha = phần, ref_ma NULL = không áp dụng) → tai_lieu_cau.ma_cau = hinh_bai.ma_bai.
--   fn_tl_hl_noi_dung trả thêm 'khac' mỗi phần; fn_tl_hl_dat_bai nhận cả phần hl_khac; fn_tl_hl_them_khoi_khac tạo khối (1 khối / phần).

create or replace function fn_tl_hl_noi_dung(p_tai_lieu uuid, p_buoi uuid default null) returns jsonb
language sql stable security definer set search_path to 'public' as $$
  with bai_json as (
    select tc.phan_id, jsonb_agg(jsonb_build_object(
      'ma_bai', tc.ma_cau, 'id', hb.id, 'de_bai', hb.de_bai, 'gia_thiet_chung', hb.gia_thiet_chung, 'anh_de', hb.anh_de,
      'con_trong_kho', hb.id is not null, 'loai_cau', hb.loai_cau,
      'y', (select coalesce(jsonb_agg(jsonb_build_object('nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung, 'dap_an', y.dap_an,
              'loi_giai', y.loi_giai, 'anh_de', y.anh_de, 'anh_loi_giai', y.anh_loi_giai, 'gia_thiet_them', y.gia_thiet_them) order by y.thu_tu), '[]'::jsonb)
              from hinh_y y where y.bai_id = hb.id)
    ) order by tc.thu_tu) as bai
      from tai_lieu_cau tc
      join tai_lieu_phan p on p.id = tc.phan_id and p.tai_lieu_id = p_tai_lieu
      left join hinh_bai hb on hb.ma_bai = tc.ma_cau
     group by tc.phan_id
  )
  select jsonb_build_object(
    'tai_lieu', (select jsonb_build_object('id', t.id, 'ten', t.ten, 'khoi', t.khoi, 'mon', t.mon, 'nhanh', t.nhanh, 'loai', t.loai,
                                           'ban_do', t.ban_do, 'cau_hinh', t.cau_hinh, 'updated_at', t.updated_at)
                   from tai_lieu t where t.id = p_tai_lieu and la_thanh_vien()),
    'buoi', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'tieu_de', b.tieu_de, 'thu_tu', b.thu_tu,
        'mo_hinh', coalesce((
          select jsonb_agg(jsonb_build_object(
            'phan_id', pm.id, 'id', mh.id, 'ma', mh.ma, 'ten', mh.ten, 'gia_thiet', mh.gia_thiet, 'anh', mh.anh_cau_hinh,
            'con_tren_ban_do', mh.id is not null, 'bai', coalesce(bj.bai, '[]'::jsonb)) order by pm.thu_tu, pm.id)
            from tai_lieu_phan pm left join hinh_mo_hinh mh on mh.id::text = pm.ref_ma left join bai_json bj on bj.phan_id = pm.id
           where pm.cha_id = b.id and pm.loai_phan = 'hl_mo_hinh'), '[]'::jsonb),
        'khac', (select jsonb_build_object('phan_id', pk.id, 'bai', coalesce(bj.bai, '[]'::jsonb))
                   from tai_lieu_phan pk left join bai_json bj on bj.phan_id = pk.id
                  where pk.cha_id = b.id and pk.loai_phan = 'hl_khac' order by pk.thu_tu limit 1)
      ) order by b.thu_tu, b.id)
        from tai_lieu_phan b
       where b.tai_lieu_id = p_tai_lieu and b.loai_phan = 'buoi' and (p_buoi is null or b.id = p_buoi) and la_thanh_vien()), '[]'::jsonb))
$$;

create or replace function fn_tl_hl_dat_bai(p_phan uuid, p_ma_bai text[]) returns void
language plpgsql security definer set search_path to 'public' as $$
declare v_tl uuid; v_buoi uuid;
begin
  select p.tai_lieu_id, p.cha_id into v_tl, v_buoi from tai_lieu_phan p where p.id = p_phan and p.loai_phan in ('hl_mo_hinh', 'hl_khac');
  if v_tl is null then raise exception 'Phần này không nhận bài Hình.' using errcode = 'P0001'; end if;
  perform _tl_hl_kiem(v_tl, v_buoi);
  if cardinality(coalesce(p_ma_bai, '{}')) <> (select count(distinct x) from unnest(coalesce(p_ma_bai, '{}')) x) then
    raise exception 'Danh sách có bài lặp.' using errcode = 'P0001';
  end if;
  if exists (select 1 from unnest(coalesce(p_ma_bai, '{}')) x where not exists (select 1 from hinh_bai b where b.ma_bai = x)) then
    raise exception 'Có mã bài không có trong kho Hình–Luyện.' using errcode = 'P0001';
  end if;
  if exists (select 1 from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
              where p.cha_id = v_buoi and p.id <> p_phan and tc.ma_cau = any (coalesce(p_ma_bai, '{}'))) then
    raise exception 'Có bài đã dùng ở mô hình khác trong cùng phần.' using errcode = 'P0001';
  end if;
  delete from tai_lieu_cau where phan_id = p_phan;
  insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select p_phan, m, (o - 1)::int from unnest(coalesce(p_ma_bai, '{}')) with ordinality as x(m, o);
  update tai_lieu set updated_at = now() where id = v_tl;
end $$;

-- Đặt mô hình: như mig 202610211633, thêm giữ khối hl_khac ở cuối phần
create or replace function fn_tl_hl_dat_mo_hinh(p_tai_lieu uuid, p_buoi uuid, p_mo_hinh uuid[]) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare v_mh uuid; v_o int; v_pm uuid;
begin
  perform _tl_hl_kiem(p_tai_lieu, p_buoi);
  if cardinality(coalesce(p_mo_hinh, '{}')) <> (select count(distinct x) from unnest(coalesce(p_mo_hinh, '{}')) x) then
    raise exception 'Một mô hình bị chọn 2 lần.' using errcode = 'P0001';
  end if;
  if exists (select 1 from unnest(coalesce(p_mo_hinh, '{}')) x where not exists (select 1 from hinh_mo_hinh m where m.id = x and m.phan = 'luyen')) then
    raise exception 'Có mô hình không thuộc Hình–Luyện.' using errcode = 'P0001';
  end if;
  delete from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'hl_mo_hinh'
     and not (p.ref_ma = any (array(select x::text from unnest(coalesce(p_mo_hinh, '{}')) x)));
  for v_mh, v_o in select x, o from unnest(coalesce(p_mo_hinh, '{}')) with ordinality as t(x, o) loop
    select p.id into v_pm from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'hl_mo_hinh' and p.ref_ma = v_mh::text;
    if v_pm is null then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_tai_lieu, v_o, 'hl_mo_hinh', v_mh::text, p_buoi)
      returning id into v_pm;
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu)
      select v_pm, m, (o - 1)::int from unnest(_tl_hl_bai_mac_dinh(v_mh)) with ordinality as x(m, o);
    else
      update tai_lieu_phan set thu_tu = v_o where id = v_pm;
    end if;
    v_pm := null;
  end loop;
  update tai_lieu_phan set thu_tu = 2147483000 where cha_id = p_buoi and loai_phan = 'hl_khac';   -- khối bài chưa có mô hình luôn cuối phần
  perform _tl_hl_xep(p_tai_lieu);
  update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  return fn_tl_hl_noi_dung(p_tai_lieu, p_buoi);
end $$;


-- Tạo (nếu chưa có) khối "bài chưa có mô hình" của 1 phần — đứng cuối phần. Trả id khối.
create or replace function fn_tl_hl_them_khoi_khac(p_tai_lieu uuid, p_buoi uuid) returns uuid
language plpgsql security definer set search_path to 'public' as $$
declare v_id uuid;
begin
  perform _tl_hl_kiem(p_tai_lieu, p_buoi);
  select p.id into v_id from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'hl_khac' limit 1;
  if v_id is null then
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, cha_id) values (p_tai_lieu, 2147483000, 'hl_khac', p_buoi) returning id into v_id;
    perform _tl_hl_xep(p_tai_lieu);
  end if;
  return v_id;
end $$;

revoke execute on function fn_tl_hl_them_khoi_khac(uuid, uuid) from public, anon;
grant execute on function fn_tl_hl_them_khoi_khac(uuid, uuid) to authenticated;
