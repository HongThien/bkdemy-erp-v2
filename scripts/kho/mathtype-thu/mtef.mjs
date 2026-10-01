// mtef.mjs — MTEF v5 ("Equation Native" stream of a MathType OLE object) -> LaTeX.
// Rule: never guess, never silently drop content. Anything not understood => { ok:false, reason, offset }.
import { parseEquationNative, MtefError, REC, REC_NAME } from './mtef-parse.mjs';
export { parseEquationNative, MtefError, REC, REC_NAME };

class ConvError extends Error {
  constructor(reason, offset) {
    super(reason + ' @' + offset);
    this.reason = reason;
    this.offset = offset;
  }
}

const hex4 = (n) => n.toString(16).toUpperCase().padStart(4, '0');

// ---------------------------------------------------------------- character tables
const GREEK_LC = {
  0x03b1: '\\alpha', 0x03b2: '\\beta', 0x03b3: '\\gamma', 0x03b4: '\\delta', 0x03b5: '\\varepsilon',
  0x03b6: '\\zeta', 0x03b7: '\\eta', 0x03b8: '\\theta', 0x03b9: '\\iota', 0x03ba: '\\kappa',
  0x03bb: '\\lambda', 0x03bc: '\\mu', 0x03bd: '\\nu', 0x03be: '\\xi', 0x03bf: 'o', 0x03c0: '\\pi',
  0x03c1: '\\rho', 0x03c2: '\\varsigma', 0x03c3: '\\sigma', 0x03c4: '\\tau', 0x03c5: '\\upsilon',
  0x03c6: '\\varphi', 0x03c7: '\\chi', 0x03c8: '\\psi', 0x03c9: '\\omega',
  0x03d1: '\\vartheta', 0x03d5: '\\phi', 0x03d6: '\\varpi', 0x03f0: '\\varkappa', 0x03f1: '\\varrho', 0x03f5: '\\epsilon',
};
const GREEK_UC = {
  0x0393: '\\Gamma', 0x0394: '\\Delta', 0x0398: '\\Theta', 0x039b: '\\Lambda', 0x039e: '\\Xi', 0x03a0: '\\Pi',
  0x03a3: '\\Sigma', 0x03a5: '\\Upsilon', 0x03a6: '\\Phi', 0x03a8: '\\Psi', 0x03a9: '\\Omega',
  // capitals identical to Latin letters
  0x0391: '\\mathrm{A}', 0x0392: '\\mathrm{B}', 0x0395: '\\mathrm{E}', 0x0396: '\\mathrm{Z}', 0x0397: '\\mathrm{H}',
  0x0399: '\\mathrm{I}', 0x039a: '\\mathrm{K}', 0x039c: '\\mathrm{M}', 0x039d: '\\mathrm{N}', 0x039f: '\\mathrm{O}',
  0x03a1: '\\mathrm{P}', 0x03a4: '\\mathrm{T}', 0x03a7: '\\mathrm{X}',
};
const SYMBOLS = {
  0x00a0: '\\ ', 0x00ac: '\\neg', 0x00b0: '{}^{\\circ}', 0x00b1: '\\pm', 0x00b5: '\\mu', 0x00b7: '\\cdot',
  0x00d7: '\\times', 0x00f7: '\\div',
  0x2002: '\\enspace', 0x2003: '\\quad', 0x2009: '\\,', 0x200a: '\\,', 0x200b: '',
  0x2016: '\\|', 0x2020: '\\dagger', 0x2021: '\\ddagger', 0x2022: '\\bullet', 0x2026: '\\ldots',
  0x2032: "'", 0x2033: "''", 0x2034: "'''", 0x2035: '\\backprime', 0x2044: '/',
  0x2102: '\\mathbb{C}', 0x210b: '\\mathcal{H}', 0x210f: '\\hbar', 0x2110: '\\mathcal{I}', 0x2111: '\\Im',
  0x2112: '\\mathcal{L}', 0x2113: '\\ell', 0x2115: '\\mathbb{N}', 0x2118: '\\wp', 0x2119: '\\mathbb{P}',
  0x211a: '\\mathbb{Q}', 0x211b: '\\mathcal{R}', 0x211c: '\\Re', 0x211d: '\\mathbb{R}', 0x2124: '\\mathbb{Z}',
  0x2127: '\\mho', 0x212c: '\\mathcal{B}', 0x2130: '\\mathcal{E}', 0x2131: '\\mathcal{F}', 0x2133: '\\mathcal{M}',
  0x2135: '\\aleph', 0x2136: '\\beth', 0x2137: '\\gimel', 0x2138: '\\daleth',
  0x2190: '\\leftarrow', 0x2191: '\\uparrow', 0x2192: '\\rightarrow', 0x2193: '\\downarrow',
  0x2194: '\\leftrightarrow', 0x2195: '\\updownarrow', 0x2196: '\\nwarrow', 0x2197: '\\nearrow',
  0x2198: '\\searrow', 0x2199: '\\swarrow', 0x219a: '\\nleftarrow', 0x219b: '\\nrightarrow',
  0x21a6: '\\mapsto', 0x21a9: '\\hookleftarrow', 0x21aa: '\\hookrightarrow',
  0x21bc: '\\leftharpoonup', 0x21bd: '\\leftharpoondown', 0x21c0: '\\rightharpoonup', 0x21c1: '\\rightharpoondown',
  0x21c4: '\\rightleftarrows', 0x21c6: '\\leftrightarrows', 0x21cb: '\\leftrightharpoons', 0x21cc: '\\rightleftharpoons',
  0x21cd: '\\nLeftarrow', 0x21ce: '\\nLeftrightarrow', 0x21cf: '\\nRightarrow',
  0x21d0: '\\Leftarrow', 0x21d1: '\\Uparrow', 0x21d2: '\\Rightarrow', 0x21d3: '\\Downarrow',
  0x21d4: '\\Leftrightarrow', 0x21d5: '\\Updownarrow',
  0x2200: '\\forall', 0x2201: '\\complement', 0x2202: '\\partial', 0x2203: '\\exists', 0x2204: '\\nexists',
  0x2205: '\\varnothing', 0x2206: '\\Delta', 0x2207: '\\nabla', 0x2208: '\\in', 0x2209: '\\notin',
  0x220b: '\\ni', 0x220f: '\\prod', 0x2210: '\\coprod', 0x2211: '\\sum', 0x2212: '-', 0x2213: '\\mp',
  0x2214: '\\dotplus', 0x2215: '/', 0x2216: '\\setminus', 0x2217: '*', 0x2218: '\\circ', 0x2219: '\\bullet',
  0x221a: '\\surd', 0x221d: '\\propto', 0x221e: '\\infty', 0x2220: '\\angle', 0x2221: '\\measuredangle',
  0x2222: '\\sphericalangle', 0x2223: '\\mid', 0x2224: '\\nmid', 0x2225: '\\parallel', 0x2226: '\\nparallel',
  0x2227: '\\wedge', 0x2228: '\\vee', 0x2229: '\\cap', 0x222a: '\\cup', 0x222b: '\\int', 0x222c: '\\iint',
  0x222d: '\\iiint', 0x222e: '\\oint', 0x2234: '\\therefore', 0x2235: '\\because', 0x2236: ':',
  0x223c: '\\sim', 0x223d: '\\backsim', 0x2240: '\\wr', 0x2241: '\\nsim', 0x2243: '\\simeq', 0x2245: '\\cong',
  0x2247: '\\ncong', 0x2248: '\\approx', 0x224d: '\\asymp', 0x2250: '\\doteq', 0x2260: '\\ne', 0x2261: '\\equiv',
  0x2264: '\\le', 0x2265: '\\ge', 0x2266: '\\leqq', 0x2267: '\\geqq', 0x226a: '\\ll', 0x226b: '\\gg',
  0x226e: '\\nless', 0x226f: '\\ngtr', 0x2270: '\\nleq', 0x2271: '\\ngeq', 0x227a: '\\prec', 0x227b: '\\succ',
  0x227c: '\\preccurlyeq', 0x227d: '\\succcurlyeq', 0x2282: '\\subset', 0x2283: '\\supset',
  0x2284: '\\not\\subset', 0x2285: '\\not\\supset', 0x2286: '\\subseteq', 0x2287: '\\supseteq',
  0x2288: '\\nsubseteq', 0x2289: '\\nsupseteq', 0x228a: '\\subsetneq', 0x228b: '\\supsetneq', 0x228e: '\\uplus',
  0x228f: '\\sqsubset', 0x2290: '\\sqsupset', 0x2291: '\\sqsubseteq', 0x2292: '\\sqsupseteq',
  0x2293: '\\sqcap', 0x2294: '\\sqcup', 0x2295: '\\oplus', 0x2296: '\\ominus', 0x2297: '\\otimes',
  0x2298: '\\oslash', 0x2299: '\\odot', 0x22a2: '\\vdash', 0x22a3: '\\dashv', 0x22a4: '\\top', 0x22a5: '\\bot',
  0x22a8: '\\models', 0x22b2: '\\vartriangleleft', 0x22b3: '\\vartriangleright',
  0x22c0: '\\bigwedge', 0x22c1: '\\bigvee', 0x22c2: '\\bigcap', 0x22c3: '\\bigcup', 0x22c4: '\\diamond',
  0x22c5: '\\cdot', 0x22c6: '\\star', 0x22c8: '\\bowtie', 0x22ee: '\\vdots', 0x22ef: '\\cdots', 0x22f1: '\\ddots',
  0x2308: '\\lceil', 0x2309: '\\rceil', 0x230a: '\\lfloor', 0x230b: '\\rfloor', 0x2322: '\\frown', 0x2323: '\\smile',
  0x2329: '\\langle', 0x232a: '\\rangle', 0x27e8: '\\langle', 0x27e9: '\\rangle', 0x3008: '\\langle', 0x3009: '\\rangle',
  0x25a0: '\\blacksquare', 0x25a1: '\\square', 0x25b2: '\\blacktriangle', 0x25b3: '\\triangle',
  0x25bc: '\\blacktriangledown', 0x25bd: '\\triangledown', 0x25c6: '\\blacklozenge', 0x25ca: '\\lozenge',
  0x25cb: '\\bigcirc', 0x2605: '\\bigstar', 0x2660: '\\spadesuit', 0x2663: '\\clubsuit', 0x2665: '\\heartsuit',
  0x2666: '\\diamondsuit', 0x266d: '\\flat', 0x266e: '\\natural', 0x266f: '\\sharp', 0x2713: '\\checkmark',
  0x27f5: '\\longleftarrow', 0x27f6: '\\longrightarrow', 0x27f7: '\\longleftrightarrow',
  0x27f8: '\\Longleftarrow', 0x27f9: '\\Longrightarrow', 0x27fa: '\\Longleftrightarrow', 0x27fc: '\\longmapsto',
  0x2a7d: '\\leqslant', 0x2a7e: '\\geqslant',
};
const ASCII_MATH = {
  0x20: '\\ ', 0x23: '\\#', 0x24: '\\$', 0x25: '\\%', 0x26: '\\&', 0x5c: '\\backslash', 0x5f: '\\_',
  0x7b: '\\{', 0x7d: '\\}', 0x7e: '\\sim',
};
// MathType private-use MTCode for spaces (typeface fnSPACE=24 / fnMARKER=23). Widths for the ones
// marked "?" are NOT verified; they are all whitespace and carry no mathematical content.
const MT_SPACES = {
  0xef00: { tex: '', note: 'alignment mark (layout only)' },
  0xef01: { tex: '', note: 'zero-width space' },
  0xef02: { tex: '\\,', note: null },
  0xef03: { tex: '\\:', note: 'space EF03 width unverified' },
  0xef04: { tex: '\\;', note: null },
  0xef05: { tex: '\\quad', note: null },
  0xef06: { tex: '\\qquad', note: 'space EF06 width unverified' },
  0xef07: { tex: '\\ ', note: 'space EF07 width unverified' },
  0xef08: { tex: '\\,', note: 'space EF08 width unverified' },
};
const KNOWN_FUNCS = new Set([
  'arccos', 'arcsin', 'arctan', 'arg', 'cos', 'cosh', 'cot', 'coth', 'csc', 'deg', 'det', 'dim', 'exp', 'gcd',
  'hom', 'inf', 'ker', 'lg', 'lim', 'ln', 'log', 'max', 'min', 'sec', 'sin', 'sinh', 'sup', 'tan', 'tanh',
]);
const LIMIT_FUNCS = new Set(['lim', 'max', 'min', 'sup', 'inf']);

const TEXT_ESC = {
  '\\': '\\textbackslash ', '{': '\\{', '}': '\\}', $: '\\$', '%': '\\%', '&': '\\&', '#': '\\#', _: '\\_',
  '^': '\\textasciicircum ', '~': '\\textasciitilde ', ' ': '~',
};
const escText = (s) => s.replace(/[\\{}$%&#_^~ ]/g, (c) => TEXT_ESC[c]);
const isLetter = (code) => /\p{L}/u.test(String.fromCharCode(code));

// fence delimiters by template selector
const FENCE = {
  0: ['\\langle', '\\rangle'], 1: ['(', ')'], 2: ['\\{', '\\}'], 3: ['[', ']'], 4: ['|', '|'],
  5: ['\\|', '\\|'], 6: ['\\lfloor', '\\rfloor'], 7: ['\\lceil', '\\rceil'], 8: ['\\llbracket', '\\rrbracket'],
};
// what a fence CHAR record looks like when it is a plain (non private-use) code: second witness
const FENCE_CHAR = {
  0x28: '(', 0x29: ')', 0x5b: '[', 0x5d: ']', 0x7b: '\\{', 0x7d: '\\}', 0x7c: '|', 0x2016: '\\|',
  0x2329: '\\langle', 0x232a: '\\rangle', 0x27e8: '\\langle', 0x27e9: '\\rangle', 0x3008: '\\langle', 0x3009: '\\rangle',
  0x230a: '\\lfloor', 0x230b: '\\rfloor', 0x2308: '\\lceil', 0x2309: '\\rceil', 0x2223: '|', 0x2225: '\\|',
  0x27e6: '\\llbracket', 0x27e7: '\\rrbracket', 0x301a: '\\llbracket', 0x301b: '\\rrbracket',
};
const BIGOP_CHAR = {
  0x2211: '\\sum', 0x220f: '\\prod', 0x2210: '\\coprod', 0x22c3: '\\bigcup', 0x22c2: '\\bigcap',
  0x222b: '\\int', 0x222c: '\\iint', 0x222d: '\\iiint', 0x222e: '\\oint', 0x222f: '\\oiint', 0x2230: '\\oiiint',
  0x22c0: '\\bigwedge', 0x22c1: '\\bigvee', 0x2a01: '\\bigoplus', 0x2a02: '\\bigotimes', 0x2a00: '\\bigodot',
  0x2a04: '\\biguplus', 0x2a06: '\\bigsqcup',
};
const BIGOP_SEL = { 16: '\\sum', 17: '\\prod', 18: '\\coprod', 19: '\\bigcup', 20: '\\bigcap' };

const isState = (r) =>
  (r.type >= REC.RULER && r.type <= REC.ENCODING_DEF) || (r.type >= 100 && r.future && r.future.name === 'TeX Input Language');

// ---------------------------------------------------------------- atoms
function finalize(a) {
  if (a.s != null) return a.s;
  if (a.kind === 'text') a.s = '\\text{' + escText(a.raw) + '}';
  else if (a.kind === 'func') a.s = KNOWN_FUNCS.has(a.raw) ? '\\' + a.raw : '\\mathrm{' + a.raw + '}';
  else a.s = '';
  return a.s;
}
function joinAtoms(atoms) {
  let out = '';
  for (const a of atoms) {
    const s = finalize(a);
    if (s === '') continue;
    if (/\\[A-Za-z]+$/.test(out) && /^[A-Za-z0-9]/.test(s)) out += ' ';
    out += s;
  }
  return out;
}
function closeRun(atoms) {
  if (atoms.length) atoms[atoms.length - 1].closed = true;
}
function push(atoms, s, extra) {
  closeRun(atoms);
  atoms.push({ s, closed: true, ...extra });
}
function attachScript(atoms, sub, sup) {
  let base = null;
  for (let i = atoms.length - 1; i >= 0; i--) {
    if (finalize(atoms[i]) !== '' || atoms[i].kind) {
      base = atoms[i];
      // a pure spacing atom cannot carry a script
      if (/^(\\[,;:! ]|\\quad|\\qquad|\\enspace)$/.test(base.s)) base = null;
      break;
    }
  }
  if (!base) {
    base = { s: '{}', closed: true };
    atoms.push(base);
  }
  closeRun(atoms);
  finalize(base);
  if ((sub != null && base.hasSub) || (sup != null && base.hasSup)) {
    base.s = '{' + base.s + '}';
    base.hasSub = base.hasSup = false;
  }
  if (sub != null) {
    base.s += '_{' + sub + '}';
    base.hasSub = true;
  }
  if (sup != null) {
    base.s += '^{' + sup + '}';
    base.hasSup = true;
  }
  base.closed = true;
}

// ---------------------------------------------------------------- characters
function charToTex(rec, env) {
  if (rec.mtcode == null) throw new ConvError('CHAR without MTCode (font position only, typeface ' + rec.typeface + ')', rec.offset);
  const c = rec.mtcode;
  const tf = rec.typeface;
  if (c >= 0xe000 && c <= 0xf8ff) {
    const sp = MT_SPACES[c];
    if (sp && (tf === 24 || tf === 23)) {
      if (sp.note) env.note(sp.note);
      return { s: sp.tex, space: true };
    }
    let font = '';
    if (tf <= 0) {
      // explicit typeface -n = n-th FONT_STYLE_DEF, which points at a FONT_DEF (1-based)
      const st = env.fontStyles[-tf - 1];
      const f = st ? env.fonts[st.fontDefIndex - 1] : null;
      font = f ? ' font "' + f.name + '"' : ' font-style#' + -tf;
    }
    throw new ConvError('unmapped private-use MTCode U+' + hex4(c) + ' (typeface ' + tf + font + (rec.fontPos != null ? ', font position ' + rec.fontPos : '') + ')', rec.offset);
  }
  if (c >= 0xd800 && c <= 0xdfff) throw new ConvError('surrogate MTCode U+' + hex4(c), rec.offset);
  if (c < 0x20 || c === 0x7f) throw new ConvError('control character MTCode U+' + hex4(c), rec.offset);
  if (c < 0x7f) {
    if (ASCII_MATH[c]) return { s: ASCII_MATH[c] };
    if (c === 0x5e) return { s: '\\text{\\textasciicircum}' };
    if (c === 0x60) throw new ConvError('unmapped character U+0060 (grave accent)', rec.offset);
    const ch = String.fromCharCode(c);
    if (c === 0x2c && tf === 8) return { s: '{,}' }; // decimal comma typed in Number style
    if (tf === 7 && /[A-Za-z0-9]/.test(ch)) return { s: '\\mathbf{' + ch + '}' };
    return { s: ch };
  }
  if (GREEK_LC[c]) return { s: GREEK_LC[c] };
  if (GREEK_UC[c]) return { s: GREEK_UC[c] };
  if (c >= 0x2032 && c <= 0x2034) {
    // prime typed as a character. On the baseline LaTeX wants ' (= ^\prime); inside a script slot
    // (MathType users often put the prime in a superscript template) it must be \prime, else it is raised twice.
    const n = c - 0x2031;
    return env.script ? { s: Array(n).fill('\\prime').join(' ') } : { s: "'".repeat(n) };
  }
  if (SYMBOLS[c] != null) return { s: SYMBOLS[c], hasSup: c === 0x00b0 };
  const ch = String.fromCharCode(c);
  if (isLetter(c)) return { s: '\\text{' + ch + '}' }; // Vietnamese etc. kept as-is
  if (/[\p{P}\p{N}\p{Sc}]/u.test(ch)) {
    // punctuation / digits / currency without a LaTeX command: keep the character itself, verbatim
    env.note('character U+' + hex4(c) + ' kept verbatim inside \\text{}');
    return { s: '\\text{' + escText(ch) + '}' };
  }
  throw new ConvError('unmapped MTCode U+' + hex4(c) + ' (typeface ' + tf + ')', rec.offset);
}

const ACCENT = {
  2: '\\dot', 3: '\\ddot', 8: '\\tilde', 9: '\\hat', 11: '\\vec', 12: '\\overleftarrow', 13: '\\overleftrightarrow',
  14: '\\overrightharpoon', 15: '\\overleftharpoon', 17: '\\overline', 21: '\\xcancel', 22: '\\cancel', 23: '\\bcancel',
  29: '\\underline',
};
const PRIMES = { 5: "'", 6: "''", 18: "'''" };

function applyEmbells(s, rec) {
  let primes = '';
  for (const e of rec.embells) {
    if (ACCENT[e.embell]) s = ACCENT[e.embell] + '{' + s + '}';
    else if (PRIMES[e.embell]) primes += PRIMES[e.embell];
    else if (e.embell === 10) s = '\\not{' + s + '}';
    else if (e.embell === 19) s = '\\overset{\\frown}{' + s + '}';
    else if (e.embell === 20) s = '\\overset{\\smile}{' + s + '}';
    else throw new ConvError('embellishment type ' + e.embell + ' not implemented', e.offset);
  }
  return s + primes;
}

function pushChar(atoms, rec, env) {
  const tf = rec.typeface;
  const c = rec.mtcode;
  const last = atoms.length ? atoms[atoms.length - 1] : null;
  const plain = !rec.embells || rec.embells.length === 0;
  if (c != null && (tf === 1 || tf === 12) && plain && !(c >= 0xe000 && c <= 0xf8ff) && c >= 0x20 && c !== 0x7f && !(c >= 0xd800 && c <= 0xdfff)) {
    // Text style: keep characters verbatim inside \text{...}, merge consecutive ones
    const ch = String.fromCharCode(c);
    if (last && last.kind === 'text' && !last.closed) last.raw += ch;
    else {
      closeRun(atoms);
      atoms.push({ kind: 'text', raw: ch });
    }
    return;
  }
  if (c != null && tf === 2 && plain && ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a))) {
    const ch = String.fromCharCode(c);
    if (last && last.kind === 'func' && !last.closed && !rec.funcStart) last.raw += ch;
    else {
      closeRun(atoms);
      atoms.push({ kind: 'func', raw: ch });
    }
    return;
  }
  const t = charToTex(rec, env);
  let s = t.s;
  if (!plain) s = applyEmbells(s, rec);
  push(atoms, s, { hasSup: !!t.hasSup });
}

// ---------------------------------------------------------------- lines, piles, matrices
function renderLineRec(line, env) {
  if (line.isNull) return null;
  return joinAtoms(renderList(line.children, env));
}

function renderList(children, env) {
  const atoms = [];
  for (const rec of children) {
    if (isState(rec)) continue; // size / colour / font definitions: formatting state only
    switch (rec.type) {
      case REC.CHAR:
        pushChar(atoms, rec, env);
        break;
      case REC.TMPL:
        renderTmpl(atoms, rec, env);
        break;
      case REC.PILE:
        push(atoms, renderPile(rec, env));
        break;
      case REC.MATRIX:
        push(atoms, renderMatrix(rec, env));
        break;
      case REC.LINE: {
        // a LINE directly inside a LINE is not described by the spec
        throw new ConvError('LINE nested directly inside a LINE', rec.offset);
      }
      default:
        throw new ConvError('unexpected record ' + (REC_NAME[rec.type] || rec.type) + ' inside a line', rec.offset);
    }
  }
  return atoms;
}

function renderPile(rec, env) {
  const col = { 1: 'l', 2: 'c', 3: 'r', 4: 'l', 5: 'l' }[rec.halign];
  if (!col) throw new ConvError('PILE halign ' + rec.halign + ' unknown', rec.offset);
  if (rec.halign === 4) env.note('pile aligned at relational operator rendered left-aligned');
  if (rec.halign === 5) env.note('pile aligned at decimal point rendered left-aligned');
  const rows = [];
  for (const ch of rec.children) {
    if (isState(ch)) continue;
    if (ch.type !== REC.LINE) throw new ConvError('PILE child is ' + (REC_NAME[ch.type] || ch.type) + ', expected LINE', ch.offset);
    rows.push(renderLineRec(ch, env) ?? '');
  }
  return '\\begin{array}{' + col + '} ' + rows.join(' \\\\ ') + ' \\end{array}';
}

function renderMatrix(rec, env) {
  const cells = [];
  for (const ch of rec.children) {
    if (isState(ch)) continue;
    if (ch.type !== REC.LINE) throw new ConvError('MATRIX child is ' + (REC_NAME[ch.type] || ch.type) + ', expected LINE', ch.offset);
    cells.push(renderLineRec(ch, env) ?? '');
  }
  if (rec.rows < 1 || rec.cols < 1 || cells.length !== rec.rows * rec.cols)
    throw new ConvError('MATRIX ' + rec.rows + 'x' + rec.cols + ' has ' + cells.length + ' cells', rec.offset);
  // column alignment is layout only (cell content and order are unaffected)
  const just = { 0: 'c', 1: 'l', 2: 'c', 3: 'r', 4: 'c', 5: 'c' }[rec.hJust];
  if (!just) throw new ConvError('MATRIX h_just ' + rec.hJust + ' unknown', rec.offset);
  if (rec.hJust === 0) env.note('matrix h_just=0 (meaning unverified) rendered with centred columns');
  if (rec.hJust >= 4) env.note('matrix column alignment ' + rec.hJust + ' rendered centred');
  const bar = (p) => (p === 0 ? '' : p === 1 ? '|' : ':');
  let spec = bar(rec.colParts[0]);
  for (let c = 0; c < rec.cols; c++) spec += just + bar(rec.colParts[c + 1]);
  const hl = (p) => (p === 0 ? '' : p === 1 ? '\\hline ' : '\\hdashline ');
  let body = hl(rec.rowParts[0]);
  for (let r = 0; r < rec.rows; r++) {
    body += cells.slice(r * rec.cols, (r + 1) * rec.cols).join(' & ');
    if (r < rec.rows - 1) body += ' \\\\ ' + hl(rec.rowParts[r + 1]);
    else if (rec.rowParts[r + 1]) body += ' \\\\ ' + hl(rec.rowParts[r + 1]);
  }
  return '\\begin{array}{' + spec + '} ' + body.trim() + ' \\end{array}';
}

// ---------------------------------------------------------------- templates
function parts(rec) {
  const slots = [];
  const chars = [];
  for (const ch of rec.children) {
    if (isState(ch)) continue;
    if (ch.type === REC.LINE || ch.type === REC.PILE || ch.type === REC.MATRIX) {
      if (chars.length) throw new ConvError('template sel=' + rec.selector + ': slot after fence/operator character', ch.offset);
      slots.push(ch);
    } else if (ch.type === REC.CHAR) chars.push(ch);
    else throw new ConvError('template sel=' + rec.selector + ': unexpected child ' + (REC_NAME[ch.type] || ch.type), ch.offset);
  }
  return { slots, chars };
}
function slotTex(slot, env, script = false) {
  const saved = env.script;
  env.script = script;
  try {
    if (slot.type === REC.LINE) return renderLineRec(slot, env);
    if (slot.type === REC.PILE) return renderPile(slot, env);
    return renderMatrix(slot, env);
  } finally {
    env.script = saved;
  }
}
function need(rec, cond, what) {
  if (!cond) throw new ConvError('template sel=' + rec.selector + ' var=0x' + hex4(rec.variation) + ': ' + what, rec.offset);
}

function renderTmpl(atoms, rec, env) {
  const sel = rec.selector;
  const v = rec.variation;
  const { slots, chars } = parts(rec);
  const isScript = sel >= 27 && sel <= 29;
  const tex = slots.map((s) => slotTex(s, env, isScript));
  if (rec.tmplOptions !== 0) env.note('template sel=' + sel + ' has template-options byte ' + rec.tmplOptions + ' (meaning not interpreted)');

  // ---- fences
  if (sel >= 0 && sel <= 9) {
    let L, R;
    if (sel === 9) {
      const names = ['(', ')', '[', ']'];
      need(rec, (v & ~0x33) === 0, 'undefined variation bits');
      L = names[v & 0x3];
      R = names[(v >> 4) & 0x3];
    } else {
      need(rec, (v & ~0x3) === 0, 'undefined variation bits');
      need(rec, (v & 3) !== 0, 'fence with neither side present');
      L = v & 1 ? FENCE[sel][0] : null;
      R = v & 2 ? FENCE[sel][1] : null;
    }
    need(rec, slots.length === 1, 'expected 1 slot, got ' + slots.length);
    const expectChars = (L ? 1 : 0) + (R ? 1 : 0);
    need(rec, chars.length === expectChars, 'expected ' + expectChars + ' fence characters, got ' + chars.length);
    // second witness: the fence CHAR records themselves
    const want = [L, R].filter((x) => x != null);
    chars.forEach((c, i) => {
      const seen = c.mtcode != null ? FENCE_CHAR[c.mtcode] : undefined;
      if (seen === undefined) env.note('fence character U+' + (c.mtcode == null ? '----' : hex4(c.mtcode)) + ' not cross-checked against selector ' + sel);
      else need(rec, seen === want[i], 'fence character U+' + hex4(c.mtcode) + ' disagrees with selector (expected ' + want[i] + ')');
      if (c.embells && c.embells.length) throw new ConvError('embellishment on fence character', c.offset);
    });
    push(atoms, '\\left' + (L ?? '.') + ' ' + (tex[0] ?? '') + ' \\right' + (R ?? '.'));
    return;
  }

  switch (sel) {
    case 10: {
      need(rec, (v & ~1) === 0, 'undefined variation bits');
      need(rec, slots.length === 2, 'expected 2 slots (radicand, index), got ' + slots.length);
      need(rec, chars.length === 0, 'unexpected character in root');
      if (v === 0) {
        need(rec, tex[1] == null, 'square root with a non-empty index slot');
        push(atoms, '\\sqrt{' + (tex[0] ?? '') + '}');
      } else push(atoms, '\\sqrt[' + (tex[1] ?? '') + ']{' + (tex[0] ?? '') + '}');
      return;
    }
    case 11: {
      need(rec, (v & ~7) === 0, 'undefined variation bits');
      need(rec, slots.length === 2 && chars.length === 0, 'expected 2 slots (numerator, denominator)');
      const n = tex[0] ?? '';
      const d = tex[1] ?? '';
      if (v & 2) {
        env.note('slash fraction rendered as {a}/{b}');
        push(atoms, '{' + n + '}/{' + d + '}');
      } else push(atoms, (v & 1 ? '\\tfrac{' : '\\frac{') + n + '}{' + d + '}');
      return;
    }
    case 12:
    case 13: {
      need(rec, (v & ~1) === 0, 'undefined variation bits');
      need(rec, slots.length === 1 && chars.length === 0, 'expected 1 slot');
      const cmd = sel === 12 ? '\\underline' : '\\overline';
      let s = cmd + '{' + (tex[0] ?? '') + '}';
      if (v & 1) s = cmd + '{' + s + '}';
      push(atoms, s);
      return;
    }
    case 14: {
      need(rec, (v & ~0x3f) === 0, 'undefined variation bits');
      need(rec, slots.length === 2 && chars.length <= 1, 'expected 2 slots (top, bottom)');
      const kind = v & 3;
      const dir = v & 0x30;
      let cmd;
      if (kind === 0) {
        if (dir === 0x20) cmd = '\\xrightarrow';
        else if (dir === 0x10) cmd = '\\xleftarrow';
        else if (dir === 0x30) cmd = '\\xleftrightarrow';
        else need(rec, false, 'single arrow with no direction');
      } else if (kind === 1) {
        cmd = '\\xrightleftarrows';
        env.note('double-arrow template: relative arrow sizes not represented');
      } else if (kind === 2) {
        cmd = '\\xrightleftharpoons';
        env.note('harpoon template: relative sizes not represented');
      } else need(rec, false, 'arrow kind 3 undefined');
      const top = tex[0];
      const bot = tex[1];
      push(atoms, cmd + (bot != null ? '[' + bot + ']' : '') + '{' + (top ?? '') + '}');
      return;
    }
    case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: {
      need(rec, slots.length === 3, 'expected 3 slots (main, lower, upper), got ' + slots.length);
      need(rec, chars.length === 1, 'expected 1 operator character, got ' + chars.length);
      const opc = chars[0].mtcode;
      let op = opc != null ? BIGOP_CHAR[opc] : undefined;
      if (sel === 15) {
        need(rec, (v & ~0x17f) === 0, 'undefined variation bits');
        const n = v & 3;
        const loop = v & 0xc;
        need(rec, n >= 1, 'integral count 0');
        const bySel = loop ? ['', '\\oint', '\\oiint', '\\oiiint'][n] : ['', '\\int', '\\iint', '\\iiint'][n];
        if (loop === 8 || loop === 0xc) env.note('oriented contour integral rendered without orientation arrow');
        if (op === undefined) env.note('integral sign character U+' + (opc == null ? '----' : hex4(opc)) + ' not cross-checked');
        else need(rec, op === bySel, 'operator character U+' + hex4(opc) + ' disagrees with variation (' + bySel + ')');
        op = bySel;
      } else {
        need(rec, (v & ~0x70) === 0, 'undefined variation bits');
        if (BIGOP_SEL[sel]) {
          if (op === undefined) env.note('operator character U+' + (opc == null ? '----' : hex4(opc)) + ' not cross-checked');
          else need(rec, op === BIGOP_SEL[sel], 'operator character U+' + hex4(opc) + ' disagrees with selector');
          op = BIGOP_SEL[sel];
        } else {
          if (op === undefined) {
            const t = charToTex(chars[0], env);
            op = '\\mathop{' + t.s + '}';
          }
        }
      }
      const lo = tex[1];
      const up = tex[2];
      need(rec, !!(v & 0x10) === (lo != null) || lo == null, 'lower limit slot filled but variation says absent');
      need(rec, !!(v & 0x20) === (up != null) || up == null, 'upper limit slot filled but variation says absent');
      let s = op;
      if (lo != null || up != null) {
        if (v & 0x40) s += '\\limits';
        else if (sel !== 15) s += '\\nolimits';
        if (lo != null) s += '_{' + lo + '}';
        if (up != null) s += '^{' + up + '}';
      }
      push(atoms, s + ' ' + (tex[0] ?? ''));
      return;
    }
    case 23: {
      need(rec, (v & ~0x30) === 0, 'undefined variation bits');
      need(rec, slots.length === 3 && chars.length === 0, 'expected 3 slots (main, lower, upper), got ' + slots.length);
      const main = tex[0] ?? '';
      const lo = tex[1];
      const up = tex[2];
      const m = /^\\([a-z]+)$/.exec(main);
      let s;
      if (m && LIMIT_FUNCS.has(m[1])) {
        s = main + '\\limits' + (lo != null ? '_{' + lo + '}' : '') + (up != null ? '^{' + up + '}' : '');
      } else {
        s = main;
        if (lo != null && up != null) s = '\\underset{' + lo + '}{\\overset{' + up + '}{' + main + '}}';
        else if (lo != null) s = '\\underset{' + lo + '}{' + main + '}';
        else if (up != null) s = '\\overset{' + up + '}{' + main + '}';
      }
      push(atoms, s);
      return;
    }
    case 24: {
      need(rec, (v & ~1) === 0, 'undefined variation bits');
      need(rec, slots.length === 2 && chars.length <= 1, 'expected 2 slots (main, small)');
      const s = v & 1 ? '\\overbrace{' + (tex[0] ?? '') + '}' + (tex[1] != null ? '^{' + tex[1] + '}' : '') : '\\underbrace{' + (tex[0] ?? '') + '}' + (tex[1] != null ? '_{' + tex[1] + '}' : '');
      push(atoms, s, { hasSup: !!(v & 1), hasSub: !(v & 1) });
      return;
    }
    case 27:
    case 28:
    case 29: {
      need(rec, (v & ~1) === 0, 'undefined variation bits');
      need(rec, slots.length === 2 && chars.length === 0, 'expected 2 slots (sub, sup), got ' + slots.length);
      const sub = tex[0];
      const sup = tex[1];
      if (sel === 27) need(rec, sup == null, 'subscript template with filled superscript slot');
      if (sel === 28) need(rec, sub == null, 'superscript template with filled subscript slot');
      if (v & 1) {
        // script precedes the scripted item
        push(atoms, '{}' + (sub != null ? '_{' + sub + '}' : '') + (sup != null ? '^{' + sup + '}' : ''), { hasSub: true, hasSup: true });
        return;
      }
      const wantSub = sel === 27 || sel === 29 ? (sub ?? '') : null;
      const wantSup = sel === 28 || sel === 29 ? (sup ?? '') : null;
      attachScript(atoms, wantSub, wantSup);
      return;
    }
    case 31: {
      need(rec, (v & ~0xf) === 0, 'undefined variation bits');
      need(rec, slots.length === 1 && chars.length <= 1, 'expected 1 slot');
      const dir = v & 3;
      need(rec, dir !== 0, 'vector with no direction');
      const under = !!(v & 4);
      const harp = !!(v & 8);
      let cmd;
      if (harp) {
        need(rec, !under && dir !== 3, 'under / double harpoon not implemented');
        cmd = dir === 2 ? '\\overrightharpoon' : '\\overleftharpoon';
      } else {
        const name = dir === 2 ? 'rightarrow' : dir === 1 ? 'leftarrow' : 'leftrightarrow';
        cmd = (under ? '\\under' : '\\over') + name;
      }
      push(atoms, cmd + '{' + (tex[0] ?? '') + '}');
      return;
    }
    case 32:
    case 33:
    case 34: {
      need(rec, v === 0, 'undefined variation bits');
      need(rec, slots.length === 1 && chars.length <= 1, 'expected 1 slot');
      const body = tex[0] ?? '';
      if (sel === 32) push(atoms, '\\widetilde{' + body + '}');
      else if (sel === 33) push(atoms, '\\widehat{' + body + '}');
      else push(atoms, '\\overset{\\frown}{' + body + '}');
      return;
    }
    case 36: {
      need(rec, slots.length === 1 && chars.length === 0, 'expected 1 slot');
      need(rec, (v & ~7) === 0, 'undefined variation bits');
      need(rec, !(v & 1), 'horizontal strike-through not implemented');
      const up = !!(v & 2);
      const down = !!(v & 4);
      need(rec, up || down, 'strike with no direction');
      push(atoms, (up && down ? '\\xcancel' : up ? '\\cancel' : '\\bcancel') + '{' + (tex[0] ?? '') + '}');
      return;
    }
    case 37: {
      need(rec, slots.length === 1 && chars.length === 0, 'expected 1 slot');
      need(rec, (v & 0x1e) === 0x1e && (v & ~0x1f) === 0, 'partial box (not all four sides) not implemented');
      push(atoms, '\\boxed{' + (tex[0] ?? '') + '}');
      return;
    }
    case 25:
      throw new ConvError('template tmHBRACK (horizontal bracket) not implemented', rec.offset);
    case 26:
      throw new ConvError('template tmLDIV (long division) not implemented', rec.offset);
    case 30:
      throw new ConvError('template tmDIRAC (bra-ket) not implemented', rec.offset);
    case 35:
      throw new ConvError('template tmJSTATUS (joint status) not implemented', rec.offset);
    default:
      throw new ConvError('unknown template selector ' + sel, rec.offset);
  }
}

// ---------------------------------------------------------------- entry point
export function convertEquation(stream) {
  const out = { ok: false, latex: null, reason: null, offset: null, version: null, notes: {}, annotationTex: null, empty: false, futureRecords: 0, stage: null };
  const buf = Buffer.isBuffer(stream) ? stream : Buffer.from(stream);
  if (buf.length > 28) out.version = buf[28];
  let res;
  try {
    res = parseEquationNative(buf);
  } catch (e) {
    if (!(e instanceof MtefError)) throw e;
    out.stage = 'parse';
    out.reason = e.reason;
    out.offset = e.offset;
    return out;
  }
  out.header = res.header;
  out.futureRecords = res.ctx.futures.length;
  if (res.ctx.futures.length) out.annotationTex = res.ctx.futures[0].future.tex;
  if (res.rulerMode) out.rulerMode = res.rulerMode;
  out.cleanEnd = res.sawTopEnd && res.remainingBytes === 0;
  if (!out.cleanEnd) {
    out.stage = 'parse';
    out.reason = !res.sawTopEnd ? 'no END record at top level' : res.remainingBytes + ' bytes left after top-level END';
    out.offset = 28 + res.endPos;
    return out;
  }
  const env = {
    fonts: res.ctx.fonts,
    fontStyles: res.ctx.fontStyles,
    script: false,
    note(n) {
      out.notes[n] = (out.notes[n] || 0) + 1;
    },
  };
  try {
    const content = res.top.filter((r) => !isState(r));
    if (content.length === 0) {
      out.ok = true;
      out.empty = true;
      out.latex = '';
      return out;
    }
    if (content.length > 1) throw new ConvError('more than one top-level object (' + content.map((r) => REC_NAME[r.type] || r.type).join(',') + ')', content[1].offset);
    const top = content[0];
    let latex;
    if (top.type === REC.LINE) latex = renderLineRec(top, env) ?? '';
    else if (top.type === REC.PILE) latex = renderPile(top, env);
    else throw new ConvError('top-level object is ' + (REC_NAME[top.type] || top.type), top.offset);
    out.ok = true;
    out.latex = latex;
    if (latex.trim() === '') out.empty = true;
    return out;
  } catch (e) {
    if (!(e instanceof ConvError)) throw e;
    out.stage = 'convert';
    out.reason = e.reason;
    out.offset = e.offset;
    return out;
  }
}
