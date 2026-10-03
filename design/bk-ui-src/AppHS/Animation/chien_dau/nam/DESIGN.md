# Kit chiến đấu NAM · v1

15 PNG nhân vật sinh riêng bằng ImageGen; 5 FX riêng, 1 nền. Nhân vật nhìn phải. Kit nam/nữ cùng bố cục, thời gian và danh sách tư thế. Mỗi kit giữ một bản FX/nền để dùng độc lập.

## Cấu trúc

```text
assets/characters/chinh_nam_<tu_the>.png
assets/fx/fx_<loai>.png
assets/backdrop/backdrop_san_dau.png
reference/reference_chien_dau_nam.png
reference/reference_canh_chien_dau_nam_cho_boss.png
DESIGN.md
```

Xem chuyển động trong `../xem_thu_chien_dau.html`. Dữ liệu neo và hộp bao nằm trong `../combat-data.json`. PNG gốc không cắt từ bảng tư thế.

## Kiểm kê tư thế · Vị trí & cỡ

Hộp bao (x,y,w,h) tính bằng px với alpha ≥240, bỏ viền alpha mờ. Neo mặt đất đo ở đáy hộp bao; tư thế nhảy dùng mặt đất ảo 94%. Trục đặt ảnh là x50%. Toạ độ neo thực tế thay đổi nhẹ giữa PNG; phải dùng bảng/JSON khi đổi tư thế, không đặt chung top-left. Scale chung lấy chiều cao tư thế đứng, không phóng lớn tư thế gục theo chiều cao hộp bao.

| Tên file | Khổ ảnh | Điểm chạm đất trong ảnh | Trục thân | Hộp bao thân px | Vị trí & cỡ trên cảnh 1672×941 | Đòn | Lặp / giữ | ms |
|---|---|---|---|---|---|---|---|---|
| chinh_nam_dung_1.png | 1024×1536 | (50%, 95.77%) | 50% | (96, 130, 768, 1341) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Làm câu hỏi | Lặp 2 khung | 900 |
| chinh_nam_dung_2.png | 1024×1536 | (50%, 94.14%) | 50% | (44, 111, 840, 1335) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Làm câu hỏi | Lặp 2 khung | 900 |
| chinh_nam_suy_nghi.png | 1024×1536 | (50%, 95.70%) | 50% | (83, 65, 795, 1405) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Làm câu hỏi | Chuyển theo chuỗi | 1200 |
| chinh_nam_tich_nang_1.png | 1024×1536 | (50%, 94.21%) | 50% | (28, 163, 944, 1284) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Mọi đòn | Chuyển theo chuỗi | 325 / 350 theo đòn |
| chinh_nam_tich_nang_2.png | 1024×1536 | (50%, 92.64%) | 50% | (20, 149, 965, 1274) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Mọi đòn | Chuyển theo chuỗi | 325 / 350 theo đòn |
| chinh_nam_niem_troi_1.png | 1024×1536 | (50%, 94.86%) | 50% | (36, 90, 939, 1367) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Sét / thiên thạch 100% | Chuyển theo chuỗi | 120 |
| chinh_nam_niem_troi_2.png | 1024×1536 | (50%, 95.83%) | 50% | (36, 82, 954, 1390) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Sét / thiên thạch 100% | Chuyển theo chuỗi | 1600 |
| chinh_nam_nem_truoc_1.png | 1024×1536 | (50%, 91.86%) | 50% | (17, 166, 1002, 1245) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Lửa / băng 80% | Chuyển theo chuỗi | 150 |
| chinh_nam_nem_truoc_2.png | 1024×1536 | (50%, 88.67%) | 50% | (12, 173, 1005, 1189) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Lửa / băng 80% | Chuyển theo chuỗi | 1500 |
| chinh_nam_phat_nho.png | 1024×1536 | (50%, 95.96%) | 50% | (27, 120, 978, 1354) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Cầu nhỏ / điện nhỏ 60% | Chuyển theo chuỗi | 600 |
| chinh_nam_bi_danh_1.png | 1024×1536 | (50%, 92.71%) | 50% | (31, 114, 982, 1310) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Thua trận | Chuyển theo chuỗi | 250 |
| chinh_nam_bi_danh_2.png | 1024×1536 | (50%, 93.95%) | 50% | (21, 117, 986, 1326) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Thua trận | Chuyển theo chuỗi | 500 |
| chinh_nam_guc.png | 1024×1536 | (50%, 82.03%) | 50% | (16, 405, 996, 855) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Thua trận | Giữ cuối chuỗi | Giữ tới đổi trạng thái |
| chinh_nam_thang_1.png | 1024×1536 | (50%, 94.00%) | 50% | (29, 76, 961, 1301) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Thắng cả lượt | Lặp 2 khung | 550 |
| chinh_nam_thang_2.png | 1024×1536 | (50%, 92.64%) | 50% | (27, 121, 964, 1302) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | Thắng cả lượt | Lặp 2 khung | 550 |

## Chuỗi động tác

- Làm câu hỏi: dung_1 ⇄ dung_2, 900ms mỗi khung; có thể chèn suy_nghi 1200ms.
- Sét / thiên thạch 100%: tich_nang_1 325ms → tich_nang_2 325ms (lặp cặp này nếu cần tích lâu) → niem_troi_1 120ms → niem_troi_2 giữ1600ms → dung_1.
- Lửa / băng 80%: tich_nang_1 350ms → tich_nang_2 350ms (lặp nếu cần) → nem_truoc_1 150ms → nem_truoc_2 giữ1500ms → dung_1.
- Cầu / điện nhỏ 60%: tich_nang_1 330ms → phat_nho giữ600ms → dung_1.
- Bị đánh: bi_danh_1 250ms → bi_danh_2 500ms → guc giữ tới khi đổi trạng thái. Demo dành1800ms cho nhịp cuối nhưng không tự quay về đứng.
- Thắng cả lượt: thang_1 ⇄ thang_2, 550ms/khung, lặp.

Demo lặp các đòn để xem thử, thêm500ms đứng giữa hai lượt. Trong màn thật, chỉ kích hoạt đòn sau khi kết thúc trận; lúc trả lời câu hỏi dùng đứng / suy nghĩ.

## Điểm tay

Các điểm dưới đây là vị trí gần đúng theo phần trăm PNG, cần tinh chỉnh nếu thay sprite. Hai điểm niệm trời ứng với hai bàn tay; tich_nang_2 là tâm khoảng trống giữa tay.

| Tư thế | Điểm tay / tâm cầu trong ảnh |
|---|---|
| tich_nang_2 | ≈(86.0%, 48.0%) |
| nem_truoc_2 | ≈(95.5%, 39.0%) |
| phat_nho | ≈(97.0%, 33.0%) |
| niem_troi_2 | ≈(43.0%, 10.0%), ≈(86.5%, 10.5%) |

Công thức: điểm cảnh = top-left ảnh đã neo + điểm tay × kích thước ảnh hiển thị. Đạn phát từ tay, không phát từ tâm nhân vật.

## FX · Vị trí & cỡ

| Tên file | Khổ thực tế | Hướng / điểm đầu trong ảnh | Vị trí & cỡ trên cảnh | Điểm xoay |
|---|---|---|---|---|
| fx_cau_lua.png | 1774×887 RGBA | Phải (82%,50%) | 410px / 24,52% | Điểm xoay tại đầu đạn; bọc băng dùng tâm (50%,50%) |
| fx_cau_bang.png | 1774×887 RGBA | Phải (82%,50%) | 410px / 24,52% | Điểm xoay tại đầu đạn; bọc băng dùng tâm (50%,50%) |
| fx_thien_thach.png | 1254×1254 RGBA | Dưới-phải (78%,78%) | 330px / 19,74% | Điểm xoay tại đầu đạn; bọc băng dùng tâm (50%,50%) |
| fx_dan_ma.png | 1774×887 RGBA | Phải (82%,50%) | 280px / 16,75% | Điểm xoay tại đầu đạn; bọc băng dùng tâm (50%,50%) |
| fx_bang_boc.png | 1122×1402 RGBA | Không đầu đạn; lớp bọc rỗng | 300×390px ô boss | Điểm xoay tại đầu đạn; bọc băng dùng tâm (50%,50%) |

Ảnh FX gốc có độ phân giải lớn hơn khổ yêu cầu; giữ nguyên alpha, thu bằng code khi hiển thị. Đạn boss lật ngang để bay phải → trái. Thiên thạch hướng trên-trái → dưới-phải. Bóng chân, quầng theo nguyên tố, cầu gom năng lượng, tia điện, va chạm và sao trên đầu gục nằm ở lớp canvas riêng.

## Nền và bố cục

- backdrop_san_dau.png: 2094×751, ảnh đặc. Khổ yêu cầu2400×860; ảnh sinh thực tế2094×751, cùng tỉ lệ gần2,79:1. Bản xem thử hiển thị vùng nền1672×600.
- Mặt sân bắt đầu khoảng y58–62% nền. Điểm đứng anh hùng (15%,78%) và boss (85%,78%) trên vùng sân; trong cảnh là (251,468) và (1421,468).
- Vùng giữa x25–75%, y0–78% dành đường đạn. Cột/đèn ở rìa; không đặt nhân vật hoặc vật che đường đạn ở giữa. Vùng dưới sân (y600–941 cảnh) dành khung câu hỏi.
- Nhân vật đứng: 34% chiều cao cảnh =319,94px. Boss: 38% =357,58px. Boss hướng trái; ảnh hiện có bộ kit chưa chứa boss.
- Thanh máu, 3 trận ×5 câu, nút đáp án, bóng chân và quầng nguyên tố dựng bằng code ứng dụng; bản này tập trung xem thử animation.

## Tham chiếu và giới hạn

Bảng tư thế5×3 nền xám để kiểm tra toàn bộ bộ ảnh. Cảnh tham chiếu1672×941 dùng nem_truoc_2 và cầu lửa ở giữa. Chưa có ảnh `boss_thuy_dung` và `bg_lau_dai_chibi_ngang` trong đầu vào hiện tại; vùng boss giữ chỗ và nền sân đấu được thiết kế theo mô tả màu đêm tím, đá cổ, đèn vàng. Có nút chọn ảnh boss cục bộ trong bản xem thử.

PNG nhân vật có alpha thật; một số ảnh giữ viền ánh vàng mềm từ phong cách gốc. Chân và kích thước thân của ảnh sinh không đồng nhất tuyệt đối; JSON neo bù vị trí trong demo. Khi tích hợp cần giữ scale chung và kiểm tra lại pivot thân/tay ở kích thước dùng thực tế.

## Bộ prompt

Sinh mới riêng từng pose từ ảnh nhân vật chuẩn: giữ mặt, tóc, trang phục, màu xanh-vàng và phong cách chibi vẽ tay; hướng phải; diễn xuất thân/tay/tóc/áo choàng theo tên tư thế; không chữ, vật thể thừa hay đạn; yêu cầu alpha thật1024×1536. FX sinh riêng, đầu phải đuôi trái; nền sân đấu sinh riêng, không nhân vật/chữ. Công cụ: ImageGen tích hợp.


## Va chạm v2

Sét: chớp nổ, rung, bóng đen/xương trắng và điện quanh thân. Thiên thạch: bay560ms rồi va chạm, nổ, đá vụn và bụi. Đặc tả ở `../HIEU_UNG_VA_CHAM.md`; xem trong HTML chung và APNG riêng của mỗi giới. Thời gian chuỗi/tư thế giữ nguyên.
