import express from 'express';

import { signUp, signIn, verify, fetchProfile, editProfile } from '../controllers'
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/customer/signup', signUp);

router.post('/customer/login', signIn);

router.use(Authenticate)

router.patch('/customer/verify', verify);

router.get('/customer/profile', fetchProfile);

router.patch('/customer/profile/:id', editProfile);

export { router as customerRouter }