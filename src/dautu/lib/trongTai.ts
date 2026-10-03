// TRỌNG TÀI 1 trận — chạy ở 1 máy duy nhất (máy chủ phòng / máy chơi bot), máy khác chỉ nhận ảnh chụp (Snap).
// Luật (theo bản gốc Bufopia, đọc từ mã nguồn 02/10):
//  · 4 đáp án, mỗi từ 12 giây, hai bên cùng trả lời — AI ĐÚNG TRƯỚC ĂN TỪ ĐÓ. **MỖI NGƯỜI CHỈ BẤM 1 LẦN/CÂU** (Thùy 03/10, mọi môn —
//    spec-che-do-game.md §4): sai ⇒ khoá CẢ câu với người đó, đối thủ làm tiếp tới hết giờ; cả 2 cùng sai ⇒ hết câu luôn.
//    (Bufopia gốc cho bấm tiếp đáp án khác ⇒ bấm lần lượt 4 đáp án là ăn — thành game nhanh tay, đã bỏ.)
//  · Điểm: đúng < 2s = 100 · < 4s = 70 · còn lại 50; mỗi chuỗi 3 câu đúng liền +30.
//  · "Đúng trước" so theo thời gian phản xạ mỗi máy tự đo (rt), chờ thêm 220ms sau đáp án đúng đầu tiên để bù trễ mạng.
// ⚠ DEMO: máy chủ phòng là trọng tài (tin máy chủ). Khi khớp HS BK + có thưởng season ⇒ chuyển trọng tài xuống server (spec §3).
import type { Cau } from '../nguon/kieu'

export type MucBot = 'de' | 'vua' | 'kho'
export interface NguoiTran { ma: string; ten: string; nv: string; cap?: number; bot?: MucBot }
export type Pha = 'dem' | 'vong' | 'ket' | 'dung' | 'het'
export interface KetQua { thang: -1 | 0 | 1; bo: -1 | 0 | 1 }
export interface Snap {
  mid: string
  nguoi: [NguoiTran, NguoiTran]
  ds: Cau[]
  i: number
  pha: Pha
  conLai: number
  tong: number
  diem: [number, number]
  chuoi: [number, number]
  chuoiMax: [number, number]
  dung: [number, number]
  thu: [number, number]
  tg: [number[], number[]]
  sai: [string[], string[]]
  dungCham: [boolean, boolean] // vòng này có đúng nhưng chậm hơn đối thủ
  thangVong: -1 | 0 | 1 | null
  cong: [number, number]
  giayThang: number
  ketQua: KetQua | null
  seq: number
}

export const GIAY_VONG = 12
const MS_DEM = 3000
const MS_KET = 1900
const MS_CHO_BU = 220

/** Ngưỡng tốc độ CO GIÃN theo thời gian câu của môn: 12s ⇒ 2s/4s (như bản gốc); 45s (Toán) ⇒ 7,5s/15s. */
export function diemVong(giay: number, chuoi: number, soSai: number, giayVong = GIAY_VONG) {
  if (soSai >= 3) return 50
  const k = giayVong / GIAY_VONG
  return (giay < 2 * k ? 100 : giay < 4 * k ? 70 : 50) + (chuoi > 0 && chuoi % 3 === 0 ? 30 : 0)
}

export class TrongTai {
  private s: Snap
  private hen: ReturnType<typeof setTimeout> | null = null
  private henBu: ReturnType<typeof setTimeout> | null = null
  private hanChot = 0
  private batDauVong = 0
  private ungVien: { ghe: 0 | 1; rt: number }[] = []
  private phaTruocDung: Pha = 'vong'
  private conLaiKhiDung = 0
  private dungLuc = 0
  private nghe = new Set<(s: Snap) => void>()
  private msVong: number

  constructor(o: { mid: string; nguoi: [NguoiTran, NguoiTran]; ds: Cau[]; giayVong?: number }) {
    this.msVong = (o.giayVong ?? GIAY_VONG) * 1000
    this.s = {
      mid: o.mid, nguoi: o.nguoi, ds: o.ds, i: 0, pha: 'dem', conLai: MS_DEM, tong: MS_DEM,
      diem: [0, 0], chuoi: [0, 0], chuoiMax: [0, 0], dung: [0, 0], thu: [0, 0], tg: [[], []], sai: [[], []],
      dungCham: [false, false], thangVong: null, cong: [0, 0], giayThang: 0, ketQua: null, seq: 0,
    }
  }

  dangKy(f: (s: Snap) => void) {
    this.nghe.add(f)
    f(this.anh())
    return () => { this.nghe.delete(f) }
  }

  get snap() { return this.anh() }
  /** thời gian 1 câu (ms) — bot co giãn tốc độ theo số này */
  get msMoiVong() { return this.msVong }

  private anh(): Snap {
    return JSON.parse(JSON.stringify({ ...this.s, conLai: Math.max(0, Math.round(this.hanChot - performance.now())) }))
  }

  private phat() {
    this.s.seq++
    const a = this.anh()
    this.nghe.forEach((f) => f(a))
  }

  private datHen(ms: number, f: () => void) {
    if (this.hen) clearTimeout(this.hen)
    this.hanChot = performance.now() + ms
    this.hen = setTimeout(f, ms)
  }

  bat() {
    this.s.pha = 'dem'
    this.s.tong = MS_DEM
    this.datHen(MS_DEM, () => this.batVong(0))
    this.phat()
  }

  private batVong(i: number) {
    const s = this.s
    s.i = i
    s.pha = 'vong'
    s.tong = this.msVong
    s.sai = [[], []]
    s.dungCham = [false, false]
    s.thangVong = null
    s.cong = [0, 0]
    s.giayThang = 0
    this.ungVien = []
    this.batDauVong = performance.now()
    this.datHen(this.msVong, () => this.hetGio())
    this.phat()
  }

  /** rt = thời gian phản xạ (ms) do máy người chơi đo; bỏ trống = trọng tài tự đo (người chơi cùng máy, bot). */
  traLoi(ghe: 0 | 1, opt: string, rt?: number) {
    const s = this.s
    if (s.ketQua || s.pha !== 'vong' || s.sai[ghe].length > 0 || this.ungVien.some((u) => u.ghe === ghe)) return // đã bấm câu này rồi
    const troiQua = performance.now() - this.batDauVong
    const r = Math.max(50, Math.min(rt ?? troiQua, troiQua + 400))
    const cau = s.ds[s.i]
    s.thu[ghe]++
    if (opt !== cau.dung) {
      s.sai[ghe].push(opt)
      const khac = (1 - ghe) as 0 | 1
      if (s.sai[khac].length > 0 && !this.ungVien.length && !this.henBu) { this.hetGio(); return } // cả 2 đã sai ⇒ hết câu, khỏi chờ đồng hồ
      this.phat()
      return
    }
    this.ungVien.push({ ghe, rt: r })
    if (!this.henBu) this.henBu = setTimeout(() => this.chotVong(), MS_CHO_BU)
  }

  private chotVong() {
    this.henBu = null
    const s = this.s
    if (s.pha !== 'vong' || !this.ungVien.length) return
    const tot = [...this.ungVien].sort((a, b) => a.rt - b.rt)
    const w = tot[0].ghe
    const l = (1 - w) as 0 | 1
    if (tot.length > 1) s.dungCham[l] = true
    const giay = tot[0].rt / 1000
    s.chuoi[w]++
    s.chuoi[l] = 0
    s.chuoiMax[w] = Math.max(s.chuoiMax[w], s.chuoi[w])
    s.dung[w]++
    s.tg[w].push(Math.round(giay * 100) / 100)
    const d = diemVong(giay, s.chuoi[w], s.sai[w].length, this.msVong / 1000)
    s.diem[w] += d
    s.cong = w === 0 ? [d, 0] : [0, d]
    s.thangVong = w
    s.giayThang = Math.round(giay * 10) / 10
    this.ketVong()
  }

  private hetGio() {
    if (this.henBu) return // đang chờ bù trễ — chotVong sẽ chốt
    const s = this.s
    s.thangVong = -1
    s.chuoi = [0, 0]
    this.ketVong()
  }

  private ketVong() {
    this.s.pha = 'ket'
    this.s.tong = MS_KET
    this.datHen(MS_KET, () => (this.s.i + 1 < this.s.ds.length ? this.batVong(this.s.i + 1) : this.ketThuc()))
    this.phat()
  }

  private ketThuc() {
    const [a, b] = this.s.diem
    this.s.pha = 'het'
    this.s.tong = 0
    this.s.ketQua = { thang: a > b ? 0 : b > a ? 1 : -1, bo: -1 }
    this.huyHen()
    this.phat()
  }

  /** Bỏ cuộc / rời trận ⇒ đối thủ thắng. */
  bo(ghe: 0 | 1) {
    if (this.s.ketQua) return
    this.s.pha = 'het'
    this.s.ketQua = { thang: (1 - ghe) as 0 | 1, bo: ghe }
    this.huyHen()
    this.phat()
  }

  tamDung(on: boolean) {
    const s = this.s
    if (on && (s.pha === 'vong' || s.pha === 'dem' || s.pha === 'ket')) {
      this.phaTruocDung = s.pha
      this.conLaiKhiDung = Math.max(0, this.hanChot - performance.now())
      this.dungLuc = performance.now()
      this.huyHen()
      s.pha = 'dung'
      this.phat()
    } else if (!on && s.pha === 'dung') {
      s.pha = this.phaTruocDung
      this.batDauVong += performance.now() - this.dungLuc
      const tiep = s.pha === 'dem' ? () => this.batVong(0) : s.pha === 'vong' ? () => this.hetGio() : () => (s.i + 1 < s.ds.length ? this.batVong(s.i + 1) : this.ketThuc())
      this.datHen(this.conLaiKhiDung, tiep)
      this.phat()
    }
  }

  private huyHen() {
    if (this.hen) clearTimeout(this.hen)
    if (this.henBu) clearTimeout(this.henBu)
    this.hen = null
    this.henBu = null
  }

  huy() {
    this.huyHen()
    this.nghe.clear()
  }
}

/** Thống kê cuối trận cho 1 ghế (hiển thị — số đã có sẵn trong Snap, chỉ trình bày). */
export function thongKe(s: Snap, g: 0 | 1) {
  const tg = s.tg[g]
  return {
    dung: s.dung[g],
    nhanhNhat: tg.length ? Math.min(...tg) : null,
    chinhXac: s.thu[g] ? Math.round((s.dung[g] / s.thu[g]) * 100) : 0,
    chuoi: s.chuoiMax[g],
  }
}
