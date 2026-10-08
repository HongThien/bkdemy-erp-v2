// DUYỆT VIỆC OPS THEO NGÀY — khối trên đầu "Việc của tôi" (Thùy 08/10: "Phần duyệt của Lộc cần được tổng hợp
// lại toàn bộ một ngày vào 1 chỗ để duyệt 1 lần cho xong"). Phạm vi chốt: Report trước buổi + Báo tan + Prep phòng.
// Cách duyệt chốt: mỗi ngày 1 nút "Duyệt cả ngày"; dòng nào sai thì hạ CHẤT LƯỢNG trước khi bấm (ngoại lệ).
// Chỉ hiện với trưởng/phó Vận hành hoặc admin (fn_ops_la_nguoi_duyet — DB chặn cả lúc ghi).
// Mọi số (hạn, phút trễ) do DB tính (fn_ops_cho_duyet); client chỉ nhóm theo ngày + đếm dòng đang hiện.
// Sau khi duyệt: bỏ ĐÚNG ngày đó khỏi list tại chỗ, không tải lại (CLAUDE §2); nhớ list ở module tới F5.
import { useEffect, useState } from 'react'
import {
  laNguoiDuyetOps, listOpsDuyetTheoNgay, duyetOpsNgay, opsDuyetKhoa,
  type OpsDuyetDong, type OpsDuyetLoai,
} from '../../lib/opsvanhanh'
import { congNgay, homNayVN, thuCuaNgay, ddmmVN } from '../../lib/tuan'
import { anhNho } from '../../lib/anhNho'
import ImgZoom from '../../components/ImgZoom'

const SO_NGAY_QUET = 120          // tồn chưa duyệt cũ nhất hiện có là đầu tháng 7
const SO_NGAY_HIEN_SAN = 7        // ngày cũ hơn gấp vào "Tồn cũ"
const MUC_CL = [100, 80, 50, 0]   // gậy tính ĐẠT khi đúng hạn VÀ chất lượng ≥ 80 (fn_ops_viec_nhom_thang)
const TEN_LOAI: Record<OpsDuyetLoai, string> = { report: 'Report trước buổi', tan: 'Báo tan', prep: 'Prep phòng' }
const TEN_CA: Record<string, string> = { sang: 'Sáng', chieu: 'Chiều', toi: 'Tối' }

const NHO: { duocDuyet: boolean | null; rows: OpsDuyetDong[] | null; mo: string | null; sua: Record<string, number>; xemCu: boolean } =
  { duocDuyet: null, rows: null, mo: null, sua: {}, xemCu: false }

function nhanTre(phut: number): string {
  if (phut < 60) return `trễ ${phut}p`
  const h = Math.floor(phut / 60), m = phut % 60
  if (h < 24) return `trễ ${h}h${m ? String(m).padStart(2, '0') : ''}`
  return `trễ ${Math.floor(h / 24)} ngày ${h % 24}h`
}

export default function DuyetOpsNgay() {
  const [duocDuyet, setDuocDuyet] = useState(NHO.duocDuyet)
  const [rows, setRows] = useState<OpsDuyetDong[] | null>(NHO.rows)
  const [mo, setMo] = useState<string | null>(NHO.mo)
  const [sua, setSua] = useState<Record<string, number>>(NHO.sua)
  const [xemCu, setXemCu] = useState(NHO.xemCu)
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)   // phản hồi ~3s sau khi duyệt (không alert)
  const bao = (m: string) => { setOk(m); setTimeout(() => setOk(null), 3000) }
  useEffect(() => { Object.assign(NHO, { duocDuyet, rows, mo, sua, xemCu }) }, [duocDuyet, rows, mo, sua, xemCu])

  async function tai() {
    setErr(null)
    try { const homNay = homNayVN(); setRows(await listOpsDuyetTheoNgay(congNgay(homNay, -SO_NGAY_QUET), homNay)) }
    catch (e: any) { setErr(e.message ?? String(e)) }
  }
  useEffect(() => {
    if (duocDuyet === false) return
    if (duocDuyet === null) laNguoiDuyetOps().then((ok) => { setDuocDuyet(ok); if (ok && !NHO.rows) tai() }).catch(() => setDuocDuyet(false))
    else if (!rows) tai()
  }, []) // eslint-disable-line

  if (!duocDuyet || !rows) return null
  if (!rows.length && !err) return (
    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-2.5 text-[13px] font-medium text-emerald-700">✅ Duyệt việc OPS: không còn ngày nào chờ duyệt.</div>
  )

  const theoNgay = new Map<string, OpsDuyetDong[]>()
  for (const r of rows) theoNgay.set(r.ngay, [...(theoNgay.get(r.ngay) ?? []), r])
  const ngays = [...theoNgay.keys()].sort((a, b) => b.localeCompare(a))
  const moc = congNgay(homNayVN(), -SO_NGAY_HIEN_SAN)
  const ngayGan = ngays.filter((d) => d >= moc), ngayCu = ngays.filter((d) => d < moc)
  const khoaSua = (r: OpsDuyetDong) => `${r.ngay}|${opsDuyetKhoa(r)}`

  async function duyetNgay(ngay: string) {
    const ds = (theoNgay.get(ngay) ?? []).map((r) => ({ ...r, chatLuongMoi: sua[khoaSua(r)] }))
    const soNgoaiLe = ds.filter((r) => r.chatLuongMoi != null && r.chatLuongMoi !== r.chatLuong).length
    setBusy(ngay); setErr(null)
    try {
      const n = await duyetOpsNgay(ngay, ds)
      setRows((s) => (s ?? []).filter((r) => r.ngay !== ngay))
      setSua((s) => Object.fromEntries(Object.entries(s).filter(([k]) => !k.startsWith(ngay + '|'))))
      if (mo === ngay) setMo(null)
      bao(`✓ Đã duyệt ${thuCuaNgay(ngay)} ${ddmmVN(ngay)} — ${n} việc${soNgoaiLe ? `, ${soNgoaiLe} ngoại lệ` : ''}`)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusy(null) }
  }

  function theNgay(ngay: string) {
    const ds = theoNgay.get(ngay) ?? []
    const dem = (l: OpsDuyetLoai) => ds.filter((r) => r.loai === l).length
    const soTre = ds.filter((r) => r.trePhut > 0).length
    const soNgoaiLe = ds.filter((r) => sua[khoaSua(r)] != null && sua[khoaSua(r)] !== r.chatLuong).length
    const dangMo = mo === ngay
    return (
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2">
          <button onClick={() => setMo(dangMo ? null : ngay)} className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 text-left">
            <span className="text-[13.5px] font-semibold text-slate-800">{thuCuaNgay(ngay)} {ddmmVN(ngay)}</span>
            <span className="text-[12px] text-slate-500">
              {(['report', 'tan', 'prep'] as OpsDuyetLoai[]).filter((l) => dem(l) > 0).map((l) => `${dem(l)} ${TEN_LOAI[l].toLowerCase()}`).join(' · ')}
            </span>
            {soTre > 0 && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">{soTre} trễ hạn</span>}
            {soNgoaiLe > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">{soNgoaiLe} ngoại lệ</span>}
            <span className="text-[11px] font-medium text-indigo-500">{dangMo ? '▾ Thu gọn' : '▸ Xem từng việc'}</span>
          </button>
          <button onClick={() => duyetNgay(ngay)} disabled={!!busy}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">
            {busy === ngay ? 'Đang duyệt…' : `✓ Duyệt cả ngày (${ds.length})`}
          </button>
        </div>
        {dangMo && (
          <div className="flex flex-col divide-y divide-slate-100 border-t border-slate-100">
            {ds.map((r) => {
              const k = khoaSua(r)
              const cl = sua[k] ?? r.chatLuong
              const doi = cl !== r.chatLuong
              return (
                <div key={k} className={`flex flex-wrap items-center gap-2 px-3 py-1.5 text-[12.5px] ${doi ? 'bg-amber-50' : ''}`}>
                  <span className="w-[84px] shrink-0 text-[11px] font-semibold text-slate-400">{TEN_LOAI[r.loai]}</span>
                  <span className="min-w-[120px] font-medium text-slate-800">{r.tenViec}{r.ca ? <span className="font-normal text-slate-400"> · {TEN_CA[r.ca] ?? r.ca}</span> : null}</span>
                  <span className="text-slate-500">{r.nhanSuTen ?? '—'}</span>
                  <span className={`text-[11.5px] font-medium ${!r.han ? 'text-slate-400' : r.trePhut > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {!r.han ? 'không rõ hạn' : r.trePhut > 0 ? nhanTre(r.trePhut) : 'đúng hạn'}
                  </span>
                  {r.anhUrl && <ImgZoom src={anhNho(r.anhUrl, 80)!} zoomSrc={anhNho(r.anhUrl, 1600)!} className="h-8 w-8 rounded object-cover ring-1 ring-slate-200" />}
                  <span className="ml-auto flex items-center gap-1" title="Chất lượng — dưới 80 thì việc này tính KHÔNG ĐẠT">
                    <span className="text-[11px] text-slate-400">Chất lượng</span>
                    {MUC_CL.map((m) => (
                      <button key={m} onClick={() => setSua((s) => ({ ...s, [k]: m }))}
                        className={`min-w-[34px] rounded px-1.5 py-0.5 text-[11.5px] font-semibold ${cl === m ? (m >= 80 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{m}</button>
                    ))}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="mb-4">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-slate-700">✅ Duyệt việc OPS theo ngày</span>
        <span className="text-[12px] text-slate-400">Report · Báo tan · Prep phòng — {ngays.length} ngày chờ duyệt</span>
        <button onClick={tai} title="Quét lại" className="ml-auto rounded-md border border-slate-200 px-2 py-0.5 text-[13px] text-slate-500 hover:border-indigo-300">↻</button>
      </div>
      {ok && <p className="mb-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-[12.5px] font-medium text-emerald-700">{ok}</p>}
      {err && <p className="mb-1.5 rounded-md bg-rose-50 px-3 py-1.5 text-[12.5px] text-rose-700">{err}</p>}
      <div className="flex flex-col gap-1.5">
        {ngayGan.map((d) => <div key={d}>{theNgay(d)}</div>)}
        {ngayCu.length > 0 && (
          <>
            <button onClick={() => setXemCu((x) => !x)} className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-left text-[12.5px] text-slate-500 hover:border-indigo-300">
              {xemCu ? '▾' : '▸'} Tồn cũ hơn {SO_NGAY_HIEN_SAN} ngày: {ngayCu.length} ngày · {ngayCu.reduce((n, d) => n + (theoNgay.get(d)?.length ?? 0), 0)} việc
            </button>
            {xemCu && ngayCu.map((d) => <div key={d}>{theNgay(d)}</div>)}
          </>
        )}
      </div>
    </section>
  )
}
