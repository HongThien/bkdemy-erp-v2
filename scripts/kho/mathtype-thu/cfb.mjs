// cfb.mjs — minimal OLE Compound File (CFB / MS-CFB) reader.
// Supports: header, DIFAT, FAT, directory, mini-FAT + mini-stream. Read-only.

const SIG = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const ENDOFCHAIN = 0xfffffffe;
const FREESECT = 0xffffffff;

export class CfbError extends Error {}

export function parseCFB(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  if (buf.length < 512) throw new CfbError('file shorter than 512 bytes');
  if (!buf.subarray(0, 8).equals(SIG)) throw new CfbError('bad CFB signature');

  const major = buf.readUInt16LE(0x1a);
  const sectorShift = buf.readUInt16LE(0x1e);
  const miniShift = buf.readUInt16LE(0x20);
  if (sectorShift !== 9 && sectorShift !== 12) throw new CfbError('unexpected sector shift ' + sectorShift);
  const ssz = 1 << sectorShift;
  const msz = 1 << miniShift;
  const nFatSectors = buf.readUInt32LE(0x2c);
  const dirStart = buf.readUInt32LE(0x30);
  const miniCutoff = buf.readUInt32LE(0x38);
  const miniFatStart = buf.readUInt32LE(0x3c);
  const nMiniFat = buf.readUInt32LE(0x40);
  const difatStart = buf.readUInt32LE(0x44);
  const nDifat = buf.readUInt32LE(0x48);

  const maxSectors = Math.ceil(buf.length / ssz) + 1;

  function readSector(n) {
    const off = (n + 1) * ssz;
    if (off >= buf.length) throw new CfbError('sector ' + n + ' beyond end of file');
    const s = buf.subarray(off, Math.min(off + ssz, buf.length));
    if (s.length === ssz) return s;
    const padded = Buffer.alloc(ssz); // truncated last sector
    s.copy(padded);
    return padded;
  }

  // --- DIFAT -> list of FAT sector numbers
  const fatSectors = [];
  for (let i = 0; i < 109; i++) {
    const v = buf.readUInt32LE(0x4c + i * 4);
    if (v !== FREESECT && v !== ENDOFCHAIN) fatSectors.push(v);
  }
  {
    let s = difatStart;
    let guard = 0;
    while (s !== ENDOFCHAIN && s !== FREESECT && guard++ < nDifat + 4) {
      const sec = readSector(s);
      const per = ssz / 4 - 1;
      for (let i = 0; i < per; i++) {
        const v = sec.readUInt32LE(i * 4);
        if (v !== FREESECT && v !== ENDOFCHAIN) fatSectors.push(v);
      }
      s = sec.readUInt32LE(per * 4);
    }
  }
  if (fatSectors.length < nFatSectors) throw new CfbError('DIFAT lists fewer FAT sectors than header says');

  // --- FAT
  const fat = new Uint32Array(nFatSectors * (ssz / 4));
  for (let i = 0; i < nFatSectors; i++) {
    const sec = readSector(fatSectors[i]);
    for (let j = 0; j < ssz / 4; j++) fat[i * (ssz / 4) + j] = sec.readUInt32LE(j * 4);
  }

  function chain(start, table, limit) {
    const out = [];
    let s = start;
    while (s !== ENDOFCHAIN && s !== FREESECT) {
      if (s >= table.length) throw new CfbError('chain points outside table: ' + s);
      out.push(s);
      if (out.length > limit) throw new CfbError('chain loop / too long');
      s = table[s];
    }
    return out;
  }

  function readChainFat(start, size) {
    const secs = chain(start, fat, maxSectors);
    const b = Buffer.concat(secs.map(readSector));
    return size == null ? b : b.subarray(0, size);
  }

  // --- directory
  const dirBuf = readChainFat(dirStart, null);
  const entries = [];
  for (let off = 0; off + 128 <= dirBuf.length; off += 128) {
    const type = dirBuf[off + 0x42];
    if (type === 0) continue; // unused
    const nameLen = dirBuf.readUInt16LE(off + 0x40);
    const name = nameLen >= 2 ? dirBuf.toString('utf16le', off, off + nameLen - 2) : '';
    const start = dirBuf.readUInt32LE(off + 0x74);
    const sizeLo = dirBuf.readUInt32LE(off + 0x78);
    const sizeHi = major >= 4 ? dirBuf.readUInt32LE(off + 0x7c) : 0;
    if (sizeHi !== 0) throw new CfbError('stream larger than 4GB not supported');
    const clsid = dirBuf.subarray(off + 0x50, off + 0x60).toString('hex');
    entries.push({ index: off / 128, name, type, start, size: sizeLo, clsid });
  }
  const root = entries.find((e) => e.type === 5);
  if (!root) throw new CfbError('no root entry');

  // --- mini FAT + mini stream (lazy)
  let miniFat = null;
  let miniStream = null;
  function loadMini() {
    if (miniFat) return;
    if (nMiniFat === 0 || miniFatStart === ENDOFCHAIN) {
      miniFat = new Uint32Array(0);
      miniStream = Buffer.alloc(0);
      return;
    }
    const mfBuf = readChainFat(miniFatStart, null);
    miniFat = new Uint32Array(mfBuf.length / 4);
    for (let i = 0; i < miniFat.length; i++) miniFat[i] = mfBuf.readUInt32LE(i * 4);
    miniStream = readChainFat(root.start, root.size);
  }

  function readEntry(e) {
    if (e.type !== 2) throw new CfbError('not a stream: ' + e.name);
    if (e.size === 0) return Buffer.alloc(0);
    if (e.size < miniCutoff) {
      loadMini();
      const secs = chain(e.start, miniFat, miniFat.length + 1);
      const parts = secs.map((s) => {
        const off = s * msz;
        if (off + msz > miniStream.length) {
          const p = Buffer.alloc(msz);
          miniStream.copy(p, 0, off, Math.min(off + msz, miniStream.length));
          return p;
        }
        return miniStream.subarray(off, off + msz);
      });
      const b = Buffer.concat(parts);
      if (b.length < e.size) throw new CfbError('mini stream chain shorter than declared size');
      return b.subarray(0, e.size);
    }
    const b = readChainFat(e.start, null);
    if (b.length < e.size) throw new CfbError('stream chain shorter than declared size');
    return b.subarray(0, e.size);
  }

  return {
    major,
    sectorSize: ssz,
    entries,
    rootClsid: root.clsid,
    getStream(name) {
      const e = entries.find((x) => x.type === 2 && x.name === name);
      return e ? readEntry(e) : null;
    },
  };
}
