import express, { Request, Response, NextFunction } from 'express';
import {CreateVendorDTO} from '../dto';
import { Vendor } from '../models';
import { hashPassword } from '../util/password.util';

export const findVendor = (id: string | undefined, email?: string) => {
    if (email) {
        return Vendor.findOne({email: email});
    } else {
        return Vendor.findById(id);
    }
}

export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, ownerName, foodTypes, pincode, address, phone, email, password } = <CreateVendorDTO>req.body;
        
        const existingVendor = await findVendor('', email);
        if (existingVendor) {
            return res.status(409).json({
                message: 'Vendor already exists'
            });
        }

        // hash password
        const hashedPassword = await hashPassword(password);

        const vendor = await Vendor.create({
            name,
            ownerName,
            foodTypes,
            pincode,
            address,
            phone,
            email,
            password: hashedPassword,
            serviceAvailable: false,
            coverImages: [],
            rating: 0,
            foods: []
        });
    
        res.status(201).json({
            message: 'Vendor created successfully',
            vendor
        });
    } catch (error) {
        next(error);
    }
}

export const fetchVendors = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const vendors = await Vendor.find();

    if (vendors.length !== 0) {
        return res.status(200).json({
            message: 'Vendors found successfully',
            vendors
        });
    }

    return res.status(404).json({
        message: 'Vendors Not Available at the moment'
    });
    } catch (error) {
        next(error);
    }
}

export const fetchSingleVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await findVendor(req.params.id);

        if (vendor) {
           return res.status(200).json({
                message: 'Vendor found successfully',
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