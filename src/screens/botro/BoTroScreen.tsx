// Màn BỔ TRỢ — BÙ buổi nghỉ (ADR app.notion.com/p/389d4530bcdb81de9549fdb99ce1083e). Gu Apple-clean.
// Tabs: Cần bù (L1) / Đã xếp (L2) / Hoàn thành (L3) / Không bù. Detail buổi bù: điểm danh + ET per-HS + đánh giá.
import { useEffect, useMemo, useState } from 'react'
import {
  listLanNghiCanXep, listCaBoTro, listCaBoTroTraVe, listKhongBu, ghiKhongBu, xoaKhongBu, taoBuoiBu, themHSVaoBuoiBu, buoiBuSapToi, goiYBuoiBu,
  ensureBuoiBuETProblems, demTabBoTro, getBuoiBuHsInfo, taiLieuCuaBuoiMe,
  type LanNghi, type CanBuItem, type CaBoTro, type BuoiBuHsInfo, type DocBuoi,
} from '../../lib/botro'
import PrintView from '../tailieu/PrintView'
import ETPrintView from '../tailieu/ETPrintView'
import { getRoster, getBuoi, diemDanh, huyBuoi, xoaHSKhoiBuoi, listProblems, gradeET, deleteGrade, listGrades, closePhase, getDanhGia, setDanhGiaDang, setNhanXet, getDangTen, dongDanhGia, moLaiDanhGia, updateBuoiMeta, type BuoiHoc, type BuoiHocHS, type Problem, type Grade, type ETResult } from '../../lib/gami'
import SuaBuoiModal from './SuaBuoiModal'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listPhong, type Phong } from '../../lib/phong'
import { homNayVN } from '../../lib/tuan'
import SearchSelect, { norm } from '../../components/SearchSelect'
import { tenNganHS, tenHienThiDs } from '../../lib/hoten'

type Tab = 'canbu' | 'daxep' | 'xong' | 'khongbu'
const TABS: { k: Tab; ten: string }[] = [{ k: 'canbu', ten: 'Cần bù' }, { k: 'daxep', ten: 'Đã xếp' }, { k: 'xong', ten: 'Hoàn thành' }, { k: 'khongbu', ten: 'Không bù' }]
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const ddmm = (s?: string | null) => (s ? s.split('-').reverse().slice(0, 2).join('/') : '')
const khoiSort = (a: string, b: string) => a.localeCompare(b, 'vi', { numeric: true })

export default function BoTroScreen() {
  const [tab, setTab] = useState<Tab>('canbu')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [canbu, setCanbu] = useState<LanNghi[]>([])
  const [cas, setCas] = useState<CaBoTro[]>([])
  // Buổi bù toàn-bộ-HS-vắng: HS đã về "Cần bù", buổi chỉ còn vỏ. Không nằm trong hàng đợi
  // nhưng cũng KHÔNG được biến mất không dấu vết (sửa nhầm điểm danh / huỷ buổi cho sạch).
  const [traVe, setTraVe] = useState<CaBoTro[]>([])
  const [moTraVe, setMoTraVe] = useState(false)
  const [khongbu, setKhongbu] = useState<Awaited<ReturnType<typeof listKhongBu>>>([])
  const [loading, setLoading] = useState(true)
  const [xepItem, setXepItem] = useState<CanBuItem | null>(null)
  const [khongModal, setKhongModal] = useState<{ item: CanBuItem } | null>(null)
  const [detail, setDetail] = useState<{ ca: CaBoTro; readOnly: boolean } | null>(null)
  const [suaBuoi, setSuaBuoi] = useState<CaBoTro | null>(null)
  // Filter khối + tìm tên (Thùy 07-16) — áp dụng 3 tab Cần bù/Đã xếp/Hoàn thành (không áp Không bù).
  const [khoiFilter, setKhoiFilter] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const showFilter = tab !== 'khongbu'
  const [nss, setNss] = useState<NhanSu[]>([])
  const nsOpts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns ?? undefined })), [nss])

  async function reloadCounts() { try { setCounts(await demTabBoTro()) } catch { /* */ } }
  async function reload() {
    setLoading(true)
    try {
      if (tab === 'canbu') setCanbu(await listLanNghiCanXep())
      else if (tab === 'daxep') { const [l, t] = await Promise.all([listCaBoTro(false), listCaBoTroTraVe()]); setCas(l); setTraVe(t) }
      else if (tab === 'xong') setCas(await listCaBoTro(true))
      else setKhongbu(await listKhongBu())
    } catch { /* */ } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tab]) // eslint-disable-line
  useEffect(() => { reloadCounts(); listNhanSu().then(setNss).catch(() => {}) }, [])
  const refresh = async () => { await reload(); await reloadCounts() }

  async function onKhongXep(item: CanBuItem) { try { await ghiKhongBu(item.id, 'khong_xep_duoc'); await refresh() } catch (e: any) { alert(e.message ?? String(e)) } }
  // Đổi người bổ trợ NGAY trên card (không bắt mở modal Sửa buổi) — người này nhận cả chấm ET lẫn đánh giá.
  async function onDoiNguoiBoTro(caId: string, nhanSuId: string | null) {
    try { await updateBuoiMeta(caId, { nguoi_day_tg: nhanSuId }); await refresh() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  // canbu = card 1 HS (lọc trực tiếp). daxep/xong = card 1 BUỔI (nhiều HS/ca) → giữ ca nếu CÓ ÍT NHẤT 1 HS
  // khớp cả 2 filter (tìm học sinh trong ca gộp nhiều em). Đặt TRƯỚC early-return detail (rules-of-hooks).
  const khopQ = (hoTen: string, maHs: string | null) => !q.trim() || norm(hoTen).includes(norm(q)) || (!!maHs && norm(maHs).includes(norm(q)))
  const khoiOpts = useMemo(() => {
    const set = tab === 'canbu' ? new Set(canbu.map((c) => c.khoi).filter(Boolean) as string[])
      : new Set(cas.flatMap((c) => c.hs.map((h) => h.khoi).filter(Boolean) as string[]))
    return [...set].sort(khoiSort)
  }, [tab, canbu, cas])
  const canbuShown = useMemo(() => canbu.filter((c) => (!khoiFilter || c.khoi === khoiFilter) && khopQ(c.ho_ten, c.ma_hs)), [canbu, khoiFilter, q])
  const casShown = useMemo(() => cas.filter((c) => c.hs.some((h) => (!khoiFilter || h.khoi === khoiFilter) && khopQ(h.ho_ten, h.ma_hs))), [cas, khoiFilter, q])

  if (detail) return <BuoiBuDetail buoiId={detail.ca.id} readOnly={detail.readOnly} onClose={() => { setDetail(null); refresh() }} />
  // 2 HS trùng tên rút gọn trong CÙNG danh sách → bung đủ họ tên cả 2 (Thùy 07-06).
  const tenCanBu = tenHienThiDs(canbuShown.map((c) => c.ho_ten))
  const tenKhongBu = tenHienThiDs(khongbu.map((k) => k.ho_ten))

  return (
    <div className="h-full overflow-auto bg-[#f5f5f7] p-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4">
          <h2 className="text-[22px] font-semibold text-slate-800">Bổ trợ · Bù buổi nghỉ</h2>
          <p className="text-[13px] text-slate-500">HS nghỉ → xếp bù → mở buổi điểm danh → chấm ET + đánh giá → hoàn thành</p>
        </div>

        <div className="mb-4 inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {TABS.map((t) => {
            const on = tab === t.k
            return (
              <button key={t.k} onClick={() => setTab(t.k)} className={`rounded-xl px-3.5 py-1.5 text-[14px] font-medium transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                {t.ten}{counts[t.k] != null ? <span className={`ml-1.5 rounded-full px-1.5 text-[12px] ${on ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>{counts[t.k]}</span> : null}
              </button>
            )
          })}
        </div>

        {/* Filter khối + tìm tên (Thùy 07-16) — áp dụng 3 tab Cần bù/Đã xếp/Hoàn thành */}
        {showFilter && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Khối</span>
            <span className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button onClick={() => setKhoiFilter(null)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium transition ${khoiFilter === null ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Tất cả</button>
              {khoiOpts.map((k) => (
                <button key={k} onClick={() => setKhoiFilter(k)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium transition ${khoiFilter === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{k}</button>
              ))}
            </span>
            <div className="relative ml-2 w-64">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔎 Tìm tên / mã HS…" className="h-9 w-full rounded-xl border border-slate-300 px-3 text-[13px] outline-none focus:border-indigo-400" />
              {q && <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 hover:text-slate-600">✕</button>}
            </div>
          </div>
        )}

        {loading ? <div className="p-8 text-[14px] text-slate-400">Đang tải…</div>
          : tab === 'canbu' ? (
            canbu.length === 0 ? <Empty t="Không có HS nghỉ nào cần bù." />
              : canbuShown.length === 0 ? <Empty t="Không có HS nào khớp bộ lọc." />
              : (
                <div className="space-y-2.5">
                  {canbuShown.map((c, i) => (
                    <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      {/* 3 block: tên · lớp · ngày */}
                      <div className="min-w-[180px] flex-1">
                        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Học sinh</div>
                        <div className="text-[16px] font-semibold text-slate-800">{tenCanBu[i]}</div>
                        <div className="text-[12px] text-slate-400">{c.ma_hs}</div>
                      </div>
                      <div className="min-w-[120px] rounded-xl bg-slate-50 px-3 py-2">
                        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lớp</div>
                        <div className="text-[15px] font-semibold text-slate-700">{c.lop}</div>
                        <div className="text-[12px] text-slate-400">{c.mon}</div>
                      </div>
                      <div className="min-w-[120px] rounded-xl bg-slate-50 px-3 py-2">
                        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Ngày nghỉ</div>
                        <div className="text-[15px] font-semibold text-slate-700">{ddmm(c.ngay)}</div>
                      </div>
                      {/* Lượt XẾP LẠI khác hẳn nghỉ lần đầu: em này đã được xếp rồi mà trượt.
                          Không nói ra thì người xếp tưởng ca mới, và không biết em đã trượt mấy lần. */}
                      {c.lyDoQuayLai && (
                        <div className="min-w-[150px] rounded-xl bg-rose-50 px-3 py-2">
                          <div className="text-[12px] font-medium uppercase tracking-wide text-rose-400">Xếp lại</div>
                          <div className="text-[13px] font-semibold text-rose-700">
                            {c.lyDoQuayLai === 'vang_buoi_bu' ? 'Vắng buổi bù' : 'Buổi bù bị huỷ'}
                          </div>
                          <div className="text-[11.5px] text-rose-400">đã xếp {c.soLanDaXep} lần</div>
                        </div>
                      )}
                      {/* 3 nút 1-click */}
                      <div className="ml-auto flex shrink-0 flex-wrap gap-2">
                        <button onClick={() => setXepItem(c)} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">Xếp bổ trợ</button>
                        <button onClick={() => onKhongXep(c)} className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2 text-[13px] font-medium text-amber-700 hover:border-amber-300">Không xếp được</button>
                        <button onClick={() => setKhongModal({ item: c })} className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-[13px] font-medium text-rose-700 hover:border-rose-300">Không cần bù</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
          ) : tab === 'khongbu' ? (
            khongbu.length === 0 ? <Empty t="Chưa có HS nào ghi không-bù." /> : (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[560px] text-[14px]">
                  <thead><tr className="text-left text-[13px] text-slate-500">
                    <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 font-medium">Học sinh</th>
                    <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 font-medium">Loại</th>
                    <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 font-medium">Lý do</th>
                    <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 text-right font-medium"></th>
                  </tr></thead>
                  <tbody>{khongbu.map((k, i) => (
                    <tr key={k.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3"><div className="font-medium text-slate-800">{tenKhongBu[i]}{k.ma_hs ? <span className="ml-1.5 font-mono text-[11px] font-normal text-slate-400">{k.ma_hs}</span> : null}</div><div className="text-[12px] text-slate-400">{k.info}</div></td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${k.loai === 'khong_can_bu' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>{k.loai === 'khong_can_bu' ? 'Không cần bù' : 'Không xếp được'}</span></td>
                      <td className="px-4 py-3 text-slate-600">{k.ly_do || '—'}</td>
                      <td className="px-4 py-3 text-right"><button onClick={async () => { await xoaKhongBu(k.absId); refresh() }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-indigo-600 hover:border-indigo-300">↩ Đưa lại Cần bù</button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )
          ) : (
            <>
              {cas.length === 0 ? <Empty t={tab === 'daxep' ? 'Chưa có ca bổ trợ nào đang chờ.' : 'Chưa có ca bổ trợ nào hoàn thành.'} />
                : casShown.length === 0 ? <Empty t="Không có buổi nào khớp bộ lọc." /> : (
                <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
                  {casShown.map((ca) => (
                    <CaCard key={ca.id} ca={ca} nsOpts={nsOpts} onOpen={() => setDetail({ ca, readOnly: tab === 'xong' })}
                      onSua={tab === 'xong' ? undefined : () => setSuaBuoi(ca)}
                      onDoiNguoi={tab === 'xong' ? undefined : (id) => onDoiNguoiBoTro(ca.id, id)} />
                  ))}
                </div>
              )}
              {/* Buổi bù mà MỌI HS đã vắng: các em đã quay về "Cần bù" nên buổi không còn là việc ở
                  đây — nhưng nó cũng không tự đóng được (nút "Xác nhận ET" chỉ hiện khi có HS có mặt),
                  nên phải có lối vào để sửa nhầm hoặc huỷ, thay vì để nó kẹt trong hàng đợi. */}
              {tab === 'daxep' && traVe.length > 0 && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <button onClick={() => setMoTraVe((v) => !v)} className="flex w-full items-center gap-2 px-4 py-3 text-left">
                    <span className="text-[13px] font-medium text-slate-600">{traVe.length} buổi bù đã trả HS về “Cần bù”</span>
                    <span className="text-[12px] text-slate-400">toàn bộ HS vắng — buổi này chỉ còn vỏ, nên huỷ cho sạch</span>
                    <span className="ml-auto text-[13px] text-slate-400">{moTraVe ? '▴' : '▾'}</span>
                  </button>
                  {moTraVe && (
                    <div className="grid gap-3 border-t border-slate-100 p-4 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
                      {traVe.map((ca) => (
                        <CaCard key={ca.id} ca={ca} traVe nsOpts={nsOpts} onOpen={() => setDetail({ ca, readOnly: false })}
                          onSua={() => setSuaBuoi(ca)} onDoiNguoi={(id) => onDoiNguoiBoTro(ca.id, id)} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
      </div>

      {suaBuoi && <SuaBuoiModal buoi={suaBuoi} onClose={() => setSuaBuoi(null)} onSaved={async () => { setSuaBuoi(null); await refresh() }} />}
      {xepItem && <XepModal item={xepItem} onClose={() => setXepItem(null)} onDone={async () => { setXepItem(null); await refresh() }} />}
      {khongModal && <KhongBuModal item={khongModal.item} onClose={() => setKhongModal(null)} onDone={async () => { setKhongModal(null); await refresh() }} />}
    </div>
  )
}

const Empty = ({ t }: { t: string }) => <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-[14px] text-slate-400 shadow-sm">{t}</div>

// Card 1 buổi bù. Sĩ số + chip HS chỉ đếm em CÒN ở buổi (`ca.hs`); em đã tích vắng nằm ở
// `ca.hsVang` và chỉ hiện thành một dòng nhỏ — vì lần nghỉ của em đã quay về "Cần bù",
// đếm em vào đây nữa là cùng một người xuất hiện ở hai tab (bug CEO nêu 14/08).
function CaCard({ ca, traVe = false, nsOpts, onOpen, onSua, onDoiNguoi }: {
  ca: CaBoTro; traVe?: boolean; nsOpts: { id: string; label: string; sub?: string }[]
  onOpen: () => void; onSua?: () => void; onDoiNguoi?: (nhanSuId: string | null) => void
}) {
  const hsShown = ca.hs.slice(0, 6)
  const tenHsShown = tenHienThiDs(hsShown.map((h) => h.ho_ten)) // trùng tên trong 6 người hiện ra → bung đủ
  const tenVang = tenHienThiDs(ca.hsVang.map((h) => h.ho_ten))
  const [doiNguoi, setDoiNguoi] = useState(false)
  return (
    <div role="button" onClick={onOpen} className={`cursor-pointer rounded-2xl border-l-4 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${traVe ? 'border-l-slate-300' : 'border-l-violet-400'}`}>
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-slate-800">Buổi bù · {ddmm(ca.ngay)}</span>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${traVe ? 'bg-slate-100 text-slate-500' : 'bg-violet-100 text-violet-700'}`}>{ca.hs.length} HS</span>
        {onSua && <button onClick={(e) => { e.stopPropagation(); onSua() }} title="Sửa buổi (ngày/giờ/phòng/người bổ trợ/GV)" className="rounded border border-slate-200 px-1.5 py-0.5 text-[12px] text-slate-400 hover:border-indigo-300 hover:text-indigo-700">✎</button>}
      </div>
      <div className="mt-1 text-[12px] text-slate-500">{ca.gio_bat_dau?.slice(0, 5) || '—'}{ca.phong ? ` · ${ca.phong}` : ''}</div>
      {/* ⭐ NGƯỜI BỔ TRỢ HIỆN NGAY TRÊN CARD + đổi tại chỗ (CEO 14/08: "ai bổ trợ người đó bù/đánh giá"
          — nên chọn người phải nằm ở đây, không bắt mở modal Sửa buổi mới thấy). Chưa chọn ⇒ báo đỏ:
          buổi bù không có người bổ trợ thì việc chấm ET + đánh giá rơi về GV, hoặc mồ côi nếu cũng trống. */}
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]" onClick={(e) => e.stopPropagation()}>
        {doiNguoi && onDoiNguoi ? (
          <div className="w-full max-w-[260px]">
            <SearchSelect value={ca.nguoi_day_tg} options={nsOpts} placeholder="Chọn người bổ trợ…"
              onChange={(v) => { setDoiNguoi(false); onDoiNguoi(v) }} />
          </div>
        ) : (
          <button disabled={!onDoiNguoi} onClick={() => setDoiNguoi(true)}
            className={`rounded-full px-2 py-0.5 font-medium ${ca.ta_ten ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'} disabled:hover:bg-inherit`}>
            {ca.ta_ten ? `🧑‍🏫 Bổ trợ: ${tenNganHS(ca.ta_ten)}` : '⚠ Chưa chọn người bổ trợ'}{onDoiNguoi ? ' ✎' : ''}
          </button>
        )}
        <span className="text-slate-400">GV: {ca.gv_ten ? tenNganHS(ca.gv_ten) : '—'}</span>
      </div>
      {hsShown.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">{hsShown.map((h, i) => (
          <span key={h.hoc_sinh_id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
            {tenHsShown[i]}{h.ma_hs ? <span className="ml-1 font-mono text-slate-400">{h.ma_hs}</span> : null}{h.lop_bu ? ` · ${h.lop_bu}${h.mon ? ` (${h.mon})` : ''}` : ''}
          </span>
        ))}{ca.hs.length > 6 && <span className="text-[11px] text-slate-400">+{ca.hs.length - 6}</span>}</div>
      )}
      {ca.hsVang.length > 0 && (
        <div className="mt-2 rounded-lg bg-rose-50 px-2 py-1.5 text-[11px] text-rose-700">
          Vắng → đã về “Cần bù”: {tenVang.join(' · ')}
        </div>
      )}
      <div className="mt-2 flex gap-1.5 text-[11px]">
        <span className={`rounded px-1.5 py-0.5 font-medium ${ca.et_dong_at ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>ET {ca.et_dong_at ? '✓' : '…'}</span>
        <span className={`rounded px-1.5 py-0.5 font-medium ${ca.danh_gia_xong_at ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>Đánh giá {ca.danh_gia_xong_at ? '✓' : '…'}</span>
      </div>
    </div>
  )
}

function Modal({ title, onClose, children, maxW = 'max-w-[460px]' }: { title: string; onClose: () => void; children: React.ReactNode; maxW?: string }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className={`w-full ${maxW} rounded-2xl bg-white p-6 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[17px] font-semibold text-slate-800">{title}</div>{children}
      </div>
    </div>
  )
}

// Khối thông tin HS nghỉ (tên · lớp · ngày) — 3 block to rõ, dùng chung L1 + popup.
function HsBlocks({ item }: { item: CanBuItem }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <div className="min-w-[160px] flex-1 rounded-xl bg-slate-50 px-3.5 py-2.5">
        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Học sinh</div>
        <div className="text-[16px] font-semibold text-slate-800">{tenNganHS(item.ho_ten)}</div>
        {item.ma_hs && <div className="font-mono text-[12px] text-slate-400">{item.ma_hs}</div>}
      </div>
      <div className="min-w-[110px] rounded-xl bg-slate-50 px-3.5 py-2.5">
        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lớp · Môn</div>
        <div className="text-[16px] font-semibold text-slate-700">{item.lop}</div>
        <div className="text-[12px] text-slate-400">{item.mon}</div>
      </div>
      <div className="min-w-[110px] rounded-xl bg-slate-50 px-3.5 py-2.5">
        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Ngày nghỉ</div>
        <div className="text-[16px] font-semibold text-slate-700">{ddmm(item.ngay)}</div>
      </div>
    </div>
  )
}

function KhongBuModal({ item, onClose, onDone }: { item: CanBuItem; onClose: () => void; onDone: () => void }) {
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  async function go() {
    if (!lyDo.trim()) { alert('Nhập lý do'); return }
    setBusy(true)
    try { await ghiKhongBu(item.id, 'khong_can_bu', lyDo.trim()); onDone() } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title="Không cần bù" onClose={onClose} maxW="max-w-[520px]">
      <div className="mb-3"><HsBlocks item={item} /></div>
      <p className="mb-2 text-[13px] text-slate-500">Đóng nghĩa vụ bù (giữ lịch sử). Cần nêu lý do.</p>
      <textarea className={`${inputCls} h-20`} value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do (bắt buộc)" autoFocus />
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-rose-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-rose-500 disabled:opacity-50">{busy ? '…' : 'Xác nhận'}</button>
      </div>
    </Modal>
  )
}

// +60 phút cho giờ dạng "HH:MM" — gợi ý mặc định giờ kết thúc (bổ trợ thường ~1 tiếng), người dùng vẫn
// sửa được trước khi lưu.
function cong60(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const t = (h * 60 + m + 60) % 1440
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

function XepModal({ item, onClose, onDone }: { item: CanBuItem; onClose: () => void; onDone: () => void }) {
  const [mode, setMode] = useState<'moi' | 'cosan'>('moi')
  const [ngay, setNgay] = useState(homNayVN())
  const [gio, setGio] = useState('')
  const [gioKetThuc, setGioKetThuc] = useState('')
  const [phong, setPhong] = useState('')
  const [gv, setGv] = useState<string | null>(null)
  const [ta, setTa] = useState<string | null>(null)
  const [pickId, setPickId] = useState<string | null>(null)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [phongs, setPhongs] = useState<Phong[]>([])
  const [sapToi, setSapToi] = useState<CaBoTro[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    listNhanSu().then(setNss).catch(() => {}); buoiBuSapToi().then(setSapToi).catch(() => {})
    listPhong(true).then(setPhongs).catch(() => {})
    // Mặc định lấy từ LỚP của buổi nghỉ: TA (người bổ trợ mặc định) + GV + giờ + phòng.
    goiYBuoiBu(item.buoi_me_id).then((g) => { setTa(g.ta_id); setGv(g.gv_id); if (g.gio) { const gg = String(g.gio).slice(0, 5); setGio(gg); setGioKetThuc(cong60(gg)) } if (g.phong) setPhong(g.phong) }).catch(() => {})
  }, [item.buoi_me_id]) // eslint-disable-line
  const nsOpts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])
  const phongOpts = useMemo(() => phongs.map((p) => ({ id: p.ma_phong, label: p.ten_phong })), [phongs])
  async function go() {
    setBusy(true)
    try {
      let makeupId = pickId
      if (mode === 'moi') {
        if (!ngay) { alert('Chọn ngày'); setBusy(false); return }
        makeupId = await taoBuoiBu({ ngay, gio_bat_dau: gio || null, gio_ket_thuc: gioKetThuc || null, phong: phong || null, nguoi_day: gv, nguoi_day_tg: ta })
      } else if (!makeupId) { alert('Chọn buổi bù có sẵn'); setBusy(false); return }
      await themHSVaoBuoiBu(makeupId!, [{ hoc_sinh_id: item.hoc_sinh_id, buoi_me_id: item.buoi_me_id }])
      onDone()
    } catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <Modal title="Xếp bổ trợ" onClose={onClose} maxW="max-w-[820px]">
      <div className="mb-4"><HsBlocks item={item} /></div>
      <div className="mb-3 inline-flex rounded-lg border border-slate-200 p-0.5 text-[13px]">
        <button onClick={() => setMode('moi')} className={`rounded-md px-3 py-1 font-medium ${mode === 'moi' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Tạo buổi mới</button>
        <button onClick={() => setMode('cosan')} className={`rounded-md px-3 py-1 font-medium ${mode === 'cosan' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>Chọn buổi có sẵn</button>
      </div>
      {mode === 'moi' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Ngày *</label><input type="date" className={inputCls} value={ngay} onChange={(e) => setNgay(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Giờ bắt đầu</label><input type="time" className={inputCls} value={gio} onChange={(e) => setGio(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Giờ kết thúc</label><input type="time" className={inputCls} value={gioKetThuc} onChange={(e) => setGioKetThuc(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Phòng</label><SearchSelect value={phong || null} onChange={(v) => setPhong(v ?? '')} options={phongOpts} placeholder="Chọn phòng…" /></div>
          </div>
          {/* Nhãn theo ĐÚNG người nhận việc — xem ghi chú đầu SuaBuoiModal.tsx. */}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Người dạy bổ trợ *</label><SearchSelect value={ta} onChange={setTa} options={nsOpts} placeholder="Chọn người dạy bù…" /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">GV</label><SearchSelect value={gv} onChange={setGv} options={nsOpts} placeholder="Chọn GV…" /></div>
          </div>
          <p className="text-[12px] text-slate-400">Chấm ET + đánh giá về <b>người dạy bổ trợ</b>; bỏ trống ô đó thì việc rơi sang GV.</p>
        </div>
      ) : (
        <div className="max-h-72 space-y-2 overflow-auto">
          {sapToi.length === 0 ? <p className="text-[13px] text-slate-400">Chưa có buổi bù nào đang chờ.</p> : sapToi.map((c) => (
            <button key={c.id} onClick={() => setPickId(c.id)} className={`block w-full rounded-lg border p-3 text-left text-[13px] ${pickId === c.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex flex-wrap items-center gap-x-2">
                <b>Buổi bù · {ddmm(c.ngay)}</b>
                <span className="text-slate-500">{c.gio_bat_dau?.slice(0, 5)}{c.phong ? ` · ${c.phong}` : ''}</span>
                <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700">{c.hs.length} HS</span>
              </div>
              {c.hs.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {c.hs.map((h) => (
                    <span key={h.hoc_sinh_id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-normal text-slate-600">
                      {h.ho_ten}{h.lop_bu ? ` · ${h.lop_bu}${h.mon ? ` (${h.mon})` : ''}` : ''}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
        <button onClick={go} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? '…' : 'Xếp vào buổi bù'}</button>
      </div>
    </Modal>
  )
}

// ⭐ GIÁO TRÌNH · BTVN · ET CỦA BUỔI MẸ ngay trong buổi bù (CEO 14/08: "để nhân sự khỏi lục lại kho
// tài liệu"). Người dạy bù cần đúng 3 thứ này của buổi em đã nghỉ — trước đây phải nhớ lớp + ngày rồi
// sang Kho tài liệu tự lọc, mỗi em một bộ khác nhau (buổi bù gom nhiều lớp).
// Loại nào KHÔNG có thì vẫn hiện nhãn xám "chưa có": im lặng bỏ đi thì người dạy tưởng mình tìm thiếu,
// còn nói ra thì biết là buổi đó thật sự chưa soạn — hai chuyện khác hẳn nhau.
const DOC_META: Record<DocBuoi['loai'], { icon: string; ten: string }> = {
  giao_trinh_buoi: { icon: '📘', ten: 'Giáo trình' },
  btvn: { icon: '📝', ten: 'BTVN' },
  et: { icon: '🧪', ten: 'ET' },
}
const DOC_THU_TU: DocBuoi['loai'][] = ['giao_trinh_buoi', 'btvn', 'et']
function TaiLieuBuoiMe({ docs, onIn }: { docs: DocBuoi[]; onIn: (d: DocBuoi) => void }) {
  const [copied, setCopied] = useState<string | null>(null)
  async function copy(d: DocBuoi) {
    if (!d.file_url) return
    await navigator.clipboard.writeText(d.file_url)
    setCopied(d.id); setTimeout(() => setCopied((c) => (c === d.id ? null : c)), 2000)
  }
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Tài liệu buổi đã nghỉ</span>
      {DOC_THU_TU.map((loai) => {
        const d = docs.find((x) => x.loai === loai)
        const m = DOC_META[loai]
        if (!d) return <span key={loai} className="rounded-lg border border-dashed border-slate-200 px-2 py-1 text-[11px] text-slate-300">{m.icon} {m.ten} — chưa có</span>
        return (
          <span key={loai} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-0.5 pl-2 pr-0.5 text-[11px] text-slate-600" title={d.ten}>
            {m.icon} {m.ten}
            <button onClick={() => onIn(d)} className="rounded-md px-1.5 py-1 font-medium text-indigo-600 hover:bg-indigo-50">🖨 In</button>
            {d.file_url
              ? <button onClick={() => copy(d)} className="rounded-md px-1.5 py-1 font-medium text-sky-600 hover:bg-sky-50">{copied === d.id ? '✓' : '🔗 Link'}</button>
              : <span className="px-1 text-slate-300" title="Tài liệu chưa có link PDF — vẫn in được">—</span>}
          </span>
        )
      })}
    </div>
  )
}

// ── Detail buổi bù: điểm danh + ET per-HS + đánh giá ──
const ET_LBL: Record<ETResult, { l: string; on: string }> = { correct: { l: 'Đ', on: 'bg-emerald-500' }, partial: { l: 'C', on: 'bg-amber-500' }, wrong: { l: 'S', on: 'bg-rose-500' } }
const DG_LBL: { v: 1 | 0.5 | 0; l: string; on: string }[] = [{ v: 1, l: 'Đ', on: 'bg-emerald-500' }, { v: 0.5, l: 'C', on: 'bg-amber-500' }, { v: 0, l: 'S', on: 'bg-rose-500' }]

// Mở từ BoTroScreen (OPS) HOẶC "Việc của tôi" (TA chấm ET / GV đánh giá) → nhận buoiId, tự load + seed ET buổi mẹ.
export function BuoiBuDetail({ buoiId, readOnly = false, onClose }: { buoiId: string; readOnly?: boolean; onClose: () => void }) {
  const [buoi, setBuoi] = useState<BuoiHoc | null>(null)
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [dg, setDg] = useState<Record<string, { diemTheoDang: Record<string, number> }>>({})
  const [nx, setNx] = useState<Record<string, string>>({})
  const [dangTen, setDangTen] = useState<Record<string, string>>({})
  const [hsInfo, setHsInfo] = useState<Record<string, BuoiBuHsInfo>>({})
  // Tài liệu buổi MẸ theo buoi_me_id (không theo HS: 2 em cùng nghỉ 1 buổi thì dùng chung bộ).
  const [docs, setDocs] = useState<Record<string, DocBuoi[]>>({})
  const [inDoc, setInDoc] = useState<DocBuoi | null>(null)
  const [busy, setBusy] = useState(false)
  const [sua, setSua] = useState(false)
  const etXong = !!buoi?.et_dong_at, dgXong = !!buoi?.danh_gia_xong_at

  async function onHuy() { const ly = prompt('Lý do huỷ buổi bù?'); if (!ly) return; try { await huyBuoi(buoiId, ly); onClose() } catch (e: any) { alert(e.message ?? String(e)) } }
  async function onXoaHS(r: BuoiHocHS) { if (!confirm(`Gỡ ${r.hoc_sinh?.ho_ten ?? 'HS'} khỏi buổi bù?`)) return; try { await xoaHSKhoiBuoi(r); await reload() } catch (e: any) { alert(e.message ?? String(e)) } }

  async function reload() {
    const [b, r, p, g, dgData, hi] = await Promise.all([getBuoi(buoiId), getRoster(buoiId), listProblems(buoiId, 'et'), listGrades(buoiId), getDanhGia(buoiId), getBuoiBuHsInfo(buoiId)])
    setBuoi(b as BuoiHoc); setRoster(r); setProbs(p); setGrades(g); setDg(dgData as any); setHsInfo(hi)
    try { setDocs(await taiLieuCuaBuoiMe(Object.values(hi).map((v) => v.buoi_me_id).filter(Boolean) as string[])) } catch { setDocs({}) }
    const m: Record<string, string> = {}
    for (const [hsId, v] of Object.entries(dgData)) m[hsId] = (v as any).nhan_xet ?? ''
    setNx(m)
    // ⭐ Tra tên dạng THEO MÔN của TỪNG HS (buổi bù gom nhiều lớp/môn khác nhau) — KHÔNG gộp chung
    // 1 bảng tra cả buổi. Lý do: ma_dang KHÔNG unique xuyên môn (Toán/KHTN có mã trùng số), tra gộp
    // dai_ban_do+khtn_ban_do rồi merge sẽ bị bảng sau đè tên sai môn (bug 07-07: bù 9C1/Toán hiện tên
    // dạng KHTN). Key map = `${mon}|${ma_dang}` để 2 môn cùng mã số vẫn tách bạch.
    try {
      const byMon: Record<string, Set<string>> = {}
      for (const prob of p) {
        if (!prob.ma_dang || !prob.hoc_sinh_id) continue
        const mon = hi[prob.hoc_sinh_id]?.mon || 'Toán'
        ;(byMon[mon] ??= new Set()).add(prob.ma_dang)
      }
      const dt: Record<string, string> = {}
      for (const [mon, set] of Object.entries(byMon)) {
        const tm = await getDangTen([...set], mon)
        for (const [md, ten] of Object.entries(tm)) dt[`${mon}|${md}`] = ten
      }
      setDangTen(dt)
    } catch { /* */ }
  }
  const tenDang = (md: string, hocSinhId: string) => { const mon = hsInfo[hocSinhId]?.mon || 'Toán'; return dangTen[`${mon}|${md}`] ?? md }
  useEffect(() => { (async () => { try { await ensureBuoiBuETProblems(buoiId) } catch { /* */ } reload() })() }, []) // eslint-disable-line
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  // Đã đánh giá = có nhận xét không rỗng HOẶC ≥1 ô chấm dạng (cùng công thức `danhGiaTienDo`, gami.ts).
  const daDienDG = coMat.filter((r) => (nx[r.hoc_sinh_id] ?? '').trim() || Object.keys(dg[r.hoc_sinh_id]?.diemTheoDang ?? {}).length > 0).length
  const tenHT = tenHienThiDs(roster.map((r) => r.hoc_sinh?.ho_ten)) // 2 HS trùng tên rút gọn → bung đủ (Thùy 07-06)
  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  const dangCuaHS = (hsid: string) => [...new Set(probs.filter((p) => p.hoc_sinh_id === hsid).map((p) => p.ma_dang).filter(Boolean))] as string[]

  async function setDD(r: BuoiHocHS, tt: 'co_mat' | 'vang') { try { await diemDanh(r.id, tt); await reload() } catch (e: any) { alert(e.message) } }
  async function setET(pid: string, hsid: string, result: ETResult) {
    const g = gradeOf(pid, hsid)
    try { if (g?.result === result) await deleteGrade(pid, hsid); else await gradeET({ buoiId, problemId: pid, hocSinhId: hsid, result, loi: [] }); await reload() } catch (e: any) { alert(e.message) }
  }
  async function setDG(hsid: string, md: string, v: 1 | 0.5 | 0) {
    const cur = dg[hsid]?.diemTheoDang[md]
    try { await setDanhGiaDang(buoiId, hsid, md, cur === v ? null : (v as any)); await reload() } catch (e: any) { alert(e.message) }
  }
  async function luuNhanXet(hsid: string) { try { await setNhanXet(buoiId, hsid, nx[hsid] ?? '') } catch (e: any) { alert(e.message) } }
  async function doClose(phase: 'et' | 'danhgia') {
    setBusy(true)
    try { if (phase === 'et') await closePhase(buoiId, 'et'); else await dongDanhGia(buoiId); await reload() }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function reopen(phase: 'et' | 'danhgia') { setBusy(true); try { if (phase === 'danhgia') { await moLaiDanhGia(buoiId); await reload() } else alert('Mở lại ET ở màn Buổi học/Điểm số.') } catch (e: any) { alert(e.message) } finally { setBusy(false) } }

  return (
    <div className="flex h-full flex-col bg-[#f5f5f7]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <button onClick={onClose} className="text-[14px] text-slate-500 hover:text-slate-800">‹ Bổ trợ</button>
        <span className="text-[15px] font-semibold text-slate-800">Buổi bù · {ddmm(buoi?.ngay)} · {buoi?.gio_bat_dau?.slice(0, 5)}{buoi?.phong ? ` · ${buoi.phong}` : ''}</span>
        {!readOnly && buoi && <button onClick={() => setSua(true)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-700">✎ Sửa buổi</button>}
        {!readOnly && <button onClick={onHuy} className="rounded-lg border border-rose-200 px-2.5 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Huỷ buổi</button>}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[900px] space-y-3">
          {roster.length === 0 ? <Empty t="Buổi chưa có HS." /> : roster.map((r, i) => {
            const ps = probs.filter((p) => p.hoc_sinh_id === r.hoc_sinh_id)
            const dangs = dangCuaHS(r.hoc_sinh_id)
            const info = hsInfo[r.hoc_sinh_id]
            return (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-semibold text-slate-800">{tenHT[i]}</span>
                  {(r.hoc_sinh?.ma_hs || info?.ma_hs) && <span className="font-mono text-[11px] text-slate-400">{r.hoc_sinh?.ma_hs ?? info?.ma_hs}</span>}
                  {info?.lop_bu && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">{info.lop_bu}{info.mon ? ` (${info.mon})` : ''}</span>}
                  {info?.bu_cho && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] text-violet-600" title="Buổi HS đang bù cho">Bù cho: {info.bu_cho}</span>}
                  <div className="ml-auto flex items-center gap-1">
                    <button disabled={readOnly} onClick={() => setDD(r, 'co_mat')} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${r.diem_danh === 'co_mat' ? 'bg-emerald-500 text-white' : 'border border-slate-200 text-slate-500'}`}>Có mặt</button>
                    <button disabled={readOnly} onClick={() => setDD(r, 'vang')} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${r.diem_danh === 'vang' ? 'bg-rose-500 text-white' : 'border border-slate-200 text-slate-500'}`}>Vắng</button>
                    {!readOnly && <button onClick={() => onXoaHS(r)} title="Gỡ HS khỏi buổi bù" className="rounded px-1.5 py-1 text-[12px] text-slate-300 hover:bg-rose-50 hover:text-rose-600">✕</button>}
                  </div>
                </div>
                <TaiLieuBuoiMe docs={info?.buoi_me_id ? docs[info.buoi_me_id] ?? [] : []} onIn={setInDoc} />
                {r.diem_danh === 'co_mat' && (
                  <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                    <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Chấm ET <span className="font-normal normal-case text-slate-300">— từ buổi mẹ</span></div>
                      {ps.length === 0 ? <p className="text-[13px] text-slate-400">Buổi mẹ chưa có ET.</p> : (
                        <div className="flex flex-wrap gap-2">{ps.map((p, i) => {
                          const kq = gradeOf(p.id, r.hoc_sinh_id)?.result as ETResult | undefined
                          return (
                            <div key={p.id} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1">
                              <span className="text-[12px] text-slate-400">B{i + 1}</span>
                              {(['correct', 'partial', 'wrong'] as ETResult[]).map((res) => <button key={res} disabled={readOnly || etXong} onClick={() => setET(p.id, r.hoc_sinh_id, res)} className={`h-6 w-6 rounded text-[12px] font-bold ${kq === res ? `${ET_LBL[res].on} text-white` : 'bg-slate-100 text-slate-400'}`}>{ET_LBL[res].l}</button>)}
                            </div>
                          )
                        })}</div>
                      )}
                    </div>
                    <div>
                      <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Đánh giá theo dạng</div>
                      {dangs.length === 0 ? <p className="text-[13px] text-slate-400">Không có dạng (ET buổi mẹ trống).</p> : (
                        <div className="space-y-1.5">{dangs.map((md) => {
                          const cur = dg[r.hoc_sinh_id]?.diemTheoDang[md]
                          return (
                            <div key={md} className="flex items-center gap-3">
                              <div className="w-[200px] shrink-0">
                                <div className="truncate text-[13px] text-slate-700" title={tenDang(md, r.hoc_sinh_id)}>{tenDang(md, r.hoc_sinh_id)}</div>
                                <div className="font-mono text-[10px] text-slate-400">{md}</div>
                              </div>
                              <div className="flex gap-1">{DG_LBL.map((d) => <button key={d.v} disabled={readOnly || dgXong} onClick={() => setDG(r.hoc_sinh_id, md, d.v)} className={`h-7 w-7 rounded text-[12px] font-bold ${cur === d.v ? `${d.on} text-white` : 'bg-slate-100 text-slate-400'}`}>{d.l}</button>)}</div>
                            </div>
                          )
                        })}</div>
                      )}
                    </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Nhận xét của GV</div>
                      <textarea value={nx[r.hoc_sinh_id] ?? ''} disabled={readOnly} onChange={(e) => setNx((m) => ({ ...m, [r.hoc_sinh_id]: e.target.value }))} onBlur={() => luuNhanXet(r.hoc_sinh_id)}
                        placeholder="Nhận xét HS sau buổi bù (tiến độ, điểm lưu ý…)" className="h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-indigo-400 disabled:bg-slate-50" />
                    </div>
                  </div>
                )}
                {/* Trước đây chỉ in "Vắng — không chấm." rồi thôi, nên người bấm không biết
                    chuyện gì xảy ra tiếp (CEO 12/08: "ấn vắng ko thấy action gì") — mà thật ra
                    hồi đó KHÔNG có chuyện gì xảy ra thật: lần nghỉ gốc đã bị coi là đã xử lý
                    vĩnh viễn. Nay em tự quay lại hàng đợi, nên nói thẳng ra. */}
                {(r.diem_danh === 'vang' || r.diem_danh === 'vang_phep') && (
                  <div className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
                    Vắng — không chấm buổi này. Lần nghỉ gốc đã <b>quay lại “Cần xếp bù”</b> để xếp lại buổi khác.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {!readOnly && coMat.length > 0 && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3">
          {/* Điền xong ≠ đã chốt — xem ghi chú ở DanhGiaTab (BuoiHocScreen.tsx). */}
          {!dgXong && daDienDG > 0 && (
            <span className={`mr-auto text-[12px] font-medium ${daDienDG >= coMat.length ? 'text-amber-600' : 'text-slate-400'}`}>
              đã đánh giá {daDienDG}/{coMat.length} HS{daDienDG >= coMat.length ? ' — chưa bấm “Hoàn thành” thì hệ vẫn tính là CHƯA đánh giá' : ''}
            </span>
          )}
          {etXong ? <span className="rounded-lg bg-emerald-100 px-4 py-2 text-[13px] font-medium text-emerald-700">✓ ET đã xác nhận</span>
            : <button onClick={() => doClose('et')} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-emerald-500 disabled:opacity-50">Xác nhận ET</button>}
          {dgXong ? <><span className="rounded-lg bg-emerald-100 px-4 py-2 text-[13px] font-medium text-emerald-700">✓ Đánh giá xong</span><button onClick={() => reopen('danhgia')} disabled={busy} className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] text-slate-600">↩ Mở lại</button></>
            : <button onClick={() => doClose('danhgia')} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">Hoàn thành đánh giá</button>}
        </div>
      )}
      {sua && buoi && <SuaBuoiModal buoi={buoi} onClose={() => setSua(false)} onSaved={() => { setSua(false); reload() }} />}
      {/* Cùng bộ in với Kho tài liệu (ET có layout riêng) — không dựng bản in thứ hai để khỏi lệch. */}
      {inDoc && (inDoc.loai === 'et'
        ? <ETPrintView id={inDoc.id} onClose={() => setInDoc(null)} />
        : <PrintView id={inDoc.id} onClose={() => setInDoc(null)} />)}
    </div>
  )
}
