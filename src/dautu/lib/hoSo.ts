// Hồ sơ người chơi (DEMO: theo thiết bị). Bản gốc trên DB (fn_dtv_*) — XP, cấp, chuỗi tính ở Postgres.
// Ở máy chỉ giữ: uid bí mật, bản chụp hồ sơ gần nhất (để mở game không chờ mạng), và SỔ NHỚ TỪ (Leitner).
// ⚠ Nợ khi khớp HS BK: sổ nhớ từ phải chuyển thành nhật ký trả lời ở DB, mức nhớ suy động bằng fn (CLAUDE §1, §2.0).
import { useEffect, useState } from 'react'
import { chuoiNgauNhien, docLS, ghiLS, taoKho } from './tienich'

export type NvId = 'tham_hiem_nam' | 'tham_hiem_nu' | 'hiep_si_dem' | 'phap_su'

export interface HoSoDB {
  ma: string
  ten: string
  nv: NvId
  xp: number
  cap: number
  xp_trong_cap: number
  can_cho_cap_sau: number
  so_tran: number
  so_thang: number
  chuoi_thang: number
  chuoi_thang_max: number
  chuoi_ngay: number
  hoc_hom_nay: boolean
}

export type MucNho = 'yeu' | 'dang_nho' | 'quen' | 'thao'
export interface Nho { gap: number; nhanh: number; muc: MucNho; cuoi: number; han: number; giay: number; lyDo: string }

export interface HoSo {
  uid: string
  db: HoSoDB | null // null = chưa tạo nhân vật
  nho: Record<string, Nho>
}

// ?may=2 ⇒ hồ sơ riêng trong cùng trình duyệt (thử 2 người chơi trên 1 máy)
const MAY = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('may') ?? '' : ''
const K_UID = 'dtv_uid' + MAY
const K_DB = 'dtv_ho_so' + MAY
const K_NHO = 'dtv_nho' + MAY

function layUid() {
  let u = docLS<string>(K_UID, '')
  if (!u) { u = 'd' + chuoiNgauNhien(31); ghiLS(K_UID, u) }
  return u
}

export const khoHoSo = taoKho<HoSo>({ uid: layUid(), db: docLS<HoSoDB | null>(K_DB, null), nho: docLS(K_NHO, {}) })

export function datDB(db: HoSoDB) {
  khoHoSo.dat((h) => ({ ...h, db }))
  ghiLS(K_DB, db)
}

export function useHoSo() {
  const [h, setH] = useState(khoHoSo.lay())
  useEffect(() => khoHoSo.nghe(setH), [])
  return h
}

// ── Sổ nhớ từ (Leitner như bản gốc): đúng < 4s = 1 lần "nhanh"; 3 lần liền ⇒ quen (ôn sau 3 ngày); 5 ⇒ thạo (7 ngày);
//    sai hoặc ≥ 4s ⇒ yếu (ôn ngay). ─────────────────────────────────────────────────────────────────────────────────────
const NGAY = 864e5
export function capNhatNho(id: string, dung: boolean, giay: number) {
  khoHoSo.dat((h) => {
    const cu = h.nho[id] ?? { gap: 0, nhanh: 0, muc: 'dang_nho' as MucNho, cuoi: 0, han: 0, giay: 0, lyDo: '' }
    const nhanhLan = dung && giay < 4
    const nhanh = nhanhLan ? cu.nhanh + 1 : 0
    const muc: MucNho = !dung || giay >= 4 ? 'yeu' : nhanh >= 5 ? 'thao' : nhanh >= 3 ? 'quen' : 'dang_nho'
    const ngayOn = nhanhLan ? (nhanh >= 5 ? 7 : nhanh >= 3 ? 3 : 1) : 0
    const bay = Date.now()
    const moi: Nho = { gap: cu.gap + 1, nhanh, muc, cuoi: bay, han: bay + ngayOn * NGAY, giay, lyDo: !dung ? 'Trả lời sai' : giay >= 4 ? 'Trả lời chậm' : 'Đúng nhanh' }
    const nho = { ...h.nho, [id]: moi }
    ghiLS(K_NHO, nho)
    return { ...h, nho }
  })
}

export const tuYeu = (nho: Record<string, Nho>) =>
  Object.entries(nho).filter(([, n]) => n.muc === 'yeu').sort((a, b) => b[1].cuoi - a[1].cuoi).map(([id]) => id)

export const tuDenHan = (nho: Record<string, Nho>) =>
  Object.entries(nho).filter(([, n]) => n.muc !== 'yeu' && n.han <= Date.now()).map(([id]) => id)

export const TEN_MUC: Record<MucNho, string> = { yeu: 'Cần ôn', dang_nho: 'Đang nhớ', quen: 'Đã quen', thao: 'Thành thạo' }
