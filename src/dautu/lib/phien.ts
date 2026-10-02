// PHIÊN ĐẤU = thứ màn trận đấu cần: nhận Snap, gửi câu trả lời. Mỗi chế độ (bot · 2 người 1 máy · online · giải) là 1 phiên.
import { taoBoDe } from './boDe'
import { ganBot, nguoiBot } from './bot'
import type { CapDo } from '../data/kho'
import { TrongTai, type MucBot, type NguoiTran, type Snap } from './trongTai'
import { taoKho } from './tienich'

export type LoaiPhien = 'bot' | 'doi' | 'mang' | 'giai'
export interface TrangThaiPhien { doiThuRoi: boolean; doiThuMuonLai: boolean; toiMuonLai: boolean; thongBao: string }

export interface PhienDau {
  loai: LoaiPhien
  gheToi: (0 | 1)[]
  coTamDung: boolean
  chuDe: string
  dangKy(f: (s: Snap) => void): () => void
  traLoi(ghe: 0 | 1, opt: string): void
  tamDung?(on: boolean): void
  choiLai?(): void
  roi(): void
  tt: ReturnType<typeof taoKho<TrangThaiPhien>>
}

export const ttMoi = () => taoKho<TrangThaiPhien>({ doiThuRoi: false, doiThuMuonLai: false, toiMuonLai: false, thongBao: '' })

/** Trận chạy hoàn toàn ở máy này (bot / 2 người 1 máy). */
function phienCucBo(loai: 'bot' | 'doi', o: { chuDe: string; capDo: CapDo; soCau: number; nguoi: [NguoiTran, NguoiTran]; bot?: MucBot; uuTien?: string[] }): PhienDau {
  let tai: TrongTai
  let huyBot: (() => void) | null = null
  const nghe = new Set<(s: Snap) => void>()
  let huyNghe: (() => void) | null = null
  const tt = ttMoi()
  const moiTran = () => {
    huyBot?.(); huyNghe?.(); tai?.huy()
    tai = new TrongTai({ mid: 'cb-' + Date.now(), nguoi: o.nguoi, ds: taoBoDe({ chuDe: o.chuDe, capDo: o.capDo, soCau: o.soCau, uuTien: o.uuTien }) })
    if (o.bot) huyBot = ganBot(tai, 1, o.bot)
    huyNghe = tai.dangKy((s) => nghe.forEach((f) => f(s)))
    tai.bat()
  }
  moiTran()
  return {
    loai, gheToi: loai === 'doi' ? [0, 1] : [0], coTamDung: true, chuDe: o.chuDe, tt,
    dangKy(f) { nghe.add(f); f(tai.snap); return () => { nghe.delete(f) } },
    traLoi: (g, opt) => tai.traLoi(g, opt),
    tamDung: (on) => tai.tamDung(on),
    choiLai: () => moiTran(),
    roi() { huyBot?.(); huyNghe?.(); tai.huy(); nghe.clear() },
  }
}

export function phienBot(o: { toi: NguoiTran; chuDe: string; capDo: CapDo; soCau: number; muc: MucBot; uuTien?: string[] }) {
  return phienCucBo('bot', { ...o, nguoi: [o.toi, nguoiBot(o.muc)], bot: o.muc })
}

export function phienDoi(o: { toi: NguoiTran; ban: NguoiTran; chuDe: string; capDo: CapDo; soCau: number }) {
  return phienCucBo('doi', { ...o, nguoi: [o.toi, o.ban] })
}
