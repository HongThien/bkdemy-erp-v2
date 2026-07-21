-- 0111 — KHO RÁC cho câu hỏi (Thùy chốt 07-21).
--
-- Vấn đề: xoá câu khỏi kho là XOÁ CỨNG, trong khi `tai_lieu_cau` chỉ giữ `ma_cau` dạng text (KHÔNG FK).
-- Câu chết đi thì `getTaiLieuFull` `.filter(Boolean)` cho nó RỤNG IM LẶNG khỏi tài liệu → giáo trình /
-- BTVN / ET đang in THIẾU CÂU mà không ai biết. Thực đo 07-21: 150 dòng chết / 53 nằm trong tài liệu MẪU
-- (Giáo trình 11A thiếu 24 câu — mẫu thì tái dùng cho MỌI lớp mới nên nó lây tiếp).
--
-- Thùy: "câu hỏi trong kho bị sai nên trước khi xoá đều được duyệt trước, vẫn cần xoá — nhưng có tài liệu
-- đã in ra dùng rồi, nên xoá ở kho chính thì chuyển qua kho RÁC, giữ lại để tham chiếu không sai lệch,
-- mà kho đang dùng vẫn sạch. Tôi chủ động dọn kho rác khi cần."
--
-- Thiết kế: CỘT `xoa_at` NGAY TRONG BẢNG CÂU, KHÔNG tách bảng rác riêng. Hai lý do cứng:
--   1. Tách bảng ⇒ mọi chỗ resolve câu phải join 2 nơi — sót 1 chỗ là tài liệu lại thiếu câu, đúng
--      cái bug đang sửa.
--   2. `nextCauSeq` sinh mã câu mới = max(STT hiện có)+1 TRONG BẢNG. Rác nằm cùng bảng ⇒ mã đã xoá
--      KHÔNG BAO GIỜ bị cấp lại ⇒ tham chiếu cũ không bị "trỏ nhầm sang câu mới toanh". Tách bảng là
--      mất tính chất này — nguy hiểm hơn hẳn việc thiếu câu.
--
-- Ghi vết theo CLAUDE.md §4: `xoa_at` = CỘT TRẠNG THÁI HIỆN TẠI (đọc nhanh), lịch sử do **TRIGGER ở DB**
-- tự đẻ vào `kho_cau_log` — app KHÔNG tự nhớ ghi log, nên không bao giờ mất vết dù ai gọi đường nào
-- (kể cả sửa tay bằng SQL). Cùng khuôn với `ca_test_log`.
--
-- Luật đọc từ nay:
--   · chỗ CHỌN câu (gợi ý dạng / tìm câu / đếm câu-mỗi-dạng) → LỌC `xoa_at is null`
--   · chỗ RESOLVE câu (getTaiLieuFull, bản in, chấm)        → KHÔNG lọc, lấy cả rác
--
-- KHÔNG xoá gì. Thêm 2 cột + 1 bảng log + 2 trigger + index, và sửa 1 function đếm.

alter table dai_cau_hoi  add column if not exists xoa_at timestamptz;
alter table khtn_cau_hoi add column if not exists xoa_at timestamptz;

comment on column dai_cau_hoi.xoa_at  is 'Có giá trị = câu nằm trong KHO RÁC: không cho chọn mới, nhưng vẫn resolve được để tài liệu cũ in đủ câu. NULL = đang dùng.';
comment on column khtn_cau_hoi.xoa_at is 'Có giá trị = câu nằm trong KHO RÁC: không cho chọn mới, nhưng vẫn resolve được để tài liệu cũ in đủ câu. NULL = đang dùng.';

-- Index PARTIAL: gần như mọi truy vấn "chọn câu" đều là eq(dang_chinh) + xoa_at is null.
create index if not exists dai_cau_hoi_dang_song_idx  on dai_cau_hoi  (dang_chinh) where xoa_at is null;
create index if not exists khtn_cau_hoi_dang_song_idx on khtn_cau_hoi (dang_chinh) where xoa_at is null;

-- ── Vết (append-only) ───────────────────────────────────────────────────────
create table if not exists kho_cau_log (
  id         uuid primary key default gen_random_uuid(),
  tbl        text        not null,
  ma_cau     text        not null,
  hanh_dong  text        not null check (hanh_dong in ('vao_rac', 'khoi_phuc', 'xoa_vinh_vien')),
  truoc      jsonb,
  sau        jsonb,
  actor      uuid,
  ts         timestamptz not null default now()
);
create index if not exists kho_cau_log_ma_cau_idx on kho_cau_log (ma_cau, ts desc);

create or replace function public.log_kho_cau()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if tg_op = 'DELETE' then
    insert into kho_cau_log (tbl, ma_cau, hanh_dong, truoc, sau, actor)
    values (tg_table_name, old.ma_cau, 'xoa_vinh_vien', to_jsonb(old), null, jwt_uid());
    return old;
  end if;
  -- chỉ quan tâm lần ĐỔI trạng thái rác, không log mọi update nội dung câu
  if old.xoa_at is distinct from new.xoa_at then
    insert into kho_cau_log (tbl, ma_cau, hanh_dong, truoc, sau, actor)
    values (tg_table_name, new.ma_cau,
            case when new.xoa_at is null then 'khoi_phuc' else 'vao_rac' end,
            jsonb_build_object('xoa_at', old.xoa_at),
            jsonb_build_object('xoa_at', new.xoa_at),
            jwt_uid());
  end if;
  return new;
end $function$;

drop trigger if exists trg_log_kho_cau_dai  on dai_cau_hoi;
drop trigger if exists trg_log_kho_cau_khtn on khtn_cau_hoi;
create trigger trg_log_kho_cau_dai  after update or delete on dai_cau_hoi  for each row execute function log_kho_cau();
create trigger trg_log_kho_cau_khtn after update or delete on khtn_cau_hoi for each row execute function log_kho_cau();

-- Đếm câu mỗi dạng (hiện trên bản đồ kiến thức) = chỉ đếm câu ĐANG DÙNG. Rác không tính vào "kho có gì".
create or replace function public.count_cau_by_dang(p_tbl text)
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  if p_tbl not in ('dai_cau_hoi', 'khtn_cau_hoi') then raise exception 'invalid table %', p_tbl; end if;
  execute format(
    'select coalesce(jsonb_object_agg(dang_chinh, n), ''{}''::jsonb)
       from (select dang_chinh, count(*) n from %I where xoa_at is null group by dang_chinh) t',
    p_tbl
  ) into result;
  return result;
end $function$;
