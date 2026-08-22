// TAB VIỆC CỦA TÔI (§7 màn 3 — cá nhân). Task tôi làm: bắt đầu, hoàn thành (đính
// evidence bắt buộc), xin gia hạn (1 lần, trước hạn), gửi lại khi bị trả lại.
// + hiệu suất kỳ (2 trục), sản lượng, tỉ trọng vận-hành:phát-triển.
import { useEffect, useState } from 'react'
import {
  listViecCuaToi, listTaskCon, listCapNhat, themCapNhat, tinhHieuSuatThang,
  batDauLam, banHoanThanh, guiLaiNghiemThu, xinGiaHan, holdViec, boHold, duyetGiaHan,
  type ViecFull, type HieuSuatKy, type CapNhatViec,
} from '../../lib/giaoviec'
import { thangCuaKyTuan, kyTuanHienTai } from '../../lib/giaoviec-config'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Badge, VIEC_TT, Section, Empty, ErrBar, Stat, Modal, Field, fmtNgay } from './ui'
import GiaoViecModal, { type GiaoPrefill } from './GiaoViecModal'
import { TaskDetailModal } from './WeeklyPlanningTab'
import { NghiemThuModal, HuyModal, ChuyenModal } from './TaskActions'

export default function VietCuaToiTab({ nhanSuId }: { nhanSuId: string }) {
  const [rows, setRows] = useState<ViecFull[]>([])
  const [hs, setHs] = useState<HieuSuatKy | null>(null)
  const [loading, setLoading] = useState(true); const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [htModal, setHtModal] = useState<ViecFull | null>(null)
  const [ghModal, setGhModal] = useState<ViecFull | null>(null)
  const [giaoPrefill, setGiaoPrefill] = useState<GiaoPrefill | null>(null)
  // Quản lý TASK CON (story: nhân sự toàn quyền sửa/nghiệm thu/hold/chuyển/huỷ con của mình,
  // không cần vào màn admin "Tạo & giao việc phát triển" — màn đó nhiều nhân sự không có quyền vào).
  const [conDetail, setConDetail] = useState<ViecFull | null>(null)
  const [conNghiem, setConNghiem] = useState<ViecFull | null>(null)
  const [conHuy, setConHuy] = useState<ViecFull | null>(null)
  const [conChuyen, setConChuyen] = useState<ViecFull | null>(null)
  const [conBusy, setConBusy] = useState<string | null>(null)
  const [conVersion, setConVersion] = useState(0)   // bump → mọi ConCumSection đang mở tự tải lại
  const thang = thangCuaKyTuan(kyTuanHienTai())

  async function reload() {
    setLoading(true); setErr(null)
    try { const [r, h] = await Promise.all([listViecCuaToi(nhanSuId), tinhHieuSuatThang(nhanSuId, thang)]); setRows(r); setHs(h) }
    catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [nhanSuId])

  async function act(fn: () => Promise<void>, id: string) {
    setBusy(id); try { await fn(); await reload() } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  async function actCon(fn: () => Promise<void>, id: string) {
    setConBusy(id)
    try { await fn(); setConVersion((n) => n + 1); await reload() }
    catch (e: any) { setErr(e?.message ?? String(e)) }
    finally { setConBusy(null) }
  }

  const dangLam = rows.filter((r) => ['moi_giao', 'dang_lam', 'cho_nghiem_thu', 'tra_lai'].includes(r.trang_thai))
  const daDong = rows.filter((r) => ['dat', 'huy', 'chuyen'].includes(r.trang_thai))

  // Tách task con (story 08-18 "phân cấp"): CHỈ task LẺ/GỐC (không phải bản thân đã là con —
  // cây chỉ 2 tầng) mới tách được. Task đã có con → trạng thái tự đóng theo con (mig
  // giaoviec_auto_dong_task_me), không còn nút thao tác tay riêng — xem ConCumSection.
  function tachConPrefill(v: ViecFull): GiaoPrefill {
    return {
      task_me_id: v.id, title: `Tách task con — ${v.tieu_de}`,
      me: { tieu_de: v.tieu_de, muc_tieu: v.muc_tieu, output: v.output, loai_viec_id: v.loai_viec_id, ky_tuan: v.ky_tuan },
    }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <ErrBar msg={err} />
      {hs && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label={`Hiệu suất tháng ${thang}`} value={hs.hieuSuat === null ? '—' : `${hs.hieuSuat}%`} accent="text-indigo-600" />
          <Stat label="Sản lượng (Σ khối lượng)" value={hs.sanLuong} />
          <Stat label="Tiến độ / Chất lượng TB" value={<span className="text-lg">{hs.trungBinhTienDo ?? '—'} / {hs.trungBinhChatLuong ?? '—'}</span>} />
          <Stat label="Đạt / Trả lại" value={<span>{hs.soViecDat} <span className="text-rose-500 text-lg">/ {hs.soViecTraLai}</span></span>} />
        </div>
      )}
      <div className="rounded-xl bg-white px-4 py-2 text-[12px] text-slate-500 shadow-sm">Tỉ trọng: <b className="text-indigo-600">Phát triển 100%</b> · Vận hành 0% <span className="text-slate-400">(v1 chỉ đo phát triển — nối vận hành sau)</span></div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <>
          <Section title={`Đang làm (${dangLam.length})`}>
            {!dangLam.length ? <Empty>Không có việc phát triển nào đang chờ.</Empty> : dangLam.map((v) => {
              const coCon = !v.task_me_id && !!v.so_con    // đã có con → trạng thái tự đóng theo con, ẩn nút thao tác tay
              return (
                <MyTaskCard key={v.id} v={v} conVersion={conVersion} onOpenCon={setConDetail}>
                  {!coCon && v.trang_thai === 'moi_giao' && <button disabled={busy === v.id} onClick={() => act(() => batDauLam(v.id), v.id)} className={CX_BTN}>Bắt đầu làm</button>}
                  {!coCon && v.trang_thai === 'dang_lam' && <>
                    <button disabled={busy === v.id} onClick={() => setHtModal(v)} className={CX_BTN}>✓ Hoàn thành</button>
                    {!v.gia_han_xin_deadline && v.so_lan_gia_han < 1 && <button onClick={() => setGhModal(v)} className={CX_BTN_GHOST}>Xin gia hạn</button>}
                    {v.gia_han_xin_deadline && <span className="text-[11px] text-amber-600">Đã xin gia hạn, chờ duyệt</span>}
                  </>}
                  {!coCon && v.trang_thai === 'cho_nghiem_thu' && <span className="text-[12px] text-amber-600">Chờ {v.nguoi_giao_ten} nghiệm thu…</span>}
                  {!coCon && v.trang_thai === 'tra_lai' && <button disabled={busy === v.id} onClick={() => setHtModal(v)} className={CX_BTN}>Gửi lại nghiệm thu</button>}
                  {!v.task_me_id && <button onClick={() => setGiaoPrefill(tachConPrefill(v))} className="rounded-md border border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">+ Tách task con</button>}
                </MyTaskCard>
              )
            })}
          </Section>
          <Section title={`Đã đóng (${daDong.length})`}>
            {!daDong.length ? <Empty>Chưa có việc nào đóng.</Empty> : daDong.map((v) => <MyTaskCard key={v.id} v={v} conVersion={conVersion} onOpenCon={setConDetail} />)}
          </Section>
        </>
      )}

      {htModal && <HoanThanhModal v={htModal} laGuiLai={htModal.trang_thai === 'tra_lai'}
        onClose={() => setHtModal(null)}
        onDone={(ev) => act(() => (htModal.trang_thai === 'tra_lai' ? guiLaiNghiemThu(htModal.id, ev) : banHoanThanh(htModal.id, ev)), htModal.id).then(() => setHtModal(null))} />}
      {ghModal && <GiaHanModal v={ghModal} onClose={() => setGhModal(null)}
        onDone={(dl, ly) => act(() => xinGiaHan(ghModal.id, dl, ly), ghModal.id).then(() => setGhModal(null))} />}
      {giaoPrefill && <GiaoViecModal prefill={giaoPrefill} onClose={() => setGiaoPrefill(null)} onDone={() => { setGiaoPrefill(null); setConVersion((n) => n + 1); reload() }} />}
      {conDetail && (
        <TaskDetailModal
          v={conDetail}
          busy={conBusy === conDetail.id}
          onClose={() => setConDetail(null)}
          onNghiemThu={() => { setConNghiem(conDetail); setConDetail(null) }}
          onHold={() => actCon(() => holdViec(conDetail.id), conDetail.id).then(() => setConDetail(null))}
          onBoHold={() => actCon(() => boHold(conDetail.id), conDetail.id).then(() => setConDetail(null))}
          onHuy={() => { setConHuy(conDetail); setConDetail(null) }}
          onChuyen={() => { setConChuyen(conDetail); setConDetail(null) }}
          onDuyetGH={(dongY) => actCon(() => duyetGiaHan(conDetail.id, dongY), conDetail.id).then(() => setConDetail(null))}
          onSaved={() => { setConVersion((n) => n + 1); reload() }}
        />
      )}
      {conNghiem && <NghiemThuModal v={conNghiem} onClose={() => setConNghiem(null)} onDone={() => { setConNghiem(null); setConVersion((n) => n + 1); reload() }} />}
      {conHuy && <HuyModal v={conHuy} onClose={() => setConHuy(null)} onDone={() => { setConHuy(null); setConVersion((n) => n + 1); reload() }} />}
      {conChuyen && <ChuyenModal v={conChuyen} onClose={() => setConChuyen(null)} onDone={() => { setConChuyen(null); setConVersion((n) => n + 1); reload() }} />}
    </div>
  )
}

function MyTaskCard({ v, conVersion, onOpenCon, children }: {
  v: ViecFull; conVersion?: number; onOpenCon?: (c: ViecFull) => void; children?: React.ReactNode
}) {
  const coCon = !v.task_me_id && !!v.so_con
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{v.tieu_de}</span>
            <Badge map={VIEC_TT} k={v.trang_thai} />
            {v.phan_tram !== null && <span className="text-[12px] font-semibold text-slate-700">{v.phan_tram}%</span>}
          </div>
          <div className="mt-0.5 text-[12px] text-slate-500">
            Giao bởi {v.nguoi_giao_ten} · KL {v.khoi_luong}{v.deadline && <> · hạn {fmtNgay(v.deadline)}</>}
          </div>
          {/* Đọc đầy đủ thông tin leader viết lúc giao — trước đây chỉ hiện output, thiếu mục tiêu. */}
          {v.muc_tieu && <div className="mt-0.5 text-[12px] text-slate-600">🎯 {v.muc_tieu}</div>}
          {v.output && <div className="mt-0.5 text-[12px] text-slate-600">📦 Output cần nộp: {v.output}</div>}
          {v.trang_thai === 'tra_lai' && v.ghi_chu_nghiem_thu && <div className="mt-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[12px] text-rose-600">Bị trả lại: {v.ghi_chu_nghiem_thu}</div>}
          {v.trang_thai === 'dat' && <div className="mt-1 text-[11px] text-slate-400">Tiến độ {v.tien_do} · Chất lượng {v.chat_luong}</div>}
          {coCon && <ConCumSection v={v} refreshKey={conVersion ?? 0} onOpenCon={onOpenCon!} />}
          {!coCon && !['dat', 'huy', 'chuyen'].includes(v.trang_thai) && <CapNhatSection v={v} />}
        </div>
        {children && <div className="flex shrink-0 items-center gap-1.5">{children}</div>}
      </div>
    </div>
  )
}

// Cụm task con (story 08-18): đếm sẵn có trong v.so_con/so_con_dat (decorateViec); danh sách
// từng con fetch khi bấm xem, tải lại khi refreshKey đổi (sau mọi hành động sửa/nghiệm thu/
// hold/chuyển/huỷ trên 1 con nào đó — con giao người khác nên KHÔNG nằm trong listViecCuaToi).
// Click 1 dòng con → mở TaskDetailModal đầy đủ: người tạo task mẹ TOÀN QUYỀN quản lý con,
// không cần vào màn admin (nhiều nhân sự không có quyền vào màn đó).
function ConCumSection({ v, refreshKey, onOpenCon }: { v: ViecFull; refreshKey: number; onOpenCon: (c: ViecFull) => void }) {
  const [mo, setMo] = useState(false)
  const [con, setCon] = useState<ViecFull[] | null>(null)
  const [dangTai, setDangTai] = useState(false)
  useEffect(() => { if (mo) { setDangTai(true); listTaskCon(v.id).then(setCon).finally(() => setDangTai(false)) } }, [mo, v.id, refreshKey])
  return (
    <div className="mt-1.5">
      <button onClick={() => setMo((x) => !x)} className="text-[12px] font-medium text-indigo-600 hover:underline">
        {v.trang_thai === 'dat' ? '✓ ' : ''}Đã tách {v.so_con} task con · {v.so_con_dat}/{v.so_con} đạt {mo ? '▲' : '▼'}
      </button>
      {mo && (
        <div className="mt-1.5 space-y-1 border-l-2 border-slate-100 pl-3">
          {dangTai ? <div className="text-[12px] text-slate-400">Đang tải…</div> :
            (con ?? []).map((c) => (
              <button key={c.id} onClick={() => onOpenCon(c)} className="flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md px-1.5 py-1 text-left text-[12px] hover:bg-slate-50">
                <span className="text-slate-700">{c.tieu_de}</span>
                <span className="text-slate-400">· {c.nguoi_lam_ten ?? 'chưa gán'}</span>
                <Badge map={VIEC_TT} k={c.trang_thai} />
                {c.deadline && <span className="text-slate-400">hạn {fmtNgay(c.deadline)}</span>}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

// Cập nhật tiến độ trong lúc làm (story 08-18) — TƯỜNG THUẬT của người làm, khác hẳn
// v.tien_do (điểm máy chấm lúc nghiệm thu). Append-only: mỗi lần gửi thêm 1 dòng mới,
// không sửa dòng cũ — history hiện đủ để leader theo dõi cả quá trình, không chỉ bản mới nhất.
function CapNhatSection({ v }: { v: ViecFull }) {
  const [mo, setMo] = useState(false)
  const [ds, setDs] = useState<CapNhatViec[] | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const [noiDung, setNoiDung] = useState('')
  const [tienDo, setTienDo] = useState<number | ''>('')
  const [gui, setGui] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function taiLai() {
    setDangTai(true)
    try { setDs(await listCapNhat(v.id)) } finally { setDangTai(false) }
  }
  async function toggle() {
    if (mo) { setMo(false); return }
    setMo(true)
    if (!ds) await taiLai()
  }
  async function submit() {
    if (!noiDung.trim()) { setErr('Ghi ít nhất 1 câu tình hình hôm nay.'); return }
    setGui(true); setErr(null)
    try {
      await themCapNhat(v.id, { noiDung, tienDoBaoCao: tienDo === '' ? null : tienDo })
      setNoiDung(''); setTienDo(''); await taiLai()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setGui(false) }
  }

  const moiNhat = ds?.[0]
  return (
    <div className="mt-1.5">
      <button onClick={toggle} className="text-[12px] font-medium text-indigo-600 hover:underline">
        📝 Cập nhật tiến độ{moiNhat?.tien_do_bao_cao != null ? ` · ${moiNhat.tien_do_bao_cao}%` : ''} {mo ? '▲' : '▼'}
      </button>
      {mo && (
        <div className="mt-1.5 space-y-2 border-l-2 border-slate-100 pl-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[200px] flex-1">
              <textarea value={noiDung} onChange={(e) => setNoiDung(e.target.value)} rows={2} placeholder="Hôm nay làm gì, còn vướng gì…"
                className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[12.5px] outline-none focus:border-indigo-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <input type="number" min={0} max={100} value={tienDo} onChange={(e) => setTienDo(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="%" className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-[12.5px] outline-none focus:border-indigo-400" />
              <button disabled={gui} onClick={submit} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40">Gửi</button>
            </div>
          </div>
          {err && <div className="text-[11px] text-rose-600">{err}</div>}
          {dangTai ? <div className="text-[12px] text-slate-400">Đang tải…</div> :
            !ds?.length ? <div className="text-[12px] italic text-slate-400">Chưa có cập nhật nào.</div> :
            ds.map((c) => (
              <div key={c.id} className="text-[12px]">
                <span className="text-slate-400">{fmtNgay(c.created_at)}{c.tien_do_bao_cao != null && <> · {c.tien_do_bao_cao}%</>}</span>
                <span className="ml-1.5 text-slate-700">{c.noi_dung}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

function HoanThanhModal({ v, laGuiLai, onClose, onDone }: { v: ViecFull; laGuiLai: boolean; onClose: () => void; onDone: (ev: string) => void }) {
  const [ev, setEv] = useState(v.evidence ?? ''); const [err, setErr] = useState<string | null>(null)
  return (
    <Modal title={laGuiLai ? 'Gửi lại nghiệm thu' : 'Báo hoàn thành'} onClose={onClose}>
      <div className="space-y-3">
        <div className="text-[12px] text-slate-500">{v.tieu_de}{v.output && <> · cần output: <b>{v.output}</b></>}</div>
        <Field label="Bằng chứng (ảnh/file/link) — BẮT BUỘC">
          <input value={ev} onChange={(e) => setEv(e.target.value)} className={CX_INPUT} placeholder="https://... hoặc mô tả file" />
        </Field>
        <p className="text-[11px] text-slate-400">Người làm tự đính bằng chứng — leader chỉ xác nhận, không phải đi tìm.</p>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button>
          <button onClick={() => { if (!ev.trim()) { setErr('Phải đính bằng chứng.'); return } onDone(ev.trim()) }} className={CX_BTN}>Gửi nghiệm thu</button></div>
      </div>
    </Modal>
  )
}

function GiaHanModal({ v, onClose, onDone }: { v: ViecFull; onClose: () => void; onDone: (dl: string, ly: string) => void }) {
  const [dl, setDl] = useState(''); const [ly, setLy] = useState(''); const [err, setErr] = useState<string | null>(null)
  return (
    <Modal title="Xin gia hạn" onClose={onClose}>
      <div className="space-y-3">
        <div className="text-[12px] text-slate-500">{v.tieu_de} · hạn hiện tại {fmtNgay(v.deadline)}. Chỉ xin được TRƯỚC hạn, tối đa 1 lần. Deadline gốc luôn được lưu.</div>
        <Field label="Deadline mới"><input type="date" value={dl} onChange={(e) => setDl(e.target.value)} className={CX_INPUT} /></Field>
        <Field label="Lý do"><textarea value={ly} onChange={(e) => setLy(e.target.value)} className={CX_INPUT} rows={2} /></Field>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button>
          <button onClick={() => { if (!dl) { setErr('Chọn deadline mới.'); return } onDone(dl, ly.trim()) }} className={CX_BTN}>Gửi yêu cầu</button></div>
      </div>
    </Modal>
  )
}
