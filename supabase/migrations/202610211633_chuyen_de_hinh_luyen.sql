-- CHUYÊN ĐỀ HÌNH (Thùy 21/10: chuyên đề làm được Đại · HGT · Hình; mỗi chuyên đề 1 nhánh; Hình lấy từ Hình–Luyện — mô hình · kho bài).
-- Tài liệu: tai_lieu loai='chuyen_de', nhanh='hinh', ban_do='moi'. Cây phần:
--   buoi (đơn vị "Phần")  →  hl_mo_hinh (ref_ma = id mô hình luyện)  →  tai_lieu_cau.ma_cau = hinh_bai.ma_bai (MÃ GỐC bài kho)
-- Bài in TRỌN (đề chung + mọi ý); thứ tự bài trong mô hình do người soạn đặt. Mọi ghi qua RPC (1 transaction); nội dung đọc 1 lần
-- (fn_tl_hl_noi_dung) cho cả builder lẫn bản in.

-- ── kiểm: tài liệu là chuyên đề Hình bản đồ mới, không phải bản lưu trữ; phần thuộc tài liệu ──
create or replace function _tl_hl_kiem(p_tai_lieu uuid, p_buoi uuid) returns void language plpgsql as $$
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới soạn được tài liệu.' using errcode = '42501'; end if;
  perform 1 from tai_lieu t where t.id = p_tai_lieu and t.ban_do = 'moi' and t.nhanh = 'hinh' and t.luu_tru_tu is null for update;
  if not found then raise exception 'Tài liệu không phải chuyên đề Hình theo bản đồ mới.' using errcode = 'P0001'; end if;
  if not exists (select 1 from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'buoi') then
    raise exception 'Không thấy phần này trong tài liệu.' using errcode = 'P0001';
  end if;
end $$;

-- ── xếp lại thu_tu cả tài liệu: phần (buoi) theo thứ tự cũ, con của mỗi phần ngay sau nó theo thu_tu con ──
create or replace function _tl_hl_xep(p_tai_lieu uuid) returns void language sql as $$
  with k as (
    select p.id, row_number() over (order by coalesce(b.thu_tu, p.thu_tu), coalesce(b.id, p.id), (p.loai_phan <> 'buoi'), p.thu_tu, p.id) - 1 as tt
      from tai_lieu_phan p left join tai_lieu_phan b on b.id = p.cha_id and b.loai_phan = 'buoi'
     where p.tai_lieu_id = p_tai_lieu
  )
  update tai_lieu_phan p set thu_tu = k.tt from k where p.id = k.id and p.thu_tu is distinct from k.tt::int
$$;

-- ── Bài mặc định của 1 mô hình: bài kho GÁN CẢ BÀI vào mô hình, tự luận, không bị bỏ qua (thứ tự nhập kho) ──
create or replace function _tl_hl_bai_mac_dinh(p_mo_hinh uuid) returns text[] language sql stable as $$
  select coalesce(array_agg(b.ma_bai order by b.created_at, b.ma_bai), '{}')
    from hinh_bai b where b.mo_hinh_id = p_mo_hinh and b.bo_qua_at is null and b.loai_cau = 'tu_luan'
$$;

-- ── Nội dung (builder + in): phần → mô hình → bài (trọn ý) ──
create or replace function fn_tl_hl_noi_dung(p_tai_lieu uuid, p_buoi uuid default null) returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object(
    'tai_lieu', (select jsonb_build_object('id', t.id, 'ten', t.ten, 'khoi', t.khoi, 'mon', t.mon, 'nhanh', t.nhanh, 'loai', t.loai,
                                           'ban_do', t.ban_do, 'cau_hinh', t.cau_hinh, 'updated_at', t.updated_at)
                   from tai_lieu t where t.id = p_tai_lieu and la_thanh_vien()),
    'buoi', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'tieu_de', b.tieu_de, 'thu_tu', b.thu_tu,
        'mo_hinh', coalesce((
          select jsonb_agg(jsonb_build_object(
            'phan_id', pm.id, 'id', mh.id, 'ma', mh.ma, 'ten', mh.ten, 'gia_thiet', mh.gia_thiet, 'anh', mh.anh_cau_hinh,
            'con_tren_ban_do', mh.id is not null,
            'bai', coalesce((
              select jsonb_agg(jsonb_build_object(
                'ma_bai', tc.ma_cau, 'id', hb.id, 'de_bai', hb.de_bai, 'gia_thiet_chung', hb.gia_thiet_chung, 'anh_de', hb.anh_de,
                'con_trong_kho', hb.id is not null,
                'y', (select coalesce(jsonb_agg(jsonb_build_object('nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung, 'dap_an', y.dap_an,
                        'loi_giai', y.loi_giai, 'anh_de', y.anh_de, 'anh_loi_giai', y.anh_loi_giai, 'gia_thiet_them', y.gia_thiet_them) order by y.thu_tu), '[]'::jsonb)
                        from hinh_y y where y.bai_id = hb.id)
              ) order by tc.thu_tu)
                from tai_lieu_cau tc left join hinh_bai hb on hb.ma_bai = tc.ma_cau
               where tc.phan_id = pm.id), '[]'::jsonb)
          ) order by pm.thu_tu, pm.id)
            from tai_lieu_phan pm left join hinh_mo_hinh mh on mh.id::text = pm.ref_ma
           where pm.cha_id = b.id and pm.loai_phan = 'hl_mo_hinh'), '[]'::jsonb)
      ) order by b.thu_tu, b.id)
        from tai_lieu_phan b
       where b.tai_lieu_id = p_tai_lieu and b.loai_phan = 'buoi' and (p_buoi is null or b.id = p_buoi) and la_thanh_vien()), '[]'::jsonb))
$$;

-- ── Đặt tập mô hình của 1 phần (thứ tự = p_mo_hinh). Mô hình giữ lại ⇒ GIỮ bài đã chọn; mô hình mới ⇒ bài mặc định ──
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
  perform _tl_hl_xep(p_tai_lieu);
  update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  return fn_tl_hl_noi_dung(p_tai_lieu, p_buoi);
end $$;

-- ── Đặt danh sách bài (theo thứ tự) của 1 mô hình trong phần ──
create or replace function fn_tl_hl_dat_bai(p_phan uuid, p_ma_bai text[]) returns void
language plpgsql security definer set search_path to 'public' as $$
declare v_tl uuid; v_buoi uuid; v_mh uuid;
begin
  select p.tai_lieu_id, p.cha_id, p.ref_ma::uuid into v_tl, v_buoi, v_mh from tai_lieu_phan p where p.id = p_phan and p.loai_phan = 'hl_mo_hinh';
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

revoke execute on function _tl_hl_kiem(uuid, uuid) from public, anon;
revoke execute on function _tl_hl_xep(uuid) from public, anon;
revoke execute on function _tl_hl_bai_mac_dinh(uuid) from public, anon;
revoke execute on function fn_tl_hl_noi_dung(uuid, uuid) from public, anon;
revoke execute on function fn_tl_hl_dat_mo_hinh(uuid, uuid, uuid[]) from public, anon;
revoke execute on function fn_tl_hl_dat_bai(uuid, text[]) from public, anon;
grant execute on function fn_tl_hl_noi_dung(uuid, uuid) to authenticated;
grant execute on function fn_tl_hl_dat_mo_hinh(uuid, uuid, uuid[]) to authenticated;
grant execute on function fn_tl_hl_dat_bai(uuid, text[]) to authenticated;
grant execute on function _tl_hl_kiem(uuid, uuid) to authenticated;
grant execute on function _tl_hl_xep(uuid) to authenticated;
grant execute on function _tl_hl_bai_mac_dinh(uuid) to authenticated;
