// TAB WEEKLY PLANNING (story §4-6). Bảng task 2 TẦNG: task MẸ (cụm card) → task CON
// (1 người/con). Task lẻ = card đơn. Hiện người làm · deadline · tiến độ; Detail xem
// mục tiêu/output/evidence. Nguồn task: từ backlog (Xác nhận) hoặc phát sinh tại chỗ.
import { useEffect, useState } from 'react'
import {
  chayHousekeeping, listWeeklyPlanning, ganNguoiLam, listNguoiDuocGiao, duyetGiaHan, holdViec, boHold,
  holdQuaHan, type ViecFull, type NguoiDuocGiao,
} from '../../lib/giaoviec'
import { kyTuanHienTai, kyTuanCuaNgay, nhanKyTuan } from '../../lib/giaoviec-config'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Badge, VIEC_TT, Empty, ErrBar, Modal, Field, Pill, fmtNgay } from './ui'
import { NghiemThuModal, HuyModal, ChuyenModal } from './TaskActions'
import GiaoViecModal, { type GiaoPrefill } from './GiaoViecModal'

export default function WeeklyPlanningTab() {
  const [ky, setKy] = useState(kyTuanHienTai())
  const [rows, setRows] = useState<ViecFull[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [giaoPrefill, setGiaoPrefill] = useState<GiaoPrefill | null>(null)
  const [ganModal, setGanModal] = useState<ViecFull | null>(null)
  const [detail, setDetail] = useState<ViecFull | null>(null)
  const [nghiemModal, setNghiemModal] = useState<ViecFull | null>(null)
  const [huyModal, setHuyModal] = useState<ViecFull | null>(null)
  const [chuyenModal, setChuyenModal] = useState<ViecFull | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try { await chayHousekeeping().catch(() => {}); setRows(await listWeeklyPlanning(ky)) }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [ky])

  async function act(fn: () => Promise<void>, id: string) {
    setBusy(id); try { await fn(); await reload() } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  function dichTuan(d: number) {
    const [y, m, dd] = ky.split('-').map(Number); const dt = new Date(Date.UTC(y, m - 1, dd)); dt.setUTCDate(dt.getUTCDate() + d * 7)
    setKy(kyTuanCuaNgay(`${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`))
  }

  const conByMe = new Map<string, ViecFull[]>()
  for (const v of rows) if (v.task_me_id) { const a = conByMe.get(v.task_me_id) ?? []; a.push(v); conByMe.set(v.task_me_id, a) }
  const parents = rows.filter((v) => !v.task_me_id && (v.so_con ?? 0) > 0)
  const standalone = rows.filter((v) => !v.task_me_id && (v.so_con ?? 0) === 0)

  const leafActions = (v: ViecFull) => (
    <div className="flex flex-wrap items-center gap-1.5">
      {v.gia_han_xin_deadline && <>
        <span className="text-[11px] text-amber-600">Xin GH {fmtNgay(v.gia_han_xin_deadline)}</span>
        <button disabled={busy === v.id} onClick={() => act(() => duyetGiaHan(v.id, true), v.id)} className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white">Duyệt</button>
        <button disabled={busy === v.id} onClick={() => act(() => duyetGiaHan(v.id, false), v.id)} className="rounded-md px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100">Từ chối</button>
      </>}
      {v.trang_thai === 'cho_nghiem_thu' && <button onClick={() => setNghiemModal(v)} className={CX_BTN}>Nghiệm thu</button>}
      {v.trang_thai === 'hold' && <>
        {holdQuaHan(v.ngay_hold) && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Hold &gt;3 tuần</span>}
        <button disabled={busy === v.id} onClick={() => act(() => boHold(v.id), v.id)} className={CX_BTN_GHOST}>Bật lại</button>
      </>}
      <button onClick={() => setDetail(v)} className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100">Detail</button>
      {['moi_giao', 'dang_lam', 'tra_lai'].includes(v.trang_thai) && (
        <>
          <button disabled={busy === v.id} onClick={() => act(() => holdViec(v.id), v.id)} className="rounded-md px-2 py-1 text-[11px] text-violet-600 hover:bg-violet-50">Hold</button>
          <button onClick={() => setChuyenModal(v)} className="rounded-md px-2 py-1 text-[11px] text-sky-600 hover:bg-sky-50">Chuyển</button>
          <button onClick={() => setHuyModal(v)} className="rounded-md px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50">Huỷ</button>
        </>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-[980px] space-y-4">
      <ErrBar msg={err} />
      <div className="flex items-center gap-2">
        <button onClick={() => dichTuan(-1)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">‹</button>
        <span className="text-sm font-semibold text-slate-800">{nhanKyTuan(ky)}</span>
        <button onClick={() => dichTuan(1)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">›</button>
        {ky !== kyTuanHienTai() && <button onClick={() => setKy(kyTuanHienTai())} className="text-[12px] text-indigo-600 hover:underline">tuần này</button>}
        <button onClick={() => setGiaoPrefill({ nguon: 'phat_sinh', title: 'Việc phát sinh (tạo tại chỗ)' })} className={`${CX_BTN} ml-auto`}>+ Việc phát sinh</button>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (!rows.length ? (
        <Empty>Tuần này chưa có việc. Sang tab Backlog tick chọn + Xác nhận, hoặc bấm "+ Việc phát sinh".</Empty>
      ) : (
        <div className="space-y-4">
          {/* TASK MẸ — cụm card */}
          {parents.map((me) => {
            const cons = conByMe.get(me.id) ?? []
            const dat = cons.filter((c) => c.trang_thai === 'dat').length
            return (
              <div key={me.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-white">MẸ</span>
                  <span className="font-semibold text-slate-800">{me.tieu_de}</span>
                  <span className="text-[12px] text-slate-500">· {dat}/{cons.length} con đạt</span>
                  {me.y_tuong_tieu_de && <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700">từ backlog</span>}
                  <button onClick={() => setGiaoPrefill({ task_me_id: me.id, title: `Tách task con — ${me.tieu_de}` })} className="ml-auto rounded-md border border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">+ Tách task con</button>
                </div>
                <div className="mt-2 space-y-1.5 border-l-2 border-slate-100 pl-3">
                  {!cons.length ? <div className="py-2 text-[12px] italic text-slate-400">Chưa tách con nào — bấm "+ Tách task con".</div>
                    : cons.map((c) => <LeafRow key={c.id} v={c} actions={leafActions(c)} />)}
                </div>
              </div>
            )
          })}

          {/* TASK LẺ / CHƯA GÁN */}
          {standalone.map((v) => v.nguoi_lam_id ? (
            <LeafRow key={v.id} v={v} card actions={leafActions(v)} />
          ) : (
            <div key={v.id} className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 p-3.5">
              <span className="font-semibold text-slate-800">{v.tieu_de}</span>
              {v.y_tuong_tieu_de && <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700">từ backlog</span>}
              <span className="text-[12px] text-amber-700">· chưa gán — chọn cách làm:</span>
              <div className="ml-auto flex gap-1.5">
                <button onClick={() => setGanModal(v)} className={CX_BTN}>Gán 1 người</button>
                <button onClick={() => setGiaoPrefill({ task_me_id: v.id, title: `Tách task con — ${v.tieu_de}` })} className={CX_BTN_GHOST}>Tách nhiều con</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {giaoPrefill && <GiaoViecModal prefill={giaoPrefill} onClose={() => setGiaoPrefill(null)} onDone={() => { setGiaoPrefill(null); reload() }} />}
      {ganModal && <GanModal v={ganModal} onClose={() => setGanModal(null)} onDone={() => { setGanModal(null); reload() }} />}
      {detail && <TaskDetailModal v={detail} onClose={() => setDetail(null)} />}
      {nghiemModal && <NghiemThuModal v={nghiemModal} onClose={() => setNghiemModal(null)} onDone={() => { setNghiemModal(null); reload() }} />}
      {huyModal && <HuyModal v={huyModal} onClose={() => setHuyModal(null)} onDone={() => { setHuyModal(null); reload() }} />}
      {chuyenModal && <ChuyenModal v={chuyenModal} onClose={() => setChuyenModal(null)} onDone={() => { setChuyenModal(null); reload() }} />}
    </div>
  )
}

function LeafRow({ v, actions, card }: { v: ViecFull; actions?: React.ReactNode; card?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${card ? 'rounded-2xl bg-white p-3.5 shadow-sm' : 'py-1.5'}`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-slate-800">{v.tieu_de}</span>
          <Badge map={VIEC_TT} k={v.trang_thai} />
          {v.phan_tram !== null && <span className="text-[11px] font-semibold text-slate-600">{v.phan_tram}%</span>}
        </div>
        <div className="text-[11px] text-slate-500">
          {v.nguoi_lam_ten ?? '—'} · KL {v.khoi_luong}{v.deadline && ` · hạn ${fmtNgay(v.deadline)}`}
          {v.so_lan_tra_lai > 0 && ` · trả ${v.so_lan_tra_lai}×`}
        </div>
      </div>
      {actions}
    </div>
  )
}

function GanModal({ v, onClose, onDone }: { v: ViecFull; onClose: () => void; onDone: () => void }) {
  const [nguoi, setNguoi] = useState<NguoiDuocGiao[]>([])
  const [id, setId] = useState(''); const [kl, setKl] = useState<number | ''>(1); const [dl, setDl] = useState('')
  const [mt, setMt] = useState(''); const [out, setOut] = useState('')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)
  useEffect(() => { listNguoiDuocGiao().then(setNguoi).catch(() => {}) }, [])
  async function submit() {
    if (!id || kl === '') { setErr('Cần người làm + khối lượng.'); return }
    setSaving(true); setErr(null)
    try { await ganNguoiLam(v.id, { nguoi_lam_id: id, khoi_luong: Number(kl), deadline: dl || null, muc_tieu: mt.trim() || undefined, output: out.trim() || undefined }); onDone() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  return (
    <Modal title={`Gán người — ${v.tieu_de}`} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Người làm (1 người)"><div className="flex flex-wrap gap-1.5">{nguoi.map((n) => <Pill key={n.nhan_su_id} on={id === n.nhan_su_id} onClick={() => setId(n.nhan_su_id)}>{n.ho_ten}</Pill>)}</div></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Khối lượng"><input type="number" value={kl} onChange={(e) => setKl(e.target.value === '' ? '' : Number(e.target.value))} className={CX_INPUT} /></Field>
          <Field label="Deadline"><input type="date" value={dl} onChange={(e) => setDl(e.target.value)} className={CX_INPUT} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Mục tiêu"><input value={mt} onChange={(e) => setMt(e.target.value)} className={CX_INPUT} /></Field>
          <Field label="Output"><input value={out} onChange={(e) => setOut(e.target.value)} className={CX_INPUT} /></Field>
        </div>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button><button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? '…' : 'Gán'}</button></div>
      </div>
    </Modal>
  )
}

function TaskDetailModal({ v, onClose }: { v: ViecFull; onClose: () => void }) {
  const Row = ({ k, val }: { k: string; val: React.ReactNode }) => (
    <div className="flex gap-2 text-[13px]"><span className="w-28 shrink-0 text-slate-400">{k}</span><span className="text-slate-700">{val || '—'}</span></div>
  )
  return (
    <Modal title={v.tieu_de} onClose={onClose}>
      <div className="space-y-1.5">
        <Row k="Trạng thái" val={<Badge map={VIEC_TT} k={v.trang_thai} />} />
        <Row k="Người làm" val={v.nguoi_lam_ten} />
        <Row k="Người giao" val={v.nguoi_giao_ten} />
        <Row k="Khối lượng" val={v.khoi_luong} />
        <Row k="Mục tiêu" val={v.muc_tieu} />
        <Row k="Output" val={v.output} />
        <Row k="Deadline" val={<>{fmtNgay(v.deadline)}{v.deadline_goc && v.deadline !== v.deadline_goc && <span className="ml-1 text-[11px] text-slate-400">(gốc {fmtNgay(v.deadline_goc)})</span>}</>} />
        <Row k="Gia hạn / Trả lại" val={`${v.so_lan_gia_han}× / ${v.so_lan_tra_lai}×`} />
        <Row k="Bằng chứng" val={v.evidence ? <a href={v.evidence} target="_blank" rel="noreferrer" className="text-indigo-600 underline break-all">{v.evidence}</a> : '—'} />
        {v.phan_tram !== null && <Row k="Kết quả" val={`${v.phan_tram}% (tiến độ ${v.tien_do} · chất lượng ${v.chat_luong})`} />}
        {v.ghi_chu_nghiem_thu && <Row k="Ghi chú" val={v.ghi_chu_nghiem_thu} />}
        <div className="flex justify-end pt-2"><button onClick={onClose} className={CX_BTN_GHOST}>Đóng</button></div>
      </div>
    </Modal>
  )
}
