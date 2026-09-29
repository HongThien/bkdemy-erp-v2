// ============================================================================
// TỔNG KẾT TUẦN — dashboard toàn cảnh của trợ lý (CEO 29/09), dựng theo BẢNG.
//
// CEO 29/09: "dashboard nên làm theo bảng. Mỗi loại chỉ số nên là 1 bảng cho dễ theo dõi. Cái này
// phải trình chiếu" → mỗi mảng MỘT bảng, mọi bảng CÙNG một bộ cột:
//     Chỉ số · Tuần này · Tuần trước · Thường đạt · So với thường đạt · Xu hướng
// Bảng đầu tiên "Cần chú ý" gom các chỉ số đang dưới thường đạt — mở màn là thấy ngay chỗ phải bàn.
// Nút "Trình chiếu" phóng toàn màn hình, chữ to. Nút "Số từng tuần" đổi cột xu hướng thành số.
//
// Màn này KHÔNG tính gì: giá trị, tuần trước, chênh lệch, thường đạt, lọc nhiễu, đánh giá đều đến
// từ `fn_troly_tuan_lay`. Ở đây chỉ định dạng, lọc theo bảng đang vẽ, và đặt toạ độ nét vẽ.
//
// Màu: màu trạng thái chỉ nằm trên DẤU (chấm, thanh); chữ và số luôn màu mực. Trạng thái luôn đi
// kèm chữ ("Vấn đề", "Dưới thường đạt") — không bao giờ chỉ có màu.
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import { ddmm, homNayVN } from '../../lib/troly-baocao'
import {
  getTongKetTuan, congNgay,
  type TongKetTuan as DuLieu, type ChiSo, type DanhGia, type DongXepHang, type SoKhau, type TongKhau,
} from '../../lib/troly-tuan'

const MAU = { dung: '#0ca30c', cham: '#fab219', thieu: '#d03b3b', xanh: '#2a78d6', xam: '#898781', nen: '#c3c2b7' }

// Rời tab rồi quay lại = đúng tuần đang xem, không gọi lại DB. Bản nhớ chỉ dùng trong cùng ngày.
const NHO: { tuan: string | null; theoTuan: Record<string, DuLieu>; ngay: string; hienSo: boolean } =
  { tuan: null, theoTuan: {}, ngay: '', hienSo: false }

const so1 = (n: number | null | undefined) => (n == null ? '—' : n.toLocaleString('vi-VN', { maximumFractionDigits: 1 }))
const giaTri = (v: number | null | undefined, dv: string) => (v == null ? '—' : dv === '%' ? `${so1(v)}%` : `${so1(v)} ${dv}`)

// Dòng phụ dưới con số: con số đó được tính trên bao nhiêu.
function coSo(c: ChiSo): string | null {
  if (c.tu_so != null && c.mau_so != null) return `${so1(c.tu_so)}/${so1(c.mau_so)}`
  if (c.mau_so != null) return c.don_vi === 'ngày' ? `đo trên ${so1(c.mau_so)} lượt` : `trên ${so1(c.mau_so)}`
  if (c.tu_so != null) return `${so1(c.tu_so)} lượt`
  return null
}

// Chênh lệch so với tuần trước. Mũi tên mang nghĩa; màu chỉ phụ hoạ theo chiều tốt của chỉ số.
function Chenh({ c }: { c: ChiSo }) {
  if (c.chenh == null) return null
  if (c.chenh === 0) return <span className="text-[11.5px] text-slate-400">không đổi</span>
  const len = c.chenh > 0
  const mau = c.chieu_tot === 'khong' ? 'text-slate-600' : len === (c.chieu_tot === 'len') ? 'text-emerald-700' : 'text-rose-700'
  return <span className={`whitespace-nowrap text-[11.5px] font-semibold ${mau}`}>{len ? '▲' : '▼'} {so1(Math.abs(c.chenh))}{c.don_vi === '%' ? ' điểm' : ''}</span>
}

const NHAN: Record<DanhGia, { chu: string; dau: string | null; dam: boolean }> = {
  van_de: { chu: 'Vấn đề', dau: MAU.thieu, dam: true },
  duoi: { chu: 'Dưới thường đạt', dau: MAU.cham, dam: true },
  binh_thuong: { chu: 'Bình thường', dau: MAU.nen, dam: false },
  tren: { chu: 'Trên thường đạt', dau: MAU.dung, dam: false },
  khong_xet: { chu: '—', dau: null, dam: false },
  chua_du: { chu: 'Chưa đủ lần đo', dau: null, dam: false },
  chua_chot: { chu: 'Chưa chốt', dau: null, dam: false },
}

function NhanDanhGia({ c }: { c: ChiSo }) {
  if (!c.danh_gia) return <span className="text-slate-300">—</span>
  const n = NHAN[c.danh_gia]
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px]">
      {n.dau && <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: n.dau }} />}
      <span className={n.dam ? 'font-semibold text-slate-900' : n.dau ? 'text-slate-700' : 'text-slate-400'}>{n.chu}</span>
    </span>
  )
}

// Nét xu hướng của một chỉ số. Đường ngang xám = thường đạt. Chấm rỗng = lần đo bị coi là nhiễu.
function XuHuong({ c }: { c: ChiSo }) {
  const W = 132, H = 30, P = 5
  const co = c.chuoi.map((x, i) => ({ ...x, i })).filter((x) => x.gia_tri != null)
  if (co.length < 2) return <span className="text-[11.5px] text-slate-300">chưa đủ tuần</span>
  const gt = co.map((x) => x.gia_tri as number).concat(c.thuong_dat != null ? [c.thuong_dat] : [])
  const lo = Math.min(...gt), kh = Math.max(...gt) - lo || 1
  const X = (i: number) => P + (i * (W - 2 * P)) / (c.chuoi.length - 1)
  const Y = (v: number) => H - P - ((v - lo) / kh) * (H - 2 * P)
  const d = co.map((x, j) => `${j > 0 && co[j - 1].i === x.i - 1 ? 'L' : 'M'}${X(x.i).toFixed(1)} ${Y(x.gia_tri as number).toFixed(1)}`).join(' ')
  const cuoi = co[co.length - 1]
  return (
    <svg width={W} height={H} role="img" className="block">
      <title>{c.chuoi.map((x) => `${ddmm(x.tuan)}: ${giaTri(x.gia_tri, c.don_vi)}${x.nhieu ? ' (nhiễu)' : ''}`).join(' · ')}{c.thuong_dat != null ? ` — thường đạt ${giaTri(c.thuong_dat, c.don_vi)}` : ''}</title>
      {c.thuong_dat != null && <line x1={P} x2={W - P} y1={Y(c.thuong_dat)} y2={Y(c.thuong_dat)} stroke={MAU.nen} strokeWidth={1} />}
      <path d={d} fill="none" stroke={MAU.xanh} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {co.filter((x) => x.nhieu).map((x) => (
        <circle key={x.tuan} cx={X(x.i)} cy={Y(x.gia_tri as number)} r={3} fill="#fff" stroke={MAU.xam} strokeWidth={1.5} />
      ))}
      <circle cx={X(cuoi.i)} cy={Y(cuoi.gia_tri as number)} r={4} fill={MAU.xanh} stroke="#fff" strokeWidth={2} />
    </svg>
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

const The = ({ nhan, n }: { nhan: string; n: number | string }) => (
  <span className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[12px] text-slate-600">
    {nhan} <b className="font-semibold text-slate-900">{n}</b>
  </span>
)

const TH = 'px-2.5 py-1.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-slate-500'
const TD = 'px-2.5 py-2 align-top'

// Đầu cột + ô của phần "xu hướng": nét vẽ, hoặc số của từng tuần khi bấm "Số từng tuần".
function DauXuHuong({ hienSo, tuan, nhan = 'Xu hướng' }: { hienSo: boolean; tuan: string[]; nhan?: string }) {
  if (!hienSo) return <th className={TH}>{nhan}</th>
  return <>{tuan.map((t) => <th key={t} className={`${TH} text-right`}>{ddmm(t)}</th>)}</>
}
function OXuHuong({ c, hienSo, tuan }: { c?: ChiSo; hienSo: boolean; tuan: string[] }) {
  if (!hienSo) return <td className={TD}>{c ? <XuHuong c={c} /> : null}</td>
  return (
    <>
      {tuan.map((t) => {
        const x = c?.chuoi.find((y) => y.tuan === t)   // tra theo TUẦN, không theo vị trí
        return (
          <td key={t} className={`${TD} whitespace-nowrap text-right text-[12.5px] tabular-nums ${x?.nhieu ? 'text-slate-400' : 'text-slate-700'}`}>
            {x?.gia_tri == null ? '—' : so1(x.gia_tri)}{x?.nhieu ? '*' : ''}
          </td>
        )
      })}
    </>
  )
}

function Khung({ ten, phu, children, chan }: { ten: string; phu?: string; children: any; chan?: any }) {
  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-slate-200 bg-indigo-50/60 px-3 py-2">
        <div className="text-[14.5px] font-semibold text-slate-900">{ten}</div>
        {phu && <div className="text-[12px] text-slate-500">{phu}</div>}
      </div>
      <div className="overflow-x-auto">{children}</div>
      {chan}
    </div>
  )
}

// ── BẢNG CHUNG: mỗi dòng một chỉ số, cùng một bộ cột ───────────────────────────────────
function BangChiSo({ ds, hienSo, tuan, cotBang }: { ds: ChiSo[]; hienSo: boolean; tuan: string[]; cotBang?: (c: ChiSo) => string }) {
  return (
    <table className="w-full text-[13px]">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50">
          <th className={TH}>Chỉ số</th>
          {cotBang && <th className={TH}>Mảng</th>}
          <th className={`${TH} text-right`}>Tuần này</th>
          <th className={`${TH} text-right`}>Tuần trước</th>
          <th className={`${TH} text-right`}>Thường đạt</th>
          <th className={TH}>So với thường đạt</th>
          <DauXuHuong hienSo={hienSo} tuan={tuan} />
        </tr>
      </thead>
      <tbody>
        {ds.map((c) => (
          <tr key={c.ma} className="border-b border-slate-100 last:border-0">
            <td className={`${TD} font-medium text-slate-800`}>{c.ten}</td>
            {cotBang && <td className={`${TD} text-[12.5px] text-slate-500`}>{cotBang(c)}</td>}
            <td className={`${TD} whitespace-nowrap text-right`}>
              <div className="text-[15px] font-semibold tabular-nums text-slate-900">{giaTri(c.gia_tri, c.don_vi)}</div>
              {coSo(c) && <div className="text-[11.5px] tabular-nums text-slate-400">{coSo(c)}</div>}
            </td>
            <td className={`${TD} whitespace-nowrap text-right`}>
              <div className="tabular-nums text-slate-600">{giaTri(c.truoc, c.don_vi)}</div>
              <Chenh c={c} />
            </td>
            <td className={`${TD} whitespace-nowrap text-right`}>
              <div className="tabular-nums text-slate-600">{giaTri(c.thuong_dat, c.don_vi)}</div>
              {c.so_lan_do > 0 && (
                <div className="text-[11.5px] text-slate-400">{c.so_lan_do} lần đo{c.so_lan_nhieu > 0 && <> · bỏ {c.so_lan_nhieu} nhiễu</>}</div>
              )}
            </td>
            <td className={TD}>
              <NhanDanhGia c={c} />
              {c.lech != null && c.danh_gia && !['khong_xet', 'chua_du', 'chua_chot'].includes(c.danh_gia) && (
                <div className="text-[11.5px] tabular-nums text-slate-400">lệch {c.lech > 0 ? '+' : '−'}{so1(Math.abs(c.lech))}{c.don_vi === '%' ? ' điểm' : ''}</div>
              )}
            </td>
            <OXuHuong c={c} hienSo={hienSo} tuan={tuan} />
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Việc sau buổi: thanh 3 đoạn + xếp hạng ──────────────────────────────────────────
function Thanh({ dung, cham, thieu, cao = 8 }: { dung: number; cham: number; thieu: number; cao?: number }) {
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

function BangXepHang({ ds }: { ds: DongXepHang[] }) {
  if (ds.length === 0) return <div className="text-[12.5px] text-slate-400">Tuần này chưa có việc nào tới hạn để xếp hạng.</div>
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className={`${TH} w-10 text-right`}>Hạng</th>
            <th className={TH}>Giáo viên / TA</th>
            <th className={`${TH} text-right`}>Việc tới hạn</th>
            <th className={`${TH} text-right`}>Đúng chuẩn</th>
            <th className={`${TH} text-right`}>Chậm</th>
            <th className={`${TH} text-right`}>Thiếu</th>
            <th className={`${TH} w-[150px]`} />
            <th className={`${TH} text-right`}>% đúng chuẩn</th>
          </tr>
        </thead>
        <tbody>
          {ds.map((p) => (
            <tr key={p.ho_ten + (p.ma_ns ?? '')} className="border-b border-slate-100 last:border-0">
              <td className="px-2.5 py-1.5 text-right tabular-nums text-slate-500">{p.hang}</td>
              <td className="px-2.5 py-1.5 font-medium text-slate-800">{p.ho_ten}</td>
              <td className="px-2.5 py-1.5 text-right tabular-nums text-slate-700">{p.tong}</td>
              <td className="px-2.5 py-1.5 text-right tabular-nums text-slate-700">{p.dung_chuan}</td>
              <td className={`px-2.5 py-1.5 text-right tabular-nums ${p.cham ? 'text-slate-700' : 'text-slate-300'}`}>{p.cham}</td>
              <td className={`px-2.5 py-1.5 text-right tabular-nums ${p.thieu ? 'text-slate-700' : 'text-slate-300'}`}>{p.thieu}</td>
              <td className="px-2.5 py-1.5"><Thanh dung={p.dung_chuan} cham={p.cham} thieu={p.thieu} /></td>
              <td className="px-2.5 py-1.5 text-right font-semibold tabular-nums text-slate-900">{so1(p.pct_dung_chuan)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Một ô tỉ lệ trong bảng Việc sau buổi: con số · thường đạt · đánh giá.
function OTiLe({ c }: { c?: ChiSo }) {
  if (!c) return <td className={TD}><span className="text-slate-300">—</span></td>
  return (
    <td className={TD}>
      <div className="whitespace-nowrap">
        <span className="text-[15px] font-semibold tabular-nums text-slate-900">{giaTri(c.gia_tri, c.don_vi)}</span>
        <span className="ml-1 text-[11.5px] tabular-nums text-slate-400">({so1(c.tu_so)})</span>
        <span className="ml-1.5"><Chenh c={c} /></span>
      </div>
      <div className="whitespace-nowrap text-[11.5px] tabular-nums text-slate-400">thường đạt {giaTri(c.thuong_dat, c.don_vi)}</div>
      <NhanDanhGia c={c} />
    </td>
  )
}

function DongViec({ ma, ten, k, d, tra, hienSo, tuan, soCot, moSan }: {
  ma: string; ten: string; k: SoKhau | TongKhau; d: DuLieu; tra: (ma: string) => ChiSo | undefined
  hienSo: boolean; tuan: string[]; soCot: number; moSan?: boolean
}) {
  const [mo, setMo] = useState(!!moSan)
  const chiTiet = 'chi_tiet' in k ? k.chi_tiet : null
  return (
    <>
      <tr className={`border-b border-slate-100 ${ma === 'tong' ? 'bg-slate-50/70' : ''}`}>
        <td className={TD}>
          <div className="font-semibold text-slate-800">{ten}</div>
          <div className="mt-1 w-[120px]"><Thanh dung={k.dung_chuan} cham={k.cham} thieu={k.thieu} /></div>
        </td>
        <td className={`${TD} whitespace-nowrap text-right`}>
          <div className="text-[15px] font-semibold tabular-nums text-slate-900">{k.da_toi_han}</div>
          {k.con_han > 0 && <div className="text-[11.5px] text-slate-400">+{k.con_han} còn hạn</div>}
        </td>
        <OTiLe c={tra(`khau.${ma}.dung_chuan`)} />
        <OTiLe c={tra(`khau.${ma}.cham`)} />
        <OTiLe c={tra(`khau.${ma}.thieu`)} />
        <OXuHuong c={tra(`khau.${ma}.dung_chuan`)} hienSo={hienSo} tuan={tuan} />
        <td className={`${TD} text-right`}>{chiTiet && <NutDetail mo={mo} onClick={() => setMo((x) => !x)} tat={k.tong === 0} />}</td>
      </tr>
      {mo && chiTiet && (
        <tr className="border-b border-slate-200 bg-slate-50/70">
          <td colSpan={soCot} className="px-3 py-2.5">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <The nhan="Chậm — đóng sau hạn" n={chiTiet.dong_muon} />
              <The nhan="Chậm — quá hạn chưa đóng" n={chiTiet.qua_han_chua_dong} />
              <The nhan="Thiếu — buổi không có đề / không gán bài" n={chiTiet.khong_co_de} />
              <The nhan="Thiếu — bấm đóng mà trống" n={chiTiet.dong_ma_trong} />
              <The nhan="Thiếu — đóng mà thiếu dữ liệu học sinh" n={chiTiet.thieu_du_lieu_hs} />
            </div>
            <div className="mb-1 text-[12px] font-semibold text-slate-600">Xếp hạng giáo viên – TA · {ten}</div>
            <BangXepHang ds={d.xep_hang[ma] ?? []} />
          </td>
        </tr>
      )}
    </>
  )
}

const ChuGiai = ({ mau, nhan }: { mau: string; nhan: string }) => (
  <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-600">
    <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: mau }} />{nhan}
  </span>
)

// Phần Detail của các bảng còn lại: thành phần của con số, không phải chỉ số để so sánh.
function ChanBang({ ma, d, moSan }: { ma: string; d: DuLieu; moSan?: boolean }) {
  const [mo, setMo] = useState(!!moSan)
  const s = d.so
  if (!['hoc_tap', 'yeu', 'bu', 'duoi', 'tuyen_sinh'].includes(ma)) return null
  return (
    <div className="border-t border-slate-200">
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2">
        <span className="text-[12px] text-slate-500">
          {ma === 'hoc_tap' && `${d.lop_hoc_tap.length} lớp có điểm ET trong tuần — xem lớp nào tụt`}
          {ma === 'yeu' && `${s.bo_tro_yeu.luot_xep} lượt xếp · ${s.bo_tro_yeu.su_co} lượt có sự cố`}
          {ma === 'bu' && `${s.bo_tro_bu.buoi_bu_luot} lượt buổi bù diễn ra trong tuần`}
          {ma === 'duoi' && `${s.bo_tro_duoi.luot_xep} lượt xếp · ${s.bo_tro_duoi.su_co} lượt có sự cố`}
          {ma === 'tuyen_sinh' && `${s.tuyen_sinh.ca_test} ca test trong tuần`}
        </span>
        <div className="ml-auto"><NutDetail mo={mo} onClick={() => setMo((x) => !x)} /></div>
      </div>
      {mo && (
        <div className="border-t border-slate-200 bg-slate-50/70 px-3 py-2.5">
          {ma === 'yeu' && (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[12px] font-semibold text-slate-600">Sự cố:</span>
                <The nhan="Học sinh không đến" n={s.bo_tro_yeu.su_co_chi_tiet.hs_khong_den} />
                <The nhan="Không ai điểm danh (hệ tự huỷ)" n={s.bo_tro_yeu.su_co_chi_tiet.khong_diem_danh} />
                <The nhan="OPS gỡ khỏi lịch phòng" n={s.bo_tro_yeu.su_co_chi_tiet.ops_go_khoi_lich} />
                <The nhan="Huỷ lý do khác" n={s.bo_tro_yeu.su_co_chi_tiet.huy_ly_do_khac} />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[12px] font-semibold text-slate-600">{s.bo_tro_yeu.luot_dien_ra} lượt đã diễn ra:</span>
                <The nhan="Hợp lệ — có bài test cuối ca" n={s.bo_tro_yeu.luot_hop_le} />
                <The nhan="Đã đóng ca nhưng không có bài test" n={s.bo_tro_yeu.luot_khong_test} />
                <The nhan="Em có mặt, TA chưa đóng ca" n={s.bo_tro_yeu.luot_ta_chua_dong_ca} />
                <The nhan="Còn chờ tới ngày học" n={s.bo_tro_yeu.luot_cho_hoc} />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[12px] font-semibold text-slate-600">Thời gian:</span>
                <The nhan="Duyệt → xếp lịch, trung vị" n={`${so1(s.thoi_gian.duyet_den_xep.trung_vi_ngay)} ngày`} />
                <The nhan="lâu nhất" n={`${so1(s.thoi_gian.duyet_den_xep.lau_nhat_ngay)} ngày`} />
                <The nhan="Xếp lịch → diễn ra, trung vị" n={`${so1(s.thoi_gian.xep_den_dien_ra.trung_vi_ngay)} ngày`} />
                <The nhan="lâu nhất" n={`${so1(s.thoi_gian.xep_den_dien_ra.lau_nhat_ngay)} ngày`} />
              </div>
            </div>
          )}
          {ma === 'bu' && (
            <div className="flex flex-wrap items-center gap-1.5">
              <The nhan="Lượt vắng đã chốt không bù" n={s.bo_tro_bu.khong_bu} />
              <The nhan="Đã xếp bù nhưng trượt, chưa xếp lại" n={s.bo_tro_bu.su_co} />
              <The nhan="Buổi bù trong tuần — có mặt" n={s.bo_tro_bu.buoi_bu_co_mat} />
              <The nhan="vắng" n={s.bo_tro_bu.buoi_bu_vang} />
              <The nhan="huỷ" n={s.bo_tro_bu.buoi_bu_huy} />
            </div>
          )}
          {ma === 'duoi' && (
            <div className="flex flex-wrap items-center gap-1.5">
              <The nhan="Lượt đã học" n={s.bo_tro_duoi.luot_da_hoc} />
              <The nhan="Còn chờ tới ngày học" n={s.bo_tro_duoi.luot_cho_hoc} />
              <The nhan="Sự cố — học sinh không đến" n={s.bo_tro_duoi.su_co_chi_tiet.hs_khong_den} />
              <The nhan="không ai điểm danh" n={s.bo_tro_duoi.su_co_chi_tiet.khong_diem_danh} />
              <The nhan="buổi bị huỷ" n={s.bo_tro_duoi.su_co_chi_tiet.huy} />
              <The nhan="Mở case → xếp lịch, lâu nhất" n={`${so1(s.bo_tro_duoi.tao_den_xep.lau_nhat_ngay)} ngày`} />
            </div>
          )}
          {ma === 'tuyen_sinh' && (
            <div className="flex flex-wrap items-center gap-1.5">
              <The nhan="Ca test đã test xong" n={s.tuyen_sinh.da_test_xong} />
              <The nhan="đã chấm" n={s.tuyen_sinh.da_cham} />
              <The nhan="đã trả kết quả" n={s.tuyen_sinh.da_tra_ket_qua} />
              <The nhan="ca bị huỷ" n={s.tuyen_sinh.ca_huy} />
              <The nhan="Test xong → trả kết quả, lâu nhất" n={`${so1(s.tuyen_sinh.test_den_tra.lau_nhat_ngay)} ngày`} />
            </div>
          )}
          {ma === 'hoc_tap' && (
            <>
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <The nhan="Học sinh có điểm BTVN thấp hơn hẳn lớp" n={s.hoc_tap.hs_btvn_thap} />
                <The nhan="Lượt BTVN chưa nộp" n={s.btvn_hs.chua_nop} />
                <The nhan="Lượt BTVN thiếu thông tin" n={s.btvn_hs.thieu_thong_tin} />
              </div>
              <div className="mb-1 text-[12px] font-semibold text-slate-600">Điểm ET trung bình theo lớp — lớp tụt nhiều nhất đứng đầu</div>
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className={TH}>Lớp</th><th className={TH}>Môn</th>
                      <th className={`${TH} text-right`}>Lượt ET</th>
                      <th className={`${TH} text-right`}>ET tuần này</th>
                      <th className={`${TH} text-right`}>ET tuần trước</th>
                      <th className={`${TH} text-right`}>Chênh</th>
                      <th className={`${TH} text-right`}>BTVN tuần này</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.lop_hoc_tap.map((l) => (
                      <tr key={l.ten_lop + l.mon} className="border-b border-slate-100 last:border-0">
                        <td className="px-2.5 py-1.5 font-medium text-slate-800">{l.ten_lop}</td>
                        <td className="px-2.5 py-1.5 text-slate-500">{l.mon}</td>
                        <td className="px-2.5 py-1.5 text-right tabular-nums text-slate-600">{l.et_so_luot}</td>
                        <td className="px-2.5 py-1.5 text-right font-semibold tabular-nums text-slate-900">{giaTri(l.et_tb, '%')}</td>
                        <td className="px-2.5 py-1.5 text-right tabular-nums text-slate-600">{giaTri(l.et_tb_truoc, '%')}</td>
                        <td className={`px-2.5 py-1.5 text-right font-semibold tabular-nums ${l.et_chenh == null ? 'text-slate-300' : l.et_chenh < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {l.et_chenh == null ? '—' : `${l.et_chenh > 0 ? '▲' : l.et_chenh < 0 ? '▼' : ''} ${so1(Math.abs(l.et_chenh))}`}
                        </td>
                        <td className="px-2.5 py-1.5 text-right tabular-nums text-slate-600">{giaTri(l.btvn_tb, '%')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const PHU_BANG: Record<string, string> = {
  yeu: 'case = một học sinh × một đợt bổ trợ · lượt = một học sinh × một buổi',
  bu: 'theo lượt vắng của tuần — tới lúc tính thì đã được bù tới đâu',
  duoi: 'case = một học sinh × một đợt học đuổi',
  hoc_tap: 'điểm tính trên các lượt đã có điểm',
}

// Phần TRÌNH BÀY, tách khỏi phần tải để dựng thử được bằng JSON thật (check-troly-cong-cu.mjs --tuan).
export function BanTongKetTuan({ d, mo, moSan, hienSo = false }: { d: DuLieu; mo?: boolean; moSan?: boolean; hienSo?: boolean }) {
  const tra = (ma: string) => d.chi_so.find((c) => c.ma === ma)
  const tuan = d.chi_so[0]?.chuoi.map((x) => x.tuan) ?? []
  const tenBang = (ma: string) => d.bang.find((b) => b.ma === ma)?.ten ?? ma
  const canChuY = d.chi_so.filter((c) => c.danh_gia === 'van_de' || c.danh_gia === 'duoi')
  const soCotViec = 6 + (hienSo ? tuan.length : 1)
  return (
    <div className={mo ? 'opacity-60' : ''}>
      <div className="mb-2.5 text-[12px] leading-relaxed text-slate-500">
        Số liệu tính lúc <b className="text-slate-900">{d.luu.tinh_luc}</b>
        {d.luu.tinh_boi && <> bởi {d.luu.tinh_boi}</>}
        <span className="text-slate-400"> · {d.luu.vua_tinh ? 'vừa tính xong' : 'đang xem bản đã lưu — bấm "↻ Tính lại" nếu cần số mới'}</span>
        {!d.da_ket_thuc && <div className="text-amber-800">Tuần này chưa kết thúc — số mới tính tới hôm nay, còn thay đổi.</div>}
        {d.da_ket_thuc && !d.da_chin && <div>Tuần vừa kết thúc chưa quá 7 ngày — vài chỉ số ghi "Chưa chốt" vì số còn đổi (bù, trả kết quả test, điểm BTVN).</div>}
        {d.thuong_dat.so_tuan_chua_co_so > 0 && <div className="text-amber-800">Còn {d.thuong_dat.so_tuan_chua_co_so} tuần cũ chưa có số — thường đạt đang tính thiếu. Bấm "↻ Tính lại" để hệ dựng tiếp.</div>}
      </div>

      {/* 0 — CẦN CHÚ Ý: chỉ số đang dưới thường đạt */}
      <Khung ten="Cần chú ý" phu={`${canChuY.length} chỉ số đang dưới thường đạt của chính nó`}>
        {canChuY.length === 0
          ? <div className="px-3 py-3 text-[13px] text-slate-500">Tuần này không có chỉ số nào dưới thường đạt.</div>
          : <BangChiSo ds={canChuY} hienSo={hienSo} tuan={tuan} cotBang={(c) => tenBang(c.bang)} />}
      </Khung>

      {d.bang.map((b) => {
        if (b.ma === 'viec') {
          return (
            <Khung key={b.ma} ten={b.ten} phu="tỉ lệ trên việc đã tới hạn · số trong ngoặc = số việc · Detail = xếp hạng giáo viên – TA"
              chan={d.xep_hang_bo_qua.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11.5px] text-slate-500">
                  <ChuGiai mau={MAU.dung} nhan="Đúng chuẩn" /><ChuGiai mau={MAU.cham} nhan="Chậm" /><ChuGiai mau={MAU.thieu} nhan="Thiếu" />
                  <span>Không đưa vào xếp hạng: {d.xep_hang_bo_qua.join(', ')} — việc của những người này vẫn tính trong số của trung tâm.</span>
                </div>
              )}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className={TH}>Khâu</th>
                    <th className={`${TH} text-right`}>Việc tới hạn</th>
                    <th className={TH}>Đúng chuẩn</th>
                    <th className={TH}>Chậm</th>
                    <th className={TH}>Thiếu</th>
                    <DauXuHuong hienSo={hienSo} tuan={tuan} nhan="Xu hướng đúng chuẩn" />
                    <th className={TH} />
                  </tr>
                </thead>
                <tbody>
                  {d.so.khau.map((k) => (
                    <DongViec key={k.ma} ma={k.ma} ten={k.ten} k={k} d={d} tra={tra} hienSo={hienSo} tuan={tuan} soCot={soCotViec} moSan={moSan} />
                  ))}
                  <DongViec ma="tong" ten="Cả trung tâm" k={d.so.tong_khau} d={d} tra={tra} hienSo={hienSo} tuan={tuan} soCot={soCotViec} />
                </tbody>
              </table>
            </Khung>
          )
        }
        const ds = d.chi_so.filter((c) => c.bang === b.ma)
        if (ds.length === 0) return null
        return (
          <Khung key={b.ma} ten={b.ten} phu={PHU_BANG[b.ma]} chan={<ChanBang ma={b.ma} d={d} moSan={moSan} />}>
            <BangChiSo ds={ds} hienSo={hienSo} tuan={tuan} />
          </Khung>
        )
      })}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
        <div className="text-[12px] font-semibold text-slate-600">Cách tính đang dùng</div>
        <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11.5px] leading-relaxed text-slate-500">
          {d.cach_tinh.map((g, i) => <li key={i}>{g}</li>)}
          <li>Cột xu hướng: đường ngang xám là thường đạt; chấm rỗng (hoặc dấu * khi xem số) là lần đo bị coi là nhiễu.</li>
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
  const [hienSo, setHienSo] = useState(NHO.hienSo)
  const [chieu, setChieu] = useState(false)
  const khung = useRef<HTMLDivElement>(null)
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

  // Trạng thái trình chiếu đi theo trình duyệt (người xem bấm Esc cũng phải về lại bình thường).
  useEffect(() => {
    const nghe = () => setChieu(document.fullscreenElement === khung.current)
    document.addEventListener('fullscreenchange', nghe)
    return () => document.removeEventListener('fullscreenchange', nghe)
  }, [])
  function trinhChieu() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else khung.current?.requestFullscreen().catch(() => setLoi('Trình duyệt không cho phóng toàn màn hình.'))
  }

  // Đổi TUẦN = đổi ngữ cảnh ⇒ bỏ số tuần cũ rồi tải, để số tuần trước không đứng dưới nhãn tuần mới.
  function doi(n: number) {
    if (!d) return
    const t = congNgay(d.tu, n)
    setD(NHO.theoTuan[t] ?? null); setTuan(t); tai(t)
  }
  const coTuanSau = !!d && congNgay(d.tu, 7) <= homNay
  const nut = 'rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12.5px] text-slate-600 hover:bg-slate-50 disabled:opacity-40'

  return (
    <div ref={khung} className={chieu ? 'h-full overflow-y-auto bg-slate-50 p-6' : ''}>
      <div style={chieu ? { zoom: 1.3 } : undefined}>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <button onClick={() => doi(-7)} disabled={!d || dangTai} aria-label="Tuần trước" className={nut}>‹</button>
          <div className="min-w-[190px] text-center text-[15px] font-semibold text-slate-900">
            {chieu && 'Tổng kết '}
            {d ? <>tuần {ddmm(d.tu)} – {ddmm(d.den)}</> : tuan ? <>tuần {ddmm(tuan)} – {ddmm(congNgay(tuan, 6))}</> : 'tuần vừa rồi'}
          </div>
          <button onClick={() => doi(7)} disabled={!coTuanSau || dangTai} aria-label="Tuần sau" className={nut}>›</button>
          <div className="ml-auto flex flex-wrap gap-1.5">
            <button onClick={() => { NHO.hienSo = !hienSo; setHienSo(!hienSo) }} disabled={!d}
              className={hienSo ? 'rounded-lg border border-indigo-500 bg-indigo-600 px-2.5 py-1 text-[12.5px] text-white' : nut}>Số từng tuần</button>
            <button onClick={trinhChieu} disabled={!d} className={nut}>{chieu ? 'Thoát trình chiếu' : 'Trình chiếu'}</button>
            <button onClick={() => d && tai(d.tu, true)} disabled={!d || dangTai} className={nut}>↻ Tính lại</button>
          </div>
        </div>

        {loi && <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">Lỗi: {loi}</div>}
        {!d && dangTai && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-400">Đang tính tổng kết tuần…</div>}
        {d && <BanTongKetTuan d={d} mo={dangTai} hienSo={hienSo} />}
      </div>
    </div>
  )
}
