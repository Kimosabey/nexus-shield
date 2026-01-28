import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PiiService {
    constructor(private readonly httpService: HttpService) { }

    async scrubPrompt(prompt: string): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.post('http://localhost:8002/analyze', { text: prompt }),
            );
            return response.data.scrubbed_text;
        } catch (error) {
            console.error('PII Service Error:', error.message);
            throw new HttpException(
                'Privacy Protection Service Unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}
