import sys, math
from PIL import Image

# Do goc tren hinh hinh thang ABCD (TM-D1 Cau 7.3) tu anh cat: khop duong thang vao cac pixel den.
img = Image.open(sys.argv[1]).convert("L")
W, H = img.size
px = img.load()
dark = [(x, y) for y in range(H) for x in range(W) if px[x, y] < 100]

# toa do xap xi (pixel, y xuong) doc tu anh -- chi dung de chon pixel gan moi doan
P = {"A": (340, 208), "B": (980, 192), "C": (1162, 730), "D": (145, 738),
     "G": (772, 732), "H": (1060, 462)}
SEGS = [("A", "B"), ("A", "D"), ("A", "G"), ("D", "C"), ("B", "C"), ("G", "H")]


def fit(p, q):
    (x1, y1), (x2, y2) = p, q
    L = math.hypot(x2 - x1, y2 - y1)
    ux, uy = (x2 - x1) / L, (y2 - y1) / L
    pts = []
    for (x, y) in dark:
        t = ((x - x1) * ux + (y - y1) * uy)
        d = abs(-(x - x1) * uy + (y - y1) * ux)
        if 45 < t < L - 45 and d < 9:
            pts.append((x, y))
    n = len(pts)
    mx = sum(a for a, _ in pts) / n
    my = sum(b for _, b in pts) / n
    sxx = sum((a - mx) ** 2 for a, _ in pts)
    syy = sum((b - my) ** 2 for _, b in pts)
    sxy = sum((a - mx) * (b - my) for a, b in pts)
    th = 0.5 * math.atan2(2 * sxy, sxx - syy)
    dx, dy = math.cos(th), math.sin(th)
    if dx * ux + dy * uy < 0:
        dx, dy = -dx, -dy
    return (mx, my), (dx, dy), n


lines = {}
for a, b in SEGS:
    lines[(a, b)] = fit(P[a], P[b])
    print(a + b, "so pixel", lines[(a, b)][2])


def inter(l1, l2):
    (x1, y1), (dx1, dy1), _ = l1
    (x2, y2), (dx2, dy2), _ = l2
    det = dx1 * (-dy2) - dy1 * (-dx2)
    t = ((x2 - x1) * (-dy2) - (y2 - y1) * (-dx2)) / det
    return (x1 + t * dx1, y1 + t * dy1)


V = {
    "A": inter(lines[("A", "B")], lines[("A", "D")]),
    "B": inter(lines[("A", "B")], lines[("B", "C")]),
    "C": inter(lines[("D", "C")], lines[("B", "C")]),
    "D": inter(lines[("A", "D")], lines[("D", "C")]),
    "G": inter(lines[("A", "G")], lines[("D", "C")]),
    "H": inter(lines[("B", "C")], lines[("G", "H")]),
}
for k, v in V.items():
    print(k, round(v[0], 1), round(v[1], 1))


def ang(o, a, b):
    ox, oy = V[o]
    ax, ay = V[a][0] - ox, V[a][1] - oy
    bx, by = V[b][0] - ox, V[b][1] - oy
    c = (ax * bx + ay * by) / (math.hypot(ax, ay) * math.hypot(bx, by))
    return math.degrees(math.acos(max(-1, min(1, c))))


# cac goc theo cap tia xuat phat tu moi dinh (H nam tren BC, G nam tren DC)
rays = {
    "A": ["B", "G", "D"],
    "B": ["A", "C"],
    "C": ["B", "D"],
    "D": ["A", "C"],
    "G": ["D", "A", "H", "C"],
    "H": ["B", "G", "C"],
}
tu = nhon = vuong = 0
for o, rs in rays.items():
    for i in range(len(rs)):
        for j in range(i + 1, len(rs)):
            a = ang(o, rs[i], rs[j])
            print("goc %s%s%s = %.1f" % (rs[i], o, rs[j], a))
