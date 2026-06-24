// Màn BỔ TRỢ — BÙ buổi nghỉ (ADR app.notion.com/p/389d4530bcdb81de9549fdb99ce1083e). Gu Apple-clean.
// Tabs: Cần bù (L1) / Đã xếp (L2) / Hoàn thành (L3) / Không bù. Detail buổi bù: điểm danh + ET per-HS + đánh giá.
import { useEffect, useMemo, useState } from 'react'
import {
  listCanBu, listCaBoTro, listKhongBu, ghiKhongBu, xoaKhongBu, taoBuoiBu, themHSVaoBuoiBu, buoiBuSapToi, goiYBuoiBu,
  ensureBuoiBuETProblems, demTabBoTro, type CanBuItem, type CaBoTro,
} from '../../lib/botro'
import { getRoster, diemDanh, listProblems, gradeET, deleteGrade, listGrades, closePhase, getDanhGia, setDanhGiaDang, dongDanhGia, moLaiDanhGia, type BuoiHocHS, type Problem, type Grade, type ETResult } from '../../lib/gami'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { homNayVN } from '../../lib/tuan'
import SearchSelect from '../../components/SearchSelect'

type Tab = 'canbu' | 'daxep' | 'xong' | 'khongbu'
const TABS: { k: Tab; ten: string }[] = [{ k: 'canbu', ten: 'Cần bù' }, { k: 'daxep', ten: 'Đã xếp' }, { k: 'xong', ten: 'Hoàn thành' }, { k: 'khongbu', ten: 'Không bù' }]
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const ddmm = (s?: string | null) => (s ? s.split('-').reverse().slice(0, 2).join('/') : '')

export default function BoTroScreen() {
  const [tab, setTab] = useState<Tab>('canbu')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [canbu, setCanbu] = useState<CanBuItem[]>([])
  const [cas, setCas] = useState<CaBoTro[]>([])
  const [khongbu, setKhongbu] = useState<Awaited<ReturnType<typeof listKhongBu>>>([])
  const [loading, setLoading] = useState(true)
  const [xepItem, setXepItem] = useState<CanBuItem | null>(null)
  const [khongModal, setKhongModal] = useState<{ item: CanBuItem } | null>(null)
  const [detail, setDetail] = useState<{ ca: CaBoTro; readOnly: boolean } | null>(null)

  async function reloadCounts() { try { setCounts(await demTabBoTro()) } catch { /* */ } }
  async function reload() {
    setLoading(true)
    try {
      if (tab === 'canbu') setCanbu(await listCanBu())
      else if (tab === 'daxep') setCas(await listCaBoTro(false))
      else if (tab === 'xong') setCas(await listCaBoTro(true))
      else setKhongbu(await listKhongBu())
    } catch { /* */ } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [tab]) // eslint-disable-line
  useEffect(() => { reloadCounts() }, [])
  const refresh = async () => { await reload(); await reloadCounts() }

  async function onKhongXep(item: CanBuItem) { try { await ghiKhongBu(item.id, 'khong_xep_duoc'); await refresh() } catch (e: any) { alert(e.message ?? String(e)) } }

  if (detail) return <BuoiBuDetail ca={detail.ca} readOnly={detail.readOnly} onClose={() => { setDetail(null); refresh() }} />

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

        {loading ? <div className="p-8 text-[14px] text-slate-400">Đang tải…</div>
          : tab === 'canbu' ? (
            canbu.length === 0 ? <Empty t="Không có HS nghỉ nào cần bù." />
              : (
                <div className="space-y-2.5">
                  {canbu.map((c) => (
                    <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      {/* 3 block: tên · lớp · ngày */}
                      <div className="min-w-[180px] flex-1">
                        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Học sinh</div>
                        <div className="text-[16px] font-semibold text-slate-800">{c.ho_ten}</div>
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
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[560px] text-[14px]">
                  <thead><tr className="border-b border-slate-200 text-left text-[13px] text-slate-500"><th className="px-4 py-3 font-medium">Học sinh</th><th className="px-4 py-3 font-medium">Loại</th><th className="px-4 py-3 font-medium">Lý do</th><th className="px-4 py-3 text-right font-medium"></th></tr></thead>
                  <tbody>{khongbu.map((k) => (
                    <tr key={k.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3"><div className="font-medium text-slate-800">{k.ho_ten}</div><div className="text-[12px] text-slate-400">{k.info}</div></td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${k.loai === 'khong_can_bu' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>{k.loai === 'khong_can_bu' ? 'Không cần bù' : 'Không xếp được'}</span></td>
                      <td className="px-4 py-3 text-slate-600">{k.ly_do || '—'}</td>
                      <td className="px-4 py-3 text-right"><button onClick={async () => { await xoaKhongBu(k.absId); refresh() }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-indigo-600 hover:border-indigo-300">↩ Đưa lại Cần bù</button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )
          ) : (
            cas.length === 0 ? <Empty t={tab === 'daxep' ? 'Chưa có ca bổ trợ nào đang chờ.' : 'Chưa có ca bổ trợ nào hoàn thành.'} /> : (
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
                {cas.map((ca) => (
                  <button key={ca.id} onClick={() => setDetail({ ca, readOnly: tab === 'xong' })} className="rounded-2xl border-l-4 border-l-violet-400 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-slate-800">Buổi bù · {ddmm(ca.ngay)}</span>
                      <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700">{ca.hs.length} HS</span>
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">{ca.gio_bat_dau?.slice(0, 5) || '—'}{ca.phong ? ` · ${ca.phong}` : ''}</div>
                    <div className="mt-2 flex flex-wrap gap-1">{ca.hs.slice(0, 6).map((h) => <span key={h.hoc_sinh_id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{h.ho_ten}</span>)}{ca.hs.length > 6 && <span className="text-[11px] text-slate-400">+{ca.hs.length - 6}</span>}</div>
                    <div className="mt-2 flex gap-1.5 text-[11px]">
                      <span className={`rounded px-1.5 py-0.5 font-medium ${ca.et_dong_at ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>ET {ca.et_dong_at ? '✓' : '…'}</span>
                      <span className={`rounded px-1.5 py-0.5 font-medium ${ca.danh_gia_xong_at ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>Đánh giá {ca.danh_gia_xong_at ? '✓' : '…'}</span>
                    </div>
                  </button>
                ))}
              </div>
            )
          )}
      </div>

      {xepItem && <XepModal item={xepItem} onClose={() => setXepItem(null)} onDone={async () => { setXepItem(null); await refresh() }} />}
      {khongModal && <KhongBuModal item={khongModal.item} onClose={() => setKhongModal(null)} onDone={async () => { setKhongModal(null); await refresh() }} />}
    </div>
  )
}

const Empty = ({ t }: { t: string }) => <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-[14px] text-slate-400 shadow-sm">{t}</div>

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
        <div className="text-[16px] font-semibold text-slate-800">{item.ho_ten}</div>
      </div>
      <div className="min-w-[110px] rounded-xl bg-slate-50 px-3.5 py-2.5">
        <div className="text-[12px] font-medium uppercase tracking-wide text-slate-400">Lớp</div>
        <div className="text-[16px] font-semibold text-slate-700">{item.lop}</div>
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

function XepModal({ item, onClose, onDone }: { item: CanBuItem; onClose: () => void; onDone: () => void }) {
  const [mode, setMode] = useState<'moi' | 'cosan'>('moi')
  const [ngay, setNgay] = useState(homNayVN())
  const [gio, setGio] = useState('')
  const [phong, setPhong] = useState('')
  const [gv, setGv] = useState<string | null>(null)
  const [ta, setTa] = useState<string | null>(null)
  const [pickId, setPickId] = useState<string | null>(null)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [sapToi, setSapToi] = useState<CaBoTro[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    listNhanSu().then(setNss).catch(() => {}); buoiBuSapToi().then(setSapToi).catch(() => {})
    // Mặc định lấy từ LỚP của buổi nghỉ: TA (người bổ trợ mặc định) + GV + giờ + phòng.
    goiYBuoiBu(item.buoi_me_id).then((g) => { setTa(g.ta_id); setGv(g.gv_id); if (g.gio) setGio(String(g.gio).slice(0, 5)); if (g.phong) setPhong(g.phong) }).catch(() => {})
  }, [item.buoi_me_id]) // eslint-disable-line
  const nsOpts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])
  async function go() {
    setBusy(true)
    try {
      let makeupId = pickId
      if (mode === 'moi') {
        if (!ngay) { alert('Chọn ngày'); setBusy(false); return }
        makeupId = await taoBuoiBu({ ngay, gio_bat_dau: gio || null, phong: phong || null, nguoi_day: gv, nguoi_day_tg: ta })
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
          <div className="grid grid-cols-3 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Ngày *</label><input type="date" className={inputCls} value={ngay} onChange={(e) => setNgay(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Giờ</label><input type="time" className={inputCls} value={gio} onChange={(e) => setGio(e.target.value)} /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">Phòng</label><input className={inputCls} value={phong} onChange={(e) => setPhong(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">GV (đánh giá)</label><SearchSelect value={gv} onChange={setGv} options={nsOpts} placeholder="Chọn GV…" /></div>
            <div><label className="mb-1 block text-[13px] font-medium text-slate-600">TA (chấm ET)</label><SearchSelect value={ta} onChange={setTa} options={nsOpts} placeholder="Chọn TA…" /></div>
          </div>
        </div>
      ) : (
        <div className="max-h-64 space-y-2 overflow-auto">
          {sapToi.length === 0 ? <p className="text-[13px] text-slate-400">Chưa có buổi bù nào đang chờ.</p> : sapToi.map((c) => (
            <button key={c.id} onClick={() => setPickId(c.id)} className={`block w-full rounded-lg border p-3 text-left text-[13px] ${pickId === c.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <b>Buổi bù · {ddmm(c.ngay)}</b> {c.gio_bat_dau?.slice(0, 5)} {c.phong} · {c.hs.length} HS
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

// ── Detail buổi bù: điểm danh + ET per-HS + đánh giá ──
const ET_LBL: Record<ETResult, { l: string; on: string }> = { correct: { l: 'Đ', on: 'bg-emerald-500' }, partial: { l: 'C', on: 'bg-amber-500' }, wrong: { l: 'S', on: 'bg-rose-500' } }
const DG_LBL: { v: 1 | 0.5 | 0; l: string; on: string }[] = [{ v: 1, l: 'Đ', on: 'bg-emerald-500' }, { v: 0.5, l: 'C', on: 'bg-amber-500' }, { v: 0, l: 'S', on: 'bg-rose-500' }]

function BuoiBuDetail({ ca, readOnly, onClose }: { ca: CaBoTro; readOnly: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<'diemdanh' | 'et' | 'danhgia'>('diemdanh')
  const [roster, setRoster] = useState<BuoiHocHS[]>([])
  const [probs, setProbs] = useState<Problem[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [dg, setDg] = useState<Record<string, { diemTheoDang: Record<string, number> }>>({})
  const [busy, setBusy] = useState(false)
  const etXong = !!ca.et_dong_at, dgXong = !!ca.danh_gia_xong_at

  async function reload() {
    const [r, p, g] = await Promise.all([getRoster(ca.id), listProblems(ca.id, 'et'), listGrades(ca.id)])
    setRoster(r); setProbs(p); setGrades(g); setDg(await getDanhGia(ca.id) as any)
  }
  useEffect(() => { (async () => { try { await ensureBuoiBuETProblems(ca.id) } catch { /* */ } reload() })() }, []) // eslint-disable-line
  const coMat = roster.filter((r) => r.diem_danh === 'co_mat')
  const gradeOf = (pid: string, hsid: string) => grades.find((g) => g.problem_id === pid && g.hoc_sinh_id === hsid)
  const dangCuaHS = (hsid: string) => [...new Set(probs.filter((p) => p.hoc_sinh_id === hsid).map((p) => p.ma_dang).filter(Boolean))] as string[]

  async function setDD(r: BuoiHocHS, tt: 'co_mat' | 'vang') { try { await diemDanh(r.id, tt); await reload() } catch (e: any) { alert(e.message) } }
  async function setET(pid: string, hsid: string, result: ETResult) {
    const g = gradeOf(pid, hsid)
    try { if (g?.result === result) await deleteGrade(pid, hsid); else await gradeET({ buoiId: ca.id, problemId: pid, hocSinhId: hsid, result, loi: [] }); await reload() } catch (e: any) { alert(e.message) }
  }
  async function setDG(hsid: string, md: string, v: 1 | 0.5 | 0) {
    const cur = dg[hsid]?.diemTheoDang[md]
    try { await setDanhGiaDang(ca.id, hsid, md, cur === v ? null : (v as any)); await reload() } catch (e: any) { alert(e.message) }
  }
  async function doClose(phase: 'et' | 'danhgia') {
    setBusy(true)
    try { if (phase === 'et') await closePhase(ca.id, 'et'); else await dongDanhGia(ca.id); onClose() }
    catch (e: any) { alert(e.message ?? String(e)); setBusy(false) }
  }
  async function reopen(phase: 'et' | 'danhgia') { setBusy(true); try { if (phase === 'danhgia') { await moLaiDanhGia(ca.id); onClose() } else { alert('Mở lại ET ở màn Buổi học/Điểm số.'); setBusy(false) } } catch (e: any) { alert(e.message); setBusy(false) } }

  return (
    <div className="flex h-full flex-col bg-[#f5f5f7]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
        <button onClick={onClose} className="text-[14px] text-slate-500 hover:text-slate-800">‹ Bổ trợ</button>
        <span className="text-[15px] font-semibold text-slate-800">Buổi bù · {ddmm(ca.ngay)} · {ca.gio_bat_dau?.slice(0, 5)}{ca.phong ? ` · ${ca.phong}` : ''}</span>
        <div className="ml-auto inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
          {(['diemdanh', 'et', 'danhgia'] as const).map((s) => <button key={s} onClick={() => setSub(s)} className={`rounded-lg px-3 py-1 text-[13px] font-medium ${sub === s ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>{s === 'diemdanh' ? 'Điểm danh' : s === 'et' ? 'Chấm ET' : 'Đánh giá'}</button>)}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[1100px]">
          {sub === 'diemdanh' && (
            <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
              {roster.map((r) => (
                <div key={r.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <span className="text-[14px] font-medium text-slate-800">{r.hoc_sinh?.ho_ten}</span>
                  <div className="ml-auto flex gap-1">
                    <button disabled={readOnly} onClick={() => setDD(r, 'co_mat')} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${r.diem_danh === 'co_mat' ? 'bg-emerald-500 text-white' : 'border border-slate-200 text-slate-500'}`}>Có mặt</button>
                    <button disabled={readOnly} onClick={() => setDD(r, 'vang')} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${r.diem_danh === 'vang' ? 'bg-rose-500 text-white' : 'border border-slate-200 text-slate-500'}`}>Vắng</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sub === 'et' && (
            <div className="space-y-4">
              {coMat.length === 0 ? <Empty t="Chưa có HS có mặt (điểm danh trước)." /> : coMat.map((r) => {
                const ps = probs.filter((p) => p.hoc_sinh_id === r.hoc_sinh_id)
                return (
                  <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 text-[14px] font-semibold text-slate-800">{r.hoc_sinh?.ho_ten} <span className="text-[12px] font-normal text-slate-400">— ET từ buổi mẹ</span></div>
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
                )
              })}
              {!readOnly && coMat.length > 0 && (
                <div className="flex justify-end">
                  {etXong ? <span className="rounded-lg bg-emerald-100 px-4 py-2 text-[13px] font-medium text-emerald-700">✓ ET đã xác nhận</span>
                    : <button onClick={() => doClose('et')} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-emerald-500 disabled:opacity-50">Xác nhận ET</button>}
                </div>
              )}
            </div>
          )}

          {sub === 'danhgia' && (
            <div className="space-y-4">
              {coMat.length === 0 ? <Empty t="Chưa có HS có mặt." /> : coMat.map((r) => {
                const dangs = dangCuaHS(r.hoc_sinh_id)
                return (
                  <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 text-[14px] font-semibold text-slate-800">{r.hoc_sinh?.ho_ten}</div>
                    {dangs.length === 0 ? <p className="text-[13px] text-slate-400">Không có dạng (ET buổi mẹ trống).</p> : (
                      <div className="space-y-1.5">{dangs.map((md) => {
                        const cur = dg[r.hoc_sinh_id]?.diemTheoDang[md]
                        return (
                          <div key={md} className="flex items-center gap-2">
                            <span className="w-40 truncate text-[13px] text-slate-600" title={md}>{md}</span>
                            <div className="flex gap-1">{DG_LBL.map((d) => <button key={d.v} disabled={readOnly || dgXong} onClick={() => setDG(r.hoc_sinh_id, md, d.v)} className={`h-7 w-7 rounded text-[12px] font-bold ${cur === d.v ? `${d.on} text-white` : 'bg-slate-100 text-slate-400'}`}>{d.l}</button>)}</div>
                          </div>
                        )
                      })}</div>
                    )}
                  </div>
                )
              })}
              {!readOnly && coMat.length > 0 && (
                <div className="flex justify-end gap-2">
                  {dgXong ? <><span className="rounded-lg bg-emerald-100 px-4 py-2 text-[13px] font-medium text-emerald-700">✓ Đã hoàn thành</span><button onClick={() => reopen('danhgia')} disabled={busy} className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] text-slate-600">↩ Mở lại</button></>
                    : <button onClick={() => doClose('danhgia')} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-emerald-500 disabled:opacity-50">Hoàn thành đánh giá</button>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
