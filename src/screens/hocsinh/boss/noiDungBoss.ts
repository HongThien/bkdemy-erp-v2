// ============================================================================
// NỘI DUNG BOSS RIÊNG của giáo viên — Thùy SỬA CHỮ Ở ĐÂY, không cần đụng code màn (cùng mẫu tutorial/noiDungTutorial.ts).
// Thiết kế: design/FLOW-NPC-BOSS-CUOI.md (§5 chiêu · §8 lời thoại). BẢN NHÁP do Claude soạn 01/10 — Thùy duyệt giọng.
// LUẬT GIỌNG: ≤ 2 câu / bong bóng, ≤ 90 ký tự · không chê/so sánh/đe doạ HS · thất bại = "chưa tới" · dữ kiện về HS (số dạng, ngày chuỗi)
//   lấy từ hàm DB, truyền qua `{so_dang}`… — KHÔNG để client tự đếm. Xưng "ta" – gọi HS là "em".
// `mat` = tư thế hiện khi câu đó nói: dung | noi | chieu | trung | gian | ha.
// Thêm boss GV khác = thêm 1 khoá ở BOSS (mã `boss_<ma_gv>`), không sửa code.
// ============================================================================

export type TuTheBoss = 'dung' | 'noi' | 'chieu' | 'trung' | 'gian' | 'ha'
export type Cau = { noi: string; mat?: TuTheBoss }
export type TinhHuong =
  | 'gap_lan_dau' | 'chua_du_suc' | 'bat_dau' | 'dung' | 'sai' | 'mau_75' | 'mau_50' | 'mau_25'
  | 'chuyen_pha' | 'ha' | 'roi_giua_tran' | 'gap_lai'

export type Chieu = {
  ma: string
  ten: string
  /** 1 dòng em đọc được: chiêu này thử mình điều gì */
  thu: string
  phase: 1 | 2
  /** loại câu lấy cho chiêu này (hàm DB chọn câu): dạng ĐÃ ĐẠT · CHƯA ĐO · đang YẾU */
  loai_cau: 'dat' | 'chua_do' | 'yeu'
}

export type NoiDungBoss = {
  ten: string
  /** danh xưng dưới tên trong khung thoại */
  vai: string
  cuaMieng: string
  chieu: Chieu[]
  thoai: Record<TinhHuong, Cau[]>
}

export const BOSS: Record<string, NoiDungBoss> = {
  boss_thuy: {
    ten: 'Thùy',
    vai: 'Người gác cổng Tháp Tri Thức',
    cuaMieng: 'Ta không đánh em. Ta thử bài của em!',
    chieu: [
      { ma: 'cong_kiem_tra', ten: 'Cổng Kiểm Tra', thu: 'Những dạng em đã nắm: mỗi câu đúng phá một tấm khiên', phase: 1, loai_cau: 'dat' },
      { ma: 'suong_mu', ten: 'Sương Mù Chưa Biết', thu: 'Dạng em chưa từng thử: làm đúng là tan sương, mở ô mới', phase: 1, loai_cau: 'chua_do' },
      { ma: 'on_lai', ten: 'Ôn Lại Dạng Cũ', thu: 'Gọi lại dạng em từng chưa vững: đúng thì quái cũ ngã thêm lần nữa', phase: 2, loai_cau: 'yeu' },
    ],
    thoai: {
      gap_lan_dau: [
        { noi: 'Em đã đi tới tận đây rồi à? Ta là Thùy, gác cổng Tháp Tri Thức.', mat: 'noi' },
        { noi: 'Luật rất công bằng: ta ra bài, em trả lời. Càng nắm vững, ta càng yếu.', mat: 'noi' },
        { noi: 'Ta không đánh em. Ta thử bài của em!', mat: 'dung' },
      ],
      chua_du_suc: [
        { noi: 'Chưa đến lúc đâu. Em còn vài boss ở các vùng trước chưa gặp.', mat: 'noi' },
        { noi: 'Đi đánh thêm rồi quay lại, ta chờ.', mat: 'dung' },
      ],
      bat_dau: [{ noi: 'Bắt đầu thôi! Ta không đánh em. Ta thử bài của em!', mat: 'chieu' }],
      dung: [
        { noi: 'Chuẩn! Dạng này em nắm chắc rồi đấy.', mat: 'trung' },
        { noi: 'Đòn trúng rồi, ta thấy rõ cách em nghĩ.', mat: 'trung' },
      ],
      sai: [
        { noi: 'Chưa tới thôi. Em thử đọc lại đề một lần nữa nhé.', mat: 'noi' },
        { noi: 'Đừng vội. Cứ từng bước một, ta chờ được.', mat: 'noi' },
      ],
      mau_75: [{ noi: 'Khá lắm, ta bắt đầu thấy khiên mình nứt rồi.', mat: 'noi' }],
      mau_50: [{ noi: 'Một nửa rồi! Em làm ta phải nghiêm túc đấy.', mat: 'gian' }],
      mau_25: [{ noi: 'Gần tới rồi… cố thêm chút nữa!', mat: 'noi' }],
      chuyen_pha: [{ noi: 'Giờ ta nghiêm túc đây. Ôn lại những gì em từng thấy khó nào!', mat: 'gian' }],
      ha: [
        { noi: 'Ta thua rồi. Em đã nắm chắc {so_dang} dạng, điều đó không tự nhiên mà có.', mat: 'ha' },
        { noi: 'Giỏi lắm! Ta tự hào về em.', mat: 'ha' },
      ],
      roi_giua_tran: [{ noi: 'Hẹn em lần sau. Cổng này vẫn chờ em.', mat: 'dung' }],
      gap_lai: [
        { noi: 'Lại gặp em rồi! Muốn luyện thêm không? Ta vẫn còn vài câu đố hay.', mat: 'noi' },
        { noi: 'Ta thấy có dạng mới em nên ôn lại. Thử không?', mat: 'noi' },
      ],
    },
  },
}

/** Câu có `{khoá}` chỉ dùng được khi DB đã trả đủ số — thiếu thì BỎ câu đó (không để lộ `{so_dang}` hay nói thiếu ý). */
export const duSo = (c: Cau, so: Record<string, number | string> = {}) => [...c.noi.matchAll(/\{(\w+)\}/g)].every((m) => m[1] in so)
export const dienCau = (c: string, so: Record<string, number | string> = {}) => c.replace(/\{(\w+)\}/g, (_, k) => String(so[k]))
/** Các câu dùng được cho 1 tình huống (đã lọc theo số liệu có thật). */
export const cauCua = (b: NoiDungBoss, tinhHuong: TinhHuong, so: Record<string, number | string> = {}): Cau[] =>
  b.thoai[tinhHuong].filter((c) => duSo(c, so)).map((c) => ({ ...c, noi: dienCau(c.noi, so) }))
