import { useEffect, useRef, useState } from 'react'
import { getMyProfile, updateMyProfile, uploadAvatar, type MyProfile } from '../../lib/nhansu'
import { Shell, Field, inp } from '../kho/ui'

const CAP_LABEL: Record<string, string> = { truong: 'Trưởng', pho: 'Phó', thanh_vien: 'Thành viên' }
const VT_LABEL: Record<string, string> = { gv: 'Giáo viên', tg: 'Trợ giảng' }

// Hồ sơ CỦA TÔI: NS tự sửa ảnh + SĐT + email. Team / vị trí / phân công = CHỈ XEM (quản trị sửa).
export default function HoSoModal({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState<MyProfile | null | 'loading' | 'unlinked'>('loading')
  const [sdt, setSdt] = useState('')
  const [email, setEmail] = useState('')
  const [anhUrl, setAnhUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        if (!p) { setProfile('unlinked'); return }
        setProfile(p); setSdt(p.nhanSu.so_dien_thoai ?? ''); setEmail(p.nhanSu.email ?? ''); setAnhUrl(p.nhanSu.anh_url ?? '')
      })
      .catch((e) => { setError(e.message ?? String(e)); setProfile('unlinked') })
  }, [])

  async function save() {
    if (profile === 'loading' || profile === 'unlinked' || !profile) return
    setBusy(true); setError(null); setSaved(false)
    try {
      await updateMyProfile(profile.nhanSu.id, { so_dien_thoai: sdt.trim() || null, email: email.trim() || null, anh_url: anhUrl || null })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (e: any) { setError(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <Shell title="Hồ sơ của tôi" onClose={onClose}>
      {profile === 'loading' ? <p className="py-6 text-center text-sm text-slate-400">Đang tải…</p>
        : profile === 'unlinked' || !profile ? (
          <div className="py-4 text-sm text-slate-500">
            Tài khoản này <b>chưa gắn với hồ sơ nhân sự nào</b>.<br />
            Báo quản trị kiểm tra: email đăng nhập phải <b>trùng email</b> khai trong màn Nhân sự (sau đó đăng nhập lại).
            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
          </div>
        ) : (
          <>
            {/* Ảnh + thông tin tự sửa */}
            <div className="mb-4 flex items-center gap-3">
              {anhUrl
                ? <img src={anhUrl} alt="" className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />
                : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-xl font-bold text-white">{profile.nhanSu.ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase()}</div>}
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-slate-900">{profile.nhanSu.ho_ten} <span className="font-mono text-[11px] font-normal text-slate-400">{profile.nhanSu.ma_ns}</span></div>
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-1 rounded-md border border-slate-200 px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-40">
                  {uploading ? 'Đang tải…' : anhUrl ? 'Đổi ảnh' : '+ Ảnh đại diện'}
                </button>
                {anhUrl && <button onClick={() => setAnhUrl('')} className="ml-2 text-[12px] text-slate-400 hover:text-rose-600">gỡ</button>}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0]; e.target.value = ''
                  if (!f) return
                  setUploading(true)
                  try { setAnhUrl(await uploadAvatar(f)) } catch (er: any) { setError(er.message ?? String(er)) } finally { setUploading(false) }
                }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="Số điện thoại"><input value={sdt} onChange={(e) => setSdt(e.target.value)} className={inp} /></Field>
              <Field label="Email liên hệ"><input value={email} onChange={(e) => setEmail(e.target.value)} className={inp} /></Field>
            </div>

            {/* Chỉ xem — quản trị quản ở màn Nhân sự / Sơ đồ / Lớp */}
            <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2.5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Thông tin tổ chức (chỉ xem)</div>
              <div className="mb-1.5 flex flex-wrap items-center gap-1 text-[13px]">
                <span className="w-20 shrink-0 text-slate-500">Team:</span>
                {profile.teams.map((t) => <span key={t.id} className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">{t.ten}</span>)}
                {profile.teams.length === 0 && <span className="text-slate-300">chưa xếp</span>}
              </div>
              <div className="mb-1.5 flex flex-wrap items-start gap-1 text-[13px]">
                <span className="w-20 shrink-0 text-slate-500">Vị trí:</span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  {profile.viTris.map((v) => <span key={v.id} className="text-slate-700">{v.ten || 'Vị trí chưa tên'} <span className="text-slate-400">· {CAP_LABEL[v.cap]} · {v.team_ten}</span></span>)}
                  {profile.viTris.length === 0 && <span className="text-slate-300">chưa giữ vị trí nào</span>}
                </span>
              </div>
              <div className="flex flex-wrap items-start gap-1 text-[13px]">
                <span className="w-20 shrink-0 text-slate-500">Phân công:</span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  {profile.phanCong.map((p) => <span key={p.id} className="text-slate-700">{p.lop?.ten_lop ?? '?'} <span className="text-slate-400">· {VT_LABEL[p.vai_tro] ?? p.vai_tro}{p.la_chinh ? ' (chính)' : ''}</span></span>)}
                  {profile.phanCong.length === 0 && <span className="text-slate-300">chưa có phân công lớp</span>}
                </span>
              </div>
            </div>

            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
            <div className="mt-4 flex items-center justify-end gap-2">
              {saved && <span className="text-[12px] font-medium text-emerald-600">✓ Đã lưu</span>}
              <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Đóng</button>
              <button onClick={save} disabled={busy} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu'}</button>
            </div>
          </>
        )}
    </Shell>
  )
}
