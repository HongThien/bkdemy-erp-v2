// TAB VIỆC CỦA TÔI (§7 màn 3 — cá nhân). Task tôi làm: bắt đầu, hoàn thành (đính
// evidence bắt buộc), xin gia hạn (1 lần, trước hạn), gửi lại khi bị trả lại.
// + hiệu suất kỳ (2 trục), sản lượng, tỉ trọng vận-hành:phát-triển.
import { useEffect, useState } from 'react'
import {
  listViecCuaToi, tinhHieuSuatThang, batDauLam, banHoanThanh, guiLaiNghiemThu, xinGiaHan,
  type ViecFull, type HieuSuatKy,
} from '../../lib/giaoviec'
import { thangCuaKyTuan, kyTuanHienTai } from '../../lib/giaoviec-config'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Badge, VIEC_TT, Section, Empty, ErrBar, Stat, Modal, Field, fmtNgay } from './ui'

export default function VietCuaToiTab({ nhanSuId }: { nhanSuId: string }) {
  const [rows, setRows] = useState<ViecFull[]>([])
  const [hs, setHs] = useState<HieuSuatKy | null>(null)
  const [loading, setLoading] = useState(true); const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [htModal, setHtModal] = useState<ViecFull | null>(null)
  const [ghModal, setGhModal] = useState<ViecFull | null>(null)
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

  const dangLam = rows.filter((r) => ['moi_giao', 'dang_lam', 'cho_nghiem_thu', 'tra_lai'].includes(r.trang_thai))
  const daDong = rows.filter((r) => ['dat', 'huy', 'chuyen'].includes(r.trang_thai))

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
            {!dangLam.length ? <Empty>Không có việc phát triển nào đang chờ.</Empty> : dangLam.map((v) => (
              <MyTaskCard key={v.id} v={v}>
                {v.trang_thai === 'moi_giao' && <button disabled={busy === v.id} onClick={() => act(() => batDauLam(v.id), v.id)} className={CX_BTN}>Bắt đầu làm</button>}
                {v.trang_thai === 'dang_lam' && <>
                  <button disabled={busy === v.id} onClick={() => setHtModal(v)} className={CX_BTN}>✓ Hoàn thành</button>
                  {!v.gia_han_xin_deadline && v.so_lan_gia_han < 1 && <button onClick={() => setGhModal(v)} className={CX_BTN_GHOST}>Xin gia hạn</button>}
                  {v.gia_han_xin_deadline && <span className="text-[11px] text-amber-600">Đã xin gia hạn, chờ duyệt</span>}
                </>}
                {v.trang_thai === 'cho_nghiem_thu' && <span className="text-[12px] text-amber-600">Chờ {v.nguoi_giao_ten} nghiệm thu…</span>}
                {v.trang_thai === 'tra_lai' && <button disabled={busy === v.id} onClick={() => setHtModal(v)} className={CX_BTN}>Gửi lại nghiệm thu</button>}
              </MyTaskCard>
            ))}
          </Section>
          <Section title={`Đã đóng (${daDong.length})`}>
            {!daDong.length ? <Empty>Chưa có việc nào đóng.</Empty> : daDong.map((v) => <MyTaskCard key={v.id} v={v} />)}
          </Section>
        </>
      )}

      {htModal && <HoanThanhModal v={htModal} laGuiLai={htModal.trang_thai === 'tra_lai'}
        onClose={() => setHtModal(null)}
        onDone={(ev) => act(() => (htModal.trang_thai === 'tra_lai' ? guiLaiNghiemThu(htModal.id, ev) : banHoanThanh(htModal.id, ev)), htModal.id).then(() => setHtModal(null))} />}
      {ghModal && <GiaHanModal v={ghModal} onClose={() => setGhModal(null)}
        onDone={(dl, ly) => act(() => xinGiaHan(ghModal.id, dl, ly), ghModal.id).then(() => setGhModal(null))} />}
    </div>
  )
}

function MyTaskCard({ v, children }: { v: ViecFull; children?: React.ReactNode }) {
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
            {v.output && <> · output: {v.output}</>}
          </div>
          {v.trang_thai === 'tra_lai' && v.ghi_chu_nghiem_thu && <div className="mt-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[12px] text-rose-600">Bị trả lại: {v.ghi_chu_nghiem_thu}</div>}
          {v.trang_thai === 'dat' && <div className="mt-1 text-[11px] text-slate-400">Tiến độ {v.tien_do} · Chất lượng {v.chat_luong}</div>}
        </div>
        {children && <div className="flex shrink-0 items-center gap-1.5">{children}</div>}
      </div>
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
