// ============================================================================
// LUYỆN DẠNG YẾU trong KHUNG ĐẤU CHUNG (Thùy 06/10: "giao diện câu hỏi cứ chung thôi; setup ở ngoài màn hình chính — tắt thì tắt hết").
// Dùng lại đúng khung của Học theo chủ đề: DauView2D + SanDon2D (nhân vật chính em chọn, đội quái, combo 3 câu = 1 chiêu, boss tạm = boss Thùy) + LamBai nhúng + thẻ kết quả.
// Chỉ khác NGUỒN SINH LƯỢT: lượt đang dở trong ngày (nếu có) hoặc lượt tổng hợp mới (RPC server chọn dạng yếu). "Hiệu ứng game" TẮT hoặc style không có the3d ⇒ KHÔNG dùng
// khung này (HocSinhApp rơi về LamTuLuyen dạng thường). Màn giới thiệu nằm ở GioiThieuYeu.tsx, hiện trước màn này.
// ============================================================================
import { useMemo } from 'react'
import { DauThat, type LamBaiCmp } from '../phieuluu/PhieuLuuHS'
import type { ChangV, LucDiaV } from '../phieuluu/kieu'
import { chonDoiHinh, loaiHopLe } from '../skin/the3d/loai'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import type { NvId } from '../skin/nhanVat'
import { useLoi } from '../skin/KhungHS'
import { luotTuLuyenHomNay, sinhTuLuyen, TU_LUYEN_SO_CAU_MOI_LUOT } from '../../../lib/tuluyen'

export default function LuyenYeuDau({ mon, hocSinhId, nv, b, LamBai, onVe }: {
  mon: string; hocSinhId: string; nv: NvId; b: BangMau3D; LamBai: LamBaiCmp; onVe: () => void
}) {
  const loi = useLoi()
  const ten = loi.yeu.tieuDe
  // Đội hình tạm: 4 quái, quái cuối = boss (boss Thùy). Hạt giống theo môn + ngày giờ máy (chỉ để quái đổi mỗi ngày — không phải số liệu nghiệp vụ).
  const { luc, chang } = useMemo(() => {
    const hat = `yeu-${mon}-${new Date().toDateString()}`
    const quai = chonDoiHinh(hat, 4).map((q, i, a) => (i === a.length - 1 ? q : { ...q, loai: loaiHopLe(q.loai, hat + i) }))
    const chang: ChangV = { ma: 'luyen_yeu', ten, muc_do: 3, trang_thai: 'yeu', mastery: null, da_day: true, so_cum: quai.length, quai, hp: TU_LUYEN_SO_CAU_MOI_LUOT, so_cau_luot: TU_LUYEN_SO_CAU_MOI_LUOT }
    const luc: LucDiaV = { ma: 'yeu', ten, biome: 'rung', vung: [{ ma: 'yeu1', ten, chang: [chang] }] }
    return { luc, chang }
  }, [mon, ten])

  // lượt đang dở trong ngày thì làm tiếp (không sinh thừa lượt mồ côi), không thì sinh lượt mới
  const sinh = async () => {
    const { dangDo } = await luotTuLuyenHomNay(mon)
    if (dangDo) return { baiTestId: dangDo.baiTestId }
    const kq = await sinhTuLuyen(mon)
    return { baiTestId: kq.baiTestId }
  }
  return <DauThat luc={luc} chang={chang} b={b} mon={mon} hocSinhId={hocSinhId} gioi={nv} LamBai={LamBai} onVe={onVe} sinh={sinh} veKhu />
}
