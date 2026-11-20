-- spec-kho-cau-hoi.md §8 — Thùy chốt 17/11 "Chốt theo đề xuất", lệnh làm 20/11 "tiếp tục hoàn thiện các vấn đề còn dở".
--   Q3 + L3 : sửa đáp số kho ⇒ form TN của câu tự thu hồi (như điền ô, trigger dai_cau_hoi_thu_hoi_dien)
--   L4      : câu vào kho rác ⇒ form TN của câu theo vào rác (108+ form đã duyệt nằm trên câu rác làm lệch metric)
--   Q4 + L5 : 25 form TN Hình đang chờ ⇒ kho rác (Hình không làm MCQ, Thùy 13/11). Xoá MỀM (xoa_at), không DELETE.
-- Một hàm dùng chung cho mọi kho (CLAUDE §1.6: cấm chép hàm theo nhánh) — bảng form lấy từ tham số trigger.

create or replace function public._trg_thu_hoi_form_tn() returns trigger
language plpgsql set search_path to 'public' as $$
declare
  v_tbl text := tg_argv[0];
  v_ly  text;
begin
  if tg_op <> 'UPDATE' then return new; end if;
  if new.xoa_at is not null and old.xoa_at is null then
    v_ly := ' [thu hồi: câu vào kho rác]';
  elsif regexp_replace(coalesce(new.dap_an, ''), '[\s$]', '', 'g') is distinct from regexp_replace(coalesce(old.dap_an, ''), '[\s$]', '', 'g') then
    -- bỏ khoảng trắng và dấu $ khi so: bọc lại $…$ hay đổi khoảng trắng không đổi đáp số, không thu hồi oan
    v_ly := ' [thu hồi: đáp số kho đổi]';
  end if;
  if v_ly is not null then
    execute format(
      'update public.%I set xoa_at = now(), tu_choi_ly_do = coalesce(tu_choi_ly_do, %L) || %L where ma_cau = $1 and xoa_at is null',
      v_tbl, '', v_ly) using new.ma_cau;
  end if;
  return new;
end $$;

comment on function public._trg_thu_hoi_form_tn() is
  'spec-kho-cau-hoi §6/§8 L3-L4: đổi đáp số hoặc vào rác ⇒ form TN hiệu lực của câu về rác (xoa_at). tu_choi_boi để trống nên metric không tính là từ chối thật. Tham số trigger = tên bảng form.';

do $$
declare r record;
begin
  for r in select * from (values
      ('dai_cau_hoi',    'dai_cau_form_tn'),
      ('hgt_cau_hoi',    'hgt_cau_form_tn'),
      ('khtn_cau_hoi',   'khtn_cau_form_tn'),
      ('vatly_cau_hoi',  'vatly_cau_form_tn'),
      ('hoahoc_cau_hoi', 'hoahoc_cau_form_tn'),
      ('tsa_cau_hoi',    'tsa_cau_form_tn')
    ) v(cau, form)
  loop
    execute format('drop trigger if exists %I on public.%I', r.cau || '_thu_hoi_form_tn', r.cau);
    execute format(
      'create trigger %I after update of dap_an, xoa_at on public.%I for each row execute function public._trg_thu_hoi_form_tn(%L)',
      r.cau || '_thu_hoi_form_tn', r.cau, r.form);
  end loop;
end $$;

-- ── L4: dọn form TN còn hiệu lực trên câu đã vào rác (làm một lần; sau này trigger lo)
do $$
declare r record; n bigint;
begin
  for r in select * from (values
      ('dai_cau_hoi',    'dai_cau_form_tn'),
      ('hgt_cau_hoi',    'hgt_cau_form_tn'),
      ('khtn_cau_hoi',   'khtn_cau_form_tn'),
      ('vatly_cau_hoi',  'vatly_cau_form_tn'),
      ('hoahoc_cau_hoi', 'hoahoc_cau_form_tn'),
      ('tsa_cau_hoi',    'tsa_cau_form_tn')
    ) v(cau, form)
  loop
    execute format(
      'update public.%I f set xoa_at = now(), tu_choi_ly_do = coalesce(f.tu_choi_ly_do, %L) || %L
         from public.%I c where c.ma_cau = f.ma_cau and c.xoa_at is not null and f.xoa_at is null',
      r.form, '', ' [thu hồi: câu vào kho rác]', r.cau);
    get diagnostics n = row_count;
    raise notice 'L4 % : % form về rác', r.form, n;
  end loop;
end $$;

-- ── Q4: 25 form TN Hình đang chờ (chưa duyệt) ⇒ rác. Điều kiện chặt: chỉ form chưa duyệt, chưa rác.
update public.hinh_hoc_cau_form_tn
   set xoa_at = now(),
       tu_choi_ly_do = coalesce(tu_choi_ly_do, '') || ' [rác: Hình không làm MCQ — Thùy 13/11, chốt 17/11]'
 where xoa_at is null and da_duyet = false;
