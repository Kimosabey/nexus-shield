import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PiiService } from './pii.service';
import { InjectionService } from './injection.service';
import { AuditLoggerService } from './audit-logger.service';
import { OutputGuardService } from './output-guard.service';
import { ShieldInterceptor } from './shield.interceptor';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PiiService,
    InjectionService,
    AuditLoggerService,
    OutputGuardService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ShieldInterceptor,
    },
  ],
})
export class AppModule { }
