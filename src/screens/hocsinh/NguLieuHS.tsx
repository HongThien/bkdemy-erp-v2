// Khối NGỮ LIỆU trong màn làm bài của app HS (Thùy 02/10 mở luyện tập Anh): đoạn văn / thông báo / biển báo dùng chung cho nhiều
// câu, chụp kèm câu lúc sinh bài (`bai_test_cau.ngu_lieu`, mig 202610021403). Hiện TRÊN đề. Màu chỉ qua token style (design/STYLE-HS.md).
import { MAU } from './skin/KhungHS'
import { ChuMon } from '../kho/ui'
import type { NguLieuSnap } from '../../lib/testonline'

const TEN_LOAI: Record<string, string> = {
  doan_van: 'Đọc đoạn văn', thong_bao: 'Đọc thông báo', bien_bao: 'Biển báo', tin_nhan: 'Tin nhắn', hoi_thoai: 'Hội thoại', bai_nghe: 'Bài nghe',
}

export function NguLieuHS({ nl, mon, gon }: { nl: NguLieuSnap; mon: string | null | undefined; gon?: boolean }) {
  // Đoạn dài (bài đọc ~1.000–1.500 ký tự) cuộn riêng trong khối để đề + đáp án vẫn nằm trong màn
  const cao = gon ? 'max-h-[30vh]' : 'max-h-[42vh]'
  return (
    <div className="mb-4 p-3" style={{ background: MAU.surface2, border: `1px solid ${MAU.line}`, borderRadius: 'calc(var(--sk-radius) * 0.6)' }}>
      <p className="mb-1.5 text-[15.5px] font-semibold uppercase tracking-wide" style={{ color: MAU.muted }}>{TEN_LOAI[nl.loai] ?? 'Ngữ liệu'}</p>
      {nl.tieu_de && <p className="mb-1.5 text-[20px] font-semibold" style={{ color: MAU.ink }}><ChuMon mon={mon}>{nl.tieu_de}</ChuMon></p>}
      {nl.anh && <img src={nl.anh} alt={TEN_LOAI[nl.loai] ?? 'ngữ liệu'} className="mb-2 max-h-56 w-auto rounded-lg" style={{ border: `1px solid ${MAU.line}` }} />}
      {nl.noi_dung && (
        <div className={`${cao} overflow-y-auto pr-1 text-[18.5px] leading-relaxed`} style={{ color: MAU.ink }}>
          <ChuMon mon={mon}>{nl.noi_dung}</ChuMon>
        </div>
      )}
      {nl.am_thanh && <audio controls src={nl.am_thanh} className="mt-2 w-full" />}
    </div>
  )
}
