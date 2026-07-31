// TAB REVIEW TUẦN (§7 màn 1 — QUAN TRỌNG NHẤT). Nghiệm thu hàng loạt tại chỗ +
// gợi ý lát cắt hạng mục liên tục (KHÔNG auto-gen, phải click) + backlog chốt scope.
// Chạy housekeeping (auto-đóng >7 ngày, ngủ đông backlog) khi mở.
import { useEffect, useState } from 'react'
import {
  chayHousekeeping, listViecDangMo, listHangMuc, getBacklog, nghiemThu, duyetGiaHan, boHold, holdViec,
  holdQuaHan, type ViecFull, type HangMucFull, type YTuongFull,
} from '../../lib/giaoviec'
import { CX_BTN, CX_BTN_GHOST, Badge, VIEC_TT, Section, Empty, ErrBar, fmtNgay } from './ui'
import { NghiemThuModal, HuyModal, ChuyenModal } from './TaskActions'
import GiaoViecModal, { type GiaoPrefill } from './GiaoViecModal'

export default function ReviewTuanTab() {
  const [rows, setRows] = useState<ViecFull[]>([])
  const [hangMucs, setHangMucs] = useState<HangMucFull[]>([])
  const [backlog, setBacklog] = useState<YTuongFull[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [nghiemModal, setNghiemModal] = useState<ViecFull | null>(null)
  const [huyModal, setHuyModal] = useState<ViecFull | null>(null)
  const [chuyenModal, setChuyenModal] = useState<ViecFull | null>(null)
  const [giaoPrefill, setGiaoPrefill] = useState<GiaoPrefill | null>(null)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      await chayHousekeeping().catch(() => {})   // dọn trước khi đọc
      const [v, hm, b] = await Promise.all([listViecDangMo(), listHangMuc('dang_chay'), getBacklog()])
      setRows(v); setHangMucs(hm.filter((x) => x.kieu === 'lien_tuc')); setBacklog(b.items.slice(0, 8))
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  async function act(fn: () => Promise<void>, id: string) {
    setBusy(id); try { await fn(); await reload() } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  const choNghiem = rows.filter((r) => r.trang_thai === 'cho_nghiem_thu')
  const xinGiaHan = rows.filter((r) => r.gia_han_xin_deadline)
  const dangLam = rows.filter((r) => ['moi_giao', 'dang_lam', 'tra_lai'].includes(r.trang_thai))
  const holds = rows.filter((r) => r.trang_thai === 'hold')

  return (
    <div className="mx-auto max-w-[960px] space-y-5">
      <ErrBar msg={err} />
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <>
          {!!xinGiaHan.length && (
            <Section title={`Xin gia hạn chờ duyệt (${xinGiaHan.length})`} highlight>
              {xinGiaHan.map((v) => (
                <TaskRow key={v.id} v={v}>
                  <div className="text-[12px] text-slate-500">Xin dời tới <b>{fmtNgay(v.gia_han_xin_deadline)}</b>{v.gia_han_xin_ly_do && ` · ${v.gia_han_xin_ly_do}`}</div>
                  <div className="flex gap-1.5">
                    <button disabled={busy === v.id} onClick={() => act(() => duyetGiaHan(v.id, true), v.id)} className={CX_BTN}>Duyệt</button>
                    <button disabled={busy === v.id} onClick={() => act(() => duyetGiaHan(v.id, false), v.id)} className={CX_BTN_GHOST}>Từ chối</button>
                  </div>
                </TaskRow>
              ))}
            </Section>
          )}

          <Section title={`Chờ nghiệm thu (${choNghiem.length})`} highlight={choNghiem.length > 0}>
            {!choNghiem.length ? <Empty>Không có task nào chờ nghiệm thu.</Empty> : choNghiem.map((v) => (
              <TaskRow key={v.id} v={v}>
                <div className="flex gap-1.5">
                  <button disabled={busy === v.id} onClick={() => act(() => nghiemThu(v.id, { dat: true, chat_luong: 100 }), v.id)} className={CX_BTN}>✓ Đạt nhanh</button>
                  <button onClick={() => setNghiemModal(v)} className={CX_BTN_GHOST}>Nghiệm thu…</button>
                </div>
              </TaskRow>
            ))}
          </Section>

          <Section title={`Đang làm / mới giao (${dangLam.length})`}>
            {!dangLam.length ? <Empty>Không có task nào đang chạy.</Empty> : dangLam.map((v) => (
              <TaskRow key={v.id} v={v}>
                <LeaderMenu onHold={() => act(() => holdViec(v.id), v.id)} onHuy={() => setHuyModal(v)} onChuyen={() => setChuyenModal(v)} busy={busy === v.id} />
              </TaskRow>
            ))}
          </Section>

          {!!holds.length && (
            <Section title={`Đang hold (${holds.length})`}>
              {holds.map((v) => (
                <TaskRow key={v.id} v={v}>
                  {holdQuaHan(v.ngay_hold) && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Hold quá 3 tuần</span>}
                  <button disabled={busy === v.id} onClick={() => act(() => boHold(v.id), v.id)} className={CX_BTN_GHOST}>Bật lại</button>
                </TaskRow>
              ))}
            </Section>
          )}

          {/* Gợi ý lát cắt hạng mục liên tục — KHÔNG auto-gen, phải click (§3.2) */}
          <Section title={`Gợi ý lát cắt tuần này (${hangMucs.length} hạng mục liên tục)`}>
            {!hangMucs.length ? <Empty>Không có hạng mục liên tục nào đang chạy.</Empty> : hangMucs.map((hm) => (
              <div key={hm.id} className="flex items-center gap-3 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-3.5">
                <div className="min-w-0 flex-1 text-[13px] text-slate-700"><b>{hm.ten}</b> · đã ra {hm.so_lat_da_ra}{hm.pham_vi != null ? ` / ${hm.pham_vi}` : ''} · tạo lát tuần này?</div>
                <button onClick={() => setGiaoPrefill({ hang_muc_id: hm.id, tieu_de: `${hm.ten} — lát ${hm.so_lat_da_ra + 1}`, nguon: 'ke_hoach' })} className={CX_BTN}>+ Tạo task</button>
              </div>
            ))}
          </Section>

          {/* Backlog để chốt scope tuần */}
          <Section title={`Chốt scope từ backlog (top ${backlog.length})`}
            right={<button onClick={() => setGiaoPrefill({ nguon: 'phat_sinh' })} className={CX_BTN_GHOST}>+ Việc phát sinh</button>}>
            {!backlog.length ? <Empty>Backlog rỗng.</Empty> : backlog.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <span className="w-5 text-center text-[12px] font-semibold text-slate-300">{i + 1}</span>
                <div className="min-w-0 flex-1"><span className="font-medium text-slate-800">{r.tieu_de}</span> <span className="text-[11px] text-slate-400">GT{r.gia_tri ?? '—'}/C{r.co ?? '—'}</span></div>
                <button onClick={() => setGiaoPrefill({ y_tuong_id: r.id, tieu_de: r.tieu_de, nguon: 'ke_hoach' })} className={CX_BTN}>Giao</button>
              </div>
            ))}
          </Section>
        </>
      )}

      {nghiemModal && <NghiemThuModal v={nghiemModal} onClose={() => setNghiemModal(null)} onDone={() => { setNghiemModal(null); reload() }} />}
      {huyModal && <HuyModal v={huyModal} onClose={() => setHuyModal(null)} onDone={() => { setHuyModal(null); reload() }} />}
      {chuyenModal && <ChuyenModal v={chuyenModal} onClose={() => setChuyenModal(null)} onDone={() => { setChuyenModal(null); reload() }} />}
      {giaoPrefill && <GiaoViecModal prefill={giaoPrefill} onClose={() => setGiaoPrefill(null)} onDone={() => { setGiaoPrefill(null); reload() }} />}
    </div>
  )
}

function TaskRow({ v, children }: { v: ViecFull; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl bg-white p-3.5 shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{v.tieu_de}</span>
          <Badge map={VIEC_TT} k={v.trang_thai} />
          {v.hang_muc_ten && <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] text-violet-700">{v.hang_muc_ten}</span>}
          {v.nguon === 'phat_sinh' && <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] text-orange-700">phát sinh</span>}
        </div>
        <div className="mt-0.5 text-[12px] text-slate-500">
          {v.nguoi_lam_ten} · KL {v.khoi_luong}{v.deadline && <> · hạn {fmtNgay(v.deadline)}</>}
          {v.so_lan_tra_lai > 0 && <> · trả lại {v.so_lan_tra_lai}×</>}
          {v.so_lan_gia_han > 0 && <> · gia hạn {v.so_lan_gia_han}×</>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  )
}

function LeaderMenu({ onHold, onHuy, onChuyen, busy }: { onHold: () => void; onHuy: () => void; onChuyen: () => void; busy: boolean }) {
  return (
    <div className="flex gap-1">
      <button disabled={busy} onClick={onHold} className="rounded-md px-2 py-1 text-[11px] font-medium text-violet-600 hover:bg-violet-50">Hold</button>
      <button disabled={busy} onClick={onChuyen} className="rounded-md px-2 py-1 text-[11px] font-medium text-sky-600 hover:bg-sky-50">Chuyển</button>
      <button disabled={busy} onClick={onHuy} className="rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50">Huỷ</button>
    </div>
  )
}
