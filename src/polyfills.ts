// Polyfill for crypto to support older Node.js versions and TypeORM
import * as crypto from 'crypto';

if (typeof global.crypto === 'undefined') {
  (global as any).crypto = crypto;
}
