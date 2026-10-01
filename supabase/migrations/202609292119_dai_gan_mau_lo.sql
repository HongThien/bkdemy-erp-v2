-- ============================================================================
-- 202609292119 — dai_gan_mau_lo
-- ----------------------------------------------------------------------------
-- P1 LUỒNG KHO — màn GÁN MẪU (CEO 29/09: "t gán tay, nhưng vào đâu để gán?").
-- Bước 2 của phương pháp §9.6 spec-luong-kho.md: dựng BỘ ĐỀ CHẤM từ nhãn của NGƯỜI trước khi viết skill.
-- Lô đầu = 673 câu "thực tế" K12 chưa ai duyệt ⇒ chưa có nhãn đúng ⇒ học thuật gán tay một MẪU cố định.
--
-- Mẫu = N câu đầu theo md5(ma_cau) trong MỘT chuyên đề (thứ tự giả-ngẫu-nhiên nhưng CỐ ĐỊNH: gán xong câu
-- đổi dạng vẫn nằm trong chuyên đề nên mẫu không xê dịch; không lưu danh sách mẫu ở đâu cả — suy động).
-- Nhãn của người = chính `dang_chinh` của câu (dữ liệu thật, trigger trg_log_doi_dang ghi actor);
-- KHÔNG có bảng nhãn riêng. "Không khớp dạng nào" = một ĐỀ XUẤT loại trao_doi do người tạo (nguon='nguoi').
--
--   fn_dai_gan_mau_ds   ĐỌC  mẫu N câu của chuyên đề (đủ nội dung để người đọc và gán)
--   fn_dai_gan_mau_gan  GHI  gán 1 câu vào 1 dạng CÙNG chuyên đề (cần quyền ghi bdkt; câu đã duyệt thì không)
--   fn_dai_de_xuat_tao  GHI  người tạo đề xuất (dang_moi / cum_moi / trao_doi) kèm câu làm chứng
-- MẤT GÌ: không — chỉ thêm 3 hàm.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

create or replace function public.fn_dai_gan_mau_ds(p_ma_chuyen_de text, p_so int default 60)
returns table (
  thu_tu int, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text,
  anh_de text, dang_chinh text, ten_dang text, da_duyet boolean, ten_de_goc text,
  de_xuat_cho jsonb     -- đề xuất CHƯA quyết mà câu này đang làm chứng (người đã đánh dấu "không khớp") — null nếu không có
)
language sql stable set search_path = public as $$
  with mau as (
    select q.*, b.ten_dang, row_number() over (order by md5(q.ma_cau))::int rn
      from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
     where b.ma_chuyen_de = p_ma_chuyen_de and q.xoa_at is null
  )
  select m.rn, m.ma_cau, m.loai_cau, m.noi_dung, to_jsonb(m.lua_chon), m.menh_de, m.dap_an, m.loi_giai,
         m.anh_de, m.dang_chinh, m.ten_dang, m.da_duyet, m.ten_de_goc,
         (select jsonb_build_object('id', d.id, 'loai', d.loai, 'ly_do', d.ly_do)
            from dai_de_xuat_cau c join dai_de_xuat d on d.id = c.de_xuat_id
           where c.ma_cau = m.ma_cau and not exists (select 1 from dai_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id)
           order by d.created_at desc limit 1)
    from mau m
   where m.rn <= least(greatest(p_so, 1), 200)
   order by m.rn
$$;
revoke all on function public.fn_dai_gan_mau_ds(text, int) from public, anon;
grant execute on function public.fn_dai_gan_mau_ds(text, int) to authenticated;

create or replace function public.fn_dai_gan_mau_gan(p_ma_cau text, p_ma_dang text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_cu   text;
  v_cd   text;
  v_dich dai_ban_do%rowtype;
  v_duyet boolean;
begin
  if public.current_nhan_su_id() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự' using errcode = 'insufficient_privilege'; end if;
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền sửa Bản đồ kiến thức' using errcode = 'insufficient_privilege'; end if;

  select q.dang_chinh, q.da_duyet, b.ma_chuyen_de into v_cu, v_duyet, v_cd
    from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null
     for update of q;
  if not found then raise exception 'Câu "%" không tồn tại', p_ma_cau; end if;
  if v_duyet then raise exception 'Câu "%" đã duyệt — đổi dạng ở màn Duyệt', p_ma_cau; end if;

  select * into v_dich from dai_ban_do where ma_dang = p_ma_dang;
  if not found then raise exception 'Dạng "%" không tồn tại', p_ma_dang; end if;
  if public._kho_la_dang_cho(p_ma_dang) then raise exception 'Không gán về dạng chờ'; end if;
  if v_dich.ma_chuyen_de <> v_cd then
    raise exception 'Gán mẫu chỉ đổi dạng TRONG chuyên đề (câu ở %, dạng đích ở %)', v_cd, v_dich.ma_chuyen_de;
  end if;

  if v_cu is distinct from p_ma_dang then
    update dai_cau_hoi set dang_chinh = p_ma_dang, ma_cum = null where ma_cau = p_ma_cau;
  end if;
  return jsonb_build_object('ma_cau', p_ma_cau, 'dang_cu', v_cu, 'dang_chinh', p_ma_dang, 'ten_dang', v_dich.ten_dang);
end $$;
revoke all on function public.fn_dai_gan_mau_gan(text, text) from public, anon;
grant execute on function public.fn_dai_gan_mau_gan(text, text) to authenticated;

-- Người tạo đề xuất (nguon = 'nguoi'). Cùng CHECK hình dạng với đề xuất của dây chuyền.
create or replace function public.fn_dai_de_xuat_tao(
  p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[],
  p_lo text, p_ten text default null, p_mo_ta_ngan text default null, p_ma_dang text default null, p_dang_gan_nhat text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_thieu text;
begin
  if public.current_nhan_su_id() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự' using errcode = 'insufficient_privilege'; end if;
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền sửa Bản đồ kiến thức' using errcode = 'insufficient_privilege'; end if;
  if nullif(btrim(p_ly_do), '') is null then raise exception 'Phải ghi lý do / câu hỏi'; end if;
  if nullif(btrim(p_lo), '') is null then raise exception 'Thiếu mã lô'; end if;
  if coalesce(array_length(p_ma_cau, 1), 0) = 0 then raise exception 'Đề xuất phải có ít nhất 1 câu làm chứng'; end if;
  if not exists (select 1 from dai_ban_do where ma_chuyen_de = p_ma_chuyen_de and khoi = p_khoi) then
    raise exception 'Chuyên đề "%" không thuộc khối %', p_ma_chuyen_de, p_khoi;
  end if;
  select string_agg(x, ', ') into v_thieu from unnest(p_ma_cau) x
   where not exists (select 1 from dai_cau_hoi q where q.ma_cau = x and q.xoa_at is null);
  if v_thieu is not null then raise exception 'Câu không tồn tại: %', v_thieu; end if;

  insert into dai_de_xuat (loai, khoi, ma_chuyen_de, ma_dang, ten, mo_ta_ngan, dang_gan_nhat, ly_do, lo, nguon)
  values (p_loai, p_khoi, p_ma_chuyen_de, p_ma_dang, nullif(btrim(p_ten), ''), nullif(btrim(p_mo_ta_ngan), ''),
          p_dang_gan_nhat, btrim(p_ly_do), btrim(p_lo), 'nguoi')
  returning id into v_id;
  insert into dai_de_xuat_cau (de_xuat_id, ma_cau) select v_id, x from (select distinct unnest(p_ma_cau) x) t;
  return v_id;
end $$;
revoke all on function public.fn_dai_de_xuat_tao(text, text, text, text, text[], text, text, text, text, text) from public, anon;
grant execute on function public.fn_dai_de_xuat_tao(text, text, text, text, text[], text, text, text, text, text) to authenticated;
