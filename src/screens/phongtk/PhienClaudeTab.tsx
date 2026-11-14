// 🤖 PHIÊN CLAUDE — trưởng khối chat thẳng với Claude Code (spec-phong-truong-khoi.md).
// Mỗi việc một phiên: chọn loại việc + khối → chat → đóng (Claude viết tổng kết). Người trả lời là bot chạy máy Thùy
// (scripts/phien/bot.mjs) nên phải NÓI RÕ trạng thái: Claude sẵn sàng / đang làm / nghỉ hạn mức / mất liên lạc.
// Chữ chạy: bot cập nhật dần 1 tin vai 'claude'; màn nghe Realtime theo phiên + poll nền làm lưới vớt.
// Rời phòng rồi quay lại = đúng chỗ cũ: phiên đang mở + danh sách + nháp tin nhớ ở NHO (sống tới F5).
import { batPoll } from '../../lib/poll'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  PHIEN_LOAI, LOAI_SUA_BAN_DO, tenLoai, BOT_SONG_TRONG_MS, getPhamVi, listPhien, moPhien, listTin, guiTin, dongPhien, moLaiPhien,
  listGhi, getBot, getPhien,
  type PhienItem, type PhienTin, type PhienPhamVi, type PhienLoai, type PhienBot, type PhienGhi, type PhienTrangThai,
} from '../../lib/phien'
import ChuPhien from './ChuPhien'

const NHO: { chon: string | null; ds: PhienItem[] | null; nhap: Record<string, string>; tin: Record<string, PhienTin[]> } =
  { chon: null, ds: null, nhap: {}, tin: {} }

// Câu gợi ý lúc phiên còn trống — theo loại việc.
const GOI_Y: Partial<Record<PhienLoai, string[]>> = {
  ban_do: ['Dựng nháp bản đồ chương Số hữu tỉ theo sách, cho mình xem khung trước', 'Nhóm 2.3 tách thành hai: cộng trừ và nhân chia', 'Mình vừa sửa tay chuyên đề 3, làm tiếp đi'],
  nhap_kho: ['Phân dạng các câu chưa có dạng của khối, cho mình xem kết quả lượt đầu', 'Chạy hết kho đi, xong báo mình các cụm cần thêm dạng', 'Ok thêm dạng "Tìm x trong tỉ lệ thức" như em đề xuất rồi phân lại cụm đó'],
  ly_thuyet: ['Soạn lý thuyết + 2 ví dụ cho các dạng của chuyên đề Cộng trừ số hữu tỉ', 'Ví dụ 2 dạng 1.2.1 dễ quá, đổi bài khó hơn', 'Mình vừa sửa tay phương pháp dạng 1.3.2, áp cách viết đó cho các dạng còn lại'],
}
// 11/11: 15 s → 60 s. claude_phien* CHƯA nằm trong publication supabase_realtime (đo 11/11) ⇒ hỏi lại là đường duy nhất;
// danh sách chỉ cần thấy phiên nào đang chạy / tin cuối, phiên đang mở tự hỏi 4 s riêng.
const POLL_DS_MS = 60_000
const POLL_TIN_MS = 4_000      // chỉ khi phiên đang có việc chạy — Realtime là đường chính
const gio = (s: string) => new Date(s).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })

function vaTin(prev: PhienTin[], t: PhienTin): PhienTin[] {
  const i = prev.findIndex((x) => x.id === t.id)
  if (i < 0) return [...prev, t].sort((a, b) => a.id - b.id)
  // Bản cũ tới muộn (poll nền về sau sự kiện Realtime) thì giữ bản mới hơn. So THỜI ĐIỂM, không so chuỗi: Realtime và
  // PostgREST có thể trả timestamptz khác định dạng ('T' / dấu cách). Không đọc được thì nhận bản tới sau.
  const cu = Date.parse(prev[i].updated_at), moi = Date.parse(t.updated_at)
  if (Number.isFinite(cu) && Number.isFinite(moi) && cu > moi) return prev
  const n = prev.slice(); n[i] = t; return n
}

function BotTrangThai({ bot, now }: { bot: PhienBot | null; now: number }) {
  const song = bot != null && now - new Date(bot.alive_at).getTime() < BOT_SONG_TRONG_MS
  const [mau, chu] = !bot ? ['slate', 'Chưa rõ trạng thái Claude']
    : !song ? ['red', 'Claude mất liên lạc (máy chạy bot đang tắt?) — tin vẫn được giữ, chạy lại là trả lời']
    : bot.trang_thai === 'nghi_han_muc' ? ['amber', `Claude tạm nghỉ (hết hạn mức) tới ${bot.nghi_toi ? gio(bot.nghi_toi) : '?'} — tin vẫn được giữ`]
    : bot.trang_thai === 'dung' ? ['red', `Claude đang dừng: ${bot.ghi_chu || 'bot tắt'}`]
    : ['emerald', 'Claude sẵn sàng']
  // Tên lớp viết ĐỦ (không ghép `bg-${mau}-500`) — Tailwind chỉ sinh lớp thấy nguyên văn trong mã.
  const cls: Record<string, [string, string]> = {
    slate: ['border-slate-200 bg-slate-50 text-slate-500', 'bg-slate-400'], red: ['border-red-200 bg-red-50 text-red-700', 'bg-red-500'],
    amber: ['border-amber-200 bg-amber-50 text-amber-800', 'bg-amber-500'], emerald: ['border-emerald-200 bg-emerald-50 text-emerald-700', 'bg-emerald-500'],
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium ${cls[mau][0]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cls[mau][1]}`} />{chu}
    </span>
  )
}

function PhienMoi({ onXong, onHuy }: { onXong: (id: string) => void; onHuy: () => void }) {
  const [phamVi, setPhamVi] = useState<PhienPhamVi[] | null>(null)
  const [loai, setLoai] = useState<PhienLoai>('ban_do')
  const [o, setO] = useState('')
  const [tieuDe, setTieuDe] = useState('')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    getPhamVi().then((p) => {
      setPhamVi(p)
      // nhân sự (không là trưởng khối ở đâu) chỉ mở được Nhập kho ⇒ chọn sẵn loại đó
      const laTk = p.some((x) => x.tk); if (!laTk) setLoai('nhap_kho')
      const d = p.find((x) => x.co_ban_do && (x.tk || !laTk)); if (d) setO(`${d.mon}|${d.khoi}`)
    })
      .catch((e) => setLoi(e.message ?? String(e)))
  }, [])
  const chon = phamVi?.filter((p) => (!LOAI_SUA_BAN_DO.includes(loai) || p.co_ban_do) && (p.tk || loai === 'nhap_kho')) ?? []
  useEffect(() => { if (phamVi && !chon.some((p) => `${p.mon}|${p.khoi}` === o)) setO(chon[0] ? `${chon[0].mon}|${chon[0].khoi}` : '') }, [loai, phamVi])   // eslint-disable-line react-hooks/exhaustive-deps
  async function tao() {
    const [mon, khoi] = o.split('|')
    if (!mon || !khoi || busy) return
    setBusy(true); setLoi(null)
    try { onXong(await moPhien(loai, mon, khoi, tieuDe)) } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBusy(false) }
  }
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-[15px] font-semibold text-slate-800">Phiên mới</div>
      <div className="mb-1 text-[12px] font-medium text-slate-500">Loại việc</div>
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        {PHIEN_LOAI.map((l) => (
          <button key={l.id} disabled={!l.mo || (!!phamVi && l.id !== 'nhap_kho' && !phamVi.some((p) => p.tk))} onClick={() => setLoai(l.id)}
            className={`rounded-xl border px-3 py-2 text-left transition ${loai === l.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'} disabled:cursor-not-allowed disabled:opacity-45`}>
            <div className="text-[13.5px] font-semibold text-slate-800">{l.ten}{!l.mo && <span className="ml-1.5 text-[11px] font-normal text-slate-400">· sắp mở</span>}</div>
            <div className="text-[11.5px] text-slate-500">{l.mo_ta}</div>
          </button>
        ))}
      </div>
      <div className="mb-1 text-[12px] font-medium text-slate-500">Môn · khối</div>
      {phamVi && chon.length === 0 ? (
        <p className="mb-3 text-[13px] text-amber-700">Bạn chưa là trưởng khối của khối nào có bản đồ mới — nhờ Thùy/Trang phân công ở màn Phân công.</p>
      ) : (
        <select value={o} onChange={(e) => setO(e.target.value)} className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13.5px]">
          {chon.map((p) => <option key={`${p.mon}|${p.khoi}`} value={`${p.mon}|${p.khoi}`}>{p.mon} · khối {p.khoi}</option>)}
        </select>
      )}
      <div className="mb-1 text-[12px] font-medium text-slate-500">Tiêu đề (không bắt buộc)</div>
      <input value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} placeholder="vd: Dựng nháp chương Số hữu tỉ"
        className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-[13.5px]" />
      {loi && <p className="mb-2 text-[12.5px] font-medium text-red-600">{loi}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onHuy} className="rounded-lg px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-100">Huỷ</button>
        <button onClick={tao} disabled={!o || busy} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">
          {busy ? 'Đang mở…' : 'Mở phiên'}
        </button>
      </div>
    </div>
  )
}

function VetGhi({ phienId, soTin }: { phienId: string; soTin: number }) {
  const [mo, setMo] = useState(false)
  const [ds, setDs] = useState<PhienGhi[] | null>(null)
  useEffect(() => { if (mo) listGhi(phienId).then(setDs).catch(() => setDs([])) }, [mo, phienId, soTin])
  return (
    <div className="border-t border-slate-100 px-4 py-2">
      <button onClick={() => setMo(!mo)} className="text-[12px] font-medium text-slate-500 hover:text-slate-700">
        {mo ? '▾' : '▸'} Vết thay đổi Claude đã ghi vào bản đồ{ds ? ` (${ds.length})` : ''}
      </button>
      {mo && (
        <div className="mt-1.5 max-h-48 overflow-auto text-[12px] text-slate-600">
          {ds == null ? 'Đang tải…' : ds.length === 0 ? 'Chưa có thay đổi nào.' : ds.map((g) => (
            <div key={g.id} className="border-b border-slate-50 py-1">
              <span className="text-slate-400">{gio(g.at)}</span> · <b>{g.viec}</b> · <code className="text-[11px]">{JSON.stringify(g.tham_so).slice(0, 240)}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function KhungChat({ phien, onDoiTrangThai }: { phien: PhienItem; onDoiTrangThai: (id: string, tt: PhienTrangThai) => void }) {
  const [tin, setTin] = useState<PhienTin[]>(NHO.tin[phien.id] ?? [])
  const [nhap, setNhap] = useState(NHO.nhap[phien.id] ?? '')
  const [tt, setTt] = useState<PhienTrangThai>(phien.trang_thai)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [myId, setMyId] = useState<string | null>(null)
  const cuon = useRef<HTMLDivElement>(null)
  const dinhDay = useRef(true)   // người đang ở cuối khung ⇒ chữ mới tự cuộn theo; đã cuộn lên đọc thì không giật xuống

  useEffect(() => { NHO.tin[phien.id] = tin }, [phien.id, tin])
  useEffect(() => { NHO.nhap[phien.id] = nhap }, [phien.id, nhap])
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setMyId(data.user?.id ?? null)) }, [])

  // Tải nền KHÔNG xoá danh sách đang có (giữ tin cũ tới khi có tin mới — không bao giờ trắng màn).
  async function taiLai() {
    try {
      const [ds, p] = await Promise.all([listTin(phien.id), getPhien(phien.id)])
      setTin(ds)
      if (p && p.trang_thai !== tt) { setTt(p.trang_thai); onDoiTrangThai(phien.id, p.trang_thai) }
    } catch { /* mất mạng thoáng qua — lượt sau tự vá */ }
  }
  useEffect(() => {
    setTt(phien.trang_thai)
    taiLai()
    const ch = supabase.channel(`phien:${phien.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'claude_phien_tin', filter: `phien_id=eq.${phien.id}` },
        (m) => { if (m.new && (m.new as PhienTin).id) setTin((prev) => vaTin(prev, m.new as PhienTin)) })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'claude_phien', filter: `id=eq.${phien.id}` },
        (m) => { const t = (m.new as { trang_thai?: PhienTrangThai }).trang_thai; if (t) { setTt(t); onDoiTrangThai(phien.id, t) } })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [phien.id]) // eslint-disable-line

  const dangChay = tin.some((t) => ['cho', 'dang_xu', 'dang_viet'].includes(t.trang_thai)) || tt === 'dang_dong'
  useEffect(() => {
    if (!dangChay) return
    return batPoll(taiLai, POLL_TIN_MS)   // chỉ khi phiên đang có việc chạy (điều kiện dừng: dangChay)
  }, [dangChay, phien.id]) // eslint-disable-line

  useEffect(() => {
    const el = cuon.current
    if (el && dinhDay.current) el.scrollTop = el.scrollHeight
  }, [tin])

  async function gui() {
    const nd = nhap.trim()
    if (!nd || busy || tt !== 'mo') return
    setBusy(true); setLoi(null)
    try { const t = await guiTin(phien.id, nd); setTin((prev) => vaTin(prev, t)); setNhap(''); dinhDay.current = true }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function dong() {
    if (!window.confirm('Đóng phiên? Claude sẽ viết tổng kết rồi phiên chuyển sang "đã đóng". Mở lại được khi cần.')) return
    try { const t = await dongPhien(phien.id); setTt(t); onDoiTrangThai(phien.id, t); taiLai() } catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  async function moLai() {
    try { await moLaiPhien(phien.id); setTt('mo'); onDoiTrangThai(phien.id, 'mo') } catch (e: any) { setLoi(e.message ?? String(e)) }
  }

  // Tin người nào đang được Claude xử lý mà chưa có tin Claude trả lời ⇒ hiện "Claude đang làm…" ngay dưới nó.
  const daTraLoi = useMemo(() => new Set(tin.filter((t) => t.vai === 'claude').map((t) => t.tra_loi_cho)), [tin])

  return (
    <div className="flex h-[calc(100vh-240px)] min-h-[420px] flex-col rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14.5px] font-semibold text-slate-800">{phien.tieu_de}</div>
          <div className="text-[11.5px] text-slate-400">{tenLoai(phien.loai)} · {phien.mon} khối {phien.khoi} · mở bởi {phien.nguoi_mo_ten ?? '?'} · {gio(phien.created_at)}</div>
        </div>
        {tt === 'mo' && <button onClick={dong} className="rounded-lg border border-slate-200 px-3 py-1 text-[12.5px] text-slate-600 hover:bg-slate-50">Đóng phiên</button>}
        {tt === 'dang_dong' && <span className="text-[12px] text-amber-700">Đang đóng — Claude viết tổng kết…</span>}
        {tt === 'dong' && <button onClick={moLai} className="rounded-lg border border-indigo-200 px-3 py-1 text-[12.5px] text-indigo-700 hover:bg-indigo-50">Mở lại phiên</button>}
      </div>

      <div ref={cuon} onScroll={(e) => { const el = e.currentTarget; dinhDay.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60 }}
        className="flex-1 space-y-3 overflow-auto px-4 py-3">
        {tin.length === 0 && (
          <div className="py-10 text-center text-[13px] text-slate-400">
            Nhắn cho Claude như nhắn đồng nghiệp — vd:{' '}
            {(GOI_Y[phien.loai] ?? GOI_Y.ban_do ?? []).map((g, i) => <span key={i}>{i ? (i === 1 ? <br /> : ', ') : null}<i>"{g}"</i></span>)}.
          </div>
        )}
        {tin.map((t) => t.vai === 'claude' ? (
          <div key={t.id} className="flex gap-2">
            <span className="shrink-0 pt-0.5 text-[16px]">🤖</span>
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-slate-50 px-3.5 py-2.5">
              <ChuPhien text={t.noi_dung} />
              {t.trang_thai === 'dang_viet' && <div className="mt-1 animate-pulse text-[12px] text-indigo-500">Claude đang viết…</div>}
              {t.trang_thai === 'dung' && <div className="mt-1 text-[12px] text-amber-700">Lượt này bị ngắt giữa chừng.</div>}
            </div>
          </div>
        ) : t.vai === 'he_thong' ? (
          <div key={t.id} className="text-center text-[12px] text-slate-400">
            {t.noi_dung.startsWith('[ĐÓNG PHIÊN]') ? '— Đã yêu cầu đóng phiên, Claude viết tổng kết —'
              : t.noi_dung.startsWith('[TIẾP TỤC]') ? `— Claude tự làm tiếp (${t.noi_dung.match(/\d+\/\d+/)?.[0] ?? ''}) —`
              : t.noi_dung}
            {t.trang_thai === 'loi' && <span className="ml-1 text-red-600">(lỗi: {t.loi})</span>}
          </div>
        ) : (
          <div key={t.id} className="flex flex-col items-end">
            <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-indigo-600 px-3.5 py-2 text-[14px] text-white">{t.noi_dung}</div>
            <div className="mt-0.5 text-[11px] text-slate-400">
              {t.nguoi_gui === myId ? 'Bạn' : 'Đồng nghiệp'} · {gio(t.created_at)}
              {t.trang_thai === 'cho' && ' · ⏳ chờ Claude nhận'}
              {t.trang_thai === 'dang_xu' && !daTraLoi.has(t.id) && <span className="animate-pulse text-indigo-500"> · 🤖 Claude đang đọc, đang làm…</span>}
              {t.trang_thai === 'loi' && <span className="text-red-600"> · ✗ {t.loi ?? 'lỗi'} — nhắn lại câu mới</span>}
              {t.trang_thai === 'cho' && t.loi && <span className="text-amber-700"> · {t.loi}</span>}
            </div>
          </div>
        ))}
      </div>

      <VetGhi phienId={phien.id} soTin={tin.length} />

      <div className="border-t border-slate-100 p-3">
        {tt === 'mo' ? (
          <>
            <textarea value={nhap} onChange={(e) => setNhap(e.target.value)} rows={2}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gui() } }}
              placeholder="Nhắn Claude… (Enter gửi · Shift+Enter xuống dòng). Đang bận vẫn nhắn được — Claude đọc hết khi xong lượt."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none placeholder:text-slate-400 focus:border-indigo-300" />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[11.5px] text-red-600">{loi}</span>
              <button onClick={gui} disabled={!nhap.trim() || busy} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">
                {busy ? 'Đang gửi…' : 'Gửi'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-[12.5px] text-slate-400">{tt === 'dong' ? 'Phiên đã đóng. Mở lại phiên để nhắn tiếp, hoặc mở phiên mới.' : 'Phiên đang đóng…'}{loi && <span className="ml-2 text-red-600">{loi}</span>}</p>
        )}
      </div>
    </div>
  )
}

export default function PhienClaudeTab() {
  const [ds, setDs] = useState<PhienItem[] | null>(NHO.ds)
  const [chon, setChon] = useState<string | null>(NHO.chon)
  const [taoMoi, setTaoMoi] = useState(false)
  const [loc, setLoc] = useState<'mo' | 'tat_ca'>('mo')
  const [bot, setBot] = useState<PhienBot | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [loi, setLoi] = useState<string | null>(null)

  useEffect(() => { NHO.ds = ds }, [ds])
  useEffect(() => { NHO.chon = chon }, [chon])

  async function taiDs() {
    try { setDs(await listPhien()); setLoi(null) } catch (e: any) { setLoi(e.message ?? String(e)) }
    getBot().then(setBot).catch(() => {}); setNow(Date.now())
  }
  useEffect(() => {
    taiDs()
    // 11/11 (audit timeout): tab ẩn thì không hỏi; quay lại tab thì hỏi ngay 1 lần
    const dungPoll = batPoll(taiDs, POLL_DS_MS, { khiHien: false })
    const khiHien = () => { if (!document.hidden) taiDs() }
    document.addEventListener('visibilitychange', khiHien)
    return () => { dungPoll(); document.removeEventListener('visibilitychange', khiHien) }
  }, [])

  const hien = (ds ?? []).filter((p) => loc === 'tat_ca' || p.trang_thai !== 'dong')
  const dangChon = (ds ?? []).find((p) => p.id === chon) ?? null
  const doiTt = (id: string, tt: PhienTrangThai) => setDs((prev) => prev?.map((p) => p.id === id ? { ...p, trang_thai: tt } : p) ?? prev)

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <BotTrangThai bot={bot} now={now} />
        <span className="text-[12px] text-slate-400">Claude chạy trên máy Thùy · mỗi việc một phiên · đóng phiên thì Claude viết tổng kết</span>
      </div>
      <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
        <div>
          <button onClick={() => { setTaoMoi(true); setChon(null) }}
            className="mb-2 w-full rounded-xl bg-indigo-600 px-3 py-2 text-[13.5px] font-semibold text-white hover:bg-indigo-700">+ Phiên mới</button>
          <div className="mb-2 flex gap-1 text-[12px]">
            {([['mo', 'Đang mở'], ['tat_ca', 'Tất cả']] as const).map(([k, t]) => (
              <button key={k} onClick={() => setLoc(k)} className={`rounded-full px-2.5 py-0.5 ${loc === k ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>{t}</button>
            ))}
            <button onClick={taiDs} title="Quét lại" className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 hover:bg-slate-200">↻</button>
          </div>
          {loi && <p className="mb-2 text-[12px] text-red-600">{loi}</p>}
          <div className="space-y-1.5">
            {ds == null && <p className="py-4 text-center text-[12.5px] text-slate-400">Đang tải…</p>}
            {ds != null && hien.length === 0 && <p className="py-4 text-center text-[12.5px] text-slate-400">Chưa có phiên nào{loc === 'mo' ? ' đang mở' : ''}.</p>}
            {hien.map((p) => (
              <button key={p.id} onClick={() => { setChon(p.id); setTaoMoi(false) }}
                className={`w-full rounded-xl border px-3 py-2 text-left transition ${chon === p.id ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className="flex items-center gap-1.5">
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-800">{p.tieu_de}</span>
                  {p.dang_chay && <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-indigo-500" title="Claude đang làm" />}
                  {p.trang_thai === 'dong' && <span className="shrink-0 text-[10.5px] text-slate-400">đã đóng</span>}
                </div>
                <div className="truncate text-[11.5px] text-slate-500">
                  {p.tin_cuoi ? `${p.tin_cuoi.vai === 'claude' ? '🤖 ' : ''}${p.tin_cuoi.noi_dung.replace(/^>.*$/gm, '').replace(/\s+/g, ' ').trim()}` : 'Chưa có tin nhắn'}
                </div>
                <div className="text-[10.5px] text-slate-400">{p.cua_toi ? 'Của bạn' : p.nguoi_mo_ten} · {gio(p.updated_at)}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          {taoMoi ? (
            <PhienMoi onHuy={() => setTaoMoi(false)} onXong={async (id) => { setTaoMoi(false); await taiDs(); setChon(id) }} />
          ) : dangChon ? (
            <KhungChat key={dangChon.id} phien={dangChon} onDoiTrangThai={doiTt} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-[13px] text-slate-400">
              Chọn một phiên bên trái, hoặc mở phiên mới.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
