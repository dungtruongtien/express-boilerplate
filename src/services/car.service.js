/* eslint-disable max-len */
import _ from 'lodash';
import db from '../models';
import { ResourceNotFoundError } from '../components/ErrorInstance/businessErrors';

export default class CarService {

    static list(params) {
        const obj = _.omit(params, ['limit', 'offset']);
        const filterCondition = Object.keys(obj).map(key => ({ [key]: obj[key] }));
        const whereCondition = filterCondition.length > 0 ? { $or: [...filterCondition] } : undefined;
        return db.Car.findAll({
            include: [{
                model: db.Brand,
                as: 'brandInfo'
            },
            {
                model: db.Model,
                as: 'modelInfo'
            }],
            where: whereCondition,
            limit: params.limit,
            offset: params.offset
        }).then(cars => ({
            data: cars,
            count: cars.length
        }));
    }

    static retrive(id) {
        return db.Car.find({
            where: { id }
        }).then((car) => {
            if (!car) {
                throw new ResourceNotFoundError('car');
            }
            return car;
        });
    }
}
