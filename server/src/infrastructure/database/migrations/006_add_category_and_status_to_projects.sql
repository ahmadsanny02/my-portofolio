-- Add category and status columns to projects table
ALTER TABLE projects ADD COLUMN category VARCHAR(100) DEFAULT 'Web Application';
ALTER TABLE projects ADD COLUMN status VARCHAR(50) DEFAULT 'Completed';
