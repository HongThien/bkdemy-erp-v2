// ============================================================================
// TRỢ LÝ CÁ NHÂN — báo cáo Sư phạm của CÁC KHỐI MÌNH QUẢN LÝ (CEO 14/10).
// Khối lấy từ sơ đồ tổ chức ở DB (`vi_tri.khoi_quan_ly`); mọi số lọc từ báo cáo trung tâm đã lưu
// (`fn_troly_ca_nhan_lay`) — luật đếm chỉ có MỘT nguồn. Màn này KHÔNG tính gì.
// Trưởng khối: nhắc TA của khối, báo cáo lên Quản lý trợ giảng.
// Phó khối (chi_xem): xem + nhắc TA, báo cáo lại trưởng khối — không giao việc / không gậy.
// ============================================================================
import { useEffect, useState } from 'react'
import { getBaoCaoCaNhan, type BaoCaoTroLy } from '../../lib/troly-baocao'
import { BanBaoCao } from './BaoCao'

const KHOANG = [7, 14, 30]
// Rời tab rồi quay lại = đúng khoảng đang xem, không gọi lại (CLAUDE.md §2 React).
const NHO: { soNgay: number; bc: BaoCaoTroLy | null } = { soNgay: 14, bc: null }

export default function BaoCaoCaNhan() {
  const [soNgay, setSoNgay] = useState(NHO.soNgay)
  const [bc, setBc] = useState<BaoCaoTroLy | null>(NHO.bc)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  useEffect(() => {
    if (NHO.bc && NHO.soNgay === soNgay) return
    setBc(null); setLoi(null); setDangTai(true)
    getBaoCaoCaNhan(soNgay)
      .then((d) => { NHO.soNgay = soNgay; NHO.bc = d; setBc(d) })
      .catch((e: any) => setLoi(e?.message ?? String(e)))
      .finally(() => setDangTai(false))
  }, [soNgay])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[12.5px] text-slate-500">Nhìn lại</span>
        {KHOANG.map((n) => (
          <button key={n} onClick={() => setSoNgay(n)}
            className={`rounded-full border px-3 py-1 text-[12.5px] font-medium ${
              soNgay === n ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>
            {n} ngày
          </button>
        ))}
      </div>

      {bc?.khoi && (
        <div className="mb-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700">
          Khối bạn quản lý: <b>{bc.khoi.join(' · ')}</b> — {bc.so_lop} lớp.
          <span className="ml-1 text-slate-400">{bc.ghi_chu_bo}</span>
        </div>
      )}
      {loi && <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">Lỗi: {loi}</div>}
      {!bc && dangTai && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-400">Đang tải báo cáo…</div>}
      {bc && <BanBaoCao bc={bc} mo={dangTai} />}
    </div>
  )
}
