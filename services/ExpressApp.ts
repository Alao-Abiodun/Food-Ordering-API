import express, { Application } from 'express';
import path from 'path';
import morgan from 'morgan';


import { adminRouter, vendorRouter } from '../routes';

export default async (app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, 'images')));

    app.use(morgan('dev'));

    app.get('/', (req, res) => {
        res.json({ message: 'Hello World! from Food Order Backend' });
    })
    

    app.use('/api/v1', adminRouter);
    app.use('/api/v1', vendorRouter);

    return app;
}