-- ============================================================================
-- 202610011501 — de_thi_kho_va_luat_k5_k6
-- ----------------------------------------------------------------------------
-- ĐỀ THI lát B (spec-de-thi.md §10.5, CEO 01/10):
--   K5  Trả lời ngắn GIỮ FORM ĐỀ GỐC (4 ô theo luật thi THPT) — KHÔNG đổi sang trắc nghiệm nữa
--       ⇒ `fn_de_thi_thieu` bỏ điều kiện chặn "TLN chưa có 4 phương án trắc nghiệm".
--   K6  Đề LUÔN dùng được dù chưa gán đủ dạng — chỉ CẢNH BÁO
--       ⇒ "câu chưa có dạng" / "mệnh đề chưa có dạng" chuyển từ CHẶN sang CẢNH BÁO.
--       ⇒ `fn_de_thi_duyet`: duyệt đề = xác nhận nội dung + đáp án. Câu / mệnh đề còn ở dạng chờ KHÔNG được đóng dấu
--          `da_duyet` (DB vốn chặn bằng trg_chan_duyet_dang_cho — đúng: chưa có dạng thì chưa vào kho chuẩn) nhưng
--          KHÔNG làm hỏng việc duyệt đề; có dạng sau thì duyệt lại đề (hoặc duyệt lẻ ở màn Duyệt kho) là xong.
--   K1  Màn "Kho đề thi": danh sách theo tab Chờ duyệt / Sẵn sàng / Đã giao ⇒ `fn_de_thi_ds` + `fn_de_thi_dem`.
--       Tab là SUY ĐỘNG (không cột trạng thái): chờ duyệt = chưa có dấu duyệt · sẵn sàng = đã duyệt · đã giao = có bài test trỏ về đề.
-- Chỉ còn CHẶN thứ làm bài không chấm được: câu đã vào kho rác · thiếu đáp án · thiếu phương án · thiếu mệnh đề · ý chưa có Đ/S.
-- MẤT GÌ: không — thay thân 2 hàm (cùng chữ ký), thêm 2 hàm đọc. Không đụng dữ liệu.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- ── 1) Invariant "đề sẵn sàng": lỗi CHẶN vs CẢNH BÁO ─────────────────────────
create or replace function public.fn_de_thi_thieu(p_de uuid)
returns jsonb
language sql stable set search_path = public as $$
  with c as (select * from public.fn_de_thi_cau(p_de)),
  l as (
    select c.stt, c.ma_cau, c.kho, c.loai_cau, c.phan_tieu_de,
      array_remove(array[
        case when c.xoa then 'cau_da_xoa' end,
        case when not c.xoa and (c.dang_chinh is null or public._kho_la_dang_cho(c.dang_chinh)) then 'dang_cho' end,
        case when not c.xoa and c.loai_cau = 'trac_nghiem'
                  and (upper(trim(coalesce(c.dap_an, ''))) not in ('A', 'B', 'C', 'D')) then 'thieu_dap_an' end,
        case when not c.xoa and c.loai_cau = 'trac_nghiem'
                  and coalesce(jsonb_array_length(case when jsonb_typeof(c.lua_chon) = 'array' then c.lua_chon end), 0) < 2 then 'thieu_phuong_an' end,
        case when not c.xoa and c.loai_cau = 'tra_loi_ngan' and trim(coalesce(c.dap_an, '')) = '' then 'thieu_dap_an' end,
        case when not c.xoa and c.loai_cau = 'dung_sai'
                  and coalesce(jsonb_array_length(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de end), 0) < 2 then 'thieu_menh_de' end,
        case when not c.xoa and c.loai_cau = 'dung_sai' and exists (
                  select 1 from jsonb_array_elements(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de else '[]'::jsonb end) m
                  where upper(left(trim(coalesce(m ->> 'dap_an', '')), 1)) not in ('D', 'S')) then 'md_thieu_dap_an' end,
        case when not c.xoa and c.loai_cau = 'dung_sai' and exists (
                  select 1 from jsonb_array_elements(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de else '[]'::jsonb end) m
                  where m ->> 'ma_dang' is null or public._kho_la_dang_cho(m ->> 'ma_dang')) then 'md_dang_cho' end,
        case when not c.xoa and c.loai_cau not in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan') then 'tu_luan_chi_in' end
      ], null) loi
    from c
  ),
  -- CẢNH BÁO (không chặn): chưa có dạng (K6) · tự luận chỉ in. Mọi lỗi khác = CHẶN.
  l2 as (select l.*, cardinality(array_remove(array_remove(array_remove(l.loi, 'tu_luan_chi_in'), 'dang_cho'), 'md_dang_cho')) > 0 chan from l)
  select jsonb_build_object(
    'tong', (select count(*) from c),
    'so_chan', count(*) filter (where l2.chan),
    'so_canh', count(*) filter (where 'tu_luan_chi_in' = any (l2.loi)),
    'so_chua_dang', count(*) filter (where 'dang_cho' = any (l2.loi) or 'md_dang_cho' = any (l2.loi)),
    'cau', coalesce(jsonb_agg(jsonb_build_object(
             'stt', l2.stt, 'ma_cau', l2.ma_cau, 'kho', l2.kho, 'loai_cau', l2.loai_cau, 'phan', l2.phan_tieu_de,
             'loi', to_jsonb(l2.loi), 'chan', l2.chan
           ) order by l2.stt) filter (where cardinality(l2.loi) > 0), '[]'::jsonb))
  from l2
$$;

-- ── 2) Duyệt đề: không vấp câu / mệnh đề còn dạng chờ ────────────────────────
create or replace function public.fn_de_thi_duyet(p_de uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v jsonb; r record; nsu uuid := public.current_nhan_su_id(); n int := 0; n_cho int := 0; v_form text; v_md_cho boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if nsu is null then raise exception 'Không xác định được nhân sự duyệt'; end if;
  v := public.fn_de_thi_thieu(p_de);
  if (v ->> 'so_chan')::int > 0 then
    raise exception 'Đề còn % câu thiếu đáp án / phương án — xử lý hết rồi mới duyệt được', v ->> 'so_chan' using errcode = 'check_violation';
  end if;
  for r in select * from public.fn_de_thi_cau(p_de) order by stt loop
    v_md_cho := false;
    if r.loai_cau = 'dung_sai' and to_regclass('public.' || r.kho || '_cau_menh_de') is not null then
      -- mệnh đề đã có dạng thật ⇒ duyệt; mệnh đề dạng chờ ⇒ để nguyên
      execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = ''nguoi''
                      where ma_cau_cha = $1 and xoa_at is null and not da_duyet and not public._kho_la_dang_cho(dang_chinh)',
                     r.kho || '_cau_menh_de') using r.ma_cau, nsu;
      v_md_cho := exists (select 1 from jsonb_array_elements(case when jsonb_typeof(r.menh_de) = 'array' then r.menh_de else '[]'::jsonb end) m
                           where m ->> 'ma_dang' is null or public._kho_la_dang_cho(m ->> 'ma_dang'));
    end if;
    if r.dang_chinh is null or public._kho_la_dang_cho(r.dang_chinh) or v_md_cho then
      n_cho := n_cho + 1;   -- câu chưa đủ dạng: nội dung đã được người xem, nhưng chưa vào kho chuẩn
    else
      execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = ''nguoi''
                      where ma_cau = $1 and not da_duyet', r.kho || '_cau_hoi') using r.ma_cau, nsu;
      n := n + 1;
    end if;
    if r.loai_cau = 'tra_loi_ngan' then   -- form trắc nghiệm của câu TLN (nếu kho đã có sẵn) — không bắt buộc cho đề thi nữa (K5)
      v_form := public._kho_form_tn_cua(r.kho || '_cau_hoi');
      if v_form is not null then
        execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now()
                        where ma_cau = $1 and xoa_at is null and not da_duyet', v_form) using r.ma_cau, nsu;
      end if;
    end if;
  end loop;
  update tai_lieu set duyet_at = now(), duyet_boi = nsu, updated_at = now() where id = p_de;
  return jsonb_build_object('so_cau', n, 'so_cau_cho_dang', n_cho);
end $$;

-- ── 3) Kho đề thi: đếm theo tab + danh sách 1 tab ────────────────────────────
create or replace function public.fn_de_thi_dem(p_mon text, p_khoi text default null)
returns jsonb
language sql stable set search_path = public as $$
  select jsonb_build_object(
    'cho_duyet', count(*) filter (where t.duyet_at is null),
    'san_sang',  count(*) filter (where t.duyet_at is not null),
    'da_giao',   count(*) filter (where exists (select 1 from bai_test b where b.nguon_tai_lieu_id = t.id)))
  from tai_lieu t
  where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
$$;
revoke all on function public.fn_de_thi_dem(text, text) from public, anon;
grant execute on function public.fn_de_thi_dem(text, text) to authenticated;

-- Trang danh sách (mới nhất trước; p_truoc = created_at của dòng cuối trang trước để tải thêm).
-- Số câu thiếu tính bằng CHÍNH `fn_de_thi_thieu` (một công thức một nơi) — chỉ cho các đề của trang đang xem.
create or replace function public.fn_de_thi_ds(
  p_mon text, p_khoi text default null, p_tab text default 'cho_duyet', p_tim text default null,
  p_gioi_han int default 25, p_truoc timestamptz default null
) returns table (
  id uuid, ten text, khoi text, mon text, created_at timestamptz, updated_at timestamptz, duyet_at timestamptz,
  nguon text, nam int, co_de_goc boolean,
  so_cau int, so_chan int, so_chua_dang int, so_canh_bao_nhap int, so_luot int, luot_gan_nhat date
)
language sql stable set search_path = public as $$
  with trang as (
    select t.* from tai_lieu t
     where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
       and (nullif(btrim(p_tim), '') is null or t.ten ilike '%' || btrim(p_tim) || '%')
       and case p_tab
             when 'cho_duyet' then t.duyet_at is null
             when 'san_sang'  then t.duyet_at is not null
             when 'da_giao'   then exists (select 1 from bai_test b where b.nguon_tai_lieu_id = t.id)
             else true end
       and (p_truoc is null or t.created_at < p_truoc)
     order by t.created_at desc
     limit least(greatest(p_gioi_han, 1), 100)
  )
  select t.id, t.ten, t.khoi, t.mon, t.created_at, t.updated_at, t.duyet_at,
         nullif(t.cau_hinh -> 'deThi' ->> 'nguon', ''), nullif(t.cau_hinh -> 'deThi' ->> 'nam', '')::int,
         coalesce(t.cau_hinh -> 'deThi' ->> 'pdfGocUrl', t.file_url) is not null,
         (th.v ->> 'tong')::int, (th.v ->> 'so_chan')::int, (th.v ->> 'so_chua_dang')::int,
         (select count(*)::int from jsonb_object_keys(case when jsonb_typeof(t.cau_hinh -> 'deThi' -> 'canhBaoCau') = 'object'
                                                          then t.cau_hinh -> 'deThi' -> 'canhBaoCau' else '{}'::jsonb end)),
         (select count(*)::int from bai_test b where b.nguon_tai_lieu_id = t.id),
         (select max(b.ngay) from bai_test b where b.nguon_tai_lieu_id = t.id)
    from trang t
    cross join lateral (select public.fn_de_thi_thieu(t.id) v) th
   order by t.created_at desc
$$;
revoke all on function public.fn_de_thi_ds(text, text, text, text, int, timestamptz) from public, anon;
grant execute on function public.fn_de_thi_ds(text, text, text, text, int, timestamptz) to authenticated;
