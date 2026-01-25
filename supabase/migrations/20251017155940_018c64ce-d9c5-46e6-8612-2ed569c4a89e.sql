-- Add missing status values to the request_status enum
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'denied';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'in_review';