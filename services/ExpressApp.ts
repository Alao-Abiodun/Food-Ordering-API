import express, { Application } from 'express';
import path from 'path';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';


import { adminRouter, vendorRouter, shoppingRouter, customerRouter } from '../routes';

export default async (app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, 'images')));

    app.use(morgan('dev'));

    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        useTempFiles : true,
        tempFileDir : '/tmp/'
      }));

    app.get('/', (req, res) => {
        res.json({ message: 'Hello World! from Food Ordering API' });
    })
    

    app.use('/api/v1', adminRouter);
    app.use('/api/v1', vendorRouter);
    app.use('/api/v1', shoppingRouter);
    app.use('/api/v1', customerRouter)

    return app;
}