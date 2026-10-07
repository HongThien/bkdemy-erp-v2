// NHẬT KÝ TỪNG CÂU của Đấu Từ (Thùy 07/10: "ghi lại MỌI THỨ trên app vào DB để sau này track được; KHÔNG tính vào mastery dạng bài").
// Chỉ ghi khi game chạy bằng TÀI KHOẢN học sinh (uid hs_*): đề, em chọn gì, đáp án đúng, đúng/sai, bao nhiêu ms, thuộc trận/lượt tháp nào → bảng dtv_cau_log.
// Đúng/sai ở đây do GAME khai (nguon_cham='client') — chấm ở máy chủ là Phase 2. Lỗi mạng bỏ qua, không chặn trận.
import type { Cau } from '../nguon/kieu'
import { sb, coMang } from './sb'
import { khoHoSo } from './hoSo'

export interface DongNhatKy {
  thu_tu: number; ma_cau?: string; cau_id?: string; tu_id?: string
  de?: string; dap_an?: string; tra_loi: string; dung: boolean; ms: number
}

const textOpt = (c: Cau, id: string) => c.opts.find((o) => o.id === id)?.text ?? ''

/** 1 dòng nhật ký từ 1 câu + phương án em chọn ('' = hết giờ / bỏ qua). */
export function dongTuCau(thuTu: number, c: Cau, chon: string, dung: boolean, ms: number): DongNhatKy {
  return {
    thu_tu: thuTu, ma_cau: c.tuId ?? c.id, cau_id: c.id, tu_id: c.tuId, de: c.de,
    dap_an: textOpt(c, c.dung), tra_loi: chon ? textOpt(c, chon) : '', dung, ms: Math.round(ms),
  }
}

export const laTaiKhoan = () => khoHoSo.lay().uid.startsWith('hs_')

export async function ghiNhatKy(a: { mon: string; cheDo: string; chuDe?: string; tranId?: string | null; luotId?: string | null; cau: DongNhatKy[] }): Promise<void> {
  if (!coMang || !laTaiKhoan() || a.cau.length === 0) return
  if (!a.tranId && !a.luotId) return
  try {
    for (let i = 0; i < a.cau.length; i += 80) {
      const { error } = await sb.rpc('fn_dtv_ghi_cau', {
        p_uid: khoHoSo.lay().uid, p_mon: a.mon, p_che_do: a.cheDo, p_chu_de: a.chuDe ?? '',
        p_tran_id: a.tranId ?? null, p_luot_id: a.luotId ?? null, p_cau: a.cau.slice(i, i + 80),
      })
      if (error) throw new Error(error.message)
    }
  } catch (e) { console.warn('Chưa ghi được nhật ký câu:', (e as Error).message) }
}
