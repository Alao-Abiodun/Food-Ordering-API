import express, { Request, Response, NextFunction } from 'express';
import { login, getProfile, changeVendorProfile, changeVendorServiceProfile, addFood, fetchFood } from '../controllers'
import { Authenticate } from '../middlewares';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, 'images')
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString()+'_'+file.originalname);
    }
})

const images = multer({ storage: storage});

const router = express.Router();

router.post('/login', login)


router.get('/profile', Authenticate,getProfile);

router.put('/profile/:id', Authenticate, changeVendorProfile);

router.patch('/profile/service/:id', Authenticate, changeVendorServiceProfile);

router.post('/food', Authenticate, images.array('images', 11), addFood);
router.get('/foods', Authenticate, fetchFood)

export { router as vendorRouter };