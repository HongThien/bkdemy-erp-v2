// Avatar HS bấm-để-đổi — ỐP từ `components/AvatarEditButton.tsx` của app TA (CEO 08/09: "học sinh cũng cần thay
// avatar"). Khác TA đúng 1 chỗ: TA update thẳng nhan_su.anh_url, HS phải qua RPC hs_doi_anh_dai_dien (hoc_sinh là bảng
// staff-only). Upload dùng CHUNG uploadAvatar (bucket 'avatars', 0020 cho mọi authenticated ghi). Lưu ngay khi chọn,
// xem ảnh tức thì bằng object URL, lỗi thì revert. Vòng trắng + vương miện do HomeHS vẽ bên ngoài — component này chỉ
// là hình tròn bên trong + badge 📷.
import { useRef, useState } from 'react'
import { uploadAvatar } from '../../lib/nhansu'
import { doiAnhDaiDienHS } from '../../lib/tuluyen'

export default function AvatarHS({ anhUrl, initials, size, fill, badge, onChanged }: {
  anhUrl: string | null; initials: string; size: number; fill: string; badge: string; onChanged: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onChon(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; e.target.value = ''
    if (!f) return
    setErr(null)
    setPreview(URL.createObjectURL(f))
    setUploading(true)
    try {
      const url = await uploadAvatar(f)
      await doiAnhDaiDienHS(url)
      onChanged(url)
    } catch (e: any) {
      setErr(e?.message ?? String(e)); setPreview(null)
    } finally { setUploading(false) }
  }
  const anh = preview ?? anhUrl
  const badgeSize = Math.max(20, Math.round(size * 0.3))
  return (
    <button onClick={() => !uploading && inputRef.current?.click()} aria-label="Đổi ảnh đại diện"
      className="relative flex shrink-0 items-center justify-center rounded-full font-extrabold text-white active:scale-95"
      style={{ width: size, height: size, background: fill, fontSize: size * 0.38, opacity: uploading ? 0.6 : 1 }}>
      {anh ? <img src={anh} alt="" className="block h-full w-full rounded-full object-cover" /> : initials}
      {uploading
        ? <span className="absolute inset-0 flex items-center justify-center text-[13px]">…</span>
        : <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full text-[11px] shadow-sm ring-2 ring-white" style={{ width: badgeSize, height: badgeSize, background: badge }}>📷</span>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChon} />
      {err && <span className="absolute left-1/2 top-full z-10 mt-1 w-max max-w-[170px] -translate-x-1/2 rounded-lg bg-[#FFE1E7] px-2 py-1 text-[10px] font-semibold leading-snug text-[#9F2244]">{err}</span>}
    </button>
  )
}
