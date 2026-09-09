// HỎI HỆ THỐNG — tab thứ 4 trong "Việc của tôi" (cạnh Vận hành/Phát triển/Trợ lý).
// CỐ Ý không đẻ leaf mới — cùng lý do TroLyTab (leaf kéo theo quyền per-leaf ở Phân
// quyền + hiện trong nav mọi role); tab thì bỏ đi cũng sạch.
//
// Phân vai với tab 🤖 Trợ lý: Trợ lý đọc BẢNG SẠCH số liệu ngày ("hôm nay ai vắng") —
// tab này hỏi bot Claude Code đọc repo ("vì sao Elo tính thế này", "quy trình chấm ET
// đi đường nào"). Bot chạy máy local nên trả lời KHÔNG tức thì (vài chục giây tới vài
// phút) — UI phải nói rõ trạng thái chờ + heartbeat bot, không để người hỏi đoán.
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { guiCauHoi, listHoiDap, getBotAliveAt, BOT_SONG_TRONG_MS, type HoiDap } from '../../lib/hoidap'

const POLL_MS = 5000 // câu trả lời mất chục giây+ — poll 5s đủ "tự hiện", không cần realtime client

function TrangThaiBadge({ hd }: { hd: HoiDap }) {
  if (hd.trang_thai === 'done') return null
  if (hd.trang_thai === 'failed') return (
    <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
      ✗ Không trả lời được — thử hỏi lại, còn lỗi nữa thì báo quản lý
    </span>
  )
  return (
    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
      {hd.trang_thai === 'processing' ? '🤖 Bot đang đọc hệ thống để trả lời…' : '⏳ Đang chờ bot nhận câu hỏi…'}
    </span>
  )
}

export default function HoiDapTab() {
  const [list, setList] = useState<HoiDap[]>([])
  const [aliveAt, setAliveAt] = useState<string | null>(null)
  const [myId, setMyId] = useState<string | null>(null)
  const [cauHoi, setCauHoi] = useState('')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const dangTai = useRef(false)

  async function refresh() {
    if (dangTai.current) return // poll 5s + refresh sau gửi có thể chồng nhau — bỏ lượt thừa
    dangTai.current = true
    try {
      const [l, a] = await Promise.all([listHoiDap(), getBotAliveAt()])
      setList(l); setAliveAt(a); setNow(Date.now())
    } catch { /* mất mạng thoáng qua — giữ data cũ, lượt poll sau tự vá */ }
    finally { dangTai.current = false }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMyId(data.user?.id ?? null))
    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, []) // eslint-disable-line

  async function gui() {
    const ch = cauHoi.trim()
    if (!ch || busy) return
    setBusy(true); setLoi(null)
    try { await guiCauHoi(ch); setCauHoi(''); await refresh() }
    catch (e: any) { setLoi(e.message ?? String(e)) }
    finally { setBusy(false) }
  }

  const botSong = aliveAt != null && now - new Date(aliveAt).getTime() < BOT_SONG_TRONG_MS
  const dangCho = list.some((h) => h.trang_thai === 'pending' || h.trang_thai === 'processing')

  return (
    <div className="mx-auto max-w-[760px]">
      {/* Trạng thái bot — heartbeat là cách duy nhất biết daemon local còn sống; bot chết
          mà còn câu đang chờ thì phải NÓI TO, không để người hỏi nhìn "đang chờ" vô hạn. */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium ${
          botSong ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : aliveAt == null ? 'border-slate-200 bg-slate-50 text-slate-500'
          : 'border-red-200 bg-red-50 text-red-700'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${botSong ? 'bg-emerald-500' : aliveAt == null ? 'bg-slate-400' : 'bg-red-500'}`} />
          {botSong ? 'Bot đang chạy' : aliveAt == null ? 'Chưa rõ trạng thái bot' : 'Bot mất liên lạc'}
        </span>
        {!botSong && dangCho && (
          <span className="text-[12px] font-medium text-red-600">Câu hỏi sẽ được trả lời khi bot chạy lại — hoặc báo quản lý.</span>
        )}
      </div>

      {/* Ô hỏi */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
        <textarea
          value={cauHoi} onChange={(e) => setCauHoi(e.target.value)} rows={2}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) gui() }}
          placeholder="Hỏi về cách hệ thống hoạt động — vd: Vì sao điểm Elo của học sinh giảm dù làm đúng nhiều câu?"
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[13.5px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-300"
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11.5px] text-slate-400">Số liệu ngày (ai vắng, điểm hôm nay…) hỏi tab 🤖 Trợ lý. Tab này chuyên "vì sao / quy trình".</p>
          <button onClick={gui} disabled={!cauHoi.trim() || busy}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40">
            {busy ? 'Đang gửi…' : 'Gửi câu hỏi'}
          </button>
        </div>
        {loi && <p className="mt-1.5 text-[12px] font-medium text-red-600">{loi}</p>}
      </div>

      {/* Dòng thời gian hỏi–đáp — MỌI thành viên thấy MỌI câu (tri thức chung, RLS đã mở
          select cho cả đội): một người hỏi, người sau đọc lại đỡ hỏi trùng. */}
      <div className="mt-4 flex flex-col gap-2.5">
        {list.length === 0 && <p className="py-6 text-center text-[13px] text-slate-400">Chưa có câu hỏi nào — hỏi câu đầu tiên đi.</p>}
        {list.map((hd) => (
          <div key={hd.id} className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-[15px]">💬</span>
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-wrap text-[13.5px] font-medium text-slate-800">{hd.cau_hoi}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {hd.nguoi === myId ? 'Tôi · ' : ''}{new Date(hd.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                </p>
              </div>
              <TrangThaiBadge hd={hd} />
            </div>
            {hd.trang_thai === 'done' && hd.tra_loi && (
              <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-indigo-50/60 px-3 py-2.5">
                <span className="shrink-0 text-[15px]">🤖</span>
                <p className="min-w-0 flex-1 whitespace-pre-wrap text-[13.5px] leading-relaxed text-slate-700">{hd.tra_loi}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
