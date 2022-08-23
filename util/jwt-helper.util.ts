import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';
import { JWT_SECRET } from '../configs';
import { vendorPayload } from '../dto';
import { authPayload } from '../dto/auth.dto';

export const generateAuthToken = async (payload: authPayload) => {
    return await jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export const verifyAuthToken = async (req: Request) => {
    const signature = req.get('Authorization');
    if (signature) {
        const decoded = await jwt.verify(signature.split(' ')[1], JWT_SECRET) as authPayload;

        req.user = decoded;
        return true;
    }
    return false;
}
