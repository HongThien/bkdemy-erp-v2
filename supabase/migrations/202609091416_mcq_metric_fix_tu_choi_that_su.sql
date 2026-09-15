-- MCQ FORM — SỬA fn_mcq_metric: "Từ chối" đang đếm NHẦM cả form bị XOÁ-KHO-RÁC để SINH LẠI (rotation fix 09/09,
-- Thùy chốt 4 rule tích=0 rồi CTO xoá 233 form cũ để sinh lại theo engine mới — kho rác đúng luật §2 nhưng KHÔNG
-- qua fn_mcq_form_tu_choi nên tu_choi_boi/tu_choi_ly_do đều NULL). Công thức cũ chỉ lọc `xoa_at is not null and
-- not da_duyet` — không phân biệt được "người TỪ CHỐI thật" (luôn có tu_choi_boi) với "hệ thống thay bản mới".
-- Đo lại: 257/257 dòng "từ chối" hiện tại đều là kho rác do sinh lại, KHÔNG PHẢI ai từ chối — Precision AI hiển
-- thị sai (5% thay vì đúng ra phải cao hơn nhiều vì mẫu số bị thổi phồng bởi 257 dòng không liên quan).
create or replace function public.fn_mcq_metric(p_kho text, p_tu date default null, p_den date default null)
returns jsonb language plpgsql stable as $$
declare v jsonb;
begin
  perform public._mcq_kiem_kho(p_kho);
  if to_regclass(p_kho || '_cau_form_tn') is null then return '{}'::jsonb; end if;
  execute format($q$
    with f as (
      select * from %1$I
      where ($1::date is null or (sinh_at at time zone 'Asia/Ho_Chi_Minh')::date >= $1)
        and ($2::date is null or (sinh_at at time zone 'Asia/Ho_Chi_Minh')::date <= $2)
    ),
    tk as (
      select count(*)::int tong,
             count(*) filter (where xoa_at is null and not da_duyet)::int cho_duyet,
             count(*) filter (where da_duyet)::int duyet,
             count(*) filter (where da_duyet and not sua_truoc_duyet)::int duyet_khong_sua,
             count(*) filter (where da_duyet and sua_truoc_duyet)::int sua,
             -- CHỈ đếm TỪ CHỐI THẬT (có người + lý do) — xoá-kho-rác để sinh lại (tu_choi_boi null) KHÔNG tính.
             count(*) filter (where xoa_at is not null and not da_duyet and tu_choi_boi is not null)::int tu_choi
      from f
    ),
    ld as (
      select coalesce(jsonb_agg(jsonb_build_object('ly_do', ly_do, 'n', n) order by n desc), '[]'::jsonb) j
      from (select tu_choi_ly_do ly_do, count(*)::int n from f where xoa_at is not null and tu_choi_boi is not null and tu_choi_ly_do is not null group by 1) s
    ),
    pb as (
      select coalesce(jsonb_object_agg(dap_an, n), '{}'::jsonb) j
      from (select dap_an, count(*)::int n from f where xoa_at is null group by 1) s
    ),
    dl as (
      select coalesce(jsonb_agg(jsonb_build_object('ma_cau', ma_cau, 'luot', luot, 'chon', chon) order by luot desc), '[]'::jsonb) j
      from (
        select f.ma_cau, count(blc.id)::int luot,
               jsonb_build_array(
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 0),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 1),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 2),
                 count(*) filter (where (blc.dap_an_hs #>> '{}')::int = 3)) chon
        from f
        join bai_test_cau btc on btc.form_tn_id = f.id
        join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and jsonb_typeof(blc.dap_an_hs) = 'number'
        group by f.ma_cau
        having count(blc.id) >= 30
      ) s
    )
    select jsonb_build_object(
      'tong', tk.tong, 'cho_duyet', tk.cho_duyet, 'duyet', tk.duyet, 'duyet_khong_sua', tk.duyet_khong_sua,
      'sua', tk.sua, 'tu_choi', tk.tu_choi,
      'precision', case when tk.duyet + tk.tu_choi = 0 then null else round(tk.duyet_khong_sua::numeric / (tk.duyet + tk.tu_choi), 3) end,
      'ti_le_sua', case when tk.duyet = 0 then null else round(tk.sua::numeric / tk.duyet, 3) end,
      'ly_do_tu_choi', ld.j, 'phan_bo', pb.j, 'do_lua', dl.j)
    from tk, ld, pb, dl
  $q$, p_kho || '_cau_form_tn') into v using p_tu, p_den;
  return v;
end $$;
