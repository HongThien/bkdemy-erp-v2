# -*- coding: utf-8 -*-
"""Vẽ BẢN CHẤM ĐỎ cho 1 bài trong hàng đợi máy chấm BTVN (CEO 08/11).

Chạy: python scripts/btvn-ai/ve.py <thư mục bài> <điểm>      (điểm do fn_btvn_ai_diem tính — không tự tính ở đây)
Đọc de.json + ket_qua.json, ghi cham_<8 ký tự id>.jpg cạnh ảnh gốc, in JSON {id ảnh: file} ra stdout.

ket_qua.json → "danh_dau": { "<id ảnh>": [ dấu… ] }, toạ độ = TỈ LỆ 0..1 trên ảnh ĐÃ ĐỨNG ĐÚNG CHIỀU
(sau khi xoay theo xoay_anh / xoay_hien_tai):
  {"loai": "D", "x": .., "y": ..}                       chữ Đ đỏ (câu/ý đúng)
  {"loai": "C" | "S", "x": .., "y": ..}                 nhãn C / S
  {"loai": "khoanh", "x1": .., "y1": .., "x2": .., "y2": ..}   khoanh chữ nhật chỗ sai
  {"loai": "ghi", "x": .., "y": .., "text": "…"}        1 dòng nhận xét (nền trắng viền đỏ)
  {"loai": "diem", "x": .., "y": ..}                    góc trên-trái của CON SỐ điểm: ngay dưới chữ "ĐIỂM" góc trên phải trang 1
Không có dấu "diem" ⇒ ghi điểm góc trên phải trang đầu.
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

RED = (220, 0, 0)
FONT = 'C:/Windows/Fonts/segoeuib.ttf'
MAX = 2000  # cạnh dài tối đa của bản chấm


def font(px):
    return ImageFont.truetype(FONT, max(12, int(px)))


def main():
    d, diem = sys.argv[1], float(sys.argv[2])
    de = json.load(open(os.path.join(d, 'de.json'), encoding='utf-8'))
    kq = json.load(open(os.path.join(d, 'ket_qua.json'), encoding='utf-8'))
    dd = kq.get('danh_dau') or {}
    xoay = kq.get('xoay_anh') or {}
    thu_tu = kq.get('thu_tu_anh') or [a['id'] for a in de['anh']]
    anh = {a['id']: a for a in de['anh']}
    co_diem = any(m.get('loai') == 'diem' for ms in dd.values() for m in ms)
    trang_dau = next((i for i in thu_tu if i in anh), de['anh'][0]['id'])
    diem_txt = f"{diem:.2f}".rstrip('0').rstrip('.').replace('.', ',')
    out = {}
    for id_, a in anh.items():
        marks = list(dd.get(id_) or [])
        if not co_diem and id_ == trang_dau:
            marks.append({'loai': 'diem', 'x': 0.72, 'y': 0.04})
        if not marks:
            continue  # trang không có dấu nào ⇒ giữ ảnh gốc
        im = ImageOps.exif_transpose(Image.open(os.path.join(d, a['file']))).convert('RGB')
        goc = xoay.get(id_, a.get('xoay_hien_tai', 0)) or 0
        if goc:
            im = im.rotate(-goc, expand=True)  # PIL xoay ngược chiều kim đồng hồ
        s = MAX / max(im.size)
        if s < 1:
            im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
        W, H = im.size
        u = W / 1000  # đơn vị cỡ chữ theo bề ngang ảnh
        dr = ImageDraw.Draw(im)
        for m in marks:
            L = m.get('loai')
            if L in ('D', 'C', 'S'):
                dr.text((m['x'] * W, m['y'] * H), 'Đ' if L == 'D' else L, fill=RED, font=font(46 * u), anchor='mm')
            elif L == 'khoanh':
                dr.rectangle((m['x1'] * W, m['y1'] * H, m['x2'] * W, m['y2'] * H), outline=RED, width=max(2, int(4 * u)))
            elif L == 'ghi':
                f = font(22 * u)
                x, y = m['x'] * W, m['y'] * H
                b = dr.textbbox((x, y), m['text'], font=f)
                if b[2] > W - 4:  # tràn phải ⇒ dời sang trái
                    x -= b[2] - (W - 4)
                    b = dr.textbbox((x, y), m['text'], font=f)
                p = 5 * u
                dr.rectangle((b[0] - p, b[1] - p, b[2] + p, b[3] + p), fill='white', outline=RED, width=max(2, int(2 * u)))
                dr.text((x, y), m['text'], fill=RED, font=f)
            elif L == 'diem':  # chỉ con số, chữ đỏ TO như GV ghi vào ô ĐIỂM (CEO 08/11: "to một chút cho dễ nhìn")
                f = font(95 * u)
                x, y = m['x'] * W, m['y'] * H
                b = dr.textbbox((x, y), diem_txt, font=f, anchor='lt')
                if b[2] > W - 4:
                    x -= b[2] - (W - 4)
                dr.text((x, y), diem_txt, fill=RED, font=f, anchor='lt', stroke_width=max(1, int(2 * u)), stroke_fill=RED)
        f_out = f'cham_{id_[:8]}.jpg'
        im.save(os.path.join(d, f_out), quality=88)
        out[id_] = f_out
    print(json.dumps(out))


if __name__ == '__main__':
    main()
