-- Thùy 23/09: "xứng đáng làm 1 tab riêng theo dõi các ca retest". Retest tầng 2 = bài `bai_test.loai='retest'` sinh lúc đóng ca, ngày = buổi
-- thường kế tiếp của lớp em (TA lớp đưa iPad sau ET). Không xếp lịch — nhưng cần THEO DÕI: ai chờ làm, ai quá hạn (đo 23/09: 4/6 quá hạn),
-- ai đã nộp kết quả ra sao, dạng nào đạt/trượt. Quá hạn thì OPS DỜI NGÀY (buổi thường kế tiếp) — chỉ đổi `bai_test.ngay`, không tạo gì mới.
-- Tên dạng theo ĐÚNG bản đồ của môn (§1.6 — không hardcode bảng Toán).
create or replace function public._kho_ten_dang(p_mon text, p_ma_dang text) returns text
language plpgsql stable security definer set search_path = public as $$
declare v text; v_tbl text := public._kho_ban_do_tbl(p_mon);
begin
  if v_tbl is null or p_ma_dang is null then return null; end if;
  execute format('select ten_dang from %I where ma_dang = $1 limit 1', v_tbl) into v using p_ma_dang;
  return v;
end $$;

create or replace function public.fn_btyeu_retest_theo_doi(p_mon text default null, p_so_ngay_nop integer default 14) returns jsonb
language sql stable security definer set search_path = public as $$
  with hom_nay as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d)
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'bai_test_id', bt.id, 'ngay', bt.ngay, 'mon', bt.mon, 'so_cau', bt.so_cau, 'trang_thai_bai', bt.trang_thai,
    'hoc_sinh_id', hs.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'lop', l.ten_lop, 'lop_id', bt.lop_id,
    'ta_lop', (select ns.ho_ten from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id where pc.lop_id = bt.lop_id and pc.vai_tro = 'tg' order by pc.la_chinh desc nulls last limit 1),
    'case_id', hh.bo_tro_yeu_id, 'ca_ngay', b.ngay, 'ca_nguoi', nsc.ho_ten,
    'da_nop', bl.trang_thai = 'da_nop', 'nop_at', bl.nop_at,
    'so_dung', (select count(*) from bai_lam_cau blc where blc.bai_lam_id = bl.id and blc.verdict = 'correct'),
    'qua_han', bt.ngay < hn.d and bl.trang_thai is distinct from 'da_nop',
    'tre_ngay', case when bt.ngay < hn.d and bl.trang_thai is distinct from 'da_nop' then hn.d - bt.ngay else 0 end,
    'dang', (select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', x.ten_dang, 'so_cau', x.n, 'so_dung', x.dung, 'dat', d.dat, 'diem', d.retest_diem) order by x.ma_dang), '[]'::jsonb)
             from (select k.ma_dang, max(coalesce(bd.ten_dang, k.ma_dang)) ten_dang, count(*) n, count(*) filter (where blc.verdict = 'correct') dung
                   from bai_test_cau k left join bai_lam_cau blc on blc.bai_test_cau_id = k.id and blc.bai_lam_id = bl.id
                   left join lateral (select public._kho_ten_dang(bt.mon, k.ma_dang) as ten_dang) bd on true
                   where k.bai_test_id = bt.id group by k.ma_dang) x
             left join bo_tro_yeu_dang d on d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.ma_dang = x.ma_dang)
  ) order by (bl.trang_thai = 'da_nop'), bt.ngay, l.ten_lop, hs.ho_ten), '[]'::jsonb) end
  from bai_test bt
  join hoc_sinh hs on hs.id = bt.hoc_sinh_id
  left join lop l on l.id = bt.lop_id
  left join buoi_hoc b on b.id = bt.buoi_hoc_id
  left join nhan_su nsc on nsc.id = b.nguoi_day_tg
  left join buoi_hoc_hs hh on hh.buoi_hoc_id = bt.buoi_hoc_id and hh.hoc_sinh_id = bt.hoc_sinh_id and hh.bo_tro_yeu_id is not null
  left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id, hom_nay hn
  where bt.loai = 'retest' and (p_mon is null or bt.mon = p_mon)
    and (bl.trang_thai is distinct from 'da_nop' or bl.nop_at >= hn.d - greatest(1, coalesce(p_so_ngay_nop, 14)))
$$;
grant execute on function public.fn_btyeu_retest_theo_doi(text, integer) to authenticated;

-- Dời ngày retest (quá hạn / em nghỉ buổi đó): chỉ bài chưa nộp; ngày mới ≥ hôm nay.
create or replace function public.fn_btyeu_retest_doi_ngay(p_bai_test uuid, p_ngay date) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự dời được ngày retest.'; end if;
  if p_ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date then raise exception 'Ngày retest mới phải từ hôm nay trở đi.'; end if;
  if exists (select 1 from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id where bt.id = p_bai_test and bl.trang_thai = 'da_nop') then
    raise exception 'Bài retest đã nộp — không dời được.'; end if;
  update bai_test set ngay = p_ngay where id = p_bai_test and loai = 'retest';
  if not found then raise exception 'Không thấy bài retest.'; end if;
end $$;
grant execute on function public.fn_btyeu_retest_doi_ngay(uuid, date) to authenticated;
