/* Nông Trại BK — MÔ HÌNH: nạp KayKit (CC0) + dựng khối cho thứ KayKit không có (cây trồng, con vật, bảng đơn…)
   + chụp biểu tượng hàng hoá từ chính mô hình 3D (icon cùng phong cách, không cần vẽ).
   API: NT_MODELS.tai() → Promise · kk(ten) · vua(obj, rong) · cay(id, giaiDoan, bien) · vat(loai) · icon(id) → dataURL */
(function () {
'use strict';
const T = THREE;

// ---------- vật liệu & khối cơ bản ----------
const matCache = {};
function mat(hex, o) {
  const k = hex + JSON.stringify(o || {});
  return matCache[k] || (matCache[k] = new T.MeshStandardMaterial(Object.assign({ color: new T.Color(hex).convertSRGBToLinear(), flatShading: true, roughness: 0.85, metalness: 0 }, o)));
}
const MAT_VC = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.85, metalness: 0 });
const MAT_MIN = new T.MeshStandardMaterial({ vertexColors: true, flatShading: false, roughness: 0.92, metalness: 0 }); // mịn: tán cây, bụi
if (window.NT_DOHOA && NT_DOHOA.moi) NT_DOHOA.ganGio(MAT_MIN, 0.035); // lớp đồ hoạ mới: tán cây lắc theo gió

// gộp nhiều khối thành 1 geometry có màu theo đỉnh (1 lần vẽ / vật — nhẹ cho iPad)
function gop(phan) { // phan: [{g, m: Matrix4, c: hex}]
  const DH = window.NT_DOHOA, nuong = DH && DH.moi; // lớp đồ hoạ mới: nướng bóng khuất theo độ cao của từng khối
  let n = 0; const ds = phan.map(p => {
    const g = (p.g.index ? p.g.toNonIndexed() : p.g.clone()); let yG = null, y0 = 0, y1 = 0;
    if (nuong) { const P = g.attributes.position; yG = new Float32Array(P.count); y0 = Infinity; y1 = -Infinity; for (let i = 0; i < P.count; i++) { const y = yG[i] = P.getY(i); if (y < y0) y0 = y; if (y > y1) y1 = y; } }
    g.applyMatrix4(p.m); n += g.attributes.position.count; return { g, c: new T.Color(p.c).convertSRGBToLinear(), yG, y0, y1 };
  });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3);
  let o = 0; const cc = new T.Color();
  for (const { g, c, yG, y0, y1 } of ds) {
    const P = g.attributes.position.array, N = g.attributes.normal.array;
    pos.set(P, o * 3); nor.set(N, o * 3);
    for (let i = 0; i < g.attributes.position.count; i++) {
      const k = yG ? DH.nuongMau(yG[i], y0, y1, N[i * 3 + 1], cc.copy(c), 0.22, 0.3) : c;
      col[(o + i) * 3] = k.r; col[(o + i) * 3 + 1] = k.g; col[(o + i) * 3 + 2] = k.b;
    }
    o += g.attributes.position.count; g.dispose();
  }
  const G = new T.BufferGeometry();
  G.setAttribute('position', new T.BufferAttribute(pos, 3)); G.setAttribute('normal', new T.BufferAttribute(nor, 3)); G.setAttribute('color', new T.BufferAttribute(col, 3));
  G.computeBoundingSphere(); G.computeBoundingBox();
  return G;
}
// bộ dựng: b.hop(w,h,d, x,y,z, màu, xoay{x,y,z}) … b.xong() → Mesh
function boDung(min) {
  const phan = [];
  const q = new T.Quaternion(), e = new T.Euler(), s = new T.Vector3(1, 1, 1), p = new T.Vector3();
  const them = (g, x, y, z, c, r, sc) => {
    e.set((r && r.x) || 0, (r && r.y) || 0, (r && r.z) || 0); q.setFromEuler(e); p.set(x, y, z);
    if (sc) s.set(sc.x || 1, sc.y || 1, sc.z || 1); else s.set(1, 1, 1);
    phan.push({ g, m: new T.Matrix4().compose(p, q, s), c });
  };
  return {
    hop(w, h, d, x, y, z, c, r) { them(new T.BoxGeometry(w, h, d), x, y, z, c, r) },
    tru(rt, rd, h, x, y, z, c, r, doan) { them(new T.CylinderGeometry(rt, rd, h, doan || 7), x, y, z, c, r) },
    non(rd, h, x, y, z, c, r, doan) { them(new T.ConeGeometry(rd, h, doan || 6), x, y, z, c, r) },
    cau(rd, x, y, z, c, sc, r, min) { them(new T.IcosahedronGeometry(rd, min || 0), x, y, z, c, r, sc) },
    geo(g, x, y, z, c, r, sc) { them(g, x, y, z, c, r, sc) },
    phan(ds, x, y, z, k, xoay, doiMau) { for (const d of ds) them(d.g.clone(), x, y, z, doiMau ? doiMau(d.c) : d.c, { y: xoay || 0 }, { x: k, y: k, z: k }) },
    xong(bong = true) { const m = new T.Mesh(gop(phan), min ? MAT_MIN : MAT_VC); m.castShadow = bong; m.receiveShadow = true; return m },
  };
}
// số ngẫu nhiên cố định theo hạt giống (ruộng nào cũng mọc giống nhau mỗi lần vẽ lại)
function rnd(seed) { let a = seed * 9301 + 49297; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280 } }

// ---------- KayKit ----------
const KK_DS = {
  medieval: ['building_home_A_blue', 'building_home_A_red', 'building_home_B_blue', 'building_home_A_yellow', 'building_home_B_red', 'building_tavern_yellow', 'building_market_blue', 'building_lumbermill_yellow', 'building_windmill_yellow', 'building_watermill_blue', 'building_blacksmith_yellow', 'building_market_red', 'building_well_blue',
    'fence_wood_straight', 'fence_wood_straight_gate', 'barrel', 'sack', 'crate_A_big', 'crate_open', 'wheelbarrow', 'bucket_water', 'pallet', 'cloud_big', 'cloud_small', 'resource_lumber', 'tent'],
  restaurant: ['oven', 'stove_single', 'pot_large', 'food_ingredient_bun', 'food_ingredient_cheese', 'food_ingredient_carrot', 'food_ingredient_ham_cooked', 'jar_A_small', 'jar_C_small', 'bowl', 'plate', 'crate_carrots'],
  forest: ['Tree_1_A_Color1', 'Tree_3_A_Color1', 'Tree_4_A_Color1', 'Bush_1_A_Color1', 'Bush_3_A_Color1', 'Rock_1_A_Color1', 'Rock_2_A_Color1', 'Grass_2_A_Color1'],
  holiday: ['milk', 'cookie', 'lantern'],
  city: ['car_stationwagon', 'watertower', 'bench', 'box_A'],
  resource: ['Wood_Plank_A', 'Wood_Planks_Stack_Small', 'Parts_Cog', 'Iron_Bar', 'Wood_Log_Stack', 'Pallet_Wood', 'Textiles_A'],
  platformer: ['star_yellow'],
};
const KK = {};
// làm tươi texture KayKit (atlas dùng chung nên xử lý 1 lần/tên, rồi gán lại cho mọi mô hình cùng atlas)
const texTuoi = {};
function tuoiTexture(tex, goi) { // mỗi gói KayKit dùng đúng 1 atlas ⇒ khoá theo tên gói (khoá theo kích thước ảnh thì 2 gói trùng cỡ bị tráo atlas)
  const ten = goi; if (!tex.image || !ten) return;
  if (window.NT_DOHOA && NT_DOHOA.moi) return; // lớp đồ hoạ mới: giữ màu gốc, để chỉnh màu chung tạo không khí
  if (!texTuoi[ten]) {
    const im = tex.image, c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
    for (let i = 0; i < p.length; i += 4) { const l = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2]; for (let k = 0; k < 3; k++) p[i + k] = Math.max(0, Math.min(255, (l + (p[i + k] - l) * 1.3) * 1.05 + 4)); }
    g.putImageData(d, 0, 0); texTuoi[ten] = c;
  }
  tex.image = texTuoi[ten]; tex.needsUpdate = true;
}
function tai(onTienDo) {
  const loader = new T.GLTFLoader();
  const viec = [];
  for (const goi in KK_DS) for (const ten of KK_DS[goi]) viec.push([goi, ten]);
  let xongN = 0;
  const qc = taiQC(loader), qa = taiQA(new T.GLTFLoader(), window.NT_DOHOA && NT_DOHOA.moi ? {} : { bo: 15, heo: 10, cuu: 10, cho: 1 }); // bản mới: bò/heo/cừu/chó dựng bằng code (dohoa.js)
  return Promise.all([qc, qa, ...viec.map(([goi, ten]) => new Promise(ok => {
    loader.load('assets/kaykit/' + goi + '/' + ten + '.gltf', g => {
      g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material.map) { o.material.map.anisotropy = 4; tuoiTexture(o.material.map, goi); } } });
      KK[ten] = g.scene; xongN++; onTienDo && onTienDo(xongN / viec.length); ok();
    }, undefined, () => { console.warn('thiếu mô hình', ten); xongN++; ok(); });
  }))]);
}
function kk(ten) { const g = KK[ten]; return g ? g.clone(true) : new T.Group(); }
// co giãn cho bề ngang lớn nhất = rong, đặt đáy chạm y=0, tâm về (0,0)
function vua(obj, rong, cao) {
  const b = new T.Box3().setFromObject(obj), sz = b.getSize(new T.Vector3()), c = b.getCenter(new T.Vector3());
  const k = cao ? cao / sz.y : rong / Math.max(sz.x, sz.z);
  const g = new T.Group(); obj.position.set(-c.x, -b.min.y, -c.z); g.add(obj); g.scale.setScalar(k);
  return g;
}
// lấy geometry+material của mô hình KayKit 1 lưới để nhân bản hàng loạt (hàng rào, cây rừng)
function kkLuoi(ten) { let m = null; if (KK[ten]) KK[ten].traverse(o => { if (!m && o.isMesh) m = o }); return m; }
const geoGiua = {};
function nhanBan(ten, dsViTri, co) { // dsViTri: [{x,z,y?,xoay?,k?}] — geometry đưa về tâm (mô hình KayKit hay lệch gốc, vd hàng rào lệch 1 ô)
  const m = kkLuoi(ten); if (!m) return new T.Group();
  if (!geoGiua[ten]) {
    const g = m.geometry.clone(); g.computeBoundingBox(); const bb = g.boundingBox, c = bb.getCenter(new T.Vector3());
    g.translate(-c.x, -bb.min.y, -c.z); g.computeBoundingBox(); g.computeBoundingSphere(); geoGiua[ten] = g;
  }
  const geo = geoGiua[ten], b = geo.boundingBox, sz = b.getSize(new T.Vector3());
  const k0 = co ? co / Math.max(sz.x, sz.z) : 1;
  const im = new T.InstancedMesh(geo, m.material, dsViTri.length);
  const q = new T.Quaternion(), e = new T.Euler(), s = new T.Vector3(), p = new T.Vector3();
  dsViTri.forEach((v, i) => {
    e.set(0, v.xoay || 0, 0); q.setFromEuler(e); const k = k0 * (v.k || 1); s.set(k, k, k);
    p.set(v.x, v.y || 0, v.z);
    im.setMatrixAt(i, new T.Matrix4().compose(p, q, s));
  });
  im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; // r128: InstancedMesh lấy khối bao của hình gốc (ở gốc toạ độ) ⇒ bị cắt nhầm
  return im;
}

// ---------- CÂY TRỒNG (0 = mầm, 1 = đang lớn, 2 = chín) — phong cách tròn trịa, màu tươi ----------
const XANH = 0x7fd64a, XANH_DAM = 0x4fae3a, XANH_NHAT = 0xb4ec6a;
const cayCache = {};
function cayMesh(id, gd, bien) {
  const key = id + '|' + gd + '|' + (bien % 3);
  if (!cayCache[key]) {
    const b = boDung(); const r = rnd(bien % 3 + 7);
    veCay(b, id, gd, r);
    const m = b.xong(); cayCache[key] = m.geometry;
  }
  const m = new T.Mesh(cayCache[key], MAT_VC); m.castShadow = true; m.receiveShadow = true; return m;
}
function veCay(b, id, gd, r) {
  const luoi = (n, f) => { for (let gx = 0; gx < n; gx++) for (let gz = 0; gz < n; gz++) f((gx - (n - 1) / 2) / n * 0.8 + (r() - 0.5) * 0.05, (gz - (n - 1) / 2) / n * 0.8 + (r() - 0.5) * 0.05) };
  if (gd === 0) { // mầm 2 lá tròn
    luoi(3, (x, z) => { const a = r() * 3; b.tru(0.012, 0.015, 0.1, x, 0.05, z, XANH_DAM, null, 4);
      b.cau(0.045, x + Math.cos(a) * 0.04, 0.11, z + Math.sin(a) * 0.04, XANH_NHAT, { x: 1.3, y: 0.45, z: 0.8 }, { y: a }, 1);
      b.cau(0.045, x - Math.cos(a) * 0.04, 0.11, z - Math.sin(a) * 0.04, XANH, { x: 1.3, y: 0.45, z: 0.8 }, { y: a }, 1); });
    return;
  }
  const chin = gd === 2;
  if (id === 'lua_mi') {
    const h0 = chin ? 0.36 : 0.24;
    luoi(4, (x, z) => { for (let k = 0; k < 3; k++) {
      const dx = x + (r() - 0.5) * 0.1, dz = z + (r() - 0.5) * 0.1, h = h0 * (0.85 + r() * 0.3), ng = { x: (r() - 0.5) * 0.3, z: (r() - 0.5) * 0.3 };
      b.tru(0.018, 0.022, h, dx, h / 2, dz, chin ? 0xe0b54a : XANH, ng, 4);
      if (chin) b.cau(0.05, dx - ng.z * h * 0.5, h + 0.05, dz + ng.x * h * 0.5, k % 2 ? 0xffd84f : 0xf7c23a, { x: 0.9, y: 2.0, z: 0.9 }, ng, 1);
      else b.cau(0.035, dx, h, dz, XANH_NHAT, { x: 1, y: 1.6, z: 1 }, ng, 0);
    } });
  } else if (id === 'ngo') {
    const h0 = chin ? 0.62 : 0.4;
    luoi(2, (x, z) => {
      const h = h0 * (0.9 + r() * 0.2), a = r() * 3;
      b.tru(0.04, 0.05, h, x, h / 2, z, XANH_DAM, null, 6);
      for (let k = 0; k < 3; k++) b.cau(0.13, x + Math.cos(a + k * 2.1) * 0.1, h * (0.35 + k * 0.2), z + Math.sin(a + k * 2.1) * 0.1, k % 2 ? XANH : XANH_DAM, { x: 1.5, y: 0.22, z: 0.55 }, { y: -(a + k * 2.1), z: 0.35 }, 1);
      if (chin) { b.cau(0.07, x + 0.07, h * 0.62, z + 0.05, 0xffd23f, { x: 1, y: 1.9, z: 1 }, { z: 0.35 }, 1); b.cau(0.06, x + 0.09, h * 0.52, z + 0.06, XANH_NHAT, { x: 1, y: 1.6, z: 0.7 }, { z: 0.6 }, 1); b.non(0.04, 0.08, x, h + 0.04, z, 0xe8c268, null, 5); }
    });
  } else if (id === 'dau_nanh') {
    const k = chin ? 1 : 0.72;
    luoi(3, (x, z) => {
      b.cau(0.12 * k, x, 0.11 * k, z, XANH, { x: 1.15, y: 0.85, z: 1.15 }, { y: r() * 3 }, 1);
      b.cau(0.08 * k, x + 0.05, 0.19 * k, z - 0.03, XANH_NHAT, null, { y: r() * 3 }, 1);
      if (chin) for (let i = 0; i < 3; i++) b.cau(0.035, x + (r() - 0.5) * 0.18, 0.16 + r() * 0.06, z + 0.08, 0xe9f0a0, { x: 0.8, y: 1.8, z: 0.8 }, { z: r() - 0.5 }, 0);
    });
  } else if (id === 'mia') {
    const h0 = chin ? 0.75 : 0.45;
    luoi(3, (x, z) => { for (let k = 0; k < 2; k++) {
      const dx = x + (k - 0.5) * 0.07, h = h0 * (0.85 + r() * 0.3), n = 4;
      for (let s = 0; s < n; s++) b.tru(0.028, 0.03, h / n - 0.012, dx, (s + 0.5) * h / n, z, s % 2 ? 0xa8d65a : 0xc6e06a, null, 6);
      b.cau(0.12, dx + 0.05, h, z, XANH, { x: 1.5, y: 0.2, z: 0.4 }, { y: r() * 3, z: 0.4 }, 1); b.cau(0.11, dx - 0.05, h - 0.04, z, XANH_DAM, { x: 1.5, y: 0.2, z: 0.4 }, { y: r() * 3, z: -0.4 }, 1);
    } });
  } else if (id === 'ca_rot') {
    const q = qcPhan(chin ? 'Carrot_4' : 'Carrot_2');
    luoi(3, (x, z) => { if (q) b.phan(q, x, chin ? -0.12 : -0.02, z, 0.32, r() * 6); });
  } else if (id === 'cham') {
    const k = chin ? 1 : 0.7;
    luoi(3, (x, z) => {
      b.cau(0.11 * k, x, 0.11 * k, z, XANH_DAM, { x: 1, y: 1.1, z: 1 }, null, 1);
      if (chin) for (let i = 0; i < 4; i++) b.cau(0.035, x + (r() - 0.5) * 0.14, 0.24 + r() * 0.06, z + (r() - 0.5) * 0.14, i % 2 ? 0x6a7bff : 0x9a6bff, { x: 1, y: 1.8, z: 1 }, null, 1);
    });
  } else if (id === 'bi_ngo') {
    const q = qcPhan(chin ? 'Pumpkin_4' : 'Pumpkin_2');
    luoi(2, (x, z) => { if (q) b.phan(q, x, 0, z, chin ? 0.42 : 0.36, r() * 6); });
  } else veCayMoi(b, id, gd, r, luoi, chin);
}

// ô ruộng: tấm đất bo tròn + 4 luống tròn
let geoDat = null;
function datRuong() {
  if (!geoDat) {
    const b = boDung();
    const s = new T.Shape(), w = 0.5, rr = 0.14;
    s.moveTo(-w + rr, -w); s.lineTo(w - rr, -w); s.quadraticCurveTo(w, -w, w, -w + rr); s.lineTo(w, w - rr); s.quadraticCurveTo(w, w, w - rr, w);
    s.lineTo(-w + rr, w); s.quadraticCurveTo(-w, w, -w, w - rr); s.lineTo(-w, -w + rr); s.quadraticCurveTo(-w, -w, -w + rr, -w);
    const g = new T.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.035, bevelSegments: 2, curveSegments: 3 });
    g.rotateX(-Math.PI / 2);
    b.geo(g, 0, 0.03, 0, 0x9a6234);
    for (let i = 0; i < 4; i++) b.cau(0.5, 0, 0.11, (i - 1.5) * 0.23, 0x7a4a24, { x: 0.86, y: 0.08, z: 0.14 }, null, 1);
    geoDat = b.xong(false).geometry;
  }
  const m = new T.Mesh(geoDat, MAT_VC); m.receiveShadow = true; return m;
}

// ---------- QUATERNIUS (CC0): cây trồng + con vật có xương & chuyển động ----------
const QC_DS = ['Carrot_2', 'Carrot_4', 'Pumpkin_2', 'Pumpkin_4', 'Mushroom_2', 'Mushroom_4', 'Apple_2', 'Apple_4', 'Apple_Harvested', 'Grass_3', 'BushBerries_2', 'BushBerries_3', 'BushBerries_4', 'Flower_4',
  'Orange_2', 'Orange_Harvested', 'PalmTree_2', 'PalmTree_Harvested', 'Watermelon_2', 'Watermelon_4', 'Coconut_Half'];
const QC = {};
// tăng độ tươi màu cho đúng chất "ngộ nghĩnh" (màu gốc gói này hơi úa)
function tuoiMau(hex, ks, kl) {
  const c = new T.Color(hex), h = {}; c.getHSL(h);
  if (window.NT_DOHOA && NT_DOHOA.moi) { // bản mới: chỉ sửa lá úa thành xanh DỊU, không đẩy bão hoà
    if (h.h > 0.14 && h.h < 0.45) { h.h = 0.26 + (h.h - 0.27) * 0.4; h.s = Math.min(0.55, Math.max(h.s * 1.25, 0.4)); h.l = Math.max(h.l * 1.05, 0.4); }
    else { h.s = Math.min(1, h.s * 1.08); h.l = Math.min(0.9, h.l * 1.04 + 0.01); }
    c.setHSL(h.h, h.s, h.l); return c.getHex();
  }
  if (h.h > 0.14 && h.h < 0.45) { h.h = 0.27 + (h.h - 0.27) * 0.4; h.s = Math.max(h.s * 1.8, 0.55); h.l = Math.max(h.l * 1.15, 0.42); } // lá úa → xanh lá tươi
  else { h.s = Math.min(1, h.s * (ks || 1.45)); h.l = Math.min(0.92, h.l * (kl || 1.15) + 0.03); }
  c.setHSL(h.h, Math.min(1, h.s), Math.min(0.9, h.l)); return c.getHex();
}
function qcPhan(ten) { return QC[ten] || null; }
function taiQC(loader) {
  return Promise.all(QC_DS.map(ten => new Promise(ok => loader.load('assets/quaternius/crops/' + ten + '.glb', g => {
    g.scene.updateMatrixWorld(true); const ds = [];
    g.scene.traverse(o => { if (o.isMesh) { const gg = o.geometry.clone(); gg.applyMatrix4(o.matrixWorld); ds.push({ g: gg, c: tuoiMau(o.material.color.clone().convertLinearToSRGB().getHex()) }); } });
    // đưa về: đáy y=0, tâm xz=0, cao = 1
    const bb = new T.Box3(); ds.forEach(d => { d.g.computeBoundingBox(); bb.union(d.g.boundingBox); });
    const c = bb.getCenter(new T.Vector3()), k = 1 / (bb.max.y - bb.min.y);
    ds.forEach(d => { d.g.translate(-c.x, -bb.min.y, -c.z); d.g.scale(k, k, k); });
    QC[ten] = ds; ok();
  }, undefined, () => { console.warn('thiếu', ten); ok(); }))));
}
// con vật: mỗi con phải parse riêng (mô hình có xương — clone() không tách được bộ xương)
const QA_FILE = { bo: 'Cow', heo: 'Pig', cho: 'Pug', cuu: 'Sheep' };
const QA_MAU = { White: 0xffffff, Black: 0x2b2b33, Pink: 0xff7a8a, 'Material.003': 0xffb3c1, Material: 0x7a3a2a, Beige: 0xf2c98a, Brown: 0x5a3a26 };
const QA_POOL = {};
function taiQA(loader, soLuong) {
  return Promise.all(Object.keys(soLuong).map(loai => fetch('assets/quaternius/animals/' + QA_FILE[loai] + '.glb').then(r => r.arrayBuffer()).then(buf => {
    QA_POOL[loai] = [];
    return Promise.all(Array.from({ length: soLuong[loai] }, () => new Promise(ok => loader.parse(buf.slice(0), '', g => { QA_POOL[loai].push(dungVatQ(g)); ok(); }, () => ok()))));
  }).catch(() => {})));
}
function dungVatQ(g) {
  const goc = g.scene, xuong = {};
  goc.traverse(o => {
    if (o.isBone) xuong[o.name] = o;
    if (o.isMesh || o.isSkinnedMesh) {
      o.castShadow = true; o.frustumCulled = false;
      o.material = [].concat(o.material).map(m => { const n = m.clone(); n.color = new T.Color(QA_MAU[m.name] != null ? QA_MAU[m.name] : tuoiMau(m.color.clone().convertLinearToSRGB().getHex())).convertSRGBToLinear(); n.roughness = 0.8; n.metalness = 0; n.flatShading = true; return n; });
      if (o.material.length === 1) o.material = o.material[0];
    }
  });
  const bb = new T.Box3().setFromObject(goc), sz = bb.getSize(new T.Vector3());
  const bao = new T.Group(); goc.position.y = -bb.min.y; bao.add(goc);
  bao.updateMatrixWorld(true);
  const chan = xuong.FrontUpLegR ? xuong.FrontUpLegR.getWorldPosition(new T.Vector3()).y : 0; // độ cao hông = dài chân
  const tl = new T.Group(); tl.add(bao); tl.userData.dai = Math.max(sz.x, sz.z);
  const mixer = new T.AnimationMixer(goc), hd = {};
  for (const a of g.animations) hd[a.name.split('|').pop()] = mixer.clipAction(a);
  return { g: tl, bao, mixer, hd, xuong, chan };
}
function layVatQ(loai) { const p = QA_POOL[loai]; return p && p.length ? p.pop() : null; }
// kiểu chibi: đầu to, chân ngắn — gọi SAU mixer.update mỗi khung (hoạt ảnh có thể ghi đè scale xương)
function chibi(v) {
  const x = v.xuong;
  const f = 0.6; // chân còn 60%
  if (x.Head) x.Head.scale.setScalar(1.8);
  if (x.Neck) x.Neck.scale.setScalar(1.05);
  for (const k of ['FrontUpLegR', 'FrontUpLegL', 'BackUpLegR', 'BackUpLegL']) if (x[k]) x[k].scale.set(1.35, f, 1.35);
  v.bao.position.y = -v.chan * (1 - f) * 0.9; // hạ thân để chân ngắn vẫn chạm đất
}

// ---------- GÀ (dựng tay — gói Quaternius không có gà): tròn, mắt to ----------
const vatCache = {};
function vat(loai, cu) { // cu = true: luôn lấy mẫu cũ (để so sánh)
  if (loai === 'ga' && !cu && window.NT_DOHOA && NT_DOHOA.moi) return NT_DOHOA.gaMoi();
  if (!vatCache[loai]) {
    const b = boDung();
    if (loai === 'ga') {
      b.cau(0.19, 0, 0.24, -0.02, 0xffffff, { x: 1, y: 0.95, z: 1.15 }, null, 1);   // thân tròn
      b.cau(0.13, 0, 0.44, 0.1, 0xffffff, null, null, 1);                          // đầu to
      b.cau(0.04, 0.0, 0.59, 0.1, 0xff4d4d, null, null, 1); b.cau(0.035, 0, 0.58, 0.04, 0xff4d4d, null, null, 1); b.cau(0.035, 0, 0.58, 0.16, 0xff4d4d, null, null, 1); // mào 3 cục
      b.non(0.045, 0.09, 0, 0.43, 0.26, 0xffa62b, { x: Math.PI / 2 }, 4);          // mỏ
      b.cau(0.03, 0, 0.36, 0.2, 0xff4d4d, { x: 0.8, y: 1.3, z: 0.8 }, null, 0);     // yếm
      for (const s of [1, -1]) {
        b.cau(0.034, s * 0.075, 0.47, 0.2, 0x222222, { x: 0.7, y: 1, z: 0.6 }, null, 1); b.cau(0.012, s * 0.08, 0.49, 0.225, 0xffffff, null, null, 0); // mắt + đốm sáng
        b.cau(0.09, s * 0.17, 0.25, -0.03, 0xf4f4f4, { x: 0.45, y: 0.85, z: 1.2 }, { z: s * 0.3 }, 1); // cánh
        b.tru(0.014, 0.014, 0.1, s * 0.06, 0.05, 0.0, 0xffa62b, null, 4); b.cau(0.03, s * 0.06, 0.01, 0.03, 0xffa62b, { x: 1, y: 0.3, z: 1.4 }, null, 0);
      }
      b.cau(0.08, 0, 0.36, -0.2, 0xf2f2f2, { x: 0.6, y: 1.3, z: 0.8 }, { x: -0.6 }, 1);   // đuôi
      b.cau(0.03, 0.1, 0.43, 0.18, 0xffb3b3, { x: 1, y: 0.5, z: 0.4 }, null, 0); b.cau(0.03, -0.1, 0.43, 0.18, 0xffb3b3, { x: 1, y: 0.5, z: 0.4 }, null, 0); // má hồng
    } else if (loai === 'bo') { // dự phòng khi thiếu mô hình Quaternius
      b.cau(0.35, 0, 0.45, 0, 0xffffff, { x: 0.9, y: 0.75, z: 1.3 }, null, 1); b.cau(0.22, 0, 0.62, 0.42, 0xffffff, null, null, 1); b.cau(0.13, 0, 0.55, 0.6, 0xffb3c1, { x: 1.2, y: 0.8, z: 0.6 }, null, 1);
      for (const [x, z] of [[0.17, 0.25], [-0.17, 0.25], [0.17, -0.25], [-0.17, -0.25]]) b.tru(0.06, 0.06, 0.25, x, 0.12, z, 0xffffff, null, 6);
    } else if (loai === 'heo') {
      b.cau(0.3, 0, 0.32, 0, 0xffb3c1, { x: 1, y: 0.85, z: 1.2 }, null, 1); b.cau(0.2, 0, 0.42, 0.3, 0xffb3c1, null, null, 1); b.tru(0.08, 0.08, 0.06, 0, 0.4, 0.49, 0xff8aa3, { x: Math.PI / 2 }, 8);
      for (const [x, z] of [[0.14, 0.18], [-0.14, 0.18], [0.14, -0.18], [-0.14, -0.18]]) b.tru(0.05, 0.05, 0.14, x, 0.07, z, 0xff9fb3, null, 6);
    }
    vatCache[loai] = b.xong().geometry;
  }
  const m = new T.Mesh(vatCache[loai], MAT_VC); m.castShadow = true; return m;
}


// ---------- vật dựng thêm: bảng đơn, nhà gà, máng, bùn, cái liềm ----------
function bangDon() {
  const b = boDung();
  b.hop(0.14, 1.5, 0.14, -0.9, 0.75, 0, 0x8a5a33); b.hop(0.14, 1.5, 0.14, 0.9, 0.75, 0, 0x8a5a33);
  b.hop(2.1, 1.0, 0.1, 0, 1.15, 0, 0xb5794a); b.hop(2.2, 0.12, 0.2, 0, 1.7, 0, 0x7a4a26);
  return b.xong();
}
function giayDon(mau) { const b = boDung(); b.hop(0.36, 0.42, 0.02, 0, 0, 0, mau || 0xfff3b0); b.hop(0.06, 0.06, 0.03, 0, 0.17, 0.01, 0xd9443a); return b.xong(false); }
function nhaGa() {
  const b = boDung();
  b.hop(1.0, 0.7, 0.8, 0, 0.55, 0, 0xc0392b); b.hop(0.14, 0.9, 0.14, 0.4, 0.45, 0.33, 0x7a4a26); b.hop(0.14, 0.9, 0.14, -0.4, 0.45, 0.33, 0x7a4a26);
  b.hop(1.2, 0.08, 0.5, 0, 1.05, 0.2, 0xf1e0c5, { x: -0.55 }); b.hop(1.2, 0.08, 0.5, 0, 1.05, -0.2, 0xf1e0c5, { x: 0.55 });
  b.hop(0.3, 0.3, 0.02, 0, 0.55, 0.41, 0x3a1a10); b.hop(0.12, 0.5, 0.5, 0, 0.25, 0.55, 0x9a6a3a, { x: 0.6 });
  return b.xong();
}
function mang(mau) { const b = boDung(); b.hop(1.0, 0.2, 0.3, 0, 0.1, 0, 0x8a5a33); b.hop(0.9, 0.05, 0.22, 0, 0.19, 0, mau || 0xd9c26a); return b.xong(); }
function bun(w, d) { const b = boDung(); b.hop(w, 0.03, d, 0, 0.015, 0, 0x7a5a36); b.cau(0.3, w * 0.2, 0.0, d * 0.15, 0x6a4a2a, { x: 1.6, y: 0.1, z: 1.2 }); return b.xong(false); }
function giaoCo(w, d, mau) { const b = boDung(); b.hop(w, 0.02, d, 0, 0.01, 0, mau); return b.xong(false); }
function congTruong() { // chỗ đang xây: pallet + gỗ + thùng + cột
  const g = new T.Group();
  const p = vua(kk('pallet'), 1.2); p.position.set(0, 0, 0); g.add(p);
  const l = vua(kk('Wood_Log_Stack'), 0.8); l.position.set(-0.4, 0.1, 0.3); g.add(l);
  const c = vua(kk('box_A'), 0.5); c.position.set(0.45, 0.1, -0.3); g.add(c);
  const b = boDung(); for (const [x, z] of [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]) b.hop(0.08, 1.3, 0.08, x, 0.65, z, 0xd9a441);
  b.hop(1.5, 0.08, 0.08, 0, 1.2, -0.7, 0xd9a441); b.hop(1.5, 0.08, 0.08, 0, 1.2, 0.7, 0xd9a441);
  g.add(b.xong()); return g;
}
function lanhDat(w, d) { // lô đất chờ xây: nền đất nhạt + cọc gỗ + dây thừng
  const b = boDung(); b.hop(w, 0.03, d, 0, 0.015, 0, 0xc9ad7a);
  const coc = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]];
  for (const [x, z] of coc) { b.hop(0.12, 0.5, 0.12, x, 0.25, z, 0x8a5a33); b.hop(0.16, 0.06, 0.16, x, 0.5, z, 0x6e4526); }
  b.hop(w, 0.03, 0.03, 0, 0.38, -d / 2, 0xe9d7a8); b.hop(w, 0.03, 0.03, 0, 0.38, d / 2, 0xe9d7a8);
  b.hop(0.03, 0.03, d, -w / 2, 0.38, 0, 0xe9d7a8); b.hop(0.03, 0.03, d, w / 2, 0.38, 0, 0xe9d7a8);
  b.hop(0.08, 0.7, 0.08, w / 2 - 0.35, 0.35, d / 2 - 0.25, 0x8a5a33); b.hop(0.6, 0.36, 0.05, w / 2 - 0.35, 0.72, d / 2 - 0.22, 0xe0b36a); // biển
  return b.xong(false);
}

// ---------- TRANG TRÍ: hoa, bụi tròn, ao, đá lát, bươm bướm ----------
const MAU_HOA = [0xff7eb6, 0xffffff, 0xffd23f, 0xb58cff, 0xff6b6b, 0x7ec8ff];
function cumHoa(n, rong, seed, mau) { // n bông trong bán kính rong
  const b = boDung(), r = rnd(seed || 1), ds = mau || MAU_HOA;
  for (let i = 0; i < n; i++) {
    const a = r() * 6.283, d = Math.sqrt(r()) * rong, x = Math.cos(a) * d, z = Math.sin(a) * d, h = 0.14 + r() * 0.1, c = ds[Math.floor(r() * ds.length)];
    b.tru(0.01, 0.012, h, x, h / 2, z, 0x4fae3a, null, 3);
    b.cau(0.05, x + 0.04, 0.05, z, 0x6fcf4a, { x: 1.4, y: 0.3, z: 0.7 }, { y: r() * 3 }, 0);
    for (let k = 0; k < 5; k++) { const t = k / 5 * 6.283; b.cau(0.03, x + Math.cos(t) * 0.035, h, z + Math.sin(t) * 0.035, c, { x: 1, y: 0.45, z: 1 }, null, 0); }
    b.cau(0.022, x, h + 0.01, z, c === 0xffd23f ? 0xff9f1c : 0xffd23f, null, null, 0);
  }
  return b.xong(false);
}
function buiTron(k, seed, coHoa) {
  const b = boDung(true), r = rnd(seed || 3);
  tanBong(b, 0, 0.3 * k, 0, 0.42 * k, 6, LA.bui, r, 2, 0.7);
  if (coHoa) for (let i = 0; i < 6; i++) { const a = r() * 6.283; b.cau(0.045 * k, Math.cos(a) * 0.3 * k, 0.3 * k + r() * 0.15 * k, Math.sin(a) * 0.3 * k, coHoa, null, null, 0); }
  return b.xong();
}
function ao(rx, rz) { // ao sen: viền cát + mặt nước + lá sen + hoa sen + đá
  const g = new T.Group(), r = rnd(9);
  const vien = new T.Mesh(new T.CircleGeometry(1, 28), mat(0xe9d6a4)); vien.rotation.x = -Math.PI / 2; vien.scale.set(rx + 0.35, rz + 0.35, 1); vien.position.y = 0.035; vien.receiveShadow = true; g.add(vien);
  const nuoc = new T.Mesh(new T.CircleGeometry(1, 28), new T.MeshStandardMaterial({ color: new T.Color(0x5cc8f2).convertSRGBToLinear(), roughness: 0.15, metalness: 0.1 }));
  nuoc.rotation.x = -Math.PI / 2; nuoc.scale.set(rx, rz, 1); nuoc.position.y = 0.05; nuoc.receiveShadow = true; g.add(nuoc); g.userData.nuoc = nuoc;
  const b = boDung();
  for (let i = 0; i < 5; i++) { const a = r() * 6.283, d = 0.3 + r() * 0.5; b.tru(0.18, 0.18, 0.02, Math.cos(a) * rx * d, 0.065, Math.sin(a) * rz * d, i % 2 ? 0x5cc23a : 0x7fd64a, null, 10); }
  for (let k = 0; k < 6; k++) { const t = k / 6 * 6.283; b.cau(0.05, 0.25 * rx + Math.cos(t) * 0.05, 0.1, 0.1 + Math.sin(t) * 0.05, 0xffb3d1, { x: 1, y: 0.6, z: 1 }, null, 0); }
  b.cau(0.03, 0.25 * rx, 0.11, 0.1, 0xffe066, null, null, 0);
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283 + r() * 0.3; b.cau(0.12 + r() * 0.08, Math.cos(a) * (rx + 0.3), 0.06, Math.sin(a) * (rz + 0.3), i % 3 ? 0xb9b9c4 : 0xa2a2b0, { x: 1, y: 0.6, z: 1 }, null, 1); }
  g.add(b.xong(false)); g.userData.la = g.children[g.children.length - 1];
  return g;
}
function daLat(ds) { // ds: [{x,z}] các viên đá lát tròn
  const b = boDung(), r = rnd(4);
  for (const p of ds) b.tru(0.22 + r() * 0.06, 0.25, 0.05, p.x, 0.035, p.z, r() > 0.5 ? 0xd9d4c8 : 0xcfc8b8, { y: r() * 3 }, 9);
  return b.xong(false);
}
function buom(mau) {
  const g = new T.Group(), m = new T.MeshStandardMaterial({ color: new T.Color(mau).convertSRGBToLinear(), side: T.DoubleSide, roughness: 0.6 });
  const canh = new T.CircleGeometry(0.09, 8);
  const trai = new T.Mesh(canh, m), phai = new T.Mesh(canh, m);
  trai.position.x = -0.07; phai.position.x = 0.07;
  const L = new T.Group(), P = new T.Group(); L.add(trai); P.add(phai); g.add(L, P);
  const than = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.12, 4), mat(0x3a2a1a)); than.rotation.x = Math.PI / 2; g.add(than);
  g.userData.L = L; g.userData.P = P;
  return g;
}

// ---------- CÂY RUỘNG MỚI (cấp 16–30) ----------
function veCayMoi(b, id, gd, r, luoi, chin) {
  if (id === 'bong') {
    luoi(3, (x, z) => { const k = chin ? 1 : 0.75;
      b.cau(0.11 * k, x, 0.13 * k, z, XANH_DAM, { x: 1.1, y: 1, z: 1.1 }, null, 1);
      if (chin) for (let i = 0; i < 4; i++) { const a = i * 1.57 + r(); b.cau(0.045, x + Math.cos(a) * 0.07, 0.2 + r() * 0.05, z + Math.sin(a) * 0.07, 0xffffff, null, null, 1); }
      else b.cau(0.03, x, 0.2, z, 0xb4ec6a, null, null, 0); });
  } else if (id === 'lua_nuoc') {
    b.hop(0.96, 0.02, 0.96, 0, 0.005, 0, 0x6fc7d9); // mặt nước ruộng lúa
    luoi(4, (x, z) => { for (let k = 0; k < 4; k++) {
      const ng = { x: (r() - 0.5) * 0.4, z: (r() - 0.5) * 0.4 }, h = (chin ? 0.34 : 0.26) * (0.85 + r() * 0.3);
      b.tru(0.012, 0.016, h, x + (r() - 0.5) * 0.08, h / 2, z + (r() - 0.5) * 0.08, chin ? 0x9cc24a : XANH, ng, 3);
      if (chin) b.cau(0.03, x - ng.z * h * 0.6, h + 0.01, z + ng.x * h * 0.6, 0xf2c85b, { x: 0.8, y: 2.2, z: 0.8 }, { z: 0.6 + ng.z }, 0);
    } });
  } else if (id === 'dau_tay') {
    luoi(3, (x, z) => {
      for (let i = 0; i < 3; i++) { const a = i * 2.1 + r(); b.cau(0.06, x + Math.cos(a) * 0.06, 0.05, z + Math.sin(a) * 0.06, i % 2 ? XANH : XANH_DAM, { x: 1.4, y: 0.4, z: 1 }, { y: a }, 1); }
      if (chin) for (let i = 0; i < 3; i++) { const a = i * 2.1 + 1; b.non(0.035, 0.07, x + Math.cos(a) * 0.09, 0.05, z + Math.sin(a) * 0.09, 0xff3b4f, { x: Math.PI }, 7); b.non(0.02, 0.02, x + Math.cos(a) * 0.09, 0.09, z + Math.sin(a) * 0.09, XANH, null, 5); }
      else b.cau(0.025, x, 0.1, z, 0xffffff, null, null, 0);
    });
  } else if (id === 'ot') {
    luoi(3, (x, z) => { const k = chin ? 1 : 0.75;
      b.tru(0.012, 0.015, 0.14 * k, x, 0.07 * k, z, XANH_DAM, null, 4);
      b.cau(0.09 * k, x, 0.18 * k, z, XANH, { x: 1.1, y: 0.8, z: 1.1 }, null, 1);
      if (chin) for (let i = 0; i < 4; i++) { const a = i * 1.6 + r(); b.non(0.018, 0.09, x + Math.cos(a) * 0.08, 0.12, z + Math.sin(a) * 0.08, i % 3 ? 0xff2e2e : 0xff8a1e, { x: Math.PI, z: 0.3 }, 5); }
    });
  } else if (id === 'hoa_huong_duong') {
    luoi(2, (x, z) => { const h = chin ? 0.62 : 0.4;
      b.tru(0.022, 0.028, h, x, h / 2, z, XANH_DAM, null, 5);
      b.cau(0.07, x + 0.06, h * 0.45, z, XANH, { x: 1.6, y: 0.3, z: 0.8 }, { z: 0.4 }, 1); b.cau(0.07, x - 0.06, h * 0.6, z, XANH, { x: 1.6, y: 0.3, z: 0.8 }, { z: -0.4 }, 1);
      if (chin) { for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; b.cau(0.04, x + Math.cos(a) * 0.1, h + 0.05 + Math.sin(a) * 0.1, z + 0.03, 0xffd21f, { x: 1, y: 1, z: 0.35 }, null, 0); } b.tru(0.07, 0.07, 0.04, x, h + 0.05, z + 0.05, 0x6b3f1f, { x: Math.PI / 2 }, 10); }
      else b.cau(0.05, x, h + 0.02, z, XANH_NHAT, { x: 1, y: 1.3, z: 1 }, null, 1);
    });
  } else if (id === 'dua_hau') {
    const q = qcPhan(chin ? 'Watermelon_4' : 'Watermelon_2');
    luoi(2, (x, z) => { if (q) b.phan(q, x, 0, z, chin ? 0.4 : 0.34, r() * 6); });
  } else if (id === 'khoai_tay') {
    luoi(3, (x, z) => { const k = chin ? 1 : 0.75;
      b.cau(0.11 * k, x, 0.1 * k, z, 0x6fcf4a, { x: 1.1, y: 0.8, z: 1.1 }, null, 1);
      if (chin) { b.cau(0.03, x + 0.03, 0.19, z, 0xffffff, null, null, 0); b.cau(0.045, x + 0.1, 0.03, z + 0.05, 0xc99a5b, { x: 1.2, y: 0.8, z: 1 }, null, 1); }
    });
  } else if (id === 'ca_chua') {
    luoi(3, (x, z) => { const k = chin ? 1 : 0.75;
      b.tru(0.01, 0.01, 0.34 * k, x + 0.05, 0.17 * k, z, 0x9a6b3c, null, 4); // cọc
      b.cau(0.1 * k, x, 0.16 * k, z, XANH_DAM, { x: 1, y: 1.3, z: 1 }, null, 1);
      if (chin) for (let i = 0; i < 3; i++) { const a = i * 2.1 + r(); b.cau(0.04, x + Math.cos(a) * 0.08, 0.1 + r() * 0.1, z + Math.sin(a) * 0.08, 0xff3b30, null, null, 1); }
    });
  }
}

// ---------- CÂY ĂN QUẢ: gd 0 = cây non · 1 = đang ra quả · 2 = có quả · 3 = héo · 4 = chết ----------
const HEO = hex => { const c = new T.Color(hex), h = {}; c.getHSL(h); if (h.h > 0.14 && h.h < 0.45) return new T.Color().setHSL(0.1, 0.45, Math.min(0.55, h.l + 0.05)).getHex(); return hex; };
const cayQuaCache = {};
function cayQuaMesh(loai, gd, bien) {
  const key = loai + '|' + gd + '|' + (bien % 2);
  if (!cayQuaCache[key]) { const b = boDung(true); veCayQua(b, loai, gd, rnd(bien % 2 + 31)); cayQuaCache[key] = b.xong().geometry; }
  const m = new T.Mesh(cayQuaCache[key], MAT_MIN); m.castShadow = true; m.receiveShadow = true; return m;
}
function veCayQua(b, loai, gd, r) {
  if (gd === 4) { // gốc cây khô
    b.tru(0.16, 0.2, 0.3, 0, 0.15, 0, 0x8a6a4a, null, 8); b.tru(0.14, 0.14, 0.02, 0, 0.31, 0, 0xc9a77a, null, 8);
    b.tru(0.03, 0.04, 0.35, 0.08, 0.45, 0, 0x7a5a3a, { z: -0.6 }, 4); b.tru(0.025, 0.035, 0.28, -0.07, 0.42, 0.03, 0x7a5a3a, { z: 0.7 }, 4);
    return;
  }
  const heo = gd === 3 ? HEO : null, laDam = 0x3f9e3a;
  const tan = (ten, k, ktrans) => { const q = qcPhan(ten); if (q) b.phan(q, 0, 0, 0, k, 0, heo); };
  const quaQuanh = (n, cao, bk, ve) => { for (let i = 0; i < n; i++) { const a = i / n * 6.283 + r() * 0.4, yy = cao + (r() - 0.5) * bk * 0.9; ve(Math.cos(a) * bk * (0.75 + r() * 0.3), yy, Math.sin(a) * bk * (0.75 + r() * 0.3), a); } };
  if (loai === 'cam' || loai === 'xoai' || loai === 'vai') {
    if (gd === 0) { const x = thanCay(b, 0.5, 0.06, r); tanBong(b, x, 0.72, 0, 0.36, 6, LA.tron, r, 1, 1, heo); return; }
    const la = loai === 'vai' ? (h => toi(h, 0.82)) : null;
    const x = thanCay(b, 1.05, 0.13, r); tanBong(b, x, 1.55, 0, 0.78, 9, LA.tron, r, 2, 1, heo || la);
    if (gd === 2) quaQuanh(loai === 'vai' ? 8 : 10, 1.55, 0.78, (qx, y, z) => {
      if (loai === 'cam') b.cau(0.12, x + qx, y, z, 0xff9a1f, null, null, 1);
      else if (loai === 'xoai') { b.tru(0.012, 0.012, 0.12, x + qx, y - 0.02, z, 0x5a3a1a, null, 3); b.cau(0.1, x + qx, y - 0.14, z, r() > 0.4 ? 0xffc21f : 0xa6d64a, { x: 0.9, y: 1.35, z: 0.8 }, null, 1); }
      else for (let k = 0; k < 4; k++) b.cau(0.055, x + qx + (k % 2) * 0.07 - 0.035, y - Math.floor(k / 2) * 0.07, z + (k > 1 ? 0.035 : -0.02), 0xe0302e, null, null, 1);
    });
  } else if (loai === 'dua') {
    if (gd === 0) return tan('PalmTree_2', 1.4);
    tan('PalmTree_Harvested', 2.9);
    if (gd === 2) for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; b.cau(0.1, Math.cos(a) * 0.14, 2.45, Math.sin(a) * 0.14, i % 2 ? 0x6b4a2a : 0x7cab3a, null, null, 1); }
  } else if (loai === 'chuoi') {
    const k = gd === 0 ? 0.5 : 1, t = heo ? HEO(0x8fb04a) : 0x8fb04a;
    b.tru(0.09 * k, 0.12 * k, 1.4 * k, 0, 0.7 * k, 0, t, null, 8);
    for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; b.cau(0.5 * k, Math.cos(a) * 0.42 * k, 1.45 * k, Math.sin(a) * 0.42 * k, heo ? HEO(i % 2 ? 0x5fcf3a : 0x4fb23a) : (i % 2 ? 0x5fcf3a : 0x4fb23a), { x: 1.1, y: 0.13, z: 0.34 }, { y: -a, z: -0.45 }, 1); }
    if (gd === 2 || gd === 1) { b.tru(0.02, 0.02, 0.4, 0.14, 1.12, 0, 0x6b8a2a, { z: 0.3 }, 4);
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; b.cau(0.035, 0.2 + Math.cos(a) * 0.08, 0.95 + (i % 3) * 0.06, Math.sin(a) * 0.08, gd === 2 ? 0xffd93b : 0x9ccc4a, { x: 0.8, y: 2.4, z: 0.8 }, { z: 0.3 }, 0); } }
  } else if (loai === 'ca_phe') {
    const k = gd === 0 ? 0.6 : 1; tanBong(b, 0, 0.4 * k, 0, 0.5 * k, 7, [0x3f9e3a, 0x4fae3a, 0x5cbf42], r, 2, 0.8, heo);
    if (gd === 2) quaQuanh(12, 0.45, 0.48, (x, y, z) => b.cau(0.05, x, y, z, 0xd9232e, null, null, 1));
  } else if (loai === 'che') {
    const k = gd === 0 ? 0.55 : 1;
    tanBong(b, 0, 0.32 * k, 0, 0.44 * k, 7, [0x2f8a34, laDam, 0x4aa844], r, 2, 0.7, heo);
    if (gd === 2) quaQuanh(12, 0.46, 0.3, (x, y, z, a) => b.cau(0.035, x, y + 0.02, z, 0x9cf05a, { x: 0.6, y: 1.4, z: 0.4 }, { y: a }, 0));
  }
}

// ---------- TỔ ONG ----------
function toOng() {
  const b = boDung();
  b.tru(0.04, 0.04, 0.35, -0.15, 0.17, 0, 0x8a5a33, null, 5); b.tru(0.04, 0.04, 0.35, 0.15, 0.17, 0, 0x8a5a33, null, 5);
  b.hop(0.5, 0.18, 0.4, 0, 0.44, 0, 0xfff1b8); b.hop(0.5, 0.18, 0.4, 0, 0.63, 0, 0xffd966); b.hop(0.5, 0.16, 0.4, 0, 0.8, 0, 0xfff1b8);
  b.hop(0.6, 0.06, 0.5, 0, 0.91, 0, 0xc0392b); b.hop(0.16, 0.03, 0.02, 0, 0.4, 0.21, 0x5a3a1a);
  return b.xong();
}

// ---------- BIỂU TƯỢNG HÀNG MỚI (dựng khối) ----------
function iconMoi(id) {
  const b = boDung(), tint = (o, hex, bo) => { o.traverse(m => { if (m.isMesh) { m.material = m.material.clone(); m.material.color = new T.Color(hex).convertSRGBToLinear(); if (bo) m.material.map = null; } }); return o; };
  const ly = (mau, boba, lop) => { // ly nước: ly thuỷ tinh KayKit nhuộm màu + ống hút
    const g = new T.Group(); g.add(tint(kk('milk'), mau)); const bb = new T.Box3().setFromObject(g), h = bb.max.y, w = (bb.max.x - bb.min.x) / 2;
    b.tru(w * 0.12, w * 0.12, h * 0.9, w * 0.3, h * 0.8, 0, 0xff5c8a, { z: -0.25 }, 6);
    if (boba) for (let i = 0; i < 7; i++) b.cau(w * 0.16, (i % 3 - 1) * w * 0.4, h * 0.12 + Math.floor(i / 3) * w * 0.25, (i % 2 - 0.5) * w * 0.4, 0x2a1a12, null, null, 0);
    if (lop) b.tru(w * 0.86, w * 0.86, h * 0.15, 0, h * 0.72, 0, lop, null, 12);
    g.add(b.xong()); return g;
  };
  const banhKem = (vo, kem, top) => { b.tru(0.45, 0.45, 0.3, 0, 0.15, 0, vo, null, 16); b.tru(0.47, 0.47, 0.08, 0, 0.32, 0, kem, null, 16); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; b.cau(0.07, Math.cos(a) * 0.36, 0.38, Math.sin(a) * 0.36, kem, null, null, 1); } if (top) b.cau(0.1, 0, 0.44, 0, top, null, null, 1); return b.xong(); };
  const muffin = (vo, top) => { b.tru(0.3, 0.24, 0.3, 0, 0.15, 0, 0xe8a85a, null, 12); b.cau(0.34, 0, 0.36, 0, vo, { x: 1, y: 0.7, z: 1 }, null, 1); if (top) b.cau(0.09, 0, 0.58, 0, top, null, null, 1); return b.xong(); };
  const ao = (mau, dai, tay) => { b.hop(0.55, dai || 0.6, 0.2, 0, (dai || 0.6) / 2, 0, mau); b.hop(0.22, 0.4, 0.18, 0.36, (dai || 0.6) - 0.2, 0, mau, { z: tay || 0.5 }); b.hop(0.22, 0.4, 0.18, -0.36, (dai || 0.6) - 0.2, 0, mau, { z: -(tay || 0.5) }); return b; };
  const hu = (mau) => tint(kk('jar_C_small'), mau);
  const dia = tren => { const g = new T.Group(); g.add(vua(kk('plate'), 1)); if (tren) { tren.position.y = 0.06; g.add(tren); } return g; };
  switch (id) {
    case 'phan_bon': { const g = new T.Group(); g.add(tint(kk('sack'), 0x9a6a3a)); b.cau(0.12, 0.1, 0.75, 0.2, 0x5cc23a, { x: 1.4, y: 0.5, z: 0.8 }, { z: 0.5 }, 1); b.cau(0.1, -0.08, 0.78, 0.2, 0x7fd64a, { x: 1.3, y: 0.5, z: 0.8 }, { z: -0.5 }, 1); g.add(b.xong()); return g; }
    case 'dong_xu_co': { b.tru(0.42, 0.42, 0.08, 0, 0.3, 0, 0xffc21f, { x: Math.PI / 2 }, 24); b.tru(0.34, 0.34, 0.1, 0, 0.3, 0, 0xe8a51a, { x: Math.PI / 2 }, 24); b.hop(0.14, 0.14, 0.12, 0, 0.3, 0, 0x7a4a1a); return b.xong(); }
    case 'diem': { b.hop(0.7, 0.1, 0.9, 0, 0.05, 0, 0x2f6fd0); b.hop(0.64, 0.08, 0.84, 0.02, 0.13, 0, 0xffffff); b.hop(0.7, 0.06, 0.9, 0, 0.2, 0, 0x3a8cf0, { x: 0 }); b.hop(0.08, 0.07, 0.9, -0.33, 0.13, 0, 0x1d4f9a); b.cau(0.12, 0.12, 0.27, 0.1, 0xffd21f, { x: 1, y: 0.3, z: 1 }, null, 1); return b.xong(); }
    case 'tt_hoa': case 'tt_den': case 'tt_bu_nhin': case 'tt_xe': case 'tt_ghe': case 'tt_thung': return ttModel(id);
    case 'thu_meo': return meo();
    case 'thu_chim': { const g = chimCan(); const c = g.userData.chim; g.remove(c); c.position.set(0, 0, 0); return c; }
    // cây ruộng
    case 'bong': { b.tru(0.03, 0.03, 0.6, 0, 0.3, 0, 0x7a5a2a); for (let i = 0; i < 4; i++) b.cau(0.2, Math.cos(i * 1.57) * 0.22, 0.65 + (i % 2) * 0.1, Math.sin(i * 1.57) * 0.22, 0xffffff, null, null, 1); return b.xong(); }
    case 'lua_nuoc': { for (let i = 0; i < 7; i++) { const a = (i - 3) * 0.13; b.tru(0.03, 0.03, 0.9, Math.sin(a) * 0.45, 0.45, 0, 0x9cc24a, { z: -a }, 4); b.cau(0.07, Math.sin(a) * 0.9 + 0.08, 0.88, 0, 0xf2c85b, { x: 0.8, y: 2.6, z: 0.8 }, { z: -a + 0.7 }, 0); } b.hop(0.3, 0.08, 0.12, 0, 0.3, 0.02, 0x4fae3a); return b.xong(); }
    case 'dau_tay': { for (const [x, z] of [[0, 0], [0.3, 0.15], [-0.25, 0.2]]) { b.non(0.18, 0.34, x, 0.2, z, 0xff3b4f, { x: Math.PI }, 8); b.non(0.12, 0.08, x, 0.4, z, 0x4fae3a, null, 6); } return b.xong(); }
    case 'ot': { for (let i = 0; i < 3; i++) b.non(0.09, 0.7, (i - 1) * 0.2, 0.35, 0, i === 1 ? 0xff8a1e : 0xff2e2e, { z: Math.PI + (i - 1) * 0.3 }, 8); return b.xong(); }
    case 'hoa_huong_duong': { for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; b.cau(0.13, Math.cos(a) * 0.32, 0.5 + Math.sin(a) * 0.32, 0, 0xffd21f, { x: 1, y: 1, z: 0.3 }, null, 0); } b.tru(0.22, 0.22, 0.1, 0, 0.5, 0.04, 0x6b3f1f, { x: Math.PI / 2 }, 14); return b.xong(); }
    case 'dua_hau': { b.cau(0.45, 0, 0.4, 0, 0x3f9e3a, { x: 1.2, y: 0.9, z: 1 }, null, 1); b.cau(0.3, 0.25, 0.25, 0.4, 0xff4d5e, { x: 1, y: 0.7, z: 0.25 }, null, 1); return b.xong(); }
    case 'khoai_tay': { for (const [x, z] of [[0, 0], [0.3, 0.1], [-0.25, 0.2]]) b.cau(0.2, x, 0.18, z, 0xc99a5b, { x: 1.3, y: 0.9, z: 1 }, null, 1); return b.xong(); }
    case 'ca_chua': { for (const [x, z] of [[0, 0], [0.32, 0.1], [-0.28, 0.15]]) { b.cau(0.22, x, 0.22, z, 0xff3b30, { x: 1, y: 0.85, z: 1 }, null, 1); b.non(0.1, 0.05, x, 0.42, z, 0x4fae3a, null, 5); } return b.xong(); }
    // quả
    case 'cam': { for (const [x, z] of [[0, 0], [0.34, 0.12], [-0.3, 0.18]]) { b.cau(0.24, x, 0.24, z, 0xff9a1f, null, null, 1); b.cau(0.06, x + 0.05, 0.47, z, 0x4fae3a, { x: 1.6, y: 0.4, z: 0.8 }, null, 0); } return b.xong(); }
    case 'ca_phe': { for (let i = 0; i < 6; i++) { const a = i * 1.1; b.cau(0.13, Math.cos(a) * 0.25, 0.12 + (i % 2) * 0.1, Math.sin(a) * 0.25, 0x6b3a1f, { x: 1.3, y: 0.7, z: 0.9 }, { y: a }, 1); } return b.xong(); }
    case 'xoai': { b.cau(0.3, 0, 0.3, 0, 0xffc21f, { x: 1.35, y: 1, z: 0.95 }, { z: 0.4 }, 1); b.cau(0.2, 0.22, 0.4, 0.05, 0xff8a1e, { x: 1, y: 0.8, z: 0.8 }, null, 1); b.cau(0.06, -0.3, 0.52, 0, 0x4fae3a, { x: 2, y: 0.4, z: 0.8 }, null, 0); return b.xong(); }
    case 'vai': { for (let i = 0; i < 7; i++) b.cau(0.15, (i % 3 - 1) * 0.22, 0.18 + Math.floor(i / 3) * 0.2, (i % 2 - 0.5) * 0.18, 0xe0302e, null, null, 1); b.tru(0.02, 0.02, 0.4, 0, 0.75, 0, 0x6b8a2a); return b.xong(); }
    case 'la_che': { for (let i = 0; i < 5; i++) b.cau(0.2, (i - 2) * 0.13, 0.2 + Math.abs(i - 2) * 0.05, 0, i % 2 ? 0x7fd64a : 0x4fae3a, { x: 0.6, y: 1.5, z: 0.3 }, { z: (i - 2) * 0.35 }, 1); return b.xong(); }
    case 'chuoi': { for (let i = 0; i < 4; i++) b.cau(0.1, (i - 1.5) * 0.14, 0.35, 0, 0xffd93b, { x: 0.8, y: 3.4, z: 0.8 }, { z: 0.5 - i * 0.08 }, 1); b.tru(0.05, 0.05, 0.2, 0.3, 0.72, 0, 0x6b8a2a, { z: 0.4 }); return b.xong(); }
    case 'dua': { const q = qcPhan('Coconut_Half'); if (q) b.phan(q, 0, 0, 0, 1, 0.6); else b.cau(0.4, 0, 0.4, 0, 0x6b4a2a, null, null, 1); return b.xong(); }
    // vật nuôi
    case 'len': { b.cau(0.4, 0, 0.4, 0, 0xfaf6ee, null, null, 1); for (let i = 0; i < 4; i++) b.tru(0.41, 0.41, 0.03, 0, 0.4, 0, 0xe8dcc8, { x: i * 0.8, z: 0.4 }, 16); return b.xong(); }
    case 'mat_ong': return hu(0xffb81f);
    case 'cam_cuu': return tint(kk('sack'), 0x9ad0ff);
    // sản phẩm
    case 'mat_mia': return hu(0x8a4a1a);
    case 'banh_ca_phe': return muffin(0x7a4a2a, 0x3a1a0a);
    case 'banh_tra_xanh': return muffin(0x8fcf5a, 0xffffff);
    case 'bong_ngo_bo': case 'bong_ngo_cay': { const g = new T.Group(); g.add(vua(kk('bowl'), 1)); const rr = rnd(5); for (let i = 0; i < 16; i++) b.cau(0.1, (rr() - 0.5) * 0.6, 0.25 + rr() * 0.25, (rr() - 0.5) * 0.6, id === 'bong_ngo_cay' ? (i % 3 ? 0xffe0b0 : 0xff3b30) : (i % 3 ? 0xffe98a : 0xfff8e0), null, null, 1); g.add(b.xong()); return g; }
    case 'banh_mi_thit': { b.cau(0.25, 0, 0.2, 0, 0xe8a85a, { x: 2.4, y: 0.8, z: 1 }, null, 1); b.hop(0.9, 0.06, 0.2, 0, 0.24, 0.12, 0xd9463a); b.hop(0.8, 0.05, 0.18, 0, 0.29, 0.14, 0x7fd64a); return b.xong(); }
    case 'com_rang': { const g = new T.Group(); g.add(vua(kk('bowl'), 1)); b.cau(0.4, 0, 0.3, 0, 0xffe07a, { x: 1, y: 0.45, z: 1 }, null, 1); const rr = rnd(9); for (let i = 0; i < 8; i++) b.cau(0.04, (rr() - 0.5) * 0.5, 0.42, (rr() - 0.5) * 0.5, i % 2 ? 0x7fd64a : 0xff8a1e, null, null, 0); g.add(b.xong()); return g; }
    case 'khoai_nuong': { b.cau(0.3, 0, 0.2, 0, 0xc99a5b, { x: 1.4, y: 0.7, z: 1 }, null, 1); b.cau(0.2, 0, 0.32, 0, 0xffe07a, { x: 1.2, y: 0.4, z: 0.7 }, null, 1); b.cau(0.04, 0.08, 0.4, 0, 0x4fae3a, null, null, 0); return dia(b.xong()); }
    case 'ca_chua_nuong': { for (const [x, z] of [[-0.18, 0], [0.18, 0.05], [0, -0.2]]) { b.cau(0.17, x, 0.1, z, 0xff3b30, { x: 1, y: 0.6, z: 1 }, null, 1); b.cau(0.1, x, 0.17, z, 0xffb07a, { x: 1, y: 0.2, z: 1 }, null, 0); } return dia(b.xong()); }
    case 'banh_thit_nuong': case 'banh_chuoi_nuong': { b.tru(0.42, 0.36, 0.16, 0, 0.08, 0, 0xd9a45a, null, 12); b.tru(0.36, 0.36, 0.05, 0, 0.17, 0, id === 'banh_thit_nuong' ? 0x9a4a2a : 0xffd93b, null, 12); for (let i = 0; i < 8; i++) b.hop(0.12, 0.04, 0.05, Math.cos(i / 8 * 6.283) * 0.4, 0.17, Math.sin(i / 8 * 6.283) * 0.4, 0xd9a45a, { y: -i / 8 * 6.283 }); if (id === 'banh_chuoi_nuong') for (let i = 0; i < 5; i++) b.tru(0.07, 0.07, 0.03, Math.cos(i * 1.25) * 0.2, 0.21, Math.sin(i * 1.25) * 0.2, 0xfff1a8, null, 8); return b.xong(); }
    case 'ao_len': return ao(0xff8fb1).xong();
    case 'ao_len_xanh': return ao(0x5a8cff).xong();
    case 'ao_so_mi': { ao(0xffffff); b.hop(0.24, 0.1, 0.06, 0, 0.58, 0.1, 0xe8e8e8); for (let i = 0; i < 3; i++) b.cau(0.025, 0, 0.45 - i * 0.12, 0.11, 0x5a8cff, null, null, 0); return b.xong(); }
    case 'ao_dai': { ao(0xe8323a, 1.0, 0.35); b.hop(0.5, 0.35, 0.02, 0, 0.28, 0.12, 0xffd21f); b.hop(0.26, 0.08, 0.2, 0, 0.98, 0, 0xe8323a); return b.xong(); }
    case 'quan_len': { b.hop(0.5, 0.15, 0.2, 0, 0.75, 0, 0x9a6b3c); b.hop(0.22, 0.6, 0.2, 0.13, 0.4, 0, 0x9a6b3c); b.hop(0.22, 0.6, 0.2, -0.13, 0.4, 0, 0x9a6b3c); return b.xong(); }
    case 'mu_len': { b.cau(0.35, 0, 0.2, 0, 0x5a8cff, { x: 1, y: 0.9, z: 1 }, null, 1); b.tru(0.36, 0.36, 0.12, 0, 0.12, 0, 0x3a6ae0, null, 14); b.cau(0.12, 0, 0.55, 0, 0xffffff, null, null, 1); return b.xong(); }
    case 'vai_bong': return tint(kk('Textiles_A'), 0xfff8ee);
    case 'banh_bong_lan': return banhKem(0xe8a85a, 0xfff1e0, 0xff8a1e);
    case 'banh_kem': return banhKem(0xfff1e0, 0xffffff, 0xff3b4f);
    case 'banh_xoai': return banhKem(0xfff1e0, 0xffc21f, 0xff8a1e);
    case 'banh_pho_mai': return banhKem(0xe8c07a, 0xfff3b0, null);
    case 'banh_kem_dau': return banhKem(0xfff1e0, 0xffb3c7, 0xff3b4f);
    case 'banh_mat_ong': return banhKem(0xe8a85a, 0xffb81f, 0xfff1a8);
    case 'nuoc_ca_rot': return ly(0xff8a1e);
    case 'nuoc_vai': return ly(0xfff0f0);
    case 'nuoc_cam': return ly(0xffa62b);
    case 'nuoc_dua_hau': return ly(0xff5a6e);
    case 'sinh_to_xoai': return ly(0xffc21f);
    case 'nuoc_dua': { const q = qcPhan('Coconut_Half'); if (q) b.phan(q, 0, 0, 0, 1, 0.6); b.tru(0.03, 0.03, 0.9, 0.1, 0.75, 0, 0x5ad0ff, { z: -0.3 }, 6); return b.xong(); }
    case 'ca_phe_sua': return ly(0x8a5a3a, false, 0xf4e6d0);
    case 'tra_sua': return ly(0xd9b48a, true);
    case 'tra_mat_ong': return ly(0xe0a02a);
    case 'cua': { b.hop(0.9, 0.24, 0.03, 0, 0.3, 0, 0xc4ccd4); for (let i = 0; i < 9; i++) b.non(0.04, 0.06, -0.4 + i * 0.1, 0.16, 0, 0xa8b0b8, { x: Math.PI }, 3); b.hop(0.3, 0.2, 0.08, 0.55, 0.36, 0, 0xd9443a); return b.xong(); }
    case 'riu': { b.tru(0.04, 0.04, 0.9, 0, 0.45, 0, 0x8a5a33, { z: 0.35 }, 6); b.hop(0.3, 0.26, 0.05, -0.2, 0.82, 0, 0xc4ccd4, { z: 0.35 }); return b.xong(); }
    // cửa hàng
    case 'vat_ong': case 'chuong_ong': return toOng();
    case 'diem_nv': return kk('star_yellow');
    case 'qua': { b.hop(0.7, 0.5, 0.7, 0, 0.25, 0, 0xe8323a); b.hop(0.78, 0.14, 0.78, 0, 0.56, 0, 0xff4d5e); b.hop(0.14, 0.66, 0.8, 0, 0.3, 0, 0xffd21f); b.hop(0.8, 0.66, 0.14, 0, 0.3, 0, 0xffd21f); b.cau(0.13, -0.12, 0.72, 0, 0xffd21f, { x: 1.2, y: 0.8, z: 0.6 }, { z: 0.5 }, 1); b.cau(0.13, 0.12, 0.72, 0, 0xffd21f, { x: 1.2, y: 0.8, z: 0.6 }, { z: -0.5 }, 1); return b.xong(); }
    case 'so_nv': { b.hop(0.8, 0.12, 0.62, 0, 0.06, 0, 0x8a4a1a); b.hop(0.74, 0.08, 0.56, 0, 0.14, 0, 0xfff4d6); for (let i = 0; i < 4; i++) b.hop(0.5, 0.02, 0.04, 0, 0.19, -0.18 + i * 0.12, 0xc9a25a); b.hop(0.08, 0.4, 0.02, 0.3, 0.2, 0.3, 0xe8323a); b.cau(0.14, 0.26, 0.42, 0.3, 0xffd21f, null, null, 1); return b.xong(); }
    case 'chuong_cuu': { const g = new T.Group(); g.add(vua(kk('fence_wood_straight_gate'), 1)); const m = mang(0x9ad0ff); m.scale.setScalar(0.6); m.position.set(0, 0, 0.4); g.add(m); return g; }
  }
  if (id.startsWith('cay_')) return cayQuaMesh(id.slice(4), 2, 0);
  return null;
}

// ---------- CÂY "BÔNG XÙ" kiểu Hay Day: tán nhiều khối tròn đổ bóng mịn, dưới tối trên sáng ----------
const LA = { tron: [0x5fbf45, 0x4fae3a, 0x74cf52, 0x66c24a], cao: [0x4fae3a, 0x3f9e36, 0x5fbf45], thong: [0x2f8f4a, 0x3a9f52, 0x2a8044], bui: [0x5cbf42, 0x4aae36, 0x6fd24e] };
const toi = (hex, k) => { const c = new T.Color(hex); return c.multiplyScalar(k).getHex(); };
// ve tán tròn: n khối cầu xếp thành vòm, khối dưới tối hơn (giả bóng khuất), khối trên sáng hơn
function tanBong(b, cx, cy, cz, R, n, mau, r, min, dh, doiMau) {
  const f = doiMau || (x => x);
  b.cau(R * 0.78, cx, cy, cz, f(toi(mau[0], 0.9)), { x: 1, y: 0.85, z: 1 }, null, min);
  for (let i = 0; i < n; i++) {
    const a = i / n * 6.283 + r() * 0.6, tang = i % 3, y = cy + (tang - 1) * R * 0.32 * (dh || 1), bk = R * (tang === 2 ? 0.35 : 0.6) * (0.85 + r() * 0.3);
    const rr = R * (0.42 + r() * 0.16), sang = tang === 2 ? 1.12 : tang === 0 ? 0.82 : 1;
    b.cau(rr, cx + Math.cos(a) * bk, y, cz + Math.sin(a) * bk, f(toi(mau[i % mau.length], sang)), { x: 1, y: 0.9, z: 1 }, null, min);
  }
  b.cau(R * 0.45, cx + (r() - 0.5) * R * 0.2, cy + R * 0.5 * (dh || 1), cz + (r() - 0.5) * R * 0.2, f(toi(mau[mau.length - 1], 1.15)), null, null, min);
}
function thanCay(b, h, day, r, mau) { // thân cây hơi cong, gốc loe
  const m = mau || 0x8a5a36, doan = 3, lech = (r() - 0.5) * 0.14;
  for (let i = 0; i < doan; i++) { const t0 = i / doan, rr = day * (1 - t0 * 0.45); b.tru(rr * 0.82, rr, h / doan + 0.02, lech * t0 * 3, h * (i + 0.5) / doan, 0, i ? m : toi(m, 0.9), { z: -lech * 1.5 }, 7); }
  b.cau(day * 1.25, 0, 0.02, 0, toi(m, 0.85), { x: 1, y: 0.35, z: 1 }, null, 0);
  return lech * 3;
}
const cayBongCache = {};
function cayBongGeo(kieu, bien, min) { // hình học 1 cây (gộp) — dùng chung cho nhân bản
  const key = kieu + bien + (min || 0);
  if (cayBongCache[key]) return cayBongCache[key];
  const b = boDung(true), r = rnd(bien * 13 + kieu.length);
  if (kieu === 'tron') { const x = thanCay(b, 1.1, 0.13, r); tanBong(b, x, 1.55, 0, 0.8, 8, LA.tron, r, min); }
  else if (kieu === 'cao') { const x = thanCay(b, 1.3, 0.12, r); tanBong(b, x, 1.9, 0, 0.62, 7, LA.cao, r, min, 1.8); }
  else if (kieu === 'thong') { b.tru(0.1, 0.13, 0.5, 0, 0.25, 0, 0x7a4a2e, null, 7); for (let i = 0; i < 3; i++) b.non(0.75 - i * 0.18, 0.8, 0, 0.75 + i * 0.5, 0, toi(LA.thong[i], 0.9 + i * 0.1), null, 12); }
  else if (kieu === 'bui') tanBong(b, 0, 0.32, 0, 0.42, 6, LA.bui, r, min, 0.7);
  return (cayBongCache[key] = b.xong().geometry);
}
// rừng/khóm cây nhân bản: ds [{x, z, kieu, xoay, k}]
// chia theo ô 16×16 m: mỗi nhóm có khối cầu bao đúng chỗ các cây của nó (InstancedMesh r128 lấy khối bao của hình gốc ở gốc toạ độ
// ⇒ không sửa thì kéo camera ra xa gốc là mất cả rừng); v.min = độ mịn riêng (cây xa dùng 0 cho nhẹ)
function rungBong(ds, min) {
  const g = new T.Group(), nhom = {};
  ds.forEach((v, i) => { const mn = v.min != null ? v.min : min == null ? 1 : min, k = v.kieu + (i % 3) + "|" + mn + "|" + Math.floor(v.x / 16) + "_" + Math.floor(v.z / 16); (nhom[k] = nhom[k] || { kieu: v.kieu, bien: i % 3, mn, ds: [] }).ds.push(v); });
  const q = new T.Quaternion(), e = new T.Euler(), sc = new T.Vector3(), p = new T.Vector3();
  for (const k in nhom) {
    const n = nhom[k], goc = cayBongGeo(n.kieu, n.bien, n.mn), geo = new T.BufferGeometry();
    for (const a in goc.attributes) geo.setAttribute(a, goc.attributes[a]); // dùng chung bộ đệm, chỉ khác khối bao
    let cx = 0, cz = 0; n.ds.forEach(v => { cx += v.x; cz += v.z; }); cx /= n.ds.length; cz /= n.ds.length;
    let R = 0; n.ds.forEach(v => { R = Math.max(R, Math.hypot(v.x - cx, v.z - cz) + 3.2 * (v.k || 1)); });
    geo.boundingSphere = new T.Sphere(new T.Vector3(cx, 2, cz), R);
    const im = new T.InstancedMesh(geo, MAT_MIN, n.ds.length);
    n.ds.forEach((v, i) => { e.set(0, v.xoay || 0, 0); q.setFromEuler(e); sc.setScalar(v.k || 1); p.set(v.x, 0, v.z); im.setMatrixAt(i, new T.Matrix4().compose(p, q, sc)); });
    im.castShadow = true; im.receiveShadow = true; g.add(im);
  }
  return g;
}
// cây bông xù có quả (trang trí + vườn)
function cayQuaBong(b, r, mauQua, soQua, doiMau, cao) {
  const x = thanCay(b, 1.05 * (cao || 1), 0.12, r); tanBong(b, x, 1.5 * (cao || 1), 0, 0.72, 8, LA.tron, r, 2, 1, doiMau);
  if (mauQua) for (let i = 0; i < soQua; i++) { const a = i / soQua * 6.283 + r() * 0.5, y = 1.5 * (cao || 1) + (r() - 0.3) * 0.5; b.cau(0.09, x + Math.cos(a) * 0.72, y, Math.sin(a) * 0.72, mauQua, null, null, 1); }
}

// ---------- THÚ CƯNG & ĐỒ TRANG TRÍ (nhịp ngày) ----------
// mèo mướp ngồi: thân tròn, đầu to, tai nhọn, đuôi cong (userData.duoi để vẫy, userData.dau để gật)
function meo() {
  const g = new T.Group(), b = boDung(true), cam_ = 0xf5a14a, kem = 0xfff1dc;
  b.cau(0.24, 0, 0.22, 0, cam_, { x: 1, y: 1.05, z: 1.2 }, null, 2); b.cau(0.15, 0, 0.2, 0.14, kem, { x: 1, y: 1.1, z: 0.7 }, null, 1);
  for (const s_ of [1, -1]) { b.cau(0.07, s_ * 0.12, 0.05, 0.16, kem, { x: 1, y: 0.6, z: 1.3 }, null, 1); b.cau(0.08, s_ * 0.15, 0.08, -0.12, cam_, { x: 1, y: 0.7, z: 1.4 }, null, 1); }
  for (let i = 0; i < 3; i++) b.hop(0.36, 0.035, 0.1, 0, 0.3 + i * 0.08, -0.12 + i * 0.02, 0xd9782a, { x: 0.3 });
  const tan = b.xong(); g.add(tan);
  const dau = new T.Group(); dau.position.set(0, 0.5, 0.08); g.add(dau);
  const bd = boDung(true);
  bd.cau(0.2, 0, 0, 0, cam_, { x: 1.15, y: 1, z: 1 }, null, 2); bd.cau(0.1, 0, -0.05, 0.13, kem, { x: 1.3, y: 0.8, z: 0.7 }, null, 1);
  for (const s_ of [1, -1]) {
    bd.non(0.08, 0.16, s_ * 0.13, 0.17, 0, cam_, { z: -s_ * 0.3 }, 8); bd.non(0.045, 0.1, s_ * 0.13, 0.16, 0.02, 0xffb3b3, { z: -s_ * 0.3 }, 6);
    bd.cau(0.035, s_ * 0.075, 0.03, 0.17, 0x2a2a2a, { x: 0.8, y: 1.15, z: 0.6 }, null, 1); bd.cau(0.012, s_ * 0.08, 0.05, 0.195, 0xffffff, null, null, 0);
    bd.cau(0.03, s_ * 0.13, -0.05, 0.14, 0xffb3b3, { x: 1, y: 0.5, z: 0.4 }, null, 0);
  }
  bd.cau(0.022, 0, -0.02, 0.2, 0xff8fa3, null, null, 0);
  dau.add(bd.xong());
  const duoi = new T.Group(); duoi.position.set(0, 0.1, -0.24); g.add(duoi);
  const bt = boDung(true); for (let i = 0; i < 6; i++) { const a = i / 5; bt.cau(0.045, 0, a * 0.35, -Math.sin(a * 2.2) * 0.12, i === 5 ? kem : cam_, null, null, 1); } duoi.add(bt.xong());
  g.userData.dau = dau; g.userData.duoi = duoi; g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
// cột ăn cho chim: cột gỗ + khay hạt + mái nhỏ, 1 chú chim tròn đậu trên khay (userData.chim để nhún)
function chimCan() {
  const g = new T.Group(), b = boDung();
  b.hop(0.1, 1.1, 0.1, 0, 0.55, 0, 0x8a5a33); b.hop(0.62, 0.06, 0.62, 0, 1.12, 0, 0xb97d47);
  for (const [x, z] of [[0.28, 0.28], [-0.28, 0.28], [0.28, -0.28], [-0.28, -0.28]]) b.hop(0.04, 0.34, 0.04, x, 1.3, z, 0x8a5a33);
  b.hop(0.5, 0.04, 0.8, 0.17, 1.52, 0, 0xe8553d, { z: -0.6 }); b.hop(0.5, 0.04, 0.8, -0.17, 1.52, 0, 0xe8553d, { z: 0.6 });
  for (let i = 0; i < 10; i++) b.cau(0.025, (i % 4 - 1.5) * 0.1, 1.16, (Math.floor(i / 4) - 1) * 0.1, 0xf2c85b, null, null, 0);
  g.add(b.xong());
  const chim = new T.Group(); chim.position.set(0.12, 1.15, 0.05); g.add(chim);
  const bc = boDung(true), xanh = 0x5ab8ff;
  bc.cau(0.11, 0, 0.1, 0, xanh, { x: 1, y: 0.95, z: 1.15 }, null, 2); bc.cau(0.07, 0, 0.08, 0.05, 0xfff4dc, { x: 1, y: 1, z: 0.8 }, null, 1);
  bc.cau(0.085, 0, 0.21, 0.07, xanh, null, null, 2); bc.non(0.028, 0.07, 0, 0.2, 0.17, 0xffa21f, { x: Math.PI / 2 }, 5);
  for (const s_ of [1, -1]) { bc.cau(0.018, s_ * 0.045, 0.23, 0.13, 0x222222, null, null, 0); bc.cau(0.06, s_ * 0.09, 0.11, -0.01, 0x3a8fe0, { x: 0.35, y: 0.8, z: 1.2 }, null, 1); }
  bc.cau(0.05, 0, 0.13, -0.13, 0x3a8fe0, { x: 0.8, y: 0.3, z: 1.2 }, { x: 0.4 }, 0);
  chim.add(bc.xong());
  g.userData.chim = chim; g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function buNhin() {
  const b = boDung(true);
  b.hop(0.08, 1.4, 0.08, 0, 0.7, 0, 0x8a5a33); b.hop(0.9, 0.07, 0.07, 0, 1.05, 0, 0x8a5a33);
  b.hop(0.46, 0.5, 0.22, 0, 0.95, 0, 0xe8553d); b.hop(0.47, 0.06, 0.23, 0, 0.8, 0, 0x4a7fd0); b.hop(0.47, 0.06, 0.23, 0, 1.05, 0, 0x4a7fd0);
  b.cau(0.17, 0, 1.38, 0, 0xe9d09a, null, null, 1); b.cau(0.025, 0.06, 1.41, 0.15, 0x3a2a1a, null, null, 0); b.cau(0.025, -0.06, 1.41, 0.15, 0x3a2a1a, null, null, 0);
  b.tru(0.28, 0.28, 0.03, 0, 1.5, 0, 0xf2c85b, null, 14); b.non(0.15, 0.2, 0, 1.6, 0, 0xf2c85b, null, 12); b.tru(0.155, 0.155, 0.04, 0, 1.53, 0, 0xe8553d, null, 14);
  for (const s_ of [1, -1]) for (let i = 0; i < 3; i++) b.hop(0.12, 0.02, 0.02, s_ * 0.5, 1.05, (i - 1) * 0.03, 0xf2c85b, { z: s_ * (i - 1) * 0.4 });
  return b.xong();
}
function chauHoa(seed) {
  const g = new T.Group(), b = boDung(true);
  b.tru(0.24, 0.18, 0.32, 0, 0.16, 0, 0xd9743a, null, 14); b.tru(0.27, 0.27, 0.07, 0, 0.33, 0, 0xe8844a, null, 14); b.tru(0.22, 0.22, 0.02, 0, 0.34, 0, 0x6a4a2a, null, 14);
  g.add(b.xong());
  const h = cumHoa(8, 0.18, seed || 5); h.position.y = 0.34; h.scale.setScalar(1.6); g.add(h);
  return g;
}
// mô hình 1 món trang trí (dùng chung cho cảnh + biểu tượng)
function ttModel(id) {
  switch (id) {
    case 'tt_hoa': return chauHoa(7);
    case 'tt_den': return vua(kk('lantern'), 0.5, 1.6);
    case 'tt_bu_nhin': return buNhin();
    case 'tt_xe': return vua(kk('wheelbarrow'), 1.1);
    case 'tt_ghe': return vua(kk('bench'), 1.3);
    case 'tt_thung': { const g = new T.Group(); const a = vua(kk('barrel'), 0.6); a.position.x = -0.25; g.add(a); const c = vua(kk('crate_open'), 0.7); c.position.set(0.3, 0, 0.1); g.add(c); return g; }
  }
  return new T.Group();
}

// ---------- BIỂU TƯỢNG (chụp từ mô hình) ----------
const ICON = {};
function qaIcon(loai) { const mv = window.NT_DOHOA && NT_DOHOA.moi && NT_DOHOA.vatMoi(loai); if (mv) return mv; const p = QA_POOL[loai]; if (!p || !p.length) return vat(loai); const v = p[0]; chibi(v); v.mixer.update(0); return v.g; }
function vatIcon(id) { // trả Object3D cho biểu tượng id
  const mm = iconMoi(id); if (mm) return mm;
  const D = window.NT_DATA, b = boDung();
  const tint = (o, hex, k) => { o.traverse(m => { if (m.isMesh) { m.material = m.material.clone(); m.material.color = new T.Color(hex).convertSRGBToLinear(); if (k) m.material.map = null; } }); return o; };
  const bao = hex => tint(kk('sack'), hex);
  const dia = (tren) => { const g = new T.Group(); g.add(vua(kk('plate'), 1)); if (tren) { tren.position.y = 0.06; g.add(tren); } return g; };
  const banh = (vo, nhan) => { b.tru(0.42, 0.36, 0.16, 0, 0.08, 0, vo, null, 12); b.tru(0.36, 0.36, 0.04, 0, 0.17, 0, nhan, null, 12); for (let i = 0; i < 8; i++) b.hop(0.12, 0.04, 0.05, Math.cos(i / 8 * 6.283) * 0.4, 0.17, Math.sin(i / 8 * 6.283) * 0.4, vo, { y: -i / 8 * 6.283 }); return b.xong(); };
  switch (id) {
    case 'lua_mi': { for (let i = 0; i < 7; i++) { const a = (i - 3) * 0.12; b.hop(0.04, 0.9, 0.04, Math.sin(a) * 0.45, 0.45, 0, 0xc9982e, { z: -a }); b.hop(0.1, 0.24, 0.1, Math.sin(a) * 0.95, 0.95, 0, 0xf2c85b, { z: -a }); } b.hop(0.3, 0.08, 0.12, 0, 0.35, 0.02, 0xd9443a); return b.xong(); }
    case 'ngo': { b.hop(0.26, 0.7, 0.26, 0, 0.45, 0, 0xf5d142, { z: 0.35 }); for (let i = 0; i < 3; i++) b.hop(0.12, 0.6, 0.06, -0.12 + i * 0.12, 0.3, -0.12, 0x6fbf3f, { z: 0.35 + (i - 1) * 0.3 }); return b.xong(); }
    case 'dau_nanh': { for (let i = 0; i < 3; i++) { b.hop(0.18, 0.6, 0.12, (i - 1) * 0.22, 0.35, 0, 0x9fcf4a, { z: (i - 1) * 0.35 }); for (let k = 0; k < 3; k++) b.cau(0.06, (i - 1) * 0.22 + (k - 1) * 0.03 * (i - 1), 0.18 + k * 0.17, 0.05, 0xc7e27a); } return b.xong(); }
    case 'mia': { for (let i = 0; i < 3; i++) { for (let s = 0; s < 4; s++) b.tru(0.07, 0.075, 0.22, (i - 1) * 0.2, 0.13 + s * 0.24, 0, s % 2 ? 0x9cc24a : 0xb8cf5a, null, 6); b.hop(0.4, 0.03, 0.1, (i - 1) * 0.2, 1.05, 0, 0x5aa83a, { z: (i - 1) * 0.6 + 0.3 }); } return b.xong(); }
    case 'ca_rot': return kk('food_ingredient_carrot');
    case 'cham': { b.cau(0.3, 0, 0.3, 0, 0x3f8f2f, { x: 1, y: 0.9, z: 1 }); for (let i = 0; i < 6; i++) b.hop(0.1, 0.3, 0.1, Math.cos(i) * 0.2, 0.62, Math.sin(i) * 0.2, i % 2 ? 0x4a5fd8 : 0x6f55c8); return b.xong(); }
    case 'bi_ngo': { b.cau(0.5, 0, 0.36, 0, 0xef8a1f, { x: 1.1, y: 0.75, z: 1.1 }); b.tru(0.05, 0.06, 0.2, 0, 0.78, 0, 0x6b4a22, null, 5); b.hop(0.3, 0.03, 0.18, 0.15, 0.72, 0, 0x5aa83a, { z: 0.3 }); return b.xong(); }
    case 'trung': { for (const [x, z] of [[0, 0], [0.3, 0.1], [-0.2, 0.2]]) b.cau(0.2, x, 0.26, z, 0xfff4dc, { x: 1, y: 1.3, z: 1 }); b.tru(0.55, 0.45, 0.2, 0.03, 0.08, 0.1, 0xc9953f, null, 10); return b.xong(); }
    case 'sua': return kk('milk');
    case 'thit': return kk('food_ingredient_ham_cooked');
    case 'cam_ga': return bao(0xf2d060); case 'cam_bo': return bao(0x9fd46a); case 'cam_heo': return bao(0xf4a7c0);
    case 'banh_mi': return kk('food_ingredient_bun');
    case 'banh_ngo': return tint(kk('food_ingredient_bun'), 0xf7cf4a);
    case 'banh_quy': return kk('cookie');
    case 'kem_tuoi': { const g = new T.Group(); g.add(vua(kk('bowl'), 1)); b.cau(0.38, 0, 0.3, 0, 0xfffbf0, { x: 1, y: 0.6, z: 1 }); b.cau(0.18, 0, 0.5, 0, 0xffffff); g.add(b.xong()); return g; }
    case 'bo': { b.hop(0.7, 0.35, 0.45, 0, 0.2, 0, 0xf7df6e); b.hop(0.9, 0.06, 0.6, 0, 0.03, 0, 0xffffff); b.hop(0.2, 0.05, 0.3, 0.2, 0.4, 0, 0xfbe98f, { z: 0.3 }); return b.xong(); }
    case 'pho_mai': return kk('food_ingredient_cheese');
    case 'duong_nau': return kk('jar_C_small');
    case 'duong_trang': return kk('jar_A_small');
    case 'bong_ngo': { const g = new T.Group(); g.add(vua(kk('bowl'), 1)); const r = rnd(3); for (let i = 0; i < 16; i++) b.cau(0.1, (r() - 0.5) * 0.6, 0.25 + r() * 0.25, (r() - 0.5) * 0.6, i % 3 ? 0xfff8e0 : 0xf7e39a); g.add(b.xong()); return g; }
    case 'banh_kep': { for (let i = 0; i < 4; i++) b.tru(0.36, 0.38, 0.09, 0, 0.1 + i * 0.1, 0, 0xe0a44a, null, 12); b.hop(0.18, 0.1, 0.18, 0, 0.5, 0, 0xf7df6e); b.tru(0.3, 0.2, 0.03, 0, 0.47, 0, 0x8a4a1a, null, 12); return dia(b.xong()); }
    case 'thit_trung': { const g = dia(null); const h = vua(kk('food_ingredient_ham_cooked'), 0.5); h.position.set(-0.18, 0.06, 0); g.add(h); b.tru(0.22, 0.22, 0.03, 0.2, 0.08, 0.1, 0xffffff, null, 10); b.cau(0.08, 0.2, 0.12, 0.1, 0xf5b820, { x: 1, y: 0.6, z: 1 }); g.add(b.xong()); return g; }
    case 'banh_ca_rot': return banh(0xd9a45a, 0xf08a24);
    case 'banh_bi_ngo': return banh(0xd9a45a, 0xc9731f);
    case 'dinh': { b.tru(0.05, 0.05, 0.9, 0, 0.5, 0, 0x9aa5b1, { z: 0.6 }); b.tru(0.14, 0.14, 0.06, -0.26, 0.86, 0, 0x8a95a1, { z: 0.6 }); b.tru(0.05, 0.05, 0.9, 0.2, 0.45, 0.2, 0xaab5c1, { z: -0.5 }); return b.xong(); }
    case 'oc_vit': return kk('Parts_Cog');
    case 'van_ep': return kk('Wood_Planks_Stack_Small');
    case 'bu_long': return kk('Iron_Bar');
    case 'tam_go': return kk('Wood_Plank_A');
    case 'bang_keo': { b.tru(0.4, 0.4, 0.28, 0, 0.2, 0, 0x9aa5b1, { x: 1.2 }, 14); b.tru(0.22, 0.22, 0.3, 0, 0.2, 0, 0xd9c9a0, { x: 1.2 }, 12); return b.xong(); }
    case 'xu': { b.tru(0.45, 0.45, 0.12, 0, 0.3, 0, 0xf4b400, { x: 1.2 }, 16); b.tru(0.34, 0.34, 0.14, 0, 0.3, 0, 0xffd54a, { x: 1.2 }, 16); return b.xong(); }
    case 'xp': return tint(kk('star_yellow'), 0x3ea6ff, true);
    case 'vat_ga': return vat('ga'); case 'vat_bo': return qaIcon('bo'); case 'vat_heo': return qaIcon('heo'); case 'vat_cuu': return qaIcon('cuu');
    case 'may_det': return kk('building_lumbermill_yellow'); case 'may_may': return kk('building_home_A_yellow'); case 'lo_banh_ngot': return kk('building_home_B_red');
    case 'may_ep': return kk('building_tavern_yellow'); case 'quay_nuoc': return kk('building_market_blue');
    case 'chuong_ga': return nhaGa();
    case 'chuong_bo': { const g = new T.Group(); g.add(vua(kk('fence_wood_straight_gate'), 1)); const m = mang(0x9fd46a); m.scale.setScalar(0.6); m.position.set(0, 0, 0.4); g.add(m); return g; }
    case 'chuong_heo': { const g = new T.Group(); g.add(bun(1.2, 1)); g.add(vua(kk('fence_wood_straight'), 1.2)); return g; }
    case 'ruong': return datRuong();
    case 'may_cam': return kk('building_windmill_yellow');
    case 'lo_banh': return kk('building_blacksmith_yellow');
    case 'bo_sua': return kk('building_home_B_blue');
    case 'may_duong': return kk('building_watermill_blue');
    case 'noi_bong': return kk('pot_large');
    case 'bep_nuong': return kk('stove_single');
    case 'lo_pie': return kk('oven');
    case 'sap': return kk('building_market_red');
    case 'kho_barn': return kk('building_home_A_red');
    case 'kho_silo': return kk('watertower');
    case 'liem': { b.hop(0.1, 0.7, 0.1, 0, 0.35, 0, 0x8a5a33, { z: 0.3 }); b.hop(0.7, 0.1, 0.06, 0.25, 0.75, 0, 0xc4ccd4, { z: -0.35 }); b.hop(0.3, 0.1, 0.06, 0.62, 0.62, 0, 0xc4ccd4, { z: -1.1 }); return b.xong(); }
  }
  return null;
}
function taoIcon(ids) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const R = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true });
  R.outputEncoding = T.sRGBEncoding; R.setClearColor(0x000000, 0);
  const sc = new T.Scene(); sc.add(new T.HemisphereLight(0xffffff, 0x8899aa, 0.95));
  const sun = new T.DirectionalLight(0xffffff, 0.9); sun.position.set(-2, 4, 3); sc.add(sun);
  const cam = new T.PerspectiveCamera(26, 1, 0.01, 100);
  for (const id of ids) {
    const o = vatIcon(id); if (!o) continue;
    const g = new T.Group(); g.add(o); g.rotation.y = -0.5; sc.add(g);
    const bb = new T.Box3().setFromObject(g), ct = bb.getCenter(new T.Vector3()), sz = bb.getSize(new T.Vector3());
    const r = Math.max(sz.x, sz.y, sz.z) * 0.62;
    const dir = new T.Vector3(0, 0.55, 1).normalize();
    cam.position.copy(ct).addScaledVector(dir, r / Math.tan(13 * Math.PI / 180)); cam.lookAt(ct);
    R.render(sc, cam);
    ICON[id] = cv.toDataURL('image/png');
    sc.remove(g);
  }
  R.dispose(); R.forceContextLoss && R.forceContextLoss();
}
function icon(id) { return ICON[id] || ''; }

window.NT_MODELS = { meo, chimCan, buNhin, chauHoa, ttModel, rungBong, cayQuaBong, cayQuaMesh, toOng, cumHoa, buiTron, ao, daLat, buom, layVatQ, chibi, qcPhan, tuoiMau, tai, kk, vua, nhanBan, cayMesh, datRuong, vat, bangDon, giayDon, nhaGa, mang, bun, giaoCo, congTruong, lanhDat, boDung, taoIcon, icon, rnd, mat };
})();
