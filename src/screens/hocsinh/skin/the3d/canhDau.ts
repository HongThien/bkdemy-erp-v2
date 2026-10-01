// ============================================================================
// MÀN ĐẤU 3D: hero bên trái, đội quái xếp hàng bên phải (quái hiện tại đứng giữa, quái chờ nhỏ phía sau). Đúng thì tung phép → tia bay → quái trúng đòn;
// sai thì quái hồi máu. Hạ con nào thì con kế bước vào ngay trong lượt; boss cuối vào có hào quang + vương miện. (spec-v1-app-hs.md §4.5)
// Quái dựng qua `sinhQuai()` (điểm cắm) — Thùy thiết kế riêng, bản này là chỗ giữ chỗ. Số sát thương/máu là HTML (React), cảnh chỉ lo hình + chuyển động.
// ============================================================================
import * as THREE from 'three'
import { taoSanKhau, type SanKhau } from './sanKhau'
import { fbm, smooth, bam, rng } from './hinhHoc'
import { xayLuoi } from './diaHinh'
import { raiTrangTri } from './trangTri'
import { matVat, TOAN_CUC } from './vatLieu'
import { sinhQuai, type Quai } from './nguonQuai'
import { taoVuongMien } from './quai'
import { taoHero, taoHatFx } from './hero'
import type { BangMau3D } from './kieuMau'
import { thongSo } from './chatLuong'

export type QuaiDau = { loai: string; boss: boolean }
export type CanhDau = {
  sk: SanKhau
  /** điểm trên đầu quái ĐANG ĐỨNG GIỮA (neo số sát thương) và trên đầu hero */
  neoQuai: () => THREE.Vector3
  neoHero: () => THREE.Vector3
  /** quái thứ i bước vào đấu (các con trước đó đã ngã sẽ biến mất) */
  vao: (i: number) => void
  /** hero tung phép; trung = đúng ⇒ quái trúng đòn, sai ⇒ quái hồi máu. Hoàn tất sau ~0.95s. */
  tungPhep: (trung: boolean) => Promise<void>
  /** quái đang đấu ngã xuống */
  nga: () => void
  chao: () => void
  /** hạ hết đội hình: hero reo + pháo sao vàng */
  anMung: () => void
  phaHuy: () => void
}

const CHO = [[5.6, -2.6], [7.2, -3.4], [8.6, -2.2], [6.4, -4.6], [8.2, -5.0], [9.4, -3.8]] // chỗ chờ phía sau (x, z)
const GIUA: [number, number] = [3.7, 0.2]

export function dungDau(host: HTMLElement, b: BangMau3D, op: { biome: string; gioi: 'nam' | 'nu'; maLuc: string }, doi: QuaiDau[]): CanhDau {
  const sk = taoSanKhau(host)
  const { scene, camera } = sk
  sk.datNen(b, [28, 70]); sk.datDen(b, { bong: thongSo().bongThat, huong: new THREE.Vector3(-8, 14, 9) })
  const seed = bam(op.maLuc) % 997, m = b.biome[op.biome] ?? b.biome.rung
  const dat = new THREE.Color(m.dat), dat2 = new THREE.Color(m.dat2), nui = new THREE.Color(m.nui), tmp = new THREE.Color(), san = new THREE.Color(m.dat).lerp(new THREE.Color(b.cat), 0.4)

  // sân đấu: lòng chảo xanh, giữa phẳng sáng, rìa nhô lên thành đồi
  const luoi = xayLuoi({ x0: -22, z0: -16, x1: 22, z1: 12 }, 0.4, (x, z) => {
    const r = Math.hypot(x * 0.8, z + 1.5), n = fbm(x * 0.2, z * 0.2, seed, 3)
    const h = 0.12 * n * smooth(3, 7, r) + smooth(8, 17, r) * (2.6 + 3 * n) + smooth(-6, -14, z) * 3.2
    tmp.copy(dat).lerp(dat2, smooth(0.35, 0.8, n)).lerp(nui, smooth(2.0, 4.5, h) * 0.8)
    tmp.lerp(san, (1 - smooth(5.5, 8.5, r)) * 0.55)
    const sh = 0.9 + 0.2 * fbm(x * 0.9, z * 0.9, seed + 5, 2)
    return { h, r: tmp.r * sh, g: tmp.g * sh, b: tmp.b * sh, id: 0 }
  })
  const matDat = matVat(); const dat0 = new THREE.Mesh(luoi.hinh.get(0)!, matDat); dat0.receiveShadow = true; scene.add(dat0)
  {
    const R = rng(seed + 3), diem: [number, number][] = []
    for (let k = 0; k < 1500 && diem.length < 90; k++) { const x = -20 + R() * 40, z = -14 + R() * 24; if (Math.hypot(x * 0.85, z + 1.5) > 9.5 && (z < 0.5 || (Math.abs(x) > 11 && z < 6))) diem.push([x, z]) }
    scene.add(raiTrangTri({ biome: op.biome, mau: m, diem, cao: luoi.docCao, seed, tyLe: 1.2, mat: matVat({ gio: true }) }))
  }

  // hero
  const hero = taoHero(op.gioi, b); hero.goc.position.set(-3.8, 0.1, 0.4); hero.goc.scale.setScalar(1.0); hero.goc.rotation.y = 0.75; scene.add(hero.goc)
  const hat = taoHatFx(220); scene.add(hat.vat)

  // đội quái
  type Be = { q: Quai; boss: boolean; x: number; z: number; s: number; ts: number; tx: number; tz: number; an: number; cr?: THREE.Object3D; vong?: THREE.Mesh }
  const aura = new THREE.TorusGeometry(1.5, 0.07, 6, 40).rotateX(Math.PI / 2)
  const bes: Be[] = doi.map((d, i) => {
    const q = sinhQuai(d.loai, b)
    q.goc.rotation.y = -0.85; scene.add(q.goc)
    const be: Be = { q, boss: d.boss, x: CHO[i % CHO.length][0], z: CHO[i % CHO.length][1], s: 0.55, ts: 0.55, tx: 0, tz: 0, an: 0 }
    if (d.boss && !q.khongVuongMien) {
      const cr = taoVuongMien(b, 0.36); cr.position.y = q.cao + 0.04; q.goc.add(cr); be.cr = cr
      const vong = new THREE.Mesh(aura, new THREE.MeshBasicMaterial({ color: new THREE.Color(b.vang), transparent: true, opacity: 0.55, toneMapped: false })); vong.position.y = 0.06; q.goc.add(vong); be.vong = vong
    }
    q.goc.position.set(be.x, 0.1, be.z); q.goc.scale.setScalar(be.s)
    return be
  })
  let cur = 0
  const dat_ = (i: number) => {
    bes.forEach((be, k) => {
      if (k < i) { be.tx = 14; be.tz = 0; be.ts = 0.01 }
      else if (k === i) { be.tx = GIUA[0]; be.tz = GIUA[1]; be.ts = be.boss ? 1.5 : 1.12 }
      else { const c = CHO[(k - i - 1) % CHO.length]; be.tx = c[0]; be.tz = c[1]; be.ts = be.boss ? 0.8 : 0.55 }
    })
  }
  dat_(0)
  bes.forEach((be) => { be.x = be.tx; be.z = be.tz; be.s = be.ts })

  // camera: nhìn ngang hơi từ trên, 2 bên cân nhau
  camera.fov = 36; camera.updateProjectionMatrix()
  const goc = new THREE.Vector3(0.2, 3.4, 11.2), nhin = new THREE.Vector3(0.2, 1.5, 0)
  camera.position.copy(goc); camera.lookAt(nhin)

  // chuyển động
  type Tw = { t: number; dur: number; f: (k: number) => void; xong?: () => void }
  const tws: Tw[] = []
  const tw = (dur: number, f: (k: number) => void, xong?: () => void) => tws.push({ t: 0, dur, f, xong })
  let rung = 0
  const dauQuai = new THREE.Vector3(), dauHero = new THREE.Vector3()
  const huyKhung = sk.moiKhung((dt, t) => {
    TOAN_CUC.uTime.value = t
    for (let i = tws.length - 1; i >= 0; i--) { const w = tws[i]; w.t += dt; const k = Math.min(1, w.t / w.dur); w.f(k); if (k >= 1) { tws.splice(i, 1); w.xong?.() } }
    bes.forEach((be, k) => {
      const e = Math.min(1, dt * 4.5)
      be.x += (be.tx - be.x) * e; be.z += (be.tz - be.z) * e; be.s += (be.ts - be.s) * e
      be.q.goc.position.x = be.x; be.q.goc.position.z = be.z; be.q.goc.scale.setScalar(Math.max(0.001, be.s))
      be.q.goc.visible = be.s > 0.02
      be.q.goc.rotation.y = k === cur ? -0.85 : -0.5
      be.q.capNhat(dt, t)
      if (be.vong) { be.vong.visible = k >= cur; be.vong.scale.setScalar(1 + 0.06 * Math.sin(t * 3)); (be.vong.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.25 * Math.sin(t * 3) }
      if (be.cr) be.cr.rotation.y += dt * 0.9
    })
    hero.capNhat(dt, t); hat.capNhat(dt)
    rung = Math.max(0, rung - dt * 3)
    camera.position.set(goc.x + (Math.random() - 0.5) * rung * 0.35, goc.y + (Math.random() - 0.5) * rung * 0.25, goc.z)
    camera.lookAt(nhin)
  })
  const neoQuai = () => { const be = bes[cur]; dauQuai.set(be.x, 0.1 + be.q.cao * be.s + 0.3, be.z); return dauQuai }
  const neoHero = () => { dauHero.set(hero.goc.position.x, 2.5, hero.goc.position.z); return dauHero }

  return {
    sk, neoQuai, neoHero,
    vao: (i) => { cur = Math.max(0, Math.min(bes.length - 1, i)); dat_(cur) },
    tungPhep: (trung) => new Promise((xong) => {
      const be = bes[cur], goc0 = hero.goc.position.x
      hero.tungPhep()
      tw(0.55, (k) => { hero.goc.position.x = goc0 + Math.sin(k * Math.PI) * 0.7 })
      setTimeout(() => {
        const a = hero.dauGay(), dich = new THREE.Vector3(be.x, 0.1 + be.q.cao * be.s * 0.6, be.z), p = new THREE.Vector3()
        tw(0.34, (k) => { p.lerpVectors(a, dich, k); p.y += Math.sin(k * Math.PI) * 0.9; hat.bung(p, trung ? b.hero.phep : '#9fe8b0', 2, { toc: 0.5, to: 0.9 }) }, () => {
          if (trung) { be.q.trung(); hat.bung(dich, b.vang, 36, { toc: 5.5 }); hat.bung(dich, '#ffffff', 12, { toc: 3 }); rung = 1 }
          else { be.q.hoi(); hat.bung(dich, '#9fe8b0', 18, { toc: 2, len: true }) }
          setTimeout(xong, 420)
        })
      }, 230)
    }),
    nga: () => { bes[cur].q.nga() },
    chao: () => hero.chao(),
    anMung: () => {
      hero.chao()
      ;[[-3.6, 2.6, 0.4, b.vang], [0.2, 3.6, 0, '#ffffff'], [3.8, 2.8, 0.2, b.vang], [-1.6, 3.2, 0.3, '#ffffff'], [2, 3.4, 0.2, b.vang]].forEach(([x, y, z, c], i) => {
        setTimeout(() => hat.bung(new THREE.Vector3(x as number, y as number, z as number), c as string, 44, { toc: 5.5 }), i * 200)
      })
    },
    phaHuy: () => { huyKhung(); bes.forEach((be) => be.q.phaHuy()); hero.phaHuy(); hat.phaHuy(); aura.dispose(); sk.phaHuy() },
  }
}
