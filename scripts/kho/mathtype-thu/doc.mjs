// doc.mjs — walk word/document.xml in order -> paragraphs of plain text, equations inline as $latex$.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { parseCFB } from './cfb.mjs';
import { convertEquation } from './mtef.mjs';

const require = createRequire(import.meta.url);
const JSZip = require('jszip');

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decode = (s) =>
  s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENT[e] ?? m;
  });
const attr = (tag, name) => {
  const m = new RegExp('(?:^|\\s)' + name.replace(':', '\\:') + '="([^"]*)"').exec(tag);
  return m ? decode(m[1]) : null;
};
const tagName = (tag) => /^<\/?([A-Za-z0-9_:.-]+)/.exec(tag)?.[1] ?? '';

export async function convertDocx(filePath) {
  const zip = await JSZip.loadAsync(fs.readFileSync(filePath));
  const docFile = zip.file('word/document.xml');
  if (!docFile) throw new Error('word/document.xml missing');
  const xml = await docFile.async('string');
  const relsFile = zip.file('word/_rels/document.xml.rels');
  const rels = {};
  if (relsFile) {
    const rx = await relsFile.async('string');
    for (const m of rx.matchAll(/<Relationship\b[^>]*>/g)) {
      const id = attr(m[0], 'Id');
      if (id) rels[id] = { target: attr(m[0], 'Target'), mode: attr(m[0], 'TargetMode'), type: attr(m[0], 'Type') };
    }
  }
  const zipPath = (target) => {
    if (!target) return null;
    if (target.startsWith('/')) return target.slice(1);
    const segs = ('word/' + target).split('/');
    const out = [];
    for (const s of segs) {
      if (s === '..') out.pop();
      else if (s !== '.') out.push(s);
    }
    return out.join('/');
  };
  const base = (p) => (p ? p.split('/').pop() : '?');

  const eqCache = new Map();
  async function equationFor(rid) {
    const rel = rels[rid];
    if (!rel) return { ok: false, resolved: false, reason: 'relationship ' + rid + ' not found', bin: null };
    const p = zipPath(rel.target);
    const f = zip.file(p);
    if (!f) return { ok: false, resolved: false, reason: 'file ' + p + ' not in archive', bin: base(p) };
    if (eqCache.has(p)) return eqCache.get(p);
    const data = Buffer.from(await f.async('uint8array'));
    let r;
    try {
      const cfb = parseCFB(data);
      const s = cfb.getStream('Equation Native');
      if (!s) r = { ok: false, resolved: true, stage: 'ole', reason: 'no "Equation Native" stream in OLE file', bin: base(p) };
      else r = { resolved: true, bin: base(p), ...convertEquation(s) };
    } catch (e) {
      if (e.constructor.name !== 'CfbError') throw e;
      r = { ok: false, resolved: true, stage: 'ole', reason: 'CFB: ' + e.message, bin: base(p) };
    }
    eqCache.set(p, r);
    return r;
  }

  const paragraphs = [];
  const equations = [];
  const stats = {
    wObjects: 0, oleByProgId: {}, equationsInFallbackSkipped: 0, images: 0, shapesWithoutImage: 0, oMath: 0,
    symChars: 0, autoNumberedParagraphs: 0, textOutsideParagraph: 0, nestedParagraphs: 0,
    binsInZip: Object.keys(zip.files).filter((n) => /^word\/embeddings\/.*\.bin$/i.test(n)).length,
  };

  stats.alternateContentBlocks = 0;
  stats.alternateContentBlocksWithEquations = 0;
  stats.alternateContentBlocksFallbackIdenticalToChoice = 0;
  stats.alternateContentBlocksFallbackDiffers = [];
  const fallbackEquations = [];
  let acDepth = 0;
  let acBlock = null;

  const stack = []; // open paragraph buffers
  let inT = false;
  let fallback = 0;
  let object = null; // { progId, rid }
  let drawing = null; // { blips, paragraphsBefore }
  let pict = 0;
  const cur = () => stack[stack.length - 1];
  const emit = (s) => {
    const p = cur();
    if (p) p.text += s;
    else if (s.trim()) {
      stats.textOutsideParagraph++;
      paragraphs.push({ text: s });
    }
  };

  const re = /<!--[\s\S]*?-->|<[^>]+>|[^<]+/g;
  let m;
  while ((m = re.exec(xml))) {
    const tok = m[0];
    if (tok[0] !== '<') {
      if (inT && !fallback) emit(decode(tok));
      continue;
    }
    if (tok.startsWith('<!--') || tok.startsWith('<?')) continue;
    const closing = tok[1] === '/';
    const selfClose = tok.endsWith('/>');
    const name = tagName(tok);

    if (name === 'mc:AlternateContent') {
      if (!selfClose) {
        if (!closing) {
          if (acDepth === 0) acBlock = { choice: [], fallback: [] };
          acDepth++;
        } else {
          acDepth--;
          if (acDepth === 0 && acBlock) {
            stats.alternateContentBlocks++;
            if (acBlock.choice.length || acBlock.fallback.length) {
              stats.alternateContentBlocksWithEquations++;
              if (JSON.stringify(acBlock.choice) === JSON.stringify(acBlock.fallback)) stats.alternateContentBlocksFallbackIdenticalToChoice++;
              else stats.alternateContentBlocksFallbackDiffers.push({ choice: acBlock.choice, fallback: acBlock.fallback });
            }
            acBlock = null;
          }
        }
      }
      continue;
    }
    if (name === 'mc:Fallback') {
      if (!selfClose) fallback += closing ? -1 : 1;
      continue;
    }
    if (fallback) {
      // mc:Fallback = legacy (VML) copy of what mc:Choice already holds. Not emitted into the text,
      // but its equations are still converted so that (a) every .bin is accounted for and
      // (b) we can PROVE the copy is identical instead of assuming it.
      if (name === 'w:object') {
        if (!closing && !selfClose) object = { progId: null, rid: null };
        else if (closing && object) {
          stats.equationsInFallbackSkipped++;
          const pid = object.progId ?? '(none)';
          if (/^Equation\./i.test(pid)) {
            const r = await equationFor(object.rid);
            fallbackEquations.push({ index: fallbackEquations.length, rid: object.rid, progId: pid, inFallback: true, ...r });
            if (acBlock) acBlock.fallback.push(r.ok ? r.latex : 'FAILED:' + r.reason);
          }
          object = null;
        }
      } else if (name === 'o:OLEObject' && !closing && object) {
        object.progId = attr(tok, 'ProgID');
        object.rid = attr(tok, 'r:id');
      }
      continue;
    }

    switch (name) {
      case 'w:p':
        if (closing) {
          const p = stack.pop();
          if (p) paragraphs.push(p);
        } else if (selfClose) paragraphs.push({ text: '' });
        else {
          if (stack.length) stats.nestedParagraphs++;
          stack.push({ text: '' });
        }
        break;
      case 'w:numPr':
        if (!closing && cur() && !cur().numbered) {
          cur().numbered = true;
          stats.autoNumberedParagraphs++;
          cur().text = '[[#]] ' + cur().text;
        }
        break;
      case 'w:t':
        inT = !closing && !selfClose;
        break;
      case 'w:tab':
        if (!closing && cur() && !object) {
          // <w:tab/> inside <w:tabs> (paragraph properties) has w:val; a run tab has no attributes
          if (!/w:val=/.test(tok)) emit('\t');
        }
        break;
      case 'w:br':
      case 'w:cr':
        if (!closing) emit('\n');
        break;
      case 'w:noBreakHyphen':
        if (!closing) emit('-');
        break;
      case 'w:sym':
        if (!closing) {
          stats.symChars++;
          emit('[[sym:' + (attr(tok, 'w:font') ?? '?') + ':' + (attr(tok, 'w:char') ?? '?') + ']]');
        }
        break;
      case 'm:oMath':
        if (!closing) {
          stats.oMath++;
          emit('[[omml-equation-not-converted]]');
        }
        break;
      case 'w:object':
        if (!closing && !selfClose) object = { progId: null, rid: null };
        else if (closing && object) {
          stats.wObjects++;
          const pid = object.progId ?? '(none)';
          stats.oleByProgId[pid] = (stats.oleByProgId[pid] || 0) + 1;
          if (/^Equation\./i.test(pid)) {
            const r = await equationFor(object.rid);
            const idx = equations.length;
            equations.push({ index: idx, rid: object.rid, progId: pid, paragraph: paragraphs.length, ...r });
            if (acBlock) acBlock.choice.push(r.ok ? r.latex : 'FAILED:' + r.reason);
            if (r.ok) emit(r.empty ? '[[eq-empty:' + r.bin + ']]' : '$' + r.latex + '$');
            else emit('[[EQ-FAILED:' + (r.bin ?? object.rid) + ':' + r.reason + ']]');
          } else emit('[[ole:' + pid + ']]');
          object = null;
        }
        break;
      case 'o:OLEObject':
        if (!closing && object) {
          object.progId = attr(tok, 'ProgID');
          object.rid = attr(tok, 'r:id');
        }
        break;
      case 'w:drawing':
        if (!closing && !selfClose) drawing = { blips: 0, nested: stats.nestedParagraphs };
        else if (closing && drawing) {
          if (drawing.blips === 0 && stats.nestedParagraphs === drawing.nested) {
            stats.shapesWithoutImage++;
            emit('[[shape]]');
          }
          drawing = null;
        }
        break;
      case 'a:blip':
        if (!closing) {
          const rid = attr(tok, 'r:embed') ?? attr(tok, 'r:link');
          const rel = rels[rid];
          stats.images++;
          if (drawing) drawing.blips++;
          emit('[[img:' + (rel ? base(rel.target) : rid) + ']]');
        }
        break;
      case 'w:pict':
        if (!selfClose) pict += closing ? -1 : 1;
        break;
      case 'v:imagedata':
        if (!closing && !object) {
          const rid = attr(tok, 'r:id');
          const rel = rels[rid];
          stats.images++;
          emit('[[img:' + (rel ? base(rel.target) : rid) + ']]');
        }
        break;
      default:
        break;
    }
  }
  while (stack.length) paragraphs.push(stack.pop());

  const referenced = new Set(equations.filter((e) => e.bin).map((e) => e.bin));
  stats.binsReferencedByEmittedEquations = referenced.size;
  for (const e of fallbackEquations) if (e.bin) referenced.add(e.bin);
  stats.binsReferencedIncludingFallback = referenced.size;
  return { paragraphs: paragraphs.map((p) => p.text.replace(/[ \t]+$/g, '')), equations, fallbackEquations, stats };
}
