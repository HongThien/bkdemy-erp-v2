// Tab BÀI CỦA TÔI — mọi dòng nhận bài của người đang đăng nhập: cần sửa (bị từ chối, kèm lý do) · đang giải (đếm
// ngược hạn 48h) · chờ duyệt · lịch sử (đã duyệt / trả / quá hạn / từ chối 3 lần). Soạn tại chỗ (GiaiEditor):
// lưu nháp / nộp / trả bài. Nháp nằm trên DB (cột *_nhap của dòng nhận) — đóng tab mở lại vẫn còn.
import { useEffect, useState } from 'react'
import { MathText } from '../kho/ui'
import { listCuaToi, luuNhap, nopBai, traBai, conLai, fmtTs, fmtGiay, TRANG_THAI_LABEL, laHinh, type DongNhan, type NoiDungGiai } from '../../lib/giaibai'
import { BaiBody, BaiHead } from './BaiCard'
import GiaiEditor from './GiaiEditor'

const TONE: Record<string, string> = {
  can_sua: 'border-rose-300 bg-rose-50 text-rose-700', dang_giai: 'border-indigo-200 bg-indigo-50 text-indigo-700', cho_duyet: 'border-amber-200 bg-amber-50 text-amber-700',
  da_duyet: 'border-emerald-200 bg-emerald-50 text-emerald-700', da_tra: 'border-slate-200 bg-slate-50 text-slate-500', qua_han: 'border-slate-200 bg-slate-50 text-slate-500', tu_choi_3: 'border-rose-200 bg-rose-50 text-rose-600',
}

export default function BaiCuaToi({ me, onChanged }: { me: string; onChanged: () => void }) {
  const [rows, setRows] = useState<DongNhan[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [xemLichSu, setXemLichSu] = useState(false)

  async function reload() {
    setErr(null)
    try { setRows(await listCuaToi(me)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [me]) // eslint-disable-line

  const dang = rows.filter((r) => r.xu_ly_at === null && (r.trang_thai === 'dang_giai' || r.trang_thai === 'can_sua'))
  const choDuyet = rows.filter((r) => r.xu_ly_at === null && r.trang_thai === 'cho_duyet')
  const lichSu = rows.filter((r) => r.xu_ly_at !== null)

  async function chay(r: DongNhan, f: () => Promise<void>) {
    setBusyId(r.id)
    try { await f(); await reload(); onChanged() } finally { setBusyId(null) }
  }
  const onTra = (r: DongNhan) => { if (confirm(`Trả bài ${r.ma} về kho chung? Nháp đã gõ sẽ không dùng nữa.`)) chay(r, () => traBai(r.nhanh, r.id, me)).catch((e: any) => alert(e.message ?? String(e))) }
  const onLuu = (r: DongNhan) => (a: NoiDungGiai) => luuNhap(r.nhanh, r.id, me, a).then(() => setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, loi_giai_nhap: a.loiGiai, anh_nhap: a.anh, dap_an_nhap: a.dapAn } : x)))
  const onNop = (r: DongNhan) => (a: NoiDungGiai) => chay(r, () => nopBai(r.nhanh, r.id, me, a)).then(() => setOpenId(null))

  const the = (r: DongNhan, children?: React.ReactNode) => (
    <The key={r.id} r={r} busy={busyId === r.id} open={openId === r.id} onTra={() => onTra(r)} onToggle={() => setOpenId(openId === r.id ? null : r.id)}>{children}</The>
  )

  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p> : (
        <>
          <Section title="Đang giải" count={dang.length} hint="tối đa 3 bài · hạn 48h kể từ lúc nhận / lúc bị từ chối" empty="Chưa nhận bài nào — sang tab Kho bài để nhận.">
            {dang.map((r) => the(r, openId === r.id && (
              <GiaiEditor key={r.id} initial={{ loiGiai: r.loi_giai_nhap, anh: r.anh_nhap, dapAn: r.dap_an_nhap }}
                hoiDapAn={!laHinh(r.nhanh) && !r.dap_an} tieuDe={`Lời giải · ${r.ma}`}
                deBai={<><BaiHead b={r} /><BaiBody b={r} /></>} aiModel={r.loi_giai_ai ? r.ai_model : null} busy={busyId === r.id}
                onLuuNhap={onLuu(r)} onNop={onNop(r)} onClose={() => setOpenId(null)} />
            )))}
          </Section>
          <Section title="Chờ duyệt" count={choDuyet.length} hint="team học thuật đang xem" empty="Không có bài chờ duyệt.">
            {choDuyet.map((r) => the(r, <LoiGiaiDaNop r={r} />))}
          </Section>
          <div className="mb-2 mt-6 flex items-center gap-2">
            <button onClick={() => setXemLichSu((v) => !v)} className="text-[13px] font-semibold text-slate-600 hover:text-slate-900">{xemLichSu ? '▾' : '▸'} Lịch sử ({lichSu.length})</button>
            <span className="text-[12px] text-slate-400">đã duyệt · đã trả · quá hạn · từ chối 3 lần</span>
          </div>
          {xemLichSu && (
            <ul className="space-y-2">
              {lichSu.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-600">
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">{r.ma}</code>
                  <span className="truncate">{r.nhom_ten}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${TONE[r.trang_thai] ?? ''}`}>{TRANG_THAI_LABEL[r.trang_thai]}</span>
                  <span className="ml-auto text-slate-400">{fmtTs(r.xu_ly_at)}{r.trang_thai === 'da_duyet' && r.duyet_boi_ten ? ` · ${r.duyet_boi_ten} duyệt` : ''}{r.trang_thai === 'da_duyet' ? ` · ${r.so_ky_tu} ký tự` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

// Component mức module (KHÔNG khai báo trong thân BaiCuaToi): khai báo trong thân = mỗi lần cha render là type mới →
// React remount cả thẻ + editor bên trong → mất text đang gõ (đã dính lúc test 06/09: ref DOM stale liên tục).
function The({ r, busy, open, onTra, onToggle, children }: { r: DongNhan; busy: boolean; open: boolean; onTra: () => void; onToggle: () => void; children?: React.ReactNode }) {
  const han = conLai(r.han_at)
  const dangMo = r.xu_ly_at === null && (r.trang_thai === 'dang_giai' || r.trang_thai === 'can_sua')
  return (
    <li className={`rounded-xl border bg-white p-4 shadow-sm ${r.trang_thai === 'can_sua' ? 'border-rose-200' : 'border-slate-200'}`}>
      <BaiHead b={r} right={<>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${TONE[r.trang_thai] ?? ''}`}>{TRANG_THAI_LABEL[r.trang_thai]}</span>
        {dangMo && r.han_at && <span className={`text-[11px] ${han.gap ? 'font-semibold text-rose-600' : 'text-slate-400'}`} title={`Hạn ${fmtTs(r.han_at)}`}>⏱ {han.text}</span>}
        {dangMo && !r.qua_han && <>
          <button onClick={onTra} disabled={busy} className="rounded-md px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">↩ Trả bài</button>
          <button onClick={onToggle} disabled={busy}
            className={`rounded-md px-3 py-1 text-[12px] font-medium shadow-sm disabled:opacity-40 ${open ? 'bg-slate-200 text-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
            {open ? 'Đóng' : r.loi_giai_nhap || r.anh_nhap ? '✍️ Sửa tiếp' : '✍️ Soạn lời giải'}
          </button>
        </>}
      </>} />
      {r.trang_thai === 'can_sua' && (
        <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-800">
          <b>Bị từ chối lần {r.tu_choi_lan}/3</b>{r.duyet_boi_ten ? ` — ${r.duyet_boi_ten}` : ''}{r.tu_choi_at ? ` · ${fmtTs(r.tu_choi_at)}` : ''}: {r.ly_do_tu_choi}
          {r.tu_choi_lan >= 2 && <div className="mt-0.5 text-[12px] text-rose-600">Lần từ chối thứ 3 bài sẽ về kho chung và bạn không nhận lại được.</div>}
        </div>
      )}
      {r.qua_han && <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-600">Bài đã quá hạn 48h — đã trả về kho chung, người khác có thể nhận.</div>}
      <BaiBody b={r} compact={!dangMo} />
      {children}
    </li>
  )
}
function LoiGiaiDaNop({ r }: { r: DongNhan }) {
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Lời giải đã nộp <span className="font-normal normal-case text-slate-400">· nộp {fmtTs(r.nop_at)} · giải trong {fmtGiay(r.giay_giai)} · {r.so_ky_tu} ký tự · {r.so_cong_thuc} công thức</span>
      </div>
      <div className={r.anh_nhap ? 'grid grid-cols-[1fr_auto] gap-3' : ''}>
        <div className="text-[13px] leading-relaxed"><MathText>{r.loi_giai_nhap}</MathText>{r.dap_an_nhap && <div className="mt-1 text-slate-600">Đáp án: <MathText>{r.dap_an_nhap}</MathText></div>}</div>
        {r.anh_nhap && <img src={r.anh_nhap} alt="ảnh lời giải" className="max-h-48 max-w-[240px] rounded-lg border border-slate-200 bg-white" />}
      </div>
    </div>
  )
}
function Section({ title, count, hint, empty, children }: { title: string; count: number; hint: string; empty: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-baseline gap-2">
        <h2 className="text-[14px] font-semibold text-slate-800">{title} <span className="text-slate-400">{count}</span></h2>
        <span className="text-[12px] text-slate-400">{hint}</span>
      </div>
      {count === 0 ? <p className="text-[13px] text-slate-400">{empty}</p> : <ul className="space-y-3">{children}</ul>}
    </section>
  )
}
