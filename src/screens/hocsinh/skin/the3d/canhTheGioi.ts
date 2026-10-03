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
import { taoHatFx } from './hero'
import type { BangMau3D } from './kieuMau'
import { thongSo } from './chatLuong'

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
  /** nhãn có nên hiện không (nhiều lục địa mà đang thu nhỏ thì ẩn nhãn cho khỏi rối) */
  hienNhan: () => boolean
  phaHuy: () => void
}

/** Bố trí tất định: lục địa to ở giữa, nhỏ ra rìa; đẩy nhau cho khỏi chồng (tính theo elip vì blob rộng hơn cao); giữ trong elip.
 *  Nếu vẫn chồng thì nới thế giới rộng ra 15% rồi giải lại — luôn tách hết, cỡ thế giới là kết quả (camera tự vừa khung). */
export function boTri(rs: number[], seed: string, W0 = 38): { p: Diem[]; W: number; H: number } {
  const n = rs.length, SX = 1.16, SZ = 0.92
  for (let W = W0, lan = 0; ; W *= 1.15, lan++) {
    const H = W / 2, R = rng(bam(seed)), ord = rs.map((r, i) => [r, i] as const).sort((a, b) => b[0] - a[0]), p: Diem[] = new Array(n)
    ord.forEach(([, i], k) => { const a = k * 2.399963 + R() * 0.3, d = Math.sqrt((k + 0.5) / n); p[i] = [Math.cos(a) * d * W * 0.44, Math.sin(a) * d * H * 0.44] })
    for (let it = 0; it < 900; it++) {
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const dx = (p[j][0] - p[i][0]) / SX, dz = (p[j][1] - p[i][1]) / SZ, d = Math.hypot(dx, dz) || 0.01, need = (rs[i] + rs[j]) * 1.22 + 0.5
        if (d < need) { const f = (need - d) / 2 / d; p[i][0] -= dx * f * SX; p[i][1] -= dz * f * SZ; p[j][0] += dx * f * SX; p[j][1] += dz * f * SZ }
      }
      for (let i = 0; i < n; i++) {
        const ex = W / 2 - rs[i] * SX * 1.25, ez = H / 2 - rs[i] * SZ * 1.25
        const e = (p[i][0] / Math.max(1, ex)) ** 2 + (p[i][1] / Math.max(1, ez)) ** 2
        if (e > 1) { const k = 1 / Math.sqrt(e); p[i][0] *= k; p[i][1] *= k }
      }
    }
    let chong = 0
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dx = (p[j][0] - p[i][0]) / SX, dz = (p[j][1] - p[i][1]) / SZ, need = (rs[i] + rs[j]) * 1.22 + 0.5; chong = Math.max(chong, need - Math.hypot(dx, dz)) }
    if (chong < 0.25 || lan >= 8) return { p, W, H }
  }
}

const GOC_NGANG = 52

export function dungTheGioi(host: HTMLElement, b: BangMau3D, ds: LucDiaVao[], cb: { chon: (ma: string) => void; hover: (ma: string | null) => void }): CanhTheGioi {
  const sk = taoSanKhau(host, { do: true })
  const hatNen = thongSo().hatNen // hạt lấp lánh trôi nền: tắt ở mức Thấp
  const { scene } = sk
  sk.datNen(b, [60, 140], [0.95, 2.6])
  sk.datDen(b)

  // --- bố trí ---
  const rs = ds.map((d) => (1.7 + 0.54 * Math.sqrt(Math.max(1, d.soDang))) * (d.soDang <= 1 ? 0.88 : 1))
  // cỡ thế giới co giãn theo tổng diện tích lục địa (3–24 chủ đề mỗi khối): ít thì 38×19, nhiều thì rộng ra, lục địa không dính nhau
  const { p: pos, W, H } = boTri(rs, ds.map((d) => d.ma).join('|'))
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
  const kh = { x0: -(W / 2 + 3.5), z0: -(H / 2 + 3), x1: W / 2 + 3.5, z1: H / 2 + 3 }
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
  sk.vuaKhung(W + 2, H + 2, GOC_NGANG, 1.02)
  let zoom = 1, panX = 0, panZ = 0 // kéo để dịch · cuộn/chụm để phóng (thế giới nhiều lục địa rộng hơn màn hình)
  const hat = taoHatFx(90); scene.add(hat.vat)
  let tHat = 0

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
  // bấm = chọn (nhả chuột gần chỗ nhấn, không kéo); kéo = dịch bản đồ; cuộn/chụm 2 ngón = phóng to thu nhỏ
  const ptr = new Map<number, { x: number; y: number }>(); let batDau = { x: 0, y: 0, t: 0 }, daKeo = false, khoangChum = 0
  const gioiHan = () => { panX = Math.max(-W / 2 * (1 - zoom) - 2, Math.min(W / 2 * (1 - zoom) + 2, panX)); panZ = Math.max(-H / 2 * (1 - zoom) - 2, Math.min(H / 2 * (1 - zoom) + 2, panZ)) }
  const theoPx = () => (2 * sk.khung.xa * zoom * Math.tan((sk.camera.fov * Math.PI) / 360)) / Math.max(1, host.clientHeight)
  const datZoom = (z: number) => { zoom = Math.max(0.42, Math.min(1, z)); gioiHan() }
  const onDown = (e: PointerEvent) => {
    ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); batDau = { x: e.clientX, y: e.clientY, t: performance.now() }; daKeo = false
    if (ptr.size === 2) { const [a, c] = [...ptr.values()]; khoangChum = Math.hypot(a.x - c.x, a.y - c.y) }
  }
  const onMove2 = (e: PointerEvent) => {
    const p = ptr.get(e.pointerId)
    if (!p) { onMove(e); return }
    if (ptr.size === 2) {
      ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); const [a, c] = [...ptr.values()], d = Math.hypot(a.x - c.x, a.y - c.y)
      if (khoangChum > 0) datZoom(zoom * (khoangChum / Math.max(1, d))); khoangChum = d; daKeo = true; return
    }
    const dx = e.clientX - p.x, dy = e.clientY - p.y
    if (!daKeo && Math.hypot(e.clientX - batDau.x, e.clientY - batDau.y) > 7) { daKeo = true; try { host.setPointerCapture(e.pointerId) } catch { /* trình duyệt cũ */ } }
    if (daKeo) { const k = theoPx(); panX -= dx * k; panZ -= (dy * k) / Math.sin((GOC_NGANG * Math.PI) / 180); gioiHan() }
    ptr.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }
  const onUp = (e: PointerEvent) => {
    const bam = !daKeo && ptr.size === 1 && performance.now() - batDau.t < 500
    ptr.delete(e.pointerId); khoangChum = 0
    if (bam) { const i = dem(e); if (i >= 0) cb.chon(C[i].d.ma) }
  }
  const onWheel = (e: WheelEvent) => { e.preventDefault(); datZoom(zoom * Math.exp(e.deltaY * 0.0012)) }
  host.addEventListener('pointerdown', onDown); host.addEventListener('pointermove', onMove2); host.addEventListener('pointerup', onUp); host.addEventListener('pointercancel', onUp)
  host.addEventListener('wheel', onWheel, { passive: false })

  const huyKhung = sk.moiKhung((dt, t) => {
    TOAN_CUC.uTime.value = t
    // thế giới "sống": camera đung đưa rất nhẹ + đốm sáng ma thuật bay lên từ các lục địa
    const kh = sk.khung, tam = new THREE.Vector3(kh.tam.x + panX, kh.tam.y, kh.tam.z + panZ)
    sk.camera.position.set(tam.x + kh.huong.x * kh.xa * zoom + Math.sin(t * 0.21) * 0.7 * zoom, tam.y + kh.huong.y * kh.xa * zoom, tam.z + kh.huong.z * kh.xa * zoom + Math.cos(t * 0.17) * 0.35 * zoom); sk.camera.lookAt(tam)
    tHat += dt
    if (hatNen && tHat > 0.35 && C.length) { tHat = 0; const c = C[Math.floor(Math.random() * C.length)], a = Math.random() * 6.28, r = c.r * (0.3 + Math.random() * 0.6); hat.bung(new THREE.Vector3(c.x + Math.cos(a) * r * 1.1, luoi.docCao(c.x + Math.cos(a) * r * 1.1, c.z + Math.sin(a) * r * 0.9) + 0.2, c.z + Math.sin(a) * r * 0.9), c.d.trangThai === 'fog' ? '#b4bddf' : b.vang, 1, { toc: 0.4, len: true, to: 0.8 }) }
    hat.capNhat(dt)
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
    hienNhan: () => C.length <= 12 || zoom < 0.8,
    phaHuy: () => {
      host.removeEventListener('pointerdown', onDown); host.removeEventListener('pointermove', onMove2); host.removeEventListener('pointerup', onUp); host.removeEventListener('pointercancel', onUp); host.removeEventListener('wheel', onWheel)
      huyKhung(); quais.forEach((q) => q.phaHuy()); hat.phaHuy(); nuoc.phaHuy(); sk.phaHuy()
    },
  }
}
