// HuongDanCong — TUTORIAL "Chấm công" cho TA (Thùy 14/10: "cần 1 cái tutorial hướng dẫn cho TA làm quen với chức năng này").
// Tự hiện LẦN ĐẦU TA mở màn Chấm công; xem lại bằng nút "Hướng dẫn" trên đầu màn. 6 card, mỗi card MỘT việc trọn vẹn
// (luật 3–6 bước của Thùy 09/10). Mỗi card có hình thu nhỏ vẽ lại ĐÚNG nút/chữ/màu của màn thật (CongTA.tsx) để TA
// nhận ra khi dùng — đổi chữ/màu ở CongTA thì sửa cả ở đây. Nội dung bám spec-cham-cong-ta.md (§1 #3, #9, #23, #25).
// "Đã xem" = cờ per-viewer ở localStorage (tiện ích hiển thị, không phải dữ liệu nghiệp vụ); lỗi storage ⇒ không tự hiện.
import { useState, type ReactNode } from 'react'

const KEY = (ns: string) => `ta_hd_cham_cong_v1_${ns}`
export function daXemHuongDanCong(ns: string): boolean {
  try { return localStorage.getItem(KEY(ns)) === '1' } catch { return true }
}
export function ghiDaXemHuongDanCong(ns: string) {
  try { localStorage.setItem(KEY(ns), '1') } catch { /* chế độ riêng tư: bỏ qua */ }
}

// ── mảnh giao diện thu nhỏ (chỉ để nhìn, không bấm được) ──
const Nut = ({ c, children }: { c: string; children: ReactNode }) => <span className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[12.5px] font-bold ${c}`}>{children}</span>
const Pill = ({ c, children }: { c: string; children: ReactNode }) => <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${c}`}>{children}</span>
const Khung = ({ c = 'bg-white', children }: { c?: string; children: ReactNode }) => <div className={`rounded-[18px] p-2.5 ${c}`}>{children}</div>
const DongViec = ({ ten, gio, phai }: { ten: string; gio: ReactNode; phai: ReactNode }) => (
  <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
    <div className="min-w-0 flex-1 leading-tight"><p className="text-[13.5px] font-bold text-[#16224D]">{ten}</p><p className="text-[11.5px] text-[#63709A]">{gio}</p></div>
    {phai}
  </div>
)
const Mui = () => <span className="text-[18px] font-extrabold text-[#9AA5C4]">→</span>

type Buoc = { tieuDe: string; hinh: ReactNode; y: ReactNode[] }
const BUOC: Buoc[] = [
  {
    tieuDe: 'Chấm công để làm gì?',
    hinh: (
      <Khung c="bg-[#F4F7FE]">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <Nut c="bg-[#1E9E5A] text-white">Checkin</Nut><Mui /><Nut c="bg-[#2F73F6] text-white">Ghi công</Nut><Mui /><Nut c="bg-[#F57C2B] text-white">Checkout</Nut>
        </div>
        <p className="mt-2 text-center text-[12px] font-semibold text-[#63709A]">Trang duyệt mỗi ngày → vào lương tháng</p>
      </Khung>
    ),
    y: [
      <>Mỗi lần đến trung tâm: <b>Checkin</b> khi đến, <b>ghi công</b> những việc bạn làm, <b>Checkout</b> khi về.</>,
      <>Lương tháng được tính từ các ca và việc đã được duyệt — không còn chấm công trên sheet.</>,
      <><b>Chấm BTVN và chấm ET không cần ghi công</b>: hệ thống tự biết bạn chấm bài nào.</>,
    ],
  },
  {
    tieuDe: 'Đến nơi: Checkin',
    hinh: (
      <Khung>
        <p className="font-bubble text-[15px] font-extrabold text-[#16224D]">Hôm nay · Thứ 5 15/10/2026</p>
        <div className="mt-2 w-full rounded-2xl bg-[#1E9E5A] py-3 text-center text-[16px] font-extrabold text-white">Checkin</div>
      </Khung>
    ),
    y: [
      <>Ở màn chính bấm ô <b>Chấm công</b>, vào tab <b>Hôm nay</b>, bấm nút xanh <b>Checkin</b>.</>,
      <>Ô Chấm công ở màn chính chỉ báo bạn đang trong ca hay chưa, không checkin ở đó.</>,
      <>Chấm công theo tài khoản của bạn — iPad hay điện thoại nào cũng được.</>,
    ],
  },
  {
    tieuDe: 'Ghi công việc theo lịch',
    hinh: (
      <Khung c="bg-[#E6F0FF]">
        <p className="font-bubble text-[14px] font-extrabold text-[#16224D]">Việc hôm nay theo lịch</p>
        <div className="mt-1.5 flex flex-col gap-1.5">
          <div className="rounded-2xl ring-2 ring-[#F59E0B]"><DongViec ten="Trợ giảng lớp 6S2" gio={<>18:00–19:30 <b className="ml-1 text-[#C27A00]">Đang diễn ra</b></>} phai={<Nut c="bg-[#2F73F6] text-white">Ghi công</Nut>} /></div>
          <DongViec ten="Trực bổ trợ khối 6" gio="17:00–18:00" phai={<Pill c="bg-[#E4F8EC] text-[#1E8A52]">✓ Đã ghi công</Pill>} />
        </div>
      </Khung>
    ),
    y: [
      <>Sau khi Checkin, hệ thống tự hiện việc hôm nay của bạn: trợ giảng lớp, trực bổ trợ khối, ca bù/yếu/đuổi đã xếp.</>,
      <>Việc đang diễn ra được viền vàng. Làm việc nào thì bấm <b>Ghi công</b> việc đó.</>,
      <>Ghi nhầm thì bấm <b>Bỏ</b> ở mục “Việc đã ghi công” khi việc còn chờ duyệt.</>,
    ],
  },
  {
    tieuDe: 'Việc ngoài lịch: tự thêm',
    hinh: (
      <Khung>
        <Nut c="bg-[#EEF3FF] text-[#3B62C4]">+ Thêm việc ngoài lịch</Nut>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['Dạy hộ lớp khác', 'Trông thi', 'Chữa bài', 'Bổ trợ đặc biệt', 'Họp · Đào tạo', 'Việc khác'].map((t) => <Pill key={t} c="bg-[#F4F7FE] text-[#16224D]">{t}</Pill>)}
        </div>
      </Khung>
    ),
    y: [
      <>Việc không có trong gợi ý thì bấm <b>Thêm việc ngoài lịch</b>, chọn loại việc, lớp, giờ bắt đầu – kết thúc, học sinh nếu có.</>,
      <><b>Dạy hộ lớp khác:</b> chọn đúng lớp bạn đứng. Hệ thống tự biết bạn làm hộ ai, người được hộ không phải khai gì.</>,
      <><b>Việc khác</b> bắt buộc ghi chú để Trang hiểu bạn đã làm gì.</>,
    ],
  },
  {
    tieuDe: 'Về: Checkout — quên thì khai bù',
    hinh: (
      <div className="flex flex-col gap-2">
        <div className="w-full rounded-2xl bg-[#F57C2B] py-3 text-center text-[16px] font-extrabold text-white">Checkout</div>
        <div className="rounded-[18px] bg-[#2F73F6] px-3 py-2.5"><p className="font-bubble text-[15px] font-extrabold text-white">Khai bù ngày trước</p><p className="text-[11.5px] text-white/85">Chọn ngày trên lịch rồi khai ca + ghi công</p></div>
      </div>
    ),
    y: [
      <>Trước khi về bấm nút cam <b>Checkout</b>.</>,
      <>Quên Checkin hoặc Checkout: kéo xuống cuối tab Hôm nay, bấm <b>Khai bù ngày trước</b>, chọn ngày, khai giờ vào – ra rồi ghi công việc ngày đó. Được khai bù <b>trong 24 giờ</b>.</>,
      <>Riêng <b>tháng 10/2026</b> được khai lùi mọi ngày trong tháng tới hết 03/11. Quá hạn thì nhờ Trang nhập hộ.</>,
    ],
  },
  {
    tieuDe: 'Theo dõi bảng công và lương',
    hinh: (
      <Khung c="bg-[#F4F7FE]">
        <div className="flex flex-wrap gap-1.5">
          <Pill c="bg-[#E4F8EC] text-[#1E8A52]">Đã khớp lịch</Pill><Pill c="bg-[#FFF1D6] text-[#C27A00]">Chờ duyệt</Pill>
          <Pill c="bg-[#E4F8EC] text-[#1E8A52]">Đã duyệt</Pill><Pill c="bg-[#FFE4EA] text-[#C0355A]">Từ chối</Pill>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-[#16224D]">
          <span className="rounded-full bg-white px-2.5 py-1">Tạm tính</span><Mui /><span className="rounded-full bg-white px-2.5 py-1 text-[#2E8B57]">Phiếu lương chính thức</span>
        </div>
      </Khung>
    ),
    y: [
      <>Tab <b>Bảng công</b>: mỗi việc hiện trạng thái. <b>Đã khớp lịch</b> nghĩa là hệ thống thấy việc đó trên lịch; <b>Từ chối</b> luôn kèm lý do của Trang. Khai nhầm thì bấm <b>Sửa</b> ngay trên dòng đó (khi còn Chờ duyệt).</>,
      <>Tab <b>Lương</b>: tạm tính, chỉ gồm phần đã duyệt. Sau ngày 3 tháng sau quản lý chốt kỳ, tab hiện <b>Phiếu lương chính thức</b> và công tháng đó không sửa được nữa.</>,
      <>Thấy sai thì báo Trang sớm, trước khi chốt kỳ.</>,
    ],
  },
]

export default function HuongDanCong({ onXong }: { onXong: () => void }) {
  const [i, setI] = useState(0)
  const b = BUOC[i], cuoi = i === BUOC.length - 1
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#16224D]/45 p-2 sm:items-center" role="dialog" aria-modal="true" aria-label="Hướng dẫn chấm công">
      <div className="flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-[26px] bg-white shadow-xl">
        <div className="flex items-center gap-2 px-4 pt-3">
          <p className="text-[12px] font-bold uppercase tracking-wide text-[#63709A]">Hướng dẫn chấm công · {i + 1}/{BUOC.length}</p>
          <button onClick={onXong} className="ml-auto rounded-full px-2.5 py-1 text-[12.5px] font-semibold text-[#63709A] active:bg-[#F4F7FE]">Bỏ qua</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2 pt-1">
          <p className="font-bubble text-[21px] font-extrabold leading-tight text-[#16224D]">{b.tieuDe}</p>
          <div className="mt-2.5">{b.hinh}</div>
          <ul className="mt-3 flex flex-col gap-2">
            {b.y.map((t, k) => (
              <li key={k} className="flex gap-2 text-[14px] leading-snug text-[#26325C]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2F73F6]" /><span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 border-t border-[#EEF1F8] px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <div className="flex gap-1.5" aria-hidden>
            {BUOC.map((_, k) => <span key={k} className={`h-2 rounded-full transition-all ${k === i ? 'w-5 bg-[#2F73F6]' : 'w-2 bg-[#D6DEF0]'}`} />)}
          </div>
          {i > 0 && <button onClick={() => setI(i - 1)} className="ml-auto rounded-full border border-[#D6DEF0] px-4 py-2 text-[14px] font-bold text-[#16224D] active:scale-[.98]">Quay lại</button>}
          <button onClick={() => (cuoi ? onXong() : setI(i + 1))}
            className={`${i > 0 ? '' : 'ml-auto'} rounded-full bg-[#2F73F6] px-5 py-2 text-[14px] font-extrabold text-white active:scale-[.98]`}>
            {cuoi ? 'Bắt đầu chấm công' : 'Tiếp'}
          </button>
        </div>
      </div>
    </div>
  )
}
