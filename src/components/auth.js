import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from './ErrorInstance/businessErrors';

export function permitRole(...allowed) {
    return (req, res, next) => {
        const userData = res.locals.user;
        const isAllowed = role => allowed.indexOf(role) > -1;
        const allow = userData.account.roles ? userData.account.roles
            .find((key) => isAllowed(key)) : undefined;
        if (!allow) {
            throw new AuthorizationError('Your Role is not allowed');
        }
        next();
    };
}

export function verifyJWT(jwtSecrect) {
    return (req, res, next) => {
        if (res.locals.user) {
            return next();
        }
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        jwt.verify(token, jwtSecrect, (err, decoded) => {
            if (err) {
                throw new AuthenticationError(err);
            }
            const userData = {
                account: decoded.account,
                staff: decoded.staff ? decoded.staff : null
            };
            if (!userData || !userData.account.id) {
                throw new AuthorizationError('Invalid Data for authorization');
            }
            res.locals.user = userData; //eslint-disable-line
            next();
        });
    };
}

export function permitAction(...allowed) {
    return (req, res, next) => {
        const isAllowed = role => allowed.indexOf(role) > -1;
        const userData = res.locals.user;
        const allow = userData.roles ? Object.entries(userData.roles)
            .find(e => e[1].find((act) => isAllowed(act)) !== undefined) : undefined;
        if (!allow) {
            throw new AuthorizationError('Your Role Action is not allowed');
        }
        next();
    };
}
