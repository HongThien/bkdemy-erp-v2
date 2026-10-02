// MẠNG — Supabase Realtime (broadcast + presence), cùng mẫu kênh `bk-hub` của games-site.
//  · SẢNH `dtv-sanh`: ai đang online, lời mời thách đấu, hàng chờ ghép trận ngẫu nhiên.
//  · PHÒNG `dtv-p:<mã>`: 1 trận 1–1; máy CHỦ PHÒNG làm trọng tài, máy khách gửi câu trả lời + nhận Snap.
import type { RealtimeChannel } from '@supabase/supabase-js'
import { sb, coMang, kenhMoi } from './sb'
import { taoBoDe } from './boDe'
import type { CapDo } from '../data/kho'
import { TrongTai, type NguoiTran, type Snap } from './trongTai'
import { maSo, taoKho } from './tienich'
import { ttMoi, type PhienDau } from './phien'
import { phat } from './amThanh'

// ─────────────────────────────── SẢNH ───────────────────────────────
export type TrangThaiOnline = 'ranh' | 'tim' | 'dau'
export interface ThanhVienSanh { ma: string; ten: string; nv: string; cap: number; tt: TrangThaiOnline; t: number; cd?: string }
export interface LoiMoi { tu: ThanhVienSanh; phong: string; chuDe: string; capDo: CapDo; loai: 'tran' | 'giai'; han: number }
export interface GhepTran { phong: string; laChu: boolean; chuDe: string; capDo: CapDo }

export const khoSanh = taoKho<{ ketNoi: boolean; online: ThanhVienSanh[]; loiMoi: LoiMoi[]; tuChoi: string | null }>({ ketNoi: false, online: [], loiMoi: [], tuChoi: null })

let kenhSanh: RealtimeChannel | null = null
let toiSanh: ThanhVienSanh | null = null
let dangTim: { chuDe: string; capDo: CapDo; onGhep: (g: GhepTran) => void } | null = null

let henTrack: ReturnType<typeof setTimeout> | null = null
let daGui = ''
let daVao = false

// Supabase NGẮT KÊNH nếu track() dồn dập (đo 03/10: StrictMode bắn 4–6 lần/ms ⇒ server gửi phx_close) ⇒ gộp + bỏ trùng.
function guiTrack(ngay = false) {
  if (henTrack) clearTimeout(henTrack)
  henTrack = setTimeout(() => {
    henTrack = null
    if (!kenhSanh || !toiSanh || !daVao) return
    const j = JSON.stringify(toiSanh)
    if (j === daGui) return
    daGui = j
    void kenhSanh.track(toiSanh)
  }, ngay ? 0 : 400)
}

export function vaoSanh(t: Omit<ThanhVienSanh, 'tt' | 't'>) {
  if (!coMang) return
  toiSanh = { ...(toiSanh ?? { tt: 'ranh' as const, t: Date.now() }), ...t }
  if (kenhSanh) { guiTrack(); return }
  const ch = sb.channel('dtv-sanh', { config: { broadcast: { self: false, ack: false }, presence: { key: t.ma } } })
  kenhSanh = ch
  daVao = false
  daGui = ''
  ch.on('presence', { event: 'sync' }, () => {
    const st = ch.presenceState<ThanhVienSanh>()
    const online = Object.values(st).map((ds) => ds[ds.length - 1]).filter(Boolean) as ThanhVienSanh[]
    khoSanh.dat((k) => ({ ...k, online }))
    xetGhep(online)
  })
  ch.on('broadcast', { event: 'moi' }, ({ payload }) => {
    const m = payload as LoiMoi & { den: string }
    if (m.den !== toiSanh?.ma) return
    phat('thong_bao')
    khoSanh.dat((k) => ({ ...k, loiMoi: [...k.loiMoi.filter((x) => x.tu.ma !== m.tu.ma), m] }))
  })
  ch.on('broadcast', { event: 'moi_tl' }, ({ payload }) => {
    const m = payload as { den: string; tuTen: string; dongY: boolean }
    if (m.den !== toiSanh?.ma || m.dongY) return
    khoSanh.dat((k) => ({ ...k, tuChoi: `${m.tuTen} đã từ chối lời mời` }))
  })
  ch.on('broadcast', { event: 'ghep' }, ({ payload }) => {
    const g = payload as { den: string; phong: string; chuDe: string; capDo: CapDo }
    if (g.den !== toiSanh?.ma || !dangTim) return
    const cb = dangTim.onGhep
    dangTim = null
    datTrangThai('dau')
    cb({ phong: g.phong, laChu: false, chuDe: g.chuDe, capDo: g.capDo })
  })
  ch.subscribe((status) => {
    if (status === 'SUBSCRIBED') { daVao = true; daGui = ''; guiTrack(true); khoSanh.dat((k) => ({ ...k, ketNoi: true })) }
    else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
      khoSanh.dat((k) => ({ ...k, ketNoi: false }))
      // tự nối lại sau 2s
      if (kenhSanh === ch) {
        kenhSanh = null
        daVao = false
        void sb.removeChannel(ch)
        const me = toiSanh
        setTimeout(() => { if (!kenhSanh && me) vaoSanh(me) }, 2000)
      }
    }
  })
}

export function capNhatToiSanh(t: Partial<ThanhVienSanh>) {
  if (!toiSanh) return
  toiSanh = { ...toiSanh, ...t }
  guiTrack()
}

export function datTrangThai(tt: TrangThaiOnline, cd?: string) {
  capNhatToiSanh({ tt, t: Date.now(), cd })
}

/** Ghép theo thứ tự vào hàng: (1,2), (3,4)…; người đứng trước làm chủ phòng, gửi mã phòng cho người sau. */
function xetGhep(online: ThanhVienSanh[]) {
  if (!dangTim || !toiSanh) return
  const hang = [...online.filter((x) => x.ma !== toiSanh!.ma), toiSanh].filter((x) => x.tt === 'tim').sort((a, b) => a.t - b.t || a.ma.localeCompare(b.ma))
  const i = hang.findIndex((x) => x.ma === toiSanh!.ma)
  if (i < 0 || i % 2 === 1 || i + 1 >= hang.length) return
  const ban = hang[i + 1]
  const phong = maSo(6)
  const { chuDe, capDo, onGhep } = dangTim
  dangTim = null
  datTrangThai('dau')
  kenhSanh?.send({ type: 'broadcast', event: 'ghep', payload: { den: ban.ma, phong, chuDe, capDo } })
  onGhep({ phong, laChu: true, chuDe, capDo })
}

export function timTran(chuDe: string, capDo: CapDo, onGhep: (g: GhepTran) => void) {
  dangTim = { chuDe, capDo, onGhep }
  datTrangThai('tim', chuDe)
}

export function huyTim() {
  dangTim = null
  datTrangThai('ranh')
}

export function guiLoiMoi(den: string, m: Omit<LoiMoi, 'tu' | 'han'>) {
  if (!kenhSanh || !toiSanh) return
  kenhSanh.send({ type: 'broadcast', event: 'moi', payload: { ...m, den, tu: toiSanh, han: Date.now() + 20000 } })
}

export function traLoiMoi(m: LoiMoi, dongY: boolean) {
  khoSanh.dat((k) => ({ ...k, loiMoi: k.loiMoi.filter((x) => x !== m) }))
  kenhSanh?.send({ type: 'broadcast', event: 'moi_tl', payload: { den: m.tu.ma, tuTen: toiSanh?.ten ?? '', dongY } })
}

// ─────────────────────────────── PHÒNG 1–1 ───────────────────────────────
export interface MetaPhong { ma: string; ten: string; nv: string; cap?: number; chu: boolean }
export interface TTPhong { pha: 'ket_noi' | 'cho' | 'dau' | 'loi'; doiThu: MetaPhong | null; loi: string }

export interface PhienMang extends PhienDau {
  phong: string
  laChu: boolean
  ttPhong: ReturnType<typeof taoKho<TTPhong>>
}

export function moPhong(o: { phong: string; laChu: boolean; toi: NguoiTran; chuDe: string; capDo: CapDo; soCau: number }): PhienMang {
  const ttPhong = taoKho<TTPhong>({ pha: 'ket_noi', doiThu: null, loi: '' })
  const tt = ttMoi()
  const nghe = new Set<(s: Snap) => void>()
  let snap: Snap | null = null
  let tai: TrongTai | null = null
  let gheToi: 0 | 1 = o.laChu ? 0 : 1
  let vongNhan = { i: -1, luc: 0 }
  let muonLai: [boolean, boolean] = [false, false]
  let chuDaThay = false
  let nhip: ReturnType<typeof setInterval> | null = null
  const meta: MetaPhong = { ma: o.toi.ma, ten: o.toi.ten, nv: o.toi.nv, cap: o.toi.cap, chu: o.laChu }
  const ch = kenhMoi('dtv-p:' + o.phong, o.toi.ma)

  const phatSnap = (s: Snap) => {
    snap = s
    if (s.pha === 'vong' && s.i !== vongNhan.i) vongNhan = { i: s.i, luc: performance.now() }
    nghe.forEach((f) => f(s))
  }
  const gui = (event: string, payload: unknown) => ch.send({ type: 'broadcast', event, payload })

  const batTran = (doiThu: MetaPhong) => {
    tai?.huy()
    muonLai = [false, false]
    tt.dat((x) => ({ ...x, doiThuMuonLai: false, toiMuonLai: false, doiThuRoi: false }))
    const nguoi: [NguoiTran, NguoiTran] = [o.toi, { ma: doiThu.ma, ten: doiThu.ten, nv: doiThu.nv, cap: doiThu.cap }]
    tai = new TrongTai({ mid: 'p' + o.phong + '-' + Date.now(), nguoi, ds: taoBoDe({ chuDe: o.chuDe, capDo: o.capDo, soCau: o.soCau }) })
    tai.dangKy((s) => { phatSnap(s); gui('st', s) })
    ttPhong.dat((x) => ({ ...x, pha: 'dau' }))
    tai.bat()
  }

  ch.on('presence', { event: 'sync' }, () => {
    const ds = Object.values(ch.presenceState<MetaPhong>()).map((x) => x[x.length - 1]) as MetaPhong[]
    const khac = ds.filter((x) => x.ma !== o.toi.ma)
    if (o.laChu) {
      const doiThu = khac[0] ?? null
      const cu = ttPhong.lay().doiThu
      if (doiThu && !cu) { ttPhong.dat((x) => ({ ...x, doiThu })); batTran(doiThu) }
      else if (!doiThu && cu) {
        ttPhong.dat((x) => ({ ...x, doiThu: null, pha: 'cho' }))
        tt.dat((x) => ({ ...x, doiThuRoi: true }))
        if (tai && !tai.snap.ketQua) tai.bo(1)
      }
    } else {
      const chu = khac.find((x) => x.chu) ?? null
      if (chu) { chuDaThay = true; ttPhong.dat((x) => ({ ...x, doiThu: chu, pha: x.pha === 'ket_noi' ? 'cho' : x.pha })) }
      else if (chuDaThay) {
        tt.dat((x) => ({ ...x, doiThuRoi: true }))
        if (snap && !snap.ketQua) phatSnap({ ...snap, pha: 'het', ketQua: { thang: gheToi, bo: (1 - gheToi) as 0 | 1 } })
      }
    }
  })
  ch.on('broadcast', { event: 'st' }, ({ payload }) => {
    if (o.laChu) return
    const s = payload as Snap
    const g = s.nguoi.findIndex((n) => n.ma === o.toi.ma)
    if (g < 0) return
    gheToi = g as 0 | 1
    if (snap?.mid !== s.mid) tt.dat((x) => ({ ...x, doiThuMuonLai: false, toiMuonLai: false }))
    ttPhong.dat((x) => ({ ...x, pha: 'dau' }))
    phatSnap(s)
  })
  ch.on('broadcast', { event: 'tl' }, ({ payload }) => {
    const p = payload as { mid: string; ma: string; opt: string; rt: number; i: number }
    if (!o.laChu || !tai) return
    const s = tai.snap
    const g = s.nguoi.findIndex((n) => n.ma === p.ma)
    if (g !== 1 || s.mid !== p.mid || s.i !== p.i) return
    tai.traLoi(1, p.opt, p.rt)
  })
  ch.on('broadcast', { event: 'lai' }, () => {
    tt.dat((x) => ({ ...x, doiThuMuonLai: true }))
    if (o.laChu) { muonLai[1] = true; if (muonLai[0] && ttPhong.lay().doiThu) batTran(ttPhong.lay().doiThu!) }
  })
  ch.subscribe((status) => {
    if (status === 'SUBSCRIBED') { ch.track(meta); ttPhong.dat((x) => ({ ...x, pha: 'cho' })) }
    else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') ttPhong.dat((x) => ({ ...x, pha: 'loi', loi: 'Không kết nối được phòng đấu' }))
  })
  // nhịp 1,5s: chủ phát lại snap mới nhất (máy khách vào muộn / rớt gói vẫn bắt kịp đồng hồ)
  if (o.laChu) nhip = setInterval(() => { if (tai && !tai.snap.ketQua) gui('st', tai.snap) }, 1500)

  return {
    loai: 'mang', phong: o.phong, laChu: o.laChu, ttPhong, tt, chuDe: o.chuDe, coTamDung: false,
    get gheToi() { return [gheToi] as (0 | 1)[] },
    dangKy(f) { nghe.add(f); if (snap) f(snap); return () => { nghe.delete(f) } },
    traLoi(_g, opt) {
      if (o.laChu) { tai?.traLoi(0, opt); return }
      if (!snap || snap.pha !== 'vong') return
      gui('tl', { mid: snap.mid, ma: o.toi.ma, opt, i: snap.i, rt: Math.round(performance.now() - vongNhan.luc) })
    },
    choiLai() {
      tt.dat((x) => ({ ...x, toiMuonLai: true }))
      gui('lai', {})
      if (o.laChu) { muonLai[0] = true; if (muonLai[1] && ttPhong.lay().doiThu) batTran(ttPhong.lay().doiThu!) }
    },
    roi() {
      if (nhip) clearInterval(nhip)
      tai?.huy()
      nghe.clear()
      ch.huy()
    },
  }
}
