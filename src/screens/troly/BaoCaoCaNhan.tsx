// ============================================================================
// TRỢ LÝ CÁ NHÂN — báo cáo Sư phạm của CÁC KHỐI MÌNH QUẢN LÝ (CEO 14/10).
// Khối lấy từ bảng phân công Trưởng/Phó khối ở DB (`phan_cong_quan_ly_khoi`, 29/10); mọi số lọc từ báo cáo trung tâm đã lưu
// (`fn_troly_ca_nhan_lay`) — luật đếm chỉ có MỘT nguồn. Màn này KHÔNG tính gì.
// Trưởng khối: nhắc TA của khối, báo cáo lên Quản lý trợ giảng.
// Phó khối (chi_xem): xem + nhắc TA, báo cáo lại trưởng khối — không giao việc / không gậy.
// Thùy 29/10 (spec-truong-khoi.md §5, P4): trưởng khối = "Trang thu nhỏ" ⇒ 3 mục: Báo cáo Sư phạm · Dạng yếu · Học tập tuần.
// Phạm vi = (môn × khối) của fn_pham_vi_cua_toi ở DB (quản lý môn = mọi khối của môn).
// ============================================================================
import { useEffect, useState } from 'react'
import { getBaoCaoCaNhan, getHocTapTuanCaNhan, type BaoCaoTroLy, type LopHocTapTuan } from '../../lib/troly-baocao'
import { BanBaoCao } from './BaoCao'
import WidgetDangYeu from '../qlcl/WidgetDangYeu'
import { moBoTroTab } from '../botro/BoTroHubScreen'
import { useStore } from '../../store/useStore'
import { ddmmVN } from '../../lib/tuan'

type Muc = 'baocao' | 'dangyeu' | 'tuan'
const MUC: [Muc, string][] = [['baocao', 'Báo cáo Sư phạm'], ['dangyeu', 'Dạng yếu'], ['tuan', 'Học tập tuần']]
// Rời tab rồi quay lại = đúng mục + khoảng đang xem, không gọi lại (CLAUDE.md §2 React).
const NHO_MUC: { muc: Muc } = { muc: 'baocao' }

export default function BaoCaoCaNhan() {
  const [muc, setMucS] = useState<Muc>(NHO_MUC.muc)
  const setMuc = (m: Muc) => { NHO_MUC.muc = m; setMucS(m) }
  const setStaffLeaf = useStore((s) => s.setStaffLeaf)
  return (
    <div>
      <div className="mb-3 inline-flex rounded-xl border border-slate-200 bg-white p-0.5 text-[13px] font-semibold shadow-sm">
        {MUC.map(([k, t]) => (
          <button key={k} onClick={() => setMuc(k)} className={`rounded-lg px-4 py-1.5 ${muc === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{t}</button>
        ))}
      </div>
      {muc === 'baocao' ? <BaoCaoSuPham />
        : muc === 'dangyeu' ? <WidgetDangYeu onTaoCaNhe={() => { moBoTroTab('nhe'); setStaffLeaf('botro') }} />
        : <HocTapTuan />}
    </div>
  )
}

const KHOANG = [7, 14, 30]
const NHO: { soNgay: number; bc: BaoCaoTroLy | null } = { soNgay: 14, bc: null }

function BaoCaoSuPham() {
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

// ET / BTVN trung bình theo lớp — tuần gần nhất so tuần trước (số đã lưu ở Tổng kết tuần, không tính lại).
type HocTapTuanData = { tuan: string | null; tuan_truoc: string | null; lop: LopHocTapTuan[] }
const NHO_TUAN: { d: HocTapTuanData | null } = { d: null }

function HocTapTuan() {
  const [d, setD] = useState<HocTapTuanData | null>(NHO_TUAN.d)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    if (NHO_TUAN.d) return
    getHocTapTuanCaNhan().then((x) => { NHO_TUAN.d = x; setD(x) }).catch((e: any) => setLoi(e?.message ?? String(e)))
  }, [])
  if (loi) return <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">Lỗi: {loi}</div>
  if (!d) return <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-400">Đang tải…</div>
  const so = (v: number | null) => (v == null ? '—' : String(Math.round(v)))
  const lech = (a: number | null, b: number | null) => {
    if (a == null || b == null) return null
    const x = Math.round(a - b)
    return <span className={`ml-1 text-[11px] font-semibold ${x > 0 ? 'text-emerald-600' : x < 0 ? 'text-rose-600' : 'text-slate-400'}`}>{x > 0 ? `▲${x}` : x < 0 ? `▼${-x}` : '='}</span>
  }
  const ngay = (s: string | null) => (s ? ddmmVN(s.slice(0, 10)) : '—')
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <p className="border-b border-slate-100 px-4 py-2 text-[12.5px] text-slate-500">Tuần {ngay(d.tuan)} so với tuần {ngay(d.tuan_truoc)} · số từ Tổng kết tuần (tính sáng thứ 2)</p>
      <table className="w-full text-[13px]">
        <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
          <th className="px-4 py-1.5">Lớp</th><th>ET trung bình</th><th>Lượt ET</th><th>BTVN trung bình</th><th>Lượt BTVN</th>
        </tr></thead>
        <tbody>{d.lop.map((l) => (
          <tr key={l.lop_id} className="border-t border-slate-100">
            <td className="px-4 py-1.5 font-semibold text-slate-800">{l.ten_lop} <span className="font-normal text-slate-400">· {l.mon}</span></td>
            <td>{so(l.et_tb)}{lech(l.et_tb, l.et_tb_truoc)}</td><td className="text-slate-500">{l.et_so_luot}</td>
            <td>{so(l.btvn_tb)}{lech(l.btvn_tb, l.btvn_tb_truoc)}</td><td className="text-slate-500">{l.btvn_so_luot}</td>
          </tr>
        ))}</tbody>
      </table>
      {d.lop.length === 0 && <p className="px-4 py-3 text-[13px] text-slate-400">Chưa có số tuần cho lớp nào trong phạm vi.</p>}
    </div>
  )
}
