/* eslint-disable import/prefer-default-export */
import { BusinessErrors } from './ErrorInstance/businessErrors';

// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
    if (err instanceof BusinessErrors) {
        res.status(err.status).json({
            name: err.name,
            message: err.message
        });
        return;
    }
    res.status(err.status).json({ ...err });
}
