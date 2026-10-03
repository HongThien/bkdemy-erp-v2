// ============================================================================
// BỘ DỰNG HÌNH từ khối cơ bản (cầu, trụ, nón, hộp…) → 1 geometry gộp, NƯỚNG màu vào đỉnh.
// Cách làm của Little Habitats (design/nghien-cuu-do-hoa-little-habitats.md §2 #2): không file model, không texture;
// tối dần xuống chân (giả AO) · mặt úp xuống ngả lạnh · thuộc tính aFlex (độ lắc theo gió, tăng theo chiều cao).
// ============================================================================
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

export type Dat = { x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number; sx?: number; sy?: number; sz?: number }
export type Chuyen = { duoi: string | THREE.Color; y0: number; y1: number } // chuyển màu theo độ cao (sau khi đặt)

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3()
const mauTu = (c: string | THREE.Color) => (c instanceof THREE.Color ? c : new THREE.Color(c))

export class Bo {
  private gs: THREE.BufferGeometry[] = []
  them(g: THREE.BufferGeometry, mau: string | THREE.Color, d: Dat = {}, chuyen?: Chuyen) {
    const c = mauTu(mau)
    const geo = g.index ? g.toNonIndexed() : g.clone() // gộp được chỉ khi TẤT CẢ cùng không-index (Polyhedron vốn không index)
    _e.set(d.rx ?? 0, d.ry ?? 0, d.rz ?? 0); _q.setFromEuler(_e)
    _m.compose(_p.set(d.x ?? 0, d.y ?? 0, d.z ?? 0), _q, _s.set(d.sx ?? 1, d.sy ?? 1, d.sz ?? 1))
    geo.applyMatrix4(_m)
    const pos = geo.getAttribute('position'), n = pos.count, col = new Float32Array(n * 3)
    const du = chuyen ? mauTu(chuyen.duoi) : null
    const t = new THREE.Color()
    for (let i = 0; i < n; i++) {
      if (du && chuyen) t.copy(du).lerp(c, Math.min(1, Math.max(0, (pos.getY(i) - chuyen.y0) / (chuyen.y1 - chuyen.y0 || 1))))
      else t.copy(c)
      col[i * 3] = t.r; col[i * 3 + 1] = t.g; col[i * 3 + 2] = t.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    if (geo.getAttribute('uv')) geo.deleteAttribute('uv')
    this.gs.push(geo)
    return this
  }
  cau(r: number, mau: string | THREE.Color, d: Dat = {}, ch?: Chuyen, seg = 14) { return this.them(new THREE.SphereGeometry(r, seg, Math.max(8, seg - 4)), mau, d, ch) }
  tru(rTren: number, rDuoi: number, h: number, mau: string | THREE.Color, d: Dat = {}, ch?: Chuyen, seg = 10) { return this.them(new THREE.CylinderGeometry(rTren, rDuoi, h, seg), mau, d, ch) }
  non(r: number, h: number, mau: string | THREE.Color, d: Dat = {}, ch?: Chuyen, seg = 8) { return this.them(new THREE.ConeGeometry(r, h, seg), mau, d, ch) }
  hop(w: number, h: number, l: number, mau: string | THREE.Color, d: Dat = {}, ch?: Chuyen, bo = 0.08) { return this.them(new RoundedBoxGeometry(w, h, l, 2, bo), mau, d, ch) }
  khoi8(r: number, mau: string | THREE.Color, d: Dat = {}, ch?: Chuyen) { return this.them(new THREE.OctahedronGeometry(r, 0), mau, d, ch) }
  khoi20(r: number, mau: string | THREE.Color, d: Dat = {}, ch?: Chuyen, chiTiet = 0) { return this.them(new THREE.IcosahedronGeometry(r, chiTiet), mau, d, ch) }
  vanh(R: number, r: number, mau: string | THREE.Color, d: Dat = {}, cung = Math.PI * 2, seg = 16) { return this.them(new THREE.TorusGeometry(R, r, 6, seg, cung), mau, d) }
  /** Xuất geometry gộp; `ao` nướng bóng khuất; `flex` thêm aFlex (lắc gió). */
  xuat(op: { ao?: number; flex?: boolean } = {}): THREE.BufferGeometry {
    const g = mergeGeometries(this.gs, false)
    this.gs.forEach((x) => x.dispose())
    this.gs = []
    g.computeBoundingBox()
    const bb = g.boundingBox!, y0 = bb.min.y, h = Math.max(1e-4, bb.max.y - y0)
    const pos = g.getAttribute('position'), nor = g.getAttribute('normal'), col = g.getAttribute('color') as THREE.BufferAttribute
    const sanAo = 1 - (op.ao ?? 0.28), flex = op.flex ? new Float32Array(pos.count) : null
    for (let i = 0; i < pos.count; i++) {
      const k = (pos.getY(i) - y0) / h
      const f = sanAo + (1 - sanAo) * Math.min(1, k / 0.6) // tối dần xuống chân
      let r = col.getX(i) * f, gg = col.getY(i) * f, b = col.getZ(i) * f
      if (nor.getY(i) < -0.3) { r *= 0.72; gg *= 0.78; b *= 0.96 } // mặt úp xuống ngả lạnh
      col.setXYZ(i, r, gg, b)
      if (flex) flex[i] = k * k
    }
    if (flex) g.setAttribute('aFlex', new THREE.BufferAttribute(flex, 1))
    return g
  }
}

/** Ép đáy cầu phẳng (slime, mai rùa…): mọi đỉnh dưới `yMin` bị kéo lên `yMin`. */
export function epDay(g: THREE.BufferGeometry, yMin: number) {
  const p = g.getAttribute('position')
  for (let i = 0; i < p.count; i++) if (p.getY(i) < yMin) p.setY(i, yMin)
  g.computeVertexNormals()
  return g
}

/** Màu lệch nhẹ theo từng bản sao (±sáng, ±ấm/lạnh) — 100 bụi không giống hệt nhau (§2 #6). */
export function lechMau(c: THREE.Color, r: number, out = new THREE.Color()) {
  const s = 1 + (r - 0.5) * 0.14
  return out.setRGB(Math.min(1.4, c.r * s * (1 + (r - 0.5) * 0.07)), Math.min(1.4, c.g * s), Math.min(1.4, c.b * s * (1 - (r - 0.5) * 0.07)))
}
