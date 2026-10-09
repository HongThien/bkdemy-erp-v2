// ============================================================================
// DoiMatKhau — HS tự đặt mật khẩu riêng.
//
// VÌ SAO BẮT BUỘC (cấp 3): 321 tài khoản HS provision với PIN = CHÍNH mã HS
// (`provision_hs_auth.mjs`). Với cấp 3, bài tập online là PHÉP ĐO CHÍNH (vào mastery,
// sắp tới là Elo) — mà phép đo chỉ có nghĩa khi quy được về đúng một người. PIN đoán
// được trong 1 giây thì "tài khoản riêng" chỉ là hình thức: HS đăng nhập hộ nhau và
// hệ không phân biệt nổi. Đổi mật khẩu là điều kiện để cả tầng đo phía sau đứng vững.
//
// Cờ `user_metadata.must_change_password` — DÙNG LẠI nguyên pattern app PH
// (`bkdemy-ph-app/app/actions/auth.ts`): provision đặt true, đổi xong đặt false trong
// CÙNG một lời gọi updateUser (mật khẩu + cờ đi chung 1 request, không có khe hở
// "đổi xong mà cờ còn treo").
// ============================================================================
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const TOI_THIEU = 6

// Thùy 29/09: theo skin (biến --sk-* như KhungHS). Màn này còn hiện TRƯỚC khi vào HocSinhApp (App/AppHS, lúc
// bắt buộc đổi) ⇒ lúc đó chưa ai gắn biến skin lên <html> ⇒ mọi biến đều kèm giá trị lùi (Tối giản sáng).
const V = {
  page: 'var(--sk-page, #f4f4f6)', ink: 'var(--sk-ink, #16181d)', muted: 'var(--sk-muted, #6b7080)',
  line: 'var(--sk-line, #d9dbe3)', acc: 'var(--sk-acc, #4f46e5)', accInk: 'var(--sk-acc-ink, #ffffff)',
  surface: 'var(--sk-surface, #ffffff)', surface2: 'var(--sk-surface2, #f1f2f6)', radius: 'var(--sk-radius, 16px)',
  font: 'var(--sk-font, inherit)', head: 'var(--sk-font-head, inherit)',
}
const THE_MK: React.CSSProperties = {
  background: V.surface, border: 'var(--sk-card-border, 1px solid #e3e5ec)', borderRadius: V.radius,
  boxShadow: 'var(--sk-card-shadow, 0 1px 2px rgba(0,0,0,.05))', backdropFilter: 'var(--sk-blur, none)', WebkitBackdropFilter: 'var(--sk-blur, none)', color: V.ink,
}
const SAI = '#e5484d', CANH_BAO = '#e0901e' // = MAU.sai / MAU.canhBao (KhungHS)

export default function DoiMatKhau({ maHS, batBuoc, onXong }: { maHS: string; batBuoc: boolean; onXong: () => void }) {
  const [mk1, setMk1] = useState('')
  const [mk2, setMk2] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Chặn đặt lại ĐÚNG mã HS — nếu không thì màn này thành thủ tục, mật khẩu vẫn đoán được.
  const trungMaHS = !!maHS && mk1.trim().toLowerCase() === maHS.trim().toLowerCase()
  const quaNgan = mk1.length > 0 && mk1.length < TOI_THIEU
  const lechNhau = mk2.length > 0 && mk1 !== mk2
  const hopLe = mk1.length >= TOI_THIEU && mk1 === mk2 && !trungMaHS

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!hopLe) return
    setBusy(true); setErr(null)
    const { error } = await supabase.auth.updateUser({ password: mk1, data: { must_change_password: false } })
    if (error) { setErr(error.message); setBusy(false); return }
    onXong()
  }

  const inp = 'w-full rounded-xl px-3.5 py-3 text-[16.5px] outline-none transition focus:ring-2 focus:ring-[var(--sk-acc,#4f46e5)]'
  const inpStyle: React.CSSProperties = { background: V.surface2, color: V.ink, border: `1px solid ${V.line}` }
  const nhan = 'mb-1.5 block text-[13px] font-semibold uppercase tracking-wide'
  return (
    <div className="min-h-[100dvh]" style={{ background: V.page, backgroundAttachment: 'fixed', color: V.ink, fontFamily: V.font }}>
    <div className="mx-auto max-w-md px-4 pb-10 md:max-w-xl">
      <div className="py-6">
        <p className="text-[20px] font-semibold" style={{ color: V.ink, fontFamily: V.head, textShadow: '0 1px 8px var(--sk-bg, transparent)' }}>{batBuoc ? 'Đặt mật khẩu riêng' : 'Đổi mật khẩu'}</p>
        {batBuoc && (
          <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: V.muted, textShadow: '0 1px 8px var(--sk-bg, transparent)' }}>
            Mật khẩu hiện tại của em đang trùng mã học sinh nên bạn khác đoán được.
            Đặt một mật khẩu riêng để không ai làm bài thay em.
          </p>
        )}
      </div>

      <form onSubmit={submit} className="p-5" style={THE_MK}>
        <label className={nhan} style={{ color: V.muted }}>Mật khẩu mới</label>
        <input type="password" value={mk1} onChange={(e) => setMk1(e.target.value)} autoFocus
          autoComplete="new-password" placeholder={`Ít nhất ${TOI_THIEU} ký tự`} className={`${inp} mb-1`} style={inpStyle} />
        {quaNgan && <p className="mb-2 text-[14px]" style={{ color: CANH_BAO }}>Cần ít nhất {TOI_THIEU} ký tự.</p>}
        {trungMaHS && <p className="mb-2 text-[14px]" style={{ color: SAI }}>Không đặt trùng mã học sinh — đó chính là mật khẩu ai cũng đoán được.</p>}

        <label className={`${nhan} mt-3.5`} style={{ color: V.muted }}>Nhập lại</label>
        <input type="password" value={mk2} onChange={(e) => setMk2(e.target.value)}
          autoComplete="new-password" className={`${inp} mb-1`} style={inpStyle} />
        {lechNhau && <p className="mb-2 text-[14px]" style={{ color: CANH_BAO }}>Hai ô chưa giống nhau.</p>}

        {err && <p className="mt-2 text-[14px]" style={{ color: SAI }}>{err}</p>}

        <button type="submit" disabled={busy || !hopLe}
          className="mt-4 w-full py-3 text-[16.5px] font-bold transition disabled:opacity-40"
          style={{ background: V.acc, color: V.accInk, borderRadius: V.radius, fontFamily: V.head }}>
          {busy ? 'Đang lưu…' : 'Lưu mật khẩu'}
        </button>

        {!batBuoc && (
          <button type="button" onClick={onXong} disabled={busy}
            className="mt-2 w-full rounded-xl py-2.5 text-[15.5px] transition" style={{ color: V.muted }}>
            Quay lại
          </button>
        )}
      </form>

      {batBuoc && (
        <button type="button" onClick={() => supabase.auth.signOut()}
          className="mt-5 w-full text-center text-[14.5px]" style={{ color: V.muted, textShadow: '0 1px 8px var(--sk-bg, transparent)' }}>
          Thoát
        </button>
      )}
    </div>
    </div>
  )
}
