import { Token } from '@prisma/client';

export type AccessToken = {
    accessToken: string;
};
export type RefreshToken = {
    refreshToken: Token;
};
export type AuthTokens = AccessToken & RefreshToken;
