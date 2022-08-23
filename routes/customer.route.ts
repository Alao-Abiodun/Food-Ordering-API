import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/user/signup');

router.post('/user/login');

router.get('/user/verify');

router.get('user/profile');

router.get('/profile/:id')

export { router as customerRouter }