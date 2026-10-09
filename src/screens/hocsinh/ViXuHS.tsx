// ============================================================================
// ViXuHS — "Ví xu của em" (Thùy 23/09): số dư + lịch sử mua hàng (đổi quà) +
// hoạt động kiếm/mất xu-EXP, mỗi dòng hiện rõ ±bao nhiêu để em hiểu vì sao được/mất.
// Thùy 29/09: khung/màu theo STYLE (skin) em chọn (skin/KhungHS) — bỏ nền mây, chồng sách, khẩu hiệu,
// màu theo giới tính. Xu dương/âm dùng màu ngữ nghĩa MAU.dung/MAU.sai.
// Dữ liệu: fn_hs_vi_xu_cua_toi (RPC "của tôi", tự resolve HS — không cần hocSinhId).
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import { viXuCuaToi, dongBoXuCuaToi, type ViXuCuaToi, type HoatDongViXu, type LichSuMua } from '../../lib/vixu_hs'
import { homNayVN } from '../../lib/tuan'
import { ManHS, DauTrangHS, TrongHS, MAU, THE, THE_TRON, HEAD } from './skin/KhungHS'

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
  exp_tren_lop: { icon: '🎮', ten: 'Game trên lớp' },
  may_man: { icon: '🎰', ten: 'Vòng quay may mắn' },
  exp_nhiem_vu: { icon: '📜', ten: 'Nhiệm vụ' },
  exp_thanh_tuu: { icon: '🏅', ten: 'Thành tựu' },
  exp_huy_hieu: { icon: '🏅', ten: 'Huy hiệu' },
  chot_thang: { icon: '🪙', ten: 'Xu đổi từ EXP' },   // Thùy 06/10: tự đổi hằng ngày, ví gộp 1 dòng / môn / tháng
  chot_lai: { icon: '🔄', ten: 'Điều chỉnh xu' },
  cong_tay: { icon: '➕', ten: 'Thầy cô cộng xu' },
  tru_tay: { icon: '➖', ten: 'Thầy cô trừ xu' },
}

// ── Card theo NHÓM nguồn (Thùy 27/09: "để hs theo dõi nguồn nào ít-nhiều") — bấm 1 card mới hiện
// lịch sử chi tiết của nhóm đó (HoatDongRow), thay vì 1 danh sách phẳng lẫn lộn mọi nguồn.
export type NhomKey = 'et' | 'btvn' | 'nhiem_vu' | 'thanh_tuu' | 'huy_hieu' | 'may_man' | 'attend_floor' | 'hoat_dong_lop' | 'cong_tay' | 'tru_tay' | 'chot_xu' | 'khac'
const NHOM_META: Record<NhomKey, { icon: string; ten: string; donVi: 'exp' | 'xu' }> = {
  et: { icon: '📋', ten: 'ET', donVi: 'exp' },
  btvn: { icon: '🏠', ten: 'BTVN', donVi: 'exp' },
  nhiem_vu: { icon: '📜', ten: 'Nhiệm vụ', donVi: 'exp' },
  thanh_tuu: { icon: '🏅', ten: 'Thành tựu', donVi: 'exp' },
  huy_hieu: { icon: '🎖️', ten: 'Huy hiệu (lịch sử)', donVi: 'exp' },
  may_man: { icon: '🎰', ten: 'Vòng quay may mắn', donVi: 'exp' },
  attend_floor: { icon: '✅', ten: 'Điểm tham dự', donVi: 'exp' },
  // Nối 27/09: nguồn 'exp_tren_lop' = EXP game trong buổi học (xếp hạng buổi → lượt game, spec-game-buoi-hoc §5b).
  hoat_dong_lop: { icon: '🎮', ten: 'Hoạt động trên lớp', donVi: 'exp' },
  cong_tay: { icon: '➕', ten: 'Thầy cô tặng', donVi: 'xu' },
  tru_tay: { icon: '➖', ten: 'Bị trừ (thầy cô)', donVi: 'xu' },
  chot_xu: { icon: '🪙', ten: 'Xu đổi từ EXP', donVi: 'xu' },
  khac: { icon: '✨', ten: 'Khác', donVi: 'exp' },
}
// Thứ tự hiện card — khớp ví dụ Thùy đưa (ET, BTVN, thầy cô tặng, may mắn, hoạt động lớp...).
export const THU_TU_NHOM: NhomKey[] = ['et', 'btvn', 'nhiem_vu', 'thanh_tuu', 'huy_hieu', 'may_man', 'attend_floor', 'hoat_dong_lop', 'cong_tay', 'tru_tay', 'chot_xu']
const NGUON_TOI_NHOM: Record<string, NhomKey> = {
  exp_et: 'et', exp_btvn: 'btvn', exp_btvn_thang: 'btvn',
  exp_nhiem_vu: 'nhiem_vu', exp_thanh_tuu: 'thanh_tuu', exp_huy_hieu: 'huy_hieu',
  attend_floor: 'attend_floor', may_man: 'may_man', exp_tren_lop: 'hoat_dong_lop',
  cong_tay: 'cong_tay', tru_tay: 'tru_tay', chot_thang: 'chot_xu', chot_lai: 'chot_xu',
  // Nguồn cũ/một-lần (exp_thang trước khi tách ET/BTVN, rank_et/rank_ingame/btvn — data lịch sử 06-08/2026)
  // không đủ căn cứ gán đúng ET hay BTVN ⇒ để "Khác", KHÔNG đoán bừa (§1.5 thà bỏ trống hơn đánh sai).
  exp_thang: 'khac', rank_et: 'khac', rank_ingame: 'khac', btvn: 'khac',
}
export type NhomTong = { tong: number; soLuong: number; items: HoatDongViXu[] }
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
const TRANG_THAI_MUA: Record<LichSuMua['trang_thai'], { ten: string; bg: string; chu: string }> = {
  cho_giao: { ten: 'Chờ giao', bg: 'rgba(224,144,30,0.16)', chu: MAU.canhBao },
  da_giao: { ten: 'Đã giao', bg: 'rgba(34,160,107,0.16)', chu: MAU.dung },
  huy: { ten: 'Đã huỷ', bg: MAU.surface2, chu: MAU.muted },
}
const O_ICON = { background: MAU.surface2 } // ô icon trong thẻ

// Quy đổi HIỂN THỊ để em hình dung — xu = exp / 100 (tham khảo). Số xu THẬT do DB đổi theo TỔNG EXP tháng
// của từng môn (làm tròn lên, có trần xu app) ngay khi có EXP — xem so_du ở đầu màn mới là số thật.
function fmtXuTuongDuong(exp: number): string {
  return (Math.abs(exp) / 100).toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function HoatDongRow({ h }: { h: HoatDongViXu }) {
  const nhan = NHAN_NGUON[h.nguon] ?? { icon: '✨', ten: h.nguon }
  const laExp = h.loai !== 'xu'
  const donVi = laExp ? 'EXP' : 'xu'
  const duong = h.so >= 0
  // Dòng GỘP THEO THÁNG (nhiệm vụ) hiện cấp + rương thay vì 1 ngày cụ thể; huy hiệu hiện tên + sao.
  const phu = h.nguon === 'exp_nhiem_vu' ? `Luyện dạng yếu${h.dht ? ` · +${h.dht.toLocaleString('vi-VN')} điểm học tập` : ''}`
    : h.nguon === 'exp_thanh_tuu' ? `${h.ten ?? 'Thành tựu'} · bậc ${h.bac ?? ''}`
    : h.nguon === 'exp_huy_hieu' ? `${h.ten ?? 'Huy hiệu'} ★${h.sao ?? ''}`
    : (h.ngay ? ddmm(h.ngay) : ddmm(h.created_at))
  return (
    <div className="flex items-center gap-3 p-3" style={THE}>
      <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] text-[20px]" style={O_ICON}>{nhan.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-bold" style={{ color: MAU.ink }}>{nhan.ten}</span>
        <span className="mt-0.5 block text-[11.5px]" style={{ color: MAU.muted }}>{phu}{h.mon ? ` · ${h.mon}` : ''}{h.lop ? ` · ${h.lop}` : ''}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-[15px] font-extrabold" style={{ color: duong ? MAU.dung : MAU.sai }}>{duong ? '+' : ''}{h.so} {donVi}</span>
        {laExp && <span className="mt-0.5 block text-[10.5px]" style={{ color: MAU.muted }}>≈ {fmtXuTuongDuong(h.so)} xu</span>}
      </span>
    </div>
  )
}

export function NguonCard({ nhom, tong, onClick }: { nhom: NhomKey; tong: NhomTong | undefined; onClick: () => void }) {
  const meta = NHOM_META[nhom]
  const soLuong = tong?.soLuong ?? 0
  const so = tong?.tong ?? 0
  const duong = so >= 0
  const xuHien = soLuong === 0 ? '0' : meta.donVi === 'xu' ? Math.abs(so).toLocaleString('vi-VN') : fmtXuTuongDuong(so)
  // THẺ NỬA CHIỀU NGANG (Thùy 09/10): 2 thẻ / hàng, khối gần vuông thay cho dải ngang hẹp — icon + chevron trên, tên + số lần giữa, số xu to ở đáy.
  return (
    <button onClick={onClick} disabled={soLuong === 0} className="flex min-h-[148px] min-w-0 flex-col items-start gap-1 p-3.5 text-left transition active:scale-[0.98] disabled:opacity-60"
      style={THE}>
      <span className="flex w-full items-start justify-between">
        <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px] text-[22px]" style={O_ICON}>{meta.icon}</span>
        {soLuong > 0 && <span className="text-[18px] leading-none" style={{ color: MAU.muted }} aria-hidden>›</span>}
      </span>
      <span className="mt-1.5 block text-[14.5px] font-bold leading-tight" style={{ color: MAU.ink }}>{meta.ten}</span>
      <span className="block text-[11.5px]" style={{ color: MAU.muted }}>{soLuong > 0 ? `${soLuong} lần` : nhom === 'hoat_dong_lop' ? 'Sắp ra mắt' : 'Chưa có'}</span>
      <span className="mt-auto block pt-1.5">
        <span className="block text-[18px] font-extrabold leading-tight" style={{ color: soLuong === 0 ? MAU.muted : duong ? MAU.dung : MAU.sai }}>
          {soLuong > 0 && (duong ? '+' : '−')}{xuHien} xu
        </span>
        {meta.donVi === 'exp' && soLuong > 0 && <span className="block text-[11px]" style={{ color: MAU.muted }}>{so} EXP</span>}
      </span>
    </button>
  )
}

function MuaRow({ m }: { m: LichSuMua }) {
  const tt = TRANG_THAI_MUA[m.trang_thai]
  return (
    <div className="flex items-center gap-3 p-3" style={THE}>
      {m.anh_url
        ? <img src={m.anh_url} alt="" className="h-[44px] w-[44px] shrink-0 rounded-[14px] object-cover" />
        : <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] text-[20px]" style={O_ICON}>🎁</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-bold" style={{ color: MAU.ink }}>{m.ten_qua}{m.so_luong > 1 ? ` ×${m.so_luong}` : ''}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px]" style={{ color: MAU.muted }}>
          {ddmm(m.created_at)}
          <span className="rounded-full px-1.5 py-0.5 text-[10.5px] font-bold" style={{ background: tt.bg, color: tt.chu }}>{tt.ten}</span>
        </span>
      </span>
      <span className="shrink-0 text-[15px] font-extrabold" style={{ color: MAU.sai }}>−{m.xu_tru} xu</span>
    </div>
  )
}

export default function ViXuHS({ onXong }: { gioiTinh: 'nam' | 'nu' | null; onXong: () => void }) {
  const [tab, setTab] = useState<'hoat_dong' | 'mua'>('hoat_dong')
  const [ym, setYm] = useState(ymHomNay())
  const [data, setData] = useState<ViXuCuaToi | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [nhomMo, setNhomMo] = useState<NhomKey | null>(null) // card đang bấm vào xem lịch sử — null = màn lưới card

  const ymRef = useRef(ym); ymRef.current = ym
  useEffect(() => {
    setData(null); setErr(null); setNhomMo(null) // đổi tháng = đổi ngữ cảnh, về màn lưới card
    viXuCuaToi(ym).then(setData).catch((e) => { setErr(e?.message ?? String(e)); setData(null) })
  }, [ym])
  // Thùy 06/10 — xu tính realtime: mở ví ⇒ DB đổi EXP mới nhất ra xu. Ví hiện NGAY số cũ, đồng bộ chạy nền
  // (~2–3s); có dòng mới thì đọc lại ví tháng đang xem, KHÔNG xoá màn. Đồng bộ lỗi ⇒ im lặng giữ số sổ.
  useEffect(() => {
    let huy = false
    dongBoXuCuaToi()
      .then((r) => { if (!huy && r.so_dong > 0) return viXuCuaToi(ymRef.current).then((d) => { if (!huy && d.ym === ymRef.current) setData(d) }) })
      .catch(() => {})
    return () => { huy = true }
  }, [])

  const nhomTong = data ? gomNhom(data.hoat_dong) : {}
  const coKhac = (nhomTong.khac?.soLuong ?? 0) > 0
  const cacNhom = coKhac ? [...THU_TU_NHOM, 'khac' as const] : THU_TU_NHOM

  return (
    <ManHS>
      <DauTrangHS tieuDe="Ví xu của em" phu="Xu để đổi quà — kiếm bằng cách học chăm chỉ mỗi ngày" onBack={onXong} />

      {/* Số dư — dải màu nhấn của skin */}
      <div className="p-5 text-center" style={{ ...THE, background: MAU.acc, color: MAU.accInk }}>
        <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ opacity: .8 }}>Số dư hiện tại</p>
        <p className="mt-1 text-[36px] font-black" style={HEAD}>🪙 {data ? data.so_du : '···'}</p>
        <p className="mt-1 text-[11.5px]" style={{ opacity: .8 }}>Có EXP là đổi ra xu ngay — cứ 100 EXP được 1 xu</p>
      </div>

      {err && <p className="rounded-2xl px-3 py-2 text-center text-[12px] font-semibold" style={{ ...THE, color: MAU.sai }}>⚠ {err}</p>}

      {/* Tab pill */}
      <div className="flex gap-2 p-1" style={{ ...THE_TRON, borderRadius: '999px' }}>
        {([['hoat_dong', 'Hoạt động'], ['mua', 'Mua hàng']] as const).map(([id, ten]) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex-1 rounded-full py-2 text-[13px] font-bold transition"
            style={tab === id ? { background: MAU.acc, color: MAU.accInk } : { color: MAU.muted }}>{ten}</button>
        ))}
      </div>

      {!data && !err && <TrongHS>Đang tải…</TrongHS>}

      {data && tab === 'hoat_dong' && (
        <div>
          <div className="mb-3 flex items-center justify-center gap-4">
            <button onClick={() => setYm((y) => congThang(y, -1))} className="flex h-8 w-8 items-center justify-center rounded-full text-[14px]" style={{ ...THE_TRON, borderRadius: '999px', color: MAU.muted }}>‹</button>
            <span className="text-[13.5px] font-bold" style={{ color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>{labelThang(ym)}</span>
            <button onClick={() => setYm((y) => congThang(y, 1))} disabled={ym >= ymHomNay()} className="flex h-8 w-8 items-center justify-center rounded-full text-[14px] disabled:opacity-30" style={{ ...THE_TRON, borderRadius: '999px', color: MAU.muted }}>›</button>
          </div>

          {nhomMo === null ? (
            <div className="grid grid-cols-2 gap-2.5 md:gap-3">
              {cacNhom.map((k) => <NguonCard key={k} nhom={k} tong={nhomTong[k]} onClick={() => setNhomMo(k)} />)}
            </div>
          ) : (
            <div>
              <button onClick={() => setNhomMo(null)} className="mb-2 flex items-center gap-1 rounded-full px-3 py-1 text-[12.5px] font-semibold" style={{ ...THE_TRON, borderRadius: '999px', color: MAU.acc }}>‹ Tất cả nguồn</button>
              <p className="mb-2 px-1 text-[13px] font-bold" style={{ color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>{NHOM_META[nhomMo].icon} {NHOM_META[nhomMo].ten}</p>
              {nhomMo === 'hoat_dong_lop' || !nhomTong[nhomMo]?.items.length ? (
                <div className="p-8 text-center" style={THE}>
                  <p className="text-3xl">🌱</p>
                  <p className="mt-2 text-[14px] font-bold" style={{ color: MAU.ink }}>Chưa có hoạt động nào</p>
                  <p className="mt-1 text-[12px]" style={{ color: MAU.muted }}>
                    {nhomMo === 'hoat_dong_lop' ? 'Hoạt động này sắp ra mắt — theo dõi xu kiếm được ở đây nhé!' : 'Đổi tháng khác để xem thêm.'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">{nhomTong[nhomMo]!.items.map((h, i) => <HoatDongRow key={i} h={h} />)}</div>
              )}
            </div>
          )}
        </div>
      )}

      {data && tab === 'mua' && (
        <div>
          {data.lich_su_mua.length === 0 ? (
            <div className="p-8 text-center" style={THE}>
              <p className="text-3xl">🎁</p>
              <p className="mt-2 text-[14px] font-bold" style={{ color: MAU.ink }}>Em chưa đổi quà nào</p>
              <p className="mt-1 text-[12px]" style={{ color: MAU.muted }}>Dành đủ xu rồi ra tủ quà đổi nhé!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">{data.lich_su_mua.map((m) => <MuaRow key={m.id} m={m} />)}</div>
          )}
        </div>
      )}
    </ManHS>
  )
}
