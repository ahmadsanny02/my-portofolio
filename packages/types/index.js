// Runtime counterpart of index.ts. Interfaces have no runtime value; only the
// constants below must be mirrored here (keep in sync with index.ts).
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

module.exports = { MAX_UPLOAD_BYTES, ALLOWED_IMAGE_MIME_TYPES };
