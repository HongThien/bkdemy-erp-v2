// TAB BACKLOG + HẠNG MỤC (§2.3, §3). Backlog sort gia_tri/co + trần WIP. Hạng mục
// (mot_lan/lien_tuc) + burn-up (không burn-down) + cảnh báo quá chan_troi.
// Giao 1 backlog item → task = ĐẺ DÒNG viec mới (cửa 2). Gợi ý lát cắt ở màn Review.
import { useEffect, useState } from 'react'
import {
  getBacklog, listHangMuc, createHangMuc, burnUpHangMuc, hangMucQuaChanTroi,
  type YTuongFull, type HangMucFull, type BurnUpDiem,
} from '../../lib/giaoviec'
import { GV } from '../../lib/giaoviec-config'
import { CX_INPUT, CX_BTN, CX_BTN_GHOST, Section, Empty, ErrBar, Modal, Field, Chon13, fmtNgay } from './ui'
import GiaoViecModal from './GiaoViecModal'

export default function BacklogTab({ laAdmin }: { laAdmin: boolean }) {
  const [backlog, setBacklog] = useState<{ items: YTuongFull[]; quaTran: boolean } | null>(null)
  const [hangMucs, setHangMucs] = useState<HangMucFull[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [giaoFrom, setGiaoFrom] = useState<{ y_tuong_id?: string; tieu_de?: string } | null>(null)
  const [showHM, setShowHM] = useState(false)

  async function reload() {
    setLoading(true); setErr(null)
    try {
      const [b, hm] = await Promise.all([getBacklog(), listHangMuc(['backlog', 'dang_chay'])])
      setBacklog(b); setHangMucs(hm)
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <ErrBar msg={err} />
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : (
        <>
          <Section title={`Backlog — ${backlog?.items.length ?? 0} item (sort theo giá trị/cỡ)`}
            highlight={backlog?.quaTran}
            right={<span className={`text-[11px] ${backlog?.quaTran ? 'font-semibold text-amber-600' : 'text-slate-400'}`}>Trần WIP {GV.TRAN_WIP_BACKLOG}</span>}>
            {backlog?.quaTran && <div className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-700">⚠ Backlog vượt trần {GV.TRAN_WIP_BACKLOG} item — nên chốt bớt hoặc để ngủ đông trước khi thêm.</div>}
            {!backlog?.items.length ? <Empty>Backlog rỗng. Duyệt ý tưởng ở tab Ý tưởng, hoặc CEO tạo thẳng.</Empty> : backlog.items.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm">
                <span className="w-6 text-center text-[12px] font-semibold text-slate-300">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800">{r.tieu_de}</div>
                  <div className="text-[12px] text-slate-500">Giá trị {r.gia_tri ?? '—'} · Cỡ {r.co ?? '—'} · Tác giả {r.tac_gia_ten} · vào backlog {fmtNgay(r.ngay_vao_backlog)}</div>
                  {r.mo_ta && <div className="mt-0.5 text-[12px] text-slate-400">{r.mo_ta}</div>}
                </div>
                <button onClick={() => setGiaoFrom({ y_tuong_id: r.id, tieu_de: r.tieu_de })} className={CX_BTN}>Chốt tuần → Giao</button>
              </div>
            ))}
          </Section>

          <Section title={`Hạng mục (${hangMucs.length})`}
            right={laAdmin ? <button onClick={() => setShowHM(true)} className={CX_BTN_GHOST}>+ Hạng mục</button> : undefined}>
            {!hangMucs.length ? <Empty>Chưa có hạng mục nào.</Empty> : hangMucs.map((hm) => <HangMucCard key={hm.id} hm={hm} />)}
          </Section>
        </>
      )}

      {giaoFrom && <GiaoViecModal prefill={{ y_tuong_id: giaoFrom.y_tuong_id, tieu_de: giaoFrom.tieu_de, nguon: 'ke_hoach' }} onClose={() => setGiaoFrom(null)} onDone={() => { setGiaoFrom(null); reload() }} />}
      {showHM && <HangMucModal onClose={() => setShowHM(false)} onDone={() => { setShowHM(false); reload() }} />}
    </div>
  )
}

function HangMucCard({ hm }: { hm: HangMucFull }) {
  const [burn, setBurn] = useState<BurnUpDiem[] | null>(null)
  const [open, setOpen] = useState(false)
  const quaHan = hangMucQuaChanTroi(hm)
  async function toggle() {
    setOpen((o) => !o)
    if (!burn) try { setBurn(await burnUpHangMuc(hm.id)) } catch { setBurn([]) }
  }
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm ${quaHan ? 'ring-1 ring-rose-300' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-800">{hm.ten}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${hm.kieu === 'lien_tuc' ? 'bg-violet-50 text-violet-700' : 'bg-sky-50 text-sky-700'}`}>{hm.kieu === 'lien_tuc' ? 'Liên tục' : 'Một lần'}</span>
        <span className="text-[12px] text-slate-500">đã ra {hm.so_lat_da_ra}{hm.pham_vi != null ? ` / ${hm.pham_vi}` : ''} lát</span>
        {hm.chan_troi && <span className={`text-[12px] ${quaHan ? 'font-semibold text-rose-600' : 'text-slate-400'}`}>· chân trời {fmtNgay(hm.chan_troi)}{quaHan ? ' (quá hạn — quyết lại!)' : ''}</span>}
        <button onClick={toggle} className="ml-auto text-[12px] font-medium text-indigo-600 hover:underline">{open ? 'Ẩn' : 'Burn-up'}</button>
      </div>
      {hm.mo_ta && <div className="mt-1 text-[12px] text-slate-400">{hm.mo_ta}</div>}
      {open && <BurnUp diem={burn} phamVi={hm.pham_vi} />}
    </div>
  )
}

// Burn-up: đường luỹ kế đi LÊN (chạy được cả khi chưa biết tổng). Kẻ đường đích nếu có pham_vi.
function BurnUp({ diem, phamVi }: { diem: BurnUpDiem[] | null; phamVi: number | null }) {
  if (!diem) return <div className="mt-2 text-[12px] text-slate-400">Đang tải…</div>
  if (!diem.length) return <div className="mt-2 text-[12px] text-slate-400">Chưa có lát nào hoàn thành để vẽ.</div>
  const W = 520, H = 120, pad = 24
  const maxY = Math.max(phamVi ?? 0, diem[diem.length - 1].luy_ke, 1)
  const n = diem.length
  const x = (i: number) => pad + (n === 1 ? (W - 2 * pad) / 2 : (i * (W - 2 * pad)) / (n - 1))
  const y = (v: number) => H - pad - (v / maxY) * (H - 2 * pad)
  const path = diem.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.luy_ke).toFixed(1)}`).join(' ')
  return (
    <div className="mt-2 overflow-x-auto">
      <svg width={W} height={H} className="min-w-[520px]">
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#e2e8f0" />
        {phamVi != null && <line x1={pad} y1={y(phamVi)} x2={W - pad} y2={y(phamVi)} stroke="#f43f5e" strokeDasharray="4 3" strokeWidth={1} />}
        <path d={path} fill="none" stroke="#4f46e5" strokeWidth={2} />
        {diem.map((d, i) => <circle key={i} cx={x(i)} cy={y(d.luy_ke)} r={3} fill="#4f46e5" />)}
        {diem.map((d, i) => <text key={'t' + i} x={x(i)} y={H - 6} fontSize={9} fill="#94a3b8" textAnchor="middle">{d.ky_tuan.slice(5)}</text>)}
        <text x={pad} y={12} fontSize={10} fill="#4f46e5">luỹ kế {diem[diem.length - 1].luy_ke}{phamVi != null ? ` / ${phamVi}` : ''}</text>
      </svg>
    </div>
  )
}

function HangMucModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [ten, setTen] = useState(''); const [moTa, setMoTa] = useState('')
  const [kieu, setKieu] = useState<'mot_lan' | 'lien_tuc'>('lien_tuc')
  const [phamVi, setPhamVi] = useState<number | ''>(''); const [chanTroi, setChanTroi] = useState('')
  const [giaTri, setGiaTri] = useState<number | null>(null); const [co, setCo] = useState<number | null>(null)
  const [saving, setSaving] = useState(false); const [err, setErr] = useState<string | null>(null)
  async function submit() {
    if (!ten.trim()) { setErr('Cần tên hạng mục.'); return }
    setSaving(true); setErr(null)
    try {
      await createHangMuc({ ten: ten.trim(), mo_ta: moTa.trim() || undefined, kieu, pham_vi: phamVi === '' ? null : Number(phamVi), chan_troi: chanTroi || null, gia_tri: giaTri, co })
      onDone()
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setSaving(false) }
  }
  return (
    <Modal title="Hạng mục mới" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Tên"><input value={ten} onChange={(e) => setTen(e.target.value)} className={CX_INPUT} placeholder="VD: Xây kho tài liệu Đại 9" /></Field>
        <Field label="Mô tả"><textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} className={CX_INPUT} rows={2} /></Field>
        <Field label="Kiểu">
          <select value={kieu} onChange={(e) => setKieu(e.target.value as any)} className={CX_INPUT}>
            <option value="lien_tuc">Liên tục — dòng chảy nhiều tháng, mỗi tuần đẻ một lát</option>
            <option value="mot_lan">Một lần — chốt vào tuần → 1 task → xong</option>
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Phạm vi (tổng — để trống nếu chưa biết)"><input type="number" value={phamVi} onChange={(e) => setPhamVi(e.target.value === '' ? '' : Number(e.target.value))} className={CX_INPUT} placeholder="không ép nhập" /></Field>
          <Field label="Chân trời (mốc quyết lại)"><input type="date" value={chanTroi} onChange={(e) => setChanTroi(e.target.value)} className={CX_INPUT} /></Field>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-600"><span>Giá trị:</span><Chon13 value={giaTri} onChange={setGiaTri} /><span>Cỡ:</span><Chon13 value={co} onChange={setCo} /></div>
        <p className="text-[11px] text-slate-400">Phạm vi để trống là hợp lệ — hệ đo bằng burn-up (nhịp thật), không ép bịa mẫu số.</p>
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-600">{err}</div>}
        <div className="flex justify-end gap-2"><button onClick={onClose} className={CX_BTN_GHOST}>Huỷ</button><button disabled={saving} onClick={submit} className={CX_BTN}>{saving ? '…' : 'Tạo'}</button></div>
      </div>
    </Modal>
  )
}
