-- 0021 — chức vụ (nhãn mô tả SCOPE phụ trách, vd "Quản lý khối THCS") trên membership.
-- KHÁC vai_tro (= level trong cây): cùng level có thể khác scope.
alter table thanh_vien_team add column if not exists chuc_vu text;
