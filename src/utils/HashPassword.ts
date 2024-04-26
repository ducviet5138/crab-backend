import { createHash } from 'crypto';

export default function hashPassword(password: string) {
    return createHash('sha256').update(password).digest('hex');
}
