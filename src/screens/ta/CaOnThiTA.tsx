// CA BỔ TRỢ ÔN THI — phía TRỢ GIẢNG (Thùy 23/10). Dưới ca bổ trợ Hình trong tab Bổ trợ.
// KHÔNG mở ca, KHÔNG dùng app HS: app chỉ liệt kê các em đã đăng ký ca (Trang thêm ở ERP) → TA điểm danh → cuối giờ BÁO ĐỘNG nếu cần
// (lời văn: em kiểm rất kém dạng nào…, về ERP của Trang) → Hoàn tất ca. Em đến mà chưa đăng ký: TA thêm tại chỗ. Công TA = việc phát sinh (khai ở tab Công).
// Nguồn: fn_onthi_viec_cua_toi · fn_onthi_diem_danh · fn_onthi_them_tai_cho · fn_onthi_bao_dong_luu · fn_onthi_ca_hoan_tat.
// KHÔNG import màn ERP desktop (luật app TA). Class màu literal (Tailwind JIT).
import { useEffect, useRef, useState } from 'react'
import { viecOnThiCuaToi, diemDanhOnThi, themTaiCho, baoDongOnThi, hoanTatCaOnThi, timHs, type ViecCaOnThi, type HsViecTA, type HsTim } from '../../lib/botro_on_thi'
import { homNayVN, ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { BKRowCard, MaHS } from '../../components/bk/BKUI'

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')

export default function CaOnThiTA() {
  const [ca, setCa] = useState<ViecCaOnThi[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const homNay = homNayVN()
  const tai = () => viecOnThiCuaToi().then((r) => { setCa(r); setLoi(null) }).catch((e) => setLoi(`Ca ôn thi: ${e?.message ?? e}`)) // refetch NỀN, giữ list cũ tới khi có list mới
  useEffect(() => { tai() }, [])
  const vaHs = (buoi: string, hs: string, fn: (h: HsViecTA) => HsViecTA) =>
    setCa((p) => (p ?? []).map((c) => c.buoi_id === buoi ? { ...c, hs: c.hs.map((h) => h.hoc_sinh_id === hs ? fn(h) : h) } : c))

  if (ca !== null && ca.length === 0 && !loi) return null // không có ca ôn thi nào ⇒ không chiếm chỗ
  const sap = [...(ca ?? [])].sort((a, b) => (a.ngay === homNay ? 0 : 1) - (b.ngay === homNay ? 0 : 1) || a.ngay.localeCompare(b.ngay) || (a.gio_bat_dau ?? '').localeCompare(b.gio_bat_dau ?? ''))
  return (
    <div className="mx-auto mt-2 flex max-w-[1000px] flex-col gap-1 px-2 pb-4">
      <p className="px-1 pt-1 text-[11px] font-bold uppercase tracking-wide text-[#C27A00]">📝 Bổ trợ ôn thi{ca ? ` · ${ca.length} ca` : ''}</p>
      {loi && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200">⚠ {loi}</p>}
      {sap.map((c) => {
        const coMat = c.hs.filter((h) => h.diem_danh === 'co_mat').length
        const chua = c.hs.filter((h) => !h.diem_danh).length
        return (
          <div key={c.buoi_id} className="flex flex-col gap-1">
            <BKRowCard icon="/bk-ui/pr_tai_nghe.png" bg="#FFF0D6" accent="#F2A33A" onClick={() => setMo(mo === c.buoi_id ? null : c.buoi_id)}
              title={<>{c.dot_ten} <span className="font-normal text-[#63709A]">· {c.hs.length} em đăng ký</span></>}
              sub={<>
                <span>{c.ngay === homNay ? 'hôm nay' : `${thuCuaNgay(c.ngay)} ${ddmmVN(c.ngay)}`} · {hhmm(c.gio_bat_dau)}–{hhmm(c.gio_ket_thuc)}{c.phong ? ` · ${c.phong}` : ''}</span>
                {c.hs.length > 0 && <span className="rounded-full bg-white/80 px-1.5 py-px font-semibold">{coMat} có mặt{chua > 0 ? ` · ${chua} chờ` : ''}</span>}
              </>}
              right={<span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.hoan_tat ? 'bg-[#E4F8EC] text-[#1E8A52]' : chua === 0 && c.hs.length > 0 ? 'bg-[#EEF3FF] text-[#2F73F6]' : 'bg-[#FFF0D6] text-[#C27A00]'}`}>
                {c.hoan_tat ? 'Hoàn tất' : chua === 0 && c.hs.length > 0 ? 'Sẵn sàng hoàn tất' : 'Chờ điểm danh'}</span>} />
            {mo === c.buoi_id && <ChiTiet c={c} homNay={homNay} onVa={(hs, fn) => vaHs(c.buoi_id, hs, fn)} onDoi={tai} />}
          </div>
        )
      })}
    </div>
  )
}

function ChiTiet({ c, homNay, onVa, onDoi }: { c: ViecCaOnThi; homNay: string; onVa: (hs: string, fn: (h: HsViecTA) => HsViecTA) => void; onDoi: () => void }) {
  const [busy, setBusy] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [kt, setKt] = useState<string | null>(null)
  const [moBd, setMoBd] = useState<string | null>(null) // em đang mở ô báo động
  const [nd, setNd] = useState('')
  const [q, setQ] = useState('')
  const [kq, setKq] = useState<HsTim[]>([])
  const lan = useRef(0)
  const chuaToi = c.ngay > homNay
  const khoa = c.hoan_tat || chuaToi
  const chua = c.hs.filter((h) => !h.diem_danh).length
  const trongCa = new Set(c.hs.map((h) => h.hoc_sinh_id))

  useEffect(() => {
    const l = ++lan.current
    if (q.trim().length < 2) { setKq([]); return }
    const t = setTimeout(() => { timHs(c.dot_id, q, true).then((r) => { if (l === lan.current) setKq(r) }).catch(() => {}) }, 300)
    return () => clearTimeout(t)
  }, [q, c.dot_id])

  async function lam(k: string, f: () => Promise<void>) { setBusy(k); setLoi(null); setKt(null); try { await f() } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) } }
  const dd = (h: HsViecTA, tt: 'co_mat' | 'vang') => lam(h.hoc_sinh_id, async () => {
    const moi = h.diem_danh === tt ? null : tt
    await diemDanhOnThi(c.buoi_id, h.hoc_sinh_id, moi); onVa(h.hoc_sinh_id, (x) => ({ ...x, diem_danh: moi })); if (moi !== 'co_mat') setMoBd(null)
  })
  const luuBd = (h: HsViecTA, noi: string) => lam('bd' + h.hoc_sinh_id, async () => {
    await baoDongOnThi(c.buoi_id, h.hoc_sinh_id, noi); onVa(h.hoc_sinh_id, (x) => ({ ...x, bao_dong: noi.trim() || null })); setMoBd(null)
  })
  const them = (h: HsTim) => lam('them' + h.hoc_sinh_id, async () => { await themTaiCho(c.buoi_id, h.hoc_sinh_id); setQ(''); setKq([]); onDoi() })
  const hoanTat = () => lam('ht', async () => { await hoanTatCaOnThi(c.buoi_id); setKt('🎉 Đã hoàn tất ca. Báo động (nếu có) đã về ERP của Trang.'); onDoi() })

  return (
    <div className="rounded-[18px] bg-white/90 p-3 text-[12.5px] text-[#16224D]">
      {chuaToi && <p className="mb-2 rounded-xl bg-[#FFF8E6] px-3 py-2 text-[12px] text-[#C27A00]">Ca chưa tới ngày — chỉ xem danh sách, điểm danh khi tới ngày.</p>}
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#63709A]">① Điểm danh ({c.hs.length} em đăng ký)</p>
      {c.hs.length === 0 && <p className="mt-1 text-[#63709A]">Chưa có em nào đăng ký ca này. Em đến thì thêm ở mục ③.</p>}
      <div className="mt-1 flex flex-col gap-1.5">
        {c.hs.map((h) => (
          <div key={h.hoc_sinh_id} className="rounded-xl bg-[#F6F8FF] px-2.5 py-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold">{h.ho_ten}</span><MaHS ma={h.ma_hs} /><span className="text-[11px] text-[#63709A]">K{h.khoi}</span>
              {h.khong_dk && <span className="rounded-full bg-[#FFF0D6] px-1.5 py-px text-[10px] font-bold text-[#C27A00]">đến không đăng ký</span>}
              <span className="ml-auto flex gap-1.5">
                <button disabled={khoa || busy === h.hoc_sinh_id} onClick={() => dd(h, 'co_mat')} className={`rounded-full px-3 py-1 text-[12px] font-bold ${h.diem_danh === 'co_mat' ? 'bg-[#1E8A52] text-white' : 'bg-[#E4F8EC] text-[#1E8A52]'} disabled:opacity-50`}>✓ Có mặt</button>
                <button disabled={khoa || busy === h.hoc_sinh_id} onClick={() => dd(h, 'vang')} className={`rounded-full px-3 py-1 text-[12px] font-bold ${h.diem_danh === 'vang' || h.diem_danh === 'vang_phep' ? 'bg-[#C0355A] text-white' : 'bg-[#FFE3EA] text-[#C0355A]'} disabled:opacity-50`}>Vắng</button>
              </span>
            </div>
            {h.diem_danh === 'co_mat' && (
              <div className="mt-1.5">
                {moBd === h.hoc_sinh_id ? (
                  <div className="flex flex-col gap-1.5">
                    <textarea value={nd} onChange={(e) => setNd(e.target.value)} rows={3} autoFocus disabled={c.hoan_tat}
                      placeholder="Ghi rõ em kiểm rất kém dạng nào, vì sao cần lưu ý… (lời văn; thông tin chốt riêng với phụ huynh)" className="w-full rounded-xl border border-[#F2C9D3] bg-white p-2 text-[12.5px] outline-none" />
                    <div className="flex gap-1.5">
                      <button disabled={busy === 'bd' + h.hoc_sinh_id || !nd.trim()} onClick={() => luuBd(h, nd)} className="rounded-full bg-[#C0355A] px-3 py-1 text-[12px] font-bold text-white disabled:opacity-40">Gửi báo động</button>
                      {h.bao_dong && <button disabled={busy === 'bd' + h.hoc_sinh_id} onClick={() => luuBd(h, '')} className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-[#63709A] ring-1 ring-[#DCE6FF]">Gỡ báo động</button>}
                      <button onClick={() => setMoBd(null)} className="px-2 text-[12px] text-[#63709A]">Đóng</button>
                    </div>
                  </div>
                ) : h.bao_dong ? (
                  <button onClick={() => { setNd(h.bao_dong ?? ''); setMoBd(h.hoc_sinh_id) }} disabled={c.hoan_tat} className="w-full rounded-xl bg-[#FFE3EA] px-2.5 py-1.5 text-left text-[12px] text-[#8A2440]"><b>⚠ Báo động:</b> {h.bao_dong}</button>
                ) : (
                  !c.hoan_tat && <button onClick={() => { setNd(''); setMoBd(h.hoc_sinh_id) }} className="text-[12px] font-bold text-[#C0355A]">⚠ Báo động</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#63709A]">② Cuối giờ</p>
      <p className="mt-1 text-[#63709A]">Em nào kiểm <b>rất kém</b> dạng nào thì bấm “⚠ Báo động” ở dòng em đó, viết lời văn. Không có thì bỏ qua.</p>

      {!khoa && (
        <>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#63709A]">③ Em đến mà chưa đăng ký</p>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Gõ tên hoặc mã HS…" className="mt-1 w-full rounded-xl border border-[#DCE6FF] bg-white p-2 text-[12.5px] outline-none" />
          {kq.length > 0 && (
            <div className="mt-1 flex flex-col gap-1">
              {kq.map((h) => (
                <div key={h.hoc_sinh_id} className="flex items-center gap-2 rounded-xl bg-[#EEF3FF] px-2.5 py-1.5">
                  <span className="font-semibold">{h.ho_ten}</span><MaHS ma={h.ma_hs} /><span className="text-[11px] text-[#63709A]">K{h.khoi}{h.lop ? ` · ${h.lop}` : ''}</span>
                  {trongCa.has(h.hoc_sinh_id) ? <span className="ml-auto text-[11px] text-[#63709A]">đã trong ca</span>
                    : <button disabled={busy === 'them' + h.hoc_sinh_id} onClick={() => them(h)} className="ml-auto rounded-full bg-[#2F73F6] px-3 py-0.5 text-[11.5px] font-bold text-white disabled:opacity-50">+ Thêm (có mặt)</button>}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {loi && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700">{loi}</p>}
      {kt && <p className="mt-2 rounded-xl bg-[#E4F8EC] px-3 py-2 text-[12px] font-semibold text-[#1E8A52]">{kt}</p>}
      {!c.hoan_tat && (
        <>
          <button disabled={busy === 'ht' || chuaToi || chua > 0} onClick={hoanTat} className="mt-3 w-full rounded-full bg-[#F2A33A] py-2 text-[13px] font-bold text-white disabled:opacity-40">{busy === 'ht' ? '…' : 'Hoàn tất ca'}</button>
          {chua > 0 && !chuaToi && <p className="mt-1 text-center text-[11px] text-[#63709A]">Còn {chua} em chưa điểm danh — điểm danh hết (có mặt / vắng) mới hoàn tất được.</p>}
        </>
      )}
    </div>
  )
}
