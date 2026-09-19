// ============================================================================
// TuLuyenChuDe — 2 màn cho luồng "Tự luyện theo chủ đề" (Thùy 19/09):
// (1) ChonLoaiTuLuyen — màn chọn "Tổng hợp" (hệ tự rải, y hệt Tự luyện cũ) hay
//     "Theo chủ đề" (chọn đúng 1 dạng).
// (2) ChonDangChuDe — danh sách dạng (khối hiện tại) + % đã luyện qua (coverage,
//     KHÔNG phải điểm đúng/sai) → bấm 1 dạng để bắt đầu luyện 10 câu của riêng dạng đó.
// Style tối giản, dùng chung token màu ph-* /brand đã có (không bịa theme riêng).
// ============================================================================
import { useEffect, useState } from 'react'
import { layDangChuDe, monCuaHS, type DangChuDe } from '../../lib/tuluyen'

function Khung({ desktop, children }: { desktop?: boolean; children: React.ReactNode }) {
  return (
    <div className={desktop ? 'mx-auto min-h-screen max-w-2xl bg-[#f4f7fb] px-8 py-6' : 'mx-auto flex min-h-screen max-w-md flex-col bg-ios px-4 pb-8 pt-[calc(14px+env(safe-area-inset-top))]'}>
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
          <span className="mt-1 block text-[12.5px] text-ph-label-2">Em tự chọn 1 dạng cụ thể để luyện riêng, xem % đã luyện qua trong kho.</span>
        </button>
      </div>
    </Khung>
  )
}

export function ChonDangChuDe({ onPick, onBack, desktop }: { onPick: (d: { ma_dang: string; ten_dang: string }) => void; onBack: () => void; desktop?: boolean }) {
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'loi'>('dang_tai')
  const [dangs, setDangs] = useState<DangChuDe[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    monCuaHS().then((m) => {
      if (!m) throw new Error('Chưa xác định được môn học của em — báo thầy cô nhé.')
      return layDangChuDe(m)
    }).then((ds) => { setDangs(ds); setState('san_sang') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  let lastChuyenDe = ''
  return (
    <Khung desktop={desktop}>
      <NutBack onBack={onBack} desktop={desktop} />
      <h1 className={`font-extrabold text-ph-label ${desktop ? 'text-[22px]' : 'text-[19px]'}`}>Chọn dạng để luyện</h1>
      <p className={`mt-1 text-ph-label-2 ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>% là số câu em đã luyện qua trong kho của dạng đó.</p>

      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px] text-ph-label-2">Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'san_sang' && dangs.length === 0 && (
        <p className="mt-8 text-center text-[13px] text-ph-label-2">Chưa có dạng nào trong kho cho khối của em.</p>
      )}

      {state === 'san_sang' && dangs.length > 0 && (
        <div className={`mt-4 flex flex-col gap-2.5 ${desktop ? 'sm:grid sm:grid-cols-2 sm:gap-3' : ''}`}>
          {dangs.map((d) => {
            const moiChuyenDe = d.ten_chuyen_de !== lastChuyenDe
            lastChuyenDe = d.ten_chuyen_de
            return (
              <div key={d.ma_dang} className="contents">
                {moiChuyenDe && <div className="mt-2 text-[11px] font-bold uppercase tracking-wide text-ph-label-2 first:mt-0">{d.ten_chuyen_de}</div>}
                <button onClick={() => onPick({ ma_dang: d.ma_dang, ten_dang: d.ten_dang })}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm active:scale-[0.98]">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-ph-label">{d.ten_dang}</span>
                    <span className="mt-0.5 block text-[11.5px] text-ph-label-2">Đã luyện {d.da_luyen}/{d.tong_cau} câu trong kho</span>
                  </span>
                  <span className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-extrabold"
                    style={{ background: d.pct >= 70 ? '#DFF6EA' : d.pct > 0 ? '#FFF3D6' : '#F1F3F8', color: d.pct >= 70 ? '#1A9A5C' : d.pct > 0 ? '#B4791C' : '#8792B5' }}>
                    {d.pct}%
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Khung>
  )
}
