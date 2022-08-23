import express , { Request, Response, NextFunction} from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { createCustomerDTO } from '../dto';
import { Customer } from '../models';
import { generateOtp, onRequestOtp, hashPassword, generateAuthToken } from '../util'

export const signUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(createCustomerDTO, req.body);

    const inputErrors = await validate(customerInputs, {validationError: { target: true}});

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password} = customerInputs;

    // hash the password
    const hashedPassword = await hashPassword(password);

    // invoke otp function
    const { otp, otp_expiry } =  generateOtp();

    const result = await Customer.create({
        email: email,
        password: hashedPassword,
        phone,
        otp,
        otp_expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
    })

    if (result) {

        // send user otp
        await onRequestOtp(otp, phone);

        // generate a token
        const signature = generateAuthToken({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })

        return res.status(201).json({
            token: signature,
            result
        })

    }

    return res.status(401).json({
        message: 'Data is Created'
    })

}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {


}

export const verify = async (req: Request, res: Response, next: NextFunction) => {

}


export const fetchProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const editProfile = async (req: Request, res: Response, next: NextFunction) => {

}