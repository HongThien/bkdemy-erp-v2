// ============================================================================
// QUÁI VẬT dựng bằng code (không model, không texture). 9 "kế hoạch thân" × bảng màu theo loài ⇒ 16 loài (+4 tên boss của DB).
// Mọi con đi qua cùng bộ dựng (dungHinh.ts) + cùng vật liệu (vatLieu.ts) nên cả đội nhìn "cùng một tay vẽ".
// Hoạt ảnh làm bằng code: thở · trúng đòn (loé + rung) · hồi máu (loé xanh) · ngã (bẹp + mắt chéo) · bóng đen (quái chưa gặp).
// ============================================================================
import * as THREE from 'three'
import { Bo, epDay } from './dungHinh'
import { matToon, matBongDen, bongTron } from './vatLieu'
import { bam } from './hinhHoc'
import type { BangMau3D, MauQuai } from './kieuMau'

import { KE_HOACH, type KeHoach } from './loai'

const MAT_TOI = '#2d2433'
type Phu = { geo: THREE.BufferGeometry; pivot: [number, number, number]; kieu: 'canhPhai' | 'canhTrai' | 'duoi' | 'lac' }
type Dung = { than: THREE.BufferGeometry; mat: THREE.BufferGeometry; phu: Phu[]; cao: number; ban: number; sang?: THREE.BufferGeometry }

function mat2(x: number, y: number, z: number, r: number, k = 1): THREE.BufferGeometry {
  const b = new Bo()
  for (const s of [-1, 1]) {
    b.cau(r, MAT_TOI, { x: x * s, y, z, sz: 0.62 * k, sy: 1.12 }, undefined, 10)
    b.cau(r * 0.36, '#ffffff', { x: x * s + r * 0.32, y: y + r * 0.38, z: z + r * 0.5, sz: 0.6 }, undefined, 6)
  }
  return b.xuat({ ao: 0 })
}
function matX(x: number, y: number, z: number, r: number): THREE.BufferGeometry {
  const b = new Bo()
  for (const s of [-1, 1]) for (const a of [Math.PI / 4, -Math.PI / 4]) b.hop(r * 2.2, r * 0.42, r * 0.42, MAT_TOI, { x: x * s, y, z, rz: a }, undefined, 0.02)
  return b.xuat({ ao: 0 })
}
const sang = (c: string, t = 0.55) => new THREE.Color(c).lerp(new THREE.Color('#ffffff'), t)
const toi = (c: string, t = 0.35) => new THREE.Color(c).lerp(new THREE.Color('#1a1030'), t)

// ---------- 9 kế hoạch thân ----------
function dungSlime(m: MauQuai, loai: string): Dung {
  const b = new Bo(), phu: Phu[] = []
  const ech = loai === 'ech_doc', rong = loai === 'rong_con'
  b.them(epDay(new THREE.SphereGeometry(0.62, 22, 16), -0.36), m.than, { y: 0.48, sx: 1.08, sy: 0.9, sz: 1.08 }, { duoi: m.bung, y0: 0.1, y1: 0.95 })
  b.cau(0.12, sang(m.than, 0.7), { x: -0.26, y: 0.9, z: 0.34, sy: 0.6, sz: 0.7 }, undefined, 8)
  for (const s of [-1, 1]) b.cau(0.085, '#ff9aa8', { x: 0.38 * s, y: 0.38, z: 0.5, sy: 0.6, sz: 0.5 }, undefined, 8)
  b.vanh(0.09, 0.026, MAT_TOI, { y: 0.4, z: 0.64, rz: Math.PI }, Math.PI, 10)
  if (loai === 'slime_la') {
    b.cau(0.17, m.diem, { x: 0.1, y: 1.1, rz: -0.6, sx: 1.4, sy: 0.45, sz: 0.7 }, undefined, 8)
    b.cau(0.15, sang(m.diem, 0.25), { x: -0.1, y: 1.06, rz: 0.7, sx: 1.4, sy: 0.45, sz: 0.7 }, undefined, 8)
  } else if (loai === 'slime_lua' || loai === 'ma_lua') {
    b.non(0.13, 0.46, m.diem, { y: 1.22 }, undefined, 6)
    b.non(0.1, 0.32, sang(m.diem, 0.4), { x: 0.16, y: 1.12, rz: -0.35 }, undefined, 6)
    b.non(0.1, 0.32, sang(m.diem, 0.4), { x: -0.16, y: 1.12, rz: 0.35 }, undefined, 6)
  } else if (ech) {
    for (const s of [-1, 1]) b.cau(0.2, m.than, { x: 0.3 * s, y: 0.98, z: 0.2 }, { duoi: m.bung, y0: 0.7, y1: 1.15 }, 10)
    for (const [x, z] of [[-0.3, -0.1], [0.32, -0.15], [0, -0.35]]) b.cau(0.075, m.diem, { x, y: 0.75, z }, undefined, 6)
  } else if (rong) {
    for (const s of [-1, 1]) b.non(0.1, 0.34, '#e9c77b', { x: 0.28 * s, y: 1.02, rz: -0.35 * s }, undefined, 6)
    b.non(0.13, 0.5, m.bung, { y: 0.32, z: -0.7, rx: -Math.PI / 2 - 0.3 }, undefined, 6)
    for (const s of [-1, 1]) phu.push({ geo: new Bo().cau(0.3, toi(m.than, 0.2), { x: 0.3 * s, y: 0.05, sx: 1.6, sy: 0.12, sz: 1.1 }, undefined, 10).xuat({ ao: 0 }), pivot: [0.5 * s, 0.7, -0.15], kieu: s < 0 ? 'canhTrai' : 'canhPhai' })
  }
  const yMat = ech ? 1.0 : 0.62, zMat = ech ? 0.34 : 0.56
  return { than: b.xuat({ ao: 0.22 }), mat: mat2(0.22, yMat, zMat, 0.1), phu, cao: loai === 'slime_lua' || loai === 'ma_lua' ? 1.45 : 1.3, ban: 0.7 }
}
function dungThu(m: MauQuai, loai: string): Dung {
  const b = new Bo(), tho = loai === 'tho_gio'
  b.cau(0.55, m.than, { y: 0.52, sx: 1, sy: 0.92, sz: 1.1 }, { duoi: m.bung, y0: 0.1, y1: 0.9 })
  b.cau(0.44, m.than, { y: 1.0, z: 0.3 })
  b.cau(0.19, sang(m.than, 0.55), { y: 0.9, z: 0.68, sy: 0.7 }, undefined, 8)
  b.cau(0.05, '#ff8fa8', { y: 0.95, z: 0.86 }, undefined, 6)
  for (const s of [-1, 1]) {
    if (tho) { b.tru(0.1, 0.1, 0.6, m.than, { x: 0.2 * s, y: 1.6, z: 0.22, rz: -0.16 * s }, undefined, 8); b.cau(0.1, m.diem, { x: 0.2 * s, y: 1.63, z: 0.3, rz: -0.16 * s, sy: 2.4, sz: 0.5 }, undefined, 6) }
    else { b.non(0.15, 0.38, m.than, { x: 0.27 * s, y: 1.42, z: 0.26, rz: -0.35 * s }, undefined, 6); b.non(0.08, 0.24, m.diem, { x: 0.27 * s, y: 1.4, z: 0.3, rz: -0.35 * s }, undefined, 6) }
    for (const z of [-0.4, 0.4]) b.cau(0.14, m.bung, { x: 0.3 * s, y: 0.13, z, sy: 0.9 }, undefined, 8)
  }
  const phu: Phu[] = [{ geo: new Bo().cau(tho ? 0.2 : 0.14, tho ? '#ffffff' : m.than, { y: 0, z: 0, sz: tho ? 1 : 2.2 }, undefined, 8).xuat({ ao: 0 }), pivot: [0, 0.6, -0.68], kieu: 'duoi' }]
  return { than: b.xuat({ ao: 0.22 }), mat: mat2(0.17, 1.07, 0.68, 0.085), phu, cao: tho ? 2.0 : 1.7, ban: 0.75 }
}
function dungRua(m: MauQuai, loai: string): Dung {
  const b = new Bo()
  b.them(epDay(new THREE.SphereGeometry(0.66, 20, 14), -0.06), m.than, { y: 0.5, sx: 1.05, sy: 0.78, sz: 1.12 }, { duoi: m.bung, y0: 0.2, y1: 1 })
  for (const [x, z] of [[0, 0], [0.34, 0.1], [-0.34, 0.1], [0.2, -0.36], [-0.2, -0.36]]) b.cau(0.17, m.bung, { x, y: 0.86 - (x * x + z * z) * 0.4, z, sy: 0.55 }, undefined, 6)
  b.cau(0.3, sang(m.diem, 0.2), { y: 0.5, z: 0.78 })
  for (const s of [-1, 1]) for (const z of [-0.4, 0.42]) b.cau(0.15, sang(m.diem, 0.1), { x: 0.5 * s, y: 0.14, z, sy: 0.8 }, undefined, 8)
  if (loai === 'bo_giap') b.non(0.07, 0.3, m.diem, { y: 0.84, z: 0.82, rx: 0.4 }, undefined, 6)
  return { than: b.xuat({ ao: 0.24 }), mat: mat2(0.15, 0.58, 0.97, 0.075), phu: [{ geo: new Bo().non(0.09, 0.3, m.diem, { rx: -Math.PI / 2 }, undefined, 6).xuat({ ao: 0 }), pivot: [0, 0.3, -0.7], kieu: 'duoi' }], cao: 1.15, ban: 0.8 }
}
function dungChim(m: MauQuai, loai: string): Dung {
  const b = new Bo(), phu: Phu[] = [], set = loai === 'chim_set' || loai === 'phuong_hoang'
  b.cau(0.58, m.than, { y: 0.66, sy: 1.05 }, { duoi: m.bung, y0: 0.1, y1: 1.1 })
  b.cau(0.4, sang(m.than, 0.5), { y: 0.55, z: 0.3, sy: 1.1 }, undefined, 10)
  b.non(0.1, 0.22, '#ffb347', { y: 0.72, z: 0.64, rx: Math.PI / 2 }, undefined, 6)
  for (const s of [-1, 1]) { b.cau(0.19, sang('#fff3d0', 0.2), { x: 0.22 * s, y: 0.84, z: 0.46, sz: 0.5 }, undefined, 10); b.non(0.05, 0.14, '#ffb347', { x: 0.14 * s, y: 0.04, z: 0.08, rx: Math.PI / 2 }, undefined, 5) }
  if (set) { for (let i = 0; i < 3; i++) b.khoi8(0.1 + (2 - i) * 0.02, m.diem, { x: (i % 2 ? 0.08 : -0.08), y: 1.28 + i * 0.16, rz: 0.4 }) }
  else for (const s of [-1, 1]) b.non(0.1, 0.3, m.bung, { x: 0.3 * s, y: 1.27, rz: -0.4 * s }, undefined, 5)
  for (const s of [-1, 1]) phu.push({ geo: new Bo().cau(0.3, toi(m.than, 0.15), { x: 0.2 * s, y: 0, rz: -0.25 * s, sx: 0.5, sy: 1.15, sz: 0.85 }, undefined, 10).xuat({ ao: 0 }), pivot: [0.5 * s, 0.7, 0], kieu: s < 0 ? 'canhTrai' : 'canhPhai' })
  return { than: b.xuat({ ao: 0.22 }), mat: mat2(0.22, 0.84, 0.55, 0.14), phu, cao: set ? 1.75 : 1.45, ban: 0.7 }
}
function dungCa(m: MauQuai): Dung {
  const b = new Bo()
  b.cau(0.6, m.than, { y: 0.85, sx: 0.78, sy: 0.82, sz: 1.05 }, { duoi: m.bung, y0: 0.3, y1: 1.3 })
  b.non(0.2, 0.5, m.than, { y: 1.4, z: -0.05, rx: 0.15 }, undefined, 5)
  for (const s of [-1, 1]) b.cau(0.2, sang(m.than, 0.2), { x: 0.5 * s, y: 0.78, z: 0.1, sx: 0.4, sy: 0.9, sz: 1 }, undefined, 8)
  b.cau(0.08, '#ff8fa8', { y: 0.7, z: 0.62, sy: 0.5 }, undefined, 6)
  return { than: b.xuat({ ao: 0.2 }), mat: mat2(0.26, 0.98, 0.5, 0.13), phu: [{ geo: new Bo().non(0.3, 0.6, m.diem, { rx: Math.PI / 2 + 0.1, sz: 0.4 }, undefined, 5).xuat({ ao: 0 }), pivot: [0, 0.85, -0.66], kieu: 'duoi' }], cao: 1.8, ban: 0.65 }
}
function dungSao(m: MauQuai): Dung {
  const b = new Bo()
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 2
    b.non(0.24, 0.7, m.than, { x: Math.cos(a) * 0.5, y: 0.9 + Math.sin(a) * 0.5, z: 0, rz: a - Math.PI / 2, sz: 0.7 }, { duoi: m.bung, y0: 0.2, y1: 1.5 }, 6)
  }
  b.cau(0.46, m.than, { y: 0.9, sz: 0.75 }, undefined, 14)
  for (const [x, y] of [[-0.3, 0.7], [0.3, 0.7], [0, 1.3], [0.45, 0.95]]) b.cau(0.05, m.diem, { x, y, z: 0.32 }, undefined, 5)
  return { than: b.xuat({ ao: 0.15 }), mat: mat2(0.16, 0.98, 0.32, 0.09), phu: [], cao: 1.65, ban: 0.55 }
}
function dungNam(m: MauQuai): Dung {
  const b = new Bo()
  b.tru(0.26, 0.34, 0.66, m.bung, { y: 0.34 }, { duoi: toi(m.bung, 0.2), y0: 0, y1: 0.6 }, 12)
  b.them(new THREE.SphereGeometry(0.72, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), m.than, { y: 0.62, sy: 0.82 }, { duoi: toi(m.than, 0.25), y0: 0.5, y1: 1.2 })
  b.tru(0.7, 0.7, 0.04, sang(m.bung, 0.2), { y: 0.62 }, undefined, 16)
  for (const [x, y, z, r] of [[-0.3, 1.0, 0.32, 0.13], [0.34, 1.05, 0.12, 0.11], [0.02, 1.19, -0.04, 0.12], [-0.12, 1.05, -0.36, 0.1], [0.44, 0.82, -0.3, 0.1]]) b.cau(r, m.diem, { x, y, z, sy: 0.5 }, undefined, 8)
  b.vanh(0.07, 0.022, MAT_TOI, { y: 0.28, z: 0.3, rz: Math.PI }, Math.PI, 8)
  return { than: b.xuat({ ao: 0.2 }), mat: mat2(0.11, 0.38, 0.27, 0.075), phu: [], cao: 1.3, ban: 0.75 }
}
function dungGolem(m: MauQuai, loai: string): Dung {
  const b = new Bo(), pl = loai === 'golem_pha_le'
  b.hop(1.0, 0.95, 0.76, m.than, { y: 0.78 }, { duoi: m.bung, y0: 0.2, y1: 1.2 }, 0.14)
  b.hop(0.66, 0.54, 0.6, sang(m.than, 0.12), { y: 1.5, z: 0.04 }, undefined, 0.12)
  for (const s of [-1, 1]) { b.hop(0.3, 0.75, 0.32, m.than, { x: 0.72 * s, y: 0.8, rz: -0.12 * s }, { duoi: m.bung, y0: 0.4, y1: 1.2 }, 0.1); b.hop(0.36, 0.34, 0.38, m.bung, { x: 0.27 * s, y: 0.17 }, undefined, 0.08) }
  b.cau(0.2, m.diem, { y: 0.9, z: 0.38, sz: 0.3, sy: 1.2 }, undefined, 8)
  if (pl) for (const s of [-1, 1]) { b.khoi8(0.26, m.diem, { x: 0.46 * s, y: 1.45, rz: 0.4 * s, sy: 1.8 }); b.khoi8(0.18, '#ffffff', { x: 0.62 * s, y: 1.3, rz: 0.6 * s, sy: 1.6 }) }
  else b.cau(0.25, sang(m.bung, 0.1), { x: -0.25, y: 1.82, sy: 0.4 }, undefined, 6)
  const g = new Bo()
  for (const s of [-1, 1]) g.hop(0.17, 0.07, 0.04, m.diem, { x: 0.15 * s, y: 1.55, z: 0.36 }, undefined, 0.02)
  return { than: b.xuat({ ao: 0.2 }), mat: g.xuat({ ao: 0 }), phu: [], cao: 1.95, ban: 0.8 }
}
function dungCon(m: MauQuai): Dung {
  const b = new Bo(), phu: Phu[] = []
  b.cau(0.44, m.than, { y: 0.85, sy: 0.95, sz: 1.15 }, { duoi: m.bung, y0: 0.4, y1: 1.2 })
  b.cau(0.32, sang(m.than, 0.2), { y: 1.0, z: 0.38 })
  for (const s of [-1, 1]) { b.tru(0.02, 0.02, 0.36, '#6b5a40', { x: 0.1 * s, y: 1.4, z: 0.4, rz: -0.35 * s }, undefined, 4); b.cau(0.045, m.diem, { x: 0.18 * s, y: 1.58, z: 0.42 }, undefined, 5) }
  for (const s of [-1, 1]) phu.push({ geo: new Bo().cau(0.3, sang('#dfefff', 0.2), { x: 0.2 * s, rz: -0.3 * s, sx: 0.85, sy: 0.08, sz: 0.5 }, undefined, 8).xuat({ ao: 0 }), pivot: [0.25 * s, 1.2, -0.05], kieu: s < 0 ? 'canhTrai' : 'canhPhai' })
  const sangG = new Bo().cau(0.3, m.diem, { y: 0.78, z: -0.52 }, undefined, 10).xuat({ ao: 0 })
  return { than: b.xuat({ ao: 0.18 }), mat: mat2(0.12, 1.06, 0.6, 0.08), phu, cao: 1.6, ban: 0.55, sang: sangG }
}
const DUNG: Record<KeHoach, (m: MauQuai, loai: string) => Dung> = {
  slime: dungSlime, thu: dungThu, rua: dungRua, chim: dungChim, ca: (m) => dungCa(m), sao: (m) => dungSao(m), nam: (m) => dungNam(m), golem: dungGolem, con: (m) => dungCon(m),
}

// ---------- đối tượng quái + hoạt ảnh ----------
export type Quai = {
  goc: THREE.Group
  loai: string
  /** độ cao đỉnh đầu (để đặt vương miện / nhãn) */
  cao: number
  ban: number
  capNhat: (dt: number, t: number) => void
  trung: () => void
  hoi: () => void
  nga: () => void
  dung: () => void
  bong: (on: boolean) => void
  daNga: () => boolean
  phaHuy: () => void
  /** boss riêng có hào quang sẵn trong hình ⇒ cảnh không đội thêm vương miện */
  khongVuongMien?: boolean
}

export function taoQuai(loai: string, b: BangMau3D): Quai {
  const kh = KE_HOACH[loai] ?? 'slime'
  const m = b.quai[loai] ?? b.quai.slime_la
  const d = DUNG[kh](m, loai)
  const goc = new THREE.Group(), than = new THREE.Group()
  goc.add(than)
  const mt = matToon({ vienSang: sang(m.than, 0.6) })
  const mesh = new THREE.Mesh(d.than, mt); mesh.castShadow = true
  than.add(mesh)
  const matMesh = new THREE.Mesh(d.mat, new THREE.MeshBasicMaterial({ vertexColors: true })); than.add(matMesh)
  const mx = new THREE.Mesh(matX(0.22, d.cao * 0.5, 0.5, 0.1), new THREE.MeshBasicMaterial({ vertexColors: true })); mx.visible = false; than.add(mx)
  const phuMesh: { g: THREE.Group; kieu: Phu['kieu'] }[] = []
  for (const p of d.phu) {
    const g = new THREE.Group(); g.position.set(...p.pivot)
    g.add(new THREE.Mesh(p.geo, mt)); than.add(g); phuMesh.push({ g, kieu: p.kieu })
  }
  let sangMesh: THREE.Mesh | null = null
  if (d.sang) { sangMesh = new THREE.Mesh(d.sang, new THREE.MeshBasicMaterial({ vertexColors: true })); than.add(sangMesh) }
  const bg = bongTron(d.ban * 1.15); goc.add(bg)

  const meshes: THREE.Mesh[] = []
  than.traverse((o) => { if ((o as THREE.Mesh).isMesh && o !== mx && o !== matMesh) meshes.push(o as THREE.Mesh) })
  const matGoc = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>()
  const matBd = matBongDen(b.troi)
  const pha = (bam(loai) % 628) / 100
  let tHit = 0, tHoi = 0, chet = 0, daNga = false, bong = false
  const nhay = kh === 'thu' || kh === 'slime'

  return {
    goc, loai, cao: d.cao, ban: d.ban,
    capNhat(dt, t) {
      if (daNga) {
        chet = Math.min(1, chet + dt * 3.2)
        const k = 1 - Math.pow(1 - chet, 3)
        than.scale.set(1 + 0.16 * k, 1 - 0.7 * k, 1 + 0.16 * k)
      } else {
        const w = t * 2.2 + pha, hop = nhay ? Math.max(0, Math.sin(w)) : 0
        than.scale.set(1 - 0.03 * Math.sin(w * 2) * (nhay ? 1.5 : 1), 1 + 0.035 * Math.sin(w * 2) * (nhay ? 1.5 : 1), 1 - 0.03 * Math.sin(w * 2) * (nhay ? 1.5 : 1))
        than.position.y = kh === 'ca' || kh === 'con' || kh === 'sao' ? 0.25 + Math.sin(w) * 0.1 : hop * 0.08
        than.rotation.y = kh === 'sao' ? Math.sin(w * 0.5) * 0.25 : 0
      }
      for (const p of phuMesh) {
        const f = Math.sin(t * (kh === 'chim' || kh === 'con' ? 9 : 4) + pha)
        if (p.kieu === 'canhPhai') p.g.rotation.z = -(0.2 + 0.45 * f) * (daNga ? 0.1 : 1)
        else if (p.kieu === 'canhTrai') p.g.rotation.z = 0.2 + 0.45 * f
        else p.g.rotation.y = Math.sin(t * 3 + pha) * 0.5
      }
      if (sangMesh) sangMesh.scale.setScalar(1 + 0.15 * Math.sin(t * 4 + pha))
      if (tHit > 0) {
        tHit = Math.max(0, tHit - dt)
        const k = tHit / 0.42
        than.position.x = Math.sin(k * 26) * 0.12 * k
        mt.emissive.setRGB(k * 0.9, k * 0.9, k * 0.9)
      } else if (tHoi > 0) {
        tHoi = Math.max(0, tHoi - dt)
        const k = tHoi / 0.6
        mt.emissive.setRGB(0.05 * k, 0.6 * k, 0.25 * k)
        than.scale.multiplyScalar(1 + 0.08 * k)
      } else { than.position.x = 0; mt.emissive.setRGB(0, 0, 0) }
      mx.visible = daNga && !bong
      matMesh.visible = !daNga && !bong
    },
    trung() { tHit = 0.42 },
    hoi() { tHoi = 0.6 },
    nga() { if (!daNga) { daNga = true; chet = 0 } },
    dung() { daNga = false; chet = 0; than.scale.set(1, 1, 1); than.position.y = 0 },
    daNga: () => daNga,
    bong(on) {
      if (on === bong) return
      bong = on
      for (const ms of meshes) {
        if (on) { matGoc.set(ms, ms.material); ms.material = matBd } else { const g = matGoc.get(ms); if (g) ms.material = g }
      }
      matMesh.visible = !on; bg.visible = !on
    },
    phaHuy() { d.than.dispose(); d.mat.dispose(); matBd.dispose(); mt.dispose(); d.phu.forEach((p) => p.geo.dispose()) },
  }
}

/** Vương miện vàng đội lên đầu BẤT KỲ quái nào (boss cuối). */
export function taoVuongMien(b: BangMau3D, r = 0.34): THREE.Group {
  const bo = new Bo()
  bo.tru(r * 0.95, r, r * 0.38, b.vang, { y: 0.06 }, undefined, 14)
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    bo.non(r * 0.2, r * 0.62, b.vang, { x: Math.cos(a) * r * 0.82, y: r * 0.5, z: Math.sin(a) * r * 0.82 }, undefined, 4)
    bo.cau(r * 0.12, '#ffffff', { x: Math.cos(a) * r * 0.82, y: r * 0.84, z: Math.sin(a) * r * 0.82 }, undefined, 6)
  }
  bo.khoi8(r * 0.2, '#ff7a9a', { x: 0, y: 0.08, z: r * 1.0 })
  const g = new THREE.Group()
  const mesh = new THREE.Mesh(bo.xuat({ ao: 0.15 }), matToon({ vienSang: '#fff2c0' }))
  mesh.castShadow = true
  g.add(mesh)
  return g
}
