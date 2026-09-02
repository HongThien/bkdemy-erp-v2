// Bảng MẪU công thức cho ô nhập (MathPopup) + trang gán phím tắt (PhimTatModal).
// Người dùng KHÔNG gõ LaTeX — chỉ click mẫu / bấm phím đã gán, rồi gõ chữ-số vào ô trống.
//   `latex`: `#?` = ô trống (MathLive → \placeholder{}; preview nút → ô vuông xám).
//   `id` là KHOÁ lưu trong nhan_su.phim_tat_cong_thuc (jsonb) → đổi id = người dùng mất phím đã gán.
// Mẫu nào không render đúng ở CẢ 3 nơi (preview / in / test online) thì BỎ — 3 nơi cùng dùng MathText
// nên kiểm 1 lần bằng `node scripts/kiem-mau-cong-thuc.mjs` (KaTeX parse từng mẫu, cùng macro).
export type MathTab = 'cau_truc' | 'quan_he' | 'hinh_hoc' | 'ky_hieu' | 'van_ban'
export const MATH_TABS: { id: MathTab; ten: string }[] = [
  { id: 'cau_truc', ten: 'Cấu trúc' },
  { id: 'quan_he', ten: 'Quan hệ' },
  { id: 'hinh_hoc', ten: 'Hình học' },
  { id: 'ky_hieu', ten: 'Ký hiệu' },
  { id: 'van_ban', ten: 'Văn bản' },
]
export type MathTemplate = { id: string; tab: MathTab; ten: string; latex: string; mau?: string }

const T = (tab: MathTab, id: string, ten: string, latex: string, mau?: string): MathTemplate => ({ id, tab, ten, latex, mau })
const greekLower: [string, string][] = [
  ['alpha', 'α'], ['beta', 'β'], ['gamma', 'γ'], ['delta', 'δ'], ['epsilon', 'ϵ'], ['varepsilon', 'ε'], ['zeta', 'ζ'], ['eta', 'η'],
  ['theta', 'θ'], ['iota', 'ι'], ['kappa', 'κ'], ['lambda', 'λ'], ['mu', 'μ'], ['nu', 'ν'], ['xi', 'ξ'], ['pi', 'π'], ['rho', 'ρ'],
  ['sigma', 'σ'], ['tau', 'τ'], ['upsilon', 'υ'], ['phi', 'ϕ'], ['varphi', 'φ'], ['chi', 'χ'], ['psi', 'ψ'], ['omega', 'ω'],
]
const greekUpper: [string, string][] = [
  ['Gamma', 'Γ'], ['Delta', 'Δ'], ['Theta', 'Θ'], ['Lambda', 'Λ'], ['Xi', 'Ξ'], ['Pi', 'Π'], ['Sigma', 'Σ'], ['Upsilon', 'Υ'], ['Phi', 'Φ'], ['Psi', 'Ψ'], ['Omega', 'Ω'],
]

export const MATH_TEMPLATES: MathTemplate[] = [
  // ── Cấu trúc ──
  T('cau_truc', 'phan_so', 'Phân số', '\\frac{#?}{#?}'),
  T('cau_truc', 'can_2', 'Căn bậc 2', '\\sqrt{#?}'),
  T('cau_truc', 'can_n', 'Căn bậc n', '\\sqrt[#?]{#?}'),
  T('cau_truc', 'mu', 'Mũ', '#?^{#?}'),
  T('cau_truc', 'chi_so', 'Chỉ số', '#?_{#?}'),
  T('cau_truc', 'mu_chi_so', 'Mũ + chỉ số', '#?_{#?}^{#?}'),
  T('cau_truc', 'tri_tuyet_doi', 'Trị tuyệt đối', '\\left|#?\\right|'),
  T('cau_truc', 'ngoac_tron', 'Ngoặc ( )', '\\left(#?\\right)'),
  T('cau_truc', 'ngoac_vuong', 'Ngoặc [ ]', '\\left[#?\\right]'),
  T('cau_truc', 'ngoac_nhon', 'Ngoặc { }', '\\left\\{#?\\right\\}'),
  T('cau_truc', 'he_pt', 'Hệ phương trình (2)', '\\begin{cases}#?\\\\#?\\end{cases}'),
  T('cau_truc', 'he_pt_3', 'Hệ phương trình (3)', '\\begin{cases}#?\\\\#?\\\\#?\\end{cases}'),
  T('cau_truc', 'he_bpt', 'Hệ bất phương trình', '\\begin{cases}#?>#?\\\\#?<#?\\end{cases}'),
  T('cau_truc', 'ma_tran_2', 'Ma trận 2×2', '\\begin{pmatrix}#?&#?\\\\#?&#?\\end{pmatrix}'),
  T('cau_truc', 'ma_tran_3', 'Ma trận 3×3', '\\begin{pmatrix}#?&#?&#?\\\\#?&#?&#?\\\\#?&#?&#?\\end{pmatrix}'),
  T('cau_truc', 'tong', 'Tổng Σ', '\\sum_{#?}^{#?} #?'),
  T('cau_truc', 'tich', 'Tích Π', '\\prod_{#?}^{#?} #?'),
  T('cau_truc', 'tich_phan', 'Tích phân xác định', '\\int_{#?}^{#?} #?\\,\\mathrm{d}#?'),
  T('cau_truc', 'tich_phan_bd', 'Tích phân bất định', '\\int #?\\,\\mathrm{d}#?'),
  T('cau_truc', 'gioi_han', 'Giới hạn', '\\lim_{#?\\to #?} #?'),
  T('cau_truc', 'dao_ham', "Đạo hàm f'", "#?'"),
  T('cau_truc', 'dao_ham_dx', 'Đạo hàm d/dx', '\\frac{\\mathrm{d}#?}{\\mathrm{d}#?}'),
  T('cau_truc', 'logarit', 'Logarit cơ số', '\\log_{#?} #?'),
  T('cau_truc', 'ln', 'ln', '\\ln #?'),
  // ── Quan hệ ──
  T('quan_he', 'bang', '=', '='),
  T('quan_he', 'khac', '≠', '\\ne'),
  T('quan_he', 'nho_hon', '<', '<'),
  T('quan_he', 'lon_hon', '>', '>'),
  T('quan_he', 'nho_bang', '≤', '\\le'),
  T('quan_he', 'lon_bang', '≥', '\\ge'),
  T('quan_he', 'xap_xi', '≈', '\\approx'),
  T('quan_he', 'dong_dang', '∼ (đồng dạng)', '\\sim'),
  T('quan_he', 'song_song', '∥', '\\parallel'),
  T('quan_he', 'vuong_goc', '⊥', '\\perp'),
  T('quan_he', 'thuoc', '∈', '\\in'),
  T('quan_he', 'khong_thuoc', '∉', '\\notin'),
  T('quan_he', 'tap_con', '⊂', '\\subset'),
  T('quan_he', 'suy_ra', '⇒', '\\Rightarrow'),
  T('quan_he', 'tuong_duong', '⇔', '\\Leftrightarrow'),
  // ── Hình học ──
  T('hinh_hoc', 'goc', 'Góc (mũ)', '\\widehat{#?}'),
  T('hinh_hoc', 'goc_ky_hieu', 'Góc ∠', '\\angle #?'),
  T('hinh_hoc', 'cung', 'Cung', '\\overset{\\frown}{#?}'),
  T('hinh_hoc', 'do', 'Độ °', '#?^{\\circ}'),
  T('hinh_hoc', 'tam_giac', 'Tam giác', '\\triangle #?'),
  T('hinh_hoc', 'doan_thang', 'Đoạn thẳng', '\\overline{#?}'),
  T('hinh_hoc', 'vecto', 'Vectơ', '\\overrightarrow{#?}'),
  T('hinh_hoc', 'doan_bang_nhau', 'Đoạn bằng nhau (gạch)', '\\overset{\\scriptscriptstyle|}{#?}'),
  T('hinh_hoc', 'vuong_90', 'Vuông = 90°', '=90^{\\circ}'),
  // ── Ký hiệu ──
  ...greekLower.map(([n, ch]) => T('ky_hieu', `hl_${n}`, ch, `\\${n}`)),
  ...greekUpper.map(([n, ch]) => T('ky_hieu', `hl_${n}`, ch, `\\${n}`)),
  T('ky_hieu', 'vo_cuc', '∞', '\\infty'),
  T('ky_hieu', 'tap_N', 'ℕ', '\\mathbb{N}'),
  T('ky_hieu', 'tap_Z', 'ℤ', '\\mathbb{Z}'),
  T('ky_hieu', 'tap_Q', 'ℚ', '\\mathbb{Q}'),
  T('ky_hieu', 'tap_R', 'ℝ', '\\mathbb{R}'),
  T('ky_hieu', 'cham_ba', '… (dưới)', '\\ldots'),
  T('ky_hieu', 'cham_ba_giua', '⋯ (giữa)', '\\cdots'),
  T('ky_hieu', 'nhan_cham', '· (nhân chấm)', '\\cdot'),
  T('ky_hieu', 'nhan_cheo', '×', '\\times'),
  T('ky_hieu', 'chia', '÷', '\\div'),
  T('ky_hieu', 'cong_tru', '±', '\\pm'),
  // ── Văn bản ──
  T('van_ban', 'chu', 'Chữ (tiếng Việt có dấu)', '\\text{#?}', '\\text{chữ}'),
]

export const MATH_TEMPLATE_BY_ID: Record<string, MathTemplate> = Object.fromEntries(MATH_TEMPLATES.map((t) => [t.id, t]))
export const hasPlaceholder = (t: MathTemplate) => t.latex.includes('#?')
// Chuỗi đưa vào MathLive (#? → ô trống thật).
export const toMathLive = (t: MathTemplate) => t.latex.replace(/#\?/g, '\\placeholder{}')
// Chuỗi preview cho NÚT mẫu (KaTeX): #? → ô vuông xám.
export const toPreview = (t: MathTemplate) => (t.mau ?? t.latex).replace(/#\?/g, '\\textcolor{silver}{\\square}')
