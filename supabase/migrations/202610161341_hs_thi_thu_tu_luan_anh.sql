-- Ôn thi giữa kì I — PHA 3: TỰ LUẬN BẰNG ẢNH trong Thi thử (spec-on-thi-gk1.md, Thùy 16/10).
-- HS làm tự luận ra giấy, chụp ảnh nộp ngay tại câu. Ảnh ở bucket PRIVATE 'thi-thu-anh' (tạo bằng scripts/sql_thi_thu_anh_storage.sql —
-- storage.objects thuộc supabase_storage_admin nên không nằm trong migration). Chấm tự luận = pha 4 (TA/GV).
-- §1.5: chỉ có dòng thi_thu_anh khi có ẢNH THẬT; "chưa chấm" = câu tự luận chưa có dòng bai_lam_cau (không có ô NULL).

create table thi_thu_anh (
  id uuid primary key default gen_random_uuid(),
  bai_lam_id uuid not null references bai_lam(id) on delete cascade,
  bai_test_cau_id uuid not null references bai_test_cau(id) on delete cascade,
  path text not null,
  thu_tu integer not null default 0,
  created_at timestamptz not null default now()
);
create index thi_thu_anh_lam_cau_idx on thi_thu_anh (bai_lam_id, bai_test_cau_id);
alter table thi_thu_anh enable row level security;

-- HS chỉ ghi/xoá ảnh khi: bài làm của CHÍNH em · đang làm · bài loai thi_thu · câu tự luận của đúng bài · còn trong giờ (+2' ân hạn như trigger thi).
create or replace function public.thi_thu_anh_ghi_duoc(p_bai_lam uuid, p_cau uuid)
returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((
    select bl.hoc_sinh_id = public.my_hoc_sinh_id() and bl.trang_thai = 'dang_lam' and bt.loai = 'thi_thu'
       and bc.bai_test_id = bl.bai_test_id and bc.loai_cau = 'tu_luan'
       and (bt.thoi_gian_phut is null or now() <= bl.bat_dau_at + make_interval(mins => bt.thoi_gian_phut + 2))
    from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id join bai_test_cau bc on bc.id = p_cau
    where bl.id = p_bai_lam), false)
$$;

create policy thi_thu_anh_hs_read on thi_thu_anh for select
  using (exists (select 1 from bai_lam bl where bl.id = thi_thu_anh.bai_lam_id and bl.hoc_sinh_id = public.my_hoc_sinh_id()));
create policy thi_thu_anh_hs_insert on thi_thu_anh for insert
  with check (public.thi_thu_anh_ghi_duoc(bai_lam_id, bai_test_cau_id)
              and path like public.my_hoc_sinh_id()::text || '/%'
              and (select count(*) from thi_thu_anh a where a.bai_lam_id = thi_thu_anh.bai_lam_id and a.bai_test_cau_id = thi_thu_anh.bai_test_cau_id) < 8);
create policy thi_thu_anh_hs_delete on thi_thu_anh for delete
  using (public.thi_thu_anh_ghi_duoc(bai_lam_id, bai_test_cau_id));
create policy thi_thu_anh_staff on thi_thu_anh for all using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- _et_cham: câu tự luận KHÔNG chấm máy (nếu HS ghi chữ vào bai_lam_cau của câu tự luận thì cũng bỏ qua) — lấy thân từ bản đang chạy.
do $$
declare f record; def text; moi text;
begin
  for f in select p.oid from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname = '_et_cham' loop
    def := pg_get_functiondef(f.oid);
    if def like '%''tu_luan''%' then continue; end if;
    moi := regexp_replace(def, 'if rec\.blc_id is null then continue;', 'if rec.blc_id is null or rec.loai_cau = ''tu_luan'' then continue;', 'g');
    if moi = def then raise exception 'Không tìm thấy điều kiện để vá trong _et_cham'; end if;
    execute moi;
  end loop;
end $$;

-- Thi thử: câu tự luận VÀO lượt thi (trước pha 3 bị bỏ). Thay hàm pha 2 — chỉ đổi: nhận thêm 'tu_luan', đếm riêng.
create or replace function public.fn_hs_thi_thu_bat_dau(p_de uuid)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  tl record; v_lop uuid; v_bt uuid; r record; n int := 0; v_tl int := 0; v_bo int := 0; v_phut int;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select t.id, t.mon, t.khoi, t.cau_hinh into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null
     and coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') <> 'de_cuong';
  if tl.id is null then raise exception 'Đề thi này chưa mở cho em.'; end if;
  if public._hs_on_thi_khoi(tl.mon) is distinct from tl.khoi then raise exception 'Đề thi này không thuộc khối của em.'; end if;

  select b.id into v_bt from bai_test b where b.nguon_tai_lieu_id = p_de and b.hoc_sinh_id = v_hs and b.loai = 'thi_thu';
  if v_bt is not null then return jsonb_build_object('bai_test_id', v_bt, 'lai', true); end if;

  if (public.fn_de_thi_thieu(p_de) ->> 'so_chan')::int > 0 then
    raise exception 'Đề đang được thầy cô chỉnh sửa — em quay lại sau nhé.';
  end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, tl.mon);
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', tl.mon; end if;
  v_phut := coalesce(nullif(tl.cau_hinh -> 'deThi' ->> 'thoiGianPhut', '')::int, 90);

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, deadline, khoa_reveal, thoi_gian_phut, so_cau)
  values (p_de, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'thi_thu', tl.mon, null, false, v_phut, 0)
  returning id into v_bt;

  for r in select * from public.fn_de_thi_cau(p_de) where not xoa order by stt loop
    if r.loai_cau in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan') then
      n := n + 1;
      if r.loai_cau = 'tu_luan' then v_tl := v_tl + 1; end if;
      perform public._kho_snapshot_cau(v_bt, r.kho || '_cau_hoi', public._kho_lt_dang_tbl(r.kho), r.ma_cau, n, null);
      update bai_test_cau set diem = r.diem, phan = r.phan_tieu_de, ly_thuyet = null
       where bai_test_id = v_bt and thu_tu = n and bien_the = 1;
      if r.loai_cau = 'tra_loi_ngan' then
        update bai_test_cau set loai_cau = 'tra_loi_ngan', lua_chon = null, lua_chon_rule = null,
               form_tn_id = null, form_tn_hgt_id = null, dap_an_key = to_jsonb(btrim(r.dap_an))
         where bai_test_id = v_bt and thu_tu = n and bien_the = 1 and loai_cau <> 'tra_loi_ngan';
      end if;
    else
      v_bo := v_bo + 1;   -- loại máy chưa hỗ trợ (vd kéo thả) — bỏ khỏi lượt thi
    end if;
  end loop;
  if n = 0 then raise exception 'Đề này chưa có câu nào thi được trên app.'; end if;
  update bai_test set so_cau = n where id = v_bt;

  update bai_test_cau set kieu_nhap = 'phieu_4o'
   where bai_test_id = v_bt and loai_cau = 'tra_loi_ngan' and public._de_thi_hop_le_4o(btrim(dap_an_key #>> '{}'));
  update bai_test_cau set ma_dang = null where bai_test_id = v_bt and public._kho_la_dang_cho(ma_dang);
  return jsonb_build_object('bai_test_id', v_bt, 'lai', false, 'so_cau', n, 'so_tu_luan', v_tl, 'so_bo_qua', v_bo);
exception when unique_violation then
  select b.id into v_bt from bai_test b where b.nguon_tai_lieu_id = p_de and b.hoc_sinh_id = v_hs and b.loai = 'thi_thu';
  return jsonb_build_object('bai_test_id', v_bt, 'lai', true);
end $$;

-- Điểm Thi thử của em. Còn câu tự luận chưa có dòng chấm ⇒ dang_cham = true: CHỈ lộ phần trắc nghiệm, KHÔNG lộ điểm tổng
-- (điểm tổng + xếp hạng chỉ có sau khi chấm xong tự luận — Thùy 16/10).
create or replace function public.fn_hs_thi_thu_diem(p_bai_test uuid)
returns jsonb language sql stable security definer set search_path to 'public' as $$
  with bl as (select bl.* from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id
              where bl.bai_test_id = p_bai_test and bl.hoc_sinh_id = public.my_hoc_sinh_id()
                and bl.trang_thai = 'da_nop' and bt.loai = 'thi_thu'),
  cau as (select bc.id, bc.loai_cau, bc.phan, bc.diem, bc.thu_tu from bai_test_cau bc, bl
          where bc.bai_test_id = bl.bai_test_id and bc.bien_the = bl.bien_the),
  dat as (select c.id, c.loai_cau, coalesce(c.phan, '') phan, coalesce(blc.diem, 0) diem, (blc.id is not null) da_cham
          from cau c left join bai_lam_cau blc on blc.bai_test_cau_id = c.id and blc.bai_lam_id = (select id from bl)),
  tk as (select
           count(*) filter (where loai_cau = 'tu_luan' and not da_cham) cho,
           coalesce(sum(diem), 0) tong, coalesce(sum(diem) filter (where loai_cau <> 'tu_luan'), 0) tn
         from dat)
  select case when not exists (select 1 from bl) then null else jsonb_build_object(
    'dang_cham', (select cho from tk) > 0,
    'so_cho_cham', (select cho from tk),
    'tn_diem', (select tn from tk),
    'tn_toi_da', (select coalesce(sum(diem), 0) from cau where loai_cau <> 'tu_luan'),
    'toi_da', (select coalesce(sum(diem), 0) from cau),
    'diem', case when (select cho from tk) = 0 then (select tong from tk) end,
    'diem_10', case when (select cho from tk) = 0 and (select sum(diem) from cau) > 0
                    then round((select tong from tk) / (select sum(diem) from cau) * 10, 2) end,
    'phan', case when (select cho from tk) = 0 then
              (select coalesce(jsonb_agg(jsonb_build_object('phan', p.phan, 'toi_da', p.toi_da, 'diem', p.diem) order by p.tt), '[]'::jsonb)
                 from (select g.phan, g.toi_da, g.tt,
                              (select coalesce(sum(d.diem), 0) from dat d where d.phan = g.phan) diem
                         from (select coalesce(c.phan, '') phan, sum(c.diem) toi_da, min(c.thu_tu) tt
                                 from cau c group by 1) g) p)
            else '[]'::jsonb end
  ) end
$$;

revoke execute on function public.thi_thu_anh_ghi_duoc(uuid, uuid), public.fn_hs_thi_thu_bat_dau(uuid), public.fn_hs_thi_thu_diem(uuid) from public, anon;
grant execute on function public.thi_thu_anh_ghi_duoc(uuid, uuid), public.fn_hs_thi_thu_bat_dau(uuid), public.fn_hs_thi_thu_diem(uuid) to authenticated;
