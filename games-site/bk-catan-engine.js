/* BK Catan — ENGINE LUẬT (hàm thuần, không DOM, không mạng). Spec: spec-game-catan.md (v0.3 + mô phỏng lần 4).
   TV giữ state gốc, gọi ENG.reduce(st, action) → {st, events} | {error}. iPad chỉ gửi action.
   Dùng được cả trình duyệt (window.BKCATAN) lẫn Node (module.exports) để test tự động. */
(function (root) {
'use strict';

const RES = ['go', 'gach', 'lua', 'cuu', 'quang'];
const RES_ALL = [...RES, 'vang'];
const RES_NAME = { go: 'Gỗ', gach: 'Gạch', lua: 'Lúa', cuu: 'Cừu', quang: 'Quặng', vang: 'Vàng' };
const RES_IC = { go: '🌲', gach: '🧱', lua: '🌾', cuu: '🐑', quang: '⛏️', vang: '🪙' };
const UNIT = [
  { id: 0, ten: 'Bộ binh', ic: '🛡️' },
  { id: 1, ten: 'Cung thủ', ic: '🏹' },
  { id: 2, ten: 'Kỵ binh', ic: '🐎' },
];
// quái: chỉ số = loại lính khắc nó
const QUAI = [
  { ten: 'Sói cưỡi', ic: '🐺', yeu: 0 },
  { ten: 'Người đá', ic: '🗿', yeu: 1 },
  { ten: 'Yêu tinh cung', ic: '👺', yeu: 2 },
];
const PIPS = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };

const CFG = {
  soLuot: 25, timer: 90,
  bidong: { 1: 48, 2: 36, 3: 24, 4: 16, 5: 8 },
  baySo: 150,
  cost: {
    duong: { go: 100, gach: 100 },
    nha: { go: 100, gach: 100, lua: 100, cuu: 100 },
    len: [null,
      { lua: 200, quang: 300 },
      { lua: 300, quang: 300, gach: 200, go: 200 },
      { lua: 300, quang: 400, gach: 200, go: 200, vang: 100 },
      { lua: 400, quang: 500, gach: 300, go: 300, vang: 200 }],
    the: [null, { lua: 100, cuu: 100, quang: 100 }, { lua: 200, cuu: 200, quang: 200 }, { lua: 300, cuu: 300, quang: 300, vang: 100 }],
    linh: [{ lua: 100, quang: 100 }, { go: 100, lua: 100 }, { lua: 100, cuu: 100, quang: 50 }],
    bac: [null, null, { lua: 200, quang: 200, go: 200 }, { lua: 300, quang: 300, go: 300, vang: 100 }],
  },
  diemCap: [0, 100, 200, 300, 450, 600],
  heSoDoThi: [0, 1, 2, 2.5, 3, 3.5],
  heSoChuyen: [0, 1, 2.5, 3.5, 4.5, 5.5],
  heSoChuyenKhac: [0, 1, 1.5, 1.75, 2, 2.25],
  nuoi: [0, 2, 3, 4, 5, 6],
  bacMult: [0, 1, 1.4, 1.8], bacCanNha: [0, 1, 2, 3],
  giaTang: 0.15, nhaTang: 0.1, luong: 10, duongDaiNhat: 200, // lính / nhà mới đắt hơn cái cũ (CEO 24/09)
  kp: {
    1: { E: 50, tran: 5, K: { res: 700, vang: 50, cc: 175 } },     // chiến công ×1.75 cho bàn 51 ô (mô phỏng lần 6)
    2: { E: 200, tran: 8, K: { res: 2000, vang: 300, cc: 875 } },
    3: { E: 400, tran: 12, K: { res: 2000, vang: 800, cc: 1750 } },
  },
  heSoLinh: 10, khac: 1.25, biKhac: 0.75,
  g: [0, 1, 1.8, 2.4, 2.8, 3.2, 3.5, 3.8, 4.0],
  hoi: 2, xsCap2: 0.35, xsChien: 0.4, mu: 1.5, tranThietHai: 0.6, thuongThang: 0.1,
  phaHoai: { nhe: { mult: 0.5, luot: 3 }, manh: { mult: 0.25, luot: 4 } }, khien: 3,
};

// ---------- RNG (lưu trong state để TV nạp lại ván vẫn đúng) ----------
function rng(st) { let s = st.rng | 0; s = s + 0x6D2B79F5 | 0; st.rng = s; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
function mkRng(seed) { const o = { rng: seed | 0 }; return () => rng(o); }

// ---------- Bản đồ (hình học + địa hình suy từ seed → mọi máy tự dựng được) ----------
const MAPS = {};
function buildMap(seed) {
  if (MAPS[seed]) return MAPS[seed];
  const R = mkRng(seed ^ 0x5bd1e995);
  const hexes = [], V = new Map(), E = new Map();
  const vkey = (x, y) => `${Math.round(x * 1000) + 0},${Math.round(y * 1000) + 0}`;
  // Bàn "lục giác dẹt" cho TV (CEO 24/09): 7 hàng, hàng giữa 9 ô, lệch 1 hàng ngắn 1 ô → 51 ô (44 đất + 7 khám phá).
  // 7 ô khám phá rải đều: tâm (cấp 3 cố định) + 6 ô quanh cách tâm 3 ô (mỗi lần xuất hiện ngẫu nhiên cấp 1–2).
  const ZONES = ['0,0', '3,0', '-3,0', '1,2', '-3,2', '3,-2', '-1,-2'];
  for (let r = -3; r <= 3; r++) {
    const L = 9 - Math.abs(r), q0 = -(L - 1) / 2 - r / 2;
    for (let k = 0; k < L; k++) {
    const q = q0 + k;
    const dist = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
    const x = Math.sqrt(3) * (q + r / 2), y = 1.5 * r;
    const zi = ZONES.indexOf(q + ',' + r);
    const h = { id: hexes.length, q, r, x, y, dist, zone: zi >= 0, center: zi === 0, corners: [] };
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 30), vx = x + Math.cos(a), vy = y + Math.sin(a), k = vkey(vx, vy);
      if (!V.has(k)) V.set(k, { id: V.size, x: vx, y: vy, hexes: [], adj: [], edges: [] });
      V.get(k).hexes.push(h.id); h.corners.push(V.get(k).id);
    }
    hexes.push(h);
  } }
  const verts = [...V.values()];
  for (const h of hexes) for (let i = 0; i < 6; i++) {
    const a = h.corners[i], b = h.corners[(i + 1) % 6], k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!E.has(k)) { const e = { id: E.size, a: Math.min(a, b), b: Math.max(a, b), hexes: [] }; E.set(k, e); verts[a].adj.push(b); verts[b].adj.push(a); verts[a].edges.push(e.id); verts[b].edges.push(e.id); }
    E.get(k).hexes.push(h.id);
  }
  const edges = [...E.values()];
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const land = hexes.filter(h => !h.zone);
  // địa hình: chia đều 5 loại cho số ô đất; số: bộ 18 lá Catan lặp lại, không để 6/8 kề nhau (thử lại tối đa 400 lần)
  const nL = hexes.filter(h => !h.zone).length;
  const resList = shuffle(Array.from({ length: nL }, (_, i) => RES[i % 5]));
  land.forEach((h, i) => { h.res = resList[i]; });
  const nb = (a, b) => { const dq = a.q - b.q, dr = a.r - b.r; return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr)) === 1; };
  const BASE = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12], EXTRA = [3, 11, 4, 10, 5, 9];
  const numPool = []; for (let i = 0; numPool.length < nL; i++) numPool.push(i < BASE.length * Math.floor(nL / 18) ? BASE[i % 18] : EXTRA[(i - BASE.length * Math.floor(nL / 18)) % EXTRA.length]);
  // xếp số rồi SỬA: ô 6/8 nào kề ô 6/8 khác thì đổi số với 1 ô thường không kề ô 6/8 nào (bàn to: thử-lại-ngẫu-nhiên không hội tụ)
  const nums = shuffle(numPool.slice());
  land.forEach((h, i) => { h.num = nums[i]; h.pips = PIPS[h.num]; });
  const isHot = h => h.pips === 5, hotNb = h => land.some(o => o !== h && isHot(o) && nb(o, h));
  for (let guard = 0; guard < 500; guard++) {
    const bad = land.find(h => isHot(h) && hotNb(h)); if (!bad) break;
    const cands = land.filter(o => !isHot(o) && !land.some(x => x !== o && x !== bad && isHot(x) && nb(x, o)));
    if (!cands.length) break;
    const o = cands[Math.floor(R() * cands.length)];
    [bad.num, o.num] = [o.num, bad.num]; bad.pips = PIPS[bad.num]; o.pips = PIPS[o.num];
  }
  hexes.filter(h => h.zone).forEach(h => { h.tier = h.center ? 3 : 1; }); // cấp thật nằm trong st.zone (ô thường đổi 1–2 mỗi lần xuất hiện)
  // cảng: 10 cạnh ngoài cùng, chia đều theo góc
  const outer = edges.filter(e => e.hexes.length === 1)
    .map(e => ({ e, ang: Math.atan2((verts[e.a].y + verts[e.b].y) / 2, (verts[e.a].x + verts[e.b].x) / 2) }))
    .sort((a, b) => a.ang - b.ang);
  const portKinds = shuffle(['go', 'gach', 'lua', 'cuu', 'quang', '*', '*', '*', '*', '*']), NP = portKinds.length;
  const ports = [];
  for (let k = 0; k < NP; k++) {
    const { e } = outer[Math.floor(k * outer.length / NP + outer.length / (2 * NP)) % outer.length];
    const kind = portKinds[k];
    ports.push({ edge: e.id, kind, rate: kind === '*' ? 3 : 2 });
    verts[e.a].port = verts[e.b].port = kind;
  }
  for (const v of verts) v.zoneTiles = v.hexes.filter(i => hexes[i].zone);
  return (MAPS[seed] = { hexes, verts, edges, ports });
}

// ---------- Tiện ích state ----------
const M = st => buildMap(st.mapSeed);
const clone = o => JSON.parse(JSON.stringify(o));
const sumUnits = p => p.linh[0] + p.linh[1] + p.linh[2];
const pOf = (st, slot) => st.players.findIndex(p => p.slot === slot);
const houses = (st, pi) => st.vOwner.map((o, i) => o === pi ? i : -1).filter(i => i >= 0);
function heSo(cap, branch, res) {
  if (cap <= 1 || !branch || branch === 'dothi') return CFG.heSoDoThi[cap] || 1;
  return branch === res ? CFG.heSoChuyen[cap] : CFG.heSoChuyenKhac[cap];
}
function coTheTra(p, cost) { for (const r of RES_ALL) if ((cost[r] || 0) > p.res[r] + 1e-9) return false; return true; }
function tra(p, cost) { for (const r of RES_ALL) p.res[r] -= cost[r] || 0; }
function hoan(p, cost) { for (const r of RES_ALL) p.res[r] += cost[r] || 0; }
function scale(cost, k) { const o = {}; for (const r in cost) o[r] = Math.round(cost[r] * k); return o; }
function thieu(p, cost) { return RES_ALL.filter(r => (cost[r] || 0) > p.res[r] + 1e-9).map(r => `${RES_NAME[r]} ${Math.ceil(cost[r] - p.res[r])}`).join(', '); }

function supply(st, pi) { return houses(st, pi).reduce((s, v) => s + CFG.nuoi[st.vLevel[v]], 0); }
function houseCost(st, pi) { const n = houses(st, pi).length + (st.pending[pi] || []).filter(x => x.t === 'house').length; return scale(CFG.cost.nha, 1 + CFG.nhaTang * n); }
function unitCost(st, pi, u) { return scale(CFG.cost.linh[u], 1 + CFG.giaTang * sumUnits(st.players[pi])); }
function capMax(st, pi) { return Math.max(0, ...houses(st, pi).map(v => st.vLevel[v])); }
function tradeRate(st, pi, r) {
  if (r === 'vang') return 1;
  const map = M(st); let rate = 4;
  for (const v of houses(st, pi)) { const k = map.verts[v].port; if (k === '*') rate = Math.min(rate, 3); else if (k === r) rate = 2; }
  return rate;
}
const hopLeNha = (st, v) => st.vOwner[v] < 0 && M(st).verts[v].adj.every(a => st.vOwner[a] < 0);
// đỉnh "mạng lưới" của người chơi: nhà mình + đầu đường mình (không xuyên nhà người khác). extraEdges = đường đang đăng ký.
function network(st, pi, extraEdges) {
  const map = M(st), set = new Set();
  st.vOwner.forEach((o, v) => { if (o === pi) set.add(v); });
  const mine = st.eOwner.map((o, e) => o === pi ? e : -1).filter(e => e >= 0).concat(extraEdges || []);
  for (const e of mine) for (const x of [map.edges[e].a, map.edges[e].b]) if (st.vOwner[x] < 0 || st.vOwner[x] === pi) set.add(x);
  return set;
}
const pendingEdges = (st, pi) => (st.pending[pi] || []).filter(x => x.t === 'road').map(x => x.e);
function roadOk(st, pi, e, extra) {
  if (st.eOwner[e] >= 0) return false;
  const ed = M(st).edges[e];
  if ((extra || []).includes(e)) return false;
  const net = network(st, pi, extra);
  return net.has(ed.a) || net.has(ed.b);
}
function houseOk(st, pi, v, extra) { return hopLeNha(st, v) && network(st, pi, extra).has(v); }
function access(st, pi, h, extra) { const net = network(st, pi, extra); return M(st).hexes[h].corners.some(c => net.has(c)); }

function longestRoad(st, pi) {
  const map = M(st), mine = st.eOwner.map((o, e) => o === pi ? e : -1).filter(e => e >= 0);
  let best = 0;
  const dfs = (v, used, len) => {
    if (len > best) best = len;
    if (len > 0 && st.vOwner[v] >= 0 && st.vOwner[v] !== pi) return;
    for (const e of mine) { const ed = map.edges[e]; if (!used.has(e) && (ed.a === v || ed.b === v)) { used.add(e); dfs(ed.a === v ? ed.b : ed.a, used, len + 1); used.delete(e); } }
  };
  for (const v of new Set(mine.flatMap(e => [map.edges[e].a, map.edges[e].b]))) dfs(v, new Set(), 0);
  return best;
}
function roadHolder(st) {
  const L = st.players.map((_, i) => longestRoad(st, i)), m = Math.max(...L);
  if (m < 5) return -1;
  const ws = L.map((x, i) => x === m ? i : -1).filter(i => i >= 0);
  if (ws.length === 1) return ws[0];
  return ws.includes(st.roadHolder) ? st.roadHolder : -1; // hoà thì người đang giữ vẫn giữ
}
function score(st, pi, withHidden) {
  const p = st.players[pi];
  const ct = houses(st, pi).reduce((s, v) => s + CFG.diemCap[st.vLevel[v]], 0);
  const duong = st.roadHolder === pi ? CFG.duongDaiNhat : 0;
  const cc = Math.round(p.cc);
  return { ct, duong, cc, an: p.hidden, tong: ct + duong + cc + (withHidden ? p.hidden : 0) };
}

// ---------- Khám phá & chiến tranh ----------
const khac = (u, v) => (u === 2 && v === 1) || (u === 1 && v === 0) || (u === 0 && v === 2);
const heSoKhac = (u, v) => khac(u, v) ? CFG.khac : khac(v, u) ? CFG.biKhac : 1;
function heSoKP(u, quai) {
  if (u === quai) return CFG.heSoLinh * CFG.khac;
  const vai = [0, 1, 2].find(x => khac(quai, x));
  return khac(vai, u) ? CFG.heSoLinh * CFG.biKhac : CFG.heSoLinh;
}
const gOf = n => n <= 0 ? 0 : n <= 8 ? CFG.g[n] : 4 + 0.2 * (n - 8);
const mOf = p => p.bac.map(b => CFG.bacMult[b]);
function diemKP(a, quai, m) { const n = a[0] + a[1] + a[2]; if (!n) return 0; const tb = (a[0] * heSoKP(0, quai) * m[0] + a[1] * heSoKP(1, quai) * m[1] + a[2] * heSoKP(2, quai) * m[2]) / n; return tb * gOf(n); }
function sucManh(a, b, m) { const nb = b[0] + b[1] + b[2]; if (!nb) return a[0] * m[0] + a[1] * m[1] + a[2] * m[2]; let s = 0; for (const u of [0, 1, 2]) for (const v of [0, 1, 2]) s += a[u] * m[u] * (b[v] / nb) * heSoKhac(u, v); return s; }
function spawnZone(st, z, R) {
  if (!z.center) z.tier = R() < CFG.xsCap2 ? 2 : 1; // ô thường: mỗi lần xuất hiện ngẫu nhiên cấp 1–2
  const c = CFG.kp[z.tier]; z.quai = Math.floor(R() * 3); z.Erem = c.E; z.hoi = 0;
}

// ---------- Tạo ván ----------
function newGame({ seed, players, soLuot, timer }) {
  const st = {
    v: 1, seed, rng: seed | 0, mapSeed: seed, phase: 'order', turn: 0,
    soLuot: soLuot || CFG.soLuot, timer: timer || CFG.timer,
    players: players.map((p, i) => ({
      slot: p.slot, name: p.name, color: p.color, res: { go: 0, gach: 0, lua: 0, cuu: 0, quang: 0, vang: 0 },
      linh: [0, 0, 0], bac: [1, 1, 1], hidden: 0, cc: 0, cards: [], freeRoads: 0, shield: 0, ready: false,
      thuLuot: null, stat: { thang: 0, thua: 0, vang: 0 },
    })),
    vOwner: [], vLevel: [], vBranch: [], vDebuff: [], eOwner: [], zone: [], pending: {}, roadHolder: -1,
    setup: null, lastRoll: [], log: [], prio: 0, ended: false, ranking: null,
  };
  const map = buildMap(seed);
  st.vOwner = map.verts.map(() => -1); st.vLevel = map.verts.map(() => 0); st.vBranch = map.verts.map(() => null); st.vDebuff = map.verts.map(() => null);
  st.eOwner = map.edges.map(() => -1);
  const R = () => rng(st);
  st.zone = map.hexes.filter(h => h.zone).map(h => { const z = { h: h.id, tier: h.tier, center: !!h.center }; spawnZone(st, z, R); return z; });
  const n = players.length, order = [...Array(n).keys()];
  // Luật Catan gốc: vào ván mọi người đổ xúc xắc lần lượt (MỖI NGƯỜI 1 LẦN), ai cao nhất chọn nhà trước.
  // Hoà điểm: máy bốc ngẫu nhiên thứ tự giữa những người hoà — không đổ lại (CEO 24/09: cho nhanh).
  // Thứ tự chọn nhà 2 vòng kiểu rắn: 1→n rồi n→1 (st.setup tạo khi đổ xong).
  st.orderRoll = { queue: order.slice(), idx: 0, round: 1, rolls: [], key: order.map(() => []) };
  st.setup = null;
  log(st, `Ván mới · ${n} người · ${st.soLuot} lượt. Đổ xúc xắc chọn thứ tự đặt nhà!`);
  return st;
}
function log(st, text) { st.log.push({ t: st.turn, text }); if (st.log.length > 60) st.log.shift(); }

// ---------- Reducer ----------
function reduce(st0, a) {
  const st = clone(st0), ev = [];
  const err = e => ({ error: e });
  if (st.ended) return err('Ván đã kết thúc');
  const R = () => rng(st);
  const map = M(st);

  if (a.t === 'resolve') return resolveTurn(st, ev);
  if (a.t === 'roll') return rollTurn(st, ev);
  if (a.t === 'autoRoll') { if (st.phase === 'order') return doOrderRoll(st, ev); if (st.phase !== 'roll') return err('Không ở lúc đổ xúc xắc'); return doRoll(st, ev); } // TV đổ hộ khi quá giờ

  const pi = pOf(st, a.slot); if (pi < 0) return err('Máy này không có trong ván');
  const p = st.players[pi];

  // ----- đặt nhà ban đầu -----
  if (st.phase === 'order') {
    if (a.t !== 'rollDice') return err('Đang đổ xúc xắc chọn thứ tự đặt nhà');
    const O = st.orderRoll; if (O.queue[O.idx] !== pi) return err(`Chưa tới lượt bạn — đang chờ ${st.players[O.queue[O.idx]].name} đổ`);
    return doOrderRoll(st, ev);
  }
  if (st.phase === 'setup') {
    const S = st.setup, cur = S.order[S.idx];
    if (cur !== pi) return err('Chưa tới lượt bạn đặt');
    if (a.t === 'setupHouse' && S.step === 'house') {
      if (!hopLeNha(st, a.v)) return err('Chỗ này không đặt được (phải cách nhà khác ít nhất 1 cạnh)');
      st.vOwner[a.v] = pi; st.vLevel[a.v] = 1; S.lastHouse = a.v; S.step = 'road';
      if (S.idx >= st.players.length) for (const hi of map.verts[a.v].hexes) { const h = map.hexes[hi]; if (h.res) p.res[h.res] += 100; }
      ev.push({ type: 'house', pi, v: a.v });
      return { st, events: ev };
    }
    if (a.t === 'setupRoad' && S.step === 'road') {
      const e = map.edges[a.e];
      if (!e || st.eOwner[a.e] >= 0 || (e.a !== S.lastHouse && e.b !== S.lastHouse)) return err('Đường phải nối từ nhà vừa đặt');
      st.eOwner[a.e] = pi; ev.push({ type: 'road', pi, e: a.e });
      S.idx++; S.step = 'house';
      if (S.idx >= S.order.length) { st.setup = null; log(st, 'Đặt nhà xong. Bắt đầu lượt 1!'); return rollTurn(st, ev); }
      return { st, events: ev };
    }
    return err('Đang đặt nhà ban đầu');
  }
  if (a.t === 'rollDice') {
    if (st.phase !== 'roll') return err('Chưa tới lúc đổ xúc xắc');
    if (st.rollOrder[st.rollIdx] !== pi) return err(`Chưa tới lượt bạn — đang chờ ${st.players[st.rollOrder[st.rollIdx]].name} đổ`);
    return doRoll(st, ev);
  }
  if (st.phase === 'roll') return err('Đang đổ xúc xắc — chờ mọi người đổ xong');
  if (st.phase !== 'act') return err('Chờ TV tính kết quả…');
  if (p.ready && a.t !== 'ready') return err('Bạn đã bấm Kết thúc — bấm "Làm tiếp" để sửa');
  const pend = st.pending[pi] = st.pending[pi] || [];

  switch (a.t) {
    case 'ready': p.ready = !!a.on; return { st, events: ev };
    case 'road': {
      const extra = pendingEdges(st, pi);
      if (!roadOk(st, pi, a.e, extra)) return err('Đường phải nối vào mạng đường/nhà của bạn');
      if (st.players.some((q, j) => j !== pi && (st.pending[j] || []).some(x => x.t === 'road' && x.e === a.e))) { /* người khác cũng đăng ký: xét theo ưu tiên khi chốt */ }
      let cost = CFG.cost.duong;
      if (p.freeRoads > 0) { p.freeRoads--; cost = {}; } else if (!coTheTra(p, cost)) return err('Thiếu ' + thieu(p, cost));
      tra(p, cost); pend.push({ t: 'road', e: a.e, cost });
      return { st, events: ev };
    }
    case 'house': {
      const extra = pendingEdges(st, pi);
      if (!houseOk(st, pi, a.v, extra)) return err('Nhà phải nằm trên mạng đường của bạn, cách nhà khác ≥ 1 cạnh');
      if (pend.some(x => x.t === 'house' && map.verts[x.v].adj.concat(x.v).includes(a.v))) return err('Quá sát nhà bạn vừa đăng ký');
      const hc = houseCost(st, pi);
      if (!coTheTra(p, hc)) return err('Thiếu ' + thieu(p, hc));
      tra(p, hc); pend.push({ t: 'house', v: a.v, cost: hc });
      return { st, events: ev };
    }
    case 'cancel': {
      const x = pend[a.i]; if (!x) return err('Không có đăng ký này');
      if (x.t === 'road' || x.t === 'house') {
        // huỷ đường mà nhà/đường khác đang dựa vào → huỷ luôn cho gọn? Không: chỉ chặn.
        if (x.t === 'road') { const rest = pendingEdges(st, pi).filter(e => e !== x.e); if (pend.some(y => y.t === 'house' && !houseOk(st, pi, y.v, rest))) return err('Có nhà đăng ký đang dựa vào đường này — huỷ nhà trước'); }
        if (x.cost && Object.keys(x.cost).length) hoan(p, x.cost); else if (x.t === 'road') p.freeRoads++;
      }
      pend.splice(a.i, 1); return { st, events: ev };
    }
    case 'upgrade': {
      if (st.vOwner[a.v] !== pi) return err('Không phải nhà của bạn');
      const cap = st.vLevel[a.v]; if (cap >= 5) return err('Nhà đã cấp tối đa');
      if (st.vDebuff[a.v] && st.vDebuff[a.v].luot > 0 && false) return err('');
      const cost = CFG.cost.len[cap]; if (!coTheTra(p, cost)) return err('Thiếu ' + thieu(p, cost));
      let br = st.vBranch[a.v];
      if (cap === 1) {
        br = a.branch;
        const ok = br === 'dothi' || map.verts[a.v].hexes.some(hi => map.hexes[hi].res === br);
        if (!ok) return err('Chọn nhánh: Đô thị, hoặc chuyên 1 tài nguyên của ô kề nhà');
      }
      tra(p, cost); st.vLevel[a.v] = cap + 1; st.vBranch[a.v] = br;
      ev.push({ type: 'upgrade', pi, v: a.v, cap: cap + 1 });
      log(st, `${p.name} nâng nhà lên cấp ${cap + 1}${cap === 1 ? ' · ' + (br === 'dothi' ? 'Đô thị' : 'chuyên ' + RES_NAME[br]) : ''}`);
      return { st, events: ev };
    }
    case 'train': {
      const u = a.u; if (![0, 1, 2].includes(u)) return err('Loại lính sai');
      if (sumUnits(p) >= supply(st, pi)) return err(`Hết chỗ nuôi quân (${supply(st, pi)}) — xây/nâng nhà để nuôi thêm`);
      const cost = unitCost(st, pi, u); if (!coTheTra(p, cost)) return err('Thiếu ' + thieu(p, cost));
      tra(p, cost); p.linh[u]++;
      return { st, events: ev };
    }
    case 'tech': {
      const u = a.u, nb = p.bac[u] + 1; if (nb > 3) return err('Đã bậc tối đa');
      if (capMax(st, pi) < CFG.bacCanNha[nb]) return err(`Cần có nhà cấp ${CFG.bacCanNha[nb]}`);
      const cost = CFG.cost.bac[nb]; if (!coTheTra(p, cost)) return err('Thiếu ' + thieu(p, cost));
      tra(p, cost); p.bac[u] = nb; log(st, `${p.name} nâng ${UNIT[u].ten} lên bậc ${nb}`);
      return { st, events: ev };
    }
    case 'trade': {
      const { give, get } = a; const amt = Math.round(a.amt);
      if (!RES_ALL.includes(give) || !RES.includes(get) || give === get || !(amt > 0)) return err('Giao dịch không hợp lệ');
      const rate = tradeRate(st, pi, give), need = amt * rate;
      if (p.res[give] < need - 1e-9) return err(`Cần ${need} ${RES_NAME[give]}`);
      p.res[give] -= need; p.res[get] += amt;
      return { st, events: ev };
    }
    case 'buyCard': {
      const tier = a.tier, cost = CFG.cost.the[tier]; if (!cost) return err('Thẻ sai');
      if (!coTheTra(p, cost)) return err('Thiếu ' + thieu(p, cost));
      tra(p, cost);
      const x = R(); let card;
      const freeUnit = n => { let got = 0; for (let k = 0; k < n; k++) if (sumUnits(p) < supply(st, pi)) { p.linh[Math.floor(R() * 3)]++; got++; } if (got < n) RES.forEach(r => p.res[r] += 40 * (n - got)); return got; };
      if (tier === 1) {
        if (x < 0.25) { p.hidden += 100; card = { ic: '⭐', ten: 'Điểm ẩn +100', mo: 'Giữ bí mật, lật cuối ván' }; }
        else if (x < 0.6) { const g = freeUnit(1); card = { ic: '🛡️', ten: 'Tân binh', mo: g ? '+1 lính miễn phí' : 'Hết chỗ nuôi quân → +200 tài nguyên' }; }
        else if (x < 0.8) { p.freeRoads += 2; card = { ic: '🛤️', ten: 'Làm đường', mo: '2 đường miễn phí' }; }
        else { const r = RES.reduce((m, r) => p.res[r] < p.res[m] ? r : m); p.res[r] += 200; card = { ic: RES_IC[r], ten: 'Được mùa', mo: `+200 ${RES_NAME[r]}` }; }
      } else if (tier === 2) {
        if (x < 0.35) { p.cards.push({ k: 'nhe' }); card = { ic: '💣', ten: 'Kỹ năng: Phá hoại', mo: 'Nhà đối thủ ×0.5 sản lượng trong 3 lượt' }; }
        else if (x < 0.6) { const g = freeUnit(2); card = { ic: '⚔️', ten: 'Viện binh', mo: g ? `+${g} lính miễn phí` : 'Hết chỗ nuôi quân → tài nguyên' }; }
        else if (x < 0.8) { RES.forEach(r => p.res[r] += 80); card = { ic: '🎁', ten: 'Thương đoàn', mo: '+80 mỗi loại tài nguyên' }; }
        else { p.hidden += 150; card = { ic: '⭐', ten: 'Điểm ẩn +150', mo: 'Giữ bí mật, lật cuối ván' }; }
      } else {
        if (x < 0.4) { p.res.vang += 150; card = { ic: '🪙', ten: 'Mỏ vàng', mo: '+150 Vàng' }; }
        else if (x < 0.7) { p.cards.push({ k: 'manh' }); card = { ic: '🔥', ten: 'Kỹ năng: Hoả công', mo: 'Nhà đối thủ ×0.25 sản lượng trong 4 lượt' }; }
        else { p.hidden += 300; card = { ic: '🌟', ten: 'Điểm ẩn +300', mo: 'Giữ bí mật, lật cuối ván' }; }
      }
      ev.push({ type: 'card', pi, tier, card, private: true });
      return { st, events: ev };
    }
    case 'useCard': {
      const c = p.cards[a.i]; if (!c) return err('Không có thẻ này');
      const o = st.vOwner[a.v]; if (o < 0 || o === pi) return err('Chọn nhà của đối thủ');
      const q = st.players[o]; if (q.shield > 0) return err(`${q.name} đang có khiên (${q.shield} lượt)`);
      const d = CFG.phaHoai[c.k];
      st.vDebuff[a.v] = { mult: d.mult, luot: d.luot };
      q.shield = CFG.khien; p.cards.splice(a.i, 1);
      ev.push({ type: 'sabotage', pi, target: o, v: a.v, k: c.k });
      log(st, `💣 ${p.name} ${c.k === 'manh' ? 'hoả công' : 'phá hoại'} nhà của ${q.name}! (${q.name} được khiên ${CFG.khien} lượt)`);
      return { st, events: ev };
    }
    case 'send': {
      const z = st.zone.find(z => z.h === a.h); if (!z) return err('Không phải ô khám phá');
      if (z.hoi > 0) return err('Ô đang hồi');
      const u = (a.u || [0, 0, 0]).map(x => Math.max(0, Math.floor(x)));
      const n = u[0] + u[1] + u[2];
      const idx = pend.findIndex(x => x.t === 'send' && x.h === a.h);
      if (n === 0) { if (idx >= 0) pend.splice(idx, 1); return { st, events: ev }; }
      if (n > CFG.kp[z.tier].tran) return err(`Ô cấp ${z.tier} tối đa ${CFG.kp[z.tier].tran} lính/người`);
      if (!access(st, pi, a.h, pendingEdges(st, pi))) return err('Cần đường hoặc nhà chạm tới ô này');
      const used = [0, 0, 0]; pend.forEach((x, i) => { if (x.t === 'send' && i !== idx) x.u.forEach((k, j) => used[j] += k); });
      for (const j of [0, 1, 2]) if (used[j] + u[j] > p.linh[j]) return err(`Không đủ ${UNIT[j].ten}`);
      if (idx >= 0) pend[idx].u = u; else pend.push({ t: 'send', h: a.h, u });
      return { st, events: ev };
    }
  }
  return err('Không rõ thao tác: ' + a.t);
}

// ---------- Mở lượt mới: đổ xúc xắc LẦN LƯỢT (CEO 24/09) ----------
// Lượt t: người đổ đầu = (t−1) mod n, xoay vòng (lượt 5: A→B→C→D, lượt 6: B→C→D→A). Người đổ đầu cũng là người ưu tiên khi tranh chỗ.
function rollTurn(st, ev) {
  const n = st.players.length;
  st.turn++; st.phase = 'roll'; st.pending = {};
  st.prio = (st.turn - 1) % n;
  st.rollOrder = [...Array(n).keys()].map(k => (k + st.prio) % n); st.rollIdx = 0;
  st.lastRoll = []; st.rollTmp = { before: st.players.map(p => ({ ...p.res })), thu: st.players.map(() => ({ xx: 0, bd: 0, bay: 0 })), add: st.players.map(() => Object.fromEntries(RES.map(r => [r, 0]))) };
  st.players.forEach(p => { p.ready = false; });
  ev.push({ type: 'turnStart', turn: st.turn, order: st.rollOrder });
  log(st, `— Lượt ${st.turn}: thứ tự đổ ${st.rollOrder.map(i => st.players[i].name).join(' → ')}`);
  return { st, events: ev };
}
function doRoll(st, ev) {
  const map = M(st), R = () => rng(st), n = st.players.length, T = st.rollTmp;
  const ri = st.rollOrder[st.rollIdx], roller = st.players[ri];
  const d1 = 1 + Math.floor(R() * 6), d2 = 1 + Math.floor(R() * 6), s = d1 + d2;
  const r = { pi: ri, d1, d2, sum: s, bonus: null }, gains = st.players.map(() => 0), hexHit = [];
  // CHỈ GHI "sẽ nhận" — tài nguyên cộng thật một lần khi cả vòng đổ xong
  if (s === 7) { const res = RES[Math.floor(R() * 5)]; T.add[ri][res] += CFG.baySo; T.thu[ri].bay += CFG.baySo; gains[ri] += CFG.baySo; r.bonus = res; }
  else for (const h of map.hexes) if (h.num === s) { hexHit.push(h.id); for (const c of h.corners) { const x = prod(st, h, c, 100, false); if (x) { T.add[x[0]][h.res] += x[1]; T.thu[x[0]].xx += x[1]; gains[x[0]] += x[1]; } } }
  r.gains = gains.map(Math.round); r.hit = hexHit;
  st.lastRoll.push(r); st.rollIdx++;
  ev.push({ type: 'roll1', ...r, gains: gains.map(Math.round), hexHit, idx: st.rollIdx, n });
  log(st, `🎲 ${roller.name} đổ ${d1}+${d2} = ${s}${s === 7 ? ` → +${CFG.baySo} ${RES_NAME[r.bonus]}` : ''}`);
  if (st.rollIdx >= n) {
    st.players.forEach((p, i) => RES.forEach(r => { p.res[r] += T.add[i][r]; }));
    for (const h of map.hexes) if (h.pips) for (const c of h.corners) { const x = prod(st, h, c, CFG.bidong[h.pips]); if (x) T.thu[x[0]].bd += x[1]; }
    st.players.forEach((p, i) => { p.thuLuot = { ...T.thu[i], theo: Object.fromEntries(RES_ALL.map(r => [r, Math.round(p.res[r] - T.before[i][r])])) }; });
    delete st.rollTmp; st.phase = 'act';
    ev.push({ type: 'rollDone', thu: st.players.map(p => p.thuLuot) });
  }
  return { st, events: ev };
}
// đổ chọn thứ tự: mỗi người 1 lần; xếp điểm giảm dần, hoà thì bốc ngẫu nhiên
function doOrderRoll(st, ev) {
  const R = () => rng(st), O = st.orderRoll, pi = O.queue[O.idx];
  const d1 = 1 + Math.floor(R() * 6), d2 = 1 + Math.floor(R() * 6), sum = d1 + d2;
  O.rolls.push({ pi, d1, d2, sum, round: O.round }); O.key[pi].push(sum); O.idx++;
  ev.push({ type: 'orderRoll', pi, d1, d2, sum, round: O.round });
  log(st, `🎲 ${st.players[pi].name} đổ ${sum}`);
  if (O.idx < O.queue.length) return { st, events: ev };
  const tb = st.players.map(() => R()); // thăm bốc cho người hoà
  const ids = st.players.map((_, i) => i).sort((a, b) => (O.key[b][0] - O.key[a][0]) || (tb[a] - tb[b]));
  const tied = ids.filter(i => ids.some(j => j !== i && O.key[j][0] === O.key[i][0]));
  O.final = ids; O.tied = tied;
  st.setup = { order: ids.concat(ids.slice().reverse()), idx: 0, step: 'house', lastHouse: -1 };
  st.phase = 'setup';
  ev.push({ type: 'orderDone', order: ids, tied });
  log(st, `Thứ tự chọn nhà: ${ids.map(i => st.players[i].name).join(' → ')} rồi quay ngược lại`);
  return { st, events: ev };
}
function prod(st, h, c, amt, apply = true) { const o = st.vOwner[c]; if (o < 0) return 0; const d = st.vDebuff[c]; const v = amt * heSo(st.vLevel[c], st.vBranch[c], h.res) * (d && d.luot > 0 ? d.mult : 1); if (apply) st.players[o].res[h.res] += v; return [o, v]; }

// ---------- Chốt lượt ----------
function resolveTurn(st, ev) {
  if (st.phase !== 'act') return { error: 'Không ở giai đoạn thao tác' };
  const map = M(st), R = () => rng(st), n = st.players.length;
  st.phase = 'resolve';
  const order = [...Array(n).keys()].map(k => (k + st.prio) % n);
  // 1) đường, 2) nhà — theo thứ tự ưu tiên
  for (const kind of ['road', 'house']) for (const pi of order) {
    const p = st.players[pi];
    for (const x of (st.pending[pi] || []).filter(x => x.t === kind)) {
      const ok = kind === 'road' ? roadOk(st, pi, x.e) : houseOk(st, pi, x.v);
      if (ok) {
        if (kind === 'road') st.eOwner[x.e] = pi; else { st.vOwner[x.v] = pi; st.vLevel[x.v] = 1; }
        ev.push({ type: kind, pi, [kind === 'road' ? 'e' : 'v']: kind === 'road' ? x.e : x.v });
      } else {
        if (x.cost && Object.keys(x.cost).length) hoan(p, x.cost); else if (kind === 'road') p.freeRoads++;
        ev.push({ type: 'fail', pi, what: kind === 'road' ? 'đường' : 'nhà' });
        log(st, `${p.name}: ${kind === 'road' ? 'đường' : 'nhà'} bị người ưu tiên hơn chiếm chỗ — hoàn tài nguyên`);
      }
    }
  }
  st.roadHolder = roadHolder(st);
  // 3) khám phá
  for (const z of st.zone) {
    if (z.hoi > 0) continue;
    const h = map.hexes[z.h], c = CFG.kp[z.tier];
    const ai = [];
    for (const pi of order) for (const x of (st.pending[pi] || [])) if (x.t === 'send' && x.h === z.h) {
      if (!access(st, pi, z.h)) { ev.push({ type: 'fail', pi, what: 'đường tới ô khám phá' }); continue; }
      const p = st.players[pi], a = x.u.map((k, j) => Math.min(k, p.linh[j]));
      if (a[0] + a[1] + a[2] > 0) ai.push({ pi, a, mat: 0, thang: 0 });
    }
    if (!ai.length) continue;
    const wars = [];
    for (let i = 0; i < ai.length; i++) for (let j = i + 1; j < ai.length; j++) {
      if (R() >= CFG.xsChien) continue;
      const A = ai[i], B = ai[j];
      const sA = sucManh(A.a, B.a, mOf(st.players[A.pi])), sB = sucManh(B.a, A.a, mOf(st.players[B.pi]));
      const [W, L, sw, sl] = sA >= sB ? [A, B, sA, sB] : [B, A, sB, sA];
      const r = sl > 0 ? sw / sl : 99, pY = r >= 2 ? 0 : 0.5 * Math.pow(2 - r, CFG.mu);
      const lat = R() < pY, win = lat ? L : W, lose = lat ? W : L, rr = lat ? 1 / r : r;
      lose.mat += Math.min(0.5, 0.2 * Math.max(1, rr)); win.mat += 0.3 / Math.max(rr, 0.5);
      win.thang++; st.players[win.pi].stat.thang++; st.players[lose.pi].stat.thua++;
      wars.push({ a: A.pi, b: B.pi, sA: +sA.toFixed(1), sB: +sB.toFixed(1), win: win.pi, lat, pWeak: +pY.toFixed(2) });
    }
    const loss = {};
    for (const x of ai) if (x.mat > 0) {
      const tl = Math.min(CFG.tranThietHai, x.mat), p = st.players[x.pi], lost = [0, 0, 0];
      for (const u of [0, 1, 2]) { const k = Math.floor(x.a[u] * tl) + (R() < x.a[u] * tl % 1 ? 1 : 0); x.a[u] -= k; p.linh[u] -= k; lost[u] = k; }
      loss[x.pi] = lost;
    }
    const diem = ai.map(x => diemKP(x.a, z.quai, mOf(st.players[x.pi])));
    const tong = diem.reduce((s, d) => s + d, 0), k = tong > 0 ? Math.min(1, z.Erem / tong) : 0;
    const loot = [];
    ai.forEach((x, i) => {
      const tl = diem[i] * k / c.E * (1 + CFG.thuongThang * x.thang), p = st.players[x.pi];
      const res = c.K.res * tl, vang = c.K.vang * tl, cc = c.K.cc * tl;
      RES.forEach(r => p.res[r] += res / 5); p.res.vang += vang; p.cc += cc; p.stat.vang += vang;
      loot.push({ pi: x.pi, units: x.a, pct: +(diem[i] * k / c.E * 100).toFixed(1), res: Math.round(res), vang: Math.round(vang), cc: Math.round(cc), lost: loss[x.pi] || [0, 0, 0] });
    });
    z.Erem -= tong * k;
    const can = z.Erem <= 1e-6;
    if (can) z.hoi = CFG.hoi + 1;
    ev.push({ type: 'explore', h: z.h, tier: z.tier, quai: z.quai, wars, loot, can, conLai: Math.max(0, Math.round(z.Erem / c.E * 100)) });
    for (const w of wars) log(st, `⚔️ ${st.players[w.a].name} vs ${st.players[w.b].name} ở ô cấp ${z.tier}: ${st.players[w.win].name} thắng${w.lat ? ' (LẬT KÈO!)' : ''}`);
    if (can) log(st, `🏁 Ô cấp ${z.tier} đã khám phá xong — hồi ${CFG.hoi} lượt`);
  }
  // 4) lương quân
  for (const p of st.players) {
    let luong = sumUnits(p) * CFG.luong;
    const a = Math.min(p.res.lua, luong); p.res.lua -= a; luong -= a;
    const b = Math.min(p.res.vang, luong); p.res.vang -= b; luong -= b;
    let bo = 0; while (luong > 1e-9 && sumUnits(p) > 0) { const u = [0, 1, 2].reduce((m, x) => p.linh[x] > p.linh[m] ? x : m, 0); p.linh[u]--; luong -= CFG.luong; bo++; }
    if (bo) { ev.push({ type: 'desert', pi: st.players.indexOf(p), n: bo }); log(st, `${p.name} thiếu Lúa trả lương — ${bo} lính bỏ ngũ`); }
  }
  // 5) hồi, khiên, phá hoại
  for (const z of st.zone) if (z.hoi > 0) { z.hoi--; if (z.hoi === 0) { spawnZone(st, z, R); ev.push({ type: 'respawn', h: z.h, quai: z.quai }); } }
  st.vDebuff = st.vDebuff.map(d => d && d.luot > 1 ? { ...d, luot: d.luot - 1 } : null);
  st.players.forEach(p => { if (p.shield > 0) p.shield--; });
  for (const p of st.players) for (const r of RES_ALL) p.res[r] = Math.round(p.res[r] * 100) / 100;
  st.pending = {};
  if (st.turn >= st.soLuot) {
    st.ended = true; st.phase = 'end';
    const rs = st.players.map((p, i) => ({ i, ...score(st, i, true) })).sort((a, b) => b.tong - a.tong);
    st.ranking = rs.map(r => ({ ...r, rank: 1 + rs.filter(x => x.tong > r.tong).length })); // hoà điểm = đồng hạng
    ev.push({ type: 'end' }); log(st, '🏆 Hết ' + st.soLuot + ' lượt!');
    return { st, events: ev };
  }
  return { st, events: ev };
}

// ---------- API cho giao diện ----------
function validHouses(st, pi, setup) {
  const n = M(st).verts.length, out = [];
  for (let v = 0; v < n; v++) if (setup ? hopLeNha(st, v) : houseOk(st, pi, v, pendingEdges(st, pi))) out.push(v);
  return out;
}
function validRoads(st, pi, setup) {
  const map = M(st);
  if (setup) return map.verts[st.setup.lastHouse].edges.filter(e => st.eOwner[e] < 0);
  const extra = pendingEdges(st, pi);
  return map.edges.map(e => e.id).filter(e => roadOk(st, pi, e, extra));
}
function upgradeCost(st, v) { const c = st.vLevel[v]; return c >= 1 && c < 5 ? CFG.cost.len[c] : null; }
function incomeEstimate(st, pi) {
  const map = M(st), o = Object.fromEntries(RES.map(r => [r, 0]));
  for (const v of houses(st, pi)) for (const hi of map.verts[v].hexes) {
    const h = map.hexes[hi]; if (!h.pips) continue;
    const d = st.vDebuff[v], k = heSo(st.vLevel[v], st.vBranch[v], h.res) * (d && d.luot > 0 ? d.mult : 1);
    o[h.res] += (st.players.length * 100 * h.pips / 36 + CFG.bidong[h.pips]) * k;
  }
  return o;
}

const API = {
  CFG, RES, RES_ALL, RES_NAME, RES_IC, UNIT, QUAI, PIPS,
  buildMap, newGame, reduce, score, supply, unitCost, houseCost, capMax, tradeRate, houses, sumUnits, longestRoad,
  validHouses, validRoads, access, upgradeCost, incomeEstimate, diemKP, heSoKP, mOf, gOf, pendingEdges, heSo, coTheTra,
};
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.BKCATAN = API;
})(typeof window !== 'undefined' ? window : globalThis);
