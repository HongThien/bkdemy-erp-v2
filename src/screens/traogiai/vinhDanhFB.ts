// ẢNH VINH DANH ĐĂNG FACEBOOK (Thùy 11/11) — khổ dọc 4:5, 1080×1350. Đơn nền: design/DON-HANG-VINH-DANH-THANG.md.
// Nền do ChatGPT vẽ (public/bk-ui/vinhdanh/*.jpg): khung ảnh có LỖ tô xanh #00FF00. Ở đây:
//   1. khoá xanh CHỈ vùng xanh LIỀN KHỐI chứa tâm lỗ (flood fill) — lá cây / bóng bay xanh ở chỗ khác của nền Tiến bộ giữ nguyên;
//   2. vẽ ảnh HS (cover, lệch lên trên để giữ mặt) vào khung bao của lỗ, rồi đè nền đã khoá lên ⇒ ảnh khớp đúng hình lỗ;
//   3. chữ + số vẽ bằng canvas từ fn_vinh_danh_hs (mọi con số tính ở DB — §2.0).
import { supabase } from '../../lib/supabase'

export const FB_W = 1080
export const FB_H = 1350

export type LoaiNen = 'xuat_sac' | 'tien_bo' | 'tieu_bieu'
// Bộ nền. 'loai' = mỗi loại giải 1 tranh (vd_<id>_<loại>.jpg) · 'chung' = 1 tranh dùng cho MỌI loại (vd_<id>.jpg) — màu loại giải chỉ ở thẻ kết quả.
// Vị trí băng tên + đỉnh thẻ kết quả (% chiều cao), đo trên tranh thật.
// vong = độ võng ruy băng đo trên tranh (px ở ±30% bề ngang so với tâm; ÂM = hai đầu cao hơn giữa) ⇒ chữ tên uốn theo.
type CauHinhNen = { bangY: number; bangX0: number; bangX1: number; bangDay: number; chuBang: string; vong: number }
// tone = kiểu chữ theo không khí tranh (Thùy 11/11 "font phải đi theo tone background"): sang = có chân (Lora) · tron = tròn mềm (Baloo 2) · phieu = fantasy (Philosopher).
export type Tone = 'sang' | 'tron' | 'phieu'
type BoNen = ({ kieu: 'loai'; cfg: Record<LoaiNen, CauHinhNen> } | { kieu: 'chung'; cfg: CauHinhNen }) & { id: string; ten: string; nhom: string; tone: Tone }
const T = '#ffffff'
const c = (bangY: number, bangDay: number, vong: number, chuBang = T, bangX0 = 18, bangX1 = 82): CauHinhNen => ({ bangY, bangX0, bangX1, bangDay, chuBang, vong })
export const BO_NEN: BoNen[] = [
  { id: 'hoanggia', ten: 'Hoàng gia', nhom: 'Theo loại giải', kieu: 'loai', tone: 'sang', cfg: { xuat_sac: c(63.8, 70, -27, T, 17, 83), tien_bo: c(63.2, 70, -16, T, 17, 83), tieu_bieu: c(61.7, 68.5, -15, T, 17, 83) } },
  { id: 'pastel', ten: 'Pastel 3D', nhom: 'Theo loại giải', kieu: 'loai', tone: 'tron', cfg: { xuat_sac: c(60.8, 67.5, -22, T, 19, 81), tien_bo: c(61.0, 67, -37, T, 17, 83), tieu_bieu: c(60.6, 66.5, -34) } },
  { id: 'phieuluu', ten: 'Phiêu lưu', nhom: 'Theo loại giải', kieu: 'loai', tone: 'phieu', cfg: { xuat_sac: c(63.1, 69.5, -29), tien_bo: c(62.7, 69.5, -20), tieu_bieu: c(62.5, 69.5, -16) } },
  { id: 'tl_co_dien_do_do', ten: 'Cổ điển đỏ', nhom: 'Thanh lịch (mọi loại)', kieu: 'chung', tone: 'sang', cfg: c(62.7, 68.5, -23, T, 17, 83) },
  { id: 'tl_xanh_rung_co_dien', ten: 'Xanh rừng cổ điển', nhom: 'Thanh lịch (mọi loại)', kieu: 'chung', tone: 'sang', cfg: c(60.2, 66.5, -36, '#6b1d1d', 18, 82) },
  { id: 'tl_kien_truc_oxford', ten: 'Kiến trúc Oxford', nhom: 'Thanh lịch (mọi loại)', kieu: 'chung', tone: 'sang', cfg: c(62.3, 68.5, -26, T, 18, 82) },
  { id: 'tl_do_navy_trang_nha', ten: 'Đỏ navy trang nhã', nhom: 'Thanh lịch (mọi loại)', kieu: 'chung', tone: 'sang', cfg: c(62.4, 69, -18, T, 17, 83) },
  { id: 'tl_khuon_vien_xanh_luc', ten: 'Khuôn viên xanh lục', nhom: 'Thanh lịch (mọi loại)', kieu: 'chung', tone: 'sang', cfg: c(61.2, 67.5, -25, T, 18, 82) },
  { id: 'tl_toi_gian_cot_da', ten: 'Tối giản cột đá', nhom: 'Thanh lịch (mọi loại)', kieu: 'chung', tone: 'sang', cfg: c(60.3, 67, -16, T, 19, 81) },
]
export type PhongCach = string
// Nền đang chọn ở Xưởng ảnh — dùng chung cho Chiếu; sống tới F5.
export const NHO_NEN: { nen: PhongCach } = { nen: 'hoanggia' }
export const PHONG_CACH = BO_NEN.map((b) => ({ id: b.id, ten: b.ten, nhom: b.nhom }))
function boNen(pc: PhongCach): BoNen { const b = BO_NEN.find((x) => x.id === pc); if (!b) throw new Error('Không có bộ nền ' + pc); return b }

const LOAI: Record<LoaiNen, { ten: string; nhan: string; nhan2: string; file: string }> = {
  xuat_sac: { ten: 'HỌC SINH XUẤT SẮC', nhan: '#b07d12', nhan2: '#1f3a7a', file: 'xuatsac' },
  tien_bo: { ten: 'HỌC SINH TIẾN BỘ', nhan: '#0f8f8a', nhan2: '#1d5fb8', file: 'tienbo' },
  tieu_bieu: { ten: 'XUẤT SẮC NHẤT KHỐI', nhan: '#c0234a', nhan2: '#7a2a8c', file: 'tieubieu' },
}

export type VinhDanhData = {
  hoTen: string; maHs: string | null; anhUrl: string | null; anhChanDung?: string | null; mon: string; ym: string
  lop: string | null; khoi: string | null; loaiGiai: string | null; kyThi: string | null
  diemTest: number | null; hangLop: number | null; tongLop: number | null; hangKhoi: number | null; tongKhoi: number | null
  dangDat: number; dangDo: number; masteryPct: number | null
}

export async function getVinhDanhData(hsId: string, mon: string, ym: string): Promise<VinhDanhData> {
  const { data, error } = await supabase.rpc('fn_vinh_danh_hs', { p_hs: hsId, p_mon: mon, p_ym: ym })
  if (error) throw error
  return data as VinhDanhData
}

// ẢNH HỌC SINH: KHO (hoc_sinh_kho_anh — mọi ảnh đã tải, không đè) + ẢNH ĐANG CHỌN cho vinh danh (hoc_sinh_anh_chan_dung,
// 1 dòng/em). KHÔNG đụng hoc_sinh.anh_url (avatar app em tự chọn). Thu nhỏ ở máy (cạnh dài ≤1000, JPEG) rồi đưa lên bucket
// public 'avatars' thư mục chan-dung/. Tải lên = thêm vào kho + chọn luôn ảnh đó. File cũ để nguyên trong bucket (Luật xoá).
export type AnhKho = { id: string; url: string; tai_at: string }
export async function getKhoAnh(hsId: string): Promise<AnhKho[]> {
  const { data, error } = await supabase.from('hoc_sinh_kho_anh').select('id, url, tai_at').eq('hoc_sinh_id', hsId).order('tai_at', { ascending: false }).limit(100)
  if (error) throw error
  return (data ?? []) as AnhKho[]
}
export async function chonAnhChanDung(hsId: string, url: string): Promise<void> {
  const { error } = await supabase.from('hoc_sinh_anh_chan_dung')
    .upsert({ hoc_sinh_id: hsId, url, cap_nhat_at: new Date().toISOString() }, { onConflict: 'hoc_sinh_id' })
  if (error) throw error
}
// Tải lên: CẮT THEO MẶT TRƯỚC (catMat.ts) rồi mới đưa lên. thayMat = false ⇒ không thấy mặt, đưa cả ảnh (thu nhỏ).
export async function uploadAnhChanDung(hsId: string, file: File): Promise<{ url: string; thayMat: boolean }> {
  if (!file.type.startsWith('image/')) throw new Error('Chọn một file ảnh (JPG, PNG, WebP).')
  const { catTheoMat } = await import('./catMat')
  const { blob, thayMat } = await catTheoMat(file)
  const path = `chan-dung/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
  if (error) throw error
  const url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  const { error: e2 } = await supabase.from('hoc_sinh_kho_anh').insert({ hoc_sinh_id: hsId, url })
  if (e2) throw e2
  await chonAnhChanDung(hsId, url)
  return { url, thayMat }
}
export async function getAnhChanDung(hsIds: string[]): Promise<Record<string, string>> {
  if (!hsIds.length) return {}
  const { data, error } = await supabase.from('hoc_sinh_anh_chan_dung').select('hoc_sinh_id, url').in('hoc_sinh_id', hsIds).limit(1000)
  if (error) throw error
  return Object.fromEntries(((data ?? []) as { hoc_sinh_id: string; url: string }[]).map((r) => [r.hoc_sinh_id, r.url]))
}

export function nenUrl(pc: PhongCach, loai: LoaiNen) {
  return boNen(pc).kieu === 'chung' ? `/bk-ui/vinhdanh/vd_${pc}.jpg` : `/bk-ui/vinhdanh/vd_${pc}_${LOAI[loai].file}.jpg`
}

function taiAnh(src: string, cors: boolean): Promise<HTMLImageElement> {
  return new Promise((ok, fail) => {
    const im = new Image()
    if (cors) im.crossOrigin = 'anonymous'
    im.onload = () => ok(im)
    im.onerror = () => fail(new Error('Không tải được ảnh: ' + src))
    im.src = src
  })
}

// Khoá xanh: trả canvas nền (lỗ trong suốt) + khung bao lỗ.
type NenKhoa = { cv: HTMLCanvasElement; lo: { x: number; y: number; w: number; h: number } }
const CACHE_NEN = new Map<string, Promise<NenKhoa>>()
function khoaXanh(src: string): Promise<NenKhoa> {
  const c = CACHE_NEN.get(src)
  if (c) return c
  const p = (async () => {
    const im = await taiAnh(src, false)
    const cv = document.createElement('canvas'); cv.width = FB_W; cv.height = FB_H
    const g = cv.getContext('2d')!
    g.drawImage(im, 0, 0, FB_W, FB_H)
    const id = g.getImageData(0, 0, FB_W, FB_H); const px = id.data
    const xanh = (i: number) => px[i * 4 + 1] - Math.max(px[i * 4], px[i * 4 + 2]) // độ "xanh lá" của điểm i
    // tìm hạt giống: điểm xanh đậm gần tâm lỗ dự kiến (50% W, 37% H)
    let seed = -1
    for (let r = 0; r < 300 && seed < 0; r += 4) {
      for (let a = 0; a < 16 && seed < 0; a++) {
        const x = Math.round(FB_W * 0.5 + r * Math.cos(a * Math.PI / 8)), y = Math.round(FB_H * 0.37 + r * Math.sin(a * Math.PI / 8))
        if (x >= 0 && y >= 0 && x < FB_W && y < FB_H && xanh(y * FB_W + x) > 120) seed = y * FB_W + x
      }
    }
    if (seed < 0) throw new Error('Nền không có lỗ xanh: ' + src)
    const N = FB_W * FB_H
    const vung = new Uint8Array(N) // 1 = lõi lỗ
    const q = new Int32Array(N); let h = 0, t = 0
    q[t++] = seed; vung[seed] = 1
    let x0 = FB_W, y0 = FB_H, x1 = 0, y1 = 0
    while (h < t) {
      const i = q[h++]; const x = i % FB_W, y = (i - x) / FB_W
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
      const nb = [x > 0 ? i - 1 : -1, x < FB_W - 1 ? i + 1 : -1, y > 0 ? i - FB_W : -1, y < FB_H - 1 ? i + FB_W : -1]
      for (const j of nb) if (j >= 0 && !vung[j] && xanh(j) > 60) { vung[j] = 1; q[t++] = j }
    }
    // lõi: trong suốt hẳn. Viền (3 px quanh lõi): alpha theo độ xanh + khử ám xanh.
    for (let i = 0; i < N; i++) if (vung[i]) px[i * 4 + 3] = 0
    for (let pass = 0; pass < 3; pass++) {
      const moi: number[] = []
      for (let i = 0; i < N; i++) {
        if (vung[i]) continue
        const x = i % FB_W
        const ke = (x > 0 && vung[i - 1]) || (x < FB_W - 1 && vung[i + 1]) || (i >= FB_W && vung[i - FB_W]) || (i < N - FB_W && vung[i + FB_W])
        if (!ke) continue
        moi.push(i)
        const gx = xanh(i)
        if (gx > 0) {
          const k = i * 4
          px[k + 3] = Math.round(255 * Math.max(0, Math.min(1, 1 - gx / 140)))
          px[k + 1] = Math.max(px[k], px[k + 2]) // khử ám xanh
        }
      }
      for (const i of moi) vung[i] = 2
    }
    g.putImageData(id, 0, 0)
    return { cv, lo: { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 } }
  })()
  CACHE_NEN.set(src, p)
  p.catch(() => CACHE_NEN.delete(src))
  return p
}

function bo(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath()
}
function vuaChu(g: CanvasRenderingContext2D, s: string, font: (px: number) => string, maxW: number, start: number, min: number) {
  let px = start
  g.font = font(px)
  while (px > min && g.measureText(s).width > maxW) { px -= 2; g.font = font(px) }
  return px
}

const TONE: Record<Tone, { ho: string; can: (w: number) => number; the: string; vien: number; chu: string; phu: string; nho: string }> = {
  // the = nền thẻ kết quả · chu/phu/nho = màu dòng phụ, nhãn ô, chú thích dưới số
  sang: { ho: "'Lora', Georgia, 'Times New Roman', serif", can: (w) => (w >= 700 ? 700 : 600), the: 'rgba(255,251,242,.93)', vien: 2, chu: '#5b4a33', phu: '#7a6a55', nho: '#8f806c' },
  tron: { ho: "'Baloo 2', 'Be Vietnam Pro', Arial, sans-serif", can: (w) => w, the: 'rgba(255,255,255,.90)', vien: 2, chu: '#4a5878', phu: '#6a7894', nho: '#7d8aa5' },
  phieu: { ho: "'Philosopher', 'Be Vietnam Pro', Arial, sans-serif", can: (w) => (w >= 600 ? 700 : 400), the: 'rgba(250,248,255,.90)', vien: 2, chu: '#3f4a72', phu: '#5d6790', nho: '#77809f' },
}

export async function veVinhDanhFB(d: VinhDanhData, loai: LoaiNen, pc: PhongCach): Promise<HTMLCanvasElement> {
  const bn = boNen(pc), tn = TONE[bn.tone]
  const F = (w: number, px: number) => `${tn.can(w)} ${px}px ${tn.ho}`
  await Promise.all([800, 700, 600].map((w) => document.fonts.load(F(w, 40), 'ẮÂÊÔƠƯ')))
  const nen = await khoaXanh(nenUrl(pc, loai))
  const ch = bn.kieu === 'chung' ? bn.cfg : bn.cfg[loai], L = LOAI[loai]
  const cv = document.createElement('canvas'); cv.width = FB_W; cv.height = FB_H
  const g = cv.getContext('2d')!
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, FB_W, FB_H)

  // ① ảnh HS sau lỗ (cover; lệch lên 35% để giữ mặt). Không có ảnh ⇒ hình người mờ.
  const { lo } = nen
  const pad = 6
  const anh = d.anhChanDung || d.anhUrl // ưu tiên ảnh chân dung đã tải lên; không có mới dùng avatar app
  let coAnh = !!anh
  if (anh) {
    try {
      const im = await taiAnh(anh, true)
      const s = Math.max((lo.w + pad * 2) / im.width, (lo.h + pad * 2) / im.height)
      const w = im.width * s, h = im.height * s
      g.drawImage(im, lo.x - pad + (lo.w + pad * 2 - w) / 2, lo.y - pad + (lo.h + pad * 2 - h) * 0.35, w, h)
    } catch { coAnh = false }
  }
  if (!coAnh) {
    g.fillStyle = '#dfe7f3'; g.fillRect(lo.x - pad, lo.y - pad, lo.w + pad * 2, lo.h + pad * 2)
    g.fillStyle = '#b6c6de'
    g.beginPath(); g.arc(lo.x + lo.w / 2, lo.y + lo.h * 0.4, lo.w * 0.18, 0, Math.PI * 2); g.fill()
    g.beginPath(); g.ellipse(lo.x + lo.w / 2, lo.y + lo.h * 0.98, lo.w * 0.36, lo.h * 0.3, 0, Math.PI, 0); g.fill()
  }
  // ② nền đã khoá xanh
  g.drawImage(nen.cv, 0, 0)

  // ③ tên trên băng
  const by = FB_H * ch.bangY / 100, bw = FB_W * (ch.bangX1 - ch.bangX0) / 100
  g.textAlign = 'center'; g.textBaseline = 'middle'
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 8; g.shadowOffsetY = 2
  g.fillStyle = ch.chuBang
  const ten = d.hoTen.toUpperCase()
  const px = vuaChu(g, ten, (p) => F(800, p), bw * 0.86, 54, 28)
  g.font = F(800, px)
  // Uốn chữ theo ruy băng: y = by + a·u² (u = khoảng cách tới giữa ảnh), mỗi chữ cái xoay theo độ dốc tại chỗ nó đứng.
  const a = ch.vong / (FB_W * 0.3) ** 2
  const kyTu = Array.from(ten.normalize('NFC'))
  const rong = kyTu.map((k) => g.measureText(k).width)
  let x = FB_W / 2 - rong.reduce((s, w) => s + w, 0) / 2
  g.textAlign = 'center'
  kyTu.forEach((k, idx) => {
    const xm = x + rong[idx] / 2, u = xm - FB_W / 2
    g.save(); g.translate(xm, by + 2 + a * u * u); g.rotate(Math.atan(2 * a * u)); g.fillText(k, 0, 0); g.restore()
    x += rong[idx]
  })
  g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0

  // ④ bảng kết quả: thẻ kính trắng
  const px0 = FB_W * 0.07, pw = FB_W * 0.86
  const py0 = FB_H * ch.bangDay / 100 + 14, ph = FB_H * 0.965 - py0
  g.save()
  g.shadowColor = 'rgba(30,40,80,.18)'; g.shadowBlur = 24; g.shadowOffsetY = 6
  bo(g, px0, py0, pw, ph, 30); g.fillStyle = tn.the; g.fill()
  g.restore()
  bo(g, px0, py0, pw, ph, 30); g.lineWidth = 2; g.strokeStyle = L.nhan + '55'; g.stroke()

  const [y, m] = d.ym.split('-')
  let cy = py0 + 44
  const tieuDe = loai === 'tieu_bieu' ? `HỌC SINH ${L.ten}${d.khoi ? ' ' + d.khoi : ''}` : L.ten
  g.fillStyle = L.nhan; vuaChu(g, tieuDe, (px) => F(800, px), pw - 60, 44, 30)
  g.fillText(tieuDe, FB_W / 2, cy)
  cy += 44
  const phu = [d.lop ? `Lớp ${d.lop}` : null, `Môn ${d.mon}`, `Sát hạch tháng ${Number(m)}/${y}`].filter(Boolean).join('  ·  ')
  g.fillStyle = tn.chu; vuaChu(g, phu, (px) => F(600, px), pw - 60, 26, 18)
  g.fillText(phu, FB_W / 2, cy)

  // 4 ô: Hạng lớp · Hạng khối · Mastery · Test tháng
  const o = [
    { nhan: 'HẠNG LỚP', so: d.hangLop != null ? `${d.hangLop}` : '—', phu: d.tongLop ? `/${d.tongLop} bạn` : '' },
    { nhan: d.khoi ? `HẠNG KHỐI ${d.khoi}` : 'HẠNG KHỐI', so: d.hangKhoi != null ? `${d.hangKhoi}` : '—', phu: d.tongKhoi ? `/${d.tongKhoi} bạn` : '' },
    { nhan: 'THÀNH THẠO KIẾN THỨC', so: d.masteryPct != null ? `${d.masteryPct}%` : '—', phu: d.dangDo ? `${d.dangDat}/${d.dangDo} dạng · 30 ngày` : 'chưa đo' },
    { nhan: 'TEST THÁNG', so: d.diemTest != null ? String(d.diemTest).replace('.', ',') : '—', phu: 'điểm / 10' },
  ]
  const gap = 14, ox0 = px0 + 24, ow = (pw - 48 - gap * 3) / 4
  const oy = cy + 30, oh = py0 + ph - 54 - oy
  // 4 nhãn cùng một cỡ chữ (cỡ vừa nhãn dài nhất) cho đều hàng.
  const pxNhan = Math.min(...o.map((c) => vuaChu(g, c.nhan, (px) => F(700, px), ow - 12, 19, 13)))
  o.forEach((c, i) => {
    const x = ox0 + i * (ow + gap)
    bo(g, x, oy, ow, oh, 20)
    const gr = g.createLinearGradient(0, oy, 0, oy + oh); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, L.nhan + '14')
    g.fillStyle = gr; g.fill(); g.lineWidth = 1.5; g.strokeStyle = L.nhan + '40'; g.stroke()
    const cx = x + ow / 2
    g.fillStyle = tn.phu; g.font = F(700, pxNhan); g.fillText(c.nhan, cx, oy + 28)
    g.fillStyle = i < 2 ? L.nhan2 : L.nhan
    vuaChu(g, c.so, (px) => F(800, px), ow - 16, Math.min(64, oh * 0.42), 30); g.fillText(c.so, cx, oy + oh * 0.53)
    g.fillStyle = tn.nho; vuaChu(g, c.phu, (px) => F(600, px), ow - 14, 17, 11); g.fillText(c.phu, cx, oy + oh - 24)
  })
  g.fillStyle = L.nhan2; g.font = F(800, 20)
  g.fillText('BK ACADEMY', FB_W / 2, py0 + ph - 26)
  return cv
}
