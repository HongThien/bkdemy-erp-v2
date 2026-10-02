# -*- coding: utf-8 -*-
"""
TRẠM ĐỌC ĐỀ THI FILE WORD (bộ "50 đề thực chiến vào 10 – form HN") → cau.json + ngu_lieu.json, cùng lõi phân tích với đề web
(doc_de_web.phan_tich) ⇒ đi tiếp qua bên A / bên B / cổng như mọi nguồn khác. Thùy 02/10: "hàng về… đề thi phải lưu lại đề".

    python scripts/anh/doc_de_docx.py <thư_mục_bộ_đề> <thư_mục_ra> [--chi 1,2,3]

- Đề: "ĐỀ SỐ_<n>.docx" → mã TC<nn>. Đáp án: "0. KEY.docx" ("ĐỀ LUYỆN SỐ n" + bảng "1. A").
- Ra: <thư_mục_ra>/nhap/TC<nn>/ (TC<nn>.cau.json, TC<nn>.ngu_lieu.json, ảnh TC<nn>_imageK.*) — đúng khuôn cổng ghi đọc.
- Ảnh biển báo nằm SẴN trong file Word; thông báo dạng chữ trong khung ⇒ ngữ liệu chữ.
- Đề thiếu số câu (bản Word bị rơi câu — đề 1 không có câu 24) ⇒ in cảnh báo; đáp án số đó KHÔNG dùng.
"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from docx_khoi import khoi_docx
from doc_de_web import phan_tich


# Quyết định TAY cho lỗi file gốc mà máy không tự phân xử được (ghi lý do — xem DEVLOG 02/10)
SUA_TAY = {
    # Đề 4 có 2 dòng "Question 19.": dòng ĐẦU (by/to/of/in) là dòng thừa — chỗ trống "(19) ___ of over seven million" chỉ hợp
    # "population" ở dòng thứ hai; đáp án KEY = C đúng cả 2 dòng nên KEY không phân xử được ⇒ phân xử bằng nghĩa.
    'TC04': {'bo_dong': [r'^Question 19\. A\. by B\. to C\. of D\. in$']},
}


def doc_key(path):
    dap, n = {}, None
    for loai, t in khoi_docx(path):
        m = re.search(r'Đ[ỀÊE]\s*LUYỆN\s*SỐ\s*(\d+)', t, re.I)
        if m:
            n = int(m.group(1)); dap.setdefault(n, {}); continue
        if n is None: continue
        for so, x in re.findall(r'(?<![\d.])(\d{1,2})\s*\.\s*([A-Da-d])(?![A-Za-z])', t):
            dap[n].setdefault(int(so), x.upper())
    return dap


def main():
    args = sys.argv[1:]
    chi = None
    if '--chi' in args:
        i = args.index('--chi'); chi = {int(x) for x in args[i + 1].split(',')}; args = args[:i] + args[i + 2:]
    goc, ra = args[0], args[1]
    dap = doc_key(os.path.join(goc, '0. KEY.docx'))
    tong = {}
    for f in sorted(os.listdir(goc), key=lambda f: int(re.search(r'(\d+)', f).group(1)) if re.match(r'ĐỀ SỐ_\d+\.docx$', f) else 0):
        m = re.match(r'ĐỀ SỐ_(\d+)\.docx$', f)
        if not m: continue
        n = int(m.group(1))
        if chi and n not in chi: continue
        ma = f'TC{n:02d}'
        dn = os.path.join(ra, 'nhap', ma)
        khoi = khoi_docx(os.path.join(goc, f), dn, ma)
        for mau in SUA_TAY.get(ma, {}).get('bo_dong', []):
            vt = [i for i, (_, t) in enumerate(khoi) if re.match(mau, t)]
            assert len(vt) == 1, (ma, mau, vt)
            del khoi[vt[0]]
        tieu = next((t for k, t in khoi[:6] if re.match(r'^\s*ĐỀ\s*SỐ\s*\d+', t)), '')
        if tieu and int(re.search(r'\d+', tieu).group(0)) != n:
            print(f'   ⚠ {ma}: tên file số {n} nhưng trong file ghi "{tieu}"')
        out = phan_tich(khoi, dap.get(n, {}), ma, dn, dn, nguon='docx')
        tong[ma] = len(out)
    print(f'== {len(tong)} đề · {sum(tong.values())} câu · đáp án có cho {len(dap)} đề')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
