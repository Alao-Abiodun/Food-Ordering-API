import express, {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { MONGO_URI, PORT } from './configs';

import { adminRouter, vendorRouter } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World! from Food Order Backend' });
})

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/vendor', vendorRouter);

mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
})

app.listen(PORT, () => {
    console.clear();
    console.log(`Server is running on port ${PORT}`);
}
);