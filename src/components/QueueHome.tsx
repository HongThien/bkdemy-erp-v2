import type { User, OpLoai, OpTask, DevTask } from '../types'
import { opTasksForUser, devTasksForUser } from '../store/useStore'

const loaiLabel: Record<OpLoai, string> = {
  diem_danh: 'Điểm danh',
  cham_et: 'Chấm ET',
  cham_btvn: 'Chấm BTVN',
  danh_gia: 'Đánh giá buổi',
  xep_bu: 'Xếp bù',
}

function OpCard({ t, onClick }: { t: OpTask; onClick: () => void }) {
  const over = t.trangThai === 'qua_han'
  return (
    <article
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-3 shadow-sm transition hover:shadow ${
        over ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className={`text-sm ${over ? 'text-red-700' : ''}`}>{t.nhan}</div>
      <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500">{loaiLabel[t.loai]}</span>
        <span>
          {t.tienDo ? `${t.tienDo.done}/${t.tienDo.total} · ` : ''}
          {t.deadline}
        </span>
      </div>
    </article>
  )
}

function DevCard({ d }: { d: DevTask }) {
  const nop = d.trangThai === 'da_nop'
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="text-sm">{d.tieuDe}</div>
      <div className="mt-0.5 text-xs text-slate-400">{d.moTa}</div>
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="text-slate-400">{d.deadline}</span>
        <span className={nop ? 'text-emerald-600' : 'text-slate-400'}>{nop ? 'đã nộp' : 'đang làm'}</span>
      </div>
    </article>
  )
}

export default function QueueHome({ user, onOpenOp }: { user: User; onOpenOp: (t: OpTask) => void }) {
  const ops = opTasksForUser(user)
  const dev = devTasksForUser(user)
  const quaHan = ops.filter((t) => t.trangThai === 'qua_han').length

  return (
    <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-8">
      {/* Queue vận hành — ngôi sao */}
      <section>
        <div className="mb-2.5 px-1">
          <div className="text-sm font-semibold">Queue vận hành</div>
          <div className="text-xs text-slate-500">
            Còn lại hôm nay: <b>{ops.length}</b> việc
            {quaHan ? <span className="text-red-600"> · {quaHan} quá hạn</span> : null}
          </div>
        </div>
        <div className="space-y-2.5">
          {ops.map((t) => (
            <OpCard key={t.id} t={t} onClick={() => onOpenOp(t)} />
          ))}
          {!ops.length && (
            <div className="rounded-lg border border-dashed py-12 text-center text-sm text-slate-400">
              Hết việc 🎉
            </div>
          )}
        </div>
      </section>

      {/* Queue phát triển */}
      <section>
        <div className="mb-2.5 px-1">
          <div className="text-sm font-semibold">Queue phát triển</div>
          <div className="text-xs text-slate-500">{dev.length} việc</div>
        </div>
        <div className="space-y-2.5">
          {dev.map((d) => (
            <DevCard key={d.id} d={d} />
          ))}
          {!dev.length && (
            <div className="rounded-lg border border-dashed py-12 text-center text-sm text-slate-400">
              Không có việc
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
