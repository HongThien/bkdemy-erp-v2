// ============================================================================
// BOSS CHIBI 3D DỰNG BẰNG CODE (không model, không texture) — cùng bộ dựng/vật liệu với hero + quái (dungHinh.ts, vatLieu.ts) nên cả cảnh "cùng một tay vẽ".
// Một khuôn cho MỌI giáo viên: khuôn mặt nhận ra qua tỉ lệ chibi (đầu ~1/2 thân, mặt hơi vuông, gò má cao) + 3 nét riêng khai trong `MoHinhChibi`
// (màu da · màu tóc · có kính gọng nửa không) + bảng màu áo/hào quang của style. Thêm GV = thêm 1 dòng `mo3d` ở Skin.boss, không viết code mới.
// Hoạt ảnh bằng code trên khớp (vai · khuỷu · đầu · mắt · mày · áo choàng · hào quang), đổi tư thế mượt (không nhảy cảnh):
//   dung · noi (chỉ tay, gật đầu) · chieu (gồng, quả cầu phép) · trung (ngửa người, nheo mắt, loé) · gian (hào quang vàng, cau mày) · ha (hai ngón cái, tan dần).
// Cùng giao diện `Quai` như quái khác ⇒ cảnh trận không phải biết đây là boss riêng (design/FLOW-NPC-BOSS-CUOI.md §A.4 — làm bằng code thay vì AI ảnh→3D).
// ============================================================================
import * as THREE from 'three'
import { Bo } from './dungHinh'
import { matToon, bongTron } from './vatLieu'
import type { MoHinhChibi } from '../kieu'
import type { QuaiBoss, TuThe } from './quaiAnh'

const GIAM = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// ---- tỉ lệ đầu (đơn vị thế giới, chân chạm y=0) ----
const NECK = 1.55, RH = 0.58, SX = 1.04, SY = 0.94, SZ = 0.98, CY = 0.4 // CY = tâm đầu so với cổ
const zMat = (x: number, dy: number) => RH * SZ * Math.sqrt(Math.max(0.04, 1 - (x / (RH * SX)) ** 2 - (dy / (RH * SY)) ** 2)) // z mặt đầu tại (x, lệch dy)
const cong = (x: number) => Math.asin(Math.min(0.95, Math.abs(x) / (RH * SX))) * Math.sign(x) // góc xoay để vật áp sát mặt cong

type Khop = { uz: number; ux: number; fx: number; fz: number }
type DangTuThe = { R: Khop; L: Khop; ngon: boolean; cau: boolean; ngaSau: number; cui: number; gian: number; may: number; nheo: number; nhun: number }
const kh = (uz: number, ux: number, fx: number, fz = 0): Khop => ({ uz, ux, fx, fz })
const DANG: Record<TuThe, DangTuThe> = {
  dung:  { R: kh(0.34, 0, -0.3), L: kh(0.34, 0, -0.3), ngon: false, cau: false, ngaSau: 0, cui: 0, gian: 0, may: -0.05, nheo: 0, nhun: 0 },
  noi:   { R: kh(2.55, -0.15, -0.25), L: kh(0.75, -0.25, -0.95), ngon: true, cau: false, ngaSau: 0, cui: 0, gian: 0, may: -0.1, nheo: 0, nhun: 1 },
  chieu: { R: kh(0.12, -1.15, -1.0, -0.55), L: kh(0.12, -1.15, -1.0, -0.55), ngon: false, cau: true, ngaSau: 0, cui: 0.18, gian: 0.35, may: 0.2, nheo: 0.2, nhun: 0 },
  trung: { R: kh(1.0, 0.35, -0.35), L: kh(1.0, 0.35, -0.35), ngon: false, cau: false, ngaSau: 0.32, cui: 0, gian: 0, may: -0.32, nheo: 1, nhun: 0 },
  gian:  { R: kh(0.55, -0.1, -1.15), L: kh(0.55, -0.1, -1.15), ngon: false, cau: false, ngaSau: 0, cui: 0.08, gian: 1, may: 0.3, nheo: 0.25, nhun: 0 },
  ha:    { R: kh(0.7, -0.55, -2.05), L: kh(0.7, -0.55, -2.05), ngon: true, cau: false, ngaSau: 0, cui: 0, gian: 0, may: -0.12, nheo: 0, nhun: 0 },
}
const SO: (keyof DangTuThe)[] = ['ngaSau', 'cui', 'gian', 'may', 'nheo', 'nhun']
const TUT_AN = 1.6
const CAO_GOC = 2.62 // chiều cao mô hình gốc (đỉnh tóc); `cao` của style co/giãn theo tỉ lệ này

let _vau: THREE.CanvasTexture | null = null
function vauSang() {
  if (_vau) return _vau
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')!, gr = g.createRadialGradient(64, 64, 6, 64, 64, 62)
  gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128)
  return (_vau = new THREE.CanvasTexture(c))
}

export function taoBossChibi3D(loai: string, m: MoHinhChibi, cao: number): QuaiBoss {
  const goc = new THREE.Group(), than = new THREE.Group(); goc.add(than)
  const mt = matToon({ vienSang: '#ffe9c4' }); mt.transparent = true
  const basic = (c: THREE.ColorRepresentation, op = 1, cong_ = false) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c), transparent: true, opacity: op, depthWrite: !cong_, toneMapped: false, blending: cong_ ? THREE.AdditiveBlending : THREE.NormalBlending })
  const matMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, toneMapped: false })
  const mk = (b: Bo, mat: THREE.Material, ao = 0, shadow = false) => { const o = new THREE.Mesh(b.xuat({ ao }), mat); o.castShadow = shadow; return o }
  const cacMat: { m: THREE.Material & { opacity: number }; o: number }[] = []
  const dk = <T extends THREE.Material & { opacity: number }>(x: T) => { cacMat.push({ m: x, o: x.opacity }); return x }
  dk(mt); dk(matMat)

  // ───── THÂN: áo choàng navy viền vàng, thắt lưng, vai giáp, ủng ─────
  const ao = new THREE.Color(m.ao), aoSang = ao.clone().lerp(new THREE.Color('#ffffff'), 0.12)
  const b = new Bo()
  b.tru(0.34, 0.5, 0.95, ao, { y: 0.95 }, { duoi: ao.clone().multiplyScalar(0.7), y0: 0.4, y1: 1.4 }, 14)
  b.vanh(0.5, 0.04, m.vien, { y: 0.5, rx: Math.PI / 2 }, Math.PI * 2, 18)
  b.vanh(0.37, 0.05, '#6b4a2a', { y: 1.02, rx: Math.PI / 2 }, Math.PI * 2, 16)
  b.khoi8(0.13, m.vien, { y: 1.02, z: 0.37, sy: 1.2, sz: 0.6 }); b.khoi8(0.085, m.ngoc, { y: 1.02, z: 0.4, sy: 1.2, sz: 0.6 })
  b.hop(0.15, 0.78, 0.04, m.vien, { y: 0.88, z: 0.43 }, undefined, 0.02)
  b.khoi8(0.06, m.ngoc, { y: 0.62, z: 0.46, sy: 1.3, sz: 0.5 })
  b.tru(0.33, 0.28, 0.2, aoSang, { y: 1.5 }, undefined, 14) // cổ áo cao
  b.vanh(0.31, 0.028, m.vien, { y: 1.6, rx: Math.PI / 2 }, Math.PI * 2, 16)
  b.vanh(0.27, 0.03, '#e9c77b', { y: 1.43, z: 0.06, rx: 1.35 }, Math.PI * 2, 14) // chuỗi hạt
  for (const s of [-1, 1]) {
    b.cau(0.2, m.vien, { x: 0.45 * s, y: 1.43, sx: 1.15, sy: 0.62, sz: 1.0 }, undefined, 12) // giáp vai
    b.khoi8(0.075, m.ngoc, { x: 0.45 * s, y: 1.5, z: 0.12, sy: 1.3, sz: 0.6 })
    b.hop(0.3, 0.2, 0.46, '#201a30', { x: 0.2 * s, y: 0.12, z: 0.08 }, undefined, 0.07) // ủng
    b.hop(0.3, 0.1, 0.2, m.vien, { x: 0.2 * s, y: 0.1, z: 0.24 }, undefined, 0.04)
    b.khoi8(0.07, m.ngoc, { x: 0.2 * s, y: 0.3, z: 0.14, sy: 1.3, sz: 0.5 })
    b.tru(0.04, 0.05, 0.16, '#e9c77b', { x: 0.45 * s, y: 1.22, z: 0.14 }, undefined, 6) // tua vai
  }
  b.tru(0.14, 0.17, 0.14, m.da, { y: 1.55 }, undefined, 10) // cổ
  than.add(mk(b, mt, 0.22, true))

  // áo choàng sau lưng (lắc nhẹ) — ngoài navy, lót vàng
  const mangPivot = new THREE.Group(); mangPivot.position.set(0, 1.48, -0.3); than.add(mangPivot)
  const cb = new Bo()
  cb.tru(0.36, 0.78, 1.4, ao, { y: -0.74, z: -0.12, sz: 0.2 }, { duoi: ao.clone().multiplyScalar(0.7), y0: -1.4, y1: -0.1 }, 18)
  cb.tru(0.32, 0.72, 1.34, m.aoLot, { y: -0.74, z: -0.04, sz: 0.16 }, undefined, 18)
  cb.vanh(0.78, 0.03, m.vien, { y: -1.4, z: -0.12, rx: Math.PI / 2, sz: 0.2 }, Math.PI * 2, 18)
  mangPivot.add(mk(cb, mt, 0.1, true))

  // ───── ĐẦU: cổ xoay, mặt luôn rõ (MeshBasic) ─────
  const dau = new THREE.Group(); dau.position.set(0, NECK, 0); than.add(dau)
  const sk = new Bo()
  sk.cau(RH, m.da, { y: CY, sx: SX, sy: SY, sz: SZ }, undefined, 28)
  sk.cau(0.4, m.da, { y: CY - 0.3, sx: 1.0, sy: 0.55, sz: 0.88 }, undefined, 16) // hàm dưới vuông
  for (const s of [-1, 1]) {
    sk.cau(0.135, m.da, { x: 0.31 * s, y: CY - 0.1, z: 0.36, sz: 0.7 }, undefined, 10) // gò má
    sk.cau(0.105, m.da, { x: 0.6 * s, y: CY + 0.0, sx: 0.5 }, undefined, 8) // tai
  }
  sk.cau(0.068, new THREE.Color(m.da).multiplyScalar(0.9), { y: CY - 0.1, z: zMat(0, -0.1) + 0.035, sz: 0.85 }, undefined, 8) // mũi
  dau.add(mk(sk, mt))
  // tóc đen ngắn, mái dựng lên (trán lộ)
  const toc = new Bo()
  toc.them(new THREE.SphereGeometry(0.612, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.45), m.toc, { y: CY + 0.05, z: -0.05, rx: -0.68, sx: SX, sy: SY, sz: SZ })
  for (const [x, rz, k] of [[-0.24, 0.5, 0.9], [-0.06, 0.15, 1.05], [0.14, -0.25, 1.0], [0.3, -0.55, 0.85]] as [number, number, number][]) toc.cau(0.13 * k, m.toc, { x, y: CY + 0.5, z: 0.2, rx: -0.5, rz, sx: 1.25, sy: 0.75, sz: 1.2 }, undefined, 10) // mái dựng, tuft tròn
  for (const s of [-1, 1]) toc.hop(0.035, 0.1, 0.1, m.toc, { x: 0.565 * s, y: CY + 0.1, z: 0.1 }, undefined, 0.012)
  dau.add(mk(toc, mt))

  // mặt: mày · mắt · mũi · miệng cười lộ răng · má hồng — MeshBasic để luôn rõ nét
  const mayG: THREE.Mesh[] = []
  for (const s of [-1, 1]) {
    const o = mk(new Bo().hop(0.19, 0.045, 0.04, m.toc, {}, undefined, 0.016), matMat)
    o.position.set(0.21 * s, CY + 0.215, zMat(0.21, 0.215) + 0.04); o.rotation.y = cong(0.21 * s); o.renderOrder = 3; mayG.push(o); dau.add(o)
  }
  const mat = new THREE.Group(); mat.position.set(0, CY + 0.02, 0); dau.add(mat)
  for (const s of [-1, 1]) {
    const e = new Bo().cau(0.062, '#2d2433', { sz: 0.5, sy: 1.3 }, undefined, 10).cau(0.02, '#ffffff', { x: 0.02, y: 0.03, z: 0.04 }, undefined, 6)
    const o = mk(e, matMat); o.position.set(0.2 * s, 0, zMat(0.2, 0.02) + 0.008); o.rotation.y = cong(0.2 * s); mat.add(o)
  }
  const mieng = new Bo()
  mieng.them(new THREE.CircleGeometry(0.17, 22, Math.PI, Math.PI), '#6b2230', { sy: 0.85 })
  mieng.hop(0.3, 0.055, 0.015, '#ffffff', { y: -0.03, z: 0.006 }, undefined, 0.01) // hàm răng trên
  const mo = mk(mieng, matMat); mo.position.set(0, CY - 0.2, zMat(0, -0.28) + 0.022); dau.add(mo)
  const ma = new Bo(); for (const s of [-1, 1]) ma.cau(0.06, '#f09a88', { x: 0.33 * s, y: CY - 0.13, z: 0.31, sz: 0.25, sy: 0.7 }, undefined, 6)
  dau.add(mk(ma, matMat))

  // kính gọng nửa (viền kim loại phía trên, tròng trong mờ)
  const lens: THREE.Mesh[] = []
  if (m.kinh) {
    const gm = basic('#b9c0c8'); dk(gm)
    for (const s of [-1, 1]) {
      const g = new THREE.Group(); g.position.set(0.215 * s, CY + 0.035, zMat(0.215, 0.035) + 0.02); g.rotation.y = cong(0.215 * s)
      g.add(new THREE.Mesh(new THREE.TorusGeometry(0.168, 0.015, 6, 22, Math.PI), gm))
      const l = new THREE.Mesh(new THREE.CircleGeometry(0.165, 22), dk(basic('#eaf6ff', 0.12))); l.position.z = -0.004; g.add(l); lens.push(l)
      dau.add(g)
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.44), gm) // gọng càng kính
      t.position.set(0.5 * s, CY + 0.05, 0.24); t.rotation.y = -0.485 * s; dau.add(t)
    }
    const cauK = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.018, 0.02), gm); cauK.position.set(0, CY + 0.08, zMat(0, 0.08) + 0.03); dau.add(cauK)
  }

  // ───── 2 TAY: vai → khuỷu (đổi tư thế = xoay khớp). Ngón cái/chỉ chỉ hiện ở tư thế "nói" và "bị hạ". ─────
  const tay = [-1, 1].map((s) => {
    const up = new THREE.Group(); up.position.set(0.47 * s, 1.42, 0)
    const ub = new Bo().cau(0.12, ao, { sy: 0.9 }, undefined, 10).tru(0.1, 0.115, 0.34, ao, { y: -0.17 }, undefined, 10)
    up.add(mk(ub, mt))
    const fo = new THREE.Group(); fo.position.y = -0.34; up.add(fo)
    const fb = new Bo().cau(0.105, ao, {}, undefined, 8).tru(0.095, 0.11, 0.3, ao, { y: -0.15 }, undefined, 10)
      .vanh(0.115, 0.028, m.vien, { y: -0.3, rx: Math.PI / 2 }, Math.PI * 2, 12).cau(0.12, m.da, { y: -0.4 }, undefined, 10)
    fo.add(mk(fb, mt))
    const ngon = mk(new Bo().tru(0.04, 0.045, 0.16, m.da, { y: -0.56 }, undefined, 8).cau(0.045, m.da, { y: -0.64 }, undefined, 6), mt)
    fo.add(ngon); than.add(up)
    return { s, up, fo, ngon }
  })

  // quả cầu phép (tư thế gồng chiêu) giữa 2 tay
  const cauPhep = new THREE.Group(); cauPhep.position.set(0, 1.32, 0.78); cauPhep.visible = false
  const matLoi = dk(basic('#ffffff', 0.95)), matQuang = dk(basic(m.hao, 0.45, true))
  cauPhep.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), matLoi), new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), matQuang)); than.add(cauPhep)

  // ───── HÀO QUANG: vòng tròn ma pháp + pha lê quay phía sau (luôn quay mặt về camera) ─────
  const hao = new THREE.Group(); hao.position.set(0, 1.9, -1.0); than.add(hao)
  const mV1 = dk(basic(m.vien)), mV2 = dk(basic(m.vien, 0.7)), mNgoc = dk(basic(m.ngoc)), mVang = dk(basic(m.vien)), mHao = dk(basic(m.hao, 0.5, true))
  mHao.map = vauSang() // vầng sáng mềm (gradient tròn), không đa giác cứng
  hao.add(new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.02, 6, 48), mV1), new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.012, 6, 48), mV2))
  const glow = new THREE.Mesh(new THREE.CircleGeometry(1.7, 40), mHao); glow.position.z = -0.05; hao.add(glow)
  const gemQuay = new THREE.Group(); hao.add(gemQuay)
  const gp = new Bo(), gv = new Bo()
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, r = i % 2 ? 1.12 : 1.22, dat = { x: Math.cos(a) * r, y: Math.sin(a) * r, rz: a - Math.PI / 2, sy: 2.0, sz: 0.5 }
    ;(i % 2 ? gv : gp).khoi8(i % 2 ? 0.09 : 0.12, '#ffffff', dat)
  }
  gemQuay.add(new THREE.Mesh(gp.xuat({ ao: 0 }), mNgoc), new THREE.Mesh(gv.xuat({ ao: 0 }), mVang))
  const bg = bongTron(0.95); goc.add(bg)

  // ───── TRẠNG THÁI + HOẠT ẢNH ─────
  const cur: Record<string, number> = { ngaSau: 0, cui: 0, gian: 0, may: -0.05, nheo: 0, nhun: 0 }
  const kR = { ...DANG.dung.R }, kL = { ...DANG.dung.L }
  let nen: TuThe = 'dung', ep: TuThe | null = null
  let tHit = 0, tHoi = 0, tBao = 0, tBaoTong = 0.7, chet = 0, daNga = false, bong = false
  const pha = (loai.length * 1.7) % 6.28
  const chonTuThe = (): TuThe => daNga ? 'ha' : ep ?? (tBao > 0 ? 'chieu' : tHit > 0 ? 'trung' : nen)
  const xhao = new THREE.Color(m.hao), xgian = new THREE.Color(m.haoGian), tmp = new THREE.Color()

  return {
    goc, loai, cao, ban: 0.95, khongVuongMien: true,
    capNhat(dt, t) {
      const tt = chonTuThe(), d = DANG[tt], e = Math.min(1, dt * (GIAM ? 40 : 12))
      // nội suy mượt về tư thế đích
      for (const k of ['uz', 'ux', 'fx', 'fz'] as (keyof Khop)[]) { kR[k] += (d.R[k] - kR[k]) * e; kL[k] += (d.L[k] - kL[k]) * e }
      for (const k of SO) cur[k] += ((d[k] as number) - cur[k]) * e
      const w = t * 1.9 + pha
      const to = cao / CAO_GOC
      let op = 1, dy = GIAM ? 0 : Math.sin(w) * 0.03 * to, sc = to
      if (daNga) { chet = Math.min(1, chet + dt / TUT_AN); const k = 1 - Math.pow(1 - chet, 3); op = 1 - k; dy += 0.25 * k * to; sc = to * (1 - 0.04 * k) }
      if (tBao > 0) tBao = Math.max(0, tBao - dt)
      if (tHit > 0) tHit = Math.max(0, tHit - dt)
      if (tHoi > 0) tHoi = Math.max(0, tHoi - dt)
      const kh_ = tHit / 0.42
      const lac = GIAM ? 0 : Math.sin(kh_ * 26) * 0.1 * kh_
      const gian = cur.gian
      // thân
      than.position.set(lac, dy, 0)
      than.rotation.x = cur.cui - cur.ngaSau * (0.4 + 0.6 * kh_)
      than.scale.set(sc * (1 + 0.04 * gian), sc * (1 + 0.04 * gian + (GIAM ? 0 : 0.012 * Math.sin(w * 2))), sc * (1 + 0.04 * gian))
      if (tBao > 0) { const k = 1 - tBao / tBaoTong; than.position.z = -0.1 * k; than.scale.multiplyScalar(1 + 0.05 * k) }
      dau.rotation.x = cur.nhun > 0.5 && !GIAM ? Math.sin(t * 9) * 0.06 : -0.12 * cur.ngaSau
      dau.rotation.z = cur.ngaSau * 0.25 * Math.sin(kh_ * 10)
      mangPivot.rotation.x = (GIAM ? 0 : Math.sin(t * (1.4 + gian * 2) + pha) * (0.05 + 0.06 * gian)) - cur.ngaSau * 0.3
      // tay
      for (const o of tay) {
        const k = o.s === 1 ? kR : kL
        o.up.rotation.set(k.ux, 0, o.s * k.uz); o.fo.rotation.set(k.fx, 0, o.s * k.fz)
        o.ngon.visible = d.ngon && (o.s === 1 || tt === 'ha')
      }
      cauPhep.visible = d.cau
      if (d.cau) { const p = 1 + 0.2 * Math.sin(t * 14); cauPhep.scale.setScalar(p); cauPhep.rotation.y += dt * 4 }
      // mắt: chớp + nheo · mày
      const chop = !GIAM && (t % 3.7) < 0.12 ? 0.08 : 1
      mat.scale.y = Math.max(0.08, Math.min(chop, 1 - cur.nheo * 0.78))
      mayG.forEach((o, i) => { o.rotation.z = (i ? 1 : -1) * cur.may })
      // hào quang: quay mặt về camera, đổi vàng khi giận
      hao.rotation.y = -goc.rotation.y
      gemQuay.rotation.z += dt * (GIAM ? 0 : 0.28 + gian * 0.9)
      tmp.copy(xhao).lerp(xgian, gian); (matQuang.color as THREE.Color).copy(tmp); mHao.color.copy(tmp)
      mNgoc.color.copy(new THREE.Color(m.ngoc).lerp(xgian, gian)); mV1.color.copy(new THREE.Color(m.vien).lerp(xgian, gian))
      hao.scale.setScalar(1 + 0.05 * gian * (GIAM ? 0 : Math.sin(t * 5)) + (daNga ? 0.9 * chet : 0))
      // loé trắng khi trúng · loé xanh khi hồi
      if (bong) { mt.color.setRGB(0.04, 0.03, 0.07); mt.emissive.setRGB(0, 0, 0); matMat.color.setRGB(0.04, 0.03, 0.07) }
      else if (kh_ > 0) { mt.color.setRGB(1, 1, 1); mt.emissive.setRGB(kh_ * 0.9, kh_ * 0.9, kh_ * 0.9); matMat.color.setRGB(1 + kh_ * 0.9, 1 + kh_ * 0.9, 1 + kh_ * 0.9) }
      else if (tHoi > 0) { const h = tHoi / 0.6; mt.color.setRGB(1, 1, 1); mt.emissive.setRGB(0.05 * h, 0.6 * h, 0.25 * h); matMat.color.setRGB(1 - 0.3 * h, 1 + 0.2 * h, 1 - 0.1 * h) }
      else { mt.color.setRGB(1, 1, 1); mt.emissive.setRGB(0, 0, 0); matMat.color.setRGB(1, 1, 1) }
      hao.visible = !bong; bg.visible = !bong && !daNga; lens.forEach((l) => { l.visible = !bong })
      for (const x of cacMat) x.m.opacity = x.o * op
    },
    trung() { if (!daNga) tHit = 0.42 },
    hoi() { if (!daNga) tHoi = 0.6 },
    nga() { if (!daNga) { daNga = true; chet = 0 } },
    dung() { daNga = false; chet = 0; tHit = 0; tHoi = 0; tBao = 0; ep = null; than.position.set(0, 0, 0); than.scale.set(1, 1, 1); for (const x of cacMat) x.m.opacity = x.o },
    daNga: () => daNga,
    bong(on) { bong = on },
    datTuThe(t) { ep = t },
    baoHieu(ms = 700) { tBaoTong = ms / 1000; tBao = tBaoTong },
    giaiDoan(p) { nen = p === 2 ? 'gian' : 'dung' },
    phaHuy() {
      goc.traverse((o) => { const me = o as THREE.Mesh; if (me.isMesh) { me.geometry.dispose(); const mm = me.material; if (Array.isArray(mm)) mm.forEach((x) => x.dispose()); else mm.dispose() } })
    },
  }
}
