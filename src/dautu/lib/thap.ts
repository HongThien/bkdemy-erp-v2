// LEO THÁP (Thùy 03/10) — "cùng 1 thử thách, mọi người tham gia có bảng xếp hạng".
//  · THÁP HÔM NAY: chuỗi câu TẤT ĐỊNH theo (ngày VN + chế độ) ⇒ mọi người gặp đúng cùng câu, cùng thứ tự, cùng kiểu đố. Mai tháp mới.
//  · Tháp khó dần: tầng 1–20 từ lớp 3–5 · 21–60 thêm lớp 6–7 · trên 60 nghiêng lớp 8–9.
//  · Sinh tồn ('song_con'): 5 phút, đúng ⇒ lên 1 tầng; sai ⇒ không lên + TRỪ 3 GIÂY (chống bấm bừa). Bằng tầng: ít sai hơn đứng trên.
//  · Vô tận ('vo_tan'): mỗi câu 10s, cứ 10 tầng bớt 1s (sàn 3s); sai / hết giờ = thua. Bằng tầng: nhanh hơn đứng trên.
// Ghi kết quả + xếp hạng ở DB (fn_dtv_thap_ghi / fn_dtv_thap_bxh).
import { TU, type Tu } from '../data/kho'
import { cauTuTu, type CauTu } from './boDe'
import { ngayVN, taoRng, tron } from './tienich'
import { sb, coMang } from './sb'
import { datDB, khoHoSo, type HoSoDB } from './hoSo'

import type { CheDoThap } from '../nguon/kieu'
export type { CheDoThap }
export const THAP: Record<CheDoThap, { ten: string; icon: string; luat: (giayThap: number) => string[] }> = {
  song_con: { ten: 'Sinh tồn 5 phút', icon: '⏱️', luat: () => ['5 phút leo càng cao càng tốt', 'Mỗi tầng 1 câu — đúng thì lên tầng', 'Sai: không lên tầng, bị trừ 3 giây'] },
  vo_tan: { ten: 'Vô tận', icon: '♾️', luat: (g) => [`Mỗi câu ${g} giây`, `Cứ 10 tầng bớt ${Math.max(1, Math.round(g * 0.1))} giây (thấp nhất ${Math.max(3, Math.round(g * 0.3))} giây)`, 'Sai hoặc hết giờ là thua'] },
}
export const MS_SONG_CON = 300_000
export const PHAT_SAI_MS = 3000
/** Vô tận: câu đầu = giayThap của môn (Anh 10s); mỗi 10 tầng −10% (làm tròn, ít nhất 1s), sàn 30% (ít nhất 3s). Anh: 10,9,…,3. */
export const giayVoTan = (tang: number, goc = 10) => Math.max(Math.max(3, Math.round(goc * 0.3)), goc - Math.floor(tang / 10) * Math.max(1, Math.round(goc * 0.1)))

function bam(s: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}

/** Bộ câu của tháp hôm nay (400 tầng — đủ cho mọi lượt). */
export function taoThapTu(cheDo: CheDoThap, ngay = ngayVN()): CauTu[] {
  const rng = taoRng(bam(`thap|${cheDo}|${ngay}`))
  const daCo = new Set<string>()
  const don = TU.filter((t) => { const k = t.en.toLowerCase(); if (daCo.has(k)) return false; daCo.add(k); return true })
  const theoLv = (lv: number[]) => tron(don.filter((t) => lv.includes(t.lv)), rng)
  const hang = [theoLv([1]), theoLv([2]), theoLv([3])]
  const dung = new Set<string>()
  const lay = (lvUuTien: number[]): Tu => {
    for (const lv of lvUuTien) { const t = hang[lv - 1].find((x) => !dung.has(x.id)); if (t) { dung.add(t.id); return t } }
    const t = don.find((x) => !dung.has(x.id))!
    dung.add(t.id)
    return t
  }
  const ds: CauTu[] = []
  for (let i = 0; i < 400; i++) {
    const r = rng()
    const uu = i < 20 ? [1, 2, 3] : i < 60 ? (r < 0.5 ? [1, 2, 3] : [2, 1, 3]) : (r < 0.25 ? [2, 3, 1] : [3, 2, 1])
    const t = lay(uu)
    ds.push(cauTuTu(t, rng, rng() < 0.3))
  }
  return ds
}

export interface DongThap { hang: number; ma: string; ten: string; nv: string; tang: number; sai: number; ms: number }
export interface BxhThap { so_nguoi: number; top: DongThap[]; toi: { hang: number; tang: number; sai: number; ms: number } | null }

export async function bxhThap(cheDo: CheDoThap, mon: string, nhom: string, homNay: boolean): Promise<BxhThap | null> {
  if (!coMang) return null
  const { data, error } = await sb.rpc('fn_dtv_thap_bxh_mon', { p_che_do: cheDo, p_mon: mon, p_nhom: nhom, p_hom_nay: homNay, p_uid: khoHoSo.lay().uid })
  if (error) throw new Error(error.message)
  return data as BxhThap
}

export async function ghiThap(cheDo: CheDoThap, mon: string, nhom: string, tang: number, sai: number, ms: number) {
  if (!coMang || !khoHoSo.lay().db) return null
  const { data, error } = await sb.rpc('fn_dtv_thap_ghi_mon', { p_uid: khoHoSo.lay().uid, p_che_do: cheDo, p_mon: mon, p_nhom: nhom, p_tang: tang, p_sai: sai, p_ms: Math.round(ms) })
  if (error) throw new Error(error.message)
  const kq = data as { ho_so: HoSoDB; xp_nhan: number; len_cap: boolean; bxh: BxhThap; luot_id?: string }
  if (kq?.ho_so) datDB(kq.ho_so)
  return kq
}
