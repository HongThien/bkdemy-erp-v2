// Seam GẬY CỦA TÔI (box "Gậy" trong Của tôi, CEO 07/09): gậy ĐÃ CHỐT (ledger, còn hiệu lực hay
// đã thu hồi) + đề xuất ĐANG CHỜ duyệt (để nhân sự thấy sớm và giải trình trong 48h SLA).
// Chỉ đọc dòng thô của CHÍNH MÌNH để render — không cộng/tính ở đây (tổng gậy/tiền đã có fn_gay_bang).
import { supabase } from './supabase'
import { myNhanSuId } from './giaoviec'
import { listGayLoi, listGayHoatDong, type GayLedger, type GayDeXuat } from './gay'

const LIMIT = 500

export type GayCuaToiEntry = GayLedger & { loi_ten?: string; hoat_dong_ten?: string }
export type GayCuaToi = { ky: string | null; ledger: GayCuaToiEntry[]; deXuatCho: GayDeXuat[] }

// ky = 'YYYY-MM-01' (cùng quy ước gay.ts) hoặc null = TẤT CẢ các tháng.
export async function gayCuaToi(ky: string | null): Promise<GayCuaToi> {
  const me = await myNhanSuId()
  let qLed = supabase.from('gay_ledger').select('*').eq('nhan_su_id', me).order('created_at', { ascending: false }).limit(LIMIT)
  let qDx = supabase.from('gay_de_xuat').select('*').eq('nhan_su_id', me).eq('trang_thai', 'cho').order('deadline_at', { ascending: false }).limit(LIMIT)
  if (ky) {
    const [y, m] = ky.split('-').map(Number)
    const tu = `${y}-${String(m).padStart(2, '0')}-01T00:00:00+07:00`
    const denD = new Date(Date.UTC(y, m, 1))
    const den = `${denD.getUTCFullYear()}-${String(denD.getUTCMonth() + 1).padStart(2, '0')}-01T00:00:00+07:00`
    qLed = qLed.eq('ky', ky)
    qDx = qDx.gte('deadline_at', tu).lt('deadline_at', den)
  }
  const [{ data: led, error: e1 }, { data: dx, error: e2 }, lois, hds] = await Promise.all([qLed, qDx, listGayLoi(false), listGayHoatDong(false)])
  if (e1) throw e1
  if (e2) throw e2
  const loiMap = new Map(lois.map((l) => [l.id, l.ten]))
  const hdMap = new Map(hds.map((h) => [h.id, h.ten]))
  return {
    ky,
    ledger: ((led ?? []) as GayLedger[]).map((r) => ({
      ...r, loi_ten: r.loi_id ? loiMap.get(r.loi_id) : undefined, hoat_dong_ten: r.hoat_dong_id ? hdMap.get(r.hoat_dong_id) : undefined,
    })),
    deXuatCho: (dx ?? []) as GayDeXuat[],
  }
}
