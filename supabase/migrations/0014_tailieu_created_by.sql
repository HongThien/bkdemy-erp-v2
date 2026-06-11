-- 0014 — cột người tạo tài liệu. App set từ session.user.id lúc insert
-- (claude_build KHÔNG đụng schema auth → không default auth.uid()).
-- CHƯA ràng buộc FK / chưa hiển thị tên — để đó, LINK sang nền nhân sự (profiles) sau.
alter table tai_lieu add column if not exists created_by uuid;
