// KẾT QUẢ BỔ TRỢ YẾU của 1 tuần (Thùy 26/10): "cần biết từng học sinh bổ trợ đã đạt được gì sau ca — bấm vào số ca ra chi tiết từng ca".
// Mở từ dòng Yếu của thẻ tuần ở Dashboard. Đầu panel: giảm được bao nhiêu dạng yếu / của bao nhiêu em / trong bao nhiêu ca. Dưới: từng (ca × em),
// bấm mở ra từng dạng: trạng thái TRƯỚC ca → SAU ca, luyện đúng/tổng, test cuối ca đúng/tổng, nhãn tiến bộ.
// "Giảm" = dạng yếu TRƯỚC ca mà SAU ca không còn yếu (mastery đo đến 00:00 ngày ca vs hết ngày ca — cố định, không đổi theo lúc xem). Mọi số tính ở DB (fn_botro_ket_qua_tuan).
import { useEffect, useMemo, useState } from 'react'
import { ketQuaBoTroTuan, type KetQuaTuan, type CaKetQua, type DangKetQua, type TienBo, type MucDang } from '../../lib/botro_dashboard'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

const NHO = new Map<string, KetQuaTuan>() // rời màn rồi quay lại = còn số đã tải (bấm ↻ để tính lại)
const hhmm = (t: string | null) => (t ? t.slice(0, 5) : '')
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0)
const MUC: Record<string, { ten: string; cls: string }> = {
  yeu: { ten: 'Yếu', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  can_luyen: { ten: 'Cần luyện', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  dat: { ten: 'Đạt', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}
const TIEN_BO: Record<TienBo, { ten: string; cls: string; giai: string }> = {
  giam: { ten: '✅ Hết yếu', cls: 'text-emerald-700', giai: 'Yếu trước ca, sau ca không còn yếu' },
  van_yeu: { ten: '⚠ Vẫn yếu', cls: 'text-rose-700', giai: 'Yếu trước ca và sau ca vẫn yếu' },
  khac: { ten: '— không yếu từ trước', cls: 'text-slate-400', giai: 'Trước ca dạng này đã không ở mức Yếu (đã cải thiện từ lúc mở case)' },
  chua_do: { ten: '? chưa đo trước ca', cls: 'text-slate-400', giai: 'Trước ca chưa có số đo của dạng này nên không so được' },
}
function ChipMuc({ muc, score, n }: { muc: MucDang; score: number | null; n: number | null }) {
  const m = muc ? MUC[muc] : null
  if (!m) return <span className="text-[11.5px] text-slate-400">{muc ? muc : 'chưa đo'}</span>
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-px text-[11.5px] font-semibold ${m.cls}`} title={n != null ? `${n} lần đo` : undefined}>{m.ten}{score != null ? <span className="font-normal opacity-80">{Math.round(score * 100)}%</span> : null}</span>
}
const nGiam = (c: CaKetQua) => c.dang.filter((d) => d.tien_bo === 'giam').length
const nVan = (c: CaKetQua) => c.dang.filter((d) => d.tien_bo === 'van_yeu').length
type Loc = 'tat_ca' | 'co_giam' | 'con_yeu' | 'khong_hoc'

export default function KetQuaBoTroTuan({ tu, den, onDong }: { tu: string; den: string; onDong: () => void }) {
  const key = `${tu}|${den}`
  const [kq, setKq] = useState<KetQuaTuan | null>(NHO.get(key) ?? null)
  const [loi, setLoi] = useState<string | null>(null)
  const [dangTai, setDangTai] = useState(false)
  const [loc, setLoc] = useState<Loc>('tat_ca')
  const [mo, setMo] = useState<Set<string>>(new Set())
  const tai = async () => {
    setDangTai(true); setLoi(null)
    try { const r = await ketQuaBoTroTuan(tu, den); NHO.set(key, r); setKq(r) } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDangTai(false) }
  }
  useEffect(() => { if (!NHO.has(key)) tai() }, [key]) // eslint-disable-line

  const ds = useMemo(() => (kq?.ca ?? []).filter((c) => loc === 'tat_ca' ? true : loc === 'co_giam' ? nGiam(c) > 0 : loc === 'con_yeu' ? nVan(c) > 0 : c.dang.length === 0), [kq, loc])
  const t = kq?.tom_tat
  const bam = (id: string) => setMo((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })

  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/30 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[14px] font-semibold text-slate-800">📊 Kết quả bổ trợ yếu · {ddmmVN(tu)} – {ddmmVN(den)}</span>
        <span className="text-[12px] text-slate-500">các ca đã diễn ra (em có mặt)</span>
        <span className="ml-auto flex items-center gap-2">
          <button disabled={dangTai} onClick={tai} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12.5px] text-slate-600 hover:bg-slate-50 disabled:opacity-40" title="Tải lại số liệu">{dangTai ? 'Đang tính…' : '↻ Tính lại'}</button>
          <button onClick={onDong} className="text-[12.5px] text-slate-500 hover:text-slate-700">Đóng ✕</button>
        </span>
      </div>
      {loi && <p className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      {!kq && !loi && <p className="py-8 text-center text-[13px] text-slate-400">Đang tính kết quả từng dạng (vài giây)…</p>}
      {kq && t && (
        <>
          {t.so_ca === 0 ? <p className="rounded-lg bg-white px-3 py-4 text-center text-[13px] text-slate-500">Tuần này chưa có ca bổ trợ yếu nào diễn ra.</p> : (
            <>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-[12px] font-semibold text-emerald-800">Giảm được dạng yếu</p>
                  <p className="mt-0.5 text-[26px] font-extrabold leading-none text-emerald-700">{t.so_dang_giam}<span className="ml-1 text-[13px] font-semibold">dạng</span></p>
                  <p className="mt-1 text-[12px] text-emerald-900">của <b>{t.so_hs_co_giam}</b> em · trong <b>{t.so_ca}</b> ca</p>
                  <p className="mt-0.5 text-[11.5px] text-emerald-800/80">trên {t.so_dang_yeu_truoc} dạng yếu trước ca{t.so_dang_yeu_truoc > 0 ? ` (${pct(t.so_dang_giam, t.so_dang_yeu_truoc)}%)` : ''}</p>
                </div>
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <p className="text-[12px] font-semibold text-rose-800">Vẫn còn yếu sau ca</p>
                  <p className="mt-0.5 text-[26px] font-extrabold leading-none text-rose-700">{t.so_dang_con_yeu_nay}<span className="ml-1 text-[13px] font-semibold">dạng</span></p>
                  <p className="mt-1 text-[12px] text-rose-900">của <b>{t.so_hs_con_yeu}</b> em (trong dạng đã học)</p>
                  <p className="mt-0.5 text-[11.5px] text-rose-800/80">{t.so_hs_het_yeu_dang_hoc} em hết sạch dạng yếu đã học</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[12px] font-semibold text-slate-600">Dạng đã học</p>
                  <p className="mt-0.5 text-[26px] font-extrabold leading-none text-slate-800">{t.so_dang_hoc}<span className="ml-1 text-[13px] font-semibold">dạng</span></p>
                  <p className="mt-1 text-[12px] text-slate-600">{t.so_hs_co_hoc}/{t.so_hs} em có học · {t.so_ca_co_hoc}/{t.so_ca} ca có học</p>
                  <p className="mt-0.5 text-[11.5px] text-slate-400">{t.so_dang_khong_yeu_truoc} không yếu từ trước ca{t.so_dang_chua_do_truoc > 0 ? ` · ${t.so_dang_chua_do_truoc} chưa đo trước` : ''}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[12px] font-semibold text-slate-600">Kết quả trong ca</p>
                  <p className="mt-0.5 text-[13px] text-slate-700">Luyện đúng <b className="text-[18px] text-slate-900">{pct(t.luyen_dung, t.luyen_tong)}%</b> <span className="text-slate-400">({t.luyen_dung}/{t.luyen_tong})</span></p>
                  <p className="text-[13px] text-slate-700">Test cuối ca <b className="text-[18px] text-slate-900">{pct(t.test_dung, t.test_tong)}%</b> <span className="text-slate-400">({t.test_dung}/{t.test_tong})</span></p>
                  {t.so_ca_huy > 0 && <p className="mt-0.5 text-[11.5px] text-slate-400">{t.so_ca_huy} ca bị huỷ (không tính)</p>}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {([['tat_ca', `Tất cả ${kq.ca.length}`], ['co_giam', 'Có giảm yếu'], ['con_yeu', 'Còn dạng vẫn yếu'], ['khong_hoc', 'Không học dạng nào']] as [Loc, string][]).map(([k, ten]) => (
                  <button key={k} onClick={() => setLoc(k)} className={`rounded-full border px-3 py-1 text-[12.5px] font-semibold ${loc === k ? 'border-indigo-300 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{ten}</button>
                ))}
                <span className="ml-auto text-[11.5px] text-slate-400">Bấm vào dòng để xem từng dạng</span>
              </div>

              <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-slate-50 text-[11.5px] uppercase tracking-wide text-slate-500">
                    <tr><th className="px-3 py-1.5 font-semibold">Ca</th><th className="px-3 py-1.5 font-semibold">Học sinh</th><th className="px-3 py-1.5 font-semibold">Học</th><th className="px-3 py-1.5 font-semibold">Kết quả</th><th className="px-3 py-1.5 font-semibold">Luyện</th><th className="px-3 py-1.5 font-semibold">Test</th><th className="px-3 py-1.5 font-semibold">Theo dõi</th></tr>
                  </thead>
                  <tbody>
                    {ds.length === 0 && <tr><td colSpan={7} className="px-3 py-4 text-center text-slate-400">Không có ca nào.</td></tr>}
                    {ds.map((c) => <DongCa key={`${c.buoi_id}-${c.hoc_sinh_id}`} c={c} mo={mo.has(`${c.buoi_id}-${c.hoc_sinh_id}`)} onBam={() => bam(`${c.buoi_id}-${c.hoc_sinh_id}`)} />)}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-slate-500">
                <b>Giảm</b> = dạng ở mức <b>Yếu trước ca</b> (mastery đo đến 00:00 ngày ca) mà <b>sau ca không còn Yếu</b> (mastery đo đến hết ngày ca, gồm luyện + test của chính ca). Dạng không yếu từ trước ca không tính là giảm (case có thể đã mở từ vài tuần trước, em đã khá lên dần).
                Kết quả khoá theo ngày ca — các lần đo ET/BTVN SAU ngày ca không làm đổi số. Lưu ý: lần đo khác diễn ra CÙNG ngày với ca vẫn được tính vào “sau ca”.
              </p>
            </>
          )}
        </>
      )}
    </div>
  )
}

function DongCa({ c, mo, onBam }: { c: CaKetQua; mo: boolean; onBam: () => void }) {
  const giam = nGiam(c), van = nVan(c)
  const lu = c.dang.reduce((a, d) => [a[0] + d.luyen_dung, a[1] + d.luyen_tong], [0, 0])
  const te = c.dang.reduce((a, d) => [a[0] + d.test_dung, a[1] + d.test_tong], [0, 0])
  return (
    <>
      <tr onClick={onBam} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50/70">
        <td className="whitespace-nowrap px-3 py-2 text-slate-600">{thuCuaNgay(c.ngay)} {ddmmVN(c.ngay)}{c.gio_bat_dau ? ` · ${hhmm(c.gio_bat_dau)}` : ''}<div className="text-[11px] text-slate-400">{c.nguoi_day ?? '—'}{!c.hoan_tat ? ' · ca chưa đóng' : ''}</div></td>
        <td className="px-3 py-2 font-medium text-slate-800">{c.ho_ten} <span className="text-[11.5px] font-normal text-slate-400">{c.ma_hs}</span><div className="text-[11px] font-normal text-slate-400">K{c.khoi}{c.lop ? ` · ${c.lop}` : ''}</div></td>
        <td className="px-3 py-2 text-slate-700">{c.dang.length > 0 ? <>{c.dang.length} <span className="text-[11.5px] text-slate-400">/ {c.so_dang_case} dạng case</span></> : <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11.5px] font-semibold text-amber-800">không học dạng nào</span>}</td>
        <td className="px-3 py-2">
          {c.dang.length > 0 && (
            <span className="flex flex-wrap gap-1">
              {giam > 0 && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-px text-[12px] font-semibold text-emerald-700">✅ {giam} hết yếu</span>}
              {van > 0 && <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-px text-[12px] font-semibold text-rose-700">⚠ {van} vẫn yếu</span>}
              {giam === 0 && van === 0 && <span className="text-[12px] text-slate-400">không có dạng yếu trước ca</span>}
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-2 text-slate-700">{lu[1] > 0 ? <>{lu[0]}/{lu[1]} <span className="text-[11.5px] text-slate-400">{pct(lu[0], lu[1])}%</span></> : '—'}</td>
        <td className="whitespace-nowrap px-3 py-2 text-slate-700">{te[1] > 0 ? <>{te[0]}/{te[1]} <span className="text-[11.5px] text-slate-400">{pct(te[0], te[1])}%</span></> : <span className="text-slate-400">{c.co_test ? (c.test_da_nop ? '—' : 'chưa nộp') : 'không test'}</span>}</td>
        <td className="px-3 py-2 text-[12px] text-slate-500">{c.theo_doi ? (c.theo_doi.trang_thai === 'theo_doi' ? <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">👁 đang theo dõi</span> : c.theo_doi.trang_thai) : '—'}<span className="ml-1 text-slate-300">{mo ? '▾' : '▸'}</span></td>
      </tr>
      {mo && (
        <tr className="bg-slate-50/60">
          <td colSpan={7} className="px-4 pb-3 pt-1">
            {c.dang.length === 0 ? (
              <p className="py-2 text-[12.5px] text-slate-500">Em có mặt nhưng không luyện câu nào và không có dạng nào được đánh dấu đã học{c.so_dang_case > 0 ? ` (case có ${c.so_dang_case} dạng)` : ''}. Case mở {ddmmVN(c.mo_ngay)}.</p>
            ) : (
              <table className="w-full text-left text-[12.5px]">
                <thead className="text-[11px] uppercase tracking-wide text-slate-400"><tr><th className="py-1 pr-3 font-semibold">Dạng đã học</th><th className="py-1 pr-3 font-semibold">Trước ca</th><th className="py-1 pr-3 font-semibold">Sau ca</th><th className="py-1 pr-3 font-semibold">Tiến bộ</th><th className="py-1 pr-3 font-semibold">Luyện</th><th className="py-1 font-semibold">Test cuối ca</th></tr></thead>
                <tbody>
                  {c.dang.map((d: DangKetQua) => {
                    const tb = TIEN_BO[d.tien_bo]
                    return (
                      <tr key={d.ma_dang} className="border-t border-slate-200/70">
                        <td className="py-1.5 pr-3 font-medium text-slate-800">{d.ten_dang}</td>
                        <td className="py-1.5 pr-3"><ChipMuc muc={d.truoc_muc} score={d.truoc_score} n={d.truoc_n} /></td>
                        <td className="py-1.5 pr-3"><ChipMuc muc={d.nay_muc} score={d.nay_score} n={d.nay_n} /></td>
                        <td className={`py-1.5 pr-3 font-semibold ${tb.cls}`} title={tb.giai}>{tb.ten}</td>
                        <td className="py-1.5 pr-3 text-slate-700">{d.luyen_tong > 0 ? `${d.luyen_dung}/${d.luyen_tong}` : '—'}</td>
                        <td className="py-1.5 text-slate-700">{d.test_tong > 0 ? `${d.test_dung}/${d.test_tong}` : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
            <p className="mt-1.5 text-[11.5px] text-slate-400">Case mở {ddmmVN(c.mo_ngay)} · {c.case_tt === 'hoan_thanh' ? `đã đóng${c.case_kq ? ` (${c.case_kq === 'het_han' ? 'hết hạn 14 ngày' : c.case_kq === 'day_xong' ? 'xong bổ trợ' : c.case_kq})` : ''}` : 'đang mở'}</p>
          </td>
        </tr>
      )}
    </>
  )
}
