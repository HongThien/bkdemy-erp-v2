// VỎ ERP mượn GÓI STYLE của app Học sinh (Thùy 13/10: "dùng theme giống app học sinh" · "vẫn phải cho chọn hình nền").
// 5 lựa chọn = 1 MẶC ĐỊNH (giao diện ERP như cũ: nền sáng, thẻ trắng — `NHU_CU` dưới đây) + 4 style có tranh nền của app HS
// (Anime RPG · Khối vuông · Lo-fi chill · Đáng yêu — lấy từ `skin/registry.ts`). Mỗi nhân sự tự chọn style + hình nền của
// style đó + sáng/tối (nếu style có cả hai) — lưu `nhan_su.erp_giao_dien`. Chưa chọn gì ⇒ Mặc định.
// KHÔNG chép màu / đường dẫn hình sang đây: dùng lại `bienCss()` của app HS ⇒ mọi thứ trong vỏ ERP đọc biến `--sk-*`
// y như màn HS, style bên HS đổi màu / thay tranh / thêm style mới thì vỏ ERP tự theo.
// Phạm vi áp: THANH TRÊN CÙNG + TRANG CHÍNH + trang nhóm (các "màn ngoài" — STYLE-HS.md §2.6). Màn làm việc bên trong
// (bảng, form) GIỮ nền sáng như cũ: đó là chỗ đọc số cả ngày, không phủ tranh.
import { useMemo, type CSSProperties } from 'react'
import { SKINS, bienCss, cheDoThat, layHinhNen, type Skin } from '../screens/hocsinh/skin/registry'
import { useStore, type GiaoDienErp } from '../store/useStore'
import { useIsMobile } from '../hooks/useIsMobile'

// Style của vỏ ERP = style app HS, chỉ khác `id` không bị bó trong danh sách id của HS (ERP có thêm style riêng "mac_dinh").
export type SkinErp = Omit<Skin, 'id'> & { id: string }

// GIAO DIỆN "NHƯ CŨ" của ERP (Thùy 13/10: "không có giao diện như cũ à") — khai như MỘT style để đi chung đường với các style
// kia (không rẽ nhánh `if` trong màn): thanh trên trắng, nền trang xám nhạt #f5f5f7, thẻ trắng viền mảnh, màu nhấn chàm,
// font của ERP, không tranh nền, không nhân vật, icon box là emoji. Đây là NƠI ĐỊNH NGHĨA màu của style này (như 1 file
// trong skin/styles/) nên được gõ mã màu; các màn vẫn chỉ đọc `--sk-*`.
const NHU_CU: SkinErp = {
  id: 'mac_dinh', ten: 'Mặc định', moTa: 'Giao diện ERP như cũ: nền sáng, thẻ trắng', giongGi: 'ERP trước 13/10',
  font: 'inherit', fontHead: 'inherit', headCase: 'none', headTrack: '0',
  radius: '16px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
  cheDo: ['sang'],
  sang: {
    bg: '#ffffff', surface: '#ffffff', surface2: '#f1f5f9', ink: '#1e293b', muted: '#64748b', line: '#e2e8f0',
    acc: '#4f46e5', accInk: '#ffffff', badge: '#4f46e5', badgeInk: '#ffffff',
    cardBorder: '1px solid #e2e8f0', cardShadow: '0 1px 3px rgba(15,23,42,0.07)',
  },
  hinhNen: [{ id: 'tron', ten: 'Trơn', sang: '#f5f5f7' }],
}
// Style HS KHÔNG đưa vào bảng chọn của ERP: Tối giản — cũng là nền trơn, trùng vai với Mặc định (Thùy đếm 5 = 1 mặc định + 4 tranh).
const KHONG_DUA_VAO_ERP = new Set<string>(['toi_gian'])
export const SKINS_ERP: SkinErp[] = [NHU_CU, ...SKINS.filter((s) => !KHONG_DUA_VAO_ERP.has(s.id))]

// STYLE MỚI CHO XEM TRƯỚC: id style → danh sách mã nhân sự (ma_ns) được thấy trong bảng Giao diện của ERP. Không có trong bảng = ai cũng thấy.
// Thùy 30/10: Halloween (có hoạt cảnh) chỉ NS008 xem trước — ổn thì XOÁ dòng `halloween` là mọi nhân sự thấy. (App HS không bị giới hạn này.)
export const STYLE_RIENG_CHO: Record<string, string[]> = {
  halloween: ['NS008'],
}
const duocThay = (id: string, maNs: string | null | undefined) => !STYLE_RIENG_CHO[id] || (!!maNs && STYLE_RIENG_CHO[id].includes(maNs))
// Style người này được chọn (đúng thứ tự SKINS_ERP).
export const skinsErpCho = (maNs: string | null | undefined): SkinErp[] => SKINS_ERP.filter((s) => duocThay(s.id, maNs))

// id lạ / đã bỏ / chưa chọn / style chưa mở cho người này ⇒ Mặc định (phần tử đầu).
export const skinErp = (id: string | null | undefined, maNs?: string | null): SkinErp =>
  SKINS_ERP.find((s) => s.id === id && duocThay(s.id, maNs)) ?? SKINS_ERP[0]
export const cheDoErp = (skin: SkinErp, gd: GiaoDienErp): 'sang' | 'toi' => cheDoThat(skin as Skin, gd.che_do ?? skin.cheDo[0], false)

// Icon cho box nhóm — mượn icon Ô CHỨC NĂNG của style theo NGHĨA (mọi style đều có đủ các ô này: check:style-hs kiểm):
//   Việc của tôi = Nhiệm vụ · Vận hành = Trên lớp · Gamification = Thành tựu (cúp) · Học thuật = Tự luyện (sách)
//   Quản lý chất lượng = Luyện dạng yếu (ngắm trúng đích) · Core team = Rank (huy hiệu đội) · Dashboard = Thông tin học tập (bản đồ/số liệu).
function anhNhom(skin: SkinErp): Record<string, string | undefined> {
  const o = skin.anhO ?? {}
  return {
    viec: o.nhiem_vu,
    'Vận hành': o.giao_trinh,
    'Gamification': o.thanh_tuu,
    'Học thuật': o.tu_luyen,
    'Quản lý chất lượng': skin.anhNv?.icon.luyenYeu ?? o.luyen_yeu ?? o.de_thi_thu,
    'Core team': o.rank,
    'Dashboard': o.thong_tin,
  }
}

// id hình nền đặc biệt: ảnh người dùng tự chọn (URL ở gd.nen_url).
export const NEN_TU_CHON = 'tu_chon'

// HÌNH NỀN DÙNG CHUNG của vỏ ERP (mọi style đều chọn được) — "phòng học" do ChatGPT vẽ, bộ bk-erp-home-objects-v1
// (script nén: scripts/erp-nen-hinh.mjs). Ảnh đã có sẵn nhân vật / mèo / bàn học trong tranh ⇒ khi chọn, các asset
// trang trí của style (nhân vật góc trái, bong bóng, hoạ tiết) tự bỏ — y như ảnh cá nhân.
// `rieng_cho` = danh sách mã nhân sự (ma_ns) được thấy hình đó trong bảng chọn; bỏ trống = ai cũng thấy.
// Hình thiết kế riêng theo order: file gốc ở design/bk-ui-src/erp-ca-nhan/, bản nén ở public/bk-ui/erp/nen/ca-nhan/.
// `viTri` (tuỳ chọn) = vị trí ảnh khi bị xén theo khung (CSS background-position, mặc định 'center'): ảnh có chữ sát mép trên thì đặt 'center 10%' (hoặc 'center top') để không bị cắt khi màn rộng xén ảnh theo chiều dọc.
export type NenErp = { id: string; ten: string; url: string; rieng_cho?: string[]; viTri?: string }
export const NEN_ERP: NenErp[] = [
  { id: 'erp_ke_hoc_thuat', ten: 'Kệ học thuật', url: '/bk-ui/erp/nen/ke_hoc_thuat.jpg' },
  { id: 'erp_pegboard', ten: 'Bảng đục lỗ', url: '/bk-ui/erp/nen/pegboard.jpg' },
  { id: 'erp_lang_bk', ten: 'Làng BK', url: '/bk-ui/erp/nen/lang_bk.jpg' },
  // Hình riêng theo order — thêm 1 dòng/ảnh (nén bằng `node scripts/erp-nen-ca-nhan.mjs`)
  { id: 'erp_cn_ns002', ten: 'Của tôi', url: '/bk-ui/erp/nen/ca-nhan/ns002.jpg', rieng_cho: ['NS002'] },
  { id: 'erp_cn_ns009', ten: 'Nền của Quỳnh Trang', url: '/bk-ui/erp/nen/ca-nhan/ns009.jpg', rieng_cho: ['NS009'], viTri: 'center 10%' },
  { id: 'erp_cn_ns004', ten: 'Sân thượng sau mưa', url: '/bk-ui/erp/nen/ca-nhan/ns004.jpg', rieng_cho: ['NS004'] },
  { id: 'erp_cn_ns008', ten: 'Vịt vàng', url: '/bk-ui/erp/nen/ca-nhan/ns008.jpg', rieng_cho: ['NS008', 'NS009'] },
]
// Hình nền người này được thấy (dùng chung + hình riêng của đúng mã nhân sự).
export const nenErpCho = (maNs: string | null | undefined): NenErp[] =>
  NEN_ERP.filter((n) => !n.rieng_cho || (!!maNs && n.rieng_cho.includes(maNs)))

// DÁNG THẺ RIÊNG theo mã nhân sự: ghi đè từng biến `--sk-*` của style đang chọn, chỉ cho đúng người đó — mọi màn đọc
// `var(--sk-*)` nên tự theo, không rẽ nhánh `if` trong màn. Trường nào bỏ trống = giữ nguyên của style.
// Giá trị là CSS thô, ví dụ { acc: '#2f6f5e', cardBorder: '2px solid #4a342a', radius: '22px', fontHead: "'Mali', cursive" }.
export type DangRieng = Partial<{
  surface: string; surface2: string; ink: string; muted: string; line: string; acc: string; accInk: string
  badge: string; badgeInk: string; cardBorder: string; cardShadow: string; radius: string; fontHead: string; blur: string
}>
export const DANG_RIENG: Record<string, DangRieng> = {
  // Bảng quy ước + công thức phong cách: design/ERP-NEN-VA-THE-RIENG.md
  // NS004 — "Weathering": kính mờ trắng-xanh (đọc rõ trên trời xanh), chữ xanh navy, nhấn cam đỏ như cổng torii trong tranh.
  NS004: {
    surface: 'rgba(255,255,255,0.84)', surface2: 'rgba(214,232,250,0.72)', ink: '#14305c', muted: '#4a6a9a', line: 'rgba(90,130,190,0.32)',
    acc: '#cf4a2a', accInk: '#ffffff', badge: '#cf4a2a', badgeInk: '#ffffff',
    cardBorder: '1px solid rgba(255,255,255,0.75)', cardShadow: '0 10px 30px rgba(14,48,110,0.28), inset 0 1px 0 rgba(255,255,255,0.9)',
    radius: '20px', blur: 'blur(14px) saturate(1.25)',
  },
  // NS008 — "Vịt vàng cute": thẻ kem sữa viền nâu đậm dày (như nét viền của vịt), bo tròn mềm, bóng CỨNG lệch xuống (không blur),
  // chữ nâu ấm; nhấn san hô như hình trái tim/má hồng trong tranh. Thẻ kem + viền nâu tách khỏi nền vàng pastel nên vẫn dễ nhìn.
  NS008: {
    surface: '#fffdf3', surface2: '#ffefb8', ink: '#4a3b32', muted: '#86705f', line: 'rgba(74,59,50,0.22)',
    acc: '#d4553a', accInk: '#ffffff', badge: '#d4553a', badgeInk: '#ffffff',
    cardBorder: '2.5px solid #4a3b32', cardShadow: '0 4px 0 rgba(74,59,50,0.28)',
    radius: '22px', blur: 'none',
  },
  // NS009 — "Bé tròn picnic": thẻ trắng sữa viền nâu #4a342a dày (đúng nét viền của các bé), bo 24px rất tròn, bóng CỨNG lệch xuống,
  // chữ nâu ấm; nhấn HỒNG DÂU như má hồng trong tranh, ô con hồng phấn. Thẻ trắng + viền nâu tách rõ khỏi nền xanh trời / khăn caro xanh.
  NS009: {
    surface: '#fffdf8', surface2: '#ffe4ec', ink: '#4a342a', muted: '#8a7468', line: 'rgba(74,52,42,0.2)',
    acc: '#d94a7a', accInk: '#ffffff', badge: '#d94a7a', badgeInk: '#ffffff',
    cardBorder: '2.5px solid #4a342a', cardShadow: '0 4px 0 rgba(74,52,42,0.3)',
    radius: '24px', blur: 'none',
  },
}
// MÈO NGỦ trên card "Chào …" (components/MeoNgu.tsx). Đơn vị px trừ khi ghi "tỉ lệ".
//   rong: bề ngang thân · phai: cách mép PHẢI card · chim: thân lún xuống mặt card bấy nhiêu px
//   duoiCao: chiều cao hình đuôi · duoiX / duoiY: chỗ gốc đuôi trong thân (tỉ lệ 0–1, từ trái / từ trên)
//   tiLeThan / tiLeDuoi: rộng÷cao của 2 file đã nén (script in ra khi chạy erp-nen-ca-nhan.mjs)
export type MeoNguCfg = { than: string; duoi: string; tiLeThan: number; tiLeDuoi: number; rong: number; phai: number; chim: number; duoiCao: number; duoiX: number; duoiY: number }
export const MEO_NGU: Record<string, MeoNguCfg> = {
  NS004: { than: '/bk-ui/erp/nen/ca-nhan/ns004_meo_than.webp', duoi: '/bk-ui/erp/nen/ca-nhan/ns004_meo_duoi.webp', tiLeThan: 2.41, tiLeDuoi: 0.232, rong: 150, phai: -8, chim: 10, duoiCao: 76, duoiX: 0.965, duoiY: 0.5 },
}
// VỊT ĐI LẠI trên mép card "Chào …" (components/VitDi.tsx): 3 dáng cắt chung 1 khung (ĐỨNG · BƯỚC 1 · BƯỚC 2), mặt quay PHẢI (code tự lật khi quay đầu).
//   cao: chiều cao vịt (px) · chim: chân lún xuống mặt card bấy nhiêu px · tiLe: rộng÷cao của file đã nén (script in ra)
//   lac1 / lac2 (tuỳ chọn): 2 dáng LẮC MÔNG đổi nhau nhanh lúc nghỉ giữa đường (không có ⇒ đứng yên bằng dáng `dung`)
//   goc: độ nghiêng mỗi bước (độ, mặc định 3) · nay: độ nảy mỗi bước (px, mặc định 4) — tăng lên cho dáng đi "lắc lư" hơn
export type VitDiCfg = { dung: string; buoc1: string; buoc2: string; lac1?: string; lac2?: string; tiLe: number; cao: number; chim: number; goc?: number; nay?: number }
export const VIT_DI: Record<string, VitDiCfg> = {
  // NS002 — corgi: vừa đi vừa lắc mông (nghiêng 6° mỗi bước, nảy 3px), nghỉ giữa đường thì lắc mông tại chỗ
  NS002: { dung: '/bk-ui/erp/nen/ca-nhan/ns002_corgi_dung.webp', buoc1: '/bk-ui/erp/nen/ca-nhan/ns002_corgi_buoc_1.webp', buoc2: '/bk-ui/erp/nen/ca-nhan/ns002_corgi_buoc_2.webp', lac1: '/bk-ui/erp/nen/ca-nhan/ns002_corgi_lac_1.webp', lac2: '/bk-ui/erp/nen/ca-nhan/ns002_corgi_lac_2.webp', tiLe: 1.25, cao: 64, chim: 4, goc: 6, nay: 3 },
  NS008: { dung: '/bk-ui/erp/nen/ca-nhan/ns008_vit_dung.webp', buoc1: '/bk-ui/erp/nen/ca-nhan/ns008_vit_buoc_1.webp', buoc2: '/bk-ui/erp/nen/ca-nhan/ns008_vit_buoc_2.webp', tiLe: 0.778, cao: 78, chim: 6 },
}
// HAI BẠN ĐI GẶP NHAU rồi chào, bấm vào thì giận (components/DoiBan.tsx). Mỗi bạn 6 dáng cắt chung 1 khung, vẽ quay PHẢI:
//   dung · buoc1 · buoc2 (đi) · chao1 · chao2 (vẫy tay) · gian (nhìn thẳng, giận). `a` đi từ TRÁI sang, `b` từ PHẢI sang.
//   cao: chiều cao cả hai (px) · chim: chân lún xuống mặt card · tiLe mỗi bạn: rộng÷cao file đã nén (script in ra)
export type DoiBanNv = { dung: string; buoc1: string; buoc2: string; chao1: string; chao2: string; gian: string; tiLe: number }
export type DoiBanCfg = { a: DoiBanNv; b: DoiBanNv; cao: number; chim: number }
const dbNv = (ma: string, ten: string, tiLe: number): DoiBanNv => {
  const f = (d: string) => `/bk-ui/erp/nen/ca-nhan/${ma}_${ten}_${d}.webp`
  return { dung: f('dung'), buoc1: f('buoc_1'), buoc2: f('buoc_2'), chao1: f('chao_1'), chao2: f('chao_2'), gian: f('gian'), tiLe }
}
export const DOI_BAN: Record<string, DoiBanCfg> = {
  // NS009 — mèo tóc xanh (a) đi từ trái, thỏ vàng (b) đi từ phải; gặp nhau giữa card, vẫy chào, đi tiếp
  NS009: { a: dbNv('ns009', 'hachi', 0.836), b: dbNv('ns009', 'usagi', 0.656), cao: 62, chim: 5 },
}

const BIEN_RIENG: Record<keyof DangRieng, string> = {
  surface: '--sk-surface', surface2: '--sk-surface2', ink: '--sk-ink', muted: '--sk-muted', line: '--sk-line', acc: '--sk-acc', accInk: '--sk-acc-ink',
  badge: '--sk-badge', badgeInk: '--sk-badge-ink', cardBorder: '--sk-card-border', cardShadow: '--sk-card-shadow', radius: '--sk-radius',
  fontHead: '--sk-font-head', blur: '--sk-blur',
}
export function bienRieng(maNs: string | null | undefined): Record<string, string> {
  const d = maNs ? DANG_RIENG[maNs] : undefined
  const o: Record<string, string> = {}
  if (d) for (const k of Object.keys(d) as (keyof DangRieng)[]) if (d[k]) o[BIEN_RIENG[k]] = d[k]!
  return o
}

export function useSkinErp() {
  const gd = useStore((s) => s.erpGiaoDien)
  const maNs = useStore((s) => s.me?.nhanSu.ma_ns)
  const doc = useIsMobile()
  return useMemo(() => {
    const skin = skinErp(gd.skin, maNs)
    // Ảnh nền ĐÈ hình nền của style: ảnh người dùng tự đưa lên, hoặc 1 trong NEN_ERP.
    const nenCo = gd.nen === NEN_TU_CHON ? undefined : NEN_ERP.find((n) => n.id === gd.nen)
    const nenUrl = gd.nen === NEN_TU_CHON ? (gd.nen_url ?? null) : (nenCo?.url ?? null)
    const tuChon = !!nenUrl
    const cd = cheDoErp(skin, gd)
    const nv = (cd === 'toi' ? skin.nhanVatToi : undefined) ?? skin.nhanVat
    return {
      skin, cd, gd,
      nenId: tuChon ? (gd.nen as string) : layHinhNen(skin as Skin, gd.nen).id,
      // Gắn lên khối gốc (thanh trên / trang chính): bên trong chỉ dùng `var(--sk-*)`.
      bien: { ...bienCss(skin as Skin, cd, gd.nen, doc), ...(tuChon ? { '--sk-page': `url("${nenUrl}") ${nenCo?.viTri ?? 'center'} / cover no-repeat`, '--sk-goc': 'none' } : {}), ...bienRieng(maNs) } as CSSProperties,
      anhNhom: anhNhom(skin),
      iconMatNa: !!skin.anhOMask,   // style đơn sắc: icon là mặt nạ, tô bằng màu chữ
      // Nền ảnh cá nhân ⇒ BỎ các asset trang trí của style (nhân vật, hoạ tiết góc, gạch) — ảnh của người dùng là chính.
      nhanVat: tuChon ? undefined : nv?.nam,
      nhanVatLoc: skin.nhanVatLoc,
      // Hoạt cảnh trên tranh (Halloween 30/10: bí ngô sáng/tắt, dơi, ma — screens/hocsinh/skin/HoatCanhNen.tsx). Ảnh cá nhân ⇒ bỏ (điểm sáng đo trên tranh của style).
      hoatCanh: tuChon ? undefined : skin.hoatCanh,
      doc,
      // Nhân vật bồng bềnh (thân trôi, đế đứng yên) — chỉ khi style khai linh vật nhiều lớp + bật nvBong.
      linhVat: tuChon || !skin.hoatCanh?.nvBong ? undefined : skin.homeSong?.linhVat?.nam,
      gach: tuChon ? undefined : skin.trangTri?.gach,
    }
  }, [gd, doc, maNs])
}
