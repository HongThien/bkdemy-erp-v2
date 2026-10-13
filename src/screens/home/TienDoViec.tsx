// BOX "Tiến độ công việc" (Trang chính, trên cùng): task phát triển — mỗi task 1 dòng gọn: tên + thanh % tiến độ.
// 2 chế độ: Của tôi / Cả team. Bấm tiêu đề hoặc "Mở bảng task" = shortcut vào bảng task phát triển của team (leaf giaoviec).
// Nguồn = fn_viec_bang (DB đã lọc task mở + xong 14 ngày, kèm % tự báo gần nhất) — client chỉ vẽ.
import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { listTaskBang, dangMoTask, type TaskBang } from '../../lib/taskPt'
import { HEAD, THE } from './khung'

const TOI_DA = 8
const KHOA = 'erp.home.tienDo'
const doc = (): 'toi' | 'team' => { try { return localStorage.getItem(KHOA) === 'team' ? 'team' : 'toi' } catch { return 'toi' } }

export default function TienDoViec({ onMoBang }: { onMoBang: () => void }) {
  const meId = useStore((s) => s.me?.nhanSu.id)
  const [rows, setRows] = useState<TaskBang[] | null>(null)
  const [loi, setLoi] = useState(false)
  const [xem, setXem] = useState<'toi' | 'team'>(doc)
  useEffect(() => { listTaskBang().then(setRows).catch(() => { setLoi(true); setRows([]) }) }, [])
  const doiXem = (k: 'toi' | 'team') => { setXem(k); try { localStorage.setItem(KHOA, k) } catch { /* không lưu được thì thôi */ } }

  const dsDangMo = (rows ?? []).filter((t) => dangMoTask(t.trang_thai) && (xem === 'team' || t.nguoi_lam_id === meId))
  const hien = dsDangMo.slice(0, TOI_DA)
  const them = dsDangMo.length - hien.length
  const nut = (k: 'toi' | 'team', ten: string) => (
    <button onClick={() => doiXem(k)} className={`px-3 py-1 text-[12.5px] font-bold ${xem === k ? 'bg-[var(--sk-acc)] text-[var(--sk-acc-ink)]' : 'text-[var(--sk-muted)] hover:text-[var(--sk-ink)]'}`} style={{ borderRadius: 'var(--sk-radius-pill)' }}>{ten}</button>
  )
  return (
    <div style={THE} className="p-3.5">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <button onClick={onMoBang} title="Mở bảng task phát triển" className="text-left text-[15px] font-bold text-[var(--sk-ink)] hover:underline" style={HEAD}>🚀 Tiến độ công việc</button>
        <div className="inline-flex gap-0.5 border border-[var(--sk-line)] p-0.5" style={{ borderRadius: 'var(--sk-radius-pill)' }}>{nut('toi', 'Của tôi')}{nut('team', 'Cả team')}</div>
        <button onClick={onMoBang} className="ml-auto text-[12px] font-semibold text-[var(--sk-acc)] hover:underline">Mở bảng task ›</button>
      </div>
      {rows === null ? <p className="text-[12.5px] text-[var(--sk-muted)]">Đang tải…</p>
        : loi ? <p className="text-[12.5px] text-[var(--sk-muted)]">Chưa tải được danh sách task.</p>
        : hien.length === 0 ? <p className="text-[12.5px] text-[var(--sk-muted)]">{xem === 'toi' ? 'Bạn không có task phát triển nào đang mở. ✓' : 'Chưa có task nào đang mở.'}</p>
        : (
          <ul className="space-y-2">
            {hien.map((t) => {
              const pct = Math.max(0, Math.min(100, Math.round(Number(t.tien_do_bao_cao ?? 0))))
              return (
                <li key={t.id} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[var(--sk-ink)]" title={t.tieu_de}>
                    {t.qua_han && <span className="mr-1 text-rose-500" title="Quá hạn">⚠</span>}{!t.qua_han && t.den_han && <span className="mr-1 text-amber-500" title="Đến hạn hôm nay">●</span>}{t.tieu_de}
                    {xem === 'team' && t.nguoi_lam_ten && <span className="ml-1.5 text-[12px] font-normal text-[var(--sk-muted)]">· {t.nguoi_lam_ten}</span>}
                  </span>
                  <span className="relative h-2.5 w-[34%] max-w-[340px] shrink-0 overflow-hidden bg-[var(--sk-surface2)] ring-1 ring-[var(--sk-line)]" style={{ borderRadius: 'var(--sk-radius-pill)' }}>
                    <span className="absolute inset-y-0 left-0 bg-[var(--sk-acc)]" style={{ width: `${pct}%`, borderRadius: 'var(--sk-radius-pill)' }} />
                  </span>
                  <span className="w-10 shrink-0 text-right text-[13px] font-bold tabular-nums text-[var(--sk-ink)]">{pct}%</span>
                </li>
              )
            })}
          </ul>
        )}
      {them > 0 && <p className="mt-2 text-[12px] text-[var(--sk-muted)]">… và {them} task nữa</p>}
    </div>
  )
}
