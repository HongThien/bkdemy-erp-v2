// BÁO CÁO TUẦN TRƯỞNG KHỐI (spec-bao-cao-tuan.md · Thùy 03/11) — mở từ đồ vật "📝 Báo cáo tuần" trong Phòng làm việc.
// Kỳ = T2 → CN tuần trước. Nháp: số tính trực tiếp ở DB. Bấm NỘP: DB tính + ghi SNAP cùng transaction — từ đó chỉ đọc bản đã snap.
// Client KHÔNG tính số nào: mọi tỉ lệ / tổng / trend đến từ fn_bctk_so · fn_bctk_trend. Màn chỉ hiển thị + nhận phần chữ / phần cá nhân.
// Laptop thấp ⇒ dàn NGANG: hàng 5 ô chỉ số · (bảng từng lớp | HS còn yếu) · (cá nhân | tự viết).
import { useEffect, useState } from 'react'
import { layBaoCaoTuan, luuNhapBaoCao, nopBaoCao, type BaoCaoTuan, type DongCaNhan, type TuViet } from '../../lib/baoCaoTuan'
import { congNgay, ddmmVN } from '../../lib/tuan'

const NHO: { tuan: string | null } = { tuan: null }   // tuần đang xem — sống tới F5
const TT: Record<string, [string, string]> = {
  nhap: ['Nháp — chưa nộp', 'bg-slate-100 text-slate-600'], da_nop: ['Đã nộp — chờ duyệt', 'bg-sky-100 text-sky-700'],
  tra_lai: ['Bị trả lại — sửa phần chữ rồi nộp lại', 'bg-amber-100 text-amber-800'], da_duyet: ['Đã duyệt', 'bg-emerald-100 text-emerald-700'],
}
const XU_LY: Record<string, [string, string]> = {
  chua: ['Chưa xử lý', 'bg-rose-50 text-rose-700'], bo_tro_yeu: ['Đang bổ trợ Yếu', 'bg-violet-50 text-violet-700'],
  ca_nhe: ['Có ca Nhẹ', 'bg-indigo-50 text-indigo-700'], theo_doi: ['Đang theo dõi', 'bg-amber-50 text-amber-800'],
}
const so = (v: number | null | undefined, hau = '') => (v == null ? '—' : `${v}${hau}`)
const gio = (ts: string | null) => ts ? new Date(ts).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'

export default function BaoCaoTuanTK() {
  const [tuan, setTuanS] = useState<string | null>(NHO.tuan)
  const setTuan = (t: string) => { NHO.tuan = t; setTuanS(t) }
  const [bc, setBc] = useState<BaoCaoTuan | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [caNhan, setCaNhan] = useState<DongCaNhan[]>([])
  const [tuViet, setTuViet] = useState<TuViet>({})
  const [dang, setDang] = useState<'' | 'luu' | 'nop'>('')
  const [bao, setBao] = useState<string | null>(null)

  useEffect(() => {   // đổi tuần = đổi ngữ cảnh ⇒ tải lại
    let con = true
    setBc(null); setLoi(null)
    layBaoCaoTuan(tuan ?? undefined).then((d) => {
      if (!con) return
      setBc(d); setCaNhan(d.ca_nhan ?? []); setTuViet(d.tu_viet ?? {})
      if (!tuan && d.tuan) { NHO.tuan = d.tuan; setTuanS(d.tuan) }
    }).catch((e) => { if (con) setLoi(e?.message ?? String(e)) })
    return () => { con = false }
  }, [tuan])

  const sua = bc ? bc.trang_thai === 'nhap' || bc.trang_thai === 'tra_lai' : false
  const uuTien = [0, 1, 2].map((i) => tuViet.uu_tien?.[i] ?? '')
  const thieu = !(tuViet.nhan_dinh ?? '').trim() || !uuTien.some((u) => u.trim())
  const bao2s = (m: string) => { setBao(m); setTimeout(() => setBao(null), 2200) }
  async function luu() {
    if (!bc) return
    setDang('luu')
    try { await luuNhapBaoCao(bc.tuan, caNhan, tuViet); bao2s('Đã lưu nháp') } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang('') }
  }
  async function nop() {
    if (!bc) return
    setDang('nop')
    try { const d = await nopBaoCao(bc.tuan, caNhan, tuViet); setBc(d); setCaNhan(d.ca_nhan ?? []); setTuViet(d.tu_viet ?? {}); bao2s('Đã nộp — số đã được chốt') }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang('') }
  }
  const doiTuan = (n: number) => bc && setTuan(congNgay(bc.tuan, 7 * n))

  if (loi && !bc) return <p className="text-[13px] text-rose-600">Lỗi: {loi}</p>
  if (!bc) return <p className="text-[13px] text-slate-400">Đang tính báo cáo…</p>
  if (!bc.co_bao_cao) return <p className="text-[13px] text-slate-500">Bạn chưa được phân công làm trưởng khối ô nào, nên không có báo cáo tuần.</p>
  const t = bc.so.tong
  const ten = (o: { mon: string; khoi: string }) => `${o.mon === 'Toán' ? '' : `${o.mon} `}${o.khoi}`
  return (
    <div className="space-y-3">
      {/* 1 hàng: kỳ · đổi tuần · khối · hạn · trạng thái · nút */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => doiTuan(-1)} className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] hover:bg-slate-50" title="Tuần trước">‹</button>
        <span className="text-[15px] font-bold text-slate-800">Báo cáo tuần {ddmmVN(bc.tuan)} – {ddmmVN(bc.den)}</span>
        <button onClick={() => doiTuan(1)} className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] hover:bg-slate-50" title="Tuần sau">›</button>
        <span className="text-[12.5px] text-slate-500">Khối {bc.o.map(ten).join(' · ')}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${TT[bc.trang_thai][1]}`}>{TT[bc.trang_thai][0]}</span>
        <span className={`text-[12px] ${bc.qua_han && bc.trang_thai === 'nhap' ? 'font-semibold text-rose-600' : 'text-slate-500'}`}>
          Hạn {gio(bc.han)}{bc.nop_at ? ` · nộp ${gio(bc.nop_at)}${bc.tre ? ' (trễ)' : ''}` : ''}
        </span>
        <span className="ml-auto flex items-center gap-2">
          {bao && <span className="text-[12.5px] text-emerald-600">{bao}</span>}
          {loi && <span className="max-w-[360px] truncate text-[12px] text-rose-600" title={loi}>{loi}</span>}
          {sua && <button onClick={luu} disabled={!!dang} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">{dang === 'luu' ? 'Đang lưu…' : 'Lưu nháp'}</button>}
          {sua && (
            <button onClick={nop} disabled={!!dang || thieu || !bc.ky_xong}
              title={!bc.ky_xong ? 'Tuần chưa kết thúc' : thieu ? 'Cần Nhận định + ít nhất 1 việc ưu tiên' : 'Nộp — số được chốt, không tính lại'}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">
              {dang === 'nop' ? 'Đang nộp…' : bc.trang_thai === 'tra_lai' ? 'Nộp lại' : 'Nộp báo cáo'}
            </button>
          )}
        </span>
      </div>
      {bc.trang_thai === 'tra_lai' && bc.tra_lai_ly_do && <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-[12.5px] text-amber-800">Lý do trả lại: {bc.tra_lai_ly_do}</p>}
      <p className="text-[11.5px] text-slate-400">
        {bc.trang_thai === 'nhap' ? 'Số đang tính trực tiếp — bấm Nộp thì số được chốt (snap), không tính lại.' : `Số đã chốt lúc nộp ${gio(bc.nop_at)}.`}
        {!bc.so.co_anh_dau && ' · Chưa có ảnh dạng yếu đầu tuần (hệ chụp tự động 00:00 thứ 2 — bắt đầu từ tuần này) nên chưa so được dạng yếu / HS yếu.'}
      </p>

      {/* HÀNG 1 — 5 nhóm chỉ số toàn khối + trend 4 tuần */}
      <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        <O ten="Chấm ET" chinh={so(t.et.ti_le_dung_han, '%')} nhanChinh="đúng hạn" phu={`Điểm TB ${so(t.et.diem_tb)} · ${t.et.dung_han}/${t.et.so_viec} buổi`}
          trend={bc.so.trend.map((w) => w.tong.et.ti_le_dung_han)} mau="text-sky-600" />
        <O ten="BTVN" chinh={so(t.btvn.ti_le_nop, '%')} nhanChinh="nộp" phu={`Điểm TB ${so(t.btvn.diem_tb)} · đúng hạn ${so(t.btvn.ti_le_dung_han, '%')}`}
          trend={bc.so.trend.map((w) => w.tong.btvn.ti_le_nop)} mau="text-teal-600" />
        <O ten="Dạng yếu" chinh={`${so(t.dang_yeu.dau)} → ${so(t.dang_yeu.cuoi)}`} nhanChinh="đầu → cuối"
          phu={`Giảm ${so(t.dang_yeu.giam)} (${so(t.dang_yeu.ti_le_giam, '%')})${t.dong_chay ? ` · Vào ${t.dong_chay.vao} · Ra ${t.dong_chay.ra_bang_chung} có bằng chứng · ${t.dong_chay.ra_cua_so} rớt cửa sổ` : ''} · Độ phủ đo ${so(t.do_phu.ti_le, '%')}`}
          trend={bc.so.trend.map((w) => w.tong.dang_yeu.cuoi)} mau="text-rose-600" />
        <O ten="Học sinh yếu" chinh={`${so(t.hs_yeu.dau)} → ${so(t.hs_yeu.cuoi)}`} nhanChinh={`/ ${t.hs_yeu.si_so} em`}
          phu={`Giảm ${so(t.hs_yeu.giam)} (${so(t.hs_yeu.ti_le_giam, '%')})`}
          trend={bc.so.trend.map((w) => w.tong.hs_yeu.cuoi)} mau="text-violet-600" />
        <O ten="Bổ trợ" chinh={`${t.bo_tro.ca_yeu} + ${t.bo_tro.ca_nhe}`} nhanChinh="ca Yếu + Nhẹ"
          phu={`${t.bo_tro.luot_hs} lượt em · độ phủ ${so(t.bo_tro.do_phu, '%')} · hết yếu sau ca ${so(t.bo_tro.het_yeu_sau_ca)}`}
          trend={bc.so.trend.map((w) => w.tong.bo_tro.ca_yeu + w.tong.bo_tro.ca_nhe)} mau="text-indigo-600" />
      </div>

      {/* HÀNG 2 — từng lớp | HS còn yếu */}
      <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
        <Khung ten="Từng lớp">
          <table className="w-full text-[12.5px]">
            <thead><tr className="text-left text-[10.5px] uppercase tracking-wider text-slate-400">
              <th className="py-1">Lớp</th><th>ET đúng hạn</th><th>ET TB</th><th>BTVN nộp</th><th>BTVN TB</th><th>Dạng yếu</th><th>HS yếu</th>
            </tr></thead>
            <tbody>{bc.so.lop.map((l) => (
              <tr key={l.lop_id} className="border-t border-slate-100">
                <td className="py-1.5 font-semibold text-slate-800">{l.ten_lop}</td>
                <td>{so(l.et.ti_le_dung_han, '%')} <span className="text-slate-400">({l.et.dung_han}/{l.et.so_viec})</span></td>
                <td>{so(l.et.diem_tb)}</td>
                <td>{so(l.btvn.ti_le_nop, '%')}</td>
                <td>{so(l.btvn.diem_tb)}</td>
                <td>{so(l.dang_yeu.dau)} → <b className="text-rose-600">{so(l.dang_yeu.cuoi)}</b></td>
                <td>{so(l.hs_yeu.dau)} → <b className="text-violet-600">{so(l.hs_yeu.cuoi)}</b><span className="text-slate-400">/{l.hs_yeu.si_so}</span></td>
              </tr>
            ))}</tbody>
          </table>
          {bc.so.lop.length === 0 && <p className="py-2 text-[12.5px] text-slate-400">Không có lớp nào trong kỳ.</p>}
        </Khung>
        <Khung ten={`HS còn yếu cuối tuần (${bc.so.hs_con_yeu.length})`}>
          {!bc.so.co_anh_cuoi ? <p className="text-[12.5px] text-slate-400">Chưa có ảnh cuối tuần (chụp 00:00 thứ 2 tuần sau).</p>
            : bc.so.hs_con_yeu.length === 0 ? <p className="text-[12.5px] text-slate-400">Không còn em nào yếu. 👏</p> : (
            <ul className="max-h-[280px] space-y-1 overflow-auto pr-1">{bc.so.hs_con_yeu.map((h) => (
              <li key={`${h.hoc_sinh_id}|${h.mon}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1 text-[12.5px]">
                <span className="min-w-0 flex-1 truncate" title={h.dang.join(' · ')}><b className="text-slate-800">{h.ho_ten}</b> <span className="text-slate-500">· {h.ten_lop} · {h.so_dang_yeu} dạng</span></span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${XU_LY[h.xu_ly][1]}`}>{XU_LY[h.xu_ly][0]}</span>
              </li>
            ))}</ul>
          )}
        </Khung>
      </div>

      {/* HÀNG 3 — cá nhân | tự viết */}
      <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
        <Khung ten="Cá nhân — việc phát triển được giao">
          {caNhan.length === 0 ? <p className="text-[12.5px] text-slate-400">Không có việc phát triển nào trong kỳ.</p> : (
            <table className="w-full text-[12.5px]">
              <thead><tr className="text-left text-[10.5px] uppercase tracking-wider text-slate-400">
                <th className="py-1">Việc</th><th>Hạn</th><th className="w-[130px]">Trạng thái</th><th>Mô tả (lưu ý, khó khăn…)</th><th className="w-[70px]">% xong</th>
              </tr></thead>
              <tbody>{caNhan.map((d, i) => {
                const doi = (p: Partial<DongCaNhan>) => setCaNhan((prev) => prev.map((x, j) => (j === i ? { ...x, ...p } : x)))
                const khoa = d.tu_dien || !sua
                return (
                  <tr key={d.task_id} className="border-t border-slate-100 align-top">
                    <td className="py-1.5 pr-2 font-medium text-slate-800">{d.tieu_de}{d.tu_dien && <span className="ml-1 text-[10.5px] text-emerald-600">✓ đã duyệt</span>}</td>
                    <td className="whitespace-nowrap pr-2 text-slate-500">{ddmmVN(d.han)}{d.so_lan_gia_han > 0 ? ` · gia hạn ${d.so_lan_gia_han}` : ''}</td>
                    <td className="pr-2">{khoa ? <span className="text-slate-700">{d.trang_thai}</span>
                      : <input value={d.trang_thai} onChange={(e) => doi({ trang_thai: e.target.value })} className="w-full rounded border border-slate-200 px-1.5 py-0.5" />}</td>
                    <td className="pr-2">{khoa ? <span className="text-slate-600">{d.mo_ta || '—'}</span>
                      : <textarea value={d.mo_ta} onChange={(e) => doi({ mo_ta: e.target.value })} rows={1} className="w-full resize-y rounded border border-slate-200 px-1.5 py-0.5" />}</td>
                    <td>{khoa ? <span className="font-semibold text-slate-700">{so(d.pct, '%')}</span>
                      : <input type="number" min={0} max={100} value={d.pct ?? ''} onChange={(e) => doi({ pct: e.target.value === '' ? null : Number(e.target.value) })} className="w-full rounded border border-slate-200 px-1.5 py-0.5" />}</td>
                  </tr>
                )
              })}</tbody>
            </table>
          )}
        </Khung>
        <Khung ten="Tự viết — Plans · Progress · Problems">
          <label className="block text-[11.5px] font-semibold text-slate-500">Nhận định tình hình khối <span className="text-rose-500">*</span></label>
          <textarea disabled={!sua} value={tuViet.nhan_dinh ?? ''} onChange={(e) => setTuViet((v) => ({ ...v, nhan_dinh: e.target.value }))} rows={3}
            className="mb-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-[13px] disabled:bg-slate-50" placeholder="Đọc số thấy gì, vì sao…" />
          <label className="block text-[11.5px] font-semibold text-slate-500">3 việc ưu tiên tuần tới <span className="text-rose-500">*</span></label>
          {uuTien.map((u, i) => (
            <input key={i} disabled={!sua} value={u} placeholder={`Việc ${i + 1}`}
              onChange={(e) => setTuViet((v) => { const a = [0, 1, 2].map((k) => v.uu_tien?.[k] ?? ''); a[i] = e.target.value; return { ...v, uu_tien: a } })}
              className="mb-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-[13px] disabled:bg-slate-50" />
          ))}
          <label className="mt-1 block text-[11.5px] font-semibold text-slate-500">Cần hỗ trợ gì</label>
          <textarea disabled={!sua} value={tuViet.can_ho_tro ?? ''} onChange={(e) => setTuViet((v) => ({ ...v, can_ho_tro: e.target.value }))} rows={2}
            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[13px] disabled:bg-slate-50" placeholder="Từ trưởng bộ môn / CEO…" />
        </Khung>
      </div>
    </div>
  )
}

// Ô chỉ số: số chính to + dòng phụ + 4 cột trend (chỉ vẽ dãy số DB trả về, không tính gì).
function O({ ten, chinh, nhanChinh, phu, trend, mau }: { ten: string; chinh: string; nhanChinh: string; phu: string; trend: (number | null)[]; mau: string }) {
  const lon = Math.max(1, ...trend.map((v) => v ?? 0))
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{ten}</div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-[24px] font-extrabold leading-tight ${mau}`}>{chinh}</span>
        <span className="text-[11.5px] text-slate-400">{nhanChinh}</span>
      </div>
      <div className="text-[11.5px] leading-snug text-slate-500">{phu}</div>
      <div className="mt-1.5 flex h-7 items-end gap-1" title="4 tuần gần nhất (cũ → mới)">
        {trend.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end">
            <div className={`w-full rounded-t ${i === trend.length - 1 ? 'bg-indigo-400' : 'bg-slate-200'}`} style={{ height: v == null ? 2 : `${Math.max(8, (v / lon) * 100)}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

const Khung = ({ ten, children }: { ten: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
    <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{ten}</p>
    {children}
  </div>
)
