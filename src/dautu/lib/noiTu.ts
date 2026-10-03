// NỐI TỪ — từ sau bắt đầu bằng chữ cái cuối của từ trước, không lặp, phải là từ tiếng Anh thật.
// Kiểm từ: kho game trước, không có thì hỏi Wiktionary (dự phòng dictionaryapi.dev như bản gốc). Từ điển mất mạng ⇒ không trừ điểm.
// 3 chế độ: TỰ DO (1 mình, không giờ) · ĐẤU BOT · PHÒNG ONLINE 2–6 người (chủ phòng làm trọng tài).
import { TU, timTheoEn } from '../data/kho'
import { kenhMoi } from './sb'
import { chon, taoKho } from './tienich'
import type { MucBot } from './trongTai'

export interface KqKiem { ok: boolean; mang?: boolean; vi?: string; nghia?: string; ipa?: string; vd?: string }
const boNho = new Map<string, KqKiem>()

export async function kiemTu(w: string): Promise<KqKiem> {
  const t = w.toLowerCase().trim()
  const k = timTheoEn(t)
  if (k) return { ok: true, vi: k.vi, ipa: k.ipa, vd: k.vd }
  if (boNho.has(t)) return boNho.get(t)!
  // Nguồn 1: Wiktionary (CORS mở, nhanh). Nguồn 2: dictionaryapi.dev (đo 03/10: từ máy văn phòng gọi không tới).
  const kq = (await traWiktionary(t)) ?? (await traDictApi(t))
  if (!kq) return { ok: false, mang: true }
  boNho.set(t, kq)
  return kq
}

async function layJson(url: string): Promise<{ status: number; j: unknown } | null> {
  try {
    const ctl = new AbortController()
    const h = setTimeout(() => ctl.abort(), 5000)
    const r = await fetch(url, { signal: ctl.signal })
    clearTimeout(h)
    return { status: r.status, j: r.ok ? await r.json() : null }
  } catch { return null }
}

const boHtml = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

async function traWiktionary(t: string): Promise<KqKiem | null> {
  const r = await layJson('https://en.wiktionary.org/api/rest_v1/page/definition/' + encodeURIComponent(t))
  if (!r) return null
  if (r.status === 404) return { ok: false }
  if (r.status !== 200) return null
  const en = (r.j as { en?: { definitions?: { definition?: string; examples?: string[] }[] }[] }).en
  const d = en?.flatMap((x) => x.definitions ?? []).find((x) => boHtml(x.definition ?? ''))
  if (!d) return { ok: false }
  return { ok: true, nghia: boHtml(d.definition!).slice(0, 160), vd: d.examples?.[0] ? boHtml(d.examples[0]).slice(0, 140) : undefined }
}

async function traDictApi(t: string): Promise<KqKiem | null> {
  const r = await layJson('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(t))
  if (!r) return null
  if (r.status === 404) return { ok: false }
  if (r.status !== 200) return null
  const j = r.j as { phonetic?: string; meanings?: { definitions?: { definition?: string; example?: string }[] }[] }[]
  const d = j[0]?.meanings?.[0]?.definitions?.[0]
  return { ok: true, nghia: d?.definition, vd: d?.example, ipa: j[0]?.phonetic }
}

const TU_DON = TU.map((t) => t.en.toLowerCase()).filter((w) => /^[a-z]{3,}$/.test(w))
const THEM = ['xylophone', 'xray', 'yogurt', 'zebra', 'zero', 'zone', 'quiz', 'queen', 'quick', 'quiet', 'jump', 'juice', 'jacket', 'kite', 'king', 'young', 'yellow', 'yard', 'year', 'unit', 'under', 'uncle', 'violin', 'visit', 'village', 'image', 'island', 'idea', 'orange', 'ocean', 'open', 'egg', 'eagle', 'earth', 'nest', 'night', 'name', 'tree', 'tiger', 'table', 'rabbit', 'river', 'robot']
const KHO_BOT = [...new Set([...TU_DON, ...THEM])]
const CHU_KHO = new Set(['x', 'z', 'q', 'j', 'v', 'k', 'y'])

export function botChonTu(chu: string, daDung: Set<string>, muc: MucBot): string | null {
  const ung = KHO_BOT.filter((w) => w.startsWith(chu) && !daDung.has(w))
  if (!ung.length) return null
  if (muc === 'kho') {
    const hiem = ung.filter((w) => CHU_KHO.has(w[w.length - 1]))
    if (hiem.length && Math.random() < 0.6) return chon(hiem)
  }
  return chon(ung)
}

export interface NguoiNT { ma: string; ten: string; nv: string; bot?: MucBot; tim: number; diem: number; roi?: boolean }
export interface TuNT { w: string; ai: number; vi?: string; nghia?: string; ipa?: string; vd?: string }
export interface SnapNT {
  pha: 'cho' | 'dau' | 'het'
  tuDo: boolean
  nguoi: NguoiNT[]
  tu: TuNT[]
  luot: number
  conLai: number
  tong: number
  chu: string
  thongBao: string
  dangKiem: boolean
  thang: number | null
  seq: number
}

const MS_LUOT = 20000
const TIM = 3
const conSong = (s: SnapNT) => s.nguoi.map((n, i) => (n.tim > 0 && !n.roi ? i : -1)).filter((i) => i >= 0)

/** Trọng tài nối từ — chạy ở máy chủ (hoặc máy chơi 1 mình / đấu bot). */
export class TrongTaiNT {
  private s: SnapNT
  private hen: ReturnType<typeof setTimeout> | null = null
  private henBot: ReturnType<typeof setTimeout> | null = null
  private han = 0
  private nghe = new Set<(s: SnapNT) => void>()

  constructor(nguoi: Omit<NguoiNT, 'tim' | 'diem'>[], tuDo = false) {
    this.s = { pha: 'cho', tuDo, nguoi: nguoi.map((n) => ({ ...n, tim: TIM, diem: 0 })), tu: [], luot: 0, conLai: 0, tong: MS_LUOT, chu: '', thongBao: '', dangKiem: false, thang: null, seq: 0 }
  }
  get snap(): SnapNT { return { ...JSON.parse(JSON.stringify(this.s)), conLai: Math.max(0, Math.round(this.han - performance.now())) } }
  dangKy(f: (s: SnapNT) => void) { this.nghe.add(f); f(this.snap); return () => { this.nghe.delete(f) } }
  private phat() { this.s.seq++; const a = this.snap; this.nghe.forEach((f) => f(a)) }

  themNguoi(n: Omit<NguoiNT, 'tim' | 'diem'>) {
    if (this.s.pha !== 'cho' || this.s.nguoi.some((x) => x.ma === n.ma) || this.s.nguoi.length >= 6) return
    this.s.nguoi.push({ ...n, tim: TIM, diem: 0 }); this.phat()
  }
  boNguoi(ma: string) {
    const i = this.s.nguoi.findIndex((x) => x.ma === ma)
    if (i < 0) return
    if (this.s.pha === 'cho') { this.s.nguoi.splice(i, 1); this.phat(); return }
    this.s.nguoi[i].roi = true
    if (this.s.luot === i && this.s.pha === 'dau') this.sangLuot(`${this.s.nguoi[i].ten} đã rời phòng`)
    else this.kiemKetThuc()
    this.phat()
  }

  bat() {
    this.s.pha = 'dau'
    this.s.luot = 0
    this.batLuot()
  }

  private batLuot() {
    if (this.hen) clearTimeout(this.hen)
    if (this.henBot) clearTimeout(this.henBot)
    const s = this.s
    if (!s.tuDo) {
      this.han = performance.now() + MS_LUOT
      this.hen = setTimeout(() => this.hetGio(), MS_LUOT)
    }
    const ng = s.nguoi[s.luot]
    if (ng?.bot) {
      this.henBot = setTimeout(() => {
        const daDung = new Set(s.tu.map((t) => t.w))
        const biRoi = Math.random() < (ng.bot === 'de' ? 0.12 : ng.bot === 'vua' ? 0.06 : 0.02) && s.tu.length > 2
        const w = biRoi ? null : botChonTu(s.chu || chon('abcdefghilmnoprstw'.split('')), daDung, ng.bot!)
        if (!w) { this.matTim(`${ng.ten} bí từ rồi!`); return }
        void this.nop(s.luot, w)
      }, 1300 + Math.random() * (ng.bot === 'kho' ? 1500 : 3500))
    }
    this.phat()
  }

  private hetGio() { this.matTim(`${this.s.nguoi[this.s.luot].ten} hết giờ!`) }

  private matTim(lyDo: string) {
    const ng = this.s.nguoi[this.s.luot]
    ng.tim = Math.max(0, ng.tim - 1)
    this.sangLuot(ng.tim === 0 ? `${lyDo} ${ng.ten} bị loại.` : `${lyDo} Mất 1 tim.`)
  }

  private sangLuot(thongBao: string) {
    this.s.thongBao = thongBao
    if (this.kiemKetThuc()) return
    const n = this.s.nguoi.length
    let k = this.s.luot
    for (let d = 1; d <= n; d++) { const j = (k + d) % n; if (this.s.nguoi[j].tim > 0 && !this.s.nguoi[j].roi) { k = j; break } }
    this.s.luot = k
    this.batLuot()
  }

  private kiemKetThuc() {
    if (this.s.tuDo || this.s.pha !== 'dau') return false
    const song = conSong(this.s)
    if (song.length <= 1) {
      this.s.pha = 'het'
      this.s.thang = song[0] ?? null
      if (this.hen) clearTimeout(this.hen)
      if (this.henBot) clearTimeout(this.henBot)
      this.phat()
      return true
    }
    return false
  }

  /** Nộp từ. Trả về thông báo lỗi (nếu có) cho người nộp. */
  async nop(ai: number, wTho: string): Promise<string> {
    const s = this.s
    if (s.pha !== 'dau' || s.luot !== ai || s.dangKiem) return 'Chưa tới lượt em'
    const w = wTho.toLowerCase().trim()
    if (!/^[a-z]{2,}$/.test(w)) return 'Chỉ nhập 1 từ gồm chữ cái tiếng Anh'
    if (s.chu && w[0] !== s.chu) return `Từ phải bắt đầu bằng chữ "${s.chu.toUpperCase()}"`
    if (s.tu.some((t) => t.w === w)) return 'Từ này đã được dùng rồi'
    s.dangKiem = true
    this.phat()
    const kq = await kiemTu(w)
    s.dangKiem = false
    if (s.pha !== 'dau' || s.luot !== ai) { this.phat(); return '' }
    if (!kq.ok) {
      this.phat()
      if (s.nguoi[ai].bot) { this.matTim(`${s.nguoi[ai].ten} bí từ rồi!`); return '' }
      return kq.mang ? 'Từ điển đang mất kết nối — chưa trừ điểm, thử lại nhé' : `"${w}" không có trong từ điển`
    }
    s.tu.push({ w, ai, vi: kq.vi, nghia: kq.nghia, ipa: kq.ipa, vd: kq.vd })
    s.nguoi[ai].diem += w.length + (w.length >= 7 ? 5 : 0)
    s.chu = w[w.length - 1]
    if (s.tuDo) { s.thongBao = ''; this.batLuot(); return '' }
    this.sangLuot('')
    return ''
  }

  huy() { if (this.hen) clearTimeout(this.hen); if (this.henBot) clearTimeout(this.henBot); this.nghe.clear() }
}

// ── Phòng nối từ online ──
export interface PhongNT {
  laChu: boolean
  snap: ReturnType<typeof taoKho<SnapNT | null>>
  loi: ReturnType<typeof taoKho<string>>
  nop(w: string): Promise<string>
  bat(): void
  roi(): void
}

export function moPhongNT(o: { phong: string; laChu: boolean; toi: { ma: string; ten: string; nv: string } }): PhongNT {
  const snap = taoKho<SnapNT | null>(null)
  const loi = taoKho('')
  let tt: TrongTaiNT | null = o.laChu ? new TrongTaiNT([o.toi]) : null
  const ch = kenhMoi('dtv-n:' + o.phong, o.toi.ma)
  const gui = (event: string, payload: unknown) => ch.send({ type: 'broadcast', event, payload })
  let chuDaThay = false
  if (tt) tt.dangKy((s) => { snap.dat(s); gui('nt_st', s) })
  ch.on('presence', { event: 'sync' }, () => {
    const ds = Object.values(ch.presenceState<{ ma: string; ten: string; nv: string; chu: boolean }>()).map((x) => x[x.length - 1])
    if (tt) {
      const co = new Set(ds.map((x) => x.ma))
      for (const x of ds) tt.themNguoi({ ma: x.ma, ten: x.ten, nv: x.nv })
      for (const n of tt.snap.nguoi) if (!co.has(n.ma) && !n.bot) tt.boNguoi(n.ma)
    } else {
      if (ds.some((x) => x.chu)) chuDaThay = true
      else if (chuDaThay) loi.dat('Chủ phòng đã rời')
    }
  })
  ch.on('broadcast', { event: 'nt_st' }, ({ payload }) => { if (!o.laChu) snap.dat(payload as SnapNT) })
  ch.on('broadcast', { event: 'nt_nop' }, async ({ payload }) => {
    if (!tt) return
    const p = payload as { ma: string; w: string }
    const ai = tt.snap.nguoi.findIndex((n) => n.ma === p.ma)
    if (ai < 0) return
    const l = await tt.nop(ai, p.w)
    if (l) gui('nt_loi', { den: p.ma, l })
  })
  ch.on('broadcast', { event: 'nt_loi' }, ({ payload }) => {
    const p = payload as { den: string; l: string }
    if (p.den === o.toi.ma) loi.dat(p.l)
  })
  ch.subscribe((status) => {
    if (status === 'SUBSCRIBED') ch.track({ ...o.toi, chu: o.laChu })
    else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') loi.dat('Không thể kết nối phòng nối từ')
  })
  const nhip = o.laChu ? setInterval(() => { if (tt) gui('nt_st', tt.snap) }, 2000) : null
  return {
    laChu: o.laChu, snap, loi,
    async nop(w) {
      if (tt) { const ai = tt.snap.nguoi.findIndex((n) => n.ma === o.toi.ma); return tt.nop(ai, w) }
      gui('nt_nop', { ma: o.toi.ma, w })
      return ''
    },
    bat() { if (tt && tt.snap.nguoi.length >= 2) tt.bat() },
    roi() { if (nhip) clearInterval(nhip); tt?.huy(); ch.huy() },
  }
}
