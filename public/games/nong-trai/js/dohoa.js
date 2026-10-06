/* Nông Trại BK — LỚP HOÀN THIỆN ĐỒ HOẠ (bản thử 30/09, nhánh do-hoa-thu).
   Mặc định BẬT. Xem bản cũ để so: thêm ?dohoa=cu vào URL. Tắt riêng mờ tilt-shift: ?tilt=0.
   Ý tưởng (nghiên cứu Little Habitats — ERP design/nghien-cuu-do-hoa-little-habitats.md):
   "tươi" không đến từ việc đẩy độ bão hoà từng vật, mà từ MỘT hệ thống chung cho cả cảnh:
     1. ánh sáng: nắng ấm làm chủ, trời/đất hắt nhẹ (đất hắt màu be, không hắt xanh chuối)
     2. bóng tiếp đất: bản đồ chiều cao chụp từ trên xuống → làm mờ → tô tối quanh chân mọi vật
     3. viền sáng (fresnel) nhẹ cho mọi vật → khối tách khỏi nền
     4. hậu kỳ: mờ trên/dưới (tilt-shift, cảm giác mô hình thu nhỏ) + chỉnh màu kiểu phim
        (nén sáng Khronos Neutral, bóng ngả tím-xanh, sáng ngả ấm, không đen tuyền, tối mép, hạt nhẹ)
   Chạy trên three r128 (không cần nâng bản). */
(function () {
'use strict';
const T = THREE;
const Q = new URLSearchParams(location.search);
const moi = Q.get('dohoa') !== 'cu';

// ---------- thông số (1 chỗ để chỉnh) ----------
const TS = {
  nang: { mau: 0xfff1d6, manh: 1.3 },                        // mặt trời
  troi: { tren: 0xd4e6f8, duoi: 0xc4b48e, manh: 0.62 },        // hemisphere: trời xanh nhạt / đất be ấm
  suongMu: 0xe8efe6,
  mau: {                                                       // chỉnh màu (làm trong không gian gamma)
    phoi: 1.0, baoHoa: +(Q.get('bh') || 1.22), tuongPhan: 1.06, am: 0.035, // TƯƠI (CEO gật 30/09); ?bh=1.04 = bản dịu
    tach: 0.16, mauBong: [0.46, 0.46, 0.84], mauSang: [1.0, 0.93, 0.82],
    nangDen: 0.025, vignette: 0.3, mauVien: [0.22, 0.18, 0.22], hat: 0.022,
  },
  tilt: { bat: Q.get('tilt') !== '0', rong: 0.25, mem: 0.36, max: 0.8 },  // nửa bề rộng dải nét + độ mềm (theo chiều cao màn)
  bongDat: { manh: 1.0, mau: [0.42, 0.45, 0.66] },              // bóng tiếp đất: độ đậm + màu (lạnh); loang ~0,5 m quanh chân vật
  vien: 0.14,                                                  // viền sáng
};

// ---------- 1. viền sáng: chèn vào MỌI MeshStandardMaterial (kể cả mô hình KayKit/Quaternius) ----------
if (moi) {
  const P = T.MeshStandardMaterial.prototype;
  P.onBeforeCompile = function (sh) {
    if (this.userData && this.userData.khongVien) return;
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      {
        float dhVien = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0);
        totalEmissiveRadiance += vec3(1.0, 0.94, 0.82) * diffuseColor.rgb * dhVien * ${TS.vien.toFixed(3)};
      }`);
  };
  P.customProgramCacheKey = function () { return this.userData && this.userData.khongVien ? 'dh-0' : 'dh-1'; };
}

// ---------- 2. nướng "bóng khuất" vào màu đỉnh (dùng cho bộ dựng khối boDung + con vật dựng mới) ----------
// Mỗi khối tối dần về phía đáy CỦA CHÍNH NÓ (đo trước khi xoay/đặt), mặt úp xuống ngả lạnh.
function nuongMau(yGoc, y0, y1, ny, c, ao, lanh) {
  const t = y1 > y0 ? (yGoc - y0) / (y1 - y0) : 1;
  c.multiplyScalar(1 - ao + ao * 1.3 * t);
  if (ny < 0) { const u = -ny * lanh; c.r *= 1 - 0.3 * u; c.g *= 1 - 0.22 * u; c.b *= 1 - 0.05 * u; }
  return c;
}

// ---------- 3. bộ dựng mịn (con vật mới): khối tròn mịn + nướng bóng khuất ----------
function boMin() {
  const pos = [], nor = [], col = [];
  const m4 = new T.Matrix4(), m3 = new T.Matrix3(), q = new T.Quaternion(), e = new T.Euler(), s = new T.Vector3(), p = new T.Vector3(), v = new T.Vector3(), n = new T.Vector3(), c = new T.Color();
  function them(g, o) {
    const G = g.index ? g.toNonIndexed() : g, P = G.attributes.position, N = G.attributes.normal;
    let y0 = Infinity, y1 = -Infinity; for (let i = 0; i < P.count; i++) { const y = P.getY(i); if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const k = o.s == null ? [1, 1, 1] : typeof o.s === 'number' ? [o.s, o.s, o.s] : o.s;
    if (o.q) q.copy(o.q); else { e.set(...(o.r || [0, 0, 0])); q.setFromEuler(e); } s.set(...k); p.set(...(o.p || [0, 0, 0])); m4.compose(p, q, s); m3.getNormalMatrix(m4);
    const goc = new T.Color(o.mau).convertSRGBToLinear(), ham = o.mauHam;
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(m4); n.fromBufferAttribute(N, i).applyMatrix3(m3).normalize();
      nuongMau(P.getY(i), y0, y1, n.y, ham ? c.setHex(ham(v.x, v.y, v.z)).convertSRGBToLinear() : c.copy(goc), o.ao == null ? 0.22 : o.ao, o.lanh == null ? 0.3 : o.lanh);
      pos.push(v.x, v.y, v.z); nor.push(n.x, n.y, n.z); col.push(c.r, c.g, c.b);
    }
    if (G !== g) G.dispose(); g.dispose();
  }
  return {
    cau(r, o, min) { them(new T.IcosahedronGeometry(r, min == null ? 3 : min), o); },
    tru(rt, rd, h, o, doan) { them(new T.CylinderGeometry(rt, rd, h, doan || 10), o); },
    non(rd, h, o, doan) { them(new T.ConeGeometry(rd, h, doan || 10), o); },
    geo(g, o) { them(g, o); },
    xong(mat) {
      const G = new T.BufferGeometry();
      G.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); G.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); G.setAttribute('color', new T.Float32BufferAttribute(col, 3));
      G.computeBoundingSphere(); G.computeBoundingBox();
      const m = new T.Mesh(G, mat || MAT_MIN); m.castShadow = true; m.receiveShadow = true; return m;
    },
  };
}
const MAT_MIN = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.72, metalness: 0 });

// ---------- 4. GÀ NHIỀU GIỐNG: 1 máy dựng + bảng thông số (tròn mịn, đầu liền thân, mắt có đốm sáng, má hồng) ----------
// than/uc/canh/duoi/dau = màu từng phần · mao = cỡ mào · duoiKieu: mai (3 lông ngả sau) · trong (lông đuôi cong vút)
// bom = bờm cổ (gà trống) · chanTo = chân to (Đông Tảo) · xu = lông xù (silkie: cụm bông, mặt sẫm, chỏm lông)
const GIONG_GA = {
  trang:   { ten: 'Gà trắng', co: 1, than: 0xfffaf0, uc: 0xfff4e2, canh: 0xf3eadc, duoi: 0xf3eadc, mao: 1, chan: 0xf5a33a, duoiKieu: 'mai' },
  ri:      { ten: 'Gà ri', co: 0.95, than: 0xd89a55, uc: 0xebbd7e, canh: 0xa8653a, duoi: 0x6a4a3a, dau: 0xdda062, mao: 0.9, chan: 0xe8b34a, duoiKieu: 'mai' },
  trong:   { ten: 'Gà trống', co: 1.12, than: 0xc2502e, uc: 0x3a3336, canh: 0x8a3a24, duoi: 0x2d4a3e, dau: 0xd8612f, bom: 0xf09a3e, mao: 1.6, chan: 0xf5a33a, duoiKieu: 'trong' },
  dongtao: { ten: 'Gà Đông Tảo', co: 1.1, than: 0xb86a3a, uc: 0xd49058, canh: 0x8a4a2a, duoi: 0x4a3a30, mao: 0.7, chan: 0xe0584a, chanTo: 1, duoiKieu: 'mai' },
  xu:      { ten: 'Gà lông xù', co: 0.95, than: 0xffffff, uc: 0xffffff, canh: 0xf6f2ee, duoi: 0xf6f2ee, mao: 0.6, maoMau: 0x7a3a5a, chan: 0x6a5a6a, xu: 1, mat: 0x4a3d5c, duoiKieu: 'mai' },
};
function dungGa(G) {
  const b = boMin(), DO = G.maoMau || 0xe8483b, CAM = 0xf5a33a, THAN = G.than, DAU = G.dau || THAN;
  if (G.xu) { // silkie: thân là cụm bông
    b.cau(0.19, { p: [0, 0.26, -0.02], s: [1, 0.9, 1.1], mau: THAN, ao: 0.15 });
    const r = rnd(9); for (let i = 0; i < 14; i++) { const a = r() * Math.PI * 2, e = (r() - 0.35) * 1.3; b.cau(0.075 + r() * 0.02, { p: [Math.cos(a) * Math.cos(e) * 0.18, 0.27 + Math.sin(e) * 0.14, Math.sin(a) * Math.cos(e) * 0.2 - 0.02], mau: r() < 0.5 ? THAN : G.canh, ao: 0.2 }, 2); }
  } else {
    b.cau(0.2, { p: [0, 0.25, -0.02], s: [1, 0.9, 1.12], mau: THAN });                        // thân
    b.cau(0.125, { p: [0, 0.3, 0.13], s: [1.12, 1, 0.8], mau: G.uc, ao: 0.12 });                // ức phồng
  }
  if (G.bom) b.cau(0.13, { p: [0, 0.37, 0.08], s: [1.08, 0.95, 0.95], mau: G.bom, ao: 0.1 });    // bờm cổ vàng cam (gà trống)
  b.cau(0.135, { p: [0, 0.445, 0.1], mau: G.xu ? THAN : DAU, ao: 0.15 });                       // đầu
  if (G.xu) {
    b.cau(0.075, { p: [0, 0.44, 0.19], s: [1.15, 1, 0.5], mau: G.mat, ao: 0 }, 2);              // mặt sẫm
    for (const [x, y, z, r] of [[0, 0.58, 0.07, 0.09], [0.06, 0.55, 0.03, 0.07], [-0.06, 0.55, 0.03, 0.07], [0, 0.56, -0.02, 0.07]]) b.cau(r, { p: [x, y, z], mau: THAN, ao: 0.1 }, 2); // chỏm bông
  }
  for (const sx of [1, -1]) {
    if (!G.xu) b.cau(0.1, { p: [sx * 0.182, 0.26, -0.03], s: [0.42, 0.78, 1.25], r: [0.15, 0, sx * 0.28], mau: G.canh, ao: 0.3 }, 2); // cánh
    b.cau(0.03, { p: [sx * 0.074, 0.472, 0.207], s: [0.78, 1.05, 0.5], mau: MAT_DEN, ao: 0 }, 2);  // mắt
    b.cau(0.011, { p: [sx * 0.083, 0.486, 0.222], mau: 0xffffff, ao: 0, lanh: 0 }, 1);             // đốm sáng
    b.cau(0.03, { p: [sx * 0.102, 0.438, 0.19], s: [1, 0.55, 0.3], r: [0, sx * 0.5, 0], mau: 0xffb0b6, ao: 0 }, 1); // má hồng
    const ct = G.chanTo ? 2.6 : 1;
    b.tru(0.014 * ct, 0.012 * ct, 0.11, { p: [sx * 0.06, 0.055, 0], mau: G.chan, ao: 0.1 }, 8);     // chân (Đông Tảo: to gấp 2,6)
    b.cau(0.032 * (G.chanTo ? 1.5 : 1), { p: [sx * 0.06, 0.012, 0.03], s: [1, 0.32, 1.45], mau: G.chan, ao: 0.1 }, 1); // bàn chân
  }
  if (G.duoiKieu === 'trong') { // gà trống: 5 lông đuôi cong vút, xanh đen xen nhau
    for (let j = 0; j < 5; j++) b.cau(0.07, { p: [(j - 2) * 0.018, 0.42 + j * 0.03, -0.23 - j * 0.025], s: [0.28, 1.9 - j * 0.15, 0.75], r: [-0.3 - j * 0.24, 0, 0], mau: j % 2 ? 0x1f2a26 : G.duoi, ao: 0.1 }, 2);
  } else for (const [x, ry, sc] of [[0, 0, 1], [0.04, 0.4, 0.8], [-0.04, -0.4, 0.8]])            // đuôi: chùm lông ngả hẳn ra sau
    b.cau(0.075 * sc, { p: [x, 0.33, -0.24], s: [0.55, 1.15, 0.9], r: [-1.05, ry, 0], mau: G.duoi, ao: 0.25 }, 2);
  const km = G.mao;
  for (const [z, r] of [[0.05, 0.04], [0.095, 0.05], [0.14, 0.038]]) b.cau(r * km, { p: [0, 0.575 + r * km * 0.4 - (G.xu ? 0.03 : 0), z], mau: DO, ao: 0.1 }, 2); // mào
  b.cau(0.03 * (km > 1 ? 1.4 : 1), { p: [0, 0.37, 0.212], s: [0.8, 1.35, 0.8], mau: DO, ao: 0.1 }, 2); // yếm
  b.non(0.04, 0.085, { p: [0, 0.438, 0.245], r: [Math.PI / 2, 0, 0], mau: G.xu ? 0x6a6070 : CAM, ao: 0 }, 10); // mỏ
  return b.xong().geometry;
}
const DS_GA = Object.keys(GIONG_GA), geoGa = {};
function gaMoi(bien) { // bien: số thứ tự con trong chuồng ⇒ chuồng tự trộn đủ giống; chuỗi = tên giống
  const g = typeof bien === 'string' ? bien : DS_GA[(bien || 0) % DS_GA.length];
  if (!geoGa[g]) geoGa[g] = dungGa(GIONG_GA[g]);
  const m = new T.Mesh(geoGa[g], MAT_MIN); m.castShadow = true; m.receiveShadow = true; m.scale.setScalar(GIONG_GA[g].co || 1); return m;
}

// ---------- 4b. BÒ · HEO · CỪU MỚI: dựng mịn như gà, TÁCH KHỚP (thân · đầu · 4 chân · đuôi) để tự cử động ----------
// Toạ độ: đầu hướng +z, đáy chạm y = 0. Mỗi khớp dựng quanh điểm xoay của nó; hình dùng chung cho mọi con cùng loài.
const MAT_DEN = 0x2d2433, TRANG_V = 0xfbf8f2;
function matTo(b, x, y, z, r, mau, noi) { // mắt to + đốm sáng (x > 0: mắt trái của con vật); mau = màu tròng (vd husky mắt xanh); noi = độ nhô đốm sáng
  for (const s of [1, -1]) {
    b.cau(r, { p: [s * x, y, z], s: [0.8, 1.1, 0.5], mau: mau || MAT_DEN, ao: 0 }, 2);
    const k = noi == null ? 0.55 : noi, lech = noi == null ? r * 0.3 : -r * 0.15; // mắt sát mép mặt (bò): đốm sáng lệch VÀO trong để khỏi lòi ra mép đầu
    b.cau(r * 0.38, { p: [s * (x + lech), y + r * 0.5, z + r * k], mau: 0xffffff, ao: 0, lanh: 0 }, 1);
  }
}
function maHong(b, x, y, z, r, mau) { for (const s of [1, -1]) b.cau(r, { p: [s * x, y, z], s: [1, 0.55, 0.3], r: [0, s * 0.6, 0], mau: mau || 0xffa8b4, ao: 0 }, 1); }
const LOAI_VAT = {
  heo: {
    dau: [0, 0.42, 0.26], chan: [[0.14, 0.2, 0.16], [-0.14, 0.2, 0.16], [0.14, 0.2, -0.18], [-0.14, 0.2, -0.18]], duoi: [0, 0.44, -0.35],
    than(b) { b.cau(0.3, { p: [0, 0.36, -0.02], s: [0.95, 0.86, 1.15], mau: 0xffb3c2 }); },
    dauVe(b) {
      b.cau(0.21, { p: [0, 0.04, 0.08], mau: 0xffb3c2, ao: 0.12 });
      b.tru(0.085, 0.09, 0.08, { p: [0, -0.02, 0.28], r: [Math.PI / 2, 0, 0], mau: 0xff9db1, ao: 0.05 }, 16);   // mũi
      for (const s of [1, -1]) {
        b.cau(0.018, { p: [s * 0.035, -0.02, 0.322], s: [1, 1.3, 0.5], mau: 0xb85a70, ao: 0 }, 1);
        b.non(0.075, 0.13, { p: [s * 0.12, 0.22, 0.02], r: [0.5, 0, -s * 0.35], mau: 0xff9db1, ao: 0.1 }, 10); // tai nhọn cụp ra trước
      }
      matTo(b, 0.09, 0.1, 0.245, 0.037); maHong(b, 0.14, 0.0, 0.2, 0.034, 0xff8fa6);
    },
    chanVe(b) { b.tru(0.06, 0.055, 0.17, { p: [0, -0.085, 0], mau: 0xffb3c2, ao: 0.25 }, 10); b.tru(0.062, 0.065, 0.05, { p: [0, -0.175, 0], mau: 0xd9788e, ao: 0 }, 10); },
    duoiVe(b) { b.geo(new T.TorusGeometry(0.045, 0.014, 6, 14, Math.PI * 1.6), { p: [0, 0.02, -0.03], r: [0, Math.PI / 2, 0], mau: 0xffb3c2, ao: 0 }); }, // đuôi xoắn
    di: [9, 0.55], duoiXoay: 0,
  },
  cuu: {
    dau: [0, 0.6, 0.32], chan: [[0.14, 0.3, 0.16], [-0.14, 0.3, 0.16], [0.14, 0.3, -0.2], [-0.14, 0.3, -0.2]], duoi: [0, 0.52, -0.36],
    than(b) {
      const LEN = 0xfbf6ea, r = rnd(5);
      b.cau(0.3, { p: [0, 0.5, -0.03], s: [1, 0.88, 1.18], mau: LEN, ao: 0.18 });
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; b.cau(0.13 + r() * 0.03, { p: [Math.cos(a) * 0.27, 0.5 + (i % 2 ? 0.08 : -0.05), Math.sin(a) * 0.31 - 0.03], mau: LEN, ao: 0.22 }, 2); } // cụm lông bông
      for (const [x, z] of [[0.1, 0.1], [-0.1, 0.12], [0.08, -0.15], [-0.09, -0.12]]) b.cau(0.13, { p: [x, 0.7, z], mau: LEN, ao: 0.15 }, 2);
    },
    dauVe(b) {
      b.cau(0.17, { p: [0, 0, 0.1], s: [0.9, 1.05, 1], mau: 0xf2d6c4, ao: 0.12 });
      for (const [x, z] of [[0, 0.06], [0.07, 0.03], [-0.07, 0.03]]) b.cau(0.075, { p: [x, 0.15, z], mau: 0xfbf6ea, ao: 0.1 }, 2); // chỏm lông trên đầu
      for (const s of [1, -1]) b.cau(0.07, { p: [s * 0.17, 0.02, 0.05], s: [1.6, 0.5, 0.8], r: [0, 0, -s * 0.4], mau: 0xe8c2ad, ao: 0.15 }, 2); // tai ngang
      b.cau(0.02, { p: [0, -0.06, 0.26], s: [1.3, 0.8, 0.6], mau: 0xc98a8a, ao: 0 }, 1);
      matTo(b, 0.072, 0.04, 0.235, 0.034); maHong(b, 0.105, -0.03, 0.21, 0.03);
    },
    chanVe(b) { b.tru(0.045, 0.04, 0.28, { p: [0, -0.14, 0], mau: 0x6b5a52, ao: 0.15 }, 8); b.tru(0.048, 0.05, 0.04, { p: [0, -0.28, 0], mau: 0x3e3430, ao: 0 }, 8); },
    duoiVe(b) { b.cau(0.08, { p: [0, 0, -0.02], mau: 0xfbf6ea, ao: 0.1 }, 2); },
    di: [8, 0.5], duoiXoay: 0.1,
  },
};
// ---------- 4f. CHÓ NHIỀU GIỐNG: 1 máy dựng + bảng thông số (thêm giống = thêm 1 dòng) ----------
// Đơn vị gốc = cỡ Shiba; co = phóng cả con. chan = độ dài chân · dai/beo = thân dài/béo · dauTo = đầu to
// tai: [kiểu, cỡ, màu riêng?] kiểu = dung (dựng) · cup (cụp rủ) · doi (tai dơi) · gap (gập) · bong (cụm lông, poodle)
// mom: vua · dai · ngan (mặt tịt) · nho | duoi: cuon · cuonNho · cuonXu (cuộn bông) · len (vểnh) · buong (rủ) · buongManh · cut (cụt) · pom
// hoa văn: matNa (mũ lông sẫm, mặt trắng — husky/alaska) · yen (yên đen) · dom (đốm) · songLung (xoáy lưng) · momMau (mõm màu riêng) · xu (bờm bông) · xoan (lông xoăn)
const GIONG_CHO = {
  shiba:     { ten: 'Shiba', co: 1, chan: 0.155, mau: 0xe3a262, phu: 0xfbead2, tai: ['dung', 1], mom: 'vua', duoi: 'cuon', luoi: 1 },
  husky:     { ten: 'Husky', co: 1.15, chan: 0.19, mau: 0x4f5560, phu: 0xf6f4f1, matMau: 0x3f93dc, matNa: 1, chanMau: 'phu', tai: ['dung', 1.1], mom: 'dai', duoi: 'cuonXu' },
  alaska:    { ten: 'Alaska', co: 1.3, chan: 0.18, beo: 1.08, mau: 0x8e939b, phu: 0xf6f4f1, matNa: 1, chanMau: 'phu', xu: 1, tai: ['dung', 0.8], mom: 'vua', duoi: 'cuonXu' },
  corgi:     { ten: 'Corgi', co: 0.95, chan: 0.085, dai: 1.55, mau: 0xe8943f, phu: 0xfdf3e6, chanMau: 'phu', tai: ['dung', 1.5], mom: 'vua', duoi: 'cut', luoi: 1 },
  poodle:    { ten: 'Poodle', co: 0.85, chan: 0.17, mau: 0xb46a3c, phu: 0xc98a5e, xoan: 1, tai: ['bong', 1], mom: 'vua', duoi: 'pom' },
  pug:       { ten: 'Pug', co: 0.85, chan: 0.12, beo: 1.12, dauTo: 1.1, matCo: 1.2, mau: 0xe8cfa2, phu: 0xf1dcb8, momMau: 0x6a5548, tai: ['gap', 1, 0x5a4a42], mom: 'ngan', duoi: 'cuonNho' },
  golden:    { ten: 'Golden', co: 1.2, chan: 0.19, mau: 0xecc071, phu: 0xf8e2b8, tai: ['cup', 1], mom: 'dai', duoi: 'buong', luoi: 1 },
  samoyed:   { ten: 'Samoyed', co: 1.15, chan: 0.17, mau: 0xfbf9f4, phu: 0xffffff, xu: 1, tai: ['dung', 0.85], mom: 'vua', duoi: 'cuonXu', luoi: 1 },
  phocsoc:   { ten: 'Phốc sóc', co: 0.75, chan: 0.1, beo: 1.1, mau: 0xf0a04b, phu: 0xfbd5a0, xu: 1.3, tai: ['dung', 0.6], mom: 'nho', duoi: 'cuonXu' },
  chihuahua: { ten: 'Chihuahua', co: 0.7, chan: 0.13, dauTo: 1.15, matCo: 1.2, mau: 0xd8a674, phu: 0xf6e3c8, tai: ['dung', 1.9], mom: 'nho', duoi: 'len' },
  bullphap:  { ten: 'Bull Pháp', co: 0.95, chan: 0.12, beo: 1.15, dauTo: 1.1, mau: 0xe6cfae, phu: 0xf3e6d2, momMau: 0x7a6152, tai: ['doi', 1], mom: 'ngan', duoi: 'cut' },
  becgie:    { ten: 'Becgie', co: 1.2, chan: 0.2, dai: 1.35, mau: 0xc98b47, phu: 0xdcaa6a, yen: 0x2f2a2e, momMau: 0x6b5040, tai: ['dung', 1.35], mom: 'dai', duoi: 'buong', duoiMau: 0x3b3336 },
  dom:       { ten: 'Đốm', co: 1.15, chan: 0.21, mau: 0xfbf9f5, phu: 0xfbf9f5, dom: 0x2d2a2e, tai: ['cup', 0.9, 0x2d2a2e], mom: 'dai', duoi: 'buongManh' },
  phuquoc:   { ten: 'Phú Quốc', co: 1.1, chan: 0.2, beo: 0.88, mau: 0x3f3739, phu: 0xa88c74, songLung: 0x221d1f, tai: ['dung', 1.2], mom: 'dai', duoi: 'len' },
};
// đốm dán sát bề mặt 1 khối elip (dẹt theo pháp tuyến) — chiTren: chỉ rải trên đỉnh/gáy (tránh mặt)
function danDom(b, tam, ban, n, r, mau, seed, chiTren) {
  const rr = rnd(seed), q = new T.Quaternion(), e = new T.Euler(), z = new T.Vector3(0, 0, 1), d = new T.Vector3(), nn = new T.Vector3();
  for (let i = 0, thu = 0; i < n && thu < 500; thu++) {
    d.set(rr() * 2 - 1, rr() * 2 - 1, rr() * 2 - 1); const l = d.length(); if (l > 1 || l < 0.2) continue; d.normalize();
    if (chiTren ? (d.y < 0.3 || d.z > 0.4) : d.y < -0.5) continue;
    const p = [tam[0] + d.x * ban[0] * 0.97, tam[1] + d.y * ban[1] * 0.97, tam[2] + d.z * ban[2] * 0.97];
    nn.set(d.x / ban[0], d.y / ban[1], d.z / ban[2]).normalize(); q.setFromUnitVectors(z, nn); e.setFromQuaternion(q);
    b.cau(r * (0.7 + rr() * 0.6), { p, s: [1, 1, 0.3], r: [e.x, e.y, e.z], mau, ao: 0.05 }, 1); i++;
  }
}
// mõm theo kiểu: tâm · bán kính · co giãn · vị trí mũi (đơn vị đầu, trước khi nhân dauTo)
const MOM_CHO = { dai: { c: [0, -0.005, 0.2], r: 0.085, s: [1, 0.75, 1.45], mui: [0, 0.03, 0.318] }, ngan: { c: [0, -0.01, 0.165], r: 0.092, s: [1.25, 0.8, 0.6], mui: [0, 0.03, 0.205] },
  nho: { c: [0, 0, 0.19], r: 0.06, s: [1, 0.8, 0.9], mui: [0, 0.02, 0.24] }, vua: { c: [0, 0, 0.18], r: 0.085, s: [1.15, 0.8, 0.9], mui: [0, 0.035, 0.255] } };
function dungCho(G) {
  const L = G.chan, D = G.dai || 1.25, B = G.beo || 0.95, k = G.dauTo || 1, H = 0.16 * k, yT = L + 0.105;
  const P = (x, y, z) => [x * k, y * k, z * k], xc = 0.09 * B / 0.95, zt = 0.1 * D / 1.25, zs = -0.12 * D / 1.25;
  const MOM0 = MOM_CHO[G.mom] || MOM_CHO.vua, [kieuTai, tt, mauRieng] = G.tai, mt = mauRieng || G.mau;
  function taiVe(b, s) { const t = tt;
    if (kieuTai === 'dung') {
      const nga = 0.35 + (t - 1) * 0.25, y = 0.21 + (t - 1) * 0.045;
      b.non(0.055 * t * k, 0.1 * t * k, { p: P(s * 0.09, y, 0.02), r: [-0.15, 0, -s * nga], mau: mt, ao: 0.1 }, 10);
      b.non(0.034 * t * k, 0.068 * t * k, { p: P(s * 0.088, y - 0.01, 0.035), r: [-0.15, 0, -s * nga], mau: G.matNa ? 0xf3d6d0 : G.phu, ao: 0 }, 8);
    } else if (kieuTai === 'cup') b.cau(0.065 * t * k, { p: P(s * 0.145, 0.06, 0.04), s: [0.45, 1.4, 0.95], r: [0, 0, s * 0.28], mau: mt, ao: 0.2 }, 2);
    else if (kieuTai === 'doi') {
      b.cau(0.068 * k, { p: P(s * 0.085, 0.215, 0), s: [0.85, 1.25, 0.35], r: [-0.1, 0, -s * 0.4], mau: mt, ao: 0.1 }, 2);
      b.cau(0.045 * k, { p: P(s * 0.087, 0.21, 0.018), s: [0.8, 1.2, 0.3], r: [-0.1, 0, -s * 0.4], mau: 0xf2b8b8, ao: 0 }, 1);
    } else if (kieuTai === 'gap') b.cau(0.05 * k, { p: P(s * 0.125, 0.17, 0.05), s: [1.2, 0.5, 0.95], r: [0.5, 0, -s * 0.6], mau: mt, ao: 0.1 }, 2);
    else if (kieuTai === 'bong') for (let i = 0; i < 3; i++) b.cau((0.06 - i * 0.005) * k, { p: P(s * (0.15 + i * 0.005), 0.08 - i * 0.06, 0.03), mau: i % 2 ? G.phu : G.mau, ao: 0.2 }, 2);
  }
  function taiGoc(s) { const t = tt; // gốc tai (khớp xoay)
    if (kieuTai === 'dung') { const nga = 0.35 + (t - 1) * 0.25, y = 0.21 + (t - 1) * 0.045; return P(s * (0.09 - Math.sin(nga) * 0.05 * t), y - Math.cos(nga) * 0.05 * t, 0.02); }
    return kieuTai === 'cup' ? P(s * 0.135, 0.14, 0.04) : kieuTai === 'doi' ? P(s * 0.06, 0.15, 0) : kieuTai === 'gap' ? P(s * 0.1, 0.18, 0.045) : P(s * 0.145, 0.12, 0.03);
  }
  const matVe = b => matTo(b, 0.07 * k, 0.11 * k, 0.185 * k, 0.031 * k * (G.matCo || 1), G.matMau);
  function hamVe(b) { const M = MOM0; // hàm dưới (cùng màu mõm) + lưỡi
    b.cau(M.r * 0.8 * k, { p: P(M.c[0], M.c[1] - M.r * M.s[1] * 0.55, M.c[2] - 0.004), s: [M.s[0] * 0.86, M.s[1] * 0.5, M.s[2] * 0.9], mau: G.momMau || G.phu, ao: 0.05 }, 2);
    b.cau(0.026 * k, { p: P(0, M.c[1] - M.r * M.s[1] * (G.luoi ? 0.72 : 0.32), M.c[2] + M.r * M.s[2] * (G.luoi ? 0.55 : 0.15)), s: [0.95, 0.35, 1.15], mau: 0xff8fa6, ao: 0 }, 1);
  }
  return {
    co: G.co, dau: [0, L + 0.175, 0.17 * D * 0.72 + 0.04], duoi: [0, L + 0.165, -0.17 * D * 0.9], duoiXoay: 0,
    chan: [[xc, L, zt], [-xc, L, zt], [xc, L, zs], [-xc, L, zs]], di: [11 - (G.co - 1) * 4, 0.6],
    than(b) {
      if (G.xoan) { // poodle: thân là cụm lông xoăn
        b.cau(0.15, { p: [0, yT, -0.01], s: [B * 0.95, 0.85, D * 0.95], mau: G.mau });
        const r = rnd(11); for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2, e = (r() - 0.3) * 1.2; b.cau(0.072 + r() * 0.02, { p: [Math.cos(a) * Math.cos(e) * 0.15 * B, yT + Math.sin(e) * 0.12, Math.sin(a) * Math.cos(e) * 0.17 * D - 0.01], mau: r() < 0.5 ? G.mau : G.phu, ao: 0.2 }, 2); }
        return;
      }
      b.cau(0.17, { p: [0, yT, -0.01], s: [B, 0.85, D], mau: G.mau });
      b.cau(0.12, { p: [0, yT - 0.05, 0.05], s: [B * 1.05, 0.8, D * 0.92], mau: G.phu, ao: 0.1 }, 2);          // bụng
      b.cau(0.1, { p: [0, yT + 0.04, 0.17 * D * 0.8], s: [1, 1, 0.7], mau: G.phu, ao: 0.1 }, 2);                // ngực
      if (G.yen) b.cau(0.16, { p: [0, yT + 0.07, -0.04], s: [B * 1.04, 0.55, D * 0.95], mau: G.yen, ao: 0.1 }, 2); // yên đen trên lưng
      if (G.songLung) b.cau(0.05, { p: [0, yT + 0.14, -0.02], s: [0.6, 0.5, D * 2.6], mau: G.songLung, ao: 0.05 }, 2); // xoáy lưng (chó Phú Quốc)
      if (G.dom) danDom(b, [0, yT, -0.01], [0.17 * B, 0.17 * 0.85, 0.17 * D], 16, 0.034, G.dom, 7);
      if (G.xu) { // bờm lông quanh cổ + cụm lông trên thân
        const f = G.xu, r = rnd(3);
        for (let i = -3; i <= 3; i++) { const a = i * 0.45; b.cau(0.075 * f, { p: [Math.sin(a) * 0.13 * B, yT + 0.07 - Math.abs(i) * 0.012, 0.17 * D * 0.62 + Math.cos(a) * 0.05], mau: G.phu, ao: 0.12 }, 2); }
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; b.cau(0.07 * f, { p: [Math.cos(a) * 0.14 * B, yT + 0.05 + r() * 0.04, Math.sin(a) * 0.15 * D - 0.03], mau: G.mau, ao: 0.18 }, 2); }
      }
    },
    dauVe(b, o) { // o.rieng: bỏ tai · mắt · lưỡi (khung xương chó mới dựng chúng thành khớp riêng để cử động) + thêm lòng miệng
      const rieng = o && o.rieng;
      b.cau(H, { p: P(0, 0.07, 0.06), s: [1.05, 0.95, 0.95], mau: G.matNa ? G.phu : G.mau, ao: 0.12 });
      if (G.matNa) { // mũ lông sẫm trùm trán + gáy, chừa mặt trắng; 2 chấm lông mày trắng
        b.cau(H * 1.03, { p: P(0, 0.13, 0.03), s: [1.06, 0.8, 0.97], mau: G.mau, ao: 0.1 });
        for (const s of [1, -1]) b.cau(0.02 * k, { p: P(s * 0.062, 0.175, 0.19), s: [1.2, 0.8, 0.6], mau: G.phu, ao: 0 }, 1);
      }
      const mm = G.momMau || G.phu, mui = P(...MOM0.mui);
      b.cau(MOM0.r * k, { p: P(...MOM0.c), s: MOM0.s, mau: mm, ao: 0.05 }, 2);
      b.cau((G.mom === 'nho' ? 0.022 : 0.03) * k, { p: mui, s: [1.25, 0.9, 0.8], mau: MAT_DEN, ao: 0 }, 2);
      if (rieng) b.cau(MOM0.r * 0.72 * k, { p: P(MOM0.c[0], MOM0.c[1] - MOM0.r * MOM0.s[1] * 0.5, MOM0.c[2] + 0.004), s: [MOM0.s[0] * 0.85, MOM0.s[1] * 0.5, MOM0.s[2] * 0.88], mau: 0x7a2e3a, ao: 0 }, 2); // lòng miệng: lộ ra khi há
      else { if (G.luoi) b.cau(0.028 * k, { p: [0, mui[1] - 0.09 * k, mui[2] - 0.04 * k], s: [0.9, 0.35, 1.1], mau: 0xff8fa6, ao: 0 }, 1); for (const s of [1, -1]) taiVe(b, s); }
      if (G.xoan) for (const [x, z] of [[0, 0.02], [0.05, 0], [-0.05, 0]]) b.cau(0.065 * k, { p: P(x, 0.2, z), mau: G.mau, ao: 0.1 }, 2); // chỏm xoăn
      if (G.dom) danDom(b, P(0, 0.07, 0.06), [H * 1.05, H * 0.95, H * 0.95], 4, 0.022 * k, G.dom, 3, true);
      if (!rieng) matVe(b);
      maHong(b, 0.11 * k, 0.04 * k, 0.17 * k, 0.025 * k);
    },
    taiVe, taiGoc, matVe, matGoc: P(0, 0.11, 0.185), hamVe, hamGoc: P(0, MOM0.c[1] - MOM0.r * MOM0.s[1] * 0.35, MOM0.c[2] - MOM0.r * MOM0.s[2] * 0.75),
    chanVe(b) {
      if (G.xoan) { b.tru(0.03, 0.028, L, { p: [0, -L / 2, 0], mau: G.mau, ao: 0.2 }, 8); b.cau(0.05, { p: [0, -L + 0.035, 0.005], mau: G.mau, ao: 0.1 }, 2); return; } // chân mảnh + túm lông cổ chân
      b.tru(0.042, 0.039, L, { p: [0, -L / 2, 0], mau: G.chanMau === 'phu' ? G.phu : G.mau, ao: 0.2 }, 10);
      b.cau(0.044, { p: [0, -L + 0.015, 0.012], s: [1, 0.6, 1.2], mau: G.phu, ao: 0 }, 1);
    },
    duoiVe(b) {
      const m = G.duoiMau || G.mau, d = G.duoi;
      const tor = (r, day, cung, y) => b.geo(new T.TorusGeometry(r, day, 6, 12, Math.PI * cung), { p: [0, y, -0.02], r: [0, Math.PI / 2, 0], mau: m, ao: 0 });
      if (d === 'cuon') tor(0.06, 0.026, 1.3, 0.06);
      else if (d === 'cuonNho') tor(0.045, 0.022, 1.5, 0.05);
      else if (d === 'cuonXu') { tor(0.07, 0.042, 1.3, 0.07); b.cau(0.055, { p: [0, 0.13, 0.03], mau: G.xu ? G.phu : m, ao: 0.05 }, 2); }
      else if (d === 'len') b.tru(0.022, 0.01, 0.22, { p: [0, 0.09, -0.05], r: [-0.55, 0, 0], mau: m, ao: 0 }, 8);
      else if (d === 'buong') { b.tru(0.03, 0.016, 0.24, { p: [0, -0.08, -0.07], r: [0.6, 0, 0], mau: m, ao: 0.05 }, 8); b.cau(0.05, { p: [0, -0.09, -0.085], s: [0.55, 1.6, 0.8], r: [0.6, 0, 0], mau: m, ao: 0.05 }, 2); }
      else if (d === 'buongManh') b.tru(0.02, 0.01, 0.24, { p: [0, -0.08, -0.07], r: [0.6, 0, 0], mau: m, ao: 0.05 }, 8);
      else if (d === 'pom') { b.tru(0.014, 0.012, 0.1, { p: [0, 0.05, -0.02], r: [-0.4, 0, 0], mau: m, ao: 0 }, 6); b.cau(0.055, { p: [0, 0.1, -0.05], mau: m, ao: 0.05 }, 2); }
      else b.cau(0.035, { p: [0, 0, -0.01], mau: m, ao: 0 }, 2); // cụt
    },
  };
}
for (const g in GIONG_CHO) LOAI_VAT['cho_' + g] = dungCho(GIONG_CHO[g]);
LOAI_VAT.cho = LOAI_VAT['cho_' + (GIONG_CHO[Q.get('cho')] ? Q.get('cho') : 'shiba')]; // ?cho=husky … để xem giống khác trong game
// ---------- 4f'. BÒ NHIỀU GIỐNG — DÁNG BÒ THẬT: 1 máy dựng + bảng thông số ----------
// Giải phẫu (nhìn nghiêng, đầu hướng +z, đất y = 0): lưng thẳng · vai (u vai) · 2 u xương hông + xương ngồi · mông vuông ·
// ngực sâu · bụng hơi xệ · cổ nối đầu (có yếm da) · đầu dài, mõm bè, tai chĩa ngang · chân trước thẳng, chân sau gập khuỷu · đuôi rủ có chùm.
// Đốm KHÔNG dán miếng: tô thẳng lên từng đỉnh bằng nhiễu 3D theo toạ độ thật ⇒ loang tự nhiên, chạy liền qua cổ/đầu/chân.
// vet = [màu đốm, ngưỡng (cao = ít đốm), hạt] · bong = màu vùng sẫm loang (Jersey) · buou = u vai (bò vàng) · yem = cỡ yếm cổ
// longDai = lông dài bù xù + mái che mắt · sung: ngan · dai · bauSua / chuong: bò sữa
const GIONG_BO = {
  bosua:   { ten: 'Bò sữa', co: 0.9, mau: TRANG_V, vet: [0x2f2a2e, 0.54, 3], mom: 0xffc4cc, taiTrong: 0xffc4cc, sung: 'ngan', bauSua: 1, chuong: 1, chop: 0x2f2a2e },
  vang:    { ten: 'Bò vàng', co: 0.85, mau: 0xe8c274, mom: 0x5a4a42, lomui: 0x2d2433, taiTrong: 0xe9c08a, sung: 'ngan', buou: 1, yem: 1.6, chop: 0x5a4032 },
  nau:     { ten: 'Bò sữa nâu', co: 0.85, mau: 0xb07a4e, bong: 0x6e4630, mom: 0x3e3432, vienMom: 0xf1e2c8, lomui: 0x2d2433, taiTrong: 0xe8c3a0, sung: 'ngan', bauSua: 1, chuong: 1, chop: 0x3a261c },
  longdai: { ten: 'Bò lông dài', co: 0.85, mau: 0xc9763c, mom: 0x8a5a44, lomui: 0x4a2e28, taiTrong: 0xe0a070, sung: 'dai', longDai: 1, chop: 0x9a5028 },
  dodom:   { ten: 'Bò đốm đỏ', co: 0.9, mau: TRANG_V, vet: [0xb5623a, 0.56, 7], mom: 0xffc4cc, taiTrong: 0xffc4cc, sung: 'ngan', bauSua: 1, chuong: 1, chop: 0xb5623a },
};
const toiMau = (hex, k) => new T.Color(hex).multiplyScalar(k).getHex();
function bam3(i, j, k) { let n = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(k, 1440662683)) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967295; }
function nhieu3(x, y, z) { // nhiễu giá trị 3D trơn, 0..1
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z), fx = x - i, fy = y - j, fz = z - k;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz), L = (a, b, t) => a + (b - a) * t;
  return L(L(L(bam3(i, j, k), bam3(i + 1, j, k), u), L(bam3(i, j + 1, k), bam3(i + 1, j + 1, k), u), v),
           L(L(bam3(i, j, k + 1), bam3(i + 1, j, k + 1), u), L(bam3(i, j + 1, k + 1), bam3(i + 1, j + 1, k + 1), u), v), w);
}
// hàm tô màu lông theo toạ độ THẬT của con bò (o = gốc khớp, vì mỗi khớp dựng quanh điểm xoay của nó)
function lopLong(G, o) {
  const [ox, oy, oz] = o || [0, 0, 0];
  if (G.vet) { const [mv, ng, sd] = G.vet, a = new T.Color(G.mau), b = new T.Color(mv), c = new T.Color();
    return (x, y, z) => { x += ox; y += oy; z += oz; if (y < 0.26) return G.mau; // cẳng chân để trắng như bò thật
      const n = nhieu3(x * 3 + sd, y * 3, z * 3) * 0.72 + nhieu3(x * 7.3, y * 7.3 + sd, z * 7.3) * 0.28, t = Math.min(1, Math.max(0, (n - ng + 0.07) / 0.14));
      return c.copy(a).lerp(b, t * t * (3 - 2 * t)).getHex(); }; }
  if (G.bong) { const a = new T.Color(G.mau), b = new T.Color(G.bong), c = new T.Color();
    return (x, y, z) => { x += ox; y += oy; z += oz; const t = Math.min(1, Math.max(0, (nhieu3(x * 2.5, y * 2.5, z * 2.5 + 4) - 0.4) * 1.8 + (y < 0.3 ? (0.3 - y) * 2.5 : 0) + (z > 0.75 ? (z - 0.75) * 3 : 0)));
      return c.copy(a).lerp(b, t).getHex(); }; }
  return null;
}
// ---------- NẶN KHỐI LIỀN: hàm khoảng cách (SDF) + hoà mềm (smooth-min, Inigo Quilez) → lưới bằng Surface Nets ----------
// Ghép nhiều khối cầu thì lộ đường gấp ở chỗ giao ⇒ trông "thô". Nặn bằng SDF thì thân–cổ–đầu–chân liền như đất nặn.
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
function sdEl(x, y, z, cx, cy, cz, rx, ry, rz) { // elip (xấp xỉ của IQ)
  x -= cx; y -= cy; z -= cz; const k0 = Math.hypot(x / rx, y / ry, z / rz), k1 = Math.hypot(x / (rx * rx), y / (ry * ry), z / (rz * rz));
  return k1 > 1e-9 ? k0 * (k0 - 1) / k1 : -Math.min(rx, ry, rz);
}
function sdNon(x, y, z, ax, ay, az, bx, by, bz, r1, r2) { // đoạn thẳng có bán kính đổi dần (nón bo tròn, xấp xỉ)
  const ux = bx - ax, uy = by - ay, uz = bz - az, px = x - ax, py = y - ay, pz = z - az;
  const t = Math.max(0, Math.min(1, (px * ux + py * uy + pz * uz) / (ux * ux + uy * uy + uz * uz)));
  return Math.hypot(px - ux * t, py - uy * t, pz - uz * t) - (r1 + (r2 - r1) * t);
}
function sdHop(x, y, z, cx, cy, cz, hx, hy, hz, r) { // hộp bo góc
  const qx = Math.abs(x - cx) - hx, qy = Math.abs(y - cy) - hy, qz = Math.abs(z - cz) - hz;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
}
function luoiSDF(f, lo, hi, h) { // Surface Nets: 1 đỉnh / ô cắt mặt (trung bình các điểm cắt), 1 tứ giác / cạnh lưới cắt mặt
  const nx = Math.ceil((hi[0] - lo[0]) / h) + 1, ny = Math.ceil((hi[1] - lo[1]) / h) + 1, nz = Math.ceil((hi[2] - lo[2]) / h) + 1;
  const V = new Float32Array(nx * ny * nz), id = (i, j, k) => i + nx * (j + ny * k);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) V[id(i, j, k)] = f(lo[0] + i * h, lo[1] + j * h, lo[2] + k * h);
  const cx = nx - 1, cy = ny - 1, cz = nz - 1, cid = (i, j, k) => i + cx * (j + cy * k), dinh = new Int32Array(cx * cy * cz).fill(-1), pos = [];
  const GOC = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const CANH = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]], v8 = new Float32Array(8);
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    let am = 0; for (let c = 0; c < 8; c++) { const g = GOC[c]; v8[c] = V[id(i + g[0], j + g[1], k + g[2])]; if (v8[c] < 0) am++; }
    if (am === 0 || am === 8) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of CANH) { const va = v8[a], vb = v8[b]; if ((va < 0) === (vb < 0)) continue; const t = va / (va - vb), ga = GOC[a], gb = GOC[b];
      sx += ga[0] + (gb[0] - ga[0]) * t; sy += ga[1] + (gb[1] - ga[1]) * t; sz += ga[2] + (gb[2] - ga[2]) * t; n++; }
    dinh[cid(i, j, k)] = pos.length / 3; pos.push(lo[0] + (i + sx / n) * h, lo[1] + (j + sy / n) * h, lo[2] + (k + sz / n) * h);
  }
  const idx = [], c3 = [0, 0, 0];
  const o = (d, du, dw, i, j, k) => { c3[0] = i; c3[1] = j; c3[2] = k; c3[(d + 1) % 3] -= du; c3[(d + 2) % 3] -= dw;
    return c3[0] < 0 || c3[1] < 0 || c3[2] < 0 || c3[0] >= cx || c3[1] >= cy || c3[2] >= cz ? -1 : dinh[cid(c3[0], c3[1], c3[2])]; };
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v0 = V[id(i, j, k)];
    for (let d = 0; d < 3; d++) {
      const i2 = i + (d === 0 ? 1 : 0), j2 = j + (d === 1 ? 1 : 0), k2 = k + (d === 2 ? 1 : 0); if (i2 >= nx || j2 >= ny || k2 >= nz) continue;
      if ((v0 < 0) === (V[id(i2, j2, k2)] < 0)) continue;
      const a = o(d, 0, 0, i, j, k), b = o(d, 1, 0, i, j, k), c = o(d, 1, 1, i, j, k), e = o(d, 0, 1, i, j, k); if (a < 0 || b < 0 || c < 0 || e < 0) continue;
      if (v0 < 0) idx.push(a, b, c, a, c, e); else idx.push(a, c, b, a, e, c);
    }
  }
  // pháp tuyến = gradient của hàm khoảng cách (mặt trơn); nếu chiều tam giác ngược pháp tuyến thì lật hết
  const nor = new Float32Array(pos.length), e = h * 0.5;
  for (let v = 0; v < pos.length; v += 3) { const x = pos[v], y = pos[v + 1], z = pos[v + 2];
    const gx = f(x + e, y, z) - f(x - e, y, z), gy = f(x, y + e, z) - f(x, y - e, z), gz = f(x, y, z + e) - f(x, y, z - e), l = Math.hypot(gx, gy, gz) || 1;
    nor[v] = gx / l; nor[v + 1] = gy / l; nor[v + 2] = gz / l; }
  let dong = 0; for (let t = 0; t < Math.min(idx.length, 600); t += 3) { const A = idx[t] * 3, B = idx[t + 1] * 3, C = idx[t + 2] * 3;
    const ux = pos[B] - pos[A], uy = pos[B + 1] - pos[A + 1], uz = pos[B + 2] - pos[A + 2], wx = pos[C] - pos[A], wy = pos[C + 1] - pos[A + 1], wz = pos[C + 2] - pos[A + 2];
    dong += (uy * wz - uz * wy) * nor[A] + (uz * wx - ux * wz) * nor[A + 1] + (ux * wy - uy * wx) * nor[A + 2]; }
  if (dong < 0) for (let t = 0; t < idx.length; t += 3) { const s = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = s; }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.BufferAttribute(nor, 3)); g.setIndex(idx);
  return g;
}

// ---------- BÒ CHIBI NẶN LIỀN (đúng hình khối bò thật, tỉ lệ ngộ nghĩnh như heo/gà) ----------
// Giữ từ bản giải phẫu: đầu cúi nhẹ trước vai · trán rộng, sừng ở 2 góc đỉnh đầu, tai chĩa ngang ngay dưới sừng · mõm bè, lỗ mũi to ·
// yếm dưới cổ · mông vuông, bụng tròn · chân sau gập khoeo · đuôi mọc từ đỉnh mông có chùm. Đổi sang chibi: đầu to, mắt to nhìn trước
// có đốm sáng + má hồng, cổ ngắn, thân ngắn tròn, chân ngắn mập. Nặn bằng SDF nên thân–cổ–đầu–chân liền, không lộ đường nối.
function mauDauBo(G, dat) { // bò sữa: đầu đen, vệt trắng dọc giữa mặt, mõm hồng; giống khác: màu thân + mõm riêng
  const than = lopLong(G, dat), cMom = new T.Color(G.mom), cVien = G.vienMom ? new T.Color(G.vienMom) : null, c = new T.Color();
  const boSua = G.vet && G.vet[0] === 0x2f2a2e;
  return (x, y, z) => {
    const mom = Math.min(1, Math.max(0, (0.02 - y) / 0.05)) * Math.min(1, Math.max(0, (z - 0.3) / 0.04)); // vùng mõm (dưới-trước)
    let goc;
    if (z < 0.06) goc = than ? than(x, y, z) : G.mau; // cổ: đốm liền thân
    else if (boSua) { const s = Math.min(1, Math.max(0, (0.3 - y) / 0.3)), bl = 0.035 + 0.045 * s; goc = Math.abs(x) < bl && z > 0.2 ? G.mau : G.vet[0]; }
    else goc = G.mau;
    c.setHex(goc);
    if (cVien) c.lerp(cVien, Math.min(1, Math.max(0, (0.06 - y) / 0.03)) * Math.min(1, Math.max(0, (z - 0.26) / 0.03)) * (1 - mom));
    return c.lerp(cMom, mom).getHex();
  };
}
function dungBo(G) {
  const M = G.mau, DAU = [0, 0.62, 0.4], TRUOC = [[0.14, 0.4, 0.24], [-0.14, 0.4, 0.24]], SAU = [[0.15, 0.44, -0.26], [-0.15, 0.44, -0.26]], DUOI = [0, 0.74, -0.4];
  const V = ds => ds.map(([r, y]) => new T.Vector2(r, y)), boSua = G.vet && G.vet[0] === 0x2f2a2e;
  const mong = (b, p) => { // móng guốc tròn + khe chẻ đôi
    b.geo(new T.LatheGeometry(V([[0, 0], [0.058, 0], [0.066, 0.016], [0.063, 0.05], [0.055, 0.062], [0, 0.062]]), 10), { p, mau: 0x4a3b2f, ao: 0.05 });
    b.cau(0.011, { p: [p[0], p[1] + 0.03, p[2] + 0.064], s: [0.35, 2.2, 0.5], mau: 0x241c17, ao: 0 }, 1);
  };
  const nan = (b, f, lo, hi, h, mauHam, ao) => b.geo(luoiSDF(f, lo, hi, h), { mau: M, mauHam, ao: ao == null ? 0.3 : ao });
  return {
    co: G.co, dau: DAU, duoi: DUOI, duoiXoay: 0.12, di: [7, 0.45], chan: [TRUOC[0], TRUOC[1], SAU[0], SAU[1]], chanKhac: 1,
    than(b) {
      const f = (x, y, z) => {
        let d = sdEl(x, y, z, 0, 0.52, -0.02, 0.3, 0.28, 0.4);                        // thân tròn
        d = smin(d, sdEl(x, y, z, 0, 0.42, -0.02, 0.28, 0.24, 0.3), 0.1);             // bụng
        d = smin(d, sdEl(x, y, z, 0, 0.48, 0.24, 0.22, 0.24, 0.18), 0.1);             // ngực
        d = smin(d, sdEl(x, y, z, 0, 0.62, 0.2, 0.2, 0.15, 0.18), 0.08);              // vai
        d = smin(d, sdHop(x, y, z, 0, 0.56, -0.28, 0.15, 0.11, 0.09, 0.1), 0.1);      // mông vuông
        d = smin(d, sdNon(x, y, z, 0, 0.58, 0.26, 0, 0.62, 0.38, 0.16, 0.15), 0.08);   // chân cổ
        if (G.buou) d = smin(d, sdEl(x, y, z, 0, 0.8, 0.18, 0.1, 0.1, 0.11), 0.06);    // u vai (bò vàng)
        return d;
      };
      nan(b, f, [-0.36, 0.14, -0.5], [0.36, 0.9, 0.56], 0.04, lopLong(G));
      if (G.longDai) { const r = rnd(21); for (let i = 0; i < 18; i++) { const a = r() * Math.PI * 2, e = (r() - 0.2) * 1.1; b.cau(0.1 + r() * 0.04, { p: [Math.cos(a) * Math.cos(e) * 0.29, 0.52 + Math.sin(e) * 0.26, Math.sin(a) * Math.cos(e) * 0.38], mau: r() < 0.5 ? M : toiMau(M, 0.88), ao: 0.2 }, 3); } }
      if (G.bauSua) { // bầu vú nhỏ + 4 núm
        b.cau(1, { p: [0, 0.23, -0.18], s: [0.11, 0.08, 0.1], mau: 0xffb3c1, ao: 0.1 }, 4);
        for (const [x, z] of [[0.045, -0.14], [-0.045, -0.14], [0.045, -0.22], [-0.045, -0.22]]) b.tru(0.013, 0.011, 0.045, { p: [x, 0.15, z], mau: 0xff9fb3, ao: 0 }, 6);
      }
    },
    dauVe(b) { // gốc = chân cổ trước vai; cổ ngắn + đầu to cùng cúi khi gặm cỏ
      const f = (x, y, z) => {
        let d = sdNon(x, y, z, 0, -0.02, -0.08, 0, 0.0, 0.1, 0.15, 0.14);                 // cổ ngắn
        d = smin(d, sdEl(x, y, z, 0, -0.12, 0.02, 0.045 * (G.yem || 1), 0.1 * (G.yem || 1), 0.1), 0.05); // yếm
        d = smin(d, sdEl(x, y, z, 0, 0.14, 0.2, 0.2, 0.18, 0.17), 0.06);                 // đầu to, trán rộng tròn
        d = smin(d, sdEl(x, y, z, 0, 0.02, 0.24, 0.17, 0.14, 0.14), 0.06);               // má
        d = smin(d, sdNon(x, y, z, 0, 0.1, 0.24, 0, -0.05, 0.34, 0.16, 0.13), 0.05);      // mặt ngắn, cúi nhẹ
        d = smin(d, sdHop(x, y, z, 0, -0.07, 0.38, 0.06, 0.028, 0.03, 0.085), 0.05);      // mõm tròn to
        return d;
      };
      nan(b, f, [-0.3, -0.26, -0.2], [0.3, 0.36, 0.54], 0.026, mauDauBo(G, DAU), 0.16);
      matTo(b, 0.1, 0.16, 0.34, 0.046, null, 0.28);                                   // mắt to nhìn trước + đốm sáng (gắn sát mắt, không lồi khỏi đầu)
      maHong(b, 0.16, 0.04, 0.3, 0.04);
      for (const s of [1, -1]) {
        b.cau(0.026, { p: [s * 0.045, -0.06, 0.464], s: [1, 0.75, 0.45], mau: G.lomui || 0x8a4a58, ao: 0 }, 1); // lỗ mũi to
        b.cau(1, { p: [s * 0.235, 0.17, 0.13], s: [0.11, 0.038, 0.065], r: [0, 0.2 * s, -s * 0.28], mau: boSua ? G.vet[0] : M, ao: 0.15 }, 2); // tai ngang, hơi rủ
        b.cau(1, { p: [s * 0.235, 0.176, 0.145], s: [0.08, 0.024, 0.042], r: [0, 0.2 * s, -s * 0.28], mau: G.taiTrong, ao: 0 }, 2);
        if (G.sung === 'dai') {
          b.tru(0.03, 0.022, 0.2, { p: [s * 0.2, 0.3, 0.14], r: [0, 0, -s * 1.3], mau: 0xf1e2c4, ao: 0.1 }, 8);
          b.cau(0.023, { p: [s * 0.3, 0.33, 0.14], mau: 0xf1e2c4, ao: 0.05 }, 1);
          b.tru(0.023, 0.008, 0.13, { p: [s * 0.33, 0.39, 0.14], r: [0, 0, -s * 0.35], mau: 0xe8d4b0, ao: 0 }, 8);
        } else b.non(0.03, 0.09, { p: [s * 0.1, 0.32, 0.13], r: [-0.2, 0, -s * 0.45], mau: 0xf1e2c4, ao: 0.1 }, 8); // sừng ở góc đỉnh đầu
        if (G.matNa) b.cau(1, { p: [s * 0.1, 0.16, 0.315], s: [0.062, 0.07, 0.03], mau: G.matNa, ao: 0 }, 3); // mảng sẫm quanh mắt (Jersey)
      }
      if (G.chuong) b.cau(0.045, { p: [0, -0.2, 0.08], mau: 0xf2c14e, ao: 0.1 }, 2); // chuông dưới yếm
      if (G.longDai) for (const [x, y, z, r] of [[0, 0.3, 0.26, 0.09], [0.07, 0.28, 0.28, 0.075], [-0.07, 0.28, 0.28, 0.075], [0.05, 0.33, 0.18, 0.08], [-0.05, 0.33, 0.18, 0.08]])
        b.cau(r, { p: [x, y, z], s: [1, 0.85, 0.9], mau: toiMau(M, 1.06), ao: 0.1 }, 2); // mái tóc che trán
    },
    chanVe(b, i) {
      const dat = i < 2 ? TRUOC[i] : SAU[i - 2];
      if (i < 2) { // chân trước ngắn mập, thẳng
        nan(b, (x, y, z) => { let d = sdNon(x, y, z, 0, 0.04, 0, 0, -0.14, -0.01, 0.085, 0.07);
          d = smin(d, sdNon(x, y, z, 0, -0.14, -0.01, 0, -0.34, 0.004, 0.068, 0.056), 0.03);
          return smin(d, sdEl(x, y, z, 0, -0.345, 0.008, 0.058, 0.045, 0.06), 0.02); }, [-0.12, -0.4, -0.12], [0.12, 0.14, 0.12], 0.026, lopLong(G, dat));
        mong(b, [0, -0.4, 0.006]);
      } else { // chân sau: đùi → gối (ra trước) → khoeo (ra sau) → cổ chân, gập nhẹ
        nan(b, (x, y, z) => { let d = sdEl(x, y, z, 0, -0.03, 0, 0.12, 0.15, 0.13);
          d = smin(d, sdNon(x, y, z, 0, -0.08, 0.02, 0, -0.16, 0.04, 0.1, 0.08), 0.04);
          d = smin(d, sdNon(x, y, z, 0, -0.16, 0.04, 0, -0.27, -0.04, 0.076, 0.06), 0.03);
          d = smin(d, sdNon(x, y, z, 0, -0.27, -0.04, 0, -0.38, -0.01, 0.06, 0.056), 0.02);
          return smin(d, sdEl(x, y, z, 0, -0.385, -0.004, 0.058, 0.045, 0.06), 0.02); }, [-0.15, -0.44, -0.15], [0.15, 0.15, 0.16], 0.026, lopLong(G, dat));
        mong(b, [0, -0.44, 0]);
      }
      if (G.longDai) b.cau(0.075, { p: [0, i < 2 ? -0.18 : -0.22, i < 2 ? 0 : -0.03], s: [1.15, 1.35, 1.15], mau: toiMau(M, 0.92), ao: 0.2 }, 2);
    },
    duoiVe(b) { // mọc từ đỉnh mông, rủ xuống, chùm lông cuối
      nan(b, (x, y, z) => smin(sdNon(x, y, z, 0, 0.02, 0.02, 0, -0.36, -0.04, 0.028, 0.015), sdEl(x, y, z, 0, 0, 0.02, 0.042, 0.036, 0.042), 0.03),
        [-0.06, -0.4, -0.09], [0.06, 0.07, 0.08], 0.018, lopLong(G, DUOI), 0.1);
      b.cau(1, { p: [0, -0.42, -0.045], s: [0.05, 0.085, 0.05], mau: G.chop, ao: 0 }, 3);
    },
  };
}
for (const g in GIONG_BO) LOAI_VAT['bo_' + g] = dungBo(GIONG_BO[g]);
LOAI_VAT.bo = LOAI_VAT.bo_bosua;
function rnd(seed) { let a = seed * 9301 + 49297; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; }
const geoVat = {};
function vatMoi(loai, bien) { // bien: số thứ tự con trong chuồng (bò: trộn đủ giống) hoặc tên giống
  if (loai === 'bo' && bien != null) { const ds = Object.keys(GIONG_BO); loai = 'bo_' + (typeof bien === 'string' ? bien : ds[bien % ds.length]); }
  const L = LOAI_VAT[loai]; if (!L) return null;
  if (!geoVat[loai]) {
    const mk = f => { const b = boMin(); f(b); return b.xong().geometry; };
    geoVat[loai] = { than: mk(L.than), dau: mk(L.dauVe), chan: L.chanKhac ? [0, 1, 2, 3].map(i => mk(b => L.chanVe(b, i))) : mk(L.chanVe), duoi: mk(L.duoiVe) };
  }
  const G = geoVat[loai], luoi = g => { const m = new T.Mesh(g, MAT_MIN); m.castShadow = true; m.receiveShadow = true; return m; };
  const goc = new T.Group(), khung = new T.Group(); goc.add(khung); if (L.co) goc.scale.setScalar(L.co);
  const than = luoi(G.than); khung.add(than);
  const khop = (p, g) => { const k = new T.Group(); k.position.set(...p); k.add(luoi(g)); khung.add(k); return k; };
  const dau = khop(L.dau, G.dau), chan = L.chan.map((p, i) => khop(p, Array.isArray(G.chan) ? G.chan[i] : G.chan)), duoi = khop(L.duoi, G.duoi);
  duoi.rotation.x = L.duoiXoay;
  const pha = Math.random() * 20, [buoc, bienDo] = L.di, lai = (a, b, k) => a + (b - a) * k;
  // cử động: 'di' (chân chéo đánh nhịp, thân nảy, đầu gật) · 'dung' (thở, thỉnh thoảng ngó quanh) · 'an' (cúi gặm cỏ, nhai)
  goc.userData.hd = (tg, dang) => {
    const t = tg + pha;
    if (dang === 'di') {
      const s = Math.sin(t * buoc);
      chan[0].rotation.x = chan[3].rotation.x = s * bienDo; chan[1].rotation.x = chan[2].rotation.x = -s * bienDo;
      khung.position.y = Math.abs(Math.cos(t * buoc)) * 0.018;
      dau.rotation.x = lai(dau.rotation.x, Math.sin(t * buoc * 2) * 0.06, 0.3); dau.rotation.y = lai(dau.rotation.y, 0, 0.1);
      duoi.rotation.z = Math.sin(t * buoc) * 0.35;
    } else {
      for (const c of chan) c.rotation.x *= 0.8;
      khung.position.y *= 0.8; than.scale.y = 1 + Math.sin(t * 2.2) * 0.015;
      if (dang === 'an') { const g = Math.max(0, Math.sin(t * 0.9)); dau.rotation.x = lai(dau.rotation.x, 0.55 * g + 0.06 * Math.sin(t * 9) * g, 0.12); dau.rotation.y = lai(dau.rotation.y, 0, 0.1); }
      else { dau.rotation.x = lai(dau.rotation.x, 0, 0.1); dau.rotation.y = lai(dau.rotation.y, Math.sin(t * 0.5) * 0.4 * Math.max(0, Math.sin(t * 0.23)), 0.08); }
      duoi.rotation.z = Math.sin(t * 3) * 0.25;
    }
  };
  return goc;
}

// ---------- 4c. GIÓ: tán cây, bụi lắc nhẹ (chèn vào vật liệu mịn của models.js) ----------
const GIO = { value: 0 };
function ganGio(mat, bien) {
  const goc = mat.onBeforeCompile;
  mat.onBeforeCompile = function (sh, r) {
    goc.call(this, sh, r);
    sh.uniforms.uGio = GIO;
    sh.vertexShader = 'uniform float uGio;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      {
        #ifdef USE_INSTANCING
          vec3 dhGoc = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        #else
          vec3 dhGoc = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        #endif
        float dhCao = max(0.0, position.y - 0.3);                   // gốc đứng yên, càng cao càng lắc
        float dhPha = uGio * 1.3 + dhGoc.x * 0.37 + dhGoc.z * 0.29;
        transformed.x += (sin(dhPha) + 0.4 * sin(dhPha * 2.3 + 1.7)) * ${bien.toFixed(3)} * dhCao;
        transformed.z += cos(dhPha * 0.8 + 0.6) * ${(bien * 0.6).toFixed(3)} * dhCao;
      }`);
  };
  mat.customProgramCacheKey = function () { return 'dh-gio-' + bien; };
}

// ---------- 4d. ĐỒNG HỒ FPS (?fps=1) — đo trên máy thật ----------
if (Q.get('fps')) addEventListener('DOMContentLoaded', () => {
  const el = document.createElement('div'); el.style.cssText = 'position:fixed;left:6px;bottom:6px;z-index:99;background:rgba(0,0,0,.6);color:#fff;font:600 13px system-ui;padding:3px 7px;border-radius:6px;pointer-events:none';
  document.body.appendChild(el); let n = 0, t0 = performance.now(), cham = 0;
  const lap = t => { n++; if (t - t0 >= 1000) { const f = n * 1000 / (t - t0); cham = f < 50 ? cham + 1 : cham; el.textContent = f.toFixed(0) + ' fps' + (cham ? ' · tụt ' + cham + ' lần' : '') + (window.NT_DOHOA && NT_DOHOA.buocCL ? ' · hạ chất lượng bước ' + NT_DOHOA.buocCL : ''); n = 0; t0 = t; } requestAnimationFrame(lap); };
  requestAnimationFrame(lap);
});

// ---------- 4e. TRẠI THỬ CẤP 30 (?thu=30) — chỉ nhánh thử, để đo tốc độ trên máy thật với trại đầy đủ ----------
// GHI ĐÈ tiến độ đã lưu của trình duyệt đó (mỗi địa chỉ/cổng một kho riêng) — đừng dùng trên máy đang chơi thật.
if (Q.get('thu') === '30' && window.NT_ENGINE && window.NT_DATA) {
  const E = NT_ENGINE, D = NT_DATA, s = E.moi(), t = E.gio(s); s.cap = 30; s.xu = 5000;
  const cay = Object.keys(D.I).filter(k => D.I[k].nguon === 'ruong');
  s.ruong = Array.from({ length: 48 }, (_, i) => { const id = cay[Math.floor(i / 6) % cay.length]; return { cay: id, luc: t - D.I[id].phut * E.PHUT * (i % 5 === 0 ? 1.2 : 0.75) }; });
  for (const k in D.VAT) { s.vat[k].chuong = 1; s.vat[k].con = Array.from({ length: D.VAT[k].suc }, () => ({ an: t })); }
  for (const id in D.MAY) s.may[id] = { mo: true, xay: 0, hang: [] };
  const cq = Object.keys(D.CAY); s.vuon = Array.from({ length: D.LUAT.soOVuon }, (_, o) => { const l = cq[o % cq.length]; return { loai: l, moc: t + D.CAY[l].phut * E.PHUT * 0.3, lan: 1 }; });
  E.luu(s);
}

// ---------- 4g. CÂY TRỒNG MỚI: 13 cây nhịp ngày × 4 GIAI ĐOẠN (0 mầm · 1 cây non · 2 ra hoa/trổ · 3 chín) ----------
// Toạ độ = mặt ô ruộng (ô 1×1, tâm 0; 4 luống chạy dọc x ở z = ±0,115 · ±0,345; đỉnh luống ≈ +0,03). Cảnh đặt lưới ở y = 0,12, cỡ 1.
// Nguyên tắc: phủ kín ô theo luống · lúc chín quả/củ TO và LỘ RÕ (liếc là biết cây gì) · ra hoa trước khi kết quả (HS thấy vòng đời cây).
const XANH_C = 0x6dbb45, XANH_D = 0x4a9a3a, XANH_N = 0x9fd35c, XANH_V = 0xbac65a, NAU_THAN = 0x7a5a3a;
const LUONG = [-0.345, -0.115, 0.115, 0.345], _truZ = new T.Vector3(0, 0, 1), _truY = new T.Vector3(0, 1, 0), _dd = new T.Vector3();
const huong = (th, ph) => _dd.set(Math.sin(th) * Math.cos(ph), Math.sin(ph), Math.cos(th) * Math.cos(ph)).normalize();
function la(b, x, y, z, th, ph, dai, rong, mau, min) { // lá bầu dục mọc từ (x,y,z) theo hướng (th quanh trục đứng, ph ngẩng lên)
  const d = huong(th, ph), q = new T.Quaternion().setFromUnitVectors(_truZ, d);
  b.cau(1, { p: [x + d.x * dai * 0.5, y + d.y * dai * 0.5, z + d.z * dai * 0.5], s: [rong, rong * 0.24, dai * 0.5], q, mau, ao: 0.15 }, min == null ? (rong > 0.045 ? 1 : 0) : Math.min(min, rong > 0.045 ? 2 : 0));
}
function than(b, x, y, z, th, ph, dai, r, mau, doan) { // thân/cuống: trụ theo hướng; trả điểm ngọn
  const d = huong(th, ph), q = new T.Quaternion().setFromUnitVectors(_truY, d), dx = d.x, dy = d.y, dz = d.z;
  b.tru(r * 0.75, r, dai, { p: [x + dx * dai / 2, y + dy * dai / 2, z + dz * dai / 2], q, mau, ao: 0.12 }, doan || 5);
  return [x + dx * dai, y + dy * dai, z + dz * dai];
}
function hoa5(b, x, y, z, r, canh, nhuy, ngua) { // hoa 5 cánh (ngua: ngửa lên trời)
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; b.cau(1, { p: [x + Math.cos(a) * r * 0.9, y, z + Math.sin(a) * r * 0.9], s: [r * 0.75, r * 0.2, r * 0.55], r: [0, -a, 0], mau: canh, ao: 0 }, 0); }
  b.cau(r * 0.45, { p: [x, y + r * 0.1, z], mau: nhuy, ao: 0 }, 0);
}
function mam(b, x, z, r, co) { // giai đoạn 0 — chung mọi cây: cỏ mảnh (lúa/mía) hoặc 2 lá mầm tròn
  if (co) { for (let i = 0; i < 3; i++) la(b, x, 0.01, z, r() * 6.28, 1.15 + r() * 0.3, 0.07 + r() * 0.03, 0.011, XANH_N, 0); return; }
  const [tx, ty, tz] = than(b, x, 0.01, z, 0, Math.PI / 2, 0.045, 0.006, XANH_C, 4), a = r() * 6.28;
  la(b, tx, ty, tz, a, 0.35, 0.045, 0.024, XANH_N, 1); la(b, tx, ty, tz, a + Math.PI, 0.35, 0.045, 0.024, XANH_C, 1);
}
const luoiO = (soHang, soCay, r, lech) => { // vị trí cây phủ kín ô, lệch tí cho tự nhiên
  const hang = soHang === 4 ? LUONG : soHang === 3 ? [-0.28, 0, 0.28] : [-0.2, 0.2], ds = [];
  for (const z of hang) for (let i = 0; i < soCay; i++) ds.push([(soCay === 1 ? 0 : -0.33 + i * 0.66 / (soCay - 1)) + (r() - 0.5) * (lech || 0.05), z + (r() - 0.5) * (lech || 0.03)]);
  return ds;
};
// mỗi cây: bo = [số hàng, cây/hàng] · co = mầm kiểu cỏ · ve(b, pha, x, z, r) vẽ 1 cây (pha 1..3) · veO(b, pha, r) vẽ cả ô (cây bò lan)
const CAY_MOI = {
  lua_mi: { bo: [4, 5], co: 1, ve(b, p, x, z, r) {
    if (p === 1) { for (let i = 0; i < 5; i++) la(b, x, 0.01, z, r() * 6.28, 1.2 + r() * 0.25, 0.13 + r() * 0.03, 0.011, i % 2 ? XANH_C : XANH_N, 0); return; }
    const vang = p === 3, h = vang ? 0.3 : 0.25;
    for (let i = 0; i < 4; i++) { const th = r() * 6.28, ph = Math.PI / 2 - 0.12 - r() * 0.15, ngon = than(b, x, 0.01, z, th, ph, h * (0.85 + r() * 0.3), 0.006, vang ? 0xd9ad4a : XANH_C, 4), d = huong(th, ph);
      b.cau(1, { p: [ngon[0] + d.x * 0.03, ngon[1] + 0.03, ngon[2] + d.z * 0.03], s: [vang ? 0.026 : 0.02, vang ? 0.065 : 0.05, vang ? 0.026 : 0.02], r: [d.z * 0.3, 0, -d.x * 0.3], mau: vang ? (i % 2 ? 0xf2c14e : 0xe9b23a) : XANH_N, ao: 0.1 }, 0); }
    for (let i = 0; i < 3; i++) la(b, x, 0.01, z, r() * 6.28, 0.9 + r() * 0.3, 0.12, 0.012, vang ? 0xd8c05a : XANH_C, 0);
  } },
  lua_nuoc: { bo: [4, 4], co: 1, nuoc: 1, ve(b, p, x, z, r) {
    const vang = p === 3, n = p === 1 ? 5 : 7;
    for (let i = 0; i < n; i++) la(b, x, 0.02, z, i / n * 6.28 + r() * 0.4, 1.05 + r() * 0.3, (p === 1 ? 0.12 : 0.2) * (0.85 + r() * 0.3), 0.011, vang ? (i % 2 ? 0xc9b454 : 0xb3a04a) : i % 2 ? XANH_C : XANH_D, 0);
    if (p >= 2) for (let i = 0; i < 3; i++) { const th = r() * 6.28, ngon = than(b, x, 0.02, z, th, 1.2, 0.2, 0.005, vang ? 0xc9a94a : XANH_C, 4); // bông lúa trĩu xuống
      for (let k = 0; k < 4; k++) { const d = huong(th, -0.2 - k * 0.35); b.cau(1, { p: [ngon[0] + Math.sin(th) * 0.018 * (k + 1), ngon[1] - 0.016 * k * k * 0.6, ngon[2] + Math.cos(th) * 0.018 * (k + 1)], s: [0.012, 0.012, 0.022], mau: vang ? (k % 2 ? 0xf0c14a : 0xe0ae3a) : XANH_N, ao: 0.05 }, 0); } }
  } },
  ngo: { bo: [2, 3], ve(b, p, x, z, r) {
    const h = p === 1 ? 0.12 : p === 2 ? 0.46 : 0.52, lau = p === 3 ? 0xa8b44e : XANH_C, ngon = than(b, x, 0.01, z, 0, Math.PI / 2, h, p === 1 ? 0.012 : 0.02, lau, 6);
    const soLa = p === 1 ? 4 : 7;
    for (let i = 0; i < soLa; i++) { const y = 0.02 + (h - 0.05) * i / soLa, th = i * 2.4 + r(); la(b, x, y, z, th, 0.5 - i * 0.03, p === 1 ? 0.14 : 0.24, 0.03, i % 2 ? lau : XANH_D, 1); }
    if (p >= 2) { for (let i = 0; i < 5; i++) la(b, ngon[0], ngon[1], ngon[2], i * 1.26, 1.1, 0.08, 0.006, p === 3 ? 0x9a6a3a : 0xd8c46a, 0); // cờ ngô
      const tr = p === 3 ? 1 : 0.55, th = r() * 6.28, y = h * 0.55, d = huong(th, 1.1); // bắp: vỏ xanh + hạt vàng ló đầu
      b.cau(1, { p: [x + d.x * 0.05, y, z + d.z * 0.05], s: [0.035 * tr, 0.085 * tr, 0.035 * tr], r: [d.z * 0.4, 0, -d.x * 0.4], mau: 0x8fc05a, ao: 0.1 }, 2);
      if (p === 3) { b.cau(1, { p: [x + d.x * 0.07, y + 0.055, z + d.z * 0.07], s: [0.03, 0.05, 0.03], r: [d.z * 0.4, 0, -d.x * 0.4], mau: 0xf7c843, ao: 0 }, 2);
        for (let i = 0; i < 3; i++) la(b, x + d.x * 0.075, y + 0.1, z + d.z * 0.075, th + i - 1, 0.4, 0.04, 0.006, 0x8a5a2a, 0); } }
  } },
  mia: { bo: [3, 3], co: 1, ve(b, p, x, z, r) {
    const h = p === 1 ? 0.14 : p === 2 ? 0.42 : 0.62, dot = p === 1 ? 2 : p === 2 ? 4 : 5, tim = p === 3;
    for (let c = 0; c < (p === 1 ? 2 : 3); c++) { const cx = x + (c - 1) * 0.035, cz = z + (r() - 0.5) * 0.04; let y = 0.01;
      for (let k = 0; k < dot; k++) { const dl = h / dot; b.tru(0.014, 0.015, dl - 0.006, { p: [cx, y + dl / 2, cz], mau: tim ? (k % 2 ? 0x7a3b5e : 0x8a4a6a) : (k % 2 ? 0x9cc860 : 0xb0d46a), ao: 0.1 }, 6);
        b.tru(0.017, 0.017, 0.007, { p: [cx, y + dl - 0.003, cz], mau: tim ? 0xc9a3b0 : 0xd8e8a0, ao: 0 }, 6); y += dl; } // đốt + mắt mía
      for (let i = 0; i < 4; i++) la(b, cx, y, cz, r() * 6.28, 0.6 + r() * 0.5, 0.16 + (p - 1) * 0.04, 0.02, i % 2 ? XANH_C : XANH_D, 1); }
    if (tim) for (let i = 0; i < 2; i++) la(b, x, 0.1 + r() * 0.2, z, r() * 6.28, -0.3, 0.14, 0.02, 0xc9b27a, 1); // lá khô rủ
  } },
  dau_nanh: { bo: [4, 3], ve(b, p, x, z, r) {
    const vang = p === 3, s = p === 1 ? 0.6 : 1, mauLa = vang ? XANH_V : XANH_C;
    for (let i = 0; i < (p === 1 ? 3 : 6); i++) { const th = i * 2.3 + r(), ngon = than(b, x, 0.01, z, th, 1.1 - r() * 0.3, 0.1 * s + r() * 0.03, 0.005, mauLa, 4);
      for (let k = 0; k < 3; k++) la(b, ngon[0], ngon[1], ngon[2], th + (k - 1) * 0.9, 0.3, 0.05 * s, 0.028 * s, k % 2 ? mauLa : vang ? 0xa9b64e : XANH_D, 1); } // lá kép 3 chét
    if (p === 2) for (let i = 0; i < 5; i++) b.cau(0.012, { p: [x + (r() - 0.5) * 0.12, 0.08 + r() * 0.05, z + (r() - 0.5) * 0.12], mau: 0xb78ce0, ao: 0 }, 1); // hoa tím nhỏ
    if (vang) for (let i = 0; i < 12; i++) { const th = r() * 6.28; b.cau(1, { p: [x + Math.sin(th) * 0.055, 0.05 + r() * 0.07, z + Math.cos(th) * 0.055], s: [0.014, 0.038, 0.011], r: [0.4, th, 0], mau: i % 3 ? 0xb89a52 : 0x9a7e44, ao: 0.1 }, 0); } // quả đậu có lông (chín vàng nâu)
  } },
  ca_rot: { bo: [4, 4], co: 1, ve(b, p, x, z, r) {
    const h = p === 1 ? 0.09 : p === 2 ? 0.14 : 0.18;
    for (let i = 0; i < (p === 1 ? 4 : 6); i++) { const th = i * 1.1 + r(), ngon = than(b, x, 0.02, z, th, 1.15 + r() * 0.2, h, 0.004, XANH_C, 3);
      for (let k = 0; k < 3; k++) la(b, ngon[0] - Math.sin(th) * k * 0.02, ngon[1] - k * 0.025, ngon[2] - Math.cos(th) * k * 0.02, th + (k % 2 ? 0.8 : -0.8), 0.4, 0.035, 0.012, k % 2 ? XANH_N : XANH_C, 0); } // lá lông chim
    if (p >= 2) { const to = p === 3 ? 1.3 : 0.6; // vai củ cam ló lên khỏi đất
      b.non(0.03 * to, 0.08 * to, { p: [x, 0.03 * to - 0.02, z], r: [Math.PI, 0, 0], mau: 0xf08a2a, ao: 0.1 }, 10);
      b.cau(0.03 * to, { p: [x, 0.03 * to + 0.015, z], s: [1, 0.45, 1], mau: 0xf59a36, ao: 0.05 }, 1); }
  } },
  khoai_tay: { bo: [3, 3], ve(b, p, x, z, r) {
    const vang = p === 3, s = p === 1 ? 0.6 : 1;
    for (let i = 0; i < (p === 1 ? 4 : 8); i++) { const th = i * 0.8 + r(), ngon = than(b, x, 0.01, z, th, 0.9 + r() * 0.4, 0.09 * s, 0.006, vang ? XANH_V : XANH_C, 4);
      la(b, ngon[0], ngon[1], ngon[2], th, 0.2, 0.06 * s, 0.035 * s, vang ? (i % 2 ? XANH_V : 0xc9b25a) : i % 2 ? XANH_C : XANH_D, 1); }
    if (p === 2) for (let i = 0; i < 3; i++) hoa5(b, x + (r() - 0.5) * 0.1, 0.13 + r() * 0.03, z + (r() - 0.5) * 0.1, 0.016, i % 2 ? 0xe8dcf5 : 0xffffff, 0xf2c14e, 1);
    if (vang) for (let i = 0; i < 3; i++) { const th = i * 2.1 + r(); b.cau(1, { p: [x + Math.sin(th) * 0.1, 0.02, z + Math.cos(th) * 0.1], s: [0.036, 0.028, 0.03], r: [0, th, 0], mau: 0xc49258, ao: 0.1 }, 2); } // củ khoai lộ trên đất
  } },
  ca_chua: { bo: [2, 3], coc: 1, ve(b, p, x, z, r) {
    const h = p === 1 ? 0.14 : 0.36;
    if (p >= 2) b.tru(0.006, 0.006, h + 0.06, { p: [x - 0.04, (h + 0.06) / 2, z - 0.03], mau: 0xa8844e, ao: 0.1 }, 5); // cọc chống
    const ngon = than(b, x, 0.01, z, 0, Math.PI / 2, h, 0.01, XANH_D, 5);
    for (let i = 0; i < (p === 1 ? 5 : 11); i++) { const y = 0.03 + (h - 0.03) * i / (p === 1 ? 5 : 11), th = i * 2.4; la(b, x, y, z, th, 0.25, p === 1 ? 0.07 : 0.1, 0.035, i % 2 ? XANH_C : XANH_D, 1); }
    if (p === 2) { for (let i = 0; i < 3; i++) hoa5(b, x + (r() - 0.5) * 0.14, 0.15 + r() * 0.18, z + (r() - 0.5) * 0.14, 0.014, 0xf5d235, 0xe0a02a);
      for (let i = 0; i < 3; i++) b.cau(0.02, { p: [x + (r() - 0.5) * 0.15, 0.12 + r() * 0.15, z + (r() - 0.5) * 0.15], mau: 0x8fc84a, ao: 0.05 }, 1); } // quả xanh non
    if (p === 3) for (let i = 0; i < 6; i++) { const th = i * 1.05 + r() * 0.3, px = x + Math.sin(th) * 0.075, py = 0.1 + (i % 3) * 0.09 + r() * 0.03, pz = z + Math.cos(th) * 0.075; // quả chín đỏ to
      b.cau(1, { p: [px, py, pz], s: [0.042, 0.036, 0.042], mau: 0xe8402e, ao: 0.08 }, 1);
      for (let k = 0; k < 5; k++) la(b, px, py + 0.034, pz, k * 1.26, 0.05, 0.022, 0.007, XANH_D, 0); }
    void ngon;
  } },
  ot: { bo: [3, 3], ve(b, p, x, z, r) {
    const s = p === 1 ? 0.6 : 1;
    for (let i = 0; i < (p === 1 ? 4 : 8); i++) { const th = i * 0.8 + r(), ngon = than(b, x, 0.01, z, th, 1.0 + r() * 0.3, 0.1 * s, 0.005, XANH_D, 4);
      la(b, ngon[0], ngon[1], ngon[2], th, 0.25, 0.05 * s, 0.022 * s, i % 2 ? XANH_C : XANH_D, 1); }
    if (p === 2) for (let i = 0; i < 3; i++) hoa5(b, x + (r() - 0.5) * 0.1, 0.12, z + (r() - 0.5) * 0.1, 0.012, 0xffffff, 0xd9e89a, 1);
    if (p >= 2) for (let i = 0; i < (p === 3 ? 7 : 3); i++) { const th = i * 0.9 + r(), px = x + Math.sin(th) * 0.06, pz = z + Math.cos(th) * 0.06, py = 0.1 + r() * 0.04; // quả ớt thõng xuống
      b.non(p === 3 ? 0.017 : 0.013, p === 3 ? 0.095 : 0.075, { p: [px, py - 0.042, pz], r: [Math.PI + (r() - 0.5) * 0.4, 0, (r() - 0.5) * 0.4], mau: p === 3 ? 0xe0302a : 0x6fae3a, ao: 0.05 }, 8);
      b.cau(0.011, { p: [px, py + 0.004, pz], mau: XANH_D, ao: 0 }, 0); }
  } },
  dau_tay: { bo: [3, 3], ve(b, p, x, z, r) {
    const s = p === 1 ? 0.65 : 1;
    for (let i = 0; i < (p === 1 ? 3 : 6); i++) { const th = i * 1.05 + r() * 0.3, ngon = than(b, x, 0.01, z, th, 0.75, 0.06 * s, 0.004, XANH_D, 3);
      for (let k = 0; k < 3; k++) la(b, ngon[0], ngon[1], ngon[2], th + (k - 1) * 0.7, 0.1, 0.04 * s, 0.028 * s, k % 2 ? XANH_C : XANH_D, 1); } // lá 3 chét, thấp sát đất
    if (p === 2) for (let i = 0; i < 3; i++) hoa5(b, x + (r() - 0.5) * 0.12, 0.07, z + (r() - 0.5) * 0.12, 0.016, 0xffffff, 0xf2c14e, 1);
    if (p === 3) for (let i = 0; i < 4; i++) { const th = i * 1.57 + r() * 0.4, px = x + Math.sin(th) * 0.085, pz = z + Math.cos(th) * 0.085; // quả dâu đỏ, chấm hạt vàng
      b.non(0.026, 0.05, { p: [px, 0.035, pz], r: [Math.PI, 0, 0], mau: 0xe8323f, mauHam: (xx, yy, zz) => (Math.sin(xx * 520) * Math.sin(yy * 480) * Math.sin(zz * 500) > 0.55 ? 0xf5d86a : 0xe8323f), ao: 0.05 }, 10);
      b.cau(0.026, { p: [px, 0.058, pz], s: [1, 0.55, 1], mau: 0xe8323f, ao: 0.05 }, 1);
      for (let k = 0; k < 5; k++) la(b, px, 0.068, pz, k * 1.26, 0.2, 0.02, 0.008, XANH_D, 0); }
  } },
  hoa_huong_duong: { bo: [2, 3], ve(b, p, x, z, r) {
    const h = p === 1 ? 0.14 : p === 2 ? 0.46 : 0.58, ngon = than(b, x, 0.01, z, 0, Math.PI / 2, h, p === 1 ? 0.008 : 0.013, XANH_D, 6);
    for (let i = 0; i < (p === 1 ? 4 : 8); i++) { const y = 0.03 + (h - 0.06) * i / (p === 1 ? 4 : 8); la(b, x, y, z, i * 2.4, 0.2, p === 1 ? 0.06 : 0.09, 0.05, i % 2 ? XANH_C : XANH_D, 1); } // lá hình tim
    if (p === 2) b.cau(1, { p: [ngon[0], ngon[1] + 0.02, ngon[2]], s: [0.035, 0.03, 0.035], mau: 0x7fb84a, ao: 0.05 }, 2); // nụ
    if (p === 3) { // bông to quay về phía máy quay (và mặt trời)
      const q = new T.Quaternion().setFromUnitVectors(_truZ, new T.Vector3(0.45, 0.35, 0.8).normalize()), tam = new T.Vector3(ngon[0], ngon[1] + 0.02, ngon[2]), v = new T.Vector3();
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; v.set(Math.cos(a) * 0.075, Math.sin(a) * 0.075, 0).applyQuaternion(q).add(tam);
        const qq = q.clone().multiply(new T.Quaternion().setFromEuler(new T.Euler(0, 0, a))); b.cau(1, { p: [v.x, v.y, v.z], s: [0.05, 0.02, 0.008], q: qq, mau: i % 2 ? 0xf7c52e : 0xf2b21f, ao: 0 }, 0); }
      b.cau(1, { p: [tam.x, tam.y, tam.z], s: [0.055, 0.055, 0.018], q, mau: 0x6a3f22, ao: 0.05 }, 2); }
  } },
  dua_hau: { veO(b, p, r) { // dây bò lan kín ô: lá xẻ 3 thuỳ to, hoa vàng, quả sọc to lúc chín
    const soDay = p === 1 ? 3 : 5, dai = p === 1 ? 0.25 : 0.45;
    for (let d = 0; d < soDay; d++) { let th = d / soDay * 6.28 + r() * 0.5, x = (r() - 0.5) * 0.1, z = (r() - 0.5) * 0.1;
      for (let k = 0; k < (p === 1 ? 2 : 4); k++) { const [nx, , nz] = than(b, x, 0.03, z, th, 0.02, dai / 3, 0.006, XANH_C, 4);
        for (let t = 0; t < 3; t++) la(b, nx, 0.035, nz, th + (t - 1) * 0.8 + 1.3, 0.12, p === 1 ? 0.09 : 0.12, 0.065, t % 2 ? XANH_C : XANH_D, 1); // lá xẻ 3 thuỳ to
        x = Math.max(-0.42, Math.min(0.42, nx)); z = Math.max(-0.42, Math.min(0.42, nz)); th += (r() - 0.5) * 1.2; } }
    if (p === 2) { for (let i = 0; i < 4; i++) hoa5(b, (r() - 0.5) * 0.6, 0.075, (r() - 0.5) * 0.6, 0.022, 0xf5d235, 0xe8a82a, 1);
      b.cau(1, { p: [0.12, 0.05, -0.1], s: [0.06, 0.045, 0.045], mau: 0x5aa84a, mauHam: (xx, yy, zz) => (Math.sin(Math.atan2(yy - 0.05, zz + 0.1) * 9) > 0.15 ? 0x3f8a3a : 0x78c060), ao: 0.1 }, 2); } // quả non
    if (p === 3) for (const [x, z] of [[-0.16, 0.12], [0.18, -0.14]]) { // quả dưa hấu sọc (sọc dọc theo trục dài x)
      const cx = x, cy = 0.1, cz = z, ham = (xx, yy, zz) => (Math.sin(Math.atan2(yy - cy, zz - cz) * 9 + Math.sin((xx - cx) * 30) * 0.8) > 0.15 ? 0x2f7a32 : 0x78c060);
      b.cau(1, { p: [cx, cy, cz], s: [0.17, 0.11, 0.12], mau: 0x4a9a3a, mauHam: ham, ao: 0.12 }, 3); }
  } },
  bi_ngo: { veO(b, p, r) { // lá to, hoa vàng loa kèn, quả cam có múi lúc chín
    const soLa = p === 1 ? 5 : 13;
    for (let i = 0; i < soLa; i++) { const x = (r() - 0.5) * (p === 1 ? 0.35 : 0.72), z = (r() - 0.5) * (p === 1 ? 0.35 : 0.72), th = r() * 6.28, ngon = than(b, x, 0.02, z, th, 0.7, 0.04, 0.006, XANH_C, 4);
      la(b, ngon[0], ngon[1], ngon[2], th, 0.06 + r() * 0.12, p === 1 ? 0.12 : 0.16, p === 1 ? 0.09 : 0.12, i % 2 ? XANH_C : XANH_D, 2); } // lá to hình tim nằm bẹt, chồng lên nhau
    if (p === 2) { for (let i = 0; i < 3; i++) { const x = (r() - 0.5) * 0.5, z = (r() - 0.5) * 0.5; b.non(0.03, 0.06, { p: [x, 0.1, z], r: [Math.PI, 0, 0], mau: 0xf7b52a, ao: 0 }, 10); b.cau(0.012, { p: [x, 0.13, z], mau: 0xe08a1a, ao: 0 }, 0); }
      b.cau(1, { p: [0.1, 0.045, 0.1], s: [0.05, 0.04, 0.05], mau: 0x7fae4a, ao: 0.1 }, 2); }
    if (p === 3) for (const [x, z, k] of [[-0.14, 0.1, 1], [0.17, -0.13, 0.85]]) { // quả bí: 8 múi quanh trục đứng + cuống
      for (let m = 0; m < 8; m++) { const a = m / 8 * Math.PI * 2; b.cau(1, { p: [x + Math.cos(a) * 0.055 * k, 0.1 * k, z + Math.sin(a) * 0.055 * k], s: [0.06 * k, 0.085 * k, 0.045 * k], r: [0, -a, 0], mau: m % 2 ? 0xf08a24 : 0xe87e1c, ao: 0.1 }, 2); }
      b.tru(0.012, 0.016, 0.05, { p: [x, 0.2 * k, z], r: [0.3, 0, 0.2], mau: 0x7a8a3a, ao: 0.1 }, 6); }
  } },
};
const TEN_PHA = { lua_mi: ['mầm', 'cây non', 'trổ bông', 'chín'], lua_nuoc: ['mầm', 'cây non', 'trổ bông', 'chín'], ngo: ['mầm', 'cây non', 'trổ cờ', 'chín'], mia: ['mầm', 'cây non', 'vươn lóng', 'chín'],
  ca_rot: ['mầm', 'cây non', 'ra củ', 'chín'], hoa_huong_duong: ['mầm', 'cây non', 'ra nụ', 'nở hoa'] }; // cây khác: mầm · cây non · ra hoa · chín
const tenPha = (id, p) => (TEN_PHA[id] || ['mầm', 'cây non', 'ra hoa', 'chín'])[p];
const geoCayMoi = {};
function cayMoi(id, pha, bien) { // pha 0..3 — trả Mesh (cỡ = ô ruộng) hoặc null nếu cây chưa có bản mới
  const C = CAY_MOI[id]; if (!C) return null;
  const key = id + '|' + pha + '|' + ((bien || 0) % 3);
  if (!geoCayMoi[key]) {
    const b = boMin(), r = rnd(11 + ((bien || 0) % 3) * 7 + id.length);
    if (C.nuoc && pha < 3) { // ruộng lúa ngập nước phủ kín ô (lúc chín tháo cạn)
      const hv = new T.Shape(), w = 0.47, bo = 0.12; hv.moveTo(-w + bo, -w); hv.lineTo(w - bo, -w); hv.quadraticCurveTo(w, -w, w, -w + bo); hv.lineTo(w, w - bo); hv.quadraticCurveTo(w, w, w - bo, w); hv.lineTo(-w + bo, w); hv.quadraticCurveTo(-w, w, -w, w - bo); hv.lineTo(-w, -w + bo); hv.quadraticCurveTo(-w, -w, -w + bo, -w);
      b.geo(new T.ShapeGeometry(hv, 4).rotateX(-Math.PI / 2), { p: [0, 0.036, 0], mau: 0x7dbcb0, ao: 0 });
    }
    if (C.veO) { if (pha === 0) for (const [x, z] of [[-0.15, -0.1], [0.15, 0.12]]) mam(b, x, z, r); else C.veO(b, pha, r); }
    else for (const [x, z] of luoiO(C.bo[0], C.bo[1], r)) { if (pha === 0) mam(b, x, z, r, C.co); else C.ve(b, pha, x, z, r); }
    geoCayMoi[key] = b.xong().geometry;
  }
  const m = new T.Mesh(geoCayMoi[key], MAT_MIN); m.castShadow = true; m.receiveShadow = true; return m;
}
// trạng thái ô (bản nhịp ngày): đất đã tưới (sẫm, ướt) · sâu (con sâu xanh dễ thương) · đã bón (hạt phân rắc)
function trangThaiO(o) {
  const b = boMin(), r = rnd(3);
  if (o.bon) for (let i = 0; i < 24; i++) b.cau(0.009, { p: [(r() - 0.5) * 0.8, 0.035, (r() - 0.5) * 0.8], mau: i % 3 ? 0xf1ead8 : 0xc9b48a, ao: 0 }, 0);
  if (o.sau) for (const [x, z, th] of [[0.12, 0.2, 0.6], [-0.2, -0.15, 2.2]].slice(0, o.sau)) { // sâu xanh: 4 đốt + đầu có mắt + râu (to 1,4 lần cho nhìn thấy từ xa)
    const k = 1.4;
    for (let j = 0; j < 4; j++) b.cau((0.022 - j * 0.002) * k, { p: [x - Math.sin(th) * j * 0.028 * k, 0.05 * k + Math.abs(Math.sin(j * 1.4)) * 0.012 * k, z - Math.cos(th) * j * 0.028 * k], mau: j % 2 ? 0x8fd35a : 0x7cc44a, ao: 0.05 }, 2);
    const hx = x + Math.sin(th) * 0.03 * k, hz = z + Math.cos(th) * 0.03 * k; b.cau(0.026 * k, { p: [hx, 0.058 * k, hz], mau: 0x9fdc62, ao: 0.05 }, 2);
    for (const s of [1, -1]) { const ex = hx + (Math.cos(th) * s * 0.012 + Math.sin(th) * 0.018) * k, ez = hz + (-Math.sin(th) * s * 0.012 + Math.cos(th) * 0.018) * k;
      b.cau(0.007 * k, { p: [ex, 0.066 * k, ez], mau: MAT_DEN, ao: 0 }, 1); b.cau(0.0025 * k, { p: [ex + Math.sin(th) * 0.004 * k, 0.069 * k, ez + Math.cos(th) * 0.004 * k], mau: 0xffffff, ao: 0 }, 0);
      than(b, hx - Math.cos(th) * s * 0.008 * k, 0.08 * k, hz + Math.sin(th) * s * 0.008 * k, th, 1.2, 0.02 * k, 0.002 * k, 0x4a7a2a, 3); } }
  const g = new T.Group(), m = b.xong(); m.castShadow = false; g.add(m);
  if (o.tuoi && window.NT_MODELS) { // đất đã tưới: phủ đúng hình ô (giữ luống) bằng bản sẫm + bóng ướt
    const d = NT_MODELS.datRuong(); d.material = d.material.clone(); d.material.color = new T.Color(0x6e5a50); d.material.roughness = 0.45;
    d.position.y = -0.12 + 0.001; d.scale.setScalar(1.004); d.receiveShadow = true; g.add(d);
  }
  return g;
}

// ---------- 4h. NHÀ TRANG TRÍ: 1 KIỂU NHÀ = 1 BỘ VẬT PHẨM · MỨC ĐẸP = tập vật phẩm đang có ----------
// Nhà là đồ trang trí (khung hình Nông trại vui vẻ): lúc đầu chòi ván đơn sơ, rơi dần vật phẩm ⇒ nhà đẹp dần.
// Mỗi vật phẩm = 1 món vẽ riêng; món cùng "ô" (o) thì món sau THAY món trước (mái tôn → mái ngói, vách mộc → tường sơn).
// nhaMoi(kieu, muc) dựng theo mức (cộng dồn món của các mức ≤ muc) · nhaMoi(kieu, ['mai_ngoi', ...]) dựng đúng tập món đang có
// ⇒ sau này món rơi không theo thứ tự vẫn dựng được. Thêm kiểu nhà = thêm 1 mục vào KIEU_NHA, dùng chung khung toạ độ NG.
// Toạ độ: mặt tiền nhìn về +z (phía camera), tâm thân nhà ở gốc; thân rộng 2 (x) × sâu 1,5 (z); sân trước tới z ≈ 2,1.
function hopTron(w, h, d, r, n) { // hộp bo góc bán kính r: hộp chia n đoạn, dồn đỉnh sát mép rồi chiếu lên mặt cầu góc (pháp tuyến mịn)
  if (!(r > 0)) return new T.BoxGeometry(w, h, d);
  n = n || 4; const m = n / 2 - 1, H = [w / 2, h / 2, d / 2];
  r = Math.min(r, H[0] * 0.95, H[1] * 0.95, H[2] * 0.95);
  const g = new T.BoxGeometry(1, 1, 1, n, n, n), P = g.attributes.position, N = g.attributes.normal, v = new T.Vector3(), c = new T.Vector3();
  const map = (u, hh) => { const k = Math.round(Math.abs(u) * n), t = k === 0 ? 0 : k === 1 ? hh - r : hh - r * (1 - Math.sin(Math.PI / 2 * (k - 1) / m)); return u < 0 ? -t : t; };
  for (let i = 0; i < P.count; i++) {
    v.set(map(P.getX(i), H[0]), map(P.getY(i), H[1]), map(P.getZ(i), H[2]));
    c.set(Math.max(r - H[0], Math.min(H[0] - r, v.x)), Math.max(r - H[1], Math.min(H[1] - r, v.y)), Math.max(r - H[2], Math.min(H[2] - r, v.z)));
    v.sub(c).normalize(); N.setXYZ(i, v.x, v.y, v.z); c.addScaledVector(v, r); P.setXYZ(i, c.x, c.y, c.z);
  }
  return g;
}
const hop = (b, w, h, d, r, o, n) => b.geo(hopTron(w, h, d, r, n), o);
function tamGiac(b, rong, cao, day, o, doc) { // lăng trụ tam giác đáy rong · cao · dày; mặc định nhìn về +z, doc = nằm dọc trục x (hồi nhà)
  const s = new T.Shape(); s.moveTo(-rong / 2, 0); s.lineTo(rong / 2, 0); s.lineTo(0, cao); s.lineTo(-rong / 2, 0);
  const g = new T.ExtrudeGeometry(s, { depth: day, bevelEnabled: false }); g.translate(0, 0, -day / 2); if (doc) g.rotateY(Math.PI / 2);
  b.geo(g, o);
}
const NG = { W: 2.0, D: 1.5, y0: 0.16, H: 1.18, R: 0.66, ov: 0.1, ovX: 0.14, t: 0.07 }; // mái thoải vừa: camera game ngẩng ~44° ⇒ mái dốc hơn sẽ che hết mặt tiền
NG.yT = NG.y0 + NG.H; NG.yR = NG.yT + NG.R; NG.a = Math.atan2(NG.R, NG.D / 2); NG.L = (NG.D / 2 + NG.ov) / Math.cos(NG.a); NG.rong = NG.W + 2 * NG.ovX;
const trenMai = (x, u, h, sau) => { const a = NG.a, s = sau ? -1 : 1; return [x, NG.yR - u * Math.sin(a) + h * Math.cos(a), s * (u * Math.cos(a) + h * Math.sin(a))]; }; // u: cách nóc theo dốc · h: cao hơn mặt dưới mái
function khungMat(ox, oy, oz, g) { // khung 1 mặt tường: (x,y,z) cục bộ → thế giới; g = góc quanh trục đứng (0 = mặt tiền +z)
  const c = Math.cos(g), s = Math.sin(g);
  return { p: (x, y, z) => [ox + x * c + z * s, oy + y, oz - x * s + z * c], r: rz => [0, g, rz || 0] };
}
const MG = { // bảng màu nhà gỗ đồng quê (pastel, hợp cảnh)
  moc: [0x9d8a76, 0x8f7c69, 0xa8957f, 0x94826e], loi: 0x4e4038, son: [0xf8ebd2, 0xf2e1c2], nep: 0xfdf8ee,
  ton: [0xa3b4bb, 0x93a6ae, 0xb3c2c7], gi: 0xa98266, ngoi: [0xd8705a, 0xcc6450, 0xe07f68], ngoiNen: 0xa4533f,
  cuaGo: [0x8a6d55, 0x7f6450, 0x937560], cuaSon: 0x4fa2b3, kinh: 0xb4e2f3, dong: 0xe8b84c, sat: 0x3d3c48,
  da: [0xbdb6ab, 0xaaa398, 0xc9c3b7], gach: [0xbd735a, 0xad6450, 0xc98368], go: [0xb89272, 0xa88466],
  la: [0x6fb24f, 0x5ea344, 0x86c65c], hoa: [0xff8fb3, 0xffd35a, 0xffffff, 0xc59cff, 0xff6f7d, 0xffa24a], chop: 0x7db38a, rao: 0xfbf7ee,
};
const bong = (b, x, y, z, r, mau, hoa, rr) => { // bụi lá tròn + hoa lấm tấm
  b.cau(r, { p: [x, y, z], s: [1, 0.85, 1], mau: MG.la[Math.floor(rr() * 3)], ao: 0.25 }, 2);
  for (let i = 0; i < hoa; i++) { const a = rr() * 6.28, e = 0.2 + rr() * 0.9; b.cau(r * 0.24, { p: [x + Math.cos(a) * Math.cos(e) * r, y + Math.sin(e) * r * 0.85, z + Math.sin(a) * Math.cos(e) * r], mau: mau[i % mau.length], ao: 0 }, 1); }
};

// ----- thân nhà -----
function veTuong(b, K, son) {
  const { W, D, y0, H, yT, R } = NG, r = rnd(son ? 5 : 2), nb = 8, hb = H / nb;
  const mau = i => son ? MG.son[i % 2] : MG.moc[Math.floor(r() * MG.moc.length)];
  hop(b, W - 0.08, H, D - 0.08, 0.02, { p: [0, y0 + H / 2, 0], mau: MG.loi, ao: 0.1 });                 // lõi tối = khe giữa các ván
  tamGiac(b, D - 0.08, R - 0.03, W - 0.08, { p: [0, yT, 0], mau: MG.loi, ao: 0.1 }, true);
  for (let i = 0; i < nb; i++) {
    const y = y0 + (i + 0.5) * hb;
    for (const s of [1, -1]) {
      const lech = son ? 0 : (r() - 0.5) * 0.03, ng = son ? 0 : (r() - 0.5) * 0.02;
      hop(b, W + 0.04, hb - 0.014, 0.06, 0.02, { p: [lech, y, s * (D / 2 - 0.02)], r: [0, 0, ng], mau: mau(i), ao: 0.28 });
      hop(b, 0.06, hb - 0.014, D + 0.04, 0.02, { p: [s * (W / 2 - 0.02), y, lech], r: [ng, 0, 0], mau: mau(i + 1), ao: 0.28 });
    }
  }
  for (let j = 0; ; j++) { // hồi nhà: ván ngắn dần, góc trên chui vào trong mái
    const y = yT + (j + 0.5) * hb, zh = D / 2 * (1 - (j + 0.5) * hb / R); if (zh < 0.06) break;
    for (const s of [1, -1]) hop(b, 0.06, hb - 0.014, 2 * zh, 0.02, { p: [s * (W / 2 - 0.02), y, 0], mau: mau(j + 3), ao: 0.28 });
  }
  if (!son) { // chòi nghèo: 1 tấm ván vá chéo đóng đinh
    hop(b, 0.36, 0.1, 0.03, 0.015, { p: [-0.72, y0 + 0.36, D / 2 + 0.03], r: [0, 0, 0.35], mau: 0xb49e84, ao: 0.2 });
    for (const [x, y] of [[-0.861, 0.309], [-0.579, 0.411]]) b.cau(0.012, { p: [x, y0 + y, D / 2 + 0.05], mau: MG.sat, ao: 0 }, 0);
    hop(b, 0.22, 0.08, 0.03, 0.012, { p: [0.72, y0 + 0.2, D / 2 + 0.03], r: [0, 0, -0.12], mau: 0x86725f, ao: 0.2 });
    return;
  }
  for (const sx of [1, -1]) for (const sz of [1, -1]) hop(b, 0.1, H + 0.02, 0.1, 0.03, { p: [sx * W / 2, y0 + H / 2, sz * D / 2], mau: MG.nep, ao: 0.12 }); // nẹp góc trắng
  for (const s of [1, -1]) hop(b, W + 0.08, 0.08, 0.08, 0.025, { p: [0, yT - 0.04, s * (D / 2 + 0.005)], mau: MG.nep, ao: 0.1 });            // ván diềm đỉnh tường
  for (const s of [1, -1]) { // ô thông gió tròn ở 2 đầu hồi
    b.geo(new T.TorusGeometry(0.1, 0.025, 6, 16).rotateY(Math.PI / 2), { p: [s * (W / 2 + 0.02), yT + 0.3, 0], mau: MG.nep, ao: 0 });
    b.tru(0.09, 0.09, 0.02, { p: [s * (W / 2 + 0.01), yT + 0.3, 0], r: [0, 0, Math.PI / 2], mau: 0x6a5854, ao: 0 }, 12);
  }
}
function veNen(b, K, da) {
  const { W, D, y0 } = NG;
  if (!da) { hop(b, W + 0.1, y0, D + 0.1, 0.02, { p: [0, y0 / 2, 0], mau: 0x7a6452, ao: 0.3 }); return; } // ván kê nền
  hop(b, W + 0.04, y0, D + 0.04, 0.02, { p: [0, y0 / 2, 0], mau: 0x958c80, ao: 0.2 });                   // vữa
  const r = rnd(8), vien = (x, z, doc) => { const w = 0.17 + r() * 0.06, h = 0.15 + r() * 0.06;
    hop(b, doc ? 0.1 : w, h, doc ? w : 0.1, 0.035, { p: [x, h / 2, z], r: [0, (r() - 0.5) * 0.12, 0], mau: MG.da[Math.floor(r() * 3)], ao: 0.3 }); };
  for (const s of [1, -1]) {
    for (let i = 0; i < 10; i++) { const x = -0.9 + i * 0.2; if (!(s > 0 && Math.abs(x) < 0.35)) vien(x, s * (D / 2 + 0.01), false); }
    for (let z = -D / 2 + 0.1; z < D / 2; z += 0.2) vien(s * (W / 2 + 0.01), z, true);
  }
}
// ----- mái -----
function maiNen(b, mau) { for (const sau of [0, 1]) hop(b, NG.rong, NG.t, NG.L + 0.04, 0.02, { p: trenMai(0, (NG.L - 0.04) / 2, NG.t / 2, sau), r: [(sau ? -1 : 1) * NG.a, 0, 0], mau, ao: 0.15 }); }
function veMaiTon(b) {
  const { a, L, t, rong } = NG, soSong = Math.round(rong / 0.085);
  maiNen(b, MG.ton[1]);
  for (const sau of [0, 1]) { const s = sau ? -1 : 1;
    for (let k = 0; k < soSong; k++) { // sóng tôn: từng tấm 6 sóng lệch màu; 1 tấm gỉ ở mái trước
      const x = -rong / 2 + (k + 0.5) * rong / soSong, tam = Math.floor(k / 6), mau = !sau && tam === 2 ? MG.gi : MG.ton[(tam + sau) % 3];
      b.tru(0.021, 0.021, L + 0.02, { p: trenMai(x, (L - 0.02) / 2, t, sau), r: [s * (a + Math.PI / 2), 0, 0], mau, ao: 0.1 }, 6);
    }
  }
  hop(b, 0.42, 0.02, 0.4, 0.01, { p: trenMai(0.55, 0.62, t + 0.03, 0), r: [a, 0.1, 0], mau: 0x98806a, ao: 0.1 });      // miếng vá
  for (const [dx, du] of [[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]]) b.cau(0.012, { p: trenMai(0.55 + dx, 0.62 + du, t + 0.045, 0), mau: MG.sat, ao: 0 }, 0);
  b.tru(0.06, 0.06, rong + 0.04, { p: [0, NG.yR + 0.08, 0], r: [0, 0, Math.PI / 2], mau: MG.ton[2], ao: 0.1 }, 8);     // úp nóc
}
const VAY = new T.SphereGeometry(1, 11, 3, 0, Math.PI * 2, 0, Math.PI / 2); // viên ngói vảy (vòm dẹt)
function ngoiVay(b, r, p, q, sx, sz, k) { b.geo(VAY.clone(), { p, q, s: [sx, 0.035 + k * 0.001, sz], mau: MG.ngoi[Math.floor(r() * 3)], ao: 0.3 }); }
function veMaiNgoi(b) {
  const { a, L, t, rong } = NG, r = rnd(6), e = new T.Euler(), q = new T.Quaternion();
  maiNen(b, MG.ngoiNen);
  for (const sau of [0, 1]) { const s = sau ? -1 : 1; q.setFromEuler(e.set(s * a, 0, 0));
    for (let k = 0; ; k++) { // hàng trên đè lên hàng dưới ⇒ lộ mép tròn → vảy cá
      const u = L - 0.07 - k * 0.14; if (u < 0.03) break; const sp = rong / 11;
      if (k % 2) { for (let i = 1; i <= 10; i++) ngoiVay(b, r, trenMai(-rong / 2 + i * sp, u, t + k * 0.004, sau), q, 0.106, 0.09, k);
        for (const sx of [1, -1]) ngoiVay(b, r, trenMai(sx * (rong / 2 - 0.055), u, t + k * 0.004, sau), q, 0.058, 0.09, k); }
      else for (let i = 0; i < 11; i++) ngoiVay(b, r, trenMai(-rong / 2 + (i + 0.5) * sp, u, t + k * 0.004, sau), q, 0.106, 0.09, k);
    }
  }
  b.tru(0.075, 0.075, rong + 0.06, { p: [0, NG.yR + 0.08, 0], r: [0, 0, Math.PI / 2], mau: 0xc9533f, ao: 0.15 }, 10);   // ngói úp nóc
  for (let x = -rong / 2 + 0.15; x < rong / 2 - 0.1; x += 0.3) b.tru(0.082, 0.082, 0.05, { p: [x, NG.yR + 0.08, 0], r: [0, 0, Math.PI / 2], mau: 0xb84a39, ao: 0.1 }, 10);
}
function veDiem(b) { // diềm trắng: mép mái trước/sau + ván gió 2 đầu hồi + núm đầu nóc
  const { a, L, t, rong } = NG;
  for (const sau of [0, 1]) { const s = sau ? -1 : 1;
    hop(b, rong + 0.06, t + 0.08, 0.045, 0.018, { p: trenMai(0, L + 0.01, t / 2 - 0.01, sau), r: [s * a, 0, 0], mau: MG.nep, ao: 0.1 });
    for (const sx of [1, -1]) hop(b, 0.045, t + 0.09, L + 0.06, 0.018, { p: trenMai(sx * (rong / 2 + 0.02), L / 2, t / 2, sau), r: [s * a, 0, 0], mau: MG.nep, ao: 0.1 });
  }
  for (const sx of [1, -1]) b.cau(0.055, { p: [sx * (rong / 2 + 0.02), NG.yR + 0.12, 0], mau: MG.nep, ao: 0 }, 2);
}
// ----- cửa -----
function veCuaVan(b) {
  const { y0, D } = NG, z = D / 2 + 0.03, r = rnd(9), khung = 0x6b5443;
  hop(b, 0.46, 0.78, 0.03, 0.01, { p: [0, y0 + 0.39, z - 0.015], mau: 0x3a2f29, ao: 0 });
  for (let i = 0; i < 4; i++) hop(b, 0.1, 0.74 - r() * 0.04, 0.04, 0.015, { p: [-0.155 + i * 0.103, y0 + 0.37, z], mau: MG.cuaGo[i % 3], ao: 0.25 });
  for (const y of [0.14, 0.6]) hop(b, 0.42, 0.06, 0.03, 0.012, { p: [0, y0 + y, z + 0.03], mau: 0x6e5646, ao: 0.15 });
  hop(b, 0.06, 0.52, 0.03, 0.012, { p: [0, y0 + 0.37, z + 0.03], r: [0, 0, -0.6], mau: 0x6e5646, ao: 0.15 });                   // thanh chéo chữ Z
  b.geo(new T.TorusGeometry(0.035, 0.009, 5, 10), { p: [0.14, y0 + 0.38, z + 0.055], mau: MG.sat, ao: 0 });                        // vòng kéo sắt
  for (const sx of [1, -1]) hop(b, 0.06, 0.8, 0.05, 0.015, { p: [sx * 0.25, y0 + 0.4, z - 0.005], mau: khung, ao: 0.2 });
  hop(b, 0.58, 0.07, 0.05, 0.015, { p: [0, y0 + 0.8, z - 0.005], mau: khung, ao: 0.2 });
}
function veCuaXanh(b) { // cửa vòm sơn xanh: 2 ô panô, ô kính tròn, núm đồng, khung vòm trắng
  const { y0, D } = NG, z = D / 2 + 0.03, C = MG.cuaSon;
  hop(b, 0.44, 0.58, 0.05, 0.02, { p: [0, y0 + 0.29, z], mau: C, ao: 0.2 });
  b.geo(new T.CylinderGeometry(0.22, 0.22, 0.05, 18, 1, false, Math.PI / 2, Math.PI).rotateX(Math.PI / 2), { p: [0, y0 + 0.58, z], mau: C, ao: 0.05 });
  for (const sx of [1, -1]) hop(b, 0.14, 0.24, 0.02, 0.01, { p: [sx * 0.1, y0 + 0.19, z + 0.028], mau: 0x66b6c6, ao: 0.1 });
  b.tru(0.085, 0.085, 0.02, { p: [0, y0 + 0.6, z + 0.028], r: [Math.PI / 2, 0, 0], mau: MG.kinh, ao: 0 }, 16);
  b.geo(new T.TorusGeometry(0.09, 0.017, 6, 18), { p: [0, y0 + 0.6, z + 0.036], mau: MG.nep, ao: 0 });
  hop(b, 0.17, 0.014, 0.012, 0, { p: [0, y0 + 0.6, z + 0.04], mau: MG.nep, ao: 0 }); hop(b, 0.014, 0.17, 0.012, 0, { p: [0, y0 + 0.6, z + 0.04], mau: MG.nep, ao: 0 });
  b.cau(0.028, { p: [0.15, y0 + 0.36, z + 0.045], mau: MG.dong, ao: 0 }, 2);
  for (const sx of [1, -1]) hop(b, 0.06, 0.58, 0.06, 0.02, { p: [sx * 0.25, y0 + 0.29, z - 0.005], mau: MG.nep, ao: 0.12 });
  b.geo(new T.TorusGeometry(0.25, 0.03, 6, 18, Math.PI), { p: [0, y0 + 0.58, z - 0.005], mau: MG.nep, ao: 0.05 });
}
// ----- cửa sổ (4 ô: 2 mặt tiền + 1 mỗi bên hồi) -----
const O_CUA_SO = () => { const y = NG.y0 + 0.66; return [khungMat(0.62, y, NG.D / 2 + 0.01, 0), khungMat(-0.62, y, NG.D / 2 + 0.01, 0), khungMat(NG.W / 2 + 0.01, y, 0, Math.PI / 2), khungMat(-NG.W / 2 - 0.01, y, 0, -Math.PI / 2)]; };
function veChanSong(b) { // chòi: 1 lỗ cửa tối, 2 thanh ván đóng chéo
  const f = O_CUA_SO()[0], go = 0x7c6350;
  hop(b, 0.3, 0.3, 0.02, 0.01, { p: f.p(0, 0.04, 0.005), r: f.r(), mau: 0x362c26, ao: 0 });
  for (const rz of [0.72, -0.72]) hop(b, 0.4, 0.05, 0.03, 0.012, { p: f.p(0, 0.04, 0.035), r: f.r(rz), mau: 0x9a8068, ao: 0.15 });
  for (const [x, y, w, h] of [[0, 0.21, 0.4, 0.05], [0, -0.13, 0.4, 0.05], [0.18, 0.04, 0.05, 0.36], [-0.18, 0.04, 0.05, 0.36]]) hop(b, w, h, 0.04, 0.012, { p: f.p(x, y, 0.02), r: f.r(), mau: go, ao: 0.2 });
}
function veCuaSoKinh(b, K) {
  const vien = K.co('tuong_son') ? MG.nep : 0xd6bf98;
  for (const f of O_CUA_SO()) {
    hop(b, 0.34, 0.4, 0.02, 0.01, { p: f.p(0, 0, 0.01), r: f.r(), mau: MG.kinh, ao: 0 });
    hop(b, 0.05, 0.2, 0.006, 0, { p: f.p(-0.07, 0.05, 0.022), r: f.r(0.6), mau: 0xe9f8ff, ao: 0 }); hop(b, 0.025, 0.12, 0.006, 0, { p: f.p(0.03, 0.08, 0.022), r: f.r(0.6), mau: 0xe9f8ff, ao: 0 }); // vệt sáng
    for (const [x, y, w, h] of [[0, 0.21, 0.44, 0.05], [0, -0.21, 0.44, 0.05], [0.2, 0, 0.05, 0.44], [-0.2, 0, 0.05, 0.44], [0, 0, 0.025, 0.38], [0, 0, 0.36, 0.025]])
      hop(b, w, h, 0.045, w > 0.03 && h > 0.03 ? 0.015 : 0, { p: f.p(x, y, 0.025), r: f.r(), mau: vien, ao: 0.1 });
    hop(b, 0.5, 0.045, 0.1, 0.015, { p: f.p(0, -0.25, 0.045), r: f.r(), mau: vien, ao: 0.15 });                                       // bệ cửa
  }
}
function veCuaChop(b) { for (const f of O_CUA_SO().slice(0, 2)) for (const sx of [1, -1]) {
  hop(b, 0.15, 0.44, 0.03, 0.012, { p: f.p(sx * 0.3, 0, 0.02), r: f.r(), mau: MG.chop, ao: 0.15 });
  for (let k = -2; k <= 2; k++) hop(b, 0.11, 0.016, 0.012, 0, { p: f.p(sx * 0.3, k * 0.075, 0.038), r: f.r(), mau: 0x6a9e77, ao: 0 });
} }
function veHopHoa(b) { const r = rnd(21); for (const f of O_CUA_SO().slice(0, 2)) {
  hop(b, 0.46, 0.11, 0.13, 0.02, { p: f.p(0, -0.33, 0.08), r: f.r(), mau: 0xa8744c, ao: 0.25 });
  hop(b, 0.42, 0.02, 0.1, 0.01, { p: f.p(0, -0.275, 0.08), r: f.r(), mau: 0x5a4032, ao: 0 });
  for (let i = 0; i < 5; i++) { const [x, y, z] = f.p(-0.17 + i * 0.085, -0.24 + r() * 0.03, 0.08 + (r() - 0.5) * 0.03);
    b.cau(0.04, { p: [x, y - 0.01, z], s: [1, 0.8, 1], mau: MG.la[i % 3], ao: 0.2 }, 1); hoa5(b, x, y + 0.03, z + 0.01, 0.028, MG.hoa[(i * 2 + (f.p(0, 0, 0)[0] > 0 ? 1 : 0)) % 6], 0xffe066, 1); }
  for (const x of [-0.14, 0.02, 0.16]) { const [px, py, pz] = f.p(x, -0.38, 0.15); b.cau(0.03, { p: [px, py, pz], s: [0.8, 1.4, 0.7], mau: MG.la[0], ao: 0.15 }, 1); } // lá rủ
} }
// ----- ống khói (kèm khói bay) -----
function veOngKhoi(b, K) {
  const x = 0.62, z = -0.34, r = rnd(12), yMai = NG.yR - Math.abs(z) * Math.tan(NG.a), yD = NG.yR + 0.3;
  hop(b, 0.28, yD - yMai + 0.15, 0.28, 0.02, { p: [x, (yD + yMai - 0.15) / 2, z], mau: 0xd9cfc1, ao: 0.1 });            // vữa
  for (let k = 0, y = yMai - 0.15; y < yD - 0.02; k++, y += 0.075) hop(b, 0.3 + (k % 2) * 0.012, 0.066, 0.3 + ((k + 1) % 2) * 0.012, 0.015, { p: [x, y + 0.036, z], mau: MG.gach[Math.floor(r() * 3)], ao: 0.25 });
  hop(b, 0.38, 0.06, 0.38, 0.02, { p: [x, yD + 0.03, z], mau: 0xd9d2c5, ao: 0.1 });
  hop(b, 0.2, 0.02, 0.2, 0.008, { p: [x, yD + 0.055, z], mau: 0x2e2626, ao: 0 });
  K.khoi = [x, yD + 0.1, z];
}
// ----- lối vào -----
function veBacThem(b, K) { const z0 = K.zThem;
  hop(b, 0.6, NG.y0 - 0.005, 0.15, 0.02, { p: [0, (NG.y0 - 0.005) / 2, z0 + 0.075], mau: MG.go[0], ao: 0.3 });
  hop(b, 0.68, NG.y0 / 2, 0.16, 0.02, { p: [0, NG.y0 / 4, z0 + 0.225], mau: MG.go[1], ao: 0.3 });
}
const HIEN = { sau: 0.45, xc: 0.44, xE: 0.58, yN: 1.2, bb: 0.42 }; // hiên: sâu · cột · mép mái · đỉnh · dốc
function veHien(b, K) {
  const { y0, D } = NG, { sau, xc, xE, yN, bb } = HIEN, z0 = D / 2, son = K.co('tuong_son'), cot = son ? MG.nep : 0x9c7b5c;
  hop(b, 1.04, y0 - 0.04, sau, 0.02, { p: [0, (y0 - 0.04) / 2, z0 + sau / 2], mau: 0x7a5e48, ao: 0.3 });
  for (let k = 0; k < 4; k++) hop(b, 1.06, 0.045, sau / 4 - 0.01, 0.015, { p: [0, y0 - 0.022, z0 + (k + 0.5) * sau / 4], mau: k % 2 ? 0xc49a70 : 0xb98f66, ao: 0.2 });
  const zc = z0 + sau - 0.06, yE = yN - xc * Math.tan(bb);
  for (const s of [1, -1]) hop(b, 0.065, yE - y0, 0.065, 0.02, { p: [s * xc, y0 + (yE - y0) / 2, zc], mau: cot, ao: 0.15 });
  hop(b, 1.0, 0.06, 0.06, 0.02, { p: [0, yE - 0.03, zc], mau: cot, ao: 0.1 });
  // mái hiên 2 dốc, đầu hồi tam giác nhìn ra trước; đuôi mái chui dưới mép mái chính
  const Lp = xE / Math.cos(bb), tp = 0.05, z1 = 0.7, z2 = z0 + sau + 0.06, dz = z2 - z1, zm = (z1 + z2) / 2, ngoi = K.co('mai_ngoi'), r = rnd(23);
  for (const s of [1, -1]) {
    const n = [s * Math.sin(bb), Math.cos(bb), 0], doc = [s * Math.cos(bb), -Math.sin(bb), 0], diem = (u, h) => [doc[0] * u + n[0] * h, yN + doc[1] * u + n[1] * h, 0];
    const c = diem(Lp / 2, tp / 2);
    hop(b, Lp + 0.04, tp, dz, 0.015, { p: [c[0], c[1], zm], r: [0, 0, -s * bb], mau: ngoi ? MG.ngoiNen : MG.ton[1], ao: 0.15 });
    if (ngoi) { const q = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(new T.Vector3(0, 0, -s), new T.Vector3(...n), new T.Vector3(...doc)));
      for (let k = 0; ; k++) { const u = Lp - 0.06 - k * 0.13; if (u < 0.03) break;
        for (let zz = z1 + 0.14 + (k % 2 ? 0.1 : 0); zz <= z2 - 0.09; zz += 0.2) { const p = diem(u, tp + k * 0.004); ngoiVay(b, r, [p[0], p[1], zz], q, 0.105, 0.085, k); } } }
    else { const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(...doc));
      for (let zz = z1 + 0.18; zz < z2; zz += 0.085) { const p = diem(Lp / 2, tp); b.tru(0.018, 0.018, Lp, { p: [p[0], p[1], zz], q, mau: MG.ton[0], ao: 0.1 }, 6); } }
    if (K.co('diem_mai')) { const p = diem(Lp / 2, tp / 2); hop(b, Lp + 0.06, tp + 0.07, 0.045, 0.015, { p: [p[0], p[1], z2 + 0.01], r: [0, 0, -s * bb], mau: MG.nep, ao: 0.1 }); }
  }
  b.tru(0.05, 0.05, dz, { p: [0, yN + 0.055, zm], r: [Math.PI / 2, 0, 0], mau: ngoi ? 0xc9533f : MG.ton[2], ao: 0.1 }, 8);
  tamGiac(b, 2 * (xE - 0.06), (xE - 0.06) * Math.tan(bb), 0.04, { p: [0, yN - (xE - 0.06) * Math.tan(bb), z2 - 0.05], mau: son ? MG.son[0] : 0xa98c70, ao: 0.15 });
  if (son) b.geo(new T.TorusGeometry(0.045, 0.014, 6, 14), { p: [0, yN - 0.1, z2 - 0.025], mau: MG.nep, ao: 0 });
}
function veDenTuong(b, K, gl) { // cột đèn bên trái lối vào (kính sáng ấm) — đặt ngoài hiên để camera thấy
  const x = -0.5, z = NG.D / 2 + (K.co('hien') ? HIEN.sau : 0) + 0.5, s = MG.sat, y = 0.62;
  b.tru(0.05, 0.066, 0.06, { p: [x, 0.03, z], mau: s, ao: 0.2 }, 8);
  b.tru(0.018, 0.024, y, { p: [x, y / 2, z], mau: s, ao: 0.1 }, 6);
  b.tru(0.045, 0.03, 0.025, { p: [x, y + 0.012, z], mau: s, ao: 0 }, 8);
  gl.geo(hopTron(0.08, 0.1, 0.08, 0.014), { p: [x, y + 0.075, z], mau: 0xffdc7c, ao: 0 });
  for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) hop(b, 0.012, 0.11, 0.012, 0, { p: [x + dx * 0.043, y + 0.075, z + dz * 0.043], mau: s, ao: 0 });
  b.non(0.078, 0.065, { p: [x, y + 0.158, z], r: [0, Math.PI / 4, 0], mau: s, ao: 0 }, 4); b.cau(0.016, { p: [x, y + 0.2, z], mau: MG.dong, ao: 0 }, 1);
  K.sang = true;
}
function veChauCay(b, K) { const r = rnd(15);
  for (const s of [1, -1]) { const x = s * 0.48, z = K.zThem + 0.13;
    b.tru(0.085, 0.064, 0.14, { p: [x, 0.07, z], mau: 0xc9764e, ao: 0.3 }, 12); b.tru(0.097, 0.097, 0.035, { p: [x, 0.145, z], mau: 0xd8845a, ao: 0.1 }, 12);
    bong(b, x, 0.27, z, 0.13, [MG.hoa[0], MG.hoa[1]], 6, r);
  }
}
// ----- sân trước -----
function veLoiDa(b, K) { const r = rnd(16); for (let z = K.zThem + 0.42; z < 2.25; z += 0.27) { const rr = 0.1 + r() * 0.035;
  b.tru(rr, rr * 1.06, 0.035, { p: [(r() - 0.5) * 0.08, 0.018, z], s: [1, 1, 0.85], r: [0, r() * 3, 0], mau: MG.da[Math.floor(r() * 3)], ao: 0.3 }, 10); } }
function veRao(b) {
  const X = 1.18, Z0 = NG.D / 2 + 0.06, Z1 = 2.02, c = MG.rao;
  const coc = (x, z, doc) => { hop(b, doc ? 0.03 : 0.055, 0.26, doc ? 0.055 : 0.03, 0.01, { p: [x, 0.13, z], mau: c, ao: 0.3 });
    b.non(0.045, 0.05, { p: [x, 0.285, z], r: [0, Math.PI / 4, 0], s: doc ? [0.55, 1, 1] : [1, 1, 0.55], mau: c, ao: 0 }, 4); };
  const tru = (x, z) => { hop(b, 0.075, 0.34, 0.075, 0.02, { p: [x, 0.17, z], mau: c, ao: 0.3 }); b.cau(0.048, { p: [x, 0.36, z], mau: c, ao: 0 }, 1); };
  for (const s of [1, -1]) {
    for (let x = s * 0.44; Math.abs(x) < X - 0.05; x += s * 0.13) coc(x, Z1, false);
    for (const y of [0.09, 0.2]) hop(b, X - 0.34, 0.035, 0.022, 0.008, { p: [s * (X + 0.34) / 2, y, Z1 - 0.022], mau: c, ao: 0.1 });
    for (let z = Z0 + 0.08; z < Z1 - 0.05; z += 0.13) coc(s * X, z, true);
    for (const y of [0.09, 0.2]) hop(b, 0.022, 0.035, Z1 - Z0, 0.008, { p: [s * X - s * 0.022, y, (Z0 + Z1) / 2], mau: c, ao: 0.1 });
    tru(s * X, Z1); tru(s * 0.34, Z1); tru(s * X, Z0);
  }
}
function veCongVom(b, K) { // cổng vòm gỗ trắng ở chỗ hở của rào, dây lá quấn + hoa trắng (có hoa hồng leo thì thêm hồng)
  const z = 2.02, R = 0.36, y = 0.64, c = MG.rao, r = rnd(29), hong = K.co('hoa_leo');
  for (const s of [1, -1]) for (const dz of [-0.05, 0.05]) hop(b, 0.05, y, 0.05, 0.015, { p: [s * R, y / 2, z + dz], mau: c, ao: 0.25 });
  for (const dz of [-0.05, 0.05]) b.geo(new T.TorusGeometry(R, 0.026, 6, 22, Math.PI), { p: [0, y, z + dz], mau: c, ao: 0.05 });
  for (let i = 0; i <= 6; i++) { const t = i / 6 * Math.PI; hop(b, 0.03, 0.02, 0.13, 0.006, { p: [Math.cos(t) * R, y + Math.sin(t) * R, z], mau: c, ao: 0 }); }
  for (const s of [1, -1]) for (let k = 0; k < 3; k++) hop(b, 0.03, 0.02, 0.13, 0.006, { p: [s * R, 0.18 + k * 0.17, z], mau: c, ao: 0 });
  for (let i = 0; i < 26; i++) { const t = i / 25 * Math.PI, x = Math.cos(t) * R, yy = y + Math.sin(t) * R, rr = r(); // lá quấn vòm, rủ xuống 2 bên
    b.cau(0.036 + rr * 0.014, { p: [x + (r() - 0.5) * 0.04, yy + (r() - 0.5) * 0.04, z + (r() - 0.5) * 0.08], s: [1, 0.75, 1], r: [r(), r(), 0], mau: MG.la[Math.floor(r() * 3)], ao: 0.15 }, 1);
    if (i % 3 === 1) b.cau(0.024, { p: [x, yy + 0.03, z + 0.06], mau: hong ? [0xff7fa6, 0xffffff, 0xf25f8a][i % 3] : 0xffffff, ao: 0 }, 1); }
  for (const s of [1, -1]) for (let k = 0; k < 5; k++) b.cau(0.03, { p: [s * R + (r() - 0.5) * 0.05, 0.12 + k * 0.12, z + 0.05], s: [1, 0.75, 1], mau: MG.la[k % 3], ao: 0.15 }, 1);
}
// ----- mái nâng cấp -----
function veCuaSoMai(b, K) { // cửa sổ mái (đầu hồi nhỏ nhô ra khỏi mái trước) + ô kính tròn
  const son = K.co('tuong_son'), ngoi = K.co('mai_ngoi'), zf = 0.62, y1 = NG.yR - zf * Math.tan(NG.a) - 0.04, h = 0.34, w = 0.5, bb = 0.63, xE = w / 2 + 0.06, yN = y1 + h + (w / 2) * Math.tan(bb), r = rnd(25);
  const vien = son ? MG.nep : 0xd6bf98;
  hop(b, w, h + 0.1, 0.57, 0.02, { p: [0, y1 - 0.1 + (h + 0.1) / 2, zf - 0.285], mau: son ? MG.son[0] : MG.moc[0], ao: 0.2 });
  tamGiac(b, w, (w / 2) * Math.tan(bb), 0.57, { p: [0, y1 + h, zf - 0.285], mau: son ? MG.son[1] : MG.moc[2], ao: 0.1 });
  const Lp = xE / Math.cos(bb), tp = 0.045, z1 = 0.05, z2 = zf + 0.07, zm = (z1 + z2) / 2;
  for (const s of [1, -1]) {
    const n = [s * Math.sin(bb), Math.cos(bb)], doc = [s * Math.cos(bb), -Math.sin(bb)], c = [doc[0] * Lp / 2 + n[0] * tp / 2, yN + doc[1] * Lp / 2 + n[1] * tp / 2];
    hop(b, Lp + 0.04, tp, z2 - z1, 0.012, { p: [c[0], c[1], zm], r: [0, 0, -s * bb], mau: ngoi ? MG.ngoi[0] : MG.ton[0], ao: 0.15 });
    if (K.co('diem_mai')) hop(b, Lp + 0.05, tp + 0.05, 0.035, 0.012, { p: [c[0], c[1], z2 + 0.01], r: [0, 0, -s * bb], mau: MG.nep, ao: 0.1 });
  }
  b.tru(0.035, 0.035, z2 - z1, { p: [0, yN + 0.04, zm], r: [Math.PI / 2, 0, 0], mau: ngoi ? 0xc9533f : MG.ton[2], ao: 0.1 }, 8);
  b.tru(0.1, 0.1, 0.02, { p: [0, y1 + 0.15, zf + 0.01], r: [Math.PI / 2, 0, 0], mau: MG.kinh, ao: 0 }, 16);
  b.geo(new T.TorusGeometry(0.105, 0.022, 6, 18), { p: [0, y1 + 0.15, zf + 0.02], mau: vien, ao: 0 });
  hop(b, 0.2, 0.016, 0.014, 0, { p: [0, y1 + 0.15, zf + 0.024], mau: vien, ao: 0 }); hop(b, 0.016, 0.2, 0.014, 0, { p: [0, y1 + 0.15, zf + 0.024], mau: vien, ao: 0 });
  hop(b, 0.05, 0.1, 0.006, 0, { p: [-0.035, y1 + 0.18, zf + 0.022], r: [0, 0, 0.6], mau: 0xe9f8ff, ao: 0 });
}
function veChongChong(b, K) { // chong chóng gió hình gà trống trên nóc — phần trên xoay theo gió
  const x = -0.62, y = NG.yR + 0.12, s = MG.sat, vang = 0xe8b84a;
  b.tru(0.013, 0.018, 0.42, { p: [x, y + 0.21, 0], mau: s, ao: 0.1 }, 6);
  b.cau(0.034, { p: [x, y + 0.22, 0], mau: vang, ao: 0 }, 1);
  for (const r of [[0, 0, Math.PI / 2], [Math.PI / 2, 0, 0]]) b.tru(0.007, 0.007, 0.28, { p: [x, y + 0.14, 0], r, mau: s, ao: 0 }, 4);
  for (const [dx, dz] of [[0.14, 0], [-0.14, 0], [0, 0.14], [0, -0.14]]) b.cau(0.016, { p: [x + dx, y + 0.14, dz], mau: vang, ao: 0 }, 0);
  const q = boMin(), mg = 0.35; // mũi tên + gà trống dẹt (như tấm tôn cắt hình)
  q.tru(0.008, 0.008, 0.36, { r: [Math.PI / 2, 0, 0], mau: s, ao: 0 }, 4);
  q.non(0.026, 0.07, { p: [0, 0, 0.2], r: [Math.PI / 2, 0, 0], mau: vang, ao: 0 }, 4);
  hop(q, 0.006, 0.07, 0.08, 0.003, { p: [0, 0, -0.17], mau: vang, ao: 0 });
  q.cau(0.055, { p: [0, 0.075, 0], s: [mg, 0.8, 1.1], mau: vang, ao: 0.1 }, 2);
  q.cau(0.03, { p: [0, 0.13, 0.05], s: [mg * 1.4, 1, 1], mau: vang, ao: 0.1 }, 2);
  q.cau(0.02, { p: [0, 0.165, 0.05], s: [mg * 1.2, 1, 1.3], mau: 0xe0503c, ao: 0 }, 1);
  q.non(0.012, 0.03, { p: [0, 0.128, 0.09], r: [Math.PI / 2, 0, 0], mau: 0xf08a24, ao: 0 }, 4);
  for (let i = 0; i < 3; i++) q.cau(0.04, { p: [0, 0.1 + i * 0.03, -0.06 - i * 0.012], s: [mg * 0.5, 1.3, 0.55], r: [-0.5 - i * 0.35, 0, 0], mau: i % 2 ? 0xd9a53c : vang, ao: 0 }, 1);
  const g = new T.Group(); g.position.set(x, y + 0.42, 0); g.add(q.xong()); K.g.add(g);
  K.dong.push(tg => { g.rotation.y = Math.sin(tg * 0.23) * 1.1 + Math.sin(tg * 0.71) * 0.25; });
}
function veHoaLeo(b, K) { // hoa hồng leo: quấn 2 cột hiên + vắt ngang xà (không có hiên thì leo góc tường trái)
  const r = rnd(18), hong = [0xff7fa6, 0xff9dbb, 0xf25f8a];
  const la1 = (x, y, z) => { b.cau(0.034 + r() * 0.014, { p: [x, y, z], s: [1, 0.7, 1], r: [r(), r(), 0], mau: MG.la[Math.floor(r() * 3)], ao: 0.15 }, 1);
    if (r() < 0.4) { const c = hong[Math.floor(r() * 3)]; b.cau(0.032, { p: [x + (r() - 0.5) * 0.03, y + 0.02, z + 0.025], mau: c, ao: 0 }, 1); b.cau(0.017, { p: [x, y + 0.03, z + 0.05], mau: 0xffc6d8, ao: 0 }, 0); } };
  const leo = (x, z, ya, yb, bk) => { for (let t = 0; t <= 1; t += 0.05) { const a = t * 17 + r() * 0.8; la1(x + Math.cos(a) * bk, ya + (yb - ya) * t, z + Math.sin(a) * bk); } };
  if (K.co('hien')) { const zc = NG.D / 2 + HIEN.sau - 0.06, yE = HIEN.yN - HIEN.xc * Math.tan(HIEN.bb);
    for (const s of [1, -1]) leo(s * HIEN.xc, zc, 0.12, yE, 0.05);
    for (let x = -HIEN.xc; x <= HIEN.xc; x += 0.07) la1(x, yE - 0.02 - 0.06 * Math.cos(x / HIEN.xc * Math.PI / 2) * (r() < 0.5 ? 1 : 0.4), zc + 0.05); }
  else leo(-0.98, NG.D / 2 + 0.04, 0.1, NG.yT - 0.1, 0.05);
}
// ----- hoàn thiện -----
function veDenDay(b, K, gl) { // dây đèn màu võng dưới mép mái trước (+ 2 cạnh mái hiên nếu có)
  const y = NG.yT - NG.ov * Math.tan(NG.a) - 0.07, z = NG.D / 2 + NG.ov + 0.01, mau = [0xffd84a, 0xff7fa6, 0x7fe3ff, 0x9dff7a, 0xffa94a];
  const doan = [];
  if (K.co('hien')) { doan.push([-1.12, -0.64, 2], [0.64, 1.12, 2]);
    const { yN, xE, bb } = HIEN, z2 = NG.D / 2 + HIEN.sau + 0.08;
    for (const s of [1, -1]) doan.push({ a: [0, yN - 0.03, z2], b: [s * (xE - 0.04), yN - 0.03 - (xE - 0.04) * Math.tan(bb), z2], n: 5 }); }
  else doan.push([-1.12, 1.12, 6]);
  let i = 0;
  const day = (A, B, vong, n) => { let prev = A;
    for (let k = 1; k <= 12; k++) { const t = k / 12, p = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t - vong * Math.sin(Math.PI * t), A[2] + (B[2] - A[2]) * t];
      const dx = p[0] - prev[0], dy = p[1] - prev[1], dz = p[2] - prev[2], len = Math.hypot(dx, dy, dz);
      b.tru(0.005, 0.005, len, { p: [(p[0] + prev[0]) / 2, (p[1] + prev[1]) / 2, (p[2] + prev[2]) / 2], q: new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(dx, dy, dz).normalize()), mau: 0x3a3a3a, ao: 0 }, 3); prev = p; }
    for (let k = 0; k < n; k++) { const t = (k + 0.5) / n, p = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t - vong * Math.sin(Math.PI * t), A[2] + (B[2] - A[2]) * t];
      b.tru(0.009, 0.009, 0.02, { p: [p[0], p[1] - 0.012, p[2]], mau: 0x3a3a3a, ao: 0 }, 5); gl.cau(0.024, { p: [p[0], p[1] - 0.04, p[2]], s: [1, 1.25, 1], mau: mau[i++ % 5], ao: 0 }, 1); } };
  for (const d of doan) { if (Array.isArray(d)) { const [x0, x1, soVong] = d, w = (x1 - x0) / soVong; for (let v = 0; v < soVong; v++) day([x0 + v * w, y, z], [x0 + (v + 1) * w, y, z], 0.07, 3); }
    else day(d.a, d.b, 0.025, d.n); }
  K.sang = true;
}
function veGheBang(b) { const x = 0.87, z = 1.42, go = MG.go[0];
  hop(b, 0.52, 0.035, 0.17, 0.012, { p: [x, 0.2, z], mau: go, ao: 0.2 });
  hop(b, 0.52, 0.13, 0.03, 0.012, { p: [x, 0.33, z - 0.075], r: [-0.12, 0, 0], mau: go, ao: 0.2 });
  for (const sx of [1, -1]) for (const sz of [1, -1]) hop(b, 0.035, 0.2, 0.035, 0.008, { p: [x + sx * 0.22, 0.1, z + sz * 0.06], mau: MG.go[1], ao: 0.3 });
  for (const sx of [1, -1]) hop(b, 0.035, 0.035, 0.17, 0.01, { p: [x + sx * 0.25, 0.27, z], mau: MG.go[1], ao: 0.1 });
}
function veLuongHoa(b) { const r = rnd(27);
  for (const s of [1, -1]) { const x = s * 0.78, z = NG.D / 2 + 0.15;
    hop(b, 0.5, 0.06, 0.16, 0.025, { p: [x, 0.03, z], mau: 0x6e4f3a, ao: 0.2 });
    for (let i = 0; i < 4; i++) { const px = x - 0.18 + i * 0.12, pz = z + (r() - 0.5) * 0.05, c = MG.hoa[(i + (s > 0 ? 2 : 0)) % 6];
      b.cau(0.05, { p: [px, 0.08, pz], s: [1, 0.75, 1], mau: MG.la[i % 3], ao: 0.25 }, 1);
      const [tx, ty, tz] = than(b, px, 0.08, pz, r() * 6, 1.35, 0.1 + r() * 0.05, 0.006, XANH_C, 4); hoa5(b, tx, ty, tz, 0.032, c, 0xffe066, 1); }
  }
}
// ----- danh mục kiểu nhà -----
const KIEU_NHA = {
  go: { ten: 'Nhà gỗ đồng quê',
    muc: [ // mỗi mức: các món MỚI rơi thêm (món cùng ô thay món cũ) — mức k = cộng dồn mức 1..k
      ['nen_van', 'vach_moc', 'mai_ton', 'cua_van', 'o_chan_song'],
      ['bac_them', 'cua_so_kinh'],
      ['ong_khoi', 'nen_da'],
      ['mai_ngoi', 'diem_mai'],
      ['tuong_son', 'cua_xanh'],
      ['hien', 'den_tuong'],
      ['cua_chop', 'hop_hoa', 'chau_cay'],
      ['loi_da', 'rao_trang', 'cong_vom'],
      ['cua_so_mai', 'chong_chong', 'hoa_leo'],
      ['den_day', 'ghe_bang', 'luong_hoa'],
    ],
    mon: {
      nen_van: { ten: 'Nền ván kê', o: 'nen', ve: b => veNen(b, null, false) },
      vach_moc: { ten: 'Vách ván mộc', o: 'tuong', ve: (b, K) => veTuong(b, K, false) },
      mai_ton: { ten: 'Mái tôn cũ', o: 'mai', ve: veMaiTon },
      cua_van: { ten: 'Cửa ván', o: 'cua', ve: veCuaVan },
      o_chan_song: { ten: 'Ô cửa chấn song', o: 'cua_so', ve: veChanSong },
      bac_them: { ten: 'Bậc thềm gỗ', ve: veBacThem },
      cua_so_kinh: { ten: 'Cửa sổ kính', o: 'cua_so', ve: veCuaSoKinh },
      ong_khoi: { ten: 'Ống khói gạch', ve: veOngKhoi },
      nen_da: { ten: 'Chân tường đá', o: 'nen', ve: b => veNen(b, null, true) },
      mai_ngoi: { ten: 'Mái ngói đỏ', o: 'mai', ve: veMaiNgoi },
      diem_mai: { ten: 'Diềm mái trắng', ve: veDiem },
      tuong_son: { ten: 'Tường sơn kem', o: 'tuong', ve: (b, K) => veTuong(b, K, true) },
      cua_xanh: { ten: 'Cửa vòm xanh', o: 'cua', ve: veCuaXanh },
      hien: { ten: 'Hiên nhà', ve: veHien },
      den_tuong: { ten: 'Cột đèn', ve: veDenTuong },
      cua_chop: { ten: 'Cánh cửa chớp', ve: veCuaChop },
      hop_hoa: { ten: 'Hộp hoa cửa sổ', ve: veHopHoa },
      chau_cay: { ten: 'Chậu cây', ve: veChauCay },
      loi_da: { ten: 'Lối đi đá', ve: veLoiDa },
      rao_trang: { ten: 'Hàng rào trắng', ve: veRao },
      cong_vom: { ten: 'Cổng vòm hoa', ve: veCongVom },
      cua_so_mai: { ten: 'Cửa sổ mái', ve: veCuaSoMai },
      chong_chong: { ten: 'Chong chóng gà', ve: veChongChong },
      hoa_leo: { ten: 'Hoa hồng leo', ve: veHoaLeo },
      den_day: { ten: 'Dây đèn', ve: veDenDay },
      ghe_bang: { ten: 'Ghế băng', ve: veGheBang },
      luong_hoa: { ten: 'Luống hoa', ve: veLuongHoa },
    },
  },
};
// ---------- 4i. 3 KIỂU NHÀ THEO NỀN VĂN HOÁ: VIỆT (nhà ba gian Bắc Bộ) · NHẬT (nhà gỗ) · HY LẠP (nhà trắng đảo Cyclades) ----------
// Cùng luật với nhà gỗ đồng quê: 10 mức, mức sau = mức trước + vài món, món cùng ô thay món cũ. Cùng khung: mặt tiền +z,
// thân nhà quanh gốc, sân trước tới z ≈ 2,15, bề ngang trong ±1,45 (vừa chỗ đặt nhà trong game).
const _Y = new T.Vector3(0, 1, 0);
function ong(b, A, B, r, mau, o) { // trụ nối 2 điểm · o: { r2 = bán kính đầu B, doan, ao }
  o = o || {}; const d = new T.Vector3(B[0] - A[0], B[1] - A[1], B[2] - A[2]), len = d.length(); d.multiplyScalar(1 / len);
  b.tru(o.r2 == null ? r : o.r2, r, len, { p: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2], q: new T.Quaternion().setFromUnitVectors(_Y, d), mau, ao: o.ao == null ? 0.1 : o.ao }, o.doan || 6);
}
function tre(b, A, B, r, mau) { // cây tre: ống + đốt sẫm
  const c = mau || 0xa9b85a, d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], len = Math.hypot(d[0], d[1], d[2]), n = Math.max(1, Math.round(len / 0.17)), e = 0.008 / len;
  ong(b, A, B, r, c);
  for (let k = 1; k < n; k++) { const t = k / n, p = [A[0] + d[0] * t, A[1] + d[1] * t, A[2] + d[2] * t];
    ong(b, [p[0] - d[0] * e, p[1] - d[1] * e, p[2] - d[2] * e], [p[0] + d[0] * e, p[1] + d[1] * e, p[2] + d[2] * e], r * 1.2, toiMau(c, 0.8), { ao: 0 }); }
}
function tien(b, pts, o) { b.geo(new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(r, y)), o.doan || 12), o); } // khối tiện: chum, vại, chậu
const doc2 = (yR, a, z0) => (x, u, h, sau) => { const s = sau ? -1 : 1; return [x, yR - u * Math.sin(a) + h * Math.cos(a), (z0 || 0) + s * (u * Math.cos(a) + h * Math.sin(a))]; };
function maiHai(b, M, mau, t) { for (const sau of [0, 1]) { const L = M.L[sau]; hop(b, M.rong, t, L + 0.04, 0.02, { p: M.tren(0, (L - 0.04) / 2, t / 2, sau), r: [(sau ? -1 : 1) * M.a, 0, 0], mau, ao: 0.15 }); } }
const VAY_NHO = new T.SphereGeometry(1, 7, 2, 0, Math.PI * 2, 0, Math.PI / 2);
function hangVay(b, M, t, soVien, buocU, sz, mau, r, reu) { // lợp ngói vảy theo hàng, hàng trên đè hàng dưới
  const e = new T.Euler(), q = new T.Quaternion(), sp = M.rong / soVien;
  for (const sau of [0, 1]) { const L = M.L[sau]; q.setFromEuler(e.set((sau ? -1 : 1) * M.a, 0, 0));
    for (let k = 0; ; k++) { const u = L - sz * 0.8 - k * buocU; if (u < 0.02) break; const h = t + k * 0.003;
      const vien = (x, sx) => b.geo(VAY_NHO.clone(), { p: M.tren(x, u, h, sau), q, s: [sx, 0.028, sz], mau: reu && r() < reu ? 0x8f7a4e : mau[Math.floor(r() * mau.length)], ao: 0.3 });
      if (k % 2) { for (let i = 1; i < soVien; i++) vien(-M.rong / 2 + i * sp, sp * 0.53); for (const s of [1, -1]) vien(s * (M.rong / 2 - sp * 0.26), sp * 0.28); }
      else for (let i = 0; i < soVien; i++) vien(-M.rong / 2 + (i + 0.5) * sp, sp * 0.53); } }
}

// ===================== NHÀ VIỆT — nhà ba gian Bắc Bộ =====================
const NV = { W: 2.3, D: 1.3, y0: 0.14, H: 1.02, R: 0.62, ovT: 0.18, ovS: 0.14, ovX: 0.12 };
NV.yT = NV.y0 + NV.H; NV.yR = NV.yT + NV.R; NV.a = Math.atan2(NV.R, NV.D / 2); NV.rong = NV.W + 2 * NV.ovX;
NV.M = { rong: NV.rong, a: NV.a, tren: doc2(NV.yR, NV.a), L: [(NV.D / 2 + NV.ovT) / Math.cos(NV.a), (NV.D / 2 + NV.ovS) / Math.cos(NV.a)] };
const COT_V = [-1.1, -0.44, 0.44, 1.1], Z_COT_V = NV.D / 2 + 0.11, Y_XA_V = NV.yT - 0.11 * Math.tan(NV.a) - 0.02; // cột hiên: gian giữa ±0,44
function veNenV(b) { hop(b, NV.W + 0.3, NV.y0, NV.D + 0.42, 0.04, { p: [0, NV.y0 / 2, 0.06], mau: 0x9a7856, ao: 0.3 }, 6); } // nền đất nện lấn ra làm hiên
function veTuongV(b, K, voi) {
  const { W, D, y0, H, yT, R } = NV;
  const mau = voi ? (x, y, z) => (nhieu3(x * 5, y * 5, z * 5) > 0.64 ? 0xeac664 : 0xf4d57a) : (x, y, z) => (nhieu3(x * 6 + 3, y * 6, z * 6) > 0.58 ? 0xa98865 : 0xbd9e78);
  hop(b, W, H, D, 0.04, { p: [0, y0 + H / 2, 0], mau: 0, mauHam: mau, ao: 0.18 }, 10);
  tamGiac(b, D - 0.02, R - 0.02, W - 0.02, { p: [0, yT - 0.001, 0], mau: 0, mauHam: mau, ao: 0.06 }, true);
  if (!voi) { // vách đất: rơm lẫn trong đất + cột tre góc
    const r = rnd(31);
    for (let i = 0; i < 50; i++) { const mat = r() < 0.6, x = mat ? (r() - 0.5) * (W - 0.1) : W / 2 + 0.004, z = mat ? D / 2 + 0.004 : (r() - 0.5) * (D - 0.1), y = y0 + 0.08 + r() * (H - 0.16);
      hop(b, mat ? 0.05 : 0.004, 0.006, mat ? 0.004 : 0.05, 0, { p: [x, y, z], r: mat ? [0, 0, (r() - 0.5) * 2] : [(r() - 0.5) * 2, 0, 0], mau: 0xdcc58e, ao: 0 }); }
    for (const sx of [1, -1]) for (const sz of [1, -1]) tre(b, [sx * W / 2, y0, sz * D / 2], [sx * W / 2, yT + 0.02, sz * D / 2], 0.045, 0x8f7448);
    return;
  }
  hop(b, W + 0.03, 0.15, D + 0.03, 0.03, { p: [0, y0 + 0.075, 0], mau: 0xd9d2c2, ao: 0.2 });                             // chân tường
  for (const sx of [1, -1]) for (const sz of [1, -1]) hop(b, 0.13, H, 0.13, 0.03, { p: [sx * W / 2, y0 + H / 2, sz * D / 2], mau: 0xf7df94, ao: 0.12 }); // trụ góc
  for (const x of [-0.44, 0.44]) hop(b, 0.08, H, 0.03, 0.01, { p: [x, y0 + H / 2, D / 2 + 0.01], mau: 0xf7df94, ao: 0.1 });   // chia gian
}
function veMaiTranh(b) { // mái tranh dày 3 lớp, mép mỗi lớp là 1 bó tròn · cặp tranh bắt chéo trên nóc
  const M = NV.M, t = 0.12, r = rnd(33), rom = [0xc8ad74, 0xbba066, 0xcfb47c];
  for (const sau of [0, 1]) { const s = sau ? -1 : 1, L = M.L[sau];
    for (let k = 0; k < 3; k++) { const u0 = L * k / 3 - 0.04, u1 = L * (k + 1) / 3 + 0.02, h = (2 - k) * 0.014;
      hop(b, M.rong + 0.04, t, u1 - u0, 0.03, { p: M.tren(0, (u0 + u1) / 2, t / 2 + h, sau), r: [s * M.a, 0, 0], mau: rom[k], ao: 0.2 });
      b.tru(t * 0.6, t * 0.6, M.rong + 0.07, { p: M.tren(0, u1 - 0.04, t * 0.52 + h, sau), r: [0, 0, Math.PI / 2], mau: toiMau(rom[k], 0.94), ao: 0.15 }, 10);
      for (let x = -M.rong / 2 + 0.04; x < M.rong / 2; x += 0.07) ong(b, M.tren(x, u0 + 0.02, t + h + 0.004, sau), M.tren(x + (r() - 0.5) * 0.02, u1 - 0.07, t + h + 0.004, sau), 0.007, toiMau(rom[k], 0.84), { doan: 3, ao: 0 }); } // thớ rơm
    for (let i = 0; i < 34; i++) hop(b, 0.012, 0.005, 0.08, 0, { p: M.tren(-M.rong / 2 + 0.05 + r() * (M.rong - 0.1), L + 0.02, t * 0.45, sau), r: [s * M.a + (r() - 0.5) * 0.5, (r() - 0.5) * 0.7, 0], mau: 0xd8c492, ao: 0 });
  }
  const y = NV.yR + 0.14; b.tru(0.1, 0.1, M.rong + 0.02, { p: [0, y, 0], r: [0, 0, Math.PI / 2], mau: 0xa88c56, ao: 0.15 }, 10);
  for (let x = -1.05; x <= 1.06; x += 0.42) for (const s of [1, -1]) ong(b, [x, y - 0.12, s * 0.3], [x, y + 0.2, -s * 0.1], 0.013, 0x7a6a3a);
}
function veMaiNgoiTa(b) { const M = NV.M; maiHai(b, M, 0x8f4431, 0.06); hangVay(b, M, 0.06, 17, 0.1, 0.068, [0xb05a42, 0xa2513c, 0xba6750, 0xa95842], rnd(35), 0.025); }
function veBoNoc(b) { // bờ nóc trát vữa + 2 đầu kìm cong + bầu giữa
  const { yR, rong } = NV, y = yR + 0.07, v = 0xe3ddcf;
  hop(b, rong - 0.12, 0.13, 0.15, 0.03, { p: [0, y, 0], mau: v, ao: 0.15 });
  hop(b, rong - 0.08, 0.04, 0.19, 0.015, { p: [0, y + 0.08, 0], mau: 0x9c4a35, ao: 0.1 });
  for (const s of [1, -1]) { b.geo(new T.TorusGeometry(0.09, 0.038, 6, 12, Math.PI * 1.25), { p: [s * (rong / 2 - 0.1), y + 0.14, 0], r: [0, s > 0 ? 0 : Math.PI, -Math.PI / 4], mau: v, ao: 0.05 });
    b.cau(0.04, { p: [s * (rong / 2 - 0.2), y + 0.1, 0], mau: v, ao: 0 }, 1); }
  b.cau(0.065, { p: [0, y + 0.15, 0], s: [1, 1.25, 1], mau: v, ao: 0 }, 2); b.cau(0.03, { p: [0, y + 0.25, 0], mau: v, ao: 0 }, 1);
}
function veCuaPhen(b) { // cửa phên tre đan nong mốt
  const { y0, D } = NV, z = D / 2 + 0.02, w = 0.46, h = 0.62;
  hop(b, w + 0.04, h + 0.04, 0.02, 0, { p: [0, y0 + h / 2, z - 0.01], mau: 0x3a2e24, ao: 0 });
  for (let i = 0; i < 6; i++) for (let j = 0; j < 8; j++) { const ngang = (i + j) % 2;
    hop(b, w / 6 - 0.008, h / 8 - 0.008, 0.02, 0, { p: [-w / 2 + (i + 0.5) * w / 6, y0 + (j + 0.5) * h / 8, z + (ngang ? 0.006 : 0)], mau: ngang ? 0xcbb070 : 0xb59a5a, ao: 0.08 }); }
  for (const sx of [1, -1]) tre(b, [sx * (w / 2 + 0.03), y0, z + 0.02], [sx * (w / 2 + 0.03), y0 + h + 0.06, z + 0.02], 0.022, 0x9a8a48);
  tre(b, [-w / 2 - 0.07, y0 + h + 0.03, z + 0.02], [w / 2 + 0.07, y0 + h + 0.03, z + 0.02], 0.022, 0x9a8a48);
}
function veSongTre(b) { for (const x of [-0.8, 0.8]) { const z = NV.D / 2 + 0.02, y = NV.y0 + 0.5;
  hop(b, 0.34, 0.26, 0.02, 0, { p: [x, y, z - 0.008], mau: 0x2e261f, ao: 0 });
  for (let i = 0; i < 5; i++) ong(b, [x - 0.14 + i * 0.07, y - 0.13, z + 0.01], [x - 0.14 + i * 0.07, y + 0.13, z + 0.01], 0.012, 0xb0a058);
  for (const dy of [-0.15, 0.15]) tre(b, [x - 0.21, y + dy, z + 0.02], [x + 0.21, y + dy, z + 0.02], 0.018, 0x9a8a48); } }
function veCuaBang(b) { // cửa bức bàn 4 cánh: trên song, dưới pa-nô, có ngưỡng cửa
  const { y0, D } = NV, z = D / 2 + 0.02, w = 0.76, h = 0.62, go = 0x7a3b25, goS = 0x5e2c1c;
  hop(b, w + 0.08, 0.06, 0.06, 0.015, { p: [0, y0 + 0.03, z + 0.01], mau: goS, ao: 0.2 });
  hop(b, w + 0.12, 0.07, 0.06, 0.015, { p: [0, y0 + h + 0.035, z + 0.005], mau: goS, ao: 0.1 });
  for (const sx of [1, -1]) hop(b, 0.06, h, 0.06, 0.015, { p: [sx * (w / 2 + 0.03), y0 + h / 2, z + 0.005], mau: goS, ao: 0.15 });
  for (let i = 0; i < 4; i++) { const x = -w / 2 + (i + 0.5) * w / 4, lw = w / 4 - 0.012, ow = lw - 0.05;
    hop(b, lw, h - 0.06, 0.03, 0.008, { p: [x, y0 + 0.06 + (h - 0.06) / 2, z], mau: go, ao: 0.15 });
    hop(b, ow, 0.2, 0.012, 0.004, { p: [x, y0 + 0.18, z + 0.018], mau: 0x8a4630, ao: 0.1 });
    hop(b, ow, 0.26, 0.012, 0, { p: [x, y0 + 0.46, z + 0.012], mau: 0x2a1a12, ao: 0 });
    for (let k = 0; k < 4; k++) hop(b, 0.012, 0.26, 0.016, 0, { p: [x - ow / 2 + (k + 0.5) * ow / 4, y0 + 0.46, z + 0.02], mau: go, ao: 0 }); }
}
function veCuaSoTien(b) { // cửa sổ song tiện + ô thoáng tròn ở hồi
  const go = 0x7a3b25, goS = 0x5e2c1c;
  for (const x of [-0.8, 0.8]) { const z = NV.D / 2 + 0.02, y = NV.y0 + 0.5;
    hop(b, 0.34, 0.28, 0.02, 0, { p: [x, y, z - 0.006], mau: 0x2a1a12, ao: 0 });
    for (let i = 0; i < 6; i++) { const xx = x - 0.14 + i * 0.056; b.tru(0.01, 0.01, 0.28, { p: [xx, y, z + 0.01], mau: go, ao: 0 }, 6); b.cau(0.017, { p: [xx, y, z + 0.01], s: [1, 1.6, 1], mau: go, ao: 0 }, 1); }
    for (const dy of [-0.16, 0.16]) hop(b, 0.46, 0.05, 0.05, 0.015, { p: [x, y + dy, z + 0.01], mau: goS, ao: 0.15 });
    for (const sx of [1, -1]) hop(b, 0.05, 0.37, 0.05, 0.015, { p: [x + sx * 0.2, y, z + 0.01], mau: goS, ao: 0.15 }); }
  const gx = NV.W / 2 + 0.01, gy = NV.yT + 0.2;
  b.geo(new T.TorusGeometry(0.09, 0.022, 6, 16).rotateY(Math.PI / 2), { p: [gx, gy, 0], mau: goS, ao: 0 });
  b.tru(0.08, 0.08, 0.02, { p: [gx - 0.005, gy, 0], r: [0, 0, Math.PI / 2], mau: 0x2a1a12, ao: 0 }, 12);
  for (const r of [[0, 0, 0], [Math.PI / 2, 0, 0]]) hop(b, 0.012, 0.16, 0.012, 0, { p: [gx + 0.005, gy, 0], r, mau: goS, ao: 0 });
}
function veHienTre(b) { for (const x of COT_V) tre(b, [x, NV.y0, Z_COT_V], [x, Y_XA_V, Z_COT_V], 0.035, 0x9aa24e);
  tre(b, [COT_V[0] - 0.08, Y_XA_V - 0.03, Z_COT_V], [COT_V[3] + 0.08, Y_XA_V - 0.03, Z_COT_V], 0.03, 0x9aa24e); }
function veHienGo(b) { for (const x of COT_V) { // cột gỗ tròn trên chân tảng đá
    hop(b, 0.13, 0.05, 0.13, 0.015, { p: [x, NV.y0 + 0.025, Z_COT_V], mau: 0xa9a293, ao: 0.2 });
    b.tru(0.052, 0.056, 0.035, { p: [x, NV.y0 + 0.065, Z_COT_V], mau: 0xbab4a6, ao: 0.1 }, 10);
    b.tru(0.037, 0.043, Y_XA_V - NV.y0 - 0.08, { p: [x, (Y_XA_V + NV.y0 + 0.08) / 2, Z_COT_V], mau: 0x8a4a2e, ao: 0.12 }, 10); }
  hop(b, 2.36, 0.07, 0.07, 0.02, { p: [0, Y_XA_V - 0.035, Z_COT_V], mau: 0x6e3a24, ao: 0.1 }); }
function veChong(b) { // chõng tre
  const x0 = -0.95, z0 = 1.5, w = 0.62, d = 0.36, h = 0.22, c = 0xb9a75e;
  for (const sx of [1, -1]) for (const sz of [1, -1]) tre(b, [x0 + sx * w / 2, 0, z0 + sz * d / 2], [x0 + sx * w / 2, h, z0 + sz * d / 2], 0.022, c);
  for (const sz of [1, -1]) tre(b, [x0 - w / 2 - 0.03, h - 0.02, z0 + sz * d / 2], [x0 + w / 2 + 0.03, h - 0.02, z0 + sz * d / 2], 0.022, c);
  for (let i = 0; i < 9; i++) { const z = z0 - d / 2 + 0.02 + i * (d - 0.04) / 8; ong(b, [x0 - w / 2, h + 0.012, z], [x0 + w / 2, h + 0.012, z], 0.014, i % 2 ? 0xc8b46a : 0xbba55c, { doan: 5, ao: 0.05 }); }
}
function chum(b, x, z, k, men) { // chum sành: phình bụng, miệng loe, nước tối bên trong
  tien(b, [[0.001, 0], [0.09, 0.01], [0.14, 0.1], [0.15, 0.17], [0.12, 0.26], [0.095, 0.29], [0.105, 0.31], [0.09, 0.305]].map(([r, y]) => [r * k, y * k]), { p: [x, 0, z], mau: men, ao: 0.3, doan: 14 });
  b.tru(0.09 * k, 0.09 * k, 0.004, { p: [x, 0.3 * k, z], mau: 0x2f3a40, ao: 0 }, 14);
}
function veChum(b) { chum(b, 0.95, 1.05, 1, 0x7a4a30); chum(b, 1.22, 1.24, 0.82, 0x6e4a34);
  b.tru(0.11, 0.11, 0.025, { p: [0.95, 0.325, 1.05], mau: 0x9a7a52, ao: 0.1 }, 14);                                            // nắp gỗ
  b.geo(new T.SphereGeometry(0.05, 10, 4, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), { p: [0.93, 0.39, 1.05], mau: 0x6b4a2a, ao: 0.1 }); // gáo dừa
  ong(b, [0.93, 0.36, 1.05], [1.05, 0.34, 1.12], 0.008, 0x8a6a3a); }
function veDongRom(b) { const x = 0.98, z = 1.68, r = rnd(39);
  tien(b, [[0.001, 0], [0.28, 0.02], [0.31, 0.18], [0.27, 0.4], [0.18, 0.56], [0.07, 0.66], [0.001, 0.68]], { p: [x, 0, z], mau: 0, mauHam: (xx, yy, zz) => (nhieu3(xx * 16, yy * 4, zz * 16) > 0.55 ? 0xb49a62 : 0xc9b27c), ao: 0.25, doan: 18 });
  ong(b, [x, 0.55, z], [x + 0.02, 0.92, z], 0.018, 0x7a5a3a);
  for (let i = 0; i < 24; i++) { const a = r() * 6.28, yy = 0.08 + r() * 0.5, rr = 0.3 * (1 - yy / 0.75); hop(b, 0.01, 0.005, 0.09, 0, { p: [x + Math.cos(a) * rr, yy, z + Math.sin(a) * rr], r: [r() - 0.5, -a + Math.PI / 2, 0], mau: 0xd6c290, ao: 0 }); }
}
function veBacGach(b) { const r = rnd(37), zf = 0.9;
  for (let x = -1.3; x < 1.29; x += 0.2) hop(b, 0.19, NV.y0 + 0.012, 0.06, 0, { p: [x + 0.1, (NV.y0 + 0.012) / 2, zf], mau: [0xb8583e, 0xa94f38][Math.floor(r() * 2)], ao: 0.2 }); // bó hiên gạch
  hop(b, 0.92, NV.y0 * 0.5, 0.16, 0.015, { p: [0, NV.y0 * 0.25, zf + 0.11], mau: 0xb05840, ao: 0.25 }); }
function veSanGach(b) { const r = rnd(41), mau = [0xb46c56, 0xa6624e, 0xbd7862];
  for (let i = 0; i < 13; i++) for (let j = 0; j < 6; j++) hop(b, 0.19, 0.022, 0.18, 0, { p: [-1.3 + (i + 0.5) * 0.2, 0.011, 1.02 + (j + 0.5) * 0.19], mau: mau[Math.floor(r() * 3)], ao: 0.1 }); }
function bonsai(b, x, y0, z) { let p = [x, y0, z];
  for (const [dx, dy, dz] of [[0.05, 0.12, 0], [-0.07, 0.1, 0.02], [0.05, 0.09, -0.01]]) { const q = [p[0] + dx, p[1] + dy, p[2] + dz]; ong(b, p, q, 0.02, 0x6b4a32); p = q; }
  for (const [dx, dy, dz, r] of [[0.1, 0.16, 0, 0.1], [-0.09, 0.24, 0.02, 0.09], [0.04, 0.33, 0, 0.08]]) { b.cau(r, { p: [x + dx, y0 + dy, z + dz], s: [1, 0.42, 0.85], mau: 0x4f8a3a, ao: 0.2 }, 1); b.cau(r * 0.7, { p: [x + dx, y0 + dy + 0.02, z + dz], s: [1, 0.35, 0.8], mau: 0x6fa84a, ao: 0 }, 1); }
}
function veChauCanh(b) { for (const x of [-0.62, 0.6]) { const z = 1.12;
  tien(b, [[0.001, 0], [0.085, 0], [0.105, 0.04], [0.118, 0.07], [0.128, 0.1], [0.14, 0.13], [0.13, 0.14], [0.001, 0.14]], { p: [x, 0, z], mau: 0, mauHam: (xx, yy) => (yy > 0.055 && yy < 0.105 ? 0x3a64b0 : 0xf1f1ea), ao: 0.15, doan: 14 });
  bonsai(b, x, 0.13, z); } }
function veGianMuop(b) { // giàn mướp tre che chõng: lá to, hoa vàng, quả mướp thõng
  const x0 = -1.3, x1 = -0.6, z0 = 1.24, z1 = 1.82, h = 0.9, c = 0xa99a55, r = rnd(43);
  for (const x of [x0, x1]) for (const z of [z0, z1]) tre(b, [x, 0, z], [x, h, z], 0.022, c);
  for (let k = 0; k < 5; k++) { const z = z0 + k * (z1 - z0) / 4, x = x0 + k * (x1 - x0) / 4;
    ong(b, [x0 - 0.05, h, z], [x1 + 0.05, h, z], 0.011, c, { doan: 5 }); ong(b, [x, h + 0.015, z0 - 0.05], [x, h + 0.015, z1 + 0.05], 0.011, c, { doan: 5 }); }
  for (let i = 0; i < 28; i++) b.cau(0.07 + r() * 0.035, { p: [x0 + r() * (x1 - x0), h + 0.035, z0 + r() * (z1 - z0)], s: [1, 0.32, 1], r: [0, r() * 3, 0], mau: MG.la[Math.floor(r() * 3)], ao: 0.15 }, 1);
  for (let i = 0; i < 7; i++) hoa5(b, x0 + 0.05 + r() * (x1 - x0 - 0.1), h + 0.075, z0 + 0.05 + r() * (z1 - z0 - 0.1), 0.03, 0xf7d13a, 0xe0a020, 1);
  for (const [x, z, l] of [[-1.12, 1.8, 0.26], [-0.75, 1.78, 0.3], [-0.62, 1.45, 0.22], [-0.95, 1.83, 0.2]]) { b.cau(1, { p: [x, h - l / 2, z], s: [0.034, l / 2, 0.034], mau: 0x6f9a3a, ao: 0.15 }, 2); ong(b, [x, h - 0.02, z], [x, h + 0.03, z], 0.006, 0x4a6a2a); }
  for (const [x, z] of [[x0, z1], [x1, z1]]) for (let t = 0; t < 0.95; t += 0.1) b.cau(0.035, { p: [x + Math.cos(t * 13) * 0.03, t * h, z + Math.sin(t * 13) * 0.03], s: [1, 0.6, 1], mau: MG.la[0], ao: 0.1 }, 1);
}
function veCayCau(b) { // cây cau: thân mảnh có đốt, bẹ xanh, tàu lá cong rủ, buồng cau
  const x = 1.36, z = -0.25, h = 2.3, r = rnd(45); let p = [x, 0, z];
  for (let k = 0; k < 8; k++) { const q = [x + Math.sin(k * 0.45) * 0.035, (k + 1) * h / 8, z]; ong(b, p, q, 0.042 - k * 0.002, 0x9d9a8a, { r2: 0.04 - k * 0.002, doan: 7 });
    ong(b, [q[0], q[1] - 0.008, q[2]], [q[0], q[1] + 0.008, q[2]], 0.046 - k * 0.002, 0x7f7c6e, { ao: 0, doan: 7 }); p = q; }
  b.tru(0.036, 0.042, 0.28, { p: [p[0], h + 0.13, p[2]], mau: 0x7fae4a, ao: 0.1 }, 7);
  const top = [p[0], h + 0.26, p[2]];
  for (let i = 0; i < 9; i++) { const th = i / 9 * 6.283 + r() * 0.3; let q = top.slice(), ph = 0.95;
    for (let k = 0; k < 6; k++) { const d = huong(th, ph), n = [q[0] + d.x * 0.1, q[1] + d.y * 0.1, q[2] + d.z * 0.1];
      ong(b, q, n, 0.008, 0x6a8a3a, { doan: 4, ao: 0 }); for (const sg of [1, -1]) la(b, n[0], n[1], n[2], th + sg * 1.25, ph - 0.7, 0.13 - k * 0.012, 0.02, k % 2 ? XANH_C : 0x5e9e3e, 0); q = n; ph -= 0.36; } }
  for (let i = 0; i < 12; i++) b.cau(0.02, { p: [p[0] + 0.07 + (r() - 0.5) * 0.06, h + 0.02 + (r() - 0.5) * 0.1, p[2] + 0.05 + (r() - 0.5) * 0.06], mau: i % 3 ? 0x8fb03a : 0xd98a2a, ao: 0 }, 0);
}
function veRaoDamBut(b) { const r = rnd(47), X = 1.42, Z0 = 1.0, Z1 = 2.13, ds = [];
  for (let x = -X; x <= -0.47; x += 0.14) ds.push([x, Z1]); for (let x = 0.47; x <= X + 0.01; x += 0.14) ds.push([x, Z1]);
  for (let z = Z0; z < Z1 - 0.06; z += 0.14) { ds.push([-X, z]); ds.push([X, z]); }
  for (const [x, z] of ds) { b.cau(0.12, { p: [x, 0.19, z], s: [1, 1.45, 1], mau: MG.la[Math.floor(r() * 3)], ao: 0.3 }, 1);
    if (r() < 0.55) { const a = r() * 6.28; hoa5(b, x + Math.cos(a) * 0.09, 0.26 + r() * 0.1, z + Math.sin(a) * 0.09, 0.032, 0xe8323a, 0xffd23a); } } }
function veCongNgoi(b) { // cổng trụ vôi, mái ngói nhỏ 2 dốc, bờ nóc cong 2 đầu
  const z = 2.13, v = 0xe3ddcf, a = 0.6, yN = 0.88, M = { rong: 1.14, a, tren: doc2(yN, a, z), L: [0.27, 0.27] };
  for (const s of [1, -1]) { hop(b, 0.16, 0.64, 0.16, 0.02, { p: [s * 0.42, 0.32, z], mau: v, ao: 0.25 }); hop(b, 0.2, 0.05, 0.2, 0.015, { p: [s * 0.42, 0.665, z], mau: 0xd0c9b8, ao: 0.1 }); }
  hop(b, 1.0, 0.06, 0.1, 0.015, { p: [0, 0.66, z], mau: 0x6e3a24, ao: 0.1 });
  maiHai(b, M, 0x8f4431, 0.04); hangVay(b, M, 0.04, 8, 0.09, 0.06, [0xb9593e, 0xa94f38, 0xc4674b], rnd(49), 0.05);
  hop(b, 1.06, 0.07, 0.09, 0.02, { p: [0, yN + 0.06, z], mau: v, ao: 0.1 });
  for (const s of [1, -1]) b.geo(new T.TorusGeometry(0.05, 0.022, 6, 10, Math.PI * 1.25), { p: [s * 0.52, yN + 0.12, z], r: [0, s > 0 ? 0 : Math.PI, -Math.PI / 4], mau: v, ao: 0 });
}
function veDenLong(b, K, gl) { for (const x of [-0.77, 0, 0.77]) { const yb = Y_XA_V - 0.07, z = Z_COT_V;
  ong(b, [x, yb + 0.04, z], [x, yb - 0.02, z], 0.004, 0x3a2a1a); b.tru(0.035, 0.035, 0.02, { p: [x, yb - 0.025, z], mau: 0xd9a83a, ao: 0 }, 8);
  gl.cau(0.075, { p: [x, yb - 0.1, z], s: [1, 0.85, 1], mau: 0xff5840, ao: 0 }, 2);
  b.tru(0.03, 0.03, 0.02, { p: [x, yb - 0.17, z], mau: 0xd9a83a, ao: 0 }, 8); ong(b, [x, yb - 0.18, z], [x, yb - 0.28, z], 0.012, 0xe8b83a, { r2: 0.004, ao: 0 }); }
  K.sang = true; }
function veCauDoi(b) { const z = Z_COT_V + 0.046;
  for (const s of [1, -1]) { hop(b, 0.085, 0.52, 0.014, 0.005, { p: [s * 0.44, NV.y0 + 0.47, z], mau: 0xc8302a, ao: 0.05 });
    for (let k = 0; k < 5; k++) hop(b, 0.045, 0.035, 0.006, 0, { p: [s * 0.44, NV.y0 + 0.28 + k * 0.095, z + 0.009], r: [0, 0, (k % 2 ? 1 : -1) * 0.2], mau: 0xf2c24a, ao: 0 }); } }
function veChauMai(b) { // chậu mai vàng ngày Tết
  const x = -0.42, z = 1.86, r = rnd(51);
  tien(b, [[0.001, 0], [0.12, 0], [0.155, 0.1], [0.17, 0.17], [0.16, 0.18], [0.001, 0.18]], { p: [x, 0, z], mau: 0, mauHam: (xx, yy) => (yy > 0.04 && yy < 0.13 ? 0xe9e6dc : 0x3f6fae), ao: 0.2, doan: 14 });
  let p = [x, 0.17, z]; for (const [dx, dy, dz] of [[0.03, 0.14, 0], [-0.05, 0.12, 0.02], [0.04, 0.12, -0.02]]) { const q = [p[0] + dx, p[1] + dy, p[2] + dz]; ong(b, p, q, 0.022, 0x5a3e2a); p = q; }
  for (let i = 0; i < 7; i++) { const th = i * 0.9, s = [x + (r() - 0.5) * 0.04, 0.4 + r() * 0.15, z], e = [s[0] + Math.cos(th) * 0.24, s[1] + 0.1 + r() * 0.12, s[2] + Math.sin(th) * 0.24];
    ong(b, s, e, 0.01, 0x5a3e2a, { r2: 0.005 });
    for (let k = 0; k < 7; k++) { const t = 0.3 + r() * 0.75; hoa5(b, s[0] + (e[0] - s[0]) * t + (r() - 0.5) * 0.05, s[1] + (e[1] - s[1]) * t + (r() - 0.5) * 0.04, s[2] + (e[2] - s[2]) * t + (r() - 0.5) * 0.05, 0.022, k % 4 ? 0xffd23a : 0xffe680, 0xe0901a, 1); } }
}

// ===================== NHÀ NHẬT — nhà gỗ =====================
const NJ = { W: 2.2, D: 1.4, y0: 0.3, H: 0.92, R: 0.5, ov: 0.26, ovX: 0.2 };
NJ.yT = NJ.y0 + NJ.H; NJ.yR = NJ.yT + NJ.R; NJ.a = Math.atan2(NJ.R, NJ.D / 2); NJ.rong = NJ.W + 2 * NJ.ovX;
NJ.M = { rong: NJ.rong, a: NJ.a, tren: doc2(NJ.yR, NJ.a), L: [(NJ.D / 2 + NJ.ov) / Math.cos(NJ.a), (NJ.D / 2 + NJ.ov) / Math.cos(NJ.a)] };
const GO_J = 0x4a3a30;
function veNenJ(b) { const { W, D, y0 } = NJ, r = rnd(53); // sàn gỗ kê trên đá tảng, gầm tối
  hop(b, W - 0.1, 0.1, D - 0.1, 0.02, { p: [0, y0 - 0.05, 0], mau: 0x5a4636, ao: 0.2 });
  hop(b, W - 0.3, y0 - 0.1, D - 0.3, 0.01, { p: [0, (y0 - 0.1) / 2, 0], mau: 0x2a221c, ao: 0 });
  for (const x of [-1, -0.33, 0.33, 1]) for (const z of [-0.6, 0.6]) { b.cau(0.07, { p: [x, 0.03, z], s: [1, 0.6, 1], mau: MG.da[Math.floor(r() * 3)], ao: 0.3 }, 1); b.tru(0.035, 0.035, y0 - 0.12, { p: [x, 0.05 + (y0 - 0.12) / 2, z], mau: 0x4a3a2c, ao: 0.1 }, 6); } }
function veVachVanDoc(b) { const { W, D, y0, H, yT, R } = NJ, r = rnd(55), mau = () => [0x7d6b58, 0x6f5f4e, 0x877460][Math.floor(r() * 3)];
  hop(b, W - 0.06, H, D - 0.06, 0.02, { p: [0, y0 + H / 2, 0], mau: 0x3a2f27, ao: 0.1 });
  tamGiac(b, D - 0.06, R - 0.03, W - 0.06, { p: [0, yT, 0], mau: 0x3a2f27, ao: 0 }, true);
  for (const s of [1, -1]) {
    for (let x = -W / 2 + 0.06; x < W / 2; x += 0.12) hop(b, 0.11, H + (r() - 0.5) * 0.02, 0.05, 0.012, { p: [x, y0 + H / 2, s * (D / 2 - 0.01)], mau: mau(), ao: 0.25 });
    for (let z = -D / 2 + 0.06; z < D / 2; z += 0.12) { const hh = H + R * Math.max(0, 1 - (Math.abs(z) + 0.055) / (D / 2)); hop(b, 0.05, hh, 0.11, 0.012, { p: [s * (W / 2 - 0.01), y0 + hh / 2, z], mau: mau(), ao: 0.25 }); }
    hop(b, W + 0.02, 0.05, 0.05, 0.01, { p: [0, y0 + 0.05, s * (D / 2 + 0.02)], mau: 0x4e3f33, ao: 0.1 }); hop(b, W + 0.02, 0.05, 0.05, 0.01, { p: [0, yT - 0.05, s * (D / 2 + 0.02)], mau: 0x4e3f33, ao: 0.1 });
  }
}
function veTuongTrang(b) { const { W, D, y0, H, yT, R } = NJ; // tường vữa trắng, khung cột xà gỗ tối, ván chân tường
  hop(b, W, H, D, 0.02, { p: [0, y0 + H / 2, 0], mau: 0xf4efe3, ao: 0.12 }, 6);
  tamGiac(b, D, R - 0.02, W, { p: [0, yT, 0], mau: 0xf4efe3, ao: 0.05 }, true);
  for (const s of [1, -1]) {
    for (const x of [-W / 2, -0.55, 0.55, W / 2]) hop(b, 0.07, H, 0.07, 0.015, { p: [x, y0 + H / 2, s * D / 2], mau: GO_J, ao: 0.15 });
    for (const z of [-D / 2, 0, D / 2]) hop(b, 0.07, H, 0.07, 0.015, { p: [s * W / 2, y0 + H / 2, z], mau: GO_J, ao: 0.15 });
    hop(b, W + 0.06, 0.06, 0.06, 0.015, { p: [0, yT - 0.03, s * D / 2], mau: GO_J, ao: 0.1 }); hop(b, 0.06, 0.06, D + 0.06, 0.015, { p: [s * W / 2, yT - 0.03, 0], mau: GO_J, ao: 0.1 });
    hop(b, W + 0.02, 0.22, 0.04, 0.01, { p: [0, y0 + 0.11, s * (D / 2 + 0.012)], mau: 0x5a4636, ao: 0.2 }); hop(b, 0.04, 0.22, D + 0.02, 0.01, { p: [s * (W / 2 + 0.012), y0 + 0.11, 0], mau: 0x5a4636, ao: 0.2 });
    hop(b, 0.05, R - 0.08, 0.05, 0.012, { p: [s * (W / 2 + 0.005), yT + (R - 0.08) / 2, 0], mau: GO_J, ao: 0.1 }); hop(b, 0.05, 0.05, D * 0.62, 0.012, { p: [s * (W / 2 + 0.005), yT + 0.17, 0], mau: GO_J, ao: 0.1 });
  }
}
function veMaiVanDa(b) { const M = NJ.M, r = rnd(57), t = 0.05; // mái ván lợp, thanh đè + đá chặn
  maiHai(b, M, 0x6b5e50, t);
  for (const sau of [0, 1]) { const s = sau ? -1 : 1, L = M.L[sau];
    for (let k = 0; ; k++) { const u = L - 0.07 - k * 0.12; if (u < 0.02) break;
      for (let x = -M.rong / 2 + 0.1 + (k % 2) * 0.09; x < M.rong / 2 - 0.05; x += 0.18) hop(b, 0.17, 0.012, 0.15, 0, { p: M.tren(x, u, t + 0.006 + k * 0.002, sau), r: [s * M.a, (r() - 0.5) * 0.08, 0], mau: [0x8a7b68, 0x7c6e5d, 0x968672][Math.floor(r() * 3)], ao: 0.15 }); }
    for (const u of [0.32, 0.72, 1.06]) { ong(b, M.tren(-M.rong / 2 + 0.05, u, t + 0.045, sau), M.tren(M.rong / 2 - 0.05, u, t + 0.045, sau), 0.025, 0x6b5a45);
      for (let i = 0; i < 6; i++) b.cau(0.05 + r() * 0.02, { p: M.tren(-1.05 + i * 0.42 + (r() - 0.5) * 0.1, u + 0.04, t + 0.08, sau), s: [1, 0.7, 1], mau: [0x8f8a80, 0x7f7a72, 0x9a958a][Math.floor(r() * 3)], ao: 0.25 }, 1); } }
  ong(b, [-M.rong / 2, NJ.yR + 0.06, 0], [M.rong / 2, NJ.yR + 0.06, 0], 0.05, 0x6b5a45, { doan: 8 });
}
function veMaiKawara(b) { const M = NJ.M, t = 0.05; // ngói ống xám: hàng ngói chạy dọc dốc, đầu ngói tròn ở mép
  maiHai(b, M, 0x4b5562, t);
  for (const sau of [0, 1]) { const s = sau ? -1 : 1, L = M.L[sau], n = Math.round(M.rong / 0.13);
    for (let i = 0; i < n; i++) { const x = -M.rong / 2 + (i + 0.5) * M.rong / n;
      b.tru(0.042, 0.042, L, { p: M.tren(x, L / 2, t + 0.012, sau), r: [s * (M.a + Math.PI / 2), 0, 0], mau: i % 2 ? 0x6b7686 : 0x626d7d, ao: 0.12 }, 8);
      b.tru(0.05, 0.05, 0.03, { p: M.tren(x, L + 0.005, t + 0.012, sau), r: [s * (M.a + Math.PI / 2), 0, 0], mau: 0x7b8696, ao: 0 }, 10); } }
  hop(b, M.rong - 0.1, 0.1, 0.16, 0.02, { p: [0, NJ.yR + 0.07, 0], mau: 0x4b5562, ao: 0.1 });
  hop(b, M.rong - 0.14, 0.03, 0.17, 0.01, { p: [0, NJ.yR + 0.1, 0], mau: 0xe8e4da, ao: 0 });
  b.tru(0.07, 0.07, M.rong - 0.12, { p: [0, NJ.yR + 0.15, 0], r: [0, 0, Math.PI / 2], mau: 0x5a6472, ao: 0.1 }, 10);
}
function veNocOni(b) { const M = NJ.M, y = NJ.yR + 0.12; // ngói đầu nóc onigawara
  for (const s of [1, -1]) { const x = s * (M.rong / 2 - 0.07);
    hop(b, 0.09, 0.24, 0.22, 0.04, { p: [x, y + 0.05, 0], mau: 0x4f5968, ao: 0.1 });
    b.cau(0.1, { p: [x, y + 0.17, 0], s: [0.5, 0.75, 1.1], mau: 0x5a6472, ao: 0.05 }, 2);
    for (const sz of [1, -1]) b.non(0.03, 0.13, { p: [x, y + 0.26, sz * 0.08], r: [sz * 0.5, 0, 0], mau: 0x4f5968, ao: 0 }, 6); } }
function veCuaItado(b) { const { y0, D } = NJ, z = D / 2 + 0.02, h = 0.6; // cửa lùa gỗ, 1 cánh hé
  hop(b, 0.84, h + 0.04, 0.02, 0, { p: [0, y0 + h / 2, z - 0.01], mau: 0x1f1a16, ao: 0 });
  for (const [x, dz] of [[-0.2, 0.014], [0.3, 0]]) { for (let i = 0; i < 4; i++) hop(b, 0.095, h, 0.025, 0.006, { p: [x - 0.14 + i * 0.095, y0 + h / 2, z + dz], mau: [0x7a6650, 0x6d5b47, 0x857058][i % 3], ao: 0.2 });
    for (const y of [0.1, 0.5]) hop(b, 0.4, 0.035, 0.02, 0.006, { p: [x, y0 + y, z + dz + 0.02], mau: 0x5a4a3a, ao: 0.1 }); }
  hop(b, 0.98, 0.05, 0.05, 0.01, { p: [0, y0 + h + 0.03, z], mau: 0x4a3a2c, ao: 0.1 }); }
function veCuaShoji(b) { const { y0, D } = NJ, z = D / 2 + 0.02, h = 0.6; // 4 cánh giấy shoji
  for (let i = 0; i < 4; i++) { const x = -0.33 + i * 0.22;
    hop(b, 0.21, h, 0.02, 0, { p: [x, y0 + h / 2, z], mau: 0xfbf6e6, ao: 0.04 });
    for (const sx of [-1, 1]) hop(b, 0.022, h, 0.03, 0, { p: [x + sx * 0.095, y0 + h / 2, z + 0.005], mau: GO_J, ao: 0 });
    for (let k = 0; k <= 5; k++) hop(b, 0.2, 0.011, 0.022, 0, { p: [x, y0 + 0.1 + k * 0.095, z + 0.006], mau: GO_J, ao: 0 });
    hop(b, 0.011, h - 0.1, 0.022, 0, { p: [x, y0 + h / 2 + 0.03, z + 0.006], mau: GO_J, ao: 0 });
    hop(b, 0.2, 0.07, 0.022, 0, { p: [x, y0 + 0.035, z + 0.006], mau: GO_J, ao: 0 }); }
  hop(b, 0.98, 0.05, 0.05, 0.01, { p: [0, y0 + h + 0.03, z], mau: GO_J, ao: 0.1 }); }
function veOLuoi(b) { for (const x of [-0.8, 0.8]) { const z = NJ.D / 2 + 0.03, y = NJ.y0 + 0.4;
  hop(b, 0.3, 0.24, 0.02, 0, { p: [x, y, z - 0.01], mau: 0x241d18, ao: 0 });
  for (let i = -1; i <= 1; i++) { hop(b, 0.012, 0.24, 0.014, 0, { p: [x + i * 0.075, y, z], mau: 0xa89a60, ao: 0 }); hop(b, 0.3, 0.012, 0.014, 0, { p: [x, y + i * 0.06, z + 0.004], mau: 0xa89a60, ao: 0 }); }
  for (const dy of [-0.13, 0.13]) hop(b, 0.36, 0.035, 0.035, 0.008, { p: [x, y + dy, z + 0.01], mau: 0x5a4a3a, ao: 0.1 }); } }
function veCuaSoTron(b) { // cửa sổ shoji mặt tiền + ô cửa tròn marumado ở hông phải
  for (const x of [-0.8, 0.8]) { const z = NJ.D / 2 + 0.03, y = NJ.y0 + 0.42;
    hop(b, 0.32, 0.26, 0.02, 0, { p: [x, y, z - 0.005], mau: 0xfbf6e6, ao: 0.04 });
    for (let i = -1; i <= 1; i++) hop(b, 0.01, 0.26, 0.02, 0, { p: [x + i * 0.08, y, z + 0.004], mau: GO_J, ao: 0 });
    for (let i = -1; i <= 1; i++) hop(b, 0.32, 0.01, 0.02, 0, { p: [x, y + i * 0.065, z + 0.004], mau: GO_J, ao: 0 });
    for (const dy of [-0.14, 0.14]) hop(b, 0.38, 0.035, 0.04, 0.008, { p: [x, y + dy, z + 0.01], mau: GO_J, ao: 0.1 });
    for (const sx of [-1, 1]) hop(b, 0.035, 0.3, 0.04, 0.008, { p: [x + sx * 0.175, y, z + 0.01], mau: GO_J, ao: 0.1 }); }
  const gx = NJ.W / 2 + 0.03, gy = NJ.y0 + 0.5;
  b.tru(0.19, 0.19, 0.02, { p: [gx - 0.01, gy, 0.1], r: [0, 0, Math.PI / 2], mau: 0xfbf6e6, ao: 0 }, 20);
  b.geo(new T.TorusGeometry(0.2, 0.03, 6, 22).rotateY(Math.PI / 2), { p: [gx, gy, 0.1], mau: GO_J, ao: 0 });
  for (let i = -2; i <= 2; i++) { const l = 2 * Math.sqrt(Math.max(0, 0.19 * 0.19 - (i * 0.065) ** 2)); hop(b, 0.012, l, 0.01, 0, { p: [gx, gy, 0.1 + i * 0.065], mau: GO_J, ao: 0 }); if (Math.abs(i) < 2) hop(b, 0.012, 0.01, l, 0, { p: [gx, gy + i * 0.09, 0.1], mau: GO_J, ao: 0 }); }
}
function veEngawa(b) { const { y0, D } = NJ, z0 = D / 2, sau = 0.3; // hiên gỗ dọc mặt tiền + 2 cột đỡ mái
  for (let k = 0; k < 4; k++) hop(b, 2.3, 0.04, sau / 4 - 0.006, 0.01, { p: [0, y0 - 0.02, z0 + (k + 0.5) * sau / 4], mau: k % 2 ? 0xb08758 : 0xa67d50, ao: 0.15 });
  hop(b, 2.3, 0.05, 0.05, 0.01, { p: [0, y0 - 0.065, z0 + sau - 0.025], mau: 0x7a5a3a, ao: 0.1 });
  for (const x of [-1.05, -0.35, 0.35, 1.05]) { b.tru(0.025, 0.025, y0 - 0.1, { p: [x, 0.03 + (y0 - 0.1) / 2, z0 + sau - 0.05], mau: 0x5a4636, ao: 0.1 }, 6); b.cau(0.045, { p: [x, 0.02, z0 + sau - 0.05], s: [1, 0.6, 1], mau: MG.da[1], ao: 0.3 }, 1); }
  const zc = z0 + sau - 0.04, yM = NJ.yT - (zc - z0) * Math.tan(NJ.a);
  for (const x of [-1.08, 1.08]) hop(b, 0.07, yM - y0, 0.07, 0.015, { p: [x, y0 + (yM - y0) / 2, zc], mau: 0x5a4636, ao: 0.15 });
  hop(b, 2.3, 0.06, 0.06, 0.015, { p: [0, yM - 0.03, zc], mau: 0x5a4636, ao: 0.1 });
}
function veBacDa(b) { hop(b, 0.5, 0.12, 0.26, 0.05, { p: [0, 0.06, NJ.D / 2 + 0.44], mau: 0x9d988c, ao: 0.3 }, 6); // đá bậc + đôi guốc gỗ
  for (const s of [1, -1]) { const x = s * 0.06, z = NJ.D / 2 + 0.44; hop(b, 0.055, 0.014, 0.11, 0.005, { p: [x, 0.135, z], mau: 0xc9a27a, ao: 0.1 });
    for (const dz of [-0.03, 0.03]) hop(b, 0.05, 0.02, 0.012, 0, { p: [x, 0.12, z + dz], mau: 0x9a7856, ao: 0 });
    b.geo(new T.TorusGeometry(0.02, 0.006, 4, 8, Math.PI), { p: [x, 0.143, z + 0.025], r: [0, Math.PI / 2, 0], mau: 0xd8403a, ao: 0 }); } }
function veNoren(b) { const z = NJ.D / 2 + 0.06, y1 = NJ.y0 + 0.62, y2 = NJ.y0 + 0.3; // rèm noren chàm, huy hiệu tròn trắng
  ong(b, [-0.46, y1 + 0.02, z], [0.46, y1 + 0.02, z], 0.012, 0x6b4a2a);
  for (let i = 0; i < 3; i++) hop(b, 0.28, y1 - y2, 0.012, 0.004, { p: [-0.295 + i * 0.295, (y1 + y2) / 2, z], mau: 0x2d4a7a, ao: 0.05 });
  b.tru(0.06, 0.06, 0.008, { p: [0, y2 + 0.14, z + 0.008], r: [Math.PI / 2, 0, 0], mau: 0xf4f0e6, ao: 0 }, 16);
  b.tru(0.035, 0.035, 0.01, { p: [0, y2 + 0.14, z + 0.01], r: [Math.PI / 2, 0, 0], mau: 0x2d4a7a, ao: 0 }, 12); }
function veTsukubai(b) { const x = -0.75, z = 1.32; // chậu đá rửa tay + ống tre dẫn nước + gáo
  tien(b, [[0.001, 0], [0.14, 0.01], [0.16, 0.08], [0.15, 0.14], [0.11, 0.15], [0.1, 0.12], [0.001, 0.12]], { p: [x, 0, z], mau: 0x9a968c, ao: 0.3, doan: 12 });
  b.tru(0.1, 0.1, 0.005, { p: [x, 0.125, z], mau: 0x6fa8c0, ao: 0 }, 12);
  tre(b, [x - 0.25, 0, z - 0.05], [x - 0.25, 0.32, z - 0.05], 0.025, 0xb8a560);
  ong(b, [x - 0.25, 0.28, z - 0.05], [x - 0.07, 0.23, z - 0.01], 0.013, 0xb8a560);
  ong(b, [x + 0.05, 0.16, z], [x + 0.2, 0.2, z + 0.03], 0.006, 0xc9b07a); b.tru(0.025, 0.02, 0.035, { p: [x + 0.04, 0.16, z], mau: 0xc9b07a, ao: 0 }, 8);
  for (const [dx, dz, k] of [[0.18, 0.12, 0.06], [-0.12, 0.16, 0.05], [0.15, -0.12, 0.045]]) b.cau(k, { p: [x + dx, 0.02, z + dz], s: [1, 0.55, 1], mau: 0x8f8a80, ao: 0.3 }, 1); }
function veDenDa(b, K, gl) { const x = 1.08, z = 1.22, d = 0xa39e92; // đèn đá tōrō
  hop(b, 0.22, 0.05, 0.22, 0.02, { p: [x, 0.025, z], mau: d, ao: 0.3 });
  b.tru(0.04, 0.05, 0.22, { p: [x, 0.16, z], mau: d, ao: 0.15 }, 8);
  hop(b, 0.18, 0.04, 0.18, 0.015, { p: [x, 0.29, z], mau: d, ao: 0.1 });
  gl.geo(hopTron(0.09, 0.08, 0.09, 0.01), { p: [x, 0.35, z], mau: 0xffd98a, ao: 0 });
  for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) hop(b, 0.03, 0.09, 0.03, 0.006, { p: [x + dx * 0.055, 0.355, z + dz * 0.055], mau: d, ao: 0 });
  b.non(0.19, 0.1, { p: [x, 0.45, z], r: [0, Math.PI / 4, 0], mau: d, ao: 0.05 }, 4);
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) b.cau(0.022, { p: [x + dx * 0.19, 0.41, z + dz * 0.19], mau: d, ao: 0 }, 1);
  b.cau(0.035, { p: [x, 0.53, z], s: [1, 1.3, 1], mau: d, ao: 0 }, 1);
  K.sang = true; }
function veLoiDaJ(b) { const r = rnd(59); for (const [x, z] of [[0.08, 1.5], [-0.07, 1.74], [0.06, 1.97], [-0.02, 2.2]]) b.cau(0.13, { p: [x, 0.02, z], s: [1, 0.22, 0.75], r: [0, r() * 3, 0], mau: [0x9a958a, 0xa8a398, 0x8f8a80][Math.floor(r() * 3)], ao: 0.3 }, 2); }
function veVuonSoi(b) { const r = rnd(61); // sỏi cào: nền sỏi + vệt cào + vòng quanh tảng đá rêu
  hop(b, 2.76, 0.02, 1.16, 0.01, { p: [0, 0.01, 1.58], mau: 0xdcd8cc, ao: 0 });
  for (let z = 1.04; z < 2.14; z += 0.055) ong(b, [-1.36, 0.022, z], [1.36, 0.022, z], 0.006, 0xc9c5b8, { doan: 4, ao: 0 });
  const [rx, rz] = [-0.42, 1.8];
  for (const rr of [0.2, 0.27]) b.geo(new T.TorusGeometry(rr, 0.008, 4, 24).rotateX(Math.PI / 2), { p: [rx, 0.024, rz], mau: 0xc9c5b8, ao: 0 });
  b.cau(0.13, { p: [rx, 0.05, rz], s: [1, 0.7, 0.85], mau: 0x8f8a80, ao: 0.3 }, 2); b.cau(0.09, { p: [rx - 0.02, 0.12, rz], s: [1, 0.4, 0.8], mau: 0x6f8a4a, ao: 0.1 }, 1); }
function veCayThong(b) { const x = 1.15, z = 1.86, pts = [[x, 0, z], [x - 0.05, 0.22, z + 0.02], [x + 0.04, 0.42, z - 0.02], [x - 0.02, 0.62, z]]; // thông cắt tỉa tầng mây
  for (let i = 1; i < pts.length; i++) ong(b, pts[i - 1], pts[i], 0.05 - i * 0.01, 0x6b4a36, { r2: 0.045 - i * 0.01 });
  for (const [dx, dy, dz, r] of [[0.15, 0.32, 0, 0.16], [-0.16, 0.46, 0.03, 0.14], [0.06, 0.64, 0, 0.13], [-0.02, 0.78, 0, 0.09]]) {
    ong(b, [x, dy - 0.06, z], [x + dx, dy, z + dz], 0.015, 0x6b4a36);
    b.cau(r, { p: [x + dx, dy + 0.02, z + dz], s: [1, 0.4, 0.85], mau: 0x3f6e3c, ao: 0.2 }, 2); b.cau(r * 0.72, { p: [x + dx, dy + 0.05, z + dz], s: [1, 0.35, 0.8], mau: 0x5a8a48, ao: 0 }, 1); } }
function veRaoTre(b) { const X = 1.42, Z0 = 1.0, Z1 = 2.14, c = 0xc8b06a; // rào tre mắt cáo yotsume-gaki
  const doan = (A, B, doc) => { for (const y of [0.13, 0.28, 0.42]) ong(b, [A[0], y, A[1]], [B[0], y, B[1]], 0.012, c, { doan: 5 });
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.round(L / 0.12);
    for (let i = 0; i <= n; i++) { const t = i / n; tre(b, [A[0] + (B[0] - A[0]) * t, 0, A[1] + (B[1] - A[1]) * t], [A[0] + (B[0] - A[0]) * t, 0.48, A[1] + (B[1] - A[1]) * t], i % n ? 0.013 : 0.022, c); } };
  for (const s of [1, -1]) { doan([s * 0.38, Z1], [s * X, Z1]); doan([s * X, Z0], [s * X, Z1]); } }
function veHoKoi(b, K) { const x = 0.62, z = 1.72, rx = 0.3, rz = 0.24, r = rnd(63); // hồ cá koi: viền đá, lá sen, 2 cá bơi vòng
  b.tru(1, 1, 0.012, { p: [x, 0.024, z], s: [rx, 1, rz], mau: 0x3f8aa0, ao: 0 }, 22);
  b.tru(1, 1, 0.01, { p: [x, 0.018, z], s: [rx + 0.03, 1, rz + 0.03], mau: 0x2e6a7a, ao: 0 }, 22);
  for (let i = 0; i < 17; i++) { const a = i / 17 * 6.283; b.cau(0.045 + r() * 0.02, { p: [x + Math.cos(a) * (rx + 0.03), 0.03, z + Math.sin(a) * (rz + 0.03)], s: [1, 0.6, 1], mau: MG.da[Math.floor(r() * 3)], ao: 0.3 }, 1); }
  for (const [dx, dz] of [[-0.14, 0.06], [0.1, -0.1]]) b.tru(0.05, 0.05, 0.006, { p: [x + dx, 0.033, z + dz], mau: 0x5fa84a, ao: 0 }, 10);
  hoa5(b, x - 0.13, 0.05, z + 0.06, 0.028, 0xffb3cc, 0xffe066, 1);
  const ca = [];
  for (const [mau, dom] of [[0xff7a2a, 0xffffff], [0xffffff, 0xe8452a]]) { const q = boMin();
    q.cau(0.035, { s: [0.62, 0.42, 1.6], mau, ao: 0 }, 2); q.cau(0.022, { p: [0.008, 0.012, 0.012], s: [1, 0.5, 1.3], mau: dom, ao: 0 }, 1);
    q.non(0.028, 0.045, { p: [0, 0, -0.072], r: [Math.PI / 2, 0, 0], s: [1, 1, 0.3], mau, ao: 0 }, 6);
    const m = q.xong(); m.castShadow = false; K.g.add(m); ca.push(m); }
  K.dong.push(tg => ca.forEach((m, i) => { const a = tg * (0.45 + i * 0.17) + i * 3; m.position.set(x + Math.cos(a) * rx * 0.55, 0.035, z + Math.sin(a) * rz * 0.55); m.rotation.y = -a; }));
}
function veSakura(b) { const x = -1.08, z = 1.84, r = rnd(65), than = 0x5a3e36, goc = [x + 0.05, 0.45, z - 0.03]; // anh đào nở hồng + cánh rơi
  ong(b, [x, 0, z], goc, 0.06, than, { r2: 0.045 });
  for (const [dx, dy, dz] of [[0.35, 0.3, 0.1], [-0.25, 0.35, -0.05], [0.1, 0.45, 0.25], [-0.05, 0.4, -0.3], [0.25, 0.25, -0.25]]) { const e = [goc[0] + dx, goc[1] + dy, goc[2] + dz]; ong(b, goc, e, 0.03, than, { r2: 0.014 });
    for (let i = 0; i < 7; i++) b.cau(0.1 + r() * 0.05, { p: [e[0] + (r() - 0.5) * 0.22, e[1] + (r() - 0.3) * 0.12, e[2] + (r() - 0.5) * 0.22], mau: [0xffc2d4, 0xffb0c8, 0xffd6e2][Math.floor(r() * 3)], ao: 0.2 }, 1); }
  for (let i = 0; i < 16; i++) b.tru(0.014, 0.014, 0.003, { p: [x + (r() - 0.5) * 0.9, 0.028, z + (r() - 0.5) * 0.7], mau: 0xffc2d4, ao: 0 }, 5); }
function veChuongGio(b, K) { for (const x of [-0.7, 0.7]) { const z = 0.9, y = NJ.yT - (z - NJ.D / 2) * Math.tan(NJ.a) - 0.01, q = boMin(); // chuông gió thuỷ tinh + dải giấy, đung đưa
  ong(q, [0, 0, 0], [0, -0.06, 0], 0.003, 0x3a3a3a); q.cau(0.036, { p: [0, -0.085, 0], s: [1, 0.9, 1], mau: 0xbfe6f5, ao: 0 }, 2); q.cau(0.012, { p: [0, -0.07, 0.03], mau: 0xe84a4a, ao: 0 }, 0);
  ong(q, [0, -0.1, 0], [0, -0.2, 0], 0.002, 0x3a3a3a); hop(q, 0.045, 0.1, 0.004, 0, { p: [0, -0.25, 0], mau: x < 0 ? 0xff8fb3 : 0x7fd0ff, ao: 0 });
  const m = q.xong(); m.position.set(x, y, z); m.castShadow = false; K.g.add(m); K.dong.push(tg => { m.rotation.z = Math.sin(tg * 2.2 + x * 3) * 0.2; m.rotation.x = Math.sin(tg * 1.7 + x) * 0.12; }); } }
function veChochin(b, K, gl) { for (const x of [-0.36, 0.36]) { const z = 0.9, y = NJ.yT - (z - NJ.D / 2) * Math.tan(NJ.a) - 0.02; // đèn lồng giấy đỏ 2 bên lối vào
  ong(b, [x, y, z], [x, y - 0.05, z], 0.004, 0x2a2a2a); b.tru(0.05, 0.05, 0.025, { p: [x, y - 0.06, z], mau: 0x2a2a2a, ao: 0 }, 10);
  gl.cau(0.075, { p: [x, y - 0.16, z], s: [1, 1.3, 1], mau: 0xff5a44, ao: 0 }, 2);
  b.tru(0.045, 0.045, 0.02, { p: [x, y - 0.26, z], mau: 0x2a2a2a, ao: 0 }, 10); } K.sang = true; }
function veKoinobori(b, K) { const x = 1.36, z = -0.5, h = 2.15; // cột cờ cá chép bay theo gió
  ong(b, [x, 0, z], [x, h, z], 0.025, 0xd9c9a0, { r2: 0.016 }); b.cau(0.04, { p: [x, h + 0.03, z], mau: 0xe8b84a, ao: 0 }, 1);
  const ds = [[0x2a2a33, 0.5, h - 0.2], [0xe8452a, 0.42, h - 0.46], [0x3f7fd0, 0.35, h - 0.68]];
  ds.forEach(([mau, dai, y], i) => { const q = boMin();
    q.tru(0.03 * dai / 0.5, 0.07 * dai / 0.5, dai, { p: [dai / 2, 0, 0], r: [0, 0, -Math.PI / 2], mau, ao: 0.1 }, 10);
    for (let k = 0; k < 3; k++) q.cau(0.025 * dai / 0.5, { p: [dai * (0.3 + k * 0.2), 0.03 * dai / 0.5, 0.03], mau: 0xffffff, ao: 0 }, 1);
    for (const s of [1, -1]) { q.cau(0.018, { p: [0.05, 0.02, s * 0.05 * dai / 0.5], mau: 0xffffff, ao: 0 }, 1); q.cau(0.009, { p: [0.045, 0.02, s * 0.06 * dai / 0.5], mau: 0x111111, ao: 0 }, 0); }
    q.non(0.05, 0.08, { p: [dai + 0.03, 0, 0], r: [0, 0, Math.PI / 2], s: [1, 1, 0.3], mau, ao: 0 }, 6);
    const g = new T.Group(), m = q.xong(); m.castShadow = false; g.add(m); g.position.set(x, y, z); K.g.add(g);
    K.dong.push(tg => { g.rotation.y = 0.3 + Math.sin(tg * 0.6 + i) * 0.35; m.rotation.x = Math.sin(tg * 3 + i * 1.3) * 0.25; g.rotation.z = -0.15 + Math.sin(tg * 2 + i) * 0.08; }); });
}

// ===================== NHÀ HY LẠP — nhà trắng đảo Cyclades =====================
const NH = { W: 1.9, D: 1.5, y0: 0.1, H: 1.22 }; NH.yM = NH.y0 + NH.H;
const trongOGR = (x, y) => (x > -0.4 && x < 0.1 && y < 0.86) || (Math.abs(y - 0.92) < 0.22 && (Math.abs(x + 0.68) < 0.2 || Math.abs(x - 0.48) < 0.2)); // chừa cửa + cửa sổ
function veBeGR(b, K) { hop(b, NH.W + 0.24, NH.y0, NH.D + 0.56, 0.04, { p: [0, NH.y0 / 2, 0.14], mau: K.co('quet_voi') ? 0xe9e5dc : 0xa99c86, ao: 0.3 }, 6); }
function veTuongDaTho(b) { const { W, D, y0, H } = NH, r = rnd(71), mau = [0xc9bda6, 0xb8aa92, 0xd4c8b2, 0xa89a84];
  hop(b, W, H, D, 0.04, { p: [0, y0 + H / 2, 0], mau: 0xb2a58e, ao: 0.15 }, 6);
  const da = (x, y, z, doc) => { const w = 0.07 + r() * 0.04, h = 0.045 + r() * 0.02; b.cau(1, { p: [x, y, z], s: doc ? [0.03, h, w] : [w, h, 0.03], r: [0, 0, (r() - 0.5) * 0.3], mau: mau[Math.floor(r() * 4)], ao: 0.25 }, 0); };
  for (let j = 0, y = y0 + 0.07; y < y0 + H - 0.04; j++, y += 0.11) { const lech = (j % 2) * 0.09;
    for (let x = -W / 2 + 0.08 + lech; x < W / 2 - 0.05; x += 0.18) if (!trongOGR(x, y)) da(x, y, D / 2 + 0.012, false);
    for (let z = -D / 2 + 0.08 + lech; z < D / 2 - 0.05; z += 0.18) da(W / 2 + 0.012, y, z, true); } }
function veQuetVoi(b) { const { W, D, y0, H } = NH; // tường quét vôi trắng, góc bo mềm
  hop(b, W, H, D, 0.09, { p: [0, y0 + H / 2, 0], mau: 0, mauHam: (x, y, z) => (nhieu3(x * 4, y * 4, z * 4) > 0.7 ? 0xf3f0e8 : 0xfbfaf6), ao: 0.12 }, 8); }
function veMaiBang(b, K) { const { W, D, yM } = NH, voi = K.co('quet_voi'); // mái bằng + đầu xà gỗ nhô ra
  hop(b, W + 0.08, 0.1, D + 0.08, voi ? 0.05 : 0.03, { p: [0, yM + 0.03, 0], mau: voi ? 0xf6f4ee : 0xa08a6a, ao: 0.1 }, 6);
  for (let i = 0; i < 5; i++) ong(b, [-0.76 + i * 0.38, yM - 0.06, D / 2 - 0.05], [-0.76 + i * 0.38, yM - 0.06, D / 2 + 0.1], 0.03, 0x7a5a3a, { doan: 7 }); }
function veLanCan(b) { const { W, D, yM } = NH, y = yM + 0.13, v = 0xfbfaf6; // lan can quanh sân thượng
  for (const s of [1, -1]) { hop(b, W + 0.08, 0.12, 0.08, 0.035, { p: [0, y, s * (D / 2)], mau: v, ao: 0.15 }); hop(b, 0.08, 0.12, D + 0.08, 0.035, { p: [s * (W / 2), y, 0], mau: v, ao: 0.15 }); } }
const BAC_GR = i => ({ z: NH.D / 2 + 0.05 - (i + 0.5) * 0.145, top: (i + 1) * 0.14 }); // bậc thang i (0 = dưới cùng, ở phía trước)
function veCauThang(b, K) { const voi = K.co('quet_voi'), x = NH.W / 2 + 0.17, r = rnd(73);
  for (let i = 0; i < 10; i++) { const { z, top } = BAC_GR(i); hop(b, 0.34, top, 0.15, voi ? 0.03 : 0.015, { p: [x, top / 2, z], mau: voi ? 0xfbfaf6 : [0xb8aa92, 0xa89a84, 0xc2b59c][Math.floor(r() * 3)], ao: 0.2 }); }
  if (K.co('lan_can')) for (let i = 0; i < 10; i++) { const { z, top } = BAC_GR(i); hop(b, 0.07, 0.14, 0.15, 0.03, { p: [x + 0.14, top + 0.06, z], mau: 0xfbfaf6, ao: 0.1 }); } }
function veChumGom(b) { const am = (x, z, nghieng) => { // chum gốm amphora: 2 quai, dải hoa văn nâu
    const o = { p: [x, nghieng ? 0.1 : 0, z], r: nghieng ? [0, 0.4, Math.PI / 2 - 0.15] : [0, 0, 0], mau: 0xc26f45, ao: 0.25, doan: 12 };
    const pts = [[0.001, 0], [0.03, 0], [0.05, 0.05], [0.1, 0.16], [0.11, 0.22], [0.085, 0.3], [0.035, 0.34], [0.03, 0.42], [0.046, 0.44], [0.035, 0.44]];
    if (nghieng) { o.p = [x, 0.1, z]; tien(b, pts.map(([r, y]) => [r, y - 0.22]), o); return; }
    tien(b, pts, o); b.tru(0.112, 0.112, 0.035, { p: [x, 0.2, z], mau: 0x6b3a24, ao: 0 }, 12);
    for (const s of [1, -1]) b.geo(new T.TorusGeometry(0.045, 0.01, 4, 8, Math.PI), { p: [x + s * 0.06, 0.34, z], r: [0, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2], mau: 0xb8643c, ao: 0 }); };
  am(-0.78, 1.02); am(-0.98, 1.18); am(-0.6, 1.25, true); }
function veMaiVom(b) { const x = 0.32, z = -0.22, y = NH.yM + 0.08; // mái vòm xanh trên thân trụ trắng
  b.tru(0.33, 0.33, 0.16, { p: [x, y + 0.08, z], mau: 0xfbfaf6, ao: 0.1 }, 24);
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + 0.3; hop(b, 0.06, 0.08, 0.02, 0.008, { p: [x + Math.sin(a) * 0.33, y + 0.08, z + Math.cos(a) * 0.33], r: [0, a, 0], mau: 0x2c5c9c, ao: 0 }); }
  b.geo(new T.SphereGeometry(0.33, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), { p: [x, y + 0.16, z], mau: 0x2f6fc8, ao: 0.08 });
  b.tru(0.04, 0.05, 0.08, { p: [x, y + 0.53, z], mau: 0xfbfaf6, ao: 0 }, 8); b.cau(0.045, { p: [x, y + 0.6, z], mau: 0x2f6fc8, ao: 0 }, 1); }
function veCuaGoCu(b) { const x = -0.15, z = NH.D / 2 + 0.04, y0 = NH.y0, r = rnd(75); // cửa ván cũ bạc màu + dầm gỗ trên
  hop(b, 0.44, 0.74, 0.02, 0, { p: [x, y0 + 0.37, z - 0.015], mau: 0x2e2620, ao: 0 });
  for (let i = 0; i < 4; i++) hop(b, 0.098, 0.72 - r() * 0.03, 0.03, 0.01, { p: [x - 0.15 + i * 0.1, y0 + 0.36, z], mau: [0x8a7d6a, 0x7d705e, 0x958875][i % 3], ao: 0.2 });
  for (const yy of [0.15, 0.55]) hop(b, 0.4, 0.05, 0.02, 0.008, { p: [x, y0 + yy, z + 0.022], mau: 0x6e6252, ao: 0.1 });
  b.geo(new T.TorusGeometry(0.03, 0.008, 5, 10), { p: [x + 0.12, y0 + 0.4, z + 0.04], mau: MG.sat, ao: 0 });
  hop(b, 0.62, 0.08, 0.1, 0.015, { p: [x, y0 + 0.78, z], mau: 0x7a5a3a, ao: 0.1 }); }
function veCuaXanhGR(b) { const x = -0.15, z = NH.D / 2 + 0.04, y0 = NH.y0, C = 0x2c6cc4; // cửa vòm xanh dương, khung vôi dày
  hop(b, 0.4, 0.52, 0.05, 0.02, { p: [x, y0 + 0.26, z], mau: C, ao: 0.15 });
  b.geo(new T.CylinderGeometry(0.2, 0.2, 0.05, 18, 1, false, Math.PI / 2, Math.PI).rotateX(Math.PI / 2), { p: [x, y0 + 0.52, z], mau: C, ao: 0.05 });
  for (const sx of [1, -1]) hop(b, 0.13, 0.36, 0.015, 0.005, { p: [x + sx * 0.09, y0 + 0.24, z + 0.028], mau: 0x3a7cd4, ao: 0.1 });
  b.geo(new T.TorusGeometry(0.03, 0.008, 5, 10), { p: [x, y0 + 0.5, z + 0.04], mau: MG.dong, ao: 0 });
  for (const sx of [1, -1]) hop(b, 0.08, 0.52, 0.07, 0.03, { p: [x + sx * 0.24, y0 + 0.26, z - 0.01], mau: 0xfbfaf6, ao: 0.1 });
  b.geo(new T.TorusGeometry(0.24, 0.04, 8, 18, Math.PI), { p: [x, y0 + 0.52, z - 0.01], mau: 0xfbfaf6, ao: 0.05 }); }
const O_GR = [-0.68, 0.48];
function veOCuaNho(b) { const x = 0.48, z = NH.D / 2 + 0.04, y = NH.y0 + 0.82; // ô cửa nhỏ, 1 cánh chớp lệch bản lề
  hop(b, 0.26, 0.26, 0.02, 0, { p: [x, y, z - 0.01], mau: 0x2e2620, ao: 0 });
  hop(b, 0.36, 0.05, 0.08, 0.01, { p: [x, y + 0.155, z], mau: 0x7a5a3a, ao: 0.1 });
  hop(b, 0.13, 0.26, 0.02, 0.006, { p: [x - 0.2, y - 0.03, z + 0.03], r: [0, 0.5, 0.25], mau: 0x8a7d6a, ao: 0.15 }); }
function cuaSoGR(b, x, xanh) { const z = NH.D / 2 + 0.04, y = NH.y0 + 0.82, vien = xanh ? 0x2c6cc4 : 0x7a5a3a, chop = xanh ? 0x3a7cd4 : 0x8a7056;
  hop(b, 0.28, 0.3, 0.02, 0, { p: [x, y, z - 0.005], mau: MG.kinh, ao: 0 }); hop(b, 0.04, 0.16, 0.006, 0, { p: [x - 0.05, y + 0.04, z + 0.008], r: [0, 0, 0.6], mau: 0xe9f8ff, ao: 0 });
  for (const [dx, dy, w, h] of [[0, 0.16, 0.34, 0.04], [0, -0.16, 0.34, 0.04], [0.15, 0, 0.04, 0.32], [-0.15, 0, 0.04, 0.32], [0, 0, 0.022, 0.3], [0, 0, 0.3, 0.022]]) hop(b, w, h, 0.04, w > 0.03 && h > 0.03 ? 0.012 : 0, { p: [x + dx, y + dy, z + 0.01], mau: vien, ao: 0.1 });
  for (const s of [1, -1]) { hop(b, 0.15, 0.34, 0.025, 0.01, { p: [x + s * 0.26, y, z + 0.02], mau: chop, ao: 0.1 }); for (let k = -2; k <= 2; k++) hop(b, 0.11, 0.014, 0.01, 0, { p: [x + s * 0.26, y + k * 0.06, z + 0.036], mau: toiMau(chop, 0.8), ao: 0 }); }
  hop(b, 0.4, 0.04, 0.09, 0.015, { p: [x, y - 0.19, z + 0.03], mau: xanh ? 0xfbfaf6 : 0x9a8a72, ao: 0.1 }); }
function veCuaSoGoGR(b) { for (const x of O_GR) cuaSoGR(b, x, false); }
function veCuaSoXanh(b) { for (const x of O_GR) cuaSoGR(b, x, true); }
function veGianNho(b) { const r = rnd(77), trang = 0xfbfaf6, go = 0x9a7050, zP = 1.46, y = 1.16; // giàn nho: cột vôi, xà gỗ, lá nho + chùm nho tím
  for (const x of [-0.85, 0.55]) { hop(b, 0.09, y, 0.09, 0.03, { p: [x, y / 2, zP], mau: trang, ao: 0.2 }); hop(b, 0.06, 0.06, zP - NH.D / 2 + 0.12, 0.012, { p: [x, y + 0.03, (zP + NH.D / 2) / 2], mau: go, ao: 0.1 }); }
  for (let k = 0; k < 6; k++) { const z = NH.D / 2 + 0.1 + k * (zP - NH.D / 2 - 0.05) / 5; hop(b, 1.58, 0.035, 0.04, 0.01, { p: [-0.15, y + 0.075, z], mau: go, ao: 0.05 }); }
  for (let i = 0; i < 24; i++) b.cau(0.055 + r() * 0.025, { p: [-0.85 + r() * 1.4, y + 0.11, NH.D / 2 + 0.08 + r() * 0.7], s: [1, 0.35, 1], r: [0, r() * 3, 0], mau: MG.la[Math.floor(r() * 3)], ao: 0.12 }, 1);
  for (const [x, z] of [[-0.55, 1.2], [-0.05, 1.38], [0.3, 1.05], [0.42, 1.36]]) for (let k = 0; k < 10; k++) { const lop = Math.floor(k / 4); b.cau(0.022, { p: [x + ((k % 4) - 1.5) * 0.028 * (1 - lop * 0.3), y + 0.02 - lop * 0.04, z + (k % 2 - 0.5) * 0.02], mau: k % 3 ? 0x6a3a8a : 0x7f4aa0, ao: 0.1 }, 1); } }
function veBanGhe(b) { const xanh = 0x2c6cc4, trang = 0xfbfaf6, x = 0.3, z = 1.2; // bàn tròn + 2 ghế xanh
  b.tru(0.14, 0.14, 0.025, { p: [x, 0.3, z], mau: xanh, ao: 0.1 }, 16); b.tru(0.018, 0.03, 0.29, { p: [x, 0.145, z], mau: trang, ao: 0.1 }, 8); b.tru(0.07, 0.07, 0.015, { p: [x, 0.008, z], mau: trang, ao: 0.1 }, 12);
  for (const [cx, cz, g] of [[x + 0.02, z + 0.24, 0], [x - 0.24, z - 0.02, Math.PI / 2]]) { const f = khungMat(cx, 0, cz, g);
    hop(b, 0.15, 0.025, 0.14, 0.008, { p: f.p(0, 0.19, 0), r: f.r(), mau: xanh, ao: 0.1 });
    for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) hop(b, 0.018, 0.19, 0.018, 0, { p: f.p(dx * 0.06, 0.095, dz * 0.055), r: f.r(), mau: xanh, ao: 0.1 });
    hop(b, 0.15, 0.12, 0.018, 0.006, { p: f.p(0, 0.28, 0.065), r: f.r(), mau: xanh, ao: 0.1 }); } }
function veHoaGiay(b) { const r = rnd(79), hong = [0xe0408f, 0xd12f7e, 0xf06aa8]; // hoa giấy đổ thác ở góc tường trái + vắt lên giàn
  const cum = (x, y, z) => { b.cau(0.05 + r() * 0.02, { p: [x, y, z], s: [1, 0.8, 1], mau: r() < 0.3 ? MG.la[1] : hong[Math.floor(r() * 3)], ao: 0.12 }, 1); };
  for (let t = 0; t < 1; t += 0.035) cum(-0.95 + (r() - 0.5) * 0.08, 0.15 + t * 1.2, NH.D / 2 + 0.04 + (r() - 0.5) * 0.06);
  for (let t = 0; t < 1; t += 0.05) cum(-0.95 + t * 0.35 + (r() - 0.5) * 0.06, NH.yM - 0.05 - t * 0.12, NH.D / 2 + 0.05);
  for (let t = 0; t < 1; t += 0.07) cum(-0.85 + (r() - 0.5) * 0.08, 1.2, NH.D / 2 + 0.1 + t * 0.7); }
function veChauPhongLu(b) { for (const i of [1, 3, 5, 7]) { const { z, top } = BAC_GR(i), x = NH.W / 2 + 0.08; // chậu phong lữ đỏ trên bậc thang, sát tường
  b.tru(0.045, 0.035, 0.07, { p: [x, top + 0.035, z], mau: 0xc9764e, ao: 0.2 }, 10);
  b.cau(0.055, { p: [x, top + 0.1, z], s: [1, 0.75, 1], mau: MG.la[1], ao: 0.15 }, 1);
  for (let k = 0; k < 4; k++) b.cau(0.02, { p: [x + Math.cos(k * 1.6) * 0.035, top + 0.13, z + Math.sin(k * 1.6) * 0.035], mau: 0xe8323a, ao: 0 }, 1); } }
function veSanSoi(b) { const r = rnd(81), cx = -0.1, cz = 1.78; // sân lát đá + tranh khảm sỏi tròn
  hop(b, 2.7, 0.02, 1.18, 0.01, { p: [0, 0.01, 1.57], mau: 0xe6e0d4, ao: 0 });
  const soi = (x, z, mau, k) => b.cau(k || 0.022, { p: [x, 0.024, z], s: [1, 0.45, 0.8], r: [0, r() * 3, 0], mau, ao: 0 }, 0);
  for (const [R, n, mau] of [[0.34, 30, 0x4a4a52], [0.27, 24, 0xf4f2ec], [0.2, 18, 0x4a4a52], [0.12, 12, 0x2c6cc4]]) for (let i = 0; i < n; i++) { const a = i / n * 6.283; soi(cx + Math.cos(a) * R, cz + Math.sin(a) * R * 0.9, mau); }
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; soi(cx + Math.cos(a) * 0.05, cz + Math.sin(a) * 0.05, 0x4a4a52, 0.018); } soi(cx, cz, 0xf4f2ec, 0.025); }
function veOLiu(b) { const r = rnd(83), x = -1.05, z = 1.8; // ô liu: thân vặn xoắn, tán xanh bạc, quả đen
  let p = [x, 0, z]; for (const [dx, dy, dz] of [[0.06, 0.18, 0.02], [-0.08, 0.16, -0.02], [0.05, 0.16, 0.03]]) { const q = [p[0] + dx, p[1] + dy, p[2] + dz]; ong(b, p, q, 0.05, 0x7d7266, { r2: 0.04 }); p = q; }
  for (const [dx, dy, dz] of [[0.2, 0.12, 0.05], [-0.18, 0.15, -0.05], [0.02, 0.2, 0.18]]) ong(b, p, [p[0] + dx, p[1] + dy, p[2] + dz], 0.022, 0x7d7266, { r2: 0.012 });
  for (let i = 0; i < 16; i++) b.cau(0.11 + r() * 0.05, { p: [p[0] + (r() - 0.5) * 0.5, p[1] + 0.12 + r() * 0.2, p[2] + (r() - 0.5) * 0.45], s: [1, 0.7, 1], mau: [0x8fa37c, 0x9fb28a, 0x7d9270][Math.floor(r() * 3)], ao: 0.2 }, 1);
  for (let i = 0; i < 14; i++) b.cau(0.014, { p: [p[0] + (r() - 0.5) * 0.5, p[1] + 0.05 + r() * 0.25, p[2] + (r() - 0.5) * 0.5], mau: 0x2e2a30, ao: 0 }, 0); }
function veTuongRao(b) { const X = 1.42, Z0 = 1.0, Z1 = 2.14, v = 0xfbfaf6, doan = (A, B) => { const L = Math.hypot(B[0] - A[0], B[1] - A[1]), doc = Math.abs(B[1] - A[1]) > Math.abs(B[0] - A[0]); // tường rào trắng bo tròn
    hop(b, doc ? 0.1 : L, 0.3, doc ? L : 0.1, 0.04, { p: [(A[0] + B[0]) / 2, 0.15, (A[1] + B[1]) / 2], mau: v, ao: 0.2 });
    b.tru(0.052, 0.052, L, { p: [(A[0] + B[0]) / 2, 0.3, (A[1] + B[1]) / 2], r: doc ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2], mau: v, ao: 0.05 }, 10); };
  for (const s of [1, -1]) { doan([s * 0.5, Z1], [s * (X + 0.05), Z1]); doan([s * X, Z0], [s * X, Z1 - 0.05]); } }
function veCongVomGR(b) { const z = 2.14, v = 0xfbfaf6; // cổng vòm trắng, 2 cánh xanh hé mở
  for (const s of [1, -1]) hop(b, 0.13, 0.66, 0.14, 0.04, { p: [s * 0.44, 0.33, z], mau: v, ao: 0.2 });
  b.geo(new T.TorusGeometry(0.44, 0.07, 8, 20, Math.PI), { p: [0, 0.66, z], mau: v, ao: 0.05 });
  for (const s of [1, -1]) { const f = khungMat(s * 0.37, 0, z + 0.02, s * 0.5); for (let k = 0; k < 4; k++) hop(b, 0.018, 0.4, 0.02, 0, { p: f.p(-s * (0.03 + k * 0.06), 0.24, 0), r: f.r(), mau: 0x2c6cc4, ao: 0.1 });
    for (const yy of [0.08, 0.4]) hop(b, 0.22, 0.03, 0.025, 0.006, { p: f.p(-s * 0.12, yy, 0), r: f.r(), mau: 0x2c6cc4, ao: 0.1 }); } }
function veDenDong(b, K, gl) { for (const x of [-0.46, 0.17]) { const y = NH.y0 + 0.66, z = NH.D / 2 + 0.05, zc = z + 0.08, d = 0xc9953a; // đèn đồng gắn tường
  hop(b, 0.02, 0.1, 0.02, 0, { p: [x, y + 0.14, z + 0.02], mau: d, ao: 0 }); hop(b, 0.015, 0.015, 0.08, 0, { p: [x, y + 0.18, z + 0.05], mau: d, ao: 0 });
  gl.geo(hopTron(0.065, 0.085, 0.065, 0.012), { p: [x, y + 0.08, zc], mau: 0xffdc7c, ao: 0 });
  b.non(0.06, 0.05, { p: [x, y + 0.148, zc], r: [0, Math.PI / 4, 0], mau: d, ao: 0 }, 4); hop(b, 0.075, 0.015, 0.075, 0.004, { p: [x, y + 0.03, zc], mau: d, ao: 0 }); }
  K.sang = true; }
function veCoDay(b) { const mau = [0x2c6cc4, 0xfbfaf6]; let i = 0; // cờ dây xanh-trắng: từ góc lan can xuống đỉnh cổng
  for (const [A, B] of [[[-0.95, NH.yM + 0.18, NH.D / 2], [0, 1.12, 2.14]], [[0.95, NH.yM + 0.18, NH.D / 2], [0, 1.12, 2.14]]]) {
    let prev = A; const n = 12, pt = t => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t - 0.18 * Math.sin(Math.PI * t), A[2] + (B[2] - A[2]) * t];
    for (let k = 1; k <= n; k++) { const p = pt(k / n); ong(b, prev, p, 0.004, 0x5a5a5a, { doan: 3, ao: 0 }); prev = p; }
    for (let k = 0; k < 10; k++) { const p = pt((k + 0.5) / 10); tamGiac(b, 0.07, 0.08, 0.004, { p: [p[0], p[1] - 0.005, p[2]], r: [0, Math.atan2(B[0] - A[0], B[2] - A[2]) + Math.PI / 2, Math.PI], mau: mau[i++ % 2], ao: 0 }); } } }
function veMeo(b, K) { const tuong = K.co('tuong_rao'), x = tuong ? 0.9 : 0.6, y = tuong ? 0.36 : 0.02, z = tuong ? 2.14 : 1.0, cam = 0xf0a04a, tr = 0xfff4e6; // mèo cam cuộn tròn ngủ
  b.cau(0.1, { p: [x, y + 0.05, z], s: [1, 0.55, 0.8], mau: cam, ao: 0.15 }, 2);
  for (let k = 0; k < 3; k++) b.cau(0.03, { p: [x - 0.05 + k * 0.05, y + 0.1, z], s: [0.4, 0.3, 1.9], mau: 0xd9822e, ao: 0 }, 1);
  b.cau(0.055, { p: [x + 0.09, y + 0.07, z + 0.03], mau: cam, ao: 0.1 }, 2); b.cau(0.03, { p: [x + 0.12, y + 0.055, z + 0.06], mau: tr, ao: 0 }, 1);
  for (const s of [1, -1]) { b.non(0.02, 0.04, { p: [x + 0.09 + s * 0.025, y + 0.125, z + 0.03], mau: cam, ao: 0 }, 4); hop(b, 0.018, 0.004, 0.004, 0, { p: [x + 0.105 + s * 0.02, y + 0.08, z + 0.08], mau: 0x3a2a2a, ao: 0 }); }
  b.geo(new T.TorusGeometry(0.09, 0.02, 6, 12, Math.PI * 1.1), { p: [x, y + 0.03, z], r: [Math.PI / 2, 0, 0.4], mau: cam, ao: 0.1 }); }

Object.assign(KIEU_NHA, {
  viet: { ten: 'Nhà Việt — ba gian Bắc Bộ',
    muc: [['nen_dat', 'vach_dat', 'mai_tranh', 'cua_phen', 'o_song_tre'], ['hien_tre', 'chong_tre'], ['chum_nuoc', 'dong_rom'], ['mai_ngoi_ta', 'bo_noc'], ['tuong_voi', 'cua_bang', 'cua_so_tien'],
      ['hien_go', 'bac_gach'], ['san_gach', 'chau_canh'], ['gian_muop', 'cay_cau'], ['rao_dam_but', 'cong_ngoi'], ['den_long', 'cau_doi', 'chau_mai']],
    mon: {
      nen_dat: { ten: 'Nền đất nện', o: 'nen', ve: veNenV }, vach_dat: { ten: 'Vách đất', o: 'tuong', ve: (b, K) => veTuongV(b, K, false) },
      mai_tranh: { ten: 'Mái tranh', o: 'mai', ve: veMaiTranh }, cua_phen: { ten: 'Cửa phên tre', o: 'cua', ve: veCuaPhen }, o_song_tre: { ten: 'Cửa sổ song tre', o: 'cua_so', ve: veSongTre },
      hien_tre: { ten: 'Hiên cột tre', o: 'hien', ve: veHienTre }, chong_tre: { ten: 'Chõng tre', ve: veChong },
      chum_nuoc: { ten: 'Chum nước', ve: veChum }, dong_rom: { ten: 'Đống rơm', ve: veDongRom },
      mai_ngoi_ta: { ten: 'Mái ngói ta', o: 'mai', ve: veMaiNgoiTa }, bo_noc: { ten: 'Bờ nóc đầu kìm', ve: veBoNoc },
      tuong_voi: { ten: 'Tường vôi vàng', o: 'tuong', ve: (b, K) => veTuongV(b, K, true) }, cua_bang: { ten: 'Cửa bức bàn', o: 'cua', ve: veCuaBang }, cua_so_tien: { ten: 'Cửa sổ song tiện', o: 'cua_so', ve: veCuaSoTien },
      hien_go: { ten: 'Cột gỗ chân tảng', o: 'hien', ve: veHienGo }, bac_gach: { ten: 'Bậc thềm gạch', ve: veBacGach },
      san_gach: { ten: 'Sân gạch đỏ', ve: veSanGach }, chau_canh: { ten: 'Chậu cây cảnh', ve: veChauCanh },
      gian_muop: { ten: 'Giàn mướp', ve: veGianMuop }, cay_cau: { ten: 'Cây cau', ve: veCayCau },
      rao_dam_but: { ten: 'Rào dâm bụt', ve: veRaoDamBut }, cong_ngoi: { ten: 'Cổng mái ngói', ve: veCongNgoi },
      den_long: { ten: 'Đèn lồng đỏ', ve: veDenLong }, cau_doi: { ten: 'Câu đối đỏ', ve: veCauDoi }, chau_mai: { ten: 'Chậu mai vàng', ve: veChauMai },
    } },
  nhat: { ten: 'Nhà Nhật — nhà gỗ',
    muc: [['nen_ke', 'vach_van', 'mai_van_da', 'cua_lua', 'o_mat_cao'], ['engawa', 'bac_da'], ['noren', 'tsukubai'], ['mai_kawara', 'noc_oni'], ['tuong_trang', 'cua_shoji', 'cua_so_tron'],
      ['den_da', 'loi_da'], ['vuon_soi', 'cay_thong'], ['rao_tre', 'ho_koi'], ['sakura', 'chuong_gio'], ['chochin', 'koinobori']],
    mon: {
      nen_ke: { ten: 'Sàn kê đá tảng', o: 'nen', ve: veNenJ }, vach_van: { ten: 'Vách ván dọc', o: 'tuong', ve: veVachVanDoc },
      mai_van_da: { ten: 'Mái ván đè đá', o: 'mai', ve: veMaiVanDa }, cua_lua: { ten: 'Cửa lùa gỗ', o: 'cua', ve: veCuaItado }, o_mat_cao: { ten: 'Cửa sổ mắt cáo', o: 'cua_so', ve: veOLuoi },
      engawa: { ten: 'Hiên gỗ engawa', ve: veEngawa }, bac_da: { ten: 'Đá bậc + guốc gỗ', ve: veBacDa },
      noren: { ten: 'Rèm noren', ve: veNoren }, tsukubai: { ten: 'Chậu đá rửa tay', ve: veTsukubai },
      mai_kawara: { ten: 'Mái ngói xám', o: 'mai', ve: veMaiKawara }, noc_oni: { ten: 'Ngói nóc onigawara', ve: veNocOni },
      tuong_trang: { ten: 'Tường trắng khung gỗ', o: 'tuong', ve: veTuongTrang }, cua_shoji: { ten: 'Cửa giấy shoji', o: 'cua', ve: veCuaShoji }, cua_so_tron: { ten: 'Cửa sổ shoji + ô tròn', o: 'cua_so', ve: veCuaSoTron },
      den_da: { ten: 'Đèn đá', ve: veDenDa }, loi_da: { ten: 'Lối đá bước', ve: veLoiDaJ },
      vuon_soi: { ten: 'Vườn sỏi cào', ve: veVuonSoi }, cay_thong: { ten: 'Thông cắt tỉa', ve: veCayThong },
      rao_tre: { ten: 'Rào tre', ve: veRaoTre }, ho_koi: { ten: 'Hồ cá koi', ve: veHoKoi },
      sakura: { ten: 'Cây anh đào', ve: veSakura }, chuong_gio: { ten: 'Chuông gió', ve: veChuongGio },
      chochin: { ten: 'Đèn lồng giấy', ve: veChochin }, koinobori: { ten: 'Cờ cá chép', ve: veKoinobori },
    } },
  hylap: { ten: 'Nhà Hy Lạp — nhà trắng đảo Cyclades',
    muc: [['be_da', 'tuong_da', 'mai_bang', 'cua_go_cu', 'o_cua_nho'], ['cau_thang', 'cua_so_go'], ['quet_voi', 'chum_gom'], ['mai_vom', 'lan_can'], ['cua_xanh', 'cua_so_xanh'],
      ['gian_nho', 'ban_ghe'], ['hoa_giay', 'chau_phong_lu'], ['san_soi', 'o_liu'], ['tuong_rao', 'cong_vom'], ['den_dong', 'co_day', 'meo_ngu']],
    mon: {
      be_da: { ten: 'Bệ đá', o: 'nen', ve: veBeGR }, tuong_da: { ten: 'Tường đá thô', o: 'tuong', ve: veTuongDaTho },
      mai_bang: { ten: 'Mái bằng xà gỗ', o: 'mai', ve: veMaiBang }, cua_go_cu: { ten: 'Cửa gỗ cũ', o: 'cua', ve: veCuaGoCu }, o_cua_nho: { ten: 'Ô cửa nhỏ', o: 'cua_so', ve: veOCuaNho },
      cau_thang: { ten: 'Cầu thang lên mái', ve: veCauThang }, cua_so_go: { ten: 'Cửa sổ gỗ', o: 'cua_so', ve: veCuaSoGoGR },
      quet_voi: { ten: 'Quét vôi trắng', o: 'tuong', ve: veQuetVoi }, chum_gom: { ten: 'Chum gốm', ve: veChumGom },
      mai_vom: { ten: 'Mái vòm xanh', ve: veMaiVom }, lan_can: { ten: 'Lan can sân thượng', ve: veLanCan },
      cua_xanh: { ten: 'Cửa vòm xanh dương', o: 'cua', ve: veCuaXanhGR }, cua_so_xanh: { ten: 'Cửa sổ chớp xanh', o: 'cua_so', ve: veCuaSoXanh },
      gian_nho: { ten: 'Giàn nho', ve: veGianNho }, ban_ghe: { ten: 'Bàn ghế xanh', ve: veBanGhe },
      hoa_giay: { ten: 'Hoa giấy', ve: veHoaGiay }, chau_phong_lu: { ten: 'Chậu phong lữ', ve: veChauPhongLu },
      san_soi: { ten: 'Sân sỏi khảm', ve: veSanSoi }, o_liu: { ten: 'Cây ô liu', ve: veOLiu },
      tuong_rao: { ten: 'Tường rào trắng', ve: veTuongRao }, cong_vom: { ten: 'Cổng vòm trắng', ve: veCongVomGR },
      den_dong: { ten: 'Đèn đồng', ve: veDenDong }, co_day: { ten: 'Cờ dây', ve: veCoDay }, meo_ngu: { ten: 'Mèo ngủ', ve: veMeo },
    } },
});
const MAT_SANG = new T.MeshBasicMaterial({ vertexColors: true }); // bóng đèn / kính đèn: không chịu sáng ⇒ trông như tự phát sáng
function nhaDoVat(kieu, muc) { // danh sách món của mức muc (món cùng ô: giữ món mới nhất)
  const KN = KIEU_NHA[kieu] || KIEU_NHA.go, o = {};
  KN.muc.slice(0, muc).forEach(ds => ds.forEach(id => { o[KN.mon[id].o || id] = id; }));
  return Object.values(o);
}
function nhaMoi(kieu, muc) { // muc: số 1..10 hoặc mảng id món đang có
  const KN = KIEU_NHA[kieu] || KIEU_NHA.go, ds = Array.isArray(muc) ? muc : nhaDoVat(kieu, Math.max(1, Math.min(KN.muc.length, muc || 1)));
  const co = new Set(ds), b = boMin(), gl = boMin(), g = new T.Group(), dong = [];
  const K = { co: id => co.has(id), g, dong, zThem: NG.D / 2 + (co.has('hien') ? HIEN.sau + 0.01 : 0.01), sang: false, khoi: null };
  for (const id in KN.mon) if (co.has(id)) KN.mon[id].ve(b, K, gl);
  g.add(b.xong());
  if (K.sang) { const m = gl.xong(MAT_SANG); m.castShadow = false; g.add(m); }
  if (K.khoi) { // khói ống khói: 4 cụm bay lên, to dần rồi tan
    const mat = new T.MeshStandardMaterial({ color: 0xf6f3ee, roughness: 1, transparent: true, opacity: 0.85, depthWrite: false }), geo = new T.IcosahedronGeometry(0.075, 1), cum = [];
    mat.userData.khongVien = true;
    for (let i = 0; i < 4; i++) { const m = new T.Mesh(geo, mat); m.castShadow = false; g.add(m); cum.push(m); }
    const [kx, ky, kz] = K.khoi;
    dong.push(tg => cum.forEach((m, i) => { const k = (tg * 0.3 + i / 4) % 1; m.position.set(kx + Math.sin(k * 4 + i) * 0.04 + k * 0.14, ky + k * 0.75, kz - k * 0.05);
      m.scale.setScalar((0.45 + k * 1.5) * (k < 0.75 ? 1 : (1 - k) / 0.25)); }));
  }
  g.userData.hd = tg => { for (const f of dong) f(tg); };
  g.userData.doVat = ds;
  return g;
}

// ---------- 4j. CHÓ — VẬT NUÔI CHÍNH: khung xương riêng + 16 động tác + tự chơi + vuốt ve ----------
// Khung: gốc (vị trí, hướng) → thân (tâm quay = khớp hông ⇒ ngồi / nằm / lăn quanh hông) → 4 chân · đuôi · đầu (→ 2 tai · mắt · hàm).
// Mỗi động tác = 1 hàm tư thế theo thời gian, điền mảng P. Đổi động tác thì TRỘN tư thế cũ–mới trong 0,35 s (cả 2 vẫn chạy nhịp
// riêng ⇒ không giật, không mất nhịp vẫy đuôi/bước chân). Độ dài theo đơn vị giống (trước khi phóng co) ⇒ ngồi/nằm tự khớp mọi giống.
const C_Y = 0, C_Z = 1, C_NG = 2, C_LAN = 3, C_CH = 4, C_DX = 12, C_DY = 13, C_DZ = 14, C_DH = 15, C_DT = 16, C_HAM = 17, C_MAT = 18, C_TX = 19, C_TZ = 20, C_DUX = 21, C_DUZ = 22, C_THO = 23, C_N = 24;
// chân: 0 trước-trái (+x) · 1 trước-phải · 2 sau-trái · 3 sau-phải; x > 0 = bàn chân lùi về sau, z > 0 = bàn chân sang trái
const chanP = (P, i, x, z) => { P[C_CH + i * 2] = x; P[C_CH + i * 2 + 1] = z || 0; };
const thoP = (P, t, f, a) => { P[C_THO] = Math.sin(t * f) * a; };
const nhinQuanh = (P, t, c) => { P[C_DY] += Math.sin(t * 0.55 + c.pha) * 0.5 * Math.max(0, Math.sin(t * 0.21 + c.pha)); P[C_DX] += Math.sin(t * 0.4 + c.pha * 2) * 0.05; };
function buocP(P, t, f, bd) { const s = Math.sin(t * f); chanP(P, 0, s * bd); chanP(P, 3, s * bd); chanP(P, 1, -s * bd); chanP(P, 2, -s * bd); P[C_Y] += Math.abs(Math.cos(t * f)) * 0.022 * bd; P[C_DX] += Math.sin(t * f * 2) * 0.05 * bd; }
const DT_CHO = { // ten: nhãn · dai: thời lượng mặc định (không có = lặp tới khi não/cảnh đổi)
  dung: { ten: 'Đứng chơi', f(P, t, c) { thoP(P, t, 2.4, 0.018); nhinQuanh(P, t, c); P[C_DUZ] = Math.sin(t * 5) * 0.22; if ((t + c.pha) % 3.7 < 0.16) P[C_TZ] = 0.28; } },
  di: { ten: 'Đi dạo', f(P, t, c) { buocP(P, t, 10, 0.5); P[C_DUZ] = Math.sin(t * 10) * 0.3; nhinQuanh(P, t * 0.6, c); } },
  chay: { ten: 'Chạy', f(P, t) { buocP(P, t, 16, 0.85); P[C_Y] += Math.abs(Math.sin(t * 16)) * 0.03; P[C_NG] = Math.sin(t * 16) * 0.05; P[C_TX] = 0.55; P[C_TZ] = Math.sin(t * 16) * 0.2; P[C_DUX] = -0.35; P[C_DUZ] = Math.sin(t * 20) * 0.35; P[C_HAM] = 0.3; } },
  ngoi: { ten: 'Ngồi', f(P, t, c) { const { th, ySit } = c.hs; P[C_Y] = ySit; P[C_NG] = -th; chanP(P, 0, th - 0.12); chanP(P, 1, th - 0.12); chanP(P, 2, th - 1.4, 0.18); chanP(P, 3, th - 1.4, -0.18);
    P[C_DX] = th - 0.1; nhinQuanh(P, t, c); thoP(P, t, 2.2, 0.02); P[C_DUX] = 0.45; P[C_DUZ] = Math.sin(t * 4) * 0.3; } },
  nam: { ten: 'Nằm dài', f(P, t, c) { P[C_Y] = c.hs.yLie; chanP(P, 0, -1.45, 0.1); chanP(P, 1, -1.45, -0.1); chanP(P, 2, 1.45, 0.22); chanP(P, 3, 1.45, -0.22);
    P[C_DX] = 0.06; nhinQuanh(P, t, c); thoP(P, t, 1.8, 0.025); P[C_DUX] = 0.7; P[C_DUZ] = Math.sin(t * 2.5) * 0.2; } },
  ngu: { ten: 'Ngủ', f(P, t, c, dt, chinh) { DT_CHO.nam.f(P, t, c); P[C_NG] = 0.04; P[C_DX] = 0.14; P[C_DY] = 0.22; P[C_DZ] = 0.62; P[C_DH] = -0.07; P[C_MAT] = 0.06; // má kê lên chân trước, mặt nghiêng lên P[C_TZ] = 0.14; P[C_DUX] = 0.9; P[C_DUZ] = 0.55; P[C_HAM] = 0;
    thoP(P, t, 1.3, 0.045); if (chinh) c.dangNgu = true; } },
  mung: { ten: 'Nhảy mừng', dai: 1.3, f(P, t) { const h = Math.max(0, Math.sin(t * 9)); P[C_Y] = h * 0.085; P[C_NG] = -h * 0.22; chanP(P, 0, -0.75 * h); chanP(P, 1, -0.75 * h); chanP(P, 2, 0.4 * h); chanP(P, 3, 0.4 * h);
    P[C_DX] = -0.25; P[C_HAM] = 0.35; P[C_MAT] = 0.4; P[C_TX] = 0.35; P[C_DUX] = -0.4; P[C_DUZ] = Math.sin(t * 22) * 0.7; } },
  xoay: { ten: 'Đuổi đuôi', dai: 2.8, f(P, t, c, dt, chinh) { const q = t < 2.1; if (chinh && q) c.g.rotation.y += dt * 8.5;
    buocP(P, t, 18, q ? 0.45 : 0); P[C_DY] = q ? 0.75 : 0; P[C_DZ] = q ? 0.2 : 0; P[C_DUZ] = q ? 0.75 : Math.sin(t * 20) * 0.4; P[C_HAM] = 0.3;
    if (!q) { const k = Math.max(0, 1 - (t - 2.1) / 0.7); P[C_LAN] = Math.sin(t * 9) * 0.12 * k; P[C_DZ] = Math.sin(t * 7) * 0.3 * k; P[C_MAT] = 0.5; } } }, // chóng mặt lảo đảo
  sua: { ten: 'Sủa', dai: 1.75, f(P, t, c, dt, chinh) { const u = t - 0.15, lan = Math.floor(u / 0.55), k = u - lan * 0.55, b = u > 0 && lan < 3 && k < 0.2 ? Math.sin(k / 0.2 * Math.PI) : 0;
    chanP(P, 0, -0.14); chanP(P, 1, -0.14); chanP(P, 2, 0.1); chanP(P, 3, 0.1); P[C_NG] = -0.05 * b; P[C_Y] = -0.012; P[C_DX] = -0.2 - 0.2 * b; P[C_DT] = 0.015 * b; P[C_HAM] = 0.55 * b; P[C_TX] = -0.15; P[C_DUX] = -0.3; P[C_DUZ] = Math.sin(t * 14) * 0.3;
    if (chinh && u > 0 && lan < 3 && c._sua !== lan) { c._sua = lan; c.phat('sua'); } } },
  gai: { ten: 'Gãi ngứa', dai: 2, f(P, t, c) { DT_CHO.ngoi.f(P, t, c); const { th } = c.hs, b = c.ben; chanP(P, b > 0 ? 2 : 3, th - 1.95 + Math.sin(t * 24) * 0.25, 0.95 * b); P[C_DZ] = -0.38 * b; P[C_DY] = 0.15 * b; P[C_MAT] = 0.3; P[C_LAN] = 0.08 * b; P[C_HAM] = 0.2; } },
  hit: { ten: 'Đánh hơi', f(P, t) { buocP(P, t, 7, 0.3); P[C_DX] = 0.55 + Math.sin(t * 28) * 0.025; P[C_DH] = -0.04; P[C_DY] = Math.sin(t * 2.5) * 0.3; P[C_TX] = -0.1; P[C_DUZ] = Math.sin(t * 7) * 0.3; } },
  an: { ten: 'Ăn', f(P, t, c, dt, chinh) { if (chinh) c.dangAn = true; chanP(P, 0, -0.1); chanP(P, 1, -0.1); P[C_NG] = 0.05; P[C_DX] = 0.72; P[C_DH] = -0.05; P[C_HAM] = Math.max(0, Math.sin(t * 9)) * 0.28; P[C_DUZ] = Math.sin(t * 12) * 0.4; P[C_MAT] = 0.7; } },
  dao: { ten: 'Đào đất', dai: 2.6, f(P, t, c, dt, chinh) { const s = Math.sin(t * 17); P[C_NG] = 0.2; P[C_Y] = -0.025; chanP(P, 0, -0.25 + s * 0.85); chanP(P, 1, -0.25 - s * 0.85); chanP(P, 2, 0.18); chanP(P, 3, 0.18);
    P[C_DX] = 0.35; P[C_DUX] = -0.4; P[C_DUZ] = Math.sin(t * 14) * 0.35; P[C_TX] = -0.1; if (chinh) c.dangDao = true; } },
  lan: { ten: 'Lăn ngửa bụng', dai: 3.5, f(P, t, c) { const hs = c.hs; DT_CHO.nam.f(P, t, c);
    const l = t < 0.5 ? 0 : t < 1 ? (t - 0.5) / 0.5 : t < 2.5 ? 1 : t < 3 ? 1 - (t - 2.5) / 0.5 : 0, e = l * l * (3 - 2 * l), g = e * Math.PI, w = Math.sin(t * 11);
    P[C_LAN] = g; P[C_Y] = hs.yLie + (hs.yBack - hs.yLie) * (1 - Math.cos(g)) / 2;
    const ch = [[-0.5 + w * 0.35, 0.35], [-0.5 - w * 0.35, -0.35], [0.3 - w * 0.3, 0.4], [0.3 + w * 0.3, -0.4]];
    for (let i = 0; i < 4; i++) { P[C_CH + i * 2] += (ch[i][0] - P[C_CH + i * 2]) * e; P[C_CH + i * 2 + 1] += (ch[i][1] - P[C_CH + i * 2 + 1]) * e; }
    P[C_DZ] = 0.25 * e; P[C_HAM] = 0.35 * e; P[C_MAT] = 1 - 0.6 * e; P[C_DUZ] = Math.sin(t * 18) * 0.5; } },
  bat_tay: { ten: 'Bắt tay', dai: 2.4, f(P, t, c) { DT_CHO.ngoi.f(P, t, c); const { th } = c.hs, l = Math.min(1, t / 0.35, (2.4 - t) / 0.35);
    chanP(P, c.ben > 0 ? 0 : 1, th - 0.12 - l * (1.25 + Math.sin(t * 7) * 0.18), 0.12 * l * c.ben); P[C_DX] = th - 0.2; P[C_DY] = 0; P[C_DZ] = -0.2 * l * c.ben; P[C_HAM] = 0.25; P[C_DUZ] = Math.sin(t * 16) * 0.45; } },
  nghieng: { ten: 'Nghiêng đầu', dai: 1.7, f(P, t) { thoP(P, t, 2.4, 0.018); const a = t < 0.75 ? Math.sin(Math.min(1, t / 0.25) * Math.PI / 2) : -Math.sin(Math.min(1, (t - 0.75) / 0.25) * Math.PI / 2);
    P[C_DZ] = 0.5 * a * Math.min(1, (1.7 - t) / 0.3); P[C_DX] = -0.1; P[C_TX] = -0.25; P[C_DUZ] = Math.sin(t * 6) * 0.25; } },
};
const TEX_CHU = {};
function chuSprite(chu, mau) { // chữ nổi (Gâu! · Zzz · ♥) = Sprite, không cần DOM ⇒ dùng được cả trong game lẫn trang xem thử
  const k = chu + mau;
  if (!TEX_CHU[k]) { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const x = cv.getContext('2d');
    x.font = '900 76px system-ui, "Segoe UI", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round'; x.lineWidth = 16; x.strokeStyle = '#fff'; x.strokeText(chu, 128, 68); x.fillStyle = mau; x.fillText(chu, 128, 68);
    TEX_CHU[k] = new T.CanvasTexture(cv); TEX_CHU[k].encoding = T.sRGBEncoding; }
  const s = new T.Sprite(new T.SpriteMaterial({ map: TEX_CHU[k], transparent: true, depthWrite: false })); s.visible = false; s.renderOrder = 5; return s;
}
const Y_THICH_CHO = [['dung', 3], ['di', 3], ['hit', 1.2], ['ngoi', 1.6], ['nam', 1], ['nghieng', 0.8], ['gai', 0.6], ['xoay', 0.4], ['dao', 0.5], ['ngu', 0.6], ['chay', 0.6], ['sua', 0.25], ['lan', 0.2]];
const TRO_CHO = ['bat_tay', 'lan', 'xoay', 'sua']; // vuốt ve lần 1, 2, 3, 4… chó đáp lại bằng trò khác nhau
function gocNgoi(G, R, L, dS) { // ngồi: ngả thân quanh hông tới khi mông (đáy elip thân) chạm đất mà vai vẫn vừa tầm chân trước
  const ry = 0.17 * 0.85 * (G.xoan ? 0.88 : 1), rz = 0.17 * (G.dai || 1.25) * (G.xoan ? 0.95 : 1), oz = -0.01 - R.chan[2][2], oy = 0.105;
  let th = 0.15, ySit = -L;
  for (let a = 0.15; a <= 0.9; a += 0.01) { const cy = oy * Math.cos(a) + oz * Math.sin(a), ext = Math.hypot(ry * Math.cos(a), rz * Math.sin(a)), piv = ext - cy + 0.004;
    if (piv + dS * Math.sin(a) > L * 0.98) break; th = a; ySit = piv - L; }
  return { th, ySit };
}
const geoCho = {};
function choMoi(giong, o) { // o: { co: phóng thêm, vung: {x, z, hw, hd} = tự chơi trong vùng (toạ độ của cha), toc }
  o = o || {};
  const id = GIONG_CHO[giong] ? giong : 'shiba', G = GIONG_CHO[id], R = LOAI_VAT['cho_' + id], H0 = [0, R.chan[2][1], R.chan[2][2]];
  if (!geoCho[id]) {
    const mk = (f, p) => { const b = boMin(); f(b); const g = b.xong().geometry; if (p) g.translate(-p[0], -p[1], -p[2]); return g; };
    geoCho[id] = { than: mk(R.than, H0), dau: mk(b => R.dauVe(b, { rieng: 1 })), chan: mk(R.chanVe), duoi: mk(R.duoiVe),
      tai: [1, -1].map(s => { const p = R.taiGoc(s); return [s, p, mk(b => R.taiVe(b, s), p)]; }), mat: mk(R.matVe, R.matGoc), ham: mk(R.hamVe, R.hamGoc) };
  }
  const GE = geoCho[id], luoi = geo => { const m = new T.Mesh(geo, MAT_MIN); m.castShadow = true; m.receiveShadow = true; return m; };
  const nhom = (cha, p, geo) => { const k = new T.Group(); if (p) k.position.set(p[0], p[1], p[2]); if (geo) k.add(luoi(geo)); cha.add(k); return k; };
  const rel = p => [p[0] - H0[0], p[1] - H0[1], p[2] - H0[2]];
  const g = new T.Group(); g.scale.setScalar(G.co * (o.co || 1));
  const than = nhom(g, H0), thanM = luoi(GE.than); than.add(thanM);
  const chan = R.chan.map(p => nhom(than, rel(p), GE.chan)), duoi = nhom(than, rel(R.duoi), GE.duoi);
  const dau0 = rel(R.dau), dau = nhom(than, dau0, GE.dau); dau.rotation.order = 'YXZ';
  const tai = GE.tai.map(([s, p, geo]) => [s, nhom(dau, p, geo)]), mat = nhom(dau, R.matGoc, GE.mat), ham = nhom(dau, R.hamGoc, GE.ham);
  const kt = G.tai[0], taiDao = kt === 'cup' || kt === 'bong' || kt === 'gap' ? -1 : 1, L = G.chan, dS = R.chan[0][2] - R.chan[2][2], kD = G.dauTo || 1;
  const c = { g, giong: id, ten: G.ten, pha: Math.random() * 6, hamNghi: G.luoi ? 0.14 : 0, chop: 1 + Math.random() * 3, chopK: 1,
    hs: Object.assign({ L, yLie: 0.045 - L, yBack: 0.255 - L }, gocNgoi(G, R, L, dS)),
    hanh: null, cu: null, tron: 1, P: new Float32Array(C_N), Pa: new Float32Array(C_N), Pb: new Float32Array(C_N),
    muc: null, vung: o.vung || null, chuoi: [], giu: false, huongMat: null, onSuKien: null, _sua: -1, daoT: 0, dangNgu: false, dangDao: false };
  const xoayVe = (goc, k) => { let l = goc - g.rotation.y; l = Math.atan2(Math.sin(l), Math.cos(l)); g.rotation.y += l * Math.min(1, k); };
  c.lam = (ten, dai) => { const A = DT_CHO[ten] || DT_CHO.dung; if (c.hanh) { c.cu = c.hanh; c.tron = 0; }
    c.hanh = { ten, A, t: 0, dai: dai != null ? dai : A.dai || 2 + Math.random() * 3 }; c._sua = -1; c.daoT = 0; c.ben = Math.random() < 0.5 ? 1 : -1; if (c.onSuKien) c.onSuKien('lam', ten); };
  c.diToi = (x, z, kieu) => { c.muc = { x, z }; c.lam(kieu || 'di', Infinity); };
  c.phat = ten => { if (ten === 'sua') c.hien('gau', 0.45); if (c.onSuKien) c.onSuKien(ten); };
  c.vuot = huong => { // HS vuốt ve: quay mặt ra, nghiêng đầu → nhảy mừng → 1 trò (lần sau trò khác)
    c.muc = null; c.soVuot = (c.soVuot || 0) + 1; if (huong != null) c.huongMat = huong;
    c.chuoi = [['mung', 1.3], [TRO_CHO[(c.soVuot - 1) % TRO_CHO.length]]]; c.lam('nghieng'); c.hien('tim', 1.3); if (c.onSuKien) c.onSuKien('vuot');
  };
  function chonTiep() {
    if (c.chuoi.length) { const [t, d] = c.chuoi.shift(); return c.lam(t, d); }
    if (c.giu) return c.lam(c.hanh.ten, c.hanh.A.dai || 4);
    c.huongMat = null;
    if (!c.vung) return c.lam('dung', 2 + Math.random() * 2);
    let tong = 0; for (const [, w] of Y_THICH_CHO) tong += w; let r = Math.random() * tong, ten = 'dung';
    for (const [t, w] of Y_THICH_CHO) { r -= w; if (r <= 0) { ten = t; break; } }
    if (ten === c.hanh.ten && ten !== 'dung' && ten !== 'di') ten = 'dung';
    if (ten === 'di' || ten === 'hit' || ten === 'chay') { const V = c.vung;
      for (let k = 0; k < 6; k++) { const x = V.x + (Math.random() - 0.5) * 2 * V.hw, z = V.z + (Math.random() - 0.5) * 2 * V.hd; if (Math.hypot(x - g.position.x, z - g.position.z) > (ten === 'chay' ? 0.8 : 0.35) || k === 5) return c.diToi(x, z, ten); } }
    const d = { dung: [2, 4], ngoi: [3, 6], nam: [4, 8], ngu: [6, 12] }[ten];
    c.lam(ten, d ? d[0] + Math.random() * (d[1] - d[0]) : undefined);
  }
  const tuThe = (P, H, chinh, dt) => { P.fill(0); P[C_MAT] = 1; P[C_HAM] = c.hamNghi; H.A.f(P, H.t, c, dt, chinh); };
  function apTuThe(P) {
    than.position.set(H0[0], H0[1] + P[C_Y], H0[2] + P[C_Z]); than.rotation.set(P[C_NG], 0, P[C_LAN]); thanM.scale.set(1, 1 + P[C_THO], 1 + P[C_THO] * 0.4);
    for (let i = 0; i < 4; i++) chan[i].rotation.set(P[C_CH + i * 2], 0, P[C_CH + i * 2 + 1]);
    dau.position.set(dau0[0], dau0[1] + P[C_DH], dau0[2] + P[C_DT]); dau.rotation.set(P[C_DX], P[C_DY], P[C_DZ]);
    ham.rotation.x = P[C_HAM]; mat.scale.y = Math.max(0.06, P[C_MAT] * c.chopK);
    for (const [s, k] of tai) k.rotation.set(-P[C_TX], 0, -s * P[C_TZ] * taiDao);
    duoi.rotation.set(-P[C_DUX], 0, P[C_DUZ]);
  }
  // chữ nổi + bụi đất + hố
  const bb = {};
  c.hien = (kieu, dai) => { if (!bb[kieu]) { bb[kieu] = chuSprite(kieu === 'gau' ? 'Gâu!' : kieu === 'tim' ? '♥' : 'Zzz', kieu === 'gau' ? '#e8762a' : kieu === 'tim' ? '#ff5f8a' : '#5b9bd8'); g.add(bb[kieu]); }
    const s = bb[kieu]; s.visible = true; s.userData.t = 0; s.userData.dai = dai; };
  const dinh = () => [0, R.dau[1] + 0.22 * kD + c.P[C_Y] + c.P[C_DH], R.dau[2] + 0.05];
  function capNhatPhu(dt, tg) {
    const p = dinh();
    for (const k of ['gau', 'tim']) { const s = bb[k]; if (!s || !s.visible) continue; const u = s.userData; u.t += dt; const e = u.t / u.dai; if (e >= 1) { s.visible = false; continue; }
      if (k === 'gau') { const sc = 0.5 * (0.75 + 0.35 * Math.sin(Math.min(1, e * 3) * Math.PI / 2)); s.position.set(p[0] + 0.14, p[1] + 0.1, p[2] + 0.12); s.scale.set(sc, sc / 2, 1); }
      else { s.position.set(p[0] + Math.sin(e * 7) * 0.04, p[1] + 0.04 + e * 0.32, p[2]); s.scale.set(0.34, 0.17, 1); s.material.opacity = 1 - e * e; } }
    if (c.dangNgu) { if (!bb.zzz) c.hien('zzz', 1e9); const s = bb.zzz, k = (tg * 0.45) % 1, sc = 0.16 + k * 0.16; s.visible = true;
      s.position.set(p[0] + 0.08 + k * 0.12, p[1] - 0.05 + k * 0.3, p[2] - 0.08); s.scale.set(sc * 2, sc, 1); s.material.opacity = Math.sin(k * Math.PI); }
    else if (bb.zzz) bb.zzz.visible = false;
    if (c.dangAn && !c.bat) { const b = boMin(); tien(b, [[0.001, 0], [0.085, 0], [0.1, 0.012], [0.105, 0.05], [0.092, 0.052], [0.08, 0.02], [0.001, 0.02]], { mau: 0xe0503c, ao: 0.2, doan: 16 });
      const r = rnd(9); for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = r() * 0.06; b.cau(0.016, { p: [Math.cos(a) * d, 0.035 + r() * 0.012, Math.sin(a) * d], mau: i % 3 ? 0xa8683a : 0xc98a4a, ao: 0 }, 0); }
      c.bat = b.xong(); c.bat.position.set(0, 0, R.dau[2] + 0.19); g.add(c.bat); }
    if (c.bat) c.bat.visible = c.dangAn;
    if (c.dangDao && !c.bui) { c.bui = []; const mb = new T.MeshStandardMaterial({ color: 0x8a6440, roughness: 1 }), gb = new T.IcosahedronGeometry(0.022, 0);
      for (let i = 0; i < 9; i++) { const m = new T.Mesh(gb, mb); m.visible = false; m.userData.v = new T.Vector3(); m.userData.song = 0; g.add(m); c.bui.push(m); } }
    if (c.bui) for (const m of c.bui) { const u = m.userData;
      if (m.visible && u.song > 0) { u.song -= dt; u.v.y -= 3 * dt; m.position.addScaledVector(u.v, dt); if (m.position.y < 0.012) { m.position.y = 0.012; u.v.set(0, 0, 0); } }
      else if (c.dangDao && Math.random() < dt * 8) { m.visible = true; u.song = 0.7; m.position.set((Math.random() - 0.5) * 0.1, 0.03, R.chan[0][2] + 0.06); u.v.set((Math.random() - 0.5) * 0.5, 0.7 + Math.random() * 0.45, -0.55 - Math.random() * 0.5); }
      else m.visible = false; }
    if (c.dangDao) { c.daoT += dt;
      if (g.parent) { if (!c.ho) { c.ho = new T.Mesh(new T.CircleGeometry(0.11, 16).rotateX(-Math.PI / 2), new T.MeshStandardMaterial({ color: 0x5a4230, roughness: 1 })); c.ho.receiveShadow = true; }
        if (c.ho.parent !== g.parent) g.parent.add(c.ho); const f = (R.chan[0][2] + 0.12) * g.scale.x;
        c.ho.position.set(g.position.x + Math.sin(g.rotation.y) * f, g.position.y + 0.004, g.position.z + Math.cos(g.rotation.y) * f); c.ho.scale.setScalar(Math.min(1, c.daoT / 1.2) * g.scale.x); c.hoT = 2.5; } }
    else if (c.ho && c.hoT > 0) { c.hoT -= dt; if (c.hoT < 1) c.ho.scale.setScalar(Math.max(0.001, c.hoT) * g.scale.x); if (c.hoT <= 0 && c.ho.parent) c.ho.parent.remove(c.ho); }
  }
  c.capNhat = (dt, tg) => {
    dt = Math.min(dt, 0.1); const h = c.hanh; h.t += dt; if (c.cu) c.cu.t += dt;
    if (c.muc) { const dx = c.muc.x - g.position.x, dz = c.muc.z - g.position.z, d = Math.hypot(dx, dz), v = (h.ten === 'chay' ? 0.95 : h.ten === 'hit' ? 0.14 : 0.3) * (o.toc || 1);
      if (d < 0.03) { c.muc = null; h.dai = 0; } else { const b = Math.min(d, v * dt); g.position.x += dx / d * b; g.position.z += dz / d * b; xoayVe(Math.atan2(dx, dz), dt * 6); } }
    else if (c.huongMat != null) xoayVe(c.huongMat, dt * 4);
    if (h.t >= h.dai) chonTiep();
    c.dangNgu = c.dangDao = c.dangAn = false;
    tuThe(c.Pb, c.hanh, true, dt);
    if (c.cu && c.tron < 1) { c.tron = Math.min(1, c.tron + dt / 0.35); tuThe(c.Pa, c.cu, false, dt); const e = c.tron * c.tron * (3 - 2 * c.tron); for (let i = 0; i < C_N; i++) c.P[i] = c.Pa[i] + (c.Pb[i] - c.Pa[i]) * e; }
    else { c.cu = null; c.P.set(c.Pb); }
    c.chop -= dt; if (c.chop < 0) { c.chopK = 0.08; if (c.chop < -0.13) { c.chop = 2 + Math.random() * 3.5; c.chopK = 1; } } // chớp mắt
    apTuThe(c.P); capNhatPhu(dt, tg || 0);
  };
  c.lam('dung', 1 + Math.random() * 2);
  return c;
}

// ---------- 5. HẬU KỲ: cảnh → (mờ nửa phân giải) → chỉnh màu + tilt-shift → màn hình ----------
const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
function matLam() { // làm mờ gauss 9 mẫu theo 1 hướng (d = bước theo uv)
  return new T.ShaderMaterial({
    uniforms: { t: { value: null }, d: { value: new T.Vector2() } },
    vertexShader: VS, depthTest: false, depthWrite: false,
    fragmentShader: `uniform sampler2D t; uniform vec2 d; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(t, vUv).rgb * 0.2270;
        c += (texture2D(t, vUv + d * 1.3846).rgb + texture2D(t, vUv - d * 1.3846).rgb) * 0.3162;
        c += (texture2D(t, vUv + d * 3.2308).rgb + texture2D(t, vUv - d * 3.2308).rgb) * 0.0703;
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
}
function taoHauKy(R) {
  const gl2 = R.capabilities.isWebGL2, noi = gl2 && (R.extensions.has('EXT_color_buffer_float') || R.extensions.has('EXT_color_buffer_half_float'));
  const kieu = { type: noi ? T.HalfFloatType : T.UnsignedByteType, format: T.RGBAFormat, minFilter: T.LinearFilter, magFilter: T.LinearFilter };
  const rt = gl2 ? new T.WebGLMultisampleRenderTarget(4, 4, kieu) : new T.WebGLRenderTarget(4, 4, kieu);
  if (gl2) rt.samples = 4;
  const moA = new T.WebGLRenderTarget(4, 4, kieu), moB = new T.WebGLRenderTarget(4, 4, kieu);
  const quad = new T.Mesh(new T.PlaneGeometry(2, 2)), camQ = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), scQ = new T.Scene(); quad.frustumCulled = false; scQ.add(quad);
  const lamH = matLam(), lamV = matLam();
  const M = TS.mau;
  const mauF = new T.ShaderMaterial({
    uniforms: {
      tNet: { value: null }, tMo: { value: null }, uRes: { value: new T.Vector2(1, 1) }, uTg: { value: 0 },
      uPhoi: { value: M.phoi }, uBaoHoa: { value: M.baoHoa }, uTuongPhan: { value: M.tuongPhan }, uAm: { value: M.am },
      uTach: { value: M.tach }, uMauBong: { value: new T.Vector3(...M.mauBong) }, uMauSang: { value: new T.Vector3(...M.mauSang) },
      uNangDen: { value: M.nangDen }, uVignette: { value: M.vignette }, uMauVien: { value: new T.Vector3(...M.mauVien) }, uHat: { value: M.hat },
      uTilt: { value: TS.tilt.bat ? 1 : 0 }, uTiltRong: { value: TS.tilt.rong }, uTiltMem: { value: TS.tilt.mem },
    },
    vertexShader: VS, depthTest: false, depthWrite: false,
    fragmentShader: `
      uniform sampler2D tNet, tMo; uniform vec2 uRes; uniform float uTg;
      uniform float uPhoi, uBaoHoa, uTuongPhan, uAm, uTach, uNangDen, uVignette, uHat, uTilt, uTiltRong, uTiltMem;
      uniform vec3 uMauBong, uMauSang, uMauVien;
      varying vec2 vUv;
      // Khronos PBR Neutral tone mapper (2024): nén vùng sáng, giữ nguyên sắc độ màu pastel
      vec3 neutral(vec3 c) {
        const float bd = 0.76; const float khu = 0.15;
        float x = min(c.r, min(c.g, c.b));
        float lech = x < 0.08 ? x - 6.25 * x * x : 0.04;
        c -= lech;
        float dinh = max(c.r, max(c.g, c.b));
        if (dinh < bd) return c;
        const float d = 1.0 - bd;
        float dinhMoi = 1.0 - d * d / (dinh + d - bd);
        c *= dinhMoi / dinh;
        float g = 1.0 - 1.0 / (khu * (dinh - dinhMoi) + 1.0);
        return mix(c, vec3(dinhMoi), g);
      }
      float bam(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      void main() {
        vec3 c = texture2D(tNet, vUv).rgb;
        if (uTilt > 0.0) { float k = smoothstep(uTiltRong, uTiltRong + uTiltMem, abs(vUv.y - 0.5)) * uTilt; c = mix(c, texture2D(tMo, vUv).rgb, k); }
        c = neutral(max(c, 0.0) * uPhoi);
        vec3 g = pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2));                       // chỉnh màu trong không gian mắt nhìn
        g *= vec3(1.0 + uAm * 0.6, 1.0 + uAm * 0.12, 1.0 - uAm * 0.7);            // cân trắng ấm
        float l = dot(g, vec3(0.2126, 0.7152, 0.0722));
        g = mix(g, g * uMauBong, (1.0 - smoothstep(0.05, 0.6, l)) * uTach * 1.3);  // bóng ngả tím-xanh
        g = mix(g, g * uMauSang, smoothstep(0.45, 1.0, l) * uTach);               // sáng ngả ấm
        g = (g - 0.5) * uTuongPhan + 0.5;
        l = dot(g, vec3(0.2126, 0.7152, 0.0722));
        g = mix(vec3(l), g, uBaoHoa);
        g += uNangDen * uMauBong * (1.0 - g);                                    // không bao giờ đen tuyền
        vec2 q = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
        g = mix(g, g * uMauVien, smoothstep(0.3, 1.1, length(q) * 1.2) * uVignette); // tối mép có màu
        g += (bam(vUv * uRes + fract(uTg) * 531.0) - 0.5) * uHat * (1.0 - l * 0.6); // hạt phim rất nhẹ
        gl_FragColor = vec4(clamp(g, 0.0, 1.0), 1.0);
      }`,
  });
  let W = 4, H = 4;
  const ve = (m, dich) => { quad.material = m; R.setRenderTarget(dich); R.render(scQ, camQ); };
  return {
    setSize(w, h) { // w,h = kích thước bộ đệm vẽ (đã nhân pixelRatio)
      W = w; H = h; rt.setSize(w, h); const w2 = Math.max(1, w >> 1), h2 = Math.max(1, h >> 1); moA.setSize(w2, h2); moB.setSize(w2, h2);
      lamH.uniforms.d.value.set(1.6 / w2, 0); lamV.uniforms.d.value.set(0, 1.6 / h2); mauF.uniforms.uRes.value.set(w, h);
    },
    setMsaa(n) { if (gl2 && rt.samples !== n) { rt.samples = n; rt.dispose(); } },
    tatTilt() { TS.tilt.bat = false; },
    render(sc, cam, tg, tilt) { // tilt: 0..1 — độ mờ trên/dưới (phóng gần thì giảm để không che chỗ đang chơi)
      R.setRenderTarget(rt); R.render(sc, cam);
      const tt = TS.tilt.bat ? (tilt == null ? 1 : tilt) * TS.tilt.max : 0; mauF.uniforms.uTilt.value = tt;
      if (tt > 0) {
        lamH.uniforms.t.value = rt.texture; ve(lamH, moA);
        lamV.uniforms.t.value = moA.texture; ve(lamV, moB);
        lamH.uniforms.t.value = moB.texture; ve(lamH, moA);
        lamV.uniforms.t.value = moA.texture; ve(lamV, moB);
      }
      mauF.uniforms.tNet.value = rt.texture; mauF.uniforms.tMo.value = moB.texture; mauF.uniforms.uTg.value = tg || 0;
      ve(mauF, null);
    },
    TS,
  };
}

// ---------- 6. BÓNG TIẾP ĐẤT: chụp chiều cao từ trên xuống → làm mờ → tấm phủ nhân màu sát mặt đất ----------
function taoBongDat(R, sc, vung) { // vung: {x0,x1,z0,z1}
  const N = 1024, CAO = 14, cx = (vung.x0 + vung.x1) / 2, cz = (vung.z0 + vung.z1) / 2, rx = (vung.x1 - vung.x0) / 2, rz = (vung.z1 - vung.z0) / 2;
  const camT = new T.OrthographicCamera(-rx, rx, rz, -rz, 0.01, CAO - 0.05); // bỏ mọi thứ thấp hơn 5 cm (nền, đường, nước)
  camT.position.set(cx, CAO, cz); camT.up.set(0, 0, -1); camT.lookAt(cx, 0, cz); camT.updateMatrixWorld();
  const kieu = { minFilter: T.LinearFilter, magFilter: T.LinearFilter, format: T.RGBAFormat };
  const rtCao = new T.WebGLRenderTarget(N, N, kieu), rtA = new T.WebGLRenderTarget(N, N, kieu), rtB = new T.WebGLRenderTarget(N, N, kieu);
  const matSau = new T.MeshDepthMaterial({ depthPacking: T.BasicDepthPacking, side: T.DoubleSide });
  const quad = new T.Mesh(new T.PlaneGeometry(2, 2)), camQ = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), scQ = new T.Scene(); quad.frustumCulled = false; scQ.add(quad);
  // chiều cao → trọng số (vật nào cũng có tối thiểu; vật cao ≥ 2 m đậm nhất), rồi làm mờ
  const matTrong = new T.ShaderMaterial({ uniforms: { t: { value: rtCao.texture } }, vertexShader: VS, depthTest: false, depthWrite: false,
    fragmentShader: `uniform sampler2D t; varying vec2 vUv; void main(){ float h = texture2D(t, vUv).r * ${CAO.toFixed(1)}; float w = h > 0.02 ? 0.45 + 0.55 * clamp(h / 2.0, 0.0, 1.0) : 0.0; gl_FragColor = vec4(vec3(w), 1.0); }` });
  const lamH = matLam(), lamV = matLam();
  const matAO = new T.ShaderMaterial({ uniforms: { t: { value: rtB.texture }, uManh: { value: TS.bongDat.manh }, uMau: { value: new T.Vector3(...TS.bongDat.mau) } }, vertexShader: VS, depthTest: false, depthWrite: false,
    fragmentShader: `uniform sampler2D t; uniform float uManh; uniform vec3 uMau; varying vec2 vUv; void main(){ float w = texture2D(t, vUv).r; gl_FragColor = vec4(mix(vec3(1.0), uMau, clamp(w * uManh, 0.0, 1.0)), 1.0); }` });
  const rtAO = new T.WebGLRenderTarget(N, N, kieu);
  const tam = new T.Mesh(new T.PlaneGeometry(rx * 2, rz * 2).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ map: rtAO.texture, blending: T.MultiplyBlending, transparent: true, depthWrite: false, fog: false, toneMapped: false }));
  tam.position.set(cx, 0.035, cz); tam.renderOrder = 6; tam.userData.khongVien = true; sc.add(tam);
  const ve = (m, dich) => { quad.material = m; R.setRenderTarget(dich); R.render(scQ, camQ); };
  const _cc = new T.Color();
  function capNhat() {
    const an = []; sc.traverse(o => { if ((o.isSprite || o === tam) && o.visible) { o.visible = false; an.push(o); } });
    const cuMat = sc.overrideMaterial, cuNen = sc.background, cuSm = sc.fog, cuAuto = R.shadowMap.autoUpdate, cuMau = R.getClearColor(_cc).getHex(), cuA = R.getClearAlpha();
    sc.overrideMaterial = matSau; sc.background = null; sc.fog = null; R.shadowMap.autoUpdate = false; R.setClearColor(0x000000, 1);
    R.setRenderTarget(rtCao); R.clear(); R.render(sc, camT);
    sc.overrideMaterial = cuMat; sc.background = cuNen; sc.fog = cuSm; R.shadowMap.autoUpdate = cuAuto; R.setClearColor(cuMau, cuA);
    an.forEach(o => { o.visible = true; });
    ve(matTrong, rtA);                                   // rtA = trọng số
    const px = 1 / N;
    for (let i = 0; i < 2; i++) {                        // 2 lượt mờ (0,12 m/điểm ảnh): loang ~0,5 m rồi làm mịn
      const buoc = px * (i ? 0.9 : 1.6);
      lamH.uniforms.t.value = (i ? rtB : rtA).texture; lamH.uniforms.d.value.set(buoc, 0); ve(lamH, rtTam);
      lamV.uniforms.t.value = rtTam.texture; lamV.uniforms.d.value.set(0, buoc); ve(lamV, rtB);
    }
    ve(matAO, rtAO);
    R.setRenderTarget(null);
  }
  const rtTam = new T.WebGLRenderTarget(N, N, kieu);
  return { capNhat, tam };
}

window.NT_DOHOA = { moi, TS, nuongMau, gaMoi, vatMoi, cayMoi, trangThaiO, tenPha, coCay: id => !!CAY_MOI[id], CAY_MOI, nhaMoi, nhaDoVat, KIEU_NHA, choMoi, DT_CHO, GIONG_CHO, GIONG_GA, GIONG_BO, ganGio, gio: t => { GIO.value = t; }, boMin, taoHauKy, taoBongDat };
})();
