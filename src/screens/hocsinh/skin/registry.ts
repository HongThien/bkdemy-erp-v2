// ============================================================================
// REGISTRY SKIN app HS lớp 9–12 (spec-giao-dien-hs.md, Thùy chốt 28/09/2026).
// 1 NGUỒN DUY NHẤT cho mọi skin: màu sáng/tối, font, hình dáng thẻ, hình nền. Component (HomeHS912,
// ChonGiaoDien) CHỈ đọc biến CSS `--sk-*` do `bienCss()` sinh ra — CẤM `if (skin === '…')` trong component
// (cùng luật đối xứng môn CLAUDE §1.6). Thêm skin = thêm 1 phần tử SKINS + nới CHECK `hs_giao_dien.skin`
// bằng migration mới (DB chặn skin lạ — đúng lúc HS bấm, xem CLAUDE §2.1 "cột text không nói tập giá trị").
// Nhóm khối: registry này chỉ cho lớp 9–12 (có điện thoại riêng). Lớp 3–5 / 6–8 sẽ có bộ riêng.
// ============================================================================

export type SkinId = 'toi_gian' | 'dau_truong' | 'y2k' | 'soft' | 'rpg'
export type CheDo = 'sang' | 'toi' | 'he_thong'
export type GiaoDien = { skin: SkinId; che_do: CheDo; hinh_nen: string }

// Khối dùng Home mới + tự chọn skin. Thùy 28/09 tối: MỌI skin mở cho MỌI em, không giới hạn tuổi ("lớp 6 vẫn thích anime")
// — nhóm tuổi chỉ là chuẩn để THIẾT KẾ skin. Cấp 1 (3–5) còn HomeCap1 riêng cho iPad, chưa chuyển. Khối lấy từ hs_khoi_cua_toi.
export const KHOI_CHON_SKIN = new Set(['6', '7', '8', '9', '10', '11', '12'])

type Mau = {
  bg: string; surface: string; surface2: string; ink: string; muted: string; line: string
  acc: string; accInk: string; badge: string; badgeInk: string
  cardBorder: string; cardShadow: string
}
// sangDoc/toiDoc: bản cho màn DỌC (điện thoại) — tranh vẽ riêng khổ 9:16, không có thì dùng bản thường.
type HinhNen = { id: string; ten: string; sang?: string; toi?: string; sangDoc?: string; toiDoc?: string }

export type Skin = {
  id: SkinId
  ten: string
  moTa: string
  giongGi: string
  font: string          // chữ thường
  fontHead: string      // tiêu đề, tên ô, số to
  headCase: 'none' | 'uppercase'
  headTrack: string
  radius: string        // bo góc thẻ
  cardClip: string      // clip-path thẻ ('none' nếu không cắt góc)
  cardAccentLeft: string // viền trái nhấn (Đấu trường) — 'none' nếu không
  blur: string          // backdrop-filter của thẻ (skin nền ảnh cần mờ sau thẻ)
  cheDo: ('sang' | 'toi')[] // chế độ skin hỗ trợ; 1 phần tử = khoá chế độ đó
  sang?: Mau
  toi?: Mau
  hinhNen: HinhNen[]    // phần tử đầu = mặc định ('mac_dinh' hoặc id riêng)
  anhO?: Record<string, string> // id ô → ảnh minh hoạ riêng của skin (không có thì dùng dauThayIcon, rồi emoji của ô)
  // Skin có bộ icon vẽ riêng mà chưa đủ ô ⇒ ô thiếu hiện DẤU này (màu nhấn) thay vì emoji — emoji lẫn icon vẽ tay trông lệch
  // (Thùy 28/09 chê bản RPG đầu: 📈📖 cạnh cuộn giấy/thư vẽ tay).
  dauThayIcon?: string
  trangTri?: { goc?: string; gach?: string } // hoa văn góc thẻ "Tiếp theo" + gạch phân cách dưới đầu trang
  anhBanner?: { lich?: string; kiemTraLai?: string } // ảnh vẽ riêng cho thẻ ca bổ trợ + banner bài kiểm tra lại
  // Thẻ "Việc tiếp theo": mặc định tô đặc màu nhấn. Skin nền tối sang (RPG) tô đặc thì thành mảng vàng thô — dùng kiểu riêng.
  theTiep?: { bg: string; ink: string; border: string }
  // Tấm mờ sau tên HS — skin nền ẢNH cần (tên đè lên tia sáng/lâu đài thì không đọc được). 'transparent' = không có.
  nenTen?: string
}

const A = '/bk-ui/hs/skin'
const LEX = "'Lexend', 'Be Vietnam Pro', system-ui, sans-serif"
const BVP = "'Be Vietnam Pro', system-ui, sans-serif"
// Thùy 29/09: lớp phủ cũ (tối đặc từ 48% xuống) làm nửa dưới đen kịt, không giống ảnh gốc ⇒ chỉ phủ nhẹ phần đáy cho chữ
// trên thẻ vẫn đọc được; thẻ đã có nền trong mờ + blur riêng.
const rpgNen = (f: string) =>
  `linear-gradient(180deg, rgba(20,26,51,0) 0%, rgba(20,26,51,0) 45%, rgba(20,26,51,0.35) 100%), url(${A}/rpg/${f}.jpg) center top / cover no-repeat, #141a33`

export const SKINS: Skin[] = [
  {
    id: 'toi_gian', ten: 'Tối giản', moTa: 'Gọn, rõ, không trang trí', giongGi: 'iOS · Notion',
    font: LEX, fontHead: LEX, headCase: 'none', headTrack: '-0.01em', radius: '18px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
    cheDo: ['sang', 'toi'],
    sang: { bg: '#f4f4f6', surface: '#ffffff', surface2: '#f0f0f3', ink: '#111114', muted: '#6b6f7b', line: '#e6e6ea', acc: '#111114', accInk: '#ffffff', badge: '#ff3b30', badgeInk: '#ffffff', cardBorder: '1px solid #ececef', cardShadow: 'none' },
    toi:  { bg: '#0e0e11', surface: '#17171c', surface2: '#1f1f25', ink: '#f2f2f4', muted: '#8d8f9a', line: '#26262d', acc: '#f2f2f4', accInk: '#0e0e11', badge: '#ff453a', badgeInk: '#ffffff', cardBorder: '1px solid #26262d', cardShadow: 'none' },
    hinhNen: [
      { id: 'mac_dinh', ten: 'Trơn', sang: '#f4f4f6', toi: '#0e0e11' },
      { id: 'cham', ten: 'Chấm bi', sang: 'radial-gradient(#d9d9df 1.2px, transparent 1.4px) 0 0 / 18px 18px, #f4f4f6', toi: 'radial-gradient(#2a2a32 1.2px, transparent 1.4px) 0 0 / 18px 18px, #0e0e11' },
      { id: 'suong', ten: 'Sương xanh', sang: 'linear-gradient(180deg, #e6ecf7 0%, #f4f4f6 55%)', toi: 'linear-gradient(180deg, #111a2c 0%, #0e0e11 55%)' },
      { id: 'hoang_hon', ten: 'Hoàng hôn', sang: 'linear-gradient(180deg, #f7e7dc 0%, #f4f4f6 55%)', toi: 'linear-gradient(180deg, #2a1712 0%, #0e0e11 55%)' },
    ],
  },
  {
    id: 'dau_truong', ten: 'Đấu trường', moTa: 'Góc vát, đỏ rực, đậm chất đua top', giongGi: 'Valorant · Liên Quân',
    font: "'Chakra Petch', 'Be Vietnam Pro', sans-serif", fontHead: "'Chakra Petch', 'Be Vietnam Pro', sans-serif", headCase: 'uppercase', headTrack: '0.04em',
    radius: '0px', cardClip: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))', cardAccentLeft: '3px solid #ff4655', blur: 'none',
    cheDo: ['toi', 'sang'],
    toi:  { bg: '#0f1923', surface: 'rgba(236,232,225,0.06)', surface2: 'rgba(236,232,225,0.1)', ink: '#ece8e1', muted: '#8b978f', line: 'rgba(236,232,225,0.14)', acc: '#ff4655', accInk: '#0f1923', badge: '#ff4655', badgeInk: '#0f1923', cardBorder: '1px solid rgba(236,232,225,0.14)', cardShadow: 'none' },
    sang: { bg: '#ece8e1', surface: '#ffffff', surface2: '#f5f2ec', ink: '#0f1923', muted: '#5d6a73', line: '#d5d0c7', acc: '#ff4655', accInk: '#ffffff', badge: '#ff4655', badgeInk: '#ffffff', cardBorder: '1px solid #d5d0c7', cardShadow: 'none' },
    hinhNen: [
      { id: 'mac_dinh', ten: 'Chiến trường', toi: 'linear-gradient(160deg, #0f1923 0%, #0b121a 60%, #2a0f16 100%)', sang: 'linear-gradient(160deg, #ece8e1 0%, #e4ded3 60%, #f3d6d8 100%)' },
      { id: 'luoi', ten: 'Lưới radar', toi: 'linear-gradient(rgba(255,70,85,0.07) 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(90deg, rgba(255,70,85,0.07) 1px, transparent 1px) 0 0 / 28px 28px, #0f1923', sang: 'linear-gradient(rgba(15,25,35,0.06) 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(90deg, rgba(15,25,35,0.06) 1px, transparent 1px) 0 0 / 28px 28px, #ece8e1' },
      { id: 'toc_do', ten: 'Tốc độ', toi: 'repeating-linear-gradient(115deg, rgba(255,70,85,0.06) 0 2px, transparent 2px 22px), #0f1923', sang: 'repeating-linear-gradient(115deg, rgba(255,70,85,0.08) 0 2px, transparent 2px 22px), #ece8e1' },
      { id: 'dem', ten: 'Đêm', toi: '#0b121a', sang: '#f2efe9' },
    ],
  },
  {
    id: 'y2k', ten: 'Y2K', moTa: 'Chữ to, viền đen, màu chanh', giongGi: 'Poster Gen Z · bìa album',
    font: BVP, fontHead: "'Unbounded', 'Be Vietnam Pro', sans-serif", headCase: 'uppercase', headTrack: '0',
    radius: '16px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
    cheDo: ['sang', 'toi'],
    sang: { bg: '#f1f1ea', surface: '#ffffff', surface2: '#b9a8ff', ink: '#0a0a0a', muted: '#4a4a4a', line: '#0a0a0a', acc: '#d4ff3f', accInk: '#0a0a0a', badge: '#0a0a0a', badgeInk: '#d4ff3f', cardBorder: '2px solid #0a0a0a', cardShadow: '4px 4px 0 #0a0a0a' },
    toi:  { bg: '#0a0a0a', surface: '#171717', surface2: '#2a2140', ink: '#f1f1ea', muted: '#b3b3a8', line: '#f1f1ea', acc: '#d4ff3f', accInk: '#0a0a0a', badge: '#d4ff3f', badgeInk: '#0a0a0a', cardBorder: '2px solid #f1f1ea', cardShadow: '4px 4px 0 #d4ff3f' },
    hinhNen: [
      { id: 'mac_dinh', ten: 'Giấy', sang: '#f1f1ea', toi: '#0a0a0a' },
      { id: 'ca_ro', ten: 'Ca rô', sang: 'repeating-conic-gradient(#e6e6dc 0 25%, #f1f1ea 0 50%) 0 0 / 36px 36px', toi: 'repeating-conic-gradient(#141414 0 25%, #0a0a0a 0 50%) 0 0 / 36px 36px' },
      { id: 'chanh', ten: 'Chanh', sang: 'radial-gradient(circle at 85% 8%, #d4ff3f 0 90px, transparent 91px), radial-gradient(circle at 5% 70%, #b9a8ff 0 70px, transparent 71px), #f1f1ea', toi: 'radial-gradient(circle at 85% 8%, #4d5c17 0 90px, transparent 91px), radial-gradient(circle at 5% 70%, #3a3063 0 70px, transparent 71px), #0a0a0a' },
      { id: 'hong', ten: 'Hồng', sang: 'linear-gradient(180deg, #ffd1ef 0%, #f1f1ea 50%)', toi: 'linear-gradient(180deg, #3d1233 0%, #0a0a0a 50%)' },
    ],
  },
  {
    id: 'soft', ten: 'Soft Hàn', moTa: 'Pastel nhẹ nhàng, gọn gàng', giongGi: 'Locket · ghi chú Hàn',
    font: BVP, fontHead: BVP, headCase: 'none', headTrack: '-0.01em',
    radius: '20px', cardClip: 'none', cardAccentLeft: 'none', blur: 'none',
    cheDo: ['sang', 'toi'],
    sang: { bg: '#f7f2fb', surface: '#ffffff', surface2: '#f6effa', ink: '#2c2340', muted: '#8a7fa3', line: '#eee6f5', acc: '#e96aa8', accInk: '#ffffff', badge: '#e96aa8', badgeInk: '#ffffff', cardBorder: 'none', cardShadow: '0 6px 18px rgba(120,80,160,0.09)' },
    toi:  { bg: '#1b1726', surface: '#251f33', surface2: '#2e2740', ink: '#f3eefc', muted: '#a99cc4', line: '#352d49', acc: '#f08dbf', accInk: '#1b1726', badge: '#f08dbf', badgeInk: '#1b1726', cardBorder: 'none', cardShadow: 'none' },
    hinhNen: [
      { id: 'mac_dinh', ten: 'Hồng tím', sang: 'linear-gradient(180deg, #fdf3f7 0%, #f4f1ff 100%)', toi: 'linear-gradient(180deg, #241a2c 0%, #1b1726 100%)' },
      { id: 'bac_ha', ten: 'Bạc hà', sang: 'linear-gradient(180deg, #e7f8f1 0%, #f3f7fb 100%)', toi: 'linear-gradient(180deg, #13241f 0%, #161a24 100%)' },
      { id: 'dao', ten: 'Đào', sang: 'linear-gradient(180deg, #fff0e6 0%, #fdf5f2 100%)', toi: 'linear-gradient(180deg, #2a1c18 0%, #1d1719 100%)' },
      { id: 'may', ten: 'Mây', sang: 'linear-gradient(180deg, #e6f1ff 0%, #f5f3ff 100%)', toi: 'linear-gradient(180deg, #151d30 0%, #1a1726 100%)' },
    ],
  },
  {
    id: 'rpg', ten: 'Anime RPG', moTa: 'Trời sao, đảo nổi, viền vàng', giongGi: 'Genshin · Star Rail',
    font: BVP, fontHead: "'Philosopher', 'Be Vietnam Pro', serif", headCase: 'none', headTrack: '0.01em',
    radius: '8px', cardClip: 'none', cardAccentLeft: 'none', blur: 'blur(6px)',
    cheDo: ['toi'],
    toi: { bg: '#141a33', surface: 'rgba(20,26,51,0.72)', surface2: 'rgba(233,199,123,0.12)', ink: '#f3ead0', muted: '#bfb08a', line: 'rgba(233,199,123,0.3)', acc: '#e9c77b', accInk: '#141a33', badge: '#e9c77b', badgeInk: '#141a33', cardBorder: '1px solid rgba(233,199,123,0.35)', cardShadow: 'none' },
    // Tranh vẽ riêng 2 khổ (ChatGPT Đơn 4, 28/09): ngang 1672×941 cho iPad/máy tính, dọc 940×1672 cho điện thoại.
    // Lớp phủ tối dần xuống dưới: chi tiết ở phần trên, vùng đặt ô thì tối và yên. Id 'bau_troi' giữ nguyên — HS đã lưu.
    hinhNen: [
      // Lâu đài lên ĐẦU = mặc định (Thùy 29/09: dùng ảnh 37 — bản dọc sáng hơn, giống ảnh gốc). HS đã lưu 'bau_troi' vẫn giữ.
      { id: 'lau_dai', ten: 'Lâu đài', toi: rpgNen('bg_lau_dai_ngang'), toiDoc: rpgNen('bg_lau_dai_doc_sang') },
      { id: 'bau_troi', ten: 'Đảo trời', toi: rpgNen('bg_dao_troi_ngang'), toiDoc: rpgNen('bg_dao_troi_doc') },
      { id: 'dem_sao', ten: 'Đêm sao', toi: 'radial-gradient(1.5px 1.5px at 20% 12%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 70% 30%, #fff 50%, transparent 51%), radial-gradient(1.2px 1.2px at 40% 60%, #e9c77b 50%, transparent 51%), radial-gradient(1px 1px at 85% 75%, #fff 50%, transparent 51%), radial-gradient(90% 60% at 50% 0%, #2c3a66 0%, #141a33 70%), #141a33' },
    ],
    // Mỗi ô 1 hình khác nhau. Khối 9 có Thành tựu, khối 10–12 có Bảng xếp hạng (không bao giờ cùng lưới) ⇒ dùng chung cúp.
    anhO: {
      giao_trinh: `${A}/rpg/o_tren_lop.png`, et: `${A}/rpg/o_et.png`, btvn: `${A}/rpg/o_btvn.png`, tu_luyen: `${A}/rpg/o_tu_luyen.png`,
      thong_tin: `${A}/rpg/o_thong_tin.png`, so_tay: `${A}/rpg/o_so_tay.png`, de_thi_thu: `${A}/rpg/o_thi_thu.png`,
      bai_tap_giao: `${A}/rpg/o_bai_tap_giao.png`, thanh_tuu: `${A}/rpg/o_cup.png`, xep_hang: `${A}/rpg/o_cup.png`,
      may_man: `${A}/rpg/o_ruong.png`, vi_xu: `${A}/rpg/o_vi_xu.png`, hoc_tu_dau: `${A}/rpg/o_hoc_tu_dau.png`,
    },
    dauThayIcon: '✦',
    trangTri: { goc: `${A}/rpg/corner.png`, gach: `${A}/rpg/divider.png` },
    anhBanner: { lich: `${A}/rpg/b_lich.png`, kiemTraLai: `${A}/rpg/b_kiem_tra_lai.png` },
    theTiep: { bg: 'linear-gradient(100deg, rgba(233,199,123,0.26) 0%, rgba(20,26,51,0.78) 70%)', ink: '#f3ead0', border: '1px solid rgba(233,199,123,0.7)' },
    nenTen: 'rgba(20,26,51,0.6)',
  },
]

export const SKIN_MAC_DINH: SkinId = 'rpg' // Thùy 29/09: chỉ Anime RPG dùng thật — em chưa chọn cũng ra RPG

export function laySkin(id: string | null | undefined): Skin {
  return SKINS.find((s) => s.id === id) ?? SKINS.find((s) => s.id === SKIN_MAC_DINH)!
}

// Chế độ thật đang vẽ: skin chỉ có 1 chế độ thì khoá; 'he_thong' theo điện thoại.
export function cheDoThat(skin: Skin, cheDo: CheDo, heThongToi: boolean): 'sang' | 'toi' {
  if (skin.cheDo.length === 1) return skin.cheDo[0]
  if (cheDo === 'he_thong') return heThongToi ? 'toi' : 'sang'
  return cheDo
}

export function layHinhNen(skin: Skin, id: string | null | undefined): HinhNen {
  return skin.hinhNen.find((h) => h.id === id) ?? skin.hinhNen[0]
}

// Biến CSS cho 1 (skin × chế độ × hình nền) — đặt lên thẻ gốc, mọi thứ bên trong đọc var(--sk-*).
// Hình nền 1 khổ: màn dọc lấy bản Doc nếu có, không thì bản thường.
export function nenCua(hn: HinhNen, cd: 'sang' | 'toi', doc: boolean): string | undefined {
  const thuong = (cd === 'toi' ? hn.toi : hn.sang) ?? hn.toi ?? hn.sang
  return doc ? ((cd === 'toi' ? hn.toiDoc : hn.sangDoc) ?? hn.toiDoc ?? hn.sangDoc ?? thuong) : thuong
}

export function bienCss(skin: Skin, cd: 'sang' | 'toi', hinhNenId: string | null | undefined, doc = false): Record<string, string> {
  const m = (cd === 'toi' ? skin.toi : skin.sang) ?? (skin.toi ?? skin.sang)!
  const hn = layHinhNen(skin, hinhNenId)
  return {
    '--sk-page': nenCua(hn, cd, doc) ?? m.bg,
    '--sk-bg': m.bg, '--sk-surface': m.surface, '--sk-surface2': m.surface2, '--sk-ink': m.ink, '--sk-muted': m.muted,
    '--sk-line': m.line, '--sk-acc': m.acc, '--sk-acc-ink': m.accInk, '--sk-badge': m.badge, '--sk-badge-ink': m.badgeInk,
    '--sk-card-border': m.cardBorder, '--sk-card-shadow': m.cardShadow, '--sk-card-clip': skin.cardClip,
    '--sk-card-left': skin.cardAccentLeft === 'none' ? m.cardBorder : skin.cardAccentLeft,
    '--sk-radius': skin.radius, '--sk-blur': skin.blur,
    '--sk-next-bg': skin.theTiep?.bg ?? m.acc, '--sk-next-ink': skin.theTiep?.ink ?? m.accInk, '--sk-next-border': skin.theTiep?.border ?? 'none',
    '--sk-name-plate': skin.nenTen ?? 'transparent',
    // Bóng chữ kế thừa cho MỌI chữ trong khung trang: skin nền ẢNH (có nenTen) cần — chữ đè đèn/lâu đài không đọc được (Thùy 29/09).
    '--sk-chu-bong': skin.nenTen ? '0 1px 6px rgba(8,10,24,0.9)' : 'none',
    '--sk-font': skin.font, '--sk-font-head': skin.fontHead, '--sk-head-case': skin.headCase, '--sk-head-track': skin.headTrack,
    colorScheme: cd === 'toi' ? 'dark' : 'light',
  }
}
