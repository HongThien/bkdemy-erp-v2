// TAB WEEKLY PLANNING (story §4-6). Bảng task 2 TẦNG: task MẸ (cụm card, container —
// KHÔNG tự làm việc) → task CON (1 người/con, luôn có đủ deadline/mục tiêu/output riêng).
// Mẹ LUÔN tách được thêm con, kể cả sau khi đã có con (không còn "gán 1 người" chốt cứng —
// Thùy chốt 08-13: đó là trường hợp con ĐẦU TIÊN, không phải hành động khác con sau).
// Mỗi task = 1 CARD ngang (Tên · PIC · Deadline · Trạng thái · %); click card mới ra Detail
// (mục tiêu/output/người giao + các nút hold/chuyển/huỷ/nghiệm thu) — card mặt ngoài gọn.
import { useEffect, useState } from 'react'
import {
  chayHousekeeping, listWeeklyPlanning, suaViec, duyetGiaHan, holdViec, boHold,
  holdQuaHan, type ViecFull,
} from '../../lib/giaoviec'
import { kyTuanHienTai, kyTuanCuaNgay, nhanKyTuan } from '../../lib/giaoviec-config'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Badge, VIEC_TT, Empty, ErrBar, Modal, Field, NguoiChip, DeadlineChip, fmtNgay } from './ui'
import { NghiemThuModal, HuyModal, ChuyenModal } from './TaskActions'
import GiaoViecModal, { type GiaoPrefill } from './GiaoViecModal'

export default function WeeklyPlanningTab() {
  const [ky, setKy] = useState(kyTuanHienTai())
  const [rows, setRows] = useState<ViecFull[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [giaoPrefill, setGiaoPrefill] = useState<GiaoPrefill | null>(null)
  const [meDetail, setMeDetail] = useState<ViecFull | null>(null)
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
  // Task mẹ = mọi root CHƯA gán trực tiếp (nguoi_lam_id null) — dù đã có con hay chưa, LUÔN
  // hiện dưới dạng cụm (kể cả 0 con) để "+ Tách task con" luôn có mặt, lặp lại được vô hạn.
  const parents = rows.filter((v) => !v.task_me_id && v.nguoi_lam_id === null)
  // Root ĐÃ gán trực tiếp (từ "+ Việc phát sinh") = task lẻ đơn giản, không cần cụm mẹ/con.
  const standalone = rows.filter((v) => !v.task_me_id && v.nguoi_lam_id !== null)

  function tachConPrefill(me: ViecFull): GiaoPrefill {
    return {
      task_me_id: me.id, title: `Tách task con — ${me.tieu_de}`,
      me: { tieu_de: me.tieu_de, muc_tieu: me.muc_tieu, output: me.output, loai_viec_id: me.loai_viec_id, ky_tuan: me.ky_tuan },
    }
  }

  return (
    <div className="mx-auto max-w-[1080px] space-y-4">
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
          {/* TASK MẸ — cụm card, luôn tách thêm con được */}
          {parents.map((me) => {
            const cons = conByMe.get(me.id) ?? []
            const dat = cons.filter((c) => c.trang_thai === 'dat').length
            return (
              <div key={me.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <button onClick={() => setMeDetail(me)} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-2 py-1.5 text-left hover:bg-slate-50">
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-white shrink-0">MẸ</span>
                  <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">{me.tieu_de}</span>
                  {me.y_tuong_tieu_de && <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700 shrink-0">từ backlog</span>}
                  <DeadlineChip deadline={me.deadline} />
                  <span className="w-20 shrink-0 text-right text-[12px] font-semibold text-slate-600">{cons.length ? `${dat}/${cons.length} đạt` : 'chưa có con'}</span>
                </button>
                <div className="mt-2 space-y-1.5 border-l-2 border-slate-100 pl-3">
                  {!cons.length ? <div className="py-1.5 text-[12px] italic text-slate-400">Chưa tách con nào.</div>
                    : cons.map((c) => <TaskCard key={c.id} v={c} onClick={() => setDetail(c)} />)}
                  <button onClick={() => setGiaoPrefill(tachConPrefill(me))} className="rounded-md border border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">+ Tách task con</button>
                </div>
              </div>
            )
          })}

          {/* TASK LẺ (phát sinh tại chỗ, không cần cụm mẹ/con) */}
          {standalone.map((v) => <TaskCard key={v.id} v={v} onClick={() => setDetail(v)} />)}
        </div>
      ))}

      {giaoPrefill && <GiaoViecModal prefill={giaoPrefill} onClose={() => setGiaoPrefill(null)} onDone={() => { setGiaoPrefill(null); reload() }} />}
      {meDetail && (
        <MeDetailModal
          v={rows.find((r) => r.id === meDetail.id) ?? meDetail}
          soCon={(conByMe.get(meDetail.id) ?? []).length}
          onClose={() => setMeDetail(null)}
          onTachCon={() => { setGiaoPrefill(tachConPrefill(meDetail)); setMeDetail(null) }}
          onSaved={reload}
        />
      )}
      {detail && (
        <TaskDetailModal
          v={rows.find((r) => r.id === detail.id) ?? detail}
          busy={busy === detail.id}
          onClose={() => setDetail(null)}
          onNghiemThu={() => { setNghiemModal(detail); setDetail(null) }}
          onHold={() => act(() => holdViec(detail.id), detail.id).then(() => setDetail(null))}
          onBoHold={() => act(() => boHold(detail.id), detail.id).then(() => setDetail(null))}
          onHuy={() => { setHuyModal(detail); setDetail(null) }}
          onChuyen={() => { setChuyenModal(detail); setDetail(null) }}
          onDuyetGH={(dongY) => act(() => duyetGiaHan(detail.id, dongY), detail.id).then(() => setDetail(null))}
        />
      )}
      {nghiemModal && <NghiemThuModal v={nghiemModal} onClose={() => setNghiemModal(null)} onDone={() => { setNghiemModal(null); reload() }} />}
      {huyModal && <HuyModal v={huyModal} onClose={() => setHuyModal(null)} onDone={() => { setHuyModal(null); reload() }} />}
      {chuyenModal && <ChuyenModal v={chuyenModal} onClose={() => setChuyenModal(null)} onDone={() => { setChuyenModal(null); reload() }} />}
    </div>
  )
}

// CARD ngang 1 task — Tên · PIC · Deadline · Trạng thái · % hoàn thành. Click → Detail.
function TaskCard({ v, onClick }: { v: ViecFull; onClick: () => void }) {
  const active = !['dat', 'huy', 'chuyen'].includes(v.trang_thai)
  const canhBao = (v.trang_thai === 'hold' && holdQuaHan(v.ngay_hold)) || !!v.gia_han_xin_deadline
  return (
    <button onClick={onClick} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl bg-white p-3.5 text-left shadow-sm transition hover:shadow-md">
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-800">{v.tieu_de}</span>
      <span className="w-36 shrink-0"><NguoiChip ten={v.nguoi_lam_ten} /></span>
      <span className="w-32 shrink-0"><DeadlineChip deadline={v.deadline} active={active} /></span>
      <span className="w-28 shrink-0 flex items-center gap-1">
        <Badge map={VIEC_TT} k={v.trang_thai} />
        {canhBao && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" title="Có việc cần xử lý (gia hạn chờ duyệt / hold quá hạn)" />}
      </span>
      <span className="w-14 shrink-0 text-right text-[12px] font-semibold text-slate-600">{v.phan_tram !== null ? `${v.phan_tram}%` : '—'}</span>
    </button>
  )
}

function TaskDetailModal({ v, busy, onClose, onNghiemThu, onHold, onBoHold, onHuy, onChuyen, onDuyetGH }: {
  v: ViecFull; busy: boolean; onClose: () => void
  onNghiemThu: () => void; onHold: () => void; onBoHold: () => void; onHuy: () => void; onChuyen: () => void
  onDuyetGH: (dongY: boolean) => void
}) {
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

        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
          {v.gia_han_xin_deadline && <>
            <span className="text-[11px] text-amber-600">Xin gia hạn → {fmtNgay(v.gia_han_xin_deadline)}</span>
            <button disabled={busy} onClick={() => onDuyetGH(true)} className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white">Duyệt</button>
            <button disabled={busy} onClick={() => onDuyetGH(false)} className="rounded-md px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100">Từ chối</button>
          </>}
          {v.trang_thai === 'cho_nghiem_thu' && <button onClick={onNghiemThu} className={CX_BTN}>Nghiệm thu</button>}
          {v.trang_thai === 'hold' && <>
            {holdQuaHan(v.ngay_hold) && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Hold &gt;3 tuần</span>}
            <button disabled={busy} onClick={onBoHold} className={CX_BTN_GHOST}>Bật lại</button>
          </>}
          {['moi_giao', 'dang_lam', 'tra_lai'].includes(v.trang_thai) && (
            <>
              <button disabled={busy} onClick={onHold} className="rounded-md px-2 py-1 text-[11px] text-violet-600 hover:bg-violet-50">Hold</button>
              <button onClick={onChuyen} className="rounded-md px-2 py-1 text-[11px] text-sky-600 hover:bg-sky-50">Chuyển</button>
              <button onClick={onHuy} className="rounded-md px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50">Huỷ</button>
            </>
          )}
        </div>
        <div className="flex justify-end pt-1"><button onClick={onClose} className={CX_BTN_GHOST}>Đóng</button></div>
      </div>
    </Modal>
  )
}

// DETAIL + SỬA task mẹ (container) — mục tiêu/output/deadline ở đây sẽ được các con
// "theo scope" kế thừa. Mẹ KHÔNG có PIC/khối lượng/trạng thái riêng (con mới là đơn vị làm).
function MeDetailModal({ v, soCon, onClose, onTachCon, onSaved }: {
  v: ViecFull; soCon: number; onClose: () => void; onTachCon: () => void; onSaved: () => void
}) {
  const [sua, setSua] = useState(false)
  const [mt, setMt] = useState(v.muc_tieu ?? ''); const [out, setOut] = useState(v.output ?? ''); const [dl, setDl] = useState(v.deadline ?? '')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)

  async function luu() {
    setSaving(true); setErr(null)
    try { await suaViec(v.id, { muc_tieu: mt.trim() || undefined, output: out.trim() || undefined, deadline: dl || null }); setSua(false); onSaved() }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  const Row = ({ k, val }: { k: string; val: React.ReactNode }) => (
    <div className="flex gap-2 text-[13px]"><span className="w-24 shrink-0 text-slate-400">{k}</span><span className="text-slate-700">{val || '—'}</span></div>
  )

  return (
    <Modal title={`Task mẹ — ${v.tieu_de}`} onClose={onClose} wide>
      <div className="space-y-2">
        <p className="text-[12px] text-slate-500">Container — không tự làm, gồm {soCon} task con. Mục tiêu/output ở đây là CHUẨN CHUNG mà con "theo scope" sẽ kế thừa.</p>
        {v.y_tuong_tieu_de && <p className="text-[11px] text-indigo-600">Từ backlog: {v.y_tuong_tieu_de}</p>}
        {!sua ? (
          <>
            <Row k="Mục tiêu" val={v.muc_tieu} />
            <Row k="Output" val={v.output} />
            <Row k="Deadline" val={fmtNgay(v.deadline)} />
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setSua(true)} className={CX_BTN_GHOST}>Sửa mục tiêu/output/deadline</button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Mục tiêu"><input value={mt} onChange={(e) => setMt(e.target.value)} className={CX_INPUT} /></Field>
              <Field label="Output"><input value={out} onChange={(e) => setOut(e.target.value)} className={CX_INPUT} /></Field>
            </div>
            <Field label="Deadline (mốc tổng của cụm — mỗi con vẫn có deadline riêng)"><input type="date" value={dl} onChange={(e) => setDl(e.target.value)} className={CX_INPUT} /></Field>
            {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
            <div className="flex justify-end gap-2"><button onClick={() => setSua(false)} className={CX_BTN_GHOST}>Thôi</button><button disabled={saving} onClick={luu} className={CX_BTN}>{saving ? '…' : 'Lưu'}</button></div>
          </div>
        )}
        <div className="flex justify-between border-t border-slate-100 pt-3">
          <button onClick={onTachCon} className="rounded-md border border-indigo-300 px-2.5 py-1.5 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">+ Tách task con</button>
          <button onClick={onClose} className={CX_BTN_GHOST}>Đóng</button>
        </div>
      </div>
    </Modal>
  )
}
