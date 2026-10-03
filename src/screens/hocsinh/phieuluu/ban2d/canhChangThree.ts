// CẢNH TẦNG DẠNG BÀI (chặng đường) vẽ HOÀN TOÀN bằng three.js — Thùy 03/10 chốt "Hướng 1": 1 con đường GẦN THẲNG ngang giữa màn, nền THỜI TIẾT của vùng,
// mỗi dạng = 1 trạm trên đường, KÉO NGANG như thanh tiến trình, dạng cuối có CỜ ĐÍCH. ChatGPT hết lượt ⇒ không đặt vẽ, dựng cảnh bằng shader.
// Cách làm (kiểu "side-scroller parallax" của game 2D — Rayman/Ori dùng nhiều lớp trượt khác tốc độ để ra chiều sâu):
//   1 tấm phủ màn hình + 1 shader tô từng lớp theo thứ tự xa → gần, mỗi lớp trượt theo độ cuộn × hệ số riêng:
//   trời (dải màu + mặt trời + mây + sao) ×0,05 · núi xa ×0,2 · đồi + hàng cây/đá/pha lê/đụn cát (hoặc BIỂN) ×0,45 · mặt đất + bụi cây + CON ĐƯỜNG ×1 · sương thấp.
//   + 1 lớp hạt THỜI TIẾT (đom đóm · cánh hoa · tuyết · tàn lửa · cát bay · gió · sao lấp lánh) trôi trên màn.
// Màu lấy từ bảng màu style (BangMau3D) — không gõ màu ở component. Nạp động: chỉ tải three khi mở tầng chặng.
import * as THREE from 'three'
import type { BangMau3D, MauBiome } from '../../skin/the3d/kieuMau'
import { thongSo } from '../../skin/the3d/chatLuong'

/** Bố cục do lớp React tính (đơn vị px CSS, x theo TOÀN dải cuộn): đường y = yDuong + bienDo·sin(x·tanSo). */
export type BoCucChang = { w: number; h: number; yDuong: number; bienDo: number; tanSo: number; nua: number; xDau: number; xCuoi: number; xDaDi: number; xong: boolean }
export type CanhChang = { capNhat: (v: BoCucChang) => void; cuon: (x: number) => void; datDong: (d: boolean) => void; phaHuy: () => void }

// kiểu hàng cây trên đồi: 0 không · 1 tán tròn · 2 thông · 3 pha lê · 4 đá lởm chởm · 5 đụn cát
type CauHinh = { cay: number; nuoc: number; sao: number; suong: number; nang: number; hat: { kieu: 0 | 1 | 2 | 3; mau: 'vang' | 'diem' | 'trang' | 'cat' | 'lua'; n: number; vx: number; vy: number; co: number; lac: number } }
const VUNG: Record<string, CauHinh> = {
  rung:     { cay: 1, nuoc: 0, sao: 0,   suong: 0.25, nang: 1,   hat: { kieu: 0, mau: 'vang',  n: 46, vx: 6,   vy: -4,  co: 7,  lac: 18 } },
  anh_dao:  { cay: 1, nuoc: 0, sao: 0,   suong: 0.2,  nang: 1,   hat: { kieu: 1, mau: 'diem',  n: 60, vx: 34,  vy: 26,  co: 11, lac: 24 } },
  thanh_co: { cay: 4, nuoc: 0, sao: 0,   suong: 0.3,  nang: 1,   hat: { kieu: 0, mau: 'vang',  n: 34, vx: 8,   vy: -3,  co: 5,  lac: 10 } },
  dam_lay:  { cay: 1, nuoc: 0, sao: 0.2, suong: 0.85, nang: 0.5, hat: { kieu: 0, mau: 'diem',  n: 60, vx: 4,   vy: -6,  co: 7,  lac: 22 } },
  sa_mac:   { cay: 5, nuoc: 0, sao: 0,   suong: 0.1,  nang: 1.4, hat: { kieu: 2, mau: 'cat',   n: 50, vx: 160, vy: 6,   co: 14, lac: 6 } },
  bang:     { cay: 2, nuoc: 0, sao: 0.3, suong: 0.35, nang: 0.7, hat: { kieu: 3, mau: 'trang', n: 90, vx: -14, vy: 46,  co: 6,  lac: 16 } },
  nui_lua:  { cay: 4, nuoc: 0, sao: 0,   suong: 0.3,  nang: 0.6, hat: { kieu: 0, mau: 'lua',   n: 70, vx: 10,  vy: -42, co: 6,  lac: 14 } },
  bien_dao: { cay: 1, nuoc: 1, sao: 0,   suong: 0.15, nang: 1.2, hat: { kieu: 0, mau: 'trang', n: 30, vx: 18,  vy: -2,  co: 5,  lac: 8 } },
  troi_sao: { cay: 3, nuoc: 0, sao: 1,   suong: 0.2,  nang: 0.4, hat: { kieu: 0, mau: 'vang',  n: 56, vx: 3,   vy: -2,  co: 6,  lac: 6 } },
  dong_gio: { cay: 1, nuoc: 0, sao: 0,   suong: 0.15, nang: 1.1, hat: { kieu: 2, mau: 'trang', n: 40, vx: 220, vy: 4,   co: 18, lac: 10 } },
}

const VERT = /* glsl */ `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`
const FRAG = /* glsl */ `
precision highp float;
uniform vec2 uKhung; uniform float uDpr, uCuon, uTime, uDong;
uniform vec3 uTroi, uChan, uNang, uNuiXa, uDoi, uCay, uCay2, uDat, uDat2, uDiem, uDuong, uVien, uVang, uSuong, uNuoc1, uNuoc2;
uniform float uYDuong, uBienDo, uTanSo, uNua, uXDau, uXCuoi, uXDaDi, uXong;
uniform float uKieuCay, uCoNuoc, uSao, uSuongDay, uNangManh;
float bam(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float bam2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f); return mix(bam(i), bam(i+1.0), f); }
float fbm1(float x){ return 0.55*n1(x) + 0.28*n1(x*2.1+3.1) + 0.12*n1(x*4.3+7.7) + 0.05*n1(x*8.9+1.3); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(bam2(i), bam2(i+vec2(1,0)), f.x), mix(bam2(i+vec2(0,1)), bam2(i+vec2(1,1)), f.x), f.y); }
float fbm2(vec2 p){ return 0.55*n2(p) + 0.28*n2(p*2.03+3.1) + 0.17*n2(p*4.1+7.7); }
float cuoi(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;
  for (int y=-1; y<=1; y++) for (int x=-1; x<=1; x++){ vec2 g = vec2(float(x), float(y)); vec2 o = vec2(bam2(i+g), bam2(i+g+7.3));
    float d = length(g + o - f); if (d < d1){ d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  return d2 - d1; }
float yDuong(float x){ return uYDuong + uBienDo * sin(x * uTanSo) + uBienDo * 0.35 * sin(x * uTanSo * 2.7 + 1.3); }

// hàng cây/đá trên một đường chân (yChan) — trả độ phủ 0..1, đổi màu nhẹ theo ô
float hangCay(float x, float y, float yChan, float o, float co, out float sac){
  float i = floor(x / o), cx = (i + 0.5) * o + (bam(i) - 0.5) * o * 0.5;
  float r = co * (0.6 + 0.6 * bam(i + 9.1)); sac = bam(i + 3.3);
  if (bam(i + 5.7) < 0.22) return 0.0;                                         // chừa khoảng trống
  float dx = x - cx, dy = yChan - y;                                           // dy > 0 = phía trên chân
  if (uKieuCay < 1.5) {                                                        // tán tròn: thân ngắn + 2 vòm
    float than = step(abs(dx), r * 0.12) * step(0.0, dy) * step(dy, r * 0.7);
    float tan = max(step(length(vec2(dx, dy - r * 1.25)), r), step(length(vec2(dx - r * 0.55, dy - r * 0.85)), r * 0.7));
    return max(than * 0.6, tan);
  } else if (uKieuCay < 2.5) {                                                 // thông: tam giác xếp tầng
    float h = r * 2.6, k = dy / h; if (dy < 0.0 || k > 1.0) return 0.0;
    float rong = r * (1.0 - k) * (0.75 + 0.25 * step(0.5, fract(k * 3.0)));
    return step(abs(dx), rong);
  } else if (uKieuCay < 3.5) {                                                 // pha lê: hình thoi cao
    float h = r * 3.0, k = dy / h; if (dy < 0.0 || k > 1.0) return 0.0;
    return step(abs(dx), r * 0.45 * (1.0 - abs(k * 2.0 - 0.6)));
  } else if (uKieuCay < 4.5) {                                                 // đá lởm chởm / tàn tích
    float h = r * (1.4 + bam(i + 1.1)), k = dy / h; if (dy < 0.0 || k > 1.0) return 0.0;
    return step(abs(dx + (k - 0.5) * r * 0.3), r * 0.7 * (1.0 - k * 0.8));
  }
  return 0.0;                                                                  // đụn cát: không cây
}

void main(){
  vec2 man = vec2(gl_FragCoord.x / uDpr, uKhung.y - gl_FragCoord.y / uDpr);    // px CSS, gốc trên-trái
  float W = uKhung.x, H = uKhung.y, y = man.y;
  float yChanTroi = H * 0.40;
  // ── TRỜI ──
  vec3 col = mix(uTroi, uChan, smoothstep(0.0, yChanTroi * 1.05, y));
  vec2 mt = vec2(W * 0.72 - uCuon * 0.05, H * 0.24);
  float dmt = length(man - mt);
  col += uNang * (exp(-dmt / (H * 0.22)) * 0.38 * uNangManh + smoothstep(H * 0.06, H * 0.05, dmt) * 0.4 * uNangManh);
  if (uSao > 0.0) {
    vec2 o = floor((man + vec2(uCuon * 0.03, 0.0)) / 6.0);
    float s = step(0.992, bam2(o)) * (0.6 + 0.4 * sin(uTime * 2.0 + bam2(o) * 40.0));
    col += vec3(1.0, 0.97, 0.85) * s * uSao * (1.0 - smoothstep(0.0, yChanTroi, y));
  }
  float may = fbm2(vec2((man.x + uCuon * 0.08) * 0.0035 + uTime * 0.01, y * 0.012));
  col = mix(col, mix(uChan, vec3(1.0), 0.55), smoothstep(0.58, 0.8, may) * 0.55 * (1.0 - smoothstep(yChanTroi * 0.3, yChanTroi * 0.95, y)));
  // ── NÚI XA (×0,2) ──
  float xXa = man.x + uCuon * 0.2;
  float yXa = yChanTroi - H * (0.05 + 0.13 * fbm1(xXa * 0.0032));
  if (y > yXa) col = mix(mix(uNuiXa, uSuong, 0.5), uChan, 0.25 * smoothstep(yXa, yChanTroi + H * 0.08, y));
  // ── ĐỒI + HÀNG CÂY (×0,45) — hoặc BIỂN ──
  float xGiua = man.x + uCuon * 0.45;
  float yDoi = H * 0.5 - H * 0.06 * fbm1(xGiua * 0.005 + 4.0);
  if (uKieuCay > 4.5) yDoi = H * 0.5 - H * 0.07 * (0.5 + 0.5 * sin(xGiua * 0.006)) * (0.6 + 0.4 * n1(xGiua * 0.002)); // đụn cát mềm
  if (uCoNuoc > 0.5) {
    if (y > yChanTroi) {
      float k = smoothstep(yChanTroi, H * 0.56, y);
      col = mix(uNuoc2, uNuoc1, k);
      float song = sin(xGiua * 0.04 + y * 0.5 - uTime * 1.2 * uDong) * sin(xGiua * 0.013 - uTime * 0.6 * uDong);
      col += vec3(1.0) * step(0.93, song) * 0.25 * (0.4 + k);
    }
    yDoi = H * 0.56;                                                           // đảo nhỏ xa xa thay cho đồi
    float dao = smoothstep(0.62, 0.7, n1(xGiua * 0.004)) * H * 0.05;
    if (y > yChanTroi + H * 0.06 - dao && dao > 0.0 && y < yChanTroi + H * 0.07) col = mix(uDoi, uSuong, 0.35);
  } else {
    float sac; float c = hangCay(xGiua, y, yDoi + 2.0, 46.0, 15.0, sac);
    if (c > 0.5) col = mix(mix(uCay, uCay2, sac * 0.6), uSuong, 0.42);
    if (y > yDoi) col = mix(mix(uDoi, uSuong, 0.3), uDat2, smoothstep(yDoi, H * 0.6, y) * 0.5);
  }
  // ── MẶT ĐẤT GẦN (×1) + bụi cây ──
  float x = man.x + uCuon;
  float yDat = H * 0.555 + H * 0.012 * sin(x * 0.011) + H * 0.01 * n1(x * 0.02);
  float sacB; float bui = 0.0;
  if (uCoNuoc < 0.5 && uKieuCay < 4.5) { bui = hangCay(x, y, yDat + 4.0, 120.0, 22.0, sacB); }
  if (bui > 0.5) col = mix(uCay, uCay2, sacB * 0.7) * (0.85 + 0.25 * n2(man * 0.08));
  if (y > yDat) {
    float k = smoothstep(yDat, H, y);
    vec3 dat = mix(uDat, uDat2, 0.35 + 0.5 * fbm2(vec2(x * 0.01, y * 0.03)));
    dat *= 0.92 + 0.12 * n2(vec2(x * 0.15, y * 0.3));
    float hoa = step(0.985, bam2(floor(vec2(x, y) / 7.0)));                    // hoa / sỏi lấm tấm
    dat = mix(dat, uDiem, hoa * 0.7);
    col = dat * (0.97 - k * 0.22);
    col = mix(col, uSuong, (1.0 - smoothstep(yDat, yDat + H * 0.08, y)) * 0.3); // chân đồi mờ sương
  }
  // ── CON ĐƯỜNG ──
  if (x > uXDau - 40.0 && x < uXCuoi + uNua * 2.6) {
    float yc = yDuong(x), d = (y - yc) / uNua;
    float lech = (n1(x / uNua * 1.3 + sign(d) * 9.0) - 0.5) * 0.22;
    float mep = 1.0 + lech;
    float raDau = smoothstep(uXDau - 40.0, uXDau + uNua * 2.0, x);            // đường mọc dần từ mép trái
    float cuoiDuong = 1.0 - smoothstep(uXCuoi - uNua * 0.2, uXCuoi + uNua * 0.4, x);
    // quảng trường tròn ở cờ đích
    float dQ = length(vec2((x - uXCuoi) / (uNua * 2.3), (y - yDuong(uXCuoi)) / (uNua * 1.25)));
    float trongDuong = max(step(abs(d), mep) * cuoiDuong, step(dQ, 1.0)) * raDau;
    float da = step(x, uXDaDi);
    if (trongDuong > 0.5) {
      vec2 q = vec2(x / (uNua * 1.05), d * 1.1);
      float c = cuoi(q);
      vec3 vien = uVien;
      vec3 m = mix(uDuong, uDuong * vec3(1.06, 1.02, 0.94), bam2(floor(q + 0.5)));
      m *= 0.9 + 0.2 * n2(q * vec2(3.0, 4.0));
      m = mix(m, vien * 0.9, (1.0 - smoothstep(0.03, 0.11, c)) * 0.75);
      m *= 1.0 + 0.12 * smoothstep(0.12, 0.35, c);
      float bien = max(smoothstep(mep - 0.3, mep - 0.04, abs(d)) * cuoiDuong, smoothstep(0.82, 0.98, dQ));
      m = mix(m, vien, bien * 0.9);
      if (da > 0.5 || (dQ < 1.0 && uXong > 0.5)) {
        m = mix(m, uVang, 0.36) * 1.08;
        float song = pow(max(0.0, sin(x / uNua * 0.45 - uTime * 3.0)), 12.0) * uDong;
        m += vec3(1.0, 0.95, 0.75) * song * 0.55 * (1.0 - bien);
      } else {
        m = mix(m, vec3(dot(m, vec3(0.3, 0.59, 0.11))), 0.3) * 0.9;
      }
      col = m;
    } else if (raDau > 0.5 && d > 0.0 && d < mep + 0.32 && cuoiDuong > 0.5) {
      col = uVien * (0.6 - 0.3 * (d - mep) / 0.32);                            // thành đá phía gần (mặt đường đắp nổi)
    } else if (raDau > 0.5 && abs(d) < mep + 0.9 && cuoiDuong > 0.5) {
      float a = 1.0 - (abs(d) - mep) / 0.9;
      col = mix(col, da > 0.5 ? uVang : uVien * 0.4, a * a * (da > 0.5 ? 0.35 : (d > 0.0 ? 0.4 : 0.15)));
    }
  }
  // ── SƯƠNG THẤP trôi ──
  if (uSuongDay > 0.0) {
    float s = fbm2(vec2((man.x + uCuon * 0.7) * 0.004 - uTime * 0.03 * uDong, y * 0.02));
    float dai = smoothstep(H * 0.35, H * 0.55, y) * (1.0 - smoothstep(H * 0.7, H, y));
    col = mix(col, uSuong * 1.15, smoothstep(0.45, 0.75, s) * dai * uSuongDay * 0.55);
  }
  // viền tối 4 góc
  vec2 v = man / uKhung - 0.5; col *= 1.0 - dot(v, v) * 0.42;
  gl_FragColor = vec4(col, 1.0);
}`

const VERT_HAT = /* glsl */ `
attribute vec4 aHat;
uniform vec2 uKhung; uniform float uDpr, uCuon, uTime, uCo, uLac; uniform vec2 uVan;
varying float vSang; varying float vXoay;
void main(){
  float t = uTime;
  vec2 p = aHat.xy * (uKhung + 80.0) + uVan * t * (0.6 + aHat.z * 0.8) - vec2(uCuon * (0.9 + aHat.z * 0.4), 0.0);
  p += vec2(sin(t * 0.9 + aHat.w * 30.0), cos(t * 0.7 + aHat.w * 20.0)) * uLac;
  p = mod(p, uKhung + 80.0) - 40.0;
  vec2 clip = vec2(p.x / uKhung.x * 2.0 - 1.0, 1.0 - p.y / uKhung.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = uCo * uDpr * (0.55 + aHat.z * 0.9);
  vSang = 0.55 + 0.45 * sin(t * (1.5 + aHat.w * 3.0) + aHat.w * 50.0);
  vXoay = t * (0.6 + aHat.w) + aHat.w * 6.28;
}`
const FRAG_HAT = /* glsl */ `
precision highp float;
uniform vec3 uMau; uniform float uKieu;
varying float vSang; varying float vXoay;
void main(){
  vec2 q = gl_PointCoord - 0.5;
  float a;
  if (uKieu < 0.5) { float d = length(q); a = (smoothstep(0.5, 0.0, d) * 0.6 + smoothstep(0.16, 0.0, d)) * vSang; }       // đốm sáng (đom đóm / tàn lửa / sao)
  else if (uKieu < 1.5) { float c = cos(vXoay), s = sin(vXoay); vec2 r = vec2(c*q.x - s*q.y, s*q.x + c*q.y);               // cánh hoa xoay
    a = smoothstep(0.5, 0.42, length(r * vec2(1.0, 2.2))) * 0.9; }
  else if (uKieu < 2.5) { a = smoothstep(0.08, 0.0, abs(q.y)) * smoothstep(0.5, 0.1, abs(q.x)) * 0.55; }                    // vệt gió / cát
  else { a = smoothstep(0.5, 0.15, length(q)) * 0.85; }                                                                       // tuyết
  if (a < 0.01) discard;
  gl_FragColor = vec4(uMau, a);
}`

export function taoCanhChang(host: HTMLElement, b: BangMau3D, biome: string): CanhChang {
  const ts = thongSo()
  const ch = VUNG[biome] ?? VUNG.rung
  const mb: MauBiome = b.biome[biome] ?? b.biome.rung ?? Object.values(b.biome)[0]
  // ShaderMaterial xuất thẳng giá trị ra màn (không đổi lại sRGB) ⇒ đọc màu style NGUYÊN giá trị sRGB, không để three đổi sang tuyến tính (đổi ⇒ cả cảnh tối sầm)
  const C = (s: string) => new THREE.Color().setStyle(s, THREE.LinearSRGBColorSpace)
  const tron = (a: string, c: string, k: number) => C(a).lerp(C(c), k)
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'
  host.appendChild(canvas)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
  const dpr = Math.min(window.devicePixelRatio || 1, ts.dprToiDa, 1.5)
  renderer.setPixelRatio(dpr)
  const scene = new THREE.Scene(), camera = new THREE.Camera()

  // trời: đỉnh = nền đêm của style kéo về xanh trời; chân trời = nắng giờ vàng pha màu vùng
  const troi = biome === 'troi_sao' || biome === 'dam_lay' ? tron(b.troi, b.hemiTroi, 0.15) : biome === 'nui_lua' ? tron(b.troi, mb.diem, 0.25) : tron(b.troi, b.hemiTroi, 0.55)
  const chan = biome === 'nui_lua' ? tron(mb.diem, b.matTroi, 0.35) : biome === 'troi_sao' ? tron(b.suong, mb.diem, 0.25) : tron(b.matTroi, mb.dat2, 0.3).lerp(C(b.hemiTroi), 0.15)
  const u = {
    uKhung: { value: new THREE.Vector2(1, 1) }, uDpr: { value: dpr }, uCuon: { value: 0 }, uTime: { value: 0 }, uDong: { value: 1 },
    uTroi: { value: troi }, uChan: { value: chan }, uNang: { value: C(b.matTroi) },
    uNuiXa: { value: tron(mb.nui, b.hemiTroi, 0.35) }, uDoi: { value: C(mb.dat2) }, uCay: { value: C(mb.cay) }, uCay2: { value: C(biome === 'anh_dao' ? mb.diem : mb.cay2) },
    uDat: { value: C(mb.dat) }, uDat2: { value: C(mb.dat2) }, uDiem: { value: C(mb.diem) },
    uDuong: { value: C(b.cat) }, uVien: { value: C(b.duongVien) }, uVang: { value: C(b.vang) }, uSuong: { value: C(b.suong).lerp(chan, 0.5) },
    uNuoc1: { value: C(b.nuocNong) }, uNuoc2: { value: C(b.nuocSau) },
    uYDuong: { value: 0 }, uBienDo: { value: 0 }, uTanSo: { value: 0.01 }, uNua: { value: 20 }, uXDau: { value: 0 }, uXCuoi: { value: 0 }, uXDaDi: { value: -1 }, uXong: { value: 0 },
    uKieuCay: { value: ch.cay }, uCoNuoc: { value: ch.nuoc }, uSao: { value: ch.sao }, uSuongDay: { value: ts.hatNen ? ch.suong : ch.suong * 0.5 }, uNangManh: { value: ch.nang },
  }
  const nen = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, depthTest: false, depthWrite: false }))
  nen.frustumCulled = false; scene.add(nen)

  // hạt thời tiết
  const h = ch.hat, n = Math.round(h.n * (ts.hatNen ? 1 : 0.45)), arr = new Float32Array(n * 4)
  for (let i = 0; i < n * 4; i++) arr[i] = Math.random()
  const gHat = new THREE.BufferGeometry()
  gHat.setAttribute('aHat', new THREE.BufferAttribute(arr, 4))
  gHat.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
  const mauHat = h.mau === 'vang' ? C(b.vang) : h.mau === 'diem' ? C(mb.diem) : h.mau === 'cat' ? C(mb.dat).lerp(C('#ffffff'), 0.3) : h.mau === 'lua' ? C(mb.diem) : C(b.bot)
  const uh = {
    uKhung: u.uKhung, uDpr: u.uDpr, uCuon: u.uCuon, uTime: u.uTime, uCo: { value: h.co }, uLac: { value: h.lac }, uVan: { value: new THREE.Vector2(h.vx, h.vy) },
    uMau: { value: mauHat }, uKieu: { value: h.kieu },
  }
  const hat = new THREE.Points(gHat, new THREE.ShaderMaterial({
    vertexShader: VERT_HAT, fragmentShader: FRAG_HAT, uniforms: uh, transparent: true, depthTest: false, depthWrite: false,
    blending: h.kieu === 0 ? THREE.AdditiveBlending : THREE.NormalBlending,
  }))
  hat.frustumCulled = false; scene.add(hat)

  let dong = true, raf = 0, song = true, can = true, tCu = 0
  const t0 = performance.now(), khung = 1000 / ts.fps
  function ve() { u.uTime.value = (performance.now() - t0) / 1000; renderer.render(scene, camera); can = false }
  function vong(now: number) {
    if (!song) return
    if (!document.hidden && (can || (dong && now - tCu >= khung))) { tCu = now; ve() }
    raf = requestAnimationFrame(vong)
  }
  raf = requestAnimationFrame(vong)
  return {
    capNhat(v) {
      renderer.setSize(v.w, v.h, false)
      u.uKhung.value.set(v.w, v.h); u.uYDuong.value = v.yDuong; u.uBienDo.value = v.bienDo; u.uTanSo.value = v.tanSo; u.uNua.value = v.nua
      u.uXDau.value = v.xDau; u.uXCuoi.value = v.xCuoi; u.uXDaDi.value = v.xDaDi; u.uXong.value = v.xong ? 1 : 0
      hat.visible = dong || ts.hatNen
      can = true
    },
    cuon(x) { if (u.uCuon.value !== x) { u.uCuon.value = x; can = true } },
    datDong(d) { dong = d; u.uDong.value = d ? 1 : 0; hat.visible = d; can = true },
    phaHuy() { song = false; cancelAnimationFrame(raf); gHat.dispose(); (hat.material as THREE.Material).dispose(); nen.geometry.dispose(); (nen.material as THREE.Material).dispose(); renderer.dispose(); canvas.remove() },
  }
}

