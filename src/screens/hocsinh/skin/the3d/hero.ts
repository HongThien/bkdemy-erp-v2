// ============================================================================
// HERO chiến đấu (pháp sư nam/nữ) dựng bằng code + hạt hiệu ứng (tia phép, nổ sao, hồi máu).
// Bộ khung giống quái: cùng bộ dựng, cùng vật liệu, nên cả cảnh đấu cùng một "tay vẽ".
// ============================================================================
import * as THREE from 'three'
import { Bo } from './dungHinh'
import { matToon, bongTron } from './vatLieu'
import type { BangMau3D } from './kieuMau'
import { thongSo } from './chatLuong'

export type Hero = {
  goc: THREE.Group
  /** điểm đầu gậy (nơi phát tia phép), toạ độ thế giới */
  dauGay: () => THREE.Vector3
  capNhat: (dt: number, t: number) => void
  /** vung gậy tung phép (giây ≈ 0.55) */
  tungPhep: () => void
  chao: () => void
  phaHuy: () => void
}

export function taoHero(gioi: 'nam' | 'nu', b: BangMau3D): Hero {
  const h = b.hero, ao = gioi === 'nam' ? h.nam : h.nu
  const goc = new THREE.Group(), than = new THREE.Group(); goc.add(than)
  const mt = matToon({ vienSang: '#ffe9c4' })
  const bo = new Bo()
  // áo choàng dài + thắt lưng + vai
  bo.tru(0.26, 0.56, 1.2, ao, { y: 0.66 }, { duoi: new THREE.Color(ao).multiplyScalar(0.62), y0: 0, y1: 1.2 }, 14)
  bo.vanh(0.4, 0.045, h.vien, { y: 0.88, rx: Math.PI / 2 }, Math.PI * 2, 16)
  bo.cau(0.32, ao, { y: 1.22, sy: 0.7 }, undefined, 12)
  bo.tru(0.3, 0.32, 0.05, h.vien, { y: 0.06 }, undefined, 16)
  // mũ phù thuỷ (nữ: thêm tóc búi)
  bo.cau(0.34, h.da, { y: 1.62 }, undefined, 14)
  bo.cau(0.36, h.toc, { y: 1.68, z: -0.07, sy: 0.9 }, undefined, 12)
  bo.non(0.3, 0.5, ao, { y: 2.12, z: -0.02, rx: -0.1 }, { duoi: new THREE.Color(ao).multiplyScalar(0.7), y0: 1.85, y1: 2.35 }, 10)
  bo.tru(0.5, 0.5, 0.05, ao, { y: 1.9 }, undefined, 16)
  bo.khoi8(0.07, h.vien, { y: 1.97, z: 0.43, rx: 0.4 })
  if (gioi === 'nu') for (const s of [-1, 1]) bo.cau(0.13, h.toc, { x: 0.36 * s, y: 1.42, z: -0.05 }, undefined, 8)
  for (const s of [-1, 1]) bo.cau(0.045, '#ff9aa8', { x: 0.19 * s, y: 1.54, z: 0.29, sz: 0.5 }, undefined, 6)
  const mesh = new THREE.Mesh(bo.xuat({ ao: 0.2 }), mt); mesh.castShadow = true
  than.add(mesh)
  // mắt + miệng (không bị đổ bóng, luôn rõ)
  const mat = new Bo()
  for (const s of [-1, 1]) {
    mat.cau(0.05, '#2d2433', { x: 0.13 * s, y: 1.62, z: 0.3, sz: 0.6, sy: 1.2 }, undefined, 8)
    mat.cau(0.018, '#ffffff', { x: 0.13 * s + 0.02, y: 1.64, z: 0.33 }, undefined, 5)
  }
  mat.vanh(0.055, 0.014, '#7a3a3a', { y: 1.5, z: 0.31, rz: Math.PI }, Math.PI, 8)
  than.add(new THREE.Mesh(mat.xuat({ ao: 0 }), new THREE.MeshBasicMaterial({ vertexColors: true })))
  // tay trái tự nhiên + tay phải cầm gậy (pivot ở vai để vung)
  const taiTrai = new THREE.Group(); taiTrai.position.set(-0.36, 1.18, 0)
  taiTrai.add(new THREE.Mesh(new Bo().tru(0.07, 0.085, 0.5, ao, { y: -0.25 }, undefined, 8).cau(0.085, h.da, { y: -0.52 }, undefined, 8).xuat({ ao: 0 }), mt)); than.add(taiTrai)
  const taiPhai = new THREE.Group(); taiPhai.position.set(0.36, 1.18, 0.02)
  const gay = new Bo()
  gay.tru(0.07, 0.085, 0.5, ao, { y: -0.25, z: 0.02 }, undefined, 8).cau(0.085, h.da, { y: -0.5, z: 0.04 }, undefined, 8)
  gay.tru(0.03, 0.035, 1.9, h.gay, { y: -0.45, z: 0.1 }, undefined, 6)
  gay.cau(0.1, h.vien, { y: 0.5, z: 0.1 }, undefined, 8)
  taiPhai.add(new THREE.Mesh(gay.xuat({ ao: 0.1 }), mt))
  const vienPhep = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(h.phep), toneMapped: false }))
  vienPhep.position.set(0, 0.62, 0.1); taiPhai.add(vienPhep)
  const quang = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(h.phep), transparent: true, opacity: 0.28, depthWrite: false, toneMapped: false }))
  quang.position.copy(vienPhep.position); taiPhai.add(quang)
  taiPhai.rotation.z = -0.12
  than.add(taiPhai)
  goc.add(bongTron(0.8))

  let tPhep = 0, tChao = 0
  const dg = new THREE.Vector3()
  return {
    goc,
    dauGay: () => { vienPhep.getWorldPosition(dg); return dg.clone() },
    capNhat(dt, t) {
      than.position.y = Math.sin(t * 2) * 0.025
      than.scale.y = 1 + Math.sin(t * 2) * 0.012
      let rz = -0.12 + Math.sin(t * 1.5) * 0.03, lung = 0, rx = 0
      if (tPhep > 0) {
        tPhep = Math.max(0, tPhep - dt)
        const k = 1 - tPhep / 0.55
        // giơ cao rồi vung về trước
        rz = -0.12 - Math.sin(Math.min(1, k * 1.6) * Math.PI) * 0.9
        rx = -Math.sin(Math.min(1, k * 1.6) * Math.PI) * 1.3
        lung = Math.sin(k * Math.PI) * 0.35
      }
      if (tChao > 0) { tChao = Math.max(0, tChao - dt); taiTrai.rotation.z = Math.sin((1 - tChao / 0.8) * 9) * 0.5 + 2.2 } else taiTrai.rotation.z = 0.08 + Math.sin(t * 1.5) * 0.03
      taiPhai.rotation.z = rz; taiPhai.rotation.x = rx
      than.rotation.x = lung * 0.3
      quang.scale.setScalar(1 + 0.15 * Math.sin(t * 5) + (tPhep > 0 ? 0.8 : 0))
    },
    tungPhep() { tPhep = 0.55 },
    chao() { tChao = 0.8 },
    phaHuy() { mesh.geometry.dispose(); mt.dispose() },
  }
}

// ---------- hạt hiệu ứng (Points, cộng sáng) ----------
export type HatFx = {
  vat: THREE.Points
  /** n hạt bung ra từ `tai` (nổ sao, hồi máu bay lên…) */
  bung: (tai: THREE.Vector3, mau: THREE.ColorRepresentation, n: number, op?: { toc?: number; len?: boolean; to?: number }) => void
  capNhat: (dt: number) => void
  phaHuy: () => void
}
export function taoHatFx(maxGoc = 160): HatFx {
  const max = Math.max(24, Math.round(maxGoc * thongSo().tiLeHat)) // theo mức đồ hoạ (chatLuong.ts)
  const pos = new Float32Array(max * 3), col = new Float32Array(max * 3), base = new Float32Array(max * 3), vel = new Float32Array(max * 3)
  const tuoi = new Float32Array(max).fill(99), song = new Float32Array(max), to = new Float32Array(max), roi = new Float32Array(max)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const c = document.createElement('canvas'); c.width = c.height = 32
  const x = c.getContext('2d')!, gr = x.createRadialGradient(16, 16, 0, 16, 16, 16)
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = gr; x.fillRect(0, 0, 32, 32)
  const mat = new THREE.PointsMaterial({ size: 0.34, map: new THREE.CanvasTexture(c), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, toneMapped: false })
  const vat = new THREE.Points(g, mat); vat.frustumCulled = false
  let cur = 0
  const tmp = new THREE.Color()
  return {
    vat,
    bung(tai, mau, n, op = {}) {
      tmp.set(mau)
      for (let k = 0; k < n; k++) {
        const i = cur++ % max, a = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1, r = Math.sqrt(1 - u * u), sp = (op.toc ?? 4) * (0.4 + Math.random() * 0.8)
        pos[i * 3] = tai.x; pos[i * 3 + 1] = tai.y; pos[i * 3 + 2] = tai.z
        vel[i * 3] = Math.cos(a) * r * sp * (op.len ? 0.25 : 1); vel[i * 3 + 1] = op.len ? 1.2 + Math.random() * 1.8 : u * sp; vel[i * 3 + 2] = Math.sin(a) * r * sp * (op.len ? 0.25 : 1)
        base[i * 3] = tmp.r; base[i * 3 + 1] = tmp.g; base[i * 3 + 2] = tmp.b
        tuoi[i] = 0; song[i] = 0.5 + Math.random() * 0.5; to[i] = op.to ?? 1; roi[i] = op.len ? 0 : 5
      }
    },
    capNhat(dt) {
      for (let i = 0; i < max; i++) {
        if (tuoi[i] >= song[i]) { col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 0; continue }
        tuoi[i] += dt
        const k = Math.max(0, 1 - tuoi[i] / song[i]) * to[i]
        vel[i * 3 + 1] -= roi[i] * dt
        pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt
        col[i * 3] = base[i * 3] * k; col[i * 3 + 1] = base[i * 3 + 1] * k; col[i * 3 + 2] = base[i * 3 + 2] * k
      }
      g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true
    },
    phaHuy() { g.dispose(); mat.map?.dispose(); mat.dispose() },
  }
}
