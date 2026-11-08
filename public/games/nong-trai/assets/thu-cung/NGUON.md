# thu-cung.js — thư viện thú 3D của BK World (BatThu)
Build từ `BKGame/BatThu` (repo HongThien/bk-bat-thu, nhánh game-3-man): `npx vite build -c vite.lib.config.ts` → `dist-lib/thu-cung.js` (ES module tự chứa three r186, gán `window.ThuCung`). Chép nguyên file này vào đây (Nông Trại 23/10/2026; Lunar Cherry cũng dùng chung).
Nông Trại chỉ nạp lười ở màn Thú cưng (`js/ui.js` → `nap3D`). Khoá loài trong `js/data.js` (THU, ngoai:true) = id loài trong thư viện: meo_bong, nhim_dien, chim_nuoc, ga_lua, cuu_may, cao_lua, khi_la, bo_tuyet, su_tu_lua, voi_rung.
