// ============================================================================
// DANH SÁCH GAME trong ô "Trò chơi" của app HS (Thùy 04–06/10: "ghép game nông trại vào 1 card tên là Trò chơi. Sau này sẽ có nhiều game. Hiện để 1 game Nông trại BK;
// 1 game dạng upcoming chưa sáng, chưa click vào được: Săn lùng Quái Vật").
// Thêm game mới = thêm 1 phần tử ở DS_GAME (+ 1 nhánh trong TroChoiHS nếu game cần màn nhúng riêng) — không sửa màn danh sách.
// `san_sang` = bấm vào chơi được · `sap_ra_mat` = hiện mờ, KHÔNG bấm được.
// Game là web tĩnh nằm trong public/games/<id>/ (đồng bộ từ repo game bằng scripts/dong-bo-*.mjs), nhúng bằng iframe cùng origin.
// ============================================================================
export type GameHS = {
  id: string
  ten: string
  moTa: string
  trangThai: 'san_sang' | 'sap_ra_mat'
  /** ảnh đại diện (đường dẫn trong public/) — không có ⇒ khung dấu hỏi */
  anh?: string
  /** dòng nhỏ dưới mô tả (cách chơi / lưu ý) */
  ghiChu?: string
}

export const DS_GAME: GameHS[] = [
  {
    id: 'nong_trai', ten: 'Nông trại BK', trangThai: 'san_sang', anh: '/games/nong-trai/icons/icon-512.png',
    moTa: 'Trồng cây, nuôi gà và bò, sang vườn bạn bè. Mỗi ngày vào một lần, mười đến mười lăm phút là đủ.',
    ghiChu: 'Bản thử: tiến độ lưu trên thiết bị này, chưa nối với xu hay việc học.',
  },
  {
    id: 'san_quai_vat', ten: 'Săn lùng Quái Vật', trangThai: 'sap_ra_mat',
    moTa: 'Đi săn, thu phục và nuôi đội quái vật của riêng em.',
    ghiChu: 'Sắp ra mắt.',
  },
]
