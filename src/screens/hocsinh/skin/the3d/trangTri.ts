// ============================================================================
// TRANG TRÍ: cây, núi, đá, nấm… dựng bằng code theo bảng màu vùng, rải bằng InstancedMesh (hàng trăm vật = vài lần vẽ).
// Mỗi bản sao lệch màu ±7% sáng, ±3,5% ấm/lạnh và lắc theo gió (aFlex) — 100 bụi không giống hệt nhau (nghien-cuu-do-hoa-little-habitats.md §2).
// ============================================================================
import * as THREE from 'three'
import { Bo, lechMau } from './dungHinh'
import { rng } from './hinhHoc'
import type { MauBiome } from './kieuMau'

export type LoaiTT = 'cayTron' | 'cayThong' | 'nui' | 'nuiLua' | 'da' | 'nam' | 'cayDua' | 'xuongRong' | 'phaLe' | 'cot' | 'lau' | 'bui' | 'cayKho'

const sang = (c: string, t: number) => new THREE.Color(c).lerp(new THREE.Color('#ffffff'), t)
const toi = (c: string, t: number) => new THREE.Color(c).lerp(new THREE.Color('#1a1030'), t)

export function hinhTT(loai: LoaiTT, m: MauBiome): THREE.BufferGeometry {
  const b = new Bo(); let flex = true
  switch (loai) {
    case 'cayTron':
      b.tru(0.07, 0.11, 0.55, m.than, { y: 0.27 }, undefined, 6)
      b.cau(0.44, m.cay, { y: 0.9, sy: 0.92 }, { duoi: toi(m.cay, 0.25), y0: 0.5, y1: 1.3 }, 10)
      b.cau(0.3, m.cay2, { x: 0.24, y: 1.05, z: 0.1 }, undefined, 8); b.cau(0.28, m.cay2, { x: -0.22, y: 0.98, z: -0.12 }, undefined, 8)
      break
    case 'cayThong':
      b.tru(0.06, 0.09, 0.4, m.than, { y: 0.2 }, undefined, 6)
      b.non(0.52, 0.75, m.cay, { y: 0.72 }, { duoi: toi(m.cay, 0.3), y0: 0.3, y1: 1.1 }, 7)
      b.non(0.42, 0.65, m.cay2, { y: 1.12 }, undefined, 7); b.non(0.3, 0.55, sang(m.cay2, 0.25), { y: 1.5 }, undefined, 7)
      break
    case 'nui':
      b.khoi20(1, m.nui, { y: 0.9, sx: 0.95, sy: 1.35, sz: 0.95 }, { duoi: m.dat2, y0: 0, y1: 2 }, 1)
      b.non(0.5, 0.8, '#f4f8ff', { y: 1.9 }, undefined, 7)
      flex = false
      break
    case 'nuiLua':
      b.non(1.0, 1.7, m.nui, { y: 0.85 }, { duoi: m.dat2, y0: 0, y1: 1.8 }, 8)
      b.tru(0.28, 0.4, 0.2, toi(m.nui, 0.4), { y: 1.65 }, undefined, 8)
      b.cau(0.26, m.diem, { y: 1.75, sy: 0.5 }, undefined, 8)
      b.non(0.12, 0.5, m.diem, { y: 2.05 }, undefined, 5)
      flex = false
      break
    case 'da':
      b.khoi20(0.4, m.nui, { y: 0.22, sy: 0.75 }, { duoi: toi(m.nui, 0.2), y0: 0, y1: 0.6 }); b.khoi20(0.26, sang(m.nui, 0.12), { x: 0.4, y: 0.14, z: 0.12, sy: 0.8 })
      b.khoi20(0.2, toi(m.nui, 0.1), { x: -0.32, y: 0.11, z: -0.2 })
      flex = false
      break
    case 'nam':
      b.tru(0.1, 0.14, 0.5, '#f4e3c1', { y: 0.25 }, undefined, 8)
      b.them(new THREE.SphereGeometry(0.46, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), m.cay2, { y: 0.48, sy: 0.82 }, { duoi: toi(m.cay2, 0.2), y0: 0.4, y1: 0.9 })
      for (const [x, z] of [[-0.18, 0.12], [0.2, 0.0], [0, -0.22]]) b.cau(0.07, m.diem, { x, y: 0.78, z, sy: 0.5 }, undefined, 6)
      break
    case 'cayDua':
      b.tru(0.05, 0.09, 1.0, m.than, { y: 0.5, rz: 0.12 }, undefined, 6)
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; b.cau(0.34, i % 2 ? m.cay2 : m.cay, { x: 0.12 + Math.cos(a) * 0.3, y: 1.0, z: Math.sin(a) * 0.3, rz: -Math.cos(a) * 0.5, rx: Math.sin(a) * 0.5, sx: 1.1, sy: 0.16, sz: 0.5 }, undefined, 6) }
      break
    case 'xuongRong':
      b.tru(0.14, 0.17, 0.85, m.cay, { y: 0.42 }, { duoi: toi(m.cay, 0.2), y0: 0, y1: 0.8 }, 8); b.cau(0.14, m.cay, { y: 0.85 }, undefined, 8)
      for (const s of [-1, 1]) { b.tru(0.07, 0.08, 0.3, m.cay, { x: 0.24 * s, y: 0.5, rz: 0 }, undefined, 6); b.tru(0.07, 0.07, 0.3, m.cay, { x: 0.2 * s, y: 0.38 }, undefined, 6); b.cau(0.07, m.cay, { x: 0.24 * s, y: 0.66 }, undefined, 6) }
      break
    case 'phaLe':
      for (const [x, z, h, r] of [[0, 0, 1.1, 0.2], [0.28, 0.1, 0.7, 0.15], [-0.25, -0.1, 0.8, 0.16], [0.05, -0.3, 0.5, 0.12]]) b.khoi8(r, m.diem, { x, y: h / 2, z, sy: h / r / 1.2, rz: x * 0.6 }, { duoi: toi(m.diem, 0.3), y0: 0, y1: h })
      flex = false
      break
    case 'cot':
      b.hop(0.4, 0.2, 0.4, m.nui, { y: 0.1 }, undefined, 0.03); b.hop(0.28, 0.9, 0.28, sang(m.nui, 0.1), { y: 0.65 }, { duoi: toi(m.nui, 0.2), y0: 0.2, y1: 1.1 }, 0.03)
      b.hop(0.38, 0.14, 0.38, m.nui, { y: 1.18, rz: 0.1 }, undefined, 0.03)
      flex = false
      break
    case 'lau':
      for (let i = 0; i < 5; i++) b.non(0.05, 0.7 + (i % 3) * 0.2, m.cay, { x: (i - 2) * 0.1, y: 0.4, z: (i % 2 - 0.5) * 0.12, rz: (i - 2) * 0.08 }, { duoi: toi(m.cay, 0.3), y0: 0, y1: 1 }, 4)
      b.cau(0.06, m.diem, { x: 0.1, y: 0.82 }, undefined, 5)
      break
    case 'bui':
      b.cau(0.3, m.cay, { y: 0.24, sy: 0.75 }, { duoi: toi(m.cay, 0.25), y0: 0, y1: 0.5 }, 8); b.cau(0.22, m.cay2, { x: 0.22, y: 0.2, sy: 0.75 }, undefined, 7)
      b.cau(0.05, m.diem, { x: -0.08, y: 0.4, z: 0.2 }, undefined, 5)
      break
    case 'cayKho':
      b.tru(0.05, 0.1, 0.9, m.than, { y: 0.45 }, undefined, 5)
      for (const s of [-1, 1]) b.tru(0.025, 0.04, 0.5, m.than, { x: 0.18 * s, y: 0.75, rz: -0.7 * s }, undefined, 4)
      break
  }
  return b.xuat({ flex })
}

/** Tỉ lệ loại trang trí theo vùng đất. */
export const TRON_BIOME: Record<string, [LoaiTT, number][]> = {
  rung: [['cayTron', 0.42], ['cayThong', 0.28], ['nam', 0.14], ['da', 0.08], ['bui', 0.08]],
  bang: [['cayThong', 0.34], ['phaLe', 0.26], ['da', 0.18], ['nui', 0.14], ['bui', 0.08]],
  nui_lua: [['nuiLua', 0.18], ['da', 0.42], ['cayKho', 0.22], ['phaLe', 0.18]],
  bien_dao: [['cayDua', 0.46], ['bui', 0.3], ['da', 0.14], ['cayTron', 0.1]],
  sa_mac: [['xuongRong', 0.46], ['da', 0.3], ['nui', 0.12], ['cayKho', 0.12]],
  dam_lay: [['lau', 0.4], ['cayTron', 0.28], ['nam', 0.16], ['da', 0.16]],
  thanh_co: [['cot', 0.34], ['da', 0.24], ['cayThong', 0.2], ['bui', 0.22]],
  troi_sao: [['phaLe', 0.5], ['cayTron', 0.26], ['da', 0.14], ['bui', 0.1]],
}

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _e = new THREE.Euler(), _c = new THREE.Color()
/** Rải trang trí lên các điểm đã chọn. `cao` cho độ cao đất; `tyLe` thu phóng toàn bộ (thế giới nhỏ hơn lục địa). */
export function raiTrangTri(p: { biome: string; mau: MauBiome; diem: [number, number][]; cao: (x: number, z: number) => number; seed: number; tyLe?: number; mat: THREE.Material }): THREE.Group {
  const R = rng(p.seed), g = new THREE.Group(), tron = TRON_BIOME[p.biome] ?? TRON_BIOME.rung
  const theo = new Map<LoaiTT, [number, number][]>()
  for (const d of p.diem) {
    let r = R(), loai = tron[0][0]
    for (const [l, w] of tron) { if (r < w) { loai = l; break } r -= w }
    if (!theo.has(loai)) theo.set(loai, [])
    theo.get(loai)!.push(d)
  }
  const ty = p.tyLe ?? 1
  for (const [loai, ds] of theo) {
    const im = new THREE.InstancedMesh(hinhTT(loai, p.mau), p.mat, ds.length)
    ds.forEach(([x, z], i) => {
      const lon = (loai === 'nui' || loai === 'nuiLua' ? 0.9 + R() * 0.9 : 0.75 + R() * 0.6) * ty
      _e.set(0, R() * Math.PI * 2, 0); _q.setFromEuler(_e)
      _m.compose(_p.set(x, p.cao(x, z) - 0.04, z), _q, _s.set(lon, lon * (0.9 + R() * 0.3), lon))
      im.setMatrixAt(i, _m); im.setColorAt(i, lechMau(_c.set('#ffffff'), R()))
    })
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true
    im.frustumCulled = false
    g.add(im)
  }
  return g
}
