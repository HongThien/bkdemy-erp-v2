// ============================================================================
// TẦNG 2 — LỤC ĐỊA: 1 vùng đất chia thành các VÙNG giáp biên giới như các quốc gia. Vùng = chuyên đề, to nhỏ theo số dạng.
// Mỗi vùng là 1 mesh riêng (nâng lên + sáng viền khi trỏ vào). Biên giới = vệt tối + gờ nhô nhẹ do Voronoi có trọng số + gợn sóng.
// ============================================================================
import * as THREE from 'three'
import { taoSanKhau, type SanKhau } from './sanKhau'
import { blob, sdf, hopBao, fbm, smooth, lerp, bam, rng, hatVung, vungTai } from './hinhHoc'
import { xayLuoi, taoNuoc, taoMay, taoCo, type May } from './diaHinh'
import { raiTrangTri } from './trangTri'
import { matVat, TOAN_CUC } from './vatLieu'
import { sinhQuai, type Quai } from './nguonQuai'
import { taoVuongMien } from './quai'
import type { BangMau3D } from './kieuMau'

export type VungVao = { ma: string; ten: string; soDang: number; trangThai: 'dat' | 'yeu' | 'fog'; loai: string | null; khoi?: boolean }
export type CanhLucDia = {
  sk: SanKhau
  neo: Map<string, THREE.Vector3>
  hover: (ma: string | null) => void
  phaHuy: () => void
}

export function dungLucDia(host: HTMLElement, b: BangMau3D, luc: { ma: string; biome: string }, vungs: VungVao[], cb: { chon: (ma: string) => void; hover: (ma: string | null) => void }): CanhLucDia {
  const sk = taoSanKhau(host)
  const { scene } = sk
  sk.datNen(b, [58, 130], [0.95, 2.6]); sk.datDen(b)
  const seed = bam(luc.ma), m = b.biome[luc.biome] ?? b.biome.rung
  const R = 9.4, poly = blob(0, 0, R, seed + 7, { n: 34, go: 0.2, sx: 1.22, sz: 0.94 }), bb = hopBao(poly)
  const hat = hatVung(vungs.map((v) => Math.max(1, v.soDang)), 0, 0, R)
  const dat = new THREE.Color(m.dat), dat2 = new THREE.Color(m.dat2), nui = new THREE.Color(m.nui), cat = new THREE.Color(b.cat), vang = new THREE.Color(b.vang)
  const suongC = new THREE.Color('#b4bddf'), nuocTrong = new THREE.Color(b.nuocNong)
  // mỗi vùng 1 sắc riêng cùng họ với vùng đất: lệch hue + sáng tối nhẹ
  // mỗi vùng 1 SẮC khác rõ (xoay hue ~40°/vùng + sáng tối xen kẽ) để nhìn là biết vùng nào ra vùng nào
  const tong = vungs.map((_, i) => { const c = dat.clone(), hsl = { h: 0, s: 0, l: 0 }; c.getHSL(hsl); return c.setHSL((hsl.h + i * 0.11 + 1) % 1, Math.min(0.75, hsl.s * 1.12), Math.min(0.7, Math.max(0.3, hsl.l * (0.95 + (i % 2) * 0.16)))) })
  const tmp = new THREE.Color()
  const amp = vungs.map((_, i) => (luc.biome === 'nui_lua' || luc.biome === 'bang' ? 1.2 : 0.5) * (0.4 + ((bam(luc.ma + i) % 100) / 100) * 0.9))

  const trongVung = (x: number, z: number) => {
    const s = sdf(x, z, poly)
    if (s < -0.7) return { s, id: -1, le: 9 }
    const v = vungTai(x, z, hat, seed)
    return { s, id: v.id, le: v.le }
  }
  const kh = { x0: bb.x0 - 4, z0: bb.z0 - 4, x1: bb.x1 + 4, z1: bb.z1 + 4 }
  const luoi = xayLuoi(kh, 0.26, (x, z) => {
    const { s, id, le } = trongVung(x, z)
    if (id < 0) return { h: -1.4, r: nuocTrong.r, g: nuocTrong.g, b: nuocTrong.b, id: -1 }
    const land = smooth(-0.7, 0.8, s), inland = smooth(0.8, 3.4, s), n = fbm(x * 0.3, z * 0.3, seed + id, 3), rid = 1 - Math.abs(fbm(x * 0.17 + 7, z * 0.17, seed + id * 5, 3) * 2 - 1)
    const bien = 1 - smooth(0, 2.8, le)
    const h = lerp(-0.7, 0.55, land) + inland * (0.28 * n + 1.0 * amp[id] * rid * rid) + bien * 0.16 * land
    tmp.copy(tong[id]).lerp(dat2, smooth(0.3, 0.8, n) * 0.55).lerp(nui, smooth(1.0, 1.9, h) * 0.8)
    tmp.lerp(cat, 1 - smooth(-0.15, 0.45, s))
    const vg = vungs[id]
    if (vg.trangThai === 'fog') tmp.lerp(suongC, 0.5); else if (vg.trangThai === 'dat') tmp.lerp(vang, 0.2)
    tmp.multiplyScalar(1 - bien * 0.7 * land) // biên giới: vệt tối
    const sh = 0.92 + 0.16 * fbm(x * 1.2, z * 1.2, seed + 3, 2)
    return { h, r: tmp.r * sh, g: tmp.g * sh, b: tmp.b * sh, id }
  })
  const luiVung: { mesh: THREE.Mesh; mat: THREE.MeshLambertMaterial; i: number; g: THREE.Group }[] = []
  const matCay = matVat({ gio: true })
  vungs.forEach((_, i) => {
    const g = luoi.hinh.get(i); if (!g) return
    const mat = matVat(), mesh = new THREE.Mesh(g, mat), gg = new THREE.Group(); scene.add(mesh, gg)
    luiVung.push({ mesh, mat, i, g: gg })
  })

  const nuoc = taoNuoc(b, kh, (x, z) => sdf(x, z, poly), TOAN_CUC.uTime)
  scene.add(nuoc.mesh)

  // tâm từng vùng (để đặt dấu hiệu + nhãn): trung bình các điểm đất của vùng
  const tam = vungs.map(() => ({ x: 0, z: 0, n: 0 }))
  for (let x = bb.x0; x <= bb.x1; x += 0.5) for (let z = bb.z0; z <= bb.z1; z += 0.5) {
    const t = trongVung(x, z)
    if (t.id >= 0 && t.s > 0.8) { tam[t.id].x += x; tam[t.id].z += z; tam[t.id].n++ }
  }
  const neo = new Map<string, THREE.Vector3>(), mays: May[] = [], quais: Quai[] = [], cos: THREE.Group[] = [], mieng: THREE.Object3D[] = []
  vungs.forEach((vg, i) => {
    const t = tam[i], cx = t.n ? t.x / t.n : hat[i].x, cz = t.n ? t.z / t.n : hat[i].z, cy = luoi.docCao(cx, cz)
    neo.set(vg.ma, new THREE.Vector3(cx, cy + 2.7, cz))
    const Rn = rng(seed + i * 31), diem: [number, number][] = [], muc = Math.max(14, Math.round(t.n * 0.13))
    for (let k = 0; k < muc * 8 && diem.length < muc; k++) {
      const x = bb.x0 + Rn() * (bb.x1 - bb.x0), z = bb.z0 + Rn() * (bb.z1 - bb.z0), tt = trongVung(x, z)
      if (tt.id === i && tt.s > 0.9 && tt.le > 1.0 && Math.hypot(x - cx, z - cz) > 1.5) diem.push([x, z])
    }
    const tr = raiTrangTri({ biome: luc.biome, mau: m, diem, cao: luoi.docCao, seed: seed + i, tyLe: 0.95, mat: matCay })
    const lv = luiVung.find((l) => l.i === i); if (lv) lv.g.add(tr); else scene.add(tr)
    if (vg.trangThai === 'dat') { const co = taoCo(b, 1.9); co.position.set(cx, cy, cz); co.scale.setScalar(1.3); scene.add(co); cos.push(co) }
    else if (vg.trangThai === 'yeu' && vg.loai) { const q = sinhQuai(vg.loai, b); q.goc.position.set(cx, cy + 0.05, cz); q.goc.scale.setScalar(1.15); scene.add(q.goc); quais.push(q) }
    else if (vg.trangThai === 'fog') { const my = taoMay(b, 5, seed + i, 3); my.goc.position.set(cx, cy + 0.6, cz); scene.add(my.goc); mays.push(my) }
    if (vg.khoi) { const v = taoVuongMien(b, 0.55); v.position.set(cx, cy + 2.2, cz); scene.add(v); mieng.push(v) }
  })

  sk.vuaKhung(24.5, 17.5, 56, 1.0, new THREE.Vector3(0, 0, 0.6))

  const dem = (e: PointerEvent) => { const p = sk.chamDat(e, 0.3); if (!p) return -1; const t = trongVung(p.x, p.z); return t.id >= 0 && t.s > -0.2 ? t.id : -1 }
  let hov = -1
  const nang = new Map<number, number>()
  const onMove = (e: PointerEvent) => { const i = dem(e); if (i !== hov) { hov = i; host.style.cursor = i >= 0 ? 'pointer' : 'default'; cb.hover(i >= 0 ? vungs[i].ma : null) } }
  const onClick = (e: PointerEvent) => { const i = dem(e); if (i >= 0) cb.chon(vungs[i].ma) }
  host.addEventListener('pointermove', onMove); host.addEventListener('pointerdown', onClick)
  const huyKhung = sk.moiKhung((dt, t) => {
    TOAN_CUC.uTime.value = t
    for (const l of luiVung) {
      const dich = l.i === hov ? 0.22 : 0, cur = nang.get(l.i) ?? 0, nxt = cur + (dich - cur) * Math.min(1, dt * 10)
      nang.set(l.i, nxt); l.mesh.position.y = nxt; l.g.position.y = nxt
      const e = (nxt / 0.22) * 0.15; l.mat.emissive.setRGB(e, e * 0.85, e * 0.5)
    }
    for (const q of quais) q.capNhat(dt, t)
    for (const my of mays) my.capNhat(t)
    for (const co of cos) { const v = co.userData.vai as THREE.Object3D; v.rotation.y = Math.sin(t * 3 + co.position.x) * 0.25 }
    for (const v of mieng) v.rotation.y += dt * 0.8
  })
  return {
    sk, neo,
    hover: (ma) => { hov = ma ? vungs.findIndex((v) => v.ma === ma) : -1 },
    phaHuy: () => { host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerdown', onClick); huyKhung(); quais.forEach((q) => q.phaHuy()); nuoc.phaHuy(); sk.phaHuy() },
  }
}
