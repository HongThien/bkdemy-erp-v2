// ============================================================================
// ĐỊA HÌNH 2.5D: lưới độ cao tô màu theo đỉnh · tách mỗi lục địa/vùng thành 1 mesh riêng (nâng lên khi trỏ vào) ·
// nước có bọt sóng ven bờ đọc từ "bản đồ khoảng cách tới bờ" · mây sương · cờ chinh phục.
// ============================================================================
import * as THREE from 'three'
import { Bo } from './dungHinh'
import { matToon, matVat } from './vatLieu'
import { rng } from './hinhHoc'
import type { BangMau3D } from './kieuMau'

export type MauDiem = { h: number; r: number; g: number; b: number; id: number }
export type Khung = { x0: number; z0: number; x1: number; z1: number }
export type Luoi = {
  /** hình theo id (id < 0 = nước, bỏ) */
  hinh: Map<number, THREE.BufferGeometry>
  /** độ cao tại (x,z) (nội suy song tuyến) — đặt vật lên đất */
  docCao: (x: number, z: number) => number
}

/** Dựng lưới độ cao: `f` cho độ cao + màu + id mỗi điểm. Pháp tuyến tính theo vi phân ⇒ bóng mượt, không vỡ mảnh. */
export function xayLuoi(k: Khung, buoc: number, f: (x: number, z: number) => MauDiem, boQua = -0.45): Luoi {
  const nx = Math.ceil((k.x1 - k.x0) / buoc) + 1, nz = Math.ceil((k.z1 - k.z0) / buoc) + 1
  const H = new Float32Array(nx * nz), C = new Float32Array(nx * nz * 3), ID = new Int16Array(nx * nz)
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const m = f(k.x0 + i * buoc, k.z0 + j * buoc), n = j * nx + i
    H[n] = m.h; C[n * 3] = m.r; C[n * 3 + 1] = m.g; C[n * 3 + 2] = m.b; ID[n] = m.id
  }
  const nor = (i: number, j: number): [number, number, number] => {
    const a = H[j * nx + Math.max(0, i - 1)], b = H[j * nx + Math.min(nx - 1, i + 1)], c = H[Math.max(0, j - 1) * nx + i], d = H[Math.min(nz - 1, j + 1) * nx + i]
    const dx = (b - a) / (2 * buoc), dz = (d - c) / (2 * buoc), l = Math.hypot(dx, 1, dz)
    return [-dx / l, 1 / l, -dz / l]
  }
  const P = new Map<number, number[]>(), N = new Map<number, number[]>(), Co = new Map<number, number[]>()
  const them = (id: number, vs: number[][]) => {
    let p = P.get(id), n = N.get(id), c = Co.get(id)
    if (!p) { p = []; n = []; c = []; P.set(id, p); N.set(id, n); Co.set(id, c) }
    for (const [i, j] of vs) {
      const q = j * nx + i, nn = nor(i, j)
      p.push(k.x0 + i * buoc, H[q], k.z0 + j * buoc); n!.push(nn[0], nn[1], nn[2]); c!.push(C[q * 3], C[q * 3 + 1], C[q * 3 + 2])
    }
  }
  const tri = (a: number[], b: number[], c: number[]) => {
    const ia = a[1] * nx + a[0], ib = b[1] * nx + b[0], ic = c[1] * nx + c[0]
    if (Math.max(H[ia], H[ib], H[ic]) < boQua) return
    // id theo đa số; hoà thì lấy đỉnh có độ cao lớn nhất (đất liền thắng nước)
    const ids = [ID[ia], ID[ib], ID[ic]]
    let id = ids[0]
    if (ids[1] === ids[2]) id = ids[1]
    else if (ids[0] !== ids[1] && ids[0] !== ids[2]) id = [ia, ib, ic].sort((x, y) => H[y] - H[x]).map((q) => ID[q]).find((v) => v >= 0) ?? -1
    if (id < 0) return
    them(id, [a, b, c])
  }
  for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = [i, j], b = [i + 1, j], c = [i, j + 1], d = [i + 1, j + 1]
    tri(a, c, b); tri(b, c, d)
  }
  const hinh = new Map<number, THREE.BufferGeometry>()
  for (const [id, p] of P) {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(N.get(id)!, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(Co.get(id)!, 3))
    hinh.set(id, g)
  }
  const docCao = (x: number, z: number) => {
    const fx = (x - k.x0) / buoc, fz = (z - k.z0) / buoc
    const i = Math.max(0, Math.min(nx - 2, Math.floor(fx))), j = Math.max(0, Math.min(nz - 2, Math.floor(fz))), u = Math.max(0, Math.min(1, fx - i)), v = Math.max(0, Math.min(1, fz - j))
    const a = H[j * nx + i], b = H[j * nx + i + 1], c = H[(j + 1) * nx + i], d = H[(j + 1) * nx + i + 1]
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
  return { hinh, docCao }
}

// ---------- nước ----------
export type Nuoc = { mesh: THREE.Mesh; phaHuy: () => void }
/** Nước đục (opaque) có màu nông→sâu + bọt sóng ven bờ + lấp lánh ánh sao. `sdfF(x,z)` < 0 = ngoài biển (khoảng cách âm tới bờ). */
export function taoNuoc(b: BangMau3D, kh: Khung, sdfF: (x: number, z: number) => number, uTime: { value: number }, range = 5, res = 5): Nuoc {
  const w = kh.x1 - kh.x0, d = kh.z1 - kh.z0, tw = Math.ceil(w * res), th = Math.ceil(d * res), data = new Uint8Array(tw * th * 4)
  for (let j = 0; j < th; j++) for (let i = 0; i < tw; i++) {
    const s = sdfF(kh.x0 + (i + 0.5) / res, kh.z0 + (j + 0.5) / res)
    const q = (j * tw + i) * 4
    data[q] = Math.round(Math.max(0, Math.min(1, -s / range)) * 255); data[q + 1] = s > 0 ? 255 : 0; data[q + 3] = 255
  }
  const tex = new THREE.DataTexture(data, tw, th, THREE.RGBAFormat)
  tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; tex.needsUpdate = true
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSdf: { value: tex }, uBox: { value: new THREE.Vector4(kh.x0, kh.z0, w, d) }, uTime, uRange: { value: range },
      uNong: { value: new THREE.Color(b.nuocNong) }, uSau: { value: new THREE.Color(b.nuocSau) }, uBot: { value: new THREE.Color(b.bot) }, uSuong: { value: new THREE.Color(b.suong) },
    },
    vertexShader: 'varying vec3 vW;\nvoid main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `
      uniform sampler2D uSdf; uniform vec4 uBox; uniform float uTime; uniform float uRange;
      uniform vec3 uNong; uniform vec3 uSau; uniform vec3 uBot; uniform vec3 uSuong;
      varying vec3 vW;
      void main(){
        vec2 uv = (vW.xz - uBox.xy) / uBox.zw;
        float inside = step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0);
        float d = mix(uRange, texture2D(uSdf, clamp(uv,0.0,1.0)).r * uRange, inside);
        float w1 = sin(vW.x*1.7 + uTime*0.9)*0.5 + sin(vW.z*2.3 - uTime*1.1)*0.5;
        vec3 col = mix(uNong, uSau, smoothstep(0.0, uRange*0.75, d + w1*0.06));
        float f1 = 1.0 - smoothstep(0.0, 0.2, abs(d - 0.1 - 0.07*sin(uTime*1.2 + vW.x*0.8)));
        float band = fract(d*0.8 - uTime*0.1);
        float f2 = smoothstep(0.0,0.05,band)*(1.0-smoothstep(0.05,0.12,band))*(1.0-smoothstep(0.5,2.0,d))*0.5;
        col = mix(col, uBot, clamp(f1*0.8 + f2, 0.0, 1.0));
        vec2 cel = floor(vW.xz*2.2); float hh = fract(sin(dot(cel, vec2(12.9898,78.233)))*43758.5453); float tw = step(0.9, hh) * pow(max(0.0, sin(uTime*(1.2+hh*2.0)+hh*40.0)), 6.0);
        vec2 fc = fract(vW.xz*2.2) - 0.5; col += vec3(tw * smoothstep(0.28, 0.0, length(fc)) * 0.5);
        float dist = length(vW.xz - uBox.xy - uBox.zw*0.5);
        col = mix(col, uSuong, smoothstep(uBox.z*0.5, uBox.z*0.95, dist));
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w + 90, d + 90).rotateX(-Math.PI / 2), mat)
  mesh.position.set(kh.x0 + w / 2, 0, kh.z0 + d / 2)
  return { mesh, phaHuy: () => { mesh.geometry.dispose(); mat.dispose(); tex.dispose() } }
}

// ---------- mây sương (phủ vùng chưa dạy) ----------
export type May = { goc: THREE.Group; capNhat: (t: number) => void }
export function taoMay(b: BangMau3D, rong: number, seed: number, soDam = 4): May {
  const R = rng(seed), goc = new THREE.Group(), mat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0.93, emissive: new THREE.Color(b.hemiTroi).multiplyScalar(0.25) })
  const dams: { g: THREE.Group; x: number; v: number }[] = []
  for (let k = 0; k < soDam; k++) {
    const bo = new Bo(), n = 5 + Math.floor(R() * 3), cx = (R() - 0.5) * rong, cz = (R() - 0.5) * rong * 0.7
    for (let i = 0; i < n; i++) bo.cau(0.7 + R() * 0.7, '#e8eefc', { x: (i - n / 2) * 0.8 + (R() - 0.5) * 0.4, y: R() * 0.35, z: (R() - 0.5) * 0.9, sy: 0.7 }, { duoi: '#aab6dc', y0: -0.4, y1: 0.9 }, 10)
    const m = new THREE.Mesh(bo.xuat({ ao: 0.18 }), mat); m.castShadow = false
    const g = new THREE.Group(); g.add(m); g.position.set(cx, 1.5 + R() * 0.6, cz); g.scale.setScalar(0.45 + R() * 0.3)
    goc.add(g); dams.push({ g, x: cx, v: 0.05 + R() * 0.08 })
  }
  return { goc, capNhat: (t) => { for (const d of dams) { d.g.position.x = d.x + Math.sin(t * d.v * 3 + d.x) * 0.5; d.g.position.y += Math.sin(t * 0.8 + d.x) * 0.0015 } } }
}

// ---------- cờ chinh phục ----------
export function taoCo(b: BangMau3D, cao = 1.5): THREE.Group {
  const bo = new Bo()
  bo.tru(0.035, 0.045, cao, '#f4ecd8', { y: cao / 2 }, undefined, 6)
  bo.cau(0.07, b.vang, { y: cao + 0.02 }, undefined, 8)
  const g = new THREE.Group(), pole = new THREE.Mesh(bo.xuat({ ao: 0.1 }), matToon())
  const vai = new THREE.Mesh(new Bo().hop(0.62, 0.38, 0.03, '#e5484d', { x: 0.33 }, { duoi: '#a8222a', y0: -0.2, y1: 0.2 }, 0.01).xuat({ ao: 0 }), matVat())
  vai.position.y = cao - 0.28
  g.add(pole, vai)
  g.userData.vai = vai
  return g
}
