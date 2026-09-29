// ============================================================================
// BÁO CÁO NGÀY — phần CHÍNH của trợ lý (CEO 29/09: "hỏi là phụ, tính năng chính vẫn là báo cáo.
// Báo cáo đầy đủ dữ liệu cần thì gần như không cần hỏi lại nữa").
//
// Bố cục bám ĐÚNG mẫu CEO gửi: bảng 2 cột (mục | nội dung), mỗi mục là vài CÂU đếm + các
// checklist có tên học sinh. Màn này KHÔNG tính gì: mọi số đến từ `fn_troly_bao_cao_ngay`,
// ở đây chỉ ghép thành câu và đếm phần tử đang hiển thị.
//
// Dòng nào của mẫu mà hệ chưa có nguồn dữ liệu thì hiện khối vàng "CHƯA CÓ NGUỒN" kèm lý do —
// không ẩn đi (người đọc sẽ tưởng mục đó ổn), không bịa số.
// ============================================================================
import { useEffect, useState, type ReactNode } from 'react'
import {
  getBaoCaoNgay, homNayVN, congNgay, ddmm,
  type BaoCaoNgay as BC, type MucKhau, type ChuaCoNguon, type GomCaYeu, type KetQuaCaYeu, type TinhTrangBu,
} from '../../lib/troly-baocao'

// Rời tab rồi quay lại = đúng ngày đang xem, không quét lại (CLAUDE.md §2 React). Sống tới F5.
const NHO: { ngay: string | null; bc: BC | null } = { ngay: null, bc: null }

const ds = (a: string[]) => a.join(', ')

// ── Mảnh ghép hiển thị ──────────────────────────────────────────────────────
function Dong({ children, mau }: { children: ReactNode; mau?: 'do' | 'xanh' | 'xam' }) {
  const c = mau === 'do' ? 'text-rose-700' : mau === 'xanh' ? 'text-emerald-700' : mau === 'xam' ? 'text-slate-400' : 'text-slate-700'
  return <div className={`flex gap-1.5 text-[13px] leading-relaxed ${c}`}><span className="shrink-0 text-slate-400">–</span><div className="min-w-0 flex-1">{children}</div></div>
}
const B = ({ children }: { children: ReactNode }) => <b className="font-semibold text-slate-900">{children}</b>
const Lop = ({ a }: { a: string[] }) => (a.length ? <span className="text-slate-500"> ({ds(a)})</span> : null)

function ThieuNguon({ d, ten }: { d: ChuaCoNguon; ten: string }) {
  return (
    <div className="mt-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12.5px] leading-relaxed text-amber-800">
      <b className="font-semibold">Chưa có nguồn dữ liệu — {ten}.</b> {d.ly_do}
    </div>
  )
}

// Checklist gập/mở. Mở sẵn khi có phần tử: báo cáo là để ĐỌC, bắt bấm mới thấy tên thì dễ bỏ sót.
function Checklist({ ten, so, chuThich, children }: { ten: string; so: number; chuThich?: string; children?: ReactNode }) {
  const [mo, setMo] = useState(so > 0 && so <= 12)
  return (
    <div className="mt-1">
      <button onClick={() => so > 0 && setMo((x) => !x)} disabled={so === 0}
        className="flex w-full items-baseline gap-1.5 text-left text-[13px] leading-relaxed">
        <span className="shrink-0 text-slate-400">–</span>
        <span className="text-slate-700">{ten}: </span>
        <span className={`font-semibold tabular-nums ${so > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{so > 0 ? so : 'không có'}</span>
        {so > 0 && <span className="text-[12px] font-medium text-indigo-600">{mo ? 'thu gọn' : 'xem'}</span>}
      </button>
      {chuThich && <div className="ml-4 text-[11.5px] leading-relaxed text-slate-400">{chuThich}</div>}
      {mo && so > 0 && <div className="ml-4 mt-1 space-y-0.5 rounded-lg bg-slate-50 px-2.5 py-1.5">{children}</div>}
    </div>
  )
}
const Hs = ({ ten, lop, children }: { ten: string; lop?: string | null; children?: ReactNode }) => (
  <div className="flex flex-wrap items-baseline gap-x-2 text-[12.5px]">
    <span className="font-medium text-slate-800">{ten}</span>
    {lop && <span className="text-slate-500">{lop}</span>}
    <span className="text-slate-600">{children}</span>
  </div>
)

function Muc({ ten, children }: { ten: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 border-t border-slate-200 first:border-t-0 sm:grid-cols-[150px_1fr]">
      <div className="bg-slate-50 px-3 py-2.5 text-[13px] font-semibold text-slate-800">{ten}</div>
      <div className="space-y-0.5 px-3 py-2.5">{children}</div>
    </div>
  )
}

// ── ET · đánh giá trong buổi · đánh giá sau buổi: cùng MỘT khuôn câu ────────────
function CauKhau({ m, tenDe, tenKhongDe }: { m: MucKhau; tenDe?: string; tenKhongDe?: string }) {
  const t = m.tom_tat
  const khongHopLe = m.lop.filter((l) => l.tinh_trang === 'dong_ma_trong' || (l.hs_co_du_lieu > 0 && l.hs_thieu.length > 0))
  return (
    <>
      {tenDe && (
        <Dong>{tenDe} <B>{t.co_de}/{t.so_lop}</B> lớp
          {t.lop_khong_co_de.length > 0 && <>, <B>{t.lop_khong_co_de.length}</B> lớp {tenKhongDe}<Lop a={t.lop_khong_co_de} /></>}.
        </Dong>
      )}
      <Dong>
        Đã có dữ liệu <B>{t.co_du_lieu}/{t.so_lop}</B> lớp
        {t.lop_trong.length > 0 && <>, <B>{t.lop_trong.length}</B> lớp trống<Lop a={t.lop_trong} /></>}
        {t.lop_co_du_lieu_chua_dong.length > 0 && <>, <B>{t.lop_co_du_lieu_chua_dong.length}</B> lớp có dữ liệu nhưng chưa đóng task<Lop a={t.lop_co_du_lieu_chua_dong} /></>}
        {t.lop_dong_muon.length > 0 && <>, <B>{t.lop_dong_muon.length}</B> lớp đóng muộn<Lop a={t.lop_dong_muon} /></>}
        {t.lop_qua_han_chua_dong.length > 0 && <>, <span className="text-rose-700"><B>{t.lop_qua_han_chua_dong.length}</B> lớp quá hạn chưa đóng</span><Lop a={t.lop_qua_han_chua_dong} /></>}.
      </Dong>
      {t.lop_khong_nhan_xet.length > 0 && (
        <Dong>Có dòng đánh giá nhưng <B>không có nhận xét nào</B>: {ds(t.lop_khong_nhan_xet)}.</Dong>
      )}
      <Checklist ten="Task không hợp lệ (bấm đóng mà trống dữ liệu, hoặc còn em có mặt chưa có dòng nào)" so={khongHopLe.length}>
        {khongHopLe.map((l) => (
          <Hs key={l.ten_lop} ten={l.ten_lop}>
            {l.tinh_trang === 'dong_ma_trong'
              ? `đã đóng lúc ${l.dong_luc ?? '?'} nhưng không có dòng dữ liệu nào (${l.so_co_mat} em có mặt)`
              : `${l.hs_co_du_lieu}/${l.so_co_mat} em có dữ liệu — thiếu: ${ds(l.hs_thieu)}`}
          </Hs>
        ))}
      </Checklist>
    </>
  )
}

const NHAN_CA: Record<KetQuaCaYeu, string> = {
  hop_le: 'hợp lệ', khong_hop_le_khong_test: 'không hợp lệ — không làm test cuối ca',
  co_mat_chua_dong_ca: 'em có mặt nhưng TA chưa đóng ca', huy_hs_khong_den: 'huỷ — học sinh không đến',
  huy_khac: 'huỷ — lý do khác', vang_chua_huy: 'vắng, ca chưa huỷ', qua_ngay_khong_dien_ra: 'quá ngày, không diễn ra',
  cho_hoc: 'chờ học',
}
function CauCa({ g, nhan }: { g: GomCaYeu; nhan: string }) {
  if (g.so_luot_da_xep === 0) return <Dong mau="xam">{nhan}: không có ca nào được xếp.</Dong>
  const luot = g.luot ?? []
  return (
    <>
      <Dong>
        {nhan}: xếp <B>{g.so_luot_da_xep}</B> lượt ({g.so_ca} ca) — đã chạy <B>{g.da_chay}</B>
        , hợp lệ <B>{g.hop_le}</B>
        , không hợp lệ do không làm test <B>{g.khong_hop_le_khong_test}</B>
        , huỷ do học sinh không đến <B>{g.huy_hs_khong_den}</B>
        {g.huy_khac > 0 && <>, huỷ lý do khác <B>{g.huy_khac}</B></>}
        {g.co_mat_chua_dong_ca > 0 && <>, <span className="text-rose-700">TA chưa đóng ca <B>{g.co_mat_chua_dong_ca}</B></span></>}
        {g.qua_ngay_khong_dien_ra + g.vang_chua_huy > 0 && <>, không diễn ra mà chưa huỷ <B>{g.qua_ngay_khong_dien_ra + g.vang_chua_huy}</B></>}
        {g.cho_hoc > 0 && <>, chờ học <B>{g.cho_hoc}</B></>}.
      </Dong>
      {luot.length > 0 && (
        <Checklist ten="Từng lượt" so={luot.length}>
          {luot.map((l, i) => (
            <Hs key={i} ten={l.ho_ten} lop={l.ten_lop}>
              {l.gio ?? '—'} · {l.nguoi_day ?? 'chưa có người đứng ca'} · <span className={l.ket_qua === 'hop_le' ? 'text-emerald-700' : l.ket_qua === 'cho_hoc' ? 'text-slate-500' : 'text-rose-700'}>{NHAN_CA[l.ket_qua]}</span>
              {l.ly_do_huy && <span className="text-slate-400"> — {l.ly_do_huy}</span>}
            </Hs>
          ))}
        </Checklist>
      )}
    </>
  )
}

const NHAN_BU: Record<TinhTrangBu, string> = {
  chua_xep: 'chưa xếp bù', da_xep_chua_hoc: 'đã xếp, chưa học', da_xep_nhung_truot: 'đã xếp nhưng trượt',
  da_hoc_bu: 'đã học bù', khong_bu: 'đã ghi không bù',
}
const NHAN_THAI_DO: Record<string, string> = {
  nghiem_tuc: 'nghiêm túc', chua_het_suc: 'chưa hết sức', chua_nghiem_tuc: 'chưa nghiêm túc', chong_doi: 'chống đối',
}
const NHAN_BUOC: Record<string, string> = {
  cho_noi_dung: 'chờ chọn dạng', can_xep: 'cần xếp lịch', da_xep: 'đã xếp, chờ học',
  cho_retest: 'chờ retest', cho_danh_gia: 'chờ đánh giá ca',
}

export default function BaoCaoNgay() {
  const homNay = homNayVN()
  const [ngay, setNgay] = useState<string>(NHO.ngay ?? congNgay(homNay, -1))
  const [bc, setBc] = useState<BC | null>(NHO.ngay === ngay ? NHO.bc : null)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  async function tai(n: string, ep = false) {
    if (!ep && NHO.ngay === n && NHO.bc) { setBc(NHO.bc); return }
    setLoi(null); setDangTai(true)
    try {
      const d = await getBaoCaoNgay(n)
      NHO.ngay = n; NHO.bc = d
      setBc(d)
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
    finally { setDangTai(false) }
  }
  // Đổi NGÀY = đổi ngữ cảnh ⇒ xoá báo cáo cũ rồi tải (để số của ngày trước không đứng dưới tiêu đề ngày mới).
  useEffect(() => { if (NHO.ngay !== ngay) setBc(null); tai(ngay) }, [ngay]) // eslint-disable-line

  return (
    <div>
      {/* Thanh chọn ngày */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={() => setNgay(congNgay(ngay, -1))}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">‹ Ngày trước</button>
        <input type="date" value={ngay} max={homNay} onChange={(e) => e.target.value && setNgay(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-slate-800 outline-none focus:border-indigo-400" />
        <button onClick={() => setNgay(congNgay(ngay, 1))} disabled={ngay >= homNay}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40">Ngày sau ›</button>
        {ngay !== homNay && (
          <button onClick={() => setNgay(homNay)} className="text-[12.5px] font-medium text-indigo-600 hover:underline">hôm nay</button>
        )}
        <button onClick={() => tai(ngay, true)} disabled={dangTai}
          className="ml-auto rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40">↻ Tính lại</button>
      </div>

      {loi && <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">Lỗi: {loi}</div>}
      {!bc && dangTai && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-400">Đang tính báo cáo…</div>}

      {bc && <BanBaoCao bc={bc} mo={dangTai} />}
    </div>
  )
}

// Phần TRÌNH BÀY, tách khỏi phần tải: nhận nguyên JSON của `fn_troly_bao_cao_ngay` rồi vẽ.
// Tách để dựng thử được bằng dữ liệu thật mà không cần đăng nhập (xem scripts/check-troly-cong-cu.mjs --bao-cao).
export function BanBaoCao({ bc, mo }: { bc: BC; mo?: boolean }) {
  const y = bc.bo_tro_yeu
  const t = bc.bo_tro_tuan
  const bu = bc.bo_tro_bu
  return (
        <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${mo ? 'opacity-60' : ''}`}>
          <div className="border-b border-slate-200 bg-indigo-50/60 px-3 py-2.5">
            <div className="text-[15px] font-semibold text-slate-900">
              {bc.thu} {ddmm(bc.ngay)} <span className="font-normal text-slate-500">({bc.da_dien_ra ? 'đã diễn ra' : 'đang diễn ra — số còn đổi'})</span>
            </div>
            <div className="mt-0.5 text-[12.5px] text-slate-600">
              {bc.buoi.so_lop_co_buoi} lớp có buổi học: {bc.buoi.so_lop_co_buoi ? ds(bc.buoi.lop) : '—'}
              <span className="text-slate-400"> · tính lúc {bc.tao_luc}</span>
            </div>
            {bc.lop_co_lich_khong_co_buoi.length > 0 && (
              <div className="mt-0.5 text-[12.5px] text-rose-700">
                Có lịch nhưng không có buổi: {bc.lop_co_lich_khong_co_buoi.map((l) => `${l.ten_lop} ${l.gio}${l.bi_huy ? ' (đã huỷ)' : ' (chưa mở)'}`).join(', ')}
              </div>
            )}
          </div>

          {bc.buoi.so_lop_co_buoi === 0 ? (
            <div className="px-3 py-3 text-[13px] text-slate-500">Ngày này không có buổi học thường nào — các mục BTVN / ET / đánh giá để trống.</div>
          ) : (
            <>
              {/* ── BTVN ── */}
              <Muc ten="BTVN">
                <Dong>
                  Đã có dữ liệu của <B>{bc.btvn.tom_tat.co_du_lieu}/{bc.btvn.tom_tat.so_lop}</B> lớp
                  {bc.btvn.tom_tat.lop_co_du_lieu_chua_dong.length > 0 && <>. <B>{bc.btvn.tom_tat.lop_co_du_lieu_chua_dong.length}</B> lớp đã có dữ liệu nhưng chưa đóng task<Lop a={bc.btvn.tom_tat.lop_co_du_lieu_chua_dong} /></>}
                  {bc.btvn.tom_tat.lop_khong_gan_btvn.length > 0 && <>. <B>{bc.btvn.tom_tat.lop_khong_gan_btvn.length}</B> lớp không được gán BTVN<Lop a={bc.btvn.tom_tat.lop_khong_gan_btvn} /></>}
                  {bc.btvn.tom_tat.lop_trong.length > 0 && <>. <B>{bc.btvn.tom_tat.lop_trong.length}</B> lớp chưa có dữ liệu<Lop a={bc.btvn.tom_tat.lop_trong} /></>}
                  {bc.btvn.tom_tat.lop_dong_ma_trong.length > 0 && <>. <B>{bc.btvn.tom_tat.lop_dong_ma_trong.length}</B> lớp bấm đóng mà trống<Lop a={bc.btvn.tom_tat.lop_dong_ma_trong} /></>}
                  . <B>{bc.btvn.tom_tat.lop_dong_muon.length}</B> task bị đóng muộn<Lop a={bc.btvn.tom_tat.lop_dong_muon} />
                  {bc.btvn.tom_tat.lop_qua_han_chua_dong.length > 0 && <>. <span className="text-rose-700"><B>{bc.btvn.tom_tat.lop_qua_han_chua_dong.length}</B> task quá hạn chưa đóng</span><Lop a={bc.btvn.tom_tat.lop_qua_han_chua_dong} /></>}.
                </Dong>
                <div className="ml-4 text-[11.5px] text-slate-400">
                  Bài giao ở buổi trước của từng lớp ({bc.btvn.lop.filter((l) => l.buoi_giao).map((l) => `${l.ten_lop} ${ddmm(l.buoi_giao)}`).join(' · ')}), đến hạn nhập vào ngày {ddmm(bc.ngay)}.
                </div>
                <Checklist ten="Task BTVN đã đóng nhưng chi tiết không hợp lệ" so={bc.btvn.lop.filter((l) => l.khong_hop_le).length}>
                  {bc.btvn.lop.filter((l) => l.khong_hop_le).map((l) => (
                    <div key={l.ten_lop} className="text-[12.5px]">
                      <span className="font-medium text-slate-800">{l.ten_lop}</span>
                      {l.hs_bo_trong.length > 0 && <div className="ml-3 text-slate-600">bỏ trống dữ liệu: {ds(l.hs_bo_trong)}</div>}
                      {l.hs_thieu_trang_thai_nop.length > 0 && <div className="ml-3 text-slate-600">chưa tick trạng thái nộp: {ds(l.hs_thieu_trang_thai_nop)}</div>}
                      {l.hs_thieu_thai_do.length > 0 && <div className="ml-3 text-slate-600">chưa tick thái độ: {ds(l.hs_thieu_thai_do)}</div>}
                      {l.hs_nop_ma_khong_co_diem.length > 0 && <div className="ml-3 text-slate-600">ghi đã nộp nhưng không có điểm câu nào: {ds(l.hs_nop_ma_khong_co_diem)}</div>}
                    </div>
                  ))}
                </Checklist>
                <Checklist ten="Học sinh không làm BTVN" so={bc.btvn.khong_lam.length} chuThich="Số lần đếm trong 30 ngày, cùng môn.">
                  {bc.btvn.khong_lam.map((h, i) => (
                    <Hs key={i} ten={h.ho_ten} lop={h.ten_lop}>
                      không làm <b className="text-rose-700">{h.so_lan_khong_lam}/{h.so_bai_da_ghi}</b> bài
                      {h.thai_do && <> · thái độ: {NHAN_THAI_DO[h.thai_do] ?? h.thai_do}</>}
                      {h.so_chuong_btvn > 0 && <> · đã bị bấm chuông {h.so_chuong_btvn} lần</>}
                      {h.dang_bo_tro_yeu && <> · đang bổ trợ yếu</>}
                    </Hs>
                  ))}
                </Checklist>
                <ThieuNguon d={bc.btvn.tac_dong} ten="đã tác động đến đâu" />
                <Checklist ten="Học sinh có vấn đề về thái độ làm bài / điểm BTVN thấp hơn hẳn lớp" so={bc.btvn.co_van_de.length} chuThich={`Ngưỡng: ${bc.btvn.nguong}.`}>
                  {bc.btvn.co_van_de.map((h, i) => (
                    <Hs key={i} ten={h.ho_ten} lop={h.ten_lop}>
                      {h.vi.includes('diem_thap') && <>điểm <b className="text-rose-700">{h.diem_pct}%</b> (lớp TB {h.tb_lop_pct}%)</>}
                      {h.vi.length === 2 && ' · '}
                      {h.vi.includes('thai_do') && <>thái độ <b className="text-rose-700">{NHAN_THAI_DO[h.thai_do ?? ''] ?? h.thai_do}</b></>}
                    </Hs>
                  ))}
                </Checklist>
              </Muc>

              {/* ── ET ── */}
              <Muc ten="ET">
                <CauKhau m={bc.et} tenDe="Chạy ET" tenKhongDe="chưa có đề ET" />
                <Checklist ten="Học sinh ET báo động" so={bc.et.bao_dong.hoc_sinh.length}
                  chuThich={`Ngưỡng: ${bc.et.bao_dong.nguong}.${bc.et.bao_dong.lop_chua_xet_duoc.length ? ` Chưa xét được (ET chưa đóng hoặc không có): ${ds(bc.et.bao_dong.lop_chua_xet_duoc)}.` : ''}`}>
                  {bc.et.bao_dong.hoc_sinh.map((h, i) => (
                    <Hs key={i} ten={h.ho_ten} lop={h.ten_lop}>điểm <b className="text-rose-700">{h.diem_pct}%</b> (lớp TB {h.tb_lop_pct}%)</Hs>
                  ))}
                </Checklist>
              </Muc>

              {/* ── Đánh giá trong buổi ── */}
              <Muc ten="Đánh giá trong buổi học">
                <CauKhau m={bc.trong_buoi} tenDe="Có bài chấm trên lớp ở" tenKhongDe="không có bài trên lớp" />
                <ThieuNguon d={bc.trong_buoi.hs_lam_cham} ten="học sinh làm bài chậm hơn nhiều so với lớp" />
              </Muc>

              {/* ── Đánh giá sau buổi ── */}
              <Muc ten="Đánh giá sau buổi học">
                <CauKhau m={bc.sau_buoi} />
                <Checklist ten="Học sinh bị báo động qua đánh giá của GV" so={bc.sau_buoi.bao_dong.hoc_sinh.length} chuThich={`Ngưỡng: ${bc.sau_buoi.bao_dong.nguong}.`}>
                  {bc.sau_buoi.bao_dong.hoc_sinh.map((h, i) => (
                    <Hs key={i} ten={h.ho_ten} lop={h.ten_lop}>
                      {h.muc && <>mức <b className="text-rose-700">{h.muc}</b></>}{h.gv_bam_chuong && ' · GV bấm chuông'}
                      {h.nhan_xet && <span className="text-slate-500"> — {h.nhan_xet}</span>}
                    </Hs>
                  ))}
                </Checklist>
              </Muc>
            </>
          )}

          {/* ── Bổ trợ bù ── */}
          {bu && (
            <Muc ten="Bổ trợ bù">
              <Dong>
                Vắng trong ngày: <B>{bu.vang_trong_ngay.so_luot}</B> lượt
                {bu.vang_trong_ngay.so_luot > 0 && <> — {Object.entries(bu.vang_trong_ngay.theo_tinh_trang).map(([k, v]) => `${NHAN_BU[k as TinhTrangBu] ?? k} ${v}`).join(', ')}</>}.
              </Dong>
              <Dong>
                Buổi bù diễn ra trong ngày: <B>{bu.buoi_bu_trong_ngay.so_luot}</B> lượt — có mặt <B>{bu.buoi_bu_trong_ngay.co_mat}</B>, vắng <B>{bu.buoi_bu_trong_ngay.vang}</B>
                {bu.buoi_bu_trong_ngay.chua_diem_danh > 0 && <>, chưa điểm danh <B>{bu.buoi_bu_trong_ngay.chua_diem_danh}</B></>}
                {bu.buoi_bu_trong_ngay.bi_huy > 0 && <>, bị huỷ <B>{bu.buoi_bu_trong_ngay.bi_huy}</B></>}
                {bu.buoi_bu_trong_ngay.co_mat_chua_dong_ho_so > 0 && <>, <span className="text-rose-700">học rồi nhưng hồ sơ còn khuyết <B>{bu.buoi_bu_trong_ngay.co_mat_chua_dong_ho_so}</B></span></>}.
              </Dong>
              <Dong>
                14 ngày gần nhất: <B>{bu.ton_14_ngay.so_luot_vang}</B> lượt vắng — đã học bù {bu.ton_14_ngay.da_hoc_bu}, đã xếp chờ học {bu.ton_14_ngay.da_xep_chua_hoc}, ghi không bù {bu.ton_14_ngay.khong_bu},
                {' '}<span className="text-rose-700">chưa xếp <B>{bu.ton_14_ngay.chua_xep}</B> (quá 48h: <B>{bu.ton_14_ngay.chua_xep_qua_48h}</B>)</span>
                {bu.ton_14_ngay.da_xep_nhung_truot > 0 && <>, đã xếp nhưng trượt <B>{bu.ton_14_ngay.da_xep_nhung_truot}</B></>}.
              </Dong>
              <Checklist ten="Lượt vắng còn phải xếp bù" so={bu.ton_14_ngay.can_xu_ly.length}>
                {bu.ton_14_ngay.can_xu_ly.map((h, i) => (
                  <Hs key={i} ten={h.ho_ten} lop={h.ten_lop}>vắng {ddmm(h.ngay_vang)} · {h.so_ngay} ngày · {NHAN_BU[h.tinh_trang]}</Hs>
                ))}
              </Checklist>
              <div className="ml-4 text-[11.5px] text-slate-400">{bu.ghi_chu}</div>
            </Muc>
          )}

          {/* ── Bổ trợ yếu ── */}
          {y && (
            <Muc ten="Bổ trợ yếu">
              <Dong>
                Ngày {ddmm(bc.ngay)} có <B>{y.ca_trong_ngay.so_luot_da_xep - y.ca_trong_ngay.huy_hs_khong_den - y.ca_trong_ngay.huy_khac}</B> lượt bổ trợ yếu ({y.ca_trong_ngay.so_ca} ca), <B>{y.retest_trong_ngay.so_bai}</B> bài retest{y.retest_trong_ngay.so_bai > 0 && <> (đã nộp {y.retest_trong_ngay.da_nop})</>}.
              </Dong>
              <CauCa g={y.ca_ngay_truoc} nhan={`Ca của ngày trước (${ddmm(y.ca_ngay_truoc.tu)})`} />
              <CauCa g={y.ca_trong_ngay} nhan={`Ca của ngày ${ddmm(bc.ngay)}`} />
              <Checklist ten="Retest quá hạn chưa làm" so={y.retest_qua_han.hoc_sinh.length}>
                {y.retest_qua_han.hoc_sinh.map((h, i) => (
                  <Hs key={i} ten={h.ho_ten} lop={h.ten_lop}>hẹn {ddmm(h.ngay_hen)} · trễ {h.tre_ngay} ngày</Hs>
                ))}
              </Checklist>
              <Dong>
                Duyệt 3 ngày gần nhất ({ddmm(y.duyet_3_ngay.tu)}–{ddmm(y.duyet_3_ngay.den)}): <B>{y.duyet_3_ngay.so_luot_duyet}</B> lượt đã duyệt
                {y.duyet_3_ngay.so_luot_duyet > 0 && <> — máy đề xuất bổ trợ {y.duyet_3_ngay.may_de_xuat_bo_tro}, chốt bổ trợ <B>{y.duyet_3_ngay.chot_bo_tro}</B>, chốt không bổ trợ {y.duyet_3_ngay.chot_khong_bo_tro}
                  {' '}({y.duyet_3_ngay.theo_ngay.map((d) => `${ddmm(d.ngay)}: ${d.so_luot}`).join(' · ')})</>}.
              </Dong>
              <ThieuNguon d={y.hang_doi_cho_duyet} ten="danh sách học sinh đang chờ duyệt" />
              <Dong>
                Case đang mở: {Object.keys(NHAN_BUOC).filter((k) => (y.trang_thai_case as any)[k]).map((k, i) => (
                  <span key={k}>{i > 0 && ' · '}{NHAN_BUOC[k]} <B>{(y.trang_thai_case as any)[k]}</B></span>
                ))}
                {Object.keys(y.trang_thai_case).length === 0 && 'không có'}.
              </Dong>
            </Muc>
          )}

          {/* ── Báo cáo bổ trợ tuần ── */}
          {t && (
            <Muc ten="Báo cáo bổ trợ">
              <div className="text-[12px] font-medium text-slate-500">Tuần {ddmm(t.tu)} – {ddmm(t.den)}</div>
              <Dong>
                {t.duyet.dot.length > 0
                  ? <>Có <B>{t.duyet.dot.length}</B> ngày duyệt ({t.duyet.dot.map((d) => `${d.thu} ${ddmm(d.ngay)}: ${d.so_luot} lượt`).join(' · ')})</>
                  : <>Tuần này không có lượt duyệt nào</>}
                {t.duyet.so_luot_duyet > 0 && <>, máy đề xuất bổ trợ <B>{t.duyet.may_de_xuat_bo_tro}</B> lượt, được duyệt thành ca cần bổ trợ <B>{t.duyet.chot_bo_tro}/{t.duyet.so_luot_duyet}</B> lượt duyệt</>}.
              </Dong>
              <Dong>
                Case mở trong tuần: <B>{t.case_mo_trong_tuan.so_case}</B> — đã xếp buổi <B>{t.case_mo_trong_tuan.da_xep_buoi}</B>, chưa xếp <B>{t.case_mo_trong_tuan.chua_xep_buoi}</B>
                {t.case_mo_trong_tuan.do_tre_xep_tb_ngay != null && <>. Độ trễ xếp lịch trung bình <B>{t.case_mo_trong_tuan.do_tre_xep_tb_ngay}</B> ngày (từ lúc mở case tới ngày học: {t.case_mo_trong_tuan.tu_mo_toi_ngay_hoc_tb_ngay} ngày)</>}.
              </Dong>
              <CauCa g={t.ca_trong_tuan} nhan="Các ca trong tuần" />
            </Muc>
          )}

          <div className="border-t border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="text-[12px] font-semibold text-slate-600">Cách hiểu đang dùng (chờ xác nhận)</div>
            <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11.5px] leading-relaxed text-slate-500">
              {bc.gia_dinh.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
        </div>
  )
}
