"""
TRẠM ĐỌC — bài tập Tiếng Anh dạng "BTBT Form 2025" (bản GV, .docx) → câu trắc nghiệm có cấu trúc (JSON).

  python scripts/anh/doc_bai_tap_gv.py <file_GV.docx> <unit_sgk ví dụ L9U1> <thu_muc_ra>

Python 3, CHỈ thư viện chuẩn (zipfile + ElementTree). Đọc THẲNG .docx, không qua PDF: đáp án nằm trong ĐỊNH DẠNG
(phương án được tô màu), đề phát âm nằm trong GẠCH CHÂN — chuyển PDF/OCR là mất (nghien-cuu-mon-anh.md §3.4).

Ra 2 file: <unit>.cau.json (câu) + <unit>.ngu_lieu.json (đoạn văn/thông báo/biển báo dùng chung) + ảnh biển báo.
Trạm này CHỈ đọc + tự kiểm cấu trúc (4 phương án, khác nhau, đúng 1 phương án tô màu). KHÔNG gán điểm kiến thức,
KHÔNG phán đáp án — việc đó ở trạm sau, do bên kiểm độc lập làm (spec-luong-kho.md: người làm ≠ người kiểm).
Chỉ lấy câu TRẮC NGHIỆM. Phần NGHE (để sau, CEO 30/09) và bài tự luận (điền, chia động từ, viết lại…) được ĐẾM, không lấy.
"""
import sys, re, json, zipfile, pathlib
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
U0, U1, H0, H1 = '\x01', '\x02', '\x03', '\x04'          # mở/đóng gạch chân, mở/đóng tô màu
TO_MAU = {'yellow', 'cyan', 'green', 'lightGray', 'magenta'}


def chu_cua_run(r):
    # w:br / w:cr = xuống dòng MỀM trong cùng đoạn — GV hay dồn nhiều dòng phương án vào 1 đoạn bằng Shift+Enter
    t = ''.join((n.text or '') if n.tag == W + 't' else ('\t' if n.tag == W + 'tab' else '\n')
                for n in list(r) if n.tag in (W + 't', W + 'tab', W + 'br', W + 'cr'))
    if not t:
        return ''
    rpr = r.find(W + 'rPr')
    gach = to = False
    if rpr is not None:
        h = rpr.find(W + 'highlight')
        to = h is not None and h.get(W + 'val') in TO_MAU
        sh = rpr.find(W + 'shd')
        if sh is not None and (sh.get(W + 'fill') or '').upper() in ('FFFF00', '00FFFF'):
            to = True
        u = rpr.find(W + 'u')
        gach = u is not None and u.get(W + 'val') not in (None, 'none')
    if gach and t.strip() and not re.fullmatch(r'_+', t.strip()):
        t = U0 + t + U1
    if to and t.strip():
        t = H0 + t + H1
    return t


def chu_cua_doan(p):
    s = ''.join(chu_cua_run(r) for r in p.iter(W + 'r'))
    for a, b in ((U1 + U0, ''), (H1 + H0, '')):
        s = s.replace(a, b)
    return s


def anh_cua(el, rels):
    ids = [b.get(R + 'embed') for b in el.iter(A + 'blip') if b.get(R + 'embed')]
    return [rels[i] for i in ids if i in rels]


def khoi(body, rels):
    """Duyệt thân tài liệu theo thứ tự → (loại, chữ, ảnh). Bảng: mỗi ô 1 khối, ô gom các đoạn bằng xuống dòng."""
    for c in body:
        if c.tag == W + 'p':
            # tách xuống dòng mềm thành các "đoạn" riêng (ảnh đi theo dòng đầu)
            dong = chu_cua_doan(c).split('\n')
            anh = anh_cua(c, rels)
            for i, d in enumerate(dong):
                yield ('p', d, anh if i == 0 else [])
        elif c.tag == W + 'tbl':
            for tr in c.iter(W + 'tr'):
                cells = []
                for tc in tr.findall(W + 'tc'):
                    cells.append(('\n'.join(chu_cua_doan(p) for p in tc.iter(W + 'p')), anh_cua(tc, rels)))
                yield ('tr', cells, [])
        elif c.tag == W + 'sdt':
            sc = c.find(W + 'sdtContent')
            if sc is not None:
                yield from khoi(sc, rels)


def tron(s):
    """Chữ thô (bỏ dấu định dạng)."""
    return re.sub('[\x01-\x04]', '', s)


def hien(s):
    """Chữ hiển thị: gạch chân → <u>…</u>, bỏ dấu tô màu, gọn khoảng trắng, chuẩn ô trống."""
    s = s.replace(U0, '<u>').replace(U1, '</u>').replace(H0, '').replace(H1, '')
    s = re.sub(r'\t+', ' ', s)
    s = re.sub(r'_{3,}', '______', s)
    s = re.sub(r'[  ]{2,}', ' ', s)
    return s.strip()


PHAN = ['LISTENING', 'PHONETIC', 'VOCABULARY & GRAMMAR', 'SPEAKING', 'READING', 'WRITING']


def la_dau_phan(s):
    comp = re.sub(r'[\s|]', '', tron(s))
    for p in PHAN:
        k = p.replace(' ', '')
        if comp and comp.replace(k, '') == '':
            return p
    return None


def dang_de_cua(phan, tieu_de):
    t = tieu_de.lower()
    if phan == 'LISTENING':
        return ('nghe', 'bo_qua_nghe')
    if phan == 'PHONETIC':
        return ('phat_am', 'mcq') if 'underlined part' in t else ('trong_am', 'mcq')
    if phan in ('VOCABULARY & GRAMMAR', 'SPEAKING'):
        if 'closest in meaning' in t or 'opposite in meaning' in t:
            return ('dong_trai_nghia', 'mcq')
        if 'mark the letter' in t and ('correct answer' in t or 'best completes' in t):
            return ('hoan_thanh_cau', 'mcq')
        return ('tu_luan', 'bo_qua_tu_luan')
    if phan == 'READING':
        if 'sign' in t or 'notice' in t and 'look at' in t:
            return ('bien_bao', 'bien_bao')
        if 'advertisement' in t or 'announcement' in t:
            return ('dien_thong_bao', 'cloze')
        if 'removed' in t:
            return ('dien_cau_doan', 'chen_cau')
        if 'best fits each of the numbered blanks' in t or 'correct word' in t:
            return ('dien_doan_van', 'cloze')
        if 'correct answer to each of the questions' in t or 'answer to each' in t:
            return ('doc_hieu', 'doc_hieu')
    if phan == 'WRITING':
        if 'arrangement' in t:
            return ('sap_xep_doan', 'mcq')
        if 'combine' in t:
            return ('ket_hop_cau', 'mcq')
        if ('closest in meaning' in t or 'same meaning' in t or 'best transforms' in t or 'similar meaning to the first one' in t
                or 'best second sentence' in t) and ('choose' in t or 'circle' in t or 'mark' in t):
            return ('cau_gan_nghia', 'mcq')
        return ('tu_luan', 'bo_qua_tu_luan')
    return ('khac', 'bo_qua_khac')


# Một dòng phương án: "A. x | B. y …" (có thể chỉ chứa A,B hoặc C,D). Tách theo nhãn A./B./C./D. ở đầu cụm.
NHAN = re.compile(r'(?:(?<=^)|(?<=[\s|/]))([A-D])\s*[.)]\s*', re.M)


def tach_phuong_an(s):
    """Trả [(nhãn, chữ có dấu định dạng)] nếu dòng là dòng phương án, ngược lại []."""
    t = tron(s).strip(' |\t')
    if not re.match(r'^(\d+\.\s*)?[A-D](\s*[.)]|\s)', t):
        return []
    s2 = s
    out = []
    # GV gõ nhãn đủ kiểu — nhận 3 dạng, rồi lọc bằng thứ tự A→B→C→D liên tiếp:
    #   ① đầu dòng / sau khoảng trắng / định dạng: "A. x", "C.finished", "C.. Windsor"
    #   ② dính sau dấu chấm của phương án trước: "you are.C. asks" (bắt buộc khoảng trắng SAU nhãn — tránh chữ viết tắt)
    #   ③ THIẾU dấu chấm nhưng đứng sau TAB: "\tB has tried", "\tD stan…" (chỉ sau tab — tránh mạo từ "A" trong câu)
    pat = (r'(?:(?:^|(?<=[\s|/\x03\x04]))([A-D])[\x01-\x04]*\s*[.)]+)'
           r'|(?:(?<=\.)([A-D])[\x01-\x04]*\s*[.)](?=[\s\x01-\x04]|$))'
           r'|(?:(?<=\t)([A-D])(?=\s))')
    pos = [(m.start(), m.group(1) or m.group(2) or m.group(3)) for m in re.finditer(pat, s2)]
    khong_cham = {m.start() for m in re.finditer(pat, s2) if m.group(3)}
    # chỉ nhận dãy nhãn tăng dần liên tiếp (A,B,C,D hoặc C,D…)
    sach, truoc = [], None
    for i, (p, n) in enumerate(pos):
        if truoc is None or ord(n) == ord(truoc) + 1:
            sach.append((p, n)); truoc = n
    # 1 nhãn đơn lẻ KHÔNG có dấu chấm ("\tA lot of…") là chữ thường, không phải phương án
    if len(sach) == 1 and sach[0][0] in khong_cham:
        return []
    # dấu mở tô màu/gạch chân đứng NGAY TRƯỚC nhãn thuộc về phương án của nhãn đó ⇒ lùi điểm cắt qua chúng
    lui = []
    for p, n in sach:
        while p > 0 and s2[p - 1] in (H0, U0):
            p -= 1
        lui.append((p, n))
    sach = lui
    for i, (p, n) in enumerate(sach):
        end = sach[i + 1][0] if i + 1 < len(sach) else len(s2)
        seg = s2[p:end]
        seg = re.sub(r'^[\s|/]*', '', seg)
        out.append((n, seg))
    return out


def chu_phuong_an(seg):
    """'\x03B. \x01a\x02ttraction\x04' → (chữ hiển thị không nhãn, có_tô_màu)"""
    to = H0 in seg
    t = re.sub(r'^[\x01-\x04\s.]*[A-D][\x01-\x04]*(\s*[.)]+|\s)\s*', '', seg)
    return hien(t).strip(' |/'), to


def doc(file_docx, unit, ra):
    z = zipfile.ZipFile(file_docx)
    rels = {}
    rx = ET.fromstring(z.read('word/_rels/document.xml.rels'))
    for r in rx:
        rels[r.get('Id')] = 'word/' + r.get('Target').lstrip('/').replace('word/', '')
    body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
    ra = pathlib.Path(ra); ra.mkdir(parents=True, exist_ok=True)

    phan, ex, dang, che_do = None, None, None, None
    loi_dan = None
    cau, ngu_lieu, bo_qua, dem_ex = [], [], {}, {}
    buf = []               # các dòng chờ (đề bài / đoạn văn) trước phương án
    nl_hien_tai = None     # ngữ liệu đang mở (cloze/đọc hiểu/chèn câu)
    stt_trong_nl = 0
    chen_cau_ds = []       # câu điền-câu-vào-đoạn đang chờ danh sách A–D

    def mo_ngu_lieu(loai, chu, anh=None):
        nonlocal nl_hien_tai, stt_trong_nl
        ref = f'{unit}-NL{len(ngu_lieu) + 1:02d}'
        ngu_lieu.append({'ref': ref, 'loai': loai, 'noi_dung': chu, 'anh': anh, 'ex': ex})
        nl_hien_tai, stt_trong_nl = ref, 0
        return ref

    def them(noi_dung, pa, nl=None, stt=None, ghi=None, dap_an_ep=None):
        lc = [chu_phuong_an(seg) for _, seg in pa]
        nhan = [n for n, _ in pa]
        loi = []
        if nhan != ['A', 'B', 'C', 'D']:
            loi.append('khong_du_4_phuong_an:' + ''.join(nhan))
        to = [i for i, (_, t) in enumerate(lc) if t]
        if dap_an_ep:
            da = dap_an_ep
        elif len(to) == 1:
            da = 'ABCD'[to[0]]
        else:
            da = None
            loi.append(f'to_mau_{len(to)}_phuong_an')
        texts = [t for t, _ in lc]
        if len(set(x.lower() for x in texts)) < len(texts):
            loi.append('phuong_an_trung')
        if any(not x for x in texts):
            loi.append('phuong_an_rong')
        cau.append({'unit_sgk': unit, 'ex': ex, 'dang_de': dang, 'noi_dung': noi_dung, 'lua_chon': texts,
                    'dap_an': da, 'ngu_lieu': nl, 'thu_tu_trong_ngu_lieu': stt, 'loi_cau_truc': loi,
                    'ghi': ghi})

    def xu_ly_buf_mcq():
        """Ở chế độ mcq: buf = [đề..., phương án...]. Gom theo cặp đề → phương án."""
        pass

    pending_stem, pending_pa = [], []

    def chot_mcq():
        nonlocal pending_stem, pending_pa
        if pending_pa:
            stem = '\n'.join(hien(x) for x in pending_stem if tron(x).strip())
            stem = re.sub(r'^\s*\d+\s*[.)]\s*', '', stem)
            if dang == 'sap_xep_doan' and not stem:
                stem = ''
            if dang == 'dong_trai_nghia' and loi_dan:
                # lời dẫn nằm ở TIÊU ĐỀ bài (đồng nghĩa hay trái nghĩa) — chép vào từng câu, không thì câu mất nghĩa
                stem = loi_dan + '\n' + stem
            them(stem, pending_pa)
        pending_stem, pending_pa = [], []

    for loai, chu, anh in khoi(body, rels):
        # ── đầu phần / đầu bài ──
        if loai == 'p':
            p = la_dau_phan(chu)
            if p:
                chot_mcq(); phan, ex = p, None; continue
            m = re.match(r'^[\s|]*Exercise\s*(\d+)\s*[:.]?\s*(.*)', tron(chu))
            if m and phan:
                chot_mcq()
                ex = f'{phan}#{m.group(1)}'
                dang, che_do = dang_de_cua(phan, m.group(2))
                tl = m.group(2).lower()
                loi_dan = ('Choose the word(s) CLOSEST in meaning to the underlined word(s).' if 'closest' in tl else
                           'Choose the word(s) OPPOSITE in meaning to the underlined word(s).' if 'opposite' in tl else None)
                dem_ex[ex] = {'tieu_de': m.group(2)[:120], 'dang_de': dang, 'che_do': che_do}
                nl_hien_tai, chen_cau_ds = None, []
                continue
        if not ex or che_do is None:
            continue
        if che_do.startswith('bo_qua'):
            if loai == 'p' and tach_phuong_an(chu):
                bo_qua[che_do] = bo_qua.get(che_do, 0) + 1
            continue

        # ── biển báo: mỗi hàng bảng = 1 câu (ô 1 đề + phương án, ô 2 ảnh) ──
        if che_do == 'bien_bao':
            if loai != 'tr':
                continue
            # số câu / phương án / ảnh có thể nằm ở BẤT KỲ ô nào (mỗi unit xếp bảng một kiểu) ⇒ gom mọi ô
            t1 = '\n'.join(x for x, _ in chu)
            anh_bb = sum((a for _, a in chu), [])
            dong = [x for x in re.split(r'\n|\s/\s', t1) if tron(x).strip() and not re.fullmatch(r'\s*\d+\s*[.)]?\s*', tron(x))]
            stem = [d for d in dong if not tach_phuong_an(d)]
            pa = []
            for d in dong:
                pa += tach_phuong_an(d)
            if not pa:
                continue
            ref = mo_ngu_lieu('bien_bao', '', anh_bb[0] if anh_bb else None)
            noi = re.sub(r'^\s*\d+\s*[.)]\s*', '', hien(' '.join(stem)))
            if not noi:   # file chỉ ghi số câu, không có đề ⇒ đề mặc định đúng như lệnh của dạng biển báo trong đề HN
                noi = 'What does the sign or notice say?'
            them(noi, pa, ref, 1, ghi=None if anh_bb else 'bien_bao_khong_thay_anh')
            continue

        # ── thông báo / đoạn văn điền từ: khối chữ dài (đoạn hoặc ô bảng) mở ngữ liệu; mỗi dòng phương án = 1 chỗ trống ──
        if che_do == 'cloze':
            if loai == 'tr':
                t = '\n'.join(x for x, _ in chu)
                if len(tron(t)) > 150:
                    mo_ngu_lieu('thong_bao' if dang == 'dien_thong_bao' else 'doan_van', hien(t))
                continue
            pa = tach_phuong_an(chu)
            if pa and nl_hien_tai:
                # Dòng phương án có ghi số chỗ trống ("4. A. at B. on…") ⇒ dùng ĐÚNG số đó (khoá tự nhiên). Chỉ khi không ghi
                # số mới đếm — đếm theo vị trí lệch âm thầm ngay khi file thiếu/thừa 1 dòng (CLAUDE.md §2 "danh tính bám khoá").
                m_so = re.match(r'^[\s|]*(\d+)\s*[.)]', tron(chu))
                stt_trong_nl = int(m_so.group(1)) if m_so else stt_trong_nl + 1
                them(f'({stt_trong_nl}) ______', pa, nl_hien_tai, stt_trong_nl)
                continue
            if nl_hien_tai and stt_trong_nl == 0 and tron(chu).strip():
                # bài đã mở, chưa tới phương án ⇒ MỌI dòng thuộc bài, kể cả dòng ngắn (bài gạch đầu dòng — U10-NL10 mất
                # chỗ trống (2)(4)(5) vì dòng < 150 ký tự bị bỏ, 02/10)
                ngu_lieu[-1]['noi_dung'] += '\n\n' + hien(chu)
            elif len(tron(chu)) > 150:
                mo_ngu_lieu('thong_bao' if dang == 'dien_thong_bao' else 'doan_van', hien(chu))
            continue

        # ── đọc hiểu: đoạn văn → (đề + phương án)* ──
        if che_do == 'doc_hieu':
            def mo_bai_moi(t):
                # Bài đọc THỨ HAI trở đi trong cùng bài tập: các dòng ngắn ngay trước đoạn dài (tiêu đề, câu mở bài,
                # "Here are some ways to do that:") bị luật "dòng ngắn sau khi đã có câu hỏi = đề" giữ làm ĐỀ CHỜ — chưa có
                # phương án mà đã gặp đoạn dài ⇒ chúng là ĐẦU bài đọc mới. Trước đây chot_mcq() vứt im lặng
                # (U1-NL15 mất tiêu đề "A trip to Bat Trang", U9-NL13 mất 4 dòng mở bài — bên A báo không làm được C130, 02/10).
                nonlocal pending_stem
                dau = []
                if pending_stem and not pending_pa and stt_trong_nl > 0 and \
                        not any(re.match(r'^[\s|]*\d+\s*[.)]', tron(x)) for x in pending_stem):
                    dau, pending_stem = [x for x in pending_stem if tron(x).strip()], []
                chot_mcq()
                tieu = None
                if dau and len(tron(dau[0]).strip()) < 60 and not re.search(r'[.?!:]\s*$', tron(dau[0])) \
                        and not re.match(r'^\s*[*\-•]', tron(dau[0])):
                    tieu, dau = hien(dau[0]).strip(), dau[1:]
                mo_ngu_lieu('doan_van', '\n\n'.join([hien(x) for x in dau] + [t]))
                if tieu:
                    ngu_lieu[-1]['tieu_de'] = tieu

            # đoạn văn nằm trong BẢNG (GV hay đóng khung bài đọc) — trước đây bị bỏ qua ⇒ bài đọc mất phần đầu (U5-NL10 02/10)
            if loai == 'tr':
                t = '\n\n'.join(x for x, _ in chu if tron(x).strip())
                if len(tron(t)) > 150:
                    if nl_hien_tai and stt_trong_nl == 0:
                        chot_mcq()
                        ngu_lieu[-1]['noi_dung'] = (ngu_lieu[-1]['noi_dung'] + '\n\n' + hien(t)).strip()
                    else:
                        mo_bai_moi(hien(t))
                continue
            pa = tach_phuong_an(chu) if loai == 'p' else []
            # Chưa mở bài đọc nào ⇒ đoạn dài là BÀI ĐỌC, kể cả khi có "?" hay ":" (câu mở bài hay hỏi tu từ) —
            # để nhầm thành đề thì các đoạn đầu bị gom vào "đề chờ" rồi rơi mất (U5-NL10 mất 4 đoạn đầu, 02/10).
            if loai == 'p' and not pa and nl_hien_tai is None and not pending_pa and len(tron(chu)) > 100:
                mo_ngu_lieu('doan_van', '\n\n'.join([hien(x) for x in pending_stem] + [hien(chu)]))
                pending_stem = []
                continue
            if loai == 'p' and len(tron(chu)) > 220 and not pa:
                # "đề chờ" chưa có phương án mà gặp đoạn dài ⇒ chúng là phần TRÊN của bài đọc, không phải đề — giữ lại, không vứt
                if pending_stem and not pending_pa and nl_hien_tai and stt_trong_nl == 0:
                    ngu_lieu[-1]['noi_dung'] += '\n\n' + '\n\n'.join(hien(x) for x in pending_stem)
                    pending_stem = []
                if nl_hien_tai and stt_trong_nl == 0:
                    chot_mcq()
                    ngu_lieu[-1]['noi_dung'] += '\n\n' + hien(chu)
                else:
                    mo_bai_moi(hien(chu))
                continue
            if loai != 'p' or not tron(chu).strip():
                continue
            if pa:
                pending_pa += pa
                if pending_pa and pending_pa[-1][0] == 'D':
                    # Đề chờ có dòng ĐÁNH SỐ câu ("1. What is the best title…") mà trước nó còn dòng khác, bài chưa có câu nào
                    # ⇒ các dòng trước là ĐUÔI bài đọc (câu kết có "?" — "So why wait? Start planning…" — kéo theo dòng nguồn
                    # "(Adapted from…)") bị giữ làm đề chờ rồi dính vào đề câu 1 (U8-C124, bên A báo 02/10).
                    so_cau = [i for i, x in enumerate(pending_stem) if re.match(r'^[\s|]*\d+\s*[.)]', tron(x))]
                    if so_cau and so_cau[-1] > 0 and nl_hien_tai and stt_trong_nl == 0:
                        ngu_lieu[-1]['noi_dung'] += '\n\n' + '\n\n'.join(hien(x) for x in pending_stem[:so_cau[-1]] if tron(x).strip())
                        pending_stem = pending_stem[so_cau[-1]:]
                    stt_trong_nl += 1
                    stem = re.sub(r'^\s*\d+\s*[.)]\s*', '', '\n'.join(hien(x) for x in pending_stem))
                    them(stem, pending_pa, nl_hien_tai, stt_trong_nl)
                    pending_stem, pending_pa = [], []
            else:
                if pending_pa:   # phương án lẻ không đủ D → câu trước lỗi, chốt
                    chot_mcq()
                gach_dau_dong = lambda x: bool(re.match(r'^[\s|]*[●•▪◦*–\-]\s*', tron(x)))
                if gach_dau_dong(chu) and nl_hien_tai and stt_trong_nl == 0:
                    # Gạch đầu dòng TRONG bài đọc ("● Will I enjoy doing the job every day?") có "?" nhưng KHÔNG phải đề;
                    # "đề chờ" ngay trước nó ("Make a decision: … ask yourself the following questions:") cũng là bài đọc.
                    # Trước đây dòng dẫn + 4 gạch đầu dòng bị luật "đề + 4 phương án không nhãn" bắt ⇒ đẻ câu GIẢ
                    # U12-C125 và bài đọc bị cắt đôi (bên A báo 02/10).
                    for x in pending_stem + [chu]:
                        ngu_lieu[-1]['noi_dung'] += '\n\n' + hien(x)
                    pending_stem = []
                    continue
                la_cau_hoi = bool(re.search(r'\?|_{2,}|:\s*$|\.{3}\s*$', tron(chu)))
                # phương án KHÔNG nhãn (Word tự đánh A–D): đề + đúng 4 dòng ngắn rồi tới câu hỏi mới
                if la_cau_hoi and len(pending_stem) == 5 and not any(gach_dau_dong(x) for x in pending_stem):
                    stt_trong_nl += 1
                    them(re.sub(r'^\s*\d+\s*[.)]\s*', '', hien(pending_stem[0])),
                         [('ABCD'[i], 'ABCD'[i] + '. ' + x) for i, x in enumerate(pending_stem[1:])], nl_hien_tai, stt_trong_nl,
                         ghi='phuong_an_khong_nhan')
                    pending_stem = []
                if len(tron(chu)) < 60 and not re.search(r'[?_]|\.{3}', tron(chu)) and nl_hien_tai is None:
                    mo_ngu_lieu('doan_van', hien(chu))   # tiêu đề bài đọc
                    ngu_lieu[-1]['tieu_de'] = hien(chu); ngu_lieu[-1]['noi_dung'] = ''
                    continue
                if nl_hien_tai and stt_trong_nl == 0 and ngu_lieu[-1]['noi_dung'] == '':
                    ngu_lieu[-1]['noi_dung'] = hien(chu); continue
                # Đề không có "?"/ô trống ("5. It can be inferred from the passage that…" — phương án nối tiếp câu):
                # khi đoạn đã có câu hỏi, dòng NGẮN hoặc mở đầu bằng số câu là ĐỀ, không phải đoạn văn mới
                # (để nhầm ⇒ câu bị tách khỏi bài đọc, HS không thấy đoạn văn — U2-C137/C145 đo 02/10).
                if not la_cau_hoi and not pending_stem and stt_trong_nl > 0 and (
                        len(tron(chu)) < 200 or re.match(r'^[\s|]*\d+\s*[.)]', tron(chu))):
                    la_cau_hoi = True
                # dòng không phải câu hỏi khi chưa có đề đang chờ = phần tiếp của đoạn văn (không phải đề)
                if not la_cau_hoi and not pending_stem:
                    if nl_hien_tai and stt_trong_nl == 0:
                        ngu_lieu[-1]['noi_dung'] += '\n\n' + hien(chu)
                    else:
                        mo_ngu_lieu('doan_van', hien(chu))
                    continue
                pending_stem.append(chu)
            continue

        # ── điền câu vào đoạn: đoạn văn có (1) ___D___ (bản GV ghi đáp án ngay chỗ trống) + danh sách A–D dùng chung ──
        if che_do == 'chen_cau':
            if loai == 'tr':   # đoạn văn đóng khung trong bảng
                t = '\n\n'.join(x for x, _ in chu if tron(x).strip())
                if len(tron(t)) > 150 and not chen_cau_ds:
                    if nl_hien_tai is None:
                        mo_ngu_lieu('doan_van', hien(t))
                    else:
                        ngu_lieu[-1]['noi_dung'] += '\n\n' + hien(t)
                continue
            if loai != 'p' or not tron(chu).strip():
                continue
            t = tron(chu)
            m = re.match(r'^\s*([A-D])\s*[.)]\s*(.+)', t)
            if m and nl_hien_tai:
                chen_cau_ds.append((m.group(1), hien(re.sub(r'^\s*[\x01-\x04]*[A-D][\x01-\x04]*\s*[.)]\s*', '', chu))))
                if len(chen_cau_ds) == 4:
                    nd = ngu_lieu[-1]['noi_dung']
                    pa4 = [(n, n + '. ' + x) for n, x in chen_cau_ds]
                    # bản GV thường ghi đáp án ngay chỗ trống: "(1) ___C___"
                    dap = re.findall(r'\((\d)\)\s*_*\s*([A-D])\s*_*', tron(nd))
                    if len(dap) == 4:
                        ngu_lieu[-1]['noi_dung'] = re.sub(r'\((\d)\)\s*_*\s*[A-D]\s*_*', r'(\1) ______', nd)
                        for so, da in dap:
                            them(f'({so}) ______', pa4, nl_hien_tai, int(so), dap_an_ep=da)
                    else:
                        # không đọc đủ 4 đáp án tại chỗ trống ⇒ đánh số các ô trống, câu KHÔNG có đáp án (vào hàng chờ duyệt).
                        # Thà bỏ trống đáp án còn hơn đoán (CLAUDE.md §1.5).
                        k = 0
                        def danh_so(m):
                            nonlocal k
                            k += 1
                            return f'({k}) ______'
                        ngu_lieu[-1]['noi_dung'] = re.sub(r'(?:\(\d\)\s*)?_{3,}[A-D]?_*', danh_so, nd)
                        for so in range(1, k + 1):
                            them(f'({so}) ______', pa4, nl_hien_tai, so, dap_an_ep=None)
                            cau[-1]['dap_an'] = None
                            cau[-1]['loi_cau_truc'] = [x for x in cau[-1]['loi_cau_truc'] if not x.startswith('to_mau_')]
                            cau[-1]['loi_cau_truc'].append(f'chen_cau_khong_doc_duoc_dap_an_tai_cho_trong({len(dap)}/{k})')
                    chen_cau_ds, nl_hien_tai = [], None
                continue
            if chen_cau_ds:
                continue
            if nl_hien_tai is None:
                mo_ngu_lieu('doan_van', hien(chu))
            else:
                ngu_lieu[-1]['noi_dung'] += '\n\n' + hien(chu)
            continue

        # ── mcq thường: (đề) + phương án; sắp xếp đoạn: các câu a–e là đề ──
        if che_do == 'mcq':
            if loai == 'tr':
                t = '\n'.join(x for x, _ in chu)
                for d in t.split('\n'):
                    pa = tach_phuong_an(d)
                    if pa:
                        if pending_pa and pa[0][0] == 'A':
                            chot_mcq()
                        pending_pa += pa
                    elif tron(d).strip():
                        if pending_pa:
                            chot_mcq()
                        pending_stem.append(d)
                continue
            if not tron(chu).strip():
                continue
            pa = tach_phuong_an(chu)
            if pa:
                if pending_pa and pa[0][0] == 'A':
                    chot_mcq()
                pending_pa += pa
            else:
                if pending_pa and pending_pa[-1][0] != 'D':
                    # phương án dài tràn sang dòng sau (câu nối/viết lại câu) ⇒ nối vào phương án đang dở
                    n, seg = pending_pa[-1]
                    pending_pa[-1] = (n, seg + ' ' + chu)
                    continue
                if pending_pa:
                    chot_mcq()
                pending_stem.append(chu)
            continue
    chot_mcq()

    # Dạng mà đề BẮT BUỘC có chữ — đề rỗng = câu bị dính sang câu trước (phương án tràn nuốt đề câu sau, U5-C054/U6-C053)
    for c in cau:
        if c['dang_de'] in ('hoan_thanh_cau', 'dong_trai_nghia', 'cau_gan_nghia', 'ket_hop_cau', 'doc_hieu', 'sap_xep_doan') \
                and not tron(c['noi_dung']).strip():
            c['loi_cau_truc'].append('de_rong')

    # Kiểm chéo điền từ: tập số chỗ trống "(n)" trong đoạn văn PHẢI trùng tập số câu gắn vào đoạn đó. Lệch (file thiếu/thừa
    # dòng phương án, đoạn không đánh số) ⇒ gắn cờ CẢ ĐOẠN — không đoán câu nào ứng chỗ nào (§1.5 thà bỏ trống còn hơn đánh sai).
    for nl in ngu_lieu:
        ds = [c for c in cau if c['ngu_lieu'] == nl['ref'] and c['dang_de'] in ('dien_thong_bao', 'dien_doan_van')]
        if not ds:
            continue
        # "(n)" chỉ tính là chỗ trống khi LIỀN dấu gạch dưới — tránh số điện thoại "(555) 987-…" trong thông báo
        tt = tron(nl['noi_dung'])
        cho = sorted({int(a or b) for a, b in re.findall(r'\((\d{1,2})\)\s*_{2,}|_{2,}\s*\((\d{1,2})\)', tt)})
        so_cau = sorted(c['thu_tu_trong_ngu_lieu'] for c in ds)
        if cho != so_cau:
            for c in ds:
                c['loi_cau_truc'].append(f'cloze_lech_cho_trong(doan={cho},cau={so_cau})')

    # ảnh biển báo → file
    for nl in ngu_lieu:
        if nl.get('anh'):
            ten = f"{nl['ref']}{pathlib.Path(nl['anh']).suffix}"
            (ra / ten).write_bytes(z.read(nl['anh']))
            nl['anh_file'] = ten
    for i, c in enumerate(cau, 1):
        c['ref'] = f'{unit}-C{i:03d}'
    (ra / f'{unit}.cau.json').write_text(json.dumps(cau, ensure_ascii=False, indent=1), encoding='utf-8')
    (ra / f'{unit}.ngu_lieu.json').write_text(json.dumps(ngu_lieu, ensure_ascii=False, indent=1), encoding='utf-8')
    tk = {}
    for c in cau:
        tk.setdefault(c['dang_de'], [0, 0])
        tk[c['dang_de']][0] += 1
        tk[c['dang_de']][1] += bool(c['loi_cau_truc'])
    return {'cau': len(cau), 'ngu_lieu': len(ngu_lieu), 'theo_dang': tk, 'bo_qua_dong_phuong_an': bo_qua, 'bai': dem_ex}


if __name__ == '__main__':
    kq = doc(sys.argv[1], sys.argv[2], sys.argv[3])
    print(json.dumps(kq, ensure_ascii=False, indent=1))
