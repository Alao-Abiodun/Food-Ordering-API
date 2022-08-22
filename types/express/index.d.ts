import 'express';
import { authPayload } from '../../dto/auth.dto';

declare module 'express' {
    interface Request {
        user?: authPayload;
    }
}