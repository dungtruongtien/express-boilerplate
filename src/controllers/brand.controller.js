import BrandService from '../services/brand.service';

export default class BrandControlller {
    async list(req, res) {
        const cars = await BrandService.list(req.query);
        res.json(cars);
    }
}
