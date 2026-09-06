// Màn SHOPPING (ảnh gốc anhgoc_shopping + backdrop_shopping, CEO 07/09). Tranh nền có sẵn title · túi quà ·
// mascot · bảng gỗ; code đặt lên: hàng "Điểm tích lũy · Chuỗi hoàn thành · Cố lên TA ơi!", banner "Quy tắc đổi
// quà" (robot ôm quà), tab kệ (Tất cả · Đồ ăn · Đồ uống · Hot), lưới 3 cột card pastel (ảnh món · tên · tagline ·
// giá xu · nút Đổi quà · nhãn Hot/Mới). Lưới CUỘN NỘI BỘ → cả màn không cuộn. Ảnh món = cắt từ design (nền
// cùng màu card nên liền mạch); icon zip SHOPPING phần lớn cắt lệch, không dùng.
// Luật điểm hiển thị = luật CEO chốt (100 điểm/ngày có việc đạt 100%, trượt về 0, chỉ điểm ĐÃ CHỐT tháng mới
// xài — shop.ts / fn_shop_doi), KHÔNG chép luật "+1 điểm" trong ảnh design.
import { useEffect, useState } from 'react'
import { listVatPham, listDonCuaToi, doiVatPham, type ShopVatPham, type ShopDon } from '../../lib/shop'
import { ddmmVN } from '../../lib/tuan'
import { BKBottomSheet, BKStatusPill } from './BKUI'

const S = (n: string) => `/bk-ui/shop_${n}.png`
// màu card theo vị trí (đo từ design) + màu nút; ảnh món cắt từ đúng card đó nên nền trùng màu
const CARD = [
  { bg: '#FEF3DB', btn: '#FF7FA8' }, { bg: '#F2EDFE', btn: '#A585F5' }, { bg: '#FDEBE8', btn: '#FF8A4D' },
  { bg: '#DAFAE7', btn: '#3ECF82' }, { bg: '#FEECF7', btn: '#FF6B95' }, { bg: '#D7EFFD', btn: '#3B8BF6' },
]
const TT: Record<ShopDon['trang_thai'], { ten: string; st: 'cho' | 'dat' | 'nguy' }> = { cho_giao: { ten: 'Chờ giao', st: 'cho' }, da_giao: { ten: 'Đã giao', st: 'dat' }, huy: { ten: 'Đã huỷ', st: 'nguy' } }
type Tab = 'tatca' | 'do_an' | 'do_uong' | 'hot'
const TABS: { key: Tab; ten: string }[] = [{ key: 'tatca', ten: 'Tất cả' }, { key: 'do_an', ten: 'Đồ ăn' }, { key: 'do_uong', ten: 'Đồ uống' }, { key: 'hot', ten: 'Hot' }]

export function ShopScreen({ xaiDuoc, diemThang, chuoi, diemMoiNgay, onChanged }: { xaiDuoc: number; diemThang: number; chuoi: number; diemMoiNgay: number; onChanged: () => void }) {
  const [items, setItems] = useState<ShopVatPham[] | null>(null)
  const [don, setDon] = useState<ShopDon[]>([])
  const [tab, setTab] = useState<Tab>('tatca')
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
  // lọc theo tab đang mở — filter UI thuần trên list đã fetch
  const hien = (items ?? []).filter((v) => tab === 'tatca' || (tab === 'hot' ? v.nhan === 'hot' : v.loai === tab))

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      {/* hàng 3 ô: điểm xài được · chuỗi · cố lên (đúng ảnh gốc) */}
      <div className="grid grid-cols-[1.1fr_1.2fr_auto] gap-1 rounded-[20px] bg-white/90 p-1.5">
        <div className="flex items-center gap-1.5 rounded-2xl px-2 py-1.5" style={{ background: '#FEF4E1' }}>
          <img src="/bk-ui/coin_star.png" alt="" className="h-9 w-9 shrink-0 object-contain" draggable={false} />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[9.5px] font-semibold text-[#63709A]">Điểm tích lũy</p>
            <p className="text-[20px] font-extrabold leading-none text-[#16224D]">{xaiDuoc.toLocaleString('vi-VN')}</p>
            <p className="truncate text-[8.5px] text-[#63709A]">+{diemThang.toLocaleString('vi-VN')} tháng này</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl px-2 py-1.5" style={{ background: '#FEF8FB' }}>
          <img src={S('lua')} alt="" className="h-9 w-9 shrink-0 rounded-xl object-cover" draggable={false} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[9.5px] font-semibold text-[#63709A]">Chuỗi hoàn thành</p>
            <p className="text-[18px] font-extrabold leading-none text-[#FF5D78]">{chuoi} <span className="text-[12px] text-[#16224D]">ngày</span></p>
          </div>
          <img src={S('lich')} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover" draggable={false} />
        </div>
        <div className="font-hand flex items-center rounded-2xl px-2 text-center text-[11px] italic leading-tight text-[#1E8A52]" style={{ background: '#E5FBF2' }}>Cố lên<br />TA ơi! ♡</div>
      </div>

      {/* banner quy tắc: robot ôm quà trái · pill tiêu đề + 3 dòng luật · câu chữ tay phải */}
      <div className="relative flex items-center gap-1 overflow-hidden rounded-[20px] px-2 py-1.5" style={{ background: '#DDEEFE' }}>
        <img src={S('robot_qua')} alt="" className="h-[74px] w-[90px] shrink-0 rounded-xl object-cover" draggable={false} />
        <div className="min-w-0 flex-1 leading-tight">
          <span className="font-bubble inline-block rounded-full bg-[#2F73F6] px-2.5 py-0.5 text-[11px] font-bold text-white">Quy tắc đổi quà</span>
          <p className="mt-1 text-[10px] leading-[1.35] text-[#16224D]">
            Ngày có việc xong 100%: <b>+{diemMoiNgay} điểm</b>, liên tiếp thì dồn lên. Trượt 1 ngày → chuỗi về 0. Cuối tháng chốt sổ, chỉ điểm đã chốt mới đổi được.
          </p>
        </div>
        <span className="font-hand shrink-0 -rotate-6 pr-1 text-right text-[10.5px] italic leading-tight text-[#2F73F6]">Làm task<br />Tích điểm<br />Đổi quà xịn! ♡</span>
      </div>

      {/* tab kệ */}
      <div className="flex gap-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 rounded-full py-1.5 text-[11.5px] font-bold transition ${tab === t.key ? 'bg-[#2F73F6] text-white shadow' : 'bg-white/90 text-[#2F73F6]'}`}>{t.ten}</button>
        ))}
      </div>

      {msg && <p className={`rounded-2xl px-3 py-1.5 text-[12px] ${msg.ok ? 'bg-[#E8F9EF] text-[#1E8A52]' : 'bg-[#FFE3EA] text-[#C0355A]'}`}>{msg.text}</p>}

      {/* kệ hàng — cuộn nội bộ */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {items === null ? <p className="py-4 text-center text-[13px] text-[#63709A]">Đang tải…</p>
          : !hien.length ? <p className="rounded-2xl bg-white/80 py-4 text-center text-[12.5px] text-[#63709A]">Kệ này chưa có món nào.</p>
          : (
            <div className="grid grid-cols-3 gap-1">
              {hien.map((v) => {
                const c = CARD[(v.thu_tu - 1 + CARD.length) % CARD.length]
                const du = xaiDuoc >= v.gia_diem
                return (
                  <div key={v.id} className="relative flex flex-col rounded-[18px] p-1.5 text-center" style={{ background: c.bg }}>
                    <span className="pointer-events-none absolute left-2 top-1 text-[11px] text-[#FFD84D]">✦</span>
                    {v.nhan === 'hot' && <span className="absolute right-1.5 top-1.5 rounded-full bg-[#FF5D78] px-1.5 py-px text-[8.5px] font-bold text-white">Hot</span>}
                    {v.nhan === 'moi' && <span className="absolute right-1.5 top-1.5 rounded-full bg-[#FF8FB1] px-1.5 py-px text-[8.5px] font-bold text-white">Mới</span>}
                    {v.anh_url
                      ? <img src={v.anh_url} alt="" className="mx-auto mt-2 h-[68px] w-[72px] rounded-xl object-cover" draggable={false} />
                      : <img src="/bk-ui/shopping_bag_gift.png" alt="" className="mx-auto mt-2 h-[68px] w-[72px] object-contain" draggable={false} />}
                    <p className="mt-1 truncate text-[12px] font-extrabold leading-tight text-[#16224D]">{v.ten}</p>
                    <p className="font-hand line-clamp-2 min-h-[22px] text-[9px] italic leading-[1.2] text-[#63709A]">{v.mo_ta}</p>
                    <p className="mt-0.5 flex items-center justify-center gap-0.5 text-[13px] font-extrabold text-[#16224D]">
                      <img src="/bk-ui/coin_star.png" alt="" className="h-3.5 w-3.5" draggable={false} />{v.gia_diem.toLocaleString('vi-VN')}
                    </p>
                    <button disabled={!du || busy} onClick={() => setXacNhan(v)}
                      className="mt-1 rounded-full py-1 text-[11px] font-extrabold text-white shadow-sm disabled:opacity-45" style={{ background: c.btn }}>
                      {du ? 'Đổi quà' : `Thiếu ${(v.gia_diem - xaiDuoc).toLocaleString('vi-VN')}`}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        {don.length > 0 && (
          <div className="mt-1 rounded-[18px] bg-white/90 px-2.5 py-2">
            <p className="font-bubble text-[12.5px] font-extrabold text-[#16224D]">🧾 Đơn của tôi</p>
            <div className="flex flex-col divide-y divide-[#EEF3FF]">
              {don.map((d) => (
                <div key={d.id} className="flex items-center gap-2 py-1.5">
                  <span className="min-w-0 flex-1 truncate text-[12px] font-bold text-[#16224D]">{d.ten_vat_pham}</span>
                  <span className="text-[10.5px] text-[#63709A]">🪙{d.gia_diem} · {ddmmVN(d.created_at.slice(0, 10))}</span>
                  <BKStatusPill status={TT[d.trang_thai].st}>{TT[d.trang_thai].ten}</BKStatusPill>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BKBottomSheet open={!!xacNhan} onClose={() => setXacNhan(null)}>
        {xacNhan && (
          <div className="text-center">
            {xacNhan.anh_url && <img src={xacNhan.anh_url} alt="" className="mx-auto h-24 w-24 rounded-2xl object-cover" draggable={false} />}
            <p className="font-bubble mt-2 text-[18px] font-extrabold text-[#16224D]">Đổi {xacNhan.ten}?</p>
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
