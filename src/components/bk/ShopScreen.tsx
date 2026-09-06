// Màn SHOPPING (design 05): tile điểm + chuỗi, banner luật đổi quà, lưới card pastel (emoji minh
// hoạ, giá xu, nút Đổi quà), đơn của tôi. Chỉ ĐIỂM ĐÃ CHỐT mới xài (shop.ts / fn_shop_doi).
// Luật hiển thị lấy đúng luật CEO chốt (100 điểm/ngày, trượt về 0, cutoff tháng) — không chép luật
// tam giác trong handoff (đã bị CEO bác).
import { useEffect, useState } from 'react'
import { listVatPham, listDonCuaToi, doiVatPham, type ShopVatPham, type ShopDon } from '../../lib/shop'
import { ddmmVN } from '../../lib/tuan'
import { BKSectionCard, BKSectionTitle, BKEmptyState, BKBottomSheet, BKStatusPill, type BKTone } from './BKUI'

const TONES: BKTone[] = ['yellow', 'purple', 'peach', 'mint', 'pink', 'blue']
const TONE_CLS: Record<BKTone, { card: string; btn: string }> = {
  yellow: { card: 'bg-[#FFF6D6] border-[#FFE59A]', btn: 'bg-[#FF8FB1]' }, purple: { card: 'bg-[#EAE2FF] border-[#D6C8FF]', btn: 'bg-[#9B7CF7]' },
  peach: { card: 'bg-[#FFE7D6] border-[#FFD3B1]', btn: 'bg-[#FF8A3D]' }, mint: { card: 'bg-[#DDF7E8] border-[#BDF0D6]', btn: 'bg-[#31C875]' },
  pink: { card: 'bg-[#FFE3EA] border-[#FFC3D2]', btn: 'bg-[#FF5D78]' }, blue: { card: 'bg-[#DDF4FF] border-[#BFE3FF]', btn: 'bg-[#2F73F6]' },
}
const ICON: [RegExp, string][] = [[/trà sữa/i, '🧋'], [/kem/i, '🍦'], [/tokbokki|tteok/i, '🍢'], [/snack|bim/i, '🍿'], [/voucher/i, '🎟️'], [/sổ|notebook/i, '📔'], [/cà phê|coffee/i, '☕']]
const iconCho = (s: string) => ICON.find(([re]) => re.test(s))?.[1] ?? '🎁'
const TT: Record<ShopDon['trang_thai'], { ten: string; st: 'cho' | 'dat' | 'nguy' }> = { cho_giao: { ten: 'Chờ giao', st: 'cho' }, da_giao: { ten: 'Đã giao', st: 'dat' }, huy: { ten: 'Đã huỷ', st: 'nguy' } }

export function ShopScreen({ xaiDuoc, diemThang, chuoi, diemMoiNgay, onChanged }: { xaiDuoc: number; diemThang: number; chuoi: number; diemMoiNgay: number; onChanged: () => void }) {
  const [items, setItems] = useState<ShopVatPham[] | null>(null)
  const [don, setDon] = useState<ShopDon[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [xacNhan, setXacNhan] = useState<ShopVatPham | null>(null)

  const load = () => Promise.all([listVatPham(), listDonCuaToi()]).then(([i, d]) => { setItems(i); setDon(d) }).catch((e) => setMsg({ ok: false, text: e?.message ?? String(e) }))
  useEffect(() => { load() }, [])
  async function doi(v: ShopVatPham) {
    setBusy(true); setMsg(null)
    try { await doiVatPham(v.id); setMsg({ ok: true, text: `Đã đổi ${v.ten} — chờ giao 🎉` }); setXacNhan(null); await load(); onChanged() }
    catch (e: any) { setMsg({ ok: false, text: e?.message ?? String(e) }) } finally { setBusy(false) }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
        <BKSectionCard className="!p-3">
          <p className="text-[10.5px] font-semibold text-[#63709A]">🪙 Điểm xài được</p>
          <p className="text-[22px] font-extrabold text-[#16224D]">{xaiDuoc.toLocaleString('vi-VN')}</p>
          <p className="text-[10px] text-[#63709A]">+{diemThang.toLocaleString('vi-VN')} tháng này (chốt cuối tháng)</p>
        </BKSectionCard>
        <BKSectionCard className="!p-3">
          <p className="text-[10.5px] font-semibold text-[#63709A]">🔥 Chuỗi hoàn thành</p>
          <p className="text-[22px] font-extrabold text-[#FF8A3D]">{chuoi} <span className="text-[13px] text-[#16224D]">ngày</span></p>
          <p className="text-[10px] text-[#63709A]">100% việc/ngày có việc</p>
        </BKSectionCard>
        <BKSectionCard tone="mint" className="!p-3 text-center"><p className="text-[12px] font-extrabold leading-tight text-[#1E8A52]">Cố lên<br />TA ơi! ♡</p></BKSectionCard>
      </div>

      <BKSectionCard tone="blue" className="flex items-center gap-3">
        <span className="text-[40px] leading-none">🤖</span>
        <div className="min-w-0 flex-1 text-[12px] leading-relaxed text-[#16224D]">
          <span className="rounded-full bg-[#2F73F6] px-2.5 py-0.5 text-[11px] font-bold text-white">Quy tắc đổi quà</span>
          <p className="mt-1">Mỗi ngày có việc mà hoàn thành 100%: <b>+{diemMoiNgay} điểm</b>, liên tiếp thì dồn lên. Trượt 1 ngày → chuỗi về 0. Cuối tháng chốt sổ — chỉ điểm đã chốt mới đổi được; sang tháng tính lại từ đầu.</p>
        </div>
      </BKSectionCard>

      {msg && <p className={`rounded-2xl px-3 py-2 text-[12.5px] ${msg.ok ? 'bg-[#E8F9EF] text-[#1E8A52]' : 'bg-[#FFE3EA] text-[#C0355A]'}`}>{msg.text}</p>}

      {items === null ? <p className="text-center text-[13px] text-[#63709A]">Đang tải…</p>
        : !items.length ? <BKEmptyState icon="🛍️">Chưa có vật phẩm nào — BK sẽ lên kệ sớm!</BKEmptyState>
        : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((v, i) => {
              const t = TONE_CLS[TONES[i % TONES.length]]
              const du = xaiDuoc >= v.gia_diem
              return (
                <div key={v.id} className={`relative flex flex-col rounded-3xl border p-3 text-center shadow-[0_4px_14px_rgba(22,34,77,.06)] ${t.card}`}>
                  <span className="pointer-events-none absolute left-3 top-2 text-[12px] text-[#FFD84D]">✦</span>
                  {v.anh_url ? <img src={v.anh_url} alt="" className="mx-auto h-20 w-20 rounded-2xl object-cover" /> : <span className="text-[56px] leading-none">{iconCho(v.ten)}</span>}
                  <p className="mt-1.5 text-[15px] font-extrabold text-[#16224D]">{v.ten}</p>
                  {v.mo_ta && <p className="text-[11px] leading-snug text-[#63709A]">{v.mo_ta}</p>}
                  <p className="mt-1.5 text-[16px] font-extrabold text-[#16224D]">🪙 {v.gia_diem.toLocaleString('vi-VN')}</p>
                  <button disabled={!du || busy} onClick={() => setXacNhan(v)}
                    className={`mt-2 rounded-full py-2 text-[13px] font-extrabold text-white shadow disabled:opacity-40 ${t.btn}`}>
                    {du ? 'Đổi quà' : `Thiếu ${(v.gia_diem - xaiDuoc).toLocaleString('vi-VN')}`}
                  </button>
                </div>
              )
            })}
          </div>
        )}

      {don.length > 0 && (
        <BKSectionCard>
          <BKSectionTitle>🧾 Đơn của tôi</BKSectionTitle>
          <div className="flex flex-col divide-y divide-[#EEF3FF]">
            {don.map((d) => (
              <div key={d.id} className="flex items-center gap-2 py-2">
                <span className="text-[22px]">{iconCho(d.ten_vat_pham)}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-[#16224D]">{d.ten_vat_pham}</span>
                <span className="text-[11px] text-[#63709A]">🪙{d.gia_diem} · {ddmmVN(d.created_at.slice(0, 10))}</span>
                <BKStatusPill status={TT[d.trang_thai].st}>{TT[d.trang_thai].ten}</BKStatusPill>
              </div>
            ))}
          </div>
        </BKSectionCard>
      )}

      <BKBottomSheet open={!!xacNhan} onClose={() => setXacNhan(null)}>
        {xacNhan && (
          <div className="text-center">
            <span className="text-[64px] leading-none">{iconCho(xacNhan.ten)}</span>
            <p className="mt-2 text-[18px] font-extrabold text-[#16224D]">Đổi {xacNhan.ten}?</p>
            <p className="mt-1 text-[13px] text-[#63709A]">Trừ 🪙 {xacNhan.gia_diem.toLocaleString('vi-VN')} · còn lại {(xaiDuoc - xacNhan.gia_diem).toLocaleString('vi-VN')}. Đơn sẽ ở trạng thái "chờ giao".</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setXacNhan(null)} className="flex-1 rounded-full border border-[#DDE4F3] py-2.5 text-[13.5px] font-bold text-[#63709A]">Thôi</button>
              <button disabled={busy} onClick={() => doi(xacNhan)} className="flex-1 rounded-full bg-[#FF5D78] py-2.5 text-[13.5px] font-extrabold text-white disabled:opacity-40">{busy ? '…' : 'Đổi quà 🎁'}</button>
            </div>
          </div>
        )}
      </BKBottomSheet>
    </div>
  )
}
