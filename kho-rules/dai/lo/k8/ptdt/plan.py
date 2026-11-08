# Lập kế hoạch sửa các câu PTĐTTNT cubic (nhẩm nghiệm) + bậc 2 (tách hạng tử) bị lỗi — sinh đề/đáp án/lời giải mới & tự kiểm
import json, re, sys, itertools
from sympy import symbols, Poly, expand, factor_list, Integer
sys.path.insert(0, sys.argv[1])
x = symbols('x')
D = sys.argv[1]
cau = {q['ma_cau']: q for q in json.load(open(D + '/cau.json', encoding='utf-8'))}

# ---- định dạng -----------------------------------------------------------
def so(n): return str(abs(n))
def term(c, k, first):
    """hạng tử c·x^k (c khác 0) — first: là hạng tử đầu"""
    a = abs(c)
    if k == 0: body = str(a)
    else:
        v = 'x' if k == 1 else f'x^{k}'
        body = v if a == 1 else f'{a}{v}'
    if first: return ('-' if c < 0 else '') + body
    return (' - ' if c < 0 else ' + ') + body
def poly_latex(cs):  # cs = {k: c}
    out = ''
    for i, k in enumerate(sorted([k for k, c in cs.items() if c != 0], reverse=True)):
        out += term(cs[k], k, i == 0)
    return out
def lin(p, q):  # px+q
    s = 'x' if p == 1 else f'{p}x'
    return f'{s} - {abs(q)}' if q < 0 else f'{s} + {q}'
def mul_group(c, inner):  # c(inner) hoặc ± (inner)
    return inner

def co_dac(n, e, first):
    pass

# ---- lời giải cubic nhẩm nghiệm -----------------------------------------
def loi_giai_cubic(a, b, c, d, r, p, q, s, t):
    """A = a x^3 + b x^2 + c x + d = (x-r)(s x + t)(p x + q), p*s = a"""
    m = b + a * r; n = c + m * r
    assert -n * r == d, (a, b, c, d, r)
    assert p * s == a and p * t + q * s == m and q * t == n, 'tách Q'
    A = poly_latex({3: a, 2: b, 1: c, 0: d})
    xr = f'x - {r}' if r > 0 else f'x + {-r}'
    # A(r)
    if r == 1:
        sub = ' '.join([str(a)] + [('+ ' if v > 0 else '- ') + str(abs(v)) for v in (b, c, d) if v != 0])
    else:
        rs = f'({r})' if r < 0 else str(r)
        parts = []
        for k, v in ((3, a), (2, b), (1, c), (0, d)):
            if v == 0: continue
            if k == 0: body = str(abs(v))
            elif k == 1: body = f'{abs(v)} \\cdot {rs}' if abs(v) != 1 else rs
            else: body = f'{abs(v)} \\cdot {rs}^{k}' if abs(v) != 1 else f'{rs}^{k}'
            parts.append((('-' if v < 0 else '') + body) if not parts else ((' - ' if v < 0 else ' + ') + body))
        sub = ''.join(parts)
    L = []
    L.append(f'Đặt $A = {A}$.')
    L.append('Nhẩm thấy:')
    L.append(f'$A({r}) = {sub} = 0$.')
    L.append(f'Vậy ta hướng tới tạo nhân tử $({xr})$.')
    L.append('Ta có:')
    # tách
    t1 = poly_latex({3: a}) + f' {"-" if a*r>0 else "+"} {abs(a*r) if abs(a*r)!=1 else ""}x^2'
    seg = []
    seg.append(term(a, 3, True)); seg.append(term(-a * r, 2, False))
    if m != 0: seg.append(term(m, 2, False)); seg.append(term(-m * r, 1, False))
    if n != 0: seg.append(term(n, 1, False)); seg.append(term(-n * r, 0, False))
    L.append(f'$A = {"".join(seg)}$')
    g = []
    g.append(f'{"" if a==1 else a}x^2({xr})')
    if m != 0: g.append((' - ' if m < 0 else ' + ') + (f'{abs(m) if abs(m)!=1 else ""}x({xr})'))
    if n != 0: g.append((' - ' if n < 0 else ' + ') + (f'{abs(n)}({xr})' if abs(n) != 1 else f'({xr})'))
    L.append(f'$= {"".join(g)}$')
    Q = poly_latex({2: a, 1: m, 0: n})
    L.append(f'$= ({xr})({Q})$')
    mid = []
    mid.append(term(a, 2, True))
    for cc in (p * t, q * s):
        if cc != 0: mid.append(term(cc, 1, False))
    if n != 0: mid.append(term(n, 0, False))
    L.append(f'$= ({xr})({"".join(mid)})$')
    px = ('x' if p == 1 else f'{p}x'); lt = lin(s, t); lq = lin(p, q)
    grp = f'{px}({lt})' + (f' - {abs(q)}({lt})' if q < 0 else f' + {q}({lt})')
    if abs(q) == 1: grp = f'{px}({lt})' + (f' - ({lt})' if q < 0 else f' + ({lt})')
    L.append(f'$= ({xr})[{grp}]$')
    L.append(f'$= ({xr})({lt})({lq})$.')
    L.append(f'Vậy $A = ({xr})({lt})({lq})$.')
    return '\n'.join(L), f'$({xr})({lt})({lq})$'

# ---- tìm đa thức hợp lệ gần nhất -------------------------------------
def uoc(n): return [d for d in range(1, abs(n) + 1) if n % d == 0]
from math import gcd
TRUNG = set()
def gan_nhat_cubic(a, b, c, d, roots):
    best = None
    for p in uoc(a):
        s = a // p
        if p > s: continue  # tránh trùng
        for q in range(-12, 13):
            if q == 0 or gcd(p, abs(q)) != 1: continue
            for t in range(-12, 13):
                if t == 0 or gcd(s, abs(t)) != 1: continue
                for r in roots:
                    # (x-r)(px+q)(sx+t)
                    pol = Poly((x - r) * (p * x + q) * (s * x + t), x).all_coeffs()
                    if pol[0] != a: continue
                    if tuple(int(v) for v in pol) in TRUNG: continue
                    dist = abs(pol[1] - b) + abs(pol[2] - c) + abs(pol[3] - d)
                    key = (dist, abs(q) + abs(t), abs(r))
                    if best is None or key < best[0]: best = (key, (r, p, q, s, t), pol)
    return best

def factor_cubic_exact(a, b, c, d):
    """nếu a x^3+..  = (x-r)(px+q)(sx+t) nguyên đầy đủ, có nhân tử (x-r) đơn vị → trả r,p,q,s,t"""
    E = a * x**3 + b * x**2 + c * x + d
    cc, fl = factor_list(E)
    lins = []
    for f, mlt in fl:
        P = Poly(f, x)
        if P.degree() != 1: return None
        lins += [(int(P.all_coeffs()[0]), int(P.all_coeffs()[1]))] * mlt
    if len(lins) != 3 or cc not in (1,): return None
    mon = [l for l in lins if l[0] == 1]
    if not mon: return None
    # chọn nhân tử monic có |r| nhỏ nhất
    mon.sort(key=lambda l: abs(l[1]))
    rr = mon[0]; rest = list(lins); rest.remove(rr)
    r = -rr[1]
    (p, q), (s, t) = sorted(rest, key=lambda l: -l[0]) if False else rest
    return r, p, q, s, t

from kiem2_helpers import tosym as _ts
for _m, _q in cau.items():
    try:
        _mm = re.search(r'\$([^$]+)\$', _q['noi_dung'] or '')
        if _mm and _q['dang'] in ('NDB00477', 'NDB00478'):
            _P = Poly(_ts(_mm.group(1)), x)
            if _P.degree() == 3: TRUNG.add(tuple(int(v) for v in _P.all_coeffs()))
    except Exception: pass
CUBIC = ['T108030105018', 'T108030105019', 'T108030105020', 'T108030105022', 'T108030105027', 'T108030105030', 'T108030105051',
         'T108030105054', 'T108030105055', 'T108030105056', 'T108030105057', 'T108030105059', 'T108030105060',
         'T108030105034', 'T108030105035', 'T108030105037', 'T108030105038', 'T108030105039', 'T108030105040', 'T108030105041']
plan = {}
for ma in CUBIC:
    q0 = cau[ma]
    nd = q0['noi_dung']
    m_ = re.search(r'\$([^$]+)\$', nd)
    raw = m_.group(1)
    from kiem2_helpers import tosym  # noqa
    E = tosym(raw)
    P = Poly(E, x); cs = [int(v) for v in P.all_coeffs()]
    a, b, c, d = cs
    TRUNG.discard((a, b, c, d))
    ex = factor_cubic_exact(a, b, c, d)
    roots478 = [r for r in range(-6, 7) if r != 0]
    if ex: action = 'GIỮ ĐỀ (hợp lệ), viết lại lời giải'; r, p, q, s, t = ex; newE = (a, b, c, d); dist = 0
    else:
        roots = [1, -1] if q0['dang'] == 'NDB00477' else roots478
        best = gan_nhat_cubic(a, b, c, d, roots)
        (dist, _, _), (r, p, q, s, t), pol = best
        newE = tuple(int(v) for v in pol); a, b, c, d = newE
        action = f'SỬA ĐỀ (khoảng cách {dist})'
    TRUNG.add((a, b, c, d))
    lg, da = loi_giai_cubic(a, b, c, d, r, p, q, s, t)
    newraw = poly_latex({3: a, 2: b, 1: c, 0: d})
    new_nd = nd.replace(raw, newraw) if newraw != raw.replace(' ', '') and newraw != raw else nd
    # nếu chỉ khác dấu cách, giữ nguyên
    if expand(tosym(newraw) - E) == 0: new_nd = nd
    from kiem2_helpers import tosym as ts2
    Ef = a * x**3 + b * x**2 + c * x + d
    loi = []
    for seg in re.findall(r'\$([^$]+)\$', lg):
        if 'A(' in seg or '=' not in seg: continue
        for part in re.split(r'(?<![<>!=])=(?!=)', seg):
            part = part.strip().rstrip('.')
            if not part or part == 'A' or part.startswith('A'+'(') and False: continue
            if re.fullmatch(r'A', part): continue
            try:
                if expand(ts2(part) - Ef) != 0: loi.append(part[:50])
            except Exception as ex: loi.append('PARSE ' + part[:40])
    assert not loi, (ma, loi)
    assert expand(ts2(da.strip('$')) - Ef) == 0, ma
    plan[ma] = {'dang': q0['dang'], 'hanh_dong': action, 'noi_dung_cu': nd, 'noi_dung': new_nd, 'dap_an_cu': q0['dap_an'], 'dap_an': da, 'loi_giai': lg}
json.dump(plan, open(D + '/plan_cubic.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for ma, v in plan.items():
    print(ma[-9:], v['hanh_dong'], '|', re.search(r'\$([^$]+)\$', v['noi_dung_cu']).group(1)[:30], '→', re.search(r'\$([^$]+)\$', v['noi_dung']).group(1)[:32], '|', v['dap_an'])
