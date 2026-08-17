// Lịch phòng — gộp 3 nguồn (chính khóa/bổ trợ/phát sinh), hàng = phòng, mỗi phòng liệt kê các khối
// bận trong ngày theo giờ (kiểu sổ đặt phòng khách sạn). Chính khóa/bổ trợ CHỈ XEM ở đây — sửa ở
// đúng màn gốc (TKB/Bổ trợ). Chỉ khối "phát sinh" mới thêm/sửa/huỷ tại màn này.
import { useEffect, useState } from 'react'
import { listPhong, lichPhongNgay, type Phong, type KhoiBanPhong, type LoaiHoatDong } from '../../lib/phong'
import PhatSinhModal from './PhatSinhModal'

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
function shiftNgay(ngay: string, delta: number): string {
  const d = new Date(ngay + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
}
const hhmm = (t: string) => t.slice(0, 5)
const thuLabel = (ngay: string) => ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][new Date(ngay + 'T00:00:00').getDay()]

const NGUON_TONE: Record<'chinh_khoa' | 'bo_tro', string> = {
  chinh_khoa: 'border-l-4 border-indigo-400 bg-indigo-50/70 text-indigo-900',
  bo_tro: 'border-l-4 border-amber-400 bg-amber-50/70 text-amber-900',
}
const PHAT_SINH_TONE: Record<LoaiHoatDong, string> = {
  hop_noi_bo: 'border-l-4 border-violet-400 bg-violet-50/70 text-violet-900',
  hoc_tap_ngoai_lich: 'border-l-4 border-emerald-400 bg-emerald-50/70 text-emerald-900',
  viec_khac: 'border-l-4 border-rose-400 bg-rose-50/70 text-rose-900',
}
const NGUON_NHAN: Record<'chinh_khoa' | 'bo_tro', string> = { chinh_khoa: 'Chính khóa', bo_tro: 'Bổ trợ' }

function toneOf(k: KhoiBanPhong): string {
  if (k.nguon === 'phat_sinh') return PHAT_SINH_TONE[k.loai_phat_sinh ?? 'viec_khac']
  return NGUON_TONE[k.nguon]
}

export default function LichPhongScreen() {
  const [ngay, setNgay] = useState(today())
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [khoi, setKhoi] = useState<KhoiBanPhong[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ phongId?: string; ngay: string; gioGoiY?: string; edit?: KhoiBanPhong } | null>(null)

  async function load() {
    setLoading(true)
    try {
      const [ps, ks] = await Promise.all([listPhong(), lichPhongNgay(ngay)])
      setPhongs(ps); setKhoi(ks)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [ngay])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f5f7]">
      <div className="shrink-0 p-6 pb-4">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-4 text-[13px] text-slate-500">Chính khóa (TKB) · Bổ trợ (bù/yếu/đuổi) · Phát sinh (họp/học tập ngoài lịch/việc khác) — bấm "+ Phát sinh" trên phòng để thêm hoạt động.</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setNgay((n) => shiftNgay(n, -1))} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] text-slate-600 hover:bg-slate-50">‹</button>
            <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-[14px] outline-none focus:border-indigo-400" />
            <button onClick={() => setNgay((n) => shiftNgay(n, 1))} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] text-slate-600 hover:bg-slate-50">›</button>
            <button onClick={() => setNgay(today())} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-50">Hôm nay</button>
            <span className="ml-2 text-[14px] font-medium text-slate-500">{thuLabel(ngay)}</span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-6 pb-6">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p> : phongs.map((p) => {
            const cua = khoi.filter((k) => k.phong_ma === p.ma_phong).sort((a, b) => a.gio_bat_dau.localeCompare(b.gio_bat_dau))
            return (
              <div key={p.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold text-slate-800">{p.ten_phong}</div>
                    {p.suc_chua != null && <div className="text-[12px] text-slate-400">Sức chứa {p.suc_chua}</div>}
                  </div>
                  <button onClick={() => setModal({ phongId: p.id, ngay })}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] text-indigo-600 hover:bg-indigo-50">+ Phát sinh</button>
                </div>
                <div className="space-y-1.5">
                  {cua.length === 0 && <p className="text-[12px] text-slate-300">Trống cả ngày</p>}
                  {cua.map((k) => (
                    <div key={k.ref_id} onClick={() => k.nguon === 'phat_sinh' && setModal({ ngay, edit: k })}
                      className={`rounded-lg p-2 text-[12px] ${toneOf(k)} ${k.nguon === 'phat_sinh' ? 'cursor-pointer hover:brightness-95' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{hhmm(k.gio_bat_dau)}–{hhmm(k.gio_ket_thuc)}</span>
                        <span className="text-[10px] opacity-70">{k.nguon === 'phat_sinh' ? 'Phát sinh' : NGUON_NHAN[k.nguon]}</span>
                      </div>
                      <div className="truncate font-medium">{k.tieu_de}</div>
                      {k.phu_trach && <div className="truncate opacity-70">{k.phu_trach}</div>}
                      {k.phong_khong_khop_danh_muc && <div className="mt-0.5 text-[10px] text-rose-500">⚠ mã phòng không khớp danh mục</div>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {modal && (
        <PhatSinhModal
          phongId={modal.phongId} ngay={modal.ngay} edit={modal.edit}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
