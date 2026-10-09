// ============================================================================
// ThanhTuuHS — Màn "Thành tựu" cho HS cấp 2 (Thùy 11/09).
// Nội dung: giải thưởng cuối tháng đã CÔNG BỐ (fn_hs_thanh_tuu_cua_toi) + lối vào Album huy hiệu (AlbumHS).
// Thùy 29/09: khung/màu theo STYLE (skin) em chọn (skin/KhungHS) — bỏ nền mây, chồng sách, khẩu hiệu,
// màu theo giới tính. Màu loại giải (THANH_TUU_MAU) là màu ngữ nghĩa, giữ nguyên.
// ============================================================================
import { useEffect, useState } from 'react'
import { thanhTuuCuaToi, LOAI_GIAI_TEN, THANH_TUU_ICON, THANH_TUU_MAU, type ThanhTuuHS as TT } from '../../lib/thanhtuu_hs'
import { ManHS, DauTrangHS, NhomHS, TrongHS, MAU, THE, HEAD } from './skin/KhungHS'
import { thanhTuuMoiCuaToi, thanhTuuNhan, type TtCuaToi, type TtNhan } from '../../lib/thanhtuu_moi'
import { MungThanhTuu, ThanhTuuMoiView } from './thanhtuu/ThanhTuuMoiView'

function labelThang(ym: string): string { const [y, m] = ym.split('-'); return `Tháng ${parseInt(m, 10)}/${y}` }

export default function ThanhTuuHS({ onXong, onAlbum }: { gioiTinh: 'nam' | 'nu' | null; onXong: () => void; onAlbum?: () => void }) {
  const [items, setItems] = useState<TT[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  // Thành tựu 15 loại (Thùy 07/10): mỗi thẻ chỉ hiện bậc gần nhất; đạt ⇒ nút "Nhận quà". Nhận xong VÁ TẠI CHỖ (không tải lại cả màn).
  const [tt, setTt] = useState<TtCuaToi | null>(null)
  const [vuaNhan, setVuaNhan] = useState<TtNhan | null>(null)
  const [dangNhan, setDangNhan] = useState<string | null>(null)
  useEffect(() => { thanhTuuMoiCuaToi().then(setTt).catch((e) => setErr(e?.message ?? String(e))) }, [])
  const nhanQua = async (ma: string, bac: number) => {
    if (dangNhan) return
    setDangNhan(`${ma}-${bac}`); setErr(null)
    try {
      const r = await thanhTuuNhan(ma, bac)
      setVuaNhan(r)
      setTt((p) => {
        if (!p) return p
        const loai = p.loai.map((l) => (l.ma !== ma ? l : { ...l, bac: l.bac.map((b) => (b.bac === bac ? { ...b, dat: true, co_the_nhan: false } : b)) }))
        const conCho = loai.filter((l) => l.bac.some((b) => b.co_the_nhan)).length
        return { ...p, loai, cho_nhan: conCho, tong_exp_mua: p.tong_exp_mua + r.exp }
      })
    } catch (e: any) { setErr(e?.message ?? String(e)) } finally { setDangNhan(null) }
  }
  useEffect(() => {
    thanhTuuCuaToi().then(setItems).catch((e) => { setErr(e?.message ?? String(e)); setItems([]) })
  }, [])

  const byThang = new Map<string, TT[]>()
  for (const it of items ?? []) { const arr = byThang.get(it.thang) ?? []; arr.push(it); byThang.set(it.thang, arr) }
  const thangs = [...byThang.keys()]
  const coData = items && items.length > 0

  return (
    <ManHS nenAnh="thanh_tuu">
      <DauTrangHS tieuDe="Thành tựu của em" phu="Thành tựu mùa · giải thưởng cuối tháng · huy hiệu" onBack={onXong} />
      <MungThanhTuu nhan={vuaNhan} onDong={() => setVuaNhan(null)} />
      {tt ? <ThanhTuuMoiView d={tt} onNhan={nhanQua} dangNhan={dangNhan} /> : !err && <TrongHS>Đang tải…</TrongHS>}
      <NhomHS>Giải thưởng cuối tháng</NhomHS>

      {items === null && !tt && <TrongHS>Đang tải…</TrongHS>}
      {err && <p className="rounded-2xl px-3 py-2 text-center text-[13px] font-semibold" style={{ ...THE, color: MAU.sai }}>⚠ {err}</p>}

      {items && !coData && (
        <div className="p-8 text-center" style={THE}>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-[20px]" style={{ background: MAU.surface2 }}>
            <span className="text-[39.5px]">🏅</span>
          </div>
          <p className="text-[17.5px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>Chưa có giải thưởng nào</p>
          <p className="mx-auto mt-1.5 max-w-[280px] text-[14px] leading-relaxed" style={{ color: MAU.muted }}>
            Cố lên nhé! Cuối tháng thầy cô sẽ trao giải cho các bạn <b style={{ color: MAU.acc }}>xuất sắc / tiến bộ / chăm chỉ</b>.
          </p>
        </div>
      )}

      {coData && (
        <div className="flex flex-col gap-4">
          {thangs.map((ym) => (
            <section key={ym}>
              <NhomHS>{labelThang(ym)}</NhomHS>
              <div className="mt-2 flex flex-col gap-3">
                {byThang.get(ym)!.map((it) => {
                  // Màu theo LOẠI GIẢI (ngữ nghĩa, cố định mọi skin) — chỉ dùng trên nền pastel của chính nó để luôn đọc được.
                  const mau = THANH_TUU_MAU[it.loai_giai]
                  return (
                    <div key={it.id} className="relative flex items-center gap-3 p-4" style={THE}>
                      <span className="relative flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[18px]" style={{ background: mau.nen, border: `1.5px solid ${mau.vien}` }}>
                        <span className="text-[35px]">{THANH_TUU_ICON[it.loai_giai]}</span>
                      </span>
                      <div className="min-w-0 flex-1 pr-1">
                        <span className="inline-block rounded-full px-2.5 py-0.5 text-[16.5px] font-extrabold leading-tight" style={{ background: mau.nen, color: mau.chu, border: `1px solid ${mau.vien}` }}>Giải {LOAI_GIAI_TEN[it.loai_giai]}</span>
                        <p className="mt-1 text-[14px] font-semibold" style={{ color: MAU.ink, opacity: .85 }}>{it.mon}{it.ten_lop ? ` · ${it.ten_lop}` : ''}</p>
                        <p className="mt-0.5 text-[12px]" style={{ color: MAU.muted }}>Công bố {new Date(it.cong_bo_at).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          {/* Huy hiệu — mở album (AlbumHS, mig 202609281846) */}
          <section>
            <NhomHS>Huy hiệu</NhomHS>
            <button onClick={onAlbum} disabled={!onAlbum} className="mt-2 w-full p-6 text-center transition active:scale-[0.98]" style={THE}>
              <p className="text-[33px]">🎖️</p>
              <p className="mt-1.5 text-[15.5px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>Album huy hiệu</p>
              <p className="mt-0.5 text-[12.5px]" style={{ color: MAU.muted }}>Helios · Athena · Zeus… — mỗi tháng học tốt là thêm sao</p>
            </button>
          </section>
        </div>
      )}
    </ManHS>
  )
}
