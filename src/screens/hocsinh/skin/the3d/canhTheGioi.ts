// ============================================================================
// TẦNG 1 — THẾ GIỚI: 1 bản đồ thế giới 2.5D, mỗi chủ đề = 1 lục địa (to nhỏ theo số dạng, vị trí cố định theo thứ tự chủ đề).
// Lục địa = blob → SDF → lưới độ cao; nước có bọt sóng; cây/núi rải bằng instancing; cờ/quái/sương báo trạng thái.
// Mọi thứ tất định theo mã chủ đề ⇒ em nhớ đường. (spec-v1-app-hs.md §4.5)
// ============================================================================
import * as THREE from 'three'
import { taoSanKhau, type SanKhau } from './sanKhau'
import { blob, sdf, hopBao, fbm, smooth, lerp, bam, rng, type Diem } from './hinhHoc'
import { xayLuoi, taoNuoc, taoMay, taoCo, type May } from './diaHinh'
import { raiTrangTri } from './trangTri'
import { matVat, TOAN_CUC } from './vatLieu'
import { sinhQuai, type Quai } from './nguonQuai'
import { taoVuongMien } from './quai'
import type { BangMau3D } from './kieuMau'

export type LucDiaVao = {
  ma: string; ten: string; biome: string
  soDang: number
  trangThai: 'dat' | 'yeu' | 'fog'
  /** loài quái đại diện (chỗ em đang yếu) — null nếu không có */
  loai: string | null
  /** vùng khó (boss) — đội vương miện nổi lên */
  khoi?: boolean
}
export type CanhTheGioi = {
  sk: SanKhau
  /** điểm neo nhãn (trên tâm lục địa) theo mã */
  neo: Map<string, THREE.Vector3>
  /** bán kính lục địa (đơn vị cảnh) — React dùng để cỡ nhãn */
  ban: Map<string, number>
  hover: (ma: string | null) => void
  phaHuy: () => void
}

/** Bố trí tất định: lục địa to ở giữa, nhỏ ra rìa; đẩy nhau cho khỏi chồng; giữ trong elip. */
export function boTri(rs: number[], seed: string, W = 38, H = 19): Diem[] {
  const n = rs.length, R = rng(bam(seed)), ord = rs.map((r, i) => [r, i] as const).sort((a, b) => b[0] - a[0])
  const p: Diem[] = new Array(n)
  ord.forEach(([, i], k) => { const a = k * 2.399963 + R() * 0.3, d = Math.sqrt((k + 0.5) / n); p[i] = [Math.cos(a) * d * W * 0.42, Math.sin(a) * d * H * 0.42] })
  for (let it = 0; it < 500; it++) {
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const dx = p[j][0] - p[i][0], dz = p[j][1] - p[i][1], d = Math.hypot(dx, dz) || 0.01, need = rs[i] * 1.3 + rs[j] * 1.3 + 1.2
      if (d < need) { const f = (need - d) / d * 0.5; p[i][0] -= dx * f * 0.5; p[i][1] -= dz * f * 0.7; p[j][0] += dx * f * 0.5; p[j][1] += dz * f * 0.7 }
    }
    for (let i = 0; i < n; i++) {
      const ex = W / 2 - rs[i] * 1.2, ez = H / 2 - rs[i] * 1.05
      const e = (p[i][0] / ex) ** 2 + (p[i][1] / ez) ** 2
      if (e > 1) { const s = 1 / Math.sqrt(e); p[i][0] *= s; p[i][1] *= s }
    }
  }
  return p
}

const GOC_NGANG = 52

export function dungTheGioi(host: HTMLElement, b: BangMau3D, ds: LucDiaVao[], cb: { chon: (ma: string) => void; hover: (ma: string | null) => void }): CanhTheGioi {
  const sk = taoSanKhau(host)
  const { scene } = sk
  sk.datNen(b, [60, 140], [0.95, 2.6])
  sk.datDen(b)

  // --- bố trí ---
  const rs = ds.map((d) => (1.7 + 0.54 * Math.sqrt(Math.max(1, d.soDang))) * (d.soDang <= 1 ? 0.88 : 1))
  const pos = boTri(rs, ds.map((d) => d.ma).join('|'))
  const C = ds.map((d, i) => {
    const poly = blob(pos[i][0], pos[i][1], rs[i], bam(d.ma), { n: 30, go: 0.32, sx: 1.16, sz: 0.92 })
    const bb = hopBao(poly), m = b.biome[d.biome] ?? b.biome.rung
    const dat = new THREE.Color(m.dat), dat2 = new THREE.Color(m.dat2), nui = new THREE.Color(m.nui), cat = new THREE.Color(b.cat)
    const amp = d.biome === 'nui_lua' ? 1 : d.biome === 'bang' ? 0.8 : d.biome === 'sa_mac' ? 0.35 : 0.4
    return { d, poly, bb: { x0: bb.x0 - 3.5, z0: bb.z0 - 3.5, x1: bb.x1 + 3.5, z1: bb.z1 + 3.5 }, m, dat, dat2, nui, cat, amp, seed: bam(d.ma) % 997, r: rs[i], x: pos[i][0], z: pos[i][1] }
  })
  const cungSong = (x: number, z: number) => {
    let best = -Infinity, id = -1
    for (let i = 0; i < C.length; i++) {
      const c = C[i]
      if (x < c.bb.x0 || x > c.bb.x1 || z < c.bb.z0 || z > c.bb.z1) continue
      const s = sdf(x, z, c.poly)
      if (s > best) { best = s; id = i }
    }
    return { s: best, id }
  }

  // --- lưới địa hình ---
  const kh = { x0: -22, z0: -12.5, x1: 22, z1: 12.5 }
  const tmp = new THREE.Color(), nuocTrong = new THREE.Color(b.nuocNong), suongC = new THREE.Color('#b4bddf')
  const luoi = xayLuoi(kh, 0.28, (x, z) => {
    const { s, id } = cungSong(x, z)
    if (id < 0 || s < -0.8) return { h: -1.4, r: nuocTrong.r, g: nuocTrong.g, b: nuocTrong.b, id: -1 }
    const c = C[id], land = smooth(-0.7, 0.75, s), inland = smooth(0.7, 3.4, s), n = fbm(x * 0.33, z * 0.33, c.seed, 3), rid = 1 - Math.abs(fbm(x * 0.2 + 9, z * 0.2, c.seed + 3, 3) * 2 - 1)
    const h = lerp(-0.7, 0.5, land) + inland * (0.32 * n + 0.9 * c.amp * rid * rid)
    tmp.copy(c.dat).lerp(c.dat2, smooth(0.3, 0.75, n))
    tmp.lerp(c.nui, smooth(0.95, 1.7, h) * 0.85)
    tmp.lerp(c.cat, 1 - smooth(-0.15, 0.45, s)) // bãi cát ven bờ
    if (c.d.trangThai === 'fog') tmp.lerp(suongC, 0.5)
    const sh = 0.9 + 0.2 * fbm(x * 1.1, z * 1.1, c.seed + 5, 2)
    return { h, r: tmp.r * sh, g: tmp.g * sh, b: tmp.b * sh, id }
  })
  const luiAnim: { mesh: THREE.Mesh; mat: THREE.MeshLambertMaterial; ma: string; i: number }[] = []
  C.forEach((c, i) => {
    const g = luoi.hinh.get(i); if (!g) return
    const mat = matVat(), mesh = new THREE.Mesh(g, mat)
    scene.add(mesh); luiAnim.push({ mesh, mat, ma: c.d.ma, i })
  })

  // --- nước ---
  const nuoc = taoNuoc(b, kh, (x, z) => cungSong(x, z).s, TOAN_CUC.uTime)
  scene.add(nuoc.mesh)

  // --- trang trí + dấu hiệu từng lục địa ---
  const neo = new Map<string, THREE.Vector3>(), ban = new Map<string, number>(), matCay = matVat({ gio: true })
  const mays: May[] = [], quais: Quai[] = [], cos: THREE.Group[] = [], mienGroup = new Map<string, THREE.Group>()
  const mieng: THREE.Object3D[] = []
  C.forEach((c) => {
    const R = rng(c.seed + 77), diem: [number, number][] = [], muc = Math.round(c.r * c.r * 0.9)
    for (let k = 0; k < muc * 6 && diem.length < muc; k++) {
      const x = c.x + (R() - 0.5) * c.r * 2.4, z = c.z + (R() - 0.5) * c.r * 2, s = sdf(x, z, c.poly)
      if (s > 0.9 && Math.hypot(x - c.x, z - c.z) > 1.5 && cungSong(x, z).id === C.indexOf(c)) diem.push([x, z])
    }
    const tr = raiTrangTri({ biome: c.d.biome, mau: c.m, diem, cao: luoi.docCao, seed: c.seed, tyLe: 0.62, mat: matCay })
    const gr = new THREE.Group(); gr.add(tr); scene.add(gr); mienGroup.set(c.d.ma, gr)
    const cy = luoi.docCao(c.x, c.z)
    neo.set(c.d.ma, new THREE.Vector3(c.x, 0.3, c.z + c.r * 0.82)); ban.set(c.d.ma, c.r)
    // dấu hiệu: cờ khi đạt hết · quái đại diện khi còn yếu · sương khi chưa dạy
    if (c.d.trangThai === 'dat') { const co = taoCo(b, 1.7); co.position.set(c.x, cy, c.z); co.scale.setScalar(1.2); scene.add(co); cos.push(co) }
    else if (c.d.trangThai === 'yeu' && c.d.loai) { const q = sinhQuai(c.d.loai, b); q.goc.position.set(c.x, cy + 0.05, c.z); q.goc.scale.setScalar(0.85); scene.add(q.goc); quais.push(q) }
    else if (c.d.trangThai === 'fog') { const m = taoMay(b, c.r * 0.9, c.seed, Math.max(2, Math.round(c.r / 2.2))); m.goc.position.set(c.x, cy + 0.4, c.z); scene.add(m.goc); mays.push(m) }
    if (c.d.khoi) { const v = taoVuongMien(b, 0.5); v.position.set(c.x, cy + 1.3, c.z); v.userData.quay = true; scene.add(v); mieng.push(v) }
  })

  // --- camera ---
  sk.vuaKhung(40, 21, GOC_NGANG, 1.02)

  // --- tương tác ---
  const dem = (e: PointerEvent): number => {
    const p = sk.chamDat(e, 0.2); if (!p) return -1
    const { s, id } = cungSong(p.x, p.z)
    return id >= 0 && s > -0.35 ? id : -1
  }
  let hov = -1
  const nang = new Map<number, number>()
  const onMove = (e: PointerEvent) => {
    const i = dem(e)
    if (i !== hov) { hov = i; host.style.cursor = i >= 0 ? 'pointer' : 'default'; cb.hover(i >= 0 ? C[i].d.ma : null) }
  }
  const onClick = (e: PointerEvent) => { const i = dem(e); if (i >= 0) cb.chon(C[i].d.ma) }
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerdown', onClick)

  const huyKhung = sk.moiKhung((dt, t) => {
    TOAN_CUC.uTime.value = t
    for (const l of luiAnim) {
      const dich = l.i === hov ? 0.2 : 0, cur = nang.get(l.i) ?? 0, nxt = cur + (dich - cur) * Math.min(1, dt * 10)
      nang.set(l.i, nxt); l.mesh.position.y = nxt
      const e = nxt / 0.2 * 0.16; l.mat.emissive.setRGB(e, e * 0.85, e * 0.5)
      const g = mienGroup.get(l.ma); if (g) g.position.y = nxt
    }
    for (const q of quais) q.capNhat(dt, t)
    for (const m of mays) m.capNhat(t)
    for (const co of cos) { const v = co.userData.vai as THREE.Object3D; v.rotation.y = Math.sin(t * 3 + co.position.x) * 0.25 }
    for (const v of mieng) { v.rotation.y += dt * 0.8; v.position.y += Math.sin(t * 2) * 0.002 }
  })

  return {
    sk, neo, ban,
    hover: (ma) => { hov = ma ? C.findIndex((c) => c.d.ma === ma) : -1 },
    phaHuy: () => {
      host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerdown', onClick)
      huyKhung(); quais.forEach((q) => q.phaHuy()); nuoc.phaHuy(); sk.phaHuy()
    },
  }
}
