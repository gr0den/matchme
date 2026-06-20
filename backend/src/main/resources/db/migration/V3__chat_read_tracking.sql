ALTER TABLE chat_messages
    ADD COLUMN read_at TIMESTAMP;

UPDATE chat_messages
SET read_at = timestamp
WHERE read_at IS NULL;
