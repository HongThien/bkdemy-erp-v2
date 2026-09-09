-- bao_loi: phân biệt BUG (nhân sự báo) vs YÊU CẦU tính năng (Thùy order).
-- Order của Thùy vào thẳng cho_fix (không qua cổng duyệt — chính người duyệt tạo ra nó).
alter table bao_loi add column loai text not null default 'bug'
  check (loai in ('bug', 'yeu_cau'));

comment on column bao_loi.loai is 'bug = nhân sự báo lỗi qua nút nổi · yeu_cau = order tính năng (tạo từ màn Quản lý báo lỗi, mặc định cho_fix)';
