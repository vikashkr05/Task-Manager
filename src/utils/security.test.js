import { sanitizeText, validateTaskForm, validateImageFile, logSecurityEvent } from './security';

describe('sanitizeText', () => {
  it('strips HTML tags', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('');
    expect(sanitizeText('<b>Bold</b>')).toBe('Bold');
    expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeText('  hello world  ')).toBe('hello world');
  });

  it('returns empty string for non-string inputs', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
    expect(sanitizeText(42)).toBe('');
  });

  it('leaves clean text unchanged', () => {
    expect(sanitizeText('Clean text 123')).toBe('Clean text 123');
  });
});

describe('validateTaskForm', () => {
  const valid = { name: 'My Task', description: 'Some work', deadline: '2026-12-31' };

  it('returns no errors for a fully valid form', () => {
    expect(validateTaskForm(valid)).toEqual({});
  });

  it('returns name error when name is empty', () => {
    expect(validateTaskForm({ ...valid, name: '' }).name).toBe('taskDialog.nameRequired');
  });

  it('returns name error when name is only whitespace', () => {
    expect(validateTaskForm({ ...valid, name: '   ' }).name).toBe('taskDialog.nameRequired');
  });

  it('returns name error when name exceeds 200 characters', () => {
    expect(validateTaskForm({ ...valid, name: 'a'.repeat(201) }).name).toBe('taskDialog.nameTooLong');
  });

  it('accepts a name of exactly 200 characters', () => {
    expect(validateTaskForm({ ...valid, name: 'a'.repeat(200) }).name).toBeUndefined();
  });

  it('returns description error when description exceeds 2000 characters', () => {
    expect(
      validateTaskForm({ ...valid, description: 'a'.repeat(2001) }).description
    ).toBe('taskDialog.descriptionTooLong');
  });

  it('accepts a description of exactly 2000 characters', () => {
    expect(validateTaskForm({ ...valid, description: 'a'.repeat(2000) }).description).toBeUndefined();
  });

  it('returns deadline error for an invalid date string', () => {
    expect(validateTaskForm({ ...valid, deadline: 'not-a-date' }).deadline).toBe('taskDialog.invalidDate');
    expect(validateTaskForm({ ...valid, deadline: '31-12-2026' }).deadline).toBe('taskDialog.invalidDate');
  });

  it('accepts an empty deadline', () => {
    expect(validateTaskForm({ ...valid, deadline: '' }).deadline).toBeUndefined();
  });
});

describe('validateImageFile', () => {
  const makeFile = (type, size) => ({ type, size });

  it.each(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])(
    'returns null for allowed MIME type %s',
    (type) => {
      expect(validateImageFile(makeFile(type, 1024))).toBeNull();
    }
  );

  it('returns an error key for a disallowed MIME type', () => {
    expect(validateImageFile(makeFile('application/pdf', 1024))).toBe('taskDialog.invalidFile');
    expect(validateImageFile(makeFile('text/plain', 1024))).toBe('taskDialog.invalidFile');
  });

  it('returns an error key when file exceeds 5 MB', () => {
    expect(validateImageFile(makeFile('image/jpeg', 5 * 1024 * 1024 + 1))).toBe('taskDialog.fileTooLarge');
  });

  it('returns null for a file of exactly 5 MB', () => {
    expect(validateImageFile(makeFile('image/jpeg', 5 * 1024 * 1024))).toBeNull();
  });
});

describe('logSecurityEvent', () => {
  it('calls console.warn in non-production environments', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logSecurityEvent('TestEvent', { detail: 'x' });
    expect(spy).toHaveBeenCalledWith('[Security]', 'TestEvent', { detail: 'x' });
    spy.mockRestore();
  });
});
