// ============================================================================
// REGISTRY SKIN app HS lớp 9–12 (spec-giao-dien-hs.md, Thùy chốt 28/09/2026).
// 1 NGUỒN DUY NHẤT cho mọi skin: màu sáng/tối, font, hình dáng thẻ, hình nền. Component (HomeHS912,
// ChonGiaoDien) CHỈ đọc biến CSS `--sk-*` do `bienCss()` sinh ra — CẤM `if (skin === '…')` trong component
// (cùng luật đối xứng môn CLAUDE §1.6). Thêm skin = thêm 1 phần tử SKINS + nới CHECK `hs_giao_dien.skin`
// bằng migration mới (DB chặn skin lạ — đúng lúc HS bấm, xem CLAUDE §2.1 "cột text không nói tập giá trị").
// Mọi skin mở cho mọi em (Thùy 28/09 tối); mặc định = SKIN_MAC_DINH. Skin cũ trong DB mà code không còn ⇒ laySkin() tự ra mặc định.
// ============================================================================

export type SkinId = 'rpg' // thêm style mới: thêm id ở đây + phần tử SKINS + nới CHECK hs_giao_dien.skin
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
const BVP = "'Be Vietnam Pro', system-ui, sans-serif"
// Thùy 29/09: lớp phủ cũ (tối đặc từ 48% xuống) làm nửa dưới đen kịt, không giống ảnh gốc ⇒ chỉ phủ nhẹ phần đáy cho chữ
// trên thẻ vẫn đọc được; thẻ đã có nền trong mờ + blur riêng.
const rpgNen = (f: string) =>
  `linear-gradient(180deg, rgba(20,26,51,0) 0%, rgba(20,26,51,0) 45%, rgba(20,26,51,0.35) 100%), url(${A}/rpg/${f}.jpg) center top / cover no-repeat, #141a33`

export const SKINS: Skin[] = [
  // Thùy 29/09: 4 skin thử (Tối giản · Đấu trường · Y2K · Soft Hàn) đã XOÁ — chỉ Anime RPG dùng thật; 4–5 style mới đang làm.
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
