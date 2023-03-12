import express, { Request, Response, NextFunction } from 'express';
import { Vendor, IFood } from '../models';


export const fetchFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        const { pincode } = req.params;

        const foodAvailableForVendors = await Vendor.find({pincode, serviceAvailable: true}).sort({'rating': 1}).populate('foods');

        if (foodAvailableForVendors.length > 0) {
            return res.status(200).json({
                foodAvailableForVendors
            })
        }

        return res.status(404).json({
            message: "Food availability is not found",
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }
}

export const fetchTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        const { pincode } = req.params;

        const foodAvailableForVendors = await Vendor.find({pincode, serviceAvailable: true}).sort({'rating': 1}).populate('foods').limit(1);

        if (foodAvailableForVendors.length > 0) {
            return res.status(200).json({
                foodAvailableForVendors
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }

}

export const fetchFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        const { pincode } = req.params;

        const result = await Vendor.find({pincode, serviceAvailable: true}).populate('foods');

        if (result.length > 0) {

            let foodResult = [] as any;

            result.map(vendor => {
                const foods = vendor.foods as [IFood]

                foodResult.push(...foods.filter(food => food.readyTime <= 30))
            })

            return res.status(200).json({
                foodResult
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }

}

export const searchFoods = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        const { pincode } = req.params;

        const result = await Vendor.find({pincode, serviceAvailable: true}).populate('foods');

        if (result.length > 0) {

            let foodResult = [] as any;

            result.map(item => foodResult.push(...item.foods));

            return res.status(200).json({
                foodResult
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }
}

export const fetchRestaurants = async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        const { id } = req.params;

        const result = await Vendor.findById(id).populate('foods');

        if (result) {
            return res.status(200).json({
                result
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }

}