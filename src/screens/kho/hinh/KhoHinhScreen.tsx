// Kho HÌNH HỌC — spec-kho-hinh-v3, bố cục theo mockup-kho-hinh-v4.html.
// Vào bằng tab "Hình học" của Bản đồ kiến thức (KhoScreen). Rail trái = 10 màn M0..M9.
//
// HAI HÀNH VI PHẢI TÁCH (§0.4 — nguyên tắc quan trọng nhất):
//   · XÂY LƯỚI (M1/M2) — chuyên môn, Thùy/GV cứng, ĐƯỢC tạo node.
//   · GÁN BÀI (M3)     — cơ học, TA làm được, KHÔNG có đường nào tạo node.
// Lý do: bài mới có thể cách bài cũ mấy lớp trong lưới; tạo node lúc gán = đoán vị trí.
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Luoi } from '../../../lib/kho/hinh'
import { Empty } from './hinhUi'
import Ho from './Ho'
import SoDo from './SoDo'
import KhoTam from './KhoTam'
import HangCho from './HangCho'
import KhoChinh from './KhoChinh'
import Catalog from './Catalog'
import TaiLieuChuan from './TaiLieuChuan'
import SoanTaiLieu from './SoanTaiLieu'

export type ManHinh = 'ho' | 'sodo' | 'khotam' | 'hangcho' | 'khochinh' | 'tlchuan' | 'soan' | 'dang' | 'bode'

/** Điều hướng có mang theo ngữ cảnh: M5 "Đặt node" → M2 với mô tả điền sẵn (§4 M5). */
export type Nhay = { man: ManHinh; hoId?: string; moTaNode?: string; nodeId?: string; baiId?: string }

export default function KhoHinhScreen({ khoi }: { khoi: string }) {
  const [L, setL] = useState<Luoi | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [man, setMan] = useState<ManHinh>('ho')
  const [hoId, setHoId] = useState<string | null>(null)
  const [ctx, setCtx] = useState<{ moTaNode?: string; nodeId?: string; baiId?: string }>({})
  const [dem, setDem] = useState({ tam: 0, hangCho: 0, chinh: 0 })

  const load = useCallback(async () => {
    try {
      setLoi(null)
      const [luoi, tam, chinh, hc] = await Promise.all([
        api.loadLuoi(khoi), api.listBai('tam', khoi), api.listBai('chinh', khoi), api.listHangCho(khoi),
      ])
      setL(luoi)
      setDem({ tam: tam.length, chinh: chinh.length, hangCho: hc.length })
    } catch (e: any) { setLoi(e.message ?? String(e)) }
  }, [khoi])
  useEffect(() => { load() }, [load])

  const di = useCallback((n: Nhay) => {
    setMan(n.man)
    if (n.hoId !== undefined) setHoId(n.hoId)
    setCtx({ moTaNode: n.moTaNode, nodeId: n.nodeId, baiId: n.baiId })
    window.scrollTo(0, 0)
  }, [])

  const hoGoc = useMemo(() => (L ? L.moHinh.filter((m) => m.la_goc_ho) : []), [L])

  if (loi) return <Empty icon="⚠">Không tải được kho Hình: {loi}</Empty>
  if (!L) return <div className="flex h-full items-center justify-center text-sm text-slate-400">Đang tải lưới…</div>

  const NAV: { nhom: string; items: { key: ManHinh; icon: string; ten: string; n?: number }[] }[] = [
    { nhom: 'Sơ đồ gốc · tham chiếu & giảng dạy', items: [
      { key: 'ho', icon: '◇', ten: 'Chọn họ mô hình', n: hoGoc.length },
      { key: 'sodo', icon: '◈', ten: 'Sơ đồ (2 view)', n: L.baiToan.length },
    ] },
    { nhom: 'Kho nhập · dùng để IN', items: [
      { key: 'khotam', icon: '▤', ten: 'Kho tạm & gán', n: dem.tam },
      { key: 'hangcho', icon: '⚑', ten: 'Hàng chờ', n: dem.hangCho },
      { key: 'khochinh', icon: '▦', ten: 'Kho chính', n: dem.chinh },
      { key: 'tlchuan', icon: '⎙', ten: 'Tài liệu chuẩn' },
      { key: 'soan', icon: '✎', ten: 'Soạn tài liệu (ad-hoc)' },
    ] },
    { nhom: 'Catalog', items: [
      { key: 'dang', icon: '⌥', ten: 'Dạng bài', n: L.dang.filter((d) => d.cap === 'dang').length },
      { key: 'bode', icon: '◦', ten: 'Bổ đề', n: L.boDe.length },
    ] },
  ]

  return (
    <div className="flex h-full min-h-0">
      {/* Rail trái */}
      <aside className="w-[212px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-3 py-3">
        {NAV.map((g) => (
          <div key={g.nhom}>
            <div className="px-2.5 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{g.nhom}</div>
            {g.items.map((it) => (
              <button key={it.key} onClick={() => di({ man: it.key })}
                className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition ${
                  man === it.key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <span className="w-3.5 text-center">{it.icon}</span>
                <span className="flex-1 truncate">{it.ten}</span>
                {it.n != null && <span className="rounded-full bg-slate-100 px-1.5 text-[10.5px] text-slate-500">{it.n}</span>}
              </button>
            ))}
          </div>
        ))}
        <div className="mt-4 border-t border-slate-100 pt-3">
          {[
            ['bg-teal-500', 'Mô hình', 'trục giả thiết'],
            ['bg-blue-500', 'Bài toán nhỏ', 'trục suy luận'],
            ['bg-amber-500', 'Chuỗi hướng dẫn', 'đường in ra'],
          ].map(([c, a, b]) => (
            <div key={a} className="flex items-start gap-2 px-2 py-0.5 text-[11px] text-slate-500">
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-sm ${c}`} />
              <span><b className="text-slate-700">{a}</b> — {b}</span>
            </div>
          ))}
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-[11px] leading-relaxed text-slate-500">
            <b className="text-slate-700">Sơ đồ gốc</b> để tham chiếu · lý thuyết · giảng dạy.<br />
            <b className="text-slate-700">Kho nhập</b> mới là cái in ra dùng hiện tại.
          </div>
        </div>
      </aside>

      {/* Nội dung */}
      <div className="min-w-0 flex-1 overflow-y-auto bg-[#f6f7f9] px-6 py-5">
        {man === 'ho' && <Ho L={L} khoi={khoi} di={di} reload={load} />}
        {man === 'sodo' && <SoDo L={L} khoi={khoi} hoId={hoId} di={di} reload={load} moTaNode={ctx.moTaNode} nodeId={ctx.nodeId} />}
        {man === 'khotam' && <KhoTam L={L} khoi={khoi} di={di} reload={load} baiId={ctx.baiId} />}
        {man === 'hangcho' && <HangCho L={L} di={di} reload={load} />}
        {man === 'khochinh' && <KhoChinh L={L} khoi={khoi} di={di} />}
        {man === 'dang' && <Catalog L={L} khoi={khoi} loai="dang" reload={load} />}
        {man === 'bode' && <Catalog L={L} khoi={khoi} loai="bode" reload={load} />}
        {man === 'tlchuan' && <TaiLieuChuan L={L} khoi={khoi} />}
        {man === 'soan' && <SoanTaiLieu L={L} khoi={khoi} />}
      </div>
    </div>
  )
}
