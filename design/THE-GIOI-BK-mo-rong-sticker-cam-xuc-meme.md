# Thế giới BK — MỞ RỘNG sticker · cảm xúc · meme (ĐỀ XUẤT CTO 25/10 — chờ Thùy lọc)

> Bổ sung cho `design/THE-GIOI-BK-danh-muc-tuong-tac.md` + `spec-the-gioi-bk.md`. Hiện có: **22 icon thả cảm xúc · 12 sticker (emoji to) · ~74 câu bình luận · 30 câu dẫn khoe · 0 ảnh meme**.
> Luật cũ vẫn giữ: **chỉ KHEN / cổ vũ MỘT CHIỀU** (không hình/câu nào đọc được thành mỉa) · đối tượng chính lớp 8+ · bình luận = chạm 1 câu / 1 sticker là gửi (không gõ chữ) · 👑 dành riêng "Thầy cô khen".
> Cột **Dùng**: ✅ đề xuất · ⚠ cân nhắc (lý do kèm) · ❌ loại.

## 0. Tham khảo Zalo / Messenger / TikTok — lấy gì, KHÔNG lấy gì

**KHÔNG lấy file/hình/tên nhân vật** (spec §8: sticker Zalo/Mess là bản quyền họa sĩ — mua gói = quyền gửi trong Zalo, không phải quyền đem sang app khác; không trích file từ nền tảng).
**CHỈ lấy "công thức" (ý tưởng không có bản quyền):**

| Nguồn | Công thức học được | Áp vào BK |
|---|---|---|
| **Zalo / Messenger** | Sticker thắng nhờ **nhân vật lặp lại + biểu cảm thật rõ** (1 nhân vật × 16–24 trạng thái) và **câu thoại ngắn trong hình** | Bộ linh vật BK (mục D): 1–2 nhân vật × 16 trạng thái học tập |
| **Messenger** | Dải **cảm xúc giữ-để-chọn** (đã có) + **sticker động** (hoạt hình 3–4 khung) | Đơn 6 đã có bản động 4 khung |
| **TikTok** | **Câu cửa miệng / trend** lan nhanh, hết hạn nhanh (2–4 tháng); định dạng **POV…**, **"không phải khoe nhưng…"**, **plot twist** | Câu meme trong DB, admin thay theo trend (mục C) — không phải deploy |
| **TikTok / Discord** | **Phản ứng theo tình huống** (ăn mừng · hóng · xin vía · bái phục) hơn là theo cảm xúc chung chung | Nhóm sticker theo ngữ cảnh (mục B) |
| **Facebook** | 7 cảm xúc cố định đủ dùng; thêm nhiều ⇒ rối | Giữ dải thả ≤ 30 icon |

> ⚠ Trend teen đổi nhanh, CTO không có kênh xem TikTok trực tiếp ⇒ **mọi câu trend ở mục C đánh dấu 🕒 = nhờ Thùy / lớp 8–9 duyệt độ "còn thời"** trước khi nạp. Câu nào HS thấy "sến / cũ" thì ẩn bằng `an_at` (không xoá, bình luận cũ vẫn đọc được).

---

## A. Icon thả cảm xúc — thêm 20 (22 → 42)

Mã = cột `ma` (`^[a-z0-9_]{1,40}$`), icon **bắt buộc có `nhan`**.

| # | Icon | `ma` | `nhan` (hiện trên nút) | Nghĩa | Dùng |
|---|---|---|---|---|---|
| 23 | 🤩 | `choang` | Choáng | wow, mắt sao | ✅ |
| 24 | 🥹 | `cam_dong` | Xúc động | nghẹn ngào vì tự hào (KHÔNG phải khóc buồn) | ✅ |
| 25 | 🎉 | `chuc_mung` | Chúc mừng | pháo giấy | ✅ |
| 26 | 🙌 | `gio_tay` | Hoan hô | hai tay giơ lên ăn mừng | ✅ |
| 27 | 😍 | `me` | Mê | mê thành tích này | ✅ |
| 28 | ✨ | `lap_lanh` | Lấp lánh | tỏa sáng | ✅ |
| 29 | 🫂 | `om` | Ôm cái | ủng hộ, động viên | ✅ |
| 30 | 🌈 | `ruc_ro` | Rực rỡ | tươi sáng, tích cực | ✅ |
| 31 | 😊 | `cuoi_tuoi` | Vui | cười tươi, vui lây | ✅ |
| 32 | 🙏 | `cam_on_ban` | Cảm ơn | cảm ơn / nhờ chia sẻ bí kíp | ✅ |
| 33 | 👌 | `on_ap` | Chuẩn | ổn áp, làm tốt | ✅ |
| 34 | 💖 | `tim_sang` | Tim sáng | thương, ủng hộ (bạn bè) | ✅ |
| 35 | 🌻 | `huong_duong` | Tươi sáng | tích cực, hướng về phía trước | ✅ |
| 36 | ☀️ | `toa_nang` | Toả nắng | lan toả năng lượng | ✅ |
| 37 | 🎈 | `bong_bay` | Vui lây | vui cùng thành tích | ✅ |
| 38 | 🤞 | `cau_may` | Cầu may | chúc may mắn kỳ sau | ✅ |
| 39 | ✌️ | `chien_thang` | Chiến thắng | dấu V chiến thắng | ✅ |
| 40 | 🥇 | `hang_nhat` | Hạng nhất | top 1 | ✅ |
| 41 | 📚 | `cham_hoc` | Chăm học | chăm chỉ, siêng năng | ✅ |
| 42 | 🎓 | `hoc_ba` | Học bá | học giỏi | ✅ |
| — | 💡 | — | — | trùng nghĩa 🧠 Não to và sticker `s_y_tuong` — để ở sticker | ⚠ |
| — | 😭 | — | — | teen dùng cả "khóc cười" lẫn "khóc buồn" ⇒ có thể đọc mỉa | ❌ |
| — | 🍿 | — | — | "hóng drama" — không hợp khoe thành tích | ❌ |

> ⚠ Dải cảm xúc (giữ nút Thích) có 42 icon ⇒ **cần chia 2 tab** ("Hay dùng" 12 icon đầu / "Thêm") hoặc cuộn ngang — việc UI nhỏ, Claude làm khi có ảnh. Facebook chỉ 7; trên ~30 icon khó chọn trên điện thoại.

## B. Sticker bình luận — thêm 48 (12 → 60), xếp theo NGỮ CẢNH

Hiện tại là emoji to (cờ `KIT.sticker_tg` tắt). Khi có ảnh thật: thả `public/bk-ui/hs/gami/the-gioi/sticker/<ma>.png` + bật cờ — **mã & DB không đổi**.
`nhom` dùng để sau này lọc theo loại tin (chưa lọc ngay — mọi sticker hiện cho mọi tin).

### B1. Ăn mừng / hype (`chung`)
| `ma` | Emoji | Ý | | `ma` | Emoji | Ý |
|---|---|---|---|---|---|---|
| `s_choang` | 🤩 | choáng, mắt sao | | `s_me` | 😍 | mê quá |
| `s_cam_dong` | 🥹 | tự hào xúc động | | `s_gio_tay` | 🙌 | hoan hô |
| `s_phao_giay` | 🎉 | chúc mừng | | `s_phao_hoa` | 🎊 | pháo hoa bay |
| `s_om` | 🫂 | ôm động viên | | `s_thuong` | 🥰 | thương thương |
| `s_lap_lanh` | ✨ | tỏa sáng | | `s_cau_vong` | 🌈 | rực rỡ |
| `s_sao_bang` | 💫 | sao xoay | | `s_ngoi_sao` | 🌟 | ngôi sao |

### B2. Học tập (`hoc`)
| `ma` | Emoji | Ý | | `ma` | Emoji | Ý |
|---|---|---|---|---|---|---|
| `s_sach` | 📚 | mọt sách theo nghĩa khen | | `s_viet_bai` | ✍️ | chăm làm bài |
| `s_thuoc_ke` | 📐 | chuẩn từng li | | `s_ong_nghiem` | 🧪 | thí nghiệm đỉnh |
| `s_kinh_hien_vi` | 🔬 | soi kỹ từng bước | | `s_cu_nhan` | 🎓 | tốt nghiệp xuất sắc |
| `s_y_tuong` | 💡 | ý tưởng hay | | `s_cu_meo` | 🦉 | cú thông thái |
| `s_chia_khoa` | 🗝️ | xin bí kíp | | `s_bieu_do_len` | 📈 | tiến bộ vọt |
| `s_huy_chuong_vang` | 🥇 | hạng nhất | | `s_huy_chuong` | 🏅 | huy chương |

### B3. Nỗ lực / bền bỉ (`noluc`)
| `ma` | Emoji | Ý | | `ma` | Emoji | Ý |
|---|---|---|---|---|---|---|
| `s_rua` | 🐢 | chậm mà chắc | | `s_kien` | 🐜 | kiến tha lâu đầy tổ |
| `s_nui` | ⛰️ | chinh phục đỉnh | | `s_leo_nui` | 🧗 | leo lên từng bậc |
| `s_khien` | 🛡️ | kiên cường | | `s_kiem` | ⚔️ | chiến thần |
| `s_lua_manh` | ❤️‍🔥 | nhiệt huyết | | `s_dong_ho` | ⏳ | kiên trì theo thời gian |

### B4. Game / trận (`game`)
| `ma` | Emoji | Ý | | `ma` | Emoji | Ý |
|---|---|---|---|---|---|---|
| `s_game` | 🎮 | level max | | `s_cu_dam` | 🥊 | knock-out thử thách (găng BÔNG hoạt hình) |
| `s_pao` | 🏰 | thành trì vững | | `s_rong` | 🐲 | trùm cuối bị hạ |
| `s_kho_bau` | 🪙 | trúng đậm | | `s_ruong` | 🎁 | mở rương hên |
| `s_ma_thuat` | 🪄 | phép màu | | `s_hoa_tien` | ☄️ | bay vọt |

### B5. May mắn (`mayman`)
| `ma` | Emoji | Ý | | `ma` | Emoji | Ý |
|---|---|---|---|---|---|---|
| `s_li_xi` | 🧧 | lì xì vía | | `s_cho_may` | 🐱 | mèo thần tài |
| `s_ngua` | 🐴 | mã đáo thành công | | `s_sao_may_man` | 🌠 | sao băng may mắn |

### B6. Linh vật tròn dễ thương — chờ vẽ ảnh riêng (mục D) (`chung`)
Tạm dùng emoji thú; sau thay bằng linh vật BK. Chọn thú **đã là biểu tượng tích cực**:
| `ma` | Emoji | | `ma` | Emoji | | `ma` | Emoji |
|---|---|---|---|---|---|---|---|
| `s_meo` | 🐱 | | `s_cun` | 🐶 | | `s_ech` | 🐸 |
| `s_gau_truc` | 🐼 | | `s_cao` | 🦊 | | `s_ky_lan` | 🦄 |
| `s_su_tu` | 🦁 | | `s_chim_cut` | 🐧 | | `s_tho` | 🐰 |
| `s_ga_con` | 🐥 | | | | | | |

> ❌ Không dùng: 💀 🗿 🤡 😂 🙃 🤓 😏 🥶 😭 🐷 (teen dùng để cười cợt / chê) — như danh mục gốc.
> ⚠ `s_cho_may` (🐱) trùng `s_meo` về hình ⇒ khi vẽ ảnh thật, `s_cho_may` = mèo thần tài (vẫy tay + đồng xu), `s_meo` = mèo thường.

---

## C. Câu meme bình luận — thêm ~60 (mã mới `c80`…) 🕒 = duyệt độ còn thời

Mã `c80+` (c01–c77 đã dùng; c60–c64 là `cam_on`). `nhom`: `chung · hoc · noluc · mayman · game`.

### C1. Hype chung (`chung`)
| Mã | Câu | |
|---|---|---|
| c80 | Xịn xò con bò 🐮 | 🕒 |
| c81 | Nghe sương sương mà đỉnh thật | 🕒 |
| c82 | Hết ý luôn nha | |
| c83 | Tuyệt vời ông mặt trời ☀️ | 🕒 |
| c84 | Giỏi dữ vậy trời | |
| c85 | Respect cậu luôn 🫡 | |
| c86 | Cực phẩm là đây | 🕒 |
| c87 | Xứng đáng 100% 💯 | |
| c88 | Mãi đỉnh, mãi đỉnh | |
| c89 | Quá chuẩn, không cần chỉnh | |
| c90 | Đỉnh kout 🔝 | 🕒 |
| c91 | Auto xịn xò | 🕒 |
| c92 | Xỉu ngang vì dễ thương quá 🥹 | 🕒 |
| c93 | Cái này gọi là đẳng cấp | |
| c94 | Thơm lây với nha 🌸 | 🕒 |
| c95 | Hít vía cậu cái 🍀 | |
| c96 | Chúc mừng nhaaa 🎉 | |
| c97 | Hoan hô hoan hô 🙌 | |

### C2. Học (`hoc`)
| Mã | Câu | |
|---|---|---|
| c98 | Học bá là đây chứ đâu | |
| c99 | Học thế nào dạy tớ với 🙏 | |
| c100 | Chuyện nhỏ như con thỏ 🐰 | 🕒 |
| c101 | Dễ như ăn kẹo 🍬 | |
| c102 | Bài khó gặp cậu là hết khó | |
| c103 | Não to thật sự luôn 🧠 | |
| c104 | Đúng chuẩn thủ khoa tương lai 🎓 | |
| c105 | Điểm số nói lên tất cả 📈 | |
| c106 | Thầy cô chắc tự hào lắm 🥹 | |
| c107 | Sao cậu giỏi vậy, bật mí đi | |
| c108 | Gương mặt vàng của BK 🥇 | |

### C3. Nỗ lực (`noluc`)
| Mã | Câu | |
|---|---|---|
| c109 | Cày không ngừng nghỉ 💪 | |
| c110 | Ngã ở đâu đứng lên ở đó | |
| c111 | Từng bước một, tới đỉnh luôn ⛰️ | |
| c112 | Cố gắng của cậu ai cũng thấy | |
| c113 | Giữ vững phong độ nha 🔥 | |
| c114 | Cứ thế phát huy, tớ cổ vũ 📣 | |
| c115 | Kiên trì là chìa khóa 🗝️ | |
| c116 | Chăm như vậy bảo sao giỏi | |
| c117 | Hôm nay hơn hôm qua rồi đó ✨ | |

### C4. Game (`game`)
| Mã | Câu | |
|---|---|---|
| c118 | Hạ gục trùm cuối rồi 🐲 | |
| c119 | Combo liên hoàn, quá đã 🥊 | |
| c120 | Pha xử lý đỉnh cao 🎯 | |
| c121 | Chơi như pro vậy 🎮 | |
| c122 | Level này cân hết 😎 | |
| c123 | Team có cậu là yên tâm | |
| c124 | MVP không cần bàn cãi 🏅 | |

### C5. May mắn (`mayman`)
| Mã | Câu | |
|---|---|---|
| c125 | Hên xui gì, là thực lực + vía 🍀 | |
| c126 | Cho xin ít lộc với 🧧 | |
| c127 | Nhân phẩm bùng nổ 🎊 | |
| c128 | Trúng lớn rồi, khao trà sữa nha 🧋 | |

### C6. Cổ vũ khi ai đó chưa xong / gần đạt (`noluc`)
Dùng cho tin kiểu "đang cày", "suýt đạt" (nếu tin loại này có) — **động viên, không phán xét**:
| Mã | Câu |
|---|---|
| c129 | Sắp tới rồi, cố lên nhé 💪 |
| c130 | Một chút nữa thôi là xong 🔥 |
| c131 | Tớ tin cậu làm được 🫶 |
| c132 | Mai thành công cũng chưa muộn 🌅 |

### C7. Câu CHỦ TIN trả lời (`cam_on`) — thêm 8 (c60–c64 đã có)
| Mã | Câu |
|---|---|
| c133 | Cảm ơn cả nhà, yêu mọi người 🫶 |
| c134 | Nhờ vía mọi người nên mới được 🍀 |
| c135 | Hẹn mọi người ở nấc cao hơn 🚀 |
| c136 | Cảm ơn nha, tớ sẽ cố hơn nữa 💪 |
| c137 | Mọi người cũng giỏi lắm đó ✨ |
| c138 | Học cùng nhau lên top nào 🤝 |
| c139 | Xúc động quá, cảm ơn mọi người 🥹 |
| c140 | Tớ nhận vía, truyền lại cho cả lớp 🍀 |

### C8. Câu DẪN KHOE (`khoe`) — người khoe chọn khi đăng, thêm 20 (k13–k30 đã có)
Công thức TikTok: **POV · plot twist · "không phải khoe nhưng…"**.
| Mã | Câu | |
|---|---|---|
| k31 | POV: vừa lên top 😎 | 🕒 |
| k32 | Plot twist: tớ học giỏi thật 😤 | 🕒 |
| k33 | Không phải khoe nhưng… (khoe thật) | 🕒 |
| k34 | Nhẹ nhàng thôi mà, ai ngờ 🔥 | |
| k35 | Cho tớ xin 5 phút khoe nha 📣 | |
| k36 | Tình hình là tớ giỏi lên rồi 😆 | |
| k37 | Check-in thành tích hôm nay ✅ | |
| k38 | Update: giỏi hơn hôm qua 1% 📈 | |
| k39 | Ting ting! Có tin vui 🔔 | |
| k40 | Bật mí nhé: nhờ chăm đó 💪 | |
| k41 | Đến lúc tỏa sáng rồi ✨ | |
| k42 | Học mệt mà vui, nhìn nè 🥹 | |
| k43 | Hôm nay tớ là main character 🎬 | 🕒 |
| k44 | Cứu, tớ giỏi quá trời 🤭 | 🕒 |
| k45 | Chốt đơn thành tích luôn! 🛒 | 🕒 |
| k46 | Một ngày đẹp trời để tỏa sáng ☀️ | |
| k47 | Thử thách hoàn thành, mời mọi người xem 🏁 | |
| k48 | Mở rương hên được liền 🎁 | |
| k49 | Tớ làm được, cậu cũng làm được 🤝 | |
| k50 | Level up rồi nha 🎮 | |

---

## D. Hướng "meme ẢNH" và linh vật BK (chưa code — cần quyết)

Hiện chưa có loại ảnh meme. Ba hướng, theo thứ tự CTO khuyên:

| Hướng | Mô tả | Bản quyền | Chi phí | Khuyên |
|---|---|---|---|---|
| **1. Linh vật BK vẽ riêng** | 1–2 nhân vật tròn (mèo/cún hoặc theo style RPG) × 16–24 biểu cảm học tập (xin bí kíp · bái sư · ăn mừng · cày · nổ não · ôm · hóng điểm · ngủ gật-nhưng-vẫn-giỏi…). Tĩnh + bản động 4 khung | **BK sở hữu** | ChatGPT vẽ như Đơn 6 | ✅ **Chọn** |
| 2. Mua bản quyền 1 bộ có sẵn | Họa sĩ Việt hoặc đại lý (spec §8): hợp đồng văn bản, cấp phép dùng trong app nội bộ, xin file gốc | Theo hợp đồng | Vài triệu/năm (họa sĩ VN) → cao hơn (thương hiệu ngoại) | ⚠ nếu Thùy thích 1 bộ cụ thể |
| 3. Google Noto Animated Emoji | CC BY 4.0, 52/59 emoji có bản động | Hợp pháp, phải ghi công "Emoji: Google Noto" | 0đ | ✅ làm **bản động tạm** |
| ❌ | Trích sticker Zalo/Mess/TikTok, ảnh meme mạng (mặt người thật) | Vi phạm | — | ❌ |

**Bộ 16 biểu cảm linh vật BK đề xuất** (khớp câu hay dùng; mỗi biểu cảm = 1 `ma` sticker mới, thay 12 emoji tạm khi vẽ xong):
`xin_bi_kip` · `bai_su` · `an_mung` · `nuoc_mat_tu_hao` · `co_len` · `cay_khong_met` · `no_nao` · `tim_bay` · `om` · `ngau` · `vo_tay` · `ngu_gat_van_gioi` · `cam_cup` · `xin_via` · `chao_co` · `nhay_mua`

---

## E. Nạp vào DB (bản nháp migration — CHƯA áp, chờ Thùy lọc)

Tạo bằng `npm run new-migration the_gioi_mo_rong_sticker_cam_xuc_meme` rồi dán. Chỉ **INSERT** (không đụng mã cũ); `on conflict (ma) do nothing` để chạy lại an toàn. Cột `nhan` bắt buộc cho icon, cấm cho câu/sticker (CHECK `the_gioi_danh_muc_nhan_check`).
Lưu ý `thu_tu` sticker bắt đầu 13; câu dùng thứ tự = số mã.

```sql
-- A. Icon thả cảm xúc +20 (thu_tu 23–42)
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhan, nhom, thu_tu) values
  ('choang','icon','🤩','Choáng','{chung}',23), ('cam_dong','icon','🥹','Xúc động','{chung}',24),
  ('chuc_mung','icon','🎉','Chúc mừng','{chung}',25), ('gio_tay','icon','🙌','Hoan hô','{chung}',26),
  ('me','icon','😍','Mê','{chung}',27), ('lap_lanh','icon','✨','Lấp lánh','{chung}',28),
  ('om','icon','🫂','Ôm cái','{chung}',29), ('ruc_ro','icon','🌈','Rực rỡ','{chung}',30),
  ('cuoi_tuoi','icon','😊','Vui','{chung}',31), ('cam_on_ban','icon','🙏','Cảm ơn','{chung}',32),
  ('on_ap','icon','👌','Chuẩn','{chung}',33), ('tim_sang','icon','💖','Tim sáng','{chung}',34),
  ('huong_duong','icon','🌻','Tươi sáng','{chung}',35), ('toa_nang','icon','☀️','Toả nắng','{chung}',36),
  ('bong_bay','icon','🎈','Vui lây','{chung}',37), ('cau_may','icon','🤞','Cầu may','{chung}',38),
  ('chien_thang','icon','✌️','Chiến thắng','{chung}',39), ('hang_nhat','icon','🥇','Hạng nhất','{chung}',40),
  ('cham_hoc','icon','📚','Chăm học','{chung}',41), ('hoc_ba','icon','🎓','Học bá','{chung}',42)
on conflict (ma) do nothing;

-- B. Sticker +48 (thu_tu 13–60)
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  ('s_choang','sticker','🤩','{chung}',13), ('s_me','sticker','😍','{chung}',14), ('s_cam_dong','sticker','🥹','{chung}',15),
  ('s_gio_tay','sticker','🙌','{chung}',16), ('s_phao_giay','sticker','🎉','{chung}',17), ('s_phao_hoa','sticker','🎊','{chung}',18),
  ('s_om','sticker','🫂','{chung}',19), ('s_thuong','sticker','🥰','{chung}',20), ('s_lap_lanh','sticker','✨','{chung}',21),
  ('s_cau_vong','sticker','🌈','{chung}',22), ('s_sao_bang','sticker','💫','{chung}',23), ('s_ngoi_sao','sticker','🌟','{chung}',24),
  ('s_sach','sticker','📚','{hoc}',25), ('s_viet_bai','sticker','✍️','{hoc}',26), ('s_thuoc_ke','sticker','📐','{hoc}',27),
  ('s_ong_nghiem','sticker','🧪','{hoc}',28), ('s_kinh_hien_vi','sticker','🔬','{hoc}',29), ('s_cu_nhan','sticker','🎓','{hoc}',30),
  ('s_y_tuong','sticker','💡','{hoc}',31), ('s_cu_meo','sticker','🦉','{hoc}',32), ('s_chia_khoa','sticker','🗝️','{hoc}',33),
  ('s_bieu_do_len','sticker','📈','{hoc}',34), ('s_huy_chuong_vang','sticker','🥇','{hoc}',35), ('s_huy_chuong','sticker','🏅','{hoc}',36),
  ('s_rua','sticker','🐢','{noluc}',37), ('s_kien','sticker','🐜','{noluc}',38), ('s_nui','sticker','⛰️','{noluc}',39),
  ('s_leo_nui','sticker','🧗','{noluc}',40), ('s_khien','sticker','🛡️','{noluc}',41), ('s_kiem','sticker','⚔️','{noluc}',42),
  ('s_lua_manh','sticker','❤️‍🔥','{noluc}',43), ('s_dong_ho','sticker','⏳','{noluc}',44),
  ('s_game','sticker','🎮','{game}',45), ('s_cu_dam','sticker','🥊','{game}',46), ('s_pao','sticker','🏰','{game}',47),
  ('s_rong','sticker','🐲','{game}',48), ('s_kho_bau','sticker','🪙','{game}',49), ('s_ruong','sticker','🎁','{game}',50),
  ('s_ma_thuat','sticker','🪄','{game}',51), ('s_hoa_tien','sticker','☄️','{game}',52),
  ('s_li_xi','sticker','🧧','{mayman}',53), ('s_cho_may','sticker','🐱','{mayman}',54), ('s_ngua','sticker','🐴','{mayman}',55),
  ('s_sao_may_man','sticker','🌠','{mayman}',56),
  ('s_meo','sticker','🐱','{chung}',57), ('s_cun','sticker','🐶','{chung}',58), ('s_ech','sticker','🐸','{chung}',59),
  ('s_gau_truc','sticker','🐼','{chung}',60)
on conflict (ma) do nothing;
-- (s_cao 🦊 · s_ky_lan 🦄 · s_su_tu 🦁 · s_chim_cut 🐧 · s_tho 🐰 · s_ga_con 🐥 chờ vẽ linh vật — thêm sau, thu_tu 61–66)

-- C. Câu bình luận — dán tiếp từ bảng C1–C7 theo mẫu:
--   ('c80','cau','Xịn xò con bò 🐮','{chung}',80), ('c81','cau','Nghe sương sương mà đỉnh thật','{chung}',81), …
--   Câu cam_on: nhom '{cam_on}' · Câu khoe: mã k31…k50, nhom '{khoe}', thu_tu 231…250 (k13–k30 = 213–230).
-- Sau khi Thùy lọc xong bảng C, CTO sinh nốt khối INSERT đầy đủ — KHÔNG nạp trước khi lọc.
```

## G. PHÙ HỢP HỌC SINH (lớp 3–12) — tiêu chí lọc + chỗ đã chỉnh

**Tiêu chí (áp cho icon · sticker · câu · hình vẽ):**
1. **Khen / cổ vũ một chiều** — không so sánh hạ bạn khác, không tạo áp lực hơn thua.
2. **Không tình cảm đôi lứa** — 😍 🥰 💖 🫂 chỉ nghĩa **thương / mê thành tích, bạn bè**. Khi vẽ: mắt tim nhìn cúp / ngôi sao (không nhìn nhân vật khác), không hôn, không ôm sát kiểu đôi lứa.
3. **Không bạo lực** — 🥊 găng bông hoạt hình, ⚔️ kiếm đồ chơi, không máu / vũ khí thật.
4. **Không cờ bạc / tiền thật** — 🪙 🎁 chỉ là **xu / rương trong game học**; không quay số kiểu casino, không tiền mặt.
5. **Không rượu bia, thuốc lá, chất kích thích** — không 🍺 🍻 🚬 💊; "ăn mừng" = pháo giấy, bánh, trà sữa.
6. **Không nội dung tôn giáo / mê tín nặng** — bỏ 🧿 (bùa mắt xanh); "xin vía" giữ dạng 🍀 🌠 (nhẹ, quen thuộc); 🙏 chỉ nghĩa **cảm ơn / nhờ giúp**.
7. **Không ngoại hình / cân nặng / giới tính** — không sticker nhắc béo gầy, đẹp xấu; linh vật trung tính giới.
8. **Không mỉa / châm chọc** — loại 💀 🗿 🤡 😂 🙃 🤓 😏 🥶 😭 🍿.
9. **Từ ngữ** — không tục (vl, vcl…), không lách tục; không câu dễ bị cố ý đọc mỉa.
10. **Lớp 3–5 đọc được** — câu ngắn, ít tiếng lóng nặng; câu trend (🕒) có thể ẩn riêng theo lớp (`nhom` về sau).

**Đã chỉnh so với bản đầu 25/10:** bỏ `s_nhan_via` 🧿 → `s_sao_may_man` 🌠 · `s_cu_dam` bắt buộc găng bông · `me` / `s_me` / `s_thuong` dặn "mê thành tích".

## F. Việc kế tiếp (đợi Thùy)

1. Thùy **lọc** mục A–C (đánh ❌ câu/emoji không muốn; đánh 🕒 nào còn thời).
2. Chọn hướng ở mục D (khuyên: **linh vật BK vẽ riêng** + Noto làm bản động tạm).
3. CTO sinh migration đầy đủ (E) → áp bằng `npm run migrate` → `npm run schema` → commit cùng `schema.md`.
4. Client **không cần sửa** — `fn_the_gioi_binh_luan` chỉ kiểm mã còn trong danh mục (`an_at is null`); ô sticker đã lưới 4 cột tự dài thêm (cân nhắc thêm tab theo `nhom` khi vượt ~60).
