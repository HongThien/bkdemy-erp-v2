/* BK Catan — bàn cờ 3D cho TV (three.js r128 + mô hình KayKit trong bk-catan-assets.js).
   API: BKC3D.init(canvas) → Promise · BKC3D.render(st, {flashV, flashE}) · BKC3D.explore(ev, st) · BKC3D.ok */
(function () {
'use strict';
const T = window.THREE, E = window.BKCATAN, A = window.BKC_ASSETS;
const COLN = ['red', 'blue', 'green', 'yellow'];
// màu mặt ô: lớp phủ gốc của hex_grass là vàng-xanh nên nhuộm nhân không ra tím/xám → bỏ map, tô màu phẳng
const RES_TINT = { go: 0x3f8f45, gach: 0xb3452a, lua: 0xe9c94c, cuu: 0xb9e69c, quang: 0x9ea3ae };
const TIER_TINT = { 1: 0xf1f1f4, 2: 0xd2d5dc, 3: 0xaeb3bf }; // ô khám phá: trắng → xám theo cấp (Thùy 24/09)
const COOL_TINT = 0x80859a;
const CHAR = ['Barbarian', 'Rogue', 'Druid']; // quái 0/1/2
const GAP = 0.9; // ô co còn 90% → khe giữa các ô là chỗ của đường

let R, scene, cam, clock, loader, root, dyn, zoneG, fx, tgtG;
const lib = {}; let clips = [];
let tileScale = 1, tileRot = 0, topY = 0, builtSeed = null;
const mixers = [], anims = [], tiles = {};
const zoneState = {}; // h → {key, group}
let last = null, t0 = performance.now();

const b64ToBuf = b => { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u.buffer; };
const parse = name => new Promise((res, rej) => loader.parse(b64ToBuf(A.models[name]), '', res, rej));

async function init(canvas) {
  if (!T || !T.GLTFLoader || !A) throw new Error('thiếu thư viện 3D');
  R = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  R.outputEncoding = T.sRGBEncoding; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
  R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  scene = new T.Scene();
  cam = new T.PerspectiveCamera(36, 1, 0.1, 200);
  clock = new T.Clock();
  scene.add(new T.HemisphereLight(0xdff2ff, 0x3f5a2a, 0.6));
  const sun = new T.DirectionalLight(0xfff0d8, 1.15);
  sun.position.set(-8, 16, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera; sc.left = -14; sc.right = 14; sc.top = 14; sc.bottom = -14; sc.far = 60; sun.shadow.bias = -0.0005;
  scene.add(sun);
  loader = new T.GLTFLoader();
  for (const n of Object.keys(A.models)) {
    if (CHAR.includes(n)) continue;
    const g = await parse(n);
    if (n === 'Rig_General') { clips = g.animations; continue; }
    g.scene.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    lib[n] = g.scene;
  }
  // đo ô lục giác: xoay cho khớp "đỉnh nhọn lên trên" (pointy-top) và co về bán kính 1
  const box = new T.Box3().setFromObject(lib.hex_grass), sx = box.max.x - box.min.x, sz = box.max.z - box.min.z;
  tileRot = sx > sz ? Math.PI / 6 : 0;
  tileScale = 2 / Math.max(sx, sz);
  topY = box.max.y * tileScale;
  root = new T.Group(); scene.add(root);
  dyn = new T.Group(); scene.add(dyn);
  zoneG = new T.Group(); scene.add(zoneG);
  fx = new T.Group(); scene.add(fx);
  tgtG = new T.Group(); scene.add(tgtG);
  // mây trôi
  for (let i = 0; i < 6; i++) {
    const c = kit(i % 2 ? 'cloud_big' : 'cloud_small'); c.position.set(-18 + i * 7, 9 + (i % 3), -12 + (i * 3) % 6); // mây trôi phía sau bàn, không che ô
    c.traverse(m => { if (m.isMesh) { m.castShadow = false; m.material = m.material.clone(); m.material.transparent = true; m.material.opacity = .85; } });
    c.userData.drift = 0.25 + (i % 3) * 0.1; fx.add(c);
  }
  resize(); addEventListener('resize', resize);
  loop();
  API.ok = true;
}
function resize() {
  const c = R.domElement, w = c.parentElement.clientWidth, h = c.parentElement.clientHeight;
  R.setSize(w, h, false); cam.aspect = w / h;
  // khung nhìn: đủ 7 ô ngang (đất) + viền biển
  // vừa khít bàn dẹt: nửa rộng ~8.8, nửa sâu ~6.5 (tính cả mép biển), máy quay nghiêng ~52°
  const vf = cam.fov * Math.PI / 360, hf = Math.atan(Math.tan(vf) * cam.aspect);
  const dist = Math.max(8.9 / Math.tan(hf), 7.4 / Math.tan(vf)); // bàn 51 ô: rộng ~15.6
  VIEW.dist0 = dist;
  cam.updateProjectionMatrix(); placeCam(0);
}
function kit(name, tint, flat) {
  const o = lib[name].clone(true);
  if (tint != null) o.traverse(m => { if (m.isMesh) { m.material = m.material.clone(); if (flat) { m.material.map = null; m.material.color.setHex(tint).convertSRGBToLinear(); m.material.roughness = .9; } else m.material.color.multiply(new T.Color(tint)); } });
  o.scale.setScalar(tileScale);
  return o;
}
function fit(o, fp, maxH) {
  const b = new T.Box3().setFromObject(o), sx = b.max.x - b.min.x, sy = b.max.y - b.min.y, sz = b.max.z - b.min.z;
  let k = fp / Math.max(sx, sz, 1e-3); if (maxH && sy * k > maxH) k = maxH / sy;
  o.scale.multiplyScalar(k); b.setFromObject(o); o.position.y -= b.min.y; return o;
}
const at = (o, x, z, y) => { o.position.x = x; o.position.z = z; o.position.y += (y == null ? topY : y); return o; };

// cừu low-poly từ khối cơ bản (KayKit không có cừu): thân trắng, đầu/chân đen, cao ~.2
let sheepMat = null;
function sheep(x, z, ry) {
  if (!sheepMat) sheepMat = { w: new T.MeshStandardMaterial({ color: new T.Color(0xf6f3ea).convertSRGBToLinear(), roughness: 1 }), k: new T.MeshStandardMaterial({ color: new T.Color(0x2e2a2a).convertSRGBToLinear(), roughness: .9 }) };
  const g = new T.Group();
  const body = new T.Mesh(new T.SphereGeometry(.11, 10, 8), sheepMat.w); body.scale.set(1, .8, 1.35); body.position.y = .13; g.add(body);
  const head = new T.Mesh(new T.BoxGeometry(.08, .075, .09), sheepMat.k); head.position.set(0, .16, .17); g.add(head);
  for (const [lx, lz] of [[-.05, .07], [.05, .07], [-.05, -.07], [.05, -.07]]) { const l = new T.Mesh(new T.CylinderGeometry(.016, .016, .09, 6), sheepMat.k); l.position.set(lx, .045, lz); g.add(l); }
  g.traverse(m => { if (m.isMesh) { m.castShadow = true; } });
  g.rotation.y = ry || 0; g.scale.setScalar(1.3); g.position.set(x, topY, z); root.add(g); return g;
}
let qmTex = null;
function qmark() {
  if (!qmTex) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.fillStyle = '#3b3f4c'; g.font = 'bold 112px Segoe UI, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', 64, 70); qmTex = new T.CanvasTexture(c); qmTex.encoding = T.sRGBEncoding; }
  const m = new T.Mesh(new T.PlaneGeometry(1.05, 1.05), new T.MeshBasicMaterial({ map: qmTex, transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.renderOrder = 2; return m;
}
// nhãn nổi (sprite canvas)
function label(lines, o) {
  o = o || {};
  const c = document.createElement('canvas'); c.width = 256; c.height = o.h || 256; const g = c.getContext('2d');
  if (o.token) {
    g.fillStyle = '#f6ecd0'; g.strokeStyle = '#6b5a33'; g.lineWidth = 8;
    g.beginPath(); g.arc(128, 116, 92, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = o.hot ? '#c62828' : '#2b2112'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 96px Segoe UI, Arial'; g.fillText(lines[0], 128, 100);
    g.font = 'bold 44px Segoe UI, Arial'; g.fillText(lines[1], 128, 168);
    if (lines[2]) { g.fillStyle = '#0b1230cc'; roundRect(g, 38, 214, 180, 40, 18); g.fill(); g.fillStyle = '#fff'; g.font = 'bold 30px Segoe UI, Arial'; g.fillText(lines[2], 128, 235); }
  } else {
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const n = lines.length, lh = (o.h || 256) / (n + 0.4);
    lines.forEach((t, i) => {
      g.font = `bold ${o.fs || 52}px Segoe UI, Arial`;
      const w = Math.min(248, g.measureText(t).width + 30);
      if (o.bg !== false) { g.fillStyle = o.bg || '#0b1230d0'; roundRect(g, 128 - w / 2, lh * (i + .7) - lh * .42, w, lh * .84, 16); g.fill(); }
      g.fillStyle = o.col || '#fff'; g.fillText(t, 128, lh * (i + .7));
    });
  }
  const tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding; tex.anisotropy = 4;
  const sp = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const s = o.size || 1; sp.scale.set(s, s * c.height / 256, 1); sp.renderOrder = 10;
  return sp;
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// ---------- cảnh tĩnh: ô đất, biển, cảng ----------
function buildStatic(st) {
  root.clear(); for (const k in zoneState) delete zoneState[k]; zoneG.clear();
  const map = E.buildMap(st.mapSeed);
  const H = (q, r) => ({ x: Math.sqrt(3) * (q + r / 2), z: 1.5 * r });
  // biển: mọi ô ngoài bàn cách mép ≤ 2 ô (bàn dẹt → biển bao theo viền)
  const onMap = new Set(map.hexes.map(h => h.q + ',' + h.r)), hd = (a, b, c, d) => Math.max(Math.abs(a - c), Math.abs(b - d), Math.abs(a - c + b - d));
  for (let q = -10; q <= 10; q++) for (let r = -6; r <= 6; r++) {
    if (onMap.has(q + ',' + r) || !map.hexes.some(h => hd(q, r, h.q, h.r) <= 2)) continue;
    const p = H(q, r), w = kit('hex_water'); w.rotation.y = tileRot; at(w, p.x, p.z, 0); root.add(w);
  }
  let seed = st.mapSeed >>> 0; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (const h of map.hexes) {
    const x = h.x, z = h.y;
    const t = kit('hex_grass', h.zone ? TIER_TINT[h.tier] : RES_TINT[h.res], true); t.scale.multiplyScalar(GAP); t.rotation.y = tileRot; at(t, x, z, 0); root.add(t); tiles[h.id] = t;
    if (h.zone) { h._tile = t; const qm = qmark(); qm.position.set(x, topY + .012, z); root.add(qm); const tk = label(['?', ''], { token: true, size: .72 }); tk.position.set(x, topY + 1.35, z + .1); root.add(tk); continue; } // ô khám phá: dấu ? in trên mặt ô + thẻ ? nổi (cùng cỡ thẻ số)
    const deco = (n, fp, mh, dx, dz, ry) => { const o = fit(kit(n), fp, mh); o.rotation.y = ry == null ? rnd() * 6.28 : ry; at(o, x + (dx || 0), z + (dz || 0)); root.add(o); };
    // Thùy 24/09: 3D tài nguyên phải BÉ (cao ≤ ~.45, nhà cao .7–1.4) và đặc trưng — gỗ = rừng cây nhỏ dày,
    // gạch = đất đỏ gạch (không cây), cừu = đồng cỏ + cừu + cây bé, lúa = ruộng lúa vàng, đá = núi đá thấp.
    const decoT = (n, fp, mh, dx, dz, tint, ry) => { const o = fit(kit(n, tint, true), fp, mh); o.rotation.y = ry == null ? rnd() * 6.28 : ry; at(o, x + (dx || 0), z + (dz || 0)); root.add(o); };
    if (h.res === 'go') { // rừng: ~9 cây nhỏ rải đều trong bán kính .58 (đỉnh lục giác = nút nhà ở bán kính 1)
      for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283 + rnd() * .5, r = .22 + rnd() * .36; deco(k % 3 ? 'tree_single_A' : 'tree_single_B', .2 + rnd() * .08, .32 + rnd() * .1, Math.cos(a) * r, Math.sin(a) * r); }
      deco('trees_B_small', .38, .34, 0, 0);
    }
    if (h.res === 'gach') { decoT('building_dirt', 1.4, .1, 0, 0, 0xa03d24); decoT('resource_stone', .26, .16, .3, .2, 0xc2573a); decoT('resource_stone', .2, .13, -.32, -.18, 0xb44d33); }
    if (h.res === 'lua') { deco('building_grain', 1.65, .12, 0, 0, tileRot); deco('sack', .16, .18, .5, .38); }
    if (h.res === 'cuu') { sheep(x - .18, z + .1, rnd() * 6.28); sheep(x + .3, z - .22, rnd() * 6.28); deco('trees_B_small', .3, .3, -.4, -.35); deco('tree_single_B', .18, .28, .42, .3); }
    if (h.res === 'quang') { decoT('mountain_C', .9, .5, 0, -.05, 0xa2a6b0); deco('rock_single_B', .22, .18, .5, .32); deco('rock_single_D', .18, .15, -.5, .3); }
    // thẻ số + bị động
    const tok = label([String(h.num), '•'.repeat(h.pips), `+${E.CFG.bidong[h.pips]}/lượt`], { token: true, hot: h.pips === 5, size: .72 });
    tok.position.set(x, topY + 1.35, z + .1); root.add(tok);
  }
  // khe đường (mọi cạnh) + nút nhà (mọi đỉnh): có sẵn trên bàn để nhìn/chọn dễ
  const slotMat = new T.MeshStandardMaterial({ color: new T.Color(0xd9c7a0).convertSRGBToLinear(), roughness: 1 });
  const nodeMat = new T.MeshStandardMaterial({ color: new T.Color(0xece4d0).convertSRGBToLinear(), roughness: .8 });
  const slotGeo = new T.BoxGeometry(.12, .05, 1), nodeGeo = new T.CylinderGeometry(.15, .17, .07, 18);
  for (const e of map.edges) {
    const a = map.verts[e.a], b = map.verts[e.b], len = Math.hypot(b.x - a.x, b.y - a.y) * .66;
    const m = new T.Mesh(slotGeo, slotMat); m.scale.z = len; m.receiveShadow = true;
    m.position.set((a.x + b.x) / 2, topY - .005, (a.y + b.y) / 2); m.rotation.y = Math.atan2(b.x - a.x, b.y - a.y); root.add(m);
  }
  for (const v of map.verts) { const n = new T.Mesh(nodeGeo, nodeMat); n.receiveShadow = true; n.position.set(v.x, topY + .01, v.y); root.add(n); }
  // cảng
  for (const pt of map.ports) {
    const e = map.edges[pt.edge], a = map.verts[e.a], b = map.verts[e.b];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, len = Math.hypot(mx, my), px = mx / len * (len + .75), pz = my / len * (len + .75);
    const br = fit(kit('building_bridge_A'), .7, .3); br.rotation.y = Math.atan2(mx, my); at(br, (mx + px) / 2, (my + pz) / 2, topY * .7); root.add(br);
    const bl = fit(kit('barrel'), .22, .3); at(bl, px, pz, topY * .8); root.add(bl);
    const lb = label([`${pt.rate}:1 ${pt.kind === '*' ? '⚓' : E.RES_IC[pt.kind]}`], { fs: 58, size: .95, h: 110, bg: '#f6ecd0', col: '#2b2112' });
    lb.position.set(px, topY + .75, pz); root.add(lb);
  }
  builtSeed = st.mapSeed;
}

// ---------- ô khám phá: quái + nhãn (dựng lại khi quái/hồi đổi) ----------
async function monster(q) {
  const g = await parse(CHAR[q]); const m = g.scene;
  m.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
  const b = new T.Box3().setFromObject(m); const s = 0.95 / (b.max.y - b.min.y); m.scale.setScalar(s);
  const mx = new T.AnimationMixer(m); const idle = clips.find(c => /idle/i.test(c.name)) || clips[0];
  if (idle) mx.clipAction(idle).play();
  mixers.push(mx); m.userData.mixer = mx;
  return m;
}
function renderZones(st) {
  const map = E.buildMap(st.mapSeed);
  for (const z of st.zone) {
    const h = map.hexes[z.h], pct = Math.round(z.Erem / E.CFG.kp[z.tier].E * 100);
    const key = `${z.quai}|${z.hoi > 0}|${z.tier}`;
    let zs = zoneState[z.h];
    if (!zs || zs.key !== key) {
      if (zs) { zoneG.remove(zs.group); if (zs.mixer) mixers.splice(mixers.indexOf(zs.mixer), 1); }
      const g = new T.Group(); zs = zoneState[z.h] = { key, group: g }; zoneG.add(g);
      h._tile && h._tile.traverse(m => { if (m.isMesh) m.material.color.setHex(z.hoi > 0 ? COOL_TINT : TIER_TINT[z.tier]).convertSRGBToLinear(); });
      if (z.hoi > 0) { const l = label(['⏳', `hồi ${z.hoi}`], { fs: 56, size: .9, bg: false }); l.position.set(h.x, topY + .7, h.y); g.add(l); zs.cool = l; }
      else {
        if (z.tier === 3) { const c = fit(kit('rock_single_C'), .5, .4); at(c, h.x - .5, h.y + .35); g.add(c); const r2 = fit(kit('rock_single_A'), .35, .3); at(r2, h.x + .55, h.y + .3); g.add(r2); }
        const ring = new T.Mesh(new T.RingGeometry(.52, .62, 40), new T.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: .7, side: T.DoubleSide }));
        ring.rotation.x = -Math.PI / 2; ring.position.set(h.x, topY + .02, h.y); g.add(ring); zs.ring = ring;
        monster(z.quai).then(m => { if (zoneState[z.h] !== zs) return; m.scale.multiplyScalar(z.tier === 3 ? 1.35 : z.tier === 2 ? 1.15 : 1); at(m, h.x, h.y); m.rotation.y = 0.3; g.add(m); zs.mixer = m.userData.mixer; });
      }
    }
    if (zs.lbl) zs.group.remove(zs.lbl);
    if (z.hoi > 0) continue;
    const qu = E.QUAI[z.quai];
    zs.lbl = label([`Cấp ${z.tier} · ${pct}%`, `yếu ${E.UNIT[qu.yeu].ic}`], { fs: 46, size: 1.05, h: 170 });
    zs.lbl.position.set(h.x, topY + 2.05, h.y); zs.group.add(zs.lbl); // cao hơn thẻ ? (1.35) để không đè
  }
}

// ---------- nhà, đường ----------
const HOUSE = ['', 'building_home_A_', 'building_home_B_', 'building_tavern_', 'building_church_', 'building_castle_'];
const HFP = [0, .62, .7, .76, .8, .92];
function renderDyn(st, o) {
  dyn.clear();
  const map = E.buildMap(st.mapSeed), col = pi => COLN[pi % 4];
  map.edges.forEach((e, i) => {
    const ow = st.eOwner[i]; if (ow < 0) return;
    const a = map.verts[e.a], b = map.verts[e.b], len = Math.hypot(b.x - a.x, b.y - a.y) * .72;
    const m = new T.Mesh(new T.BoxGeometry(.2, .14, len * .95), new T.MeshStandardMaterial({ color: new T.Color(st.players[ow].color).convertSRGBToLinear(), roughness: .55 }));
    m.castShadow = true; m.position.set((a.x + b.x) / 2, topY + .07, (a.y + b.y) / 2); m.rotation.y = Math.atan2(b.x - a.x, b.y - a.y);
    dyn.add(m); if (o.flashE && o.flashE.includes(i)) pop(m);
  });
  map.verts.forEach((v, i) => {
    const ow = st.vOwner[i]; if (ow < 0) return;
    const lv = st.vLevel[i], n = HOUSE[lv] + col(ow);
    const h = fit(kit(lib[n] ? n : 'building_home_A_red'), HFP[lv], .7 + lv * .14);
    h.rotation.y = (i * 1.7) % 6.28; at(h, v.x, v.y); dyn.add(h);
    const base = new T.Mesh(new T.CylinderGeometry(.3, .32, .08, 24), new T.MeshStandardMaterial({ color: new T.Color(st.players[ow].color).convertSRGBToLinear() }));
    base.position.set(v.x, topY + .04, v.y); dyn.add(base); h.position.y += .08;
    const d = st.vDebuff[i]; if (d && d.luot > 0) { const f = label(['🔥'], { fs: 120, size: .55, bg: false }); f.position.set(v.x, topY + 1.1, v.y); dyn.add(f); }
    if (o.flashV && o.flashV.includes(i)) pop(h);
  });
}
function renderTargets(st, o) {
  tgtG.clear(); const map = E.buildMap(st.mapSeed);
  const gold = () => new T.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: .7, depthWrite: false });
  for (const i of o.tV || []) { const v = map.verts[i], m = new T.Mesh(new T.CylinderGeometry(.2, .2, .06, 20), gold()); m.position.set(v.x, topY + .09, v.y); tgtG.add(m); }
  for (const i of o.tE || []) { const e = map.edges[i], a = map.verts[e.a], b = map.verts[e.b]; const m = new T.Mesh(new T.BoxGeometry(.2, .06, Math.hypot(b.x - a.x, b.y - a.y) * .7), gold()); m.position.set((a.x + b.x) / 2, topY + .09, (a.y + b.y) / 2); m.rotation.y = Math.atan2(b.x - a.x, b.y - a.y); tgtG.add(m); }
  // đăng ký của chính mình: bóng mờ màu người chơi
  if (o.mine != null) for (const x of (st.pending && st.pending[o.mine]) || []) {
    const col = new T.Color(st.players[o.mine].color).convertSRGBToLinear(), mat = new T.MeshStandardMaterial({ color: col, transparent: true, opacity: .45 });
    if (x.t === 'road') { const e = map.edges[x.e], a = map.verts[e.a], b = map.verts[e.b]; const m = new T.Mesh(new T.BoxGeometry(.2, .14, Math.hypot(b.x - a.x, b.y - a.y) * .68), mat); m.position.set((a.x + b.x) / 2, topY + .07, (a.y + b.y) / 2); m.rotation.y = Math.atan2(b.x - a.x, b.y - a.y); tgtG.add(m); }
    if (x.t === 'house') { const v = map.verts[x.v], m = new T.Mesh(new T.ConeGeometry(.28, .45, 4), mat); m.position.set(v.x, topY + .25, v.y); tgtG.add(m); }
  }
}
function pop(o) { const s = o.scale.clone(); o.scale.multiplyScalar(.01); anims.push({ t: 0, dur: .6, fn: k => { const e = 1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2); o.scale.copy(s).multiplyScalar(Math.max(.01, e)); } }); }

function render(st, o) {
  if (!API.ok || !st) return;
  o = o || {};
  if (builtSeed !== st.mapSeed) buildStatic(st);
  renderZones(st); renderDyn(st, o); renderTargets(st, o);
  last = st;
}

// cờ của người tham gia khám phá (hiện vài giây lúc TV lật kết quả)
function explore(ev, st) {
  if (!API.ok) return;
  const map = E.buildMap(st.mapSeed), h = map.hexes[ev.h], g = new T.Group();
  ev.loot.forEach((l, k) => {
    const a = k / Math.max(1, ev.loot.length) * Math.PI * 2 + .4;
    const f = fit(kit('flag_' + COLN[l.pi % 4]), .4, .7); at(f, h.x + Math.cos(a) * .62, h.y + Math.sin(a) * .62); g.add(f); pop(f);
  });
  for (let i = 0; i < 6; i++) { const c = fit(kit('coin_gold'), .22, .22); at(c, h.x, h.y, topY + 1.8 + i * .25); c.userData.v = new T.Vector3((Math.random() - .5) * 1.4, 2 + Math.random(), (Math.random() - .5) * 1.4); g.add(c); }
  fx.add(g);
  anims.push({ t: 0, dur: 4, fn: k => { g.children.forEach(c => { if (c.userData.v) { c.userData.v.y -= 0.12; c.position.addScaledVector(c.userData.v, 0.016); c.rotation.y += .2; if (c.position.y < topY) c.visible = false; } }); if (k >= 1) fx.remove(g); } });
}

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(.05, clock.getDelta()), t = (performance.now() - t0) / 1000;
  mixers.forEach(m => m.update(dt));
  for (let i = anims.length - 1; i >= 0; i--) { const a = anims[i]; a.t += dt; const k = Math.min(1, a.t / a.dur); a.fn(k); if (k >= 1) anims.splice(i, 1); }
  fx.children.forEach(c => { if (c.userData.drift) { c.position.x += c.userData.drift * dt; if (c.position.x > 18) c.position.x = -18; } });
  for (const k in zoneState) { const r = zoneState[k].ring; if (r) { r.rotation.z = t * .6; r.material.opacity = .45 + .3 * Math.sin(t * 2.5); } }
  placeCam(t); // TV: lượn rất nhẹ cho sống động; iPad: đứng yên, zoom/kéo tay
  if (tgtG.children.length) { const k = .55 + .45 * Math.sin(t * 5); tgtG.children.forEach(m => { m.material.opacity = .35 + .5 * k; }); }
  R.render(scene, cam);
}

// ô trúng số xúc xắc: nhấp nháy vàng + nhô lên một chút
function flashHex(ids) {
  for (const id of ids || []) {
    const t = tiles[id]; if (!t) continue; const y0 = t.userData.y0 == null ? (t.userData.y0 = t.position.y) : t.userData.y0;
    const ms = []; t.traverse(m => { if (m.isMesh) ms.push(m.material); });
    anims.push({ t: 0, dur: 2.2, fn: k => { const e = Math.sin(Math.min(1, k * 1.15) * Math.PI); ms.forEach(m => { m.emissive.setHex(0xffc233); m.emissiveIntensity = e * .65; }); t.position.y = y0 + e * .12; } });
  }
}
// ---------- máy quay: zoom + kéo (iPad), lượn nhẹ (TV) ----------
const VIEW = { k: 1, tx: 0, tz: -0.3, dist0: 20, idle: true };
function placeCam(t) {
  const d = VIEW.dist0 / VIEW.k, a = VIEW.idle ? Math.sin(t * 0.08) * 0.06 : 0;
  const ox = 0, oy = d * 0.79, oz = d * 0.61, c = Math.cos(a), s = Math.sin(a);
  cam.position.set(VIEW.tx + ox * c - oz * s, oy, VIEW.tz + ox * s + oz * c); cam.lookAt(VIEW.tx, 0, VIEW.tz);
}
function clampView() { VIEW.k = Math.max(1, Math.min(4, VIEW.k)); const m = (1 - 1 / VIEW.k); VIEW.tx = Math.max(-8 * m, Math.min(8 * m, VIEW.tx)); VIEW.tz = Math.max(-0.3 - 5.5 * m, Math.min(-0.3 + 5.5 * m, VIEW.tz)); if (VIEW.k === 1) { VIEW.tx = 0; VIEW.tz = -0.3; } }
function zoomBy(f) { VIEW.k *= f; clampView(); }
function panBy(dx, dy) { const c = R.domElement, h = 2 * Math.tan(cam.fov * Math.PI / 360) * VIEW.dist0 / VIEW.k, wpp = h / c.clientHeight; VIEW.tx -= dx * wpp; VIEW.tz -= dy * wpp * 1.3; clampView(); }
function resetView() { VIEW.k = 1; clampView(); }
// chạm → điểm trên mặt bàn (toạ độ bản đồ x,y) để dùng chung logic chọn đỉnh/cạnh/ô với bàn 2D
const ray = new T.Raycaster(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
function pick(clientX, clientY) {
  const r = R.domElement.getBoundingClientRect(), v = new T.Vector2((clientX - r.left) / r.width * 2 - 1, -(clientY - r.top) / r.height * 2 + 1);
  ray.setFromCamera(v, cam); plane.constant = -topY; const p = new T.Vector3();
  return ray.ray.intersectPlane(plane, p) ? { x: p.x, y: p.z } : null;
}
const API = { ok: false, init, render, explore, flashHex, zoomBy, panBy, resetView, pick, setIdle: b => { VIEW.idle = b; }, view: VIEW, resize: () => R && resize(), _dbg: () => ({ lib, scene, cam, R, tileScale, tileRot, topY }) };
window.BKC3D = API;
})();
