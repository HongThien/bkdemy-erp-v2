// Áp các migration chấm công/lương TA CHƯA có trên DB, TRONG transaction đang mở của script test (BEGIN … ROLLBACK).
// Từ 14/10 migration gốc 202610122210 đã áp thật ⇒ không chạy lại (create table sẽ chết); file sau thì chạy để test trước khi áp.
import fs from 'fs';
const DS = [
  ['202610122210_ta_cham_cong_va_luong.sql', 'ta_cham_cong'],
  ['202610141233_ta_cham_cong_theo_ngay_phan_cong.sql', 'ta_dot_khai_bu'],
  ['202610141240_ta_cong_cua_toi.sql', null],   // chỉ hàm: dò bằng sổ _migrations
];
export async function apMigration(c) {
  const da = (await c.query('select ten from _migrations')).rows.map((r) => r.ten);
  const chay = [];
  for (const [file, bang] of DS) {
    if (da.includes(file)) continue;
    const co = bang && (await c.query('select to_regclass($1) is not null as co', ['public.' + bang])).rows[0].co;
    if (co) continue;   // có bảng mà sổ chưa ghi: coi như đã áp
    await c.query(fs.readFileSync('supabase/migrations/' + file, 'utf8'));
    chay.push(file);
  }
  return chay;
}
