import { ModeConstants } from '@constants';

enum LocalAuthConstants {
    JWT_REFRESH_EXP_IN_DAYS = 'JWT_REFRESH_EXP_IN_DAYS',
    REFRESH_TOKEN_COOKIES_NAME = 'refresh_token',
    JWT_SECRET = 'JWT_SECRET',
    JWT_EXP = 'JWT_EXP',
}
export const AuthConstant = {
    ...LocalAuthConstants,
    ...ModeConstants,
};
