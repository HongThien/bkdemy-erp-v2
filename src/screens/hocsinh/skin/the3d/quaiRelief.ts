// ============================================================================
// BOSS PHÙ ĐIÊU 3D TỪ BẢN VẼ — giữ ĐÚNG khuôn mặt/áo/nét vẽ của ảnh ChatGPT (không dựng lại bằng khối), nhưng có KHỐI thật:
//   1. Mỗi tư thế (PNG trong suốt) được tự TÁCH thành 2 lớp: THÂN (nhân vật + áo choàng) và HÀO QUANG (khói, pha lê, vòng phép).
//      Tách bằng "mở hình thái" (xoá nét mảnh như vòng phép/tia sáng) rồi lấy mảnh liền lớn nhất = thân.
//   2. THÂN được "thổi phồng" theo khoảng cách tới mép (distance transform): giữa dày, mép mỏng ⇒ đầu tròn, vai, tay có chiều sâu.
//      Lưới 128×128 gắn chính tấm ảnh làm bề mặt (UV thẳng) + đổ bóng nhẹ theo độ dốc ⇒ xoay vài chục độ vẫn thấy có khối.
//   3. HÀO QUANG đặt phẳng PHÍA SAU, luôn quay mặt về camera ⇒ thân xoay còn hào quang đứng yên (thị sai).
// Hoạt ảnh + giao diện `Quai`/`QuaiBoss` y như quaiAnh.ts / bossChibi3D.ts (đổi tư thế = đổi lớp). Mọi GV dùng chung 1 hàm: chỉ cần 6 ảnh cùng khung.
// Giới hạn: đây là nổi khối 2.5D, không phải mô hình thật — nhìn lệch quá ~40° sẽ lộ (nên cảnh trận giữ góc nhìn gần thẳng). Mô hình 3D thật = ảnh→3D (Tripo/Meshy).
// ============================================================================
import * as THREE from 'three'
import { bongTron } from './vatLieu'
import type { BossAnh } from '../kieu'
import type { QuaiBoss, TuThe } from './quaiAnh'

const GIAM = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const N = 512        // độ phân giải xử lý mặt nạ
const LUOI = 128     // số ô lưới mỗi cạnh
const CHUC = ['dung', 'noi', 'chieu', 'trung', 'gian', 'ha'] as const
const TUT_AN = 1.6

type Lop = { than: THREE.Texture; hao: THREE.Texture; trong: Uint8Array; z: Float32Array; dep: number }

// ───── xử lý ảnh (chạy 1 lần / tư thế, kết quả cache theo URL) ─────
function xoiMon(m: Uint8Array, r: number, dil: boolean): Uint8Array {
  const tam = new Uint8Array(N * N), ra = new Uint8Array(N * N)
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let v = dil ? 0 : 1
    for (let k = -r; k <= r; k++) { const xx = x + k; const b = xx < 0 || xx >= N ? 0 : m[y * N + xx]; if (dil ? b : !b) { v = dil ? 1 : 0; break } }
    tam[y * N + x] = v
  }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let v = dil ? 0 : 1
    for (let k = -r; k <= r; k++) { const yy = y + k; const b = yy < 0 || yy >= N ? 0 : tam[yy * N + x]; if (dil ? b : !b) { v = dil ? 1 : 0; break } }
    ra[y * N + x] = v
  }
  return ra
}
function manhLonNhat(m: Uint8Array): Uint8Array {
  const nhan = new Int32Array(N * N), stack = new Int32Array(N * N)
  let best = 0, bestN = 0, id = 0
  for (let s = 0; s < N * N; s++) {
    if (!m[s] || nhan[s]) continue
    id++; let sp = 0, dem = 0; stack[sp++] = s; nhan[s] = id
    while (sp) {
      const p = stack[--sp]; dem++
      const x = p % N, y = (p / N) | 0
      if (x > 0 && m[p - 1] && !nhan[p - 1]) { nhan[p - 1] = id; stack[sp++] = p - 1 }
      if (x < N - 1 && m[p + 1] && !nhan[p + 1]) { nhan[p + 1] = id; stack[sp++] = p + 1 }
      if (y > 0 && m[p - N] && !nhan[p - N]) { nhan[p - N] = id; stack[sp++] = p - N }
      if (y < N - 1 && m[p + N] && !nhan[p + N]) { nhan[p + N] = id; stack[sp++] = p + N }
    }
    if (dem > bestN) { bestN = dem; best = id }
  }
  const ra = new Uint8Array(N * N); for (let i = 0; i < N * N; i++) ra[i] = nhan[i] === best ? 1 : 0
  return ra
}
function khoangCach(m: Uint8Array): Float32Array {
  const INF = 1e9, d = new Float32Array(N * N)
  for (let i = 0; i < N * N; i++) d[i] = m[i] ? INF : 0
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const i = y * N + x; if (!d[i]) continue
    let v = d[i]; if (x > 0) v = Math.min(v, d[i - 1] + 1); if (y > 0) { v = Math.min(v, d[i - N] + 1); if (x > 0) v = Math.min(v, d[i - N - 1] + 1.414); if (x < N - 1) v = Math.min(v, d[i - N + 1] + 1.414) } d[i] = v }
  for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) { const i = y * N + x; if (!d[i]) continue
    let v = d[i]; if (x < N - 1) v = Math.min(v, d[i + 1] + 1); if (y < N - 1) { v = Math.min(v, d[i + N] + 1); if (x < N - 1) v = Math.min(v, d[i + N + 1] + 1.414); if (x > 0) v = Math.min(v, d[i + N - 1] + 1.414) } d[i] = v }
  return d
}

function xayLop(img: HTMLImageElement): Lop {
  const c = document.createElement('canvas'); c.width = c.height = N
  const x = c.getContext('2d', { willReadFrequently: true })!
  x.drawImage(img, 0, 0, N, N)
  const px = x.getImageData(0, 0, N, N).data
  const dac = new Uint8Array(N * N); for (let i = 0; i < N * N; i++) dac[i] = px[i * 4 + 3] > 225 ? 1 : 0
  // mở hình thái: xoá nét mảnh (vòng phép, tia sáng) nối thân với hào quang, giữ phần dày (đầu, thân, áo choàng, tay)
  const mo = xoiMon(xoiMon(dac, 5, false), 5, true)
  let than = manhLonNhat(mo)
  than = xoiMon(than, 3, true)
  for (let i = 0; i < N * N; i++) if (px[i * 4 + 3] < 40) than[i] = 0
  const d = khoangCach(than); let dm = 1; for (let i = 0; i < N * N; i++) if (d[i] > dm && d[i] < 1e8) dm = d[i]
  // lưới độ cao (căn bậc hai theo khoảng cách ⇒ mặt cắt tròn, đầu dày nhất)
  const L1 = LUOI + 1, z = new Float32Array(L1 * L1), trong = new Uint8Array(L1 * L1)
  for (let j = 0; j < L1; j++) for (let i = 0; i < L1; i++) {
    const sx = Math.min(N - 1, Math.round((i / LUOI) * (N - 1))), sy = Math.min(N - 1, Math.round((j / LUOI) * (N - 1)))
    const k = sy * N + sx
    if (than[k] && d[k] < 1e8) { trong[j * L1 + i] = 1; z[j * L1 + i] = Math.sqrt(Math.min(1, d[k] / (dm * 0.9))) }
  }
  // làm mịn 2 lượt (bỏ bậc thang của lưới)
  for (let t = 0; t < 2; t++) { const z2 = z.slice(); for (let j = 1; j < L1 - 1; j++) for (let i = 1; i < L1 - 1; i++) { const k = j * L1 + i; if (!trong[k]) continue
    z2[k] = (z[k] * 4 + z[k - 1] + z[k + 1] + z[k - L1] + z[k + L1]) / 8 } z.set(z2) }
  // texture THÂN (giữ độ phân giải gốc, cắt theo mặt nạ) và HÀO QUANG (phần còn lại)
  const mc = document.createElement('canvas'); mc.width = mc.height = N
  const mctx = mc.getContext('2d')!, md = mctx.createImageData(N, N)
  for (let i = 0; i < N * N; i++) { md.data[i * 4 + 3] = than[i] ? 255 : 0 }
  mctx.putImageData(md, 0, 0)
  const W = img.naturalWidth || 1024
  const tb = document.createElement('canvas'); tb.width = tb.height = W
  const tbx = tb.getContext('2d')!; tbx.drawImage(img, 0, 0, W, W); tbx.globalCompositeOperation = 'destination-in'; tbx.drawImage(mc, 0, 0, W, W)
  const th = document.createElement('canvas'); th.width = th.height = W
  const thx = th.getContext('2d')!; thx.drawImage(img, 0, 0, W, W); thx.globalCompositeOperation = 'destination-out'; thx.drawImage(mc, -3, -3, W + 6, W + 6)
  const tex = (cv: HTMLCanvasElement) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t }
  return { than: tex(tb), hao: tex(th), trong, z, dep: 0 }
}

const _cache = new Map<string, Promise<HTMLImageElement>>()
const taiAnh = (url: string) => { let p = _cache.get(url); if (!p) { p = new Promise((ok, hu) => { const i = new Image(); i.onload = () => ok(i); i.onerror = hu; i.src = url }); _cache.set(url, p) } return p }

function dungLuoi(lop: Lop, W: number, doDay: number, sau: boolean): THREE.BufferGeometry {
  const L1 = LUOI + 1, pos: number[] = [], uv: number[] = [], col: number[] = [], idx: number[] = []
  const zz = (i: number, j: number) => lop.z[Math.max(0, Math.min(LUOI, j)) * L1 + Math.max(0, Math.min(LUOI, i))]
  const sang = new THREE.Vector3(-0.4, 0.5, 0.76).normalize()
  for (let j = 0; j < L1; j++) for (let i = 0; i < L1; i++) {
    const z = zz(i, j) * doDay
    pos.push((i / LUOI - 0.5) * W, (1 - j / LUOI) * W, sau ? -z : z)
    uv.push(i / LUOI, 1 - j / LUOI)
    // pháp tuyến từ độ dốc ⇒ đổ bóng nhẹ (0.8–1.12) cho cảm giác khối; mặt sau tối
    const gx = (zz(i + 1, j) - zz(i - 1, j)) * doDay / (2 * W / LUOI), gy = (zz(i, j - 1) - zz(i, j + 1)) * doDay / (2 * W / LUOI)
    const n = new THREE.Vector3(-gx, -gy, 1).normalize()
    const sh = sau ? 0.4 : 0.8 + 0.32 * Math.max(0, n.dot(sang))
    col.push(sh, sh, sh)
  }
  for (let j = 0; j < LUOI; j++) for (let i = 0; i < LUOI; i++) {
    const a = j * L1 + i, b = a + 1, c = a + L1, d = c + 1
    if (!(lop.trong[a] || lop.trong[b] || lop.trong[c] || lop.trong[d])) continue
    if (sau) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setIndex(idx)
  return g
}

export function taoQuaiRelief(loai: string, a: BossAnh): QuaiBoss {
  const goc = new THREE.Group(), than = new THREE.Group(), hao = new THREE.Group(); goc.add(than, hao)
  const W = a.cao * 1.03, DAY = W * 0.2
  const url: Record<TuThe, string> = { dung: a.dung, noi: a.noi, chieu: a.chieu, trung: a.trung, gian: a.gian, ha: a.ha }
  const mats: { m: THREE.MeshBasicMaterial }[] = []
  const lopMesh: Partial<Record<TuThe, THREE.Group>> = {}
  const hoai: (() => void)[] = []
  let huy = false
  const bg = bongTron(0.95); goc.add(bg)

  const dung = (t: TuThe, img: HTMLImageElement) => {
    if (huy) return
    const lop = xayLop(img), g = new THREE.Group()
    const mT = new THREE.MeshBasicMaterial({ map: lop.than, vertexColors: true, transparent: true, alphaTest: 0.04, toneMapped: false })
    const mS = new THREE.MeshBasicMaterial({ map: lop.than, vertexColors: true, transparent: true, alphaTest: 0.04, toneMapped: false })
    const gTruoc = dungLuoi(lop, W, DAY, false), gSau = dungLuoi(lop, W, DAY, true)
    g.add(new THREE.Mesh(gTruoc, mT), new THREE.Mesh(gSau, mS))
    const mH = new THREE.MeshBasicMaterial({ map: lop.hao, transparent: true, depthWrite: false, toneMapped: false })
    const ph = new THREE.Mesh(new THREE.PlaneGeometry(W, W), mH); ph.position.set(0, W / 2, -DAY * 1.4); ph.userData.hao = true
    g.userData.hao = ph; g.visible = false; than.add(g); hao.add(ph); ph.visible = false
    mats.push({ m: mT }, { m: mS }, { m: mH }); lopMesh[t] = g
    hoai.push(() => { gTruoc.dispose(); gSau.dispose(); lop.than.dispose(); lop.hao.dispose(); mT.dispose(); mS.dispose(); mH.dispose(); ph.geometry.dispose() })
    hienLai()
  }
  // 'dung' dựng đầu tiên (cần ngay); các tư thế còn lại dựng lần lượt để không chặn khung hình
  const thuTu: TuThe[] = ['dung', 'noi', 'chieu', 'trung', 'gian', 'ha']
  thuTu.forEach((t, i) => taiAnh(url[t]).then((img) => { setTimeout(() => dung(t, img), i * 40) }).catch(() => undefined))
  void CHUC

  let nen: TuThe = 'dung', ep: TuThe | null = null, hienTai: TuThe | null = null
  let tHit = 0, tHoi = 0, tBao = 0, tBaoTong = 0.7, chet = 0, daNga = false, bong = false
  const pha = (loai.length * 1.7) % 6.28
  const chonTuThe = (): TuThe => daNga ? 'ha' : ep ?? (tBao > 0 ? 'chieu' : tHit > 0 ? 'trung' : nen)
  function hienLai() {
    const t = chonTuThe(); const co = lopMesh[t] ? t : lopMesh.dung ? 'dung' : null
    if (co === hienTai) return
    hienTai = co
    for (const k of Object.keys(lopMesh) as TuThe[]) { const g = lopMesh[k]!; const on = k === co; g.visible = on; (g.userData.hao as THREE.Mesh).visible = on }
  }

  return {
    goc, loai, cao: a.cao, ban: 0.95, khongVuongMien: true,
    capNhat(dt, t) {
      hienLai()
      const w = t * 1.9 + pha
      let sx = 1, sy = 1, dx = 0, dy = 0, op = 1, quay = 0
      if (daNga) { chet = Math.min(1, chet + dt / TUT_AN); const k = 1 - Math.pow(1 - chet, 3); sx = 1 + 0.02 * k; sy = 1 - 0.05 * k; dy = 0.18 * k; op = 1 - k }
      else {
        if (!GIAM) { sy = 1 + 0.016 * Math.sin(w * 2); sx = 1 - 0.01 * Math.sin(w * 2); dy = Math.sin(w) * 0.035; quay = Math.sin(t * 0.8 + pha) * 0.16 }
        if (tBao > 0) { tBao = Math.max(0, tBao - dt); const k = 1 - tBao / tBaoTong; sx *= 1 + 0.05 * k; sy *= 1 + 0.05 * k; dx += 0.12 * k; quay += 0.25 * k }
        if (tHit > 0) tHit = Math.max(0, tHit - dt)
        if (tHoi > 0) tHoi = Math.max(0, tHoi - dt)
        if (chonTuThe() === 'noi' && !GIAM) quay += Math.sin(t * 5) * 0.08
      }
      const kh = tHit / 0.42
      if (kh > 0 && !GIAM) dx += Math.sin(kh * 26) * 0.1 * kh
      // thân xoay nhẹ qua lại để lộ khối (đồng thời bù phần lớn góc cảnh đặt) — giữ góc nhìn gần thẳng cho ít lộ giới hạn của phù điêu
      than.rotation.y = -goc.rotation.y * 0.78 + quay
      than.scale.set(sx, sy, 1); than.position.set(dx, dy, 0)
      hao.rotation.y = -goc.rotation.y; hao.position.set(0, dy * 0.6, 0)
      hao.scale.setScalar(1 + (daNga ? 0.8 * chet : 0) + (GIAM ? 0 : 0.012 * Math.sin(t * 2.4)))
      for (const { m } of mats) {
        m.opacity = op
        if (m.depthWrite === false) { m.color.setRGB(1, 1, 1); continue }
        if (bong) m.color.setRGB(0.03, 0.02, 0.06)
        else if (kh > 0) m.color.setRGB(1 + 0.9 * kh, 1 + 0.9 * kh, 1 + 0.9 * kh)
        else if (tHoi > 0) { const h = tHoi / 0.6; m.color.setRGB(1 - 0.35 * h, 1 + 0.25 * h, 1 - 0.1 * h) }
        else m.color.setRGB(1, 1, 1)
      }
      hao.visible = !bong; bg.visible = !bong && !daNga
    },
    trung() { if (!daNga) tHit = 0.42 },
    hoi() { if (!daNga) tHoi = 0.6 },
    nga() { if (!daNga) { daNga = true; chet = 0 } },
    dung() { daNga = false; chet = 0; tHit = 0; tHoi = 0; tBao = 0; ep = null },
    daNga: () => daNga,
    bong(on) { bong = on },
    datTuThe(t) { ep = t },
    baoHieu(ms = 700) { tBaoTong = ms / 1000; tBao = tBaoTong },
    giaiDoan(p) { nen = p === 2 ? 'gian' : 'dung' },
    phaHuy() { huy = true; hoai.forEach((f) => f()); (bg.geometry as THREE.BufferGeometry).dispose() },
  }
}
