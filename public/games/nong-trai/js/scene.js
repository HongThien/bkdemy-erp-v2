/* Nông Trại BK — CẢNH 3D: bố trí nông trại, camera (kéo/phóng), chạm & vuốt (gieo/gặt nhiều ô), đồng bộ hình theo state,
   hiệu ứng "juice" (nảy khi chạm, hạt bay, khói, bướm, con vật nhún nhảy).
   Không chứa luật: chỉ đọc state (qua NT_ENGINE) và báo thao tác cho ui.js qua callback. */
(function () {
'use strict';
const T = THREE, M = NT_MODELS, D = NT_DATA, E = NT_ENGINE;
const DH = window.NT_DOHOA, MOI = !!(DH && DH.moi); // lớp hoàn thiện đồ hoạ (js/dohoa.js) — ?dohoa=cu để xem bản cũ
let hk = null, bongDat = null, canBong = false, tBong = 0;
let troiO = null, hemiL = null, sunL = null, nenTrong = null; // nền (thường / tuyết / Halloween) đổi ánh sáng + trời tại chỗ — xem NỀN bên dưới

// ---------- BỐ TRÍ GỌN kiểu Nông trại vui vẻ (CEO 30/09, kèm ảnh mẫu: "bố cục như này thôi, không cần quá rộng, mình đâu có làm giống Hay Day") ----------
// Ruộng lớn bên trái · sân đất có rào bên phải (nhà, kho, chuồng gà, chuồng bò, chó) · ao góc dưới · chợ + bảng tin lớp bên trái.
// Camera nhìn từ nam–đông nam (HUONG): +x = sang phải (hơi xuống) · −z = lên trên (hơi sang phải) trên màn hình.
const VT = {
  ruong: { x: -8.65, z: -0.6, cot: 4, buoc: 2.45, co: 2.2 },    // 12 ô (4 × 3) liền nhau như ô đất Nông trại vui vẻ; co = cỡ 1 ô (m)
  // Thùy 14/11 "nhà bị bé so với rào khu vực, rào cũng thế": nhà ×1,8 (trước ×1,39), rào đoạn ~1,6 m (cao ×1,6), kho + máy chế biến to theo;
  // sân nới ra để chứa (11,4 × 8,8) và có đồ trang trí (SAN_DO bên dưới). Dải giữa x 3,7..6,5 = lối đi từ cổng vào cửa nhà.
  san: { x0: -0.6, x1: 10.8, z0: -12.0, z1: -3.2, cong: 5.1 },  // sân đất có rào (góc trên phải màn); cong = x của cổng ở cạnh trước
  nha: { x: 5.1, z: -9.7, rong: 4.14 },
  barn: { x: -2.7, z: -5.3, rong: 2.6 },                        // Thùy 14/11: nhà kho đỏ (mô hình KayKit, lệch tông với nhà dựng bằng code) ra NGOÀI sân, đứng cạnh máy chế biến
  silo: null,                                                 // bỏ (thế giới Hay Day) — chạm kho nào cũng là mở kho
  bang: { x: -8.2, z: -4.8 },                                 // bảng tin lớp (chỗ bảng "Lịch canh tác")
  sap: { x: -13.2, z: 2.9, rong: 2.4 },                       // chợ
  chuong: { ga: { x: 1.9, z: -4.9, w: 3.6, d: 2.4 }, bo: { x: 8.4, z: -5.0, w: 3.8, d: 2.6 } },
  lo: { x: -2.6, z: -8.3, rong: 2.0 },                          // Thùy 14/11: máy chế biến đứng NGOÀI sân (bên trái rào), không chiếm khuôn viên nhà
  trangTri: [[-12.4, -1.6], [-12.2, 6.8], [-5.0, 7.8], [1.4, 6.6], [12.1, -6.2], [12.0, -9.4], [-5.2, -3.6], [-5.0, -7.4]],
  meo: { x: 1.9, z: -7.2 }, chim: { x: 9.5, z: -8.3 },
  hopThu: { x: 7.3, z: -2.4 },
  ao: { x: 7.9, z: 3.4, rx: 3.9, rz: 2.7 },                    // hồ trước cổng sân (Thùy 14/11: to ra, đẹp hơn, có chỗ câu cá) — trước là ao nhỏ 2,3 × 1,6 ở (9,4 · 1,0)
  cau: { x: 2.9, z: 3.4, dai: 2.7 },                           // cầu gỗ câu cá: gốc ở bờ trái hồ, chạy theo +x ra mặt nước
  cho: { x: 5.0, z: -1.7, hw: 0.6, hd: 0.5 }, nhaCho: { x: 3.3, z: -1.6 },   // chó giữ trại ngay trước cổng sân
  bien: { x0: -16, x1: 13.5, z0: -13.2, z1: 9.8 },
};
const CAO_LO = 2.75, KHOI_LO = [0.69, 2.5, -0.44];
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
  dt.d[0] -= 2.4; ip.d[0] -= 2.4; return { dt, ip }; })();                          // nóc nhà cao hơn mặt sân
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
  troiO = bauTroi(); sc.add(troiO);
  cam = new T.PerspectiveCamera(24, 1, 0.5, 400);   // ống kính hẹp ⇒ gần kiểu nhìn phẳng (isometric) của Nông trại vui vẻ, ô gần – ô xa to như nhau
  if (MOI) sc.add(hemiL = new T.HemisphereLight(new T.Color(DH.TS.troi.tren).convertSRGBToLinear(), new T.Color(DH.TS.troi.duoi).convertSRGBToLinear(), DH.TS.troi.manh)); // đất hắt màu be, không hắt xanh
  else sc.add(hemiL = new T.HemisphereLight(new T.Color(0xfff8ee).convertSRGBToLinear(), new T.Color(0x8fcf5a).convertSRGBToLinear(), 0.8));
  const sun = new T.DirectionalLight(new T.Color(MOI ? DH.TS.nang.mau : 0xffe9c9).convertSRGBToLinear(), MOI ? DH.TS.nang.manh : 1.05); sun.position.set(-12, 22, 15); sun.target.position.set(-2, 0, -1);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 22, bottom: -22, near: 1, far: 80 });
  sc.add(sun, sun.target); sunL = sun;
  dungTheGioi();
  dungNhaMay();
  dungTrangTri();
  if (MOI) { hk = DH.taoHauKy(R); bongDat = DH.taoBongDat(R, sc, { x0: -72, x1: 52, z0: -62, z1: 58 }); canBong = true; }
  dungNen();
  ganInput();
  doiCo(); addEventListener('resize', doiCo);
  R.setAnimationLoop(() => khung());
}
function bauTroi() { // vòm trời chuyển màu: xanh đậm trên đỉnh → xanh nhạt ở chân trời
  const g = new T.SphereGeometry(300, 24, 16);
  g.setAttribute('color', new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3)); toMauTroi(g, 0x6ec3ff, 0xdff3ff);
  return new T.Mesh(g, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide, fog: false, depthWrite: false }));
}
function toMauTroi(g, tren, duoi) { const top = new T.Color(tren), bot = new T.Color(duoi), c = new T.Color(), A = g.attributes.color;
  for (let i = 0; i < g.attributes.position.count; i++) { const y = g.attributes.position.getY(i) / 300; c.copy(bot).lerp(top, Math.max(0, Math.min(1, y * 2.2))).convertSRGBToLinear(); A.setXYZ(i, c.r, c.g, c.b); }
  A.needsUpdate = true; }
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
  nuocMat.push({ m: vien.material, goc: vien.material.color.clone() }, { m: long.material, goc: long.material.color.clone() });
}
const nuocMat = []; // vật liệu nước ao — nền đêm làm tối (doiNen)
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
  x.lineJoin = 'round';
  const chu = (t, y, co, net) => { let k = co; do { x.font = '900 ' + k + 'px system-ui, "Segoe UI", Arial, sans-serif'; k -= 2; } while (x.measureText(t).width > 484 && k > 20); x.lineWidth = net; x.strokeStyle = '#7a3f12'; x.strokeText(t, 256, y); x.fillStyle = '#fff6dc'; x.fillText(t, 256, y); };
  const tx = new T.CanvasTexture(c);
  // Thùy 14/11: biển đề TÊN HỌC SINH — dòng nhỏ "NÔNG TRẠI", dòng to tên em (tên dài tự thu chữ); chưa biết tên (bản thử) ⇒ "NÔNG TRẠI BK"
  g.userData.ve = ten => { x.clearRect(0, 0, 512, 128); if (ten) { chu('NÔNG TRẠI', 31, 40, 9); chu(ten.toUpperCase(), 88, 62, 11); } else chu('NÔNG TRẠI BK', 68, 70, 12); tx.needsUpdate = true; };
  g.userData.ve(tenTrai); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4;
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
  // rào: mỗi cạnh chia đều thành đoạn ~1,6 m (mô hình phóng theo chiều dài đoạn ⇒ cao ×1,6); cổng hở CONG_HO mỗi bên
  const rao = [], doan = (a, b, f) => { const n = Math.max(1, Math.round((b - a) / 1.6)), L = (b - a) / n; for (let i = 0; i < n; i++) f(a + (i + 0.5) * L, L); };
  doan(S.x0, S.x1, (x, L) => rao.push({ x, z: S.z0, xoay: Math.PI / 2, k: L }));
  for (const [a, b] of [[S.x0, S.cong - CONG_HO], [S.cong + CONG_HO, S.x1]]) doan(a, b, (x, L) => rao.push({ x, z: S.z1, xoay: Math.PI / 2, k: L }));
  doan(S.z0, S.z1, (z, L) => { rao.push({ x: S.x0, z, xoay: 0, k: L }); rao.push({ x: S.x1, z, xoay: 0, k: L }); });
  if (!MOI) sc.add(M.nhanBan('fence_wood_straight', rao, 1.0));   // bản mới: rào quanh sân theo KIỂU NHÀ (raoSan, đổi trong doiNha)
  dungSan();
  hopThuO = dat(hopThu(), VT.hopThu.x, VT.hopThu.z, 0); neo(VT.hopThu.x, VT.hopThu.z).add(hopCham(0.8, 1.6, 0.8, { loai: 'hopThu' }));
  // bờ bụi quanh trại, rừng bông xù vòng ngoài (dày ở mép, thưa dần ra xa)
  const bui = [];
  const themBui = (x, z) => { if (!trongHo(x, z, 0)) bui.push({ x, z, kieu: 'bui', xoay: r2() * 6, k: 1.05 + r2() * 0.5 }); };
  for (let x = B.x0 + 0.8; x < B.x1 + 0.5; x += 1.1 + r2() * 0.5) { themBui(x, B.z0 - 0.5 - r2() * 0.5); themBui(x, B.z1 + 0.5 + r2() * 0.5); }
  for (let z = B.z0; z < B.z1 + 0.5; z += 1.1 + r2() * 0.5) { themBui(B.x1 + 0.5 + r2() * 0.5, z); themBui(B.x0 - 0.5 - r2() * 0.5, z); }
  // Thùy 03/11 'cây hơi xấu, nhiều mẫu hơn': 9 kiểu (models.js cayBongGeo); dừa/tre gần trại, thông/bách ra xa
  const CAY_CACH = { bui: 1.1, bach: 1.25, bachTung: 1.15, tre: 1.35, dua: 1.6, tang: 2.0 };
  const chonKieuCay = (q, ngoai) => { const ds = [['tron', 26], ['cao', 13], ['tang', 11], ['bach', 9], ['bui', 8], ['tre', ngoai < 14 ? 8 : 2], ['dua', ngoai < 12 ? 5 : 0], ['bachTung', ngoai > 4 ? 8 : 1], ['thong', ngoai > 8 ? 12 : 0]];
    let t = 0; for (const d of ds) t += d[1]; q *= t; for (const d of ds) { if (q < d[1]) return d[0]; q -= d[1]; } return 'tron'; };
  const rung = [], luoi = new Map();
  const choTrong = (x, z, d) => { const gx = Math.floor(x / 3), gz = Math.floor(z / 3); for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const p of luoi.get((gx + i) + ',' + (gz + j)) || []) if (Math.hypot(p[0] - x, p[1] - z) < d) return false; return true; };
  const ghi = (x, z) => { const k = Math.floor(x / 3) + ',' + Math.floor(z / 3); if (!luoi.has(k)) luoi.set(k, []); luoi.get(k).push([x, z]); };
  for (let i = 0; i < 9000 && rung.length < 300; i++) {
    const x = -60 + r2() * 110, z = -50 + r2() * 100, ngoai = Math.max(B.x0 - x, x - B.x1, B.z0 - z, z - B.z1);
    if (ngoai < 1.8 || r2() > (ngoai < 10 ? 1 : ngoai < 22 ? 0.5 : 0.22)) continue;
    const kieu = chonKieuCay(r2(), ngoai), k = kieu === 'bui' ? 1.2 + r2() * 0.6 : kieu === 'tre' ? 1.0 + r2() * 0.35 : kieu === 'dua' ? 1.3 + r2() * 0.35 : 1.15 + r2() * 0.75;
    if (!choTrong(x, z, (CAY_CACH[kieu] || 1.7) * k)) continue;
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
  if (MOI) doiNha(new URLSearchParams(location.search).get('kieu') || 'go');
  else khoG.nha = dat(M.vua(M.kk('building_home_A_blue'), VT.nha.rong), VT.nha.x, VT.nha.z, Math.PI);
  neo(VT.nha.x, VT.nha.z).add(hopCham(4.2, 3.8, 3.4, { loai: 'nha' }));
  if (!MOI) dat(M.vua(M.kk('lantern'), 0.5, 1.6), VT.nha.x + 1.9, VT.nha.z + 1.2);
  dat(M.vua(M.kk('sack'), 0.8), VT.barn.x + 0.4, VT.barn.z + 1.5); dat(M.vua(M.kk('crate_open'), 0.9), VT.barn.x - 1.05, VT.barn.z + 1.45);
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
    [VT.nhaCho.x - 1.1, VT.cho.x + 1.1, VT.cho.z - 1.1, VT.cho.z + 1.0],
    [VT.lo.x - 1.5, VT.lo.x + 1.5, VT.lo.z - 1.5, VT.lo.z + 1.6], [VT.barn.x - 1.9, VT.barn.x + 1.8, VT.barn.z - 1.6, VT.barn.z + 2.0],                                               // máy chế biến (ngoài sân)                                             // chó + nhà chó
  ];
  for (const [x, z] of VT.trangTri) chiem.push([x - 1, x + 1, z - 1, z + 1]);
  const A = VT.ao; chiem.push([A.x - A.rx - 0.6, A.x + A.rx + 0.6, A.z - A.rz - 0.6, A.z + A.rz + 0.6]);
  const bongMat = [[-13.8, -5.0], [12.9, -1.0], [-3.4, -11.4]];                                                     // vài cây tán to
  for (const [x, z] of bongMat) chiem.push([x - 1, x + 1, z - 1, z + 1]);
  sc.add(M.rungBong(bongMat.map(([x, z], i) => ({ x, z, kieu: 'tron', xoay: i * 2, k: 1.35 }))));
  const trong = (x, z, pad) => !chiem.some(([a, b, c, d]) => x > a - pad && x < b + pad && z > c - pad && z < d + pad) && !ganDuong(x, z, pad + 0.15);
  nenTrong = trong;
  const B = VT.bien, r = M.rnd(77);
  // ao sen
  hoNuoc(texHo, A, 1.35, 4);
  const bSen = M.boDung(), rSen = M.rnd(9);
  const ganCau = (x, z) => x < A.x - 0.3 && Math.abs(z - A.z) < 1.3;   // chừa mặt nước trước cầu câu (phao, dây câu)
  for (let i = 0; i < 14; i++) { const a = rSen() * 6.283, d = 0.25 + rSen() * 0.55, x = A.x + Math.cos(a) * A.rx * d, z = A.z + Math.sin(a) * A.rz * d, k = 0.9 + rSen() * 0.5; if (ganCau(x, z)) continue;
    bSen.tru(0.22 * k, 0.22 * k, 0.02, x, 0.075, z, i % 2 ? 0x5cc23a : 0x7fd64a, null, 12); if (i % 2 === 0) { bSen.cau(0.08, x + 0.04, 0.12, z, i % 4 ? 0xff9ad5 : 0xffffff, { x: 1, y: 0.7, z: 1 }, null, 0); bSen.cau(0.045, x + 0.04, 0.16, z, 0xffe066, null, null, 0); } }
  for (let i = 0; i < 13; i++) { const a = i / 13 * 6.283 + rSen() * 0.3, x = A.x + Math.cos(a) * (A.rx + 0.75), z = A.z + Math.sin(a) * (A.rz + 0.75); if (ganCau(x, z)) continue; bSen.cau(0.16 + rSen() * 0.12, x, 0.06, z, rSen() > 0.5 ? 0xd9d4c8 : 0xc9c2b2, { x: 1.2, y: 0.6, z: 1 }, { y: rSen() * 3 }, 1); }
  // lau sậy + cỏ nến mọc thành cụm ở mép nước
  for (const a0 of [0.35, 1.15, 1.95, 2.55, 3.85, 4.6, 5.45]) { const cx = A.x + Math.cos(a0) * A.rx * 0.97, cz = A.z + Math.sin(a0) * A.rz * 0.97;
    for (let i = 0; i < 7; i++) { const x = cx + (rSen() - 0.5) * 0.7, z = cz + (rSen() - 0.5) * 0.5, h = 0.55 + rSen() * 0.6, ng = (rSen() - 0.5) * 0.3;
      bSen.tru(0.012, 0.022, h, x, h / 2, z, rSen() > 0.5 ? 0x4f9a3c : 0x6fb24f, { z: ng }, 5); if (i % 2) bSen.tru(0.04, 0.04, 0.2, x - Math.sin(ng) * h * 0.5, h + 0.02, z, 0x7a4a26, { z: ng }, 6); } }
  sc.add(bSen.xong());
  dungCau();
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

// ---------- CÂU CÁ (Thùy 14/11): cầu gỗ + ghế + cần câu + dù + biển "Câu cá" ở bờ trái hồ; phao và bóng cá dưới nước ----------
// Chạm cầu / ghế / biển ⇒ { loai: 'cau' } (ui.js mở js/cauca.js). Luật ở engine (cauNem / cauXong). phao(tt): 0 nghỉ · 1 đang chờ cá · 2 cá cắn · 3 kéo lên.
let cauO = null, phaoO = null, phaoTT = 0, dayCau = null, caBong = [], nguoiCau = null;
const PHAO = new T.Vector3(), DAU_CAN = new T.Vector3();
function dungCau() {
  const C = VT.cau, g = neo(C.x, C.z), b = M.boDung(), GO = [0xc98d55, 0xb97d47], DAM = 0x8a5530, dai = C.dai, n = Math.round(dai / 0.3), cx = dai - 0.75;
  cauO = g;
  for (let i = 0; i < n; i++) b.hop(dai / n * 0.9, 0.08, 1.2, (i + 0.5) * dai / n, 0.3, 0, GO[i % 2]);                                  // ván lát
  for (const z of [-0.5, 0.5]) b.hop(dai, 0.1, 0.1, dai / 2, 0.22, z, DAM);                                                             // dầm
  for (const x of [0.15, dai * 0.5, dai - 0.15]) for (const z of [-0.62, 0.62]) { b.tru(0.07, 0.08, 0.66, x, 0.2, z, DAM, null, 8); b.cau(0.085, x, 0.55, z, 0xa86d3e, null, null, 0); }
  // ghế gỗ đệm đỏ, quay mặt ra hồ
  for (const [dx, dz] of [[0.2, 0.2], [0.2, -0.2], [-0.2, 0.2], [-0.2, -0.2]]) b.hop(0.06, 0.3, 0.06, cx + dx, 0.49, dz, DAM);
  b.hop(0.52, 0.06, 0.52, cx, 0.66, 0, 0xb97d47); b.hop(0.44, 0.07, 0.44, cx + 0.01, 0.72, 0, 0xe8553d);
  b.hop(0.06, 0.52, 0.52, cx - 0.25, 0.95, 0, 0xb97d47, { z: 0.12 }); b.hop(0.07, 0.3, 0.44, cx - 0.22, 1.0, 0, 0xe8553d, { z: 0.12 });
  // xô đựng cá + hộp mồi
  b.tru(0.17, 0.13, 0.28, cx - 0.05, 0.48, 0.42, 0x5b8fd0, null, 10); b.tru(0.18, 0.18, 0.03, cx - 0.05, 0.62, 0.42, 0x3f6fb0, null, 10);
  b.hop(0.26, 0.14, 0.2, cx - 0.55, 0.41, 0.4, 0x6fae4e);
  // NHÂN VẬT NGỒI CÂU (Thùy 14/11 "cần có hoạt cảnh nhân vật ngồi câu"): bé đội mũ rơm ngồi ghế, 2 tay cầm cần — cử động theo phaoTT trong hdCau()
  const L = 2.3, ng = 1.05;
  nguoiCau = dungNguoiCau(L, ng); nguoiCau.g.position.set(cx + 0.02, 0.755, 0); nguoiCau.g.scale.setScalar(1.2); g.add(nguoiCau.g);
  // dù che nắng sọc đỏ trắng (cắm lùi phía sau ghế — không che ghế khi nhìn từ camera)
  const ux = cx - 0.75, uz = -0.5;
  b.tru(0.025, 0.025, 1.9, ux, 1.28, uz, 0xf2efe6, null, 6);
  for (let i = 0; i < 12; i++) b.geo(new T.ConeGeometry(0.95, 0.38, 1, 1, true, i / 12 * 6.2832, 6.2832 / 12), ux, 2.3, uz, i % 2 ? 0xffffff : 0xff6f5a);
  b.cau(0.05, ux, 2.52, uz, 0xff6f5a, null, null, 0);
  const m = b.xong(); m.material = m.material.clone(); m.material.side = T.DoubleSide; g.add(m);
  const hc = hopCham(dai + 0.5, 1.7, 1.9, { loai: 'cau' }); hc.position.x = dai / 2; g.add(hc);
  // biển gỗ "Câu cá" quay về phía camera
  const sg = new T.Group(), sb = M.boDung(); sg.position.set(-0.55, 0, 1.25); sg.rotation.y = Math.atan2(HUONG.x, HUONG.z); sg.scale.setScalar(1.4);   // Thùy 14/11: biển to hơn
  sb.tru(0.05, 0.06, 1.1, 0, 0.55, 0, DAM, null, 6); sb.hop(1.3, 0.56, 0.08, 0, 1.2, 0, 0x8a5530); sb.hop(1.2, 0.46, 0.09, 0, 1.2, 0, 0xd9a46a); sg.add(sb.xong());
  const c = document.createElement('canvas'); c.width = 384; c.height = 128; const x = c.getContext('2d');
  x.font = '900 68px system-ui, "Segoe UI", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  x.lineWidth = 10; x.strokeStyle = '#7a3f12'; x.strokeText('🎣 Câu cá', 192, 68); x.fillStyle = '#fff6dc'; x.fillText('🎣 Câu cá', 192, 68);
  const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4;
  const pl = new T.Mesh(new T.PlaneGeometry(1.14, 0.38), new T.MeshBasicMaterial({ map: tx, transparent: true })); pl.position.set(0, 1.2, 0.05); sg.add(pl);
  sg.add(hopCham(1.4, 1.7, 0.6, { loai: 'cau' })); g.add(sg);
  // phao + dây câu
  g.updateMatrixWorld(true); nguoiCau.ngon.getWorldPosition(DAU_CAN); PHAO.set(DAU_CAN.x + 0.35, 0.03, DAU_CAN.z + 0.1);
  const pb = M.boDung(); pb.cau(0.075, 0, -0.01, 0, 0xffffff, null, null, 1); pb.cau(0.085, 0, 0.05, 0, 0xff4a3c, { x: 1, y: 0.8, z: 1 }, null, 1); pb.tru(0.012, 0.012, 0.2, 0, 0.19, 0, 0x333333, null, 5); pb.cau(0.025, 0, 0.3, 0, 0xffd23f, null, null, 0);
  phaoO = pb.xong(false); phaoO.position.copy(PHAO); sc.add(phaoO);
  dayCau = new T.Line(new T.BufferGeometry().setFromPoints([DAU_CAN, PHAO]), new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 })); dayCau.frustumCulled = false; sc.add(dayCau);
  // bóng cá bơi lờ mờ dưới nước
  const hinh = new T.Shape(); hinh.absellipse(0, 0, 0.3, 0.11, 0, 6.2832); const duoi = new T.Shape(); duoi.moveTo(-0.24, 0); duoi.lineTo(-0.5, 0.14); duoi.lineTo(-0.44, 0); duoi.lineTo(-0.5, -0.14); duoi.closePath();
  const gc = new T.ShapeGeometry([hinh, duoi], 10); gc.rotateX(-Math.PI / 2);
  const mc = new T.MeshBasicMaterial({ color: new T.Color(0x175066).convertSRGBToLinear(), transparent: true, opacity: 0.42, depthWrite: false });
  for (let i = 0; i < 5; i++) { const f = new T.Mesh(gc, mc); f.renderOrder = 6; f.userData = { pha: i * 1.9, bk: 0.3 + (i % 3) * 0.2, v: (i % 2 ? -1 : 1) * (0.16 + i * 0.03), k: 0.8 + (i % 3) * 0.25 }; f.scale.setScalar(f.userData.k); f.position.y = 0.045; sc.add(f); caBong.push(f); }
}
function phao(tt) { phaoTT = tt; if (tt === 2) cauGiat = tg; if (tt === 3) cauKeo = tg; if (!phaoO) return; if (tt === 2) hatTai(new T.Vector3(PHAO.x, 0.1, PHAO.z), 'nuoc', 6); if (tt === 3) { hatTai(new T.Vector3(PHAO.x, 0.15, PHAO.z), 'nuoc', 12); phaoTT = 0; } }
// bé ngồi câu: gốc ở mặt ghế, mặt quay ra hồ (+x). Trả { g, than, dau, tay, chan, ngon (đầu cần), ca (con cá văng lên lúc kéo) }
function dungNguoiCau(L, ng) {
  const DA = 0xffd9b5, AO = 0xfff3dc, YEM = 0x4f8fd8, YEM2 = 0x3f78c0, GIAY = 0x8a5530, ROM = 0xe6c35a;
  const g = new T.Group(), than = new T.Group(), dau = new T.Group(), tay = new T.Group(), chan = new T.Group();
  const nhom = (G, ve) => { const b = M.boDung(true); ve(b); G.add(b.xong()); };
  nhom(than, b => { // thân: áo trắng kem + yếm xanh
    b.cau(0.2, 0, 0.2, 0, AO, { x: 0.95, y: 1.15, z: 1 }, null, 2); b.cau(0.205, 0.01, 0.13, 0, YEM, { x: 0.95, y: 0.85, z: 1.02 }, null, 2);
    b.hop(0.02, 0.2, 0.17, 0.17, 0.26, 0, YEM); for (const z of [-0.08, 0.08]) { b.hop(0.03, 0.2, 0.04, 0.1, 0.34, z, YEM2, { z: 0.35 }); b.cau(0.018, 0.18, 0.33, z, 0xffd23f, null, null, 0); }
    for (const z of [-0.1, 0.1]) b.hop(0.3, 0.12, 0.13, 0.14, 0.03, z, YEM);   // đùi nằm ngang trên ghế
  });
  nhom(chan, b => { for (const z of [-0.1, 0.1]) { b.hop(0.1, 0.26, 0.11, 0, -0.13, z, DA); b.hop(0.17, 0.08, 0.12, 0.04, -0.28, z, GIAY); } });   // ống chân thõng + giày
  chan.position.set(0.29, 0.02, 0);
  nhom(dau, b => { // đầu to kiểu chibi, tóc nâu, mũ rơm vành rộng, má hồng
    b.cau(0.2, 0, 0.19, 0, DA, null, null, 2); b.cau(0.205, -0.03, 0.22, 0, 0x6b4428, { x: 1, y: 0.92, z: 1.02 }, null, 2);
    for (const z of [-0.075, 0.075]) { b.cau(0.026, 0.185, 0.2, z, 0x2a2a2a, { x: 0.5, y: 1.2, z: 1 }, null, 1); b.cau(0.03, 0.165, 0.13, z * 1.6, 0xffa8b4, { x: 0.4, y: 0.6, z: 1 }, null, 0); }
    b.cau(0.02, 0.195, 0.13, 0, 0xe07a6a, { x: 0.5, y: 0.5, z: 1.4 }, null, 0);
    b.tru(0.34, 0.36, 0.025, 0, 0.33, 0, ROM, null, 16); b.tru(0.16, 0.2, 0.15, 0, 0.41, 0, ROM, null, 14); b.tru(0.205, 0.205, 0.045, 0, 0.36, 0, 0xe8553d, null, 14);
  });
  dau.position.set(0.02, 0.42, 0);
  nhom(tay, b => { // 2 tay đưa ra trước, chụm vào cán cần
    for (const z of [-0.15, 0.15]) { b.hop(0.34, 0.085, 0.085, 0.17, -0.06, z * 0.72, AO, { z: -0.35, y: z > 0 ? 0.3 : -0.3 }); b.cau(0.055, 0.34, -0.12, z * 0.3, DA, null, null, 1); }
  });
  tay.position.set(0.06, 0.34, 0);
  const can = new T.Group(); can.position.set(0.34, -0.12, 0); can.rotation.z = -ng; tay.add(can);
  nhom(can, b => { b.tru(0.012, 0.03, L, 0, L / 2 - 0.2, 0, 0x6b4a2a, null, 6); b.tru(0.036, 0.036, 0.22, 0, -0.1, 0, 0x3a2a1c, null, 8); b.tru(0.05, 0.05, 0.05, 0.05, 0.1, 0, 0x444444, { z: 1.57 }, 8); });
  const ngon = new T.Object3D(); ngon.position.set(0, L - 0.2, 0); can.add(ngon);
  // con cá văng lên khi kéo được
  const cb = M.boDung(true); cb.cau(0.11, 0, 0, 0, 0xff9a3c, { x: 1.7, y: 0.8, z: 0.55 }, null, 1); cb.non(0.09, 0.14, -0.22, 0, 0, 0xff7a2a, { z: -1.57 }, 5); cb.cau(0.02, 0.12, 0.03, 0.05, 0x222222, null, null, 0);
  const ca = cb.xong(false); ca.visible = false; sc.add(ca);
  g.add(than); g.add(chan); than.add(dau); than.add(tay);
  return { g, than, dau, tay, chan, ngon, ca };
}
let cauGiat = -99, cauKeo = -99; const _ngon = new T.Vector3();
function hdNguoiCau() { // nghỉ: gà gật · chờ cá: ngồi thẳng, đung đưa chân, ngó phao · cá cắn: giật mình, cần rung · kéo: ngả người giật cần, cá văng lên rồi rơi vào xô
  const N = nguoiCau, k = tg - cauKeo, keo = k >= 0 && k < 1.3, tt = keo ? 3 : phaoTT;
  let ngaThan = 0, cuiDau = 0, xoayDau = 0, tayZ = 0, chanZ = 0, nhun = 0;
  if (tt === 0) { cuiDau = -0.3 + Math.sin(tg * 0.9) * 0.1; ngaThan = -0.05 + Math.sin(tg * 0.9) * 0.02; tayZ = -0.08 + Math.sin(tg * 0.9) * 0.02; }
  else if (tt === 1) { ngaThan = -0.1; cuiDau = -0.06 + Math.sin(tg * 0.7) * 0.03; xoayDau = Math.sin(tg * 0.5) * 0.25; tayZ = Math.sin(tg * 1.6) * 0.03; chanZ = Math.sin(tg * 2.6) * 0.35; }
  else if (tt === 2) { const d = Math.min(1, (tg - cauGiat) * 5); ngaThan = -0.2 * d; cuiDau = 0.12; tayZ = 0.1 * d + Math.sin(tg * 22) * 0.05; nhun = Math.abs(Math.sin(tg * 13)) * 0.03; chanZ = Math.sin(tg * 13) * 0.15; }
  else { const u = Math.sin(Math.min(1, k / 0.45) * Math.PI / 2), ve = k > 0.8 ? (k - 0.8) / 0.5 : 0, m = u * (1 - ve); ngaThan = 0.32 * m; tayZ = 0.85 * m; cuiDau = 0.2 * m; chanZ = -0.5 * m; }
  const mem = (o, kx, v) => { o.rotation[kx] += (v - o.rotation[kx]) * 0.25; };
  mem(N.than, 'z', ngaThan); mem(N.dau, 'z', cuiDau); mem(N.dau, 'y', xoayDau); mem(N.tay, 'z', tayZ); mem(N.chan, 'z', chanZ); N.than.position.y = nhun;
  N.ngon.getWorldPosition(_ngon);
  N.ca.visible = keo && k < 1.0;
  if (N.ca.visible) { const u = k / 1.0, C = VT.cau, bx = C.x + C.dai - 0.8, bz = C.z + 0.42; // bay vòng cung từ phao về xô cá
    N.ca.position.set(PHAO.x + (bx - PHAO.x) * u, 0.1 + Math.sin(u * Math.PI) * 2.0 + u * 0.55, PHAO.z + (bz - PHAO.z) * u); N.ca.rotation.z = u * 9; N.ca.rotation.y = 0.6; }
}
function hdCau() {
  if (!phaoO) return;
  const A = VT.ao;
  if (nguoiCau) hdNguoiCau();
  phaoO.position.y = phaoTT === 2 ? -0.05 + Math.sin(tg * 16) * 0.035 : 0.03 + Math.sin(tg * 2.2) * (phaoTT === 1 ? 0.03 : 0.012);
  phaoO.rotation.z = Math.sin(tg * 1.7) * 0.12;
  const p = dayCau.geometry.attributes.position; if (nguoiCau) p.setXYZ(0, _ngon.x, _ngon.y, _ngon.z); p.setY(1, phaoO.position.y + 0.28); p.needsUpdate = true;
  for (const f of caBong) { const u = f.userData, t = tg * u.v + u.pha, s = Math.sign(u.v);
    f.position.x = A.x + 0.3 + Math.cos(t) * A.rx * u.bk; f.position.z = A.z + Math.sin(t) * A.rz * u.bk;
    f.rotation.y = Math.atan2(-Math.cos(t) * A.rz * s, -Math.sin(t) * A.rx * s) + Math.sin(tg * 5 + u.pha) * 0.18; }
}

// ---------- NHÀ Ở: em tự chọn kiểu (Thùy 03/11) — 4 kiểu trong dohoa.js KIEU_NHA, mỗi kiểu 10 mức; mức vẫn theo ?nha= (mặc định 1) ----------
const NHA_MUC = +new URLSearchParams(location.search).get('nha') || 1;   // Thùy 14/11: mỗi kiểu 4 mức, mức 1 đã là nhà ngói tường sơn; cách NÂNG mức làm sau (hiện xem thử bằng ?nha=1..4)
let nhaKieu = null, nhaKhoa = '';
// doVat = mảng id món em tự chọn (Thùy 14/11: tự trang trí nhà); chưa chọn bao giờ ⇒ bộ món của mức NHA_MUC
function doiNha(kieu, doVat) {
  if (!MOI || !DH.KIEU_NHA[kieu] || DH.KIEU_NHA[kieu].an) kieu = 'go';
  const mon = DH.KIEU_NHA[kieu].mon, ds = Array.isArray(doVat) ? doVat.filter(id => mon[id]) : null, khoa = kieu + '|' + (ds && ds.length ? ds.join(',') : NHA_MUC);
  if (khoa === nhaKhoa && khoG.nha) return;
  if (khoG.nha) sc.remove(khoG.nha);
  khoG.nha = dat(DH.nhaMoi(kieu, ds && ds.length ? ds : NHA_MUC), VT.nha.x, VT.nha.z - 0.6); khoG.nha.scale.setScalar(VT.nha.rong / 2.3);
  nhaKieu = kieu; nhaKhoa = khoa; canBong = true;
  if (MOI) { if (!raoO[kieu]) { raoO[kieu] = raoSan(kieu); sc.add(raoO[kieu]); } for (const k in raoO) raoO[k].visible = k === kieu; }
}
// ---------- RÀO QUANH SÂN THEO KIỂU NHÀ (Thùy 14/11 "bị khuôn viên trong khuôn viên… rào bên trong đẹp hơn, bỏ rào ngoài thay bằng rào bên trong") ----------
// Nhà không còn rào riêng; rào sân = đúng kiểu rào của nhà: gỗ → cọc trắng nhọn đầu · Việt → hàng dâm bụt trên bờ gạch · Nhật → rào tre mắt cáo.
const raoO = {};
function raoSan(kieu) {
  const S = VT.san, b = M.boDung(), r = M.rnd(53);
  const canh = [[S.x0, S.z0, S.x1, S.z0], [S.x0, S.z0, S.x0, S.z1], [S.x1, S.z0, S.x1, S.z1], [S.x0, S.z1, S.cong - CONG_HO, S.z1], [S.cong + CONG_HO, S.z1, S.x1, S.z1]];
  for (const [xa, za, xb, zb] of canh) {
    const L = Math.hypot(xb - xa, zb - za), doc = xa === xb, P = t => [xa + (xb - xa) * t / L, za + (zb - za) * t / L], xm = (xa + xb) / 2, zm = (za + zb) / 2;
    const thanh = (y, day, cao, mau) => b.hop(doc ? day : L, cao, doc ? L : day, xm, y, zm, mau);
    const nTru = Math.max(1, Math.round(L / 1.7));
    if (kieu === 'viet') { // hàng dâm bụt cắt tỉa trên bờ gạch, hoa đỏ
      thanh(0.07, 0.42, 0.14, 0xb9654a); thanh(0.15, 0.3, 0.04, 0x5a3a22);
      for (let t = 0.2; t < L; t += 0.4) { const [x, z] = P(t), k = 0.27 + r() * 0.05; b.cau(k, x, 0.2 + k * 0.75, z, [0x4f9a3c, 0x5ea344, 0x58a040][Math.floor(r() * 3)], { x: 1, y: 0.95, z: 1 }, null, 1);
        for (let i = 0; i < 2; i++) { const a = r() * 6.283, e = 0.3 + r() * 0.9; b.cau(0.055, x + Math.cos(a) * Math.cos(e) * k, 0.2 + k * 0.75 + Math.sin(e) * k * 0.95, z + Math.sin(a) * Math.cos(e) * k, r() > 0.25 ? 0xe8323a : 0xffd23f, null, null, 0); } }
    } else if (kieu === 'nhat') { // rào tre mắt cáo: cọc tre to + nan đứng + 3 thanh ngang
      const TRE = 0xc8b06a, DAM = 0xa88f4e;
      for (const y of [0.24, 0.52, 0.8]) b.tru(0.026, 0.026, L, xm, y, zm, DAM, doc ? { x: Math.PI / 2 } : { z: Math.PI / 2 }, 6);
      for (let t = 0.15; t < L; t += 0.3) { const [x, z] = P(t); b.tru(0.024, 0.026, 0.86 + r() * 0.06, x, 0.45, z, TRE, null, 6); }
      for (let i = 0; i <= nTru; i++) { const [x, z] = P(L * i / nTru); b.tru(0.06, 0.065, 1.08, x, 0.54, z, 0xb89a54, null, 8); b.tru(0.066, 0.066, 0.04, x, 1.07, z, 0x7a6a3a, null, 8); b.tru(0.066, 0.066, 0.03, x, 0.5, z, 0x7a6a3a, null, 8); }
    } else { // cọc gỗ sơn trắng nhọn đầu, trụ có núm tròn
      const TR = 0xfbf7ee, TR2 = 0xf1ece0;
      for (const y of [0.26, 0.6]) thanh(y, 0.05, 0.075, TR2);
      for (let t = 0.13; t < L; t += 0.26) { const [x, z] = P(t);
        b.hop(doc ? 0.05 : 0.13, 0.74, doc ? 0.13 : 0.05, x, 0.39, z, TR); b.hop(doc ? 0.05 : 0.092, 0.092, doc ? 0.092 : 0.05, x, 0.76, z, TR, doc ? { x: Math.PI / 4 } : { z: Math.PI / 4 }); }
      for (let i = 0; i <= nTru; i++) { const [x, z] = P(L * i / nTru); b.hop(0.17, 1.0, 0.17, x, 0.5, z, TR); b.hop(0.22, 0.05, 0.22, x, 1.0, z, TR2); b.cau(0.11, x, 1.1, z, TR, null, null, 1); }
    }
  }
  return b.xong();
}

// ---------- SÂN NHÀ (Thùy 14/11 "sân chưa có trang trí gì — có sân, cây cảnh, đồ vật"): lối đá từ cổng vào cửa nhà (luôn có) + ĐỒ TRONG SÂN ----------
// Mỗi món = 1 nhóm hình đặt ở chỗ cố định (không đè chuồng / kho / máy), em bật tắt trong bảng "Nhà & cảnh" (s.giaoDien.san = mảng id).
// Thêm món = thêm 1 mục vào SAN_DO (ten, ic, ve) — bảng chọn và bản lưu tự theo. Chưa chọn bao giờ ⇒ SAN_MAC_DINH.
const CONG_HO = 1.45;
function chauHoa(b, x, z, k, mau) { // chậu đất nung + bụi lá + hoa
  b.tru(0.26 * k, 0.19 * k, 0.34 * k, x, 0.17 * k, z, 0xc9764e, null, 12); b.tru(0.29 * k, 0.29 * k, 0.07 * k, x, 0.36 * k, z, 0xd8845a, null, 12);
  b.cau(0.3 * k, x, 0.58 * k, z, 0x5ea344, { x: 1, y: 0.8, z: 1 }, null, 1);
  for (let i = 0; i < 6; i++) { const a = i * 1.047 + x; b.cau(0.075 * k, x + Math.cos(a) * 0.2 * k, (0.7 + (i % 2) * 0.1) * k, z + Math.sin(a) * 0.2 * k, mau[i % mau.length], null, null, 0); }
}
function cayCanh(b, x, z, k) { // cây cảnh cắt tỉa 3 tầng tròn trong chậu gỗ
  b.hop(0.62 * k, 0.4 * k, 0.62 * k, x, 0.2 * k, z, 0xa9744a); b.hop(0.68 * k, 0.07 * k, 0.68 * k, x, 0.4 * k, z, 0x8a5530);
  b.tru(0.06 * k, 0.08 * k, 1.5 * k, x, 1.1 * k, z, 0x7a5232, null, 8);
  [[0.46, 0.85, 0x4f9a3c], [0.36, 1.42, 0x5ea344], [0.26, 1.88, 0x6fb24f]].forEach(([r, y, c]) => b.cau(r * k, x, y * k, z, c, { x: 1, y: 0.82, z: 1 }, null, 1));
}
function luong(b, x0, z0, x1, z1, seed) { // luống hoa viền gạch dọc hàng rào
  const r = M.rnd(seed), dx = x1 - x0, dz = z1 - z0, L = Math.hypot(dx, dz), doc = Math.abs(dz) > Math.abs(dx), xm = (x0 + x1) / 2, zm = (z0 + z1) / 2, MAU = [0xff7eb6, 0xffd23f, 0xffffff, 0xb58cff, 0xff6f5a];
  b.hop(doc ? 0.62 : L + 0.12, 0.14, doc ? L + 0.12 : 0.62, xm, 0.07, zm, 0xb9654a); b.hop(doc ? 0.48 : L, 0.05, doc ? L : 0.48, xm, 0.15, zm, 0x5a3a22);
  for (let t = 0.2; t < L; t += 0.36) { const x = x0 + dx * t / L + (doc ? (r() - 0.5) * 0.2 : 0), z = z0 + dz * t / L + (doc ? 0 : (r() - 0.5) * 0.2), h = 0.2 + r() * 0.16;
    b.cau(0.15, x, 0.22, z, r() > 0.5 ? 0x5ea344 : 0x6fb24f, { x: 1, y: 0.75, z: 1 }, null, 0); b.tru(0.014, 0.014, h, x, 0.26 + h / 2, z, 0x4f9a3c, null, 4); b.cau(0.085, x, 0.3 + h, z, MAU[Math.floor(r() * 5)], { x: 1, y: 0.7, z: 1 }, null, 0); }
}
const SAN_DO = {
  cong: { ten: 'Cổng chào', ic: '🪧', ve() { const g = congTrai(); g.position.set(VT.san.cong, 0, VT.san.z1); g.rotation.y = Math.PI / 2; return g; } },
  den: { ten: 'Cột đèn', ic: '🏮', ve() { const g = new T.Group(), b = M.boDung(), bs = M.boDung();
    for (const x of [VT.san.cong - 1.05, VT.san.cong + 1.05]) { const z = -5.6;
      b.tru(0.13, 0.17, 0.16, x, 0.08, z, 0x4a4a55, null, 10); b.tru(0.045, 0.06, 1.75, x, 1.0, z, 0x3d3c48, null, 8); b.hop(0.34, 0.04, 0.34, x, 1.9, z, 0x3d3c48);
      for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) b.hop(0.03, 0.34, 0.03, x + dx * 0.13, 2.08, z + dz * 0.13, 0x3d3c48);
      b.non(0.27, 0.2, x, 2.35, z, 0x3d3c48, { y: Math.PI / 4 }, 4); b.cau(0.04, x, 2.48, z, 0xe8b84c, null, null, 0);
      bs.hop(0.24, 0.3, 0.24, x, 2.08, z, 0xffe9a8); }
    g.add(b.xong()); g.add(boSang(bs)); return g; } },
  chau: { ten: 'Chậu hoa', ic: '🪴', ve() { const b = M.boDung(), c = VT.san.cong, z1 = VT.san.z1;
    chauHoa(b, c - 1.0, z1 - 0.75, 1, [0xff7eb6, 0xffffff]); chauHoa(b, c + 1.0, z1 - 0.75, 1, [0xffd23f, 0xff9a3c]);
    chauHoa(b, c - 1.0, -4.65, 0.85, [0xb58cff, 0xffffff]); chauHoa(b, c + 1.0, -4.65, 0.85, [0xff6f5a, 0xffd23f]); return b.xong(); } },
  luong: { ten: 'Luống hoa', ic: '🌷', ve() { const b = M.boDung(), S = VT.san; luong(b, S.x0 + 0.45, -11.2, S.x0 + 0.45, -8.6, 31); luong(b, S.x1 - 0.45, -11.2, S.x1 - 0.45, -6.7, 37); luong(b, 0.3, S.z0 + 0.45, 2.9, S.z0 + 0.45, 41); luong(b, 7.9, S.z0 + 0.45, 10.2, S.z0 + 0.45, 43); return b.xong(); } },
  cayCanh: { ten: 'Cây cảnh', ic: '🌳', ve() { const b = M.boDung(); cayCanh(b, 1.5, -8.75, 1); cayCanh(b, 9.0, -10.3, 1); return b.xong(); } },
  gieng: { ten: 'Giếng nước', ic: '🪣', ve() { const b = M.boDung(), x = 0.2, z = -7.6;
    for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; b.hop(0.36, 0.5, 0.2, x + Math.cos(a) * 0.52, 0.25, z + Math.sin(a) * 0.52, [0xbdb6ab, 0xaaa398, 0xc9c3b7][i % 3], { y: -a + Math.PI / 2 }); }
    b.tru(0.5, 0.5, 0.04, x, 0.36, z, 0x3f98ad, null, 14);
    for (const s of [-1, 1]) b.hop(0.1, 1.5, 0.1, x + s * 0.6, 0.75, z, 0x8a5530);
    b.tru(0.05, 0.05, 1.3, x, 1.25, z, 0x6e4526, { z: Math.PI / 2 }, 8); b.tru(0.012, 0.012, 0.5, x, 1.0, z, 0xd9c9a0, null, 4);
    b.hop(1.7, 0.07, 0.75, x, 1.72, z - 0.3, 0xd8705a, { x: -0.6 }); b.hop(1.7, 0.07, 0.75, x, 1.72, z + 0.3, 0xcc6450, { x: 0.6 });
    b.tru(0.16, 0.12, 0.24, x, 0.72, z, 0xa9744a, null, 10); b.tru(0.17, 0.17, 0.03, x, 0.78, z, 0x6e4526, null, 10);
    b.tru(0.17, 0.13, 0.26, x + 0.95, 0.13, z + 0.45, 0x8fa6b3, null, 10); return b.xong(); } },
  ghe: { ten: 'Bàn ghế gỗ', ic: '🪑', ve() { const b = M.boDung(), x = 9.2, z = -7.4;
    b.tru(0.5, 0.5, 0.07, x, 0.62, z, 0xc98d55, null, 14); b.tru(0.09, 0.14, 0.6, x, 0.3, z, 0x8a5530, null, 8);
    b.tru(0.1, 0.08, 0.14, x + 0.1, 0.72, z, 0xfff6e6, null, 10); b.cau(0.1, x + 0.1, 0.86, z, 0xff7eb6, null, null, 0);
    for (const [dx, dz] of [[-0.85, 0.1], [0.3, 0.72]]) { b.tru(0.24, 0.24, 0.06, x + dx, 0.38, z + dz, 0xb97d47, null, 10); b.tru(0.07, 0.1, 0.36, x + dx, 0.18, z + dz, 0x8a5530, null, 6); }
    return b.xong(); } },
  rom: { ten: 'Cuộn rơm', ic: '🌾', ve() { const b = M.boDung();
    for (const [x, z, ry] of [[0.35, -10.4, 0.25], [1.15, -10.2, -0.45]]) { b.tru(0.38, 0.38, 0.7, x, 0.38, z, 0xe6c35a, { z: Math.PI / 2, y: ry }, 14); for (const d of [-0.2, 0.2]) b.tru(0.39, 0.39, 0.05, x + Math.cos(ry) * d, 0.38, z - Math.sin(ry) * d, 0xb98a3a, { z: Math.PI / 2, y: ry }, 14); }
    b.hop(0.04, 1.1, 0.04, 0.8, 0.55, -10.75, 0x8a5530, { x: -0.25 }); for (const d of [-0.07, 0, 0.07]) b.hop(0.02, 0.24, 0.02, 0.8 + d, 1.15, -10.91, 0x8f8f9a, { x: -0.25 }); return b.xong(); } },
};
const SAN_MAC_DINH = ['cong', 'den', 'chau', 'luong', 'cayCanh', 'gieng'];
const sanO = {}; let sanKhoa = null, tenTrai = '';
// tên trên biển cổng: tên gọi của em (họ tên ≥ 3 chữ ⇒ lấy 2 chữ cuối, vd "Nguyễn Minh Anh" → "Minh Anh"); sang vườn bạn ⇒ tên bạn
function doiTenTrai(ten) { const p = String(ten || '').trim().split(/\s+/).filter(Boolean), t = (p.length >= 3 ? p.slice(-2) : p).join(' ').slice(0, 18); if (t === tenTrai) return; tenTrai = t; if (sanO.cong) sanO.cong.userData.ve(t); }
function dungSan() { // lối đá bước từ cổng vào cửa nhà — nền của sân, luôn có
  const b = M.boDung(), r = M.rnd(23), S = VT.san;
  for (let z = S.z1 + 0.25, i = 0; z > -8.2; z -= 0.62, i++) { const k = 0.27 + r() * 0.07; b.tru(k, k * 1.05, 0.05, S.cong + (i % 2 ? 0.2 : -0.2) + (r() - 0.5) * 0.12, 0.035, z, [0xcfc8bb, 0xbdb6a8, 0xd9d3c7][i % 3], { y: r() * 3 }, 9); }
  const m = b.xong(false); sc.add(m);
}
function doiSan(ds) {
  if (!Array.isArray(ds)) ds = SAN_MAC_DINH;
  const khoa = ds.join(','); if (khoa === sanKhoa) return; sanKhoa = khoa;
  for (const id in SAN_DO) { const co = ds.includes(id); if (co && !sanO[id]) { sanO[id] = SAN_DO[id].ve(); sc.add(sanO[id]); } if (sanO[id]) sanO[id].visible = co; }
  canBong = true;
}

// ---------- NỀN: đồng quê · xuân Tết · chiều thu · tuyết · đêm Trung thu · đêm Halloween (Thùy 03/11) — đồ hoạ 100% bằng code, đổi tại chỗ không tải lại ----------
// Mỗi nền = ánh sáng + vòm trời + sương mù + chỉnh màu hậu kỳ + 1 nhóm đồ trang trí riêng (ẩn/hiện).
// Tuyết phủ / lá thu = shader chung trong dohoa.js (DH.TUYET.manh / .thu), trừ vùng ruộng (đất khô/ướt, cây vẫn đọc được). Thứ tự khoá = thứ tự trong bảng chọn.
const NEN = {
  thuong: { ten: 'Đồng quê', troi: [0x6ec3ff, 0xdff3ff] },
  tet: { ten: 'Xuân — Tết', troi: [0x6fc0ff, 0xfff0f4], suong: 0xf6ecef, nang: [0xfff0dc, 1.35], hemi: [0xfde8f0, 0xd8c49a, 0.68],
    mau: { uAm: 0.04, uBaoHoa: 1.26 }, co: 0x86cc50, hoa: 1 },
  thu: { ten: 'Chiều thu', troi: [0x6f7cc8, 0xffb98a], suong: 0xf3d6bc, nang: [0xffd2a0, 1.22], hemi: [0xffe6cc, 0x8f8a5a, 0.64], thu: 1,
    mau: { uAm: 0.05, uBaoHoa: 1.16, uVignette: 0.36 }, co: 0x9cb44c },
  tuyet: { ten: 'Trang trại tuyết', troi: [0x8db8e6, 0xf2f6fb], suong: 0xe9eff6, nang: [0xfff4e6, 1.1], hemi: [0xe6effc, 0xd5dde9, 0.85], tuyet: 1,
    mau: { uAm: 0.0, uBaoHoa: 1.08, uVignette: 0.26 }, co: 0xe9eff8 },
  trungthu: { ten: 'Đêm Trung thu', troi: [0x0d1a4a, 0x35508c], suong: 0x1b2652, suongXa: [38, 96], nang: [0xffdcaa, 0.62], hemi: [0x5262a8, 0x2c2a44, 0.62],
    mau: { uAm: 0.03, uBaoHoa: 1.08, uVignette: 0.62, uPhoi: 1.0 }, co: 0x4f8a3e, nuoc: 0.5 },
  dem: { ten: 'Đêm Halloween', troi: [0x120c2e, 0x4a2c6a], suong: 0x2b1f4a, suongXa: [38, 95], nang: [0xa9b2ff, 0.7], hemi: [0x6e5cb4, 0x352a52, 0.68],   // Thùy 03/11 "sáng quá" ⇒ tối lại, đèn/bí ngô nổi hơn; ô ruộng vẫn đọc được
    mau: { uAm: -0.03, uBaoHoa: 1.06, uVignette: 0.66, uPhoi: 1.0 }, co: 0x4f8a3e, nuoc: 0.45 },
};
let nenId = null; const nenNhom = {}, nenHd = []; let nenGoc = null;
function texTron(trong, ngoai, mem) { // chấm tròn mờ mép (bông tuyết, quầng sáng)
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, trong); g.addColorStop(mem, trong); g.addColorStop(1, ngoai); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t;
}
const MAT_PHAT = new T.MeshBasicMaterial({ vertexColors: true, fog: false }); // phần tự phát sáng (mặt bí ngô, nến, trăng) — không chịu ánh sáng đêm
function boSang(b) { const m = b.xong(false); m.material = MAT_PHAT; m.castShadow = false; return m; }
function quang(mau, co, x, y, z) { const s = new T.Sprite(new T.SpriteMaterial({ map: texTron(mau, 'rgba(0,0,0,0)', 0.05), transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false })); s.scale.set(co, co, 1); s.position.set(x, y, z); return s; }
// chỗ trống để rải đồ: trong khung nhìn, không đè ruộng / sân / chỗ trang trí (nenTrong từ dungTrangTri)
function choRai(n, pad, cach, seed, vung) {
  const r = M.rnd(seed), ds = [], V = vung || { x0: -15, x1: 12.5, z0: -12, z1: 9 };
  for (let i = 0; i < 3000 && ds.length < n; i++) {
    const x = V.x0 + r() * (V.x1 - V.x0), z = V.z0 + r() * (V.z1 - V.z0);
    if (nenTrong && !nenTrong(x, z, pad)) continue; if (trongHo(x, z, 0.6)) continue;
    if (ds.some(([a, b]) => Math.hypot(a - x, b - z) < cach)) continue; ds.push([x, z, r()]);
  }
  return ds;
}
// hạt rơi dùng chung (tuyết · cánh đào · lá thu): N hạt trong khối quanh trại, rơi chậm + lắc ngang; mau = 1 màu hoặc mảng màu (mỗi hạt 1 màu)
function hatRoi(g, nen, N, seed, mau, co, toc, lac) {
  const pos = new Float32Array(N * 3), r = M.rnd(seed), ph = new Float32Array(N), col = Array.isArray(mau) ? new Float32Array(N * 3) : null, c = new T.Color();
  for (let i = 0; i < N; i++) { pos[i * 3] = -22 + r() * 40; pos[i * 3 + 1] = r() * 14; pos[i * 3 + 2] = -18 + r() * 32; ph[i] = r() * 6;
    if (col) { c.set(mau[i % mau.length]).convertSRGBToLinear(); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; } }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); if (col) geo.setAttribute('color', new T.BufferAttribute(col, 3));
  const p = new T.Points(geo, new T.PointsMaterial({ size: co, color: col ? 0xffffff : mau, vertexColors: !!col, map: texTron('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 0.35), transparent: true, depthWrite: false, sizeAttenuation: true, fog: false }));
  p.frustumCulled = false; g.add(p);
  nenHd.push({ nen, f: (dt) => { for (let i = 0; i < N; i++) { let y = pos[i * 3 + 1] - dt * toc * (0.8 + (i % 7) * 0.06); if (y < 0) y += 14; pos[i * 3 + 1] = y; pos[i * 3] += Math.sin(tg * 0.8 + ph[i]) * dt * lac; pos[i * 3 + 2] += Math.cos(tg * 0.6 + ph[i]) * dt * lac * 0.5; } geo.attributes.position.needsUpdate = true; } });
}
function cayHoa(b, x, z, k, mauHoa, mauLa) { // cây đào / cây mai: thân cong + chùm hoa tròn (mauLa = lá điểm xuyết)
  const s = (v) => v * k;
  b.tru(s(0.07), s(0.11), s(0.9), x, s(0.45), z, 0x6b4126, { z: 0.12 }, 6); b.tru(s(0.04), s(0.06), s(0.6), x + s(0.18), s(0.95), z, 0x6b4126, { z: -0.6 }, 5); b.tru(s(0.04), s(0.06), s(0.55), x - s(0.16), s(0.98), z + s(0.05), 0x6b4126, { z: 0.7 }, 5);
  const r = M.rnd(Math.round(x * 31 + z * 17));
  for (let i = 0; i < 9; i++) { const a = r() * 6.28, d = s(0.15 + r() * 0.35); b.cau(s(0.17 + r() * 0.1), x + Math.cos(a) * d, s(1.15 + r() * 0.45), z + Math.sin(a) * d, i % 4 === 3 && mauLa ? mauLa : mauHoa[i % mauHoa.length], null, null, 1); }
}
function longDen(b, bs, g, x, z, mau, sang) { // cột + đèn lồng tròn đỏ có tua (sang ⇒ tự phát sáng + quầng)
  b.tru(0.04, 0.05, 1.6, x, 0.8, z, 0x5a3a22); b.hop(0.34, 0.04, 0.04, x + 0.15, 1.58, z, 0x5a3a22);
  (sang ? bs : b).cau(0.16, x + 0.3, 1.32, z, mau, { y: 1.15 }, null, 1); b.tru(0.07, 0.07, 0.04, x + 0.3, 1.5, z, 0xe8b440, null, 8); b.tru(0.07, 0.07, 0.04, x + 0.3, 1.14, z, 0xe8b440, null, 8);
  b.tru(0.01, 0.01, 0.16, x + 0.3, 1.04, z, 0xe8b440, null, 4);
  if (sang) g.add(quang('rgba(255,140,70,0.6)', 1.3, x + 0.3, 1.32, z));
}
function denOngSao(bs, g, x, y, z, mau, co) { // đèn ông sao 5 cánh (Trung thu) — tự phát sáng
  const sh = new T.Shape(); for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.42 : 1; i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const geo = new T.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 1 }); geo.translate(0, 0, -0.15); geo.scale(co, co, co);
  bs.geo(geo, x, y, z, mau, { y: 0.52 });
  g.add(quang(mau === 0xffd23f ? 'rgba(255,210,80,0.55)' : 'rgba(255,90,60,0.55)', co * 4.5, x, y, z));
}
function saoTroi(g, seed) { // sao trên vòm trời (đêm)
  const NS = 260, ps = new Float32Array(NS * 3), rs = M.rnd(seed);
  for (let i = 0; i < NS; i++) { const a = rs() * Math.PI * 2, e = 0.15 + rs() * 1.2, R0 = 250; ps[i * 3] = Math.cos(a) * Math.cos(e) * R0; ps[i * 3 + 1] = Math.sin(e) * R0; ps[i * 3 + 2] = Math.sin(a) * Math.cos(e) * R0; }
  const gs = new T.BufferGeometry(); gs.setAttribute('position', new T.BufferAttribute(ps, 3));
  const sao = new T.Points(gs, new T.PointsMaterial({ size: 2.2, map: texTron('rgba(255,250,220,1)', 'rgba(255,250,220,0)', 0.2), transparent: true, depthWrite: false, fog: false })); sao.frustumCulled = false; g.add(sao);
}
function nguoiTuyet(b, x, z, k) { // người tuyết (mặt hướng +z, về phía camera): 3 khối tròn, mũ, khăn đỏ, mũi cà rốt, cúc than
  const s = (v) => v * k, fx = 0, fz = 1;
  b.cau(s(0.42), x, s(0.36), z, 0xf6f9ff, { y: 0.92 }, null, 2); b.cau(s(0.3), x, s(0.86), z, 0xf6f9ff, null, null, 2); b.cau(s(0.22), x, s(1.25), z, 0xf6f9ff, null, null, 2);
  b.tru(s(0.24), s(0.26), s(0.07), x, s(1.06), z, 0xe8453c, null, 14);
  b.tru(s(0.17), s(0.17), s(0.22), x, s(1.55), z, 0x2e2a36, null, 12); b.tru(s(0.25), s(0.25), s(0.03), x, s(1.44), z, 0x2e2a36, null, 14);
  b.non(s(0.05), s(0.2), x, s(1.25), z + s(0.3), 0xff8a1f, { x: Math.PI / 2 }, 6);
  for (const d of [-1, 1]) b.cau(s(0.03), x + fx * s(0.19) + fz * d * s(0.08), s(1.32), z + fz * s(0.19) - fx * d * s(0.08), 0x222222);
  for (const h of [0.95, 0.82, 0.69]) b.cau(s(0.035), x + fx * s(0.29), s(h), z + fz * s(0.29), 0x2e2a36);
  for (const d of [-1, 1]) b.tru(s(0.02), s(0.025), s(0.5), x + fz * d * s(0.42), s(0.98), z - fx * d * s(0.42), 0x7a4f2a, { z: d * 1.0 }, 5);
}
function biNgo(b, bs, x, z, k, xoay, cuoi) { // bí ngô Halloween: múi cam + cuống, mặt cười phát sáng (bs = bộ dựng phần sáng)
  const s = (v) => v * k;
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; b.cau(s(0.2), x + Math.cos(a) * s(0.1), s(0.2), z + Math.sin(a) * s(0.1), i % 2 ? 0xf2891c : 0xe8780f, { x: 0.75, y: 0.95, z: 0.75 }, { y: a }, 1); }
  b.tru(s(0.03), s(0.045), s(0.12), x, s(0.42), z, 0x4f7a2a, { z: 0.3 }, 5);
  if (!cuoi) return;
  const fx = Math.sin(xoay), fz = Math.cos(xoay), d = s(0.27);
  for (const e of [-1, 1]) bs.hop(s(0.06), s(0.06), s(0.02), x + fx * d + fz * e * s(0.08), s(0.26), z + fz * d - fx * e * s(0.08), 0xffd25a, { y: xoay, z: 0.785 });
  bs.hop(s(0.18), s(0.04), s(0.02), x + fx * d, s(0.15), z + fz * d, 0xffc23a, { y: xoay });
}
function con_doi() { // con dơi hoạt hình: thân tròn + 2 cánh vỗ
  const g = new T.Group(), b = M.boDung(true); b.cau(0.13, 0, 0, 0, 0x2a1f3d, { y: 0.9 }, null, 1); b.non(0.04, 0.09, 0.06, 0.12, 0, 0x2a1f3d); b.non(0.04, 0.09, -0.06, 0.12, 0, 0x2a1f3d);
  g.add(b.xong(false)); const bm = M.boDung(); bm.cau(0.022, 0.05, 0.03, 0.11, 0xffe45a); bm.cau(0.022, -0.05, 0.03, 0.11, 0xffe45a); g.add(boSang(bm));
  const canh = (d) => { const c = new T.Group(), bc = M.boDung(true); bc.hop(0.32, 0.02, 0.2, d * 0.18, 0, 0, 0x3b2c55); bc.non(0.1, 0.12, d * 0.3, 0, -0.08, 0x3b2c55, { x: Math.PI / 2 }, 3); c.add(bc.xong(false)); g.add(c); return c; };
  g.userData.L = canh(1); g.userData.P = canh(-1); return g;
}
function maNho() { // bóng ma nhỏ dễ thương: thân trắng mờ, mắt đen, má hồng
  const g = new T.Group(), b = M.boDung(true);
  b.cau(0.26, 0, 0.32, 0, 0xf4f2ff, { y: 1.15 }, null, 2); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; b.cau(0.09, Math.cos(a) * 0.19, 0.06, Math.sin(a) * 0.19, 0xf4f2ff, null, null, 1); }
  b.cau(0.035, -0.08, 0.38, 0.23, 0x2a2238); b.cau(0.035, 0.08, 0.38, 0.23, 0x2a2238); b.cau(0.03, -0.15, 0.3, 0.2, 0xffa3c4); b.cau(0.03, 0.15, 0.3, 0.2, 0xffa3c4);
  const m = b.xong(false); m.material = m.material.clone(); m.material.transparent = true; m.material.opacity = 0.88; g.add(m); g.add(quang('rgba(190,180,255,0.35)', 1.4, 0, 0.3, 0)); return g;
}
function dungNen() {
  if (!MOI) return;
  nenGoc = { suong: sc.fog.color.clone(), gan: sc.fog.near, xa: sc.fog.far, nang: [sunL.color.clone(), sunL.intensity], hemi: [hemiL.color.clone(), hemiL.groundColor.clone(), hemiL.intensity], mau: {} };
  if (hk) for (const k of ['uAm', 'uBaoHoa', 'uVignette', 'uPhoi']) nenGoc.mau[k] = hk.u[k].value;
  const V = VT.ruong, n = V.co / 2 + 0.05; DH.TUYET.chua.value.set(V.x - n, V.z - n, V.x + (V.cot - 1) * V.buoc + n, V.z + 2 * V.buoc + n);
  // ===== TUYẾT =====
  { const g = new T.Group(); g.visible = false; sc.add(g); nenNhom.tuyet = g;
    const b = M.boDung(true);
    const nt = choRai(3, 0.9, 6, 301, { x0: -14, x1: 11.5, z0: -11, z1: 8.5 }); nt.forEach(([x, z, q]) => nguoiTuyet(b, x, z, 0.95 + q * 0.25));
    choRai(26, 0.3, 1.6, 302).forEach(([x, z, q]) => b.cau(0.25 + q * 0.3, x, 0.02, z, 0xf3f7ff, { x: 1.4, y: 0.42, z: 1.1 }, { y: q * 6 }, 1)); // đụn tuyết
    choRai(7, 0.6, 3, 303).forEach(([x, z, q]) => { const h = 0.9 + q * 0.6; b.tru(0.05, 0.07, 0.3, x, 0.15, z, 0x7a4f2a); for (let i = 0; i < 3; i++) b.non(0.42 - i * 0.1, 0.5, x, 0.45 + i * 0.32 * h, z, 0x3f7f55, null, 7); b.non(0.12, 0.18, x, 0.45 + 3 * 0.32 * h, z, 0xfff1a8, null, 5); }); // thông nhỏ đầu sao
    g.add(b.xong());
    hatRoi(g, 'tuyet', 900, 305, 0xffffff, 0.16, 1.1, 0.25);   // tuyết rơi
  }
  // ===== ĐÊM HALLOWEEN =====
  { const g = new T.Group(); g.visible = false; sc.add(g); nenNhom.dem = g;
    const b = M.boDung(true), bs = M.boDung();
    const bi = choRai(12, 0.4, 2.2, 401);
    bi.forEach(([x, z, q], i) => { const k = 0.9 + q * 0.7, xoay = 0.55 + (q - 0.5) * 0.8; biNgo(b, bs, x, z, k, xoay, i % 3 !== 2); if (i % 3 !== 2) g.add(quang('rgba(255,170,60,0.55)', 1.5 * k, x, 0.25 * k, z)); });
    // 2 bí ngô to canh 2 bên cổng sân + đèn lồng giấy treo trên cột
    const S = VT.san; for (const d of [-1, 1]) { const x = S.cong + d * 0.95, z = S.z1 + 0.35; biNgo(b, bs, x, z, 1.25, 0.55, true); g.add(quang('rgba(255,170,60,0.6)', 1.9, x, 0.3, z)); }
    choRai(5, 0.5, 3.5, 402).forEach(([x, z]) => { b.tru(0.04, 0.05, 1.5, x, 0.75, z, 0x4a3524); b.hop(0.32, 0.04, 0.04, x + 0.14, 1.48, z, 0x4a3524); bs.cau(0.13, x + 0.28, 1.28, z, 0xff9b3d, { y: 1.2 }, null, 1); g.add(quang('rgba(255,150,60,0.65)', 1.2, x + 0.28, 1.28, z)); });
    // trăng tròn + sao
    const bt = M.boDung(); bt.cau(5, 0, 0, 0, 0xfff3c4, null, null, 3); const trang = boSang(bt); trang.position.set(-40, 34, -70); g.add(trang); g.add(quang('rgba(255,240,190,0.5)', 26, -40, 34, -69));
    saoTroi(g, 404);
    g.add(b.xong()); g.add(boSang(bs));
    // dơi bay vòng · ma nhỏ lơ lửng · đom đóm cam
    const doi = []; for (let i = 0; i < 5; i++) { const d = con_doi(); d.scale.setScalar(0.8); d.userData.pha = i * 1.3; d.userData.bk = 3 + i * 1.4; d.userData.tam = [-4 + i * 2.5, -2 + (i % 2) * 4]; g.add(d); doi.push(d); }
    const ma = choRai(3, 0.8, 7, 405).map(([x, z], i) => { const m = maNho(); m.position.set(x, 0.5, z); m.userData.y0 = 0.45 + i * 0.1; m.userData.pha = i * 2; m.rotation.y = 0.55; g.add(m); return m; });
    const dd = []; choRai(18, 0, 1.4, 406, { x0: -15, x1: 12, z0: -11, z1: 9 }).forEach(([x, z, q]) => { const s = quang('rgba(255,200,90,0.9)', 0.32, x, 0.5, z); s.userData = { x, z, pha: q * 9 }; g.add(s); dd.push(s); });
    nenHd.push({ nen: 'dem', f: () => {
      for (const d of doi) { const u = d.userData, t = tg * 0.55 + u.pha, x = u.tam[0] + Math.cos(t) * u.bk, z = u.tam[1] + Math.sin(t) * u.bk * 0.6, y = 3.2 + Math.sin(t * 2.1) * 0.5;
        d.rotation.y = Math.atan2(x - d.position.x, z - d.position.z); d.position.set(x, y, z); const f = Math.sin(tg * 14 + u.pha) * 0.8; u.L.rotation.z = f; u.P.rotation.z = -f; }
      for (const m of ma) { const u = m.userData; m.position.y = u.y0 + Math.sin(tg * 1.4 + u.pha) * 0.15; m.rotation.z = Math.sin(tg * 0.9 + u.pha) * 0.08; }
      for (const s of dd) { const u = s.userData; s.position.set(u.x + Math.sin(tg * 0.5 + u.pha) * 0.5, 0.45 + Math.sin(tg * 0.9 + u.pha * 2) * 0.3, u.z + Math.cos(tg * 0.4 + u.pha) * 0.5); s.material.opacity = 0.45 + 0.55 * Math.abs(Math.sin(tg * 1.7 + u.pha)); }
    } });
  }
  // ===== XUÂN — TẾT (03/11): đào hồng, mai vàng, quất, đèn lồng đỏ, cánh đào bay =====
  { const g = new T.Group(); g.visible = false; sc.add(g); nenNhom.tet = g;
    const b = M.boDung(true), bs = M.boDung();
    choRai(12, 0.8, 2.8, 501, { x0: -14, x1: 11.5, z0: -10.5, z1: 8 }).forEach(([x, z, q], i) => cayHoa(b, x, z, 1.4 + q * 0.5, i % 3 === 2 ? [0xffd23f, 0xffc21f, 0xffe066] : [0xff9ec4, 0xffb7d3, 0xff86b5, 0xffd1e3], i % 3 === 2 ? 0x6fae3c : null));
    choRai(5, 0.5, 2.5, 502).forEach(([x, z]) => { b.tru(0.2, 0.15, 0.26, x, 0.13, z, 0xd23a2a, null, 10); b.cau(0.3, x, 0.56, z, 0x3f8f3a, null, null, 1); // chậu quất
      for (let i = 0; i < 7; i++) { const a = i * 0.9, h = 0.4 + (i % 3) * 0.12; b.cau(0.05, x + Math.cos(a) * 0.26, h, z + Math.sin(a) * 0.26, 0xff9a1f); } });
    choRai(5, 0.5, 3.5, 503).forEach(([x, z]) => longDen(b, bs, g, x, z, 0xe8322a, false));
    const S = VT.san; for (const d of [-1, 1]) { const x = S.cong + d * 0.95, z = S.z1 + 0.35; b.tru(0.22, 0.17, 0.3, x, 0.15, z, 0xd23a2a, null, 10); cayHoa(b, x, z, 0.75, d < 0 ? [0xffd23f, 0xffc21f] : [0xff9ec4, 0xffb7d3], null); }
    choRai(30, 0.2, 1.2, 505).forEach(([x, z, q]) => b.cau(0.22 + q * 0.2, x, 0.0, z, q > 0.5 ? 0xffb7d3 : 0xffd1e3, { x: 1.5, y: 0.12, z: 1.2 }, { y: q * 6 }, 1)); // thảm cánh đào
    g.add(b.xong()); g.add(boSang(bs));
    hatRoi(g, 'tet', 420, 504, [0xffb7d3, 0xff9ec4, 0xffd1e3, 0xffe066], 0.14, 0.45, 0.5);
  }
  // ===== CHIỀU THU (03/11): hoàng hôn cam, lá cây đổi màu (shader DH.TUYET.thu), rơm cuộn, đống lá, bí ngô, lá bay =====
  { const g = new T.Group(); g.visible = false; sc.add(g); nenNhom.thu = g;
    const b = M.boDung(true);
    choRai(6, 0.8, 3, 601).forEach(([x, z, q]) => { b.tru(0.45, 0.45, 0.7, x, 0.45, z, 0xe2b45a, { z: Math.PI / 2, y: q * 3 }, 14); b.tru(0.3, 0.3, 0.72, x, 0.45, z, 0xc9963e, { z: Math.PI / 2, y: q * 3 }, 12); }); // rơm cuộn
    choRai(14, 0.3, 1.6, 602).forEach(([x, z, q]) => { for (let i = 0; i < 4; i++) b.cau(0.18 + q * 0.12, x + (i - 1.5) * 0.16, 0.05, z + ((i * 7) % 3 - 1) * 0.12, [0xd9541e, 0xe8902a, 0xc23a1a, 0xf0b23a][i], { x: 1.3, y: 0.45, z: 1.1 }, null, 1); }); // đống lá
    choRai(7, 0.4, 2.2, 603).forEach(([x, z, q]) => biNgo(b, null, x, z, 0.8 + q * 0.6, 0, false));
    g.add(b.xong());
    hatRoi(g, 'thu', 220, 604, [0xd9541e, 0xe8902a, 0xf0b23a, 0xc23a1a], 0.17, 0.55, 0.8);
  }
  // ===== ĐÊM TRUNG THU (03/11): trăng rằm vàng, đèn ông sao, đèn lồng, đèn trời bay lên =====
  { const g = new T.Group(); g.visible = false; sc.add(g); nenNhom.trungthu = g;
    const b = M.boDung(true), bs = M.boDung();
    choRai(12, 0.5, 2.6, 701).forEach(([x, z, q], i) => { const h = 1.5 + q * 0.4; b.tru(0.025, 0.03, h, x, h / 2, z, 0x6b4a2a, { z: 0.15 }); denOngSao(bs, g, x + h * 0.07, h + 0.2, z, i % 2 ? 0xff5a3c : 0xffd23f, 0.32); });
    // dây đèn lồng võng dọc rào trước sân (2 đoạn, chừa cổng)
    const S = VT.san; for (const [x0, x1] of [[S.x0, S.cong - 1.0], [S.cong + 1.0, S.x1]]) { for (const x of [x0, x1]) b.tru(0.04, 0.05, 1.9, x, 0.95, S.z1 + 0.25, 0x5a3a22);
      const n = Math.max(3, Math.round((x1 - x0) / 0.75)); for (let i = 1; i < n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = 1.85 - Math.sin(t * Math.PI) * 0.45; bs.cau(0.1, x, y - 0.12, S.z1 + 0.25, i % 2 ? 0xffb43a : 0xff5a3c, { y: 1.2 }, null, 1); g.add(quang('rgba(255,150,70,0.45)', 0.7, x, y - 0.12, S.z1 + 0.25)); } }
    choRai(8, 0.5, 3, 702).forEach(([x, z], i) => longDen(b, bs, g, x, z, i % 2 ? 0xffb43a : 0xff5a3c, true));
    const bt = M.boDung(); bt.cau(6, 0, 0, 0, 0xffe08a, null, null, 3); const trang = boSang(bt); trang.position.set(-40, 30, -70); g.add(trang); g.add(quang('rgba(255,220,140,0.55)', 32, -40, 30, -69));
    saoTroi(g, 703); g.add(b.xong()); g.add(boSang(bs));
    const den = []; for (let i = 0; i < 20; i++) { const s = quang('rgba(255,170,80,0.95)', 0.75, 0, 0, 0); s.userData = { x: -14 + (i * 2.4) % 26, z: -10 + (i * 5.3) % 18, pha: i * 1.7 }; g.add(s); den.push(s); } // đèn trời
    nenHd.push({ nen: 'trungthu', f: () => { for (const s of den) { const u = s.userData, k = ((tg * 0.035 + u.pha / 12) % 1); s.position.set(u.x + Math.sin(tg * 0.3 + u.pha) * 0.8, 1 + k * 16, u.z - k * 6); s.material.opacity = k < 0.1 ? k * 10 : k > 0.85 ? (1 - k) / 0.15 : 1; } } });
  }
}
function doiNen(id) {
  if (!MOI || !nenGoc) return;
  if (!NEN[id]) id = 'thuong';
  if (id === nenId) return; nenId = id;
  const N = NEN[id], G = nenGoc;
  toMauTroi(troiO.geometry, N.troi[0], N.troi[1]);
  sc.fog.color.copy(N.suong != null ? new T.Color(N.suong).convertSRGBToLinear() : G.suong); [sc.fog.near, sc.fog.far] = N.suongXa || [G.gan, G.xa];
  if (N.nang) { sunL.color.set(N.nang[0]).convertSRGBToLinear(); sunL.intensity = N.nang[1]; } else { sunL.color.copy(G.nang[0]); sunL.intensity = G.nang[1]; }
  if (N.hemi) { hemiL.color.set(N.hemi[0]).convertSRGBToLinear(); hemiL.groundColor.set(N.hemi[1]).convertSRGBToLinear(); hemiL.intensity = N.hemi[2]; } else { hemiL.color.copy(G.hemi[0]); hemiL.groundColor.copy(G.hemi[1]); hemiL.intensity = G.hemi[2]; }
  if (hk) for (const k in G.mau) hk.u[k].value = N.mau && N.mau[k] != null ? N.mau[k] : G.mau[k];
  DH.TUYET.manh.value = N.tuyet || 0; DH.TUYET.thu.value = N.thu || 0; DH.TUYET.hoa.value = N.hoa || 0;
  for (const k in nenNhom) nenNhom[k].visible = k === id;
  for (const b of buomDs) b.visible = id === 'thuong' || id === 'tet';   // bướm chỉ bay ban ngày ấm
  const coMau = new T.Color(N.co || 0x7cc64c).convertSRGBToLinear();   // ô cỏ chưa mở nằm trong vùng ruộng (không phủ bằng shader) ⇒ đổi màu tay
  for (const h of hoangRuong) if (h.children[0] && h.children[0].material) h.children[0].material.color.copy(coMau);
  for (const w of nuocMat) w.m.color.copy(w.goc).multiplyScalar(N.nuoc || 1);   // nước ao: đêm bớt sáng chói
  canBong = true;
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
  if (chon.loai === 'cau') return cauO;
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
    datNhan('lo', o.lo.visible ? new T.Vector3(o.v.x, 0.3, o.v.z) : null, '🔒 Máy chế biến · cấp ' + D.LO_CAP, 'mo');
    // đang làm: đồng hồ đếm ngược trên nóc máy (giây làm tròn lên) — em thấy còn bao lâu mà không phải mở bảng
    datNhan('lo_dem', tt.tt === 'dang' ? new T.Vector3(o.v.x, CAO_LO + 0.6, o.v.z) : null, tt.tt === 'dang' ? '⏳ ' + Math.floor(Math.ceil(tt.con / 1000) / 60) + ':' + String(Math.ceil(tt.con / 1000) % 60).padStart(2, '0') : '', 'mo');
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
  const thuMo = k => E.thuMo(st, k);
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
  vitDs.forEach((v, i) => { const u = v.userData, t = tg * 0.12 + u.pha, A = VT.ao, x = A.x + 1.2 + Math.cos(t) * A.rx * u.bk * 0.7, z = A.z + Math.sin(t) * A.rz * u.bk; v.rotation.y = Math.atan2(-Math.cos(t) * A.rz, -Math.sin(t) * A.rx); v.position.set(x, 0.02 + Math.sin(tg * 2 + i) * 0.02, z); });
  // ao: lá sen dập dềnh
  if (aoO && aoO.userData.la) aoO.userData.la.position.y = Math.sin(tg * 1.5) * 0.01;
  hdCau();
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
  for (const h of nenHd) if (h.nen === nenId) h.f(dt);
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
  if (chon.loai === 'kho') { const v = VT[chon.id] || VT.barn; return new T.Vector3(v.x, 3.2, v.z); }
  if (chon.loai === 'bang') return new T.Vector3(VT.bang.x, 2, VT.bang.z);
  if (chon.loai === 'nha') return new T.Vector3(VT.nha.x, 4.2, VT.nha.z);
  if (chon.loai === 'sap') return new T.Vector3(VT.sap.x, 2.2, VT.sap.z);
  if (chon.loai === 'hopThu') return new T.Vector3(VT.hopThu.x, 1.5, VT.hopThu.z);
  if (chon.loai === 'cau') return new T.Vector3(VT.cau.x + VT.cau.dai - 0.8, 1.7, VT.cau.z);
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

window.NT_SCENE = { init, doiNha, doiNen, doiSan, doiTenTrai, SAN_DO, SAN_MAC_DINH, nhaMuc: () => NHA_MUC, NEN, nen: () => nenId, nha: () => nhaKieu, datLe: (t, d) => { leTren = t; leDuoi = d; if (cv) { const cu = kcVua; doiCo(); if (cu === kcVua) return; } }, vaoGiua: () => { vaoGiua(); kc = kcVua; }, dongBo, datGiay, manHinh, viTri, batQuet, xeDi, nhinVe, dongHo, chup, nay, hat, phao, VT, _dbg: () => ({ muc, kc, cam, sc, R, hk }), _datCam: (x, z, k) => { muc.x = x; muc.z = z; if (k) kc = k; } };
})();
