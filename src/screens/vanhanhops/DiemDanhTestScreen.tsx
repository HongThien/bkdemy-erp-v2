// Điểm danh test đầu vào — OPS tạo lúc HS THẬT SỰ tới test (đặt lịch trước hoặc walk-in).
// Bằng chứng thật "đã đến test" cho ops-lead tuyển sinh audit L5→L6 (xem tuyensinh.ts).
// Leaf riêng (KHÔNG nhét vào màn Tuyển sinh `tuyensinh` — OPS chỉ cần đúng việc này, không cần
// thấy/sửa cả phễu L5-L8) — cùng nguyên tắc tách leaf đã áp cho Report/Prep (BKDEMY_OPS_SPEC_DETAIL.md).
// ⭐ Đảo luồng 07-19 (BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md): đề chọn THẲNG từ Kho MT (dropdown, mặc định
// MT mới nhất, đổi được bất kỳ lúc nào tại phòng) — KHÔNG còn qua de_test (đã bỏ hẳn, mig 0105).
// Trả bài (Story 4, gộp Nhận xét) TÁCH RA tab riêng — xem TraBaiTestScreen.tsx (Thùy chốt 07-19 lần 2:
// "Trả bài rơi vào điểm danh test, đáng lẽ là tab riêng tương đương Chấm test").
import { useEffect, useState } from 'react'
import {
  listCaTestDangChay, listCaTestHoanThanh, taoCaTest, uploadCaTestBai, ganBaiCaTest, hoanThanhCaTest,
  listUngVienL5, getUngVien, gioKetThucCaTest, THOI_LUONG_OPTIONS, MON_OPTIONS,
  suaCaTest, huyCaTest, khoiPhucCaTest, listCaTestDaHuy,
  type CaTest, type TaoCaTestInput, type MonTS, type SuaCaTestInput,
} from '../../lib/tuyensinh'
import { ganDeCaTest, ganDeDangDung, listDeTestDauVao, type DeTestRow } from '../../lib/detest'
import { KHOI_OPTIONS, DEFAULT_KHOI } from '../../lib/kho/api'
import { homNayVN, mucDeadline, nhanConLai, type DeadlineMuc } from '../../lib/tuan'
import SearchSelect from '../../components/SearchSelect'
import { useIsMobile } from '../../hooks/useIsMobile'
import MTPrintView from '../tailieu/MTPrintView'

// ⭐ CEO 20/09: Ops in đề cho HS NGAY lúc tạo ca test (HS đang đứng ở quầy). Đề test sinh từ MT nên nhiều đề mang
// đủ 3 MÃ ĐỀ trong cùng 1 file — in cho 1 học sinh thì CHỈ in MÃ 1 (đề gốc): ca test snapshot câu của đề gốc
// (`ganDeCaTest` duyệt `maCaus` gốc) ⇒ giấy phát ra phải khớp đúng bộ câu TA sẽ chấm. Dùng lại chế độ "in theo học
// sinh" của MTPrintView (`perHS`, 1 phiếu = 1 mã, tên in sẵn) — không viết máy in thứ hai.
const MA_DE_IN_TEST = 1
type InDe = { taiLieuId: string; ungVienId: string; hoTen: string; khoi: string | null }
const LS_IN_DE = 'tdv_in_de_khi_tao'
const docInDeMacDinh = (): boolean => { try { return localStorage.getItem(LS_IN_DE) !== '0' } catch { return true } }

// Ca đang được tự-gán đề (promise đang chạy) — module-level để sống qua StrictMode remount; xem effect trong CaCard.
const DANG_GAN = new Map<string, Promise<DeTestRow | null>>()

const DEADLINE_TONE: Record<DeadlineMuc, string> = { qua_han: 'text-rose-600', sat: 'text-orange-600', gan: 'text-amber-600', con_nhieu: 'text-slate-400' }
const inputCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-indigo-400'
const Lbl = ({ children }: { children: React.ReactNode }) => <label className="mb-1 block text-[13px] font-medium text-slate-600">{children}</label>

export default function DiemDanhTestScreen() {
  const [dangChay, setDangChay] = useState<CaTest[]>([])
  const [hoanThanhHomNay, setHoanThanhHomNay] = useState<CaTest[]>([])
  const [deList, setDeList] = useState<DeTestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(false)
  const [inDe, setInDe] = useState<InDe | null>(null)   // đang mở máy in đề cho 1 HS (mã 1)
  const [now, setNow] = useState(() => Date.now())
  // ⭐ CEO 20/09 "sửa / xoá được ở điểm danh test": sửa = modal; xoá = HUỶ CA có lý do (không xoá cứng — §4), khôi phục được.
  const [daHuy, setDaHuy] = useState<CaTest[]>([])
  const [suaCa, setSuaCa] = useState<CaTest | null>(null)
  const [huyCa, setHuyCa] = useState<CaTest | null>(null)
  const [loiKp, setLoiKp] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const [a, b, m, h] = await Promise.all([listCaTestDangChay(), listCaTestHoanThanh(homNayVN()), listDeTestDauVao(), listCaTestDaHuy()])
      setDangChay(a); setHoanThanhHomNay(b); setDeList(m); setDaHuy(h)
    } finally { setLoading(false) }
  }
  // Vá TẠI CHỖ sau mutation (CLAUDE.md §2) — không quét lại cả màn.
  const vaCa = (ca: CaTest) => { setDangChay((s) => s.map((x) => (x.id === ca.id ? ca : x))); setHoanThanhHomNay((s) => s.map((x) => (x.id === ca.id ? ca : x))) }
  const daHuyXong = (ca: CaTest, lyDo: string) => {
    setDangChay((s) => s.filter((x) => x.id !== ca.id)); setHoanThanhHomNay((s) => s.filter((x) => x.id !== ca.id))
    setDaHuy((s) => [{ ...ca, trangThai: 'huy', huyLyDo: lyDo }, ...s])
  }
  async function khoiPhuc(ca: CaTest) {
    setLoiKp(null)
    try {
      const tt = await khoiPhucCaTest(ca.id)
      setDaHuy((s) => s.filter((x) => x.id !== ca.id))
      const moi: CaTest = { ...ca, trangThai: tt, huyLyDo: null }
      if (tt === 'dang_test') setDangChay((s) => [...s, moi])
      else if (ca.ngay === homNayVN()) setHoanThanhHomNay((s) => [moi, ...s])
    } catch (e: any) { setLoiKp(e.message ?? String(e)) }
  }
  useEffect(() => { reload() }, [])
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(id) }, [])

  const isMobile = useIsMobile()
  return (
    <div className="h-full overflow-auto">
    <div className={isMobile ? 'mx-auto max-w-[1100px] p-3' : 'mx-auto max-w-[1100px] p-6'}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Điểm danh test</h2>
          <p className="text-[12px] text-slate-400">HS tới test đầu vào (đặt lịch trước hoặc walk-in) — đếm ngược tới giờ kết thúc dự kiến.</p>
        </div>
        <button onClick={() => setForm(true)} className="ml-auto min-h-[44px] rounded-xl bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo test đầu vào</button>
      </div>

      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : dangChay.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có ca test nào đang chạy.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {dangChay.map((c) => <CaTestCard key={c.id} c={c} now={now} deList={deList} onChanged={reload} onInDe={setInDe} onSua={() => setSuaCa(c)} onHuy={() => setHuyCa(c)} />)}
        </div>
      )}

      {hoanThanhHomNay.length > 0 && (
        <details className="mt-5">
          <summary className="cursor-pointer text-[12px] font-medium text-emerald-700">✓ Đã xong hôm nay ({hoanThanhHomNay.length})</summary>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {hoanThanhHomNay.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
                <span className="font-semibold text-slate-700">{c.ungVien.hoTenHs}</span> · {c.mon} · {c.gioBatDau.slice(0, 5)} ({c.thoiLuongPhut}')
                {c.baiUrl && <a href={c.baiUrl} target="_blank" rel="noreferrer" className="ml-1.5 text-indigo-500 hover:underline">📄 bài</a>}
                <span className="float-right flex gap-1">
                  <button onClick={() => setSuaCa(c)} title="Sửa thông tin ca / học sinh" className="rounded px-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600">✎</button>
                  <button onClick={() => setHuyCa(c)} title="Huỷ ca (tạo nhầm…)" className="rounded px-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">🗑</button>
                </span>
              </div>
            ))}
          </div>
        </details>
      )}

      {daHuy.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-[12px] font-medium text-slate-400">🗑 Đã huỷ ({daHuy.length})</summary>
          {loiKp && <p className="mt-1 text-[12px] text-rose-600">{loiKp}</p>}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {daHuy.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] text-slate-500 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate"><span className="font-semibold text-slate-600 line-through">{c.ungVien.hoTenHs}</span> · {c.mon}{c.ungVien.khoi ? ` · Lớp ${c.ungVien.khoi}` : ''} · {new Date(c.ngay + 'T00:00:00').toLocaleDateString('vi-VN')}</span>
                  <button onClick={() => khoiPhuc(c)} className="shrink-0 rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600">↩ Khôi phục</button>
                </div>
                {c.huyLyDo && <div className="mt-0.5 text-[11px] text-slate-400">Lý do: {c.huyLyDo}</div>}
              </div>
            ))}
          </div>
        </details>
      )}
      {suaCa && <SuaCaTestModal c={suaCa} onClose={() => setSuaCa(null)} onDone={(ca) => { vaCa(ca); setSuaCa(null) }} />}
      {huyCa && <HuyCaTestModal c={huyCa} onClose={() => setHuyCa(null)} onDone={(lyDo) => { daHuyXong(huyCa, lyDo); setHuyCa(null) }} />}

      {form && <TaoCaTestModal onClose={() => setForm(false)} onDone={async (inNgay) => { setForm(false); if (inNgay) setInDe(inNgay); await reload() }} />}
      {inDe && (
        <MTPrintView id={inDe.taiLieuId} onClose={() => setInDe(null)}
          perHS={[{ id: inDe.ungVienId, ho_ten: inDe.hoTen, maDe: MA_DE_IN_TEST }]}
          lopTen={inDe.khoi ? `Test đầu vào · Khối ${inDe.khoi}` : 'Test đầu vào'} />
      )}
    </div>
    </div>
  )
}

function CaTestCard({ c, now, deList, onChanged, onInDe, onSua, onHuy }: { c: CaTest; now: number; deList: DeTestRow[]; onChanged: () => void; onInDe: (x: InDe) => void; onSua: () => void; onHuy: () => void }) {
  const [baiUrl, setBaiUrl] = useState<string | null>(c.baiUrl)
  const [taiLieuId, setTaiLieuId] = useState(c.taiLieuId)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const deadline = gioKetThucCaTest(c)
  const muc = mucDeadline(deadline, now) ?? 'con_nhieu'
  // Đề = đề test đầu vào ĐÃ SINH (tab "Đề test") khớp môn + khối ứng viên. listDeTestDauVao() sort desc →
  // đề ĐANG DÙNG (laHienTai) đứng đầu; lịch sử phía sau (Ops vẫn chọn được bản cũ nếu cần). Chưa có đề
  // nào cho khối×môn → báo nhờ học thuật tạo (không fallback MT thô — đề đầu vào phải do học thuật curate).
  const cands = deList.filter((d) => d.mon === c.mon && (!c.ungVien.khoi || d.khoi === c.ungVien.khoi))
  const chuaCoDe = cands.length === 0
  const deDaGan = deList.find((d) => d.id === taiLieuId)
  const lechKhoi = !!deDaGan && !!c.ungVien.khoi && deDaGan.khoi !== c.ungVien.khoi
  async function ganLaiDeDangDung() {
    if (!window.confirm(`Gán lại đề đang dùng của khối ${c.ungVien.khoi} cho ${c.ungVien.hoTenHs}? Kết quả đã chấm trên đề cũ (nếu có) sẽ bị xoá.`)) return
    setBusy(true); setErr(null)
    try { const de = await ganDeDangDung(c.id, c.ungVien.khoi, c.mon); if (de) setTaiLieuId(de.id); else setErr('Chưa có đề đang dùng cho khối này.') }
    catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }

  async function chonFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setBusy(true); setErr(null)
    try { const url = await uploadCaTestBai(f); await ganBaiCaTest(c.id, url); setBaiUrl(url) }
    catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  // ⭐ CEO ① 09/09: chọn đề trong dropdown = LƯU NGAY (bỏ nút "Gán đề" — UI 2 bước làm ca của Tùng
  // 07/09 hoàn tất mà đề chưa từng tới DB). Đổi đề bất kỳ lúc nào tại phòng (HS kêu khó) — dropdown luôn mở.
  async function ganDe(id: string) {
    if (!id || id === taiLieuId) return
    setBusy(true); setErr(null)
    try { await ganDeCaTest(c.id, id); setTaiLieuId(id) }
    catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  // Ca chưa có đề mà (khối × môn) đã có đề ĐANG DÙNG → tự gán lúc card hiện (mặc định, không bắt Ops bấm).
  // ⭐ 14/09: React StrictMode (dev) mount→unmount→mount ⇒ effect chạy 2 lần cách ~60ms, bản cũ gán 2 lần song song
  // ⇒ 68 câu thay vì 34. Giờ: (1) RPC có khoá theo ca ở DB, (2) client chặn gọi trùng bằng `DANG_GAN` module-level
  // (sống qua remount) — lần 2 chờ đúng promise của lần 1 thay vì gọi mới.
  useEffect(() => {
    if (taiLieuId || chuaCoDe) return
    let alive = true
    setBusy(true)
    const p = DANG_GAN.get(c.id) ?? ganDeDangDung(c.id, c.ungVien.khoi, c.mon).finally(() => DANG_GAN.delete(c.id))
    DANG_GAN.set(c.id, p)
    p.then((de) => { if (alive && de) setTaiLieuId(de.id) })
      .catch((ex) => { if (alive) setErr(ex.message ?? String(ex)) })
      .finally(() => { if (alive) setBusy(false) })
    return () => { alive = false }
  }, [c.id, c.ungVien.khoi]) // eslint-disable-line — sửa KHỐI (20/09) từ khối chưa có đề sang khối có đề ⇒ tự gán lại
  async function hoanTat() {
    setBusy(true); setErr(null)
    try { await hoanThanhCaTest(c.id, baiUrl); onChanged() }
    catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className="text-[14px] font-semibold text-slate-800">{c.ungVien.hoTenHs}</span>
        <span className="text-[12px] text-slate-400">{c.ungVien.maUv ?? 'mới'} · {c.mon}{c.ungVien.khoi ? ` · Lớp ${c.ungVien.khoi}` : ''}</span>
        <span className="ml-auto flex gap-1">
          <button onClick={onSua} disabled={busy} title="Sửa thông tin ca / học sinh" className="rounded-md px-2 py-0.5 text-[13px] text-slate-400 hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-40">✎ Sửa</button>
          <button onClick={onHuy} disabled={busy} title="Huỷ ca (tạo nhầm, HS không đến…) — khôi phục được" className="rounded-md px-2 py-0.5 text-[13px] text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40">🗑 Huỷ</button>
        </span>
      </div>
      <div className="mb-2 text-[12px] text-slate-500">{c.ungVien.hoTenPh || '—'} · {c.ungVien.sdtPh || '—'}</div>
      <div className="mb-2 flex items-center gap-2 text-[13px]">
        <span className="text-slate-600">{c.gioBatDau.slice(0, 5)} · {c.thoiLuongPhut} phút</span>
        <span className={`ml-auto font-semibold ${DEADLINE_TONE[muc]}`}>{muc === 'qua_han' ? '⚠ ' : ''}{nhanConLai(deadline, now)}</span>
      </div>

      {/* ⭐ 15/09: khối ứng viên đổi SAU khi gán đề (Tuệ Nhi: tạo khối 8 → sửa 7, đề K8 39 câu vẫn dính) ⇒ nêu cờ + gán lại. */}
      {lechKhoi && (
        <div className="mb-2 flex flex-wrap items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[12px] text-rose-800">
          <span>⚠ Đề đang gán là <b>khối {deDaGan!.khoi}</b>, học sinh <b>khối {c.ungVien.khoi}</b></span>
          <button onClick={ganLaiDeDangDung} disabled={busy} className="ml-auto rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-500 disabled:opacity-40">📘 Gán lại đề đang dùng</button>
        </div>
      )}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {deDaGan && <span className="text-[12px] text-slate-500">📘 {deDaGan.ten}</span>}
        {chuaCoDe ? (
          <span className="text-[11px] text-amber-600" title='Học thuật chưa tạo đề test đầu vào cho khối×môn này ở tab "Đề test".'>⚠ Chưa có đề test đầu vào cho khối này</span>
        ) : (
          <>
            <select className="min-h-[36px] rounded-md border border-slate-200 px-2 py-1.5 text-[12px]" value={taiLieuId ?? ''} onChange={(e) => ganDe(e.target.value)} disabled={busy} title="Chọn là lưu ngay">
              <option value="" disabled>{busy ? 'Đang gán đề…' : 'Chọn đề…'}</option>
              {cands.map((d) => <option key={d.id} value={d.id}>{d.ten}{d.laHienTai ? ' · đang dùng' : ' · lịch sử'}</option>)}
            </select>
          </>
        )}
      </div>

      {/* ⭐ 13/09 (CEO): Ops KHÔNG chọn người nữa — trigger DB gán từ tab "Phân công" (khối × môn) lúc tạo ca. Chỉ hiện để biết. */}
      <div className="mb-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-slate-500" title='Gán tự động theo tab "Phân công" (khối × môn) lúc tạo ca'>
        <span>✍️ Chấm: <b className={c.nguoiChamTen ? 'text-slate-700' : 'text-amber-600'}>{c.nguoiChamTen ?? 'chưa phân công khối này'}</b></span>
        <span>📨 Trả bài: <b className={c.nguoiTraBaiTen ? 'text-slate-700' : 'text-amber-600'}>{c.nguoiTraBaiTen ?? 'chưa phân công khối này'}</b></span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex min-h-[36px] cursor-pointer items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">
          {baiUrl ? '📄 Đổi bài' : '📎 Upload bài'}
          <input type="file" accept="application/pdf,image/*" className="hidden" onChange={chonFile} disabled={busy} />
        </label>
        {baiUrl && <a href={baiUrl} target="_blank" rel="noreferrer" className="text-[12px] text-indigo-500 hover:underline">Xem bài</a>}
        {/* In (lại) đề cho HS — luôn MÃ 1, khớp bộ câu ca test đã snapshot. Đề lệch khối thì không cho in (gán lại trước). */}
        <button onClick={() => taiLieuId && onInDe({ taiLieuId, ungVienId: c.ungVienId, hoTen: c.ungVien.hoTenHs, khoi: c.ungVien.khoi })}
          disabled={busy || !taiLieuId || lechKhoi} title={!taiLieuId ? 'Chưa có đề để in' : lechKhoi ? 'Đề đang lệch khối — gán lại đề trước khi in' : 'In đề cho học sinh (mã đề 1, tên in sẵn)'}
          className="min-h-[36px] rounded-md border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-40">🖨 In đề</button>
        {/* ⭐ 09/09: gate Hoàn tất đòi ĐỦ bằng chứng khâu Chấm cần — có bài + có đề (thiếu đề = ca rơi khỏi hàng đợi chấm im lặng). */}
        <button onClick={hoanTat} disabled={busy || !baiUrl || !taiLieuId} title={!baiUrl ? 'Cần upload bài mới hoàn tất được' : !taiLieuId ? 'Cần gán đề trước (khâu chấm cần câu của đề)' : ''} className="ml-auto min-h-[36px] rounded-md bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">✓ Hoàn tất</button>
      </div>
      {err && <p className="mt-1.5 text-[12px] text-rose-600">{err}</p>}
    </div>
  )
}

// SỬA ca (CEO 20/09): ngày · giờ · thời lượng + tên HS · khối · PH · SĐT. Môn KHÔNG sửa ở đây (đổi môn = đổi đề, người
// chấm, mọi thứ ⇒ huỷ ca rồi tạo lại). Lưu xong trả ca đã vá cho màn cha (không quét lại).
function SuaCaTestModal({ c, onClose, onDone }: { c: CaTest; onClose: () => void; onDone: (ca: CaTest) => void }) {
  const [f, setF] = useState<SuaCaTestInput>({
    ngay: c.ngay, gioBatDau: c.gioBatDau.slice(0, 5), thoiLuongPhut: c.thoiLuongPhut,
    hoTenHs: c.ungVien.hoTenHs, khoi: c.ungVien.khoi, hoTenPh: c.ungVien.hoTenPh, sdtPh: c.ungVien.sdtPh,
  })
  const set = <K extends keyof SuaCaTestInput>(k: K, v: SuaCaTestInput[K]) => setF((s) => ({ ...s, [k]: v }))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const doiKhoi = (f.khoi ?? '') !== (c.ungVien.khoi ?? '')
  async function save() {
    setBusy(true); setErr(null)
    try {
      await suaCaTest(c, f)
      onDone({ ...c, ngay: f.ngay, gioBatDau: f.gioBatDau, thoiLuongPhut: f.thoiLuongPhut,
        ungVien: { ...c.ungVien, hoTenHs: f.hoTenHs.trim(), khoi: f.khoi, hoTenPh: f.hoTenPh?.trim() || null, sdtPh: f.sdtPh?.trim() || null } })
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[16px] font-semibold text-slate-800">Sửa ca test · {c.mon}</div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><Lbl>Tên học sinh *</Lbl><input className={inputCls} value={f.hoTenHs} onChange={(e) => set('hoTenHs', e.target.value)} /></div>
            <div><Lbl>Lớp</Lbl><select className={inputCls} value={f.khoi ?? ''} onChange={(e) => set('khoi', e.target.value || null)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
            <div><Lbl>SĐT bố/mẹ</Lbl><input className={inputCls} value={f.sdtPh ?? ''} onChange={(e) => set('sdtPh', e.target.value)} /></div>
            <div className="sm:col-span-2"><Lbl>Tên bố/mẹ</Lbl><input className={inputCls} value={f.hoTenPh ?? ''} onChange={(e) => set('hoTenPh', e.target.value)} /></div>
            <div><Lbl>Ngày test</Lbl><input type="date" className={inputCls} value={f.ngay} onChange={(e) => set('ngay', e.target.value)} /></div>
            <div><Lbl>Giờ test *</Lbl><input type="time" className={inputCls} value={f.gioBatDau} onChange={(e) => set('gioBatDau', e.target.value)} /></div>
          </div>
          <div>
            <Lbl>Thời gian test</Lbl>
            <div className="flex flex-wrap gap-1.5">
              {THOI_LUONG_OPTIONS.map((p) => (
                <button key={p} type="button" onClick={() => set('thoiLuongPhut', p)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${f.thoiLuongPhut === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}'</button>
              ))}
            </div>
          </div>
          {doiKhoi && c.taiLieuId && <p className="rounded-md bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-800">⚠ Ca đã gán đề khối {c.ungVien.khoi}. Đổi sang khối {f.khoi} thì thẻ ca sẽ báo lệch khối — bấm "Gán lại đề đang dùng" ở đó (người chấm / trả bài vẫn theo phân công cũ).</p>}
          {err && <p className="text-[12px] text-rose-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="min-h-[44px] rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Đóng</button>
            <button onClick={save} disabled={busy || !f.hoTenHs.trim() || !f.gioBatDau} className="min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang lưu…' : 'Lưu'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// "XOÁ" = HUỶ CA có lý do (không xoá cứng — CLAUDE.md §4). Ca rụng khỏi mọi hàng đợi + thống kê; khôi phục ở mục "Đã huỷ".
const LY_DO_HUY = ['Tạo nhầm / tạo trùng', 'Học sinh không đến', 'Phụ huynh huỷ lịch', 'Nhập sai học sinh'] as const
function HuyCaTestModal({ c, onClose, onDone }: { c: CaTest; onClose: () => void; onDone: (lyDo: string) => void }) {
  const [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  async function huy() {
    setBusy(true); setErr(null)
    try { await huyCaTest(c.id, lyDo); onDone(lyDo.trim()) }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[460px] rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-[16px] font-semibold text-slate-800">Huỷ ca test của {c.ungVien.hoTenHs}?</div>
        <p className="mt-1 text-[12px] text-slate-500">Ca biến khỏi Điểm danh, Chấm, Trả bài, Việc của tôi và Thống kê. Dữ liệu vẫn giữ — khôi phục được ở mục "Đã huỷ".</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {LY_DO_HUY.map((l) => (
            <button key={l} type="button" onClick={() => setLyDo(l)} className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition ${lyDo === l ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{l}</button>
          ))}
        </div>
        <input className={`${inputCls} mt-2`} value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do huỷ (bắt buộc)" autoFocus />
        {err && <p className="mt-2 text-[12px] text-rose-600">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Không huỷ</button>
          <button onClick={huy} disabled={busy || !lyDo.trim()} className="min-h-[40px] rounded-lg bg-rose-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-rose-500 disabled:opacity-40">{busy ? 'Đang huỷ…' : '🗑 Huỷ ca'}</button>
        </div>
      </div>
    </div>
  )
}

function TaoCaTestModal({ onClose, onDone }: { onClose: () => void; onDone: (inNgay: InDe | null) => void }) {
  const [inDeNgay, setInDeNgay] = useState<boolean>(docInDeMacDinh)   // nhớ lựa chọn của Ops theo máy (tiện ích, không phải dữ liệu)
  const doiInDe = (v: boolean) => { setInDeNgay(v); try { localStorage.setItem(LS_IN_DE, v ? '1' : '0') } catch { /* private mode */ } }
  const [uvL5, setUvL5] = useState<{ id: string; ho_ten_hs: string; ma_uv: string | null; khoi: string | null; mon: string }[]>([])
  const [ungVienId, setUngVienId] = useState<string | null>(null)
  const [f, setF] = useState({
    hoTenHs: '', mon: MON_OPTIONS[0] as MonTS, khoi: DEFAULT_KHOI, ngaySinh: '', hoTenPh: '', sdtPh: '', truongHoc: '',
    ngay: homNayVN(), gioBatDau: '', thoiLuongPhut: 60 as number,
  })
  const set = (k: keyof typeof f, v: any) => setF((s) => ({ ...s, [k]: v }))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { listUngVienL5().then(setUvL5).catch(() => {}) }, [])
  const uvOpts = uvL5.map((u) => ({ id: u.id, label: u.ho_ten_hs, sub: `${u.ma_uv ?? ''} ${u.mon}${u.khoi ? ' · Lớp ' + u.khoi : ''}`.trim() }))

  async function pick(id: string | null) {
    setUngVienId(id)
    if (!id) return
    try {
      const uv = await getUngVien(id)
      setF((s) => ({ ...s, hoTenHs: uv.ho_ten_hs, mon: uv.mon as MonTS, khoi: uv.khoi ?? s.khoi, ngaySinh: uv.ngay_sinh ?? '', hoTenPh: uv.ho_ten_ph ?? '', sdtPh: uv.sdt_ph ?? '', truongHoc: uv.truong_hoc ?? '' }))
    } catch (e: any) { setErr(e.message ?? String(e)) }
  }

  async function save() {
    if (!f.gioBatDau) { setErr('Nhập giờ test'); return }
    if (!ungVienId && !f.hoTenHs.trim()) { setErr('Chọn ứng viên L5 hoặc nhập tên học sinh mới'); return }
    setBusy(true); setErr(null)
    try {
      const chung = { ngay: f.ngay, gioBatDau: f.gioBatDau, thoiLuongPhut: f.thoiLuongPhut }
      const input: TaoCaTestInput = ungVienId
        ? { ungVienId, ...chung }
        : { ungVienMoi: { hoTenHs: f.hoTenHs, mon: f.mon, khoi: f.khoi, ngaySinh: f.ngaySinh || null, hoTenPh: f.hoTenPh, sdtPh: f.sdtPh, truongHoc: f.truongHoc }, ...chung }
      const ca = await taoCaTest(input)
      // CEO ① 09/09: đề mặc định = đề đang dùng của (khối × môn), gán NGAY lúc tạo ca. Chưa có đề thì
      // card sẽ báo ⚠ (không chặn tạo ca — HS đang đứng ở quầy).
      let de: DeTestRow | null = null
      try { de = await ganDeDangDung(ca.id, ca.ungVien.khoi, ca.mon) } catch { /* card báo sau */ }
      // In ngay (CEO 20/09): chỉ khi Ops tích VÀ đã gán được đề — chưa có đề thì card báo ⚠, không mở máy in rỗng.
      onDone(inDeNgay && de ? { taiLieuId: de.id, ungVienId: ca.ungVienId, hoTen: ca.ungVien.hoTenHs, khoi: ca.ungVien.khoi } : null)
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 text-[16px] font-semibold text-slate-800">Tạo test đầu vào</div>
        <div className="space-y-3">
          <div>
            <Lbl>Ứng viên đã đăng ký (L5) — để trống nếu walk-in mới hoàn toàn</Lbl>
            <SearchSelect value={ungVienId} onChange={pick} options={uvOpts} placeholder="🔎 Tìm ứng viên L5…" />
          </div>

          {!ungVienId ? (
            <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Lbl>Tên học sinh *</Lbl><input className={inputCls} value={f.hoTenHs} onChange={(e) => set('hoTenHs', e.target.value)} autoFocus /></div>
              <div><Lbl>Môn</Lbl><select className={inputCls} value={f.mon} onChange={(e) => set('mon', e.target.value)}>{MON_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
              <div><Lbl>Lớp</Lbl><select className={inputCls} value={f.khoi} onChange={(e) => set('khoi', e.target.value)}>{KHOI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
              <div><Lbl>Ngày sinh</Lbl><input type="date" max={homNayVN()} className={inputCls} value={f.ngaySinh} onChange={(e) => set('ngaySinh', e.target.value)} /></div>
              <div><Lbl>Trường đang học</Lbl><input className={inputCls} value={f.truongHoc} onChange={(e) => set('truongHoc', e.target.value)} /></div>
              <div><Lbl>Tên bố/mẹ</Lbl><input className={inputCls} value={f.hoTenPh} onChange={(e) => set('hoTenPh', e.target.value)} /></div>
              <div><Lbl>SĐT bố/mẹ</Lbl><input className={inputCls} value={f.sdtPh} onChange={(e) => set('sdtPh', e.target.value)} /></div>
            </div>
          ) : (
            <div className="rounded-xl bg-indigo-50 p-3 text-[13px] text-indigo-800">
              <div className="font-medium">🔗 {f.hoTenHs} · {f.mon}{f.khoi ? ` · Lớp ${f.khoi}` : ''}</div>
              <div className="mt-1 text-[12px] text-indigo-500">Thông tin đã tự load từ L5 — sửa được nếu cần.</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input className={inputCls} value={f.truongHoc} onChange={(e) => set('truongHoc', e.target.value)} placeholder="Trường đang học" />
                <input className={inputCls} value={f.sdtPh} onChange={(e) => set('sdtPh', e.target.value)} placeholder="SĐT bố/mẹ" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div><Lbl>Ngày test</Lbl><input type="date" className={inputCls} value={f.ngay} onChange={(e) => set('ngay', e.target.value)} /></div>
            <div><Lbl>Giờ test *</Lbl><input type="time" className={inputCls} value={f.gioBatDau} onChange={(e) => set('gioBatDau', e.target.value)} /></div>
          </div>
          <div>
            <Lbl>Thời gian test</Lbl>
            <div className="flex flex-wrap gap-1.5">
              {THOI_LUONG_OPTIONS.map((p) => (
                <button key={p} type="button" onClick={() => set('thoiLuongPhut', p)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${f.thoiLuongPhut === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}'</button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <input type="checkbox" checked={inDeNgay} onChange={(e) => doiInDe(e.target.checked)} className="mt-0.5 h-4 w-4 accent-indigo-600" />
            <span>
              <span className="block text-[13px] font-medium text-slate-700">🖨 In đề cho học sinh ngay sau khi tạo</span>
              <span className="block text-[11px] text-slate-400">In đề đang dùng của khối × môn, tên học sinh in sẵn. Đề có nhiều mã thì chỉ in <b>mã đề 1</b>. In lại lúc nào cũng được bằng nút "In đề" trên thẻ ca.</span>
            </span>
          </label>

          <p className="text-[11px] text-slate-400">Người chấm / trả bài gán tự động theo tab "Phân công" (khối × môn) khi tạo ca.</p>

          {err && <p className="text-[12px] text-rose-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="min-h-[44px] rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Huỷ</button>
            <button onClick={save} disabled={busy} className="min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Đang tạo…' : 'Hoàn thành'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

