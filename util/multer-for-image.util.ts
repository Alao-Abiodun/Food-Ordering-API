import multer from 'multer';
import path from 'path';


   const imageStorage = multer.diskStorage({

        destination: (req, file, cb) => {
            cb(null, 'images');
        },

        filename: function(req, file, cb) {
            cb(null, new Date().toISOString()+ "_"+ file.originalname);
        }
    })


export const IMAGES = multer({storage: imageStorage}).array('images', 10);