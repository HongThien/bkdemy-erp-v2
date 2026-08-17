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

  const inp = 'w-full rounded-xl border border-slate-300 px-3.5 py-3 text-[15px] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 px-4 pb-10">
      <div className="py-6">
        <p className="text-lg font-semibold text-slate-900">{batBuoc ? 'Đặt mật khẩu riêng' : 'Đổi mật khẩu'}</p>
        {batBuoc && (
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">
            Mật khẩu hiện tại của em đang trùng mã học sinh nên bạn khác đoán được.
            Đặt một mật khẩu riêng để không ai làm bài thay em.
          </p>
        )}
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Mật khẩu mới</label>
        <input type="password" value={mk1} onChange={(e) => setMk1(e.target.value)} autoFocus
          autoComplete="new-password" placeholder={`Ít nhất ${TOI_THIEU} ký tự`} className={`${inp} mb-1`} />
        {quaNgan && <p className="mb-2 text-[12.5px] text-amber-600">Cần ít nhất {TOI_THIEU} ký tự.</p>}
        {trungMaHS && <p className="mb-2 text-[12.5px] text-rose-600">Không đặt trùng mã học sinh — đó chính là mật khẩu ai cũng đoán được.</p>}

        <label className="mb-1.5 mt-3.5 block text-[12px] font-semibold uppercase tracking-wide text-slate-500">Nhập lại</label>
        <input type="password" value={mk2} onChange={(e) => setMk2(e.target.value)}
          autoComplete="new-password" className={`${inp} mb-1`} />
        {lechNhau && <p className="mb-2 text-[12.5px] text-amber-600">Hai ô chưa giống nhau.</p>}

        {err && <p className="mt-2 text-[12.5px] text-rose-600">{err}</p>}

        <button type="submit" disabled={busy || !hopLe}
          className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-[15px] font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40">
          {busy ? 'Đang lưu…' : 'Lưu mật khẩu'}
        </button>

        {!batBuoc && (
          <button type="button" onClick={onXong} disabled={busy}
            className="mt-2 w-full rounded-xl py-2.5 text-[14px] text-slate-500 transition hover:text-slate-700">
            Quay lại
          </button>
        )}
      </form>

      {batBuoc && (
        <button type="button" onClick={() => supabase.auth.signOut()}
          className="mt-5 w-full text-center text-[13px] text-slate-400">
          Thoát
        </button>
      )}
    </div>
  )
}
