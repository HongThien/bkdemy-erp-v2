// BOX "Việc phát triển" (Trang chính, ngang chỗ lời chào): CHỈ task CỦA MÌNH (tôi làm) — 3 task BÁO ĐỘNG NHẤT.
// Báo động = quá hạn › đến hạn hôm nay › chờ cấp trên duyệt, rồi hạn gần nhất. Bấm box ⇒ popup BẢNG TO toàn team
// (Cả team / Của tôi / Tôi giao + giao task, đánh giá…).
// Nguồn = fn_task_bang (DB đã tính cờ den_han / qua_han) — client chỉ xếp hạng để hiện 3 dòng.
import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { listTaskBang, dangMoTask, type TaskBang } from '../../lib/taskPt'
import BangTaskScreen from '../giaoviec/BangTaskScreen'
import ModalFull from './ModalFull'
import { HEAD, THE } from './khung'

const SO_DONG = 3
const diemBaoDong = (t: TaskBang) => (t.qua_han ? 3 : t.den_han ? 2 : t.trang_thai === 'cho_duyet' ? 1 : 0)

export default function TienDoViec() {
  const meId = useStore((s) => s.me?.nhanSu.id)
  const [rows, setRows] = useState<TaskBang[] | null>(null)
  const [loi, setLoi] = useState(false)
  const [mo, setMo] = useState(false)
  const nap = () => listTaskBang().then((r) => { setRows(r); setLoi(false) }).catch(() => { setLoi(true); setRows((c) => c ?? []) })
  useEffect(() => { nap() }, [])
  // Đóng popup ⇒ nạp nền lại (task có thể vừa được giao / duyệt trong popup).
  const dong = () => { setMo(false); nap() }

  const dangMoDs = (rows ?? []).filter((t) => dangMoTask(t.trang_thai))
  // Dashboard CHỈ hiện task CỦA MÌNH (tôi làm). Task tôi giao cần tôi đánh giá thì chỉ ĐẾM (danh sách ở popup).
  const cuaToiDs = dangMoDs.filter((t) => t.nguoi_lam_id === meId)
  const hien = [...cuaToiDs].sort((a, b) => diemBaoDong(b) - diemBaoDong(a) || a.han.localeCompare(b.han)).slice(0, SO_DONG)
  const baoDong = cuaToiDs.filter((t) => diemBaoDong(t) >= 2).length
  const canDanhGia = dangMoDs.filter((t) => t.nguoi_giao_id === meId && (t.den_han || t.trang_thai === 'cho_duyet')).length

  return (
    <>
      <div style={THE} className="cursor-pointer p-3.5 transition hover:brightness-105" onClick={() => setMo(true)} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setMo(true) }}>
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[var(--sk-ink)]" style={HEAD}>🚀 Việc phát triển</h3>
          <span className="text-[11.5px] text-[var(--sk-muted)]">của bạn{baoDong > 0 ? ` · ${baoDong} cần chú ý` : ''}</span>
          {canDanhGia > 0 && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10.5px] font-bold text-white" title="Task bạn giao đang chờ bạn đánh giá">{canDanhGia} cần bạn đánh giá</span>}
          <span className="ml-auto text-[12px] font-semibold text-[var(--sk-acc)]">Mở đầy đủ ›</span>
        </div>
        {rows === null ? <p className="text-[12.5px] text-[var(--sk-muted)]">Đang tải…</p>
          : loi ? <p className="text-[12.5px] text-[var(--sk-muted)]">Chưa tải được danh sách task.</p>
          : hien.length === 0 ? <p className="text-[12.5px] text-[var(--sk-muted)]">Bạn không có task phát triển nào đang mở. ✓ <span className="text-[var(--sk-acc)]">Bấm để xem bảng cả team.</span></p>
          : (
            <ul className="space-y-1.5">
              {hien.map((t) => {
                const pct = Math.max(0, Math.min(100, Math.round(Number(t.tien_do_bao_cao ?? 0))))
                return (
                  <li key={t.id} className="flex items-center gap-2.5">
                    <span className="w-4 shrink-0 text-center text-[13px]" title={t.qua_han ? 'Quá hạn' : t.den_han ? 'Đến hạn' : t.trang_thai === 'cho_duyet' ? 'Chờ duyệt' : ''}>
                      {t.qua_han ? '⚠' : t.den_han ? '●' : t.trang_thai === 'cho_duyet' ? '⏳' : ''}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[var(--sk-ink)]" title={t.tieu_de}>
                      {t.tieu_de}
                      {t.nguoi_lam_id !== meId && <span className="ml-1.5 text-[11.5px] font-normal text-[var(--sk-muted)]">· {t.nguoi_lam_ten}</span>}
                    </span>
                    <span className="relative h-2 w-[26%] max-w-[120px] shrink-0 overflow-hidden bg-[var(--sk-surface2)] ring-1 ring-[var(--sk-line)]" style={{ borderRadius: 'var(--sk-radius-pill)' }}>
                      <span className="absolute inset-y-0 left-0 bg-[var(--sk-acc)]" style={{ width: `${pct}%`, borderRadius: 'var(--sk-radius-pill)' }} />
                    </span>
                    <span className="w-9 shrink-0 text-right text-[12.5px] font-bold tabular-nums text-[var(--sk-ink)]">{pct}%</span>
                  </li>
                )
              })}
            </ul>
          )}
      </div>
      {mo && <ModalFull tieuDe="🚀 Việc phát triển" onDong={dong} cao="86vh"><BangTaskScreen nhung macDinh="team" /></ModalFull>}
    </>
  )
}
