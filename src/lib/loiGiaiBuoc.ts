// Bộ tách CHUỖI BƯỚC của lời giải (kho-rules/README.md §3, CEO 09/10): Phần 1 "Hướng dẫn" nhiều bước ⇒ mỗi bước là
// 1 ĐOẠN riêng mở bằng "**Bước k.**" (k liên tục từ 1; nhiều dòng thì xuống dòng đơn, DÒNG TRỐNG = ranh giới card).
// Các đoạn "**Bước k.**" liên tiếp = 1 chuỗi card nối mũi tên. Cùng kiểu parser theo đoạn với lythuyetBlocks.ts,
// KHÔNG phân biệt môn (§1.6). Dùng 1 nơi duy nhất: MathText › htmlPhan1 (src/screens/kho/ui.tsx) — mọi chỗ hiện lời giải
// (app HS qua ChuMon, Duyệt kho, Kho đề thi, bản in) đều đi qua đó, không viết riêng từng màn.

export type LoiGiaiBuoc = { so: number; noiDung: string }
export type LoiGiaiKhoi = { loai: 'text'; noiDung: string } | { loai: 'chuoi_buoc'; buoc: LoiGiaiBuoc[] }

// "**Bước 2.**" ở đầu đoạn (nhận cả "**Bước 2:**" phòng gõ nhầm dấu) — phần sau trên cùng dòng là nội dung bước.
const BUOC_RE = /^\*\*[ \t]*Bước[ \t]+(\d+)[ \t]*[.:][ \t]*\*\*[ \t]*/

/**
 * Tách chuỗi (thường là thân Phần 1) thành các khối. Đoạn không phải "**Bước k.**" gom lại thành khối `text`
 * (nối bằng dòng trống — render như cũ). Chỉ chuỗi ≥ 2 bước mới thành `chuoi_buoc` (README §3: bài 1 bước không đánh
 * "Bước 1"; lỡ có thì giữ nguyên chữ). Gặp "**Bước 1.**" giữa chuỗi ⇒ mở chuỗi mới.
 */
export function tachChuoiBuoc(text: string): LoiGiaiKhoi[] {
  const doans = (text || '').replace(/\r\n?/g, '\n').split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean)
  const out: LoiGiaiKhoi[] = []
  let chu: string[] = []
  let chuoi: { goc: string; buoc: LoiGiaiBuoc }[] = []
  const xaChu = () => { if (chu.length) out.push({ loai: 'text', noiDung: chu.join('\n\n') }); chu = [] }
  const xaChuoi = () => {
    if (chuoi.length >= 2) { xaChu(); out.push({ loai: 'chuoi_buoc', buoc: chuoi.map((c) => c.buoc) }) }
    else chu.push(...chuoi.map((c) => c.goc))
    chuoi = []
  }
  for (const doan of doans) {
    const m = doan.match(BUOC_RE)
    if (!m) { xaChuoi(); chu.push(doan); continue }
    const so = Number(m[1])
    if (so === 1 && chuoi.length) xaChuoi()
    chuoi.push({ goc: doan, buoc: { so, noiDung: doan.slice(m[0].length).trim() } })
  }
  xaChuoi(); xaChu()
  return out
}
