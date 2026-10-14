// Seam bot Telegram TA (spec-bot-telegram-ta.md). Nối tài khoản: app lấy mã dùng 1 lần → mở t.me/<bot>?start=<mã>,
// bot nhận /start <mã> qua webhook → fn_tg_nhan ghi tg_lien_ket. Mọi luật ở DB (mig 202610142152).
import { supabase } from './supabase'

export const TG_BOT = 'bk_trogiang_bot'
export type LienKetTg = { tg_username: string | null; ten_tg: string | null; tu_at: string }

export async function lienKetTgCuaToi(): Promise<LienKetTg | null> {
  const { data, error } = await supabase.rpc('fn_tg_lien_ket_cua_toi')
  if (error) throw error
  return ((data as LienKetTg[]) ?? [])[0] ?? null
}
export async function linkKetNoiTg(): Promise<string> {
  const { data, error } = await supabase.rpc('fn_tg_ma_lien_ket')
  if (error) throw error
  return `https://t.me/${TG_BOT}?start=${data as string}`
}
