import { randomBytes } from 'crypto';

/**
 * @description - This function is used to generated random token of a specific length
 * @param {number} len - Token size to be generated
 * @return {string} token - The generated token
**/
export const tokenGenerator = (len: number) : string => randomBytes(len).toString('hex');