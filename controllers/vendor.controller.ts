import express, { Express, Request, Response, NextFunction } from 'express';
import { findVendor } from '../controllers/admin.controller';
import { validatePassword, generateAuthToken } from '../util';
import { editVendorDTO, createFoodDTO, loginVendorDTO } from '../dto';
import { Food, Order } from '../models'
import { uploadFile } from '../util/fileHandler';

export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { email, password } = <loginVendorDTO>req.body;
        const vendor = await findVendor('', email);

        if (vendor) {
            const validVendor = await validatePassword(password, vendor.password);

            const token = await generateAuthToken({
                _id: vendor._id,
                email: vendor.email,
                name: vendor.name,
            });

            if (validVendor) {
                return res.status(200).json({
                    message: 'Vendor logged in successfully',
                    token,
                    vendor
                });
            }

            return res.status(401).json({
                message: 'Invalid password'
            });
            
        }
        return res.status(404).json({
            message: 'Login Credentials Not valid'
        });
    } catch (error: any) {
        console.log(error.message)
        next(error);
    }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (user) {

            const vendor = await findVendor(user._id);

            return res.status(200).json({
                vendor
            });
        }

        return res.status(404).json({
            message: 'Vendor Not Found!'
        });
    } catch (error) {
        next(error);
    }
}

        

export const changeVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const { name, address, phone, foodType } = <editVendorDTO>req.body;

    const user = req.user;

    try {
        if (user) {

            const vendor = await findVendor(user._id);

            vendor.name = name;
            vendor.address = address;
            vendor.phone = phone;
            vendor.foodType = foodType;

            const updatedVendor = await vendor.save();

            return res.status(200).json({
                message: 'Vendor profile updated successfully',
                vendor: updatedVendor
            });
        }
        return res.status(404).json({
            message: 'Vendor Not Found!'
        });
    } catch (err) {
        next(err);
        console.log(err.message);
    }
};

export const updateVendorCoverImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        const {file} = req;

        console.log(file);


        // if (user) {

        //     const vendor = await findVendor(user._id);

        //     const resp = req.files;

        //     console.log(resp);

        //     // const files = req.files as [Express.Multer.File];

        //     // const images = files.map((file: Express.Multer.File) => file.filename);

        //     if (vendor !== null) {

        //         await Promise.all([
        //             vendor.coverImages.push(...images),
        //             vendor.save()
        //         ])

        //         return res.status(200).json({
        //             message: 'vendor cover images updated successfully',
        //             vendor
        //         })
        //     }
        // }

        // return res.status(404).json({
        //     message: 'Vendor Not Found!'
        // });
    } catch (error) {
        next(error);
        console.log(error.message);
    }
}

export const changeVendorServiceProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    try {

        if (user) {

            const vendor = await findVendor(user._id);

            await Promise.all([
                vendor.serviceAvailable = !vendor.serviceAvailable,
                await vendor.save()
            ])

            return res.status(200).json({
                message: 'Vendor service profile updated successfully',
                vendor
            });
        }
        return res.status(404).json({
            message: 'Vendor Not Found!'
        });
    } catch (err) {
        next(err);
    }
}

export const  addFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {

        const { name, description, category, foodType, readyTime, price } = <createFoodDTO>req.body;


        const vendor = await findVendor(user._id);

        if (vendor !== null) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            const food = await Food.create({
                vendor_id: vendor._id,
                name,
                description,
                category,
                foodType,
                readyTime,
                price,
                images: images,
                ratings: 0
            });

            await Promise.all([
                vendor.foods.push(food),
                vendor.save(),
            ])

            return res.status(200).json({
                message: 'Food added successfully',
                vendor
            });
        }

        return res.status(404).json({
            message: 'Vendor Not Found!'
        });
    }
}


export const fetchFood = async (req: Request, res: Response, next: NextFunction) => { 
    const user = req.user;

    try {
        if (user) {

            const foods = await Food.find({vendor_id: user._id});

            if (foods !== null) {
                return res.status(200).json({
                    foods
                });
            }

            return res.status(404).json({
                message: 'Food Information Not Found!'
            });
        }
    } catch (error) {
        next(error);
    }
}

export const fetchCurrentOrder = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    console.log("USER:",user);

    // if (user) {

    //     const orders = await Order.find({ vendor_id: user._id}).populate('items.food');

    //     if (orders !== null) {
    //         return res.status(200).json(orders)
    //     }

    // }

    // return res.status(400).json({message: 'Order Not Found!'})
}

export const processOrder = async (req: Request, res: Response, next: NextFunction) => {

    const  { id } = req.params;

    const { status, remarks, time } = req.body;

    if (id) {

        const order = await Order.findById(id).populate('items.food');

        order.orderStatus = status;
        order.remarks = remarks;
        if (time) {
            order.readyTime = time;
        }

        const orderResult = order.save();

        if (orderResult !== null) {
            
            return res.status(200).json(orderResult);

        }
    }

    return res.status(400).json({message: 'Unable to process order. Please try again'})

}

export const fetchOrderDetails = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    if (id) {

        const order = await Order.findById(id).populate('items.food');

        if (order !== null) {
            return res.status(200).json(order)
        }

    }

    return res.status(400).json({message: 'Order Not Found!'})

}