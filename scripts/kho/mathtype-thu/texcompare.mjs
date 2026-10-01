// texcompare.mjs — compare two LaTeX strings by the STRUCTURE KaTeX builds from them (MathML),
// ignoring spacing, \left/\right sizing, fonts-of-letters and how tokens are grouped.
// Used only as a witness (our LaTeX vs the "TeX Input Language" annotation stored in the same OLE object).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const katex = require('katex');

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decode = (s) =>
  s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENT[e] ?? m;
  });

function parseXml(xml) {
  const root = { name: '#root', attrs: '', children: [] };
  const stack = [root];
  const re = /<[^>]+>|[^<]+/g;
  let m;
  while ((m = re.exec(xml))) {
    const t = m[0];
    if (t[0] !== '<') {
      stack[stack.length - 1].children.push({ text: decode(t) });
      continue;
    }
    if (t[1] === '/') {
      stack.pop();
      continue;
    }
    const nm = /^<([A-Za-z0-9:_-]+)/.exec(t)[1];
    const node = { name: nm, attrs: t, children: [] };
    stack[stack.length - 1].children.push(node);
    if (!t.endsWith('/>')) stack.push(node);
  }
  return root;
}

const INVISIBLE = /[\u2061\u2062\u2063\u2064\u200b\u00a0\u2009\u200a\u2005\u2004\u2003\u2002\s]/g;

function ser(n) {
  // U+02C9 / U+00AF / U+203E: \bar vs \overline differ only in the width of the same over-bar
  if (n.text != null) return n.text.replace(INVISIBLE, '').replace(/[ˉ¯]/g, '‾');
  const kids = n.children.filter((c) => c.text == null || c.text.replace(INVISIBLE, '') !== '');
  const all = () => n.children.map(ser).join('');
  const k = (i) => (kids[i] ? ser(kids[i]) : '');
  switch (n.name) {
    case 'annotation':
    case 'mspace':
      return '';
    case 'mi': {
      const mv = /mathvariant="(double-struck|script|fraktur)"/.exec(n.attrs);
      return mv ? mv[1] + '<' + all() + '>' : all();
    }
    case 'mfrac':
      return 'frac(' + k(0) + '|' + k(1) + ')';
    case 'msqrt':
      return 'sqrt(' + all() + ')';
    case 'mroot':
      return 'root(' + k(0) + '|' + k(1) + ')';
    case 'msub':
    case 'munder':
      return k(0) + '_(' + k(1) + ')';
    case 'msup':
    case 'mover':
      return k(0) + '^(' + k(1) + ')';
    case 'msubsup':
    case 'munderover':
      return k(0) + '_(' + k(1) + ')^(' + k(2) + ')';
    case 'mtable':
      return 'table(' + kids.map(ser).filter((r) => r !== '').join(';;') + ')';
    case 'mtr':
      return kids.map(ser).filter((c) => c !== '').join('&');
    case 'menclose':
      return 'enclose(' + all() + ')';
    default:
      return all();
  }
}

export function structureOf(latex) {
  const html = katex.renderToString(latex, { output: 'mathml', throwOnError: true, strict: 'ignore', displayMode: true });
  return ser(parseXml(html));
}

// returns { comparable, same, a, b, error }
export function compareTex(ours, theirs) {
  let a, b;
  try {
    a = structureOf(ours);
  } catch (e) {
    return { comparable: false, error: 'ours: ' + e.message };
  }
  try {
    b = structureOf(theirs);
  } catch (e) {
    return { comparable: false, error: 'annotation: ' + e.message };
  }
  return { comparable: true, same: a === b, a, b };
}
