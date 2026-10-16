// ============================================================================
// AnhTuLuanHS — khung NỘP ẢNH cho 1 câu tự luận trong Thi thử (Ôn thi giữa kì I, spec-on-thi-gk1.md).
// HS làm ra giấy → chụp/chọn ảnh → ảnh lên ngay (thu nhỏ trước) và nằm đúng câu. Còn trong giờ thì xoá/chụp lại được.
// Component chỉ VẼ + gọi lib/onthi; danh sách ảnh do màn cha giữ (vá tại chỗ, không tải lại).
// ============================================================================
import { useRef, useState } from 'react'
import { thuNhoAnh } from '../../lib/anhNho'
import { nopAnhTuLuan, xoaAnhTuLuan, ANH_TL_TOI_DA, type AnhTuLuan } from '../../lib/onthi'
import { NutHS, MAU } from './skin/KhungHS'

export default function AnhTuLuanHS({ hocSinhId, baiLamId, cauId, anh, url, khoa, onThem, onXoa }: {
  hocSinhId: string; baiLamId: string; cauId: string
  anh: AnhTuLuan[]                         // ảnh của CÂU này
  url: Record<string, string>              // path → signed URL
  khoa: boolean                            // đã nộp: chỉ xem
  onThem: (a: AnhTuLuan) => void
  onXoa: (id: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  async function chon(files: FileList | null) {
    if (!files?.length) return
    setBusy(true); setLoi(null)
    try {
      let thuTu = anh.length ? Math.max(...anh.map((a) => a.thu_tu)) + 1 : 0
      for (const f of Array.from(files).slice(0, ANH_TL_TOI_DA - anh.length)) {
        const blob = await thuNhoAnh(f).catch(() => f)
        onThem(await nopAnhTuLuan(hocSinhId, baiLamId, cauId, blob, thuTu++))
      }
    } catch (e: any) { setLoi(e?.message ?? 'Không nộp được ảnh — kiểm tra mạng rồi thử lại.') }
    finally { setBusy(false); if (ref.current) ref.current.value = '' }
  }
  async function xoa(id: string) {
    setBusy(true); setLoi(null)
    try { await xoaAnhTuLuan(id); onXoa(id) } catch (e: any) { setLoi(e?.message ?? 'Không xoá được ảnh.') } finally { setBusy(false) }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[15.5px] leading-snug" style={{ color: MAU.muted }}>
        {khoa ? 'Ảnh bài làm em đã nộp:' : `Câu tự luận: em làm ra giấy, rồi chụp ảnh bài làm và nộp ngay tại đây (tối đa ${ANH_TL_TOI_DA} ảnh).`}
      </p>
      {anh.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {anh.map((a, i) => (
            <div key={a.id} className="relative overflow-hidden rounded-lg" style={{ border: `1px solid ${MAU.line}`, background: MAU.surface2 }}>
              {url[a.path] ? <img src={url[a.path]} alt={`Ảnh bài làm ${i + 1}`} className="aspect-[3/4] w-full object-cover" />
                : <div className="flex aspect-[3/4] items-center justify-center text-[13px]" style={{ color: MAU.muted }}>Đang tải…</div>}
              {!khoa && <button onClick={() => xoa(a.id)} disabled={busy} aria-label="Xoá ảnh"
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-bold disabled:opacity-50"
                style={{ background: MAU.surface, color: MAU.sai, border: `1px solid ${MAU.line}` }}>✕</button>}
            </div>
          ))}
        </div>
      )}
      {!khoa && anh.length < ANH_TL_TOI_DA && (
        <>
          <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => chon(e.target.files)} />
          <NutHS phu onClick={() => ref.current?.click()} tat={busy}>{busy ? 'Đang nộp ảnh…' : anh.length ? '📷 Thêm ảnh' : '📷 Chụp / chọn ảnh bài làm'}</NutHS>
        </>
      )}
      {!khoa && anh.length === 0 && <p className="text-[14px]" style={{ color: MAU.canhBao }}>Chưa có ảnh nào cho câu này.</p>}
      {loi && <p className="text-[14px]" style={{ color: MAU.sai }}>{loi}</p>}
    </div>
  )
}
