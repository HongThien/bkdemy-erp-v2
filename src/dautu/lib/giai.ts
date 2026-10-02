// GIẢI ĐẤU 8 NGƯỜI — loại trực tiếp: Tứ kết (4 cặp) → Bán kết (2) → Chung kết.
// Thắng cặp mình thì CHỜ người thắng cặp bên cạnh rồi đấu ngay (không chờ cả vòng). Thiếu người ⇒ chủ giải thêm bot.
// Máy CHỦ GIẢI làm trọng tài cho MỌI trận (cả bot–bot); mọi người xem được trận đang diễn ra.
// Kênh `dtv-g:<mã>`: 'gd' = trạng thái giải, 'st' = Snap từng trận, 'tl' = câu trả lời gửi lên chủ giải.
import { kenhMoi, type KenhRT } from './sb'
import { taoBoDe, khoHuong, TI_LE_DAO, type HuongDo } from './boDe'
import { ganBot, nguoiBotGiai } from './bot'
import type { CapDo } from '../data/kho'
import { TrongTai, type NguoiTran, type Snap } from './trongTai'
import { taoKho, tron } from './tienich'
import { ttMoi, type PhienDau } from './phien'

export interface GheGiai extends NguoiTran { roi?: boolean }
export interface TranGiai { mid: string; vong: 0 | 1 | 2; a: number | null; b: number | null; thang: number | null; diem: [number, number] | null; dang: boolean; tu?: [string, string] }
export interface TrangThaiGiai {
  code: string
  pha: 'sanh' | 'dau' | 'xong'
  chu: string
  chuDe: string
  capDo: CapDo
  soCau: number
  huong: HuongDo
  ghe: GheGiai[]
  tran: TranGiai[]
  vd: number | null
  seq: number
}
export interface TTGiaiCucBo { ketNoi: 'dang' | 'ok' | 'loi'; chuRoi: boolean; loi: string }

export const TEN_VONG = ['Tứ kết', 'Bán kết', 'Chung kết']
const CAY: Record<string, [string, string]> = { s0: ['q0', 'q1'], s1: ['q2', 'q3'], f: ['s0', 's1'] }

export class GiaiDau {
  readonly code: string
  readonly laChu: boolean
  readonly toi: NguoiTran
  readonly st = taoKho<TrangThaiGiai | null>(null)
  readonly cb = taoKho<TTGiaiCucBo>({ ketNoi: 'dang', chuRoi: false, loi: '' })
  readonly snaps = taoKho<Record<string, Snap>>({})
  private ch: KenhRT
  private tai = new Map<string, TrongTai>()
  private huyBot: (() => void)[] = []
  private nhip: ReturnType<typeof setInterval> | null = null
  private vongNhan: Record<string, { i: number; luc: number }> = {}
  private chuDaThay = false

  constructor(o: { code: string; laChu: boolean; toi: NguoiTran; chuDe?: string; capDo?: CapDo; soCau?: number }) {
    this.code = o.code
    this.laChu = o.laChu
    this.toi = o.toi
    if (o.laChu) {
      this.st.dat({ code: o.code, pha: 'sanh', chu: o.toi.ma, chuDe: o.chuDe ?? 'tron', capDo: o.capDo ?? 'tat_ca', soCau: o.soCau ?? 10, huong: khoHuong.lay(), ghe: [o.toi], tran: [], vd: null, seq: 0 })
    }
    const ch = kenhMoi('dtv-g:' + o.code, o.toi.ma)
    this.ch = ch
    ch.on('presence', { event: 'sync' }, () => this.onPresence())
    ch.on('broadcast', { event: 'gd' }, ({ payload }) => { if (!this.laChu) this.st.dat(payload as TrangThaiGiai) })
    ch.on('broadcast', { event: 'st' }, ({ payload }) => { if (!this.laChu) this.nhanSnap(payload as Snap) })
    ch.on('broadcast', { event: 'tl' }, ({ payload }) => {
      if (!this.laChu) return
      const p = payload as { mid: string; ma: string; opt: string; rt: number; i: number }
      const t = this.tai.get(p.mid)
      if (!t) return
      const s = t.snap
      const g = s.nguoi.findIndex((n) => n.ma === p.ma)
      if (g < 0 || s.i !== p.i) return
      t.traLoi(g as 0 | 1, p.opt, p.rt)
    })
    ch.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        ch.track({ ma: o.toi.ma, ten: o.toi.ten, nv: o.toi.nv, cap: o.toi.cap, chu: o.laChu, t: Date.now() })
        this.cb.dat((x) => ({ ...x, ketNoi: 'ok' }))
        if (this.laChu) this.phatGiai()
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') this.cb.dat((x) => ({ ...x, ketNoi: 'loi', loi: 'Không kết nối được giải đấu' }))
    })
    if (this.laChu) this.nhip = setInterval(() => {
      this.phatGiai()
      for (const t of this.tai.values()) if (!t.snap.ketQua) this.gui('st', t.snap)
    }, 2500)
  }

  private gui(event: string, payload: unknown) { this.ch.send({ type: 'broadcast', event, payload }) }

  private sua(f: (s: TrangThaiGiai) => void) {
    const s = this.st.lay()
    if (!s) return
    const moi: TrangThaiGiai = JSON.parse(JSON.stringify(s))
    f(moi)
    moi.seq++
    this.st.dat(moi)
    this.gui('gd', moi)
  }
  private phatGiai() { const s = this.st.lay(); if (s) this.gui('gd', s) }

  private nhanSnap(s: Snap) {
    const v = this.vongNhan[s.mid]
    if (s.pha === 'vong' && (!v || v.i !== s.i)) this.vongNhan[s.mid] = { i: s.i, luc: performance.now() }
    this.snaps.dat((x) => ({ ...x, [s.mid]: s }))
  }

  private onPresence() {
    const ds = Object.values(this.ch.presenceState<{ ma: string; ten: string; nv: string; cap?: number; chu: boolean; t: number }>())
      .map((x) => x[x.length - 1]).sort((a, b) => a.t - b.t)
    if (!this.laChu) {
      const chu = ds.find((x) => x.chu)
      if (chu) this.chuDaThay = true
      else if (this.chuDaThay) this.cb.dat((x) => ({ ...x, chuRoi: true }))
      return
    }
    const coMat = new Set(ds.map((x) => x.ma))
    const s = this.st.lay()
    if (!s) return
    if (s.pha === 'sanh') {
      this.sua((g) => {
        g.ghe = g.ghe.filter((x) => x.bot || coMat.has(x.ma))
        for (const x of ds) if (!g.ghe.some((y) => y.ma === x.ma) && g.ghe.length < 8) g.ghe.push({ ma: x.ma, ten: x.ten, nv: x.nv, cap: x.cap })
      })
    } else {
      // rời giữa giải: đánh dấu, trận đang đấu xử thua, trận sau tự thua
      const roiMoi = s.ghe.map((x, i) => (!x.bot && !x.roi && !coMat.has(x.ma) ? i : -1)).filter((i) => i >= 0)
      if (!roiMoi.length) return
      this.sua((g) => { for (const i of roiMoi) g.ghe[i].roi = true })
      for (const t of this.st.lay()!.tran) {
        if (!t.dang) continue
        const tt = this.tai.get(t.mid)
        if (tt && t.a !== null && roiMoi.includes(t.a)) tt.bo(0)
        else if (tt && t.b !== null && roiMoi.includes(t.b)) tt.bo(1)
      }
    }
  }

  // ── chủ giải ──
  themBot() {
    this.sua((g) => { if (g.ghe.length < 8) g.ghe.push(nguoiBotGiai(g.ghe.length)) })
  }
  boGhe(i: number) {
    this.sua((g) => { if (g.ghe[i]?.bot) g.ghe.splice(i, 1) })
  }
  datCauHinh(c: Partial<Pick<TrangThaiGiai, 'chuDe' | 'capDo' | 'soCau' | 'huong'>>) {
    this.sua((g) => Object.assign(g, c))
  }

  batDau() {
    const s = this.st.lay()
    if (!s || !this.laChu || s.pha !== 'sanh') return
    this.sua((g) => {
      while (g.ghe.length < 8) g.ghe.push(nguoiBotGiai(g.ghe.length))
      g.ghe = tron(g.ghe)
      g.tran = [
        ...[0, 1, 2, 3].map((k) => ({ mid: 'q' + k, vong: 0 as const, a: 2 * k, b: 2 * k + 1, thang: null, diem: null, dang: false })),
        { mid: 's0', vong: 1, a: null, b: null, thang: null, diem: null, dang: false },
        { mid: 's1', vong: 1, a: null, b: null, thang: null, diem: null, dang: false },
        { mid: 'f', vong: 2, a: null, b: null, thang: null, diem: null, dang: false },
      ]
      g.pha = 'dau'
    })
    for (const k of [0, 1, 2, 3]) this.chayTran('q' + k)
  }

  private chayTran(mid: string) {
    const s = this.st.lay()!
    const t = s.tran.find((x) => x.mid === mid)!
    if (t.a === null || t.b === null) return
    const nguoi: [NguoiTran, NguoiTran] = [s.ghe[t.a], s.ghe[t.b]]
    const tai = new TrongTai({ mid, nguoi, ds: taoBoDe({ chuDe: s.chuDe, capDo: s.capDo, soCau: s.soCau, tiLeDao: TI_LE_DAO[s.huong ?? 'tron'] }) })
    this.tai.set(mid, tai)
    nguoi.forEach((n, i) => { if (n.bot) this.huyBot.push(ganBot(tai, i as 0 | 1, n.bot)) })
    this.sua((g) => { g.tran.find((x) => x.mid === mid)!.dang = true })
    tai.dangKy((sn) => {
      this.snaps.dat((x) => ({ ...x, [mid]: sn }))
      this.gui('st', sn)
      if (sn.ketQua) this.xongTran(mid, sn)
    })
    tai.bat()
    // người đã rời ⇒ xử thua ngay khi trận mở
    const gs = s.ghe
    if (gs[t.a].roi) setTimeout(() => tai.bo(0), 800)
    else if (gs[t.b].roi) setTimeout(() => tai.bo(1), 800)
  }

  private xongTran(mid: string, sn: Snap) {
    const s = this.st.lay()!
    const t = s.tran.find((x) => x.mid === mid)!
    if (t.thang !== null) return
    let w = sn.ketQua!.thang
    if (w === -1) {
      // hoà ⇒ ai đúng nhiều hơn; vẫn hoà ⇒ ai tổng thời gian đúng ít hơn
      w = sn.dung[0] !== sn.dung[1] ? (sn.dung[0] > sn.dung[1] ? 0 : 1)
        : sn.tg[0].reduce((a, b) => a + b, 0) <= sn.tg[1].reduce((a, b) => a + b, 0) ? 0 : 1
    }
    const ngThang = w === 0 ? t.a! : t.b!
    this.sua((g) => {
      const x = g.tran.find((y) => y.mid === mid)!
      x.thang = ngThang
      x.diem = [sn.diem[0], sn.diem[1]]
      x.dang = false
      for (const [cha, [l, r]] of Object.entries(CAY)) {
        const c = g.tran.find((y) => y.mid === cha)!
        if (l === mid) c.a = ngThang
        if (r === mid) c.b = ngThang
      }
      if (mid === 'f') { g.pha = 'xong'; g.vd = ngThang }
    })
    setTimeout(() => this.tai.get(mid)?.huy(), 4000)
    // trận cha đủ 2 người thì đấu luôn (sau 4s cho người thắng xem kết quả)
    for (const [cha, [l, r]] of Object.entries(CAY)) {
      if (l !== mid && r !== mid) continue
      const c = this.st.lay()!.tran.find((y) => y.mid === cha)!
      if (c.a !== null && c.b !== null && !c.dang && c.thang === null) setTimeout(() => this.chayTran(cha), 4500)
    }
  }

  /** Phiên đấu cho 1 trận trong giải (để màn trận đấu dùng chung với các chế độ khác). */
  phien(mid: string): PhienDau {
    const self = this
    const tt = ttMoi()
    const gheToi = (): (0 | 1)[] => {
      const sn = self.snaps.lay()[mid]
      const g = sn?.nguoi.findIndex((n) => n.ma === self.toi.ma) ?? -1
      return g < 0 ? [] : [g as 0 | 1]
    }
    return {
      loai: 'giai', coTamDung: false, chuDe: this.st.lay()?.chuDe ?? 'tron', tt,
      get gheToi() { return gheToi() },
      dangKy(f) {
        const cu = self.snaps.lay()[mid]
        if (cu) f(cu)
        let seq = cu?.seq ?? -1
        let midSeq = cu?.mid
        return self.snaps.nghe((all) => { const s = all[mid]; if (s && (s.seq !== seq || s.mid !== midSeq)) { seq = s.seq; midSeq = s.mid; f(s) } })
      },
      traLoi(g, opt) {
        if (self.laChu) { self.tai.get(mid)?.traLoi(g, opt); return }
        const sn = self.snaps.lay()[mid]
        if (!sn || sn.pha !== 'vong') return
        self.gui('tl', { mid, ma: self.toi.ma, opt, i: sn.i, rt: Math.round(performance.now() - (self.vongNhan[mid]?.luc ?? performance.now())) })
      },
      roi() { /* rời trận = rời giải, xử ở GiaiDau.roi() */ },
    }
  }

  roi() {
    if (this.nhip) clearInterval(this.nhip)
    this.huyBot.forEach((f) => f())
    this.tai.forEach((t) => t.huy())
    this.ch.huy()
  }
}
