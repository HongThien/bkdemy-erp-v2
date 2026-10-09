// TRANG XEM THỬ ĐẤU TRƯỜNG (hs.html?xem=thu_thach): dữ liệu giả, không gọi DB, không cần đăng nhập. Soi cổng + 3 trận + hoạt cảnh + bỏ cuộc + kết quả.
//   &goi_y=1 đánh dấu đáp án đúng · &luot=0|1|2 số lượt còn hôm nay (mặc định 2) · &dang=3 chưa đủ dạng đã học (khoá) · &gioi=nu|nam|su_tu|cao|ninja|elf (nhân vật chính) · &don=set|thien_thach|cau_lua_lon|cau_bang_lon|cau_lua_nho|cau_bang_nho|dien_nho ép đòn khi thắng
// Luật + việc DB: spec-thu-thach-dau-truong.md. Khi Số liệu có RPC (bắt đầu lượt / nộp trận / bỏ cuộc) thì thay hàm giả ở đây bằng lời gọi thật.
import { useState } from 'react'
import { DauTrangHS, HEAD, MAU, ManHS, NutHS, TheHS } from '../skin/KhungHS'
import { BossAnhHS } from '../boss/BossSan'
import { DauTruongHS } from './DauTruongHS'
import { laNvMoi, type NvId } from '../skin/nhanVat'
import { NGUONG, SO_CAU_TRAN, SO_TRAN, type CauTT } from './kieu'
import { sinhBoCauGia } from './mau'
import type { Don } from './hieuUng'

const TOI_THIEU_DANG = 5 // mặc định spec §2, đổi bằng 1 hằng ở DB
const LUOT_MOI_NGAY = 2

export default function XemThuThach() {
  const q = new URLSearchParams(location.search)
  const soDang = Number(q.get('dang') ?? 12), gG = q.get('gioi'), gioi: NvId = laNvMoi(gG) ? gG : gG === 'nu' ? 'nu' : 'nam' // &gioi=su_tu|cao|ninja|elf: nhân vật chính mới
  const [luotCon, setLuotCon] = useState(Math.min(LUOT_MOI_NGAY, Math.max(0, Number(q.get('luot') ?? LUOT_MOI_NGAY))))
  const [bo, setBo] = useState<CauTT[][] | null>(null)
  const [lan, setLan] = useState(0)

  // Bắt đầu lượt = trừ 1 lượt ngay (kể cả bỏ cuộc) + sinh 15 câu một lần (spec §1.5, §2). Bản thật: RPC server.
  const vao = () => { setBo(sinhBoCauGia(lan + 1)); setLan((n) => n + 1); setLuotCon((n) => Math.max(0, n - 1)) }

  if (bo) {
    return <DauTruongHS key={lan} gioi={gioi} tran={bo} goiY={q.get('goi_y') === '1'} epDon={(q.get('don') as Don | null) ?? undefined} luotConSau={luotCon}
      diem={(kq) => kq.thang.filter(Boolean).length * 10 /* DEMO: server tính thật (10/20/30 — spec §3) */}
      onKetThuc={() => {}} onThuLai={vao} onThoat={() => setBo(null)} />
  }

  const khoa = soDang < TOI_THIEU_DANG ? `Em mới có ${soDang} dạng đã học (cần ≥ ${TOI_THIEU_DANG}, mỗi dạng đo ≥ 3 lần). Học thêm rồi quay lại nhé.`
    : luotCon <= 0 ? 'Hôm nay em đã dùng hết 2 lượt Thử thách môn này. Mai quay lại nhé.' : null
  return (
    <ManHS>
      <DauTrangHS tieuDe="Thử thách" phu="Đấu trường 3 trận" />
      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <TheHS className="flex flex-col items-center justify-end p-3" style={{ minHeight: 260 }}>
          <BossAnhHS ma="boss_thuy" tt="dung" cao={240} />
          <p className="mt-1 text-[14.5px]" style={{ color: MAU.muted }}>Boss đang chờ em ở đấu trường…</p>
        </TheHS>
        <div className="flex flex-col gap-3">
          <TheHS className="flex flex-col gap-2.5 p-4">
            {NGUONG.map((n, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15.5px] font-extrabold" style={{ background: 'var(--sk-acc)', color: 'var(--sk-acc-ink)' }}>{i + 1}</span>
                <p className="flex-1 text-[16.5px]" style={{ color: MAU.ink }}>
                  <b style={HEAD}>Trận {i + 1}</b> · {SO_CAU_TRAN} câu · thắng khi đúng <b>≥ {n}/{SO_CAU_TRAN}</b> ({Math.round(n / SO_CAU_TRAN * 100)}%)
                </p>
              </div>
            ))}
            <ul className="mt-1 list-disc pl-5 text-[14.5px] leading-relaxed" style={{ color: MAU.muted }}>
              <li>Thắng cả {SO_TRAN} trận mới vượt Thử thách. Thua trận nào là dừng luôn.</li>
              <li>Câu lấy từ các dạng em đã học, dễ · vừa · khó theo tỉ lệ 2-2-1.</li>
              <li>Có nút Bỏ cuộc (tính là thua, vẫn mất 1 lượt).</li>
            </ul>
          </TheHS>
          <TheHS className="flex items-center gap-3 p-3.5">
            <span className="text-[14.5px]" style={{ color: MAU.muted }}>Hôm nay còn</span>
            <b className="text-[24px] tabular-nums" style={{ ...HEAD, color: luotCon > 0 ? MAU.acc : MAU.sai }}>{luotCon}/{LUOT_MOI_NGAY}</b>
            <span className="text-[14.5px]" style={{ color: MAU.muted }}>lượt</span>
          </TheHS>
          {khoa && <p className="text-[15px]" style={{ color: MAU.canhBao, textShadow: '0 1px 8px var(--sk-bg)' }}>{khoa}</p>}
          <NutHS onClick={vao} tat={!!khoa} className="!h-12 !text-[18.5px]">Vào đấu trường</NutHS>
        </div>
      </div>
    </ManHS>
  )
}
