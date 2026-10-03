// ═══════════ ĐỀ THI · GIAO ĐỀ + LƯỢT THI (spec-de-thi.md §9.3) ═══════════
// Màn sửa + duyệt đề đã GỘP vào KhoDeThi.tsx (DeThiSoan, 01/10/2026). File này giữ phần GIAO đề cho lớp (gán vào buổi thành
// Giáo trình / BTVN, hoặc mở bài kiểm tra), bảng "đã gán vào buổi" và bảng kết quả từng lượt thi.
// Snapshot + chấm + kết quả đều ở Postgres (fn_de_thi_*) — client chỉ gọi + hiển thị.
import { useEffect, useState } from 'react'
import { moDeThi, ganDeThi, listDeDaGan, listLuotThi, ketQuaLuot, thuBaiLuot, datKhoaDapAn, TEN_LOAI_GAN, type DeThi, type LuotThi, type KetQuaLuot, type LoaiGan, type DeDaGan } from '../../lib/dethi'
import { phatHanhTest, moToanBo, type CheDoPhatHanh } from '../../lib/testonline'
import { listLop, type Lop } from '../../lib/nhansu'
import { useStore } from '../../store/useStore'
import { inp } from '../kho/ui'
import SearchSelect from '../../components/SearchSelect'
import BuoiNgaySelect from '../../components/BuoiNgaySelect'
import PrintView from './PrintView'
import { homNayVN } from '../../lib/tuan'

// ═══════════ GIAO ĐỀ CHO LỚP — 1 đề, 3 cách (spec-de-thi.md §10.7) ═══════════
// Bài trên lớp / BTVN = GÁN đề vào buổi ⇒ thành tài liệu Giáo trình buổi / BTVN của lớp (đúng khuôn tài liệu sẵn có:
// in phiếu, chấm, mở app đi đường cũ). Kiểm tra = lượt thi tính giờ, giấu đáp án (fn_de_thi_mo).
type CachGiao = LoaiGan | 'kiem_tra'
const CACH: { v: CachGiao; ten: string; mo_ta: string }[] = [
  { v: 'giao_trinh_buoi', ten: '📘 Bài trên lớp', mo_ta: 'Đề thành Giáo trình của buổi: in phiếu phát tại lớp, hoặc mở cho học sinh làm trên app — làm tới đâu biết đúng sai tới đó.' },
  { v: 'btvn', ten: '📝 BTVN', mo_ta: 'Đề thành BTVN của buổi: in phiếu mang về, hoặc làm trên app. Hạn nộp tính theo buổi kế tiếp của lớp như mọi BTVN.' },
  { v: 'kiem_tra', ten: '⏱ Kiểm tra', mo_ta: 'Thi trên app: tính giờ, giấu đáp án, chấm ở máy chủ, mỗi em nộp 1 lần. Không tạo tài liệu của buổi.' },
]
export function GiaoDeModal({ de, thoiGianMacDinh, onClose, onDone }: { de: DeThi; thoiGianMacDinh: number | null; onClose: () => void; onDone: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [cach, setCach] = useState<CachGiao>('giao_trinh_buoi')
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState('')
  const [phut, setPhut] = useState<string>(String(thoiGianMacDinh ?? 90))
  const [khoa, setKhoa] = useState(true)
  const [moApp, setMoApp] = useState(false)
  // 2 chế độ phát hành của bài trên lớp (CEO 02/10): từng phần = buổi học (mặc định) · toàn bộ = luyện tập
  const [cheDo, setCheDo] = useState<CheDoPhatHanh>('tung_phan')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string; inId?: string } | null>(null)
  const [inId, setInId] = useState<string | null>(null)
  // Chỉ lớp CÙNG MÔN với đề (tài liệu học tập mang nhãn môn — §1.6; DB cũng chặn); lớp cùng khối xếp trước.
  useEffect(() => {
    listLop().then((ls) => setLops(ls.filter((l) => l.mon === de.mon).sort((a, b) => Number(b.khoi === de.khoi) - Number(a.khoi === de.khoi))))
  }, [de.mon, de.khoi])
  const laThi = cach === 'kiem_tra'
  const lopTen = lops.find((l) => l.id === lopId)?.ten_lop ?? ''
  async function xacNhan() {
    if (!lopId || !ngay) return
    setBusy(true)
    try {
      if (laThi) {
        await moDeThi(de.id, lopId, ngay, phut.trim() ? Math.max(1, Math.round(+phut)) : null, khoa)
        setRes({ ok: true, msg: `Đã mở bài kiểm tra cho lớp ${lopTen} — học sinh thấy ở ô "Làm đề thi thử".` })
      } else {
        const kq = await ganDeThi(de.id, lopId, ngay, cach)
        // Bản gán đủ nội dung ngay ⇒ dựng link in luôn; các buổi bị dồn số cũng dựng lại (như gán giáo trình).
        const st = useStore.getState()
        st.enqueueLinkGen(kq.taiLieuId, cach)
        for (const d of kq.doiTen) if (d.id !== kq.taiLieuId) st.enqueueLinkGen(d.id, d.loai)
        let msg = `Đã gán thành ${TEN_LOAI_GAN[cach]} buổi ${ngay.split('-').reverse().join('/')} của lớp ${lopTen}.`
        if (moApp) {
          try {
            const tungPhan = cach === 'giao_trinh_buoi' && cheDo === 'tung_phan'
            const ph = await phatHanhTest(kq.taiLieuId, null, { cheDo: cach === 'giao_trinh_buoi' ? cheDo : 'toan_bo' })
            const han = ph.baiTest.deadline ? ` Hạn nộp ${new Date(ph.baiTest.deadline).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}.` : ''
            msg += (tungPhan ? ` Đã đưa ${ph.added} câu lên app theo TỪNG PHẦN: phần đầu đang mở, thầy cô mở phần kế ở tab Live của buổi.` : ` Đã mở toàn bộ ${ph.added} câu trên app.`) + `${han}${ph.skipped.length ? ` ${ph.skipped.length} câu tự luận chỉ có trên phiếu in.` : ''}${ph.canhBao ? ` ⚠ ${ph.canhBao}` : ''}`
          } catch (e: any) { msg += ` ⚠ Chưa mở được trên app: ${e.message ?? String(e)} — mở lại ở bảng "Đã gán vào buổi".` }
        }
        setRes({ ok: true, msg, inId: kq.taiLieuId })
      }
      onDone()
    } catch (e: any) { setRes({ ok: false, msg: e.message ?? String(e) }) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[520px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Giao đề cho lớp</p>
        {!de.duyet_at ? (
          <>
            <p className="mt-3 text-[13px] text-rose-600">Đề chưa duyệt. Bấm "✅ Duyệt đề" trước — duyệt là xác nhận nội dung và đáp án đúng; câu chưa có dạng không cản việc duyệt.</p>
            <div className="mt-4 text-right"><button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button></div>
          </>
        ) : res ? (
          <>
            <p className={`mt-3 text-[13px] ${res.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{res.msg}</p>
            <div className="mt-4 flex justify-end gap-2">
              {res.inId && <button onClick={() => setInId(res.inId!)} className="rounded-lg border border-indigo-300 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50">🖨 In phiếu</button>}
              {!res.ok && <button onClick={() => setRes(null)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600">Sửa lại</button>}
              <button onClick={onClose} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
              {CACH.map((c) => (
                <button key={c.v} onClick={() => { setCach(c.v); setNgay(c.v === 'kiem_tra' ? homNayVN() : '') }}
                  className={`rounded-md px-2 py-1.5 text-[13px] font-medium ${cach === c.v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{c.ten}</button>
              ))}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{CACH.find((c) => c.v === cach)!.mo_ta}</p>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Lớp <span className="font-normal text-slate-400">(môn {de.mon})</span></label>
            <div className="mt-1"><SearchSelect value={lopId} onChange={(v) => { setLopId(v); if (!laThi) setNgay('') }} placeholder="Chọn lớp…" options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: `${l.mon}${l.khoi ? ' · K' + l.khoi : ''}` }))} /></div>
            {laThi ? (
              <>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div><label className="block text-[12px] font-medium text-slate-600">Ngày thi</label><input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className={`${inp} mt-1 w-full`} /></div>
                  <div><label className="block text-[12px] font-medium text-slate-600">Thời gian làm bài (phút)</label><input type="number" min={1} value={phut} onChange={(e) => setPhut(e.target.value)} placeholder="để trống = không giới hạn" className={`${inp} mt-1 w-full`} /></div>
                </div>
                <label className="mt-3 flex items-center gap-2 text-[13px] text-slate-700">
                  <input type="checkbox" checked={khoa} onChange={(e) => setKhoa(e.target.checked)} /> Khoá đáp án + điểm tới khi thầy/cô mở
                </label>
              </>
            ) : (
              <>
                <label className="mt-3 block text-[12px] font-medium text-slate-600">Buổi học <span className="font-normal text-slate-400">(theo thời khoá biểu của lớp)</span></label>
                <BuoiNgaySelect lopId={lopId} value={ngay} onChange={setNgay} className={`${inp} mt-1 w-full disabled:bg-slate-50 disabled:text-slate-300`} defaultToday />
                <label className="mt-3 flex items-center gap-2 text-[13px] text-slate-700">
                  <input type="checkbox" checked={moApp} onChange={(e) => setMoApp(e.target.checked)} /> Mở cho học sinh làm trên app ngay
                </label>
                <p className="ml-6 text-[12px] text-slate-400">Không tick = chỉ in phiếu; mở trên app sau cũng được, ở bảng "Đã gán vào buổi của lớp".</p>
                {moApp && cach === 'giao_trinh_buoi' && (
                  <div className="ml-6 mt-2 space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    {([['tung_phan', 'Phát hành từng phần', 'Buổi học: chỉ Phần I mở. Thầy cô bấm mở Phần II, III… ở tab Live của buổi khi dạy tới.'],
                       ['toan_bo', 'Phát hành toàn bộ', 'Luyện tập: mở sẵn cả đề, học sinh làm theo nhịp của mình.']] as [CheDoPhatHanh, string, string][]).map(([v, ten, moTa]) => (
                      <label key={v} className="flex cursor-pointer items-start gap-2 text-[13px] text-slate-700">
                        <input type="radio" name="che_do_phat_hanh" className="mt-0.5" checked={cheDo === v} onChange={() => setCheDo(v)} />
                        <span><b className="font-medium">{ten}</b><span className="block text-[12px] text-slate-500">{moTa}</span></span>
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}
            <p className="mt-3 text-[12px] text-slate-400">Trên app: trắc nghiệm, đúng/sai và trả lời ngắn (ô 4 ký tự như phiếu thi). Câu tự luận chỉ có trên phiếu in.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
              <button disabled={!lopId || !ngay || busy} onClick={xacNhan} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang giao…' : laThi ? 'Mở bài kiểm tra' : `Gán làm ${cach === 'btvn' ? 'BTVN' : 'bài trên lớp'}`}</button>
            </div>
          </>
        )}
      </div>
      {inId && <div onClick={(e) => e.stopPropagation()}><PrintView id={inId} onClose={() => setInId(null)} /></div>}
    </div>
  )
}

// ═══════════ ĐỀ ĐÃ GÁN VÀO NHỮNG BUỔI NÀO ═══════════
// Mỗi dòng = 1 tài liệu Giáo trình buổi / BTVN của lớp (bản chép của đề). In phiếu + mở app ngay tại đây;
// xoá / đổi ngày thì làm ở Kho tài liệu như mọi tài liệu của buổi.
export function DaGanPanel({ deId, lamMoi }: { deId: string; lamMoi: number }) {
  const [rows, setRows] = useState<DeDaGan[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ id: string; ok: boolean; text: string } | null>(null)
  const [inId, setInId] = useState<string | null>(null)
  useEffect(() => { listDeDaGan(deId).then(setRows).catch(() => setRows([])) }, [deId, lamMoi])
  if (!rows || !rows.length) return null
  async function moApp(r: DeDaGan, cheDo: CheDoPhatHanh) {
    setBusy(r.tai_lieu_id); setMsg(null)
    try {
      const ph = await phatHanhTest(r.tai_lieu_id, null, { cheDo })
      // vá đúng dòng vừa mở — không tải lại cả bảng
      setRows((s) => s?.map((x) => (x.tai_lieu_id === r.tai_lieu_id ? { ...x, bai_test_id: ph.baiTest.id, so_da_lam: 0 } : x)) ?? s)
      setMsg({ id: r.tai_lieu_id, ok: true, text: (cheDo === 'tung_phan' ? `Đã đưa ${ph.added} câu lên app theo từng phần — phần đầu đang mở, mở phần kế ở tab Live của buổi` : `Đã mở toàn bộ ${ph.added} câu trên app`) + `${ph.skipped.length ? ` · ${ph.skipped.length} câu tự luận chỉ có trên phiếu` : ''}.` })
    } catch (e: any) { setMsg({ id: r.tai_lieu_id, ok: false, text: e.message ?? String(e) }) } finally { setBusy(null) }
  }
  // Bài trên lớp đang mở từng phần → mở nốt cả đề (đã mở hết thì không đổi gì)
  async function moHet(r: DeDaGan) {
    if (!r.bai_test_id) return
    setBusy(r.tai_lieu_id); setMsg(null)
    try { await moToanBo(r.bai_test_id); setMsg({ id: r.tai_lieu_id, ok: true, text: 'Đã mở toàn bộ câu của bài cho học sinh.' }) }
    catch (e: any) { setMsg({ id: r.tai_lieu_id, ok: false, text: e.message ?? String(e) }) } finally { setBusy(null) }
  }
  const nutMo = 'rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40'
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-2 font-semibold text-slate-800">Đã gán vào buổi của lớp</p>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.tai_lieu_id} className="rounded-lg border border-slate-100 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2 text-[13px]">
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${r.loai === 'btvn' ? 'bg-violet-50 text-violet-700' : 'bg-sky-50 text-sky-700'}`}>{r.loai === 'btvn' ? 'BTVN' : 'Bài trên lớp'}</span>
              <span className="font-medium text-slate-800">{r.lop_ten}</span>
              <span className="text-slate-500">{r.ngay.split('-').reverse().join('/')}</span>
              {r.bai_test_id
                ? <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">đang mở trên app · {r.so_da_lam} em đã làm</span>
                : <span className="text-[12px] text-slate-400">chưa mở trên app</span>}
              <span className="ml-auto flex gap-1.5">
                {/* Bài trên lớp: 2 chế độ (từng phần cho buổi học · toàn bộ cho luyện tập). BTVN luôn mở cả bài. */}
                {!r.bai_test_id && r.loai === 'btvn' && <button disabled={busy === r.tai_lieu_id} onClick={() => moApp(r, 'toan_bo')} className={nutMo}>{busy === r.tai_lieu_id ? '…' : '📱 Mở trên app'}</button>}
                {!r.bai_test_id && r.loai !== 'btvn' && <>
                  <button disabled={busy === r.tai_lieu_id} onClick={() => moApp(r, 'tung_phan')} title="Buổi học: chỉ phần đầu mở, mở phần kế ở tab Live của buổi" className={nutMo}>{busy === r.tai_lieu_id ? '…' : '📱 Mở từng phần'}</button>
                  <button disabled={busy === r.tai_lieu_id} onClick={() => moApp(r, 'toan_bo')} title="Luyện tập: mở sẵn cả đề" className={nutMo}>📱 Mở toàn bộ</button>
                </>}
                {r.bai_test_id && r.loai !== 'btvn' && <button disabled={busy === r.tai_lieu_id} onClick={() => moHet(r)} title="Mở mọi câu của bài cho học sinh (bài đang mở từng phần)" className={nutMo}>{busy === r.tai_lieu_id ? '…' : '▶▶ Mở toàn bộ'}</button>}
                <button onClick={() => setInId(r.tai_lieu_id)} className="rounded border border-slate-300 px-2 py-0.5 text-[12px] text-slate-700 hover:border-indigo-300">🖨 In phiếu</button>
              </span>
            </div>
            {msg?.id === r.tai_lieu_id && <p className={`mt-1 text-[12px] ${msg.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{msg.text}</p>}
          </div>
        ))}
      </div>
      {inId && <PrintView id={inId} onClose={() => setInId(null)} />}
    </div>
  )
}

// ═══════════ CÁC LƯỢT THI CỦA ĐỀ ═══════════
export function LuotThiPanel({ deId, lamMoi }: { deId: string; lamMoi: number }) {
  const [luots, setLuots] = useState<LuotThi[] | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  useEffect(() => { listLuotThi(deId).then(setLuots).catch(() => setLuots([])) }, [deId, lamMoi])
  if (!luots || !luots.length) return null
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-2 font-semibold text-slate-800">Các lượt thi trên app</p>
      <div className="space-y-2">
        {luots.map((l) => (
          <div key={l.id} className="rounded-lg border border-slate-100">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-[13px]">
              <span className="font-medium text-slate-800">{l.lop_ten}</span>
              <span className="text-slate-500">{l.ngay.split('-').reverse().join('/')}</span>
              <span className="text-slate-500">{l.thoi_gian_phut ? `${l.thoi_gian_phut} phút` : 'không giới hạn'}</span>
              <span className="text-slate-500">{l.so_cau} câu</span>
              <span className={`rounded px-1.5 py-0.5 text-[11px] ${l.khoa_reveal ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{l.khoa_reveal ? 'đáp án đang khoá' : 'đã mở đáp án'}</span>
              <button onClick={() => setMo(mo === l.id ? null : l.id)} className="ml-auto rounded border border-slate-300 px-2 py-0.5 text-[12px] text-slate-700 hover:border-indigo-300">{mo === l.id ? 'Ẩn kết quả' : 'Kết quả'}</button>
            </div>
            {mo === l.id && <KetQuaBang luot={l} onKhoa={(k) => setLuots((s) => s?.map((x) => (x.id === l.id ? { ...x, khoa_reveal: k } : x)) ?? s)} />}
          </div>
        ))}
      </div>
    </div>
  )
}

function KetQuaBang({ luot, onKhoa }: { luot: LuotThi; onKhoa: (khoa: boolean) => void }) {
  const [kq, setKq] = useState<KetQuaLuot | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const tai = () => ketQuaLuot(luot.id).then(setKq).catch((e) => setMsg(e.message ?? String(e)))
  useEffect(() => { tai() }, [luot.id]) // eslint-disable-line
  async function thuBai() {
    if (!confirm('Thu bài: mọi bài đang làm dở của lượt này sẽ được nộp + chấm ngay. Tiếp tục?')) return
    setBusy(true)
    try { const n = await thuBaiLuot(luot.id); setMsg(`Đã thu ${n} bài.`); await tai() } catch (e: any) { setMsg(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function doiKhoa() {
    setBusy(true)
    try { await datKhoaDapAn(luot.id, !luot.khoa_reveal); onKhoa(!luot.khoa_reveal) } catch (e: any) { setMsg(e.message ?? String(e)) } finally { setBusy(false) }
  }
  if (!kq) return <p className="px-3 pb-3 text-[12px] text-slate-400">{msg ?? 'Đang tải…'}</p>
  const tt = { chua_lam: 'Chưa làm', dang_lam: 'Đang làm', da_nop: 'Đã nộp' }
  return (
    <div className="border-t border-slate-100 px-3 pb-3 pt-2">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-slate-500">Tối đa {kq.toi_da} đ · quy về thang 10</span>
        {msg && <span className="text-indigo-600">{msg}</span>}
        <button disabled={busy} onClick={thuBai} className="ml-auto rounded border border-slate-300 px-2 py-0.5 text-slate-700 disabled:opacity-40">📥 Thu bài</button>
        <button disabled={busy} onClick={doiKhoa} className={`rounded px-2 py-0.5 font-medium text-white disabled:opacity-40 ${luot.khoa_reveal ? 'bg-emerald-600' : 'bg-slate-500'}`}>{luot.khoa_reveal ? '🔓 Mở đáp án cho HS' : '🔒 Khoá lại'}</button>
      </div>
      <table className="w-full text-[12px]">
        <thead><tr className="text-left text-slate-500">
          <th className="py-1 font-medium">Học sinh</th><th className="font-medium">Trạng thái</th><th className="font-medium">Điểm /10</th>
          {kq.phan.map((p) => <th key={p.phan} className="font-medium">{p.phan || 'Câu'} <span className="text-slate-400">/{p.toi_da}</span></th>)}
        </tr></thead>
        <tbody>
          {kq.hs.map((h) => (
            <tr key={h.hoc_sinh_id} className="border-t border-slate-100">
              <td className="py-1 text-slate-800">{h.ho_ten}</td>
              <td className={h.trang_thai === 'da_nop' ? 'text-emerald-700' : h.trang_thai === 'dang_lam' ? 'text-amber-700' : 'text-slate-400'}>{tt[h.trang_thai]}</td>
              <td className="font-semibold text-slate-800">{h.diem_10 ?? '—'}</td>
              {kq.phan.map((p) => <td key={p.phan} className="text-slate-600">{h.theo_phan ? h.theo_phan[p.phan] ?? 0 : '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
