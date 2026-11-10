// Phần việc ở PHÒNG TRƯỞNG BỘ MÔN (Thùy 03/11; trước gọi "Phó giám đốc chuyên môn") — nhìn MỌI khối, chọn 1 khối ⇒ y như trưởng khối khối đó.
//   Quản trị: chip lọc [Tất cả · từng ô môn × khối] → BaoCaoCaNhan (Tất cả = phạm vi của tôi; 1 ô = fn_troly_o_lay).
//   Chất lượng: lưới các khối trước (số dạng yếu · HS yếu, fn_qlcl_tong_quan) → bấm 1 khối = 2 box dạng yếu + học tập tuần của khối đó.
// Danh sách ô = fn_qlcl_tong_quan (đúng các ô trong phạm vi) — không gõ tay khối. Chọn khối nhớ tới F5 (rời màn quay lại đúng chỗ).
import { useEffect, useState } from 'react'
import BaoCaoCaNhan, { type OChon } from '../troly/BaoCaoCaNhan'
import WidgetDangYeu, { khoaO } from '../qlcl/WidgetDangYeu'
import { tongQuanDangYeu, type OTongQuan } from '../../lib/qlcl'
import { monTbm } from '../../lib/phongTk'
import { DanhSachBoTro } from './ChatLuongPhong'

const NHO: { cacO: OTongQuan[] | null; qt: OChon | null; cl: OChon | null; clMuc: 'chung' | 'bo_tro' } = { cacO: null, qt: null, cl: null, clMuc: 'chung' }
const tenO = (o: OChon) => `${o.mon === 'Toán' ? '' : `${o.mon} `}Khối ${o.khoi}`

// Ô của PHÒNG: ô trong phạm vi (fn_qlcl_tong_quan) ∩ môn của phòng (fn_phong_mon_tbm; null = mọi môn) — Thùy 03/11: phòng Trang chỉ Toán.
// Lọc môn là lọc thuần UI trên danh sách ô đã có; số của từng ô vẫn do DB tính.
function useCacO() {
  const [ds, setDs] = useState<OTongQuan[] | null>(NHO.cacO)
  useEffect(() => {
    Promise.all([tongQuanDangYeu(), monTbm()])
      .then(([d, mon]) => { const x = mon ? d.filter((o) => mon.includes(o.mon)) : d; NHO.cacO = x; setDs(x) })
      .catch(() => {})
  }, [])
  return ds
}

function ChipO({ cacO, chon, onChon, nhanTatCa }: { cacO: OTongQuan[]; chon: OChon | null; onChon: (o: OChon | null) => void; nhanTatCa: string }) {
  const nut = (dang: boolean) => `rounded-full px-2.5 py-1 text-[12px] font-medium transition ${dang ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
  return (
    // no-nut-ve: chip "← Mọi khối" không được để hook useNutQuayVe ẩn đi
    <div className="no-nut-ve mb-3 flex flex-wrap items-center gap-1">
      <button onClick={() => onChon(null)} className={nut(!chon)}>{nhanTatCa}</button>
      {cacO.map((o) => (
        <button key={khoaO(o)} onClick={() => onChon({ mon: o.mon, khoi: o.khoi })} className={nut(!!chon && khoaO(chon) === khoaO(o))}>{tenO(o)}</button>
      ))}
    </div>
  )
}

export function QuanTriTbm() {
  const cacO = useCacO()
  const [chon, setChonS] = useState<OChon | null>(NHO.qt)
  const setChon = (o: OChon | null) => { NHO.qt = o; setChonS(o) }
  return (
    <div>
      {cacO && <ChipO cacO={cacO} chon={chon} onChon={setChon} nhanTatCa="Mọi khối" />}
      <BaoCaoCaNhan key={chon ? khoaO(chon) : 'tat_ca'} chiMuc={['baocao']} o={chon} phong />
    </div>
  )
}

// Thùy 10/11: thêm mục "Danh sách bổ trợ" — trưởng khối gửi lên, trưởng bộ môn duyệt (= mở case) / trả lại.
export function ChatLuongTbm({ onTaoCaNhe }: { onTaoCaNhe: () => void }) {
  const cacO = useCacO()
  const [muc, setMucS] = useState(NHO.clMuc)
  const setMuc = (m: 'chung' | 'bo_tro') => { NHO.clMuc = m; setMucS(m) }
  const thanh = (on: boolean) => `rounded-lg px-4 py-1.5 text-[13px] font-semibold ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`
  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
        <button onClick={() => setMuc('chung')} className={thanh(muc === 'chung')}>Tình hình chung</button>
        <button onClick={() => setMuc('bo_tro')} className={thanh(muc === 'bo_tro')}>Danh sách bổ trợ</button>
      </div>
      {muc === 'bo_tro' ? (cacO ? <DanhSachBoTro che="tbm" cacO={cacO} /> : <p className="text-[13px] text-slate-400">Đang tải các khối…</p>)
        : <ChatLuongTbmChung cacO={cacO} onTaoCaNhe={onTaoCaNhe} />}
    </div>
  )
}

function ChatLuongTbmChung({ cacO, onTaoCaNhe }: { cacO: OTongQuan[] | null; onTaoCaNhe: () => void }) {
  const [chon, setChonS] = useState<OChon | null>(NHO.cl)
  const setChon = (o: OChon | null) => { NHO.cl = o; setChonS(o) }
  if (!cacO) return <p className="text-[13px] text-slate-400">Đang tải các khối…</p>
  if (chon) return (
    <div className="space-y-4">
      <ChipO cacO={cacO} chon={chon} onChon={setChon} nhanTatCa="← Mọi khối" />
      <WidgetDangYeu className="" chiO={khoaO(chon)} onTaoCaNhe={onTaoCaNhe} theoNhom />
      <BaoCaoCaNhan chiMuc={['tuan']} o={chon} />
    </div>
  )
  // NHÌN THEO KHỐI TRƯỚC: mỗi ô một thẻ — số do DB tính (fn_qlcl_tong_quan), thẻ chỉ hiển thị.
  return (
    <div>
      <p className="mb-2 text-[14px] font-bold text-slate-800">Chất lượng theo khối <span className="text-[12px] font-normal text-slate-400">· bấm một khối để xem như trưởng khối khối đó</span></p>
      <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(190px,1fr))]">
        {cacO.map((o) => (
          <button key={khoaO(o)} onClick={() => setChon({ mon: o.mon, khoi: o.khoi })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-[13.5px] font-bold text-slate-800">{tenO(o)}</div>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Dạng yếu</div>
                <div className="text-[20px] font-extrabold leading-tight text-rose-600">{o.so_dang_yeu}
                  {o.dau_tuan_dang_yeu != null && <span className="ml-1 text-[11px] font-medium text-slate-400">đầu tuần {o.dau_tuan_dang_yeu}</span>}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">HS yếu</div>
                <div className="text-[20px] font-extrabold leading-tight text-violet-600">{o.so_hs_yeu}<span className="text-[11px] font-medium text-slate-400">/{o.so_hs}</span></div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
