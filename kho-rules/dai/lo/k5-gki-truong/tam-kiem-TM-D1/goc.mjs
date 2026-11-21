// Đếm góc bẹt / góc tù trong hình thang ABCD có G trên DC, H trên BC, đoạn AG, GH.
// Toạ độ đọc từ ảnh cắt 150 dpi (pixel, trục y đi xuống).
const P = { A: [340, 90], B: [978, 72], H: [1058, 340], D: [145, 615], G: [778, 605], C: [1162, 605] };
// Các đoạn thẳng có trong hình (đoạn chứa điểm giữa ghi đủ điểm theo thứ tự)
const lines = [['A', 'B'], ['B', 'H', 'C'], ['D', 'G', 'C'], ['D', 'A'], ['A', 'G'], ['G', 'H']];
// Tia tại mỗi điểm: hướng tới điểm kề trên mỗi đường (một tia mỗi hướng)
const rays = {};
for (const L of lines) {
  for (let i = 0; i < L.length; i++) {
    const p = L[i];
    rays[p] = rays[p] || [];
    if (i > 0) rays[p].push(L[i - 1]);
    if (i < L.length - 1) rays[p].push(L[i + 1]);
  }
}
function ang(o, a, b) {
  const [ox, oy] = P[o], [ax, ay] = P[a], [bx, by] = P[b];
  const u = [ax - ox, ay - oy], v = [bx - ox, by - oy];
  const c = (u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v);
  return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
}
let bet = [], tu = [], nhon = [], vuong = [];
for (const o in rays) {
  const r = rays[o];
  for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
    const d = ang(o, r[i], r[j]);
    const ten = `${r[i]}${o}${r[j]} = ${d.toFixed(1)}`;
    if (d > 175) bet.push(ten); else if (d > 95) tu.push(ten); else if (d >= 85) vuong.push(ten); else nhon.push(ten);
  }
}
console.log('bet', bet.length, bet);
console.log('tu', tu.length, tu);
console.log('gan vuong', vuong.length, vuong);
console.log('nhon', nhon.length, nhon);
