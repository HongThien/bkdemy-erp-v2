# -*- coding: utf-8 -*-
"""
TRẠM ĐỌC ĐỀ THI TRÊN WEB (LoiGiaiHay) → cùng khuôn đầu ra với doc_bai_tap_gv.py (cau.json + ngu_lieu.json), để đi tiếp
qua bên A / bên B / cổng (cong_ghi_anh.mjs) y như tài liệu GV. Thùy 02/10: "Cái gì có sẵn hiện tại làm được luôn".

    python scripts/anh/doc_de_web.py <trang.html> <MA_DE> <thu_muc_ra> [--anh <thu_muc_anh_da_tai>]

- Đọc khối "Đề bài" (#sub-question-1) + khối "Đáp án" (#sub-question-2) của trang LoiGiaiHay.
- Giữ nguyên chữ của trang (không sửa lỗi gõ — bên A ghi `de_loi`); gạch chân <u> giữ nguyên (đề bài của câu phát âm).
- Đáp án = bảng "N.X" của trang (KHÔNG phải đáp án Sở — bên A giải mù để đối chiếu).
- Ảnh biển báo: trang đặt ảnh NGAY SAU phương án của câu ⇒ gắn ảnh vào câu vừa xong. File ảnh phải tải trước (--anh), tên = tên cuối URL.
- Dạng "tìm lỗi sai" (đề khuôn cũ) không có trong kho ⇒ ĐẾM, không lấy.
"""
import sys, re, json, os, html as H

TEN_LOAI_NL = {'dien_thong_bao': 'thong_bao', 'bien_bao': 'bien_bao'}
CAN_NGU_LIEU = {'dien_thong_bao', 'dien_doan_van', 'doc_hieu', 'dien_cau_doan'}


def dang_cua(lenh):
    t = lenh.lower()
    if 'needs correcting' in t or 'need correcting' in t or 'error' in t:
        return 'loi_sai'
    if 'have been removed' in t or 'removed from the text' in t:
        return 'dien_cau_doan'      # 4 cụm/câu bị bỏ, 4 phương án DÙNG CHUNG cho các chỗ trống (đề HN 2026 câu 37–40)
    if 'pronounc' in t or 'pronunc' in t:   # "pronunciation" KHÔNG chứa "pronounc" (đã dính 02/10)
        return 'phat_am'
    if 'stress' in t:
        return 'trong_am'
    if 'sign' in t or ('notice' in t and 'blank' not in t) or 'message' in t:
        return 'bien_bao'
    if 'topic sentence' in t:
        return 'cau_chu_de'
    if 'arrange' in t or 'arrangement' in t or 'order' in t and 'sentences' in t:
        return 'sap_xep_doan'
    if 'combines' in t or 'combine' in t:
        return 'ket_hop_cau'
    if 'closest in meaning to the original' in t or 'same meaning' in t or 'closest in meaning to the sentence' in t \
            or ('sentence' in t and 'closest in meaning' in t):
        return 'cau_gan_nghia'
    if 'closest in meaning' in t or 'opposite in meaning' in t:
        return 'dong_trai_nghia'
    if 'cue' in t or 'made from' in t:
        return 'viet_cau_goi_y'
    if ('announcement' in t or 'advertisement' in t or 'leaflet' in t or 'notice' in t or 'poster' in t) and 'blank' in t:
        return 'dien_thong_bao'
    if 'blank' in t and ('sentence' in t or 'option' in t) and 'passage' in t and 'word' not in t:
        return 'dien_cau_doan_or_doan'      # quyết theo độ dài phương án (sau khi đọc xong)
    if 'blank' in t:
        return 'dien_doan_van'
    if 'passage' in t or 'text' in t:
        return 'doc_hieu'
    return 'hoan_thanh_cau'


def dang_theo_de(stem):
    """Câu tự mang lệnh riêng trong phần "correct answer to each of the following questions" (đề HN 2026 câu 25–26)."""
    t = stem.lower()
    if re.match(r'^\s*(reorder|rearrange|choose the (best|correct) (arrangement|order))', t) or 'logical order' in t[:120]:
        return 'sap_xep_doan'
    if re.match(r'^\s*choose the (correct|best|most suitable) (sentence|option)s? to complete', t):
        return 'dien_cau_doan'
    return None


def la_lenh(t):
    t2 = t.replace('A,B', 'A, B')
    if 'A, B' not in t2: return False
    # lệnh có thể mở đầu bằng câu dẫn ("Four phrases/sentences have been removed… For each question, mark the letter…")
    return bool(re.match(r'^\s*(mark the letter|read the following|choose|look at|read the|select|indicate)', t2, re.I))         or bool(re.search(r'mark the letter A, B', t2, re.I))


def text_khoi(h):
    """HTML 1 khối → chữ thường, giữ <u>…</u>, <br> → xuống dòng."""
    h = re.sub(r'<\s*br\s*/?>', '\n', h, flags=re.I)
    h = re.sub(r'<\s*u\s*>', '\x01', h, flags=re.I)
    h = re.sub(r'<\s*/\s*u\s*>', '\x02', h, flags=re.I)
    h = re.sub(r'<\s*/\s*p\s*>', '\n', h, flags=re.I)
    h = re.sub(r'<[^>]+>', '', h)
    t = H.unescape(h).replace('\xa0', ' ')
    t = re.sub(r'[ \t]+', ' ', t)
    t = '\n'.join(x.strip() for x in t.split('\n'))
    t = re.sub(r'\x01\s*\x02', '', t)
    return t.strip()


def hien(t):
    return t.replace('\x01', '<u>').replace('\x02', '</u>').strip()


def tron(t):
    return t.replace('\x01', '').replace('\x02', '')


NHAN = re.compile(r'(?:(?<=^)|(?<=[\s\x02]))([A-D])\s*[.)]\s*')


def tach_phuong_an(t):
    """'A. x B. y C. z D. w' (cùng dòng hoặc từng dòng) → [(nhãn, chữ)]. Nhãn phải ở đầu hoặc sau khoảng trắng."""
    ms = list(NHAN.finditer(t))
    if not ms or ms[0].start() > 0 and t[:ms[0].start()].strip():
        return None
    out = []
    for i, m in enumerate(ms):
        e = ms[i + 1].start() if i + 1 < len(ms) else len(t)
        out.append((m.group(1), t[m.end():e].strip()))
    return out


def khoi_cua(de_html):
    """Danh sách khối theo thứ tự: ('bang', text) · ('p', text) · ('anh', url)."""
    out = []
    pos = 0
    for m in re.finditer(r'<table.*?</table>|<p[^>]*>.*?</p>|<img[^>]+>', de_html, flags=re.S | re.I):
        s = m.group(0)
        if s.lower().startswith('<table'):
            out.append(('bang', text_khoi(s)))
            for im in re.findall(r'<img[^>]+src="([^"]+)"', s, flags=re.I):
                out.append(('anh', im))
        elif s.lower().startswith('<img'):
            u = re.search(r'src="([^"]+)"', s)
            if u: out.append(('anh', u.group(1)))
        else:
            imgs = re.findall(r'<img[^>]+src="([^"]+)"', s, flags=re.I)
            t = text_khoi(s)
            if t: out.append(('p', t))
            for im in imgs: out.append(('anh', im))
    return out


def doc(html_path, ma, ra, thu_muc_anh=None):
    h = open(html_path, encoding='utf-8', errors='replace').read()
    a = h.find('id="sub-question-1"'); b = h.find('id="sub-question-2"')
    if a < 0 or b < 0:
        raise SystemExit('Không thấy khối Đề bài / Đáp án (#sub-question-1/2)')
    # hết khối đáp án = "Bài tiếp theo" (KHÔNG dùng "Đánh giá": chữ này nằm ngay trong thuộc tính HTML đầu khối — đã dính 02/10)
    c = h.find('Bài tiếp theo', b)
    de_html, da_html = h[a:b], h[b:c if c > 0 else b + 60000]
    dap = {}
    for n, x in re.findall(r'(?<![\d.])(\d{1,2})\s*\.\s*([A-D])(?![a-z])', re.sub(r'<[^>]+>', ' ', da_html)):
        dap.setdefault(int(n), x)

    cau, ngu_lieu, dem_bo = [], [], {}
    dang, sec = None, 0
    nl_hien_tai = None
    cur = None   # câu đang mở
    pa_chung = []   # phương án DÙNG CHUNG của phần (in TRƯỚC các câu — "Four phrases have been removed…")
    pa_chung_sec = {}   # sec → bộ dùng chung (gán cho câu không có phương án riêng sau khi đọc xong)
    chieu_sec = {}      # sec → 'CLOSEST' / 'OPPOSITE' của phần đồng/trái nghĩa

    def mo_nl(loai, chu, anh=None):
        nonlocal nl_hien_tai
        ref = f'{ma}-NL{len(ngu_lieu) + 1:02d}'
        ngu_lieu.append({'ref': ref, 'loai': loai, 'noi_dung': chu, 'anh': anh, 'anh_file': None, 'ex': f'S{sec}'})
        nl_hien_tai = ref
        return ref

    def chot():
        nonlocal cur
        if cur is None: return
        cau.append(cur); cur = None

    for loai, t in khoi_cua(de_html):
        if loai == 'anh':
            if 'loigiaihay' not in t and 'tuyensinh247' not in t: continue
            if dang == 'bien_bao':
                # ảnh đứng SAU phương án của câu ⇒ thuộc câu vừa đọc
                tgt = cur if cur is not None else (cau[-1] if cau and cau[-1]['_sec'] == sec else None)
                if tgt is not None and tgt.get('_anh') is None:
                    tgt['_anh'] = t
            continue
        if loai == 'p' and re.match(r'^\s*Đề bài\s*$', t):
            continue
        # phần TỰ LUẬN của đề khuôn cũ ("II. WRITING", "Finish the second sentence…", "Rewrite…") ⇒ bỏ cả phần, đếm số câu
        if loai == 'p' and cur is None or loai == 'p' and cur is not None and cur['_pa']:
            if re.match(r'^\s*(I{1,3}|IV|V)\s*\.\s*[A-Z]', tron(t)) or \
                    re.match(r'^\s*(finish|rewrite|complete the second|write|use the (word|given))', tron(t), re.I):
                chot(); sec += 1; dang = 'tu_luan'; nl_hien_tai = None; pa_chung = []; pa_chung_sec[sec] = pa_chung
                continue
        # bộ phương án DÙNG CHUNG đặt trong BẢNG (đề TK: "A. teenagers suffering…\n\nB. and changes…")
        if loai == 'bang' and dang == 'dien_cau_doan' and cur is None and not pa_chung:
            pb = tach_phuong_an(t)
            if pb and [k for k, _ in pb] == ['A', 'B', 'C', 'D']:
                pa_chung += pb
                continue
        if loai == 'p' and la_lenh(tron(t)) and not re.match(r'^\s*Question', t):
            chot(); sec += 1; dang = dang_cua(tron(t)); nl_hien_tai = None; pa_chung = []; pa_chung_sec[sec] = pa_chung
            chieu_sec[sec] = ('OPPOSITE' if 'OPPOSITE' in tron(t).upper() else 'CLOSEST') if dang == 'dong_trai_nghia' else None
            continue
        if dang is None:
            continue
        # nhiều câu trong 1 khối: "Question 37. ______ Question 38. ______ …" ⇒ tách từng câu, phương án lấy bộ dùng chung
        nhieu = re.findall(r'Question\s+(\d+)\s*[.:]?\s*([^Q]*?)(?=Question\s+\d+|$)', tron(t))
        if loai == 'p' and len(nhieu) >= 2 and pa_chung:
            chot()
            for so, phan in nhieu:
                cau.append({'_n': int(so), '_sec': sec, '_dang': dang, '_stem': [], '_pa': list(pa_chung), '_anh': None, '_nl': nl_hien_tai})
            continue
        m = re.match(r'^\s*Question\s+(\d+)\s*[.:]?\s*', tron(t))
        if not m:
            # vài trang đánh số trần "29. What does…" — chỉ nhận khi ĐÚNG số câu kế tiếp (tránh bắt nhầm danh sách trong bài đọc)
            m2 = re.match(r'^\s*(\d{1,2})\s*[.:]\s+\S', tron(t))
            truoc = max([x['_n'] for x in cau] + ([cur['_n']] if cur else []) + [0])
            if m2 and int(m2.group(1)) == truoc + 1:
                m = re.match(r'^\s*(\d{1,2})\s*[.:]\s*', tron(t))
        if loai == 'p' and m:
            chot()
            n = int(m.group(1))
            # cắt "Question N." trên chuỗi CÓ dấu gạch chân (đếm theo ký tự thường)
            k, dem = 0, 0
            while dem < m.end() and k < len(t):
                if t[k] not in '\x01\x02': dem += 1
                k += 1
            rest = t[k:]
            cur = {'_n': n, '_sec': sec, '_dang': dang, '_stem': [], '_pa': [], '_anh': None, '_nl': nl_hien_tai}
            pa = tach_phuong_an(rest) if rest else None
            # "Question 33. A. Unless B. If…" ⇒ không đề riêng; còn "Question 3. đề… " ⇒ đề
            if pa and len(pa) >= 2:
                cur['_pa'] += pa
            elif rest:
                # đề có thể kèm phương án cuối dòng ("… ______. A. x B. y …")
                mm = re.search(r'(?:^|\s)A\s*[.)]\s', rest)
                if mm and tach_phuong_an(rest[mm.start():].strip()):
                    cur['_stem'].append(rest[:mm.start()].strip()); cur['_pa'] += tach_phuong_an(rest[mm.start():].strip())
                else:
                    cur['_stem'].append(rest)
            continue
        # phương án DÙNG CHUNG in trước các câu ("A. help them learn…", 1 dòng 1 phương án, chưa có câu nào mở), đúng thứ tự A→D
        pa1 = tach_phuong_an(t) if loai == 'p' and cur is None else None
        if pa1 and len(pa1) == 1 and len(pa_chung) < 4 and pa1[0][0] == 'ABCD'[len(pa_chung)]:
            pa_chung += pa1
            continue
        if loai == 'p' and cur is not None:
            pa = tach_phuong_an(t)
            if pa:
                cur['_pa'] += pa
            elif not cur['_pa']:
                cur['_stem'].append(t)     # đề nhiều dòng (hội thoại, câu a–e của sắp xếp, đoạn của câu chủ đề)
            else:
                # chữ SAU phương án ⇒ hết câu; là đoạn văn của phần kế (đề web hay để bài đọc giữa chừng)
                chot()
                if dang in CAN_NGU_LIEU or dang == 'dien_cau_doan_or_doan':
                    if nl_hien_tai is None or any(x['_nl'] == nl_hien_tai for x in cau):
                        mo_nl(TEN_LOAI_NL.get(dang, 'doan_van'), hien(t))
                    else:
                        ngu_lieu[-1]['noi_dung'] += '\n\n' + hien(t)
            continue
        # khối không phải câu: bài đọc / thông báo (bảng hoặc đoạn) trước câu đầu tiên của phần
        if dang in CAN_NGU_LIEU or dang == 'dien_cau_doan_or_doan':
            if nl_hien_tai is None or any(x['_nl'] == nl_hien_tai for x in cau):
                mo_nl(TEN_LOAI_NL.get(dang, 'doan_van'), hien(t))
            else:
                ngu_lieu[-1]['noi_dung'] += '\n\n' + hien(t)
        else:
            dem_bo[dang] = dem_bo.get(dang, 0) + 0   # chữ lạc ngoài câu ở phần không cần ngữ liệu: bỏ qua
    chot()

    # quyết dạng "điền vào đoạn": phương án là câu dài ⇒ điền câu; ngắn ⇒ điền từ
    for x in cau:
        if x['_dang'] == 'dien_cau_doan_or_doan':
            dai = sum(len(tron(p)) for _, p in x['_pa']) / max(1, len(x['_pa']))
            x['_dang'] = 'dien_cau_doan' if dai > 25 else 'dien_doan_van'
    for nl in ngu_lieu:
        if nl['loai'] == 'doan_van' and any(x['_nl'] == nl['ref'] and x['_dang'] == 'dien_thong_bao' for x in cau):
            nl['loai'] = 'thong_bao'

    for x in cau:
        if not x['_pa'] and pa_chung_sec.get(x['_sec']):
            x['_pa'] = list(pa_chung_sec[x['_sec']])   # "Question 37. ______" từng dòng riêng, phương án dùng chung in trước
    for x in cau:
        d2 = dang_theo_de(tron(' '.join(x['_stem'])))
        if d2: x['_dang'], x['_tu_du'] = d2, True

    out = []
    bo = {}
    da_gap = set()
    for x in cau:
        # số câu trùng trong đề (TK14 có 2 "Question 26") ⇒ câu sau gắn hậu tố + cờ, KHÔNG lấy đáp án theo số (thà bỏ trống)
        x['_trung'] = x['_n'] in da_gap
        da_gap.add(x['_n'])
    for x in cau:
        if x['_dang'] in ('loi_sai', 'tu_luan'):
            bo[x['_dang']] = bo.get(x['_dang'], 0) + 1; continue
        n = x['_n']
        nhan = [k for k, _ in x['_pa']]
        lc = [hien(p) for _, p in x['_pa']]
        loi = []
        if nhan != ['A', 'B', 'C', 'D']: loi.append('khong_du_4_phuong_an:' + ''.join(nhan))
        if len(set(tron(p).strip().lower() for p in lc)) < len(lc): loi.append('phuong_an_trung')
        if any(not tron(p).strip() for p in lc): loi.append('phuong_an_rong')
        if x['_trung']: loi.append('so_cau_trung_trong_de')
        elif n not in dap: loi.append('khong_co_dap_an')
        stem = hien('\n'.join(s for s in x['_stem'] if tron(s).strip()))
        if x['_dang'] == 'dong_trai_nghia' and chieu_sec.get(x['_sec']):
            # lệnh chiều nghĩa nằm ở ĐẦU phần ⇒ chép vào đề từng câu (không thì câu mất nghĩa — cùng cách trạm đọc file Word)
            stem = f"Choose the word(s) {chieu_sec[x['_sec']]} in meaning to the underlined word(s).\n" + stem
        nl_ref, tt = x['_nl'], None
        if x['_dang'] == 'bien_bao':
            if not stem: stem = 'What does the sign or notice say?'
            ref_nl = f'{ma}-NL{len(ngu_lieu) + 1:02d}'
            ten = (x['_anh'] or '').rsplit('/', 1)[-1] or None
            ngu_lieu.append({'ref': ref_nl, 'loai': 'bien_bao', 'noi_dung': '', 'anh': x['_anh'], 'ex': f"S{x['_sec']}",
                             'anh_file': ten if (ten and thu_muc_anh and os.path.exists(os.path.join(thu_muc_anh, ten))) else None})
            nl_ref, tt = ref_nl, 1
            if not x['_anh']: loi.append('bien_bao_khong_thay_anh')
            elif not ngu_lieu[-1]['anh_file']: loi.append('bien_bao_chua_tai_anh')
        elif x.get('_tu_du'):
            nl_ref = None                      # đề câu đã chứa sẵn đoạn văn (câu 25–26 HN 2026)
        elif x['_dang'] in CAN_NGU_LIEU:
            if nl_ref is None: loi.append('thieu_ngu_lieu')
            tt = n
            if not stem: stem = f'({n}) ______'
        else:
            nl_ref = None
        if x['_dang'] in ('phat_am', 'trong_am') and not stem:
            stem = {'phat_am': 'Choose the word whose underlined part is pronounced differently from the other three.',
                    'trong_am': 'Choose the word that differs from the other three in the position of the main stress.'}[x['_dang']]
        if not stem: loi.append('de_rong')
        out.append({'ref': f'{ma}-C{n:03d}' + ('B' if x['_trung'] else ''), 'unit_sgk': None, 'ex': f"S{x['_sec']}", 'dang_de': x['_dang'],
                    'noi_dung': stem, 'lua_chon': lc, 'dap_an': None if x['_trung'] else dap.get(n), 'ngu_lieu': nl_ref,
                    'thu_tu_trong_ngu_lieu': tt if nl_ref else None, 'loi_cau_truc': loi, 'ghi': None})

    # kiểm chéo cloze: chỗ trống "(n)" trong ngữ liệu phải khớp tập câu gắn với nó
    for nl in ngu_lieu:
        if nl['loai'] == 'bien_bao': continue
        so = set(int(k) for k in re.findall(r'\((\d{1,2})\)', tron(nl['noi_dung'])))
        cs = [x for x in out if x['ngu_lieu'] == nl['ref'] and x['dang_de'] in ('dien_thong_bao', 'dien_doan_van', 'dien_cau_doan')]
        if cs and so != set(int(x['ref'][-3:]) for x in cs):
            for x in cs: x['loi_cau_truc'].append('cloze_lech_cho_trong')

    os.makedirs(ra, exist_ok=True)
    json.dump(out, open(os.path.join(ra, f'{ma}.cau.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(ngu_lieu, open(os.path.join(ra, f'{ma}.ngu_lieu.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    from collections import Counter
    print(f'{ma}: {len(out)} câu · dạng {dict(Counter(x["dang_de"] for x in out))} · bỏ {bo} · đáp án {len(dap)} · '
          f'ngữ liệu {len(ngu_lieu)} · có cờ {sum(1 for x in out if x["loi_cau_truc"])}')
    for x in out:
        if x['loi_cau_truc']: print('   cờ', x['ref'], x['loi_cau_truc'])
    return out


if __name__ == '__main__':
    args = sys.argv[1:]
    anh = None
    if '--anh' in args:
        i = args.index('--anh'); anh = args[i + 1]; args = args[:i] + args[i + 2:]
    doc(args[0], args[1], args[2], anh)
