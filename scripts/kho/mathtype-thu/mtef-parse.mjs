// mtef-parse.mjs — "Equation Native" stream -> MTEF record tree.
// No guessing: anything not understood throws MtefError(reason, offset).

export class MtefError extends Error {
  constructor(reason, offset) {
    super(reason + ' @' + offset);
    this.reason = reason;
    this.offset = offset;
  }
}

export const REC = {
  END: 0, LINE: 1, CHAR: 2, TMPL: 3, PILE: 4, MATRIX: 5, EMBELL: 6, RULER: 7,
  FONT_STYLE_DEF: 8, SIZE: 9, FULL: 10, SUB: 11, SUB2: 12, SYM: 13, SUBSYM: 14,
  COLOR: 15, COLOR_DEF: 16, FONT_DEF: 17, EQN_PREFS: 18, ENCODING_DEF: 19,
};
export const REC_NAME = Object.fromEntries(Object.entries(REC).map(([k, v]) => [v, k]));
REC_NAME[102] = 'FUTURE102';

const OPT_NUDGE = 0x08;
const OPT_CHAR_EMBELL = 0x01;
const OPT_CHAR_FUNC_START = 0x02;
const OPT_CHAR_ENC_CHAR_8 = 0x04;
const OPT_CHAR_ENC_CHAR_16 = 0x10;
const OPT_CHAR_ENC_NO_MTCODE = 0x20;
const OPT_LINE_NULL = 0x01;
const OPT_LP_RULER = 0x02;
const OPT_LINE_LSPACE = 0x04;
const OPT_COLOR_CMYK = 0x01;
const OPT_COLOR_NAME = 0x04;

class Reader {
  constructor(buf, start, end) {
    this.buf = buf;
    this.pos = start;
    this.end = end;
  }
  need(n, what) {
    if (this.pos + n > this.end) throw new MtefError('unexpected end of data reading ' + what, this.pos);
  }
  u8(what = 'byte') {
    this.need(1, what);
    return this.buf[this.pos++];
  }
  u16(what = 'u16') {
    this.need(2, what);
    const v = this.buf.readUInt16LE(this.pos);
    this.pos += 2;
    return v;
  }
  i16(what = 'i16') {
    this.need(2, what);
    const v = this.buf.readInt16LE(this.pos);
    this.pos += 2;
    return v;
  }
  // MTEF "unsigned integer": 0..254 in one byte, else 0xFF + 16-bit
  uint(what = 'uint') {
    const b = this.u8(what);
    if (b < 255) return b;
    return this.u16(what);
  }
  cstr(what = 'string') {
    const s = this.pos;
    while (true) {
      this.need(1, what);
      if (this.buf[this.pos] === 0) break;
      this.pos++;
    }
    const str = this.buf.toString('latin1', s, this.pos);
    this.pos++;
    return str;
  }
}

function readNudge(r) {
  const dx = r.u8('nudge');
  const dy = r.u8('nudge');
  if (dx === 128 && dy === 128) return { dx: r.i16('nudge16'), dy: r.i16('nudge16') };
  return { dx: dx - 128, dy: dy - 128 };
}

function readDimArray(r) {
  // count byte, then a nibble stream (high nibble first); each entry = unit nibble + digits until 0xF
  const count = r.u8('dim count');
  const out = [];
  let cur = -1; // current byte
  let half = 0; // 0 = need new byte
  const nib = () => {
    if (half === 0) {
      cur = r.u8('dim nibble');
      half = 1;
      return cur >> 4;
    }
    half = 0;
    return cur & 0x0f;
  };
  const startOff = r.pos;
  for (let i = 0; i < count; i++) {
    const unit = nib();
    if (unit > 4) throw new MtefError('EQN_PREFS dimension unit nibble ' + unit + ' not in 0..4', r.pos - 1);
    let s = '';
    let guard = 0;
    while (true) {
      const n = nib();
      if (n === 0x0f) break;
      if (n <= 9) s += String(n);
      else if (n === 0x0a) s += '.';
      else if (n === 0x0b) s += '-';
      else throw new MtefError('EQN_PREFS dimension digit nibble ' + n, r.pos - 1);
      if (++guard > 32) throw new MtefError('EQN_PREFS dimension too long', startOff);
    }
    out.push({ unit, value: s });
  }
  return out;
}

export function parseEquationNative(stream) {
  const buf = Buffer.isBuffer(stream) ? stream : Buffer.from(stream);
  if (buf.length < 28) throw new MtefError('stream shorter than EQNOLEFILEHDR', 0);
  const cbHdr = buf.readUInt16LE(0);
  if (cbHdr !== 28) throw new MtefError('EQNOLEFILEHDR.cbHdr = ' + cbHdr + ' (expected 28)', 0);
  const hdr = {
    cbHdr,
    version: buf.readUInt32LE(2),
    cf: buf.readUInt16LE(6),
    cbObject: buf.readUInt32LE(8),
  };
  const start = 28;
  let end = start + hdr.cbObject;
  if (end > buf.length) throw new MtefError('cbObject ' + hdr.cbObject + ' exceeds stream length ' + buf.length, 8);
  let res = null;
  let errA = null;
  try {
    res = parseMTEF(buf, start, end, { rulerTagged: false });
  } catch (e) {
    if (!(e instanceof MtefError)) throw e;
    errA = e;
  }
  if (errA || res.ctx.embeddedRulers) {
    // An embedded RULER occurred (or the parse failed): also try the "tagged" reading.
    let resB = null;
    try {
      resB = parseMTEF(buf, start, end, { rulerTagged: true });
    } catch (e) {
      resB = null;
    }
    const clean = (x) => !!x && x.sawTopEnd && x.remainingBytes === 0;
    const bUsable = clean(resB) && resB.ctx.embeddedRulers > 0;
    if (errA) {
      if (!bUsable) throw errA;
      res = resB;
    } else if (clean(res) && bUsable) {
      throw new MtefError('embedded RULER ambiguous: tagged and tagless readings both parse cleanly', start);
    } else if (!clean(res) && bUsable) {
      res = resB;
    }
    res.rulerMode = res.ctx.rulerTagged ? 'tagged' : 'tagless';
  }
  res.oleHeader = hdr;
  res.streamLength = buf.length;
  res.trailingAfterCbObject = buf.length - end;
  return res;
}

export function parseMTEF(buf, start = 0, end = buf.length, opts = {}) {
  const r = new Reader(buf, start, end);
  const version = r.u8('MTEF version');
  if (version !== 5) throw new MtefError('MTEF version ' + version + ' not supported (only 5)', start);
  const header = {
    version,
    platform: r.u8('platform'),
    product: r.u8('product'),
    productVersion: r.u8('product version'),
    productSubversion: r.u8('product subversion'),
    appKey: r.cstr('application key'),
    eqnOptions: r.u8('equation options'),
  };
  const ctx = { fonts: [], encodings: [], fontStyles: [], colors: [], counts: {}, futures: [], embeddedRulers: 0, rulerTagged: !!opts.rulerTagged };
  const top = [];
  let sawTopEnd = false;
  while (r.pos < r.end) {
    const rec = parseRecord(r, ctx, 0);
    if (rec.type === REC.END) {
      sawTopEnd = true;
      break;
    }
    top.push(rec);
  }
  const remaining = buf.subarray(r.pos, r.end);
  return {
    header, ctx, top, sawTopEnd,
    endPos: r.pos - start,
    mtefLength: end - start,
    remainingBytes: remaining.length,
    remainingAllZero: remaining.every((b) => b === 0),
  };
}

function parseList(r, ctx, depth, what) {
  const out = [];
  while (true) {
    if (r.pos >= r.end) throw new MtefError('unexpected end of data inside ' + what + ' (missing END)', r.pos);
    const rec = parseRecord(r, ctx, depth);
    if (rec.type === REC.END) return out;
    out.push(rec);
  }
}

function parseRuler(r) {
  const n = r.u8('ruler n_stops');
  const stops = [];
  for (let i = 0; i < n; i++) stops.push({ type: r.u8('tab type'), offset: r.i16('tab offset') });
  return stops;
}

// RULER attached to a LINE/PILE. Observed in real MathType 7 data: written WITHOUT the tag byte 7
// (n_stops, then stops). ctx.rulerTagged selects the other reading; caller tries both.
function parseEmbeddedRuler(r, ctx, what) {
  ctx.embeddedRulers = (ctx.embeddedRulers || 0) + 1;
  if (ctx.rulerTagged) {
    const t = r.u8('ruler tag');
    if (t !== REC.RULER) throw new MtefError(what + ' with RULER option not followed by RULER tag (got ' + t + ')', r.pos - 1);
  }
  return parseRuler(r);
}

function parseRecord(r, ctx, depth) {
  if (depth > 200) throw new MtefError('nesting deeper than 200', r.pos);
  const offset = r.pos;
  const type = r.u8('record tag');
  ctx.counts[type] = (ctx.counts[type] || 0) + 1;
  switch (type) {
    case REC.END:
      return { type, offset };
    case REC.LINE: {
      const options = r.u8('LINE options');
      const rec = { type, offset, options, children: [] };
      if (options & ~(OPT_NUDGE | OPT_LINE_NULL | OPT_LP_RULER | OPT_LINE_LSPACE))
        throw new MtefError('LINE has undefined option bits 0x' + options.toString(16), offset);
      if (options & OPT_NUDGE) rec.nudge = readNudge(r);
      if (options & OPT_LINE_LSPACE) rec.lineSpacing = r.u16('line spacing');
      if (options & OPT_LP_RULER) rec.ruler = parseEmbeddedRuler(r, ctx, 'LINE');
      rec.isNull = !!(options & OPT_LINE_NULL);
      if (!rec.isNull) rec.children = parseList(r, ctx, depth + 1, 'LINE');
      return rec;
    }
    case REC.CHAR: {
      const options = r.u8('CHAR options');
      if (options & 0xc0) throw new MtefError('CHAR has undefined option bits 0x' + options.toString(16), offset);
      const rec = { type, offset, options };
      if (options & OPT_NUDGE) rec.nudge = readNudge(r);
      rec.typeface = r.u8('typeface') - 128;
      if (!(options & OPT_CHAR_ENC_NO_MTCODE)) rec.mtcode = r.u16('MTCode');
      if (options & OPT_CHAR_ENC_CHAR_8) rec.fontPos = r.u8('font pos 8');
      if (options & OPT_CHAR_ENC_CHAR_16) rec.fontPos = r.u16('font pos 16');
      rec.funcStart = !!(options & OPT_CHAR_FUNC_START);
      if (options & OPT_CHAR_EMBELL) {
        const list = parseList(r, ctx, depth + 1, 'embellishment list');
        // size / colour state records may be interleaved (observed: COLOR); anything else is not understood
        for (const e of list)
          if (e.type !== REC.EMBELL && !(e.type >= REC.SIZE && e.type <= REC.COLOR))
            throw new MtefError('non-EMBELL record ' + e.type + ' inside embellishment list', e.offset);
        rec.embells = list.filter((e) => e.type === REC.EMBELL);
      }
      return rec;
    }
    case REC.TMPL: {
      const options = r.u8('TMPL options');
      if (options & ~OPT_NUDGE) throw new MtefError('TMPL has undefined option bits 0x' + options.toString(16), offset);
      const rec = { type, offset, options };
      if (options & OPT_NUDGE) rec.nudge = readNudge(r);
      rec.selector = r.u8('selector');
      let v = r.u8('variation');
      if (v & 0x80) v = (v & 0x7f) | (r.u8('variation hi') << 8);
      rec.variation = v;
      rec.tmplOptions = r.u8('template options');
      rec.children = parseList(r, ctx, depth + 1, 'TMPL');
      return rec;
    }
    case REC.PILE: {
      const options = r.u8('PILE options');
      if (options & ~(OPT_NUDGE | OPT_LP_RULER)) throw new MtefError('PILE has undefined option bits 0x' + options.toString(16), offset);
      const rec = { type, offset, options };
      if (options & OPT_NUDGE) rec.nudge = readNudge(r);
      rec.halign = r.u8('halign');
      rec.valign = r.u8('valign');
      if (options & OPT_LP_RULER) rec.ruler = parseEmbeddedRuler(r, ctx, 'PILE');
      rec.children = parseList(r, ctx, depth + 1, 'PILE');
      return rec;
    }
    case REC.MATRIX: {
      const options = r.u8('MATRIX options');
      if (options & ~OPT_NUDGE) throw new MtefError('MATRIX has undefined option bits 0x' + options.toString(16), offset);
      const rec = { type, offset, options };
      if (options & OPT_NUDGE) rec.nudge = readNudge(r);
      rec.valign = r.u8('valign');
      rec.hJust = r.u8('h_just');
      rec.vJust = r.u8('v_just');
      rec.rows = r.u8('rows');
      rec.cols = r.u8('cols');
      const readParts = (n) => {
        const nb = Math.ceil(((n + 1) * 2) / 8);
        const parts = [];
        const bytes = [];
        for (let i = 0; i < nb; i++) bytes.push(r.u8('partition'));
        for (let i = 0; i <= n; i++) parts.push((bytes[i >> 2] >> ((i & 3) * 2)) & 3);
        return parts;
      };
      rec.rowParts = readParts(rec.rows);
      rec.colParts = readParts(rec.cols);
      rec.children = parseList(r, ctx, depth + 1, 'MATRIX');
      return rec;
    }
    case REC.EMBELL: {
      const options = r.u8('EMBELL options');
      if (options & ~OPT_NUDGE) throw new MtefError('EMBELL has undefined option bits 0x' + options.toString(16), offset);
      const rec = { type, offset, options };
      if (options & OPT_NUDGE) rec.nudge = readNudge(r);
      rec.embell = r.u8('embell type');
      return rec;
    }
    case REC.RULER:
      return { type, offset, stops: parseRuler(r) };
    case REC.FONT_STYLE_DEF: {
      const rec = { type, offset, fontDefIndex: r.uint('font_def_index'), charStyle: r.u8('char_style') };
      ctx.fontStyles.push(rec);
      return rec;
    }
    case REC.SIZE: {
      const b = r.u8('size lsize');
      if (b === 101) return { type, offset, pointSize: -r.i16('point size') };
      if (b === 100) return { type, offset, lsize: r.u8('lsize'), dsize: r.i16('dsize16') };
      return { type, offset, lsize: b, dsize: r.u8('dsize') - 128 };
    }
    case REC.FULL:
    case REC.SUB:
    case REC.SUB2:
    case REC.SYM:
    case REC.SUBSYM:
      return { type, offset };
    case REC.COLOR:
      return { type, offset, colorDefIndex: r.uint('color_def_index') };
    case REC.COLOR_DEF: {
      const options = r.u8('COLOR_DEF options');
      const n = options & OPT_COLOR_CMYK ? 4 : 3;
      const values = [];
      for (let i = 0; i < n; i++) values.push(r.u16('color value'));
      const rec = { type, offset, options, values };
      if (options & OPT_COLOR_NAME) rec.name = r.cstr('color name');
      ctx.colors.push(rec);
      return rec;
    }
    case REC.FONT_DEF: {
      const rec = { type, offset, encDefIndex: r.uint('enc_def_index'), name: r.cstr('font name') };
      ctx.fonts.push(rec);
      return rec;
    }
    case REC.EQN_PREFS: {
      const options = r.u8('EQN_PREFS options');
      const sizes = readDimArray(r);
      const spaces = readDimArray(r);
      const nStyles = r.u8('style count');
      const styles = [];
      for (let i = 0; i < nStyles; i++) {
        const fontDef = r.u8('style font_def');
        if (fontDef === 0) styles.push({ fontDef: 0 });
        else styles.push({ fontDef, charStyle: r.u8('style char_style') });
      }
      return { type, offset, options, sizes, spaces, styles };
    }
    case REC.ENCODING_DEF: {
      const rec = { type, offset, name: r.cstr('encoding name') };
      ctx.encodings.push(rec);
      return rec;
    }
    default:
      if (type >= 100) {
        // FUTURE record: tag, unsigned-int length, payload. Spec says these are skippable by length.
        // We accept only the one payload we positively recognise; anything else = FAILED.
        const len = r.uint('future length');
        r.need(len, 'future payload');
        const payload = r.buf.subarray(r.pos, r.pos + len);
        r.pos += len;
        const KEY = 'TeX Input Language';
        if (
          type === 102 &&
          payload.length > KEY.length + 1 &&
          payload.toString('latin1', 0, KEY.length) === KEY &&
          payload[KEY.length] === 0 &&
          payload[payload.length - 1] === 0
        ) {
          const tex = payload.subarray(KEY.length + 1, payload.length - 1);
          const rec = { type, offset, future: { name: KEY, tex: tex.toString('utf8'), texHex: tex.toString('hex') } };
          ctx.futures.push(rec);
          return rec;
        }
        throw new MtefError('FUTURE record type ' + type + ' len ' + len + ' (content not recognised)', offset);
      }
      throw new MtefError('unknown record type ' + type, offset);
  }
}
