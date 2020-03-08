/* eslint-disable max-len */
import db from '../models';

export default class BrandService {

    static list(params) {
        const whereCondition = params.brand ? { id: { $in: [params.brand] } } : undefined;
        return db.Brand.findAll({
            include: [{
                model: db.Car,
                as: 'cars',
                include: [{
                    model: db.Model,
                    as: 'modelInfo'
                }],
                limit: params.limit,
                offset: params.offset
            }],
            where: whereCondition,
            limit: params.limit,
            offset: params.offset
        }).then(brands => ({
            data: brands,
            count: brands.length
        }));
    }
}
