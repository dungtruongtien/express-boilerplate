import express from 'express';
import CarRoutes from './car.routes';
import BrandRoutes from './brand.routes';

const router = express.Router();

router.use('/cars', CarRoutes);
router.use('/brands', BrandRoutes);

export default router;
