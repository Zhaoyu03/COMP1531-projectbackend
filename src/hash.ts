import crypto from 'crypto';

function getHashOf(text: string) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export { getHashOf };
