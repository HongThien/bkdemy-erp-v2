-- ============================================================================
-- 202608300232 — Phase 1 (đợt 3/5) §2.0: BẢNG GẬY + CHỐT THÁNG → function DB
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — bảng gậy (TIỀN PHẠT, công khai toàn công ty) đang Σ ledger
--   ở client (`gay.ts bangGay`) rồi `chotThang` lấy NGUYÊN kết quả JS đó upsert thành
--   snapshot bất biến `gay_chot_thang` — số tiền phạt phụ thuộc code browser của
--   người bấm nút. Giờ: fn_gay_bang (đọc) + fn_gay_chot_thang (RPC transactional,
--   tính + ghi trong CÙNG transaction). Đơn giá 20.000đ/gậy vào hằng fn — JS
--   GAY_DON_GIA chỉ còn để HIỂN THỊ nhãn.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì — chỉ thêm 2 function. Bảng chốt cũ giữ nguyên.
-- ============================================================================

-- Bảng gậy kỳ: Σ ledger hiệu lực (bỏ thu_hoi_at), sàn 0 (gỡ dư không để dành), tiền = còn lại × 20k.
create or replace function public.fn_gay_bang(p_ky date)
returns table (nhan_su_id uuid, ns_ten text, so_gay_danh bigint, so_gay_go bigint, con_lai bigint, don_gia numeric, tien_phat numeric)
language sql stable as $$
  select l.nhan_su_id, ns.ho_ten,
         coalesce(sum(l.so_gay) filter (where l.so_gay > 0), 0) as so_gay_danh,
         coalesce(-sum(l.so_gay) filter (where l.so_gay < 0), 0) as so_gay_go,
         greatest(0, coalesce(sum(l.so_gay), 0)) as con_lai,
         20000::numeric as don_gia,
         greatest(0, coalesce(sum(l.so_gay), 0)) * 20000 as tien_phat
  from gay_ledger l
  join nhan_su ns on ns.id = l.nhan_su_id
  where l.ky = p_ky and l.thu_hoi_at is null
  group by l.nhan_su_id, ns.ho_ten
  order by con_lai desc, so_gay_danh desc
$$;
grant execute on function public.fn_gay_bang(date) to authenticated;

-- Chốt tháng: tính + snapshot + upsert trong MỘT transaction ở DB. Idempotent theo (ky, nhan_su_id).
-- Trả về số người được chốt. Snapshot jsonb giữ đủ vết từng dòng ledger (kể cả dòng đã thu hồi — làm chứng).
create or replace function public.fn_gay_chot_thang(p_ky date)
returns integer
language plpgsql as $$
declare
  v_me uuid;
  v_n integer;
begin
  select nhan_su_id into v_me from tai_khoan where id = public.jwt_uid();
  if v_me is null then raise exception 'Tài khoản chưa gắn nhân sự — không chốt được.'; end if;

  with bang as (select * from public.fn_gay_bang(p_ky)),
  snap as (
    select l.nhan_su_id,
           jsonb_agg(jsonb_build_object(
             'id', l.id, 'so_gay', l.so_gay, 'loai', l.loai,
             'loi', gl.ten, 'hoat_dong', gh.ten, 'ly_do', l.ly_do,
             'nguoi_tao', nt.ho_ten, 'created_at', l.created_at, 'thu_hoi_at', l.thu_hoi_at
           ) order by l.created_at desc) as entries
    from gay_ledger l
    left join gay_loi gl on gl.id = l.loi_id
    left join gay_hoat_dong gh on gh.id = l.hoat_dong_id
    left join nhan_su nt on nt.id = l.nguoi_tao
    where l.ky = p_ky
    group by l.nhan_su_id
  )
  insert into gay_chot_thang (ky, nhan_su_id, so_gay_danh, so_gay_go, so_gay_chot, don_gia, tien_phat, snapshot, nguoi_chot, chot_at)
  select p_ky, b.nhan_su_id, b.so_gay_danh, b.so_gay_go, b.con_lai, b.don_gia, b.tien_phat,
         coalesce(s.entries, '[]'::jsonb), v_me, now()
  from bang b left join snap s on s.nhan_su_id = b.nhan_su_id
  where b.so_gay_danh > 0 or b.so_gay_go > 0
  on conflict (ky, nhan_su_id) do update set
    so_gay_danh = excluded.so_gay_danh, so_gay_go = excluded.so_gay_go, so_gay_chot = excluded.so_gay_chot,
    don_gia = excluded.don_gia, tien_phat = excluded.tien_phat, snapshot = excluded.snapshot,
    nguoi_chot = excluded.nguoi_chot, chot_at = excluded.chot_at;
  get diagnostics v_n = row_count;
  return v_n;
end $$;
grant execute on function public.fn_gay_chot_thang(date) to authenticated;
