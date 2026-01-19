-- Индексы
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_books_library ON books("libraryId");
CREATE INDEX idx_books_available ON books("isAvailable");
CREATE INDEX idx_support_user ON support_requests("userId");
CREATE INDEX idx_support_active ON support_requests("isActive");
CREATE INDEX idx_messages_request ON messages("supportRequestId");
CREATE INDEX idx_messages_read ON messages("readAt");
