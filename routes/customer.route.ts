import express from 'express';

import { signUp, signIn, verify, fetchProfile, editProfile, createOrder, fetchOrders, fetchAOrder, addToCart, getCart, removeCart, fetchAPI } from '../controllers'
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

router.post('/customer/cart', addToCart);

router.get('/customer/cart', getCart);

router.delete('/customer/cart', removeCart);

router.get('/customer/fetch-api/:id', fetchAPI)

export { router as customerRouter }