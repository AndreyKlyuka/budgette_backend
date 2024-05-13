import { Module } from '@nestjs/common';
import { CookieService } from '@common-services/cookie.service';

@Module({
    providers: [CookieService],
    exports: [CookieService],
})
export class CommonServicesModule {}
