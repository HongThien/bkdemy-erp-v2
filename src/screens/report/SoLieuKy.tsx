// SỐ LIỆU HỌC SINH cho GV khi nhập báo cáo kì (Thùy 05/11): bản DESKTOP — dày, đọc lướt, KHÔNG phải bản gửi phụ huynh.
// Cùng 1 nguồn jsonb với bản gửi PH (fn_bc_ky_tinh / snapshot) — ở đây chỉ hiển thị, không tính gì.
import { useState } from 'react'
import type { BcKyData } from '../../lib/baoCaoKy'
import { BieuDoThi, so1 } from './BaoCaoKy'

const pctCls = (p: number | null) => p == null ? 'text-slate-400' : p >= 80 ? 'text-emerald-700' : p >= 50 ? 'text-amber-700' : 'text-rose-700'
const barCls = (p: number | null) => p == null ? 'bg-slate-200' : p >= 80 ? 'bg-emerald-500' : p >= 50 ? 'bg-amber-500' : 'bg-rose-500'

function Tile({ nhan, so, phu, tone }: { nhan: string; so: React.ReactNode; phu?: React.ReactNode; tone?: 'xanh' | 'cam' | 'do' }) {
  const c = tone === 'do' ? 'text-rose-700' : tone === 'cam' ? 'text-amber-700' : tone === 'xanh' ? 'text-emerald-700' : 'text-slate-800'
  return (
    <div className="rounded-xl border border-slate-200 px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{nhan}</div>
      <div className={`text-[20px] font-extrabold leading-tight tabular-nums ${c}`}>{so}</div>
      {phu && <div className="text-[11px] text-slate-500">{phu}</div>}
    </div>
  )
}
const Muc = ({ children, phu }: { children: React.ReactNode; phu?: React.ReactNode }) =>
  <div className="mb-1.5 mt-4 flex items-baseline gap-2 first:mt-0"><h4 className="text-[12px] font-bold uppercase tracking-wider text-indigo-700">{children}</h4>{phu && <span className="text-[11px] text-slate-400">{phu}</span>}</div>

// Lọc lớp của phụ lục: nhớ qua các em (sống tới F5). '__em' = lớp của em đang xem, '' = cả khối.
const NHO_PL = { lop: '__em' }
export function SoLieuKy({ d }: { d: BcKyData }) {
  const [chiYeu, setChiYeu] = useState(false)
  const [lopPL, setLopPLS] = useState(NHO_PL.lop)
  const setLopPL = (v: string) => { NHO_PL.lop = v; setLopPLS(v) }
  const cc = d.thai_do.chuyen_can, bt = d.thai_do.btvn, hk = d.hang_ky
  const nghi = cc ? cc.vang + cc.vang_phep : 0
  const btMau = bt ? bt.tong - bt.xin_phep - bt.chua_ghi : 0
  const btPct = bt && btMau > 0 ? Math.round((100 * bt.dat_chuan) / btMau) : null
  const cds = d.danh_gia.chu_de
  return (
    <div className="text-[13px] text-slate-700">
      <div className="grid grid-cols-2 gap-2 2xl:grid-cols-4">
        <Tile nhan="Điểm TB kì" so={so1(hk?.diem_tb)} phu={hk ? `${hk.so_lan} lần thi` : 'chưa thi'} />
        <Tile nhan="Hạng kì" so={hk ? `${hk.hang}/${hk.tong}` : '—'} phu={hk ? `hạng TB ${so1(hk.hang_tb)}` : undefined} />
        <Tile nhan="Chuyên cần" so={cc && cc.tong ? `${cc.co_mat}/${cc.tong}` : '—'} phu={nghi ? `nghỉ ${nghi}${cc!.vang_phep ? ` (${cc!.vang_phep} có phép)` : ''}` : 'không nghỉ'} tone={nghi > 2 ? 'cam' : undefined} />
        <Tile nhan="BTVN đạt chuẩn" so={bt && bt.tong ? `${bt.dat_chuan}/${btMau}` : '—'} phu={btPct != null ? `${btPct}%` : undefined}
          tone={btPct == null ? undefined : btPct >= 90 ? 'xanh' : btPct < 70 ? 'do' : 'cam'} />
      </div>

      <Muc phu="tím = con · cam = TB khối">Kết quả thi</Muc>
      {d.thi.length
        ? <div className="grid items-center gap-3 2xl:grid-cols-[minmax(0,1fr)_300px]">
            <table className="w-full text-[12.5px]">
              <thead><tr className="border-b border-slate-200 text-[11px] text-slate-500">
                <th className="py-1 text-left font-medium" />{d.thi.map((t, i) => <th key={i} className="py-1 text-right font-semibold text-slate-600">{t.nhan}</th>)}
              </tr></thead>
              <tbody className="tabular-nums">
                <tr className="border-b border-slate-100"><td className="py-1 text-slate-500">Điểm</td>{d.thi.map((t, i) => <td key={i} className="py-1 text-right font-bold text-indigo-700">{so1(t.diem)}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="py-1 text-slate-500">TB khối</td>{d.thi.map((t, i) => <td key={i} className="py-1 text-right text-orange-600">{so1(t.tb)}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="py-1 text-slate-500">Chênh</td>{d.thi.map((t, i) => <td key={i} className={`py-1 text-right ${t.chenh >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{t.chenh >= 0 ? '+' : ''}{so1(t.chenh)}</td>)}</tr>
                <tr><td className="py-1 text-slate-500">Hạng</td>{d.thi.map((t, i) => <td key={i} className="py-1 text-right">{t.hang}/{t.n_mau}</td>)}</tr>
              </tbody>
            </table>
            <div className="mx-auto w-full max-w-[340px]"><BieuDoThi thi={d.thi} /></div>
          </div>
        : <p className="text-slate-400">Chưa có lần thi nào trong kì.</p>}

      <Muc>Bài tập về nhà</Muc>
      {bt && bt.tong
        ? <div className="flex flex-wrap gap-1.5 text-[12px]">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700">Đạt chuẩn <b>{bt.dat_chuan}</b></span>
            <span className={`rounded-md px-2 py-0.5 ${bt.dung_han_chua_nt ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'}`}>Đúng hạn chưa nghiêm túc <b>{bt.dung_han_chua_nt}</b></span>
            <span className={`rounded-md px-2 py-0.5 ${bt.nop_muon ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'}`}>Nộp muộn <b>{bt.nop_muon}</b></span>
            <span className={`rounded-md px-2 py-0.5 ${bt.khong_lam ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-500'}`}>Không làm <b>{bt.khong_lam}</b></span>
            {bt.xin_phep > 0 && <span className="rounded-md bg-slate-50 px-2 py-0.5 text-slate-600">Xin phép <b>{bt.xin_phep}</b></span>}
            {bt.chua_ghi > 0 && <span className="rounded-md bg-slate-50 px-2 py-0.5 text-slate-600">Chưa ghi <b>{bt.chua_ghi}</b></span>}
            {bt.chong_doi > 0 && <span className="rounded-md bg-rose-50 px-2 py-0.5 text-rose-700">trong đó chống đối <b>{bt.chong_doi}</b></span>}
          </div>
        : <p className="text-slate-400">Chưa có ghi nhận BTVN trong kì.</p>}

      <Muc phu={<>{cds.length} chủ đề · 60 ngày cuối kì · <label className="cursor-pointer"><input type="checkbox" checked={chiYeu} onChange={(e) => setChiYeu(e.target.checked)} className="mr-1 align-middle" />chỉ hiện dưới 80%</label></>}>Hoàn thành kiến thức</Muc>
      {cds.length
        ? <table className="w-full table-fixed text-[12.5px]">
            <colgroup><col /><col className="w-[72px]" /><col className="w-[46px]" /><col className="w-[36px]" /><col className="w-[62px]" /></colgroup>
            <thead><tr className="border-b border-slate-200 text-[11px] text-slate-500">
              <th className="py-1 text-left font-medium">Chủ đề / chuyên đề</th><th className="py-1 font-medium" /><th className="py-1 text-right font-medium">%</th>
              <th className="py-1 text-right font-medium" title="Số lần đánh giá">Lần</th><th className="py-1 text-right font-medium">Hạng khối</th>
            </tr></thead>
            <tbody className="tabular-nums">
              {cds.map((cd) => {
                const con = cd.chuyen_de.filter((u) => !chiYeu || (u.p != null && u.p < 80))
                if (chiYeu && !con.length && !(cd.p != null && cd.p < 80)) return null
                return [
                  <tr key={cd.ma} className="border-t border-slate-200 bg-slate-50 font-semibold">
                    <td className="py-1.5 pl-1 text-slate-800">{cd.ten}</td>
                    <td><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className={`h-full ${barCls(cd.p)}`} style={{ width: `${cd.p ?? 0}%` }} /></div></td>
                    <td className={`text-right ${pctCls(cd.p)}`}>{cd.p == null ? '—' : `${cd.p}%`}</td>
                    <td className="text-right text-slate-500">{cd.n}</td>
                    <td className="pr-1 text-right text-slate-600">{cd.hang != null ? `${cd.hang}/${cd.tong}` : ''}</td>
                  </tr>,
                  ...con.map((u) => (
                    <tr key={cd.ma + u.ma} className="border-t border-slate-100">
                      <td className="py-1 pl-5 text-slate-600">{u.ten}
                        {u.muc && <span className={`ml-1.5 rounded px-1 text-[10px] font-bold text-white ${u.muc === 'nang_cao' ? 'bg-violet-600' : 'bg-sky-500'}`}>{u.muc === 'nang_cao' ? 'NC' : 'CB'}</span>}</td>
                      <td><div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className={`h-full ${barCls(u.p)}`} style={{ width: `${u.p ?? 0}%` }} /></div></td>
                      <td className={`text-right ${pctCls(u.p)}`}>{u.p == null ? '—' : `${u.p}%`}</td>
                      <td className="text-right text-slate-400">{u.n}</td>
                      <td className="pr-1 text-right text-slate-500">{u.hang != null ? `${u.hang}/${u.tong}` : ''}</td>
                    </tr>
                  )),
                ]
              })}
            </tbody>
          </table>
        : <p className="text-slate-400">Chưa có lần đánh giá nào trong kì.</p>}

      {/* Phụ lục điểm thi toàn khối + lọc theo lớp để so sánh (Thùy 05/11). Hạng = hạng KHỐI tính ở DB; STT chỉ là thứ tự dòng đang hiện. */}
      {(() => {
        const pl = d.phu_luc
        const dsLop = [...new Set(pl.hs.map((h) => h.lop).filter((x): x is string => !!x))].sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
        const lopChon = lopPL === '__em' ? (d.lop.ten ?? '') : lopPL
        const ds = lopChon ? pl.hs.filter((h) => h.lop === lopChon || h.la_em) : pl.hs
        return <>
          <Muc phu={<>
            <select value={lopPL} onChange={(e) => setLopPL(e.target.value)} className="ml-1 h-6 rounded border border-slate-200 px-1 text-[11.5px] text-slate-700">
              <option value="__em">Lớp của em ({d.lop.ten ?? '—'})</option>
              <option value="">Cả khối ({pl.hs.length} em)</option>
              {dsLop.map((l) => <option key={l} value={l}>Lớp {l}</option>)}
            </select>
            <span className="ml-1.5">{ds.length} em · xếp theo hạng TB khối</span>
          </>}>Phụ lục điểm thi</Muc>
          {pl.hs.length
            ? <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full whitespace-nowrap text-[12px] tabular-nums">
                  <thead className="bg-slate-50"><tr className="text-[11px] text-slate-500">
                    <th className="px-2 py-1 text-right font-medium">STT</th><th className="px-2 py-1 text-left font-medium">Học sinh</th><th className="px-2 py-1 text-left font-medium">Lớp</th>
                    {pl.cot.map((c, i) => <th key={i} className="px-2 py-1 text-right font-medium">{c.nhan}</th>)}
                    <th className="px-2 py-1 text-right font-medium">Hạng TB</th><th className="px-2 py-1 text-right font-medium">Hạng khối</th>
                  </tr></thead>
                  <tbody>{ds.map((h, i) => (
                    <tr key={i} className={h.la_em ? 'bg-indigo-100 font-bold text-indigo-900' : 'border-t border-slate-100'}>
                      <td className="px-2 py-1 text-right text-slate-400">{i + 1}</td>
                      <td className="px-2 py-1">{h.ten}{h.la_em && ' ⭐'}</td><td className="px-2 py-1 text-slate-500">{h.lop ?? ''}</td>
                      {h.diem.map((v, j) => <td key={j} className="px-2 py-1 text-right">{v == null ? <span className="text-slate-300">—</span> : so1(v)}</td>)}
                      <td className="px-2 py-1 text-right">{so1(h.hang_tb)}</td><td className="px-2 py-1 text-right">{h.hang}</td>
                    </tr>))}</tbody>
                </table>
              </div>
            : <p className="text-slate-400">Chưa có lần thi nào trong kì.</p>}
        </>
      })()}
    </div>
  )
}
