import express, { Request, Response, NextFunction } from 'express';
import { login, getProfile, changeVendorProfile, changeVendorServiceProfile } from '../controllers'
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/login', login)


router.get('/profile', Authenticate,getProfile);

router.put('/profile/:id', Authenticate, changeVendorProfile);

router.patch('/profile/service/:id', Authenticate, changeVendorServiceProfile);

export { router as vendorRouter };