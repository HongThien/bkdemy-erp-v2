// DASHBOARD BỔ TRỢ — tiến độ thực hiện theo TUẦN (Thùy 13/10: "tuần 30 chốt 50 ca bổ trợ yếu, thực tế mới chạy được 23/50 —
// để người quản trị nắm tình hình cụ thể. Hiện 3 tuần gần nhất").
// Mỗi tuần 1 thẻ, 3 dòng Yếu · Bù · Đuổi: ĐÃ CHẠY / CHỐT + thanh tiến độ + các ô trạng thái (bấm ô = xem đúng danh sách em đó).
// Số liệu + phân loại trạng thái tính ở DB (fn_bo_tro_dashboard_tuan); màn chỉ vẽ và lọc danh sách đang mở.
import { useEffect, useState } from 'react'
import { dashboardBoTroTuan, type TuanBT, type LoaiBT, type TtLuot, type SoLoai } from '../../lib/botro_dashboard'
import { congNgay, ddmmVN, thuCuaNgay, tuanCuaNgay } from '../../lib/tuan'
import KetQuaBoTroTuan from './KetQuaBoTroTuan'

const LOAI: { k: LoaiBT; ten: string; vach: string }[] = [
  { k: 'bo_tro_yeu', ten: 'Yếu', vach: 'border-l-amber-400' },
  { k: 'bu', ten: 'Bù', vach: 'border-l-sky-400' },
  { k: 'bo_tro_duoi', ten: 'Đuổi', vach: 'border-l-violet-400' },
  { k: 'bo_tro_hinh', ten: 'Hình', vach: 'border-l-fuchsia-400' },
]
// Thứ tự = thứ tự trên thanh tiến độ. `thanh` = màu đoạn trên thanh; `pill` = ô trạng thái (pill mềm, không khối đặc).
const TT: { k: Exclude<TtLuot, 'go'>; ten: string; thanh: string; pill: string; giai: string }[] = [
  { k: 'hoan_tat', ten: 'Hoàn tất', thanh: 'bg-emerald-500', pill: 'border-emerald-200 bg-emerald-50 text-emerald-700', giai: 'Em có mặt, ca đã đóng / đánh giá xong' },
  { k: 'dang_do', ten: 'Đang dở', thanh: 'bg-sky-400', pill: 'border-sky-200 bg-sky-50 text-sky-700', giai: 'Em có mặt nhưng ca chưa đóng xong (đang học · chờ test · chờ đánh giá)' },
  { k: 'vang', ten: 'Vắng', thanh: 'bg-rose-300', pill: 'border-rose-200 bg-rose-50 text-rose-700', giai: 'Điểm danh vắng' },
  { k: 'khong_dien_ra', ten: 'Không diễn ra', thanh: 'bg-rose-400', pill: 'border-rose-200 bg-rose-50 text-rose-700', giai: 'Ca bị huỷ: qua ngày không điểm danh hoặc huỷ tay' },
  { k: 'qua_han', ten: 'Quá ngày chưa điểm danh', thanh: 'bg-amber-400', pill: 'border-amber-200 bg-amber-50 text-amber-800', giai: 'Đã qua ngày mà chưa ai điểm danh, ca còn mở' },
  { k: 'cho', ten: 'Chưa tới', thanh: 'bg-slate-200', pill: 'border-slate-200 bg-slate-50 text-slate-600', giai: 'Chưa tới ngày, hoặc hôm nay chưa điểm danh' },
]
const TEN_TT: Record<TtLuot, string> = { ...Object.fromEntries(TT.map((x) => [x.k, x.ten])) as Record<Exclude<TtLuot, 'go'>, string>, go: 'Đã gỡ khỏi lịch' }
const PILL_TT: Record<TtLuot, string> = { ...Object.fromEntries(TT.map((x) => [x.k, x.pill])) as Record<Exclude<TtLuot, 'go'>, string>, go: 'border-slate-200 bg-white text-slate-500' }
const hhmm = (t: string | null) => (t ? t.slice(0, 5) : '')
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0)

// Rời màn rồi quay lại = đúng chỗ cũ (CLAUDE.md §2): nhớ tuần đang xem + ô đang mở + dữ liệu đã tải.
type Mo = { tu: string; loai: LoaiBT; tt: TtLuot } | null
const NHO: { den: string | null; mo: Mo; rows: TuanBT[] | null; kq: string | null } = { den: null, mo: null, rows: null, kq: null } // kq = tuần (tu) đang mở panel 'Kết quả'

export default function BoTroDashboardScreen() {
  const [den, setDenState] = useState<string | null>(NHO.den) // null = tuần này
  const [rows, setRows] = useState<TuanBT[] | null>(NHO.rows)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const [mo, setMoState] = useState<Mo>(NHO.mo)
  const setMo = (m: Mo) => { NHO.mo = m; setMoState(m) }
  const [kqTu, setKqTuState] = useState<string | null>(NHO.kq)
  const setKqTu = (v: string | null) => { NHO.kq = v; setKqTuState(v) }

  async function tai(d: string | null) {
    setDangTai(true); setLoi(null)
    try { const r = await dashboardBoTroTuan(d, 3); NHO.rows = r; setRows(r) } // giữ số cũ tới khi có số mới — không trắng màn
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDangTai(false) }
  }
  useEffect(() => { tai(den) }, [den])
  const doiTuan = (d: string | null) => { NHO.den = d; setMo(null); setDenState(d) }
  const tuanCuoi = rows?.[0]

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#f5f5f7] px-8 py-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Tiến độ bổ trợ theo tuần</h2>
          <p className="text-[12.5px] text-slate-500">Mỗi tuần đã chốt (xếp lịch) bao nhiêu ca, thực tế chạy được bao nhiêu. Đếm theo lượt học sinh trong ca, tuần tính Thứ 2 → Chủ nhật.</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button disabled={!tuanCuoi || dangTai} onClick={() => tuanCuoi && doiTuan(congNgay(tuanCuoi.tu, -7))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">◀ Tuần trước</button>
          <button disabled={!tuanCuoi || dangTai || tuanCuoi.dang_chay} onClick={() => tuanCuoi && doiTuan(congNgay(tuanCuoi.tu, 7))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Tuần sau ▶</button>
          <button disabled={dangTai || den === null} onClick={() => doiTuan(null)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[13px] font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-40">Tuần này</button>
          <button disabled={dangTai} onClick={() => tai(den)} title="Tải lại số liệu"
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40">{dangTai ? '…' : '↻'}</button>
        </div>
      </div>

      {loi && <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] text-rose-700">Không tải được số liệu: {loi}</p>}
      {rows === null && !loi && <p className="py-16 text-center text-[13.5px] text-slate-400">Đang tải…</p>}

      <div className="flex flex-col gap-4">
        {(rows ?? []).map((w) => <TheTuan key={w.tu} w={w} mo={mo?.tu === w.tu ? mo : null} onMo={setMo} kqMo={kqTu === w.tu} onKq={(b) => setKqTu(b ? w.tu : null)} />)}
      </div>

      {rows && rows.length > 0 && (
        <div className="mt-5 rounded-2xl bg-white px-5 py-4 text-[12.5px] leading-relaxed text-slate-500 shadow-sm">
          <p className="mb-1 font-semibold text-slate-700">Cách đếm</p>
          <p><b className="text-slate-700">Chốt</b> = mọi lượt đã xếp có ngày nằm trong tuần, kể cả ca sau đó vắng / không diễn ra. Ca đã <b className="text-slate-700">gỡ khỏi lịch</b> (đổi lịch ở Lịch phòng) không tính vào chốt, ghi riêng ở cuối dòng.</p>
          <p><b className="text-slate-700">Đã chạy</b> = em có mặt (Hoàn tất + Đang dở).</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {TT.map((x) => <span key={x.k} className="inline-flex items-center gap-1.5"><span className={`inline-block h-2.5 w-2.5 rounded-sm ${x.thanh}`} />{x.ten}: {x.giai}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}

function TheTuan({ w, mo, onMo, kqMo, onKq }: { w: TuanBT; mo: Mo; onMo: (m: Mo) => void; kqMo: boolean; onKq: (b: boolean) => void }) {
  const so = tuanCuaNgay(w.tu)
  const tong = w.tong // tổng cả 3 loại — tính ở DB
  const ds = mo ? w.ds.filter((x) => x.loai === mo.loai && x.tt === mo.tt) : []
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-[17px] font-semibold text-slate-800">{so <= 0 ? 'Tuần khởi động' : `Tuần ${so}`}</h3>
        <span className="text-[13px] text-slate-500">{ddmmVN(w.tu)} – {ddmmVN(w.den)}</span>
        {w.dang_chay && <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-indigo-700">đang chạy</span>}
        {w.tuong_lai && <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-slate-500">chưa tới</span>}
        <span className="ml-auto text-[13px] text-slate-500">Cả 3 loại: đã chạy <b className="text-[15px] text-slate-800">{tong.da_chay}</b> / chốt <b className="text-[15px] text-slate-800">{tong.chot}</b> ca{tong.chot > 0 ? ` · ${pct(tong.da_chay, tong.chot)}%` : ''}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {LOAI.map((l) => <DongLoai key={l.k} ten={l.ten} vach={l.vach} s={w.loai[l.k]} dangMo={mo?.loai === l.k ? mo.tt : null}
          onMo={(tt) => onMo(mo && mo.loai === l.k && mo.tt === tt ? null : { tu: w.tu, loai: l.k, tt })}
          onKetQua={l.k === 'bo_tro_yeu' && !w.tuong_lai && w.loai.bo_tro_yeu.da_chay > 0 ? () => onKq(!kqMo) : undefined} ketQuaMo={kqMo} />)}
      </div>
      {kqMo && <KetQuaBoTroTuan tu={w.tu} den={w.den} onDong={() => onKq(false)} />}
      {mo && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[13px] font-semibold text-slate-700">{LOAI.find((l) => l.k === mo.loai)?.ten} · {TEN_TT[mo.tt]} — {ds.length} lượt</span>
            <button onClick={() => onMo(null)} className="ml-auto text-[12.5px] text-slate-500 hover:text-slate-700">Đóng ✕</button>
          </div>
          {ds.length === 0 ? <p className="text-[12.5px] text-slate-400">Không có lượt nào.</p> : (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 text-[11.5px] uppercase tracking-wide text-slate-500">
                  <tr><th className="px-3 py-1.5 font-semibold">Học sinh</th><th className="px-3 py-1.5 font-semibold">Lớp</th><th className="px-3 py-1.5 font-semibold">Ngày · giờ</th><th className="px-3 py-1.5 font-semibold">Người dạy</th><th className="px-3 py-1.5 font-semibold">Ghi chú</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ds.map((x, i) => (
                    <tr key={`${x.buoi_id}-${x.ma_hs ?? i}`}>
                      <td className="px-3 py-1.5 font-medium text-slate-800">{x.ho_ten}{x.ma_hs ? <span className="ml-1.5 text-[11.5px] font-normal text-slate-400">{x.ma_hs}</span> : null}</td>
                      <td className="px-3 py-1.5 text-slate-600">{x.lop ?? '—'}</td>
                      <td className="px-3 py-1.5 text-slate-600">{thuCuaNgay(x.ngay)} {ddmmVN(x.ngay)}{x.gio_bat_dau ? ` · ${hhmm(x.gio_bat_dau)}` : ''}</td>
                      <td className="px-3 py-1.5 text-slate-600">{x.nguoi ?? <span className="text-amber-700">chưa có người dạy</span>}</td>
                      <td className="px-3 py-1.5 text-slate-500">{x.ly_do ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DongLoai({ ten, vach, s, dangMo, onMo, onKetQua, ketQuaMo }: { ten: string; vach: string; s: SoLoai; dangMo: TtLuot | null; onMo: (tt: TtLuot) => void; onKetQua?: () => void; ketQuaMo?: boolean }) {
  return (
    <div className={`rounded-xl border border-slate-200/70 border-l-4 ${vach} px-4 py-3`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="w-12 text-[15px] font-semibold text-slate-800">{ten}</span>
        <span className="w-[150px] whitespace-nowrap">
          <b className="text-[22px] font-semibold leading-none text-emerald-600">{s.da_chay}</b>
          <span className="text-[15px] text-slate-400"> / </span>
          <b className="text-[18px] font-semibold leading-none text-slate-800">{s.chot}</b>
          <span className="ml-1.5 text-[12.5px] text-slate-500">ca{s.chot > 0 ? ` · ${pct(s.da_chay, s.chot)}%` : ''}</span>
        </span>
        <div className="flex h-3 min-w-[180px] flex-1 overflow-hidden rounded-full bg-slate-100" title={`Đã chạy ${s.da_chay} / chốt ${s.chot}`}>
          {s.chot > 0 && TT.map((x) => s[x.k] > 0 && <div key={x.k} className={x.thanh} style={{ width: `${(s[x.k] / s.chot) * 100}%` }} title={`${x.ten}: ${s[x.k]}`} />)}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-16">
        {s.chot === 0 && s.go === 0 && <span className="text-[12.5px] text-slate-400">Tuần này chưa xếp ca nào.</span>}
        {TT.map((x) => s[x.k] > 0 && (
          <button key={x.k} onClick={() => onMo(x.k)} title={`${x.giai} — bấm để xem danh sách`}
            className={`rounded-full border px-2.5 py-0.5 text-[12.5px] font-medium transition ${x.pill} ${dangMo === x.k ? 'ring-2 ring-indigo-300' : 'hover:brightness-95'}`}>
            {x.ten} <b>{s[x.k]}</b>
          </button>
        ))}
        {onKetQua && (
          <button onClick={onKetQua} title="Xem từng ca × từng em: dạng đã học, trước ca → nay, luyện/test — giảm được bao nhiêu dạng yếu"
            className={`ml-auto rounded-full border px-3 py-0.5 text-[12.5px] font-semibold ${ketQuaMo ? 'border-indigo-300 bg-indigo-600 text-white' : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>📊 Kết quả bổ trợ</button>
        )}
        {s.go > 0 && (
          <button onClick={() => onMo('go')} title="Ca đã gỡ khỏi lịch (đổi lịch) — không tính vào chốt. Bấm để xem danh sách"
            className={`ml-1 rounded-full border px-2.5 py-0.5 text-[12.5px] font-medium ${PILL_TT.go} ${dangMo === 'go' ? 'ring-2 ring-indigo-300' : 'hover:bg-slate-50'}`}>
            Đã gỡ khỏi lịch <b>{s.go}</b> <span className="text-slate-400">(không tính)</span>
          </button>
        )}
      </div>
    </div>
  )
}
