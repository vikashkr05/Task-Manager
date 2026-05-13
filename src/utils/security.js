// OWASP A03: Injection – strip HTML/script content from user-supplied text before storing.
// Two-pass approach:
//   1. Remove dangerous tag blocks (script, style, iframe…) including their text content.
//   2. Strip remaining HTML tags while preserving benign text (e.g. <b>Bold</b> → "Bold").
// React escapes values at render time, but sanitizing at input prevents stored XSS if
// the data is ever serialised to a server, PDF, email, or rendered via innerHTML.
export const sanitizeText = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

const MAX_NAME_LEN = 200;
const MAX_DESC_LEN = 2000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// OWASP A04: Insecure Design – enforce input size and format constraints on the client
// (server must duplicate these checks; client-side validation is UX, not a security boundary).
export const validateTaskForm = ({ name, description, deadline }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'taskDialog.nameRequired';
  } else if (name.length > MAX_NAME_LEN) {
    errors.name = 'taskDialog.nameTooLong';
  }

  if (description && description.length > MAX_DESC_LEN) {
    errors.description = 'taskDialog.descriptionTooLong';
  }

  if (deadline && !DATE_RE.test(deadline)) {
    errors.deadline = 'taskDialog.invalidDate';
  }

  return errors; // empty object = valid
};

// OWASP A03/A08: validate uploaded file by MIME type and size before reading into memory.
// Note: browser MIME type is spoofable; a real server must re-validate the binary signature.
export const validateImageFile = (file) => {
  if (!ALLOWED_MIME.has(file.type)) return 'taskDialog.invalidFile';
  if (file.size > MAX_IMAGE_BYTES) return 'taskDialog.fileTooLarge';
  return null;
};

// OWASP A09: Security Logging – emit structured security events.
// In production replace console.warn with a call to your monitoring service (Sentry, Datadog…).
export const logSecurityEvent = (event, details = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[Security]', event, details);
  }
};
