// NGUỒN CÂU môn ANH (từ vựng) — bọc kho từ demo (data/kho.ts + lib/boDe.ts) thành NguonCau. Đổi sang kho DB `anh_tu_vung` sau (spec §6).
import { CAP_DO, CHU_DE, TU_THEO_CD, TU_THEO_ID, TEN_LOAI, type CapDo } from '../data/kho'
import { taoBoDe, type CauTu } from '../lib/boDe'
import { taoThapTu } from '../lib/thap'
import type { Cau, NguonCau } from './kieu'

export function cauTuVung(c: CauTu): Cau {
  const t = TU_THEO_ID.get(c.id)!
  const nhan = (id: string) => { const x = TU_THEO_ID.get(id); return (c.dao ? x?.en : x?.vi) ?? '' }
  return {
    id: c.id,
    de: c.dao ? t.vi : t.en,
    nhan: c.dao ? 'Chọn từ tiếng Anh có nghĩa:' : 'Chọn nghĩa tiếng Việt đúng:',
    phu: c.dao ? TEN_LOAI[t.pos] : `${t.ipa} · ${TEN_LOAI[t.pos]}`,
    doc: t.en,
    opts: c.opts.map((id) => ({ id, text: nhan(id) })),
    dung: c.id,
    dao: c.dao,
    giai: `“${t.vd}” — ${t.vdvi}`,
    tuId: c.id,
  }
}

export const NGUON_ANH: NguonCau = {
  mon: 'Tiếng Anh', ten: 'Tiếng Anh', icon: '🇬🇧',
  giayMoiCau: 12, giayThap: 10, coDaoChieu: true, coNhoTu: true, capMacDinh: 'tat_ca', tenCap: 'Cấp độ',
  dsCap: async () => CAP_DO.map((c) => ({ id: c.id, ten: c.ten, mo: c.mo })),
  dsChuDe: async () => [
    { id: 'auto', ten: 'Đấu ngẫu nhiên', icon: '✨', phu: 'Hệ thống tự chọn chủ đề' },
    { id: 'tron', ten: 'Trộn tất cả', icon: '🎲', phu: 'Mọi chủ đề' },
    ...CHU_DE.map((c) => ({ id: c.id, ten: c.ten, icon: c.icon, mau: c.mau, phu: `${c.tenEn} · ${TU_THEO_CD[c.id]?.length ?? 0} từ` })),
  ],
  taoBoDe: async (o) => taoBoDe({ chuDe: o.chuDe, capDo: o.cap as CapDo, soCau: o.soCau, tiLeDao: o.tiLeDao, uuTien: o.uuTien }).map(cauTuVung),
  taoThap: async (che, ngay) => taoThapTu(che, ngay).map(cauTuVung),
  nhomThap: () => '',
}
