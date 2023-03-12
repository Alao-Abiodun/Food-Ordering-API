import { fetchFoodAvailability, fetchTopRestaurants, fetchFoodIn30Min, searchFoods, fetchRestaurants } from '../controllers';

import express from 'express';

const router = express.Router();

router.get('/:pincode', fetchFoodAvailability);

router.get('/top-restaurants/:pincode', fetchTopRestaurants);

router.get('/food-in-30-mins/:pincode', fetchFoodIn30Min);

router.get('/search/:pincode', searchFoods);

router.get('/restaurants/:id', fetchRestaurants);

export { router as shoppingRouter}