from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parent
POSES = [["dung_1",900],["dung_2",900],["suy_nghi",1200],["tich_nang_1",325],["tich_nang_2",325],["niem_troi_1",120],["niem_troi_2",1600],["nem_truoc_1",150],["nem_truoc_2",1500],["phat_nho",600],["bi_danh_1",250],["bi_danh_2",500],["guc",1800],["thang_1",550],["thang_2",550]]
FX = ['fx_cau_lua','fx_cau_bang','fx_thien_thach','fx_dan_ma','fx_bang_boc']
USES = ['Làm câu hỏi','Làm câu hỏi','Làm câu hỏi','Mọi đòn','Mọi đòn','Sét / thiên thạch 100%','Sét / thiên thạch 100%','Lửa / băng 80%','Lửa / băng 80%','Cầu nhỏ / điện nhỏ 60%','Thua trận','Thua trận','Thua trận','Thắng cả lượt','Thắng cả lượt']
data = {'poses':[p[0] for p in POSES], 'fx':FX, 'meta':{}, 'standingHeight':{}}
for sex in ['nam','nu']:
    data['meta'][sex] = {}
    rows=[]
    for i,(pose,ms) in enumerate(POSES):
        path=ROOT/sex/'assets/characters'/f'chinh_{sex}_{pose}.png'
        im=Image.open(path)
        assert im.mode=='RGBA' and im.size==(1024,1536), str(path)
        alpha=im.getchannel('A')
        assert alpha.getpixel((0,0))==0
        bb=alpha.point(lambda v:255 if v>=240 else 0).getbbox()
        x,y,r,b=bb
        ground=.94 if pose=='thang_1' else b/1536
        m={'anchor':[.5,ground],'bbox':[x,y,r-x,b-y],'size':list(im.size),'hands':[[.75,.5]]}
        if pose=='dung_1':data['standingHeight'][sex]=b-y
        hands={'tich_nang_1':[[.73,.46]],'tich_nang_2':[[.86,.48 if sex=='nam' else .50]],'nem_truoc_2':[[.955,.39 if sex=='nam' else .405]],'phat_nho':[[.97,.33 if sex=='nam' else .32]],'niem_troi_2':[[.43,.10],[.67,.10]]}
        hands['niem_troi_2']=[[.43,.10],[.865,.105]] if sex=='nam' else [[.41,.07],[.825,.08]]
        m['hands']=hands.get(pose,m['hands'])
        data['meta'][sex][pose]=m
        mode='Lặp 2 khung' if pose in ['dung_1','dung_2','thang_1','thang_2'] else 'Giữ cuối chuỗi' if pose=='guc' else 'Chuyển theo chuỗi'
        duration='325 / 350 theo đòn' if pose.startswith('tich_nang') else 'Giữ tới đổi trạng thái' if pose=='guc' else str(ms)
        rows.append(f'| chinh_{sex}_{pose}.png | 1024×1536 | (50%, {ground*100:.2f}%) | 50% | ({x}, {y}, {r-x}, {b-y}) | Neo cảnh (251,468), cùng scale đứng; cao đứng 319,94px | {USES[i]} | {mode} | {duration} |')
    fxrows=[]
    for name in FX:
        im=Image.open(ROOT/sex/'assets/fx'/f'{name}.png');assert im.mode=='RGBA'
        head='Dưới-phải (78%,78%)' if name=='fx_thien_thach' else 'Phải (82%,50%)' if name!='fx_bang_boc' else 'Không đầu đạn; lớp bọc rỗng'
        size='330px / 19,74%' if name=='fx_thien_thach' else '300×390px ô boss' if name=='fx_bang_boc' else '280px / 16,75%' if name=='fx_dan_ma' else '410px / 24,52%'
        fxrows.append(f'| {name}.png | {im.width}×{im.height} RGBA | {head} | {size} | Điểm xoay tại đầu đạn; bọc băng dùng tâm (50%,50%) |')
    bg=Image.open(ROOT/sex/'assets/backdrop/backdrop_san_dau.png')
    handsrows=[]
    for pose in ['tich_nang_2','nem_truoc_2','phat_nho','niem_troi_2']:
        handsrows.append('| '+pose+' | '+', '.join(f'≈({p[0]*100:.1f}%, {p[1]*100:.1f}%)' for p in data['meta'][sex][pose]['hands'])+' |')
    doc=f'''# Kit chiến đấu {sex.upper()} · v1

15 PNG nhân vật sinh riêng bằng ImageGen; 5 FX riêng, 1 nền. Nhân vật nhìn phải. Kit nam/nữ cùng bố cục, thời gian và danh sách tư thế. Mỗi kit giữ một bản FX/nền để dùng độc lập.

## Cấu trúc

```text
assets/characters/chinh_{sex}_<tu_the>.png
assets/fx/fx_<loai>.png
assets/backdrop/backdrop_san_dau.png
reference/reference_chien_dau_{sex}.png
reference/reference_canh_chien_dau_{sex}_cho_boss.png
DESIGN.md
```

Xem chuyển động trong `../xem_thu_chien_dau.html`. Dữ liệu neo và hộp bao nằm trong `../combat-data.json`. PNG gốc không cắt từ bảng tư thế.

## Kiểm kê tư thế · Vị trí & cỡ

Hộp bao (x,y,w,h) tính bằng px với alpha ≥240, bỏ viền alpha mờ. Neo mặt đất đo ở đáy hộp bao; tư thế nhảy dùng mặt đất ảo 94%. Trục đặt ảnh là x50%. Toạ độ neo thực tế thay đổi nhẹ giữa PNG; phải dùng bảng/JSON khi đổi tư thế, không đặt chung top-left. Scale chung lấy chiều cao tư thế đứng, không phóng lớn tư thế gục theo chiều cao hộp bao.

| Tên file | Khổ ảnh | Điểm chạm đất trong ảnh | Trục thân | Hộp bao thân px | Vị trí & cỡ trên cảnh 1672×941 | Đòn | Lặp / giữ | ms |
|---|---|---|---|---|---|---|---|---|
'''+ '\n'.join(rows)+'''

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
'''+ '\n'.join(handsrows)+'''

Công thức: điểm cảnh = top-left ảnh đã neo + điểm tay × kích thước ảnh hiển thị. Đạn phát từ tay, không phát từ tâm nhân vật.

## FX · Vị trí & cỡ

| Tên file | Khổ thực tế | Hướng / điểm đầu trong ảnh | Vị trí & cỡ trên cảnh | Điểm xoay |
|---|---|---|---|---|
'''+ '\n'.join(fxrows)+f'''

Ảnh FX gốc có độ phân giải lớn hơn khổ yêu cầu; giữ nguyên alpha, thu bằng code khi hiển thị. Đạn boss lật ngang để bay phải → trái. Thiên thạch hướng trên-trái → dưới-phải. Bóng chân, quầng theo nguyên tố, cầu gom năng lượng, tia điện, va chạm và sao trên đầu gục nằm ở lớp canvas riêng.

## Nền và bố cục

- backdrop_san_dau.png: {bg.width}×{bg.height}, ảnh đặc. Khổ yêu cầu2400×860; ảnh sinh thực tế2094×751, cùng tỉ lệ gần2,79:1. Bản xem thử hiển thị vùng nền1672×600.
- Mặt sân bắt đầu khoảng y58–62% nền. Điểm đứng anh hùng (15%,78%) và boss (85%,78%) trên vùng sân; trong cảnh là (251,468) và (1421,468).
- Vùng giữa x25–75%, y0–78% dành đường đạn. Cột/đèn ở rìa; không đặt nhân vật hoặc vật che đường đạn ở giữa. Vùng dưới sân (y600–941 cảnh) dành khung câu hỏi.
- Nhân vật đứng: 34% chiều cao cảnh =319,94px. Boss: 38% =357,58px. Boss hướng trái; ảnh hiện có bộ kit chưa chứa boss.
- Thanh máu, 3 trận ×5 câu, nút đáp án, bóng chân và quầng nguyên tố dựng bằng code ứng dụng; bản này tập trung xem thử animation.

## Tham chiếu và giới hạn

Bảng tư thế5×3 nền xám để kiểm tra toàn bộ bộ ảnh. Cảnh tham chiếu1672×941 dùng nem_truoc_2 và cầu lửa ở giữa. Chưa có ảnh `boss_thuy_dung` và `bg_lau_dai_chibi_ngang` trong đầu vào hiện tại; vùng boss giữ chỗ và nền sân đấu được thiết kế theo mô tả màu đêm tím, đá cổ, đèn vàng. Có nút chọn ảnh boss cục bộ trong bản xem thử.

PNG nhân vật có alpha thật; một số ảnh giữ viền ánh vàng mềm từ phong cách gốc. Chân và kích thước thân của ảnh sinh không đồng nhất tuyệt đối; JSON neo bù vị trí trong demo. Khi tích hợp cần giữ scale chung và kiểm tra lại pivot thân/tay ở kích thước dùng thực tế.

## Bộ prompt

Sinh mới riêng từng pose từ ảnh nhân vật chuẩn: giữ mặt, tóc, trang phục, màu xanh-vàng và phong cách chibi vẽ tay; hướng phải; diễn xuất thân/tay/tóc/áo choàng theo tên tư thế; không chữ, vật thể thừa hay đạn; yêu cầu alpha thật1024×1536. FX sinh riêng, đầu phải đuôi trái; nền sân đấu sinh riêng, không nhân vật/chữ. Công cụ: ImageGen tích hợp.
'''
    (ROOT/sex/'DESIGN.md').write_text(doc,encoding='utf-8')
(ROOT/'combat-data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
html=ROOT/'xem_thu_chien_dau.html'
text=html.read_text(encoding='utf-8')
start=text.index('const DATA=');end=text.index(';',start)
text=text[:start]+'const DATA='+json.dumps(data,ensure_ascii=False)+text[end:]
text=text.replace('heroX=285,bossX=1390','heroX=251,bossX=1421')
html.write_text(text,encoding='utf-8')
print('Validated30characters; wrote metadata,2DESIGN,and preview data')
