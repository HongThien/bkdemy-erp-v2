# -*- coding: utf-8 -*-
"""
FILE WORD (.docx) → DANH SÁCH KHỐI theo đúng thứ tự trong văn bản, cùng khuôn với khoi_cua() của doc_de_web.py:
    ('p', chữ) · ('bang', chữ) · ('anh', tên_file_đã_lưu) · ('hop', chữ trong hộp văn bản)
- Gạch chân giữ bằng \x01…\x02 (như trạm đọc web) — đề câu phát âm/đồng nghĩa cần nó.
- Tô màu (highlight) giữ bằng \x03…\x04 khi `to_mau=True` (đáp án của bản GV tô vàng).
- Đánh số TỰ ĐỘNG của Word (w:numPr — "A." không gõ tay) được dựng lại từ numbering.xml, không thì mất nhãn phương án.
- Hộp văn bản (thông báo trong khung) đọc 1 lần (bỏ bản Fallback trùng của mc:AlternateContent).
- Ảnh: chép ra `thu_muc_anh` với tên `<tien_to>_<tên gốc>`; trả tên đó.

    python scripts/anh/docx_khoi.py <file.docx> [thu_muc_anh]     # in thử các khối
"""
import zipfile, re, os, sys
import xml.etree.ElementTree as ET

BS = chr(92)
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
MC = '{http://schemas.openxmlformats.org/markup-compatibility/2006}'
V = '{urn:schemas-microsoft-com:vml}'


# Ký hiệu chèn bằng font biểu tượng (w:sym) → chữ Unicode. Mã F0xx là vùng riêng của font, để nguyên thì hiện Ô TRỐNG
# (đã dính 02/10: 17 câu mạo từ có phương án "không mạo từ" = Wingdings F0FB hiện rỗng). Ký hiệu lạ ⇒ để nguyên, trạm
# phân tích nêu cờ ky_tu_la (người xem).
KY_HIEU = {
    'symbol': {0xC6: '∅', 0xAE: '→', 0xAC: '←', 0xB4: '×', 0xB1: '±', 0xB9: '≠', 0xA3: '≤', 0xB3: '≥', 0xDE: '⇒', 0xDB: '⇔', 0xD6: '√', 0xB0: '°'},
    # Wingdings 0xFB (dấu ✗) trong câu mạo từ = "không dùng mạo từ" ⇒ ∅ — cùng ký hiệu các đề khác gõ thẳng (đề 16)
    'wingdings': {0xFB: '∅', 0xFC: '✓', 0xE0: '→', 0xE8: '→'},
}


def ky_hieu(font, ma):
    try: n = int(ma, 16)
    except Exception: return ''
    n2 = n - 0xF000 if n >= 0xF000 else n
    return KY_HIEU.get((font or '').lower(), {}).get(n2) or chr(n)


def mo(p):
    p = os.path.abspath(p)
    return zipfile.ZipFile(BS + BS + '?' + BS + p if len(p) > 240 else p)


def _la_ma(n, hoa=True):
    bang = [(1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'), (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'), (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')]
    s = ''
    for v, k in bang:
        while n >= v: s += k; n -= v
    return s if hoa else s.lower()


def _dinh_dang(n, fmt):
    if fmt == 'upperLetter': return chr(64 + (n - 1) % 26 + 1)
    if fmt == 'lowerLetter': return chr(96 + (n - 1) % 26 + 1)
    if fmt == 'upperRoman': return _la_ma(n)
    if fmt == 'lowerRoman': return _la_ma(n, False)
    if fmt in ('bullet', 'none'): return ''
    return str(n)


class DanhSo:
    """Dựng lại nhãn đánh số tự động: numId → abstractNum → (fmt, lvlText, start) từng cấp; đếm theo numId."""
    def __init__(self, z):
        self.cap, self.num, self.dem = {}, {}, {}
        try:
            root = ET.fromstring(z.read('word/numbering.xml'))
        except KeyError:
            return
        for an in root.findall(W + 'abstractNum'):
            aid = an.get(W + 'abstractNumId'); lv = {}
            for l in an.findall(W + 'lvl'):
                il = int(l.get(W + 'ilvl'))
                fmt = l.find(W + 'numFmt'); txt = l.find(W + 'lvlText'); st = l.find(W + 'start')
                lv[il] = (fmt.get(W + 'val') if fmt is not None else 'decimal',
                          txt.get(W + 'val') if txt is not None else '%1.',
                          int(st.get(W + 'val')) if st is not None else 1)
            self.cap[aid] = lv
        for n in root.findall(W + 'num'):
            a = n.find(W + 'abstractNumId')
            self.num[n.get(W + 'numId')] = a.get(W + 'val') if a is not None else None

    def nhan(self, num_id, ilvl):
        aid = self.num.get(num_id)
        lv = self.cap.get(aid, {})
        if ilvl not in lv: return ''
        d = self.dem.setdefault(num_id, {})
        for k in list(d):
            if k > ilvl: del d[k]                      # cấp con bắt đầu lại khi cấp cha tăng
        d[ilvl] = d.get(ilvl, lv[ilvl][2] - 1) + 1
        fmt, txt, _ = lv[ilvl]
        if fmt == 'bullet': return ''
        out = txt
        for k in range(ilvl, -1, -1):
            if k in lv:
                out = out.replace(f'%{k + 1}', _dinh_dang(d.get(k, lv[k][2]), lv[k][0]))
        return out


class DocDocx:
    def __init__(self, path, thu_muc_anh=None, tien_to='', to_mau=False):
        self.z = mo(path)
        self.to_mau = to_mau
        self.thu_muc_anh, self.tien_to = thu_muc_anh, tien_to
        self.rels = {}
        try:
            for rr in ET.fromstring(self.z.read('word/_rels/document.xml.rels')):
                self.rels[rr.get('Id')] = rr.get('Target')
        except KeyError:
            pass
        self.so = DanhSo(self.z)
        self.out = []

    # ---------- ảnh ----------
    def luu_anh(self, rid):
        t = self.rels.get(rid)
        if not t or t.startswith('http'): return None
        ten_goc = t.rsplit('/', 1)[-1]
        ten = (self.tien_to + '_' if self.tien_to else '') + ten_goc
        if self.thu_muc_anh:
            os.makedirs(self.thu_muc_anh, exist_ok=True)
            dich = os.path.join(self.thu_muc_anh, ten)
            if not os.path.exists(dich):
                try:
                    open(dich, 'wb').write(self.z.read('word/' + t.lstrip('/').replace('../', '')))
                except KeyError:
                    return None
        return ten

    # ---------- chữ ----------
    def doan(self, p, phu):
        """1 đoạn → chữ (có dấu gạch chân / tô màu). `phu` nhận các khối đi kèm (ảnh, hộp) để xả SAU đoạn."""
        chu = []
        ppr = p.find(W + 'pPr')
        if ppr is not None:
            np_ = ppr.find(W + 'numPr')
            if np_ is not None:
                ni = np_.find(W + 'numId'); il = np_.find(W + 'ilvl')
                if ni is not None and ni.get(W + 'val') != '0':
                    nh = self.so.nhan(ni.get(W + 'val'), int(il.get(W + 'val')) if il is not None else 0)
                    if nh: chu.append(nh + ' ')
        self._duyet(p, chu, phu)
        s = ''.join(chu)
        s = s.replace('\x02\x01', '').replace('\x04\x03', '')
        s = re.sub(r'\x01(\s*)\x02', r'\1', s)
        s = re.sub(r'\x03(\s*)\x04', r'\1', s)
        return s

    def _duyet(self, el, chu, phu):
        for c in el:
            tag = c.tag
            if tag == W + 'r':
                self._run(c, chu, phu)
            elif tag in (W + 'hyperlink', W + 'smartTag', W + 'ins', W + 'customXml', W + 'fldSimple', W + 'sdt', W + 'sdtContent', W + 'moveTo'):
                self._duyet(c, chu, phu)
            elif tag == MC + 'AlternateContent':
                ch = c.find(MC + 'Choice')
                self._duyet(ch if ch is not None else c, chu, phu)
            elif tag in (W + 'del', W + 'moveFrom', W + 'pPr', W + 'rPr', W + 'proofErr', W + 'bookmarkStart', W + 'bookmarkEnd'):
                continue

    def _run(self, r, chu, phu):
        rpr = r.find(W + 'rPr')
        u = hl = False
        if rpr is not None:
            ue = rpr.find(W + 'u')
            u = ue is not None and ue.get(W + 'val') not in ('none', None)
            he = rpr.find(W + 'highlight')
            hl = he is not None and he.get(W + 'val') not in ('none', None)
            if not hl:
                sh = rpr.find(W + 'shd')
                hl = sh is not None and (sh.get(W + 'fill') or 'auto').lower() not in ('auto', 'ffffff', '')
            if rpr.find(W + 'vanish') is not None: return
        for c in r:
            tag = c.tag
            t = None
            if tag == W + 't': t = c.text or ''
            elif tag == W + 'tab': t = '\t'
            elif tag in (W + 'br', W + 'cr'): t = '\n'
            elif tag == W + 'noBreakHyphen': t = '-'
            elif tag == W + 'sym':
                t = ky_hieu(c.get(W + 'font'), c.get(W + 'char'))
            elif tag == MC + 'AlternateContent':
                ch = c.find(MC + 'Choice')
                self._doi_tuong(ch if ch is not None else c, phu)
            elif tag in (W + 'drawing', W + 'pict', W + 'object'):
                self._doi_tuong(c, phu)
            if t:
                if u and t.strip(): t = '\x01' + t + '\x02'
                if hl and self.to_mau and t.strip(): t = '\x03' + t + '\x04'
                chu.append(t)

    def _doi_tuong(self, el, phu):
        """drawing / pict: hộp văn bản ⇒ ('hop', chữ); ảnh ⇒ ('anh', tên)."""
        hop = list(el.iter(W + 'txbxContent'))
        if hop:
            for h in hop[:1]:
                dong = []
                for p in h.iter(W + 'p'):
                    s = self.doan(p, phu).strip()
                    if s: dong.append(s)
                if dong: phu.append(('hop', '\n'.join(dong)))
            return
        for b in el.iter(A + 'blip'):
            ten = self.luu_anh(b.get(R + 'embed'))
            if ten: phu.append(('anh', ten))
        for b in el.iter(V + 'imagedata'):
            ten = self.luu_anh(b.get(R + 'id'))
            if ten: phu.append(('anh', ten))

    # ---------- khối ----------
    def bang(self, tbl):
        dong, phu = [], []
        for tr in tbl.iter(W + 'tr'):
            o = []
            for tc in tr.findall(W + 'tc'):
                ps = [self.doan(p, phu).strip() for p in tc.findall('.//' + W + 'p')]
                o.append('\n'.join(x for x in ps if x))
            dong.append('\n'.join(x for x in o if x))
        return '\n'.join(x for x in dong if x), phu

    def chay(self):
        body = ET.fromstring(self.z.read('word/document.xml')).find(W + 'body')
        self._khoi(body)
        return self.out

    def _khoi(self, el):
        for c in el:
            if c.tag == W + 'p':
                phu = []
                s = self.doan(c, phu)
                if s.strip(): self.out.append(('p', re.sub(r'[ \t]+', ' ', s).strip()))
                self.out.extend(phu)
            elif c.tag == W + 'tbl':
                s, phu = self.bang(c)
                if s.strip(): self.out.append(('bang', re.sub(r'[ \t]+', ' ', s).strip()))
                self.out.extend(phu)
            elif c.tag in (W + 'sdt', W + 'sdtContent', W + 'customXml'):
                self._khoi(c)


def khoi_docx(path, thu_muc_anh=None, tien_to='', to_mau=False):
    return DocDocx(path, thu_muc_anh, tien_to, to_mau).chay()


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    for loai, t in khoi_docx(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None, 'x', to_mau=True):
        print(f'[{loai}]', t.replace('\x01', '_').replace('\x02', '_').replace('\x03', '[[').replace('\x04', ']]').replace('\n', ' ⏎ ')[:200])
