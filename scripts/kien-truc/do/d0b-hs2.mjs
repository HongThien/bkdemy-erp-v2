// Tinh "export nao cua src/lib thuc su duoc app HS dung" (muc export, khong phai muc file), roi xem export do cham gi.
import fs from 'fs'; import path from 'path';
const S = process.env.SCR;
const fns = JSON.parse(fs.readFileSync(S + '/d0b-fns.json', 'utf8'));
const by = {}; for (const f of fns) (by[f.proname] ??= []).push(f);
const has = (s, n) => new RegExp('(^|[^A-Za-z0-9_])' + n + '([^A-Za-z0-9_]|$)').test(s || '');
const norm = p => p.replace(/\\/g, '/');
const resolve = (from, spec) => { if (!spec.startsWith('.')) return null; const base = path.resolve(path.dirname(from), spec); for (const c of [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) if (fs.existsSync(c) && fs.statSync(c).isFile()) return norm(path.relative('.', c)); return null; };
const T = {}; const txt = f => (T[f] ??= fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
const laLib = f => f.startsWith('src/lib/');
// imports cua 1 file: [{file, names:Set|'*'}]
const imports = f => { const out = []; const t = txt(f);
  for (const m of t.matchAll(/import\s+(type\s+)?([^;'"]*?)\s+from\s+['"]([^'"]+)['"]/g)) { const r = resolve(f, m[3]); if (!r) continue; const spec = m[2]; let names = new Set();
    if (/\*\s+as\s+/.test(spec)) names = '*'; else { const b = spec.match(/\{([^}]*)\}/); if (b) for (const p of b[1].split(',')) { const n = p.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim(); if (n) names.add(n); } const d = spec.replace(/\{[^}]*\}/, '').replace(/,/g, '').trim(); if (d) names.add('default'); }
    out.push({ file: r, names }); }
  for (const m of t.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) { const r = resolve(f, m[1]); if (r) out.push({ file: r, names: '*' }); }
  for (const m of t.matchAll(/import\s+['"]([^'"]+)['"]/g)) { const r = resolve(f, m[1]); if (r) out.push({ file: r, names: '*' }); }
  for (const m of t.matchAll(/export\s+(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g)) { const r = resolve(f, m[1]); if (r) out.push({ file: r, names: '*' }); }
  return out; };
// tach lib thanh cac khoi export
const blocks = f => { const t = txt(f); const idx = [...t.matchAll(/^export\s+(?:default\s+)?(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z0-9_$]+)/gm)].map(m => ({ name: m[1], at: m.index })); return idx.map((b, i) => ({ name: b.name, body: t.slice(b.at, i + 1 < idx.length ? idx[i + 1].at : t.length) })); };
const B = {}; const blk = f => (B[f] ??= blocks(f));
const usedFiles = new Set(); const usedExp = {}; // file -> Set(names) | '*'
const q = [];
const useFile = f => { if (usedFiles.has(f)) return; usedFiles.add(f); q.push({ kind: 'file', f }); };
const useExp = (f, n) => { if (!laLib(f)) { useFile(f); return; } const s = (usedExp[f] ??= new Set()); if (s.has(n)) return; s.add(n); q.push({ kind: 'exp', f, n }); };
const entry = process.argv[2] || 'src/main-hs.tsx';
useFile(entry);
while (q.length) { const it = q.pop();
  if (it.kind === 'file') { for (const im of imports(it.f)) { if (!laLib(im.file)) useFile(im.file); else if (im.names === '*') for (const b of blk(im.file)) useExp(im.file, b.name); else for (const n of im.names) useExp(im.file, n); } }
  else { const b = blk(it.f).find(x => x.name === it.n); if (!b) continue;
    for (const o of blk(it.f)) if (o.name !== it.n && has(b.body, o.name)) useExp(it.f, o.name);          // goi export khac cung file
    for (const im of imports(it.f)) { const cand = im.names === '*' ? blk(im.file).map(x => x.name) : [...im.names]; for (const n of cand) if (has(b.body, n)) useExp(im.file, n); }
    // ham/const KHONG export trong cung file ma khoi nay goi: gop than cua no vao (1 tang)
  } }
// than "mo rong" cua export: gom ca helper khong-export cung file ma no nhac toi
const helpers = f => { const t = txt(f); return [...t.matchAll(/^(?:async\s+)?(?:function\*?|const|let)\s+([A-Za-z0-9_$]+)[\s\S]*?(?=^(?:export\s+)?(?:async\s+)?(?:function\*?|const|let|class|type|interface)\s|\Z)/gm)].map(m => ({ name: m[1], body: m[0] })); };
const H = {}; const hp = f => (H[f] ??= helpers(f));
const fullBody = (f, n) => { const b = blk(f).find(x => x.name === n); if (!b) return ''; let s = b.body; const seen = new Set(); let add = true; while (add) { add = false; for (const h of hp(f)) if (!seen.has(h.name) && has(s, h.name)) { seen.add(h.name); s += '\n' + h.body; add = true; } } return s; };
const nExp = Object.values(usedExp).reduce((a, s) => a + s.size, 0);
console.log('entry', entry, '| file ngoai lib duoc dung:', [...usedFiles].filter(f => !laLib(f)).length, '| export lib duoc dung:', nExp, 'tren', Object.keys(usedExp).length, 'file lib');
const DICH = ['qlht_v_so_du_xu', 'qlht_v_ton_qua', 'v_hinh_chua_giai', 'v_giaibai_nhan', 'v_giaibai_bai', 'v_giaibai_hoan_thien', 'hinh_hoc_ban_do', 'bdm_ban_do', 'bdm_cau_dang', 'bdm_cau_hoi', 'bdm_cau_form_tn', 'bdm_cau_menh_de', 'bdm_dang_ly_thuyet', 'bdm_ban_do_toan', 'bdm_ban_do_hgt', 'tl_bdm_chu_de_v', 'tl_bdm_chuyen_de_v', 'tl_bdm_o_v', 'tl_bdm_nhom_v', 'tl_bdm_dang_bai_v', 'dai_cau_menh_de', 'hgt_cau_menh_de', 'toan_de_thi', 'toan_de_thi_cau', 'nhap_kho_log'];
const names = Object.keys(by);
const chamTrucTiep = n => DICH.filter(d => by[n].some(f => !f.secdef && has(f.src, d)));
const memo = {}; const reach = (n, dp = 0) => { if (memo[n]) return memo[n]; memo[n] = new Set(); const out = new Set(chamTrucTiep(n)); if (dp < 12) for (const m of names) if (m !== n && by[n].some(f => !f.secdef && has(f.src, m)) && by[m].some(f => !f.secdef)) for (const x of reach(m, dp + 1)) out.add(x); return (memo[n] = out); };
const rows = [];
const scan = (noi, body) => {
  if (body.includes('khoCuaMon(') && !noi.endsWith(':: khoCuaMon')) rows.push([noi, 'GOI khoCuaMon(...)']);
  { const b2 = body.split('Array.from').join(''); const ms = [...b2.matchAll(/[.]from[(]\s*([a-zA-Z_][a-zA-Z0-9_.]*)\s*[)]/g)].map(m => m[1]).filter(x => x !== 'supabase'); if (ms.length) rows.push([noi, 'from(BIEN): ' + [...new Set(ms)].join(',')]); }
  for (const d of DICH) if (new RegExp("['\"`]" + d + "['\"`]").test(body)) rows.push([noi, 'ten bang/view: ' + d]);
  for (const m of body.matchAll(/rpc\(\s*['"`]([a-z0-9_]+)['"`]/g)) { const n = m[1]; if (!by[n] || by[n].every(f => f.secdef)) continue; const r = [...reach(n)]; if (r.length) rows.push([noi, 'rpc INVOKER ' + n + ' → ' + r.join(',')]); }
  for (const m of body.matchAll(/storage\s*\.from\(\s*([^)]+)\)\s*\.\s*(upload|remove|update|move|copy)/g)) rows.push([noi, 'storage ' + m[1].trim() + '.' + m[2]]);
};
for (const [f, s] of Object.entries(usedExp)) for (const n of s) scan(f + ' :: ' + n, fullBody(f, n));
for (const f of usedFiles) if (!laLib(f)) scan(f, txt(f));
console.log('\n## app HS THUC SU cham (qua export dang dung):', rows.length);
for (const [a, b] of rows) console.log('- ' + a + '  ⇒  ' + b);

// --- luot 2: theo TEN ham (bat ca cach goi gian tiep), chi ham INVOKER co duong cham view
const X2 = names.filter(n => by[n].some(f => !f.secdef) && reach(n).size);
const hit = [];
for (const [f, s] of Object.entries(usedExp)) for (const n of s) { const b = fullBody(f, n); for (const x of X2) if (has(b, x)) hit.push([f + ' :: ' + n, x]); }
for (const f of usedFiles) if (!laLib(f)) { const b = txt(f); for (const x of X2) if (has(b, x)) hit.push([f, x]); }
console.log('\n## luot 2 — ten ham X xuat hien trong phan app HS dung:', hit.length);
for (const [a, x] of hit) console.log('- ' + a + '  ⇒  ' + x + ' → ' + [...reach(x)].join(','));
