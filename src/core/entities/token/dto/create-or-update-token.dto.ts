export class CreateOrUpdateTokenDto {
    token: string;
    expiresIn: Date;
    userId: string;
    userAgent: string;
}
