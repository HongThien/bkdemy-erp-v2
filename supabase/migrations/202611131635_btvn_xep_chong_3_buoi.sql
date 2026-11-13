-- ============================================================================
-- 202611131635 — btvn_xep_chong_3_buoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 12–13/11, spec-muc-tieu-tuan.md §8.1): trước đây BTVN buổi N = toàn bộ câu BTVN của buổi N ⇒ mỗi nhóm bài chỉ được
--   đo MỘT lần ở nhà, làm rất nhiều câu một lúc. Nay chia việc luyện một buổi ra 3 phiếu: phiếu buổi N gồm
--   50% câu BTVN của buổi N + 30% câu của buổi N-1 + 20% câu của buổi N-2 (tỉ lệ là tham số, mặc định 5–3–2).
--   Mỗi nhóm có ET + 3 lần BTVN = 4 lần đo trong ~1,5 tuần, tổng số câu không đổi, mastery theo lần chuẩn hơn.
-- LUẬT:
--   · Giáo trình GỐC không đổi: GV vẫn soạn đủ câu BTVN cho từng buổi. Việc chia xảy ra lúc TẠO PHIẾU CỦA LỚP.
--   · Chia theo từng NHÓM của buổi, rải đều theo thứ tự câu (không cắt khúc đầu/đuôi) ⇒ phần nào cũng đủ dạng, đủ loại câu.
--     `_tl_bdm_btvn_chia` là hàm thuần của (buổi gốc, tỉ lệ) ⇒ phần 1 / 2 / 3 của một buổi luôn rời nhau.
--   · "Buổi trước" = 2 giáo trình buổi BẢN ĐỒ MỚI (Đại · HGT · KHTN — không phải Hình) gần nhất của LỚP trước ngày đó, có câu BTVN.
--     Buổi trước 1 ⇒ lấy phần 2; buổi trước 2 ⇒ lấy phần 2 + 3 còn sót.
--   · Chỉ lấy câu lớp CHƯA được giao (chưa nằm trong phiếu BTVN nào khác của lớp) ⇒ buổi đã phát trọn theo luật cũ thì không
--     còn gì để rải — tự chuyển tiếp, không cần ngày cắt; không bao giờ giao trùng câu.
--   · Phần rải lưu trong phiếu của lớp bằng loai_phan 'ontap_nhom' (mọi nơi đọc phiếu — in, chấm, test online — đã hiểu loại này)
--     + 2 cột mới lui_bac / lui_buoi để phân biệt với ÔN TẬP GV tick tay (lui_bac NULL = không áp dụng).
--   · Mục tiêu tuần: nhóm của buổi KHÔNG còn tính nhóm ôn / luyện lại trong phiếu BTVN; nhóm luyện lại được đếm thêm lần đo
--     dự kiến và ở lại Phần 1 các tuần phiếu của nó còn được chấm (spec §8.1 "một nhóm có thể nằm ở Phần 1 qua nhiều tuần").
-- MẤT GÌ (Luật xoá): KHÔNG mất gì. Thêm 2 cột nullable + 5 hàm mới; thay thân _mtt_nhom_buoi; vá 2 đoạn trong _mtt_tinh và
--   1 đoạn trong fn_tl_bdm_noi_dung NGAY TRÊN định nghĩa đang chạy (đoạn cần thay không đúng nguyên văn ⇒ dừng, không đoán).
--   fn_tl_bdm_trich_buoi GIỮ NGUYÊN (giáo trình buổi + phiếu Hình + lối lùi của client khi hàm mới chưa có).
-- ============================================================================

-- ── 1. Đánh dấu phần "luyện lại buổi trước" trong phiếu của lớp ─────────────────
alter table public.tai_lieu_phan add column if not exists lui_bac smallint;
alter table public.tai_lieu_phan add column if not exists lui_buoi uuid;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'tai_lieu_phan_lui_bac_check') then
    alter table public.tai_lieu_phan add constraint tai_lieu_phan_lui_bac_check check (lui_bac in (1, 2));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'tai_lieu_phan_lui_buoi_fkey') then
    alter table public.tai_lieu_phan add constraint tai_lieu_phan_lui_buoi_fkey
      foreign key (lui_buoi) references public.tai_lieu_phan(id) on delete set null;
  end if;
end $$;
comment on column public.tai_lieu_phan.lui_bac is 'Phần luyện lại buổi trước trong phiếu BTVN của lớp: 1 = buổi liền trước, 2 = buổi trước nữa. NULL = không áp dụng (phần thường / ôn tập GV chọn tay).';
comment on column public.tai_lieu_phan.lui_buoi is 'Mốc buổi của GIÁO TRÌNH GỐC mà phần luyện lại lấy câu. NULL = không áp dụng.';

-- ── 2. Chia câu BTVN của MỘT buổi gốc thành 3 phần theo tỉ lệ (hàm thuần) ────────
-- Từng nhóm: n1 = round(T·r1/S) (≥ 1), n2 = round(T·r2/S), n3 = phần còn lại. Câu của mỗi phần rải đều theo thứ tự câu.
create or replace function public._tl_bdm_btvn_chia(p_buoi uuid, p_ti_le integer[])
returns table(nhom text, thu_nhom integer, ma_cau text, thu integer, phan integer)
language sql stable security definer set search_path to 'public' as $$
  with r as (
    select greatest(coalesce(p_ti_le[1], 5), 0) as r1, greatest(coalesce(p_ti_le[2], 0), 0) as r2, greatest(coalesce(p_ti_le[3], 0), 0) as r3
  ),
  c as (
    select n.ref_ma as nhom, (dense_rank() over (order by n.thu_tu, n.id))::int as thu_nhom, tc.ma_cau,
           (row_number() over (partition by n.id order by x.thu_tu, x.id, tc.thu_tu, tc.id))::int as i,
           (count(*) over (partition by n.id))::int as t
      from tai_lieu_phan n
      join tai_lieu_phan x on x.cha_id = n.id and x.loai_phan = 'btvn_nhom'
      join tai_lieu_cau tc on tc.phan_id = x.id
     where n.cha_id = p_buoi and n.loai_phan = 'nhom'
  ),
  -- số câu mỗi phần của từng nhóm: phương pháp SỐ DƯ LỚN NHẤT (phần nguyên trước, câu lẻ cho phần có số dư lớn nhất)
  -- ⇒ nhóm 3 câu ra 1–1–1, 4 câu 2–1–1, 5 câu 3–1–1, 10 câu 5–3–2: nhóm ít câu vẫn đủ 3 lần đo.
  tl as (
    select g.thu_nhom, g.t, v.k,
           case when r.r1 + r.r2 + r.r3 = 0 then case when v.k = 1 then g.t else 0 end
                else (g.t * v.rk) / (r.r1 + r.r2 + r.r3) end as f,
           case when r.r1 + r.r2 + r.r3 = 0 then 0 else (g.t * v.rk) % (r.r1 + r.r2 + r.r3) end as du
      from (select distinct c.thu_nhom, c.t from c) g
      cross join r
      cross join lateral (values (1, r.r1), (2, r.r2), (3, r.r3)) v(k, rk)
  ),
  so as (
    select x.thu_nhom, x.k,
           x.f + case when row_number() over (partition by x.thu_nhom order by x.du desc, x.k)
                           <= x.t - sum(x.f) over (partition by x.thu_nhom) then 1 else 0 end as n
      from tl x
  ),
  s as (
    select c.*,
           (select so.n from so where so.thu_nhom = c.thu_nhom and so.k = 1)::int as n1,
           (select so.n from so where so.thu_nhom = c.thu_nhom and so.k = 2)::int as n2
      from c
  ),
  s1 as (select s.*, (s.n1 > 0 and (s.i * s.n1) / s.t > ((s.i - 1) * s.n1) / s.t) as p1 from s),
  s2 as (select s1.*, (row_number() over (partition by s1.thu_nhom, s1.p1 order by s1.i))::int as j from s1)
  select s2.nhom, s2.thu_nhom, s2.ma_cau, s2.i,
         case when s2.p1 then 1
              when s2.t - s2.n1 > 0 and (s2.j * s2.n2) / (s2.t - s2.n1) > ((s2.j - 1) * s2.n2) / (s2.t - s2.n1) then 2
              else 3 end
    from s2
$$;

-- ── 3. Câu LUYỆN LẠI cho phiếu của lớp ngày p_ngay: từ 2 buổi bản đồ mới gần nhất, chỉ câu lớp chưa được giao ─────
create or replace function public._tl_bdm_btvn_lui(p_lop uuid, p_ngay date, p_buoi uuid, p_ti_le integer[])
returns table(bac integer, buoi uuid, master uuid, tieu_de text, ngay date, nhom text, thu_nhom integer, ma_cau text, thu integer)
language sql stable security definer set search_path to 'public' as $$
  with truoc as (
    select z.ngay, z.nguon_id, z.buoi, (row_number() over (order by z.ngay desc))::int as bac
      from (
        select t.ngay, t.nguon_id, t.nguon_buoi::uuid as buoi
          from tai_lieu t
         where t.lop_id = p_lop and t.loai = 'giao_trinh_buoi' and t.ban_do = 'moi' and t.hoc_sinh_id is null
           and coalesce(t.nhanh, '') <> 'hinh' and t.ngay < p_ngay and t.nguon_id is not null
           and t.nguon_buoi ~ '^[0-9a-fA-F-]{36}$'
           and (p_buoi is null or t.nguon_buoi <> p_buoi::text)
           and exists (select 1 from tai_lieu_phan n
                         join tai_lieu_phan x on x.cha_id = n.id and x.loai_phan = 'btvn_nhom'
                         join tai_lieu_cau tc on tc.phan_id = x.id
                        where n.cha_id = case when t.nguon_buoi ~ '^[0-9a-fA-F-]{36}$' then t.nguon_buoi::uuid end
                          and n.loai_phan = 'nhom')
         order by t.ngay desc limit 2
      ) z
  ),
  da_giao as (   -- mọi câu đã nằm trong phiếu BTVN KHÁC của lớp (kể cả phần luyện lại / ôn tập)
    select distinct tc.ma_cau
      from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = p.id
     where t.lop_id = p_lop and t.loai = 'btvn' and t.hoc_sinh_id is null and t.ngay <> p_ngay
  )
  select tr.bac, tr.buoi, tr.nguon_id, b.tieu_de, tr.ngay, ch.nhom, ch.thu_nhom, ch.ma_cau, ch.thu
    from truoc tr
    join tai_lieu_phan b on b.id = tr.buoi
    cross join lateral public._tl_bdm_btvn_chia(tr.buoi, p_ti_le) ch
   where ((tr.bac = 1 and ch.phan = 2) or (tr.bac = 2 and ch.phan >= 2))
     and not exists (select 1 from da_giao g where g.ma_cau = ch.ma_cau)
     and (p_buoi is null or not exists (   -- câu đã có trong buổi đang gán (luyện + BTVN) ⇒ không lặp
           select 1 from tai_lieu_phan n join tai_lieu_phan x on x.cha_id = n.id join tai_lieu_cau tc on tc.phan_id = x.id
            where n.cha_id = p_buoi and tc.ma_cau = ch.ma_cau))
$$;

-- ── 4. Đề xuất phiếu xếp chồng (màn tạo phiếu gọi — GV soát rồi mới ghi) ────────
create or replace function public.fn_tl_bdm_btvn_xep_chong(p_master uuid, p_buoi uuid, p_lop uuid, p_ngay date,
                                                           p_ti_le integer[] default array[5, 3, 2])
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_nay jsonb; v_lui jsonb;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được giáo trình.' using errcode = '42501'; end if;
  if not exists (select 1 from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_master and p.loai_phan = 'buoi') then
    raise exception 'Không thấy buổi này trong giáo trình gốc.' using errcode = 'P0001';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('nhom', g.nhom, 'ten', n.ten, 'caus', g.caus, 'tong', g.tong) order by g.thu_nhom), '[]'::jsonb)
    into v_nay
    from (select ch.nhom, ch.thu_nhom, count(*)::int as tong,
                 coalesce(jsonb_agg(ch.ma_cau order by ch.thu) filter (where ch.phan = 1), '[]'::jsonb) as caus
            from public._tl_bdm_btvn_chia(p_buoi, p_ti_le) ch group by ch.nhom, ch.thu_nhom) g
    left join tl_bdm_nhom_v n on n.id = g.nhom;

  select coalesce(jsonb_agg(jsonb_build_object('bac', b.bac, 'buoi', b.buoi, 'tieu_de', b.tieu_de, 'ngay', b.ngay, 'nhom', b.nhom) order by b.bac), '[]'::jsonb)
    into v_lui
    from (select g.bac, g.buoi, g.tieu_de, g.ngay,
                 jsonb_agg(jsonb_build_object('nhom', g.nhom, 'ten', n.ten, 'caus', g.caus) order by g.thu_nhom) as nhom
            from (select l.bac, l.buoi, l.tieu_de, l.ngay, l.nhom, l.thu_nhom, jsonb_agg(l.ma_cau order by l.thu) as caus
                    from public._tl_bdm_btvn_lui(p_lop, p_ngay, p_buoi, p_ti_le) l
                   group by l.bac, l.buoi, l.tieu_de, l.ngay, l.nhom, l.thu_nhom) g
            left join tl_bdm_nhom_v n on n.id = g.nhom
           group by g.bac, g.buoi, g.tieu_de, g.ngay) b;

  return jsonb_build_object('ti_le', to_jsonb(p_ti_le), 'nay', v_nay, 'lui', v_lui);
end $$;

-- ── 5. Ghi phiếu BTVN xếp chồng của lớp (1 transaction) ─────────────────────────
-- p_phieu = { "ti_le":[5,3,2],
--             "nay":   [{"nhom":"NNB…","caus":[…]}],                       -- câu của buổi này (phải thuộc BTVN của buổi gốc)
--             "lui":   [{"bac":1,"buoi":"<mốc buổi gốc>","nhom":"NNB…","caus":[…]}],   -- luyện lại buổi trước
--             "on_tap":[{"nhom":"NNB…","caus":[…]}] }                      -- ôn tập GV chọn tay (như cũ)
create or replace function public.fn_tl_bdm_trich_btvn(p_master uuid, p_buoi uuid, p_den uuid, p_tieu_de text, p_phieu jsonb)
returns void language plpgsql security definer set search_path to 'public' as $$
declare
  v_mk uuid; v_tt int := 0; r record; c record; v_n uuid; v_c uuid; v_trung text[]; v_la text[];
  v_nay text[]; v_ds text[]; v_ghi int := 0;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới gán được giáo trình.' using errcode = '42501'; end if;
  if not exists (select 1 from tai_lieu t where t.id = p_master and t.ban_do = 'moi') then
    raise exception 'Giáo trình gốc không phải bản đồ mới.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_master and p.loai_phan = 'buoi') then
    raise exception 'Không thấy buổi này trong giáo trình gốc.' using errcode = 'P0001';
  end if;
  perform 1 from tai_lieu t where t.id = p_den and t.nguon_id = p_master and t.nguon_buoi = p_buoi::text and t.ban_do = 'moi'
    and t.loai = 'btvn' for update;
  if not found then raise exception 'Tài liệu đích không khớp giáo trình gốc / buổi / loại.' using errcode = 'P0001'; end if;
  if exists (select 1 from tai_lieu_phan p where p.tai_lieu_id = p_den) then
    raise exception 'Tài liệu đích đã có nội dung — tạo tài liệu mới rồi chép.' using errcode = 'P0001';
  end if;

  select coalesce(array_agg(distinct m), '{}') into v_nay
    from jsonb_array_elements(coalesce(p_phieu->'nay', '[]'::jsonb)) e cross join lateral jsonb_array_elements_text(e->'caus') m;

  insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de)
  values (p_den, v_tt, 'buoi', p_tieu_de) returning id into v_mk;

  -- Câu của BUỔI NÀY: giữ cây nhóm → BTVN nhóm và thứ tự câu của giáo trình gốc, chỉ chép câu được chọn.
  for r in select p.* from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'nhom' order by p.thu_tu, p.id loop
    if not exists (select 1 from tai_lieu_phan x join tai_lieu_cau tc on tc.phan_id = x.id
                    where x.cha_id = r.id and x.loai_phan = 'btvn_nhom' and tc.ma_cau = any(v_nay)) then
      continue;
    end if;
    v_tt := v_tt + 1;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, hien_lt, hien_vi_du, kieu)
    values (p_den, v_tt, 'nhom', r.ref_ma, v_mk, r.hien_lt, r.hien_vi_du, r.kieu) returning id into v_n;
    for c in select x.* from tai_lieu_phan x where x.cha_id = r.id and x.loai_phan = 'btvn_nhom' order by x.thu_tu, x.id loop
      v_tt := v_tt + 1;
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, hien_lt, hien_vi_du, kieu)
      values (p_den, v_tt, c.loai_phan, c.ref_ma, v_n, c.hien_lt, c.hien_vi_du, c.kieu) returning id into v_c;
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu)
        select v_c, tc.ma_cau, tc.thu_tu from tai_lieu_cau tc where tc.phan_id = c.id and tc.ma_cau = any(v_nay);
    end loop;
  end loop;
  select count(distinct tc.ma_cau) into v_ghi
    from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = p_den;
  if v_ghi <> cardinality(v_nay) then
    raise exception 'Có câu không thuộc BTVN của buổi này trong giáo trình gốc.' using errcode = 'P0001';
  end if;

  -- LUYỆN LẠI buổi trước: câu phải thuộc BTVN của đúng buổi gốc + nhóm đó; không trùng câu đã có trong phiếu.
  for r in select (e->>'bac')::int as bac, (e->>'buoi')::uuid as buoi, e->>'nhom' as nhom,
                  coalesce(array(select jsonb_array_elements_text(e->'caus')), '{}') as caus
             from jsonb_array_elements(coalesce(p_phieu->'lui', '[]'::jsonb)) with ordinality as z(e, o) order by o loop
    if cardinality(r.caus) = 0 then continue; end if;
    if r.bac is null or r.bac not in (1, 2) or r.buoi is null then
      raise exception 'Phần luyện lại thiếu bậc (1/2) hoặc buổi gốc.' using errcode = 'P0001';
    end if;
    v_la := array(select m from unnest(r.caus) m where not exists (
      select 1 from tai_lieu_phan b
        join tai_lieu tg on tg.id = b.tai_lieu_id and tg.ban_do = 'moi'
        join tai_lieu_phan n on n.cha_id = b.id and n.loai_phan = 'nhom' and n.ref_ma = r.nhom
        join tai_lieu_phan x on x.cha_id = n.id and x.loai_phan = 'btvn_nhom'
        join tai_lieu_cau tc on tc.phan_id = x.id
       where b.id = r.buoi and b.loai_phan = 'buoi' and tc.ma_cau = m));
    if cardinality(v_la) > 0 then
      raise exception 'Câu luyện lại không thuộc BTVN của buổi gốc: %', array_to_string(v_la, ', ') using errcode = 'P0001';
    end if;
    v_trung := array(select m from unnest(r.caus) m where exists (
      select 1 from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = p_den and tc.ma_cau = m));
    if cardinality(v_trung) > 0 then
      raise exception 'Câu luyện lại trùng câu đã có trong phiếu: %', array_to_string(v_trung, ', ') using errcode = 'P0001';
    end if;
    v_tt := v_tt + 1;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, lui_bac, lui_buoi)
    values (p_den, v_tt, 'ontap_nhom', r.nhom, v_mk, r.bac, r.buoi) returning id into v_c;
    insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_c, m, (o - 1)::int from unnest(r.caus) with ordinality as y(m, o);
  end loop;

  -- ÔN TẬP GV chọn tay (như fn_tl_bdm_trich_buoi).
  for r in select e->>'nhom' as nhom, coalesce(array(select jsonb_array_elements_text(e->'caus')), '{}') as caus
             from jsonb_array_elements(coalesce(p_phieu->'on_tap', '[]'::jsonb)) with ordinality as z(e, o) order by o loop
    if cardinality(r.caus) = 0 then continue; end if;
    v_trung := array(select m from unnest(r.caus) m where exists (
      select 1 from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = p_den and tc.ma_cau = m));
    if cardinality(v_trung) > 0 then
      raise exception 'Câu ôn tập trùng câu đã có trong phiếu: %', array_to_string(v_trung, ', ') using errcode = 'P0001';
    end if;
    v_tt := v_tt + 1;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_den, v_tt, 'ontap_nhom', r.nhom, v_mk) returning id into v_c;
    insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_c, m, (o - 1)::int from unnest(r.caus) with ordinality as y(m, o);
  end loop;

  if not exists (select 1 from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = p_den) then
    raise exception 'Phiếu không có câu nào.' using errcode = 'P0001';
  end if;
  update tai_lieu
     set cau_hinh = coalesce(cau_hinh, '{}'::jsonb) || jsonb_build_object('xepChong', coalesce(p_phieu->'ti_le', 'null'::jsonb)),
         updated_at = now()
   where id = p_den;
end $$;

-- ── 6. fn_tl_bdm_noi_dung: phần ôn tập trả thêm lui_bac / lui_buoi (vá trên bản đang chạy) ──
do $mig$
declare d text; n text; cu text := $a$'phan_id', p.id, 'id', p.ref_ma, 'ten', n.ten,$a$; c integer;
begin
  select replace(pg_get_functiondef('public.fn_tl_bdm_noi_dung(uuid,uuid)'::regprocedure), E'\r', '') into d;
  if position('lui_bac' in d) > 0 then return; end if;   -- đã vá
  c := (length(d) - length(replace(d, cu, ''))) / length(cu);
  if c <> 1 then raise exception 'fn_tl_bdm_noi_dung đã đổi: thấy % chỗ khối on_tap, cần đúng 1', c; end if;
  n := replace(d, cu, cu || $a$ 'lui_bac', p.lui_bac, 'lui_buoi', p.lui_buoi,$a$);
  execute n;
end $mig$;

-- ── 7. Mục tiêu tuần ────────────────────────────────────────────────────────────
-- 7a. Nhóm của MỘT buổi = kiến thức DẠY buổi đó: bỏ phần ôn tập / luyện lại trong phiếu BTVN của lớp.
create or replace function public._mtt_nhom_buoi(p_lop uuid, p_ngay date, p_buoi uuid)
returns text[]
language sql stable security definer set search_path to 'public' as $$
  with ot as (
    select distinct tc.ma_cau
      from tai_lieu t join tai_lieu_phan tp on tp.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'btvn' and t.hoc_sinh_id is null
       and tp.loai_phan in ('ontap', 'ontap_nhom') and tc.ma_cau is not null
  ),
  c as (
    select distinct coalesce(tc.ma_cau, '') as kc, '' as kd
      from tai_lieu t join tai_lieu_phan tp on tp.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai in ('giao_trinh_buoi', 'et', 'btvn') and t.hoc_sinh_id is null
       and tc.ma_cau is not null and tp.loai_phan not in ('ontap', 'ontap_nhom')
    union
    select distinct coalesce(sp.ma_cau, ''), coalesce(sp.ma_dang, '')
      from gami_session_problems sp
     where sp.buoi_hoc_id = p_buoi and sp.phase in ('et', 'btvn') and sp.hoc_sinh_id is null
       and not (sp.phase = 'btvn' and exists (select 1 from ot where ot.ma_cau = sp.ma_cau))
  )
  select coalesce(array_agg(distinct n) filter (where n is not null), '{}')
    from (select public._do_o_quy(public._mastery_bdm_bat(), false, c.kc, c.kd) as n from c) x
$$;

-- 7b. Nhóm ÔN / LUYỆN LẠI trong phiếu BTVN của buổi (lớp, ngày): phiếu đã tạo ⇒ đúng câu trong phiếu;
--     chưa tạo ⇒ dự kiến theo luật xếp chồng mặc định (chỉ khi lớp có giáo trình buổi bản đồ mới, không phải Hình, ngày đó).
create or replace function public._mtt_nhom_lui(p_lop uuid, p_ngay date)
returns text[]
language sql stable security definer set search_path to 'public' as $$
  with phieu as (
    select t.id from tai_lieu t where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'btvn' and t.hoc_sinh_id is null
  ),
  c as (
    select tc.ma_cau
      from phieu f join tai_lieu_phan tp on tp.tai_lieu_id = f.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where tp.loai_phan in ('ontap', 'ontap_nhom') and tc.ma_cau is not null
    union
    select l.ma_cau
      from public._tl_bdm_btvn_lui(p_lop, p_ngay, null, array[5, 3, 2]) l
     where not exists (select 1 from phieu)
       and exists (select 1 from tai_lieu t where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'giao_trinh_buoi'
                      and t.ban_do = 'moi' and coalesce(t.nhanh, '') <> 'hinh' and t.hoc_sinh_id is null)
  )
  select coalesce(array_agg(distinct n) filter (where n is not null), '{}')
    from (select public._do_o_quy(public._mastery_bdm_bat(), false, c.ma_cau, '') as n from c) x
$$;

-- 7c. _mtt_tinh: buổi thuộc cửa sổ mang thêm 'lui'; nhóm luyện lại +1 lần đo dự kiến và thuộc Phần 1.
do $mig$
declare
  d text; n text; c integer;
  a_cu text := replace($a$           'nhom', to_jsonb(public._mtt_nhom_buoi(b.lop_id, b.ngay, b.id))) order by b.ngay, b.gio_bat_dau), '[]'::jsonb)$a$, E'\r', '');
  a_moi text := replace($a$           'nhom', to_jsonb(public._mtt_nhom_buoi(b.lop_id, b.ngay, b.id)),
           'lui', case when coalesce(b.sau between v_tu and v_toi, false)
                       then to_jsonb(public._mtt_nhom_lui(b.lop_id, b.ngay)) else '[]'::jsonb end) order by b.ngay, b.gio_bat_dau), '[]'::jsonb)$a$, E'\r', '');
  b_cu text := replace($a$    select n.value #>> '{}' as ma,
           sum((case when (bb.b->>'w')::boolean then 1 else 0 end) + (case when (bb.b->>'s')::boolean then 1 else 0 end))::int as k,
           bool_or((bb.b->>'s')::boolean) as trong_cua_so,
           jsonb_agg(distinct bb.b->'ngay') filter (where (bb.b->>'s')::boolean) as ngay_hoc
      from bb cross join lateral jsonb_array_elements(bb.b->'nhom') n
     group by 1
  ),$a$, E'\r', '');
  b_moi text := replace($a$    -- 13/11 BTVN xếp chồng: nhóm luyện lại trong phiếu của buổi cửa sổ (lui) = thêm 1 lần đo, vẫn thuộc Phần 1
    select x.ma, sum(x.k)::int as k, bool_or(x.s) as trong_cua_so,
           jsonb_agg(distinct x.ngay) filter (where x.s and x.goc) as ngay_hoc
      from (
        select n.value #>> '{}' as ma,
               (case when (bb.b->>'w')::boolean then 1 else 0 end) + (case when (bb.b->>'s')::boolean then 1 else 0 end) as k,
               (bb.b->>'s')::boolean as s, true as goc, bb.b->'ngay' as ngay
          from bb cross join lateral jsonb_array_elements(bb.b->'nhom') n
        union all
        select n.value #>> '{}', 1, true, false, bb.b->'ngay'
          from bb cross join lateral jsonb_array_elements(coalesce(bb.b->'lui', '[]'::jsonb)) n
         where not coalesce(bb.b->'nhom', '[]'::jsonb) @> jsonb_build_array(n.value)
      ) x
     group by 1
  ),$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_tinh(uuid,text,date,timestamptz)'::regprocedure), E'\r', '') into d;
  if position('_mtt_nhom_lui' in d) > 0 then return; end if;   -- đã vá
  c := (length(d) - length(replace(d, a_cu, ''))) / length(a_cu);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: thấy % chỗ dựng buổi, cần đúng 1', c; end if;
  n := replace(d, a_cu, a_moi);
  c := (length(n) - length(replace(n, b_cu, ''))) / length(b_cu);
  if c <> 1 then raise exception '_mtt_tinh đã đổi: thấy % chỗ đếm lần đo (n1), cần đúng 1', c; end if;
  n := replace(n, b_cu, b_moi);
  execute n;
end $mig$;

-- ── 8. Quyền ────────────────────────────────────────────────────────────────────
do $$
declare f text;
begin
  foreach f in array array[
    '_tl_bdm_btvn_chia(uuid,integer[])', '_tl_bdm_btvn_lui(uuid,date,uuid,integer[])', '_mtt_nhom_lui(uuid,date)'] loop
    execute format('revoke all on function public.%s from public, anon, authenticated', f);
    execute format('grant execute on function public.%s to service_role', f);
  end loop;
  foreach f in array array[
    'fn_tl_bdm_btvn_xep_chong(uuid,uuid,uuid,date,integer[])', 'fn_tl_bdm_trich_btvn(uuid,uuid,uuid,text,jsonb)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated, service_role', f);
  end loop;
end $$;
