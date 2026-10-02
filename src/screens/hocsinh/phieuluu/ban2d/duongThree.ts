// CON ĐƯỜNG bản đồ phiêu lưu vẽ bằng three.js (Thùy 02/10: "code threejs con đường đẹp hơn, tham khảo mẫu trên mạng").
// Tham khảo: bản đồ màn chơi kiểu Candy Crush (đường uốn lượn nối các điểm dừng là trục nhìn chính) · Codrops "High-speed Light Trails in Three.js"
// (dải lưới phẳng chạy theo đường cong + shader tô). Cách làm: 1 dải (ribbon) bám đường cong Catmull-Rom qua các mốc, 1 lần vẽ; shader tô:
//   đất có hạt sạn + đá cuội lát nhẹ · mép viền đá lượn sóng (vẽ tay) · bóng đổ mềm ngoài mép · đoạn ĐÃ ĐI ánh vàng + luồng sáng chạy tới mốc kế ·
//   đoạn CHƯA ĐI nhạt màu. Camera trực giao trùng khung px của tranh ⇒ đường nằm đúng toạ độ mốc. Màu lấy bảng màu style (b.duong/duongVien/vang).
// Nạp động (import) — chỉ tải three khi mở tầng lục địa/chặng; lỗi WebGL thì màn giữ đường SVG cũ.
import * as THREE from 'three'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { thongSo } from '../../skin/the3d/chatLuong'

/** nghieng = độ "dẹt" của mặt đất theo góc nhìn chéo của tranh (1 = nhìn thẳng từ trên, ~0,55 = chéo như nền vùng, ~0,45 = thấp hơn như nền chặng).
 *  xaGan = tỉ lệ bề rộng đường ở mép TRÊN (xa) so với mép DƯỚI (gần) khung — phối cảnh xa nhỏ gần to. */
export type DuongVao = { diem: { x: number; y: number }[]; toi: number; w: number; h: number; nuaRong: number; nghieng?: number; xaGan?: number }
export type Duong = { capNhat: (v: DuongVao) => void; datDong: (dong: boolean) => void; phaHuy: () => void }

const VERT = /* glsl */ `
attribute float aS; attribute float aBen; attribute float aNy;
varying float vS; varying float vBen; varying float vNy;
void main(){ vS = aS; vBen = aBen; vNy = aNy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime, uDiDuoc, uNua, uLe, uDong;
uniform vec3 uDat, uVien, uVang;
varying float vS; varying float vBen; varying float vNy;
float bam(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float nhieu(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(bam(i), bam(i+vec2(1,0)), f.x), mix(bam(i+vec2(0,1)), bam(i+vec2(1,1)), f.x), f.y); }
// khoảng cách tới mép ô cuội gần nhất (voronoi rút gọn)
float cuoi(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;
  for (int y=-1; y<=1; y++) for (int x=-1; x<=1; x++){ vec2 g = vec2(float(x), float(y)); vec2 o = vec2(bam(i+g), bam(i+g+7.3));
    float d = length(g + o - f); if (d < d1){ d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  return d2 - d1; }
void main(){
  float ben = abs(vBen);                                   // 0 = tim đường, 1 = mép đường, >1 = vùng bóng/quầng
  float lech = (nhieu(vec2(vS / uNua * 0.7, sign(vBen) * 5.0)) - 0.5) * 0.24; // mép lượn sóng kiểu vẽ tay
  float mep = 1.0 + lech;
  float da = 1.0 - step(uDiDuoc, vS);                      // 1 = đoạn đã đi
  if (ben > mep + uLe) discard;
  if (ben > mep) {
    float a = 1.0 - (ben - mep) / uLe; a = a * a;
    if (da > 0.5) { gl_FragColor = vec4(uVang, a * (0.55 + 0.25 * sin(uTime * 2.4 + vS / uNua * 0.4) * uDong)); return; } // quầng vàng đoạn đã đi
    if (vBen * vNy > 0.0 && ben < mep + 0.32) {                                                                        // thành đá phía GẦN (dưới màn hình): mặt đường đắp nổi
      float k = (ben - mep) / 0.32; vec3 thanh = uVien * (0.62 - 0.28 * k) * (0.9 + 0.2 * nhieu(vec2(vS / uNua * 3.0, 1.0)));
      gl_FragColor = vec4(thanh, 1.0); return; }
    gl_FragColor = vec4(uVien * 0.2, a * (vBen * vNy > 0.0 ? 0.45 : 0.18)); return;                                  // bóng đổ mềm, đậm phía dưới
  }
  vec2 q = vec2(vS / uNua, vBen);
  // đá cuội: ô to vừa mặt đường (≈2 viên theo bề ngang), khe sẫm rõ, mỗi viên một sắc
  vec2 qc = q * vec2(0.95, 1.05);
  float c = cuoi(qc);
  float sac = bam(floor(qc * 1.0 + 0.5));
  vec3 da1 = mix(uDat, uDat * vec3(1.06, 1.02, 0.94), sac);
  vec3 col = da1 * (0.9 + 0.2 * nhieu(q * vec2(3.0, 4.0)));
  col *= 0.94 + 0.1 * nhieu(q * vec2(12.0, 14.0));                     // hạt sạn
  float khe = 1.0 - smoothstep(0.03, 0.11, c);
  col = mix(col, uVien * 0.9, khe * 0.75);                             // khe giữa các viên
  col *= 1.0 + 0.12 * smoothstep(0.12, 0.35, c);                       // mặt viên lồi sáng
  float vien = smoothstep(mep - 0.32, mep - 0.06, ben);                // viền đá sẫm ở mép
  col = mix(col, uVien, vien * 0.95);
  if (da > 0.5) {
    col = mix(col, uVang, 0.38) * 1.08;
    float song = pow(max(0.0, sin(vS / uNua * 0.5 - uTime * 3.0)), 12.0) * uDong;  // luồng sáng chạy tới mốc kế
    col += vec3(1.0, 0.95, 0.75) * song * 0.6 * (1.0 - vien);
    float lap = step(0.975, bam(floor(q * vec2(2.2, 2.6)))) * (0.5 + 0.5 * sin(uTime * 5.0 + vS)) * uDong;
    col += vec3(1.0) * lap * 0.4 * (1.0 - vien);
  } else {
    float xam = dot(col, vec3(0.3, 0.59, 0.11));
    col = mix(col, vec3(xam), 0.45) * 0.72;
  }
  gl_FragColor = vec4(col, 1.0);
}`

export function taoDuong(host: HTMLElement, b: BangMau3D): Duong {
  const ts = thongSo()
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'
  host.appendChild(canvas)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ts.dprToiDa))
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10) // y hướng xuống như toạ độ màn hình
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthTest: false, side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 }, uDiDuoc: { value: 0 }, uNua: { value: 10 }, uLe: { value: 0.5 }, uDong: { value: 1 },
      uDat: { value: new THREE.Color(b.cat) }, uVien: { value: new THREE.Color(b.duongVien) }, uVang: { value: new THREE.Color(b.vang) },
    },
  })
  let mesh: THREE.Mesh | null = null
  let dong = true, raf = 0, t0 = performance.now(), song = true

  function ve() { mat.uniforms.uTime.value = (performance.now() - t0) / 1000; renderer.render(scene, camera) }
  function vong() { if (!song) return; if (!document.hidden) ve(); raf = dong ? requestAnimationFrame(vong) : 0 }

  function capNhat(v: DuongVao) {
    renderer.setSize(v.w, v.h, false)
    camera.left = 0; camera.right = v.w; camera.top = 0; camera.bottom = v.h; camera.updateProjectionMatrix()
    if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh = null }
    if (v.diem.length < 2) { ve(); return }
    // dựng đường TRÊN MẶT ĐẤT (y giãn theo 1/nghieng) rồi chiếu lại về màn hình (y × nghieng) ⇒ đoạn chạy ngang dẹt lại, đá cuội dẹt theo góc nhìn của tranh
    const ng = v.nghieng ?? 1, xaGan = v.xaGan ?? 1
    const pts = v.diem.map((d) => new THREE.Vector3(d.x * v.w, (d.y * v.h) / ng, 0))
    const cong = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
    const tong = cong.getLength(), buoc = Math.max(2, v.nuaRong * 0.35), n = Math.max(8, Math.ceil(tong / buoc))
    const le = 0.7, ngoai = 1 + le + 0.25 // dải rộng hơn mặt đường để chứa mép lượn + bóng
    const pos: number[] = [], aS: number[] = [], aBen: number[] = [], aNy: number[] = [], idx: number[] = []
    // độ dài cung tới mốc "toi" ⇒ đoạn đã đi
    const uToi = Math.min(1, Math.max(0, v.toi / (pts.length - 1)))
    let s = 0, sToi = v.toi <= 0 ? 0 : tong, prev = cong.getPoint(0)
    for (let i = 0; i <= n; i++) {
      const u = i / n, p = cong.getPoint(u), tg = cong.getTangent(u)
      if (i > 0) s += p.distanceTo(prev)
      if (v.toi > 0 && sToi === tong && u >= uToi) sToi = s
      prev = p
      const tl = Math.hypot(tg.x, tg.y) || 1, nx = -tg.y / tl, ny = tg.x / tl
      const yMan = p.y * ng, pc = xaGan + (1 - xaGan) * Math.min(1, Math.max(0, yMan / v.h)) // phối cảnh: xa (trên) nhỏ, gần (dưới) to
      const r = v.nuaRong * ngoai * pc
      pos.push(p.x + nx * r, (p.y + ny * r) * ng, 0, p.x - nx * r, (p.y - ny * r) * ng, 0)
      // mép trái luôn +, mép phải luôn − (đổi dấu theo hướng sẽ vỡ dải ở chỗ quay đầu); aNy cho shader biết phía nào là "dưới màn hình"
      aBen.push(ngoai, -ngoai); aS.push(s, s); aNy.push(ny, ny)
      if (i < n) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2) }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('aS', new THREE.Float32BufferAttribute(aS, 1))
    geo.setAttribute('aBen', new THREE.Float32BufferAttribute(aBen, 1))
    geo.setAttribute('aNy', new THREE.Float32BufferAttribute(aNy, 1))
    geo.setIndex(idx)
    mesh = new THREE.Mesh(geo, mat); scene.add(mesh)
    mat.uniforms.uNua.value = v.nuaRong; mat.uniforms.uLe.value = le; mat.uniforms.uDiDuoc.value = v.toi > 0 ? sToi : -1
    ve()
  }
  function datDong(d: boolean) { dong = d; mat.uniforms.uDong.value = d ? 1 : 0; cancelAnimationFrame(raf); if (d) raf = requestAnimationFrame(vong); else ve() }
  raf = requestAnimationFrame(vong)
  return {
    capNhat, datDong,
    phaHuy: () => { song = false; cancelAnimationFrame(raf); mesh?.geometry.dispose(); mat.dispose(); renderer.dispose(); canvas.remove() },
  }
}
