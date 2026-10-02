// Dựng bộ đề cho 1 trận. Đáp án nhiễu: CÙNG LOẠI TỪ, ưu tiên cùng chủ đề, nghĩa khác nhau (không ra "2 đáp án cùng đúng").
import { CAP_DO, CHU_DE, TU, TU_THEO_CD, TU_THEO_ID, type CapDo, type Tu } from '../data/kho'
import { useEffect, useState } from 'react'
import { chon, docLS, ghiLS, taoKho, taoRng, tron } from './tienich'

/** KIỂU ĐỐ (Thùy 03/10): đố Anh → đáp án Việt · đố Việt → đáp án Anh · trộn. Lựa chọn lưu ở máy; trận online theo chủ phòng, giải theo chủ giải. */
export type HuongDo = 'anh_viet' | 'viet_anh' | 'tron'
export const HUONG_DO: { id: HuongDo; ten: string; mo: string }[] = [
  { id: 'anh_viet', ten: 'Anh → Việt', mo: 'Hiện từ tiếng Anh, chọn nghĩa Việt' },
  { id: 'viet_anh', ten: 'Việt → Anh', mo: 'Hiện nghĩa Việt, chọn từ tiếng Anh' },
  { id: 'tron', ten: 'Trộn cả hai', mo: 'Đổi chiều ngẫu nhiên từng câu' },
]
export const TI_LE_DAO: Record<HuongDo, number> = { anh_viet: 0, viet_anh: 1, tron: 0.5 }
export const khoHuong = taoKho<HuongDo>(docLS<HuongDo>('dtv_huong', 'anh_viet'))
khoHuong.nghe((v) => ghiLS('dtv_huong', v))
export function useHuong() {
  const [h, setH] = useState(khoHuong.lay())
  useEffect(() => khoHuong.nghe(setH), [])
  return h
}
export const tenHuong = (h: HuongDo) => HUONG_DO.find((x) => x.id === h)?.ten ?? ''

export interface Cau {
  id: string // id từ đúng
  opts: string[] // 4 id (đã xáo)
  dao: boolean // true = hiện nghĩa Việt, chọn từ Anh
}

const docRecent = (): string[] => {
  try { return JSON.parse(localStorage.getItem('dtv_gan_day') || '[]') } catch { return [] }
}
const ghiRecent = (ids: string[]) => {
  try { localStorage.setItem('dtv_gan_day', JSON.stringify([...docRecent(), ...ids].slice(-45))) } catch { /* */ }
}

function nhieu(dung: Tu, rng: () => number, dao: boolean): string[] {
  const khac = (t: Tu) => t.id !== dung.id && t.vi !== dung.vi && t.en.toLowerCase() !== dung.en.toLowerCase()
  const cungCd = (TU_THEO_CD[dung.cd] ?? []).filter((t) => khac(t) && t.pos === dung.pos)
  let ung = tron(cungCd, rng)
  if (ung.length < 3) ung = [...ung, ...tron(TU.filter((t) => khac(t) && t.pos === dung.pos && t.cd !== dung.cd), rng)]
  if (ung.length < 3) ung = [...ung, ...tron(TU.filter(khac), rng)]
  // không lấy 2 nhiễu trùng nghĩa/trùng chữ với nhau
  const ra: Tu[] = []
  for (const t of ung) {
    if (ra.some((r) => r.vi === t.vi || r.en === t.en)) continue
    if (dao && t.en.split(' ').length !== dung.en.split(' ').length && ra.length < 2 && ung.length > 6) continue
    ra.push(t)
    if (ra.length === 3) break
  }
  return ra.map((t) => t.id)
}

export function taoBoDe(o: { chuDe: string; capDo: CapDo; soCau: number; seed?: number; uuTien?: string[]; tiLeDao?: number }): Cau[] {
  const rng = taoRng(o.seed ?? Math.floor(Math.random() * 1e9))
  const lv = CAP_DO.find((c) => c.id === o.capDo)?.lv ?? [1, 2, 3]
  let chuDe = o.chuDe
  if (chuDe === 'auto') chuDe = chon(CHU_DE, rng).id
  const nguon = (chuDe === 'tron' ? TU : TU_THEO_CD[chuDe] ?? TU).filter((t) => (lv as readonly number[]).includes(t.lv))
  const ganDay = new Set(docRecent())
  // ưu tiên: từ yếu/đến hạn (tối đa 1/3 bộ) → từ chưa gặp gần đây → còn lại
  const uu = (o.uuTien ?? []).map((id) => TU_THEO_ID.get(id)).filter((t): t is Tu => !!t && nguon.includes(t))
  const chonDuoc: Tu[] = tron(uu, rng).slice(0, Math.floor(o.soCau / 3))
  const conLai = tron(nguon.filter((t) => !chonDuoc.includes(t)), rng).sort((a, b) => Number(ganDay.has(a.id)) - Number(ganDay.has(b.id)))
  const daCo = new Set(chonDuoc.map((t) => t.en.toLowerCase()))
  for (const t of conLai) { if (chonDuoc.length >= o.soCau) break; if (daCo.has(t.en.toLowerCase())) continue; daCo.add(t.en.toLowerCase()); chonDuoc.push(t) }
  const ds = tron(chonDuoc, rng)
  ghiRecent(ds.map((t) => t.id))
  const tiLe = o.tiLeDao ?? TI_LE_DAO[khoHuong.lay()]
  return ds.map((t) => {
    const dao = rng() < tiLe
    return { id: t.id, dao, opts: tron([t.id, ...nhieu(t, rng, dao)], rng) }
  })
}

export const chuDeCuaBo = (ds: Cau[]) => {
  const cds = new Set(ds.map((c) => TU_THEO_ID.get(c.id)?.cd))
  return cds.size === 1 ? [...cds][0]! : 'tron'
}

/** 4 phương án nghĩa Việt cho 1 từ (màn ôn tập). */
export function phuongAnOn(id: string): string[] {
  const t = TU_THEO_ID.get(id)
  if (!t) return []
  return tron([id, ...nhieu(t, Math.random, false)])
}

/** 1 câu cho từ t với RNG cho trước (tạo bộ đề TẤT ĐỊNH — leo tháp: mọi máy ra cùng câu, cùng thứ tự đáp án). */
export function cauTuTu(t: Tu, rng: () => number, dao: boolean): Cau {
  return { id: t.id, dao, opts: tron([t.id, ...nhieu(t, rng, dao)], rng) }
}
