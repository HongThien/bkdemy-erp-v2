// CA BỔ TRỢ HÌNH — phía TRỢ GIẢNG / GV (Thùy 17/10). Dưới ca bổ trợ yếu trong tab Bổ trợ.
// Khác Đại: không dạng/luyện/test (chưa có bản đồ Hình) — điểm danh → xem TÀI LIỆU buổi (do GV gắn ở ERP) → nhận xét → Hoàn tất.
// Hoàn tất ⇒ case KẾT THÚC luôn (17/10: 1 tuần bổ trợ 1 lần, tuần sau duyệt lại). Nguồn: fn_bthinh_viec_cua_toi · fn_bthinh_hoan_tat.
// KHÔNG import màn ERP desktop (luật app TA). Class màu literal (Tailwind JIT).
import { useEffect, useState } from 'react'
import { viecHinhCuaToi, diemDanhCaHinh, hoanTatCaHinh, MUC_HINH_TEN, UU_TIEN_HINH_TEN, type ViecCaHinh } from '../../lib/botro_hinh'
import { homNayVN, ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { BKRowCard, MaHS } from '../../components/bk/BKUI'

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')

export default function CaHinhTA() {
  const [ca, setCa] = useState<ViecCaHinh[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const homNay = homNayVN()
  const tai = () => viecHinhCuaToi().then(setCa).catch((e) => setLoi(`Ca Hình: ${e?.message ?? e}`))
  useEffect(() => { tai() }, [])
  const va = (id: string, fn: (c: ViecCaHinh) => ViecCaHinh) => setCa((p) => (p ?? []).map((c) => c.buoi_id === id ? fn(c) : c))

  if (ca !== null && ca.length === 0 && !loi) return null // không có ca Hình nào ⇒ không chiếm chỗ
  const sap = [...(ca ?? [])].sort((a, b) => (a.ngay === homNay ? 0 : 1) - (b.ngay === homNay ? 0 : 1) || a.ngay.localeCompare(b.ngay) || (a.gio_bat_dau ?? '').localeCompare(b.gio_bat_dau ?? '')) // HÔM NAY trước, không cắt (luật 30/09)
  return (
    <div className="mx-auto mt-2 flex max-w-[1000px] flex-col gap-1 px-2 pb-4">
      <p className="px-1 pt-1 text-[11px] font-bold uppercase tracking-wide text-[#6A4BD6]">📐 Bổ trợ Hình{ca ? ` · ${ca.length} ca` : ''}</p>
      {loi && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200">⚠ {loi}</p>}
      {sap.map((c) => (
        <div key={c.buoi_id} className="flex flex-col gap-1">
          <BKRowCard icon="/bk-ui/pr_tai_nghe.png" bg="#E6DDFF" accent="#8B6BEF" onClick={() => setMo(mo === c.buoi_id ? null : c.buoi_id)}
            title={<>{c.ho_ten} <MaHS ma={c.ma_hs} className="ml-1" /> <span className="font-normal text-[#63709A]">· Hình{c.khoi ? ` · K${c.khoi}` : ''}</span></>}
            sub={<>
              <span>{c.ngay === homNay ? 'hôm nay' : `${thuCuaNgay(c.ngay)} ${ddmmVN(c.ngay)}`}{c.gio_bat_dau ? ` · ${hhmm(c.gio_bat_dau)}` : ''}{c.phong ? ` · ${c.phong}` : ''}</span>
              <span className="rounded-full bg-white/80 px-1.5 py-px font-semibold">{MUC_HINH_TEN[c.level] ?? `L${c.level}`}</span>
              <span>{c.tai_lieu.length ? `${c.tai_lieu.length} tài liệu` : '⚠ chưa có tài liệu'}</span>
            </>}
            right={<span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.danh_gia_xong_at ? 'bg-[#E4F8EC] text-[#1E8A52]' : c.diem_danh === 'co_mat' ? 'bg-[#EEF3FF] text-[#2F73F6]' : c.diem_danh ? 'bg-[#FFE3EA] text-[#C0355A]' : 'bg-white/85 text-[#63709A]'}`}>
              {c.danh_gia_xong_at ? 'Hoàn tất' : c.diem_danh === 'co_mat' ? 'Đang học' : c.diem_danh ? 'Vắng' : 'Chờ em đến'}</span>} />
          {mo === c.buoi_id && <ChiTiet c={c} onVa={(fn) => va(c.buoi_id, fn)} onXong={tai} />}
        </div>
      ))}
    </div>
  )
}

function ChiTiet({ c, onVa, onXong }: { c: ViecCaHinh; onVa: (fn: (c: ViecCaHinh) => ViecCaHinh) => void; onXong: () => void }) {
  const [nx, setNx] = useState(c.nhan_xet ?? '')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [kt, setKt] = useState<string | null>(null)
  const xong = !!c.danh_gia_xong_at

  async function dd(tt: 'co_mat' | 'vang' | null) {
    setBusy(true); setLoi(null)
    try { await diemDanhCaHinh(c.buoi_id, c.hoc_sinh_id, tt); onVa((x) => ({ ...x, diem_danh: tt })) } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  async function hoanTat() {
    setBusy(true); setLoi(null)
    try {
      await hoanTatCaHinh(c.buoi_id, nx, false)
      onVa((x) => ({ ...x, danh_gia_xong_at: new Date().toISOString(), nhan_xet: nx }))
      setKt('🎉 Đã hoàn tất — ca bổ trợ Hình của em KẾT THÚC (1 tuần bổ trợ 1 lần, tuần sau duyệt lại).')
      onXong()
    } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  return (
    <div className="rounded-[18px] bg-white/90 p-3 text-[12.5px] text-[#16224D]">
      <p className="text-[11.5px] text-[#63709A]">Ưu tiên {UU_TIEN_HINH_TEN[c.uu_tien]} · Lý do mở: {c.ly_do}</p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-[#63709A]">① Điểm danh</p>
      <div className="mt-1 flex gap-1.5">
        <button disabled={busy || xong} onClick={() => dd(c.diem_danh === 'co_mat' ? null : 'co_mat')} className={`rounded-full px-3 py-1 text-[12px] font-bold ${c.diem_danh === 'co_mat' ? 'bg-[#1E8A52] text-white' : 'bg-[#E4F8EC] text-[#1E8A52]'} disabled:opacity-50`}>Có mặt</button>
        <button disabled={busy || xong} onClick={() => dd(c.diem_danh === 'vang' ? null : 'vang')} className={`rounded-full px-3 py-1 text-[12px] font-bold ${c.diem_danh === 'vang' ? 'bg-[#C0355A] text-white' : 'bg-[#FFE3EA] text-[#C0355A]'} disabled:opacity-50`}>Vắng</button>
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#63709A]">② Tài liệu buổi này</p>
      {c.tai_lieu.length === 0 ? <p className="mt-1 text-[#C27A00]">⚠ GV chưa gắn tài liệu — nhờ GV/OPS gắn ở ERP › Bổ trợ › Hình.</p>
        : <div className="mt-1 flex flex-col gap-1">{c.tai_lieu.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-xl bg-[#EEF3FF] px-2.5 py-1.5">
            <span className="font-semibold">{t.ten}</span><span className="text-[11px] text-[#63709A]">{t.loai}{t.khoi ? ` · K${t.khoi}` : ''}</span>
            {t.file_url ? <a href={t.file_url} target="_blank" rel="noreferrer" className="ml-auto rounded-full bg-[#2F73F6] px-2.5 py-0.5 text-[11px] font-bold text-white">Mở / in</a> : <span className="ml-auto text-[10.5px] text-[#63709A]">in từ ERP</span>}
          </div>))}</div>}
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#63709A]">③ Nhận xét cuối buổi</p>
      <textarea value={nx} onChange={(e) => setNx(e.target.value)} disabled={xong} rows={3} placeholder="Em làm được gì, còn vướng chỗ nào, cần ôn tiếp phần nào…" className="mt-1 w-full rounded-xl border border-[#DCE6FF] bg-white p-2 text-[13px] disabled:bg-slate-50" />
      {loi && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700">{loi}</p>}
      {kt && <p className="mt-2 rounded-xl bg-[#E4F8EC] px-3 py-2 text-[12px] font-semibold text-[#1E8A52]">{kt}</p>}
      {!xong && <button disabled={busy || c.diem_danh !== 'co_mat' || !nx.trim()} onClick={hoanTat} className="mt-2 w-full rounded-full bg-[#8B6BEF] py-2 text-[13px] font-bold text-white disabled:opacity-40">{busy ? '…' : 'Hoàn tất ca'}</button>}
      {!xong && c.diem_danh !== 'co_mat' && <p className="mt-1 text-center text-[11px] text-[#63709A]">Cần điểm danh “Có mặt” + nhận xét mới hoàn tất được.</p>}
    </div>
  )
}
