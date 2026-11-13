import { describe, it, expect } from 'vitest';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../src/interfaces/validators/projectValidator';
import { createCertificateSchema } from '../src/interfaces/validators/certificateValidator';
import { createContactMessageSchema } from '../src/interfaces/validators/contactValidator';
import { updateSkillSchema } from '../src/interfaces/validators/skillValidator';

describe('createProjectSchema', () => {
  it('keeps category and status (previously stripped)', () => {
    const r = createProjectSchema.parse({ title: 'Abc', category: 'Mobile', status: 'In Progress' });
    expect(r.category).toBe('Mobile');
    expect(r.status).toBe('In Progress');
  });

  it('accepts an empty thumbnail', () => {
    expect(createProjectSchema.safeParse({ title: 'Abc', thumbnail: '' }).success).toBe(true);
  });

  it('rejects a malformed slug', () => {
    expect(createProjectSchema.safeParse({ title: 'Abc', slug: 'Bad Slug!' }).success).toBe(false);
  });

  it('rejects empty tech stack entries', () => {
    expect(createProjectSchema.safeParse({ title: 'Abc', techStack: [''] }).success).toBe(false);
  });
});

describe('updateProjectSchema', () => {
  it('does not inject defaults into partial updates', () => {
    const r = updateProjectSchema.parse({ title: 'New title' });
    expect(r).toEqual({ title: 'New title' });
    expect('isPublished' in r).toBe(false);
  });
});

describe('updateSkillSchema', () => {
  it('does not reset orderIndex on partial update', () => {
    expect(updateSkillSchema.parse({ name: 'React' })).toEqual({ name: 'React' });
  });
});

describe('createCertificateSchema', () => {
  it('allows a certificate without image', () => {
    const r = createCertificateSchema.safeParse({
      title: 'Cert',
      issuer: 'Dicoding',
      issuedAt: '2026-01-01',
      category: 'Web Development',
      imageUrl: '',
    });
    expect(r.success).toBe(true);
  });
});

describe('createContactMessageSchema', () => {
  it('rejects overly long messages', () => {
    const r = createContactMessageSchema.safeParse({
      name: 'Tester',
      email: 'a@b.co',
      message: 'x'.repeat(5001),
    });
    expect(r.success).toBe(false);
  });
});
