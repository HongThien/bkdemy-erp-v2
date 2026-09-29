-- ============================================================================
-- THẾ GIỚI BK — THÊM CÂU + BỎ LỌC (Thùy 29/09: "39 câu kia cho chọn cả đi, cần gì phải lọc — HS tự chọn cái phù hợp" · "vẫn ít, lượt
-- FB/Threads/TikTok tìm thêm"). Nguồn (29/09): bài tổng hợp từ lóng TikTok/Threads 2025–26 — kenh14 · paradox.vn · phongvu.vn · thofleur ·
-- bachhoaxanh (Threads/TikTok gốc cần đăng nhập, CTO không đọc thẳng được). Luật lọc giữ nguyên: CHỈ câu khen một chiều — đã loại câu 2 nghĩa
-- ("Flex", "Cap", "Cạn phước", "Rút wifi vẫn còn 5G", "Ok", "Dân Zalo"…) và câu khen ngoại hình ("Vương miện cất đâu vậy", "Người đẹp"…).
-- Bỏ lọc: bình luận + câu dẫn khoe chọn được MỌI câu (app chỉ xếp câu hợp loại lên đầu). Nhóm vẫn giữ để xếp thứ tự.
-- ============================================================================

-- 30 câu KHEN mới (người xem bình luận)
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  ('c43','cau','Ơ mây zing gút chóp 👍','{chung}',43), ('c44','cau','Thắng đời 1:0 🏆','{chung}',44),
  ('c45','cau','Đủ wow rồi nha 🤩','{chung}',45), ('c46','cau','Mộc hạng A, chất lượng thật','{chung}',46),
  ('c47','cau','Trùng sinh chắc luôn 🔮','{hoc}',47), ('c48','cau','Green flag của BK 💚','{chung}',48),
  ('c49','cau','+1 máy muốn giỏi như cậu','{hoc}',49), ('c50','cau','Anh em ta cứ thế thôi hẹ hẹ hẹ','{game}',50),
  ('c51','cau','Mới niệm phật cái phước tới liền 🙏','{mayman}',51), ('c52','cau','Tuyệt cú mèo 🐱','{chung}',52),
  ('c53','cau','Oách xà lách 😎','{chung}',53), ('c54','cau','Ngầu lòi luôn 😎','{chung}',54),
  ('c55','cau','Chiến thần học tập ⚔️','{hoc}',55), ('c56','cau','Chúa tể điểm 10 👑','{hoc}',56),
  ('c57','cau','Main character vibes ✨','{chung}',57), ('c58','cau','Top server BK 🥇','{chung}',58),
  ('c59','cau','MVP trận này 🏅','{game}',59), ('c65','cau','Gánh team còng lưng 💪','{game}',65),
  ('c66','cau','Nỗ lực không phản bội ai 💪','{noluc}',66), ('c67','cau','Kiến tha lâu cũng đầy tổ 🐜','{noluc}',67),
  ('c68','cau','Có công mài sắt có ngày nên kim ✨','{noluc}',68), ('c69','cau','Xỉu ngang vì giỏi quá 😵','{chung}',69),
  ('c70','cau','Không ai cản nổi 🚀','{chung}',70), ('c71','cau','Đẳng cấp thượng thừa 💎','{chung}',71),
  ('c72','cau','Nể thật sự luôn 🫡','{chung}',72), ('c73','cau','Cháy quá cháy 🔥','{chung}',73),
  ('c74','cau','Bình tĩnh mà tỏa sáng ✨','{chung}',74), ('c75','cau','Đỉnh cao của sự đỉnh cao','{chung}',75),
  ('c76','cau','Học thế này thì ai theo kịp 📚','{hoc}',76), ('c77','cau','Level max rồi còn gì 🎮','{chung}',77);

-- 18 câu DẪN KHOE mới (người khoe) — tổng 30
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  ('k13','cau','Thắng đời 1:0 🏆','{khoe}',213), ('k14','cau','Tuyệt đối điện ảnh 🎬','{khoe}',214),
  ('k15','cau','Gét gô! Tiếp tục thôi 🚀','{khoe}',215), ('k16','cau','Nỗ lực không phản bội ai 💪','{khoe}',216),
  ('k17','cau','Bốc trúng sít rịt 🍀','{khoe}',217), ('k18','cau','Đủ wow chưa mọi người? 🤩','{khoe}',218),
  ('k19','cau','Top server là đây 🥇','{khoe}',219), ('k20','cau','Main character hôm nay là tớ ✨','{khoe}',220),
  ('k21','cau','Ngủ ít, học nhiều, kết quả đây 😴','{khoe}',221), ('k22','cau','Chưa max level đâu nha 🎮','{khoe}',222),
  ('k23','cau','Mãi keo với việc học 🤝','{khoe}',223), ('k24','cau','Hôm qua còn sai, hôm nay đúng hết 😎','{khoe}',224),
  ('k25','cau','8386 lộc về 🍀','{khoe}',225), ('k26','cau','Tự hào về bản thân xíu 🥹','{khoe}',226),
  ('k27','cau','Rèn luyện thành chiến thần ⚔️','{khoe}',227), ('k28','cau','Ai bảo tớ không làm được? 😤','{khoe}',228),
  ('k29','cau','Cả nhà vỗ tay cho tớ nha 👏','{khoe}',229), ('k30','cau','Thêm 1 chiến tích nữa 🏅','{khoe}',230);

CREATE OR REPLACE FUNCTION public.fn_the_gioi_binh_luan(p_khoa text, p_ma text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_me uuid := public.my_hoc_sinh_id(); v_tin record; v_chu boolean; v_ban uuid[]; v_bl the_gioi_binh_luan;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới bình luận được'; end if;
  select * into v_tin from public._the_gioi_tin_mo(p_khoa);
  v_chu := v_me = any(v_tin.thanh_vien);
  if not v_chu and exists (select 1 from the_gioi_an_tin a where a.tin_khoa = p_khoa and a.an) then raise exception 'Tin đã được chủ tin ẩn'; end if;
  if not exists (select 1 from the_gioi_danh_muc d where d.ma = p_ma and d.an_at is null and (
      d.loai = 'sticker'
      or d.loai = 'cau')) then
    raise exception 'Câu/sticker không hợp tin này'; end if;
  if (select count(*) from the_gioi_binh_luan where tin_khoa = p_khoa and hs_id = v_me and go_at is null) >= 3 then
    raise exception 'Mỗi tin em bình luận tối đa 3 lần'; end if;
  insert into the_gioi_binh_luan (tin_khoa, hs_id, noi_dung_ma) values (p_khoa, v_me, p_ma) returning * into v_bl;
  v_ban := array(select public._ban_be_cua(v_me));
  return jsonb_build_object('bl', public._the_gioi_bl_json(v_bl, v_me, v_ban), 'khen', public._the_gioi_khen_json(p_khoa, v_me, v_ban));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_the_gioi_khoe(p_khoa text, p_cau text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_me uuid := public.my_hoc_sinh_id(); v_hom_nay timestamptz := ((now() at time zone 'Asia/Ho_Chi_Minh')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh'; v_n int;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới khoe được'; end if;
  if exists (select 1 from the_gioi_bai_khoe where hoc_sinh_id = v_me and tin_khoa = p_khoa) then raise exception 'Thành tích này em đã khoe rồi'; end if;
  if not exists (select 1 from public._the_gioi_cho_khoe(v_me) as x(khoa text, tang text, nhom text, kieu text, mon text, at timestamptz, chi_tiet jsonb, lop_id uuid)
                 where x.khoa = p_khoa) then raise exception 'Thành tích này không còn khoe được (quá 3 ngày hoặc không phải của em)'; end if;
  if p_cau is not null and not exists (select 1 from the_gioi_danh_muc where ma = p_cau and loai = 'cau' and an_at is null) then
    raise exception 'Câu dẫn không hợp lệ'; end if;
  perform pg_advisory_xact_lock(hashtext('the_gioi_khoe:' || v_me));   -- 2 lần bấm cùng lúc không vượt giới hạn
  select count(*) into v_n from the_gioi_bai_khoe where hoc_sinh_id = v_me and dang_at >= v_hom_nay;
  if v_n >= 3 then raise exception 'Hôm nay em đã khoe 3 bài rồi — mai khoe tiếp nhé!'; end if;
  insert into the_gioi_bai_khoe (hoc_sinh_id, tin_khoa, cau_ma) values (v_me, p_khoa, p_cau);
  return jsonb_build_object('gioi_han', 3, 'da_khoe_hom_nay', v_n + 1);
end $function$;
