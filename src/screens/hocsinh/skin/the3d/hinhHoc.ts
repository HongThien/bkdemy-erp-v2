// ============================================================================
// Hình học + nhiễu dùng chung cho cảnh 3D của bản đồ phiêu lưu (thế giới · lục địa · chặng đường).
// Lục địa = đa giác "blob" bo mượt → trường khoảng cách có dấu (SDF) → lưới độ cao. Vùng = Voronoi có trọng số + gợn sóng.
// Mọi thứ TẤT ĐỊNH theo seed: cùng chủ đề luôn ra cùng hình (em nhớ đường). Đây là phần TRÌNH BÀY, không phải luật nghiệp vụ.
// ============================================================================

/** Bộ sinh số giả ngẫu nhiên tất định (mulberry32). */
export function rng(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function bam(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export const kep = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export function smooth(a: number, b: number, v: number) {
  const t = kep((v - a) / (b - a || 1e-9), 0, 1)
  return t * t * (3 - 2 * t)
}

// ---------- nhiễu giá trị 2D (value noise) + fbm ----------
function hash2(ix: number, iy: number, seed: number) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 2147483647)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
export function nhieu(x: number, y: number, seed = 1) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy)
  const a = hash2(ix, iy, seed), b = hash2(ix + 1, iy, seed), c = hash2(ix, iy + 1, seed), d = hash2(ix + 1, iy + 1, seed)
  return lerp(lerp(a, b, u), lerp(c, d, u), v)
}
export function fbm(x: number, y: number, seed = 1, oct = 3) {
  let s = 0, a = 0.5, f = 1, n = 0
  for (let i = 0; i < oct; i++) { s += a * nhieu(x * f, y * f, seed + i * 17); n += a; a *= 0.5; f *= 2.03 }
  return s / n // 0..1
}

// ---------- đa giác blob bo mượt ----------
export type Diem = [number, number]
export type OpBlob = { n?: number; go?: number; sx?: number; sz?: number }

/** Blob quanh (cx, cz), bán kính r. Trả các điểm ĐÃ dày (Catmull-Rom) để tính SDF chính xác. */
export function blob(cx: number, cz: number, r: number, seed: number, op: OpBlob = {}): Diem[] {
  const n = op.n ?? 40, go = op.go ?? 0.3, sx = op.sx ?? 1, sz = op.sz ?? 1
  const R = rng(seed), p0 = R() * 6.28, p1 = R() * 6.28, p2 = R() * 6.28, pts: Diem[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const k = 1 + go * (0.5 * Math.sin(2 * a + p0) + 0.3 * Math.sin(3 * a + p1) + 0.2 * Math.sin(5 * a + p2)) + (R() - 0.5) * 0.1
    pts.push([cx + Math.cos(a) * r * k * sx, cz + Math.sin(a) * r * k * sz])
  }
  return day(pts, 4)
}
/** Làm dày đường cong kín bằng Catmull-Rom (mỗi cạnh chia k đoạn). */
export function day(p: Diem[], k: number): Diem[] {
  const n = p.length, out: Diem[] = []
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n]
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ])
    }
  }
  return out
}
/** Catmull-Rom MỞ (đường đi): lấy mẫu `k` điểm mỗi đoạn qua các điểm điều khiển. */
export function duongCong(p: Diem[], k: number): Diem[] {
  const n = p.length, out: Diem[] = []
  for (let i = 0; i < n - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(n - 1, i + 2)]
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ])
    }
  }
  out.push(p[n - 1])
  return out
}

export function trongDaGiac(x: number, z: number, poly: Diem[]) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j]
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c
  }
  return c
}
/** Khoảng cách tới đường gấp khúc (đóng nếu `kin`). */
export function khoangCachDuong(x: number, z: number, poly: Diem[], kin = true) {
  let best = Infinity
  const n = poly.length
  for (let i = 0; i < (kin ? n : n - 1); i++) {
    const a = poly[i], b = poly[(i + 1) % n]
    const dx = b[0] - a[0], dz = b[1] - a[1], l2 = dx * dx + dz * dz
    const t = l2 ? kep(((x - a[0]) * dx + (z - a[1]) * dz) / l2, 0, 1) : 0
    const ex = x - (a[0] + dx * t), ez = z - (a[1] + dz * t)
    const d = ex * ex + ez * ez
    if (d < best) best = d
  }
  return Math.sqrt(best)
}
/** SDF có dấu: dương = TRONG đất liền, âm = ngoài biển. */
export function sdf(x: number, z: number, poly: Diem[]) {
  const d = khoangCachDuong(x, z, poly)
  return trongDaGiac(x, z, poly) ? d : -d
}
export function hopBao(poly: Diem[]) {
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity
  for (const [x, z] of poly) { x0 = Math.min(x0, x); z0 = Math.min(z0, z); x1 = Math.max(x1, x); z1 = Math.max(z1, z) }
  return { x0, z0, x1, z1 }
}

// ---------- vùng trong lục địa: Voronoi có trọng số + gợn sóng ----------
export const VI_TRI_VUNG: Record<number, Diem[]> = {
  1: [[0, 0]],
  2: [[-0.5, 0], [0.5, 0]],
  3: [[-0.5, -0.28], [0.5, -0.28], [0, 0.5]],
  4: [[-0.55, -0.3], [0.5, -0.35], [-0.38, 0.45], [0.52, 0.42]],
  5: [[-0.58, -0.32], [0.5, -0.4], [-0.45, 0.45], [0.55, 0.42], [0, 0.02]],
}
export type HatVung = { x: number; z: number; w: number }
/** Hạt vùng: số dạng nhiều ⇒ trọng số lớn ⇒ vùng to (spec-v1-app-hs §4.5). */
export function hatVung(soDang: number[], cx: number, cz: number, R: number): HatVung[] {
  const k = Math.max(1, soDang.length), nmax = Math.max(...soDang)
  // 1–5 vùng dùng bố cục tay (đã chỉnh cho cân); nhiều hơn thì 1 vùng giữa + vòng quanh
  const vt: Diem[] = VI_TRI_VUNG[k] ?? [[0, 0], ...Array.from({ length: k - 1 }, (_, i): Diem => [Math.cos((i / (k - 1)) * Math.PI * 2 - 1.2) * 0.62, Math.sin((i / (k - 1)) * Math.PI * 2 - 1.2) * 0.62])]
  return soDang.map((n, i) => ({
    x: cx + vt[i][0] * R * 1.1, z: cz + vt[i][1] * R * 0.85,
    w: R * R * 0.69 * Math.sqrt(n / nmax), // 62000px² @ R=300px → 0,69·R²
  }))
}
/** Vùng chứa điểm (x,z): trả chỉ số + "lề" tới vùng sát nhất (để vẽ biên giới). Có gợn sóng để biên không thẳng đuột. */
export function vungTai(x: number, z: number, hat: HatVung[], seed: number): { id: number; le: number } {
  const wx = x + (fbm(x * 0.22, z * 0.22, seed, 2) - 0.5) * 2.4, wz = z + (fbm(x * 0.22 + 40, z * 0.22 + 40, seed, 2) - 0.5) * 2.4
  let b1 = Infinity, b2 = Infinity, id = 0
  for (let i = 0; i < hat.length; i++) {
    const d = (wx - hat[i].x) ** 2 + (wz - hat[i].z) ** 2 - hat[i].w
    if (d < b1) { b2 = b1; b1 = d; id = i } else if (d < b2) b2 = d
  }
  return { id, le: Math.sqrt(Math.max(0, b2 - b1)) }
}
