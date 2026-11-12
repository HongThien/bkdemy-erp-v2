// BẢN IN bổ trợ sau giờ = ĐÚNG khuôn ET (Thùy 11/11: "header giống ET, không ghi tên dạng, chỉ Câu 1 Câu 2, bản HS riêng – GV riêng
// giống builder bình thường, đừng làm khác cho phức tạp"). Chỉ đổi câu snapshot của bai_test thành CauHoi rồi đưa vào ETPrintView.
import ETPrintView, { type DeRiengET } from '../tailieu/ETPrintView'
import type { BaiInGiay } from '../../lib/botro_yeu_ca'
import type { CauHoi } from '../../lib/kho/api'
import type { TaiLieuFull } from '../../lib/tailieu'

const chuoi = (v: unknown) => (v == null ? null : typeof v === 'string' ? v : JSON.stringify(v).replace(/^"|"$/g, ''))
function sangCauHoi(k: BaiInGiay['caus'][number], bai: BaiInGiay): CauHoi {
  return {
    ma_cau: k.ma_cau ?? `${bai.bai_test_id}:${k.thu_tu}`, loai_cau: k.loai_cau ?? ((k.lua_chon ?? []).length ? 'trac_nghiem' : 'tra_loi_ngan'), noi_dung: k.noi_dung, lua_chon: k.lua_chon ?? null,
    dap_an: chuoi(k.dap_an_key), loi_giai: k.loi_giai ?? null, anh_de: k.anh_de ?? null, menh_de: null, dang_chinh: k.ma_dang,
  } as unknown as CauHoi
}
const ddmmyyyy = (d: string) => d.split('-').reverse().join('/')

export default function InSauGioET({ bais, lop, onDong }: { bais: BaiInGiay[]; lop?: string | null; onDong: () => void }) {
  const dau = bais[0]
  const test = dau.loai === 'bo_tro_test'
  const full = {
    taiLieu: { id: 'sau-gio-' + dau.bai_test_id, ten: `ET ${lop ?? ''} · ${ddmmyyyy(dau.ngay)}`, mon: dau.mon, nhanh: null, cau_hinh: {}, ban_do: null, lop_id: null, ngay: null, khoi: dau.hs.khoi },
    phans: [], ltChuyenDe: {}, tenChuyenDe: {},
  } as unknown as TaiLieuFull
  const deRieng: DeRiengET[] = bais.map((b) => ({ id: b.bai_test_id, hoTen: b.hs.ho_ten, caus: b.caus.map((k) => sangCauHoi(k, b)), ch: (b.cau_hinh_in ?? undefined) as DeRiengET['ch'] }))
  return (
    <ETPrintView id={full.taiLieu.id} onClose={onDong} fullOverride={full} deRieng={deRieng}
      nhanDe={test ? { tieuDe: 'Bài kiểm tra bổ trợ sau giờ', nhan: 'Bài test bổ trợ' } : { tieuDe: 'Phiếu luyện bổ trợ sau giờ', nhan: 'Bài luyện bổ trợ' }} />
  )
}
