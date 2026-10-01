// ============================================================================
// TẦNG 3 — CHẶNG ĐƯỜNG: 1 con đường uốn lượn qua vùng; mỗi chặng (= 1 dạng) là 1 bệ đá có ĐỘI QUÁI đứng (elite nhỏ phía sau,
// boss cuối to ở giữa, đội vương miện). Chặng đã hạ: quái ngã + cờ; chưa gặp: bóng đen; còn máu: quái sống.
// Chặng to nhỏ theo số quái (spec-v1-app-hs.md §4.5). Quái dựng qua `sinhQuai()` (điểm cắm) — Thùy thiết kế riêng, bản này là chỗ giữ chỗ.
// ============================================================================
import * as THREE from 'three'
import { taoSanKhau, type SanKhau } from './sanKhau'
import { fbm, smooth, bam, rng, duongCong, khoangCachDuong, type Diem } from './hinhHoc'
import { xayLuoi, taoCo } from './diaHinh'
import { raiTrangTri } from './trangTri'
import { Bo } from './dungHinh'
import { matVat, matToon, TOAN_CUC } from './vatLieu'
import { sinhQuai, type Quai } from './nguonQuai'
import { taoVuongMien } from './quai'
import { taoHero, type Hero } from './hero'
import type { BangMau3D } from './kieuMau'

export type ChangVao = {
  ma: string
  trangThai: 'dat' | 'yeu' | 'chua_do'
  quai: { loai: string; boss: boolean }[]
}
export type CanhChang = {
  sk: SanKhau
  /** điểm neo nhãn (dưới bệ) theo mã chặng */
  neo: Map<string, THREE.Vector3>
  /** chỗ hero đứng (nhãn "em ở đây") — null nếu không có chặng nào còn máu */
  neoHero: THREE.Vector3 | null
  chon: (ma: string | null) => void
  hover: (ma: string | null) => void
  phaHuy: () => void
}

/** Vị trí các chặng trên đường: 1 hàng nếu ≤4 chặng, ngược lại 2 hàng rắn bò. Đơn vị cảnh. */
export function viTriChang(n: number): Diem[] {
  const hang = n <= 4 ? 1 : 2, moi = Math.ceil(n / hang), out: Diem[] = []
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / moi), j = i % moi, cot = r % 2 ? moi - 1 - j : j
    const x0 = -9.2, x1 = 7.6, x = moi === 1 ? -1 : x0 + (cot * (x1 - x0)) / (moi - 1)
    const z = hang === 1 ? (i % 2 ? -0.9 : 0.9) : (r === 0 ? -3.6 : 3.6) + (j % 2 ? -0.8 : 0.8)
    out.push([x, z])
  }
  return out
}

export function dungChang(host: HTMLElement, b: BangMau3D, luc: { biome: string; ma: string }, ds: ChangVao[], cb: { chon: (ma: string) => void; hover: (ma: string | null) => void }): CanhChang {
  const sk = taoSanKhau(host)
  const { scene } = sk
  sk.datNen(b, [40, 100], [0.95, 2.7]); sk.datDen(b, { huong: new THREE.Vector3(-14, 20, 10) })
  const seed = bam(luc.ma) % 991, m = b.biome[luc.biome] ?? b.biome.rung
  const P = viTriChang(ds.length)
  const dat = new THREE.Color(m.dat), dat2 = new THREE.Color(m.dat2), nui = new THREE.Color(m.nui), duongC = new THREE.Color(b.duong), vien = new THREE.Color(b.duongVien)

  // --- đường ---
  const diemDk: Diem[] = [[P[0][0] - 4.5, P[0][1] + 0.8], ...P, [P[P.length - 1][0] + 3.8, P[P.length - 1][1] - 0.6]]
  const duong = duongCong(diemDk, 14)
  const quanh = (x: number, z: number) => { let d = Infinity; for (const p of P) d = Math.min(d, Math.hypot(x - p[0], z - p[1])); return d }

  // --- địa hình: phẳng quanh đường, đồi + vách núi ở rìa ---
  const kh = { x0: -24, z0: -14, x1: 24, z1: 14 }, tmp = new THREE.Color()
  const luoi = xayLuoi(kh, 0.34, (x, z) => {
    const dR = khoangCachDuong(x, z, duong, false), dB = quanh(x, z)
    const phang = smooth(1.0, 2.8, dR) * smooth(1.5, 3.2, dB)
    const n = fbm(x * 0.24, z * 0.24, seed, 3), hill = smooth(3, 10, dR) * (0.6 + 2.6 * fbm(x * 0.13 + 5, z * 0.13, seed + 3, 3))
    const bien = smooth(8.5, 13.5, Math.abs(z)) * 4.2 + smooth(15, 23, Math.abs(x)) * 4.6
    const h = (0.26 * n + hill * 0.5) * phang + bien * (0.5 + 0.5 * n)
    tmp.copy(dat).lerp(dat2, smooth(0.3, 0.75, n)).lerp(nui, smooth(1.2, 3.2, h) * 0.9)
    const duongKhi = 1 - smooth(0.8, 1.5, dR)
    if (duongKhi > 0) tmp.lerp(duongC, duongKhi * 0.7)
    const sh = 0.9 + 0.2 * fbm(x * 0.9, z * 0.9, seed + 7, 2)
    return { h, r: tmp.r * sh, g: tmp.g * sh, b: tmp.b * sh, id: 0 }
  })
  const dat0 = luoi.hinh.get(0)!
  const matDat = matVat(), matCay = matVat({ gio: true })
  scene.add(new THREE.Mesh(dat0, matDat))

  // dải đường đất
  {
    const pos: number[] = [], col: number[] = [], idx: number[] = [], w = 0.95
    duong.forEach((p, i) => {
      const a = duong[Math.max(0, i - 1)], c = duong[Math.min(duong.length - 1, i + 1)], dx = c[0] - a[0], dz = c[1] - a[1], l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l
      for (const s of [-1, 0, 1]) {
        pos.push(p[0] + nx * w * s, 0.07, p[1] + nz * w * s)
        tmp.copy(duongC).lerp(vien, s === 0 ? 0 : 0.35); col.push(tmp.r, tmp.g, tmp.b)
      }
      if (i < duong.length - 1) { const k = i * 3; idx.push(k, k + 3, k + 1, k + 1, k + 3, k + 4, k + 1, k + 4, k + 2, k + 2, k + 4, k + 5) }
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals()
    scene.add(new THREE.Mesh(g, matVat()))
  }

  // --- trang trí (tránh đường + bệ) ---
  {
    const R = rng(seed + 11), diem: [number, number][] = []
    for (let k = 0; k < 2400 && diem.length < 150; k++) {
      const x = -22 + R() * 44, z = -13 + R() * 26
      if (khoangCachDuong(x, z, duong, false) > 2.6 && quanh(x, z) > 3.2) diem.push([x, z])
    }
    scene.add(raiTrangTri({ biome: luc.biome, mau: m, diem, cao: luoi.docCao, seed, tyLe: 1.1, mat: matCay }))
  }

  // --- bệ + đội quái + cờ + hero ---
  const neo = new Map<string, THREE.Vector3>(), quais: Quai[] = [], cos: THREE.Group[] = [], mieng: THREE.Object3D[] = []
  const matBe = matToon({ vienSang: '#ffe9c4' })
  const geoBe = (() => { const bo = new Bo(); bo.tru(1.5, 1.68, 0.34, b.da, { y: 0.17 }, { duoi: new THREE.Color(b.da).multiplyScalar(0.6), y0: 0, y1: 0.4 }, 20); bo.tru(1.3, 1.3, 0.06, new THREE.Color(b.da).lerp(new THREE.Color('#ffffff'), 0.2), { y: 0.36 }, undefined, 20); bo.vanh(1.34, 0.05, b.vang, { y: 0.4, rx: Math.PI / 2 }, Math.PI * 2, 28); return bo.xuat({ ao: 0.12 }) })()
  const ringGeo = new THREE.TorusGeometry(1.7, 0.06, 6, 40).rotateX(Math.PI / 2)
  const bes: { g: THREE.Group; ring: THREE.Mesh; ma: string; i: number }[] = []
  const matRing = new THREE.MeshBasicMaterial({ color: new THREE.Color(b.vang), transparent: true, opacity: 0.0, toneMapped: false })
  let yeuDau = -1
  ds.forEach((c, i) => {
    const [x, z] = P[i], nq = c.quai.length, g = new THREE.Group()
    g.position.set(x, 0, z)
    g.add(new THREE.Mesh(geoBe, matBe))
    const ring = new THREE.Mesh(ringGeo, matRing.clone()); ring.position.y = 0.45; g.add(ring)
    // boss cuối ở giữa; elite xếp cung phía sau, nhỏ hơn
    const sBoss = 0.82 + 0.07 * Math.min(4, nq - 3), el = c.quai.slice(0, -1), bossQ = c.quai[nq - 1]
    const qb = sinhQuai(bossQ.loai, b); qb.goc.position.set(0, 0.4, 0.15); qb.goc.scale.setScalar(sBoss); g.add(qb.goc); quais.push(qb)
    const cr = taoVuongMien(b, 0.34); cr.position.y = qb.cao + 0.04; qb.goc.add(cr); mieng.push(cr)
    const ph = [qb]
    el.forEach((e, k) => {
      const t = el.length === 1 ? 0.5 : k / (el.length - 1), ang = Math.PI * (1.18 + 0.64 * t), r = 1.12
      const q = sinhQuai(e.loai, b); q.goc.position.set(Math.cos(ang) * r, 0.4, Math.sin(ang) * r * 0.55 - 0.15); q.goc.scale.setScalar(0.46 + 0.02 * (k % 2)); g.add(q.goc); quais.push(q); ph.push(q)
    })
    if (c.trangThai === 'dat') { ph.forEach((q) => q.nga()); const co = taoCo(b, 1.6); co.position.set(1.1, 0.4, 0.6); g.add(co); cos.push(co) }
    else if (c.trangThai === 'chua_do') ph.forEach((q) => q.bong(true))
    else if (yeuDau < 0) yeuDau = i
    scene.add(g); bes.push({ g, ring, ma: c.ma, i })
    neo.set(c.ma, new THREE.Vector3(x, 0.1, z + 1.9))
  })
  let hero: Hero | null = null, neoHero: THREE.Vector3 | null = null
  if (yeuDau >= 0) {
    hero = taoHero('nam', b)
    const [hx, hz] = P[yeuDau]; hero.goc.position.set(hx - 2.4, 0, hz + 0.9); hero.goc.scale.setScalar(0.62); hero.goc.rotation.y = 0.35; scene.add(hero.goc)
    neoHero = new THREE.Vector3(hx - 2.4, 1.55, hz + 0.9)
  }

  sk.vuaKhung(28, 17, 50, 1.02, new THREE.Vector3(-1, 0, 0))

  const gan = (e: PointerEvent) => {
    const p = sk.chamDat(e, 0.4); if (!p) return -1
    let best = -1, bd = 2.6
    P.forEach(([x, z], i) => { const d = Math.hypot(p.x - x, p.z - z); if (d < bd) { bd = d; best = i } })
    return best
  }
  let hov = -1, sel = -1
  const nang = new Map<number, number>()
  const onMove = (e: PointerEvent) => { const i = gan(e); if (i !== hov) { hov = i; host.style.cursor = i >= 0 ? 'pointer' : 'default'; cb.hover(i >= 0 ? ds[i].ma : null) } }
  const onClick = (e: PointerEvent) => { const i = gan(e); if (i >= 0) cb.chon(ds[i].ma) }
  host.addEventListener('pointermove', onMove); host.addEventListener('pointerdown', onClick)
  const huyKhung = sk.moiKhung((dt, t) => {
    TOAN_CUC.uTime.value = t
    for (const be of bes) {
      const dich = be.i === hov ? 0.14 : 0, cur = nang.get(be.i) ?? 0, nxt = cur + (dich - cur) * Math.min(1, dt * 10)
      nang.set(be.i, nxt); be.g.position.y = nxt
      const mat = be.ring.material as THREE.MeshBasicMaterial
      mat.opacity = be.i === sel ? 0.75 + 0.25 * Math.sin(t * 4) : be.i === hov ? 0.5 : 0
      be.ring.scale.setScalar(be.i === sel ? 1 + 0.03 * Math.sin(t * 4) : 1)
    }
    for (const q of quais) q.capNhat(dt, t)
    for (const co of cos) { const v = co.userData.vai as THREE.Object3D; v.rotation.y = Math.sin(t * 3 + co.position.x) * 0.25 }
    for (const v of mieng) v.rotation.y += dt * 0.9
    hero?.capNhat(dt, t)
  })
  return {
    sk, neo, neoHero,
    chon: (ma) => { sel = ma ? ds.findIndex((c) => c.ma === ma) : -1 },
    hover: (ma) => { hov = ma ? ds.findIndex((c) => c.ma === ma) : -1 },
    phaHuy: () => { host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerdown', onClick); huyKhung(); quais.forEach((q) => q.phaHuy()); hero?.phaHuy(); sk.phaHuy() },
  }
}
