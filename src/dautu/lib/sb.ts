import type { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js'
// Supabase cho game Đấu Từ: anon, không giữ phiên (game không đăng nhập). Realtime = broadcast + presence.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined

export const coMang = Boolean(url && key)

export const sb = createClient(url ?? 'http://localhost', key ?? 'x', {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  realtime: { params: { eventsPerSecond: 30 } },
})

/** Kênh realtime an toàn khi mở lại cùng tên (StrictMode mount 2 lần / vào lại đúng phòng cũ).
 *  supabase-js trả lại kênh CŨ nếu trùng tên (kể cả đang gỡ dở) ⇒ gắn .on() sau subscribe là ném lỗi.
 *  Lớp này: chờ gỡ xong mọi kênh cùng tên của mình rồi mới tạo kênh thật; .on/.subscribe/.track gọi trước đó được xếp hàng. */
const dangGo = new Map<string, Promise<unknown>>()
type Nghe = [string, Record<string, unknown>, (p: { payload: unknown; event?: string }) => void]
export class KenhRT {
  private that: RealtimeChannel | null = null
  private nghe: Nghe[] = []
  private khiDangKy: ((s: string) => void) | null = null
  private daHuy = false
  private meta: Record<string, unknown> | null = null
  constructor(readonly ten: string, readonly ma: string) {
    const cu = sb.getChannels().filter((c) => c.topic === 'realtime:' + ten)
    const cho = Promise.all([dangGo.get(ten), ...cu.map((c) => sb.removeChannel(c))])
    cho.finally(() => this.mo())
  }
  private mo() {
    if (this.daHuy) return
    const ch = sb.channel(this.ten, { config: { broadcast: { self: false, ack: false }, presence: { key: this.ma } } })
    for (const [loai, loc, f] of this.nghe) (ch.on as unknown as (a: string, b: unknown, c: unknown) => void)(loai, loc, f)
    this.that = ch
    ch.subscribe((st) => {
      if (st === 'SUBSCRIBED' && this.meta) void ch.track(this.meta)
      this.khiDangKy?.(st)
    })
  }
  on(loai: 'presence' | 'broadcast', loc: Record<string, unknown>, f: (p: { payload: unknown; event?: string }) => void) {
    this.nghe.push([loai, loc, f])
    return this
  }
  subscribe(f: (st: string) => void) { this.khiDangKy = f; return this }
  track(meta: object) { this.meta = meta as Record<string, unknown>; if (this.that) void this.that.track(meta) }
  send(m: { type: 'broadcast'; event: string; payload: unknown }) { if (this.that) void this.that.send(m) }
  presenceState<T>(): RealtimePresenceState<T & Record<string, unknown>> {
    return (this.that?.presenceState() ?? {}) as RealtimePresenceState<T & Record<string, unknown>>
  }
  huy() {
    this.daHuy = true
    if (this.that) dangGo.set(this.ten, sb.removeChannel(this.that).finally(() => dangGo.delete(this.ten)))
  }
}
export const kenhMoi = (ten: string, ma: string) => new KenhRT(ten, ma)
