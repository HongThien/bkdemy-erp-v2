// PHIÊN ĐẤU = thứ màn trận đấu cần: nhận Snap, gửi câu trả lời. Mỗi chế độ (bot · 2 người 1 máy · online · giải) là 1 phiên.
// Câu lấy từ NGUỒN của môn (nguon/) — phiên không biết môn.
import { ganBot, nguoiBot } from './bot'
import { TrongTai, type MucBot, type NguoiTran, type Snap } from './trongTai'
import { taoKho } from './tienich'
import type { CauHinhBo, NguonCau } from '../nguon/kieu'

export type LoaiPhien = 'bot' | 'doi' | 'mang' | 'giai'
export interface TrangThaiPhien { doiThuRoi: boolean; doiThuMuonLai: boolean; toiMuonLai: boolean; thongBao: string }

export interface PhienDau {
  loai: LoaiPhien
  gheToi: (0 | 1)[]
  coTamDung: boolean
  mon: string
  chuDe: string
  tenChuDe: string
  dangKy(f: (s: Snap) => void): () => void
  traLoi(ghe: 0 | 1, opt: string): void
  tamDung?(on: boolean): void
  choiLai?(): void
  roi(): void
  tt: ReturnType<typeof taoKho<TrangThaiPhien>>
}

export const ttMoi = () => taoKho<TrangThaiPhien>({ doiThuRoi: false, doiThuMuonLai: false, toiMuonLai: false, thongBao: '' })

/** Trận chạy hoàn toàn ở máy này (bot / 2 người 1 máy). Bộ câu lấy bất đồng bộ (kho DB) — có câu rồi mới bắt đầu. */
function phienCucBo(loai: 'bot' | 'doi', o: { nguon: NguonCau; cauHinh: CauHinhBo; tenChuDe: string; nguoi: [NguoiTran, NguoiTran]; bot?: MucBot }): PhienDau {
  let tai: TrongTai | null = null
  let huyBot: (() => void) | null = null
  let huyNghe: (() => void) | null = null
  let lan = 0
  let daRoi = false
  const nghe = new Set<(s: Snap) => void>()
  const tt = ttMoi()
  const moiTran = async () => {
    const lanNay = ++lan
    huyBot?.(); huyNghe?.(); tai?.huy(); tai = null
    tt.dat((x) => ({ ...x, thongBao: '' }))
    try {
      const ds = await o.nguon.taoBoDe(o.cauHinh)
      if (daRoi || lanNay !== lan) return
      if (ds.length < 3) { tt.dat((x) => ({ ...x, thongBao: 'Chủ đề này chưa đủ câu trắc nghiệm — chọn chủ đề khác nhé' })); return }
      const t = new TrongTai({ mid: 'cb-' + Date.now(), nguoi: o.nguoi, ds, giayVong: o.nguon.giayMoiCau })
      tai = t
      if (o.bot) huyBot = ganBot(t, 1, o.bot)
      huyNghe = t.dangKy((s) => nghe.forEach((f) => f(s)))
      t.bat()
    } catch (e) {
      tt.dat((x) => ({ ...x, thongBao: 'Không lấy được câu hỏi: ' + (e as Error).message }))
    }
  }
  void moiTran()
  return {
    loai, gheToi: loai === 'doi' ? [0, 1] : [0], coTamDung: true, mon: o.nguon.mon, chuDe: o.cauHinh.chuDe, tenChuDe: o.tenChuDe, tt,
    dangKy(f) { nghe.add(f); if (tai) f(tai.snap); return () => { nghe.delete(f) } },
    traLoi: (g, opt) => tai?.traLoi(g, opt),
    tamDung: (on) => tai?.tamDung(on),
    choiLai: () => { void moiTran() },
    roi() { daRoi = true; huyBot?.(); huyNghe?.(); tai?.huy(); nghe.clear() },
  }
}

export function phienBot(o: { toi: NguoiTran; nguon: NguonCau; cauHinh: CauHinhBo; tenChuDe: string; muc: MucBot }) {
  return phienCucBo('bot', { ...o, nguoi: [o.toi, nguoiBot(o.muc)], bot: o.muc })
}

export function phienDoi(o: { toi: NguoiTran; ban: NguoiTran; nguon: NguonCau; cauHinh: CauHinhBo; tenChuDe: string }) {
  return phienCucBo('doi', { ...o, nguoi: [o.toi, o.ban] })
}
