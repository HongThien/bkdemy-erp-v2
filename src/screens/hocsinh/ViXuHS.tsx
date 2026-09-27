// ============================================================================
// ViXuHS — "Ví xu của em" (Thùy 23/09): số dư + lịch sử mua hàng (đổi quà) +
// hoạt động kiếm/mất xu-EXP, mỗi dòng hiện rõ ±bao nhiêu để em hiểu vì sao được/mất.
// Layout theo ĐÚNG khuôn ThanhTuuHS.tsx (pattern mới nhất: backdrop mây cố định +
// decor/quote đáy + header squircle + card cardTint/shadow theo giới tính).
// Dữ liệu: fn_hs_vi_xu_cua_toi (RPC "của tôi", tự resolve HS — không cần hocSinhId).
// ============================================================================
import { useEffect, useState } from 'react'
import { viXuCuaToi, type ViXuCuaToi, type HoatDongViXu, type LichSuMua } from '../../lib/vixu_hs'
import { homNayVN } from '../../lib/tuan'

const A = '/bk-ui/hs'
const NAVY = '#0F1745'
const THEME = {
  nam: { bg: `${A}/bg_home_male.jpg`, decor: `${A}/decor_books.png`, primary: '#1673D8', sec: '#6E7EAA',
    cardTint: 'linear-gradient(160deg,#ffffff,#f6f9ff)', shadow: '0 8px 24px rgba(76,108,170,.10)',
    quote: 'Tích xu mỗi ngày\nđổi quà thật đã!', quoteColor: '#4A5BC4' },
  nu:  { bg: `${A}/bg_home_female.jpg`, decor: `${A}/decor_books_female.png`, primary: '#F23886', sec: '#756F9F',
    cardTint: 'linear-gradient(160deg,#ffffff,#fff5fb)', shadow: '0 8px 24px rgba(182,96,145,.10)',
    quote: 'Xu đầy ví\nlà công em cả ♡', quoteColor: '#E84A8F' },
}

const ymHomNay = () => homNayVN().slice(0, 7)
function congThang(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}
function labelThang(ym: string): string { const [y, m] = ym.split('-'); return `Tháng ${parseInt(m, 10)}/${y}` }
function ddmm(iso: string): string { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}` }

const NHAN_NGUON: Record<string, { icon: string; ten: string }> = {
  exp_et: { icon: '📋', ten: 'Điểm ET' },
  exp_btvn: { icon: '🏠', ten: 'Điểm BTVN' },
  exp_btvn_thang: { icon: '📊', ten: 'Thưởng/phạt BTVN tháng' },
  attend_floor: { icon: '✅', ten: 'Điểm tham dự' },
  may_man: { icon: '🎰', ten: 'Vòng quay may mắn' },
  chot_thang: { icon: '🪙', ten: 'Chốt xu tháng' },
  chot_lai: { icon: '🔄', ten: 'Điều chỉnh xu' },
  cong_tay: { icon: '➕', ten: 'Thầy cô cộng xu' },
  tru_tay: { icon: '➖', ten: 'Thầy cô trừ xu' },
}

// ── Card theo NHÓM nguồn (Thùy 27/09: "để hs theo dõi nguồn nào ít-nhiều") — bấm 1 card mới hiện
// lịch sử chi tiết của nhóm đó (HoatDongRow), thay vì 1 danh sách phẳng lẫn lộn mọi nguồn.
type NhomKey = 'et' | 'btvn' | 'may_man' | 'attend_floor' | 'hoat_dong_lop' | 'cong_tay' | 'tru_tay' | 'chot_xu' | 'khac'
const NHOM_META: Record<NhomKey, { icon: string; ten: string; donVi: 'exp' | 'xu' }> = {
  et: { icon: '📋', ten: 'ET', donVi: 'exp' },
  btvn: { icon: '🏠', ten: 'BTVN', donVi: 'exp' },
  may_man: { icon: '🎰', ten: 'Vòng quay may mắn', donVi: 'exp' },
  attend_floor: { icon: '✅', ten: 'Điểm tham dự', donVi: 'exp' },
  // Placeholder — CHƯA có dữ liệu thật (Thùy 27/09: "hoạt động game mới sắp làm, m cứ tạo sẵn card
  // — tý t làm bên game sẽ link sang"). Không map từ nguồn nào cả, luôn 0 hoạt động tới khi nối.
  hoat_dong_lop: { icon: '🎮', ten: 'Hoạt động trên lớp', donVi: 'exp' },
  cong_tay: { icon: '➕', ten: 'Thầy cô tặng', donVi: 'xu' },
  tru_tay: { icon: '➖', ten: 'Bị trừ (thầy cô)', donVi: 'xu' },
  chot_xu: { icon: '🪙', ten: 'Chốt xu tháng', donVi: 'xu' },
  khac: { icon: '✨', ten: 'Khác', donVi: 'exp' },
}
// Thứ tự hiện card — khớp ví dụ Thùy đưa (ET, BTVN, thầy cô tặng, may mắn, hoạt động lớp...).
const THU_TU_NHOM: NhomKey[] = ['et', 'btvn', 'may_man', 'attend_floor', 'hoat_dong_lop', 'cong_tay', 'tru_tay', 'chot_xu']
const NGUON_TOI_NHOM: Record<string, NhomKey> = {
  exp_et: 'et', exp_btvn: 'btvn', exp_btvn_thang: 'btvn',
  attend_floor: 'attend_floor', may_man: 'may_man',
  cong_tay: 'cong_tay', tru_tay: 'tru_tay', chot_thang: 'chot_xu', chot_lai: 'chot_xu',
  // Nguồn cũ/một-lần (exp_thang trước khi tách ET/BTVN, rank_et/rank_ingame/btvn — data lịch sử 06-08/2026)
  // không đủ căn cứ gán đúng ET hay BTVN ⇒ để "Khác", KHÔNG đoán bừa (§1.5 thà bỏ trống hơn đánh sai).
  exp_thang: 'khac', rank_et: 'khac', rank_ingame: 'khac', btvn: 'khac',
}
type NhomTong = { tong: number; soLuong: number; items: HoatDongViXu[] }
function gomNhom(items: HoatDongViXu[]): Partial<Record<NhomKey, NhomTong>> {
  const g: Partial<Record<NhomKey, NhomTong>> = {}
  for (const h of items) {
    const k = NGUON_TOI_NHOM[h.nguon] ?? 'khac'
    const cur = g[k] ?? { tong: 0, soLuong: 0, items: [] }
    cur.tong += h.so; cur.soLuong += 1; cur.items.push(h)
    g[k] = cur
  }
  return g
}
const TRANG_THAI_MUA: Record<LichSuMua['trang_thai'], { ten: string; cls: string }> = {
  cho_giao: { ten: 'Chờ giao', cls: 'bg-amber-50 text-amber-700' },
  da_giao: { ten: 'Đã giao', cls: 'bg-emerald-50 text-emerald-700' },
  huy: { ten: 'Đã huỷ', cls: 'bg-slate-100 text-slate-500' },
}

// Quy đổi HIỂN THỊ để em hình dung — công thức: xu = exp / 100 (chỉ để tham khảo, số xu THẬT chốt
// cuối tháng theo bảng khúc luỹ tiến luong_bac, không tuyến tính — xem so_du ở đầu màn mới là số thật).
function fmtXuTuongDuong(exp: number): string {
  return (Math.abs(exp) / 100).toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function HoatDongRow({ h, t }: { h: HoatDongViXu; t: typeof THEME.nam }) {
  const nhan = NHAN_NGUON[h.nguon] ?? { icon: '✨', ten: h.nguon }
  const laExp = h.loai !== 'xu'
  const donVi = laExp ? 'EXP' : 'xu'
  const duong = h.so >= 0
  return (
    <div className="flex items-center gap-3 rounded-[20px] p-3" style={{ background: t.cardTint, boxShadow: t.shadow }}>
      <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] text-[20px]" style={{ background: '#F1F4FB' }}>{nhan.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-bold" style={{ color: NAVY }}>{nhan.ten}</span>
        <span className="mt-0.5 block text-[11.5px]" style={{ color: t.sec }}>{h.ngay ? ddmm(h.ngay) : ddmm(h.created_at)}{h.mon ? ` · ${h.mon}` : ''}{h.lop ? ` · ${h.lop}` : ''}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className={`block text-[15px] font-extrabold ${duong ? 'text-emerald-600' : 'text-rose-500'}`}>{duong ? '+' : ''}{h.so} {donVi}</span>
        {laExp && <span className="mt-0.5 block text-[10.5px]" style={{ color: t.sec }}>≈ {fmtXuTuongDuong(h.so)} xu</span>}
      </span>
    </div>
  )
}

function NguonCard({ nhom, tong, t, onClick }: { nhom: NhomKey; tong: NhomTong | undefined; t: typeof THEME.nam; onClick: () => void }) {
  const meta = NHOM_META[nhom]
  const soLuong = tong?.soLuong ?? 0
  const so = tong?.tong ?? 0
  const duong = so >= 0
  const xuHien = soLuong === 0 ? '0' : meta.donVi === 'xu' ? Math.abs(so).toLocaleString('vi-VN') : fmtXuTuongDuong(so)
  return (
    <button onClick={onClick} disabled={soLuong === 0} className="flex items-center gap-3 rounded-[20px] p-3 text-left transition active:scale-[0.98] disabled:opacity-60"
      style={{ background: t.cardTint, boxShadow: t.shadow }}>
      <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] text-[20px]" style={{ background: '#F1F4FB' }}>{meta.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-bold" style={{ color: NAVY }}>{meta.ten}</span>
        <span className="mt-0.5 block text-[11px]" style={{ color: t.sec }}>{soLuong > 0 ? `${soLuong} lần` : nhom === 'hoat_dong_lop' ? 'Sắp ra mắt' : 'Chưa có'}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className={`block text-[15px] font-extrabold ${soLuong === 0 ? '' : duong ? 'text-emerald-600' : 'text-rose-500'}`} style={soLuong === 0 ? { color: t.sec } : undefined}>
          {soLuong > 0 && (duong ? '+' : '−')}{xuHien} xu
        </span>
        {meta.donVi === 'exp' && soLuong > 0 && <span className="mt-0.5 block text-[10px]" style={{ color: t.sec }}>{so} EXP</span>}
      </span>
      {soLuong > 0 && <span className="shrink-0 text-[16px]" style={{ color: t.sec }}>›</span>}
    </button>
  )
}

function MuaRow({ m, t }: { m: LichSuMua; t: typeof THEME.nam }) {
  const tt = TRANG_THAI_MUA[m.trang_thai]
  return (
    <div className="flex items-center gap-3 rounded-[20px] p-3" style={{ background: t.cardTint, boxShadow: t.shadow }}>
      {m.anh_url
        ? <img src={m.anh_url} alt="" className="h-[44px] w-[44px] shrink-0 rounded-[14px] object-cover" />
        : <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] text-[20px]" style={{ background: '#F1F4FB' }}>🎁</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-bold" style={{ color: NAVY }}>{m.ten_qua}{m.so_luong > 1 ? ` ×${m.so_luong}` : ''}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px]" style={{ color: t.sec }}>
          {ddmm(m.created_at)}
          <span className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-bold ${tt.cls}`}>{tt.ten}</span>
        </span>
      </span>
      <span className="shrink-0 text-[15px] font-extrabold text-rose-500">−{m.xu_tru} xu</span>
    </div>
  )
}

export default function ViXuHS({ gioiTinh, onXong }: { gioiTinh: 'nam' | 'nu' | null; onXong: () => void }) {
  const [tab, setTab] = useState<'hoat_dong' | 'mua'>('hoat_dong')
  const [ym, setYm] = useState(ymHomNay())
  const [data, setData] = useState<ViXuCuaToi | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [nhomMo, setNhomMo] = useState<NhomKey | null>(null) // card đang bấm vào xem lịch sử — null = màn lưới card
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  useEffect(() => {
    setData(null); setErr(null); setNhomMo(null) // đổi tháng = đổi ngữ cảnh, về màn lưới card
    viXuCuaToi(ym).then(setData).catch((e) => { setErr(e?.message ?? String(e)); setData(null) })
  }, [ym])

  const nhomTong = data ? gomNhom(data.hoat_dong) : {}
  const coKhac = (nhomTong.khac?.soLuong ?? 0) > 0
  const cacNhom = coKhac ? [...THU_TU_NHOM, 'khac' as const] : THU_TU_NHOM

  return (
    <div className="font-bubble relative mx-auto min-h-[100dvh] max-w-[430px] md:max-w-[820px] lg:max-w-[1180px]" style={{ background: '#eef4ff', color: NAVY, ['--font-hand' as string]: "'Pacifico', 'Itim', 'Be Vietnam Pro', system-ui, sans-serif" }}>
      <img src={t.bg} alt="" className="pointer-events-none fixed inset-0 mx-auto h-[100dvh] w-full max-w-[430px] object-cover md:max-w-[820px] lg:max-w-[1180px]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col items-end md:max-w-[820px] lg:max-w-[1180px]">
        <div className="font-hand mb-1 mr-[14%] -rotate-[6deg] whitespace-pre-line text-right text-[20px] leading-[1.15]" style={{ color: t.quoteColor }}>{t.quote}</div>
        <img src={t.decor} alt="" className="block w-[46%]" style={{ marginRight: '-2%', marginBottom: '-2%' }} />
      </div>

      <div className="relative px-4 pb-[46vh] pt-[calc(10px+env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <button onClick={onXong} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white active:scale-95" style={{ boxShadow: t.shadow }}>
            <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none" aria-hidden><path d="M29 10L15 24l14 14" stroke="#5B69A8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="min-w-0 pt-0.5">
            <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>Ví xu của em</h1>
            <p className="mt-1 text-[12.5px]" style={{ color: t.sec }}>Xu để đổi quà — kiếm bằng cách học chăm chỉ mỗi ngày</p>
          </div>
        </div>

        {/* Số dư */}
        <div className="mt-4 rounded-[26px] p-5 text-center" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.primary}cc)`, boxShadow: t.shadow }}>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-white/80">Số dư hiện tại</p>
          <p className="mt-1 text-[36px] font-black text-white">🪙 {data ? data.so_du : '···'}</p>
        </div>

        {err && <p className="mt-3 rounded-2xl bg-[#FFE3EA] px-3 py-2 text-center text-[12px] font-semibold" style={{ color: '#C0355A' }}>⚠ {err}</p>}

        {/* Tab pill */}
        <div className="mt-4 flex gap-2 rounded-full bg-white p-1" style={{ boxShadow: t.shadow }}>
          {([['hoat_dong', 'Hoạt động'], ['mua', 'Mua hàng']] as const).map(([id, ten]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 rounded-full py-2 text-[13px] font-bold transition ${tab === id ? 'text-white' : ''}`}
              style={tab === id ? { background: t.primary } : { color: t.sec }}>{ten}</button>
          ))}
        </div>

        {!data && !err && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}

        {data && tab === 'hoat_dong' && (
          <div className="mt-4">
            <div className="mb-3 flex items-center justify-center gap-4">
              <button onClick={() => setYm((y) => congThang(y, -1))} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[14px]" style={{ boxShadow: t.shadow, color: t.sec }}>‹</button>
              <span className="text-[13.5px] font-bold" style={{ color: NAVY }}>{labelThang(ym)}</span>
              <button onClick={() => setYm((y) => congThang(y, 1))} disabled={ym >= ymHomNay()} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[14px] disabled:opacity-30" style={{ boxShadow: t.shadow, color: t.sec }}>›</button>
            </div>

            {nhomMo === null ? (
              <div className="flex flex-col gap-2">
                {cacNhom.map((k) => <NguonCard key={k} nhom={k} tong={nhomTong[k]} t={t} onClick={() => setNhomMo(k)} />)}
              </div>
            ) : (
              <div>
                <button onClick={() => setNhomMo(null)} className="mb-2 flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: t.primary }}>‹ Tất cả nguồn</button>
                <p className="mb-2 px-1 text-[13px] font-bold" style={{ color: NAVY }}>{NHOM_META[nhomMo].icon} {NHOM_META[nhomMo].ten}</p>
                {nhomMo === 'hoat_dong_lop' || !nhomTong[nhomMo]?.items.length ? (
                  <div className="rounded-[26px] p-8 text-center" style={{ background: t.cardTint, boxShadow: t.shadow }}>
                    <p className="text-3xl">🌱</p>
                    <p className="mt-2 text-[14px] font-bold" style={{ color: NAVY }}>Chưa có hoạt động nào</p>
                    <p className="mt-1 text-[12px]" style={{ color: t.sec }}>
                      {nhomMo === 'hoat_dong_lop' ? 'Hoạt động này sắp ra mắt — theo dõi xu kiếm được ở đây nhé!' : 'Đổi tháng khác để xem thêm.'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">{nhomTong[nhomMo]!.items.map((h, i) => <HoatDongRow key={i} h={h} t={t} />)}</div>
                )}
              </div>
            )}
          </div>
        )}

        {data && tab === 'mua' && (
          <div className="mt-4">
            {data.lich_su_mua.length === 0 ? (
              <div className="rounded-[26px] p-8 text-center" style={{ background: t.cardTint, boxShadow: t.shadow }}>
                <p className="text-3xl">🎁</p>
                <p className="mt-2 text-[14px] font-bold" style={{ color: NAVY }}>Em chưa đổi quà nào</p>
                <p className="mt-1 text-[12px]" style={{ color: t.sec }}>Dành đủ xu rồi ra tủ quà đổi nhé!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">{data.lich_su_mua.map((m) => <MuaRow key={m.id} m={m} t={t} />)}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
