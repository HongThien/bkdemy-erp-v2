-- Thùy 19/09: "Trợ giảng tích lại được trạng thái" — câu tự luận bị biến thành TRẢ LỜI NGẮN (nhất là chứng minh) rất khó gõ khớp
-- đáp án ⇒ em làm đúng mà máy vẫn chấm sai. TA ngồi cạnh em trong ca bổ trợ yếu nên được CHỈNH KẾT QUẢ câu trả lời ngắn ngay
-- trên app TA. Phạm vi HẸP có chủ đích: chỉ loai_cau='tra_loi_ngan', chỉ bài của ca bổ trợ yếu (bo_tro · bo_tro_test · retest);
-- MCQ không cho chỉnh (máy chấm chắc chắn). Mọi lần chỉnh ghi log (ai · lúc nào · cũ → mới) — §4 "đổi state phải có vết".
-- `cham_at` GIỮ NGUYÊN (mastery xếp theo thời điểm LÀM bài, không phải lúc TA sửa); `cham_boi='manual'` (giá trị CHECK sẵn có).
-- Trigger `trg_btyeu_retest_cau` sẵn có tự tính lại điểm retest khi verdict đổi. MẤT GÌ: không — thêm 1 bảng log + 2 function.
create table if not exists public.bai_lam_cau_sua_log (
  id uuid primary key default gen_random_uuid(),
  bai_lam_cau_id uuid not null references public.bai_lam_cau(id) on delete cascade,
  verdict_cu text, verdict_moi text not null, diem_cu numeric, diem_moi numeric,
  cham_boi_cu text, nhan_su_id uuid references public.nhan_su(id), nguoi uuid, ly_do text,
  created_at timestamptz not null default now()
);
create index if not exists bai_lam_cau_sua_log_cau_idx on public.bai_lam_cau_sua_log (bai_lam_cau_id);
alter table public.bai_lam_cau_sua_log enable row level security;
drop policy if exists bai_lam_cau_sua_log_member_read on public.bai_lam_cau_sua_log;
create policy bai_lam_cau_sua_log_member_read on public.bai_lam_cau_sua_log for select to authenticated using (public.la_thanh_vien());

-- Danh sách câu TRẢ LỜI NGẮN em ĐÃ TRẢ LỜI trong ca (luyện + test cuối ca + retest của ca) — cho TA soi & chỉnh.
create or replace function public.fn_btyeu_ta_cau_tln(p_buoi uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'bai_lam_cau_id', blc.id, 'loai_bai', bt.loai, 'ma_dang', btc.ma_dang, 'ma_cau', btc.ma_cau, 'thu_tu', btc.thu_tu,
    'noi_dung', btc.noi_dung, 'anh_de', btc.anh_de, 'dap_an_key', btc.dap_an_key, 'loi_giai', btc.loi_giai,
    'dap_an_hs', blc.dap_an_hs, 'verdict', blc.verdict, 'cham_boi', blc.cham_boi, 'cham_at', blc.cham_at,
    'da_sua', exists (select 1 from bai_lam_cau_sua_log l where l.bai_lam_cau_id = blc.id)
  ) order by blc.cham_at desc), '[]'::jsonb) end
  from bai_test bt
  join bai_test_cau btc on btc.bai_test_id = bt.id and btc.loai_cau = 'tra_loi_ngan'
  join bai_lam bl on bl.bai_test_id = bt.id
  join bai_lam_cau blc on blc.bai_lam_id = bl.id and blc.bai_test_cau_id = btc.id and blc.verdict is not null
  where bt.buoi_hoc_id = p_buoi and bt.loai in ('bo_tro', 'bo_tro_test', 'retest')
$$;
grant execute on function public.fn_btyeu_ta_cau_tln(uuid) to authenticated;

create or replace function public.fn_btyeu_ta_sua_ket_qua(p_bai_lam_cau uuid, p_dung boolean, p_ly_do text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record; v_verdict text; v_diem numeric;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự chỉnh được kết quả.'; end if;
  select blc.id, blc.verdict, blc.diem, blc.cham_boi, btc.loai_cau, btc.diem as diem_cau, bt.loai
    into r
  from bai_lam_cau blc join bai_test_cau btc on btc.id = blc.bai_test_cau_id join bai_test bt on bt.id = btc.bai_test_id
  where blc.id = p_bai_lam_cau for update of blc;
  if r.id is null then raise exception 'Không thấy câu trả lời.'; end if;
  if r.loai_cau <> 'tra_loi_ngan' then raise exception 'Chỉ chỉnh được câu TRẢ LỜI NGẮN (trắc nghiệm máy chấm chắc chắn).'; end if;
  if r.loai not in ('bo_tro', 'bo_tro_test', 'retest') then raise exception 'Chỉ chỉnh được bài của ca bổ trợ yếu.'; end if;
  if r.verdict is null then raise exception 'Em chưa trả lời câu này.'; end if;
  v_verdict := case when p_dung then 'correct' else 'wrong' end;
  if r.verdict = v_verdict then return jsonb_build_object('verdict', v_verdict, 'doi', false); end if;
  v_diem := case when p_dung then coalesce(r.diem_cau, 1) else 0 end;
  insert into bai_lam_cau_sua_log (bai_lam_cau_id, verdict_cu, verdict_moi, diem_cu, diem_moi, cham_boi_cu, nhan_su_id, nguoi, ly_do)
    values (r.id, r.verdict, v_verdict, r.diem, v_diem, r.cham_boi, public.current_nhan_su_id(), public.jwt_uid(), nullif(trim(coalesce(p_ly_do, '')), ''));
  update bai_lam_cau set verdict = v_verdict, diem = v_diem, cham_boi = 'manual' where id = r.id; -- cham_at giữ nguyên
  return jsonb_build_object('verdict', v_verdict, 'doi', true);
end $$;
grant execute on function public.fn_btyeu_ta_sua_ket_qua(uuid, boolean, text) to authenticated;
