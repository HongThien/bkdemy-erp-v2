# Gộp kế hoạch sửa: cubic (plan_cubic.json) + 476 + 5 câu Tìm x + điền đáp án thiếu → plan_all.json, cau_moi.json (để chạy lại kiểm)
import json, re, sys
from sympy import symbols, expand, solve, Rational, simplify
D = sys.argv[1]
sys.path.insert(0, D)
from kiem2_helpers import tosym
x = symbols('x')
cau = {q['ma_cau']: q for q in json.load(open(D + '/cau.json', encoding='utf-8'))}
plan = {}
def put(ma, ly, **kw):
    plan.setdefault(ma, {'ly_do': []})
    plan[ma]['ly_do'].append(ly)
    plan[ma].update(kw)

# A. cubic
for ma, v in json.load(open(D + '/plan_cubic.json', encoding='utf-8')).items():
    kw = {'dap_an': v['dap_an'], 'loi_giai': v['loi_giai']}
    if v['noi_dung'] != v['noi_dung_cu']: kw['noi_dung'] = v['noi_dung']
    put(ma, v['hanh_dong'] + '; đáp án + lời giải viết lại theo đề', **kw)

# B. 476
def dang_thuc(nd):
    m = re.search(r'\$([^$]+)\$', nd); return m.group(1)
for ma, moi in (('T108030401040', '5x^2-16xy+3y^2'), ('T108030401042', '4x^2-17xy+4y^2')):
    q = cau[ma]; raw = dang_thuc(q['noi_dung'])
    E_new = tosym(moi); A = tosym(re.search(r'\$([^$]+)\$', q['dap_an']).group(1))
    assert expand(A - E_new) == 0, ma
    put(ma, 'ĐỀ bất khả quy trên Z (hệ số xy sai) → sửa đề theo đáp án + lời giải', noi_dung=q['noi_dung'].replace(raw, moi))
for ma in ('T108030401051', 'T108030401052', 'T108030401053', 'T108030401054'):
    q = cau[ma]; E = tosym(dang_thuc(q['noi_dung']))
    last = [l for l in q['loi_giai'].split('\n') if l.strip().startswith('$=')][-1]
    fin = last.strip().rstrip('.').strip('$').lstrip('=').strip()
    assert expand(tosym(fin) - E) == 0, (ma, fin)
    put(ma, 'ĐÁP ÁN sai (≠ đề); lời giải đúng → dap_an lấy từ kết quả lời giải', dap_an='$' + fin + '$')

# C. Tìm x thủ công
q = cau['T108030602084']
lg = q['loi_giai'].replace('$x = \\dfrac{5}{3}$\nVậy', '$x = -\\dfrac{5}{3}$\nVậy').replace('$3x + 5 = 0$\n$x = \\dfrac{5}{3}$', '$3x + 5 = 0$\n$3x = -5$\n$x = -\\dfrac{5}{3}$').replace('$x = 5; x = \\dfrac{5}{3}$', '$x = 5; x = -\\dfrac{5}{3}$')
put('T108030602084', 'ĐÁP ÁN sai dấu: 3x+5=0 ⇒ x = −5/3', dap_an='$x = 5; x = -\\dfrac{5}{3}$', loi_giai=lg)
put('T108030603043', 'ĐÁP ÁN + lời giải sai: x²−2x−3=0 ⇒ (x−3)(x+1) ⇒ x=3 hoặc x=−1', dap_an='x=3; x=-1', loi_giai='$4 - x^2 + 2x - 1 = 0$\n$-x^2 + 2x + 3 = 0$\n$x^2 - 2x - 3 = 0$\n$x^2 - 3x + x - 3 = 0$\n$x(x - 3) + (x - 3) = 0$\n$(x - 3)(x + 1) = 0$\nTrường hợp 1:\n$x - 3 = 0$\n$x = 3$\nTrường hợp 2:\n$x + 1 = 0$\n$x = -1$\nVậy:\n$x = 3; x = -1$')
put('T108030601001', 'ĐÁP ÁN + lời giải sai: x³−7x+6=(x−1)(x−2)(x+3)', dap_an='$x = -3; x = 1; x = 2$', loi_giai='Nhẩm thấy:\n$1^3 - 7 \\cdot 1 + 6 = 0$\nVậy đa thức có nhân tử $(x-1)$.\nTa có:\n$x^3 - 7x + 6 = x^3 - x^2 + x^2 - x - 6x + 6$\n$= x^2(x-1) + x(x-1) - 6(x-1)$\n$= (x-1)(x^2 + x - 6)$\n$= (x-1)(x-2)(x+3)$\nDo đó:\nTrường hợp 1:\n$x - 1 = 0$\n$x = 1$\nTrường hợp 2:\n$x - 2 = 0$\n$x = 2$\nTrường hợp 3:\n$x + 3 = 0$\n$x = -3$\nVậy:\n$x = -3; x = 1; x = 2$')
put('T108030601007', 'ĐỀ sai: x³+3x²+3x+2 không có dạng (x+1)³ (nghiệm không nguyên) → sửa đề thành x³+3x²+3x+1', noi_dung=cau['T108030601007']['noi_dung'].replace('x^3 + 3x^2 + 3x + 2 = 0', 'x^3 + 3x^2 + 3x + 1 = 0'), loi_giai='Nhẩm thấy:\n$(-1)^3 + 3(-1)^2 + 3(-1) + 1 = 0$\nVậy đa thức có nhân tử $(x+1)$.\nTa có:\n$x^3 + 3x^2 + 3x + 1 = x^3 + x^2 + 2x^2 + 2x + x + 1$\n$= x^2(x + 1) + 2x(x + 1) + (x + 1)$\n$= (x + 1)(x^2 + 2x + 1)$\n$= (x + 1)(x + 1)^2$\n$= (x + 1)^3$\nDo đó:\n$(x + 1)^3 = 0$\nTrường hợp 1:\n$x + 1 = 0$\n$x = -1$\nVậy:\n$x = -1$')
put('T108030601008', 'ĐÁP ÁN thiếu nghiệm −2: (x+1)²(x+2)=0', dap_an='$x = -2; x = -1$')

# D. điền đáp án thiếu
def fmt_nghiem(v):
    v = simplify(v)
    if v.is_integer: return str(v)
    p, qq = v.p, v.q
    return ('-' if p < 0 else '') + f'\\dfrac{{{abs(p)}}}{{{qq}}}'
thieu = []
for ma, q in cau.items():
    if (q['dap_an'] or '').strip() or ma in plan: continue
    d = q['dang']
    if d in ('NDB00979', 'NDB00980', 'NDB00981', 'NDB00982', 'NDB00983'):
        m = re.search(r'\$([^$]+=[^$]+)\$', q['noi_dung'])
        if not m: continue
        l, r = re.split(r'(?<![<>!=])=(?!=)', m.group(1), maxsplit=1)
        sol = [s for s in solve(tosym(l) - tosym(r), x) if s.is_real]
        # đối chiếu dòng "Vậy" cuối lời giải
        tail = [mm for mm in re.findall(r'\$([^$]+)\$', q['loi_giai'].split('Vậy')[-1])] if 'Vậy' in q['loi_giai'] else []
        nums = set()
        for t_ in tail:
            for part in re.split(r';|hoặc', t_):
                part = re.sub(r'^\s*x\s*=\s*', '', part).strip()
                if part:
                    try: nums.add(simplify(tosym(part)))
                    except Exception: pass
        ok = nums == set(simplify(s) for s in sol)
        thieu.append((ma, d, ok, [str(s) for s in sol]))
        if ok:
            put(ma, 'THIẾU đáp án → điền theo nghiệm (khớp dòng Vậy cuối lời giải)', dap_an='$' + '; '.join('x = ' + fmt_nghiem(s) for s in sorted(sol, key=lambda z: float(z))) + '$')
    elif d in ('NDB00470', 'NDB00472', 'NDB00977'):
        m = re.search(r'\$([^$]+)\$', q['noi_dung'])
        raw = re.sub(r'\.{2,}|…', '', m.group(1)); raw = [p for p in re.split(r'(?<![<>!=])=(?!=)', raw) if p.strip()][0]
        E = tosym(raw)
        last = [l for l in q['loi_giai'].split('\n') if l.strip().startswith('$=')]
        if last:
            fin = last[-1].strip().rstrip('.').strip('$').lstrip('=').strip()
            try:
                if expand(tosym(fin) - E) == 0:
                    put(ma, 'THIẾU đáp án → lấy kết quả cuối lời giải (đã kiểm = đề)', dap_an='$' + fin + '$'); thieu.append((ma, d, True, fin)); continue
            except Exception: pass
        thieu.append((ma, d, False, 'lời giải cuối không khớp/không đọc được'))
json.dump(plan, open(D + '/plan_all.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('tổng câu sửa:', len(plan))
print('thiếu đáp án, không tự điền được:', [t for t in thieu if not t[2]])
print('điền được:', len([t for t in thieu if t[2]]))
# cau_moi để chạy lại kiểm
cm = []
for ma, q in cau.items():
    q2 = dict(q)
    if ma in plan:
        for k in ('noi_dung', 'dap_an', 'loi_giai'):
            if k in plan[ma]: q2[k] = plan[ma][k]
    cm.append(q2)
json.dump(cm, open(D + '/cau_moi.json', 'w', encoding='utf-8'), ensure_ascii=False)
