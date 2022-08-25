import express , { Request, Response, NextFunction} from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { createCustomerDTO, createCustomerLoginDTO, editCustomerProfile, orderInputDTO } from '../dto';
import { Customer, Food, Order } from '../models';
import { generateOtp, onRequestOtp, hashPassword, validatePassword, generateAuthToken } from '../util'

export const signUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(createCustomerDTO, req.body);

    const inputErrors = await validate(customerInputs, {validationError: { target: true}});

    if (inputErrors.length > 0) {
        return res.status(400).json({message: inputErrors[0].constraints.isLength});
    }

    const { email, phone, password} = customerInputs;

    // hash the password
    const hashedPassword = await hashPassword(password);

    // invoke otp function
    const { otp, otp_expiry } =  await generateOtp();

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
        // await onRequestOtp(otp, phone);

        // generate a token
        const signature = await generateAuthToken({
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
        message: 'Error occur while create a new customer'
    })

}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(createCustomerLoginDTO, req.body);

    const inputErrors = await validate(customerInputs, {validationError: { target: true}});

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, password} = customerInputs;

    const customer = await Customer.findOne({email});

    if (customer) {

        const isPasswordCorrect = await validatePassword(password, customer.password);

        if (isPasswordCorrect) {

            const signature = await generateAuthToken({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })

            return res.status(200).json({
                signature,
                email: customer.email,
                verified: customer.verified
            })
        }
    }

    return res.status(400).json({message: 'Unable to verify customer'});

}

export const verify = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;

    const customer = req.user;

    if (customer) {
        const profile = await  Customer.findById( customer._id );

        if (profile) {
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;

                const updatedCustomerDetails = await profile.save();

                const signature = await generateAuthToken({
                    _id: updatedCustomerDetails._id,
                    email: updatedCustomerDetails.email,
                    verified: updatedCustomerDetails.verified
                })

                return res.status(200).json({
                    signature,
                    email: updatedCustomerDetails.email,
                    verified: updatedCustomerDetails.verified
                })
            }
        }
    }

    return res.status(400).json({message: 'Unable to verify customer'});
}


export const fetchProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {

        const profile = await  Customer.findById( customer._id );

        return res.status(200).json({
            message: 'Customer profile fetch successfully',
            profile
        })
    }

    return res.status(400).json({message: 'Unable to verify customer'});
}

export const editProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    const { firstName, lastName, address } = <editCustomerProfile>req.body;

    if (customer) {
        
        const profile = await Customer.findById(customer._id)

        if (profile) {

            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const updatedCustomerProfile = await profile.save();

            return res.status(200).json({
                message: 'customer profile updated successfully',
                updatedCustomerProfile
            })
        }
    }
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const customer = req.user;

    if (customer) {

        const orderId = Math.floor((Math.random() * 899999) + 1000);

        const profile = await Customer.findById( customer._id )

        const cart = <[orderInputDTO]>req.body;

        const cartItems = Array();

        let netAmount = 0.0;

        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

        foods.map(food => {

            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    netAmount += (food.price * unit);
                    cartItems.push({food, unit})
                }
            })
        })

        if (cartItems) {

            const currentOrder = await Order.create({
                order_id: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: 'COD',
                paymentResponse: '',
                orderStatus: 'Waiting'
            })

            if (currentOrder) {

                profile.orders.push(currentOrder);
                await profile.save();

                return res.status(201).json(currentOrder);
            }
        }

    }

    return res.status(400).json({message: 'Error while create an order'});
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

export const fetchOrders = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {

        const orders = await Customer.findById( customer._id ).populate('orders');

        if (orders) {

            return res.status(200).json({
                message: 'Fetch Orders',
                orders
            })
        }
    }

    return res.send(400).json({message: 'Error while fetching Orders'});
}

export const fetchAOrder = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    const { id } = req.params;

    if (customer) {

        const orders = await Order.findById(id).populate('items.food');

        return res.status(200).json({ orders })
    }
}