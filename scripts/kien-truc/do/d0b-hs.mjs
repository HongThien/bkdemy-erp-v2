// Do thi import tu main-hs.tsx → tap file trong bundle app HS; doi chieu voi ham INVOKER cham view / bang se siet.
import fs from 'fs'; import path from 'path';
const S = process.env.SCR, OLD = process.env.OLD;
const fns = JSON.parse(fs.readFileSync(S + '/d0b-fns.json', 'utf8'));
const has = (s, n) => new RegExp('(^|[^a-z0-9_])' + n + '([^a-z0-9_]|$)').test(s || '');
const norm = p => p.replace(/\\/g, '/');
const resolve = (from, spec) => { if (!spec.startsWith('.')) return null; const base = path.resolve(path.dirname(from), spec); for (const c of [base, base + '.ts', base + '.tsx', base + '.js', base + '.mjs', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) if (fs.existsSync(c) && fs.statSync(c).isFile()) return norm(path.relative('.', c)); return null; };
const bundle = entry => { const seen = new Set(); const st = [entry]; while (st.length) { const f = st.pop(); if (seen.has(f) || !fs.existsSync(f)) continue; seen.add(f); const t = fs.readFileSync(f, 'utf8'); for (const m of t.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g)) { const r = resolve(f, m[1]); if (r) st.push(r); } } return seen; };
const HS = bundle('src/main-hs.tsx');
const all = []; const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = norm(path.join(d, e.name)); if (e.isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(e.name)) all.push(p); } }; walk('src');
console.log('file src:', all.length, '| trong bundle app HS:', HS.size, '| chi nhan su:', all.filter(f => !HS.has(f)).length);
const text = Object.fromEntries(all.map(f => [f, fs.readFileSync(f, 'utf8')]));
const hsText = [...HS].filter(f => text[f]).map(f => text[f]).join('\n');
const nsOnlyText = all.filter(f => !HS.has(f)).map(f => text[f]).join('\n');
const tok = s => new Set(s.match(/[a-z_][a-z0-9_]{2,}/g) || []);
const tHS = tok(hsText), tNS = tok(nsOnlyText);
const by = {}; for (const f of fns) (by[f.proname] ??= []).push(f);
const VIEWS = ['qlht_v_so_du_xu', 'qlht_v_ton_qua', 'v_hinh_chua_giai', 'v_giaibai_nhan', 'v_giaibai_bai', 'v_giaibai_hoan_thien', 'hinh_hoc_ban_do', 'bdm_ban_do', 'bdm_cau_dang', 'bdm_cau_hoi', 'bdm_cau_form_tn', 'bdm_cau_menh_de', 'bdm_dang_ly_thuyet', 'bdm_ban_do_toan', 'bdm_ban_do_hgt', 'tl_bdm_chu_de_v', 'tl_bdm_chuyen_de_v', 'tl_bdm_o_v', 'tl_bdm_nhom_v', 'tl_bdm_dang_bai_v'];
const TBL = ['dai_cau_menh_de', 'hgt_cau_menh_de', 'toan_de_thi', 'toan_de_thi_cau', 'nhap_kho_log'];
const DICH = [...VIEWS, ...TBL];
// ham INVOKER cham truc tiep doi tuong dich
const cham = n => DICH.filter(d => by[n].some(f => !f.secdef && has(f.src, d)));
// ham nao (bat ky) co the tra ve TEN view de SQL dong dung: _kho_*_tbl, _sotay_bang…
const names = Object.keys(by);
const invCallees = n => names.filter(m => m !== n && by[n].some(f => !f.secdef && has(f.src, m)));
const memo = {};
const reach = (n, depth = 0) => { if (memo[n]) return memo[n]; memo[n] = new Set(); const out = new Set(cham(n)); if (by[n].every(f => f.secdef)) return (memo[n] = out); if (depth < 12) for (const m of invCallees(n)) { if (by[m].every(f => f.secdef)) continue; for (const x of reach(m, depth + 1)) out.add(x); } return (memo[n] = out); };
const hsFns = names.filter(n => tHS.has(n) && by[n].some(f => f.auth_x));
const flagged = hsFns.filter(n => by[n].some(f => !f.secdef)).map(n => [n, [...reach(n)]]).filter(([, r]) => r.length);
console.log('\nham xuat hien trong bundle HS:', hsFns.length, '| trong do INVOKER:', hsFns.filter(n => by[n].some(f => !f.secdef)).length);
console.log('## ham INVOKER trong bundle HS co duong (toan invoker) cham view/bang se siet:', flagged.length);
for (const [n, r] of flagged) { const files = [...HS].filter(f => text[f] && has(text[f], n)); console.log('- ' + n + (tNS.has(n) ? ' (nhan su cung dung)' : ' (CHI bundle HS)') + ' → ' + r.join(', ') + '\n     o: ' + files.slice(0, 4).join(', ')); }
console.log('\n## .from(view/bang) truc tiep trong file bundle HS:');
for (const d of DICH) { const fl = [...HS].filter(f => text[f] && new RegExp("from\\(\\s*['\"`]" + d + "['\"`]").test(text[f])); const dyn = [...HS].filter(f => text[f] && new RegExp("['\"`]" + d + "['\"`]").test(text[f]) && !fl.includes(f)); if (fl.length || dyn.length) console.log('- ' + d + ' | from(): ' + (fl.join(', ') || '—') + ' | ten xuat hien (registry?): ' + (dyn.join(', ') || '—')); }
console.log('\n## storage trong bundle HS:'); for (const f of [...HS]) { const t = text[f]; if (!t) continue; const m = [...t.matchAll(/storage\s*\.from\(\s*([^)]+)\)\s*\.\s*([a-zA-Z]+)/g)].map(x => x[1].trim() + '.' + x[2]); if (m.length) console.log('- ' + f + ': ' + [...new Set(m)].join(' ')); }
// ---- ham authenticated khong cong (danh sach cua luot ra truoc)
const none = fs.readFileSync(OLD + '/none.out', 'utf8').split(/\r?\n/);
let sec = ''; const ds = [];
for (const l of none) { if (l.startsWith('####')) { sec = l; continue; } const m = l.match(/^([RW]) -- ([a-z0-9_]+)\(/); if (m && /authenticated|auth/i.test(sec)) ds.push({ rw: m[1], n: m[2] }); }
console.log('\n## ham secdef KHONG cong, authenticated goi duoc:', ds.length, '(dau muc: ' + none.filter(l => l.startsWith('####')).join(' | ') + ')');
for (const { rw, n } of ds) { if (!by[n]) { console.log(`  ${rw} ${n} — khong con`); continue; } if (!by[n].some(f => f.auth_x)) continue;
  const callers = names.filter(m => m !== n && by[m].some(f => has(f.src, n)));
  const invCallers = callers.filter(m => by[m].some(f => !f.secdef));
  console.log(`  ${rw} ${n} | client: ${tHS.has(n) ? 'HS' : ''}${tNS.has(n) ? ' NS' : ''}${!tHS.has(n) && !tNS.has(n) ? '—' : ''} | goi boi ${callers.length} ham (invoker: ${invCallers.slice(0, 4).join(',') || '—'})${by[n].some(f => f.ret === 'trigger') ? ' {trg}' : ''}`); }
