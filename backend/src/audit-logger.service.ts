import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuditLoggerService {
    private readonly logDir = path.join(process.cwd(), 'logs');
    private readonly encryptionKey = process.env.AUDIT_KEY || 'nexus-shield-secret';

    constructor() {
        fs.ensureDirSync(this.logDir);
    }

    async logThreat(data: any) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            ...data,
        };

        const fileName = `threat-${new Date().toISOString().split('T')[0]}.log`;
        const filePath = path.join(this.logDir, fileName);

        // Encrypt the log entry
        const encryptedEntry = CryptoJS.AES.encrypt(JSON.stringify(entry), this.encryptionKey).toString();

        await fs.appendFile(filePath, encryptedEntry + '\n');
        console.log(`[🛡️ Nexus Shield] Threat logged: ${data.type}`);
    }
}
