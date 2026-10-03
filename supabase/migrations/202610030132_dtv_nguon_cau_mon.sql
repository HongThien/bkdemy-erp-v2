-- ĐẤU TỪ → KHUNG GAME MỌI MÔN (Thùy 03/10: "mỗi môn có kho content riêng, đều là MCQ — bản chất chỉ đổi chỗ cắm content").
-- 1) NGUỒN CÂU từ KHO thật (Toán · KHTN; môn nào có trong registry kho đều chạy): chọn câu bằng ĐÚNG điều kiện MCQ chung
--    `_kho_dk_mcq_sql` (kho_chuan + trắc nghiệm gốc | form trắc nghiệm đã duyệt), bảng theo `_kho_cau_tbl/_kho_ban_do_tbl` — KHÔNG
--    tự viết điều kiện riêng (CLAUDE §1.6, spec-mcq-form.md). Có form TN đã duyệt ⇒ lấy 4 phương án của form (như _kho_snapshot_cau).
--    Toán: nhánh Đại (dai_*) — Hình/HGT cắm sau qua p_nhanh.
-- 2) Ghi trận / leo tháp mang NHÃN MÔN (+ khối cho tháp): bảng xếp hạng tháp tách theo môn + khối. Hàm cũ (chỉ Anh) thành vỏ gọi hàm mới.
-- ⚠ DEMO: hàm đọc kho mở cho anon (game chưa đăng nhập) — trần 200 câu/lần gọi. Khi ghép app HS ⇒ chỉ `authenticated`.

alter table dtv_thap_luot add column if not exists nhom text not null default '';
create index if not exists dtv_thap_luot_mon on dtv_thap_luot (mon, nhom, che_do, ngay);

-- ── Khối có câu MCQ (≥ 30 câu) ──
create or replace function fn_dtv_kho_khoi(p_mon text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_kq jsonb;
begin
  if not _kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object('khoi', khoi, 'so_cau', n) order by nullif(regexp_replace(khoi, '\D', '', 'g'), '')::int, khoi), '[]'::jsonb)
    from (select b.khoi, count(*) n from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
          where c.xoa_at is null and %3$s group by b.khoi having count(*) >= 30) t$q$, v_cau, v_bd, _kho_dk_mcq_sql(v_cau))
    into v_kq;
  return v_kq;
end $$;

-- ── Chủ đề của 1 khối (≥ 8 câu MCQ) ──
create or replace function fn_dtv_kho_chu_de(p_mon text, p_khoi text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_kq jsonb;
begin
  if not _kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object('ma', ma_chu_de, 'ten', ten_chu_de, 'so_cau', n) order by ma_chu_de), '[]'::jsonb)
    from (select b.ma_chu_de, min(b.ten_chu_de) ten_chu_de, count(*) n from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
          where c.xoa_at is null and b.khoi = $1 and %3$s group by b.ma_chu_de having count(*) >= 8) t$q$, v_cau, v_bd, _kho_dk_mcq_sql(v_cau))
    using p_khoi into v_kq;
  return v_kq;
end $$;

-- ── Bộ câu MCQ: mỗi câu = đề + ảnh + ĐÚNG 4 phương án + chỉ số đáp án đúng + lời giải ──
-- p_chu_de null = cả khối. Thứ tự TẤT ĐỊNH theo p_seed (leo tháp: mọi máy cùng chuỗi). p_tang_dan = sắp theo mức độ dạng (tháp khó dần).
create or replace function fn_dtv_kho_bo_cau(p_mon text, p_khoi text, p_chu_de text, p_so integer, p_seed text, p_tang_dan boolean default false)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_form text := _kho_form_tn_cua(_kho_cau_tbl(p_mon));
  v_so integer := least(greatest(coalesce(p_so, 15), 1), 200); v_kq jsonb;
begin
  if not _kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  execute format($q$
    with c0 as (
      select c.ma_cau, c.noi_dung, c.anh_de, c.loi_giai, c.lua_chon, c.dap_an, b.ten_dang, b.muc_do,
             %4$s as form_lc
      from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
      where c.xoa_at is null and b.khoi = $1 and ($2::text is null or b.ma_chu_de = $2) and %3$s
    ), c1 as (
      select ma_cau, noi_dung, anh_de, loi_giai, ten_dang, muc_do,
        case when form_lc is not null then (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(form_lc) with ordinality t(e, o))
             else lua_chon end as opts,
        case when form_lc is not null then (select (o - 1)::int from jsonb_array_elements(form_lc) with ordinality t(e, o) where (e->>'dung')::boolean limit 1)
             else ascii(upper(trim(dap_an))) - 65 end as dung
      from c0
    )
    -- tháp khó dần TỪ TỪ: khoá = mức độ + (thứ tự trong mức)/25 ⇒ cứ ~25 tầng độ khó trung bình lên 1 bậc, vẫn trộn các mức
    , c2 as (
      select c1.*, row_number() over (partition by coalesce(muc_do, 3) order by md5(ma_cau || $3)) r
      from c1 where jsonb_typeof(opts) = 'array' and jsonb_array_length(opts) = 4 and dung between 0 and 3
    )
    select coalesce(jsonb_agg(jsonb_build_object('ma_cau', ma_cau, 'de', noi_dung, 'anh', anh_de, 'giai', loi_giai, 'dang', ten_dang,
                                                 'muc', muc_do, 'opts', opts, 'dung', dung) order by rn), '[]'::jsonb)
    from (
      select c2.*, row_number() over (order by case when $5 then coalesce(muc_do, 3) + (r - 1) / 25.0 end, md5(ma_cau || $3)) rn
      from c2
      order by case when $5 then coalesce(muc_do, 3) + (r - 1) / 25.0 end, md5(ma_cau || $3)
      limit $4
    ) t$q$,
    v_cau, v_bd, _kho_dk_mcq_sql(v_cau),
    case when v_form is null then 'null::jsonb'
         else format('(select f.lua_chon from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null limit 1)', v_form) end)
    using p_khoi, p_chu_de, coalesce(p_seed, ''), v_so, coalesce(p_tang_dan, false)
    into v_kq;
  return v_kq;
end $$;

-- ── Ghi trận có nhãn môn (logic cũ của fn_dtv_ghi_tran + cột mon) ──
create or replace function fn_dtv_ghi_tran_mon(
  p_uid text, p_mon text, p_che_do text, p_chu_de text, p_ket_qua text,
  p_so_dung integer, p_so_cau integer, p_diem integer, p_doi_thu text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_cau integer := least(greatest(coalesce(p_so_cau, 0), 0), 40);
  v_dung integer := least(greatest(coalesce(p_so_dung, 0), 0), least(greatest(coalesce(p_so_cau, 0), 0), 40));
  v_xp integer; v_hom_nay date := _dtv_hom_nay(); v_cap_truoc integer; v_cap_sau integer;
  v_luot_hom_nay integer; n dtv_nguoi_choi;
begin
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;

  v_xp := case
    when p_che_do = 'on_tap' then v_dung * 2
    when p_che_do = 'noi_tu' then least(v_dung, 30) * 2 + case p_ket_qua when 'thang' then 20 else 0 end
    else v_dung * 5 + case p_ket_qua when 'thang' then 40 when 'hoa' then 20 else 10 end
  end;
  select count(*) into v_luot_hom_nay from dtv_tran
   where uid = p_uid and (tao_at at time zone 'Asia/Ho_Chi_Minh')::date = v_hom_nay;
  if v_luot_hom_nay >= 60 then v_xp := 0; end if;

  insert into dtv_tran (uid, mon, che_do, chu_de, ket_qua, so_dung, so_cau, diem, xp, doi_thu)
  values (p_uid, coalesce(nullif(p_mon, ''), 'Tiếng Anh'), p_che_do, coalesce(nullif(p_chu_de, ''), 'tron'), p_ket_qua, v_dung, v_cau,
          least(greatest(coalesce(p_diem, 0), 0), 10000), v_xp, nullif(p_doi_thu, ''));

  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    so_tran  = n.so_tran  + case when p_che_do in ('bot','mang','giai') then 1 else 0 end,
    so_thang = n.so_thang + case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then 1 else 0 end,
    chuoi_thang = case when p_che_do not in ('bot','mang','giai') then n.chuoi_thang
                       when p_ket_qua = 'thang' then n.chuoi_thang + 1
                       when p_ket_qua = 'thua' then 0 else n.chuoi_thang end,
    chuoi_thang_max = greatest(n.chuoi_thang_max,
                       case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then n.chuoi_thang + 1 else 0 end),
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_hom_nay then n.chuoi_ngay
                      when n.ngay_hoc_cuoi = v_hom_nay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_hom_nay,
    cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi d cross join lateral _dtv_cap(d.xp) where d.uid = p_uid;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc);
end $$;

create or replace function fn_dtv_ghi_tran(
  p_uid text, p_che_do text, p_chu_de text, p_ket_qua text,
  p_so_dung integer, p_so_cau integer, p_diem integer, p_doi_thu text)
returns jsonb language sql security definer set search_path = public as $$
  select fn_dtv_ghi_tran_mon(p_uid, 'Tiếng Anh', p_che_do, p_chu_de, p_ket_qua, p_so_dung, p_so_cau, p_diem, p_doi_thu)
$$;

-- ── Bảng xếp hạng tháp theo MÔN + KHỐI (nhom = khối; Anh = '') ──
create or replace function fn_dtv_thap_bxh_mon(p_che_do text, p_mon text, p_nhom text, p_hom_nay boolean, p_uid text default null)
returns jsonb language sql stable security definer set search_path = public as $$
  with l as (
    select distinct on (t.uid) t.uid, t.tang, t.sai, t.ms, t.tao_at
    from dtv_thap_luot t
    where t.che_do = p_che_do and t.mon = p_mon and t.nhom = coalesce(p_nhom, '')
      and (not p_hom_nay or t.ngay = _dtv_hom_nay())
    order by t.uid, t.tang desc,
      case when p_che_do = 'song_con' then t.sai else t.ms end asc, t.tao_at asc
  ), x as (
    select l.*, n.ma, n.ten, n.nv,
      row_number() over (order by l.tang desc, case when p_che_do = 'song_con' then l.sai else l.ms end asc, l.tao_at asc) as hang
    from l join dtv_nguoi_choi n on n.uid = l.uid
  )
  select jsonb_build_object(
    'so_nguoi', (select count(*) from x),
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', hang, 'ma', ma, 'ten', ten, 'nv', nv, 'tang', tang, 'sai', sai, 'ms', ms) order by hang)
                     from (select * from x order by hang limit 50) t), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang', hang, 'tang', tang, 'sai', sai, 'ms', ms) from x where uid = p_uid))
$$;

create or replace function fn_dtv_thap_ghi_mon(p_uid text, p_che_do text, p_mon text, p_nhom text, p_tang integer, p_sai integer, p_ms integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ngay date := _dtv_hom_nay();
  v_tang integer := greatest(coalesce(p_tang, 0), 0);
  v_ms integer := greatest(coalesce(p_ms, 0), 0);
  v_mon text := coalesce(nullif(p_mon, ''), 'Tiếng Anh');
  v_xp integer; v_luot_hom_nay integer; n dtv_nguoi_choi; v_cap_truoc integer; v_cap_sau integer;
begin
  if p_che_do not in ('song_con','vo_tan') then raise exception 'Chế độ tháp không hợp lệ'; end if;
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;
  if v_tang > 0 and v_ms < v_tang * 400 then raise exception 'Kết quả không hợp lệ'; end if;
  if p_che_do = 'song_con' and v_ms > 302000 then v_ms := 300000; end if;

  insert into dtv_thap_luot (uid, mon, nhom, che_do, ngay, tang, sai, ms)
  values (p_uid, v_mon, coalesce(p_nhom, ''), p_che_do, v_ngay, v_tang, greatest(coalesce(p_sai, 0), 0), v_ms);

  select count(*) into v_luot_hom_nay from dtv_thap_luot where uid = p_uid and ngay = v_ngay;
  v_xp := case when v_luot_hom_nay > 30 then 0 else least(v_tang, 100) * 2 end;
  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_ngay then n.chuoi_ngay when n.ngay_hoc_cuoi = v_ngay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_ngay,
    cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi d cross join lateral _dtv_cap(d.xp) where d.uid = p_uid;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc,
    'bxh', fn_dtv_thap_bxh_mon(p_che_do, v_mon, coalesce(p_nhom, ''), true, p_uid));
end $$;

-- hàm cũ (chỉ Anh) ⇒ vỏ gọi hàm mới
create or replace function fn_dtv_thap_ghi(p_uid text, p_che_do text, p_tang integer, p_sai integer, p_ms integer)
returns jsonb language sql security definer set search_path = public as $$
  select fn_dtv_thap_ghi_mon(p_uid, p_che_do, 'Tiếng Anh', '', p_tang, p_sai, p_ms)
$$;
create or replace function fn_dtv_thap_bxh(p_che_do text, p_hom_nay boolean, p_uid text default null)
returns jsonb language sql stable security definer set search_path = public as $$
  select fn_dtv_thap_bxh_mon(p_che_do, 'Tiếng Anh', '', p_hom_nay, p_uid)
$$;

revoke all on function fn_dtv_kho_khoi(text), fn_dtv_kho_chu_de(text, text), fn_dtv_kho_bo_cau(text, text, text, integer, text, boolean),
  fn_dtv_ghi_tran_mon(text, text, text, text, text, integer, integer, integer, text),
  fn_dtv_thap_bxh_mon(text, text, text, boolean, text), fn_dtv_thap_ghi_mon(text, text, text, text, integer, integer, integer) from public;
grant execute on function fn_dtv_kho_khoi(text), fn_dtv_kho_chu_de(text, text), fn_dtv_kho_bo_cau(text, text, text, integer, text, boolean),
  fn_dtv_ghi_tran_mon(text, text, text, text, text, integer, integer, integer, text),
  fn_dtv_thap_bxh_mon(text, text, text, boolean, text), fn_dtv_thap_ghi_mon(text, text, text, text, integer, integer, integer) to anon, authenticated;
