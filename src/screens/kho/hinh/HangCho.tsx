// M5 — Hàng chờ: kênh BOTTOM-UP.
// Ý không tìm được node → cờ thiếu + mô tả. Đây là tín hiệu "lưới còn thiếu gì".
// Bottom-up CẤP TÍN HIỆU, KHÔNG CẤP QUYỀN GHI vào lưới (§0.5): nút "Đặt node" chỉ nhảy
// sang M2 với mô tả điền sẵn — người có chuyên môn quyết vị trí, không phải người gán.
import { useCallback, useEffect, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Bai, Luoi, Y } from '../../../lib/kho/hinh'
import { MathText } from '../ui'
import { Btn, Empty, Ma, Tag } from './hinhUi'
import type { Nhay } from './KhoHinhScreen'

export default function HangCho({ L, di, reload }: { L: Luoi; di: (n: Nhay) => void; reload: () => Promise<void> }) {
  const [ds, setDs] = useState<{ y: Y; bai: Bai }[]>([])
  const [ysCuaBai, setYs] = useState<Y[]>([])

  const nap = useCallback(async () => {
    const hc = await api.listHangCho()
    setDs(hc)
    setYs(hc.length ? await api.listY([...new Set(hc.map((x) => x.bai.id))]) : [])
  }, [])
  useEffect(() => { nap() }, [nap])

  /** Mô hình PHỎNG ĐOÁN = mô hình của các ý ĐÃ GÁN cùng bài. Không đoán được ⇒ để "chưa rõ". */
  const phongDoan = (baiId: string) => {
    const anh = ysCuaBai.filter((y) => y.bai_id === baiId && y.baitoan_id)
    const mhs = api.moHinhCuaBai(L, anh)
    return mhs
  }

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Hàng chờ — sơ đồ còn thiếu gì</h1>
        <span className="text-[12.5px] text-slate-400">kênh bottom-up · {ds.length} mục</span>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Bottom-up <b>cấp tín hiệu</b>, không cấp quyền ghi. Đặt node đúng chỗ trong sơ đồ, xong bài tự nối được.
      </p>

      {!ds.length
        ? <Empty icon="⚑">Hàng chờ trống — mọi ý đã gán được node, hoặc chưa ai gắn cờ thiếu.</Empty>
        : ds.map(({ y, bai }) => {
          const mhs = phongDoan(bai.id)
          const ho = mhs.length ? api.gocHoCua(L, mhs[0].id) : undefined
          return (
            <div key={y.id} className="mb-2 flex items-center gap-3 rounded-r-xl border border-l-[3px] border-slate-200 border-l-amber-400 bg-white px-3.5 py-3">
              {mhs.length
                ? <Tag ton="mh">◇ {mhs.map((m) => m.ma).join(' · ')} ?</Tag>
                : <Tag ton="gh">? chưa rõ</Tag>}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-slate-800">
                  <Ma>{bai.ma_bai} · {y.ma_y}</Ma> · ý {y.nhan_hien_thi ?? y.thu_tu} — <MathText>{y.noi_dung}</MathText>
                </div>
                <div className="mt-0.5 truncate text-[11.5px] text-slate-400">“{y.mo_ta_thieu}” · {bai.nguon ?? 'chưa rõ nguồn'}</div>
              </div>
              <Btn onClick={() => di({ man: 'khotam', baiId: bai.id })}>Xem bài</Btn>
              <Btn kind="pri" onClick={() => di({ man: 'sodo', hoId: ho, moTaNode: y.mo_ta_thieu ?? undefined })}>Đặt node →</Btn>
              <Btn title="Bỏ cờ — ý quay lại trạng thái chưa gán"
                onClick={async () => { await api.updateY(y.id, { co_thieu_node: false, mo_ta_thieu: null }); await nap(); await reload() }}>✕</Btn>
            </div>
          )
        })}
    </>
  )
}
