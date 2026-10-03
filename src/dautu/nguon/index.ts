// REGISTRY môn → nguồn câu (1 chỗ duy nhất, CLAUDE §1.6). Thêm môn: viết NguonCau rồi thêm 1 dòng ở đây.
import { useEffect, useState } from 'react'
import { docLS, ghiLS, taoKho } from '../lib/tienich'
import { NGUON_ANH } from './anh'
import { taoNguonKho } from './kho'
import type { NguonCau } from './kieu'

export const NGUON: Record<string, NguonCau> = {
  'Tiếng Anh': NGUON_ANH,
  'Toán': taoNguonKho({ mon: 'Toán', ten: 'Toán', icon: '📐', giayMoiCau: 45, giayThap: 40, capMacDinh: '7' }),
  'KHTN': taoNguonKho({ mon: 'KHTN', ten: 'KHTN', icon: '🔬', giayMoiCau: 30, giayThap: 25, capMacDinh: '8' }),
}
export const DS_MON = Object.keys(NGUON)
export const nguonCua = (mon: string | null | undefined) => NGUON[mon ?? ''] ?? NGUON_ANH

/** Môn đang chơi (lưu ở máy). */
export const khoMon = taoKho<string>(NGUON[docLS('dtv_mon', 'Tiếng Anh')] ? docLS('dtv_mon', 'Tiếng Anh') : 'Tiếng Anh')
khoMon.nghe((m) => ghiLS('dtv_mon', m))
export function useMon() {
  const [m, setM] = useState(khoMon.lay())
  useEffect(() => khoMon.nghe(setM), [])
  return nguonCua(m)
}

/** Cấp/khối đang chọn theo từng môn (lưu ở máy). */
export const khoCap = taoKho<Record<string, string>>(docLS('dtv_cap', {}))
khoCap.nghe((v) => ghiLS('dtv_cap', v))
export function useCap(n: NguonCau): [string, (c: string) => void] {
  const [v, setV] = useState(khoCap.lay())
  useEffect(() => khoCap.nghe(setV), [])
  return [v[n.mon] ?? n.capMacDinh, (c) => khoCap.dat((x) => ({ ...x, [n.mon]: c }))]
}

export type { Cau, NguonCau, CauHinhBo, CheDoThap, ChuDeNguon, CapNguon, PhuongAn } from './kieu'
