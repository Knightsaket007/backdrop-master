import crypto from 'crypto';

export function getImageHash(buffer: Buffer): string {
  return crypto.createHash('sha1').update(buffer).digest('hex');
}
