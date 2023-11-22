import { genSaltSync, hashSync } from 'bcrypt';

export const hashPassword = (password: string): string => {
    return hashSync(password, genSaltSync(10));
};
