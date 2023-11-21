export class CreateOrUpdateTokenDto {
    token: string;
    exp: Date;
    userId: string;
    userAgent: string;
}
