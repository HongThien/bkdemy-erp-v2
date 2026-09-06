// TaiKhoanBank — tab "Tài khoản" app BK Chi: nhân sự tự khai ngân hàng/STK/chủ TK (Thùy câu 7) để kế toán
// quét QR chuyển trả. Preview QR tĩnh ngay tại chỗ để nhân sự tự kiểm (quẹt bằng app bank của mình).
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { MyProfile } from '../../lib/nhansu'
import { NGAN_HANG, tenNganHang } from '../../lib/nganhang'
import { luuBank, qrTinh, type BankInfo } from '../../lib/thuchi'

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[16px] text-slate-800 outline-none focus:border-indigo-500'

export default function TaiKhoanBank({ profile, bank, onSaved }: { profile: MyProfile; bank: BankInfo | null; onSaved: () => void }) {
  const [bin, setBin] = useState(bank?.bank_bin ?? '')
  const [stk, setStk] = useState(bank?.bank_stk ?? '')
  const [chu, setChu] = useState(bank?.bank_chu_tk ?? '')
  const [qr, setQr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => { setBin(bank?.bank_bin ?? ''); setStk(bank?.bank_stk ?? ''); setChu(bank?.bank_chu_tk ?? '') }, [bank])
  useEffect(() => {
    const s = stk.replace(/\s+/g, '')
    if (!bin || s.length < 6) { setQr(null); return }
    let alive = true
    qrTinh(bin, s).then((d) => alive && setQr(d)).catch(() => alive && setQr(null))
    return () => { alive = false }
  }, [bin, stk])

  const doi = bin !== (bank?.bank_bin ?? '') || stk.replace(/\s+/g, '') !== (bank?.bank_stk ?? '') || chu.trim().toUpperCase() !== (bank?.bank_chu_tk ?? '')
  const hopLe = !!bin && stk.replace(/\s+/g, '').length >= 6 && chu.trim().length > 0
  const luu = async () => {
    setBusy(true); setMsg(null)
    try { await luuBank(profile.nhanSu.id, { bank_bin: bin, bank_stk: stk, bank_chu_tk: chu }); onSaved(); setMsg({ ok: true, text: 'Đã lưu tài khoản nhận tiền' }) }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }) }
    finally { setBusy(false) }
  }

  return (
    <div className="min-h-full bg-[#f5f5f7]">
      <div className="bg-indigo-600 px-5 pb-5 text-white" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-[20px] font-bold">{profile.nhanSu.ho_ten}</h1>
          <p className="text-[13px] text-indigo-100">{profile.nhanSu.ma_ns ?? ''}{profile.nhanSu.email ? ` · ${profile.nhanSu.email}` : ''}</p>
        </div>
      </div>
      <div className="mx-auto max-w-[760px] px-4 pb-10 pt-4">
        <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Tài khoản nhận hoàn ứng</p>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          {!bank?.bank_stk && <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-800">Khai STK để kế toán quét QR chuyển trả đúng người, đúng số tiền.</p>}
          <label className="mb-1 block text-[12px] font-semibold text-slate-500">Ngân hàng</label>
          <select className={`${inputCls} mb-3`} value={bin} onChange={(e) => setBin(e.target.value)}>
            <option value="">— Chọn ngân hàng —</option>
            {NGAN_HANG.map((b) => <option key={b.bin} value={b.bin}>{b.ten}</option>)}
          </select>
          <label className="mb-1 block text-[12px] font-semibold text-slate-500">Số tài khoản</label>
          <input className={`${inputCls} mb-3 font-mono`} inputMode="numeric" placeholder="Vd: 0123456789" value={stk} onChange={(e) => setStk(e.target.value.replace(/[^\d\s]/g, ''))} />
          <label className="mb-1 block text-[12px] font-semibold text-slate-500">Tên chủ tài khoản <span className="font-normal text-slate-400">(không dấu)</span></label>
          <input className={`${inputCls} mb-4 uppercase`} placeholder="Vd: NGUYEN VAN A" value={chu} onChange={(e) => setChu(e.target.value)} />

          {qr && (
            <div className="mb-4 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <img src={qr} alt="QR" className="h-28 w-28 rounded-lg bg-white" />
              <div className="text-[12px] text-slate-500">
                <p className="font-semibold text-slate-700">{tenNganHang(bin)}</p>
                <p className="font-mono text-[13px] text-slate-800">{stk.replace(/\s+/g, '')}</p>
                <p className="uppercase">{chu.trim() || '—'}</p>
                <p className="mt-1">Quẹt thử bằng app ngân hàng để chắc đúng STK.</p>
              </div>
            </div>
          )}
          {msg && <p className={`mb-3 rounded-xl px-3 py-2 text-[13px] ${msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>}
          <button onClick={luu} disabled={!hopLe || !doi || busy} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-[15px] font-semibold text-white shadow-sm active:bg-indigo-700 disabled:opacity-40">
            {busy ? 'Đang lưu…' : 'Lưu tài khoản'}
          </button>
        </div>

        <button onClick={() => supabase.auth.signOut()} className="mt-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-600 active:bg-slate-100">Đăng xuất</button>
      </div>
    </div>
  )
}
