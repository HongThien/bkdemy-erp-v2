// CẮT ẢNH HỌC SINH THEO MẶT trước khi đưa lên (Thùy 11/11: "PH gửi nhiều thể loại — focus vào mặt, cắt xong mới đưa lên").
// Cùng luật với lô 192 ảnh nhập 11/11 (DEVLOG): dò mặt bằng MediaPipe FaceDetector → khung dọc 4:5, cao = max(3 × chiều cao mặt, 450 px),
// tâm mặt ở 42% chiều cao khung, dồn vào trong ảnh; ra cạnh ngang ≤ 800 px, JPEG.
// Bộ dò tải LƯỜI từ CDN (chỉ khi bấm thêm ảnh, không vào bundle). Không thấy mặt / không tải được bộ dò ⇒ giữ cả ảnh (thu cạnh dài ≤1000).
const BAN = '0.10.14'
type MatHop = { x: number; y: number; w: number; h: number; s: number }
type BoDo = { detect: (img: CanvasImageSource) => { detections: { boundingBox?: { originX: number; originY: number; width: number; height: number }; categories: { score: number }[] }[] } }
let boDo: Promise<BoDo> | null = null
function layBoDo(): Promise<BoDo> {
  if (!boDo) {
    boDo = (async () => {
      const m = await import(/* @vite-ignore */ `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${BAN}/vision_bundle.mjs`)
      const fs = await m.FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${BAN}/wasm`)
      return m.FaceDetector.createFromOptions(fs, {
        baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite' },
        runningMode: 'IMAGE', minDetectionConfidence: 0.5,
      }) as Promise<BoDo>
    })()
    boDo.catch(() => { boDo = null })
  }
  return boDo
}

function matLonNhat(det: BoDo, cv: HTMLCanvasElement, ox: number, oy: number, k: number): MatHop | null {
  let b: MatHop | null = null
  for (const d of det.detect(cv).detections) {
    const bb = d.boundingBox; if (!bb) continue
    const r = { x: ox + bb.originX / k, y: oy + bb.originY / k, w: bb.width / k, h: bb.height / k, s: d.categories[0]?.score ?? 0 }
    // chọn mặt ĐỘ TIN CAO NHẤT (không phải to nhất: giấy khen/áo in hình hay bị nhận nhầm thành mặt to, độ tin thấp); sát nhau thì lấy to hơn
    if (!b || r.s > b.s + 0.05 || (Math.abs(r.s - b.s) <= 0.05 && r.w * r.h > b.w * b.h)) b = r
  }
  return b
}

function veLai(bmp: ImageBitmap, sx: number, sy: number, sw: number, sh: number, k: number) {
  const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(sw * k)); cv.height = Math.max(1, Math.round(sh * k))
  const g = cv.getContext('2d')!; g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height)
  g.drawImage(bmp, sx, sy, sw, sh, 0, 0, cv.width, cv.height)
  return cv
}

async function timMat(bmp: ImageBitmap): Promise<MatHop | null> {
  const det = await layBoDo()
  const W = bmp.width, H = bmp.height
  let k = Math.min(1, 1024 / Math.max(W, H))
  let b = matLonNhat(det, veLai(bmp, 0, 0, W, H, k), 0, 0, k)
  if (b) return b
  // ảnh toàn thân chụp xa: dò trên từng ô con nửa ảnh, phóng to
  for (const [fx, fy] of [[0, 0], [0.5, 0], [0.25, 0], [0, 0.25], [0.5, 0.25], [0.25, 0.25], [0, 0.5], [0.5, 0.5], [0.25, 0.5]]) {
    const sx = Math.round(W * fx), sy = Math.round(H * fy), sw = Math.round(W * 0.5), sh = Math.round(H * 0.5)
    k = Math.min(2, 1024 / Math.max(sw, sh))
    const r = matLonNhat(det, veLai(bmp, sx, sy, sw, sh, k), sx, sy, k)
    if (r && (!b || r.s > b.s)) b = r
  }
  return b
}

const thanhBlob = (cv: HTMLCanvasElement) => new Promise<Blob>((ok, no) => cv.toBlob((b) => (b ? ok(b) : no(new Error('Không xử lý được ảnh.'))), 'image/jpeg', 0.9))

export async function catTheoMat(file: File): Promise<{ blob: Blob; thayMat: boolean }> {
  const bmp = await createImageBitmap(file) // trình duyệt tự xoay theo EXIF
  const W = bmp.width, H = bmp.height
  let mat: MatHop | null = null
  try { mat = await timMat(bmp) } catch { mat = null }
  if (!mat) return { blob: await thanhBlob(veLai(bmp, 0, 0, W, H, Math.min(1, 1000 / Math.max(W, H)))), thayMat: false }
  let ch = Math.max(3 * mat.h, 450), cw = 0.8 * ch
  if (cw > W) { cw = W; ch = cw / 0.8 }
  if (ch > H) { ch = H; cw = ch * 0.8 }
  const cx = mat.x + mat.w / 2, cy = mat.y + mat.h / 2 - 0.42 * ch + ch / 2
  const x = Math.max(0, Math.min(W - cw, cx - cw / 2)), y = Math.max(0, Math.min(H - ch, cy - ch / 2))
  return { blob: await thanhBlob(veLai(bmp, x, y, cw, ch, Math.min(1, 800 / cw))), thayMat: true }
}
