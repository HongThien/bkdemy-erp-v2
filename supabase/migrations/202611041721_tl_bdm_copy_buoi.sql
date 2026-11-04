-- Copy MỘT BUỔI (buổi + nhóm + dạng_bài + nhom_chua_phan + btvn_nhom + chua_khop + câu + cau_hinh)
-- từ giáo trình bản đồ mới của lớp A sang giáo trình của lớp B. 1 transaction duy nhất.
--
-- BUG cũ (28/10): copyBuoiBdm ở client chỉ insert phần theo tuyến tính, KHÔNG map cha_id ⇒
-- các phần con mới ở đích có cha_id = id CŨ (hoặc NULL) nên fn_tl_bdm_noi_dung đọc theo cha_id
-- không ra gì ⇒ buổi mới hiển thị rỗng. Thùy báo 04/11.
--
-- Fix: đi theo CẤY cha_id, insert theo thứ tự cha trước con, giữ map OLD→NEW, set cha_id mới.
-- Mọi thao tác trong 1 RPC (CLAUDE.md §2.0 — nghiệp vụ nhiều bảng ở DB, không ở client).

create or replace function fn_tl_bdm_copy_buoi(
  p_buoi_nguon uuid,
  p_tai_lieu_dich uuid,
  p_ten_moi text default null
) returns table (buoi_moi_id uuid, so_phan int, so_cau int)
language plpgsql as $$
declare
  v_tl_nguon uuid; v_tieu_de text; v_noi_dung text;
  v_buoi_moi uuid; v_tt int;
  v_so_phan int := 1;  -- tính cả buổi
  v_so_cau int := 0;
  v_map jsonb := '{}'::jsonb;  -- (old id)::text → (new id)::text
  r record;
  v_cha_moi uuid; v_id_moi uuid;
  v_ma_cau_copy text[];
  v_ch_nguon jsonb; v_ch_dich jsonb; v_ch_moi jsonb;
  v_k text;
  v_khoa text[] := array['btvnLinesByCau','colByCau','hinhCheDoByCau','anhMmByCau','anhPctByCau','etFormByCau','diemByCau'];
begin
  -- 1) Kiểm buổi nguồn
  select p.tai_lieu_id, p.tieu_de, p.noi_dung
    into v_tl_nguon, v_tieu_de, v_noi_dung
    from tai_lieu_phan p
   where p.id = p_buoi_nguon and p.loai_phan = 'buoi';
  if v_tl_nguon is null then
    raise exception 'Phần % không phải buổi hợp lệ', p_buoi_nguon using errcode = 'P0001';
  end if;
  if not exists (select 1 from tai_lieu where id = p_tai_lieu_dich) then
    raise exception 'Tài liệu đích % không tồn tại', p_tai_lieu_dich using errcode = 'P0001';
  end if;

  -- 2) thứ tự bắt đầu ở đích (đẩy xuống cuối)
  select coalesce(max(thu_tu), -1) + 1 into v_tt from tai_lieu_phan where tai_lieu_id = p_tai_lieu_dich;

  -- 3) Insert buổi mới (cha_id = null)
  insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung)
  values (p_tai_lieu_dich, v_tt, 'buoi', null, coalesce(nullif(trim(p_ten_moi), ''), v_tieu_de), v_noi_dung)
  returning id into v_buoi_moi;
  v_tt := v_tt + 1;
  v_map := v_map || jsonb_build_object(p_buoi_nguon::text, v_buoi_moi::text);

  -- 4) Copy câu của chính buổi (nếu có — hiếm)
  insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
  select v_buoi_moi, c.ma_cau, c.thu_tu, c.diem
    from tai_lieu_cau c
   where c.phan_id = p_buoi_nguon;

  -- 5) DFS theo cha_id, copy từng phần — thứ tự: cha trước con (depth tăng), cùng depth theo thu_tu
  for r in
    with recursive t as (
      select p.*, 1 as depth
        from tai_lieu_phan p
       where p.cha_id = p_buoi_nguon
      union all
      select p.*, t.depth + 1
        from tai_lieu_phan p
        join t on p.cha_id = t.id
    )
    select * from t order by depth, thu_tu, id
  loop
    v_cha_moi := (v_map ->> r.cha_id::text)::uuid;
    if v_cha_moi is null then
      continue;  -- phần không nối được vào cây (bất thường) — bỏ qua an toàn
    end if;
    insert into tai_lieu_phan (
      tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung,
      kieu, hien_lt, hien_vi_du, diem_moi_cau, nang_cao, cha_id
    ) values (
      p_tai_lieu_dich, v_tt, r.loai_phan, r.ref_ma, r.tieu_de, r.noi_dung,
      coalesce(r.kieu, 'thuong'),
      coalesce(r.hien_lt, true),
      coalesce(r.hien_vi_du, true),
      r.diem_moi_cau,
      coalesce(r.nang_cao, false),
      v_cha_moi
    ) returning id into v_id_moi;
    v_tt := v_tt + 1;
    v_so_phan := v_so_phan + 1;
    v_map := v_map || jsonb_build_object(r.id::text, v_id_moi::text);

    -- Câu của phần này
    insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
    select v_id_moi, c.ma_cau, c.thu_tu, c.diem
      from tai_lieu_cau c
     where c.phan_id = r.id;
  end loop;

  -- 6) Danh sách ma_cau đã copy (để merge cau_hinh chỉ các khoá liên quan)
  select coalesce(array_agg(distinct c.ma_cau), '{}')
    into v_ma_cau_copy
    from tai_lieu_cau c
   where c.phan_id in (
     select (v_map ->> k)::uuid
       from jsonb_object_keys(v_map) k
   );
  v_so_cau := coalesce(array_length(v_ma_cau_copy, 1), 0);

  -- 7) Merge cau_hinh: lấy 7 khoá "<…>ByCau", chỉ sao các ma_cau vừa copy, đè map đích
  select cau_hinh into v_ch_nguon from tai_lieu where id = v_tl_nguon;
  select cau_hinh into v_ch_dich  from tai_lieu where id = p_tai_lieu_dich;
  v_ch_nguon := coalesce(v_ch_nguon, '{}'::jsonb);
  v_ch_dich  := coalesce(v_ch_dich,  '{}'::jsonb);
  v_ch_moi   := v_ch_dich;

  if v_so_cau > 0 then
    foreach v_k in array v_khoa loop
      if v_ch_nguon ? v_k then
        declare
          v_src jsonb := v_ch_nguon -> v_k;
          v_dst jsonb := coalesce(v_ch_moi -> v_k, '{}'::jsonb);
          v_ma text;
        begin
          foreach v_ma in array v_ma_cau_copy loop
            if v_src ? v_ma then
              v_dst := v_dst || jsonb_build_object(v_ma, v_src -> v_ma);
            end if;
          end loop;
          v_ch_moi := v_ch_moi || jsonb_build_object(v_k, v_dst);
        end;
      end if;
    end loop;
  end if;

  update tai_lieu
     set cau_hinh = v_ch_moi, updated_at = now()
   where id = p_tai_lieu_dich;

  return query select v_buoi_moi, v_so_phan, v_so_cau;
end $$;

grant execute on function fn_tl_bdm_copy_buoi(uuid, uuid, text) to authenticated;
