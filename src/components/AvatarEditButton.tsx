// Nút avatar bấm-để-đổi — TÁCH ra từ TaHome.tsx (CEO 07/09 "đổi avatar ngay tại app") để dùng lại được ở
// OPS. Dùng LẠI uploadAvatar/updateMyProfile của HoSoModal (ERP), KHÔNG đẻ bucket/RPC mới. Lưu ngay khi
// chọn ảnh (không có nút "Lưu" riêng — mobile-first, ~2s feedback). Màu sắc/kích thước truyền qua props
// để mỗi app tự phối theo tông của mình (TA xanh dương, OPS xanh lục…) — không đổi giao diện TaHome cũ.
import { useRef, useState } from 'react'
import { uploadAvatar, updateMyProfile } from '../lib/nhansu'

export default function AvatarEditButton({ nhanSuId, anhUrl, initial, size = 96, ring = '#DCE6FF', badge = '#2F73F6', onChanged }: {
  nhanSuId: string
  anhUrl: string | null | undefined
  initial: string
  size?: number
  ring?: string
  badge?: string
  onChanged?: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onChonAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; e.target.value = ''
    if (!f) return
    setErr(null)
    setPreview(URL.createObjectURL(f))   // xem ngay trong lúc chờ upload — cùng byte ảnh, không cần swap lại
    setUploading(true)
    try {
      const url = await uploadAvatar(f)
      await updateMyProfile(nhanSuId, { anh_url: url })
      onChanged?.(url)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }
  const anhHienThi = preview ?? anhUrl
  const badgeSize = Math.max(22, Math.round(size * 0.32))
  return (
    <button onClick={() => !uploading && inputRef.current?.click()} className="relative shrink-0 active:scale-95" aria-label="Đổi ảnh đại diện" style={{ width: size, height: size }}>
      {anhHienThi
        ? <img src={anhHienThi} alt="" className="block h-full w-full rounded-full object-cover" style={{ boxShadow: `0 0 0 3px ${ring}`, opacity: uploading ? 0.5 : 1 }} />
        : <span className="flex h-full w-full items-center justify-center rounded-full font-extrabold" style={{ background: `${ring}55`, color: badge, boxShadow: `0 0 0 3px ${ring}`, fontSize: size * 0.36, opacity: uploading ? 0.5 : 1 }}>{initial}</span>}
      {uploading
        ? <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold" style={{ color: badge }}>…</span>
        : <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full text-[12px] text-white shadow-sm ring-2 ring-white" style={{ width: badgeSize, height: badgeSize, background: badge }}>📷</span>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChonAvatar} />
      {err && <span className="absolute left-1/2 top-full z-10 mt-1 w-max max-w-[160px] -translate-x-1/2 rounded-lg bg-[#FFE1E7] px-2 py-1 text-[10px] font-semibold leading-snug text-[#9F2244]">{err}</span>}
    </button>
  )
}
