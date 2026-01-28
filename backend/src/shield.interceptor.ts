import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PiiService } from './pii.service';
import { InjectionService } from './injection.service';
import { AuditLoggerService } from './audit-logger.service';
import { OutputGuardService } from './output-guard.service';

@Injectable()
export class ShieldInterceptor implements NestInterceptor {
    constructor(
        private readonly piiService: PiiService,
        private readonly injectionService: InjectionService,
        private readonly auditLogger: AuditLoggerService,
        private readonly outputGuard: OutputGuardService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const prompt = request.body?.prompt;

        if (!prompt) {
            return next.handle();
        }

        return from(this.validatePrompt(prompt, request)).pipe(
            switchMap((sanitizedPrompt) => {
                // Update the request body with the sanitized prompt
                request.body.prompt = sanitizedPrompt;
                return next.handle();
            }),
            switchMap(async (response) => {
                // Determine actual text content to validate (handling object/string responses)
                const responseText = response?.response || (typeof response === 'string' ? response : JSON.stringify(response));

                // Audit output
                const audit = await this.outputGuard.validateOutput(responseText);
                if (!audit.safe) {
                    await this.auditLogger.logThreat({
                        type: 'Output Leakage',
                        reason: audit.reason,
                        prompt: request.body.prompt,
                        output: 'REDACTED_FOR_LOG',
                    });
                    throw new HttpException(
                        'Security Violation: LLM output contained sensitive data.',
                        HttpStatus.FORBIDDEN,
                    );
                }
                return response;
            }),
        );
    }

    private async validatePrompt(prompt: string, request: any): Promise<string> {
        // 1. Injection Check (Local SLM)
        const isMalicious = await this.injectionService.checkInjection(prompt);
        if (isMalicious) {
            await this.auditLogger.logThreat({
                type: 'Prompt Injection',
                prompt,
                ip: request.ip,
                user_agent: request.headers['user-agent'],
            });
            throw new HttpException(
                'Security Violation: Prompt Injection Detected',
                HttpStatus.FORBIDDEN,
            );
        }

        // 2. PII Scrubbing (Microsoft Presidio)
        const sanitized = await this.piiService.scrubPrompt(prompt);

        return sanitized;
    }
}
