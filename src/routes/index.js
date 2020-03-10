import express from 'express';
import CarRoutes from './car.routes';
import BrandRoutes from './brand.routes';
import { errorMiddleware } from '../components/errors';

const router = express.Router();

router.use('/cars', CarRoutes);
router.use('/brands', BrandRoutes);

router.use(errorMiddleware);

export default router;
