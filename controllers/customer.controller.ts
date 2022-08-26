import express , { Request, Response, NextFunction} from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { createCustomerDTO, createCustomerLoginDTO, editCustomerProfile, orderInputDTO } from '../dto';
import { Customer, Food, Order } from '../models';
import { generateOtp, onRequestOtp, hashPassword, validatePassword, generateAuthToken } from '../util'
import axios from 'axios';

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

        const cartItems = [];

        let netAmount = 0.0;

        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

        let vendor_id;

        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vendor_id = food.vendor_id;
                    netAmount += (food.price * unit);
                    cartItems.push({food, unit})
                }
            })
        })

        if (cartItems) {

            const currentOrder = await Order.create({
                order_id: orderId,
                vendor_id: vendor_id,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: 'COD',
                paymentResponse: '',
                orderStatus: 'Waiting',
                remarks: '',
                delivery_id: '',
                appliedOffer: false,
                offerId: null,
                readyTime: 45
            })

                profile.cart = [] as any;
                profile.orders.push(currentOrder);
                await profile.save();

                return res.status(201).json(currentOrder);
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

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {

        const profile = await  Customer.findById( customer._id )

        let cartItems = [];

        const { _id, unit } = <orderInputDTO>req.body;

        const food = await Food.findById(_id);

        if (food) {

            if (profile !== null) {

                cartItems = profile.cart;

                console.log('CART-ITEM:', cartItems);

                if (cartItems.length > 0) {

                    let existingFoodItem = cartItems.filter((item) => item.food._id.toString() === _id);

                    console.log('EXISTING-ITEM:', existingFoodItem);

                    if (existingFoodItem.length > 0) {

                        const index = cartItems.indexOf(existingFoodItem[0]);

                        if (unit > 0) {

                            cartItems[index] = { food, unit };

                        } else {

                            cartItems.splice(index, 1);

                        }

                    } else {

                        cartItems.push({ food, unit });

                    }

                } else {

                    cartItems.push({ food, unit });

                }

                if (cartItems) {

                    profile.cart = cartItems as any
                    const result = await profile.save();
                    return res.status(201).json(result.cart);

                }
            }
        }
    }

    return res.status(400).json({ message: 'Unable to add to cart'});
}

export const getCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {

        const profile = await  Customer.findById( customer._id )

        if (profile !== null) {

            const customerCart = profile.cart;

            return res.status(200).json({
                cart: customerCart,
            })
        }
    }

    return res.status(400).json({message: 'Cart is empty!'})

}

export const removeCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if (customer) {

        const profile = await Customer.findById( customer._id );

        if (profile !== null) {
            profile.cart = [] as any;

            const customerCart = await profile.save();

            return res.status(200).json(customerCart);
        }
    }

    return res.status(400).json({message: 'Cart is already empty'});
}

export const fetchAPI = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const response = await axios({
        method: "get",
        url: `https://anapioficeandfire.com/api/books/${id}`,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
      });

      const {characters} = await response.data;
      for (const character of characters) {
        const responseB = await axios({
            method: "get",
            url: `${character}`,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
          });
          const { name } = await responseB.data;
        return res.status(200).json({
            name
          })
      }
    //   return res.status(200).json({
    //     numberOfCharacters: characters.length,
    //     characters,
    //   })
}