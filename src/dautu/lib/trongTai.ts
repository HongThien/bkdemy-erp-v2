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
  /** nhật ký từng câu: mỗi ghế mỗi câu 1 dòng (chon '' = không trả lời / hết giờ); ms = phản xạ */
  nk: { i: number; ghe: 0 | 1; chon: string; dung: boolean; ms: number }[]
}

/** Kết quả chấm 1 câu ở máy chủ (đề chấm ngoài): dungId = id phương án đúng (lộ SAU khi đã trả lời/bỏ qua). */
export interface KqChamTran { dung: boolean; dungId: string; giai: string | null }
export type ChamTran = (i: number, opt: string | null, ms: number) => Promise<KqChamTran>

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
  // CHẤM Ở MÁY CHỦ (đề chấm ngoài): ghế nào trong gheCham thì đúng/sai do máy chủ quyết. Mọi cuộc gọi xếp hàng tuần tự (máy chủ đòi đúng thứ tự câu).
  private cham: ChamTran | null = null
  private gheCham = new Set<number>()
  private dangCho = new Set<number>()
  private daCham = new Set<string>()
  private hang: Promise<unknown> = Promise.resolve()

  constructor(o: { mid: string; nguoi: [NguoiTran, NguoiTran]; ds: Cau[]; giayVong?: number; cham?: { ghe: (0 | 1)[]; goi: ChamTran } }) {
    if (o.cham) { this.cham = o.cham.goi; this.gheCham = new Set(o.cham.ghe) }
    this.msVong = (o.giayVong ?? GIAY_VONG) * 1000
    this.s = {
      mid: o.mid, nguoi: o.nguoi, ds: o.ds, i: 0, pha: 'dem', conLai: MS_DEM, tong: MS_DEM,
      diem: [0, 0], chuoi: [0, 0], chuoiMax: [0, 0], dung: [0, 0], thu: [0, 0], tg: [[], []], sai: [[], []],
      dungCham: [false, false], thangVong: null, cong: [0, 0], giayThang: 0, ketQua: null, seq: 0, nk: [],
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
    if (s.ketQua || s.pha !== 'vong' || s.sai[ghe].length > 0 || this.ungVien.some((u) => u.ghe === ghe) || this.dangCho.has(ghe)) return // đã bấm câu này rồi
    const troiQua = performance.now() - this.batDauVong
    const r = Math.max(50, Math.min(rt ?? troiQua, troiQua + 400))
    if (this.cham && this.gheCham.has(ghe)) { this.guiCham(ghe, opt, r); return }
    this.apDung(ghe, opt, opt === s.ds[s.i].dung, r)
  }

  /** BOT khi đáp án nằm ở máy chủ: bot không biết đáp án, chỉ quyết "đúng/sai" theo xác suất của mức bot. */
  traLoiBot(ghe: 0 | 1, dung: boolean, rt?: number) {
    const s = this.s
    if (s.ketQua || s.pha !== 'vong' || s.sai[ghe].length > 0 || this.ungVien.some((u) => u.ghe === ghe)) return
    const troiQua = performance.now() - this.batDauVong
    this.apDung(ghe, dung ? '#bot-dung' : '?', dung, Math.max(50, Math.min(rt ?? troiQua, troiQua + 400)))
  }

  /** gửi câu trả lời của ghế "chấm ngoài" lên máy chủ; chốt vòng được HOÃN tới khi có kết quả (độ trễ mạng không làm người chơi thua oan) */
  private guiCham(ghe: 0 | 1, opt: string, r: number) {
    const i = this.s.i
    this.dangCho.add(ghe)
    this.xepHang(() => this.cham!(i, opt, r)).then((res) => {
      this.dangCho.delete(ghe); this.daCham.add(i + ':' + ghe)
      this.loDapAn(i, res)
      if (this.s.i === i && this.s.pha === 'vong' && !this.s.ketQua) this.apDung(ghe, opt, res.dung, r)
      else this.phat()
    }).catch(() => { this.dangCho.delete(ghe) }) // mất mạng: coi như chưa bấm
  }

  private loDapAn(i: number, res: KqChamTran) {
    const c = this.s.ds[i]
    if (!c) return
    c.dung = res.dungId
    if (res.giai) c.giai = res.giai
  }

  private xepHang<T>(f: () => Promise<T>): Promise<T> {
    const p = this.hang.then(f, f)
    this.hang = p.then(() => undefined, () => undefined)
    return p
  }

  /** chờ mọi cuộc gọi máy chủ đã xếp hàng (trước khi ghi kết quả trận) */
  chamXong(): Promise<void> { return this.hang.then(() => undefined) }

  private apDung(ghe: 0 | 1, opt: string, dung: boolean, r: number) {
    const s = this.s
    s.thu[ghe]++
    s.nk.push({ i: s.i, ghe, chon: opt.startsWith('#bot') || opt === '?' ? '' : opt, dung, ms: Math.round(r) })
    if (!dung) {
      s.sai[ghe].push(opt)
      const khac = (1 - ghe) as 0 | 1
      if (s.sai[khac].length > 0 && !this.ungVien.length && !this.henBu && this.dangCho.size === 0) { this.hetGio(); return } // cả 2 đã sai ⇒ hết câu, khỏi chờ đồng hồ
      this.phat()
      return
    }
    this.ungVien.push({ ghe, rt: r })
    if (!this.henBu) this.henBu = setTimeout(() => this.chotVong(), MS_CHO_BU)
  }

  private chotVong() {
    if (this.dangCho.size > 0) { this.henBu = setTimeout(() => this.chotVong(), 80); return } // còn câu trả lời đang chờ máy chủ chấm
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
    if (this.dangCho.size > 0 && this.s.pha === 'vong') { this.hen = setTimeout(() => this.hetGio(), 80); return } // chờ máy chủ chấm nốt câu đã bấm
    const s = this.s
    s.thangVong = -1
    s.chuoi = [0, 0]
    this.ketVong()
  }

  private ketVong() {
    // ghế nào chưa có dòng ở câu này = không kịp trả lời (hết giờ / đối thủ đã ăn câu)
    for (const g of [0, 1] as const) if (!this.s.nk.some((x) => x.i === this.s.i && x.ghe === g)) this.s.nk.push({ i: this.s.i, ghe: g, chon: '', dung: false, ms: Math.round(performance.now() - this.batDauVong) })
    // ghế chấm ở máy chủ mà chưa trả lời câu này (bot ăn trước / hết giờ) ⇒ "bỏ qua" để máy chủ ghi nhận + lộ đáp án (sau khi mất câu)
    if (this.cham) {
      const i = this.s.i, ms = performance.now() - this.batDauVong
      for (const g of this.gheCham) {
        if (this.daCham.has(i + ':' + g) || this.dangCho.has(g)) continue
        this.daCham.add(i + ':' + g)
        this.xepHang(() => this.cham!(i, null, ms)).then((res) => { this.loDapAn(i, res); this.phat() }).catch(() => undefined)
      }
    }
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
