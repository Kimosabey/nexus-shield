import { Injectable } from '@nestjs/common';

@Injectable()
export class OutputGuardService {
    private readonly restrictedPatterns = [
        /sk-[a-zA-Z0-9]{32,}/, // OpenAI API Keys
        /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Credit Cards
        /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    ];

    async validateOutput(text: string): Promise<{ safe: boolean; reason?: string }> {
        for (const pattern of this.restrictedPatterns) {
            if (pattern.test(text)) {
                return { safe: false, reason: 'Sensitive pattern detected in LLM output' };
            }
        }

        // Additional logic for schema validation or quality checks can go here
        return { safe: true };
    }
}
