// Tab "Đánh giá ca bổ trợ" (PLAN-botro-yeu.md §12) — case đã dạy+đóng hết dạng (derive từ
// TrangThaiCaBoTroScreen). Detail: điểm TRƯỚC/SAU từng dạng (nguồn = mọi lần đo thật, không phải
// 1 bài "retest" riêng — mastery vốn suy động từ MỌI lần đo, đúng CLAUDE.md §1). Chọn 1 trong 5
// hành vi tiếp theo → đóng case + (nếu cần) mở case MỚI, `case_truoc_id` tự nối (moHoacGopCaseBoTroYeu).
import { useEffect, useMemo, useState } from 'react'
import {
  listCaseChoDanhGia, getDanhGiaCase, dongCase, moHoacGopCaseBoTroYeu,
  type CaseHoanThanh, type DangDanhGia,
} from '../../lib/botro_yeu'
import { duyetLevel } from '../../lib/danhgia'

const scoreCls = (v: number | null) => v == null ? 'bg-slate-100 text-slate-400' : v < 0.5 ? 'bg-rose-50 text-rose-700' : v < 0.8 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
const fmt = (v: number | null) => v == null ? '—' : v.toFixed(2)

type HanhVi = { key: string; ten: string; muc: string | null; chot: number | null; giu: boolean }
const HANH_VI: HanhVi[] = [
  { key: 'xong', ten: 'Xong, không cần bổ trợ nữa', muc: null, chot: 0, giu: false },
  { key: 'theodoi', ten: 'Cần theo dõi thêm', muc: null, chot: 0, giu: false },
  { key: 'muc_thap', ten: 'Bổ trợ thêm mức thấp hơn — sau giờ', muc: 'L1', chot: 1, giu: true },
  { key: 'doi_nguoi', ten: 'Bổ trợ lại, đổi người — cùng mức', muc: 'L2', chot: 2, giu: true },
  { key: 'nang_muc', ten: 'Nâng mức — chuyển giáo viên cao cấp', muc: 'L3', chot: 3, giu: true },
]

export default function DanhGiaCaBoTroScreen() {
  const [items, setItems] = useState<CaseHoanThanh[]>([])
  const [loading, setLoading] = useState(true)
  const [moId, setMoId] = useState<string | null>(null)

  const reload = () => { setLoading(true); listCaseChoDanhGia().then(setItems).finally(() => setLoading(false)) }
  useEffect(() => { reload() }, [])

  const moCase = items.find((c) => c.id === moId) ?? null

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-6">
          <h1 className="text-[22px] font-bold text-slate-800">Đánh giá ca bổ trợ</h1>
          <p className="mt-1 text-[13px] text-slate-500">Case đã dạy + đóng hết dạng — quyết định hành vi tiếp theo dựa trên điểm trước/sau.</p>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">
            Chưa có case nào sẵn sàng đánh giá — cần dạy xong + đóng hết dạng trước (xem "Trạng thái ca bổ trợ").
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <button key={c.id} onClick={() => setMoId(c.id)}
                className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition hover:ring-indigo-300">
                <div className="text-[14px] font-semibold text-slate-800">
                  {c.ho_ten} <span className="font-normal text-slate-400">· {c.mon}</span>
                  {c.caseTruocId && <span className="ml-2 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">đợt tiếp theo</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {moCase && <DanhGiaModal c={moCase} onDong={() => setMoId(null)} onXong={() => { setMoId(null); reload() }} />}
    </section>
  )
}

function DanhGiaModal({ c, onDong, onXong }: { c: CaseHoanThanh; onDong: () => void; onXong: () => void }) {
  const [dangs, setDangs] = useState<DangDanhGia[]>([])
  const [loading, setLoading] = useState(true)
  const [chon, setChon] = useState<string>('muc_thap')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  useEffect(() => { getDanhGiaCase(c.id, c.hoc_sinh_id, c.mon).then(setDangs).finally(() => setLoading(false)) }, [c.id, c.hoc_sinh_id, c.mon]) // eslint-disable-line

  const dongHet = dangs.every((d) => d.sau != null && d.sau >= 0.5)
  const tomTat = useMemo(() => {
    const dong = dangs.filter((d) => d.sau != null && d.sau >= 0.5).length
    if (dangs.length === 0) return ''
    if (dong === dangs.length) return 'Hiệu quả tốt — tất cả dạng đã đóng.'
    if (dong === 0) return 'Không hiệu quả — chưa dạng nào đóng dù đã dạy đủ.'
    return `Chưa rõ ràng — ${dong}/${dangs.length} dạng đóng, còn lại chưa vượt ngưỡng.`
  }, [dangs])

  async function xacNhan() {
    const hv = HANH_VI.find((h) => h.key === chon)!
    setBusy(true); setLoi(null)
    try {
      await dongCase(c.id)
      if (hv.giu && hv.chot != null) {
        const conYeu = dangs.filter((d) => d.sau == null || d.sau < 0.5).map((d) => d.ma_dang)
        await moHoacGopCaseBoTroYeu({ hocSinhId: c.hoc_sinh_id, mon: c.mon, maDangs: conYeu, nguon: 'thu_cong', lyDo: `Đánh giá: ${hv.ten}` })
        await duyetLevel({ hocSinhId: c.hoc_sinh_id, mon: c.mon, loai: 'kien_thuc', levelChot: hv.chot, lyDoNguoi: `Đánh giá ca bổ trợ: ${hv.ten}` })
      } else if (hv.chot != null) {
        await duyetLevel({ hocSinhId: c.hoc_sinh_id, mon: c.mon, loai: 'kien_thuc', levelChot: hv.chot, lyDoNguoi: `Đánh giá ca bổ trợ: ${hv.ten}` })
      }
      onXong()
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onDong}>
      <div className="max-h-[85vh] w-[640px] max-w-full overflow-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-[16px] font-bold text-slate-800">Đánh giá hiệu suất — {c.ho_ten} · {c.mon}</h3>
          <button onClick={onDong} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {loading ? <p className="text-[13px] text-slate-400">Đang tải…</p> : (
          <>
            <table className="mb-4 w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] uppercase text-slate-400">
                  <th className="pb-2">Dạng</th><th className="pb-2">Trước</th><th className="pb-2">Sau</th><th className="pb-2">Đóng?</th>
                </tr>
              </thead>
              <tbody>
                {dangs.map((d) => (
                  <tr key={d.ma_dang} className="border-t border-slate-100">
                    <td className="py-2 pr-2">{d.ten_dang}<span className="ml-1 text-[10px] text-slate-400">{d.nTruoc} lần trước</span></td>
                    <td className="py-2"><span className={`rounded px-1.5 py-0.5 font-bold tabular-nums ${scoreCls(d.truoc)}`}>{fmt(d.truoc)}</span></td>
                    <td className="py-2"><span className={`rounded px-1.5 py-0.5 font-bold tabular-nums ${scoreCls(d.sau)}`}>{fmt(d.sau)}</span></td>
                    <td className="py-2">{d.sau != null && d.sau >= 0.5 ? <span className="text-emerald-600">✓</span> : <span className="text-slate-300">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={`mb-4 rounded-xl p-3 text-[13px] ${dongHet ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{tomTat}</div>

            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">Chọn hành vi tiếp theo</div>
            <div className="space-y-1.5">
              {HANH_VI.map((h) => (
                <label key={h.key} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[13px] ${chon === h.key ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200'}`}>
                  <input type="radio" checked={chon === h.key} onChange={() => setChon(h.key)} />
                  <span>{h.ten}</span>
                  {h.muc && <span className="ml-auto text-[11px] text-slate-400">{h.muc}</span>}
                </label>
              ))}
            </div>
            {loi && <p className="mt-2 text-[12px] text-rose-600">{loi}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onDong} className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50">Đóng, chưa quyết</button>
              <button onClick={xacNhan} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                {busy ? 'Đang lưu…' : 'Xác nhận quyết định'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
