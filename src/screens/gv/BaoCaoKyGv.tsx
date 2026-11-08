// BÁO CÁO HỌC KÌ trên APP GIÁO VIÊN (Thùy 06/11 "đưa tính năng này lên app giáo viên cho dễ").
// Dùng NGUYÊN thân màn của ERP (BaoCaoKyBody — một nguồn, không bản sao): GV chọn kì · lớp mình phụ trách · em,
// rồi chấm như trên ERP. Không có ở đây: tạo kì, sửa thang nhận xét, chốt số liệu, công bố cả lớp (việc của admin trên ERP).
import { useEffect, useState } from 'react'
import type { Lop } from '../../lib/nhansu'
import { listHSCuaLop } from '../../lib/nhansu'
import { listKyHoc, listBcKyTrangThai, type KyHoc, type BcKyTT } from '../../lib/baoCaoKy'
import { BaoCaoKyBody } from '../report/BaoCaoKy'

type Em = { id: string; ho_ten: string }
const thangNhan = (ym: string) => { const [y, m] = ym.split('-'); return `${Number(m)}/${y}` }
// nhớ lựa chọn khi rời màn rồi quay lại (sống tới F5)
const NHO: { kyId: string | null; lopId: string | null; hsId: string | null } = { kyId: null, lopId: null, hsId: null }

export default function BaoCaoKyGv({ lops, onBack }: { lops: Lop[]; onBack: () => void }) {
  const [kys, setKys] = useState<KyHoc[]>([])
  const [kyId, setKyIdS] = useState<string | null>(NHO.kyId)
  const [lopId, setLopIdS] = useState<string | null>(NHO.lopId && lops.some((l) => l.id === NHO.lopId) ? NHO.lopId : (lops.length === 1 ? lops[0].id : null))
  const [hsId, setHsIdS] = useState<string | null>(NHO.hsId)
  const [ems, setEms] = useState<Em[]>([])
  const [tt, setTt] = useState<Record<string, BcKyTT>>({})
  const setKyId = (v: string | null) => { NHO.kyId = v; setKyIdS(v) }
  const setLopId = (v: string | null) => { NHO.lopId = v; NHO.hsId = null; setLopIdS(v); setHsIdS(null) }
  const setHsId = (v: string | null) => { NHO.hsId = v; setHsIdS(v) }
  const lop = lops.find((l) => l.id === lopId) ?? null

  useEffect(() => { listKyHoc().then((k) => { setKys(k); if (!kyId && k[0]) setKyId(k[0].id) }).catch(() => setKys([])) }, []) // eslint-disable-line
  useEffect(() => {
    setEms([])
    if (!lopId) return
    listHSCuaLop(lopId).then((rows: any[]) => setEms(rows.map((r) => r.hoc_sinh).filter(Boolean)
      .map((h: any) => ({ id: h.id, ho_ten: h.ho_ten }))
      .sort((a: Em, b: Em) => a.ho_ten.localeCompare(b.ho_ten, 'vi')))).catch(() => setEms([]))
  }, [lopId])
  useEffect(() => {
    setTt({})
    if (!kyId || !lop || !ems.length) return
    listBcKyTrangThai(ems.map((e) => e.id), lop.mon, kyId).then(setTt).catch(() => setTt({}))
  }, [kyId, lop?.id, ems]) // eslint-disable-line

  const i = ems.findIndex((e) => e.id === hsId)
  const nhanTT = (id: string) => tt[id] === 'cong_bo' ? '✓ ' : tt[id] === 'du' ? '● ' : tt[id] === 'nhap' ? '○ ' : ''
  const o = 'h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-[14px] font-semibold text-slate-800'
  return (
    <div className="flex h-[100dvh] flex-col bg-[#f5f5f7]" style={{ fontFamily: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="border-b border-slate-200 bg-white px-3 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="rounded-lg px-2 py-1.5 text-[15px] text-slate-500 active:bg-slate-100">‹</button>
            <span className="text-[15px] font-bold text-slate-800">📑 Báo cáo học kì</span>
            <select value={kyId ?? ''} onChange={(e) => setKyId(e.target.value || null)} className="ml-auto h-8 max-w-[55%] rounded-lg border border-slate-200 bg-white px-1.5 text-[12.5px] font-semibold text-slate-700">
              {kys.length === 0 && <option value="">— Chưa có kì —</option>}
              {kys.map((k) => <option key={k.id} value={k.id}>{k.ten} ({thangNhan(k.tu_thang)}→{thangNhan(k.den_thang)})</option>)}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <select value={lopId ?? ''} onChange={(e) => setLopId(e.target.value || null)} className={`${o} w-28 shrink-0`}>
              <option value="">— Lớp —</option>
              {lops.map((l) => <option key={l.id} value={l.id}>{l.ten_lop}</option>)}
            </select>
            <div className="flex min-w-[260px] flex-1 items-center gap-1.5">
              <button disabled={i <= 0} onClick={() => setHsId(ems[i - 1].id)} className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 bg-white text-[18px] text-slate-600 disabled:opacity-30">‹</button>
              <select value={hsId ?? ''} onChange={(e) => setHsId(e.target.value || null)} disabled={!ems.length} className={`${o} flex-1`}>
                <option value="">{lopId ? `— Chọn học sinh (${ems.length}) —` : '— Chọn lớp trước —'}</option>
                {ems.map((e) => <option key={e.id} value={e.id}>{nhanTT(e.id)}{e.ho_ten}</option>)}
              </select>
              <button disabled={i < 0 || i >= ems.length - 1} onClick={() => setHsId(ems[i + 1].id)} className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 bg-white text-[18px] text-slate-600 disabled:opacity-30">›</button>
            </div>
          </div>
          {lopId && ems.length > 0 && <p className="text-[11px] text-slate-400">○ đang nhập · ● đã điền đủ · ✓ đã công bố</p>}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-3 pt-3">
        <div className="mx-auto max-w-[1400px]">
          {lops.length === 0
            ? <p className="py-16 text-center text-sm text-slate-500">Bạn chưa được phân công lớp nào với vai giáo viên.</p>
            : !kyId ? <p className="py-16 text-center text-sm text-slate-500">Chưa có kì báo cáo nào — chờ quản lý tạo kì trên ERP.</p>
            : !lop ? <p className="py-16 text-center text-sm text-slate-500">Chọn lớp để bắt đầu.</p>
            : !hsId ? <p className="py-16 text-center text-sm text-slate-500">Chọn học sinh (hoặc bấm ›) để nhập báo cáo.</p>
            : <BaoCaoKyBody key={hsId + lop.mon + kyId} hsId={hsId} mon={lop.mon} kyId={kyId} onTrangThai={(id, t) => setTt((m) => ({ ...m, [id]: t }))} />}
          <div className="h-6" />
        </div>
      </div>
    </div>
  )
}
