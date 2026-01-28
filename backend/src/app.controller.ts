import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

class ChatDto {
  prompt: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('chat')
  async chat(@Body() body: ChatDto) {
    // In a real scenario, this would call OpenAI or another LLM
    // For now, it reflects the sanitized prompt
    return {
      status: 'secure',
      response: `[Nexus Shield Verified] ${body.prompt}`,
      timestamp: new Date().toISOString(),
    };
  }
}
