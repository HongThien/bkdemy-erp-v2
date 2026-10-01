// Mô phỏng cân bằng BK Catan — theo spec-game-catan.md (v0.3).
// Chạy: node scripts/sim-bk-catan.mjs [soVan=2000] [seed=1]
// Bot tham lam theo "lối chơi"; mọi con số là KHỞI ĐIỂM trong CFG — chỉnh ở đây rồi chạy lại.
// Chưa mô phỏng: cảng, thẻ cấp 2–3 (kỹ năng), khiên, đổ lại 1 viên, nhánh doanh trại.

const N_VAN = +(process.argv[2] || 2000);
let seed = +(process.argv[3] || 1);

const CFG = {
  soLuot: 25,                      // CEO 24/09: 15 → 25 lượt
  res: ['go', 'gach', 'lua', 'cuu', 'quang'],
  // bị động mỗi lượt theo số tổ hợp (pips) của ô — spec §4
  bidong: { 1: 48, 2: 36, 3: 24, 4: 16, 5: 8 },
  baySo: 150,
  cost: {
    duong: { go: 100, gach: 100 },
    nha: { go: 100, gach: 100, lua: 100, cuu: 100 },
    len: [null,
      { lua: 200, quang: 300 },                                   // 1→2
      { lua: 300, quang: 300, gach: 200, go: 200 },               // 2→3
      { lua: 300, quang: 400, gach: 200, go: 200, vang: 100 },    // 3→4
      { lua: 400, quang: 500, gach: 300, go: 300, vang: 200 }],   // 4→5
    the: { lua: 100, cuu: 100, quang: 100 },
    linh: [{ lua: 100, quang: 100 }, { go: 100, lua: 100 }, { lua: 100, cuu: 100, quang: 50 }], // bộ, cung, kỵ
  },
  diemCap: [0, 100, 200, 300, 450, 600],
  heSoDoThi: [0, 1, 2, 2.5, 3, 3.5],
  heSoChuyen: [0, 1, 2.5, 3.5, 4.5, 5.5],
  heSoChuyenKhac: [0, 1, 1.5, 1.75, 2, 2.25],
  nhaTang: 0.1,                    // CEO 24/09: nhà mới đắt hơn — giá × (1 + nhaTang × số nhà đang có) (lần 6, bàn 51 ô)
  giaTang: 0.15,                   // CEO 24/09: lính mới đắt hơn lính cũ — giá × (1 + giaTang × số lính đang có)
  luong: 10,                       // lúa / lính / lượt (lần 2: 15 → 10)
  duongDaiNhat: 200,
  // khám phá — spec §7. Lần 2 (24/09): E giảm, chiến công tăng — dò bằng OV, cc1=200 cho 4 lối chơi cân nhất
  kp: {
    1: { E: 50, tran: 5, K: { res: 700, vang: 50, cc: 175 } },   // lần 3: ô cấp 1 nhỏ lại cho nhanh cạn + rơi chút Vàng
    2: { E: 200, tran: 8, K: { res: 2000, vang: 300, cc: 875 } },
    3: { E: 400, tran: 12, K: { res: 2000, vang: 800, cc: 1750 } },   // lần 6 (bàn 51 ô): chiến công ×1.75 so với lần 3
  },
  heSoLinh: 10, khac: 1.25, biKhac: 0.75,          // CEO 24/09: khắc ±15% (lần 2) → thử ±25% (lần 3)
  nuoi: [0, 2, 3, 4, 5, 6],                         // giới hạn quân: mỗi nhà cấp k nuôi được nuoi[k] lính
  bacLinh: {                                        // nâng cấp lính theo cấp nhà (kiểu Đế chế: áp cho MỌI lính loại đó)
    mult: [0, 1, 1.4, 1.8], canNha: [0, 1, 2, 3],   // lần 3: hạ điều kiện nhà (CEO ok)
    cost: [null, null, { lua: 200, quang: 200, go: 200 }, { lua: 300, quang: 300, go: 300, vang: 100 }],
  },
  g: n => n <= 0 ? 0 : n <= 8 ? [0, 1, 1.8, 2.4, 2.8, 3.2, 3.5, 3.8, 4.0][n] : 4.0 + 0.2 * (n - 8),
  hoi: 2,
  xsChien: 0.4, mu: 1.5, tranThietHai: 0.6, thuongThang: 0.1,
  phiGui: 0.2,
};

// ghi đè cấu hình để dò tham số: OV='{"luong":10,"kp":{"1":{"E":100}}}'  ·  chỉ chạy vài kịch bản: ONLY=B,C
const deep = (a, b) => { for (const k in b) (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) ? deep(a[k] ??= {}, b[k]) : (a[k] = b[k]); return a; };
if (process.env.OV) deep(CFG, JSON.parse(process.env.OV));
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const chay = ten => !ONLY || ONLY.some(x => ten.startsWith(x));

// ---------- RNG ----------
function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
const d6 = () => 1 + Math.floor(rnd() * 6);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(rnd() * a.length)];
const PIPS = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };

// ---------- Bản đồ: lục giác bán kính 3, 7 ô tâm = vùng khám phá ----------
function taoBanDo() {
  const hexes = [], V = new Map(), E = new Map();
  const vkey = (x, y) => `${Math.round(x * 1000) + 0},${Math.round(y * 1000) + 0}`;
  // BẢN ĐỒ = y hệt games-site/bk-catan-engine.js (CEO 24/09): lục giác dẹt 7 hàng (9 ô hàng giữa) = 51 ô,
  // 7 ô khám phá rải đều: tâm cấp 3 cố định + 6 ô cách tâm 3 ô (mỗi lần xuất hiện ngẫu nhiên cấp 1–2)
  const ZONES = CFG.banCu ? null : ['0,0', '3,0', '-3,0', '1,2', '-3,2', '3,-2', '-1,-2'];
  const cells = [];
  if (CFG.banCu) { for (let q = -3; q <= 3; q++) for (let r = -3; r <= 3; r++) if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= 3) cells.push([q, r]); }
  else for (let r = -3; r <= 3; r++) { const L = 9 - Math.abs(r), q0 = -(L - 1) / 2 - r / 2; for (let k = 0; k < L; k++) cells.push([q0 + k, r]); }
  for (const [q, r] of cells) {
    const dist = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
    const cx = Math.sqrt(3) * (q + r / 2), cy = 1.5 * r;
    const zi = ZONES ? ZONES.indexOf(q + ',' + r) : (dist <= 1 ? (dist === 0 ? 0 : 1) : -1);
    const h = { id: hexes.length, q, r, zone: zi >= 0, center: zi === 0, corners: [] };
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 30), k = vkey(cx + Math.cos(a), cy + Math.sin(a));
      if (!V.has(k)) V.set(k, { id: V.size, hexes: [], adj: new Set(), edges: [] });
      V.get(k).hexes.push(h.id); h.corners.push(V.get(k).id);
    }
    hexes.push(h);
  }
  const verts = [...V.values()];
  for (const h of hexes) for (let i = 0; i < 6; i++) {
    const a = h.corners[i], b = h.corners[(i + 1) % 6], k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!E.has(k)) { const e = { id: E.size, a: Math.min(a, b), b: Math.max(a, b) }; E.set(k, e); verts[a].adj.add(b); verts[b].adj.add(a); verts[a].edges.push(e.id); verts[b].edges.push(e.id); }
  }
  const edges = [...E.values()];
  // gán tài nguyên + số cho 30 ô đất
  const land = hexes.filter(h => !h.zone);
  const nL = land.length;
  const resList = shuffle(Array.from({ length: nL }, (_, i) => CFG.res[i % 5]));
  const BASE = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12], EXTRA = [3, 11, 4, 10, 5, 9], n18 = Math.floor(nL / 18);
  const nums = shuffle(Array.from({ length: nL }, (_, i) => i < 18 * n18 ? BASE[i % 18] : EXTRA[(i - 18 * n18) % 6]));
  land.forEach((h, i) => { h.res = resList[i]; h.num = nums[i]; h.pips = PIPS[h.num]; });
  const zone = hexes.filter(h => h.zone);
  const ring = zone.filter(h => !h.center);
  zone.forEach(h => { h.tier = h.center ? 3 : 1; });
  if (CFG.banCu) { ring[0].tier = 2; ring[3].tier = 2; }
  for (const v of verts) v.zoneTiles = v.hexes.filter(i => hexes[i].zone);
  return { hexes, verts, edges, land, zone };
}

// ---------- Lối chơi ----------
const LOI = {
  CB: { ten: 'Cân bằng', dat: 'bal', nhanh: 'dothi', linh: t => Math.min(16, 2 + t), uuTien: ['nha', 'len', 'linh', 'nangLinh', 'duong', 'the'], tier: [1, 2, 3] },
  KT: { ten: 'Kinh tế (không quân)', dat: 'bal', nhanh: 'chuyen', linh: () => 0, uuTien: ['len', 'nha', 'duong', 'the'], tier: [] },
  QS: { ten: 'Quân sớm', dat: 'bal', nhanh: 'dothi', linh: t => Math.min(30, 4 + 2 * t), uuTien: ['linh', 'nangLinh', 'duongZone', 'nha', 'len', 'duong', 'the'], tier: [1, 2, 3], zoneBonus: 60 },
  NE: { ten: 'Né (chỉ ô cấp 1–2)', dat: 'bal', nhanh: 'dothi', linh: t => Math.min(12, 2 + t), uuTien: ['nha', 'len', 'linh', 'nangLinh', 'duong', 'the'], tier: [1, 2], ne: true },
  QGiua: { ten: 'Kinh tế trước, quân từ lượt 6', dat: 'bal', nhanh: 'dothi', linh: t => t < 6 ? 0 : Math.min(40, 3 * (t - 5)), uuTien: ['linh', 'nangLinh', 'duongZone', 'nha', 'len', 'duong', 'the'], tier: [1, 2, 3], zoneBonus: 30 },
  KTmuon: { ten: 'Kinh tế, dồn quân 3 lượt cuối', dat: 'bal', nhanh: 'chuyen', linh: t => t >= CFG.soLuot - 3 ? 99 : 0, uuTien: ['linh', 'nangLinh', 'len', 'nha', 'duong', 'the'], tier: [1, 2, 3], linhSau: true },
};
const variant = (base, patch) => ({ ...LOI[base], ...patch });

// ---------- Game ----------
function choiVan(dsLoi, { team = false, passive = true } = {}) {
  const M = taoBanDo();
  const nV = M.verts.length;
  const vOwner = new Array(nV).fill(-1), vLevel = new Array(nV).fill(0), vBranch = new Array(nV).fill(null);
  const eOwner = new Array(M.edges.length).fill(-1);
  const P = dsLoi.map((L, i) => ({
    i, L, team: team ? (i < 2 ? 0 : 1) : i, kho: { go: 0, gach: 0, lua: 0, cuu: 0, quang: 0, vang: 0 },
    linh: [0, 0, 0], bac: [1, 1, 1], chamTran: 0, diemAn: 0, quanCap: { 1: 0, 2: 0, 3: 0 }, cc: 0, thuXx: 0, thuBd: 0, thuKp: 0, thuNhapLuot: [], vaoZone: null, soHanhDong: 0,
    vangTong: 0, thang: 0, thua: 0,
  }));
  const S = { tran: 0, lat: 0, zoneCan: { 1: [], 2: [], 3: [] }, zoneRespawn: 0 };
  // trạng thái ô khám phá
  for (const h of M.zone) spawn(h);
  function spawn(h) { if (!h.center && !CFG.banCu) h.tier = rnd() < 0.35 ? 2 : 1; const c = CFG.kp[h.tier]; h.quai = Math.floor(rnd() * 3); h.Erem = c.E; h.hoi = 0; h.batDau = null; h.luotCoQuan = 0; h.presence = {}; }

  const nhaCua = p => M.verts.filter(v => vOwner[v.id] === p.i);
  const giaTriO = (h, p, cap = 1, branch = null) => {
    if (!h.pips) return 0;
    const hs = heSo(cap, branch, h.res);
    const xx = 4 * 100 * h.pips / 36 * hs, bd = (passive ? CFG.bidong[h.pips] : 0) * hs;
    const d = p.L.dat;
    return d === 'high' ? xx + 0.3 * bd : d === 'low' ? 0.3 * xx + bd : xx + bd;
  };
  function heSo(cap, branch, res) {
    if (!branch || cap === 1) return cap === 1 ? 1 : CFG.heSoDoThi[cap];
    if (branch === 'dothi') return CFG.heSoDoThi[cap];
    return branch === res ? CFG.heSoChuyen[cap] : CFG.heSoChuyenKhac[cap];
  }
  const hopLeNha = vid => vOwner[vid] < 0 && [...M.verts[vid].adj].every(a => vOwner[a] < 0);
  function giaTriDinh(vid, p) {
    const v = M.verts[vid];
    const coRes = new Set(nhaCua(p).flatMap(u => u.hexes.map(i => M.hexes[i].res)).filter(Boolean));
    let s = 0;
    for (const hi of v.hexes) { const h = M.hexes[hi]; s += giaTriO(h, p); if (h.res && !coRes.has(h.res)) s += 12; }
    if (v.zoneTiles.length && p.L.zoneBonus) s += p.L.zoneBonus;
    return s;
  }
  // mạng lưới: đỉnh chạm được (nhà mình + đầu đường mình, trừ đỉnh có nhà người khác)
  function mangLuoi(p) {
    const set = new Set();
    M.verts.forEach(v => { if (vOwner[v.id] === p.i) set.add(v.id); });
    M.edges.forEach(e => { if (eOwner[e.id] === p.i) { for (const x of [e.a, e.b]) if (vOwner[x] < 0 || vOwner[x] === p.i) set.add(x); } });
    return set;
  }
  // BFS từ mạng lưới qua cạnh trống → {dist, prevEdge}
  function bfs(p) {
    const net = mangLuoi(p), dist = new Map(), prev = new Map(), q = [];
    for (const v of net) { dist.set(v, 0); q.push(v); }
    while (q.length) {
      const v = q.shift();
      if (dist.get(v) > 0 && vOwner[v] >= 0 && vOwner[v] !== p.i) continue; // không đi xuyên nhà người khác
      for (const eid of M.verts[v].edges) {
        if (eOwner[eid] >= 0) continue;
        const e = M.edges[eid], w = e.a === v ? e.b : e.a;
        if (dist.has(w)) continue;
        dist.set(w, dist.get(v) + 1); prev.set(w, eid); q.push(w);
      }
    }
    return { dist, prev, net };
  }
  const canhDauTien = (b, target) => { let v = target, eid = null; while (b.dist.get(v) > 0) { eid = b.prev.get(v); const e = M.edges[eid]; v = e.a === v ? e.b : e.a; } return eid; };
  const vaoDuoc = (p, h) => { const net = mangLuoi(p); return h.corners.some(c => net.has(c)); };

  // ---- tài chính ----
  function coTheTra(p, cost) {
    let thieu = 0, du = 0, vang = p.kho.vang - (cost.vang || 0);
    if (vang < 0) return false;
    for (const r of CFG.res) { const c = cost[r] || 0, d = p.kho[r] - c; if (d < 0) thieu -= d; else du += d; }
    if (thieu <= vang) return true;
    return (thieu - vang) * 4 <= du;
  }
  function tra(p, cost) {
    p.kho.vang -= cost.vang || 0;
    const thieuR = [];
    for (const r of CFG.res) { const c = cost[r] || 0; if (p.kho[r] >= c) p.kho[r] -= c; else { thieuR.push(c - p.kho[r]); p.kho[r] = 0; } }
    let thieu = thieuR.reduce((a, b) => a + b, 0);
    const vDung = Math.min(p.kho.vang, thieu); p.kho.vang -= vDung; thieu -= vDung;
    // đổi ngân hàng 4:1 từ loại dư nhiều nhất
    while (thieu > 1e-9) {
      const r = CFG.res.reduce((a, b) => p.kho[a] >= p.kho[b] ? a : b);
      const lay = Math.min(p.kho[r], thieu * 4); p.kho[r] -= lay; thieu -= lay / 4;
      if (lay <= 0) throw new Error('tra: không đủ');
    }
  }

  // ---- đặt nhà ban đầu (rắn 1-2-3-4-4-3-2-1) ----
  const thuTu = [0, 1, 2, 3, 3, 2, 1, 0];
  thuTu.forEach((pi, k) => {
    const p = P[pi];
    let best = -1, bv = -1;
    for (const v of M.verts) if (hopLeNha(v.id)) { const g = giaTriDinh(v.id, p) + rnd(); if (g > bv) { bv = g; best = v.id; } }
    vOwner[best] = pi; vLevel[best] = 1;
    const eid = pick(M.verts[best].edges.filter(e => eOwner[e] < 0)); if (eid != null) eOwner[eid] = pi;
    if (k >= 4) for (const hi of M.verts[best].hexes) { const h = M.hexes[hi]; if (h.res) p.kho[h.res] += 100; }
  });

  // ---- hành động ----
  function hanhDong(p, t) {
    const L = p.L;
    for (let buoc = 0; buoc < 14; buoc++) {
      let lam = false;
      for (const loai of L.uuTien) { if (thu(loai)) { lam = true; p.soHanhDong++; break; } }
      if (!lam) break;
    }
    function thu(loai) {
      if (loai === 'nha') {
        const net = mangLuoi(p);
        let best = null, bv = 0;
        for (const v of net) if (hopLeNha(v)) { const g = giaTriDinh(v, p); if (g > bv) { bv = g; best = v; } }
        const cNha = Object.fromEntries(Object.entries(CFG.cost.nha).map(([k, v]) => [k, v * (1 + CFG.nhaTang * nhaCua(p).length)]));
        if (best == null || !coTheTra(p, cNha)) return false;
        tra(p, cNha); vOwner[best] = p.i; vLevel[best] = 1; return true;
      }
      if (loai === 'len') {
        let best = null, bg = 0;
        for (const v of nhaCua(p)) {
          const cap = vLevel[v.id]; if (cap >= 5) continue;
          const cost = CFG.cost.len[cap];
          if (!coTheTra(p, cost)) continue;
          const br = vBranch[v.id] || (L.nhanh === 'dothi' ? 'dothi' : chonChuyen(v, p));
          const now = v.hexes.reduce((s, hi) => s + giaTriO(M.hexes[hi], p, cap, vBranch[v.id]), 0);
          const sau = v.hexes.reduce((s, hi) => s + giaTriO(M.hexes[hi], p, cap + 1, br), 0);
          const g = (sau - now) + (CFG.diemCap[cap + 1] - CFG.diemCap[cap]) * 0.3;
          if (g > bg) { bg = g; best = { v, br, cost }; }
        }
        if (!best) return false;
        tra(p, best.cost); vLevel[best.v.id]++; vBranch[best.v.id] = best.br; return true;
      }
      if (loai === 'linh') {
        const tong = p.linh[0] + p.linh[1] + p.linh[2];
        if (tong >= L.linh(t)) return false;
        const nuoi = nhaCua(p).reduce((s, v) => s + CFG.nuoi[vLevel[v.id]], 0);
        if (tong >= nuoi) { p.chamTran++; return false; }
        const loaiLinh = chonLoaiLinh(p);
        const hs = 1 + CFG.giaTang * tong, goc = CFG.cost.linh[loaiLinh];
        const cost = Object.fromEntries(Object.entries(goc).map(([k, v]) => [k, v * hs]));
        // giữ lúa đủ trả lương lượt sau
        if (!coTheTra(p, { ...cost, lua: (cost.lua || 0) + CFG.luong * (tong + 1) })) return false;
        tra(p, cost); p.linh[loaiLinh]++; return true;
      }
      if (loai === 'nangLinh') {
        const capMax = Math.max(0, ...nhaCua(p).map(v => vLevel[v.id]));
        const ds = [0, 1, 2].filter(u => p.linh[u] > 0 && p.bac[u] < 3 && capMax >= CFG.bacLinh.canNha[p.bac[u] + 1]).sort((a, b) => p.linh[b] - p.linh[a]);
        for (const u of ds) { const cost = CFG.bacLinh.cost[p.bac[u] + 1]; if (p.linh[u] >= 3 && coTheTra(p, cost)) { tra(p, cost); p.bac[u]++; return true; } }
        return false;
      }
      if (loai === 'duong' || loai === 'duongZone') {
        if (!coTheTra(p, CFG.cost.duong)) return false;
        const b = bfs(p);
        let target = null, bv = -1;
        if (loai === 'duongZone' || (L.tier.length && p.vaoZone == null && t >= 3)) {
          // đường tới đỉnh gần nhất của ô khám phá được phép
          for (const h of M.zone) if (L.tier.includes(h.tier)) for (const c of h.corners) {
            const d = b.dist.get(c); if (d > 0 && (target == null || d < bv)) { bv = d; target = c; }
          }
          if (loai === 'duongZone' && target == null) return false;
        }
        if (target == null) {
          if ([...b.net].some(v => hopLeNha(v))) return false;
          for (const [v, d] of b.dist) if (d > 0 && d <= 3 && hopLeNha(v)) { const g = giaTriDinh(v, p) / (1 + 0.35 * d); if (g > bv) { bv = g; target = v; } }
        }
        if (target == null) return false;
        const eid = canhDauTien(b, target); if (eid == null) return false;
        tra(p, CFG.cost.duong); eOwner[eid] = p.i; return true;
      }
      if (loai === 'the') {
        const tong = CFG.res.reduce((s, r) => s + p.kho[r], 0);
        if (tong < 900 || !coTheTra(p, CFG.cost.the)) return false;
        tra(p, CFG.cost.the);
        const x = rnd();
        if (x < 0.25) p.diemAn += 100;
        else if (x < 0.6) p.linh[chonLoaiLinh(p)]++;
        else if (x < 0.8) { for (let k = 0; k < 2; k++) { const b = bfs(p); let tg = null, bv = -1; for (const [v, d] of b.dist) if (d === 1) { const g = giaTriDinh(v, p); if (g > bv) { bv = g; tg = v; } } if (tg != null) eOwner[canhDauTien(b, tg)] = p.i; } }
        else { const r = CFG.res.reduce((a, b) => p.kho[a] <= p.kho[b] ? a : b); p.kho[r] += 200; }
        return true;
      }
      return false;
    }
  }
  function chonChuyen(v, p) {
    let best = null, bv = -1;
    for (const hi of v.hexes) { const h = M.hexes[hi]; if (h.pips) { const g = giaTriO(h, p); if (g > bv) { bv = g; best = h.res; } } }
    return best || 'dothi';
  }
  function chonLoaiLinh(p) {
    const ok = M.zone.filter(h => p.L.tier.includes(h.tier) && vaoDuoc(p, h));
    const ds = ok.length ? ok : M.zone.filter(h => p.L.tier.includes(h.tier));
    if (!ds.length) return Math.floor(rnd() * 3);
    // loại lính khắc quái (quai = chỉ số loại lính khắc nó), ưu tiên ô cấp cao
    const dem = [0, 0, 0]; ds.forEach(h => { dem[h.quai] += h.tier; });
    const cur = p.linh;
    return [0, 1, 2].reduce((a, b) => dem[a] / (1 + cur[a]) >= dem[b] / (1 + cur[b]) ? a : b);
  }

  // ---- khám phá ----
  // khắc: kỵ(2) > cung(1) > bộ(0) > kỵ(2)
  const khac = (u, v) => (u === 2 && v === 1) || (u === 1 && v === 0) || (u === 0 && v === 2);
  const heSoKhac = (u, v) => khac(u, v) ? CFG.khac : khac(v, u) ? CFG.biKhac : 1;
  const mOf = p => p.bac.map(b => CFG.bacLinh.mult[b]);
  function heSoKP(u, quai) {
    if (u === quai) return CFG.heSoLinh * CFG.khac;
    const giaDang = [0, 1, 2].find(x => khac(quai, x)); // quái "đóng vai" loại bị lính quai khắc
    if (khac(giaDang, u)) return CFG.heSoLinh * CFG.biKhac;
    return CFG.heSoLinh;
  }
  const diemKP = (arr, quai, m = [1, 1, 1]) => { const n = arr[0] + arr[1] + arr[2]; if (!n) return 0; const tb = (arr[0] * heSoKP(0, quai) * m[0] + arr[1] * heSoKP(1, quai) * m[1] + arr[2] * heSoKP(2, quai) * m[2]) / n; return tb * CFG.g(n); };
  const giaTriDiem = h => { const K = CFG.kp[h.tier].K; return (K.res + 3 * K.vang + 1.5 * K.cc) / CFG.kp[h.tier].E; };

  function phaiQuan(p) {
    const alloc = new Map();
    const ds = M.zone.filter(h => h.hoi === 0 && p.L.tier.includes(h.tier) && vaoDuoc(p, h));
    if (ds.length && p.vaoZone == null) p.vaoZone = curT;
    if (!ds.length) return alloc;
    const con = [...p.linh];
    for (;;) {
      let best = null, bg = 0;
      for (const h of ds) {
        if (p.L.ne && (h.presence.dich || 0) > (p.linh[0] + p.linh[1] + p.linh[2])) continue;
        const a = alloc.get(h) || [0, 0, 0], n = a[0] + a[1] + a[2];
        if (n >= CFG.kp[h.tier].tran) continue;
        const cur = Math.min(diemKP(a, h.quai, mOf(p)), h.Erem);
        for (const u of [0, 1, 2]) {
          if (!con[u]) continue;
          const b = [...a]; b[u]++;
          const g = (Math.min(diemKP(b, h.quai, mOf(p)), h.Erem) - cur) * giaTriDiem(h);
          if (g > bg) { bg = g; best = { h, u }; }
        }
      }
      if (!best || bg < CFG.luong) break;
      p.quanCap[best.h.tier]++;
      const a = alloc.get(best.h) || [0, 0, 0]; a[best.u]++; alloc.set(best.h, a); con[best.u]--;
    }
    return alloc;
  }
  function giaiQuyetZone(allocs) {
    for (const h of M.zone) {
      if (h.hoi > 0) continue;
      const ai = P.filter(p => allocs[p.i].has(h)).map(p => ({ p, a: allocs[p.i].get(h), matTL: 0, thang: 0 }));
      h.presence = { dich: Math.max(0, ...ai.map(x => x.a[0] + x.a[1] + x.a[2])) };
      if (!ai.length) continue;
      if (h.batDau == null) h.batDau = curT;
      h.luotCoQuan = (h.luotCoQuan || 0) + 1;
      // chiến tranh từng cặp, tính trên sức mạnh đầu trận
      for (let x = 0; x < ai.length; x++) for (let y = x + 1; y < ai.length; y++) {
        const A = ai[x], B = ai[y];
        if (A.p.team === B.p.team || rnd() >= CFG.xsChien) continue;
        S.tran++;
        const sA = sucManh(A.a, B.a, mOf(A.p)), sB = sucManh(B.a, A.a, mOf(B.p));
        const [W, Lz, sw, sl] = sA >= sB ? [A, B, sA, sB] : [B, A, sB, sA];
        const r = sl > 0 ? sw / sl : 99;
        const pYeu = r >= 2 ? 0 : 0.5 * Math.pow(2 - r, CFG.mu);
        let thang = W, thua = Lz; if (rnd() < pYeu) { thang = Lz; thua = W; S.lat++; }
        const rr = thang === W ? r : 1 / r;
        thua.matTL += Math.min(0.5, 0.2 * Math.max(1, rr));
        thang.matTL += 0.3 / Math.max(rr, 0.5) * (rr >= 1 ? 1 : 1);
        thang.thang++; thang.p.thang++; thua.p.thua++;
      }
      for (const x of ai) if (x.matTL > 0) {
        const tl = Math.min(CFG.tranThietHai, x.matTL);
        for (const u of [0, 1, 2]) { const mat = roundNgauNhien(x.a[u] * tl); x.a[u] -= mat; x.p.linh[u] -= mat; }
      }
      // khai thác
      const diem = ai.map(x => diemKP(x.a, h.quai, mOf(x.p)));
      const tong = diem.reduce((a, b) => a + b, 0);
      if (tong <= 0) continue;
      const k = Math.min(1, h.Erem / tong), c = CFG.kp[h.tier];
      ai.forEach((x, i) => {
        const tl = diem[i] * k / c.E * (1 + CFG.thuongThang * x.thang);
        const res = c.K.res * tl, vang = c.K.vang * tl, cc = c.K.cc * tl;
        for (const r of CFG.res) x.p.kho[r] += res / 5;
        x.p.kho.vang += vang; x.p.vangTong += vang; x.p.cc += cc; x.p.thuKp += res + vang;
      });
      h.Erem -= tong * k;
      if (h.Erem <= 1e-6) { S.zoneCan[h.tier].push(h.luotCoQuan); h.hoi = CFG.hoi + 1; }
    }
    for (const h of M.zone) if (h.hoi > 0) { h.hoi--; if (h.hoi === 0) { spawn(h); S.zoneRespawn++; } }
  }
  const sucManh = (a, b, m = [1, 1, 1]) => { const nb = b[0] + b[1] + b[2]; if (!nb) return a[0] * m[0] + a[1] * m[1] + a[2] * m[2]; let s = 0; for (const u of [0, 1, 2]) for (const v of [0, 1, 2]) s += a[u] * m[u] * (b[v] / nb) * heSoKhac(u, v); return s; };
  const roundNgauNhien = x => Math.floor(x) + (rnd() < x - Math.floor(x) ? 1 : 0);

  // ---- vòng lặp lượt ----
  let curT = 0;
  for (let t = 1; t <= CFG.soLuot; t++) {
    curT = t;
    const truoc = P.map(p => CFG.res.reduce((s, r) => s + p.kho[r], 0) + p.kho.vang);
    // ① 4 lần đổ + bị động
    for (const roller of P) {
      const so = d6() + d6();
      if (so === 7) { P[roller.i].kho[pick(CFG.res)] += CFG.baySo; continue; }
      for (const h of M.land) if (h.num === so) for (const c of h.corners) if (vOwner[c] >= 0) {
        const q = P[vOwner[c]], v = heSo(vLevel[c], vBranch[c], h.res) * 100; q.kho[h.res] += v; q.thuXx += v;
      }
    }
    if (passive) for (const h of M.land) for (const c of h.corners) if (vOwner[c] >= 0) {
      const q = P[vOwner[c]], v = heSo(vLevel[c], vBranch[c], h.res) * CFG.bidong[h.pips]; q.kho[h.res] += v; q.thuBd += v;
    }
    P.forEach((p, i) => p.thuNhapLuot.push(CFG.res.reduce((s, r) => s + p.kho[r], 0) + p.kho.vang - truoc[i]));
    // ② hành động theo thứ tự ưu tiên xoay vòng
    const order = [0, 1, 2, 3].map(k => P[(k + t) % 4]);
    for (const p of order) hanhDong(p, t);
    // chia tài nguyên trong đội
    if (team) for (const p of P) { const bn = P.find(q => q.team === p.team && q !== p); for (const r of CFG.res) if (p.kho[r] > 600 && bn.kho[r] < 150) { const g = Math.min(p.kho[r] - 600, 300); p.kho[r] -= g; bn.kho[r] += g * (1 - CFG.phiGui); } }
    // ③ khám phá + lương
    const allocs = P.map(p => phaiQuan(p));
    giaiQuyetZone(allocs);
    for (const p of P) {
      let luong = (p.linh[0] + p.linh[1] + p.linh[2]) * CFG.luong;
      const tuLua = Math.min(p.kho.lua, luong); p.kho.lua -= tuLua; luong -= tuLua;
      const tuVang = Math.min(p.kho.vang, luong); p.kho.vang -= tuVang; luong -= tuVang;
      while (luong > 0 && p.linh.some(x => x > 0)) { const u = [0, 1, 2].find(x => p.linh[x] > 0); p.linh[u]--; luong -= CFG.luong; } // bỏ ngũ
    }
  }

  // ---- tính điểm ----
  const dd = P.map(p => duongDai(p));
  const maxD = Math.max(...dd);
  P.forEach((p, i) => {
    p.diemCT = nhaCua(p).reduce((s, v) => s + CFG.diemCap[vLevel[v.id]], 0);
    p.diemDuong = (dd[i] >= 5 && dd[i] === maxD && dd.filter(x => x === maxD).length === 1) ? CFG.duongDaiNhat : 0;
    p.diem = p.diemCT + p.diemDuong + p.diemAn + p.cc;
    p.capMax = Math.max(0, ...nhaCua(p).map(v => vLevel[v.id]));
    p.soNha = nhaCua(p).length;
    p.linhCuoi = p.linh[0] + p.linh[1] + p.linh[2];
    p.bacMax = Math.max(...p.bac);
    p.soDuong = eOwner.filter(o => o === p.i).length;
    p.biChan = p.L.tier.length > 0 && !M.zone.some(h => p.L.tier.includes(h.tier) && [...bfs(p).dist.keys()].some(v => h.corners.includes(v)));
  });
  let thang;
  if (team) {
    const qA = [0, 1, 2].map(u => P[0].linh[u] + P[1].linh[u]), qB = [0, 1, 2].map(u => P[2].linh[u] + P[3].linh[u]);
    const sA = sucManh(P[0].linh, qB, mOf(P[0])) + sucManh(P[1].linh, qB, mOf(P[1])), sB = sucManh(P[2].linh, qA, mOf(P[2])) + sucManh(P[3].linh, qA, mOf(P[3]));
    if (sA === 0 && sB === 0) thang = rnd() < 0.5 ? 0 : 1;
    else { const [w, sw, sl] = sA >= sB ? [0, sA, sB] : [1, sB, sA]; const r = sl > 0 ? sw / sl : 99; const pY = r >= 2 ? 0 : 0.5 * Math.pow(2 - r, CFG.mu); thang = rnd() < pY ? 1 - w : w; S.dcR = r; }
  } else {
    const m = Math.max(...P.map(p => p.diem)); const ws = P.filter(p => p.diem === m); thang = pick(ws).i;
  }
  return { P, thang, S };

  function duongDai(p) {
    const mine = M.edges.filter(e => eOwner[e.id] === p.i);
    let best = 0;
    const dfs = (v, used, len) => {
      best = Math.max(best, len);
      if (len > 0 && vOwner[v] >= 0 && vOwner[v] !== p.i) return;
      for (const e of mine) if (!used.has(e.id) && (e.a === v || e.b === v)) { used.add(e.id); dfs(e.a === v ? e.b : e.a, used, len + 1); used.delete(e.id); }
    };
    const starts = new Set(mine.flatMap(e => [e.a, e.b]));
    for (const v of starts) dfs(v, new Set(), 0);
    return best;
  }
}

// ---------- Kịch bản ----------
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const sd = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };
const pct = x => (100 * x).toFixed(1) + '%';
const f0 = x => Math.round(x).toLocaleString('en-US');

function chayFFA(ten, dsLoi, opt = {}) {
  if (!chay(ten)) return;
  const stat = dsLoi.map(() => ({ thang: 0, diem: [], ct: [], cc: [], an: [], duong: [], cap: [], nha: [], linh: [], vang: [], xx: [], bd: [], kp: [], vaoZone: [], chan: 0, hd: [], thuL5: [], bacMax: [], chamTran: [], duongSo: [], qc: { 1: 0, 2: 0, 3: 0 }, thang_tran: 0, thua_tran: 0 }));
  const agg = { tran: 0, lat: 0, can: { 1: [], 2: [], 3: [] }, respawn: 0 };
  for (let g = 0; g < N_VAN; g++) {
    const perm = shuffle([0, 1, 2, 3]);                     // xoay ghế
    const { P, thang, S } = choiVan(perm.map(k => dsLoi[k]), opt);
    P.forEach((p, seat) => {
      const s = stat[perm[seat]];
      if (thang === seat) s.thang++;
      s.diem.push(p.diem); s.ct.push(p.diemCT); s.cc.push(p.cc); s.an.push(p.diemAn); s.duong.push(p.diemDuong);
      s.cap.push(p.capMax); s.nha.push(p.soNha); s.linh.push(p.linhCuoi); s.vang.push(p.vangTong);
      s.xx.push(p.thuXx); s.bd.push(p.thuBd); s.kp.push(p.thuKp); if (p.vaoZone != null) s.vaoZone.push(p.vaoZone); if (p.biChan) s.chan++;
      s.hd.push(p.soHanhDong / CFG.soLuot); s.thuL5.push(p.thuNhapLuot.slice(0, 5).reduce((a, b) => a + b, 0));
      s.duongSo.push(p.soDuong); for (const k of [1, 2, 3]) s.qc[k] += p.quanCap[k];
      s.bacMax.push(p.bacMax); s.chamTran.push(p.chamTran > 0 ? 1 : 0);
      s.thang_tran += p.thang; s.thua_tran += p.thua;
    });
    agg.tran += S.tran; agg.lat += S.lat; agg.respawn += S.zoneRespawn; for (const k of [1, 2, 3]) agg.can[k].push(...S.zoneCan[k]);
  }
  console.log(`\n### ${ten}\n`);
  console.log('| Lối chơi | Thắng | Điểm TB | Công trình | Chiến công | Điểm ẩn | Đường | Cấp max TB | Nhà | Lính cuối | Vàng thu | Thu xúc xắc | Thu bị động | Thu khám phá | Vào vùng KP (lượt) | Bị chặn | Hành động/lượt | Thu 5 lượt đầu: TB ± độ lệch | Số đường | Lượt-lính ở ô cấp 1/2/3 (TB/ván) | Bậc lính max TB | Từng chạm trần quân |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  dsLoi.forEach((L, i) => {
    const s = stat[i];
    console.log(`| ${L.ten}${L.dat !== 'bal' ? ` [đặt ${L.dat === 'high' ? '6-8' : '2-12'}]` : ''} | **${pct(s.thang / N_VAN)}** | ${f0(mean(s.diem))} | ${f0(mean(s.ct))} | ${f0(mean(s.cc))} | ${f0(mean(s.an))} | ${f0(mean(s.duong))} | ${mean(s.cap).toFixed(1)} | ${mean(s.nha).toFixed(1)} | ${mean(s.linh).toFixed(1)} | ${f0(mean(s.vang))} | ${f0(mean(s.xx))} | ${f0(mean(s.bd))} | ${f0(mean(s.kp))} | ${s.vaoZone.length ? mean(s.vaoZone).toFixed(1) + ` (${pct(s.vaoZone.length / N_VAN)})` : '—'} | ${pct(s.chan / N_VAN)} | ${mean(s.hd).toFixed(1)} | ${f0(mean(s.thuL5))} ± ${f0(sd(s.thuL5))} (${pct(sd(s.thuL5) / mean(s.thuL5))}) | ${mean(s.duongSo).toFixed(1)} | ${[1, 2, 3].map(k => (s.qc[k] / N_VAN).toFixed(1)).join(' / ')} | ${mean(s.bacMax).toFixed(2)} | ${pct(mean(s.chamTran))} |`);
  });
  console.log(`\nChiến tranh/ván: ${(agg.tran / N_VAN).toFixed(1)} · lật kèo: ${pct(agg.lat / Math.max(1, agg.tran))} · ô khám phá xuất hiện lại/ván: ${(agg.respawn / N_VAN).toFixed(1)} · số lượt có quân khai thác tới khi cạn ô: cấp 1 = ${mean(agg.can[1]).toFixed(1)} (${agg.can[1].length} lần), cấp 2 = ${mean(agg.can[2]).toFixed(1)} (${agg.can[2].length}), cấp 3 = ${mean(agg.can[3]).toFixed(1)} (${agg.can[3].length})`);
}

function chayDoi(ten, doiA, doiB) {
  if (!chay(ten)) return;
  let thangA = 0; const rs = [];
  for (let g = 0; g < N_VAN; g++) {
    const doiTruoc = rnd() < 0.5;   // đổi vị trí đội để khử lợi thế ghế
    const ds = doiTruoc ? [...doiA, ...doiB] : [...doiB, ...doiA];
    const { thang, S } = choiVan(ds, { team: true });
    if ((thang === 0) === doiTruoc) thangA++;
    if (S.dcR) rs.push(S.dcR);
  }
  console.log(`| ${ten} | ${doiA.map(l => l.ten).join(' + ')} | ${doiB.map(l => l.ten).join(' + ')} | **${pct(thangA / N_VAN)}** | ${pct(rs.filter(r => r >= 2).length / Math.max(1, rs.length))} |`);
}

console.log(`# Mô phỏng BK Catan — ${N_VAN} ván/kịch bản, seed ${seed}, ${CFG.soLuot} lượt`);
const t0 = Date.now();
chayFFA('A. Chỗ đặt nhà: 2 bot dồn 6-8 vs 2 bot dồn 2-12 (cùng lối Cân bằng)', [variant('CB', { dat: 'high' }), variant('CB', { dat: 'high' }), variant('CB', { dat: 'low' }), variant('CB', { dat: 'low' })]);
chayFFA('A0. Đối chứng Catan gốc: TẮT thu bị động, cả 4 dồn 6-8', [variant('CB', { dat: 'high' }), variant('CB', { dat: 'high' }), variant('CB', { dat: 'high' }), variant('CB', { dat: 'high' })], { passive: false });
chayFFA('A1. BẬT thu bị động, cả 4 dồn 6-8', [variant('CB', { dat: 'high' }), variant('CB', { dat: 'high' }), variant('CB', { dat: 'high' }), variant('CB', { dat: 'high' })]);
chayFFA('B. 4 người riêng lẻ: 4 lối chơi khác nhau', [LOI.CB, LOI.KT, LOI.QS, LOI.NE]);
chayFFA('D. Bot lai "thông minh": luyện quân xen kẽ xây nhà', [
  { ...LOI.CB, ten: 'Lai (quân trước, rồi nhà)', linh: t => Math.min(12, 2 + t), uuTien: ['linh', 'nangLinh', 'duongZone', 'nha', 'len', 'duong', 'the'], zoneBonus: 30 },
  { ...LOI.CB, ten: 'Lai (nhà trước, quân 8)', linh: t => Math.min(8, 1 + t), uuTien: ['nha', 'linh', 'nangLinh', 'len', 'duongZone', 'duong', 'the'], zoneBonus: 30 },
  LOI.KT, LOI.QS]);
console.log('\n### C. 2 đấu 2 — Đại chiến cuối ván\n');
console.log('| Kịch bản | Đội A | Đội B | Đội A thắng | Trận cuối chênh ≥ 2 lần (thắng chắc) |');
console.log('|---|---|---|---|---|');
chayDoi('C0 đối chứng', [LOI.CB, LOI.CB], [LOI.CB, LOI.CB]);
chayDoi('C1 dồn quân phút chót', [LOI.CB, LOI.CB], [LOI.KTmuon, LOI.KTmuon]);
chayDoi('C2 quân sớm', [LOI.QS, LOI.QS], [LOI.CB, LOI.CB]);
chayDoi('C3 chuyên hoá', [LOI.KT, LOI.QS], [LOI.CB, LOI.CB]);
chayDoi('C4 quân giữa ván', [LOI.QS, LOI.QS], [LOI.QGiua, LOI.QGiua]);
chayDoi('C5 quân phút chót vs quân sớm', [LOI.QS, LOI.QS], [LOI.KTmuon, LOI.KTmuon]);
chayDoi('C6 gương quân sớm', [LOI.QS, LOI.QS], [LOI.QS, LOI.QS]);
console.log(`\n_(chạy ${((Date.now() - t0) / 1000).toFixed(0)}s)_`);
