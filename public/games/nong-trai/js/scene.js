/* Nông Trại BK — CẢNH 3D: bố trí nông trại, camera (kéo/phóng), chạm & vuốt (gieo/gặt nhiều ô), đồng bộ hình theo state,
   hiệu ứng "juice" (nảy khi chạm, hạt bay, khói, bướm, con vật nhún nhảy).
   Không chứa luật: chỉ đọc state (qua NT_ENGINE) và báo thao tác cho ui.js qua callback. */
(function () {
'use strict';
const T = THREE, M = NT_MODELS, D = NT_DATA, E = NT_ENGINE;
const DH = window.NT_DOHOA, MOI = !!(DH && DH.moi); // lớp hoàn thiện đồ hoạ (js/dohoa.js) — ?dohoa=cu để xem bản cũ
let hk = null, bongDat = null, canBong = false, tBong = 0;

// ---------- BỐ TRÍ GỌN kiểu Nông trại vui vẻ (CEO 30/09, kèm ảnh mẫu: "bố cục như này thôi, không cần quá rộng, mình đâu có làm giống Hay Day") ----------
// Ruộng lớn bên trái · sân đất có rào bên phải (nhà, kho, chuồng gà, chuồng bò, chó) · ao góc dưới · chợ + bảng tin lớp bên trái.
// Camera nhìn từ nam–đông nam (HUONG): +x = sang phải (hơi xuống) · −z = lên trên (hơi sang phải) trên màn hình.
const VT = {
  ruong: { x: -8.65, z: -0.6, cot: 4, buoc: 2.45, co: 2.2 },    // 12 ô (4 × 3) liền nhau như ô đất Nông trại vui vẻ; co = cỡ 1 ô (m)
  san: { x0: 1.0, x1: 9.2, z0: -10.2, z1: -3.2, cong: 5.1 },    // sân đất có rào (góc trên phải màn); cong = x của cổng ở cạnh trước
  nha: { x: 4.6, z: -8.5, rong: 3.2 },
  barn: { x: 8.0, z: -8.7, rong: 2.0 },
  silo: null,                                                 // bỏ (thế giới Hay Day) — chạm kho nào cũng là mở kho
  bang: { x: -8.2, z: -4.8 },                                 // bảng tin lớp (chỗ bảng "Lịch canh tác")
  sap: { x: -13.2, z: 2.9, rong: 2.4 },                       // chợ
  chuong: { ga: { x: 3.0, z: -4.9, w: 3.4, d: 2.4 }, bo: { x: 7.1, z: -5.0, w: 3.6, d: 2.8 } },
  lo: { x: 1.9, z: -8.9, rong: 1.6 },
  trangTri: [[-12.4, -1.6], [-12.2, 6.8], [-5.0, 7.8], [1.4, 6.6], [10.9, -4.4], [11.0, -9.0], [-0.8, -5.4], [-3.8, -6.8]],
  meo: { x: 2.0, z: -7.2 }, chim: { x: 8.4, z: -7.2 },
  hopThu: { x: 6.9, z: -2.4 },
  ao: { x: 9.4, z: 1.0, rx: 2.3, rz: 1.6 },                    // ao góc dưới phải (như ảnh)
  cho: { x: 5.0, z: -1.7, hw: 0.6, hd: 0.5 }, nhaCho: { x: 3.3, z: -1.6 },   // chó giữ trại ngay trước cổng sân
  bien: { x0: -16, x1: 13.5, z0: -13.2, z1: 9.8 },
};
const CAO_LO = 2.2, KHOI_LO = [0.55, 2.0, -0.35];
// con vật Quaternius: chiều dài đích (kiểu chibi — nhỏ, tròn) + góc lệch hướng mặt của mô hình
const Q_DAI = { bo: 1.15, cho: 0.6 }, Q_XOAY = 0;

let R, sc, cam, cv, lopNhan, cb = {};
const muc = new T.Vector3(-11, 0, -6); let kc = 28;
// góc nhìn = góc ảnh Nông trại vui vẻ: hàng ô ruộng chạy chéo xuống phải thoai thoải, cột ô chạy chéo xuống trái dốc (camera lệch ~30°, ngẩng ~44°).
// Nhà trang trí (dohoa.js) cũng dựng theo đúng góc này.
const HUONG = new T.Vector3(0.55, 1.05, 0.95).normalize();
// ---------- KHUNG NHÌN GỌN (CEO 30/09: bố cục kiểu Nông trại vui vẻ — 1 màn thấy trọn nông trại, không cần bản đồ rộng) ----------
// toạ độ khung đo theo trục màn hình trên mặt đất: PHAI (sang phải) · XUONG (xuống dưới màn hình)
const PHAI = new T.Vector3(), XUONG = new T.Vector3(), _k = new T.Vector3();
{ const f = new T.Vector3(-HUONG.x, 0, -HUONG.z).normalize(); PHAI.set(-f.z, 0, f.x); XUONG.copy(f).negate(); }
// KHUNG_VUA = cỡ mặc định: trọn ruộng + sân nhà (chợ, ao lấp ló) · KHUNG = vùng được kéo tới
const GOC_KHUNG = new T.Vector3(-1, 0, -2);
function khungTu(ds, dem) { const K = { r: [1e9, -1e9], d: [1e9, -1e9] }; for (const [x, z] of ds) { _k.set(x - GOC_KHUNG.x, 0, z - GOC_KHUNG.z); const r = _k.dot(PHAI), d = _k.dot(XUONG); K.r[0] = Math.min(K.r[0], r - dem); K.r[1] = Math.max(K.r[1], r + dem); K.d[0] = Math.min(K.d[0], d - dem); K.d[1] = Math.max(K.d[1], d + dem); } return K; }
const KHUNG_VUA = (() => { const R0 = VT.ruong, S0 = VT.san, A0 = VT.ao, n = R0.co / 2, x1 = R0.x + (R0.cot - 1) * R0.buoc + n, z1 = R0.z + 2 * R0.buoc + n;
  const loi = [[R0.x - n, R0.z - n], [x1, R0.z - n], [R0.x - n, z1], [x1, z1], [S0.x0, S0.z0], [S0.x1, S0.z0], [S0.x0, S0.z1], [S0.x1, S0.z1]];   // ruộng + sân
  const dt = khungTu(loi, 0.5), ip = khungTu(loi.concat([[A0.x + A0.rx * 0.5, A0.z], [VT.sap.x, VT.sap.z]]), 0.9);
  dt.d[0] -= 1.6; ip.d[0] -= 1.6; return { dt, ip }; })();                          // nóc nhà cao hơn mặt sân
const KHUNG = { r: [KHUNG_VUA.ip.r[0] - 3, KHUNG_VUA.ip.r[1] + 3], d: [KHUNG_VUA.ip.d[0] - 1, KHUNG_VUA.ip.d[1] + 4] };
// điện thoại ngang (màn dẹt): chỉ ôm ruộng + sân cho ô to; iPad (màn cao hơn): ôm thêm chợ + ao. Màn dọc chỉ hiện lời nhắc xoay máy (CEO 30/09: chơi màn ngang)
const khungVua = () => cam.aspect > 1.75 ? KHUNG_VUA.dt : KHUNG_VUA.ip;
let kcVua = 30, leTren = 0, leDuoi = 0;   // lề bị HUD trên / thanh dụng cụ dưới che (px)
function tinhKhung() { // điện thoại dọc: bề ngang quyết định · máy ngang: bề dọc (chiều sâu mặt đất bị thu ngắn theo góc nhìn)
  const K = khungVua(), vf = cam.fov * Math.PI / 180, rong = (K.r[1] - K.r[0]) / 2, cao = (K.d[1] - K.d[0]) / 2 * HUONG.y;
  const h = cv.clientHeight || 1, huu = Math.max(160, h - leTren - leDuoi) / h;   // phần màn không bị HUD che
  return Math.max(rong / (Math.tan(vf / 2) * cam.aspect), cao / (Math.tan(vf / 2) * huu)) * 1.05;
}
function vaoGiua() { const K = khungVua(); muc.copy(GOC_KHUNG).addScaledVector(PHAI, (K.r[0] + K.r[1]) / 2).addScaledVector(XUONG, (K.d[0] + K.d[1]) / 2 - 0.8); }
const pick = [], ruongO = [], vatO = {}, chuongO = {}, nhan = {}, khoG = {}, ttO = [];
for (const k in D.VAT) vatO[k] = [];
const hoangRuong = [];
let bangO, xeO, sapO, sapLo, sapNeo, sapHoang, giayO = [], aoO = null, choO = null, choNuoi = null, choVuotT = -99, buomDs = [], sCuoi = null, meoO = null, chimO = null, loO = null, hopThuO = null, soGiay = -1;
const clock = new T.Clock(); let tg = 0;

function init(canvas, overlay, callbacks) {
  cv = canvas; lopNhan = overlay; cb = callbacks;
  R = new T.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  R.outputEncoding = T.sRGBEncoding; R.toneMapping = T.NoToneMapping; // không ACES: giữ màu tươi kiểu hoạt hình
  R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  sc = new T.Scene();
  const chanTroi = new T.Color(MOI ? DH.TS.suongMu : 0xd9f1ff);
  sc.fog = new T.Fog(chanTroi.clone().convertSRGBToLinear().getHex(), 55, 110);
  sc.add(bauTroi());
  cam = new T.PerspectiveCamera(24, 1, 0.5, 400);   // ống kính hẹp ⇒ gần kiểu nhìn phẳng (isometric) của Nông trại vui vẻ, ô gần – ô xa to như nhau
  if (MOI) sc.add(new T.HemisphereLight(new T.Color(DH.TS.troi.tren).convertSRGBToLinear(), new T.Color(DH.TS.troi.duoi).convertSRGBToLinear(), DH.TS.troi.manh)); // đất hắt màu be, không hắt xanh
  else sc.add(new T.HemisphereLight(new T.Color(0xfff8ee).convertSRGBToLinear(), new T.Color(0x8fcf5a).convertSRGBToLinear(), 0.8));
  const sun = new T.DirectionalLight(new T.Color(MOI ? DH.TS.nang.mau : 0xffe9c9).convertSRGBToLinear(), MOI ? DH.TS.nang.manh : 1.05); sun.position.set(-12, 22, 15); sun.target.position.set(-2, 0, -1);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 22, bottom: -22, near: 1, far: 80 });
  sc.add(sun, sun.target);
  dungTheGioi();
  dungNhaMay();
  dungTrangTri();
  if (MOI) { hk = DH.taoHauKy(R); bongDat = DH.taoBongDat(R, sc, { x0: -72, x1: 52, z0: -62, z1: 58 }); canBong = true; }
  ganInput();
  doiCo(); addEventListener('resize', doiCo);
  R.setAnimationLoop(() => khung());
}
function bauTroi() { // vòm trời chuyển màu: xanh đậm trên đỉnh → xanh nhạt ở chân trời
  const g = new T.SphereGeometry(300, 24, 16), top = new T.Color(0x6ec3ff), bot = new T.Color(0xdff3ff), c = new T.Color(), col = [];
  for (let i = 0; i < g.attributes.position.count; i++) { const y = g.attributes.position.getY(i) / 300; c.copy(bot).lerp(top, Math.max(0, Math.min(1, y * 2.2))).convertSRGBToLinear(); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  return new T.Mesh(g, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide, fog: false, depthWrite: false }));
}
function doiCo() { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; R.setSize(w, h, false); if (hk) { const v = R.getDrawingBufferSize(new T.Vector2()); hk.setSize(v.x, v.y); } cam.aspect = w / h;
  if (leTren || leDuoi) cam.setViewOffset(w, h, 0, -(leTren - leDuoi) / 2, w, h); else cam.clearViewOffset(); // canh giữa khoảng trống giữa HUD và thanh dụng cụ
  cam.updateProjectionMatrix(); const cu = kcVua; kcVua = tinhKhung(); if (!doiCo.lan++) { kc = kcVua; vaoGiua(); } else kc *= kcVua / cu; }
doiCo.lan = 0;
function datCam() {
  _k.copy(muc).sub(GOC_KHUNG); // chỉ kéo trong khung nông trại, phóng quanh cỡ vừa khung
  const r = Math.max(KHUNG.r[0], Math.min(KHUNG.r[1], _k.dot(PHAI))), d = Math.max(KHUNG.d[0], Math.min(KHUNG.d[1], _k.dot(XUONG)));
  muc.copy(GOC_KHUNG).addScaledVector(PHAI, r).addScaledVector(XUONG, d);
  kc = Math.max(kcVua * 0.55, Math.min(kcVua * 1.15, kc));
  cam.position.copy(muc).addScaledVector(HUONG, kc); cam.lookAt(muc);
}
const chonDuoc = (o, chon) => { o.userData.chon = chon; return o; };
function hopCham(w, h, d, chon) { // khối vô hình để chạm trúng dễ
  const m = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshBasicMaterial()); m.visible = false; m.position.y = h / 2;
  chonDuoc(m, chon); pick.push(m); return m;
}
function dat(o, x, z, xoay) { o.position.set(x, 0, z); if (xoay) o.rotation.y = xoay; sc.add(o); return o; }
function neo(x, z) { const g = new T.Group(); g.position.set(x, 0, z); sc.add(g); return g; }

// ---------- MẶT ĐẤT kiểu Hay Day: cỏ có vân, đường đất mép mềm, đường cái, suối, hồ ----------
// Đường = dải (ribbon) bám đường cong Catmull-Rom qua các điểm [x,z]; mép mờ dần vào cỏ nhờ texture có kênh alpha.
// thon = [m thon đầu, m thon cuối] (0 = cắt thẳng — chỉ dùng chỗ bị cầu/đường khác che)
// DUONG · SUOI · HO · CAU: thế giới rộng kiểu Hay Day — KHÔNG còn vẽ từ 30/09 (bố cục gọn kiểu Nông trại vui vẻ); giữ số liệu để tham chiếu
const DUONG = [
  { loai: 'cai', w: 3.0, d: [[-28.2, -95], [-27.2, -55], [-26.4, -32], [-26.2, -21.4]] },                       // đường cái (phía bắc cầu)
  { loai: 'cai', w: 3.0, d: [[-26.2, -17.0], [-26.2, -4], [-26.2, 12], [-25.5, 34], [-24.0, 62], [-22.2, 95]] },  // đường cái (phía nam cầu)
  { loai: 'dat', w: 1.55, d: [[-26.2, -9.9], [-23.6, -10.1], [-21.4, -10.9], [-18.8, -11.45], [-15.8, -11.35], [-13.8, -11.25], [-10.2, -11.45], [-7.0, -11.35],
    [-4.4, -11.6], [-1.3, -11.75], [1.5, -11.2], [2.95, -9.4], [2.9, -6.0], [2.75, -1.6], [2.9, 3.0], [2.8, 7.6], [2.5, 11.0], [4.6, 12.1], [9.0, 12.4], [13.5, 11.7], [17.6, 11.1], [18.9, 11.0]] }, // cổng → nhà → dọc kho → vòng xuống chuồng → cầu đông
  { loai: 'dat', w: 1.4, d: [[-26.2, 5.3], [-23.4, 5.4], [-19.8, 5.6], [-16.0, 5.3], [-12.0, 5.7], [-8.0, 5.4], [-4.2, 5.6], [-0.8, 5.3], [2.8, 5.4]] }, // dưới bãi bò
  { loai: 'dat', w: 1.25, thon: [0, 4], d: [[21.7, 10.9], [25.5, 10.6], [30.0, 11.6], [35.0, 11.0]] },                                                                   // qua cầu đông vào rừng
];
const SUOI = { w: 2.7, d: [[-80, -15.5], [-52, -18.0], [-38, -18.9], [-26.2, -19.2], [-14, -19.7], [0, -19.1], [11, -19.8], [17.4, -18.1], [20.4, -12.5], [19.9, -4.5], [20.5, 3.5], [20.3, 11.0], [19.4, 16.4], [16.6, 19.8], [14.2, 21.6]] };
const HO = { x: 12.6, z: 23.0, rx: 6.4, rz: 3.7 };
const CAU = [{ x: -26.2, z: -19.2, dai: 4.8, rong: 3.4, xoay: Math.PI / 2 }, { x: 20.3, z: 11.0, dai: 3.9, rong: 1.7, xoay: 0 }];
const MAU_DUONG = []; // mẫu dọc mọi dải {x,z,r} — cấm rải cây/trang trí đè lên
let luoiDuong = null, texSuoi = null, texHo = null, vitDs = [];
function ganDuong(x, z, pad) {
  if (!luoiDuong) { luoiDuong = new Map(); for (const p of MAU_DUONG) { const k = Math.floor(p.x / 4) + ',' + Math.floor(p.z / 4); if (!luoiDuong.has(k)) luoiDuong.set(k, []); luoiDuong.get(k).push(p); } }
  const gx = Math.floor(x / 4), gz = Math.floor(z / 4);
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const p of luoiDuong.get((gx + i) + ',' + (gz + j)) || []) if (Math.hypot(p.x - x, p.z - z) < p.r + pad) return true;
  return false;
}
const trongHo = (x, z, pad) => { const A = VT.ao; return ((x - A.x) / (A.rx + 1 + pad)) ** 2 + ((z - A.z) / (A.rz + 1 + pad)) ** 2 < 1; };
const mo = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const tron3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function nhieu1(seed, chu) { // nhiễu 1 chiều tuần hoàn chu kỳ 1 (texture lặp theo chiều dài không lộ mối nối)
  const r = M.rnd(seed), g = Array.from({ length: chu }, r);
  return u => { const x = (((u % 1) + 1) % 1) * chu, i = Math.floor(x), f = x - i, t = f * f * (3 - 2 * f); return g[i % chu] + (g[(i + 1) % chu] - g[i % chu]) * t; };
}
function nhieu2(seed) {
  const h = (i, j) => { let n = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(seed, 144665)) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967295; };
  return (x, z) => { const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j, sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz), a = h(i, j), b = h(i + 1, j), c = h(i, j + 1), d = h(i + 1, j + 1); return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz; };
}
// vân cỏ: nét cỏ nhỏ sáng/tối, lặp khắp nền (nhân với màu đỉnh)
function texCo() {
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), r = M.rnd(31);
  x.fillStyle = 'rgb(238,241,232)'; x.fillRect(0, 0, S, S);
  for (let i = 0; i < 1500; i++) {
    const px = r() * S, py = r() * S, l = 3 + r() * 6, a = -Math.PI / 2 + (r() - 0.5) * 1.0, sang = r() < 0.55;
    x.strokeStyle = sang ? 'rgba(255,255,226,0.95)' : 'rgba(196,212,172,0.85)'; x.lineWidth = 1 + r() * 1.3; x.lineCap = 'round';
    const dx = Math.cos(a) * l, dy = Math.sin(a) * l;
    for (const ox of px < 10 ? [0, S] : px > S - 10 ? [0, -S] : [0]) for (const oy of py < 10 ? [0, S] : py > S - 10 ? [0, -S] : [0]) { x.beginPath(); x.moveTo(px + ox, py + oy); x.lineTo(px + ox + dx, py + oy + dy); x.stroke(); }
  }
  const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; return t;
}
// texture 1 dải (u = dọc đường, lặp; v = ngang, 0.5 là tim). kieu: 'dat' đường đất · 'cai' đường cái · 'nuoc' suối/hồ
function texDai(kieu) {
  const W = 512, H = 128, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), r = M.rnd(kieu.length * 7 + 3), im = x.createImageData(W, H), d = im.data;
  const nuoc = kieu === 'nuoc', cai = kieu === 'cai', e1 = nhieu1(3 + kieu.length, 12), e2 = nhieu1(8 + kieu.length, 12);
  const MAU = [[243, 225, 182], [229, 205, 153], [200, 164, 104]]; // đường cái cùng màu đường đất (chỗ nối không lộ vệt)
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const u = i / W, v = (j + 0.5) / H, dd = Math.abs(v - 0.5) * 2;
    const e = (nuoc ? 0.9 : 0.8) + ((v < 0.5 ? e1 : e2)(u) - 0.5) * (nuoc ? 0.07 : 0.16);
    const a = 1 - mo(e - 0.07, e + 0.05, dd);
    let col;
    if (nuoc) {
      col = MOI ? tron3([63, 150, 170], [118, 202, 200], mo(0.05, 0.6, dd)) : tron3([58, 166, 222], [112, 206, 241], mo(0.05, 0.6, dd)); // bản mới: nước xanh ngọc dịu
      col = tron3(col, MOI ? [218, 242, 234] : [206, 242, 250], mo(0.56, 0.64, dd) * (1 - mo(0.66, 0.7, dd)));
      if (dd > 0.66) col = tron3([200, 182, 136], [238, 220, 172], mo(0.68, e - 0.04, dd));
    } else {
      col = tron3(MAU[0], MAU[1], mo(0.3, e, dd));
      col = tron3(col, MAU[2], mo(e - 0.14, e - 0.01, dd) * 0.85);
      if (cai) col = tron3(col, MAU[2], (1 - mo(0, 0.1, Math.abs(dd - 0.44))) * 0.35); // 2 vệt bánh xe
    }
    const n = (r() - 0.5) * (nuoc ? 5 : 18), k = (j * W + i) * 4;
    d[k] = col[0] + n; d[k + 1] = col[1] + n; d[k + 2] = col[2] + n * 0.7; d[k + 3] = a * 255;
  }
  x.putImageData(im, 0, 0);
  const lap = (px, ve) => { ve(px); if (px < 24) ve(px + W); if (px > W - 24) ve(px - W); };
  if (nuoc) { // gợn nước sáng, chạy dọc dòng
    for (let i = 0; i < 46; i++) {
      const px = r() * W, tren = r() < 0.5, dd = 0.14 + r() * 0.36, py = H * (0.5 + (tren ? -1 : 1) * dd / 2), l = 14 + r() * 34;
      lap(px, ox => { x.strokeStyle = 'rgba(215,245,255,' + (0.35 + r() * 0.35) + ')'; x.lineWidth = 1.5 + r() * 1.5; x.lineCap = 'round'; x.beginPath(); x.moveTo(ox, py); x.quadraticCurveTo(ox + l / 2, py + (r() - 0.5) * 3, ox + l, py); x.stroke(); });
    }
  } else { // sỏi nhỏ
    for (let i = 0; i < (cai ? 60 : 80); i++) {
      const px = r() * W, py = H * (0.5 + (r() - 0.5) * 0.62), rw = 1.6 + r() * 2.8, rh = rw * (0.6 + r() * 0.3);
      lap(px, ox => { x.fillStyle = 'rgba(176,146,98,0.55)'; x.beginPath(); x.ellipse(ox + 0.8, py + 1.1, rw, rh, 0, 0, 6.283); x.fill(); x.fillStyle = r() < 0.5 ? 'rgb(252,246,228)' : 'rgb(236,226,204)'; x.beginPath(); x.ellipse(ox, py, rw, rh, 0, 0, 6.283); x.fill(); });
    }
  }
  const truoc = nuoc ? null : x.getImageData(0, 0, W, H).data; // ảnh trước khi vẽ cỏ → làm lớp "lòng đường"
  // cỏ lấn mép (lá cỏ mọc từ ngoài chồm vào trong)
  const XANH = MOI ? ['rgb(112,166,70)', 'rgb(96,148,60)', 'rgb(132,182,84)', 'rgb(84,134,54)'] : ['rgb(104,178,52)', 'rgb(88,160,44)', 'rgb(128,196,66)', 'rgb(74,146,40)'];
  for (let i = 0; i < (nuoc ? 150 : 330); i++) {
    const u = r(), px = u * W, tren = r() < 0.5, e = (nuoc ? 0.9 : 0.8) + ((tren ? e1 : e2)(u) - 0.5) * (nuoc ? 0.07 : 0.16);
    const goc = H * (0.5 + (tren ? -1 : 1) * (e + 0.04) / 2), vao = (tren ? 1 : -1) * (4 + r() * 8), lech = (r() - 0.5) * 7;
    lap(px, ox => { x.strokeStyle = XANH[Math.floor(r() * 4)]; x.lineWidth = 1.6 + r() * 1.4; x.lineCap = 'round'; x.beginPath(); x.moveTo(ox, goc); x.quadraticCurveTo(ox + lech * 0.3, goc + vao * 0.6, ox + lech, goc + vao); x.stroke(); });
  }
  // pixel trong suốt: RGB về màu nền bên dưới (cỏ / đất) để lọc mịn không bị viền tối
  const lamTex = (px, nen) => {
    for (let k = 0; k < px.length; k += 4) { const t = px[k + 3] / 255; if (t < 0.98) for (let c = 0; c < 3; c++) px[k + c] = px[k + c] * t + nen[c] * (1 - t); }
    const t = new T.DataTexture(new Uint8Array(px), W, H, T.RGBAFormat);
    t.wrapS = T.RepeatWrapping; t.wrapT = T.ClampToEdgeWrapping; t.magFilter = T.LinearFilter; t.minFilter = T.LinearMipmapLinearFilter;
    t.generateMipmaps = true; t.encoding = T.sRGBEncoding; t.anisotropy = 4; t.needsUpdate = true; return t;
  };
  const vien = lamTex(x.getImageData(0, 0, W, H).data, MOI ? [124, 170, 80] : [122, 184, 64]);
  if (nuoc) return vien;
  // lớp lòng đường: chỉ phần đất giữa (không viền sẫm, không cỏ) — vẽ ĐÈ lên lớp viền của mọi dải
  // ⇒ chỗ 2 đường gặp nhau, lòng đường này che viền + cỏ của đường kia: ngã ba liền như vẽ tay
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const u = i / W, v = (j + 0.5) / H, dd = Math.abs(v - 0.5) * 2, e = 0.8 + ((v < 0.5 ? e1 : e2)(u) - 0.5) * 0.16, k = (j * W + i) * 4;
    truoc[k + 3] = Math.min(truoc[k + 3], (1 - mo(e - 0.22, e - 0.11, dd)) * 255);
  }
  return { vien, long: lamTex(truoc, MAU[1]) };
}
function matDai(tex, thu) {
  return new T.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: tex.userData && tex.userData.nuoc ? 0.3 : 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -1 - thu, polygonOffsetUnits: -2 - thu * 2 });
}
// dựng 1 dải bám đường cong; ghi mẫu vào MAU_DUONG
function dai(diem, w, mat, thu, lap, thon, seed) {
  const cong = new T.CatmullRomCurve3(diem.map(([x, z]) => new T.Vector3(x, 0, z)), false, 'centripetal');
  const L = cong.getLength(), n = Math.max(2, Math.ceil(L / 0.25)), pts = cong.getSpacedPoints(n), pos = [], uv = [], idx = [], nor = [];
  for (let i = 0; i <= n; i++) {
    const p = pts[i], a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)], s = i / n * L;
    let tx = b.x - a.x, tz = b.z - a.z; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    let k = 1 + 0.06 * Math.sin(s * 0.8 + seed) + 0.04 * Math.sin(s * 2.1 + seed * 2);
    if (thon && thon[0]) k *= mo(0, thon[0], s) * 0.85 + 0.15 * Math.min(1, s / thon[0]);
    if (thon && thon[1]) k *= mo(0, thon[1], L - s) * 0.85 + 0.15 * Math.min(1, (L - s) / thon[1]);
    const hw = w / 2 * k, nx = -tz, nz = tx;
    pos.push(p.x + nx * hw, 0, p.z + nz * hw, p.x - nx * hw, 0, p.z - nz * hw); nor.push(0, 1, 0, 0, 1, 0);
    uv.push(s / lap, 1, s / lap, 0);
    if (i < n) { const j = i * 2; idx.push(j, j + 2, j + 1, j + 1, j + 2, j + 3); }
    if (i % 2 === 0) MAU_DUONG.push({ x: p.x, z: p.z, r: hw });
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  const lop = Array.isArray(mat) ? mat : [[mat, thu]];
  for (const [mt, th] of lop) { const m = new T.Mesh(g, mt); m.position.y = 0.012 + th * 0.004; m.renderOrder = th; m.receiveShadow = true; sc.add(m); }
}
// hồ: lòng hồ (quạt, màu nước sâu) + vành (dải vòng dùng texture nước: nông → bọt → cát → mờ vào cỏ)
function hoNuoc(tex, HO, vanh, lapU) {
  const N = 72, y = 0.016, rr = a => 1 + 0.07 * Math.sin(a * 3 + 0.7) + 0.05 * Math.sin(a * 5 + 2.1) + 0.03 * Math.sin(a * 8 + 1);
  const pF = [HO.x, y, HO.z], iF = [], pV = [], uV = [], iV = [], nF = [0, 1, 0], nV = [];
  let chu = 0, truoc = null;
  for (let i = 0; i <= N; i++) {
    const a = i / N * 6.2832, k = rr(a), x = HO.x + Math.cos(a) * HO.rx * k, z = HO.z + Math.sin(a) * HO.rz * k;
    if (truoc) chu += Math.hypot(x - truoc[0], z - truoc[1]); truoc = [x, z];
    pF.push(x, y, z); nF.push(0, 1, 0);
    pV.push(x, y, z, x + Math.cos(a) * vanh, y, z + Math.sin(a) * vanh); nV.push(0, 1, 0, 0, 1, 0); uV.push(chu / lapU, 0.5, chu / lapU, 1);
    if (i < N) { iF.push(0, i + 2, i + 1); const j = i * 2; iV.push(j, j + 2, j + 1, j + 1, j + 2, j + 3); }
  }
  const mk = (p, n, idx, uv) => { const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(p, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(n, 3)); if (uv) g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); return g; };
  const vien = new T.Mesh(mk(pV, nV, iV, uV), matDai(tex, 4)); vien.renderOrder = 4; vien.receiveShadow = true; sc.add(vien);
  const long = new T.Mesh(mk(pF, nF, iF), new T.MeshStandardMaterial({ color: new T.Color(MOI ? 0x3f98ad : 0x3aa6de).convertSRGBToLinear(), roughness: 0.3, metalness: 0, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }));
  long.renderOrder = 5; long.receiveShadow = true; sc.add(long);
}
// cầu gỗ vòm (dọc trục x): ván lát + dầm + lan can
function cauGo(dai, rong) {
  const b = M.boDung(), n = Math.round(dai / 0.3), cao = 0.4, yT = t => 0.1 + Math.sin(t * Math.PI) * cao, goc = t => Math.atan(cao * Math.PI * Math.cos(t * Math.PI) / dai);
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; b.hop(dai / n * 0.9, 0.1, rong, -dai / 2 + t * dai, yT(t), 0, i % 2 ? 0xc98d55 : 0xb97d47, { z: goc(t) }); }
  for (const z of [-rong / 2 + 0.1, rong / 2 - 0.1]) for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; b.hop(dai / n + 0.02, 0.14, 0.16, -dai / 2 + t * dai, yT(t) - 0.1, z, 0x8a5530, { z: goc(t) }); }
  const cot = 5;
  for (const z of [-rong / 2 - 0.02, rong / 2 + 0.02]) {
    for (let i = 0; i < cot; i++) { const t = 0.04 + i / (cot - 1) * 0.92, x = -dai / 2 + t * dai, y = yT(t); b.hop(0.13, 0.62, 0.13, x, y + 0.3, z, 0x8a5530); b.cau(0.09, x, y + 0.64, z, 0xa86d3e, null, null, 0); }
    for (let i = 0; i < n; i++) { const t = 0.04 + (i + 0.5) / n * 0.92; b.hop(dai * 0.92 / n + 0.03, 0.09, 0.09, -dai / 2 + t * dai, yT(t) + 0.56, z, 0xb97d47, { z: goc(t) }); }
  }
  return b.xong();
}
// cổng vòm gỗ + biển tên trại (2 mặt), dọc trục z
function congTrai() {
  const g = new T.Group(), b = M.boDung(), L = 2.9;
  for (const z of [-L / 2, L / 2]) { b.tru(0.13, 0.16, 2.55, 0, 1.27, z, 0x9a6234, null, 8); b.cau(0.16, 0, 2.6, z, 0xb97d47, null, null, 0); }
  b.hop(0.22, 0.2, L + 0.5, 0, 2.38, 0, 0xa86d3e);
  b.hop(0.1, 0.66, 2.5, 0, 1.92, 0, 0x8a5530); b.hop(0.12, 0.56, 2.38, 0, 1.92, 0, 0xd9a46a);
  for (const z of [-0.7, 0.7]) b.hop(0.04, 0.2, 0.04, 0, 2.2, z, 0x6e4526);
  const m = b.xong(); g.add(m);
  const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d');
  x.font = '900 70px system-ui, "Segoe UI", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.lineJoin = 'round'; x.lineWidth = 12; x.strokeStyle = '#7a3f12'; x.strokeText('NÔNG TRẠI BK', 256, 68); x.fillStyle = '#fff6dc'; x.fillText('NÔNG TRẠI BK', 256, 68);
  const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4;
  const mt = new T.MeshBasicMaterial({ map: tx, transparent: true });
  for (const s of [1, -1]) { const p = new T.Mesh(new T.PlaneGeometry(2.3, 0.575), mt); p.position.set(s * 0.065, 1.92, 0); p.rotation.y = s * Math.PI / 2; g.add(p); }
  return g;
}
function nhaCho() { // nhà chó mái đỏ + bát ăn
  const b = M.boDung();
  b.hop(0.95, 0.06, 0.85, 0, 0.03, 0, 0x8a5530); b.hop(0.9, 0.62, 0.8, 0, 0.36, 0, 0xc98d55);
  b.hop(0.07, 0.62, 0.84, 0.44, 0.36, 0, 0xb97d47); b.hop(0.07, 0.62, 0.84, -0.44, 0.36, 0, 0xb97d47);
  b.hop(0.64, 0.08, 1.0, -0.25, 0.84, 0, 0xe8553d, { z: 0.72 }); b.hop(0.64, 0.08, 1.0, 0.25, 0.84, 0, 0xe8553d, { z: -0.72 });
  b.tru(0.2, 0.2, 0.04, 0, 0.32, 0.41, 0x3a2414, { x: Math.PI / 2 }, 16); b.hop(0.4, 0.32, 0.04, 0, 0.16, 0.41, 0x3a2414);
  b.hop(0.36, 0.12, 0.03, 0, 0.64, 0.42, 0xfff1d6);
  b.tru(0.14, 0.11, 0.07, 0.62, 0.035, 0.42, 0x5a8cff, null, 12); b.tru(0.11, 0.11, 0.02, 0.62, 0.075, 0.42, 0xc98d55, null, 12);
  return b.xong();
}
function hopThu() { // hộp thư đỏ
  const b = M.boDung();
  b.hop(0.1, 1.0, 0.1, 0, 0.5, 0, 0x8a5530); b.hop(0.34, 0.26, 0.5, 0, 1.08, 0, 0xe8423a); b.tru(0.17, 0.17, 0.5, 0, 1.2, 0, 0xe8423a, { x: Math.PI / 2 }, 12);
  b.hop(0.03, 0.34, 0.06, 0.19, 1.3, 0.12, 0xffd21f); b.hop(0.03, 0.1, 0.16, 0.19, 1.42, 0.2, 0xffd21f);
  return b.xong();
}
function vitCon() { // vịt con trên hồ
  const b = M.boDung();
  b.cau(0.26, 0, 0.12, 0, 0xffffff, { x: 1.35, y: 0.75, z: 1 }, null, 1); b.cau(0.1, -0.3, 0.2, 0, 0xffffff, { x: 1.2, y: 0.6, z: 0.8 }, { z: 0.6 }, 0);
  b.cau(0.15, 0.24, 0.36, 0, 0xffffff, null, null, 1); b.hop(0.14, 0.05, 0.12, 0.42, 0.33, 0, 0xffa21f);
  b.cau(0.03, 0.33, 0.42, 0.09, 0x222222, null, null, 0); b.cau(0.03, 0.33, 0.42, -0.09, 0x222222, null, null, 0);
  const m = b.xong(); m.scale.setScalar(1.2); return m;
}
function nenCo() {
  const S = 240, N = 200, g = new T.PlaneGeometry(S, S, N, N); g.rotateX(-Math.PI / 2); g.translate(-5, 0, 0);
  const n1 = nhieu2(3), n2 = nhieu2(9), n3 = nhieu2(17), c = new T.Color(), col = [], B = VT.bien, P = g.attributes.position;
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), z = P.getZ(i);
    const ngoai = Math.max(B.x0 - x, x - B.x1, B.z0 - z, z - B.z1) + (n2(x / 5, z / 5) - 0.5) * 4;
    const m = 1 - mo(-1, 7, ngoai), a = n1(x / 9, z / 9) - 0.5, b = n3(x / 2.6, z / 2.6) - 0.5;
    if (MOI) c.setHSL(0.238 + a * 0.05 - (1 - m) * 0.015, 0.42 + m * 0.06, 0.45 + m * 0.07 + a * 0.09 + b * 0.04).convertSRGBToLinear(); // cỏ dịu (bão hoà ~0.45 thay 0.6), loang mảng rõ hơn
    else c.setHSL(0.245 + a * 0.035 - (1 - m) * 0.012, 0.52 + m * 0.08, 0.43 + m * 0.1 + a * 0.08 + b * 0.035).convertSRGBToLinear();
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  const map = texCo(); map.repeat.set(S / 3.2, S / 3.2);
  const nen = new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, map })); nen.receiveShadow = true; sc.add(nen);
}

// ---------- THẾ GIỚI TĨNH ----------
function sanDat(S) { // nền sân đất nện bo góc (sân nhà Nông trại vui vẻ)
  const w = S.x1 - S.x0 + 0.7, d = S.z1 - S.z0 + 0.7, rr = 1.4, a = w / 2, b = d / 2, sh = new T.Shape();
  sh.moveTo(-a + rr, -b); sh.lineTo(a - rr, -b); sh.quadraticCurveTo(a, -b, a, -b + rr); sh.lineTo(a, b - rr); sh.quadraticCurveTo(a, b, a - rr, b);
  sh.lineTo(-a + rr, b); sh.quadraticCurveTo(-a, b, -a, b - rr); sh.lineTo(-a, -b + rr); sh.quadraticCurveTo(-a, -b, -a + rr, -b);
  const g = new T.ShapeGeometry(sh, 6); g.rotateX(-Math.PI / 2);
  const n = nhieu2(41), c = new T.Color(), col = [], P = g.attributes.position;
  for (let i = 0; i < P.count; i++) { const v = n(P.getX(i) / 3, P.getZ(i) / 3) - 0.5; c.setHSL(0.1 + v * 0.02, 0.42, 0.72 + v * 0.06).convertSRGBToLinear(); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  const m = new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1 }));
  m.position.set((S.x0 + S.x1) / 2, 0.012, (S.z0 + S.z1) / 2); m.receiveShadow = true; return m;
}
function dungTheGioi() {
  nenCo();
  texHo = texDai('nuoc'); texHo.userData = { nuoc: true };      // nước ao (vẽ ở dungTrangTri)
  const B = VT.bien, S = VT.san, r2 = M.rnd(11);
  // sân đất + hàng rào gỗ quanh sân, chừa cổng ở cạnh trước
  sc.add(sanDat(S));
  const rao = [], c0 = S.cong - 0.8, c1 = S.cong + 0.8;
  for (let x = S.x0; x < S.x1 - 0.01; x += 1) { const L = Math.min(1, S.x1 - x), xm = x + L / 2; rao.push({ x: xm, z: S.z0, xoay: Math.PI / 2, k: L }); if (xm < c0 || xm > c1) rao.push({ x: xm, z: S.z1, xoay: Math.PI / 2, k: L }); }
  for (let z = S.z0; z < S.z1 - 0.01; z += 1) { const L = Math.min(1, S.z1 - z); rao.push({ x: S.x0, z: z + L / 2, xoay: 0, k: L }); rao.push({ x: S.x1, z: z + L / 2, xoay: 0, k: L }); }
  sc.add(M.nhanBan('fence_wood_straight', rao, 1.0));
  hopThuO = dat(hopThu(), VT.hopThu.x, VT.hopThu.z, 0); neo(VT.hopThu.x, VT.hopThu.z).add(hopCham(0.8, 1.6, 0.8, { loai: 'hopThu' }));
  // bờ bụi quanh trại, rừng bông xù vòng ngoài (dày ở mép, thưa dần ra xa)
  const bui = [];
  const themBui = (x, z) => { if (!trongHo(x, z, 0)) bui.push({ x, z, kieu: 'bui', xoay: r2() * 6, k: 1.05 + r2() * 0.5 }); };
  for (let x = B.x0 + 0.8; x < B.x1 + 0.5; x += 1.1 + r2() * 0.5) { themBui(x, B.z0 - 0.5 - r2() * 0.5); themBui(x, B.z1 + 0.5 + r2() * 0.5); }
  for (let z = B.z0; z < B.z1 + 0.5; z += 1.1 + r2() * 0.5) { themBui(B.x1 + 0.5 + r2() * 0.5, z); themBui(B.x0 - 0.5 - r2() * 0.5, z); }
  const rung = [], luoi = new Map();
  const choTrong = (x, z, d) => { const gx = Math.floor(x / 3), gz = Math.floor(z / 3); for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const p of luoi.get((gx + i) + ',' + (gz + j)) || []) if (Math.hypot(p[0] - x, p[1] - z) < d) return false; return true; };
  const ghi = (x, z) => { const k = Math.floor(x / 3) + ',' + Math.floor(z / 3); if (!luoi.has(k)) luoi.set(k, []); luoi.get(k).push([x, z]); };
  for (let i = 0; i < 9000 && rung.length < 300; i++) {
    const x = -60 + r2() * 110, z = -50 + r2() * 100, ngoai = Math.max(B.x0 - x, x - B.x1, B.z0 - z, z - B.z1);
    if (ngoai < 1.8 || r2() > (ngoai < 10 ? 1 : ngoai < 22 ? 0.5 : 0.22)) continue;
    const q = r2(), kieu = ngoai > 8 && q < 0.14 ? 'thong' : q < 0.4 ? 'cao' : q < 0.5 ? 'bui' : 'tron', k = kieu === 'bui' ? 1.2 + r2() * 0.6 : 1.15 + r2() * 0.75;
    if (!choTrong(x, z, (kieu === 'bui' ? 1.1 : 1.7) * k)) continue;
    ghi(x, z); rung.push({ x, z, kieu, xoay: r2() * 6, k, min: ngoai > 12 ? 0 : 1 });
  }
  // vài cây to đứng trong góc trại
  for (const [x, z, k] of [[B.x1 - 1.4, B.z1 - 1.2, 1.7], [B.x1 - 1.2, B.z0 + 1.4, 1.6], [B.x0 + 1.5, B.z1 - 1.3, 1.8], [B.x0 + 1.3, B.z0 + 1.3, 1.3]]) rung.push({ x, z, kieu: 'tron', xoay: x, k });
  sc.add(M.rungBong(rung.concat(bui)));
  const da = [];
  for (let i = 0; i < 40; i++) { const x = -50 + r2() * 90, z = -45 + r2() * 85, ngoai = Math.max(B.x0 - x, x - B.x1, B.z0 - z, z - B.z1); if (ngoai > 1.5 && ngoai < 14) da.push({ x, z, xoay: r2() * 6, k: 0.5 + r2() * 0.7 }); }
  if (da.length) sc.add(M.nhanBan('Rock_1_A_Color1', da, 1.0));
  for (let i = 0; i < 2; i++) { const v = vitCon(); v.userData = { pha: i * 3.1, bk: 0.4 + i * 0.18 }; sc.add(v); vitDs.push(v); }
  // nhà ở (bản mới: nhà trang trí dựng bằng code theo MỨC ĐẸP — ?kieu=go|viet|nhat|hylap · ?nha=1..10, mặc định go mức 1)
  if (MOI) { const q = new URLSearchParams(location.search); khoG.nha = dat(DH.nhaMoi(q.get('kieu') || 'go', +q.get('nha') || 1), VT.nha.x, VT.nha.z - 0.6); khoG.nha.scale.setScalar(VT.nha.rong / 2.3); }
  else khoG.nha = dat(M.vua(M.kk('building_home_A_blue'), VT.nha.rong), VT.nha.x, VT.nha.z, Math.PI);
  neo(VT.nha.x, VT.nha.z).add(hopCham(3, 3, 3, { loai: 'nha' }));
  if (!MOI) dat(M.vua(M.kk('lantern'), 0.5, 1.6), VT.nha.x + 1.9, VT.nha.z + 1.2);
  dat(M.vua(M.kk('sack'), 0.7), VT.barn.x + 1.3, VT.barn.z + 1.3); dat(M.vua(M.kk('crate_open'), 0.8), VT.barn.x - 1.5, VT.barn.z + 1.2);
  dat(M.vua(M.kk('wheelbarrow'), 1.1), -0.2, 6.4, -0.6);
  // kho hàng (silo bỏ)
  khoG.barn = dat(M.vua(M.kk('building_home_A_red'), VT.barn.rong), VT.barn.x, VT.barn.z, Math.PI);
  neo(VT.barn.x, VT.barn.z).add(hopCham(VT.barn.rong + 0.6, 3, VT.barn.rong + 0.4, { loai: 'kho', id: 'barn' }));
  // bảng tin lớp (chỗ bảng "Lịch canh tác" của Nông trại vui vẻ)
  bangO = dat(M.bangDon(), VT.bang.x, VT.bang.z, 0.45); bangO.add(hopCham(2.4, 2, 0.8, { loai: 'bang' }));
  // chợ
  sapLo = dat(M.lanhDat(2.4, 2.0), VT.sap.x, VT.sap.z);
  sapO = dat(M.vua(M.kk('building_market_red'), VT.sap.rong), VT.sap.x, VT.sap.z, 0.45); sapO.visible = false;
  sapNeo = neo(VT.sap.x, VT.sap.z); sapNeo.add(hopCham(2.6, 2, 2.4, { loai: 'sap' }));
  sapHoang = hoang(2.4, 2.0, 990); sapNeo.add(sapHoang);
}

// ---------- TRANG TRÍ: hoa, bụi, cây táo, nấm, cỏ, ao, bướm, chó giữ trại ----------
function dungTrangTri() {
  // vùng đã có đồ (không rải trang trí đè lên)
  const R0 = VT.ruong, S0 = VT.san, n0 = R0.co / 2, rx = (R0.cot - 1) * R0.buoc, rz = 2 * R0.buoc;
  const chiem = [
    [R0.x - n0 - 0.4, R0.x + rx + n0 + 0.4, R0.z - n0 - 0.4, R0.z + rz + n0 + 0.4],                            // ruộng
    [S0.x0 - 0.5, S0.x1 + 0.5, S0.z0 - 0.5, S0.z1 + 0.5],                                                       // sân nhà
    [VT.sap.x - 1.8, VT.sap.x + 1.8, VT.sap.z - 1.6, VT.sap.z + 1.6], [VT.bang.x - 1.6, VT.bang.x + 1.6, VT.bang.z - 1, VT.bang.z + 1],
    [VT.hopThu.x - 0.8, VT.hopThu.x + 0.8, VT.hopThu.z - 0.8, VT.hopThu.z + 0.8], [-1.4, 1.0, 5.4, 7.4],        // hộp thư · xe cút kít
    [VT.nhaCho.x - 1.1, VT.cho.x + 1.1, VT.cho.z - 1.1, VT.cho.z + 1.0],                                             // chó + nhà chó
  ];
  for (const [x, z] of VT.trangTri) chiem.push([x - 1, x + 1, z - 1, z + 1]);
  const A = VT.ao; chiem.push([A.x - A.rx - 0.6, A.x + A.rx + 0.6, A.z - A.rz - 0.6, A.z + A.rz + 0.6]);
  const bongMat = [[-13.8, -5.0], [12.2, 5.2], [-2.4, -9.4]];                                                     // vài cây tán to
  for (const [x, z] of bongMat) chiem.push([x - 1, x + 1, z - 1, z + 1]);
  sc.add(M.rungBong(bongMat.map(([x, z], i) => ({ x, z, kieu: 'tron', xoay: i * 2, k: 1.35 }))));
  const trong = (x, z, pad) => !chiem.some(([a, b, c, d]) => x > a - pad && x < b + pad && z > c - pad && z < d + pad) && !ganDuong(x, z, pad + 0.15);
  const B = VT.bien, r = M.rnd(77);
  // ao sen
  hoNuoc(texHo, A, 1.35, 4);
  const bSen = M.boDung(), rSen = M.rnd(9);
  for (let i = 0; i < 6; i++) { const a = rSen() * 6.283, d = 0.25 + rSen() * 0.5, x = A.x + Math.cos(a) * A.rx * d, z = A.z + Math.sin(a) * A.rz * d; bSen.tru(0.22, 0.22, 0.02, x, 0.075, z, i % 2 ? 0x5cc23a : 0x7fd64a, null, 12); if (i % 2 === 0) { bSen.cau(0.08, x + 0.04, 0.12, z, 0xff9ad5, { x: 1, y: 0.7, z: 1 }, null, 0); bSen.cau(0.045, x + 0.04, 0.16, z, 0xffe066, null, null, 0); } }
  for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283 + rSen(), x = A.x + Math.cos(a) * (A.rx + 0.75), z = A.z + Math.sin(a) * (A.rz + 0.75); bSen.cau(0.16 + rSen() * 0.1, x, 0.06, z, rSen() > 0.5 ? 0xd9d4c8 : 0xc9c2b2, { x: 1.2, y: 0.6, z: 1 }, { y: rSen() * 3 }, 1); }
  sc.add(bSen.xong());
  // cây táo + bụi quả mọng + bụi hoa tròn (dựng 1 lưới gộp)
  const bTao = M.boDung(), bui = M.qcPhan('BushBerries_4'), nam2 = M.qcPhan('Mushroom_2'), nam4 = M.qcPhan('Mushroom_4'), co3 = M.qcPhan('Grass_3');
  const cayTao = [[-13.6, 7.8], [-8.6, 8.4], [11.8, 7.6], [12.4, -10.4], [-6.0, -9.6]];
  cayTao.forEach(([x, z], i) => { const b = M.boDung(true); M.cayQuaBong(b, M.rnd(60 + i), i % 3 === 2 ? 0xffc21f : 0xe8323a, 9, null, 1.1); const m = b.xong(); m.position.set(x, 0, z); m.rotation.y = r() * 6; m.scale.setScalar(1.25 + r() * 0.25); sc.add(m); });
  if (bui) for (const [x, z] of [[-10.8, 8.4], [2.6, 8.2], [12.6, -3.6], [-13.8, -8.6]]) bTao.phan(bui, x, 0, z, 0.75, r() * 6);
  sc.add(bTao.xong());
  // nấm + cỏ + hoa nhỏ rải khắp chỗ trống
  const bNho = M.boDung(); let nNam = 0, nCo = 0;
  for (let i = 0; i < 1200 && (nCo < 170 || nNam < 20); i++) {
    const x = B.x0 + 0.6 + r() * (B.x1 - B.x0 - 1.2), z = B.z0 + 0.6 + r() * (B.z1 - B.z0 - 1.2);
    if (!trong(x, z, 0.2)) continue;
    if (nNam < 20 && r() < 0.12) { const q = r() < 0.5 ? nam2 : nam4; if (q) bNho.phan(q, x, 0, z, 0.4 + r() * 0.2, r() * 6); nNam++; }
    else if (nCo < 170 && co3) { bNho.phan(co3, x, 0, z, 0.32 + r() * 0.15, r() * 6); nCo++; }
  }
  sc.add(bNho.xong());
  const cumHoa = [];
  for (let i = 0; i < 800 && cumHoa.length < 38; i++) {
    const x = B.x0 + 0.8 + r() * (B.x1 - B.x0 - 1.6), z = B.z0 + 0.8 + r() * (B.z1 - B.z0 - 1.6);
    if (trong(x, z, 0.5) && !cumHoa.some(([a, b]) => Math.hypot(a - x, b - z) < 2)) cumHoa.push([x, z]);
  }
  for (const [x, z] of [[A.x - 3.6, A.z - 1.0], [A.x + 3.7, A.z + 1.2], [S0.x0 - 1.0, S0.z1 + 1.0], [S0.x1 + 1.0, S0.z1 + 1.0]]) cumHoa.push([x, z]);
  cumHoa.forEach(([x, z], i) => { const h = M.cumHoa(6 + Math.floor(r() * 5), 0.32, i + 3); h.position.set(x, 0, z); h.scale.setScalar(1.8); sc.add(h); });
  // bụi tròn có hoa dọc hàng rào trên
  const MAU = [0xff7eb6, 0xffffff, 0xffd23f, 0xb58cff];
  for (let x = B.x0 + 1.5, i = 0; x < B.x1 - 1; x += 2.3 + r() * 1.5, i++) { if (!trong(x, B.z0 + 0.6, 0)) continue; const b = M.buiTron(0.9 + r() * 0.4, i + 40, MAU[i % 4]); b.position.set(x, 0, B.z0 + 0.6); sc.add(b); }
  // bướm bay quanh các cụm hoa
  const MAU_BUOM = [0xff9ad5, 0xffe066, 0x9ad0ff, 0xffffff, 0xffb36b, 0xc39bff];
  for (let i = 0; i < 9; i++) { const [x, z] = cumHoa[(i * 3) % cumHoa.length]; const b = M.buom(MAU_BUOM[i % MAU_BUOM.length]); b.userData.tam = new T.Vector3(x, 0, z); b.userData.pha = r() * 6; b.userData.bk = 0.8 + r() * 1.2; sc.add(b); buomDs.push(b); }
  dat(nhaCho(), VT.nhaCho.x, VT.nhaCho.z, 0.55);
  // chó giữ trại (chạm để xoa đầu). Bản mới (dohoa.js): chó dựng bằng code, 16 động tác, tự chơi quanh chỗ của nó;
  // xoa đầu ⇒ động tác được vuốt ve (xem nay()). ?cho=husky… để đổi giống
  if (MOI) {
    choNuoi = DH.choMoi(new URLSearchParams(location.search).get('cho') || 'shiba', { vung: { x: 0, z: 0, hw: VT.cho.hw + 0.3, hd: VT.cho.hd + 0.2 } });
    neo(VT.cho.x, VT.cho.z).add(choNuoi.g); choNuoi.g.add(hopCham(0.9, 0.8, 0.9, { loai: 'thu', id: 'cho' }));
    choNuoi.onSuKien = ten => { if (ten === 'sua' && tg - choVuotT < 8 && window.NT_AM) NT_AM.on('gau'); }; // chỉ sủa thành tiếng lúc đang được xoa đầu (không ồn lớp học)
    choO = { goc: choNuoi.g, loai: 'cho', moi: true };
  } else {
    const q = M.layVatQ('cho');
    if (q) { const goc = new T.Group(); neo(VT.cho.x, VT.cho.z).add(goc); const cd = { q, m: q.g, goc, x: 0, z: 0, tx: 0, tz: 0, cho: 1, hw: VT.cho.hw, hd: VT.cho.hd, loai: 'cho' }; q.g.scale.setScalar(Q_DAI.cho / q.g.userData.dai); cd.goc.add(q.g); goc.add(hopCham(0.9, 0.8, 0.9, { loai: 'thu', id: 'cho' })); choiHd(cd, 'Idle'); choO = cd; }
  }
  // mèo nằm trên đệm + cột chim ăn
  const dem = M.boDung(true); dem.tru(0.42, 0.46, 0.1, 0, 0.05, 0, 0xff8fb1, null, 20); dem.tru(0.36, 0.36, 0.03, 0, 0.11, 0, 0xffb3c9, null, 20);
  const nm = neo(VT.meo.x, VT.meo.z); nm.add(dem.xong()); meoO = M.meo(); meoO.position.y = 0.12; meoO.rotation.y = 0.6; nm.add(meoO); nm.add(hopCham(0.9, 0.9, 0.9, { loai: 'thu', id: 'meo' }));
  meoO.userData.neo = nm;
  chimO = M.chimCan(); dat(chimO, VT.chim.x, VT.chim.z, -0.4); neo(VT.chim.x, VT.chim.z).add(hopCham(0.9, 1.7, 0.9, { loai: 'thu', id: 'chim' }));
}

// ---------- CHUỒNG · LÒ BÁNH · CHỖ TRANG TRÍ · Ô RUỘNG ----------
const MAT_UOT = new T.MeshStandardMaterial({ color: new T.Color(0x3d2410).convertSRGBToLinear(), transparent: true, opacity: 0.5, roughness: 0.45, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
let geoUot = null;
function matUot() { // lớp đất ướt sẫm màu phủ lên ô vừa tưới
  if (!geoUot) {
    const sh = new T.Shape(), w = 0.5, rr = 0.15;
    sh.moveTo(-w + rr, -w); sh.lineTo(w - rr, -w); sh.quadraticCurveTo(w, -w, w, -w + rr); sh.lineTo(w, w - rr); sh.quadraticCurveTo(w, w, w - rr, w);
    sh.lineTo(-w + rr, w); sh.quadraticCurveTo(-w, w, -w, w - rr); sh.lineTo(-w, -w + rr); sh.quadraticCurveTo(-w, -w, -w + rr, -w);
    geoUot = new T.ShapeGeometry(sh, 4); geoUot.rotateX(-Math.PI / 2);
  }
  const m = new T.Mesh(geoUot, MAT_UOT); m.position.y = 0.135; m.visible = false; m.renderOrder = 6; return m;
}
function dauCho() { // vòng mờ đánh dấu chỗ đặt đồ trang trí (chỉ hiện khi kho có đồ trang trí)
  const m = new T.Mesh(new T.RingGeometry(0.34, 0.44, 32), new T.MeshBasicMaterial({ color: 0xfff6d8, transparent: true, opacity: 0.8, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.03; m.visible = false; return m;
}
function dungNhaMay() {
  for (const k in VT.chuong) {
    const v = VT.chuong[k], g = new T.Group(); g.position.set(v.x, 0, v.z); sc.add(g);
    const lo = M.lanhDat(v.w, v.d); g.add(lo);
    const trong = new T.Group(); trong.visible = false; g.add(trong);
    const rao = [], hw = v.w / 2, hd = v.d / 2;
    for (let x = -hw; x < hw - 0.01; x += 1) { const L = Math.min(1, hw - x); rao.push({ x: x + L / 2, z: -hd, xoay: Math.PI / 2, k: L }); if (!(x >= -0.5 && x < 0.5)) rao.push({ x: x + L / 2, z: hd, xoay: Math.PI / 2, k: L }); }
    for (let z = -hd; z < hd - 0.01; z += 1) { const L = Math.min(1, hd - z); rao.push({ x: -hw, z: z + L / 2, xoay: 0, k: L }); rao.push({ x: hw, z: z + L / 2, xoay: 0, k: L }); }
    trong.add(M.nhanBan('fence_wood_straight', rao, 1.0));
    if (k === 'ga') { const n = M.nhaGa(); n.position.set(-hw + 0.8, 0, -hd + 0.6); trong.add(n); }
    const mg = M.mang(k === 'bo' ? 0x9fd46a : 0xf2d060); mg.position.set(hw - 1.0, 0, -hd + 0.4); trong.add(mg);
    const hg = hoang(v.w, v.d, 800 + k.length * 13); g.add(hg);
    g.add(hopCham(v.w, 1.2, v.d, { loai: 'chuong', id: k }));
    chuongO[k] = { g, lo, trong, v, hoang: hg };
  }
  { // lò bánh
    const v = VT.lo, g = new T.Group(); g.position.set(v.x, 0, v.z); sc.add(g);
    const lo = M.lanhDat(v.rong + 0.2, v.rong + 0.2); g.add(lo);
    const mo = M.vua(M.kk('building_blacksmith_yellow'), v.rong); mo.visible = false; g.add(mo);
    const hg = hoang(v.rong + 0.4, v.rong + 0.4, 931); g.add(hg);
    g.add(hopCham(v.rong + 0.3, v.rong * 0.9, v.rong + 0.3, { loai: 'lo' }));
    loO = { g, lo, mo, hoang: hg, v, tKhoi: 0, chay: false };
  }
  VT.trangTri.forEach(([x, z], o) => { const g = neo(x, z), dau = dauCho(); g.add(dau); g.add(hopCham(1.2, 1.2, 1.2, { loai: 'tt', o })); ttO.push({ g, dau, mo: null, id: null }); });
  for (let i = 0; i < D.LUAT.oToiDa; i++) {
    const p = ruongViTri(i), k = VT.ruong.co, h = oCo(k, 500 + i); h.position.set(p.x, 0, p.z); sc.add(h); hoangRuong.push(h);
    const g = new T.Group(); g.position.set(p.x, 0, p.z); g.scale.setScalar(k); sc.add(g);   // cả ô (đất, cây, bong bóng) phóng theo cỡ ô
    const d = M.datRuong(); chonDuoc(d, { loai: 'ruong', i }); pick.push(d); g.add(d);
    const uot = matUot(); g.add(uot);
    const lo = M.lanhDat(1.2, 1.2); lo.visible = false; g.add(lo);
    ruongO.push({ g, d, uot, lo, cay: null, key: '', gd: -1 });
  }
}
let geoCo = null;
function oCo(k, seed) { // ô chưa mở = ô cỏ vuông bo góc + vài khóm cỏ (như ô cỏ Nông trại vui vẻ)
  if (!geoCo) {
    const s = new T.Shape(), w = 0.5, rr = 0.14;
    s.moveTo(-w + rr, -w); s.lineTo(w - rr, -w); s.quadraticCurveTo(w, -w, w, -w + rr); s.lineTo(w, w - rr); s.quadraticCurveTo(w, w, w - rr, w);
    s.lineTo(-w + rr, w); s.quadraticCurveTo(-w, w, -w, w - rr); s.lineTo(-w, -w + rr); s.quadraticCurveTo(-w, -w, -w + rr, -w);
    geoCo = new T.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.035, bevelSegments: 2, curveSegments: 3 }); geoCo.rotateX(-Math.PI / 2);
  }
  const g = new T.Group(), r = M.rnd(seed), co = M.qcPhan('Grass_3');
  const m = new T.Mesh(geoCo, new T.MeshStandardMaterial({ color: new T.Color(0x7cc64c).convertSRGBToLinear(), roughness: 0.95 })); m.receiveShadow = true; g.add(m);
  if (co) { const b = M.boDung(true); for (let i = 0; i < 5; i++) b.phan(co, (r() - 0.5) * 0.72, 0.08, (r() - 0.5) * 0.72, 0.16 + r() * 0.07, r() * 6); g.add(b.xong()); }
  g.scale.setScalar(k); return g;
}
// cụm đất hoang (bụi tròn + cỏ + đá) phủ 1 vùng w×d — ẩn khi vùng đó được mở
function hoang(w, d, seed) {
  const b = M.boDung(true), r = M.rnd(seed), co = M.qcPhan('Grass_3'), n = Math.max(2, Math.round(w * d * 0.9));
  for (let i = 0; i < n; i++) {
    const x = (r() - 0.5) * w * 0.9, z = (r() - 0.5) * d * 0.9, k = 0.18 + r() * 0.2, loai = r();
    if (loai < 0.45) { b.cau(k, x, k * 0.7, z, r() > 0.5 ? 0x5cb83a : 0x4aa332, { x: 1.1, y: 0.8, z: 1.1 }, null, 1); b.cau(k * 0.7, x + k * 0.5, k * 0.9, z, 0x6fcf4a, null, null, 1); }
    else if (loai < 0.6) b.cau(k * 0.8, x, k * 0.35, z, r() > 0.5 ? 0xb9b9c4 : 0xa2a2b0, { x: 1.2, y: 0.7, z: 1 }, { y: r() * 3 }, 0);
    else if (co) b.phan(co, x, 0, z, 0.3 + r() * 0.15, r() * 6);
  }
  const m = b.xong(); m.receiveShadow = true; return m;
}
function ruongViTri(i) { const V = VT.ruong; return { x: V.x + (i % V.cot) * V.buoc, z: V.z + Math.floor(i / V.cot) * V.buoc }; }

// ---------- BONG BÓNG (sprite biểu tượng) ----------
const texCache = {}, EMOJI = { '#nuoc': '💧', '#sau': '🐛', '#trom': '🧺', '#thu': '✉️', '#tim': '💗', '#giup': '🤝' };
function texBong(id, mo) {
  const k = id + (mo ? '_m' : '');
  if (texCache[k]) return texCache[k];
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding; texCache[k] = tex;
  const ve = img => {
    g.clearRect(0, 0, 128, 128); g.globalAlpha = mo ? 0.55 : 1;
    g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(64, 70, 54, 52, 0, 0, 7); g.fill();
    g.fillStyle = '#fffdf5'; g.beginPath(); g.arc(64, 62, 52, 0, 7); g.fill();
    g.strokeStyle = '#e2c98f'; g.lineWidth = 5; g.stroke();
    if (img) g.drawImage(img, 20, 18, 88, 88);
    tex.needsUpdate = true;
  };
  if (id[0] === '#') { ve(null); g.globalAlpha = mo ? 0.55 : 1; g.font = '62px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(EMOJI[id] || '!', 64, 66); tex.needsUpdate = true; return tex; }
  const url = M.icon(id); if (url) { const im = new Image(); im.onload = () => ve(im); im.src = url; } else ve(null);
  return tex;
}
function bong(id, mo) { const s = new T.Sprite(new T.SpriteMaterial({ map: texBong(id, mo), depthTest: false, transparent: true })); s.scale.set(0.95, 0.95, 1); s.renderOrder = 10; return s; }
function datBong(cha, key, id, y, mo, lon) { // gắn/đổi/bỏ bong bóng trên 1 vật (lon = cỡ bong bóng)
  const u = cha.userData;
  if (u.bongKey === key) return;
  if (u.bong) { cha.remove(u.bong); u.bong = null; }
  u.bongKey = key;
  if (id) { u.bong = bong(id, mo); u.bong.position.y = y; u.bong.userData.y0 = y; u.bong.userData.no = tg; u.bong.userData.lon = lon || 0.95; u.bong.scale.setScalar(0.01); cha.add(u.bong); }
}

// ---------- HẠT HIỆU ỨNG (vụn lúa, lá, bụi đất, tim, sao, khói) ----------
const texHat = {};
function texHatTao(hinh) {
  if (texHat[hinh]) return texHat[hinh];
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.fillStyle = '#fff';
  if (hinh === 'tron') { const gr = g.createRadialGradient(32, 32, 4, 32, 32, 30); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.6, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }
  else if (hinh === 'tim') { g.beginPath(); g.moveTo(32, 54); g.bezierCurveTo(4, 34, 8, 8, 32, 20); g.bezierCurveTo(56, 8, 60, 34, 32, 54); g.fill(); }
  else if (hinh === 'sao') { g.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283 - Math.PI / 2, rr = i % 2 ? 11 : 28; g.lineTo(32 + Math.cos(a) * rr, 32 + Math.sin(a) * rr); } g.fill(); }
  else if (hinh === 'la') { g.beginPath(); g.ellipse(32, 32, 26, 12, 0.6, 0, 7); g.fill(); }
  const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return (texHat[hinh] = t);
}
const KIEU_HAT = {
  lua: { hinh: 'tron', mau: [0xffd84f, 0xf7c23a, 0xfff1a8], n: 9, v: 2.2, g: -7, song: 0.7, co: 0.13 },
  la: { hinh: 'la', mau: [0x7fd64a, 0xb4ec6a, 0x4fae3a], n: 8, v: 2.0, g: -6, song: 0.8, co: 0.15 },
  dat: { hinh: 'tron', mau: [0xc9935a, 0xa7703e, 0xe0b27a], n: 7, v: 1.3, g: -4, song: 0.5, co: 0.17 },
  tim: { hinh: 'tim', mau: [0xff5c8a, 0xff8fb1, 0xff3d6e], n: 5, v: 1.0, g: 1.2, song: 1.2, co: 0.26 },
  sao: { hinh: 'sao', mau: [0xffe066, 0xffffff, 0xffd23f], n: 8, v: 2.4, g: -3, song: 0.8, co: 0.2 },
  nuoc: { hinh: 'tron', mau: [0x5cc8f2, 0x9fe0ff, 0x3aa6de], n: 9, v: 1.7, g: -6, song: 0.6, co: 0.12 },
  khoi: { hinh: 'tron', mau: [0xffffff, 0xf2f2f2, 0xe6e6e6], n: 1, v: 0.35, g: 0.5, song: 2.2, co: 0.35, lon: 2.2 },
};
const hatDs = [];
function hatTai(p, kieu, n) {
  const K = KIEU_HAT[kieu]; if (!K) return;
  for (let i = 0; i < (n || K.n); i++) {
    const s = new T.Sprite(new T.SpriteMaterial({ map: texHatTao(K.hinh), color: new T.Color(K.mau[i % K.mau.length]).convertSRGBToLinear(), transparent: true, depthWrite: false }));
    s.position.copy(p); s.position.x += (Math.random() - 0.5) * 0.3; s.position.z += (Math.random() - 0.5) * 0.3;
    const a = Math.random() * 6.283, ngang = K.v * (0.3 + Math.random() * 0.5);
    s.userData = { v: new T.Vector3(Math.cos(a) * ngang, K.v * (0.6 + Math.random() * 0.6), Math.sin(a) * ngang), t: 0, song: K.song * (0.8 + Math.random() * 0.4), g: K.g, co: K.co * (0.8 + Math.random() * 0.4), lon: K.lon || 1, xoay: (Math.random() - 0.5) * 6 };
    s.renderOrder = 5; sc.add(s); hatDs.push(s);
  }
}
function nhunBong(g, pha) { const b = g && g.userData.bong; if (!b) return; b.position.y = b.userData.y0 + Math.sin(tg * 3 + pha) * 0.07; const lon = b.userData.lon || 0.95; if (b.scale.x < lon) b.scale.setScalar(Math.min(lon, 0.01 + (tg - b.userData.no) * 4)); }
function hat(chon, kieu, n) { const p = viTri(chon); if (p) { if (chon.loai === 'ruong') p.y = 0.35; hatTai(p, kieu, n); } }

// ---------- NẢY KHI CHẠM ----------
const nayDs = [];
function doiTuong(chon) {
  if (!chon) return null;
  if (chon.loai === 'ruong') return ruongO[chon.i] && ruongO[chon.i].g;
  if (chon.loai === 'chuong') return chuongO[chon.id] && chuongO[chon.id].trong;
  if (chon.loai === 'lo') return loO && loO.mo;
  if (chon.loai === 'kho') return khoG[chon.id] || khoG.barn;
  if (chon.loai === 'nha') return khoG.nha;
  if (chon.loai === 'bang') return bangO;
  if (chon.loai === 'sap') return sapO;
  if (chon.loai === 'hopThu') return hopThuO;
  if (chon.loai === 'tt') return ttO[chon.o] && ttO[chon.o].mo;
  if (chon.loai === 'thu') return chon.id === 'cho' ? choO && choO.goc : chon.id === 'meo' ? meoO : chimO;
  return null;
}
function nay(chon, manh) {
  if (choNuoi && chon && chon.loai === 'thu' && chon.id === 'cho') { choNuoi.vuot(Math.atan2(HUONG.x, HUONG.z)); choVuotT = tg; return; } // chó mới: xoa đầu = động tác được vuốt ve
  const g = doiTuong(chon); if (!g) return;
  if (!g.userData.s0) g.userData.s0 = g.scale.clone();
  const cu = nayDs.find(n => n.g === g); if (cu) cu.t = 0; else nayDs.push({ g, t: 0, a: manh || 0.16 });
}

// ---------- NHÃN CHỮ (DOM, bám theo điểm 3D) ----------
function datNhan(key, pos, text, lop) {
  let n = nhan[key];
  if (!text || !pos) { if (n) { n.el.remove(); delete nhan[key]; } return; }
  if (!n) { const el = document.createElement('div'); el.className = 'nhan3d ' + (lop || ''); lopNhan.appendChild(el); n = nhan[key] = { el, pos: new T.Vector3() }; }
  n.pos.copy(pos); if (n.el.textContent !== text) n.el.textContent = text;
}
const _v = new T.Vector3();
function manHinh(p) { _v.copy(p).project(cam); return { x: (_v.x + 1) / 2 * cv.clientWidth, y: (1 - _v.y) / 2 * cv.clientHeight, sau: _v.z > 1 }; }

// ---------- CON VẬT ----------
function choiHd(a, ten, lan) { // chuyển hoạt ảnh mượt
  if (!a.q) return;
  const hd = a.q.hd[ten]; if (!hd) return;
  if (a.dang === ten && !lan) return;
  a.motLan = !!lan;
  if (lan) { hd.reset(); hd.setLoop(T.LoopOnce, 1); hd.clampWhenFinished = false; }
  else hd.setLoop(T.LoopRepeat, Infinity);
  if (a.dang && a.q.hd[a.dang] && a.dang !== ten) a.q.hd[a.dang].fadeOut(0.2);
  hd.reset().fadeIn(0.2).play(); a.dang = ten;
  if (!a.dauTien) { hd.time = Math.random() * hd.getClip().duration; a.dauTien = true; }
}
function taoConVat(k, o, i) {
  const r = M.rnd(i * 7 + k.length), hw = o.v.w / 2 - 0.55, hd = o.v.d / 2 - 0.55;
  const goc = new T.Group(); o.g.add(goc);
  const moiVat = MOI && k !== 'ga' ? DH.vatMoi(k, i) : null; // bản mới: bò/heo/cừu dựng bằng code, cử động tự viết
  const q = !moiVat && k !== 'ga' && k !== 'ong' ? M.layVatQ(k) : null;
  let m;
  if (moiVat) m = moiVat;
  else if (q) { m = q.g; m.scale.setScalar(Q_DAI[k] / m.userData.dai); }
  else if (k === 'ong') m = M.toOng();
  else m = MOI && k === 'ga' ? DH.gaMoi(i) : M.vat(k); // bản mới: gà trộn đủ giống
  goc.add(m);
  const a = { goc, m, q, x: (r() - 0.5) * 2 * hw, z: (r() - 0.5) * 2 * hd, tx: 0, tz: 0, cho: r() * 2, hw, hd, loai: k, nhayT: 1 + r() * 3 };
  a.tx = a.x; a.tz = a.z; goc.position.set(a.x, 0, a.z); m.rotation.y = r() * 6;
  if (q) choiHd(a, 'Idle');
  if (k === 'ong') { // tổ ong xếp hàng, không đi lại; mỗi tổ 3 con ong bay vòng
    a.x = -o.v.w / 2 + 0.7 + (i % 5) * (o.v.w - 1.4) / 4; a.z = -0.25; a.tx = a.x; a.tz = a.z; a.tinh = true; m.rotation.y = 0; goc.position.set(a.x, 0, a.z);
    a.ong = [0, 1, 2].map(j => { const sp = new T.Sprite(new T.SpriteMaterial({ map: texHatTao('tron'), color: new T.Color(j % 2 ? 0xffd21f : 0x3a2a1a).convertSRGBToLinear() })); sp.scale.set(0.09, 0.09, 1); sp.userData.pha = j * 2.1 + i; goc.add(sp); return sp; });
  }
  goc.scale.setScalar(0.01); goc.userData.no = tg;
  return a;
}
function capNhatConVat(a, dt) {
  if (a.tinh) { // tổ ong
    for (const sp of a.ong) { const t = tg * (a.an ? 3 : 1.2) + sp.userData.pha; sp.position.set(Math.cos(t) * 0.45, 0.8 + Math.sin(t * 2.3) * 0.2, Math.sin(t) * 0.45); }
    if (a.goc.scale.x < 1) a.goc.scale.setScalar(Math.min(1, 0.01 + (tg - a.goc.userData.no) * 3));
    const b = a.goc.userData.bong; if (b) { b.position.y = b.userData.y0 + Math.sin(tg * 3 + a.x) * 0.06; if (b.scale.x < 0.95) b.scale.setScalar(Math.min(0.95, 0.01 + (tg - b.userData.no) * 4)); }
    return;
  }
  a.cho -= dt;
  const dx = a.tx - a.x, dz = a.tz - a.z, d = Math.hypot(dx, dz);
  const toc = a.loai === 'ga' ? 0.55 : a.loai === 'cho' ? 0.7 : a.loai === 'heo' ? 0.35 : 0.3;
  const diDuoc = a.cho <= 0 && d > 0.05;
  if (diDuoc) {
    const v = toc * (a.an || a.loai === 'cho' ? 1 : 0.6);
    const nx = a.x + dx / d * Math.min(d, v * dt), nz = a.z + dz / d * Math.min(d, v * dt);
    if (sauChong(a, nx, nz) > sauChong(a, a.x, a.z) + 1e-4) { a.tx = a.x; a.tz = a.z; a.cho = 0.4 + Math.random() * 0.8; } // bước tới sẽ đè con khác ⇒ đứng lại, lát chọn hướng khác
    else { a.x = nx; a.z = nz; }
    const huong = Math.atan2(dx, dz) + Q_XOAY; let lech = huong - a.m.rotation.y; lech = Math.atan2(Math.sin(lech), Math.cos(lech)); a.m.rotation.y += lech * Math.min(1, dt * 6);
    if (a.q) choiHd(a, a.q.hd.Walk ? 'Walk' : 'Jump');
    else if (a.m.userData.hd) a.m.userData.hd(tg, 'di');
    else a.m.position.y = Math.abs(Math.sin(tg * 12 + a.hw)) * 0.06; // gà nhảy lóc cóc
  } else {
    if (a.cho <= 0) { // chọn chỗ mới: tránh chỗ đang có con khác đứng (thử tối đa 8 lần)
      a.cho = 1.5 + Math.random() * 3.5;
      for (let t = 0; t < 8; t++) { a.tx = (Math.random() - 0.5) * 2 * a.hw; a.tz = (Math.random() - 0.5) * 2 * a.hd; if (sauChong(a, a.tx, a.tz) < -0.25) break; }
    }
    if (a.q) { if (!(a.motLan && a.q.hd.Jump && a.q.hd.Jump.isRunning())) choiHd(a, 'Idle'); }
    else if (a.m.userData.hd) a.m.userData.hd(tg, a.an ? 'an' : 'dung');
    else { a.m.position.y = 0; a.m.rotation.x = a.loai === 'ga' ? Math.max(0, Math.sin(tg * 5 + a.hw * 3)) * 0.35 : 0; }
  }
  // có hàng để nhặt: thỉnh thoảng nhảy lên cho HS để ý
  if (a.xong) { a.nhayT -= dt; if (a.nhayT <= 0) { a.nhayT = 2.5 + Math.random() * 2.5; if (a.q && a.q.hd.Jump) choiHd(a, 'Jump', true); else a.nhay = 0.4; } }
  if (a.nhay > 0) { a.nhay -= dt; a.m.position.y = Math.sin((0.4 - a.nhay) / 0.4 * Math.PI) * 0.25; }
  if (a.q) { a.q.mixer.update(dt); M.chibi(a.q); }
  a.goc.position.x = a.x; a.goc.position.z = a.z;
  if (a.goc.scale.x < 1) a.goc.scale.setScalar(Math.min(1, 0.01 + (tg - a.goc.userData.no) * 3));
  const b = a.goc.userData.bong; if (b) { b.position.y = b.userData.y0 + Math.sin(tg * 3 + a.hw) * 0.06; if (b.scale.x < 0.95) b.scale.setScalar(Math.min(0.95, 0.01 + (tg - b.userData.no) * 4)); }
}

// con cùng chuồng không đi đè lên nhau: mỗi con = 2 vòng tròn (trước · sau) theo hướng đang quay
// (bò dài ~1,3 m — 1 vòng tròn thì đầu con này vẫn chui vào mình con kia); chạm thì đẩy đều 2 bên, không ra khỏi chuồng
const VONG = { ga: [0, 0.22], bo: [0.42, 0.4, 0.3], heo: [0.26, 0.3, 0.1], cuu: [0.2, 0.32, 0.1] }; // [lệch trước/sau, bán kính, dời tâm về trước] (m) — bò có cổ + đầu dài phía trước
const _A = [[0, 0], [0, 0]], _B = [[0, 0], [0, 0]];
function haiVong(a, ra) {
  const [l, r, t = 0] = VONG[a.loai] || [0, 0.3], k = MOI ? (a.m.scale.x || 1) : 1, g = a.m.rotation.y, sx = Math.sin(g) * k, sz = Math.cos(g) * k;
  ra[0][0] = a.x + sx * (t + l); ra[0][1] = a.z + sz * (t + l); ra[1][0] = a.x + sx * (t - l); ra[1][1] = a.z + sz * (t - l); return r * k;
}
function sauChong(a, x, z) { // độ đè lớn nhất với con cùng chuồng nếu a đứng ở (x, z); âm = còn cách bấy nhiêu mét
  const ds = vatO[a.loai]; if (!ds || a.tinh) return -9;
  const ox = a.x, oz = a.z; a.x = x; a.z = z; const ra = haiVong(a, _A); a.x = ox; a.z = oz;
  let m = -9; for (const b of ds) { if (b === a || b.tinh) continue; const rb = haiVong(b, _B); for (const p of _A) for (const q of _B) m = Math.max(m, ra + rb - Math.hypot(p[0] - q[0], p[1] - q[1])); }
  return m;
}
function tachNhau(ds) {
  for (let i = 0; i < ds.length; i++) for (let j = i + 1; j < ds.length; j++) {
    const a = ds[i], b = ds[j]; if (a.tinh || b.tinh) continue;
    const can = haiVong(a, _A) + haiVong(b, _B); let sau = 0, ux = 0, uz = 0;
    for (const p of _A) for (const q of _B) { const dx = p[0] - q[0], dz = p[1] - q[1], d = Math.hypot(dx, dz); if (can - d > sau) { sau = can - d; ux = d > 1e-4 ? dx / d : Math.cos(i * 2.4); uz = d > 1e-4 ? dz / d : Math.sin(i * 2.4); } }
    if (sau <= 0) continue;
    a.x += ux * sau / 2; a.z += uz * sau / 2; b.x -= ux * sau / 2; b.z -= uz * sau / 2;
    // đang nhắm tới chỗ con kia đứng ⇒ bỏ điểm đích, đứng lại rồi chọn chỗ khác (khỏi cứ húc vào nhau)
    if (Math.hypot(a.tx - b.x, a.tz - b.z) < can) { a.tx = a.x; a.tz = a.z; }
    if (Math.hypot(b.tx - a.x, b.tz - a.z) < can) { b.tx = b.x; b.tz = b.z; }
  }
  for (const a of ds) { // giữ CẢ đầu lẫn đuôi trong chuồng (bò dài: chỉ giữ tâm thì đầu thò qua rào)
    if (a.tinh) continue; a.x = Math.max(-a.hw, Math.min(a.hw, a.x)); a.z = Math.max(-a.hd, Math.min(a.hd, a.z));
    const r = haiVong(a, _A), W = a.hw + 0.5 - r, H = a.hd + 0.5 - r; let lx = 0, lz = 0;
    for (const p of _A) { lx = Math.abs(p[0]) > W ? (p[0] > 0 ? W - p[0] : -W - p[0]) : lx; lz = Math.abs(p[1]) > H ? (p[1] > 0 ? H - p[1] : -H - p[1]) : lz; }
    if (lx || lz) { a.x += lx; a.z += lz; a.tx = a.x; a.tz = a.z; } // đụng rào ⇒ đứng lại, lát chọn chỗ khác
    a.goc.position.x = a.x; a.goc.position.z = a.z;
  }
}

// ---------- ĐỒNG BỘ THEO STATE ----------
// giai đoạn cây bản mới: n = số ngày tới chín, k = số ngày đã lớn (0..n-1) ⇒ 0 mầm · 1 cây non · 2 ra hoa/trổ (3 = chín, tính riêng)
function phaCay(n, k, tuoiHom) { const f = (k + (tuoiHom ? 0.5 : 0)) / n; return f < 0.3 ? 0 : f < 0.6 ? 1 : 2; }
// st = vườn đang xem (của mình, hoặc của bạn khi sang chơi: st.laBan = true) · me = state của mình (để lấy ngày, mùa)
function dongBo(st, me) {
  sCuoi = st; const ban = !!st.laBan, meS = me || st;
  // ô ruộng
  ruongO.forEach((o, i) => {
    const tt = ban ? (i < st.oMo ? E.oBanTT(meS, st, i) : { tt: 'khoa' }) : E.oTT(st, i), khoa = tt.tt === 'khoa', ke = khoa && tt.ke;
    hoangRuong[i].visible = khoa && !ke; o.lo.visible = !!ke; o.d.visible = !khoa;
    if (o.g.userData.lanDau == null) { o.g.userData.lanDau = !khoa; }
    datNhan('o' + i, ke ? new T.Vector3(o.g.position.x, 0.45, o.g.position.z) : null, ke ? (st.cap >= tt.cfg.cap ? 'Mở ô · ' + tt.cfg.diem + ' 📘' : '🔒 cấp ' + tt.cfg.cap + ' · ' + tt.cfg.diem + ' 📘') : '', 'mo');
    o.uot.visible = tt.tt === 'lon' && tt.tuoiHom;
    const C = tt.cay && D.RUONG[tt.cay];
    const gd = !C ? -1 : tt.tt === 'chin' ? 2 : (1 - tt.conNgay / C.ngay) < 0.5 ? 0 : 1;
    // bản mới (dohoa.js): 4 giai đoạn mầm · cây non · ra hoa/trổ · chín, theo số ngày đã lớn; tưới hôm nay nhích thêm nửa ngày
    // (cây 1 ngày: tưới xong mầm lên cây non ngay — HS thấy việc mình làm có tác dụng). gd giữ nghĩa cũ (2 = chín)
    const pha = gd < 0 ? -1 : gd === 2 ? 3 : MOI && DH.coCay(tt.cay) ? phaCay(C.ngay, C.ngay - tt.conNgay, tt.tuoiHom) : gd;
    const key = gd < 0 ? '' : tt.cay + pha;
    if (key !== o.key) {
      if (o.cay) o.g.remove(o.cay);
      o.cay = null; o.key = key;
      if (gd >= 0) { o.cay = (MOI && DH.cayMoi(tt.cay, pha, i)) || M.cayMesh(tt.cay, gd, i); o.cay.position.y = 0.12; o.cay.scale.setScalar(0.4); o.cay.userData.no = tg; o.g.add(o.cay); }
    }
    o.gd = gd;
    if (MOI) { const kt = (tt.sau ? Math.min(2, tt.sau) : 0) + '|' + (tt.bon ? 1 : 0); // bản mới: con sâu xanh · hạt phân rắc trên ô
      if (kt !== o.ttKey) { if (o.ttG) o.g.remove(o.ttG); o.ttKey = kt; o.ttG = kt === '0|0' ? null : DH.trangThaiO({ sau: tt.sau ? Math.min(2, tt.sau) : 0, bon: tt.bon }); if (o.ttG) o.g.add(o.ttG); } }
    let b = null;
    if (tt.sau) b = '#sau';
    else if (tt.tt === 'lon' && !tt.tuoiHom) b = '#nuoc';
    else if (ban && tt.tt === 'chin' && tt.quaHan && tt.tromDuoc > 0 && !st.ruong[i].daHai) b = '#trom';
    datBong(o.g, b || '', b, 1.0, false, 0.62);
  });
  // chuồng gà, bò + con vật (thêm/bớt cho khớp vườn đang xem)
  for (const k in chuongO) {
    const o = chuongO[k], V = D.VAT[k], v = st.vat[k], mo = st.cap >= V.cap;
    o.trong.visible = mo; o.lo.visible = !mo && !ban && st.cap === V.cap - 1; o.hoang.visible = !mo && !o.lo.visible;
    datNhan('chuong_' + k, o.lo.visible ? new T.Vector3(o.v.x, 0.3, o.v.z) : null, '🔒 ' + (k === 'ga' ? 'Chuồng gà' : 'Bãi cỏ bò') + ' · cấp ' + V.cap, 'mo');
    while (vatO[k].length < v.con.length) vatO[k].push(taoConVat(k, o, vatO[k].length));
    while (vatO[k].length > v.con.length) { const a = vatO[k].pop(); o.g.remove(a.goc); }
    vatO[k].forEach((a, i) => {
      const t = E.vatTT(meS, k, v.con[i]), cao = k === 'ga' ? 0.95 : 1.45;
      if (!ban && t === 'xong') datBong(a.goc, 'x', V.ra, cao);
      else if (!ban && t === 'doi') datBong(a.goc, 'd', Object.keys(V.an)[0], cao, true);
      else datBong(a.goc, '', null);
      a.an = t === 'an'; a.xong = t === 'xong';
    });
  }
  // lò bánh
  { const o = loO, tt = ban ? { tt: st.cap >= D.LO_CAP ? 'trong' : 'khoa' } : E.loTT(st); o.g.visible = D.LO_CAP < 30;
    o.mo.visible = tt.tt !== 'khoa'; o.lo.visible = tt.tt === 'khoa' && !ban && st.cap === D.LO_CAP - 1; o.hoang.visible = tt.tt === 'khoa' && !o.lo.visible;
    datNhan('lo', o.lo.visible ? new T.Vector3(o.v.x, 0.3, o.v.z) : null, '🔒 Lò bánh · cấp ' + D.LO_CAP, 'mo');
    datBong(o.g, tt.tt === 'xong' ? 'x' + tt.mon : '', tt.tt === 'xong' ? tt.mon : null, CAO_LO + 0.45);
    o.chay = tt.tt === 'dang'; }
  // chỗ trang trí
  const coDo = !ban && Object.keys(D.TRANG_TRI).some(id => E.so(st, id) > 0);
  ttO.forEach((o, i) => {
    const id = st.trangTri[i] || null;
    if (o.id !== id) { if (o.mo) o.g.remove(o.mo); o.mo = id ? M.ttModel(id) : null; if (o.mo) { o.mo.traverse(m => { if (m.isMesh) m.castShadow = true; }); o.g.add(o.mo); } o.id = id; }
    o.dau.visible = !id && coDo;
  });
  // thú cưng: chó ở mọi vườn; mèo, chim chỉ vườn mình (đã tới cấp) · tim = hôm nay chưa chơi cùng
  const thuMo = k => st.cap >= D.THU[k].cap;
  if (meoO) meoO.userData.neo.visible = !ban && thuMo('meo');
  if (chimO) chimO.visible = !ban && thuMo('chim');
  const Dn = E.homNay(meS);
  for (const [k, g, y] of [['cho', choO && choO.goc, 1.0], ['meo', meoO, 1.05], ['chim', chimO, 2.0]]) {
    if (!g) continue; const x = !ban && thuMo(k) && st.thu[k].d !== Dn;
    datBong(g, x ? 't' : '', x ? '#tim' : null, y, false, 0.6);
  }
  // chợ luôn mở; hộp thư có tin mới
  sapO.visible = true; sapLo.visible = false; sapHoang.visible = false;
  if (hopThuO) datBong(hopThuO, !ban && st.thuMoi ? 'm' : '', !ban && st.thuMoi ? '#thu' : null, 1.9, false, 0.7);
  if (ban) datGiay(0);
}
// bảng tin lớp: mỗi bạn có việc (giúp / hái được) = 1 tờ giấy
function datGiay(n) {
  if (n === soGiay) return; soGiay = n;
  giayO.forEach(g => bangO.remove(g)); giayO = [];
  for (let i = 0; i < Math.min(n, 8); i++) { const g = M.giayDon(i % 2 ? 0xb8f0a0 : 0xfff3b0); g.position.set(-0.75 + (i % 5) * 0.37, 1.35 - Math.floor(i / 5) * 0.45, 0.07); giayO.push(g); bangO.add(g); }
}
function dongHo(ms) {
  const s = Math.ceil(ms / 1000); if (s < 60) return s + 'g';
  const m = Math.ceil(s / 60); if (m < 60) return m + 'p';
  const h = Math.floor(m / 60); return h + 'h' + (m % 60 ? ' ' + (m % 60) + 'p' : '');
}

// ---------- KHUNG HÌNH ----------
let xeChay = 0, tLapLanh = 0;
const _p = new T.Vector3();
const dhDo = { t: 0, n: 0, buoc: 0, cho: 3 }; // đo FPS thật: máy yếu (iPad gen 7) thì tự hạ chất lượng từng bước
function tuHaChatLuong(dThat) {
  dhDo.t += dThat; dhDo.n++; if (dhDo.t < 2) return;
  const fps = dhDo.n / dhDo.t; dhDo.t = 0; dhDo.n = 0;
  if (dhDo.cho > 0) { dhDo.cho--; return; } // bỏ mấy giây đầu (nạp, biên dịch shader)
  if (fps >= 45 || dhDo.buoc >= 4) return;
  const b = ++dhDo.buoc; DH.buocCL = b;
  if (b === 1) R.setPixelRatio(Math.min(devicePixelRatio, 1.25)); else if (b === 2) hk.setMsaa(2); else if (b === 3) R.setPixelRatio(1); else hk.tatTilt();
  doiCo(); console.info('[đồ hoạ] tự hạ chất lượng bước', b, '· fps', fps.toFixed(0));
}
function khung(dtEp) {
  const dThat = dtEp ? 0 : clock.getDelta(), dt = dtEp || Math.min(0.05, dThat); tg += dt;
  if (hk && !dtEp && dThat > 0 && dThat < 1) tuHaChatLuong(dThat);
  datCam();
  // ruộng mới nảy lên; cây mới "bật" lên có nảy; cây đung đưa
  ruongO.forEach((o, i) => {
    if (o.g.scale.x < 1 && !nayDs.some(n => n.g === o.g)) o.g.scale.setScalar(Math.min(1, 0.01 + (tg - o.g.userData.no) * 3));
    if (o.cay) {
      const t = tg - o.cay.userData.no;
      if (t < 1) o.cay.scale.setScalar(1 - Math.exp(-t * 9) * Math.cos(t * 16) * 0.6);
      o.cay.rotation.z = Math.sin(tg * 1.6 + i * 0.7) * 0.035; o.cay.rotation.x = Math.sin(tg * 1.3 + i) * 0.02;
    }
  });
  ruongO.forEach((o, i) => nhunBong(o.g, i));
  // lúa chín thỉnh thoảng lấp lánh
  tLapLanh -= dt;
  if (tLapLanh <= 0) { tLapLanh = 0.7; const chin = ruongO.filter(o => o.gd === 2); if (chin.length) { const o = chin[Math.floor(Math.random() * chin.length)]; _p.set(o.g.position.x, 0.6, o.g.position.z); hatTai(_p, 'sao', 1); } }
  // con vật
  for (const k in vatO) { for (const a of vatO[k]) capNhatConVat(a, dt); tachNhau(vatO[k]); tachNhau(vatO[k]); } // 2 lượt: lượt giữ-trong-rào có thể đẩy con này vào con kia
  if (choO && !choO.moi) capNhatConVat(choO, dt);
  if (choNuoi) choNuoi.capNhat(dt, tg);
  // lò bánh đang nướng: nhún + nhả khói
  if (loO) {
    const o = loO, s0 = o.mo.userData.s0 ? o.mo.userData.s0.y : o.mo.scale.x;
    if (!nayDs.some(n => n.g === o.mo)) o.mo.scale.y = o.chay ? s0 * (1 + Math.sin(tg * 7) * 0.03) : s0;
    if (o.chay && o.mo.visible) { o.tKhoi -= dt; if (o.tKhoi <= 0) { o.tKhoi = 0.6; _p.set(o.v.x + KHOI_LO[0], KHOI_LO[1], o.v.z + KHOI_LO[2]); hatTai(_p, 'khoi', 1); } }
    nhunBong(o.g, 0);
  }
  // thú cưng: mèo vẫy đuôi, nghiêng đầu · chim nhảy lách chách, mổ hạt
  if (meoO) { const u = meoO.userData; u.duoi.rotation.z = Math.sin(tg * 2.2) * 0.35; u.dau.rotation.z = Math.sin(tg * 0.7) * 0.12; u.dau.rotation.x = Math.max(0, Math.sin(tg * 0.45)) * 0.15; nhunBong(meoO, 1); }
  if (chimO) { const c = chimO.userData.chim, t = tg % 3; c.position.y = 1.15 + (t < 0.3 ? Math.sin(t / 0.3 * Math.PI) * 0.12 : 0); c.rotation.x = t > 1.2 && t < 1.5 ? 0.5 : 0; c.rotation.y = Math.sin(tg * 0.8) * 0.8; nhunBong(chimO, 2); }
  if (choO) nhunBong(choO.goc, 3);
  if (hopThuO) nhunBong(hopThuO, 4);
  ttO.forEach((o, i) => { if (o.dau.visible) { const k = 1 + Math.sin(tg * 3 + i) * 0.08; o.dau.scale.set(k, k, k); } });
  for (const k in vatO) for (const a of vatO[k]) nhunBong(a.goc, a.hw);
  // nảy khi chạm (lò xo tắt dần)
  for (let i = nayDs.length - 1; i >= 0; i--) {
    const n = nayDs[i]; n.t += dt; const s0 = n.g.userData.s0, k = Math.sin(n.t * 26) * Math.exp(-n.t * 7) * n.a;
    n.g.scale.set(s0.x * (1 - k * 0.5), s0.y * (1 + k), s0.z * (1 - k * 0.5));
    if (n.t > 0.8) { n.g.scale.copy(s0); nayDs.splice(i, 1); }
  }
  // hạt hiệu ứng
  for (let i = hatDs.length - 1; i >= 0; i--) {
    const s = hatDs[i], u = s.userData; u.t += dt;
    u.v.y += u.g * dt; s.position.addScaledVector(u.v, dt); if (u.g < 0 && s.position.y < 0.05) { s.position.y = 0.05; u.v.multiplyScalar(0.5); }
    const p = u.t / u.song; s.material.opacity = p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) / 0.3); s.material.rotation += u.xoay * dt;
    const co = u.co * (1 + (u.lon - 1) * p) * (p < 0.15 ? p / 0.15 : 1); s.scale.set(co, co, 1);
    if (u.t >= u.song) { sc.remove(s); s.material.dispose(); hatDs.splice(i, 1); }
  }
  // bướm
  for (const b of buomDs) {
    const u = b.userData, t = tg * 0.6 + u.pha, x = u.tam.x + Math.cos(t) * u.bk + Math.sin(t * 2.3) * 0.3, z = u.tam.z + Math.sin(t * 1.3) * u.bk;
    const y = 0.7 + Math.sin(t * 3.1) * 0.25 + 0.2; b.rotation.y = Math.atan2(x - b.position.x, z - b.position.z); b.position.set(x, y, z);
    const f = Math.sin(tg * 22 + u.pha) * 1.1; u.L.rotation.z = f; u.P.rotation.z = -f;
  }
  // suối chảy + vịt bơi quanh hồ
  if (texSuoi) texSuoi.offset.x -= dt * 0.05;
  vitDs.forEach((v, i) => { const u = v.userData, t = tg * 0.12 + u.pha, A = VT.ao, x = A.x + Math.cos(t) * A.rx * u.bk, z = A.z + Math.sin(t) * A.rz * u.bk; v.rotation.y = Math.atan2(-Math.cos(t) * A.rz, -Math.sin(t) * A.rx); v.position.set(x, 0.02 + Math.sin(tg * 2 + i) * 0.02, z); });
  // ao: lá sen dập dềnh
  if (aoO && aoO.userData.la) aoO.userData.la.position.y = Math.sin(tg * 1.5) * 0.01;
  // xe tải chạy đi rồi về
  if (xeChay > 0 && xeO) {
    xeChay = Math.max(0, xeChay - dt); const p = 1 - xeChay / 4, g = xeO.userData.goc;
    const di = p < 0.5 ? p * 2 : (1 - p) * 2, e = di * di * (3 - 2 * di);
    xeO.position.set(g.x - 1.1 * Math.min(1, e * 4), Math.abs(Math.sin(tg * 18)) * 0.03 * (xeChay > 0 ? 1 : 0), g.z + 16 * e); xeO.rotation.y = p < 0.5 ? 0 : Math.PI;
    if (!xeChay) { xeO.rotation.y = 0; xeO.position.y = 0; }
  }
  // nhãn DOM
  for (const k in nhan) { const n = nhan[k], p = manHinh(n.pos); n.el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%)`; n.el.style.display = p.sau ? 'none' : ''; }
  cb.khung && cb.khung(dt);
  if (MOI) { DH.gio(tg); if (khoG.nha && khoG.nha.userData.hd) khoG.nha.userData.hd(tg); } // gió lắc cây · khói ống khói, chong chóng trên nóc nhà
  if (bongDat && (canBong || tg - tBong > 0.5)) { bongDat.capNhat(); canBong = false; tBong = tg; } // con vật đi lại ⇒ chụp lại bóng tiếp đất 2 lần/giây
  if (hk) hk.render(sc, cam, tg, Math.max(0.2, Math.min(1, (kc - 10) / 16))); else R.render(sc, cam); // phóng gần (kc 10) ⇒ mờ còn 20%, nhìn toàn cảnh (≥26) ⇒ đủ
}

// ---------- NHẬP LIỆU: chạm / vuốt / kéo / phóng ----------
const ray = new T.Raycaster(), ndc = new T.Vector2(), matDat = new T.Plane(new T.Vector3(0, 1, 0), 0);
function tia(x, y) { const r = cv.getBoundingClientRect(); ndc.set((x - r.left) / r.width * 2 - 1, -(y - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, cam); }
function trungVat(x, y) {
  tia(x, y); const h = ray.intersectObjects(pick, false)[0]; if (!h) return null;
  let o = h.object; while (o && !o.userData.chon) o = o.parent; return o ? o.userData.chon : null;
}
function trungRuong(x, y) { tia(x, y); const h = ray.intersectObjects(ruongO.map(o => o.d), false)[0]; return h ? h.object.userData.chon.i : -1; }
function diemDat(x, y) { tia(x, y); const p = new T.Vector3(); return ray.ray.intersectPlane(matDat, p) ? p : null; }

let tro = new Map(), che = null; // che: {kieu:'cho'|'keo'|'quet'|'phong', ...}
function ganInput() {
  cv.addEventListener('pointerdown', e => {
    cv.setPointerCapture(e.pointerId); tro.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (tro.size === 2) { const [a, b] = [...tro.values()]; che = { kieu: 'phong', d0: Math.hypot(a.x - b.x, a.y - b.y), kc0: kc }; return; }
    if (che && che.kieu === 'quet') return;
    const chon = trungVat(e.clientX, e.clientY);
    if (chon && chon.loai === 'ruong' && cb.batDauVuot && cb.batDauVuot(chon.i, e)) { che = { kieu: 'quet', lx: e.clientX, ly: e.clientY }; return; }
    che = { kieu: 'cho', x: e.clientX, y: e.clientY, chon };
  });
  addEventListener('pointermove', e => {
    if (tro.has(e.pointerId)) tro.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!che) return;
    if (che.kieu === 'phong' && tro.size === 2) { const [a, b] = [...tro.values()]; kc = che.kc0 * che.d0 / Math.max(20, Math.hypot(a.x - b.x, a.y - b.y)); return; }
    if (che.kieu === 'quet') { // vuốt nhanh: dò cả các điểm giữa 2 lần di để không sót ô
      const x0 = che.lx == null ? e.clientX : che.lx, y0 = che.ly == null ? e.clientY : che.ly, n = Math.max(1, Math.ceil(Math.hypot(e.clientX - x0, e.clientY - y0) / 12));
      for (let k = 1; k <= n; k++) { const i = trungRuong(x0 + (e.clientX - x0) * k / n, y0 + (e.clientY - y0) * k / n); if (i >= 0) cb.vuot && cb.vuot(i); }
      che.lx = e.clientX; che.ly = e.clientY; return; }
    if (che.kieu === 'cho' && Math.hypot(e.clientX - che.x, e.clientY - che.y) > 8) { che = { kieu: 'keo', p0: diemDat(e.clientX, e.clientY) }; cb.boChon && cb.boChon(); }
    if (che.kieu === 'keo' && che.p0) { const p = diemDat(e.clientX, e.clientY); if (p) { muc.x += che.p0.x - p.x; muc.z += che.p0.z - p.z; datCam(); } }
  });
  const len = e => {
    tro.delete(e.pointerId);
    if (!che) return;
    if (che.kieu === 'cho') cb.cham && cb.cham(che.chon, e.clientX, e.clientY);
    if (che.kieu === 'quet') cb.hetVuot && cb.hetVuot();
    if (tro.size === 0 || che.kieu !== 'phong') che = null;
  };
  addEventListener('pointerup', len); addEventListener('pointercancel', len);
  cv.addEventListener('wheel', e => { e.preventDefault(); kc *= e.deltaY > 0 ? 1.1 : 0.9; }, { passive: false });
}
// ui.js gọi khi bấm giữ 1 hạt giống trong bong bóng: vuốt qua ruộng để gieo tiếp
function batQuet(x, y) { che = { kieu: 'quet', lx: x, ly: y }; }

// vị trí 3D của 1 thứ (để mở bong bóng / bay hiệu ứng)
function viTri(chon) {
  if (!chon) return null;
  if (chon.loai === 'ruong') { const p = ruongViTri(chon.i); return new T.Vector3(p.x, 0.6, p.z); }
  if (chon.loai === 'chuong') { const v = VT.chuong[chon.id]; return new T.Vector3(v.x, 1.2, v.z); }
  if (chon.loai === 'lo') return new T.Vector3(VT.lo.x, CAO_LO, VT.lo.z);
  if (chon.loai === 'kho') { const v = VT[chon.id] || VT.barn; return new T.Vector3(v.x, 2.5, v.z); }
  if (chon.loai === 'bang') return new T.Vector3(VT.bang.x, 2, VT.bang.z);
  if (chon.loai === 'nha') return new T.Vector3(VT.nha.x, 3.0, VT.nha.z);
  if (chon.loai === 'sap') return new T.Vector3(VT.sap.x, 2.2, VT.sap.z);
  if (chon.loai === 'hopThu') return new T.Vector3(VT.hopThu.x, 1.5, VT.hopThu.z);
  if (chon.loai === 'tt') { const [x, z] = VT.trangTri[chon.o]; return new T.Vector3(x, 1.0, z); }
  if (chon.loai === 'thu') {
    if (chon.id === 'cho' && choO) { const p = new T.Vector3(); choO.goc.getWorldPosition(p); p.y = 0.8; return p; }
    const v = VT[chon.id]; return v ? new T.Vector3(v.x, chon.id === 'chim' ? 1.7 : 0.8, v.z) : null;
  }
  return null;
}
function xeDi() { xeChay = 4; }
function nhinVe(chon) { const p = viTri(chon); if (p) { muc.x = p.x; muc.z = p.z; muc.addScaledVector(XUONG, 0.6); } }
// DEV: chụp canvas (pane ẩn thì rAF đứng — chạy tay vài khung trước khi chụp)
function chup(ten, soKhung) { for (let i = 0; i < (soKhung || 1); i++) khung(0.05); return fetch('/_snap?name=' + (ten || 'farm'), { method: 'POST', body: cv.toDataURL('image/jpeg', 0.85) }).then(r => r.text()); }

window.NT_SCENE = { init, datLe: (t, d) => { leTren = t; leDuoi = d; if (cv) { const cu = kcVua; doiCo(); if (cu === kcVua) return; } }, vaoGiua: () => { vaoGiua(); kc = kcVua; }, dongBo, datGiay, manHinh, viTri, batQuet, xeDi, nhinVe, dongHo, chup, nay, hat, VT, _dbg: () => ({ muc, kc, cam, sc, R, hk }), _datCam: (x, z, k) => { muc.x = x; muc.z = z; if (k) kc = k; } };
})();
