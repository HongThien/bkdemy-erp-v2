// Làng BK — M0 SPIKE: 1 con phố 3D low-poly, nhà ghép module (kiểu × cỡ × màu × biển), avatar đi lại, camera chếch + xoay 4 hướng.
// Mục đích DUY NHẤT: đo FPS trên iPad gen 7 / máy lớp (cổng go/no-go của spec-lang-bk.md D10c). Chưa phải game.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// ───────────── tham số (URL) ─────────────
const Q = new URLSearchParams(location.search)
const N_NHA = Math.max(2, Math.min(400, +(Q.get('nha') || 60)))
const N_NGUOI = Math.max(1, Math.min(300, +(Q.get('nguoi') || 25)))
const NHE = Q.get('nhe') === '1' || (Q.get('nhe') === null && /iPad|iPhone|Android/i.test(navigator.userAgent))
const SEED = +(Q.get('seed') || 7)

// ───────────── tiện ích ─────────────
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const R = rng(SEED)
const pick = (a) => a[Math.floor(R() * a.length)]
const between = (a, b) => a + R() * (b - a)

const CV = document.getElementById('cv')
const renderer = new THREE.WebGLRenderer({ canvas: CV, antialias: !NHE, powerPreference: 'high-performance' })
renderer.setPixelRatio(NHE ? 1 : Math.min(window.devicePixelRatio || 1, 2))
renderer.shadowMap.enabled = !NHE
renderer.shadowMap.type = THREE.PCFShadowMap
const scene = new THREE.Scene()
scene.background = new THREE.Color('#bfe3ff')
scene.fog = new THREE.Fog('#bfe3ff', 70, 170)

const camera = new THREE.PerspectiveCamera(32, 1, 1, 400)
scene.add(new THREE.HemisphereLight('#ffffff', '#8fb27a', 0.9))
const sun = new THREE.DirectionalLight('#fff3dc', 1.1)
sun.position.set(40, 70, 30)
scene.add(sun, sun.target)
if (!NHE) {
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  const sc = sun.shadow.camera; sc.left = -45; sc.right = 45; sc.top = 45; sc.bottom = -45; sc.near = 10; sc.far = 200
}

// ───────────── builder: hình khối có màu đỉnh, gộp thành 1 mesh ─────────────
function colored(g, color) {
  g = g.index ? g.toNonIndexed() : g
  const n = g.attributes.position.count, c = new THREE.Color(color), a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3))
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k)
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2))
  return g
}
const BOX = (P, w, h, d, x, y, z, col, ry = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (ry) g.rotateY(ry); g.translate(x, y, z); P.push(colored(g, col)) }
const CYL = (P, rt, rb, h, x, y, z, col, seg = 8) => { const g = new THREE.CylinderGeometry(rt, rb, h, seg); g.translate(x, y, z); P.push(colored(g, col)) }
const BALL = (P, r, x, y, z, col, sx = 1, sy = 1, sz = 1) => { const g = new THREE.IcosahedronGeometry(r, 0); g.scale(sx, sy, sz); g.translate(x, y, z); P.push(colored(g, col)) }
function GABLE(P, w, h, d, x, y, z, col) { // mái 2 dốc, đỉnh mái dọc theo z
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); g.translate(x, y, z - d / 2); P.push(colored(g, col))
}
function HIP(P, w, h, d, x, y, z, col) { // mái chóp
  const g = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4); g.rotateY(Math.PI / 4); g.scale(w, h, d); g.translate(x, y + h / 2, z); P.push(colored(g, col))
}

// ───────────── danh mục ─────────────
const TUONG = ['#f6dcae', '#f0b8bc', '#bcdcee', '#d4ecb9', '#f9e598', '#dcc8f2', '#f7bd8f', '#fbf4e6', '#c9e7e0']
const MAI = ['#b5523b', '#6b8fb5', '#4f7f5a', '#8a5a44', '#58606f', '#c9a227', '#a04668']
const KHUNG = { go: '#8b5a2b', dong: '#b87333', bac: '#c9ccd6', vang: '#f5c542' }
const KIEU = ['mai_ngoi', 'nha_ong', 'biet_thu', 'nha_go', 'nha_cay']
const CO = [ // nhỏ · vừa · lớn · đại
  { ten: 'nhỏ', w: 3.2, d: 3.2, tang: 1, lot: 5 },
  { ten: 'vừa', w: 4.4, d: 4.2, tang: 2, lot: 6.2 },
  { ten: 'lớn', w: 6.0, d: 5.2, tang: 3, lot: 8 },
  { ten: 'đại', w: 8.4, d: 6.4, tang: 4, lot: 11 },
]
const TEN_NHA = ['Tổ Ấm Xanh', 'Nhà Gió', 'Vườn Mây', 'Cánh Diều', 'Hiên Nắng', 'Mái Đỏ', 'Nhà Thỏ', 'Góc Nhỏ', 'Hoa Hướng Dương', 'Bến Cá', 'Đồi Sao', 'Nhà Mèo', 'Khu Vườn Kẹo', 'Lâu Đài Cát', 'Trạm Dừng Gió', 'Nhà Bánh Quy']
const TEN_CHU = ['Minh Anh', 'Gia Hân', 'Bảo Nam', 'Khánh Linh', 'Đức Huy', 'Thảo My', 'Quang Vinh', 'Mai Chi', 'Hải Đăng', 'Ngọc Lan', 'Tuấn Kiệt', 'Phương Thảo', 'An Nhiên', 'Gia Bảo', 'Thu Hà', 'Nhật Minh']
const LOP = ['6A1', '6A2', '7A1', '7A2', '7B1', '8A1', '8A2', '8B1']

// ───────────── nhà ─────────────
// toạ độ cục bộ: mặt tiền ở z=0 hướng +z; thân nhà lùi về z âm; cổng/biển ở z dương.
function buildHouse(h) {
  const P = [], c = CO[h.co], W = c.w, D = c.d, T = c.tang, th = 2.3 // chiều cao 1 tầng
  const tuong = h.tuong, mai = h.mai, H = T * th
  const cuaMau = '#7a4a2a', kinh = '#7fb4d6'
  const cua = (x, z0) => BOX(P, 0.9, 1.7, 0.12, x, 0.85, z0 + 0.06, cuaMau)
  const cuaso = (x, y, z0) => BOX(P, 0.8, 0.9, 0.1, x, y, z0 + 0.05, kinh)
  const hang = (n, y, z0) => { for (let i = 0; i < n; i++) cuaso(-W / 2 + (i + 0.5) * (W / n), y, z0) }
  const gian = Math.max(1, Math.round(W / 2.2))

  if (h.kieu === 'nha_cay') {
    const hh = 3 + T * 1.3
    CYL(P, 0.55, 0.8, hh, 0, hh / 2, -D / 2, '#7a5530', 7)
    BALL(P, 2.2 + T * 0.55, 0, hh + 0.6, -D / 2, '#4fa35a', 1.3, 0.9, 1.3)
    BALL(P, 1.4 + T * 0.3, -1.4, hh - 0.2, -D / 2 + 0.8, '#5fb869')
    BOX(P, 1.8 + T * 0.4, 1.3, 1.8, 0, hh + 0.2, -D / 2 + 0.2, '#d9b88a')
    GABLE(P, 2.2 + T * 0.4, 0.9, 2.0, 0, hh + 0.85, -D / 2 + 0.2, mai)
    BOX(P, 0.5, 2.4, 0.08, 0.9, 1.2, 0.0, '#9b7a4a') // thang
    CUA_PORCH(P, W)
  } else {
    // thân
    if (h.kieu === 'nha_ong') {
      const w2 = W * 0.7
      BOX(P, w2, H, D * 1.25, 0, H / 2, -D * 0.62, tuong)
      BOX(P, w2 + 0.3, 0.25, D * 1.25 + 0.3, 0, H + 0.12, -D * 0.62, '#444a58') // sân thượng
      BOX(P, w2 + 0.3, 0.5, 0.15, 0, H + 0.45, 0.1, tuong)
      for (let t = 0; t < T; t++) { const y = t * th + 1.4; cuaso(-w2 / 4, y, 0); cuaso(w2 / 4, y, 0); if (t > 0) BOX(P, w2 * 0.9, 0.12, 0.7, 0, t * th + 0.1, 0.35, '#ddd') }
      cua(0, 0); BOX(P, 1.4, 0.15, 0.7, 0, 1.9, 0.35, mai) // mái hiên
    } else if (h.kieu === 'biet_thu') {
      BOX(P, W, H, D, 0, H / 2, -D / 2, tuong)
      BOX(P, W * 0.45, H * 0.8, 1.2, W * 0.28, H * 0.4, 0.55, tuong) // cánh nhô ra
      for (let i = 0; i < 2; i++) CYL(P, 0.14, 0.14, th * 0.9, -W * 0.3 + i * 0.9, th * 0.45, 0.9, '#f3f0e8', 6) // cột
      BOX(P, 1.9, 0.18, 1.0, -W * 0.3 + 0.45, th * 0.92, 0.7, '#f3f0e8')
      HIP(P, W + 0.8, 1.7 + T * 0.3, D + 0.8, 0, H, -D / 2, mai)
      for (let t = 0; t < T; t++) hang(gian, t * th + 1.4, 0)
      cua(-W * 0.3 + 0.45, 0.9)
    } else if (h.kieu === 'nha_go') {
      BOX(P, W, H, D, 0, H / 2, -D / 2, '#c28f55')
      for (let i = 0; i < 4; i++) BOX(P, W + 0.05, 0.08, D + 0.05, 0, 0.5 + i * (H / 4), -D / 2, '#a8763f')
      GABLE(P, W + 0.6, 1.7 + T * 0.3, D + 0.6, 0, H, -D / 2, '#7d4f2e')
      BOX(P, W, 0.12, 1.0, 0, 0.5, 0.5, '#9b7a4a') // hiên
      for (let i = 0; i < 5; i++) BOX(P, 0.08, 0.8, 0.08, -W / 2 + i * (W / 4), 0.9, 0.95, '#8a5a30')
      for (let t = 0; t < T; t++) hang(gian, t * th + 1.4, 0)
      cua(0, 0); CYL(P, 0.22, 0.22, 0.5, W / 2 - 0.5, 0.25, 0.7, '#8a5a30') // gỗ chẻ
    } else { // mái ngói
      BOX(P, W, H, D, 0, H / 2, -D / 2, tuong)
      GABLE(P, W + 0.5, 1.5 + T * 0.35, D + 0.5, 0, H, -D / 2, mai)
      BOX(P, 0.55, 1.6, 0.55, W * 0.28, H + 0.9, -D * 0.6, '#9a6a4f') // ống khói
      for (let t = 0; t < T; t++) hang(gian, t * th + 1.4, 0)
      cua(0, 0)
    }
  }
  // sân + hàng rào (mặt trước lô)
  const lot = c.lot, fz = 2.6
  BOX(P, lot - 0.4, 0.06, fz + 0.2, 0, 0.03, fz / 2, '#9fd67e') // thảm cỏ
  BOX(P, 1.0, 0.07, fz, 0, 0.04, fz / 2, '#d8d0bd') // lối đi
  const n = Math.floor((lot - 0.4) / 0.6)
  for (let i = 0; i <= n; i++) {
    const x = -(lot - 0.4) / 2 + i * ((lot - 0.4) / n)
    if (Math.abs(x) < 0.7) continue
    BOX(P, 0.1, 0.7, 0.1, x, 0.35, fz, h.rao)
  }
  BOX(P, (lot - 0.4) / 2 - 0.6, 0.08, 0.08, -((lot - 0.4) / 4 + 0.35), 0.55, fz, h.rao)
  BOX(P, (lot - 0.4) / 2 - 0.6, 0.08, 0.08, ((lot - 0.4) / 4 + 0.35), 0.55, fz, h.rao)
  // trang trí mặt tiền (đây là nơi "to đẹp" phân hoá)
  if (h.deco & 1) for (let i = 0; i < 4; i++) BALL(P, 0.2, -lot / 2 + 0.7 + i * 0.5, 0.25, 1.2, pick(['#ff6b8b', '#ffd23f', '#ff9f43', '#a78bfa']))
  if (h.deco & 2) { CYL(P, 0.05, 0.05, 3.2, lot / 2 - 0.5, 1.6, 1.8, '#999', 5); BOX(P, 0.9, 0.55, 0.04, lot / 2 - 0.05, 2.9, 1.8, pick(['#ff595e', '#1982c4', '#6a4c93'])) } // cờ
  if (h.deco & 4) for (let i = -1; i <= 1; i += 2) { CYL(P, 0.05, 0.05, 1.3, i * 0.9, 0.65, fz, '#555', 5); BALL(P, 0.18, i * 0.9, 1.4, fz, '#ffdf6b') } // đèn cổng
  if (h.co >= 2) { BALL(P, 0.55, -lot / 2 + 0.6, 0.55, 0.6, '#58b368'); BALL(P, 0.45, lot / 2 - 0.6, 0.45, 0.7, '#4fa35a') }
  return P

  function CUA_PORCH(P2, w) { BOX(P2, 1.6, 0.1, 1.0, 0, 0.05, 0.6, '#a8763f') }
}

// ───────────── biển: atlas canvas (1 texture, 1 draw call) ─────────────
const CELL_W = 256, CELL_H = 96, COLS = 8, ROWS = 10
const atlas = document.createElement('canvas'); atlas.width = CELL_W * COLS; atlas.height = CELL_H * ROWS
const actx = atlas.getContext('2d')
function drawSign(slot, h) {
  const cx = (slot % COLS) * CELL_W, cy = Math.floor(slot / COLS) * CELL_H
  actx.fillStyle = KHUNG[h.bac]; actx.fillRect(cx, cy, CELL_W, CELL_H)
  actx.fillStyle = '#fff8e8'; actx.fillRect(cx + 7, cy + 7, CELL_W - 14, CELL_H - 14)
  actx.fillStyle = '#2a2230'; actx.textBaseline = 'middle'; actx.textAlign = 'center'
  actx.font = '800 29px system-ui,"Segoe UI",sans-serif'
  actx.fillText(h.tenNha, cx + CELL_W / 2, cy + 32, CELL_W - 30)
  actx.font = '600 22px system-ui,"Segoe UI",sans-serif'; actx.fillStyle = '#5a4a66'
  actx.fillText(h.chu + ' · ' + h.lop, cx + CELL_W / 2, cy + 64, CELL_W - 30)
  const sao = { go: 0, dong: 1, bac: 2, vang: 3 }[h.bac]
  actx.fillStyle = '#e8a400'; actx.font = '16px system-ui'
  if (sao) actx.fillText('★'.repeat(sao), cx + CELL_W - 36, cy + 20)
}
function signGeo(slot, w, hgt) {
  const g = new THREE.PlaneGeometry(w, hgt)
  const u0 = (slot % COLS) * CELL_W / atlas.width, u1 = u0 + CELL_W / atlas.width
  const row = Math.floor(slot / COLS), v1 = 1 - row * CELL_H / atlas.height, v0 = v1 - CELL_H / atlas.height
  const uv = g.attributes.uv
  uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0)
  return g
}

// ───────────── dựng phố ─────────────
const ROAD_HALF = 5, SIDE_END = 8, FACADE_X = SIDE_END + 2.6 // facade cách tim đường
const staticParts = [], signParts = []
const houses = []
let slotCount = 0

function genHouse(i) {
  const co = (() => { const r = R(); return r < 0.35 ? 0 : r < 0.7 ? 1 : r < 0.92 ? 2 : 3 })()
  const bac = co === 3 ? 'vang' : co === 2 ? pick(['bac', 'vang']) : co === 1 ? pick(['dong', 'bac']) : pick(['go', 'dong'])
  return {
    i, co, bac, kieu: pick(KIEU), tuong: pick(TUONG), mai: pick(MAI), rao: pick(['#fff', '#d9a066', '#ff9bb3', '#9bd1ff']),
    deco: Math.floor(R() * 8), tenNha: pick(TEN_NHA), chu: pick(TEN_CHU), lop: LOP[Math.floor(i / Math.max(1, N_NHA / 2 / LOP.length * 2)) % LOP.length],
  }
}
const sides = [{ sgn: -1, z: 0 }, { sgn: 1, z: 0 }]
for (let i = 0; i < N_NHA; i++) {
  const s = sides[i % 2], h = genHouse(i)
  h.side = s.sgn
  const lot = CO[h.co].lot
  h.zc = s.z + lot / 2; s.z += lot + 0.8
  houses.push(h)
}
const lenL = Math.max(sides[0].z, sides[1].z)
const zMid = lenL / 2
for (const h of houses) {
  const parts = buildHouse(h)
  const g = mergeGeometries(parts, false)
  for (const p of parts) p.dispose()
  g.rotateY(h.side < 0 ? Math.PI / 2 : -Math.PI / 2)
  g.translate(h.side * FACADE_X, 0, h.zc - zMid)
  staticParts.push(g)
  // biển trên cột trước cổng
  const slot = slotCount++ % (COLS * ROWS); drawSign(slot, h)
  const sw = 2.0 + h.co * 0.6, sh = sw * CELL_H / CELL_W
  const sg = signGeo(slot, sw, sh)
  const lx = 0.0, lz = 2.6 + 0.35
  const px = h.side * (FACADE_X - lz), pz = h.zc - zMid
  // biển LUÔN quay mặt về camera (billboard quanh trục đứng, làm trong vertex shader): plane tại gốc, aCtr = tâm thế giới
  const cy = 2.9 + h.co * 0.15, g2 = sg
  g2.translate(px, cy, pz)
  const n2 = g2.attributes.position.count, ctr = new Float32Array(n2 * 3)
  for (let k = 0; k < n2; k++) { ctr[k * 3] = px; ctr[k * 3 + 1] = cy; ctr[k * 3 + 2] = pz }
  g2.setAttribute('aCtr', new THREE.BufferAttribute(ctr, 3))
  signParts.push(g2)
  const post = []
  CYL(post, 0.07, 0.07, cy - 0.3, px, (cy - 0.3) / 2, pz, '#6b4a2b', 5)
  staticParts.push(mergeGeometries(post, false)); for (const p of post) p.dispose()
}

// mặt đất, đường, vỉa hè, cây, đèn, quảng trường
{
  const P = []
  const len = lenL + 40
  BOX(P, 400, 0.2, len + 200, 0, -0.1, 0, '#9ccf7a')
  BOX(P, ROAD_HALF * 2, 0.12, len, 0, 0.02, 0, '#6b6f7a')
  for (const sg of [-1, 1]) BOX(P, SIDE_END - ROAD_HALF, 0.16, len, sg * (ROAD_HALF + (SIDE_END - ROAD_HALF) / 2), 0.04, 0, '#dcd5c5')
  for (let z = -len / 2 + 2; z < len / 2; z += 5) BOX(P, 0.25, 0.01, 2.2, 0, 0.1, z, '#f4f0e0')
  for (let z = -lenL / 2 + 4; z < lenL / 2; z += 9) for (const sg of [-1, 1]) {
    CYL(P, 0.2, 0.28, 2.4, sg * 7.4, 1.2, z + (sg > 0 ? 0 : 4.5), '#7a5530', 6)
    BALL(P, 1.25, sg * 7.4, 3.0, z + (sg > 0 ? 0 : 4.5), '#4fa35a', 1, 1.1, 1)
    CYL(P, 0.06, 0.06, 3.0, sg * 5.6, 1.5, z + 2.2 + (sg > 0 ? 0 : 4.5), '#444', 5)
    BALL(P, 0.28, sg * 5.6, 3.1, z + 2.2 + (sg > 0 ? 0 : 4.5), '#ffe9a0')
  }
  // quảng trường cuối phố
  const zp = lenL / 2 + 16
  const disc = new THREE.CylinderGeometry(14, 14, 0.18, 24); disc.translate(0, 0.06, zp); P.push(colored(disc, '#e6dcc4'))
  CYL(P, 2.2, 2.4, 0.8, 0, 0.5, zp, '#b9b1a0', 12); CYL(P, 0.35, 0.35, 2.4, 0, 1.8, zp, '#b9b1a0', 8); BALL(P, 0.7, 0, 3.2, zp, '#8fd3ff')
  staticParts.push(mergeGeometries(P, false)); for (const p of P) p.dispose()
}

const levelMat = new THREE.MeshLambertMaterial({ vertexColors: true })
const staticMesh = new THREE.Mesh(mergeGeometries(staticParts, false), levelMat)
staticMesh.castShadow = !NHE; staticMesh.receiveShadow = !NHE
scene.add(staticMesh)
const atlasTex = new THREE.CanvasTexture(atlas)
atlasTex.colorSpace = THREE.SRGBColorSpace; atlasTex.anisotropy = NHE ? 2 : 8; atlasTex.generateMipmaps = true
const signMat = new THREE.MeshBasicMaterial({ map: atlasTex, side: THREE.DoubleSide })
const uYaw = { value: 0 }
signMat.onBeforeCompile = (sh) => {
  sh.uniforms.uYaw = uYaw
  sh.vertexShader = 'attribute vec3 aCtr; uniform float uYaw;\n' + sh.vertexShader.replace('#include <begin_vertex>',
    'vec3 lp = position - aCtr; float cy_ = cos(uYaw), sy_ = sin(uYaw);\n' +
    'vec3 transformed = aCtr + vec3(lp.x * cy_ + lp.z * sy_, lp.y, -lp.x * sy_ + lp.z * cy_);')
}
const signMesh = new THREE.Mesh(mergeGeometries(signParts, false), signMat)
signMesh.frustumCulled = false
scene.add(signMesh)

// ───────────── avatar (instanced) ─────────────
const body = new THREE.InstancedMesh(new THREE.BoxGeometry(0.55, 0.85, 0.34), new THREE.MeshLambertMaterial(), N_NGUOI)
const head = new THREE.InstancedMesh(new THREE.BoxGeometry(0.46, 0.46, 0.46), new THREE.MeshLambertMaterial(), N_NGUOI)
const legs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.4, 0.5, 0.3), new THREE.MeshLambertMaterial(), N_NGUOI)
body.castShadow = head.castShadow = !NHE
scene.add(body, head, legs)
const SKIN = ['#f6d2b0', '#e9b98f', '#c98d63', '#8d5a3b'], AO = ['#ff6b6b', '#4ecdc4', '#ffd23f', '#6a8cff', '#b185ff', '#ff9f43', '#5bd08a', '#ff7eb6']
const people = []
for (let i = 0; i < N_NGUOI; i++) {
  const p = { x: between(-6.5, 6.5), z: between(-lenL / 2, lenL / 2 + 8), tx: 0, tz: 0, sp: between(1.4, 2.4), ph: R() * 6.28, me: i === 0 }
  p.tx = p.x; p.tz = p.z
  body.setColorAt(i, new THREE.Color(p.me ? '#ffffff' : pick(AO))); head.setColorAt(i, new THREE.Color(pick(SKIN))); legs.setColorAt(i, new THREE.Color('#3a4a6a'))
  people.push(p)
}
const ME = people[0]
{ ME.x = ME.tx = 0; ME.z = ME.tz = lenL / 2 + 4; body.setColorAt(0, new THREE.Color('#ffd23f')) }
const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.75, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ff3d71' }))
scene.add(ring)
const marker = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 6).rotateX(Math.PI), new THREE.MeshBasicMaterial({ color: '#ff3d71' }))
scene.add(marker)

const tmp = new THREE.Object3D()
function stepPeople(dt, t) {
  for (let i = 0; i < people.length; i++) {
    const p = people[i]
    let dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz), moving = d > 0.15
    if (!moving && !p.me) { p.tx = between(-7, 7); p.tz = Math.max(-lenL / 2 - 6, Math.min(lenL / 2 + 10, p.z + between(-18, 18))); if (R() < 0.3) { p.tx = p.x; p.tz = p.z; p.wait = 1 + R() * 3 } }
    if (p.wait > 0) { p.wait -= dt; moving = false }
    if (moving) { const s = Math.min(d, p.sp * dt); p.x += dx / d * s; p.z += dz / d * s; p.ry = Math.atan2(dx, dz) }
    const bob = moving ? Math.abs(Math.sin(t * 9 + p.ph)) * 0.09 : 0
    const sc = p.me ? 1.18 : 1
    tmp.rotation.set(0, p.ry || 0, 0); tmp.scale.setScalar(sc)
    tmp.position.set(p.x, (0.5 + 0.425) * sc + bob, p.z); tmp.updateMatrix(); body.setMatrixAt(i, tmp.matrix)
    tmp.position.set(p.x, (0.5 + 0.85 + 0.23) * sc + bob, p.z); tmp.updateMatrix(); head.setMatrixAt(i, tmp.matrix)
    tmp.position.set(p.x, 0.25 * sc, p.z); tmp.updateMatrix(); legs.setMatrixAt(i, tmp.matrix)
  }
  body.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = legs.instanceMatrix.needsUpdate = true
  ring.position.set(ME.x, 0.14, ME.z)
  marker.position.set(ME.x, 2.95 + Math.sin(t * 4) * 0.12, ME.z)
}

// ───────────── camera: chếch ~42°, xoay 4 hướng, zoom ─────────────
const cam = { yaw: Math.PI / 6, yawT: Math.PI / 6, dist: 42, distT: 42, pitch: THREE.MathUtils.degToRad(42), tx: 0, tz: 0 }
const STEP = Math.PI / 2
const angLerp = (a, b, k) => { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * k }
function placeCam(dt) {
  const k = 1 - Math.exp(-dt * 8)
  cam.yaw = angLerp(cam.yaw, cam.yawT, k); uYaw.value = cam.yaw; cam.dist += (cam.distT - cam.dist) * k
  cam.tx += (ME.x - cam.tx) * (1 - Math.exp(-dt * 4)); cam.tz += (ME.z - cam.tz) * (1 - Math.exp(-dt * 4))
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch)
  camera.position.set(cam.tx + Math.sin(cam.yaw) * cp * cam.dist, sp * cam.dist, cam.tz + Math.cos(cam.yaw) * cp * cam.dist)
  camera.lookAt(cam.tx, 0.8, cam.tz)
  sun.position.set(cam.tx + 40, 70, cam.tz + 30); sun.target.position.set(cam.tx, 0, cam.tz)
}
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3()
CV.addEventListener('pointerdown', (e) => {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
  ray.setFromCamera(ndc, camera)
  if (ray.ray.intersectPlane(plane, hit)) {
    ME.tx = Math.max(-7, Math.min(7, hit.x)); ME.tz = Math.max(-lenL / 2 - 6, Math.min(lenL / 2 + 16, hit.z))
  }
})
const $ = (id) => document.getElementById(id)
$('bL').onclick = () => { cam.yawT += STEP }
$('bR').onclick = () => { cam.yawT -= STEP }
$('bIn').onclick = () => { cam.distT = Math.max(10, cam.distT - 6) }
$('bOut').onclick = () => { cam.distT = Math.min(70, cam.distT + 6) }
CV.addEventListener('wheel', (e) => { cam.distT = Math.max(10, Math.min(70, cam.distT + Math.sign(e.deltaY) * 3)); e.preventDefault() }, { passive: false })
$('bNhe').textContent = 'Bản ' + (NHE ? 'NHẸ' : 'ĐẸP') + ' (bấm đổi)'
$('bNhe').onclick = () => { Q.set('nhe', NHE ? '0' : '1'); location.search = Q.toString() }
async function snap(name) {
  renderer.render(scene, camera)
  const url = CV.toDataURL('image/jpeg', 0.85)
  try { return await (await fetch('/_snap?name=' + (name || 'lang'), { method: 'POST', body: url })).text() } catch { return 'no-server' }
}
$('bSnap').onclick = () => snap('lang')

// ───────────── vòng lặp + đo FPS ─────────────
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix() }
addEventListener('resize', resize); resize()
const stat = { fps: 0, min: 0, worst: 0, calls: 0, tris: 0, frames: 0, t0: performance.now(), samples: [] }
let last = performance.now(), acc = 0, accN = 0, accMax = 0, lastHud = last
const hud = $('hud')
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now
  stepPeople(dt, now / 1000); placeCam(dt)
  renderer.render(scene, camera)
  acc += dt; accN++; accMax = Math.max(accMax, dt)
  if (now - lastHud >= 1000) {
    stat.fps = accN / acc; stat.worst = 1 / accMax; stat.calls = renderer.info.render.calls; stat.tris = renderer.info.render.triangles
    stat.samples.push(stat.fps); acc = 0; accN = 0; accMax = 0; lastHud = now
    const warm = stat.samples.slice(2), avg = warm.length ? warm.reduce((a, b) => a + b, 0) / warm.length : stat.fps
    const ok = avg >= 30
    hud.innerHTML = `<b>${stat.fps.toFixed(0)} FPS</b> <span id="ok" style="background:${warm.length < 4 ? '#777' : ok ? '#2fb86a' : '#e5484d'}">${warm.length < 4 ? 'đang đo…' : ok ? 'ĐẠT ≥30' : 'TRƯỢT <30'}</span><br>` +
      `TB ${avg.toFixed(1)} · thấp nhất 1 khung ${stat.worst.toFixed(0)}<br>` +
      `draw calls ${stat.calls} · tam giác ${(stat.tris / 1000).toFixed(1)}k<br>` +
      `${N_NHA} nhà · ${N_NGUOI} người · bản ${NHE ? 'NHẸ' : 'ĐẸP'} · px ${renderer.getPixelRatio().toFixed(1)}`
  }
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
window.__lang = { step: (dt = 1, t = 1) => { stepPeople(dt, t); placeCam(5) }, stat, houses, people, cam, snap, THREE, scene, renderer, camera, ME, CO }
