// TAB DUYỆT (§4.2) — hộp duyệt CÁ NHÂN của NGƯỜI GIAO: mọi task tôi giao đã nộp (cho_nghiem_thu),
// gom THẲNG 1 chỗ, cũ nhất lên đầu (FIFO). Khác Weekly Planning (phải lần đúng tuần rồi đào qua
// cụm mẹ/con mới ra nút Nghiệm thu) — đây là màn chuyên để RÀ và CHỐT, không cần biết task ở tuần nào.
import { useEffect, useState } from 'react'
import { listChoNghiemThuCuaToi, type ViecFull } from '../../lib/giaoviec'
import { CX_BTN, DeadlineChip, Empty, ErrBar, NguoiChip, fmtNgay } from './ui'
import { NghiemThuModal } from './TaskActions'

export default function DuyetTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const [rows, setRows] = useState<ViecFull[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [modal, setModal] = useState<ViecFull | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { const r = await listChoNghiemThuCuaToi(); setRows(r); onCountChange?.(r.length) }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, []) // eslint-disable-line

  return (
    <div className="mx-auto max-w-[820px] space-y-3">
      <ErrBar msg={err} />
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (!rows.length ? (
        <Empty>Không có việc nào chờ bạn nghiệm thu 🎉</Empty>
      ) : (
        <div className="space-y-2">
          {rows.map((v) => (
            <div key={v.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-white p-3.5 shadow-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-slate-800">{v.tieu_de}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <NguoiChip ten={v.nguoi_lam_ten} />
                  <DeadlineChip deadline={v.deadline} active={false} />
                  {v.hoan_thanh_at && <span className="text-[11px] text-slate-400">nộp {fmtNgay(v.hoan_thanh_at.slice(0, 10))}</span>}
                  {v.so_lan_tra_lai > 0 && <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-600">đã trả lại {v.so_lan_tra_lai}×</span>}
                </div>
              </div>
              <button onClick={() => setModal(v)} className={CX_BTN}>Nghiệm thu</button>
            </div>
          ))}
        </div>
      ))}
      {modal && <NghiemThuModal v={modal} onClose={() => setModal(null)} onDone={() => { setModal(null); reload() }} />}
    </div>
  )
}
