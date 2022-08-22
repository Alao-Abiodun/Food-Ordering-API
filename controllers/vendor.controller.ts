import express, { Request, Response, NextFunction } from 'express';
import { findVendor } from '../controllers/admin.controller';
import { validatePassword, generateAuthToken } from '../util';
import { editVendorDTO } from '../dto';

export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { email, password } = req.body;
        const vendor = await findVendor('', email);

        if (vendor) {
            const validation = await validatePassword(password, vendor.password);

            const token = await generateAuthToken({
                _id: vendor._id,
                email: vendor.email,
                name: vendor.name,
            });

            if (validation) {
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

    const { name, address, phone, foodTypes } = <editVendorDTO>req.body;

    const user = req.user;

    try {
        if (user) {

            const vendor = await findVendor(user._id);

            vendor.name = name;
            vendor.address = address;
            vendor.phone = phone;
            vendor.foodTypes = foodTypes;

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

export const changeVendorServiceProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    try {

        if (user) {

            const vendor = await findVendor(user._id);

            vendor.serviceAvailable = !vendor.serviceAvailable;

            const updatedVendor = await vendor.save();

            return res.status(200).json({
                message: 'Vendor service profile updated successfully',
                vendor: updatedVendor
            });
        }
        return res.status(404).json({
            message: 'Vendor Not Found!'
        });
    } catch (err) {
        next(err);
    }
}