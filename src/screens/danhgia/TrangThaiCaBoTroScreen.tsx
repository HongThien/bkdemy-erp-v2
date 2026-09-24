// Trạng thái ca bổ trợ (Thùy 24/09 tối): card 1 DÒNG — tên trái · thanh MỨC phải (tô tới mức hiện tại, ghi tên mức) — để nhìn được nhiều ca.
// Filter toggle theo mức, số tổng mỗi mức ngay trên nút. Bấm card ⇒ popup đủ chi tiết ca (dạng · buổi · retest · lịch sử duyệt).
// MỨC tính ở DB (fn_btyeu_trang_thai_ca, §2.0) — màn chỉ lọc + đếm số dòng đang có để hiện trên nút.
import { useEffect, useMemo, useState } from 'react'
import { listTrangThaiCa, chiTietCase, MUC_CA, type TrangThaiCa, type MucCa, type ChiTietCase } from '../../lib/botro_yeu'
import { norm } from '../../components/SearchSelect'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
const ngayTs = (t: string | null | undefined) => (t ? ddmmVN(String(t).slice(0, 10)) : '')
const MUC_MAU: Record<MucCa, { bar: string; chip: string }> = {
  cho_noi_dung: { bar: 'bg-slate-400', chip: 'bg-slate-100 text-slate-700' },
  can_xep: { bar: 'bg-amber-500', chip: 'bg-amber-50 text-amber-800' },
  da_xep: { bar: 'bg-indigo-500', chip: 'bg-indigo-50 text-indigo-700' },
  cho_retest: { bar: 'bg-violet-500', chip: 'bg-violet-50 text-violet-700' },
  cho_danh_gia: { bar: 'bg-sky-500', chip: 'bg-sky-50 text-sky-700' },
  hoan_thanh: { bar: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700' },
}
const NGUON_CASE: Record<string, string> = { ai_de_xuat: 'Máy đề xuất', chuong_do: 'Chuông đỏ (GV/TA báo)', gv_tien_quyet: 'GV báo hổng nền', thu_cong: 'Thủ công' }
const NGUON_DANG: Record<string, string> = { duyet: 'lúc duyệt', tay: 'thêm tay', may: 'máy thêm', bao_dong: '🚨 báo động' }
const TT_DANG: Record<ChiTietCase['dang'][number]['tt'], { ten: string; cls: string }> = {
  chua_day: { ten: 'Chưa dạy', cls: 'bg-amber-50 text-amber-800' },
  day_lai: { ten: 'Retest trượt · dạy lại', cls: 'bg-rose-50 text-rose-700' },
  cho_retest: { ten: 'Đã dạy · chờ retest', cls: 'bg-violet-50 text-violet-700' },
  xong: { ten: 'Xong', cls: 'bg-emerald-50 text-emerald-700' },
}
const KET_QUA: Record<string, string> = { dat: 'Đạt', mot_phan: 'Một phần', chua_dat: 'Chưa đạt', bo: 'Bỏ' }
const NHO: { loc: MucCa | 'tat_ca'; q: string } = { loc: 'tat_ca', q: '' }

// Chi tiết ngắn cạnh mức: đã xếp ⇒ ngày giờ người · cần xếp ⇒ số dạng cần dạy · chờ retest ⇒ ngày retest…
function chiTietMuc(c: TrangThaiCa): string {
  switch (c.buoc) {
    case 'cho_noi_dung': return 'chưa chọn dạng'
    case 'can_xep': return `${c.so_dang_can_day}/${c.so_dang} dạng cần dạy`
    case 'da_xep': return c.buoi_cho_ngay ? `${thuCuaNgay(c.buoi_cho_ngay)} ${ddmmVN(c.buoi_cho_ngay)}${c.buoi_cho_gio ? ` ${hhmm(c.buoi_cho_gio)}` : ''}${c.buoi_cho_nguoi ? ` · ${c.buoi_cho_nguoi}` : ''}` : ''
    case 'cho_retest': return c.retest_ngay ? `retest ${ddmmVN(c.retest_ngay)}` : `${c.so_dang_cho_retest} dạng chờ retest`
    case 'cho_danh_gia': return `${c.so_dang_xong}/${c.so_dang} dạng xong`
    case 'hoan_thanh': return `${c.ket_qua ? KET_QUA[c.ket_qua] ?? c.ket_qua : ''}${c.hoan_thanh_at ? ` · ${ngayTs(c.hoan_thanh_at)}` : ''}`
  }
}

function ThanhMuc({ buoc }: { buoc: MucCa }) {
  const i = MUC_CA.findIndex((m) => m.k === buoc)
  return (
    <div className="flex w-[180px] shrink-0 gap-0.5" title={MUC_CA.map((m, j) => `${j + 1}. ${m.ten}`).join(' → ')}>
      {MUC_CA.map((m, j) => <div key={m.k} className={`h-2 flex-1 rounded-full ${j <= i ? MUC_MAU[buoc].bar : 'bg-slate-200'}`} />)}
    </div>
  )
}

export default function TrangThaiCaBoTroScreen() {
  const [items, setItems] = useState<TrangThaiCa[]>([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [loc, setLocState] = useState<MucCa | 'tat_ca'>(NHO.loc)
  const [q, setQState] = useState(NHO.q)
  const [moId, setMoId] = useState<string | null>(null)
  const setLoc = (v: MucCa | 'tat_ca') => { NHO.loc = v; setLocState(v) }
  const setQ = (v: string) => { NHO.q = v; setQState(v) }

  const tai = () => { setLoi(null); listTrangThaiCa().then(setItems).catch((e: any) => setLoi(e?.message ?? String(e))).finally(() => setLoading(false)) }
  useEffect(() => { tai() }, [])

  const khopQ = useMemo(() => items.filter((c) => !q.trim() || norm(c.ho_ten).includes(norm(q)) || (!!c.ma_hs && norm(c.ma_hs).includes(norm(q))) || (!!c.lop && norm(c.lop).includes(norm(q)))), [items, q])
  const dem = useMemo(() => { const m: Record<string, number> = {}; for (const c of khopQ) m[c.buoc] = (m[c.buoc] ?? 0) + 1; return m }, [khopQ])
  const hien = useMemo(() => (loc === 'tat_ca' ? khopQ : khopQ.filter((c) => c.buoc === loc)), [khopQ, loc])
  const moCa = items.find((c) => c.id === moId) ?? null

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-6">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-3 flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold text-slate-800">Trạng thái ca bổ trợ</h1>
            <p className="mt-0.5 text-[12.5px] text-slate-500">Mỗi case 1 dòng · thanh mức: Chờ chọn dạng → Cần xếp → Đã xếp → Chờ retest → Chờ đánh giá → Hoàn thành (60 ngày). Bấm để xem chi tiết.</p>
          </div>
          <div className="relative w-60">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Tìm tên / mã HS / lớp…" className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-[13px] outline-none focus:border-indigo-400" />
            {q && <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 hover:text-slate-600">✕</button>}
          </div>
          <button onClick={() => { setLoading(true); tai() }} title="Tải lại" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[12px] text-slate-500 hover:bg-slate-100">↻</button>
        </header>

        {/* Filter toggle theo mức — số tổng ngay trên nút */}
        <div className="mb-3 flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button onClick={() => setLoc('tat_ca')} className={`rounded-xl px-3 py-1.5 text-[13px] font-semibold ${loc === 'tat_ca' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            Tất cả <span className={`ml-1 rounded-full px-1.5 text-[12px] ${loc === 'tat_ca' ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>{khopQ.length}</span>
          </button>
          {MUC_CA.map((m) => (
            <button key={m.k} onClick={() => setLoc(m.k)} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold ${loc === m.k ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <i className={`inline-block h-2.5 w-2.5 rounded-full ${MUC_MAU[m.k].bar}`} />{m.ten}
              <span className={`rounded-full px-1.5 text-[12px] ${loc === m.k ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>{dem[m.k] ?? 0}</span>
            </button>
          ))}
        </div>

        {loi && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
        {loading ? <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
          : hien.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Không có case nào{loc !== 'tat_ca' || q ? ' khớp bộ lọc' : ''}.</div>
          : (
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
              {hien.map((c) => (
                <button key={c.id} onClick={() => setMoId(c.id)} className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-2 text-left last:border-b-0 hover:bg-indigo-50/40">
                  <div className="flex min-w-0 flex-1 items-baseline gap-2">
                    <span className="max-w-[220px] shrink-0 truncate text-[13.5px] font-semibold text-slate-800">{c.ho_ten}</span>
                    <span className="min-w-0 truncate text-[11.5px] text-slate-400">{c.lop ?? `K${c.khoi ?? '?'}`} · {c.mon} · L{c.level}{c.uu_tien === 3 ? ' · ▲ cao' : c.uu_tien === 1 ? ' · ▽ thấp' : ''}</span>
                  </div>
                  <span className="hidden w-[190px] shrink-0 truncate text-right text-[11.5px] text-slate-500 md:inline">{chiTietMuc(c)}</span>
                  <ThanhMuc buoc={c.buoc} />
                  <span className={`w-[112px] shrink-0 rounded-full px-2 py-0.5 text-center text-[11.5px] font-bold ${MUC_MAU[c.buoc].chip}`}>{MUC_CA.find((m) => m.k === c.buoc)?.ten}</span>
                </button>
              ))}
            </div>
          )}
      </div>
      {moCa && <ChiTietModal c={moCa} onDong={() => setMoId(null)} />}
    </section>
  )
}

function ChiTietModal({ c, onDong }: { c: TrangThaiCa; onDong: () => void }) {
  const [d, setD] = useState<ChiTietCase | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { chiTietCase(c.id).then(setD).catch((e: any) => setLoi(e?.message ?? String(e))) }, [c.id])
  const h = d?.case
  const Muc = ({ t, children }: { t: string; children: React.ReactNode }) => (
    <div className="mt-4"><h3 className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">{t}</h3>{children}</div>
  )
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4" onClick={onDong}>
      <div className="flex max-h-[90vh] w-[860px] max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-slate-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-slate-900">{c.ho_ten} <span className="text-[13px] font-normal text-slate-400">· {c.ma_hs} · {c.lop ?? `K${c.khoi}`} · {c.mon}</span></h2>
            <button onClick={onDong} className="ml-auto h-8 w-8 rounded-md text-slate-400 hover:bg-slate-100">✕</button>
          </div>
          <div className="mt-2 flex items-center gap-3"><ThanhMuc buoc={c.buoc} /><span className={`rounded-full px-2 py-0.5 text-[11.5px] font-bold ${MUC_MAU[c.buoc].chip}`}>{MUC_CA.find((m) => m.k === c.buoc)?.ten}</span><span className="text-[12px] text-slate-500">{chiTietMuc(c)}</span></div>
        </div>
        <div className="overflow-auto px-5 pb-5 text-[13px]">
          {loi && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-rose-700">{loi}</p>}
          {!d || !h ? <p className="mt-4 text-slate-400">Đang tải chi tiết…</p> : (
            <>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 rounded-xl bg-slate-50 px-4 py-3 md:grid-cols-3">
                <div><span className="text-slate-400">Level:</span> <b>L{h.level}</b></div>
                <div><span className="text-slate-400">Vòng:</span> <b>{h.vong}</b></div>
                <div><span className="text-slate-400">Ưu tiên:</span> <b>{h.uu_tien === 3 ? 'Cao' : h.uu_tien === 1 ? 'Thấp' : 'Thường'}</b></div>
                <div><span className="text-slate-400">Nguồn:</span> {NGUON_CASE[h.nguon] ?? h.nguon}</div>
                <div><span className="text-slate-400">Mở:</span> {ngayTs(h.created_at)}{h.mo_boi ? ` · ${h.mo_boi}` : ''}</div>
                <div><span className="text-slate-400">Trạng thái:</span> {h.trang_thai === 'hoan_thanh' ? `Đã đóng ${ngayTs(h.hoan_thanh_at)}${h.ket_qua ? ` · ${KET_QUA[h.ket_qua] ?? h.ket_qua}` : ''}` : 'Đang xử lý'}</div>
                {h.ly_do && <div className="col-span-full"><span className="text-slate-400">Lý do mở:</span> {h.ly_do}</div>}
                {h.ghi_chu_dong && <div className="col-span-full"><span className="text-slate-400">Ghi chú đóng:</span> {h.ghi_chu_dong}</div>}
              </div>

              <Muc t={`Dạng (${d.dang.length})`}>
                {d.dang.length === 0 ? <p className="text-slate-400">Chưa chọn dạng — vào Quản lý chất lượng › Bổ trợ yếu › Nội dung.</p> : (
                  <table className="w-full text-[12.5px]">
                    <thead><tr className="text-left text-[11px] uppercase tracking-wide text-slate-400"><th className="py-1">Dạng</th><th>Vào case</th><th>Lúc mở</th><th>Dạy</th><th>Retest</th><th className="text-right">Trạng thái</th></tr></thead>
                    <tbody>{d.dang.map((x) => (
                      <tr key={x.ma_dang} className="border-t border-slate-100">
                        <td className="py-1.5 pr-2"><div className="font-medium text-slate-800">{x.ten_dang}</div><div className="text-[11px] text-slate-400">{x.ma_dang}</div></td>
                        <td className="text-slate-500">{NGUON_DANG[x.nguon] ?? x.nguon}<div className="text-[11px] text-slate-400">{ngayTs(x.them_at)}</div></td>
                        <td className="text-slate-500">{x.diem_luc_mo != null ? `${Math.round(Number(x.diem_luc_mo) * 100)}%` : '—'}{x.so_lan_do_luc_mo ? <span className="text-[11px] text-slate-400"> · {x.so_lan_do_luc_mo} đo</span> : null}</td>
                        <td className="text-slate-500">{x.day_at ? ngayTs(x.day_at) : '—'}</td>
                        <td className="text-slate-500">{x.retest_diem != null ? `${Math.round(Number(x.retest_diem) * 100)}% ${x.dat ? '✓' : x.dat === false ? '✗' : ''}` : '—'}</td>
                        <td className="text-right"><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${TT_DANG[x.tt].cls}`}>{TT_DANG[x.tt].ten}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
              </Muc>

              <Muc t={`Buổi bổ trợ (${d.buoi.length})`}>
                {d.buoi.length === 0 ? <p className="text-slate-400">Chưa xếp buổi nào.</p> : d.buoi.map((b, i) => (
                  <div key={i} className={`mb-1 flex flex-wrap items-center gap-2 rounded-lg px-3 py-1.5 ${b.trang_thai === 'huy' ? 'bg-slate-50 text-slate-400' : 'bg-rose-50/60'}`}>
                    <b className={b.trang_thai === 'huy' ? 'line-through' : 'text-slate-800'}>{thuCuaNgay(b.ngay)} {ddmmVN(b.ngay)}{b.gio_bat_dau ? ` · ${hhmm(b.gio_bat_dau)}${b.gio_ket_thuc ? `–${hhmm(b.gio_ket_thuc)}` : ''}` : ''}</b>
                    <span className="text-slate-500">{[b.phong, b.nguoi].filter(Boolean).join(' · ')}{b.ca_truc ? ' · ca trực' : ''}{b.che_do ? ` · ${b.che_do === 'giay' ? '📄 giấy' : '📱 app'}` : ''}</span>
                    <span className="ml-auto text-[11.5px] font-semibold">
                      {b.trang_thai === 'huy' ? `Huỷ${b.ly_do_huy ? ` — ${b.ly_do_huy}` : ''}` : b.danh_gia_xong_at ? '✓ Đã học · đã đánh giá' : b.diem_danh === 'co_mat' ? 'Có mặt · chưa đóng ca' : b.diem_danh ? 'Vắng' : 'Chờ học'}
                    </span>
                  </div>
                ))}
              </Muc>

              {d.retest.length > 0 && (
                <Muc t={`Retest (${d.retest.length})`}>
                  {d.retest.map((r, i) => (
                    <div key={i} className="mb-1 flex items-center gap-2 rounded-lg bg-violet-50/60 px-3 py-1.5">
                      <b className="text-slate-800">{thuCuaNgay(r.ngay)} {ddmmVN(r.ngay)}</b><span className="text-slate-500">{r.so_cau} câu</span>
                      <span className="ml-auto text-[11.5px] font-semibold">{r.da_nop ? `✓ Đã nộp · đúng ${r.so_dung}/${r.so_cau}` : 'Chờ làm'}</span>
                    </div>
                  ))}
                </Muc>
              )}

              <Muc t="Lịch sử duyệt level">
                {d.duyet.length === 0 ? <p className="text-slate-400">Không có lượt duyệt trong thời gian case mở.</p> : d.duyet.map((g, i) => (
                  <div key={i} className="mb-1 rounded-lg bg-slate-50 px-3 py-1.5">
                    <div className="flex flex-wrap items-center gap-2"><b className="text-slate-800">{ngayTs(g.at)}</b>
                      <span className="text-slate-500">máy đề xuất L{g.level_may ?? '?'} → chốt <b className="text-slate-800">L{g.level_chot}</b>{g.level_cu != null ? ` (trước L${g.level_cu})` : ''}</span>
                      {g.nguoi && <span className="ml-auto text-[11.5px] text-slate-500">{g.nguoi}</span>}
                    </div>
                    {g.ly_do_may && g.ly_do_may.length > 0 && <div className="mt-0.5 text-[11.5px] text-slate-500">{g.ly_do_may.join(' · ')}</div>}
                    {g.ly_do_nguoi && <div className="mt-0.5 text-[11.5px] text-slate-600">Ghi chú: {g.ly_do_nguoi}</div>}
                  </div>
                ))}
              </Muc>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
