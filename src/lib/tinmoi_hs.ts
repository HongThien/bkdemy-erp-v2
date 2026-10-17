// TIN MỚI của học sinh (mig giai_thuong_tu_dong_xu_tin_moi, Thùy 17/10): mỗi sự kiện "em vừa đạt/được gì" (giải thưởng, thành tựu, huy hiệu, xu…) là 1 dòng hs_tin_moi
// do DB ghi lúc sự kiện xảy ra (trong cùng transaction). App chỉ ĐỌC và đánh dấu đã đọc — không tính toán gì ở client.
// Khác thong_bao_hs (hòm thư cũ: báo lỗi đúng…): bảng đó thuộc owner khác, không mở rộng được, nên tin mới có bảng riêng và được GỘP vào Hòm thư để xem lại.
import { supabase } from './supabase'

export type TinMoiHS = {
  id: string
  loai: string
  tieu_de: string
  noi_dung: string
  bieu_tuong: string | null
  created_at: string
  doc_at: string | null
}

const COT = 'id, loai, tieu_de, noi_dung, bieu_tuong, created_at, doc_at'

/** Tin chưa đọc — dùng cho khung bật lên khi mở app. */
export async function listTinMoiChuaDoc(): Promise<TinMoiHS[]> {
  const { data, error } = await supabase.from('hs_tin_moi').select(COT).is('doc_at', null).order('created_at', { ascending: false }).limit(20)
  if (error) throw error
  return (data ?? []) as TinMoiHS[]
}

/** Tin gần đây (đã/chưa đọc) — để xem lại ở Hòm thư. */
export async function listTinMoiHS(): Promise<TinMoiHS[]> {
  const { data, error } = await supabase.from('hs_tin_moi').select(COT).order('created_at', { ascending: false }).limit(50)
  if (error) throw error
  return (data ?? []) as TinMoiHS[]
}

export async function docTinMoi(ids: string[]): Promise<void> {
  if (!ids.length) return
  const { error } = await supabase.from('hs_tin_moi').update({ doc_at: new Date().toISOString() }).in('id', ids)
  if (error) throw error
}
