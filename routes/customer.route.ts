import express from 'express';

import { signUp, signIn, verify, fetchProfile, editProfile, createOrder, fetchOrders, fetchAOrder } from '../controllers'
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/customer/signup', signUp);

router.post('/customer/login', signIn);

router.use(Authenticate)

router.patch('/customer/verify', verify);

router.get('/customer/profile', fetchProfile);

router.patch('/customer/profile/:id', editProfile);

// Order
/**********  CREATE ORDER  */
router.post('/customer/order', createOrder);

router.get('/customer/orders', fetchOrders);

router.get('/customer/order/:id', fetchAOrder);

export { router as customerRouter }