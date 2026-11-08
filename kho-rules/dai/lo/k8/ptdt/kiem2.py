# Kiểm kỹ lần 2: đáp án, từng dòng lời giải, nghiệm. Phân lớp lỗi THẬT.
import json, re, sys
from sympy import symbols, factor_list, expand, Poly, solve, factor, Integer, Rational, sqrt, simplify, S, FiniteSet
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor

TR = standard_transformations + (implicit_multiplication_application, convert_xor)
D = sys.argv[1]
cau = json.load(open(D + '/cau.json', encoding='utf-8'))
PHAN_TICH = {'NDB00470', 'NDB00472', 'NDB00475', 'NDB00476', 'NDB00477', 'NDB00478', 'NDB00976', 'NDB00977', 'NDB00978'}
TIM_X = {'NDB00979', 'NDB00980', 'NDB00981', 'NDB00982', 'NDB00983'}
x = symbols('x')

def lam_sach(s):
    s = s.strip().rstrip('.').strip()
    s = re.sub(r'\\left|\\right|\\,|\\;|\\!|\\ |\\quad', '', s)
    s = s.replace('\\cdot', '*').replace('\\times', '*').replace('−', '-').replace('–', '-')
    s = re.sub(r'\\sqrt\{([^{}]*)\}', r'sqrt(\1)', s)
    for _ in range(4):
        s = re.sub(r'\\d?frac\{([^{}]*)\}\{([^{}]*)\}', r'((\1)/(\2))', s)
    s = s.replace('{', '(').replace('}', ')').replace('[', '(').replace(']', ')')
    s = re.sub(r'\^\(([^()]*)\)', r'**(\1)', s)
    s = s.replace('^', '**')
    s = re.sub(r'\\text\([^)]*\)', '', s)
    return s

LOC = {n: symbols(n) for n in 'abcdefghklmnpqrstuvwxyz'}
LOC['A_'] = symbols('A_'); LOC['B_'] = symbols('B_'); LOC['C_'] = symbols('C_'); LOC['P_'] = symbols('P_')
def tosym(s):
    s = lam_sach(s)
    s = re.sub(r'(?<![A-Za-z])A(?![A-Za-z_(])', 'A_', s); s = re.sub(r'(?<![A-Za-z])B(?![A-Za-z_(])', 'B_', s)
    s = re.sub(r'(?<![A-Za-z])C(?![A-Za-z_(])', 'C_', s); s = re.sub(r'(?<![A-Za-z])P(?![A-Za-z_(])', 'P_', s)
    return parse_expr(s, local_dict=LOC, transformations=TR)

def maths(t): return [m.group(1) for m in re.finditer(r'\$([^$]+)\$', t or '')]
EQ = r'(?<![<>!=])=(?!=)'

def bieu_thuc(nd):
    for m in maths(nd):
        m2 = re.sub(r'\.{2,}|…|\\ldots|\\dots', '', m)
        parts = [p for p in re.split(EQ, m2) if p.strip()]
        if not parts: continue
        if len(parts) >= 2 and re.fullmatch(r'\s*[A-Za-z]\s*', parts[0]): return parts[1]
        return parts[0]
    return None

def phuong_trinh(nd):
    for m in maths(nd):
        if '=' in m:
            l, r = re.split(EQ, m, maxsplit=1)
            return l, r
    return None

def nghiem_dap_an(da):
    vals = []
    t = (da or '').replace('−', '-')
    for tok in re.split(r';|\bhoặc\b|\bvà\b', re.sub(r'\$', '', t)):
        tok = tok.strip()
        if not tok: continue
        tok = re.sub(r'^\s*x\s*=\s*', '', tok)
        pm = '\\pm' in tok
        tok2 = tok.replace('\\pm', '')
        try:
            v = tosym(tok2)
            vals += [v, -v] if pm else [v]
        except Exception:
            return None
    return vals

out = {'sai': [], 'ok': [], 'tay': []}
for q in cau:
    d, nd, da, lg, ma = q['dang'], q['noi_dung'] or '', q['dap_an'] or '', q['loi_giai'] or '', q['ma_cau']
    ly = []
    try:
        if d in PHAN_TICH:
            e = bieu_thuc(nd)
            if not e: out['tay'].append((ma, d, 'không thấy biểu thức')); continue
            E = tosym(e)
            c, fl = factor_list(E)
            dm = maths(da)
            Aok = None
            if dm:
                try:
                    A = tosym(dm[-1].split('=')[-1]); Aok = A
                    if expand(A - E) != 0: ly.append('ĐÁP ÁN ≠ ĐỀ')
                    else:
                        # đáp án đã triệt để?
                        cA, flA = factor_list(A)
                        if sorted(map(str, [f for f, m_ in flA for _ in range(m_)])) != sorted(map(str, [f for f, m_ in fl for _ in range(m_)])): ly.append('ĐÁP ÁN CHƯA TRIỆT ĐỂ')
                except Exception as ex: ly.append('không đọc đáp án')
            else: ly.append('thiếu đáp án')
            if len(fl) == 1 and fl[0][1] == 1 and c in (1, -1): ly.append('KHÔNG PHÂN TÍCH ĐƯỢC TRÊN Z')
            # từng dòng lời giải
            bad = []
            for line in lg.split('\n'):
                for seg in maths(line):
                    if '=' not in seg and not line.strip().startswith('$='): continue
                    if re.search(r'A\(|\(−?\d+\)|\\text|Vậy|\\Rightarrow|\\Leftrightarrow', seg): continue
                    parts = [p for p in re.split(EQ, seg) if p.strip()]
                    exprs = []
                    for p in parts:
                        if re.search(r'^[A-Za-z]\s*$', p.strip()): continue
                        try: exprs.append(tosym(p))
                        except Exception: pass
                    exprs = [z for z in exprs if z.free_symbols - {LOC['A_'], LOC['B_'], LOC['C_'], LOC['P_']} and not (z.free_symbols & {LOC['A_'], LOC['B_'], LOC['C_'], LOC['P_']})]
                    for z in exprs:
                        if expand(z - E) != 0:
                            bad.append(str(seg)[:60]); break
            if bad: ly.append('LỜI GIẢI SAI DÒNG: ' + ' | '.join(bad[:2]))
            out['sai' if ly else 'ok'].append((ma, d, e.strip(), str(factor(E)), ly))
        elif d in TIM_X:
            pr = phuong_trinh(nd)
            if not pr: out['tay'].append((ma, d, 'không thấy phương trình')); continue
            L, R = tosym(pr[0]), tosym(pr[1])
            nghiem = solve(L - R, x)
            vs = nghiem_dap_an(da)
            if vs is None: ly.append('không đọc đáp án')
            else:
                if set(simplify(v) for v in vs) != set(simplify(n) for n in nghiem): ly.append(f'ĐÁP ÁN {sorted(map(str, vs))} ≠ NGHIỆM {sorted(map(str, nghiem))}')
            if not nghiem: ly.append('VÔ NGHIỆM')
            if any((not n.is_real) for n in nghiem): ly.append('NGHIỆM KHÔNG THỰC')
            # từng dòng lời giải có nghiệm ⊆ nghiệm gốc
            bad = []
            goc = set(nghiem)
            for line in lg.split('\n'):
                for seg in maths(line):
                    if '=' not in seg or 'x' not in seg: continue
                    if re.search(r'\\text|\\Rightarrow|\\Leftrightarrow|\\lor', seg): continue
                    for p in [seg]:
                        parts = re.split(EQ, p)
                        if len(parts) != 2: continue
                        try:
                            l2, r2 = tosym(parts[0]), tosym(parts[1])
                            if x not in (l2 - r2).free_symbols: continue
                            s2 = set(solve(l2 - r2, x))
                            if not s2.issubset(goc) or not s2: bad.append(seg[:55])
                        except Exception: pass
            if bad: ly.append('LỜI GIẢI SAI DÒNG: ' + ' | '.join(bad[:2]))
            # nghiệm không nguyên → chỉ ghi chú (không coi là sai)
            note = 'nghiệm: ' + str(nghiem)
            out['sai' if ly else 'ok'].append((ma, d, nd[:110].replace('\n', ' '), note, ly))
        else:
            out['tay'].append((ma, d, 'dạng nâng cao — xem tay'))
    except Exception as ex:
        out['tay'].append((ma, d, 'LỖI PARSE: ' + str(ex)[:80]))

json.dump(out, open(D + '/ket_qua2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
from collections import Counter
print('ok', len(out['ok']), '· SAI', len(out['sai']), '· tay', len(out['tay']))
cn = Counter()
for r in out['sai']:
    for l in r[4]: cn[l.split(':')[0][:28]] += 1
print(cn)
print(Counter(r[1] for r in out['sai']))
