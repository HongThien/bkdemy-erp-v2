// ============================================================================
// 💸 CHI PHÍ AI — Phòng làm việc Giám đốc (Thùy 23/11): "t cần biết ai sử dụng bao nhiêu token để còn tính toán xem hiệu quả hay ko".
// Một lượt gọi fn_ai_chi_phi(từ, đến) cho cả màn (mig 202611231754); mọi tổng / tiền / việc làm ra tính ở DB, màn chỉ hiển thị.
// Tiền = giá API chính thức × token (hoặc chi phí Claude Code tự báo). Phiên Claude chạy bằng gói thuê bao ⇒ "giá trị tương đương", không phải tiền đã trả.
// ============================================================================
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../../lib/supabase'

type Nguoi = {
  nhan_su_id: string | null; ten: string; luot: number; usd: number; tok: number; vao: number; ghi: number; doc: number; ra: number
  co_uoc: boolean; co_chua_gia: boolean; kenh: Record<string, number> | null
  cau_vao_kho: number; cau_phan_dang: number; lenh_sua_kho: number; anh: number; lenh_ban_do: number; usd_moi_cau: number | null
}
type Dl = {
  tu: string; den: string; vnd_moi_usd: number; model_mac_dinh: string; luc: string
  tong: { luot: number; usd: number; usd_thue_bao: number; usd_tra_that: number; vao: number; ghi: number; doc: number; ra: number; so_nguoi: number; luot_uoc: number; luot_chua_gia: number }
  theo_nguoi: Nguoi[]
  theo_kenh: { kenh: string; luot: number; usd: number; tok: number; thue_bao: boolean }[]
  theo_model: { model: string; luot: number; usd: number; tok: number; co_gia: boolean }[]
  theo_ngay: { ngay: string; luot: number; usd: number }[]
  theo_loai: { loai: string; luot: number; usd: number }[]
  top_phien: { phien_id: string; tieu_de: string; ten: string; mon: string; khoi: string; loai: string; luot: number; usd: number }[]
}

const KENH: Record<string, string> = { phien: '🤖 Phiên Claude', tro_ly: '💬 Trợ lý', hoi_dap: '❓ Hỏi đáp nhân sự', danh_gia: '📝 Đánh giá AI', cham_btvn: '✍️ Chấm BTVN bằng máy', claude_code: '💻 Claude Code (Thùy)' }
const LOAI_PHIEN: Record<string, string> = { ban_do: 'Bản đồ', ly_thuyet: 'Lý thuyết dạng', nhap_kho: 'Nhập kho & phân dạng', bao_sai: 'Câu báo sai', giai_bai: 'Giải bài từ ảnh' }

// Ngày theo giờ máy (VN), không dùng toISOString (CLAUDE §2 Timezone)
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const homNay = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }
const truoc = (n: number) => { const d = homNay(); d.setDate(d.getDate() - n); return d }
const dauThang = () => { const d = homNay(); d.setDate(1); return d }
const KHOANG: { k: string; ten: string; tu: () => Date }[] = [
  { k: '7', ten: '7 ngày', tu: () => truoc(6) },
  { k: 'thang', ten: 'Tháng này', tu: dauThang },
  { k: '30', ten: '30 ngày', tu: () => truoc(29) },
  { k: '90', ten: '90 ngày', tu: () => truoc(89) },
]
const NHO: { k: string; dl: Dl | null } = { k: 'thang', dl: null }   // sống tới F5: quay lại màn không trắng

const soNgan = (n: number) => n >= 1e9 ? `${(n / 1e9).toFixed(2)} tỷ` : n >= 1e6 ? `${(n / 1e6).toFixed(1)} tr` : n >= 1e3 ? `${(n / 1e3).toFixed(1)} N` : String(n)

export default function ChiPhiAi() {
  const [k, setK] = useState(NHO.k)
  const [dl, setDl] = useState<Dl | null>(NHO.dl)
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [moNguoi, setMoNguoi] = useState<string | null>(null)

  async function tai(kk: string) {
    const kh = KHOANG.find((x) => x.k === kk) ?? KHOANG[1]
    setDang(true); setLoi(null)
    const { data, error } = await supabase.rpc('fn_ai_chi_phi', { p_tu: ymd(kh.tu()), p_den: ymd(homNay()) })
    setDang(false)
    if (error) { setLoi(error.message); return }
    NHO.dl = data as Dl; setDl(data as Dl)
  }
  useEffect(() => { if (!NHO.dl) tai(k) }, [])   // eslint-disable-line react-hooks/exhaustive-deps
  const doiK = (kk: string) => { NHO.k = kk; setK(kk); tai(kk) }

  const tg = dl?.vnd_moi_usd ?? 0
  const dong = (usd: number | null | undefined) => usd == null ? '—' : `${Math.round(usd * tg).toLocaleString('vi-VN')}đ`
  const maxNgay = Math.max(1, ...(dl?.theo_ngay ?? []).map((x) => x.usd))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[17px] font-bold text-slate-800">💸 Chi phí AI</h2>
        <span className="text-[12px] text-slate-500">ai dùng bao nhiêu token · quy ra tiền theo giá API · đổi lại được bao nhiêu việc</span>
        <div className="ml-auto flex flex-wrap gap-1 text-[12.5px]">
          {KHOANG.map((x) => (
            <button key={x.k} onClick={() => doiK(x.k)} className={`rounded-full px-3 py-1 ${k === x.k ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{x.ten}</button>
          ))}
          <button onClick={() => tai(k)} title="Tính lại" className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 hover:bg-slate-200">↻</button>
        </div>
      </div>
      {loi && <p className="text-[12.5px] text-red-600">{loi}</p>}
      {!dl && <p className="py-10 text-center text-[13px] text-slate-400">{dang ? 'Đang tính…' : 'Chưa có số.'}</p>}
      {dl && (
        <div className={dang ? 'space-y-4 opacity-60' : 'space-y-4'}>
          {/* Ô số */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <O nhan="Tổng chi phí quy đổi" so={dong(dl.tong.usd)} phu={`$${dl.tong.usd.toFixed(2)} · ${dl.tong.luot} lượt · ${dl.tong.so_nguoi} người`} />
            <O nhan="Gói thuê bao (giá trị tương đương)" so={dong(dl.tong.usd_thue_bao)} phu="Phiên Claude + Claude Code của Thùy — không trả theo token" />
            <O nhan="Trả theo token thật (API)" so={dong(dl.tong.usd_tra_that)} phu="Trợ lý · hỏi đáp · đánh giá · chấm BTVN" />
            <O nhan="Token" so={soNgan(dl.tong.vao + dl.tong.ghi + dl.tong.doc + dl.tong.ra)}
               phu={`đọc lại ${soNgan(dl.tong.doc)} · ghi đệm ${soNgan(dl.tong.ghi)} · vào ${soNgan(dl.tong.vao)} · viết ra ${soNgan(dl.tong.ra)}`} />
          </div>

          {/* Theo người */}
          <Khoi tieu="Theo người — chi phí và việc làm ra">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-[12.5px] text-slate-700">
                <thead><tr className="border-b text-left text-[11.5px] text-slate-500">
                  <th className="py-1.5 pr-2">Người</th><th className="pr-2 text-right">Lượt</th><th className="pr-2 text-right">Chi phí</th>
                  <th className="pr-2 text-right">Token</th><th className="pr-2 text-right">Câu vào kho</th><th className="pr-2 text-right">Câu phân dạng</th>
                  <th className="pr-2 text-right">Lệnh bản đồ</th><th className="pr-2 text-right">Ảnh</th><th className="text-right">Chi phí / câu vào kho</th>
                </tr></thead>
                <tbody>
                  {dl.theo_nguoi.map((n) => {
                    const key = n.nhan_su_id ?? 'may'
                    return (
                      <Fragment key={key}>
                        <tr onClick={() => setMoNguoi(moNguoi === key ? null : key)} className="cursor-pointer border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-1.5 pr-2 font-semibold text-slate-800">{n.ten}{n.co_uoc && <span title={`Có lượt không ghi model — tính theo ${dl.model_mac_dinh}`} className="ml-1 text-[10.5px] font-normal text-amber-600">ước tính</span>}</td>
                          <td className="pr-2 text-right text-slate-700">{n.luot}</td>
                          <td className="pr-2 text-right font-semibold text-slate-900">{dong(n.usd)}</td>
                          <td className="pr-2 text-right text-slate-500">{soNgan(n.tok)}</td>
                          <td className="pr-2 text-right text-slate-700">{n.cau_vao_kho || '—'}</td>
                          <td className="pr-2 text-right text-slate-700">{n.cau_phan_dang || '—'}</td>
                          <td className="pr-2 text-right text-slate-700">{n.lenh_ban_do || '—'}</td>
                          <td className="pr-2 text-right text-slate-700">{n.anh || '—'}</td>
                          <td className="text-right text-slate-700">{n.usd_moi_cau == null ? '—' : dong(n.usd_moi_cau)}</td>
                        </tr>
                        {moNguoi === key && (
                          <tr className="bg-slate-50 text-[12px] text-slate-600">
                            <td colSpan={9} className="px-3 py-2">
                              Token: đọc lại {soNgan(n.doc)} · ghi đệm {soNgan(n.ghi)} · vào {soNgan(n.vao)} · viết ra {soNgan(n.ra)}
                              {n.kenh && <> · Theo kênh: {Object.entries(n.kenh).map(([kn, u]) => `${KENH[kn] ?? kn} ${dong(u)}`).join(' · ')}</>}
                              {n.lenh_sua_kho > 0 && <> · Lệnh duyệt / sửa câu: {n.lenh_sua_kho}</>}
                              {n.co_chua_gia && <> · <span className="text-amber-700">có lượt dùng model chưa có giá (chỉ đếm token)</span></>}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Việc làm ra = vết lệnh Claude ghi trong phiên của người đó (câu thêm mới vào kho · câu được phân dạng · lệnh sửa bản đồ / lý thuyết · ảnh gắn). Bấm một dòng để xem token và kênh.</p>
          </Khoi>

          {/* Theo ngày — một dãy cột, một màu; rê chuột xem số */}
          <Khoi tieu="Theo ngày">
            {dl.theo_ngay.length === 0 ? <p className="text-[12.5px] text-slate-400">Không có lượt nào.</p> : (
              <div className="flex h-40 items-end gap-[2px] border-b border-slate-200">
                {dl.theo_ngay.map((x) => (
                  <div key={x.ngay} className="group relative flex h-full flex-1 items-end justify-center">
                    <div className="w-full max-w-[28px] rounded-t-[4px] bg-indigo-500 group-hover:bg-indigo-600" style={{ height: `${Math.max(2, (x.usd / maxNgay) * 100)}%` }} />
                    <div className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white group-hover:block">
                      {x.ngay.slice(8, 10)}/{x.ngay.slice(5, 7)} · {dong(x.usd)} · {x.luot} lượt
                    </div>
                  </div>
                ))}
              </div>
            )}
            {dl.theo_ngay.length > 0 && <div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>{dl.theo_ngay[0].ngay.slice(8, 10)}/{dl.theo_ngay[0].ngay.slice(5, 7)}</span><span>cao nhất {dong(maxNgay)} / ngày</span><span>{dl.theo_ngay[dl.theo_ngay.length - 1].ngay.slice(8, 10)}/{dl.theo_ngay[dl.theo_ngay.length - 1].ngay.slice(5, 7)}</span></div>}
          </Khoi>

          <div className="grid gap-4 lg:grid-cols-3">
            <Khoi tieu="Theo kênh">
              <Bang dong={dl.theo_kenh.map((x) => [KENH[x.kenh] ?? x.kenh, `${x.luot} lượt`, dong(x.usd)])} />
            </Khoi>
            <Khoi tieu="Theo model">
              <Bang dong={dl.theo_model.map((x) => [x.model, `${x.luot} lượt`, x.co_gia ? dong(x.usd) : 'chưa có giá'])} />
            </Khoi>
            <Khoi tieu="Theo loại việc">
              <Bang dong={dl.theo_loai.map((x) => [LOAI_PHIEN[x.loai] ?? x.loai, `${x.luot} lượt`, dong(x.usd)])} />
            </Khoi>
          </div>

          <Khoi tieu="15 phiên Claude tốn nhất">
            <Bang dong={dl.top_phien.map((x) => [`${x.tieu_de}`, `${x.ten} · ${x.mon} ${x.khoi} · ${LOAI_PHIEN[x.loai] ?? x.loai}`, `${x.luot} lượt`, dong(x.usd)])} />
          </Khoi>

          <p className="text-[11px] leading-relaxed text-slate-400">
            Tiền = token × giá API chính thức của đúng model (bảng <code>ai_bang_gia</code>), quy ra đồng theo 1 USD = {tg.toLocaleString('vi-VN')}đ; lượt nào Claude Code tự báo chi phí thì dùng số đó.
            Phiên Claude chạy bằng gói thuê bao nên là giá trị tương đương, không phải tiền đã trả.
            {dl.tong.luot_uoc > 0 && ` ${dl.tong.luot_uoc} lượt cũ không ghi model ⇒ tính theo ${dl.model_mac_dinh}.`}
            {dl.tong.luot_chua_gia > 0 && ` ${dl.tong.luot_chua_gia} lượt dùng model chưa có giá (chỉ đếm token).`}
            {' '}Số tính lúc {new Date(dl.luc).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}.
          </p>
        </div>
      )}
    </div>
  )
}

function O({ nhan, so, phu }: { nhan: string; so: string; phu: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-[11.5px] font-semibold text-slate-500">{nhan}</div>
      <div className="mt-0.5 text-[22px] font-bold text-slate-900">{so}</div>
      <div className="text-[11.5px] text-slate-500">{phu}</div>
    </div>
  )
}
function Khoi({ tieu, children }: { tieu: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="mb-2 text-[13.5px] font-semibold text-slate-800">{tieu}</div>
      {children}
    </div>
  )
}
function Bang({ dong }: { dong: string[][] }) {
  if (!dong.length) return <p className="text-[12.5px] text-slate-400">Không có lượt nào.</p>
  return (
    <table className="w-full text-[12.5px] text-slate-700"><tbody>
      {dong.map((r, i) => (
        <tr key={i} className="border-b border-slate-100 last:border-0">
          {r.map((o, j) => <td key={j} className={`py-1 ${j === 0 ? 'pr-2 font-medium text-slate-800' : j === r.length - 1 ? 'text-right font-semibold text-slate-800' : 'whitespace-nowrap pr-2 text-slate-500'}`}>{o}</td>)}
        </tr>
      ))}
    </tbody></table>
  )
}
