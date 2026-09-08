// Kết quả khảo sát (spec-khao-sat-hs.md §5): tổng quan + 4 query — TẤT CẢ là view/fn ở DB (v_khao_sat_*), client chỉ render.
import { useEffect, useState } from 'react'
import {
  tongQuan, cumTruong, cumToa, kenh, vector, lead,
  type TongQuan, type CumTruong, type CumToa, type Kenh, type VectorRow, type LeadRow,
  LY_DO_LABEL, LOAI_CANH_LABEL, NOI_O_LABEL, QUEN_TU_LABEL, QUAN_HE_LABEL, CO_KHONG_LABEL,
} from '../../lib/khaosat'

type Data = { tq: TongQuan; truong: CumTruong[]; toa: CumToa[]; kenh: Kenh[]; vec: VectorRow[]; lead: LeadRow[] }

function Tile({ n, label, tone = 'text-slate-800' }: { n: number | string; label: string; tone?: string }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
      <div className={`text-xl font-bold ${tone}`}>{n}</div>
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
    </div>
  )
}
function Box({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2.5">
        <div className="text-[13px] font-semibold text-slate-800">{title}</div>
        {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
      </div>
      <div className="overflow-x-auto p-3">{children}</div>
    </section>
  )
}
const th = 'px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500'
const td = 'px-2 py-1.5 text-[13px] text-slate-700 align-top'
const Pill = ({ children, tone }: { children: React.ReactNode; tone: string }) => <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${tone}`}>{children}</span>

export default function KetQuaTab() {
  const [d, setD] = useState<Data | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    Promise.all([tongQuan(), cumTruong(), cumToa(), kenh(), vector(), lead()])
      .then(([tq, truong, toa, k, vec, l]) => setD({ tq, truong, toa, kenh: k, vec, lead: l }))
      .catch((e) => setLoi(e.message ?? String(e)))
  }, [])
  if (loi) return <div className="text-sm text-rose-600">{loi}</div>
  if (!d) return <div className="py-10 text-center text-sm text-slate-400">Đang tải…</div>
  const { tq } = d

  return (
    <div>
      <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Tile n={`${tq.so_da_lam}/${tq.so_hs_dang_hoc}`} label="HS đã làm / đang học" tone="text-indigo-700" />
        <Tile n={tq.so_canh} label="Cạnh (tên được nêu)" />
        <Tile n={tq.so_canh_da_khop} label="Cạnh đã khớp HS BK" tone="text-emerald-700" />
        <Tile n={tq.so_canh_ngoai_bk} label="Cạnh ngoài BK" />
        <Tile n={tq.uu_tien} label="HS có cờ ưu tiên (ban PH / chức vụ toà)" tone="text-amber-700" />
        <Tile n={tq.noi_o.map((x) => `${NOI_O_LABEL[x.loai]} ${x.n}`).join(' · ') || '—'} label="Nơi ở" />
      </div>
      <div className="mb-5 flex flex-wrap gap-2 text-[12px]">
        {tq.ly_do.map((x) => <Pill key={String(x.ly_do)} tone="bg-violet-50 text-violet-700 ring-violet-200">Vì sao vào: {x.ly_do ? LY_DO_LABEL[x.ly_do] : 'không trả lời'} · {x.n}</Pill>)}
        {tq.loai_canh.map((x) => <Pill key={x.loai} tone="bg-sky-50 text-sky-700 ring-sky-200">{LOAI_CANH_LABEL[x.loai]} · {x.n}</Pill>)}
      </div>

      <div className="grid grid-cols-1 gap-x-5 lg:grid-cols-2">
        <Box title="1. Mật độ cụm theo (trường, lớp)" sub="Đọc từ hồ sơ HS đang học (đã điền trường/lớp). Cụm 1 HS = đơn độc.">
          <table className="w-full"><thead><tr><th className={th}>Trường</th><th className={th}>Lớp</th><th className={th}>HS</th><th className={th}>Ai</th></tr></thead>
            <tbody>{d.truong.map((r, i) => <tr key={i} className="border-t border-slate-100"><td className={td}>{r.truong_hoc}</td><td className={td}>{r.lop_truong ?? <span className="text-slate-300">?</span>}</td><td className={`${td} font-semibold ${r.don_doc ? 'text-slate-400' : 'text-indigo-700'}`}>{r.so_hs}</td><td className={`${td} text-[12px] text-slate-500`}>{r.hs.join(', ')}</td></tr>)}</tbody></table>
        </Box>
        <Box title="1b. Mật độ cụm theo (toà, tầng)" sub="Chỉ HS ở chung cư.">
          <table className="w-full"><thead><tr><th className={th}>Toà</th><th className={th}>Tầng</th><th className={th}>HS</th><th className={th}>Ai</th></tr></thead>
            <tbody>{d.toa.map((r, i) => <tr key={i} className="border-t border-slate-100"><td className={td}>{r.toa}</td><td className={td}>{r.tang ?? <span className="text-slate-300">?</span>}</td><td className={`${td} font-semibold ${r.don_doc ? 'text-slate-400' : 'text-indigo-700'}`}>{r.so_hs}</td><td className={`${td} text-[12px] text-slate-500`}>{r.hs.join(', ')}</td></tr>)}
              {!d.toa.length && <tr><td className={`${td} text-slate-400`} colSpan={4}>Chưa có dữ liệu.</td></tr>}</tbody></table>
        </Box>
      </div>

      <Box title="2. Kênh quen biết" sub="Cạnh 'Biết bạn' đã khớp HS BK. Hai chiều = B cũng khai A ⇒ quan hệ mạnh.">
        <table className="w-full"><thead><tr><th className={th}>Quen từ</th><th className={th}>Ai chơi với ai</th><th className={th}>Số cạnh</th><th className={th}>Hai chiều</th></tr></thead>
          <tbody>{d.kenh.map((r, i) => <tr key={i} className="border-t border-slate-100"><td className={td}>{r.quen_tu ? QUEN_TU_LABEL[r.quen_tu] : '—'}</td><td className={td}>{r.quan_he ? QUAN_HE_LABEL[r.quan_he] : '—'}</td><td className={`${td} font-semibold`}>{r.so_canh}</td><td className={td}>{r.so_hai_chieu}</td></tr>)}
            {!d.kenh.length && <tr><td className={`${td} text-slate-400`} colSpan={4}>Chưa có cạnh 'Biết bạn' nào được khớp — vào tab Khớp tên trước.</td></tr>}</tbody></table>
      </Box>

      <Box title="3. Vector trẻ — danh sách gọi xác nhận" sub="Xếp theo số bạn đã rủ THÀNH CÔNG giảm dần, rồi cờ ưu tiên (ban PH lớp / chức vụ toà). Cờ ưu tiên là gợi ý, không phải sự thật.">
        <table className="w-full"><thead><tr><th className={th}>HS</th><th className={th}>Trường / lớp / toà</th><th className={th}>Vì sao vào</th><th className={th}>Đã rủ (thành công)</th><th className={th}>Biết</th><th className={th}>Muốn rủ</th><th className={th}>Ưu tiên</th><th className={th}>Nghề bố mẹ</th><th className={th}>PH</th></tr></thead>
          <tbody>{d.vec.map((r) => (
            <tr key={r.hoc_sinh_id} className="border-t border-slate-100">
              <td className={`${td} font-semibold`}>{r.ho_ten} <span className="font-normal text-slate-400">K{r.khoi}</span></td>
              <td className={`${td} text-[12px]`}>{[r.truong_hoc, r.lop_truong, r.toa ? `${r.toa}${r.tang ? ` T${r.tang}` : ''}` : null].filter(Boolean).join(' · ')}</td>
              <td className={td}>{r.ly_do_vao ? LY_DO_LABEL[r.ly_do_vao] : '—'}{r.nguoi_ru && <span className="block text-[11px] text-slate-400">bởi {r.nguoi_ru}</span>}</td>
              <td className={`${td} font-semibold ${r.so_da_ru_co > 0 ? 'text-emerald-700' : ''}`}>{r.so_da_ru} ({r.so_da_ru_co})</td>
              <td className={td}>{r.so_biet}</td><td className={td}>{r.so_muon_ru}</td>
              <td className={td}>{r.uu_tien ? <Pill tone="bg-amber-50 text-amber-700 ring-amber-200">{[r.bo_me_ban_ph_lop === 'co' ? 'Ban PH' : null, r.bo_me_chuc_vu_toa === 'co' ? 'Chức vụ toà' : null].filter(Boolean).join(' + ')}</Pill> : <span className="text-[11px] text-slate-400">{r.bo_me_ban_ph_lop ? CO_KHONG_LABEL[r.bo_me_ban_ph_lop] : '—'}</span>}</td>
              <td className={`${td} text-[12px]`}>{r.nghe_bo_me ?? '—'}</td>
              <td className={`${td} text-[12px]`}>{r.ph_ten ?? '—'}{r.ph_sdt && <span className="block font-mono text-slate-500">{r.ph_sdt}</span>}</td>
            </tr>
          ))}{!d.vec.length && <tr><td className={`${td} text-slate-400`} colSpan={9}>Chưa HS nào làm khảo sát.</td></tr>}</tbody></table>
      </Box>

      <Box title="4. Lead — bạn trẻ MUỐN rủ" sub="Gom theo HS ⇒ giao người gọi PH của HS đó. Tên trẻ ngoài BK chỉ dùng qua PH của HS đã khai — BK KHÔNG tự liên hệ nhà kia (§0.4).">
        <table className="w-full"><thead><tr><th className={th}>HS</th><th className={th}>PH</th><th className={th}>Ưu tiên</th><th className={th}>Muốn rủ</th></tr></thead>
          <tbody>{d.lead.map((r) => (
            <tr key={r.hoc_sinh_id} className="border-t border-slate-100">
              <td className={`${td} font-semibold`}>{r.ho_ten} <span className="font-normal text-slate-400">K{r.khoi}</span></td>
              <td className={`${td} text-[12px]`}>{r.ph_ten ?? '—'}{r.ph_sdt && <span className="block font-mono text-slate-500">{r.ph_sdt}</span>}</td>
              <td className={td}>{r.uu_tien && <Pill tone="bg-amber-50 text-amber-700 ring-amber-200">ưu tiên</Pill>}</td>
              <td className={td}><div className="flex flex-wrap gap-1.5">{r.leads.map((l) => <Pill key={l.id} tone={l.da_khop ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-50 text-slate-700 ring-slate-200'}>{l.ten}{l.ghi_chu ? ` (${l.ghi_chu})` : ''}{l.da_khop ? ' ✓ đã vào' : ''}</Pill>)}</div></td>
            </tr>
          ))}{!d.lead.length && <tr><td className={`${td} text-slate-400`} colSpan={4}>Chưa có lead.</td></tr>}</tbody></table>
      </Box>
    </div>
  )
}
