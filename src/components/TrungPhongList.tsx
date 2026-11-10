// Danh sách "trùng" trả về từ DB (fn_lich_truc_kiem_trung / fn_tkb_kiem_trung — đều đọc lịch phòng chung fn_phong_lich).
// Dùng chung cho mọi form xếp lịch: Lịch khối (Bổ trợ), Thời khoá biểu, lịch khung ở màn Lớp. Màn KHÔNG tự quyết trùng hay không.
import { useEffect, useState } from 'react'
import { NGUON_PHONG_TEN, type TrungLichKhoi } from '../lib/phong'
import { ddmmVN } from '../lib/tuan'

export default function TrungPhongList({ trung, dangKiem, goiY = 'Chọn phòng để kiểm trùng.' }: { trung: TrungLichKhoi[] | null; dangKiem?: boolean; goiY?: string }) {
  return (
    <div className="min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 p-3">
      {dangKiem ? <p className="text-[12px] text-slate-400">Đang kiểm trùng với lịch phòng chung…</p>
        : trung === null ? <p className="text-[12px] text-slate-400">{goiY}</p>
        : trung.length === 0 ? <p className="text-[12.5px] font-semibold text-emerald-700">✓ Không trùng trong 4 tuần tới (lịch phòng chung).</p>
        : (
          <ul className="space-y-1.5">
            {trung.map((t, i) => (
              <li key={i} className={`rounded-lg px-2.5 py-1.5 text-[12px] ${t.muc === 'chan' ? 'bg-rose-50 text-rose-800 ring-1 ring-rose-200' : 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'}`}>
                <span className="font-bold">{t.muc === 'chan' ? '🚫 Trùng' : '⚠ Ghép'} {t.kieu === 'phong' ? `phòng ${t.phong}` : 'người trực'}</span>
                {' — '}{t.tieu_de} · {t.gio_bat_dau}–{t.gio_ket_thuc}{t.kieu === 'nguoi' && t.phong ? ` · ${t.phong}` : ''}{t.phu_trach ? ` · ${t.phu_trach}` : ''}
                <span className="opacity-70"> ({NGUON_PHONG_TEN[t.nguon]}) · ngày {t.ngay.map(ddmmVN).join(', ')}</span>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}

// Kiểm trùng SỐNG (debounce 350ms) khi form đổi: goi = null ⇒ chưa đủ dữ liệu để kiểm (trung = null).
export function useKiemTrung(goi: (() => Promise<TrungLichKhoi[]>) | null, deps: unknown[]) {
  const [trung, setTrung] = useState<TrungLichKhoi[] | null>(null)
  const [dangKiem, setDangKiem] = useState(false)
  useEffect(() => {
    if (!goi) { setTrung(null); setDangKiem(false); return }
    let alive = true
    setDangKiem(true)
    const t = setTimeout(() => { goi().then((r) => { if (alive) setTrung(r) }).catch(() => { if (alive) setTrung(null) }).finally(() => { if (alive) setDangKiem(false) }) }, 350)
    return () => { alive = false; clearTimeout(t) }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  const coChan = !!trung?.some((t) => t.muc === 'chan')
  const coCanhBao = !!trung?.some((t) => t.muc === 'canh_bao')
  return { trung, setTrung, dangKiem, coChan, coCanhBao }
}
