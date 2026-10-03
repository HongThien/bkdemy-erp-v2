// NGUỒN CÂU = KHO thật của môn (Toán · KHTN; môn nào có trong registry kho DB đều cắm được). Câu chọn ở DB bằng đúng điều kiện
// MCQ chung `_kho_dk_mcq_sql` (fn_dtv_kho_bo_cau) — client chỉ gọi hàm, không lọc/tính gì.
import { sb, coMang } from '../lib/sb'
import { chuoiNgauNhien } from '../lib/tienich'
import type { Cau, CapNguon, ChuDeNguon, NguonCau } from './kieu'

interface DongKho { ma_cau: string; de: string; anh: string | null; giai: string | null; dang: string; muc: number | null; opts: string[]; dung: number }

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  if (!coMang) throw new Error('Không có mạng — môn này cần kho câu trên máy chủ')
  const { data, error } = await sb.rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

const sangCau = (r: DongKho): Cau => ({
  id: r.ma_cau,
  de: r.de,
  anh: r.anh,
  nhan: 'Chọn đáp án đúng:',
  phu: r.dang,
  opts: r.opts.map((t, i) => ({ id: `${r.ma_cau}#${i}`, text: t })),
  dung: `${r.ma_cau}#${r.dung}`,
  giai: r.giai,
})

const tenKhoi = (k: string) => (/^\d+T$/.test(k) ? `Lớp ${k.slice(0, -1)} (nâng cao)` : `Lớp ${k}`)

export function taoNguonKho(o: { mon: string; ten: string; icon: string; giayMoiCau: number; giayThap: number; capMacDinh: string }): NguonCau {
  let capCache: Promise<CapNguon[]> | null = null
  const cdCache = new Map<string, Promise<ChuDeNguon[]>>()
  const layBo = (cap: string, chuDe: string | null, so: number, seed: string, tangDan: boolean) =>
    rpc<DongKho[]>('fn_dtv_kho_bo_cau', { p_mon: o.mon, p_khoi: cap, p_chu_de: chuDe, p_so: so, p_seed: seed, p_tang_dan: tangDan }).then((ds) => ds.map(sangCau))
  return {
    mon: o.mon, ten: o.ten, icon: o.icon, giayMoiCau: o.giayMoiCau, giayThap: o.giayThap,
    coDaoChieu: false, coNhoTu: false, capMacDinh: o.capMacDinh, tenCap: 'Khối',
    dsCap() {
      if (!capCache) {
        capCache = rpc<{ khoi: string; so_cau: number }[]>('fn_dtv_kho_khoi', { p_mon: o.mon })
          .then((ds) => ds.map((d) => ({ id: d.khoi, ten: tenKhoi(d.khoi), mo: `${d.so_cau} câu` })))
        capCache.catch(() => { capCache = null })
      }
      return capCache
    },
    dsChuDe(cap) {
      if (!cdCache.has(cap)) {
        const p = rpc<{ ma: string; ten: string; so_cau: number }[]>('fn_dtv_kho_chu_de', { p_mon: o.mon, p_khoi: cap })
          .then((ds) => [
            { id: 'tron', ten: `Cả ${tenKhoi(cap).toLowerCase()}`, icon: '🎲', phu: 'Trộn mọi chủ đề' },
            ...ds.map((d) => ({ id: d.ma, ten: d.ten, icon: o.icon, phu: `${d.so_cau} câu` })),
          ])
        p.catch(() => cdCache.delete(cap))
        cdCache.set(cap, p)
      }
      return cdCache.get(cap)!
    },
    taoBoDe: (c) => layBo(c.cap, c.chuDe === 'tron' || c.chuDe === 'auto' ? null : c.chuDe, c.soCau, chuoiNgauNhien(12), false),
    taoThap: (che, ngay, cap, chuDe) => layBo(cap, chuDe ?? null, 200, `thap|${che}|${o.mon}|${cap}|${chuDe ? chuDe + '|' : ''}${ngay}`, true),
    nhomThap: (cap, chuDe) => (chuDe ? `${cap}|${chuDe}` : cap),
  }
}
