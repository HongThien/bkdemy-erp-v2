-- Thùy 15/10: "đổi logic Học từ đầu thành nguyên 1 cái Bổ trợ Đuổi — mục tiêu do giáo viên set, HS tự hoàn thành ở nhà, đến buổi TA giúp phần còn dở,
-- HS lẫn TA nhìn rõ tiến trình". Chốt: (1) khoá tuần tự giữ cho HS, TA được MỞ TAY; (2) dạng ngoài mục tiêu ẨN HẲN (muốn học thêm ⇒ ra phần Học tập).
-- Gốc vấn đề (đo 15/10: 16 đợt · 182 dạng · xong 68): htd_lo_trinh mở rộng ra CẢ chuyên đề của dạng được chọn ⇒ HS thấy nhiều dạng hơn mục tiêu, còn TA/ERP đếm
-- "x/y" theo đúng dạng được chọn ⇒ hai con số không bao giờ trùng, HS không có chỗ nào thấy "mình xong bao nhiêu trên tổng".
-- Việc làm:
--   1. hoc_tu_dau_dang + mo_tay_at/mo_tay_boi (TA mở tay dạng đang khoá — một sự kiện thật, không đẻ dòng chờ).
--   2. _duoi_tien_do_dang: tiến độ MỘT dạng của MỘT em (đọc lý thuyết · số câu luyện đúng/làm · số lần test + % lần gần nhất · xong lúc nào · làm Ở NHÀ hay TẠI CA).
--   3. _duoi_lo_trinh(hs, mon) = htd_lo_trinh cũ theo tham số HS, nhưng CHỈ gồm dạng mục tiêu + thêm các trường tiến độ; htd_lo_trinh(mon) thành vỏ gọi nó
--      (giữ chữ ký 1 tham số — app HS cũ vẫn chạy).
--   4. fn_duoi_tien_trinh(hs): tổng tiến trình từng đợt đuổi (dạng + buổi + đếm nhà/ca) — HS gọi không tham số, nhân sự truyền hs.
--   5. fn_duoi_mo_dang: TA mở tay.
-- "Làm ở CA" = bài test do TA sinh trên giấy (bai_test.buoi_hoc_id) HOẶC nộp đúng ngày có buổi đuổi của em mà em có mặt; còn lại = ở nhà.
alter table public.hoc_tu_dau_dang add column if not exists mo_tay_at timestamptz;
alter table public.hoc_tu_dau_dang add column if not exists mo_tay_boi uuid references public.nhan_su(id);
comment on column public.hoc_tu_dau_dang.mo_tay_at is 'TA mở tay dạng đang khoá tuần tự (15/10). Chỉ có giá trị khi TA thật sự mở.';

create or replace function public._duoi_tien_do_dang(p_hs uuid, p_mon text, p_dangs text[])
returns table(ma_dang text, doc_lt boolean, luyen_cau integer, luyen_dung integer, test_lan integer, test_gan_nhat numeric,
              xong boolean, xong_at timestamptz, noi_lam text, mo_tay boolean)
language sql stable security definer set search_path = public as $$
  select d.ma_dang,
         (h.doc_ly_thuyet_at is not null),
         coalesce(l.n, 0)::int, coalesce(l.dung, 0)::int,
         coalesce(t.lan, 0)::int, t.gan_nhat,
         (h.test_nop_at is not null), h.test_nop_at,
         case when h.test_nop_at is null then null
              when exists (select 1 from bai_test bt where bt.id = h.test_bai_test_id and bt.buoi_hoc_id is not null)
                or exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                           where hh.hoc_sinh_id = p_hs and hh.bo_tro_duoi_id is not null and hh.diem_danh = 'co_mat' and b.trang_thai <> 'huy'
                             and b.ngay = (h.test_nop_at at time zone 'Asia/Ho_Chi_Minh')::date)
              then 'ca' else 'nha' end,
         (h.mo_tay_at is not null)
  from unnest(p_dangs) as d(ma_dang)
  left join hoc_tu_dau_dang h on h.hoc_sinh_id = p_hs and h.mon = p_mon and h.ma_dang = d.ma_dang
  left join lateral (
    select count(*) as n, count(*) filter (where blc.verdict = 'correct') as dung
    from bai_test bt
    join bai_test_cau btc on btc.bai_test_id = bt.id and btc.ma_dang = d.ma_dang
    join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = p_hs
    join bai_lam_cau blc on blc.bai_lam_id = bl.id and blc.bai_test_cau_id = btc.id and blc.verdict is not null
    where bt.hoc_sinh_id = p_hs and bt.mon = p_mon and bt.loai = 'htd_luyen') l on true
  left join lateral (
    select count(*) as lan, (array_agg(round(100.0 * s.dung / nullif(s.tong, 0)) order by s.nop_at desc))[1] as gan_nhat
    from (select bl.id, bl.nop_at, count(*) as tong, count(*) filter (where blc.verdict = 'correct') as dung
          from bai_test bt
          join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = p_hs and bl.trang_thai = 'da_nop'
          join bai_lam_cau blc on blc.bai_lam_id = bl.id
          where bt.hoc_sinh_id = p_hs and bt.mon = p_mon and bt.loai = 'htd_test'
            and exists (select 1 from bai_test_cau c2 where c2.bai_test_id = bt.id and c2.ma_dang = d.ma_dang)
          group by bl.id, bl.nop_at) s) t on true
$$;
revoke all on function public._duoi_tien_do_dang(uuid, text, text[]) from public, anon;

CREATE OR REPLACE FUNCTION public._duoi_lo_trinh(p_hs uuid, p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := p_hs;
  v_dang_can text[];
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  select coalesce(array_agg(distinct bdd.ma_dang), '{}') into v_dang_can
    from bo_tro_duoi bd join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    where bd.hoc_sinh_id = v_hs and bd.trang_thai = 'can_duoi';
  if array_length(v_dang_can, 1) is null then return '[]'::jsonb; end if;

  if p_mon = 'Toán' then
    v_dk := public._kho_dk_online_hs_sql('dai_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
      from dai_ban_do bd
      join lateral (select count(*) as tong_cau from dai_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_dang = any($1)
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;

    v_dk := public._kho_dk_online_hs_sql('hgt_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
      from hgt_ban_do bd
      join lateral (select count(*) as tong_cau from hgt_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_dang = any($1)
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng lấy qua REGISTRY, không gõ tên bảng (CLAUDE §1.6)
    v_dk := public._kho_dk_online_hs_sql(public._kho_cau_tbl(p_mon, null));
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
      from %1$I bd
      join lateral (select count(*) as tong_cau from %2$I c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %3$s) c on true
      where bd.ma_dang = any($1)
    $q$, public._kho_ban_do_tbl(p_mon, null), public._kho_cau_tbl(p_mon, null), v_dk) into v_part using v_dang_can;
    v_out := v_part;
  end if;

  -- Tuần tự mở/khoá THEO ĐỘ KHÓ trong từng chuyên đề của MỤC TIÊU (1→2→3…, cùng độ khó theo ma_dang). Dạng đã xong, hoặc TA đã MỞ TAY
  -- (hoc_tu_dau_dang.mo_tay_at) thì luôn mở. Tiến độ chi tiết (luyện · test · nơi làm) lấy từ _duoi_tien_do_dang — MỘT nguồn cho HS, TA và ERP.
  with td as (
    select * from public._duoi_tien_do_dang(v_hs, p_mon, coalesce((select array_agg(x->>'ma_dang') from jsonb_array_elements(v_out) x), '{}'))
  ), base as (
    select x, td.*
    from jsonb_array_elements(v_out) x
    left join td on td.ma_dang = x->>'ma_dang'
  ), tuan_tu as (
    select base.*,
           lag(base.xong) over (partition by x->>'ma_chuyen_de' order by coalesce((x->>'muc_do')::int, 3), x->>'ma_dang') as xong_truoc
    from base
  )
  select coalesce(jsonb_agg(
    x || jsonb_build_object(
      'doc_ly_thuyet', coalesce(doc_lt, false), 'xong', coalesce(xong, false),
      'mo', coalesce(xong, false) or coalesce(mo_tay, false) or coalesce(xong_truoc, true),
      'luyen_cau', coalesce(luyen_cau, 0), 'luyen_dung', coalesce(luyen_dung, 0),
      'test_lan', coalesce(test_lan, 0), 'test_gan_nhat', test_gan_nhat,
      'xong_at', xong_at, 'noi_lam', noi_lam, 'mo_tay', coalesce(mo_tay, false))
    order by x->>'ma_chu_de', x->>'ma_chuyen_de', coalesce((x->>'muc_do')::int, 3), x->>'ma_dang'
  ), '[]'::jsonb)
  into v_out
  from tuan_tu;

  return v_out;
end $function$;
revoke all on function public._duoi_lo_trinh(uuid, text) from public, anon;

create or replace function public.htd_lo_trinh(p_mon text)
returns jsonb language sql stable security definer set search_path = public as $$
  select public._duoi_lo_trinh(public.my_hoc_sinh_id(), p_mon)
$$;

create or replace function public.fn_duoi_tien_trinh(p_hoc_sinh uuid default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid; r record; d record; v_out jsonb := '[]'::jsonb; v_dangs jsonb; v_buoi jsonb; v_path jsonb;
  v_nh text; v_bd text; v_cd text; v_tcd text; v_md smallint; v_item jsonb; v_tt text; v_mo boolean;
begin
  if p_hoc_sinh is null then v_hs := public.my_hoc_sinh_id();
  else
    if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
    v_hs := p_hoc_sinh;
  end if;
  if v_hs is null then return '[]'::jsonb; end if;

  for r in select bd.id, bd.so_buoi_du_kien, bd.created_at, l.mon, l.ten_lop
           from bo_tro_duoi bd join lop l on l.id = bd.lop_id
           where bd.hoc_sinh_id = v_hs and bd.trang_thai = 'can_duoi' order by bd.created_at loop
    v_path := public._duoi_lo_trinh(v_hs, r.mon);
    v_dangs := '[]'::jsonb;
    for d in select bdd.ma_dang from bo_tro_duoi_dang bdd where bdd.bo_tro_duoi_id = r.id order by bdd.created_at, bdd.ma_dang loop
      v_item := (select x from jsonb_array_elements(v_path) x where x->>'ma_dang' = d.ma_dang limit 1);
      if v_item is not null then
        v_tt := case when (v_item->>'xong')::boolean then 'xong'
                     when (v_item->>'doc_ly_thuyet')::boolean or (v_item->>'luyen_cau')::int > 0 or (v_item->>'test_lan')::int > 0 then 'dang_hoc'
                     when (v_item->>'mo')::boolean then 'toi_luot'
                     else 'khoa' end;
        v_dangs := v_dangs || jsonb_build_array(v_item || jsonb_build_object('trang_thai', v_tt, 'tren_app', true));
      else
        -- dạng không nằm trong lộ trình app (vd Bài Hình học, hoặc bản đồ không có): vẫn thuộc mục tiêu, học + chấm trên giấy với TA
        v_nh := public._kho_nhanh_cua_dang(r.mon, d.ma_dang);
        v_bd := public._kho_ban_do_tbl(r.mon, v_nh);
        v_cd := null; v_tcd := null; v_md := null;
        begin
          execute format('select ma_chuyen_de, ten_chuyen_de, muc_do from %I where ma_dang = $1 limit 1', v_bd) into v_cd, v_tcd, v_md using d.ma_dang;
        exception when others then null; end;
        v_dangs := v_dangs || jsonb_build_array(jsonb_build_object(
          'ma_dang', d.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(r.mon, d.ma_dang), d.ma_dang),
          'ma_chuyen_de', v_cd, 'ten_chuyen_de', coalesce(v_tcd, ''), 'muc_do', v_md,
          'xong', coalesce((select td.xong from public._duoi_tien_do_dang(v_hs, r.mon, array[d.ma_dang]) td), false),
          'doc_ly_thuyet', false, 'mo', true, 'tong_cau', 0, 'luyen_cau', 0, 'luyen_dung', 0, 'test_lan', 0, 'test_gan_nhat', null, 'noi_lam', null, 'mo_tay', false,
          'trang_thai', case when coalesce((select td.xong from public._duoi_tien_do_dang(v_hs, r.mon, array[d.ma_dang]) td), false) then 'xong' else 'giay' end,
          'tren_app', false));
      end if;
    end loop;

    select coalesce(jsonb_agg(jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'trang_thai', b.trang_thai,
             'diem_danh', hh.diem_danh, 'xong', (b.danh_gia_xong_at is not null)) order by b.ngay, b.gio_bat_dau nulls last), '[]'::jsonb)
      into v_buoi
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
      where hh.bo_tro_duoi_id = r.id and b.trang_thai <> 'huy';

    v_out := v_out || jsonb_build_array(jsonb_build_object(
      'bo_tro_duoi_id', r.id, 'mon', r.mon, 'lop', r.ten_lop, 'so_buoi_du_kien', r.so_buoi_du_kien, 'created_at', r.created_at,
      'dangs', v_dangs, 'buoi', v_buoi,
      'tong', jsonb_array_length(v_dangs),
      'xong', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'xong'),
      'dang_hoc', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'dang_hoc'),
      'tai_nha', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'noi_lam' = 'nha'),
      'tai_ca', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'noi_lam' = 'ca'),
      'giay', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'giay'),
      'so_buoi_xong', (select count(*) from jsonb_array_elements(v_buoi) x where (x->>'xong')::boolean and x->>'diem_danh' = 'co_mat')));
  end loop;
  return v_out;
end $$;
revoke all on function public.fn_duoi_tien_trinh(uuid) from public, anon;
grant execute on function public.fn_duoi_tien_trinh(uuid) to authenticated, service_role;

create or replace function public.fn_duoi_mo_dang(p_hoc_sinh uuid, p_mon text, p_ma_dang text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public._btyeu_my_ns();
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not exists (select 1 from bo_tro_duoi bd join bo_tro_duoi_dang d on d.bo_tro_duoi_id = bd.id
                 where bd.hoc_sinh_id = p_hoc_sinh and bd.trang_thai = 'can_duoi' and d.ma_dang = p_ma_dang) then
    raise exception 'Dạng này không thuộc mục tiêu đuổi đang mở của em.';
  end if;
  insert into hoc_tu_dau_dang (hoc_sinh_id, mon, ma_dang, mo_tay_at, mo_tay_boi)
    values (p_hoc_sinh, p_mon, p_ma_dang, now(), v_ns)
    on conflict (hoc_sinh_id, mon, ma_dang) do update set mo_tay_at = now(), mo_tay_boi = v_ns;
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.fn_duoi_mo_dang(uuid, text, text) from public, anon;
grant execute on function public.fn_duoi_mo_dang(uuid, text, text) to authenticated, service_role;
