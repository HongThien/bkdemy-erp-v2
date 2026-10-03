# -*- coding: utf-8 -*-
"""
TRẠM ĐỌC BỘ "TEST THEO UNIT GLOBAL SUCCESS 6–9" (bản GV) → mỗi TEST = 1 đề (cau.json + ngu_lieu.json), cùng lõi
doc_de_web.phan_tich ⇒ đi tiếp bên A / bên B / cổng ghi (--de-thi) như đề HN. Thùy 02/10: "hàng về… đề thi phải lưu lại đề".

    python scripts/anh/doc_test_unit.py <thư_mục_bộ_lớp_K> <K> <thư_mục_ra> [--chi-unit 1,2]

- File GV (tên có "GV"; ".DOC" của bộ lớp 7 thực chất là docx). Unit = số sau "Unit" ở tên thư mục/tệp. 1 file = nhiều TEST.
  Ra: <thư_mục_ra>/nhap/G<K>U<uu>T<t>/ — mã câu G9U08T1-C005.
- Bản GV in lời giải NGAY SAU mỗi câu ("Giải thích", "Đáp án: X", "👉 Đáp án đúng: X", "Dịch nghĩa", dòng phiên âm "A. word – /…/"):
  TÁCH khỏi đề trước khi phân tích — dòng phiên âm có nhãn A–D, để lẫn là thành phương án thứ 5–8.
- Đáp án = 2 nhân chứng độc lập trong file: dòng "Đáp án" + phương án TÔ MÀU. Lệch ⇒ bỏ trống + cờ (bên A giải mù là nhân chứng thứ 3).
- Lời giải (Giải thích + Dịch) → loi_giai, CHỈ khi lời giải nhắc tới chữ của phương án đúng: bản gốc có chỗ dán nhầm lời giải câu
  khác (GS9 U8 test 1 câu 3: lời giải nói "dependent", đáp án là "unique") ⇒ thà không có lời giải còn hơn lời giải sai.
"""
import sys, os, re, json, shutil
from collections import Counter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from docx_khoi import khoi_docx
from doc_de_web import phan_tich, tron, la_lenh, tach_phuong_an, NHAN

VIET = re.compile('[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]', re.I)
CHU = re.compile(r'[A-Za-zÀ-ỹ]')
RE_TEST = re.compile(r'^\s*TEST\s*0?(\d+)\s*[:.]?\s*$', re.I)
RE_CAU = re.compile(r'^\s*Question\s+(\d+)\s*[.:]?\s*', re.I)
RE_DAP = re.compile(r'Đáp\s*án(?:\s*đúng)?(?:\s*là)?\s*[:：]?\s*([A-D])\b')
RE_GIAI = re.compile(r'^\s*(👉|☑|✅|✔|✓|➡|→|Giải thích|Đáp\s*án|Dịch|Tạm dịch|Hướng dẫn|Lời giải|Phân tích|Kiến thức|Cấu trúc|Thông tin|Từ vựng|Loại)'
                     r'|đáp\s*án\s*(đúng)?\s*[:：]', re.I)
RE_LO = re.compile(r'đáp\s*án|☑|✅|👉|giải thích|dịch nghĩa', re.I)   # dấu vết lời giải còn sót trong đề ⇒ cờ lo_dap_an
RE_SO_CUOI_LENH = re.compile(r'questions?\s+(\d+)\s*\.?\s*$', re.I)       # "… the following questions 17." — câu không tự ghi "Question 17"
RE_CAU_TO = re.compile('Question\\s+(\\d+)\\s*[.:]?\\s*\x03\\s*([A-D])\\s*\x04')   # "Question 37: [[B]]" — đáp án tô màu ở dòng gom
RE_CAU_CHU = re.compile(r'Question\s+(\d+)\s*[.:]?[\s_]*([A-D])[\s_]*(?=Question\s+\d+|$)')   # "Question 37 _ _ C_ _ _" (đáp án viết giữa gạch)
RE_CHI_DAP = re.compile(r'^\s*(👉\s*)?Đáp\s*án(\s*đúng)?(\s*là)?\s*[:：]?\s*[A-D]\b[.\s]*$')


def la_tieng_viet(t):
    """Dòng tiếng Việt (lời giải/dịch) — đề Anh không có. Tên riêng có dấu trong bài đọc (Hội An, Phú Quốc) chỉ vài ký tự ⇒ đo theo TỈ LỆ."""
    v = len(VIET.findall(t)); c = len(CHU.findall(t))
    return v >= 3 and c and v / c >= 0.03


def chuan_to_mau(t):
    """Tô màu bao cả nhãn "[[A. resort]]" ⇒ dời dấu tô ra SAU nhãn "A. [[resort]]" để tách phương án vẫn thấy nhãn.
    Nhãn kiểu gạch ngang ĐẦU DÒNG "A - that he…" (bộ lớp 6, phương án dùng chung câu 37–40) ⇒ "A. that he…"."""
    t = re.sub(r'(?m)^(\s*\x03?\s*)([A-D])\s*[-–]\s*(?=\S)', r'\1\2. ', t)
    t = re.sub('\x03(\\s*)([A-D])(\\s*[.)]\\s*)', '\\1\\2\\3\x03', t)
    return re.sub('\x03(\\s*)\x04', '\\1', t)


def tach_test(khoi):
    tests, cur = [], None
    for k, t in khoi:
        m = RE_TEST.match(tron(t)) if k in ('p', 'bang') else None
        if m:
            cur = {'so': int(m.group(1)), 'khoi': []}; tests.append(cur); continue
        if cur is not None: cur['khoi'].append((k, t))
    if not tests:   # file 1 test không ghi "TEST 1"
        tests = [{'so': 1, 'khoi': list(khoi)}]
    # số test theo THỨ TỰ xuất hiện — file gốc có chỗ ghi "Test 1" cho cả 2 test (GS7 U7, U11) ⇒ trùng mã là đè mất 1 đề
    for i, t in enumerate(tests):
        if t['so'] != i + 1: print(f'   ⚠ test thứ {i + 1} ghi "TEST {t["so"]}" ⇒ đánh số {i + 1}')
        t['so'] = i + 1
    return tests


def tach_dong(khoi):
    """Khối nhiều dòng LẪN lời giải (ô bảng câu biển báo: 4 phương án + "Đáp án" + "Giải thích" cùng 1 ô; đoạn "Đáp án: B ⏎ Giải thích…")
    ⇒ tách từng dòng để phần đề và phần lời giải đi đúng đường. Khối không lẫn lời giải giữ nguyên (bài đọc, thông báo)."""
    out = []
    for k, t in khoi:
        if k in ('p', 'bang') and '\n' in t:
            dong = t.split('\n')
            if any(RE_GIAI.match(tron(d).strip()) or la_tieng_viet(tron(d)) for d in dong):
                out += [('p', d) for d in dong if tron(d).strip()]
                continue
        out.append((k, t))
    return out


def loc_giai(khoi):
    """Tách lời giải khỏi đề. Trả (khối sạch, {số câu: đáp án dòng "Đáp án"}, {số câu: [dòng lời giải]})."""
    sach, dap, giai = [], {}, {}
    n, so_nhan, che_do_giai = None, 0, False
    da_gap = set()
    cho_tao = None   # lệnh ghi "… question 17." mà câu không tự ghi "Question 17" ⇒ dựng dòng câu, NẾU khối kế không phải chính câu đó
    for k, t in tach_dong(khoi):
        if k in ('anh', 'hop'):
            sach.append((k, t)); continue
        tt = tron(t).strip()
        m = RE_CAU.match(tt)
        if cho_tao is not None:
            if not (m and int(m.group(1)) == cho_tao):
                n, so_nhan, che_do_giai = cho_tao, 0, False
                da_gap.add(n); sach.append(('p', f'Question {n}.'))
            cho_tao = None
        # phương án đặt trong BẢNG (câu biển báo) ⇒ coi như đoạn thường để lõi phân tích đọc được
        if k == 'bang' and n is not None and tach_phuong_an(tt):
            k = 'p'
        # "Question 37: B" / "Question 37 ⏎ Đáp án: B …" ở PHẦN LỜI GIẢI (số câu đã gặp) ⇒ lời giải, không phải câu mới
        if m and int(m.group(1)) in da_gap:
            con = tt[m.end():].strip()
            md = RE_DAP.search(con) or re.match(r'^([A-D])\b\.?\s*$', con)
            if md: dap.setdefault(int(m.group(1)), md.group(1))
            if con: giai.setdefault(int(m.group(1)), []).append(con)
            n, che_do_giai = int(m.group(1)), True
            continue
        if m:
            for so, x in RE_CAU_TO.findall(t) + RE_CAU_CHU.findall(tt):   # dòng gom "Question 37: [[B]] Question 38: [[D]]" · "Question 37 _ _ C _ _"
                dap.setdefault(int(so), x); da_gap.add(int(so))
            n, che_do_giai = int(m.group(1)), False
            da_gap.add(n)
            con = tt[m.end():].strip()
            so_nhan = len({x.group(1) for x in NHAN.finditer(chuan_to_mau(t)[m.end():].replace('\x03', ' ').replace('\x04', ' '))})
            if RE_DAP.search(con) and not tach_phuong_an(con):          # "Question 5: … Đáp án: B" cùng dòng (hiếm)
                dap.setdefault(n, RE_DAP.search(con).group(1))
            sach.append((k, chuan_to_mau(t)))
            che_do_giai = so_nhan >= 4
            continue
        if la_lenh(tt) or RE_TEST.match(tt):
            n, che_do_giai = None, False
            sach.append((k, t))
            ms = RE_SO_CUOI_LENH.search(tt)
            if ms and la_lenh(tt):
                cho_tao = int(ms.group(1))
            continue
        if che_do_giai or RE_GIAI.match(tt) or la_tieng_viet(tt):
            md = RE_DAP.search(tt)
            if n is not None:
                if md: dap.setdefault(n, md.group(1))
                giai.setdefault(n, []).append(tt)
            continue
        pa = tach_phuong_an(chuan_to_mau(t).replace('\x03', ' ').replace('\x04', ' ').strip())
        if pa and n is not None:
            so_nhan += len(pa)
            sach.append((k, chuan_to_mau(t)))
            che_do_giai = so_nhan >= 4
            continue
        sach.append((k, chuan_to_mau(t) if pa else t))
    return sach, dap, giai


def so_cua(ref):
    return int(re.search(r'C(\d+)B?$', ref).group(1))


def bo_dau(s):
    return re.sub(r'<[^>]+>', '', (s or '').replace('\x03', '').replace('\x04', '')).strip()


TU_BO = {'the', 'and', 'are', 'for', 'with', 'this', 'that', 'you', 'can', 'not', 'was', 'were', 'his', 'her', 'its', 'our', 'their',
         'they', 'she', 'has', 'have', 'had', 'will', 'from', 'into', 'than', 'then', 'there', 'what', 'who', 'which'}


def tu_cua(s):
    return {w for w in re.findall(r"[a-z][a-z'’-]+", s.lower()) if len(w) >= 3 and w not in TU_BO}


def giai_khop(g, lua_chon, i_dung):
    """Lời giải nói về phương án ĐÚNG? Chứa nguyên chữ phương án đúng ⇒ có. Không thì: tỉ lệ từ của phương án đúng có trong lời giải
    ≥ 0,5 và không thấp hơn phương án nào khác (lời giải dán nhầm câu khác ⇒ trùng thấp với cả 4 ⇒ loại)."""
    chu = ' '.join(g).lower()
    dung = bo_dau(lua_chon[i_dung]).lower().strip().rstrip('.')
    if dung and dung in chu: return True
    tg = tu_cua(chu)
    diem = []
    for o in lua_chon:
        w = tu_cua(bo_dau(o))
        diem.append(len(w & tg) / len(w) if w else 0)
    return diem[i_dung] >= 0.5 and diem[i_dung] >= max(diem)


def chu_de_unit(path):
    """Tên chủ đề unit từ tên thư mục: "Unit 8. TOURISM (File word…)" · "Test For Unit 2 -  CITY LIFE" ⇒ "Tourism" / "City Life"."""
    for ten in (os.path.basename(os.path.dirname(path)), os.path.basename(path)):
        m = re.search(r'unit\s*\d+\s*[.\-–:]?\s*([A-Za-z][^()]*)', ten, re.I)
        if m:
            t = re.sub(r'\s+', ' ', m.group(1)).strip(' .-–')
            if t and not re.search(r'(?i)\b(gv|hs|test|gb\d|anh \d|tai lieu|hk\d|lớp)\b', t):
                return t.title()
    return None


def doc_file(path, K, unit, ra, dem, ds_de):
    tam = os.path.join(ra, '_anh_tam', f'G{K}U{unit:02d}')
    khoi = khoi_docx(path, tam, f'G{K}U{unit:02d}', to_mau=True)
    for tst in tach_test(khoi):
        ma = f'G{K}U{unit:02d}T{tst["so"]}'
        dn = os.path.join(ra, 'nhap', ma)
        sach, dap, giai = loc_giai(tst['khoi'])
        out, nl = phan_tich(sach, dap, ma, dn, tam, nguon='docx', ghi=False)
        for x in out:
            n = so_cua(x['ref'])
            hl = [i for i, o in enumerate(x['lua_chon']) if '\x03' in o]
            x['noi_dung'] = bo_dau_to(x['noi_dung'])
            x['lua_chon'] = [bo_dau_to(o) for o in x['lua_chon']]
            k_to = 'ABCD'[hl[0]] if len(hl) == 1 and hl[0] < 4 else None
            k_dong = dap.get(n)
            x['loi_cau_truc'] = [l for l in x['loi_cau_truc'] if l != 'khong_co_dap_an']
            if x['ref'].endswith('B'):
                x['dap_an'] = None
            elif k_dong and k_to and k_dong != k_to:
                x['dap_an'] = None; x['loi_cau_truc'].append(f'dap_an_2_nguon_lech:{k_dong}/{k_to}')
            else:
                x['dap_an'] = k_dong or k_to
                if not x['dap_an']: x['loi_cau_truc'].append('khong_co_dap_an')
            x['unit_sgk'] = f'L{K}U{unit}'
            # lời giải: chỉ giữ khi nó nói về PHƯƠNG ÁN ĐÚNG (chứa nguyên chữ, hoặc trùng từ với phương án đúng nhiều nhất trong 4)
            g = [l for l in giai.get(n, []) if not RE_CHI_DAP.match(l)]
            x['loi_giai'] = None
            if g and x['dap_an'] and 'ABCD'.index(x['dap_an']) < len(x['lua_chon']):
                if giai_khop(g, x['lua_chon'], 'ABCD'.index(x['dap_an'])):
                    x['loi_giai'] = '\n'.join(g); dem['giai_giu'] += 1
                else:
                    x['ghi'] = 'bỏ lời giải: không nói về phương án đúng'; dem['giai_bo'] += 1
        for x in out:
            if RE_LO.search(' '.join([x['noi_dung'], *x['lua_chon']])) or any(la_tieng_viet(o) for o in [x['noi_dung'], *x['lua_chon']]):
                x['loi_cau_truc'].append('lo_dap_an')
        for v in nl:
            v['noi_dung'] = bo_dau_to(v['noi_dung'])
            if RE_LO.search(v['noi_dung']) or la_tieng_viet(v['noi_dung']):
                for x in out:
                    if x['ngu_lieu'] == v['ref'] and 'lo_dap_an' not in x['loi_cau_truc']: x['loi_cau_truc'].append('lo_dap_an')
            if v.get('anh_file'):
                os.makedirs(dn, exist_ok=True); shutil.copy(os.path.join(tam, v['anh_file']), os.path.join(dn, v['anh_file']))
        os.makedirs(dn, exist_ok=True)
        json.dump(out, open(os.path.join(dn, f'{ma}.cau.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        json.dump(nl, open(os.path.join(dn, f'{ma}.ngu_lieu.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        co = [x for x in out if x['loi_cau_truc']]
        so = sorted(so_cua(x['ref']) for x in out)
        thieu = [k for k in range(1, (so[-1] if so else 0) + 1) if k not in so]
        print(f'{ma}: {len(out)} câu · dạng {dict(Counter(x["dang_de"] for x in out))} · có lời giải {sum(1 for x in out if x["loi_giai"])} · '
              f'cờ {len(co)}' + (f' · ⚠ THIẾU số {thieu}' if thieu else ''))
        for x in co: print('   cờ', x['ref'], x['loi_cau_truc'])
        dem['de'] += 1; dem['cau'] += len(out)
        cd = chu_de_unit(path)
        ds_de[ma] = {'ten': f'Global Success {K} — Unit {unit}' + (f' · {cd}' if cd else '') + f' — Test {tst["so"]}',
                     'khoi': K, 'unit': unit, 'test': tst['so'], 'file': path}


def bo_dau_to(s):
    return re.sub(r'[ \t]+\n', '\n', (s or '').replace('\x03', '').replace('\x04', '')).strip()


def main():
    args = sys.argv[1:]
    chi = None
    if '--chi-unit' in args:
        i = args.index('--chi-unit'); chi = {int(x) for x in args[i + 1].split(',')}; args = args[:i] + args[i + 2:]
    goc, K, ra = args[0], int(args[1]), args[2]
    dem = Counter()
    ds_de = {}
    tep = []
    for root, _, files in os.walk(goc):
        for f in files:
            if f.startswith('~$') or not f.lower().endswith(('.docx', '.doc')): continue
            ten = f.upper().replace('GB', '')
            if 'GV' not in ten: continue
            m = re.search(r'UNIT\s*(\d+)', f.upper()) or re.search(r'UNIT\s*(\d+)', os.path.basename(root).upper())
            if not m: print('   ⚠ không thấy số unit:', f); continue
            tep.append((int(m.group(1)), os.path.join(root, f)))
    for unit, path in sorted(tep):
        if chi and unit not in chi: continue
        doc_file(path, K, unit, ra, dem, ds_de)
    p_ds = os.path.join(ra, 'ds_de.json')
    cu = json.load(open(p_ds, encoding='utf-8')) if os.path.exists(p_ds) else {}
    cu.update(ds_de)
    json.dump(cu, open(p_ds, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'== lớp {K}: {dem["de"]} đề · {dem["cau"]} câu · lời giải giữ {dem["giai_giu"]} / bỏ {dem["giai_bo"]}')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
