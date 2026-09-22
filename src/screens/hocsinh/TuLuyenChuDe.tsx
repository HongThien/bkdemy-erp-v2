// ============================================================================
// TuLuyenChuDe — 2 màn cho luồng "Tự luyện theo chủ đề" (Thùy 19/09, sửa 20/09):
// (1) ChonLoaiTuLuyen — màn chọn "Tổng hợp" (hệ tự rải, y hệt Tự luyện cũ) hay
//     "Theo chủ đề" (chọn đúng 1 dạng).
// (2) ChonDangChuDe — danh sách dạng (khối hiện tại) + % = MASTERY thật (không
//     phải coverage kho) → bấm 1 dạng để luyện 10 câu CHỈ của dạng đó. Danh sách
//     đã sắp YẾU→MẠNH từ RPC, KHÔNG group theo chuyên đề nữa (thứ tự ưu tiên
//     luyện quan trọng hơn nhóm theo chuyên đề — tên chuyên đề vẫn hiện làm caption
//     nhỏ trên từng thẻ). Có toggle "Chỉ câu mới" — xem lib/tuluyen.ts.
// Style tối giản, dùng chung token màu ph-* /brand đã có (không bịa theme riêng).
// ============================================================================
import { useEffect, useState } from 'react'
import { layDangChuDe, monCuaHS, type DangChuDe } from '../../lib/tuluyen'

function Khung({ desktop, children }: { desktop?: boolean; children: React.ReactNode }) {
  return (
    <div className={desktop ? 'mx-auto min-h-screen max-w-2xl bg-[#f4f7fb] px-8 py-6 lg:max-w-4xl' : 'mx-auto flex min-h-screen max-w-md flex-col bg-ios px-4 pb-8 pt-[calc(14px+env(safe-area-inset-top))] md:max-w-2xl lg:max-w-4xl'}>
      {children}
    </div>
  )
}
function NutBack({ onBack, desktop }: { onBack: () => void; desktop?: boolean }) {
  return (
    <button onClick={onBack} className={`mb-3 flex items-center gap-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>
      <span aria-hidden>←</span> Quay lại
    </button>
  )
}

export function ChonLoaiTuLuyen({ onTongHop, onChuDe, onBack, desktop }: { onTongHop: () => void; onChuDe: () => void; onBack: () => void; desktop?: boolean }) {
  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[22px]' : 'text-[19px]'}`}>Tự luyện</h1>
      <p className={`mt-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>Chọn cách em muốn luyện hôm nay.</p>
      <div className="mt-5 flex flex-col gap-3">
        <button onClick={onTongHop} className="rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.98]">
          <span className="block text-[15px] font-bold text-ph-label">🎯 Tổng hợp</span>
          <span className="mt-1 block text-[12.5px] text-ph-label-2">Hệ tự chọn câu — ưu tiên dạng em đang yếu, xen ngẫu nhiên dạng đã học.</span>
        </button>
        <button onClick={onChuDe} className="rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.98]">
          <span className="block text-[15px] font-bold text-ph-label">📚 Theo chủ đề</span>
          <span className="mt-1 block text-[12.5px] text-ph-label-2">Em tự chọn 1 dạng cụ thể để luyện riêng, xem mình đang yếu dạng nào nhất.</span>
        </button>
      </div>
    </Khung>
  )
}

// Màu pill % theo MỨC mastery (khớp bảng muc dùng chung toàn hệ: dat/can_luyen/yeu) —
// null (chưa đánh giá được) dùng màu trung tính, không phải đỏ (đó là KHÔNG RÕ, không phải yếu).
const MUC_MAU: Record<'dat' | 'can_luyen' | 'yeu', { bg: string; chu: string }> = {
  dat: { bg: '#DFF6EA', chu: '#1A9A5C' },
  can_luyen: { bg: '#FFF3D6', chu: '#B4791C' },
  yeu: { bg: '#FDE3E3', chu: '#C23B3B' },
}

export function ChonDangChuDe({ onPick, onBack, desktop }: { onPick: (d: { ma_dang: string; ten_dang: string; chiCauMoi: boolean }) => void; onBack: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [dangs, setDangs] = useState<DangChuDe[]>([])
  const [err, setErr] = useState<string | null>(null)
  // Toggle "Chỉ câu mới" (Thùy 20/09) — sinh câu KHÔNG lặp trong 2 cửa sổ gần nhất (~1 tháng).
  const [chiCauMoi, setChiCauMoi] = useState(false)

  useEffect(() => {
    monCuaHS().then((m) => {
      if (!m) throw new Error('Chưa xác định được môn học của em — báo thầy cô nhé.')
      return layDangChuDe(m)
    }).then((ds) => { setDangs(ds); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[22px]' : 'text-[19px]'}`}>Chọn dạng để luyện</h1>
      <p className={`mt-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>% là mức em đang làm dạng đó — dạng yếu nhất lên đầu để luyện trước.</p>

      {/* Toggle "Chỉ câu mới" */}
      <button onClick={() => setChiCauMoi((v) => !v)}
        className={`mt-3.5 flex w-full items-center gap-3 rounded-2xl p-3 text-left shadow-sm transition ${chiCauMoi ? 'bg-brand/10' : 'bg-white'}`}>
        <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${chiCauMoi ? 'bg-brand' : 'bg-slate-200'}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${chiCauMoi ? 'left-[22px]' : 'left-0.5'}`} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-ph-label">Chỉ câu mới</span>
          <span className="mt-0.5 block text-[11px] text-ph-label-2">Không lặp câu em đã luyện trong 2 kỳ gần nhất (~1 tháng)</span>
        </span>
      </button>

      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px] text-ph-label-2">Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && dangs.length === 0 && (
        <p className="mt-8 text-center text-[13px] text-ph-label-2">Chưa có dạng nào trong kho cho khối của em.</p>
      )}

      {state === 'san_sang' && dangs.length > 0 && (
        <div className="mt-4 flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-3">
          {dangs.map((d) => {
            const mau = d.muc ? MUC_MAU[d.muc] : { bg: '#F1F3F8', chu: '#8792B5' }
            return (
              <button key={d.ma_dang} onClick={() => onPick({ ma_dang: d.ma_dang, ten_dang: d.ten_dang, chiCauMoi })}
                className="flex items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm active:scale-[0.98]">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-ph-label">{d.ten_dang}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-ph-label-2">{d.ten_chuyen_de}</span>
                  <span className="mt-0.5 block text-[11.5px] text-ph-label-2">Đã luyện {d.da_luyen}/{d.tong_cau} câu trong kho</span>
                </span>
                <span className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-extrabold" style={{ background: mau.bg, color: mau.chu }}>
                  {d.pct == null ? 'Chưa đánh giá' : `${d.pct}%`}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </Khung>
  )
}
