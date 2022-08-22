import express, { Request, Response, NextFunction } from 'express';

import { createVendor, fetchVendors, fetchSingleVendor } from '../controllers';

const router = express.Router();

router.post('/vendor', createVendor);

router.get('/vendors', fetchVendors);

router.get('/vendor/:id', fetchSingleVendor);

export { router as adminRouter };