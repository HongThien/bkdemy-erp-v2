// ============================================================================
// SÂN KHẤU 3D dùng chung: renderer + camera kiểu diorama + đèn "giờ vàng" + vòng lặp + nhãn HTML bám cảnh + chọn bằng chuột/chạm.
// Chỉ nạp khi mở màn phiêu lưu (import động) — không làm nặng bundle chính của app HS.
// Chất lượng theo `chatLuong.ts` (3 mức Thấp/Vừa/Cao): đọc bảng lúc dựng · đo máy ~2 giây khi được yêu cầu (`op.do`, chỉ 3 tầng bản đồ) ·
// đổi mức thì độ phân giải + gió + nước áp NGAY (không dựng lại) · tụt khung kéo dài: hạ độ phân giải, hết đường hạ thì báo `baoCham()`.
// ============================================================================
import * as THREE from 'three'
import type { BangMau3D } from './kieuMau'
import { thongSo, canDo, baoKetQuaDo, baoCham, dangKy } from './chatLuong'
import { TOAN_CUC } from './vatLieu'

export type NhanBam = { el: HTMLElement; pos: THREE.Vector3; hien?: () => boolean; /** true = nhãn nằm DƯỚI điểm neo (mặc định nằm trên) */ duoi?: boolean }
export type SanKhau = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  host: HTMLElement
  /** khung camera hiện hành (tâm nhìn, khoảng cách, hướng) — cập nhật khi đổi cỡ ô/xoay máy; cảnh có chuyển động camera phải đọc từ đây MỖI KHUNG */
  khung: { tam: THREE.Vector3; xa: number; huong: THREE.Vector3 }
  /** đăng ký hàm chạy mỗi khung (dt giây, t giây tổng) — trả hàm huỷ */
  moiKhung: (fn: (dt: number, t: number) => void) => () => void
  /** gắn 1 phần tử HTML bám theo điểm 3D (cập nhật mỗi khung, không qua React) */
  gan: (nhan: NhanBam) => () => void
  /** đặt camera nhìn xuống điểm `tam` từ góc `ngang` (độ so với mặt phẳng) cách `xa` đơn vị */
  datCamera: (tam: THREE.Vector3, ngang: number, xa: number, xoay?: number) => void
  /** chọn khoảng cách để KHUNG (rộng × sâu, đơn vị cảnh) vừa màn hình ở góc nhìn đã đặt */
  vuaKhung: (rong: number, sau: number, ngang: number, le?: number, tam?: THREE.Vector3) => void
  /** chừa bên phải `px` điểm ảnh (panel chi tiết đè lên) — cảnh dịch sang trái */
  chuaPhai: (px: number) => void
  /** tia từ con trỏ cắt mặt phẳng y = `y` ⇒ điểm trên đất, hoặc null */
  chamDat: (e: { clientX: number; clientY: number }, y?: number) => THREE.Vector3 | null
  chamVat: (e: { clientX: number; clientY: number }, vat: THREE.Object3D[]) => THREE.Intersection | null
  datDen: (b: BangMau3D, op?: { bong?: boolean; huong?: THREE.Vector3 }) => { mat: THREE.DirectionalLight; hemi: THREE.HemisphereLight }
  /** theoXa = [k0,k1]: sương mù co giãn theo khoảng cách camera (near = xa·k0, far = xa·k1) — cần khi màn dọc kéo camera ra xa */
  datNen: (b: BangMau3D, xaSuong: [number, number], theoXa?: [number, number]) => void
  /** tạm ngừng vẽ (cảnh đang bị che/thu gọn — màn đấu chỉ mở cảnh lúc tung chiêu); false = vẽ lại */
  nghi: (v: boolean) => void
  phaHuy: () => void
}

export function taoSanKhau(host: HTMLElement, op: { dpr?: number; antialias?: boolean; /** đo máy ~2 giây nếu đang tự nhận mức (chỉ 3 tầng bản đồ — KHÔNG ở màn đấu) */ do?: boolean } = {}): SanKhau {
  let ts = thongSo()
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:manipulation;outline:none'
  host.appendChild(canvas)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: op.antialias ?? ts.msaa, powerPreference: 'high-performance', alpha: false })
  let dprMax = op.dpr ?? ts.dprToiDa
  let dpr = Math.min(window.devicePixelRatio || 1, dprMax)
  TOAN_CUC.uGio.value = ts.gio; TOAN_CUC.uNuoc.value = ts.nuoc
  renderer.setPixelRatio(dpr)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping // giữ nguyên sắc pastel (Khronos PBR Neutral)
  renderer.toneMappingExposure = 1.0
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 400)

  const huy: Array<() => void> = []
  const fns = new Set<(dt: number, t: number) => void>()
  const nhans = new Set<NhanBam>()
  let padPhai = 0, rong = 1, cao = 1, song = true, nghi = false, t = 0, last = performance.now(), ema = 16, dem = 0, demCham = 0
  // lượt đo máy: bỏ 0,8 giây đầu (biên dịch shader, nạp hình) rồi đo 2 giây
  const doMay = op.do && canDo() ? { bd: 0.8, kt: 2.8, khung: 0, viec: 0, n: 0, xong: false, lanLai: 0 } : null
  // đổi mức (em chọn tay / tự hạ): áp ngay phần không cần dựng lại; phần còn lại (lưới, cây, khử răng cưa) màn tự dựng lại
  const huyNghe = dangKy(() => {
    ts = thongSo()
    dprMax = op.dpr ?? ts.dprToiDa
    const moi = Math.min(window.devicePixelRatio || 1, dprMax)
    if (moi !== dpr) { dpr = moi; renderer.setPixelRatio(dpr); doiCo() }
    TOAN_CUC.uGio.value = ts.gio; TOAN_CUC.uNuoc.value = ts.nuoc
  })
  let fogK: [number, number] | null = null
  let apLai: (() => void) | null = null // dựng lại khung camera khi ô đổi cỡ (host có thể có cỡ 0 lúc tạo, hoặc em xoay máy)
  const khung = { tam: new THREE.Vector3(), xa: 20, huong: new THREE.Vector3(0, 1, 1).normalize() }

  function doiCo() {
    rong = Math.max(1, host.clientWidth); cao = Math.max(1, host.clientHeight)
    renderer.setSize(rong, cao, false)
    camera.aspect = rong / cao
    if (padPhai > 0) camera.setViewOffset(rong, cao, padPhai / 2, 0, rong, cao); else camera.clearViewOffset()
    camera.updateProjectionMatrix()
    if (rong > 1 && cao > 1) apLai?.()
  }
  const ro = new ResizeObserver(doiCo)
  ro.observe(host)
  doiCo()

  const v = new THREE.Vector3()
  function chieuNhan() {
    for (const n of nhans) {
      const hien = n.hien ? n.hien() : true
      v.copy(n.pos).project(camera)
      const ra = v.z > 1 || !hien
      n.el.style.visibility = ra ? 'hidden' : 'visible'
      if (ra) continue
      n.el.style.transform = `translate(${((v.x * 0.5 + 0.5) * rong).toFixed(1)}px,${((-v.y * 0.5 + 0.5) * cao).toFixed(1)}px) translate(-50%,${n.duoi ? "0%" : "-100%"})`
    }
  }

  let raf = 0
  function vong(now: number) {
    raf = requestAnimationFrame(vong)
    if (!song || nghi || document.hidden) { last = now; return }
    const dtMs = now - last; last = now
    const dt = Math.min(0.05, dtMs / 1000); t += dt
    // khung cách khung trước > 250ms = tab bị HÃM (chạy nền, chuyển app, tiết kiệm pin), KHÔNG phải máy chậm (thử 01/10: khung xem ẩn chỉ
    // còn ~2 khung/giây ⇒ máy RX 5700 bị đo thành Thấp). Bỏ qua khung đó ở cả lượt đo lẫn phần tự hạ.
    const biHam = dtMs > 250
    if (!biHam) ema = ema * 0.95 + dtMs * 0.05
    if (doMay && !doMay.xong) {
      if (biHam) { // đo lại từ đầu; bị hãm mãi (5 lần) thì thôi không kết luận — lần mở bản đồ sau đo tiếp
        if (++doMay.lanLai > 5) doMay.xong = true; else { doMay.bd = t + 0.3; doMay.kt = doMay.bd + 2; doMay.khung = doMay.viec = doMay.n = 0 }
      } else if (t >= doMay.kt && doMay.n >= 20) { doMay.xong = true; baoKetQuaDo(doMay.khung / doMay.n, doMay.viec / doMay.n) }
      else if (t >= doMay.kt) doMay.kt = t + 1 // chưa đủ 20 khung thật ⇒ đo thêm
    } else if (!biHam && ++dem % 60 === 0) {
      // tụt khung (chậm hơn đích của mức 25%): hạ độ phân giải từng bậc; đã về 1 mà vẫn chậm 3 lần liền ⇒ báo để hạ cả mức
      if (ema > (1000 / ts.fps) * 1.25) {
        if (dpr > 1) { dpr = Math.max(1, dpr - 0.25); renderer.setPixelRatio(dpr); doiCo() }
        else if (++demCham >= 3) { demCham = 0; baoCham() }
      } else demCham = 0
    }
    const bdViec = performance.now()
    for (const f of fns) f(dt, t)
    renderer.render(scene, camera)
    chieuNhan()
    if (doMay && !doMay.xong && !biHam && t >= doMay.bd) { doMay.khung += dtMs; doMay.viec += performance.now() - bdViec; doMay.n++ }
  }
  raf = requestAnimationFrame(vong)

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), mp = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3()
  function toNdc(e: { clientX: number; clientY: number }) {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
  }

  const sk: SanKhau = {
    renderer, scene, camera, host, khung,
    moiKhung: (fn) => { fns.add(fn); return () => fns.delete(fn) },
    gan: (n) => { nhans.add(n); return () => nhans.delete(n) },
    datCamera: (tam, ngang, xa, xoay = 0) => {
      const a = (ngang * Math.PI) / 180, r = (xoay * Math.PI) / 180
      camera.position.set(tam.x + Math.sin(r) * Math.cos(a) * xa, tam.y + Math.sin(a) * xa, tam.z + Math.cos(r) * Math.cos(a) * xa)
      camera.lookAt(tam)
      camera.updateMatrixWorld()
      khung.tam.copy(tam); khung.xa = xa; khung.huong.set(Math.sin(r) * Math.cos(a), Math.sin(a), Math.cos(r) * Math.cos(a))
      if (fogK && scene.fog instanceof THREE.Fog) { scene.fog.near = xa * fogK[0]; scene.fog.far = xa * fogK[1] }
    },
    vuaKhung: (rongC, sauC, ngang, le = 1.08, tam = new THREE.Vector3(0, 0, 0)) => {
      apLai = () => {
      const tanH = Math.tan((camera.fov * Math.PI) / 360), sinA = Math.sin((ngang * Math.PI) / 180)
      const hienRong = rong - padPhai
      const xaNgang = (rongC / 2) / (tanH * (hienRong / cao))
      const xaDoc = (sauC * sinA / 2) / tanH
      sk.datCamera(tam, ngang, Math.max(xaNgang, xaDoc) * le + 2)
      }
      if (rong > 1 && cao > 1) apLai()
    },
    chuaPhai: (px) => { padPhai = px; doiCo() },
    chamDat: (e, y = 0) => { toNdc(e); mp.constant = -y; return ray.ray.intersectPlane(mp, hit) ? hit.clone() : null },
    chamVat: (e, vat) => { toNdc(e); const r = ray.intersectObjects(vat, true); return r[0] ?? null },
    datDen: (b, o = {}) => {
      const hemi = new THREE.HemisphereLight(new THREE.Color(b.hemiTroi), new THREE.Color(b.hemiDat), b.hemiCuong)
      const mat = new THREE.DirectionalLight(new THREE.Color(b.matTroi), b.matTroiCuong)
      mat.position.copy(o.huong ?? new THREE.Vector3(-18, 22, 12))
      if (o.bong) {
        mat.castShadow = true
        mat.shadow.mapSize.set(1024, 1024)
        const c = mat.shadow.camera; c.left = -14; c.right = 14; c.top = 14; c.bottom = -14; c.near = 1; c.far = 80
        mat.shadow.bias = -0.0006
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFShadowMap
      }
      scene.add(hemi, mat, mat.target)
      return { mat, hemi }
    },
    datNen: (b, [gan, xa], theoXa) => { fogK = theoXa ?? null; scene.background = new THREE.Color(b.troi); scene.fog = new THREE.Fog(new THREE.Color(b.suong), gan, xa) },
    nghi: (v) => { nghi = v },
    phaHuy: () => {
      song = false
      huyNghe()
      cancelAnimationFrame(raf)
      ro.disconnect()
      huy.forEach((f) => f())
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = (m as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose()
      })
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
  return sk
}
