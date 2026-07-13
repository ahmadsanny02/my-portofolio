-- Migration: Add images array column to projects table
ALTER TABLE projects ADD COLUMN images TEXT[] DEFAULT '{}';
