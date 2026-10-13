// ============================================================================
// TRÒ CHƠI (Thùy 04–06/10): 1 ô ở khối Giải trí ⇒ màn danh sách game. Hiện 1 game chơi được (Nông trại BK) + 1 game "sắp ra mắt" (mờ, không bấm được).
// Danh sách ở dsGame.ts. `GameNhungHS`-kiểu nhúng cho Nông trại: <iframe> cùng origin (public/games/nong-trai/), có nút ‹ để về danh sách.
// Chỉ VẼ: không số liệu nghiệp vụ. Khung/màu theo skin (KhungHS), chữ trung tính (không giọng game — đây là danh mục).
// ============================================================================
import { DauTrangHS, HEAD, MAU, ManHS, NhanHS, TheHS } from '../skin/KhungHS'
import { DS_GAME, type GameHS } from './dsGame'
import { useEffect, useRef } from 'react'
import { ntDhtDongBo, ntLuuDoc, ntLuuGhi, ntNhip, ntRpc, ntXuDongBo, type NtNhip } from '../../../lib/nt_luu'

function Anh({ g }: { g: GameHS }) {
  return g.anh
    ? <img src={g.anh} alt="" draggable={false} className="h-20 w-20 shrink-0 rounded-[18px] object-cover md:h-24 md:w-24" style={{ border: '1.5px solid var(--sk-line)' }} />
    : <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] text-[37.5px] font-extrabold md:h-24 md:w-24" aria-hidden
        style={{ ...HEAD, background: 'var(--sk-surface2)', color: MAU.muted, border: '1.5px dashed var(--sk-line)' }}>?</span>
}

export default function TroChoiHS({ onBack, onChoi, sapRa }: { onBack: () => void; onChoi: (id: string) => void; sapRa?: Record<string, boolean> }) {
  return (
    <ManHS>
      <DauTrangHS tieuDe="Trò chơi" phu="Giải lao sau giờ học" onBack={onBack} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {DS_GAME.map((g) => {
          const san = g.trangThai === 'san_sang' && !sapRa?.[g.id]   // sapRa = công tắc tính năng của game đang đóng
          return (
            <TheHS key={g.id} onClick={san ? () => onChoi(g.id) : undefined} tat={!san} className="flex gap-4 p-4">
              <Anh g={g} />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[20px] font-bold leading-tight" style={HEAD}>{g.ten}</span>
                  {!san && <NhanHS mau="var(--sk-muted)">Sắp ra mắt</NhanHS>}
                </span>
                <span className="text-[15px] leading-snug" style={{ color: MAU.ink }}>{g.moTa}</span>
                {g.ghiChu && san && <span className="text-[13px] leading-snug" style={{ color: MAU.muted }}>{g.ghiChu}</span>}
                {san && <span className="mt-auto pt-1 text-[15px] font-bold" style={{ color: MAU.acc }}>Chơi ngay ›</span>}
              </span>
            </TheHS>
          )
        })}
      </div>
    </ManHS>
  )
}

/** Nông trại BK chạy trong khung (iframe cùng origin). Nút ‹ nổi ở góc dưới PHẢI (góc dưới trái đã có nút âm thanh/tuỳ chọn của game) để về danh sách game. */
export function GameNongTraiHS({ onBack }: { onBack: () => void }) {
  const khung = useRef<HTMLIFrameElement>(null)
  // CẦU NỐI LƯU THEO TÀI KHOẢN (bước 1 hoàn thiện, 12/10): game ↔ app bằng postMessage (js/cau.js trong game). App giữ phiên + gọi RPC; debounce 5s; xung đột thiết bị ⇒ báo game.
  const cap = useRef<string | null>(null)        // mốc cap_nhat đã đọc/ghi lần cuối (khoá lạc quan)
  const cho = useRef<Record<string, unknown> | null>(null)
  const hen = useRef<number | undefined>(undefined)
  const xung = useRef(false)
  const dang = useRef(false)
  const sanSang = useRef(false)   // đã bắt tay xong ⇒ mới gửi nhịp giờ chơi
  const noi = (m: Record<string, unknown>) => khung.current?.contentWindow?.postMessage({ bk: 'nt', ...m }, location.origin)
  const xa = useRef<() => Promise<void>>(async () => {})
  xa.current = async () => {
    window.clearTimeout(hen.current); hen.current = undefined
    const st = cho.current; if (!st || xung.current || dang.current) return
    cho.current = null; dang.current = true
    try {
      const r = await ntLuuGhi(st, cap.current)
      if (r.ok) { cap.current = r.cap_nhat ?? null; if (typeof r.gio_ms === 'number') noi({ loai: 'gio', gioMs: r.gio_ms }) }
      else { xung.current = true; noi({ loai: 'xung_dot' }) }
    } catch { noi({ loai: 'loi_luu' }); if (!cho.current) cho.current = st }   // lỗi mạng: giữ bản mới nhất, lần sau gửi lại
    finally { dang.current = false; if (cho.current && !xung.current && hen.current === undefined) hen.current = window.setTimeout(() => void xa.current(), 5000) }
  }
  useEffect(() => {
    const nghe = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.source !== khung.current?.contentWindow) return
      const d = e.data as { bk?: string; loai?: string; state?: Record<string, unknown>; tong?: number; k?: number; ra?: number; id?: number; ten?: string; tham?: Record<string, unknown> } | null
      if (!d || d.bk !== 'nt') return
      if (d.loai === 'san_sang') {
        // bản lưu + GIỜ SERVER + giờ chơi còn lại (nhịp đầu không cộng giờ). Không đọc được ⇒ game tự lùi về bản lưu trên máy.
        Promise.all([ntLuuDoc(), ntNhip()]).then(([r, h]) => {
          cap.current = r?.cap_nhat ?? null; sanSang.current = true
          noi({ loai: 'nap', ok: true, state: r?.state ?? null, gioMs: h.gio_ms, conLaiGiay: h.con_lai_giay, het: h.het, dhtSoDu: h.dht_so_du, dhtDaTieu: h.dht_da_tieu })
        }).catch(() => noi({ loai: 'nap', ok: false }))
      } else if (d.loai === 'thoat') {
        onBack()
      } else if (d.loai === 'tieu' && typeof d.tong === 'number') {
        // game báo TỔNG điểm đã tiêu: lưu bản mới nhất TRƯỚC rồi mới trừ điểm (rớt giữa chừng ⇒ không mất điểm oan). Lỗi mạng ⇒ game gửi lại theo nhịp.
        const tong = d.tong
        void (async () => {
          try { await xa.current(); const r = await ntDhtDongBo(tong); noi({ loai: 'dht', ok: r.ok, loi: r.loi, soDu: r.so_du, daTieu: r.da_tieu }) }
          catch { noi({ loai: 'dht', ok: false, loi: 'mang' }) }
        })()
      } else if (d.loai === 'rpc' && typeof d.id === 'number' && typeof d.ten === 'string') {
        // bạn lớp thật: game xin gọi hàm server (danh sách trắng ở ntRpc)
        const id = d.id
        void ntRpc(d.ten, d.tham ?? {}).then((kq) => noi({ loai: 'rpc', id, kq })).catch(() => noi({ loai: 'rpc', id, kq: { ok: false, loi: 'mang' } }))
      } else if (d.loai === 'xu' && typeof d.k === 'number' && typeof d.ra === 'number') {
        // game báo xu đã đổi trong tháng (tích luỹ): lưu bản mới nhất trước, rồi server cắt theo ngày chơi + trần tháng và ghi VÍ XU THẬT
        const k = d.k, ra = d.ra
        void (async () => {
          try { await xa.current(); const r = await ntXuDongBo(k, ra); noi({ loai: 'xu', ok: r.ok, loi: r.loi, daNhan: r.da_nhan, nhanThem: r.nhan_them, tran: r.tran_thang, moiNgay: r.xu_moi_ngay, ngayChoi: r.ngay_choi, duocToiNay: r.duoc_toi_nay }) }
          catch { noi({ loai: 'xu', ok: false, loi: 'mang' }) }
        })()
      } else if (d.loai === 'luu' && d.state) {
        cho.current = d.state
        if (hen.current === undefined) hen.current = window.setTimeout(() => void xa.current(), 5000)
      }
    }
    window.addEventListener('message', nghe)
    // NHỊP giờ chơi 30 giây/lần khi em đang nhìn màn (tab/app hiện) — server tự đo khoảng liên tục, client không khai số giây.
    const nhip = window.setInterval(() => {
      if (!sanSang.current || document.visibilityState !== 'visible') return
      ntNhip().then((h: NtNhip) => noi({ loai: 'gio', gioMs: h.gio_ms, conLaiGiay: h.con_lai_giay, het: h.het, dhtSoDu: h.dht_so_du, dhtDaTieu: h.dht_da_tieu })).catch(() => {})
    }, 30000)
    return () => { window.clearInterval(nhip); window.removeEventListener('message', nghe); window.clearTimeout(hen.current); void xa.current() }   // rời màn ⇒ đẩy nốt bản mới nhất
  }, [])
  return (
    <div className="fixed inset-0 z-40" style={{ background: 'var(--sk-bg)' }}>
      <iframe ref={khung} title="Nông trại BK" src="/games/nong-trai/index.html?nhung=1" className="h-full w-full border-0" allow="autoplay" />
      <button onClick={onBack} aria-label="Về danh sách trò chơi"
        className="absolute bottom-[calc(10px+env(safe-area-inset-bottom))] right-2.5 z-50 flex h-10 w-10 items-center justify-center rounded-full text-[24px] leading-none active:scale-95"
        style={{ background: 'var(--sk-surface)', color: 'var(--sk-ink)', border: '1.5px solid var(--sk-line)', opacity: 0.92 }}>‹</button>
    </div>
  )
}
