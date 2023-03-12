import express, { Request, Response, NextFunction } from 'express';
import { login, getProfile, changeVendorProfile, updateVendorCoverImages, changeVendorServiceProfile, addFood, fetchFood, fetchCurrentOrder, processOrder, fetchOrderDetails} from '../controllers'
import { Authenticate } from '../middlewares';
import multer from 'multer';

const router = express.Router(); 

const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, 'images')
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString()+'_'+file.originalname);
    }
})

const images = multer({ storage: storage}).array('images', 10);

router.post('/login', login)


router.get('/profile', Authenticate,getProfile);

router.put('/profile/:id', Authenticate, changeVendorProfile);

router.patch('/profile/coverimage/:id', Authenticate,  images, updateVendorCoverImages);

router.patch('/profile/service/:id', Authenticate, changeVendorServiceProfile);

router.post('/food', Authenticate, images, addFood);
router.get('/foods', Authenticate, fetchFood)

// order

router.get('/orders', fetchCurrentOrder);
router.put('/order/:id/process', processOrder);
router.get('/order/:id', fetchOrderDetails)

export { router as vendorRouter };