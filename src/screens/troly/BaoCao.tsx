// ============================================================================
// BÁO CÁO — phần CHÍNH của trợ lý (CEO 29/09: "hỏi là phụ, tính năng chính vẫn là báo cáo").
//
// LOGIC 3 LUỒNG, CEO chốt 29/09 — mỗi mục đều đi đúng ba bước này:
//   1. Có bao nhiêu việc đang CHẬM / đang MISS          → hai con số trên dòng của mục
//   2. Nút "Detail": bấm MỚI hiện từng việc             → ngày nào, do ai phụ trách
//   3. Cảnh báo rủi ro / bất thường nếu có              → dòng ⚠ dưới mục
//
// Mặc định chỉ thấy SỐ + nút. Không mở sẵn danh sách nào: báo cáo mở ra phải đọc được trong
// một màn hình, muốn biết việc nào của ai thì bấm.
//
// Màn này KHÔNG tính gì: mọi số đến từ `fn_troly_bao_cao`. Ở đây chỉ lọc theo chip đang bấm
// và đếm phần tử đang hiển thị.
// ============================================================================
import { useEffect, useState } from 'react'
import { getBaoCao, ddmm, type BaoCaoTroLy, type MucBaoCao, type CanhBao, type LoaiViec } from '../../lib/troly-baocao'

// Rời tab rồi quay lại = đúng khoảng đang xem, không quét lại (CLAUDE.md §2 React). Sống tới F5.
const NHO: { soNgay: number; bc: BaoCaoTroLy | null } = { soNgay: 14, bc: null }
const KHOANG = [7, 14, 30]

const NHAN_LOAI: Record<LoaiViec, string> = { cham: 'Chậm', miss: 'Miss', hs_khong_den: 'HS không đến', xong_muon: 'Đóng muộn' }
const CAC_LOAI: LoaiViec[] = ['cham', 'miss', 'hs_khong_den', 'xong_muon']
const MAU_LOAI: Record<LoaiViec, string> = {
  cham: 'border-rose-300 bg-rose-50 text-rose-700',
  miss: 'border-amber-300 bg-amber-50 text-amber-800',
  hs_khong_den: 'border-sky-300 bg-sky-50 text-sky-800',
  xong_muon: 'border-slate-300 bg-slate-50 text-slate-600',
}

function So({ n, nhan, mau }: { n: number; nhan: string; mau: 'do' | 'vang' | 'xanh' | 'xam' }) {
  const c = n === 0 ? 'text-slate-300' : mau === 'do' ? 'text-rose-600' : mau === 'vang' ? 'text-amber-600' : mau === 'xanh' ? 'text-sky-600' : 'text-slate-500'
  return (
    <div className="flex items-baseline gap-1">
      <span className={`text-[20px] font-semibold tabular-nums leading-none ${c}`}>{n}</span>
      <span className="text-[12px] text-slate-500">{nhan}</span>
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

// ── LUỒNG 3: một dòng cảnh báo, có Detail riêng khi có danh sách ───────────────
function DongCanhBao({ c, moSan }: { c: CanhBao; moSan?: boolean }) {
  const [mo, setMo] = useState(!!moSan)
  const thieu = c.muc_do === 'thieu_nguon' || c.muc_do === 'ghi_chu'
  const mau = thieu ? 'border-slate-200 bg-slate-50' : c.muc_do === 'cao' ? 'border-rose-200 bg-rose-50/60' : 'border-amber-200 bg-amber-50/60'
  return (
    <div className={`rounded-lg border px-2.5 py-1.5 ${mau}`}>
      <div className="flex items-start gap-2">
        <span className="shrink-0 text-[13px]">{thieu ? '○' : '⚠'}</span>
        <div className="min-w-0 flex-1">
          <div className={`text-[13px] font-medium leading-snug ${thieu ? 'text-slate-600' : 'text-slate-900'}`}>{c.tieu_de}</div>
          <div className="text-[12px] leading-relaxed text-slate-500">{c.mo_ta}</div>
        </div>
        {c.chi_tiet.length > 0 && <NutDetail mo={mo} onClick={() => setMo((x) => !x)} />}
      </div>
      {mo && (
        <div className="mt-1.5 space-y-0.5 border-t border-black/5 pt-1.5">
          {c.chi_tiet.map((d, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2 text-[12.5px]">
              <span className="font-medium text-slate-800">{d.chinh}</span>
              {d.phu && <span className="text-slate-500">{d.phu}</span>}
              <span className="text-slate-600">{d.noi_dung}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── LUỒNG 2: danh sách việc của một mục — ngày · đối tượng · việc · phụ trách · hạn · tình trạng ──
function BangViec({ m }: { m: MucBaoCao }) {
  // Mặc định xem việc còn phải xử (chậm + miss); "đóng muộn" là việc đã xong, bấm chip mới hiện.
  const [loc, setLoc] = useState<Record<LoaiViec, boolean>>({ cham: true, miss: true, hs_khong_den: true, xong_muon: false })
  const hien = m.viec.filter((v) => loc[v.loai])
  const so: Record<LoaiViec, number> = { cham: m.cham, miss: m.miss, hs_khong_den: m.hs_khong_den, xong_muon: m.xong_muon }
  return (
    <div className="border-t border-slate-200 bg-slate-50/70 px-3 py-2.5">
      {/* Thông số riêng của mục — không phải chậm/miss (CEO 29/09 "báo riêng thông số này") */}
      {m.thong_so.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {m.thong_so.map((x) => (
            <div key={x.nhan} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1">
              <div className="text-[11px] text-slate-500">{x.nhan}</div>
              <div className="text-[13px] font-semibold tabular-nums text-slate-800">{x.gia_tri}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {CAC_LOAI.filter((k) => k !== 'hs_khong_den' || so[k] > 0).map((k) => (
          <button key={k} onClick={() => setLoc((x) => ({ ...x, [k]: !x[k] }))} disabled={so[k] === 0}
            className={`rounded-full border px-2.5 py-0.5 text-[12px] font-medium disabled:opacity-30 ${loc[k] ? MAU_LOAI[k] : 'border-slate-200 bg-white text-slate-400'}`}>
            {NHAN_LOAI[k]} {so[k]}
          </button>
        ))}
        {m.da_cat && <span className="text-[11.5px] text-amber-700">Danh sách dài nên chỉ hiện 200 việc đầu — con số đếm thì đủ.</span>}
      </div>
      {hien.length === 0 ? (
        <div className="text-[12.5px] text-slate-400">Không có việc nào ở nhóm đang chọn.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11.5px] uppercase tracking-wide text-slate-500">
                <th className="px-2 py-1.5 font-medium">Ngày</th>
                <th className="px-2 py-1.5 font-medium">Lớp / học sinh</th>
                <th className="px-2 py-1.5 font-medium">Việc</th>
                <th className="px-2 py-1.5 font-medium">Phụ trách</th>
                <th className="px-2 py-1.5 font-medium">Hạn</th>
                <th className="px-2 py-1.5 font-medium">Tình trạng</th>
              </tr>
            </thead>
            <tbody>
              {hien.map((v, i) => (
                <tr key={i} className="border-b border-slate-100 align-top last:border-0">
                  <td className="whitespace-nowrap px-2 py-1.5 tabular-nums text-slate-700">{ddmm(v.ngay)}</td>
                  <td className="px-2 py-1.5 font-medium text-slate-800">{v.doi_tuong}</td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-slate-600">{v.viec}</td>
                  <td className="px-2 py-1.5 text-slate-800">{v.phu_trach ?? <span className="text-rose-600">chưa có người</span>}</td>
                  <td className="whitespace-nowrap px-2 py-1.5 tabular-nums text-slate-500">{v.han ?? '—'}</td>
                  <td className="px-2 py-1.5">
                    <span className={`mr-1.5 inline-block rounded border px-1.5 text-[11px] font-medium ${MAU_LOAI[v.loai]}`}>{NHAN_LOAI[v.loai]}</span>
                    <span className="text-slate-600">{v.tinh_trang}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Một MỤC = đủ 3 luồng ─────────────────────────────────────────────────────
function Muc({ m, moSan }: { m: MucBaoCao; moSan?: boolean }) {
  const [mo, setMo] = useState(!!moSan)
  const coViec = m.cham + m.miss + m.xong_muon + m.hs_khong_den > 0 || m.thong_so.length > 0
  return (
    <div className="border-t border-slate-200 first:border-t-0">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-3 py-2.5">
        <div className="w-[190px] shrink-0 text-[14px] font-semibold text-slate-800">{m.ten}</div>
        <So n={m.cham} nhan="đang chậm" mau="do" />
        <So n={m.miss} nhan="miss" mau="vang" />
        {m.hs_khong_den > 0 && <So n={m.hs_khong_den} nhan="học sinh không đến" mau="xanh" />}
        <So n={m.xong_muon} nhan="đóng muộn" mau="xam" />
        <div className="ml-auto"><NutDetail mo={mo} onClick={() => setMo((x) => !x)} tat={!coViec} /></div>
      </div>
      {mo && <BangViec m={m} />}
      {m.canh_bao.length > 0 && (
        <div className="space-y-1.5 px-3 pb-2.5">
          {m.canh_bao.map((c) => <DongCanhBao key={c.ma} c={c} moSan={moSan} />)}
        </div>
      )}
    </div>
  )
}

// Phần TRÌNH BÀY, tách khỏi phần tải: nhận nguyên JSON của `fn_troly_bao_cao` rồi vẽ.
// Tách để dựng thử được bằng dữ liệu thật mà không cần đăng nhập (scripts/check-troly-cong-cu.mjs --bao-cao).
// `moSan` = mở sẵn mọi Detail (chỉ dùng khi dựng thử / in); trên app luôn đóng sẵn theo đúng luồng 2.
export function BanBaoCao({ bc, mo, moSan }: { bc: BaoCaoTroLy; mo?: boolean; moSan?: boolean }) {
  const [moNguoi, setMoNguoi] = useState(!!moSan)
  return (
    <div className={mo ? 'opacity-60' : ''}>
      <div className="mb-2.5">
        <div className="text-[16px] font-semibold text-slate-900">{bc.ten}</div>
        <div className="text-[12px] leading-relaxed text-slate-500">{bc.ghi_chu_bo}</div>
      </div>
      {/* LUỒNG 1 — con số tổng */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-3 py-2.5">
          <div className="text-[26px] font-semibold tabular-nums leading-none text-rose-600">{bc.tong.cham}</div>
          <div className="mt-1 text-[12.5px] text-slate-600">việc đang chậm</div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-3 py-2.5">
          <div className="text-[26px] font-semibold tabular-nums leading-none text-amber-600">{bc.tong.miss}</div>
          <div className="mt-1 text-[12.5px] text-slate-600">việc miss</div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 px-3 py-2.5">
          <div className="text-[26px] font-semibold tabular-nums leading-none text-sky-600">{bc.tong.hs_khong_den}</div>
          <div className="mt-1 text-[12.5px] text-slate-600">lượt học sinh không đến</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
          <div className="text-[26px] font-semibold tabular-nums leading-none text-slate-800">{bc.tong.canh_bao}</div>
          <div className="mt-1 text-[12.5px] text-slate-600">cảnh báo rủi ro / bất thường</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-indigo-50/60 px-3 py-2 text-[12.5px] text-slate-600">
          Việc của các buổi từ <b className="text-slate-900">{ddmm(bc.tu)}</b> đến <b className="text-slate-900">{ddmm(bc.den)}</b> ({bc.so_ngay} ngày)
          <span className="text-slate-400"> · tính lúc {bc.tao_luc} · ngoài ra còn {bc.tong.xong_muon} việc đã xong nhưng đóng muộn</span>
        </div>
        {bc.muc.map((m) => <Muc key={m.ma} m={m} moSan={moSan} />)}

        {/* Cùng số việc đó, nhìn theo NGƯỜI — để biết nhắc ai trước */}
        <div className="border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-3 py-2.5">
            <div className="w-[190px] shrink-0 text-[14px] font-semibold text-slate-800">Theo người phụ trách</div>
            <div className="text-[12.5px] text-slate-500">{bc.theo_nguoi.length} người đang có việc chậm hoặc miss</div>
            <div className="ml-auto"><NutDetail mo={moNguoi} onClick={() => setMoNguoi((x) => !x)} tat={bc.theo_nguoi.length === 0} /></div>
          </div>
          {moNguoi && (
            <div className="border-t border-slate-200 bg-slate-50/70 px-3 py-2.5">
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11.5px] uppercase tracking-wide text-slate-500">
                      <th className="px-2 py-1.5 font-medium">Người phụ trách</th>
                      <th className="px-2 py-1.5 text-right font-medium">Đang chậm</th>
                      <th className="px-2 py-1.5 text-right font-medium">Miss</th>
                      <th className="px-2 py-1.5 text-right font-medium">Đóng muộn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bc.theo_nguoi.map((p) => (
                      <tr key={p.phu_trach} className="border-b border-slate-100 last:border-0">
                        <td className="px-2 py-1.5 font-medium text-slate-800">{p.phu_trach}</td>
                        <td className={`px-2 py-1.5 text-right tabular-nums ${p.cham ? 'font-semibold text-rose-600' : 'text-slate-300'}`}>{p.cham}</td>
                        <td className={`px-2 py-1.5 text-right tabular-nums ${p.miss ? 'font-semibold text-amber-600' : 'text-slate-300'}`}>{p.miss}</td>
                        <td className="px-2 py-1.5 text-right tabular-nums text-slate-500">{p.xong_muon}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-1.5 text-[11.5px] leading-relaxed text-slate-400">
                Một việc có nhiều người phụ trách thì mỗi người đều được tính việc đó, nên cộng cột này lại sẽ lớn hơn tổng ở trên.
              </div>
            </div>
          )}
        </div>

        {bc.canh_bao_chung.length > 0 && (
          <div className="space-y-1.5 border-t border-slate-200 px-3 py-2.5">
            <div className="text-[14px] font-semibold text-slate-800">Cảnh báo chung</div>
            {bc.canh_bao_chung.map((c) => <DongCanhBao key={c.ma} c={c} moSan={moSan} />)}
          </div>
        )}

        <div className="border-t border-slate-200 bg-slate-50 px-3 py-2.5">
          <div className="text-[12px] font-semibold text-slate-600">Cách đếm đang dùng</div>
          <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11.5px] leading-relaxed text-slate-500">
            {bc.cach_hieu.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function BaoCao() {
  const [soNgay, setSoNgay] = useState<number>(NHO.soNgay)
  const [bc, setBc] = useState<BaoCaoTroLy | null>(NHO.bc)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  async function tai(n: number, ep = false) {
    if (!ep && NHO.bc && NHO.soNgay === n) { setBc(NHO.bc); return }
    setLoi(null); setDangTai(true)
    try {
      const d = await getBaoCao(null, n)
      NHO.soNgay = n; NHO.bc = d
      setBc(d)
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
    finally { setDangTai(false) }
  }
  // Đổi KHOẢNG = đổi ngữ cảnh ⇒ bỏ báo cáo cũ rồi tải, để số của khoảng trước không đứng dưới nhãn khoảng mới.
  useEffect(() => { if (NHO.soNgay !== soNgay) setBc(null); tai(soNgay) }, [soNgay]) // eslint-disable-line

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[12.5px] text-slate-500">Nhìn lại</span>
        {KHOANG.map((n) => (
          <button key={n} onClick={() => setSoNgay(n)}
            className={`rounded-full border px-3 py-1 text-[12.5px] font-medium ${
              soNgay === n ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>
            {n} ngày
          </button>
        ))}
        <button onClick={() => tai(soNgay, true)} disabled={dangTai}
          className="ml-auto rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[12.5px] text-slate-600 hover:bg-slate-50 disabled:opacity-40">↻ Tính lại</button>
      </div>

      {loi && <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">Lỗi: {loi}</div>}
      {!bc && dangTai && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-400">Đang tính báo cáo…</div>}
      {bc && <BanBaoCao bc={bc} mo={dangTai} />}
    </div>
  )
}
