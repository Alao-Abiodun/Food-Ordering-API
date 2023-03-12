import { Request, Response, NextFunction } from 'express';
import { authPayload } from "../dto/auth.dto";
import { verifyAuthToken } from "../util";


declare global {
    namespace Express {
        export interface Request {
            user?: authPayload;
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = await verifyAuthToken(req);

        console.log(`Authenticate: ${validate}`);

    if (validate) {
        next();
    }

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
       console.log(error.message); 
    }
}
