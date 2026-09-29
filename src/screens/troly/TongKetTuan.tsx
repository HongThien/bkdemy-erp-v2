// ============================================================================
// TỔNG KẾT TUẦN — dashboard toàn cảnh của trợ lý (CEO 29/09).
//
// Đọc từ trên xuống:
//   1. Hàng con số đầu — tỉ lệ việc đúng chuẩn của cả trung tâm + quy mô + chuyên cần
//   2. Việc sau buổi học theo từng khâu — thanh Đúng chuẩn / Chậm / Thiếu; Detail = xếp hạng GV–TA
//   3. Bổ trợ yếu — cần → đã lên lịch → đã bổ trợ, sự cố, thời gian từng giai đoạn
//   4. Bổ trợ bù · BTVN của học sinh
//
// Màn này KHÔNG tính gì: mọi số, kể cả chênh lệch với tuần trước, đến từ `fn_troly_tuan`.
// Độ dài các đoạn thanh để trình duyệt tự chia (flex-grow theo số đếm), không chia ở đây.
//
// Màu: 3 màu trạng thái cố định (tốt / cảnh báo / nghiêm trọng) chỉ nằm trên THANH và ô chú giải.
// Chữ và số luôn màu mực — màu vàng cảnh báo không đủ tương phản để làm chữ.
// ============================================================================
import { useEffect, useState } from 'react'
import { ddmm, homNayVN } from '../../lib/troly-baocao'
import { getTongKetTuan, congNgay, type TongKetTuan as DuLieu, type SoKhau, type DongXepHang, type MocThoiGian } from '../../lib/troly-tuan'

const MAU = { dung: '#0ca30c', cham: '#fab219', thieu: '#d03b3b', xanh: '#2a78d6', xanhNen: '#cde2fb', doNen: '#f6d9d9' }

// Rời tab rồi quay lại = đúng tuần đang xem, không gọi lại DB. Bản nhớ chỉ dùng trong cùng ngày.
const NHO: { tuan: string | null; theoTuan: Record<string, DuLieu>; ngay: string } = { tuan: null, theoTuan: {}, ngay: '' }

const so1 = (n: number | null | undefined) => (n == null ? '—' : n.toLocaleString('vi-VN', { maximumFractionDigits: 1 }))
const pct = (n: number | null | undefined) => (n == null ? '—' : `${so1(n)}%`)

// Chênh lệch so với tuần trước. `tot` = chiều nào là TỐT; mũi tên mang nghĩa, màu chỉ phụ hoạ.
function Chenh({ v, tot, dv = ' điểm %' }: { v: number | null | undefined; tot: 'len' | 'xuong' | 'khong'; dv?: string }) {
  if (v == null) return null
  if (v === 0) return <span className="text-[11.5px] text-slate-400">bằng tuần trước</span>
  const len = v > 0
  const mau = tot === 'khong' ? 'text-slate-600' : len === (tot === 'len') ? 'text-emerald-700' : 'text-rose-700'
  return (
    <span className="whitespace-nowrap text-[11.5px]">
      <span className={`font-semibold ${mau}`}>{len ? '▲' : '▼'} {so1(Math.abs(v))}{dv}</span>
      <span className="text-slate-400"> so với tuần trước</span>
    </span>
  )
}

function O({ nhan, giaTri, phu, children }: { nhan: string; giaTri: string; phu?: string; children?: any }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
      <div className="text-[12px] text-slate-500">{nhan}</div>
      <div className="mt-0.5 text-[24px] font-semibold leading-tight text-slate-900">{giaTri}</div>
      {phu && <div className="text-[12px] leading-snug text-slate-500">{phu}</div>}
      {children && <div className="mt-0.5">{children}</div>}
    </div>
  )
}

function NutDetail({ mo, onClick, tat }: { mo: boolean; onClick: () => void; tat?: boolean }) {
  return (
    <button onClick={onClick} disabled={tat}
      className={`rounded-lg border px-3 py-1 text-[12.5px] font-medium transition-colors disabled:opacity-30 ${
        mo ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>
      {mo ? 'Ẩn' : 'Detail'}
    </button>
  )
}

const ChuGiai = ({ mau, nhan }: { mau: string; nhan: string }) => (
  <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-600">
    <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: mau }} />{nhan}
  </span>
)

// Thanh 3 đoạn. Khe trắng 2px tách các đoạn; đoạn nào 0 thì không vẽ.
function Thanh({ dung, cham, thieu, cao = 14 }: { dung: number; cham: number; thieu: number; cao?: number }) {
  if (dung + cham + thieu === 0) return <div className="rounded bg-slate-100" style={{ height: cao }} />
  const doan = [
    { n: dung, mau: MAU.dung, ten: 'Đúng chuẩn' }, { n: cham, mau: MAU.cham, ten: 'Chậm' }, { n: thieu, mau: MAU.thieu, ten: 'Thiếu' },
  ].filter((d) => d.n > 0)
  return (
    <div className="flex gap-[2px] overflow-hidden rounded" style={{ height: cao }}>
      {doan.map((d) => <div key={d.ten} title={`${d.ten}: ${d.n} việc`} style={{ flexGrow: d.n, flexBasis: 0, background: d.mau }} />)}
    </div>
  )
}

const SoKem = ({ mau, nhan, n, p }: { mau: string; nhan: string; n: number; p: number | null }) => (
  <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap text-[12.5px] text-slate-600">
    <span className="inline-block h-2.5 w-2.5 translate-y-[1px] rounded-[3px]" style={{ background: mau }} />
    {nhan} <b className="font-semibold text-slate-900">{pct(p)}</b> <span className="text-slate-400">({n})</span>
  </span>
)

function BangXepHang({ ds }: { ds: DongXepHang[] }) {
  if (ds.length === 0) return <div className="text-[12.5px] text-slate-400">Tuần này chưa có việc nào tới hạn để xếp hạng.</div>
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11.5px] uppercase tracking-wide text-slate-500">
            <th className="w-10 px-2 py-1.5 text-right font-medium">Hạng</th>
            <th className="px-2 py-1.5 font-medium">Giáo viên / TA</th>
            <th className="px-2 py-1.5 text-right font-medium">Việc tới hạn</th>
            <th className="px-2 py-1.5 text-right font-medium">Đúng chuẩn</th>
            <th className="px-2 py-1.5 text-right font-medium">Chậm</th>
            <th className="px-2 py-1.5 text-right font-medium">Thiếu</th>
            <th className="w-[150px] px-2 py-1.5 font-medium" />
            <th className="px-2 py-1.5 text-right font-medium">% đúng chuẩn</th>
          </tr>
        </thead>
        <tbody>
          {ds.map((p) => (
            <tr key={p.ho_ten + (p.ma_ns ?? '')} className="border-b border-slate-100 last:border-0">
              <td className="px-2 py-1.5 text-right tabular-nums text-slate-500">{p.hang}</td>
              <td className="px-2 py-1.5 font-medium text-slate-800">{p.ho_ten}</td>
              <td className="px-2 py-1.5 text-right tabular-nums text-slate-700">{p.tong}</td>
              <td className="px-2 py-1.5 text-right tabular-nums text-slate-700">{p.dung_chuan}</td>
              <td className={`px-2 py-1.5 text-right tabular-nums ${p.cham ? 'text-slate-700' : 'text-slate-300'}`}>{p.cham}</td>
              <td className={`px-2 py-1.5 text-right tabular-nums ${p.thieu ? 'text-slate-700' : 'text-slate-300'}`}>{p.thieu}</td>
              <td className="px-2 py-1.5"><Thanh dung={p.dung_chuan} cham={p.cham} thieu={p.thieu} cao={8} /></td>
              <td className="px-2 py-1.5 text-right font-semibold tabular-nums text-slate-900">{pct(p.pct_dung_chuan)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DongKhau({ k, d, moSan }: { k: SoKhau; d: DuLieu; moSan?: boolean }) {
  const [mo, setMo] = useState(!!moSan)
  const ds = d.xep_hang[k.ma] ?? []
  const c = k.chi_tiet
  return (
    <div className="border-t border-slate-200 first:border-t-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2.5">
        <div className="w-[170px] shrink-0">
          <div className="text-[14px] font-semibold text-slate-800">{k.ten}</div>
          <div className="text-[11.5px] text-slate-500">
            {k.da_toi_han} việc tới hạn{k.con_han > 0 && <> · {k.con_han} còn trong hạn</>}
          </div>
        </div>
        <div className="min-w-[220px] flex-1">
          <Thanh dung={k.dung_chuan} cham={k.cham} thieu={k.thieu} />
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
            <SoKem mau={MAU.dung} nhan="Đúng chuẩn" n={k.dung_chuan} p={k.pct_dung_chuan} />
            <SoKem mau={MAU.cham} nhan="Chậm" n={k.cham} p={k.pct_cham} />
            <SoKem mau={MAU.thieu} nhan="Thiếu" n={k.thieu} p={k.pct_thieu} />
            <Chenh v={d.chenh?.khau?.[k.ma]?.pct_dung_chuan} tot="len" />
          </div>
        </div>
        <NutDetail mo={mo} onClick={() => setMo((x) => !x)} tat={k.tong === 0} />
      </div>
      {mo && (
        <div className="border-t border-slate-200 bg-slate-50/70 px-3 py-2.5">
          <div className="mb-2 flex flex-wrap gap-1.5 text-[12px] text-slate-600">
            {[
              ['Chậm — đóng sau hạn', c.dong_muon], ['Chậm — quá hạn chưa đóng', c.qua_han_chua_dong],
              ['Thiếu — buổi không có đề / không gán bài', c.khong_co_de], ['Thiếu — bấm đóng mà trống', c.dong_ma_trong],
              ['Thiếu — đóng mà thiếu dữ liệu học sinh', c.thieu_du_lieu_hs],
            ].map(([nhan, n]) => (
              <span key={nhan as string} className="rounded-lg border border-slate-200 bg-white px-2 py-0.5">
                {nhan} <b className="font-semibold text-slate-900">{n}</b>
              </span>
            ))}
          </div>
          <div className="mb-1 text-[12px] font-semibold text-slate-600">Xếp hạng giáo viên – TA · {k.ten}</div>
          <BangXepHang ds={ds} />
        </div>
      )}
    </div>
  )
}

// Thước đo một tỉ lệ: phần tô trên nền cùng tông nhạt.
function Thuoc({ p, mau, nen }: { p: number | null; mau: string; nen: string }) {
  return (
    <div className="h-2.5 overflow-hidden rounded" style={{ background: nen }}>
      <div className="h-full rounded" style={{ width: `${p ?? 0}%`, background: mau }} />
    </div>
  )
}

function DongPheu({ nhan, n, dv, p, chenh, tot, mau = MAU.xanh, nen = MAU.xanhNen, phu }: {
  nhan: string; n: number; dv: string; p?: number | null; chenh?: number | null; tot?: 'len' | 'xuong'; mau?: string; nen?: string; phu?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2">
      <div className="w-[170px] shrink-0 text-[13px] font-medium text-slate-800">{nhan}</div>
      <div className="w-[120px] shrink-0 text-[13px] text-slate-600">
        <b className="text-[16px] font-semibold text-slate-900">{n}</b> {dv}
      </div>
      <div className="min-w-[160px] flex-1">
        {p !== undefined && <Thuoc p={p} mau={mau} nen={nen} />}
        <div className="mt-0.5 flex flex-wrap gap-x-3 text-[12.5px] text-slate-600">
          {p !== undefined && <span><b className="font-semibold text-slate-900">{pct(p)}</b> {phu}</span>}
          {p === undefined && phu && <span>{phu}</span>}
          {tot && <Chenh v={chenh} tot={tot} />}
        </div>
      </div>
    </div>
  )
}

function OThoiGian({ nhan, m, chenh }: { nhan: string; m: MocThoiGian; chenh?: number | null }) {
  return (
    <O nhan={nhan} giaTri={m.so_mau > 0 ? `${so1(m.tb_ngay)} ngày` : '—'}
      phu={m.so_mau > 0 ? `trung bình trên ${m.so_mau} lượt · trung vị ${so1(m.trung_vi_ngay)} · lâu nhất ${so1(m.lau_nhat_ngay)}` : 'tuần này không có lượt nào để đo'}>
      {m.so_mau > 0 && <Chenh v={chenh} tot="xuong" dv=" ngày" />}
    </O>
  )
}

const TieuDeKhoi = ({ ten, phu, children }: { ten: string; phu?: string; children?: any }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-200 bg-indigo-50/60 px-3 py-2">
    <div className="text-[14px] font-semibold text-slate-900">{ten}</div>
    {phu && <div className="text-[12px] text-slate-500">{phu}</div>}
    {children && <div className="ml-auto flex flex-wrap gap-x-3">{children}</div>}
  </div>
)

// Phần TRÌNH BÀY, tách khỏi phần tải để dựng thử được bằng JSON thật (check-troly-cong-cu.mjs --tuan).
export function BanTongKetTuan({ d, mo, moSan }: { d: DuLieu; mo?: boolean; moSan?: boolean }) {
  const [moYeu, setMoYeu] = useState(!!moSan)
  const s = d.so, c = d.chenh
  const tk = s.tong_khau
  const y = s.bo_tro_yeu, bu = s.bo_tro_bu, hs = s.btvn_hs
  return (
    <div className={mo ? 'opacity-60' : ''}>
      <div className="mb-2.5 text-[12px] leading-relaxed text-slate-500">
        Số liệu tính lúc <b className="text-slate-900">{d.luu.tinh_luc}</b>
        {d.luu.tinh_boi && <> bởi {d.luu.tinh_boi}</>}
        <span className="text-slate-400"> · {d.luu.vua_tinh ? 'vừa tính xong' : 'đang xem bản đã lưu — bấm "↻ Tính lại" nếu cần số mới'}</span>
        {!d.da_ket_thuc && <div className="text-amber-800">Tuần này chưa kết thúc — số mới tính tới hôm nay, còn thay đổi.</div>}
      </div>

      {/* 1 — HÀNG CON SỐ ĐẦU */}
      <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-5">
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
          <div className="text-[12px] text-slate-500">Việc sau buổi học làm đúng chuẩn — cả trung tâm</div>
          <div className="mt-0.5 text-[48px] font-semibold leading-none text-slate-900">{pct(tk?.pct_dung_chuan)}</div>
          {tk && (
            <>
              <div className="mt-1.5"><Thanh dung={tk.dung_chuan} cham={tk.cham} thieu={tk.thieu} cao={10} /></div>
              <div className="mt-1 text-[12px] leading-snug text-slate-500">
                {tk.dung_chuan}/{tk.da_toi_han} việc tới hạn · chậm {pct(tk.pct_cham)} · thiếu {pct(tk.pct_thieu)}
              </div>
              <Chenh v={c?.tong_khau.pct_dung_chuan} tot="len" />
            </>
          )}
        </div>
        <O nhan="Buổi học" giaTri={`${s.quy_mo.so_buoi}`} phu={`${s.quy_mo.so_lop} lớp`}>
          <Chenh v={c?.so_buoi} tot="khong" dv=" buổi" />
        </O>
        <O nhan="Chuyên cần" giaTri={pct(s.quy_mo.chuyen_can_pct)}
          phu={`${s.quy_mo.luot_co_mat} lượt có mặt · ${s.quy_mo.luot_vang} vắng${s.quy_mo.chua_diem_danh ? ` · ${s.quy_mo.chua_diem_danh} chưa điểm danh` : ''}`}>
          <Chenh v={c?.chuyen_can_pct} tot="len" />
        </O>
        <O nhan="Học sinh nộp BTVN đạt chuẩn" giaTri={pct(hs.ti_le_pct)}
          phu={`${hs.dat}/${hs.can_co} lượt · ${hs.so_lop_duoi_nguong}/${hs.so_lop} lớp dưới ${hs.nguong_pct}%`}>
          <Chenh v={c?.btvn_hs_pct} tot="len" />
        </O>
      </div>

      {/* 2 — VIỆC SAU BUỔI HỌC THEO KHÂU */}
      <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <TieuDeKhoi ten="Việc sau buổi học" phu="tỉ lệ trên việc đã tới hạn · Detail = xếp hạng giáo viên – TA">
          <ChuGiai mau={MAU.dung} nhan="Đúng chuẩn" /><ChuGiai mau={MAU.cham} nhan="Chậm" /><ChuGiai mau={MAU.thieu} nhan="Thiếu" />
        </TieuDeKhoi>
        {s.khau.map((k) => <DongKhau key={k.ma} k={k} d={d} moSan={moSan} />)}
        {d.xep_hang_bo_qua.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11.5px] text-slate-500">
            Không đưa vào xếp hạng: {d.xep_hang_bo_qua.join(', ')}. Việc của những người này vẫn tính trong con số của trung tâm.
          </div>
        )}
      </div>

      {/* 3 — BỔ TRỢ YẾU */}
      <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <TieuDeKhoi ten="Bổ trợ yếu" phu="case = một học sinh × một đợt bổ trợ · lượt = một học sinh × một buổi" />
        <DongPheu nhan="Cần bổ trợ" n={y.can_bo_tro} dv="case" phu="còn dạng phải dạy trong tuần" chenh={c?.bo_tro_yeu.can_bo_tro} />
        <DongPheu nhan="Đã lên lịch" n={y.da_len_lich} dv="case" p={y.pct_len_lich} phu="số case cần bổ trợ" chenh={c?.bo_tro_yeu.pct_len_lich} tot="len" />
        <DongPheu nhan="Đã bổ trợ" n={y.da_bo_tro} dv="case" p={y.pct_da_bo_tro} phu="số case cần bổ trợ" chenh={c?.bo_tro_yeu.pct_da_bo_tro} tot="len" />
        <div className="border-t border-dashed border-slate-200">
          <DongPheu nhan="Có sự cố" n={y.su_co} dv={`/ ${y.luot_xep} lượt xếp`} p={y.pct_su_co} phu="số lượt đã xếp"
            chenh={c?.bo_tro_yeu.pct_su_co} tot="xuong" mau={MAU.thieu} nen={MAU.doNen} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 px-3 pb-2.5 text-[12px] text-slate-600">
          {[
            ['Học sinh không đến', y.su_co_chi_tiet.hs_khong_den], ['Không ai điểm danh (hệ tự huỷ)', y.su_co_chi_tiet.khong_diem_danh],
            ['OPS gỡ khỏi lịch phòng', y.su_co_chi_tiet.ops_go_khoi_lich], ['Huỷ lý do khác', y.su_co_chi_tiet.huy_ly_do_khac],
          ].map(([nhan, n]) => (
            <span key={nhan as string} className="rounded-lg border border-slate-200 bg-white px-2 py-0.5">
              {nhan} <b className="font-semibold text-slate-900">{n}</b>
            </span>
          ))}
          <div className="ml-auto"><NutDetail mo={moYeu} onClick={() => setMoYeu((x) => !x)} tat={y.luot_xep === 0} /></div>
        </div>
        {moYeu && (
          <div className="border-t border-slate-200 bg-slate-50/70 px-3 py-2.5 text-[12.5px] text-slate-600">
            <div className="mb-1 font-semibold text-slate-700">{y.luot_dien_ra} lượt đã diễn ra, trong đó:</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                ['Hợp lệ — có bài test cuối ca', y.luot_hop_le], ['Đã đóng ca nhưng không có bài test', y.luot_khong_test],
                ['Em có mặt, TA chưa đóng ca', y.luot_ta_chua_dong_ca], ['Còn chờ tới ngày học', y.luot_cho_hoc],
              ].map(([nhan, n]) => (
                <span key={nhan as string} className="rounded-lg border border-slate-200 bg-white px-2 py-0.5">
                  {nhan} <b className="font-semibold text-slate-900">{n}</b>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-2 border-t border-slate-200 bg-slate-50/50 p-2.5 sm:grid-cols-2">
          <OThoiGian nhan="Từ duyệt đến xếp lịch" m={s.thoi_gian.duyet_den_xep} chenh={c?.thoi_gian.duyet_den_xep} />
          <OThoiGian nhan="Từ xếp lịch đến diễn ra" m={s.thoi_gian.xep_den_dien_ra} chenh={c?.thoi_gian.xep_den_dien_ra} />
        </div>
      </div>

      {/* 4 — BỔ TRỢ BÙ */}
      <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <TieuDeKhoi ten="Bổ trợ bù" phu="theo lượt vắng của tuần — tới lúc tính thì đã được bù tới đâu" />
        <DongPheu nhan="Lượt vắng" n={bu.luot_vang} dv="lượt" phu={`${bu.khong_bu} lượt đã chốt không bù · ${bu.chua_xep} lượt chưa xếp`} />
        <DongPheu nhan="Đã xếp bù" n={bu.da_xep} dv="lượt" p={bu.pct_da_xep} phu="số lượt phải bù" chenh={c?.bo_tro_bu.pct_da_xep} tot="len" />
        <DongPheu nhan="Đã học bù" n={bu.da_hoc_bu} dv="lượt" p={bu.pct_da_hoc_bu} phu="số lượt phải bù" />
        <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-600">
          Buổi bù diễn ra trong tuần: <b className="font-semibold text-slate-900">{bu.buoi_bu_luot}</b> lượt
          · có mặt {bu.buoi_bu_co_mat} · vắng {bu.buoi_bu_vang} · huỷ {bu.buoi_bu_huy}
          {bu.su_co > 0 && <> · <b className="font-semibold text-slate-900">{bu.su_co}</b> lượt vắng đã xếp bù nhưng trượt, chưa xếp lại</>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
        <div className="text-[12px] font-semibold text-slate-600">Cách tính đang dùng</div>
        <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11.5px] leading-relaxed text-slate-500">
          {d.cach_tinh.map((g, i) => <li key={i}>{g}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default function TongKetTuan() {
  const [tuan, setTuan] = useState<string | null>(NHO.tuan)   // null = tuần vừa rồi
  const [d, setD] = useState<DuLieu | null>(tuan ? NHO.theoTuan[tuan] ?? null : null)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const homNay = homNayVN()

  async function tai(t: string | null, tinhLai = false) {
    if (NHO.ngay !== homNay) { NHO.theoTuan = {}; NHO.ngay = homNay }   // tab mở qua đêm ⇒ hỏi lại DB
    const co = t ? NHO.theoTuan[t] : null
    if (!tinhLai && co) { setD({ ...co, luu: { ...co.luu, vua_tinh: false } }); return }
    setLoi(null); setDangTai(true)
    try {
      const r = await getTongKetTuan(t, tinhLai)
      NHO.theoTuan[r.tu] = r; NHO.tuan = r.tu
      setD(r); setTuan(r.tu)
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
    finally { setDangTai(false) }
  }
  useEffect(() => { tai(tuan) }, []) // eslint-disable-line

  // Đổi TUẦN = đổi ngữ cảnh ⇒ bỏ số tuần cũ rồi tải, để số tuần trước không đứng dưới nhãn tuần mới.
  function doi(n: number) {
    if (!d) return
    const t = congNgay(d.tu, n)
    setD(NHO.theoTuan[t] ?? null); setTuan(t); tai(t)
  }
  const coTuanSau = !!d && congNgay(d.tu, 7) <= homNay

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <button onClick={() => doi(-7)} disabled={!d || dangTai} aria-label="Tuần trước"
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40">‹</button>
        <div className="min-w-[170px] text-center text-[14px] font-semibold text-slate-900">
          {d ? <>Tuần {ddmm(d.tu)} – {ddmm(d.den)}</> : tuan ? <>Tuần {ddmm(tuan)} – {ddmm(congNgay(tuan, 6))}</> : 'Tuần vừa rồi'}
        </div>
        <button onClick={() => doi(7)} disabled={!coTuanSau || dangTai} aria-label="Tuần sau"
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40">›</button>
        <button onClick={() => d && tai(d.tu, true)} disabled={!d || dangTai}
          className="ml-auto rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12.5px] text-slate-600 hover:bg-slate-50 disabled:opacity-40">↻ Tính lại</button>
      </div>

      {loi && <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">Lỗi: {loi}</div>}
      {!d && dangTai && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-400">Đang tính tổng kết tuần…</div>}
      {d && <BanTongKetTuan d={d} mo={dangTai} />}
    </div>
  )
}
