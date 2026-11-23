// "THEO TUẦN" — trưởng bộ môn / giám đốc xem kết quả học tập của MỌI KHỐI theo từng tuần (Thùy 19/11 tuần đang chạy · 23/11 "view theo tuần, xem bản chốt tuần trước").
// Mở tab / đổi tuần = MỘT lượt gọi fn_bctk_tuan: tuần đang chạy đọc sổ tính sẵn bctk_so_hien_tai_o (làm mới nền 30 phút/lần) · tuần đã đóng đọc SỔ CHỐT bctk_so_tuan_o.
// Bấm một khối = một lượt fn_bctk_tuan_o (tính trực tiếp đúng khối đó của tuần đang xem) ⇒ hiện báo cáo đủ của khối (Vận hành · Học tập) ngay bên dưới.
// Client KHÔNG tính số nào: tổng môn do DB gom (_bctk_gom_tong). Ô = số to ở trên, chú thích nhỏ ở dưới; mọi cột căn trái.
import { useEffect, useState, type ReactNode } from 'react'
import { hienTaiCacKhoi, hienTaiMotKhoi, type HienTai, type SoBaoCao, type TongSo } from '../../lib/baoCaoTuan'
import { congNgay, ddmmVN } from '../../lib/tuan'
import { nhoBen } from '../../lib/nho'
import { NoiDungBaoCao } from './NoiDungBaoCao'

// rời tab quay lại = đúng chỗ cũ, không trắng (CLAUDE §2 React); chỉ nhớ lựa chọn khối đang mở qua F5
// số theo khoá tuần ('' = tuần đang chạy) · tuần đang xem nhớ trong ngày
const NHO = nhoBen<{ tuan: string; d: Record<string, HienTai>; mo: string | null; ct: Record<string, SoBaoCao> }>('bao_cao_tuan_nay', { tuan: '', d: {}, mo: null, ct: {} }, { luu: ['mo'], trongNgay: ['tuan'] })
const gio = (ts: string | null | undefined) => ts ? new Date(ts).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }) : '—'
const gioNgay = (ts: string | null | undefined) => ts ? new Date(ts).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'
const pt = (p: number | null | undefined) => (p == null ? '—' : `${p}%`)
const khong = () => {}
type OSo = { so: ReactNode; chu?: string; mau?: string } | null
const giam = (n: number | null | undefined, chu: string): OSo => n == null ? null
  : { so: n > 0 ? `Giảm ${n}` : n < 0 ? `Tăng ${-n}` : 'Không đổi', chu, mau: n > 0 ? 'text-emerald-600' : n < 0 ? 'text-rose-600' : 'text-slate-600' }

// 8 ô của một dòng (một khối hoặc tổng môn) — chỉ chọn số DB đã trả để hiển thị
function oCuaDong(x: Partial<TongSo> | null): OSo[] {
  if (!x) return Array(8).fill(null)
  const n = x.hai_chieu?.nhom, d = x.hai_chieu?.dang, h1 = x.hs_yeu, h = x.ht
  return [
    n ? { so: `Giảm ${n.het_yeu}`, chu: `${n.dau} → còn ${n.con_yeu} (${pt(n.ti_le_het_yeu)}) · mới +${n.phat_sinh}`, mau: 'text-emerald-600' } : null,
    d ? { so: `Giảm ${d.het_yeu}`, chu: `${d.dau} → còn ${d.con_yeu} (${pt(d.ti_le_het_yeu)}) · mới +${d.phat_sinh}`, mau: 'text-emerald-600' } : null,
    h1?.dau == null ? null : giam(h1.giam, `${h1.dau} → ${h1.cuoi ?? '—'} em · sĩ số ${h1.si_so}`),
    h?.hs_yeu_2.dau == null ? null : giam(h.hs_yeu_2.giam, `${h.hs_yeu_2.dau} → ${h.hs_yeu_2.cuoi ?? '—'} em`),
    h?.xep ? { so: pt(h.xep.ti_le_2), chu: `${h.xep.xep_2}/${h.xep.yeu_2} em yếu được xếp`, mau: 'text-indigo-600' } : null,
    h && h.hieu_suat.don_vi > 0 ? { so: pt(h.hieu_suat.ti_le), chu: `${h.hieu_suat.het_yeu}/${h.hieu_suat.don_vi} đơn vị hết yếu`, mau: 'text-emerald-600' } : h ? { so: '—', chu: 'chưa có bài test bổ trợ', mau: 'text-slate-300' } : null,
    h && h.vang.da_diem_danh > 0 ? { so: pt(h.vang.ti_le), chu: `${h.vang.vang}/${h.vang.da_diem_danh} lượt · đã xếp ${h.vang.luot_xep}`, mau: h.vang.vang > 0 ? 'text-rose-600' : 'text-emerald-600' } : h ? { so: '—', chu: `đã xếp ${h.vang.luot_xep} lượt, chưa điểm danh`, mau: 'text-slate-300' } : null,
    h?.chua_xu_ly ? { so: `${h.chua_xu_ly.n1} em`, chu: `≥ 2 nhóm yếu: ${h.chua_xu_ly.n2} em`, mau: h.chua_xu_ly.n1 > 0 ? 'text-rose-600' : 'text-emerald-600' } : null,
  ]
}
const COT = ['Nhóm yếu', 'Dạng yếu', 'HS yếu (≥ 1 nhóm)', 'HS yếu (≥ 2 nhóm)', 'Xếp bổ trợ', 'Hiệu suất bổ trợ', 'Vắng ca bổ trợ', 'Chưa ai xử lý']

export default function TuanNayTBM({ mon }: { mon: string | null }) {
  const [tuan, setTuanS] = useState<string>(NHO.tuan)   // '' = tuần đang chạy
  const setTuan = (t: string) => { NHO.tuan = t; setTuanS(t) }
  const [dMap, setDMap] = useState<Record<string, HienTai>>(NHO.d)
  const d = dMap[tuan] ?? null
  const [loi, setLoi] = useState<string | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const [mo, setMoS] = useState<string | null>(NHO.mo)   // khoá `${môn}|${khối}` đang mở chi tiết
  const setMo = (k: string | null) => { NHO.mo = k; setMoS(k) }
  const [ct, setCt] = useState<Record<string, SoBaoCao>>(NHO.ct)
  const [loiCt, setLoiCt] = useState<string | null>(null)

  const tai = (t: string) => {   // giữ bảng cũ tới khi có bảng mới — không bao giờ trắng
    setDangTai(true); setLoi(null)
    hienTaiCacKhoi(t || null).then((x) => { NHO.d = { ...NHO.d, [t]: x }; setDMap(NHO.d) }).catch((e) => setLoi(e?.message ?? String(e))).finally(() => setDangTai(false))
  }
  useEffect(() => { if (!NHO.d[tuan]) tai(tuan) }, [tuan]) // eslint-disable-line react-hooks/exhaustive-deps
  const [dangXem, setDangXem] = useState<HienTai | null>(d)   // đổi tuần: giữ bảng tuần cũ (mờ) tới khi có tuần mới
  useEffect(() => { if (d) setDangXem(d) }, [d])
  const doiTuan = (n: number) => {   // đổi tuần = đổi ngữ cảnh; tuần chọn ≥ tuần này ⇒ khoá '' (đang chạy)
    const goc = d ?? dangXem
    if (!goc) return
    const moi = congNgay(goc.tuan, 7 * n)
    setTuan(moi >= goc.tuan_nay ? '' : moi)
  }
  const khoaCt = mo ? `${tuan}#${mo}` : null
  useEffect(() => {   // bấm đến đâu gọi đến đấy: chi tiết một khối chỉ tính khi mở khối đó (của tuần đang xem)
    if (!mo || !khoaCt || ct[khoaCt]) return
    const [m, k] = mo.split('|')
    let con = true
    setLoiCt(null)
    hienTaiMotKhoi(m, k, tuan || null).then((x) => { if (con) { NHO.ct = { ...NHO.ct, [khoaCt]: x }; setCt(NHO.ct) } }).catch((e) => con && setLoiCt(e?.message ?? String(e)))
    return () => { con = false }
  }, [khoaCt]) // eslint-disable-line react-hooks/exhaustive-deps

  const v = d ?? dangXem   // bảng đang hiện (tuần mới chưa về thì giữ tuần cũ, mờ)
  if (loi && !v) return <p className="text-[13px] text-rose-600">Lỗi: {loi}</p>
  if (!v) return <p className="text-[13px] text-slate-400">Đang tải số của tuần…</p>
  const cacMon = v.mon.filter((m) => !mon || m.mon === mon)
  const cho = dangTai || !d   // đang đổi tuần / đọc lại
  const td = 'border-t border-slate-100 px-3 py-2 text-left align-top'
  const o = (x: OSo) => x == null ? <span className="text-[17px] font-bold text-slate-300">—</span> : (
    <>
      <div className={`whitespace-nowrap text-[17px] font-extrabold leading-tight tabular-nums ${x.mau ?? 'text-slate-800'}`}>{x.so}</div>
      {x.chu && <div className="text-[11.5px] leading-snug text-slate-500">{x.chu}</div>}
    </>
  )
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => doiTuan(-1)} disabled={cho} title="Tuần trước" className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40">‹</button>
        <span className="text-[14.5px] font-bold text-slate-800">Kết quả học tập · tuần {ddmmVN(v.tuan)} – {ddmmVN(v.den)}</span>
        <button onClick={() => doiTuan(1)} disabled={cho || v.dang_chay} title="Tuần sau" className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40">›</button>
        {v.dang_chay
          ? <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700">đang chạy — đầu tuần → hiện tại</span>
          : v.co_chot ? <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[12px] font-semibold text-slate-700">bản chốt — đầu tuần → cuối tuần</span>
          : <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[12px] font-semibold text-amber-800">chưa có bản chốt</span>}
        {!v.dang_chay && <button onClick={() => setTuan('')} disabled={cho} className="rounded-lg px-2 py-1 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-40">Về tuần này</button>}
        <button onClick={() => tai(tuan)} disabled={cho} title="Đọc lại" className="rounded-full px-2 py-1 text-[13px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-40">↻</button>
        {loi && <span className="text-[12px] text-rose-600">{loi}</span>}
        <span className="ml-auto text-[12px] text-slate-400">{v.dang_chay ? 'Số tự làm mới khoảng 30 phút một lần' : 'Số chốt một lần khi tuần đóng, không đổi'} · bấm một khối để xem báo cáo đủ của khối đó</span>
      </div>
      {cacMon.map((m) => (
        <div key={m.mon} className={`overflow-x-auto rounded-xl border border-slate-200 bg-white ${cho ? 'opacity-60' : ''}`}>
          <table className="w-full min-w-[1250px] table-fixed text-[13px]">
            <colgroup><col className="w-[11%]" />{COT.map((c) => <col key={c} />)}</colgroup>
            <thead><tr className="bg-slate-50 text-left text-[10.5px] uppercase tracking-wider text-slate-400">
              <th className="px-3 py-2">{m.mon}{!m.tinh_at ? '' : v.dang_chay ? ` · tính lúc ${gio(m.tinh_at)}` : ` · chốt ${gioNgay(m.tinh_at)}`}</th>
              {COT.map((c) => <th key={c} className="px-3 py-2">{c}</th>)}
            </tr></thead>
            <tbody>
              {m.khoi.length === 0 && <tr><td colSpan={9} className={`${td} text-slate-400`}>{v.dang_chay ? 'Chưa có số của tuần này (lượt làm mới kế tiếp sẽ có).' : 'Tuần này chưa có bản chốt (thiếu ảnh dạng yếu đầu hoặc cuối tuần).'}</td></tr>}
              {m.khoi.length > 1 && (
                <tr className="bg-indigo-50/40">
                  <td className={td}><div className="text-[14.5px] font-bold text-slate-800">Cả môn</div><div className="text-[11.5px] text-slate-500">{m.khoi.length} khối</div></td>
                  {oCuaDong(m.tong).map((x, i) => <td key={i} className={td}>{o(x)}</td>)}
                </tr>
              )}
              {m.khoi.map((k) => {
                const khoa = `${m.mon}|${k.khoi}`
                return (
                  <tr key={k.khoi} onClick={() => setMo(mo === khoa ? null : khoa)} className={`cursor-pointer hover:bg-slate-50 ${mo === khoa ? 'bg-indigo-50' : ''}`}>
                    <td className={td}>
                      <div className="text-[14.5px] font-bold text-slate-800">Khối {k.khoi} <span className="text-[11px] font-medium text-indigo-600">{mo === khoa ? '▴' : '▾'}</span></div>
                      <div className={`truncate text-[11.5px] ${k.truong ? 'text-slate-500' : 'font-semibold text-rose-600'}`}>{k.truong ?? 'chưa có trưởng khối'}</div>
                    </td>
                    {oCuaDong(k.tong).map((x, i) => <td key={i} className={td}>{o(x)}</td>)}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
      {cacMon.length === 0 && <p className="text-[13px] text-slate-400">Không có môn nào trong phạm vi.</p>}
      <p className="text-[11.5px] text-slate-400">
        Giảm = số nhóm / dạng yếu đầu tuần nay đã hết yếu · "mới" = nhóm / dạng mới bị yếu trong tuần · Xếp bổ trợ = HS yếu đầu tuần (≥ 2 nhóm yếu) có tên trong ca bổ trợ của tuần ·
        Hiệu suất = đơn vị (1 em × 1 dạng) hết yếu / đơn vị được test · Vắng = lượt vắng / lượt đã điểm danh.
      </p>

      {mo && (
        <div className="space-y-2 rounded-xl border border-indigo-200 bg-indigo-50/30 p-3">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-slate-800">Khối {mo.split('|')[1]}{mo.split('|')[0] === mon || cacMon.length === 1 ? '' : ` · ${mo.split('|')[0]}`} — báo cáo tuần {ddmmVN(v.tuan)}{v.dang_chay ? ' (đang chạy)' : ''}</span>
            <span className="text-[12px] text-slate-400">số tính trực tiếp lúc mở</span>
            <button onClick={() => setMo(null)} className="ml-auto rounded-lg px-2.5 py-1 text-[12px] font-semibold text-slate-500 hover:bg-white">Đóng ✕</button>
          </div>
          {loiCt ? <p className="text-[13px] text-rose-600">{loiCt}</p>
            : !khoaCt || !ct[khoaCt] || !d ? <p className="text-[13px] text-slate-400">Đang tính báo cáo của khối…</p>
            : <NoiDungBaoCao duLieu={ct[khoaCt]} caNhan={[]} setCaNhan={khong} tuViet={{}} setTuViet={khong} sua={false} anChu />}
        </div>
      )}
    </div>
  )
}
