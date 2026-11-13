// Màn chính app HS — GỘP lượt gọi (spec-kien-truc §5 "một màn = một RPC", Đợt 4 · mig 202611140027).
//   khoiDongHS()  : MỘT RPC lúc mở app (fn_hs_khoi_dong) thay 9 lượt gọi lẻ + kèm phần màn chính của lượt đầu.
//   manChinhHS()  : MỘT RPC mỗi lần em về màn chính (fn_hs_man_chinh) thay 3–4 lượt gọi lẻ.
// Hàm gộp ở DB chỉ GỌI LẠI các hàm lẻ ⇒ công thức một nơi. RPC gộp lỗi (mạng, bản DB cũ, không phải HS) ⇒ rơi về gọi lẻ như trước.
// Quy ước trường: `undefined` = phần đó KHÔNG tải được ⇒ màn giữ nguyên xử lý lỗi cũ của từng phần (không coi là "rỗng").
import { supabase } from './supabase'
import {
  chuanHoSoHS, chuanLopMonHS, chuanMonRiengHS, hoSoCuaToi, khoiCuaHS, laCap1HS, lopMonCuaHS, monRiengCuaHS,
  type HoSoHS, type LopMonHS, type MonRiengHS,
} from './tuluyen'
import { laCap2HS } from './maymai_hs'
import { giaoDienCuaToi, home912, nhanVatCuaToi, type Home912 } from './giaodien_hs'
import { soGopYChuaDoc } from './gopy_hs'
import { chuoiCuaToi, type Chuoi } from './chuoi'
import { tinhNangMoCuaToi, type TinhNangMo } from './tinhnang'
import { tutorialDaXem } from './tutorial_hs'
import type { GiaoDien } from '../screens/hocsinh/skin/registry'

export type ManChinhHS = {
  chuoi?: Chuoi
  tinhNang?: TinhNangMo
  tutorial?: Set<string>
  home912?: Home912            // chỉ có khi gọi với can912 = true
}
export type KhoiDongHS = {
  cap1?: boolean
  cap2?: boolean
  khoi?: string | null
  hoSo?: HoSoHS | null
  lopMons?: LopMonHS[]
  monRieng?: MonRiengHS[]
  nhanVat?: string | null
  giaoDien?: GiaoDien | null   // null = em chưa có dòng hs_giao_dien (mở hướng dẫn lần đầu)
  gopYChuaDoc?: number
  manChinh: ManChinhHS
}

type Tho = Record<string, unknown>
function chuanManChinh(d: Tho, can912: boolean): ManChinhHS {
  const h = d.home912 as Partial<Home912> | null | undefined
  return {
    chuoi: (d.chuoi as Chuoi | null) ?? undefined,
    tinhNang: new Set((d.tinh_nang ?? []) as string[]),
    tutorial: new Set((d.tutorial ?? []) as string[]),
    home912: can912 && h ? { elo: h.elo ?? [], thi: h.thi ?? [] } : undefined,
  }
}
const thu = <T,>(p: Promise<T>): Promise<T | undefined> => p.catch(() => undefined)

async function manChinhLe(can912: boolean): Promise<ManChinhHS> {
  const [chuoi, tinhNang, tutorial, h] = await Promise.all([
    thu(chuoiCuaToi()), thu(tinhNangMoCuaToi()), thu(tutorialDaXem()), can912 ? thu(home912()) : Promise.resolve(undefined),
  ])
  return { chuoi, tinhNang, tutorial, home912: h }
}

/** Phần "về màn chính". can912 = có cần số Elo/kỳ thi của Home 6–12 không (em khối khác / đang ở trong một khu thì không). */
export async function manChinhHS(can912: boolean): Promise<ManChinhHS> {
  const { data, error } = await supabase.rpc('fn_hs_man_chinh', { p_home912: can912 })
  if (error || !data) return manChinhLe(can912)
  return chuanManChinh(data as Tho, can912)
}

/** Phần "khởi động" — gọi MỘT lần lúc mở app. `canNhanVat` chỉ ảnh hưởng nhánh gọi lẻ (RPC gộp luôn trả). */
export async function khoiDongHS(canNhanVat: boolean): Promise<KhoiDongHS> {
  const { data, error } = await supabase.rpc('fn_hs_khoi_dong')
  if (!error && data) {
    const d = data as Tho
    return {
      cap1: !!d.cap1,
      cap2: !!d.cap2,
      khoi: (d.khoi as string | null) ?? null,
      hoSo: chuanHoSoHS(d.ho_so),
      lopMons: chuanLopMonHS(d.mon_hoc),
      monRieng: chuanMonRiengHS(d.mon_rieng),
      nhanVat: (d.nhan_vat as string | null) ?? null,
      giaoDien: (d.giao_dien as GiaoDien | null) ?? null,
      gopYChuaDoc: (d.gop_y_chua_doc as number | null) ?? 0,
      manChinh: chuanManChinh((d.man_chinh ?? {}) as Tho, true),
    }
  }
  // Rơi về gọi lẻ (đúng các lượt gọi trước khi gộp). Elo/kỳ thi của Home 6–12 chỉ lấy khi biết em thuộc nhóm đó ⇒ màn tự gọi sau.
  const [cap1, cap2, khoi, hoSo, lopMons, monRieng, nhanVat, giaoDien, gopYChuaDoc, manChinh] = await Promise.all([
    thu(laCap1HS()), thu(laCap2HS()), thu(khoiCuaHS()), thu(hoSoCuaToi()), thu(lopMonCuaHS()), thu(monRiengCuaHS()),
    canNhanVat ? thu(nhanVatCuaToi()) : Promise.resolve(undefined), thu(giaoDienCuaToi()), thu(soGopYChuaDoc()), manChinhLe(false),
  ])
  return { cap1, cap2, khoi, hoSo, lopMons, monRieng, nhanVat, giaoDien, gopYChuaDoc, manChinh }
}
