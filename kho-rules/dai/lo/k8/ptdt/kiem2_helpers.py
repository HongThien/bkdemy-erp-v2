import re
from sympy import symbols
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor
TR = standard_transformations + (implicit_multiplication_application, convert_xor)
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

